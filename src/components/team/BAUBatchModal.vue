<!-- src/components/team/BAUBatchModal.vue -->
<template>
  <div v-if="show" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col">
      <!-- Header -->
      <div class="flex justify-between items-center p-4 border-b">
        <h3 class="text-lg font-medium text-gray-900">
          Rencanakan Aktivitas BAU Batch
        </h3>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-500 focus:outline-none"
          :disabled="submitting"
        >
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <!-- Content -->
      <div class="p-4 flex-1 overflow-y-auto">
        <form @submit.prevent="handleSubmit">
          <!-- Activity Name -->
          <div class="mb-4">
            <label for="batch-name" class="block text-sm font-medium text-gray-700">Nama Aktivitas</label>
            <input
              id="batch-name"
              v-model="localFormData.name"
              type="text"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
              placeholder="Nama aktivitas BAU"
            />
          </div>
          
          <!-- Activity Type -->
          <div class="mb-4">
            <label for="batch-type" class="block text-sm font-medium text-gray-700">Tipe Aktivitas</label>
            <select
              id="batch-type"
              v-model="localFormData.activity_type"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
            >
              <option value="meeting">Meeting</option>
              <option value="training">Training</option>
              <option value="support">Support</option>
              <option value="admin">Administrasi</option>
              <option value="other">Lainnya</option>
            </select>
          </div>
          
          <!-- Project -->
          <div class="mb-4">
            <label for="batch-project" class="block text-sm font-medium text-gray-700">Proyek</label>
            <select
              id="batch-project"
              v-model="localFormData.project_id"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
            >
              <option value="">Tanpa Proyek</option>
              <option v-for="project in projects" :key="project.id" :value="project.id">
                {{ project.name }}
              </option>
            </select>
          </div>

          <!-- Creator (For admin or team leads) -->
          <div v-if="isAdmin" class="mb-4">
            <label for="batch-creator" class="block text-sm font-medium text-gray-700">Dibuat Untuk</label>
            <select
              id="batch-creator"
              v-model="localFormData.creator_id"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
            >
              <option v-for="employee in employees" :key="employee.id" :value="employee.id">
                {{ employee.name }}
              </option>
            </select>
            <p class="mt-1 text-xs text-gray-500">
              Anda membuat aktivitas atas nama anggota tim.
            </p>
          </div>
          
          <!-- Date Range -->
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-4">
            <div>
              <label for="batch-date-from" class="block text-sm font-medium text-gray-700">Tanggal Mulai</label>
              <input
                id="batch-date-from"
                v-model="localFormData.date_from"
                type="date"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
              />
            </div>
            <div>
              <label for="batch-date-to" class="block text-sm font-medium text-gray-700">Tanggal Selesai</label>
              <input
                id="batch-date-to"
                v-model="localFormData.date_to"
                type="date"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
              />
            </div>
          </div>
          
          <!-- Exclude Weekends -->
          <div class="mb-4">
            <div class="flex items-center">
              <input
                id="batch-exclude-weekends"
                v-model="localFormData.exclude_weekends"
                type="checkbox"
                class="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
              />
              <label for="batch-exclude-weekends" class="ml-2 block text-sm text-gray-700">
                Kecualikan akhir pekan (Sabtu-Minggu)
              </label>
            </div>
          </div>
          
          <!-- Time Range -->
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-4">
            <div>
              <label for="batch-time-start" class="block text-sm font-medium text-gray-700">Waktu Mulai</label>
              <input
                id="batch-time-start"
                v-model="localFormData.time_start"
                type="time"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
              />
            </div>
            <div>
              <label for="batch-time-end" class="block text-sm font-medium text-gray-700">Waktu Selesai</label>
              <input
                id="batch-time-end"
                v-model="localFormData.time_end"
                type="time"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
              />
            </div>
          </div>
          
          <!-- Hours Spent -->
          <div class="mb-4">
            <label for="batch-hours" class="block text-sm font-medium text-gray-700">Jam Kerja</label>
            <input
              id="batch-hours"
              v-model.number="localFormData.hours_spent"
              type="number"
              step="0.1"
              min="0.1"
              max="24"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
              placeholder="Jam kerja (otomatis dari waktu mulai/selesai)"
            />
          </div>
          
          <!-- Description -->
          <div class="mb-4">
            <label for="batch-description" class="block text-sm font-medium text-gray-700">Deskripsi</label>
            <textarea
              id="batch-description"
              v-model="localFormData.description"
              rows="3"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
              placeholder="Deskripsi aktivitas (opsional)"
            ></textarea>
          </div>
        </form>
      </div>
      
      <!-- Footer -->
      <div class="p-4 border-t">
        <div class="flex justify-end space-x-3">
          <button
            @click="$emit('close')"
            class="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            :disabled="submitting"
          >
            Batal
          </button>
          <button
            @click="handleSubmit"
            class="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            :disabled="submitting"
          >
            <svg v-if="submitting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ submitting ? 'Menyimpan...' : 'Buat Aktivitas Batch' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth'; // Ubah dari @/stores/user

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  formData: {
    type: Object,
    required: true
  },
  projects: {
    type: Array,
    default: () => []
  },
  employees: {
    type: Array,
    default: () => []
  },
  submitting: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close', 'submit', 'update:hours-spent']);

// Local form data
const localFormData = ref({ ...props.formData });

// Get user store for permissions
// Dalam setup function
const authStore = useAuthStore();

// Tambahkan computed properties untuk permissions
const isAdmin = computed(() => {
  return authStore.user?.is_admin === true || localStorage.getItem('isAdmin') === 'true';
});

const isTeamLead = computed(() => {
  return localStorage.getItem('isTeamLead') === 'true' || authStore.user?.is_team_lead === true;
});

// Watch for changes to form data from parent
watch(() => props.formData, (newFormData) => {
  localFormData.value = { ...newFormData };
}, { deep: true });

// Watch for changes to time values to calculate hours
watch([() => localFormData.value.time_start, () => localFormData.value.time_end], () => {
  if (localFormData.value.time_start && localFormData.value.time_end) {
    try {
      // Parse time strings
      const startParts = localFormData.value.time_start.split(':').map(Number);
      const endParts = localFormData.value.time_end.split(':').map(Number);
      
      const startHours = startParts[0] + (startParts[1] / 60);
      const endHours = endParts[0] + (endParts[1] / 60);
      
      // Calculate duration (handle overnight activities)
      let duration = endHours - startHours;
      if (duration < 0) {
        duration = 24 + duration; // Add 24 hours if end time is on next day
      }
      
      localFormData.value.hours_spent = parseFloat(duration.toFixed(2));
      emit('update:hours-spent', localFormData.value.hours_spent);
    } catch (e) {
      console.error('Error calculating hours:', e);
    }
  }
});

const hasAdminRights = computed(() => isAdmin.value || isTeamLead.value);

// 3. Update di komponen lain yang menggunakan userStore
// Contoh di BAUCalendarWeekView.vue dan BAUDayActivitiesModal.vue
// Di mana pun ada userStore, ganti dengan authStore dan sesuaikan propertinya

// 4. Pastikan semua referensi ke userStore.employeeId diubah
// Contoh: canEditActivity dan canVerifyActivity methods

const canEditActivity = (activity) => {
  if (!activity) return false;
  
  // Current date
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Activity date
  const activityDate = new Date(activity.date);
  activityDate.setHours(0, 0, 0, 0);
  
  // Can only edit today's activities or future activities
  const diffDays = Math.floor((today - activityDate) / (1000 * 60 * 60 * 24));
  
  // If it's verified, can't edit anymore
  if (activity.verification && activity.verification.verified_by) return false;
  
  // Check if current user is activity creator or has admin rights
  const isCreator = activity.creator?.id === userEmployeeId.value;
  
  // Allow editing if it's today's activity or a future activity
  // AND either user is creator or admin
  return diffDays <= 0 && (isCreator || isAdmin.value);
};

const canVerifyActivity = (activity) => {
  if (!activity) return false;
  if (activity.state !== 'planned') return false;
  
  const activityDate = new Date(activity.date);
  activityDate.setHours(0, 0, 0, 0);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const diffDays = Math.floor((today - activityDate) / (1000 * 60 * 60 * 24));
  
  // Check if current user is activity creator or has verification rights
  const isCreator = activity.creator?.id === userEmployeeId.value;
  
  // Can verify if activity is on today or yesterday AND user has rights
  return diffDays <= 1 && (isCreator || canVerifyBAU.value);
};


// Form submission
const handleSubmit = () => {
  // Basic validation
  if (!localFormData.value.name || !localFormData.value.date_from || !localFormData.value.date_to) {
    return;
  }
  
  // Validate date range
  const startDate = new Date(localFormData.value.date_from);
  const endDate = new Date(localFormData.value.date_to);
  
  if (startDate > endDate) {
    alert('Tanggal mulai harus sebelum tanggal selesai.');
    return;
  }
  
  // Emit submit event with form data
  emit('submit', localFormData.value);
};

// Reset local form when closing
watch(() => props.show, (isVisible) => {
  if (!isVisible) {
    localFormData.value = { ...props.formData };
  }
});
</script>