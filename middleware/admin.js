// middleware/admin.js
import { initializeFirebase } from '~/firebase'

export default defineNuxtRouteMiddleware(async (to, from) => {
  // Skip middleware if on server
  if (process.server) return
  
  // Initialize Firebase on client-side
  const { auth, db } = initializeFirebase()
  
  try {
    // Wait for auth state to initialize
    const user = await new Promise((resolve) => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        unsubscribe()
        resolve(user)
      })
    })
    
    // If user is not authenticated, redirect to admin login
    if (!user) {
      console.log('No authenticated user, redirecting to login')
      return navigateTo('/admin/login')
    }
    
    // Check if user is admin
    const { getDoc, doc } = await import('firebase/firestore')
    const userDoc = await getDoc(doc(db, 'users', user.uid))
    
    // If user document doesn't exist or user is not an admin, redirect to home
    if (!userDoc.exists() || userDoc.data().role !== 'admin') {
      console.log('User is not an admin, redirecting to home')
      return navigateTo('/')
    }
    
    console.log('Admin authorization confirmed')
    
    // Allow navigation to proceed
    return
  } catch (error) {
    console.error('Admin check error:', error)
    return navigateTo('/')
  }
})