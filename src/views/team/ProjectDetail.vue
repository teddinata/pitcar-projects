<!-- src/views/dashboard/TeamProjectDetail.vue -->
<template>
  <div class="min-h-screen bg-gray-50">
    <Toast
      v-model:show="toast.show"
      :message="toast.message"
      :type="toast.type"
      :duration="toast.duration"
    />

    <!-- Header -->
    <div class="bg-white shadow">
      <div class="w-full max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
          <div class="flex items-center space-x-3">
            <button @click="router.back()" class="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft class="w-5 h-5 text-gray-500" />
            </button>
            <div>
              <h1 class="text-xl sm:text-2xl font-semibold text-gray-900">{{ project?.name }}</h1>
              <p class="text-sm text-gray-500">{{ project?.code }}</p>
            </div>
          </div>

          <div class="flex items-center space-x-3">
            <div
              class="px-3 py-1 text-sm font-semibold rounded-full"
              :class="{
                'bg-yellow-100 text-yellow-800': project?.state === 'in_progress',
                'bg-green-100 text-green-800': project?.state === 'completed',
                'bg-gray-100 text-gray-800': project?.state === 'draft',
                'bg-purple-100 text-purple-800': project?.state === 'planning',
                'bg-orange-100 text-orange-800': project?.state === 'on_hold',
                'bg-red-100 text-red-800': project?.state === 'cancelled'
              }"
            >
              {{ formatState(project?.state) }}
            </div>
            <button
              @click="showEditModal = true"
              class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Pencil class="w-4 h-4 mr-2" />
              Edit Project
            </button>
            <button
              @click="confirmDelete"
              class="inline-flex items-center px-4 py-2 border border-red-300 rounded-lg shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50"
            >
              <Trash2 class="w-4 h-4 mr-2" />
              Delete Project
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <main class="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left Column -->
        <div class="lg:col-span-1 space-y-6">
          <!-- Project Progress -->
          <div class="bg-white rounded-xl shadow-sm p-6">
            <h2 class="text-lg font-medium text-gray-900 mb-4">Progress Overview</h2>
            <div class="space-y-4">
              <div>
                <div class="flex justify-between mb-2">
                  <span class="text-gray-600">Overall Progress</span>
                  <span class="font-medium">{{ project?.progress }}%</span>
                </div>
                <div class="w-full bg-gray-100 rounded-full h-2.5">
                  <div
                    class="h-2.5 rounded-full bg-gradient-to-r from-red-500 to-red-600"
                    :style="{ width: `${project?.progress}%` }"
                  ></div>
                </div>
              </div>

              <!-- Task Completion Stats -->
              <div class="grid grid-cols-2 gap-4">
                <div class="bg-gray-50 rounded-lg p-4">
                  <div class="flex items-center space-x-2 text-gray-600 mb-2">
                    <CheckSquare class="w-4 h-4" />
                    <span>Tasks Completed</span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-600">Progress</span>
                    <span class="font-medium">
                      {{ completedTasks }}/{{ totalTasks }}
                    </span>
                  </div>
                </div>
                <div class="bg-gray-50 rounded-lg p-4">
                  <div class="flex items-center space-x-2 text-gray-600 mb-2">
                    <Clock class="w-4 h-4" />
                    <span>Time Tracked</span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-600">Hours</span>
                    <span class="font-medium">
                      {{ project?.actual_hours || 0 }}/{{ project?.planned_hours || 0 }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Tasks Section -->
          <div class="bg-white rounded-xl shadow-sm p-6">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-lg font-medium text-gray-900">Tasks</h2>
              <button
                @click="showCreateTaskModal = true"
                class="inline-flex items-center px-3 py-1.5 border border-transparent rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700"
              >
                <Plus class="w-4 h-4 mr-1.5" />
                Add Task
              </button>
            </div>

            <div class="space-y-4">
              <div
                v-for="task in project?.tasks"
                :key="task.id"
                class="border rounded-lg p-4 hover:shadow-sm transition-shadow"
              >
                <div class="flex items-start justify-between">
                  <div>
                    <h3 class="font-medium text-gray-900">{{ task.name }}</h3>
                    <div class="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                      <span>{{ task.type?.name || 'General' }}</span>
                      <span>{{ formatDate(task.dates?.planned_end) }}</span>
                    </div>
                  </div>
                  <div
                    class="px-2.5 py-1 text-xs font-medium rounded-full"
                    :class="{
                      'bg-yellow-100 text-yellow-800': task.state === 'in_progress',
                      'bg-green-100 text-green-800': task.state === 'done',
                      'bg-gray-100 text-gray-800': task.state === 'draft',
                      'bg-purple-100 text-purple-800': task.state === 'planned',
                      'bg-blue-100 text-blue-800': task.state === 'review'
                    }"
                  >
                    {{ formatState(task.state) }}
                  </div>
                </div>

                <!-- Assigned To -->
                <div class="mt-3 flex flex-wrap gap-2">
                  <div v-for="person in task.assigned_to" :key="person.id"
                       class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {{ person.name }}
                  </div>
                </div>

                <!-- Task Progress -->
                <div class="mt-3">
                  <div class="flex justify-between text-sm mb-1">
                    <span class="text-gray-600">Progress</span>
                    <span>{{ task.progress }}%</span>
                  </div>
                  <div class="w-full bg-gray-100 rounded-full h-1.5">
                    <div
                      class="h-1.5 rounded-full bg-red-500"
                      :style="{ width: `${task.progress}%` }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Center Column -->
        <div class="lg:col-span-1 space-y-6">
          <!-- Project Info -->
          <div class="bg-white rounded-xl shadow-sm p-6">
            <h2 class="text-lg font-medium text-gray-900 mb-4">Project Info</h2>
            <div class="space-y-4">
              <!-- Department -->
              <div>
                <h3 class="text-sm font-medium text-gray-700 mb-2">Department</h3>
                <div class="bg-gray-50 rounded-lg p-4">
                  <div class="text-sm font-medium">{{ project?.department?.name }}</div>
                </div>
              </div>
              
              <!-- Timeline -->
              <div>
                <h3 class="text-sm font-medium text-gray-700 mb-2">Timeline</h3>
                <div class="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-600">Start Date</span>
                    <span class="font-medium">{{ formatDate(project?.dates?.start) }}</span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-600">End Date</span>
                    <span
                      class="font-medium"
                      :class="{
                        'text-red-600': isOverdue(project?.dates?.end),
                        'text-green-600': !isOverdue(project?.dates?.end)
                      }"
                    >
                      {{ formatDate(project?.dates?.end) }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Team -->
              <div>
                <h3 class="text-sm font-medium text-gray-700 mb-2">Team</h3>
                <div class="bg-gray-50 rounded-lg p-4 space-y-4">
                  <!-- Project Manager -->
                  <div>
                    <span class="text-sm text-gray-600">Project Manager</span>
                    <div class="mt-2 flex items-center">
                      <div class="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                        <span class="text-sm font-medium text-red-600">
                          {{ getInitials(project?.team?.manager?.name) }}
                        </span>
                      </div>
                      <span class="ml-3 text-sm font-medium">
                        {{ project?.team?.manager?.name }}
                      </span>
                    </div>
                  </div>

                  <!-- Team Members -->
                  <div>
                    <span class="text-sm text-gray-600">Team Members</span>
                    <div class="mt-2 space-y-2">
                      <div
                        v-for="member in project?.team?.members"
                        :key="member.id"
                        class="flex items-center"
                      >
                        <div class="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                          <span class="text-sm font-medium text-gray-600">
                            {{ getInitials(member.name) }}
                          </span>
                        </div>
                        <span class="ml-3 text-sm">{{ member.name }}</span>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Stakeholders -->
                  <div v-if="project?.stakeholders && project.stakeholders.length > 0">
                    <span class="text-sm text-gray-600">Stakeholders</span>
                    <div class="mt-2 space-y-2">
                      <div
                        v-for="stakeholder in project.stakeholders"
                        :key="stakeholder.id"
                        class="flex items-center"
                      >
                        <div class="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <span class="text-sm font-medium text-blue-600">
                            {{ getInitials(stakeholder.name) }}
                          </span>
                        </div>
                        <span class="ml-3 text-sm">{{ stakeholder.name }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- BAU Activities -->
          <div class="bg-white rounded-xl shadow-sm p-6">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-lg font-medium text-gray-900">BAU Activities</h2>
              <button
                @click="showCreateBAUModal = true"
                class="inline-flex items-center px-2.5 py-1.5 border border-transparent rounded-md text-xs font-medium text-white bg-red-600 hover:bg-red-700"
              >
                <Plus class="w-3 h-3 mr-1" />
                Add Activity
              </button>
            </div>
            
            <div class="space-y-3 max-h-64 overflow-y-auto">
              <div
                v-for="activity in project?.bau_activities"
                :key="activity.id"
                class="bg-gray-50 rounded-lg p-3"
              >
                <div class="flex justify-between">
                  <div class="font-medium text-sm">{{ activity.name }}</div>
                  <div class="text-xs font-medium rounded-full px-2 py-0.5"
                    :class="{
                      'bg-green-100 text-green-800': activity.state === 'done',
                      'bg-gray-100 text-gray-800': activity.state === 'planned',
                      'bg-red-100 text-red-800': activity.state === 'not_done'
                    }"
                  >
                    {{ formatBAUState(activity.state) }}
                  </div>
                </div>
                <div class="text-xs text-gray-500 mt-1 flex justify-between">
                  <span>{{ formatDate(activity.date) }}</span>
                  <span>{{ activity.hours_spent }} hours</span>
                </div>
              </div>
              
              <div v-if="!project?.bau_activities || project.bau_activities.length === 0" class="text-center py-4">
                <p class="text-sm text-gray-500">No BAU activities recorded</p>
              </div>
            </div>
          </div>
        </div>

        <div class="lg:col-span-1 space-y-6">
          <!-- Project Group Chat -->
          <div class="bg-white rounded-xl shadow-sm overflow-hidden h-[600px] flex flex-col">
            <div class="p-6 border-b">
              <h2 class="text-lg font-medium text-gray-900">Team Chat</h2>
            </div>
            <div class="flex-1 flex flex-col overflow-hidden">
              <div class="flex-1 overflow-y-auto p-6">
                <div v-if="project?.group_id" class="space-y-4">
                  <div v-for="message in groupMessages" :key="message.id" class="flex gap-3">
                    <div class="h-8 w-8 rounded-full bg-gray-100 flex-shrink-0 flex items-center justify-center">
                      <span class="text-sm font-medium text-gray-600">
                        {{ getInitials(message.author?.name) }}
                      </span>
                    </div>
                    <div class="flex-1">
                      <div class="flex items-baseline">
                        <span class="text-sm font-medium text-gray-900">{{ message.author?.name }}</span>
                        <span class="ml-2 text-xs text-gray-500">{{ formatDateTime(message.date) }}</span>
                      </div>
                      <div class="mt-1 text-sm text-gray-700" v-html="formatMessageContent(message.content)"></div>
                    </div>
                  </div>
                  
                  <div v-if="loadingMessages" class="flex justify-center my-4">
                    <div class="animate-spin rounded-full h-6 w-6 border-2 border-red-600 border-t-transparent"></div>
                  </div>
                  
                  <div v-if="groupMessages.length === 0 && !loadingMessages" class="text-center py-4">
                    <MessageSquare class="mx-auto h-8 w-8 text-gray-300" />
                    <p class="mt-1 text-sm text-gray-500">No messages yet</p>
                  </div>
                </div>
                <div v-else class="text-center py-4">
                  <MessageSquare class="mx-auto h-8 w-8 text-gray-300" />
                  <p class="mt-1 text-sm text-gray-500">No group created for this project</p>
                </div>
              </div>
              
              <!-- Message Input -->
              <div v-if="project?.group_id" class="p-4 border-t bg-white">
                <div class="flex items-end">
                  <div class="flex-grow">
                    <TeamMentionInput 
                      ref="mentionInputRef"
                      v-model="newMessage" 
                      :members="allProjectMembers"
                      placeholder="Type a message... (use @ to mention)"
                      @submit="sendMessage"
                    />
                  </div>
                  <button 
                    @click="sendMessage" 
                    class="ml-3 inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 self-end"
                    :disabled="!newMessage.trim()"
                  >
                    <Send class="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Meetings Section -->
          <div class="bg-white rounded-xl shadow-sm p-6">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-lg font-medium text-gray-900">Meetings</h2>
              <button
                @click="showCreateMeetingModal = true"
                class="inline-flex items-center px-3 py-1.5 border border-transparent rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700"
              >
                <Plus class="w-4 h-4 mr-1.5" />
                Schedule Meeting
              </button>
            </div>

            <div class="space-y-4 max-h-[300px] overflow-y-auto">
              <div
                v-for="meeting in project?.meetings"
                :key="meeting.id"
                class="border rounded-lg p-4 hover:shadow-sm transition-shadow"
              >
                <div class="flex items-start justify-between">
                  <div>
                    <h3 class="font-medium text-gray-900">{{ meeting.name }}</h3>
                    <div class="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                      <span>
                        {{ formatDateTime(meeting.dates?.start) }} - {{ formatTime(meeting.dates?.end) }}
                      </span>
                    </div>
                  </div>
                  <div
                    class="px-2.5 py-1 text-xs font-medium rounded-full"
                    :class="{
                      'bg-yellow-100 text-yellow-800': meeting.state === 'in_progress',
                      'bg-green-100 text-green-800': meeting.state === 'done',
                      'bg-gray-100 text-gray-800': meeting.state === 'planned',
                      'bg-red-100 text-red-800': meeting.state === 'cancelled'
                    }"
                  >
                    {{ formatState(meeting.state) }}
                  </div>
                </div>
                
                <div class="mt-2 text-sm text-gray-600">
                  <div class="flex items-center space-x-2">
                    <User class="w-4 h-4" />
                    <span>Organizer: {{ meeting.organizer?.name }}</span>
                  </div>
                  <div v-if="meeting.location" class="flex items-center space-x-2 mt-1">
                    <MapPin class="w-4 h-4" />
                    <span>{{ meeting.location }}</span>
                  </div>
                  <div v-if="meeting.virtual_location" class="flex items-center space-x-2 mt-1">
                    <Video class="w-4 h-4" />
                    <span>{{ meeting.virtual_location }}</span>
                  </div>
                </div>
              </div>

              <div v-if="!project?.meetings || project.meetings.length === 0" class="text-center py-6">
                <CalendarIcon class="mx-auto h-8 w-8 text-gray-300" />
                <p class="mt-1 text-sm text-gray-500">No meetings scheduled yet</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <Teleport to="body">
      <!-- Edit Project Modal -->
      <TeamProjectFormModal
        v-if="showEditModal"
        :show="showEditModal"
        :project="project"
        :departments="departments"
        @close="showEditModal = false"
        @submit="handleProjectUpdate"
      />

      <!-- Create Task Modal -->
      <TeamTaskFormModal
        v-if="showCreateTaskModal"
        :show="showCreateTaskModal"
        :project-id="projectId"
        @close="showCreateTaskModal = false"
        @submit="handleTaskCreate"
      />
      
      <!-- Create Meeting Modal -->
      <TeamMeetingFormModal
        v-if="showCreateMeetingModal"
        :show="showCreateMeetingModal"
        :project-id="projectId"
        @close="showCreateMeetingModal = false"
        @submit="handleMeetingCreate"
      />
      
      <!-- Create BAU Activity Modal -->
      <TeamBAUFormModal
        v-if="showCreateBAUModal"
        :show="showCreateBAUModal"
        :project-id="projectId"
        @close="showCreateBAUModal = false"
        @submit="handleBAUCreate"
      />

      <!-- Delete Confirmation Dialog -->
      <dialog v-if="showDeleteConfirm" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center" open>
        <div class="bg-white rounded-lg p-6 max-w-md w-full">
          <h3 class="text-lg font-medium text-gray-900">Delete Project</h3>
          <p class="mt-2 text-sm text-gray-500">
            Are you sure you want to delete "{{ project?.name }}"?
            <span v-if="project?.tasks?.length > 0" class="block text-red-600 mt-1">
              This project has {{ project?.tasks.length }} task(s). Deleting it will also remove all associated tasks.
            </span>
          </p>
          <div class="mt-4 flex justify-end space-x-3">
            <button
              @click="showDeleteConfirm = false"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              @click="handleDelete()"
              class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </dialog>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick  } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { format, isPast } from 'date-fns'
import { 
  ArrowLeft, 
  Pencil, 
  Plus, 
  Video, 
  Trash2, 
  User, 
  Users, 
  MessageSquare,
  Send,
  MapPin,
  CheckSquare,
  Clock
} from 'lucide-vue-next'
import { CalendarIcon } from '@heroicons/vue/24/outline'
import { useToast } from '@/composables/useToast'
import apiClient from '@/config/api'
import TeamMentionInput from '@/components/team/TeamMentionInput.vue'

import TeamProjectFormModal from '@/components/team/TeamProjectFormModal.vue'
import TeamTaskFormModal from '@/components/team/TeamTaskFormModal.vue'
import TeamMeetingFormModal from '@/components/team/TeamMeetingFormModal.vue'
import TeamBAUFormModal from '@/components/team/TeamBAUFormModal.vue'
import Toast from '@/components/Toast.vue'

const route = useRoute()
const router = useRouter()
const { toast, showToast } = useToast()

const projectId = computed(() => Number(route.params.id))
const project = ref(null)
const departments = ref([])
const groupMessages = ref([])
const newMessage = ref('')
const loadingMessages = ref(false)
const mentionInputRef = ref(null)

const showEditModal = ref(false)
const showCreateTaskModal = ref(false)
const showCreateMeetingModal = ref(false)
const showCreateBAUModal = ref(false)
const showDeleteConfirm = ref(false)

// Computed
const totalTasks = computed(() => {
  return project.value?.tasks?.length || 0
})

const completedTasks = computed(() => {
  return project.value?.tasks?.filter(t => t.state === 'done').length || 0
})

// Methods
const fetchProjectDetail = async () => {
  try {
    const response = await apiClient.post(`/web/v2/team/projects`, {
      jsonrpc: '2.0',
      id: new Date().getTime(),
      params: {
        operation: 'read',
        project_id: projectId.value
      }
    })

    if (response.data.result?.status === 'success') {
      project.value = response.data.result.data
      showToast({
        message: 'Project details loaded successfully',
        type: 'success'
      })
      
      // If there's a group, fetch messages
      if (project.value.group_id) {
        fetchGroupMessages(project.value.group_id)
      }
    } else {
      throw new Error(response.data.result?.message || 'Failed to fetch project details')
    }
  } catch (error) {
    console.error('Error fetching project:', error)
    showToast({
      message: error.message || 'Failed to load project details',
      type: 'error'
    })
  }
}

const fetchDepartments = async () => {
  try {
    const response = await apiClient.post('/web/dataset/call_kw', {
      jsonrpc: '2.0',
      method: 'call',
      params: {
        model: 'hr.department',
        method: 'search_read',
        args: [[]],
        kwargs: {
          fields: ['id', 'name']
        }
      }
    })

    if (response.data.result) {
      departments.value = response.data.result
    }
  } catch (error) {
    console.error('Error fetching departments:', error)
  }
}

const fetchGroupMessages = async (groupId) => {
  try {
    loadingMessages.value = true
    const response = await apiClient.post('/web/v2/team/messages', {
      jsonrpc: '2.0',
      id: new Date().getTime(),
      params: {
        group_id: groupId
      }
    })

    if (response.data.result?.status === 'success') {
      groupMessages.value = response.data.result.data
    } else {
      throw new Error(response.data.result?.message || 'Failed to fetch messages')
    }
  } catch (error) {
    console.error('Error fetching messages:', error)
    showToast({
      message: error.message || 'Failed to load messages',
      type: 'error'
    })
  } finally {
    loadingMessages.value = false
  }
}

// Update fungsi sendMessage
const sendMessage = async () => {
  if (!newMessage.value.trim() || !project.value?.group_id) return
  
  try {
    // Ekstrak mentions dari pesan dengan format @[id:name]
    const mentions = mentionInputRef.value ? mentionInputRef.value.extractMentions(newMessage.value) : []
    const mentionIds = mentions.map(m => m.id)
    
    const response = await apiClient.post('/web/v2/team/chat/send', {
      jsonrpc: '2.0',
      id: new Date().getTime(),
      params: {
        group_id: project.value.group_id,
        content: newMessage.value,
        message_type: 'regular',
        project_id: projectId.value,
        mentions: mentionIds.length > 0 ? mentionIds : undefined
      }
    })

    if (response.data.result?.status === 'success') {
      // Add the new message to the list
      groupMessages.value.unshift(response.data.result.data)
      newMessage.value = ''
      
      // Focus input again after sending
      nextTick(() => {
        mentionInputRef.value?.focus()
      })
    } else {
      throw new Error(response.data.result?.message || 'Failed to send message')
    }
  } catch (error) {
    console.error('Error sending message:', error)
    showToast({
      message: error.message || 'Failed to send message',
      type: 'error'
    })
  }
}

const formatMessageContent = (content) => {
  if (!content) return ''
  
  // Ganti @[id:name] dengan span yang distyle khusus
  return content.replace(/@\[(\d+):([^\]]+)\]/g, (match, id, name) => {
    return `<span class="inline-block bg-red-50 text-red-600 px-1 py-0.5 rounded">@${name}</span>`
  })
}

const handleProjectUpdate = async (data) => {
  try {
    const response = await apiClient.post('/web/v2/team/projects', {
      jsonrpc: '2.0',
      id: new Date().getTime(),
      params: {
        operation: 'update',
        project_id: projectId.value,
        ...data
      }
    })

    if (response.data.result?.status === 'success') {
      showToast({
        message: 'Project updated successfully',
        type: 'success'
      })
      showEditModal.value = false
      await fetchProjectDetail()
    } else {
      throw new Error(response.data.result?.message || 'Failed to update project')
    }
  } catch (error) {
    console.error('Error updating project:', error)
    showToast({
      message: error.message || 'Failed to update project',
      type: 'error'
    })
  }
}

const handleTaskCreate = async (data) => {
  try {
    const response = await apiClient.post('/web/v2/team/tasks', {
      jsonrpc: '2.0',
      id: new Date().getTime(),
      params: {
        operation: 'create',
        project_id: projectId.value,
        ...data
      }
    })

    if (response.data.result?.status === 'success') {
      showToast({
        message: 'Task created successfully',
        type: 'success'
      })
      showCreateTaskModal.value = false
      await fetchProjectDetail()
    } else {
      throw new Error(response.data.result?.message || 'Failed to create task')
    }
  } catch (error) {
    console.error('Error creating task:', error)
    showToast({
      message: error.message || 'Failed to create task',
      type: 'error'
    })
  }
}

const handleMeetingCreate = async (data) => {
  try {
    const response = await apiClient.post('/web/v2/team/meetings', {
      jsonrpc: '2.0',
      id: new Date().getTime(),
      params: {
        operation: 'create',
        project_id: projectId.value,
        ...data
      }
    })

    if (response.data.result?.status === 'success') {
      showToast({
        message: 'Meeting scheduled successfully',
        type: 'success'
      })
      showCreateMeetingModal.value = false
      await fetchProjectDetail()
    } else {
      throw new Error(response.data.result?.message || 'Failed to schedule meeting')
    }
  } catch (error) {
    console.error('Error scheduling meeting:', error)
    showToast({
      message: error.message || 'Failed to schedule meeting',
      type: 'error'
    })
  }
}

const handleBAUCreate = async (data) => {
  try {
    const response = await apiClient.post('/web/v2/team/bau', {
      jsonrpc: '2.0',
      id: new Date().getTime(),
      params: {
        operation: 'create',
        project_id: projectId.value,
        ...data
      }
    })

    if (response.data.result?.status === 'success') {
      showToast({
        message: 'BAU activity added successfully',
        type: 'success'
      })
      showCreateBAUModal.value = false
      await fetchProjectDetail()
    } else {
      throw new Error(response.data.result?.message || 'Failed to add BAU activity')
    }
  } catch (error) {
    console.error('Error adding BAU activity:', error)
    showToast({
      message: error.message || 'Failed to add BAU activity',
      type: 'error'
    })
  }
}

const confirmDelete = () => {
  showDeleteConfirm.value = true
}

const handleDelete = async () => {
  try {
    const response = await apiClient.post('/web/v2/team/projects', {
      jsonrpc: '2.0',
      id: new Date().getTime(),
      params: {
        operation: 'delete',
        project_id: projectId.value
      }
    })

    if (response.data.result?.status === 'success') {
      showToast({
        message: response.data.result.message || 'Project deleted successfully',
        type: 'success'
      })
      showDeleteConfirm.value = false
      router.push('/team/projects') 
    } else {
      throw new Error(response.data.result?.message || 'Failed to delete project')
    }
  } catch (error) {
    console.error('Error deleting project:', error)
    showToast({
      message: error.message || 'Failed to delete project',
      type: 'error'
    })
  } finally {
    showDeleteConfirm.value = false
  }
}

const formatState = (state) => {
  const states = {
    draft: 'Draft',
    planning: 'Planning',
    in_progress: 'In Progress',
    on_hold: 'On Hold',
    review: 'In Review',
    done: 'Completed',
    completed: 'Completed',
    cancelled: 'Cancelled'
  }
  return states[state] || state
}

const formatBAUState = (state) => {
  const states = {
    planned: 'Planned',
    done: 'Done',
    not_done: 'Not Done'
  }
  return states[state] || state
}

const formatDate = (date) => {
  if (!date) return '-'
  return format(new Date(date), 'dd MMM yyyy')
}

const formatDateTime = (date) => {
  if (!date) return '-'
  return format(new Date(date), 'dd MMM yyyy HH:mm')
}

const formatTime = (date) => {
  if (!date) return '-'
  return format(new Date(date), 'HH:mm')
}

const isOverdue = (date) => {
  if (!date) return false
  return isPast(new Date(date)) && project.value?.state !== 'completed'
}

const getInitials = (name) => {
  if (!name) return ''
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
}

// Lifecycle
onMounted(() => {
  fetchDepartments()
  fetchProjectDetail()
})
</script>

<style scoped>
dialog {
  z-index: 1000;
}
</style>