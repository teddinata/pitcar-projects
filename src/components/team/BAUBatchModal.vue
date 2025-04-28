<!-- src/components/team/BAUBatchModal.vue -->
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
      <div v-if="show" class="fixed inset-0 z-40 overflow-y-auto" @click.self="$emit('close')">
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-black bg-opacity-30" @click.self="$emit('close')"></div>
        
        <!-- Modal -->
        <div class="flex items-center justify-center min-h-screen p-4">
          <div 
            class="bg-white rounded-lg shadow-xl w-full max-w-2xl relative z-50 mx-auto"
            @click.stop
          >
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
                <XCircleIcon class="h-6 w-6" />
              </button>
            </div>
            
            <!-- Content -->
            <div class="p-6 flex-1 overflow-y-auto">
              <form @submit.prevent="handleSubmit" class="space-y-5">
                <!-- Activity Name -->
                <div>
                  <label for="batch-name" class="block text-sm font-medium text-gray-700 mb-1">Nama Aktivitas <span class="text-red-500">*</span></label>
                  <input
                    id="batch-name"
                    v-model="formValues.name"
                    type="text"
                    required
                    class="block px-3 py-2 w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                    placeholder="Nama aktivitas BAU"
                  />
                </div>
                
                <!-- Activity Type -->
                <div>
                  <label for="batch-type" class="block text-sm font-medium text-gray-700 mb-1">Tipe Aktivitas <span class="text-red-500">*</span></label>
                  <select
                    id="batch-type"
                    v-model="formValues.activity_type"
                    required
                    class="block px-3 py-2 w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                  >
                    <option value="meeting">Meeting</option>
                    <option value="training">Training</option>
                    <option value="support">Support</option>
                    <option value="admin">Administrasi</option>
                    <option value="other">Lainnya</option>
                  </select>
                </div>
                
                <!-- Project -->
                <div>
                  <label for="batch-project" class="block text-sm font-medium text-gray-700 mb-1">Proyek</label>
                  <select
                    id="batch-project"
                    v-model="formValues.project_id"
                    class="block px-3 py-2 w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                  >
                    <option value="">Tanpa Proyek</option>
                    <option v-for="project in projects" :key="project.id" :value="project.id">
                      {{ project.name }}
                    </option>
                  </select>
                </div>

                <!-- Creator (For admin or team leads) -->
                <div v-if="hasAdminRights">
                  <label for="batch-creator" class="block text-sm font-medium text-gray-700 mb-1">Dibuat Untuk <span class="text-red-500">*</span></label>
                  <select
                    id="batch-creator"
                    v-model="formValues.creator_id"
                    class="block px-3 py-2 w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
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
                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label for="batch-date-from" class="block text-sm font-medium text-gray-700 mb-1">Tanggal Mulai <span class="text-red-500">*</span></label>
                    <input
                      id="batch-date-from"
                      v-model="formValues.date_from"
                      type="date"
                      required
                      class="block px-3 py-2 w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label for="batch-date-to" class="block text-sm font-medium text-gray-700 mb-1">Tanggal Selesai <span class="text-red-500">*</span></label>
                    <input
                      id="batch-date-to"
                      v-model="formValues.date_to"
                      type="date"
                      required
                      class="block px-3 py-2 w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                    />
                  </div>
                </div>
                
                <!-- Exclude Weekends -->
                <div>
                  <div class="flex items-center">
                    <input
                      id="batch-exclude-weekends"
                      v-model="formValues.exclude_weekends"
                      type="checkbox"
                      class="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                    />
                    <label for="batch-exclude-weekends" class="ml-2 block text-sm text-gray-700">
                      Kecualikan akhir pekan (Sabtu-Minggu)
                    </label>
                  </div>
                </div>
                
                <!-- Time Range - Gunakan input time standard -->
                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label for="batch-time-start" class="block text-sm font-medium text-gray-700 mb-1">Waktu Mulai <span class="text-red-500">*</span></label>
                    <select
                      id="batch-time-start"
                      v-model="formValues.time_start"
                      @change="calculateHours"
                      class="block px-3 py-2 w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                    >
                      <option v-for="time in timeOptions" :key="time.value" :value="time.value">
                        {{ time.label }}
                      </option>
                    </select>
                  </div>
                  <div>
                    <label for="batch-time-end" class="block text-sm font-medium text-gray-700 mb-1">Waktu Selesai <span class="text-red-500">*</span></label>
                    <select
                      id="batch-time-end"
                      v-model="formValues.time_end"
                      @change="calculateHours"
                      class="block px-3 py-2 w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                    >
                      <option v-for="time in timeOptions" :key="time.value" :value="time.value">
                        {{ time.label }}
                      </option>
                    </select>
                  </div>
                </div>
                
                <!-- Hours Spent - Calculated automatically -->
                <div>
                  <label for="batch-hours" class="block text-sm font-medium text-gray-700 mb-1">Jam Kerja</label>
                  <input
                    id="batch-hours"
                    :value="formValues.hours_spent"
                    type="text"
                    readonly
                    class="block px-3 py-2 w-full rounded-md bg-gray-50 border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                    placeholder="Jam kerja (otomatis dari waktu mulai/selesai)"
                  />
                  <p class="mt-1 text-xs text-gray-500">Dihitung otomatis berdasarkan waktu mulai dan selesai yang dipilih</p>
                </div>
                
                <!-- Description -->
                <div>
                  <label for="batch-description" class="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                  <textarea
                    id="batch-description"
                    v-model="formValues.description"
                    rows="3"
                    class="block px-3 py-2 w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
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
                  class="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  :disabled="submitting"
                >
                  Batal
                </button>
                <button
                  @click="handleSubmit"
                  class="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
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
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue';
import { XCircleIcon } from '@heroicons/vue/24/outline';
import { useAuthStore } from '@/stores/auth';

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

// Completely independent form values
const formValues = ref({
  name: '',
  activity_type: 'meeting',
  date_from: '',
  date_to: '',
  time_start: '08:00',
  time_end: '10:00',
  hours_spent: 2.0,
  project_id: '',
  creator_id: null,
  description: '',
  exclude_weekends: true
});

// Flag to prevent reset during user interaction
const userEditing = ref(false);

// Get auth store for permissions
const authStore = useAuthStore();

// Computed properties for permissions
const isAdmin = computed(() => {
  return authStore.user?.is_admin === true || localStorage.getItem('isAdmin') === 'true';
});

const isTeamLead = computed(() => {
  return localStorage.getItem('isTeamLead') === 'true' || authStore.user?.is_team_lead === true;
});

const hasAdminRights = computed(() => isAdmin.value || isTeamLead.value);

// Generate time options (every 15 minutes from 06:00 to 23:45)
const timeOptions = computed(() => {
  const options = [];
  for (let hour = 6; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const hourStr = hour.toString().padStart(2, '0');
      const minuteStr = minute.toString().padStart(2, '0');
      const value = `${hourStr}:${minuteStr}`;
      const label = `${hourStr}:${minuteStr}`;
      options.push({ value, label });
    }
  }
  return options;
});

// Initialize form values when show changes
watch(() => props.show, (isVisible) => {
  if (isVisible) {
    // Populate form with formData props when modal opens
    initializeForm();
  }
}, { immediate: true });

// Calculate hours whenever time values change
watch([
  () => formValues.value.time_start, 
  () => formValues.value.time_end
], () => {
  calculateHours();
});

// Initialize form with props data
function initializeForm() {
  userEditing.value = false;
  
  // Create a completely new object
  formValues.value = {
    name: props.formData.name || '',
    activity_type: props.formData.activity_type || 'meeting',
    date_from: props.formData.date_from || '',
    date_to: props.formData.date_to || '',
    time_start: props.formData.time_start || '08:00',
    time_end: props.formData.time_end || '10:00',
    hours_spent: props.formData.hours_spent || 2.0,
    project_id: props.formData.project_id || '',
    creator_id: props.formData.creator_id || null,
    description: props.formData.description || '',
    exclude_weekends: props.formData.exclude_weekends !== undefined ? props.formData.exclude_weekends : true
  };
  
  // Calculate hours after initialization
  calculateHours();
  
  // After a short delay, allow user edits to be reflected
  setTimeout(() => {
    userEditing.value = true;
  }, 100);
}

// Calculate hours spent based on time start and end
function calculateHours() {
  if (!formValues.value.time_start || !formValues.value.time_end) return;
  
  try {
    // Parse time strings
    const startParts = formValues.value.time_start.split(':').map(Number);
    const endParts = formValues.value.time_end.split(':').map(Number);
    
    const startHours = startParts[0] + (startParts[1] / 60);
    const endHours = endParts[0] + (endParts[1] / 60);
    
    // Calculate duration (handle overnight activities)
    let duration = endHours - startHours;
    if (duration < 0) {
      duration = 24 + duration; // Add 24 hours if end time is on next day
    }
    
    // Update formValues with calculated hours
    formValues.value.hours_spent = parseFloat(duration.toFixed(2));
    
    // Emit event for parent component
    emit('update:hours-spent', formValues.value.hours_spent);
  } catch (e) {
    console.error('Error calculating hours:', e);
  }
}

// Form submission
function handleSubmit() {
  // Basic validation
  if (!formValues.value.name || !formValues.value.date_from || !formValues.value.date_to) {
    alert('Harap isi semua kolom yang wajib.');
    return;
  }
  
  // Validate date range
  const startDate = new Date(formValues.value.date_from);
  const endDate = new Date(formValues.value.date_to);
  
  if (startDate > endDate) {
    alert('Tanggal mulai harus sebelum tanggal selesai.');
    return;
  }
  
  // Emit submit event with form values
  emit('submit', { ...formValues.value });
}

onMounted(() => {
  // Initialize form values
  if (props.show) {
    initializeForm();
  }
});
</script>