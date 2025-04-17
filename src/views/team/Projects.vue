<!-- src/views/dashboard/TeamProjects.vue -->
<template>
  <div class="min-h-screen bg-gray-50">
    <Toast
      v-model:show="toast.show"
      :message="toast.message"
      :type="toast.type"
      :duration="toast.duration"
    />
    
    <!-- Header with Filter Button -->
    <div class="bg-white shadow">
      <div class="w-full max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
          <!-- Title -->
          <h1 class="text-xl sm:text-2xl font-semibold text-gray-900">All Teams Projects</h1>
          
          <!-- Controls Container - Simplified for efficiency -->
          <div class="flex items-center space-x-3">
            <!-- View toggle buttons -->
            <div class="inline-flex rounded-md shadow-sm">
              <button
                @click="viewMode = 'grid'"
                class="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium rounded-l-md focus:outline-none focus:ring-1 focus:ring-red-500 flex items-center"
                :class="viewMode === 'grid' ? 'bg-red-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'"
              >
                <ViewColumnsIcon class="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-1.5" />
                Grid
              </button>
              <button
                @click="viewMode = 'gantt'"
                class="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium rounded-r-md focus:outline-none focus:ring-1 focus:ring-red-500 flex items-center"
                :class="viewMode === 'gantt' ? 'bg-red-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'"
              >
                <ChartBarIcon class="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-1.5" />
                Timeline
              </button>
            </div>

             <!-- Header Controls -->
            <div class="flex items-center flex-wrap gap-2">
              <!-- Sort Dropdown -->
              <div class="relative inline-block">
                <button 
                  @click="sortDropdownOpen = !sortDropdownOpen" 
                  class="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none"
                >
                  <ArrowsUpDownIcon class="w-4 h-4 mr-2" />
                  Sort: {{ getSortLabel() }}
                  <span class="ml-1">
                    <ArrowUpIcon v-if="sortOptions.order === 'asc'" class="w-4 h-4" />
                    <ArrowDownIcon v-else class="w-4 h-4" />
                  </span>
                  <ChevronDownIcon class="w-4 h-4 ml-1" />
                </button>
                
                <!-- Sort Menu -->
                <div 
                  v-if="sortDropdownOpen" 
                  class="absolute right-0 z-10 mt-1 bg-white rounded-md shadow-lg w-48"
                >
                  <div class="py-1">
                    <button
                      v-for="option in sortFieldOptions"
                      :key="option.value"
                      @click="changeSort(option.value); sortDropdownOpen = false"
                      class="w-full px-4 py-2 text-sm text-left hover:bg-gray-100 flex items-center justify-between"
                      :class="sortOptions.field === option.value ? 'font-medium bg-gray-50' : ''"
                    >
                      {{ option.label }}
                      <span v-if="sortOptions.field === option.value">
                        <ArrowUpIcon v-if="sortOptions.order === 'asc'" class="w-4 h-4 text-gray-600" />
                        <ArrowDownIcon v-else class="w-4 h-4 text-gray-600" />
                      </span>
                    </button>
                  </div>
                </div>
              </div>
              
              <!-- Toggle Archived -->
              <button
                @click="toggleArchived"
                class="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none"
                :class="{'bg-gray-100': showArchived}"
              >
                <ArchiveBoxIcon class="w-4 h-4 mr-2" />
                {{ showArchived ? 'Hide Archived' : 'Show Archived' }}
              </button>
            </div>
              
            
            <!-- Filter Button with Badge Indicators -->
            <button
              @click="showFilterModal = true"
              class="relative inline-flex items-center justify-center px-3.5 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <FunnelIcon class="h-4 w-4 mr-1.5" />
              <span>Filters</span>
              
              <!-- Badge indicator for active filters -->
              <span 
                v-if="activeFilterCount > 0" 
                class="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center rounded-full bg-red-600 text-white text-xs font-bold shadow-sm"
              >
                {{ activeFilterCount }}
              </span>
            </button>
            
            <!-- Active Filter Pills - Shows on larger screens -->
            <div class="hidden md:flex md:flex-wrap md:gap-2 md:items-center">
              <!-- Department Filter Pill -->
              <div 
                v-if="filters.department_id" 
                class="bg-red-50 border border-red-200 text-red-700 text-xs rounded-full px-2.5 py-1 flex items-center"
              >
                <span>{{ getDepartmentName(filters.department_id) }}</span>
                <XMarkIcon 
                  @click="clearFilter('department_id')" 
                  class="ml-1 h-3.5 w-3.5 cursor-pointer hover:text-red-800" 
                />
              </div>
              
              <!-- Status Filter Pill -->
              <div 
                v-if="filters.state" 
                class="bg-red-50 border border-red-200 text-red-700 text-xs rounded-full px-2.5 py-1 flex items-center"
              >
                <span>{{ formatState(filters.state) }}</span>
                <XMarkIcon 
                  @click="clearFilter('state')" 
                  class="ml-1 h-3.5 w-3.5 cursor-pointer hover:text-red-800" 
                />
              </div>
              
              <!-- Date Range Pill -->
              <div 
                v-if="filters.date_start || filters.date_end" 
                class="bg-red-50 border border-red-200 text-red-700 text-xs rounded-full px-2.5 py-1 flex items-center"
              >
                <span>{{ formatDateRange() }}</span>
                <XMarkIcon 
                  @click="clearDateFilter" 
                  class="ml-1 h-3.5 w-3.5 cursor-pointer hover:text-red-800" 
                />
              </div>
            </div>
            
            <!-- New Project Button -->
            <button
              @click="showCreateModal = true"
              class="inline-flex justify-center items-center px-3.5 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-rose-600 to-rose-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <PlusIcon class="h-4 w-4 mr-1.5" />
              <span class="hidden xs:inline">New Project</span>
              <span class="xs:hidden">New</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <main class="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Grid View -->
      <!-- Grid View -->
    <div v-if="viewMode === 'grid'">
      <!-- Applied Filters Summary (Mobile) -->
      <div class="flex flex-wrap gap-2 mb-4 md:hidden">
        <div 
          v-if="activeFilterCount > 0" 
          class="w-full text-sm text-gray-700 mb-1"
        >
          Applied Filters:
        </div>
        <!-- Department Filter Pill -->
        <div 
          v-if="filters.department_id" 
          class="bg-red-50 border border-red-200 text-red-700 text-xs rounded-full px-2.5 py-1 flex items-center"
        >
          <span>{{ getDepartmentName(filters.department_id) }}</span>
          <XMarkIcon 
            @click.stop="clearFilter('department_id')" 
            class="ml-1 h-3.5 w-3.5 cursor-pointer hover:text-red-800" 
          />
        </div>
        
        <!-- Status Filter Pill -->
        <div 
          v-if="filters.state" 
          class="bg-red-50 border border-red-200 text-red-700 text-xs rounded-full px-2.5 py-1 flex items-center"
        >
          <span>{{ formatState(filters.state) }}</span>
          <XMarkIcon 
            @click.stop="clearFilter('state')" 
            class="ml-1 h-3.5 w-3.5 cursor-pointer hover:text-red-800" 
          />
        </div>
        
        <!-- Date Range Pill -->
        <div 
          v-if="filters.date_start || filters.date_end" 
          class="bg-red-50 border border-red-200 text-red-700 text-xs rounded-full px-2.5 py-1 flex items-center"
        >
          <span>{{ formatDateRange() }}</span>
          <XMarkIcon 
            @click.stop="clearDateFilter" 
            class="ml-1 h-3.5 w-3.5 cursor-pointer hover:text-red-800" 
          />
        </div>
      </div>

      <!-- Projects Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        <TeamProjectCard 
          v-for="project in projects"
          :key="project.id"
          :project="project"
          @click="viewProject(project.id)"
          @status-change="updateProjectStatus"
          @view-details="viewProject"
          @toggle-archive="toggleProjectArchive"
          class="h-full cursor-pointer"
        />
      </div>

      <!-- Empty State -->
      <div 
        v-if="!loading && projects.length === 0" 
        class="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center my-6"
      >
        <DocumentIcon class="mx-auto h-12 w-12 text-gray-400" />
        <h3 class="mt-3 text-sm font-medium text-gray-900">No projects found</h3>
        <p class="mt-2 text-sm text-gray-500">
          {{ activeFilterCount > 0 ? 'Try changing your filter criteria or create a new project.' : 'Get started by creating a new team project.' }}
        </p>
        <div class="mt-5">
          <button
            v-if="activeFilterCount > 0"
            @click="resetFilters"
            class="inline-flex items-center px-4 py-2 mr-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <ArrowPathIcon class="h-4 w-4 mr-1.5" />
            Reset Filters
          </button>
          <button
            @click="showCreateModal = true"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-rose-600 to-rose-500"
          >
            <PlusIcon class="h-4 w-4 mr-1.5" />
            New Project
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div 
        v-if="loading" 
        class="flex flex-col items-center justify-center py-20"
      >
        <div class="animate-spin rounded-full h-10 w-10 border-2 border-red-600 border-t-transparent mb-3"></div>
        <p class="text-sm text-gray-600">Loading projects...</p>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="!loading && projects.length > 0 && viewMode === 'grid'" class="mt-6 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
      <div class="flex flex-1 justify-between sm:hidden">
        <button 
          @click="prevPage" 
          :disabled="pagination.currentPage <= 1"
          class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          :class="{'opacity-50 cursor-not-allowed': pagination.currentPage <= 1}"
        >
          Previous
        </button>
        <button 
          @click="nextPage" 
          :disabled="pagination.currentPage >= pagination.totalPages"
          class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          :class="{'opacity-50 cursor-not-allowed': pagination.currentPage >= pagination.totalPages}"
        >
          Next
        </button>
      </div>
      <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p class="text-sm text-gray-700">
            Showing
            <span class="font-medium">{{ (pagination.currentPage - 1) * pagination.limit + 1 }}</span>
            to
            <span class="font-medium">{{ Math.min(pagination.currentPage * pagination.limit, pagination.total) }}</span>
            of
            <span class="font-medium">{{ pagination.total }}</span>
            projects
          </p>
        </div>
        <div class="isolate inline-flex -space-x-px rounded-md shadow-sm">
          <!-- First Page Button -->
          <button
            v-if="pagination.totalPages > 3"
            @click="goToPage(1)"
            :disabled="pagination.currentPage === 1"
            class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
            :class="{'opacity-50 cursor-not-allowed': pagination.currentPage === 1}"
          >
            <span class="sr-only">First</span>
            <span class="text-xs">First</span>
          </button>
          
          <!-- Previous Button -->
          <button
            @click="prevPage"
            :disabled="pagination.currentPage <= 1"
            class="relative inline-flex items-center px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
            :class="{'opacity-50 cursor-not-allowed': pagination.currentPage <= 1}"
          >
            <span class="sr-only">Previous</span>
            &laquo;
          </button>
          
          <!-- Page Numbers -->
          <template v-for="page in pagination.totalPages" :key="page">
            <!-- Render with logic to limit visible pages -->
            <button
              v-if="
                page === 1 || 
                page === pagination.totalPages || 
                (page >= pagination.currentPage - 1 && page <= pagination.currentPage + 1)
              "
              @click="goToPage(page)"
              :class="[
                pagination.currentPage === page 
                  ? 'relative z-10 inline-flex items-center bg-red-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600' 
                  : 'relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0',
              ]"
            >
              {{ page }}
            </button>
            
            <!-- Ellipsis if needed -->
            <span
              v-else-if="
                (page === 2 && pagination.currentPage > 3) || 
                (page === pagination.totalPages - 1 && pagination.currentPage < pagination.totalPages - 2)
              "
              class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300"
            >
              ...
            </span>
          </template>
          
          <!-- Next Button -->
          <button
            @click="nextPage"
            :disabled="pagination.currentPage >= pagination.totalPages"
            class="relative inline-flex items-center px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
            :class="{'opacity-50 cursor-not-allowed': pagination.currentPage >= pagination.totalPages}"
          >
            <span class="sr-only">Next</span>
            &raquo;
          </button>
          
          <!-- Last Page Button -->
          <button
            v-if="pagination.totalPages > 3"
            @click="goToPage(pagination.totalPages)"
            :disabled="pagination.currentPage === pagination.totalPages"
            class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
            :class="{'opacity-50 cursor-not-allowed': pagination.currentPage === pagination.totalPages}"
          >
            <span class="sr-only">Last</span>
            <span class="text-xs">Last</span>
          </button>
        </div>
      </div>
    </div>

      <!-- Gantt Chart View -->
      <div v-else-if="viewMode === 'gantt'">
        <!-- Applied Filters Summary (Mobile View) -->
        <div class="flex flex-wrap gap-2 mb-4 md:hidden">
          <div 
            v-if="activeFilterCount > 0" 
            class="w-full text-sm text-gray-700 mb-1"
          >
            Applied Filters:
          </div>
          <!-- Department Filter Pill -->
          <div 
            v-if="filters.department_id" 
            class="bg-red-50 border border-red-200 text-red-700 text-xs rounded-full px-2.5 py-1 flex items-center"
          >
            <span>{{ getDepartmentName(filters.department_id) }}</span>
            <XMarkIcon 
              @click.stop="clearFilter('department_id')" 
              class="ml-1 h-3.5 w-3.5 cursor-pointer hover:text-red-800" 
            />
          </div>
          
          <!-- Status Filter Pill -->
          <div 
            v-if="filters.state" 
            class="bg-red-50 border border-red-200 text-red-700 text-xs rounded-full px-2.5 py-1 flex items-center"
          >
            <span>{{ formatState(filters.state) }}</span>
            <XMarkIcon 
              @click.stop="clearFilter('state')" 
              class="ml-1 h-3.5 w-3.5 cursor-pointer hover:text-red-800" 
            />
          </div>
          
          <!-- Date Range Pill -->
          <div 
            v-if="filters.date_start || filters.date_end" 
            class="bg-red-50 border border-red-200 text-red-700 text-xs rounded-full px-2.5 py-1 flex items-center"
          >
            <span>{{ formatDateRange() }}</span>
            <XMarkIcon 
              @click.stop="clearDateFilter" 
              class="ml-1 h-3.5 w-3.5 cursor-pointer hover:text-red-800" 
            />
          </div>
        </div>

        <ProjectGanttChart 
          :department-id="filters.department_id ? parseInt(filters.department_id) : null"
          :department-name="filters.department_id ? getDepartmentName(filters.department_id) : ''"
          :start-date-filter="filters.date_start"
          :end-date-filter="filters.date_end"
          @view-task-detail="handleViewTaskDetail"
          @view-project-detail="handleViewProjectDetail"
          @edit-task="handleEditTask"
          @update:dateRange="handleDateRangeUpdate"
          @clearFilter="clearFilter"
          @resetFilters="resetFilters"
        />
      </div>

      <!-- Loading State -->
      <!-- <div 
        v-if="loading" 
        class="flex justify-center py-12"
      >
        <div class="animate-spin rounded-full h-8 w-8 border-2 border-red-600 border-t-transparent"></div>
      </div> -->
    </main>

    <!-- Filter Modal -->
    <TeamProjectFilterModal
      :show="showFilterModal"
      :filters="filters"
      :departments="departments"
      @close="showFilterModal = false"
      @apply="handleFilterApply"
      @reset="resetFilters"
    />

    <!-- Create/Edit Project Modal -->
    <TeamProjectFormModal
      v-if="showCreateModal && !selectedTask"
      :show="showCreateModal"
      :project="selectedProject"
      :departments="departments"
      @close="closeModal"
      @submit="handleProjectSubmit"
    />

    <!-- Tambahkan di bawah bagian modal lainnya -->
    <TaskFormModal
    v-if="showTaskModal"
    :show="showTaskModal"
    :task="selectedTask"
    :projects="projects"
    @close="closeTaskModal"
    @submit="handleTaskSubmit"
    @delete="handleTaskDelete"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from '@/composables/useToast'
import TaskFormModal from '@/components/team/TaskFormPopup.vue';
import apiClient from '@/config/api'
import { 
  PlusIcon, 
  DocumentIcon,
  ArrowPathIcon,
  FunnelIcon,
  ViewColumnsIcon,
  ChartBarIcon, 
  CalendarIcon,
  XMarkIcon,
  ArrowsUpDownIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ChevronDownIcon,
  ArchiveBoxIcon
} from '@heroicons/vue/24/outline'
import { 
  format, 
  parseISO, 
  addMonths, 
  subMonths, 
  addDays, 
  subDays 
} from 'date-fns';


import TeamProjectCard from '@/components/team/TeamProjectCard.vue'
import TeamProjectFormModal from '@/components/team/TeamProjectFormModal.vue'
import ProjectGanttChart from '@/components/team/ProjectGanttChart.vue'
import TeamProjectFilterModal from '@/components/filter/ProjectFilterModal.vue'
import Toast from '@/components/Toast.vue'

// State
const router = useRouter()
const { toast, showToast } = useToast()
const loading = ref(false)
const projects = ref([])
const departments = ref([])
const showCreateModal = ref(false)
const showFilterModal = ref(false)
const selectedProject = ref(null)
const sortDropdownOpen = ref(false);
// State untuk pagination
const pagination = ref({
  currentPage: 1,
  totalPages: 1,
  limit: 7,
  total: 0
});

// Add new view mode state
const viewMode = ref('grid') // 'grid' or 'gantt'

const filters = ref({
  department_id: '',
  state: '',
  date_start: '',
  date_end: '',
  project_manager_id: ''
});

// Fungsi untuk menangani pengiriman form
const handleTaskSubmit = (taskData) => {
  // Handle data yang dikirim dari modal
  console.log('Task data submitted:', taskData);
  
  // Refresh data jika diperlukan
  fetchProjects();
  
  // Tampilkan pesan sukses
  showToast({
    message: selectedTask.value ? 'Task updated successfully' : 'Task created successfully',
    type: 'success'
  });
};

// Fungsi untuk menangani penghapusan task
const handleTaskDelete = (taskId) => {
  console.log('Task deleted:', taskId);
  
  // Refresh data
  fetchProjects();
  
  // Tampilkan pesan sukses
  showToast({
    message: 'Task deleted successfully',
    type: 'success'
  });
};

// Computed property to count active filters
const activeFilterCount = computed(() => {
  let count = 0;
  
  if (filters.value.department_id) count++;
  if (filters.value.state) count++;
  if (filters.value.date_start || filters.value.date_end) count++;
  if (filters.value.project_manager_id) count++;
  
  return count;
});

// Helper function to get department name from ID
const getDepartmentName = (departmentId) => {
  const department = departments.value.find(dept => dept.id == departmentId);
  return department ? department.name : 'Unknown Department';
};

// Helper function to format state for display
const formatState = (state) => {
  // Convert snake_case to Title Case
  return state
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Format date range for display
const formatDateRange = () => {
  const start = filters.value.date_start;
  const end = filters.value.date_end;
  
  if (start && end) {
    return `${start} to ${end}`;
  } else if (start) {
    return `From ${start}`;
  } else if (end) {
    return `Until ${end}`;
  }
  
  return 'Date Range';
};

// Clear a specific filter
const clearFilter = (filterName) => {
  filters.value[filterName] = '';
  fetchProjects(false); // Refresh with updated filters
};

// Clear date filter (both start and end)
const clearDateFilter = () => {
  filters.value.date_start = '';
  filters.value.date_end = '';
  fetchProjects(false); // Refresh with updated filters
};

const handleDateRangeUpdate = (dateRange) => {
  if (dateRange && dateRange.start && dateRange.end) {
    // Update the filters with the new date range
    filters.value.date_start = dateRange.start;
    filters.value.date_end = dateRange.end;
    
    // No need to call fetchProjects() here - the Gantt chart will handle its own data fetching
    // This just keeps the parent component's state in sync
  }
};


// Methods
// Handle filter apply from modal
const handleFilterApply = (newFilters) => {
  filters.value = { ...newFilters };
  pagination.value.currentPage = 1; // Reset ke halaman 1 saat filter berubah
  fetchProjects(false);
};

// Modifikasi fungsi fetchProjects untuk menerima parameter isInitialLoad
const fetchProjects = async (isInitialLoad = false) => {
  try {
    loading.value = true;
    
    // Inisialisasi parameter dengan rentang tanggal default
    const today = new Date();
    const defaultParams = {
      date_start: format(subDays(today, 7), 'yyyy-MM-dd'),
      date_end: format(addDays(today, 14), 'yyyy-MM-dd'),
    };
    
    // Siapkan parameter yang akan dikirim dalam format yang benar
    let params = {
      jsonrpc: '2.0',
      id: new Date().getTime(),
      params: {
        // Tambahkan parameter pagination
        page: pagination.value.currentPage,
        limit: pagination.value.limit,
        // Tambahkan parameter sorting
        sort_field: sortOptions.value.field,
        sort_order: sortOptions.value.order,
        // Tambahkan parameter untuk menampilkan/menyembunyikan archived
        include_archived: showArchived.value
      }
    };
    
    // Jika ini adalah load awal, gunakan hanya filter tanggal default
    if (isInitialLoad) {
      params.params = { ...params.params, ...defaultParams };
    } else {
      // Jika bukan load awal, gunakan filter yang dipilih pengguna
      if (filters.value.department_id) {
        params.params.department_id = parseInt(filters.value.department_id);
      }
      
      if (filters.value.state) {
        params.params.state = filters.value.state;
      }
      
      // Selalu gunakan filter tanggal, baik dari filter pengguna atau default
      params.params.date_start = filters.value.date_start || defaultParams.date_start;
      params.params.date_end = filters.value.date_end || defaultParams.date_end;
      
      if (filters.value.project_manager_id) {
        params.params.project_manager_id = parseInt(filters.value.project_manager_id);
      }
    }
    
    // Log untuk debugging
    console.log('Fetching projects with params:', params);
    
    // Kirim request dengan parameter yang benar
    const response = await apiClient.post('/web/v2/team/projects/list', params);

    // Periksa respons
    if (response.data.result?.status === 'success') {
      projects.value = response.data.result.data;
      
      // Update pagination state dari respons server
      if (response.data.result.pagination) {
        pagination.value = {
          currentPage: response.data.result.pagination.page || 1,
          totalPages: response.data.result.pagination.total_pages || 1,
          limit: response.data.result.pagination.limit || 10,
          total: response.data.result.pagination.total || 0
        };
      }
      
      // Hanya tampilkan toast jika ini bukan load awal
      if (!isInitialLoad) {
        if (projects.value.length > 0) {
          showToast({
            message: `${projects.value.length} projects loaded successfully`,
            type: 'success'
          });
        } else {
          showToast({
            message: 'No projects found with the current filters',
            type: 'info'
          });
        }
      }
    } else {
      showToast({
        message: response.data.result?.message || 'Failed to load projects',
        type: 'error'
      });
      console.error('API Error:', response.data.result);
    }
  } catch (error) {
    console.error('Error fetching projects:', error);
    showToast({
      message: error.message || 'Failed to load projects',
      type: 'error',
      duration: 5000
    });
  } finally {
    loading.value = false;
  }
};

const goToPage = (page) => {
  if (page < 1 || page > pagination.value.totalPages) return;
  pagination.value.currentPage = page;
  fetchProjects(false);
};

const prevPage = () => {
  if (pagination.value.currentPage > 1) {
    goToPage(pagination.value.currentPage - 1);
  }
};

const nextPage = () => {
  if (pagination.value.currentPage < pagination.value.totalPages) {
    goToPage(pagination.value.currentPage + 1);
  }
};

const fetchDepartments = async () => {
  try {
    const response = await apiClient.post('/web/dataset/call_kw', {
      jsonrpc: '2.0',
      method: 'call',
      params: {
        model: 'hr.department',
        method: 'search_read',
        args: [[]],
        kwargs: {
          fields: ['id', 'name']
        }
      }
    })

    if (response.data.result) {
      departments.value = response.data.result
    }
  } catch (error) {
    console.error('Error fetching departments:', error)
  }
}

const updateProjectStatus = async (projectId, newStatus) => {
  try {
    const response = await apiClient.post('/web/v2/team/projects', {
      jsonrpc: '2.0',
      id: new Date().getTime(),
      params: {
        operation: 'update',
        project_id: projectId,
        state: newStatus
      }
    })

    if (response.data.result?.status === 'success') {
      showToast({
        message: 'Project status updated successfully',
        type: 'success'
      })
      await fetchProjects()
    }
  } catch (error) {
    console.error('Error updating project status:', error)
    showToast({
      message: error.message || 'Failed to update project status',
      type: 'error'
    })
  }
}

const resetFilters = () => {
  const today = new Date();
  
  // Hitung 7 hari yang lalu
  const sevenDaysAgo = subDays(today, 7);
  // Hitung 14 hari ke depan
  const fourteenDaysAhead = addDays(today, 14);
  
  filters.value = {
    department_id: '',
    state: '',
    date_start: format(sevenDaysAgo, 'yyyy-MM-dd'),
    date_end: format(fourteenDaysAhead, 'yyyy-MM-dd'),
    project_manager_id: ''
  };
  
  // Reset pagination
  pagination.value.currentPage = 1;
  
  // Fetch projects tanpa filter (isInitialLoad = true)
  fetchProjects(true);
};


const viewProject = (projectId) => {
  router.push(`/team/project/${projectId}`)
}

const closeModal = () => {
  showCreateModal.value = false
  selectedProject.value = null
}

// const handleEditTask = (task) => {
//   showCreateModal.value = true;
//   selectedTask.value = task;
// }


const handleViewTaskDetail = (task) => {
  // Navigate to task detail page
  // router.push(`/team/task/${task.id}`);
}

// Handler untuk melihat detail project
const handleViewProjectDetail = (project) => {
  // Navigate to project detail page
  router.push(`/team/project/${project.id}`);
}

const debouncedFetch = useDebounce(fetchProjects, 300);

// Helper function untuk debounce
function useDebounce(fn, delay) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

const effectiveDateFilter = computed(() => {
  // Jika kedua tanggal diisi, gunakan
  if (filters.value.date_start && filters.value.date_end) {
    return {
      start: filters.value.date_start,
      end: filters.value.date_end
    };
  }
  
  // Jika hanya salah satu, tentukan yang lain
  const today = new Date();
  
  if (filters.value.date_start && !filters.value.date_end) {
    // Jika hanya start date, gunakan +14 hari sebagai end date
    return {
      start: filters.value.date_start,
      end: format(addDays(today, 14), 'yyyy-MM-dd')
    };
  }
  
  if (!filters.value.date_start && filters.value.date_end) {
    // Jika hanya end date, gunakan -7 hari sebagai start date
    return {
      start: format(subDays(today, 7), 'yyyy-MM-dd'),
      end: filters.value.date_end
    };
  }
  
  // Default: 7 hari ke belakang sampai 14 hari ke depan
  return {
    start: format(subDays(today, 7), 'yyyy-MM-dd'),
    end: format(addDays(today, 14), 'yyyy-MM-dd')
  };
});


const handleProjectSubmit = async (projectData) => {
  try {
    loading.value = true
    const response = await apiClient.post('/web/v2/team/projects', {
      jsonrpc: '2.0',
      id: new Date().getTime(),
      params: {
        operation: 'create',
        ...projectData
      }
    })

    if (response.data.result?.status === 'success') {
      showToast({
        message: 'Project created successfully',
        type: 'success'
      })
      closeModal()
      fetchProjects()
    }
  } catch (error) {
    console.error('Error creating project:', error)
    showToast({
      message: error.message || 'Failed to create project',
      type: 'error'
    })
  } finally {
    loading.value = false
  }
}

// Script di TeamProjects.vue
const selectedTask = ref(null);
const showTaskModal = ref(false);

// Perbaiki metode handleEditTask
const handleEditTask = (task) => {
  console.log('Editing task:', task);
  selectedTask.value = task;
  showTaskModal.value = true;
  showCreateModal.value = false; // Pastikan modal project tidak muncul
};

// Tambahkan metode untuk close task modal
const closeTaskModal = () => {
  showTaskModal.value = false;
  selectedTask.value = null;
};

// Tambahkan metode untuk handle submit task
// const handleTaskSubmit = async (taskData) => {
//   try {
//     loading.value = true;
//     const response = await apiClient.post('/web/v2/team/tasks', {
//       jsonrpc: '2.0',
//       id: new Date().getTime(),
//       params: {
//         operation: 'update',
//         task_id: selectedTask.value.id,
//         ...taskData
//       }
//     });

//     if (response.data.result?.status === 'success') {
//       showToast({
//         message: 'Task updated successfully',
//         type: 'success'
//       });
//       closeTaskModal();
      
//       // Refresh data jika perlu
//       if (viewMode.value === 'gantt') {
//         // Refresh gantt chart data
//       } else {
//         fetchProjects();
//       }
//     }
//   } catch (error) {
//     console.error('Error updating task:', error);
//     showToast({
//       message: error.message || 'Failed to update task',
//       type: 'error'
//     });
//   } finally {
//     loading.value = false;
//   }
// };

// Tambahkan state untuk sorting di bagian state declarations
const sortOptions = ref({
  field: 'priority', // Default sort by priority
  order: 'desc'     // Default order descending (highest first)
});

// Tambahkan computed property untuk menentukan label sort yang aktif
const activeSortLabel = computed(() => {
  const fieldLabels = {
    'priority': 'Priority',
    'date_start': 'Start Date',
    'date_end': 'End Date',
    'state': 'Status',
    'name': 'Name',
    'progress': 'Progress'
  };
  
  const orderLabels = {
    'asc': 'Ascending',
    'desc': 'Descending'
  };
  
  return `${fieldLabels[sortOptions.value.field]} (${orderLabels[sortOptions.value.order]})`;
});

// Tambahkan constants dan functions ini di bagian script
const sortFieldOptions = [
  { value: 'priority', label: 'Priority' },
  { value: 'date_start', label: 'Start Date' },
  { value: 'date_end', label: 'End Date' },
  { value: 'state', label: 'Status' },
  { value: 'name', label: 'Name' },
  { value: 'progress', label: 'Progress' }
];

// Fungsi untuk mendapatkan label sort yang aktif
const getSortLabel = () => {
  const option = sortFieldOptions.find(o => o.value === sortOptions.value.field);
  return option ? option.label : 'Priority';
};

// Tambahkan fungsi untuk mengganti sort
const changeSort = (field) => {
  // Jika field sama, toggle order
  if (field === sortOptions.value.field) {
    sortOptions.value.order = sortOptions.value.order === 'asc' ? 'desc' : 'asc';
  } else {
    // Jika field berbeda, set field dan default order
    sortOptions.value.field = field;
    // Default order berdasarkan field
    if (field === 'name') {
      sortOptions.value.order = 'asc'; // Nama biasanya A-Z
    } else {
      sortOptions.value.order = 'desc'; // Fields lain biasanya highest first
    }
  }
  
  // Refresh projects dengan sort baru
  fetchProjects();
};



// Tambahkan state dan fungsi untuk archived projects
const showArchived = ref(false);

const toggleArchived = () => {
  showArchived.value = !showArchived.value;
  // Reset pagination
  pagination.value.currentPage = 1;
  // Fetch projects with updated archived setting
  fetchProjects();
};

// Fungsi untuk archive/unarchive project
const toggleProjectArchive = async (projectId, isActive) => {
  try {
    const response = await apiClient.post('/web/v2/team/projects/toggle_archive', {
      jsonrpc: '2.0',
      id: new Date().getTime(),
      params: {
        project_id: projectId
      }
    });

    if (response.data.result?.status === 'success') {
      const actionText = response.data.result.data.active ? 'activated' : 'archived';
      showToast({
        message: `Project ${actionText} successfully`,
        type: 'success'
      });
      
      // Refresh projects
      fetchProjects();
    } else {
      showToast({
        message: response.data.result?.message || 'Failed to update project status',
        type: 'error'
      });
    }
  } catch (error) {
    console.error('Error toggling project archive:', error);
    showToast({
      message: error.message || 'Failed to update project status',
      type: 'error'
    });
  }
};

onMounted(() => {
  const today = new Date();
  
  // Set filter default menggunakan h-7 hingga h+14
  filters.value.date_start = format(subDays(today, 7), 'yyyy-MM-dd');
  filters.value.date_end = format(addDays(today, 14), 'yyyy-MM-dd');
  
  // Ambil data departemen terlebih dahulu
  fetchDepartments();
  
  // Kemudian ambil data proyek
  fetchProjects(true);
});

// Watch filters untuk reset page saat terjadi perubahan
watch(filters, () => {
  pagination.value.currentPage = 1;
}, { deep: true });
</script>