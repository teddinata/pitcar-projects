<!-- ResourceAllocationModal.vue -->
<template>
  <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="$emit('close')"></div>

      <!-- Modal panel -->
      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="w-full">
              <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  Resource Allocation Details
                </h3>
                <button @click="$emit('close')" class="text-gray-400 hover:text-gray-500">
                  <XIcon class="h-5 w-5" />
                </button>
              </div>

              <!-- Tabs for different views -->
              <div class="border-b border-gray-200 mb-4">
                <nav class="-mb-px flex space-x-8" aria-label="Tabs">
                  <button 
                    @click="activeTab = 'byProject'" 
                    class="px-1 py-2 text-sm font-medium"
                    :class="activeTab === 'byProject' ? 'border-red-500 text-red-600 border-b-2' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'">
                    By Project
                  </button>
                  <button 
                    @click="activeTab = 'byEmployee'" 
                    class="px-1 py-2 text-sm font-medium"
                    :class="activeTab === 'byEmployee' ? 'border-red-500 text-red-600 border-b-2' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'">
                    By Employee
                  </button>
                </nav>
              </div>

              <!-- Loading indicator -->
              <div v-if="loading" class="flex justify-center py-6">
                <Loader2 class="h-8 w-8 text-red-600 animate-spin" />
              </div>

              <!-- Content for "By Project" tab -->
              <div v-else-if="activeTab === 'byProject' && allocationData">
                <!-- Chart -->
                <div class="h-64 mb-6">
                  <canvas ref="projectDetailChart"></canvas>
                </div>

                <!-- Projects table -->
                <div class="overflow-x-auto">
                  <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                      <tr>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hours</th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team Members</th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Allocation</th>
                      </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                      <tr v-for="project in allocationData.allocation_by_project" :key="project.project.id" class="hover:bg-gray-50">
                        <td class="px-6 py-4 whitespace-nowrap">
                          <div class="text-sm font-medium text-gray-900">{{ project.project.name }}</div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <div class="text-sm text-gray-900">{{ project.hours }} hours</div>
                          <div class="text-xs text-gray-500">{{ project.percentage }}% of total</div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <div class="text-sm text-gray-900">{{ project.employee_count }}</div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <div class="w-full bg-gray-200 rounded-full h-2.5">
                            <div class="bg-blue-600 h-2.5 rounded-full" :style="{ width: `${project.percentage}%` }"></div>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- Content for "By Employee" tab -->
              <div v-else-if="activeTab === 'byEmployee' && allocationData">
                <div class="overflow-x-auto">
                  <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                      <tr>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hours</th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Projects</th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project Allocation</th>
                      </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                      <tr v-for="employee in allocationData.allocation_by_employee" :key="employee.employee.id" class="hover:bg-gray-50">
                        <td class="px-6 py-4 whitespace-nowrap">
                          <div class="text-sm font-medium text-gray-900">{{ employee.employee.name }}</div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <div class="text-sm text-gray-900">{{ employee.total_hours }} hours</div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <div class="text-sm text-gray-900">{{ employee.project_count }}</div>
                        </td>
                        <td class="px-6 py-4">
                          <div>
                            <div class="flex items-center space-x-1 w-full max-w-xs">
                              <template v-for="(project, index) in employee.project_allocation" :key="index">
                                <div 
                                  class="h-3 rounded-full" 
                                  :style="{
                                    width: `${project.percentage}%`,
                                    backgroundColor: getColorForIndex(index)
                                  }"
                                  :title="`${project.project.name}: ${project.hours} hours (${project.percentage}%)`"
                                ></div>
                              </template>
                            </div>
                            <div class="mt-2 text-xs space-y-1">
                              <div v-for="(project, index) in employee.project_allocation" :key="index" class="flex items-center">
                                <span 
                                  class="w-2 h-2 rounded-full mr-1 inline-block"
                                  :style="{ backgroundColor: getColorForIndex(index) }"
                                ></span>
                                <span class="mr-1">{{ project.project.name }}:</span>
                                <span class="font-medium">{{ project.percentage }}%</span>
                                <span class="text-gray-500 ml-1">({{ project.hours }} hrs)</span>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- No data message -->
              <div v-else-if="!loading" class="text-center py-6">
                <Users class="mx-auto h-12 w-12 text-gray-300" />
                <h3 class="mt-2 text-sm font-medium text-gray-900">No allocation data available</h3>
                <p class="mt-1 text-sm text-gray-500">
                  No resource allocation data found for the selected criteria.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button 
            type="button" 
            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            @click="$emit('close')">
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, defineProps, defineEmits } from 'vue';
import { XIcon, Users, Loader2 } from 'lucide-vue-next';
import Chart from 'chart.js/auto';

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  allocationData: {
    type: Object,
    default: () => ({
      allocation_by_project: [],
      allocation_by_employee: [],
      project_resources: []
    })
  },
  loading: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close']);

const activeTab = ref('byProject');
const projectDetailChart = ref(null);
let chartInstance = null;

const chartColors = [
  'rgba(54, 162, 235, 0.8)',
  'rgba(75, 192, 192, 0.8)',
  'rgba(255, 159, 64, 0.8)',
  'rgba(153, 102, 255, 0.8)',
  'rgba(255, 205, 86, 0.8)',
  'rgba(201, 203, 207, 0.8)',
  'rgba(255, 99, 132, 0.8)',
  'rgba(255, 205, 86, 0.8)',
  'rgba(75, 192, 192, 0.8)'
];

const getColorForIndex = (index) => {
  return chartColors[index % chartColors.length];
};

const renderProjectDetailChart = () => {
  if (!projectDetailChart.value) return;
  
  // Destroy previous chart if it exists
  if (chartInstance) {
    chartInstance.destroy();
  }
  
  // Get project allocation data
  const projects = props.allocationData.allocation_by_project || [];
  
  // Use all projects, but limit labels for readability if too many
  const projectData = projects.slice(0, 12); // Limit to top 12 for chart readability
  
  const data = {
    labels: projectData.map(p => p.project.name),
    datasets: [
      {
        data: projectData.map(p => p.hours),
        backgroundColor: projectData.map((_, i) => chartColors[i % chartColors.length]),
        borderWidth: 1
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
              size: 11
            }
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const project = projectData[context.dataIndex];
              return [
                `${project.hours} hours (${project.percentage}%)`,
                `${project.employee_count} team members`
              ];
            }
          }
        }
      }
    }
  };
  
  chartInstance = new Chart(projectDetailChart.value, config);
};

// Watch for changes to render charts
watch([() => props.allocationData, activeTab, () => props.show], () => {
  if (props.show && activeTab.value === 'byProject' && !props.loading && props.allocationData?.allocation_by_project?.length > 0) {
    setTimeout(() => {
      renderProjectDetailChart();
    }, 100);
  }
}, { immediate: false });

// Also re-render when tab changes
watch(activeTab, () => {
  if (props.show && activeTab.value === 'byProject' && !props.loading && props.allocationData?.allocation_by_project?.length > 0) {
    setTimeout(() => {
      renderProjectDetailChart();
    }, 100);
  }
});

// Re-render when modal becomes visible
watch(() => props.show, (newVal) => {
  if (newVal && activeTab.value === 'byProject' && !props.loading && props.allocationData?.allocation_by_project?.length > 0) {
    setTimeout(() => {
      renderProjectDetailChart();
    }, 100);
  }
});
</script>