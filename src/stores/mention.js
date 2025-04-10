// stores/mention.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import apiClient from '@/config/api'

export const useMentionStore = defineStore('mention', () => {
  // State
  const mentions = ref([])
  const unreadCount = ref(0)
  const isPolling = ref(false)
  const pollingInterval = ref(null)
  const lastFetchTime = ref(new Date().getTime())
  
  // Computed
  const hasUnread = computed(() => unreadCount.value > 0)
  
  // Actions
  const fetchMentions = async (limit = 20) => {
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
        unreadCount.value = response.data.result.unread_count
        return response.data.result.data
      }
      return []
    } catch (error) {
      console.error('Error fetching mentions:', error)
      return []
    }
  }
  
  const fetchUnreadCount = async () => {
    try {
      const response = await apiClient.post('/web/v2/team/mentions', {
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
      console.error('Error fetching mention unread count:', error)
      return 0
    }
  }
  
  const markAsRead = async (mentionId) => {
    try {
      const response = await apiClient.post('/web/v2/team/mentions', {
        jsonrpc: '2.0',
        id: new Date().getTime(),
        params: {
          operation: 'mark_read',
          mention_id: mentionId
        }
      })

      if (response.data.result?.status === 'success') {
        // Update local state
        const mention = mentions.value.find(m => m.id === mentionId)
        if (mention) {
          mention.is_read = true
        }
        unreadCount.value = response.data.result.unread_count
        return true
      }
      return false
    } catch (error) {
      console.error('Error marking mention as read:', error)
      return false
    }
  }
  
  const markAllAsRead = async () => {
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
        unreadCount.value = 0
        return true
      }
      return false
    } catch (error) {
      console.error('Error marking all mentions as read:', error)
      return false
    }
  }
  
  const startPolling = () => {
    if (isPolling.value) return
    
    isPolling.value = true
    pollingInterval.value = setInterval(async () => {
      await fetchUnreadCount()
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
    await fetchMentions()
    startPolling()
  }
  
  return {
    // State
    mentions,
    unreadCount,
    isPolling,
    
    // Computed
    hasUnread,
    
    // Actions
    fetchMentions,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
    startPolling,
    stopPolling,
    initialize
  }
})