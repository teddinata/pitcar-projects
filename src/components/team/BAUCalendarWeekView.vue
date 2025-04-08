<!-- src/components/team/BAUCalendarWeekView.vue -->
<template>
  <div class="bg-white rounded-lg shadow">
    <!-- Week Header -->
    <div class="grid grid-cols-8 border-b">
      <!-- Time column header -->
      <div class="py-3 border-r"></div>
      
      <!-- Day columns headers -->
      <div 
        v-for="(day, index) in formattedWeekData" 
        :key="index"
        :class="[
          'py-3 text-center border-r last:border-r-0',
          isToday(day.date) ? 'bg-red-50' : ''
        ]"
      >
        <div class="font-semibold">{{ formatDayName(day.date) }}</div>
        <div class="text-sm text-gray-500">{{ formatShortDate(day.date) }}</div>
      </div>
    </div>
    
    <!-- Week Grid -->
    <div class="relative">
      <!-- Time Labels and Grid -->
      <div class="grid grid-cols-8 relative">
        <!-- Time labels column -->
        <div class="border-r">
          <div 
            v-for="hour in hours" 
            :key="hour" 
            class="h-20 border-b text-xs text-gray-500 text-right pr-2 pt-1"
          >
            {{ formatHour(hour) }}
          </div>
        </div>
        
        <!-- Day columns with Time slots -->
        <template v-for="(day, dayIndex) in formattedWeekData" :key="`day-${dayIndex}`">
          <div 
            :class="[
              'border-r last:border-r-0 relative',
              isToday(day.date) ? 'bg-red-50' : ''
            ]"
          >
            <!-- Time slots -->
            <div 
              v-for="hour in hours" 
              :key="`slot-${hour}`"
              class="h-20 border-b relative"
              @click="handleTimeSlotClick(day.date, hour)"
            ></div>
            
            <!-- Activities for this day - with improved handling for overlapping activities -->
            <template v-if="day.activities && day.activities.length > 0">
              <!-- Process activities to handle overlaps -->
              <template v-for="(activity, activityIndex) in processedActivities(day.activities)" :key="`activity-${activity.id}`">
                <div 
                  class="absolute rounded px-2 py-1 text-xs overflow-hidden cursor-pointer transition-colors border-l-2"
                  :class="[
                    getActivityStatusClass(activity.state, activity.activity_type),
                    getDepartmentColors(activity.creator?.department_id).bg,
                    getDepartmentColors(activity.creator?.department_id).border,
                    activity.creator?.id === userEmployeeId ? 'border-l-4' : 'border-l-2',
                    activity._meta && activity._meta.timeSlotCount > 2 ? 'hover:z-20' : ''
                  ]"
                  :style="getActivityStyle(activity, day.date, 
                                         activity._meta ? activity._meta.timeSlotIndex : 0, 
                                         activity._meta ? activity._meta.timeSlotCount : 1)"
                  @click.stop="$emit('activity-click', activity)"
                >
                  <div class="font-medium truncate" :class="{'text-xxs': activity._meta && activity._meta.timeSlotCount > 2}">
                    {{ activity.name }}
                  </div>
                  <div class="flex justify-between">
                    <span class="text-xxs truncate">{{ activity.creator?.name || 'No creator' }}</span>
                    <span class="text-xxs whitespace-nowrap">{{ formatTimeRange(activity) }}</span>
                  </div>
                </div>
              </template>
            </template>
          </div>
        </template>
      </div>
      
      <!-- Current time indicator -->
      <div 
        v-if="showCurrentTimeIndicator"
        class="absolute left-0 right-0 border-t border-red-500 z-10"
        :style="{ top: currentTimePosition + 'px' }"
      >
        <div class="absolute -left-1 -top-1.5 w-3 h-3 rounded-full bg-red-500"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';

const props = defineProps({
  weekData: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  teamView: {
    type: Boolean,
    default: true
  },
  userEmployeeId: {
    type: [Number, String],
    default: null
  }
});

const emit = defineEmits(['activity-click', 'time-slot-click', 'refresh']);

// State
const hours = ref(Array.from({ length: 13 }, (_, i) => i + 7)); // 7 AM to 8 PM
const currentTimePosition = ref(0);
const showCurrentTimeIndicator = ref(false);
const currentTimeInterval = ref(null);

// Add the department color function
const getDepartmentColors = (departmentId) => {
  // Mapping of department IDs to colors (border and background)
  const departmentColors = {
    1: { border: 'border-red-500', bg: 'bg-red-50' },
    2: { border: 'border-blue-500', bg: 'bg-blue-50' },
    3: { border: 'border-green-500', bg: 'bg-green-50' },
    4: { border: 'border-yellow-500', bg: 'bg-yellow-50' },
    5: { border: 'border-purple-500', bg: 'bg-purple-50' },
    6: { border: 'border-pink-500', bg: 'bg-pink-50' },
    7: { border: 'border-indigo-500', bg: 'bg-indigo-50' },
    8: { border: 'border-orange-500', bg: 'bg-orange-50' },
    9: { border: 'border-cyan-500', bg: 'bg-cyan-50' }, // Marketing department
    10: { border: 'border-lime-500', bg: 'bg-lime-50' },
    11: { border: 'border-teal-500', bg: 'bg-teal-50' },
    12: { border: 'border-emerald-500', bg: 'bg-emerald-50' }, // IT Division
    // Add more departments as needed
  };
  
  return departmentColors[departmentId] || { border: 'border-gray-300', bg: 'bg-gray-50' };
};

// Ensure we have data for all 7 days of the week
const formattedWeekData = computed(() => {
  // If weekData is empty or not enough days
  if (!props.weekData || props.weekData.length === 0) {
    // Create 7 empty days starting from the current day
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const emptyWeek = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - date.getDay() + i); // Start from Sunday
      
      emptyWeek.push({
        date: formatDateYYYYMMDD(date),
        activities: [],
        total_hours: 0
      });
    }
    return emptyWeek;
  }
  
  // If we have data but not for all 7 days
  if (props.weekData.length < 7) {
    // Find the first date in the existing data
    const firstDate = props.weekData.length > 0 ? new Date(props.weekData[0].date) : new Date();
    firstDate.setHours(0, 0, 0, 0);
    
    // Get the Sunday of that week
    const sunday = new Date(firstDate);
    sunday.setDate(sunday.getDate() - sunday.getDay());
    
    // Create a map of existing dates
    const existingDates = {};
    props.weekData.forEach(day => {
      existingDates[day.date] = day;
    });
    
    // Create a full week with 7 days
    const fullWeek = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(sunday);
      date.setDate(date.getDate() + i);
      const dateStr = formatDateYYYYMMDD(date);
      
      if (existingDates[dateStr]) {
        // Use existing data
        fullWeek.push(existingDates[dateStr]);
      } else {
        // Create empty day
        fullWeek.push({
          date: dateStr,
          activities: [],
          total_hours: 0
        });
      }
    }
    return fullWeek;
  }
  
  // If we already have 7 days of data
  return props.weekData;
});

// Methods
const formatDayName = (dateString) => {
  const date = new Date(dateString);
  const days = ['Ming', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
  return days[date.getDay()];
};

const formatShortDate = (dateString) => {
  const date = new Date(dateString);
  return `${date.getDate()}/${date.getMonth() + 1}`;
};

const formatHour = (hour) => {
  return `${hour}:00`;
};

const formatTimeRange = (activity) => {
  if (!activity.time) {
    return ''; // Handle activities without time data
  }
  return `${activity.time.start} - ${activity.time.end}`;
};

const isToday = (dateString) => {
  const date = new Date(dateString);
  date.setHours(0, 0, 0, 0);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return date.getTime() === today.getTime();
};

const processedActivities = (activities) => {
  if (!activities || activities.length <= 1) return activities;
  
  // Group activities by time slot
  const timeSlots = {};
  
  activities.forEach(activity => {
    if (!activity.time || !activity.time.start) return;
    
    // Round start time to nearest hour for grouping
    const startHour = parseInt(activity.time.start.split(':')[0]);
    const groupKey = `${startHour}:00`;
    
    if (!timeSlots[groupKey]) {
      timeSlots[groupKey] = [];
    }
    
    timeSlots[groupKey].push(activity);
  });
  
  // Add metadata to each activity
  const result = [];
  
  Object.keys(timeSlots).forEach(timeSlot => {
    const activitiesInSlot = timeSlots[timeSlot];
    const count = activitiesInSlot.length;
    
    if (count > 1) {
      // Multiple activities in this time slot
      activitiesInSlot.forEach((activity, index) => {
        result.push({
          ...activity,
          _meta: {
            timeSlotIndex: index,
            timeSlotCount: count
          }
        });
      });
    } else {
      // Single activity in this time slot
      result.push(activitiesInSlot[0]);
    }
  });
  
  return result;
};

// Update getActivityStyle to handle multiple activities
const getActivityStyle = (activity, dayDate, index = 0, activitiesAtSameTime = 1) => {
  try {
    // Default position if time data is missing
    if (!activity.time || !activity.time.start || !activity.time.end) {
      return {
        top: '0px',
        height: '25px',
        width: 'calc(100% - 8px)',
        left: '4px',
        right: '4px',
        zIndex: 5
      };
    }
    
    // Get time info
    const startTime = activity.time.start.split(':').map(Number);
    const endTime = activity.time.end.split(':').map(Number);
    
    // Convert to hours from midnight
    const startHour = startTime[0] + (startTime[1] / 60);
    const endHour = endTime[0] + (endTime[1] / 60);
    
    // Calculate top position (based on start time)
    const firstHourOfDay = hours.value[0]; // Usually 7 AM
    const top = (startHour - firstHourOfDay) * 80;
    
    // Calculate height (based on duration)
    const duration = endHour > startHour ? (endHour - startHour) : (24 - startHour + endHour);
    const height = Math.max(25, duration * 80); // Minimum height 25px for visibility
    
    // Handle multiple activities at the same time slot
    if (activitiesAtSameTime > 1) {
      // Calculate width based on number of concurrent activities
      const width = `calc(${100 / activitiesAtSameTime}% - 8px)`;
      
      // Calculate left position - distribute activities horizontally
      const leftPercent = (index / activitiesAtSameTime) * 100;
      const left = `calc(${leftPercent}% + 4px)`;
      
      return {
        top: `${Math.max(0, top)}px`,
        height: `${height}px`,
        width: width,
        left: left,
        zIndex: 5
      };
    }
    
    // Default single activity style
    return {
      top: `${Math.max(0, top)}px`,
      height: `${height}px`,
      width: 'calc(100% - 8px)',
      left: '4px',
      right: '4px',
      zIndex: 5
    };
  } catch (error) {
    console.error('Error calculating activity style:', error, activity);
    return {
      top: '0px',
      height: '25px',
      width: 'calc(100% - 8px)',
      left: '4px',
      right: '4px',
      zIndex: 5
    };
  }
};

// Update getActivityStatusClass to only provide text color, not background
const getActivityStatusClass = (state, type = 'other') => {
  // Status class takes precedence but only for text color now
  switch(state) {
    case 'done':
      return 'text-green-800';
    case 'not_done':
      return 'text-red-800';
    default: // planned
      // Fall back to type-based coloring
      return getActivityTypeTextClass(type);
  }
};

// New function to get just text color
const getActivityTypeTextClass = (type) => {
  if (!type) return 'text-gray-800';
  
  const colorMap = {
    'meeting': 'text-blue-800',
    'training': 'text-green-800',
    'support': 'text-pink-800',
    'admin': 'text-indigo-800',
    'other': 'text-gray-800'
  };
  
  return colorMap[type.toLowerCase()] || 'text-gray-800';
};

const handleTimeSlotClick = (date, hour) => {
  // Calculate times for the clicked slot
  const startHour = Math.floor(hour);
  const startMinute = 0;
  const endHour = Math.floor(hour + 1);
  const endMinute = 0;
  
  // Format for HH:MM
  const time_start = `${String(startHour).padStart(2, '0')}:${String(startMinute).padStart(2, '0')}`;
  const time_end = `${String(endHour).padStart(2, '0')}:${String(endMinute).padStart(2, '0')}`;
  
  // Emit event with date and time information
  emit('time-slot-click', {
    date,
    time_start,
    time_end
  });
};

const updateCurrentTimeIndicator = () => {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  
  const firstHourOfDay = 7; // Should match the first hour in hours array
  
  // Calculate position
  const hoursDecimal = hours + (minutes / 60);
  const position = (hoursDecimal - firstHourOfDay) * 80; // Each hour is 80px
  
  // Update state
  currentTimePosition.value = position;
  
  // Show indicator if within visible range
  showCurrentTimeIndicator.value = hours >= firstHourOfDay && hours < (firstHourOfDay + 14);
};

// Helper function to format date YYYY-MM-DD
const formatDateYYYYMMDD = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Watch for changes in weekData to trigger a refresh of layout
watch(() => props.weekData, () => {
  // If needed, add additional functionality when weekData changes
}, { deep: true });

// Lifecycle hooks
onMounted(() => {
  // Set initial position
  updateCurrentTimeIndicator();
  
  // Update every minute
  currentTimeInterval.value = setInterval(updateCurrentTimeIndicator, 60000);
});

onBeforeUnmount(() => {
  // Clean up interval
  if (currentTimeInterval.value) {
    clearInterval(currentTimeInterval.value);
  }
});
</script>

<style scoped>
.text-xxs {
  font-size: 0.625rem;
  line-height: 0.75rem;
}

/* Tambahkan hover effect untuk aktivitas bertumpuk */
.hover\:z-20:hover {
  z-index: 20 !important;
  transform: scale(1.05);
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: all 0.2s ease;
}
</style>