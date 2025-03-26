<template>
    <div>
      <!-- Search and Filters -->
      <div class="mb-6 bg-white p-4 rounded-lg shadow-sm">
        <div class="sm:flex sm:items-center justify-between">
          <h3 class="text-lg font-medium text-gray-900">Attendees</h3>
          
          <div class="mt-3 sm:mt-0 sm:ml-4 flex items-center space-x-2">
            <div class="relative rounded-md w-full sm:w-64">
              <input
                type="text"
                v-model="searchTerm"
                class="form-input pl-10"
                placeholder="Search attendees..."
              />
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            
            <select 
              v-model="statusFilter" 
              class="form-input pl-3 pr-10 py-2"
            >
              <option value="all">All Statuses</option>
              <option value="checked-in">Checked In</option>
              <option value="not-checked-in">Not Checked In</option>
            </select>
            
            <button 
              @click="refreshAttendees"
              class="inline-flex items-center p-2 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              title="Refresh"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>
        
        <div class="mt-4 flex items-center text-sm text-gray-500">
          <div class="mr-4">
            Total: <span class="font-medium">{{ totalAttendees }}</span>
          </div>
          <div class="mr-4">
            Checked In: <span class="font-medium">{{ checkedInCount }}</span>
          </div>
          <div>
            Not Checked In: <span class="font-medium">{{ notCheckedInCount }}</span>
          </div>
        </div>
      </div>
      
      <!-- Attendee Table -->
      <div class="bg-white shadow-sm overflow-hidden sm:rounded-lg">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registration Date
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-if="isLoading">
                <td colspan="6" class="px-6 py-4 text-center text-sm text-gray-500">
                  <div class="flex justify-center">
                    <svg class="animate-spin h-5 w-5 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                </td>
              </tr>
              <tr v-else-if="filteredAttendees.length === 0">
                <td colspan="6" class="px-6 py-4 text-center text-sm text-gray-500">
                  No attendees found
                </td>
              </tr>
              <tr v-for="attendee in filteredAttendees" :key="attendee.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="h-10 w-10 flex-shrink-0 bg-indigo-100 rounded-full flex items-center justify-center">
                      <span class="text-indigo-700 font-medium">{{ getInitials(attendee.name) }}</span>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">
                        {{ attendee.name }}
                      </div>
                      <div v-if="attendee.registrationId" class="text-xs text-gray-500">
                        ID: {{ attendee.registrationId }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ attendee.email }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ attendee.phone }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(attendee.registrationDate) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span 
                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                    :class="attendee.checkInStatus ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'"
                  >
                    {{ attendee.checkInStatus ? 'Checked In' : 'Not Checked In' }}
                  </span>
                  <div v-if="attendee.checkInTime" class="text-xs text-gray-500 mt-1">
                    {{ formatTime(attendee.checkInTime) }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex space-x-2">
                    <button 
                      @click="toggleCheckInStatus(attendee)"
                      class="text-indigo-600 hover:text-indigo-900"
                    >
                      {{ attendee.checkInStatus ? 'Undo Check-In' : 'Check In' }}
                    </button>
                    <button 
                      @click="viewDetails(attendee)"
                      class="text-gray-600 hover:text-gray-900"
                    >
                      View
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Pagination -->
        <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700">
                Showing <span class="font-medium">{{ paginationStart }}</span> to <span class="font-medium">{{ paginationEnd }}</span> of <span class="font-medium">{{ totalFilteredAttendees }}</span> attendees
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  @click="currentPage = Math.max(1, currentPage - 1)"
                  :disabled="currentPage === 1"
                  class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }"
                >
                  <span class="sr-only">Previous</span>
                  <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                </button>
                
                <span v-for="page in visiblePageNumbers" :key="page">
                  <button
                    v-if="page !== '...'"
                    @click="currentPage = page"
                    class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium hover:bg-gray-50"
                    :class="page === currentPage ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600' : 'text-gray-500'"
                  >
                    {{ page }}
                  </button>
                  <span
                    v-else
                    class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                  >
                    ...
                  </span>
                </span>
                
                <button
                  @click="currentPage = Math.min(totalPages, currentPage + 1)"
                  :disabled="currentPage === totalPages || totalPages === 0"
                  class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  :class="{ 'opacity-50 cursor-not-allowed': currentPage === totalPages || totalPages === 0 }"
                >
                  <span class="sr-only">Next</span>
                  <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Attendee Details Modal -->
      <div v-if="selectedAttendee" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg shadow-xl overflow-hidden max-w-md w-full mx-4">
          <div class="bg-indigo-600 px-6 py-4">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-medium text-white">Attendee Details</h3>
              <button 
                @click="selectedAttendee = null" 
                class="text-white hover:text-gray-200 focus:outline-none"
              >
                <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          
          <div class="px-6 py-4">
            <div class="flex items-center mb-4">
              <div class="h-16 w-16 bg-indigo-100 rounded-full flex items-center justify-center text-xl text-indigo-700 font-bold">
                {{ getInitials(selectedAttendee.name) }}
              </div>
              <div class="ml-4">
                <h4 class="text-lg font-medium text-gray-900">{{ selectedAttendee.name }}</h4>
                <p class="text-sm text-gray-500">Registration ID: {{ selectedAttendee.registrationId || 'N/A' }}</p>
              </div>
            </div>
            
            <div class="border-t border-gray-200 pt-4">
              <dl class="divide-y divide-gray-200">
                <div class="py-3 flex justify-between">
                  <dt class="text-sm font-medium text-gray-500">Email</dt>
                  <dd class="text-sm text-gray-900">{{ selectedAttendee.email }}</dd>
                </div>
                <div class="py-3 flex justify-between">
                  <dt class="text-sm font-medium text-gray-500">Phone</dt>
                  <dd class="text-sm text-gray-900">{{ selectedAttendee.phone }}</dd>
                </div>
                <div class="py-3 flex justify-between">
                  <dt class="text-sm font-medium text-gray-500">Registration Date</dt>
                  <dd class="text-sm text-gray-900">{{ formatDate(selectedAttendee.registrationDate) }}</dd>
                </div>
                <div class="py-3 flex justify-between">
                  <dt class="text-sm font-medium text-gray-500">Status</dt>
                  <dd class="text-sm">
                    <span 
                      class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                      :class="selectedAttendee.checkInStatus ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'"
                    >
                      {{ selectedAttendee.checkInStatus ? 'Checked In' : 'Not Checked In' }}
                    </span>
                  </dd>
                </div>
                <div v-if="selectedAttendee.checkInTime" class="py-3 flex justify-between">
                  <dt class="text-sm font-medium text-gray-500">Check-in Time</dt>
                  <dd class="text-sm text-gray-900">{{ formatDateTime(selectedAttendee.checkInTime) }}</dd>
                </div>
              </dl>
            </div>
          </div>
          
          <div class="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
            <button 
              @click="toggleCheckInStatus(selectedAttendee)"
              class="btn"
              :class="selectedAttendee.checkInStatus ? 'btn-secondary' : 'btn-primary'"
            >
              {{ selectedAttendee.checkInStatus ? 'Undo Check-In' : 'Check In' }}
            </button>
            <button 
              @click="selectedAttendee = null" 
              class="btn btn-secondary"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed, onMounted, watch } from 'vue'
  import { initializeFirebase } from '~/firebase'
  
  // Props definition
  const props = defineProps({
    itemsPerPage: {
      type: Number,
      default: 10
    },
    autoRefresh: {
      type: Boolean,
      default: false
    },
    refreshInterval: {
      type: Number,
      default: 30000 // 30 seconds
    }
  })
  
  // Emits
  const emit = defineEmits(['check-in', 'undo-check-in', 'error'])
  
  // Component state
  const attendees = ref([])
  const isLoading = ref(true)
  const searchTerm = ref('')
  const statusFilter = ref('all')
  const currentPage = ref(1)
  const selectedAttendee = ref(null)
  const refreshIntervalId = ref(null)
  
  // Initialize Firebase
  const { db } = initializeFirebase()
  
  // Computed properties
  const filteredAttendees = computed(() => {
    let result = [...attendees.value]
    
    // Apply search filter
    if (searchTerm.value.trim()) {
      const search = searchTerm.value.toLowerCase()
      result = result.filter(attendee => 
        attendee.name.toLowerCase().includes(search) || 
        attendee.email.toLowerCase().includes(search) ||
        attendee.phone.includes(search) ||
        (attendee.registrationId && attendee.registrationId.toLowerCase().includes(search))
      )
    }
    
    // Apply status filter
    if (statusFilter.value === 'checked-in') {
      result = result.filter(attendee => attendee.checkInStatus)
    } else if (statusFilter.value === 'not-checked-in') {
      result = result.filter(attendee => !attendee.checkInStatus)
    }
    
    return result
  })
  
  // Pagination
  const totalFilteredAttendees = computed(() => filteredAttendees.value.length)
  const totalPages = computed(() => Math.ceil(totalFilteredAttendees.value / props.itemsPerPage))
  const paginatedAttendees = computed(() => {
    const start = (currentPage.value - 1) * props.itemsPerPage
    const end = start + props.itemsPerPage
    return filteredAttendees.value.slice(start, end)
  })
  const paginationStart = computed(() => {
    if (totalFilteredAttendees.value === 0) return 0
    return (currentPage.value - 1) * props.itemsPerPage + 1
  })
  const paginationEnd = computed(() => {
    if (totalFilteredAttendees.value === 0) return 0
    return Math.min(currentPage.value * props.itemsPerPage, totalFilteredAttendees.value)
  })
  
  // Visible page numbers for pagination
  const visiblePageNumbers = computed(() => {
    if (totalPages.value <= 7) {
      return Array.from({ length: totalPages.value }, (_, i) => i + 1)
    }
    
    if (currentPage.value <= 3) {
      return [1, 2, 3, 4, 5, '...', totalPages.value]
    }
    
    if (currentPage.value >= totalPages.value - 2) {
      return [1, '...', totalPages.value - 4, totalPages.value - 3, totalPages.value - 2, totalPages.value - 1, totalPages.value]
    }
    
    return [1, '...', currentPage.value - 1, currentPage.value, currentPage.value + 1, '...', totalPages.value]
  })
  
  // Stats
  const totalAttendees = computed(() => attendees.value.length)
  const checkedInCount = computed(() => attendees.value.filter(a => a.checkInStatus).length)
  const notCheckedInCount = computed(() => attendees.value.filter(a => !a.checkInStatus).length)
  
  // Fetch attendees from Firestore
  const fetchAttendees = async () => {
    try {
      isLoading.value = true
      
      const { collection, getDocs, orderBy, query } = await import('firebase/firestore')
      
      const attendeesQuery = query(
        collection(db, 'users'),
        orderBy('registrationDate', 'desc')
      )
      
      const querySnapshot = await getDocs(attendeesQuery)
      
      // Map documents to attendees array
      const attendeesList = []
      querySnapshot.forEach(doc => {
        const data = doc.data()
        
        // Convert Firestore timestamp to Date
        const registrationDate = data.registrationDate?.toDate() || new Date()
        const checkInTime = data.checkInTime?.toDate() || null
        
        attendeesList.push({
          id: doc.id,
          name: data.name || 'Unknown',
          email: data.email || '',
          phone: data.phone || '',
          registrationId: data.registrationId || '',
          registrationDate,
          checkInStatus: data.checkInStatus || false,
          checkInTime,
          isVerified: data.isVerified || false
        })
      })
      
      attendees.value = attendeesList
    } catch (error) {
      console.error('Error fetching attendees:', error)
      emit('error', 'Failed to fetch attendees')
    } finally {
      isLoading.value = false
    }
  }
  
  // Toggle check-in status
  const toggleCheckInStatus = async (attendee) => {
    try {
      const { doc, updateDoc, serverTimestamp } = await import('firebase/firestore')
      
      const newStatus = !attendee.checkInStatus
      
      // Update Firestore
      await updateDoc(doc(db, 'users', attendee.id), {
        checkInStatus: newStatus,
        checkInTime: newStatus ? serverTimestamp() : null
      })
      
      // Update local state
      attendee.checkInStatus = newStatus
      attendee.checkInTime = newStatus ? new Date() : null
      
      // Emit event
      if (newStatus) {
        emit('check-in', attendee)
      } else {
        emit('undo-check-in', attendee)
      }
      
      // Update selected attendee if open
      if (selectedAttendee.value && selectedAttendee.value.id === attendee.id) {
        selectedAttendee.value = { ...attendee }
      }
    } catch (error) {
      console.error('Error toggling check-in status:', error)
      emit('error', 'Failed to update check-in status')
    }
  }
  
  // View attendee details
  const viewDetails = (attendee) => {
    selectedAttendee.value = { ...attendee }
  }
  
  // Refresh attendees list
  const refreshAttendees = () => {
    fetchAttendees()
  }
  
  // Format date for display
  const formatDate = (date) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleDateString()
  }
  
  // Format time for display
  const formatTime = (date) => {
    if (!date) return ''
    return new Date(date).toLocaleTimeString()
  }
  
  // Format date and time for display
  const formatDateTime = (date) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleString()
  }
  
  // Get name initials
  const getInitials = (name) => {
    if (!name) return '?'
    
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }
  
  // Lifecycle hooks
  onMounted(() => {
    // Fetch attendees on mount
    fetchAttendees()
    
    // Set up auto-refresh if enabled
    if (props.autoRefresh && props.refreshInterval > 0) {
      refreshIntervalId.value = setInterval(() => {
        fetchAttendees()
      }, props.refreshInterval)
    }
  })
  
  // Clean up interval on unmount
  onBeforeUnmount(() => {
    if (refreshIntervalId.value) {
      clearInterval(refreshIntervalId.value)
    }
  })
  
  // Watch for search and filter changes to reset pagination
  watch([searchTerm, statusFilter], () => {
    currentPage.value = 1
  })
  
  // Expose methods to parent
  defineExpose({
    fetchAttendees,
    refreshAttendees,
    toggleCheckInStatus
  })
  </script>