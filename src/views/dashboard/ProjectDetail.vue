<!-- src/views/dashboard/ProjectDetail.vue -->
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
      <div class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
          <div class="flex items-center space-x-3">
            <button @click="router.back()" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
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
                'bg-red-100 text-red-800': project?.state === 'cancelled'
              }"
            >
              {{ formatState(project?.state) }}
            </div>
            
            <!-- Project Actions -->
            <div class="relative" ref="actionsDropdownRef">
              <button
                @click="isActionsOpen = !isActionsOpen"
                class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <Settings class="w-4 h-4 mr-2" />
                Actions
                <ChevronDown class="w-4 h-4 ml-1" />
              </button>
              
              <!-- Actions Dropdown -->
              <div 
                v-if="isActionsOpen"
                class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10 border border-gray-100"
              >
                <div class="py-1">
                  <button
                    @click="showEditModal = true; isActionsOpen = false"
                    class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                  >
                    <Pencil class="w-4 h-4 mr-2 text-gray-500" />
                    Edit Project
                  </button>
                  
                  <button
                    @click="confirmDelete(); isActionsOpen = false"
                    class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                  >
                    <Trash2 class="w-4 h-4 mr-2 text-red-500" />
                    Delete Project
                  </button>
                </div>
              </div>
            </div>
            
            <!-- Create Task Button -->
            <button
              @click="showCreateTaskModal = true"
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
            >
              <Plus class="w-4 h-4 mr-2" />
              New Task
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Project Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div class="bg-white rounded-xl shadow-sm p-5">
          <div class="flex justify-between">
            <div>
              <p class="text-sm text-gray-500">Days Remaining</p>
              <p class="text-xl font-semibold mt-1" :class="{'text-red-600': daysRemaining < 0, 'text-green-600': daysRemaining >= 0}">
                {{ daysRemaining >= 0 ? daysRemaining : 'Overdue' }}
              </p>
            </div>
            <div class="rounded-full bg-blue-50 p-3 flex items-center justify-center">
              <Clock class="h-5 w-5 text-blue-500" />
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-xl shadow-sm p-5">
          <div class="flex justify-between">
            <div>
              <p class="text-sm text-gray-500">Progress</p>
              <p class="text-xl font-semibold mt-1">{{ project?.progress }}%</p>
            </div>
            <div class="rounded-full bg-yellow-50 p-3 flex items-center justify-center">
              <BarChart2 class="h-5 w-5 text-yellow-500" />
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-xl shadow-sm p-5">
          <div class="flex justify-between">
            <div>
              <p class="text-sm text-gray-500">Total Tasks</p>
              <p class="text-xl font-semibold mt-1">{{ project?.tasks?.length || 0 }}</p>
            </div>
            <div class="rounded-full bg-purple-50 p-3 flex items-center justify-center">
              <ListChecks class="h-5 w-5 text-purple-500" />
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-xl shadow-sm p-5">
          <div class="flex justify-between">
            <div>
              <p class="text-sm text-gray-500">Completed Tasks</p>
              <p class="text-xl font-semibold mt-1">{{ completedTasksCount }}</p>
            </div>
            <div class="rounded-full bg-green-50 p-3 flex items-center justify-center">
              <CheckCircle class="h-5 w-5 text-green-500" />
            </div>
          </div>
        </div>
      </div>
      
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left Column -->
        <div class="lg:col-span-2 space-y-6">
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

              <!-- Content Progress -->
              <div class="grid grid-cols-2 gap-4">
                <div class="bg-gray-50 rounded-lg p-4">
                  <div class="flex items-center space-x-2 text-gray-600 mb-2">
                    <Video class="w-4 h-4" />
                    <span>Videos</span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-600">Completed</span>
                    <span class="font-medium">
                      {{ completedVideos }}/{{ project?.content_plan?.video_count || 0 }}
                    </span>
                  </div>
                  <div class="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      class="h-1.5 rounded-full bg-blue-500"
                      :style="{ width: `${videoProgress}%` }"
                    ></div>
                  </div>
                </div>
                <div class="bg-gray-50 rounded-lg p-4">
                  <div class="flex items-center space-x-2 text-gray-600 mb-2">
                    <Palette class="w-4 h-4" />
                    <span>Designs</span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-600">Completed</span>
                    <span class="font-medium">
                      {{ completedDesigns }}/{{ project?.content_plan?.design_count || 0 }}
                    </span>
                  </div>
                  <div class="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      class="h-1.5 rounded-full bg-green-500"
                      :style="{ width: `${designProgress}%` }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

           <!-- Task List -->
            <div class="divide-y divide-gray-100">
              <div v-if="filteredTasks.length === 0" class="p-6 text-center text-gray-500">
                <FolderX class="w-12 h-12 mx-auto text-gray-300 mb-2" />
                <p>No tasks found matching your filter</p>
              </div>
              
              <div
                v-for="task in filteredTasks"
                :key="task.id"
                @click="openTaskDetail(task)"
                class="p-5 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div class="flex items-start justify-between">
                  <div>
                    <h3 class="font-medium text-gray-900">{{ task.name }}</h3>
                    <div class="mt-1.5 flex items-center space-x-4 text-sm text-gray-500">
                      <!-- Content Type -->
                      <div class="flex items-center">
                        <span
                          class="w-2 h-2 rounded-full mr-1.5"
                          :class="{
                            'bg-blue-500': task.content_type === 'video',
                            'bg-green-500': task.content_type === 'design',
                            'bg-gray-500': !task.content_type || task.content_type === 'other'
                          }"
                        ></span>
                        <span>{{ task.content_type || 'Other' }}</span>
                      </div>
                      
                      <!-- Timeline -->
                      <div class="flex items-center space-x-1">
                        <Clock class="w-3.5 h-3.5 text-gray-400" />
                        <span>{{ formatDate(task.dates?.planned_start) }} - {{ formatDate(task.dates?.planned_end) }}</span>
                        <span v-if="isTaskOverdue(task)" class="text-red-500 text-xs font-medium">(Overdue)</span>
                      </div>
                      
                      <!-- Revisions Badge -->
                      <div v-if="task.revisions?.count > 0" class="flex items-center">
                        <span 
                          class="flex items-center justify-center px-1.5 py-0.5 rounded-full text-xs font-medium"
                          :class="[task.revisions.excessive ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800']"
                        >
                          <History class="w-3 h-3 mr-0.5" />
                          {{ task.revisions.count }} {{ task.revisions.count === 1 ? 'revision' : 'revisions' }}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div class="flex items-center space-x-2">
                    <div
                      class="px-2.5 py-1 text-xs font-medium rounded-full"
                      :class="{
                        'bg-yellow-100 text-yellow-800': task.state === 'in_progress',
                        'bg-green-100 text-green-800': task.state === 'done',
                        'bg-gray-100 text-gray-800': task.state === 'draft',
                        'bg-amber-100 text-amber-800': task.state === 'revision',
                        'bg-purple-100 text-purple-800': task.state === 'review'
                      }"
                    >
                      {{ formatState(task.state) }}
                    </div>
                    
                    <!-- Assigned Users -->
                    <div class="flex -space-x-2">
                      <div 
                        v-for="(member, index) in task.assigned_to?.slice(0, 2)" 
                        :key="index"
                        class="h-6 w-6 rounded-full border border-white bg-gray-200 flex items-center justify-center"
                        :title="member.name"
                      >
                        <span class="text-xs font-medium text-gray-600">
                          {{ getInitials(member.name) }}
                        </span>
                      </div>
                      <div 
                        v-if="(task.assigned_to?.length || 0) > 2"
                        class="h-6 w-6 rounded-full border border-white bg-gray-100 flex items-center justify-center"
                      >
                        <span class="text-xs font-medium text-gray-600">
                          +{{ (task.assigned_to?.length || 0) - 2 }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Task Progress -->
                <div class="mt-3">
                  <div class="flex justify-between text-xs mb-1">
                    <span class="text-gray-600">Progress</span>
                    <span>{{ task.progress }}%</span>
                  </div>
                  <div class="w-full bg-gray-100 rounded-full h-1.5">
                    <div
                      class="h-1.5 rounded-full transition-all duration-500"
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

        <!-- Right Column -->
        <div class="space-y-6">
          <!-- Project Info -->
          <div class="bg-white rounded-xl shadow-sm p-6">
            <h2 class="text-lg font-medium text-gray-900 mb-4">Project Info</h2>
            <div class="space-y-4">
              <!-- Timeline -->
              <div>
                <h3 class="text-sm font-medium text-gray-700 mb-2">Timeline</h3>
                <div class="bg-gray-50 rounded-lg p-4 space-y-3">
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
                  
                  <!-- Progress Timeline -->
                  <div class="pt-2">
                    <div class="relative">
                      <div class="absolute left-0 top-1/2 w-full h-1 bg-gray-200 rounded-full transform -translate-y-1/2"></div>
                      <div 
                        class="absolute left-0 top-1/2 h-1 bg-red-500 rounded-full transform -translate-y-1/2"
                        :style="{ width: `${timelineProgress}%` }"
                      ></div>
                      
                      <!-- Markers -->
                      <div class="relative z-10 flex justify-between">
                        <div class="flex flex-col items-center">
                          <div class="h-3 w-3 bg-blue-500 rounded-full border-2 border-white"></div>
                          <span class="text-xs text-gray-500 mt-1">Start</span>
                        </div>
                        
                        <div class="flex flex-col items-center">
                          <div 
                            class="h-3 w-3 rounded-full border-2 border-white"
                            :class="{ 
                              'bg-green-500': project?.state === 'completed',
                              'bg-yellow-500': project?.state !== 'completed' && timelineProgress < 100,
                              'bg-red-500': project?.state !== 'completed' && timelineProgress >= 100
                            }"
                          ></div>
                          <span class="text-xs text-gray-500 mt-1">End</span>
                        </div>
                      </div>
                      
                      <!-- Today Marker (if within timeline) -->
                      <div 
                        v-if="timelineProgress <= 100 && timelineProgress >= 0"
                        class="absolute z-10 top-1/2 transform -translate-y-1/2"
                        :style="{ left: `${timelineProgress}%` }"
                      >
                        <div class="flex flex-col items-center">
                          <div class="h-4 w-4 bg-purple-500 rounded-full border-2 border-white shadow-sm"></div>
                          <span class="text-xs text-gray-500 mt-1">Today</span>
                        </div>
                      </div>
                    </div>
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
                      <div class="ml-3">
                        <span class="text-sm font-medium">
                          {{ project?.team?.manager?.name }}
                        </span>
                        <p class="text-xs text-gray-500">{{ project?.team?.manager?.position }}</p>
                      </div>
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
                        <div class="ml-3">
                          <span class="text-sm">{{ member.name }}</span>
                          <p class="text-xs text-gray-500">{{ member.position }}</p>
                        </div>
                      </div>
                      
                      <!-- Empty State -->
                      <div v-if="!project?.team?.members?.length" class="text-sm text-gray-500 italic">
                        No team members assigned
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Activity Log -->
          <div class="bg-white rounded-xl shadow-sm overflow-hidden">
            <div class="p-6 border-b border-gray-100">
              <h2 class="text-lg font-medium text-gray-900">Activity Log</h2>
            </div>
            <div class="divide-y divide-gray-200">
              <div class="max-h-[500px] overflow-y-auto p-6">
                <ActivityLog type="project" :id="projectId" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <Teleport to="body">
      <!-- Edit Project Modal -->
      <ProjectFormModal
        v-if="showEditModal"
        :show="showEditModal"
        :project="project"
        @close="showEditModal = false"
        @submit="handleProjectUpdate"
      />

      <!-- Create Task Modal -->
      <TaskFormModal
        v-if="showCreateTaskModal"
        :show="showCreateTaskModal"
        :project-id="projectId"
        :projects="projects"
        @close="showCreateTaskModal = false"
        @submit="handleTaskCreate"
      />
      
      <!-- Task Detail Modal -->
      <TaskDetailModal
        v-if="showTaskDetailModal"
        :show="showTaskDetailModal"
        :task="selectedTask"
        @close="showTaskDetailModal = false"
        @update="handleTaskUpdate"
        @delete="handleTaskDelete"
      />

      <!-- Delete Confirmation Dialog -->
      <div 
        v-if="showDeleteConfirm" 
        class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50"
        @click="showDeleteConfirm = false"
      >
        <div class="bg-white rounded-lg p-6 max-w-md w-full" @click.stop>
          <h3 class="text-lg font-medium text-gray-900">Delete Project</h3>
          <p class="mt-2 text-sm text-gray-500">
            Are you sure you want to delete "{{ project?.name }}"?
            <span v-if="project?.tasks?.length > 0" class="block text-red-600 mt-1">
              This project has {{ project?.tasks.length }} task(s). Deleting it will require force delete and remove all associated tasks and revisions.
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
              @click="handleDelete(false)"
              :disabled="project?.tasks?.length > 0"
              class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Delete
            </button>
            <button
              v-if="project?.tasks?.length > 0"
              @click="confirmForceDelete"
              class="px-4 py-2 text-sm font-medium text-white bg-red-800 rounded-md hover:bg-red-900"
            >
              Force Delete
            </button>
          </div>
        </div>
      </div>

      <!-- Force Delete Confirmation Dialog -->
      <div 
        v-if="showForceDeleteConfirm" 
        class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50"
        @click="showForceDeleteConfirm = false"
      >
        <div class="bg-white rounded-lg p-6 max-w-md w-full" @click.stop>
          <h3 class="text-lg font-medium text-gray-900">Force Delete Confirmation</h3>
          <div class="mt-2">
            <AlertTriangle class="w-8 h-8 text-red-600 mb-2" />
            <p class="text-sm text-gray-500">
              Force deleting "<span class="font-medium">{{ project?.name }}</span>" will permanently remove:
            </p>
            <ul class="list-disc ml-5 mt-2 text-sm text-gray-500">
              <li>The project itself</li>
              <li>All {{ project?.tasks.length }} tasks</li>
              <li>All associated revisions and history</li>
            </ul>
            <p class="mt-2 text-sm font-medium text-red-600">This action cannot be undone.</p>
          </div>
          <div class="mt-6 flex justify-end space-x-3">
            <button
              @click="showForceDeleteConfirm = false"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              @click="handleDelete(true)"
              class="px-4 py-2 text-sm font-medium text-white bg-red-800 rounded-md hover:bg-red-900"
            >
              Confirm Force Delete
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { format, isPast, differenceInDays, parseISO } from 'date-fns'
import { 
  ArrowLeft, 
  Pencil, 
  Plus, 
  Video, 
  Palette, 
  Trash2,
  Calendar,
  CheckCircle,
  BarChart2,
  Clock,
  ListChecks,
  Settings,
  ChevronDown,
  FolderX,
  AlertTriangle,
  Eye
} from 'lucide-vue-next'
import { useToast } from '@/composables/useToast'
import apiClient from '@/config/api'

import ProjectFormModal from '@/components/projects/ProjectFormModal.vue'
import TaskFormModal from '@/components/tasks/TaskFormModal.vue'
import TaskDetailModal from '@/components/tasks/ProjectTaskDetailModal.vue'
import ActivityLog from '@/components/shared/ActivityLog.vue'
import Toast from '@/components/Toast.vue'

const route = useRoute()
const router = useRouter()
const { toast, showToast } = useToast()

// State variables
const projectId = computed(() => Number(route.params.id))
const project = ref(null)
const showEditModal = ref(false)
const showCreateTaskModal = ref(false)
const showTaskDetailModal = ref(false)
const showDeleteConfirm = ref(false)
const showForceDeleteConfirm = ref(false)
const projects = ref([])
const isActionsOpen = ref(false)
const actionsDropdownRef = ref(null)
const selectedTask = ref(null)
const taskFilter = ref('all')

const openTaskDetail = (task) => {
  selectedTask.value = task;
  showTaskDetailModal.value = true;
}


const completedDesigns = computed(() => {
  return project.value?.tasks?.filter(t => t.content_type === 'design' && t.state === 'done').length || 0
})

const completedTasksCount = computed(() => {
  return project.value?.tasks?.filter(t => t.state === 'done').length || 0
})
const completedVideos = computed(() => {
  return project.value?.tasks?.filter(t => t.content_type === 'video' && t.state === 'done').length || 0
})

const videoProgress = computed(() => {
  const totalVideos = project.value?.content_plan?.video_count || 0
  if (totalVideos === 0) return 0
  return (completedVideos.value / totalVideos) * 100
})

const designProgress = computed(() => {
  const totalDesigns = project.value?.content_plan?.design_count || 0
  if (totalDesigns === 0) return 0
  return (completedDesigns.value / totalDesigns) * 100
})

function formatDate(dateStr) {
  if (!dateStr) return 'Not set';
  try {
    const date = parseISO(dateStr);
    return format(date, 'd MMM yyyy');
  } catch (e) {
    console.error('Error formatting date:', e);
    return dateStr;
  }
}

// Tambahkan fungsi untuk memeriksa apakah task melewati deadline
const isTaskOverdue = (task) => {
  if (!task.dates?.planned_end || task.state === 'done') return false;
  return isPast(new Date(task.dates.planned_end));
};


// Mendapatkan durasi task dalam hari
function getTaskDuration(task) {
  if (!task.dates?.planned_start || !task.dates?.planned_end) return '';
  try {
    const startDate = new Date(task.dates.planned_start);
    const endDate = new Date(task.dates.planned_end);
    const days = differenceInDays(endDate, startDate);
    return days <= 0 ? 'Same day' : `${days} day${days > 1 ? 's' : ''}`;
  } catch (e) {
    console.error('Error calculating task duration:', e);
    return '';
  }
}

function getInitials(name) {
  if (!name) return '?';
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
}

function isOverdue(dateStr) {
  if (!dateStr) return false;
  try {
    const date = parseISO(dateStr);
    return isPast(date);
  } catch (e) {
    console.error('Error checking if date is overdue:', e);
    return false;
  }
}

const daysRemaining = computed(() => {
  if (!project.value?.dates?.end) return 0
  
  const endDate = parseISO(project.value.dates.end)
  const today = new Date()
  return differenceInDays(endDate, today)
})

function formatState(state) {
  if (!state) return 'Unknown';
  
  const stateMap = {
    'draft': 'Draft',
    'planned': 'Planned',
    'in_progress': 'In Progress',
    'review': 'In Review',
    'revision': 'Revision',
    'done': 'Completed',
    'cancelled': 'Cancelled'
  };
  
  return stateMap[state] || state
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

const timelineProgress = computed(() => {
  if (!project.value?.dates?.start || !project.value?.dates?.end) return 0
  
  const startDate = parseISO(project.value.dates.start)
  const endDate = parseISO(project.value.dates.end)
  const today = new Date()
  
  const totalDuration = differenceInDays(endDate, startDate)
  if (totalDuration <= 0) return 0
  
  const elapsed = differenceInDays(today, startDate)
  return Math.min(Math.max((elapsed / totalDuration) * 100, 0), 100)
})

const filteredTasks = computed(() => {
  if (!project.value?.tasks) return []
  
  if (taskFilter.value === 'all') {
    return project.value.tasks
  } else if (taskFilter.value === 'active') {
    return project.value.tasks.filter(task => task.state !== 'done')
  } else if (taskFilter.value === 'completed') {
    return project.value.tasks.filter(task => task.state === 'done')
  }
  
  return project.value.tasks
})
const fetchProjects = async () => {
  try {
    const response = await apiClient.post('/web/v2/content/projects/list', {
      jsonrpc: '2.0',
      method: 'call',
      id: new Date().getTime()
    })

    if (response.data.result?.status === 'success') {
      projects.value = response.data.result.data
    }
  } catch (error) {
    console.error('Error fetching projects:', error)
  }
}

// Methods
const fetchProjectDetail = async () => {
  try {
    const response = await apiClient.post(`/web/v2/content/projects/${projectId.value}`, {
      jsonrpc: '2.0',
      id: new Date().getTime()
    })

    if (response.data.result?.status === 'success') {
      project.value = response.data.result.data
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

const handleProjectUpdate = async (data) => {
  try {
    const response = await apiClient.post('/web/v2/content/projects', {
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
    const response = await apiClient.post('/web/v2/content/tasks', {
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

const confirmDelete = () => {
  showDeleteConfirm.value = true
}

const confirmForceDelete = () => {
  showDeleteConfirm.value = false
  showForceDeleteConfirm.value = true
}

const handleDelete = async (force = false) => {
  try {
    const response = await apiClient.post('/web/v2/content/projects', {
      jsonrpc: '2.0',
      method: 'call',
      params: {
        operation: 'delete',
        project_id: projectId.value,
        force: force
      }
    })

    if (response.data.result?.result.status === 'success') {
      showToast({
        message: response.data.result.result.message || 'Project deleted successfully',
        type: 'success'
      })
      showDeleteConfirm.value = false
      showForceDeleteConfirm.value = false
      router.push('/dashboard/projects') // Kembali ke daftar project
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
    showForceDeleteConfirm.value = false
  }
}

onMounted(() => {
  fetchProjectDetail()
  fetchProjects()
})
</script>