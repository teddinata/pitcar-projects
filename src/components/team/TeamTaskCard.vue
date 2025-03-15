<!-- src/components/team/TeamTaskCard.vue -->
<template>
  <div 
    class="bg-white shadow-sm rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
    @click="$emit('click')"
  >
    <!-- Task Name and Type Badge -->
    <div class="flex justify-between items-start mb-3">
      <h3 class="text-sm font-medium text-gray-900">{{ task.name }}</h3>
      <div
        v-if="task.type"
        class="px-2 py-0.5 text-xs font-medium rounded-full"
        :class="getTaskTypeBadgeClasses(task.type.name)"
      >
        {{ task.type.name }}
      </div>
    </div>

    <!-- Task Progress -->
    <div class="mb-3">
      <div class="flex justify-between text-xs mb-1">
        <span class="text-gray-600">Progress</span>
        <span>{{ task.progress }}%</span>
      </div>
      <div class="w-full bg-gray-100 rounded-full h-1.5">
        <div
          class="h-1.5 rounded-full bg-red-500"
          :style="{ width: `${task.progress}%` }"
        ></div>
      </div>
    </div>

    <!-- Project and Due Date -->
    <div v-if="showMeta" class="flex items-center justify-between text-xs text-gray-500 mb-3">
      <div class="flex items-center">
        <FolderGit2 class="w-3.5 h-3.5 mr-1" />
        <span class="truncate max-w-[120px]">{{ task.project?.name }}</span>
      </div>
      <div class="flex items-center">
        <Calendar class="w-3.5 h-3.5 mr-1" />
        <span :class="isOverdue ? 'text-red-600 font-medium' : ''">
          {{ formattedDueDate }}
        </span>
      </div>
    </div>

    <!-- Assigned To -->
    <div class="flex flex-wrap -mb-1 mt-2">
      <div 
        v-for="person in displayAssignees" 
        :key="person.id"
        class="mr-1 mb-1 px-2 py-0.5 text-xs bg-gray-100 text-gray-800 rounded-full"
      >
        {{ person.name }}
      </div>
      <div
        v-if="extraAssigneesCount > 0"
        class="mb-1 px-2 py-0.5 text-xs bg-gray-100 text-gray-800 rounded-full"
      >
        +{{ extraAssigneesCount }}
      </div>
    </div>

    <!-- Checklist Progress if available -->
    <div v-if="task.checklist_progress !== undefined" class="mt-3 text-xs text-gray-600">
      <div class="flex justify-between items-center">
        <span>Checklist</span>
        <span>{{ Math.round(task.checklist_progress) }}%</span>
      </div>
      <div class="w-full bg-gray-100 rounded-full h-1 mt-1">
        <div
          class="h-1 rounded-full bg-blue-500"
          :style="{ width: `${task.checklist_progress}%` }"
        ></div>
      </div>
    </div>
    
    <!-- Priority Badge -->
    <div class="mt-3 flex items-center justify-between">
      <div 
        v-if="task.priority" 
        class="px-2 py-0.5 text-xs font-medium rounded-full"
        :class="getPriorityBadgeClasses(task.priority)"
      >
        {{ getPriorityLabel(task.priority) }}
      </div>
      
      <div
        v-if="timeEstimate"
        class="text-xs text-gray-500"
      >
        <Clock class="w-3 h-3 inline mr-1" />
        {{ timeEstimate }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { format, isPast, isValid } from 'date-fns'
import { FolderGit2, Calendar, Clock } from 'lucide-vue-next'

const props = defineProps({
  task: {
    type: Object,
    required: true
  },
  showMeta: {
    type: Boolean,
    default: false
  }
})

// Only show first 2 assignees
const displayAssignees = computed(() => {
  if (!props.task.assigned_to) return []
  return props.task.assigned_to.slice(0, 2)
})

const extraAssigneesCount = computed(() => {
  if (!props.task.assigned_to) return 0
  return Math.max(0, props.task.assigned_to.length - 2)
})

const formattedDueDate = computed(() => {
  if (!props.task.dates?.planned_end) return '-'
  
  try {
    const date = new Date(props.task.dates.planned_end)
    if (!isValid(date)) return '-'
    return format(date, 'MMM d')
  } catch (e) {
    return '-'
  }
})

const isOverdue = computed(() => {
  if (!props.task.dates?.planned_end) return false
  
  try {
    const date = new Date(props.task.dates.planned_end)
    if (!isValid(date)) return false
    return isPast(date) && props.task.state !== 'done'
  } catch (e) {
    return false
  }
})

const timeEstimate = computed(() => {
  const hours = props.task.hours?.planned
  if (!hours) return ''
  
  return hours === 1 ? '1 hr' : `${hours} hrs`
})

// Helper functions
const getTaskTypeBadgeClasses = (type) => {
  const typeClasses = {
    'Development': 'bg-blue-100 text-blue-800',
    'Design': 'bg-purple-100 text-purple-800',
    'Documentation': 'bg-green-100 text-green-800',
    'Testing': 'bg-yellow-100 text-yellow-800',
    'Research': 'bg-indigo-100 text-indigo-800'
  }
  
  return typeClasses[type] || 'bg-gray-100 text-gray-800'
}

const getPriorityBadgeClasses = (priority) => {
  const priorityClasses = {
    '0': 'bg-gray-100 text-gray-800',
    '1': 'bg-blue-100 text-blue-800',
    '2': 'bg-orange-100 text-orange-800',
    '3': 'bg-red-100 text-red-800'
  }
  
  return priorityClasses[priority] || 'bg-gray-100 text-gray-800'
}

const getPriorityLabel = (priority) => {
  const priorityLabels = {
    '0': 'Low',
    '1': 'Medium',
    '2': 'High',
    '3': 'Critical'
  }
  
  return priorityLabels[priority] || 'Medium'
}
</script>