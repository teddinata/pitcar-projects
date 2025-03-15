<!-- src/components/team/BAUCalendarWeekView.vue -->
<template>
  <div class="bg-white rounded-lg shadow overflow-hidden h-[calc(100vh-140px)] flex flex-col">
    <!-- Week Header - Fixed Height -->
    <div class="grid grid-cols-8 border-b border-gray-200">
      <!-- Empty cell for time column -->
      <div class="border-r border-gray-200 py-3 text-center">
        <div class="flex justify-center">
          <button 
            class="text-sm px-2 py-1 rounded bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors duration-200 flex items-center"
            @click="emit('refresh')"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 inline" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd" />
            </svg>
            Refresh
          </button>
        </div>
      </div>
      
      <!-- Days of week -->
      <div 
        v-for="day in formattedWeekDays" 
        :key="day.fullDate"
        :class="[
          'py-3 text-center relative',
          day.isToday ? 'bg-red-50' : '',
          { 'border-r border-gray-200': true },
          { 'bg-red-50/20': day.dayName === 'Sab' || day.dayName === 'Min' }
        ]"
      >
        <p 
          :class="[
            'text-base font-medium',
            day.isToday ? 'text-red-600' : 'text-gray-900'
          ]"
        >
          {{ day.dayName }}
        </p>
        <p 
          :class="[
            'text-sm',
            day.isToday ? 'text-red-600' : 'text-gray-500'
          ]"
        >
          {{ day.date }}
        </p>
        
        <!-- Hours badge -->
        <div 
          v-if="day.totalHours > 0" 
          class="absolute top-1 right-1"
        >
          <span 
            class="inline-flex items-center px-1.5 py-0.5 rounded-sm text-xs font-medium bg-amber-50 text-amber-700"
          >
            {{ day.totalHours }}h
          </span>
        </div>
      </div>
    </div>

    <!-- Week Content - Flexible Height -->
    <div class="grid grid-cols-8 flex-grow overflow-y-auto relative">
      <!-- Time Labels Column -->
      <div class="border-r border-gray-200 sticky left-0 bg-white z-10">
        <div 
          v-for="hour in visibleHours" 
          :key="hour"
          class="h-20 py-2 text-right pr-2 text-sm text-gray-500 border-b border-gray-100 cursor-pointer hover:text-blue-600 transition-colors duration-200"
          @click="handleTimeClick(hour, 0)"
        >
          {{ formatHour(hour) }}
        </div>
      </div>

      <!-- Hour Grid Lines -->
      <div class="absolute inset-0 right-0 left-16 z-0 pointer-events-none">
        <div 
          v-for="hour in visibleHours" 
          :key="hour"
          class="absolute w-full h-px bg-gray-100 border-b border-gray-100"
          :style="`top: ${(hour - startHour) * hourHeight + hourHeight - 1}px`"
        ></div>
      </div>

      <!-- Current time indicator -->
      <div class="absolute inset-0 right-0 left-16 z-20 pointer-events-none">
        <div
          v-if="isCurrentTimeVisible"
          class="absolute w-full h-[2px] bg-red-500"
          :style="`top: ${getCurrentTimePosition()}px`"
        >
          <div class="absolute -left-[6px] top-[-4px] w-3 h-3 rounded-full bg-red-500"></div>
        </div>
      </div>

      <!-- Day Columns with Time Slots -->
      <div 
        v-for="(day, dayIndex) in formattedWeekDays" 
        :key="day.fullDate"
        class="relative border-r border-gray-200"
        :class="{ 'bg-red-50/20': day.dayName === 'Sab' || day.dayName === 'Min' }"
      >
        <!-- Time Slots - Every 30 minutes -->
        <div 
          v-for="slotIndex in totalTimeSlots" 
          :key="`slot-${dayIndex}-${slotIndex}`"
          class="absolute w-full h-10 hover:bg-blue-50 cursor-pointer transition-colors duration-150 z-10"
          :style="`top: ${(slotIndex - 1) * (hourHeight/2)}px`"
          @click="handleTimeSlotClick(day, slotIndex - 1)"
        >
          <!-- Slot hover indication -->
          <div class="h-full w-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
            <span class="text-xs text-blue-500 font-medium">+ Tambah</span>
          </div>
        </div>

        <!-- Activities -->
        <div 
            v-for="(activity, index) in day.activities" 
            :key="activity.id"
            class="absolute rounded-sm transition-all overflow-hidden cursor-pointer z-20 group hover:z-30"
            :class="getActivityClass(activity)"
            :style="`
              top: ${calculateActivityPosition(activity)}px; 
              height: ${calculateActivityHeight(activity)}px;
              left: ${calculateActivityLeft(activity, day.activities)};
              width: ${calculateActivityWidth(activity, day.activities)};
            `"
            @click.stop="handleActivityClick(activity)"
          >
          <!-- Activity Card Content -->
          <div class="p-3 h-full flex flex-col text-left relative">
            <!-- Title and status indicator -->
            <div class="flex items-center">
              <div class="w-3 h-3 rounded-full flex-shrink-0" :class="getStatusDotClass(activity)"></div>
              <div class="text-sm font-medium text-gray-900 ml-1.5 truncate">{{ activity.name }}</div>
            </div>
            
            <!-- Time -->
            <div class="text-sm text-gray-700 mt-2 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
              </svg>
              <span>{{ formatActivityTime(activity) }}</span>
            </div>
            
            <!-- Project info if exists and there's enough space -->
            <div v-if="activity.project && calculateActivityHeight(activity) > 80" class="text-sm text-gray-700 mt-2 truncate flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clip-rule="evenodd" />
              </svg>
              <span>{{ typeof activity.project === 'object' ? activity.project.name : 'Project' }}</span>
            </div>
            
            <!-- Type tag with an icon -->
            <div v-if="calculateActivityHeight(activity) > 100" class="text-sm mt-2 flex items-center">
              <span 
                class="px-2 py-1 rounded-sm text-sm inline-flex items-center"
                :class="getTypeTagClass(activity.activity_type)"
              >
                <span class="mr-1">
                  <!-- Directly use SVG based on activity type -->
                  <svg v-if="activity.activity_type === 'meeting'" xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clip-rule="evenodd" />
                  </svg>
                  <svg v-else-if="activity.activity_type === 'training'" xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                  </svg>
                  <svg v-else-if="activity.activity_type === 'support'" xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-2 0c0 .993-.241 1.929-.668 2.754l-1.524-1.525a3.997 3.997 0 00.078-2.183l1.562-1.562C15.802 8.249 16 9.1 16 10zm-5.165 3.913l1.58 1.58A5.98 5.98 0 0110 16a5.976 5.976 0 01-2.516-.552l1.562-1.562a4.006 4.006 0 001.789.027zm-4.677-2.796a4.002 4.002 0 01-.041-2.08l-.08.08-1.53-1.533A5.98 5.98 0 004 10c0 .954.223 1.856.619 2.657l1.54-1.54zm1.088-6.45A5.974 5.974 0 0110 4c.954 0 1.856.223 2.657.619l-1.54 1.54a4.002 4.002 0 00-2.346.033L7.246 4.668zM12 10a2 2 0 11-4 0 2 2 0 014 0z" clip-rule="evenodd" />
                  </svg>
                  <svg v-else-if="activity.activity_type === 'admin'" xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clip-rule="evenodd" />
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
                  </svg>
                </span>
                <span>{{ getActivityTypeFull(activity.activity_type) }}</span>
              </span>
            </div>
            
            <!-- Description if there's enough space -->
            <div v-if="activity.description && calculateActivityHeight(activity) > 120" class="text-sm text-gray-600 mt-2 line-clamp-2">
              {{ activity.description }}
            </div>
            
            <!-- Creator info on larger cards -->
            <div v-if="activity.creator && calculateActivityHeight(activity) > 140" class="text-sm text-gray-700 mt-2 truncate flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
              </svg>
              <span>{{ activity.creator.name }}</span>
            </div>
            
            <!-- Status indicator -->
            <div 
              v-if="activity.state && activity.state !== 'planned'"
              class="absolute top-0 right-0 m-2" 
            >
              <span v-if="activity.state === 'done'" class="text-green-700">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </span>
              <span v-else-if="activity.state === 'not_done'" class="text-red-700">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </span>
            </div>
          </div>
          
          <!-- Hover Tooltip -->
          <div class="absolute left-full top-0 ml-2 z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none w-64">
            <div class="bg-white p-3 rounded-md shadow-lg border border-gray-200">
              <h4 class="font-medium text-sm text-gray-900">{{ activity.name }}</h4>
              
              <div class="mt-2 space-y-1">
                <div class="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5 text-gray-500 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
                  </svg>
                  <div class="text-xs text-gray-700">
                    <div><span class="font-medium">Waktu:</span> {{ formatActivityTime(activity) }}</div>
                    <div><span class="font-medium">Durasi:</span> {{ formatDuration(activity) }}</div>
                  </div>
                </div>
                
                <div class="flex items-start" v-if="activity.project">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5 text-gray-500 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clip-rule="evenodd" />
                  </svg>
                  <div class="text-xs text-gray-700">
                    <span class="font-medium">Project:</span> {{ typeof activity.project === 'object' ? activity.project.name : 'Project' }}
                  </div>
                </div>
                
                <div class="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5 text-gray-500 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                  <div class="text-xs text-gray-700">
                    <span class="font-medium">Jenis:</span> {{ getActivityTypeFull(activity.activity_type) }}
                  </div>
                </div>
                
                <div class="flex items-start" v-if="activity.creator">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5 text-gray-500 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                  </svg>
                  <div class="text-xs text-gray-700">
                    <span class="font-medium">Dibuat oleh:</span> {{ activity.creator.name }}
                    <div v-if="activity.creator.position">{{ activity.creator.position }}</div>
                  </div>
                </div>
                
                <div class="flex items-start" v-if="activity.description">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5 text-gray-500 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                  </svg>
                  <div class="text-xs text-gray-700">
                    <div class="font-medium">Deskripsi:</div>
                    <p class="mt-0.5">{{ activity.description }}</p>
                  </div>
                </div>
                
                <div class="flex items-start" v-if="activity.verification && activity.verification.verified_by">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5 text-gray-500 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                  <div class="text-xs text-gray-700">
                    <span class="font-medium">Diverifikasi oleh:</span> {{ activity.verification.verified_by.name }}
                    <div><span class="font-medium">Tanggal:</span> {{ formatVerificationDate(activity.verification.date) }}</div>
                  </div>
                </div>
                
                <div class="flex items-start mt-2">
                  <div 
                    class="text-xs px-2 py-1 rounded-sm font-medium"
                    :class="getStatusClass(activity.state)"
                  >
                    {{ getStatusText(activity.state) }}
                  </div>
                </div>
              </div>
            </div>
            <div class="absolute w-2 h-2 bg-white border-l border-t border-gray-200 transform rotate-45 -left-1 top-4"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading overlay -->
    <div v-if="loading" class="absolute inset-0 bg-white bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50">
      <div class="flex flex-col items-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-t-2 border-blue-600"></div>
        <p class="mt-3 text-sm text-blue-600 font-medium">Memuat data kalender...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';

const props = defineProps({
  weekData: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['activity-click', 'time-slot-click', 'refresh']);

// Configuration to match the screenshot - with increased hourHeight
const startHour = 8; // Start display at 10 AM
const endHour = 17; // End display at 5 PM
const visibleHours = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17];
const hourHeight = 80; // Increased height for one hour (from 48px to 80px)
const slotsPerHour = 2; // 2 slots per hour (30 min each)

// Calculate total time slots (for 30-minute intervals)
const totalTimeSlots = computed(() => {
  return (endHour - startHour + 1) * slotsPerHour;
});

// Reactive current time for the time indicator
const currentTime = ref(new Date());
const isCurrentTimeVisible = computed(() => {
  const hours = currentTime.value.getHours();
  return hours >= startHour && hours <= endHour;
});

// Computed property to format week days
const formattedWeekDays = computed(() => {
  if (!props.weekData || props.weekData.length === 0) {
    return [];
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return props.weekData.map(day => {
    const date = new Date(day.date);
    const isToday = date.toDateString() === today.toDateString();
    
    // Format the day name and date to match screenshot (e.g., "Min 9 Mar")
    const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    const dayName = dayNames[date.getDay()];
    
    // Format date as just the day number + Mar (e.g., "9 Mar")
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 
                    'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const formattedDate = `${date.getDate()} ${monthNames[date.getMonth()]}`;
    
    return {
      fullDate: day.date,
      date: formattedDate,
      dayName: dayName,
      isToday: isToday,
      activities: day.activities || [],
      totalHours: day.total_hours || 0,
      targetAchieved: day.target_achieved || false
    };
  });
});

// Helper to get current time position
const getCurrentTimePosition = () => {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  
  if (hours < startHour) return 0;
  if (hours > endHour) return (endHour - startHour + 1) * hourHeight;
  
  return ((hours - startHour) * hourHeight) + (minutes / 60 * hourHeight);
};

// Helper to format hours to match the screenshot (e.g., "10:00")
function formatHour(hour) {
  return `${hour}:00`;
}

// Helper method to calculate activity position based on time
const calculateActivityPosition = (activity, index, allActivities) => {
  // Kode untuk menghitung posisi vertikal (waktu) tetap sama
  if (!activity.time || !activity.time.start) {
    return 0;
  }
  
  try {
    const timeParts = activity.time.start.split(':');
    const hours = parseInt(timeParts[0]);
    const minutes = parseInt(timeParts[1]);
    
    if (hours < startHour) {
      return 0;
    }
    
    const verticalPosition = ((hours - startHour) * hourHeight) + (minutes / 60 * hourHeight);
    
    // Mencari semua aktivitas yang bertabrakan pada waktu yang sama di hari yang sama
    const overlappingActivities = findOverlappingActivities(activity, allActivities);
    
    // Jika tidak ada yang bertabrakan, tampilkan normal (full width)
    if (overlappingActivities.length <= 1) {
      return verticalPosition;
    }
    
    // Posisi dalam array aktivitas yang bertabrakan - akan mempengaruhi posisi horizontal
    const positionInOverlap = overlappingActivities.findIndex(a => a.id === activity.id);
    
    return verticalPosition;
  } catch (e) {
    console.error('Error calculating position:', e);
    return 0;
  }
};

const calculateActivityWidth = (activity, dayActivities) => {
  const overlappingActivities = findOverlappingActivities(activity, dayActivities);
  
  // Jika tidak ada yang bertabrakan, gunakan lebar penuh
  if (overlappingActivities.length <= 1) {
    return 'calc(100% - 8px)';
  }
  
  // Bagi lebar berdasarkan jumlah aktivitas yang bertabrakan
  const widthPercentage = 100 / overlappingActivities.length;
  return `calc(${widthPercentage}% - 8px)`;
};

const calculateActivityLeft = (activity, dayActivities) => {
  const overlappingActivities = findOverlappingActivities(activity, dayActivities);
  
  // Jika tidak ada yang bertabrakan, tampilkan di tengah
  if (overlappingActivities.length <= 1) {
    return '4px';
  }
  
  // Tentukan posisi horizontal berdasarkan posisi dalam array aktivitas yang bertabrakan
  const positionInOverlap = overlappingActivities.findIndex(a => a.id === activity.id);
  const widthPercentage = 100 / overlappingActivities.length;
  
  return `calc(${positionInOverlap * widthPercentage}% + 4px)`;
};

// Fungsi untuk menemukan aktivitas yang bertabrakan waktu
const findOverlappingActivities = (activity, allActivities) => {
  if (!activity.time || !activity.time.start || !activity.time.end) {
    return [];
  }
  
  // Parse time untuk aktivitas ini
  const activityStart = timeToMinutes(activity.time.start);
  const activityEnd = timeToMinutes(activity.time.end);
  
  // Filter aktivitas yang bertabrakan
  return allActivities.filter(a => {
    if (!a.time || !a.time.start || !a.time.end || a.id === activity.id) {
      return false;
    }
    
    const aStart = timeToMinutes(a.time.start);
    const aEnd = timeToMinutes(a.time.end);
    
    // Aktivitas bertabrakan jika:
    // 1. a mulai sebelum activity berakhir DAN
    // 2. a berakhir setelah activity mulai
    return (aStart < activityEnd && aEnd > activityStart);
  });
};

// Helper untuk mengubah format waktu "HH:MM" ke menit
const timeToMinutes = (timeString) => {
  const [hours, minutes] = timeString.split(':').map(Number);
  return (hours * 60) + minutes;
};


// Helper method to calculate activity height based on duration
const calculateActivityHeight = (activity) => {
  if (!activity.time) {
    const hours = activity.hours_spent || 1;
    return hours * hourHeight; 
  }
  
  try {
    const startParts = activity.time.start.split(':');
    const endParts = activity.time.end.split(':');
    
    const startHours = parseInt(startParts[0]) + (parseInt(startParts[1]) / 60);
    const endHours = parseInt(endParts[0]) + (parseInt(endParts[1]) / 60);
    
    let durationHours = endHours - startHours;
    if (durationHours < 0) {
      durationHours = 24 + durationHours; // Handle overnight activities
    }
    
    return Math.max(durationHours * hourHeight, 40); // Minimum height of 40px
  } catch (e) {
    console.error('Error calculating height:', e);
    return hourHeight;
  }
};

// Format activity time to match the screenshot (e.g., "16:00 - 17:00")
const formatActivityTime = (activity) => {
  if (!activity.time || !activity.time.start || !activity.time.end) {
    return '';
  }
  
  return `${activity.time.start} - ${activity.time.end}`;
};

// Format the duration for display in the tooltip
const formatDuration = (activity) => {
  if (!activity.time || !activity.time.duration) {
    if (activity.hours_spent) {
      const hours = Math.floor(activity.hours_spent);
      const minutes = Math.round((activity.hours_spent - hours) * 60);
      
      if (minutes > 0) {
        return `${hours} jam ${minutes} menit`;
      }
      return `${hours} jam`;
    }
    return '';
  }
  
  const hours = Math.floor(activity.time.duration);
  const minutes = Math.round((activity.time.duration - hours) * 60);
  
  if (minutes > 0) {
    return `${hours} jam ${minutes} menit`;
  }
  return `${hours} jam`;
};

// Format the verification date
const formatVerificationDate = (dateString) => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    const options = { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit' 
    };
    return new Intl.DateTimeFormat('id-ID', options).format(date);
  } catch (e) {
    return dateString;
  }
};

// Get activity class based on type and state
const getActivityClass = (activity) => {
  // Base classes for all activities
  let classes = 'shadow-sm border hover:shadow-md transition-shadow duration-150';
  
  // Status-based classes
  if (activity.state === 'done') {
    return `${classes} bg-green-100 border-green-200`;
  } else if (activity.state === 'not_done') {
    return `${classes} bg-red-100 border-red-200`;
  }
  
  // Type-based classes for planned activities
  switch(activity.activity_type?.toLowerCase()) {
    case 'meeting':
      return `${classes} bg-blue-100 border-blue-200`;
    case 'training':
      return `${classes} bg-emerald-100 border-emerald-200`;
    case 'support':
      return `${classes} bg-purple-100 border-purple-200`;
    case 'admin':
      return `${classes} bg-amber-100 border-amber-200`;
    default:
      return `${classes} bg-gray-100 border-gray-200`;
  }
};

// Get type tag class
const getTypeTagClass = (type) => {
  if (!type) return 'bg-gray-100 text-gray-800';
  
  const colorMap = {
    'meeting': 'bg-blue-100 text-blue-700',
    'training': 'bg-emerald-100 text-emerald-700',
    'support': 'bg-purple-100 text-purple-700',
    'admin': 'bg-amber-100 text-amber-700',
    'other': 'bg-gray-100 text-gray-700'
  };
  
  return colorMap[type.toLowerCase()] || 'bg-gray-100 text-gray-700';
};

// Get status dot color
const getStatusDotClass = (activity) => {
  if (activity.state === 'done') {
    return 'bg-green-600';
  } else if (activity.state === 'not_done') {
    return 'bg-red-600';
  }
  
  // Based on activity type
  switch(activity.activity_type?.toLowerCase()) {
    case 'meeting':
      return 'bg-blue-600';
    case 'training':
      return 'bg-emerald-600';
    case 'support':
      return 'bg-purple-600';
    case 'admin':
      return 'bg-amber-600';
    default:
      return 'bg-gray-600';
  }
};

// Get status badge class
const getStatusClass = (state) => {
  switch(state) {
    case 'done':
      return 'bg-green-100 text-green-800';
    case 'not_done':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-blue-100 text-blue-800';
  }
};

// Get status text
const getStatusText = (state) => {
  switch(state) {
    case 'done':
      return 'Selesai';
    case 'not_done':
      return 'Tidak Selesai';
    default:
      return 'Direncanakan';
  }
};

// Get activity type full name in Indonesian
const getActivityTypeFull = (type) => {
  if (!type) return 'Lainnya';
  
  const typeNames = {
    'meeting': 'Rapat',
    'training': 'Pelatihan',
    'support': 'Dukungan',
    'admin': 'Administrasi',
    'other': 'Lainnya'
  };
  
  return typeNames[type.toLowerCase()] || type;
};

// Handle activity click
const handleActivityClick = (activity) => {
  emit('activity-click', activity);
};

// Handle time slot click
const handleTimeSlotClick = (day, slotIndex) => {
  // Calculate the time from slot index (each slot is 30 minutes)
  const totalMinutesFromStart = slotIndex * 30;
  const hours = Math.floor(totalMinutesFromStart / 60) + startHour;
  const minutes = totalMinutesFromStart % 60;
  
  // Format time as HH:MM
  const timeStart = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  
  // Calculate end time (30 minutes later)
  let endHour = hours;
  let endMinute = minutes + 30;
  
  if (endMinute >= 60) {
    endHour += 1;
    endMinute = 0;
  }
  
  const timeEnd = `${String(endHour).padStart(2, '0')}:${String(endMinute).padStart(2, '0')}`;
  
  // Emit event with day and time info
  emit('time-slot-click', {
    date: day.fullDate,
    time_start: timeStart,
    time_end: timeEnd,
    isToday: day.isToday
  });
};

// Handle clicking directly on time label
const handleTimeClick = (hour, minute) => {
  // Format time as HH:MM
  const timeStart = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
  
  // Calculate end time (1 hour later)
  let endHour = hour + 1;
  const timeEnd = `${String(endHour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
  
  // Find today in weekDays
  const todayDay = formattedWeekDays.value.find(day => day.isToday);
  
  if (todayDay) {
    emit('time-slot-click', {
      date: todayDay.fullDate,
      time_start: timeStart,
      time_end: timeEnd,
      isToday: true
    });
  } else if (formattedWeekDays.value.length > 0) {
    // If today is not in the week view, use the first day
    emit('time-slot-click', {
      date: formattedWeekDays.value[0].fullDate,
      time_start: timeStart,
      time_end: timeEnd,
      isToday: false
    });
  }
};
</script>

<style scoped>
/* Transitions and animations */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.transition-colors {
  transition-property: background-color, border-color, color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

.transition-shadow {
  transition-property: box-shadow;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.transition-opacity {
  transition-property: opacity;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

/* Line clamp for text */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;  
  overflow: hidden;
}

.group:hover .group-hover\:opacity-100 {
  opacity: 1;
}

.group:hover .group-hover\:z-30 {
  z-index: 30;
}

/* Animation for loading spinner */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
.animate-spin {
  animation: spin 1s linear infinite;
}
</style>