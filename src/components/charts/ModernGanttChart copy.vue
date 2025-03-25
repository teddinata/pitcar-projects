<!-- src/components/team/ModernGanttChart.vue -->
<template>
  <div class="bg-dark-blue-900 shadow rounded-lg overflow-hidden">
    <!-- Gantt Chart Header -->
    <div class="p-4 border-b border-blue-800">
      <div class="flex justify-between items-center mb-4">
        <!-- Controls kiri: Navigasi dan periode -->
        <div class="flex items-center space-x-3">
          <button @click="goToPreviousPeriod" class="p-1 rounded border border-blue-700 hover:bg-blue-800 text-gray-300">
            <ChevronLeftIcon class="h-5 w-5" />
          </button>
          <button @click="goToNextPeriod" class="p-1 rounded border border-blue-700 hover:bg-blue-800 text-gray-300">
            <ChevronRightIcon class="h-5 w-5" />
          </button>
          <button @click="goToToday" class="px-3 py-1 rounded border border-blue-700 hover:bg-blue-800 text-sm font-medium text-gray-300">
            Today
          </button>
          <h2 class="ml-4 text-lg font-semibold text-gray-200">{{ periodLabel }}</h2>
        </div>
        
        <!-- Controls kanan: View mode dan display options -->
        <div class="flex items-center space-x-2">
          <div class="flex rounded overflow-hidden border border-blue-700">
            <button 
              @click="viewMode = 'day'"
              class="px-3 py-1 text-sm font-medium"
              :class="viewMode === 'day' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-300 bg-dark-blue-800 hover:bg-blue-800'"
            >
              Day
            </button>
            <button 
              @click="viewMode = 'week'" 
              class="px-3 py-1 text-sm font-medium"
              :class="viewMode === 'week' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-300 bg-dark-blue-800 hover:bg-blue-800'"
            >
              Week
            </button>
            <button 
              @click="viewMode = 'month'" 
              class="px-3 py-1 text-sm font-medium"
              :class="viewMode === 'month' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-300 bg-dark-blue-800 hover:bg-blue-800'"
            >
              Month
            </button>
          </div>
          
          <!-- Detail view toggle -->
          <div class="flex items-center text-sm text-gray-300 ml-4">
            <span>Detailed view</span>
            <div class="relative inline-block w-10 ml-2 align-middle select-none">
              <input 
                type="checkbox" 
                name="toggle" 
                id="detailed-view"
                v-model="detailedView" 
                class="sr-only toggle-checkbox peer"
              />
              <label 
                for="detailed-view" 
                class="block h-6 overflow-hidden bg-gray-700 rounded-full peer-checked:bg-blue-600 cursor-pointer transition-colors duration-200 w-11"
              >
                <span 
                  class="absolute block h-5 w-5 rounded-full bg-white shadow inset-y-0.5 left-0.5 transform peer-checked:translate-x-full transition-transform duration-200"
                ></span>
              </label>
            </div>
          </div>
          
          <!-- Zoom level -->
          <div class="ml-4 text-gray-300 text-sm flex items-center">
            <button 
              @click="decreaseZoom"
              class="p-1 rounded border border-blue-700 hover:bg-blue-800 text-gray-300"
              :disabled="zoomLevel <= minZoom"
            >
              <MinusIcon class="h-4 w-4" />
            </button>
            <span class="mx-2">{{ zoomLevel * 25 }}%</span>
            <button 
              @click="increaseZoom"
              class="p-1 rounded border border-blue-700 hover:bg-blue-800 text-gray-300"
              :disabled="zoomLevel >= maxZoom"
            >
              <PlusIcon class="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Gantt Chart Content -->
    <div class="relative">
      <!-- Date headers (fixed position) -->
      <div class="sticky top-0 z-10 bg-dark-blue-900 border-b border-blue-800">
        <div class="flex">
          <!-- Empty space for task names column -->
          <div class="w-64 flex-shrink-0 border-r border-blue-800">
            <!-- Filter dropdown -->
            <div class="p-2 flex items-center justify-between">
              <div class="relative">
                <button 
                  @click="showFilterDropdown = !showFilterDropdown" 
                  class="flex items-center text-gray-300 text-sm hover:text-white"
                >
                  <span class="mr-1">{{ selectedFilter === 'all' ? 'ALL' : 'Filter' }}</span>
                  <ChevronDownIcon class="h-4 w-4" />
                </button>
                
                <!-- Filter dropdown menu -->
                <div 
                  v-if="showFilterDropdown" 
                  class="absolute top-full left-0 mt-1 w-48 bg-dark-blue-800 rounded shadow-lg py-1 z-20 border border-blue-700"
                >
                  <a 
                    href="#" 
                    @click.prevent="selectFilter('all')"
                    class="block px-4 py-2 text-sm text-gray-300 hover:bg-blue-700"
                    :class="selectedFilter === 'all' ? 'bg-blue-600' : ''"
                  >
                    All
                  </a>
                  <template v-for="(person, index) in teamMembers" :key="person.id">
                    <a 
                      href="#" 
                      @click.prevent="selectFilter(person.id)"
                      class="block px-4 py-2 text-sm text-gray-300 hover:bg-blue-700 flex items-center"
                      :class="selectedFilter === person.id ? 'bg-blue-600' : ''"
                    >
                      <div class="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center text-white mr-2 flex-shrink-0">
                        {{ getInitials(person.name) }}
                      </div>
                      <span class="truncate">{{ person.name }}</span>
                    </a>
                  </template>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Day headers -->
          <div class="flex-grow overflow-hidden">
            <div class="flex">
              <div 
                v-for="(day, index) in visibleDays" 
                :key="index"
                class="flex-shrink-0 text-center border-r border-blue-800 py-2"
                :class="[day.isWeekend ? 'bg-dark-blue-800' : '']"
                :style="{ width: `${columnWidth}px` }"
              >
                <div 
                  class="text-xs font-medium"
                  :class="day.isToday ? 'text-blue-400' : day.isWeekend ? 'text-gray-400' : 'text-gray-300'"
                >
                  {{ day.dayNumber }}
                </div>
                <div 
                  class="text-xs"
                  :class="day.isToday ? 'text-blue-400' : day.isWeekend ? 'text-gray-400' : 'text-gray-300'"
                >
                  {{ day.dayName }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Main Grid -->
      <div class="flex">
        <!-- Task list column (fixed width) -->
        <div class="w-64 flex-shrink-0 border-r border-blue-800 bg-dark-blue-900">
          <div class="divide-y divide-blue-800">
            <div v-if="selectedFilter === 'all'" class="py-2 px-3 text-gray-300 text-sm font-medium">
              ALL
            </div>
            <template v-for="(person, personIndex) in displayedTeamMembers" :key="person.id">
              <!-- Person name header -->
              <div class="py-2 px-3 bg-dark-blue-800 text-gray-300 flex items-center">
                <div class="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center text-white mr-2 flex-shrink-0">
                  {{ getInitials(person.name) }}
                </div>
                <span class="text-sm font-medium truncate">{{ person.name }}</span>
              </div>
              
              <!-- Tasks for this person -->
              <div 
                v-for="(task, taskIndex) in getTasksForPerson(person.id)"
                :key="task.id" 
                class="py-2 px-3 text-sm text-gray-300 hover:bg-dark-blue-800 cursor-pointer"
                @click="selectTask(task)"
              >
                {{ task.name }}
              </div>
            </template>
          </div>
        </div>
        
        <!-- Gantt grid area -->
        <div class="flex-grow overflow-x-auto" style="min-height: 500px;">
          <!-- Background grid -->
          <div class="relative">
            <!-- Vertical time grid lines -->
            <div 
              class="absolute inset-0 grid" 
              :style="{ gridTemplateColumns: `repeat(${visibleDays.length}, ${columnWidth}px)` }"
            >
              <div 
                v-for="(day, index) in visibleDays"
                :key="index"
                class="border-r border-blue-800"
                :class="day.isWeekend ? 'bg-dark-blue-800/40' : ''"
              ></div>
            </div>
            
            <!-- Today highlight line -->
            <div 
              v-if="todayPosition !== null"
              class="absolute top-0 bottom-0 w-0.5 bg-blue-400 z-10"
              :style="{ left: `${todayPosition}px` }"
            ></div>
            
            <!-- Task rows -->
            <div class="relative">
              <template v-for="(person, personIndex) in displayedTeamMembers" :key="person.id">
                <!-- Horizontal divider between people -->
                <div 
                  class="h-10 border-b border-blue-800"
                  :class="{'bg-dark-blue-800/30': personIndex % 2 === 0}"
                ></div>
                
                <!-- Task bars for this person -->
                <template v-for="(task, taskIndex) in getTasksForPerson(person.id)" :key="task.id">
                  <div 
                    class="h-10 border-b border-blue-800"
                    :class="{'bg-dark-blue-800/30': personIndex % 2 === 0}"
                  >
                    <!-- Task bar -->
                    <div 
                      v-if="getTaskPosition(task)" 
                      class="absolute h-7 mt-1.5 rounded task-bar cursor-pointer" 
                      :class="getTaskColorClass(task)"
                      :style="{
                        left: `${getTaskPosition(task).start}px`,
                        width: `${getTaskPosition(task).width}px`
                      }"
                      @click="selectTask(task)"
                    >
                      <div class="px-2 py-1 text-xs font-medium text-white truncate">
                        {{ task.name }}
                      </div>
                    </div>
                  </div>
                </template>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Empty state if no tasks -->
    <div v-if="tasks.length === 0" class="p-12 text-center text-gray-400">
      <CalendarIcon class="h-12 w-12 mx-auto" />
      <h3 class="mt-2 text-sm font-medium">Tidak ada tugas dalam rentang waktu ini</h3>
      <p class="mt-1 text-sm">
        Coba sesuaikan filter tanggal atau tambahkan tugas dengan tenggat waktu.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  PlusIcon,
  MinusIcon,
  CalendarIcon
} from '@heroicons/vue/24/outline';
import {
  format,
  addDays,
  subDays,
  addWeeks,
  subWeeks,
  addMonths,
  subMonths,
  isWeekend,
  isToday,
  eachDayOfInterval,
  parseISO,
  differenceInDays,
  differenceInCalendarDays,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  isSameDay
} from 'date-fns';

const props = defineProps({
  tasks: {
    type: Array,
    required: true
  },
  teamMembers: {
    type: Array,
    required: true,
    default: () => []
  }
});

const emit = defineEmits(['select-task']);

// State
const currentDate = ref(new Date());
const viewMode = ref('week'); // 'day', 'week', 'month'
const detailedView = ref(true);
const zoomLevel = ref(4); // 1-8, default 4 (100%)
const minZoom = 1;
const maxZoom = 8;
const showFilterDropdown = ref(false);
const selectedFilter = ref('all'); // 'all' or person id

// Computed properties
const columnWidth = computed(() => 60 * zoomLevel.value / 4); // Base width 60px at zoom 100%

const visibleDays = computed(() => {
  let startDate, endDate;
  
  if (viewMode.value === 'day') {
    startDate = currentDate.value;
    endDate = currentDate.value;
  } else if (viewMode.value === 'week') {
    startDate = startOfWeek(currentDate.value, { weekStartsOn: 0 });
    endDate = endOfWeek(currentDate.value, { weekStartsOn: 0 });
  } else { // month
    startDate = startOfMonth(currentDate.value);
    endDate = endOfMonth(currentDate.value);
  }
  
  const days = eachDayOfInterval({ start: startDate, end: endDate });
  
  return days.map(date => ({
    date,
    dayNumber: format(date, 'd'),
    dayName: format(date, 'EEE'),
    isWeekend: isWeekend(date),
    isToday: isToday(date)
  }));
});

const periodLabel = computed(() => {
  if (viewMode.value === 'day') {
    return format(currentDate.value, 'MMMM d, yyyy');
  } else if (viewMode.value === 'week') {
    const start = startOfWeek(currentDate.value, { weekStartsOn: 0 });
    const end = endOfWeek(currentDate.value, { weekStartsOn: 0 });
    return `${format(start, 'MMMM d')} - ${format(end, 'MMMM d, yyyy')}`;
  } else { // month
    return format(currentDate.value, 'MMMM yyyy');
  }
});

const displayedTeamMembers = computed(() => {
  if (selectedFilter === 'all') {
    return props.teamMembers;
  } else {
    return props.teamMembers.filter(person => person.id === selectedFilter.value);
  }
});

const todayPosition = computed(() => {
  const today = new Date();
  
  // Check if today is within the visible range
  const isInRange = visibleDays.value.some(day => isSameDay(day.date, today));
  
  if (!isInRange) return null;
  
  // Find today's position
  const firstDay = visibleDays.value[0].date;
  const daysDiff = differenceInCalendarDays(today, firstDay);
  
  return daysDiff * columnWidth.value + columnWidth.value / 2;
});

// Methods
function goToPreviousPeriod() {
  if (viewMode.value === 'day') {
    currentDate.value = subDays(currentDate.value, 1);
  } else if (viewMode.value === 'week') {
    currentDate.value = subWeeks(currentDate.value, 1);
  } else { // month
    currentDate.value = subMonths(currentDate.value, 1);
  }
}

function goToNextPeriod() {
  if (viewMode.value === 'day') {
    currentDate.value = addDays(currentDate.value, 1);
  } else if (viewMode.value === 'week') {
    currentDate.value = addWeeks(currentDate.value, 1);
  } else { // month
    currentDate.value = addMonths(currentDate.value, 1);
  }
}

function goToToday() {
  currentDate.value = new Date();
}

function increaseZoom() {
  if (zoomLevel.value < maxZoom) {
    zoomLevel.value++;
  }
}

function decreaseZoom() {
  if (zoomLevel.value > minZoom) {
    zoomLevel.value--;
  }
}

function selectFilter(filter) {
  selectedFilter.value = filter;
  showFilterDropdown.value = false;
}

function getTasksForPerson(personId) {
  return props.tasks.filter(task => 
    task.assigned_to.some(assignee => assignee.id === personId)
  );
}

function getTaskPosition(task) {
  if (!task.dates?.planned_start || !task.dates?.planned_end) {
    return null;
  }
  
  const startDate = parseISO(task.dates.planned_start);
  const endDate = parseISO(task.dates.planned_end);
  
  if (!visibleDays.value.length) return null;
  
  const firstVisibleDate = visibleDays.value[0].date;
  const lastVisibleDate = visibleDays.value[visibleDays.value.length - 1].date;
  
  // Check if task is completely outside visible range
  if (endDate < firstVisibleDate || startDate > lastVisibleDate) {
    return null;
  }
  
  // Calculate task position relative to visible days
  let taskStartPosition = 0;
  if (startDate < firstVisibleDate) {
    // Task starts before visible range
    taskStartPosition = 0;
  } else {
    const daysFromStart = differenceInCalendarDays(startDate, firstVisibleDate);
    taskStartPosition = daysFromStart * columnWidth.value;
  }
  
  // Calculate task width
  let taskEndPosition;
  if (endDate > lastVisibleDate) {
    // Task ends after visible range
    taskEndPosition = visibleDays.value.length * columnWidth.value;
  } else {
    const daysFromStart = differenceInCalendarDays(endDate, firstVisibleDate) + 1; // +1 to include end day
    taskEndPosition = daysFromStart * columnWidth.value;
  }
  
  return {
    start: taskStartPosition,
    width: taskEndPosition - taskStartPosition
  };
}

function getTaskColorClass(task) {
  // Map task state to color classes
  const stateColorMap = {
    'draft': 'bg-gray-500',
    'planned': 'bg-blue-500',
    'in_progress': 'bg-yellow-500',
    'review': 'bg-purple-500',
    'done': 'bg-green-500',
    'cancelled': 'bg-red-500'
  };
  
  // Map priority to variations of the color
  const priorityVariation = {
    '0': 'opacity-70', // Low
    '1': '',           // Normal
    '2': 'brightness-110', // High
    '3': 'brightness-125'  // Critical
  };
  
  return `${stateColorMap[task.state] || 'bg-blue-500'} ${priorityVariation[task.priority] || ''}`;
}

function getInitials(name) {
  if (!name) return '';
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

function selectTask(task) {
  emit('select-task', task);
}

// Watch for changes in viewMode to ensure date reflects the mode
watch(viewMode, (newMode) => {
  // No date adjustment needed, just refresh the view
});
</script>

<style scoped>
.bg-dark-blue-900 {
  background-color: #0f172a;
}
.bg-dark-blue-800 {
  background-color: #1e293b;
}
.border-blue-800 {
  border-color: #1e40af;
}
.border-blue-700 {
  border-color: #1d4ed8;
}

.task-bar {
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}
.task-bar:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
}

/* Custom scrollbar */
:deep(::-webkit-scrollbar) {
  width: 8px;
  height: 8px;
}

:deep(::-webkit-scrollbar-track) {
  background: #0f172a;
}

:deep(::-webkit-scrollbar-thumb) {
  background: #334155;
  border-radius: 4px;
}

:deep(::-webkit-scrollbar-thumb:hover) {
  background: #475569;
}
</style>