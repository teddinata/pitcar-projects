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
                'bg-gray-100 text-gray-800': project?.state === 'draft'
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
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                      <span>{{ task.type }}</span>
                      <span>{{ formatDate(task.due_date) }}</span>
                    </div>
                  </div>
                  <div
                    class="px-2.5 py-1 text-xs font-medium rounded-full"
                    :class="{
                      'bg-yellow-100 text-yellow-800': task.state === 'in_progress',
                      'bg-green-100 text-green-800': task.state === 'done',
                      'bg-gray-100 text-gray-800': task.state === 'draft',
                      'bg-red-100 text-red-800': task.state === 'revision'
                    }"
                  >
                    {{ formatState(task.state) }}
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

        <!-- Right Column -->
        <div class="space-y-6">
          <!-- Project Info -->
          <div class="bg-white rounded-xl shadow-sm p-6">
            <h2 class="text-lg font-medium text-gray-900 mb-4">Project Info</h2>
            <div class="space-y-4">
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
                </div>
              </div>
            </div>
          </div>
          <div class="bg-white rounded-xl shadow-sm overflow-hidden">
            <div class="p-6 border-b">
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
        @close="showCreateTaskModal = false"
        @submit="handleTaskCreate"
      />

      <!-- Delete Confirmation Dialog -->
      <dialog v-if="showDeleteConfirm" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center" open>
        <div class="bg-white rounded-lg p-6 max-w-md w-full">
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
              class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
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
      </dialog>

      <!-- Force Delete Confirmation Dialog -->
      <dialog v-if="showForceDeleteConfirm" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center" open>
        <div class="bg-white rounded-lg p-6 max-w-md w-full">
          <h3 class="text-lg font-medium text-gray-900">Force Delete Confirmation</h3>
          <p class="mt-2 text-sm text-gray-500">
            Force deleting "{{ project?.name }}" will permanently remove the project, all {{ project?.tasks.length }} tasks, and their revisions. This action cannot be undone.
          </p>
          <div class="mt-4 flex justify-end space-x-3">
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
      </dialog>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { format, isPast } from 'date-fns'
import { ArrowLeft, Pencil, Plus, Video, Palette, Trash2 } from 'lucide-vue-next'
import { useToast } from '@/composables/useToast'
import apiClient from '@/config/api'

import ProjectFormModal from '@/components/projects/ProjectFormModal.vue'
import TaskFormModal from '@/components/tasks/TaskFormModal.vue'
import ActivityLog from '@/components/shared/ActivityLog.vue'
import Toast from '@/components/Toast.vue'

const route = useRoute()
const router = useRouter()
const { toast, showToast } = useToast()

const projectId = computed(() => Number(route.params.id))
const project = ref(null)
const showEditModal = ref(false)
const showCreateTaskModal = ref(false)
const showDeleteConfirm = ref(false)
const showForceDeleteConfirm = ref(false)

// Computed
const completedVideos = computed(() => {
  return project.value?.tasks?.filter(t => t.type === 'video' && t.state === 'done').length || 0
})

const completedDesigns = computed(() => {
  return project.value?.tasks?.filter(t => t.type === 'design' && t.state === 'done').length || 0
})

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

const formatState = (state) => {
  const states = {
    draft: 'Draft',
    in_progress: 'In Progress',
    revision: 'Revision',
    review: 'Review',
    done: 'Completed'
  }
  return states[state] || state
}

const formatDate = (date) => {
  if (!date) return '-'
  return format(new Date(date), 'dd MMM yyyy')
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
  fetchProjectDetail()
})
</script>

<style scoped>
dialog {
  z-index: 1000;
}
</style>