// middleware/admin.js
import { initializeFirebase } from '~/firebase'

export default defineNuxtRouteMiddleware(async (to, from) => {
  // Skip middleware if on server
  if (process.server) return
  
  // Initialize Firebase on client-side
  const { auth, db } = initializeFirebase()
  
  // Wait for auth state to initialize
  const user = await new Promise((resolve) => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      unsubscribe()
      resolve(user)
    })
  })
  
  // If user is not authenticated, redirect to admin login
  if (!user) {
    return navigateTo('/admin/login')
  }
  
  // Check if user is admin
  try {
    const { getDoc, doc } = await import('firebase/firestore')
    
    const adminDoc = await getDoc(doc(db, 'admins', user.uid))
    
    // If user is not an admin, redirect to home
    if (!adminDoc.exists()) {
      return navigateTo('/')
    }
  } catch (error) {
    console.error('Admin check error:', error)
    return navigateTo('/')
  }
})