<template>
    <footer class="bg-white border-t border-gray-200">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div class="md:flex md:items-center md:justify-between">
          <div class="flex justify-center md:justify-start space-x-6">
            <a href="#" class="text-gray-500 hover:text-gray-900">
              About
            </a>
            <a href="#" class="text-gray-500 hover:text-gray-900">
              Privacy
            </a>
            <a href="#" class="text-gray-500 hover:text-gray-900">
              Terms
            </a>
            <a href="#" class="text-gray-500 hover:text-gray-900">
              Contact
            </a>
          </div>
          <div class="mt-4 md:mt-0">
            <p class="text-center text-sm text-gray-500">
              &copy; {{ currentYear }} QR Registration System. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  
  const currentYear = computed(() => new Date().getFullYear())
  </script>