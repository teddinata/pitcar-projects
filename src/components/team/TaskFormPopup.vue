<!-- src/components/team/TaskFormModal.vue -->
<template>
  <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto" @click="handleBackdropClick">
    <div class="flex items-end sm:items-center justify-center min-h-screen p-4 text-center sm:p-0">
      <!-- Backdrop overlay -->
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

      <!-- Modal panel -->
      <div 
        class="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-2xl sm:w-full"
        @click.stop
      >
        <!-- Loading overlay -->
        <div v-if="loading" class="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10">
          <div class="flex flex-col items-center">
            <div class="animate-spin rounded-full h-12 w-12 border-2 border-red-600 border-t-transparent"></div>
            <p class="mt-2 text-sm text-gray-600">{{ loadingMessage }}</p>
          </div>
        </div>

        <!-- Header with close button -->
        <div class="flex items-center justify-between px-6 pt-6 pb-4">
          <h3 class="text-lg font-medium text-gray-900">
            {{ task ? 'Edit Task' : 'Create New Task' }}
          </h3>
          <button 
            @click="closeModal" 
            class="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-full"
          >
            <XMarkIcon class="h-6 w-6" />
          </button>
        </div>

        <!-- Form -->
        <form @submit.prevent="submitForm">
          <div class="px-6 py-4 max-h-[calc(100vh-200px)] overflow-y-auto">
            <div class="space-y-5">
              <!-- Project selection -->
              <div>
                <label for="project" class="block text-sm font-medium text-gray-700">Project</label>
                <div class="mt-1 relative rounded-md">
                  <select 
                    id="project" 
                    v-model="formData.project_id" 
                    class="mt-1 block w-full pl-3 pr-10 py-2.5 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md"
                    :class="{ 'border-red-300': errors.project_id }"
                    required
                  >
                    <option value="" disabled>Select a project</option>
                    <option v-for="project in projects" :key="project.id" :value="project.id">
                      {{ project.name }}
                    </option>
                  </select>
                  <div v-if="errors.project_id" class="text-xs text-red-500 mt-1">{{ errors.project_id }}</div>
                </div>
              </div>

              <!-- Task name -->
              <div>
                <label for="name" class="block text-sm font-medium text-gray-700">Task Name</label>
                <div class="mt-1">
                  <input 
                    type="text" 
                    id="name" 
                    v-model="formData.name" 
                    class="block w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                    :class="{ 'border-red-300': errors.name }"
                    placeholder="Enter task name"
                    required
                  />
                  <div v-if="errors.name" class="text-xs text-red-500 mt-1">{{ errors.name }}</div>
                </div>
              </div>
              
              <!-- Task type -->
              <div>
                <label for="type" class="block text-sm font-medium text-gray-700">Type</label>
                <div class="mt-1 relative rounded-md">
                  <select 
                    id="type" 
                    v-model="formData.type_id" 
                    class="mt-1 block w-full pl-3 pr-10 py-2.5 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md"
                  >
                    <option value="" disabled>Select task type</option>
                    <option v-for="type in taskTypes" :key="type.id" :value="type.id">
                      {{ type.name }}
                    </option>
                  </select>
                </div>
              </div>

              <!-- Status selection -->
              <div>
                <label for="status" class="block text-sm font-medium text-gray-700">Status</label>
                <div class="mt-1 relative rounded-md">
                  <select 
                    id="status" 
                    v-model="formData.state" 
                    class="mt-1 block w-full pl-3 pr-10 py-2.5 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md"
                  >
                    <option value="draft">Draft</option>
                    <option value="planned">Planned</option>
                    <option value="in_progress">In Progress</option>
                    <option value="review">In Review</option>
                    <option value="done">Done</option>
                  </select>
                </div>
              </div>

              <!-- Priority selection with visual indicators -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <div class="flex space-x-3">
                  <label 
                    v-for="(option, index) in priorityOptions" 
                    :key="index"
                    class="relative flex-1"
                  >
                    <input 
                      type="radio" 
                      :value="option.value" 
                      v-model="formData.priority" 
                      class="sr-only"
                    />
                    <div 
                      class="cursor-pointer rounded-md border py-2.5 px-3 flex items-center justify-center text-sm font-medium focus:outline-none transition-colors"
                      :class="[
                        formData.priority === option.value 
                          ? `${option.activeClass} border-transparent ring-2 ${option.ringClass}` 
                          : 'bg-white border-gray-300 hover:bg-gray-50'
                      ]"
                    >
                      <component :is="option.icon" class="h-4 w-4 mr-1.5" />
                      {{ option.label }}
                    </div>
                  </label>
                </div>
              </div>

              <!-- Dates section -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label for="start_date" class="block text-sm font-medium text-gray-700">Start Date</label>
                  <div class="mt-1">
                    <input 
                      type="date" 
                      id="start_date" 
                      v-model="formData.planned_date_start" 
                      class="block w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                      :class="{ 'border-red-300': errors.planned_date_start }"
                    />
                    <div v-if="errors.planned_date_start" class="text-xs text-red-500 mt-1">{{ errors.planned_date_start }}</div>
                  </div>
                </div>
                
                <div>
                  <label for="end_date" class="block text-sm font-medium text-gray-700">End Date</label>
                  <div class="mt-1">
                    <input 
                      type="date" 
                      id="end_date" 
                      v-model="formData.planned_date_end" 
                      class="block w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                      :class="{ 'border-red-300': errors.planned_date_end }"
                    />
                    <div v-if="errors.planned_date_end" class="text-xs text-red-500 mt-1">{{ errors.planned_date_end }}</div>
                  </div>
                </div>
              </div>

              <!-- Planned hours -->
              <div>
                <label for="planned_hours" class="block text-sm font-medium text-gray-700">Planned Hours</label>
                <div class="mt-1">
                  <input 
                    type="number" 
                    id="planned_hours" 
                    v-model="formData.planned_hours" 
                    min="0"
                    step="0.5"
                    class="block w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                    placeholder="0"
                  />
                </div>
              </div>

              <!-- Progress slider -->
              <div>
                <div class="flex justify-between items-center">
                  <label for="progress" class="block text-sm font-medium text-gray-700">Progress</label>
                  <span class="text-sm text-gray-500">{{ formData.progress }}%</span>
                </div>
                <div class="mt-2">
                  <input 
                    type="range" 
                    id="progress" 
                    v-model.number="formData.progress" 
                    min="0" 
                    max="100" 
                    step="5"
                    class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-500"
                  />
                  <div class="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0%</span>
                    <span>50%</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>

              <!-- Assigned Users multi-select -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Assigned To</label>
                <div class="relative">
                  <div 
                    class="block w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus-within:ring-1 focus-within:ring-red-500 focus-within:border-red-500 cursor-pointer min-h-11"
                    :class="{ 'border-red-300': errors.assigned_to }"
                    @click="toggleUserDropdown"
                  >
                    <div v-if="selectedUsers.length === 0" class="text-gray-500 text-sm">Select team members</div>
                    <div v-else class="flex flex-wrap gap-2">
                      <div 
                        v-for="user in selectedUsers" 
                        :key="user.id"
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"
                      >
                        {{ user.name }}
                        <button 
                          type="button"
                          @click.stop="removeUser(user.id)" 
                          class="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full bg-red-200 text-red-500 hover:bg-red-300 hover:text-red-600"
                        >
                          <XMarkIcon class="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <!-- User dropdown -->
                  <div 
                    v-if="showUserDropdown"
                    class="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
                  >
                    <div class="sticky top-0 z-10 bg-white px-2 py-2 border-b">
                      <input 
                        type="text" 
                        v-model="userSearchTerm" 
                        @click.stop
                        placeholder="Search users..." 
                        class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                      />
                    </div>
                    <div v-if="filteredUsers.length === 0" class="px-4 py-3 text-sm text-gray-500">
                      No users found
                    </div>
                    <div v-else>
                      <div 
                        v-for="user in filteredUsers" 
                        :key="user.id"
                        @click.stop="toggleUser(user)"
                        class="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-100"
                      >
                        <div class="flex items-center">
                          <div class="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium mr-2">
                            {{ getInitials(user.name) }}
                          </div>
                          <span class="block truncate">{{ user.name }}</span>
                        </div>
                        <span 
                          v-if="isUserSelected(user.id)"
                          class="absolute inset-y-0 right-0 flex items-center pr-4 text-red-600"
                        >
                          <CheckIcon class="h-5 w-5" />
                        </span>
                      </div>
                    </div>
                  </div>
                  <div v-if="errors.assigned_to" class="text-xs text-red-500 mt-1">{{ errors.assigned_to }}</div>
                </div>
              </div>

              <!-- Description with character count -->
              <div>
                <div class="flex justify-between">
                  <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
                  <span class="text-xs text-gray-500">{{ formData.description?.length || 0 }}/500</span>
                </div>
                <div class="mt-1">
                  <textarea 
                    id="description" 
                    v-model="formData.description" 
                    rows="4" 
                    maxlength="500"
                    class="block w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm resize-y"
                    placeholder="Describe the task details..."
                  ></textarea>
                </div>
              </div>

              <!-- Server error message -->
              <div v-if="errors._server" class="p-3 bg-red-50 border border-red-200 rounded-md">
                <p class="text-sm text-red-600">{{ errors._server }}</p>
              </div>
            </div>
          </div>

          <!-- Footer buttons -->
          <div class="bg-gray-50 px-6 py-4 flex items-center justify-between">
            <button 
              type="button"
              @click="closeModal" 
              class="inline-flex justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Cancel
            </button>
            <div class="flex space-x-3">
              <button 
                v-if="task"
                type="button"
                @click="deleteTask" 
                class="inline-flex justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 hover:border-red-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <TrashIcon class="h-4 w-4 mr-1.5" />
                Delete
              </button>
              <button 
                type="submit"
                :disabled="loading"
                class="inline-flex justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gradient-to-r from-rose-600 to-rose-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CheckIcon class="h-4 w-4 mr-1.5" />
                {{ task ? 'Update Task' : 'Create Task' }}
              </button>
            </div>
          </div>
        </form>

        <!-- Delete confirmation dialog -->
        <div v-if="showDeleteConfirm" class="fixed inset-0 z-60 overflow-y-auto">
          <div class="flex items-end sm:items-center justify-center min-h-screen p-4 text-center sm:p-0">
            <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
            <div 
              class="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full"
            >
              <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div class="sm:flex sm:items-start">
                  <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <ExclamationCircleIcon class="h-6 w-6 text-red-600" />
                  </div>
                  <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 class="text-lg leading-6 font-medium text-gray-900">Delete Task</h3>
                    <div class="mt-2">
                      <p class="text-sm text-gray-500">
                        Are you sure you want to delete this task? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button 
                  type="button" 
                  class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  @click="confirmDelete"
                >
                  Delete
                </button>
                <button 
                  type="button" 
                  class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  @click="showDeleteConfirm = false"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';
import { 
  XMarkIcon, 
  CheckIcon, 
  ExclamationCircleIcon, 
  TrashIcon,
  FlagIcon,
  BoltIcon,
  ArrowDownIcon,
  ArrowUpIcon
} from '@heroicons/vue/24/outline';
import apiClient from '@/config/api';

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  task: {
    type: Object,
    default: null
  },
  projects: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['close', 'submit', 'delete']);

// State
const formData = ref({
  name: '',
  project_id: '',
  type_id: '',
  state: 'draft',
  priority: '1',
  planned_date_start: '',
  planned_date_end: '',
  planned_hours: 0,
  progress: 0,
  assigned_to: [],
  description: ''
});

const loading = ref(false);
const loadingMessage = ref('Loading...');
const errors = ref({});
const taskTypes = ref([]);
const allUsers = ref([]);
const selectedUsers = ref([]);
const showUserDropdown = ref(false);
const userSearchTerm = ref('');
const showDeleteConfirm = ref(false);

// Priority options with visual indicators
const priorityOptions = [
  { 
    label: 'Low', 
    value: '0', 
    icon: ArrowDownIcon, 
    activeClass: 'bg-blue-50 text-blue-700',
    ringClass: 'ring-blue-500'
  },
  { 
    label: 'Normal', 
    value: '1', 
    icon: FlagIcon, 
    activeClass: 'bg-green-50 text-green-700',
    ringClass: 'ring-green-500'
  },
  { 
    label: 'High', 
    value: '2', 
    icon: ArrowUpIcon, 
    activeClass: 'bg-yellow-50 text-yellow-700',
    ringClass: 'ring-yellow-500'
  },
  { 
    label: 'Critical', 
    value: '3', 
    icon: BoltIcon, 
    activeClass: 'bg-red-50 text-red-700',
    ringClass: 'ring-red-500'
  }
];

// Filter users based on search term
const filteredUsers = computed(() => {
  if (!userSearchTerm.value) return allUsers.value;
  
  const searchTermLower = userSearchTerm.value.toLowerCase();
  return allUsers.value.filter(user => 
    user.name.toLowerCase().includes(searchTermLower)
  );
});

// Initialize form data when task is provided
watch(() => props.task, (newTask) => {
  if (newTask) {
    formData.value = {
      name: newTask.name || '',
      project_id: newTask.project?.id || '',
      type_id: newTask.type?.id || '',
      state: newTask.state || 'draft',
      priority: newTask.priority || '1',
      planned_date_start: newTask.dates?.planned_start ? newTask.dates.planned_start.split(' ')[0] : '',
      planned_date_end: newTask.dates?.planned_end ? newTask.dates.planned_end.split(' ')[0] : '',
      planned_hours: newTask.hours?.planned || 0,
      progress: newTask.progress || 0,
      assigned_to: newTask.assigned_to?.map(user => user.id) || [],
      description: newTask.description || ''
    };
    
    // Update selected users display
    selectedUsers.value = newTask.assigned_to || [];
  } else {
    // Reset form for new task
    resetForm();
  }
}, { immediate: true });

// Watch for modal visibility to fetch required data
watch(() => props.show, async (isVisible) => {
  if (isVisible) {
    await fetchRequiredData();
  }
}, { immediate: true });

// Methods
async function fetchRequiredData() {
  try {
    loading.value = true;
    loadingMessage.value = 'Loading data...';
    
    // Fetch task types
    const typesResponse = await apiClient.post('/web/v2/team/task-types', {
      jsonrpc: '2.0',
      id: new Date().getTime()
    });
    
    if (typesResponse.data.result?.status === 'success') {
      taskTypes.value = typesResponse.data.result.data || [];
    }
    
    // Fetch users for assignment
    const usersResponse = await apiClient.post('/web/session/get_employees', {
      jsonrpc: '2.0',
      id: new Date().getTime()
    });
    
    if (usersResponse.data.result?.status === 'success') {
      allUsers.value = usersResponse.data.result.data || [];
    }
    
  } catch (error) {
    console.error('Error fetching form data:', error);
  } finally {
    loading.value = false;
  }
}

function resetForm() {
  formData.value = {
    name: '',
    project_id: '',
    type_id: '',
    state: 'draft',
    priority: '1',
    planned_date_start: '',
    planned_date_end: '',
    planned_hours: 0,
    progress: 0,
    assigned_to: [],
    description: ''
  };
  selectedUsers.value = [];
  errors.value = {};
}

function validateForm() {
  const newErrors = {};
  
  // Required fields
  if (!formData.value.name) {
    newErrors.name = 'Task name is required';
  }
  
  if (!formData.value.project_id) {
    newErrors.project_id = 'Project is required';
  }
  
  // Date validation
  if (formData.value.planned_date_start && formData.value.planned_date_end) {
    const startDate = new Date(formData.value.planned_date_start);
    const endDate = new Date(formData.value.planned_date_end);
    
    if (endDate < startDate) {
      newErrors.planned_date_end = 'End date cannot be before start date';
    }
  }
  
  // At least one assigned user
  if (formData.value.assigned_to.length === 0) {
    newErrors.assigned_to = 'At least one team member must be assigned';
  }
  
  errors.value = newErrors;
  return Object.keys(newErrors).length === 0;
}

async function submitForm() {
  if (!validateForm()) {
    return;
  }
  
  try {
    loading.value = true;
    loadingMessage.value = props.task ? 'Updating task...' : 'Creating task...';
    
    // Prepare data for API
    const requestData = {
      jsonrpc: '2.0',
      id: new Date().getTime(),
      params: {
        operation: props.task ? 'update' : 'create',
        name: formData.value.name,
        project_id: formData.value.project_id,
        state: formData.value.state,
        priority: formData.value.priority,
        assigned_to: formData.value.assigned_to,
        description: formData.value.description,
        progress: formData.value.progress
      }
    };
    
    // Add task_id for updates
    if (props.task) {
      requestData.params.task_id = props.task.id;
    }
    
    // Add optional fields if provided
    if (formData.value.type_id) {
      requestData.params.type_id = formData.value.type_id;
    }
    
    if (formData.value.planned_date_start) {
      requestData.params.planned_date_start = formData.value.planned_date_start;
    }
    
    if (formData.value.planned_date_end) {
      requestData.params.planned_date_end = formData.value.planned_date_end;
    }
    
    if (formData.value.planned_hours) {
      requestData.params.planned_hours = formData.value.planned_hours;
    }
    
    // Make API request
    const response = await apiClient.post('/web/v2/team/tasks', requestData);
    
    if (response.data.result?.status === 'success') {
      // Emit success event with updated task data
      emit('submit', response.data.result.data);
      closeModal();
    } else {
      // Handle API error
      const errorMessage = response.data.result?.message || 'An error occurred';
      errors.value._server = errorMessage;
    }
  } catch (error) {
    console.error('Error deleting task:', error);
    errors.value._server = error.message || 'An unexpected error occurred';
  } finally {
    loading.value = false;
    showDeleteConfirm.value = false;
  }
}

function closeModal() {
  emit('close');
  resetForm();
  showUserDropdown.value = false;
  showDeleteConfirm.value = false;
}

function handleBackdropClick(event) {
  if (event.target === event.currentTarget) {
    closeModal();
  }
}

// User selection methods
function toggleUserDropdown() {
  showUserDropdown.value = !showUserDropdown.value;
}

function isUserSelected(userId) {
  return formData.value.assigned_to.includes(userId);
}

function toggleUser(user) {
  const userId = user.id;
  const index = formData.value.assigned_to.indexOf(userId);
  
  if (index === -1) {
    // Add user
    formData.value.assigned_to.push(userId);
    selectedUsers.value.push(user);
  } else {
    // Remove user
    formData.value.assigned_to.splice(index, 1);
    selectedUsers.value = selectedUsers.value.filter(u => u.id !== userId);
  }
}

function removeUser(userId) {
  formData.value.assigned_to = formData.value.assigned_to.filter(id => id !== userId);
  selectedUsers.value = selectedUsers.value.filter(user => user.id !== userId);
}

function getInitials(name) {
  if (!name) return '';
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

// Close dropdown when clicking outside
function handleClickOutside(event) {
  if (showUserDropdown.value && !event.target.closest('.user-dropdown-container')) {
    showUserDropdown.value = false;
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<!-- Tambahkan bagian style berikut di dalam TaskFormModal.vue -->
<style scoped>
/* Styling kustom untuk range slider */
input[type="range"] {
  -webkit-appearance: none;
  appearance: none;
  height: 8px;
  border-radius: 4px;
  background: #e5e7eb;
  outline: none;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #ef4444;
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease;
}

input[type="range"]::-webkit-slider-thumb:hover {
  background: #dc2626;
  transform: scale(1.1);
}

input[type="range"]::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #ef4444;
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease;
}

input[type="range"]::-moz-range-thumb:hover {
  background: #dc2626;
  transform: scale(1.1);
}

/* Animasi transisi untuk modal */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* Styling untuk dropdown user */
.user-dropdown-enter-active,
.user-dropdown-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.user-dropdown-enter-from,
.user-dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Styling kustom untuk scrollbar */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

/* Efek ripple untuk tombol */
.btn-ripple {
  position: relative;
  overflow: hidden;
}

.btn-ripple::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 5px;
  height: 5px;
  background: rgba(255, 255, 255, 0.5);
  opacity: 0;
  border-radius: 100%;
  transform: scale(1, 1) translate(-50%, -50%);
  transform-origin: 50% 50%;
}

.btn-ripple:focus:not(:active)::after {
  animation: ripple 0.6s ease-out;
}

@keyframes ripple {
  0% {
    transform: scale(0, 0);
    opacity: 0.5;
  }
  100% {
    transform: scale(20, 20);
    opacity: 0;
  }
}

/* Animasi loading spinner */
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.spin-animation {
  animation: spin 1s linear infinite;
}

/* Efek hover untuk user list */
.user-item {
  transition: all 0.15s ease;
}

.user-item:hover {
  background-color: #f3f4f6;
  transform: translateX(2px);
}

/* Gaya untuk form group dengan validasi */
.form-group.has-error input,
.form-group.has-error select,
.form-group.has-error textarea {
  border-color: #ef4444;
}

.form-group.has-error .error-message {
  color: #ef4444;
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

/* Transisi yang lebih mulus untuk elemen formulir */
.form-input,
.form-select,
.form-textarea {
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}
</style>