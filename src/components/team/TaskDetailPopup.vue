<!-- src/components/team/TaskDetailModal.vue -->
<template>
  <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto" @click="handleBackdropClick">
    <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

      <!-- Centering trick -->
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

      <!-- Modal panel -->
      <div 
        class="relative inline-block bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
        @click.stop
      >
        <!-- Modal header -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">
            Task Details
          </h3>
          <button 
            @click="closeModal" 
            class="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <XMarkIcon class="h-6 w-6" />
          </button>
        </div>

        <!-- Loading state -->
        <div v-if="loading" class="px-6 py-10 flex justify-center">
          <div class="animate-spin rounded-full h-8 w-8 border-2 border-red-600 border-t-transparent"></div>
        </div>

        <!-- Error state -->
        <div v-else-if="error" class="px-6 py-6 text-center">
          <ExclamationCircleIcon class="mx-auto h-12 w-12 text-red-400 mb-4" />
          <h3 class="text-lg font-medium text-gray-900 mb-2">Error Loading Task</h3>
          <p class="text-sm text-gray-500">{{ error }}</p>
          <button 
            @click="loadTaskDetails" 
            class="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-rose-600 to-rose-500 focus:outline-none"
          >
            <ArrowPathIcon class="h-4 w-4 mr-1.5" />
            Retry
          </button>
        </div>

        <!-- Task details -->
        <div v-else-if="task" class="px-6 py-4">
          <div class="space-y-4">
            <!-- Task name and status -->
            <div class="flex justify-between items-start">
              <h3 class="text-lg font-semibold text-gray-900">{{ task.name }}</h3>
              <span 
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" 
                :class="getStatusClass(task.state)"
              >
                {{ formatState(task.state) }}
              </span>
            </div>

            <!-- Project name -->
            <div v-if="task.project" class="flex items-center text-sm text-gray-600">
              <FolderOpenIcon class="h-4 w-4 mr-1.5 text-gray-400" />
              <span>{{ task.project.name }}</span>
            </div>

            <!-- Task dates -->
            <div class="flex flex-col space-y-2">
              <div class="flex items-center text-sm">
                <CalendarIcon class="h-4 w-4 mr-1.5 text-gray-400" />
                <span class="font-medium">Planned dates:</span>
                <span class="ml-1">
                  {{ formatDate(task.dates?.planned_start) }} - {{ formatDate(task.dates?.planned_end) }}
                </span>
              </div>
              <div v-if="task.dates?.actual_start || task.dates?.actual_end" class="flex items-center text-sm">
                <ClockIcon class="h-4 w-4 mr-1.5 text-gray-400" />
                <span class="font-medium">Actual dates:</span>
                <span class="ml-1">
                  {{ formatDate(task.dates?.actual_start) }} - {{ formatDate(task.dates?.actual_end) }}
                </span>
              </div>
            </div>

            <!-- Progress -->
            <div class="space-y-1">
              <div class="flex justify-between items-center">
                <span class="text-sm font-medium text-gray-700">Progress</span>
                <span class="text-sm text-gray-500">{{ task.progress }}%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div 
                  class="h-2 rounded-full" 
                  :class="getProgressColorClass(task.progress)"
                  :style="{ width: `${task.progress}%` }"
                ></div>
              </div>
            </div>

            <!-- Assigned to -->
            <div class="space-y-1">
              <div class="text-sm font-medium text-gray-700">Assigned to</div>
              <div v-if="task.assigned_to && task.assigned_to.length > 0" class="flex flex-wrap gap-2">
                <div 
                  v-for="person in task.assigned_to" 
                  :key="person.id"
                  class="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-gray-100 text-gray-800"
                >
                  <UserIcon class="h-4 w-4 mr-1 text-gray-500" />
                  {{ person.name }}
                </div>
              </div>
              <div v-else class="text-sm italic text-gray-500">
                No users assigned
              </div>
            </div>

            <!-- Description -->
            <div class="space-y-1">
              <div class="text-sm font-medium text-gray-700">Description</div>
              <div v-if="task.description" class="prose prose-sm text-gray-500 max-w-none">
                <p>{{ task.description }}</p>
              </div>
              <div v-else class="text-sm italic text-gray-500">
                No description provided
              </div>
            </div>

            <!-- Checklist if available -->
            <div v-if="task.checklist_progress !== undefined" class="space-y-1">
              <div class="flex justify-between items-center">
                <span class="text-sm font-medium text-gray-700">Checklist</span>
                <span class="text-sm text-gray-500">{{ task.checklist_progress }}%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div 
                  class="h-2 rounded-full bg-green-500"
                  :style="{ width: `${task.checklist_progress}%` }"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal footer with actions -->
        <div v-if="task" class="bg-gray-50 px-6 py-3 flex justify-between">
          <button 
            @click="closeModal" 
            class="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none"
          >
            Close
          </button>
          <div>
            <button 
              @click="editTask" 
              class="inline-flex justify-center ml-3 px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none"
            >
              <PencilIcon class="h-4 w-4 mr-1.5" />
              Edit Task
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { 
  XMarkIcon, 
  CalendarIcon, 
  ClockIcon, 
  UserIcon, 
  ExclamationCircleIcon,
  ArrowPathIcon,
  PencilIcon,
  FolderOpenIcon
} from '@heroicons/vue/24/outline';
import apiClient from '@/config/api';
import { format, parseISO } from 'date-fns';

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  taskId: {
    type: [Number, String],
    default: null
  }
});

const emit = defineEmits(['close', 'edit-task']);

// State
const task = ref(null);
const loading = ref(false);
const error = ref(null);

// Load task details when the modal opens and taskId is available
watch(
  () => [props.show, props.taskId],
  ([newShow, newTaskId]) => {
    if (newShow && newTaskId) {
      loadTaskDetails();
    } else if (!newShow) {
      // Reset state when modal closes
      task.value = null;
      error.value = null;
    }
  },
  { immediate: true }
);

// Methods
function loadTaskDetails() {
  if (!props.taskId) return;
  
  loading.value = true;
  error.value = null;
  
  apiClient.post('/web/v2/team/tasks', {
    jsonrpc: '2.0',
    id: new Date().getTime(),
    params: {
      operation: 'read',
      task_id: props.taskId
    }
  })
    .then(response => {
      if (response.data.result?.status === 'success') {
        task.value = response.data.result.data;
      } else {
        error.value = response.data.result?.message || 'Failed to load task details';
      }
    })
    .catch(err => {
      console.error('Error loading task details:', err);
      error.value = 'An error occurred while loading task details. Please try again.';
    })
    .finally(() => {
      loading.value = false;
    });
}

function formatDate(dateString) {
  if (!dateString) return 'Not set';
  
  try {
    return format(parseISO(dateString), 'MMM d, yyyy');
  } catch (e) {
    console.error('Error formatting date:', e);
    return dateString || 'Not set';
  }
}

function formatState(state) {
  if (!state) return '';
  
  // Convert snake_case to Title Case
  return state
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function getStatusClass(state) {
  const classes = {
    'draft': 'bg-gray-100 text-gray-800',
    'planned': 'bg-blue-100 text-blue-800',
    'in_progress': 'bg-green-100 text-green-800',
    'review': 'bg-purple-100 text-purple-800',
    'done': 'bg-indigo-100 text-indigo-800',
    'cancelled': 'bg-red-100 text-red-800'
  };
  
  return classes[state] || 'bg-gray-100 text-gray-800';
}

function getProgressColorClass(progress) {
  if (progress >= 100) {
    return 'bg-green-500';
  } else if (progress >= 75) {
    return 'bg-green-400';
  } else if (progress >= 50) {
    return 'bg-yellow-400';
  } else if (progress >= 25) {
    return 'bg-orange-400';
  } else {
    return 'bg-red-400';
  }
}

function closeModal() {
  emit('close');
}

function editTask() {
  emit('edit-task', task.value);
}

function handleBackdropClick(event) {
  if (event.target === event.currentTarget) {
    closeModal();
  }
}
</script>