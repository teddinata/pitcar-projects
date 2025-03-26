<!-- src/components/team/TeamTaskDetailModal.vue -->
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
        class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-5xl sm:w-full"
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
              class="p-2 text-red-600 hover:text-red-800 rounded-full hover:bg-gray-100"
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
          <Loader2 class="w-8 h-8 animate-spin text-red-600" />
        </div>
        
        <!-- Edit form -->
        <div v-else-if="editMode" class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="space-y-4">
            <div>
              <label for="edit-name" class="block text-sm font-medium text-gray-700">Task Name</label>
              <input 
                id="edit-name"
                v-model="editForm.name" 
                type="text"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm" 
              />
            </div>
            
            <div>
              <label for="edit-type" class="block text-sm font-medium text-gray-700">Task Type</label>
              <select 
                id="edit-type"
                v-model="editForm.type_id" 
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
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
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
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
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
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
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm" 
                />
              </div>
              
              <div>
                <label for="edit-end-date" class="block text-sm font-medium text-gray-700">Planned End Date</label>
                <input 
                  id="edit-end-date"
                  v-model="editForm.planned_date_end" 
                  type="datetime-local"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm" 
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
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm" 
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
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
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
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
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
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm" 
              ></textarea>
            </div>
          </div>
        </div>
        
        <!-- View mode content - Two Column Layout -->
        <div v-else class="px-6 py-4 max-h-[80vh] overflow-y-auto custom-scrollbar">
          <!-- Task header -->
          <div class="mb-6">
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
          
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Left Column: Task Information -->
            <div class="space-y-5">
              <!-- Project info -->
              <div v-if="task.project" class="bg-gray-50 rounded-lg p-5 border border-gray-100">
                <h4 class="text-sm font-medium text-gray-700 flex items-center">
                  <Briefcase class="w-4 h-4 mr-1.5 text-red-500" />
                  Project
                </h4>
                <p class="mt-1 text-sm text-gray-900">{{ task.project.name }}</p>
              </div>
              
              <!-- Attachments -->
              <div class="bg-gray-50 rounded-lg p-5 border border-gray-100">
                <div class="flex items-center justify-between mb-3">
                  <h4 class="text-sm font-medium text-gray-700 flex items-center">
                    <Paperclip class="w-4 h-4 mr-1.5 text-red-500" />
                    Attachments
                  </h4>
                  <button
                    @click="handleAttachmentUpload"
                    class="inline-flex items-center px-2 py-1 border border-transparent rounded-md text-xs font-medium text-white bg-gradient-to-r from-red-500 to-red-600 focus:outline-none"
                  >
                    <UploadCloud class="w-3 h-3 mr-1" />
                    Upload
                  </button>
                </div>
                
                <!-- Loading state -->
                <div v-if="loadingAttachments" class="flex justify-center py-4">
                  <div class="animate-spin rounded-full h-4 w-4 border-2 border-red-600 border-t-transparent"></div>
                </div>
                
                <!-- Empty state -->
                <div v-else-if="!taskAttachments.length" class="text-center py-2">
                  <p class="text-xs text-gray-500 italic">No files attached</p>
                </div>
                
                <!-- Attachment List -->
                <div v-else class="space-y-2 max-h-[150px] overflow-y-auto pr-2 custom-scrollbar">
                  <div
                    v-for="file in taskAttachments" 
                    :key="file.id"
                    class="flex items-center justify-between p-2 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition"
                  >
                    <!-- File icon and details -->
                    <div class="flex items-center">
                      <!-- Icon based on file type -->
                      <div class="flex-shrink-0 mr-2 p-1.5 rounded-lg" :class="getFileIconClass(file.mimetype)">
                        <FileText v-if="!file.is_image" class="h-3.5 w-3.5" :class="getFileIconColor(file.mimetype)" />
                        <Image v-else class="h-3.5 w-3.5 text-blue-500" />
                      </div>
                      
                      <!-- File details -->
                      <div>
                        <div class="text-xs font-medium text-gray-900 truncate max-w-[180px]">{{ file.name }}</div>
                        <div class="text-xs text-gray-500">{{ formatFileSize(file.size) }}</div>
                      </div>
                    </div>
                    
                    <!-- Action buttons -->
                    <div class="flex space-x-1">
                      <!-- Preview button -->
                      <button
                        v-if="canPreviewFile(file)"
                        @click="openFilePreview(file)"
                        class="p-1 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                        title="Delete"
                      >
                        <Trash2 class="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Timeline -->
              <div class="bg-gray-50 rounded-lg p-5 border border-gray-100">
                <h4 class="text-sm font-medium text-gray-700 mb-3 flex items-center">
                  <Calendar class="w-4 h-4 mr-1.5 text-red-500" />
                  Timeline
                </h4>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <div class="text-xs text-gray-500 mb-1">Start Date</div>
                    <div class="text-sm font-medium">
                      {{ formatDateWithTime(task.dates?.planned_start) || 'Not set' }}
                    </div>
                  </div>
                  <div>
                    <div class="text-xs text-gray-500 mb-1">Due Date</div>
                    <div 
                      class="text-sm font-medium"
                      :class="{'text-red-600': isOverdue(task.dates?.planned_end)}"
                    >
                      {{ formatDateWithTime(task.dates?.planned_end) || 'Not set' }}
                      <span v-if="isOverdue(task.dates?.planned_end)" class="text-xs ml-1.5 font-normal text-red-500">(Overdue)</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Progress -->
              <div class="bg-gray-50 rounded-lg p-5 border border-gray-100">
                <h4 class="text-sm font-medium text-gray-700 mb-3 flex items-center">
                  <Activity class="w-4 h-4 mr-1.5 text-red-500" />
                  Progress
                </h4>
                <div class="mb-2 flex justify-between items-center">
                  <div class="text-sm font-medium">Completion: {{ task.progress }}%</div>
                  <div class="text-xs text-gray-500">
                    {{ task.hours?.actual || 0 }}/{{ task.hours?.planned || 0 }} hours
                  </div>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    class="h-2.5 rounded-full transition-all duration-300"
                    :class="{
                      'bg-red-500': task.progress < 30,
                      'bg-orange-500': task.progress >= 30 && task.progress < 70,
                      'bg-green-500': task.progress >= 70
                    }"
                    :style="{ width: `${task.progress}%` }"
                  ></div>
                </div>
              </div>
              
              <!-- Assigned Team Members -->
              <div class="bg-gray-50 rounded-lg p-5 border border-gray-100">
                <h4 class="text-sm font-medium text-gray-700 mb-3 flex items-center">
                  <Users class="w-4 h-4 mr-1.5 text-red-500" />
                  Assigned Team Members
                </h4>
                <div class="space-y-2">
                  <div v-for="person in task.assigned_to" :key="person.id" class="flex items-center">
                    <div class="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                      <span class="text-sm font-medium text-red-600">
                        {{ getInitials(person.name) }}
                      </span>
                    </div>
                    <span class="ml-3 text-sm">{{ person.name }}</span>
                  </div>
                  <div v-if="!task.assigned_to || task.assigned_to.length === 0" class="text-sm text-gray-500 italic">
                    No team members assigned
                  </div>
                </div>
              </div>
              
              <!-- Description -->
              <div class="bg-gray-50 rounded-lg p-5 border border-gray-100">
                <h4 class="text-sm font-medium text-gray-700 mb-3 flex items-center">
                  <AlignLeft class="w-4 h-4 mr-1.5 text-red-500" />
                  Description
                </h4>
                <div class="prose prose-sm max-w-none text-gray-700">
                  <p class="whitespace-pre-line">{{ task.description || 'No description provided' }}</p>
                </div>
              </div>
            </div>
            
            <!-- Right Column: Checklist & Timesheet side by side -->
            <div class="space-y-5">
              <!-- Checklist Section -->
              <div class="bg-gray-50 rounded-lg p-5 border border-gray-100">
                <div class="flex items-center justify-between mb-3">
                  <h4 class="text-sm font-medium text-gray-700 flex items-center">
                    <CheckSquare class="w-4 h-4 mr-1.5 text-red-500" />
                    Checklist
                  </h4>
                  <div class="text-xs text-gray-600">
                    {{ task.checklist_progress || 0 }}% Complete
                  </div>
                </div>
                
                <div class="mb-3 w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    class="bg-green-500 h-1.5 rounded-full" 
                    :style="{ width: `${task.checklist_progress || 0}%` }"
                  ></div>
                </div>
                
                <!-- Checklist placeholder or integration with TeamTaskChecklistManager -->
                <div v-if="task.checklist && task.checklist.length > 0">
                  <div v-for="(item, index) in task.checklist" :key="index" class="flex items-start py-2">
                    <input 
                      type="checkbox" 
                      :checked="item.completed" 
                      @change="updateChecklistItem(index, !item.completed)" 
                      class="mt-1 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                    />
                    <div class="ml-3">
                      <p class="text-sm" :class="{'line-through text-gray-400': item.completed}">
                        {{ item.name }}
                      </p>
                      <p v-if="item.assignee" class="text-xs text-gray-500">
                        Assigned to: {{ item.assignee.name }}
                      </p>
                    </div>
                  </div>
                </div>
                <div v-else class="text-sm text-gray-500 italic text-center py-2">
                  No checklist items
                </div>
              </div>
              
              <!-- Timesheet Section -->
              <div class="bg-gray-50 rounded-lg p-5 border border-gray-100">
                <div class="flex items-center justify-between mb-3">
                  <h4 class="text-sm font-medium text-gray-700 flex items-center">
                    <Clock class="w-4 h-4 mr-1.5 text-red-500" />
                    Time Tracking
                  </h4>
                  <button
                    @click="addTimeEntry"
                    class="inline-flex items-center px-2 py-1 border border-transparent rounded-md text-xs font-medium text-white bg-gradient-to-r from-red-500 to-red-600 focus:outline-none"
                  >
                    <PlusCircle class="w-3 h-3 mr-1" />
                    Add Time
                  </button>
                </div>
                
                <!-- Time entries placeholder or integration with TeamTaskTimesheetManager -->
                <div v-if="task.time_entries && task.time_entries.length > 0">
                  <div v-for="(entry, index) in task.time_entries" :key="index" class="border-b border-gray-200 py-2 last:border-0">
                    <div class="flex justify-between">
                      <span class="text-sm font-medium">{{ entry.user.name }}</span>
                      <span class="text-sm text-gray-500">{{ entry.hours }} hours</span>
                    </div>
                    <div class="flex justify-between mt-1">
                      <span class="text-xs text-gray-500">{{ formatDateOnly(entry.date) }}</span>
                      <span class="text-xs" :class="{'text-green-600': entry.approved, 'text-gray-500': !entry.approved}">
                        {{ entry.approved ? 'Approved' : 'Pending' }}
                      </span>
                    </div>
                  </div>
                </div>
                <div v-else class="text-sm text-gray-500 italic text-center py-2">
                  No time entries recorded
                </div>
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
              class="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm"
            >
              Cancel
            </button>
            
            <button 
              @click="saveChanges" 
              class="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm"
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
                  class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
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
import { format, isPast, parseISO } from 'date-fns'
import { Edit2, X, AlertCircle, Loader2, Briefcase, Paperclip, 
  UploadCloud, FileText, Image, Eye, Download, Trash2, Calendar, 
  Activity, Users, AlignLeft, CheckSquare, Clock, PlusCircle } from 'lucide-vue-next'
import apiClient from '@/config/api'

const props = defineProps({
  show: Boolean,
  task: Object,
})

const emit = defineEmits(['close', 'update', 'delete', 'upload-attachment'])

// State
const editMode = ref(false)
const loading = ref(false)
const showDeleteConfirm = ref(false)
const taskTypes = ref([])
const employees = ref([])
const loadingAttachments = ref(false)
const taskAttachments = ref([])
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

const fetchTaskAttachments = async () => {
  if (!props.task?.id) return
  
  try {
    loadingAttachments.value = true
    
    const response = await apiClient.post('/web/v2/team/task-attachments', {
      jsonrpc: '2.0',
      id: new Date().getTime(),
      params: {
        task_id: props.task.id
      }
    })
    
    if (response.data.result?.status === 'success') {
      taskAttachments.value = response.data.result.data || []
    }
  } catch (error) {
    console.error('Error fetching task attachments:', error)
  } finally {
    loadingAttachments.value = false
  }
}

// Attachment handling methods
const handleAttachmentUpload = () => {
  emit('upload-attachment', props.task.id)
}

const downloadFile = (file) => {
  // Implementation depends on your API and file storage setup
  window.open(file.url, '_blank')
}

const deleteFile = async (file) => {
  try {
    await apiClient.post('/web/v2/team/delete-attachment', {
      jsonrpc: '2.0',
      id: new Date().getTime(),
      params: {
        attachment_id: file.id
      }
    })
    
    // Refresh attachments list
    fetchTaskAttachments()
  } catch (error) {
    console.error('Error deleting file:', error)
  }
}

const openFilePreview = (file) => {
  // Implementation depends on your preview functionality
  window.open(file.url, '_blank')
}

const canPreviewFile = (file) => {
  // Determine if file is previewable based on mimetype
  const previewableTypes = ['image/', 'application/pdf', 'text/']
  return previewableTypes.some(type => file.mimetype.startsWith(type))
}

// Checklist methods
const updateChecklistItem = async (index, completed) => {
  // Implementation depends on your backend API
  try {
    const checklist = [...props.task.checklist]
    checklist[index].completed = completed
    
    await apiClient.post('/web/v2/team/update-task-checklist', {
      jsonrpc: '2.0',
      id: new Date().getTime(),
      params: {
        task_id: props.task.id,
        checklist_items: checklist
      }
    })
    
    // Update the task locally
    props.task.checklist = checklist
    
    // Update checklist progress
    const totalItems = checklist.length
    const completedItems = checklist.filter(item => item.completed).length
    props.task.checklist_progress = Math.round((completedItems / totalItems) * 100)
  } catch (error) {
    console.error('Error updating checklist item:', error)
  }
}

// Time tracking methods
const addTimeEntry = () => {
  // Implementation depends on your time tracking UI
  // Could emit an event to open a time entry form
  console.log('Add time entry for task', props.task.id)
}

// Helper functions for file handling
const getFileIconClass = (mimetype) => {
  if (mimetype.startsWith('image/')) return 'bg-blue-50'
  if (mimetype.startsWith('application/pdf')) return 'bg-red-50'
  if (mimetype.startsWith('text/')) return 'bg-green-50'
  if (mimetype.startsWith('application/msword') || 
      mimetype.includes('document')) return 'bg-blue-50'
  if (mimetype.includes('spreadsheet') || 
      mimetype.includes('excel')) return 'bg-green-50'
  if (mimetype.includes('presentation') || 
      mimetype.includes('powerpoint')) return 'bg-orange-50'
  return 'bg-gray-50'
}

const getFileIconColor = (mimetype) => {
  if (mimetype.startsWith('image/')) return 'text-blue-500'
  if (mimetype.startsWith('application/pdf')) return 'text-red-500'
  if (mimetype.startsWith('text/')) return 'text-green-500'
  if (mimetype.startsWith('application/msword') || 
      mimetype.includes('document')) return 'text-blue-500'
  if (mimetype.includes('spreadsheet') || 
      mimetype.includes('excel')) return 'text-green-500'
  if (mimetype.includes('presentation') || 
      mimetype.includes('powerpoint')) return 'text-orange-500'
  return 'text-gray-500'
}

const formatFileSize = (bytes) => {
  if (bytes < 1024) return bytes + ' B'
  else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB'
  else if (bytes < 1073741824) return (bytes / 1048576).toFixed(1) + ' MB'
  else return (bytes / 1073741824).toFixed(1) + ' GB'
}

const getInitials = (name) => {
  if (!name) return ''
  return name.split(' ')
    .map(part => part.charAt(0))
    .join('')
    .substring(0, 2)
    .toUpperCase()
}

const isOverdue = (dateString) => {
  if (!dateString) return false
  try {
    return isPast(parseISO(dateString))
  } catch (error) {
    return false
  }
}

const formatDateOnly = (dateString) => {
  if (!dateString) return ''
  try {
    const date = new Date(dateString)
    return format(date, 'dd MMM yyyy')
  } catch (error) {
    return dateString
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
  if (newTask) {
    if (editMode.value) {
      // If in edit mode and task changes, update the form
      enableEditMode()
    }
    
    // Fetch attachments when task changes
    fetchTaskAttachments()
  }
}, { immediate: true })

// Load data when component mounts
onMounted(() => {
  fetchTaskTypes()
  fetchEmployees()
  if (props.task?.id) {
    fetchTaskAttachments()
  }
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
</style>