<template>
    <div class="min-h-screen bg-gray-100">
      <!-- Navigation -->
      <nav class="bg-indigo-600 shadow">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <div class="flex">
              <div class="flex-shrink-0 flex items-center">
                <NuxtLink to="/admin" class="text-white text-xl font-bold">
                  Admin Dashboard
                </NuxtLink>
              </div>
              <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
                <NuxtLink 
                  to="/admin" 
                  class="inline-flex items-center px-1 pt-1 border-b-2"
                  :class="[$route.path === '/admin' ? 'border-white text-white' : 'border-transparent text-indigo-200 hover:text-white hover:border-indigo-300']"
                >
                  Dashboard
                </NuxtLink>
                
                <NuxtLink 
                  to="/admin/scanner" 
                  class="inline-flex items-center px-1 pt-1 border-b-2"
                  :class="[$route.path === '/admin/scanner' ? 'border-white text-white' : 'border-transparent text-indigo-200 hover:text-white hover:border-indigo-300']"
                >
                  QR Scanner
                </NuxtLink>
                
                <NuxtLink 
                  to="/admin/attendees" 
                  class="inline-flex items-center px-1 pt-1 border-b-2"
                  :class="[$route.path === '/admin/attendees' ? 'border-white text-white' : 'border-transparent text-indigo-200 hover:text-white hover:border-indigo-300']"
                >
                  Attendees
                </NuxtLink>
              </div>
            </div>
            
            <div class="hidden sm:ml-6 sm:flex sm:items-center">
              <div v-if="isAuthenticated" class="relative flex">
                <div>
                  <button 
                    @click="profileMenuOpen = !profileMenuOpen"
                    class="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
                  >
                    <span class="sr-only">Open user menu</span>
                    <div class="h-8 w-8 rounded-full bg-indigo-300 flex items-center justify-center text-indigo-800">
                      {{ adminInitials }}
                    </div>
                  </button>
                </div>
                
                <div 
                  v-show="profileMenuOpen" 
                  class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                >
                  <div class="px-4 py-2 text-xs text-gray-500">
                    Signed in as <span class="font-medium">{{ adminEmail }}</span>
                  </div>
                  <button
                    @click="handleLogout"
                    class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            </div>
            
            <!-- Mobile menu button -->
            <div class="flex items-center sm:hidden">
              <button 
                @click="mobileMenuOpen = !mobileMenuOpen" 
                class="inline-flex items-center justify-center p-2 rounded-md text-indigo-200 hover:text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              >
                <span class="sr-only">Open main menu</span>
                <svg 
                  v-if="!mobileMenuOpen" 
                  class="h-6 w-6" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor" 
                  aria-hidden="true"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <svg 
                  v-else 
                  class="h-6 w-6" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor" 
                  aria-hidden="true"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        <!-- Mobile menu -->
        <div v-show="mobileMenuOpen" class="sm:hidden">
          <div class="pt-2 pb-3 space-y-1">
            <NuxtLink 
              to="/admin" 
              class="block pl-3 pr-4 py-2 border-l-4"
              :class="[$route.path === '/admin' ? 'bg-indigo-700 border-white text-white' : 'border-transparent text-indigo-200 hover:bg-indigo-700 hover:text-white']"
            >
              Dashboard
            </NuxtLink>
            
            <NuxtLink 
              to="/admin/scanner" 
              class="block pl-3 pr-4 py-2 border-l-4"
              :class="[$route.path === '/admin/scanner' ? 'bg-indigo-700 border-white text-white' : 'border-transparent text-indigo-200 hover:bg-indigo-700 hover:text-white']"
            >
              QR Scanner
            </NuxtLink>
            
            <NuxtLink 
              to="/admin/attendees" 
              class="block pl-3 pr-4 py-2 border-l-4"
              :class="[$route.path === '/admin/attendees' ? 'bg-indigo-700 border-white text-white' : 'border-transparent text-indigo-200 hover:bg-indigo-700 hover:text-white']"
            >
              Attendees
            </NuxtLink>
          </div>
          
          <div v-if="isAuthenticated" class="pt-4 pb-3 border-t border-indigo-800">
            <div class="flex items-center px-4">
              <div class="flex-shrink-0">
                <div class="h-10 w-10 rounded-full bg-indigo-300 flex items-center justify-center text-indigo-800">
                  {{ adminInitials }}
                </div>
              </div>
              <div class="ml-3">
                <div class="text-base font-medium text-white">{{ adminName }}</div>
                <div class="text-sm font-medium text-indigo-200">{{ adminEmail }}</div>
              </div>
            </div>
            <div class="mt-3 space-y-1">
              <button
                @click="handleLogout"
                class="block w-full text-left px-4 py-2 text-base font-medium text-indigo-200 hover:text-white hover:bg-indigo-700"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </nav>
      
      <!-- Main content -->
      <main>
        <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <!-- Authentication check -->
          <div v-if="!isAuthenticated && !isLoading" class="bg-white shadow-md rounded-lg p-6">
            <h1 class="text-xl font-bold text-gray-900 mb-4">Admin Login Required</h1>
            <p class="text-gray-600 mb-6">Please sign in with your administrator account to access this area.</p>
            
            <AdminLogin @success="onAdminLogin" />
          </div>
          
          <!-- Loading state -->
          <div v-else-if="isLoading" class="flex justify-center items-center h-64">
            <div class="spinner"></div>
          </div>
          
          <!-- Content when authenticated -->
          <div v-else>
            <slot />
          </div>
        </div>
      </main>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
  import { useRouter } from 'vue-router'
  import { initializeFirebase } from '~/firebase'
  import { useAuth } from '~/composables/useAuth'
  import AdminLogin from '~/components/AdminLogin.vue'
  
  // Router
  const router = useRouter()
  
  // State
  const mobileMenuOpen = ref(false)
  const profileMenuOpen = ref(false)
  const adminData = ref(null)
  
  // Auth composable
  const { user, isAuthenticated, isAdmin, isLoading, logout } = useAuth()
  
  // Computed properties
  const adminName = computed(() => {
    if (adminData.value) return adminData.value.name
    if (user.value) return user.value.displayName
    return 'Admin'
  })
  
  const adminEmail = computed(() => {
    if (adminData.value) return adminData.value.email
    if (user.value) return user.value.email
    return ''
  })
  
  const adminInitials = computed(() => {
    if (!adminName.value) return 'A'
    
    return adminName.value
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2)
  })
  
  // Check admin status on mount
  onMounted(async () => {
    // Initialize Firebase
    initializeFirebase()
    
    // Wait for auth state to resolve
    await new Promise(resolve => {
      const unsubscribe = watch(isLoading, (loading) => {
        if (!loading) {
          unsubscribe()
          resolve()
        }
      })
    })
    
    // If not authenticated or not admin, we'll show the login form
    // (handled by the template logic)
    if (isAuthenticated.value && isAdmin.value) {
      // Fetch admin data if we're authenticated as admin
      await fetchAdminData()
    }
    
    // Close profile menu when clicking outside
    document.addEventListener('click', handleOutsideClick)
  })
  
  // Clean up event listeners
  onBeforeUnmount(() => {
    document.removeEventListener('click', handleOutsideClick)
  })
  
  // Handle outside clicks for dropdown menu
  const handleOutsideClick = (event) => {
    if (profileMenuOpen.value && !event.target.closest('.relative')) {
      profileMenuOpen.value = false
    }
  }
  
  // Fetch admin data from Firestore
  const fetchAdminData = async () => {
    if (!user.value) return
    
    try {
      const { getDoc, doc } = await import('firebase/firestore')
      const { db } = initializeFirebase()
      
      const adminDoc = await getDoc(doc(db, 'admins', user.value.uid))
      
      if (adminDoc.exists()) {
        adminData.value = adminDoc.data()
      }
    } catch (error) {
      console.error('Error fetching admin data:', error)
    }
  }
  
  // Handle successful admin login
  const onAdminLogin = async (userData) => {
    console.log('Admin login successful:', userData)
    
    // Refresh the authentication state to ensure we have latest data
    await new Promise(resolve => {
      const unsubscribe = watch(isLoading, (loading) => {
        if (!loading) {
          unsubscribe()
          resolve()
        }
      })
    })
    
    // Go to dashboard
    window.location.href = '/admin/dashboard'
  }
  
  // Handle logout
  const handleLogout = async () => {
    try {
      await logout()
      adminData.value = null
      profileMenuOpen.value = false
      router.push('/')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }
  </script>