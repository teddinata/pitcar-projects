<!-- src/components/team/BAUDetailsModal.vue -->
<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div v-if="show && activity" class="fixed inset-0 z-50 overflow-y-auto" @click.self="$emit('close')">
        <!-- Backdrop with blur effect -->
        <div class="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm" @click.self="$emit('close')"></div>
        
        <!-- Modal -->
        <div class="flex items-center justify-center min-h-screen p-4">
          <div 
            class="bg-white rounded-xl shadow-2xl w-full max-w-md relative z-50 mx-auto overflow-hidden transform transition-all"
            @click.stop
          >
            <!-- Modal Header with gradient background -->
            <div class="bg-gradient-to-r from-red-500 to-red-600 p-5 text-white">
              <div class="flex justify-between items-center">
                <h3 class="text-xl font-bold tracking-tight">Detail Aktivitas</h3>
                <button
                  @click="$emit('close')"
                  class="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white"
                >
                  <span class="sr-only">Tutup</span>
                  <XCircleIcon class="h-5 w-5" />
                </button>
              </div>
              
              <!-- Activity Title with icon -->
              <div class="mt-3 flex items-start">
                <div class="p-2 bg-white bg-opacity-20 rounded-lg mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <h2 class="text-lg font-bold leading-tight">{{ activity.name }}</h2>
                  <div class="flex items-center text-sm text-white text-opacity-90 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
                    </svg>
                    <span>{{ formatDate(activity.date) }}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Status and Type Pills -->
            <div class="px-5 py-3 bg-gray-50 border-b flex items-center space-x-3">
              <div 
                class="flex items-center rounded-full px-3 py-1 text-xs font-medium shadow-sm"
                :class="getActivityStatusClass(activity.state)"
              >
                <template v-if="activity.state === 'done'">
                  <CheckIcon class="h-3.5 w-3.5 mr-1" />
                  <span>Selesai</span>
                </template>
                <template v-else-if="activity.state === 'not_done'">
                  <XMarkIcon class="h-3.5 w-3.5 mr-1" />
                  <span>Tidak Selesai</span>
                </template>
                <template v-else>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
                  </svg>
                  <span>Direncanakan</span>
                </template>
              </div>
              
              <div 
                class="flex items-center rounded-full px-3 py-1 text-xs font-medium shadow-sm"
                :class="getActivityTypeColorClass(activity.activity_type)"
              >
                <span>{{ getTranslatedActivityType(activity.activity_type) }}</span>
              </div>
            </div>
            
            <!-- Creator Badge -->
            <div v-if="activity.creator" class="px-5 pt-4 pb-2 flex items-center">
              <div class="flex items-center space-x-2">
                <div class="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                  {{ getInitials(activity.creator.name) }}
                </div>
                <div>
                  <div class="text-sm font-medium text-gray-900">{{ activity.creator.name }}</div>
                  <div class="text-xs text-gray-500 flex items-center">
                    <span>{{ activity.creator.position || 'Staff' }}</span>
                    <span v-if="activity.creator.department_name" class="flex items-center">
                      <span class="mx-1">•</span>
                      <span>{{ activity.creator.department_name }}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Modal Content -->
            <div class="px-5 py-3">
              <div class="space-y-5">
                <!-- Time & Duration -->
                <div class="grid grid-cols-2 gap-4">
                  <div class="bg-gray-50 p-3 rounded-lg">
                    <h4 class="text-xs font-medium text-gray-500 mb-1">Waktu</h4>
                    <div class="text-sm font-medium text-gray-900 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
                      </svg>
                      {{ formatTimeDisplay(activity) }}
                    </div>
                  </div>
                  
                  <div class="bg-gray-50 p-3 rounded-lg">
                    <h4 class="text-xs font-medium text-gray-500 mb-1">Durasi</h4>
                    <div class="text-sm font-medium text-gray-900 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
                      </svg>
                      {{ activity.hours_spent }} jam
                    </div>
                  </div>
                </div>
                
                <!-- Project -->
                <div v-if="activity.project" class="bg-gray-50 p-3 rounded-lg">
                  <h4 class="text-xs font-medium text-gray-500 mb-1">Proyek</h4>
                  <div class="text-sm font-medium text-gray-900 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                    </svg>
                    {{ activity.project.name }}
                  </div>
                </div>
                
                <!-- Description -->
                <div v-if="activity.description" class="bg-gray-50 p-3 rounded-lg">
                  <h4 class="text-xs font-medium text-gray-500 mb-1">Deskripsi</h4>
                  <p class="text-sm text-gray-900">{{ activity.description }}</p>
                </div>
                
                <!-- Verification Info -->
                <div v-if="isVerified" class="border border-green-100 bg-green-50 p-3 rounded-lg">
                  <h4 class="text-xs font-medium text-green-700 mb-2 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                    Informasi Verifikasi
                  </h4>
                  <div class="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span class="text-green-600 font-medium">Diverifikasi oleh:</span>
                      <div class="text-gray-700 mt-0.5">{{ activity.verification.verified_by.name }}</div>
                    </div>
                    <div>
                      <span class="text-green-600 font-medium">Pada:</span>
                      <div class="text-gray-700 mt-0.5">{{ formatDateTime(activity.verification.date) }}</div>
                    </div>
                    <div v-if="activity.verification_reason" class="col-span-2 mt-1">
                      <span class="text-green-600 font-medium">Alasan:</span>
                      <div class="text-gray-700 mt-0.5 p-2 bg-white bg-opacity-50 rounded">{{ activity.verification_reason }}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Action Buttons -->
              <div class="mt-6 flex justify-end space-x-3">
                <!-- Edit button - only shown if activity is not verified -->
                <button
                  v-if="!isVerified"
                  type="button"
                  @click="$emit('edit')"
                  class="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  Edit
                </button>
                
                <!-- Verification Buttons - shown if status is 'planned' and not verified -->
                <div v-if="activity.state === 'planned' && !isVerified" class="flex space-x-2">
                  <button
                    type="button"
                    @click="$emit('verify', 'done')"
                    class="inline-flex items-center justify-center rounded-lg border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200"
                  >
                    <CheckIcon class="h-4 w-4 mr-1.5" />
                    Selesai
                  </button>
                  <button
                    type="button"
                    @click="$emit('verify', 'not_done')"
                    class="inline-flex items-center justify-center rounded-lg border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200"
                  >
                    <XMarkIcon class="h-4 w-4 mr-1.5" />
                    Tidak Selesai
                  </button>
                </div>
                
                <button
                  type="button"
                  @click="$emit('close')"
                  class="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue';
import { CheckIcon, XMarkIcon, XCircleIcon } from '@heroicons/vue/24/outline';

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  activity: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['close', 'edit', 'verify']);

// Computed property to check if activity is already verified
const isVerified = computed(() => {
  if (!props.activity || !props.activity.verification) return false;
  return !!props.activity.verification.verified_by;
});

// Helper methods
function formatDate(dateString) {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  
  // Indonesian month names
  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  
  // Day names
  const dayNames = [
    'Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'
  ];
  
  return `${dayNames[date.getDay()]}, ${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
}

function formatTimeDisplay(activity) {
  if (!activity || !activity.time) {
    return '00:00 - 00:00';
  }
  return `${activity.time.start || '00:00'} - ${activity.time.end || '00:00'}`;
}

function formatDateTime(dateTimeString) {
  if (!dateTimeString) return '-';
  
  const dateTime = new Date(dateTimeString);
  
  // Indonesian month names (short version for smaller space)
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 
    'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'
  ];
  
  const day = dateTime.getDate();
  const month = monthNames[dateTime.getMonth()];
  const year = dateTime.getFullYear();
  const hours = String(dateTime.getHours()).padStart(2, '0');
  const minutes = String(dateTime.getMinutes()).padStart(2, '0');
  
  return `${day} ${month} ${year}, ${hours}:${minutes}`;
}

function getActivityTypeColorClass(type) {
  if (!type) return 'bg-gray-100 text-gray-800 border border-gray-200';
  
  const colorMap = {
    'meeting': 'bg-blue-100 text-blue-800 border border-blue-200',
    'training': 'bg-green-100 text-green-800 border border-green-200',
    'support': 'bg-pink-100 text-pink-800 border border-pink-200',
    'admin': 'bg-indigo-100 text-indigo-800 border border-indigo-200',
    'other': 'bg-gray-100 text-gray-800 border border-gray-200'
  };
  
  return colorMap[type.toLowerCase()] || 'bg-gray-100 text-gray-800 border border-gray-200';
}

function getActivityStatusClass(state) {
  // Status class takes precedence
  switch(state) {
    case 'done':
      return 'bg-green-100 text-green-800 border border-green-200';
    case 'not_done':
      return 'bg-red-100 text-red-800 border border-red-200';
    default: // planned
      return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
  }
}

function getTranslatedActivityType(type) {
  if (!type) return 'Lainnya';
  
  const translations = {
    'meeting': 'Rapat',
    'training': 'Pelatihan',
    'support': 'Support',
    'admin': 'Administrasi',
    'other': 'Lainnya'
  };
  
  return translations[type.toLowerCase()] || type;
}

function getInitials(name) {
  if (!name) return '?';
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
}
</script>

<style scoped>
/* Animation for modal appearance */
.transform {
  will-change: transform, opacity;
}
</style>