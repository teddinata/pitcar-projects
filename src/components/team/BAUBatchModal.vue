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
            class="bg-white rounded-lg shadow-xl w-full max-w-md relative z-50 mx-auto"
            @click.stop
          >
            <!-- Modal Header -->
            <div class="flex justify-between items-center border-b p-4">
              <h3 class="text-lg font-medium text-gray-900">Rencanakan Aktivitas BAU Batch</h3>
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
                    placeholder="Contoh: Daily Stand-up, Weekly Report, dll."
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
                    <label class="block text-sm font-medium text-gray-700">Tanggal Mulai <span class="text-red-500">*</span></label>
                    <input 
                      type="date" 
                      v-model="localFormData.date_from"
                      required
                      :min="todayDate"
                      class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700">Tanggal Selesai <span class="text-red-500">*</span></label>
                    <input 
                      type="date" 
                      v-model="localFormData.date_to"
                      required
                      :min="localFormData.date_from"
                      class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Waktu Mulai <span class="text-red-500">*</span></label>
                    <CustomTimePicker 
                      v-model="localFormData.time_start"
                      :interval="15"
                      :start-hour="8"
                      :end-hour="18"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Waktu Selesai <span class="text-red-500">*</span></label>
                    <CustomTimePicker 
                      v-model="localFormData.time_end"
                      :interval="15"
                      :start-hour="8"
                      :end-hour="18"
                    />
                  </div>
                </div>

                <div class="mt-2">
                  <p class="text-xs text-gray-500">Durasi: {{ calculatedHours }} jam per aktivitas</p>
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
                    placeholder="Jelaskan apa yang dilakukan dalam aktivitas ini"
                  ></textarea>
                </div>

                <div class="flex items-center mt-4">
                  <input 
                    type="checkbox" 
                    id="excludeWeekends" 
                    v-model="localFormData.exclude_weekends"
                    class="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  />
                  <label for="excludeWeekends" class="ml-2 block text-sm text-gray-900">
                    Hanya hari kerja (tidak termasuk Sabtu & Minggu)
                  </label>
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
                    {{ submitting ? 'Menyimpan...' : 'Buat Aktivitas Batch' }}
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
import TeamSelect from '@/components/GeneralTeamSelect.vue';
import CustomTimePicker from '@/components/CustomTimePicker.vue';

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  formData: {
    type: Object,
    default: () => ({
      name: '',
      activity_type: 'meeting',
      date_from: '',
      date_to: '',
      time_start: '09:00',
      time_end: '10:00',
      hours_spent: 1.0,
      project_id: '',
      description: '',
      creator_id: '',
      exclude_weekends: true
    })
  },
  projects: {
    type: Array,
    default: () => []
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

const todayDate = computed(() => {
  const today = new Date();
  return formatDateYYYYMMDD(today);
});

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

// Methods
function formatDateYYYYMMDD(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function handleSubmit() {
  // Validate dates
  if (new Date(localFormData.value.date_from) > new Date(localFormData.value.date_to)) {
    alert('Tanggal mulai harus sebelum tanggal selesai');
    return;
  }
  
  // Validate time inputs
  if (!localFormData.value.time_start || !localFormData.value.time_end) {
    alert('Waktu mulai dan selesai harus diisi');
    return;
  }
  
  // Validate time span
  const startParts = localFormData.value.time_start.split(':');
  const endParts = localFormData.value.time_end.split(':');
  
  const startHours = parseInt(startParts[0]) + (parseInt(startParts[1]) / 60);
  const endHours = parseInt(endParts[0]) + (parseInt(endParts[1]) / 60);
  
  // If end time is before start time and the difference is more than 16 hours, it's probably a mistake
  if (endHours < startHours && (startHours - endHours) > 16) {
    alert('Rentang waktu terlalu lama. Pastikan waktu selesai setelah waktu mulai.');
    return;
  }
  
  // Update hours_spent with calculated value
  localFormData.value.hours_spent = calculatedHours.value;
  
  // Emit the submit event with the updated form data
  emit('submit', { ...localFormData.value });
}
</script>