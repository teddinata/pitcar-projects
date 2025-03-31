<!-- src/components/team/BAUDayActivitiesModal.vue -->
<template>
  <div v-if="show" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 max-h-[90vh] flex flex-col">
      <!-- Header -->
      <div class="flex justify-between items-center p-4 border-b">
        <h3 class="text-lg font-medium text-gray-900">
          Aktivitas BAU: {{ formatDate(date) }}
        </h3>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-500 focus:outline-none"
        >
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <!-- Content -->
      <div class="p-4 flex-1 overflow-y-auto">
        <div v-if="activities.length === 0" class="text-center py-6 text-gray-500">
          Tidak ada aktivitas untuk tanggal ini.
        </div>
        
        <div v-else class="divide-y space-y-3">
          <div 
            v-for="activity in activities" 
            :key="activity.id"
            class="pt-3 cursor-pointer group"
            @click="$emit('view-details', activity)"
          >
            <div class="flex justify-between items-start">
              <div class="flex-1">
                <div class="flex items-start justify-between">
                  <span 
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mb-1"
                    :class="getStatusClass(activity.state)"
                  >
                    {{ getStatusText(activity.state) }}
                  </span>
                  <span 
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mb-1 ml-2"
                    :class="getTypeClass(activity.activity_type)"
                  >
                    {{ getTypeText(activity.activity_type) }}
                  </span>
                </div>
                <h4 class="text-sm font-medium text-gray-900 group-hover:text-red-600 transition-colors mb-1 flex items-center">
                  {{ activity.name }}
                  <span v-if="activity.creator?.id === userEmployeeId" class="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                    </svg>
                    Saya
                  </span>
                </h4>
                <div class="text-xs text-gray-500 mb-1">
                  <div class="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
                    </svg>
                    {{ activity.time?.start || '00:00' }} - {{ activity.time?.end || '00:00' }} ({{ activity.hours_spent }} jam)
                  </div>
                </div>
                <div v-if="activity.project" class="text-xs text-gray-500 mb-1">
                  <div class="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd" />
                    </svg>
                    {{ activity.project.name }}
                  </div>
                </div>
                <div class="text-xs text-gray-500">
                  <div class="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                    </svg>
                    {{ activity.creator?.name || 'Tidak diketahui' }}
                  </div>
                </div>
              </div>
              <div>
                <button
                  class="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-500 focus:outline-none transition-colors"
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
      <div class="p-4 border-t">
        <div class="flex justify-between">
          <div>
            <span class="text-sm text-gray-500">Total: {{ activities.length }} aktivitas</span>
          </div>
          <div>
            <button
              v-if="isToday"
              @click="$emit('add')"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Tambah Aktivitas
            </button>
          </div>
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

const getStatusClass = (status) => {
  switch (status) {
    case 'done':
      return 'bg-green-100 text-green-800';
    case 'not_done':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-yellow-100 text-yellow-800';
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
      return 'bg-blue-100 text-blue-800';
    case 'training':
      return 'bg-green-100 text-green-800';
    case 'support':
      return 'bg-pink-100 text-pink-800';
    case 'admin':
      return 'bg-indigo-100 text-indigo-800';
    default:
      return 'bg-gray-100 text-gray-800';
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