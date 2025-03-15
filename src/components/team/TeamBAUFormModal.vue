<!-- src/components/team/TeamBAUFormModal.vue -->
<template>
  <Modal :show="show" @close="handleClose">
    <template #title>
      <div>
        <h3 class="text-xl font-semibold text-gray-900">
          {{ editMode ? 'Edit BAU Activity' : 'Add BAU Activity' }}
        </h3>
        <p class="mt-1 text-sm text-gray-500">
          {{ editMode ? 'Update business as usual activity details' : 'Record a business as usual activity for this project' }}
        </p>
      </div>
    </template>
    
    <div class="max-h-[calc(100vh-200px)] overflow-y-auto px-1">
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <!-- Activity Name -->
          <div class="sm:col-span-2">
            <label class="block text-sm font-medium text-gray-700">Activity Name *</label>
            <input
              v-model="formData.name"
              type="text"
              required
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Enter activity name"
            />
          </div>

          <!-- Date and Hours -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Date *</label>
            <input
              v-model="formData.date"
              type="date"
              required
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700">Hours Spent *</label>
            <input
              v-model.number="formData.hours_spent"
              type="number"
              min="0"
              step="0.1"
              required
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="0.0"
            />
          </div>

          <!-- Activity Type -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Activity Type *</label>
            <select
              v-model="formData.activity_type"
              required
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="" disabled>Select activity type</option>
              <option value="meeting">Meeting</option>
              <option value="training">Training</option>
              <option value="support">Support</option>
              <option value="admin">Administrative</option>
              <option value="other">Other</option>
            </select>
          </div>

          <!-- Creator -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Creator</label>
            <TeamSelect
              v-model="formData.creator_id"
              :multiple="false"
              :disabled="loading"
              class="mt-1 block w-full"
              placeholder="Select creator"
            />
          </div>

          <!-- Status -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Status</label>
            <select
              v-model="formData.state"
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="planned">Planned</option>
              <option value="done">Done</option>
              <option value="not_done">Not Done</option>
            </select>
          </div>
        </div>

        <!-- Description -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            v-model="formData.description"
            rows="3"
            class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="Enter activity description"
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
            {{ editMode ? 'Update Activity' : 'Add Activity' }}
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
import TeamSelect from '@/components/TeamSelect.vue'
import apiClient from '@/config/api'

const props = defineProps({
  show: Boolean,
  bauId: {
    type: [Number, String],
    default: null
  },
  projectId: {
    type: [Number, String],
    required: true
  }
})

const emit = defineEmits(['close', 'submit'])
const loading = ref(false)
const employeeMasters = ref(null)

const editMode = computed(() => !!props.bauId)

const formData = ref({
  name: '',
  date: '',
  hours_spent: 0,
  activity_type: '',
  creator_id: null,
  state: 'planned',
  description: ''
})

const isFormValid = computed(() => {
  return (
    formData.value.name &&
    formData.value.date &&
    formData.value.hours_spent > 0 &&
    formData.value.activity_type
  )
})

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

const fetchBAUData = async () => {
  if (!props.bauId) return
  
  try {
    loading.value = true
    const response = await apiClient.post('/web/v2/team/bau', {
      jsonrpc: '2.0',
      id: new Date().getTime(),
      params: {
        operation: 'read',
        bau_id: props.bauId
      }
    })

    if (response.data.result?.status === 'success') {
      const bau = response.data.result.data
      formData.value = {
        name: bau.name,
        date: bau.date,
        hours_spent: bau.hours_spent,
        activity_type: bau.activity_type,
        creator_id: bau.creator?.id,
        state: bau.state,
        description: bau.description || ''
      }
    }
  } catch (error) {
    console.error('Error fetching BAU data:', error)
  } finally {
    loading.value = false
  }
}

const getCurrentUserEmployee = async () => {
  try {
    const response = await apiClient.post('/web/session/get_session_info', {
      jsonrpc: '2.0',
      method: 'call'
    })
    
    if (response.data.result && response.data.result.uid) {
      const uid = response.data.result.uid
      
      const userResponse = await apiClient.post('/web/dataset/call_kw', {
        jsonrpc: '2.0',
        method: 'call',
        params: {
          model: 'res.users',
          method: 'search_read',
          args: [[['id', '=', uid]]],
          kwargs: {
            fields: ['employee_id']
          }
        }
      })
      
      if (userResponse.data.result && userResponse.data.result[0] && userResponse.data.result[0].employee_id) {
        return userResponse.data.result[0].employee_id[0]
      }
    }
    
    return null
  } catch (error) {
    console.error('Error getting current user employee:', error)
    return null
  }
}

const setCurrentUserAsCreator = async () => {
  if (!editMode.value && !formData.value.creator_id) {
    const currentUserEmployeeId = await getCurrentUserEmployee()
    if (currentUserEmployeeId) {
      formData.value.creator_id = currentUserEmployeeId
    }
  }
}

const setDefaultDate = () => {
  if (!editMode.value && !formData.value.date) {
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')
    formData.value.date = `${year}-${month}-${day}`
  }
}

const handleSubmit = () => {
  if (!isFormValid.value) {
    return
  }

  loading.value = true

  const submitData = {
    name: formData.value.name.trim(),
    date: formData.value.date,
    hours_spent: formData.value.hours_spent,
    activity_type: formData.value.activity_type,
    project_id: props.projectId,
    state: formData.value.state,
    description: formData.value.description?.trim() || ''
  }

  if (formData.value.creator_id) {
    submitData.creator_id = formData.value.creator_id
  }

  if (editMode.value) {
    submitData.bau_id = props.bauId
  }

  console.log('Submitting BAU form data:', submitData)
  emit('submit', submitData)

  loading.value = false
}

const handleClose = () => {
  formData.value = {
    name: '',
    date: '',
    hours_spent: 0,
    activity_type: '',
    creator_id: null,
    state: 'planned',
    description: ''
  }
  emit('close')
}

// Lifecycle hooks
onMounted(async () => {
  await fetchEmployeeMasters()
  
  if (editMode.value) {
    await fetchBAUData()
  } else {
    setDefaultDate()
    await setCurrentUserAsCreator()
  }
})

// Reset form when modal is closed and reopened
watch(() => props.show, async (newVal) => {
  if (newVal && !editMode.value) {
    formData.value = {
      name: '',
      date: '',
      hours_spent: 0,
      activity_type: '',
      creator_id: null,
      state: 'planned',
      description: ''
    }
    setDefaultDate()
    await setCurrentUserAsCreator()
  }
})
</script>