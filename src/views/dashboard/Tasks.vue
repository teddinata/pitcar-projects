<!-- src/views/dashboard/Tasks.vue -->
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
          <h1 class="text-xl sm:text-2xl font-semibold text-gray-900">Tasks</h1>
          
          <div class="flex flex-wrap gap-3">
            <!-- Filters -->
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
              v-model="filters.content_type"
              class="rounded-lg border-gray-300 text-sm focus:ring-red-500 focus:border-red-500"
            >
              <option value="">All Types</option>
              <option value="video">Video</option>
              <option value="design">Design</option>
            </select>

            <button
              @click="showCreateModal = true"
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
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
                <TaskCard 
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
                <TaskCard 
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
                <TaskCard 
                  :task="task" 
                  :show-meta="true"
                  @click="openTaskDetail(task)" 
                />
              </template>
            </Draggable>
          </div>
        </div>

        <!-- Revision Column -->
        <div class="flex-shrink-0 w-80">
          <div class="bg-purple-50 rounded-lg p-4">
            <div class="flex items center justify-between mb-4">
              <h3 class="text-sm font-medium text-gray-900">Revision</h3>
              <span class="text-xs font-medium text-gray-500 bg-white px-2 py-1 rounded-full">
                {{ revisionTasks.length }}
              </span>
            </div>

            <Draggable
              v-model="revisionTasks"
              :group="{ name: 'tasks' }"
              item-key="id"
              class="space-y-3 min-h-[200px]"
              @end="handleDragEnd"
              data-state="revision"
            >
              <template #item="{ element: task }">
                <TaskCard 
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
                <TaskCard 
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
    <TaskDetailModal
      v-if="selectedTask && !showRevisionDialog" 
      :show="!!selectedTask && !showRevisionDialog"
      :task="selectedTask"
      @close="selectedTask = null"
      @update="handleTaskUpdate"
      @delete="handleTaskDelete"
    />

    <RevisionDialog
      v-if="showRevisionDialog && selectedTask"
      :show="showRevisionDialog"
      :task-id="selectedTask.id"
      @close="handleCloseRevisionDialog"
      @submit="handleRevisionSubmit"
    />

    <!-- Create Task Modal -->
    <TaskFormModal
      v-if="showCreateModal"
      :show="showCreateModal"
      :projects="projects"
      :project-id="filters.project_id || null"
      @close="handleCloseTaskModal"
      @submit="handleTaskCreate"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { format } from 'date-fns'
import Draggable from 'vuedraggable'
import { Plus, FolderGit2, Calendar, Loader2 } from 'lucide-vue-next'
import { useToast } from '@/composables/useToast'
import apiClient from '@/config/api'

// Components
import TaskDetailModal from '@/components/tasks/TaskDetailModal.vue'
import TaskFormModal from '@/components/tasks/TaskFormModal.vue'
import RevisionDialog from '@/components/tasks/RevisionDialog.vue'
import TaskCard from '@/components/tasks/TaskCard.vue'
import Badge from '@/components/Badge.vue'
import Toast from '@/components/Toast.vue'

const { toast, showToast } = useToast()

// State
const tasks = ref([])
const projects = ref([])
const showCreateModal = ref(false)
const selectedTask = ref(null)
const loading = ref(false)
const showRevisionDialog = ref(false)

const filters = ref({
  project_id: '',
  content_type: '',
  assigned_to: ''
})

// Computed
const draftTasks = computed(() => {
  return tasks.value.filter(task => task.state === 'draft')
})

const inProgressTasks = computed(() => {
  return tasks.value.filter(task => task.state === 'in_progress')
})

const reviewTasks = computed(() => {
  return tasks.value.filter(task => task.state === 'review')
})

const revisionTasks = computed(() => {
  return tasks.value.filter(task => task.state === 'revision')
})

const completedTasks = computed(() => {
  return tasks.value.filter(task => task.state === 'done')
})

// Methods
const fetchTasks = async () => {
  try {
    loading.value = true
    const response = await apiClient.post('/web/v2/content/tasks', {
      jsonrpc: '2.0',
      method: 'call',
      params: {
        operation: 'get',
        ...filters.value
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

const handleTaskCreate = async (formData) => {
  try {
    // Validate and clean assigned_to data
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
    if (!formData.content_type) {
      throw new Error('Content type is required');
    }
    if (!assignedTo.length) {
      throw new Error('Please select at least one assignee');
    }

    loading.value = true;

    const payload = {
      jsonrpc: '2.0',
      method: 'call',
      params: {
        operation: 'create',
        name: formData.name.trim(),
        project_id: Number(formData.project_id),
        content_type: formData.content_type,
        assigned_to: assignedTo.map(id => Number(id)),
        reviewer_id: formData.reviewer_id ? Number(formData.reviewer_id) : null,
        planned_date_start: formData.planned_date_start || null,
        planned_date_end: formData.planned_date_end || null,
        planned_hours: formData.planned_hours ? Number(formData.planned_hours) : null,
        description: formData.description?.trim() || null
      }
    };

    console.log('Creating task with payload:', payload);

    const response = await apiClient.post('/web/v2/content/tasks', payload);

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
    const response = await apiClient.post('/web/v2/content/tasks', {
      jsonrpc: '2.0',
      method: 'call',
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
    if (!newState) return;

    // For revision state, handle differently
    if (newState === 'revision') {
      selectedTask.value = { ...task };
      showRevisionDialog.value = true;
      return; // Don't make the API call yet
    }

    const response = await apiClient.post('/web/v2/content/tasks', {
      jsonrpc: '2.0',
      method: 'call',
      params: {
        operation: 'update_status',
        task_id: task.id,
        new_status: newState,
        is_drag: true
      }
    });

    if (response.data.result?.status === 'success') {
      await fetchTasks();
    }
  } catch (error) {
    console.error('Error:', error);
    await fetchTasks();
  }
};

const handleRevisionSubmit = async (formData) => {
  try {
    if (!selectedTask.value?.id) {
      showToast({
        message: 'Task not found for revision!',
        type: 'error'
      });
      return;
    }

    // The formData.deadline is now already in the correct format from RevisionDialog
    const response = await apiClient.post('/web/v2/content/tasks', {
      jsonrpc: '2.0',
      method: 'call',
      params: {
        operation: 'update_status',
        task_id: selectedTask.value.id,
        new_status: 'revision',
        is_drag: false,
        feedback: formData.feedback,
        revision_points: formData.revision_points,
        deadline: formData.deadline // Now properly formatted from RevisionDialog
      }
    });

    if (response.data.result?.status === 'success') {
      showToast({
        message: 'Revision request submitted successfully!',
        type: 'success'
      });
      showRevisionDialog.value = false;
      selectedTask.value = null;
      await fetchTasks();
    } else {
      throw new Error(response.data.result?.message || 'Failed to submit revision');
    }
  } catch (error) {
    console.error('Error:', error);
    showToast({
      message: error.message || 'Failed to submit revision request!',
      type: 'error'
    });
  }
};


const handleCloseRevisionDialog = () => {
  showRevisionDialog.value = false;
  selectedTask.value = null;
  fetchTasks(); // Refresh tasks after closing
};

const openTaskDetail = (task) => {
  if (!showRevisionDialog.value) {
    selectedTask.value = task;
  }
};

// Add to Tasks.vue
// Di Tasks.vue, tambahkan handler
const handleTaskDelete = async (taskId) => {
  try {
    const response = await apiClient.post('/web/v2/content/tasks', {
      jsonrpc: '2.0',
      method: 'call',
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
  fetchTasks()
  fetchProjects()
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