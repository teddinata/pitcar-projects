<!-- src/components/team/TeamMeetingFormModal.vue -->
<template>
  <Modal :show="show" @close="handleClose">
    <template #title>
      <div>
        <h3 class="text-xl font-semibold text-gray-900">
          {{ editMode ? 'Edit Meeting' : 'Schedule New Meeting' }}
        </h3>
        <p class="mt-1 text-sm text-gray-500">
          {{ editMode ? 'Update meeting details' : 'Schedule a new meeting for this project' }}
        </p>
      </div>
    </template>
    
    <div class="max-h-[calc(100vh-200px)] overflow-y-auto px-1">
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <!-- Meeting Title -->
          <div class="sm:col-span-2">
            <label class="block text-sm font-medium text-gray-700">Meeting Title *</label>
            <input
              v-model="formData.name"
              type="text"
              required
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Enter meeting title"
            />
          </div>

          <!-- Date/Time -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Start Time *</label>
            <div class="mt-1 flex space-x-2">
              <input
                v-model="formData.start_date"
                type="date"
                required
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
              />
              <input
                v-model="formData.start_time"
                type="time"
                required
                class="block w-24 rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">End Time *</label>
            <div class="mt-1 flex space-x-2">
              <input
                v-model="formData.end_date"
                type="date"
                required
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
              />
              <input
                v-model="formData.end_time"
                type="time"
                required
                class="block w-24 rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
              />
            </div>
          </div>

          <!-- Organizer -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Organizer *</label>
            <TeamSelect
              v-model="formData.organizer_id"
              :multiple="false"
              :disabled="loading"
              class="mt-1 block w-full"
              placeholder="Select organizer"
            />
          </div>

          <!-- Attendees -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Attendees</label>
            <TeamSelect
              v-model="formData.attendee_ids"
              :multiple="true"
              ref="attendeesSelect"
              :disabled="loading"
              class="mt-1 block w-full"
              placeholder="Select attendees"
              @update:modelValue="handleAttendeesChange"
            />
          </div>

          <!-- Location -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Physical Location</label>
            <input
              v-model="formData.location"
              type="text"
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Enter meeting location"
            />
          </div>

          <!-- Virtual Meeting Link -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Virtual Meeting Link</label>
            <input
              v-model="formData.virtual_location"
              type="text"
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Enter video conference link"
            />
          </div>
        </div>

        <!-- Agenda -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Agenda</label>
          <textarea
            v-model="formData.agenda"
            rows="3"
            class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="Enter meeting agenda"
          ></textarea>
        </div>

        <!-- Notify Attendees -->
        <div class="flex items-start">
          <div class="flex items-center h-5">
            <input
              v-model="formData.notify_attendees"
              id="notify_attendees"
              type="checkbox"
              class="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
            />
          </div>
          <div class="ml-3 text-sm">
            <label for="notify_attendees" class="font-medium text-gray-700">
              Notify attendees
            </label>
            <p class="text-gray-500">Send meeting invitation to all attendees</p>
          </div>
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
            {{ editMode ? 'Update Meeting' : 'Schedule Meeting' }}
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
import TeamSelect from '@/components/MeetingTeamSelect.vue'
import apiClient from '@/config/api'

const props = defineProps({
  show: Boolean,
  meetingId: {
    type: [Number, String],
    default: null
  },
  projectId: {
    type: [Number, String],
    required: true
  },
  meetingData: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'submit'])
const loading = ref(false)
const attendeesSelect = ref(null)
const employeeMasters = ref(null)

const editMode = computed(() => !!props.meetingId || !!props.meetingData) 

const formData = ref({
  name: '',
  start_date: '',
  start_time: '09:00',
  end_date: '',
  end_time: '10:00',
  organizer_id: null,
  attendee_ids: [],
  location: '',
  virtual_location: '',
  agenda: '',
  notes: '',
  notify_attendees: true
})

const isFormValid = computed(() => {
  return (
    formData.value.name &&
    formData.value.start_date &&
    formData.value.start_time &&
    formData.value.end_date &&
    formData.value.end_time &&
    formData.value.organizer_id
  )
})

const fillMeetingData = async () => {
  if (props.meetingData) {
    // Jika data meeting dikirim langsung sebagai prop
    populateMeetingForm(props.meetingData)
  } else if (props.meetingId) {
    // Jika hanya ID meeting yang dikirim, ambil data dari server
    await fetchMeetingData()
  }
}

const populateMeetingForm = (meeting) => {
  // Ekstrak data tanggal dan waktu dengan mempertimbangkan timezone
  let startDateTime, endDateTime
  
  try {
    startDateTime = new Date(meeting.dates.start)
    endDateTime = new Date(meeting.dates.end)
  } catch (error) {
    console.error('Error parsing meeting dates:', error)
    startDateTime = new Date()
    endDateTime = new Date()
    endDateTime.setHours(endDateTime.getHours() + 1)
  }
  
  formData.value = {
    name: meeting.name || '',
    start_date: formatDateForInput(startDateTime),
    start_time: formatTimeForInput(startDateTime),
    end_date: formatDateForInput(endDateTime),
    end_time: formatTimeForInput(endDateTime),
    organizer_id: meeting.organizer?.id,
    attendee_ids: meeting.attendees?.map(a => a.id) || [],
    location: meeting.location || '',
    virtual_location: meeting.virtual_location || '',
    agenda: meeting.agenda || '',
    notes: meeting.notes || '',
    notify_attendees: false // Jangan kirim notifikasi ulang untuk edit
  }
}



const handleAttendeesChange = (newValue) => {
  formData.value.attendee_ids = Array.isArray(newValue) ? newValue : [newValue]
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

const fetchMeetingData = async () => {
  if (!props.meetingId) return
  
  try {
    loading.value = true
    const response = await apiClient.post('/web/v2/team/meetings', {
      jsonrpc: '2.0',
      id: new Date().getTime(),
      params: {
        operation: 'read',
        meeting_id: props.meetingId
      }
    })

    if (response.data.result?.status === 'success') {
      const meeting = response.data.result.data
      const startDateTime = new Date(meeting.dates.start)
      const endDateTime = new Date(meeting.dates.end)
      
      formData.value = {
        name: meeting.name,
        start_date: formatDateForInput(startDateTime),
        start_time: formatTimeForInput(startDateTime),
        end_date: formatDateForInput(endDateTime),
        end_time: formatTimeForInput(endDateTime),
        organizer_id: meeting.organizer?.id,
        attendee_ids: meeting.attendees?.map(a => a.id) || [],
        location: meeting.location || '',
        virtual_location: meeting.virtual_location || '',
        agenda: meeting.agenda || '',
        notes: meeting.notes || '',
        notify_attendees: false // Don't re-notify for edits
      }
    }
  } catch (error) {
    console.error('Error fetching meeting data:', error)
  } finally {
    loading.value = false
  }
}

const formatDateForInput = (date) => {
  return date.toISOString().split('T')[0]
}

const formatTimeForInput = (date) => {
  return date.toTimeString().slice(0, 5)
}

const setDefaultTimes = () => {
  if (!editMode.value) {
    const now = new Date()
    
    // Round to nearest future half hour
    const minutes = now.getMinutes()
    const roundedMinutes = minutes < 30 ? 30 : 0
    const hoursAdjustment = minutes < 30 ? 0 : 1
    
    now.setMinutes(roundedMinutes)
    now.setSeconds(0)
    now.setMilliseconds(0)
    
    if (minutes >= 30) {
      now.setHours(now.getHours() + hoursAdjustment)
    }
    
    const startTime = new Date(now)
    const endTime = new Date(now)
    endTime.setHours(endTime.getHours() + 1)
    
    formData.value.start_date = formatDateForInput(startTime)
    formData.value.start_time = formatTimeForInput(startTime)
    formData.value.end_date = formatDateForInput(endTime)
    formData.value.end_time = formatTimeForInput(endTime)
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

const setCurrentUserAsOrganizer = async () => {
  if (!editMode.value && !formData.value.organizer_id) {
    const currentUserEmployeeId = await getCurrentUserEmployee()
    if (currentUserEmployeeId) {
      formData.value.organizer_id = currentUserEmployeeId
    }
  }
}

const handleSubmit = () => {
  if (!isFormValid.value) {
    return
  }

  loading.value = true

  // Combine date and time for start and end
  const formatDateTime = (date, time) => {
    return date && time ? `${date} ${time}:00` : null
  }

  const submitData = {
    name: formData.value.name.trim(),
    start_datetime: formatDateTime(formData.value.start_date, formData.value.start_time),
    end_datetime: formatDateTime(formData.value.end_date, formData.value.end_time),
    organizer_id: formData.value.organizer_id,
    project_id: props.projectId,
    location: formData.value.location?.trim() || '',
    virtual_location: formData.value.virtual_location?.trim() || '',
    agenda: formData.value.agenda?.trim() || '',
    notes: formData.value.notes?.trim() || '',
    notify_attendees: formData.value.notify_attendees
  }

  if (formData.value.attendee_ids.length > 0) {
    submitData.attendee_ids = formData.value.attendee_ids
  }

  console.log('Submitting meeting form data:', submitData)
  emit('submit', submitData)

  loading.value = false
}

const handleClose = () => {
  formData.value = {
    name: '',
    start_date: '',
    start_time: '09:00',
    end_date: '',
    end_time: '10:00',
    organizer_id: null,
    attendee_ids: [],
    location: '',
    virtual_location: '',
    agenda: '',
    notes: '',
    notify_attendees: true
  }
  emit('close')
}

// Lifecycle hooks
// Lifecycle hooks
onMounted(async () => {
  await fetchEmployeeMasters()
  
  if (editMode.value) {
    await fillMeetingData()
  } else {
    setDefaultTimes()
    await setCurrentUserAsOrganizer()
  }
})

// Reset form when modal is closed and reopened
watch(() => props.show, async (newVal) => {
  if (newVal) {
    if (editMode.value) {
      await fillMeetingData()
    } else {
      formData.value = {
        name: '',
        start_date: '',
        start_time: '09:00',
        end_date: '',
        end_time: '10:00',
        organizer_id: null,
        attendee_ids: [],
        location: '',
        virtual_location: '',
        agenda: '',
        notes: '',
        notify_attendees: true
      }
      setDefaultTimes()
      await setCurrentUserAsOrganizer()
    }
  }
})

// Watch untuk meetingData
watch(() => props.meetingData, async (newData) => {
  if (newData && props.show) {
    populateMeetingForm(newData)
  }
})

// Reset form when modal is closed and reopened
watch(() => props.show, async (newVal) => {
  if (newVal && !editMode.value) {
    formData.value = {
      name: '',
      start_date: '',
      start_time: '09:00',
      end_date: '',
      end_time: '10:00',
      organizer_id: null,
      attendee_ids: [],
      location: '',
      virtual_location: '',
      agenda: '',
      notes: '',
      notify_attendees: true
    }
    setDefaultTimes()
    await setCurrentUserAsOrganizer()
  }
})
</script>