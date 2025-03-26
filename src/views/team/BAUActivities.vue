<template>
  <div class="min-h-screen bg-gray-50">
    <Toast
      v-model:show="toast.show"
      :message="toast.message"
      :type="toast.type"
      :duration="toast.duration"
    />
    
    <!-- Header -->
    <div class="bg-white shadow">
      <div class="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="md:flex md:items-center md:justify-between">
          <div class="flex-1 min-w-0">
            <h1 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate">
              Aktivitas BAU Tim
            </h1>
          </div>
          <div class="flex space-x-3">
            <!-- Filter buttons -->
            <button
              v-for="filter in statusFilters"
              :key="filter.value"
              @click="toggleFilterStatus(filter.value)"
              :class="[
                'px-3 py-2 rounded-md text-sm font-medium',
                isStatusFilterActive(filter.value)
                  ? 'bg-red-500 text-white'
                  : 'bg-white text-gray-700 border border-gray-300'
              ]"
            >
              {{ filter.label }}
            </button>
            
            <!-- Add new activity button -->
            <button
              @click="openNewActivityModal"
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <PlusIcon class="h-5 w-5 mr-2" />
              Tambah Aktivitas
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content - Filter & Activity List -->
    <main class="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Filters -->
      <div class="bg-white rounded-lg shadow mb-6">
        <div class="p-5">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <!-- Date range filter -->
            <div>
              <label for="date-from" class="block text-sm font-medium text-gray-700 mb-1">
                Dari Tanggal
              </label>
              <input 
                type="date" 
                id="date-from" 
                v-model="filters.date_from"
                class="px-3 py-2 shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label for="date-to" class="block text-sm font-medium text-gray-700 mb-1">
                Sampai Tanggal
              </label>
              <input 
                type="date" 
                id="date-to" 
                v-model="filters.date_to"
                class="px-3 py-2 shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            
            <!-- Activity type filter -->
            <div>
              <label for="activity-type" class="block text-sm font-medium text-gray-700 mb-1">
                Jenis Aktivitas
              </label>
              <select 
                id="activity-type" 
                v-model="filters.activity_type"
                class="px-3 py-2 shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-300 rounded-md"
              >
                <option value="">Semua Jenis</option>
                <option value="meeting">Rapat</option>
                <option value="training">Pelatihan</option>
                <option value="support">Support</option>
                <option value="admin">Administrasi</option>
                <option value="other">Lainnya</option>
              </select>
            </div>
            
            <!-- Project filter -->
            <div>
              <label for="project" class="block text-sm font-medium text-gray-700 mb-1">
                Proyek
              </label>
              <select 
                id="project" 
                v-model="filters.project_id"
                class="px-3 py-2 shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-300 rounded-md"
              >
                <option value="">Semua Proyek</option>
                <option v-for="project in projects" :key="project.id" :value="project.id">
                  {{ project.name }}
                </option>
              </select>
            </div>
          </div>
          
          <!-- Apply & Reset Filters -->
          <div class="mt-4 flex justify-end space-x-3">
            <button 
              @click="resetFilters"
              class="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Reset
            </button>
            <button 
              @click="applyFilters"
              class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gradient-to-r from-purple-600 to-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Terapkan Filter
            </button>
          </div>
        </div>
      </div>
      
      <!-- Activity List -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <div class="p-5 border-b border-gray-200">
          <h3 class="text-lg leading-6 font-medium text-gray-900">
            Daftar Aktivitas BAU
          </h3>
        </div>
        
        <!-- Loading state -->
        <div v-if="loading" class="p-8 flex justify-center">
          <div class="animate-spin rounded-full h-10 w-10 border-2 border-red-500 border-t-transparent"></div>
        </div>
        
        <!-- Empty state -->
        <div v-else-if="activities.length === 0" class="p-8 text-center">
          <MagnifyingGlassIcon class="h-12 w-12 text-gray-300 mx-auto" />
          <h3 class="mt-2 text-sm font-medium text-gray-900">Tidak ada aktivitas</h3>
          <p class="mt-1 text-sm text-gray-500">
            Belum ada aktivitas BAU yang sesuai dengan filter Anda.
          </p>
          <div class="mt-6">
            <button
              @click="openNewActivityModal"
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <PlusIcon class="h-5 w-5 mr-2" />
              Tambah Aktivitas
            </button>
          </div>
        </div>
        
        <!-- Activity table -->
        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama Aktivitas
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jenis
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jam
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pembuat
                </th>
                <th scope="col" class="relative px-6 py-3">
                  <span class="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="activity in activities" :key="activity.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ activity.name }}</div>
                  <div class="text-sm text-gray-500">{{ truncate(activity.description, 50) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ formatDate(activity.date) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="[
                    'px-2 inline-flex text-xs leading-5 font-semibold rounded-full', 
                    getActivityTypeColorClass(activity.activity_type)
                  ]">
                    {{ getTranslatedActivityType(activity.activity_type) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="[
                    'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                    getActivityStatusClass(activity.state)
                  ]">
                    {{ activity.state === 'done' ? 'Selesai' : 
                       activity.state === 'not_done' ? 'Tidak Selesai' : 'Direncanakan' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ activity.hours_spent }} jam
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ activity.creator.name }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    @click="openEditActivityModal(activity)"
                    class="text-red-600 hover:text-red-900"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>

    <!-- Calendar component -->
    <!-- <BAUCalendarWeekView 
      :week-data="weekData"
      :loading="loading"
      @activity-click="handleActivityClick"
      @time-slot-click="handleTimeSlotClick"
      @refresh="fetchActivities"
    /> -->
    
    <!-- Activity Modal -->
    <BAUActivityModal
      :show="showActivityModal"
      :activity-data="activityData"
      :projects="projects"
      :is-editing="isEditing"
      :submitting="submitting"
      @close="showActivityModal = false"
      @submit="handleSubmit"
      @delete="handleDelete"
    />
</div>

</template>
  
<script setup>
import { ref, reactive, onMounted, watch, computed} from 'vue'
import { useToast } from '@/composables/useToast'
import apiClient from '@/config/api'
import { 
  PlusIcon, 
  ExclamationTriangleIcon,
  MagnifyingGlassIcon  
} from '@heroicons/vue/24/outline'
import DialogModal from '@/components/modal/DialogModal.vue'
import BAUActivityModal from '@/components/team/BAUActivityModal.vue';
import BAUCalendarWeekView from '@/components/team/BAUCalendarWeekView.vue';

// State
const { toast, showToast } = useToast()
const loading = ref(false)
const formSubmitting = ref(false)
const submitting = ref(false);
const showActivityModal = ref(false);
const isEditing = ref(false);
const activityData = ref({
  id: null,
  name: '',
  activity_type: 'meeting',
  date: new Date().toISOString().split('T')[0],
  time_start: '09:00',
  time_end: '10:00',
  hours_spent: 1,
  project_id: '',
  description: '',
  state: 'planned',
  creator_id: '',
  verification_reason: ''
});
const weekData = ref([]);

// BAU activities
const activities = ref([])
const projects = ref([])

// Modals
const showNewActivityModal = ref(false)
const showEditActivityModal = ref(false)
const showDeleteConfirmation = ref(false)
const selectedActivity = ref(null)

// Filters
const statusFilters = [
  { label: 'Semua', value: 'all' },
  { label: 'Direncanakan', value: 'planned' },
  { label: 'Selesai', value: 'done' },
  { label: 'Tidak Selesai', value: 'not_done' }
]

const activeStatusFilters = ref(['all'])
const filters = reactive({
  date_from: '',
  date_to: '',
  activity_type: '',
  project_id: '',
  creator_id: ''
})

// New activity form
const newActivity = reactive({
  name: '',
  date: new Date().toISOString().slice(0, 10), // Today's date
  activity_type: '',
  hours_spent: 1,
  project_id: '',
  description: '',
  state: 'planned'
})

const todayDate = computed(() => {
  const today = new Date();
  return formatDateYYYYMMDD(today);
});

// Methods
function formatDateYYYYMMDD(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const handleActivityClick = (activity) => {
  activityData.value = { ...activity };
  isEditing.value = true;
  showActivityModal.value = true;
};

const handleTimeSlotClick = (timeSlotInfo) => {
  // Only allow adding activities for today
  if (timeSlotInfo.isToday) {
    activityData.value = {
      id: null,
      name: '',
      activity_type: 'meeting',
      date: timeSlotInfo.date,
      time_start: timeSlotInfo.time_start,
      time_end: timeSlotInfo.time_end,
      hours_spent: 1,
      project_id: '',
      description: '',
      state: 'planned',
      creator_id: '',
      verification_reason: ''
    };
    isEditing.value = false;
    showActivityModal.value = true;
  } else {
    alert('Aktivitas baru hanya dapat dibuat untuk hari ini');
  }
};

const handleSubmit = async (formData) => {
  try {
    submitting.value = true;
    
    // Determine operation (create or update)
    const operation = isEditing.value ? 'update' : 'create';
    
    // Prepare params
    const params = {
      operation,
      name: formData.name,
      activity_type: formData.activity_type,
      date: formData.date,
      time_start: formData.time_start,
      time_end: formData.time_end,
      hours_spent: formData.hours_spent,
      description: formData.description,
      creator_id: formData.creator_id,
    };
    
    // Include project_id if selected
    if (formData.project_id) {
      params.project_id = Number(formData.project_id);
    }
    
    // Add bau_id for updates
    if (isEditing.value && formData.id) {
      params.bau_id = formData.id;
      
      // Add state and verification reason for edited activities 
      if (formData.state !== 'planned') {
        params.state = formData.state;
        
        if (formData.verification_reason) {
          params.verification_reason = formData.verification_reason;
        }
      }
    }
    
    // Call the API
    const response = await apiClient.post('/web/v2/team/bau', {
      jsonrpc: '2.0',
      id: new Date().getTime(),
      params
    });

    if (response.data.result?.status === 'success') {
      showToast({
        message: isEditing.value ? 'Aktivitas berhasil diperbarui' : 'Aktivitas berhasil dibuat',
        type: 'success'
      });
      showActivityModal.value = false;
      fetchActivities(); // Refresh data
    } else {
      throw new Error(response.data.result?.message || 'Gagal menyimpan aktivitas');
    }
  } catch (error) {
    console.error('Error saving activity:', error);
    showToast({
      message: error.message || 'Gagal menyimpan aktivitas',
      type: 'error'
    });
  } finally {
    submitting.value = false;
  }
};

const handleDelete = async (activityId) => {
  try {
    submitting.value = true;
    
    const response = await apiClient.post('/web/v2/team/bau', {
      jsonrpc: '2.0',
      id: new Date().getTime(),
      params: {
        operation: 'delete',
        bau_id: activityId
      }
    });

    if (response.data.result?.status === 'success') {
      showToast({
        message: 'Aktivitas berhasil dihapus',
        type: 'success'
      });
      showActivityModal.value = false;
      fetchActivities(); // Refresh data
    } else {
      throw new Error(response.data.result?.message || 'Gagal menghapus aktivitas');
    }
  } catch (error) {
    console.error('Error deleting activity:', error);
    showToast({
      message: error.message || 'Gagal menghapus aktivitas',
      type: 'error'
    });
  } finally {
    submitting.value = false;
  }
};



// Methods
const fetchActivities = async () => {
  try {
    loading.value = true;
    
    // Prepare filter params
    const params = {
      operation: 'get',
    };
    
    // Add date filters if exists
    if (filters.date_from) {
      params.date_from = filters.date_from;
    }
    if (filters.date_to) {
      params.date_to = filters.date_to;
    }
    
    // Add other filters
    if (filters.activity_type) {
      params.activity_type = filters.activity_type;
    }
    if (filters.project_id) {
      params.project_id = Number(filters.project_id);
    }
    
    // Add status filters
    if (!activeStatusFilters.value.includes('all')) {
      params.states = activeStatusFilters.value;
    }
    
    // Call API
    const response = await apiClient.post('/web/v2/team/bau', {
      jsonrpc: '2.0',
      id: new Date().getTime(),
      params
    });

    if (response.data.result?.status === 'success') {
      activities.value = response.data.result.data || [];
    } else {
      console.error('Error fetching activities:', response.data.result?.message);
    }
    
    // Fetch calendar data too if needed
    await fetchCalendarData();
    
  } catch (error) {
    console.error('Error fetching activities:', error);
  } finally {
    loading.value = false;
  }
};

// Separate function for calendar if needed
const fetchCalendarData = async () => {
  try {
    // Prepare date range for the current week
    const today = new Date();
    const firstDayOfWeek = new Date(today);
    const day = today.getDay();
    firstDayOfWeek.setDate(today.getDate() - day);
    
    const lastDayOfWeek = new Date(firstDayOfWeek);
    lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);
    
    // Format dates (YYYY-MM-DD)
    const dateFromStr = formatDateYYYYMMDD(firstDayOfWeek);
    const dateToStr = formatDateYYYYMMDD(lastDayOfWeek);
    
    // Call BAU calendar API
    const response = await apiClient.post('/web/v2/team/bau/calendar', {
      jsonrpc: '2.0',
      id: new Date().getTime(),
      params: {
        operation: 'get',
        date_from: dateFromStr,
        date_to: dateToStr,
        team_view: true // View all team activities
      }
    });

    if (response.data.result?.status === 'success') {
      weekData.value = response.data.result.data;
    } else {
      console.error('Error fetching calendar:', response.data.result?.message);
    }
  } catch (error) {
    console.error('Error fetching calendar:', error);
  }
};

const fetchProjects = async () => {
  try {
    const response = await apiClient.post('/web/v2/team/projects/list', {
      jsonrpc: '2.0',
      id: new Date().getTime(),
      params: {
        limit: 100 // Get all projects for dropdown
      }
    });

    if (response.data.result?.status === 'success') {
      projects.value = response.data.result.data || [];
    }
  } catch (error) {
    console.error('Error fetching projects:', error);
  }
};


const resetNewActivityForm = () => {
  newActivity.name = ''
  newActivity.date = new Date().toISOString().slice(0, 10)
  newActivity.activity_type = ''
  newActivity.hours_spent = 1
  newActivity.project_id = ''
  newActivity.description = ''
  newActivity.state = 'planned'
}

const openNewActivityModal = () => {
  // Reset data aktivitas
  activityData.value = {
    id: null,
    name: '',
    activity_type: 'meeting',
    date: new Date().toISOString().split('T')[0],
    time_start: '09:00',
    time_end: '10:00',
    hours_spent: 1,
    project_id: '',
    description: '',
    state: 'planned',
    creator_id: '',
    verification_reason: ''
  };
  isEditing.value = false;
  showActivityModal.value = true;
}


const openEditActivityModal = (activity) => {
  // Salin activity ke activityData
  activityData.value = { ...activity };
  isEditing.value = true;
  showActivityModal.value = true;
}


const submitNewActivity = async () => {
  try {
    formSubmitting.value = true
    
    const params = {
      operation: 'create',
      name: newActivity.name.trim(),
      date: newActivity.date,
      activity_type: newActivity.activity_type,
      hours_spent: parseFloat(newActivity.hours_spent),
      description: newActivity.description.trim(),
      state: newActivity.state
    }
    
    if (newActivity.project_id) {
      params.project_id = Number(newActivity.project_id)
    }
    
    const response = await apiClient.post('/web/v2/team/bau', {
      jsonrpc: '2.0',
      id: new Date().getTime(),
      params
    })
    
    if (response.data.result?.status === 'success') {
      showToast({
        message: 'Aktivitas BAU berhasil ditambahkan',
        type: 'success'
      })
      showNewActivityModal.value = false
      resetNewActivityForm()
      await fetchActivities()
    } else {
      throw new Error(response.data.result?.message || 'Gagal menambahkan aktivitas BAU')
    }
  } catch (error) {
    console.error('Error adding BAU activity:', error)
    showToast({
      message: error.message || 'Gagal menambahkan aktivitas BAU',
      type: 'error'
    })
  } finally {
    formSubmitting.value = false
  }
}

const submitEditActivity = async () => {
  try {
    if (!selectedActivity.value?.id) return
    
    formSubmitting.value = true
    
    const params = {
      operation: 'update',
      bau_id: selectedActivity.value.id,
      name: selectedActivity.value.name.trim(),
      date: selectedActivity.value.date,
      activity_type: selectedActivity.value.activity_type,
      hours_spent: parseFloat(selectedActivity.value.hours_spent),
      description: selectedActivity.value.description.trim(),
      state: selectedActivity.value.state
    }
    
    if (selectedActivity.value.project_id) {
      params.project_id = Number(selectedActivity.value.project_id)
    }
    
    const response = await apiClient.post('/web/v2/team/bau', {
      jsonrpc: '2.0',
      id: new Date().getTime(),
      params
    })
    
    if (response.data.result?.status === 'success') {
      showToast({
        message: 'Aktivitas BAU berhasil diperbarui',
        type: 'success'
      })
      showEditActivityModal.value = false
      selectedActivity.value = null
      await fetchActivities()
    } else {
      throw new Error(response.data.result?.message || 'Gagal memperbarui aktivitas BAU')
    }
  } catch (error) {
    console.error('Error updating BAU activity:', error)
    showToast({
      message: error.message || 'Gagal memperbarui aktivitas BAU',
      type: 'error'
    })
  } finally {
    formSubmitting.value = false
  }
}

const confirmDeleteActivity = () => {
  showEditActivityModal.value = false
  showDeleteConfirmation.value = true
}

const deleteActivity = async () => {
  try {
    if (!selectedActivity.value?.id) return
    
    formSubmitting.value = true
    
    const response = await apiClient.post('/web/v2/team/bau', {
      jsonrpc: '2.0',
      id: new Date().getTime(),
      params: {
        operation: 'delete',
        bau_id: selectedActivity.value.id
      }
    })
    
    if (response.data.result?.status === 'success') {
      showToast({
        message: 'Aktivitas BAU berhasil dihapus',
        type: 'success'
      })
      showDeleteConfirmation.value = false
      selectedActivity.value = null
      await fetchActivities()
    } else {
      throw new Error(response.data.result?.message || 'Gagal menghapus aktivitas BAU')
    }
  } catch (error) {
    console.error('Error deleting BAU activity:', error)
    showToast({
      message: error.message || 'Gagal menghapus aktivitas BAU',
      type: 'error'
    })
  } finally {
    formSubmitting.value = false
  }
}

const toggleFilterStatus = (status) => {
  if (status === 'all') {
    activeStatusFilters.value = ['all']
  } else {
    // Remove 'all' if it exists
    activeStatusFilters.value = activeStatusFilters.value.filter(s => s !== 'all')
    
    // Toggle the selected status
    if (activeStatusFilters.value.includes(status)) {
      activeStatusFilters.value = activeStatusFilters.value.filter(s => s !== status)
      
      // If no statuses are selected, add 'all' back
      if (activeStatusFilters.value.length === 0) {
        activeStatusFilters.value = ['all']
      }
    } else {
      activeStatusFilters.value.push(status)
    }
  }
  
  fetchActivities()
}

const isStatusFilterActive = (status) => {
  return activeStatusFilters.value.includes(status)
}

const resetFilters = () => {
  filters.date_from = ''
  filters.date_to = ''
  filters.activity_type = ''
  filters.project_id = ''
  filters.creator_id = ''
  activeStatusFilters.value = ['all']
  
  fetchActivities()
}

const applyFilters = () => {
  fetchActivities()
}

// Helper functions
const formatDate = (dateString) => {
  if (!dateString) return '-'
  
  const date = new Date(dateString)
  
  // Indonesian month names
  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ]
  
  return `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`
}

const truncate = (text, length) => {
  if (!text) return ''
  if (text.length <= length) return text
  return text.substring(0, length) + '...'
}

const getActivityTypeColorClass = (type) => {
  if (!type) return 'bg-gray-100 text-gray-800'
  
  const colorMap = {
    'meeting': 'bg-blue-100 text-blue-800',
    'training': 'bg-green-100 text-green-800',
    'support': 'bg-pink-100 text-pink-800',
    'admin': 'bg-indigo-100 text-indigo-800',
    'other': 'bg-gray-100 text-gray-800'
  }
  
  return colorMap[type.toLowerCase()] || 'bg-gray-100 text-gray-800'
}

const getActivityStatusClass = (state) => {
  switch(state) {
    case 'done':
      return 'bg-green-100 text-green-800'
    case 'not_done':
      return 'bg-red-100 text-red-800'
    default: // planned
      return 'bg-yellow-100 text-yellow-800'
  }
}

const getTranslatedActivityType = (type) => {
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

// Load data on component mount
onMounted(() => {
  fetchActivities()
  fetchProjects()
})

// Watch filter changes
watch(activeStatusFilters, () => {
  fetchActivities()
})
</script>