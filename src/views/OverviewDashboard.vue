<!-- // src/views/OverviewDashboard.vue -->
<template>
  <div class="min-h-screen bg-gray-50">
    <Toast
      v-model:show="toast.show"
      :message="toast.message"
      :type="toast.type"
      :duration="toast.duration"
    />
    <!-- Header with Filters -->
    <div class="bg-white shadow">
      <div class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <!-- Main Header Container -->
        <div class="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
          <!-- Title -->
          <h1 class="text-xl sm:text-2xl font-semibold text-gray-900">Overview Dashboard</h1>
          
          <!-- Controls Container -->
          <div class="flex flex-col space-y-3 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-2 md:space-x-4">
            <!-- Date Range Select -->
            <select
              v-model="selectedRange"
              @change="handleDateRangeChange"
              class="w-full sm:w-auto rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="this_week">This Week</option>
              <option value="this_month">This Month</option>
              <option value="this_year">This Year</option>
              <option value="custom">Custom Range</option>
            </select>
  
            <!-- Date Range Picker -->
            <DateRangePicker
              v-if="showDatePicker"
              v-model="dateRange"
              @update:modelValue="handleCustomDateChange"
              @close="showDatePicker = false"
              class="w-full sm:w-auto"
            />
  
            <!-- Date Display Badge -->
            <div class="bg-gray-100 px-3 py-2 rounded-md flex items-center justify-between sm:justify-start space-x-2 min-w-0">
              <CalendarDaysIcon class="h-4 w-4 text-gray-500 flex-shrink-0" />
              <span class="text-sm text-gray-600 truncate">
                {{ getFormattedDateRange }}
              </span>
            </div>
  
            <!-- Refresh Button -->
            <button
              @click="refreshData"
              class="w-full sm:w-auto inline-flex items-center justify-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              <ArrowPathIcon 
                class="h-4 w-4 mr-1.5" 
                :class="{ 'animate-spin': loading }" 
                aria-hidden="true"
              />
              <span>Refresh</span>
            </button>
            <!-- Reset Button -->
            <button
              @click="resetFilters"
              class="w-full sm:w-auto inline-flex justify-center items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <BackspaceIcon class="h-4 w-4 mr-1.5" />
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <main class="w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="space-y-6">
        <!-- Key Metrics -->
        <KeyMetrics 
          :data="dashboardData.metrics" 
          :loading="loading" 
        />

        <!-- Revenue & Orders Chart -->
        <div class="bg-white rounded-lg shadow-sm p-4">
          <RevenueTrendChart 
            :data="dashboardData.trends" 
            :loading="loading" 
          />
        </div>

        <!-- Three Column Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Top Products -->
          <div class="bg-white rounded-lg shadow-sm p-4">
            <TopProducts :data="dashboardData" :loading="loading" />
          </div>

          <!-- Top Sales -->
          <div class="bg-white rounded-lg shadow-sm p-4">
            <TopSales 
              :data="dashboardData.top_data.sales" 
              :loading="loading" 
            />
          </div>

          <!-- Top Quotations -->
          <div class="bg-white rounded-lg shadow-sm p-4">
            <TopQuotations 
              :data="dashboardData.top_data.quotations" 
              :loading="loading" 
            />
          </div>
        </div>

        <!-- Two Column Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Customer Stats -->
          <div class="bg-white rounded-lg shadow-sm p-4">
            <TopCustomers 
              :data="dashboardData.top_data.customers" 
              :loading="loading" 
            />
          </div>

          <!-- Team Performance -->
          <div class="bg-white rounded-lg shadow-sm p-4">
            <TeamPerformance 
              :advisors="dashboardData.top_data.advisors"
              :mechanics="dashboardData.top_data.mechanics"
              :loading="loading" 
            />
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { debounce } from 'lodash'
import { CalendarDaysIcon, 
  ArrowPathIcon,  
  FunnelIcon,  // Tambahkan ini
  BackspaceIcon } from '@heroicons/vue/24/outline' // Tambahkan ini
import { format, startOfToday, sub, startOfWeek, startOfMonth, startOfYear } from 'date-fns'
import apiClient from '@/config/api'

// Components
import DateRangePicker from '@/components/DateRangePicker.vue'
import KeyMetrics from '@/components/overview/KeyMetrics.vue'
import RevenueTrendChart from '@/components/overview/RevenueTrendChart.vue'
import TopProducts from '@/components/overview/TopProducts.vue'
import TopSales from '@/components/overview/TopSales.vue'
import TopQuotations from '@/components/overview/TopQuotations.vue'
import TopCustomers from '@/components/overview/TopCustomers.vue'
import TeamPerformance from '@/components/overview/TeamPerformance.vue'

import Toast from '@/components/Toast.vue' // Import Toast component
import { useToast } from '@/composables/useToast' // Import toast composable

const { toast, showToast } = useToast() // Use the toast composable

// State
const loading = ref(false)
const selectedRange = ref('this_month')
const showDatePicker = ref(false)
const dateRange = ref({ start: null, end: null })
const dashboardData = ref({
  metrics: {
    quotations: { current: 0, previous: 0, growth: 0 },
    orders: { current: 0, previous: 0, growth: 0 },
    revenue: { current: 0, previous: 0, growth: 0 },
    average_order: { current: 0, previous: 0, growth: 0 }
  },
  trends: [],
  top_data: {
    products: {
      services: [],
      physical: []
    },
    quotations: [],
    sales: [],
    customers: [],
    categories: [],
    advisors: [],
    mechanics: []
  }
})

// Computed
// const formattedDateRange = computed(() => {
//   if (selectedRange.value !== 'custom') return ''
//   return `${format(new Date(dateRange.value.start), 'dd MMM yyyy')} - 
//           ${format(new Date(dateRange.value.end), 'dd MMM yyyy')}`
// })

// Computed properties
const formattedDateRange = computed(() => {
  const { start, end } = dashboardData.value.date_range
  if (!start || !end) return ''
  return `${format(new Date(start), 'dd MMM yyyy')} - ${format(new Date(end), 'dd MMM yyyy')}`
})

const getFormattedDateRange = computed(() => {
  if (!dashboardData.value.date_range) return ''
  
  const { type, start, end } = dashboardData.value.date_range
  
  // For predefined ranges, show more user-friendly text
  switch (type) {
    case 'today':
      return `Today, ${format(new Date(start), 'dd MMM yyyy')}`
    case 'yesterday':
      return `Yesterday, ${format(sub(new Date(start), { days: 1 }), 'dd MMM yyyy')}`
    case 'this_week':
      return `This Week, ${format(new Date(start), 'dd MMM')} - ${format(new Date(end), 'dd MMM yyyy')}`
    case 'this_month':
      return `This Month, ${format(new Date(start), 'MMMM yyyy')}`
    case 'this_year':
      return `Year ${format(new Date(start), 'yyyy')}`
    case 'custom':
      return `${format(new Date(start), 'dd MMM yyyy')} - ${format(new Date(end), 'dd MMM yyyy')}`
    default:
      return `${format(new Date(start), 'dd MMM yyyy')} - ${format(new Date(end), 'dd MMM yyyy')}`
  }
})


// Methods
const fetchDashboardData = debounce(async () => {
  try {
    loading.value = true
    const params = {
      jsonrpc: '2.0',
      method: 'call',
      params: {
        date_range: selectedRange.value
      }
    }

    if (selectedRange.value === 'custom') {
      params.params.start_date = dateRange.value.start
      params.params.end_date = dateRange.value.end
    }

    const response = await apiClient.post('/web/v2/statistics/overview', params)
    if (response.data.result?.data) {
      dashboardData.value = response.data.result.data
      showToast({
        message: `Data berhasil dimuat untuk ${
          selectedRange.value === 'custom' 
            ? 'rentang tanggal yang dipilih' 
            : getDateRangeText(selectedRange.value)
        }`,
        type: 'success'
      })
    }
  } catch (error) {
    console.error('Error fetching overview data:', error)
    showToast({
      message: error.message || 'Gagal memuat data dashboard',
      type: 'error',
      duration: 5000
    })
  } finally {
    loading.value = false
  }
}, 500)

const getDateRangeText = (range) => {
  const rangeTexts = {
    'today': 'hari ini',
    'yesterday': 'kemarin',
    'this_week': 'minggu ini',
    'this_month': 'bulan ini',
    'this_year': 'tahun ini'
  }
  return rangeTexts[range] || range
}

const handleDateRangeChange = () => {
  if (selectedRange.value === 'custom') {
    showDatePicker.value = true
  } else {
    showDatePicker.value = false
    fetchDashboardData()
  }
}

const handleCustomDateChange = () => {
  if (dateRange.value.start && dateRange.value.end) {
    showDatePicker.value = false
    fetchDashboardData()
  }
}

const resetFilters = () => {
  selectedRange.value = 'this_month'
  dateRange.value = { start: null, end: null }
  showDatePicker.value = false
  fetchDashboardData()
  showToast({
    message: 'Filter telah direset ke default',
    type: 'info'
  })
}

const refreshData = () => {
  fetchDashboardData()
}

onMounted(() => {
  fetchDashboardData()
})
</script>