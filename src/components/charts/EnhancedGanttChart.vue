<!-- PERBAIKAN VISUAL TIMELINE GANTT CHART -->
<template>
  <div class="bg-white shadow rounded-lg overflow-hidden flex flex-col h-full">
    <!-- Header with enhanced filter status -->
    <div class="p-4 border-b border-gray-200">
      <div
        class="flex flex-col space-y-3 md:flex-row md:items-center md:justify-between"
      >
        <!-- Enhanced Title with detailed info -->
        <div class="flex flex-col">
          <h2 class="text-xl font-semibold text-gray-900">Task Timeline</h2>

          <!-- Detailed status information -->
          <div class="flex flex-wrap gap-2 mt-2 items-center text-sm">
            <span
              class="text-gray-600 bg-gray-100 px-2 py-1 rounded-full text-xs font-medium"
            >
              {{ displayedTasks.length }} of {{ tasksData.length }} tasks with
              dates
            </span>

            <span
              v-if="departmentName"
              class="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium"
            >
              📁 {{ departmentName }}
            </span>

            <span
              v-if="stateFilter"
              class="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium"
            >
              🏷️ {{ formatState(stateFilter) }}
            </span>

            <span
              v-if="hasActiveDateFilter"
              class="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium"
            >
              📅 {{ formatDateRange(effectiveDateRange) }}
            </span>

            <!-- Task status breakdown -->
            <div class="flex gap-1 ml-2">
              <span
                v-for="(count, status) in taskStatusBreakdown"
                :key="status"
                class="px-2 py-1 rounded-full text-xs font-medium"
                :class="getStatusBadgeClass(status)"
                :title="`${count} ${formatState(status)} tasks`"
              >
                {{ count }}
              </span>
            </div>
          </div>
        </div>

        <!-- Enhanced Controls with better spacing -->
        <div class="flex flex-wrap gap-3 items-center">
          <!-- Time range navigation with period display -->
          <div
            class="inline-flex items-center rounded-md shadow-sm bg-white border border-gray-300"
          >
            <button
              @click="moveTimelinePrev"
              class="px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-red-500 rounded-l-md"
              title="Previous Period"
            >
              <ChevronLeftIcon class="h-4 w-4" />
            </button>

            <div
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 border-l border-r border-gray-300 min-w-[120px] text-center"
            >
              {{ currentPeriodLabel }}
            </div>

            <button
              @click="moveTimelineNext"
              class="px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-red-500 rounded-r-md"
              title="Next Period"
            >
              <ChevronRightIcon class="h-4 w-4" />
            </button>
          </div>

          <!-- Enhanced view mode selector -->
          <div class="inline-flex rounded-md shadow-sm">
            <button
              @click="setViewMode('week')"
              class="px-4 py-2 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-red-500 rounded-l-md transition-colors"
              :class="
                viewMode === 'week'
                  ? 'bg-red-600 text-white shadow-inner'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              "
            >
              Week
            </button>
            <button
              @click="setViewMode('month')"
              class="px-4 py-2 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-red-500 rounded-r-md transition-colors"
              :class="
                viewMode === 'month'
                  ? 'bg-red-600 text-white shadow-inner'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              "
            >
              Month
            </button>
          </div>

          <!-- Enhanced zoom controls with visual indicator -->
          <div
            class="inline-flex items-center rounded-md shadow-sm bg-white border border-gray-300"
          >
            <button
              @click="decreaseZoom"
              class="px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-red-500 disabled:opacity-50 rounded-l-md"
              :disabled="zoomLevel <= minZoomLevel"
              title="Zoom Out"
            >
              <MinusIcon class="h-4 w-4" />
            </button>

            <div
              class="px-3 py-2 text-xs font-medium text-gray-600 bg-gray-50 border-l border-r border-gray-300 min-w-[60px] text-center"
            >
              {{ Math.round(zoomLevel * 100) }}%
            </div>

            <button
              @click="increaseZoom"
              class="px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-red-500 disabled:opacity-50 rounded-r-md"
              :disabled="zoomLevel >= maxZoomLevel"
              title="Zoom In"
            >
              <PlusIcon class="h-4 w-4" />
            </button>
          </div>

          <!-- Quick reset button -->
          <button
            @click="resetToToday"
            class="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-red-500"
            title="Reset to current period"
          >
            🏠 Today
          </button>
        </div>
      </div>
    </div>

    <!-- Enhanced Gantt Chart Container -->
    <div class="flex-grow overflow-hidden relative">
      <!-- Progress indicator bar -->
      <div
        v-if="loading"
        class="absolute top-0 left-0 right-0 h-1 bg-gray-200 z-50"
      >
        <div class="h-full bg-red-600 animate-pulse"></div>
      </div>

      <!-- Main Gantt Structure with improved layout -->
      <div class="gantt-main">
        <!-- Enhanced Headers -->
        <div class="gantt-headers">
          <!-- Left header with task info -->
          <div class="task-header">
            <div class="flex items-center justify-between w-full">
              <h3 class="font-medium text-gray-700">Tasks</h3>
              <div class="text-xs text-gray-500">
                {{ displayedTasks.length }} items
              </div>
            </div>
          </div>

          <!-- Enhanced timeline header -->
          <div class="timeline-header" ref="timelineHeader">
            <!-- Top row (months) with improved styling -->
            <div class="month-row">
              <div
                v-for="timeUnit in timeUnits.major"
                :key="timeUnit.key"
                class="month-cell"
                :style="{ width: `${timeUnit.width}px` }"
              >
                <span class="text-xs font-semibold text-gray-700">{{
                  timeUnit.label
                }}</span>
              </div>
            </div>

            <!-- Bottom row (days) with enhanced weekend/today styling -->
            <div class="day-row">
              <div
                v-for="timeUnit in timeUnits.minor"
                :key="timeUnit.key"
                :class="[
                  'day-cell',
                  timeUnit.isWeekend ? 'weekend' : '',
                  timeUnit.isToday ? 'today' : '',
                  isHoliday(timeUnit.date) ? 'holiday' : '',
                ]"
                :style="{ width: `${getDayWidth()}px` }"
              >
                <span
                  class="text-xs"
                  :class="
                    timeUnit.isToday
                      ? 'font-bold text-red-600'
                      : 'text-gray-500'
                  "
                >
                  {{ timeUnit.label }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Enhanced scrollable content -->
        <div
          class="gantt-scroll-container"
          @scroll="handleScroll"
          ref="scrollContainer"
        >
          <div class="gantt-table">
            <!-- Enhanced left side: Tasks List -->
            <div class="tasks-list" ref="tasksList">
              <template
                v-for="(task, taskIndex) in sortedDisplayedTasks"
                :key="task.id"
              >
                <!-- Enhanced task row with better visual hierarchy -->
                <div
                  :id="`task-row-${task.id}`"
                  class="task-row"
                  :class="getTaskRowClass(task)"
                  :data-row-id="task.id"
                  @click="handleTaskClick(task)"
                >
                  <div class="task-row-content">
                    <!-- Enhanced status indicator -->
                    <div class="status-indicator-container">
                      <div
                        class="status-indicator"
                        :class="getStatusClass(task.state)"
                      ></div>
                      <div
                        class="status-line"
                        :class="getStatusClass(task.state)"
                      ></div>
                    </div>

                    <!-- Enhanced task info -->
                    <div class="task-info-container">
                      <div class="task-name" :title="task.name">
                        {{ task.name }}
                      </div>
                      <div class="task-metadata">
                        <span class="task-project">{{
                          task.project?.name || "No project"
                        }}</span>

                        <!-- Task timing info -->
                        <div class="task-timing" v-if="task.start || task.end">
                          <span class="timing-label">
                            {{ formatTaskDuration(task) }}
                          </span>
                        </div>
                      </div>
                    </div>

                    <!-- Enhanced task meta with better layout -->
                    <div class="task-meta">
                      <!-- Priority badge -->
                      <div
                        class="priority-badge"
                        :class="getPriorityClass(task.priority)"
                      >
                        <FlagIcon class="w-3 h-3" />
                        <span class="text-xs font-medium"
                          >P{{ task.priority || "2" }}</span
                        >
                      </div>

                      <!-- Enhanced assigned users -->
                      <div
                        v-if="task.assigned_to && task.assigned_to.length > 0"
                        class="assigned-users"
                      >
                        <div
                          v-for="(user, index) in task.assigned_to.slice(0, 2)"
                          :key="index"
                          class="user-avatar"
                          :style="{ backgroundColor: getUserColor(user.id) }"
                          :title="user.name"
                        >
                          <span class="text-white text-xs font-semibold">{{
                            getInitials(user.name)
                          }}</span>
                        </div>
                        <div
                          v-if="task.assigned_to.length > 2"
                          class="more-users"
                          :title="getRemainingUsersTitle(task.assigned_to, 2)"
                        >
                          <span class="text-xs"
                            >+{{ task.assigned_to.length - 2 }}</span
                          >
                        </div>
                      </div>
                    </div>

                    <!-- Enhanced progress container -->
                    <div class="progress-container">
                      <div class="progress-bar-bg">
                        <div
                          class="progress-bar-fill"
                          :class="getProgressColorClass(task.progress)"
                          :style="{ width: `${task.progress || 0}%` }"
                        ></div>
                      </div>
                      <div class="progress-text">{{ task.progress || 0 }}%</div>

                      <!-- Urgency indicator -->
                      <div
                        v-if="isUrgent(task)"
                        class="urgency-indicator"
                        title="Urgent task"
                      >
                        ⚡
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </div>

            <!-- Enhanced right side: Timeline Chart -->
            <div class="timeline-chart" ref="timelineChart">
              <template
                v-for="(task, taskIndex) in sortedDisplayedTasks"
                :key="task.id"
              >
                <!-- Enhanced task timeline row -->
                <div
                  :id="`task-timeline-row-${task.id}`"
                  class="task-timeline-row"
                  :class="getTaskRowClass(task)"
                  :data-row-id="task.id"
                >
                  <!-- Enhanced background grid -->
                  <div class="grid-background">
                    <template
                      v-for="timeUnit in timeUnits.minor"
                      :key="timeUnit.key"
                    >
                      <div
                        class="grid-cell"
                        :class="[
                          timeUnit.isWeekend ? 'weekend' : '',
                          timeUnit.isToday ? 'today' : '',
                          isHoliday(timeUnit.date) ? 'holiday' : '',
                        ]"
                        :style="{
                          left: `${getTimeUnitPosition(timeUnit)}px`,
                          width: `${getDayWidth()}px`,
                        }"
                      ></div>
                    </template>
                  </div>

                  <!-- Enhanced task bar -->
                  <div
                    v-if="getBarPosition(task).width > 0"
                    class="timeline-bar task-bar"
                    :class="[
                      getTaskBarClass(task.state),
                      getTaskUrgencyClass(task),
                    ]"
                    :style="{
                      left: `${getBarPosition(task).left}px`,
                      width: `${getBarPosition(task).width}px`,
                    }"
                    @click.stop="handleTaskClick(task)"
                    :title="getTaskTooltip(task)"
                  >
                    <!-- Enhanced progress fill -->
                    <div
                      class="progress-fill"
                      :class="getProgressFillClass(task.state)"
                      :style="{ width: `${task.progress || 0}%` }"
                    ></div>

                    <!-- Enhanced bar content -->
                    <div class="bar-content">
                      <!-- Task name -->
                      <div
                        v-if="getBarPosition(task).width > 60"
                        class="bar-label"
                      >
                        <span>{{ task.name }}</span>
                      </div>

                      <!-- Priority indicator on bar -->
                      <div
                        v-if="
                          getBarPosition(task).width > 100 &&
                          (task.priority === '2' || task.priority === '3')
                        "
                        class="priority-indicator-bar"
                        :class="getPriorityClass(task.priority)"
                      >
                        <FlagIcon class="h-3 w-3" />
                      </div>

                      <!-- Assigned users on bar -->
                      <div
                        v-if="
                          task.assigned_to &&
                          task.assigned_to.length > 0 &&
                          getBarPosition(task).width > 150
                        "
                        class="assigned-users-bar"
                      >
                        <div
                          v-for="(user, index) in task.assigned_to.slice(0, 3)"
                          :key="index"
                          class="user-avatar-small"
                          :style="{ backgroundColor: getUserColor(user.id) }"
                          :title="user.name"
                        >
                          <span class="text-white text-xs">{{
                            getInitials(user.name)
                          }}</span>
                        </div>
                        <div
                          v-if="task.assigned_to.length > 3"
                          class="more-users-small"
                          :title="getRemainingUsersTitle(task.assigned_to, 3)"
                        >
                          <span class="text-xs"
                            >+{{ task.assigned_to.length - 3 }}</span
                          >
                        </div>
                      </div>
                    </div>

                    <!-- Task milestone indicators -->
                    <div v-if="isMilestone(task)" class="milestone-indicator">
                      💎
                    </div>
                  </div>

                  <!-- Enhanced today indicator -->
                  <div
                    v-if="isTodayVisible"
                    class="today-indicator"
                    :style="{ left: `${getTodayPosition()}px` }"
                  >
                    <div class="today-line"></div>
                    <div class="today-label">TODAY</div>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Enhanced empty state -->
    <div
      v-if="!loading && displayedTasks.length === 0"
      class="flex flex-col items-center justify-center py-20 bg-gray-50 m-4 rounded-lg border-2 border-dashed border-gray-300"
    >
      <DocumentIcon class="h-16 w-16 text-gray-300 mb-4" />
      <h3 class="text-lg font-medium text-gray-900 mb-2">
        No tasks with timeline data
      </h3>
      <p class="text-sm text-gray-500 mb-4 text-center max-w-md">
        Tasks need at least a start or end date to appear in the timeline view.
        Try adjusting your filters or create tasks with scheduled dates.
      </p>
      <div class="flex gap-2 text-xs text-gray-400">
        <span>Total tasks: {{ tasksData.length }}</span>
        <span>•</span>
        <span>With dates: {{ displayedTasks.length }}</span>
      </div>
    </div>

    <!-- Enhanced loading state -->
    <div
      v-if="loading"
      class="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-30"
    >
      <div class="flex flex-col items-center">
        <div class="relative">
          <div
            class="animate-spin rounded-full h-12 w-12 border-4 border-red-600 border-t-transparent"
          ></div>
          <div
            class="absolute inset-0 rounded-full h-12 w-12 border-4 border-red-200 animate-pulse"
          ></div>
        </div>
        <p class="mt-4 text-sm text-gray-600 font-medium">
          Loading timeline...
        </p>
        <p class="text-xs text-gray-400">
          {{ tasksData.length }} tasks to process
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch, nextTick } from "vue";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MinusIcon,
  PlusIcon,
  DocumentIcon,
  FlagIcon,
} from "@heroicons/vue/24/outline";
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
  isSameMonth,
  isAfter,
  isBefore,
  differenceInHours,
} from "date-fns";

const props = defineProps({
  tasksData: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
  departmentId: {
    type: [Number, String],
    default: null,
  },
  departmentName: {
    type: String,
    default: "",
  },
  stateFilter: {
    type: String,
    default: null,
  },
  sortField: {
    type: String,
    default: "priority",
  },
  sortOrder: {
    type: String,
    default: "desc",
  },
  projectId: {
    type: [Number, String],
    default: null,
  },
  startDateFilter: {
    type: String,
    default: null,
  },
  endDateFilter: {
    type: String,
    default: null,
  },
  activeFiltersCount: {
    type: Number,
    default: 0,
  },
});

const emit = defineEmits([
  "view-task-detail",
  "edit-task",
  "update:dateRange",
  "clearFilter",
  "resetFilters",
]);

// Enhanced State Management
const startDate = ref(new Date());
const viewMode = ref("month");
const zoomLevel = ref(1);
const minZoomLevel = ref(0.5);
const maxZoomLevel = ref(3);
const isInternalNavigation = ref(false);

// Enhanced computed properties
const sortedDisplayedTasks = computed(() => {
  const tasks = [...displayedTasks.value];

  return tasks.sort((a, b) => {
    // Primary sort: Priority (high to low)
    const priorityA = parseInt(a.priority || "1");
    const priorityB = parseInt(b.priority || "1");

    if (priorityA !== priorityB) {
      return priorityB - priorityA; // Descending
    }

    // Secondary sort: Start date (early to late)
    if (a.start && b.start) {
      return a.start - b.start;
    }

    // Tertiary sort: Name alphabetically
    return a.name.localeCompare(b.name);
  });
});

const taskStatusBreakdown = computed(() => {
  const breakdown = {};
  displayedTasks.value.forEach((task) => {
    const status = task.state || "draft";
    breakdown[status] = (breakdown[status] || 0) + 1;
  });
  return breakdown;
});

const currentPeriodLabel = computed(() => {
  const range = effectiveDateRange.value;
  if (!range.start || !range.end) return "";

  if (viewMode.value === "month") {
    return format(range.start, "MMMM yyyy");
  } else {
    return `${format(range.start, "MMM d")} - ${format(
      range.end,
      "MMM d, yyyy"
    )}`;
  }
});

// Enhanced filter and transform tasks
const displayedTasks = computed(() => {
  console.log("Processing tasks for timeline:", props.tasksData.length);

  const tasksWithDates = props.tasksData
    .filter((task) => {
      const hasStartDate =
        task.dates?.planned_start || task.start || task.startDate;
      const hasEndDate = task.dates?.planned_end || task.end || task.endDate;

      return hasStartDate || hasEndDate;
    })
    .map((task) => {
      let startDate = null;
      let endDate = null;

      try {
        // Enhanced date parsing with fallbacks
        if (task.dates?.planned_start) {
          startDate = parseISO(task.dates.planned_start);
        } else if (task.start) {
          startDate =
            typeof task.start === "string" ? parseISO(task.start) : task.start;
        } else if (task.startDate) {
          startDate =
            typeof task.startDate === "string"
              ? parseISO(task.startDate)
              : task.startDate;
        }

        if (task.dates?.planned_end) {
          endDate = parseISO(task.dates.planned_end);
        } else if (task.end) {
          endDate =
            typeof task.end === "string" ? parseISO(task.end) : task.end;
        } else if (task.endDate) {
          endDate =
            typeof task.endDate === "string"
              ? parseISO(task.endDate)
              : task.endDate;
        }

        // Enhanced date estimation for missing dates
        if (startDate && !endDate) {
          // Estimate end date based on task complexity or default to 1 week
          const estimatedDays = task.planned_hours
            ? Math.ceil(task.planned_hours / 8)
            : 7;
          endDate = addDays(startDate, estimatedDays);
        } else if (!startDate && endDate) {
          // Estimate start date based on task complexity or default to 1 week before
          const estimatedDays = task.planned_hours
            ? Math.ceil(task.planned_hours / 8)
            : 7;
          startDate = subDays(endDate, estimatedDays);
        }
      } catch (error) {
        console.error("Error parsing dates for task:", task.name, error);
      }

      return {
        ...task,
        start: startDate,
        end: endDate,
        // Enhanced metadata
        duration:
          startDate && endDate ? differenceInDays(endDate, startDate) + 1 : 1,
        isOverdue:
          endDate && isAfter(new Date(), endDate) && task.state !== "done",
        isStartingSoon:
          startDate &&
          differenceInDays(startDate, new Date()) <= 3 &&
          differenceInDays(startDate, new Date()) > 0,
      };
    });

  console.log("Tasks with dates for timeline:", tasksWithDates.length);
  return tasksWithDates;
});

// Enhanced visual helper methods
const getUserColor = (userId) => {
  const colors = [
    "#ef4444",
    "#f97316",
    "#eab308",
    "#22c55e",
    "#06b6d4",
    "#3b82f6",
    "#8b5cf6",
    "#ec4899",
    "#f43f5e",
    "#84cc16",
  ];
  return colors[userId % colors.length];
};

const getTaskRowClass = (task) => {
  const classes = ["task-row"];

  if (task.isOverdue) classes.push("overdue");
  if (task.isStartingSoon) classes.push("starting-soon");
  if (task.priority === "3") classes.push("critical-priority");
  if (task.state === "done") classes.push("completed");

  return classes.join(" ");
};

const getTaskUrgencyClass = (task) => {
  if (task.isOverdue) return "urgent-overdue";
  if (task.isStartingSoon) return "urgent-soon";
  if (task.priority === "3") return "urgent-critical";
  return "";
};

const getStatusBadgeClass = (status) => {
  const classes = {
    draft: "bg-gray-100 text-gray-800",
    planned: "bg-blue-100 text-blue-800",
    in_progress: "bg-green-100 text-green-800",
    review: "bg-purple-100 text-purple-800",
    done: "bg-indigo-100 text-indigo-800",
    cancelled: "bg-red-100 text-red-800",
  };
  return classes[status] || "bg-gray-100 text-gray-800";
};

const formatTaskDuration = (task) => {
  if (!task.start || !task.end) return "";

  const days = differenceInDays(task.end, task.start) + 1;
  if (days === 1) return "1 day";
  if (days < 7) return `${days} days`;

  const weeks = Math.round(days / 7);
  return `${weeks} week${weeks > 1 ? "s" : ""}`;
};

const isUrgent = (task) => {
  return task.isOverdue || task.isStartingSoon || task.priority === "3";
};

const isMilestone = (task) => {
  return (
    task.type === "milestone" || (task.duration === 1 && task.priority === "3")
  );
};

const isHoliday = (date) => {
  // Add your holiday logic here
  return false;
};

const resetToToday = () => {
  isInternalNavigation.value = true;
  startDate.value = new Date();

  const range = effectiveDateRange.value;
  emit("update:dateRange", {
    start: format(range.start, "yyyy-MM-dd"),
    end: format(range.end, "yyyy-MM-dd"),
  });
};

// Enhanced effective date range
const effectiveDateRange = computed(() => {
  let rangeStart, rangeEnd;

  if (viewMode.value === "month") {
    rangeStart = startOfMonth(startDate.value);
    rangeEnd = endOfMonth(startDate.value);
  } else {
    rangeStart = startOfWeek(startDate.value, { weekStartsOn: 1 });
    rangeEnd = endOfWeek(startDate.value, { weekStartsOn: 1 });
  }

  if (
    props.startDateFilter &&
    props.endDateFilter &&
    !isInternalNavigation.value
  ) {
    try {
      const start = parseISO(props.startDateFilter);
      const end = parseISO(props.endDateFilter);

      if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
        return { start, end };
      }
    } catch (e) {
      console.error("Error parsing date filters:", e);
    }
  }

  return { start: rangeStart, end: rangeEnd };
});

const hasActiveDateFilter = computed(() => {
  return !!(props.startDateFilter && props.endDateFilter);
});

// Enhanced time units calculation
const timeUnits = computed(() => {
  try {
    const rangeStart = effectiveDateRange.value.start;
    const rangeEnd = effectiveDateRange.value.end;

    if (
      !rangeStart ||
      !rangeEnd ||
      isNaN(rangeStart.getTime()) ||
      isNaN(rangeEnd.getTime())
    ) {
      return { major: [], minor: [] };
    }

    const days = eachDayOfInterval({ start: rangeStart, end: rangeEnd });

    // Enhanced major units (months) calculation
    const majorUnits = [];
    let currentMonth = null;
    let currentMonthDays = 0;

    days.forEach((day, index) => {
      const month = format(day, "yyyy-MM");

      if (month !== currentMonth || index === 0) {
        if (currentMonth && currentMonthDays > 0) {
          majorUnits[majorUnits.length - 1].width =
            currentMonthDays * getDayWidth();
        }

        currentMonth = month;
        currentMonthDays = 1;

        majorUnits.push({
          key: month,
          label: format(day, "MMMM yyyy"),
          start: day,
          end: null,
          width: 0,
        });
      } else {
        currentMonthDays++;

        if (index === days.length - 1) {
          majorUnits[majorUnits.length - 1].width =
            currentMonthDays * getDayWidth();
          majorUnits[majorUnits.length - 1].end = day;
        }
      }
    });

    // Enhanced minor units (days) with additional metadata
    const minorUnits = days.map((day) => ({
      key: format(day, "yyyy-MM-dd"),
      label: format(day, "d"),
      date: day,
      isWeekend: isWeekend(day),
      isToday: isToday(day),
      monthLabel: format(day, "MMM"),
      dayName: format(day, "EEE"),
      position: 0,
    }));

    return {
      major: majorUnits,
      minor: minorUnits,
    };
  } catch (error) {
    console.error("Error generating time units:", error);
    return { major: [], minor: [] };
  }
});

const isTodayVisible = computed(() => {
  try {
    const today = new Date();
    const viewRange = effectiveDateRange.value;
    return today >= viewRange.start && today <= viewRange.end;
  } catch (error) {
    return false;
  }
});

// Enhanced methods
function getDayWidth() {
  const baseDayWidth = 32; // Slightly increased base width
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

    // Enhanced visibility check
    if (taskEnd < viewStart || taskStart > viewEnd) {
      return { left: 0, width: 0 };
    }

    // Enhanced position calculation
    const effectiveStart = taskStart < viewStart ? viewStart : taskStart;
    const daysFromViewStart = differenceInDays(effectiveStart, viewStart);
    const leftPosition = daysFromViewStart * getDayWidth();

    const effectiveEnd = taskEnd > viewEnd ? viewEnd : taskEnd;
    const taskDuration = Math.max(
      1,
      differenceInDays(effectiveEnd, effectiveStart) + 1
    );
    const width = Math.max(taskDuration * getDayWidth(), getDayWidth() * 0.8); // Minimum width

    return { left: leftPosition, width: width };
  } catch (error) {
    console.error("Error calculating bar position:", error);
    return { left: 0, width: 0 };
  }
}

function getTodayPosition() {
  try {
    const today = new Date();
    const viewStart = effectiveDateRange.value.start;

    if (!viewStart) return 0;

    const daysFromViewStart = differenceInDays(today, viewStart);
    return Math.max(0, daysFromViewStart * getDayWidth() + getDayWidth() / 2); // Center on the day
  } catch (error) {
    console.error("Error calculating today position:", error);
    return 0;
  }
}

// Enhanced navigation methods
function moveTimelinePrev() {
  try {
    isInternalNavigation.value = true;

    if (viewMode.value === "month") {
      startDate.value = subMonths(startDate.value, 1);
    } else {
      startDate.value = subWeeks(startDate.value, 1);
    }

    const range = effectiveDateRange.value;
    emit("update:dateRange", {
      start: format(range.start, "yyyy-MM-dd"),
      end: format(range.end, "yyyy-MM-dd"),
    });
  } catch (error) {
    console.error("Error navigating to previous period:", error);
  }
}

function moveTimelineNext() {
  try {
    isInternalNavigation.value = true;

    if (viewMode.value === "month") {
      startDate.value = addMonths(startDate.value, 1);
    } else {
      startDate.value = addWeeks(startDate.value, 1);
    }

    const range = effectiveDateRange.value;
    emit("update:dateRange", {
      start: format(range.start, "yyyy-MM-dd"),
      end: format(range.end, "yyyy-MM-dd"),
    });
  } catch (error) {
    console.error("Error navigating to next period:", error);
  }
}

function resetTimeline() {
  try {
    isInternalNavigation.value = true;
    startDate.value = new Date();

    const range = effectiveDateRange.value;
    emit("update:dateRange", {
      start: format(range.start, "yyyy-MM-dd"),
      end: format(range.end, "yyyy-MM-dd"),
    });
  } catch (error) {
    console.error("Error resetting timeline:", error);
  } finally {
    isInternalNavigation.value = false;
  }
}

function setViewMode(mode) {
  if (viewMode.value === mode) return;

  try {
    isInternalNavigation.value = true;
    viewMode.value = mode;

    const range = effectiveDateRange.value;
    emit("update:dateRange", {
      start: format(range.start, "yyyy-MM-dd"),
      end: format(range.end, "yyyy-MM-dd"),
    });
  } catch (error) {
    console.error("Error changing view mode:", error);
  } finally {
    isInternalNavigation.value = false;
  }
}

// Enhanced zoom methods
function increaseZoom() {
  if (zoomLevel.value < maxZoomLevel.value) {
    zoomLevel.value = Math.min(maxZoomLevel.value, zoomLevel.value + 0.25);
  }
}

function decreaseZoom() {
  if (zoomLevel.value > minZoomLevel.value) {
    zoomLevel.value = Math.max(minZoomLevel.value, zoomLevel.value - 0.25);
  }
}

// Enhanced task interaction
function handleTaskClick(task) {
  if (!task || !task.id) {
    console.warn("Attempted to view invalid task");
    return;
  }

  emit("view-task-detail", task);
}

// Enhanced helper methods
function getTaskTooltip(task) {
  if (!task) return "";

  let tooltip = `📋 ${task.name || "Unnamed Task"}\n`;

  if (task.project?.name) {
    tooltip += `📁 Project: ${task.project.name}\n`;
  }

  try {
    if (task.start) {
      tooltip += `🗓️ Start: ${format(task.start, "MMM d, yyyy")}\n`;
    }
    if (task.end) {
      tooltip += `📅 Due: ${format(task.end, "MMM d, yyyy")}\n`;
    }
    if (task.duration) {
      tooltip += `⏱️ Duration: ${task.duration} day${
        task.duration > 1 ? "s" : ""
      }\n`;
    }
  } catch (e) {
    console.error("Error formatting dates in tooltip:", e);
  }

  tooltip += `📊 Progress: ${task.progress || 0}%\n`;
  tooltip += `🏷️ Priority: P${task.priority || "2"}\n`;
  tooltip += `📍 Status: ${formatState(task.state)}`;

  if (task.assigned_to && task.assigned_to.length > 0) {
    tooltip += `\n👥 Assigned to: ${task.assigned_to
      .map((u) => u.name)
      .join(", ")}`;
  }

  if (task.isOverdue) {
    tooltip += "\n⚠️ OVERDUE";
  }

  if (task.isStartingSoon) {
    tooltip += "\n🚀 Starting Soon";
  }

  return tooltip;
}

function formatState(state) {
  if (!state) return "Draft";
  return state
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatDateRange(range) {
  if (!range?.start || !range?.end) return "";

  try {
    const start = format(range.start, "MMM d");
    const end = format(range.end, "MMM d, yyyy");
    return `${start} - ${end}`;
  } catch (e) {
    return "";
  }
}

// Enhanced visual styling helper methods
function getInitials(name) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
}

function getRemainingUsersTitle(users, shown) {
  if (!users || users.length <= shown) return "";
  return users
    .slice(shown)
    .map((u) => u.name)
    .join(", ");
}

function getStatusClass(state) {
  const classes = {
    draft: "bg-gray-400",
    planned: "bg-blue-400",
    in_progress: "bg-green-400",
    review: "bg-purple-400",
    done: "bg-indigo-400",
    cancelled: "bg-red-400",
  };
  return classes[state] || "bg-gray-400";
}

function getPriorityClass(priority) {
  const classes = {
    0: "bg-blue-100 text-blue-800 border-blue-200",
    1: "bg-emerald-100 text-emerald-800 border-emerald-200",
    2: "bg-amber-100 text-amber-800 border-amber-200",
    3: "bg-red-100 text-red-800 border-red-200",
  };
  return (
    classes[priority?.toString()] ||
    "bg-emerald-100 text-emerald-800 border-emerald-200"
  );
}

function getTaskBarClass(state) {
  const classes = {
    draft: "bg-gray-50 border-gray-200 text-gray-700",
    planned: "bg-blue-50 border-blue-200 text-blue-700",
    in_progress: "bg-green-50 border-green-200 text-green-700",
    review: "bg-purple-50 border-purple-200 text-purple-700",
    done: "bg-indigo-50 border-indigo-200 text-indigo-700",
    cancelled: "bg-red-50 border-red-200 text-red-700",
  };
  return classes[state] || "bg-gray-50 border-gray-200 text-gray-700";
}

function getProgressColorClass(progress) {
  if (progress >= 100) return "complete";
  if (progress >= 75) return "high";
  if (progress >= 50) return "medium";
  return "low";
}

function getProgressFillClass(state) {
  const classes = {
    draft: "bg-gray-300",
    planned: "bg-blue-300",
    in_progress: "bg-green-300",
    review: "bg-purple-300",
    done: "bg-indigo-300",
    cancelled: "bg-red-300",
  };
  return classes[state] || "bg-gray-300";
}

// Enhanced reference handling
const scrollContainer = ref(null);
const timelineHeader = ref(null);
const tasksList = ref(null);
const timelineChart = ref(null);

function handleScroll(e) {
  if (timelineHeader.value) {
    timelineHeader.value.scrollLeft = e.target.scrollLeft;
  }
}

let resizeObserver = null;

function syncRowHeights() {
  nextTick(() => {
    displayedTasks.value.forEach((task) => {
      const leftRow = document.getElementById(`task-row-${task.id}`);
      const rightRow = document.getElementById(`task-timeline-row-${task.id}`);

      if (leftRow && rightRow) {
        const height = Math.max(
          leftRow.scrollHeight,
          rightRow.scrollHeight,
          56
        ); // Increased minimum height
        leftRow.style.height = `${height}px`;
        rightRow.style.height = `${height}px`;
      }
    });
  });
}

// Enhanced lifecycle hooks
onMounted(() => {
  console.log("Enhanced Task Gantt Chart mounted");

  if (props.startDateFilter) {
    try {
      const date = parseISO(props.startDateFilter);
      if (!isNaN(date.getTime())) {
        startDate.value = date;
      }
    } catch (e) {
      console.error("Error parsing initial startDateFilter:", e);
    }
  }

  resizeObserver = new ResizeObserver((entries) => {
    syncRowHeights();
  });

  if (scrollContainer.value) {
    resizeObserver.observe(scrollContainer.value);
  }

  syncRowHeights();
  window.addEventListener("resize", syncRowHeights);
});

onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect();
  }
  window.removeEventListener("resize", syncRowHeights);
});

// Enhanced watchers
watch(
  [
    () => props.startDateFilter,
    () => props.endDateFilter,
    () => props.departmentId,
  ],
  ([newStart, newEnd, newDept], [oldStart, oldEnd, oldDept]) => {
    if (
      (newStart !== oldStart || newEnd !== oldEnd || newDept !== oldDept) &&
      !isInternalNavigation.value
    ) {
      if (newStart && newStart !== oldStart) {
        try {
          const date = parseISO(newStart);
          if (!isNaN(date.getTime())) {
            startDate.value = date;
          }
        } catch (e) {
          console.error("Error parsing startDateFilter:", e);
        }
      }
    }
  }
);

watch(
  () => props.tasksData,
  () => {
    nextTick(() => {
      syncRowHeights();
    });
  },
  { deep: true }
);

watch(
  () => props.loading,
  (newVal, oldVal) => {
    if (oldVal === true && newVal === false) {
      isInternalNavigation.value = false;
    }
  }
);
</script>

<style scoped>
/* ENHANCED GANTT CHART STYLES - Visual Timeline Improvements */

/* Base layout - Enhanced for better visual hierarchy */
.gantt-main {
  height: calc(100vh - 200px);
  min-height: 600px;
  min-width: 1200px;
  position: relative;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 8px;
  overflow: hidden;
}

/* Enhanced headers with better visual separation */
.gantt-headers {
  display: flex;
  position: sticky;
  top: 0;
  z-index: 20;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  height: 72px;
  border-bottom: 2px solid #e2e8f0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

/* Enhanced task header */
.task-header {
  width: 400px;
  min-width: 400px;
  padding: 0 20px;
  display: flex;
  align-items: flex-end;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-right: 2px solid #cbd5e1;
  padding-bottom: 12px;
  flex-shrink: 0;
  position: relative;
}

.task-header::after {
  content: "";
  position: absolute;
  right: 0;
  top: 10%;
  bottom: 10%;
  width: 1px;
  background: linear-gradient(to bottom, transparent, #94a3b8, transparent);
}

/* Enhanced timeline header */
.timeline-header {
  flex: 1;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  overflow: hidden;
}

.month-row {
  display: flex;
  height: 36px;
  border-bottom: 1px solid #cbd5e1;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
}

.month-cell {
  height: 100%;
  border-right: 1px solid #d1d5db;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #ffffff 0%, #f9fafb 100%);
  position: relative;
}

.month-cell::before {
  content: "";
  position: absolute;
  bottom: 0;
  left: 10%;
  right: 10%;
  height: 2px;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  border-radius: 1px;
}

.month-cell span {
  color: #374151;
  font-weight: 700;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.day-row {
  display: flex;
  height: 36px;
  background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
}

.day-cell {
  height: 100%;
  border-right: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8fafc;
  position: relative;
  transition: all 0.2s ease;
}

.day-cell.weekend {
  background: linear-gradient(135deg, #fef3f2 0%, #fdf2f8 100%);
}

.day-cell.today {
  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
  position: relative;
  z-index: 5;
}

.day-cell.today::before {
  content: "";
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 2px;
  background: linear-gradient(to bottom, #ef4444, #dc2626);
  transform: translateX(-50%);
  box-shadow: 0 0 8px rgba(239, 68, 68, 0.5);
}

.day-cell.holiday {
  background: linear-gradient(135deg, #fefce8 0%, #fef3c7 100%);
}

.day-cell span {
  color: #6b7280;
  font-weight: 600;
  font-size: 0.75rem;
}

.day-cell.today span {
  color: #dc2626;
  font-weight: 800;
  text-shadow: 0 1px 2px rgba(220, 38, 38, 0.1);
}

/* Enhanced scrollable container */
.gantt-scroll-container {
  flex: 1;
  overflow: auto;
  position: relative;
  background: #ffffff;
  border-radius: 0 0 8px 8px;
}

/* Enhanced table structure */
.gantt-table {
  display: flex;
  min-height: 100%;
}

/* Enhanced tasks list */
.tasks-list {
  width: 400px;
  min-width: 400px;
  background: linear-gradient(135deg, #ffffff 0%, #f9fafb 100%);
  border-right: 2px solid #e5e7eb;
  position: sticky;
  left: 0;
  z-index: 15;
  flex-shrink: 0;
}

/* Enhanced timeline chart */
.timeline-chart {
  flex: 1;
  background: #ffffff;
  position: relative;
}

/* Enhanced task rows with better visual hierarchy */
.task-row {
  min-height: 56px;
  height: auto;
  position: relative;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  align-items: stretch;
  background: #ffffff;
  cursor: pointer;
  transition: all 0.2s ease;
}

.task-row:hover {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  transform: translateX(2px);
  box-shadow: 4px 0 12px rgba(0, 0, 0, 0.08);
}

.task-row.overdue {
  border-left: 4px solid #ef4444;
  background: linear-gradient(135deg, #fef2f2 0%, #ffffff 100%);
}

.task-row.starting-soon {
  border-left: 4px solid #f59e0b;
  background: linear-gradient(135deg, #fffbeb 0%, #ffffff 100%);
}

.task-row.critical-priority {
  border-left: 4px solid #dc2626;
  background: linear-gradient(135deg, #fef2f2 0%, #ffffff 100%);
}

.task-row.completed {
  background: linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%);
  opacity: 0.8;
}

/* Enhanced task row content */
.task-row-content {
  width: 100%;
  min-height: 56px;
  padding: 12px 20px;
  display: flex;
  align-items: center;
  gap: 12px;
}

/* Enhanced status indicator */
.status-indicator-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  flex-shrink: 0;
}

.status-indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: 2px solid #ffffff;
}

.status-line {
  width: 2px;
  height: 20px;
  opacity: 0.3;
  border-radius: 1px;
}

/* Enhanced task info */
.task-info-container {
  flex-grow: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
}

.task-name {
  font-weight: 600;
  color: #1f2937;
  line-height: 1.4;
  font-size: 0.875rem;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.task-metadata {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.task-project {
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 500;
}

.task-timing {
  font-size: 0.75rem;
  color: #9ca3af;
  background: #f3f4f6;
  padding: 2px 6px;
  border-radius: 4px;
}

/* Enhanced task meta */
.task-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.priority-badge {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 600;
  border: 1px solid;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* Enhanced assigned users */
.assigned-users {
  display: flex;
  gap: -6px;
}

.user-avatar {
  height: 28px;
  width: 28px;
  border-radius: 50%;
  border: 2px solid #ffffff;
  margin-left: -6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.65rem;
  font-weight: 700;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transition: all 0.2s ease;
  position: relative;
  z-index: 1;
}

.user-avatar:hover {
  transform: scale(1.1);
  z-index: 2;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.more-users {
  height: 28px;
  width: 28px;
  border-radius: 50%;
  background: linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%);
  border: 2px solid #ffffff;
  font-size: 0.65rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-left: -6px;
}

/* Enhanced progress container */
.progress-container {
  width: 72px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 4px;
  position: relative;
}

.progress-bar-bg {
  width: 100%;
  height: 8px;
  background: linear-gradient(90deg, #e5e7eb 0%, #f3f4f6 100%);
  border-radius: 6px;
  overflow: hidden;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
}

.progress-bar-fill {
  height: 100%;
  border-radius: 6px;
  transition: width 0.5s ease;
  position: relative;
  overflow: hidden;
}

.progress-bar-fill::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.3) 0%,
    rgba(255, 255, 255, 0) 50%,
    rgba(255, 255, 255, 0.3) 100%
  );
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.progress-bar-fill.low {
  background: linear-gradient(90deg, #ef4444 0%, #f87171 100%);
}
.progress-bar-fill.medium {
  background: linear-gradient(90deg, #f59e0b 0%, #fbbf24 100%);
}
.progress-bar-fill.high {
  background: linear-gradient(90deg, #10b981 0%, #34d399 100%);
}
.progress-bar-fill.complete {
  background: linear-gradient(90deg, #059669 0%, #10b981 100%);
}

.progress-text {
  font-size: 0.7rem;
  text-align: center;
  color: #6b7280;
  font-weight: 600;
  white-space: nowrap;
}

.urgency-indicator {
  position: absolute;
  top: -8px;
  right: -8px;
  font-size: 0.8rem;
  animation: pulse 1.5s infinite;
}

/* Enhanced timeline elements */
.task-timeline-row {
  min-height: 56px;
  height: auto;
  position: relative;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  align-items: stretch;
  transition: all 0.2s ease;
}

.task-timeline-row:hover {
  background: linear-gradient(135deg, #fafbfc 0%, #f8fafc 100%);
}

.task-timeline-row.overdue {
  background: linear-gradient(
    135deg,
    #fef2f2 0%,
    rgba(254, 242, 242, 0.3) 100%
  );
}

.task-timeline-row.starting-soon {
  background: linear-gradient(
    135deg,
    #fffbeb 0%,
    rgba(255, 251, 235, 0.3) 100%
  );
}

.task-timeline-row.critical-priority {
  background: linear-gradient(
    135deg,
    #fef2f2 0%,
    rgba(254, 242, 242, 0.5) 100%
  );
}

/* Enhanced grid background */
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
  transition: all 0.2s ease;
}

.grid-cell.weekend {
  background: linear-gradient(
    180deg,
    rgba(249, 250, 251, 0.5) 0%,
    rgba(243, 244, 246, 0.3) 100%
  );
}

.grid-cell.today {
  background: linear-gradient(
    180deg,
    rgba(254, 242, 242, 0.8) 0%,
    rgba(254, 226, 226, 0.4) 100%
  );
  border-right: 1px solid #fca5a5;
}

.grid-cell.holiday {
  background: linear-gradient(
    180deg,
    rgba(254, 252, 232, 0.6) 0%,
    rgba(254, 243, 199, 0.3) 100%
  );
}

/* Enhanced timeline bars */
.timeline-bar {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  border-radius: 8px;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  cursor: pointer;
  z-index: 10;
  transition: all 0.3s ease;
  border: 1px solid;
  min-height: 32px;
}

.timeline-bar:hover {
  transform: translateY(-50%) scale(1.02);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
  z-index: 15;
}

.task-bar {
  height: 32px;
}

/* Enhanced task bar colors with gradients */
.task-bar.draft {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-color: #cbd5e1;
  color: #475569;
}

.task-bar.planned {
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  border-color: #93c5fd;
  color: #1d4ed8;
}

.task-bar.in_progress {
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  border-color: #86efac;
  color: #16a34a;
}

.task-bar.review {
  background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%);
  border-color: #ddd6fe;
  color: #7c3aed;
}

.task-bar.done {
  background: linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%);
  border-color: #c7d2fe;
  color: #4338ca;
}

.task-bar.cancelled {
  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
  border-color: #fecaca;
  color: #dc2626;
}

/* Enhanced urgency classes */
.task-bar.urgent-overdue {
  border: 2px solid #dc2626;
  box-shadow: 0 0 12px rgba(220, 38, 38, 0.4);
  animation: urgent-pulse 2s infinite;
}

.task-bar.urgent-soon {
  border: 2px solid #f59e0b;
  box-shadow: 0 0 12px rgba(245, 158, 11, 0.4);
}

.task-bar.urgent-critical {
  border: 2px solid #7c2d12;
  box-shadow: 0 0 12px rgba(124, 45, 18, 0.4);
}

@keyframes urgent-pulse {
  0%,
  100% {
    box-shadow: 0 0 12px rgba(220, 38, 38, 0.4);
    transform: translateY(-50%) scale(1);
  }
  50% {
    box-shadow: 0 0 20px rgba(220, 38, 38, 0.8);
    transform: translateY(-50%) scale(1.02);
  }
}

/* Enhanced progress fill */
.progress-fill {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  opacity: 0.4;
  transition: width 0.5s ease;
  border-radius: 8px 0 0 8px;
}

.progress-fill.draft {
  background: linear-gradient(90deg, #94a3b8 0%, #cbd5e1 100%);
}
.progress-fill.planned {
  background: linear-gradient(90deg, #60a5fa 0%, #93c5fd 100%);
}
.progress-fill.in_progress {
  background: linear-gradient(90deg, #34d399 0%, #6ee7b7 100%);
}
.progress-fill.review {
  background: linear-gradient(90deg, #a78bfa 0%, #c4b5fd 100%);
}
.progress-fill.done {
  background: linear-gradient(90deg, #818cf8 0%, #a5b4fc 100%);
}
.progress-fill.cancelled {
  background: linear-gradient(90deg, #f87171 0%, #fca5a5 100%);
}

/* Enhanced bar content */
.bar-content {
  position: relative;
  z-index: 5;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
}

.bar-label {
  flex: 1;
  min-width: 0;
}

.bar-label span {
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1.2;
  color: inherit;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Enhanced priority indicator on bar */
.priority-indicator-bar {
  position: absolute;
  top: -8px;
  left: 8px;
  padding: 2px 6px;
  border-radius: 6px;
  font-size: 0.6rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  border: 1px solid;
}

/* Enhanced assigned users on bar */
.assigned-users-bar {
  position: absolute;
  bottom: -8px;
  right: 8px;
  display: flex;
  gap: -6px;
}

.user-avatar-small {
  height: 20px;
  width: 20px;
  border-radius: 50%;
  border: 2px solid #ffffff;
  margin-left: -6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.6rem;
  font-weight: 700;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

.more-users-small {
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%);
  border: 2px solid #ffffff;
  font-size: 0.6rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  margin-left: -6px;
}

/* Enhanced milestone indicator */
.milestone-indicator {
  position: absolute;
  top: -12px;
  right: -8px;
  font-size: 1rem;
  animation: twinkle 2s infinite;
  z-index: 20;
}

@keyframes twinkle {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.1);
  }
}

/* Enhanced today indicator */
.today-indicator {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 3px;
  z-index: 25;
  pointer-events: none;
}

.today-line {
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, #dc2626 0%, #ef4444 50%, #dc2626 100%);
  box-shadow: 0 0 8px rgba(220, 38, 38, 0.6), 0 0 16px rgba(220, 38, 38, 0.3);
  animation: today-pulse 3s infinite;
}

.today-label {
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%);
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.6rem;
  font-weight: 700;
  white-space: nowrap;
  box-shadow: 0 2px 8px rgba(220, 38, 38, 0.3);
}

@keyframes today-pulse {
  0%,
  100% {
    opacity: 1;
    transform: scaleX(1);
  }
  50% {
    opacity: 0.8;
    transform: scaleX(1.2);
  }
}

/* Row alternating colors with subtle gradients */
.task-timeline-row:nth-child(even) {
  background: linear-gradient(
    135deg,
    rgba(248, 250, 252, 0.3) 0%,
    rgba(241, 245, 249, 0.1) 100%
  );
}

/* Enhanced scrollbar styling */
.gantt-scroll-container::-webkit-scrollbar {
  width: 12px;
  height: 12px;
}

.gantt-scroll-container::-webkit-scrollbar-track {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 6px;
  border: 1px solid #e5e7eb;
}

.gantt-scroll-container::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #cbd5e1 0%, #9ca3af 100%);
  border-radius: 6px;
  border: 2px solid #f8fafc;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
}

.gantt-scroll-container::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #9ca3af 0%, #6b7280 100%);
}

.gantt-scroll-container::-webkit-scrollbar-corner {
  background: #f8fafc;
}

/* Enhanced loading animations */
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Enhanced status indicator colors */
.status-indicator.draft {
  background: linear-gradient(135deg, #94a3b8 0%, #cbd5e1 100%);
}
.status-indicator.planned {
  background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%);
}
.status-indicator.in_progress {
  background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
}
.status-indicator.review {
  background: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%);
}
.status-indicator.done {
  background: linear-gradient(135deg, #6366f1 0%, #818cf8 100%);
}
.status-indicator.cancelled {
  background: linear-gradient(135deg, #ef4444 0%, #f87171 100%);
}

.status-line.draft {
  background: linear-gradient(to bottom, #94a3b8, #cbd5e1);
}
.status-line.planned {
  background: linear-gradient(to bottom, #3b82f6, #60a5fa);
}
.status-line.in_progress {
  background: linear-gradient(to bottom, #10b981, #34d399);
}
.status-line.review {
  background: linear-gradient(to bottom, #8b5cf6, #a78bfa);
}
.status-line.done {
  background: linear-gradient(to bottom, #6366f1, #818cf8);
}
.status-line.cancelled {
  background: linear-gradient(to bottom, #ef4444, #f87171);
}

/* Responsive design improvements */
@media (max-width: 1400px) {
  .task-header,
  .tasks-list {
    width: 350px;
    min-width: 350px;
  }
}

@media (max-width: 1200px) {
  .task-header,
  .tasks-list {
    width: 300px;
    min-width: 300px;
  }

  .task-name {
    font-size: 0.8rem;
    -webkit-line-clamp: 1;
  }

  .assigned-users-bar,
  .priority-indicator-bar {
    display: none;
  }
}

@media (max-width: 1024px) {
  .gantt-main {
    min-width: 800px;
  }

  .task-header,
  .tasks-list {
    width: 250px;
    min-width: 250px;
  }

  .task-row-content {
    padding: 8px 12px;
    gap: 8px;
  }

  .progress-container {
    width: 48px;
  }
}

/* Accessibility improvements */
@media (prefers-reduced-motion: reduce) {
  .timeline-bar,
  .progress-bar-fill,
  .today-indicator,
  .urgency-indicator,
  .milestone-indicator {
    transition: none;
    animation: none;
  }
}

/* Focus states for accessibility */
.task-row:focus,
.timeline-bar:focus {
  outline: 3px solid #3b82f6;
  outline-offset: 2px;
}

.task-row:focus-within {
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .timeline-bar {
    border-width: 2px;
  }

  .status-indicator {
    border-width: 3px;
  }

  .today-indicator .today-line {
    width: 4px;
  }
}
</style>
