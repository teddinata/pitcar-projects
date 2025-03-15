<!-- src/components/team/BAUDetailsModal.vue -->
<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div v-if="show && activity" class="fixed inset-0 z-40 overflow-y-auto" @click.self="$emit('close')">
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-black bg-opacity-30" @click.self="$emit('close')"></div>
        
        <!-- Modal -->
        <div class="flex items-center justify-center min-h-screen p-4">
          <div 
            class="bg-white rounded-lg shadow-xl w-full max-w-md relative z-50 mx-auto"
            @click.stop
          >
            <!-- Modal Header -->
            <div class="flex justify-between items-center border-b p-4">
              <h3 class="text-lg font-medium text-gray-900">Detail Aktivitas</h3>
              <button
                @click="$emit('close')"
                class="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <span class="sr-only">Close</span>
                <XCircleIcon class="h-6 w-6" />
              </button>
            </div>
            
            <!-- Modal Content -->
            <div class="p-4">
              <div class="space-y-4">
                <div>
                  <h4 class="text-sm font-medium text-gray-500">Nama Aktivitas</h4>
                  <p class="mt-1 text-md text-gray-900">{{ activity.name }}</p>
                </div>

                <div class="flex space-x-4">
                  <div>
                    <h4 class="text-sm font-medium text-gray-500">Tanggal</h4>
                    <p class="mt-1 text-md text-gray-900">{{ formatDate(activity.date) }}</p>
                  </div>
                  <div>
                    <h4 class="text-sm font-medium text-gray-500">Waktu</h4>
                    <p class="mt-1 text-md text-gray-900">{{ activity.time_start }} - {{ activity.time_end }}</p>
                  </div>
                  <div>
                    <h4 class="text-sm font-medium text-gray-500">Durasi</h4>
                    <p class="mt-1 text-md text-gray-900">{{ activity.hours_spent }} jam</p>
                  </div>
                </div>

                <div>
                  <h4 class="text-sm font-medium text-gray-500">Jenis</h4>
                  <p class="mt-1">
                    <span 
                      :class="[
                        'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                        getActivityTypeColorClass(activity.activity_type)
                      ]"
                    >
                      {{ getTranslatedActivityType(activity.activity_type) }}
                    </span>
                  </p>
                </div>

                <div>
                  <h4 class="text-sm font-medium text-gray-500">Status</h4>
                  <p class="mt-1">
                    <span 
                      :class="[
                        'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                        getActivityStatusClass(activity.state)
                      ]"
                    >
                      {{ activity.state === 'done' ? 'Selesai' : 
                        activity.state === 'not_done' ? 'Tidak Selesai' : 'Direncanakan' }}
                    </span>
                  </p>
                </div>

                <div v-if="activity.description">
                  <h4 class="text-sm font-medium text-gray-500">Deskripsi</h4>
                  <p class="mt-1 text-md text-gray-900">{{ activity.description }}</p>
                </div>
                
                <div v-if="activity.project">
                  <h4 class="text-sm font-medium text-gray-500">Proyek</h4>
                  <p class="mt-1 text-md text-gray-900">{{ activity.project.name }}</p>
                </div>
                
                <div v-if="activity.verified_by">
                  <h4 class="text-sm font-medium text-gray-500">Informasi Verifikasi</h4>
                  <p class="mt-1 text-xs text-gray-500">
                    <span class="font-medium">Diverifikasi oleh:</span> {{ activity.verified_by.name }}
                  </p>
                  <p class="mt-1 text-xs text-gray-500">
                    <span class="font-medium">Pada:</span> {{ formatDateTime(activity.verification_date) }}
                  </p>
                  <p v-if="activity.verification_reason" class="mt-1 text-xs text-gray-500">
                    <span class="font-medium">Alasan:</span> {{ activity.verification_reason }}
                  </p>
                </div>
              </div>
              
              <div class="mt-6 flex justify-end space-x-3">
                <button
                  v-if="canEditActivity"
                  type="button"
                  @click="$emit('edit')"
                  class="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  Edit
                </button>
                
                <div v-if="canVerifyActivity" class="flex space-x-2">
                  <button
                    type="button"
                    @click="$emit('verify', 'done')"
                    class="inline-flex justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  >
                    <CheckIcon class="h-4 w-4 mr-1.5" />
                    Selesai
                  </button>
                  <button
                    type="button"
                    @click="$emit('verify', 'not_done')"
                    class="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    <XMarkIcon class="h-4 w-4 mr-1.5" />
                    Tidak Selesai
                  </button>
                </div>
                
                <button
                  type="button"
                  @click="$emit('close')"
                  class="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
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

// Computed properties for activity status
const canEditActivity = computed(() => {
  if (!props.activity) return false;
  
  // Current date
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Activity date
  const activityDate = new Date(props.activity.date);
  activityDate.setHours(0, 0, 0, 0);
  
  // Can only edit today's activities or future activities
  const diffDays = Math.floor((today - activityDate) / (1000 * 60 * 60 * 24));
  
  // If it's verified, can't edit anymore
  if (props.activity.verified_by) return false;
  
  // Allow editing if it's today's activity or a future activity
  return diffDays <= 0;
});

const canVerifyActivity = computed(() => {
  if (!props.activity) return false;
  if (props.activity.state !== 'planned') return false;
  
  const activityDate = new Date(props.activity.date);
  activityDate.setHours(0, 0, 0, 0);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const diffDays = Math.floor((today - activityDate) / (1000 * 60 * 60 * 24));
  
  // Can verify if activity is on today or yesterday
  return diffDays <= 1;
});

// Helper methods
function formatDate(dateString) {
  const date = new Date(dateString);
  
  // Indonesian month names
  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  
  return `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
}

function formatDateTime(dateTimeString) {
  if (!dateTimeString) return '-';
  
  const dateTime = new Date(dateTimeString);
  
  // Indonesian month names
  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  
  const day = dateTime.getDate();
  const month = monthNames[dateTime.getMonth()];
  const year = dateTime.getFullYear();
  const hours = String(dateTime.getHours()).padStart(2, '0');
  const minutes = String(dateTime.getMinutes()).padStart(2, '0');
  
  return `${day} ${month} ${year}, ${hours}:${minutes}`;
}

function getActivityTypeColorClass(type) {
  if (!type) return 'bg-gray-100 text-gray-800';
  
  const colorMap = {
    'meeting': 'bg-blue-100 text-blue-800',
    'training': 'bg-green-100 text-green-800',
    'support': 'bg-pink-100 text-pink-800',
    'admin': 'bg-indigo-100 text-indigo-800',
    'other': 'bg-gray-100 text-gray-800'
  };
  
  return colorMap[type.toLowerCase()] || 'bg-gray-100 text-gray-800';
}

function getActivityStatusClass(state) {
  // Status class takes precedence
  switch(state) {
    case 'done':
      return 'bg-green-100 text-green-800';
    case 'not_done':
      return 'bg-red-100 text-red-800';
    default: // planned
      return 'bg-yellow-100 text-yellow-800';
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
</script>