<!-- TeamTaskChecklistManager.vue -->
<template>
  <div class="mt-4 space-y-4">
    <div class="flex justify-between items-center">
      <h3 class="px-6 py-2 text-lg font-medium text-gray-900">Checklist</h3>
      <button
        @click.stop="addNewChecklistItem"
        class="px-6 py-2 inline-flex items-center mr-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-rose-600 to-rose-500"
      >
        <PlusIcon class="h-4 w-4 mr-1.5" />
        Add Item
      </button>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center py-4">
      <svg class="animate-spin h-5 w-5 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>

    <!-- Empty state -->
    <div v-else-if="checklist.length === 0" class="py-4 text-center text-gray-500">
      No checklist items yet
    </div>

    <!-- Checklist items -->
    <div v-else class="overflow-hidden border rounded-md">
      <ul class="divide-y divide-gray-200 bg-white">
        <li v-for="item in sortedChecklist" :key="item.id" class="px-4 py-3 hover:bg-gray-50">
          <div class="flex items-center justify-between">
            <div class="flex items-center flex-1">
              <div class="flex-shrink-0 mr-3">
                <input 
                  type="checkbox" 
                  :checked="item.is_done" 
                  @change="toggleChecklistItem(item)"
                  class="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                />
              </div>
              <div class="flex-1 min-w-0">
                <p :class="['text-sm font-medium', item.is_done ? 'text-gray-400 line-through' : 'text-gray-800']">
                  {{ item.name }}
                </p>
                <div class="flex mt-1 text-xs text-gray-500 space-x-4">
                  <span v-if="item.assigned_to">
                    <UserIcon class="h-3 w-3 inline mr-1" /> 
                    {{ getEmployeeName(item.assigned_to.id) }}
                  </span>
                  <span v-if="item.deadline">
                    <CalendarIcon class="h-3 w-3 inline mr-1" /> 
                    {{ formatDate(item.deadline) }}
                  </span>
                </div>
                <p v-if="item.notes" class="mt-1 text-xs italic text-gray-500">
                  {{ item.notes }}
                </p>
              </div>
            </div>
            <div class="flex-shrink-0 ml-2">
              <button
                @click="editChecklistItem(item)"
                class="text-red-600 hover:text-red-900 mr-2"
              >
                <PencilIcon class="h-4 w-4" />
              </button>
              <button
                @click="deleteChecklistItem(item)"
                class="text-red-600 hover:text-red-900"
              >
                <TrashIcon class="h-4 w-4" />
              </button>
            </div>
          </div>
        </li>
      </ul>
      <!-- Progress bar -->
      <div class="bg-gray-50 px-4 py-3">
        <div class="flex items-center justify-between mb-1">
          <span class="text-xs font-medium text-gray-500">Progress</span>
          <span class="text-xs font-medium text-gray-500">{{ progress }}%</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div class="bg-red-600 h-2 rounded-full" :style="{ width: `${progress}%` }"></div>
        </div>
      </div>
    </div>

    <!-- Checklist Form Modal - Integrated into this component -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="transform opacity-0 scale-95"
        enter-to-class="transform opacity-100 scale-100"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="transform opacity-100 scale-100"
        leave-to-class="transform opacity-0 scale-95"
      >
        <div 
          v-if="showChecklistModal" 
          class="fixed z-50 inset-0 overflow-y-auto" 
          aria-labelledby="modal-title" 
          role="dialog" 
          aria-modal="true"
        >
          <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <!-- Background overlay -->
            <div 
              class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
              aria-hidden="true"
              @click="closeChecklistModal"
            ></div>

            <!-- Modal panel -->
            <div 
              class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
            >
              <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div>
                  <div class="flex items-center justify-between pb-3 border-b border-gray-200">
                    <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      {{ isEditing ? 'Edit Checklist Item' : 'Add Checklist Item' }}
                    </h3>
                    <button 
                      type="button" 
                      class="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      @click="closeChecklistModal"
                    >
                      <span class="sr-only">Close</span>
                      <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div class="mt-4 max-h-[70vh] overflow-y-auto">
                    <div class="space-y-4">
                      <div>
                        <label for="checklist-name" class="block text-sm font-medium text-gray-700">Item Name <span class="text-red-500">*</span></label>
                        <input
                          id="checklist-name"
                          v-model="currentChecklistItem.name"
                          type="text"
                          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                          placeholder="Enter checklist item name"
                          required
                        />
                      </div>

                      <div>
                        <label for="checklist-assignee" class="block text-sm font-medium text-gray-700">Assigned To</label>
                        <SearchableSelect
                          id="checklist-assignee"
                          v-model="currentChecklistItem.assigned_to"
                          :options="employeeOptions"
                          placeholder="Search employee..."
                          search-placeholder="Type employee name..."
                        />
                      </div>

                      <div>
                        <label for="checklist-deadline" class="block text-sm font-medium text-gray-700">Deadline</label>
                        <input
                          id="checklist-deadline"
                          v-model="currentChecklistItem.deadline"
                          type="date"
                          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                        />
                      </div>

                      <div>
                        <label for="checklist-notes" class="block text-sm font-medium text-gray-700">Notes</label>
                        <textarea
                          id="checklist-notes"
                          v-model="currentChecklistItem.notes"
                          rows="2"
                          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                          placeholder="Additional information (optional)"
                        ></textarea>
                      </div>

                      <div>
                        <div class="flex items-center">
                          <input
                            id="checklist-is-done"
                            v-model="currentChecklistItem.is_done"
                            type="checkbox"
                            class="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                          />
                          <label for="checklist-is-done" class="ml-2 block text-sm font-medium text-gray-700">
                            Mark as completed
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                <button
                  type="button"
                  class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:col-start-2 sm:text-sm"
                  @click="submitChecklistItem"
                >
                  {{ isEditing ? 'Update' : 'Add' }}
                </button>
                <button
                  type="button"
                  class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                  @click="closeChecklistModal"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Delete Confirmation Modal - Integrated into this component -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="transform opacity-0 scale-95"
        enter-to-class="transform opacity-100 scale-100"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="transform opacity-100 scale-100"
        leave-to-class="transform opacity-0 scale-95"
      >
        <div 
          v-if="showDeleteConfirm" 
          class="fixed z-50 inset-0 overflow-y-auto" 
          aria-labelledby="modal-title" 
          role="dialog" 
          aria-modal="true"
        >
          <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <!-- Background overlay -->
            <div 
              class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
              aria-hidden="true"
              @click="showDeleteConfirm = false"
            ></div>

            <!-- Modal panel -->
            <div 
              class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
            >
              <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div class="sm:flex sm:items-start">
                  <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <ExclamationTriangleIcon class="h-6 w-6 text-red-600" />
                  </div>
                  <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 class="text-lg leading-6 font-medium text-gray-900">Delete Checklist Item</h3>
                    <div class="mt-2">
                      <p class="text-sm text-gray-500">
                        Are you sure you want to delete this checklist item? This action cannot be undone.
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
                  class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:mt-0 sm:w-auto sm:text-sm"
                  @click="showDeleteConfirm = false"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  ExclamationTriangleIcon,
  UserIcon,
  CalendarIcon
} from '@heroicons/vue/24/outline';
import SearchableSelect from '@/components/SearchableSelect.vue';
import apiClient from '@/config/api';
import { useToast } from '@/composables/useToast';
const { toast, showToast } = useToast();
import { debounce } from 'lodash';

const props = defineProps({
  taskId: {
    type: [Number, String],
    required: true,
    validator: (value) => {
      // Pastikan nilai valid dan tidak undefined
      return value !== undefined && value !== null && value !== '';
    }
  },
  employees: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['update:progress']);


// State
const loading = ref(true);
const checklist = ref([]);
const showChecklistModal = ref(false);
const isEditing = ref(false);
const currentChecklistItem = ref({
  name: '',
  assigned_to: '',
  deadline: null,
  notes: '',
  is_done: false
});
const dataLoaded = ref(false);

const showDeleteConfirm = ref(false);
const itemToDelete = ref(null);

const employeeOptions = computed(() => {
  return props.employees.map(employee => ({
    id: employee.id,
    name: employee.name
  }));
});

const sortedChecklist = computed(() => {
  return checklist.value.sort((a, b) => {
    if (a.is_done && !b.is_done) return 1;
    if (!a.is_done && b.is_done) return -1;
    return 0;
  });
});

const progress = computed(() => {
  if (checklist.value.length === 0) return 0;
  const completed = checklist.value.filter(item => item.is_done).length;
  return Math.round((completed / checklist.value.length) * 100);
});

watch(progress, (newProgress) => {
  // Hanya emit jika progress benar-benar berubah
  if (newProgress !== lastEmittedProgress.value) {
    lastEmittedProgress.value = newProgress;
    emit('update:progress', newProgress);
  }
});

// Tambahkan ref untuk melacak progress terakhir yang di-emit
const lastEmittedProgress = ref(0);

// Debounce fetchChecklist untuk mencegah permintaan berlebihan
const debouncedFetch = debounce(async () => {
  await fetchChecklist();
}, 300);

// Ubah watcher untuk menggunakan versi debounced
watch(() => props.taskId, (newId, oldId) => {
  if (newId && newId !== oldId && !dataLoaded.value) {
    debouncedFetch();
  }
});

// Fetch checklist items for the task
const fetchChecklist = async () => {
  if (!props.taskId) return;
  
  // Jangan fetch jika task ID tidak berubah dan data sudah dimuat
  const taskIdStr = String(props.taskId);
  // if (dataLoaded.value && loadedTaskId.value === taskIdStr) {
  //   console.log(`Checklist data for task ${taskIdStr} already loaded, skipping fetch`);
  //   return;
  // }

  
  loading.value = true;
  try {
    console.log(`Fetching checklist for task ${taskIdStr}`);
    
    const response = await apiClient.post('/web/v2/team/tasks', {
      jsonrpc: '2.0',
      method: 'call',
      params: {
        operation: 'read',
        task_id: props.taskId
      }
    });
    
    if (response.data.result?.status === 'success') {
      checklist.value = response.data.result.data?.checklists || [];
      console.log('Checklist items loaded:', checklist.value);
      dataLoaded.value = true;
      loadedTaskId.value = taskIdStr; // Catat task ID yang sudah dimuat
    } else {
      console.error('Error fetching checklist:', response.data.result?.message);
      showToast('Failed to load checklist items. Please try again.', 'error');
    }
  } catch (error) {
    console.error('Error fetching checklist:', error);
    showToast('Failed to load checklist items. Please try again.', 'error');
  } finally {
    loading.value = false;
  }
};

// Tambahkan ref untuk melacak task ID yang sudah dimuat
const loadedTaskId = ref(null);

// Watch for task ID changes to reload the checklist
watch(() => props.taskId, (newId, oldId) => {
  if (newId && newId !== oldId) {
    dataLoaded.value = false; // Reset flag ketika task ID berubah
    fetchChecklist();
  }
});

// Watch modal state to prevent scrolling on the body when modal is open
watch(() => showChecklistModal.value, (value) => {
  if (value) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
});

watch(() => showDeleteConfirm.value, (value) => {
  if (value) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
});

// Initialize form for a new checklist item
const addNewChecklistItem = () => {
  console.log('Adding new checklist item');
  isEditing.value = false;
  currentChecklistItem.value = {
    name: '',
    assigned_to: '',
    deadline: null,
    notes: '',
    is_done: false
  };
  console.log('Setting modal to show');
  showChecklistModal.value = true;
  console.log('Modal state:', showChecklistModal.value);
};

// Initialize form for editing an existing checklist item
const editChecklistItem = (item) => {
  isEditing.value = true;
  currentChecklistItem.value = { 
    ...item,
    assigned_to: item.assigned_to ? item.assigned_to.id : ''
  };
  showChecklistModal.value = true;
};

// Submit the checklist item (create or update)
const submitChecklistItem = async () => {
  if (!currentChecklistItem.value.name) {
    showToast('Item name is required', 'error');
    return;
  }

  try {
    const payload = {
      jsonrpc: '2.0',
      method: 'call',
      params: {
        operation: isEditing.value ? 'update' : 'create',
        name: currentChecklistItem.value.name,
        task_id: props.taskId,
        is_done: currentChecklistItem.value.is_done || false,
        notes: currentChecklistItem.value.notes || ''
      }
    };

    // Add optional fields only if they have values
    if (currentChecklistItem.value.assigned_to) {
      payload.params.assigned_to = currentChecklistItem.value.assigned_to;
    }
    
    if (currentChecklistItem.value.deadline) {
      payload.params.deadline = currentChecklistItem.value.deadline;
    }

    // Add checklist_id for updates
    if (isEditing.value && currentChecklistItem.value.id) {
      payload.params.checklist_id = currentChecklistItem.value.id;
    }

    const response = await apiClient.post('/web/v2/team/task/checklists', payload);
    
    if (response.data.result?.status === 'success') {
      showToast(
        isEditing.value ? 'Checklist item updated successfully' : 'Checklist item added successfully', 
        'success'
      );
      closeChecklistModal();
      await fetchChecklist(); // Refresh the checklist
    } else {
      throw new Error(response.data.result?.message || 'Operation failed');
    }
  } catch (error) {
    console.error('Error submitting checklist item:', error);
    showToast('Failed to save checklist item. Please try again.', 'error');
  }
};

// Show delete confirmation dialog
const deleteChecklistItem = (item) => {
  itemToDelete.value = item;
  showDeleteConfirm.value = true;
};

// Confirm and process deletion
const confirmDelete = async () => {
  if (!itemToDelete.value?.id) {
    showToast('Invalid item to delete', 'error');
    return;
  }

  try {
    const response = await apiClient.post('/web/v2/team/task/checklists', {
      jsonrpc: '2.0',
      method: 'call',
      params: {
        operation: 'delete',
        checklist_id: itemToDelete.value.id
      }
    });
    
    if (response.data.result?.status === 'success') {
      showToast('Checklist item deleted successfully', 'success');
      await fetchChecklist(); // Refresh the checklist
    } else {
      throw new Error(response.data.result?.message || 'Deletion failed');
    }
  } catch (error) {
    console.error('Error deleting checklist item:', error);
    showToast('Failed to delete checklist item. Please try again.', 'error');
  } finally {
    showDeleteConfirm.value = false;
    itemToDelete.value = null;
  }
};

// Close the checklist form modal
const closeChecklistModal = () => {
  showChecklistModal.value = false;
};

// Toggle the completed status of a checklist item
const toggleChecklistItem = async (item) => {
  try {
    const response = await apiClient.post('/web/v2/team/task/checklists', {
      jsonrpc: '2.0',
      method: 'call',
      params: {
        operation: 'update',
        checklist_id: item.id,
        is_done: !item.is_done
      }
    });
    
    if (response.data.result?.status === 'success') {
      // Update the local item status without fetching the entire list again
      const index = checklist.value.findIndex(i => i.id === item.id);
      if (index !== -1) {
        checklist.value[index].is_done = !item.is_done;
      }
      showToast('Checklist item updated successfully', 'success');
    } else {
      throw new Error(response.data.result?.message || 'Update failed');
    }
  } catch (error) {
    console.error('Error toggling checklist item:', error);
    showToast('Failed to update checklist item. Please try again.', 'error');
  }
};

// Helper to get employee name from ID
const getEmployeeName = (employeeId) => {
  const employee = employeeOptions.value.find(e => e.id === employeeId);
  return employee ? employee.name : 'Not assigned';
};

// Format date for display
const formatDate = (dateString) => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  } catch (e) {
    console.error('Date format error:', e);
    return dateString;
  }
};

// Load data when component is mounted
onMounted(() => {
  console.log(`TeamTaskChecklistManager mounted for task ID: ${props.taskId}`);
  if (props.taskId) {
    console.log(`Initiating fetch for task ID: ${props.taskId}`);
    fetchChecklist();
  }
});
</script>