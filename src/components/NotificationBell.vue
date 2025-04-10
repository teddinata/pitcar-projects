<!-- components/NotificationBell.vue -->
<template>
  <div class="relative">
    <button
      @click.stop="toggleDropdown"
      class="p-2 rounded-full hover:bg-gray-100 relative focus:outline-none focus:ring-2 focus:ring-red-500"
    >
      <Bell :class="[hasUnread ? 'text-red-500' : 'text-gray-600']" class="w-5 h-5" />
      <span
        v-if="combinedUnreadCount > 0"
        class="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-semibold text-white bg-red-500 rounded-full transform -translate-y-1/3 translate-x-1/3"
      >
        {{ combinedUnreadCount > 99 ? '99+' : combinedUnreadCount }}
      </span>
    </button>

    <!-- Dropdown -->
    <div
      v-if="isOpen"
      ref="dropdownRef"
      class="absolute right-0 mt-2 w-96 bg-white rounded-md shadow-lg overflow-hidden z-50"
    >
      <div class="p-3 border-b border-gray-100">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-semibold text-gray-700">Notifikasi</h3>
          <button
            v-if="hasUnread"
            @click="markAllAsRead"
            class="text-xs text-gray-500 hover:text-red-500"
          >
            Tandai semua telah dibaca
          </button>
        </div>
      </div>
      
      <!-- Kategori Tabs -->
      <div class="px-2 pt-2 border-b border-gray-100">
        <div class="flex space-x-1 overflow-x-auto">
          <button
            v-for="tab in tabs"
            :key="tab.value"
            @click.stop="setActiveTab(tab.value)"
            class="px-3 py-1.5 text-xs rounded-md whitespace-nowrap"
            :class="[
              activeTab === tab.value 
                ? 'bg-red-100 text-red-600 font-medium' 
                : 'text-gray-600 hover:bg-gray-100'
            ]"
          >
            {{ tab.label }}
            <span 
              v-if="getUnreadCountForTab(tab.value) > 0" 
              class="ml-1 px-1.5 py-0.5 text-xs bg-red-500 text-white rounded-full"
            >
              {{ getUnreadCountForTab(tab.value) }}
            </span>
          </button>
        </div>
      </div>
      
      <div v-if="loading" class="py-6 flex justify-center items-center">
        <Loader2 class="w-5 h-5 text-red-500 animate-spin" />
      </div>
      
      <div v-else-if="filteredCombinedNotifications.length === 0" class="py-6 text-center text-sm text-gray-500">
        Tidak ada notifikasi untuk ditampilkan
      </div>
      
      <!-- Notification List -->
      <div v-else class="max-h-96 overflow-y-auto">
        <div
          v-for="notification in filteredCombinedNotifications"
          :key="(notification.isMention ? 'mention-' : 'notif-') + notification.id"
          @click="handleNotificationClick(notification)"
          class="p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition duration-150"
          :class="{ 'bg-gray-50': notification.is_read }"
        >
          <!-- Notification item content -->
          <div class="flex items-start">
            <!-- Icon based on category -->
            <div class="mr-3 mt-1">
              <div class="p-1 rounded-full" :class="getNotificationIconClass(notification)">
                <component :is="getNotificationIcon(notification)" class="w-4 h-4 text-white" />
              </div>
            </div>
            
            <div class="flex-1 min-w-0">
              <div 
                class="text-sm font-medium text-gray-900" 
                :class="{ 'font-normal': notification.is_read }"
              >
                {{ notification.title }}
                <!-- Unread indicator -->
                <span 
                  v-if="!notification.is_read" 
                  class="ml-2 inline-block w-2 h-2 rounded-full"
                  :class="notification.isMention ? 'bg-yellow-500' : 'bg-red-500'"
                ></span>
              </div>
              <p class="text-xs text-gray-500 mt-0.5 truncate">
                {{ notification.message }}
              </p>
              <div class="text-xs text-gray-400 mt-1 flex items-center">
                <Clock class="w-3 h-3 mr-1" />
                {{ formatDate(notification.date || notification.create_date) }}
              </div>
            </div>
            
            <!-- Priority badge -->
            <div v-if="notification.priority === 'high' || notification.priority === 'urgent'" class="ml-2">
              <span
                class="px-1.5 py-0.5 text-xs rounded-full"
                :class="{
                  'bg-red-100 text-red-800': notification.priority === 'urgent',
                  'bg-orange-100 text-orange-800': notification.priority === 'high'
                }"
              >
                {{ notification.priority }}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="p-3 text-center border-t border-gray-100">
        <router-link
          to="/team/notifications"
          class="text-xs text-red-500 hover:text-red-600 font-medium"
          @click="isOpen = false"
        >
          Lihat semua notifikasi
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { formatDistanceToNow } from 'date-fns'
import { Bell, Loader2, Clock, CheckCircle, AlertTriangle, Calendar, AtSign, FileText, ClipboardList } from 'lucide-vue-next'
import { useNotificationStore } from '@/stores/notification'
import { vClickOutside } from '@/directives/clickOutside'

const router = useRouter()
const notificationStore = useNotificationStore()

// State
const isOpen = ref(false)
const dropdownRef = ref(null)
const loading = ref(false)
const activeTab = ref('all')

// Tabs configuration
const tabs = [
  { value: 'all', label: 'Semua' },
  { value: 'project', label: 'Proyek' },
  { value: 'chat', label: 'Mention' },
  { value: 'meeting', label: 'Rapat' }
]

// Computed
const unreadCount = computed(() => notificationStore.unreadCount)
const mentionUnreadCount = computed(() => notificationStore.mentionUnreadCount)
const combinedUnreadCount = computed(() => notificationStore.unreadCount + notificationStore.mentionUnreadCount)
const hasUnread = computed(() => notificationStore.hasUnread)

const filteredCombinedNotifications = computed(() => {
  // Ambil notifikasi gabungan
  const combined = notificationStore.combinedNotifications
  
  // Jika tab 'all', tampilkan semua
  if (activeTab.value === 'all') {
    return combined.slice(0, 10) // Batasi 10 item
  }
  
  // Jika tab adalah grup kategori
  if (['project', 'chat', 'meeting'].includes(activeTab.value)) {
    const categories = notificationStore.categoryGroups[activeTab.value] || []
    
    // Untuk tab 'chat', tampilkan mentions dan notifikasi chat
    if (activeTab.value === 'chat') {
      return combined
        .filter(n => n.isMention || categories.includes(n.category))
        .slice(0, 10)
    } else {
      return combined
        .filter(n => !n.isMention && categories.includes(n.category))
        .slice(0, 10)
    }
  }
  
  // Filter berdasarkan kategori spesifik
  return combined
    .filter(n => n.category === activeTab.value)
    .slice(0, 10)
})

const toggleDropdown = async (event) => {
  event.stopPropagation() // Prevent event bubbling
  isOpen.value = !isOpen.value
  
  // Fetch notifications when dropdown is opened
  if (isOpen.value) {
    await loadData()
  }
}

// Handler for click outside
const handleClickOutside = (event) => {
  if (isOpen.value && dropdownRef.value && !dropdownRef.value.contains(event.target) && !event.target.closest('button')) {
    isOpen.value = false
  }
}

// Methods
const getUnreadCountForTab = (tabValue) => {
  if (tabValue === 'all') {
    return combinedUnreadCount.value
  }
  
  if (tabValue === 'chat') {
    // Gabungkan unread dari kategori chat dan mentions
    const chatNotifications = notificationStore.notifications.filter(n => {
      const chatCategories = notificationStore.categoryGroups.chat || []
      return chatCategories.includes(n.category) && !n.is_read
    })
    
    return chatNotifications.length + mentionUnreadCount.value
  }
  
  if (['project', 'meeting'].includes(tabValue)) {
    const categories = notificationStore.categoryGroups[tabValue] || []
    return notificationStore.notifications
      .filter(n => categories.includes(n.category) && !n.is_read)
      .length
  }
  
  return 0
}

// const toggleDropdown = async () => {
//   isOpen.value = !isOpen.value
  
//   // Fetch notifications when dropdown is opened
//   if (isOpen.value) {
//     await loadData()
//   }
// }

const closeDropdown = () => {
  isOpen.value = false
}

const loadData = async () => {
  loading.value = true
  try {
    // Fetch both notifications and mentions
    await notificationStore.fetchCombinedData(10)
  } catch (error) {
    console.error(`Error loading notifications:`, error)
  } finally {
    loading.value = false
  }
}

const setActiveTab = (tab) => {
  activeTab.value = tab
}

const markAllAsRead = async () => {
  try {
    // Mark all notifications as read
    await notificationStore.markAllAsRead()
    
    // Mark all mentions as read
    await notificationStore.markAllMentionsAsRead()
  } catch (error) {
    console.error('Error marking all as read:', error)
  }
}

const handleNotificationClick = async (notification) => {
  // Mark as read (but continue showing it)
  if (!notification.is_read) {
    await notificationStore.markAsRead(notification.id, notification.isMention)
  }
  
  // Close dropdown
  isOpen.value = false
  
  // Handle routing based on notification data
  if (notification.data?.action) {
    const action = notification.data.action
    
    try {
      switch (action) {
        case 'view_task':
          if (notification.data?.task_id) {
            router.push(`/team/tasks/${notification.data.task_id}`)
          }
          break
        case 'view_project':
          if (notification.data?.project_id) {
            router.push(`/team/projects/${notification.data.project_id}`)
          }
          break
        case 'view_meeting':
          if (notification.data?.meeting_id) {
            router.push(`/team/meetings/${notification.data.meeting_id}`)
          }
          break
        case 'view_group_chat':
          if (notification.data?.group_id) {
            router.push(`/team/project/${notification.data.group_id}`)
          }
          break
        default:
          // Default action
          router.push('/team/notifications')
      }
    } catch (error) {
      console.error('Navigation error:', error)
    }
  }
}

const formatDate = (dateStr) => {
  try {
    return formatDistanceToNow(new Date(dateStr), { addSuffix: true })
  } catch (e) {
    return dateStr
  }
}

const getNotificationIcon = (notification) => {
  // Jika notification adalah mention
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
  // Jika notification adalah mention
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

// Lifecycle
onMounted(async () => {
  // Initialize notification store if not already done
  if (!notificationStore.isInitialized) {
    await notificationStore.initialize()
  } else {
    // Refresh unread counts
    await Promise.all([
      notificationStore.fetchUnreadCount(),
      notificationStore.fetchMentionUnreadCount()
    ])
  }
  
  // Start polling for new notifications
  notificationStore.startPolling()

  // Add click outside event listener
  document.addEventListener('mousedown', handleClickOutside)
})

onUnmounted(() => {
  // Stop polling when component is destroyed
  notificationStore.stopPolling()

  // Clean up event listener
  document.removeEventListener('mousedown', handleClickOutside)
})
</script>