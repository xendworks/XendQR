<template>
    <div class="qr-scanner">
      <!-- Camera selection -->
      <div v-if="showCameraSelection && cameras.length > 1" class="mb-3">
        <label for="camera-select" class="form-label">Select Camera</label>
        <select 
          id="camera-select" 
          v-model="selectedCamera" 
          @change="stopScanner(); startScanner()" 
          class="form-input"
        >
          <option v-for="camera in cameras" :key="camera.deviceId" :value="camera.deviceId">
            {{ camera.label || `Camera ${cameras.indexOf(camera) + 1}` }}
          </option>
        </select>
      </div>
      
      <!-- Scanner container -->
      <div 
        class="relative overflow-hidden rounded-lg bg-black"
        :class="[
          size === 'sm' ? 'w-full h-48' : 
          size === 'md' ? 'w-full h-64' : 
          size === 'lg' ? 'w-full h-80' : 
          'w-full h-64'
        ]"
      >
        <!-- Video element for camera feed -->
        <video 
          ref="video" 
          class="w-full h-full object-cover" 
          autoplay 
          playsinline
          muted
        ></video>
        
        <!-- Scanner overlay with scanning area -->
        <div class="scanner-overlay">
          <div class="scanner-crosshair"></div>
        </div>
        
        <!-- Status messages -->
        <div class="absolute inset-x-0 bottom-0 p-2 bg-black bg-opacity-50 text-white text-sm text-center">
          {{ statusMessage }}
        </div>
        
        <!-- Loading state -->
        <div 
          v-if="isLoading" 
          class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70"
        >
          <div class="spinner"></div>
        </div>
      </div>
      
      <!-- Scanner controls -->
      <div v-if="showControls" class="mt-3 flex space-x-2">
        <button 
          v-if="!isScanning" 
          @click="startScanner" 
          class="btn btn-primary flex-1"
          :disabled="isLoading"
        >
          Start Scanner
        </button>
        <button 
          v-else 
          @click="stopScanner" 
          class="btn btn-secondary flex-1"
          :disabled="isLoading"
        >
          Stop Scanner
        </button>
        <button 
          @click="toggleFlash" 
          class="btn btn-secondary"
          :disabled="isLoading || !hasFlash"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </button>
      </div>
      
      <!-- Error message -->
      <div v-if="errorMessage" class="mt-3 p-3 bg-red-50 rounded-md text-red-600 text-sm">
        {{ errorMessage }}
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onBeforeUnmount } from 'vue'
  
  // Props definition
  const props = defineProps({
    size: {
      type: String,
      default: 'md', // sm, md, lg
      validator: (value) => ['sm', 'md', 'lg'].includes(value)
    },
    showControls: {
      type: Boolean,
      default: true
    },
    showCameraSelection: {
      type: Boolean,
      default: true
    },
    autoStart: {
      type: Boolean,
      default: true
    },
    scanInterval: {
      type: Number,
      default: 100 // milliseconds
    }
  })
  
  // Emits
  const emit = defineEmits(['scan', 'error', 'camera-change', 'start', 'stop'])
  
  // Component state
  const video = ref(null)
  const isLoading = ref(false)
  const isScanning = ref(false)
  const errorMessage = ref('')
  const statusMessage = ref('Camera inactive')
  const scanIntervalId = ref(null)
  const stream = ref(null)
  const cameras = ref([])
  const selectedCamera = ref('')
  const hasFlash = ref(false)
  const flashOn = ref(false)
  
  // Get available cameras
  const getCameras = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
        throw new Error('Camera access not supported in this browser')
      }
      
      const devices = await navigator.mediaDevices.enumerateDevices()
      const videoDevices = devices.filter(device => device.kind === 'videoinput')
      
      cameras.value = videoDevices
      
      if (videoDevices.length > 0 && !selectedCamera.value) {
        // Prefer back camera on mobile devices
        const backCamera = videoDevices.find(device => 
          device.label.toLowerCase().includes('back') || 
          device.label.toLowerCase().includes('rear')
        )
        
        selectedCamera.value = backCamera?.deviceId || videoDevices[0].deviceId
      }
      
      emit('camera-change', selectedCamera.value)
    } catch (error) {
      handleError('Failed to get cameras: ' + error.message)
    }
  }
  
  // Start the QR code scanner
  const startScanner = async () => {
    try {
      isLoading.value = true
      errorMessage.value = ''
      
      // Check for browser support
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access not supported in this browser')
      }
      
      // Get cameras if not already fetched
      if (cameras.value.length === 0) {
        await getCameras()
      }
      
      // Request camera access
      const constraints = {
        video: {
          deviceId: selectedCamera.value ? { exact: selectedCamera.value } : undefined,
          facingMode: selectedCamera.value ? undefined : 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      }
      
      // Stop any existing stream
      if (stream.value) {
        stopStream()
      }
      
      // Start new stream
      stream.value = await navigator.mediaDevices.getUserMedia(constraints)
      
      // Set video source
      if (video.value) {
        video.value.srcObject = stream.value
      }
      
      // Check if flash is available
      hasFlash.value = stream.value.getVideoTracks().some(track => {
        const capabilities = track.getCapabilities?.()
        return capabilities?.torch || false
      })
      
      // Start scanning for QR codes
      startScanning()
      
      isScanning.value = true
      statusMessage.value = 'Scanning for QR code...'
      
      emit('start')
    } catch (error) {
      handleError('Failed to start scanner: ' + error.message)
    } finally {
      isLoading.value = false
    }
  }
  
  // Stop the QR code scanner
  const stopScanner = () => {
    stopScanning()
    stopStream()
    
    isScanning.value = false
    statusMessage.value = 'Camera inactive'
    
    emit('stop')
  }
  
  // Stop the video stream
  const stopStream = () => {
    if (stream.value) {
      stream.value.getTracks().forEach(track => track.stop())
      stream.value = null
    }
    
    if (video.value) {
      video.value.srcObject = null
    }
  }
  
  // Start scanning for QR codes
  const startScanning = () => {
    // Create canvas for processing video frames
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    
    // Clear any existing scan interval
    if (scanIntervalId.value) {
      clearInterval(scanIntervalId.value)
    }

    // Load jsQR using a script tag for direct browser access
    const loadJsQR = () => {
      return new Promise((resolve, reject) => {
        // Check if jsQR is already loaded
        if (window.jsQR) {
          resolve(window.jsQR);
          return;
        }

        // Create script element to load jsQR
        const script = document.createElement('script');
        script.src = '/js/jsQR.js';
        script.async = true;
        
        script.onload = () => {
          if (window.jsQR) {
            resolve(window.jsQR);
          } else {
            reject(new Error('jsQR loaded but not available as window.jsQR'));
          }
        };
        
        script.onerror = () => {
          reject(new Error('Failed to load jsQR script'));
        };
        
        // Add script to document
        document.head.appendChild(script);
      });
    };
    
    // Load and use jsQR
    loadJsQR().then(jsQRFunc => {
      // Set up scan interval
      scanIntervalId.value = setInterval(() => {
        if (!video.value || !isScanning.value || video.value.paused || video.value.ended) {
          return
        }
        
        // Set canvas dimensions to match video
        canvas.width = video.value.videoWidth
        canvas.height = video.value.videoHeight
        
        // Draw current video frame to canvas
        ctx.drawImage(video.value, 0, 0, canvas.width, canvas.height)
        
        // Get image data for QR code detection
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        
        try {
          // Process image data with jsQR
          const code = jsQRFunc(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: 'dontInvert'
          })
          
          // If QR code found
          if (code) {
            // Play success sound or vibration if available
            if (navigator.vibrate) {
              navigator.vibrate(100)
            }
            
            // Update status
            statusMessage.value = 'QR code detected!'
            
            // Emit scan event with decoded data
            emit('scan', code.data)
            
            // Optionally pause scanning for a moment
            pauseScanning(1000)
          }
        } catch (error) {
          console.error('QR scan error:', error);
          handleError('QR scan error: ' + error.message)
        }
      }, props.scanInterval)
    }).catch(error => {
      console.error('Failed to load QR code scanner:', error);
      handleError('Failed to load QR code scanner: ' + error.message)
    })
  }
  
  // Stop the scanning process
  const stopScanning = () => {
    if (scanIntervalId.value) {
      clearInterval(scanIntervalId.value)
      scanIntervalId.value = null
    }
  }
  
  // Pause scanning temporarily
  const pauseScanning = (duration) => {
    stopScanning()
    
    setTimeout(() => {
      if (isScanning.value) {
        startScanning()
        statusMessage.value = 'Scanning for QR code...'
      }
    }, duration)
  }
  
  // Toggle device flash/torch if available
  const toggleFlash = async () => {
    if (!hasFlash.value || !stream.value) return
    
    try {
      const track = stream.value.getVideoTracks()[0]
      flashOn.value = !flashOn.value
      
      await track.applyConstraints({
        advanced: [{ torch: flashOn.value }]
      })
      
      statusMessage.value = flashOn.value ? 'Flash on' : 'Flash off'
    } catch (error) {
      handleError('Failed to toggle flash: ' + error.message)
      flashOn.value = false
    }
  }
  
  // Handle errors
  const handleError = (message) => {
    console.error(message)
    errorMessage.value = message
    statusMessage.value = 'Scanner error'
    emit('error', message)
  }
  
  // Method for external pause control
  const pauseScanner = (duration = 1000) => {
    pauseScanning(duration)
  }
  
  // Expose methods to parent component
  defineExpose({
    startScanner,
    stopScanner,
    toggleFlash,
    pauseScanning,
    pauseScanner
  })
  
  // Lifecycle hooks
  onMounted(async () => {
    try {
      // Get available cameras
      await getCameras()
      
      // Auto-start scanner if enabled
      if (props.autoStart) {
        startScanner()
      }
    } catch (error) {
      handleError('Initialization error: ' + error.message)
    }
  })
  
  // Clean up on component destruction
  onBeforeUnmount(() => {
    stopScanner()
  })
  </script>