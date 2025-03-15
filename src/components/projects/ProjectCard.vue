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
        <div 
          class="px-2.5 py-1 text-xs font-semibold rounded-full"
          :class="{
            'bg-yellow-100 text-yellow-800': project.state === 'in_progress',
            'bg-green-100 text-green-800': project.state === 'completed',
            'bg-gray-100 text-gray-800': project.state === 'draft'
          }"
        >
          {{ formatState(project.state) }}
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
        <div class="grid grid-cols-2 gap-4">
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
          <div class="flex items-center justify-end">
            <ListChecks class="w-4 h-4 text-gray-400 mr-1.5" />
            <span class="text-sm text-gray-600">
              {{ project.tasks.length }} tasks
            </span>
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
  </div>
</template>

<script setup>
import { Video, Palette, ListChecks } from 'lucide-vue-next'
import { format, isPast } from 'date-fns'

const props = defineProps({
  project: {
    type: Object,
    required: true
  }
})

defineEmits(['click'])

const formatState = (state) => {
  const states = {
    'draft': 'Draft',
    'in_progress': 'In Progress',
    'completed': 'Completed'
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
</script>