<template>
    <div class="bg-white rounded-lg p-6">
      <h2 class="text-xl font-bold mb-6 text-center">Admin Login</h2>
      
      <form @submit.prevent="login" class="space-y-4">
        <div>
          <label for="email" class="form-label">Email Address</label>
          <input 
            id="email" 
            v-model="email" 
            type="email" 
            required
            class="form-input"
            :class="{ 'border-red-500': emailError }"
          />
          <p v-if="emailError" class="mt-1 text-sm text-red-600">{{ emailError }}</p>
        </div>
        
        <div>
          <label for="password" class="form-label">Password</label>
          <div class="relative">
            <input 
              id="password" 
              v-model="password" 
              :type="showPassword ? 'text' : 'password'" 
              required
              class="form-input pr-10"
              :class="{ 'border-red-500': passwordError }"
            />
            <button 
              type="button"
              @click="showPassword = !showPassword"
              class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
          </div>
          <p v-if="passwordError" class="mt-1 text-sm text-red-600">{{ passwordError }}</p>
        </div>
        
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input 
              id="remember-me" 
              v-model="rememberMe" 
              type="checkbox" 
              class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label for="remember-me" class="ml-2 block text-sm text-gray-900">
              Remember me
            </label>
          </div>
          
          <div class="text-sm">
            <button 
              type="button" 
              @click="forgotPassword" 
              class="font-medium text-indigo-600 hover:text-indigo-500">
              Forgot password?
            </button>
          </div>
        </div>
        
        <div>
          <button 
            type="submit" 
            class="btn btn-primary w-full"
            :disabled="isLoading"
          >
            <svg v-if="isLoading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isLoading ? 'Signing in...' : 'Sign in' }}
          </button>
        </div>
      </form>
      
      <!-- Error Alert -->
      <div v-if="generalError" class="mt-4 p-4 bg-red-50 rounded-md">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm text-red-700">{{ generalError }}</p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  import { initializeFirebase, handleFirebaseError } from '~/firebase'
  
  // Component props
  const props = defineProps({
    redirect: {
      type: String,
      default: '/admin'
    }
  })
  
  // Component emits
  const emit = defineEmits(['success', 'error'])
  
  // Component state
  const email = ref('')
  const password = ref('')
  const rememberMe = ref(false)
  const showPassword = ref(false)
  const isLoading = ref(false)
  
  // Validation errors
  const emailError = ref('')
  const passwordError = ref('')
  const generalError = ref('')
  
  // Firebase instance
  const { auth } = initializeFirebase()
  
  // Methods
  const login = async () => {
    try {
      // Reset validation errors
      emailError.value = ''
      passwordError.value = ''
      generalError.value = ''
      
      // Simple validation
      if (!email.value.trim()) {
        emailError.value = 'Email is required'
        return
      }
      
      if (!password.value) {
        passwordError.value = 'Password is required'
        return
      }
      
      isLoading.value = true
      
      // Import Firebase sign in method
      const { signInWithEmailAndPassword, setPersistence, browserSessionPersistence, browserLocalPersistence, signOut } = await import('firebase/auth')
      
      // Set auth persistence based on remember me checkbox
      await setPersistence(auth, rememberMe.value ? browserLocalPersistence : browserSessionPersistence)
      
      // Sign in user
      const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value)
      
      // Check if user is admin
      const { getDoc, doc } = await import('firebase/firestore')
      const { db } = initializeFirebase()
      
      // Check in the users collection with role='admin'
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid))
      
      // If user is not an admin, show error
      if (!userDoc.exists() || userDoc.data().role !== 'admin') {
        generalError.value = 'You do not have admin access'
        await signOut(auth)
        isLoading.value = false
        emit('error', 'admin-access-denied')
        return
      }
      
      // Success - emit success event with user info
      emit('success', {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: userCredential.user.displayName
      })
      
      // Clear form
      email.value = ''
      password.value = ''
      
    } catch (error) {
      console.error('Login error:', error)
      generalError.value = handleFirebaseError(error)
      emit('error', error)
    } finally {
      isLoading.value = false
    }
  }
  
  const forgotPassword = async () => {
    try {
      // Reset error
      emailError.value = ''
      generalError.value = ''
      
      // Validate email
      if (!email.value.trim()) {
        emailError.value = 'Please enter your email to reset your password'
        return
      }
      
      isLoading.value = true
      
      // Import Firebase password reset method
      const { sendPasswordResetEmail } = await import('firebase/auth')
      
      // Send password reset email
      await sendPasswordResetEmail(auth, email.value)
      
      // Show success message
      generalError.value = ''
      alert('Password reset email sent. Please check your inbox.')
      
    } catch (error) {
      console.error('Password reset error:', error)
      generalError.value = handleFirebaseError(error)
    } finally {
      isLoading.value = false
    }
  }
  
  // Expose methods to parent component
  defineExpose({
    login,
    forgotPassword
  })
  </script>