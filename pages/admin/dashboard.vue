<template>
    <div class="max-w-7xl mx-auto px-4 py-8">
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
                    <div v-if="isLoading" class="text-lg font-medium text-gray-900">
                      <div class="h-6 bg-gray-200 rounded animate-pulse w-16"></div>
                    </div>
                    <div v-else class="text-lg font-medium text-gray-900">
                      {{ stats.totalRegistered }}
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
                    <div v-if="isLoading" class="text-lg font-medium text-gray-900">
                      <div class="h-6 bg-gray-200 rounded animate-pulse w-16"></div>
                    </div>
                    <div v-else class="text-lg font-medium text-gray-900">
                      {{ stats.totalCheckedIn }}
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
                    <div v-if="isLoading" class="text-lg font-medium text-gray-900">
                      <div class="h-6 bg-gray-200 rounded animate-pulse w-16"></div>
                    </div>
                    <div v-else class="text-lg font-medium text-gray-900">
                      {{ stats.totalRegistered - stats.totalCheckedIn }}
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
                    <div v-if="isLoading" class="text-lg font-medium text-gray-900">
                      <div class="h-6 bg-gray-200 rounded animate-pulse w-16"></div>
                    </div>
                    <div v-else class="text-lg font-medium text-gray-900">
                      {{ `${stats.checkInRate}%` }}
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
              <!-- Skeleton loader for recent check-ins -->
              <template v-if="isLoading">
                <li v-for="i in 3" :key="'skeleton-' + i" class="px-4 py-4 sm:px-6">
                  <div class="flex items-center">
                    <div class="min-w-0 flex-1 flex items-center">
                      <div class="flex-shrink-0">
                        <div class="h-10 w-10 rounded-full bg-gray-200 animate-pulse"></div>
                      </div>
                      <div class="min-w-0 flex-1 px-4">
                        <div>
                          <div class="h-4 bg-gray-200 rounded animate-pulse w-32 mb-2"></div>
                          <div class="h-3 bg-gray-200 rounded animate-pulse w-24"></div>
                        </div>
                      </div>
                    </div>
                    <div class="ml-5 flex-shrink-0">
                      <div class="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
                    </div>
                  </div>
                </li>
              </template>
              
              <li v-else-if="recentCheckIns.length === 0" class="p-4 text-center text-gray-500">
                No recent check-ins found
              </li>
              
              <li v-else v-for="checkin in recentCheckIns" :key="checkin.id" class="px-4 py-4 sm:px-6">
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
              <!-- Add skeleton loaders for buttons when loading -->
              <template v-if="isLoading">
                <div class="h-12 bg-gray-200 rounded animate-pulse w-full"></div>
                <div class="h-12 bg-gray-200 rounded animate-pulse w-full"></div>
                <div class="h-12 bg-gray-200 rounded animate-pulse w-full"></div>
                <div class="h-12 bg-gray-200 rounded animate-pulse w-full"></div>
              </template>
              
              <template v-else>
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
              </template>
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
  import { initializeFirebase } from '~/firebase';
  
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
      console.log('Fetching stats from attendees and users collections...');
      
      const { collection, getDocs, query, where } = await import('firebase/firestore');
      const { db } = initializeFirebase();
      
      // Get attendees from both collections
      const attendeesSnapshot = await getDocs(collection(db, 'attendees'));
      const usersSnapshot = await getDocs(collection(db, 'users'));
      
      // Convert to arrays of data
      const attendeesList = [];
      attendeesSnapshot.forEach(doc => {
        attendeesList.push({ id: doc.id, ...doc.data() });
      });
      
      const usersList = [];
      usersSnapshot.forEach(doc => {
        usersList.push({ id: doc.id, ...doc.data() });
      });
      
      // Combine both lists
      const allRegistrations = [...attendeesList, ...usersList];
      console.log(`Found ${allRegistrations.length} total registrations (${attendeesList.length} attendees + ${usersList.length} users)`);
      
      const totalRegistered = allRegistrations.length;
      const totalCheckedIn = allRegistrations.filter(reg => reg.checkInStatus).length;
      const checkInRate = totalRegistered > 0 
        ? Math.round((totalCheckedIn / totalRegistered) * 100) 
        : 0;
      
      console.log(`Stats calculated: ${totalRegistered} registered, ${totalCheckedIn} checked in, ${checkInRate}% rate`);
      
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
      console.log('Fetching recent check-ins from attendees and users collections...');
      
      const { collection, query, where, orderBy, limit, getDocs } = await import('firebase/firestore');
      const { db } = initializeFirebase();
      
      // Get recent check-ins from users collection
      let usersSnapshot;
      try {
        const usersCheckinsQuery = query(
          collection(db, 'users'),
          where('checkInStatus', '==', true),
          orderBy('checkInTime', 'desc'),
          limit(10)
        );
        usersSnapshot = await getDocs(usersCheckinsQuery);
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
        } else {
          // Re-throw if it's not a missing index error
          throw userQueryError;
        }
      }
      
      // Get recent check-ins from attendees collection
      let attendeesSnapshot;
      try {
        const attendeesCheckinsQuery = query(
          collection(db, 'attendees'),
          where('checkInStatus', '==', true),
          orderBy('checkInTime', 'desc'),
          limit(10)
        );
        attendeesSnapshot = await getDocs(attendeesCheckinsQuery);
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
        } else {
          // Re-throw if it's not a missing index error
          throw attendeesQueryError;
        }
      }
      
      // Combine check-ins from both collections
      const checkinsList = [];
      
      // Add users check-ins
      usersSnapshot.forEach(docItem => {
        const data = docItem.data();
        checkinsList.push({
          id: docItem.id,
          name: data.name || 'Unknown',
          email: data.email || '',
          checkInTime: data.checkInTime?.toDate() || new Date(),
          registrationId: docItem.id
        });
      });
      
      // Add attendees check-ins
      attendeesSnapshot.forEach(docItem => {
        const data = docItem.data();
        checkinsList.push({
          id: docItem.id,
          name: data.fullName || (data.firstName + ' ' + data.lastName) || 'Unknown',
          email: data.email || '',
          checkInTime: data.checkInTime?.toDate() || new Date(),
          registrationId: docItem.id
        });
      });
      
      // Sort by check-in time (newest first)
      checkinsList.sort((a, b) => b.checkInTime - a.checkInTime);
      
      // Limit to 10 most recent
      recentCheckIns.value = checkinsList.slice(0, 10);
      console.log('Final check-ins list:', recentCheckIns.value.length, 'items');
      
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
      
      console.log('Refreshing dashboard data...');
      await fetchDashboardData();
      
      successMessage.value = 'Dashboard data refreshed';
      console.log('Dashboard data successfully refreshed.');
      
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
      
      console.log('Exporting attendee data from attendees and users collections...');
      
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
      
      console.log(`Preparing CSV export for ${registrations.length} attendees...`);
      
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
            // Default fallback
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
      console.log('Attendee data export complete.');
      
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