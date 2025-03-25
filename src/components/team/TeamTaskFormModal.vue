<!-- src/components/team/TeamTaskFormModal.vue (Redesigned) -->
<template>
  <div 
    v-if="show" 
    class="fixed inset-0 z-50 overflow-y-auto"
    aria-labelledby="modal-title" 
    role="dialog" 
    aria-modal="true"
  >
    <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay with blur effect -->
      <div 
        class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity backdrop-blur-sm" 
        aria-hidden="true"
        @click="handleClose"
      ></div>

      <!-- Modal panel -->
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
      <div class="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
        <!-- Header with Gradient -->
        <div class="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-medium text-white flex items-center">
                <CheckSquare v-if="!isEditMode" class="w-5 h-5 mr-2" />
                <Edit v-else class="w-5 h-5 mr-2" />
                {{ isEditMode ? 'Edit Task' : 'Create New Team Task' }}
              </h3>
              <p class="mt-1 text-sm text-red-100">
                {{ isEditMode ? 'Update this task details' : 'Add a new task to this project' }}
              </p>
            </div>
            <button @click="handleClose" class="text-white hover:text-gray-200 focus:outline-none">
              <X class="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div class="max-h-[calc(100vh-200px)] overflow-y-auto px-6 py-5 custom-scrollbar">
          <form @submit.prevent="handleSubmit" class="space-y-5">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <!-- Task Name -->
              <div class="sm:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1.5">Task Name *</label>
                <div class="relative rounded-md shadow-sm">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FileText class="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    v-model="formData.name"
                    type="text"
                    required
                    class="block w-full pl-10 pr-3 py-2.5 sm:text-sm border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                    placeholder="Enter task name"
                  />
                </div>
              </div>

              <!-- Project -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">Project *</label>
                <div class="relative rounded-md shadow-sm">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FolderOpen class="h-4 w-4 text-gray-400" />
                  </div>
                  <select
                    v-model="formData.project_id"
                    required
                    class="block w-full pl-10 pr-10 py-2.5 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-lg"
                    :disabled="!!props.projectId || isEditMode"
                  >
                    <option value="">Select project</option>
                    <option v-for="project in projects" :key="project.id" :value="project.id">
                      {{ project.name }}
                    </option>
                  </select>
                  <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <!-- <ChevronDown class="h-4 w-4 text-gray-400" /> -->
                  </div>
                </div>
              </div>

              <!-- Task Type -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">Task Type</label>
                <div class="relative rounded-md shadow-sm">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Tag class="h-4 w-4 text-gray-400" />
                  </div>
                  <select
                    v-model="formData.type_id"
                    class="block w-full pl-10 pr-10 py-2.5 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-lg"
                  >
                    <option value="">General</option>
                    <option v-for="type in taskTypes" :key="type.id" :value="type.id">
                      {{ type.name }}
                    </option>
                  </select>
                  <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <!-- <ChevronDown class="h-4 w-4 text-gray-400" /> -->
                  </div>
                </div>
              </div>
              
              <!-- Assigned To Section -->
              <div class="bg-gray-50 rounded-lg p-4 border border-gray-100 sm:col-span-2">
                <h4 class="text-sm font-medium text-gray-700 mb-3 flex items-center">
                  <Users class="w-4 h-4 mr-1.5 text-red-500" />
                  Team Assignment
                </h4>
                
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <!-- Assigned To -->
                  <div>
                    <label class="block text-xs font-medium text-gray-500 mb-1.5">Assigned To *</label>
                    <TeamSelect
                      v-model="formData.assigned_to"
                      :multiple="true"
                      ref="teamSelect"
                      :disabled="loading"
                      class="mt-1 block w-full"
                      placeholder="Select assignee"
                      @update:modelValue="handleAssigneeChange"
                    />
                  </div>

                  <!-- Reviewer -->
                  <div>
                    <label class="block text-xs font-medium text-gray-500 mb-1.5">Reviewer</label>
                    <TeamSelect
                      v-model="formData.reviewer_id"
                      :multiple="false"
                      :disabled="loading"
                      class="mt-1 block w-full"
                      placeholder="Select reviewer"
                    />
                  </div>
                </div>
              </div>
              
              <!-- Timeline Section -->
              <div class="bg-gray-50 rounded-lg p-4 border border-gray-100 sm:col-span-2">
                <h4 class="text-sm font-medium text-gray-700 mb-3 flex items-center">
                  <Calendar class="w-4 h-4 mr-1.5 text-red-500" />
                  Timeline
                </h4>
                
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <!-- Planned Start Date & Time -->
                  <div>
                    <label class="block text-xs font-medium text-gray-500 mb-1.5">Planned Start</label>
                    <div class="mt-1 flex space-x-2">
                      <div class="relative flex-grow">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <CalendarDays class="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                          v-model="formData.planned_date_start"
                          type="date"
                          class="block w-full pl-10 pr-3 py-2 border-gray-300 rounded-lg shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                        />
                      </div>
                      <input
                        v-model="formData.planned_time_start"
                        type="time"
                        class="block w-24 py-2 border-gray-300 rounded-lg shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <!-- Planned End Date & Time -->
                  <div>
                    <label class="block text-xs font-medium text-gray-500 mb-1.5">Planned End</label>
                    <div class="mt-1 flex space-x-2">
                      <div class="relative flex-grow">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <CalendarDays class="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                          v-model="formData.planned_date_end"
                          type="date"
                          class="block w-full pl-10 pr-3 py-2 border-gray-300 rounded-lg shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                        />
                      </div>
                      <input
                        v-model="formData.planned_time_end"
                        type="time"
                        class="block w-24 py-2 border-gray-300 rounded-lg shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                      />
                    </div>
                  </div>
                </div>
                
                <!-- Planned Hours & Priority Row -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <!-- Planned Hours -->
                  <div>
                    <label class="block text-xs font-medium text-gray-500 mb-1.5">Planned Hours</label>
                    <div class="relative rounded-md shadow-sm">
                      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Clock class="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        v-model.number="formData.planned_hours"
                        type="number"
                        min="0"
                        step="0.5"
                        class="block w-full pl-10 pr-3 py-2 border-gray-300 rounded-lg shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                        placeholder="0.0"
                      />
                    </div>
                  </div>

                  <!-- Priority -->
                  <div>
                    <label class="block text-xs font-medium text-gray-500 mb-1.5">Priority</label>
                    <div class="relative rounded-md shadow-sm">
                      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Flag class="h-4 w-4 text-gray-400" />
                      </div>
                      <select
                        v-model="formData.priority"
                        class="block w-full pl-10 pr-10 py-2 border-gray-300 rounded-lg shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                      >
                        <option value="0">Low</option>
                        <option value="1">Medium</option>
                        <option value="2">High</option>
                        <option value="3">Critical</option>
                      </select>
                      <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <!-- <ChevronDown class="h-4 w-4 text-gray-400" /> -->
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Description -->
              <div class="sm:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1.5">
                  <div class="flex items-center">
                    <AlignLeft class="w-4 h-4 mr-1.5 text-red-500" />
                    Description
                  </div>
                </label>
                <textarea
                  v-model="formData.description"
                  rows="4"
                  class="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                  placeholder="Enter task description"
                ></textarea>
              </div>
            </div>

            <!-- Form Actions -->
            <div class="flex justify-end space-x-3 pt-5 border-t border-gray-200">
              <button
                type="button"
                @click="handleClose"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="loading || !isFormValid"
                class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              >
                <Loader2 v-if="loading" class="w-4 h-4 mr-2 animate-spin" />
                <span v-if="isEditMode">Update Task</span>
                <span v-else>Create Task</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { 
  Loader2, CheckSquare, Tag, Users, Calendar, Clock, Flag, 
  FileText, AlignLeft, X, ChevronDown, FolderOpen, Edit,
  CalendarDays
} from 'lucide-vue-next'
import TeamSelect from '@/components/GeneralTeamSelect.vue'
import apiClient from '@/config/api'

const props = defineProps({
  show: Boolean,
  projectId: {
    type: [Number, String],
    default: null
  },
  taskData: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'submit'])
const loading = ref(false)
const projects = ref([])
const taskTypes = ref([])
const teamSelect = ref(null)
const employeeMasters = ref(null)

// Check if we're in edit mode
const isEditMode = computed(() => !!props.taskData)

// Initialize form data
const formData = ref({
  name: '',
  project_id: props.projectId || '',
  type_id: '',
  assigned_to: [],
  reviewer_id: null,
  planned_date_start: '',
  planned_time_start: '09:00',
  planned_date_end: '',
  planned_time_end: '17:00',
  planned_hours: null,
  description: '',
  priority: '1'
})

// Computed for form validation
const isFormValid = computed(() => {
  return (
    formData.value.name &&
    formData.value.project_id &&
    formData.value.assigned_to?.length > 0
  )
})

// Watch for changes in projectId prop
watch(() => props.projectId, (newProjectId) => {
  if (newProjectId) {
    formData.value.project_id = newProjectId
  }
})

// Watch for taskData changes (for edit mode)
watch(() => props.taskData, (newTaskData) => {
  if (newTaskData) {
    // Format date and time from datetime string
    const formatDateTimeFields = (datetimeStr) => {
      if (!datetimeStr) return { date: '', time: '' }
      
      try {
        const datetime = new Date(datetimeStr)
        const date = datetime.toISOString().split('T')[0]
        const hours = String(datetime.getHours()).padStart(2, '0')
        const minutes = String(datetime.getMinutes()).padStart(2, '0')
        const time = `${hours}:${minutes}`
        
        return { date, time }
      } catch (e) {
        console.error('Error parsing datetime:', e)
        return { date: '', time: '' }
      }
    }
    
    const startDatetime = formatDateTimeFields(newTaskData.dates?.planned_start)
    const endDatetime = formatDateTimeFields(newTaskData.dates?.planned_end)
    
    // Populate form with task data
    formData.value = {
      name: newTaskData.name || '',
      project_id: newTaskData.project?.id || props.projectId || '',
      type_id: newTaskData.type?.id || '',
      assigned_to: newTaskData.assigned_to?.map(p => p.id) || [],
      reviewer_id: newTaskData.reviewer?.id || null,
      planned_date_start: startDatetime.date,
      planned_time_start: startDatetime.time || '09:00',
      planned_date_end: endDatetime.date,
      planned_time_end: endDatetime.time || '17:00',
      planned_hours: newTaskData.hours?.planned || null,
      description: newTaskData.description || '',
      priority: newTaskData.priority || '1'
    }
  }
}, { immediate: true })

const handleAssigneeChange = (newValue) => {
  formData.value.assigned_to = Array.isArray(newValue) ? newValue : [newValue]
}

const fetchProjects = async () => {
  try {
    const response = await apiClient.post('/web/v2/team/projects/list', {
      jsonrpc: '2.0',
      id: new Date().getTime(),
      params: {
        limit: 100
      }
    })

    if (response.data.result?.status === 'success') {
      projects.value = response.data.result.data
    }
  } catch (error) {
    console.error('Error fetching projects:', error)
  }
}

const fetchTaskTypes = async () => {
  try {
    const response = await apiClient.post('/web/v2/team/task-types', {
      jsonrpc: '2.0',
      id: new Date().getTime()
    })

    if (response.data.result?.status === 'success') {
      taskTypes.value = response.data.result.data
    } else {
      // Fallback to using dataset/call_kw if the endpoint isn't available
      const fallbackResponse = await apiClient.post('/web/dataset/call_kw', {
        jsonrpc: '2.0',
        method: 'call',
        params: {
          model: 'team.project.task.type',
          method: 'search_read',
          args: [[]],
          kwargs: {
            fields: ['id', 'name']
          }
        }
      })

      if (fallbackResponse.data.result) {
        taskTypes.value = fallbackResponse.data.result
      }
    }
  } catch (error) {
    console.error('Error fetching task types:', error)
  }
}

const fetchEmployeeMasters = async () => {
  try {
    const response = await apiClient.post('/web/employees/masters', {
      jsonrpc: '2.0',
      id: new Date().getTime()
    })

    if (response.data.result?.status === 'success') {
      employeeMasters.value = response.data.result.data
    }
  } catch (error) {
    console.error('Error fetching employee masters:', error)
  }
}

const handleSubmit = () => {
  if (!isFormValid.value) {
    return
  }

  // Combine date and time for start and end
  const formatDateTime = (date, time) => {
    return date && time ? `${date} ${time}:00` : null
  }

  const submitData = {
    name: formData.value.name.trim(),
    project_id: Number(formData.value.project_id),
    type_id: formData.value.type_id ? Number(formData.value.type_id) : false,
    assigned_to: formData.value.assigned_to,
    reviewer_id: formData.value.reviewer_id ? Number(formData.value.reviewer_id) : false,
    planned_date_start: formatDateTime(formData.value.planned_date_start, formData.value.planned_time_start),
    planned_date_end: formatDateTime(formData.value.planned_date_end, formData.value.planned_time_end),
    planned_hours: formData.value.planned_hours ? Number(formData.value.planned_hours) : 0,
    description: formData.value.description?.trim() || '',
    priority: formData.value.priority,
    state: props.taskData?.state || 'draft'
  }

  console.log(`${isEditMode.value ? 'Updating' : 'Creating'} task:`, submitData)
  emit('submit', submitData)
}

const handleClose = () => {
  // Reset form if not in edit mode
  if (!props.taskData) {
    formData.value = {
      name: '',
      project_id: props.projectId || '',
      type_id: '',
      assigned_to: [],
      reviewer_id: null,
      planned_date_start: '',
      planned_time_start: '09:00',
      planned_date_end: '',
      planned_time_end: '17:00',
      planned_hours: null,
      description: '',
      priority: '1'
    }
  }
  
  emit('close')
}

onMounted(() => {
  fetchProjects()
  fetchTaskTypes()
  fetchEmployeeMasters()
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background-color: #f1f1f1;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #d1d1d1;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #a0a0a0;
}
</style>