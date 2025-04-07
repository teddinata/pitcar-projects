<template>
  <div class="min-h-screen bg-gray-50">
    <Toast
      v-model:show="toast.show"
      :message="toast.message"
      :type="toast.type"
      :duration="toast.duration"
    />
    
    <!-- Header -->
    <div class="bg-white shadow">
      <div class="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="md:flex md:items-center md:justify-between">
          <div class="flex-1 min-w-0">
            <h1 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Dashboard Aktivitas Tim
            </h1>
          </div>
          <div class="mt-4 flex md:mt-0 md:ml-4">
            <button
              @click="fetchDashboardData"
              class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              :disabled="loading"
            >
              <ArrowPathIcon :class="['h-4 w-4 mr-1.5', loading ? 'animate-spin' : '']" />
              {{ loading ? 'Memuat...' : 'Segarkan' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <main class="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Time Period Selector -->
      <div class="mb-6">
        <div class="bg-white rounded-lg shadow p-4">
          <div class="flex flex-wrap justify-between items-center">
            <div>
              <h2 class="text-lg font-medium text-gray-900">Pilih Periode Waktu</h2>
            </div>
            <div class="flex space-x-2 mt-3 sm:mt-0">
              <button
                v-for="period in timePeriods"
                :key="period.value"
                @click="selectedPeriod = period.value; fetchDashboardData()"
                :class="[
                  'px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-200',
                  selectedPeriod === period.value
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                ]"
              >
                {{ period.label }}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- KPI Cards -->
      <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <!-- BAU Realization Rate -->
        <div class="bg-white overflow-hidden shadow rounded-lg transition-all duration-200 hover:shadow-md">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <CheckCircleIcon class="h-6 w-6" :class="dashboardData.realizationRate >= 80 ? 'text-green-500' : 'text-yellow-500'" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">
                    Tingkat Realisasi Aktivitas
                  </dt>
                  <dd class="flex items-baseline">
                    <div class="text-2xl font-semibold text-gray-900">
                      {{ dashboardData.realizationRate || 0 }}%
                    </div>
                    <div 
                      :class="[
                        dashboardData.realizationTrend > 0 ? 'text-green-600' : 'text-red-600',
                        'ml-2 flex items-baseline text-sm font-semibold'
                      ]"
                    >
                      <ArrowUpIcon v-if="dashboardData.realizationTrend > 0" class="self-center flex-shrink-0 h-5 w-5" />
                      <ArrowDownIcon v-else class="self-center flex-shrink-0 h-5 w-5" />
                      <span class="sr-only">
                        {{ dashboardData.realizationTrend > 0 ? 'Meningkat' : 'Menurun' }} sebesar
                      </span>
                      {{ Math.abs(dashboardData.realizationTrend) }}%
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-5 py-3">
            <div class="text-sm">
              <button @click="showRealizationDetails = true" class="font-medium text-red-600 hover:text-red-500 transition-colors duration-200">
                Lihat detail
              </button>
            </div>
          </div>
        </div>

        <!-- Activity Status Summary -->
        <div class="bg-white overflow-hidden shadow rounded-lg transition-all duration-200 hover:shadow-md">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <ClipboardIcon class="h-6 w-6 text-emerald-500" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">
                    Status Aktivitas
                  </dt>
                  <dd class="mt-2 flex space-x-2">
                    <div class="flex items-center bg-green-100 px-2 py-1 rounded-full text-xs">
                      <CheckIcon class="h-3 w-3 mr-1 text-green-600" />
                      <span class="text-green-800">{{ dashboardData.completedActivities || 0 }}</span>
                    </div>
                    <div class="flex items-center bg-red-100 px-2 py-1 rounded-full text-xs">
                      <XMarkIcon  class="h-3 w-3 mr-1 text-red-600" />
                      <span class="text-red-800">{{ dashboardData.notDoneActivities || 0 }}</span>
                    </div>
                    <div class="flex items-center bg-yellow-100 px-2 py-1 rounded-full text-xs">
                      <ClockIcon class="h-3 w-3 mr-1 text-yellow-600" />
                      <span class="text-yellow-800">{{ dashboardData.plannedActivities || 0 }}</span>
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-5 py-3">
            <div class="text-sm">
              <router-link to="/team/bau/activities" class="font-medium text-red-600 hover:text-red-500 transition-colors duration-200">
                Lihat semua aktivitas
              </router-link>
            </div>
          </div>
        </div>

        <!-- Total Activities -->
        <div class="bg-white overflow-hidden shadow rounded-lg transition-all duration-200 hover:shadow-md">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <CalendarIcon class="h-6 w-6 text-blue-500" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">
                    Total Aktivitas BAU
                  </dt>
                  <dd class="flex items-baseline">
                    <div class="text-2xl font-semibold text-gray-900">
                      {{ dashboardData.totalActivities || 0 }}
                    </div>
                    <div class="ml-2 text-sm text-gray-500">
                      {{ dashboardData.totalDays || 0 }} hari
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-5 py-3">
            <div class="text-sm">
              <button @click="showActivityBreakdown = true" class="font-medium text-red-600 hover:text-red-500 transition-colors duration-200">
                Lihat analisa
              </button>
            </div>
          </div>
        </div>

        <!-- BAU vs Project Time -->
        <div class="bg-white overflow-hidden shadow rounded-lg transition-all duration-200 hover:shadow-md">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <ScaleIcon class="h-6 w-6 text-yellow-500" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">
                    BAU vs Waktu Proyek
                  </dt>
                  <dd class="flex items-baseline">
                    <div class="text-2xl font-semibold text-gray-900">
                      {{ bauVsProjectRatioFormatted }}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-5 py-3">
            <div class="text-sm">
              <button @click="showBauVsProjectAnalysis = true" class="font-medium text-red-600 hover:text-red-500 transition-colors duration-200">
                Lihat analisa
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Recent BAU Activities -->
      <div class="mt-8">
        <div class="bg-white shadow rounded-lg overflow-hidden transition-all duration-200 hover:shadow-md">
          <div class="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
            <h3 class="text-lg leading-6 font-medium text-gray-900">
              Aktivitas BAU Terbaru
            </h3>
            <router-link to="/team/bau/calendar" class="text-sm font-medium text-red-600 hover:text-red-500 transition-colors duration-200">
              Lihat kalender
            </router-link>
          </div>
          <div v-if="loading" class="p-8 flex justify-center">
            <ArrowPathIcon class="h-8 w-8 text-gray-400 animate-spin" />
          </div>
          <div v-else-if="recentActivities.length === 0" class="p-8 text-center">
            <p class="text-gray-500">Tidak ada aktivitas terbaru ditemukan</p>
          </div>
          <ul v-else class="divide-y divide-gray-200">
            <li v-for="activity in recentActivities" :key="activity.id" class="px-6 py-4 hover:bg-gray-50 transition-colors duration-200">
              <div class="flex items-center space-x-4">
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-red-600 truncate">
                    {{ activity.name }}
                  </p>
                  <p class="mt-1 text-sm text-gray-500">
                    {{ activity.description || 'Tidak ada deskripsi' }}
                  </p>
                  <div v-if="activity.project" class="mt-1 text-xs text-gray-500">
                    <span class="font-medium">Proyek:</span> {{ activity.project.name }}
                  </div>
                </div>
                <div>
                  <div class="flex flex-col items-end space-y-1">
                    <div class="flex items-center space-x-2">
                      <span :class="[
                        'px-2 inline-flex text-xs leading-5 font-semibold rounded-full', 
                        getActivityTypeColorClass(activity.activity_type)
                      ]">
                        {{ getTranslatedActivityType(activity.activity_type) }}
                      </span>
                      <span :class="[
                        'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                        getActivityStatusClass(activity.state)
                      ]">
                        {{ activity.state === 'done' ? 'Selesai' : 
                           activity.state === 'not_done' ? 'Tidak Selesai' : 'Direncanakan' }}
                      </span>
                    </div>
                    <p class="text-sm text-gray-500">
                      {{ formatDate(activity.date) }}
                    </p>
                  </div>
                </div>
              </div>
            </li>
          </ul>
          <div class="bg-gray-50 px-6 py-3 flex justify-center">
            <router-link to="/team/bau/activities" class="text-sm font-medium text-red-600 hover:text-red-500 transition-colors duration-200">
              Lihat semua aktivitas
            </router-link>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal: Realization Details -->
    <DialogModal
      :show="showRealizationDetails"
      @close="showRealizationDetails = false"
      title="Detail Realisasi Aktivitas"
    >
      <div class="space-y-4">
        <p class="text-sm text-gray-500">
          Realisasi aktivitas dihitung berdasarkan persentase aktivitas yang berhasil diselesaikan (status "Selesai")
          dari seluruh aktivitas yang dijadwalkan.
        </p>
        
        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="font-medium text-gray-700 mb-2">Statistik Keseluruhan</h4>
          <ul class="space-y-2">
            <li class="flex justify-between">
              <span class="text-gray-600">Total Hari BAU:</span>
              <span class="font-medium">{{ realizationDetails.totalBauDays || 0 }}</span>
            </li>
            <li class="flex justify-between">
              <span class="text-gray-600">Total Aktivitas:</span>
              <span class="font-medium">{{ realizationDetails.totalActivities || 0 }}</span>
            </li>
            <li class="flex justify-between">
              <span class="text-gray-600">Aktivitas Selesai:</span>
              <span class="font-medium">{{ realizationDetails.completedActivities || 0 }}</span>
            </li>
            <li class="flex justify-between">
              <span class="text-gray-600">Tingkat Realisasi:</span>
              <span class="font-medium">{{ realizationDetails.realizationRate || 0 }}%</span>
            </li>
          </ul>
        </div>
        
        <div v-if="realizationDetails.topPerformers && realizationDetails.topPerformers.length">
          <h4 class="font-medium text-gray-700 mb-2">Kinerja Terbaik</h4>
          <ul class="divide-y divide-gray-200">
            <li v-for="performer in realizationDetails.topPerformers" :key="performer.creator_id" class="py-2">
              <div class="flex items-center justify-between">
                <div>
                  <p class="font-medium text-gray-800">{{ performer.creator_name }}</p>
                  <p class="text-sm text-gray-500">{{ performer.realization_rate }}% tingkat realisasi</p>
                </div>
                <div class="flex items-center space-x-1">
                  <div class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    {{ performer.completed_activities }} selesai
                  </div>
                  <div class="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                    dari {{ performer.total_activities }}
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </DialogModal>

    <!-- Modal: Activity Breakdown -->
    <DialogModal
      :show="showActivityBreakdown"
      @close="showActivityBreakdown = false"
      title="Analisa Aktivitas"
    >
      <div class="space-y-4">
        <div v-if="activitiesByType && Object.keys(activitiesByType).length" class="bg-white p-4 rounded-lg border border-gray-200">
          <h4 class="font-medium text-gray-700 mb-3">Aktivitas berdasarkan Jenis</h4>
          <ul class="space-y-2">
            <li v-for="(count, type) in activitiesByType" :key="type" class="flex justify-between">
              <span class="text-gray-600">{{ getTranslatedActivityType(type) }}:</span>
              <span class="font-medium">{{ count }} aktivitas</span>
            </li>
          </ul>
        </div>
        
        <div v-if="activitiesByStatus" class="bg-white p-4 rounded-lg border border-gray-200">
          <h4 class="font-medium text-gray-700 mb-3">Aktivitas berdasarkan Status</h4>
          <div class="grid grid-cols-3 gap-3">
            <div class="border border-green-200 bg-green-50 p-3 rounded-lg text-center">
              <p class="text-sm text-green-600 mb-1">Selesai</p>
              <p class="text-xl font-semibold text-green-700">{{ activitiesByStatus.done || 0 }}</p>
            </div>
            <div class="border border-red-200 bg-red-50 p-3 rounded-lg text-center">
              <p class="text-sm text-red-600 mb-1">Tidak Selesai</p>
              <p class="text-xl font-semibold text-red-700">{{ activitiesByStatus.not_done || 0 }}</p>
            </div>
            <div class="border border-yellow-200 bg-yellow-50 p-3 rounded-lg text-center">
              <p class="text-sm text-yellow-600 mb-1">Direncanakan</p>
              <p class="text-xl font-semibold text-yellow-700">{{ activitiesByStatus.planned || 0 }}</p>
            </div>
          </div>
        </div>
        
        <div v-if="activitiesByPerson && activitiesByPerson.length" class="bg-white p-4 rounded-lg border border-gray-200">
          <h4 class="font-medium text-gray-700 mb-3">Aktivitas berdasarkan Tim</h4>
          <ul class="space-y-2">
            <li v-for="person in activitiesByPerson" :key="person.id" class="flex justify-between">
              <span class="text-gray-600">{{ person.name }}:</span>
              <span class="font-medium">{{ person.activities }} aktivitas</span>
            </li>
          </ul>
        </div>
      </div>
    </DialogModal>

    <!-- Modal: BAU vs Project Analysis -->
    <DialogModal
      :show="showBauVsProjectAnalysis"
      @close="showBauVsProjectAnalysis = false"
      title="Analisis BAU vs Waktu Proyek"
    >
      <div class="space-y-4">
        <div class="bg-white p-4 rounded-lg border border-gray-200">
          <h4 class="font-medium text-gray-700 mb-3">Distribusi Waktu</h4>
          <ul class="space-y-2">
            <li class="flex justify-between">
              <span class="text-gray-600">Aktivitas BAU:</span>
              <span class="font-medium">{{ formatHours(bauHours) }} ({{ bauPercentage }}%)</span>
            </li>
            <li class="flex justify-between">
              <span class="text-gray-600">Kerja Proyek:</span>
              <span class="font-medium">{{ formatHours(projectHours) }} ({{ projectPercentage }}%)</span>
            </li>
            <li class="flex justify-between">
              <span class="text-gray-600">Total Waktu:</span>
              <span class="font-medium">{{ formatHours(bauHours + projectHours) }}</span>
            </li>
          </ul>
        </div>
        
        <p class="text-sm text-gray-500">
          Analisis ini menunjukkan distribusi waktu antara aktivitas BAU (Business As Usual) 
          dan pekerjaan khusus proyek selama periode waktu yang dipilih.
        </p>
      </div>
    </DialogModal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useToast } from '@/composables/useToast'
import apiClient from '@/config/api'
import { 
  ArrowPathIcon,
  CheckCircleIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CalendarIcon,
  ClockIcon,
  ScaleIcon,
  ClipboardIcon,
  CheckIcon,
  XMarkIcon 
} from '@heroicons/vue/24/outline'
import Toast from '@/components/Toast.vue'
import DialogModal from '@/components/modal/DialogModal.vue'

// State
const { toast, showToast } = useToast()
const loading = ref(false)
const selectedPeriod = ref('week')
const timePeriods = [
  { label: 'Minggu Ini', value: 'week' },
  { label: 'Bulan Ini', value: 'month' },
  { label: 'Kuartal Ini', value: 'quarter' },
  { label: 'Tahun Ini', value: 'year' },
]

// Dashboard data state
const dashboardData = ref({
  realizationRate: 0,
  realizationTrend: 0,
  totalActivities: 0,
  totalDays: 0,
  completedActivities: 0,
  notDoneActivities: 0,
  plannedActivities: 0,
  bauVsProjectRatio: '0:0'
})

// BAU vs Project time data
const bauHours = ref(0)
const projectHours = ref(0)

// Chart data
const activitiesByType = ref({})
const activitiesByStatus = ref({
  done: 0,
  not_done: 0,
  planned: 0
})
const activitiesByPerson = ref([])
const dailyData = ref([])

// Modal states
const showRealizationDetails = ref(false)
const showActivityBreakdown = ref(false)
const showBauVsProjectAnalysis = ref(false)

// Detailed data for modals
const realizationDetails = ref({
  totalBauDays: 0,
  totalActivities: 0,
  completedActivities: 0,
  realizationRate: 0,
  topPerformers: []
})

const recentActivities = ref([])

// Computed properties
const bauVsProjectRatioFormatted = computed(() => {
  if (bauHours.value === 0 && projectHours.value === 0) return '0:0'
  return `${bauPercentage.value}:${projectPercentage.value}`
})

const bauPercentage = computed(() => {
  const total = bauHours.value + projectHours.value
  if (total === 0) return 0
  return Math.round((bauHours.value / total) * 100)
})

const projectPercentage = computed(() => {
  const total = bauHours.value + projectHours.value
  if (total === 0) return 0
  return Math.round((projectHours.value / total) * 100)
})

// Methods
const fetchDashboardData = async () => {
  try {
    loading.value = true
    
    // Calculate date range based on selected period
    const now = new Date()
    let startDate = new Date()
    
    switch (selectedPeriod.value) {
      case 'week':
        startDate.setDate(now.getDate() - 7)
        break
      case 'month':
        startDate.setMonth(now.getMonth() - 1)
        break
      case 'quarter':
        startDate.setMonth(now.getMonth() - 3)
        break
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1)
        break
    }
    
    // Convert to YYYY-MM-DD format
    const dateFrom = formatDateYYYYMMDD(startDate)
    const dateTo = formatDateYYYYMMDD(now)
    
    // Call BAU report endpoint
    const response = await apiClient.post('/web/v2/team/bau/report', {
      jsonrpc: '2.0',
      id: new Date().getTime(),
      params: {
        date_from: dateFrom,
        date_to: dateTo
      }
    })

    if (response.data.result?.status === 'success') {
      const reportData = response.data.result.data
      showToast({
        message: 'Data BAU berhasil dimuat',
        type: 'success'
      })

      // Count activities by status
const allActivities = getAllActivities(reportData)
const completedActivities = allActivities.filter(a => a.state === 'done').length
const notDoneActivities = allActivities.filter(a => a.state === 'not_done').length
const plannedActivities = allActivities.filter(a => a.state === 'planned').length
const totalActivities = allActivities.length

// Calculate realization rate
const realizationRate = totalActivities > 0
  ? Math.round((completedActivities / totalActivities) * 100)
  : 0

// Update dashboard data
dashboardData.value = {
  realizationRate: realizationRate,
  realizationTrend: calculateRealizationTrend(reportData),
  totalActivities: totalActivities,
  totalDays: reportData.summary.total_bau_days || 0,
  completedActivities: completedActivities,
  notDoneActivities: notDoneActivities,
  plannedActivities: plannedActivities,
  bauVsProjectRatio: reportData.summary.bau_vs_project_ratio || calculateBauVsProjectRatio(reportData)
}

// Update realization details
realizationDetails.value = {
  totalBauDays: reportData.summary.total_bau_days || 0,
  totalActivities: totalActivities,
  completedActivities: completedActivities,
  realizationRate: realizationRate,
  topPerformers: getTopPerformers(reportData.creators, 3)
}

// Update activities breakdown
activitiesByType.value = calculateActivitiesByType(allActivities)
activitiesByStatus.value = {
  done: completedActivities,
  not_done: notDoneActivities,
  planned: plannedActivities
}
activitiesByPerson.value = calculateActivitiesByPerson(reportData.creators)

// Update BAU vs Project hours
updateBauVsProjectData(reportData)

// Update daily data for charts
dailyData.value = processDailyData(reportData.daily_data)

// Get recent activities
recentActivities.value = allActivities
  .sort((a, b) => new Date(b.date) - new Date(a.date))
  .slice(0, 5)
    }
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    showToast({
      message: error.message || 'Gagal memuat data dashboard',
      type: 'error',
      duration: 5000
    })
  } finally {
    loading.value = false
  }
}

// Get all activities from report data
const getAllActivities = (reportData) => {
  const allActivities = []
  
  // From daily data
  if (reportData.daily_data) {
    reportData.daily_data.forEach(day => {
      if (day.activities) {
        allActivities.push(...day.activities)
      }
    })
  }
  
  // From creators if not already collected
  if (allActivities.length === 0 && reportData.creators) {
    reportData.creators.forEach(creator => {
      if (creator.activities) {
        allActivities.push(...creator.activities)
      }
    })
  }
  
  return allActivities
}

// Format date for display
const formatDate = (dateString) => {
  if (!dateString) return '-'
  
  const date = new Date(dateString)
  
  // Indonesian month names
  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ]
  
  return `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`
}

// Format date in YYYY-MM-DD format
const formatDateYYYYMMDD = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// Format hours
const formatHours = (hours) => {
  return `${parseFloat(hours.toFixed(1))} jam`
}

// Calculate realization trend from data
const calculateRealizationTrend = (reportData) => {
  // If we have daily data, we can calculate a trend
  if (reportData.daily_data && reportData.daily_data.length >= 2) {
    // Sort data chronologically
    const sortedData = [...reportData.daily_data].sort((a, b) => new Date(a.date) - new Date(b.date))
    
    // Calculate the average of the first half and second half
    const halfLength = Math.floor(sortedData.length / 2)
    
    // First process the data to get completion rates for each day
    const processedData = sortedData.map(day => {
      const dayActivities = day.activities || []
      const total = dayActivities.length
      const completed = dayActivities.filter(a => a.state === 'done').length
      return {
        ...day,
        realizationRate: total > 0 ? (completed / total) * 100 : 0
      }
    })
    
    // Calculate average realization rate for each half
    const firstHalfDays = processedData.slice(0, halfLength)
    const secondHalfDays = processedData.slice(halfLength)
    
    const firstHalfRate = firstHalfDays.length > 0
      ? firstHalfDays.reduce((sum, day) => sum + day.realizationRate, 0) / firstHalfDays.length
      : 0
      
    const secondHalfRate = secondHalfDays.length > 0
      ? secondHalfDays.reduce((sum, day) => sum + day.realizationRate, 0) / secondHalfDays.length
      : 0
    
    // Calculate trend (difference between second half and first half rates)
    return Math.round(secondHalfRate - firstHalfRate)
  }
  return 0
}

// Calculate BAU vs Project ratio
const calculateBauVsProjectRatio = (reportData) => {
  // This could come from the backend or be calculated here
  // For now, let's use summary data
  const bauHoursValue = reportData.summary.total_hours || 0
  
  // Update reactive variables for the chart
  bauHours.value = bauHoursValue
  
  // We need project hours from elsewhere, for now estimate 
  // based on standard workday (8h/day) minus BAU hours
  const totalWorkDays = reportData.summary.total_bau_days || 0
  const totalWorkHours = totalWorkDays * 8 // Assuming 8-hour workday
  projectHours.value = Math.max(0, totalWorkHours - bauHoursValue)
  
  // Return formatted ratio for display
  return `${bauPercentage.value}:${projectPercentage.value}`
}

// Update BAU vs Project data
const updateBauVsProjectData = (reportData) => {
  // Update BAU hours
  bauHours.value = reportData.summary.total_hours || 0
  
  // For project hours, we either get from the API or estimate
  projectHours.value = reportData.summary.project_hours || (() => {
    // If not available, estimate based on standard work days
    const totalWorkDays = reportData.summary.total_bau_days || 0
    const totalWorkHours = totalWorkDays * 8 // Assuming 8-hour workday
    return Math.max(0, totalWorkHours - bauHours.value)
  })()
}

// Get top performers based on activity completion rate
const getTopPerformers = (creators, count = 3) => {
  if (!creators || !creators.length) return []
  
  // Process creators to calculate realization rates
  const processedCreators = creators.map(creator => {
    const activities = creator.activities || []
    const totalActivities = activities.length
    const completedActivities = activities.filter(a => a.state === 'done').length
    const realizationRate = totalActivities > 0
      ? Math.round((completedActivities / totalActivities) * 100)
      : 0
      
    return {
      ...creator,
      total_activities: totalActivities,
      completed_activities: completedActivities,
      realization_rate: realizationRate
    }
  })
  
  // Sort creators by realization rate and completed activities
  return processedCreators
    .sort((a, b) => {
      // Sort by realization_rate first, then by completed_activities
      if (b.realization_rate !== a.realization_rate) {
        return b.realization_rate - a.realization_rate
      }
      return b.completed_activities - a.completed_activities
    })
    .slice(0, count)
}

// Calculate activities by type
const calculateActivitiesByType = (activities) => {
  const countByType = {}
  
  activities.forEach(activity => {
    const type = activity.activity_type || 'other'
    countByType[type] = (countByType[type] || 0) + 1
  })
  
  return countByType
}

// Calculate activities by person
const calculateActivitiesByPerson = (creators) => {
  if (!creators || !creators.length) return []
  
  return creators.map(creator => ({
    id: creator.creator_id,
    name: creator.creator_name,
    activities: (creator.activities || []).length,
    completedActivities: (creator.activities || []).filter(a => a.state === 'done').length
  }))
}

// Process daily data
const processDailyData = (dailyData) => {
  if (!dailyData) return []
  
  return dailyData.map(day => {
    const activities = day.activities || []
    const totalActivities = activities.length
    const completedActivities = activities.filter(a => a.state === 'done').length
    const realizationRate = totalActivities > 0
      ? Math.round((completedActivities / totalActivities) * 100)
      : 0
      
    return {
      ...day,
      realizationRate,
      totalActivities,
      completedActivities
    }
  })
}

// Get color class based on activity type
const getActivityTypeColorClass = (type) => {
  if (!type) return 'bg-gray-100 text-gray-800'
  
  const colorMap = {
    'meeting': 'bg-blue-100 text-blue-800',
    'training': 'bg-green-100 text-green-800',
    'support': 'bg-pink-100 text-pink-800',
    'admin': 'bg-indigo-100 text-indigo-800',
    'other': 'bg-gray-100 text-gray-800'
  }
  
  return colorMap[type.toLowerCase()] || 'bg-gray-100 text-gray-800'
}

// Get color class based on activity status
const getActivityStatusClass = (state) => {
  switch(state) {
    case 'done':
      return 'bg-green-100 text-green-800'
    case 'not_done':
      return 'bg-red-100 text-red-800'
    default: // planned
      return 'bg-yellow-100 text-yellow-800'
  }
}

// Get translated activity type
const getTranslatedActivityType = (type) => {
  if (!type) return 'Lainnya';
  
  const translations = {
    'meeting': 'Rapat',
    'training': 'Pelatihan',
    'support': 'Support',
    'admin': 'Administrasi',
    'other': 'Lainnya'
  };
  
  return translations[type.toLowerCase()] || type;
}

// Watch for changes in selected period
watch(selectedPeriod, () => {
  fetchDashboardData()
})

onMounted(() => {
  fetchDashboardData()
})
</script>