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
            <div class="p-4 flex-1 overflow-y-auto">
              <form @submit.prevent="handleSubmit">
                <!-- Activity Name -->
                <div class="mb-4">
                  <label for="batch-name" class="block text-sm font-medium text-gray-700">Nama Aktivitas <span class="text-red-500">*</span></label>
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
                  <label for="batch-type" class="block text-sm font-medium text-gray-700">Tipe Aktivitas <span class="text-red-500">*</span></label>
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
                <div v-if="hasAdminRights" class="mb-4">
                  <label for="batch-creator" class="block text-sm font-medium text-gray-700">Dibuat Untuk <span class="text-red-500">*</span></label>
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
                    <label for="batch-date-from" class="block text-sm font-medium text-gray-700">Tanggal Mulai <span class="text-red-500">*</span></label>
                    <input
                      id="batch-date-from"
                      v-model="localFormData.date_from"
                      type="date"
                      required
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label for="batch-date-to" class="block text-sm font-medium text-gray-700">Tanggal Selesai <span class="text-red-500">*</span></label>
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
                
                <!-- Time Range - Gunakan time input biasa untuk sementara -->
                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-4">
                  <div>
                    <label for="batch-time-start" class="block text-sm font-medium text-gray-700">Waktu Mulai <span class="text-red-500">*</span></label>
                    <input
                      id="batch-time-start"
                      v-model="localFormData.time_start"
                      type="time"
                      required
                      @change="updateHoursSpent"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label for="batch-time-end" class="block text-sm font-medium text-gray-700">Waktu Selesai <span class="text-red-500">*</span></label>
                    <input
                      id="batch-time-end"
                      v-model="localFormData.time_end"
                      type="time"
                      required
                      @change="updateHoursSpent"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                    />
                  </div>
                </div>
                
                <!-- Hours Spent - Readonly, dihitung otomatis -->
                <div class="mb-4">
                  <label for="batch-hours" class="block text-sm font-medium text-gray-700">Jam Kerja</label>
                  <input
                    id="batch-hours"
                    v-model.number="localFormData.hours_spent"
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="24"
                    readonly
                    class="mt-1 block w-full rounded-md bg-gray-50 border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                    placeholder="Jam kerja (otomatis dari waktu mulai/selesai)"
                  />
                  <p class="mt-1 text-xs text-gray-500">Dihitung otomatis dari waktu mulai dan selesai</p>
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
                  <span v-if="submitting" class="inline-block animate-spin mr-2">⟳</span>
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

// Local form data - clone untuk mencegah modifikasi langsung pada props
const localFormData = ref({...props.formData});

// Get auth store untuk permissions
const authStore = useAuthStore();

// Computed properties untuk permissions
const isAdmin = computed(() => {
  return authStore.user?.is_admin === true || localStorage.getItem('isAdmin') === 'true';
});

const isTeamLead = computed(() => {
  return localStorage.getItem('isTeamLead') === 'true' || authStore.user?.is_team_lead === true;
});

const hasAdminRights = computed(() => isAdmin.value || isTeamLead.value);

// Watch untuk perubahan form data dari parent
watch(() => props.formData, (newFormData) => {
  // Buat deep clone untuk menghindari referencing issue
  localFormData.value = JSON.parse(JSON.stringify(newFormData));
}, { deep: true });

// Watch untuk perubahan status modal
watch(() => props.show, (isVisible) => {
  if (isVisible) {
    // Reset form dengan nilai dari props saat modal dibuka
    localFormData.value = JSON.parse(JSON.stringify(props.formData));
    // Hitung jam langsung saat modal dibuka
    updateHoursSpent();
  }
});

// Hitung jam kerja otomatis
function updateHoursSpent() {
  if (localFormData.value.time_start && localFormData.value.time_end) {
    try {
      console.log(`Calculating hours between ${localFormData.value.time_start} and ${localFormData.value.time_end}`);
      
      // Parse string waktu
      const startParts = localFormData.value.time_start.split(':').map(Number);
      const endParts = localFormData.value.time_end.split(':').map(Number);
      
      const startHours = startParts[0] + (startParts[1] / 60);
      const endHours = endParts[0] + (endParts[1] / 60);
      
      // Hitung durasi (handle aktivitas semalaman)
      let duration = endHours - startHours;
      if (duration < 0) {
        duration = 24 + duration; // Tambah 24 jam jika waktu selesai di hari berikutnya
      }
      
      const calculatedHours = parseFloat(duration.toFixed(2));
      console.log(`Calculated hours: ${calculatedHours}`);
      
      // Update localFormData
      localFormData.value.hours_spent = calculatedHours;
      
      // Emit event untuk update parent
      emit('update:hours-spent', calculatedHours);
    } catch (e) {
      console.error('Error calculating hours:', e);
    }
  }
}

// Form submission
function handleSubmit() {
  // Validasi dasar
  if (!localFormData.value.name || !localFormData.value.date_from || !localFormData.value.date_to) {
    alert('Harap isi semua kolom yang wajib.');
    return;
  }
  
  // Validasi rentang tanggal
  const startDate = new Date(localFormData.value.date_from);
  const endDate = new Date(localFormData.value.date_to);
  
  if (startDate > endDate) {
    alert('Tanggal mulai harus sebelum tanggal selesai.');
    return;
  }
  
  // Validasi waktu
  if (!localFormData.value.time_start || !localFormData.value.time_end) {
    alert('Waktu mulai dan selesai harus diisi.');
    return;
  }
  
  // Pastikan hours_spent sudah diperbarui
  updateHoursSpent();
  
  // Emit submit event dengan data yang diperbarui
  emit('submit', {...localFormData.value});
}

// Perbarui hours_spent saat komponen dimount
onMounted(() => {
  // Tunggu beberapa saat agar refs selesai dimount
  setTimeout(() => {
    updateHoursSpent();
  }, 100);
});
</script>