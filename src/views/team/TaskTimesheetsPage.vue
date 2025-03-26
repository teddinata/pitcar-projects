<template>
  <div class="min-h-screen bg-gray-50 py-6">
    <div class="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Task Timesheets</h1>
        <div class="flex space-x-2">
          <router-link 
            to="/tasks" 
            class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <ArrowLeft class="h-4 w-4 mr-1" />
            All Tasks
          </router-link>
          <button
            @click="openAddTimeModal"
            class="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-gradient-to-r from-purple-600 to-indigo-600"
          >
            <ClockIcon class="h-4 w-4 mr-1" />
            Log Time
          </button>
        </div>
      </div>

      <!-- Task Filter and Selector -->
      <div class="bg-white shadow rounded-lg mb-6 p-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label for="task-filter" class="block text-sm font-medium text-gray-700 mb-1">Filter by Task</label>
            <div class="relative rounded-md shadow-sm">
              <input
                id="task-filter"
                v-model="taskFilter"
                type="text"
                class="w-full px-3 py-2 focus:ring-red-500 focus:border-red-500 block sm:text-sm border-gray-300 rounded-md"
                placeholder="Search tasks..."
              />
              <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
                <Search class="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
          <div>
            <label for="date-range" class="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
            <div class="grid grid-cols-2 gap-2">
              <input
                id="date-from"
                v-model="dateFrom"
                type="date"
                class="px-3 py-2 focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
              <input
                id="date-to"
                v-model="dateTo"
                type="date"
                class="px-3 py-2 focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>
          <div>
            <label for="project-filter" class="block text-sm font-medium text-gray-700 mb-1">Project</label>
            <select
              id="project-filter"
              v-model="projectFilter"
              class="px-3 py-2 focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-300 rounded-md"
            >
              <option value="">All Projects</option>
              <option v-for="project in projects" :key="project.id" :value="project.id">
                {{ project.name }}
              </option>
            </select>
          </div>
        </div>
        
        <div class="mt-4 flex justify-end">
          <button
            @click="applyFilters"
            class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gradient-to-r from-purple-600 to-indigo-600"
          >
            <FilterIcon class="h-4 w-4 mr-1" />
            Apply Filters
          </button>
        </div>
      </div>

      <!-- Statistics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div class="bg-white shadow rounded-lg p-4">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-red-100 rounded-md p-3">
              <ClockIcon class="h-6 w-6 text-red-600" />
            </div>
            <div class="ml-4">
              <h2 class="text-sm font-medium text-gray-500">Total Hours</h2>
              <p class="text-lg font-bold text-gray-900">{{ stats.totalHours }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white shadow rounded-lg p-4">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-blue-100 rounded-md p-3">
              <Calendar class="h-6 w-6 text-blue-600" />
            </div>
            <div class="ml-4">
              <h2 class="text-sm font-medium text-gray-500">This Week</h2>
              <p class="text-lg font-bold text-gray-900">{{ stats.weeklyHours }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white shadow rounded-lg p-4">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-green-100 rounded-md p-3">
              <UserIcon class="h-6 w-6 text-green-600" />
            </div>
            <div class="ml-4">
              <h2 class="text-sm font-medium text-gray-500">Team Members</h2>
              <p class="text-lg font-bold text-gray-900">{{ stats.teamMembersCount }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white shadow rounded-lg p-4">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-yellow-100 rounded-md p-3">
              <CheckCircle class="h-6 w-6 text-yellow-600" />
            </div>
            <div class="ml-4">
              <h2 class="text-sm font-medium text-gray-500">Tasks Logged</h2>
              <p class="text-lg font-bold text-gray-900">{{ stats.tasksCount }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Timesheets Table -->
      <div class="bg-white shadow rounded-lg">
        <div class="px-4 py-5 sm:px-6 flex justify-between items-center border-b border-gray-200">
          <h3 class="text-lg leading-6 font-medium text-gray-900">
            Timesheet Entries
          </h3>
          <div class="flex items-center space-x-2">
            <span class="text-sm text-gray-500">
              {{ timesheets.length }} entries
            </span>
            <button
              @click="downloadTimesheets"
              class="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <DownloadIcon class="h-4 w-4 mr-1" />
              Export
            </button>
          </div>
        </div>
        
        <div v-if="loading" class="flex justify-center py-8">
          <svg class="animate-spin h-8 w-8 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>

        <div v-else-if="timesheets.length === 0" class="py-8 text-center">
          <ClipboardIcon class="mx-auto h-12 w-12 text-gray-300" />
          <h3 class="mt-2 text-sm font-medium text-gray-900">No timesheet entries</h3>
          <p class="mt-1 text-sm text-gray-500">
            Get started by adding a new time entry.
          </p>
          <div class="mt-6">
            <button
              @click="openAddTimeModal"
              class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gradient-to-r from-purple-600 to-indigo-600"
            >
              <PlusIcon class="h-4 w-4 mr-1" />
              Add Time Entry
            </button>
          </div>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Task
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Project
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
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
              <tr v-for="(entry, index) in timesheets" :key="index" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ formatDate(entry.date) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ entry.task?.name || '-' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ entry.project?.name || '-' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ entry.employee?.name || '-' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                  {{ entry.hours }}
                </td>
                <td class="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                  {{ entry.description || '-' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    @click="editTimesheetEntry(entry)"
                    class="text-red-600 hover:text-red-900 mr-2"
                  >
                    <PencilIcon class="h-4 w-4" />
                  </button>
                  <button
                    @click="deleteTimesheetEntry(entry)"
                    class="text-red-600 hover:text-red-900"
                  >
                    <TrashIcon class="h-4 w-4" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Pagination -->
        <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div class="flex-1 flex justify-between sm:hidden">
            <button
              @click="prevPage"
              :disabled="currentPage === 1"
              :class="[
                'relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50',
                currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
              ]"
            >
              Previous
            </button>
            <button
              @click="nextPage"
              :disabled="currentPage === totalPages"
              :class="[
                'ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50',
                currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
              ]"
            >
              Next
            </button>
          </div>
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700">
                Showing
                <span class="font-medium">{{ paginationStart }}</span>
                to
                <span class="font-medium">{{ paginationEnd }}</span>
                of
                <span class="font-medium">{{ totalEntries }}</span>
                results
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  @click="prevPage"
                  :disabled="currentPage === 1"
                  :class="[
                    'relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50',
                    currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
                  ]"
                >
                  <span class="sr-only">Previous</span>
                  <ChevronLeftIcon class="h-5 w-5" />
                </button>
                <button
                  v-for="page in displayedPages"
                  :key="page"
                  @click="goToPage(page)"
                  :class="[
                    'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                    page === currentPage
                      ? 'z-10 bg-red-50 border-red-500 text-red-600'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                  ]"
                >
                  {{ page }}
                </button>
                <button
                  @click="nextPage"
                  :disabled="currentPage === totalPages"
                  :class="[
                    'relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50',
                    currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
                  ]"
                >
                  <span class="sr-only">Next</span>
                  <ChevronRightIcon class="h-5 w-5" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Timesheet Modal -->
    <div v-if="showTimesheetModal" class="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="showTimesheetModal = false"></div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <ClockIcon class="h-6 w-6 text-red-600" />
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  {{ isEditing ? 'Edit Time Entry' : 'Add Time Entry' }}
                </h3>
                <div class="mt-4 space-y-4">
                  <div>
                    <label for="timesheet-date" class="block text-sm font-medium text-gray-700">Date <span class="text-red-500">*</span></label>
                    <input
                      id="timesheet-date"
                      v-model="currentEntry.date"
                      type="date"
                      class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                      required
                    />
                  </div>
                  
                  <div>
                    <!-- <label for="timesheet-task" class="block text-sm font-medium text-gray-700">Task <span class="text-red-500">*</span></label> -->
                    <SearchableSelect
                      id="timesheet-task"
                      v-model="currentEntry.task_id"
                      :options="filteredTasks"
                      label="Task"
                      placeholder="Search and select a task"
                      search-placeholder="Type to search task..."
                      :required="true"
                      :error="formErrors.task_id"
                    />
                  </div>
                  
                  <!-- Employee field (added) -->
                  <div>
                    <!-- <label for="timesheet-employee" class="block text-sm font-medium text-gray-700">Employee <span class="text-red-500">*</span></label> -->
                    <SearchableSelect
                      id="timesheet-employee"
                      v-model="currentEntry.employee_id"
                      :options="employees"
                      label="Employee"
                      placeholder="Search and select an employee"
                      search-placeholder="Type to search employee..."
                      :required="true"
                      :error="formErrors.employee_id"
                    />
                  </div>
                  
                  <div>
                    <label for="timesheet-hours" class="block text-sm font-medium text-gray-700">Hours <span class="text-red-500">*</span></label>
                    <input
                      id="timesheet-hours"
                      v-model="currentEntry.hours"
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
                      v-model="currentEntry.description"
                      rows="3"
                      class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                      placeholder="Apa yang diselesaikan dari tugas ini?"
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button 
              type="button" 
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
              @click="submitTimesheetEntry"
            >
              {{ isEditing ? 'Update' : 'Save' }}
            </button>
            <button 
              type="button" 
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              @click="showTimesheetModal = false"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteConfirm" class="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="showDeleteConfirm = false"></div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <ExclamationIcon class="h-6 w-6 text-red-600" />
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  Delete Time Entry
                </h3>
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
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              @click="showDeleteConfirm = false"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast notification -->
    <Toast
      v-if="toast.show"
      :message="toast.message"
      :type="toast.type"
      :duration="toast.duration"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useToast } from '@/composables/useToast';
import apiClient from '@/config/api';
import { 
  ArrowLeft, 
  Clock as ClockIcon, 
  Search, 
  Calendar, 
  CheckCircle, 
  User as UserIcon, 
  ClipboardList as ClipboardIcon,
  Pencil as PencilIcon,
  Trash as TrashIcon,
  Download as DownloadIcon,
  Plus as PlusIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Filter as FilterIcon,
  AlertTriangle as ExclamationIcon,
} from 'lucide-vue-next';
import Toast from '@/components/Toast.vue';
import SearchableSelect from '@/components/SearchableSelect.vue';

const { toast, showToast } = useToast();

// State
const loading = ref(false);
const taskFilter = ref('');
const dateFrom = ref('');
const dateTo = ref('');
const projectFilter = ref('');
const projects = ref([]);
const timesheets = ref([]);
const tasks = ref([]);
const employees = ref([]);
const showTimesheetModal = ref(false);
const showDeleteConfirm = ref(false);
const isEditing = ref(false);
const entryToDelete = ref(null);
const currentEntry = ref({
  date: new Date().toISOString().slice(0, 10),
  task_id: '',
  employee_id: '',
  hours: '',
  description: ''
});

// Pagination
const currentPage = ref(1);
const itemsPerPage = 10;
const totalEntries = ref(0);

// Stats
const stats = ref({
  totalHours: 0,
  weeklyHours: 0,
  teamMembersCount: 0,
  tasksCount: 0
});

// Computed properties
const filteredTasks = computed(() => {
  if (!projectFilter.value) return tasks.value;
  return tasks.value.filter(task => task.project?.id == projectFilter.value);
});

const totalPages = computed(() => {
  return Math.ceil(totalEntries.value / itemsPerPage);
});

const paginationStart = computed(() => {
  return totalEntries.value === 0 ? 0 : (currentPage.value - 1) * itemsPerPage + 1;
});

const paginationEnd = computed(() => {
  return Math.min(currentPage.value * itemsPerPage, totalEntries.value);
});

const displayedPages = computed(() => {
  const pages = [];
  const maxVisiblePages = 5;
  
  if (totalPages.value <= maxVisiblePages) {
    // Show all pages if total is less than maxVisiblePages
    for (let i = 1; i <= totalPages.value; i++) {
      pages.push(i);
    }
  } else {
    // Always include first and last page
    if (currentPage.value <= 3) {
      // Near the start
      for (let i = 1; i <= 5; i++) {
        pages.push(i);
      }
    } else if (currentPage.value >= totalPages.value - 2) {
      // Near the end
      for (let i = totalPages.value - 4; i <= totalPages.value; i++) {
        pages.push(i);
      }
    } else {
      // Middle
      for (let i = currentPage.value - 2; i <= currentPage.value + 2; i++) {
        pages.push(i);
      }
    }
  }
  
  return pages;
});

// Methods
const initDateRange = () => {
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  
  dateFrom.value = firstDay.toISOString().split('T')[0];
  dateTo.value = lastDay.toISOString().split('T')[0];
};

const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

const fetchProjects = async () => {
  try {
    const response = await apiClient.post('/web/v2/team/projects/list', {
      jsonrpc: '2.0',
      method: 'call',
      id: new Date().getTime()
    });
    
    if (response.data.result?.status === 'success') {
      projects.value = response.data.result.data || [];
    } else {
      showToast({
        message: 'Failed to load projects. Please try again.',
        type: 'error'
      });
    }
  } catch (error) {
    console.error('Error fetching projects:', error);
    showToast({
      message: 'Failed to load projects. Please try again.',
      type: 'error'
    });
  }
};

const fetchTasks = async () => {
  try {
    const params = {
      jsonrpc: '2.0',
      method: 'call',
      params: { 
        operation: 'list'
      }
    };
    
    if (projectFilter.value) {
      params.params.project_id = parseInt(projectFilter.value);
    }
    
    const response = await apiClient.post('/web/v2/team/tasks', params);
    
    if (response.data.result?.status === 'success') {
      tasks.value = response.data.result.data || [];
    } else {
      showToast({
        message: 'Failed to load tasks. Please try again.',
        type: 'error'
      });
    }
  } catch (error) {
    console.error('Error fetching tasks:', error);
    showToast({
      message: 'Failed to load tasks. Please try again.',
      type: 'error'
    });
  }
};

const fetchEmployees = async () => {
  try {
    const response = await apiClient.post('/web/v2/hr/employees', {
      jsonrpc: '2.0',
      method: 'call',
      params: { 
        operation: 'list'
      }
    });
    
    if (response.data.result?.status === 'success') {
      employees.value = response.data.result.data || [];
    } else {
      showToast({
        message: 'Failed to load employees. Please try again.',
        type: 'error'
      });
    }
  } catch (error) {
    console.error('Error fetching employees:', error);
    showToast({
      message: 'Failed to load employees. Please try again.',
      type: 'error'
    });
  }
};

const fetchTimesheets = async () => {
  loading.value = true;
  try {
    // Construct API params with filters
    const params = {
      jsonrpc: '2.0',
      method: 'call',
      params: {
        operation: 'list',
        page: currentPage.value,
        limit: itemsPerPage
      }
    };
    
    if (dateFrom.value) params.params.date_from = dateFrom.value;
    if (dateTo.value) params.params.date_to = dateTo.value;
    if (projectFilter.value) params.params.project_id = parseInt(projectFilter.value);
    if (taskFilter.value) params.params.task_name = taskFilter.value;
    
    const response = await apiClient.post('/web/v2/team/task/timesheets', params);
    
    if (response.data.result?.status === 'success') {
      timesheets.value = response.data.result.data || [];
      totalEntries.value = response.data.result.total || 0;
      updateStats(response.data.result.stats);
    } else {
      showToast({
        message: `Error: ${response.data.result?.message || 'Failed to load timesheets'}`,
        type: 'error'
      });
    }
  } catch (error) {
    console.error('Error fetching timesheets:', error);
    showToast({
      message: 'Failed to load timesheet data. Please try again.',
      type: 'error'
    });
  } finally {
    loading.value = false;
  }
};

const updateStats = (statsData) => {
  if (!statsData) return;
  
  stats.value = {
    totalHours: statsData.total_hours || 0,
    weeklyHours: statsData.weekly_hours || 0,
    teamMembersCount: statsData.team_members_count || 0,
    tasksCount: statsData.tasks_count || 0
  };
};

const applyFilters = () => {
  currentPage.value = 1; // Reset to first page when applying filters
  fetchTimesheets();
};

const goToPage = (page) => {
  currentPage.value = page;
  fetchTimesheets();
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    fetchTimesheets();
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    fetchTimesheets();
  }
};

const openAddTimeModal = () => {
  isEditing.value = false;
  currentEntry.value = {
    date: new Date().toISOString().slice(0, 10),
    task_id: '',
    employee_id: '',
    hours: '',
    description: ''
  };
  showTimesheetModal.value = true;
};

const editTimesheetEntry = (entry) => {
  isEditing.value = true;
  currentEntry.value = {
    id: entry.id,
    date: entry.date.split('T')[0],
    task_id: entry.task?.id || '',
    employee_id: entry.employee?.id || '',
    hours: entry.hours,
    description: entry.description || ''
  };
  showTimesheetModal.value = true;
};

const formErrors = ref({
  date: '',
  task_id: '',
  employee_id: '',
  hours: ''
});

// Update the validation function to use the form errors object
const validateForm = () => {
  let isValid = true;
  
  // Reset all errors
  formErrors.value = {
    date: '',
    task_id: '',
    employee_id: '',
    hours: ''
  };
  
  // Validate date
  if (!currentEntry.value.date) {
    formErrors.value.date = 'Date is required';
    isValid = false;
  }
  
  // Validate task
  if (!currentEntry.value.task_id) {
    formErrors.value.task_id = 'Task is required';
    isValid = false;
  }
  
  // Validate employee
  if (!currentEntry.value.employee_id) {
    formErrors.value.employee_id = 'Employee is required';
    isValid = false;
  }
  
  // Validate hours
  if (!currentEntry.value.hours) {
    formErrors.value.hours = 'Hours are required';
    isValid = false;
  } else if (isNaN(parseFloat(currentEntry.value.hours)) || parseFloat(currentEntry.value.hours) <= 0) {
    formErrors.value.hours = 'Hours must be a positive number';
    isValid = false;
  }
  
  return isValid;
};

// Update the submitTimesheetEntry function to use validateForm
const submitTimesheetEntry = async () => {
  // Validate form
  if (!validateForm()) {
    showToast({
      message: 'Please correct the errors in the form',
      type: 'error'
    });
    return;
  }

  try {
    const payload = {
      jsonrpc: '2.0',
      method: 'call',
      params: {
        operation: isEditing.value ? 'update' : 'create',
        task_id: parseInt(currentEntry.value.task_id),
        employee_id: parseInt(currentEntry.value.employee_id),
        date: currentEntry.value.date,
        hours: parseFloat(currentEntry.value.hours),
        description: currentEntry.value.description
      }
    };

    if (isEditing.value) {
      payload.params.timesheet_id = currentEntry.value.id;
    }

    const response = await apiClient.post('/web/v2/team/task/timesheets', payload);
    
    if (response.data.result?.status === 'success') {
      showToast({
        message: `Timesheet ${isEditing.value ? 'updated' : 'added'} successfully`,
        type: 'success'
      });
      fetchTimesheets(); // Refresh the list
      showTimesheetModal.value = false;
    } else {
      showToast({
        message: `Error: ${response.data.result?.message || 'Failed to save timesheet'}`,
        type: 'error'
      });
    }
  } catch (error) {
    console.error('Error submitting timesheet:', error);
    showToast({
      message: 'Failed to save timesheet. Please try again.',
      type: 'error'
    });
  }
};

const deleteTimesheetEntry = (entry) => {
  entryToDelete.value = entry;
  showDeleteConfirm.value = true;
};

const confirmDelete = async () => {
  if (!entryToDelete.value) return;
  
  try {
    const response = await apiClient.post('/web/v2/team/task/timesheets', {
      jsonrpc: '2.0',
      method: 'call',
      params: {
        operation: 'delete',
        timesheet_id: entryToDelete.value.id
      }
    });
    
    if (response.data.result?.status === 'success') {
      showToast({
        message: 'Timesheet deleted successfully',
        type: 'success'
      });
      fetchTimesheets(); // Refresh the list
    } else {
      showToast({
        message: `Error: ${response.data.result?.message || 'Failed to delete timesheet'}`,
        type: 'error'
      });
    }
  } catch (error) {
    console.error('Error deleting timesheet:', error);
    showToast({
      message: 'Failed to delete timesheet. Please try again.',
      type: 'error'
    });
  } finally {
    showDeleteConfirm.value = false;
    entryToDelete.value = null;
  }
};

const downloadTimesheets = async () => {
  try {
    showToast({
      message: 'Preparing timesheet export...',
      type: 'info'
    });
    
    // Construct API params with current filters
    const params = {
      jsonrpc: '2.0',
      method: 'call',
      params: {
        operation: 'export',
        format: 'csv'
      }
    };
    
    if (dateFrom.value) params.params.date_from = dateFrom.value;
    if (dateTo.value) params.params.date_to = dateTo.value;
    if (projectFilter.value) params.params.project_id = parseInt(projectFilter.value);
    if (taskFilter.value) params.params.task_name = taskFilter.value;
    
    const response = await apiClient.post('/web/v2/team/task/timesheets', params);
    
    if (response.data.result?.status === 'success' && response.data.result.data) {
      // Create a download link for the CSV data
      const blob = new Blob([response.data.result.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `timesheets-export-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      
      showToast({
        message: 'Timesheets exported successfully',
        type: 'success'
      });
    } else {
      showToast({
        message: 'Failed to export timesheets',
        type: 'error'
      });
    }
  } catch (error) {
    console.error('Error exporting timesheets:', error);
    showToast({
      message: 'Failed to export timesheets',
      type: 'error'
    });
  }
};

// Lifecycle hooks
onMounted(() => {
  initDateRange();
  Promise.all([
    fetchProjects(),
    fetchTasks(),
    fetchEmployees(),
    fetchTimesheets()
  ]);
});
</script>