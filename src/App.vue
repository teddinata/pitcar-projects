<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from './stores/auth'
import { useNotificationStore } from './stores/notification'
import Sidebar from './components/Sidebar.vue'
import NotificationBell from './components/NotificationBell.vue'
import { Bell, X } from 'lucide-vue-next'

// Hanya import PWAUpdatePopUp jika memang ada
// import PWAUpdatePopUp from './components/PWAUpdatePopUp.vue'

const router = useRouter()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()

// State untuk toast notification
const showToast = ref(false)
const newNotificationCount = ref(0)
const toastTimeout = ref(null)

// Fungsi untuk memeriksa notifikasi baru
const checkForNewNotifications = async () => {
  // Simpan jumlah unread sebelumnya
  const previousUnreadCount = notificationStore.unreadCount + notificationStore.mentionUnreadCount
  
  // Fetch unread counts
  try {
    await Promise.all([
      notificationStore.fetchUnreadCount(),
      notificationStore.fetchMentionUnreadCount()
    ])
    
    const currentUnreadCount = notificationStore.unreadCount + notificationStore.mentionUnreadCount
    
    // Jika ada notifikasi baru
    if (currentUnreadCount > previousUnreadCount) {
      newNotificationCount.value = currentUnreadCount - previousUnreadCount
      showToast.value = true
      
      // Otomatis sembunyikan toast setelah 60 detik
      if (toastTimeout.value) clearTimeout(toastTimeout.value)
      toastTimeout.value = setTimeout(() => {
        showToast.value = false
      }, 60000)
    }
  } catch (error) {
    console.error('Error checking for new notifications:', error)
  }
}

// Fungsi untuk menangani klik pada toast
const handleToastClick = () => {
  showToast.value = false
  router.push('/team/notifications')
}

// Tutup toast
const closeToast = () => {
  showToast.value = false
  if (toastTimeout.value) {
    clearTimeout(toastTimeout.value)
  }
}

// Interval untuk polling
let pollingInterval = null

onMounted(() => {
  authStore.checkAuth()
  
  // Initialize notifications if authenticated
  if (authStore.isAuthenticated) {
    notificationStore.initialize()
    
    // Mulai polling untuk notifikasi baru setiap 30 detik
    pollingInterval = setInterval(checkForNewNotifications, 30000)
  }
})

onUnmounted(() => {
  // Bersihkan interval saat komponen unmount
  if (pollingInterval) clearInterval(pollingInterval)
  if (toastTimeout.value) clearTimeout(toastTimeout.value)
})

// Watch authentication state changes
watch(() => authStore.isAuthenticated, (isAuthenticated) => {
  if (isAuthenticated) {
    notificationStore.initialize()
    
    // Start polling when user becomes authenticated
    if (!pollingInterval) {
      pollingInterval = setInterval(checkForNewNotifications, 30000)
    }
  } else {
    // Clear polling when user logs out
    if (pollingInterval) {
      clearInterval(pollingInterval)
      pollingInterval = null
    }
  }
})
</script>

<template>
  <!-- Autentikasi Layout -->
  <div v-if="authStore.isAuthenticated" class="flex h-screen bg-gray-50">
    <Sidebar />
    <div class="flex-1 overflow-auto">
      <!-- Add top header with notification bell -->
      <header class="sticky top-0 z-10 bg-white shadow-sm">
        <div class="px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between">
          <div></div> <!-- Placeholder for left items if needed -->
          <div class="flex items-center space-x-3">
            <NotificationBell />
            <!-- Other header items like user profile -->
          </div>
        </div>
      </header>
      
      <router-view></router-view>
    </div>
    
    <!-- Toast Notification -->
    <div 
      v-if="showToast" 
      class="fixed bottom-4 right-4 z-50 bg-white border border-gray-200 shadow-lg rounded-lg max-w-sm"
    >
      <div class="p-4 flex items-start">
        <div class="flex-shrink-0 bg-red-100 rounded-full p-2 mr-3">
          <Bell class="h-5 w-5 text-red-600" />
        </div>
        <div class="flex-1">
          <h3 class="text-sm font-medium text-gray-900">Notifikasi Baru</h3>
          <p class="mt-1 text-sm text-gray-500">
            Anda menerima {{ newNotificationCount }} notifikasi baru
          </p>
          <div class="mt-3">
            <button 
              @click="handleToastClick"
              class="text-sm font-medium text-red-600 hover:text-red-500"
            >
              Lihat notifikasi
            </button>
          </div>
        </div>
        <div class="ml-4 flex-shrink-0 flex items-start">
          <button 
            @click="closeToast" 
            class="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <span class="sr-only">Close</span>
            <X class="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
    
    <!-- Conditional rendering of PWAUpdatePopUp component -->
    <!-- <PWAUpdatePopUp v-if="false" /> -->
  </div>

  <!-- Non-Autentikasi Layout -->
  <div v-else class="h-screen">
    <router-view></router-view>
  </div>
</template>