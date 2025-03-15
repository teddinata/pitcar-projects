<template>
  <div class="bg-white shadow rounded-lg p-4">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-lg font-medium text-gray-900">Recent Activity</h2>
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
    
    <div v-else-if="!activityData || activityData.length === 0" class="text-center py-6">
      <Activity class="mx-auto h-12 w-12 text-gray-300" />
      <h3 class="mt-2 text-sm font-medium text-gray-900">No recent activity</h3>
      <p class="mt-1 text-sm text-gray-500">
        No activities found for the selected criteria.
      </p>
    </div>
    
    <div v-else class="flow-root">
      <ul class="-mb-8">
        <li v-for="(activity, index) in activityData" :key="index">
          <div class="relative pb-8">
            <span 
              class="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" 
              aria-hidden="true" 
              v-if="index !== activityData.length - 1">
            </span>
            <div class="relative flex space-x-3">
              <div>
                <span 
                  class="h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white"
                  :class="getActivityIconClass(activity.type)"
                >
                  <component :is="getActivityIcon(activity.type)" class="h-5 w-5 text-white" />
                </span>
              </div>
              <div class="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                <div>
                  <p class="text-sm text-gray-800">
                    <span class="font-medium text-gray-900">{{ activity.user.name }}</span>
                    {{ getActivityText(activity) }}
                    <span class="font-medium text-gray-900">{{ activity.title }}</span>
                    <span class="text-gray-500">
                      in {{ activity.project.name }}
                    </span>
                  </p>
                  <p class="text-xs text-gray-500 mt-0.5" v-if="activity.description">
                    {{ truncateText(activity.description, 100) }}
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
      
      <div class="mt-4 flex justify-center">
        <button 
          v-if="activityData.length >= 10"
          @click="$emit('load-more')" 
          class="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
        >
          View more activity
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import { 
  RefreshCw, 
  Loader2, 
  Activity,
  CheckSquare,
  Clock,
  Users,
  MessageSquare,
  FileText
} from 'lucide-vue-next';

const props = defineProps({
  activityData: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['refresh', 'load-more']);

const getActivityIcon = (type) => {
  switch (type) {
    case 'task': return CheckSquare;
    case 'timesheet': return Clock;
    case 'meeting': return Users;
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

const truncateText = (text, maxLength) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
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
  
  return date.toLocaleDateString();
};
</script>