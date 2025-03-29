// composables/useAuth.js

import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { initializeFirebase, handleFirebaseError } from '~/firebase';

export function useAuth() {
  const user = ref(null);
  const isAuthenticated = computed(() => !!user.value);
  const isAdmin = ref(false);
  const isLoading = ref(true);
  const error = ref(null);
  
  const router = useRouter();

  // Get Firebase services from centralized initialization
  const { auth, db } = initializeFirebase();

  /**
   * Initialize auth state listener
   */
  const initAuth = () => {
    isLoading.value = true;
    
    onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        // User is signed in
        console.log('Auth state changed: User signed in', authUser.email);
        
        user.value = {
          uid: authUser.uid,
          email: authUser.email,
          displayName: authUser.displayName,
          photoURL: authUser.photoURL
        };
        
        // Check if user is admin
        try {
          const userDoc = await getDoc(doc(db, 'users', authUser.uid));
          isAdmin.value = userDoc.exists() && userDoc.data().role === 'admin';
          console.log('Admin check result:', isAdmin.value ? 'User is admin' : 'User is not admin');
        } catch (err) {
          console.error('Error checking admin status:', err);
          isAdmin.value = false;
        }
      } else {
        // User is signed out
        console.log('Auth state changed: User signed out');
        user.value = null;
        isAdmin.value = false;
      }
      
      isLoading.value = false;
    });
  };

  /**
   * Log in with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<object>} - User credential
   */
  const login = async (email, password) => {
    error.value = null;
    isLoading.value = true;
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential;
    } catch (err) {
      console.error('Login error:', err);
      
      // Translate Firebase error messages to user-friendly messages
      switch (err.code) {
        case 'auth/invalid-email':
          error.value = 'Invalid email address format.';
          break;
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          error.value = 'Invalid email or password.';
          break;
        case 'auth/too-many-requests':
          error.value = 'Too many failed login attempts. Please try again later.';
          break;
        case 'auth/user-disabled':
          error.value = 'This account has been disabled.';
          break;
        default:
          error.value = 'Failed to login. Please try again.';
      }
      
      throw error.value;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Register a new user
   * @param {string} email - User email
   * @param {string} password - User password
   * @param {object} userData - Additional user data
   * @returns {Promise<object>} - User credential
   */
  const register = async (email, password, userData = {}) => {
    error.value = null;
    isLoading.value = true;
    
    try {
      // Create the user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update user profile if name is provided
      if (userData.displayName) {
        await updateProfile(userCredential.user, {
          displayName: userData.displayName
        });
      }
      
      // Store additional user data in Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email,
        role: 'user', // Default role
        ...userData,
        createdAt: new Date()
      });
      
      return userCredential;
    } catch (err) {
      console.error('Registration error:', err);
      
      // Translate Firebase error messages
      switch (err.code) {
        case 'auth/email-already-in-use':
          error.value = 'This email is already registered.';
          break;
        case 'auth/invalid-email':
          error.value = 'Invalid email address format.';
          break;
        case 'auth/weak-password':
          error.value = 'Password is too weak. Please use a stronger password.';
          break;
        default:
          error.value = 'Failed to register. Please try again.';
      }
      
      throw error.value;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Log out the current user
   */
  const logout = async () => {
    error.value = null;
    
    try {
      await signOut(auth);
      router.push('/admin/login');
    } catch (err) {
      console.error('Logout error:', err);
      error.value = 'Failed to log out. Please try again.';
      throw error.value;
    }
  };

  /**
   * Send password reset email
   * @param {string} email - User email
   * @returns {Promise<void>}
   */
  const resetPassword = async (email) => {
    error.value = null;
    isLoading.value = true;
    
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (err) {
      console.error('Password reset error:', err);
      
      switch (err.code) {
        case 'auth/invalid-email':
          error.value = 'Invalid email address format.';
          break;
        case 'auth/user-not-found':
          error.value = 'No account found with this email address.';
          break;
        default:
          error.value = 'Failed to send password reset email. Please try again.';
      }
      
      throw error.value;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Check if current user is authenticated
   * @returns {boolean}
   */
  const checkAuth = () => {
    return isAuthenticated.value;
  };

  /**
   * Check if current user is an admin
   * @returns {boolean}
   */
  const checkAdmin = () => {
    return isAdmin.value;
  };

  /**
   * Create an admin user
   * Only used for initial setup or by existing admins
   * @param {string} email - Admin email
   * @param {string} password - Admin password
   * @param {object} userData - Additional user data
   * @returns {Promise<object>} - User credential
   */
  const createAdminUser = async (email, password, userData = {}) => {
    error.value = null;
    isLoading.value = true;
    
    try {
      // Register the user first
      const userCredential = await register(email, password, userData);
      
      // Then update their role to admin
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email,
        role: 'admin',
        ...userData,
        createdAt: new Date()
      }, { merge: true });
      
      return userCredential;
    } catch (err) {
      console.error('Create admin error:', err);
      error.value = typeof err === 'string' ? err : 'Failed to create admin user.';
      throw error.value;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Log in with Google
   * @returns {Promise<object>} - User credential
   */
  const loginWithGoogle = async () => {
    error.value = null;
    isLoading.value = true;
    
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const userEmail = userCredential.user.email;
      
      // Check if user exists in Firestore, if not, create a new record
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      
      // List of approved admin emails - you can customize this list
      const approvedAdminEmails = [
        userEmail, // Automatically approve the current user for testing
        // Add more approved admin emails here
        // 'admin@example.com',
        // 'another-admin@example.com',
      ];
      
      // For development/debug: Output to console
      console.log(`Google login attempt by: ${userEmail}`);
      
      // Check if the user's email is in the approved admin list
      const isApprovedAdmin = approvedAdminEmails.includes(userEmail);
      
      if (!userDoc.exists()) {
        // Create new user document with appropriate role based on email
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          email: userEmail,
          displayName: userCredential.user.displayName,
          photoURL: userCredential.user.photoURL,
          role: isApprovedAdmin ? 'admin' : 'user', // Set role based on email
          createdAt: new Date()
        });
        
        console.log(`Created new user with role: ${isApprovedAdmin ? 'admin' : 'user'}`);
      } else if (isApprovedAdmin && (!userDoc.data().role || userDoc.data().role !== 'admin')) {
        // Update existing user to admin if they're in the approved list but not already an admin
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          role: 'admin'
        }, { merge: true });
        
        console.log(`Updated existing user to admin role`);
      } else {
        console.log(`Existing user with role: ${userDoc.data().role || 'none'}`);
      }
      
      // Check if user is admin after login
      try {
        // Re-fetch the user document if we just updated it
        const updatedUserDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
        isAdmin.value = updatedUserDoc.exists() && updatedUserDoc.data().role === 'admin';
        console.log(`User admin status: ${isAdmin.value}`);
      } catch (err) {
        console.error('Error checking admin status:', err);
        isAdmin.value = false;
      }
      
      return userCredential;
    } catch (err) {
      console.error('Google login error:', err);
      error.value = handleFirebaseError(err);
      throw error.value;
    } finally {
      isLoading.value = false;
    }
  };

  // Initialize auth state listener when the composable is used
  onMounted(() => {
    initAuth();
  });

  // Return auth methods and state
  return {
    user,
    isAuthenticated,
    isAdmin,
    isLoading,
    error,
    login,
    loginWithGoogle,
    register,
    logout,
    resetPassword,
    checkAuth,
    checkAdmin,
    createAdminUser
  };
}