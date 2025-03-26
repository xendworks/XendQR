<template>
  <div class="max-w-md mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold text-gray-900 text-center mb-6">Event Registration</h1>

    <!-- Registration Form -->
    <div v-if="!isRegistered" class="bg-white rounded-lg shadow-md p-6">
      <!-- Form content remains the same -->
      <h2 class="text-lg font-medium text-gray-900 mb-4">Personal Information</h2>

      <form @submit.prevent="submitRegistration" class="space-y-4">
        <!-- Form elements remain the same -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label for="firstName" class="block text-sm font-medium text-gray-700">First Name</label>
            <input id="firstName" v-model="formData.firstName" type="text" required
              placeholder="Enter your first name"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              :class="{ 'border-red-500': errors.firstName }" />
            <p v-if="errors.firstName" class="mt-1 text-sm text-red-600">{{ errors.firstName }}</p>
          </div>
          <div>
            <label for="lastName" class="block text-sm font-medium text-gray-700">Last Name</label>
            <input id="lastName" v-model="formData.lastName" type="text" required
              placeholder="Enter your last name"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              :class="{ 'border-red-500': errors.lastName }" />
            <p v-if="errors.lastName" class="mt-1 text-sm text-red-600">{{ errors.lastName }}</p>
          </div>
        </div>

        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">Email Address</label>
          <input id="email" v-model="formData.email" type="email" required
            placeholder="your.email@example.com"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            :class="{ 'border-red-500': errors.email }" />
          <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
        </div>

        <div>
          <label for="phone" class="block text-sm font-medium text-gray-700">Phone Number</label>
          <input id="phone" v-model="formData.phone" type="tel" required
            placeholder="Enter your mobile number"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            :class="{ 'border-red-500': errors.phone }" @input="formatPhoneNumber" />
          <p v-if="errors.phone" class="mt-1 text-sm text-red-600">{{ errors.phone }}</p>
        </div>

        <div>
          <label for="schoolName" class="block text-sm font-medium text-gray-700">School Name</label>
          <input id="schoolName" v-model="formData.schoolName" type="text" required
            placeholder="Enter your school or college name"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            :class="{ 'border-red-500': errors.schoolName }" />
          <p v-if="errors.schoolName" class="mt-1 text-sm text-red-600">{{ errors.schoolName }}</p>
        </div>

        <div>
          <label for="academicGroup" class="block text-sm font-medium text-gray-700">12th Academic Group</label>
          <select id="academicGroup" v-model="formData.academicGroup" required
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            :class="{ 'border-red-500': errors.academicGroup }">
            <option value="" disabled>Select your academic group</option>
            <option value="computer-science">Computer Science</option>
            <option value="biology">Biology</option>
            <option value="commerce">Commerce</option>
            <option value="arts">Arts</option>
            <option value="other">Other</option>
          </select>
          <p v-if="errors.academicGroup" class="mt-1 text-sm text-red-600">{{ errors.academicGroup }}</p>
        </div>

        <div>
          <label for="class12Marks" class="block text-sm font-medium text-gray-700">Class 12th Marks (%)</label>
          <input id="class12Marks" v-model="formData.class12Marks" type="number" min="0" max="100" step="0.01" required
            placeholder="Enter your percentage (e.g. 85.5)"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            :class="{ 'border-red-500': errors.class12Marks }" />
          <p v-if="errors.class12Marks" class="mt-1 text-sm text-red-600">{{ errors.class12Marks }}</p>
        </div>

        <div class="pt-4">
          <button type="submit"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            :disabled="isLoading">
            <span v-if="isLoading" class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
              </svg>
              Processing...
            </span>
            <span v-else>Register</span>
          </button>
        </div>
      </form>
    </div>

    <!-- Registration Success with Ticket View -->
    <div v-if="isRegistered" class="bg-white rounded-lg shadow-md p-6">
      <div class="text-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-green-500" fill="none" viewBox="0 0 24 24"
          stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h2 class="mt-3 text-xl font-bold text-gray-900">Registration Complete!</h2>
        <p class="mt-2 text-sm text-gray-600">
          Thank you for registering! Please save your pass for check-in at the event.
        </p>
      </div>

      <!-- Ticket Preview -->
      <div class="mt-6">
        <div ref="ticketElement" class="ticket-container bg-gray-900 rounded-lg overflow-hidden shadow-lg border-2 border-gray-800 mx-auto" style="max-width: 350px;">
          <!-- Ticket Header -->
          <div class="bg-gray-800 px-4 py-2 flex justify-between items-center">
            <div class="font-bold text-white tracking-wide text-sm">
              <span class="text-white">XendCampus</span>
              <span class="text-red-500 ml-2">Events</span>
            </div>
          </div>

          <!-- Ticket Content -->
          <div class="p-4 bg-white">
            <div class="flex space-x-3">
              <!-- Event Image -->
              <div class="w-20 bg-gray-200 rounded overflow-hidden">
                <div class="w-full h-full flex items-center justify-center">
                 <img src="/assets/images/logo.png" alt="logo" class="w-10 h-10">
                </div>
              </div>
              
              <!-- Event Details -->
              <div class="flex-1">
                <div class="text-xs text-gray-500 uppercase">{{ formData.firstName }} {{ formData.lastName }}</div>
                <div class="text-lg font-bold mb-1">{{ formattedAcademicGroup }}</div>
                <div class="text-sm text-gray-800">{{ formData.schoolName }}</div>
                <div class="text-sm text-gray-800">{{ formatDate() }} | {{ formatEventTime() }}</div>
              </div>
            </div>

            <!-- Screen and Seat -->
            <div class="flex mt-4 text-sm border-t pt-4 border-gray-200">
              <div class="w-1/2">
                <div class="uppercase text-gray-500 text-xs">Venue</div>
                <div class="font-bold">Suganya Convention Center, Pondicherry</div>
              </div>
              <div class="w-1/2">
                <div class="uppercase text-gray-500 text-xs">Time</div>
                <div class="font-bold">8.30 AM TO 2.30 PM</div>
              </div>
            </div>

            <!-- QR Code -->
            <div class="flex justify-center mt-4 py-2">
              <div class="bg-white p-2">
                <qrcode-vue :value="qrCodeData" :size="160" level="H" render-as="canvas"></qrcode-vue>
              </div>
            </div>

            <!-- Registration ID -->
            <div class="text-center text-xs text-gray-500 mt-2">
              {{ registrationId }}
            </div>

            <!-- Footer Note -->
            <div class="text-xs text-center text-gray-500 mt-3 italic">
              This registration can be cancelled up to 24 hours before the event as per ticket policy.
            </div>
          </div>
        </div>
      </div>

      <div class="mt-6 space-y-3">
        <button @click="downloadTicket"
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Download Pass
        </button>

        <button @click="resetForm"
          class="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Register Another
        </button>
      </div>
    </div>

    <!-- Error Alert -->
    <div v-if="error" class="mt-4 p-4 bg-red-50 rounded-md">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
            aria-hidden="true">
            <path fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">{{ error }}</h3>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Footer -->
  <footer class="text-center mt-8 pb-4 text-gray-600 text-sm">
    <p>powered by <span class="font-semibold">XendCampus</span></p>
  </footer>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { initializeFirebase } from '~/firebase';
import { doc, setDoc } from 'firebase/firestore';
import html2canvas from 'html2canvas';
import QrcodeVue from 'qrcode.vue';

const { db } = initializeFirebase();

// Component state
const isRegistered = ref(false);
const isLoading = ref(false);
const error = ref('');
const registrationId = ref('');
const ticketElement = ref(null);

// Form data
const formData = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  schoolName: '',
  academicGroup: '',
  class12Marks: ''
});

// Form validation errors
const errors = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  schoolName: '',
  academicGroup: '',
  class12Marks: ''
});

// Format phone number as user types
const formatPhoneNumber = () => {
  // Remove all non-digit characters
  let cleaned = formData.phone.replace(/\D/g, '');
  
  // Limit to 15 digits
  cleaned = cleaned.substring(0, 15);
  
  // Format the number as per Indian mobile number format (assuming Indian format)
  let formatted = cleaned;
  if (cleaned.length > 0) {
    if (cleaned.length <= 5) {
      formatted = cleaned;
    } else if (cleaned.length <= 10) {
      formatted = cleaned.replace(/(\d{5})(\d{0,5})/, '$1 $2');
    } else {
      formatted = cleaned.replace(/(\d{5})(\d{5})(\d{0,5})/, '$1 $2 $3');
    }
  }
  
  formData.phone = formatted;
};

// Format date for the ticket
const formatDate = () => {
  const now = new Date();
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const eventDate = new Date('2025-03-28');
  
  return `${days[eventDate.getDay()]}, ${eventDate.getDate()} ${months[eventDate.getMonth()]}`;
};

// Format time for the ticket
const formatEventTime = () => {
  return '10:00 AM';
};

// Computed property to get full name
const fullName = computed(() => {
  return `${formData.firstName} ${formData.lastName}`.trim();
});

// Computed property for QR code data
const qrCodeData = computed(() => {
  return JSON.stringify({
    id: registrationId.value,
    name: fullName.value,
    email: formData.email,
    school: formData.schoolName,
    academicGroup: formData.academicGroup,
    timestamp: Date.now()
  });
});

// Email validation regex
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Name validation regex - allow letters, spaces, hyphens, and apostrophes
const nameRegex = /^[a-zA-Z\s'-]+$/;

// Validate form
const validateForm = () => {
  let isValid = true;

  // Reset errors
  errors.firstName = '';
  errors.lastName = '';
  errors.email = '';
  errors.phone = '';
  errors.schoolName = '';
  errors.academicGroup = '';
  errors.class12Marks = '';

  // Validate first name
  if (!formData.firstName.trim()) {
    errors.firstName = 'First name is required';
    isValid = false;
  } else if (formData.firstName.trim().length < 2) {
    errors.firstName = 'First name must be at least 2 characters';
    isValid = false;
  } else if (!nameRegex.test(formData.firstName.trim())) {
    errors.firstName = 'First name contains invalid characters';
    isValid = false;
  }

  // Validate last name
  if (!formData.lastName.trim()) {
    errors.lastName = 'Last name is required';
    isValid = false;
  } else if (!nameRegex.test(formData.lastName.trim())) {
    errors.lastName = 'Last name contains invalid characters';
    isValid = false;
  }

  // Validate email
  if (!formData.email.trim()) {
    errors.email = 'Email is required';
    isValid = false;
  } else if (!emailRegex.test(formData.email)) {
    errors.email = 'Please enter a valid email address';
    isValid = false;
  }

  // Validate phone
  const phoneDigits = formData.phone.replace(/\D/g, '');
  if (!formData.phone.trim()) {
    errors.phone = 'Phone number is required';
    isValid = false;
  } else if (phoneDigits.length < 10) {
    errors.phone = 'Phone number must have at least 10 digits';
    isValid = false;
  }

  // Validate school name
  if (!formData.schoolName.trim()) {
    errors.schoolName = 'School name is required';
    isValid = false;
  } else if (formData.schoolName.trim().length < 3) {
    errors.schoolName = 'School name must be at least 3 characters';
    isValid = false;
  }

  // Validate academic group
  if (!formData.academicGroup) {
    errors.academicGroup = 'Please select your academic group';
    isValid = false;
  }

  // Validate 12th class marks
  if (!formData.class12Marks) {
    errors.class12Marks = 'Class 12th marks are required';
    isValid = false;
  } else if (isNaN(formData.class12Marks) || formData.class12Marks < 0 || formData.class12Marks > 100) {
    errors.class12Marks = 'Marks must be a number between 0 and 100';
    isValid = false;
  }

  return isValid;
};

// Generate a unique registration ID
const generateRegistrationId = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `XC-${timestamp.substring(timestamp.length - 4)}-${random}`;
};

// Submit registration
const submitRegistration = async () => {
  if (!validateForm()) return;

  try {
    isLoading.value = true;
    error.value = '';

    // Generate registration ID and set it
    registrationId.value = generateRegistrationId();

    const attendeeData = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      fullName: fullName.value,
      email: formData.email.trim(),
      phone: formData.phone.replace(/\s+/g, ''),
      schoolName: formData.schoolName.trim(),
      academicGroup: formData.academicGroup,
      mark: formData.class12Marks.toString()
    };

    await setDoc(doc(db, 'attendees', registrationId.value), attendeeData);

    isRegistered.value = true;

  } catch (err) {
    console.error('Registration error:', err);
    error.value = 'Failed to process registration. Please try again.';
  } finally {
    isLoading.value = false;
  }
};

// Download the full ticket with QR code
const downloadTicket = async () => {
  if (!ticketElement.value) {
    error.value = 'Could not generate ticket. Please try again.';
    return;
  }

  try {
    // Create screenshot of the ticket
    const canvas = await html2canvas(ticketElement.value, {
      scale: 2, // Higher scale for better quality
      backgroundColor: null,
      logging: false
    });
    
    // Convert to image
    const imageData = canvas.toDataURL('image/png');
    
    // Create download link
    const link = document.createElement('a');
    link.download = `xendcampus-pass-${registrationId.value}.png`;
    link.href = imageData;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (err) {
    console.error('Error downloading ticket:', err);
    error.value = 'Could not download ticket. Please take a screenshot instead.';
  }
};

// Reset form to register another person
const resetForm = () => {
  formData.firstName = '';
  formData.lastName = '';
  formData.email = '';
  formData.phone = '';
  formData.schoolName = '';
  formData.academicGroup = '';
  formData.class12Marks = '';

  isRegistered.value = false;
  error.value = '';
  registrationId.value = '';
};

// Add this computed property with the other computed properties
const formattedAcademicGroup = computed(() => {
  return formData.academicGroup.charAt(0).toUpperCase() + formData.academicGroup.slice(1);
});

// Initialize
onMounted(() => {
  // Any initialization needed
});
</script>

<style>
/* Override global styles for input elements */
input[type="text"],
input[type="email"],
input[type="tel"],
input[type="number"],
select {
  appearance: none;
  border-width: 1px;
  padding: 0.5rem 0.75rem;
  font-size: 1rem;
  line-height: 1.5;
  border-radius: 0.375rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  border-color: #d1d5db;
  width: 100%;
}

input[type="text"]:focus,
input[type="email"]:focus,
input[type="tel"]:focus,
input[type="number"]:focus,
select:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

/* Ticket styling */
.ticket-container {
  position: relative;
}

.ticket-container:before,
.ticket-container:after {
  content: '';
  position: absolute;
  width: 20px;
  height: 20px;
  background: #f3f4f6;
  border-radius: 50%;
  z-index: 2;
}

.ticket-container:before {
  top: 50%;
  left: -10px;
  transform: translateY(-50%);
}

.ticket-container:after {
  top: 50%;
  right: -10px;
  transform: translateY(-50%);
}
</style>