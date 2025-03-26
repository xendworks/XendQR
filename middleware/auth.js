// middleware/auth.js
import { initializeFirebase } from '~/firebase'

export default defineNuxtRouteMiddleware(async (to, from) => {
  // Skip middleware if on server
  if (process.server) return
  
  // Initialize Firebase on client-side
  const { auth } = initializeFirebase()
  
  // Wait for auth state to initialize
  const user = await new Promise((resolve) => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      unsubscribe()
      resolve(user)
    })
  })
  

  if (!user && to.meta.requiresAuth) {
    return navigateTo('/admin/login')
  }
  
  if (user && to.meta.requiresGuest) {
    return navigateTo('/admin')
  }
})