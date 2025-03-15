<template>
  <div class="bg-white shadow rounded-lg p-4">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-lg font-medium text-gray-900">Upcoming Deadlines</h2>
      <div class="flex space-x-2">
        <select
          v-model="filterType"
          class="block w-32 pl-3 pr-10 py-1 text-sm border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 rounded-md"
        >
          <option value="all">All Types</option>
          <option value="task_deadline">Tasks</option>
          <option value="project_deadline">Projects</option>
          <option value="meeting">Meetings</option>
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
    
    <div v-else-if="filteredMilestones.length === 0" class="text-center py-6">
      <Calendar class="mx-auto h-12 w-12 text-gray-300" />
      <h3 class="mt-2 text-sm font-medium text-gray-900">No upcoming deadlines</h3>
      <p class="mt-1 text-sm text-gray-500">
        No deadlines found for the selected criteria.
      </p>
    </div>
    
    <div v-else class="space-y-1">
      <div v-for="(milestone, index) in filteredMilestones" :key="index" class="p-3 rounded-lg hover:bg-gray-50" :class="getStatusColorClass(milestone.status)">
        <div class="flex items-start">
          <div class="flex-shrink-0 mt-1">
            <component :is="getMilestoneIcon(milestone.type)" class="h-5 w-5" :class="getStatusIconColorClass(milestone.status)" />
          </div>
          <div class="ml-3 flex-1">
            <div class="flex justify-between">
              <div class="text-sm font-medium text-gray-900">{{ milestone.title }}</div>
              <div class="text-xs font-medium px-2 py-0.5 rounded-full" :class="getStatusBadgeClass(milestone.status)">
                {{ milestone.days_remaining }} days
              </div>
            </div>
            <div class="mt-1 text-xs text-gray-500 flex items-center justify-between">
              <div>
                <span>{{ formatDate(milestone.date) }}</span>
                <span v-if="milestone.time">{{ milestone.time }}</span>
                <span v-if="milestone.project"> in {{ milestone.project.name }}</span>
              </div>
              <div v-if="milestone.progress !== undefined" class="flex items-center">
                <div class="w-16 bg-gray-200 rounded-full h-1.5 mr-1">
                  <div class="bg-blue-600 h-1.5 rounded-full" :style="{width: `${milestone.progress}%`}"></div>
                </div>
                <span>{{ milestone.progress }}%</span>
              </div>
            </div>
            
            <div v-if="milestone.assigned_to && milestone.assigned_to.length > 0" class="mt-1 flex flex-wrap">
              <div 
                v-for="(person, personIndex) in milestone.assigned_to.slice(0, 3)" 
                :key="personIndex" 
                class="flex items-center text-xs text-gray-500 mr-2"
              >
                <span class="inline-block h-4 w-4 rounded-full bg-gray-200 mr-1"></span>
                {{ person.name }}
              </div>
              <div v-if="milestone.assigned_to.length > 3" class="text-xs text-gray-400">
                +{{ milestone.assigned_to.length - 3 }} more
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="mt-4 flex justify-between text-xs text-gray-500 pt-2 border-t border-gray-200">
      <div class="flex items-center">
        <div class="w-2 h-2 rounded-full bg-red-500 mr-1"></div>
        <span class="mr-2">Urgent</span>
        <div class="w-2 h-2 rounded-full bg-yellow-500 mr-1"></div>
        <span class="mr-2">Warning</span>
        <div class="w-2 h-2 rounded-full bg-blue-500 mr-1"></div>
        <span>Upcoming</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref, computed } from 'vue';
import { 
  RefreshCw, 
  Loader2, 
  Calendar,
  Clock,
  FileText,
  Users
} from 'lucide-vue-next';

const props = defineProps({
  milestones: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['refresh']);

const filterType = ref('all');

const filteredMilestones = computed(() => {
  if (filterType.value === 'all') {
    return props.milestones;
  }
  
  return props.milestones.filter(m => m.type === filterType.value);
});

const formatDate = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

const getMilestoneIcon = (type) => {
  switch (type) {
    case 'task_deadline': return FileText;
    case 'project_deadline': return Calendar;
    case 'meeting': return Users;
    default: return Clock;
  }
};

const getStatusColorClass = (status) => {
  switch (status) {
    case 'danger': return 'border-l-4 border-red-500 bg-red-50';
    case 'warning': return 'border-l-4 border-yellow-500 bg-yellow-50';
    default: return 'border-l-4 border-blue-500 bg-blue-50';
  }
};

const getStatusIconColorClass = (status) => {
  switch (status) {
    case 'danger': return 'text-red-600';
    case 'warning': return 'text-yellow-600';
    default: return 'text-blue-600';
  }
};

const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'danger': return 'bg-red-100 text-red-800';
    case 'warning': return 'bg-yellow-100 text-yellow-800';
    default: return 'bg-blue-100 text-blue-800';
  }
};
</script>