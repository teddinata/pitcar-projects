<!-- src/components/team/TeamProjectCard.vue -->
<template>
  <div 
    class="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden"
    @click="$emit('click')"
  >
    <!-- Header with status badge -->
    <div class="p-5 border-b border-gray-100">
      <div class="flex items-start justify-between">
        <div>
          <h3 class="text-lg font-medium text-gray-900 truncate">{{ project.name }}</h3>
          <span class="text-sm text-gray-500">{{ project.code }}</span>
        </div>
        <div
          class="px-3 py-1 text-xs font-semibold rounded-full"
          :class="{
            'bg-yellow-100 text-yellow-800': project.state === 'in_progress',
            'bg-green-100 text-green-800': project.state === 'completed',
            'bg-gray-100 text-gray-800': project.state === 'draft',
            'bg-purple-100 text-purple-800': project.state === 'planning',
            'bg-orange-100 text-orange-800': project.state === 'on_hold',
            'bg-red-100 text-red-800': project.state === 'cancelled'
          }"
        >
          {{ formatState(project.state) }}
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="p-5 space-y-4">
      <!-- Department -->
      <div class="flex items-center text-sm">
        <Briefcase class="h-4 w-4 text-gray-500 mr-2" />
        <span>{{ project.department.name }}</span>
      </div>

      <!-- Progress bar -->
      <div>
        <div class="flex justify-between text-sm mb-1">
          <span class="text-gray-600">Overall Progress</span>
          <span class="font-medium">{{ project.progress }}%</span>
        </div>
        <div class="w-full bg-gray-100 rounded-full h-2">
          <div 
            class="h-2 rounded-full bg-gradient-to-r from-red-500 to-red-600"
            :style="{ width: `${project.progress}%` }"
          ></div>
        </div>
      </div>

      <!-- Timeline -->
      <div class="flex justify-between text-sm">
        <div>
          <span class="text-gray-600">Start: </span>
          <span>{{ formatDate(project.dates.start) }}</span>
        </div>
        <div>
          <span class="text-gray-600">End: </span>
          <span 
            :class="{ 'text-red-600': isOverdue(project.dates.end) }"
          >
            {{ formatDate(project.dates.end) }}
          </span>
        </div>
      </div>

      <!-- Task count -->
      <div class="border-t border-gray-100 pt-4 flex justify-between items-center">
        <div class="flex items-center text-sm text-gray-600">
          <CheckSquare class="h-4 w-4 mr-1.5" />
          <span>{{ project.task_count || 0 }} tasks</span>
        </div>

        <!-- Team -->
        <div class="flex -space-x-2">
          <div 
            class="h-7 w-7 rounded-full bg-red-100 border-2 border-white flex items-center justify-center text-xs font-medium text-red-600"
          >
            {{ getInitials(project.team?.manager?.name) }}
          </div>
          <div 
            v-for="(member, index) in displayMembers" 
            :key="index"
            class="h-7 w-7 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-600"
          >
            {{ getInitials(member.name) }}
          </div>
          <div
            v-if="extraMembersCount > 0"
            class="h-7 w-7 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-600"
          >
            +{{ extraMembersCount }}
          </div>
        </div>
      </div>
    </div>

    <!-- Action buttons -->
    <div class="p-3 bg-gray-50 border-t border-gray-100 flex justify-end gap-2">
      <div class="relative" ref="statusMenuRef">
        <button 
          class="px-3 py-1.5 text-xs text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-gray-50 flex items-center"
          @click.stop="toggleStatusMenu"
        >
          <ActivityIcon class="h-3.5 w-3.5 mr-1.5" />
          Status
        </button>
        <!-- Status dropdown -->
        <div 
          v-if="showStatusMenu" 
          class="absolute right-0 bottom-full mb-2 bg-white rounded-md shadow-lg border border-gray-200 z-10"
        >
          <div class="py-1">
            <button 
              v-for="status in availableStatuses"
              :key="status.value"
              class="w-full px-4 py-2 text-left text-xs hover:bg-gray-50 flex items-center"
              :class="{ 'text-red-600 font-medium': status.value === project.state }"
              @click.stop="changeStatus(status.value)"
            >
              {{ status.label }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { format, isPast } from 'date-fns'
import { Briefcase, CheckSquare, ActivityIcon } from 'lucide-vue-next'

const props = defineProps({
  project: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['click', 'status-change'])

const statusMenuRef = ref(null)
const showStatusMenu = ref(false)

// Only show first 3 members
const displayMembers = computed(() => {
  if (!props.project.team?.members) return []
  return props.project.team.members.slice(0, 3)
})

const extraMembersCount = computed(() => {
  if (!props.project.team?.members) return 0
  return Math.max(0, props.project.team.members.length - 3)
})

const availableStatuses = [
  { value: 'draft', label: 'Draft' },
  { value: 'planning', label: 'Planning' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'on_hold', label: 'On Hold' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' }
]

const toggleStatusMenu = () => {
  showStatusMenu.value = !showStatusMenu.value
}

const changeStatus = (newStatus) => {
  if (newStatus !== props.project.state) {
    emit('status-change', props.project.id, newStatus)
  }
  showStatusMenu.value = false
}

const formatState = (state) => {
  const states = {
    draft: 'Draft',
    planning: 'Planning',
    in_progress: 'In Progress',
    on_hold: 'On Hold',
    completed: 'Completed',
    cancelled: 'Cancelled'
  }
  return states[state] || state
}

const formatDate = (date) => {
  if (!date) return '-'
  return format(new Date(date), 'dd MMM yyyy')
}

const isOverdue = (date) => {
  if (!date) return false
  return isPast(new Date(date)) && props.project.state !== 'completed'
}

const getInitials = (name) => {
  if (!name) return ''
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
}

// Close status menu when clicked outside
const handleClickOutside = (event) => {
  if (statusMenuRef.value && !statusMenuRef.value.contains(event.target)) {
    showStatusMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside)
})
</script>