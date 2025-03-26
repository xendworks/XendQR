<template>
  <div class="max-w-lg mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold text-gray-900 text-center mb-6">QR Code Scanner</h1>
    
    <div v-if="!isAuthenticated" class="bg-white rounded-lg shadow-md p-6">
      <AdminLogin @success="onAdminLogin" />
    </div>
    
    <div v-else class="space-y-6">
      <!-- Scanner Container -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-medium text-gray-900">Scan Attendee QR</h2>
          <div class="text-sm text-gray-600">
            Admin: {{ adminName }}
          </div>
        </div>
        
        <QrCodeScanner
          ref="scannerRef"
          size="lg"
          @scan="onQrScanned"
          @error="scannerError = $event"
        />
        
        <div v-if="scannerError" class="mt-4 p-3 bg-red-50 rounded-md text-red-600 text-sm">
          {{ scannerError }}
        </div>
      </div>
      
      <!-- Last Scan Result -->
      <div v-if="lastScanResult" class="bg-white rounded-lg shadow-md p-6">
        <div class="flex items-start">
          <!-- Attendee info -->
          <div class="flex-1">
            <div class="flex items-center">
              <div class="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-medium">
                {{ getInitials(lastScanResult.name) }}
              </div>
              <div class="ml-4">
                <h3 class="text-lg font-medium text-gray-900">{{ lastScanResult.name }}</h3>
                <p class="text-sm text-gray-500">{{ lastScanResult.email }}</p>
              </div>
            </div>
            
            <div class="mt-4">
              <div class="text-sm text-gray-500">
                Registration ID: <span class="font-medium">{{ lastScanResult.registrationId }}</span>
              </div>
              <div class="mt-2">
                <span 
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="lastScanResult.checkInStatus ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'"
                >
                  {{ lastScanResult.checkInStatus ? 'Already Checked In' : 'Not Checked In' }}
                </span>
                <span v-if="lastScanResult.checkInTime" class="ml-2 text-xs text-gray-500">
                  at {{ formatDateTime(lastScanResult.checkInTime) }}
                </span>
              </div>
            </div>
          </div>
          
          <!-- Scan status -->
          <div class="ml-4">
            <div 
              class="h-12 w-12 rounded-full flex items-center justify-center"
              :class="[
                lastScanResult.isValid 
                  ? (lastScanResult.checkInStatus ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600') 
                  : 'bg-red-100 text-red-600'
              ]"
            >
              <svg v-if="lastScanResult.isValid && !lastScanResult.checkInStatus" class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <svg v-else-if="lastScanResult.isValid && lastScanResult.checkInStatus" class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <svg v-else class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
        </div>
        
        <div class="mt-4 text-sm" :class="lastScanResult.isValid ? 'text-gray-700' : 'text-red-600'">
          {{ lastScanResult.message }}
        </div>
        
        <div v-if="lastScanResult.isValid" class="mt-4">
          <button 
            v-if="!lastScanResult.checkInStatus"
            @click="checkInAttendee(lastScanResult)"
            class="btn btn-primary w-full"
            :disabled="isProcessing"
          >
            <span v-if="isProcessing" class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
            <span v-else>Check In Attendee</span>
          </button>
          
          <button 
            v-else
            @click="undoCheckIn(lastScanResult)"
            class="btn btn-secondary w-full"
            :disabled="isProcessing"
          >
            <span v-if="isProcessing" class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
            <span v-else>Undo Check In</span>
          </button>
        </div>
      </div>
      
      <!-- Recent Check-ins -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-lg font-medium text-gray-900 mb-4">Recent Check-ins</h2>
        
        <div v-if="recentCheckins.length === 0" class="text-center py-4 text-gray-500">
          No recent check-ins
        </div>
        <ul v-else class="divide-y divide-gray-200">
          <li v-for="checkin in recentCheckins" :key="checkin.id" class="py-3">
            <div class="flex items-center">
              <div class="h-8 w-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-medium text-xs">
                {{ getInitials(checkin.name) }}
              </div>
              <div class="ml-3 flex-1">
                <p class="text-sm font-medium text-gray-900">{{ checkin.name }}</p>
                <p class="text-xs text-gray-500">
                  Checked in at {{ formatTime(checkin.checkInTime) }}
                </p>
              </div>
              <div>
                <button 
                  @click="undoCheckIn(checkin)"
                  class="text-xs text-indigo-600 hover:text-indigo-500"
                  :disabled="isProcessing"
                >
                  Undo
                </button>
              </div>
            </div>
          </li>
        </ul>
        
        <div v-if="recentCheckins.length > 0" class="mt-4 text-center">
          <button 
            @click="showAllAttendees"
            class="text-sm text-indigo-600 hover:text-indigo-500"
          >
            View All Attendees
          </button>
        </div>
      </div>
      
      <!-- Admin actions -->
      <div class="flex justify-between">
        <button 
          @click="toggleScanner"
          class="btn"
          :class="isScannerActive ? 'btn-secondary' : 'btn-primary'"
        >
          {{ isScannerActive ? 'Pause Scanner' : 'Resume Scanner' }}
        </button>
        
        <button 
          @click="logout"
          class="btn btn-secondary"
        >
          Sign Out
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { initializeFirebase, handleFirebaseError } from '~/firebase'
import AdminLogin from '~/components/AdminLogin.vue'
import QrCodeScanner from '~/components/QrCodeScanner.vue'

// Router
const router = useRouter()

// Component state
const isAuthenticated = ref(false)
const adminData = ref(null)
const scannerRef = ref(null)
const scannerError = ref('')
const lastScanResult = ref(null)
const isProcessing = ref(false)
const isScannerActive = ref(true)
const recentCheckins = ref([])

// Computed properties
const adminName = computed(() => {
  if (!adminData.value) return ''
  return adminData.value.name || adminData.value.email || 'Admin'
})

// Firebase instance
const { auth, db } = initializeFirebase()

// Handle admin login
const onAdminLogin = (data) => {
  isAuthenticated.value = true
  adminData.value = data.adminData
  
  // Fetch recent check-ins after login
  fetchRecentCheckins()
}

// Process QR code scan
const onQrScanned = async (qrData) => {
  try {
    if (!isScannerActive.value) return
    
    // Pause scanner temporarily
    if (scannerRef.value) {
      scannerRef.value.pauseScanning(1500)
    }
    
    // Play scan sound
    new Audio('/sounds/scan-beep.mp3').play().catch(() => {})
    
    // Parse QR data
    let attendeeData
    try {
      attendeeData = JSON.parse(qrData)
    } catch (error) {
      lastScanResult.value = {
        isValid: false,
        message: 'Invalid QR code format',
        data: qrData
      }
      return
    }
    
    // Validate required fields
    if (!attendeeData.regId) {
      lastScanResult.value = {
        isValid: false,
        message: 'Missing registration ID in QR code',
        data: attendeeData
      }
      return
    }
    
    // Look up attendee in database
    const { collection, query, where, getDocs } = await import('firebase/firestore')
    
    const attendeesQuery = query(
      collection(db, 'users'),
      where('registrationId', '==', attendeeData.regId)
    )
    
    const querySnapshot = await getDocs(attendeesQuery)
    
    if (querySnapshot.empty) {
      lastScanResult.value = {
        isValid: false,
        message: `No registration found with ID: ${attendeeData.regId}`,
        registrationId: attendeeData.regId,
        data: attendeeData
      }
      return
    }
    
    // Get attendee data
    const doc = querySnapshot.docs[0]
    const attendee = doc.data()
    
    // Check verification status
    if (!attendee.isVerified) {
      lastScanResult.value = {
        isValid: false,
        message: 'Registration not verified. Please complete verification process.',
        name: attendee.name || 'Unknown',
        email: attendee.email || '',
        registrationId: attendee.registrationId || '',
        data: attendeeData
      }
      return
    }
    
    // Format result
    lastScanResult.value = {
      isValid: true,
      id: doc.id,
      name: attendee.name || 'Unknown',
      email: attendee.email || '',
      phone: attendee.phone || '',
      registrationId: attendee.registrationId || '',
      checkInStatus: attendee.checkInStatus || false,
      checkInTime: attendee.checkInTime?.toDate() || null,
      message: attendee.checkInStatus 
        ? 'Attendee already checked in' 
        : 'Attendee verified. Ready to check in.',
      data: attendeeData
    }
    
    // If auto check-in is enabled and not already checked in
    if (!lastScanResult.value.checkInStatus) {
      await checkInAttendee(lastScanResult.value)
    }
    
  } catch (error) {
    console.error('QR scan error:', error)
    scannerError.value = handleFirebaseError(error)
  }
}

// Check in an attendee
const checkInAttendee = async (attendee) => {
  try {
    isProcessing.value = true
    
    const { doc, updateDoc, serverTimestamp } = await import('firebase/firestore')
    
    // Update check-in status in database
    await updateDoc(doc(db, 'users', attendee.id), {
      checkInStatus: true,
      checkInTime: serverTimestamp(),
      checkedInBy: {
        adminId: auth.currentUser.uid,
        adminName: adminName.value,
        timestamp: serverTimestamp()
      }
    })
    
    // Update local state
    attendee.checkInStatus = true
    attendee.checkInTime = new Date()
    attendee.message = 'Attendee successfully checked in!'
    
    // Play success sound
    new Audio('/sounds/success.mp3').play().catch(() => {})
    
    // Refresh recent check-ins
    fetchRecentCheckins()
    
    // Update lastScanResult if this is the current scan
    if (lastScanResult.value && lastScanResult.value.id === attendee.id) {
      lastScanResult.value = { ...attendee }
    }
    
  } catch (error) {
    console.error('Check-in error:', error)
    scannerError.value = handleFirebaseError(error)
  } finally {
    isProcessing.value = false
  }
}

// Undo check-in
const undoCheckIn = async (attendee) => {
  try {
    isProcessing.value = true
    
    const { doc, updateDoc } = await import('firebase/firestore')
    
    // Update check-in status in database
    await updateDoc(doc(db, 'users', attendee.id), {
      checkInStatus: false,
      checkInTime: null,
      checkedInBy: null
    })
    
    // Update local state
    attendee.checkInStatus = false
    attendee.checkInTime = null
    attendee.message = 'Check-in has been undone. Ready to check in again.'
    
    // Refresh recent check-ins
    fetchRecentCheckins()
    
    // Update lastScanResult if this is the current scan
    if (lastScanResult.value && lastScanResult.value.id === attendee.id) {
      lastScanResult.value = { ...attendee }
    }
    
  } catch (error) {
    console.error('Undo check-in error:', error)
    scannerError.value = handleFirebaseError(error)
  } finally {
    isProcessing.value = false
  }
}

// Fetch recent check-ins
const fetchRecentCheckins = async () => {
  try {
    const { collection, query, where, orderBy, limit, getDocs } = await import('firebase/firestore')
    
    const checkinsQuery = query(
      collection(db, 'users'),
      where('checkInStatus', '==', true),
      orderBy('checkInTime', 'desc'),
      limit(10)
    )
    
    const querySnapshot = await getDocs(checkinsQuery)
    
    // Map documents to checkins array
    const checkinsList = []
    querySnapshot.forEach(doc => {
      const data = doc.data()
      
      checkinsList.push({
        id: doc.id,
        name: data.name || 'Unknown',
        email: data.email || '',
        registrationId: data.registrationId || '',
        checkInTime: data.checkInTime?.toDate() || new Date(),
        checkedInBy: data.checkedInBy || null
      })
    })
    
    recentCheckins.value = checkinsList
  } catch (error) {
    console.error('Error fetching recent check-ins:', error)
    scannerError.value = 'Failed to fetch recent check-ins'
  }
}

// Toggle scanner
const toggleScanner = () => {
  isScannerActive.value = !isScannerActive.value
  
  if (isScannerActive.value) {
    scannerRef.value?.startScanner()
  } else {
    scannerRef.value?.stopScanner()
  }
}

// Show all attendees
const showAllAttendees = () => {
  router.push('/admin/attendees')
}

// Sign out
const logout = async () => {
  try {
    const { signOut } = await import('firebase/auth')
    await signOut(auth)
    
    isAuthenticated.value = false
    adminData.value = null
    lastScanResult.value = null
    recentCheckins.value = []
    
  } catch (error) {
    console.error('Logout error:', error)
    scannerError.value = handleFirebaseError(error)
  }
}

// Helper functions
const getInitials = (name) => {
  if (!name) return '?'
  
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

const formatTime = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const formatDateTime = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleString([], { 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit', 
    minute: '2-digit'
  })
}

// Check authentication on mount
onMounted(() => {
  import('firebase/auth').then(({ onAuthStateChanged }) => {
  
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      // Check if user is an admin
      const { getDoc, doc } = await import('firebase/firestore')
      const adminDoc = await getDoc(doc(db, 'admins', user.uid))
      
      if (adminDoc.exists()) {
        isAuthenticated.value = true
        adminData.value = adminDoc.data()
        
        // Fetch recent check-ins
        fetchRecentCheckins()
      }
    }
  })
})
})
</script>