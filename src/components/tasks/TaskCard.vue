<!-- src/components/tasks/TaskCard.vue -->
<template>
  <div 
    class="bg-white p-4 rounded-lg shadow hover:shadow-md transition-all cursor-pointer border border-gray-100"
    @click="$emit('click')"
  >
    <!-- Header -->
    <div class="flex items-start justify-between mb-3">
      <div class="space-y-1">
        <span class="text-sm font-medium text-gray-900 line-clamp-2">
          {{ task.name }}
        </span>
        <div class="flex items-center text-xs text-gray-500">
          <FolderGit2 class="w-3.5 h-3.5 mr-1" />
          {{ task.project.name }}
        </div>
      </div>
      <Badge :type="task.content_type" />
    </div>

    <div class="space-y-3">
      <!-- Timeline -->
      <div class="flex items-center justify-between text-xs">
        <div class="flex items-center text-gray-500">
          <Calendar class="w-3.5 h-3.5 mr-1" />
          {{ formatDate(task.dates.planned_end) }}
        </div>
        <div class="flex items-center text-gray-500">
          <Clock class="w-3.5 h-3.5 mr-1" />
          {{ task.hours.planned }}h
        </div>
      </div>

      <!-- Progress Bar -->
      <div class="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          class="h-full bg-green-500 transition-all duration-300"
          :style="{ width: `${task.progress}%` }"
        />
      </div>

      <!-- Team & Status -->
      <div class="flex items-center justify-between">
        <!-- Team Members -->
        <div class="flex -space-x-2">
          <div 
            v-for="member in task.assigned_to.slice(0, 3)" 
            :key="member.id"
            class="h-6 w-6 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center"
            :title="member.name"
          >
            <span class="text-xs font-medium">{{ getInitials(member.name) }}</span>
          </div>
          <div 
            v-if="task.assigned_to.length > 3"
            class="h-6 w-6 rounded-full bg-gray-50 border-2 border-white flex items-center justify-center"
            :title="`${task.assigned_to.length - 3} more team members`"
          >
            <span class="text-xs font-medium text-gray-600">
              +{{ task.assigned_to.length - 3 }}
            </span>
          </div>
        </div>

        <!-- Status Badge -->
        <span 
          class="text-xs font-medium px-2 py-1 rounded"
          :class="getStatusClass(task.state)"
        >
          {{ formatStatus(task.state) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { FolderGit2, Calendar, Clock } from 'lucide-vue-next'
import Badge from '@/components/Badge.vue'

const props = defineProps({
  task: {
    type: Object,
    required: true
  }
})

defineEmits(['click'])

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

const getInitials = (name) => {
  if (!name) return ''
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
}

const formatStatus = (state) => {
  return state.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
}

const getStatusClass = (state) => {
  const classes = {
    draft: 'bg-gray-100 text-gray-700',
    in_progress: 'bg-blue-50 text-blue-700',
    review: 'bg-yellow-50 text-yellow-700',
    completed: 'bg-green-50 text-green-700'
  }
  return classes[state] || classes.draft
}
</script>