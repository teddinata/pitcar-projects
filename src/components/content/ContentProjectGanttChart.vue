<!-- src/components/content/ContentProjectGanttChart.vue -->
<template>
  <div class="bg-white shadow rounded-lg overflow-hidden flex flex-col h-full">
    <!-- Header with controls -->
    <div class="p-4 border-b border-gray-200">
      <div
        class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <!-- Left side: View mode and navigation -->
        <div class="flex flex-col sm:flex-row sm:items-center gap-3">
          <!-- View Mode Toggle -->
          <div class="inline-flex rounded-md shadow-sm">
            <button
              @click="setViewMode('month')"
              class="px-3 py-1.5 text-xs font-medium rounded-l-md border focus:outline-none focus:ring-1 focus:ring-red-500"
              :class="
                viewMode === 'month'
                  ? 'bg-red-600 text-white border-red-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              "
            >
              Month
            </button>
            <button
              @click="setViewMode('week')"
              class="px-3 py-1.5 text-xs font-medium border-t border-b focus:outline-none focus:ring-1 focus:ring-red-500"
              :class="
                viewMode === 'week'
                  ? 'bg-red-600 text-white border-red-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              "
            >
              Week
            </button>
            <button
              @click="setViewMode('day')"
              class="px-3 py-1.5 text-xs font-medium rounded-r-md border focus:outline-none focus:ring-1 focus:ring-red-500"
              :class="
                viewMode === 'day'
                  ? 'bg-red-600 text-white border-red-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              "
            >
              Day
            </button>
          </div>

          <!-- Timeline Navigation -->
          <div class="flex items-center gap-2">
            <button
              @click="moveTimelinePrev"
              class="p-1.5 text-gray-600 hover:text-gray-900 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-red-500"
            >
              <ChevronLeftIcon class="h-4 w-4" />
            </button>

            <div
              class="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-50 rounded border"
            >
              {{ timelinePeriodLabel }}
            </div>

            <button
              @click="moveTimelineNext"
              class="p-1.5 text-gray-600 hover:text-gray-900 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-red-500"
            >
              <ChevronRightIcon class="h-4 w-4" />
            </button>

            <button
              @click="resetTimeline"
              class="p-1.5 text-gray-600 hover:text-gray-900 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-red-500"
              title="Go to today"
            >
              <CalendarIcon class="h-4 w-4" />
            </button>
          </div>
        </div>

        <!-- Right side: Zoom and expand controls -->
        <div class="flex items-center gap-2">
          <!-- Zoom Controls -->
          <div class="flex items-center gap-1">
            <button
              @click="decreaseZoom"
              :disabled="zoomLevel <= minZoomLevel"
              class="p-1.5 text-gray-600 hover:text-gray-900 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <MinusIcon class="h-4 w-4" />
            </button>

            <span class="text-xs text-gray-600 px-2"
              >{{ Math.round(zoomLevel * 100) }}%</span
            >

            <button
              @click="increaseZoom"
              :disabled="zoomLevel >= maxZoomLevel"
              class="p-1.5 text-gray-600 hover:text-gray-900 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <PlusIcon class="h-4 w-4" />
            </button>
          </div>

          <!-- Expand All Button -->
          <button
            @click="toggleExpandAll"
            class="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-red-500"
          >
            {{ allExpanded ? "Collapse All" : "Expand All" }}
          </button>

          <!-- Applied Filters Display -->
          <div v-if="hasActiveFilters" class="flex items-center gap-2">
            <span class="text-xs text-gray-500">Filters:</span>
            <div class="flex gap-1">
              <div
                v-if="stateFilter"
                class="bg-red-50 border border-red-200 text-red-700 text-xs rounded-full px-2 py-1 flex items-center"
              >
                <span>{{ formatState(stateFilter) }}</span>
                <XMarkIcon
                  @click="$emit('clearFilter', 'state')"
                  class="ml-1 h-3 w-3 cursor-pointer hover:text-red-800"
                />
              </div>

              <div
                v-if="startDateFilter || endDateFilter"
                class="bg-red-50 border border-red-200 text-red-700 text-xs rounded-full px-2 py-1 flex items-center"
              >
                <span>{{ formatDateRange() }}</span>
                <XMarkIcon
                  @click="$emit('clearFilter', 'date')"
                  class="ml-1 h-3 w-3 cursor-pointer hover:text-red-800"
                />
              </div>
            </div>

            <button
              @click="$emit('resetFilters')"
              class="text-xs text-gray-500 hover:text-gray-700 underline"
            >
              Reset All
            </button>
          </div>
        </div>
      </div>

      <!-- Date Range Display (when filtered) -->
      <div v-if="dateRangeLabel" class="mt-2 text-sm text-gray-600">
        <span class="font-medium">Showing:</span> {{ dateRangeLabel }}
      </div>
    </div>

    <!-- Gantt Chart Container - Using same structure as TeamProject -->
    <div class="flex-grow overflow-hidden relative">
      <!-- Main Gantt Structure -->
      <div class="gantt-main">
        <!-- Headers Row (Fixed) -->
        <div class="gantt-headers">
          <!-- Left header (Projects & Tasks) -->
          <div class="project-header">
            <h3 class="font-medium text-gray-700">Content Projects & Tasks</h3>
          </div>

          <!-- Right header (Timeline dates) -->
          <div class="timeline-header" ref="timelineHeader">
            <!-- Top row (months) -->
            <div class="month-row">
              <div
                v-for="timeUnit in timeUnits.major"
                :key="timeUnit.key"
                class="month-cell"
                :style="{ width: `${timeUnit.width}px` }"
              >
                <span class="text-xs font-medium text-gray-700">{{
                  timeUnit.label
                }}</span>
              </div>
            </div>

            <!-- Bottom row (days) -->
            <div class="day-row">
              <div
                v-for="timeUnit in timeUnits.minor"
                :key="timeUnit.key"
                :class="[
                  'day-cell',
                  timeUnit.isWeekend ? 'weekend' : '',
                  timeUnit.isToday ? 'today' : '',
                ]"
                :style="{ width: `${getDayWidth()}px` }"
              >
                <span class="text-xs text-gray-500">{{ timeUnit.label }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Scrollable Content Container -->
        <div
          class="gantt-scroll-container"
          @scroll="handleScroll"
          ref="scrollContainer"
        >
          <!-- Table Content -->
          <div class="gantt-table">
            <!-- Left side: Projects & Tasks List -->
            <div class="projects-list" ref="projectsList">
              <template
                v-for="(project, projectIndex) in projects"
                :key="project.id"
              >
                <!-- Project Row -->
                <div
                  :id="`project-row-${project.id}`"
                  class="project-row"
                  :data-row-id="project.id"
                  @click="toggleProject(projectIndex)"
                >
                  <div class="project-row-content">
                    <button class="expand-button">
                      <ChevronRightIcon
                        class="h-4 w-4 transform transition-transform"
                        :class="{ 'rotate-90': project.expanded }"
                      />
                    </button>

                    <div
                      class="status-indicator"
                      :class="getStatusClass(project.state)"
                    ></div>

                    <div class="project-name-container">
                      <div class="project-name">{{ project.name }}</div>
                      <div class="project-meta text-xs text-gray-500">
                        {{ project.task_count || 0 }} tasks
                        <span v-if="project.project_manager_name">
                          • {{ project.project_manager_name }}</span
                        >
                      </div>
                    </div>

                    <div class="progress-container">
                      <div class="progress-bar-bg">
                        <div
                          class="progress-bar-fill"
                          :class="getProgressColorClass(project.progress)"
                          :style="{ width: `${project.progress || 0}%` }"
                        ></div>
                      </div>
                      <div class="progress-text">
                        {{ project.progress || 0 }}%
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Tasks Row (when expanded) -->
                <template v-if="project.expanded">
                  <div
                    v-for="task in project.tasks"
                    :key="task.id"
                    :id="`task-row-${task.id}`"
                    class="task-row"
                    :data-row-id="task.id"
                    @click.stop="handleTaskClick(task)"
                  >
                    <div class="task-row-content">
                      <div
                        class="status-indicator"
                        :class="getStatusClass(task.state)"
                      ></div>

                      <div class="task-name-container">
                        <div class="task-name">{{ task.name }}</div>
                        <div class="task-meta text-xs text-gray-500">
                          <span
                            class="content-type-badge"
                            :class="getContentTypeClass(task.content_type)"
                          >
                            {{ task.content_type }}
                          </span>
                          <span
                            v-if="
                              task.assigned_to && task.assigned_to.length > 0
                            "
                            class="ml-2"
                          >
                            •
                            {{ task.assigned_to.map((u) => u.name).join(", ") }}
                          </span>
                        </div>
                      </div>

                      <div class="progress-container">
                        <div class="progress-bar-bg">
                          <div
                            class="progress-bar-fill"
                            :class="getProgressColorClass(task.progress)"
                            :style="{ width: `${task.progress || 0}%` }"
                          ></div>
                        </div>
                        <div class="progress-text">
                          {{ task.progress || 0 }}%
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    v-if="project.tasks.length === 0"
                    class="empty-tasks-row"
                  >
                    <div class="empty-tasks-message">No tasks found</div>
                  </div>
                </template>
              </template>
            </div>

            <!-- Right side: Timeline Chart -->
            <div class="timeline-chart" ref="timelineChart">
              <template
                v-for="(project, projectIndex) in projects"
                :key="project.id"
              >
                <!-- Project Timeline Row -->
                <div
                  :id="`project-timeline-row-${project.id}`"
                  class="project-timeline-row"
                  :data-row-id="project.id"
                  :class="{ expanded: project.expanded }"
                >
                  <!-- Background grid -->
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
                        ]"
                        :style="{
                          left: `${getTimeUnitPosition(timeUnit)}px`,
                          width: `${getDayWidth()}px`,
                        }"
                      ></div>
                    </template>
                  </div>

                  <!-- Project Bar -->
                  <div
                    v-if="getBarPosition(project).width > 0"
                    class="timeline-bar project-bar"
                    :class="getProjectBarClass(project.state)"
                    :style="{
                      left: `${getBarPosition(project).left}px`,
                      width: `${getBarPosition(project).width}px`,
                    }"
                    @click.stop="handleProjectClick(project)"
                    :title="getProjectTooltip(project)"
                  >
                    <!-- Progress fill -->
                    <div
                      class="progress-fill"
                      :class="getProgressFillClass(project.state)"
                      :style="{ width: `${project.progress || 0}%` }"
                    ></div>

                    <!-- Bar label -->
                    <div
                      v-if="getBarPosition(project).width > 50"
                      class="bar-label"
                    >
                      <span>{{ project.name }}</span>
                    </div>
                  </div>

                  <!-- Today indicator -->
                  <div
                    v-if="isTodayVisible"
                    class="today-indicator"
                    :style="{ left: `${getTodayPosition()}px` }"
                  ></div>
                </div>

                <!-- Tasks Timeline (when project expanded) -->
                <template v-if="project.expanded">
                  <div
                    v-for="task in project.tasks"
                    :key="task.id"
                    :id="`task-timeline-row-${task.id}`"
                    class="task-timeline-row"
                    :data-row-id="task.id"
                  >
                    <!-- Background grid -->
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
                          ]"
                          :style="{
                            left: `${getTimeUnitPosition(timeUnit)}px`,
                            width: `${getDayWidth()}px`,
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
                        width: `${getBarPosition(task).width}px`,
                      }"
                      @click.stop="handleTaskClick(task)"
                      :title="getTaskTooltip(task, project)"
                    >
                      <!-- Progress fill -->
                      <div
                        class="progress-fill"
                        :class="getProgressFillClass(task.state)"
                        :style="{ width: `${task.progress || 0}%` }"
                      ></div>

                      <!-- Bar label -->
                      <div
                        v-if="getBarPosition(task).width > 50"
                        class="bar-label"
                      >
                        <span>{{ task.name }}</span>
                      </div>

                      <!-- Content Type Indicator -->
                      <div
                        v-if="getBarPosition(task).width > 100"
                        class="content-type-indicator"
                        :class="getContentTypeClass(task.content_type)"
                      >
                        {{ task.content_type?.charAt(0).toUpperCase() }}
                      </div>

                      <!-- Assigned Users -->
                      <div
                        v-if="
                          task.assigned_to &&
                          task.assigned_to.length > 0 &&
                          getBarPosition(task).width > 150
                        "
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
                  <div
                    v-if="project.tasks.length === 0"
                    class="empty-tasks-timeline-row"
                  ></div>
                </template>
              </template>
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
        <div
          class="animate-spin rounded-full h-10 w-10 border-2 border-red-600 border-t-transparent"
        ></div>
        <p class="mt-2 text-sm text-gray-600">Loading timeline...</p>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-if="!loading && projects.length === 0"
      class="absolute inset-0 flex items-center justify-center"
    >
      <div class="text-center">
        <DocumentIcon class="mx-auto h-12 w-12 text-gray-400" />
        <h3 class="mt-2 text-sm font-medium text-gray-900">
          No projects found
        </h3>
        <p class="mt-1 text-sm text-gray-500">
          No content projects match the current filters.
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
  CalendarIcon,
  XMarkIcon,
  DocumentIcon,
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
} from "date-fns";
import apiClient from "@/config/api";

const props = defineProps({
  startDateFilter: {
    type: String,
    default: null,
  },
  endDateFilter: {
    type: String,
    default: null,
  },
  stateFilter: {
    type: String,
    default: null,
  },
  projectManagerFilter: {
    type: [Number, String],
    default: null,
  },
  sortField: {
    type: String,
    default: "date_start",
  },
  sortOrder: {
    type: String,
    default: "asc",
  },
});

const emit = defineEmits([
  "view-project-detail",
  "edit-task",
  "update:dateRange",
  "clearFilter",
  "resetFilters",
]);

// State - same as TeamProject Gantt
const projects = ref([]);
const loading = ref(false);
const startDate = ref(new Date());
const viewMode = ref("month");
const zoomLevel = ref(1);
const minZoomLevel = ref(0.5);
const maxZoomLevel = ref(3);
const allExpanded = ref(false);
const isInternalNavigation = ref(false);

// Computed properties
const hasActiveFilters = computed(() => {
  return (
    props.stateFilter ||
    props.startDateFilter ||
    props.endDateFilter ||
    props.projectManagerFilter
  );
});

const timelinePeriodLabel = computed(() => {
  if (viewMode.value === "month") {
    const monthStart = startOfMonth(startDate.value);
    return format(monthStart, "MMMM yyyy");
  } else if (viewMode.value === "week") {
    const weekStart = startOfWeek(startDate.value, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(startDate.value, { weekStartsOn: 1 });
    return `${format(weekStart, "MMM d")} - ${format(weekEnd, "MMM d, yyyy")}`;
  } else {
    const dayStart = startDate.value;
    const dayEnd = addDays(startDate.value, 14);
    return `${format(dayStart, "MMM d")} - ${format(dayEnd, "MMM d, yyyy")}`;
  }
});

const dateRangeLabel = computed(() => {
  if (props.startDateFilter && props.endDateFilter) {
    try {
      const start = format(parseISO(props.startDateFilter), "MMM d, yyyy");
      const end = format(parseISO(props.endDateFilter), "MMM d, yyyy");
      return `${start} - ${end}`;
    } catch (e) {
      return `${props.startDateFilter} - ${props.endDateFilter}`;
    }
  }
  return "";
});

const effectiveDateRange = computed(() => {
  let rangeStart, rangeEnd;

  if (viewMode.value === "month") {
    rangeStart = startOfMonth(startDate.value);
    rangeEnd = endOfMonth(startDate.value);
  } else if (viewMode.value === "week") {
    rangeStart = startOfWeek(startDate.value, { weekStartsOn: 1 });
    rangeEnd = endOfWeek(startDate.value, { weekStartsOn: 1 });
  } else {
    rangeStart = startDate.value;
    rangeEnd = addDays(startDate.value, 14);
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

  if (isNaN(rangeStart.getTime()) || isNaN(rangeEnd.getTime())) {
    const today = new Date();
    rangeStart = startOfMonth(today);
    rangeEnd = endOfMonth(today);
  }

  return { start: rangeStart, end: rangeEnd };
});

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

    // Major time units (months)
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

    // Minor time units (days)
    const minorUnits = days.map((day) => ({
      key: format(day, "yyyy-MM-dd"),
      label: format(day, "d"),
      date: day,
      isWeekend: isWeekend(day),
      isToday: isToday(day),
      monthLabel: format(day, "MMM"),
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

// Methods - adapted from TeamProject Gantt
function fetchProjects() {
  loading.value = true;

  const params = {
    jsonrpc: "2.0",
    id: new Date().getTime(),
    params: {},
  };

  let dateStart, dateEnd;

  if (
    props.startDateFilter &&
    props.endDateFilter &&
    !isInternalNavigation.value
  ) {
    dateStart = props.startDateFilter;
    dateEnd = props.endDateFilter;
  } else {
    const dateRange = effectiveDateRange.value;
    dateStart = format(dateRange.start, "yyyy-MM-dd");
    dateEnd = format(dateRange.end, "yyyy-MM-dd");
  }

  params.params.date_start = dateStart;
  params.params.date_end = dateEnd;

  if (props.stateFilter) {
    params.params.state = props.stateFilter;
  }

  if (props.projectManagerFilter) {
    params.params.project_manager_id = parseInt(props.projectManagerFilter);
  }

  if (props.sortField) {
    params.params.sort_field = props.sortField;
  }

  if (props.sortOrder) {
    params.params.sort_order = props.sortOrder;
  }

  console.log(
    "Fetching Content Gantt data with params:",
    JSON.stringify(params)
  );

  // Use the new content timeline API
  apiClient
    .post("/web/v2/content/dashboard/timeline", params)
    .then((response) => {
      if (response.data.result?.status === "success") {
        console.log("Content Gantt data fetched successfully");
        const projectsData = response.data.result.data || [];
        projects.value = projectsData.map((project) => {
          let startDate, endDate;
          try {
            startDate = project.start ? parseISO(project.start) : new Date();
          } catch (e) {
            console.warn("Invalid start date for project:", project.id);
            startDate = new Date();
          }

          try {
            endDate = project.end
              ? parseISO(project.end)
              : addDays(new Date(), 30);
          } catch (e) {
            console.warn("Invalid end date for project:", project.id);
            endDate = addDays(new Date(), 30);
          }

          return {
            id: project.id,
            name: project.name,
            startDate: project.start || null,
            endDate: project.end || null,
            start: startDate,
            end: endDate,
            progress: project.progress || 0,
            state: project.state || "draft",
            expanded: false,
            project_manager_name: project.project_manager_name || "",
            task_count: project.children ? project.children.length : 0,
            tasks: (project.children || []).map((task) => {
              let taskStartDate, taskEndDate;
              try {
                taskStartDate = task.start ? parseISO(task.start) : new Date();
              } catch (e) {
                console.warn("Invalid start date for task:", task.id);
                taskStartDate = new Date();
              }

              try {
                taskEndDate = task.end
                  ? parseISO(task.end)
                  : addDays(new Date(), 7);
              } catch (e) {
                console.warn("Invalid end date for task:", task.id);
                taskEndDate = addDays(new Date(), 7);
              }

              return {
                id: task.id,
                name: task.name,
                startDate: task.start || null,
                endDate: task.end || null,
                start: taskStartDate,
                end: taskEndDate,
                progress: task.progress || 0,
                state: task.state || "draft",
                content_type: task.content_type || "other",
                assigned_to: task.assigned_to || [],
              };
            }),
          };
        });
      } else {
        console.error(
          "Error fetching Content Gantt data:",
          response.data.result?.message
        );
      }
    })
    .catch((err) => {
      console.error("API error fetching content project timeline data:", err);
    })
    .finally(() => {
      loading.value = false;
    });
}

// Timeline methods - same as TeamProject
function getDayWidth() {
  const baseDayWidth = 30;
  return baseDayWidth * zoomLevel.value;
}

function getTimeUnitPosition(timeUnit) {
  const viewStart = effectiveDateRange.value.start;
  const daysFromViewStart = differenceInDays(timeUnit.date, viewStart);
  return daysFromViewStart * getDayWidth();
}

function getBarPosition(item) {
  if (!item || !item.start || !item.end) {
    return { left: 0, width: 0 };
  }

  try {
    const viewStart = effectiveDateRange.value.start;
    const viewEnd = effectiveDateRange.value.end;

    const itemStartDate =
      typeof item.start === "string" ? parseISO(item.start) : item.start;
    const itemEndDate =
      typeof item.end === "string" ? parseISO(item.end) : item.end;

    if (
      !itemStartDate ||
      !itemEndDate ||
      isNaN(itemStartDate.getTime()) ||
      isNaN(itemEndDate.getTime())
    ) {
      return { left: 0, width: 0 };
    }

    if (itemEndDate < viewStart || itemStartDate > viewEnd) {
      return { left: 0, width: 0 };
    }

    const effectiveStart =
      itemStartDate < viewStart ? viewStart : itemStartDate;
    const daysFromViewStart = differenceInDays(effectiveStart, viewStart);
    const leftPosition = daysFromViewStart * getDayWidth();

    const effectiveEnd = itemEndDate > viewEnd ? viewEnd : itemEndDate;
    const itemDuration = differenceInDays(effectiveEnd, effectiveStart) + 1;
    const width = itemDuration * getDayWidth();

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

    if (!viewStart || isNaN(viewStart.getTime())) {
      return 0;
    }

    const daysFromViewStart = differenceInDays(today, viewStart);
    return Math.max(0, daysFromViewStart * getDayWidth());
  } catch (error) {
    console.error("Error calculating today position:", error);
    return 0;
  }
}

// Navigation methods
function moveTimelinePrev() {
  try {
    isInternalNavigation.value = true;

    if (viewMode.value === "month") {
      startDate.value = subMonths(startDate.value, 1);
    } else if (viewMode.value === "week") {
      startDate.value = subWeeks(startDate.value, 1);
    } else {
      startDate.value = subDays(startDate.value, 14);
    }

    const range = effectiveDateRange.value;

    emit("update:dateRange", {
      start: format(range.start, "yyyy-MM-dd"),
      end: format(range.end, "yyyy-MM-dd"),
    });

    fetchProjects();
  } catch (error) {
    console.error("Error navigating to previous period:", error);
  }
}

function moveTimelineNext() {
  try {
    isInternalNavigation.value = true;

    if (viewMode.value === "month") {
      startDate.value = addMonths(startDate.value, 1);
    } else if (viewMode.value === "week") {
      startDate.value = addWeeks(startDate.value, 1);
    } else {
      startDate.value = addDays(startDate.value, 14);
    }

    const range = effectiveDateRange.value;

    emit("update:dateRange", {
      start: format(range.start, "yyyy-MM-dd"),
      end: format(range.end, "yyyy-MM-dd"),
    });

    fetchProjects();
  } catch (error) {
    console.error("Error navigating to next period:", error);
  }
}

function resetTimeline() {
  try {
    isInternalNavigation.value = true;
    startDate.value = new Date();

    const newRange = effectiveDateRange.value;

    emit("update:dateRange", {
      start: format(newRange.start, "yyyy-MM-dd"),
      end: format(newRange.end, "yyyy-MM-dd"),
    });

    fetchProjects();
  } catch (error) {
    console.error("Error resetting timeline:", error);
  } finally {
    isInternalNavigation.value = false;
  }
}

function setViewMode(mode) {
  try {
    if (viewMode.value === mode) return;

    isInternalNavigation.value = true;
    viewMode.value = mode;

    const newRange = effectiveDateRange.value;

    emit("update:dateRange", {
      start: format(newRange.start, "yyyy-MM-dd"),
      end: format(newRange.end, "yyyy-MM-dd"),
    });

    fetchProjects();
  } catch (error) {
    console.error("Error changing view mode:", error);
  } finally {
    isInternalNavigation.value = false;
  }
}

// Zoom methods
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

// Project and task interaction
function toggleProject(projectIndex) {
  projects.value[projectIndex].expanded =
    !projects.value[projectIndex].expanded;
  allExpanded.value = projects.value.every((project) => project.expanded);

  nextTick(() => {
    syncRowHeights();
  });
}

function toggleExpandAll() {
  allExpanded.value = !allExpanded.value;
  projects.value.forEach((project) => {
    project.expanded = allExpanded.value;
  });

  nextTick(() => {
    syncRowHeights();
  });
}

function handleProjectClick(project) {
  if (!project || !project.id) {
    console.warn("Attempted to view invalid project");
    return;
  }

  emit("view-project-detail", project);
}

function handleTaskClick(task) {
  if (!task || !task.id) {
    console.warn("Attempted to view invalid task");
    return;
  }

  emit("edit-task", task);
}

// Helper methods for formatting and tooltips
function formatState(state) {
  return state
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatDateRange() {
  const start = props.startDateFilter;
  const end = props.endDateFilter;

  if (start && end) {
    return `${start} to ${end}`;
  } else if (start) {
    return `From ${start}`;
  } else if (end) {
    return `Until ${end}`;
  }

  return "Date Range";
}

function getProjectTooltip(project) {
  if (!project) return "";

  let tooltip = `Project: ${project.name || "Unnamed Project"}\n`;

  try {
    if (project.startDate) {
      tooltip += `Start: ${format(
        parseISO(project.startDate),
        "MMMM d, yyyy"
      )}\n`;
    }
  } catch (e) {
    tooltip += "Start: Not set\n";
  }

  try {
    if (project.endDate) {
      tooltip += `End: ${format(parseISO(project.endDate), "MMMM d, yyyy")}\n`;
    }
  } catch (e) {
    tooltip += "End: Not set\n";
  }

  tooltip += `Progress: ${project.progress || 0}%\n`;
  tooltip += `Status: ${formatState(project.state)}\n`;
  tooltip += `Tasks: ${project.task_count || 0}`;

  return tooltip;
}

function getTaskTooltip(task, project) {
  if (!task) return "";

  let tooltip = `Task: ${task.name || "Unnamed Task"}\n`;

  if (project) {
    tooltip += `Project: ${project.name || "Unnamed Project"}\n`;
  }

  tooltip += `Type: ${task.content_type || "Other"}\n`;

  try {
    if (task.startDate) {
      tooltip += `Start: ${format(parseISO(task.startDate), "MMMM d, yyyy")}\n`;
    }
  } catch (e) {
    tooltip += "Start: Not set\n";
  }

  try {
    if (task.endDate) {
      tooltip += `End: ${format(parseISO(task.endDate), "MMMM d, yyyy")}\n`;
    }
  } catch (e) {
    tooltip += "End: Not set\n";
  }

  tooltip += `Progress: ${task.progress || 0}%\n`;
  tooltip += `Status: ${formatState(task.state)}`;

  if (task.assigned_to && task.assigned_to.length > 0) {
    tooltip += `\nAssigned to: ${task.assigned_to
      .map((u) => u.name)
      .join(", ")}`;
  }

  return tooltip;
}

// Visual styling helper methods
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
  return state || "draft";
}

function getProgressColorClass(progress) {
  if (progress >= 100) return "complete";
  if (progress >= 66) return "high";
  if (progress >= 33) return "medium";
  return "low";
}

function getProjectBarClass(state) {
  return state || "draft";
}

function getTaskBarClass(state) {
  return state || "draft";
}

function getProgressFillClass(state) {
  return state || "draft";
}

function getContentTypeClass(contentType) {
  const classes = {
    video: "bg-purple-100 text-purple-800",
    design: "bg-blue-100 text-blue-800",
    copy: "bg-green-100 text-green-800",
    social: "bg-pink-100 text-pink-800",
    blog: "bg-yellow-100 text-yellow-800",
    other: "bg-gray-100 text-gray-800",
  };

  return classes[contentType] || classes["other"];
}

// References and scroll handling
const scrollContainer = ref(null);
const timelineHeader = ref(null);
const projectsList = ref(null);
const timelineChart = ref(null);

function handleScroll(e) {
  if (timelineHeader.value) {
    timelineHeader.value.scrollLeft = e.target.scrollLeft;
  }
}

function syncRowHeights() {
  nextTick(() => {
    projects.value.forEach((project) => {
      const leftRow = document.getElementById(`project-row-${project.id}`);
      const rightRow = document.getElementById(
        `project-timeline-row-${project.id}`
      );

      if (leftRow && rightRow) {
        const height = Math.max(
          leftRow.scrollHeight,
          rightRow.scrollHeight,
          48
        );
        leftRow.style.height = `${height}px`;
        rightRow.style.height = `${height}px`;
      }

      if (project.expanded) {
        project.tasks.forEach((task) => {
          const leftTaskRow = document.getElementById(`task-row-${task.id}`);
          const rightTaskRow = document.getElementById(
            `task-timeline-row-${task.id}`
          );

          if (leftTaskRow && rightTaskRow) {
            const taskHeight = Math.max(
              leftTaskRow.scrollHeight,
              rightTaskRow.scrollHeight,
              40
            );
            leftTaskRow.style.height = `${taskHeight}px`;
            rightTaskRow.style.height = `${taskHeight}px`;
          }
        });
      }
    });
  });
}

// Lifecycle hooks
let resizeObserver = null;

onMounted(() => {
  console.log("Content Gantt Chart component mounted");

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

  fetchProjects();

  resizeObserver = new ResizeObserver((entries) => {
    syncRowHeights();
  });

  if (scrollContainer.value) {
    resizeObserver.observe(scrollContainer.value);
  }

  syncRowHeights();

  watch(
    () => projects.value.map((p) => p.expanded),
    () => {
      nextTick(() => {
        syncRowHeights();
      });
    },
    { deep: true }
  );

  window.addEventListener("resize", syncRowHeights);
});

onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect();
  }

  window.removeEventListener("resize", syncRowHeights);
});

// Watch for prop changes
watch(
  [
    () => props.startDateFilter,
    () => props.endDateFilter,
    () => props.stateFilter,
    () => props.projectManagerFilter,
  ],
  (
    [newStart, newEnd, newState, newManager],
    [oldStart, oldEnd, oldState, oldManager]
  ) => {
    console.log("Content Gantt filter change detected");

    if (
      (newStart !== oldStart ||
        newEnd !== oldEnd ||
        newState !== oldState ||
        newManager !== oldManager) &&
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

      fetchProjects();
    }
  }
);

watch(loading, (newVal, oldVal) => {
  if (oldVal === true && newVal === false) {
    isInternalNavigation.value = false;
  }
});
</script>

<!-- Same styles as TeamProject Gantt Chart but with some content-specific additions -->
<style scoped>
/* Import all the same styles from TeamProject Gantt Chart */
/* Base layout */
.gantt-main {
  height: calc(100vh - 180px);
  min-height: 500px;
  min-width: 1000px;
  position: relative;
  display: flex;
  flex-direction: column;
  background-color: white;
}

/* Content-specific additions */
.content-type-badge {
  display: inline-block;
  padding: 2px 6px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
}

.content-type-indicator {
  position: absolute;
  top: 2px;
  right: 2px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: bold;
  color: white;
  background-color: rgba(0, 0, 0, 0.6);
}

.project-meta,
.task-meta {
  margin-top: 2px;
  line-height: 1.2;
}

/* All other styles from TeamProject Gantt Chart... */
/* (Copy all the existing styles from ProjectGanttChart.vue) */

/* Headers styling */
.gantt-headers {
  display: flex;
  position: sticky;
  top: 0;
  z-index: 10;
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

@media (min-width: 768px) {
  .project-header {
    width: 380px;
    min-width: 380px;
  }
}

@media (min-width: 1024px) {
  .project-header {
    width: 420px;
    min-width: 420px;
  }
}

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

.day-cell.weekend {
  background-color: #f1f5f9;
}

.day-cell.today {
  background-color: #fef2f2;
  color: #dc2626;
  font-weight: 600;
}

.gantt-scroll-container {
  flex: 1;
  overflow: auto;
  position: relative;
  background-color: white;
}

.gantt-table {
  display: flex;
  min-height: 100%;
}

.projects-list {
  width: 320px;
  min-width: 320px;
  background-color: white;
  border-right: 1px solid #e2e8f0;
  position: sticky;
  left: 0;
  z-index: 9;
  flex-shrink: 0;
}

@media (min-width: 768px) {
  .projects-list {
    width: 380px;
    min-width: 380px;
  }
}

@media (min-width: 1024px) {
  .projects-list {
    width: 420px;
    min-width: 420px;
  }
}

@media (min-width: 1280px) {
  .projects-list {
    width: 480px;
    min-width: 480px;
  }
}

.timeline-chart {
  flex: 1;
  background-color: white;
}

/* Row styling */
.project-row,
.project-timeline-row {
  min-height: 48px;
  height: auto;
  position: relative;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  align-items: stretch;
}

.project-row {
  background-color: white;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.project-row:hover {
  background-color: #f8fafc;
}

.project-row-content {
  width: 100%;
  min-height: 48px;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.task-row,
.task-timeline-row {
  min-height: 40px;
  height: auto;
  position: relative;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  align-items: stretch;
}

.task-row {
  background-color: #fafbfc;
  padding-left: 24px;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.task-row:hover {
  background-color: #f1f5f9;
}

.task-row-content {
  width: 100%;
  min-height: 40px;
  padding: 6px 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.empty-tasks-row {
  background-color: #fafbfc;
  padding-left: 40px;
  display: flex;
  align-items: center;
  min-height: 40px;
}

.empty-tasks-message {
  font-style: italic;
  color: #94a3b8;
  font-size: 0.875rem;
}

/* Content elements */
.expand-button {
  color: #94a3b8;
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.15s ease;
  border: none;
  background: none;
  cursor: pointer;
}

.expand-button:hover {
  color: #475569;
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.status-indicator.draft {
  background-color: #94a3b8;
}
.status-indicator.planning {
  background-color: #3b82f6;
}
.status-indicator.in_progress {
  background-color: #10b981;
}
.status-indicator.on_hold {
  background-color: #f59e0b;
}
.status-indicator.review {
  background-color: #8b5cf6;
}
.status-indicator.completed {
  background-color: #6366f1;
}
.status-indicator.done {
  background-color: #6366f1;
}
.status-indicator.cancelled {
  background-color: #ef4444;
}

.project-name-container,
.task-name-container {
  flex-grow: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.project-name {
  font-weight: 600;
  color: #1e293b;
  line-height: 1.4;
  font-size: 0.875rem;
}

.task-name {
  font-size: 0.8125rem;
  color: #334155;
  line-height: 1.4;
  font-weight: 500;
}

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

.progress-bar-fill.low {
  background-color: #ef4444;
}
.progress-bar-fill.medium {
  background-color: #f59e0b;
}
.progress-bar-fill.high {
  background-color: #10b981;
}
.progress-bar-fill.complete {
  background-color: #059669;
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

.timeline-bar {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  border-radius: 0.375rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  cursor: pointer;
  z-index: 10;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.timeline-bar:hover {
  transform: translateY(-50%) scale(1.02);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.project-bar {
  height: 28px;
  border: 1px solid;
}

.task-bar {
  height: 24px;
  border: 1px solid;
}

/* Project bar colors */
.project-bar.draft {
  background-color: #f8fafc;
  border-color: #cbd5e1;
  color: #475569;
}
.project-bar.planning {
  background-color: #eff6ff;
  border-color: #93c5fd;
  color: #1d4ed8;
}
.project-bar.in_progress {
  background-color: #f0fdf4;
  border-color: #86efac;
  color: #16a34a;
}
.project-bar.on_hold {
  background-color: #fefce8;
  border-color: #fde047;
  color: #ca8a04;
}
.project-bar.completed {
  background-color: #f0f9ff;
  border-color: #7dd3fc;
  color: #0284c7;
}
.project-bar.cancelled {
  background-color: #fef2f2;
  border-color: #fca5a5;
  color: #dc2626;
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

.progress-fill {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  opacity: 0.6;
  transition: width 0.3s ease;
}

.progress-fill.draft {
  background-color: #94a3b8;
}
.progress-fill.planning {
  background-color: #60a5fa;
}
.progress-fill.in_progress {
  background-color: #34d399;
}
.progress-fill.on_hold {
  background-color: #fbbf24;
}
.progress-fill.review {
  background-color: #a78bfa;
}
.progress-fill.completed {
  background-color: #38bdf8;
}
.progress-fill.done {
  background-color: #818cf8;
}
.progress-fill.cancelled {
  background-color: #f87171;
}
.progress-fill.planned {
  background-color: #7dd3fc;
}

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

.assigned-users {
  position: absolute;
  bottom: -6px;
  right: 6px;
  display: flex;
  gap: -4px;
}

.user-avatar {
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background-color: #f1f5f9;
  border: 2px solid white;
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
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background-color: #e2e8f0;
  border: 2px solid white;
  font-size: 0.625rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #475569;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.today-indicator {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 2px;
  background-color: #dc2626;
  z-index: 10;
  box-shadow: 0 0 4px rgba(220, 38, 38, 0.5);
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.project-timeline-row:nth-child(odd) {
  background-color: #fafbfc;
}

.task-timeline-row:nth-child(odd) {
  background-color: #f8fafc;
}

.empty-tasks-timeline-row {
  min-height: 40px;
  background-color: #fafbfc;
  border-bottom: 1px solid #f1f5f9;
}

.gantt-scroll-container::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.gantt-scroll-container::-webkit-scrollbar-track {
  background-color: #f8fafc;
  border-radius: 4px;
}

.gantt-scroll-container::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 4px;
  border: 1px solid #f8fafc;
}

.gantt-scroll-container::-webkit-scrollbar-thumb:hover {
  background-color: #94a3b8;
}

.gantt-scroll-container::-webkit-scrollbar-corner {
  background-color: #f8fafc;
}

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

@media (prefers-reduced-motion: reduce) {
  .timeline-bar,
  .progress-bar-fill,
  .expand-button,
  .today-indicator {
    transition: none;
    animation: none;
  }
}

.expand-button:focus,
.timeline-bar:focus,
.project-row:focus,
.task-row:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}
</style>
