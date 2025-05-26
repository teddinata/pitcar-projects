<!-- src/views/dashboard/Projects.vue - Enhanced Version -->
<template>
  <div class="min-h-screen bg-gray-50">
    <Toast
      v-model:show="toast.show"
      :message="toast.message"
      :type="toast.type"
      :duration="toast.duration"
    />

    <!-- Header with Filters -->
    <div class="bg-white shadow">
      <div class="w-full max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div
          class="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between"
        >
          <!-- Title -->
          <h1 class="text-xl sm:text-2xl font-semibold text-gray-900">
            Marketing Projects
          </h1>

          <!-- Controls Container -->
          <div
            class="flex flex-col space-y-3 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4"
          >
            <!-- View Toggle Buttons -->
            <div class="inline-flex rounded-md shadow-sm">
              <button
                @click="viewMode = 'grid'"
                class="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium rounded-l-md focus:outline-none focus:ring-1 focus:ring-red-500 flex items-center"
                :class="
                  viewMode === 'grid'
                    ? 'bg-red-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                "
              >
                <ViewColumnsIcon
                  class="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-1.5"
                />
                Grid
              </button>
              <button
                @click="viewMode = 'gantt'"
                class="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium rounded-r-md focus:outline-none focus:ring-1 focus:ring-red-500 flex items-center"
                :class="
                  viewMode === 'gantt'
                    ? 'bg-red-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                "
              >
                <ChartBarIcon
                  class="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-1.5"
                />
                Timeline
              </button>
            </div>

            <!-- Sort and Filter Controls (for Grid View) -->
            <div v-if="viewMode === 'grid'" class="flex items-center space-x-2">
              <!-- Status Filter -->
              <select
                v-model="filters.state"
                class="w-full sm:w-auto rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm focus:ring-red-500 focus:border-red-500"
              >
                <option value="">All Status</option>
                <option value="draft">Draft</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>

              <!-- Date Filters -->
              <div class="flex space-x-2">
                <input
                  type="date"
                  v-model="filters.date_start"
                  class="w-full sm:w-auto rounded-md border-gray-300 py-2 text-sm focus:ring-red-500 focus:border-red-500"
                  placeholder="Start Date"
                />
                <input
                  type="date"
                  v-model="filters.date_end"
                  class="w-full sm:w-auto rounded-md border-gray-300 py-2 text-sm focus:ring-red-500 focus:border-red-500"
                  placeholder="End Date"
                />
              </div>

              <!-- Apply Filters Button -->
              <button
                @click="fetchProjects"
                class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-rose-600 to-rose-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <FunnelIcon class="h-4 w-4 mr-1.5" />
                Apply Filters
              </button>

              <!-- Reset Button -->
              <button
                @click="resetFilters"
                class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <ArrowPathIcon class="h-4 w-4 mr-1.5" />
                Reset
              </button>
            </div>

            <!-- New Project Button -->
            <button
              @click="showCreateModal = true"
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-rose-600 to-rose-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <PlusIcon class="h-4 w-4 mr-1.5" />
              New Project
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <main class="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Grid View -->
      <div v-if="viewMode === 'grid'">
        <!-- Projects Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ContentProjectCard
            v-for="project in projects"
            :key="project.id"
            :project="project"
            @click="viewProject(project.id)"
            @status-change="updateProjectStatus"
          />
        </div>

        <!-- Pagination for Grid View -->
        <div
          v-if="!loading && projects.length > 0"
          class="mt-6 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6"
        >
          <div class="flex flex-1 justify-between sm:hidden">
            <button
              @click="prevPage"
              :disabled="pagination.currentPage <= 1"
              class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              :class="{
                'opacity-50 cursor-not-allowed': pagination.currentPage <= 1,
              }"
            >
              Previous
            </button>
            <button
              @click="nextPage"
              :disabled="pagination.currentPage >= pagination.totalPages"
              class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              :class="{
                'opacity-50 cursor-not-allowed':
                  pagination.currentPage >= pagination.totalPages,
              }"
            >
              Next
            </button>
          </div>
          <div
            class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between"
          >
            <div>
              <p class="text-sm text-gray-700">
                Showing
                <span class="font-medium">{{
                  (pagination.currentPage - 1) * pagination.limit + 1
                }}</span>
                to
                <span class="font-medium">{{
                  Math.min(
                    pagination.currentPage * pagination.limit,
                    pagination.total
                  )
                }}</span>
                of
                <span class="font-medium">{{ pagination.total }}</span>
                projects
              </p>
            </div>
            <div class="isolate inline-flex -space-x-px rounded-md shadow-sm">
              <!-- Pagination buttons logic here (same as TeamProjects.vue) -->
              <button
                @click="prevPage"
                :disabled="pagination.currentPage <= 1"
                class="relative inline-flex items-center px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                :class="{
                  'opacity-50 cursor-not-allowed': pagination.currentPage <= 1,
                }"
              >
                <span class="sr-only">Previous</span>
                &laquo;
              </button>

              <template v-for="page in pagination.totalPages" :key="page">
                <button
                  v-if="
                    page === 1 ||
                    page === pagination.totalPages ||
                    (page >= pagination.currentPage - 1 &&
                      page <= pagination.currentPage + 1)
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
              </template>

              <button
                @click="nextPage"
                :disabled="pagination.currentPage >= pagination.totalPages"
                class="relative inline-flex items-center px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                :class="{
                  'opacity-50 cursor-not-allowed':
                    pagination.currentPage >= pagination.totalPages,
                }"
              >
                <span class="sr-only">Next</span>
                &raquo;
              </button>
            </div>
          </div>
        </div>

        <!-- Empty State for Grid -->
        <div v-if="!loading && projects.length === 0" class="text-center py-12">
          <DocumentIcon class="mx-auto h-12 w-12 text-gray-400" />
          <h3 class="mt-2 text-sm font-medium text-gray-900">No projects</h3>
          <p class="mt-1 text-sm text-gray-500">
            Get started by creating a new project.
          </p>
          <div class="mt-6">
            <button
              @click="showCreateModal = true"
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-rose-600 to-rose-500"
            >
              <PlusIcon class="h-4 w-4 mr-1.5" />
              New Project
            </button>
          </div>
        </div>
      </div>

      <!-- Gantt Chart View -->
      <div v-else-if="viewMode === 'gantt'">
        <ContentProjectGanttChart
          :start-date-filter="filters.date_start"
          :end-date-filter="filters.date_end"
          :state-filter="filters.state"
          :project-manager-filter="filters.project_manager_id"
          :sort-field="'date_start'"
          :sort-order="'asc'"
          @view-project-detail="handleViewProjectDetail"
          @edit-task="handleEditTask"
          @update:dateRange="handleDateRangeUpdate"
          @clearFilter="clearFilter"
          @resetFilters="resetFilters"
        />
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center py-12">
        <div
          class="animate-spin rounded-full h-8 w-8 border-2 border-red-600 border-t-transparent"
        ></div>
      </div>
    </main>

    <!-- Create/Edit Project Modal -->
    <ProjectFormModal
      v-if="showCreateModal"
      :show="showCreateModal"
      :project="selectedProject"
      @close="closeModal"
      @submit="handleProjectSubmit"
    />

    <!-- Task Edit Modal (when editing from Gantt) -->
    <TaskFormModal
      v-if="showTaskModal"
      :show="showTaskModal"
      :task="selectedTask"
      :projects="allProjects"
      @close="closeTaskModal"
      @submit="handleTaskSubmit"
      @delete="handleTaskDelete"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "@/composables/useToast";
import apiClient from "@/config/api";
import {
  PlusIcon,
  DocumentIcon,
  ArrowPathIcon,
  FunnelIcon,
  ViewColumnsIcon,
  ChartBarIcon,
} from "@heroicons/vue/24/outline";

import ProjectCard from "@/components/projects/ProjectCard.vue";
import ContentProjectCard from "@/components/content/ContentProjectCard.vue";
import ProjectFormModal from "@/components/projects/ProjectFormModal.vue";
import ContentProjectGanttChart from "@/components/content/ContentProjectGanttChart.vue";
import TaskFormModal from "@/components/content/TaskFormModal.vue";
import Toast from "@/components/Toast.vue";

// State
const router = useRouter();
const { toast, showToast } = useToast();
const loading = ref(false);
const projects = ref([]);
const allProjects = ref([]);
const showCreateModal = ref(false);
const selectedProject = ref(null);
const viewMode = ref("grid"); // 'grid' or 'gantt'

// Task modal state
const showTaskModal = ref(false);
const selectedTask = ref(null);

// Pagination state
const pagination = ref({
  currentPage: 1,
  totalPages: 1,
  limit: 12,
  total: 0,
});

const filters = ref({
  state: "",
  date_start: "",
  date_end: "",
  project_manager_id: "",
});

// Methods
const fetchProjects = async () => {
  try {
    loading.value = true;
    const response = await apiClient.post("/web/v2/content/projects/list", {
      jsonrpc: "2.0",
      id: new Date().getTime(),
      params: {
        ...filters.value,
        page: pagination.value.currentPage,
        limit: pagination.value.limit,
        sort_field: "date_start",
        sort_order: "desc",
      },
    });

    if (response.data.result?.status === "success") {
      // Normalize project data to ensure compatibility
      projects.value = response.data.result.data.map((project) => ({
        ...project,
        // Ensure all required fields exist with fallbacks
        video_count: project.video_count || project.actual_video_count || 0,
        design_count: project.design_count || project.actual_design_count || 0,
        total_count: project.total_count || project.task_count || 0,
        completed_count:
          project.completed_count || project.completed_task_count || 0,
        progress: project.progress || 0,
        state: project.state || "draft",
        project_manager_name: project.project_manager_name || "",
        planned_video_count: project.planned_video_count || 0,
        planned_design_count: project.planned_design_count || 0,
      }));

      // Update pagination
      if (response.data.result.pagination) {
        pagination.value = {
          currentPage: response.data.result.pagination.page || 1,
          totalPages: response.data.result.pagination.total_pages || 1,
          limit: response.data.result.pagination.limit || 12,
          total: response.data.result.pagination.total || 0,
        };
      }

      showToast({
        message: "Projects loaded successfully",
        type: "success",
      });
    }
  } catch (error) {
    console.error("Error fetching projects:", error);
    showToast({
      message: error.message || "Failed to load projects",
      type: "error",
      duration: 5000,
    });
  } finally {
    loading.value = false;
  }
};

const updateProjectStatus = async (projectId, newStatus) => {
  try {
    const response = await apiClient.post("/web/v2/content/projects", {
      jsonrpc: "2.0",
      id: new Date().getTime(),
      params: {
        operation: "update",
        project_id: projectId,
        state: newStatus,
      },
    });

    if (response.data.result?.status === "success") {
      showToast({
        message: "Project status updated successfully",
        type: "success",
      });
      await fetchProjects();
    }
  } catch (error) {
    console.error("Error updating project status:", error);
    showToast({
      message: error.message || "Failed to update project status",
      type: "error",
    });
  }
};

const resetFilters = () => {
  filters.value = {
    state: "",
    date_start: "",
    date_end: "",
    project_manager_id: "",
  };
  pagination.value.currentPage = 1;
  fetchProjects();
};

const viewProject = (projectId) => {
  router.push(`/marketing/project/${projectId}`);
};

const closeModal = () => {
  showCreateModal.value = false;
  selectedProject.value = null;
};

const handleProjectSubmit = async (projectData) => {
  try {
    loading.value = true;
    const response = await apiClient.post("/web/v2/content/projects", {
      jsonrpc: "2.0",
      id: new Date().getTime(),
      params: {
        operation: "create",
        ...projectData,
      },
    });

    if (response.data.result?.status === "success") {
      showToast({
        message: "Project created successfully",
        type: "success",
      });
      closeModal();
      fetchProjects();
    }
  } catch (error) {
    console.error("Error creating project:", error);
    showToast({
      message: error.message || "Failed to create project",
      type: "error",
    });
  } finally {
    loading.value = false;
  }
};

// Pagination methods
const goToPage = (page) => {
  if (page < 1 || page > pagination.value.totalPages) return;
  pagination.value.currentPage = page;
  fetchProjects();
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

// Gantt Chart handlers
const handleViewProjectDetail = (project) => {
  router.push(`/marketing/project/${project.id}`);
};

const handleEditTask = (task) => {
  selectedTask.value = task;
  showTaskModal.value = true;
};

const closeTaskModal = () => {
  showTaskModal.value = false;
  selectedTask.value = null;
};

const handleTaskSubmit = async (taskData) => {
  try {
    const response = await apiClient.post("/web/v2/content/tasks", {
      jsonrpc: "2.0",
      id: new Date().getTime(),
      params: {
        operation: selectedTask.value ? "update" : "create",
        task_id: selectedTask.value?.id,
        ...taskData,
      },
    });

    if (response.data.result?.status === "success") {
      showToast({
        message: selectedTask.value
          ? "Task updated successfully"
          : "Task created successfully",
        type: "success",
      });
      closeTaskModal();
      // Refresh data based on current view
      if (viewMode.value === "grid") {
        fetchProjects();
      }
    }
  } catch (error) {
    showToast({
      message: error.message || "Failed to save task",
      type: "error",
    });
  }
};

const handleTaskDelete = async (taskId) => {
  try {
    const response = await apiClient.post("/web/v2/content/tasks", {
      jsonrpc: "2.0",
      id: new Date().getTime(),
      params: {
        operation: "delete",
        task_id: taskId,
      },
    });

    if (response.data.result?.status === "success") {
      showToast({
        message: "Task deleted successfully",
        type: "success",
      });
      closeTaskModal();
      // Refresh data
      if (viewMode.value === "grid") {
        fetchProjects();
      }
    }
  } catch (error) {
    showToast({
      message: error.message || "Failed to delete task",
      type: "error",
    });
  }
};

const handleDateRangeUpdate = (dateRange) => {
  if (dateRange && dateRange.start && dateRange.end) {
    filters.value.date_start = dateRange.start;
    filters.value.date_end = dateRange.end;
  }
};

const clearFilter = (filterName) => {
  if (filterName === "date") {
    filters.value.date_start = "";
    filters.value.date_end = "";
  } else {
    filters.value[filterName] = "";
  }
  fetchProjects();
};

// Watch for view mode changes
watch(viewMode, (newMode) => {
  if (newMode === "gantt") {
    // When switching to gantt view, set default date range if not set
    if (!filters.value.date_start && !filters.value.date_end) {
      const today = new Date();
      const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const fourteenDaysAhead = new Date(
        today.getTime() + 14 * 24 * 60 * 60 * 1000
      );

      filters.value.date_start = sevenDaysAgo.toISOString().split("T")[0];
      filters.value.date_end = fourteenDaysAhead.toISOString().split("T")[0];
    }
  }
});

onMounted(() => {
  fetchProjects();
});
</script>
