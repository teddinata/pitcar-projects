<!-- components/team/TeamBAUFormModal.vue -->
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
        @click="$emit('close')"
      ></div>

      <!-- Modal panel -->
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
      <div class="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <!-- Header with Gradient -->
        <div class="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium text-white flex items-center">
              <Clock class="w-5 h-5 mr-2" />
              Add BAU Activity
            </h3>
            <button @click="$emit('close')" class="text-white hover:text-gray-200 focus:outline-none">
              <X class="h-5 w-5" />
            </button>
          </div>
          <p class="mt-1 text-sm text-red-100">Create a business-as-usual activity from existing tasks or manually</p>
        </div>
        
        <form @submit.prevent="submitForm">
          <!-- Task Selection Section -->
          <div class="px-6 pt-5 pb-3 border-b border-gray-100">
            <label for="task_id" class="block text-sm font-medium text-gray-700">Select from existing task</label>
            <div class="mt-2 relative rounded-md shadow-sm">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CheckSquare class="h-4 w-4 text-gray-400" />
              </div>
              <select 
                id="task_id" 
                v-model="selectedTaskId" 
                @change="selectTask"
                class="block w-full pl-10 pr-10 py-2.5 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-lg"
                :class="{'border-red-300 bg-red-50': selectedTaskId}"
              >
                <option value="">Create a new activity</option>
                <option 
                  v-for="task in projectTasks" 
                  :key="task.id" 
                  :value="task.id"
                >
                  {{ task.name }}
                </option>
              </select>
              <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <ChevronDown class="h-4 w-4 text-gray-400" />
              </div>
            </div>
            <p class="mt-1 text-xs text-gray-500">Optional: Select a task to automatically fill activity details</p>
          </div>
          
          <!-- Activity Details Section -->
          <div class="px-6 py-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
            <div class="space-y-5">
              <!-- Activity Name -->
              <div>
                <label for="name" class="block text-sm font-medium text-gray-700">Activity Name</label>
                <div class="mt-1 relative rounded-md shadow-sm">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FileText class="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>
              
              <!-- Time Range -->
              <div class="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <h4 class="text-sm font-medium text-gray-700 mb-3 flex items-center">
                  <Clock class="w-4 h-4 mr-1.5 text-red-500" />
                  Time Allocation
                </h4>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label for="time_start" class="block text-xs font-medium text-gray-500">Start Time</label>
                    <div class="mt-1 relative rounded-md shadow-sm">
                      <input 
                        type="time" 
                        id="time_start" 
                        v-model="form.time_start" 
                        class="block w-full py-2 sm:text-sm border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label for="time_end" class="block text-xs font-medium text-gray-500">End Time</label>
                    <div class="mt-1 relative rounded-md shadow-sm">
                      <input 
                        type="time" 
                        id="time_end" 
                        v-model="form.time_end" 
                        class="block w-full py-2 sm:text-sm border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                        required
                      />
                    </div>
                  </div>
                </div>
                <div class="mt-2 text-xs text-gray-500 flex items-center">
                  <Info class="w-3 h-3 mr-1" />
                  Estimated duration: {{ calculateDuration() }} hours
                </div>
              </div>
              
              <!-- Description -->
              <div>
                <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
                <div class="mt-1 relative rounded-md shadow-sm">
                  <textarea 
                    id="description" 
                    v-model="form.description" 
                    rows="3" 
                    class="block w-full sm:text-sm border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                    placeholder="Describe the activity..."
                  ></textarea>
                </div>
              </div>
              
              <!-- Status -->
              <div>
                <label for="state" class="block text-sm font-medium text-gray-700">Status</label>
                <div class="mt-1">
                  <div class="flex items-center space-x-4">
                    <div 
                      v-for="(statusLabel, statusValue) in statusOptions" 
                      :key="statusValue"
                      class="flex items-center"
                    >
                      <input 
                        type="radio" 
                        :id="`status_${statusValue}`" 
                        :name="'status'" 
                        :value="statusValue" 
                        v-model="form.state" 
                        class="focus:ring-red-500 h-4 w-4 text-red-600 border-gray-300"
                      />
                      <label :for="`status_${statusValue}`" class="ml-2 block text-sm text-gray-700">
                        {{ statusLabel }}
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Footer Actions -->
          <div class="bg-gray-50 px-6 py-4 flex flex-wrap justify-end gap-3 border-t border-gray-100">
            <button
              type="button"
              @click="$emit('close')"
              class="px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-rose-600 to-rose-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 flex items-center"
              :disabled="isSubmitting"
            >
              <span v-if="isSubmitting" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </span>
              <span v-else class="flex items-center">
                <Save class="w-4 h-4 mr-1.5" />
                Save Activity
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Clock, Calendar, FileText, CheckSquare, Tag, ChevronDown, X, Info, Save } from 'lucide-vue-next'
import apiClient from '@/config/api'

const props = defineProps({
  show: Boolean,
  projectId: Number
})

const emit = defineEmits(['close', 'submit'])

// Form data
const form = ref({
  name: '',
  date: new Date().toISOString().substring(0, 10), // Today's date in YYYY-MM-DD format
  activity_type: 'support',
  time_start: '09:00',
  time_end: '10:00',
  description: '',
  state: 'planned'
})

// Status options
const statusOptions = {
  'planned': 'Planned',
  'done': 'Done',
  'not_done': 'Not Done'
}

// Tasks from the project
const projectTasks = ref([])
const selectedTaskId = ref('')
const isSubmitting = ref(false)

onMounted(async () => {
  // Load tasks related to this project
  if (props.projectId) {
    await fetchProjectTasks()
  }
})

const fetchProjectTasks = async () => {
  try {
    const response = await apiClient.post('/web/v2/team/tasks', {
      jsonrpc: '2.0',
      id: new Date().getTime(),
      params: {
        operation: 'list',
        project_id: props.projectId
      }
    })

    if (response.data.result?.status === 'success') {
      projectTasks.value = response.data.result.data
    }
  } catch (error) {
    console.error('Error fetching tasks:', error)
  }
}

const selectTask = () => {
  if (!selectedTaskId.value) {
    // Reset form if "Create new" is selected
    form.value.name = ''
    form.value.description = ''
    return
  }
  
  // Find the selected task
  const task = projectTasks.value.find(t => t.id === parseInt(selectedTaskId.value))
  if (task) {
    // Pre-fill form with task data
    form.value.name = task.name
    form.value.description = task.description || ''
  }
}

const calculateDuration = () => {
  // Parse the time values
  const startParts = form.value.time_start.split(':').map(Number)
  const endParts = form.value.time_end.split(':').map(Number)
  
  // Calculate duration in hours
  let startHours = startParts[0] + startParts[1] / 60
  let endHours = endParts[0] + endParts[1] / 60
  
  // Handle overnight case
  if (endHours < startHours) {
    endHours += 24
  }
  
  const duration = endHours - startHours
  return duration.toFixed(1)
}

const submitForm = async () => {
  if (isSubmitting.value) return
  
  isSubmitting.value = true
  
  try {
    const payload = {
      jsonrpc: '2.0',
      id: new Date().getTime(),
      params: {
        operation: 'create',
        project_id: props.projectId,
        name: form.value.name,
        date: form.value.date,
        activity_type: form.value.activity_type,
        time_start: form.value.time_start,
        time_end: form.value.time_end,
        description: form.value.description,
        state: form.value.state
      }
    }
    
    // Log payload for debugging
    console.log('Submitting BAU activity:', payload)
    
    const response = await apiClient.post('/web/v2/team/bau', payload)
    
    if (response.data.result?.status === 'success') {
      console.log('BAU activity created:', response.data.result.data)
      emit('submit', response.data.result.data)
    } else {
      console.error('Error creating BAU activity:', response.data.result?.message)
      alert('Failed to create activity: ' + (response.data.result?.message || 'Unknown error'))
    }
  } catch (error) {
    console.error('Error submitting BAU form:', error)
    alert('Failed to create activity: ' + (error.message || 'Network error'))
  } finally {
    isSubmitting.value = false
  }
}
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