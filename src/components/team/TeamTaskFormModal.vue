<!-- src/components/team/TeamTaskFormModal.vue -->
<template>
  <Modal :show="show" @close="handleClose">
    <template #title>
      <div>
        <h3 class="text-xl font-semibold text-gray-900">Create New Team Task</h3>
        <p class="mt-1 text-sm text-gray-500">Add a new task to this project</p>
      </div>
    </template>
    
    <div class="max-h-[calc(100vh-200px)] overflow-y-auto px-1">
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <!-- Task Name -->
          <div class="sm:col-span-2">
            <label class="block text-sm font-medium text-gray-700">Task Name *</label>
            <input
              v-model="formData.name"
              type="text"
              required
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Enter task name"
            />
          </div>

          <!-- Project -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Project *</label>
            <select
              v-model="formData.project_id"
              required
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">Select project</option>
              <option v-for="project in projects" :key="project.id" :value="project.id">
                {{ project.name }}
              </option>
            </select>
          </div>

          <!-- Task Type -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Task Type</label>
            <select
              v-model="formData.type_id"
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">General</option>
              <option v-for="type in taskTypes" :key="type.id" :value="type.id">
                {{ type.name }}
              </option>
            </select>
          </div>

          <!-- Assigned To -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Assigned To *</label>
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
            <label class="block text-sm font-medium text-gray-700">Reviewer</label>
            <TeamSelect
              v-model="formData.reviewer_id"
              :multiple="false"
              :disabled="loading"
              class="mt-1 block w-full"
              placeholder="Select reviewer"
            />
          </div>

          <!-- Planned Start Date & Time -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Planned Start</label>
            <div class="mt-1 flex space-x-2">
              <input
                v-model="formData.planned_date_start"
                type="date"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
              />
              <input
                v-model="formData.planned_time_start"
                type="time"
                class="block w-24 rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
              />
            </div>
          </div>

          <!-- Planned End Date & Time -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Planned End</label>
            <div class="mt-1 flex space-x-2">
              <input
                v-model="formData.planned_date_end"
                type="date"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
              />
              <input
                v-model="formData.planned_time_end"
                type="time"
                class="block w-24 rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
              />
            </div>
          </div>

          <!-- Planned Hours -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Planned Hours</label>
            <input
              v-model.number="formData.planned_hours"
              type="number"
              min="0"
              step="0.5"
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <!-- Priority -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Priority</label>
            <select
              v-model="formData.priority"
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="0">Low</option>
              <option value="1">Medium</option>
              <option value="2">High</option>
              <option value="3">Critical</option>
            </select>
          </div>
        </div>

        <!-- Description -->
        <div class="sm:col-span-2">
          <label class="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            v-model="formData.description"
            rows="3"
            class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="Enter task description"
          ></textarea>
        </div>

        <!-- Form Actions -->
        <div class="flex justify-end space-x-3 pt-4 border-t mb-4 border-gray-200">
          <button
            type="button"
            @click="handleClose"
            class="px-4 py-2 mb-4 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="loading || !isFormValid"
            class="inline-flex mb-4 items-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
          >
            <Loader2 v-if="loading" class="w-4 h-4 mr-2 animate-spin" />
            Create Task
          </button>
        </div>
      </form>
    </div>
  </Modal>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { Loader2 } from 'lucide-vue-next'
import Modal from '@/components/projects/ProjectModal.vue'
import TeamSelect from '@/components/GeneralTeamSelect.vue'
import apiClient from '@/config/api'

const props = defineProps({
  show: Boolean,
  projectId: {
    type: [Number, String],
    default: null
  }
})

const emit = defineEmits(['close', 'submit'])
const loading = ref(false)
const projects = ref([])
const taskTypes = ref([])
const teamSelect = ref(null)
const employeeMasters = ref(null)

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
    state: 'draft'
  }

  console.log('Submitting form data:', submitData)
  emit('submit', submitData)
}

const handleClose = () => {
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
  emit('close')
}

onMounted(() => {
  fetchProjects()
  fetchTaskTypes()
  fetchEmployeeMasters()
})
</script>