<template>
  <div>
    <TransitionRoot as="template" :show="sidebarOpen">
      <Dialog class="relative z-50 lg:hidden" @close="sidebarOpen = false">
        <TransitionChild as="template" enter="transition-opacity ease-linear duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="transition-opacity ease-linear duration-300" leave-from="opacity-100" leave-to="opacity-0">
          <div class="fixed inset-0 bg-gray-900/80" />
        </TransitionChild>

        <div class="fixed inset-0 flex">
          <TransitionChild as="template" enter="transition ease-in-out duration-300 transform" enter-from="-translate-x-full" enter-to="translate-x-0" leave="transition ease-in-out duration-300 transform" leave-from="translate-x-0" leave-to="-translate-x-full">
            <DialogPanel class="relative mr-16 flex w-full max-w-xs flex-1">
              <TransitionChild as="template" enter="ease-in-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in-out duration-300" leave-from="opacity-100" leave-to="opacity-0">
                <div class="absolute left-full top-0 flex w-16 justify-center pt-5">
                  <button type="button" class="-m-2.5 p-2.5" @click="sidebarOpen = false">
                    <span class="sr-only">Close sidebar</span>
                    <XMarkIcon class="size-6 text-white" aria-hidden="true" />
                  </button>
                </div>
              </TransitionChild>
              <!-- Sidebar component for mobile -->
              <div class="flex grow flex-col gap-y-5 overflow-y-auto bg-indigo-600 px-6 pb-4">
                <div class="flex h-16 shrink-0 items-center">
                  <h1 class="text-xl font-bold text-white">XendCampus Events</h1>
                </div>
                <nav class="flex flex-1 flex-col">
                  <ul role="list" class="flex flex-1 flex-col gap-y-7">
                    <li>
                      <ul role="list" class="-mx-2 space-y-1">
                        <li v-for="item in navigation" :key="item.name">
                          <NuxtLink :to="item.href" :class="[item.current ? 'bg-indigo-700 text-white' : 'text-indigo-200 hover:bg-indigo-700 hover:text-white', 'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold']">
                            <component :is="item.icon" :class="[item.current ? 'text-white' : 'text-indigo-200 group-hover:text-white', 'size-6 shrink-0']" aria-hidden="true" />
                            {{ item.name }}
                          </NuxtLink>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </nav>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Static sidebar for desktop -->
    <div class="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
      <div class="flex grow flex-col gap-y-5 overflow-y-auto bg-indigo-600 px-6 pb-4">
        <div class="flex h-16 shrink-0 items-center relative">
          <img src="~/assets/images/logo.svg" alt="XendCampus Logo">
          <p class="absolute bottom-0 right-0 text-white text-xs">Events</p>
        </div>
        <nav class="flex flex-1 flex-col">
          <ul role="list" class="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" class="-mx-2 space-y-1">
                <li v-for="item in navigation" :key="item.name">
                  <NuxtLink :to="item.href" :class="[item.current ? 'bg-indigo-700 text-white' : 'text-indigo-200 hover:bg-indigo-700 hover:text-white', 'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold']">
                    <component :is="item.icon" :class="[item.current ? 'text-white' : 'text-indigo-200 group-hover:text-white', 'size-6 shrink-0']" aria-hidden="true" />
                    {{ item.name }}
                  </NuxtLink>
                </li>
              </ul>
            </li>
          </ul>
        </nav>
      </div>
    </div>

    <div class="lg:pl-64">
      <div class="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
        <button type="button" class="-m-2.5 p-2.5 text-gray-700 lg:hidden" @click="sidebarOpen = true">
          <span class="sr-only">Open sidebar</span>
          <Bars3Icon class="size-6" aria-hidden="true" />
        </button>

        <!-- Separator -->
        <div class="h-6 w-px bg-gray-900/10 lg:hidden" aria-hidden="true" />

        <div class="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
          <form class="grid flex-1 grid-cols-1" action="#" method="GET">
            <input type="search" name="search" aria-label="Search" class="col-start-1 row-start-1 block size-full bg-white pl-8 text-base text-gray-900 outline-none placeholder:text-gray-400 sm:text-sm/6" placeholder="Search attendees..." />
            <MagnifyingGlassIcon class="pointer-events-none col-start-1 row-start-1 size-5 self-center text-gray-400" aria-hidden="true" />
          </form>
          <div class="flex items-center gap-x-4 lg:gap-x-6">
            <!-- Separator -->
            <div class="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-900/10" aria-hidden="true" />

            <!-- Profile dropdown -->
            <Menu as="div" class="relative">
              <MenuButton class="-m-1.5 flex items-center p-1.5">
                <span class="sr-only">Open user menu</span>
                <div class="size-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium">
                  {{ adminInitials }}
                </div>
                <span class="hidden lg:flex lg:items-center">
                  <span class="ml-4 text-sm/6 font-semibold text-gray-900" aria-hidden="true">{{ adminName }}</span>
                  <ChevronDownIcon class="ml-2 size-5 text-gray-400" aria-hidden="true" />
                </span>
              </MenuButton>
              <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
                <MenuItems class="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                  <MenuItem v-slot="{ active }">
                    <button @click="handleLogout" :class="[active ? 'bg-gray-50' : '', 'block w-full px-3 py-1 text-left text-sm/6 text-gray-900']">Sign out</button>
                  </MenuItem>
                </MenuItems>
              </transition>
            </Menu>
          </div>
        </div>
      </div>

      <main>
        <div class="px-4 sm:px-6 lg:px-8">
          <slot v-if="isAuthenticated" />
          <div v-else-if="!isAuthenticated && !isLoading" class="max-w-7xl mx-auto">
            <div class="bg-white shadow-md rounded-lg p-6">
              <h1 class="text-xl font-bold text-gray-900 mb-4">Admin Login Required</h1>
              <p class="text-gray-600 mb-6">Please sign in with your administrator account to access this area.</p>
              <AdminLogin @success="onAdminLogin" />
            </div>
          </div>
          <div v-else class="flex justify-center items-center h-64">
            <div class="spinner"></div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  Dialog,
  DialogPanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  TransitionChild,
  TransitionRoot,
} from '@headlessui/vue'
import {
  Bars3Icon,
  HomeIcon,
  UsersIcon,
  QrCodeIcon,
  ArrowPathIcon,
  DocumentArrowDownIcon,
  EnvelopeIcon,
  XMarkIcon,
} from '@heroicons/vue/24/outline'
import { ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/vue/20/solid'
import { initializeFirebase } from '~/firebase'
import { useAuth } from '~/composables/useAuth'
import AdminLogin from '~/components/AdminLogin.vue'

// Router
const router = useRouter()

// State
const sidebarOpen = ref(false)
const adminData = ref(null)
const isExporting = ref(false)
const isSendingEmail = ref(false)

// Auth composable
const { user, isAuthenticated, isAdmin, isLoading, logout } = useAuth()

// Methods
const handleLogout = async () => {
  try {
    await logout()
    adminData.value = null
    router.push('/')
  } catch (error) {
    console.error('Logout error:', error)
  }
}

const onAdminLogin = async (userData) => {
  console.log('Admin login successful:', userData)
  window.location.href = '/admin'
}

// Export attendee data
const exportAttendeeData = async () => {
  try {
    isExporting.value = true
    const { collection, getDocs } = await import('firebase/firestore')
    const { db } = initializeFirebase()
    
    // Get attendees from both collections
    const attendeesSnapshot = await getDocs(collection(db, 'attendees'))
    const usersSnapshot = await getDocs(collection(db, 'users'))
    
    // Combine and format data
    const registrations = []
    
    attendeesSnapshot.forEach(doc => {
      const data = doc.data()
      registrations.push({
        id: doc.id,
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        email: data.email || '',
        phone: data.phone || '',
        registrationDate: data.registrationDate || data.createdAt || null,
        checkedIn: data.checkInStatus || false,
        checkedInTime: data.checkInTime || null
      })
    })
    
    usersSnapshot.forEach(doc => {
      const data = doc.data()
      let firstName = '', lastName = ''
      if (data.name) {
        const nameParts = data.name.split(' ')
        firstName = nameParts[0] || ''
        lastName = nameParts.slice(1).join(' ') || ''
      }
      
      registrations.push({
        id: doc.id,
        firstName: data.firstName || firstName,
        lastName: data.lastName || lastName,
        email: data.email || '',
        phone: data.phone || '',
        registrationDate: data.registrationDate || data.createdAt || null,
        checkedIn: data.checkInStatus || false,
        checkedInTime: data.checkInTime || null
      })
    })
    
    // Create CSV
    let csvContent = 'Name,Email,Phone,Registration ID,Registration Date,Check-in Status,Check-in Time\n'
    
    registrations.forEach(data => {
      const fullName = `${data.firstName} ${data.lastName}`.trim()
      const formatTimestamp = (timestamp) => {
        if (!timestamp) return ''
        try {
          if (timestamp.seconds) return new Date(timestamp.seconds * 1000).toLocaleString()
          if (timestamp instanceof Date) return timestamp.toLocaleString()
          return new Date(timestamp).toLocaleString()
        } catch (err) {
          return ''
        }
      }
      
      csvContent += `"${fullName}","${data.email}","${data.phone}","${data.id}","${formatTimestamp(data.registrationDate)}","${data.checkedIn ? 'Yes' : 'No'}","${formatTimestamp(data.checkedInTime)}"\n`
    })
    
    // Download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `attendees-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (error) {
    console.error('Error exporting data:', error)
  } finally {
    isExporting.value = false
  }
}

// Send bulk email
const sendBulkEmail = async () => {
  try {
    if (!confirm('Are you sure you want to send a reminder email to all non-checked-in attendees?')) {
      return
    }
    
    isSendingEmail.value = true
    await new Promise(resolve => setTimeout(resolve, 1500))
  } catch (error) {
    console.error('Error sending emails:', error)
  } finally {
    isSendingEmail.value = false
  }
}

// Navigation
const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: HomeIcon, current: true },
  { name: 'QR Scanner', href: '/admin/scanner', icon: QrCodeIcon, current: false },
  { name: 'Attendees', href: '/admin/attendees', icon: UsersIcon, current: false },
]

// Computed properties
const adminName = computed(() => {
  if (adminData.value) return adminData.value.name
  if (user.value) return user.value.displayName
  return 'Admin'
})

const adminEmail = computed(() => {
  if (adminData.value) return adminData.value.email
  if (user.value) return user.value.email
  return ''
})

const adminInitials = computed(() => {
  if (!adminName.value) return 'A'
  return adminName.value
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2)
})
</script>

<style>
.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border-left-color: #4f46e5;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>