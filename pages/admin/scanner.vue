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
                  {{ lastScanResult.checkInStatus ? 'Checked In' : 'Not Checked In' }}
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
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-medium text-gray-900">Recent Check-ins</h2>
          <button 
            @click="fetchRecentCheckins" 
            class="text-sm text-indigo-600 hover:text-indigo-500 flex items-center"
            :disabled="isProcessing"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
        
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
import { useAuth } from '~/composables/useAuth'
import AdminLogin from '~/components/AdminLogin.vue'
import QrCodeScanner from '~/components/QrCodeScanner.vue'

// Router
const router = useRouter()

// Auth composable
const { user, isAuthenticated, isAdmin, isLoading, logout } = useAuth()

// Component state
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
      scannerRef.value.pauseScanner(1500)
    }
    
    // Play scan sound
    new Audio('/sounds/scan-beep.mp3').play().catch(() => {})
    
    // Parse QR data
    let attendeeData;
    let registrationId;
    
    try {
      // First, try to parse as JSON
      attendeeData = JSON.parse(qrData);
      
      // Check for ID field (most priority)
      if (attendeeData.id) {
        registrationId = attendeeData.id;
      } 
      // Check if it has regId field
      else if (attendeeData.regId) {
        registrationId = attendeeData.regId;
      } 
      // Check for registrationId field
      else if (attendeeData.registrationId) {
        registrationId = attendeeData.registrationId;
      } 
      // If the JSON itself is a string, use that
      else if (typeof attendeeData === 'string') {
        registrationId = attendeeData.trim();
      }
      else {
        // No registration ID found in the JSON
        throw new Error('No registration ID found in QR data');
      }
    } catch (error) {
      // If JSON parsing fails, try using the raw string as registration ID
      console.log('QR data is not valid JSON, trying as plain text:', qrData);
      if (qrData && typeof qrData === 'string' && qrData.trim()) {
        registrationId = qrData.trim();
        attendeeData = { id: registrationId };
      } else {
        lastScanResult.value = {
          isValid: false,
          message: 'Invalid QR code format',
          data: qrData
        };
        return;
      }
    }
    
    // Log what we found
    console.log('Using registration ID:', registrationId);
    
    // Validate registration ID
    if (!registrationId) {
      lastScanResult.value = {
        isValid: false,
        message: 'Missing registration ID in QR code',
        data: attendeeData
      };
      return;
    }
    
    // If registrationId is a complex object (which can happen when the entire JSON is used), 
    // convert to string for error display purposes only
    const displayRegId = typeof registrationId === 'object' 
      ? JSON.stringify(registrationId) 
      : registrationId;
    
    // Look up attendee in database
    const { collection, query, where, getDocs, doc, getDoc } = await import('firebase/firestore');
    
    // Log the registration ID being searched
    console.log('Searching for registration ID:', registrationId);
    
    // First try the users collection
    let querySnapshot = await getDocs(query(
      collection(db, 'users'),
      where('registrationId', '==', registrationId)
    ));
    console.log('Users collection query results:', querySnapshot.size);
    
    // If not found in users, try the document in attendees collection
    if (querySnapshot.empty) {
      console.log('Not found in users collection, trying attendees collection...');
      
      // Try looking up directly in attendees collection by document ID
      try {
        const docRef = doc(db, 'attendees', registrationId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          console.log('Found document in attendees collection:', docSnap.id);
          const attendee = docSnap.data();
          
          // Format result for direct document lookup
          lastScanResult.value = {
            isValid: true,
            id: docSnap.id,
            name: attendee.fullName || attendee.firstName + ' ' + attendee.lastName || 'Unknown',
            email: attendee.email || '',
            phone: attendee.phone || '',
            registrationId: registrationId,
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
          
          return;
        } else {
          console.log('Document not found in attendees collection either');
          
          // Also try querying attendees collection by registrationId field
          querySnapshot = await getDocs(query(
            collection(db, 'attendees'),
            where('registrationId', '==', registrationId)
          ));
          console.log('Attendees collection query results:', querySnapshot.size);
          
          // If found by query, continue with that result
          if (querySnapshot.size > 0) {
            console.log('Found in attendees collection by registrationId field');
          } else {
            // Not found in either collection
            lastScanResult.value = {
              isValid: false,
              message: `No registration found with ID: ${displayRegId}`,
              registrationId: displayRegId,
              data: attendeeData
            }
            return;
          }
        }
      } catch (docError) {
        console.error('Error trying to fetch document from attendees collection:', docError);
        
        // Try the users collection document ID approach as a last resort
        try {
          const docRef = doc(db, 'users', registrationId);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            const attendee = docSnap.data();
            
            // Check verification status
            if (!attendee.isVerified) {
              lastScanResult.value = {
                isValid: false,
                message: 'Registration not verified. Please complete verification process.',
                name: attendee.name || 'Unknown',
                email: attendee.email || '',
                registrationId: registrationId,
                data: attendeeData
              }
              return
            }
            
            // Format result for direct document lookup
            lastScanResult.value = {
              isValid: true,
              id: docSnap.id,
              name: attendee.name || 'Unknown',
              email: attendee.email || '',
              phone: attendee.phone || '',
              registrationId: registrationId,
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
            
            return;
          }
        } catch (userDocError) {
          console.error('Error trying to fetch document from users collection:', userDocError);
        }
        
        // If we get here, no document was found
        lastScanResult.value = {
          isValid: false,
          message: `No registration found with ID: ${displayRegId}`,
          registrationId: displayRegId,
          data: attendeeData
        }
        return;
      }
    }
    
    // Get attendee data from the query results
    const docSnapshot = querySnapshot.docs[0];
    const attendee = docSnapshot.data();
    
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
      id: docSnapshot.id,
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
    
    const { doc, updateDoc, serverTimestamp, getDoc } = await import('firebase/firestore')
    
    // Determine which collection the attendee is from
    const collectionName = attendee.id.startsWith('XC-') ? 'attendees' : 'users';
    console.log(`Checking in attendee in ${collectionName} collection:`, attendee.id);
    
    // Create document reference
    const docRef = doc(db, collectionName, attendee.id);
    
    // Update check-in status in database
    await updateDoc(docRef, {
      checkInStatus: true,
      checkInTime: serverTimestamp(),
      checkedInBy: {
        adminId: auth.currentUser.uid,
        adminName: adminName.value,
        timestamp: serverTimestamp()
      }
    })
    
    console.log(`Updated check-in status for ${attendee.id} to true`);
    
    // Verify the update was successful
    try {
      const updatedDoc = await getDoc(docRef);
      const updatedData = updatedDoc.data();
      console.log('Document after update:', {
        id: updatedDoc.id,
        checkInStatus: updatedData.checkInStatus,
        checkInTime: updatedData.checkInTime,
        checkedInBy: updatedData.checkedInBy
      });
    } catch (verifyError) {
      console.error('Error verifying update:', verifyError);
    }
    
    // Update local state
    attendee.checkInStatus = true
    attendee.checkInTime = new Date()
    attendee.message = 'Attendee successfully checked in!'
    
    // Play success sound
    new Audio('/sounds/success.mp3').play().catch(() => {})
    
    // Refresh recent check-ins
    console.log('Refreshing recent check-ins list after check-in...');
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
    
    // Determine which collection the attendee is from
    const collectionName = attendee.id.startsWith('XC-') ? 'attendees' : 'users';
    console.log(`Undoing check-in in ${collectionName} collection:`, attendee.id);
    
    // Update check-in status in database
    await updateDoc(doc(db, collectionName, attendee.id), {
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
    console.log('Starting to fetch recent check-ins...');
    const { collection, query, where, orderBy, limit, getDocs } = await import('firebase/firestore')
    
    // Get recent check-ins from users collection
    const usersCheckinsQuery = query(
      collection(db, 'users'),
      where('checkInStatus', '==', true),
      orderBy('checkInTime', 'desc'),
      limit(10)
    )
    
    console.log('Executing users collection query...');
    let usersSnapshot;
    try {
      usersSnapshot = await getDocs(usersCheckinsQuery)
      console.log('Recent check-ins from users collection:', usersSnapshot.size);
    } catch (userQueryError) {
      console.error('Error querying users collection:', userQueryError);
      
      // If we got a missing index error, try a simpler query
      if (userQueryError.code === 'failed-precondition') {
        console.log('Attempting simpler query without orderBy for users...');
        const simpleUsersQuery = query(
          collection(db, 'users'),
          where('checkInStatus', '==', true),
          limit(10)
        );
        usersSnapshot = await getDocs(simpleUsersQuery);
        console.log('Simple users query returned:', usersSnapshot.size, 'documents');
      } else {
        // Re-throw if it's not a missing index error
        throw userQueryError;
      }
    }
    
    // Get recent check-ins from attendees collection
    const attendeesCheckinsQuery = query(
      collection(db, 'attendees'),
      where('checkInStatus', '==', true),
      orderBy('checkInTime', 'desc'),
      limit(10)
    )
    
    console.log('Executing attendees collection query...');
    let attendeesSnapshot;
    try {
      attendeesSnapshot = await getDocs(attendeesCheckinsQuery)
      console.log('Recent check-ins from attendees collection:', attendeesSnapshot.size);
    } catch (attendeesQueryError) {
      console.error('Error querying attendees collection:', attendeesQueryError);
      
      // If we got a missing index error, try a simpler query
      if (attendeesQueryError.code === 'failed-precondition') {
        console.log('Attempting simpler query without orderBy for attendees...');
        const simpleAttendeesQuery = query(
          collection(db, 'attendees'),
          where('checkInStatus', '==', true),
          limit(10)
        );
        attendeesSnapshot = await getDocs(simpleAttendeesQuery);
        console.log('Simple attendees query returned:', attendeesSnapshot.size, 'documents');
      } else {
        // Re-throw if it's not a missing index error
        throw attendeesQueryError;
      }
    }
    
    // Combine check-ins from both collections
    const checkinsList = []
    
    // Add users check-ins
    usersSnapshot.forEach(docItem => {
      const data = docItem.data()
      console.log('User check-in found:', docItem.id, data.name);
      
      checkinsList.push({
        id: docItem.id,
        name: data.name || 'Unknown',
        email: data.email || '',
        registrationId: data.registrationId || '',
        checkInTime: data.checkInTime?.toDate() || new Date(),
        checkedInBy: data.checkedInBy || null,
        collection: 'users'
      })
    })
    
    // Add attendees check-ins
    attendeesSnapshot.forEach(docItem => {
      const data = docItem.data()
      console.log('Attendee check-in found:', docItem.id, data.fullName || (data.firstName + ' ' + data.lastName));
      
      checkinsList.push({
        id: docItem.id,
        name: data.fullName || (data.firstName + ' ' + data.lastName) || 'Unknown',
        email: data.email || '',
        registrationId: data.registrationId || docItem.id,
        checkInTime: data.checkInTime?.toDate() || new Date(),
        checkedInBy: data.checkedInBy || null,
        collection: 'attendees'
      })
    })
    
    // Sort by check-in time (newest first)
    checkinsList.sort((a, b) => b.checkInTime - a.checkInTime)
    
    // Limit to 10 most recent
    recentCheckins.value = checkinsList.slice(0, 10)
    console.log('Final check-ins list:', recentCheckins.value.length, 'items');
    
    // If no check-ins found, let's check our indexes and fields
    if (checkinsList.length === 0) {
      // Check if we need a composite index for our query
      console.log('No check-ins found. This could be due to:');
      console.log('1. No attendees have been checked in yet');
      console.log('2. checkInStatus field is not set to true');
      console.log('3. Missing an index for the query');
      
      // Let's also check if any documents exist at all in these collections
      try {
        const basicUsersQuery = query(collection(db, 'users'), limit(2));
        const basicUserDocs = await getDocs(basicUsersQuery);
        console.log('Basic users query returned:', basicUserDocs.size, 'documents');
        
        const basicAttendeesQuery = query(collection(db, 'attendees'), limit(2));
        const basicAttendeesDocs = await getDocs(basicAttendeesQuery);
        console.log('Basic attendees query returned:', basicAttendeesDocs.size, 'documents');
      } catch (err) {
        console.error('Error checking basic collection data:', err);
      }
    }
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
  // Initialize Firebase
  initializeFirebase();
  
  // If authenticated and admin, fetch recent check-ins
  if (isAuthenticated.value && isAdmin.value) {
    fetchRecentCheckins();
  }
})
</script>