<!-- src/components/team/TeamProjectFormModal.vue -->
<template>
  <div v-if="show" class="fixed inset-0 overflow-y-auto z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity backdrop-blur-sm" aria-hidden="true" @click="$emit('close')"></div>

      <!-- Modal panel -->
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
      
      <div class="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full">
        <!-- Header with Gradient -->
        <div class="relative bg-gradient-to-r from-rose-600 to-rose-500 px-6 py-4">
          <div class="flex items-center justify-between">
            <h3 class="text-xl font-medium text-white">{{ isEditing ? 'Edit Project' : 'Create New Project' }}</h3>
            <button @click="$emit('close')" class="text-white hover:text-gray-200 focus:outline-none">
              <span class="sr-only">Close</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
        
        <!-- Project Title Section -->
        <div class="px-6 pt-5 pb-4 border-b border-gray-100">
          <h2 class="text-xl font-semibold text-gray-900">Project Details</h2>
          
          <!-- Form Error Messages -->
          <div 
            v-if="error" 
            class="mt-3 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-600"
          >
            {{ error }}
          </div>
        </div>

        <!-- Project Details Content -->
        <div class="px-6 py-4 max-h-[80vh] overflow-y-auto custom-scrollbar">
          <div class="space-y-5">
            <!-- Basic Information -->
            <div class="bg-gray-50 rounded-lg p-5 border border-gray-100">
              <h4 class="text-sm font-medium text-gray-700 mb-3 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-1.5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Basic Information
              </h4>
              
              <div class="space-y-4">
                <div>
                  <label for="project-name" class="block text-sm font-medium text-gray-700">
                    Project Name <span class="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="project-name"
                    v-model="formData.name"
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Enter project name"
                    required
                  />
                </div>

                <!-- <div>
                  <label for="department" class="block text-sm font-medium text-gray-700">
                    Department <span class="text-red-500">*</span>
                  </label>
                  <SearchableSelect
                    id="team-project"
                    v-model="formData.department_id"
                    :options="departments"
                    placeholder="Search and select a department"
                    search-placeholder="Type to search departments..."
                    :required="true"
                  />
                  <p v-if="formData.department_id && formData.team_ids.length > 0" class="mt-1 text-xs text-gray-500">
                    Changing department will reset team member selections
                  </p>
                </div> -->

                <div>
                  <label for="department_ids" class="block text-sm font-medium text-gray-700">
                    Departments <span class="text-red-500">*</span>
                  </label>
                  <SearchableMultiSelect
                    id="department_ids"
                    v-model="formData.department_ids"
                    :options="departments"
                    placeholder="Search and select departments"
                    search-placeholder="Type to search departments..."
                    :required="true"
                  />
                  <p v-if="formData.department_ids.length > 0 && formData.team_ids.length > 0" class="mt-1 text-xs text-gray-500">
                    Changing departments will reset team member selections
                  </p>
                </div>
                

                <div>
                  <label for="project-type" class="block text-sm font-medium text-gray-700">
                    Project Type <span class="text-red-500">*</span>
                  </label>
                  <select
                    id="project-type"
                    v-model="formData.project_type"
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                  >
                    <option value="creation">Creation/Pembuatan</option>
                    <option value="development">Development/Pengembangan</option>
                    <option value="training">Training/Pelatihan</option>
                    <option value="documentation">Documentation/Dokumentasi</option>
                    <option value="general">General/Umum</option>
                    <option value="weekly">Weekly/Mingguan</option>
                    <option value="monthly">Monthly/Bulanan</option>
                  </select>
                </div>
              </div>
            </div>
            
            <!-- Timeline -->
            <div class="bg-gray-50 rounded-lg p-5 border border-gray-100">
              <h4 class="text-sm font-medium text-gray-700 mb-3 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-1.5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Timeline
              </h4>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <div class="text-xs text-gray-500 mb-1">Start Date <span class="text-red-500">*</span></div>
                  <input
                    type="date"
                    id="start-date"
                    v-model="formData.date_start"
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <div class="text-xs text-gray-500 mb-1">End Date <span class="text-red-500">*</span></div>
                  <input
                    type="date"
                    id="end-date"
                    v-model="formData.date_end"
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                  />
                </div>
              </div>
            </div>

            <!-- Team Members -->
            <div class="bg-gray-50 rounded-lg p-5 border border-gray-100">
              <h4 class="text-sm font-medium text-gray-700 mb-3 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-1.5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Team Assignment
              </h4>
              
              <div class="space-y-4">
                <div>
                  <label for="manager" class="block text-sm font-medium text-gray-700">
                    Project Manager <span class="text-red-500">*</span>
                  </label>
                  <TeamSelect
                    id="manager"
                    v-model="formData.project_manager_id"
                    :department-ids="formData.department_ids"
                    :multiple="false"
                    :disabled="formData.department_ids.length === 0"
                    placeholder="Select Manager"
                    class="mt-1 block w-full"
                    required
                  />
                  <p v-if="formData.department_ids.length === 0" class="mt-1 text-xs text-orange-500">
                    Please select at least one department first
                  </p>
                </div>
            
                <div>
                  <label class="block text-sm font-medium text-gray-700">
                    Team Members
                  </label>
                  <TeamSelect
                    v-model="formData.team_ids"
                    :department-ids="formData.department_ids"
                    :multiple="true"
                    :disabled="formData.department_ids.length === 0"
                    placeholder="Select Team Members"
                    class="mt-1 block w-full"
                  />
                  <p v-if="formData.department_ids.length === 0" class="mt-1 text-xs text-orange-500">
                    Please select at least one department first
                  </p>
                </div>
              </div>
            </div>

            <!-- Status & Priority -->
            <div class="bg-gray-50 rounded-lg p-5 border border-gray-100">
              <h4 class="text-sm font-medium text-gray-700 mb-3 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-1.5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Status & Priority
              </h4>
              
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label for="status" class="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    id="status"
                    v-model="formData.state"
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="draft">Draft</option>
                    <option value="planning">Planning</option>
                    <option value="in_progress">In Progress</option>
                    <option value="on_hold">On Hold</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label for="priority" class="block text-sm font-medium text-gray-700">Priority</label>
                  <select
                    id="priority"
                    v-model="formData.priority"
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="0">Low</option>
                    <option value="1">Medium</option>
                    <option value="2">High</option>
                    <option value="3">Critical</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Description -->
            <div class="bg-gray-50 rounded-lg p-5 border border-gray-100">
              <h4 class="text-sm font-medium text-gray-700 mb-3 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-1.5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
                </svg>
                Description
              </h4>
              <textarea
                id="description"
                v-model="formData.description"
                rows="3"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter project description"
              ></textarea>
            </div>
          </div>
        </div>
        
        <!-- Footer Actions -->
        <div class="bg-gray-50 px-6 py-4 flex flex-wrap justify-end gap-3 border-t border-gray-100">
          <button
            @click="$emit('close')"
            class="px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Close
          </button>
          <button
            type="button"
            @click="submitForm"
            class="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-rose-600 to-rose-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            :disabled="loading"
          >
            <span v-if="loading" class="mr-2">
              <svg class="animate-spin h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-1.5 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            {{ isEditing ? 'Update Project' : 'Create Project' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import apiClient from '@/config/api'
import TeamSelect from '@/components/GeneralTeamSelect.vue' // Using the correct import path
import SearchableSelect from '@/components/SearchableSelect.vue' // Using the correct import path
import SearchableMultiSelect from '@/components/SearchableMultiSelect.vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  project: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'submit'])

const departments = ref([])
const loading = ref(false)
const error = ref(null)

// Form data with default values
const formData = ref({
  name: '',
  department_ids: [], // Ubah department_id menjadi department_ids (array)
  date_start: '',
  date_end: '',
  project_manager_id: '',
  team_ids: [],
  description: '',
  state: 'draft',
  priority: '1',
  project_type: 'general'
})

const isEditing = computed(() => {
  return props.project !== null
})

// Watch for project prop changes to update the form
watch(() => props.project, (newProject) => {
  if (newProject) {
    initForm()
  }
}, { deep: true })

// Watch for department changes to reset team selections
watch(() => formData.value.department_id, (newDeptId) => {
  if (newDeptId) {
    // If the department changes, reset the manager and team selections
    // but only if it's not the initial form load
    if (formData.value.project_manager_id || formData.value.team_ids.length > 0) {
      formData.value.project_manager_id = ''
      formData.value.team_ids = []
    }
  }
})

// Load department data exclusively from the employees/masters endpoint
const fetchDepartments = async () => {
  try {
    loading.value = true
    error.value = null
    
    const response = await apiClient.post('/web/employees/masters', {
      jsonrpc: '2.0',
      id: new Date().getTime()
    })

    // Check if response has the expected structure
    if (response.data && 
        response.data.result && 
        response.data.result.status === 'success' && 
        response.data.result.data && 
        response.data.result.data.departments) {
      // Correctly access departments from the nested structure
      departments.value = response.data.result.data.departments
    } else {
      console.error('Unexpected response structure:', response.data)
      throw new Error('Invalid response structure from departments API')
    }
  } catch (err) {
    console.error('Error fetching departments from master data:', err)
    error.value = 'Failed to load departments. Please try again later.'
  } finally {
    loading.value = false
  }
}

// Initialize form with project data if editing
// Initialize form with project data if editing
const initForm = () => {
  if (props.project) {
    // Perhatikan department dihubungkan sesuai dengan struktur API
    // Tangani department dari department_ids atau departement lama
    const departmentIds = props.project.departments 
      ? props.project.departments.map(d => d.id) 
      : (props.project.department?.id ? [props.project.department.id] : []);
      
    formData.value = {
      name: props.project.name || '',
      department_ids: departmentIds,
      date_start: props.project.dates?.start || '',
      date_end: props.project.dates?.end || '',
      project_manager_id: props.project.team?.manager?.id || '',
      team_ids: props.project.team?.members?.map(m => m.id) || [],
      description: props.project.description || '',
      state: props.project.state || 'draft',
      priority: props.project.priority || '1',
      project_type: props.project.project_type || 'general'
    }
  } else {
    // Reset to defaults if creating new
    formData.value = {
      name: '',
      department_ids: [],
      date_start: '',
      date_end: '',
      project_manager_id: '',
      team_ids: [],
      description: '',
      state: 'draft',
      priority: '1',
      project_type: 'general'
    }
  }
}

const validateForm = () => {
  // Reset error
  error.value = null
  
  // Basic validation
  if (!formData.value.name?.trim()) {
    error.value = 'Project name is required'
    return false
  }
  
  if (!formData.value.department_ids || formData.value.department_ids.length === 0) {
    error.value = 'At least one department is required'
    return false
  }
  
  if (!formData.value.date_start) {
    error.value = 'Start date is required'
    return false
  }
  
  if (!formData.value.date_end) {
    error.value = 'End date is required'
    return false
  }
  
  if (!formData.value.project_manager_id) {
    error.value = 'Project manager is required'
    return false
  }
  
  if (!formData.value.project_type) {
    error.value = 'Project type is required'
    return false
  }
  
  // Validate end date is after start date
  if (formData.value.date_start && formData.value.date_end) {
    const startDate = new Date(formData.value.date_start)
    const endDate = new Date(formData.value.date_end)
    if (endDate < startDate) {
      error.value = 'End date must be after start date'
      return false
    }
  }
  
  return true
}


const submitForm = () => {
  if (!validateForm()) {
    return
  }
  
  loading.value = true
  
  // Format data for API
  const submitData = {
    name: formData.value.name.trim(),
    department_ids: formData.value.department_ids.map(id => parseInt(id)), // Kirim sebagai array
    date_start: formData.value.date_start,
    date_end: formData.value.date_end,
    project_manager_id: parseInt(formData.value.project_manager_id),
    team_ids: Array.isArray(formData.value.team_ids) 
      ? formData.value.team_ids.map(id => parseInt(id)) 
      : formData.value.team_ids ? [parseInt(formData.value.team_ids)] : [],
    description: formData.value.description?.trim() || '',
    state: formData.value.state,
    priority: formData.value.priority,
    project_type: formData.value.project_type,
  }
  
  // For editing, add project_id to the payload
  if (isEditing.value && props.project?.id) {
    submitData.project_id = props.project.id
  }
  
  emit('submit', submitData)
  loading.value = false
}

// Tambahkan watch untuk formData.value.department_ids
watch(() => formData.value.department_ids, (newDeptIds, oldDeptIds) => {
  // Hanya reset jika departemen berubah signifikan 
  // (bukan saat loading awal atau update kecil departemen)
  const hasSignificantChange = () => {
    // Jika dari kosong ke berisi atau sebaliknya
    if (!oldDeptIds || oldDeptIds.length === 0 !== newDeptIds.length === 0) return true;
    
    // Jika jumlah departemen berubah drastis
    if (Math.abs((oldDeptIds || []).length - (newDeptIds || []).length) > 1) return true;
    
    // Bandingkan isi array
    const oldSet = new Set(oldDeptIds || []);
    const newSet = new Set(newDeptIds || []);
    const difference = [...newSet].filter(x => !oldSet.has(x)).length + 
                     [...oldSet].filter(x => !newSet.has(x)).length;
    
    return difference > 1; // Jika ada lebih dari 1 perubahan, dianggap signifikan
  };
  
  if (newDeptIds && hasSignificantChange()) {
    // Jika departemen berubah signifikan, reset team dan manager
    if (formData.value.project_manager_id || formData.value.team_ids.length > 0) {
      formData.value.project_manager_id = '';
      formData.value.team_ids = [];
    }
  }
}, { deep: true });

// Watch for department changes to reset team selections
watch(() => formData.value.department_ids, (newDeptIds, oldDeptIds) => {
  // Hanya reset jika departemen berubah signifikan 
  // (bukan saat loading awal atau update kecil departemen)
  const hasSignificantChange = () => {
    // Jika dari kosong ke berisi atau sebaliknya
    if (!oldDeptIds || !oldDeptIds.length !== !newDeptIds.length) return true;
    
    // Jika departemen utama berubah (anggap departemen pertama sebagai utama)
    if (oldDeptIds[0] !== newDeptIds[0]) return true;
    
    // Jika jumlah departemen berubah drastis
    if (Math.abs(oldDeptIds.length - newDeptIds.length) > 1) return true;
    
    return false;
  };
  
  if (newDeptIds && hasSignificantChange()) {
    // Jika departemen berubah signifikan, reset team dan manager
    if (formData.value.project_manager_id || formData.value.team_ids.length > 0) {
      formData.value.project_manager_id = '';
      formData.value.team_ids = [];
    }
  }
}, { deep: true })


onMounted(() => {
  fetchDepartments()
  initForm()
})
</script>