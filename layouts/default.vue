<template>
    <div class="min-h-screen bg-gray-50 flex flex-col">
      <AppHeader />
      <main class="flex-1">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <slot />
        </div>
      </main>
      <AppFooter />
    </div>
  </template>
  
  <script setup>
  import AppHeader from '~/components/AppHeader.vue'
  import AppFooter from '~/components/AppFooter.vue'
  
  // Initialize Firebase on client-side
  onMounted(() => {
    if (process.client) {
      import('~/firebase').then(module => {
        module.initializeFirebase()
      })
    }
  })
  </script>