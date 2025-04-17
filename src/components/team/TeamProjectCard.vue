<!-- src/components/team/TeamProjectCard.vue -->
<template>
  <div 
    class="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow transition-all duration-150 h-full flex flex-col"
    :class="{
      'border-dashed opacity-75': !project.active,
      'border-l-4 border-l-red-500': project.priority === '3',
      'border-l-4 border-l-orange-500': project.priority === '2'
    }"
    @click="$emit('click')"
  >
    <!-- Card Header -->
    <div class="p-4 pb-3 flex-none">
      <div class="flex items-center justify-between mb-2">
        <!-- Project Code with Archive Icon -->
        <div class="text-xs text-gray-500 flex items-center">
          <ArchiveBoxIcon v-if="!project.active" class="h-3.5 w-3.5 mr-1 text-gray-500" />
          {{ project.code }}
        </div>
        
        <div class="flex items-center space-x-2">
          <!-- Priority Badge -->
          <div 
            v-if="project.priority"
            class="px-2 py-0.5 text-xs font-medium rounded"
            :class="getPriorityClass(project.priority)"
          >
            {{ formatPriority(project.priority) }}
          </div>
          
          <!-- Status Badge -->
          <div
            class="px-2.5 py-1 text-xs font-medium rounded-md"
            :class="getStatusClass(project.state)"
          >
            {{ formatState(project.state) }}
          </div>
        </div>
      </div>
      
      <!-- Project Title -->
      <h3 class="text-base font-semibold text-gray-900 line-clamp-2 mb-2.5">{{ project.name }}</h3>
      
      <!-- Departments - Modified for multiple departments -->
      <div class="flex flex-wrap gap-1.5">
        <div 
          v-for="dept in projectDepartments" 
          :key="dept.id"
          class="inline-flex items-center py-1 px-2 rounded-md text-xs font-medium"
          :class="getDepartmentClass(dept.id)"
        >
          <component 
            :is="getDepartmentIcon(dept.name)" 
            class="h-3.5 w-3.5 mr-1.5"
          />
          {{ dept.name }}
        </div>
      </div>
    </div>

    <!-- Card Body -->
    <div class="px-4 pt-2 pb-3 flex-grow border-t border-gray-100">
      <!-- Progress Section -->
      <div class="mb-3.5">
        <div class="flex justify-between items-center text-xs mb-1.5">
          <span class="text-gray-600">Overall Progress</span>
          <span class="font-medium">{{ project.progress }}%</span>
        </div>
        <div class="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
          <div 
            class="h-1.5 rounded-full"
            :class="getProgressColorClass(project.progress)"
            :style="{ width: `${project.progress}%` }"
          ></div>
        </div>
      </div>

      <!-- Dates Section -->
      <div class="grid grid-cols-2 gap-2 text-xs mb-3">
        <div>
          <div class="text-gray-500 mb-0.5">Start:</div>
          <div class="font-medium">{{ formatDate(project.dates.start) }}</div>
        </div>
        <div>
          <div class="text-gray-500 mb-0.5">End:</div>
          <div class="font-medium" :class="{ 'text-red-600': isOverdue(project.dates.end) }">
            {{ formatDate(project.dates.end) }}
          </div>
        </div>
      </div>
    </div>

    <!-- Card Footer -->
    <div class="px-4 py-3 flex-none border-t border-gray-100 bg-gray-50 rounded-b-lg">
      <div class="flex items-center justify-between">
        <!-- Task Count -->
        <div class="flex items-center text-xs">
          <DocumentTextIcon class="h-4 w-4 text-gray-500 mr-1.5" />
          <span>{{ project.task_count || 0 }} tasks</span>
        </div>
        
        <!-- Team Members -->
        <div class="flex items-center">
          <!-- Team Icons -->
          <div class="flex -space-x-2 mr-3">
            <div 
              class="h-6 w-6 rounded-full ring-2 ring-white flex items-center justify-center text-xs font-medium"
              :class="getDepartmentAvatarClass(mainDepartmentId)"
            >
              {{ getInitials(project.team?.manager?.name) }}
            </div>
            <div 
              v-for="(member, index) in displayMembers" 
              :key="index"
              class="h-6 w-6 rounded-full bg-gray-100 ring-2 ring-white flex items-center justify-center text-xs font-medium text-gray-700"
            >
              {{ getInitials(member.name) }}
            </div>
            <div
              v-if="extraMembersCount > 0"
              class="h-6 w-6 rounded-full bg-gray-200 ring-2 ring-white flex items-center justify-center text-xs font-medium text-gray-700"
            >
              +{{ extraMembersCount }}
            </div>
          </div>
          
          <!-- Actions Button -->
          <div class="relative" ref="actionsMenuRef">
            <button 
              class="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
              @click.stop="toggleActionsMenu"
            >
              <EllipsisVerticalIcon class="h-4 w-4" />
            </button>
            
            <!-- Actions Menu Dropdown -->
            <div 
              v-if="showActionsMenu" 
              class="absolute right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-10 w-48"
              style="top: 100%"
            >
              <div class="py-1">
                <div class="px-3 py-1.5 text-xs font-medium text-gray-500 bg-gray-50">Change Status</div>
                <button 
                  v-for="status in availableStatuses"
                  :key="status.value"
                  class="w-full px-3 py-1.5 text-left text-sm hover:bg-gray-50 flex items-center"
                  :class="{ 'font-medium': status.value === project.state }"
                  @click.stop="changeStatus(status.value)"
                >
                  <span 
                    class="w-2 h-2 rounded-full mr-2"
                    :class="getStatusDotClass(status.value)"
                  ></span>
                  {{ status.label }}
                </button>
                
                <div class="border-t border-gray-100 mt-1"></div>
                <button 
                  class="w-full px-3 py-1.5 text-left text-sm hover:bg-gray-50 flex items-center"
                  @click.stop="$emit('view-details', project.id)"
                >
                  <EyeIcon class="h-3.5 w-3.5 mr-2 text-gray-500" />
                  View Details
                </button>
                
                <!-- Add Toggle Archive Option -->
                <button 
                  class="w-full px-3 py-1.5 text-left text-sm hover:bg-gray-50 flex items-center"
                  @click.stop="toggleArchive"
                >
                  <ArchiveBoxIcon v-if="project.active" class="h-3.5 w-3.5 mr-2 text-gray-500" />
                  <ArchiveBoxArrowDownIcon v-else class="h-3.5 w-3.5 mr-2 text-gray-500" />
                  {{ project.active ? 'Archive Project' : 'Unarchive Project' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { format, isPast } from 'date-fns'
import { 
  EllipsisVerticalIcon,
  EyeIcon,
  UserIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon,
  CodeBracketIcon,
  ServerIcon,
  CogIcon,
  MegaphoneIcon,
  WrenchIcon,
  PhoneIcon,
  BeakerIcon,
  ShoppingCartIcon,
  BuildingOfficeIcon,
  DocumentTextIcon,
  SparklesIcon,
  ArchiveBoxIcon,
  ArchiveBoxArrowDownIcon
} from '@heroicons/vue/24/outline'

const props = defineProps({
  project: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['click', 'status-change', 'view-details', 'toggle-archive'])

// State variables
const actionsMenuRef = ref(null)
const showActionsMenu = ref(false)

// Computed for departments - handle both old and new API formats
const projectDepartments = computed(() => {
  // New format with multiple departments
  if (props.project.departments && Array.isArray(props.project.departments)) {
    return props.project.departments;
  }
  
  // Fallback to old format with single department
  if (props.project.department) {
    return [props.project.department];
  }
  
  return [];
})

// Compute main department ID for styling
const mainDepartmentId = computed(() => {
  if (projectDepartments.value.length > 0) {
    return projectDepartments.value[0].id;
  }
  return 1; // fallback
})

// Only show first 2 team members
const displayMembers = computed(() => {
  if (!props.project.team?.members) return []
  return props.project.team.members.slice(0, 2)
})

const extraMembersCount = computed(() => {
  if (!props.project.team?.members) return 0
  return Math.max(0, props.project.team.members.length - 2)
})

// Status formatting and classes
const availableStatuses = [
  { value: 'draft', label: 'Draft' },
  { value: 'planning', label: 'Planning' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'on_hold', label: 'On Hold' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' }
]

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

const getStatusClass = (state) => {
  const classes = {
    'draft': 'bg-gray-100 text-gray-700',
    'planning': 'bg-indigo-50 text-indigo-700',
    'in_progress': 'bg-yellow-50 text-yellow-700',
    'on_hold': 'bg-amber-50 text-amber-700',
    'completed': 'bg-green-50 text-green-700', 
    'cancelled': 'bg-red-50 text-red-700'
  }
  return classes[state] || 'bg-gray-100 text-gray-700'
}

const getStatusDotClass = (state) => {
  const classes = {
    'draft': 'bg-gray-500',
    'planning': 'bg-indigo-500',
    'in_progress': 'bg-yellow-500',
    'on_hold': 'bg-amber-500',
    'completed': 'bg-green-500',
    'cancelled': 'bg-red-500'
  }
  return classes[state] || 'bg-gray-500'
}

// Progress bar color class
const getProgressColorClass = (progress) => {
  if (progress >= 75) return 'bg-green-500';
  if (progress >= 25) return 'bg-yellow-500';
  return 'bg-red-500';
}

// Department styling
const getDepartmentClass = (departmentId) => {
  // Consistent text color with subtle background variations
  const classes = [
    'bg-blue-50 text-blue-700',
    'bg-purple-50 text-purple-700',
    'bg-green-50 text-green-700',
    'bg-pink-50 text-pink-700',
    'bg-indigo-50 text-indigo-700',
    'bg-teal-50 text-teal-700',
    'bg-amber-50 text-amber-700',
    'bg-rose-50 text-rose-700',
    'bg-emerald-50 text-emerald-700',
    'bg-cyan-50 text-cyan-700',
    'bg-orange-50 text-orange-700',
    'bg-lime-50 text-lime-700'
  ]
  
  const index = (departmentId % classes.length)
  return classes[index]
}

// Department progress bar class (not used anymore, using progress-based color instead)
const getDepartmentProgressClass = (departmentId) => {
  const classes = [
    'bg-blue-500',
    'bg-purple-500',
    'bg-green-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-teal-500',
    'bg-amber-500',
    'bg-rose-500',
    'bg-emerald-500',
    'bg-cyan-500',
    'bg-orange-500',
    'bg-lime-500'
  ]
  
  const index = (departmentId % classes.length)
  return classes[index]
}

// Department avatar class
const getDepartmentAvatarClass = (departmentId) => {
  const classes = [
    'bg-blue-100 text-blue-800',
    'bg-purple-100 text-purple-800',
    'bg-green-100 text-green-800',
    'bg-pink-100 text-pink-800',
    'bg-indigo-100 text-indigo-800',
    'bg-teal-100 text-teal-800',
    'bg-amber-100 text-amber-800',
    'bg-rose-100 text-rose-800',
    'bg-emerald-100 text-emerald-800',
    'bg-cyan-100 text-cyan-800',
    'bg-orange-100 text-orange-800',
    'bg-lime-100 text-lime-800'
  ]
  
  const index = (departmentId % classes.length)
  return classes[index]
}

// Get department icon based on department name
const getDepartmentIcon = (departmentName) => {
  if (!departmentName) return UserIcon
  
  const name = departmentName.toLowerCase()
  
  if (name.includes('admin')) return BuildingOfficeIcon
  if (name.includes('customer') || name.includes('support')) return PhoneIcon
  if (name.includes('finance')) return CurrencyDollarIcon
  if (name.includes('hr') || name.includes('human')) return UserIcon
  if (name.includes('it') && name.includes('dev')) return CodeBracketIcon
  if (name.includes('it')) return ServerIcon
  if (name.includes('kaizen')) return SparklesIcon
  if (name.includes('manage')) return UserGroupIcon
  if (name.includes('market')) return MegaphoneIcon
  if (name.includes('mechanic')) return WrenchIcon
  if (name.includes('part')) return ShoppingCartIcon
  if (name.includes('rnd') || name.includes('r&d') || name.includes('research')) return BeakerIcon
  if (name.includes('sales')) return ShoppingCartIcon
  
  // Default icon
  return CogIcon
}

// Date formatting
const formatDate = (date) => {
  if (!date) return '-'
  return format(new Date(date), 'd MMM yyyy')
}

// Priority formatting and classes
const formatPriority = (priority) => {
  const priorities = {
    '0': 'Low',
    '1': 'Medium',
    '2': 'High',
    '3': 'Critical'
  }
  return priorities[priority] || priority
}

const getPriorityClass = (priority) => {
  const classes = {
    '0': 'bg-blue-50 text-blue-700 border border-blue-200',
    '1': 'bg-green-50 text-green-700 border border-green-200',
    '2': 'bg-orange-50 text-orange-700 border border-orange-200',
    '3': 'bg-red-50 text-red-700 border border-red-200'
  }
  return classes[priority] || 'bg-gray-50 text-gray-700 border border-gray-200'
}

const isOverdue = (date) => {
  if (!date) return false
  return isPast(new Date(date)) && props.project.state !== 'completed'
}

// Utils
const getInitials = (name) => {
  if (!name) return ''
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

// Menu handling
const toggleActionsMenu = () => {
  showActionsMenu.value = !showActionsMenu.value
}

const changeStatus = (newStatus) => {
  if (newStatus !== props.project.state) {
    emit('status-change', props.project.id, newStatus)
  }
  showActionsMenu.value = false
}

// Toggle archive status
const toggleArchive = () => {
  emit('toggle-archive', props.project.id)
  showActionsMenu.value = false
}

// Close menu when clicked outside
const handleClickOutside = (event) => {
  if (actionsMenuRef.value && !actionsMenuRef.value.contains(event.target)) {
    showActionsMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside)
})
</script>