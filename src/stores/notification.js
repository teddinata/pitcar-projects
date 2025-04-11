// stores/notification.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import apiClient from '@/config/api'

export const useNotificationStore = defineStore('notification', () => {
  // State
  const notifications = ref([])
  const mentions = ref([])
  const unreadCount = ref(0)
  const mentionUnreadCount = ref(0)
  const isPolling = ref(false)
  const pollingInterval = ref(null)
  const lastFetchTime = ref(new Date().getTime())
  const activeCategory = ref('all')
  const categoryGroups = ref({})
  const availableCategories = ref([])
  const isInitialized = ref(false)
  // Tambahkan state untuk melacak notifikasi terakhir yang dilihat
  const lastCheckedTime = ref(new Date().getTime())
  const newNotificationsReceived = ref(false)

  
  // Computed
  const hasUnread = computed(() => unreadCount.value > 0 || mentionUnreadCount.value > 0)
  
  // Gabungkan notifikasi dan mentions untuk tampilan
  const combinedNotifications = computed(() => {
    const mentionsWithType = mentions.value.map(mention => ({
      ...mention,
      isMention: true,
      // Tambahkan properti yang kompatibel dengan format notifikasi
      id: mention.id,
      title: `${mention.mentioned_by?.name || 'Seseorang'} menyebut Anda`,
      message: mention.message?.content_preview || 'Pesan Mention',
      date: mention.create_date,
      is_read: mention.is_read,
      category: 'mention',
      priority: 'normal',
      // Data untuk navigasi
      data: {
        action: 'view_group_chat',
        group_id: mention.group?.id,
        message_id: mention.message?.id
      }
    }))
    
    return [...notifications.value, ...mentionsWithType].sort((a, b) => {
      // Sort berdasarkan tanggal, terbaru di atas
      const dateA = new Date(a.date || a.create_date)
      const dateB = new Date(b.date || b.create_date)
      return dateB - dateA
    })
  })
  
  // Filter notifikasi berdasarkan kategori aktif
  const filteredNotifications = computed(() => {
    if (activeCategory.value === 'all') {
      return notifications.value
    }
    
    // Filter berdasarkan grup
    if (['project', 'chat', 'meeting'].includes(activeCategory.value)) {
      const categories = categoryGroups.value[activeCategory.value] || []
      return notifications.value.filter(n => categories.includes(n.category))
    }
    
    // Filter berdasarkan kategori spesifik
    return notifications.value.filter(n => n.category === activeCategory.value)
  })
  
  // Filter notifikasi gabungan berdasarkan kategori aktif
  const filteredCombinedNotifications = computed(() => {
    if (activeCategory.value === 'all') {
      return combinedNotifications.value
    }
    
    // Filter berdasarkan grup
    if (['project', 'chat', 'meeting'].includes(activeCategory.value)) {
      const categories = categoryGroups.value[activeCategory.value] || []
      
      // Untuk grup 'chat', sertakan mentions dan notifikasi kategori chat
      if (activeCategory.value === 'chat') {
        return combinedNotifications.value.filter(n => 
          n.isMention || categories.includes(n.category)
        )
      } else {
        return combinedNotifications.value.filter(n => 
          !n.isMention && categories.includes(n.category)
        )
      }
    }
    
    // Filter berdasarkan kategori spesifik
    return combinedNotifications.value.filter(n => n.category === activeCategory.value)
  })
  
  // Actions
  const fetchNotifications = async (limit = 10, unreadOnly = false) => {
    try {
      const response = await apiClient.post('/web/v2/team/notifications', {
        jsonrpc: '2.0',
        id: new Date().getTime(),
        params: {
          operation: 'list',
          limit,
          unread_only: unreadOnly,
          // Tambahkan kategori jika bukan 'all' dan bukan grup
          category: (!['all', 'project', 'chat', 'meeting'].includes(activeCategory.value)) 
            ? activeCategory.value 
            : undefined
        }
      })

      if (response.data.result?.status === 'success') {
        notifications.value = response.data.result.data
        if (response.data.result.unread_count !== undefined) {
          unreadCount.value = response.data.result.unread_count
        }
        return response.data.result.data
      }
      return []
    } catch (error) {
      console.error('Error fetching notifications:', error)
      return []
    }
  }
  
  const fetchMentions = async (limit = 10) => {
    try {
      const response = await apiClient.post('/web/v2/team/mentions', {
        jsonrpc: '2.0',
        id: new Date().getTime(),
        params: {
          operation: 'list',
          limit
        }
      })

      if (response.data.result?.status === 'success') {
        mentions.value = response.data.result.data
        if (response.data.result.unread_count !== undefined) {
          mentionUnreadCount.value = response.data.result.unread_count
        }
        return response.data.result.data
      }
      return []
    } catch (error) {
      console.error('Error fetching mentions:', error)
      return []
    }
  }
  
  // Fetch kedua jenis data sekaligus
  const fetchCombinedData = async (limit = 10, unreadOnly = false) => {
    try {
      // Fetch both data sources
      await Promise.all([
        fetchNotifications(limit, unreadOnly),
        fetchMentions(limit)
      ])
      
      return { status: 'success' }
    } catch (error) {
      console.error('Error fetching combined data', error)
      throw error
    }
  }
  
  const fetchCategories = async () => {
    try {
      const response = await apiClient.post('/web/v2/team/notification/categories', {
        jsonrpc: '2.0',
        id: new Date().getTime()
      })

      if (response.data.result?.status === 'success') {
        availableCategories.value = response.data.result.data.categories
        categoryGroups.value = response.data.result.data.grouped
        
        // Tambahkan 'mention' ke grup 'chat' jika belum ada
        if (categoryGroups.value.chat && !categoryGroups.value.chat.includes('mention')) {
          categoryGroups.value.chat.push('mention')
        }
      }
    } catch (error) {
      console.error('Error fetching notification categories:', error)
    }
  }
  
  const setActiveCategory = (category) => {
    activeCategory.value = category
    // Refresh notifications with new filter
    fetchNotifications(10, false)
  }

  const fetchUnreadCount = async () => {
    try {
      const response = await apiClient.post('/web/v2/team/notifications', {
        jsonrpc: '2.0',
        id: new Date().getTime(),
        params: {
          operation: 'get_unread_count'
        }
      })

      if (response.data.result?.status === 'success') {
        unreadCount.value = response.data.result.count
        return response.data.result.count
      }
      return 0
    } catch (error) {
      console.error('Error fetching unread count:', error)
      return 0
    }
  }
  
  const fetchMentionUnreadCount = async () => {
    try {
      const response = await apiClient.post('/web/v2/team/mentions', {
        jsonrpc: '2.0',
        id: new Date().getTime(),
        params: {
          operation: 'get_unread_count'
        }
      })

      if (response.data.result?.status === 'success') {
        mentionUnreadCount.value = response.data.result.count
        return response.data.result.count
      }
      return 0
    } catch (error) {
      console.error('Error fetching mention unread count:', error)
      return 0
    }
  }
  
  const markAsRead = async (id, isMention = false) => {
    try {
      if (isMention) {
        const response = await apiClient.post('/web/v2/team/mentions', {
          jsonrpc: '2.0',
          id: new Date().getTime(),
          params: {
            operation: 'mark_read',
            mention_id: id
          }
        })

        if (response.data.result?.status === 'success') {
          // Update local state
          const mention = mentions.value.find(m => m.id === id)
          if (mention) {
            mention.is_read = true
          }
          
          if (response.data.result.unread_count !== undefined) {
            mentionUnreadCount.value = response.data.result.unread_count
          } else {
            await fetchMentionUnreadCount()
          }
          return true
        }
      } else {
        const response = await apiClient.post('/web/v2/team/notifications', {
          jsonrpc: '2.0',
          id: new Date().getTime(),
          params: {
            operation: 'mark_read',
            notification_id: id
          }
        })

        if (response.data.result?.status === 'success') {
          // Update local state
          const notification = notifications.value.find(n => n.id === id)
          if (notification) {
            notification.is_read = true
          }
          
          if (response.data.result.unread_count !== undefined) {
            unreadCount.value = response.data.result.unread_count
          } else {
            await fetchUnreadCount()
          }
          return true
        }
      }
      return false
    } catch (error) {
      console.error(`Error marking ${isMention ? 'mention' : 'notification'} as read:`, error)
      return false
    }
  }
  
  const markAllAsRead = async () => {
    try {
      const response = await apiClient.post('/web/v2/team/notifications', {
        jsonrpc: '2.0',
        id: new Date().getTime(),
        params: {
          operation: 'mark_all_read'
        }
      })

      if (response.data.result?.status === 'success') {
        // Update local state
        notifications.value.forEach(notification => {
          notification.is_read = true
        })
        unreadCount.value = 0
        return true
      }
      return false
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
      return false
    }
  }
  
  const markAllMentionsAsRead = async () => {
    try {
      const response = await apiClient.post('/web/v2/team/mentions', {
        jsonrpc: '2.0',
        id: new Date().getTime(),
        params: {
          operation: 'mark_all_read'
        }
      })

      if (response.data.result?.status === 'success') {
        // Update local state
        mentions.value.forEach(mention => {
          mention.is_read = true
        })
        mentionUnreadCount.value = 0
        return true
      }
      return false
    } catch (error) {
      console.error('Error marking all mentions as read:', error)
      return false
    }
  }

  // Modifikasi fungsi checkNewNotifications
  const checkNewNotifications = async () => {
    const previousUnreadCount = unreadCount.value + mentionUnreadCount.value
    
    // Fetch unread counts
    await Promise.all([
      fetchUnreadCount(),
      fetchMentionUnreadCount()
    ])
    
    const currentUnreadCount = unreadCount.value + mentionUnreadCount.value
    
    // Jika ada notifikasi baru
    if (currentUnreadCount > previousUnreadCount) {
      // Tandai bahwa ada notifikasi baru untuk ditampilkan toast
      newNotificationsReceived.value = true
      
      // Opsional: Fetch notifikasi terbaru untuk detail tambahan
      const newNotifications = await fetchNotifications(5, true)
      const newMentions = await fetchMentions(5)
      
      return {
        hasNewNotifications: true,
        newCount: currentUnreadCount - previousUnreadCount,
        latestNotifications: [...newNotifications, ...newMentions]
      }
    }
    
    return { hasNewNotifications: false }
  }

  // Tambahkan fungsi untuk mereset flag notifikasi baru setelah toast ditampilkan
  const resetNewNotificationsFlag = () => {
    newNotificationsReceived.value = false
    lastCheckedTime.value = new Date().getTime()
  }

  
  const startPolling = () => {
    if (isPolling.value) return
    
    isPolling.value = true
    pollingInterval.value = setInterval(async () => {
      await Promise.all([
        fetchUnreadCount(),
        fetchMentionUnreadCount()
      ])
    }, 30000) // Poll every 30 seconds
  }
  
  const stopPolling = () => {
    if (pollingInterval.value) {
      clearInterval(pollingInterval.value)
      pollingInterval.value = null
    }
    isPolling.value = false
  }
  
  const initialize = async () => {
    await fetchCategories()
    await Promise.all([
      fetchUnreadCount(),
      fetchMentionUnreadCount()
    ])
    await fetchCombinedData(10, false)
    isInitialized.value = true
    startPolling()
  }
  
  return {
    // State
    notifications,
    mentions,
    unreadCount,
    mentionUnreadCount,
    isPolling,
    activeCategory,
    availableCategories,
    categoryGroups,
    isInitialized,
    newNotificationsReceived,
    
    // Computed
    hasUnread,
    filteredNotifications,
    combinedNotifications,
    filteredCombinedNotifications,
    
    // Actions
    fetchNotifications,
    fetchMentions,
    fetchCombinedData,
    fetchUnreadCount,
    fetchMentionUnreadCount,
    markAsRead,
    markAllAsRead,
    markAllMentionsAsRead,
    startPolling,
    stopPolling,
    setActiveCategory,
    initialize,
    checkNewNotifications,
    resetNewNotificationsFlag
  }
})