<!-- src/components/tasks/TaskDetailModal.vue -->
<template>
  <Modal :show="show" @close="$emit('close')" maxWidth="max-w-4xl">
    <div class="space-y-6">
      <!-- Enhanced Header -->
      <div class="flex justify-between items-start border-b pb-4">
        <div class="space-y-1">
          <div class="flex items-center space-x-3">
            <h3 class="text-xl font-semibold text-gray-900">
              {{ formData.name }}
            </h3>
            <Badge :type="task.content_type" />
          </div>
          <div class="flex items-center space-x-2 text-sm text-gray-500">
            <FolderGit2 class="w-4 h-4" />
            <span>{{ task.project.name }}</span>
          </div>
        </div>
        <div class="flex items-center space-x-3">
          <div v-if="task.revisions?.count > 0" class="flex items-center">
            <span 
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
              :class="[task.revisions.excessive ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800']"
            >
              <History class="w-3.5 h-3.5 mr-1" />
              {{ task.revisions.count }} Revision{{ task.revisions.count > 1 ? 's' : '' }}
            </span>
          </div>
          <button
            @click="$emit('close')"
            class="text-gray-400 hover:text-gray-500 transition-colors"
          >
            <X class="w-5 h-5" />
          </button>
        </div>
      </div>

      <!-- Tabs -->
      <div class="border-b">
        <nav class="-mb-px flex space-x-8">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="currentTab = tab.id"
            class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
            :class="[
              currentTab === tab.id
                ? 'border-red-500 text-red-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            {{ tab.name }}
          </button>
        </nav>
      </div>

      <!-- Tab Content -->
      <div v-if="currentTab === 'details'" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left Column - Main Info -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Status Section -->
          <div class="bg-gray-50 p-4 rounded-lg">
            <h4 class="text-sm font-medium text-gray-700 mb-3">Status</h4>
            <select
              v-model="formData.state"
              class="w-full px-3 py-2 bg-white border rounded-lg focus:ring-2 focus:ring-red-500"
              :disabled="!isEditing"
            >
              <option value="draft">Draft</option>
              <option value="in_progress">In Progress</option>
              <option value="review">In Review</option>
              <option value="revision">In Revision</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <!-- Timeline Section -->
          <div class="bg-gray-50 p-4 rounded-lg space-y-4">
            <h4 class="text-sm font-medium text-gray-700">Timeline</h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="text-sm text-gray-600">Start Date</label>
                <div class="flex mt-1 space-x-2">
                  <input
                    v-model="formData.planned_date_start"
                    type="date"
                    class="w-full border rounded-lg focus:ring-2 focus:ring-red-500"
                    :disabled="!isEditing"
                  />
                  <input
                    v-model="formData.planned_time_start"
                    type="time"
                    class="w-24 border rounded-lg focus:ring-2 focus:ring-red-500"
                    :disabled="!isEditing"
                  />
                </div>
              </div>
              
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="text-sm text-gray-600">End Date</label>
                <div class="flex mt-1 space-x-2">
                  <input
                    v-model="formData.planned_date_end"
                    type="date"
                    class="w-full border rounded-lg focus:ring-2 focus:ring-red-500"
                    :disabled="!isEditing"
                  />
                  <input
                    v-model="formData.planned_time_end"
                    type="time"
                    class="w-24 border rounded-lg focus:ring-2 focus:ring-red-500"
                    :disabled="!isEditing"
                  />
                </div>
              </div>
            </div>

            <!-- Progress -->
            <div>
              <div class="flex justify-between items-center mb-2">
                <label class="text-sm text-gray-600">Progress</label>
                <span class="text-sm text-gray-600">{{ formData.progress }}%</span>
              </div>
              <div class="h-2 bg-white rounded-full overflow-hidden">
                <div
                  class="h-full transition-all duration-300"
                  :class="[
                    formData.state === 'revision' ? 'bg-yellow-500' : 'bg-green-500'
                  ]"
                  :style="{ width: `${formData.progress}%` }"
                />
              </div>
              <input
                v-if="isEditing"
                v-model.number="formData.progress"
                type="range"
                min="0"
                max="100"
                step="5"
                class="w-full mt-2"
              />
            </div>
          </div>

          <!-- Description -->
          <div class="bg-gray-50 p-4 rounded-lg">
            <h4 class="text-sm font-medium text-gray 700 mb-3">Description</h4>
            <textarea
              v-model="formData.description"
              rows="3"
              class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
              :disabled="!isEditing"
              placeholder="Task description..."
            ></textarea>
          </div>
        </div>

        <!-- Right Column - Team & Revisions -->
        <div class="space-y-6">
          <!-- Team Section -->
          <div class="bg-gray-50 p-4 rounded-lg">
            <h4 class="text-sm font-medium text-gray-700 mb-3">Team</h4>
            <!-- Assignees -->
            <div class="mb-4">
              <label class="text-sm text-gray-600">Assigned To</label>
              <TeamSelect
                v-if="isEditing"
                v-model="formData.assigned_to"
                :multiple="true"
                :disabled="!isEditing"
                class="mt-2"
              />
              <div v-else class="flex flex-wrap gap-2 mt-2">
                <div
                  v-for="member in task.assigned_to"
                  :key="member.id"
                  class="flex items-center bg-white px-3 py-1.5 rounded-full border"
                >
                  <div class="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center">
                    <span class="text-xs font-medium">{{ getInitials(member.name) }}</span>
                  </div>
                  <span class="ml-2 text-sm">{{ member.name }}</span>
                </div>
              </div>
            </div>

            <!-- Reviewer -->
            <div>
              <label class="text-sm text-gray-600">Reviewer</label>
              <TeamSelect
                v-if="isEditing"
                v-model="formData.reviewer_id"
                :multiple="false"
                :disabled="!isEditing"
                class="mt-2"
              />
              <div 
                v-else-if="task.reviewer" 
                class="flex items-center bg-white px-3 py-1.5 rounded-full mt-2 border"
              >
                <div class="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center">
                  <span class="text-xs font-medium">{{ getInitials(task.reviewer.name) }}</span>
                </div>
                <span class="ml-2 text-sm">{{ task.reviewer.name }}</span>
              </div>
              <span v-else class="text-sm text-gray-500 block mt-2">
                No reviewer assigned
              </span>
            </div>
          </div>

          <!-- Revisions History -->
          <div 
            v-if="task.revisions?.history?.length > 0" 
            class="bg-gray-50 p-4 rounded-lg"
          >
            <div class="flex items-center justify-between mb-3">
              <h4 class="text-sm font-medium text-gray-700">Revision History</h4>
              <span 
                v-if="task.revisions.excessive"
                class="text-xs font-medium text-red-600"
              >
                Excessive Revisions
              </span>
            </div>
            
            <div class="space-y-3">
              <div 
                v-for="revision in task.revisions.history" 
                :key="revision.number"
                class="bg-white rounded-lg p-3 text-sm border"
              >
                <div class="flex justify-between items-start">
                  <div>
                    <span class="font-medium">Revision #{{ revision.number }}</span>
                    <p class="mt-1 text-gray-600">{{ revision.notes }}</p>
                  </div>
                  <div class="text-right">
                    <div class="text-xs text-gray-500">
                      Requested by {{ revision.requested_by }}
                    </div>
                    <div class="text-xs text-gray-400 mt-1">
                      {{ formatDate(revision.date) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          
        </div>
      </div>

      <!-- Activity Log Tab -->
      <div v-else-if="currentTab === 'activity'" class="bg-white rounded-lg">
        <div class="max-h-[600px] overflow-y-auto px-6">
          <ActivityLog type="task" :id="task.id" />
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-end space-x-3 pt-6 border-t">
         <!-- Delete Button -->
        <button
          @click="confirmDelete"
          class="inline-flex items-center px-4 py-2 border border-red-300 rounded-lg shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 transition-colors"
        >
          <Trash2 class="w-4 h-4 mr-2" />
          Delete Task
        </button>
        <div class="flex space-x-3">
          <button
            v-if="!isEditing"
            @click="startEditing"
            class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <Pencil class="w-4 h-4 mr-2" />
            Edit
          </button>
          <template v-else>
            <button
              @click="cancelEditing"
              class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              @click="saveChanges"
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors"
            >
              <Save class="w-4 h-4 mr-2" />
              Save Changes
            </button>
          </template>
        </div>
      </div>
    </div>
    <ConfirmDialog
    v-if="showDeleteConfirm"
    :show="showDeleteConfirm"
    title="Delete Task"
    message="Are you sure you want to delete this task? This action cannot be undone."
    @confirm="handleDelete"
    @cancel="showDeleteConfirm = false"
  />
  </Modal>
</template>

<script setup>
import { ref, watch } from 'vue'
import { Pencil, Save, X, FolderGit2, History, Trash2 } from 'lucide-vue-next'
import Modal from '@/components/projects/ProjectModal.vue'
import Badge from '@/components/Badge.vue'
import TeamSelect from '@/components/TeamSelect.vue'
import ActivityLog from '@/components/shared/ActivityLog.vue' // Add this import
import ConfirmDialog from '@/components/shared/ConfirmDialog.vue'

const props = defineProps({
  show: Boolean,
  task: {
    type: Object,
    required: true
  }
})

// Tambahkan 'delete' ke dalam emit di TaskDetailModal
const emit = defineEmits(['close', 'update', 'delete'])

// Tab Management
const tabs = [
  { id: 'details', name: 'Details' },
  { id: 'activity', name: 'Activity Log' }
]
const currentTab = ref('details')

const isEditing = ref(false)

const formData = ref({
  name: '',
  state: '',
  planned_date_start: '',
  planned_time_start: '',
  planned_date_end: '',
  planned_time_end: '',
  planned_hours: null,
  progress: 0,
  assigned_to: [],
  reviewer_id: null,
  description: ''
})

// Initialize form data when task changes
watch(() => props.task, (newTask) => {
  if (newTask) {
    const [startDate, startTime] = (newTask.dates.planned_start || '').split(' ')
    const [endDate, endTime] = (newTask.dates.planned_end || '').split(' ')
    
    formData.value = {
      name: newTask.name,
      state: newTask.state,
      planned_date_start: startDate || '',
      planned_time_start: startTime?.slice(0, 5) || '09:00',
      planned_date_end: endDate || '',
      planned_time_end: endTime?.slice(0, 5) || '17:00',
      planned_hours: newTask.hours.planned,
      progress: newTask.progress,
      assigned_to: newTask.assigned_to.map(user => user.id),
      reviewer_id: newTask.reviewer?.id || null,
      description: newTask.description || ''
    }
  }
}, { immediate: true })

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getInitials = (name) => {
  if (!name) return ''
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
}

const startEditing = () => {
  isEditing.value = true
}

const cancelEditing = () => {
  isEditing.value = false
  // Reset form data to current task values
  const [startDate, startTime] = (props.task.dates.planned_start || '').split(' ')
  const [endDate, endTime] = (props.task.dates.planned_end || '').split(' ')
  
  formData.value = {
    name: props.task.name,
    state: props.task.state,
    planned_date_start: startDate || '',
    planned_time_start: startTime?.slice(0, 5) || '09:00',
    planned_date_end: endDate || '',
    planned_time_end: endTime?.slice(0, 5) || '17:00',
    planned_hours: props.task.hours.planned,
    progress: props.task.progress,
    assigned_to: props.task.assigned_to.map(user => user.id),
    reviewer_id: props.task.reviewer?.id || null,
    description: props.task.description || ''
  }
}

const formatDateTime = (date, time) => {
  return date && time ? `${date} ${time}:00` : null
}

const saveChanges = () => {
  const submitData = {
    task_id: props.task.id,
    name: formData.value.name.trim(),
    state: formData.value.state,
    planned_date_start: formatDateTime(formData.value.planned_date_start, formData.value.planned_time_start),
    planned_date_end: formatDateTime(formData.value.planned_date_end, formData.value.planned_time_end),
    planned_hours: formData.value.planned_hours,
    progress: formData.value.progress,
    assigned_to: formData.value.assigned_to,
    reviewer_id: formData.value.reviewer_id,
    description: formData.value.description?.trim() || null
  }

  emit('update', submitData)
  isEditing.value = false
}

// Delete handling
const showDeleteConfirm = ref(false)

const confirmDelete = () => {
  showDeleteConfirm.value = true
}

const handleDelete = () => {
  emit('delete', props.task.id)
}
</script>