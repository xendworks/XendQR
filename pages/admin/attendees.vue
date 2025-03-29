<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <div class="sm:flex sm:items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Attendees</h1>
        <p class="mt-2 text-sm text-gray-700">
          Manage and monitor all event attendees
        </p>
      </div>
      <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
        <button
          @click="exportAttendeeData"
          class="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          :disabled="isExporting"
        >
          <svg
            v-if="!isExporting"
            class="-ml-1 mr-2 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <svg
            v-else
            class="-ml-1 mr-2 h-5 w-5 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          {{ isExporting ? 'Exporting...' : 'Export to CSV' }}
        </button>
      </div>
    </div>

    <!-- Success/Error Messages -->
    <div v-if="successMessage" class="mb-4 p-4 bg-green-50 rounded-md">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg
            class="h-5 w-5 text-green-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
        <div class="ml-3">
          <p class="text-sm font-medium text-green-800">{{ successMessage }}</p>
        </div>
      </div>
    </div>

    <div v-if="error" class="mb-4 p-4 bg-red-50 rounded-md">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg
            class="h-5 w-5 text-red-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
        <div class="ml-3">
          <p class="text-sm font-medium text-red-800">{{ error }}</p>
        </div>
      </div>
    </div>

    <!-- Attendee List Component -->
    <AttendanceList
      ref="attendanceList"
      :items-per-page="20"
      :auto-refresh="true"
      :refresh-interval="30000"
      @check-in="handleCheckIn"
      @undo-check-in="handleUndoCheckIn"
      @error="handleError"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import { initializeFirebase } from '~/firebase';

// Define page meta
definePageMeta({
  layout: 'admin',
  middleware: ['admin']
});

// Component state
const isExporting = ref(false);
const error = ref(null);
const successMessage = ref(null);
const attendanceList = ref(null);
const route = useRoute();

// Update filter based on route
const updateFilterFromRoute = () => {
  if (!attendanceList.value) return;
  
  const status = route.query.status;
  if (status === 'checked-in') {
    attendanceList.value.statusFilter = 'checked-in';
  } else if (status === 'not-checked-in') {
    attendanceList.value.statusFilter = 'not-checked-in';
  } else {
    attendanceList.value.statusFilter = 'all';
  }
};

// Handle status filter from URL
onMounted(async () => {
  // Wait for next tick to ensure component is mounted
  await nextTick();
  
  // Set initial filter
  updateFilterFromRoute();
});

// Watch for route changes
watch(
  () => route.query.status,
  () => {
    updateFilterFromRoute();
  }
);

// Event handlers
const handleCheckIn = (attendee) => {
  successMessage.value = `Successfully checked in ${attendee.name}`;
  setTimeout(() => {
    successMessage.value = null;
  }, 3000);
};

const handleUndoCheckIn = (attendee) => {
  successMessage.value = `Successfully undid check-in for ${attendee.name}`;
  setTimeout(() => {
    successMessage.value = null;
  }, 3000);
};

const handleError = (message) => {
  error.value = message;
  setTimeout(() => {
    error.value = null;
  }, 5000);
};

// Export functionality
const exportAttendeeData = async () => {
  try {
    isExporting.value = true;
    error.value = null;
    successMessage.value = null;
    
    const { collection, getDocs } = await import('firebase/firestore');
    const { db } = initializeFirebase();
    
    // Get attendees from both collections
    const attendeesSnapshot = await getDocs(collection(db, 'attendees'));
    const usersSnapshot = await getDocs(collection(db, 'users'));
    
    // Combine data from both collections
    const registrations = [];
    
    attendeesSnapshot.forEach(doc => {
      const data = doc.data();
      registrations.push({
        id: doc.id,
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        email: data.email || '',
        phone: data.phone || '',
        registrationDate: data.registrationDate || data.createdAt || null,
        checkedIn: data.checkInStatus || false,
        checkedInTime: data.checkInTime || null
      });
    });
    
    usersSnapshot.forEach(doc => {
      const data = doc.data();
      // Extract first and last name from name field if available
      let firstName = '';
      let lastName = '';
      if (data.name) {
        const nameParts = data.name.split(' ');
        firstName = nameParts[0] || '';
        lastName = nameParts.slice(1).join(' ') || '';
      }
      
      registrations.push({
        id: doc.id,
        firstName: data.firstName || firstName,
        lastName: data.lastName || lastName,
        email: data.email || '',
        phone: data.phone || '',
        registrationDate: data.registrationDate || data.createdAt || null,
        checkedIn: data.checkInStatus || false,
        checkedInTime: data.checkInTime || null
      });
    });
    
    // Prepare CSV data
    let csvContent = 'Name,Email,Phone,Registration ID,Registration Date,Check-in Status,Check-in Time\n';
    
    registrations.forEach(data => {
      const fullName = `${data.firstName} ${data.lastName}`.trim();
      
      // Helper to safely convert Firebase timestamp or Date to string
      const formatTimestamp = (timestamp) => {
        if (!timestamp) return '';
        
        try {
          // Check if it's a Firestore timestamp (with seconds property)
          if (timestamp.seconds) {
            return new Date(timestamp.seconds * 1000).toLocaleString();
          }
          // Check if it's a Date object
          else if (timestamp instanceof Date) {
            return timestamp.toLocaleString();
          }
          // Try to parse as a date string
          else if (typeof timestamp === 'string') {
            return new Date(timestamp).toLocaleString();
          }
          return '';
        } catch (err) {
          console.error('Error formatting timestamp:', err);
          return '';
        }
      };
      
      const row = [
        fullName,
        data.email || '',
        data.phone || '',
        data.id || '',
        formatTimestamp(data.registrationDate),
        data.checkedIn ? 'Yes' : 'No',
        formatTimestamp(data.checkedInTime)
      ];
      
      // Escape fields and add to CSV
      csvContent += row.map(field => {
        // Handle commas and quotes in fields
        if (field.includes(',') || field.includes('"') || field.includes('\n')) {
          return `"${field.replace(/"/g, '""')}"`;
        }
        return field;
      }).join(',') + '\n';
    });
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `attendees-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    successMessage.value = 'Attendee data exported successfully';
    
    // Auto-hide success message after 3 seconds
    setTimeout(() => {
      successMessage.value = null;
    }, 3000);
  } catch (err) {
    console.error('Error exporting attendee data:', err);
    error.value = 'Failed to export attendee data';
  } finally {
    isExporting.value = false;
  }
};
</script> 