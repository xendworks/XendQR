// firebase/index.js

import { initializeApp, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';

let firebaseApp;

/**
 * Translates Firebase error codes to user-friendly messages
 * @param {Error} error - Firebase error object
 * @returns {string} User-friendly error message
 */
export function handleFirebaseError(error) {
  const errorCode = error.code || '';
  
  // Auth errors
  switch (errorCode) {
    // Email/Password Authentication
    case 'auth/email-already-in-use':
      return 'This email is already registered.';
    case 'auth/invalid-email':
      return 'Invalid email address format.';
    case 'auth/user-disabled':
      return 'This account has been disabled.';
    case 'auth/user-not-found':
      return 'No account found with this email.';
    case 'auth/wrong-password':
      return 'Incorrect password.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.';
    case 'auth/weak-password':
      return 'Password is too weak. Please use a stronger password.';
      
    // Phone Authentication
    case 'auth/invalid-phone-number':
      return 'Invalid phone number format.';
    case 'auth/missing-phone-number':
      return 'Please provide a phone number.';
    case 'auth/quota-exceeded':
      return 'SMS quota exceeded. Please try again later.';
    case 'auth/captcha-check-failed':
      return 'reCAPTCHA verification failed. Please try again.';
    case 'auth/invalid-verification-code':
      return 'Invalid verification code. Please try again.';
    case 'auth/code-expired':
      return 'Verification code has expired. Please request a new one.';
      
    // General Auth
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection and try again.';
    case 'auth/operation-not-allowed':
      return 'This operation is not allowed.';
    case 'auth/popup-closed-by-user':
      return 'Authentication popup was closed before completing the sign-in.';
      
    // Firestore errors
    case 'permission-denied':
      return 'You do not have permission to perform this operation.';
    case 'not-found':
      return 'The requested resource was not found.';
    case 'already-exists':
      return 'This record already exists.';
    case 'failed-precondition':
      return 'Operation failed due to a precondition not being met.';
      
    // Fallback for unknown errors
    default:
      console.error('Firebase error:', error);
      return error.message || 'An unexpected error occurred. Please try again later.';
  }
}

// Initialize Firebase only once
export function initializeFirebase() {
  try {
    // Try to get the existing app
    firebaseApp = getApp();
  } catch (error) {
    // If no app exists, initialize it
    const config = useRuntimeConfig();
    
    const firebaseConfig = {
      apiKey: config.public.firebaseApiKey,
      authDomain: config.public.firebaseAuthDomain,
      projectId: config.public.firebaseProjectId,
      storageBucket: config.public.firebaseStorageBucket,
      messagingSenderId: config.public.firebaseMessagingSenderId,
      appId: config.public.firebaseAppId,
      measurementId: config.public.firebaseMeasurementId || "G-8MVBL8KRLP"
    };
    
    firebaseApp = initializeApp(firebaseConfig);
  }
  
  // Get all the Firebase services you need
  const auth = getAuth(firebaseApp);
  const db = getFirestore(firebaseApp);
  const functions = getFunctions(firebaseApp);
  
  return { app: firebaseApp, auth, db, functions };
}

// Helper function to get the current Firebase app instance
export function getFirebaseApp() {
  if (!firebaseApp) {
    return initializeFirebase().app;
  }
  return firebaseApp;
}