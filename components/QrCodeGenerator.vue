<template>
    <div>
      <div
        ref="qrContainer"
        class="qr-code flex justify-center items-center"
        :class="[
          size === 'sm' ? 'w-32 h-32' : 
          size === 'md' ? 'w-48 h-48' : 
          size === 'lg' ? 'w-64 h-64' : 
          'w-48 h-48'
        ]"
      >
        <div v-if="isLoading" class="animate-pulse bg-gray-200 rounded-md w-full h-full flex items-center justify-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
        <div v-else-if="errorMessage" class="bg-red-50 p-4 rounded-md text-red-600 text-center">
          <p>{{ errorMessage }}</p>
        </div>
        <!-- QR code will be rendered inside this container -->
      </div>
      
      <div v-if="showDownload && !isLoading && !errorMessage" class="mt-4">
        <button 
          @click="downloadQRCode" 
          class="w-full btn btn-primary flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download QR Code
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, watch } from 'vue'
  import QRCode from 'qrcode'
  
  // Props definition
  const props = defineProps({
    value: {
      type: [String, Object],
      required: true
    },
    size: {
      type: String,
      default: 'md', // sm, md, lg
      validator: (value) => ['sm', 'md', 'lg'].includes(value)
    },
    color: {
      type: String,
      default: '#000000'
    },
    bgColor: {
      type: String,
      default: '#FFFFFF'
    },
    errorCorrectionLevel: {
      type: String,
      default: 'M', // L, M, Q, H (low to high)
      validator: (value) => ['L', 'M', 'Q', 'H'].includes(value)
    },
    margin: {
      type: Number,
      default: 4
    },
    showDownload: {
      type: Boolean,
      default: true
    },
    fileName: {
      type: String,
      default: 'qrcode'
    }
  })
  
  // Component state
  const qrContainer = ref(null)
  const isLoading = ref(true)
  const errorMessage = ref('')
  const qrInstance = ref(null)
  
  // Generate the QR code
  const generateQRCode = async () => {
    try {
      isLoading.value = true
      errorMessage.value = ''
      
      // Clear previous QR code
      if (qrContainer.value) {
        qrContainer.value.innerHTML = ''
      }
      
      // Prepare data
      let data = props.value
      if (typeof data === 'object') {
        data = JSON.stringify(data)
      }
      
      // Options for QR code
      const options = {
        errorCorrectionLevel: props.errorCorrectionLevel,
        margin: props.margin,
        color: {
          dark: props.color,
          light: props.bgColor
        },
        width: getSizeInPixels(props.size)
      }
      
      // Generate QR code as canvas
      const canvas = document.createElement('canvas')
      await QRCode.toCanvas(canvas, data, options)
      
      // Save reference for download
      qrInstance.value = canvas
      
      // Append to container
      if (qrContainer.value) {
        qrContainer.value.appendChild(canvas)
      }
    } catch (error) {
      console.error('QR code generation error:', error)
      errorMessage.value = 'Failed to generate QR code'
    } finally {
      isLoading.value = false
    }
  }
  
  // Get size in pixels based on size prop
  const getSizeInPixels = (size) => {
    switch (size) {
      case 'sm': return 128
      case 'md': return 192
      case 'lg': return 256
      default: return 192
    }
  }
  
  // Download QR code as PNG
  const downloadQRCode = () => {
    if (!qrInstance.value) return
    
    try {
      const link = document.createElement('a')
      link.download = `${props.fileName}.png`
      link.href = qrInstance.value.toDataURL('image/png')
      link.click()
    } catch (error) {
      console.error('QR code download error:', error)
      errorMessage.value = 'Failed to download QR code'
    }
  }
  
  // Expose methods to parent component
  defineExpose({
    generateQRCode,
    downloadQRCode
  })
  
  // Generate QR code on mount
  onMounted(() => {
    generateQRCode()
  })
  
  // Re-generate QR code when value changes
  watch(() => props.value, () => {
    generateQRCode()
  })
  </script>