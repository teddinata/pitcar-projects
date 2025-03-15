<!-- src/components/shared/ActivityLog.vue -->
<template>
  <div class="space-y-4">
    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center py-8">
      <Loader2 class="w-6 h-6 animate-spin text-gray-400" />
    </div>

    <!-- Empty state -->
    <div v-else-if="!logs.length" class="text-center py-8">
      <Clock class="mx-auto h-12 w-12 text-gray-400" />
      <h3 class="mt-2 text-sm font-medium text-gray-900">No activity yet</h3>
      <p class="mt-1 text-sm text-gray-500">Activity logs will appear here</p>
    </div>

    <!-- Logs list -->
    <div v-else class="space-y-4">
      <div 
        v-for="log in logs" 
        :key="log.id" 
        class="bg-white rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors"
      >
        <!-- Header -->
        <div class="flex items-start justify-between mb-3">
          <div class="flex items-center space-x-3">
            <div class="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
              <UserCircle class="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <div class="font-medium text-gray-900">
                {{ log.author?.name || 'System' }}
              </div>
              <div class="text-xs text-gray-500">
                {{ log.author?.email }}
              </div>
            </div>
          </div>
          <time class="text-sm text-gray-500">
            {{ formatDate(log.date) }}
          </time>
        </div>

        <!-- Message content -->
        <div class="prose prose-sm max-w-none text-gray-600" v-html="log.message"></div>

        <!-- Tracking values -->
        <div v-if="log.tracking_values?.length" class="mt-3 pt-3 border-t">
          <div v-for="(change, idx) in log.tracking_values" :key="idx" 
               class="flex items-center space-x-2 text-sm py-1">
            <span class="font-medium text-gray-700">{{ change.field }}:</span>
            <span class="line-through text-red-600">{{ change.old_value || '-' }}</span>
            <ArrowRight class="w-4 h-4 text-gray-400" />
            <span class="text-green-600">{{ change.new_value || '-' }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Loader2, UserCircle, ArrowRight, Clock } from 'lucide-vue-next'
import { format } from 'date-fns'
import apiClient from '@/config/api'

const props = defineProps({
  type: {
    type: String,
    required: true,
    validator: value => ['task', 'project'].includes(value)
  },
  id: {
    type: [Number, String],
    required: true
  }
})

const logs = ref([])
const loading = ref(false)

const fetchLogs = async () => {
  try {
    loading.value = true
    const endpoint = props.type === 'task' 
      ? '/web/v2/content/tasks/logs'
      : '/web/v2/content/projects/logs'
      
    const response = await apiClient.post(endpoint, {
      jsonrpc: '2.0',
      method: 'call',
      params: {
        [`${props.type}_id`]: props.id
      }
    })

    if (response.data.result?.status === 'success') {
      logs.value = response.data.result.data
    } else {
      console.error('Error fetching logs:', response.data.result?.message)
    }
  } catch (error) {
    console.error(`Error fetching ${props.type} logs:`, error)
  } finally {
    loading.value = false
  }
}

const formatDate = (date) => {
  try {
    return format(new Date(date), 'MMM d, yyyy HH:mm')
  } catch {
    return date
  }
}

onMounted(fetchLogs)
</script>