<template>
  <Teleport to="body">
    <!-- Backdrop overlay -->
    <Transition
      enter-active-class="transition-opacity ease-linear duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity ease-linear duration-300"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div 
        v-if="isOpen" 
        class="fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-[45] md:hidden"
        @click="$emit('close')"
      ></div>
    </Transition>

    <!-- Slide-over panel -->
    <Transition
      enter-active-class="transition ease-in-out duration-300 transform"
      enter-from-class="-translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="transition ease-in-out duration-300 transform"
      leave-from-class="translate-x-0"
      leave-to-class="-translate-x-full"
    >
      <div 
        v-if="isOpen" 
        class="fixed inset-y-0 left-0 w-4/5 max-w-sm bg-white shadow-2xl z-[50] flex flex-col md:hidden"
      >
        <!-- Header Profile -->
        <div class="bg-gradient-to-br from-red-600 to-red-700 px-5 pt-8 pb-5 flex flex-col">
          <div class="flex justify-between items-start mb-4">
            <div class="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
              <img src="/pitcar-modified.png" alt="PITCAR" class="w-8 h-8" />
            </div>
            <button @click="$emit('close')" class="text-red-100 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors">
              <X class="w-6 h-6" />
            </button>
          </div>
          <div class="text-white">
            <h2 class="font-bold text-lg leading-tight truncate">{{ authStore.user?.name || 'User' }}</h2>
            <p class="text-red-100 text-sm truncate opacity-90">{{ authStore.user?.is_admin ? 'Administrator' : 'Team Member' }}</p>
          </div>
        </div>

        <!-- Navigation Menu -->
        <div class="flex-1 overflow-y-auto px-4 py-5 space-y-6 pb-24">
          
          <!-- Default Main Links (Marketing / Teams context is injected here) -->
          <div>
            <h3 class="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Utama
            </h3>
            <div class="space-y-1">
              <button @click="navigate(dashboardRoute)" class="w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50 hover:text-red-600 transition-colors">
                <LayoutDashboard class="w-5 h-5 mr-3 text-gray-400" />
                Dashboard
              </button>
              <button @click="navigate(projectsRoute)" class="w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50 hover:text-red-600 transition-colors">
                <FolderGit2 class="w-5 h-5 mr-3 text-gray-400" />
                Projects
              </button>
              <button @click="navigate(tasksRoute)" class="w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50 hover:text-red-600 transition-colors">
                <CheckSquare class="w-5 h-5 mr-3 text-gray-400" />
                Tasks
              </button>
              
              <!-- Conditional elements for All Teams -->
              <button v-if="!isMarketing" @click="navigate('/team/timesheets')" class="w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50 hover:text-red-600 transition-colors">
                <Clock class="w-5 h-5 mr-3 text-gray-400" />
                Lembar Waktu
              </button>
              <button v-if="!isMarketing" @click="navigate('/team/time-reports')" class="w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50 hover:text-red-600 transition-colors">
                <BarChart class="w-5 h-5 mr-3 text-gray-400" />
                Time Reports
              </button>
            </div>
          </div>

          <!-- BAU Section -->
          <div>
            <h3 class="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Business as Usual (BAU)
            </h3>
            <div class="space-y-1 border-l-2 border-red-100 ml-5 pl-2">
              <button @click="navigate(isMarketing ? '/marketing/bau/dashboard' : '/team/bau/dashboard')" class="w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors">
                <LayoutDashboard class="w-4 h-4 mr-3" />
                BAU Dashboard
              </button>
              <button @click="navigate(isMarketing ? '/marketing/bau/activities' : '/team/bau/activities')" class="w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors">
                <ClipboardList class="w-4 h-4 mr-3" />
                Activities
              </button>
              <button @click="navigate(isMarketing ? '/marketing/bau/team' : '/team/bau/members')" class="w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors">
                <Users class="w-4 h-4 mr-3" />
                Team / Members
              </button>
              <button @click="navigate(isMarketing ? '/marketing/bau/calendar' : '/team/bau/calendar')" class="w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors">
                <Calendar class="w-4 h-4 mr-3" />
                Calendar
              </button>
            </div>
          </div>

          <!-- Context Switcher (Only visible if User has access to both, but we show it unconditionally as Pitcar layout treats them globally available if authorized) -->
          <div class="bg-gray-50 rounded-xl p-3 border border-gray-100">
            <h3 class="text-xs font-semibold text-gray-500 mb-2">Switch View</h3>
            <div class="flex bg-gray-200/50 p-1 rounded-lg">
              <button 
                @click="switchContext('marketing')" 
                class="flex-1 text-xs py-1.5 rounded-md font-medium transition-colors"
                :class="isMarketing ? 'bg-white shadow text-red-600' : 'text-gray-500 hover:text-gray-700'"
              >
                Marketing
              </button>
              <button 
                @click="switchContext('team')" 
                class="flex-1 text-xs py-1.5 rounded-md font-medium transition-colors"
                :class="!isMarketing ? 'bg-white shadow text-red-600' : 'text-gray-500 hover:text-gray-700'"
              >
                All Teams
              </button>
            </div>
          </div>

        </div>

        <!-- Footer Actions -->
        <div class="border-t border-gray-100 p-4 bg-gray-50 mt-auto">
          <button @click="navigate('/profile')" class="w-full flex items-center px-4 py-2.5 text-sm font-medium rounded-xl text-gray-700 bg-white border border-gray-200 shadow-sm hover:bg-gray-50 mb-3 transition-colors">
            <Settings class="w-5 h-5 mr-3 text-gray-400" />
            Pengaturan Profil
          </button>
          <button @click="handleLogout" class="w-full flex items-center px-4 py-2.5 text-sm font-medium rounded-xl text-red-700 bg-red-50 border border-red-100 hover:bg-red-100 transition-colors">
            <LogOut class="w-5 h-5 mr-3 text-red-500" />
            Keluar (Logout)
          </button>
          <div class="text-center mt-3 text-[10px] text-gray-400">
            Pitcar App v{{ version }}
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import packageJson from '../../package.json'
import { 
  X, LayoutDashboard, FolderGit2, CheckSquare, 
  Settings, LogOut, Clock, BarChart, Users, Calendar, ClipboardList
} from 'lucide-vue-next'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['close'])

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const version = packageJson.version

const isMarketing = computed(() => route.path.startsWith('/marketing'))

const dashboardRoute = computed(() => isMarketing.value ? '/marketing/dashboard' : '/team/dashboard')
const projectsRoute = computed(() => isMarketing.value ? '/marketing/projects' : '/team/projects')
const tasksRoute = computed(() => isMarketing.value ? '/marketing/project/tasks' : '/team/tasks')

const navigate = (path) => {
  router.push(path)
  emit('close')
}

const switchContext = (type) => {
  if (type === 'marketing') {
    navigate('/marketing/dashboard')
  } else {
    navigate('/team/dashboard')
  }
}

const handleLogout = async () => {
  emit('close')
  try {
    await authStore.logout()
    router.push('/login')
  } catch (error) {
    console.error('Logout failed:', error)
  }
}
</script>
