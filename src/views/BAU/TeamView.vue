<!-- src/views/dashboard/BAUTeamView.vue -->
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
              Ringkasan Tim BAU
            </h1>
          </div>
          <div class="mt-4 flex md:mt-0 md:ml-4">
            <!-- Date Range Picker -->
            <div class="flex items-center space-x-3">
              <div class="flex space-x-2">
                <input 
                  type="date" 
                  v-model="filters.date_from"
                  class="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Dari Tanggal"
                >
                <input 
                  type="date" 
                  v-model="filters.date_to"
                  class="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Sampai Tanggal"
                >
              </div>
              <button
                @click="fetchTeamData"
                class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-rose-600 to-rose-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                :disabled="loading"
              >
                <span v-if="loading" class="animate-spin mr-2">⟳</span>
                {{ loading ? 'Memuat...' : 'Terapkan' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <main class="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading Indicator -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <svg class="animate-spin h-8 w-8 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>

      <div v-else>
        <!-- Team Performance Cards -->
        <div class="mb-8">
          <h2 class="text-lg font-medium text-gray-900 mb-4">Kinerja Tim</h2>
          <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <!-- Overall Realization Rate -->
            <div class="bg-white rounded-lg shadow p-6">
              <h3 class="text-sm font-medium text-gray-500">Tingkat Realisasi Aktivitas BAU</h3>
              <div class="mt-2 flex items-baseline">
                <p class="text-3xl font-semibold text-gray-900">
                  {{ teamPerformance.realizationRate }}%
                </p>
              </div>
              <div class="mt-4">
                <div class="relative pt-1">
                  <div class="overflow-hidden h-2 text-xs flex rounded bg-red-200">
                    <div 
                      :style="`width: ${teamPerformance.realizationRate}%`" 
                      class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-600"
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Top Performer -->
            <div class="bg-white rounded-lg shadow p-6">
              <h3 class="text-sm font-medium text-gray-500">Kinerja Terbaik</h3>
              <div class="mt-2">
                <p class="text-xl font-semibold text-gray-900">
                  {{ teamPerformance.topPerformer.name }}
                </p>
                <p class="text-sm text-gray-500">
                  {{ teamPerformance.topPerformer.realization }}% Tingkat Realisasi
                </p>
              </div>
              <div class="mt-4">
                <div class="flex items-center">
                  <TrophyIcon class="h-5 w-5 text-yellow-400 mr-1.5" />
                  <span class="text-sm text-gray-600">
                    {{ teamPerformance.topPerformer.days }} hari BAU, {{ teamPerformance.topPerformer.activities }} aktivitas
                  </span>
                </div>
              </div>
            </div>

            <!-- Team Stats -->
            <div class="bg-white rounded-lg shadow p-6">
              <h3 class="text-sm font-medium text-gray-500">Statistik Tim</h3>
              <div class="mt-2 space-y-2">
                <div class="flex justify-between">
                  <p class="text-sm text-gray-500">Total Hari BAU:</p>
                  <p class="text-sm font-medium text-gray-900">{{ teamPerformance.stats.totalDays }}</p>
                </div>
                <div class="flex justify-between">
                  <p class="text-sm text-gray-500">Total Aktivitas:</p>
                  <p class="text-sm font-medium text-gray-900">{{ teamPerformance.stats.totalActivities }}</p>
                </div>
                <div class="flex justify-between">
                  <p class="text-sm text-gray-500">Aktivitas Selesai:</p>
                  <p class="text-sm font-medium text-gray-900">{{ teamPerformance.stats.completedActivities }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Team Members Table -->
        <div class="bg-white shadow overflow-hidden sm:rounded-lg">
          <div class="px-4 py-5 sm:px-6 flex justify-between items-center">
            <h2 class="text-lg font-medium text-gray-900">Anggota Tim</h2>
            <button
              @click="exportTeamData"
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-rose-600 to-rose-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <DocumentArrowDownIcon class="h-4 w-4 mr-1.5" />
              Ekspor
            </button>
          </div>
          <div v-if="teamMembers.length === 0" class="p-8 text-center text-gray-500">
            Tidak ada data tim tersedia untuk periode yang dipilih
          </div>
          <div v-else class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nama
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hari BAU
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Aktivitas
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tingkat Realisasi
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aktivitas Umum
                  </th>
                  <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="member in teamMembers" :key="member.id">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">
                          {{ member.name }}
                        </div>
                        <div class="text-sm text-gray-500">
                          {{ member.position }}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ member.bauDays }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ member.totalActivities }} ({{ member.completedActivities }} selesai)</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="text-sm text-gray-900 mr-2">{{ member.realizationRate }}%</div>
                      <div class="relative w-16 h-1.5 bg-gray-200 rounded-full">
                        <div 
                          :style="`width: ${member.realizationRate}%`" 
                          class="absolute h-1.5 bg-red-600 rounded-full"
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span 
                      class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                      :class="getActivityTypeColorClass(member.commonActivity)"
                    >
                      {{ getTranslatedActivityType(member.commonActivity) }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button @click="viewMemberDetails(member.id)" class="text-red-600 hover:text-red-900">
                      Lihat Detail
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>

    <!-- Member Details Modal -->
    <TransitionRoot appear :show="showMemberModal" as="template">
      <Dialog as="div" @close="closeMemberModal" class="relative z-10">
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black bg-opacity-25" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel class="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
                  Aktivitas BAU - {{ selectedMember.name }}
                </DialogTitle>

                <div v-if="memberDetailsLoading" class="flex justify-center py-8">
                  <svg class="animate-spin h-8 w-8 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>

                <div v-else class="mt-4 space-y-6">
                  <!-- Member Stats -->
                  <div class="grid grid-cols-3 gap-4">
                    <div class="bg-gray-50 p-4 rounded-lg text-center">
                      <p class="text-sm text-gray-500">Hari BAU</p>
                      <p class="text-xl font-semibold text-gray-900">{{ selectedMember.bauDays }}</p>
                    </div>
                    <div class="bg-gray-50 p-4 rounded-lg text-center">
                      <p class="text-sm text-gray-500">Total Aktivitas</p>
                      <p class="text-xl font-semibold text-gray-900">{{ selectedMember.totalActivities }}</p>
                    </div>
                    <div class="bg-gray-50 p-4 rounded-lg text-center">
                      <p class="text-sm text-gray-500">Realisasi</p>
                      <p class="text-xl font-semibold text-gray-900">{{ selectedMember.realizationRate }}%</p>
                    </div>
                  </div>

                  <!-- Status Summary -->
                  <div class="grid grid-cols-3 gap-4">
                    <div class="border border-green-200 bg-green-50 p-4 rounded-lg text-center">
                      <p class="text-sm text-green-600">Selesai</p>
                      <p class="text-xl font-semibold text-green-700">{{ selectedMember.completedActivities }}</p>
                    </div>
                    <div class="border border-red-200 bg-red-50 p-4 rounded-lg text-center">
                      <p class="text-sm text-red-600">Tidak Selesai</p>
                      <p class="text-xl font-semibold text-red-700">{{ selectedMember.notDoneActivities }}</p>
                    </div>
                    <div class="border border-yellow-200 bg-yellow-50 p-4 rounded-lg text-center">
                      <p class="text-sm text-yellow-600">Direncanakan</p>
                      <p class="text-xl font-semibold text-yellow-700">{{ selectedMember.plannedActivities }}</p>
                    </div>
                  </div>

                  <!-- Member Activities -->
                  <div>
                    <h4 class="font-medium text-gray-900 mb-3">Aktivitas Terbaru</h4>
                    <div v-if="!selectedMember.activities || selectedMember.activities.length === 0" class="py-4 text-center text-gray-500">
                      Tidak ada aktivitas ditemukan untuk periode ini
                    </div>
                    <ul v-else class="divide-y divide-gray-200">
                      <li v-for="activity in selectedMember.activities" :key="activity.id" class="py-3">
                        <div class="flex items-center justify-between">
                          <div>
                            <p class="text-sm font-medium text-red-600">{{ activity.name }}</p>
                            <p class="text-xs text-gray-500">{{ formatDate(activity.date) }}</p>
                          </div>
                          <div class="flex items-center space-x-2">
                            <span 
                              class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                              :class="getActivityTypeColorClass(activity.activity_type)"
                            >
                              {{ getTranslatedActivityType(activity.activity_type) }}
                            </span>
                            <span 
                              class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                              :class="getActivityStatusClass(activity.state)"
                            >
                              {{ activity.state === 'done' ? 'Selesai' : 
                                  activity.state === 'not_done' ? 'Tidak Selesai' : 'Direncanakan' }}
                            </span>
                          </div>
                        </div>
                        <p v-if="activity.description" class="mt-1 text-sm text-gray-500">{{ activity.description }}</p>
                        <div v-if="activity.state !== 'planned' && activity.verified_by" class="mt-1 text-xs text-gray-500">
                          <span class="font-medium">Diverifikasi oleh:</span> {{ activity.verified_by.name }}
                          <span class="ml-2 font-medium">pada:</span> {{ formatDateTime(activity.verification_date) }}
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>

                <div class="mt-6 flex justify-end">
                  <button
                    type="button"
                    @click="closeMemberModal"
                    class="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    Tutup
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useToast } from '@/composables/useToast'
import apiClient from '@/config/api'
import { 
  DocumentArrowDownIcon,
  TrophyIcon
} from '@heroicons/vue/24/outline'
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from '@headlessui/vue'
import Toast from '@/components/Toast.vue'

// State
const { toast, showToast } = useToast()
const loading = ref(false)
const memberDetailsLoading = ref(false)
const showMemberModal = ref(false)
const selectedMember = ref({})

const filters = ref({
  date_from: '',
  date_to: '',
})

const teamPerformance = ref({
  realizationRate: 0,
  topPerformer: {
    name: 'N/A',
    realization: 0,
    days: 0,
    activities: 0
  },
  stats: {
    totalDays: 0,
    totalActivities: 0,
    completedActivities: 0
  }
})

const teamMembers = ref([])

// Methods
const fetchTeamData = async () => {
  try {
    loading.value = true
    
    // Set default date range if not provided
    if (!filters.value.date_from || !filters.value.date_to) {
      // Set to current month
      const today = new Date()
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)
      
      filters.value.date_from = formatDateYYYYMMDD(startOfMonth)
      filters.value.date_to = formatDateYYYYMMDD(endOfMonth)
    }
    
    // Call BAU report API
    const response = await apiClient.post('/web/v2/content/bau/report', {
      jsonrpc: '2.0',
      method: 'call',
      id: new Date().getTime(),
      params: {
        date_from: filters.value.date_from,
        date_to: filters.value.date_to
      }
    })

    if (response.data.result?.status === 'success') {
      const reportData = response.data.result.data
      showToast({
        message: 'Data kinerja tim berhasil dimuat',
        type: 'success'
      })
      
      // Prepare team members data
      teamMembers.value = reportData.creators.map(creator => {
        // Calculate status counts
        const activities = creator.activities || []
        const completedActivities = activities.filter(a => a.state === 'done').length
        const notDoneActivities = activities.filter(a => a.state === 'not_done').length
        const plannedActivities = activities.filter(a => a.state === 'planned').length
        
        // Calculate realization rate based on completed vs total
        const totalActivities = activities.length
        const realizationRate = totalActivities > 0
          ? Math.round((completedActivities / totalActivities) * 100)
          : 0
          
        return {
          id: creator.creator_id,
          name: creator.creator_name,
          position: creator.position || 'Anggota Tim',
          bauDays: creator.bau_days,
          totalActivities: totalActivities,
          completedActivities: completedActivities,
          notDoneActivities: notDoneActivities,
          plannedActivities: plannedActivities,
          realizationRate: realizationRate,
          commonActivity: creator.most_common_activity,
          activities: activities,
          totalHours: creator.total_hours || 0 // Keep for backward compatibility
        }
      })
      
      // Find top performer
      let topPerformer = { name: 'N/A', realization: 0, days: 0, activities: 0 }
      if (teamMembers.value.length > 0) {
        const topPerformerMember = [...teamMembers.value].sort((a, b) => {
          // Sort by realization rate first, then by completed activities
          if (b.realizationRate === a.realizationRate) {
            return b.completedActivities - a.completedActivities
          }
          return b.realizationRate - a.realizationRate
        })[0]
        
        topPerformer = {
          name: topPerformerMember.name,
          realization: topPerformerMember.realizationRate,
          days: topPerformerMember.bauDays,
          activities: topPerformerMember.completedActivities
        }
      }
      
      // Calculate overall statistics
      const totalActivities = teamMembers.value.reduce((sum, member) => sum + member.totalActivities, 0)
      const completedActivities = teamMembers.value.reduce((sum, member) => sum + member.completedActivities, 0)
      const realizationRate = totalActivities > 0
        ? Math.round((completedActivities / totalActivities) * 100)
        : 0
      
      // Set team performance data
      teamPerformance.value = {
        realizationRate: realizationRate,
        topPerformer: topPerformer,
        stats: {
          totalDays: reportData.summary.total_bau_days,
          totalActivities: totalActivities,
          completedActivities: completedActivities
        }
      }
    } else {
      showToast({
        message: response.data.result?.message || 'Gagal memuat data tim',
        type: 'error',
        duration: 5000
      })
    }
  } catch (error) {
    console.error('Error fetching team data:', error)
    showToast({
      message: error.message || 'Gagal memuat data tim',
      type: 'error',
      duration: 5000
    })
  } finally {
    loading.value = false
  }
}

const viewMemberDetails = async (memberId) => {
  try {
    memberDetailsLoading.value = true
    
    // Find the member in the team members list
    const member = teamMembers.value.find(m => m.id === memberId)
    
    if (member) {
      // If activities are not already loaded for this member
      if (!member.activities || member.activities.length === 0) {
        // Fetch member's BAU activities from the API
        const response = await apiClient.post('/web/v2/content/bau', {
          jsonrpc: '2.0',
          method: 'call',
          id: new Date().getTime(),
          params: {
            operation: 'get',
            creator_id: memberId,
            date_from: filters.value.date_from,
            date_to: filters.value.date_to
          }
        })
        
        if (response.data.result?.status === 'success') {
          member.activities = response.data.result.data || []
          
          // Update statistics after loading activities
          member.completedActivities = member.activities.filter(a => a.state === 'done').length
          member.notDoneActivities = member.activities.filter(a => a.state === 'not_done').length
          member.plannedActivities = member.activities.filter(a => a.state === 'planned').length
          member.totalActivities = member.activities.length
          member.realizationRate = member.totalActivities > 0
            ? Math.round((member.completedActivities / member.totalActivities) * 100)
            : 0
        }
      }
      
      selectedMember.value = { ...member }
      showMemberModal.value = true
    }
  } catch (error) {
    console.error('Error fetching member details:', error)
    showToast({
      message: 'Gagal memuat detail anggota tim',
      type: 'error'
    })
  } finally {
    memberDetailsLoading.value = false
  }
}

const closeMemberModal = () => {
  showMemberModal.value = false
  selectedMember.value = {}
}

const exportTeamData = async () => {
  try {
    showToast({
      message: 'Menyiapkan ekspor data tim...',
      type: 'info'
    })
    
    // Create CSV content
    let csvContent = "Nama,Posisi,Hari BAU,Total Aktivitas,Aktivitas Selesai,Tingkat Realisasi,Aktivitas Umum\n"
    
    teamMembers.value.forEach(member => {
      csvContent += `"${member.name}","${member.position}",${member.bauDays},${member.totalActivities},${member.completedActivities},${member.realizationRate}%,"${getTranslatedActivityType(member.commonActivity)}"\n`
    })
    
    // Create a blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    
    // Set link properties
    link.setAttribute('href', url)
    link.setAttribute('download', `laporan-tim-bau-${formatDateYYYYMMDD(new Date())}.csv`)
    link.style.visibility = 'hidden'
    
    // Add to document, click and remove
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    showToast({
      message: 'Data tim berhasil diekspor',
      type: 'success'
    })
  } catch (error) {
    console.error('Error exporting team data:', error)
    showToast({
      message: 'Gagal mengekspor data tim',
      type: 'error'
    })
  }
}

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

const formatDateTime = (dateTimeString) => {
  if (!dateTimeString) return '-'
  
  const dateTime = new Date(dateTimeString)
  
  // Indonesian month names
  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ]
  
  const day = dateTime.getDate()
  const month = monthNames[dateTime.getMonth()]
  const year = dateTime.getFullYear()
  const hours = String(dateTime.getHours()).padStart(2, '0')
  const minutes = String(dateTime.getMinutes()).padStart(2, '0')
  
  return `${day} ${month} ${year}, ${hours}:${minutes}`
}

const formatDateYYYYMMDD = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const getActivityTypeColorClass = (type) => {
  if (!type) return 'bg-gray-100 text-gray-800'
  
  const colorMap = {
    'design': 'bg-purple-100 text-purple-800',
    'video': 'bg-red-100 text-red-800',
    'other': 'bg-gray-100 text-gray-800',
    'meeting': 'bg-blue-100 text-blue-800',
    'training': 'bg-green-100 text-green-800',
    'documentation': 'bg-teal-100 text-teal-800',
    'reporting': 'bg-yellow-100 text-yellow-800',
    'admin': 'bg-indigo-100 text-indigo-800',
    'planning': 'bg-orange-100 text-orange-800',
    'support': 'bg-pink-100 text-pink-800'
  }
  
  return colorMap[type.toLowerCase()] || 'bg-gray-100 text-gray-800'
}

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

const getTranslatedActivityType = (type) => {
  if (!type) return 'Lainnya';
  
  const translations = {
    'meeting': 'Rapat',
    'training': 'Pelatihan',
    'documentation': 'Dokumentasi',
    'support': 'Support',
    'admin': 'Administrasi',
    'planning': 'Perencanaan',
    'other': 'Lainnya',
    'design': 'Desain',
    'video': 'Video',
    'reporting': 'Pelaporan'
  };
  
  return translations[type.toLowerCase()] || type;
}

onMounted(() => {
  fetchTeamData()
})
</script>

