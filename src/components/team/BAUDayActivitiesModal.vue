<!-- src/components/team/BAUDayActivitiesModal.vue -->
<template>
  <div v-if="show" class="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300">
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-xl mx-4 max-h-[90vh] flex flex-col overflow-hidden transform transition-all duration-300 scale-100 opacity-100">
      <!-- Header with gradient background -->
      <div class="bg-gradient-to-r from-red-500 to-red-600 p-5 text-white">
        <div class="flex justify-between items-center">
          <h3 class="text-xl font-bold tracking-tight">
            Aktivitas: {{ formatDate(date) }}
          </h3>
          <button
            @click="$emit('close')"
            class="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white"
          >
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="flex items-center mt-2 text-sm text-white text-opacity-90">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
          </svg>
          <span>{{ formatDateOnly(date) }}</span>
        </div>
      </div>
      
      <!-- Activity Count Pills -->
      <div class="px-5 py-3 bg-gray-50 border-b flex items-center space-x-3">
        <div class="flex items-center bg-white rounded-full px-3 py-1 text-xs font-medium text-gray-600 shadow-sm">
          <span class="text-red-600 font-bold mr-1">{{ activities.length }}</span> Aktivitas
        </div>
        
        <div v-if="getStatusCounts.done > 0" class="flex items-center bg-green-100 rounded-full px-3 py-1 text-xs font-medium text-green-700 shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
          <span>{{ getStatusCounts.done }} Selesai</span>
        </div>
        
        <div v-if="getStatusCounts.planned > 0" class="flex items-center bg-yellow-100 rounded-full px-3 py-1 text-xs font-medium text-yellow-700 shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
          </svg>
          <span>{{ getStatusCounts.planned }} Rencana</span>
        </div>
      </div>
      
      <!-- Content -->
      <div class="p-5 flex-1 overflow-y-auto">
        <div v-if="activities.length === 0" class="flex flex-col items-center justify-center py-10 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p class="text-center font-medium">Tidak ada aktivitas untuk tanggal ini</p>
          <p class="text-sm mt-1">Aktivitas akan muncul di sini setelah ditambahkan</p>
        </div>
        
        <div v-else class="space-y-4">
          <div 
            v-for="activity in activities" 
            :key="activity.id"
            class="bg-white rounded-lg border border-gray-100 hover:border-red-200 shadow-sm hover:shadow-md p-4 cursor-pointer transition-all duration-200"
            :class="getDepartmentColors(activity.creator?.department_id).border"
            @click="$emit('view-details', activity)"
          >
            <div class="flex justify-between items-start">
              <div class="flex-1">
                <!-- Activity Header with Badge and Type -->
                <div class="flex flex-wrap items-center gap-2 mb-2">
                  <span 
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="getStatusClass(activity.state)"
                  >
                    {{ getStatusText(activity.state) }}
                  </span>
                  <span 
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="getTypeClass(activity.activity_type)"
                  >
                    {{ getTypeText(activity.activity_type) }}
                  </span>
                  <span 
                    v-if="activity.creator?.id === userEmployeeId"
                    class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                    </svg>
                    Saya
                  </span>
                </div>
                
                <!-- Activity Title -->
                <h4 class="text-base font-medium text-gray-900 group-hover:text-red-600 transition-colors mb-2">
                  {{ activity.name }}
                </h4>
                
                <!-- Department Badge -->
                <div v-if="activity.creator?.department_name" 
                     class="inline-block mb-2 px-2 py-0.5 text-xs rounded-md"
                     :class="[getDepartmentColors(activity.creator?.department_id).bg, 'text-gray-800']">
                  {{ activity.creator?.department_name }}
                </div>
                
                <!-- Activity Details -->
                <div class="grid grid-cols-2 gap-2 text-xs text-gray-500">
                  <div class="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 mr-1.5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
                    </svg>
                    {{ activity.time?.start || '00:00' }} - {{ activity.time?.end || '00:00' }}
                  </div>
                  
                  <div class="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 mr-1.5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
                    </svg>
                    <span class="font-medium">{{ activity.hours_spent }}</span> jam
                  </div>
                  
                  <div v-if="activity.project" class="flex items-center col-span-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 mr-1.5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd" />
                    </svg>
                    {{ activity.project.name }}
                  </div>
                  
                  <div class="flex items-center col-span-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 mr-1.5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                    </svg>
                    {{ activity.creator?.name || 'Tidak diketahui' }}
                    <span v-if="activity.creator?.position" class="ml-1 text-gray-400">• {{ activity.creator?.position }}</span>
                  </div>
                </div>
              </div>
              
              <!-- More button -->
              <div>
                <button
                  class="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Footer -->
      <div class="p-5 border-t bg-gray-50">
        <div class="flex justify-end">
          <button
            v-if="isToday"
            @click="$emit('add')"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
            </svg>
            Tambah Aktivitas
          </button>
          <button
            v-else
            @click="$emit('close')"
            class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  date: {
    type: String,
    default: ''
  },
  activities: {
    type: Array,
    default: () => []
  },
  isToday: {
    type: Boolean,
    default: false
  },
  userEmployeeId: {
    type: [Number, String],
    default: null
  }
});

defineEmits(['close', 'view-details', 'add']);

// Department colors function
const getDepartmentColors = (departmentId) => {
  // Mapping of department IDs to colors (border and background)
  const departmentColors = {
    1: { border: 'border-l-4 border-l-red-500', bg: 'bg-red-50' },
    2: { border: 'border-l-4 border-l-blue-500', bg: 'bg-blue-50' },
    3: { border: 'border-l-4 border-l-green-500', bg: 'bg-green-50' },
    4: { border: 'border-l-4 border-l-yellow-500', bg: 'bg-yellow-50' },
    5: { border: 'border-l-4 border-l-purple-500', bg: 'bg-purple-50' },
    6: { border: 'border-l-4 border-l-pink-500', bg: 'bg-pink-50' },
    7: { border: 'border-l-4 border-l-indigo-500', bg: 'bg-indigo-50' },
    8: { border: 'border-l-4 border-l-orange-500', bg: 'bg-orange-50' },
    9: { border: 'border-l-4 border-l-cyan-500', bg: 'bg-cyan-50' }, // Marketing department
    10: { border: 'border-l-4 border-l-lime-500', bg: 'bg-lime-50' },
    11: { border: 'border-l-4 border-l-teal-500', bg: 'bg-teal-50' },
    12: { border: 'border-l-4 border-l-emerald-500', bg: 'bg-emerald-50' }, // IT Division
    // Add more departments as needed
  };
  
  return departmentColors[departmentId] || { border: 'border-l-4 border-l-gray-300', bg: 'bg-gray-50' };
};

// Status counts computed property
const getStatusCounts = computed(() => {
  const counts = {
    done: 0,
    not_done: 0,
    planned: 0
  };
  
  props.activities.forEach(activity => {
    if (activity.state === 'done') counts.done++;
    else if (activity.state === 'not_done') counts.not_done++;
    else counts.planned++;
  });
  
  return counts;
});

// Helper functions
const formatDate = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  
  // Definisi nama bulan dalam bahasa Indonesia
  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  
  // Definisi nama hari dalam bahasa Indonesia
  const dayNames = [
    'Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'
  ];
  
  return `${dayNames[date.getDay()]}, ${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
};

// New helper for shorter date format
const formatDateOnly = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  
  // Definisi nama bulan dalam bahasa Indonesia
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 
    'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'
  ];
  
  return `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
};

const getStatusClass = (status) => {
  switch (status) {
    case 'done':
      return 'bg-green-100 text-green-800 border border-green-200';
    case 'not_done':
      return 'bg-red-100 text-red-800 border border-red-200';
    default:
      return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
  }
};

const getStatusText = (status) => {
  switch (status) {
    case 'done':
      return 'Selesai';
    case 'not_done':
      return 'Tidak Selesai';
    default:
      return 'Direncanakan';
  }
};

const getTypeClass = (type) => {
  switch (type) {
    case 'meeting':
      return 'bg-blue-100 text-blue-800 border border-blue-200';
    case 'training':
      return 'bg-green-100 text-green-800 border border-green-200';
    case 'support':
      return 'bg-pink-100 text-pink-800 border border-pink-200';
    case 'admin':
      return 'bg-indigo-100 text-indigo-800 border border-indigo-200';
    default:
      return 'bg-gray-100 text-gray-800 border border-gray-200';
  }
};

const getTypeText = (type) => {
  switch (type) {
    case 'meeting':
      return 'Meeting';
    case 'training':
      return 'Training';
    case 'support':
      return 'Support';
    case 'admin':
      return 'Administrasi';
    default:
      return 'Lainnya';
  }
};
</script>

<style scoped>
.text-xxs {
  font-size: 0.65rem;
  line-height: 0.85rem;
}

/* Animation for modal appearance */
@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.transform {
  animation: modalFadeIn 0.2s ease-out;
}
</style>