<!-- src/components/projects/ProjectCard.vue -->
<template>
  <div 
    class="bg-white rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-300 cursor-pointer group"
    @click="$emit('click')"
  >
    <!-- Card Header -->
    <div class="p-5">
      <div class="flex justify-between items-start mb-4">
        <div>
          <h3 class="text-lg font-medium text-gray-900 group-hover:text-red-600 transition-colors">
            {{ project.name }}
          </h3>
          <p class="text-sm text-gray-500">{{ project.code }}</p>
        </div>
        <div class="flex items-center space-x-2">
          <div 
            class="px-2.5 py-1 text-xs font-semibold rounded-full"
            :class="{
              'bg-yellow-100 text-yellow-800': project.state === 'in_progress',
              'bg-green-100 text-green-800': project.state === 'completed',
              'bg-gray-100 text-gray-800': project.state === 'draft',
              'bg-red-100 text-red-800': project.state === 'cancelled'
            }"
          >
            {{ formatState(project.state) }}
          </div>
          
          <!-- Status Edit Dropdown -->
          <div class="relative" @click.stop>
            <button 
              @click="isStatusDropdownOpen = !isStatusDropdownOpen"
              class="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Edit2 class="h-4 w-4" />
            </button>
            
            <div v-if="isStatusDropdownOpen" class="absolute right-0 z-10 mt-2 w-44 bg-white rounded-lg shadow-lg border border-gray-100">
              <div class="py-1">
                <button
                  v-for="option in statusOptions" 
                  :key="option.value"
                  @click="updateStatus(option.value)"
                  class="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center space-x-2"
                  :class="project.state === option.value ? 'bg-gray-50 font-medium' : ''"
                >
                  <span 
                    class="w-2 h-2 rounded-full"
                    :class="{
                      'bg-yellow-400': option.value === 'in_progress',
                      'bg-green-400': option.value === 'completed',
                      'bg-gray-400': option.value === 'draft',
                      'bg-red-400': option.value === 'cancelled'
                    }"
                  ></span>
                  <span>{{ option.label }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Project Progress -->
      <div class="mb-4">
        <div class="flex justify-between items-center mb-1">
          <span class="text-sm font-medium text-gray-700">Progress</span>
          <span class="text-sm text-gray-600">{{ project.progress }}%</span>
        </div>
        <div class="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
          <div 
            class="h-full rounded-full transition-all duration-500"
            :class="{
              'bg-gradient-to-r from-red-500 to-red-600': project.progress < 100,
              'bg-gradient-to-r from-green-500 to-green-600': project.progress === 100
            }"
            :style="{ width: `${project.progress}%` }"
          ></div>
        </div>
      </div>

      <!-- Content Plan -->
      <div class="grid grid-cols-2 gap-4 mb-4">
        <div class="bg-gray-50 rounded-lg p-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center text-gray-600">
              <Video class="w-4 h-4 mr-2" />
              <span class="text-sm">Videos</span>
            </div>
            <span class="text-sm font-medium">
              {{ project.content_plan.video_count }}
            </span>
          </div>
        </div>
        <div class="bg-gray-50 rounded-lg p-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center text-gray-600">
              <Palette class="w-4 h-4 mr-2" />
              <span class="text-sm">Designs</span>
            </div>
            <span class="text-sm font-medium">
              {{ project.content_plan.design_count }}
            </span>
          </div>
        </div>
      </div>

      <!-- Team & Tasks -->
      <div class="border-t pt-4">
        <div class="flex justify-between items-center">
          <div class="flex items-center">
            <div class="relative flex -space-x-2">
              <div 
                v-for="(member, index) in project.team.members.slice(0, 3)" 
                :key="member.id"
                class="h-8 w-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center"
                :style="{ zIndex: 3 - index }"
              >
                <span class="text-xs font-medium text-gray-600">
                  {{ getInitials(member.name) }}
                </span>
              </div>
              <div 
                v-if="project.team.members.length > 3"
                class="h-8 w-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center"
              >
                <span class="text-xs font-medium text-gray-600">
                  +{{ project.team.members.length - 3 }}
                </span>
              </div>
            </div>
            <span class="ml-2 text-sm text-gray-600">
              {{ project.team.members.length }} members
            </span>
          </div>
          
          <!-- Task Status Summary -->
          <div class="flex items-center space-x-1">
            <div 
              v-for="(count, status) in taskStatusCounts" 
              :key="status"
              v-show="count > 0"
              class="flex items-center"
              :class="{ 'ml-2': status !== 'draft' }"
            >
              <span 
                class="w-2 h-2 rounded-full"
                :class="{
                  'bg-gray-400': status === 'draft',
                  'bg-yellow-400': status === 'in_progress',
                  'bg-purple-400': status === 'review',
                  'bg-amber-400': status === 'revision',
                  'bg-green-400': status === 'done'
                }"
              ></span>
              <span class="ml-1 text-xs text-gray-500">{{ count }}</span>
            </div>
            <div class="flex items-center ml-2">
              <ListChecks class="w-4 h-4 text-gray-400 mr-1" />
              <span class="text-sm text-gray-600">
                {{ project.tasks.length }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Timeline -->
    <div class="px-5 py-3 bg-gray-50 rounded-b-xl border-t">
      <div class="flex items-center justify-between text-sm">
        <div>
          <span class="text-gray-500">Started:</span>
          <span class="ml-1 font-medium">{{ formatDate(project.dates.start) }}</span>
        </div>
        <div>
          <span class="text-gray-500">Due:</span>
          <span 
            class="ml-1 font-medium"
            :class="{
              'text-red-600': isOverdue(project.dates.end),
              'text-green-600': !isOverdue(project.dates.end)
            }"
          >
            {{ formatDate(project.dates.end) }}
          </span>
        </div>
      </div>
    </div>
    
    <!-- Status Change Indicator -->
    <div v-if="showStatusChangeIndicator" class="px-5 py-2 text-center text-xs font-medium bg-blue-50 text-blue-700 rounded-b-xl border-t">
      Status updated to {{ formatState(project.state) }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Video, Palette, ListChecks, Edit2 } from 'lucide-vue-next'
import { format, isPast } from 'date-fns'

const props = defineProps({
  project: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['click', 'status-change'])

const isStatusDropdownOpen = ref(false)
const showStatusChangeIndicator = ref(false)

const statusOptions = [
  { value: 'draft', label: 'Draft' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' }
]

const formatState = (state) => {
  const states = {
    'draft': 'Draft',
    'in_progress': 'In Progress',
    'completed': 'Completed',
    'cancelled': 'Cancelled'
  }
  return states[state] || state
}

const formatDate = (date) => {
  return format(new Date(date), 'dd MMM yyyy')
}

const isOverdue = (date) => {
  return isPast(new Date(date)) && props.project.state !== 'completed'
}

const getInitials = (name) => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
}

// Update project status
const updateStatus = (newStatus) => {
  if (newStatus !== props.project.state) {
    emit('status-change', props.project.id, newStatus)
    showStatusChangeIndicator.value = true
    setTimeout(() => {
      showStatusChangeIndicator.value = false
    }, 3000)
  }
  isStatusDropdownOpen.value = false
}

// Compute task status counts
const taskStatusCounts = computed(() => {
  const counts = {
    draft: 0,
    in_progress: 0,
    review: 0,
    revision: 0,
    done: 0
  }
  
  props.project.tasks.forEach(task => {
    if (counts[task.state] !== undefined) {
      counts[task.state]++
    }
  })
  
  return counts
})

// Close dropdown when clicking outside
onMounted(() => {
  const handleClickOutside = (event) => {
    if (isStatusDropdownOpen.value) {
      isStatusDropdownOpen.value = false
    }
  }
  
  document.addEventListener('click', handleClickOutside)
  
  return () => {
    document.removeEventListener('click', handleClickOutside)
  }
})
</script>