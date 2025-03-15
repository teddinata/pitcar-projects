<template>
  <div class="bg-white shadow rounded-lg p-4">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-lg font-medium text-gray-900">Team Workload</h2>
      <button
        @click="$emit('refresh')"
        class="inline-flex items-center px-2 py-1 border border-transparent text-sm font-medium rounded text-red-600 hover:bg-red-50"
      >
        <RefreshCw class="h-4 w-4 mr-1" />
        Refresh
      </button>
    </div>
    
    <div v-if="loading" class="flex justify-center py-4">
      <Loader2 class="h-8 w-8 text-red-600 animate-spin" />
    </div>
    
    <div v-else-if="!workloadData || workloadData.length === 0" class="text-center py-6">
      <Users class="mx-auto h-12 w-12 text-gray-300" />
      <h3 class="mt-2 text-sm font-medium text-gray-900">No team data available</h3>
      <p class="mt-1 text-sm text-gray-500">
        No active team members found for the selected criteria.
      </p>
    </div>
    
    <div v-else>
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
            <tr v-for="member in workloadData" :key="member.employee.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <User class="h-6 w-6 text-gray-500" />
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ member.employee.name }}</div>
                    <div class="text-sm text-gray-500">{{ member.projects.length }} projects</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div class="flex items-center">
                  <div class="bg-blue-100 text-blue-800 py-0.5 px-2 rounded-full text-xs font-medium">
                    {{ member.assigned_tasks }} assigned
                  </div>
                  <div v-if="member.high_priority_tasks > 0" class="ml-2 bg-red-100 text-red-800 py-0.5 px-2 rounded-full text-xs font-medium">
                    {{ member.high_priority_tasks }} high priority
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ member.hours_per_day }}</div>
                <div class="text-xs text-gray-500">{{ member.recent_hours }} total</div>
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
                  <span 
                    class="ml-2 text-xs font-medium"
                    :class="{
                      'text-green-600': member.workload_level === 'low',
                      'text-yellow-600': member.workload_level === 'medium',
                      'text-red-600': member.workload_level === 'high'
                    }"
                  >
                    {{ getWorkloadText(member.workload_level) }}
                  </span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div class="mt-4 pt-3 border-t border-gray-200">
        <h3 class="text-sm font-medium text-gray-700 mb-2">Workload Legend</h3>
        <div class="flex space-x-4 text-xs">
          <div class="flex items-center">
            <div class="h-3 w-3 rounded-full bg-green-500 mr-1"></div>
            <span>Low (under 30%)</span>
          </div>
          <div class="flex items-center">
            <div class="h-3 w-3 rounded-full bg-yellow-500 mr-1"></div>
            <span>Medium (30-70%)</span>
          </div>
          <div class="flex items-center">
            <div class="h-3 w-3 rounded-full bg-red-500 mr-1"></div>
            <span>High (over 70%)</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue';
import { 
  RefreshCw, 
  Loader2, 
  User, 
  Users 
} from 'lucide-vue-next';

const props = defineProps({
  workloadData: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['refresh']);

const getWorkloadText = (level) => {
  switch (level) {
    case 'low':
      return 'Low';
    case 'medium':
      return 'Medium';
    case 'high':
      return 'High';
    default:
      return 'Unknown';
  }
};
</script>