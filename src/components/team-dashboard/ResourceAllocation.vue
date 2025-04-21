<template>
  <div class="bg-white shadow rounded-lg p-4">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-lg font-medium text-gray-900">Resource Allocation</h2>
      <div class="flex space-x-2">
        <select
          v-model="viewMode"
          class="block w-36 pl-3 pr-10 py-1 text-sm border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 rounded-md"
        >
          <option value="project">By Project</option>
          <option value="employee">By Employee</option>
        </select>
        <button
          @click="$emit('refresh')"
          class="inline-flex items-center px-2 py-1 border border-transparent text-sm font-medium rounded text-red-600 hover:bg-red-50"
        >
          <RefreshCw class="h-4 w-4 mr-1" />
          Refresh
        </button>
      </div>
    </div>
    
    <div v-if="loading" class="flex justify-center py-4">
      <Loader2 class="h-8 w-8 text-red-600 animate-spin" />
    </div>
    
    <div v-else-if="noDataAvailable" class="text-center py-6">
      <Users class="mx-auto h-12 w-12 text-gray-300" />
      <h3 class="mt-2 text-sm font-medium text-gray-900">No allocation data available</h3>
      <p class="mt-1 text-sm text-gray-500">
        No active resources found for the selected criteria.
      </p>
    </div>
    
    <div v-else>
      <!-- View by Project -->
      <div v-if="viewMode === 'project'">
        <div class="h-64 mb-4">
          <canvas ref="projectChart"></canvas>
        </div>
        
        <div class="mt-4 max-h-64 overflow-y-auto pr-1">
          <div v-for="project in allocationData.allocation_by_project" :key="project.project.id" class="flex items-center py-2 border-b border-gray-200">
            <div class="w-1/3">
              <div class="text-sm font-medium text-gray-900 truncate">{{ project.project.name }}</div>
              <div class="text-xs text-gray-500">{{ project.employee_count }} team members</div>
            </div>
            <div class="w-1/3">
              <div class="text-sm text-gray-900">{{ project.hours }} hours</div>
              <div class="text-xs text-gray-500">{{ project.percentage }}% of total</div>
            </div>
            <div class="w-1/3">
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-blue-600 h-2 rounded-full" :style="{width: `${project.percentage}%`}"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- View by Employee -->
      <div v-else>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hours</th>
                <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Projects</th>
                <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Allocation</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="employee in allocationData.allocation_by_employee" :key="employee.employee.id" class="hover:bg-gray-50">
                <td class="px-4 py-3 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ employee.employee.name }}</div>
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  {{ employee.total_hours }}
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  {{ employee.project_count }}
                </td>
                <td class="px-4 py-3 whitespace-nowrap">
                  <div>
                    <div class="flex items-center space-x-1">
                      <template v-for="(project, index) in employee.project_allocation.slice(0, 3)" :key="index">
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
                    <div class="mt-1 text-xs">
                      <template v-for="(project, index) in employee.project_allocation.slice(0, 2)" :key="index">
                        <span class="inline-flex items-center mr-2">
                          <span 
                            class="w-2 h-2 rounded-full mr-1"
                            :style="{ backgroundColor: getColorForIndex(index) }"
                          ></span>
                          {{ project.project.name.substring(0, 12) }}{{ project.project.name.length > 12 ? '...' : '' }}: {{ project.percentage }}%
                        </span>
                      </template>
                      <span v-if="employee.project_allocation.length > 2" class="text-gray-400">
                        +{{ employee.project_allocation.length - 2 }} more
                      </span>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

       <!-- Tambahkan tombol View Details di bagian bawah -->
       <div class="mt-4 border-t border-gray-100 pt-4 flex justify-end">
        <button 
          @click="openModal('allocation', 'Resource Allocation Detail', allocationData)" 
          class="text-sm font-medium text-red-600 hover:text-red-500 inline-flex items-center"
        >
          <ChartBarIcon class="h-4 w-4 mr-1" />
          View detailed allocation
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
// Tambahkan import ChartBarIcon
import { defineProps, defineEmits, ref, computed, onMounted, watch } from 'vue';
import { RefreshCw, Loader2, Users, BarChart as ChartBarIcon } from 'lucide-vue-next';
import Chart from 'chart.js/auto';

const props = defineProps({
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

// Tambahkan emit untuk openModal
const emit = defineEmits(['refresh', 'openModal']);

const viewMode = ref('project');
const projectChart = ref(null);
let chartInstance = null;

const noDataAvailable = computed(() => {
  if (viewMode.value === 'project') {
    return !props.allocationData.allocation_by_project || props.allocationData.allocation_by_project.length === 0;
  } else {
    return !props.allocationData.allocation_by_employee || props.allocationData.allocation_by_employee.length === 0;
  }
});

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

const renderProjectChart = () => {
  if (!projectChart.value) return;
  
  // Destroy previous chart if it exists
  if (chartInstance) {
    chartInstance.destroy();
  }
  
  // Get project allocation data
  const projects = props.allocationData.allocation_by_project || [];
  
  // Limited to top 6 for readability
  const topProjects = projects.slice(0, 6);
  
  const data = {
    labels: topProjects.map(p => p.project.name),
    datasets: [
      {
        data: topProjects.map(p => p.hours),
        backgroundColor: topProjects.map((_, i) => chartColors[i % chartColors.length]),
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
              const project = topProjects[context.dataIndex];
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
  
  chartInstance = new Chart(projectChart.value, config);
};

// Tambahkan method untuk openModal
const openModal = (modalType, title, data) => {
  emit('openModal', modalType, title, data);
};

// Watch for changes to render charts
watch([() => props.allocationData, viewMode], () => {
  if (viewMode.value === 'project' && !props.loading && props.allocationData.allocation_by_project?.length > 0) {
    setTimeout(() => {
      renderProjectChart();
    }, 50);
  }
}, { immediate: false });

onMounted(() => {
  if (viewMode.value === 'project' && !props.loading && props.allocationData.allocation_by_project?.length > 0) {
    setTimeout(() => {
      renderProjectChart();
    }, 50);
  }
});
</script>