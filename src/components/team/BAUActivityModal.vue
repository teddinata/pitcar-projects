<!-- src/components/team/BAUActivityModal.vue -->
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
      <div v-if="show" class="fixed inset-0 z-40 overflow-y-auto" @click.self="handleClickOutside">
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-black bg-opacity-30" @click.self="handleClickOutside"></div>
        
        <!-- Modal -->
        <div class="flex items-center justify-center min-h-screen p-4">
          <div 
            class="bg-white rounded-lg shadow-xl w-full max-w-md relative z-50 mx-auto"
            @click.stop
          >
            <!-- Modal Header -->
            <div class="flex justify-between items-center border-b border-gray-200 p-4">
              <h3 class="text-lg font-medium text-gray-900">
                {{ isEditing ? 'Edit Aktivitas BAU' : 'Tambah Aktivitas BAU' }}
              </h3>
              <button
                @click="$emit('close')"
                class="text-gray-400 hover:text-gray-500 focus:outline-none transition-colors duration-200"
              >
                <span class="sr-only">Close</span>
                <XMarkIcon class="h-6 w-6" />
              </button>
            </div>
            
            <!-- Modal Content -->
            <div class="p-4">
              <form @submit.prevent="handleSubmit" class="space-y-4">
                <!-- Activity Name -->
                <div>
                  <label for="name" class="block text-sm font-medium text-gray-700">Nama Aktivitas <span class="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    id="name" 
                    v-model="formData.name"
                    required
                    class="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200"
                    placeholder="Contoh: Rapat Tim, Dokumentasi, dll."
                  />
                </div>
                
                <!-- Date -->
                <div>
                  <label for="date" class="block text-sm font-medium text-gray-700">Tanggal <span class="text-red-500">*</span></label>
                  <input 
                    type="date" 
                    id="date" 
                    v-model="formData.date"
                    required
                    :min="isEditing ? '' : todayDate"
                    :max="isEditing ? '' : todayDate"
                    class="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200"
                  />
                  <p v-if="!isEditing" class="mt-1 text-xs text-gray-500">Aktivitas hanya dapat dibuat untuk hari ini</p>
                </div>
                
                <!-- Activity Type -->
                <div>
                  <label for="activity_type" class="block text-sm font-medium text-gray-700">Jenis Aktivitas <span class="text-red-500">*</span></label>
                  <select 
                    id="activity_type" 
                    v-model="formData.activity_type"
                    required
                    class="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200"
                  >
                    <option value="">Pilih jenis aktivitas</option>
                    <option value="meeting">Rapat</option>
                    <option value="training">Pelatihan</option>
                    <option value="support">Support</option>
                    <option value="admin">Administrasi</option>
                    <option value="other">Lainnya</option>
                  </select>
                </div>

                <!-- Creator -->
                <div>
                  <label for="creator_id" class="block text-sm font-medium text-gray-700">Pelaksana <span class="text-red-500">*</span></label>
                  <TeamSelect
                    v-model="formData.creator_id"
                    :disabled="submitting"
                    :multiple="false"
                    class="w-full"
                  />
                </div>
                
                <!-- Time fields -->
                <div>
                  <label class="block text-sm font-medium text-gray-700">Waktu <span class="text-red-500">*</span></label>
                  <div class="flex items-center space-x-2">
                    <div class="w-1/2">
                      <CustomTimePicker 
                        v-model="formData.time_start"
                        :interval="15"
                        :start-hour="8"
                        :end-hour="18"
                      />
                    </div>
                    <span class="text-gray-500">-</span>
                    <div class="w-1/2">
                      <CustomTimePicker 
                        v-model="formData.time_end"
                        :interval="15"
                        :start-hour="8"
                        :end-hour="18"
                      />
                    </div>
                  </div>
                  <p class="mt-1 text-xs text-gray-500">Jam yang dicatat: {{ calculatedHours }}</p>
                </div>
                
                <!-- Project Selection -->
                <div>
                  <label for="project_id" class="block text-sm font-medium text-gray-700">Proyek (Opsional)</label>
                  <select 
                    id="project_id" 
                    v-model="formData.project_id"
                    class="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200"
                  >
                    <option value="">Tidak terkait proyek</option>
                    <option v-for="project in projects" :key="project.id" :value="project.id">
                      {{ project.name }}
                    </option>
                  </select>
                </div>
                
                <!-- Description -->
                <div>
                  <label for="description" class="block text-sm font-medium text-gray-700">Deskripsi</label>
                  <textarea 
                    id="description" 
                    v-model="formData.description"
                    rows="3"
                    class="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200"
                    placeholder="Jelaskan apa yang Anda lakukan dalam aktivitas ini"
                  ></textarea>
                </div>
                
                <!-- Status (only for editing) -->
                <div v-if="isEditing && canVerify" class="border-t pt-4">
                  <label class="block text-sm font-medium text-gray-700 mb-2">Status Aktivitas</label>
                  <div class="flex space-x-4">
                    <label class="inline-flex items-center">
                      <input type="radio" v-model="formData.state" value="planned" class="form-radio text-red-600 focus:ring-red-500" />
                      <span class="ml-2">Direncanakan</span>
                    </label>
                    <label class="inline-flex items-center">
                      <input type="radio" v-model="formData.state" value="done" class="form-radio text-green-600 focus:ring-green-500" />
                      <span class="ml-2">Selesai</span>
                    </label>
                    <label class="inline-flex items-center">
                      <input type="radio" v-model="formData.state" value="not_done" class="form-radio text-red-600 focus:ring-red-500" />
                      <span class="ml-2">Tidak Selesai</span>
                    </label>
                  </div>
                  <div v-if="showVerificationReason" class="mt-2">
                    <label for="verification_reason" class="block text-sm font-medium text-gray-700">Alasan Verifikasi <span class="text-red-500">*</span></label>
                    <textarea 
                      id="verification_reason"
                      v-model="formData.verification_reason"
                      rows="2"
                      required
                      class="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200"
                      placeholder="Alasan mengapa verifikasi dilakukan pada H+1"
                    ></textarea>
                  </div>
                </div>
                
                <div class="mt-6 flex justify-between space-x-3">
                  <!-- Delete Button (only for editing) -->
                  <button
                    v-if="isEditing"
                    type="button"
                    @click="confirmDelete"
                    class="inline-flex justify-center rounded-md border border-red-300 px-4 py-2 text-sm font-medium text-red-700 shadow-sm hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200"
                  >
                    Hapus
                  </button>
                  <div v-else></div>
                  
                  <div class="flex space-x-3">
                    <button
                      type="button"
                      @click="$emit('close')"
                      class="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      class="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200"
                      :disabled="submitting"
                    >
                      <span v-if="submitting" class="inline-flex items-center">
                        <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {{ submitting ? 'Menyimpan...' : '' }}
                      </span>
                      {{ submitting ? '' : (isEditing ? 'Perbarui' : 'Simpan') }}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
  
  <!-- Delete Confirmation Modal -->
  <Teleport to="body">
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div v-if="showDeleteConfirmation" class="fixed inset-0 z-50 overflow-y-auto" @click.self="showDeleteConfirmation = false">
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-black bg-opacity-30" @click.self="showDeleteConfirmation = false"></div>
        
        <!-- Modal -->
        <div class="flex items-center justify-center min-h-screen p-4">
          <div class="bg-white rounded-lg shadow-xl w-full max-w-md relative z-50 mx-auto p-6">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <ExclamationTriangleIcon class="h-6 w-6 text-red-600" />
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-lg leading-6 font-medium text-gray-900">
                  Hapus Aktivitas
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    Apakah Anda yakin ingin menghapus aktivitas "{{ formData.name }}"? Tindakan ini tidak dapat dibatalkan.
                  </p>
                </div>
              </div>
            </div>
            <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
              <button 
                type="button" 
                class="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm transition-colors duration-200"
                @click="handleDelete"
                :disabled="submitting"
              >
                <span v-if="submitting" class="inline-flex items-center">
                  <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Menghapus...
                </span>
                <span v-else>Hapus</span>
              </button>
              <button 
                type="button" 
                class="mt-3 inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:mt-0 sm:w-auto sm:text-sm transition-colors duration-200"
                @click="showDeleteConfirmation = false"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { XMarkIcon, ExclamationTriangleIcon } from '@heroicons/vue/24/outline';
import TeamSelect from '@/components/GeneralTeamSelect.vue';
import CustomTimePicker from '@/components/CustomTimePicker.vue';

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  activityData: {
    type: Object,
    default: () => ({
      id: null,
      name: '',
      activity_type: 'meeting',
      date: '',
      time_start: '09:00',
      time_end: '10:00',
      hours_spent: 1,
      project_id: '',
      description: '',
      state: 'planned',
      creator_id: '',
      verification_reason: ''
    })
  },
  projects: {
    type: Array,
    default: () => []
  },
  isEditing: {
    type: Boolean,
    default: false
  },
  submitting: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close', 'submit', 'delete']);

// Local state
const formData = ref({ ...props.activityData });
const showDeleteConfirmation = ref(false);

// Watch for changes to props
watch(() => props.activityData, (newVal) => {
  formData.value = { ...newVal };
}, { deep: true });

watch(() => props.show, (newShow) => {
  if (newShow) {
    formData.value = { ...props.activityData };
  }
});

// Computed Properties
const todayDate = computed(() => {
  const today = new Date();
  return formatDateYYYYMMDD(today);
});

const calculatedHours = computed(() => {
  if (!formData.value.time_start || !formData.value.time_end) return 0;
  
  try {
    // Parse time strings
    const startParts = formData.value.time_start.split(':');
    const endParts = formData.value.time_end.split(':');
    
    const startHours = parseInt(startParts[0]) + (parseInt(startParts[1]) / 60);
    const endHours = parseInt(endParts[0]) + (parseInt(endParts[1]) / 60);
    
    // Calculate duration (handle overnight activities)
    let duration = endHours - startHours;
    if (duration < 0) {
      duration = 24 + duration; // Add 24 hours if end time is on next day
    }
    
    return parseFloat(duration.toFixed(2));
  } catch (e) {
    console.error('Error calculating hours:', e);
    return 0;
  }
});

const canVerify = computed(() => {
  if (!formData.value.date) return false;
  
  const activityDate = new Date(formData.value.date);
  activityDate.setHours(0, 0, 0, 0);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const diffDays = Math.floor((today - activityDate) / (1000 * 60 * 60 * 24));
  
  // Can verify if same day (H) or next day (H+1)
  return diffDays <= 1;
});

const showVerificationReason = computed(() => {
  if (!props.isEditing || formData.value.state === 'planned') return false;
  
  const activityDate = new Date(formData.value.date);
  activityDate.setHours(0, 0, 0, 0);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const diffDays = Math.floor((today - activityDate) / (1000 * 60 * 60 * 24));
  
  return diffDays === 1; // Show reason if verification is H+1
});

// Methods
function formatDateYYYYMMDD(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function handleSubmit() {
  // Set calculated hours
  formData.value.hours_spent = calculatedHours.value;
  
  // Validate times
  if (!formData.value.time_start || !formData.value.time_end) {
    alert('Waktu mulai dan selesai harus diisi');
    return;
  }
  
  // Validate time span
  const startParts = formData.value.time_start.split(':');
  const endParts = formData.value.time_end.split(':');
  
  const startHours = parseInt(startParts[0]) + (parseInt(startParts[1]) / 60);
  const endHours = parseInt(endParts[0]) + (parseInt(endParts[1]) / 60);
  
  // If end time is before start time and the difference is more than 16 hours, it's probably a mistake
  if (endHours < startHours && (startHours - endHours) > 16) {
    alert('Rentang waktu terlalu lama. Pastikan waktu selesai setelah waktu mulai.');
    return;
  }
  
  // Emit submit event
  emit('submit', { ...formData.value });
}

function confirmDelete() {
  showDeleteConfirmation.value = true;
}

function handleDelete() {
  emit('delete', formData.value.id);
  showDeleteConfirmation.value = false;
}

function handleClickOutside() {
  emit('close');
}
</script>

<style scoped>
/* Styling for radio buttons */
.form-radio {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  display: inline-block;
  vertical-align: middle;
  background-origin: border-box;
  user-select: none;
  flex-shrink: 0;
  height: 1rem;
  width: 1rem;
  color: currentColor;
  background-color: #fff;
  border-color: #d1d5db;
  border-width: 1px;
  border-radius: 100%;
}

.form-radio:checked {
  background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3ccircle cx='8' cy='8' r='4'/%3e%3c/svg%3e");
  background-color: currentColor;
  background-size: 100% 100%;
  background-position: center;
  background-repeat: no-repeat;
  border-color: transparent;
}

.form-radio:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.5);
  border-color: transparent;
}

/* Animation for loading spinner */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
.animate-spin {
  animation: spin 1s linear infinite;
}
</style>