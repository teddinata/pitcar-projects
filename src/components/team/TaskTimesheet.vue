<!-- src/components/team/TeamTaskTimesheetManager.vue -->
<template>
  <div class="mt-4 space-y-4">
    <div class="flex justify-between items-center">
      <h3 class="text-lg font-medium text-gray-900">Timesheets</h3>
      <button
        @click="addNewTimesheet"
        class="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-rose-600 to-rose-500"
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
      No time records yet
    </div>

    <!-- Timesheets table -->
    <div v-else class="overflow-x-auto border rounded-md">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Employee
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Hours
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Description
            </th>
            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="timesheet in timesheets" :key="timesheet.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ formatDate(timesheet.date) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ getEmployeeName(timesheet.employee_id) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ timesheet.hours }}
            </td>
            <td class="px-6 py-4 text-sm text-gray-500">
              {{ timesheet.description || '-' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button
                @click="editTimesheet(timesheet)"
                class="text-red-600 hover:text-red-900 mr-2"
              >
                <PencilIcon class="h-4 w-4" />
              </button>
              <button
                @click="deleteTimesheet(timesheet)"
                class="text-red-600 hover:text-red-900"
              >
                <TrashIcon class="h-4 w-4" />
              </button>
            </td>
          </tr>
        </tbody>
        <tfoot class="bg-gray-50">
          <tr>
            <td colspan="2" class="px-6 py-3 text-right text-sm font-medium text-gray-500">
              Total Hours:
            </td>
            <td class="px-6 py-3 text-left text-sm font-bold text-gray-900">
              {{ totalHours }}
            </td>
            <td colspan="2"></td>
          </tr>
        </tfoot>
      </table>
    </div>

    <!-- Timesheet Form Modal -->
    <DialogModal
      :show="showTimesheetModal"
      @close="closeTimesheetModal"
      :title="isEditing ? 'Edit Time Entry' : 'Add Time Entry'"
    >
      <div class="space-y-4">
        <div>
          <label for="timesheet-date" class="block text-sm font-medium text-gray-700">Date <span class="text-red-500">*</span></label>
          <input
            id="timesheet-date"
            v-model="currentTimesheet.date"
            type="date"
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <label for="timesheet-employee" class="block text-sm font-medium text-gray-700">Employee <span class="text-red-500">*</span></label>
          <select
            id="timesheet-employee"
            v-model="currentTimesheet.employee_id"
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
            required
          >
            <option v-for="employee in employeeOptions" :key="employee.id" :value="employee.id">
              {{ employee.name }}
            </option>
          </select>
        </div>

        <div>
          <label for="timesheet-hours" class="block text-sm font-medium text-gray-700">Hours <span class="text-red-500">*</span></label>
          <input
            id="timesheet-hours"
            v-model="currentTimesheet.hours"
            type="number"
            min="0.1"
            step="0.1"
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
            placeholder="What was done during this time"
          ></textarea>
        </div>
      </div>

      <div class="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
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
    </DialogModal>

    <!-- Delete Confirmation Modal -->
    <DialogModal
      :show="showDeleteConfirm"
      @close="showDeleteConfirm = false"
      title="Delete Time Entry"
    >
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
      <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
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
    </DialogModal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useToast } from '@/composables/useToast';
import apiClient from '@/config/api';
import { PlusIcon, PencilIcon, TrashIcon, ExclamationTriangleIcon } from '@heroicons/vue/24/outline';
import DialogModal from '@/components/modal/DialogModal.vue';

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

const { toast, showToast } = useToast();
const timesheets = ref([]);
const loading = ref(false);
const showTimesheetModal = ref(false);
const showDeleteConfirm = ref(false);
const isEditing = ref(false);
const timesheetToDelete = ref(null);
const currentTimesheet = ref({
  date: new Date().toISOString().slice(0, 10),
  employee_id: '',
  hours: '',
  description: ''
});

// Computed properties
const employeeOptions = computed(() => {
  return props.employees.map(employee => ({
    id: employee.id,
    name: employee.name
  }));
});

const totalHours = computed(() => {
  return timesheets.value.reduce((total, ts) => total + parseFloat(ts.hours), 0).toFixed(1);
});

// Methods
const fetchTimesheets = async () => {
  loading.value = true;
  try {
    const response = await apiClient.post('/web/v2/team/task/timesheets', {
      operation: 'get',
      task_id: props.taskId
    });
    
    if (response.data.status === 'success') {
      timesheets.value = response.data.data || [];
    } else {
      showToast('Error fetching timesheets: ' + response.data.message, 'error');
    }
  } catch (error) {
    console.error('Error fetching timesheets:', error);
    showToast('Failed to load timesheets. Please try again.', 'error');
  } finally {
    loading.value = false;
  }
};

const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

const getEmployeeName = (employeeId) => {
  const employee = props.employees.find(emp => emp.id === employeeId);
  return employee ? employee.name : 'Unknown Employee';
};

const addNewTimesheet = () => {
  isEditing.value = false;
  currentTimesheet.value = {
    date: new Date().toISOString().slice(0, 10),
    employee_id: props.employees.length > 0 ? props.employees[0].id : '',
    hours: '',
    description: ''
  };
  showTimesheetModal.value = true;
};

const editTimesheet = (timesheet) => {
  isEditing.value = true;
  currentTimesheet.value = {
    id: timesheet.id,
    date: timesheet.date.split('T')[0], // Extract date part
    employee_id: timesheet.employee_id,
    hours: timesheet.hours,
    description: timesheet.description || ''
  };
  showTimesheetModal.value = true;
};

const closeTimesheetModal = () => {
  showTimesheetModal.value = false;
};

const submitTimesheet = async () => {
  // Validate form
  if (!currentTimesheet.value.date || !currentTimesheet.value.employee_id || !currentTimesheet.value.hours) {
    showToast('Please fill all required fields', 'error');
    return;
  }

  try {
    const payload = {
      operation: isEditing.value ? 'update' : 'create',
      task_id: props.taskId,
      date: currentTimesheet.value.date,
      employee_id: currentTimesheet.value.employee_id,
      hours: parseFloat(currentTimesheet.value.hours),
      description: currentTimesheet.value.description
    };

    if (isEditing.value) {
      payload.timesheet_id = currentTimesheet.value.id;
    }

    const response = await apiClient.post('/web/v2/team/task/timesheets', payload);
    
    if (response.data.status === 'success') {
      showToast(`Timesheet ${isEditing.value ? 'updated' : 'added'} successfully`, 'success');
      fetchTimesheets(); // Refresh the list
      closeTimesheetModal();
    } else {
      showToast(`Error: ${response.data.message}`, 'error');
    }
  } catch (error) {
    console.error('Error submitting timesheet:', error);
    showToast('Failed to save timesheet. Please try again.', 'error');
  }
};

const deleteTimesheet = (timesheet) => {
  timesheetToDelete.value = timesheet;
  showDeleteConfirm.value = true;
};

const confirmDelete = async () => {
  if (!timesheetToDelete.value) return;
  
  try {
    const response = await apiClient.post('/web/v2/team/task/timesheets', {
      operation: 'delete',
      timesheet_id: timesheetToDelete.value.id
    });
    
    if (response.data.status === 'success') {
      showToast('Timesheet deleted successfully', 'success');
      fetchTimesheets(); // Refresh the list
    } else {
      showToast(`Error: ${response.data.message}`, 'error');
    }
  } catch (error) {
    console.error('Error deleting timesheet:', error);
    showToast('Failed to delete timesheet. Please try again.', 'error');
  } finally {
    showDeleteConfirm.value = false;
    timesheetToDelete.value = null;
  }
};

// Lifecycle hooks
onMounted(() => {
  fetchTimesheets();
});

// Watch for changes in taskId
watch(() => props.taskId, (newTaskId) => {
  if (newTaskId) {
    fetchTimesheets();
  }
});
</script>