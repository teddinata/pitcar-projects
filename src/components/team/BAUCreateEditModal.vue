<!-- src/components/team/BAUCreateEditModal.vue -->
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
            class="bg-white rounded-lg shadow-xl w-full max-w-md relative z-50 mx-auto"
            @click.stop
          >
            <!-- Modal Header -->
            <div class="flex justify-between items-center border-b p-4">
              <h3 class="text-lg font-medium text-gray-900">
                {{ isEditing ? 'Edit Aktivitas BAU' : 'Tambah Aktivitas BAU' }}
              </h3>
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
              <form @submit.prevent="handleSubmit" class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700">Nama Aktivitas <span class="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    v-model="localFormData.name"
                    required
                    class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Contoh: Rapat Tim, Dokumentasi, dll."
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">Jenis Aktivitas <span class="text-red-500">*</span></label>
                  <select 
                    v-model="localFormData.activity_type"
                    required
                    class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="meeting">Rapat</option>
                    <option value="training">Pelatihan</option>
                    <option value="support">Support</option>
                    <option value="admin">Administrasi</option>
                    <option value="other">Lainnya</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">Pelaksana <span class="text-red-500">*</span></label>
                  <TeamSelect
                    v-model="localFormData.creator_id"
                    :disabled="submitting"
                    :multiple="false"
                    class="w-full"
                  />
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Tanggal <span class="text-red-500">*</span></label>
                    <input 
                      type="date" 
                      v-model="localFormData.date"
                      required
                      class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                    <p v-if="!isEditing" class="mt-1 text-xs text-gray-500">Aktivitas hanya dapat dibuat untuk hari ini</p>
                  </div>
                </div>

                <!-- Time fields with custom time picker -->
                <div>
                  <label class="block text-sm font-medium text-gray-700">Waktu <span class="text-red-500">*</span></label>
                  <div class="flex items-center space-x-2">
                    <div class="w-1/2">
                      <CustomTimePicker 
                        v-model="localFormData.time_start"
                        :interval="15"
                        :start-hour="8"
                        :end-hour="18"
                      />
                    </div>
                    <span class="text-gray-500">-</span>
                    <div class="w-1/2">
                      <CustomTimePicker 
                        v-model="localFormData.time_end"
                        :interval="15"
                        :start-hour="8"
                        :end-hour="18"
                      />
                    </div>
                  </div>
                  <p class="mt-1 text-xs text-gray-500">Jam yang dicatat: {{ calculatedHours }}</p>
                </div>

                <!-- Project selection -->
                <div>
                  <label class="block text-sm font-medium text-gray-700">Proyek (Opsional)</label>
                  <select
                    v-model="localFormData.project_id"
                    class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="">Tidak terkait proyek</option>
                    <option v-for="project in projects" :key="project.id" :value="project.id">
                      {{ project.name }}
                    </option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">Deskripsi</label>
                  <textarea 
                    v-model="localFormData.description"
                    rows="3"
                    class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Jelaskan apa yang Anda lakukan dalam aktivitas ini"
                  ></textarea>
                </div>

                <div v-if="isEditing && canVerify" class="border-t pt-4">
                  <label class="block text-sm font-medium text-gray-700 mb-2">Status Aktivitas</label>
                  <div class="flex space-x-4">
                    <label class="inline-flex items-center">
                      <input type="radio" v-model="localFormData.state" value="planned" class="form-radio text-red-600 focus:ring-red-500" />
                      <span class="ml-2">Direncanakan</span>
                    </label>
                    <label class="inline-flex items-center">
                      <input type="radio" v-model="localFormData.state" value="done" class="form-radio text-green-600 focus:ring-green-500" />
                      <span class="ml-2">Selesai</span>
                    </label>
                    <label class="inline-flex items-center">
                      <input type="radio" v-model="localFormData.state" value="not_done" class="form-radio text-red-600 focus:ring-red-500" />
                      <span class="ml-2">Tidak Selesai</span>
                    </label>
                  </div>
                  <div v-if="showVerificationReason" class="mt-2">
                    <label class="block text-sm font-medium text-gray-700">Alasan Verifikasi <span class="text-red-500">*</span></label>
                    <textarea 
                      v-model="localFormData.verification_reason"
                      rows="2"
                      required
                      class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Alasan mengapa verifikasi dilakukan pada H+1"
                    ></textarea>
                  </div>
                </div>

                <div class="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    @click="$emit('close')"
                    class="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    class="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    :disabled="submitting"
                  >
                    <span v-if="submitting" class="inline-block animate-spin mr-2">⟳</span>
                    {{ submitting ? 'Menyimpan...' : (isEditing ? 'Perbarui' : 'Simpan') }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { XCircleIcon } from '@heroicons/vue/24/outline';
import TeamSelect from '@/components/MeetingTeamSelect.vue';
import CustomTimePicker from '@/components/CustomTimePicker.vue';

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  formData: {
    type: Object,
    default: () => ({
      id: null,
      name: '',
      activity_type: 'meeting',
      date: '',
      time_start: '08:00',
      time_end: '09:00',
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

const emit = defineEmits(['close', 'submit']);

// Create a local copy of the form data to avoid modifying the parent's state directly
const localFormData = ref({ ...props.formData });

// Watch for changes to the props and update the local copy
watch(() => props.formData, (newVal) => {
  localFormData.value = { ...newVal };
}, { deep: true });

// Watch for show prop changes to reset form data when opening
watch(() => props.show, (newShow) => {
  if (newShow) {
    localFormData.value = { ...props.formData };
  }
});

// const todayDate = computed(() => {
//   const today = new Date();
//   return formatDateYYYYMMDD(today);
// });

const calculatedHours = computed(() => {
  if (!localFormData.value.time_start || !localFormData.value.time_end) return 0;
  
  try {
    // Parse time strings
    const startParts = localFormData.value.time_start.split(':');
    const endParts = localFormData.value.time_end.split(':');
    
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
  if (!localFormData.value.date) return false;
  
  const activityDate = new Date(localFormData.value.date);
  activityDate.setHours(0, 0, 0, 0);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const diffDays = Math.floor((today - activityDate) / (1000 * 60 * 60 * 24));
  
  // Can verify if same day (H) or next day (H+1)
  return diffDays <= 1;
});

const showVerificationReason = computed(() => {
  if (!props.isEditing || localFormData.value.state === 'planned') return false;
  
  const activityDate = new Date(localFormData.value.date);
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
  // Set the calculated hours
  localFormData.value.hours_spent = calculatedHours.value;
  
  // Validate times
  if (!localFormData.value.time_start || !localFormData.value.time_end) {
    alert('Waktu mulai dan selesai harus diisi');
    return;
  }
  
  // Validate that end time is after start time or handle overnight
  const startParts = localFormData.value.time_start.split(':');
  const endParts = localFormData.value.time_end.split(':');
  
  const startHours = parseInt(startParts[0]) + (parseInt(startParts[1]) / 60);
  const endHours = parseInt(endParts[0]) + (parseInt(endParts[1]) / 60);
  
  // If end time is before start time and the difference is more than 16 hours, it's probably a mistake
  if (endHours < startHours && (startHours - endHours) > 16) {
    alert('Rentang waktu terlalu lama. Pastikan waktu selesai setelah waktu mulai.');
    return;
  }
  
  // Emit the submit event with the updated form data
  emit('submit', { ...localFormData.value });
}
</script>