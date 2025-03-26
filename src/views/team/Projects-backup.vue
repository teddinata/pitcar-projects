<!-- src/views/dashboard/TeamProjects.vue -->
<!-- Modifikasi src/views/dashboard/TeamProjects.vue -->

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
          <h1 class="text-xl sm:text-2xl font-semibold text-gray-900">All Teams Projects</h1>
          
          <!-- Controls Container -->
          <div class="flex flex-col space-y-3 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
            <!-- View toggle buttons -->
            <div class="inline-flex rounded-md shadow-sm">
              <button
                @click="viewMode = 'grid'"
                class="px-4 py-2 text-sm font-medium rounded-l-md focus:outline-none focus:ring-1 focus:ring-red-500 flex items-center"
                :class="viewMode === 'grid' ? 'bg-red-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'"
              >
                <ViewColumnsIcon class="h-4 w-4 mr-1.5" />
                Grid
              </button>
              <button
                @click="viewMode = 'gantt'"
                class="px-4 py-2 text-sm font-medium rounded-r-md focus:outline-none focus:ring-1 focus:ring-red-500 flex items-center"
                :class="viewMode === 'gantt' ? 'bg-red-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'"
              >
                <ChartBarIcon class="h-4 w-4 mr-1.5" />
                Timeline
              </button>
            </div>
            
            <!-- Department Filter -->
            <select
              v-model="filters.department_id"
              class="w-full sm:w-auto rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm focus:ring-red-500 focus:border-red-500"
            >
              <option value="">All Departments</option>
              <option v-for="dept in departments" :key="dept.id" :value="dept.id">
                {{ dept.name }}
              </option>
            </select>
            
            <!-- Status Filter -->
            <select
              v-model="filters.state"
              class="w-full sm:w-auto rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm focus:ring-red-500 focus:border-red-500"
            >
              <option value="">All Status</option>
              <option value="draft">Draft</option>
              <option value="planning">Planning</option>
              <option value="in_progress">In Progress</option>
              <option value="on_hold">On Hold</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <!-- Date Filters -->
            <!-- Date Filters with label -->
            <div class="flex flex-col space-y-1">
              <label class="text-xs font-medium text-gray-700">Period Filter</label>
              <div class="flex space-x-2">
                <div class="relative">
                  <input 
                    type="date" 
                    v-model="filters.date_start"
                    class="w-full sm:w-auto rounded-md border-gray-300 py-2 pl-9 pr-2 text-sm focus:ring-red-500 focus:border-red-500"
                    placeholder="Start Date"
                  >
                  <span class="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
                    <CalendarIcon class="h-4 w-4 text-gray-400" />
                  </span>
                </div>
                <span class="flex items-center text-gray-400">to</span>
                <div class="relative">
                  <input 
                    type="date" 
                    v-model="filters.date_end"
                    class="w-full sm:w-auto rounded-md border-gray-300 py-2 pl-9 pr-2 text-sm focus:ring-red-500 focus:border-red-500"
                    placeholder="End Date"
                  >
                  <span class="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
                    <CalendarIcon class="h-4 w-4 text-gray-400" />
                  </span>
                </div>
              </div>
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
      <!-- Grid View -->
      <div v-if="viewMode === 'grid'">
        <!-- Projects Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <TeamProjectCard 
            v-for="project in projects"
            :key="project.id"
            :project="project"
            @click="viewProject(project.id)"
            @status-change="updateProjectStatus"
            class="cursor-pointer"
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
            Get started by creating a new team project.
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
      </div>

      <!-- Gantt Chart View -->
      <div v-else-if="viewMode === 'gantt'">
        <ProjectGanttChart 
          :department-id="filters.department_id"
          :start-date-filter="filters.date_start"
          :end-date-filter="filters.date_end"
          @view-task-detail="handleViewTaskDetail"
          @view-project-detail="handleViewProjectDetail"
          @edit-task="handleEditTask"
        />
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
    <TeamProjectFormModal
      v-if="showCreateModal"
      :show="showCreateModal"
      :project="selectedProject"
      :departments="departments"
      @close="closeModal"
      @submit="handleProjectSubmit"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from '@/composables/useToast'
import apiClient from '@/config/api'
import { 
  PlusIcon, 
  DocumentIcon,
  ArrowPathIcon,
  FunnelIcon,
  ViewColumnsIcon,
  ChartBarIcon, 
  CalendarIcon 
} from '@heroicons/vue/24/outline'
import { 
  format, 
  parseISO, 
  addMonths, 
  subMonths, 
  addDays, 
  subDays 
} from 'date-fns';


import TeamProjectCard from '@/components/team/TeamProjectCard.vue'
import TeamProjectFormModal from '@/components/team/TeamProjectFormModal.vue'
import ProjectGanttChart from '@/components/team/ProjectGanttChart.vue'
import Toast from '@/components/Toast.vue'

// State
const router = useRouter()
const { toast, showToast } = useToast()
const loading = ref(false)
const projects = ref([])
const departments = ref([])
const showCreateModal = ref(false)
const selectedProject = ref(null)

// Add new view mode state
const viewMode = ref('grid') // 'grid' or 'gantt'

const filters = ref({
  department_id: '',
  state: '',
  date_start: '',
  date_end: '',
  project_manager_id: ''
})

// Methods
const fetchProjects = async () => {
  try {
    loading.value = true
    const response = await apiClient.post('/web/v2/team/projects/list', {
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

const updateProjectStatus = async (projectId, newStatus) => {
  try {
    const response = await apiClient.post('/web/v2/team/projects', {
      jsonrpc: '2.0',
      id: new Date().getTime(),
      params: {
        operation: 'update',
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
  const today = new Date();
  
  filters.value = {
    department_id: '',
    state: '',
    date_start: format(subMonths(today, 1), 'yyyy-MM-dd'),
    date_end: format(addMonths(today, 2), 'yyyy-MM-dd'),
    project_manager_id: ''
  }
  
  fetchProjects();
}


const viewProject = (projectId) => {
  router.push(`/team/project/${projectId}`)
}

const closeModal = () => {
  showCreateModal.value = false
  selectedProject.value = null
}

const handleEditTask = (task) => {
  showCreateModal.value = true;
  selectedTask.value = task;
}


const handleViewTaskDetail = (task) => {
  // Navigate to task detail page
  router.push(`/team/task/${task.id}`);
}

// Handler untuk melihat detail project
const handleViewProjectDetail = (project) => {
  // Navigate to project detail page
  router.push(`/team/project/${project.id}`);
}

const effectiveDateFilter = computed(() => {
  // Jika kedua tanggal diisi, gunakan
  if (filters.value.date_start && filters.value.date_end) {
    return {
      start: filters.value.date_start,
      end: filters.value.date_end
    };
  }
  
  // Jika hanya salah satu, tentukan yang lain
  if (filters.value.date_start && !filters.value.date_end) {
    // Jika hanya start date, gunakan +3 bulan sebagai end date
    const startDate = parseISO(filters.value.date_start);
    return {
      start: filters.value.date_start,
      end: format(addMonths(startDate, 3), 'yyyy-MM-dd')
    };
  }
  
  if (!filters.value.date_start && filters.value.date_end) {
    // Jika hanya end date, gunakan -3 bulan sebagai start date
    const endDate = parseISO(filters.value.date_end);
    return {
      start: format(subMonths(endDate, 3), 'yyyy-MM-dd'),
      end: filters.value.date_end
    };
  }
  
  // Default: sebulan ke belakang sampai 2 bulan ke depan
  const today = new Date();
  return {
    start: format(subMonths(today, 1), 'yyyy-MM-dd'),
    end: format(addMonths(today, 2), 'yyyy-MM-dd')
  };
});


const handleProjectSubmit = async (projectData) => {
  try {
    loading.value = true
    const response = await apiClient.post('/web/v2/team/projects', {
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
  // Initialize date filters if empty
  if (!filters.value.date_start || !filters.value.date_end) {
    const today = new Date();
    filters.value.date_start = format(subMonths(today, 1), 'yyyy-MM-dd');
    filters.value.date_end = format(addMonths(today, 2), 'yyyy-MM-dd');
  }
  
  fetchDepartments();
  fetchProjects();
})

</script>