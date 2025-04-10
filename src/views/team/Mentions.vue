<!-- views/team/Mentions.vue -->
<template>
  <div class="min-h-screen bg-gray-50">
    <div class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center justify-between">
          <h1 class="text-xl font-semibold text-gray-900">
            Mention
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
              class="rounded-md border-gray-300 text-sm focus:ring-yellow-500 focus:border-yellow-500"
            >
              <option value="all">Semua mention</option>
              <option value="unread">Belum dibaca</option>
              <option value="read">Sudah dibaca</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div v-if="loading" class="flex justify-center py-12">
        <Loader2 class="w-8 h-8 text-yellow-500 animate-spin" />
      </div>
      
      <div v-else-if="displayedMentions.length === 0" class="bg-white rounded-lg shadow p-8 text-center">
        <AtSign class="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 mb-1">Tidak ada mention</h3>
        <p class="text-gray-500 mb-6">Tidak ada mention yang sesuai dengan filter Anda.</p>
        <button 
          @click="resetFilters" 
          class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 rounded-md"
        >
          Reset Filter
        </button>
      </div>
      
      <div v-else>
        <ul role="list" class="bg-white shadow overflow-hidden sm:rounded-md divide-y divide-gray-200">
          <li 
            v-for="mention in displayedMentions" 
            :key="mention.id"
            :class="{ 'bg-gray-50': mention.is_read }"
            class="relative hover:bg-gray-100 transition-colors duration-150"
          >
            <div class="flex items-start px-4 py-4 sm:px-6">
              <!-- Icon -->
              <div class="flex-shrink-0 mr-4">
                <div class="p-2 rounded-full bg-yellow-500">
                  <AtSign class="w-5 h-5 text-white" />
                </div>
              </div>
              
              <!-- Content -->
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between">
                  <p 
                    class="text-sm font-medium text-gray-900 flex items-center"
                    :class="{ 'font-normal': mention.is_read }"
                  >
                    {{ mention.mentioned_by.name }} menyebut Anda
                    <span 
                      v-if="!mention.is_read" 
                      class="ml-2 inline-block w-2 h-2 bg-yellow-500 rounded-full"
                    ></span>
                  </p>
                </div>
                
                <p class="mt-1 text-sm text-gray-600">
                  {{ mention.message.content_preview }}
                </p>
                
                <div class="mt-2 flex items-center text-xs text-gray-500">
                  <Calendar class="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                  <span>{{ formatDateTime(mention.create_date) }}</span>
                  
                  <div v-if="mention.group" class="mx-2 text-gray-300">|</div>
                  
                  <span v-if="mention.group" class="flex items-center">
                    <Users class="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                    {{ mention.group.name }}
                  </span>
                  
                  <div v-if="mention.project" class="mx-2 text-gray-300">|</div>
                  
                  <span v-if="mention.project" class="flex items-center">
                    <Briefcase class="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                    {{ mention.project.name }}
                  </span>
                </div>
              </div>
              
              <!-- Actions -->
              <div class="ml-4 flex-shrink-0 flex items-start space-x-2">
                <button 
                  v-if="!mention.is_read"
                  @click.stop="markAsRead(mention.id)"
                  class="text-gray-400 hover:text-gray-500"
                  title="Tandai sudah dibaca"
                >
                  <CheckCircle class="h-5 w-5" />
                </button>
                
                <button 
                  @click.stop="openMention(mention)"
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
  Loader2, CheckSquare, ChevronLeft, ChevronRight, 
  CheckCircle, AtSign, Calendar, ArrowRight, 
  Users, Briefcase 
} from 'lucide-vue-next'
import { useMentionStore } from '@/stores/mention'
import { useToast } from '@/composables/useToast'

const router = useRouter()
const mentionStore = useMentionStore()
const { toast, showToast } = useToast()

// State
const loading = ref(false)
const currentPage = ref(1)
const totalPages = ref(1)
const totalCount = ref(0)
const pageSize = ref(20)
const activeFilter = ref('all')

// Computed
const hasUnread = computed(() => 
  mentionStore.mentions.some(mention => !mention.is_read)
)

const displayedMentions = computed(() => {
  // Filter by read/unread
  let filtered = [...mentionStore.mentions]
  
  if (activeFilter.value === 'unread') {
    filtered = filtered.filter(m => !m.is_read)
  } else if (activeFilter.value === 'read') {
    filtered = filtered.filter(m => m.is_read)
  }
  
  return filtered
})

// Methods
const fetchMentions = async () => {
  loading.value = true
  
  try {
    // Fetch mentions with filters
    await mentionStore.fetchMentions(pageSize.value)
    
    // Update pagination info
    totalCount.value = displayedMentions.value.length
    totalPages.value = Math.ceil(totalCount.value / pageSize.value)
  } catch (error) {
    console.error('Error fetching mentions:', error)
    showToast({
      message: error.message || 'Gagal memuat mention',
      type: 'error'
    })
  } finally {
    loading.value = false
  }
}

const markAsRead = async (mentionId) => {
  try {
    await mentionStore.markAsRead(mentionId)
  } catch (error) {
    console.error('Error marking mention as read:', error)
    showToast({
      message: error.message || 'Gagal menandai mention sebagai dibaca',
      type: 'error'
    })
  }
}

const markAllAsRead = async () => {
  try {
    await mentionStore.markAllAsRead()
    showToast({
      message: 'Semua mention ditandai telah dibaca',
      type: 'success'
    })
  } catch (error) {
    console.error('Error marking all mentions as read:', error)
    showToast({
      message: error.message || 'Gagal menandai semua mention sebagai dibaca',
      type: 'error'
    })
  }
}

const openMention = (mention) => {
  // Mark as read if unread
  if (!mention.is_read) {
    markAsRead(mention.id)
  }
  
  // Navigate to the group chat
  if (mention.group?.id) {
    router.push(`/team/chat/${mention.group.id}`)
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    fetchMentions()
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    fetchMentions()
  }
}

const resetFilters = () => {
  activeFilter.value = 'all'
  currentPage.value = 1
  fetchMentions()
}

const formatDateTime = (dateStr) => {
  try {
    const date = new Date(dateStr)
    return format(date, 'PPp') // Format: 'Apr 29, 2021, 9:30 AM'
  } catch (e) {
    return dateStr
  }
}

// Watchers
watch([activeFilter], () => {
  currentPage.value = 1
  fetchMentions()
})

// Lifecycle
onMounted(async () => {
  // Initialize mention store
  await mentionStore.initialize()
  
  // Fetch initial data
  fetchMentions()
})
</script>