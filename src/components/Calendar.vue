<!-- TaskCalendar.vue - Standalone Calendar Component for Task Manager -->
<template>
  <div class="bg-white shadow rounded-lg overflow-hidden">
    <!-- Calendar Header -->
    <div class="p-4 border-b border-gray-200">
      <div class="flex justify-between items-center">
        <!-- Navigation controls -->
        <div class="flex space-x-2">
          <button @click="navigationHandler(-1)" class="p-1 rounded border border-gray-300 hover:bg-gray-100">
            <ChevronLeftIcon class="h-5 w-5 text-gray-700" />
          </button>
          <button @click="navigationHandler(1)" class="p-1 rounded border border-gray-300 hover:bg-gray-100">
            <ChevronRightIcon class="h-5 w-5 text-gray-700" />
          </button>
          <button @click="goToToday" class="px-3 py-1 ml-1 rounded border border-gray-300 hover:bg-gray-100 text-sm font-medium">
            Today
          </button>
        </div>
        
        <!-- Current Month/Year -->
        <h2 class="text-lg font-semibold text-gray-900">
          {{ currentView === 'month' ? `${currentMonthName} ${currentYear}` : currentDateRange }}
        </h2>
        
        <!-- View switcher -->
        <div class="flex space-x-2">
          <button 
            @click="currentView = 'month'"
            class="px-3 py-1 text-sm font-medium rounded"
            :class="currentView === 'month' ? 'bg-red-600 text-white' : 'text-gray-700 bg-gray-100 hover:bg-gray-200'"
          >
            Month
          </button>
          <button 
            @click="currentView = 'week'"
            class="px-3 py-1 text-sm font-medium rounded"
            :class="currentView === 'week' ? 'bg-red-600 text-white' : 'text-gray-700 bg-gray-100 hover:bg-gray-200'"
          >
            Week
          </button>
          <button 
            @click="currentView = 'day'"
            class="px-3 py-1 text-sm font-medium rounded"
            :class="currentView === 'day' ? 'bg-red-600 text-white' : 'text-gray-700 bg-gray-100 hover:bg-gray-200'"
          >
            Day
          </button>
        </div>
      </div>
    </div>
    
    <!-- Month View -->
    <div v-if="currentView === 'month'" class="p-4">
      <!-- Days of Week Header -->
      <div class="grid grid-cols-7 gap-px mb-2">
        <div 
          v-for="day in daysOfWeek" 
          :key="day" 
          class="text-center p-2 font-medium text-gray-700"
          :class="{'text-red-500': day === 'Sun'}"
        >
          {{ day }}
        </div>
      </div>
      
      <!-- Calendar Grid -->
      <div class="grid grid-cols-7 gap-px bg-gray-200">
        <div 
          v-for="(day, index) in calendarDays" 
          :key="index"
          class="min-h-32 bg-white p-1 relative"
          :class="[
            day.isCurrentMonth ? '' : 'bg-gray-50',
            day.isToday ? 'ring-2 ring-inset ring-red-500' : '',
            day.isWeekend ? 'bg-gray-50' : ''
          ]"
        >
          <!-- Date Display -->
          <div class="flex justify-between items-center mb-1">
            <span 
              class="inline-flex items-center justify-center w-6 h-6 text-sm"
              :class="[
                day.isCurrentMonth ? 'text-gray-900' : 'text-gray-400',
                day.isToday ? 'bg-red-500 text-white rounded-full font-bold' : ''
              ]"
            >
              {{ day.date.getDate() }}
            </span>
            
            <!-- Add task button -->
            <button 
              v-if="day.isCurrentMonth"
              @click.stop="addTaskForDate(day.date)"
              class="h-5 w-5 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center"
              title="Add task for this day"
            >
              <PlusIcon class="h-3 w-3 text-gray-700" />
            </button>
          </div>
          
          <!-- Tasks for this day -->
          <div class="space-y-1 overflow-y-auto max-h-28">
            <div
              v-for="task in getTasksForDay(day.date)"
              :key="task.id"
              @click.stop="selectTask(task.id)"
              class="p-1 text-xs rounded cursor-pointer truncate"
              :class="getStatusClass(task.state)"
            >
              {{ task.name }}
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Week View -->
    <div v-else-if="currentView === 'week'" class="p-4">
      <div class="grid grid-cols-7 gap-px">
        <!-- Days of week with dates -->
        <div 
          v-for="day in weekViewDays" 
          :key="day.date"
          class="text-center p-2 font-medium"
          :class="[
            day.isToday ? 'bg-red-50 text-red-700' : 'bg-gray-50 text-gray-700',
            day.isWeekend ? 'text-gray-500' : ''
          ]"
        >
          <div>{{ day.name }}</div>
          <div 
            class="text-sm rounded-full w-6 h-6 mx-auto flex items-center justify-center"
            :class="day.isToday ? 'bg-red-500 text-white' : ''"
          >
            {{ format(day.date, 'd') }}
          </div>
        </div>
        
        <!-- All-day events -->
        <div class="col-span-7 mt-1 border-b border-gray-200 pb-2">
          <div class="flex justify-between items-center px-2">
            <span class="text-xs font-medium text-gray-500">All-day events</span>
            <span class="text-xs text-gray-400">{{ allDayTasks.length }} task(s)</span>
          </div>
          <div class="mt-1 space-y-1 max-h-20 overflow-y-auto px-2">
            <div
              v-for="task in allDayTasks"
              :key="task.id"
              @click="selectTask(task.id)"
              class="p-1 text-xs rounded cursor-pointer flex justify-between items-center"
              :class="getStatusClass(task.state)"
            >
              <span class="truncate">{{ task.name }}</span>
              <span 
                class="text-xs ml-1 px-1 py-0.5 rounded-full bg-white bg-opacity-50"
                :class="getTextColorClass(task.state)"
              >
                {{ formatStatus(task.state) }}
              </span>
            </div>
          </div>
        </div>
        
        <!-- Time slots -->
        <div class="col-span-7 grid grid-cols-7 gap-px">
          <div 
            v-for="day in weekViewDays" 
            :key="day.date"
            class="border border-gray-200 min-h-96 relative"
            :class="[
              day.isToday ? 'bg-red-50 bg-opacity-20' : 'bg-white',
              day.isWeekend ? 'bg-gray-50 bg-opacity-30' : ''
            ]"
          >
            <!-- Task items -->
            <div class="p-2 space-y-2">
              <div
                v-for="task in getTasksForDay(day.date)"
                :key="task.id"
                @click="selectTask(task.id)"
                class="p-2 text-xs rounded cursor-pointer border-l-4 hover:shadow"
                :class="[
                  getStatusClass(task.state),
                  getBorderColorClass(task.state)
                ]"
              >
                <div class="font-medium">{{ task.name }}</div>
                <div class="text-xs mt-1 flex justify-between">
                  <span class="text-gray-600">
                    {{ task.project?.name || 'No project' }}
                  </span>
                  <span 
                    class="px-1 rounded text-xs"
                    :class="getTextColorClass(task.state)"
                  >
                    {{ formatStatus(task.state) }}
                  </span>
                </div>
              </div>
            </div>
            
            <!-- Add task button -->
            <button 
              @click="addTaskForDate(day.date)"
              class="absolute bottom-2 right-2 h-6 w-6 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center"
              title="Add task for this day"
            >
              <PlusIcon class="h-4 w-4 text-gray-700" />
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Day View -->
    <div v-else-if="currentView === 'day'" class="p-4">
      <div class="flex flex-col">
        <!-- Day header -->
        <div class="text-center p-4 bg-gray-50 rounded-t-lg">
          <h3 class="text-xl font-medium text-gray-800">
            {{ format(currentDate, 'EEEE, MMMM d, yyyy') }}
          </h3>
          <p class="text-sm text-gray-500 mt-1">
            {{ dayTasks.length }} task(s) scheduled
          </p>
        </div>
        
        <!-- All-day events -->
        <div class="mt-4 border-b border-gray-200 pb-4">
          <div class="flex justify-between items-center px-2">
            <span class="text-sm font-medium text-gray-700">All-day events</span>
          </div>
          <div class="mt-2 space-y-2 max-h-40 overflow-y-auto px-2">
            <div
              v-for="task in allDayTasks"
              :key="task.id"
              @click="selectTask(task.id)"
              class="p-3 rounded cursor-pointer border-l-4 hover:shadow"
              :class="[
                getStatusClass(task.state),
                getBorderColorClass(task.state)
              ]"
            >
              <div class="font-medium">{{ task.name }}</div>
              <div class="text-sm mt-1 flex justify-between items-center">
                <span class="text-gray-600">
                  {{ task.project?.name || 'No project' }}
                </span>
                <span 
                  class="px-2 py-1 rounded text-xs"
                  :class="getStatusClass(task.state)"
                >
                  {{ formatStatus(task.state) }}
                </span>
              </div>
              <div class="text-xs text-gray-500 mt-2" v-if="task.description">
                {{ truncateDescription(task.description) }}
              </div>
              <div class="flex items-center mt-2 text-xs text-gray-500">
                <span v-if="task.assigned_to && task.assigned_to.length">
                  <UserIcon class="w-3 h-3 inline mr-1" />
                  Assigned to: {{ formatAssignees(task.assigned_to) }}
                </span>
                <span class="ml-4" v-if="task.progress !== undefined">
                  <span class="mr-1">Progress:</span>
                  <span 
                    class="inline-block w-16 h-1.5 bg-gray-200 rounded-full mr-1 align-middle"
                  >
                    <span 
                      class="inline-block h-full rounded-full bg-green-500"
                      :style="{ width: `${task.progress}%` }"
                    ></span>
                  </span>
                  <span>{{ task.progress }}%</span>
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Day tasks (not all-day) -->
        <div class="mt-4">
          <div class="flex justify-between items-center px-2 mb-4">
            <span class="text-sm font-medium text-gray-700">Tasks</span>
            <button 
              @click="addTaskForDate(currentDate)"
              class="px-3 py-1 rounded bg-red-600 text-white text-sm flex items-center"
            >
              <PlusIcon class="h-4 w-4 mr-1" />
              Add Task
            </button>
          </div>
          
          <div class="space-y-4">
            <div
              v-for="task in dayTasks"
              :key="task.id"
              @click="selectTask(task.id)"
              class="p-4 rounded-lg border cursor-pointer hover:shadow-md bg-white"
              :class="getBorderColorClass(task.state)"
            >
              <div class="flex justify-between items-start">
                <h4 class="font-medium text-gray-900">{{ task.name }}</h4>
                <span 
                  class="px-2 py-1 rounded text-xs"
                  :class="getStatusClass(task.state)"
                >
                  {{ formatStatus(task.state) }}
                </span>
              </div>
              
              <div class="mt-2 text-sm text-gray-600">
                {{ task.project?.name || 'No project' }}
              </div>
              
              <div class="text-sm text-gray-500 mt-3" v-if="task.description">
                {{ truncateDescription(task.description, 150) }}
              </div>
              
              <div class="flex items-center justify-between mt-4">
                <div class="flex items-center space-x-4 text-xs text-gray-500">
                  <span v-if="task.assigned_to && task.assigned_to.length">
                    <UserIcon class="w-3 h-3 inline mr-1" />
                    {{ formatAssignees(task.assigned_to) }}
                  </span>
                  <span v-if="task.dates && (task.dates.planned_start || task.dates.planned_end)">
                    <CalendarIcon class="w-3 h-3 inline mr-1" />
                    {{ formatTaskDateRange(task) }}
                  </span>
                </div>
                
                <div class="flex items-center" v-if="task.progress !== undefined">
                  <span class="text-xs text-gray-500 mr-2">{{ task.progress }}%</span>
                  <span class="inline-block w-24 h-1.5 bg-gray-200 rounded-full">
                    <span 
                      class="inline-block h-full rounded-full bg-green-500"
                      :style="{ width: `${task.progress}%` }"
                    ></span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- No tasks message -->
    <div v-if="filteredTasks.length === 0" class="p-10 text-center">
      <CalendarIcon class="mx-auto h-12 w-12 text-gray-300" />
      <h3 class="mt-2 text-sm font-medium text-gray-900">No tasks scheduled</h3>
      <p class="mt-1 text-sm text-gray-500">
        Add start and end dates to your tasks to see them in the calendar.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { 
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
  CalendarIcon,
  UserIcon
} from '@heroicons/vue/24/outline';
import {
  format,
  parseISO,
  isToday,
  isWeekend,
  isSameDay,
  isSameMonth,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  subDays,
  addWeeks,
  subWeeks,
  addMonths,
  subMonths,
  eachDayOfInterval,
  differenceInCalendarDays
} from 'date-fns';

const props = defineProps({
  tasks: {
    type: Array,
    required: true
  },
  selectedTaskId: {
    type: [Number, String],
    default: null
  }
});

const emit = defineEmits(['select-task', 'add-task']);

// State
const currentDate = ref(new Date());
const currentView = ref('month'); // 'month', 'week', 'day'
const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Computed values for date display
const currentMonthName = computed(() => {
  return format(currentDate.value, 'MMMM');
});

const currentYear = computed(() => {
  return format(currentDate.value, 'yyyy');
});

const currentDateRange = computed(() => {
  if (currentView.value === 'week') {
    const weekStart = startOfWeek(currentDate.value);
    const weekEnd = endOfWeek(currentDate.value);
    return `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`;
  }
  
  // Day view just shows the date in the header
  return '';
});

// Filtered tasks that have dates
const filteredTasks = computed(() => {
  return props.tasks.filter(task => 
    task.dates?.planned_start || task.dates?.planned_end
  );
});

// All-day tasks for the current day/week
const allDayTasks = computed(() => {
  if (currentView.value === 'day') {
    // For day view, consider tasks without specific time as all-day
    return filteredTasks.value.filter(task => 
      isTaskOnDate(task, currentDate.value)
    );
  } else {
    // For week view, consider tasks that span multiple days
    const weekStart = startOfWeek(currentDate.value);
    const weekEnd = endOfWeek(currentDate.value);
    
    return filteredTasks.value.filter(task => {
      const startDate = task.dates?.planned_start ? parseISO(task.dates.planned_start) : null;
      const endDate = task.dates?.planned_end ? parseISO(task.dates.planned_end) : null;
      
      if (!startDate && !endDate) return false;
      
      // Check if the task spans multiple days
      if (startDate && endDate) {
        const daysDiff = differenceInCalendarDays(endDate, startDate);
        if (daysDiff >= 1) return true;
      }
      
      // Check if the task is within the week
      return (startDate && startDate >= weekStart && startDate <= weekEnd) ||
             (endDate && endDate >= weekStart && endDate <= weekEnd);
    });
  }
});

// Tasks for the current day (not all-day)
const dayTasks = computed(() => {
  return filteredTasks.value.filter(task => 
    isTaskOnDate(task, currentDate.value)
  );
});

// Days for the calendar view
const calendarDays = computed(() => {
  const monthStart = startOfMonth(currentDate.value);
  const monthEnd = endOfMonth(currentDate.value);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  
  const days = eachDayOfInterval({ start: startDate, end: endDate });
  
  return days.map(date => ({
    date,
    isCurrentMonth: isSameMonth(date, currentDate.value),
    isToday: isToday(date),
    isWeekend: isWeekend(date)
  }));
});

// Days for the week view
const weekViewDays = computed(() => {
  const weekStart = startOfWeek(currentDate.value);
  
  return Array.from({ length: 7 }, (_, i) => {
    const date = addDays(weekStart, i);
    return {
      date,
      name: format(date, 'EEE'),
      isToday: isToday(date),
      isWeekend: isWeekend(date)
    };
  });
});

// Methods
function navigationHandler(direction) {
  // Direction: -1 for previous, 1 for next
  switch (currentView.value) {
    case 'month':
      currentDate.value = direction > 0 
        ? addMonths(currentDate.value, 1) 
        : subMonths(currentDate.value, 1);
      break;
    case 'week':
      currentDate.value = direction > 0 
        ? addWeeks(currentDate.value, 1) 
        : subWeeks(currentDate.value, 1);
      break;
    case 'day':
      currentDate.value = direction > 0 
        ? addDays(currentDate.value, 1) 
        : subDays(currentDate.value, 1);
      break;
  }
}

function goToToday() {
  currentDate.value = new Date();
}

function getTasksForDay(date) {
  return filteredTasks.value.filter(task => isTaskOnDate(task, date));
}

function isTaskOnDate(task, date) {
  // Tasks without dates are excluded
  if (!task.dates?.planned_start && !task.dates?.planned_end) return false;
  
  let matchesDay = false;
  
  // Check if task starts on this day
  if (task.dates?.planned_start) {
    const startDate = parseISO(task.dates.planned_start);
    if (isSameDay(startDate, date)) {
      matchesDay = true;
    }
  }
  
  // Check if task ends on this day
  if (task.dates?.planned_end && !matchesDay) {
    const endDate = parseISO(task.dates.planned_end);
    if (isSameDay(endDate, date)) {
      matchesDay = true;
    }
  }
  
  // Check if task spans over this day
  if (!matchesDay && task.dates?.planned_start && task.dates?.planned_end) {
    const startDate = parseISO(task.dates.planned_start);
    const endDate = parseISO(task.dates.planned_end);
    
    if (date >= startDate && date <= endDate) {
      matchesDay = true;
    }
  }
  
  return matchesDay;
}

function addTaskForDate(date) {
  // Emit event to create a new task with this date
  emit('add-task', date);
}

function selectTask(taskId) {
  emit('select-task', taskId);
}

function getStatusClass(status) {
  const classMap = {
    'draft': 'bg-gray-100',
    'planned': 'bg-blue-100',
    'in_progress': 'bg-yellow-100',
    'review': 'bg-purple-100',
    'done': 'bg-green-100',
    'cancelled': 'bg-red-100'
  };
  return classMap[status] || 'bg-gray-100';
}

function getTextColorClass(status) {
  const classMap = {
    'draft': 'text-gray-800',
    'planned': 'text-blue-800',
    'in_progress': 'text-yellow-800',
    'review': 'text-purple-800',
    'done': 'text-green-800',
    'cancelled': 'text-red-800'
  };
  return classMap[status] || 'text-gray-800';
}

function getBorderColorClass(status) {
  const classMap = {
    'draft': 'border-gray-300',
    'planned': 'border-blue-300',
    'in_progress': 'border-yellow-300',
    'review': 'border-purple-300',
    'done': 'border-green-300',
    'cancelled': 'border-red-300'
  };
  return classMap[status] || 'border-gray-300';
}

function formatStatus(status) {
  const statusMap = {
    'draft': 'Draft',
    'planned': 'Planned',
    'in_progress': 'In Progress',
    'review': 'In Review',
    'done': 'Completed',
    'cancelled': 'Cancelled'
  };
  return statusMap[status] || status;
}

function truncateDescription(description, length = 100) {
  if (!description) return '';
  
  // Strip HTML tags
  const strippedText = description.replace(/<[^>]*>/g, '');
  
  if (strippedText.length <= length) return strippedText;
  return strippedText.substring(0, length) + '...';
}

function formatAssignees(assignees) {
  if (!assignees || assignees.length === 0) return 'Unassigned';
  
  if (assignees.length === 1) return assignees[0].name;
  
  return `${assignees[0].name} +${assignees.length - 1} more`;
}

function formatTaskDateRange(task) {
  if (task.dates) {
    if (task.dates.planned_start && task.dates.planned_end) {
      return `${format(parseISO(task.dates.planned_start), 'MMM d')} - ${format(parseISO(task.dates.planned_end), 'MMM d')}`;
    } else if (task.dates.planned_start) {
      return `Start: ${format(parseISO(task.dates.planned_start), 'MMM d')}`;
    } else if (task.dates.planned_end) {
      return `End: ${format(parseISO(task.dates.planned_end), 'MMM d')}`;
    }
  }
  return '';
}

// Watch current view to update date if needed
watch(currentView, (newView) => {
  // If switching to week view, ensure we're at the week containing the current date
  if (newView === 'week') {
    currentDate.value = new Date();
  }
});
</script>

