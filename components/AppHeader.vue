<template>
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <!-- Logo and Navigation Links -->
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <NuxtLink to="/" class="text-xl font-bold text-indigo-600">
                QR Registration
              </NuxtLink>
            </div>
            <nav class="ml-6 flex space-x-8">
              <NuxtLink 
                to="/" 
                class="inline-flex items-center px-1 pt-1 border-b-2"
                :class="[
                  $route.path === '/' 
                    ? 'border-indigo-500 text-gray-900' 
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                ]"
              >
                Home
              </NuxtLink>
              <NuxtLink 
                to="/register" 
                class="inline-flex items-center px-1 pt-1 border-b-2"
                :class="[
                  $route.path === '/register' 
                    ? 'border-indigo-500 text-gray-900' 
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                ]"
              >
                Register
              </NuxtLink>
              <NuxtLink 
                v-if="isAdmin"
                to="/admin" 
                class="inline-flex items-center px-1 pt-1 border-b-2"
                :class="[
                  $route.path.startsWith('/admin') 
                    ? 'border-indigo-500 text-gray-900' 
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                ]"
              >
                Admin
              </NuxtLink>
            </nav>
          </div>
  
          <!-- User Menu -->
          <div class="ml-6 flex items-center">
            <template v-if="isLoading">
              <div class="h-5 w-5 border-t-2 border-indigo-500 rounded-full animate-spin"></div>
            </template>
            <template v-else-if="isAuthenticated">
              <div class="relative ml-3">
                <div>
                  <button 
                    @click="isMenuOpen = !isMenuOpen"
                    class="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <span class="sr-only">Open user menu</span>
                    <div class="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-500">
                      {{ user?.email?.charAt(0).toUpperCase() || 'U' }}
                    </div>
                  </button>
                </div>
                
                <div 
                  v-if="isMenuOpen"
                  class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                >
                  <div class="px-4 py-2 text-xs text-gray-500">
                    Signed in as <span class="font-medium">{{ user?.email }}</span>
                  </div>
                  <button
                    @click="logout"
                    class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            </template>
            <template v-else>
              <NuxtLink 
                to="/login" 
                class="text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                Sign in
              </NuxtLink>
              <NuxtLink 
                to="/register" 
                class="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Register
              </NuxtLink>
            </template>
          </div>
        </div>
      </div>
    </header>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { useFirebaseAuth, initializeFirebase } from '~/firebase'
  
  const router = useRouter()
  const isMenuOpen = ref(false)
  
  // Get Firebase authentication state
  const { user, isAuthenticated, isAdmin, isLoading } = useFirebaseAuth()
  
  // Handle user logout
  const logout = async () => {
    try {
      const { auth } = initializeFirebase()
      const { signOut } = await import('firebase/auth')
      
      await signOut(auth)
      isMenuOpen.value = false
      
      // Redirect to home page
      router.push('/')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }
  
  // Close menu when clicking outside
  onMounted(() => {
    document.addEventListener('click', (event) => {
      if (isMenuOpen.value && !event.target.closest('.relative')) {
        isMenuOpen.value = false
      }
    })
  })
  </script>