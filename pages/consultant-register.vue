<template>
    <div class="page-container">
      <!-- Decorative floating elements -->
      <div class="floating-element"></div>
      <div class="floating-element"></div>
      <div class="floating-element"></div>
      
      <div class="max-w-xl mx-auto px-4 py-8">
        <h1 class="text-2xl font-bold text-gray-900 text-center mb-6">ACCWA CONNECT 2025 - ALL INDIA EDUCATIONAL CONSULTANTS AND COLLEGE MEET - REGISTRATION FORM    </h1>
  
        <!-- Registration Form -->
        <div v-if="!isRegistered" class="bg-white rounded-lg shadow-md p-6">
            <img src="/assets/images/lotus-education.jpeg" alt="logo">
            
            <!-- Event highlights -->
            <div class="w-full bg-gray-50 p-3 rounded-md my-4 text-left">
              <h3 class="text-sm font-semibold text-gray-800 mb-2 text-center">HIGHLIGHTS OF ACCWA CONNECT 2025</h3>
              <ul class="text-xs text-gray-600 space-y-1 list-disc pl-4">
                <li>200+ Educational Institutions from all over India & Abroad</li>
                <li>1000+ Education Consultants from all over India</li>
                <li>Expand your business with networking opportunities</li>
                <li>Access to 200+ college fees structures and brochures</li>
                <li>Hi-Fi Dinner (28th March 2025)</li>
                <li>Overnight accommodation based on pre-registration</li>
                <li>Special memento for all participants</li>
              </ul>
              <p class="text-xs italic text-center mt-2 text-gray-500">"Alone we can do so little; together we can do so much."</p>
            </div>
            
          <h2 class="text-lg font-medium text-gray-900 mb-4 mt-8">Consultant Registration</h2>
          <form @submit.prevent="submitRegistration" class="space-y-4">
            <!-- Consultant/Counsellor Name -->
            <div>
              <label for="consultantName" class="block text-sm font-medium text-gray-700">CONSULTANT / COUNSELLOR NAME <span class="text-red-500">*</span></label>
              <input id="consultantName" v-model="formData.consultantName" type="text" required
                placeholder="Enter your full name"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                :class="{ 'border-red-500': errors.consultantName }" />
              <p v-if="errors.consultantName" class="mt-1 text-sm text-red-600">{{ errors.consultantName }}</p>
            </div>
            
            <!-- Consultancy Name -->
            <div>
              <label for="consultancyName" class="block text-sm font-medium text-gray-700">CONSULTANCY NAME <span class="text-red-500">*</span></label>
              <input id="consultancyName" v-model="formData.consultancyName" type="text" required
                placeholder="Enter your consultancy name"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                :class="{ 'border-red-500': errors.consultancyName }" />
              <p v-if="errors.consultancyName" class="mt-1 text-sm text-red-600">{{ errors.consultancyName }}</p>
            </div>
            
            <!-- Mobile Number -->
            <div>
              <label for="mobileNumber" class="block text-sm font-medium text-gray-700">MOBILE NUMBER <span class="text-red-500">*</span></label>
              <input id="mobileNumber" v-model="formData.mobileNumber" type="tel" required
                placeholder="Enter your mobile number"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                :class="{ 'border-red-500': errors.mobileNumber }" @input="formatMobileNumber" />
              <p v-if="errors.mobileNumber" class="mt-1 text-sm text-red-600">{{ errors.mobileNumber }}</p>
            </div>
            
            <!-- WhatsApp Number -->
            <div>
              <label for="whatsappNumber" class="block text-sm font-medium text-gray-700">WHATSAPP NUMBER <span class="text-red-500">*</span></label>
              <input id="whatsappNumber" v-model="formData.whatsappNumber" type="tel" required
                placeholder="Enter your WhatsApp number"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                :class="{ 'border-red-500': errors.whatsappNumber }" @input="formatWhatsAppNumber" />
              <p v-if="errors.whatsappNumber" class="mt-1 text-sm text-red-600">{{ errors.whatsappNumber }}</p>
            </div>
            
            <!-- Office Address -->
            <div>
              <label for="officeAddress" class="block text-sm font-medium text-gray-700">OFFICE ADDRESS <span class="text-red-500">*</span></label>
              <textarea id="officeAddress" v-model="formData.officeAddress" required rows="3"
                placeholder="Enter your office address"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                :class="{ 'border-red-500': errors.officeAddress }"></textarea>
              <p v-if="errors.officeAddress" class="mt-1 text-sm text-red-600">{{ errors.officeAddress }}</p>
            </div>
            
            <!-- District -->
            <div>
              <label for="district" class="block text-sm font-medium text-gray-700">DISTRICT <span class="text-red-500">*</span></label>
              <input id="district" v-model="formData.district" type="text" required
                placeholder="Enter your district"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                :class="{ 'border-red-500': errors.district }" />
              <p v-if="errors.district" class="mt-1 text-sm text-red-600">{{ errors.district }}</p>
            </div>
            
            <!-- State -->
            <div>
              <label for="state" class="block text-sm font-medium text-gray-700">STATE <span class="text-red-500">*</span></label>
              <input id="state" v-model="formData.state" type="text" required
                placeholder="Enter your state"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                :class="{ 'border-red-500': errors.state }" />
              <p v-if="errors.state" class="mt-1 text-sm text-red-600">{{ errors.state }}</p>
            </div>
            
            <!-- ACCWA Membership -->
            <div>
              <label class="block text-sm font-medium text-gray-700">Are you willing to become a Member of ACCWA? <span class="text-red-500">*</span></label>
              <div class="mt-2 space-y-2">
                <div class="flex items-center">
                  <input id="accwaMemberYes" v-model="formData.accwaMember" name="accwaMember" type="radio" value="yes" required
                    class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300" />
                  <label for="accwaMemberYes" class="ml-3 block text-sm text-gray-700">Yes</label>
                </div>
                <div class="flex items-center">
                  <input id="accwaMemberNo" v-model="formData.accwaMember" name="accwaMember" type="radio" value="no" required
                    class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300" />
                  <label for="accwaMemberNo" class="ml-3 block text-sm text-gray-700">No</label>
                </div>
              </div>
              <p v-if="errors.accwaMember" class="mt-1 text-sm text-red-600">{{ errors.accwaMember }}</p>
            </div>
            
            <!-- Main Focusing Colleges -->
            <div>
              <label for="focusingColleges" class="block text-sm font-medium text-gray-700">Main Focusing Colleges</label>
              <textarea id="focusingColleges" v-model="formData.focusingColleges" rows="3"
                placeholder="Enter your main focusing colleges (optional)"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"></textarea>
            </div>
            
            <!-- Number of Members -->
            <div>
              <label class="block text-sm font-medium text-gray-700">How many Members Coming Along with You? <span class="text-red-500">*</span></label>
              <div class="mt-2 grid grid-cols-3 gap-2">
                <div v-for="(num, index) in [1, 2, 3, 4, 5]" :key="index" class="flex items-center">
                  <input :id="'members-' + num" v-model="formData.memberCount" name="memberCount" type="radio" :value="num.toString()" required
                    class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300" />
                  <label :for="'members-' + num" class="ml-3 block text-sm text-gray-700">{{ num }}</label>
                </div>
                <div class="col-span-3 mt-2">
                  <div class="flex items-center">
                    <input id="members-other" v-model="formData.memberCount" name="memberCount" type="radio" value="other" required
                      class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300" />
                    <label for="members-other" class="ml-3 block text-sm text-gray-700">Other:</label>
                    <input v-if="formData.memberCount === 'other'" v-model="formData.memberCountOther" type="number" min="0" 
                      placeholder="Enter number" 
                      class="ml-2 w-20 px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      @input="updateMemberCountFromOther" />
                  </div>
                </div>
              </div>
              <p v-if="errors.memberCount" class="mt-1 text-sm text-red-600">{{ errors.memberCount }}</p>
            </div>
            
            <!-- Food Preference -->
            <div>
              <label class="block text-sm font-medium text-gray-700">Food preference <span class="text-red-500">*</span></label>
              <div class="mt-2 space-y-2">
                <div class="flex items-center">
                  <input id="foodPrefVeg" v-model="formData.foodPreference" name="foodPreference" type="radio" value="veg" required
                    class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300" />
                  <label for="foodPrefVeg" class="ml-3 block text-sm text-gray-700">Veg</label>
                </div>
                <div class="flex items-center">
                  <input id="foodPrefNonVeg" v-model="formData.foodPreference" name="foodPreference" type="radio" value="nonveg" required
                    class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300" />
                  <label for="foodPrefNonVeg" class="ml-3 block text-sm text-gray-700">Non veg</label>
                </div>
              </div>
              <p v-if="errors.foodPreference" class="mt-1 text-sm text-red-600">{{ errors.foodPreference }}</p>
            </div>
            
            <!-- Accommodation Required -->
            <div>
              <label class="block text-sm font-medium text-gray-700">Accommodation Required <span class="text-red-500">*</span></label>
              <div class="mt-2 space-y-2">
                <div class="flex items-center">
                  <input id="accommodationYes" v-model="formData.accommodationRequired" name="accommodationRequired" type="radio" value="yes" required
                    class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300" />
                  <label for="accommodationYes" class="ml-3 block text-sm text-gray-700">Yes</label>
                </div>
                <div class="flex items-center">
                  <input id="accommodationNo" v-model="formData.accommodationRequired" name="accommodationRequired" type="radio" value="no" required
                    class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300" />
                  <label for="accommodationNo" class="ml-3 block text-sm text-gray-700">No</label>
                </div>
              </div>
              <p v-if="errors.accommodationRequired" class="mt-1 text-sm text-red-600">{{ errors.accommodationRequired }}</p>
            </div>
  
            <!-- Email field for contact -->
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">Email Address <span class="text-red-500">*</span></label>
              <input id="email" v-model="formData.email" type="email" required
                placeholder="your.email@example.com"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                :class="{ 'border-red-500': errors.email }" />
              <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
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
                    <div class="text-xs text-gray-500 uppercase">{{ formData.consultantName }}</div>
                    <div class="text-lg font-bold mb-1">{{ formData.consultancyName }}</div>
                    <div class="text-sm text-gray-800">{{ formData.district }}, {{ formData.state }}</div>
                    <div class="text-sm text-gray-800">{{ formatDate() }} | {{ formatEventTime() }}</div>
                  </div>
                </div>
  
                <!-- Event Details -->
                <div class="flex mt-4 text-sm border-t pt-4 border-gray-200">
                  <div class="w-1/2">
                    <div class="uppercase text-gray-500 text-xs">Venue</div>
                    <div class="font-bold">Suganya Convention Center, Puducherry</div>
                  </div>
                  <div class="w-1/2">
                    <div class="uppercase text-gray-500 text-xs">Time</div>
                    <div class="font-bold">2 PM TO 7 PM</div>
                  </div>
                </div>

                <!-- Additional Details -->
                <div class="flex mt-2 text-sm">
                  <div class="w-1/2">
                    <div class="uppercase text-gray-500 text-xs">Attendees</div>
                    <div class="font-bold">{{ displayMemberCount }} {{ parseInt(displayMemberCount) > 1 ? 'Members' : 'Member' }}</div>
                  </div>
                  <div class="w-1/2">
                    <div class="uppercase text-gray-500 text-xs">Food</div>
                    <div class="font-bold">{{ formData.foodPreference === 'veg' ? 'Vegetarian' : 'Non-Vegetarian' }}</div>
                  </div>
                </div>

                <!-- Accommodation -->
                <div class="flex mt-2 text-sm border-b pb-4 border-gray-200">
                  <div class="w-full">
                    <div class="uppercase text-gray-500 text-xs">Accommodation</div>
                    <div class="font-bold">{{ formData.accommodationRequired === 'yes' ? 'Required' : 'Not Required' }}</div>
                  </div>
                </div>
  
                <!-- QR Code -->
                <div class="flex justify-center mt-4 py-2">
                  <div class="bg-white p-2">
                    <qrcode-vue :value="qrCodeData" :size="160" :level="'H'" :background="'#ffffff'" :foreground="'#000000'" :renderAs="'canvas'"></qrcode-vue>
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
    </div>
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
    consultantName: '',
    consultancyName: '',
    mobileNumber: '',
    whatsappNumber: '',
    officeAddress: '',
    district: '',
    state: '',
    accwaMember: '',
    focusingColleges: '',
    memberCount: '',
    memberCountOther: '',
    actualMemberCount: '',
    foodPreference: '',
    accommodationRequired: '',
    email: ''
  });
  
  // Form validation errors
  const errors = reactive({
    consultantName: '',
    consultancyName: '',
    mobileNumber: '',
    whatsappNumber: '',
    officeAddress: '',
    district: '',
    state: '',
    accwaMember: '',
    memberCount: '',
    foodPreference: '',
    accommodationRequired: '',
    email: ''
  });
  
  // Format mobile number as user types
  const formatMobileNumber = () => {
    // Remove all non-digit characters
    let cleaned = formData.mobileNumber.replace(/\D/g, '');
    
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
    
    formData.mobileNumber = formatted;
  };

  // Format WhatsApp number as user types
  const formatWhatsAppNumber = () => {
    // Remove all non-digit characters
    let cleaned = formData.whatsappNumber.replace(/\D/g, '');
    
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
    
    formData.whatsappNumber = formatted;
  };
  
  // Update the member count from the "other" input field
  const updateMemberCountFromOther = () => {
    // Ensure that formData.memberCountOther is a valid number
    if (formData.memberCountOther && !isNaN(formData.memberCountOther)) {
      // Store the actual member count for database but keep "other" selected
      formData.actualMemberCount = formData.memberCountOther;
    }
  };
  
  // Format date for the ticket
  const formatDate = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const eventDate = new Date('2025-03-28');
    
    return `${days[eventDate.getDay()]}, ${eventDate.getDate()} ${months[eventDate.getMonth()]}`;
  };
  
  // Format time for the ticket
  const formatEventTime = () => {
    return '2:00 PM';
  };
  
  // Computed property to get full name
  const fullName = computed(() => {
    return formData.consultantName;
  });
  
  // Computed property for QR code data
  const qrCodeData = computed(() => {
    return JSON.stringify({
      id: registrationId.value,
      name: fullName.value,
      consultancy: formData.consultancyName,
      email: formData.email,
      mobile: formData.mobileNumber,
      district: formData.district,
      state: formData.state,
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
    Object.keys(errors).forEach(key => {
      errors[key] = '';
    });
  
    // Validate consultant name
    if (!formData.consultantName.trim()) {
      errors.consultantName = 'Consultant name is required';
      isValid = false;
    } else if (formData.consultantName.trim().length < 2) {
      errors.consultantName = 'Name must be at least 2 characters';
      isValid = false;
    } else if (!nameRegex.test(formData.consultantName.trim())) {
      errors.consultantName = 'Name contains invalid characters';
      isValid = false;
    }
  
    // Validate consultancy name
    if (!formData.consultancyName.trim()) {
      errors.consultancyName = 'Consultancy name is required';
      isValid = false;
    } else if (formData.consultancyName.trim().length < 2) {
      errors.consultancyName = 'Consultancy name must be at least 2 characters';
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
  
    // Validate mobile number
    const mobileDigits = formData.mobileNumber.replace(/\D/g, '');
    if (!formData.mobileNumber.trim()) {
      errors.mobileNumber = 'Mobile number is required';
      isValid = false;
    } else if (mobileDigits.length < 10) {
      errors.mobileNumber = 'Mobile number must have at least 10 digits';
      isValid = false;
    }
  
    // Validate WhatsApp number
    const whatsappDigits = formData.whatsappNumber.replace(/\D/g, '');
    if (!formData.whatsappNumber.trim()) {
      errors.whatsappNumber = 'WhatsApp number is required';
      isValid = false;
    } else if (whatsappDigits.length < 10) {
      errors.whatsappNumber = 'WhatsApp number must have at least 10 digits';
      isValid = false;
    }

    // Validate office address
    if (!formData.officeAddress.trim()) {
      errors.officeAddress = 'Office address is required';
      isValid = false;
    } else if (formData.officeAddress.trim().length < 5) {
      errors.officeAddress = 'Please enter a complete office address';
      isValid = false;
    }

    // Validate district
    if (!formData.district.trim()) {
      errors.district = 'District is required';
      isValid = false;
    }

    // Validate state
    if (!formData.state.trim()) {
      errors.state = 'State is required';
      isValid = false;
    }

    // Validate ACCWA membership
    if (!formData.accwaMember) {
      errors.accwaMember = 'Please select whether you want to be an ACCWA member';
      isValid = false;
    }

    // Validate member count
    if (!formData.memberCount) {
      errors.memberCount = 'Please specify how many members are coming with you';
      isValid = false;
    }

    // Validate food preference
    if (!formData.foodPreference) {
      errors.foodPreference = 'Please select your food preference';
      isValid = false;
    }

    // Validate accommodation required
    if (!formData.accommodationRequired) {
      errors.accommodationRequired = 'Please specify if accommodation is required';
      isValid = false;
    }
  
    return isValid;
  };
  
  // Generate a unique registration ID
  const generateRegistrationId = () => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `ACCWA-${timestamp.substring(timestamp.length - 4)}-${random}`;
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
        consultantName: formData.consultantName.trim(),
        consultancyName: formData.consultancyName.trim(),
        email: formData.email.trim(),
        mobileNumber: formData.mobileNumber.replace(/\s+/g, ''),
        whatsappNumber: formData.whatsappNumber.replace(/\s+/g, ''),
        officeAddress: formData.officeAddress.trim(),
        district: formData.district.trim(),
        state: formData.state.trim(),
        accwaMember: formData.accwaMember,
        focusingColleges: formData.focusingColleges.trim(),
        memberCount: formData.memberCount === 'other' ? formData.memberCountOther : formData.memberCount,
        foodPreference: formData.foodPreference,
        accommodationRequired: formData.accommodationRequired,
        type: 'consultant'
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
    formData.consultantName = '';
    formData.consultancyName = '';
    formData.mobileNumber = '';
    formData.whatsappNumber = '';
    formData.officeAddress = '';
    formData.district = '';
    formData.state = '';
    formData.accwaMember = '';
    formData.focusingColleges = '';
    formData.memberCount = '';
    formData.memberCountOther = '';
    formData.actualMemberCount = '';
    formData.foodPreference = '';
    formData.accommodationRequired = '';
    formData.email = '';
  
    isRegistered.value = false;
    error.value = '';
    registrationId.value = '';
  };
  
  // Add this computed property with the other computed properties
  const formattedAcademicGroup = computed(() => {
    return formData.consultancyName.charAt(0).toUpperCase() + formData.consultancyName.slice(1);
  });
  
  // Initialize
  onMounted(() => {
    // Any initialization needed
  });

  // New computed property to display the member count
  const displayMemberCount = computed(() => {
    if (formData.memberCount === 'other') {
      return formData.actualMemberCount;
    } else {
      return formData.memberCount;
    }
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

  /* Background pattern and animations */
  body {
    background-color: #f9fafb;
    background-image: 
      radial-gradient(circle at 25px 25px, rgba(99, 102, 241, 0.15) 2%, transparent 0%),
      radial-gradient(circle at 75px 75px, rgba(79, 70, 229, 0.1) 2%, transparent 0%);
    background-size: 100px 100px;
    position: relative;
    overflow-x: hidden;
  }

  body::before {
    content: "";
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(120deg, rgba(99, 102, 241, 0.05) 0%, rgba(244, 244, 255, 0.1) 100%);
    animation: gradientShift 15s ease infinite;
    z-index: -1;
  }

  body::after {
    content: "";
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236366f1' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    opacity: 0.5;
    z-index: -2;
  }

  /* Floating elements animation */
  @keyframes float {
    0% {
      transform: translateY(0) rotate(0deg);
      opacity: 0.8;
    }
    50% {
      transform: translateY(-15px) rotate(4deg);
      opacity: 0.6;
    }
    100% {
      transform: translateY(0) rotate(0deg);
      opacity: 0.8;
    }
  }

  @keyframes gradientShift {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }

  /* Add floating decorative elements */
  .page-container {
    position: relative;
  }

  .floating-element {
    position: fixed;
    pointer-events: none;
    z-index: -1;
  }

  .floating-element:nth-child(1) {
    top: 10%;
    left: 10%;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, rgba(99, 102, 241, 0.05) 70%, transparent 100%);
    animation: float 7s ease-in-out infinite;
  }

  .floating-element:nth-child(2) {
    top: 50%;
    right: 15%;
    width: 150px;
    height: 150px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(129, 140, 248, 0.1) 0%, rgba(129, 140, 248, 0.05) 70%, transparent 100%);
    animation: float 9s ease-in-out infinite;
  }

  .floating-element:nth-child(3) {
    bottom: 15%;
    left: 20%;
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(165, 180, 252, 0.1) 0%, rgba(165, 180, 252, 0.05) 70%, transparent 100%);
    animation: float 8s ease-in-out infinite;
  }

  /* Add card hover effects */
  .bg-white {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .bg-white:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05);
  }

  /* Form input animations */
  input, select {
    transition: all 0.3s ease;
  }

  input:focus, select:focus {
    transform: scale(1.01);
  }

  /* Button animations */
  button {
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }

  button::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 5px;
    height: 5px;
    background: rgba(255, 255, 255, 0.3);
    opacity: 0;
    border-radius: 100%;
    transform: scale(1, 1) translate(-50%);
    transform-origin: 50% 50%;
  }

  button:focus:not(:active)::after {
    animation: ripple 1s ease-out;
  }

  @keyframes ripple {
    0% {
      transform: scale(0, 0);
      opacity: 0.5;
    }
    20% {
      transform: scale(25, 25);
      opacity: 0.3;
    }
    100% {
      opacity: 0;
      transform: scale(40, 40);
    }
  }

  /* Fade-in animation for content */
  .page-container > div {
    animation: fadeIn 0.8s ease-out;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Section separator line with animation */
  h2 {
    position: relative;
    overflow: hidden;
    padding-bottom: 10px;
  }

  h2::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 50px;
    height: 3px;
    background: linear-gradient(90deg, rgba(99, 102, 241, 1) 0%, rgba(165, 180, 252, 1) 100%);
    animation: expandLine 2s ease-out forwards;
  }

  @keyframes expandLine {
    from {
      width: 0;
    }
    to {
      width: 50px;
    }
  }

  /* Add subtle background animation to the ticket */
  .ticket-container {
    position: relative;
    overflow: hidden;
  }

  .ticket-container::before, .ticket-container::after {
    content: '';
    position: absolute;
    z-index: -1;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: rgb(99, 102, 241, 0.1);
    box-shadow: 0 0 0 0 rgba(99, 102, 241, 1);
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0% {
      transform: scale(0.95) translateY(-50%);
      box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.7);
    }
    
    70% {
      transform: scale(1) translateY(-50%);
      box-shadow: 0 0 0 10px rgba(99, 102, 241, 0);
    }
    
    100% {
      transform: scale(0.95) translateY(-50%);
      box-shadow: 0 0 0 0 rgba(99, 102, 241, 0);
    }
  }
  </style>