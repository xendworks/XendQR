<template>
    <div>
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>
      
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <!-- Total Registrations -->
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                <svg class="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">
                    Total Registrations
                  </dt>
                  <dd>
                    <div class="text-lg font-medium text-gray-900">
                      {{ isLoading ? '...' : stats.totalRegistered }}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-4 sm:px-6">
            <div class="text-sm">
              <NuxtLink to="/admin/attendees" class="font-medium text-indigo-600 hover:text-indigo-500">
                View all<span class="sr-only"> registrations</span>
              </NuxtLink>
            </div>
          </div>
        </div>
        
        <!-- Checked In -->
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0 bg-green-500 rounded-md p-3">
                <svg class="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">
                    Checked In
                  </dt>
                  <dd>
                    <div class="text-lg font-medium text-gray-900">
                      {{ isLoading ? '...' : stats.totalCheckedIn }}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-4 sm:px-6">
            <div class="text-sm">
              <NuxtLink to="/admin/attendees?status=checked-in" class="font-medium text-indigo-600 hover:text-indigo-500">
                View all<span class="sr-only"> checked in</span>
              </NuxtLink>
            </div>
          </div>
        </div>
        
        <!-- Not Checked In -->
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                <svg class="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">
                    Not Checked In
                  </dt>
                  <dd>
                    <div class="text-lg font-medium text-gray-900">
                      {{ isLoading ? '...' : stats.totalRegistered - stats.totalCheckedIn }}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-4 sm:px-6">
            <div class="text-sm">
              <NuxtLink to="/admin/attendees?status=not-checked-in" class="font-medium text-indigo-600 hover:text-indigo-500">
                View all<span class="sr-only"> not checked in</span>
              </NuxtLink>
            </div>
          </div>
        </div>
        
        <!-- Check-in Rate -->
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0 bg-blue-500 rounded-md p-3">
                <svg class="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">
                    Check-in Rate
                  </dt>
                  <dd>
                    <div class="text-lg font-medium text-gray-900">
                      {{ isLoading ? '...' : `${stats.checkInRate}%` }}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-4 sm:px-6">
            <div class="text-sm">
              <a href="#" class="font-medium text-indigo-600 hover:text-indigo-500" @click.prevent="refreshStats">
                Refresh stats
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Recent Activity & Quick Access -->
      <div class="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <!-- Recent Check-ins -->
        <div class="bg-white shadow rounded-lg">
          <div class="px-4 py-5 sm:px-6">
            <h2 class="text-lg font-medium text-gray-900">Recent Check-ins</h2>
            <p class="mt-1 text-sm text-gray-500">Last 10 attendees who checked in</p>
          </div>
          
          <div class="border-t border-gray-200">
            <ul class="divide-y divide-gray-200">
              <li v-if="isLoading" class="p-4 text-center text-gray-500">
                Loading recent check-ins...
              </li>
              <li v-else-if="recentCheckIns.length === 0" class="p-4 text-center text-gray-500">
                No recent check-ins found
              </li>
              <li v-for="checkin in recentCheckIns" :key="checkin.id" class="px-4 py-4 sm:px-6">
                <div class="flex items-center">
                  <div class="min-w-0 flex-1 flex items-center">
                    <div class="flex-shrink-0">
                      <div class="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-medium">
                        {{ getInitials(checkin.name) }}
                      </div>
                    </div>
                    <div class="min-w-0 flex-1 px-4">
                      <div>
                        <p class="text-sm font-medium text-indigo-600 truncate">{{ checkin.name }}</p>
                        <p class="mt-1 flex text-sm text-gray-500">
                          <span class="truncate">{{ checkin.email }}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div class="ml-5 flex-shrink-0">
                    <div class="text-sm text-gray-500">
                      {{ formatTime(checkin.checkInTime) }}
                    </div>
                  </div>
                </div>
              </li>
            </ul>
            
            <div class="bg-gray-50 px-4 py-4 sm:px-6 rounded-b-lg">
              <div class="text-sm">
                <NuxtLink to="/admin/attendees?status=checked-in" class="font-medium text-indigo-600 hover:text-indigo-500">
                  View all check-ins<span class="sr-only"> check-ins</span>
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Quick Actions -->
        <div class="bg-white shadow rounded-lg">
          <div class="px-4 py-5 sm:px-6">
            <h2 class="text-lg font-medium text-gray-900">Quick Actions</h2>
            <p class="mt-1 text-sm text-gray-500">Common administrative tasks</p>
          </div>
          
          <div class="border-t border-gray-200 px-4 py-5 sm:p-6">
            <div class="space-y-4">
              <NuxtLink to="/admin/scanner" class="block w-full bg-indigo-600 text-white px-4 py-3 rounded-md font-medium text-center hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                QR Code Scanner
              </NuxtLink>
              
              <NuxtLink to="/admin/attendees" class="block w-full bg-white border border-gray-300 text-gray-700 px-4 py-3 rounded-md font-medium text-center hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Manage Attendees
              </NuxtLink>
              
              <button 
                @click="exportAttendeeData" 
                class="block w-full bg-white border border-gray-300 text-gray-700 px-4 py-3 rounded-md font-medium text-center hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                :disabled="isExporting"
              >
                {{ isExporting ? 'Exporting...' : 'Export Attendee Data' }}
              </button>
              
              <button 
                @click="sendBulkEmail" 
                class="block w-full bg-white border border-gray-300 text-gray-700 px-4 py-3 rounded-md font-medium text-center hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                :disabled="isSendingEmail"
              >
                {{ isSendingEmail ? 'Sending...' : 'Send Reminder Email' }}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Error Alert -->
      <div v-if="error" class="mt-6 p-4 bg-red-50 rounded-md">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">{{ error }}</h3>
          </div>
        </div>
      </div>
      
      <!-- Success Alert -->
      <div v-if="successMessage" class="mt-6 p-4 bg-green-50 rounded-md">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-green-800">{{ successMessage }}</h3>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useFirestore } from '../../composables/useFirestore';
  
  // Define page meta
  definePageMeta({
    layout: 'admin',
    middleware: ['admin']
  });
  
  // Component state
  const isLoading = ref(true);
  const isExporting = ref(false);
  const isSendingEmail = ref(false);
  const error = ref(null);
  const successMessage = ref(null);
  const stats = ref({
    totalRegistered: 0,
    totalCheckedIn: 0,
    checkInRate: 0
  });
  const recentCheckIns = ref([]);
  
  // Get firestore methods
  const { getCollection, getDocumentsByQuery } = useFirestore();
  
  // Fetch dashboard data on mount
  onMounted(async () => {
    await fetchDashboardData();
  });
  
  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      isLoading.value = true;
      error.value = null;
      
      await Promise.all([
        fetchStats(),
        fetchRecentCheckIns()
      ]);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      error.value = 'Failed to load dashboard data. Please ensure your Firebase configuration is correct.';
    } finally {
      isLoading.value = false;
    }
  };
  
  // Fetch check-in statistics
  const fetchStats = async () => {
    try {
      // Get all registrations
      const registrations = await getCollection('registrations');
      
      // Calculate stats
      const totalRegistered = registrations.length;
      const totalCheckedIn = registrations.filter(reg => reg.checkedIn).length;
      const checkInRate = totalRegistered > 0 
        ? Math.round((totalCheckedIn / totalRegistered) * 100) 
        : 0;
      
      stats.value = {
        totalRegistered,
        totalCheckedIn,
        checkInRate
      };
    } catch (err) {
      console.error('Error fetching check-in stats:', err);
      throw err;
    }
  };
  
  // Fetch recent check-ins
  const fetchRecentCheckIns = async () => {
    try {
      // Create query parameters for getDocumentsByQuery (to be implemented in useFirestore)
      const queryParams = {
        collection: 'registrations',
        where: [['checkedIn', '==', true]],
        orderBy: [['checkedInTime', 'desc']],
        limit: 10
      };
      
      // Get recent check-ins
      const checkIns = await getDocumentsByQuery(queryParams);
      
      // Transform data
      recentCheckIns.value = checkIns.map(doc => ({
        id: doc.id,
        name: `${doc.firstName} ${doc.lastName}`,
        email: doc.email || '',
        checkInTime: doc.checkedInTime,
        registrationId: doc.id
      }));
    } catch (err) {
      console.error('Error fetching recent check-ins:', err);
      // Provide fallback data if query fails
      recentCheckIns.value = [];
    }
  };
  
  // Refresh statistics
  const refreshStats = async () => {
    try {
      isLoading.value = true;
      error.value = null;
      successMessage.value = null;
      
      await fetchDashboardData();
      
      successMessage.value = 'Dashboard data refreshed';
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        successMessage.value = null;
      }, 3000);
    } catch (err) {
      console.error('Error refreshing stats:', err);
      error.value = 'Failed to refresh dashboard data';
    } finally {
      isLoading.value = false;
    }
  };
  
  // Export attendee data
  const exportAttendeeData = async () => {
    try {
      isExporting.value = true;
      error.value = null;
      successMessage.value = null;
      
      // Get all registrations
      const registrations = await getCollection('registrations');
      
      // Prepare CSV data
      let csvContent = 'Name,Email,Phone,Registration ID,Registration Date,Check-in Status,Check-in Time\n';
      
      registrations.forEach(data => {
        const fullName = `${data.firstName} ${data.lastName}`;
        
        const row = [
          fullName,
          data.email || '',
          data.phone || '',
          data.id || '',
          data.registrationDate ? new Date(data.registrationDate).toLocaleString() : '',
          data.checkedIn ? 'Yes' : 'No',
          data.checkedInTime ? new Date(data.checkedInTime).toLocaleString() : ''
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
  
  // Send bulk reminder email
  const sendBulkEmail = async () => {
    try {
      if (!confirm('Are you sure you want to send a reminder email to all non-checked-in attendees?')) {
        return;
      }
      
      isSendingEmail.value = true;
      error.value = null;
      successMessage.value = null;
      
      // This would typically call a Cloud Function to handle the email sending
      // For this demo, we'll just show a success message
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      successMessage.value = 'Reminder emails have been sent to all non-checked-in attendees';
      
      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        successMessage.value = null;
      }, 5000);
    } catch (err) {
      console.error('Error sending bulk email:', err);
      error.value = 'Failed to send reminder emails';
    } finally {
      isSendingEmail.value = false;
    }
  };
  
  // Helper: Format check-in time
  const formatTime = (date) => {
    if (!date) return '';
    
    return new Date(date).toLocaleString([], {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Helper: Get name initials
  const getInitials = (name) => {
    if (!name) return '?';
    
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  </script>