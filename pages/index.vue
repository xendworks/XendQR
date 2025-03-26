<template>
  <div class="page-container">
    <!-- Decorative floating elements -->
    <div class="floating-element"></div>
    <div class="floating-element"></div>
    <div class="floating-element"></div>
    
    <div class="max-w-xl mx-auto px-2 py-8">
      <h1 class="text-2xl font-bold text-gray-900 text-center mb-4">ACCWA CONNECT 2025</h1>
      <h2 class="text-xl text-gray-800 text-center mb-6">ALL INDIA EDUCATIONAL CONSULTANTS AND COLLEGE MEET</h2>
      
      <!-- Event details banner -->
      <div class="bg-indigo-50 border-l-4 border-indigo-500 p-4 mb-8 rounded-md shadow-sm">
        <div class="flex items-center mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-indigo-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="text-sm font-medium text-indigo-700">Event Information</p>
        </div>
        <ul class="text-sm text-gray-700 space-y-1 ml-7">
          <li class="flex items-center">
            <span class="font-medium mr-2">Venue:</span> Suganya Convention Centre, Puducherry
          </li>
          <li class="flex items-center">
            <span class="font-medium mr-2">Date:</span> 28 March 2025, Friday
          </li>
          <li class="flex items-center">
            <span class="font-medium mr-2">Time:</span> 2 PM to 7 PM
          </li>
        </ul>
        <p class="text-sm italic text-gray-600 mt-2 text-center">"Discover a world of knowledge, inspiration and connections at ACCWA Connect 2025"</p>
      </div>
      
      <div class="text-center mt-6">
        <p class="text-gray-600 mb-8">This page will redirect you to the appropriate registration form.</p>
        <div class="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 justify-center">
          <button @click="redirectToStudentForm" class="px-6 py-2 bg-pink-500 text-white font-medium rounded-md focus:ring-2 focus:ring-offset-2 shadow-md transition-all duration-200">
            Go to Student Registration
          </button>
          <button @click="redirectToConsultantForm" class="px-6 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 shadow-md transition-all duration-200">
            Go to Consultant Registration
          </button>
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
import { useRouter } from 'vue-router';

const router = useRouter();

const redirectToConsultantForm = () => {
  router.push('/consultant-register');
};

const redirectToStudentForm = () => {
  router.push('/student-register');
};
</script>

<style>
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
  min-height: 100vh;
  display: flex;
  flex-direction: column;
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

/* Card hover effects */
.bg-white {
  transition: all 0.3s ease;
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
  left: 50%;
  transform: translateX(-50%);
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
</style> 