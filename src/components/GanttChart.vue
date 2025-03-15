<!-- GanttChart.vue - Component for Task Manager -->
<template>
  <div class="bg-white shadow rounded-lg overflow-hidden">
    <div class="p-4 border-b border-gray-200">
      <div class="flex justify-between items-center mb-4">
        <!-- Navigation controls -->
        <div class="flex space-x-2">
          <button @click="moveTimeline(-1)" class="p-1 rounded border border-gray-300 hover:bg-gray-100">
            <ChevronLeftIcon class="h-5 w-5 text-gray-700" />
          </button>
          <button @click="moveTimeline(1)" class="p-1 rounded border border-gray-300 hover:bg-gray-100">
            <ChevronRightIcon class="h-5 w-5 text-gray-700" />
          </button>
          <button @click="zoomIn" class="p-1 rounded border border-gray-300 hover:bg-gray-100" :disabled="zoomLevel >= maxZoom">
            <PlusIcon class="h-5 w-5 text-gray-700" />
          </button>
          <button @click="zoomOut" class="p-1 rounded border border-gray-300 hover:bg-gray-100" :disabled="zoomLevel <= 1">
            <MinusIcon class="h-5 w-5 text-gray-700" />
          </button>
          <button @click="resetView" class="px-3 py-1 ml-2 rounded border border-gray-300 hover:bg-gray-100 text-sm font-medium">
            Reset
          </button>
        </div>
        
        <!-- Current timeline info -->
        <h2 class="text-lg font-semibold text-gray-900">{{ timelinePeriodLabel }}</h2>
        
        <!-- View options -->
        <div class="flex space-x-2">
          <button 
            v-for="view in viewOptions" 
            :key="view.value"
            @click="ganttView = view.value" 
            class="px-3 py-1 text-sm font-medium rounded"
            :class="ganttView === view.value 
              ? 'bg-red-600 text-white' 
              : 'text-gray-700 bg-gray-100 hover:bg-gray-200'"
          >
            {{ view.label }}
          </button>
        </div>
      </div>
    </div>
    
    <div class="p-4 overflow-x-auto">
      <div class="flex flex-col">
        <!-- Header with column titles -->
        <div class="flex mb-2">
          <!-- Left side (task info) -->
          <div class="flex-shrink-0 w-64 pr-4">
            <div class="h-8 font-medium text-gray-700 flex items-center pl-2">
              Task Information
            </div>
          </div>
          
          <!-- Right side (timeline) -->
          <div class="flex-grow">
            <!-- Timeline header -->
            <div class="flex">
              <!-- Top level time units (months or weeks) -->
              <div class="flex border-b border-gray-200">
                <div 
                  v-for="timeGroup in timelineGroups" 
                  :key="timeGroup.label"
                  class="flex-shrink-0 text-center text-sm font-medium bg-gray-50 border-r border-gray-200"
                  :style="{ width: `${timeGroup.span * columnWidth * zoomLevel}px` }"
                >
                  {{ timeGroup.label }}
                </div>
              </div>
            </div>
            
            <!-- Day/week units -->
            <div class="flex border-b border-gray-200">
              <div 
                v-for="(column, index) in timelineColumns" 
                :key="index"
                class="flex-shrink-0 text-center text-xs py-1"
                :class="column.isWeekend ? 'bg-gray-50' : 'bg-white'"
                :style="{ width: `${columnWidth * zoomLevel}px` }"
              >
                {{ column.label }}
              </div>
            </div>
          </div>
        </div>
        
        <!-- Main content grid -->
        <div class="flex">
          <!-- Task list (left side) -->
          <div class="flex-shrink-0 w-64 pr-4 border-r border-gray-200">
            <div class="space-y-1">
              <div 
                v-for="task in sortedTasks" 
                :key="task.id"
                class="flex items-center hover:bg-gray-50 py-2 pl-2 rounded"
                :class="selectedTaskId === task.id ? 'bg-red-50' : ''"
                @click="selectTask(task)"
              >
                <div class="w-2 h-2 rounded-full mr-2" :class="getStatusColorClass(task.state)"></div>
                <div class="text-sm font-medium text-gray-900 truncate">
                  {{ task.name }}
                </div>
              </div>
            </div>
          </div>
          
          <!-- Gantt chart area (right side) -->
          <div class="flex-grow relative">
            <!-- Background grid -->
            <div class="absolute inset-0">
              <div class="grid h-full" :style="gridTemplateStyle">
                <div 
                  v-for="(column, index) in timelineColumns" 
                  :key="index"
                  class="border-r border-gray-100 h-full"
                  :class="column.isWeekend ? 'bg-gray-50' : ''"
                ></div>
              </div>
            </div>
            
            <!-- Today indicator -->
            <div 
              v-if="todayPosition > 0"
              class="absolute top-0 bottom-0 w-px bg-red-500"
              :style="{ left: `${todayPosition}px` }"
            ></div>
            
            <!-- Task bars -->
            <div class="relative">
              <div 
                v-for="(task, taskIndex) in sortedTasks" 
                :key="task.id"
                class="h-10 relative"
              >
                <!-- Task row background (alternating) -->
                <div 
                  class="absolute inset-0 h-10"
                  :class="taskIndex % 2 === 0 ? 'bg-gray-50 bg-opacity-50' : ''"
                ></div>
                
                <!-- Task bar -->
                <div 
                  v-if="getTaskPosition(task)"
                  class="absolute top-1 h-8 rounded group"
                  :class="[
                    getStatusBarClass(task.state),
                    selectedTaskId === task.id ? 'ring-2 ring-red-400' : ''
                  ]"
                  :style="{
                    left: `${getTaskPosition(task).start}px`,
                    width: `${getTaskPosition(task).width}px`
                  }"
                  @click.stop="selectTask(task)"
                >
                  <!-- Progress indicator -->
                  <div 
                    class="h-full rounded-l opacity-60"
                    :class="getStatusBarClass(task.state)"
                    :style="{ width: `${task.progress || 0}%` }"
                  ></div>
                  
                  <!-- Task label -->
                  <div class="absolute inset-0 px-2 flex items-center justify-between text-xs">
                    <span class="font-medium truncate text-black">{{ task.name }}</span>
                    <span class="font-medium">{{ task.progress || 0 }}%</span>
                  </div>
                  
                  <!-- Task tooltip on hover -->
                  <div class="hidden group-hover:block absolute top-full left-0 mt-2 bg-gray-800 text-white rounded p-2 text-xs z-10 w-64 shadow-lg">
                    <div class="font-bold">{{ task.name }}</div>
                    <div>Status: {{ formatStatus(task.state) }}</div>
                    <div>Start: {{ formatDate(task.dates?.planned_start) }}</div>
                    <div>End: {{ formatDate(task.dates?.planned_end) }}</div>
                    <div>Progress: {{ task.progress || 0 }}%</div>
                    <div v-if="task.assigned_to && task.assigned_to.length">
                      Assigned to: {{ task.assigned_to.map(p => p.name).join(', ') }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- No tasks message -->
    <div v-if="sortedTasks.length === 0" class="p-10 text-center">
      <DocumentIcon class="mx-auto h-12 w-12 text-gray-300" />
      <h3 class="mt-2 text-sm font-medium text-gray-900">No tasks with dates found</h3>
      <p class="mt-1 text-sm text-gray-500">
        Add start and end dates to your tasks to see them in the Gantt view.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { 
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
  MinusIcon,
  DocumentTextIcon as DocumentIcon
} from '@heroicons/vue/24/outline';
import {
  format,
  parseISO,
  differenceInDays,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  eachWeekOfInterval,
  eachMonthOfInterval,
  isWeekend,
  isSameMonth,
  isToday,
  addDays
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

const emit = defineEmits(['select-task']);

// Gantt view state
const ganttView = ref('month'); // 'day', 'week', 'month', 'quarter'
const startDate = ref(new Date());
const zoomLevel = ref(1);
const maxZoom = 2;
const columnWidth = 30; // Base width in pixels for each column

// View options
const viewOptions = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
  { value: 'quarter', label: 'Quarter' }
];

// Computed properties
const sortedTasks = computed(() => {
  return props.tasks
    .filter(task => task.dates?.planned_start && task.dates?.planned_end)
    .sort((a, b) => {
      // Sort by start date, then by status
      const aStart = parseISO(a.dates.planned_start);
      const bStart = parseISO(b.dates.planned_start);
      
      if (aStart < bStart) return -1;
      if (aStart > bStart) return 1;
      
      // Same start date, sort by status priority
      const statusOrder = { 'done': 0, 'cancelled': 1, 'in_progress': 2, 'review': 3, 'planned': 4, 'draft': 5 };
      return (statusOrder[a.state] || 99) - (statusOrder[b.state] || 99);
    });
});

// Timeline generation
const timelineDates = computed(() => {
  let start, end;
  
  // Determine start/end dates based on view
  switch (ganttView.value) {
    case 'day':
      start = startOfWeek(startDate.value);
      end = endOfWeek(startDate.value);
      break;
    case 'week':
      start = startOfMonth(startDate.value);
      end = endOfMonth(startDate.value);
      break;
    case 'month':
      start = startOfMonth(subMonths(startDate.value, 1));
      end = endOfMonth(addMonths(startDate.value, 1));
      break;
    case 'quarter':
      start = startOfMonth(subMonths(startDate.value, 2));
      end = endOfMonth(addMonths(startDate.value, 3));
      break;
  }
  
  // Extend range to include all task dates if possible
  if (sortedTasks.value.length > 0) {
    const taskStartDates = sortedTasks.value.map(task => parseISO(task.dates.planned_start));
    const taskEndDates = sortedTasks.value.map(task => parseISO(task.dates.planned_end));
    
    const earliestTask = new Date(Math.min(...taskStartDates));
    const latestTask = new Date(Math.max(...taskEndDates));
    
    // Only extend if tasks are close to the current view
    const viewRange = differenceInDays(end, start);
    const extendedStart = differenceInDays(start, earliestTask) < viewRange * 2 
      ? earliestTask 
      : start;
    const extendedEnd = differenceInDays(latestTask, end) < viewRange * 2 
      ? latestTask 
      : end;
    
    start = extendedStart < start ? startOfWeek(extendedStart) : start;
    end = extendedEnd > end ? endOfWeek(extendedEnd) : end;
  }
  
  return { start, end };
});

const timelineColumns = computed(() => {
  const { start, end } = timelineDates.value;
  const days = eachDayOfInterval({ start, end });
  
  return days.map(date => {
    // Format based on view
    let label;
    switch (ganttView.value) {
      case 'day':
        label = format(date, 'HH:mm');
        break;
      case 'week':
        label = format(date, 'EEE');
        break;
      case 'month':
      case 'quarter':
        label = format(date, 'd');
        break;
    }
    
    return {
      date,
      label,
      isWeekend: isWeekend(date),
      isToday: isToday(date)
    };
  });
});

const timelineGroups = computed(() => {
  const { start, end } = timelineDates.value;
  
  let intervals;
  let formatStr;
  
  switch (ganttView.value) {
    case 'day':
      // Group by hours
      return []; // Not implemented for simplicity
    case 'week':
      intervals = eachDayOfInterval({ start, end });
      formatStr = 'EEE';
      break;
    case 'month':
      intervals = eachWeekOfInterval({ start, end });
      formatStr = 'MMM d';
      break;
    case 'quarter':
      intervals = eachMonthOfInterval({ start, end });
      formatStr = 'MMMM yyyy';
      break;
  }
  
  return intervals.map(interval => {
    let groupEnd;
    let daysInGroup;
    
    switch (ganttView.value) {
      case 'week':
        daysInGroup = 1;
        break;
      case 'month':
        groupEnd = endOfWeek(interval);
        daysInGroup = differenceInDays(
          groupEnd > end ? end : groupEnd,
          interval
        ) + 1;
        break;
      case 'quarter':
        groupEnd = endOfMonth(interval);
        daysInGroup = differenceInDays(
          groupEnd > end ? end : groupEnd,
          interval
        ) + 1;
        break;
    }
    
    return {
      date: interval,
      label: format(interval, formatStr),
      span: daysInGroup || 1
    };
  });
});

const timelinePeriodLabel = computed(() => {
  const { start, end } = timelineDates.value;
  
  switch (ganttView.value) {
    case 'day':
      return format(startDate.value, 'MMMM d, yyyy');
    case 'week':
      return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`;
    case 'month':
      return format(startDate.value, 'MMMM yyyy');
    case 'quarter':
      const startMonth = format(start, 'MMM');
      const endMonth = format(end, 'MMM');
      const year = format(startDate.value, 'yyyy');
      return `${startMonth} - ${endMonth} ${year}`;
  }
});

const gridTemplateStyle = computed(() => {
  return {
    gridTemplateColumns: `repeat(${timelineColumns.value.length}, ${columnWidth * zoomLevel}px)`
  };
});

const todayPosition = computed(() => {
  const today = new Date();
  const { start } = timelineDates.value;
  
  if (today < start) return -1;
  
  const dayIndex = timelineColumns.value.findIndex(col => isToday(col.date));
  if (dayIndex === -1) return -1;
  
  return (dayIndex * columnWidth * zoomLevel) + (columnWidth * zoomLevel / 2);
});

// Methods
function getTaskPosition(task) {
  if (!task.dates?.planned_start || !task.dates?.planned_end) {
    return null;
  }
  
  const startDate = parseISO(task.dates.planned_start);
  const endDate = parseISO(task.dates.planned_end);
  const { start, end } = timelineDates.value;
  
  // Task is outside the visible range
  if (endDate < start || startDate > end) {
    return null;
  }
  
  // Find column indices
  const visibleStartDate = startDate < start ? start : startDate;
  const visibleEndDate = endDate > end ? end : endDate;
  
  const startCol = timelineColumns.value.findIndex(col => 
    format(col.date, 'yyyy-MM-dd') === format(visibleStartDate, 'yyyy-MM-dd'));
  
  const endCol = timelineColumns.value.findIndex(col => 
    format(col.date, 'yyyy-MM-dd') === format(visibleEndDate, 'yyyy-MM-dd'));
  
  // Calculate position
  const startPos = startCol === -1 ? 0 : startCol * columnWidth * zoomLevel;
  const width = (endCol - startCol + 1) * columnWidth * zoomLevel;
  
  return {
    start: startPos,
    width: Math.max(width, columnWidth * zoomLevel / 2) // Ensure minimum width
  };
}

function getStatusColorClass(status) {
  const colorMap = {
    'draft': 'bg-gray-500',
    'planned': 'bg-blue-500',
    'in_progress': 'bg-yellow-500',
    'review': 'bg-purple-500',
    'done': 'bg-green-500',
    'cancelled': 'bg-red-500'
  };
  return colorMap[status] || 'bg-gray-500';
}

function getStatusBarClass(status) {
  const classMap = {
    'draft': 'bg-gray-200',
    'planned': 'bg-blue-200',
    'in_progress': 'bg-yellow-200',
    'review': 'bg-purple-200', 
    'done': 'bg-green-200',
    'cancelled': 'bg-red-200'
  };
  return classMap[status] || 'bg-gray-200';
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

function formatDate(dateString) {
  if (!dateString) return '';
  try {
    return format(parseISO(dateString), 'MMM d, yyyy');
  } catch (e) {
    return dateString;
  }
}

function moveTimeline(direction) {
  switch (ganttView.value) {
    case 'day':
      startDate.value = direction > 0 
        ? addDays(startDate.value, 1) 
        : addDays(startDate.value, -1);
      break;
    case 'week':
      startDate.value = direction > 0 
        ? addWeeks(startDate.value, 1) 
        : subWeeks(startDate.value, 1);
      break;
    case 'month':
      startDate.value = direction > 0 
        ? addMonths(startDate.value, 1) 
        : subMonths(startDate.value, 1);
      break;
    case 'quarter':
      startDate.value = direction > 0 
        ? addMonths(startDate.value, 3) 
        : subMonths(startDate.value, 3);
      break;
  }
}

function zoomIn() {
  if (zoomLevel.value < maxZoom) {
    zoomLevel.value += 0.25;
  }
}

function zoomOut() {
  if (zoomLevel.value > 1) {
    zoomLevel.value -= 0.25;
  }
}

function resetView() {
  startDate.value = new Date();
  zoomLevel.value = 1;
}

function selectTask(task) {
  emit('select-task', task.id);
}

// Watch tasks to recalculate timeline if needed
watch(() => props.tasks, () => {
  // If no tasks in view but tasks exist, reset timeline
  if (sortedTasks.value.length === 0 && props.tasks.length > 0) {
    const tasksWithDates = props.tasks.filter(t => t.dates?.planned_start);
    if (tasksWithDates.length > 0) {
      startDate.value = parseISO(tasksWithDates[0].dates.planned_start);
    }
  }
}, { deep: true });

// Initialize
onMounted(() => {
  // If tasks have dates, set start date to earliest task
  if (props.tasks.length > 0) {
    const tasksWithDates = props.tasks.filter(t => t.dates?.planned_start);
    if (tasksWithDates.length > 0) {
      const dates = tasksWithDates.map(t => parseISO(t.dates.planned_start));
      const earliestDate = new Date(Math.min(...dates));
      startDate.value = earliestDate;
    }
  }
});
</script>