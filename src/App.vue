<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from './stores/auth'
import { useNotificationStore } from './stores/notification'
import Sidebar from './components/Sidebar.vue'
import NotificationBell from './components/NotificationBell.vue'

// Hanya import PWAUpdatePopUp jika memang ada
// import PWAUpdatePopUp from './components/PWAUpdatePopUp.vue'

const router = useRouter()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()

onMounted(() => {
  authStore.checkAuth()
  
  // Initialize notifications if authenticated
  if (authStore.isAuthenticated) {
    notificationStore.initialize()
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
    
    <!-- Conditional rendering of PWAUpdatePopUp component -->
    <!-- <PWAUpdatePopUp v-if="false" /> -->
  </div>

  <!-- Non-Autentikasi Layout -->
  <div v-else class="h-screen">
    <router-view></router-view>
  </div>
</template>