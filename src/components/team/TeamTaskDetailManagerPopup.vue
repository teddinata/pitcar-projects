<!-- src/components/team/TeamTaskDetailManager.vue -->
<template>
  <!-- Modal Popup untuk Detail Task -->
  <Teleport to="body">
    <div 
      v-if="show" 
      class="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title" 
      role="dialog" 
      aria-modal="true"
    >
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <!-- Background overlay -->
        <div 
          class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity backdrop-blur-sm" 
          aria-hidden="true"
          @click="closeModal"
        ></div>

        <!-- Modal panel -->
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div 
          class="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full"
        >
          <!-- Loading state -->
          <div v-if="loading" class="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center z-10">
            <div class="animate-spin rounded-full h-8 w-8 border-2 border-red-600 border-t-transparent"></div>
          </div>

          <!-- Header with Gradient -->
          <div class="relative bg-gradient-to-r from-red-500 to-red-600 px-6 py-4">
            <div class="flex items-center justify-between">
              <h3 class="text-xl font-medium text-white">Task Details</h3>
              <button @click="closeModal" class="text-white hover:text-gray-200 focus:outline-none">
                <span class="sr-only">Close</span>
                <X class="h-5 w-5" />
              </button>
            </div>
          </div>
          
          <!-- Task Title Section -->
          <div class="px-6 pt-5 pb-4 border-b border-gray-100">
            <h2 class="text-xl font-semibold text-gray-900">{{ task.name }}</h2>
            
            <!-- Status and Priority Badges -->
            <div class="flex flex-wrap gap-2 mt-3">
              <!-- Status Badge -->
              <div 
                class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                :class="getStatusClass(task.state)"
              >
                <div class="w-2 h-2 rounded-full mr-2"
                  :class="{
                    'bg-yellow-500': task.state === 'in_progress',
                    'bg-green-500': task.state === 'done',
                    'bg-gray-500': task.state === 'draft',
                    'bg-purple-500': task.state === 'planned',
                    'bg-blue-500': task.state === 'review'
                  }"
                ></div>
                {{ formatStatus(task.state) }}
              </div>
              
              <!-- Priority Badge -->
              <div 
                v-if="task.priority"
                class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                :class="{
                  'bg-blue-100 text-blue-800': task.priority === '0',
                  'bg-green-100 text-green-800': task.priority === '1',
                  'bg-orange-100 text-orange-800': task.priority === '2',
                  'bg-red-100 text-red-800': task.priority === '3'
                }"
              >
                <FlagIcon class="w-3.5 h-3.5 mr-1.5" />
                {{ formatPriority(task.priority) }} Priority
              </div>
              
              <!-- Task Type Badge (if available) -->
              <div v-if="task.type?.name" class="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-sm font-medium">
                <BookmarkIcon class="w-3.5 h-3.5 mr-1.5" />
                {{ task.type.name }}
              </div>
            </div>
          </div>
          
          <!-- Task Details Content -->
          <div class="px-6 py-4 max-h-[80vh] overflow-y-auto custom-scrollbar">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <!-- Left Column: Task Information -->
              <div class="space-y-5">
                <!-- Timeline -->
                <div class="bg-gray-50 rounded-lg p-5 border border-gray-100">
                  <h4 class="text-sm font-medium text-gray-700 mb-3 flex items-center">
                    <CalendarIcon class="w-4 h-4 mr-1.5 text-red-500" />
                    Timeline
                  </h4>
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <div class="text-xs text-gray-500 mb-1">Start Date</div>
                      <div class="text-sm font-medium">
                        {{ formatDate(task.dates?.planned_start) || 'Not set' }}
                      </div>
                    </div>
                    <div>
                      <div class="text-xs text-gray-500 mb-1">Due Date</div>
                      <div 
                        class="text-sm font-medium"
                        :class="{'text-red-600': isOverdue(task.dates?.planned_end)}"
                      >
                        {{ formatDate(task.dates?.planned_end) || 'Not set' }}
                        <span v-if="isOverdue(task.dates?.planned_end)" class="text-xs ml-1.5 font-normal text-red-500">(Overdue)</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- Progress -->
                <div class="bg-gray-50 rounded-lg p-4 border border-gray-100">
                  <h4 class="text-sm font-medium text-gray-700 mb-3 flex items-center">
                    <ChartBarIcon class="w-4 h-4 mr-1.5 text-red-500" />
                    Progress
                  </h4>
                  <div class="mb-2 flex justify-between items-center">
                    <div class="text-sm font-medium">Completion: {{ task.progress || 0 }}%</div>
                    <div class="text-xs text-gray-500">
                      {{ task.hours?.actual || 0 }}/{{ task.hours?.planned || 0 }} hours
                    </div>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      class="h-2.5 rounded-full transition-all duration-300"
                      :class="{
                        'bg-red-500': (task.progress || 0) < 30,
                        'bg-orange-500': (task.progress || 0) >= 30 && (task.progress || 0) < 70,
                        'bg-green-500': (task.progress || 0) >= 70
                      }"
                      :style="{ width: `${task.progress || 0}%` }"
                    ></div>
                  </div>
                </div>
                
                <!-- Assigned Team Members -->
                <div class="bg-gray-50 rounded-lg p-4 border border-gray-100">
                  <h4 class="text-sm font-medium text-gray-700 mb-3 flex items-center">
                    <UsersIcon class="w-4 h-4 mr-1.5 text-red-500" />
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
                
                <!-- Project Info -->
                <div class="bg-gray-50 rounded-lg p-4 border border-gray-100">
                  <h4 class="text-sm font-medium text-gray-700 mb-3 flex items-center">
                    <FolderIcon class="w-4 h-4 mr-1.5 text-red-500" />
                    Project
                  </h4>
                  <div class="text-sm text-gray-800">
                    {{ task.project ? task.project.name : 'Not assigned to a project' }}
                  </div>
                </div>
                
                <!-- Description -->
                <div class="bg-gray-50 rounded-lg p-4 border border-gray-100">
                  <h4 class="text-sm font-medium text-gray-700 mb-3 flex items-center">
                    <DocumentTextIcon class="w-4 h-4 mr-1.5 text-red-500" />
                    Description
                  </h4>
                  <div 
                    class="prose prose-sm max-w-none text-gray-700" 
                    v-html="task.description || 'No description provided'"
                  ></div>
                </div>
              </div>
              
              <!-- Right Column: Checklist & Timesheet side by side -->
              <div class="space-y-4">
                <!-- Checklist Section -->
                <div class="bg-gray-50 rounded-lg p-4 border border-gray-100">
                  <div class="flex items-center justify-between mb-3">
                    <h4 class="text-sm font-medium text-gray-700 flex items-center">
                      <CheckIcon class="w-4 h-4 mr-1.5 text-red-500" />
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
                  
                  <TeamTaskChecklistManager 
                    :taskId="taskId" 
                    :employees="getTaskAssignees()"
                    @update:progress="updateTaskProgress"
                  />
                </div>
                
                <!-- Timesheet Section -->
                <div class="bg-gray-50 rounded-lg p-4 border border-gray-100">
                  <div class="flex items-center justify-between mb-3">
                    <h4 class="text-sm font-medium text-gray-700 flex items-center">
                      <ClockIcon class="w-4 h-4 mr-1.5 text-red-500" />
                      Time Tracking
                    </h4>
                  </div>
                  
                  <TeamTaskTimesheetManager 
                    :taskId="taskId" 
                    :employees="getTaskAssignees()"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <!-- Footer Actions -->
          <div class="bg-gray-50 px-6 py-4 flex flex-wrap justify-between gap-3 border-t border-gray-100">
            <!-- Tab Navigation for small screens -->
            <div class="sm:hidden flex space-x-2">
              <button
                @click="currentTab = 'checklist'"
                class="px-3 py-1.5 text-xs font-medium rounded-md"
                :class="currentTab === 'checklist' 
                  ? 'bg-red-100 text-red-700 border border-red-300' 
                  : 'border border-gray-300 text-gray-700 bg-white'"
              >
                Checklist
              </button>
              <button
                @click="currentTab = 'timesheets'"
                class="px-3 py-1.5 text-xs font-medium rounded-md"
                :class="currentTab === 'timesheets' 
                  ? 'bg-red-100 text-red-700 border border-red-300' 
                  : 'border border-gray-300 text-gray-700 bg-white'"
              >
                Timesheets
              </button>
            </div>
            
            <div class="flex gap-3 ml-auto">
              <button
                @click="closeModal"
                class="px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Close
              </button>
              <button
                @click="editTask"
                class="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 flex items-center"
              >
                <PencilIcon class="w-4 h-4 mr-1.5" />
                Edit Task
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { useToast } from '@/composables/useToast';
import apiClient from '@/config/api';
import {
  PencilIcon,
  CalendarIcon,
  ChartBarIcon,
  UsersIcon,
  FolderIcon,
  DocumentTextIcon,
  CheckIcon,
  ClockIcon,
  FlagIcon,
  BookmarkIcon
} from '@heroicons/vue/24/outline';
import { ListChecks, X } from 'lucide-vue-next';
import TeamTaskChecklistManager from '@/components/team/TeamTaskChecklistManager.vue';
import TeamTaskTimesheetManager from '@/components/team/TeamTaskTimesheetManager.vue';

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  taskId: {
    type: [Number, String],
    required: true
  }
});

const emit = defineEmits(['update:task', 'edit:task', 'close']);

const { toast, showToast } = useToast();
const task = ref({});
const loading = ref(false);
const currentTab = ref(''); // Empty means no tab is active, show summary view

// Methods
const fetchTaskDetails = async () => {
  if (!props.taskId) return;
  
  loading.value = true;
  try {
    const response = await apiClient.post('/web/v2/team/tasks', {
      jsonrpc: '2.0',
      method: 'call',
      params: {
        operation: 'read',
        task_id: parseInt(props.taskId)
      }
    });
    
    if (response.data.result?.status === 'success') {
      task.value = response.data.result.data || {};
      emit('update:task', task.value);
    } else {
      showToast({
        message: 'Error fetching task details: ' + 
          (response.data.result?.message || 'Unknown error'),
        type: 'error'
      });
    }
  } catch (error) {
    console.error('Error fetching task details:', error);
    showToast({
      message: 'Failed to load task details. Please try again.',
      type: 'error'
    });
  } finally {
    loading.value = false;
  }
};

const formatDate = (dateString) => {
  if (!dateString) return null;
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (e) {
    console.error('Error formatting date:', e);
    return dateString;
  }
};

const isOverdue = (dateString) => {
  if (!dateString) return false;
  
  try {
    const dueDate = new Date(dateString);
    const now = new Date();
    
    return dueDate < now && task.value.state !== 'done' && task.value.state !== 'cancelled';
  } catch (e) {
    return false;
  }
};

const formatStatus = (status) => {
  const statusMap = {
    'draft': 'Draft',
    'planned': 'Planned',
    'in_progress': 'In Progress',
    'review': 'In Review',
    'revision': 'Revision',
    'done': 'Completed',
    'cancelled': 'Cancelled'
  };
  return statusMap[status] || status;
};

const formatPriority = (priority) => {
  const priorityMap = {
    '0': 'Low',
    '1': 'Medium',
    '2': 'High',
    '3': 'Critical'
  };
  return priorityMap[priority] || 'Medium';
};

const getStatusClass = (status) => {
  const classMap = {
    'draft': 'bg-gray-100 text-gray-800',
    'planned': 'bg-blue-100 text-blue-800',
    'in_progress': 'bg-yellow-100 text-yellow-800',
    'review': 'bg-purple-100 text-purple-800',
    'revision': 'bg-indigo-100 text-indigo-800',
    'done': 'bg-green-100 text-green-800',
    'cancelled': 'bg-red-100 text-red-800'
  };
  return classMap[status] || 'bg-gray-100 text-gray-800';
};

const editTask = () => {
  emit('edit:task', task.value);
  closeModal();
};

const closeModal = () => {
  currentTab.value = ''; // Reset tab
  emit('close');
};

const updateTaskProgress = async (progress) => {
  try {
    const response = await apiClient.post('/web/v2/team/tasks', {
      jsonrpc: '2.0',
      method: 'call',
      params: {
        operation: 'update',
        task_id: parseInt(props.taskId),
        progress: progress
      }
    });
    
    if (response.data.result?.status === 'success') {
      task.value = response.data.result.data;
      emit('update:task', task.value);
    } else {
      console.error('Error updating task progress:', response.data.result?.message);
    }
  } catch (error) {
    console.error('Error updating task progress:', error);
  }
};

// Helper to get assignees for the checklist component
const getTaskAssignees = () => {
  if (!task.value || !task.value.assigned_to) return [];
  return task.value.assigned_to.map(person => ({
    id: person.id,
    name: person.name
  }));
};

// Helper to get initials from name
const getInitials = (name) => {
  if (!name) return '';
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

// Lifecycle hooks
watch(() => props.show, (newShow) => {
  if (newShow && props.taskId) {
    fetchTaskDetails();
  }
});

// Watch for changes in taskId
watch(() => props.taskId, (newTaskId) => {
  if (props.show && newTaskId) {
    fetchTaskDetails();
  }
});

// Initial fetch if modal is shown
onMounted(() => {
  if (props.show && props.taskId) {
    fetchTaskDetails();
  }
});
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
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

/* Animations for modal */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

@media (min-width: 1024px) {
  .lg\:grid-cols-2 {
    grid-template-columns: 45% 55%; /* Memberikan lebih banyak ruang ke kolom checklist/timesheet */
  }
}

@media (min-width: 1536px) {
  /* Untuk layar yang lebih besar */
  .sm\:max-w-6xl {
    max-width: 80rem; /* Memperbesar modal pada layar extra large */
  }
}
</style>