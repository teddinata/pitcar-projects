<template>
  <div class="min-h-screen bg-gray-50 py-6">
    <div class="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Dashboard Header -->
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Project Dashboard</h1>
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
        
        <!-- Project Progress -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <!-- Project Progress Chart -->
          <div class="bg-white shadow rounded-lg p-4 md:col-span-2">
            <h2 class="text-lg font-medium text-gray-900 mb-4">Project Progress</h2>
            <div class="h-80">
              <canvas ref="projectProgressChart"></canvas>
            </div>
          </div>
          
          <!-- Upcoming Deadlines -->
          <div class="bg-white shadow rounded-lg p-4">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-lg font-medium text-gray-900">Upcoming Deadlines</h2>
            </div>
            
            <div class="space-y-3">
              <div v-for="(task, index) in dashboardSummary.upcoming_tasks" :key="index" class="flex items-start p-2 hover:bg-gray-50 rounded">
                <div class="flex-shrink-0 mt-1">
                  <Calendar class="h-5 w-5 text-gray-400" />
                </div>
                <div class="ml-3 flex-1">
                  <div class="text-sm font-medium text-gray-900 truncate">{{ task.name }}</div>
                  <div class="text-xs text-gray-500">
                    Due: {{ formatDate(task.dates.planned_end) }}
                  </div>
                  <div class="mt-1 flex items-center">
                    <div class="w-full bg-gray-200 rounded-full h-2">
                      <div class="bg-blue-600 h-2 rounded-full" :style="{width: `${task.progress}%`}"></div>
                    </div>
                    <span class="ml-2 text-xs text-gray-500">{{ task.progress }}%</span>
                  </div>
                </div>
              </div>
              
              <div v-if="!dashboardSummary.upcoming_tasks || dashboardSummary.upcoming_tasks.length === 0" class="text-center py-4 text-gray-500">
                No upcoming deadlines
              </div>
            </div>
          </div>
        </div>
        
        <!-- Team Workload and Task Distribution -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <!-- Team Workload -->
          <div class="bg-white shadow rounded-lg p-4 md:col-span-2">
            <h2 class="text-lg font-medium text-gray-900 mb-4">Team Workload</h2>
            
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team Member</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tasks</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hours/Day</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Workload</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="member in teamWorkload" :key="member.employee.id" class="hover:bg-gray-50">
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {{ member.employee.name }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {{ member.assigned_tasks }} ({{ member.high_priority_tasks }} high priority)
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {{ member.hours_per_day }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            class="h-2 rounded-full" 
                            :class="{
                              'bg-green-500': member.workload_level === 'low',
                              'bg-yellow-500': member.workload_level === 'medium',
                              'bg-red-500': member.workload_level === 'high'
                            }"
                            :style="{width: `${member.workload_score}%`}"
                          ></div>
                        </div>
                        <span class="ml-2 text-xs text-gray-500">{{ member.workload_score }}%</span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <!-- Task Distribution -->
          <div class="bg-white shadow rounded-lg p-4">
            <h2 class="text-lg font-medium text-gray-900 mb-4">Task Distribution</h2>
            <div class="h-60">
              <canvas ref="taskDistributionChart"></canvas>
            </div>
          </div>
        </div>
        
        <!-- Recent Activity -->
        <div class="bg-white shadow rounded-lg p-4 mb-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-medium text-gray-900">Recent Activity</h2>
          </div>
          
          <div class="flow-root">
            <ul class="-mb-8">
              <li v-for="(activity, index) in recentActivity" :key="index">
                <div class="relative pb-8">
                  <span class="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" v-if="index !== recentActivity.length - 1"></span>
                  <div class="relative flex space-x-3">
                    <div>
                      <span class="h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white" :class="getActivityIconClass(activity.type)">
                        <component :is="getActivityIcon(activity.type)" class="h-5 w-5 text-white" />
                      </span>
                    </div>
                    <div class="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                      <div>
                        <p class="text-sm text-gray-800">
                          <span class="font-medium text-gray-900">{{ activity.user.name }}</span>
                          {{ getActivityText(activity) }}
                          <span class="font-medium text-gray-900">{{ activity.title }}</span>
                        </p>
                        <p class="text-xs text-gray-500 mt-0.5" v-if="activity.description">
                          {{ activity.description }}
                        </p>
                      </div>
                      <div class="text-right text-sm whitespace-nowrap text-gray-500">
                        {{ formatRelativeTime(activity.date) }}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
        
        <!-- Project Performance Metrics -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <!-- Performance Scores -->
          <div class="bg-white shadow rounded-lg p-4">
            <h2 class="text-lg font-medium text-gray-900 mb-4">Project Performance</h2>
            
            <div class="space-y-4">
              <div v-for="project in projectPerformance.project_scores" :key="project.project.id" class="p-3 hover:bg-gray-50 rounded">
                <div class="flex justify-between items-center mb-1">
                  <h3 class="text-sm font-medium text-gray-900">{{ project.project.name }}</h3>
                  <span class="text-sm font-bold" :class="getScoreColorClass(project.performance_score)">
                    {{ project.performance_score }}%
                  </span>
                </div>
                
                <div class="flex flex-col space-y-2">
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <div class="flex justify-between mb-1">
                        <span class="text-xs text-gray-500">Progress</span>
                        <span class="text-xs text-gray-700">{{ project.progress }}%</span>
                      </div>
                      <div class="w-full bg-gray-200 rounded-full h-1.5">
                        <div class="bg-blue-600 h-1.5 rounded-full" :style="{width: `${project.progress}%`}"></div>
                      </div>
                    </div>
                    
                    <div>
                      <div class="flex justify-between mb-1">
                        <span class="text-xs text-gray-500">On-time Delivery</span>
                        <span class="text-xs text-gray-700">{{ project.on_time_delivery }}%</span>
                      </div>
                      <div class="w-full bg-gray-200 rounded-full h-1.5">
                        <div class="bg-green-600 h-1.5 rounded-full" :style="{width: `${project.on_time_delivery}%`}"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Resource Allocation -->
          <div class="bg-white shadow rounded-lg p-4">
            <h2 class="text-lg font-medium text-gray-900 mb-4">Resource Allocation</h2>
            <div class="h-80">
              <canvas ref="resourceAllocationChart"></canvas>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useToast } from '@/composables/useToast';
import apiClient from '@/config/api';
import { 
  BarChart, 
  CheckSquare, 
  ClipboardCheck, 
  Clock, 
  Calendar,
  Loader2,
  RefreshCw,
  ListTodo,
  MessageSquare,
  UserCheck,
  FileText,
  CheckCircle
} from 'lucide-vue-next';
import Chart from 'chart.js/auto';

const { showToast } = useToast();

// Chart refs
const projectProgressChart = ref(null);
const taskDistributionChart = ref(null);
const resourceAllocationChart = ref(null);

// State
const loading = ref(true);
const selectedDepartment = ref('');
const dateFrom = ref('');
const dateTo = ref('');
const departments = ref([]);
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
const taskDistribution = ref({
  by_state: [],
  by_priority: [],
  by_project: []
});
const resourceAllocation = ref({
  allocation_by_project: [],
  allocation_by_employee: [],
  project_resources: []
});

// Chart instances
let projectProgressChartInstance = null;
let taskDistributionChartInstance = null;
let resourceAllocationChartInstance = null;

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
      fetchTaskDistribution(),
      fetchResourceAllocation()
    ]);
    
    // Render charts after data is loaded
    renderCharts();
    
  } catch (error) {
    console.error('Error loading dashboard data:', error);
    showToast({
      message: 'Failed to load dashboard data',
      type: 'error'
    });
  } finally {
    loading.value = false;
  }
};

const fetchDepartments = async () => {
  try {
    const response = await apiClient.post('/web/v2/team/tasks/departments', {
      jsonrpc: '2.0',
      method: 'call'
    });
    
    if (response.data.result?.status === 'success') {
      departments.value = response.data.result.data || [];
    }
  } catch (error) {
    console.error('Error fetching departments:', error);
  }
};

const fetchDashboardSummary = async () => {
  try {
    const params = {
      jsonrpc: '2.0',
      method: 'call',
      params: {}
    };
    
    if (selectedDepartment.value) {
      params.params.department_id = selectedDepartment.value;
    }
    
    const response = await apiClient.post('/web/v2/team/dashboard/summary', params);
    
    if (response.data.result?.status === 'success') {
      dashboardSummary.value = response.data.result.data.summary || {};
      dashboardSummary.value.upcoming_tasks = response.data.result.data.upcoming_tasks || [];
    }
  } catch (error) {
    console.error('Error fetching dashboard summary:', error);
  }
};

const fetchTeamWorkload = async () => {
  try {
    const params = {
      jsonrpc: '2.0',
      method: 'call',
      params: {}
    };
    
    if (selectedDepartment.value) {
      params.params.department_id = selectedDepartment.value;
    }
    
    const response = await apiClient.post('/web/v2/team/dashboard/workload', params);
    
    if (response.data.result?.status === 'success') {
      teamWorkload.value = response.data.result.data || [];
    }
  } catch (error) {
    console.error('Error fetching team workload:', error);
  }
};

const fetchRecentActivity = async () => {
  try {
    const params = {
      jsonrpc: '2.0',
      method: 'call',
      params: {
        limit: 10
      }
    };
    
    if (selectedDepartment.value) {
      params.params.department_id = selectedDepartment.value;
    }
    
    const response = await apiClient.post('/web/v2/team/dashboard/activity', params);
    
    if (response.data.result?.status === 'success') {
      recentActivity.value = response.data.result.data || [];
    }
  } catch (error) {
    console.error('Error fetching recent activity:', error);
  }
};

const fetchProjectPerformance = async () => {
  try {
    const params = {
      jsonrpc: '2.0',
      method: 'call',
      params: {}
    };
    
    if (selectedDepartment.value) {
      params.params.department_id = selectedDepartment.value;
    }
    
    if (dateFrom.value) params.params.date_from = dateFrom.value;
    if (dateTo.value) params.params.date_to = dateTo.value;
    
    const response = await apiClient.post('/web/v2/team/dashboard/performance', params);
    
    if (response.data.result?.status === 'success') {
      projectPerformance.value = response.data.result.data || {
        project_scores: []
      };
    }
  } catch (error) {
    console.error('Error fetching project performance:', error);
  }
};

const fetchTaskDistribution = async () => {
  try {
    const params = {
      jsonrpc: '2.0',
      method: 'call',
      params: {}
    };
    
    if (selectedDepartment.value) {
      params.params.department_id = selectedDepartment.value;
    }
    
    const response = await apiClient.post('/web/v2/team/dashboard/task-distribution', params);
    
    if (response.data.result?.status === 'success') {
      taskDistribution.value = response.data.result.data || {
        by_state: [],
        by_priority: [],
        by_project: []
      };
    }
  } catch (error) {
    console.error('Error fetching task distribution:', error);
  }
};

const fetchResourceAllocation = async () => {
  try {
    const params = {
      jsonrpc: '2.0',
      method: 'call',
      params: {}
    };
    
    if (selectedDepartment.value) {
      params.params.department_id = selectedDepartment.value;
    }
    
    if (dateFrom.value) params.params.date_from = dateFrom.value;
    if (dateTo.value) params.params.date_to = dateTo.value;
    
    const response = await apiClient.post('/web/v2/team/dashboard/resource-allocation', params);
    
    if (response.data.result?.status === 'success') {
      resourceAllocation.value = response.data.result.data || {
        allocation_by_project: [],
        allocation_by_employee: [],
        project_resources: []
      };
    }
  } catch (error) {
    console.error('Error fetching resource allocation:', error);
  }
};

const renderCharts = () => {
  renderProjectProgressChart();
  renderTaskDistributionChart();
  renderResourceAllocationChart();
};

const renderProjectProgressChart = () => {
  if (!projectProgressChart.value) return;
  
  // Destroy previous chart instance if it exists
  if (projectProgressChartInstance) {
    projectProgressChartInstance.destroy();
  }
  
  // Use project progress data
  const projects = dashboardSummary.value.project_progress || [];
  
  // Sort by progress
  projects.sort((a, b) => a.progress - b.progress);
  
  const data = {
    labels: projects.map(p => p.name),
    datasets: [
      {
        label: 'Progress (%)',
        data: projects.map(p => p.progress),
        backgroundColor: projects.map(p => {
          if (p.state === 'completed') return 'rgba(54, 162, 235, 0.6)';
          if (p.state === 'in_progress') return 'rgba(75, 192, 192, 0.6)';
          if (p.state === 'on_hold') return 'rgba(255, 159, 64, 0.6)';
          return 'rgba(201, 203, 207, 0.6)';
        }),
        borderColor: projects.map(p => {
          if (p.state === 'completed') return 'rgb(54, 162, 235)';
          if (p.state === 'in_progress') return 'rgb(75, 192, 192)';
          if (p.state === 'on_hold') return 'rgb(255, 159, 64)';
          return 'rgb(201, 203, 207)';
        }),
        borderWidth: 1
      }
    ]
  };
  
  const config = {
    type: 'bar',
    data: data,
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            afterLabel: function(context) {
              const project = projects[context.dataIndex];
              return [
                `Tasks: ${project.tasks_completed}/${project.tasks_count}`,
                `Status: ${project.state}`
              ];
            }
          }
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          max: 100,
          title: {
            display: true,
            text: 'Completion Percentage'
          }
        }
      }
    }
  };
  
  projectProgressChartInstance = new Chart(projectProgressChart.value, config);
};

const renderTaskDistributionChart = () => {
  if (!taskDistributionChart.value) return;
  
  // Destroy previous chart instance if it exists
  if (taskDistributionChartInstance) {
    taskDistributionChartInstance.destroy();
  }
  
  // Use task distribution data
  const stateData = taskDistribution.value.by_state || [];
  
  const data = {
    labels: stateData.map(s => s.label),
    datasets: [
      {
        data: stateData.map(s => s.value),
        backgroundColor: stateData.map(s => s.color),
        hoverOffset: 4
      }
    ]
  };
  
  const config = {
    type: 'doughnut',
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          labels: {
            boxWidth: 12,
            font: {
              size: 10
            }
          }
        }
      }
    }
  };
  
  taskDistributionChartInstance = new Chart(taskDistributionChart.value, config);
};

const renderResourceAllocationChart = () => {
  if (!resourceAllocationChart.value) return;
  
  // Destroy previous chart instance if it exists
  if (resourceAllocationChartInstance) {
    resourceAllocationChartInstance.destroy();
  }
  
  // Use resource allocation data
  const projectAllocation = resourceAllocation.value.allocation_by_project || [];
  
  // Limit to top 5 projects
  const topProjects = projectAllocation.slice(0, 5);
  
  const data = {
    labels: topProjects.map(p => p.project.name),
    datasets: [
      {
        label: 'Hours',
        data: topProjects.map(p => p.hours),
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 159, 64, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 205, 86, 0.6)'
        ],
        borderColor: [
          'rgb(54, 162, 235)',
          'rgb(75, 192, 192)',
          'rgb(255, 159, 64)',
          'rgb(153, 102, 255)',
          'rgb(255, 205, 86)'
        ],
        borderWidth: 1
      }
    ]
  };
  
  const config = {
    type: 'pie',
    data: data,
    options: { 
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            boxWidth: 12,
            font: {
              size: 10
            }
          }
        },
        tooltip: {
          callbacks: {
            afterLabel: function(context) {
              const project = topProjects[context.dataIndex];
              return [
                `${project.percentage}% of total allocation`,
                `${project.employee_count} team members`
              ];
            }
          }
        }
      }
    }
  };
  
  resourceAllocationChartInstance = new Chart(resourceAllocationChart.value, config);
};

// Helper methods
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

const formatRelativeTime = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffSec = Math.round(diffMs / 1000);
  const diffMin = Math.round(diffSec / 60);
  const diffHour = Math.round(diffMin / 60);
  const diffDay = Math.round(diffHour / 24);
  
  if (diffSec < 60) return 'just now';
  if (diffMin < 60) return `${diffMin} min ago`;
  if (diffHour < 24) return `${diffHour} hr ago`;
  if (diffDay < 7) return `${diffDay} days ago`;
  
  return formatDate(dateString);
};

const getActivityIcon = (type) => {
  switch (type) {
    case 'task': return CheckSquare;
    case 'timesheet': return Clock;
    case 'meeting': return UserCheck;
    case 'message': return MessageSquare;
    default: return FileText;
  }
};

const getActivityIconClass = (type) => {
  switch (type) {
    case 'task': return 'bg-blue-500';
    case 'timesheet': return 'bg-green-500';
    case 'meeting': return 'bg-purple-500';
    case 'message': return 'bg-yellow-500';
    default: return 'bg-gray-500';
  }
};

const getActivityText = (activity) => {
  switch (activity.type) {
    case 'task':
      return ' completed task ';
    case 'timesheet':
      return ' logged time on ';
    case 'meeting':
      return ' scheduled meeting ';
    case 'message':
      return ' posted message in ';
    default:
      return ' updated ';
  }
};

const getScoreColorClass = (score) => {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-blue-600';
  if (score >= 40) return 'text-yellow-600';
  return 'text-red-600';
};

// Watch for changes in filters
watch([selectedDepartment], () => {
  loadDashboardData();
});

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