<!-- src/components/team/TaskDetailModal.vue -->
<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="show"
        class="fixed inset-0 z-50 overflow-y-auto"
        role="dialog"
        aria-modal="true"
      >
        <!-- Backdrop -->
        <div
          class="fixed inset-0 bg-black bg-opacity-60 transition-opacity"
          @click="$emit('close')"
        ></div>

        <!-- Modal Container -->
        <div class="flex items-center justify-center min-h-screen p-4">
          <Transition
            enter-active-class="transition ease-out duration-300"
            enter-from-class="transform opacity-0 scale-95"
            enter-to-class="transform opacity-100 scale-100"
            leave-active-class="transition ease-in duration-200"
            leave-from-class="transform opacity-100 scale-100"
            leave-to-class="transform opacity-0 scale-95"
          >
            <div
              v-if="show"
              class="bg-white rounded-lg shadow-xl overflow-hidden w-full max-w-4xl mx-auto relative z-10 transform transition-all"
            >
              <!-- Loading State -->
              <div
                v-if="loading"
                class="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10"
              >
                <div class="animate-spin rounded-full h-8 w-8 border-2 border-red-600 border-t-transparent"></div>
              </div>

              <!-- Modal Header -->
              <div class="bg-gray-50 px-5 py-4 flex items-center justify-between border-b border-gray-200">
                <div class="flex items-center space-x-3">
                  <div 
                    class="w-3 h-3 rounded-full"
                    :class="getStatusDotClass(task.state)"
                  ></div>
                  <h2 class="text-xl font-bold text-gray-900 truncate">
                    {{ task.name }}
                  </h2>
                </div>
                <button
                  type="button"
                  class="rounded-md p-1.5 text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                  @click="$emit('close')"
                >
                  <span class="sr-only">Close</span>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <!-- Modal Body -->
              <div class="p-6">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <!-- Left Column: Task Details -->
                  <div class="md:col-span-2 space-y-6">
                    <!-- Project Info -->
                    <div class="bg-gray-50 p-4 rounded-md">
                      <div class="text-sm text-gray-500 mb-1">Project</div>
                      <div class="font-medium">{{ task.project?.name || 'No project' }}</div>
                    </div>

                    <!-- Description -->
                    <div>
                      <h3 class="text-base font-medium text-gray-900 mb-2">Description</h3>
                      <div class="bg-gray-50 p-4 rounded-md prose prose-sm max-w-none">
                        <p v-if="task.description">{{ task.description }}</p>
                        <p v-else class="text-gray-500 italic">No description provided</p>
                      </div>
                    </div>

                    <!-- Checklist -->
                    <div v-if="task.checklists && task.checklists.length > 0">
                      <h3 class="text-base font-medium text-gray-900 mb-2">Checklist</h3>
                      <ul class="bg-gray-50 p-4 rounded-md divide-y divide-gray-200">
                        <li 
                          v-for="item in task.checklists" 
                          :key="item.id"
                          class="py-2 flex items-start space-x-3"
                        >
                          <input 
                            type="checkbox" 
                            disabled 
                            :checked="item.is_done"
                            class="h-4 w-4 mt-1 text-red-600 border-gray-300 rounded"
                          />
                          <div>
                            <p :class="{'line-through text-gray-500': item.is_done}">
                              {{ item.name }}
                            </p>
                            <p v-if="item.assigned_to" class="text-xs text-gray-500">
                              Assigned to: {{ item.assigned_to.name }}
                            </p>
                          </div>
                        </li>
                      </ul>
                    </div>

                    <!-- Timesheet Entries -->
                    <div v-if="task.timesheets && task.timesheets.length > 0">
                      <h3 class="text-base font-medium text-gray-900 mb-2">Time Tracking</h3>
                      <div class="bg-gray-50 p-4 rounded-md">
                        <table class="min-w-full divide-y divide-gray-200">
                          <thead>
                            <tr>
                              <th class="text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                              <th class="text-left text-xs font-medium text-gray-500 uppercase">Person</th>
                              <th class="text-left text-xs font-medium text-gray-500 uppercase">Hours</th>
                              <th class="text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                            </tr>
                          </thead>
                          <tbody class="divide-y divide-gray-200">
                            <tr v-for="entry in task.timesheets" :key="entry.id">
                              <td class="py-2 text-sm text-gray-900">{{ formatDate(entry.date) }}</td>
                              <td class="py-2 text-sm text-gray-900">{{ entry.employee?.name || '-' }}</td>
                              <td class="py-2 text-sm text-gray-900">{{ entry.hours }}</td>
                              <td class="py-2 text-sm text-gray-500">{{ entry.description || '-' }}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  <!-- Right Column: Status, Dates, People -->
                  <div class="space-y-6">
                    <!-- Status & Progress -->
                    <div class="bg-gray-50 p-4 rounded-md">
                      <div class="mb-3">
                        <div class="text-sm text-gray-500 mb-1">Status</div>
                        <div
                          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                          :class="getStatusClass(task.state)"
                        >
                          {{ formatStatus(task.state) }}
                        </div>
                      </div>
                      
                      <div>
                        <div class="text-sm text-gray-500 mb-1">Progress</div>
                        <div class="flex items-center">
                          <div class="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                            <div 
                              class="bg-red-600 h-2.5 rounded-full" 
                              :style="{ width: `${task.progress || 0}%` }"
                            ></div>
                          </div>
                          <span class="text-sm font-medium">{{ task.progress || 0 }}%</span>
                        </div>
                      </div>
                    </div>

                    <!-- Dates -->
                    <div class="bg-gray-50 p-4 rounded-md">
                      <h3 class="text-sm font-medium text-gray-900 mb-2">Timeline</h3>
                      
                      <div class="grid grid-cols-2 gap-4">
                        <div>
                          <div class="text-sm text-gray-500 mb-1">Planned Start</div>
                          <div class="font-medium">{{ formatDate(task.dates?.planned_start) || 'Not set' }}</div>
                        </div>
                        <div>
                          <div class="text-sm text-gray-500 mb-1">Planned End</div>
                          <div class="font-medium">{{ formatDate(task.dates?.planned_end) || 'Not set' }}</div>
                        </div>
                      </div>
                      
                      <div class="border-t border-gray-200 mt-3 pt-3 grid grid-cols-2 gap-4">
                        <div>
                          <div class="text-sm text-gray-500 mb-1">Actual Start</div>
                          <div class="font-medium">{{ formatDate(task.dates?.actual_start) || 'Not started' }}</div>
                        </div>
                        <div>
                          <div class="text-sm text-gray-500 mb-1">Actual End</div>
                          <div class="font-medium">{{ formatDate(task.dates?.actual_end) || 'Not completed' }}</div>
                        </div>
                      </div>
                    </div>

                    <!-- Assigned People -->
                    <div class="bg-gray-50 p-4 rounded-md">
                      <h3 class="text-sm font-medium text-gray-900 mb-3">Assigned To</h3>
                      
                      <div class="space-y-2">
                        <div 
                          v-for="person in task.assigned_to" 
                          :key="person.id"
                          class="flex items-center space-x-3"
                        >
                          <div class="flex-shrink-0 h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                            <span class="text-xs font-medium text-red-700">{{ getInitials(person.name) }}</span>
                          </div>
                          <div class="text-sm font-medium">{{ person.name }}</div>
                        </div>
                        
                        <div v-if="!task.assigned_to || task.assigned_to.length === 0" class="text-sm text-gray-500 italic">
                          No one assigned
                        </div>
                      </div>
                    </div>

                    <!-- Hours -->
                    <div class="bg-gray-50 p-4 rounded-md">
                      <div class="grid grid-cols-2 gap-4">
                        <div>
                          <div class="text-sm text-gray-500 mb-1">Planned Hours</div>
                          <div class="font-medium">{{ task.hours?.planned || 0 }} hours</div>
                        </div>
                        <div>
                          <div class="text-sm text-gray-500 mb-1">Actual Hours</div>
                          <div class="font-medium">{{ task.hours?.actual || 0 }} hours</div>
                        </div>
                      </div>
                      
                      <!-- Progress bar comparing planned vs actual -->
                      <div v-if="task.hours?.planned > 0" class="mt-2">
                        <div class="text-xs text-gray-500 mb-1">Hours Utilization</div>
                        <div class="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            class="bg-blue-600 h-2.5 rounded-full" 
                            :style="{ width: `${Math.min(100, (task.hours.actual / task.hours.planned * 100))}%` }"
                          ></div>
                        </div>
                        <div class="flex justify-between text-xs mt-1">
                          <span>0%</span>
                          <span>{{ Math.round(task.hours.actual / task.hours.planned * 100) }}%</span>
                          <span>100%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Modal Footer -->
              <div class="bg-gray-50 px-5 py-4 flex justify-between border-t border-gray-200">
                <div>
                  <button
                    v-if="task.id"
                    type="button"
                    class="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-rose-600 to-rose-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    @click="$emit('edit-task', task)"
                  >
                    <PencilIcon class="h-4 w-4 mr-1.5" />
                    Edit Task
                  </button>
                </div>
                
                <button
                  type="button"
                  class="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  @click="$emit('close')"
                >
                  Close
                </button>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { format, parseISO } from 'date-fns';
import { PencilIcon, PlusIcon } from '@heroicons/vue/24/outline';
import apiClient from '@/config/api';


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

const task = ref({
  name: '',
  description: '',
  state: 'draft',
  progress: 0,
  project: null,
  assigned_to: [],
  dates: {},
  hours: {},
  checklists: [],
  timesheets: []
});

const loading = ref(false);
const error = ref(null);

// Fetch task details when taskId changes
watch(() => props.taskId, (newTaskId) => {
  if (newTaskId) {
    fetchTaskDetails(newTaskId);
  }
});

// Also fetch on mount if taskId is already set
onMounted(() => {
  if (props.taskId) {
    fetchTaskDetails(props.taskId);
  }
});

// Fetch task details
async function fetchTaskDetails(taskId) {
  loading.value = true;
  error.value = null;
  
  try {
    const response = await apiClient.post('/web/v2/team/tasks', {
      jsonrpc: '2.0',
      method: 'call',
      params: {
        operation: 'read',
        task_id: taskId
      }
    });
    
    if (response.data.result?.status === 'success') {
      task.value = response.data.result.data || {};
    } else {
      error.value = response.data.result?.message || 'Failed to load task details';
    }
  } catch (err) {
    console.error('Error fetching task details:', err);
    error.value = 'Error loading task details';
  } finally {
    loading.value = false;
  }
}

// Format date
function formatDate(dateString) {
  if (!dateString) return '';
  try {
    return format(parseISO(dateString), 'MMM d, yyyy');
  } catch (e) {
    return dateString;
  }
}

// Get status display name
function formatStatus(state) {
  const statusMap = {
    'draft': 'Draft',
    'planned': 'Planned',
    'in_progress': 'In Progress',
    'review': 'In Review',
    'done': 'Completed',
    'cancelled': 'Cancelled'
  };
  return statusMap[state] || state;
}

// Get status CSS class
function getStatusClass(state) {
  const classMap = {
    'draft': 'bg-gray-100 text-gray-800',
    'planned': 'bg-blue-100 text-blue-800',
    'in_progress': 'bg-yellow-100 text-yellow-800',
    'review': 'bg-purple-100 text-purple-800',
    'done': 'bg-green-100 text-green-800',
    'cancelled': 'bg-red-100 text-red-800'
  };
  return classMap[state] || 'bg-gray-100 text-gray-800';
}

// Get status dot color
function getStatusDotClass(state) {
  const classMap = {
    'draft': 'bg-gray-400',
    'planned': 'bg-blue-400',
    'in_progress': 'bg-yellow-400',
    'review': 'bg-purple-400',
    'done': 'bg-green-400',
    'cancelled': 'bg-red-400'
  };
  return classMap[state] || 'bg-gray-400';
}

// Get initials from name
function getInitials(name) {
  if (!name) return '';
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
}
</script>