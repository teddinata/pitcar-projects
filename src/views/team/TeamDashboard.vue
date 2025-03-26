<template>
  <div class="min-h-screen bg-gray-50 py-6">
    <div class="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Dashboard Header -->
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Team Project Dashboard</h1>
        <div class="flex space-x-4">
          <!-- Department Filter -->
          <div>
            <select
              v-model="selectedDepartment"
              @change="loadDashboardData"
              class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md"
            >
              <option value="">All Departments</option>
              <option v-for="dept in departments" :key="dept.id" :value="dept.id">
                {{ dept.name }}
              </option>
            </select>
          </div>
          
          <!-- Date Range Selector -->
          <div class="flex space-x-2">
            <input
              type="date"
              v-model="dateFrom"
              class="block w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md"
            />
            <input
              type="date"
              v-model="dateTo"
              class="block w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md"
            />
          </div>
          
          <button
            @click="loadDashboardData"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-purple-600 to-indigo-600"
          >
            <RefreshCw class="h-4 w-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>
      
      <!-- Loading Indicator -->
      <div v-if="loading" class="flex justify-center py-10">
        <Loader2 class="h-10 w-10 text-red-600 animate-spin" />
      </div>
      
      <template v-else>
        <!-- Summary Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div class="bg-white shadow rounded-lg p-4">
            <div class="flex items-center">
              <div class="flex-shrink-0 bg-red-100 rounded-md p-3">
                <ClipboardCheck class="h-6 w-6 text-red-600" />
              </div>
              <div class="ml-4">
                <h2 class="text-sm font-medium text-gray-500">Projects</h2>
                <div class="flex items-baseline">
                  <p class="text-2xl font-bold text-gray-900">{{ dashboardSummary.total_projects }}</p>
                  <p class="ml-2 text-sm text-green-600">
                    {{ dashboardSummary.active_projects }} active
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="bg-white shadow rounded-lg p-4">
            <div class="flex items-center">
              <div class="flex-shrink-0 bg-blue-100 rounded-md p-3">
                <CheckSquare class="h-6 w-6 text-blue-600" />
              </div>
              <div class="ml-4">
                <h2 class="text-sm font-medium text-gray-500">Tasks</h2>
                <div class="flex items-baseline">
                  <p class="text-2xl font-bold text-gray-900">{{ dashboardSummary.total_tasks }}</p>
                  <p class="ml-2 text-sm text-green-600">
                    {{ dashboardSummary.completed_tasks }} completed
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="bg-white shadow rounded-lg p-4">
            <div class="flex items-center">
              <div class="flex-shrink-0 bg-green-100 rounded-md p-3">
                <Clock class="h-6 w-6 text-green-600" />
              </div>
              <div class="ml-4">
                <h2 class="text-sm font-medium text-gray-500">Hours Logged</h2>
                <div class="flex items-baseline">
                  <p class="text-2xl font-bold text-gray-900">{{ dashboardSummary.total_actual_hours }}</p>
                  <p class="ml-2 text-sm text-gray-600">
                    of {{ dashboardSummary.total_planned_hours }} planned
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="bg-white shadow rounded-lg p-4">
            <div class="flex items-center">
              <div class="flex-shrink-0 bg-purple-100 rounded-md p-3">
                <BarChart class="h-6 w-6 text-purple-600" />
              </div>
              <div class="ml-4">
                <h2 class="text-sm font-medium text-gray-500">Completion Rate</h2>
                <div class="flex items-baseline">
                  <p class="text-2xl font-bold text-gray-900">{{ dashboardSummary.task_completion_rate }}%</p>
                  <p class="ml-2 text-sm" :class="dashboardSummary.hours_efficiency > 85 ? 'text-green-600' : 'text-yellow-600'">
                    {{ dashboardSummary.hours_efficiency }}% efficient
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Main Dashboard Widgets Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <!-- First Column (2/3 width on large screens) -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Team Workload -->
            <TeamWorkload 
              :workloadData="teamWorkload" 
              :loading="loadingWorkload" 
              @refresh="fetchTeamWorkload"
            />
            
            <!-- Recent Activity -->
            <RecentActivity 
              :activityData="recentActivity" 
              :loading="loadingActivity" 
              @refresh="fetchRecentActivity"
              @load-more="loadMoreActivity"
            />
          </div>
          
          <!-- Second Column (1/3 width on large screens) -->
          <div class="space-y-6">
            <!-- Upcoming Deadlines -->
            <UpcomingDeadlines 
              :milestones="projectMilestones" 
              :loading="loadingMilestones" 
              @refresh="fetchProjectMilestones"
            />
            
            <!-- Project Performance -->
            <ProjectPerformance 
              :performanceData="projectPerformance" 
              :loading="loadingPerformance" 
              @refresh="fetchProjectPerformance"
            />
          </div>
        </div>
        
        <!-- Resource Allocation -->
        <ResourceAllocation 
          :allocationData="resourceAllocation" 
          :loading="loadingAllocation" 
          @refresh="fetchResourceAllocation"
        />
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import dashboardService from '@/services/dashboardService';
import { useToast } from '@/composables/useToast';
import { 
  BarChart, 
  CheckSquare, 
  ClipboardCheck, 
  Clock, 
  Loader2,
  RefreshCw
} from 'lucide-vue-next';

// Import dashboard components
import TeamWorkload from '@/components/team-dashboard/TeamWorkload.vue';
import ProjectPerformance from '@/components/team-dashboard/ProjectPerformance.vue';
import ResourceAllocation from '@/components/team-dashboard/ResourceAllocation.vue';
import RecentActivity from '@/components/team-dashboard/RecentActivity.vue';
import UpcomingDeadlines from '@/components/team-dashboard/UpcomingDeadlines.vue';

const { showToast } = useToast();

// State
const loading = ref(true);
const loadingWorkload = ref(false);
const loadingActivity = ref(false);
const loadingPerformance = ref(false);
const loadingMilestones = ref(false);
const loadingAllocation = ref(false);

const selectedDepartment = ref('');
const dateFrom = ref('');
const dateTo = ref('');
const departments = ref([]);

// Dashboard data
const dashboardSummary = ref({
  total_projects: 0,
  active_projects: 0,
  completed_projects: 0,
  total_tasks: 0,
  completed_tasks: 0,
  task_completion_rate: 0,
  total_planned_hours: 0,
  total_actual_hours: 0,
  hours_efficiency: 0,
  upcoming_tasks: []
});

const teamWorkload = ref([]);
const recentActivity = ref([]);
const projectPerformance = ref({
  efficiency: 0,
  on_time_completion: 0,
  budget_utilization: 0,
  team_allocation: 0,
  timeline: [],
  project_scores: []
});
const projectMilestones = ref([]);
const resourceAllocation = ref({
  allocation_by_project: [],
  allocation_by_employee: [],
  project_resources: []
});

// Methods
const initDateRange = () => {
  const today = new Date();
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(today.getMonth() - 1);
  
  dateFrom.value = oneMonthAgo.toISOString().substring(0, 10);
  dateTo.value = today.toISOString().substring(0, 10);
};

const loadDashboardData = async () => {
  loading.value = true;
  
  try {
    await Promise.all([
      fetchDashboardSummary(),
      fetchTeamWorkload(),
      fetchRecentActivity(),
      fetchProjectPerformance(),
      fetchProjectMilestones(),
      fetchResourceAllocation()
    ]);
    showToast({
      message: 'Dashboard data loaded successfully',
      type: 'success'
    });
    
  } catch (error) {
    console.error('Error loading dashboard data:', error);
    showToast('Failed to load dashboard data', 'error');
  } finally {
    loading.value = false;
  }
};

const fetchDepartments = async () => {
  try {
    const response = await dashboardService.getDepartments();
    
    if (response.success) {
      departments.value = response.data || [];
    } else {
      console.error('Error fetching departments:', response.error);
    }
  } catch (error) {
    console.error('Error fetching departments:', error);
  }
};

const fetchDashboardSummary = async () => {
  try {
    const params = {};
    
    if (selectedDepartment.value) {
      params.department_id = selectedDepartment.value;
    }
    
    const response = await dashboardService.getDashboardSummary(params);
    
    if (response.success) {
      dashboardSummary.value = response.data.summary || {};
    } else {
      console.error('Error fetching dashboard summary:', response.error);
    }
  } catch (error) {
    console.error('Error fetching dashboard summary:', error);
  }
};

const fetchTeamWorkload = async () => {
  loadingWorkload.value = true;
  
  try {
    const params = {};
    
    if (selectedDepartment.value) {
      params.department_id = selectedDepartment.value;
    }
    
    const response = await dashboardService.getTeamWorkload(params);
    
    if (response.success) {
      teamWorkload.value = response.data || [];
    } else {
      console.error('Error fetching team workload:', response.error);
    }
  } catch (error) {
    console.error('Error fetching team workload:', error);
  } finally {
    loadingWorkload.value = false;
  }
};

const fetchRecentActivity = async () => {
  loadingActivity.value = true;
  
  try {
    const params = {
      limit: 10
    };
    
    if (selectedDepartment.value) {
      params.department_id = selectedDepartment.value;
    }
    
    const response = await dashboardService.getRecentActivity(params);
    
    if (response.success) {
      recentActivity.value = response.data || [];
    } else {
      console.error('Error fetching recent activity:', response.error);
    }
  } catch (error) {
    console.error('Error fetching recent activity:', error);
  } finally {
    loadingActivity.value = false;
  }
};

const loadMoreActivity = async () => {
  try {
    const params = {
      limit: 10,
      offset: recentActivity.value.length
    };
    
    if (selectedDepartment.value) {
      params.department_id = selectedDepartment.value;
    }
    
    const response = await dashboardService.getRecentActivity(params);
    
    if (response.success && response.data.length > 0) {
      recentActivity.value = [...recentActivity.value, ...response.data];
    }
  } catch (error) {
    console.error('Error loading more activity:', error);
  }
};

const fetchProjectPerformance = async () => {
  loadingPerformance.value = true;
  
  try {
    const params = {};
    
    if (selectedDepartment.value) {
      params.department_id = selectedDepartment.value;
    }
    
    if (dateFrom.value) params.date_from = dateFrom.value;
    if (dateTo.value) params.date_to = dateTo.value;
    
    const response = await dashboardService.getProjectPerformance(params);
    
    if (response.success) {
      projectPerformance.value = response.data || {
        project_scores: []
      };
    } else {
      console.error('Error fetching project performance:', response.error);
    }
  } catch (error) {
    console.error('Error fetching project performance:', error);
  } finally {
    loadingPerformance.value = false;
  }
};

const fetchProjectMilestones = async () => {
  loadingMilestones.value = true;
  
  try {
    const params = {
      days_ahead: 30
    };
    
    if (selectedDepartment.value) {
      params.department_id = selectedDepartment.value;
    }
    
    const response = await dashboardService.getProjectMilestones(params);
    
    if (response.success) {
      projectMilestones.value = response.data || [];
    } else {
      console.error('Error fetching project milestones:', response.error);
    }
  } catch (error) {
    console.error('Error fetching project milestones:', error);
  } finally {
    loadingMilestones.value = false;
  }
};

const fetchResourceAllocation = async () => {
  loadingAllocation.value = true;
  
  try {
    const params = {};
    
    if (selectedDepartment.value) {
      params.department_id = selectedDepartment.value;
    }
    
    if (dateFrom.value) params.date_from = dateFrom.value;
    if (dateTo.value) params.date_to = dateTo.value;
    
    const response = await dashboardService.getResourceAllocation(params);
    
    if (response.success) {
      resourceAllocation.value = response.data || {
        allocation_by_project: [],
        allocation_by_employee: [],
        project_resources: []
      };
    } else {
      console.error('Error fetching resource allocation:', response.error);
    }
  } catch (error) {
    console.error('Error fetching resource allocation:', error);
  } finally {
    loadingAllocation.value = false;
  }
};

// Lifecycle hooks
onMounted(() => {
  initDateRange();
  
  Promise.all([
    fetchDepartments()
  ]).then(() => {
    loadDashboardData();
  });
});
</script>