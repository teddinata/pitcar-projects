<!-- components/team-dashboard/DashboardModal.vue -->
<template>
  <div v-if="show" class="fixed inset-0 z-10 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 transition-opacity" aria-hidden="true">
        <div class="absolute inset-0 bg-gray-500 opacity-75" @click="$emit('close')"></div>
      </div>

      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

      <!-- Untuk ResourceAllocation Modal, langsung tampilkan ResourceAllocationModal -->
      <ResourceAllocationModal 
        v-if="modalType === 'allocation'"
        :show="show"
        :allocationData="allocationData"
        :loading="false"
        @close="$emit('close')"
      />

      <div 
        
        class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-5xl sm:w-full"
      >
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="flex justify-between items-center mb-4 border-b border-gray-200 pb-3">
            <h3 class="text-xl font-semibold text-gray-900 flex items-center">
              <component :is="getModalIcon()" class="h-6 w-6 mr-2" />
              {{ title }}
            </h3>
            <button @click="$emit('close')" class="text-gray-400 hover:text-gray-500">
              <XIcon class="h-6 w-6" />
            </button>
          </div>
          
          <!-- Dynamic Content based on modalType -->
          <div class="mt-4 max-h-[70vh] overflow-y-auto pr-2">
            <!-- Projects Detail -->
            <div v-if="modalType === 'projects'" class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div class="bg-gray-50 p-4 rounded-lg">
                  <h4 class="text-sm font-medium text-gray-500 mb-1">Total Projects</h4>
                  <p class="text-2xl font-semibold text-gray-900">{{ data.total_projects }}</p>
                </div>
                <div class="bg-gray-50 p-4 rounded-lg">
                  <h4 class="text-sm font-medium text-gray-500 mb-1">Active Projects</h4>
                  <p class="text-2xl font-semibold text-gray-900">{{ data.active_projects }}</p>
                </div>
                <div class="bg-gray-50 p-4 rounded-lg">
                  <h4 class="text-sm font-medium text-gray-500 mb-1">Completed Projects</h4>
                  <p class="text-2xl font-semibold text-gray-900">{{ data.completed_projects }}</p>
                </div>
                <div class="bg-gray-50 p-4 rounded-lg">
                  <h4 class="text-sm font-medium text-gray-500 mb-1">On-Time Completion</h4>
                  <p class="text-2xl font-semibold text-gray-900">{{ data.on_time_completion_rate || '0' }}%</p>
                </div>
              </div>
              
              <!-- Project Status Chart -->
              <div class="bg-white p-5 rounded-lg border border-gray-200">
                <h4 class="text-base font-medium text-gray-700 mb-3">Project Progress</h4>
                <div class="h-64">
                  <canvas ref="projectStatusChart"></canvas>
                </div>
              </div>
              
              <!-- Project Progress Table -->
              <div class="bg-white p-5 rounded-lg border border-gray-200 overflow-hidden">
                <h4 class="text-base font-medium text-gray-700 mb-3">Project Details</h4>
                <div class="overflow-x-auto">
                  <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                      <tr>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project Name</th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tasks</th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timeline</th>
                      </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                      <tr v-for="project in data.project_progress" :key="project.id" class="hover:bg-gray-50">
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {{ project.name }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <span :class="getProjectStatusClass(project.state)" class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full">
                            {{ getProjectStatusLabel(project.state) }}
                          </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <div class="flex items-center">
                            <div class="w-full bg-gray-200 rounded-full h-2.5 mr-2 max-w-xs">
                              <div :class="getProgressColorClass(project.progress)" class="h-2.5 rounded-full" :style="{ width: `${project.progress}%` }"></div>
                            </div>
                            <span class="text-sm text-gray-500">{{ project.progress }}%</span>
                          </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {{ project.tasks_completed }}/{{ project.tasks_count }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {{ formatDate(project.actual_end_date) || 'In Progress' }}
                        </td>
                      </tr>
                      <tr v-if="!data.project_progress || data.project_progress.length === 0" class="hover:bg-gray-50">
                        <td colspan="5" class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                          No project data available
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              
              <!-- Delayed Projects -->
              <div v-if="data.delayed_projects && data.delayed_projects.length > 0" class="bg-white p-5 rounded-lg border border-gray-200 overflow-hidden">
                <h4 class="text-base font-medium text-gray-700 mb-3">Delayed Projects</h4>
                <div class="overflow-x-auto">
                  <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                      <tr>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project Name</th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Planned End Date</th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actual End Date</th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days Delayed</th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                      </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                      <tr v-for="project in data.delayed_projects" :key="project.id" class="hover:bg-gray-50">
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {{ project.name }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {{ formatDate(project.planned_end_date) }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {{ formatDate(project.actual_end_date) }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">
                          {{ project.days_delayed }} days
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <div class="flex items-center">
                            <div class="w-full bg-gray-200 rounded-full h-2.5 mr-2 max-w-xs">
                              <div class="bg-red-500 h-2.5 rounded-full" :style="{ width: `${project.progress}%` }"></div>
                            </div>
                            <span class="text-sm text-gray-500">{{ project.progress }}%</span>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            
            <!-- Tasks Detail -->
            <div v-else-if="modalType === 'tasks'" class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div class="bg-gray-50 p-4 rounded-lg">
                  <h4 class="text-sm font-medium text-gray-500 mb-1">Total Tasks</h4>
                  <p class="text-2xl font-semibold text-gray-900">{{ data.total_tasks }}</p>
                </div>
                <div class="bg-gray-50 p-4 rounded-lg">
                  <h4 class="text-sm font-medium text-gray-500 mb-1">Completed Tasks</h4>
                  <p class="text-2xl font-semibold text-gray-900">{{ data.completed_tasks }}</p>
                </div>
                <div class="bg-gray-50 p-4 rounded-lg">
                  <h4 class="text-sm font-medium text-gray-500 mb-1">Completion Rate</h4>
                  <p class="text-2xl font-semibold text-gray-900">{{ data.task_completion_rate }}%</p>
                </div>
                <div class="bg-gray-50 p-4 rounded-lg">
                  <h4 class="text-sm font-medium text-gray-500 mb-1">In Progress</h4>
                  <p class="text-2xl font-semibold text-gray-900">{{ data.total_tasks - data.completed_tasks }}</p>
                </div>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Task Status Distribution -->
                <div class="bg-white p-5 rounded-lg border border-gray-200">
                  <h4 class="text-base font-medium text-gray-700 mb-3">Tasks by Status</h4>
                  <div class="h-64">
                    <canvas ref="taskStatusChart"></canvas>
                  </div>
                </div>
                
                <!-- Tasks by Project -->
                <div class="bg-white p-5 rounded-lg border border-gray-200">
                  <h4 class="text-base font-medium text-gray-700 mb-3">Tasks by Project</h4>
                  <div class="h-64">
                    <canvas ref="taskByProjectChart"></canvas>
                  </div>
                </div>
              </div>
              
              <!-- Upcoming Tasks Table -->
              <div class="bg-white p-5 rounded-lg border border-gray-200 overflow-hidden">
                <h4 class="text-base font-medium text-gray-700 mb-3">Upcoming Tasks</h4>
                <div class="overflow-x-auto">
                  <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                      <tr>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task Name</th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                      </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                      <tr v-for="task in data.upcoming_tasks" :key="task.id" class="hover:bg-gray-50">
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {{ task.name }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {{ task.project.name }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {{ formatDate(task.dates.planned_end) }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {{ getAssignedNames(task) }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <div class="flex items-center">
                            <div class="w-full bg-gray-200 rounded-full h-2.5 mr-2 max-w-xs">
                              <div :class="getProgressColorClass(task.progress)" class="h-2.5 rounded-full" :style="{ width: `${task.progress}%` }"></div>
                            </div>
                            <span class="text-sm text-gray-500">{{ task.progress }}%</span>
                          </div>
                        </td>
                      </tr>
                      <tr v-if="!data.upcoming_tasks || data.upcoming_tasks.length === 0" class="hover:bg-gray-50">
                        <td colspan="5" class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                          No upcoming tasks available
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <!-- Hours Detail -->
            <div v-else-if="modalType === 'hours'" class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div class="bg-gray-50 p-4 rounded-lg">
                  <h4 class="text-sm font-medium text-gray-500 mb-1">Planned Hours</h4>
                  <p class="text-2xl font-semibold text-gray-900">{{ data.total_planned_hours }}</p>
                </div>
                <div class="bg-gray-50 p-4 rounded-lg">
                  <h4 class="text-sm font-medium text-gray-500 mb-1">Actual Hours</h4>
                  <p class="text-2xl font-semibold text-gray-900">{{ data.total_actual_hours }}</p>
                </div>
                <div class="bg-gray-50 p-4 rounded-lg">
                  <h4 class="text-sm font-medium text-gray-500 mb-1">Efficiency</h4>
                  <p class="text-2xl font-semibold text-gray-900">{{ data.hours_efficiency }}%</p>
                </div>
                <div class="bg-gray-50 p-4 rounded-lg">
                  <h4 class="text-sm font-medium text-gray-500 mb-1">Avg Hours per Task</h4>
                  <p class="text-2xl font-semibold text-gray-900">{{ calculateAvgHoursPerTask(data) }}</p>
                </div>
              </div>
              
              <!-- Hours by Project Chart -->
              <div class="bg-white p-5 rounded-lg border border-gray-200">
                <h4 class="text-base font-medium text-gray-700 mb-3">Planned vs Actual Hours by Project</h4>
                <div class="h-64">
                  <canvas ref="hoursChart"></canvas>
                </div>
              </div>
              
              <!-- Hours by Team Member -->
              <div v-if="allocationData && allocationData.allocation_by_employee" class="bg-white p-5 rounded-lg border border-gray-200 overflow-hidden">
                <h4 class="text-base font-medium text-gray-700 mb-3">Hours by Team Member</h4>
                <div class="overflow-x-auto">
                  <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                      <tr>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team Member</th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Hours</th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Projects</th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Allocation</th>
                      </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                      <tr v-for="employee in allocationData.allocation_by_employee" :key="employee.employee.id" class="hover:bg-gray-50">
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {{ employee.employee.name }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {{ employee.total_hours }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {{ employee.project_count }}
                        </td>
                        <td class="px-6 py-4">
                          <div class="flex flex-col space-y-1">
                            <div v-for="(project, idx) in employee.project_allocation.slice(0, 2)" :key="idx" class="flex items-center">
                              <div class="w-24 text-xs text-gray-500 truncate mr-2">{{ project.project.name }}</div>
                              <div class="w-full bg-gray-200 rounded-full h-1.5 mr-2">
                                <div class="bg-blue-600 h-1.5 rounded-full" :style="{ width: `${project.percentage}%` }"></div>
                              </div>
                              <div class="text-xs text-gray-500 w-8 text-right">{{ Math.round(project.percentage) }}%</div>
                            </div>
                            <div v-if="employee.project_allocation.length > 2" class="text-xs text-gray-500">
                              + {{ employee.project_allocation.length - 2 }} more projects
                            </div>
                          </div>
                        </td>
                      </tr>
                      <tr v-if="!allocationData.allocation_by_employee || allocationData.allocation_by_employee.length === 0" class="hover:bg-gray-50">
                        <td colspan="4" class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                          No employee allocation data available
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <!-- Completion Rate Detail -->
            <div v-else-if="modalType === 'completion'" class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div class="bg-gray-50 p-4 rounded-lg">
                  <h4 class="text-sm font-medium text-gray-500 mb-1">Task Completion</h4>
                  <p class="text-2xl font-semibold text-gray-900">{{ data.task_completion_rate }}%</p>
                </div>
                <div class="bg-gray-50 p-4 rounded-lg">
                  <h4 class="text-sm font-medium text-gray-500 mb-1">Hours Efficiency</h4>
                  <p class="text-2xl font-semibold text-gray-900">{{ data.hours_efficiency }}%</p>
                </div>
                <div class="bg-gray-50 p-4 rounded-lg">
                  <h4 class="text-sm font-medium text-gray-500 mb-1">On-Time Completion</h4>
                  <p class="text-2xl font-semibold text-gray-900">{{ data.on_time_completion_rate || '0' }}%</p>
                </div>
                <div class="bg-gray-50 p-4 rounded-lg">
                  <h4 class="text-sm font-medium text-gray-500 mb-1">Overall Performance</h4>
                  <p class="text-2xl font-semibold text-gray-900">
                    {{ calculateOverallPerformance(data) }}%
                  </p>
                </div>
              </div>
              
              <!-- Completion Rate Chart -->
              <div class="bg-white p-5 rounded-lg border border-gray-200">
                <h4 class="text-base font-medium text-gray-700 mb-3">Performance Metrics</h4>
                <div class="h-64">
                  <canvas ref="completionRateChart"></canvas>
                </div>
              </div>

              
              
              <!-- Projects by Completion Rate -->
              <div v-if="performanceData && performanceData.project_scores" class="bg-white p-5 rounded-lg border border-gray-200 overflow-hidden">
                <h4 class="text-base font-medium text-gray-700 mb-3">Project Performance</h4>
                <div class="overflow-x-auto">
                  <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                      <tr>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task Completion</th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time Management</th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Overall</th>
                      </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                      <tr v-for="project in performanceData.project_scores" :key="project.project.id" class="hover:bg-gray-50">
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {{ project.project.name }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <div class="flex items-center">
                            <div class="w-full bg-gray-200 rounded-full h-2 mr-2 max-w-xs">
                              <div class="bg-blue-500 h-2 rounded-full" :style="{ width: `${project.progress}%` }"></div>
                            </div>
                            <span class="text-sm text-gray-500">{{ project.progress }}%</span>
                          </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <div class="flex items-center">
                            <div class="w-full bg-gray-200 rounded-full h-2 mr-2 max-w-xs">
                              <div class="bg-green-500 h-2 rounded-full" :style="{ width: `${project.task_completion}%` }"></div>
                            </div>
                            <span class="text-sm text-gray-500">{{ project.task_completion }}%</span>
                          </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <div class="flex items-center">
                            <div class="w-full bg-gray-200 rounded-full h-2 mr-2 max-w-xs">
                              <div class="bg-purple-500 h-2 rounded-full" :style="{ width: `${project.time_management}%` }"></div>
                            </div>
                            <span class="text-sm text-gray-500">{{ project.time_management }}%</span>
                          </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <span :class="getPerformanceScoreClass(project.performance_score)" class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full">
                            {{ project.performance_score }}%
                          </span>
                        </td>
                      </tr>
                      <tr v-if="!performanceData.project_scores || performanceData.project_scores.length === 0" class="hover:bg-gray-50">
                        <td colspan="5" class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                          No project performance data available
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            
            <!-- Default placeholder for other modal types -->
            <div v-else class="p-4 bg-gray-50 rounded-lg text-center">
              <p class="text-gray-500">Detailed view will be displayed here</p>
            </div>
          </div>
        </div>
        
        <div class="bg-gray-50 px-6 py-4 flex justify-end">
          <button 
            type="button" 
            class="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm"
            @click="$emit('close')"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, onMounted, watch, nextTick } from 'vue';
import Chart from 'chart.js/auto';
import { 
  BarChart, ClipboardCheck, CheckSquare, Clock, XIcon, 
  PieChart, Users, Activity, Calendar 
} from 'lucide-vue-next';
import ResourceAllocationModal from './ResourceAllocationModal.vue';

const props = defineProps({
  show: Boolean,
  title: String,
  modalType: String,
  data: Object,
  allocationData: Object,
  performanceData: Object
});

defineEmits(['close']);

// Chart references
const projectStatusChart = ref(null);
const taskStatusChart = ref(null);
const taskByProjectChart = ref(null);
const hoursChart = ref(null);
const completionRateChart = ref(null);

// Chart instances
let projectStatusChartInstance = null;
let taskStatusChartInstance = null;
let taskByProjectChartInstance = null;
let hoursChartInstance = null;
let completionRateChartInstance = null;

// Helper methods
const calculateOverallPerformance = (data) => {
  const taskCompletion = data.task_completion_rate || 0;
  const hoursEfficiency = data.hours_efficiency || 0;
  const onTimeRate = data.on_time_completion_rate || 0;
  
  return Math.round((taskCompletion + hoursEfficiency + (onTimeRate * 2)) / 4);
};

const calculateAvgHoursPerTask = (data) => {
  if (!data.total_actual_hours || !data.completed_tasks) return '0';
  return (data.total_actual_hours / data.completed_tasks).toFixed(1);
};

const getModalIcon = () => {
  switch (props.modalType) {
    case 'projects': return ClipboardCheck;
    case 'tasks': return CheckSquare;
    case 'hours': return Clock;
    case 'completion': return BarChart;
    case 'allocation': return Users; 
    case 'workload': return Users;
    case 'activity': return Activity;
    default: return PieChart;
  }
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

const getAssignedNames = (task) => {
  if (!task.assigned_to || task.assigned_to.length === 0) return 'Unassigned';
  return task.assigned_to.map(user => user.name).join(', ');
};

const getProjectStatusClass = (status) => {
  const classes = {
    'draft': 'bg-gray-100 text-gray-800',
    'planning': 'bg-blue-100 text-blue-800',
    'in_progress': 'bg-green-100 text-green-800',
    'on_hold': 'bg-yellow-100 text-yellow-800',
    'completed': 'bg-purple-100 text-purple-800',
    'cancelled': 'bg-red-100 text-red-800'
  };
  return classes[status] || 'bg-gray-100 text-gray-800';
};

const getProjectStatusLabel = (status) => {
  const labels = {
    'draft': 'Draft',
    'planning': 'Planning',
    'in_progress': 'In Progress',
    'on_hold': 'On Hold',
    'completed': 'Completed',
    'cancelled': 'Cancelled'
  };
  return labels[status] || status;
};

const getProgressColorClass = (progress) => {
  if (progress >= 80) return 'bg-green-500';
  if (progress >= 50) return 'bg-blue-500';
  if (progress >= 30) return 'bg-yellow-500';
  return 'bg-red-500';
};

const getPerformanceScoreClass = (score) => {
  if (score >= 80) return 'bg-green-100 text-green-800';
  if (score >= 60) return 'bg-blue-100 text-blue-800';
  if (score >= 40) return 'bg-yellow-100 text-yellow-800';
  return 'bg-red-100 text-red-800';
};

// Chart rendering functions
const renderProjectStatusChart = () => {
  if (!projectStatusChart.value || !props.data.project_progress) return;
  
  if (projectStatusChartInstance) {
    projectStatusChartInstance.destroy();
  }
  
  const projects = props.data.project_progress || [];
  
  // Sort by progress
  projects.sort((a, b) => b.progress - a.progress);
  
  // Prepare chart data
  const data = {
    labels: projects.slice(0, 10).map(p => p.name),
    datasets: [{
      label: 'Progress (%)',
      data: projects.slice(0, 10).map(p => p.progress),
      backgroundColor: projects.slice(0, 10).map(p => {
        if (p.state === 'completed') return 'rgba(54, 162, 235, 0.6)';
        if (p.state === 'in_progress') return 'rgba(75, 192, 192, 0.6)';
        if (p.state === 'on_hold') return 'rgba(255, 159, 64, 0.6)';
        return 'rgba(201, 203, 207, 0.6)';
      }),
      borderWidth: 1
    }]
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
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          max: 100,
          title: {
            display: true,
            text: 'Progress (%)'
          }
        }
      }
    }
  };
  
  projectStatusChartInstance = new Chart(projectStatusChart.value, config);
};

const renderTaskStatusChart = () => {
  if (!taskStatusChart.value) return;
  
  if (taskStatusChartInstance) {
    taskStatusChartInstance.destroy();
  }
  
  // Prepare sample data if task distribution not available
  const taskStates = [
    { label: 'Planned', value: 30, color: 'rgba(54, 162, 235, 0.6)' },
    { label: 'In Progress', value: 40, color: 'rgba(75, 192, 192, 0.6)' },
    { label: 'In Review', value: 15, color: 'rgba(153, 102, 255, 0.6)' },
    { label: 'Done', value: props.data.completed_tasks, color: 'rgba(255, 99, 132, 0.6)' }
  ];
  
  const config = {
    type: 'doughnut',
    data: {
      labels: taskStates.map(s => s.label),
      datasets: [{
        data: taskStates.map(s => s.value),
        backgroundColor: taskStates.map(s => s.color),
        hoverOffset: 4
      }]
    },
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
  
  taskStatusChartInstance = new Chart(taskStatusChart.value, config);
};

const renderTaskByProjectChart = () => {
  if (!taskByProjectChart.value || !props.data.project_progress) return;
  
  if (taskByProjectChartInstance) {
    taskByProjectChartInstance.destroy();
  }
  
  const projects = props.data.project_progress || [];
  
  // Get top 5 projects by task count
  const topProjects = projects
    .filter(p => p.tasks_count > 0)
    .sort((a, b) => b.tasks_count - a.tasks_count)
    .slice(0, 5);
  
  const config = {
    type: 'pie',
    data: {
      labels: topProjects.map(p => p.name),
      datasets: [{
        data: topProjects.map(p => p.tasks_count),
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 159, 64, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 99, 132, 0.6)'
        ],
        hoverOffset: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  };
  
  taskByProjectChartInstance = new Chart(taskByProjectChart.value, config);
};

const renderHoursChart = () => {
  if (!hoursChart.value || !props.allocationData) return;
  
  if (hoursChartInstance) {
    hoursChartInstance.destroy();
  }
  
  const projectAllocation = props.allocationData.allocation_by_project || [];
  
  // Get top 5 projects by hours
  const topProjects = projectAllocation
    .sort((a, b) => b.hours - a.hours)
    .slice(0, 5);
  
  const config = {
    type: 'bar',
    data: {
      labels: topProjects.map(p => p.project.name),
      datasets: [{
        label: 'Hours',
        data: topProjects.map(p => p.hours),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Hours'
          }
        }
      }
    }
  };
  
  hoursChartInstance = new Chart(hoursChart.value, config);
};

const renderCompletionRateChart = () => {
  if (!completionRateChart.value) return;
  
  if (completionRateChartInstance) {
    completionRateChartInstance.destroy();
  }
  
  // Prepare data for completion rate chart
  const metrics = [
    { label: 'Task Completion', value: props.data.task_completion_rate || 0, color: 'rgba(54, 162, 235, 0.6)' },
    { label: 'Hours Efficiency', value: props.data.hours_efficiency || 0, color: 'rgba(75, 192, 192, 0.6)' },
    { label: 'On-Time Delivery', value: props.data.on_time_completion_rate || 0, color: 'rgba(255, 159, 64, 0.6)' },
    { label: 'Overall Performance', value: calculateOverallPerformance(props.data), color: 'rgba(153, 102, 255, 0.6)' }
  ];
  
  const config = {
    type: 'radar',
    data: {
      labels: metrics.map(m => m.label),
      datasets: [{
        label: 'Performance Metrics',
        data: metrics.map(m => m.value),
        fill: true,
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgb(54, 162, 235)',
        pointBackgroundColor: 'rgb(54, 162, 235)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(54, 162, 235)'
      }]
    },
    options: {
      elements: {
        line: {
          borderWidth: 3
        }
      },
      scales: {
        r: {
          angleLines: {
            display: true
          },
          suggestedMin: 0,
          suggestedMax: 100
        }
      }
    }
  };
  
  completionRateChartInstance = new Chart(completionRateChart.value, config);
};

// Watchers to render charts when modal is shown
watch(() => props.show, (newValue) => {
  if (newValue) {
    nextTick(() => {
      switch (props.modalType) {
        case 'projects':
          renderProjectStatusChart();
          break;
        case 'tasks':
          renderTaskStatusChart();
          renderTaskByProjectChart();
          break;
        case 'hours':
          renderHoursChart();
          break;
        case 'completion':
          renderCompletionRateChart();
          break;
      }
    });
  }
});

// Clean up charts when unmounted
onMounted(() => {
  if (props.show) {
    nextTick(() => {
      switch (props.modalType) {
        case 'projects':
          renderProjectStatusChart();
          break;
        case 'tasks':
          renderTaskStatusChart();
          renderTaskByProjectChart();
          break;
        case 'hours':
          renderHoursChart();
          break;
        case 'completion':
          renderCompletionRateChart();
          break;
      }
    });
  }
});
</script>;