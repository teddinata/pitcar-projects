<template>
  <div class="bg-white shadow rounded-lg p-4">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-lg font-medium text-gray-900">Project Performance</h2>
      <div class="flex space-x-2">
        <select
          v-model="sortBy"
          class="block w-40 pl-3 pr-10 py-1 text-sm border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 rounded-md"
        >
          <option value="performance">Sort by Performance</option>
          <option value="progress">Sort by Progress</option>
          <option value="name">Sort by Name</option>
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
    
    <div v-else-if="!performanceData.project_scores || performanceData.project_scores.length === 0" class="text-center py-6">
      <FileText class="mx-auto h-12 w-12 text-gray-300" />
      <h3 class="mt-2 text-sm font-medium text-gray-900">No project data available</h3>
      <p class="mt-1 text-sm text-gray-500">
        No active projects found for the selected criteria.
      </p>
    </div>
    
    <div v-else>
      <!-- Summary Stats -->
      <div class="grid grid-cols-4 gap-4 mb-6">
        <div class="bg-gray-50 rounded-lg p-3">
          <div class="text-xs text-gray-500 mb-1">Efficiency</div>
          <div class="text-lg font-bold" :class="getScoreColorClass(performanceData.efficiency)">
            {{ performanceData.efficiency }}%
          </div>
        </div>
        
        <div class="bg-gray-50 rounded-lg p-3">
          <div class="text-xs text-gray-500 mb-1">On-time Completion</div>
          <div class="text-lg font-bold" :class="getScoreColorClass(performanceData.on_time_completion)">
            {{ performanceData.on_time_completion }}%
          </div>
        </div>
        
        <div class="bg-gray-50 rounded-lg p-3">
          <div class="text-xs text-gray-500 mb-1">Budget Utilization</div>
          <div class="text-lg font-bold" :class="getScoreColorClass(performanceData.budget_utilization)">
            {{ performanceData.budget_utilization }}%
          </div>
        </div>
        
        <div class="bg-gray-50 rounded-lg p-3">
          <div class="text-xs text-gray-500 mb-1">Team Allocation</div>
          <div class="text-lg font-bold" :class="getScoreColorClass(performanceData.team_allocation)">
            {{ performanceData.team_allocation }}%
          </div>
        </div>
      </div>
      
      <!-- Project Performance Table -->
      <div class="space-y-4 max-h-80 overflow-y-auto pr-1">
        <div v-for="project in sortedProjects" :key="project.project.id" class="border border-gray-200 rounded-lg hover:bg-gray-50 p-3">
          <div class="flex justify-between items-start mb-2">
            <div>
              <h3 class="text-sm font-medium text-gray-900">{{ project.project.name }}</h3>
              <div class="text-xs text-gray-500 mt-0.5">
                Progress: {{ project.progress }}% | Task Completion: {{ project.task_completion }}%
              </div>
            </div>
            <div class="text-sm font-bold py-1 px-2 rounded-full" :class="getPerformanceBadgeClass(project.performance_score)">
              {{ project.performance_score }}%
            </div>
          </div>
          
          <div class="grid grid-cols-2 gap-4 mt-3">
            <div>
              <div class="flex justify-between text-xs text-gray-500 mb-1">
                <span>Time Management</span>
                <span>{{ project.time_management }}%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-1.5">
                <div class="bg-blue-600 h-1.5 rounded-full" :style="{width: `${project.time_management}%`}"></div>
              </div>
            </div>
            
            <div>
              <div class="flex justify-between text-xs text-gray-500 mb-1">
                <span>On-time Delivery</span>
                <span>{{ project.on_time_delivery }}%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-1.5">
                <div class="bg-green-600 h-1.5 rounded-full" :style="{width: `${project.on_time_delivery}%`}"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Timeline Progress Comparison -->
      <div v-if="performanceData.timeline && performanceData.timeline.length > 0" class="mt-6 pt-4 border-t border-gray-200">
        <h3 class="text-sm font-medium text-gray-700 mb-3">Timeline Progress Comparison</h3>
        
        <div class="space-y-3">
          <div v-for="(item, index) in performanceData.timeline" :key="index" class="flex items-center">
            <div class="w-1/4 truncate pr-2">
              <span class="text-xs text-gray-700">{{ item.project.name }}</span>
            </div>
            <div class="w-3/4 flex items-center">
              <div class="flex-grow h-4 bg-gray-200 rounded-full relative">
                <!-- Time progress -->
                <div class="absolute top-0 left-0 h-4 bg-blue-200 rounded-full" :style="{width: `${item.time_progress}%`}"></div>
                <!-- Actual progress -->
                <div class="absolute top-0 left-0 h-4 bg-blue-600 rounded-full" :style="{width: `${item.actual_progress}%`}"></div>
                <!-- Marker for time progress -->
                <div class="absolute top-0 h-4 border-l-2 border-gray-500" :style="{left: `${item.time_progress}%`}"></div>
              </div>
              <div class="ml-2 flex-shrink-0">
                <span 
                  class="text-xs font-medium px-1.5 py-0.5 rounded"
                  :class="item.on_track ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                >
                  {{ item.variance > 0 ? '+' : '' }}{{ item.variance }}%
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="mt-2 text-xs text-gray-500 flex items-center">
          <div class="w-3 h-3 bg-blue-200 rounded-sm mr-1"></div>
          <span class="mr-3">Expected Progress</span>
          <div class="w-3 h-3 bg-blue-600 rounded-sm mr-1"></div>
          <span>Actual Progress</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref, computed } from 'vue';
import { 
  RefreshCw, 
  Loader2, 
  FileText
} from 'lucide-vue-next';

const props = defineProps({
  performanceData: {
    type: Object,
    default: () => ({
      efficiency: 0,
      on_time_completion: 0,
      budget_utilization: 0,
      team_allocation: 0,
      timeline: [],
      project_scores: []
    })
  },
  loading: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['refresh']);

const sortBy = ref('performance');

const sortedProjects = computed(() => {
  if (!props.performanceData.project_scores) return [];
  
  const projects = [...props.performanceData.project_scores];
  
  switch (sortBy.value) {
    case 'performance':
      return projects.sort((a, b) => b.performance_score - a.performance_score);
    case 'progress':
      return projects.sort((a, b) => b.progress - a.progress);
    case 'name':
      return projects.sort((a, b) => a.project.name.localeCompare(b.project.name));
    default:
      return projects;
  }
});

const getScoreColorClass = (score) => {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-blue-600';
  if (score >= 40) return 'text-yellow-600';
  return 'text-red-600';
};

const getPerformanceBadgeClass = (score) => {
  if (score >= 80) return 'bg-green-100 text-green-800';
  if (score >= 60) return 'bg-blue-100 text-blue-800';
  if (score >= 40) return 'bg-yellow-100 text-yellow-800';
  return 'bg-red-100 text-red-800';
};
</script>