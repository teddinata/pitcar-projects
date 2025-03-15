<template>
  <div
    class="h-screen bg-white border-r border-gray-100 shadow-sm transition-all duration-300 ease-in-out relative flex flex-col"
    :class="[
      isExpanded ? 'w-64' : 'w-20',
      !isPinned && 'hover-expand'
    ]"
    @mouseenter="isPinned ? null : (isExpanded = true)"
    @mouseleave="isPinned ? null : (isExpanded = false)"
  >
    <!-- Logo Section -->
    <div class="flex items-center h-20 px-6 border-b border-gray-50">
      <div class="w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
        <img src="/pitcar-modified.png" alt="PITCAR" class="w-7 h-7" />
      </div>
      <div class="ml-4 transition-all duration-300 overflow-hidden"
        :class="isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0'"
      >
        <img src="/pitcar-logo.png" alt="PITCAR" class="w-32" />
      </div>
      
      <!-- Pin/Unpin Toggle Button -->
      <button 
        v-if="isExpanded"
        @click="togglePin"
        class="ml-8 text-gray-400 hover:text-gray-600 transition-colors duration-200"
        :title="isPinned ? 'Unlock Sidebar' : 'Lock Sidebar'"
      >
        <PinIcon v-if="isPinned" class="w-8 h-8" />
        <PinOffIcon v-else class="w-8 h-8" />
      </button>
    </div>

    <!-- Menu Items -->
    <nav class="flex-1 mt-6 px-4 overflow-y-auto">
      <!-- Marketing Section -->
      <div class="mb-3">
        <!-- Marketing Main Menu Toggle -->
        <div
          @click="toggleMarketingMenu"
          class="relative flex items-center cursor-pointer transition-all duration-200 rounded-xl"
          :class="[
            isMarketingActive
              ? 'text-white bg-gradient-to-r from-red-600 to-red-700 shadow-sm'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          ]"
        >
          <div class="h-11 w-full flex items-center px-3">
            <Megaphone
              class="w-5 h-5 shrink-0"
              :class="isMarketingActive ? 'text-white' : 'text-gray-600'"
            />
            <span
              class="ml-3 font-medium overflow-hidden"
              :class="[
                isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0',
                isMarketingActive ? 'text-white' : 'text-gray-600'
              ]"
            >
              Marketing Teams
            </span>
            <ChevronDown
              v-if="isExpanded"
              class="w-4 h-4 ml-auto transition-transform"
              :class="[
                showMarketingSubMenu ? 'rotate-180' : '',
                isMarketingActive ? 'text-white' : 'text-gray-600'
              ]"
            />
          </div>
        </div>
      
        <!-- Marketing Sub Menu Items -->
        <div
          v-if="showMarketingSubMenu && isExpanded"
          class="pl-4 mt-2 space-y-1"
        >
          <!-- Marketing Dashboard -->
          <router-link
            :to="'/marketing/dashboard'"
            custom
            v-slot="{ isActive, navigate }"
          >
            <div
              :class="[
                'relative flex items-center py-2 pl-4 pr-2 cursor-pointer transition-all duration-200 rounded-lg',
                isActive
                  ? 'bg-red-50 text-red-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              ]"
              @click="navigate"
            >
              <LayoutDashboard
                class="w-4 h-4 shrink-0"
                :class="isActive ? 'text-red-600' : 'text-gray-600'"
              />
              <span class="ml-2 font-medium text-sm">Dashboard</span>
            </div>
          </router-link>
      
          <!-- Marketing Projects -->
          <router-link
            :to="'/marketing/projects'"
            custom
            v-slot="{ isActive, navigate }"
          >
            <div
              :class="[
                'relative flex items-center py-2 pl-4 pr-2 cursor-pointer transition-all duration-200 rounded-lg',
                isActive
                  ? 'bg-red-50 text-red-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              ]"
              @click="navigate"
            >
              <FolderGit2
                class="w-4 h-4 shrink-0"
                :class="isActive ? 'text-red-600' : 'text-gray-600'"
              />
              <span class="ml-2 font-medium text-sm">Projects</span>
            </div>
          </router-link>
      
          <!-- Marketing Tasks -->
          <router-link
            :to="'/marketing/project/tasks'"
            custom
            v-slot="{ isActive, navigate }"
          >
            <div
              :class="[
                'relative flex items-center py-2 pl-4 pr-2 cursor-pointer transition-all duration-200 rounded-lg',
                isActive
                  ? 'bg-red-50 text-red-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              ]"
              @click="navigate"
            >
              <CheckSquare
                class="w-4 h-4 shrink-0"
                :class="isActive ? 'text-red-600' : 'text-gray-600'"
              />
              <span class="ml-2 font-medium text-sm">Tasks</span>
            </div>
          </router-link>

          <!-- Marketing BAU with Submenu -->
          <div>
            <!-- BAU Toggle -->
            <div
              @click="toggleBAUMenu"
              :class="[
                'relative flex items-center py-2 pl-4 pr-2 cursor-pointer transition-all duration-200 rounded-lg',
                isBAUActive
                  ? 'bg-red-50 text-red-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              ]"
            >
              <Briefcase
                class="w-4 h-4 shrink-0"
                :class="isBAUActive ? 'text-red-600' : 'text-gray-600'"
              />
              <span class="ml-2 font-medium text-sm">Business as Usual</span>
              <ChevronDown
                class="w-3 h-3 ml-auto transition-transform"
                :class="[
                  showBAUSubMenu ? 'rotate-180' : '',
                  isBAUActive ? 'text-red-600' : 'text-gray-600'
                ]"
              />
            </div>
          
            <!-- BAU Sub Menu -->
            <div
              v-if="showBAUSubMenu"
              class="pl-3 mt-1 space-y-1"
            >
              <!-- BAU Dashboard -->
              <router-link
                :to="'/marketing/bau/dashboard'"
                custom
                v-slot="{ isActive, navigate }"
              >
                <div
                  :class="[
                    'relative flex items-center py-2 pl-4 pr-2 cursor-pointer transition-all duration-200 rounded-lg',
                    isActive
                      ? 'bg-red-50 text-red-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  ]"
                  @click="navigate"
                >
                  <LayoutDashboard
                    class="w-3 h-3 shrink-0"
                    :class="isActive ? 'text-red-600' : 'text-gray-600'"
                  />
                  <span class="ml-2 font-medium text-xs">Dashboard</span>
                </div>
              </router-link>
          
              <!-- BAU Activities -->
              <router-link
                :to="'/marketing/bau/activities'"
                custom
                v-slot="{ isActive, navigate }"
              >
                <div
                  :class="[
                    'relative flex items-center py-2 pl-4 pr-2 cursor-pointer transition-all duration-200 rounded-lg',
                    isActive
                      ? 'bg-red-50 text-red-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  ]"
                  @click="navigate"
                >
                  <ClipboardList
                    class="w-3 h-3 shrink-0"
                    :class="isActive ? 'text-red-600' : 'text-gray-600'"
                  />
                  <span class="ml-2 font-medium text-xs">Activities</span>
                </div>
              </router-link>
          
              <!-- BAU Team View -->
              <router-link
                :to="'/marketing/bau/team'"
                custom
                v-slot="{ isActive, navigate }"
              >
                <div
                  :class="[
                    'relative flex items-center py-2 pl-4 pr-2 cursor-pointer transition-all duration-200 rounded-lg',
                    isActive
                      ? 'bg-red-50 text-red-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  ]"
                  @click="navigate"
                >
                  <Users
                    class="w-3 h-3 shrink-0"
                    :class="isActive ? 'text-red-600' : 'text-gray-600'"
                  />
                  <span class="ml-2 font-medium text-xs">Team</span>
                </div>
              </router-link>
          
              <!-- BAU Calendar -->
              <router-link
                :to="'/marketing/bau/calendar'"
                custom
                v-slot="{ isActive, navigate }"
              >
                <div
                  :class="[
                    'relative flex items-center py-2 pl-4 pr-2 cursor-pointer transition-all duration-200 rounded-lg',
                    isActive
                      ? 'bg-red-50 text-red-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  ]"
                  @click="navigate"
                >
                  <Calendar
                    class="w-3 h-3 shrink-0"
                    :class="isActive ? 'text-red-600' : 'text-gray-600'"
                  />
                  <span class="ml-2 font-medium text-xs">Calendar</span>
                </div>
              </router-link>
            </div>
          </div>

          <!-- Marketing Analytics -->
          <!-- <router-link
            :to="'/marketing/analytics'"
            custom
            v-slot="{ isActive, navigate }"
          >
            <div
              :class="[
                'relative flex items-center py-2 pl-4 pr-2 cursor-pointer transition-all duration-200 rounded-lg',
                isActive
                  ? 'bg-red-50 text-red-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              ]"
              @click="navigate"
            >
              <BarChart3
                class="w-4 h-4 shrink-0"
                :class="isActive ? 'text-red-600' : 'text-gray-600'"
              />
              <span class="ml-2 font-medium text-sm">Analytics</span>
            </div>
          </router-link> -->
        </div>
      </div>

      <!-- Team Management Section -->
      <div class="mb-3">
        <!-- Team Management Main Menu Toggle -->
        <div
          @click="toggleTeamMenu"
          class="relative flex items-center cursor-pointer transition-all duration-200 rounded-xl"
          :class="[
            isTeamActive
              ? 'text-white bg-gradient-to-r from-red-600 to-red-700 shadow-sm'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          ]"
        >
          <div class="h-11 w-full flex items-center px-3">
            <Users2
              class="w-5 h-5 shrink-0"
              :class="isTeamActive ? 'text-white' : 'text-gray-600'"
            />
            <span
              class="ml-3 font-medium overflow-hidden"
              :class="[
                isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0',
                isTeamActive ? 'text-white' : 'text-gray-600'
              ]"
            >
              All Teams
            </span>
            <ChevronDown
              v-if="isExpanded"
              class="w-4 h-4 ml-auto transition-transform"
              :class="[
                showTeamSubMenu ? 'rotate-180' : '',
                isTeamActive ? 'text-white' : 'text-gray-600'
              ]"
            />
          </div>
        </div>
      
        <!-- Team Management Sub Menu Items -->
        <div
          v-if="showTeamSubMenu && isExpanded"
          class="pl-4 mt-2 space-y-1"
        >
          <!-- Team Dashboard -->
          <router-link
            :to="'/team/dashboard'"
            custom
            v-slot="{ isActive, navigate }"
          >
            <div
              :class="[
                'relative flex items-center py-2 pl-4 pr-2 cursor-pointer transition-all duration-200 rounded-lg',
                isActive
                  ? 'bg-red-50 text-red-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              ]"
              @click="navigate"
            >
              <LayoutDashboard
                class="w-4 h-4 shrink-0"
                :class="isActive ? 'text-red-600' : 'text-gray-600'"
              />
              <span class="ml-2 font-medium text-sm">Dashboard</span>
            </div>
          </router-link>
      
          <!-- Team Projects -->
          <router-link
            :to="'/team/projects'"
            custom
            v-slot="{ isActive, navigate }"
          >
            <div
              :class="[
                'relative flex items-center py-2 pl-4 pr-2 cursor-pointer transition-all duration-200 rounded-lg',
                isActive
                  ? 'bg-red-50 text-red-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              ]"
              @click="navigate"
            >
              <FolderGit2
                class="w-4 h-4 shrink-0"
                :class="isActive ? 'text-red-600' : 'text-gray-600'"
              />
              <span class="ml-2 font-medium text-sm">Projects</span>
            </div>
          </router-link>
      
          <!-- Team Task Management with Submenu -->
          <div>
            <!-- Task Management Toggle -->
            <div
              @click="toggleTaskMenu"
              :class="[
                'relative flex items-center py-2 pl-4 pr-2 cursor-pointer transition-all duration-200 rounded-lg',
                isTaskActive
                  ? 'bg-red-50 text-red-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              ]"
            >
              <CheckSquare
                class="w-4 h-4 shrink-0"
                :class="isTaskActive ? 'text-red-600' : 'text-gray-600'"
              />
              <span class="ml-2 font-medium text-sm">Task Management</span>
              <ChevronDown
                class="w-3 h-3 ml-auto transition-transform"
                :class="[
                  showTaskSubMenu ? 'rotate-180' : '',
                  isTaskActive ? 'text-red-600' : 'text-gray-600'
                ]"
              />
            </div>
          
            <!-- Task Management Sub Menu -->
            <div
              v-if="showTaskSubMenu"
              class="pl-3 mt-1 space-y-1"
            >
              <!-- All Tasks -->
              <router-link
                :to="'/tasks'"
                custom
                v-slot="{ isActive, navigate }"
              >
                <div
                  :class="[
                    'relative flex items-center py-2 pl-4 pr-2 cursor-pointer transition-all duration-200 rounded-lg',
                    isActive
                      ? 'bg-red-50 text-red-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  ]"
                  @click="navigate"
                >
                  <ListTodo
                    class="w-3 h-3 shrink-0"
                    :class="isActive ? 'text-red-600' : 'text-gray-600'"
                  />
                  <span class="ml-2 font-medium text-xs">Task</span>
                </div>
              </router-link>
          
              <!-- Timesheets -->
              <router-link
                :to="'/tasks/timesheets'"
                custom
                v-slot="{ isActive, navigate }"
              >
                <div
                  :class="[
                    'relative flex items-center py-2 pl-4 pr-2 cursor-pointer transition-all duration-200 rounded-lg',
                    isActive
                      ? 'bg-red-50 text-red-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  ]"
                  @click="navigate"
                >
                  <Clock
                    class="w-3 h-3 shrink-0"
                    :class="isActive ? 'text-red-600' : 'text-gray-600'"
                  />
                  <span class="ml-2 font-medium text-xs">Timesheets</span>
                </div>
              </router-link>
          
              <!-- Time Reports -->
              <router-link
                :to="'/tasks/time-reports'"
                custom
                v-slot="{ isActive, navigate }"
              >
                <div
                  :class="[
                    'relative flex items-center py-2 pl-4 pr-2 cursor-pointer transition-all duration-200 rounded-lg',
                    isActive
                      ? 'bg-red-50 text-red-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  ]"
                  @click="navigate"
                >
                  <BarChart
                    class="w-3 h-3 shrink-0"
                    :class="isActive ? 'text-red-600' : 'text-gray-600'"
                  />
                  <span class="ml-2 font-medium text-xs">Time Reports</span>
                </div>
              </router-link>
            </div>
          </div>

          <!-- Team BAU with Submenu -->
          <div>
            <!-- Team BAU Toggle -->
            <div
              @click="toggleTeamBAUMenu"
              :class="[
                'relative flex items-center py-2 pl-4 pr-2 cursor-pointer transition-all duration-200 rounded-lg',
                isTeamBAUActive
                  ? 'bg-red-50 text-red-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              ]"
            >
              <Briefcase
                class="w-4 h-4 shrink-0"
                :class="isTeamBAUActive ? 'text-red-600' : 'text-gray-600'"
              />
              <span class="ml-2 font-medium text-sm">Business as Usual</span>
              <ChevronDown
                class="w-3 h-3 ml-auto transition-transform"
                :class="[
                  showTeamBAUSubMenu ? 'rotate-180' : '',
                  isTeamBAUActive ? 'text-red-600' : 'text-gray-600'
                ]"
              />
            </div>
          
            <!-- Team BAU Sub Menu -->
            <div
              v-if="showTeamBAUSubMenu"
              class="pl-3 mt-1 space-y-1"
            >
              <!-- Team BAU Dashboard -->
              <router-link
                :to="'/team/bau/dashboard'"
                custom
                v-slot="{ isActive, navigate }"
              >
                <div
                  :class="[
                    'relative flex items-center py-2 pl-4 pr-2 cursor-pointer transition-all duration-200 rounded-lg',
                    isActive
                      ? 'bg-red-50 text-red-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  ]"
                  @click="navigate"
                >
                  <LayoutDashboard
                    class="w-3 h-3 shrink-0"
                    :class="isActive ? 'text-red-600' : 'text-gray-600'"
                  />
                  <span class="ml-2 font-medium text-xs">Dashboard</span>
                </div>
              </router-link>
          
              <!-- Team BAU Activities -->
              <router-link
                :to="'/team/bau/activities'"
                custom
                v-slot="{ isActive, navigate }"
              >
                <div
                  :class="[
                    'relative flex items-center py-2 pl-4 pr-2 cursor-pointer transition-all duration-200 rounded-lg',
                    isActive
                      ? 'bg-red-50 text-red-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  ]"
                  @click="navigate"
                >
                  <ClipboardList
                    class="w-3 h-3 shrink-0"
                    :class="isActive ? 'text-red-600' : 'text-gray-600'"
                  />
                  <span class="ml-2 font-medium text-xs">Activities</span>
                </div>
              </router-link>
          
              <!-- Team BAU Members -->
              <router-link
                :to="'/team/bau/members'"
                custom
                v-slot="{ isActive, navigate }"
              >
                <div
                  :class="[
                    'relative flex items-center py-2 pl-4 pr-2 cursor-pointer transition-all duration-200 rounded-lg',
                    isActive
                      ? 'bg-red-50 text-red-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  ]"
                  @click="navigate"
                >
                  <Users
                    class="w-3 h-3 shrink-0"
                    :class="isActive ? 'text-red-600' : 'text-gray-600'"
                  />
                  <span class="ml-2 font-medium text-xs">Members</span>
                </div>
              </router-link>
          
              <!-- Team BAU Calendar -->
              <router-link
                :to="'/team/bau/calendar'"
                custom
                v-slot="{ isActive, navigate }"
              >
                <div
                  :class="[
                    'relative flex items-center py-2 pl-4 pr-2 cursor-pointer transition-all duration-200 rounded-lg',
                    isActive
                      ? 'bg-red-50 text-red-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  ]"
                  @click="navigate"
                >
                  <Calendar
                    class="w-3 h-3 shrink-0"
                    :class="isActive ? 'text-red-600' : 'text-gray-600'"
                  />
                  <span class="ml-2 font-medium text-xs">Calendar</span>
                </div>
              </router-link>
            </div>
          </div>

          <!-- Team Analytics -->
          <!-- <router-link
            :to="'/team/analytics'"
            custom
            v-slot="{ isActive, navigate }"
          >
            <div
              :class="[
                'relative flex items-center py-2 pl-4 pr-2 cursor-pointer transition-all duration-200 rounded-lg',
                isActive
                  ? 'bg-red-50 text-red-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              ]"
              @click="navigate"
            >
              <BarChart3
                class="w-4 h-4 shrink-0"
                :class="isActive ? 'text-red-600' : 'text-gray-600'"
              />
              <span class="ml-2 font-medium text-sm">Analytics</span>
            </div>
          </router-link> -->

          <!-- Team Members -->
          <!-- <router-link
            :to="'/team/members'"
            custom
            v-slot="{ isActive, navigate }"
          >
            <div
              :class="[
                'relative flex items-center py-2 pl-4 pr-2 cursor-pointer transition-all duration-200 rounded-lg',
                isActive
                  ? 'bg-red-50 text-red-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              ]"
              @click="navigate"
            >
              <User
                class="w-4 h-4 shrink-0"
                :class="isActive ? 'text-red-600' : 'text-gray-600'"
              />
              <span class="ml-2 font-medium text-sm">Members</span>
            </div>
          </router-link> -->
        </div>
      </div>
    </nav>

    <!-- User Profile Section -->
    <div class="p-4 mt-auto border-t border-gray-50">
      <div class="relative">
        <button 
          class="w-full flex items-center p-2 rounded-xl hover:bg-gray-50 transition-colors duration-200"
          @click="showDropdown = !showDropdown"
        >
          <div class="w-9 h-9 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden shrink-0 flex items-center justify-center">
            <UserCircle class="w-5 h-5 text-gray-600" />
          </div>
          <div 
            class="ml-3 transition-all duration-300 overflow-hidden"
            :class="isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0'"
          >
            <div class="font-medium text-gray-900">{{ authStore.user?.name || 'User' }}</div>
            <div class="text-xs text-gray-500">{{ authStore.user?.is_admin ? 'Administrator' : 'Team Member' }}</div>
          </div>
        </button>

        <!-- Dropdown -->
        <div 
          v-if="showDropdown && isExpanded"
          class="absolute bottom-full left-0 w-full mb-2 bg-white rounded-xl shadow-lg border border-gray-100 py-1"
        >
          <button 
            class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
            @click="handleProfile"
          >
            <Settings class="w-4 h-4 mr-2" />
            Settings
          </button>
          <button 
            class="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center"
            @click="handleLogout"
          >
            <LogOut class="w-4 h-4 mr-2" />
            Logout
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import packageJson from '../../package.json'

import { 
  LayoutDashboard, 
  FolderGit2, 
  CheckSquare, 
  BarChart3, 
  Users,
  Users2,
  User,
  UserCircle,
  Settings,
  Briefcase,
  LogOut,
  ChevronDown,
  ClipboardList,
  ClipboardCheck,
  Calendar,
  Megaphone,
  Clock,
  ListTodo,
  BarChart,
  PinIcon,
  PinOffIcon
} from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()
// Mengubah nilai default isExpanded menjadi true agar menu terbuka by default
const showDropdown = ref(false)
const version = packageJson.version

const isPinned = ref(false)
const isExpanded = ref(isPinned.value)
const togglePin = () => {
  isPinned.value = !isPinned.value
  // When pinned, sidebar should stay expanded
  isExpanded.value = isPinned.value
  // Store preference in localStorage to persist across sessions
  localStorage.setItem('sidebarPinned', isPinned.value.toString())
}


// Task Management menu state
// Default menu terbuka
const showTaskSubMenu = ref(false)
const isTaskActive = computed(() => {
  const path = router.currentRoute.value.path
  return path.includes('/tasks') || path.includes('/team/tasks')
})

// Marketing menu state
// Default menu terbuka
const showMarketingSubMenu = ref(true)
const isMarketingActive = computed(() => {
  const path = router.currentRoute.value.path
  return path.includes('/marketing')
})

// Team Management menu state
// Default menu terbuka
const showTeamSubMenu = ref(true)
const isTeamActive = computed(() => {
  const path = router.currentRoute.value.path
  return path.includes('/team') || path.includes('/tasks')
})

// BAU menu state for Marketing
// Default menu terbuka
const showBAUSubMenu = ref(false)
const isBAUActive = computed(() => {
  const path = router.currentRoute.value.path
  return path.includes('/marketing/bau')
})

// BAU menu state for Team
// Default menu terbuka
const showTeamBAUSubMenu = ref(false)
const isTeamBAUActive = computed(() => {
  const path = router.currentRoute.value.path
  return path.includes('/team/bau')
})

// Toggle Task Management menu
const toggleTaskMenu = () => {
  if (isExpanded.value) {
    showTaskSubMenu.value = !showTaskSubMenu.value
  } else {
    isExpanded.value = true
    showTaskSubMenu.value = true
  }
}

// Toggle Marketing menu
const toggleMarketingMenu = () => {
  if (isExpanded.value) {
    showMarketingSubMenu.value = !showMarketingSubMenu.value
  } else {
    isExpanded.value = true
    showMarketingSubMenu.value = true
  }
}

// Toggle Team menu
const toggleTeamMenu = () => {
  if (isExpanded.value) {
    showTeamSubMenu.value = !showTeamSubMenu.value
  } else {
    isExpanded.value = true
    showTeamSubMenu.value = true
  }
}

// Toggle BAU submenu for Marketing
const toggleBAUMenu = () => {
  showBAUSubMenu.value = !showBAUSubMenu.value
}

// Toggle BAU submenu for Team
const toggleTeamBAUMenu = () => {
  showTeamBAUSubMenu.value = !showTeamBAUSubMenu.value
}

const handleProfile = () => {
  showDropdown.value = false
  router.push('/profile')
}

const handleLogout = async () => {
  try {
    await authStore.logout()
    router.push('/login')
  } catch (error) {
    console.error('Logout failed:', error)
  }
}

// Close dropdown when clicking outside
const closeDropdown = (e) => {
  if (showDropdown.value && !e.target.closest('.relative')) {
    showDropdown.value = false
  }
}

// Lifecycle hooks
onMounted(() => {
  document.addEventListener('click', closeDropdown)
  
  // Secara otomatis menemukan section aktif dan memastikan menu tetap terbuka
  const path = router.currentRoute.value.path
  if (path.includes('/tasks') || path.includes('/team/tasks')) {
    showTeamSubMenu.value = true
    showTaskSubMenu.value = true
  } else if (path.includes('/team/bau')) {
    showTeamSubMenu.value = true
    showTeamBAUSubMenu.value = true
  } else if (path.includes('/marketing/bau')) {
    showMarketingSubMenu.value = true
    showBAUSubMenu.value = true
  } else if (path.includes('/team')) {
    showTeamSubMenu.value = true
  } else if (path.includes('/marketing')) {
    showMarketingSubMenu.value = true
  }
  
  // Load pinned state from localStorage
  const savedPinState = localStorage.getItem('sidebarPinned')
  if (savedPinState !== null) {
    isPinned.value = savedPinState === 'true'
    // Set isExpanded to match isPinned state on load
    isExpanded.value = isPinned.value
  }
})


onUnmounted(() => {
  document.removeEventListener('click', closeDropdown)
})
</script>

<style scoped>
.router-link-active {
  background-color: inherit;
}
.absolute {
  transition: all 0.2s ease-in-out;
}
/* Optional: Add hover effect for dropdown items */
.dropdown-item {
  transition: all 0.2s ease-in-out;
}
.dropdown-item:hover {
  background-color: #F3F4F6;
}
/* Hover expand behavior only applies when not pinned */
.hover-expand {
  transition-delay: 0s;
}
.hover-expand:not(:hover) {
  transition-delay: 0.3s;
}
</style>