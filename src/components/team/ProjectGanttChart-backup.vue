<!-- src/components/team/ProjectGanttChart.vue -->
<template>
  <div class="bg-white shadow rounded-lg overflow-hidden">
    <!-- Header controls -->
    <div class="p-4 border-b border-gray-200">
      <div class="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between">
        <!-- Title -->
        <h2 class="text-xl font-semibold text-gray-900">Project Timeline</h2>

        <!-- Controls -->
        <div class="flex flex-wrap gap-2 items-center">
          <!-- Time range navigation -->
          <div class="flex items-center space-x-2">
            <button
              @click="moveTimelinePrev"
              class="p-1 rounded border border-gray-300 hover:bg-gray-100"
              title="Previous"
            >
              <ChevronLeftIcon class="h-5 w-5 text-gray-700" />
            </button>
            <button
              @click="moveTimelineNext"
              class="p-1 rounded border border-gray-300 hover:bg-gray-100"
              title="Next"
            >
              <ChevronRightIcon class="h-5 w-5 text-gray-700" />
            </button>
            <button
              @click="resetTimeline"
              class="px-3 py-1 rounded border border-gray-300 hover:bg-gray-100 text-sm font-medium"
              title="Reset to current period"
            >
              Today
            </button>
          </div>

          <!-- Time scale zoom -->
          <div class="flex items-center space-x-2">
            <span class="text-sm text-gray-500">Zoom:</span>
            <button
              @click="decreaseZoom"
              class="p-1 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
              :disabled="zoomLevel <= minZoomLevel"
              title="Zoom Out"
            >
              <MinusIcon class="h-4 w-4 text-gray-600" />
            </button>
            <span class="text-xs font-medium w-6 text-center">{{ zoomLevel }}x</span>
            <button
              @click="increaseZoom"
              class="p-1 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
              :disabled="zoomLevel >= maxZoomLevel"
              title="Zoom In"
            >
              <PlusIcon class="h-4 w-4 text-gray-600" />
            </button>
          </div>

          <!-- Time scale selector -->
          <div class="flex space-x-1 border border-gray-300 rounded-md overflow-hidden">
            <button
              @click="setViewMode('day')"
              class="px-2 py-1 text-sm text-center"
              :class="viewMode === 'day' ? 'bg-red-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'"
            >
              Day
            </button>
            <button
              @click="setViewMode('week')"
              class="px-2 py-1 text-sm text-center"
              :class="viewMode === 'week' ? 'bg-red-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'"
            >
              Week
            </button>
            <button
              @click="setViewMode('month')"
              class="px-2 py-1 text-sm text-center"
              :class="viewMode === 'month' ? 'bg-red-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'"
            >
              Month
            </button>
          </div>

          <!-- Expand/Collapse All -->
          <button
            @click="toggleExpandAll"
            class="px-3 py-1 rounded border border-gray-300 hover:bg-gray-100 text-sm font-medium flex items-center"
            :title="allExpanded ? 'Collapse All' : 'Expand All'"
          >
            <ChevronRightIcon
              class="h-4 w-4 mr-1 transform transition-transform"
              :class="{ 'rotate-90': allExpanded }"
            />
            {{ allExpanded ? 'Collapse All' : 'Expand All' }}
          </button>
        </div>
      </div>

      <!-- Timeline period indicator -->
      <div class="mt-2 text-sm text-gray-600">
        {{ timelinePeriodLabel }}
      </div>
    </div>

    <!-- Project Gantt Chart -->
    <div class="overflow-x-auto">
      <div class="grid grid-flow-col" style="min-width: 1200px">
        <!-- Left side: Project & task names -->
        <div class="w-64 flex-shrink-0 border-r border-gray-200">
          <!-- Header -->
          <div class="h-16 flex items-end border-b border-gray-200 bg-gray-50 px-4 py-2">
            <h3 class="font-medium text-gray-700">Projects & Tasks</h3>
          </div>

          <!-- Projects list -->
          <div class="project-list divide-y divide-gray-200">
            <div
              v-for="(project, projectIndex) in projects"
              :key="project.id"
              class="project-item"
            >
              <!-- Project row -->
              <div 
                class="project-row group flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer"
                @click="toggleProject(projectIndex)"
              >
                <!-- Expand/collapse icon -->
                <button class="mr-2 flex-shrink-0">
                  <ChevronRightIcon 
                    class="h-4 w-4 text-gray-500 transform transition-transform" 
                    :class="{ 'rotate-90': project.expanded }"
                  />
                </button>
                
                <!-- Project name -->
                <div class="flex-grow">
                  <div class="font-medium text-gray-900 truncate">{{ project.name }}</div>
                </div>
                
                <!-- Project progress indicator -->
                <div class="flex items-center text-xs text-gray-500 ml-2">
                  {{ project.progress || 0 }}%
                </div>
              </div>

              <!-- Task rows (when expanded) -->
              <div v-if="project.expanded" class="task-list bg-gray-50">
                <div
                  v-for="task in project.tasks"
                  :key="task.id"
                  class="task-row flex items-center px-4 py-2 hover:bg-gray-100 pl-10"
                >
                  <!-- Task name -->
                  <div class="flex-grow">
                    <div class="text-sm text-gray-900 truncate">{{ task.name }}</div>
                  </div>
                  
                  <!-- Task progress indicator -->
                  <div class="flex items-center text-xs text-gray-500 ml-2">
                    {{ task.progress || 0 }}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right side: Timeline chart -->
        <div class="gantt-timeline flex-grow relative">
          <!-- Timeline header -->
          <div class="timeline-header h-16 border-b border-gray-200 bg-gray-50">
            <!-- Top-level time units (months or weeks) -->
            <div class="h-8 flex border-b border-gray-200">
              <div
                v-for="timeUnit in timeUnits.major"
                :key="timeUnit.key"
                class="flex-shrink-0 border-r border-gray-300 relative flex items-center justify-center"
                :style="{ width: `${timeUnit.width}px` }"
              >
                <span class="text-xs font-medium text-gray-700">{{ timeUnit.label }}</span>
              </div>
            </div>
            
            <!-- Detail time units (days) -->
            <div class="h-8 flex">
              <div
                v-for="timeUnit in timeUnits.minor"
                :key="timeUnit.key"
                :class="[
                  'flex-shrink-0 border-r border-gray-200 relative flex items-center justify-center',
                  timeUnit.isWeekend ? 'bg-gray-100' : '',
                  timeUnit.isToday ? 'bg-red-50' : ''
                ]"
                :style="{ width: `${getDayWidth()}px` }"
              >
                <span class="text-xs text-gray-500">{{ timeUnit.label }}</span>
              </div>
            </div>
          </div>

          <!-- Gantt bars area -->
          <div class="timeline-content">
            <!-- Project and task bars -->
            <div class="gantt-bars">
              <div
                v-for="(project) in projects"
                :key="project.id"
                class="project-bar-container"
              >
                <!-- Project timeline bar -->
                <div 
                  class="project-timeline-row relative h-10 hover:bg-gray-50"
                  :class="{ 'border-b border-gray-100': !project.expanded }"
                >
                  <!-- Project timeline bar -->
                  <div
                    v-if="getBarPosition(project).width > 0"
                    class="absolute top-1/2 transform -translate-y-1/2 h-6 rounded cursor-pointer"
                    :class="getProjectStatusClass(project.state)"
                    :style="{
                      left: `${getBarPosition(project).left}px`,
                      width: `${getBarPosition(project).width}px`
                    }"
                    @click.stop="handleProjectClick(project)"
                    :title="getProjectTooltip(project)"
                  >
                    <!-- Progress indicator -->
                    <div 
                      class="absolute top-0 left-0 bottom-0 rounded-l-md transition-all duration-300"
                      :class="getProgressBarColorClass(project.progress)"
                      :style="{ width: `${project.progress || 0}%` }"
                    ></div>
                    
                    <!-- Text label (only if enough space) -->
                    <div v-if="getBarPosition(project).width > 50" class="px-2 py-1 flex items-center h-full">
                      <span class="text-xs font-medium truncate">{{ project.name }}</span>
                    </div>
                  </div>
                    
                  <!-- Today indicator (vertical line) -->
                  <div
                    v-if="isTodayVisible"
                    class="absolute top-0 bottom-0 w-px bg-red-500 z-10"
                    :style="{ left: `${getTodayPosition()}px` }"
                  >
                    <!-- Optional: Add a more visible today indicator -->
                    <div class="absolute -top-1 left-1/2 transform -translate-x-1/2 text-xs text-red-500 font-bold">
                      Today
                    </div>
                  </div>
                </div>
                
                <!-- Task timeline bars (when project expanded) -->
                <div v-if="project.expanded">
                  <div
                    v-for="task in project.tasks"
                    :key="task.id"
                    class="task-timeline-row relative h-10 hover:bg-gray-100 border-b border-gray-100"
                  >
                    <!-- Task timeline bar -->
                    <div
                      v-if="getBarPosition(task).width > 0"
                      class="absolute top-1/2 transform -translate-y-1/2 h-5 rounded cursor-pointer"
                      :class="getTaskStatusClass(task.state)"
                      :style="{
                        left: `${getBarPosition(task).left}px`,
                        width: `${getBarPosition(task).width}px`
                      }"
                      @click.stop="handleTaskClick(task)"
                      :title="getTaskTooltip(task, project)"
                    >
                      <!-- Progress indicator -->
                      <div 
                        class="absolute top-0 left-0 bottom-0 rounded-l-md transition-all duration-300"
                        :class="getProgressBarColorClass(task.progress)"
                        :style="{ width: `${task.progress || 0}%` }"
                      ></div>
                        
                      <!-- Text label (only if enough space) -->
                      <div v-if="getBarPosition(task).width > 50" class="px-2 py-1 flex items-center h-full">
                        <span class="text-xs truncate">{{ task.name }}</span>
                      </div>
                    </div>
                      
                    <!-- Today indicator (vertical line) -->
                    <div
                      v-if="isTodayVisible"
                      class="absolute top-0 bottom-0 w-px bg-red-500 z-10"
                      :style="{ left: `${getTodayPosition()}px` }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Loading State -->
    <div 
      v-if="loading" 
      class="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center"
    >
      <div class="animate-spin rounded-full h-8 w-8 border-2 border-red-600 border-t-transparent"></div>
    </div>

    <!-- Empty State -->
    <div 
      v-if="!loading && projects.length === 0" 
      class="p-12 text-center"
    >
      <CalendarIcon class="mx-auto h-12 w-12 text-gray-400" />
      <h3 class="mt-2 text-sm font-medium text-gray-900">No projects found</h3>
      <p class="mt-1 text-sm text-gray-500">
        Create some projects with tasks to see them on the timeline.
      </p>
    </div>

    <TaskDetailModal
      :show="showTaskModal"
      :task-id="selectedTaskId"
      @close="closeTaskModal"
      @edit-task="handleEditTask"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  MinusIcon, 
  PlusIcon, 
  CalendarIcon
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
  isSameMonth
} from 'date-fns';
import apiClient from '@/config/api';
import TaskDetailModal from '@/components/team/TaskDetailModal.vue';

const props = defineProps({
  departmentId: {
    type: [Number, String],
    default: null
  },
  projectId: {
    type: [Number, String],
    default: null
  },
  singleProject: {
    type: Boolean,
    default: false
  },
  // Tambahkan props untuk custom date range
  startDateFilter: {
    type: String,
    default: null
  },
  endDateFilter: {
    type: String,
    default: null
  }
});

// 7. Modifikasi ProjectGanttChart untuk emit events baru
const emit = defineEmits([
  'view-task-detail', 
  'view-project-detail',
  'edit-task'
]);

// State
const projects = ref([]);
const loading = ref(false);
const startDate = ref(new Date());
const viewMode = ref('month'); // 'day', 'week', 'month'
const zoomLevel = ref(1);
const minZoomLevel = ref(0.5);
const maxZoomLevel = ref(3);
const allExpanded = ref(false);
const error = ref(null);
const showTaskModal = ref(false);
const selectedTaskId = ref(null);

// Computed
const timelinePeriodLabel = computed(() => {
  if (viewMode.value === 'month') {
    const monthStart = startOfMonth(startDate.value);
    const monthEnd = endOfMonth(startDate.value);
    return `${format(monthStart, 'MMMM yyyy')}`;
  } else if (viewMode.value === 'week') {
    const weekStart = startOfWeek(startDate.value);
    const weekEnd = endOfWeek(startDate.value);
    return `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`;
  } else { // day view
    const dayStart = startDate.value;
    const dayEnd = addDays(startDate.value, 14); // Show 2 weeks in day view
    return `${format(dayStart, 'MMM d')} - ${format(dayEnd, 'MMM d, yyyy')}`;
  }
});

// const effectiveDateRange = computed(() => {
//   // Jika ada filter tanggal dari props, gunakan itu
//   if (props.startDateFilter && props.endDateFilter) {
//     return {
//       start: parseISO(props.startDateFilter),
//       end: parseISO(props.endDateFilter)
//     };
//   }
  
//   // Jika tidak, gunakan tanggal default (1 bulan dari startDate)
//   let rangeStart, rangeEnd;
  
//   if (viewMode.value === 'month') {
//     rangeStart = startOfMonth(startDate.value);
//     rangeEnd = endOfMonth(startDate.value);
//   } else if (viewMode.value === 'week') {
//     rangeStart = startOfWeek(startDate.value);
//     rangeEnd = endOfWeek(startDate.value);
//   } else { // day view
//     rangeStart = startDate.value;
//     rangeEnd = addDays(startDate.value, 14); // 2 weeks default
//   }
  
//   return {
//     start: rangeStart,
//     end: rangeEnd
//   };
// });

// Modifikasi timeUnits computed untuk menggunakan effectiveDateRange
const timeUnits = computed(() => {
  try {
    // Get date range safely
    const rangeStart = effectiveDateRange.value.start;
    const rangeEnd = effectiveDateRange.value.end;
    
    // Validate dates
    if (!rangeStart || !rangeEnd || isNaN(rangeStart.getTime()) || isNaN(rangeEnd.getTime())) {
      console.error('Invalid date range for time units calculation');
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
      
      // If new month or first day
      if (month !== currentMonth || index === 0) {
        // Finish previous month if exists
        if (currentMonth && currentMonthDays > 0) {
          majorUnits[majorUnits.length - 1].width = currentMonthDays * getDayWidth();
        }
        
        // Start new month
        currentMonth = month;
        currentMonthDays = 1;
        
        majorUnits.push({
          key: month,
          label: format(day, 'MMMM yyyy'),
          start: day,
          end: null, // Will be set later
          width: 0 // Will be updated later
        });
      } else {
        // Still in same month
        currentMonthDays++;
        
        // If last day, update width of last month
        if (index === days.length - 1) {
          majorUnits[majorUnits.length - 1].width = currentMonthDays * getDayWidth();
          majorUnits[majorUnits.length - 1].end = day;
        }
      }
    });
    
    // Minor time units (days)
    const minorUnits = days.map(day => ({
      key: format(day, 'yyyy-MM-dd'),
      label: format(day, 'd'),
      date: day,
      isWeekend: isWeekend(day),
      isToday: isToday(day),
      monthLabel: format(day, 'MMM')
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


const isTodayVisible = computed(() => {
  // Check if today is within the current view range
  const today = new Date();
  let rangeStart, rangeEnd;
  
  if (viewMode.value === 'month') {
    rangeStart = startOfMonth(startDate.value);
    rangeEnd = endOfMonth(startDate.value);
  } else if (viewMode.value === 'week') {
    rangeStart = startOfWeek(startDate.value);
    rangeEnd = endOfWeek(startDate.value);
  } else { // day view
    rangeStart = startDate.value;
    rangeEnd = addDays(startDate.value, 14);
  }
  
  return today >= rangeStart && today <= rangeEnd;
});

// Methods
// In ProjectGanttChart.vue, find the fetchProjects function and update the data transformation part:

function fetchProjects() {
  loading.value = true;
  error.value = null;
  
  const params = {
    jsonrpc: '2.0',
    method: 'call'
  };
  
  // Add date range to params if present
  if (props.startDateFilter && props.endDateFilter) {
    params.date_start = props.startDateFilter;
    params.date_end = props.endDateFilter;
  }
  
  // Add department id if present
  if (props.departmentId) {
    params.department_id = props.departmentId;
  }

  
  apiClient.post('/web/v2/team/dashboard/timeline', params)
    .then(response => {
      if (response.data.result?.status === 'success') {
        // Transform data to match our component structure
        const projectsData = response.data.result.data || [];
        projects.value = projectsData.map(project => {
          // Safely handle date parsing
          let startDate, endDate;
          try {
            startDate = project.start ? parseISO(project.start) : new Date();
          } catch (e) {
            console.warn('Invalid start date for project:', project.id);
            startDate = new Date();
          }
          
          try {
            endDate = project.end ? parseISO(project.end) : addDays(new Date(), 30);
          } catch (e) {
            console.warn('Invalid end date for project:', project.id);
            endDate = addDays(new Date(), 30);
          }
          
          return {
            id: project.id,
            name: project.name,
            startDate: project.start || null, // Keep the original string for reference
            endDate: project.end || null,     // Keep the original string for reference
            start: startDate,
            end: endDate,
            progress: project.progress || 0,
            state: project.type === 'project' ? (project.state || 'in_progress') : 'task',
            expanded: false,
            tasks: (project.children || []).map(task => {
              // Safely handle task date parsing
              let taskStartDate, taskEndDate;
              try {
                taskStartDate = task.start ? parseISO(task.start) : new Date();
              } catch (e) {
                console.warn('Invalid start date for task:', task.id);
                taskStartDate = new Date();
              }
              
              try {
                taskEndDate = task.end ? parseISO(task.end) : addDays(new Date(), 7);
              } catch (e) {
                console.warn('Invalid end date for task:', task.id);
                taskEndDate = addDays(new Date(), 7);
              }
              
              return {
                id: task.id,
                name: task.name,
                startDate: task.start || null, // Keep the original string
                endDate: task.end || null,     // Keep the original string
                start: taskStartDate,
                end: taskEndDate,
                progress: task.progress || 0,
                state: task.state || 'in_progress'
              };
            })
          };
        });
      } else {
        error.value = response.data.result?.message || 'Failed to load projects';
      }
    })
    .catch(err => {
      console.error('Error fetching project timeline data:', err);
      error.value = 'Error loading project data';
    })
    .finally(() => {
      loading.value = false;
    });
}

function getDayWidth() {
  // Base day width multiplied by zoom level
  const baseDayWidth = 30;
  return baseDayWidth * zoomLevel.value;
}

function getBarPosition(item) {
  // Check if item or required properties are missing
  if (!item || !item.start || !item.end) {
    return { left: 0, width: 0 };
  }
  
  try {
    // Use effectiveDateRange instead of view-based range
    const viewStart = effectiveDateRange.value.start;
    const viewEnd = effectiveDateRange.value.end;
    
    // Safe parsing of dates - ensure they're Date objects
    const itemStartDate = typeof item.start === 'string' ? parseISO(item.start) : item.start;
    const itemEndDate = typeof item.end === 'string' ? parseISO(item.end) : item.end;
    
    // Validate parsed dates
    if (!itemStartDate || !itemEndDate || isNaN(itemStartDate.getTime()) || isNaN(itemEndDate.getTime())) {
      return { left: 0, width: 0 };
    }
    
    // If item is completely outside the view
    if (itemEndDate < viewStart || itemStartDate > viewEnd) {
      return { left: 0, width: 0 };
    }
    
    // Calculate start position
    const effectiveStart = itemStartDate < viewStart ? viewStart : itemStartDate;
    const daysFromViewStart = differenceInDays(effectiveStart, viewStart);
    const leftPosition = daysFromViewStart * getDayWidth();
    
    // Calculate width
    const effectiveEnd = itemEndDate > viewEnd ? viewEnd : itemEndDate;
    const itemDuration = differenceInDays(effectiveEnd, effectiveStart) + 1; // +1 because end date is inclusive
    const width = itemDuration * getDayWidth();
    
    return { left: leftPosition, width: width };
  } catch (error) {
    console.error('Error calculating bar position:', error);
    return { left: 0, width: 0 };
  }
}

function getProjectTooltip(project) {
  if (!project) return '';
  
  let tooltip = `Project: ${project.name || 'Unnamed Project'}\n`;
  
  try {
    if (project.startDate) {
      tooltip += `Start: ${format(parseISO(project.startDate), 'MMMM d, yyyy')}\n`;
    }
  } catch (e) {
    tooltip += 'Start: Not set\n';
  }
  
  try {
    if (project.endDate) {
      tooltip += `End: ${format(parseISO(project.endDate), 'MMMM d, yyyy')}`;
    }
  } catch (e) {
    tooltip += 'End: Not set';
  }
  
  return tooltip;
}

function getTaskTooltip(task, project) {
  if (!task) return '';
  
  let tooltip = `Task: ${task.name || 'Unnamed Task'}\n`;
  
  if (project) {
    tooltip += `Project: ${project.name || 'Unnamed Project'}\n`;
  }
  
  try {
    if (task.startDate) {
      tooltip += `Start: ${format(parseISO(task.startDate), 'MMMM d, yyyy')}\n`;
    }
  } catch (e) {
    tooltip += 'Start: Not set\n';
  }
  
  try {
    if (task.endDate) {
      tooltip += `End: ${format(parseISO(task.endDate), 'MMMM d, yyyy')}`;
    }
  } catch (e) {
    tooltip += 'End: Not set';
  }
  
  return tooltip;
}



function handleProjectClick(project) {
  // Add defensive validation
  if (!project || !project.id) {
    console.warn('Attempted to view invalid project');
    return;
  }
  
  // Emit event to parent component
  emit('view-project-detail', project);
}

function handleTaskClick(task) {
  // Add defensive validation
  if (!task || !task.id) {
    console.warn('Attempted to view invalid task');
    return;
  }
  
  selectedTaskId.value = task.id;
  showTaskModal.value = true;
  emit('view-task-detail', task);
}

function getProgressBarColorClass(progress) {
  if (progress >= 100) {
    return 'bg-green-500 bg-opacity-70'; // Completed - Green
  } else if (progress >= 75) {
    return 'bg-green-400 bg-opacity-70'; // Almost done - Light Green
  } else if (progress >= 50) {
    return 'bg-yellow-400 bg-opacity-70'; // Half way - Yellow
  } else if (progress >= 25) {
    return 'bg-orange-400 bg-opacity-70'; // Started - Orange
  } else {
    return 'bg-red-400 bg-opacity-70'; // Just started - Red
  }
}


// function getTodayPosition() {
//   const today = new Date();
//   let viewStart;
  
//   if (viewMode.value === 'month') {
//     viewStart = startOfMonth(startDate.value);
//   } else if (viewMode.value === 'week') {
//     viewStart = startOfWeek(startDate.value);
//   } else { // day view
//     viewStart = startDate.value;
//   }
  
//   const daysFromViewStart = differenceInDays(today, viewStart);
//   return daysFromViewStart * getDayWidth();
// }

function toggleProject(projectIndex) {
  projects.value[projectIndex].expanded = !projects.value[projectIndex].expanded;
  
  // Check if all projects are now expanded
  allExpanded.value = projects.value.every(project => project.expanded);
}

function toggleExpandAll() {
  allExpanded.value = !allExpanded.value;
  projects.value.forEach(project => {
    project.expanded = allExpanded.value;
  });
}

function moveTimelinePrev() {
  try {
    if (viewMode.value === 'month') {
      startDate.value = subMonths(startDate.value, 1);
    } else if (viewMode.value === 'week') {
      startDate.value = subWeeks(startDate.value, 1);
    } else { // day view
      startDate.value = subDays(startDate.value, 14);
    }
    
    // Force refresh of data based on new date range
    if (props.startDateFilter && props.endDateFilter) {
      // If using fixed date range from props, only update the view
    } else {
      // Otherwise, fetch new data for the new time range
      fetchProjects();
    }
  } catch (error) {
    console.error('Error navigating to previous period:', error);
  }
}

function moveTimelineNext() {
  try {
    if (viewMode.value === 'month') {
      startDate.value = addMonths(startDate.value, 1);
    } else if (viewMode.value === 'week') {
      startDate.value = addWeeks(startDate.value, 1);
    } else { // day view
      startDate.value = addDays(startDate.value, 14);
    }
    
    // Force refresh of data based on new date range
    if (props.startDateFilter && props.endDateFilter) {
      // If using fixed date range from props, only update the view
    } else {
      // Otherwise, fetch new data for the new time range
      fetchProjects();
    }
  } catch (error) {
    console.error('Error navigating to next period:', error);
  }
}

function resetTimeline() {
  try {
    // Reset to current date
    startDate.value = new Date();
    
    // Force refresh of data based on new date range
    if (props.startDateFilter && props.endDateFilter) {
      // If using fixed date range from props, only update the view
    } else {
      // Otherwise, fetch new data for the new time range
      fetchProjects();
    }
  } catch (error) {
    console.error('Error resetting timeline:', error);
  }
}

// 2. Fix the today indicator calculation:

// const isTodayVisible = computed(() => {
//   try {
//     // Get today's date
//     const today = new Date();
    
//     // Get the current view range
//     const viewRange = effectiveDateRange.value;
    
//     // Check if today falls within the current view range
//     return today >= viewRange.start && today <= viewRange.end;
//   } catch (error) {
//     console.error('Error calculating if today is visible:', error);
//     return false;
//   }
// });

function getTodayPosition() {
  try {
    const today = new Date();
    const viewStart = effectiveDateRange.value.start;
    
    // Ensure both are valid dates
    if (!viewStart || isNaN(viewStart.getTime()) || 
        !today || isNaN(today.getTime())) {
      return 0;
    }
    
    // Calculate days difference
    const daysFromViewStart = differenceInDays(today, viewStart);
    
    // Calculate pixel position
    return Math.max(0, daysFromViewStart * getDayWidth());
  } catch (error) {
    console.error('Error calculating today position:', error);
    return 0;
  }
}

// 3. Update the effectiveDateRange computed property to properly handle date changes:

const effectiveDateRange = computed(() => {
  try {
    // If there are date filters from props, prioritize those
    if (props.startDateFilter && props.endDateFilter) {
      const start = parseISO(props.startDateFilter);
      const end = parseISO(props.endDateFilter);
      
      // Make sure both dates are valid
      if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
        return { start, end };
      }
    }
    
    // Otherwise, calculate based on the current view mode and startDate
    let rangeStart, rangeEnd;
    
    if (viewMode.value === 'month') {
      rangeStart = startOfMonth(startDate.value);
      rangeEnd = endOfMonth(startDate.value);
    } else if (viewMode.value === 'week') {
      rangeStart = startOfWeek(startDate.value);
      rangeEnd = endOfWeek(startDate.value);
    } else { // day view
      rangeStart = startDate.value;
      rangeEnd = addDays(startDate.value, 14); // 2 weeks default
    }
    
    // Ensure both dates are valid
    if (isNaN(rangeStart.getTime()) || isNaN(rangeEnd.getTime())) {
      const today = new Date();
      rangeStart = startOfMonth(today);
      rangeEnd = endOfMonth(today);
    }
    
    return { start: rangeStart, end: rangeEnd };
  } catch (error) {
    console.error('Error calculating date range:', error);
    // Fallback to current month
    const today = new Date();
    return {
      start: startOfMonth(today),
      end: endOfMonth(today)
    };
  }
});


function setViewMode(mode) {
  viewMode.value = mode;
}

function increaseZoom() {
  if (zoomLevel.value < maxZoomLevel.value) {
    zoomLevel.value += 0.5;
  }
}

function decreaseZoom() {
  if (zoomLevel.value > minZoomLevel.value) {
    zoomLevel.value -= 0.5;
  }
}

function getProjectStatusClass(state) {
  // Return appropriate CSS classes for project bars based on state
  const classes = {
    'draft': 'bg-gray-200 border border-gray-300 text-gray-800',
    'planning': 'bg-blue-200 border border-blue-300 text-blue-800',
    'in_progress': 'bg-green-200 border border-green-300 text-green-800',
    'on_hold': 'bg-yellow-200 border border-yellow-300 text-yellow-800',
    'completed': 'bg-indigo-200 border border-indigo-300 text-indigo-800',
    'cancelled': 'bg-red-200 border border-red-300 text-red-800'
  };
  
  return classes[state] || 'bg-gray-200 border border-gray-300 text-gray-800';
}

function getTaskStatusClass(state) {
  // Return appropriate CSS classes for task bars based on state
  const classes = {
    'draft': 'bg-gray-100 border border-gray-200 text-gray-700',
    'planned': 'bg-blue-100 border border-blue-200 text-blue-700',
    'in_progress': 'bg-green-100 border border-green-200 text-green-700',
    'review': 'bg-purple-100 border border-purple-200 text-purple-700',
    'done': 'bg-indigo-100 border border-indigo-200 text-indigo-700',
    'cancelled': 'bg-red-100 border border-red-200 text-red-700'
  };
  
  return classes[state] || 'bg-gray-100 border border-gray-200 text-gray-700';
}

function getProgressBarClass(state) {
  // Return appropriate CSS classes for progress bars based on state
  const classes = {
    'draft': 'bg-gray-300',
    'planning': 'bg-blue-300',
    'in_progress': 'bg-green-300',
    'on_hold': 'bg-yellow-300',
    'review': 'bg-purple-300',
    'completed': 'bg-indigo-300',
    'done': 'bg-indigo-300',
    'cancelled': 'bg-red-300',
    'planned': 'bg-blue-300'
  };
  
  return classes[state] || 'bg-gray-300';
}

// 5. Tambahkan fungsi untuk menutup modal
function closeTaskModal() {
  showTaskModal.value = false;
  selectedTaskId.value = null;
}

// 6. Tambahkan fungsi untuk handle edit task
function handleEditTask(task) {
  // Tutup modal
  closeTaskModal();
  
  // Emit edit event ke parent component
  emit('edit-task', task);
  
  // Atau navigasi ke halaman edit task jika ada
  // router.push(`/team/task/${task.id}/edit`);
}

watch([() => props.startDateFilter, () => props.endDateFilter], ([newStart, newEnd], [oldStart, oldEnd]) => {
  if (newStart !== oldStart || newEnd !== oldEnd) {
    // Jika filter berubah, update data
    fetchProjects();
  }
});

// Lifecycle hooks
onMounted(() => {
  fetchProjects();
});

// Watch for prop changes to refresh data
watch(() => props.departmentId, (newValue) => {
  fetchProjects();
});
</script>

<style scoped>
.gantt-timeline {
  min-width: 800px;
}

.project-bar-container:nth-child(odd) .project-timeline-row {
  background-color: #f9fafb;
}

.project-bar-container:nth-child(odd) .task-timeline-row {
  background-color: #f3f4f6;
}

.timeline-content {
  overflow-y: auto;
  max-height: 600px; /* Adjust based on your layout needs */
}
</style>