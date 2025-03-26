// composables/useFirestore.js

import { ref } from 'vue';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit
} from 'firebase/firestore';
import { initializeFirebase } from '~/firebase';

export function useFirestore() {
  // Reference to any loading state
  const isLoading = ref(false);
  const error = ref(null);

  // Get Firestore from centralized initialization
  const { db } = initializeFirebase();

  /**
   * Get a document by ID
   * @param {string} collectionName - Name of the Firestore collection
   * @param {string} documentId - ID of the document to fetch
   * @returns {Promise<object|null>} - The document data or null if it doesn't exist
   */
  const getDocument = async (collectionName, documentId) => {
    isLoading.value = true;
    error.value = null;
    
    try {
      const docRef = doc(db, collectionName, documentId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        return null;
      }
    } catch (err) {
      console.error(`Error getting document ${documentId}:`, err);
      error.value = err.message;
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Get all documents from a collection
   * @param {string} collectionName - Name of the Firestore collection
   * @returns {Promise<Array>} - Array of documents
   */
  const getCollection = async (collectionName) => {
    isLoading.value = true;
    error.value = null;
    
    try {
      const querySnapshot = await getDocs(collection(db, collectionName));
      
      const documents = [];
      querySnapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...doc.data() });
      });
      
      return documents;
    } catch (err) {
      console.error(`Error getting collection ${collectionName}:`, err);
      error.value = err.message;
      return [];
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Get documents using a query
   * @param {Object} queryParams - Query parameters
   * @param {string} queryParams.collection - Collection name
   * @param {Array} queryParams.where - Array of where clauses: [[field, operator, value], ...]
   * @param {Array} queryParams.orderBy - Array of orderBy clauses: [[field, direction], ...]
   * @param {number} queryParams.limit - Limit the number of results
   * @returns {Promise<Array>} - Array of documents matching the query
   */
  const getDocumentsByQuery = async (queryParams) => {
    isLoading.value = true;
    error.value = null;
    
    try {
      // Build the query
      let queryConstraints = [];
      
      // Add where clauses
      if (queryParams.where && Array.isArray(queryParams.where)) {
        queryParams.where.forEach(whereClause => {
          if (whereClause.length === 3) {
            queryConstraints.push(where(whereClause[0], whereClause[1], whereClause[2]));
          }
        });
      }
      
      // Add orderBy clauses
      if (queryParams.orderBy && Array.isArray(queryParams.orderBy)) {
        queryParams.orderBy.forEach(orderByClause => {
          if (orderByClause.length === 2) {
            queryConstraints.push(orderBy(orderByClause[0], orderByClause[1]));
          }
        });
      }
      
      // Add limit
      if (queryParams.limit && typeof queryParams.limit === 'number') {
        queryConstraints.push(limit(queryParams.limit));
      }
      
      // Execute query
      const q = query(collection(db, queryParams.collection), ...queryConstraints);
      const querySnapshot = await getDocs(q);
      
      const documents = [];
      querySnapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...doc.data() });
      });
      
      return documents;
    } catch (err) {
      console.error('Error executing query:', err);
      error.value = err.message;
      return [];
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Add a new document with a specific ID
   * @param {string} collectionName - Name of the Firestore collection
   * @param {string} documentId - ID for the new document
   * @param {object} data - Document data
   * @returns {Promise<string>} - The ID of the created document
   */
  const addDocument = async (collectionName, documentId, data) => {
    isLoading.value = true;
    error.value = null;
    
    try {
      const docRef = doc(db, collectionName, documentId);
      await setDoc(docRef, data);
      return documentId;
    } catch (err) {
      console.error(`Error adding document to ${collectionName}:`, err);
      error.value = err.message;
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Add a new document with auto-generated ID
   * @param {string} collectionName - Name of the Firestore collection
   * @param {object} data - Document data
   * @returns {Promise<string>} - The ID of the created document
   */
  const addDocumentWithAutoId = async (collectionName, data) => {
    isLoading.value = true;
    error.value = null;
    
    try {
      const docRef = await addDoc(collection(db, collectionName), data);
      return docRef.id;
    } catch (err) {
      console.error(`Error adding document to ${collectionName}:`, err);
      error.value = err.message;
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Update a document
   * @param {string} collectionName - Name of the Firestore collection
   * @param {string} documentId - ID of the document to update
   * @param {object} data - New document data
   * @returns {Promise<void>}
   */
  const updateDocument = async (collectionName, documentId, data) => {
    isLoading.value = true;
    error.value = null;
    
    try {
      const docRef = doc(db, collectionName, documentId);
      await updateDoc(docRef, data);
    } catch (err) {
      console.error(`Error updating document ${documentId}:`, err);
      error.value = err.message;
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Delete a document
   * @param {string} collectionName - Name of the Firestore collection
   * @param {string} documentId - ID of the document to delete
   * @returns {Promise<void>}
   */
  const deleteDocument = async (collectionName, documentId) => {
    isLoading.value = true;
    error.value = null;
    
    try {
      await deleteDoc(doc(db, collectionName, documentId));
    } catch (err) {
      console.error(`Error deleting document ${documentId}:`, err);
      error.value = err.message;
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // Return all the firestore operations
  return {
    isLoading,
    error,
    getDocument,
    getCollection,
    getDocumentsByQuery,
    addDocument,
    addDocumentWithAutoId,
    updateDocument,
    deleteDocument
  };
}