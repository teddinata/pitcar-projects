<!-- src/views/dashboard/TeamBAUCalendar.vue -->
<template>
  <div class="min-h-screen bg-gray-50">
    <Toast
      v-model:show="toast.show"
      :message="toast.message"
      :type="toast.type"
      :duration="toast.duration"
    />
    
    <!-- Bagian 1: Header & Navigation -->
    <div class="bg-white shadow">
      <div class="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="md:flex md:items-center md:justify-between">
          <div class="flex-1 min-w-0">
            <h1 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Kalender BAU Tim
            </h1>
          </div>
          <div class="mt-4 flex md:mt-0 md:ml-4 space-x-2">
            <button
              @click="showBatchModal = true"
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
              </svg>
              Rencanakan Batch
            </button>
            <button
              @click="showCreateModal = true"
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
              :disabled="loading"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
              </svg>
              Tambah Aktivitas
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content dengan Calendar Navigation -->
    <main class="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Calendar Navigation -->
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center">
          <button
            @click="previousPeriod"
            class="p-2 rounded-full hover:bg-gray-200 focus:outline-none transition-colors duration-200"
            :disabled="loading"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          </button>
          <h2 class="text-xl font-semibold text-gray-900 mx-4">
            {{ calendarTitle }}
          </h2>
          <button
            @click="nextPeriod"
            class="p-2 rounded-full hover:bg-gray-200 focus:outline-none transition-colors duration-200"
            :disabled="loading"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
        <div class="flex space-x-2">
          <button
            @click="changeViewMode('month')"
            :class="[
              'px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-200',
              viewMode === 'month' 
                ? 'bg-red-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
          >
            Bulan
          </button>
          <button
            @click="changeViewMode('week')"
            :class="[
              'px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-200',
              viewMode === 'week' 
                ? 'bg-red-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
          >
            Minggu
          </button>
        </div>
      </div>

      <!-- Loading Indicator -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="flex flex-col items-center">
          <svg class="animate-spin h-8 w-8 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p class="mt-3 text-sm text-gray-600">Memuat data kalender...</p>
        </div>
      </div>
      <!-- Bagian 2: Calendar Views -->
      <!-- Monthly Calendar View -->
      <div v-else-if="viewMode === 'month'" class="bg-white rounded-lg shadow overflow-hidden">
        <!-- Day Headers -->
        <div class="grid grid-cols-7 gap-px bg-gray-200">
          <div 
            v-for="day in dayHeaders" 
            :key="day" 
            class="bg-gray-50 py-2 text-center text-sm font-semibold text-gray-900"
          >
            {{ day }}
          </div>
        </div>

        <!-- Calendar Grid -->
        <div class="grid grid-cols-7 gap-px bg-gray-200">
          <div 
            v-for="(day, index) in calendarDays" 
            :key="index"
            :class="[
              'min-h-28 bg-white p-2',
              !day.isCurrentMonth ? 'bg-gray-50 text-gray-500' : '',
              day.isToday ? 'bg-red-50' : ''
            ]"
          >
            <!-- Date Display -->
            <div class="flex justify-between items-center mb-1">
              <span 
                :class="[
                  'text-sm font-medium',
                  day.isToday ? 'text-red-600' : 'text-gray-900'
                ]"
              >
                {{ day.date }}
              </span>
              <span v-if="day.hasActivities" class="flex h-5 w-5 items-center justify-center rounded-full" 
                :class="day.status === 'done' ? 'bg-green-100' : day.status === 'not_done' ? 'bg-red-100' : 'bg-yellow-100'">
                <svg v-if="day.status === 'done'" xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                <svg v-else-if="day.status === 'not_done'" xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-yellow-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
                </svg>
              </span>
            </div>

            <!-- Activities for this day -->
            <div class="space-y-1">
              <div 
                v-for="activity in day.activities.slice(0, 2)" 
                :key="activity.id"
                class="px-2 py-1 text-xs rounded truncate cursor-pointer transition-colors duration-200"
                :class="getActivityStatusClass(activity.state, activity.activity_type)"
                @click="viewActivityDetails(activity)"
              >
                {{ activity.name }} ({{ activity.hours_spent }}j)
              </div>

              <!-- Show more button if there are many activities -->
              <button 
                v-if="day.activities.length > 2" 
                @click="viewDayActivities(day.fullDate, day.activities)"
                class="text-xs text-red-600 hover:text-red-800 transition-colors duration-200"
              >
                + {{ day.activities.length - 2 }} lainnya
              </button>

              <!-- Quick add button -->
              <button 
                v-if="day.isCurrentMonth && day.isToday"
                @click="quickAddActivity(day.fullDate)"
                class="flex items-center text-xs text-gray-500 hover:text-red-600 mt-1 transition-colors duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
                </svg>
                Tambah
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Weekly Calendar View -->
      <div v-else-if="viewMode === 'week'">
        <BAUCalendarWeekView 
          :week-data="weekData"
          :loading="loading"
          @activity-click="viewActivityDetails"
          @time-slot-click="handleTimeSlotClick"
          @refresh="fetchActivities"
        />
      </div>
    </main>

    <!-- Bagian 3: Modal Components -->
    
    <!-- Activity Create/Edit Modal -->
    <BAUCreateEditModal
      :show="showCreateModal"
      :form-data="formData"
      :projects="projects"
      :is-editing="isEditing"
      :submitting="submitting"
      :show-verification-reason="showVerificationReason"
      @close="closeModal"
      @submit="handleSubmit"
      @update:hours-spent="formData.hours_spent = $event"
    />

    <!-- Activity Details Modal -->
    <BAUDetailsModal
      :show="showDetailsModal"
      :activity="selectedActivity"
      :can-edit="selectedActivity ? canEditActivity(selectedActivity) : false"
      :can-verify="selectedActivity ? canVerifyActivity(selectedActivity) : false"
      @close="closeDetailsModal"
      @edit="editActivity"
      @verify="verifyActivity"
    />

    <!-- Day Activities Modal -->
    <BAUDayActivitiesModal
      :show="showDayActivitiesModal"
      :date="selectedDay"
      :activities="selectedDayActivities"
      :is-today="isSelectedDayToday"
      @close="closeDayActivitiesModal"
      @view-details="viewActivityDetails"
      @add="quickAddActivity(selectedDay)"
    />

    <!-- BAU Batch Modal -->
    <BAUBatchModal
      :show="showBatchModal"
      :form-data="batchFormData"
      :projects="projects"
      :submitting="submittingBatch"
      @close="closeBatchModal"
      @submit="handleBatchSubmit"
      @update:hours-spent="batchFormData.hours_spent = $event"
    />

    <!-- Verification Reason Dialog -->
    <BAUVerificationReasonModal
      :show="showReasonDialog"
      :reason="verificationReason"
      @close="showReasonDialog = false"
      @submit="submitVerificationReason"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useToast } from '@/composables/useToast';
import apiClient from '@/config/api';

// Import Components
import Toast from '@/components/Toast.vue';
import BAUCreateEditModal from '@/components/team/BAUCreateEditModal.vue';
import BAUDetailsModal from '@/components/team/BAUDetailModal.vue';
import BAUBatchModal from '@/components/team/BAUBatchModal.vue';
import BAUDayActivitiesModal from '@/components/team/BAUDayActivitiesModal.vue';
import BAUVerificationReasonModal from '@/components/team/BAUVerificationReasonModal.vue';
import BAUCalendarWeekView from '@/components/team/BAUCalendarWeekView.vue';

// State
const { toast, showToast } = useToast();
const loading = ref(false);
const submitting = ref(false);
const submittingBatch = ref(false);
const viewMode = ref('week'); // Default to week view
const currentDate = ref(new Date());
const showCreateModal = ref(false);
const showBatchModal = ref(false);
const showDetailsModal = ref(false);
const showDayActivitiesModal = ref(false);
const showReasonDialog = ref(false);
const selectedActivity = ref(null);
const activityToVerify = ref(null);
const verificationReason = ref('');
const selectedDay = ref(null);
const selectedDayActivities = ref([]);
const isEditing = ref(false);
const projects = ref([]);

// Calendar data
const dayHeaders = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
const hours = Array.from({ length: 14 }, (_, i) => i + 7); // 7 AM to 8 PM
const calendarDays = ref([]);
const weekData = ref([]);

// Form data
const formData = ref({
  id: null,
  name: '',
  activity_type: 'meeting',
  date: '',
  time_start: '09:00',
  time_end: '10:00',
  hours_spent: 1,
  project_id: '',
  description: '',
  state: 'planned',
  verification_reason: ''
});

// Batch form data
const batchFormData = ref({
  name: '',
  activity_type: 'meeting',
  date_from: '',
  date_to: '',
  time_start: '09:00',
  time_end: '10:00',
  hours_spent: 1.0,
  project_id: '',
  description: '',
  exclude_weekends: true
});

// Computed properties
const todayDate = computed(() => {
  return formatDateYYYYMMDD(new Date());
});

const showVerificationReason = computed(() => {
  if (!isEditing.value || formData.value.state === 'planned') return false;
  
  const activityDate = new Date(formData.value.date);
  activityDate.setHours(0, 0, 0, 0);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const diffDays = Math.floor((today - activityDate) / (1000 * 60 * 60 * 24));
  
  return diffDays === 1; // Show reason if verification is H+1
});

const canVerify = computed(() => {
  if (!formData.value.date) return false;
  
  const activityDate = new Date(formData.value.date);
  activityDate.setHours(0, 0, 0, 0);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const diffDays = Math.floor((today - activityDate) / (1000 * 60 * 60 * 24));
  
  // Can verify if same day (H) or next day (H+1)
  return diffDays <= 1;
});

const calendarTitle = computed(() => {
  if (viewMode.value === 'week') {
    // For week view, show range (e.g., "7 - 13 Mar 2025")
    if (weekData.value.length > 0) {
      const firstDay = weekData.value[0];
      const lastDay = weekData.value[weekData.value.length - 1];
      
      if (firstDay && lastDay) {
        const firstDate = new Date(firstDay.date);
        const lastDate = new Date(lastDay.date);
        const sameMonth = firstDate.getMonth() === lastDate.getMonth();
        const sameYear = firstDate.getFullYear() === lastDate.getFullYear();

        // Format for Indonesian display
        const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
                           'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

        if (sameMonth && sameYear) {
          return `${firstDate.getDate()} - ${lastDate.getDate()} ${monthNames[firstDate.getMonth()]} ${firstDate.getFullYear()}`;
        } else if (sameYear) {
          return `${firstDate.getDate()} ${monthNames[firstDate.getMonth()]} - ${lastDate.getDate()} ${monthNames[lastDate.getMonth()]} ${firstDate.getFullYear()}`;
        } else {
          return `${firstDate.getDate()} ${monthNames[firstDate.getMonth()]} ${firstDate.getFullYear()} - ${lastDate.getDate()} ${monthNames[lastDate.getMonth()]} ${lastDate.getFullYear()}`;
        }
      }
    }
  }
  
  // For month view - using Indonesian month names
  const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
                      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  
  return `${monthNames[currentDate.value.getMonth()]} ${currentDate.value.getFullYear()}`;
});

const selectedDayTitle = computed(() => {
  if (!selectedDay.value) return '';
  return formatDate(selectedDay.value);
});

const isSelectedDayToday = computed(() => {
  if (!selectedDay.value) return false;
  
  const selectedDate = new Date(selectedDay.value);
  selectedDate.setHours(0, 0, 0, 0);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return selectedDate.getTime() === today.getTime();
});

const calculatedHours = computed(() => {
  if (!formData.value.time_start || !formData.value.time_end) return 0;
  
  try {
    // Parse time strings
    const startParts = formData.value.time_start.split(':');
    const endParts = formData.value.time_end.split(':');
    
    const startHours = parseInt(startParts[0]) + (parseInt(startParts[1]) / 60);
    const endHours = parseInt(endParts[0]) + (parseInt(endParts[1]) / 60);
    
    // Calculate duration (handle overnight activities)
    let duration = endHours - startHours;
    if (duration < 0) {
      duration = 24 + duration; // Add 24 hours if end time is on next day
    }
    
    return parseFloat(duration.toFixed(2));
  } catch (e) {
    console.error('Error calculating hours:', e);
    return 0;
  }
});

const batchCalculatedHours = computed(() => {
  if (!batchFormData.value.time_start || !batchFormData.value.time_end) return 0;
  
  try {
    // Parse time strings
    const startParts = batchFormData.value.time_start.split(':');
    const endParts = batchFormData.value.time_end.split(':');
    
    const startHours = parseInt(startParts[0]) + (parseInt(startParts[1]) / 60);
    const endHours = parseInt(endParts[0]) + (parseInt(endParts[1]) / 60);
    
    // Calculate duration (handle overnight activities)
    let duration = endHours - startHours;
    if (duration < 0) {
      duration = 24 + duration; // Add 24 hours if end time is on next day
    }
    
    return parseFloat(duration.toFixed(2));
  } catch (e) {
    console.error('Error calculating batch hours:', e);
    return 0;
  }
});

// Methods
// 1. Calendar Navigation & View Methods
const changeViewMode = (mode) => {
  if (viewMode.value === mode) return;
  viewMode.value = mode;
  fetchActivities();
};

const previousPeriod = () => {
  const newDate = new Date(currentDate.value);
  if (viewMode.value === 'month') {
    newDate.setMonth(newDate.getMonth() - 1);
  } else {
    newDate.setDate(newDate.getDate() - 7);
  }
  currentDate.value = newDate;
  fetchActivities();
};

const nextPeriod = () => {
  const newDate = new Date(currentDate.value);
  if (viewMode.value === 'month') {
    newDate.setMonth(newDate.getMonth() + 1);
  } else {
    newDate.setDate(newDate.getDate() + 7);
  }
  currentDate.value = newDate;
  fetchActivities();
};

// 2. API Methods
const fetchActivities = async () => {
  try {
    loading.value = true;
    
    // Prepare date range based on current view and month
    let dateFrom, dateTo;
    
    if (viewMode.value === 'month') {
      // Month range
      const year = currentDate.value.getFullYear();
      const month = currentDate.value.getMonth();
      
      // First day of month
      dateFrom = new Date(year, month, 1);
      // Last day of month
      dateTo = new Date(year, month + 1, 0);
    } else {
      // Week range
      const currentDay = new Date(currentDate.value);
      
      // Determine first day of week (Sunday)
      const firstDayOfWeek = new Date(currentDay);
      const day = currentDay.getDay();
      firstDayOfWeek.setDate(currentDay.getDate() - day);
      
      // Last day of week (Saturday)
      const lastDayOfWeek = new Date(firstDayOfWeek);
      lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);
      
      dateFrom = firstDayOfWeek;
      dateTo = lastDayOfWeek;
    }
    
    // Format dates (YYYY-MM-DD)
    const dateFromStr = formatDateYYYYMMDD(dateFrom);
    const dateToStr = formatDateYYYYMMDD(dateTo);
    
    // Call BAU calendar API
    const response = await apiClient.post('/web/v2/team/bau/calendar', {
      jsonrpc: '2.0',
      id: new Date().getTime(),
      params: {
        operation: 'get',
        date_from: dateFromStr,
        date_to: dateToStr,
        team_view: true  // Lihat semua aktivitas tim
      }
    });

    if (response.data.result?.status === 'success') {
      const calendarData = response.data.result.data;
      
      // Store data for reference
      const activitiesByDate = {};
      
      // Convert API data to expected format
      calendarData.forEach(day => {
        // Ensure all activities have time information
        const activities = (day.activities || []).map(activity => {
          // If activity is missing time object, create it from hours_spent
          if (!activity.time) {
            // Default to 9:00 AM start time if missing
            const defaultStartTime = '09:00';
            
            // Calculate end time based on hours_spent
            const hours = Math.floor(activity.hours_spent || 1);
            const minutes = Math.round(((activity.hours_spent || 1) % 1) * 60);
            
            // Parse default start time
            const [startHour, startMinute] = defaultStartTime.split(':').map(Number);
            
            // Calculate end time
            let endHour = startHour + hours;
            let endMinute = startMinute + minutes;
            
            // Handle minute overflow
            if (endMinute >= 60) {
              endHour += Math.floor(endMinute / 60);
              endMinute = endMinute % 60;
            }
            
            // Format end time
            const endTime = `${String(endHour).padStart(2, '0')}:${String(endMinute).padStart(2, '0')}`;
            
            activity.time = {
              start: defaultStartTime,
              end: endTime,
              duration: activity.hours_spent || 1
            };
            
            console.log(`Added missing time data for activity ${activity.id}`);
          }
          
          return activity;
        });
        
        activitiesByDate[day.date] = {
          activities: activities,
          totalHours: day.total_hours || 0,
          hasActivities: activities.length > 0,
          status: determineStatusFromActivities(activities),
          targetAchieved: day.target_achieved || false
        };
      });
      
      // Update calendar displays with API data
      updateCalendarWithData(activitiesByDate);
      
      // For debugging
      console.log('Processed activity data:', activitiesByDate);
    } else {
      showToast({
        message: response.data.result?.message || 'Gagal memuat data kalender',
        type: 'error',
        duration: 5000
      });
    }
  } catch (error) {
    console.error('Error fetching activities:', error);
    showToast({
      message: error.message || 'Gagal memuat aktivitas',
      type: 'error',
      duration: 5000
    });
  } finally {
    loading.value = false;
  }
};

const fetchProjects = async () => {
  try {
    const response = await apiClient.post('/web/v2/team/projects/list', {
      jsonrpc: '2.0',
      id: new Date().getTime(),
      params: {
        limit: 100 // Get all projects for dropdown
      }
    });

    if (response.data.result?.status === 'success') {
      projects.value = response.data.result.data || [];
    }
  } catch (error) {
    console.error('Error fetching projects:', error);
    showToast({
      message: 'Failed to load projects',
      type: 'error'
    });
  }
};

// 3. Activity Management Methods
const handleSubmit = async (submittedFormData) => {
  try {
    // Validate date (only today for new activities)
    if (!isEditing.value && submittedFormData.date !== todayDate.value) {
      showToast({
        message: 'Aktivitas baru hanya dapat dibuat untuk hari ini',
        type: 'error',
        duration: 5000
      });
      return;
    }
    
    submitting.value = true;
    
    // Store the time values for later use
    const sentTimeStart = submittedFormData.time_start;
    const sentTimeEnd = submittedFormData.time_end;
    
    // Determine operation (create or update)
    const operation = isEditing.value ? 'update' : 'create';
    
    // Prepare params
    const params = {
      operation,
      name: submittedFormData.name.trim(),
      activity_type: submittedFormData.activity_type,
      date: submittedFormData.date,
      time_start: submittedFormData.time_start,
      time_end: submittedFormData.time_end,
      hours_spent: submittedFormData.hours_spent,
      description: submittedFormData.description.trim(),
      creator_id: submittedFormData.creator_id,
    };
    
    // Include project_id if selected
    if (submittedFormData.project_id) {
      params.project_id = Number(submittedFormData.project_id);
    }
    
    // Add bau_id for updates
    if (isEditing.value && submittedFormData.id) {
      params.bau_id = submittedFormData.id;
      
      // Add state and verification reason for edited activities 
      if (submittedFormData.state !== 'planned') {
        params.state = submittedFormData.state;
        
        // If we need a verification reason and it's not provided, show error
        if (submittedFormData.state !== 'planned' && showVerificationReason.value && !submittedFormData.verification_reason) {
          showToast({
            message: 'Alasan verifikasi diperlukan untuk aktivitas H+1',
            type: 'error',
            duration: 5000
          });
          submitting.value = false;
          return;
        }
        
        if (submittedFormData.verification_reason) {
          params.verification_reason = submittedFormData.verification_reason;
        }
      }
    }
    
    // Call the API
    const response = await apiClient.post('/web/v2/team/bau', {
      jsonrpc: '2.0',
      id: new Date().getTime(),
      params
    });

    if (response.data.result?.status === 'success') {
      // If this is an update operation and the response doesn't include time info,
      // we need to manually add it to ensure UI consistency
      if (operation === 'update' && response.data.result.data) {
        const updatedActivity = response.data.result.data;
        
        // Check if time object is missing in the response
        if (!updatedActivity.time) {
          // Create time object with the sent values
          updatedActivity.time = {
            start: sentTimeStart,
            end: sentTimeEnd,
            duration: submittedFormData.hours_spent
          };
          
          console.log('Added missing time info to updated activity:', updatedActivity);
        }
      }
      
      showToast({
        message: isEditing.value ? 'Aktivitas berhasil diperbarui' : 'Aktivitas berhasil dibuat',
        type: 'success'
      });
      closeModal();
      fetchActivities();
    } else {
      showToast({
        message: response.data.result?.message || 'Gagal menyimpan aktivitas',
        type: 'error',
        duration: 5000
      });
    }
  } catch (error) {
    console.error('Error saving activity:', error);
    showToast({
      message: error.message || 'Gagal menyimpan aktivitas',
      type: 'error',
      duration: 5000
    });
  } finally {
    submitting.value = false;
  }
};

const handleBatchSubmit = async (submittedBatchForm) => {
  try {
    submittingBatch.value = true;
    
    // Prepare params for batch creation
    const activity = {
      name: submittedBatchForm.name,
      activity_type: submittedBatchForm.activity_type,
      creator_id: submittedBatchForm.creator_id, // Menggunakan creator_id dari form atau default ke 5
      time_start: submittedBatchForm.time_start,
      time_end: submittedBatchForm.time_end,
      hours_spent: submittedBatchForm.hours_spent,
      description: submittedBatchForm.description,
    };
    
    // Include project_id if selected
    if (submittedBatchForm.project_id) {
      activity.project_id = Number(submittedBatchForm.project_id);
    }
    
    const response = await apiClient.post('/web/v2/team/bau/batch', {
      jsonrpc: '2.0',
      id: new Date().getTime(),
      params: {
        params: { // Tambahkan level nested 'params' sesuai ekspektasi backend
          activity,
          date_from: submittedBatchForm.date_from,
          date_to: submittedBatchForm.date_to,
          exclude_weekends: submittedBatchForm.exclude_weekends
        }
      }
    });

    if (response.data.result?.status === 'success' || response.data.result?.status === 'partial_success') {
      // Count how many activities were successfully created
      const createdCount = response.data.result.data?.created?.length || 0;
      const errorsCount = response.data.result.data?.errors?.length || 0;
      
      let message = `Berhasil membuat ${createdCount} aktivitas BAU`;
      if (errorsCount > 0) {
        message += ` dengan ${errorsCount} error`;
      }
      
      showToast({
        message,
        type: errorsCount > 0 ? 'warning' : 'success',
        duration: 5000
      });
      
      closeBatchModal();
      fetchActivities();
    } else {
      showToast({
        message: response.data.result?.message || 'Gagal membuat aktivitas batch',
        type: 'error',
        duration: 5000
      });
    }
  } catch (error) {
    console.error('Error creating batch activities:', error);
    showToast({
      message: error.message || 'Gagal membuat aktivitas batch',
      type: 'error',
      duration: 5000
    });
  } finally {
    submittingBatch.value = false;
  }
};

const verifyActivity = async (activity, newState) => {
  // If it's a direct call from the BAUDetailsModal, we need to get the activity
  // from selectedActivity if activity is just a string (the state)
  let activityToProcessVerify = activity;
  let stateToSet = newState;
  
  if (typeof activity === 'string') {
    // This means we received just the state from the BAUDetailsModal
    activityToProcessVerify = selectedActivity.value;
    stateToSet = activity; // In this case, activity is actually the state
  }
  
  try {
    const isNextDay = isVerificationNextDay(activityToProcessVerify.date);
    // If verification is done on H+1 and no reason is provided, show the reason dialog
    if (isNextDay) {
      // Store the activity and state for later use
      activityToVerify.value = { activity: activityToProcessVerify, newState: stateToSet };
      showReasonDialog.value = true;
      return;
    }
    
    // Otherwise, proceed with verification
    await processVerification(activityToProcessVerify, stateToSet, '');
  } catch (error) {
    console.error('Error in verifyActivity:', error);
    showToast({
      message: error.message || 'Gagal memverifikasi aktivitas',
      type: 'error',
      duration: 5000
    });
  }
};

const processVerification = async (activity, newState, reason = '') => {
  try {
    const response = await apiClient.post('/web/v2/team/bau/verify', {
      jsonrpc: '2.0',
      id: new Date().getTime(),
      params: {
        bau_id: activity.id,
        state: newState,
        verification_reason: reason,
        hours_spent: activity.hours_spent
      }
    });

    if (response.data.result?.status === 'success') {
      showToast({
        message: `Status aktivitas berhasil diubah menjadi ${newState === 'done' ? 'Selesai' : 'Tidak Selesai'}`,
        type: 'success'
      });
      closeDetailsModal();
      fetchActivities();
    } else {
      showToast({
        message: response.data.result?.message || 'Gagal memverifikasi aktivitas',
        type: 'error',
        duration: 5000
      });
    }
  } catch (error) {
    console.error('Error processing verification:', error);
    showToast({
      message: error.message || 'Gagal memverifikasi aktivitas',
      type: 'error',
      duration: 5000
    });
  }
};

const submitVerificationReason = (reason) => {
  if (!activityToVerify.value) return;
  
  processVerification(
    activityToVerify.value.activity, 
    activityToVerify.value.newState, 
    reason
  );
  
  // Reset state
  showReasonDialog.value = false;
  verificationReason.value = '';
  activityToVerify.value = null;
};

const editActivity = () => {
  if (!selectedActivity.value) return;
  
  // Copy activity data to form
  formData.value = {
    id: selectedActivity.value.id,
    name: selectedActivity.value.name,
    activity_type: selectedActivity.value.activity_type,
    date: selectedActivity.value.date,
    time_start: selectedActivity.value.time?.start || '09:00',
    time_end: selectedActivity.value.time?.end || '10:00',
    hours_spent: selectedActivity.value.hours_spent,
    description: selectedActivity.value.description || '',
    project_id: selectedActivity.value.project?.id || '',
    state: selectedActivity.value.state || 'planned',
    verification_reason: '',
  };
  
  isEditing.value = true;
  showDetailsModal.value = false;
  showCreateModal.value = true;
};

// 4. Modal Management
const closeModal = () => {
  showCreateModal.value = false;
  isEditing.value = false;
  formData.value = {
    id: null,
    name: '',
    activity_type: 'meeting',
    date: todayDate.value,
    time_start: '09:00',
    time_end: '10:00',
    hours_spent: 1,
    project_id: '',
    description: '',
    state: 'planned',
    verification_reason: ''
  };
};

const closeDetailsModal = () => {
  showDetailsModal.value = false;
  selectedActivity.value = null;
};

const closeDayActivitiesModal = () => {
  showDayActivitiesModal.value = false;
  selectedDay.value = null;
  selectedDayActivities.value = [];
};

const closeBatchModal = () => {
  showBatchModal.value = false;
  batchFormData.value = {
    name: '',
    activity_type: 'meeting',
    date_from: todayDate.value,
    date_to: '',
    time_start: '09:00',
    time_end: '10:00',
    hours_spent: 1.0,
    project_id: '',
    description: '',
    exclude_weekends: true
  };
};

const viewActivityDetails = (activity) => {
  selectedActivity.value = activity;
  showDetailsModal.value = true;
  
  // Close day activities modal if open
  if (showDayActivitiesModal.value) {
    showDayActivitiesModal.value = false;
  }
};

const viewDayActivities = (date, activities) => {
  selectedDay.value = date;
  selectedDayActivities.value = activities;
  showDayActivitiesModal.value = true;
};

const quickAddActivity = (date) => {
  // Only allow adding activities for today
  const selectedDate = new Date(date);
  const today = new Date();
  
  // Reset hours to 0 for proper date comparison
  selectedDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  
  if (selectedDate.getTime() !== today.getTime()) {
    showToast({
      message: 'Aktivitas baru hanya dapat dibuat untuk hari ini',
      type: 'warning',
      duration: 3000
    });
    return;
  }
  
  formData.value.date = date;
  isEditing.value = false;
  showCreateModal.value = true;
};

const handleTimeSlotClick = (timeSlotInfo) => {
  // Only allow adding activities for today
  const selectedDate = new Date(timeSlotInfo.date);
  const today = new Date();
  
  // Reset hours to 0 for proper date comparison
  selectedDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  
  if (selectedDate.getTime() !== today.getTime()) {
    showToast({
      message: 'Aktivitas baru hanya dapat dibuat untuk hari ini',
      type: 'warning',
      duration: 3000
    });
    return;
  }
  
  // Set form data with time slot info
  formData.value = {
    ...formData.value,
    date: timeSlotInfo.date,
    time_start: timeSlotInfo.time_start,
    time_end: timeSlotInfo.time_end,
    hours_spent: calculatedHours.value
  };
  
  isEditing.value = false;
  showCreateModal.value = true;
};

// 5. Helper Methods
const canEditActivity = (activity) => {
  if (!activity) return false;
  
  // Current date
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Activity date
  const activityDate = new Date(activity.date);
  activityDate.setHours(0, 0, 0, 0);
  
  // Can only edit today's activities or future activities
  const diffDays = Math.floor((today - activityDate) / (1000 * 60 * 60 * 24));
  
  // If it's verified, can't edit anymore
  if (activity.verification && activity.verification.verified_by) return false;
  
  // Allow editing if it's today's activity or a future activity
  return diffDays <= 0;
};

const canVerifyActivity = (activity) => {
  if (!activity) return false;
  if (activity.state !== 'planned') return false;
  
  const activityDate = new Date(activity.date);
  activityDate.setHours(0, 0, 0, 0);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const diffDays = Math.floor((today - activityDate) / (1000 * 60 * 60 * 24));
  
  // Can verify if activity is on today or yesterday
  return diffDays <= 1;
};

const isVerificationNextDay = (activityDate) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const date = new Date(activityDate);
  date.setHours(0, 0, 0, 0);
  
  const diffDays = Math.floor((today - date) / (1000 * 60 * 60 * 24));
  return diffDays === 1;
};

const determineStatusFromActivities = (activities) => {
  if (!activities || activities.length === 0) return 'planned';
  
  const allDone = activities.every(a => a.state === 'done');
  const anyNotDone = activities.some(a => a.state === 'not_done');
  
  if (allDone) return 'done';
  if (anyNotDone) return 'not_done';
  return 'planned';
};

const generateMonthDays = () => {
  const days = [];
  const year = currentDate.value.getFullYear();
  const month = currentDate.value.getMonth();
  
  // Get first day of month and last day of month
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  
  // Get days from previous month to fill first week
  const daysFromPrevMonth = firstDay.getDay();
  const prevMonth = new Date(year, month, 0);
  for (let i = 0; i < daysFromPrevMonth; i++) {
    const date = prevMonth.getDate() - daysFromPrevMonth + i + 1;
    const prevMonthYear = month === 0 ? year - 1 : year;
    const prevMonthNum = month === 0 ? 11 : month - 1;
    const fullDate = `${prevMonthYear}-${String(prevMonthNum + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
    
    days.push({
      date,
      fullDate,
      isCurrentMonth: false,
      isToday: false,
      activities: [],
      hasActivities: false,
      status: 'planned'
    });
  }
  
  // Current month days
  const today = new Date();
  for (let date = 1; date <= lastDay.getDate(); date++) {
    const dayDate = new Date(year, month, date);
    const fullDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
    
    days.push({
      date,
      fullDate,
      isCurrentMonth: true,
      isToday: dayDate.toDateString() === today.toDateString(),
      activities: [],
      hasActivities: false,
      status: 'planned'
    });
  }
  
  // Next month days to complete the grid
  const daysInGrid = Math.ceil(days.length / 7) * 7;
  const remainingDays = daysInGrid - days.length;
  
  for (let date = 1; date <= remainingDays; date++) {
    const nextMonthYear = month === 11 ? year + 1 : year;
    const nextMonthNum = month === 11 ? 0 : month + 1;
    const fullDate = `${nextMonthYear}-${String(nextMonthNum + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
    
    days.push({
      date,
      fullDate,
      isCurrentMonth: false,
      isToday: false,
      activities: [],
      hasActivities: false,
      status: 'planned'
    });
  }
  
  calendarDays.value = days;
};

const updateCalendarWithData = (activitiesByDate) => {
  if (viewMode.value === 'month') {
    // Generate month grid
    generateMonthDays();
    
    // Update calendar days with activity data
    calendarDays.value = calendarDays.value.map(day => {
      const dateData = activitiesByDate[day.fullDate];
      if (dateData) {
        return {
          ...day,
          activities: dateData.activities,
          hasActivities: dateData.activities.length > 0,
          status: determineStatusFromActivities(dateData.activities)
        };
      }
      return {
        ...day,
        activities: [],
        hasActivities: false,
        status: 'planned'
      };
    });
  } else {
    // For week view, use the weekData directly
    weekData.value = Object.keys(activitiesByDate)
      .sort()
      .map(date => ({
        date,
        activities: activitiesByDate[date].activities || [],
        total_hours: activitiesByDate[date].totalHours || 0,
        target_achieved: activitiesByDate[date].targetAchieved || false
      }));
      
    console.log('Week data updated:', weekData.value);
  }
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  
  // Indonesian month names
  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  
  return `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
};

const formatDateYYYYMMDD = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getActivityStatusClass = (state, type = 'other') => {
  // Status class takes precedence
  switch(state) {
    case 'done':
      return 'bg-green-100 text-green-800';
    case 'not_done':
      return 'bg-red-100 text-red-800';
    default: // planned
      // Fall back to type-based coloring
      return getActivityTypeColorClass(type);
  }
};

const getActivityTypeColorClass = (type) => {
  if (!type) return 'bg-gray-100 text-gray-800';
  
  const colorMap = {
    'meeting': 'bg-blue-100 text-blue-800',
    'training': 'bg-green-100 text-green-800',
    'support': 'bg-pink-100 text-pink-800',
    'admin': 'bg-indigo-100 text-indigo-800',
    'other': 'bg-gray-100 text-gray-800'
  };
  
  return colorMap[type.toLowerCase()] || 'bg-gray-100 text-gray-800';
};

// Initialize batch form
const initBatchForm = () => {
  const today = new Date();
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);
  
  batchFormData.value.date_from = formatDateYYYYMMDD(today);
  batchFormData.value.date_to = formatDateYYYYMMDD(nextWeek);
};

// Watchers
watch([() => formData.value.time_start, () => formData.value.time_end], () => {
  formData.value.hours_spent = calculatedHours.value;
});

watch([() => batchFormData.value.time_start, () => batchFormData.value.time_end], () => {
  batchFormData.value.hours_spent = batchCalculatedHours.value;
});

// Lifecycle hooks
onMounted(() => {
  // Initialize with today's date
  currentDate.value = new Date();
  
  // Set default date in form to today
  formData.value.date = formatDateYYYYMMDD(new Date());
  
  // Initialize batch form
  initBatchForm();
  
  // Fetch initial activities and projects
  fetchProjects();
  fetchActivities();
});
</script>

<style scoped>
/* Add smooth transitions for all interactive elements */
.transition-colors {
  transition-property: background-color, border-color, color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
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