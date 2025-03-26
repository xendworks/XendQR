<template>
    <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Admin Login
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Access the QR Code Registration management system
        </p>
      </div>
  
      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form class="space-y-6" @submit.prevent="handleLogin">
            <div v-if="error" class="rounded-md bg-red-50 p-4 mb-4">
              <div class="flex">
                <div class="flex-shrink-0">
                  <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div class="ml-3">
                  <h3 class="text-sm font-medium text-red-800">{{ error }}</h3>
                  <div v-if="error === 'You do not have admin access'" class="mt-2 text-sm text-red-700">
                    <p>Your account isn't authorized for admin access. Contact your system administrator to request access or try a different account.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div class="mt-1">
                <input 
                  id="email" 
                  v-model="email" 
                  type="email" 
                  autocomplete="email" 
                  required 
                  class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>
  
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div class="mt-1">
                <input 
                  id="password" 
                  v-model="password" 
                  type="password" 
                  autocomplete="current-password" 
                  required 
                  class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>
  
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <input 
                  id="remember_me" 
                  v-model="rememberMe" 
                  type="checkbox" 
                  class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label for="remember_me" class="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>
  
              <div class="text-sm">
                <a href="#" class="font-medium text-indigo-600 hover:text-indigo-500" @click.prevent="forgotPassword">
                  Forgot your password?
                </a>
              </div>
            </div>
  
            <div>
              <button 
                type="submit" 
                class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                :disabled="isLoading"
              >
                <svg 
                  v-if="isLoading && !isGoogleLoading" 
                  class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24"
                >
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ isLoading && !isGoogleLoading ? 'Signing in...' : 'Sign in' }}
              </button>
            </div>
          </form>
  
          <div class="mt-6">
            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-300"></div>
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>
            
            <div class="mt-6">
              <button 
                @click.prevent="handleGoogleLogin"
                class="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                :disabled="isGoogleLoading"
              >
                <svg 
                  v-if="isGoogleLoading" 
                  class="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-700" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24"
                >
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <svg 
                  v-else
                  class="h-5 w-5 mr-2" 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 48 48"
                >
                  <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                  <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
                  <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
                  <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
                </svg>
                Admin Sign in with Google
              </button>
            </div>
            
            <div class="text-xs text-center mt-2 text-gray-500">
              For admin access only. New users will be automatically verified.
            </div>

            <div class="relative mt-6">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-300"></div>
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="px-2 bg-white text-gray-500">
                  Need help?
                </span>
              </div>
            </div>
  
            <div class="mt-6 text-center text-sm">
              <p class="text-gray-600">
                Contact your system administrator for access
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { useAuth } from '~/composables/useAuth';
  
  // Define page meta
  definePageMeta({
    layout: 'default'
  });
  
  // Component state
  const email = ref('');
  const password = ref('');
  const rememberMe = ref(false);
  const error = ref(null);
  const isLoading = ref(false);
  const isGoogleLoading = ref(false);
  
  // Get router and auth composable
  const router = useRouter();
  const { login, loginWithGoogle, isAdmin, logout } = useAuth();
  
  // Handle login
  const handleLogin = async () => {
    if (!email.value || !password.value) {
      error.value = 'Please enter your email and password';
      return;
    }
    
    error.value = null;
    isLoading.value = true;
    
    try {
      // Attempt to log in
      await login(email.value, password.value);
      
      // Wait a moment for the auth state to update
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Check if the user is an admin
      if (!isAdmin.value) {
        error.value = 'You do not have admin access';
        await logout();
        return;
      }
      
      // If remember me is checked, store it in localStorage
      if (rememberMe.value) {
        localStorage.setItem('admin_email', email.value);
      } else {
        localStorage.removeItem('admin_email');
      }
      
      // Navigate to admin dashboard
      router.push('/admin');
    } catch (err) {
      console.error('Login error:', err);
      error.value = typeof err === 'string' ? err : 'Failed to log in. Please check your credentials.';
    } finally {
      isLoading.value = false;
    }
  };
  
  // Handle Google login
  const handleGoogleLogin = async () => {
    error.value = null;
    isGoogleLoading.value = true;
    
    try {
      // Attempt to log in with Google
      await loginWithGoogle();
      
      // Wait a moment for the auth state to update
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Check if the user is an admin
      if (!isAdmin.value) {
        error.value = 'You do not have admin access';
        await logout();
        return;
      }
      
      // Navigate to admin dashboard
      router.push('/admin');
    } catch (err) {
      console.error('Google login error:', err);
      error.value = typeof err === 'string' ? err : 'Failed to log in with Google.';
    } finally {
      isGoogleLoading.value = false;
    }
  };
  
  // Forgot password handler
  const forgotPassword = async () => {
    if (!email.value) {
      error.value = 'Please enter your email address first';
      return;
    }
    
    error.value = null;
    isLoading.value = true;
    
    const { resetPassword } = useAuth();
    
    try {
      await resetPassword(email.value);
      alert(`Password reset instructions have been sent to ${email.value}`);
    } catch (err) {
      console.error('Password reset error:', err);
      error.value = typeof err === 'string' ? err : 'Failed to send reset email. Please try again.';
    } finally {
      isLoading.value = false;
    }
  };
  
  // Initialize email from localStorage if available (for remember me feature)
  onMounted(() => {
    const savedEmail = localStorage.getItem('admin_email');
    if (savedEmail) {
      email.value = savedEmail;
      rememberMe.value = true;
    }
  });
  </script>