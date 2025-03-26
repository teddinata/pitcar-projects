<!-- src/views/dashboard/Projects.vue -->
<template>
  <div class="min-h-screen bg-gray-50">
    <Toast
      v-model:show="toast.show"
      :message="toast.message"
      :type="toast.type"
      :duration="toast.duration"
    />
    
    <!-- Header with Filters -->
    <div class="bg-white shadow">
      <div class="w-full max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
          <!-- Title -->
          <h1 class="text-xl sm:text-2xl font-semibold text-gray-900">Marketing Projects</h1>
          
          <!-- Controls Container -->
          <div class="flex flex-col space-y-3 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
            <!-- Status Filter -->
            <select
              v-model="filters.state"
              class="w-full sm:w-auto rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm focus:ring-red-500 focus:border-red-500"
            >
              <option value="">All Status</option>
              <option value="draft">Draft</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>

            <!-- Date Filters -->
            <div class="flex space-x-2">
              <input 
                type="date" 
                v-model="filters.date_start"
                class="w-full sm:w-auto rounded-md border-gray-300 py-2 text-sm focus:ring-red-500 focus:border-red-500"
                placeholder="Start Date"
              >
              <input 
                type="date" 
                v-model="filters.date_end"
                class="w-full sm:w-auto rounded-md border-gray-300 py-2 text-sm focus:ring-red-500 focus:border-red-500"
                placeholder="End Date"
              >
            </div>

            <!-- Action Buttons -->
            <div class="flex space-x-2">
              <button
                @click="fetchProjects"
                class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <FunnelIcon class="h-4 w-4 mr-1.5" />
                Apply Filters
              </button>

              <button
                @click="resetFilters"
                class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <ArrowPathIcon class="h-4 w-4 mr-1.5" />
                Reset
              </button>

              <button
                @click="showCreateModal = true"
                class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <PlusIcon class="h-4 w-4 mr-1.5" />
                New Project
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <main class="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Projects Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ProjectCard 
          v-for="project in projects"
          :key="project.id"
          :project="project"
          @click="viewProject(project.id)"
          @status-change="updateProjectStatus"
        />
      </div>

      <!-- Empty State -->
      <div 
        v-if="!loading && projects.length === 0" 
        class="text-center py-12"
      >
        <DocumentIcon class="mx-auto h-12 w-12 text-gray-400" />
        <h3 class="mt-2 text-sm font-medium text-gray-900">No projects</h3>
        <p class="mt-1 text-sm text-gray-500">
          Get started by creating a new project.
        </p>
        <div class="mt-6">
          <button
            @click="showCreateModal = true"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600"
          >
            <PlusIcon class="h-4 w-4 mr-1.5" />
            New Project
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div 
        v-if="loading" 
        class="flex justify-center py-12"
      >
        <div class="animate-spin rounded-full h-8 w-8 border-2 border-red-600 border-t-transparent"></div>
      </div>
    </main>

    <!-- Create/Edit Project Modal -->
    <ProjectFormModal
      v-if="showCreateModal"
      :show="showCreateModal"
      :project="selectedProject"
      @close="closeModal"
      @submit="handleProjectSubmit"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from '@/composables/useToast'
import apiClient from '@/config/api'
import { 
  PlusIcon, 
  DocumentIcon,
  ArrowPathIcon,
  FunnelIcon 
} from '@heroicons/vue/24/outline'

import ProjectCard from '@/components/projects/ProjectCard.vue'
import ProjectFormModal from '@/components/projects/ProjectFormModal.vue'
import Toast from '@/components/Toast.vue'

// State
const router = useRouter()
const { toast, showToast } = useToast()
const loading = ref(false)
const projects = ref([])
const showCreateModal = ref(false)
const selectedProject = ref(null)

const filters = ref({
  state: '',
  date_start: '',
  date_end: '',
  project_manager_id: ''
})

// Methods
const fetchProjects = async () => {
  try {
    loading.value = true
    const response = await apiClient.post('/web/v2/content/projects/list', {
      jsonrpc: '2.0',
      id: new Date().getTime(),
      params: {
        ...filters.value
      }
    })

    if (response.data.result?.status === 'success') {
      projects.value = response.data.result.data
      showToast({
        message: 'Projects loaded successfully',
        type: 'success'
      })
    }
  } catch (error) {
    console.error('Error fetching projects:', error)
    showToast({
      message: error.message || 'Failed to load projects',
      type: 'error',
      duration: 5000
    })
  } finally {
    loading.value = false
  }
}

const updateProjectStatus = async (projectId, newStatus) => {
  try {
    const response = await apiClient.post('/web/v2/content/projects', {
      jsonrpc: '2.0',
      id: new Date().getTime(),
      params: {
        operation: 'update_status',
        project_id: projectId,
        state: newStatus
      }
    })

    if (response.data.result?.status === 'success') {
      showToast({
        message: 'Project status updated successfully',
        type: 'success'
      })
      await fetchProjects()
    }
  } catch (error) {
    console.error('Error updating project status:', error)
    showToast({
      message: error.message || 'Failed to update project status',
      type: 'error'
    })
  }
}


const resetFilters = () => {
  filters.value = {
    state: '',
    date_start: '',
    date_end: '',
    project_manager_id: ''
  }
  fetchProjects()
}

const viewProject = (projectId) => {
  router.push(`/marketing/project/${projectId}`)
}

const closeModal = () => {
  showCreateModal.value = false
  selectedProject.value = null
}

const handleProjectSubmit = async (projectData) => {
  try {
    loading.value = true
    const response = await apiClient.post('/web/v2/content/projects', {
      jsonrpc: '2.0',
      id: new Date().getTime(),
      params: {
        operation: 'create',
        ...projectData
      }
    })

    if (response.data.result?.status === 'success') {
      showToast({
        message: 'Project created successfully',
        type: 'success'
      })
      closeModal()
      fetchProjects()
    }
  } catch (error) {
    console.error('Error creating project:', error)
    showToast({
      message: error.message || 'Failed to create project',
      type: 'error'
    })
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchProjects()
})
</script>