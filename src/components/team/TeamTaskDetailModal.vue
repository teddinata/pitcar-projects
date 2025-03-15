<!-- src/components/team/TeamTaskDetailModal.vue -->
<template>
  <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <div class="fixed inset-0 transition-opacity">
        <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
      </div>

      <span class="hidden sm:inline-block sm:align-middle sm:h-screen"></span>&#8203;
      
      <!-- Modal panel -->
      <div 
        class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full"
        role="dialog" 
        aria-modal="true" 
        aria-labelledby="modal-headline"
      >
        <!-- Modal header -->
        <div class="bg-white px-4 py-5 border-b border-gray-200 sm:px-6 flex justify-between items-center">
          <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
            Task Details
          </h3>
          <div class="flex space-x-2">
            <button 
              v-if="!editMode" 
              @click="enableEditMode" 
              class="p-2 text-indigo-600 hover:text-indigo-800 rounded-full hover:bg-gray-100"
            >
              <Edit2 class="h-5 w-5" />
            </button>
            <button 
              @click="$emit('close')"
              class="p-2 text-gray-400 hover:text-gray-500 rounded-full hover:bg-gray-100"
            >
              <X class="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <!-- Loading state -->
        <div v-if="loading" class="p-6 flex justify-center">
          <Loader2 class="w-8 h-8 animate-spin text-indigo-600" />
        </div>
        
        <!-- Task details -->
        <div v-else class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div v-if="editMode" class="space-y-4">
            <!-- Edit form -->
            <div>
              <label for="edit-name" class="block text-sm font-medium text-gray-700">Task Name</label>
              <input 
                id="edit-name"
                v-model="editForm.name" 
                type="text"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" 
              />
            </div>
            
            <div>
              <label for="edit-type" class="block text-sm font-medium text-gray-700">Task Type</label>
              <select 
                id="edit-type"
                v-model="editForm.type_id" 
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="">None</option>
                <option v-for="type in taskTypes" :key="type.id" :value="type.id">
                  {{ type.name }}
                </option>
              </select>
            </div>
            
            <div>
              <label for="edit-assignees" class="block text-sm font-medium text-gray-700">Assignees</label>
              <select
                id="edit-assignees"
                v-model="editForm.assigned_to"
                multiple
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option v-for="employee in employees" :key="employee.id" :value="employee.id">
                  {{ employee.name }}
                </option>
              </select>
              <p class="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple</p>
            </div>
            
            <div>
              <label for="edit-reviewer" class="block text-sm font-medium text-gray-700">Reviewer</label>
              <select
                id="edit-reviewer"
                v-model="editForm.reviewer_id"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="">None</option>
                <option v-for="employee in employees" :key="employee.id" :value="employee.id">
                  {{ employee.name }}
                </option>
              </select>
            </div>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label for="edit-start-date" class="block text-sm font-medium text-gray-700">Planned Start Date</label>
                <input 
                  id="edit-start-date"
                  v-model="editForm.planned_date_start" 
                  type="datetime-local"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" 
                />
              </div>
              
              <div>
                <label for="edit-end-date" class="block text-sm font-medium text-gray-700">Planned End Date</label>
                <input 
                  id="edit-end-date"
                  v-model="editForm.planned_date_end" 
                  type="datetime-local"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" 
                />
              </div>
            </div>
            
            <div>
              <label for="edit-hours" class="block text-sm font-medium text-gray-700">Planned Hours</label>
              <input 
                id="edit-hours"
                v-model="editForm.planned_hours" 
                type="number"
                min="0"
                step="0.5"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" 
              />
            </div>
            
            <div>
              <label for="edit-progress" class="block text-sm font-medium text-gray-700">
                Progress ({{ editForm.progress }}%)
              </label>
              <input 
                id="edit-progress"
                v-model="editForm.progress" 
                type="range"
                min="0"
                max="100"
                step="5"
                class="mt-1 block w-full" 
              />
            </div>
            
            <div>
              <label for="edit-state" class="block text-sm font-medium text-gray-700">Status</label>
              <select 
                id="edit-state"
                v-model="editForm.state" 
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="draft">Draft</option>
                <option value="planned">Planned</option>
                <option value="in_progress">In Progress</option>
                <option value="review">In Review</option>
                <option value="done">Completed</option>
              </select>
            </div>
            
            <div>
              <label for="edit-priority" class="block text-sm font-medium text-gray-700">Priority</label>
              <select 
                id="edit-priority"
                v-model="editForm.priority" 
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="0">Low</option>
                <option value="1">Normal</option>
                <option value="2">High</option>
                <option value="3">Urgent</option>
              </select>
            </div>
            
            <div>
              <label for="edit-description" class="block text-sm font-medium text-gray-700">Description</label>
              <textarea 
                id="edit-description"
                v-model="editForm.description" 
                rows="4"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" 
              ></textarea>
            </div>
          </div>
          
          <!-- View mode content -->
          <div v-else class="space-y-6">
            <!-- Task header -->
            <div>
              <h2 class="text-xl font-semibold text-gray-900">{{ task.name }}</h2>
              <div class="mt-1 flex items-center">
                <span 
                  v-if="task.type"
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="getTypeClasses(task.type)"
                >
                  {{ task.type.name }}
                </span>
                
                <div class="ml-2 flex items-center">
                  <div 
                    class="w-2 h-2 rounded-full mr-1.5"
                    :class="getPriorityClass(task.priority)"
                  ></div>
                  <span class="text-xs text-gray-500">{{ getPriorityLabel(task.priority) }}</span>
                </div>
                
                <span 
                  class="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" 
                  :class="getStatusClasses(task.state)"
                >
                  {{ getStatusLabel(task.state) }}
                </span>
              </div>
            </div>
            
            <!-- Project info -->
            <div v-if="task.project" class="bg-gray-50 p-3 rounded-lg">
              <h3 class="text-sm font-medium text-gray-700">Project</h3>
              <p class="mt-1 text-sm text-gray-900">{{ task.project.name }}</p>
            </div>
            
            <!-- Task timing -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div v-if="task.dates?.planned_start || task.dates?.actual_start" class="bg-gray-50 p-3 rounded-lg">
                <h3 class="text-sm font-medium text-gray-700">Start Date</h3>
                <p v-if="task.dates.actual_start" class="mt-1 text-sm text-gray-900">
                  {{ formatDateWithTime(task.dates.actual_start) }} (Actual)
                </p>
                <p v-else-if="task.dates.planned_start" class="mt-1 text-sm text-gray-900">
                  {{ formatDateWithTime(task.dates.planned_start) }} (Planned)
                </p>
              </div>
              
              <div v-if="task.dates?.planned_end || task.dates?.actual_end" class="bg-gray-50 p-3 rounded-lg">
                <h3 class="text-sm font-medium text-gray-700">End Date</h3>
                <p v-if="task.dates.actual_end" class="mt-1 text-sm text-gray-900">
                  {{ formatDateWithTime(task.dates.actual_end) }} (Actual)
                </p>
                <p v-else-if="task.dates.planned_end" class="mt-1 text-sm text-gray-900">
                  {{ formatDateWithTime(task.dates.planned_end) }} (Planned)
                </p>
              </div>
            </div>
            
            <!-- Task hours -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div v-if="task.hours?.planned" class="bg-gray-50 p-3 rounded-lg">
                <h3 class="text-sm font-medium text-gray-700">Planned Hours</h3>
                <p class="mt-1 text-sm text-gray-900">{{ task.hours.planned }}</p>
              </div>
              
              <div v-if="task.hours?.actual !== undefined" class="bg-gray-50 p-3 rounded-lg">
                <h3 class="text-sm font-medium text-gray-700">Actual Hours</h3>
                <p class="mt-1 text-sm text-gray-900">{{ task.hours.actual }}</p>
              </div>
            </div>
            
            <!-- Progress -->
            <div v-if="typeof task.progress === 'number'">
              <div class="flex justify-between items-center mb-1">
                <h3 class="text-sm font-medium text-gray-700">Progress</h3>
                <span class="text-sm text-gray-500">{{ task.progress }}%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div 
                  class="bg-blue-600 h-2 rounded-full" 
                  :style="{ width: `${task.progress}%` }"
                ></div>
              </div>
            </div>
            
            <!-- Checklist progress -->
            <div v-if="typeof task.checklist_progress === 'number'">
              <div class="flex justify-between items-center mb-1">
                <h3 class="text-sm font-medium text-gray-700">Checklist Progress</h3>
                <span class="text-sm text-gray-500">{{ task.checklist_progress }}%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div 
                  class="bg-green-500 h-2 rounded-full" 
                  :style="{ width: `${task.checklist_progress}%` }"
                ></div>
              </div>
            </div>
            
            <!-- Assignees -->
            <div v-if="task.assigned_to && task.assigned_to.length > 0">
              <h3 class="text-sm font-medium text-gray-700 mb-2">Assignees</h3>
              <div class="flex flex-wrap gap-2">
                <div 
                  v-for="assignee in task.assigned_to" 
                  :key="assignee.id"
                  class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                >
                  {{ assignee.name }}
                </div>
              </div>
            </div>
            
            <!-- Reviewer -->
            <div v-if="task.reviewer">
              <h3 class="text-sm font-medium text-gray-700 mb-2">Reviewer</h3>
              <div class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {{ task.reviewer.name }}
              </div>
            </div>
            
            <!-- Description -->
            <div v-if="task.description">
              <h3 class="text-sm font-medium text-gray-700 mb-2">Description</h3>
              <div class="prose prose-sm max-w-none bg-gray-50 p-3 rounded-lg">
                <p class="whitespace-pre-line">{{ task.description }}</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Modal footer -->
        <div class="bg-gray-50 px-4 py-3 sm:px-6 flex justify-between">
          <button 
            v-if="!editMode"
            @click="confirmDelete" 
            class="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm"
          >
            Delete
          </button>
          
          <div v-if="editMode" class="flex space-x-3">
            <button 
              @click="cancelEdit" 
              class="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
            >
              Cancel
            </button>
            
            <button 
              @click="saveChanges" 
              class="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
            >
              Save Changes
            </button>
          </div>
        </div>
        
        <!-- Delete confirmation dialog -->
        <div v-if="showDeleteConfirm" class="fixed inset-0 z-60 overflow-y-auto">
          <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center">
            <div class="fixed inset-0 transition-opacity">
              <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div class="sm:flex sm:items-start">
                  <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <AlertCircle class="h-6 w-6 text-red-600" />
                  </div>
                  <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 class="text-lg leading-6 font-medium text-gray-900">Delete Task</h3>
                    <div class="mt-2">
                      <p class="text-sm text-gray-500">
                        Are you sure you want to delete this task? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button 
                  @click="deleteTask" 
                  class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Delete
                </button>
                <button 
                  @click="showDeleteConfirm = false" 
                  class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { format } from 'date-fns'
import { Edit2, X, AlertCircle, Loader2 } from 'lucide-vue-next'
import apiClient from '@/config/api'

const props = defineProps({
  show: Boolean,
  task: Object,
})

const emit = defineEmits(['close', 'update', 'delete'])

// State
const editMode = ref(false)
const loading = ref(false)
const showDeleteConfirm = ref(false)
const taskTypes = ref([])
const employees = ref([])
const editForm = ref({
  task_id: null,
  name: '',
  type_id: '',
  assigned_to: [],
  reviewer_id: '',
  planned_date_start: '',
  planned_date_end: '',
  planned_hours: '',
  progress: 0,
  description: '',
  priority: '1',
  state: 'draft'
})

// Methods
const fetchTaskTypes = async () => {
  try {
    const response = await apiClient.post('/web/v2/team/task-types', {
      jsonrpc: '2.0',
      id: new Date().getTime(),
      params: {}
    })

    if (response.data.result?.status === 'success') {
      taskTypes.value = response.data.result.data
    }
  } catch (error) {
    console.error('Error fetching task types:', error)
  }
}

const fetchEmployees = async () => {
  try {
    // Using employees endpoint instead of hr.employee model direct call
    const response = await apiClient.post('/web/employees', {
      jsonrpc: '2.0',
      id: new Date().getTime(),
      params: {
        limit: 100
      }
    })

    if (response.data.status === 'success') {
      employees.value = response.data.data.rows.map(emp => ({
        id: emp.id,
        name: emp.name
      }))
    }
  } catch (error) {
    console.error('Error fetching employees:', error)
  }
}

const enableEditMode = () => {
  // Deep copy of task object to prevent modifying the original
  const task = props.task
  
  // Initialize the form with task data
  editForm.value = {
    task_id: task.id,
    name: task.name,
    type_id: task.type?.id || '',
    assigned_to: task.assigned_to?.map(a => a.id) || [],
    reviewer_id: task.reviewer?.id || '',
    planned_date_start: task.dates?.planned_start || '',
    planned_date_end: task.dates?.planned_end || '',
    planned_hours: task.hours?.planned || '',
    progress: task.progress || 0,
    description: task.description || '',
    priority: task.priority || '1',
    state: task.state || 'draft'
  }
  
  editMode.value = true
}

const cancelEdit = () => {
  editMode.value = false
}

const saveChanges = async () => {
  if (!editForm.value.task_id) return
  
  try {
    loading.value = true
    
    await emit('update', { ...editForm.value })
    
    editMode.value = false
  } catch (error) {
    console.error('Error saving changes:', error)
  } finally {
    loading.value = false
  }
}

const confirmDelete = () => {
  showDeleteConfirm.value = true
}

const deleteTask = async () => {
  if (!props.task?.id) return
  
  try {
    loading.value = true
    
    await emit('delete', props.task.id)
    
    showDeleteConfirm.value = false
  } catch (error) {
    console.error('Error deleting task:', error)
  } finally {
    loading.value = false
  }
}

// Helper functions
const formatDateWithTime = (dateString) => {
  if (!dateString) return ''
  try {
    const date = new Date(dateString)
    return format(date, 'dd MMM yyyy HH:mm')
  } catch (error) {
    console.error('Error formatting date:', error)
    return dateString
  }
}

const getTypeClasses = (type) => {
  // Map predefined colors to tailwind classes
  const colorMap = {
    'red': 'bg-red-100 text-red-800',
    'blue': 'bg-blue-100 text-blue-800',
    'green': 'bg-green-100 text-green-800',
    'yellow': 'bg-yellow-100 text-yellow-800',
    'purple': 'bg-purple-100 text-purple-800',
    'indigo': 'bg-indigo-100 text-indigo-800',
    'pink': 'bg-pink-100 text-pink-800'
  }
  
  // If type has a color property, use it
  if (type.color && colorMap[type.color]) {
    return colorMap[type.color]
  }
  
  // Default to gray
  return 'bg-gray-100 text-gray-800'
}

const getPriorityClass = (priority) => {
  const priorityClasses = {
    '0': 'bg-gray-400', // Low
    '1': 'bg-green-500', // Normal
    '2': 'bg-yellow-500', // High
    '3': 'bg-red-500' // Urgent
  }
  
  return priorityClasses[priority] || priorityClasses['1']
}

const getPriorityLabel = (priority) => {
  const priorityLabels = {
    '0': 'Low',
    '1': 'Normal',
    '2': 'High', 
    '3': 'Urgent'
  }
  
  return priorityLabels[priority] || 'Normal'
}

const getStatusClasses = (state) => {
  const stateClasses = {
    'draft': 'bg-gray-100 text-gray-800',
    'planned': 'bg-purple-100 text-purple-800',
    'in_progress': 'bg-yellow-100 text-yellow-800', 
    'review': 'bg-blue-100 text-blue-800',
    'done': 'bg-green-100 text-green-800'
  }
  
  return stateClasses[state] || stateClasses['draft']
}

const getStatusLabel = (state) => {
  const stateLabels = {
    'draft': 'Draft',
    'planned': 'Planned',
    'in_progress': 'In Progress', 
    'review': 'In Review',
    'done': 'Completed'
  }
  
  return stateLabels[state] || 'Draft'
}

// Watch for task changes
watch(() => props.task, (newTask) => {
  if (newTask && editMode.value) {
    // If in edit mode and task changes, update the form
    enableEditMode()
  }
})

// Load data when component mounts
onMounted(() => {
  fetchTaskTypes()
  fetchEmployees()
})
</script>