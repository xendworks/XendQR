// composables/useQrCode.js

import { ref } from 'vue';
import QRCode from 'qrcode';
import jsQR from 'jsqr';

export function useQrCode() {
  const isGenerating = ref(false);
  const isScanning = ref(false);
  const scanResult = ref(null);
  const error = ref(null);

  /**
   * Generate a QR code as a data URL
   * @param {string} data - Data to encode in the QR code
   * @param {object} options - QR code options
   * @returns {Promise<string>} - Data URL of the generated QR code
   */
  const generateQrCode = async (data, options = {}) => {
    isGenerating.value = true;
    error.value = null;
    
    try {
      // Default options
      const defaultOptions = {
        errorCorrectionLevel: 'H',
        type: 'image/png',
        margin: 1,
        color: {
          dark: '#000000',
          light: '#ffffff'
        },
        width: 300
      };
      
      // Merge with user options
      const mergedOptions = { ...defaultOptions, ...options };
      
      // Generate QR code as data URL
      const dataUrl = await QRCode.toDataURL(data, mergedOptions);
      return dataUrl;
    } catch (err) {
      console.error('Error generating QR code:', err);
      error.value = 'Failed to generate QR code';
      throw error.value;
    } finally {
      isGenerating.value = false;
    }
  };

  /**
   * Generate a QR code on a canvas element
   * @param {string} data - Data to encode in the QR code
   * @param {HTMLCanvasElement} canvas - Canvas element to draw on
   * @param {object} options - QR code options
   * @returns {Promise<void>}
   */
  const generateQrCodeCanvas = async (data, canvas, options = {}) => {
    isGenerating.value = true;
    error.value = null;
    
    try {
      // Default options
      const defaultOptions = {
        errorCorrectionLevel: 'H',
        margin: 1,
        color: {
          dark: '#000000',
          light: '#ffffff'
        },
        width: 300
      };
      
      // Merge with user options
      const mergedOptions = { ...defaultOptions, ...options };
      
      // Generate QR code on canvas
      await QRCode.toCanvas(canvas, data, mergedOptions);
    } catch (err) {
      console.error('Error generating QR code on canvas:', err);
      error.value = 'Failed to generate QR code';
      throw error.value;
    } finally {
      isGenerating.value = false;
    }
  };

  /**
   * Scan a QR code from an image
   * @param {File|Blob|string} image - Image to scan (File, Blob, or data URL)
   * @returns {Promise<string|null>} - Decoded QR code data or null if not found
   */
  const scanQrCodeFromImage = async (image) => {
    isScanning.value = true;
    error.value = null;
    scanResult.value = null;
    
    try {
      // Create an Image object
      const img = new Image();
      
      // Create a promise to handle image loading
      const imageLoaded = new Promise((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Failed to load image'));
      });
      
      // Set image source based on input type
      if (typeof image === 'string') {
        // Assume it's a data URL
        img.src = image;
      } else if (image instanceof Blob || image instanceof File) {
        // Create a data URL from the Blob or File
        img.src = URL.createObjectURL(image);
      } else {
        throw new Error('Unsupported image format');
      }
      
      // Wait for the image to load
      await imageLoaded;
      
      // Create a canvas to draw the image
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Draw the image on the canvas
      ctx.drawImage(img, 0, 0);
      
      // Get the image data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      
      // Scan for QR code
      const code = jsQR(imageData.data, imageData.width, imageData.height);
      
      // Clean up if we created an object URL
      if (image instanceof Blob || image instanceof File) {
        URL.revokeObjectURL(img.src);
      }
      
      if (code) {
        // QR code found
        scanResult.value = code.data;
        return code.data;
      } else {
        // No QR code found
        error.value = 'No QR code found in the image';
        return null;
      }
    } catch (err) {
      console.error('Error scanning QR code from image:', err);
      error.value = 'Failed to scan QR code';
      return null;
    } finally {
      isScanning.value = false;
    }
  };

  /**
   * Start scanning for QR codes using the device camera
   * @param {HTMLVideoElement} videoElement - Video element to use for the camera feed
   * @param {function} onResult - Callback function for scan results
   * @returns {Promise<MediaStream>} - Media stream for the camera
   */
  const startQrScanner = async (videoElement, onResult) => {
    isScanning.value = true;
    error.value = null;
    scanResult.value = null;
    
    try {
      // Check if the browser supports getUserMedia
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Your browser does not support accessing the camera');
      }
      
      // Get the media stream
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      
      // Set the video source to the stream
      videoElement.srcObject = stream;
      
      // Wait for the video to be ready
      await new Promise(resolve => {
        videoElement.onloadedmetadata = () => {
          videoElement.play();
          resolve();
        };
      });
      
      // Set up the canvas for processing frames
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;
      
      // Create a scanning loop
      const scanLoop = () => {
        if (!isScanning.value) return;
        
        // Draw the current video frame to the canvas
        ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
        
        // Get the image data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        
        // Scan for QR code
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        
        if (code) {
          // QR code found
          scanResult.value = code.data;
          
          // Call the result callback
          if (typeof onResult === 'function') {
            onResult(code.data);
          }
        }
        
        // Continue scanning
        requestAnimationFrame(scanLoop);
      };
      
      // Start the scanning loop
      scanLoop();
      
      return stream;
    } catch (err) {
      console.error('Error starting QR scanner:', err);
      error.value = err.message || 'Failed to start QR scanner';
      isScanning.value = false;
      throw error.value;
    }
  };

  /**
   * Stop the QR scanner
   * @param {MediaStream} stream - Media stream to stop
   */
  const stopQrScanner = (stream) => {
    isScanning.value = false;
    
    if (stream) {
      // Stop all tracks in the stream
      stream.getTracks().forEach(track => track.stop());
    }
  };

  /**
   * Download QR code as an image
   * @param {string} dataUrl - QR code data URL
   * @param {string} filename - Filename for the downloaded image
   */
  const downloadQrCode = (dataUrl, filename = 'qrcode.png') => {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return {
    isGenerating,
    isScanning,
    scanResult,
    error,
    generateQrCode,
    generateQrCodeCanvas,
    scanQrCodeFromImage,
    startQrScanner,
    stopQrScanner,
    downloadQrCode
  };
}