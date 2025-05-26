<!-- src/components/content/TaskFormModal.vue -->
<template>
  <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="$emit('close')"></div>

      <!-- Modal panel -->
      <div class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
        <div>
          <!-- Modal Header -->
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900" id="modal-title">
              {{ task ? 'Edit Task' : 'Create New Task' }}
            </h3>
            <button
              @click="$emit('close')"
              class="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon class="h-6 w-6" />
            </button>
          </div>

          <!-- Form -->
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <!-- Task Name -->
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700">
                Task Name *
              </label>
              <input
                type="text"
                id="name"
                v-model="formData.name"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                placeholder="Enter task name"
              />
            </div>

            <!-- Project Selection -->
            <div>
              <label for="project_id" class="block text-sm font-medium text-gray-700">
                Project *
              </label>
              <select
                id="project_id"
                v-model="formData.project_id"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
              >
                <option value="">Select a project</option>
                <option
                  v-for="project in projects"
                  :key="project.id"
                  :value="project.id"
                >
                  {{ project.name }}
                </option>
              </select>
            </div>

            <!-- Content Type -->
            <div>
              <label for="content_type" class="block text-sm font-medium text-gray-700">
                Content Type *
              </label>
              <select
                id="content_type"
                v-model="formData.content_type"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
              >
                <option value="">Select content type</option>
                <option value="video">Video</option>
                <option value="design">Design</option>
                <option value="copy">Copy/Content</option>
                <option value="social">Social Media</option>
                <option value="blog">Blog Post</option>
                <option value="other">Other</option>
              </select>
            </div>

            <!-- Assigned To -->
            <div>
              <label for="assigned_to" class="block text-sm font-medium text-gray-700">
                Assigned To *
              </label>
              <select
                id="assigned_to"
                v-model="formData.assigned_to"
                multiple
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                style="min-height: 80px;"
              >
                <option
                  v-for="user in users"
                  :key="user.id"
                  :value="user.id"
                >
                  {{ user.name }}
                </option>
              </select>
              <p class="mt-1 text-xs text-gray-500">Hold Ctrl/Cmd to select multiple users</p>
            </div>

            <!-- Reviewer -->
            <div>
              <label for="reviewer_id" class="block text-sm font-medium text-gray-700">
                Reviewer
              </label>
              <select
                id="reviewer_id"
                v-model="formData.reviewer_id"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
              >
                <option value="">Select a reviewer</option>
                <option
                  v-for="user in users"
                  :key="user.id"
                  :value="user.id"
                >
                  {{ user.name }}
                </option>
              </select>
            </div>

            <!-- Date Range -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label for="planned_date_start" class="block text-sm font-medium text-gray-700">
                  Start Date
                </label>
                <input
                  type="date"
                  id="planned_date_start"
                  v-model="formData.planned_date_start"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                />
              </div>
              <div>
                <label for="planned_date_end" class="block text-sm font-medium text-gray-700">
                  End Date
                </label>
                <input
                  type="date"
                  id="planned_date_end"
                  v-model="formData.planned_date_end"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                />
              </div>
            </div>

            <!-- Planned Hours -->
            <div>
              <label for="planned_hours" class="block text-sm font-medium text-gray-700">
                Planned Hours
              </label>
              <input
                type="number"
                id="planned_hours"
                v-model="formData.planned_hours"
                min="0"
                step="0.5"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                placeholder="0.0"
              />
            </div>

            <!-- Progress (for edit mode) -->
            <div v-if="task">
              <label for="progress" class="block text-sm font-medium text-gray-700">
                Progress (%)
              </label>
              <input
                type="number"
                id="progress"
                v-model="formData.progress"
                min="0"
                max="100"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                placeholder="0"
              />
            </div>

            <!-- Description -->
            <div>
              <label for="description" class="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                v-model="formData.description"
                rows="3"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                placeholder="Enter task description"
              ></textarea>
            </div>

            <!-- Form Actions -->
            <div class="flex justify-between pt-6">
              <!-- Delete Button (only for edit mode) -->
              <button
                v-if="task"
                type="button"
                @click="handleDelete"
                class="inline-flex justify-center py-2 px-4 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <TrashIcon class="h-4 w-4 mr-2" />
                Delete Task
              </button>
              <div v-else></div>

              <!-- Save/Cancel Buttons -->
              <div class="flex space-x-3">
                <button
                  type="button"
                  @click="$emit('close')"
                  class="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  :disabled="loading"
                  class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-700 hover:to-rose-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                >
                  <div v-if="loading" class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  {{ task ? 'Update Task' : 'Create Task' }}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { XMarkIcon, TrashIcon } from '@heroicons/vue/24/outline'
import apiClient from '@/config/api'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  task: {
    type: Object,
    default: null
  },
  projects: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['close', 'submit', 'delete'])

// State
const loading = ref(false)
const users = ref([])

const formData = ref({
  name: '',
  project_id: '',
  content_type: '',
  assigned_to: [],
  reviewer_id: '',
  planned_date_start: '',
  planned_date_end: '',
  planned_hours: '',
  progress: 0,
  description: ''
})

// Methods
const resetForm = () => {
  formData.value = {
    name: '',
    project_id: '',
    content_type: '',
    assigned_to: [],
    reviewer_id: '',
    planned_date_start: '',
    planned_date_end: '',
    planned_hours: '',
    progress: 0,
    description: ''
  }
}

const loadFormData = () => {
  if (props.task) {
    formData.value = {
      name: props.task.name || '',
      project_id: props.task.project_id || '',
      content_type: props.task.content_type || '',
      assigned_to: props.task.assigned_to ? props.task.assigned_to.map(u => u.id || u) : [],
      reviewer_id: props.task.reviewer_id || '',
      planned_date_start: props.task.planned_date_start || props.task.startDate || '',
      planned_date_end: props.task.planned_date_end || props.task.endDate || '',
      planned_hours: props.task.planned_hours || '',
      progress: props.task.progress || 0,
      description: props.task.description || ''
    }
  } else {
    resetForm()
  }
}

const fetchUsers = async () => {
  try {
    const response = await apiClient.post('/web/dataset/call_kw', {
      jsonrpc: '2.0',
      method: 'call',
      params: {
        model: 'hr.employee',
        method: 'search_read',
        args: [[]],
        kwargs: {
          fields: ['id', 'name']
        }
      }
    })

    if (response.data.result) {
      users.value = response.data.result
    }
  } catch (error) {
    console.error('Error fetching users:', error)
  }
}

const handleSubmit = async () => {
  if (!formData.value.name || !formData.value.project_id || !formData.value.content_type || !formData.value.assigned_to.length) {
    alert('Please fill in all required fields')
    return
  }

  try {
    loading.value = true
    
    // Prepare data for submission
    const submitData = {
      name: formData.value.name,
      project_id: parseInt(formData.value.project_id),
      content_type: formData.value.content_type,
      assigned_to: formData.value.assigned_to.map(id => parseInt(id)),
      description: formData.value.description
    }

    // Add optional fields if they have values
    if (formData.value.reviewer_id) {
      submitData.reviewer_id = parseInt(formData.value.reviewer_id)
    }
    
    if (formData.value.planned_date_start) {
      submitData.planned_date_start = formData.value.planned_date_start
    }
    
    if (formData.value.planned_date_end) {
      submitData.planned_date_end = formData.value.planned_date_end
    }
    
    if (formData.value.planned_hours) {
      submitData.planned_hours = parseFloat(formData.value.planned_hours)
    }
    
    if (props.task && formData.value.progress !== undefined) {
      submitData.progress = parseFloat(formData.value.progress)
    }

    // Emit the submit event
    emit('submit', submitData)
    
  } catch (error) {
    console.error('Error submitting task:', error)
    alert('Error saving task. Please try again.')
  } finally {
    loading.value = false
  }
}

const handleDelete = () => {
  if (props.task && confirm('Are you sure you want to delete this task? This action cannot be undone.')) {
    emit('delete', props.task.id)
  }
}

// Watchers
watch(() => props.show, (newVal) => {
  if (newVal) {
    loadFormData()
    if (users.value.length === 0) {
      fetchUsers()
    }
  }
})

watch(() => props.task, () => {
  if (props.show) {
    loadFormData()
  }
})

// Lifecycle
onMounted(() => {
  if (props.show) {
    fetchUsers()
    loadFormData()
  }
})
</script>