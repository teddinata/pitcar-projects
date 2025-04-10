<!-- views/team/Notifications.vue -->
<template>
  <div class="min-h-screen bg-gray-50">
    <div class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center justify-between">
          <h1 class="text-xl font-semibold text-gray-900">
            Notifikasi
          </h1>
          <div class="flex space-x-2">
            <button
              v-if="hasUnread"
              @click="markAllAsRead"
              class="flex items-center px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50"
            >
              <CheckSquare class="w-4 h-4 mr-1.5 text-gray-500" />
              Tandai semua telah dibaca
            </button>
            <select 
              v-model="activeFilter" 
              class="py-3 px-2 rounded-md border-gray-300 text-sm focus:ring-red-500 focus:border-red-500"
            >
              <option value="all">Semua notifikasi</option>
              <option value="unread">Belum dibaca</option>
              <option value="read">Sudah dibaca</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Category Tabs -->
    <div class="bg-white border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex space-x-4 overflow-x-auto pb-1">
          <button
            v-for="tab in tabs"
            :key="tab.value"
            @click="setActiveTab(tab.value)"
            class="py-4 px-1 text-sm font-medium border-b-2 -mb-px whitespace-nowrap"
            :class="[
              activeTab === tab.value 
                ? 'border-red-500 text-red-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            {{ tab.label }}
          </button>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div v-if="loading" class="flex justify-center py-12">
        <Loader2 class="w-8 h-8 text-red-500 animate-spin" />
      </div>
      
      <div v-else-if="displayedNotifications.length === 0" class="bg-white rounded-lg shadow p-8 text-center">
        <BellOff class="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 mb-1">Tidak ada notifikasi</h3>
        <p class="text-gray-500 mb-6">Tidak ada notifikasi yang sesuai dengan filter Anda.</p>
        <button 
          @click="resetFilters" 
          class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md"
        >
          Reset Filter
        </button>
      </div>
      
      <div v-else>
        <ul role="list" class="bg-white shadow overflow-hidden sm:rounded-md divide-y divide-gray-200">
          <li 
            v-for="notification in displayedNotifications" 
            :key="(notification.isMention ? 'mention-' : 'notif-') + notification.id"
            :class="{ 'bg-gray-50': notification.is_read }"
            class="relative hover:bg-gray-100 transition-colors duration-150"
          >
            <div class="flex items-start px-4 py-4 sm:px-6">
              <!-- Icon -->
              <div class="flex-shrink-0 mr-4">
                <div class="p-2 rounded-full" :class="getNotificationIconClass(notification)">
                  <component 
                    :is="getNotificationIcon(notification)" 
                    class="w-5 h-5 text-white" 
                  />
                </div>
              </div>
              
              <!-- Content -->
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between">
                  <p 
                    class="text-sm font-medium text-gray-900 flex items-center"
                    :class="{ 'font-normal': notification.is_read }"
                  >
                    {{ notification.title }}
                    <span 
                      v-if="!notification.is_read" 
                      class="ml-2 inline-block w-2 h-2 rounded-full"
                      :class="notification.isMention ? 'bg-yellow-500' : 'bg-red-500'"
                    ></span>
                  </p>
                  <div class="ml-2 flex-shrink-0 flex">
                    <!-- Priority badge -->
                    <p v-if="notification.priority === 'high' || notification.priority === 'urgent'"
                      class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                      :class="{
                        'bg-red-100 text-red-800': notification.priority === 'urgent',
                        'bg-orange-100 text-orange-800': notification.priority === 'high'
                      }"
                    >
                      {{ notification.priority === 'urgent' ? 'Mendesak' : 'Prioritas Tinggi' }}
                    </p>
                  </div>
                </div>
                
                <p class="mt-1 text-sm text-gray-600">
                  {{ notification.message }}
                </p>
                
                <div class="mt-2 flex items-center text-xs text-gray-500">
                  <Calendar class="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                  <span>{{ formatDateTime(notification.date || notification.create_date) }}</span>
                  
                  <div class="mx-2 text-gray-300">|</div>
                  
                  <span v-if="notification.sender || (notification.isMention && notification.mentioned_by)" class="flex items-center">
                    <User class="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                    {{ notification.sender?.name || notification.mentioned_by?.name || 'Sistem' }}
                  </span>
                  
                  <div v-if="notification.project || (notification.isMention && notification.group)" class="mx-2 text-gray-300">|</div>
                  
                  <span v-if="notification.project" class="flex items-center">
                    <Briefcase class="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                    {{ notification.project.name }}
                  </span>
                  
                  <span v-else-if="notification.isMention && notification.group" class="flex items-center">
                    <MessageSquare class="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                    {{ notification.group.name }}
                  </span>
                </div>
              </div>
              
              <!-- Actions -->
              <div class="ml-4 flex-shrink-0 flex items-start space-x-2">
                <button 
                  v-if="!notification.is_read"
                  @click.stop="markAsRead(notification.id, notification.isMention)"
                  class="text-gray-400 hover:text-gray-500"
                  title="Tandai sudah dibaca"
                >
                  <CheckCircle class="h-5 w-5" />
                </button>
                
                <button 
                  @click.stop="openNotification(notification)"
                  class="text-gray-400 hover:text-gray-500"
                  title="Buka"
                >
                  <ArrowRight class="h-5 w-5" />
                </button>
              </div>
            </div>
          </li>
        </ul>
        
        <!-- Pagination -->
        <div v-if="totalPages > 1" class="flex justify-center mt-6">
          <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <button
              @click="prevPage"
              :disabled="currentPage === 1"
              class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span class="sr-only">Sebelumnya</span>
              <ChevronLeft class="h-5 w-5" />
            </button>
            
            <span class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
              {{ currentPage }} / {{ totalPages }}
            </span>
            
            <button
              @click="nextPage"
              :disabled="currentPage === totalPages"
              class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span class="sr-only">Selanjutnya</span>
              <ChevronRight class="h-5 w-5" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { format } from 'date-fns'
import { 
  Loader2, CheckSquare, ChevronLeft, ChevronRight, Bell, BellOff, 
  CheckCircle, AlertTriangle, Calendar, AtSign, FileText, 
  ClipboardList, ArrowRight, User, Briefcase, MessageSquare 
} from 'lucide-vue-next'
import { useNotificationStore } from '@/stores/notification'
import { useToast } from '@/composables/useToast'

const router = useRouter()
const notificationStore = useNotificationStore()
const { toast, showToast } = useToast()

// State
const loading = ref(false)
const currentPage = ref(1)
const totalPages = ref(1)
const totalCount = ref(0)
const pageSize = ref(20)
const activeFilter = ref('all')
const activeTab = ref('all')

// Tabs configuration
const tabs = [
  { value: 'all', label: 'Semua' },
  { value: 'project', label: 'Proyek' },
  { value: 'chat', label: 'Chat & Mention' },
  { value: 'meeting', label: 'Rapat' }
]

// Computed
const hasUnread = computed(() => {
  const filteredItems = displayedNotifications.value.filter(item => !item.is_read)
  return filteredItems.length > 0
})

const displayedNotifications = computed(() => {
  // Get combined notifications
  let items = [...notificationStore.combinedNotifications]
  
  // Filter by tab category
  if (activeTab.value !== 'all') {
    if (['project', 'meeting'].includes(activeTab.value)) {
      const categories = notificationStore.categoryGroups[activeTab.value] || []
      items = items.filter(n => !n.isMention && categories.includes(n.category))
    } else if (activeTab.value === 'chat') {
      // Special case for chat tab - include mentions and chat notifications
      const chatCategories = notificationStore.categoryGroups.chat || []
      items = items.filter(n => n.isMention || chatCategories.includes(n.category))
    } else {
      // Specific category
      items = items.filter(n => n.category === activeTab.value)
    }
  }
  
  // Filter by read/unread status
  if (activeFilter.value === 'unread') {
    items = items.filter(n => !n.is_read)
  } else if (activeFilter.value === 'read') {
    items = items.filter(n => n.is_read)
  }
  
  // Update pagination info
  totalCount.value = items.length
  totalPages.value = Math.max(1, Math.ceil(totalCount.value / pageSize.value))
  
  // Ensure currentPage is valid
  if (currentPage.value > totalPages.value) {
    currentPage.value = totalPages.value
  }
  
  // Apply pagination
  const startIndex = (currentPage.value - 1) * pageSize.value
  const endIndex = startIndex + pageSize.value
  
  return items.slice(startIndex, endIndex)
})

// Methods
const fetchNotifications = async () => {
  loading.value = true
  
  try {
    // Fetch both notifications and mentions
    await notificationStore.fetchCombinedData(100, activeFilter.value === 'unread')
  } catch (error) {
    console.error('Error fetching notifications:', error)
    showToast({
      message: error.message || 'Gagal memuat notifikasi',
      type: 'error'
    })
  } finally {
    loading.value = false
  }
}

const markAsRead = async (id, isMention = false) => {
  try {
    await notificationStore.markAsRead(id, isMention)
  } catch (error) {
    console.error('Error marking notification as read:', error)
    showToast({
      message: error.message || 'Gagal menandai notifikasi sebagai dibaca',
      type: 'error'
    })
  }
}

const markAllAsRead = async () => {
  try {
    // Mark all notifications as read
    await notificationStore.markAllAsRead()
    
    // Mark all mentions as read
    await notificationStore.markAllMentionsAsRead()
    
    showToast({
      message: 'Semua notifikasi ditandai telah dibaca',
      type: 'success'
    })
  } catch (error) {
    console.error('Error marking all as read:', error)
    showToast({
      message: error.message || 'Gagal menandai semua notifikasi sebagai dibaca',
      type: 'error'
    })
  }
}

const setActiveTab = (tab) => {
  activeTab.value = tab
  currentPage.value = 1 // Reset to first page
}

const openNotification = (notification) => {
  // Mark as read if unread
  if (!notification.is_read) {
    markAsRead(notification.id, notification.isMention)
  }
  
  // Navigate based on notification data
  if (notification.data && notification.data.action) {
    const action = notification.data.action
    
    try {
      switch (action) {
        case 'view_task':
          if (notification.data.task_id) {
            router.push(`/team/tasks/${notification.data.task_id}`)
          }
          break
        case 'view_project':
          if (notification.data.project_id) {
            router.push(`/team/projects/${notification.data.project_id}`)
          }
          break
        case 'view_meeting':
          if (notification.data.meeting_id) {
            router.push(`/team/meetings/${notification.data.meeting_id}`)
          }
          break
        case 'view_group_chat':
          if (notification.data.group_id) {
            router.push(`/team/project/${notification.data.group_id}`)
          }
          break
        default:
          console.log('No specific action for notification type:', action)
      }
    } catch (error) {
      console.error('Navigation error:', error)
      showToast({
        message: 'Gagal membuka halaman terkait notifikasi',
        type: 'error'
      })
    }
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const resetFilters = () => {
  activeFilter.value = 'all'
  activeTab.value = 'all'
  currentPage.value = 1
}

const formatDateTime = (dateStr) => {
  try {
    const date = new Date(dateStr)
    return format(date, 'PPp') // Format: 'Apr 29, 2021, 9:30 AM'
  } catch (e) {
    return dateStr
  }
}

const getNotificationIcon = (notification) => {
  // Special handling for mentions
  if (notification.isMention) {
    return AtSign
  }
  
  const category = notification.category || 'system'
  
  switch (category) {
    case 'task_assigned':
    case 'task_updated':
      return ClipboardList
    case 'task_completed':
      return CheckCircle
    case 'deadline_approaching':
    case 'task_overdue':
      return AlertTriangle
    case 'meeting_scheduled':
    case 'meeting_reminder':
      return Calendar
    case 'mention':
      return AtSign
    case 'document_uploaded':
      return FileText
    default:
      return Bell
  }
}

const getNotificationIconClass = (notification) => {
  // Special handling for mentions
  if (notification.isMention) {
    return 'bg-yellow-500'
  }
  
  const category = notification.category || 'system'
  
  switch (category) {
    case 'task_assigned':
      return 'bg-blue-500'
    case 'task_updated':
      return 'bg-indigo-500'
    case 'task_completed':
      return 'bg-green-500'
    case 'deadline_approaching':
    case 'task_overdue':
      return 'bg-red-500'
    case 'meeting_scheduled':
    case 'meeting_reminder':
      return 'bg-purple-500'
    case 'mention':
      return 'bg-yellow-500'
    case 'document_uploaded':
      return 'bg-teal-500'
    default:
      return 'bg-gray-500'
  }
}

// Watchers
watch([activeFilter, activeTab], () => {
  currentPage.value = 1
})

// Lifecycle
onMounted(async () => {
  // Initialize notification store if not already done
  if (!notificationStore.isInitialized) {
    await notificationStore.initialize()
  }
  
  // Fetch initial data
  await fetchNotifications()
})
</script>