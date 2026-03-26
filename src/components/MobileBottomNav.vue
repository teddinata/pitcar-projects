<template>
  <div class="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-[40] pb-safe transition-transform duration-300">
    <div class="flex justify-around items-center h-16 px-2">
      <!-- Dashboard -->
      <button 
        @click="navigate(dashboardRoute)" 
        class="flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors relative"
        :class="isActive(dashboardRoute) ? 'text-red-600' : 'text-gray-500 hover:text-gray-900'"
      >
        <LayoutDashboard class="w-6 h-6 transition-transform" :class="isActive(dashboardRoute) ? 'scale-110' : ''" />
        <span class="text-[10px] font-medium">Home</span>
        <div v-if="isActive(dashboardRoute)" class="absolute -top-px left-1/2 transform -translate-x-1/2 w-8 h-1 bg-red-600 rounded-b-full"></div>
      </button>

      <!-- Projects -->
      <button 
        @click="navigate(projectsRoute)" 
        class="flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors relative"
        :class="isActive(projectsRoute) ? 'text-red-600' : 'text-gray-500 hover:text-gray-900'"
      >
        <FolderGit2 class="w-6 h-6 transition-transform" :class="isActive(projectsRoute) ? 'scale-110' : ''" />
        <span class="text-[10px] font-medium">Projects</span>
        <div v-if="isActive(projectsRoute)" class="absolute -top-px left-1/2 transform -translate-x-1/2 w-8 h-1 bg-red-600 rounded-b-full"></div>
      </button>

      <!-- Tasks -->
      <button 
        @click="navigate(tasksRoute)" 
        class="flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors relative"
        :class="isActive(tasksRoute) ? 'text-red-600' : 'text-gray-500 hover:text-gray-900'"
      >
        <CheckSquare class="w-6 h-6 transition-transform" :class="isActive(tasksRoute) ? 'scale-110' : ''" />
        <span class="text-[10px] font-medium">Tasks</span>
        <div v-if="isActive(tasksRoute)" class="absolute -top-px left-1/2 transform -translate-x-1/2 w-8 h-1 bg-red-600 rounded-b-full"></div>
      </button>

      <!-- Menu Toggle -->
      <button 
        @click="$emit('open-menu')" 
        class="flex flex-col items-center justify-center w-full h-full space-y-1 text-gray-500 hover:text-gray-900 transition-colors"
      >
        <Menu class="w-6 h-6" />
        <span class="text-[10px] font-medium">Menu</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { LayoutDashboard, FolderGit2, CheckSquare, Menu } from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()

defineEmits(['open-menu'])

const isMarketing = computed(() => {
  return route.path.startsWith('/marketing')
})

const dashboardRoute = computed(() => isMarketing.value ? '/marketing/dashboard' : '/team/dashboard')
const projectsRoute = computed(() => isMarketing.value ? '/marketing/projects' : '/team/projects')
const tasksRoute = computed(() => isMarketing.value ? '/marketing/project/tasks' : '/team/tasks')

const isActive = (path) => {
  return route.path === path
}

const navigate = (path) => {
  router.push(path)
}
</script>

<style scoped>
.pb-safe {
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
