<!-- src/views/dashboard/TeamTasks.vue -->
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
          <h1 class="text-xl sm:text-2xl font-semibold text-gray-900">Team Tasks</h1>
          
          <div class="flex flex-wrap gap-3">
            <!-- Filters -->
            <select 
              v-model="filters.department_id"
              class="rounded-lg border-gray-300 text-sm focus:ring-red-500 focus:border-red-500"
            >
              <option value="">All Departments</option>
              <option v-for="dept in departments" :key="dept.id" :value="dept.id">
                {{ dept.name }} ({{ dept.task_count }})
              </option>
            </select>
            
            <select 
              v-model="filters.project_id"
              class="rounded-lg border-gray-300 text-sm focus:ring-red-500 focus:border-red-500"
            >
              <option value="">All Projects</option>
              <option v-for="project in projects" :key="project.id" :value="project.id">
                {{ project.name }}
              </option>
            </select>

            <select 
              v-model="filters.type_id"
              class="rounded-lg border-gray-300 text-sm focus:ring-red-500 focus:border-red-500"
            >
              <option value="">All Types</option>
              <option v-for="type in taskTypes" :key="type.id" :value="type.id">
                {{ type.name }}
              </option>
            </select>

            <button
              @click="showCreateModal = true"
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600"
            >
              <Plus class="w-4 h-4 mr-2" />
              New Task
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center h-[calc(100vh-120px)]">
      <Loader2 class="w-8 h-8 animate-spin text-red-600" />
    </div>

    <!-- Kanban Board -->
    <main v-else class="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex space-x-6 overflow-x-auto pb-4">
        <!-- Draft Column -->
        <div class="flex-shrink-0 w-80">
          <div class="bg-gray-100 rounded-lg p-4">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-sm font-medium text-gray-900">Draft</h3>
              <span class="text-xs font-medium text-gray-500 bg-white px-2 py-1 rounded-full">
                {{ draftTasks.length }}
              </span>
            </div>
            
            <Draggable
              v-model="draftTasks"
              :group="{ name: 'tasks', pull: true, put: true }"
              :animation="200"
              item-key="id"
              class="space-y-3 min-h-[200px]"
              ghost-class="sortable-ghost"
              drag-class="sortable-drag"
              @end="handleDragEnd"
              data-state="draft"
            >
              <template #item="{ element: task }">
                <TeamTaskCard 
                  :task="task" 
                  :show-meta="true"
                  @click="openTaskDetail(task)" 
                />
              </template>
            </Draggable>
          </div>
        </div>

        <!-- Planned Column -->
        <div class="flex-shrink-0 w-80">
          <div class="bg-purple-50 rounded-lg p-4">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-sm font-medium text-gray-900">Planned</h3>
              <span class="text-xs font-medium text-gray-500 bg-white px-2 py-1 rounded-full">
                {{ plannedTasks.length }}
              </span>
            </div>
            
            <Draggable
              v-model="plannedTasks"
              :group="{ name: 'tasks' }"
              item-key="id"
              class="space-y-3 min-h-[200px]"
              @end="handleDragEnd"
              data-state="planned"
            >
              <template #item="{ element: task }">
                <TeamTaskCard 
                  :task="task" 
                  :show-meta="true"
                  @click="openTaskDetail(task)" 
                />
              </template>
            </Draggable>
          </div>
        </div>

        <!-- In Progress Column -->
        <div class="flex-shrink-0 w-80">
          <div class="bg-yellow-50 rounded-lg p-4">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-sm font-medium text-gray-900">In Progress</h3>
              <span class="text-xs font-medium text-gray-500 bg-white px-2 py-1 rounded-full">
                {{ inProgressTasks.length }}
              </span>
            </div>
            
            <Draggable
              v-model="inProgressTasks"
              :group="{ name: 'tasks' }"
              item-key="id"
              class="space-y-3 min-h-[200px]"
              @end="handleDragEnd"
              data-state="in_progress"
            >
              <template #item="{ element: task }">
                <TeamTaskCard 
                  :task="task" 
                  :show-meta="true"
                  @click="openTaskDetail(task)" 
                />
              </template>
            </Draggable>
          </div>
        </div>

        <!-- Review Column -->
        <div class="flex-shrink-0 w-80">
          <div class="bg-blue-50 rounded-lg p-4">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-sm font-medium text-gray-900">In Review</h3>
              <span class="text-xs font-medium text-gray-500 bg-white px-2 py-1 rounded-full">
                {{ reviewTasks.length }}
              </span>
            </div>
            
            <Draggable
              v-model="reviewTasks"
              :group="{ name: 'tasks' }"
              item-key="id"
              class="space-y-3 min-h-[200px]"
              @end="handleDragEnd"
              data-state="review"
            >
              <template #item="{ element: task }">
                <TeamTaskCard 
                  :task="task" 
                  :show-meta="true"
                  @click="openTaskDetail(task)" 
                />
              </template>
            </Draggable>
          </div>
        </div>

        <!-- Completed Column -->
        <div class="flex-shrink-0 w-80">
          <div class="bg-green-50 rounded-lg p-4">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-sm font-medium text-gray-900">Completed</h3>
              <span class="text-xs font-medium text-gray-500 bg-white px-2 py-1 rounded-full">
                {{ completedTasks.length }}
              </span>
            </div>
            
            <Draggable
              v-model="completedTasks"
              :group="{ name: 'tasks' }"
              item-key="id"
              class="space-y-3 min-h-[200px]"
              @end="handleDragEnd"
              data-state="done"
            >
              <template #item="{ element: task }">
                <TeamTaskCard 
                  :task="task" 
                  :show-meta="true"
                  @click="openTaskDetail(task)" 
                />
              </template>
            </Draggable>
          </div>
        </div>
      </div>
    </main>

    <!-- Task Detail Modal -->
    <TeamTaskDetailModal
      v-if="selectedTask" 
      :show="!!selectedTask"
      :task="selectedTask"
      @close="selectedTask = null"
      @update="handleTaskUpdate"
      @delete="handleTaskDelete"
    />

    <!-- Create Task Modal -->
    <TeamTaskFormModal
      v-if="showCreateModal"
      :show="showCreateModal"
      :project-id="filters.project_id || null"
      @close="handleCloseTaskModal"
      @submit="handleTaskCreate"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { format } from 'date-fns'
import Draggable from 'vuedraggable'
import { Plus, FolderGit2, Calendar, Loader2 } from 'lucide-vue-next'
import { useToast } from '@/composables/useToast'
import apiClient from '@/config/api'

// Components
import TeamTaskDetailModal from '@/components/team/TeamTaskDetailModal.vue'
import TeamTaskFormModal from '@/components/team/TeamTaskFormModal.vue'
import TeamTaskCard from '@/components/team/TeamTaskCard.vue'
import Toast from '@/components/Toast.vue'

const { toast, showToast } = useToast()

// State
const tasks = ref([])
const projects = ref([])
const departments = ref([])
const taskTypes = ref([])
const showCreateModal = ref(false)
const selectedTask = ref(null)
const loading = ref(false)

const filters = ref({
  project_id: '',
  department_id: '',
  type_id: '',
  assigned_to: ''
})

// Computed
const draftTasks = computed(() => {
  return tasks.value.filter(task => task.state === 'draft')
})

const plannedTasks = computed(() => {
  return tasks.value.filter(task => task.state === 'planned')
})

const inProgressTasks = computed(() => {
  return tasks.value.filter(task => task.state === 'in_progress')
})

const reviewTasks = computed(() => {
  return tasks.value.filter(task => task.state === 'review')
})

const completedTasks = computed(() => {
  return tasks.value.filter(task => task.state === 'done')
})

// Methods
// Update fetchTasks method
const fetchTasks = async () => {
  try {
    loading.value = true
    
    // Build filter parameters, converting empty strings to falsy values
    const filterParams = {};
    Object.entries(filters.value).forEach(([key, value]) => {
      if (value !== '') {
        filterParams[key] = value;
      }
    });
    
    const response = await apiClient.post('/web/v2/team/tasks', {
      jsonrpc: '2.0',
      id: new Date().getTime(),
      params: {
        operation: 'list',
        ...filterParams
      }
    })

    if (response.data.result?.status === 'success') {
      tasks.value = response.data.result.data
    } else {
      throw new Error(response.data.result?.message || 'Failed to fetch tasks')
    }
  } catch (error) {
    console.error('Error fetching tasks:', error)
    showToast({
      message: error.message || 'Failed to load tasks',
      type: 'error'
    })
  } finally {
    loading.value = false
  }
}

const fetchProjects = async () => {
  try {
    const response = await apiClient.post('/web/v2/team/projects/list', {
      jsonrpc: '2.0',
      id: new Date().getTime(),
      params: {
        limit: 100 // Get all projects for dropdown
      }
    })

    if (response.data.result?.status === 'success') {
      projects.value = response.data.result.data
    }
  } catch (error) {
    console.error('Error fetching projects:', error)
  }
}

const fetchDepartments = async () => {
  try {
    // Use the new endpoint for departments with tasks
    const response = await apiClient.post('/web/v2/team/tasks/departments', {
      jsonrpc: '2.0',
      id: new Date().getTime(),
      params: {}
    })

    if (response.data.result?.status === 'success') {
      departments.value = response.data.result.data
    }
  } catch (error) {
    console.error('Error fetching departments:', error)
    // Fallback to employees master endpoint if the tasks/departments endpoint fails
    try {
      const masterResponse = await apiClient.post('/web/employees/masters', {
        jsonrpc: '2.0',
        id: new Date().getTime()
      })
      
      if (masterResponse.data.status === 'success') {
        departments.value = masterResponse.data.data.departments.map(dept => ({
          id: dept.id,
          name: dept.name,
          task_count: dept.total_employees || 0
        }))
      }
    } catch (fallbackError) {
      console.error('Error fetching departments from master data:', fallbackError)
    }
  }
}

const fetchTaskTypes = async () => {
  try {
    // Use the new dedicated endpoint for task types
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

const handleTaskCreate = async (formData) => {
  try {
    // Validate assigned_to data
    let assignedTo = Array.isArray(formData.assigned_to) 
      ? formData.assigned_to.filter(id => id !== null && id !== undefined)
      : formData.assigned_to ? [formData.assigned_to] : [];

    // Validate required fields
    if (!formData.name?.trim()) {
      throw new Error('Task name is required');
    }
    if (!formData.project_id) {
      throw new Error('Project is required');
    }
    if (!assignedTo.length) {
      throw new Error('Please select at least one assignee');
    }

    loading.value = true;

    const response = await apiClient.post('/web/v2/team/tasks', {
      jsonrpc: '2.0',
      id: new Date().getTime(),
      params: {
        operation: 'create',
        name: formData.name.trim(),
        project_id: Number(formData.project_id),
        type_id: formData.type_id ? Number(formData.type_id) : false,
        assigned_to: assignedTo.map(id => Number(id)),
        reviewer_id: formData.reviewer_id ? Number(formData.reviewer_id) : false,
        planned_date_start: formData.planned_date_start || null,
        planned_date_end: formData.planned_date_end || null,
        planned_hours: formData.planned_hours ? Number(formData.planned_hours) : 0,
        description: formData.description?.trim() || null,
        priority: formData.priority || '1',
        state: formData.state || 'draft'
      }
    });

    if (response.data.result?.status === 'success') {
      showToast({
        message: 'Task created successfully',
        type: 'success'
      });
      handleCloseTaskModal();
      await fetchTasks();
    } else {
      throw new Error(response.data.result?.message || 'Failed to create task');
    }
  } catch (error) {
    console.error('Error creating task:', error);
    showToast({
      message: error.message || 'Failed to create task',
      type: 'error'
    });
  } finally {
    loading.value = false;
  }
}

const handleCloseTaskModal = () => {
  showCreateModal.value = false
  loading.value = false
}

const handleTaskUpdate = async (data) => {
  try {
    const response = await apiClient.post('/web/v2/team/tasks', {
      jsonrpc: '2.0',
      id: new Date().getTime(),
      params: {
        operation: 'update',
        ...data
      }
    })

    if (response.data.result?.status === 'success') {
      showToast({
        message: 'Task updated successfully',
        type: 'success'
      })
      selectedTask.value = null
      await fetchTasks()
    } else {
      throw new Error(response.data.result?.message || 'Failed to update task')
    }
  } catch (error) {
    console.error('Error updating task:', error)
    showToast({
      message: error.message || 'Failed to update task',
      type: 'error'
    })
  }
}

const handleDragEnd = async (event) => {
  try {
    const task = event.item.__draggable_context?.element;
    if (!task?.id) return;

    const newState = event.to.getAttribute('data-state');
    if (!newState || task.state === newState) return;

    const response = await apiClient.post('/web/v2/team/tasks', {
      jsonrpc: '2.0',
      id: new Date().getTime(),
      params: {
        operation: 'update',
        task_id: task.id,
        state: newState,
      }
    });

    if (response.data.result?.status === 'success') {
      showToast({
        message: 'Task status updated',
        type: 'success'
      });
      await fetchTasks();
    } else {
      throw new Error(response.data.result?.message || 'Failed to update task status')
    }
  } catch (error) {
    console.error('Error updating task status:', error);
    showToast({
      message: error.message || 'Failed to update task status',
      type: 'error'
    });
    await fetchTasks(); // Refresh to reset the UI
  }
};

const openTaskDetail = (task) => {
  selectedTask.value = task;
};

const handleTaskDelete = async (taskId) => {
  try {
    const response = await apiClient.post('/web/v2/team/tasks', {
      jsonrpc: '2.0',
      id: new Date().getTime(),
      params: {
        operation: 'delete',
        task_id: taskId
      }
    })

    if (response.data.result?.status === 'success') {
      showToast({
        message: 'Task deleted successfully',
        type: 'success'
      })
      selectedTask.value = null
      await fetchTasks()
    } else {
      throw new Error(response.data.result?.message || 'Failed to delete task')
    }
  } catch (error) {
    console.error('Error deleting task:', error)
    showToast({
      message: error.message || 'Failed to delete task',
      type: 'error'
    })
  }
}

// Watch filters
watch(filters, () => {
  fetchTasks()
}, { deep: true })

// Lifecycle
onMounted(() => {
  fetchProjects()
  fetchDepartments()
  fetchTaskTypes()
  fetchTasks()
})
</script>

<style>
.sortable-ghost {
  opacity: 0.5;
  background: #f9fafb !important;
}

.sortable-drag {
  opacity: 0.8;
}

/* Hide scrollbar but keep functionality */
.overflow-x-auto {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.overflow-x-auto::-webkit-scrollbar {
  display: none;
}
</style>