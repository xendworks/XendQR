<template>
    <div>
      <!-- Search and Filters -->
      <div class="mb-6 bg-white p-4 rounded-lg shadow-sm">
        <div class="sm:flex sm:items-center justify-between">
          <h3 class="text-lg font-medium text-gray-900">Attendees</h3>
          
          <div class="mt-3 sm:mt-0 sm:ml-4 flex items-center space-x-2">
            <div class="relative rounded-md">
              <input
                type="text"
                v-model="searchTerm"
                class="form-input pl-10 w-[300px]"
                placeholder="Search attendees..."
              />
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            
            <select 
              v-model="statusFilter" 
              class="form-select pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Statuses</option>
              <option value="checked-in">Checked In</option>
              <option value="not-checked-in">Not Checked In</option>
            </select>
            
            <select 
              v-model="typeFilter" 
              class="form-select pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Types</option>
              <option value="student">Students</option>
              <option value="consultant">Consultants</option>
            </select>
            
            <button 
              @click="refreshAttendees"
              class="inline-flex items-center p-2 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              title="Refresh"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>
        
        <div class="mt-4 flex items-center text-sm text-gray-500 flex-wrap gap-4">
          <div>
            Total: <span class="font-medium">{{ totalAttendees }}</span>
          </div>
          <div>
            Students: <span class="font-medium">{{ studentCount }}</span>
          </div>
          <div>
            Consultants: <span class="font-medium">{{ consultantCount }}</span>
          </div>
          <div>
            Checked In: <span class="font-medium">{{ checkedInCount }}</span>
          </div>
          <div>
            Not Checked In: <span class="font-medium">{{ notCheckedInCount }}</span>
          </div>
        </div>
      </div>
      
      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center items-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
      
      <!-- No Results -->
      <div v-else-if="filteredAttendees.length === 0" class="bg-white p-8 text-center rounded-lg shadow-sm">
        <p class="text-gray-500">No attendees found matching your criteria</p>
      </div>
      
      <!-- All Attendees Table (when "all" is selected) -->
      <div v-else-if="typeFilter === 'all'" class="mb-8">
        <h3 class="text-lg font-medium text-gray-900 mb-4">All Attendees ({{ paginatedAttendees.length }} showing)</h3>
        
        <div class="bg-white shadow-sm overflow-hidden sm:rounded-lg">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" @click="handleSort({ key: 'registrationId', sortable: true })">
                    <div class="flex items-center">
                      Registration ID
                      <span class="ml-2">
                        <template v-if="sortConfig.key === 'registrationId'">
                          <svg v-if="sortConfig.direction === 'asc'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                          </svg>
                          <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </template>
                      </span>
                    </div>
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" @click="handleSort({ key: 'fullName', sortable: true })">
                    <div class="flex items-center">
                      Name
                      <span class="ml-2">
                        <template v-if="sortConfig.key === 'fullName'">
                          <svg v-if="sortConfig.direction === 'asc'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                          </svg>
                          <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </template>
                      </span>
                    </div>
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" @click="handleSort({ key: 'email', sortable: true })">
                    <div class="flex items-center">
                      Email
                      <span class="ml-2">
                        <template v-if="sortConfig.key === 'email'">
                          <svg v-if="sortConfig.direction === 'asc'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                          </svg>
                          <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </template>
                      </span>
                    </div>
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" @click="handleSort({ key: 'type', sortable: true })">
                    <div class="flex items-center">
                      Type
                      <span class="ml-2">
                        <template v-if="sortConfig.key === 'type'">
                          <svg v-if="sortConfig.direction === 'asc'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                          </svg>
                          <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </template>
                      </span>
                    </div>
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" @click="handleSort({ key: 'checkInStatus', sortable: true })">
                    <div class="flex items-center">
                      Status
                      <span class="ml-2">
                        <template v-if="sortConfig.key === 'checkInStatus'">
                          <svg v-if="sortConfig.direction === 'asc'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                          </svg>
                          <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </template>
                      </span>
                    </div>
                  </th>
                  <th scope="col" class="relative px-6 py-3">
                    <span class="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="attendee in paginatedAttendees" :key="attendee.id" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap text-sm">
                    {{ attendee.registrationId || 'N/A' }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm">
                    {{ getAttendeeName(attendee) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm">
                    {{ attendee.email || 'N/A' }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm">
                    {{ attendee.registrationId?.startsWith('XC') ? 'Student' : 'Consultant' }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm">
                    <span 
                      class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                      :class="attendee.checkInStatus ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'"
                    >
                      {{ attendee.checkInStatus ? 'Checked In' : 'Not Checked In' }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Menu as="div" class="relative inline-block text-left">
                      <div>
                        <MenuButton class="flex items-center rounded-full bg-gray-100 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100">
                          <span class="sr-only">Open options</span>
                          <EllipsisVerticalIcon class="size-5" aria-hidden="true" />
                        </MenuButton>
                      </div>

                      <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
                        <MenuItems class="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
                          <div class="py-1">
                            <MenuItem v-slot="{ active }">
                              <button 
                                @click="toggleCheckInStatus(attendee)"
                                :class="[active ? 'bg-gray-100 text-gray-900 outline-none' : 'text-gray-700', 'block w-full px-4 py-2 text-left text-sm']"
                              >
                                {{ attendee.checkInStatus ? 'Undo Check-In' : 'Check In' }}
                              </button>
                            </MenuItem>
                            <MenuItem v-slot="{ active }">
                              <button 
                                @click="viewDetails(attendee)"
                                :class="[active ? 'bg-gray-100 text-gray-900 outline-none' : 'text-gray-700', 'block w-full px-4 py-2 text-left text-sm']"
                              >
                                View Details
                              </button>
                            </MenuItem>
                          </div>
                        </MenuItems>
                      </transition>
                    </Menu>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <!-- Students Table -->
      <div v-else-if="typeFilter === 'student'" class="mb-8">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Students ({{ studentAttendees.length }} showing)</h3>
        
        <!-- More detailed debug info -->
        <div v-if="studentAttendees.length === 0" class="text-sm text-red-500 mb-4">
          <p>No students found on current page.</p>
          <p>Debug info:</p>
          <ul class="list-disc pl-5">
            <li>Total students: {{ studentCount }}</li>
            <li>Filtered students: {{ filteredAttendees.filter(a => a.type === 'student' || (a.registrationId && a.registrationId.startsWith('XC'))).length }}</li>
            <li>Current page: {{ currentPage }} of {{ totalPages }}</li>
            <li>Type filter: {{ typeFilter }}</li>
            <li>Status filter: {{ statusFilter }}</li>
          </ul>
        </div>
        
        <div v-if="studentAttendees.length > 0" class="bg-white shadow-sm overflow-hidden sm:rounded-lg">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th 
                    v-for="column in studentColumns" 
                    :key="column.key"
                    scope="col" 
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    @click="handleSort(column)"
                  >
                    <div class="flex items-center">
                      {{ column.label }}
                      <span v-if="column.sortable" class="ml-2">
                        <template v-if="sortConfig.key === column.key">
                          <svg v-if="sortConfig.direction === 'asc'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                          </svg>
                          <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </template>
                      </span>
                    </div>
                  </th>
                  <th scope="col" class="relative px-6 py-3">
                    <span class="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="student in studentAttendees" :key="student.id" class="hover:bg-gray-50">
                  <td v-for="column in studentColumns" :key="column.key" class="px-6 py-4 whitespace-nowrap text-sm">
                    <template v-if="column.key === 'checkInStatus'">
                      <span 
                        class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                        :class="student.checkInStatus ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'"
                      >
                        {{ column.formatter ? column.formatter(student[column.key], student) : student[column.key] }}
                      </span>
                    </template>
                    <template v-else>
                      {{ column.formatter ? column.formatter(student[column.key], student) : (student[column.key] || 'N/A') }}
                    </template>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Menu as="div" class="relative inline-block text-left">
                      <div>
                        <MenuButton class="flex items-center rounded-full bg-gray-100 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100">
                          <span class="sr-only">Open options</span>
                        </MenuButton>
                      </div>

                      <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
                        <MenuItems class="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
                          <div class="py-1">
                            <MenuItem v-slot="{ active }">
                              <button 
                                @click="toggleCheckInStatus(student)"
                                :class="[active ? 'bg-gray-100 text-gray-900 outline-none' : 'text-gray-700', 'block w-full px-4 py-2 text-left text-sm']"
                              >
                                {{ student.checkInStatus ? 'Undo Check-In' : 'Check In' }}
                              </button>
                            </MenuItem>
                            <MenuItem v-slot="{ active }">
                              <button 
                                @click="viewDetails(student)"
                                :class="[active ? 'bg-gray-100 text-gray-900 outline-none' : 'text-gray-700', 'block w-full px-4 py-2 text-left text-sm']"
                              >
                                View Details
                              </button>
                            </MenuItem>
                          </div>
                        </MenuItems>
                      </transition>
                    </Menu>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div v-else class="bg-white p-8 text-center rounded-lg shadow-sm">
          <p class="text-gray-500">No students found matching your criteria</p>
        </div>
      </div>

      <!-- Consultants Table -->
      <div v-if="typeFilter === 'consultant'" class="mb-8">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Consultants ({{ consultantAttendees.length }} showing)</h3>
        
        <!-- Debug info for consultants too -->
        <div v-if="consultantAttendees.length === 0" class="text-sm text-red-500 mb-4">
          <p>No consultants found on current page.</p>
          <p>Debug info:</p>
          <ul class="list-disc pl-5">
            <li>Total consultants: {{ consultantCount }}</li>
            <li>Filtered consultants: {{ filteredAttendees.filter(a => a.type === 'consultant' || (a.registrationId && a.registrationId.startsWith('ACCWA'))).length }}</li>
            <li>Current page: {{ currentPage }} of {{ totalPages }}</li>
            <li>Type filter: {{ typeFilter }}</li>
            <li>Status filter: {{ statusFilter }}</li>
          </ul>
        </div>
        
        <div class="bg-white shadow-sm overflow-hidden sm:rounded-lg">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th 
                    v-for="column in consultantColumns" 
                    :key="column.key"
                    scope="col" 
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    @click="handleSort(column)"
                  >
                    <div class="flex items-center">
                      {{ column.label }}
                      <span v-if="column.sortable" class="ml-2">
                        <template v-if="sortConfig.key === column.key">
                          <svg v-if="sortConfig.direction === 'asc'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                          </svg>
                          <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </template>
                      </span>
                    </div>
                  </th>
                  <th scope="col" class="relative px-6 py-3">
                    <span class="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="consultant in consultantAttendees" :key="consultant.id" class="hover:bg-gray-50">
                  <td v-for="column in consultantColumns" :key="column.key" class="px-6 py-4 whitespace-nowrap text-sm">
                    <template v-if="column.key === 'checkInStatus'">
                      <span 
                        class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                        :class="consultant.checkInStatus ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'"
                      >
                        {{ column.formatter ? column.formatter(consultant[column.key], consultant) : consultant[column.key] }}
                      </span>
                    </template>
                    <template v-else>
                      {{ column.formatter ? column.formatter(consultant[column.key], consultant) : (consultant[column.key] || 'N/A') }}
                    </template>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Menu as="div" class="relative inline-block text-left">
                      <div>
                        <MenuButton class="flex items-center rounded-full bg-gray-100 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100">
                          <span class="sr-only">Open options</span>
                          <EllipsisVerticalIcon class="size-5" aria-hidden="true" />
                        </MenuButton>
                      </div>

                      <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
                        <MenuItems class="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
                          <div class="py-1">
                            <MenuItem v-slot="{ active }">
                              <button 
                                @click="toggleCheckInStatus(consultant)"
                                :class="[active ? 'bg-gray-100 text-gray-900 outline-none' : 'text-gray-700', 'block w-full px-4 py-2 text-left text-sm']"
                              >
                                {{ consultant.checkInStatus ? 'Undo Check-In' : 'Check In' }}
                              </button>
                            </MenuItem>
                            <MenuItem v-slot="{ active }">
                              <button 
                                @click="viewDetails(consultant)"
                                :class="[active ? 'bg-gray-100 text-gray-900 outline-none' : 'text-gray-700', 'block w-full px-4 py-2 text-left text-sm']"
                              >
                                View Details
                              </button>
                            </MenuItem>
                          </div>
                        </MenuItems>
                      </transition>
                    </Menu>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <!-- Pagination -->
      <div v-if="totalPages > 1" class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700">
              Showing <span class="font-medium">{{ paginationStart }}</span> to <span class="font-medium">{{ paginationEnd }}</span> of <span class="font-medium">{{ totalFilteredAttendees }}</span> attendees
            </p>
          </div>
          <div>
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                @click="currentPage = Math.max(1, currentPage - 1)"
                :disabled="currentPage === 1"
                class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }"
              >
                <span class="sr-only">Previous</span>
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </button>
              
              <span v-for="page in visiblePageNumbers" :key="page">
                <button
                  v-if="page !== '...'"
                  @click="currentPage = page"
                  class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium hover:bg-gray-50"
                  :class="page === currentPage ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600' : 'text-gray-500'"
                >
                  {{ page }}
                </button>
                <span
                  v-else
                  class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                >
                  ...
                </span>
              </span>
              
              <button
                @click="currentPage = Math.min(totalPages, currentPage + 1)"
                :disabled="currentPage === totalPages || totalPages === 0"
                class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                :class="{ 'opacity-50 cursor-not-allowed': currentPage === totalPages || totalPages === 0 }"
              >
                <span class="sr-only">Next</span>
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>
      
      <!-- Attendee Details Modal -->
      <div v-if="selectedAttendee" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg shadow-xl overflow-hidden max-w-md w-full mx-4">
          <div class="bg-indigo-600 px-6 py-4">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-medium text-white">Attendee Details</h3>
              <button 
                @click="selectedAttendee = null" 
                class="text-white hover:text-gray-200 focus:outline-none"
              >
                <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          
          <div class="px-6 py-4">
            <div class="flex items-center mb-4">
              <div class="h-16 w-16 bg-indigo-100 rounded-full flex items-center justify-center text-xl text-indigo-700 font-bold">
                {{ getInitials(selectedAttendee.registrationId?.startsWith('XC') ? (selectedAttendee.fullName || `${selectedAttendee.firstName} ${selectedAttendee.lastName}`) : selectedAttendee.consultantName) }}
              </div>
              <div class="ml-4">
                <h4 class="text-lg font-medium text-gray-900">
                  {{ selectedAttendee.registrationId?.startsWith('XC') ? (selectedAttendee.fullName || `${selectedAttendee.firstName} ${selectedAttendee.lastName}`) : selectedAttendee.consultantName }}
                </h4>
                <p class="text-sm text-gray-500">Registration ID: {{ selectedAttendee.registrationId || 'N/A' }}</p>
              </div>
            </div>
            
            <div class="border-t border-gray-200 pt-4">
              <dl class="divide-y divide-gray-200">
                <!-- Student-specific fields -->
                <template v-if="selectedAttendee.registrationId?.startsWith('XC')">
                  <div class="py-3 flex justify-between">
                    <dt class="text-sm font-medium text-gray-500">Academic Group</dt>
                    <dd class="text-sm text-gray-900">{{ selectedAttendee.academicGroup || 'N/A' }}</dd>
                  </div>
                  <div class="py-3 flex justify-between">
                    <dt class="text-sm font-medium text-gray-500">Course Preference</dt>
                    <dd class="text-sm text-gray-900">{{ selectedAttendee.coursePref || 'N/A' }}</dd>
                  </div>
                  <div class="py-3 flex justify-between">
                    <dt class="text-sm font-medium text-gray-500">College Preference</dt>
                    <dd class="text-sm text-gray-900">{{ selectedAttendee.collegePref || 'N/A' }}</dd>
                  </div>
                  <div class="py-3 flex justify-between">
                    <dt class="text-sm font-medium text-gray-500">Mark</dt>
                    <dd class="text-sm text-gray-900">{{ selectedAttendee.mark || 'N/A' }}</dd>
                  </div>
                  <div class="py-3 flex justify-between">
                    <dt class="text-sm font-medium text-gray-500">School Name</dt>
                    <dd class="text-sm text-gray-900">{{ selectedAttendee.schoolName || 'N/A' }}</dd>
                  </div>
                  <div class="py-3 flex justify-between">
                    <dt class="text-sm font-medium text-gray-500">Phone</dt>
                    <dd class="text-sm text-gray-900">{{ selectedAttendee.phone || 'N/A' }}</dd>
                  </div>
                </template>
                
                <!-- Consultant-specific fields -->
                <template v-else>
                  <div class="py-3 flex justify-between">
                    <dt class="text-sm font-medium text-gray-500">Consultancy Name</dt>
                    <dd class="text-sm text-gray-900">{{ selectedAttendee.consultancyName || 'N/A' }}</dd>
                  </div>
                  <div class="py-3 flex justify-between">
                    <dt class="text-sm font-medium text-gray-500">District</dt>
                    <dd class="text-sm text-gray-900">{{ selectedAttendee.district || 'N/A' }}</dd>
                  </div>
                  <div class="py-3 flex justify-between">
                    <dt class="text-sm font-medium text-gray-500">State</dt>
                    <dd class="text-sm text-gray-900">{{ selectedAttendee.state || 'N/A' }}</dd>
                  </div>
                  <div class="py-3 flex justify-between">
                    <dt class="text-sm font-medium text-gray-500">ACCWA Member</dt>
                    <dd class="text-sm text-gray-900">{{ selectedAttendee.accwaMember || 'No' }}</dd>
                  </div>
                  <div class="py-3 flex justify-between">
                    <dt class="text-sm font-medium text-gray-500">Accommodation Required</dt>
                    <dd class="text-sm text-gray-900">{{ selectedAttendee.accommodationRequired || 'No' }}</dd>
                  </div>
                  <div class="py-3 flex justify-between">
                    <dt class="text-sm font-medium text-gray-500">Food Preference</dt>
                    <dd class="text-sm text-gray-900">{{ selectedAttendee.foodPreference || 'N/A' }}</dd>
                  </div>
                  <div class="py-3 flex justify-between">
                    <dt class="text-sm font-medium text-gray-500">Mobile Number</dt>
                    <dd class="text-sm text-gray-900">{{ selectedAttendee.mobileNumber || 'N/A' }}</dd>
                  </div>
                  <div class="py-3 flex justify-between">
                    <dt class="text-sm font-medium text-gray-500">WhatsApp Number</dt>
                    <dd class="text-sm text-gray-900">{{ selectedAttendee.whatsappNumber || 'N/A' }}</dd>
                  </div>
                  <div class="py-3 flex justify-between">
                    <dt class="text-sm font-medium text-gray-500">Office Address</dt>
                    <dd class="text-sm text-gray-900">{{ selectedAttendee.officeAddress || 'N/A' }}</dd>
                  </div>
                  <div class="py-3 flex justify-between">
                    <dt class="text-sm font-medium text-gray-500">Focusing Colleges</dt>
                    <dd class="text-sm text-gray-900">{{ selectedAttendee.focusingColleges || 'N/A' }}</dd>
                  </div>
                  <div class="py-3 flex justify-between">
                    <dt class="text-sm font-medium text-gray-500">Member Count</dt>
                    <dd class="text-sm text-gray-900">{{ selectedAttendee.memberCount || 'N/A' }}</dd>
                  </div>
                </template>
                
                <!-- Common fields -->
                <div class="py-3 flex justify-between">
                  <dt class="text-sm font-medium text-gray-500">Email</dt>
                  <dd class="text-sm text-gray-900">{{ selectedAttendee.email || 'N/A' }}</dd>
                </div>
                <div class="py-3 flex justify-between">
                  <dt class="text-sm font-medium text-gray-500">Registration Date</dt>
                  <dd class="text-sm text-gray-900">{{ formatDate(selectedAttendee.registrationDate) }}</dd>
                </div>
                <div class="py-3 flex justify-between">
                  <dt class="text-sm font-medium text-gray-500">Status</dt>
                  <dd class="text-sm">
                    <span 
                      class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                      :class="selectedAttendee.checkInStatus ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'"
                    >
                      {{ selectedAttendee.checkInStatus ? 'Checked In' : 'Not Checked In' }}
                    </span>
                  </dd>
                </div>
                <div v-if="selectedAttendee.checkInTime" class="py-3 flex justify-between">
                  <dt class="text-sm font-medium text-gray-500">Check-in Time</dt>
                  <dd class="text-sm text-gray-900">{{ formatDateTime(selectedAttendee.checkInTime) }}</dd>
                </div>
                <div v-if="selectedAttendee.checkedInBy?.adminId" class="py-3 flex justify-between">
                  <dt class="text-sm font-medium text-gray-500">Checked In By</dt>
                  <dd class="text-sm text-gray-900">{{ selectedAttendee.checkedInBy.adminName || selectedAttendee.checkedInBy.adminId }}</dd>
                </div>
              </dl>
            </div>
          </div>
          
          <div class="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
            <button 
              @click="toggleCheckInStatus(selectedAttendee)"
              class="btn"
              :class="selectedAttendee.checkInStatus ? 'btn-secondary' : 'btn-primary'"
            >
              {{ selectedAttendee.checkInStatus ? 'Undo Check-In' : 'Check In' }}
            </button>
            <button 
              @click="selectedAttendee = null" 
              class="btn btn-secondary"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
  import { initializeFirebase } from '~/firebase'
  import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
  
  // Props definition
  const props = defineProps({
    itemsPerPage: {
      type: Number,
      default: 10
    },
    autoRefresh: {
      type: Boolean,
      default: false
    },
    refreshInterval: {
      type: Number,
      default: 30000 // 30 seconds
    }
  })
  
  // Emits
  const emit = defineEmits(['check-in', 'undo-check-in', 'error'])
  
  // Component state
  const attendees = ref([])
  const isLoading = ref(true)
  const searchTerm = ref('')
  const statusFilter = ref('all')
  const typeFilter = ref('all')
  const currentPage = ref(1)
  const selectedAttendee = ref(null)
  const refreshIntervalId = ref(null)
  
  // Initialize Firebase
  const { db } = initializeFirebase()
  
  // Column configurations
  const studentColumns = [
    {
      key: 'fullName',
      label: 'Full Name',
      sortable: true,
      formatter: (value, attendee) => value || `${attendee.firstName || ''} ${attendee.lastName || ''}`.trim() || 'N/A'
    },
    {
      key: 'registrationId',
      label: 'Registration ID',
      sortable: true
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true
    },
    {
      key: 'phone',
      label: 'Phone',
      sortable: true
    },
    {
      key: 'academicGroup',
      label: 'Academic Group',
      sortable: true
    },
    {
      key: 'coursePref',
      label: 'Course Preference',
      sortable: true
    },
    {
      key: 'collegePref',
      label: 'College Preference',
      sortable: true
    },
    {
      key: 'mark',
      label: 'Mark',
      sortable: true
    },
    {
      key: 'schoolName',
      label: 'School Name',
      sortable: true
    },
    {
      key: 'checkInStatus',
      label: 'Status',
      sortable: true,
      formatter: (value) => value ? 'Checked In' : 'Not Checked In'
    }
  ]

  const consultantColumns = [
    {
      key: 'consultantName',
      label: 'Consultant Name',
      sortable: true
    },
    {
      key: 'registrationId',
      label: 'Registration ID',
      sortable: true
    },
    {
      key: 'consultancyName',
      label: 'Consultancy Name',
      sortable: true
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true
    },
    {
      key: 'mobileNumber',
      label: 'Mobile Number',
      sortable: true
    },
    {
      key: 'whatsappNumber',
      label: 'WhatsApp Number',
      sortable: true
    },
    {
      key: 'district',
      label: 'District',
      sortable: true
    },
    {
      key: 'state',
      label: 'State',
      sortable: true
    },
    {
      key: 'accwaMember',
      label: 'ACCWA Member',
      sortable: true,
      formatter: (value) => value || 'No'
    },
    {
      key: 'accommodationRequired',
      label: 'Accommodation',
      sortable: true,
      formatter: (value) => value || 'No'
    },
    {
      key: 'foodPreference',
      label: 'Food Preference',
      sortable: true
    },
    {
      key: 'memberCount',
      label: 'Member Count',
      sortable: true
    },
    {
      key: 'checkInStatus',
      label: 'Status',
      sortable: true,
      formatter: (value) => value ? 'Checked In' : 'Not Checked In'
    }
  ]

  // Add sorting state
  const sortConfig = ref({
    key: '',
    direction: 'asc'
  })
  
  // Computed properties
  const filteredAttendees = computed(() => {
    let result = [...attendees.value]
    
    // Apply search filter
    if (searchTerm.value.trim()) {
      const search = searchTerm.value.toLowerCase()
      result = result.filter(attendee => {
        // For students (XC prefix or type = student)
        if ((attendee.type === 'student') || 
            (attendee.registrationId && attendee.registrationId.startsWith('XC'))) {
          return (
            (attendee.fullName?.toLowerCase().includes(search) || 
             attendee.firstName?.toLowerCase().includes(search) ||
             attendee.lastName?.toLowerCase().includes(search)) ||
            attendee.email?.toLowerCase().includes(search) ||
            attendee.phone?.includes(search) ||
            attendee.registrationId?.toLowerCase().includes(search) ||
            attendee.schoolName?.toLowerCase().includes(search) ||
            attendee.academicGroup?.toLowerCase().includes(search)
          )
        } 
        // For consultants (ACCWA prefix or type = consultant)
        else if ((attendee.type === 'consultant') || 
                 (attendee.registrationId && attendee.registrationId.startsWith('ACCWA'))) {
          return (
            attendee.consultantName?.toLowerCase().includes(search) ||
            attendee.consultancyName?.toLowerCase().includes(search) ||
            attendee.email?.toLowerCase().includes(search) ||
            attendee.mobileNumber?.includes(search) ||
            attendee.registrationId?.toLowerCase().includes(search) ||
            attendee.district?.toLowerCase().includes(search) ||
            attendee.state?.toLowerCase().includes(search)
          )
        }
        return false;
      })
    }
    
    // Apply status filter
    if (statusFilter.value === 'checked-in') {
      result = result.filter(attendee => attendee.checkInStatus)
    } else if (statusFilter.value === 'not-checked-in') {
      result = result.filter(attendee => !attendee.checkInStatus)
    }
    
    // Apply type filter
    if (typeFilter.value === 'student') {
      result = result.filter(attendee => 
        (attendee.type === 'student') || 
        (attendee.registrationId && attendee.registrationId.startsWith('XC'))
      )
    } else if (typeFilter.value === 'consultant') {
      result = result.filter(attendee => 
        (attendee.type === 'consultant') || 
        (attendee.registrationId && attendee.registrationId.startsWith('ACCWA'))
      )
    }
    
    return result
  })
  
  // Pagination
  const totalFilteredAttendees = computed(() => filteredAttendees.value.length)
  const totalPages = computed(() => Math.ceil(totalFilteredAttendees.value / props.itemsPerPage))
  const paginatedAttendees = computed(() => {
    const start = (currentPage.value - 1) * props.itemsPerPage
    const end = start + props.itemsPerPage
    return filteredAttendees.value.slice(start, end)
  })
  const paginationStart = computed(() => {
    if (totalFilteredAttendees.value === 0) return 0
    return (currentPage.value - 1) * props.itemsPerPage + 1
  })
  const paginationEnd = computed(() => {
    if (totalFilteredAttendees.value === 0) return 0
    return Math.min(currentPage.value * props.itemsPerPage, totalFilteredAttendees.value)
  })
  
  // Visible page numbers for pagination
  const visiblePageNumbers = computed(() => {
    if (totalPages.value <= 7) {
      return Array.from({ length: totalPages.value }, (_, i) => i + 1)
    }
    
    if (currentPage.value <= 3) {
      return [1, 2, 3, 4, 5, '...', totalPages.value]
    }
    
    if (currentPage.value >= totalPages.value - 2) {
      return [1, '...', totalPages.value - 4, totalPages.value - 3, totalPages.value - 2, totalPages.value - 1, totalPages.value]
    }
    
    return [1, '...', currentPage.value - 1, currentPage.value, currentPage.value + 1, '...', totalPages.value]
  })
  
  // Stats
  const totalAttendees = computed(() => attendees.value.length)
  const checkedInCount = computed(() => attendees.value.filter(a => a.checkInStatus).length)
  const notCheckedInCount = computed(() => attendees.value.filter(a => !a.checkInStatus).length)
  const studentCount = computed(() => attendees.value.filter(a => a.registrationId?.startsWith('XC')).length)
  const consultantCount = computed(() => attendees.value.filter(a => a.registrationId?.startsWith('ACCWA')).length)
  
  // Get all filtered students before pagination to check if any exist
  const allFilteredStudents = computed(() => {
    return filteredAttendees.value.filter(attendee => 
      (attendee.type === 'student') || 
      (attendee.registrationId && attendee.registrationId.startsWith('XC'))
    );
  });
  
  // Modify the studentAttendees computed property to ensure students are shown
  const studentAttendees = computed(() => {
    console.log(`Computing studentAttendees: filteredAttendees length = ${filteredAttendees.value.length}, paginatedAttendees length = ${paginatedAttendees.value.length}`);
    
    // If we're in "all" type mode but there are no students in the current page,
    // we need to ensure we still get some students
    if (typeFilter.value === 'all' && paginatedAttendees.value.length > 0) {
      const studentsInCurrentPage = paginatedAttendees.value.filter(attendee => 
        (attendee.type === 'student') || 
        (attendee.registrationId && attendee.registrationId.startsWith('XC'))
      );
      
      console.log(`Students in current page: ${studentsInCurrentPage.length}`);
      
      // If there are no students in the current page but there are students overall,
      // we'll paginate just the students
      if (studentsInCurrentPage.length === 0 && allFilteredStudents.value.length > 0) {
        console.log(`No students in current page but ${allFilteredStudents.value.length} students overall. Providing students directly.`);
        
        // Get a page of students directly
        const start = (currentPage.value - 1) * props.itemsPerPage;
        const end = start + props.itemsPerPage;
        let studentsPage = allFilteredStudents.value.slice(start, Math.min(end, allFilteredStudents.value.length));
        
        if (sortConfig.value.key) {
          studentsPage.sort((a, b) => {
            const aValue = a[sortConfig.value.key];
            const bValue = b[sortConfig.value.key];
            
            if (sortConfig.value.direction === 'asc') {
              return aValue > bValue ? 1 : -1;
            } else {
              return aValue < bValue ? 1 : -1;
            }
          });
        }
        
        return studentsPage;
      }
      
      // Regular case - use students from current page
      if (sortConfig.value.key) {
        studentsInCurrentPage.sort((a, b) => {
          const aValue = a[sortConfig.value.key];
          const bValue = b[sortConfig.value.key];
          
          if (sortConfig.value.direction === 'asc') {
            return aValue > bValue ? 1 : -1;
          } else {
            return aValue < bValue ? 1 : -1;
          }
        });
      }
      
      return studentsInCurrentPage;
    } else {
      // For student-specific filtering, use the normal approach
      let filtered = paginatedAttendees.value.filter(attendee => 
        (attendee.type === 'student') || 
        (attendee.registrationId && attendee.registrationId.startsWith('XC'))
      );
      
      if (sortConfig.value.key) {
        filtered.sort((a, b) => {
          const aValue = a[sortConfig.value.key];
          const bValue = b[sortConfig.value.key];
          
          if (sortConfig.value.direction === 'asc') {
            return aValue > bValue ? 1 : -1;
          } else {
            return aValue < bValue ? 1 : -1;
          }
        });
      }
      
      return filtered;
    }
  });

  // Get all filtered consultants before pagination to check if any exist
  const allFilteredConsultants = computed(() => {
    return filteredAttendees.value.filter(attendee => 
      (attendee.type === 'consultant') || 
      (attendee.registrationId && attendee.registrationId.startsWith('ACCWA'))
    );
  });

  // Modify the consultantAttendees computed property to ensure consultants are shown
  const consultantAttendees = computed(() => {
    console.log(`Computing consultantAttendees: filteredAttendees length = ${filteredAttendees.value.length}, paginatedAttendees length = ${paginatedAttendees.value.length}`);
    
    // If we're in "all" type mode but there are no consultants in the current page,
    // we need to ensure we still get some consultants
    if (typeFilter.value === 'all' && paginatedAttendees.value.length > 0) {
      const consultantsInCurrentPage = paginatedAttendees.value.filter(attendee => 
        (attendee.type === 'consultant') || 
        (attendee.registrationId && attendee.registrationId.startsWith('ACCWA'))
      );
      
      console.log(`Consultants in current page: ${consultantsInCurrentPage.length}`);
      
      // If there are no consultants in the current page but there are consultants overall,
      // we'll paginate just the consultants
      if (consultantsInCurrentPage.length === 0 && allFilteredConsultants.value.length > 0) {
        console.log(`No consultants in current page but ${allFilteredConsultants.value.length} consultants overall. Providing consultants directly.`);
        
        // Get a page of consultants directly
        const start = (currentPage.value - 1) * props.itemsPerPage;
        const end = start + props.itemsPerPage;
        let consultantsPage = allFilteredConsultants.value.slice(start, Math.min(end, allFilteredConsultants.value.length));
        
        if (sortConfig.value.key) {
          consultantsPage.sort((a, b) => {
            const aValue = a[sortConfig.value.key];
            const bValue = b[sortConfig.value.key];
            
            if (sortConfig.value.direction === 'asc') {
              return aValue > bValue ? 1 : -1;
            } else {
              return aValue < bValue ? 1 : -1;
            }
          });
        }
        
        return consultantsPage;
      }
      
      // Regular case - use consultants from current page
      if (sortConfig.value.key) {
        consultantsInCurrentPage.sort((a, b) => {
          const aValue = a[sortConfig.value.key];
          const bValue = b[sortConfig.value.key];
          
          if (sortConfig.value.direction === 'asc') {
            return aValue > bValue ? 1 : -1;
          } else {
            return aValue < bValue ? 1 : -1;
          }
        });
      }
      
      return consultantsInCurrentPage;
    } else {
      // For consultant-specific filtering, use the normal approach
      let filtered = paginatedAttendees.value.filter(attendee => 
        (attendee.type === 'consultant') || 
        (attendee.registrationId && attendee.registrationId.startsWith('ACCWA'))
      );
      
      if (sortConfig.value.key) {
        filtered.sort((a, b) => {
          const aValue = a[sortConfig.value.key];
          const bValue = b[sortConfig.value.key];
          
          if (sortConfig.value.direction === 'asc') {
            return aValue > bValue ? 1 : -1;
          } else {
            return aValue < bValue ? 1 : -1;
          }
        });
      }
      
      return filtered;
    }
  });
  
  // Add sorting function for column headers
  const handleSort = (column) => {
    if (!column.sortable) return;
    
    // If clicking the same column, toggle direction
    if (sortConfig.value.key === column.key) {
      sortConfig.value.direction = sortConfig.value.direction === 'asc' ? 'desc' : 'asc';
    } else {
      // Otherwise set this column as sort key with default ascending direction
      sortConfig.value.key = column.key;
      sortConfig.value.direction = 'asc';
    }
  }
  
  // Fetch attendees from Firestore
  const fetchAttendees = async () => {
    try {
      console.log('Fetching attendees...');
      isLoading.value = true;
      
      const { collection, getDocs, query } = await import('firebase/firestore');
      
      // Only get data from attendees collection since it contains both students and consultants
      const attendeesQuery = query(collection(db, 'attendees'));
      const attendeesSnapshot = await getDocs(attendeesQuery);
      
      console.log('AttendeesSnapshot size:', attendeesSnapshot.size);
      
      const attendeesList = [];
      
      // Process all attendees
      attendeesSnapshot.forEach(doc => {
        const data = doc.data();
        
        // Make sure we have a registrationId and ensure it has the correct prefix
        let registrationId = data.registrationId || doc.id;
        
        // Determine type based on existing type field or registration ID prefix
        let type = data.type;
        
        // If type is not explicitly set, derive it from registration ID
        if (!type) {
          if (registrationId.startsWith('XC')) {
            type = 'student';
          } else if (registrationId.startsWith('ACCWA')) {
            type = 'consultant';
          } else {
            // If we can't determine from existing ID, set a prefix based on data structure
            if (data.firstName || data.lastName || data.schoolName) {
              type = 'student';
              if (!registrationId.startsWith('XC')) {
                registrationId = `XC-${registrationId}`;
              }
            } else if (data.consultantName || data.consultancyName) {
              type = 'consultant';
              if (!registrationId.startsWith('ACCWA')) {
                registrationId = `ACCWA-${registrationId}`;
              }
            }
          }
        } else {
          // If type is explicitly set but registration ID doesn't match the type
          if (type === 'student' && !registrationId.startsWith('XC')) {
            registrationId = `XC-${registrationId}`;
          } else if (type === 'consultant' && !registrationId.startsWith('ACCWA')) {
            registrationId = `ACCWA-${registrationId}`;
          }
        }
        
        // Add each attendee with their complete data structure
        attendeesList.push({
          id: doc.id,
          ...data,
          // Set the cleaned up registration ID and type
          registrationId: registrationId,
          type: type,
          // Convert timestamp to Date if exists
          checkInTime: data.checkInTime?.toDate() || null,
          // Convert timestamp in checkedInBy if exists
          checkedInBy: data.checkedInBy ? {
            ...data.checkedInBy,
            timestamp: data.checkedInBy.timestamp?.toDate() || null
          } : null
        });
      });
      
      // Log samples for debugging
      if (attendeesList.length > 0) {
        const studentSample = attendeesList.find(a => a.type === 'student' || a.registrationId?.startsWith('XC'));
        const consultantSample = attendeesList.find(a => a.type === 'consultant' || a.registrationId?.startsWith('ACCWA'));
        
        if (studentSample) {
          console.log('Sample student:', studentSample);
          console.log('Student registration ID:', studentSample.registrationId);
        }
        
        if (consultantSample) {
          console.log('Sample consultant:', consultantSample);
          console.log('Consultant registration ID:', consultantSample.registrationId);
        }
      }
      
      // Sort by check-in time if available, otherwise by ID
      attendeesList.sort((a, b) => {
        if (a.checkInTime && b.checkInTime) {
          return b.checkInTime - a.checkInTime;
        }
        return a.id.localeCompare(b.id);
      });
      
      // Update the attendees ref with the new data
      attendees.value = attendeesList;

      // DEBUG: Log the counts for the full list
      const studentCount = attendeesList.filter(a => a.type === 'student' || a.registrationId?.startsWith('XC')).length;
      const consultantCount = attendeesList.filter(a => a.type === 'consultant' || a.registrationId?.startsWith('ACCWA')).length;
      console.log(`Loaded ${attendeesList.length} total attendees (${studentCount} students, ${consultantCount} consultants)`);
      
      // Log the current filters (don't access computed properties yet)
      console.log(`Current filters - Status: ${statusFilter.value}, Type: ${typeFilter.value}`);
      
      // The computed properties (paginatedAttendees, studentAttendees, etc.) will update automatically
      // They should NOT be accessed here directly to avoid timing issues
      
    } catch (error) {
      console.error('Error fetching attendees:', error);
      emit('error', `Failed to fetch attendees: ${error.message}`);
    } finally {
      isLoading.value = false;
    }
  };
  
  // Toggle check-in status
  const toggleCheckInStatus = async (attendee) => {
    try {
      const { doc, updateDoc, serverTimestamp } = await import('firebase/firestore');
      
      const newStatus = !attendee.checkInStatus;
      
      // Prepare the update data
      const updateData = {
        checkInStatus: newStatus,
        checkInTime: newStatus ? serverTimestamp() : null,
        checkedInBy: newStatus ? {
          adminId: 'currentAdminId', // TODO: Get this from auth context
          adminName: 'Admin', // TODO: Get this from auth context
          timestamp: serverTimestamp()
        } : null
      };
      
      // Update Firestore - all attendees are in the 'attendees' collection
      await updateDoc(doc(db, 'attendees', attendee.id), updateData);
      
      // Update local state
      attendee.checkInStatus = newStatus;
      attendee.checkInTime = newStatus ? new Date() : null;
      attendee.checkedInBy = newStatus ? {
        adminId: 'currentAdminId', // TODO: Get this from auth context
        adminName: 'Admin', // TODO: Get this from auth context
        timestamp: new Date()
      } : null;
      
      // Emit event
      if (newStatus) {
        emit('check-in', attendee);
      } else {
        emit('undo-check-in', attendee);
      }
      
      // Update selected attendee if open
      if (selectedAttendee.value && selectedAttendee.value.id === attendee.id) {
        selectedAttendee.value = { ...attendee };
      }
    } catch (error) {
      console.error('Error toggling check-in status:', error);
      emit('error', 'Failed to update check-in status');
    }
  };
  
  // View attendee details
  const viewDetails = (attendee) => {
    selectedAttendee.value = { ...attendee }
  }
  
  // Refresh attendees list
  const refreshAttendees = () => {
    fetchAttendees()
  }
  
  // Format date for display
  const formatDate = (date) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleDateString()
  }
  
  // Format time for display
  const formatTime = (date) => {
    if (!date) return ''
    return new Date(date).toLocaleTimeString()
  }
  
  // Format date and time for display
  const formatDateTime = (date) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleString()
  }
  
  // Get name initials
  const getInitials = (name) => {
    if (!name) return '?'
    
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }
  
  // Helper function to get attendee name based on type
  const getAttendeeName = (attendee) => {
    if (attendee.registrationId?.startsWith('XC')) {
      // Student name
      return attendee.fullName || `${attendee.firstName || ''} ${attendee.lastName || ''}`.trim() || 'N/A';
    } else {
      // Consultant name
      return attendee.consultantName || 'N/A';
    }
  }
  
  // Lifecycle hooks
  onMounted(() => {
    // Fetch attendees on mount
    fetchAttendees()
    
    // Set up auto-refresh if enabled
    if (props.autoRefresh && props.refreshInterval > 0) {
      refreshIntervalId.value = setInterval(() => {
        fetchAttendees()
      }, props.refreshInterval)
    }
  })
  
  // Clean up interval on unmount
  onBeforeUnmount(() => {
    if (refreshIntervalId.value) {
      clearInterval(refreshIntervalId.value)
    }
  })
  
  // Watch for search and filter changes to reset pagination
  watch([searchTerm, statusFilter, typeFilter], () => {
    currentPage.value = 1
  })
  
  // Expose methods to parent
  defineExpose({
    fetchAttendees,
    refreshAttendees,
    toggleCheckInStatus
  })
  </script>