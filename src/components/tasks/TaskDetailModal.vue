<!-- src/components/tasks/TaskDetailModal.vue -->
<template>
  <div 
    v-if="show" 
    class="fixed inset-0 z-50 overflow-y-auto"
    @click="closeModal"
  >
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <div 
        class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        aria-hidden="true"
      ></div>

      <!-- Centered modal -->
      <span 
        class="hidden sm:inline-block sm:align-middle sm:h-screen"
        aria-hidden="true"
      >&#8203;</span>

      <div 
        class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full"
        @click.stop
      >
        <!-- Modal Header -->
        <div 
          class="px-6 py-4 border-b border-gray-200 flex items-center justify-between"
          :class="{ 'bg-yellow-50': isInProgress, 'bg-green-50': isCompleted, 'bg-red-50': isRevision, 'bg-purple-50': isInReview, 'bg-gray-50': isDraft }"
        >
          <div class="flex items-center">
            <div 
              class="w-2.5 h-2.5 rounded-full mr-3"
              :class="{ 
                'bg-yellow-500': isInProgress, 
                'bg-green-500': isCompleted, 
                'bg-red-500': isRevision, 
                'bg-purple-500': isInReview, 
                'bg-gray-500': isDraft 
              }"
            ></div>
            <h3 class="text-lg font-medium text-gray-900">
              {{ editMode ? 'Edit Task' : task.name }}
            </h3>
          </div>
          
          <div class="flex items-center space-x-2">
            <div 
              v-if="!editMode"
              class="px-2.5 py-0.5 text-xs font-medium rounded-full"
              :class="{
                'bg-yellow-100 text-yellow-800': isInProgress,
                'bg-green-100 text-green-800': isCompleted,
                'bg-red-100 text-red-800': isRevision,
                'bg-purple-100 text-purple-800': isInReview,
                'bg-gray-100 text-gray-800': isDraft
              }"
            >
              {{ formatState(task.state) }}
            </div>
            
            <button
              @click="closeModal"
              class="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <XCircle class="h-6 w-6" />
            </button>
          </div>
        </div>

        <!-- Modal Content -->
        <div class="p-6">
          <!-- View Mode -->
          <div v-if="!editMode" class="space-y-6">
            <!-- Task Info -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Left Column -->
              <div class="space-y-4">
                <div>
                  <h4 class="text-sm font-medium text-gray-500 mb-1">Task Type</h4>
                  <div class="flex items-center">
                    <span
                      class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
                      :class="{
                        'bg-blue-100 text-blue-800': task.content_type === 'video',
                        'bg-green-100 text-green-800': task.content_type === 'design',
                        'bg-gray-100 text-gray-800': !task.content_type || task.content_type === 'other'
                      }"
                    >
                      <template v-if="task.content_type === 'video'">
                        <Video class="w-3.5 h-3.5 mr-1" />
                      </template>
                      <template v-else-if="task.content_type === 'design'">
                        <Palette class="w-3.5 h-3.5 mr-1" />
                      </template>
                      {{ task.content_type || 'Not specified' }}
                    </span>
                  </div>
                </div>
                
                <div>
                  <h4 class="text-sm font-medium text-gray-500 mb-1">Dates</h4>
                  <div class="bg-gray-50 rounded-lg p-3 space-y-2">
                    <div class="flex justify-between text-sm">
                      <span class="text-gray-600">Planned Start</span>
                      <span class="font-medium">{{ formatDateTime(task.dates?.planned_start) }}</span>
                    </div>
                    <div class="flex justify-between text-sm">
                      <span class="text-gray-600">Planned End</span>
                      <span 
                        class="font-medium"
                        :class="{ 'text-red-600': isTaskOverdue }"
                      >
                        {{ formatDateTime(task.dates?.planned_end) }}
                      </span>
                    </div>
                    <div class="border-t border-gray-200 my-1 pt-1"></div>
                    <div class="flex justify-between text-sm">
                      <span class="text-gray-600">Actual Start</span>
                      <span class="font-medium">{{ formatDateTime(task.dates?.actual_start) || 'Not started' }}</span>
                    </div>
                    <div class="flex justify-between text-sm">
                      <span class="text-gray-600">Actual End</span>
                      <span class="font-medium">{{ formatDateTime(task.dates?.actual_end) || 'Not completed' }}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 class="text-sm font-medium text-gray-500 mb-1">Hours</h4>
                  <div class="bg-gray-50 rounded-lg p-3 space-y-2">
                    <div class="flex justify-between text-sm">
                      <span class="text-gray-600">Planned Hours</span>
                      <span class="font-medium">{{ task.hours?.planned || 0 }} hours</span>
                    </div>
                    <div class="flex justify-between text-sm">
                      <span class="text-gray-600">Actual Hours</span>
                      <span 
                        class="font-medium"
                        :class="{ 'text-red-600': isOverHours }"
                      >
                        {{ task.hours?.actual || 0 }} hours
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Right Column -->
              <div class="space-y-4">
                <div>
                  <h4 class="text-sm font-medium text-gray-500 mb-1">Assigned To</h4>
                  <div class="bg-gray-50 rounded-lg p-3">
                    <div class="space-y-2">
                      <div
                        v-for="member in task.assigned_to"
                        :key="member.id"
                        class="flex items-center"
                      >
                        <div class="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                          <span class="text-xs font-medium text-gray-600">
                            {{ getInitials(member.name) }}
                          </span>
                        </div>
                        <div class="ml-3">
                          <span class="text-sm font-medium">{{ member.name }}</span>
                          <p class="text-xs text-gray-500">{{ member.position }}</p>
                        </div>
                      </div>
                      <div v-if="!task.assigned_to || task.assigned_to.length === 0" class="text-sm text-gray-500 italic">
                        No team members assigned
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 class="text-sm font-medium text-gray-500 mb-1">Reviewer</h4>
                  <div class="bg-gray-50 rounded-lg p-3">
                    <div v-if="task.reviewer" class="flex items-center">
                      <div class="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                        <span class="text-xs font-medium text-purple-600">
                          {{ getInitials(task.reviewer.name) }}
                        </span>
                      </div>
                      <div class="ml-3">
                        <span class="text-sm font-medium">{{ task.reviewer.name }}</span>
                        <p class="text-xs text-gray-500">{{ task.reviewer.position }}</p>
                      </div>
                    </div>
                    <div v-else class="text-sm text-gray-500 italic">
                      No reviewer assigned
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 class="text-sm font-medium text-gray-500 mb-1">Progress</h4>
                  <div class="bg-gray-50 rounded-lg p-3">
                    <div class="flex justify-between text-sm mb-1.5">
                      <span class="text-gray-600">Current Progress</span>
                      <span class="font-medium">{{ task.progress }}%</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2">
                      <div
                        class="h-2 rounded-full transition-all duration-500"
                        :class="{
                          'bg-red-500': task.progress < 30,
                          'bg-yellow-500': task.progress >= 30 && task.progress < 70,
                          'bg-green-500': task.progress >= 70
                        }"
                        :style="{ width: `${task.progress}%` }"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Description -->
            <div v-if="task.description">
              <h4 class="text-sm font-medium text-gray-500 mb-1">Description</h4>
              <div class="bg-gray-50 rounded-lg p-3">
                <p class="text-sm text-gray-700 whitespace-pre-line">{{ task.description }}</p>
              </div>
            </div>
            
            <!-- Revisions (if any) -->
            <div v-if="task.revisions && task.revisions.count > 0">
              <h4 class="text-sm font-medium text-gray-500 mb-1">Revisions ({{ task.revisions.count }})</h4>
              <div class="bg-gray-50 rounded-lg p-3">
                <div class="space-y-3">
                  <div 
                    v-for="revision in task.revisions.history" 
                    :key="revision.number"
                    class="border-b border-gray-200 last:border-b-0 pb-2 last:pb-0"
                  >
                    <div class="flex justify-between mb-1">
                      <span class="text-sm font-medium">Revision #{{ revision.number }}</span>
                      <span class="text-xs text-gray-500">{{ formatDate(revision.date) }}</span>
                    </div>
                    <p class="text-sm text-gray-600">
                      <span class="font-medium">Requested by:</span> {{ revision.requested_by }}
                    </p>
                    <p class="text-sm text-gray-600 mt-1">{{ revision.notes }}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Action Buttons -->
            <div class="flex justify-between pt-4 border-t border-gray-200">
              <div>
                <button
                  v-if="!isCompleted"
                  @click="confirmDeleteTask"
                  class="inline-flex items-center px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50"
                >
                  <Trash2 class="w-4 h-4 mr-2" />
                  Delete Task
                </button>
              </div>
              
              <div class="flex space-x-3">
                <button
                  @click="closeModal"
                  class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  @click="enableEditMode"
                  class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-rose-600 to-rose-500"
                >
                  <Pencil class="w-4 h-4 mr-2" />
                  Edit Task
                </button>
              </div>
            </div>
          </div>
          
          <!-- Edit Mode -->
          <div v-else>
            <form @submit.prevent="submitForm" class="space-y-4">
              <!-- Task Name -->
              <div>
                <label for="task-name" class="block text-sm font-medium text-gray-700 mb-1">Task Name *</label>
                <input
                  id="task-name"
                  v-model="formData.name"
                  type="text"
                  required
                  class="px-3 py-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                />
              </div>
              
              <!-- Content Type and Status -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label for="content-type" class="block text-sm font-medium text-gray-700 mb-1">Content Type *</label>
                  <select
                    id="content-type"
                    v-model="formData.content_type"
                    required
                    class="px-3 py-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                  >
                    <option value="" disabled>Select content type</option>
                    <option value="video">Video</option>
                    <option value="design">Design</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label for="task-status" class="block text-sm font-medium text-gray-700 mb-1">Status *</label>
                  <select
                    id="task-status"
                    v-model="formData.state"
                    required
                    class="px-3 py-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                  >
                    <option value="draft">Draft</option>
                    <option value="in_progress">In Progress</option>
                    <option value="review">In Review</option>
                    <option value="revision">In Revision</option>
                    <option value="done">Completed</option>
                  </select>
                </div>
              </div>
              
              <!-- Assigned To and Reviewer -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label for="assigned-to" class="block text-sm font-medium text-gray-700 mb-1">Assigned To *</label>
                  <TeamSelect
                      v-model="formData.assigned_to"
                      :multiple="true"
                      class="mt-2"
                    />
                  <p class="px-3 py-2 mt-1 text-xs text-gray-500">Hold Ctrl/Cmd to select multiple members</p>
                </div>
                
                <div>
                  <label for="reviewer" class="block text-sm font-medium text-gray-700 mb-1">Reviewer</label>
                  <TeamSelect
                      v-model="formData.reviewer_id"
                      :multiple="false"
                      class="mt-2"
                    />
                </div>
              </div>
              
              <!-- Dates -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label for="planned-start" class="block text-sm font-medium text-gray-700 mb-1">Planned Start Date</label>
                  <input
                    id="planned-start"
                    v-model="formData.planned_date_start"
                    type="datetime-local"
                    class="px-3 py-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label for="planned-end" class="block text-sm font-medium text-gray-700 mb-1">Planned End Date</label>
                  <input
                    id="planned-end"
                    v-model="formData.planned_date_end"
                    type="datetime-local"
                    class="px-3 py-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                  />
                </div>
              </div>
              
              <!-- Hours and Progress -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label for="planned-hours" class="block text-sm font-medium text-gray-700 mb-1">Planned Hours</label>
                  <input
                    id="planned-hours"
                    v-model.number="formData.planned_hours"
                    type="number"
                    min="0"
                    step="0.5"
                    class="px-3 py-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label for="progress" class="block text-sm font-medium text-gray-700 mb-1">Progress (%)</label>
                  <input
                    id="progress"
                    v-model.number="formData.progress"
                    type="number"
                    min="0"
                    max="100"
                    class="px-3 py-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                  />
                </div>
              </div>
              
              <!-- Description -->
              <div>
                <label for="description" class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  id="description"
                  v-model="formData.description"
                  rows="3"
                  class="px-3 py-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                ></textarea>
              </div>
              
              <!-- Form Actions -->
              <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  @click="cancelEdit"
                  class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  class="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700"
                >
                  Update Task
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Delete Confirmation Dialog -->
    <div 
      v-if="showDeleteConfirm" 
      class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-[60]"
      @click="showDeleteConfirm = false"
    >
      <div class="bg-white rounded-lg p-6 max-w-md w-full" @click.stop>
        <h3 class="text-lg font-medium text-gray-900">Delete Task</h3>
        <p class="mt-2 text-sm text-gray-500">
          Are you sure you want to delete "{{ task.name }}"? This action cannot be undone.
        </p>
        <div class="mt-4 flex justify-end space-x-3">
          <button
            @click="showDeleteConfirm = false"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            @click="deleteTask"
            class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { format, parseISO, isPast, isAfter } from 'date-fns'
import TeamSelect from '@/components/TeamSelect.vue'

import { 
  XCircle, 
  Pencil, 
  Trash2, 
  Video, 
  Palette
} from 'lucide-vue-next'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  task: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'update', 'delete'])

// State variables
const editMode = ref(false)
const formData = ref({
  id: null // Make sure ID is always initialized
})
const showDeleteConfirm = ref(false)

// Mock team members data (in a real app, this would come from an API)
const teamMembers = ref([
  { id: 1, name: 'John Doe', position: 'Marketing Director' },
  { id: 2, name: 'Jane Smith', position: 'Creative Lead' },
  { id: 3, name: 'Mike Johnson', position: 'Content Manager' },
  { id: 4, name: 'Sara Wilson', position: 'Video Producer' },
  { id: 5, name: 'Tom Brown', position: 'Graphic Designer' },
  { id: 6, name: 'Emily Davis', position: 'Content Writer' }
])

// Computed properties
const isInProgress = computed(() => props.task.state === 'in_progress')
const isCompleted = computed(() => props.task.state === 'done')
const isRevision = computed(() => props.task.state === 'revision')
const isInReview = computed(() => props.task.state === 'review')
const isDraft = computed(() => props.task.state === 'draft')

const isTaskOverdue = computed(() => {
  if (!props.task.dates?.planned_end || props.task.state === 'done') return false
  return isPast(new Date(props.task.dates.planned_end))
})

const isOverHours = computed(() => {
  if (!props.task.hours?.planned || !props.task.hours?.actual) return false
  return props.task.hours.actual > props.task.hours.planned
})

// Methods
const formatState = (state) => {
  const states = {
    'draft': 'Draft',
    'in_progress': 'In Progress',
    'review': 'In Review',
    'revision': 'Revision',
    'done': 'Completed'
  }
  return states[state] || state
}

const formatDate = (date) => {
  if (!date) return '-'
  return format(new Date(date), 'dd MMM yyyy')
}

const formatDateTime = (date, time) => {
  // Mengubah format dari yyyy-MM-ddTHH:mm menjadi yyyy-MM-dd HH:mm:00
  if (date && time) {
    // Jika date adalah format ISO (dengan T), maka kita pisahkan
    if (date.includes('T')) {
      const [datePart] = date.split('T')
      return `${datePart} ${time}:00`
    }
    // Jika tidak, gunakan format normal
    return `${date} ${time}:00`
  }
  return null
}


const getInitials = (name) => {
  if (!name) return ''
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
}

const closeModal = () => {
  editMode.value = false
  emit('close')
}

const enableEditMode = () => {
  // Initialize form data from task
  formData.value = {
    id: props.task.id, // Make sure the ID is set here
    name: props.task.name,
    content_type: props.task.content_type,
    state: props.task.state,
    assigned_to: props.task.assigned_to?.map(member => member.id) || [],
    reviewer_id: props.task.reviewer?.id || '',
    planned_date_start: props.task.dates?.planned_start ? formatDateForInput(props.task.dates.planned_start) : '',
    planned_date_end: props.task.dates?.planned_end ? formatDateForInput(props.task.dates.planned_end) : '',
    planned_hours: props.task.hours?.planned || 0,
    progress: props.task.progress || 0,
    description: props.task.description || ''
  }
  
  editMode.value = true
}

const formatDateForInput = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return format(date, "yyyy-MM-dd'T'HH:mm")
}


const cancelEdit = () => {
  editMode.value = false
}

const submitForm = () => {
  // Pisahkan tanggal dan waktu jika formData.planned_date_start berisi 'T'
  let startDate = formData.value.planned_date_start
  let startTime = formData.value.planned_time_start
  
  if (startDate && startDate.includes('T')) {
    const [datePart, timePart] = startDate.split('T')
    startDate = datePart
    if (!startTime && timePart) {
      startTime = timePart
    }
  }
  
  // Pisahkan tanggal dan waktu jika formData.planned_date_end berisi 'T'
  let endDate = formData.value.planned_date_end
  let endTime = formData.value.planned_time_end
  
  if (endDate && endDate.includes('T')) {
    const [datePart, timePart] = endDate.split('T')
    endDate = datePart
    if (!endTime && timePart) {
      endTime = timePart
    }
  }
  
  // Buat data yang akan dikirim dengan format tanggal yang benar
  const submitData = {
    task_id: props.task.id,
    name: formData.value.name.trim(),
    content_type: formData.value.content_type,
    state: formData.value.state,
    planned_date_start: formatDateTime(startDate, startTime),
    planned_date_end: formatDateTime(endDate, endTime),
    planned_hours: formData.value.planned_hours,
    actual_hours: formData.value.actual_hours,
    progress: formData.value.progress,
    assigned_to: formData.value.assigned_to,
    reviewer_id: formData.value.reviewer_id,
    description: formData.value.description?.trim() || null
  }

  emit('update', submitData)
}


const confirmDeleteTask = () => {
  showDeleteConfirm.value = true
}

const deleteTask = () => {
  emit('delete', props.task.id)
  showDeleteConfirm.value = false
}

// Watch for changes to the task prop and reset edit mode
// Also ensure we maintain the task.id in the formData when the task changes
watch(() => props.task, (newTask) => {
  if (newTask) {
    formData.value.id = newTask.id // Ensure ID is updated when task changes
  }
  editMode.value = false
  showDeleteConfirm.value = false
}, { deep: true, immediate: true })
</script>