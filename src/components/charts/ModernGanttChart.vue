<!-- src/components/team/ImprovedGanttChart.vue -->
<template>
  <div class="bg-white shadow rounded-lg overflow-hidden flex flex-col h-full">
    <!-- Header dengan filter dan kontrol -->
    <div class="p-4 border-b border-gray-200">
      <div class="flex flex-col space-y-3 md:flex-row md:items-center md:justify-between">
        <!-- Judul dengan indikator filter -->
        <div class="flex flex-col">
          <h2 class="text-xl font-semibold text-gray-900">Timeline Proyek</h2>
          
          <!-- Indikator filter aktif -->
          <div class="flex flex-wrap gap-2 mt-2 items-center text-sm text-gray-600">
            <span v-if="departmentName" class="bg-red-50 border border-red-200 text-red-700 text-xs rounded-full px-2.5 py-1 flex items-center">
              {{ departmentName }}
              <XMarkIcon 
                @click="$emit('clearFilter', 'department_id')" 
                class="ml-1 h-3.5 w-3.5 cursor-pointer hover:text-red-800" 
              />
            </span>
            <span v-if="dateRangeLabel" class="bg-blue-50 border border-blue-200 text-blue-700 text-xs rounded-full px-2.5 py-1 flex items-center">
              {{ dateRangeLabel }}
            </span>
            <span v-if="!departmentName && !dateRangeLabel" class="text-gray-500 text-xs">
              Menampilkan semua proyek
            </span>
          </div>
        </div>

        <!-- Kontrol -->
        <div class="flex flex-wrap gap-2 items-center">
          <!-- Navigasi rentang waktu -->
          <div class="inline-flex items-center rounded-md shadow-sm">
            <button
              @click="moveTimelinePrev"
              class="px-2.5 py-1.5 border border-gray-300 rounded-l-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-red-500"
              title="Periode Sebelumnya"
            >
              <ChevronLeftIcon class="h-4 w-4" />
            </button>
            <button
              @click="resetTimeline"
              class="px-3 py-1.5 border-t border-b border-gray-300 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-red-500"
              title="Kembali ke hari ini"
            >
              Hari Ini
            </button>
            <button
              @click="moveTimelineNext"
              class="px-2.5 py-1.5 border border-gray-300 rounded-r-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-red-500"
              title="Periode Berikutnya"
            >
              <ChevronRightIcon class="h-4 w-4" />
            </button>
          </div>

          <!-- Pemilih skala waktu -->
          <div class="inline-flex rounded-md shadow-sm">
            <button
              @click="setViewMode('day')"
              class="px-3 py-1.5 text-sm font-medium rounded-l-md focus:outline-none focus:ring-1 focus:ring-red-500"
              :class="viewMode === 'day' ? 'bg-red-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'"
            >
              Hari
            </button>
            <button
              @click="setViewMode('week')"
              class="px-3 py-1.5 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-red-500"
              :class="viewMode === 'week' ? 'bg-red-600 text-white' : 'bg-white text-gray-700 border-t border-b border-gray-300 hover:bg-gray-50'"
            >
              Minggu
            </button>
            <button
              @click="setViewMode('month')"
              class="px-3 py-1.5 text-sm font-medium rounded-r-md focus:outline-none focus:ring-1 focus:ring-red-500"
              :class="viewMode === 'month' ? 'bg-red-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'"
            >
              Bulan
            </button>
          </div>

          <!-- Kontrol zoom -->
          <div class="inline-flex rounded-md shadow-sm">
            <button
              @click="decreaseZoom"
              class="px-2.5 py-1.5 border border-gray-300 rounded-l-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-red-500 disabled:opacity-50"
              :disabled="zoomLevel <= minZoomLevel"
              title="Perkecil"
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
              title="Perbesar"
            >
              <PlusIcon class="h-4 w-4" />
            </button>
          </div>

          <!-- Expand/Collapse All -->
          <button
            @click="toggleExpandAll"
            class="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-red-500"
            :title="allExpanded ? 'Ciutkan Semua' : 'Perluas Semua'"
          >
            <ChevronRightIcon
              class="h-4 w-4 mr-1 transform transition-transform"
              :class="{ 'rotate-90': allExpanded }"
            />
            {{ allExpanded ? 'Ciutkan Semua' : 'Perluas Semua' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Container Gantt Chart -->
    <div class="flex-grow overflow-auto">
      <!-- Project Gantt Chart -->
      <div class="gantt-container grid grid-cols-[minmax(250px,auto)_1fr]" style="min-width: 1000px; min-height: 400px">
        <!-- Sisi kiri: Nama proyek & tugas dengan header sticky -->
        <div class="project-names bg-white">
          <!-- Header -->
          <div class="h-16 sticky top-0 z-10 border-b border-gray-200 bg-gray-50 px-4 flex items-end">
            <h3 class="font-medium text-gray-700 pb-2">Proyek & Tugas</h3>
          </div>

          <!-- Daftar proyek -->
          <div class="project-list divide-y divide-gray-200">
            <div
              v-for="(project, projectIndex) in projects"
              :key="project.id"
              class="project-item"
            >
              <!-- Baris proyek -->
              <div 
                class="project-row group flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer"
                @click="toggleProject(projectIndex)"
                :class="{'bg-gray-50': project.expanded}"
              >
                <!-- Ikon expand/collapse -->
                <button class="mr-2 flex-shrink-0 text-gray-400">
                  <ChevronRightIcon 
                    class="h-4.5 w-4.5 transform transition-transform" 
                    :class="{ 'rotate-90': project.expanded, 'text-gray-600': project.expanded }"
                  />
                </button>
                
                <!-- Indikator status proyek dengan warna -->
                <div class="w-2 h-2 rounded-full mr-2 flex-shrink-0" :class="getStatusIndicatorClass(project.state)"></div>
                
                <!-- Nama proyek -->
                <div class="flex-grow mr-3">
                  <div class="font-medium text-gray-900 truncate">{{ project.name }}</div>
                </div>
                
                <!-- Tanggal proyek - fitur baru -->
                <!-- <div class="mr-4 text-xs text-gray-500 hidden sm:flex items-center">
                  <CalendarIcon class="h-3.5 w-3.5 mr-1 text-gray-400" />
                  <span>{{ formatDateShort(project.start) }} - {{ formatDateShort(project.end) }}</span>
                </div> -->
                
                <!-- Indikator progres proyek -->
                <div class="w-14 flex-shrink-0">
                  <div class="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      class="h-1.5 rounded-full" 
                      :class="getProgressBarColorClass(project.progress)"
                      :style="{ width: `${project.progress || 0}%` }"
                    ></div>
                  </div>
                  <div class="text-xs text-center text-gray-500 mt-0.5">{{ project.progress || 0 }}%</div>
                </div>
              </div>

              <!-- Baris tugas (ketika diperluas) -->
              <div v-if="project.expanded" class="task-list bg-gray-50">
                <div
                  v-for="task in project.tasks"
                  :key="task.id"
                  class="task-row flex items-center px-4 py-2.5 hover:bg-gray-100 pl-10 border-t border-gray-100 cursor-pointer"
                  @click.stop="handleTaskClick(task)"
                >
                  <!-- Indikator status tugas -->
                  <div class="w-2 h-2 rounded-full mr-2" :class="getStatusIndicatorClass(task.state)"></div>
                  
                  <!-- Nama tugas -->
                  <div class="flex-grow mr-3">
                    <div class="text-sm text-gray-900 truncate">{{ task.name }}</div>
                  </div>
                  
                  <!-- Due date tugas - fitur baru -->
                  <!-- <div class="mr-3 text-xs text-gray-500 hidden sm:flex items-center">
                    <CalendarIcon class="h-3.5 w-3.5 mr-1 text-gray-400" />
                    <span>{{ formatDateShort(task.end) }}</span>
                  </div> -->
                  
                  <!-- Avatar pengguna yang ditugaskan - fitur baru -->
                  <div v-if="task.assigned_to && task.assigned_to.length > 0" class="mr-3 flex -space-x-1.5">
                    <div 
                      v-for="(user, index) in task.assigned_to.slice(0, 2)" 
                      :key="index"
                      class="h-6 w-6 rounded-full bg-blue-100 border border-white text-blue-600 font-medium flex items-center justify-center text-xs overflow-hidden"
                      :title="user.name"
                    >
                      {{ getInitials(user.name) }}
                    </div>
                    <div 
                      v-if="task.assigned_to.length > 2" 
                      class="h-6 w-6 rounded-full bg-gray-100 border border-white text-gray-600 font-medium flex items-center justify-center text-xs"
                    >
                      +{{ task.assigned_to.length - 2 }}
                    </div>
                  </div>
                  
                  <!-- Indikator progres tugas -->
                  <div class="w-12 flex-shrink-0">
                    <div class="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        class="h-1.5 rounded-full" 
                        :class="getProgressBarColorClass(task.progress)"
                        :style="{ width: `${task.progress || 0}%` }"
                      ></div>
                    </div>
                    <div class="text-xs text-center text-gray-500 mt-0.5">{{ task.progress || 0 }}%</div>
                  </div>
                </div>
                <div v-if="project.tasks.length === 0" class="task-row flex items-center px-4 py-2.5 pl-10 italic text-gray-400 text-sm">
                  Tidak ada tugas ditemukan
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sisi kanan: Grafik timeline -->
        <div class="gantt-timeline relative">
          <!-- Header timeline (sticky) -->
          <div class="timeline-header h-16 sticky top-0 z-10 border-b border-gray-200 bg-gray-50">
            <!-- Unit waktu tingkat atas (bulan atau minggu) -->
            <div class="h-8 flex border-b border-gray-200">
              <div
                v-for="timeUnit in timeUnits.major"
                :key="timeUnit.key"
                class="border-r border-gray-300 relative flex items-center justify-center"
                :style="{ width: `${timeUnit.width}px` }"
              >
                <span class="text-xs font-medium text-gray-700">{{ timeUnit.label }}</span>
              </div>
            </div>
            
            <!-- Unit waktu detail (hari) -->
            <div class="h-8 flex">
              <div
                v-for="timeUnit in timeUnits.minor"
                :key="timeUnit.key"
                :class="[
                  'border-r border-gray-200 relative flex items-center justify-center',
                  timeUnit.isWeekend ? 'bg-gray-100' : '',
                  timeUnit.isToday ? 'bg-red-50' : ''
                ]"
                :style="{ width: `${getDayWidth()}px` }"
              >
                <span class="text-xs text-gray-500">{{ timeUnit.label }}</span>
              </div>
            </div>
          </div>

          <!-- Area batang Gantt -->
          <div class="timeline-content">
            <!-- Batang proyek dan tugas -->
            <div class="gantt-bars">
              <div
                v-for="(project) in projects"
                :key="project.id"
                class="project-bar-container"
              >
                <!-- Baris timeline proyek -->
                <div 
                  class="project-timeline-row relative h-12 hover:bg-gray-50"
                  :class="{ 'bg-gray-50': project.expanded, 'border-b border-gray-100': !project.expanded }"
                >
                  <!-- Latar belakang grid tanggal -->
                  <div class="absolute inset-0 grid-background">
                    <div
                      v-for="timeUnit in timeUnits.minor"
                      :key="timeUnit.key"
                      :class="[
                        'absolute top-0 bottom-0 border-r border-gray-200',
                        timeUnit.isWeekend ? 'bg-gray-100' : '',
                        timeUnit.isToday ? 'bg-red-50' : ''
                      ]"
                      :style="{ 
                        left: `${getTimeUnitPosition(timeUnit)}px`,
                        width: `${getDayWidth()}px`
                      }"
                    ></div>
                  </div>
                  
                  <!-- Batang timeline proyek -->
                  <div
                    v-if="getBarPosition(project).width > 0"
                    class="absolute top-1/2 transform -translate-y-1/2 h-8 rounded-md shadow-sm cursor-pointer border z-10"
                    :class="getProjectStatusClass(project.state)"
                    :style="{
                      left: `${getBarPosition(project).left}px`,
                      width: `${getBarPosition(project).width}px`
                    }"
                    @click.stop="handleProjectClick(project)"
                    :title="getProjectTooltip(project)"
                  >
                    <!-- Indikator progres -->
                    <div 
                      class="absolute top-0 left-0 bottom-0 rounded-l-md transition-all duration-300"
                      :class="getProgressBarClass(project.state, project.progress)"
                      :style="{ width: `${project.progress || 0}%` }"
                    ></div>
                    
                    <!-- Label teks (hanya jika cukup ruang) -->
                    <div v-if="getBarPosition(project).width > 80" class="px-2 py-1.5 flex items-center h-full z-20 relative">
                      <span class="text-xs font-medium truncate text-current">{{ project.name }}</span>
                    </div>
                  </div>
                    
                  <!-- Indikator hari ini (garis vertikal) -->
                  <div
                    v-if="isTodayVisible"
                    class="absolute top-0 bottom-0 w-px bg-red-500 z-20"
                    :style="{ left: `${getTodayPosition()}px` }"
                  ></div>
                </div>
                
                <!-- Batang timeline tugas (ketika proyek diperluas) -->
                <div v-if="project.expanded">
                  <div
                    v-for="task in project.tasks"
                    :key="task.id"
                    class="task-timeline-row relative h-10 hover:bg-gray-100 border-t border-gray-100"
                  >
                    <!-- Latar belakang grid tanggal -->
                    <div class="absolute inset-0 grid-background">
                      <div
                        v-for="timeUnit in timeUnits.minor"
                        :key="timeUnit.key"
                        :class="[
                          'absolute top-0 bottom-0 border-r border-gray-200',
                          timeUnit.isWeekend ? 'bg-gray-100' : '',
                          timeUnit.isToday ? 'bg-red-50' : ''
                        ]"
                        :style="{ 
                          left: `${getTimeUnitPosition(timeUnit)}px`,
                          width: `${getDayWidth()}px`
                        }"
                      ></div>
                    </div>
                    
                    <!-- Batang timeline tugas yang ditingkatkan -->
                    <div
                      v-if="getBarPosition(task).width > 0"
                      class="absolute top-1/2 transform -translate-y-1/2 h-7 rounded-md shadow-sm cursor-pointer border z-10"
                      :class="getTaskStatusClass(task.state)"
                      :style="{
                        left: `${getBarPosition(task).left}px`,
                        width: `${getBarPosition(task).width}px`
                      }"
                      @click.stop="handleTaskClick(task)"
                      :title="getTaskTooltip(task, project)"
                    >
                      <!-- Indikator progres -->
                      <div 
                        class="absolute top-0 left-0 bottom-0 rounded-l-md transition-all duration-300"
                        :class="getProgressBarClass(task.state, task.progress)"
                        :style="{ width: `${task.progress || 0}%` }"
                      ></div>
                        
                      <!-- Label teks (hanya jika cukup ruang) -->
                      <div v-if="getBarPosition(task).width > 60" class="px-2 py-1 flex items-center h-full z-20 relative">
                        <span class="text-xs truncate text-current">{{ task.name }}</span>
                      </div>
                      
                      <!-- Avatar pengguna yang ditugaskan (jika ada ruang) dengan badge baru -->
                      <div 
                        v-if="task.assigned_to && task.assigned_to.length > 0 && getBarPosition(task).width > 80"
                        class="absolute -bottom-1.5 right-1.5 flex -space-x-1.5"
                      >
                        <div 
                          v-for="(user, index) in task.assigned_to.slice(0, 2)" 
                          :key="index"
                          class="h-5 w-5 rounded-full bg-blue-100 border border-white text-blue-600 text-xs flex items-center justify-center overflow-hidden shadow-sm"
                          :title="user.name"
                        >
                          {{ getInitials(user.name) }}
                        </div>
                        <div 
                          v-if="task.assigned_to.length > 2"
                          class="h-5 w-5 rounded-full bg-gray-100 border border-white text-xs flex items-center justify-center shadow-sm"
                          :title="getRemainingUsersTitle(task.assigned_to, 2)"
                        >
                          +{{ task.assigned_to.length - 2 }}
                        </div>
                      </div>
                      
                      <!-- Badge due date (fitur baru) -->
                      <!-- <div 
                        v-if="getBarPosition(task).width > 100"
                        class="absolute -top-1.5 right-1.5 bg-white text-xs rounded-full px-1.5 py-0.5 border border-gray-200 shadow-sm flex items-center"
                      >
                        <CalendarIcon class="h-3 w-3 mr-0.5 text-gray-500" />
                        {{ formatDateShort(task.end) }}
                      </div> -->
                    </div>
                      
                    <!-- Indikator hari ini (garis vertikal) -->
                    <div
                      v-if="isTodayVisible"
                      class="absolute top-0 bottom-0 w-px bg-red-500 z-20"
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
    
    <!-- Keadaan Loading -->
    <div 
      v-if="loading" 
      class="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-30"
    >
      <div class="flex flex-col items-center">
        <div class="animate-spin rounded-full h-10 w-10 border-2 border-red-600 border-t-transparent"></div>
        <p class="mt-2 text-sm text-gray-600">Memuat timeline...</p>
      </div>
    </div>

    <!-- Keadaan Kosong -->
    <div 
      v-if="!loading && projects.length === 0" 
      class="flex flex-col items-center justify-center p-10 flex-grow"
    >
      <CalendarIcon class="h-12 w-12 text-gray-400" />
      <h3 class="mt-2 text-sm font-medium text-gray-900">Tidak ada proyek ditemukan</h3>
      <p v-if="departmentId" class="mt-1 text-sm text-gray-500">
        Tidak ada proyek ditemukan di departemen atau rentang tanggal yang dipilih.
      </p>
      <p v-else class="mt-1 text-sm text-gray-500">
        Buat beberapa proyek dengan tugas untuk melihatnya di timeline.
      </p>
      <button
        v-if="departmentId || startDateFilter || endDateFilter"
        @click="$emit('resetFilters')"
        class="mt-3 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
      >
        <ArrowPathIcon class="h-4 w-4 mr-1.5" />
        Reset Filter
      </button>
    </div>

    <!-- Modal Detail Tugas -->
    <TaskDetailPopup
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
  CalendarIcon,
  XMarkIcon,
  ArrowPathIcon
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
import TaskDetailPopup from '@/components/team/TaskDetailPopup.vue';

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
  startDateFilter: {
    type: String,
    default: null
  },
  endDateFilter: {
    type: String,
    default: null
  },
  departmentName: {
    type: String,
    default: ''
  }
});

const emit = defineEmits([
  'view-task-detail', 
  'view-project-detail',
  'edit-task',
  'update:dateRange',
  'clearFilter',
  'resetFilters'
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
const isInternalNavigation = ref(false);

// Format rentang tanggal untuk tampilan
const dateRangeLabel = computed(() => {
  if (props.startDateFilter && props.endDateFilter) {
    try {
      const start = format(parseISO(props.startDateFilter), 'dd MMM yyyy');
      const end = format(parseISO(props.endDateFilter), 'dd MMM yyyy');
      return `${start} - ${end}`;
    } catch (e) {
      return `${props.startDateFilter} - ${props.endDateFilter}`;
    }
  }
  return '';
});

// Computed properties
const timelinePeriodLabel = computed(() => {
  if (viewMode.value === 'month') {
    const monthStart = startOfMonth(startDate.value);
    const monthEnd = endOfMonth(startDate.value);
    return `${format(monthStart, 'MMMM yyyy')}`;
  } else if (viewMode.value === 'week') {
    const weekStart = startOfWeek(startDate.value, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(startDate.value, { weekStartsOn: 1 });
    return `${format(weekStart, 'dd MMM')} - ${format(weekEnd, 'dd MMM yyyy')}`;
  } else { // day view
    const dayStart = startDate.value;
    const dayEnd = addDays(startDate.value, 14); // Show 2 weeks in day view
    return `${format(dayStart, 'dd MMM')} - ${format(dayEnd, 'dd MMM yyyy')}`;
  }
});

// Rentang tanggal efektif berdasarkan mode tampilan dan filter
const effectiveDateRange = computed(() => {
  // Generate date range based on view mode and current startDate
  let rangeStart, rangeEnd;
  
  if (viewMode.value === 'month') {
    rangeStart = startOfMonth(startDate.value);
    rangeEnd = endOfMonth(startDate.value);
  } else if (viewMode.value === 'week') {
    rangeStart = startOfWeek(startDate.value, { weekStartsOn: 1 });
    rangeEnd = endOfWeek(startDate.value, { weekStartsOn: 1 });
  } else { // day view
    rangeStart = startDate.value;
    rangeEnd = addDays(startDate.value, 14); // 2 weeks default
  }
  
  // If props provide date filters and not in internal navigation mode,
  // use them for display but DON'T update internal startDate
  if (props.startDateFilter && props.endDateFilter && !isInternalNavigation.value) {
    try {
      const start = parseISO(props.startDateFilter);
      const end = parseISO(props.endDateFilter);
      // Make sure both dates are valid
      if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
        return { start, end };
      }
    } catch (e) {
      console.error('Error parsing date filters:', e);
    }
  }
  
  // Ensure both dates are valid
  if (isNaN(rangeStart.getTime()) || isNaN(rangeEnd.getTime())) {
    const today = new Date();
    rangeStart = startOfMonth(today);
    rangeEnd = endOfMonth(today);
  }
  
  return { start: rangeStart, end: rangeEnd };
});

// Unit waktu untuk tampilan timeline
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
      monthLabel: format(day, 'MMM'),
      position: 0 // Will be calculated in getTimeUnitPosition
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

// Memeriksa apakah hari ini terlihat di tampilan saat ini
const isTodayVisible = computed(() => {
  try {
    // Get today's date
    const today = new Date();
    
    // Get the current view range
    const viewRange = effectiveDateRange.value;
    
    // Check if today falls within the current view range
    return today >= viewRange.start && today <= viewRange.end;
  } catch (error) {
    console.error('Error calculating if today is visible:', error);
    return false;
  }
});

// Method untuk mengambil data proyek
function fetchProjects() {
  loading.value = true;
  error.value = null;
  
  // Initialize request parameters
  const params = {
    jsonrpc: '2.0',
    id: new Date().getTime(),
    params: {}
  };
  
  // Get date range, either from props or from internal state
  let dateStart, dateEnd;
  
  if (props.startDateFilter && props.endDateFilter && !isInternalNavigation.value) {
    // Use props directly
    dateStart = props.startDateFilter;
    dateEnd = props.endDateFilter;
  } else {
    // Use the calculated date range from our component
    const dateRange = effectiveDateRange.value;
    dateStart = format(dateRange.start, 'yyyy-MM-dd');
    dateEnd = format(dateRange.end, 'yyyy-MM-dd');
  }
  
  // Add date parameters to the params object
  params.params.date_start = dateStart;
  params.params.date_end = dateEnd;
  
  // Add department id if present
  if (props.departmentId) {
    console.log('Including department filter:', props.departmentId);
    params.params.department_id = parseInt(props.departmentId);
  }

  // Debug logging
  console.log('Fetching Gantt data with params:', JSON.stringify(params));

  // API call
  apiClient.post('/web/v2/team/dashboard/timeline', params)
    .then(response => {
      if (response.data.result?.status === 'success') {
        console.log('Gantt data fetched successfully');
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
                state: task.state || 'in_progress',
                assigned_to: task.assigned_to || []
              };
            })
          };
        });
      } else {
        console.error('Error fetching Gantt data:', response.data.result?.message);
        error.value = response.data.result?.message || 'Gagal memuat proyek';
      }
    })
    .catch(err => {
      console.error('API error fetching project timeline data:', err);
      error.value = 'Error memuat data proyek';
    })
    .finally(() => {
      loading.value = false;
    });
}

// Methods navigasi dan kontrol timeline
function getDayWidth() {
  // Base day width multiplied by zoom level
  const baseDayWidth = 30;
  return baseDayWidth * zoomLevel.value;
}

function getTimeUnitPosition(timeUnit) {
  const viewStart = effectiveDateRange.value.start;
  const daysFromViewStart = differenceInDays(timeUnit.date, viewStart);
  return daysFromViewStart * getDayWidth();
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

function getTodayPosition() {
  try {
    const today = new Date();
    // Use effectiveDateRange.value.start directly
    const viewStart = effectiveDateRange.value.start;
    
    if (!viewStart || isNaN(viewStart.getTime())) {
      return 0;
    }
    
    const daysFromViewStart = differenceInDays(today, viewStart);
    return Math.max(0, daysFromViewStart * getDayWidth());
  } catch (error) {
    console.error('Error calculating today position:', error);
    return 0;
  }
}

// Metode navigasi
function moveTimelinePrev() {
  try {
    isInternalNavigation.value = true;
    
    // Update the internal startDate
    if (viewMode.value === 'month') {
      startDate.value = subMonths(startDate.value, 1);
    } else if (viewMode.value === 'week') {
      startDate.value = subWeeks(startDate.value, 1);
    } else { // day view
      startDate.value = subDays(startDate.value, 14);
    }
    
    // Calculate the new date range
    const range = effectiveDateRange.value;
    
    // Emit the new date range to parent component
    emit('update:dateRange', {
      start: format(range.start, 'yyyy-MM-dd'),
      end: format(range.end, 'yyyy-MM-dd')
    });
    
    // Fetch projects with the new date range
    fetchProjects();
  } catch (error) {
    console.error('Error navigating to previous period:', error);
  }
}

function moveTimelineNext() {
  try {
    isInternalNavigation.value = true;
    
    // Update the internal startDate
    if (viewMode.value === 'month') {
      startDate.value = addMonths(startDate.value, 1);
    } else if (viewMode.value === 'week') {
      startDate.value = addWeeks(startDate.value, 1);
    } else { // day view
      startDate.value = addDays(startDate.value, 14);
    }
    
    // Calculate the new date range
    const range = effectiveDateRange.value;
    
    // Emit the new date range to parent component
    emit('update:dateRange', {
      start: format(range.start, 'yyyy-MM-dd'),
      end: format(range.end, 'yyyy-MM-dd')
    });
    
    // Fetch projects with the new date range
    fetchProjects();
  } catch (error) {
    console.error('Error navigating to next period:', error);
  }
}

function resetTimeline() {
  try {
    isInternalNavigation.value = true;
    
    // Reset to current date
    startDate.value = new Date();
    
    // Calculate the new date range based on current date
    const newRange = effectiveDateRange.value;
    
    // Emit the new date range to parent component
    emit('update:dateRange', {
      start: format(newRange.start, 'yyyy-MM-dd'),
      end: format(newRange.end, 'yyyy-MM-dd')
    });
    
    // Fetch projects with the new date range
    fetchProjects();
  } catch (error) {
    console.error('Error resetting timeline:', error);
  } finally {
    isInternalNavigation.value = false;
  }
}

function setViewMode(mode) {
  try {
    // Don't do anything if the mode is already set
    if (viewMode.value === mode) return;
    
    isInternalNavigation.value = true;
    
    // Update the view mode
    viewMode.value = mode;
    
    // Calculate the new date range based on new view mode
    const newRange = effectiveDateRange.value;
    
    // Emit the new date range to parent component
    emit('update:dateRange', {
      start: format(newRange.start, 'yyyy-MM-dd'),
      end: format(newRange.end, 'yyyy-MM-dd')
    });
    
    // Fetch projects with the new view mode and date range
    fetchProjects();
  } catch (error) {
    console.error('Error changing view mode:', error);
  } finally {
    isInternalNavigation.value = false;
  }
}

// Metode zoom
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

// Interaksi proyek dan tugas
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
  if (!task || !task.id) {
    console.warn('Attempted to view invalid task');
    return;
  }
  
  // Tampilkan modal tanpa navigasi halaman
  selectedTaskId.value = task.id;
  showTaskModal.value = true;
}

function closeTaskModal() {
  showTaskModal.value = false;
  selectedTaskId.value = null;
}

function handleEditTask(task) {
  // Close modal
  closeTaskModal();
  
  // Emit edit event to parent component
  emit('edit-task', task);
}

// Helper methods untuk tooltips dan format
function getProjectTooltip(project) {
  if (!project) return '';
  
  let tooltip = `Proyek: ${project.name || 'Proyek Tanpa Nama'}\n`;
  
  try {
    if (project.startDate) {
      tooltip += `Mulai: ${format(parseISO(project.startDate), 'd MMMM yyyy')}\n`;
    }
  } catch (e) {
    tooltip += 'Mulai: Belum diatur\n';
  }
  
  try {
    if (project.endDate) {
      tooltip += `Selesai: ${format(parseISO(project.endDate), 'd MMMM yyyy')}\n`;
    }
  } catch (e) {
    tooltip += 'Selesai: Belum diatur\n';
  }
  
  tooltip += `Progres: ${project.progress || 0}%\n`;
  tooltip += `Status: ${formatState(project.state)}`;
  
  return tooltip;
}

function getTaskTooltip(task, project) {
  if (!task) return '';
  
  let tooltip = `Tugas: ${task.name || 'Tugas Tanpa Nama'}\n`;
  
  if (project) {
    tooltip += `Proyek: ${project.name || 'Proyek Tanpa Nama'}\n`;
  }
  
  try {
    if (task.startDate) {
      tooltip += `Mulai: ${format(parseISO(task.startDate), 'd MMMM yyyy')}\n`;
    }
  } catch (e) {
    tooltip += 'Mulai: Belum diatur\n';
  }
  
  try {
    if (task.endDate) {
      tooltip += `Tenggat: ${format(parseISO(task.endDate), 'd MMMM yyyy')}\n`;
    }
  } catch (e) {
    tooltip += 'Tenggat: Belum diatur\n';
  }
  
  tooltip += `Progres: ${task.progress || 0}%\n`;
  tooltip += `Status: ${formatState(task.state)}`;
  
  if (task.assigned_to && task.assigned_to.length > 0) {
    tooltip += `\nDitugaskan kepada: ${task.assigned_to.map(u => u.name).join(', ')}`;
  }
  
  return tooltip;
}

function formatState(state) {
  // Convert snake_case to Title Case in Indonesian
  const stateMap = {
    'draft': 'Draft',
    'planning': 'Perencanaan',
    'in_progress': 'Sedang Dikerjakan',
    'on_hold': 'Ditahan',
    'review': 'Dalam Review',
    'completed': 'Selesai',
    'done': 'Selesai',
    'cancelled': 'Dibatalkan'
  };
  
  return stateMap[state] || state
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Mendapatkan inisial nama untuk avatar
function getInitials(name) {
  if (!name) return '?';
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
}

// Mendapatkan label pengguna tambahan saat ada terlalu banyak untuk ditampilkan
function getRemainingUsersTitle(users, shown) {
  if (!users || users.length <= shown) return '';
  return users.slice(shown).map(u => u.name).join(', ');
}

// Format tanggal untuk tampilan
function formatDate(dateStr) {
  try {
    if (!dateStr) return '';
    const date = parseISO(dateStr);
    return format(date, 'd MMMM yyyy');
  } catch (e) {
    console.error('Error formatting date:', e);
    return dateStr || '';
  }
}

// Format tanggal singkat untuk badges
function formatDateShort(dateStr) {
  if (!dateStr) return '';
  try {
    const date = parseISO(dateStr);
    return format(date, 'd/M');
  } catch (e) {
    return dateStr;
  }
}

// Helper methods untuk kelas CSS dan gaya visual
function getStatusIndicatorClass(state) {
  const classes = {
    'draft': 'bg-gray-400',
    'planning': 'bg-blue-400',
    'in_progress': 'bg-green-400',
    'on_hold': 'bg-yellow-400',
    'review': 'bg-purple-400',
    'completed': 'bg-indigo-400',
    'done': 'bg-indigo-400',
    'cancelled': 'bg-red-400',
    'planned': 'bg-blue-400'
  };
  
  return classes[state] || 'bg-gray-400';
}

function getProjectStatusClass(state) {
  // Return appropriate CSS classes for project bars based on state
  const classes = {
    'draft': 'bg-gray-100 border-gray-300 text-gray-800',
    'planning': 'bg-blue-100 border-blue-300 text-blue-800',
    'in_progress': 'bg-green-100 border-green-300 text-green-800',
    'on_hold': 'bg-yellow-100 border-yellow-300 text-yellow-800',
    'completed': 'bg-indigo-100 border-indigo-300 text-indigo-800',
    'cancelled': 'bg-red-100 border-red-300 text-red-800'
  };
  
  return classes[state] || 'bg-gray-100 border-gray-300 text-gray-800';
}

function getTaskStatusClass(state) {
  // Return appropriate CSS classes for task bars based on state
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

function getProgressBarClass(state, progress) {
  const baseClasses = {
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
  
  const baseClass = baseClasses[state] || 'bg-gray-300';
  
  // Add opacity based on progress
  const opacity = progress >= 100 ? '' : (progress >= 50 ? ' bg-opacity-90' : ' bg-opacity-70');
  
  return `${baseClass}${opacity}`;
}

function getProgressBarColorClass(progress) {
  if (progress >= 100) {
    return 'bg-green-500'; // Completed - Green
  } else if (progress >= 75) {
    return 'bg-green-400'; // Almost done - Light Green
  } else if (progress >= 50) {
    return 'bg-yellow-400'; // Half way - Yellow
  } else if (progress >= 25) {
    return 'bg-orange-400'; // Started - Orange
  } else {
    return 'bg-red-400'; // Just started - Red
  }
}

// Lifecycle hooks dan watches

// Saat komponen di-mount, inisialisasi dan ambil data
onMounted(() => {
  console.log('Gantt Chart component mounted');
  console.log('Department ID from props:', props.departmentId);
  
  // Initialize startDate from props if available, but only once
  if (props.startDateFilter) {
    try {
      const date = parseISO(props.startDateFilter);
      if (!isNaN(date.getTime())) {
        startDate.value = date;
      }
    } catch (e) {
      console.error('Error parsing initial startDateFilter:', e);
    }
  }
  
  // Initial data fetch (only once)
  fetchProjects();
});

// Watch perubahan props untuk merefresh data
watch(
  [() => props.startDateFilter, () => props.endDateFilter, () => props.departmentId],
  ([newStart, newEnd, newDept], [oldStart, oldEnd, oldDept]) => {
    console.log('Filter change detected:');
    console.log('Department ID changed:', oldDept, '->', newDept);
    console.log('Date range changed:', oldStart, oldEnd, '->', newStart, newEnd);
    
    // Only react to actual changes from parent, not self-triggered ones
    if ((newStart !== oldStart || newEnd !== oldEnd || newDept !== oldDept) && !isInternalNavigation.value) {
      // If date filters change, update starting point
      if (newStart && newStart !== oldStart) {
        try {
          const date = parseISO(newStart);
          if (!isNaN(date.getTime())) {
            startDate.value = date;
          }
        } catch (e) {
          console.error('Error parsing startDateFilter:', e);
        }
      }
      
      // Fetch projects with updated filters
      fetchProjects();
    }
  }
);

// Reset internal navigation flag when loading finishes
watch(loading, (newVal, oldVal) => {
  if (oldVal === true && newVal === false) {
    isInternalNavigation.value = false;
  }
});
</script>

<style scoped>
.gantt-container {
  height: calc(100vh - 250px);
  min-height: 500px;
}

.project-names {
  overflow-y: auto;
  position: sticky;
  left: 0;
  z-index: 20;
  border-right: 1px solid #e5e7eb;
  box-shadow: 4px 0 6px -2px rgba(0, 0, 0, 0.05);
}

.gantt-timeline {
  overflow: auto;
}

.project-bar-container:nth-child(odd) .project-timeline-row {
  background-color: #f9fafb;
}

.project-bar-container:nth-child(odd) .task-timeline-row {
  background-color: #f3f4f6;
}

.timeline-content {
  position: relative;
}

/* Transisi smooth saat hover dan expand/collapse */
.project-row, .task-row {
  transition: background-color 0.15s ease;
}

.project-timeline-row, .task-timeline-row {
  transition: background-color 0.15s ease;
}

/* Gaya scrollbar untuk UX yang lebih baik */
.gantt-container::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.gantt-container::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.gantt-container::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 4px;
}

.gantt-container::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

/* Animasi untuk keadaan loading */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Efek pulsing untuk indikator hari ini */
.today-indicator {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Tooltip kustom untuk detail tugas */
.task-tooltip {
  position: absolute;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  z-index: 30;
  max-width: 250px;
  font-size: 12px;
}

/* Badge profil untuk tugas */
.avatar-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 24px;
  width: 24px;
  border-radius: 50%;
  background-color: #e5edff;
  color: #3b82f6;
  font-size: 10px;
  font-weight: 600;
  border: 1.5px solid white;
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
}

/* Badge tanggal untuk menampilkan due date */
.date-badge {
  display: flex;
  align-items: center;
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 2px 6px;
  font-size: 10px;
  color: #4b5563;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}

/* Efek hover pada batang timeline */
.project-timeline-bar, .task-timeline-bar {
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.project-timeline-bar:hover, .task-timeline-bar:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* Status badges untuk tugas */
.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 6px;
  border-radius: 9999px;
  font-size: 10px;
  font-weight: 500;
}

.status-badge-draft {
  background-color: #f3f4f6;
  color: #4b5563;
}

.status-badge-planned {
  background-color: #dbeafe;
  color: #2563eb;
}

.status-badge-in-progress {
  background-color: #d1fae5;
  color: #059669;
}

.status-badge-review {
  background-color: #ede9fe;
  color: #7c3aed;
}

.status-badge-done {
  background-color: #c7d2fe;
  color: #4f46e5;
}

.status-badge-cancelled {
  background-color: #fee2e2;
  color: #dc2626;
}

/* Animasi saat elemen dipilih */
@keyframes highlight {
  0% {
    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(239, 68, 68, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
  }
}

.highlight-animation {
  animation: highlight 1s ease-in-out;
}

/* Responsive styling for different screen sizes */
@media (max-width: 768px) {
  .gantt-container {
    grid-template-columns: 1fr;
  }
  
  .project-names {
    position: relative;
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #e5e7eb;
  }
  
  .gantt-timeline {
    overflow-x: auto;
  }
}
</style>