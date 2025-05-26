<!-- src/components/charts/ModernGanttChart.vue -->
<template>
  <div class="bg-white shadow rounded-lg overflow-hidden flex flex-col h-full">
    <!-- Header with controls -->
    <div class="p-4 border-b border-gray-200">
      <div class="flex flex-col space-y-3 md:flex-row md:items-center md:justify-between">
        <!-- Title with filter indicators -->
        <div class="flex flex-col">
          <h2 class="text-xl font-semibold text-gray-900">Task Timeline</h2>
          
          <!-- Active filters indication -->
          <div class="flex flex-wrap gap-2 mt-2 items-center text-sm text-gray-600">
            <span v-if="activeFiltersCount > 0" class="text-gray-500 text-xs">
              {{ activeFiltersCount }} filter(s) applied
            </span>
            <span v-else class="text-gray-500 text-xs">
              Showing all tasks
            </span>
          </div>
        </div>

        <!-- Controls -->
        <div class="flex flex-wrap gap-2 items-center">
          <!-- Time range navigation -->
          <div class="inline-flex items-center rounded-md shadow-sm">
            <button
              @click="moveTimelinePrev"
              class="px-2.5 py-1.5 border border-gray-300 rounded-l-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-red-500"
              title="Previous Period"
            >
              <ChevronLeftIcon class="h-4 w-4" />
            </button>
            <button
              @click="resetTimeline"
              class="px-3 py-1.5 border-t border-b border-gray-300 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-red-500"
              title="Reset to current period"
            >
              Today
            </button>
            <button
              @click="moveTimelineNext"
              class="px-2.5 py-1.5 border border-gray-300 rounded-r-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-red-500"
              title="Next Period"
            >
              <ChevronRightIcon class="h-4 w-4" />
            </button>
          </div>

          <!-- Time scale selector -->
          <div class="inline-flex rounded-md shadow-sm">
            <button
              @click="setViewMode('week')"
              class="px-3 py-1.5 text-sm font-medium rounded-l-md focus:outline-none focus:ring-1 focus:ring-red-500"
              :class="viewMode === 'week' ? 'bg-red-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'"
            >
              Week
            </button>
            <button
              @click="setViewMode('month')"
              class="px-3 py-1.5 text-sm font-medium rounded-r-md focus:outline-none focus:ring-1 focus:ring-red-500"
              :class="viewMode === 'month' ? 'bg-red-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'"
            >
              Month
            </button>
          </div>

          <!-- Zoom controls -->
          <div class="inline-flex rounded-md shadow-sm">
            <button
              @click="decreaseZoom"
              class="px-2.5 py-1.5 border border-gray-300 rounded-l-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-red-500 disabled:opacity-50"
              :disabled="zoomLevel <= minZoomLevel"
              title="Zoom Out"
            >
              <MinusIcon class="h-4 w-4" />
            </button>
            <span class="flex items-center justify-center px-2 border-t border-b border-gray-300 bg-white text-xs font-medium">
              {{ zoomLevel }}x
            </span>
            <button
              @click="increaseZoom"
              class="px-2.5 py-1.5 border border-gray-300 rounded-r-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-red-500 disabled:opacity-50"
              :disabled="zoomLevel >= maxZoomLevel"
              title="Zoom In"
            >
              <PlusIcon class="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Gantt Chart Container -->
    <div class="flex-grow overflow-hidden">
      <div class="gantt-wrapper">
        <!-- Headers (Fixed) -->
        <div class="gantt-headers">
          <!-- Left header -->
          <div class="project-header">
            <h3 class="font-medium text-gray-700 pb-2">Tasks</h3>
          </div>
          
          <!-- Right header (Timeline) -->
          <div class="timeline-header" ref="timelineHeader">
            <!-- Top-level time units (months or weeks) -->
            <div class="month-row">
              <div
                v-for="timeUnit in timeUnits.major"
                :key="timeUnit.key"
                class="month-cell"
                :style="{ width: `${timeUnit.width}px` }"
              >
                <span class="text-xs font-medium text-gray-700">{{ timeUnit.label }}</span>
              </div>
            </div>
            
            <!-- Detail time units (days) -->
            <div class="day-row">
              <div
                v-for="timeUnit in timeUnits.minor"
                :key="timeUnit.key"
                :class="[
                  'day-cell',
                  timeUnit.isWeekend ? 'weekend' : '',
                  timeUnit.isToday ? 'today' : ''
                ]"
                :style="{ width: `${getDayWidth()}px` }"
              >
                <span class="text-xs text-gray-500">{{ timeUnit.label }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Scrollable Content Area -->
        <div class="gantt-scrollable-content" @scroll="syncHeaderScroll" ref="scrollContainer">
          <!-- Tasks Grid -->
          <div class="gantt-grid">
            <!-- Left side: Task names -->
            <div class="project-names" ref="projectsList">
              <template v-for="(task, taskIndex) in displayedTasks" :key="task.id">
                <!-- Task Row -->
                <div 
                  :id="`task-row-${task.id}`"
                  class="task-row"
                  :data-row-id="task.id"
                  @click="selectTask(task)"
                >
                  <div class="task-row-content">
                    <!-- Priority indicator -->
                    <div class="priority-indicator" :class="getPriorityClass(task.priority)">
                      <FlagIcon class="h-3 w-3" />
                    </div>
                    
                    <!-- Status indicator -->
                    <div class="status-indicator" :class="getStatusClass(task.state)"></div>
                    
                    <!-- Task info -->
                    <div class="task-name-container">
                      <div class="task-name">{{ task.name }}</div>
                      <div class="project-name">{{ task.project?.name || 'No project' }}</div>
                    </div>
                    
                    <!-- Assigned users -->
                    <div v-if="task.assigned_to && task.assigned_to.length > 0" class="assigned-users-list">
                      <div 
                        v-for="(user, index) in task.assigned_to.slice(0, 2)" 
                        :key="index"
                        class="user-avatar"
                        :title="user.name"
                      >
                        <span>{{ getInitials(user.name) }}</span>
                      </div>
                      <div 
                        v-if="task.assigned_to.length > 2"
                        class="more-users"
                        :title="getRemainingUsersTitle(task.assigned_to, 2)"
                      >
                        <span>+{{ task.assigned_to.length - 2 }}</span>
                      </div>
                    </div>
                    
                    <!-- Progress -->
                    <div class="progress-container">
                      <div class="progress-bar-bg">
                        <div
                          class="progress-bar-fill" 
                          :class="getProgressColorClass(task.progress)"
                          :style="{ width: `${task.progress || 0}%` }"
                        ></div>
                      </div>
                      <div class="progress-text">{{ task.progress || 0 }}%</div>
                    </div>
                  </div>
                </div>
              </template>
              
              <!-- Empty state -->
              <div v-if="displayedTasks.length === 0" class="empty-tasks-row">
                <div class="empty-tasks-message">No tasks with dates found for timeline view</div>
              </div>
            </div>

            <!-- Right side: Timeline chart -->
            <div class="gantt-timeline" ref="timelineChart">
              <template v-for="(task, taskIndex) in displayedTasks" :key="task.id">
                <!-- Task Timeline Row -->
                <div 
                  :id="`task-timeline-row-${task.id}`"
                  class="task-timeline-row"
                  :data-row-id="task.id"
                >
                  <!-- Background grid -->
                  <div class="grid-background">
                    <template v-for="timeUnit in timeUnits.minor" :key="timeUnit.key">
                      <div
                        class="grid-cell"
                        :class="[
                          timeUnit.isWeekend ? 'weekend' : '',
                          timeUnit.isToday ? 'today' : ''
                        ]"
                        :style="{ 
                          left: `${getTimeUnitPosition(timeUnit)}px`,
                          width: `${getDayWidth()}px`
                        }"
                      ></div>
                    </template>
                  </div>
                  
                  <!-- Task Bar -->
                  <div
                    v-if="getBarPosition(task).width > 0"
                    class="timeline-bar task-bar"
                    :class="getTaskBarClass(task.state)"
                    :style="{
                      left: `${getBarPosition(task).left}px`,
                      width: `${getBarPosition(task).width}px`
                    }"
                    @click.stop="handleTaskClick(task)"
                    :title="getTaskTooltip(task)"
                  >
                    <!-- Progress fill -->
                    <div 
                      class="progress-fill"
                      :class="getProgressFillClass(task.state)"
                      :style="{ width: `${task.progress || 0}%` }"
                    ></div>
                      
                    <!-- Bar label -->
                    <div v-if="getBarPosition(task).width > 60" class="bar-label">
                      <span>{{ task.name }}</span>
                    </div>
                    
                    <!-- Priority badge -->
                    <div 
                      v-if="getBarPosition(task).width > 80"
                      class="priority-badge"
                      :class="getPriorityBadgeClass(task.priority)"
                    >
                      <FlagIcon class="h-3 w-3" />
                    </div>
                    
                    <!-- Assigned Users -->
                    <div 
                      v-if="task.assigned_to && task.assigned_to.length > 0 && getBarPosition(task).width > 120"
                      class="assigned-users"
                    >
                      <div 
                        v-for="(user, index) in task.assigned_to.slice(0, 3)" 
                        :key="index"
                        class="user-avatar"
                        :title="user.name"
                      >
                        <span>{{ getInitials(user.name) }}</span>
                      </div>
                      <div 
                        v-if="task.assigned_to.length > 3"
                        class="more-users"
                        :title="getRemainingUsersTitle(task.assigned_to, 3)"
                      >
                        <span>+{{ task.assigned_to.length - 3 }}</span>
                      </div>
                    </div>
                  </div>
                    
                  <!-- Today indicator -->
                  <div
                    v-if="isTodayVisible"
                    class="today-indicator"
                    :style="{ left: `${getTodayPosition()}px` }"
                  ></div>
                </div>
              </template>
              
              <!-- Empty state timeline -->
              <div v-if="displayedTasks.length === 0" class="empty-tasks-timeline-row"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Loading State -->
    <div 
      v-if="loading" 
      class="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-30"
    >
      <div class="flex flex-col items-center">
        <div class="animate-spin rounded-full h-10 w-10 border-2 border-red-600 border-t-transparent"></div>
        <p class="mt-2 text-sm text-gray-600">Loading timeline...</p>
      </div>
    </div>

    <!-- Empty State -->
    <div 
      v-if="!loading && displayedTasks.length === 0" 
      class="flex flex-col items-center justify-center p-10 flex-grow"
    >
      <CalendarIcon class="h-12 w-12 text-gray-400" />
      <h3 class="mt-2 text-sm font-medium text-gray-900">No tasks with dates found</h3>
      <p class="mt-1 text-sm text-gray-500">
        Tasks need at least a start or end date to appear in timeline view.
      </p>
      <p class="mt-2 text-xs text-gray-400">
        Total tasks available: {{ props.tasks.length }} | 
        Tasks with dates: {{ displayedTasks.length }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick, onUnmounted } from 'vue';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  MinusIcon, 
  PlusIcon, 
  CalendarIcon,
  FlagIcon
} from '@heroicons/vue/24/outline';
import { 
  format, 
  parseISO, 
  addDays, 
  subDays, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isWeekend, 
  isToday,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  addWeeks,
  subWeeks,
  differenceInDays,
  isWithinInterval
} from 'date-fns';

const props = defineProps({
  // Gunakan data yang sama dengan view lainnya
  tasks: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  // Filter yang sudah diterapkan
  activeFiltersCount: {
    type: Number,
    default: 0
  }
});

const emit = defineEmits([
  'view-task-detail',
  'edit-task'
]);

// State
const startDate = ref(new Date());
const viewMode = ref('month'); // 'week', 'month'
const zoomLevel = ref(1);
const minZoomLevel = ref(0.5);
const maxZoomLevel = ref(3);

// References
const scrollContainer = ref(null);
const timelineHeader = ref(null);
const projectsList = ref(null);
const timelineChart = ref(null);

// Filter dan transform tasks untuk timeline
const displayedTasks = computed(() => {
  console.log('Total tasks received:', props.tasks.length);
  
  const tasksWithDates = props.tasks.filter(task => {
    // Tampilkan task yang memiliki minimal salah satu tanggal
    // Atau bisa disesuaikan: hanya yang memiliki kedua tanggal
    const hasStartDate = task.dates?.planned_start;
    const hasEndDate = task.dates?.planned_end;
    
    // Opsi 1: Hanya yang memiliki kedua tanggal (lebih ketat)
    // return hasStartDate && hasEndDate;
    
    // Opsi 2: Yang memiliki minimal salah satu tanggal (lebih fleksibel)
    const hasAnyDate = hasStartDate || hasEndDate;
    
    if (!hasAnyDate) {
      console.log('Task without dates:', task.name);
    }
    
    return hasAnyDate;
  }).map(task => {
    // Transform untuk memudahkan penggunaan
    let startDate = null;
    let endDate = null;
    
    try {
      if (task.dates?.planned_start) {
        startDate = parseISO(task.dates.planned_start);
      }
      if (task.dates?.planned_end) {
        endDate = parseISO(task.dates.planned_end);
      }
      
      // Jika hanya ada satu tanggal, buat estimasi untuk yang lain
      if (startDate && !endDate) {
        // Jika hanya ada start date, buat end date 1 minggu kemudian
        endDate = addDays(startDate, 7);
      } else if (!startDate && endDate) {
        // Jika hanya ada end date, buat start date 1 minggu sebelumnya
        startDate = subDays(endDate, 7);
      }
    } catch (error) {
      console.error('Error parsing dates for task:', task.name, error);
    }
    
    return {
      ...task,
      start: startDate,
      end: endDate,
      startDate: task.dates?.planned_start,
      endDate: task.dates?.planned_end
    };
  });
  
  console.log('Tasks with dates for Gantt:', tasksWithDates.length);
  return tasksWithDates;
});

// Effective date range based on view mode
const effectiveDateRange = computed(() => {
  let rangeStart, rangeEnd;
  
  if (viewMode.value === 'month') {
    rangeStart = startOfMonth(startDate.value);
    rangeEnd = endOfMonth(startDate.value);
  } else { // week
    rangeStart = startOfWeek(startDate.value, { weekStartsOn: 1 });
    rangeEnd = endOfWeek(startDate.value, { weekStartsOn: 1 });
    // Extend to show 4 weeks for better view
    rangeEnd = addWeeks(rangeEnd, 3);
  }
  
  return { start: rangeStart, end: rangeEnd };
});

// Time units for the timeline display
const timeUnits = computed(() => {
  try {
    const rangeStart = effectiveDateRange.value.start;
    const rangeEnd = effectiveDateRange.value.end;
    
    if (!rangeStart || !rangeEnd) {
      return { major: [], minor: [] };
    }
    
    // Generate all days in the range
    const days = eachDayOfInterval({ start: rangeStart, end: rangeEnd });
    
    // Major time units (months)
    const majorUnits = [];
    let currentMonth = null;
    let currentMonthDays = 0;
    
    days.forEach((day, index) => {
      const month = format(day, 'yyyy-MM');
      
      if (month !== currentMonth || index === 0) {
        if (currentMonth && currentMonthDays > 0) {
          majorUnits[majorUnits.length - 1].width = currentMonthDays * getDayWidth();
        }
        
        currentMonth = month;
        currentMonthDays = 1;
        
        majorUnits.push({
          key: month,
          label: format(day, 'MMMM yyyy'),
          start: day,
          width: 0
        });
      } else {
        currentMonthDays++;
        
        if (index === days.length - 1) {
          majorUnits[majorUnits.length - 1].width = currentMonthDays * getDayWidth();
        }
      }
    });
    
    // Minor time units (days)
    const minorUnits = days.map(day => ({
      key: format(day, 'yyyy-MM-dd'),
      label: format(day, 'd'),
      date: day,
      isWeekend: isWeekend(day),
      isToday: isToday(day)
    }));
    
    return {
      major: majorUnits,
      minor: minorUnits
    };
  } catch (error) {
    console.error('Error generating time units:', error);
    return { major: [], minor: [] };
  }
});

// Check if today is visible
const isTodayVisible = computed(() => {
  const today = new Date();
  const viewRange = effectiveDateRange.value;
  return today >= viewRange.start && today <= viewRange.end;
});

// Timeline methods
function getDayWidth() {
  const baseDayWidth = 40;
  return baseDayWidth * zoomLevel.value;
}

function getTimeUnitPosition(timeUnit) {
  const viewStart = effectiveDateRange.value.start;
  const daysFromViewStart = differenceInDays(timeUnit.date, viewStart);
  return daysFromViewStart * getDayWidth();
}

function getBarPosition(task) {
  if (!task || !task.start || !task.end) {
    return { left: 0, width: 0 };
  }
  
  try {
    const viewStart = effectiveDateRange.value.start;
    const viewEnd = effectiveDateRange.value.end;
    
    const taskStart = task.start;
    const taskEnd = task.end;
    
    if (!taskStart || !taskEnd) {
      return { left: 0, width: 0 };
    }
    
    // If task is completely outside the view
    if (taskEnd < viewStart || taskStart > viewEnd) {
      return { left: 0, width: 0 };
    }
    
    // Calculate position
    const effectiveStart = taskStart < viewStart ? viewStart : taskStart;
    const daysFromViewStart = differenceInDays(effectiveStart, viewStart);
    const leftPosition = daysFromViewStart * getDayWidth();
    
    // Calculate width
    const effectiveEnd = taskEnd > viewEnd ? viewEnd : taskEnd;
    const taskDuration = differenceInDays(effectiveEnd, effectiveStart) + 1;
    const width = Math.max(taskDuration * getDayWidth(), getDayWidth() * 0.5);
    
    return { left: leftPosition, width: width };
  } catch (error) {
    console.error('Error calculating bar position:', error);
    return { left: 0, width: 0 };
  }
}

function getTodayPosition() {
  try {
    const today = new Date();
    const viewStart = effectiveDateRange.value.start;
    
    if (!viewStart) return 0;
    
    const daysFromViewStart = differenceInDays(today, viewStart);
    return Math.max(0, daysFromViewStart * getDayWidth());
  } catch (error) {
    console.error('Error calculating today position:', error);
    return 0;
  }
}

// Navigation methods
function moveTimelinePrev() {
  if (viewMode.value === 'month') {
    startDate.value = subMonths(startDate.value, 1);
  } else {
    startDate.value = subWeeks(startDate.value, 4);
  }
}

function moveTimelineNext() {
  if (viewMode.value === 'month') {
    startDate.value = addMonths(startDate.value, 1);
  } else {
    startDate.value = addWeeks(startDate.value, 4);
  }
}

function resetTimeline() {
  startDate.value = new Date();
}

function setViewMode(mode) {
  if (viewMode.value === mode) return;
  viewMode.value = mode;
}

// Zoom methods
function increaseZoom() {
  if (zoomLevel.value < maxZoomLevel.value) {
    zoomLevel.value += 0.25;
  }
}

function decreaseZoom() {
  if (zoomLevel.value > minZoomLevel.value) {
    zoomLevel.value -= 0.25;
  }
}

// Task interaction
function selectTask(task) {
  emit('view-task-detail', task);
}

function handleTaskClick(task) {
  emit('view-task-detail', task);
}

// Sync header scroll with content
function syncHeaderScroll(e) {
  const scrollLeft = e.target.scrollLeft;
  if (timelineHeader.value) {
    timelineHeader.value.scrollLeft = scrollLeft;
  }
}

// Helper methods
function getTaskTooltip(task) {
  let tooltip = `Task: ${task.name}\n`;
  
  if (task.project) {
    tooltip += `Project: ${task.project.name}\n`;
  }
  
  if (task.startDate) {
    tooltip += `Start: ${format(parseISO(task.startDate), 'MMM d, yyyy')}\n`;
  }
  
  if (task.endDate) {
    tooltip += `Due: ${format(parseISO(task.endDate), 'MMM d, yyyy')}\n`;
  }
  
  tooltip += `Progress: ${task.progress || 0}%\n`;
  tooltip += `Status: ${formatState(task.state)}\n`;
  tooltip += `Priority: ${formatPriority(task.priority)}`;
  
  if (task.assigned_to && task.assigned_to.length > 0) {
    tooltip += `\nAssigned to: ${task.assigned_to.map(u => u.name).join(', ')}`;
  }
  
  return tooltip;
}

function formatState(state) {
  const stateMap = {
    'draft': 'Draft',
    'planned': 'Planned',
    'in_progress': 'In Progress',
    'review': 'In Review',
    'done': 'Completed',
    'cancelled': 'Cancelled'
  };
  return stateMap[state] || state;
}

function formatPriority(priority) {
  const priorityMap = {
    '0': 'Low',
    '1': 'Medium', 
    '2': 'High',
    '3': 'Critical'
  };
  return priorityMap[priority] || 'Medium';
}

function getInitials(name) {
  if (!name) return '?';
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
}

function getRemainingUsersTitle(users, shown) {
  if (!users || users.length <= shown) return '';
  return users.slice(shown).map(u => u.name).join(', ');
}

function getStatusClass(state) {
  const classes = {
    'draft': 'bg-gray-400',
    'planned': 'bg-blue-400',
    'in_progress': 'bg-green-400',
    'review': 'bg-purple-400',
    'done': 'bg-indigo-400',
    'cancelled': 'bg-red-400'
  };
  return classes[state] || 'bg-gray-400';
}

function getPriorityClass(priority) {
  const classes = {
    '0': 'text-blue-500',
    '1': 'text-green-500',
    '2': 'text-yellow-500',
    '3': 'text-red-500'
  };
  return classes[priority] || 'text-green-500';
}

function getPriorityBadgeClass(priority) {
  const classes = {
    '0': 'bg-blue-100 text-blue-600',
    '1': 'bg-green-100 text-green-600',
    '2': 'bg-yellow-100 text-yellow-600',
    '3': 'bg-red-100 text-red-600'
  };
  return classes[priority] || 'bg-green-100 text-green-600';
}

function getTaskBarClass(state) {
  const classes = {
    'draft': 'bg-gray-50 border-gray-200 text-gray-700',
    'planned': 'bg-blue-50 border-blue-200 text-blue-700',
    'in_progress': 'bg-green-50 border-green-200 text-green-700',
    'review': 'bg-purple-50 border-purple-200 text-purple-700',
    'done': 'bg-indigo-50 border-indigo-200 text-indigo-700',
    'cancelled': 'bg-red-50 border-red-200 text-red-700'
  };
  return classes[state] || 'bg-gray-50 border-gray-200 text-gray-700';
}

function getProgressFillClass(state) {
  const baseClasses = {
    'draft': 'bg-gray-300',
    'planned': 'bg-blue-300',
    'in_progress': 'bg-green-300',
    'review': 'bg-purple-300',
    'done': 'bg-indigo-300',
    'cancelled': 'bg-red-300'
  };
  return baseClasses[state] || 'bg-gray-300';
}

function getProgressColorClass(progress) {
  if (progress >= 100) return 'bg-green-500';
  if (progress >= 75) return 'bg-green-400';
  if (progress >= 50) return 'bg-yellow-400';
  if (progress >= 25) return 'bg-orange-400';
  return 'bg-red-400';
}

// Synchronize row heights
function syncRowHeights() {
  nextTick(() => {
    displayedTasks.value.forEach(task => {
      const leftRow = document.getElementById(`task-row-${task.id}`);
      const rightRow = document.getElementById(`task-timeline-row-${task.id}`);
      
      if (leftRow && rightRow) {
        const height = Math.max(leftRow.scrollHeight, rightRow.scrollHeight, 48);
        leftRow.style.height = `${height}px`;
        rightRow.style.height = `${height}px`;
      }
    });
  });
}

// Lifecycle
onMounted(() => {
  syncRowHeights();
  
  // Watch for task changes
  watch(() => displayedTasks.value, () => {
    syncRowHeights();
  }, { deep: true });
});

onUnmounted(() => {
  // Cleanup if needed
});
</script>

<style scoped>
/* Struktur dasar menggunakan styling yang sama dengan ProjectGanttChart */
.gantt-wrapper {
  position: relative;
  height: calc(100vh - 180px); /* Dikurangi dari 250px ke 180px untuk lebih tinggi */
  min-height: 600px; /* Ditingkatkan dari 500px ke 600px */
  width: 100%;
  min-width: 1000px;
  overflow: hidden;
}

/* Headers - fixed di bagian atas */
.gantt-headers {
  position: sticky;
  top: 0;
  z-index: 20;
  display: flex;
  background-color: white;
  height: 64px;
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.project-header {
  width: 320px;
  min-width: 320px;
  padding: 0 16px;
  display: flex;
  align-items: flex-end;
  background-color: #f8fafc;
  border-right: 1px solid #e2e8f0;
  padding-bottom: 8px;
  flex-shrink: 0;
}

.project-header h3 {
  color: #334155;
  font-weight: 600;
  font-size: 0.875rem;
}

/* Medium screens */
@media (min-width: 768px) {
  .project-header {
    width: 380px;
    min-width: 380px;
  }
}

/* Large screens */
@media (min-width: 1024px) {
  .project-header {
    width: 420px;
    min-width: 420px;
  }
}

/* Extra large screens */
@media (min-width: 1280px) {
  .project-header {
    width: 480px;
    min-width: 480px;
  }
}

.timeline-header {
  flex: 1;
  background-color: #f8fafc;
  overflow: hidden;
}

.month-row {
  display: flex;
  height: 32px;
  border-bottom: 1px solid #e2e8f0;
  background-color: white;
}

.month-cell {
  height: 100%;
  border-right: 1px solid #cbd5e1;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
}

.month-cell span {
  color: #475569;
  font-weight: 600;
}

.day-row {
  display: flex;
  height: 32px;
  background-color: #f8fafc;
}

.day-cell {
  height: 100%;
  border-right: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8fafc;
}

.day-cell span {
  color: #64748b;
}

.day-cell.weekend {
  background-color: #f1f5f9;
}

.day-cell.today {
  background-color: #fef2f2;
  color: #dc2626;
  font-weight: 600;
}

/* Scrollable container */
.gantt-scrollable-content {
  flex: 1;
  overflow: auto;
  position: relative;
  background-color: white;
}

/* Table structure */
.gantt-grid {
  display: flex;
  min-height: 100%;
}

/* Projects list (left panel) */
.project-names {
  width: 320px;
  min-width: 320px;
  background-color: white;
  border-right: 1px solid #e2e8f0;
  position: sticky;
  left: 0;
  z-index: 10;
  flex-shrink: 0;
}

/* Medium screens */
@media (min-width: 768px) {
  .project-names {
    width: 380px;
    min-width: 380px;
  }
}

/* Large screens */
@media (min-width: 1024px) {
  .project-names {
    width: 420px;
    min-width: 420px;
  }
}

/* Extra large screens */
@media (min-width: 1280px) {
  .project-names {
    width: 480px;
    min-width: 480px;
  }
}

/* Timeline chart */
.gantt-timeline {
  flex: 1;
  background-color: white;
}

/* Row styling */
.task-row {
  min-height: 48px;
  height: auto;
  position: relative;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  align-items: stretch;
  background-color: white;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.task-row:hover {
  background-color: #f8fafc;
}

.task-row-content {
  width: 100%;
  min-height: 48px;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.task-timeline-row {
  min-height: 48px;
  height: auto;
  position: relative;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  align-items: stretch;
}

.empty-tasks-row {
  background-color: #fafbfc;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
}

.empty-tasks-message {
  font-style: italic;
  color: #94a3b8;
  font-size: 0.875rem;
}

/* Content elements */
.priority-indicator {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.15s ease;
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

/* Text containers */
.task-name-container {
  flex-grow: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.task-name {
  font-weight: 600;
  color: #1e293b;
  line-height: 1.4;
  font-size: 0.875rem;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.project-name {
  font-size: 0.75rem;
  color: #64748b;
  line-height: 1.2;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

/* Responsive text handling */
@media (max-width: 767px) {
  .task-name,
  .project-name {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

@media (min-width: 768px) {
  .task-name,
  .project-name {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    max-height: 2.8em;
  }
}

@media (min-width: 1024px) {
  .task-name,
  .project-name {
    -webkit-line-clamp: 3;
    max-height: 4.2em;
  }
}

/* Assigned users list */
.assigned-users-list {
  display: flex;
  gap: -4px;
  margin-right: 8px;
}

.user-avatar {
  height: 24px;
  width: 24px;
  border-radius: 50%;
  background-color: #f1f5f9;
  border: 1px solid white;
  margin-left: -4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.625rem;
  font-weight: 600;
  color: #475569;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.more-users {
  height: 24px;
  width: 24px;
  border-radius: 50%;
  background-color: #e2e8f0;
  border: 1px solid white;
  font-size: 0.625rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #475569;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* Progress container */
.progress-container {
  width: 48px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.progress-bar-bg {
  width: 100%;
  height: 6px;
  background-color: #e2e8f0;
  border-radius: 999px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  border-radius: 999px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 0.75rem;
  text-align: center;
  color: #64748b;
  margin-top: 2px;
  white-space: nowrap;
  font-weight: 500;
}

/* Timeline elements */
.grid-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.grid-cell {
  position: absolute;
  top: 0;
  bottom: 0;
  border-right: 1px solid #f1f5f9;
}

.grid-cell.weekend {
  background-color: #f8fafc;
}

.grid-cell.today {
  background-color: #fef2f2;
}

/* Timeline bars */
.timeline-bar {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  height: 28px;
  border-radius: 0.375rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  cursor: pointer;
  z-index: 10;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  border: 1px solid;
}

.timeline-bar:hover {
  transform: translateY(-50%) scale(1.02);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Task bar colors */
.task-bar.draft { 
  background-color: #fafbfc; 
  border-color: #e2e8f0; 
  color: #64748b; 
}
.task-bar.planned { 
  background-color: #f0f9ff; 
  border-color: #bae6fd; 
  color: #0369a1; 
}
.task-bar.in_progress { 
  background-color: #ecfdf5; 
  border-color: #bbf7d0; 
  color: #15803d; 
}
.task-bar.review { 
  background-color: #faf5ff; 
  border-color: #ddd6fe; 
  color: #7c3aed; 
}
.task-bar.done { 
  background-color: #eef2ff; 
  border-color: #c7d2fe; 
  color: #4338ca; 
}
.task-bar.cancelled { 
  background-color: #fef2f2; 
  border-color: #fecaca; 
  color: #dc2626; 
}

/* Progress fill */
.progress-fill {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  opacity: 0.6;
  transition: width 0.3s ease;
}

/* Bar labels */
.bar-label {
  position: relative;
  z-index: 10;
  padding: 0 8px;
  height: 100%;
  display: flex;
  align-items: center;
  width: 100%;
}

.bar-label span {
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1.2;
  color: inherit;
}

@media (max-width: 1023px) {
  .bar-label span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

@media (min-width: 1024px) {
  .bar-label span {
    word-wrap: break-word;
    overflow-wrap: break-word;
  }
}

/* Priority badge on timeline bar */
.priority-badge {
  position: absolute;
  top: -6px;
  left: 6px;
  padding: 2px 4px;
  border-radius: 4px;
  font-size: 0.625rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 2px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* Assigned users on timeline bar */
.assigned-users {
  position: absolute;
  bottom: -6px;
  right: 6px;
  display: flex;
  gap: -4px;
}

.assigned-users .user-avatar {
  height: 20px;
  width: 20px;
  font-size: 0.625rem;
  border: 2px solid white;
  margin-left: -4px;
}

.assigned-users .more-users {
  height: 20px;
  width: 20px;
  font-size: 0.625rem;
  border: 2px solid white;
}

/* Today indicator dengan z-index yang tepat */
.today-indicator {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 2px;
  background-color: #dc2626;
  z-index: 5; /* Lebih rendah dari timeline bar (10) dan header (20) */
  box-shadow: 0 0 4px rgba(220, 38, 38, 0.5);
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.today-indicator {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Row alternating colors */
.task-timeline-row:nth-child(odd) {
  background-color: #fafbfc;
}

/* Hover effects */
.task-row:hover {
  background-color: #f1f5f9;
}

/* Empty states */
.empty-tasks-timeline-row {
  min-height: 48px;
  background-color: #fafbfc;
  border-bottom: 1px solid #f1f5f9;
}

/* Scrollbar styling */
.gantt-scrollable-content::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.gantt-scrollable-content::-webkit-scrollbar-track {
  background-color: #f8fafc;
  border-radius: 4px;
}

.gantt-scrollable-content::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 4px;
  border: 1px solid #f8fafc;
}

.gantt-scrollable-content::-webkit-scrollbar-thumb:hover {
  background-color: #94a3b8;
}

.gantt-scrollable-content::-webkit-scrollbar-corner {
  background-color: #f8fafc;
}

/* Loading and animations */
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  .timeline-bar,
  .progress-bar-fill,
  .priority-indicator,
  .today-indicator {
    transition: none;
    animation: none;
  }
}

/* Focus states */
.task-row:focus,
.timeline-bar:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}
</style>