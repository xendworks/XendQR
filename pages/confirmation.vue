<template>
    <div class="confirmation-container">
      <div class="confirmation-card">
        <div v-if="registrationData">
          <div class="confirmation-header">
            <h1>Registration Confirmed!</h1>
            <p class="subtitle">Thank you for registering for our event</p>
          </div>
          
          <div class="qr-code-section">
            <h2>Your QR Code</h2>
            <p>Present this at the event check-in for quick entry</p>
            <div class="qr-code-container">
              <QrCodeGenerator :value="qrCodeData" />
            </div>
            <button class="btn primary-btn" @click="downloadQrCode">
              Download QR Code
            </button>
          </div>
          
          <div class="registration-details">
            <h2>Registration Details</h2>
            <div class="details-grid">
              <div class="detail-item">
                <span class="detail-label">Name:</span>
                <span class="detail-value">{{ registrationData.firstName }} {{ registrationData.lastName }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Email:</span>
                <span class="detail-value">{{ registrationData.email }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Phone:</span>
                <span class="detail-value">{{ registrationData.phone }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Organization:</span>
                <span class="detail-value">{{ registrationData.organization || 'N/A' }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Registration ID:</span>
                <span class="detail-value">{{ registrationData.id }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Date Registered:</span>
                <span class="detail-value">{{ formatDate(registrationData.registrationDate) }}</span>
              </div>
            </div>
          </div>
          
          <div class="event-information">
            <h2>Event Information</h2>
            <div class="event-details">
              <div class="event-detail">
                <div class="detail-icon">📅</div>
                <div class="detail-content">
                  <h3>Date & Time</h3>
                  <p>June 15, 2025 | 9:00 AM - 5:00 PM</p>
                </div>
              </div>
              <div class="event-detail">
                <div class="detail-icon">📍</div>
                <div class="detail-content">
                  <h3>Location</h3>
                  <p>Tech Conference Center<br>123 Innovation Street<br>San Francisco, CA 94103</p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="action-buttons">
            <button class="btn secondary-btn" @click="sendEmailConfirmation">
              Email Confirmation
            </button>
            <NuxtLink to="/" class="btn text-btn">
              Return to Home
            </NuxtLink>
          </div>
        </div>
        
        <div v-else class="no-data-message">
          <h2>No Registration Data Found</h2>
          <p>We couldn't find your registration information. Please register first.</p>
          <NuxtLink to="/register" class="btn primary-btn">
            Go to Registration
          </NuxtLink>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useFirestore } from '~/composables/useFirestore';
  
  const { getDocument } = useFirestore();
  const registrationData = ref(null);
  const qrCodeData = ref('');
  
  onMounted(() => {
    // Try to get registration data from localStorage
    const storedData = localStorage.getItem('registrationData');
    const storedQrCode = localStorage.getItem('qrCodeData');
    
    if (storedData) {
      try {
        registrationData.value = JSON.parse(storedData);
        
        // Parse the registration date if it exists
        if (registrationData.value.registrationDate) {
          registrationData.value.registrationDate = new Date(registrationData.value.registrationDate);
        }
      } catch (error) {
        console.error('Error parsing stored registration data:', error);
      }
    }
    
    if (storedQrCode) {
      qrCodeData.value = storedQrCode;
    } else if (registrationData.value) {
      // Generate QR code data if not available
      qrCodeData.value = JSON.stringify({
        registrationId: registrationData.value.id,
        name: `${registrationData.value.firstName} ${registrationData.value.lastName}`,
        email: registrationData.value.email
      });
    }
    
    // If no data in localStorage, try to get from URL params
    if (!registrationData.value) {
      const urlParams = new URLSearchParams(window.location.search);
      const registrationId = urlParams.get('id');
      
      if (registrationId) {
        fetchRegistrationData(registrationId);
      }
    }
  });
  
  const fetchRegistrationData = async (registrationId) => {
    try {
      const data = await getDocument('registrations', registrationId);
      
      if (data) {
        registrationData.value = data;
        
        // Generate QR code data
        qrCodeData.value = JSON.stringify({
          registrationId: data.id,
          name: `${data.firstName} ${data.lastName}`,
          email: data.email
        });
      }
    } catch (error) {
      console.error('Error fetching registration data:', error);
    }
  };
  
  const formatDate = (date) => {
    if (!date) return 'N/A';
    
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    
    return new Date(date).toLocaleDateString(undefined, options);
  };
  
  const downloadQrCode = () => {
    // This function would be implemented to download the QR code as an image
    alert('QR Code download functionality will be implemented here');
  };
  
  const sendEmailConfirmation = () => {
    // This function would trigger a cloud function to send a confirmation email
    alert('An email confirmation will be sent to your registered email address');
  };
  </script>
  
  <style scoped>
  .confirmation-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
  }
  
  .confirmation-card {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    padding: 2rem;
  }
  
  .confirmation-header {
    text-align: center;
    margin-bottom: 2rem;
  }
  
  .confirmation-header h1 {
    color: #2ecc71;
    margin-bottom: 0.5rem;
  }
  
  .subtitle {
    color: #7f8c8d;
    font-size: 1.1rem;
  }
  
  .qr-code-section {
    text-align: center;
    margin-bottom: 3rem;
    padding: 1.5rem;
    background-color: #f8f9fa;
    border-radius: 8px;
  }
  
  .qr-code-section h2 {
    margin-bottom: 0.5rem;
  }
  
  .qr-code-container {
    margin: 1.5rem auto;
    max-width: 200px;
  }
  
  .registration-details {
    margin-bottom: 2rem;
  }
  
  .registration-details h2 {
    border-bottom: 1px solid #ecf0f1;
    padding-bottom: 0.5rem;
    margin-bottom: 1rem;
  }
  
  .details-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1rem;
  }
  
  .detail-item {
    margin-bottom: 0.5rem;
  }
  
  .detail-label {
    font-weight: bold;
    color: #7f8c8d;
  }
  
  .event-information {
    margin-bottom: 2rem;
  }
  
  .event-information h2 {
    border-bottom: 1px solid #ecf0f1;
    padding-bottom: 0.5rem;
    margin-bottom: 1rem;
  }
  
  .event-details {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
  }
  
  .event-detail {
    display: flex;
    gap: 1rem;
  }
  
  .detail-icon {
    font-size: 2rem;
  }
  
  .detail-content h3 {
    margin-bottom: 0.5rem;
  }
  
  .action-buttons {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-top: 2rem;
  }
  
  .btn {
    padding: 0.75rem 1.5rem;
    border-radius: 4px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
    border: none;
    text-decoration: none;
    display: inline-block;
  }
  
  .primary-btn {
    background-color: #3498db;
    color: white;
  }
  
  .primary-btn:hover {
    background-color: #2980b9;
  }
  
  .secondary-btn {
    background-color: #ecf0f1;
    color: #2c3e50;
  }
  
  .secondary-btn:hover {
    background-color: #bdc3c7;
  }
  
  .text-btn {
    background: none;
    color: #7f8c8d;
  }
  
  .text-btn:hover {
    color: #2c3e50;
  }
  
  .no-data-message {
    text-align: center;
    padding: 3rem 2rem;
  }
  
  .no-data-message h2 {
    margin-bottom: 1rem;
    color: #e74c3c;
  }
  
  .no-data-message p {
    margin-bottom: 1.5rem;
  }
  
  @media (max-width: 600px) {
    .details-grid {
      grid-template-columns: 1fr;
    }
    
    .event-details {
      grid-template-columns: 1fr;
    }
    
    .action-buttons {
      flex-direction: column;
    }
    
    .btn {
      width: 100%;
      text-align: center;
      margin-bottom: 0.5rem;
    }
  }
  </style>