<!-- src/components/team/TeamProjectFormModal.vue -->
<template>
  <div v-if="show" class="fixed inset-0 overflow-y-auto z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="$emit('close')"></div>

      <!-- Modal panel -->
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
      
      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
              <!-- Modal Header -->
              <div class="mb-6">
                <h3 class="text-lg font-medium text-gray-900" id="modal-title">
                  {{ isEditing ? 'Edit Project' : 'Create New Project' }}
                </h3>
                <p class="mt-1 text-sm text-gray-500">
                  Fill in the information below to {{ isEditing ? 'update' : 'create' }} your project
                </p>
              </div>
              
              <!-- Form Error Messages -->
              <div 
                v-if="error" 
                class="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-600"
              >
                {{ error }}
              </div>
              
              <!-- Project Form -->
              <form @submit.prevent="submitForm" class="space-y-6">
                <!-- Project Name -->
                <div>
                  <label for="project-name" class="block text-sm font-medium text-gray-700">
                    Project Name <span class="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="project-name"
                    v-model="formData.name"
                    class="w-full px-3 py-2 border focus:outline-none focus:ring-2  mt-1 block rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                    placeholder="Enter project name"
                    required
                  />
                </div>

                <!-- Department -->
                <div>
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
                </div>

                <!-- Date Range -->
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label for="start-date" class="block text-sm font-medium text-gray-700">
                      Start Date <span class="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      id="start-date"
                      v-model="formData.date_start"
                      class="px-3 py-2 border focus:outline-none focus:ring-2  mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                      required
                    />
                  </div>
                  <div>
                    <label for="end-date" class="block text-sm font-medium text-gray-700">
                      End Date <span class="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      id="end-date"
                      v-model="formData.date_end"
                      class="px-3 py-2 border focus:outline-none focus:ring-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                      required
                    />
                  </div>
                </div>

                <!-- Project Manager -->
                <div>
                  <label for="manager" class="block text-sm font-medium text-gray-700">
                    Project Manager <span class="text-red-500">*</span>
                  </label>
                  <TeamSelect
                    id="manager"
                    v-model="formData.project_manager_id"
                    :department-id="formData.department_id ? parseInt(formData.department_id) : null"
                    :multiple="false"
                    :disabled="!formData.department_id"
                    placeholder="Select Manager"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                    required
                  />
                  <p v-if="!formData.department_id" class="mt-1 text-xs text-orange-500">
                    Please select a department first
                  </p>
                </div>

                <!-- Team Members -->
                <div>
                  <label class="block text-sm font-medium text-gray-700">
                    Team Members
                  </label>
                  <TeamSelect
                    v-model="formData.team_ids"
                    :department-id="formData.department_id ? parseInt(formData.department_id) : null"
                    :multiple="true"
                    :disabled="!formData.department_id"
                    placeholder="Select Team Members"
                  />
                  <p v-if="!formData.department_id" class="mt-1 text-xs text-orange-500">
                    Please select a department first
                  </p>
                </div>

                <!-- Status & Priority -->
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label for="status" class="block text-sm font-medium text-gray-700">Status</label>
                    <select
                      id="status"
                      v-model="formData.state"
                      class="px-3 py-2 border focus:outline-none focus:ring-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
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
                      class="px-3 py-2 border focus:outline-none focus:ring-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                    >
                      <option value="0">Low</option>
                      <option value="1">Medium</option>
                      <option value="2">High</option>
                      <option value="3">Critical</option>
                    </select>
                  </div>
                </div>

                <!-- Description -->
                <div>
                  <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    id="description"
                    v-model="formData.description"
                    rows="3"
                    class="px-3 py-2 border focus:outline-none focus:ring-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                    placeholder="Enter project description"
                  ></textarea>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            @click="submitForm"
            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
            :disabled="loading || !formData.department_id"
          >
            <span v-if="loading" class="mr-2">
              <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
            {{ isEditing ? 'Update' : 'Create' }}
          </button>
          <button
            type="button"
            @click="$emit('close')"
            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Cancel
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
  department_id: '',
  date_start: '',
  date_end: '',
  project_manager_id: '',
  team_ids: [],
  description: '',
  state: 'draft',
  priority: '1'
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
const initForm = () => {
  if (props.project) {
    formData.value = {
      name: props.project.name || '',
      department_id: props.project.department?.id || '',
      date_start: props.project.dates?.start || '',
      date_end: props.project.dates?.end || '',
      project_manager_id: props.project.team?.manager?.id || '',
      team_ids: props.project.team?.members?.map(m => m.id) || [],
      description: props.project.description || '',
      state: props.project.state || 'draft',
      priority: props.project.priority || '1'
    }
  } else {
    // Reset to defaults if creating new
    formData.value = {
      name: '',
      department_id: '',
      date_start: '',
      date_end: '',
      project_manager_id: '',
      team_ids: [],
      description: '',
      state: 'draft',
      priority: '1'
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
  
  if (!formData.value.department_id) {
    error.value = 'Department is required'
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
    department_id: parseInt(formData.value.department_id),
    date_start: formData.value.date_start,
    date_end: formData.value.date_end,
    project_manager_id: parseInt(formData.value.project_manager_id),
    team_ids: Array.isArray(formData.value.team_ids) 
      ? formData.value.team_ids.map(id => parseInt(id)) 
      : formData.value.team_ids ? [parseInt(formData.value.team_ids)] : [],
    description: formData.value.description?.trim() || '',
    state: formData.value.state,
    priority: formData.value.priority,
    // Don't include user_id in the payload as it's causing errors with notifications
  }
  
  // For editing, add project_id to the payload
  if (isEditing.value && props.project?.id) {
    submitData.project_id = props.project.id
  }
  
  emit('submit', submitData)
  loading.value = false
}

onMounted(() => {
  fetchDepartments()
  initForm()
})
</script>