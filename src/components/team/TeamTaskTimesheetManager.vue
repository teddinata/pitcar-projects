<!-- TeamTaskTimesheetManager.vue -->
<template>
  <div class="mt-4 space-y-4">
    <div class="flex justify-between items-center">
      <h3 class="px-6 py-2 text-lg font-medium text-gray-900">Timesheets</h3>
      <button
        @click="addNewTimesheet"
        class="px-6 py-2 inline-flex items-center mr-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-rose-600 to-rose-500"
      >
        <PlusIcon class="h-4 w-4 mr-1.5" />
        Add Time
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
    <div v-else-if="timesheets.length === 0" class="py-4 text-center text-gray-500">
      No time entries yet
    </div>

    <!-- Timesheet list -->
    <div v-else class="overflow-hidden border rounded-md">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Employee
            </th>
            <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Hours
            </th>
            <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Description
            </th>
            <th scope="col" class="relative px-4 py-3">
              <span class="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="entry in sortedTimesheets" :key="entry.id" class="hover:bg-gray-50">
            <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
              {{ formatDate(entry.date) }}
            </td>
            <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
              {{ entry.employee.name }}
            </td>
            <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
              {{ entry.hours }}
            </td>
            <td class="px-4 py-3 text-sm text-gray-500 max-w-xs truncate">
              {{ entry.description || '-' }}
            </td>
            <td class="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
              <button
                @click="editTimesheet(entry)"
                class="text-red-600 hover:text-red-900 mr-2"
              >
                <PencilIcon class="h-4 w-4" />
              </button>
              <button
                @click="deleteTimesheet(entry)"
                class="text-red-600 hover:text-red-900"
              >
                <TrashIcon class="h-4 w-4" />
              </button>
            </td>
          </tr>
        </tbody>
        <tfoot class="bg-gray-50">
          <tr>
            <td colspan="2" class="px-4 py-3 text-sm font-medium text-gray-500">
              Total Hours:
            </td>
            <td class="px-4 py-3 text-sm font-medium text-gray-900">
              {{ totalHours }}
            </td>
            <td colspan="2"></td>
          </tr>
        </tfoot>
      </table>
    </div>

    <!-- Timesheet Form Modal - Integrated into component -->
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
          v-if="showTimesheetModal" 
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
              @click="closeTimesheetModal"
            ></div>

            <!-- Modal panel -->
            <div 
              class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
            >
              <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div>
                  <div class="flex items-center justify-between pb-3 border-b border-gray-200">
                    <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      {{ isEditing ? 'Edit Time Entry' : 'Add Time Entry' }}
                    </h3>
                    <button 
                      type="button" 
                      class="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      @click="closeTimesheetModal"
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
                        <label for="timesheet-date" class="block text-sm font-medium text-gray-700">Date <span class="text-red-500">*</span></label>
                        <input
                          id="timesheet-date"
                          v-model="currentTimesheet.date"
                          type="date"
                          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                          :max="todayISOString"
                          required
                        />
                      </div>

                      <div>
                        <label for="timesheet-employee" class="block text-sm font-medium text-gray-700">Employee <span class="text-red-500">*</span></label>
                        <SearchableSelect
                          id="timesheet-employee"
                          v-model="currentTimesheet.employee_id"
                          :options="employees"
                          placeholder="Search employee..."
                          search-placeholder="Type employee name..."
                          :required="true"
                        />
                      </div>

                      <div>
                        <label for="timesheet-hours" class="block text-sm font-medium text-gray-700">Hours <span class="text-red-500">*</span></label>
                        <input
                          id="timesheet-hours"
                          v-model="currentTimesheet.hours"
                          type="number"
                          min="0.1"
                          step="0.1"
                          max="24"
                          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                          placeholder="0.0"
                          required
                        />
                      </div>

                      <div>
                        <label for="timesheet-description" class="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                          id="timesheet-description"
                          v-model="currentTimesheet.description"
                          rows="3"
                          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                          placeholder="Work details (optional)"
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                <button
                  type="button"
                  class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:col-start-2 sm:text-sm"
                  @click="submitTimesheet"
                >
                  {{ isEditing ? 'Update' : 'Add' }}
                </button>
                <button
                  type="button"
                  class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                  @click="closeTimesheetModal"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Delete Confirmation Modal - Integrated into component -->
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
                    <h3 class="text-lg leading-6 font-medium text-gray-900">Delete Time Entry</h3>
                    <div class="mt-2">
                      <p class="text-sm text-gray-500">
                        Are you sure you want to delete this time entry? This action cannot be undone.
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
  ExclamationTriangleIcon
} from '@heroicons/vue/24/outline';
import SearchableSelect from '@/components/SearchableSelect.vue';
import apiClient from '@/config/api';
import { useToast } from '@/composables/useToast';
const { toast, showToast } = useToast();

const props = defineProps({
  taskId: {
    type: [Number, String],
    required: true
  },
  employees: {
    type: Array,
    default: () => []
  }
});


const loading = ref(true);
const timesheets = ref([]);
const showTimesheetModal = ref(false);
const isEditing = ref(false);
const currentTimesheet = ref({
  date: new Date().toISOString().split('T')[0],
  employee_id: '',
  hours: '',
  description: ''
});

const showDeleteConfirm = ref(false);
const itemToDelete = ref(null);

// Get today's date in ISO format for max date validation
const todayISOString = computed(() => {
  return new Date().toISOString().split('T')[0];
});

// Sort timesheets by date (newest first)
const sortedTimesheets = computed(() => {
  return [...timesheets.value].sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });
});

// Calculate total hours
const totalHours = computed(() => {
  return timesheets.value.reduce((sum, entry) => sum + entry.hours, 0).toFixed(1);
});

// Watch modal state to prevent scrolling on the body when modal is open
watch(() => showTimesheetModal.value, (value) => {
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

// Fetch timesheets for the task
const fetchTimesheets = async () => {
  if (!props.taskId) return;
  
  loading.value = true;
  try {
    // Similar to checklist, use task details to get timesheets if they're included
    const response = await apiClient.post('/web/v2/team/tasks', {
      jsonrpc: '2.0',
      method: 'call',
      params: {
        operation: 'read',
        task_id: parseInt(props.taskId)
      }
    });
    
    if (response.data.result?.status === 'success') {
      // If the task data includes timesheets
      timesheets.value = response.data.result.data?.timesheets || [];
      console.log('Timesheets loaded:', timesheets.value);
    } else {
      console.error('Error fetching timesheets:', response.data.result?.message);
      showToast('Failed to load timesheets. Please try again.', 'error');
    }
  } catch (error) {
    console.error('Error fetching timesheets:', error);
    showToast('Failed to load timesheets. Please try again.', 'error');
  } finally {
    loading.value = false;
  }
};

// Watch for task ID changes to reload the timesheets
watch(() => props.taskId, () => {
  if (props.taskId) {
    fetchTimesheets();
  }
});

// Initialize form for a new timesheet entry
const addNewTimesheet = () => {
  isEditing.value = false;
  // Default to today's date and current user/employee if available
  currentTimesheet.value = {
    date: new Date().toISOString().split('T')[0],
    employee_id: props.employees.length > 0 ? props.employees[0].id : '',
    hours: '',
    description: ''
  };
  showTimesheetModal.value = true;
};

// Initialize form for editing an existing timesheet entry
const editTimesheet = (entry) => {
  isEditing.value = true;
  currentTimesheet.value = { 
    id: entry.id,
    date: entry.date,
    employee_id: entry.employee.id,
    hours: entry.hours,
    description: entry.description || ''
  };
  showTimesheetModal.value = true;
};

// Submit the timesheet entry (create or update)
const submitTimesheet = async () => {
  // Form validation
  if (!currentTimesheet.value.date || !currentTimesheet.value.employee_id || !currentTimesheet.value.hours) {
    showToast('Please fill in all required fields', 'error');
    return;
  }

  if (parseFloat(currentTimesheet.value.hours) <= 0 || parseFloat(currentTimesheet.value.hours) > 24) {
    showToast('Hours must be between 0.1 and 24', 'error');
    return;
  }

  try {
    const payload = {
      jsonrpc: '2.0',
      method: 'call',
      params: {
        operation: isEditing.value ? 'update' : 'create',
        task_id: parseInt(props.taskId),
        employee_id: parseInt(currentTimesheet.value.employee_id),
        date: currentTimesheet.value.date,
        hours: parseFloat(currentTimesheet.value.hours),
        description: currentTimesheet.value.description
      }
    };

    // Add timesheet_id for updates
    if (isEditing.value && currentTimesheet.value.id) {
      payload.params.timesheet_id = currentTimesheet.value.id;
    }

    const response = await apiClient.post('/web/v2/team/task/timesheets', payload);
    
    if (response.data.result?.status === 'success') {
      showToast(
        isEditing.value ? 'Time entry updated successfully' : 'Time entry added successfully', 
        'success'
      );
      closeTimesheetModal();
      await fetchTimesheets(); // Refresh the timesheets
    } else {
      throw new Error(response.data.result?.message || 'Operation failed');
    }
  } catch (error) {
    console.error('Error submitting timesheet:', error);
    showToast('Failed to save time entry. Please try again.', 'error');
  }
};

// Show delete confirmation dialog
const deleteTimesheet = (entry) => {
  itemToDelete.value = entry;
  showDeleteConfirm.value = true;
};

// Confirm and process deletion
const confirmDelete = async () => {
  if (!itemToDelete.value?.id) {
    showToast('Invalid item to delete', 'error');
    return;
  }

  try {
    const response = await apiClient.post('/web/v2/team/task/timesheets', {
      jsonrpc: '2.0',
      method: 'call',
      params: {
        operation: 'delete',
        timesheet_id: itemToDelete.value.id
      }
    });
    
    if (response.data.result?.status === 'success') {
      showToast('Time entry deleted successfully', 'success');
      await fetchTimesheets(); // Refresh the timesheets
    } else {
      throw new Error(response.data.result?.message || 'Deletion failed');
    }
  } catch (error) {
    console.error('Error deleting timesheet:', error);
    showToast('Failed to delete time entry. Please try again.', 'error');
  } finally {
    showDeleteConfirm.value = false;
    itemToDelete.value = null;
  }
};

// Close the timesheet form modal
const closeTimesheetModal = () => {
  showTimesheetModal.value = false;
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
  if (props.taskId) {
    fetchTimesheets();
  }
});
</script>