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
      <div class="w-full max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
          <!-- Title -->
          <h1 class="text-lg sm:text-2xl font-semibold text-gray-900">
            Customer Support KPI Dashboard
          </h1>
          
          <!-- Controls -->
          <div class="flex flex-wrap gap-3 items-center">
            <select
              v-model="filters.position"
              @change="handlePositionChange"
              class="rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Positions</option>
              <option v-for="pos in positions" :key="pos.id" :value="pos.id">
                {{ pos.name }}
              </option>
            </select>

            <select
              v-model="filters.employee_id"
              @change="loadKPIData"
              class="rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Employee</option>
              <option v-for="emp in filteredEmployees" :key="emp.id" :value="emp.id">
                {{ emp.name }} - {{ emp.job_title }}
              </option>
            </select>

            <div class="flex gap-2">
              <select
                v-model="filters.month"
                @change="loadKPIData"
                class="rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option v-for="(month, index) in months" :key="index" :value="index + 1">
                  {{ month }}
                </option>
              </select>

              <select
                v-model="filters.year"
                @change="loadKPIData"
                class="rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
              </select>
            </div>

            <div class="flex gap-2">
              <button
                @click="loadKPIData"
                class="inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <ArrowPathIcon 
                  class="h-4 w-4 mr-1.5" 
                  :class="{ 'animate-spin': loading }" 
                /> Refresh
              </button>

              <button
                @click="resetFilters"
                class="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <BackspaceIcon class="h-4 w-4 mr-1.5" /> Reset
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <main class="container max-w-full px-4 py-8">
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center h-64">
        <div class="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>

      <template v-else-if="kpiData">
        <!-- Overview Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <!-- Employee Info -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <div class="space-y-4">
              <div>
                <h3 class="text-lg font-medium text-gray-900 mb-4">Employee Information</h3>
                <div class="space-y-3">
                  <div>
                    <label class="text-sm text-gray-500">Name</label>
                    <p class="font-medium">{{ kpiData.employee.name }}</p>
                  </div>
                  <div>
                    <label class="text-sm text-gray-500">Position</label>
                    <p class="font-medium">{{ kpiData.employee.position }}</p>
                  </div>
                  <div>
                    <label class="text-sm text-gray-500">Department</label>
                    <p class="font-medium">{{ kpiData.employee.department }}</p>
                  </div>
                </div>
              </div>
              <div class="flex items-center text-sm text-gray-500">
                <CalendarIcon class="h-4 w-4 mr-2" />
                Period: {{ months[kpiData.period.month - 1] }} {{ kpiData.period.year }}
              </div>
            </div>
          </div>

          <!-- Overall Score -->
          <div class="bg-white rounded-lg shadow-sm p-6 md:col-span-2">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Performance Overview</h3>
            <div class="flex items-center gap-6">
              <div class="relative">
                <svg class="w-32 h-32 transform -rotate-90">
                  <circle
                    class="text-gray-200"
                    stroke-width="12"
                    stroke="currentColor"
                    fill="transparent"
                    r="56"
                    cx="64"
                    cy="64"
                  />
                  <circle
                    :class="getScoreColor(kpiData?.summary?.total_score)"
                    stroke-width="12"
                    :stroke-dasharray="2 * Math.PI * 56"
                    :stroke-dashoffset="2 * Math.PI * 56 * (1 - kpiData?.summary?.total_score / 100)"
                    stroke-linecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="56"
                    cx="64"
                    cy="64"
                  />
                </svg>
                <div class="absolute inset-0 flex items-center justify-center">
                  <span class="text-2xl font-bold">{{ formatNumber(kpiData?.summary?.total_score) }}%</span>
                </div>
              </div>

              <div class="flex-1 space-y-4">
                <div class="space-y-2">
                  <div class="flex items-center gap-2">
                    <CheckCircleIcon class="h-5 w-5 text-green-500" />
                    <span class="font-medium">Strong Areas</span>
                  </div>
                  <div class="space-y-1 ml-7">
                    <div 
                      v-for="kpi in getStrongAreas(kpiData.kpi_scores)"
                      :key="kpi.type"
                      class="text-sm text-gray-600"
                    >
                      {{ kpi.name }}: {{ formatNumber(kpi.achievement) }}%
                    </div>
                  </div>
                </div>

                <div class="space-y-2">
                  <div class="flex items-center gap-2">
                    <ExclamationCircleIcon class="h-5 w-5 text-red-500" />
                    <span class="font-medium">Areas for Improvement</span>
                  </div>
                  <div class="space-y-1 ml-7">
                    <div 
                      v-for="kpi in getLowAreas(kpiData.kpi_scores)"
                      :key="kpi.type"
                      class="text-sm text-gray-600"
                    >
                      {{ kpi.name }}: {{ formatNumber(kpi.achievement) }}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- KPI Table -->
        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-medium text-gray-900">KPI Metrics</h3>
          </div>
          
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Metric
                  </th>
                  <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Weight (%)
                  </th>
                  <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Target
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Measurement
                  </th>
                  <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actual
                  </th>
                  <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Achievement
                  </th>
                  <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="kpi in kpiData.kpi_scores" :key="kpi.type">
                  <td class="px-6 py-4">
                    <div class="space-y-1">
                      <div class="font-medium text-gray-900">{{ kpi.name }}</div>
                      <div class="text-sm text-gray-500">{{ kpi.description }}</div>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <div v-if="editingKPI && editingKPI.type === kpi.type" class="flex justify-center">
                      <input
                        type="number"
                        v-model="editingKPI.weight"
                        class="w-20 text-center rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        min="0"
                        max="100"
                      />
                    </div>
                    <div v-else class="text-center">{{ kpi.weight }}%</div>
                  </td>
                  <td class="px-6 py-4">
                    <div v-if="editingKPI && editingKPI.type === kpi.type" class="flex justify-center">
                      <input
                        type="number"
                        v-model="editingKPI.target"
                        class="w-20 text-center rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        min="0"
                      />
                    </div>
                    <div v-else class="text-center">{{ kpi.target }}</div>
                  </td>
                  <!-- Measurement column with edit mode -->
                  <td class="px-6 py-4">
                    <div v-if="editingKPI && editingKPI.type === kpi.type && isFieldEditable(kpi, 'measurement')" class="flex justify-center">
                      <input
                        type="text"
                        v-model="editingKPI.measurement"
                        class="w-full text-sm rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <!-- <div v-else class="text-sm text-gray-600">{{ kpi.measurement }}</div> -->
                    <div v-else class="text-sm text-gray-600" v-html="kpi.measurement"></div>
                  </td>
                  <td class="px-6 py-4">
                    <div v-if="editingKPI && editingKPI.type === kpi.type" class="flex justify-center">
                      <input
                        type="number"
                        v-model="editingKPI.actual"
                        class="w-20 text-center rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        min="0"
                      />
                    </div>
                    <div v-else class="text-center">{{ formatNumber(kpi.actual) }}</div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex flex-col items-center gap-1">
                      <span 
                        class="text-sm font-medium" 
                        :class="getAchievementTextColor(getRelativeAchievement(kpi))"
                      >
                        {{ formatNumber(kpi.achievement) }}%
                      </span>
                      <div class="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          class="h-full rounded-full transition-all duration-500"
                          :class="getAchievementColorClass(getRelativeAchievement(kpi))"
                          :style="{ width: `${Math.min(getRelativeAchievement(kpi), 100)}%` }"
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex justify-center space-x-2">
                      <template v-if="editingKPI && editingKPI.type === kpi.type">
                        <button
                          @click="saveKPIChanges"
                          class="p-1 text-green-600 hover:text-green-900"
                        >
                          <CheckIcon class="h-5 w-5" />
                        </button>
                        <button
                          @click="cancelEdit"
                          class="p-1 text-red-600 hover:text-red-900"
                        >
                          <XMarkIcon class="h-5 w-5" />
                        </button>
                      </template>
                      <template v-else>
                        <button
                          v-if="isFieldEditable(kpi, 'weight')"
                          @click="startEdit(kpi)"
                          class="p-1 text-blue-600 hover:text-blue-900"
                        >
                          <PencilIcon class="h-5 w-5" />
                        </button>
                    </template>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>

    <!-- No Data State -->
    <template v-else>
      <div class="bg-white rounded-lg shadow-sm p-12 text-center">
        <ExclamationCircleIcon class="mx-auto h-12 w-12 text-gray-400" />
        <h3 class="mt-4 text-lg font-medium text-gray-900">No KPI Data Available</h3>
        <p class="mt-2 text-sm text-gray-500">Please select an employee to view their KPI details.</p>
      </div>
    </template>
  </main>
</div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
opacity: 0;
}
</style>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { debounce } from 'lodash'
import {
  ArrowPathIcon,
  BackspaceIcon,
  CheckIcon,
  XMarkIcon,
  PencilIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,  // Ditambahkan
  CalendarIcon      // Ditambahkan
} from '@heroicons/vue/24/outline'
import Toast from '@/components/Toast.vue'
import { useToast } from '@/composables/useToast'
import apiClient from '@/config/api'

// KPI Types for Customer Support positions
const CS_KPI_TYPES = {
  CUSTOMER_SERVICE: {
    ONLINE_RESPONSE: {
      type: 'online_response',
      editable: ['weight', 'target', 'measurement']
    },
    LEADS_REPORT: {
      type: 'leads_report',
      editable: ['weight', 'target', 'measurement']  
    },
    CUSTOMER_CONTACT: {
      type: 'customer_contact',
      editable: ['weight', 'target', 'actual', 'measurement']
    },
    SERVICE_REMINDER: {
      type: 'service_reminder',
      editable: ['weight', 'target', 'actual', 'measurement']
    },
    DOCUMENTATION: {
      type: 'documentation',
      editable: ['weight', 'target', 'actual', 'measurement']
    },
    OPERATIONAL: {
      type: 'operational',
      editable: ['weight', 'target', 'actual', 'measurement']
    },
    DISCIPLINE: {
      type: 'discipline',
      editable: ['weight', 'target', 'measurement']
    }
  },
  SERVICE_ADVISOR: {
    CUSTOMER_SERVICE: {
      type: 'customer_service',
      editable: ['weight', 'target']
    },
    SERVICE_ANALYSIS: {
      type: 'service_analysis', 
      editable: ['weight', 'target']
    },
    SERVICE_EFFICIENCY: {
      type: 'service_efficiency',
      editable: ['weight', 'target']  
    },
    SA_REVENUE: {
      type: 'sa_revenue',
      editable: ['weight', 'target']
    },
    SOP_COMPLIANCE: {
      type: 'sop_compliance',
      editable: ['weight', 'target']
    },
    DISCIPLINE: {
      type: 'discipline',
      editable: ['weight', 'target']
    }
  },
  LEAD: {
    TEAM_CONTROL: {
      type: 'team_control',  
      editable: ['weight', 'target']
    },
    COMPLAINT_HANDLING: {
      type: 'complaint_handling',
      editable: ['weight', 'target']
    },
    REVENUE_TARGET: {
      type: 'revenue_target',
      editable: ['weight', 'target']
    },
    TEAM_DEVELOPMENT: {
      type: 'team_development',
      editable: ['weight', 'target']
    },
    OPERATIONAL: {
      type: 'operational',
      editable: ['weight', 'target']
    }
  }
}

const isFieldEditable = (kpi, field) => {
  // Tentukan posisi user dari job title
  let position = ''
  if (kpiData.value.employee.position.includes('Lead')) {
    position = 'LEAD'
  } else if (kpiData.value.employee.position.includes('Service Advisor')) {
    position = 'SERVICE_ADVISOR'
  } else if (kpiData.value.employee.position.includes('Customer Service')) {
    position = 'CUSTOMER_SERVICE'
  }

  // Cari KPI type yang sesuai
  const kpiTypeMap = CS_KPI_TYPES[position]
  if (!kpiTypeMap) return false

  // Cari definisi KPI berdasarkan type
  const kpiDef = Object.values(kpiTypeMap).find(k => k.type === kpi.type)
  if (!kpiDef) return false

  // Cek apakah field bisa diedit
  return kpiDef.editable.includes(field)
}

// Constants
const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]
const years = [2023, 2024, 2025]
const positions = [
  { id: 'lead', name: 'Lead Customer Support', match: 'Lead Customer Support' },
  { id: 'sa', name: 'Service Advisor', match: 'Service Advisor' },
  { id: 'cs', name: 'Customer Service', match: 'Customer Service' },
  { id: 'valet', name: 'Valet Parking', match: 'Valet Parking' },
  { id: 'admin_part', name: 'Admin Part', match: 'Admin Part' },
  { id: 'partman', name: 'Partman', match: 'Partman' },
]

// State
const { toast, showToast } = useToast()
const loading = ref(false)
const employees = ref([])
const kpiData = ref(null)
const editingKPI = ref(null)

const filters = ref({
  position: '',
  employee_id: '',
  month: new Date().getMonth() + 1,
  year: new Date().getFullYear()
})

// Computed Properties
const filteredEmployees = computed(() => {
  if (!filters.value.position) return employees.value
  
  const selectedPosition = positions.find(p => p.id === filters.value.position)
  if (!selectedPosition) return employees.value
  
  return employees.value.filter(emp => 
    emp.job_title.includes(selectedPosition.match)
  )
})

const calculateCircumference = computed(() => {
  return 2 * Math.PI * 58
})

const calculateStrokeDashoffset = computed(() => {
  if (!kpiData.value) return calculateCircumference.value
  const percentage = kpiData.value.total_score
  return calculateCircumference.value - (calculateCircumference.value * percentage) / 100
})

// Methods
const formatNumber = (value) => {
  if (typeof value !== 'number') return '0'
  return value.toFixed(1)
}

const getRelativeAchievement = (kpi) => {
  if (!kpi.weight) return 0
  return (kpi.achievement / kpi.weight) * 100
}

const getAchievementTextColor = (relativeValue) => {
  if (relativeValue >= 100) return 'text-green-600'
  if (relativeValue >= 75) return 'text-yellow-600'
  return 'text-red-600'
}

const getAchievementColorClass = (relativeValue) => {
  if (relativeValue >= 100) return 'bg-green-500'
  if (relativeValue >= 75) return 'bg-yellow-500'
  return 'bg-red-500'
}

// getStrongAreas
const getStrongAreas = (kpiScores) => {
  return kpiScores
    .filter(kpi => {
      const relativeAchievement = getRelativeAchievement(kpi)
      return relativeAchievement >= 100 && kpi.weight > 0  // Hanya KPI dengan bobot > 0
    })
    .sort((a, b) => getRelativeAchievement(b) - getRelativeAchievement(a))
    .slice(0, 2)
}

// getLowAreas
const getLowAreas = (kpiScores) => {
  return kpiScores
    .filter(kpi => {
      const relativeAchievement = getRelativeAchievement(kpi)
      return relativeAchievement < 75 && kpi.weight > 0  // Hanya KPI dengan bobot > 0
    })
    .sort((a, b) => getRelativeAchievement(a) - getRelativeAchievement(b))
    .slice(0, 2)
}

const getScoreColor = (value) => {
  if (value >= 90) return 'text-green-500'
  if (value >= 75) return 'text-yellow-500'
  return 'text-red-500'
}

const loadEmployees = async () => {
  try {
    loading.value = true
    const response = await apiClient.post('/web/v2/hr/employees', {
      jsonrpc: '2.0',
      method: 'call',
      params: {
        department: 'Customer Support'
      }
    })

    if (response.data.result.status === 'success') {
      employees.value = response.data.result.data.filter(emp => 
        ['Lead Customer Support', 'Service Advisor', 'Customer Service', 'Valet Parking', 'Admin Part', 'Partman'].includes(emp.job_title)
      )
    }
  } catch (error) {
    console.error('Error loading employees:', error)
    showToast({
      message: 'Failed to load employees',
      type: 'error'
    })
  } finally {
    loading.value = false
  }
}

const loadKPIData = debounce(async () => {
  if (!filters.value.employee_id) return

  try {
    loading.value = true
    const response = await apiClient.post('/web/v2/kpi/customer-support', {
      jsonrpc: '2.0',
      method: 'call',
      params: {
        employee_id: parseInt(filters.value.employee_id),
        month: filters.value.month,
        year: filters.value.year
      }
    })

    if (response.data.result.status === 'success') {
      kpiData.value = response.data.result.data
      showToast({
        message: 'KPI data loaded successfully',
        type: 'success',
        duration: 3000
      })
    }
  } catch (error) {
    console.error('Error loading KPI data:', error)
    showToast({
      message: error.response?.data?.error || 'Failed to load KPI data',
      type: 'error',
      duration: 5000
    })
  } finally {
    loading.value = false
  }
}, 500)

const handlePositionChange = () => {
  filters.value.employee_id = ''
  kpiData.value = null
}

const resetFilters = () => {
  filters.value = {
    position: '',
    employee_id: '',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear()
  }
  kpiData.value = null
  editingKPI.value = null
  showToast({
    message: 'Filters have been reset',
    type: 'info',
    duration: 3000
  })
}

const startEdit = (kpi) => {
  const editableFields = ['weight', 'target', 'actual', 'measurement'].filter(field => 
    isFieldEditable(kpi, field)
  )
  
  editingKPI.value = {
    type: kpi.type,
    ...Object.fromEntries(
      editableFields.map(field => [field, kpi[field]])
    )
  }
}


const cancelEdit = () => {
  editingKPI.value = null
}

const saveKPIChanges = async () => {
  if (!editingKPI.value) return

  try {
    loading.value = true
    const updates = []

    // Get editable fields for current KPI
    const editableFields = ['weight', 'target', 'actual', 'measurement'].filter(field => 
      isFieldEditable(kpiData.value.kpi_scores.find(k => k.type === editingKPI.value.type), field)
    )

    // Create update promises only for editable fields
    for (const field of editableFields) {
      if (editingKPI.value[field] !== undefined) {
        updates.push(
          apiClient.post('/web/v2/kpi/update', {
            jsonrpc: '2.0',
            method: 'call',
            params: {
              employee_id: parseInt(filters.value.employee_id),
              period_month: filters.value.month,
              period_year: filters.value.year,
              kpi_type: editingKPI.value.type,
              field_name: field,
              value: editingKPI.value[field]
            }
          })
        )
      }
    }

    await Promise.all(updates)
    await loadKPIData()
    
    showToast({
      message: 'KPI updated successfully',
      type: 'success',
      duration: 3000
    })
    
    editingKPI.value = null
  } catch (error) {
    console.error('Error updating KPI:', error)
    showToast({
      message: error.response?.data?.error || 'Failed to update KPI',
      type: 'error',
      duration: 5000
    })
  } finally {
    loading.value = false
  }
}


// Lifecycle hooks
onMounted(async () => {
  await loadEmployees()
})
</script>