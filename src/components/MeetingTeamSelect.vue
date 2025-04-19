<!-- src/components/MeetingTeamSelect.vue -->
<template>
  <div class="space-y-2" @click.stop>
    <!-- Search & Multi-select Input -->
    <div class="relative">
      <div 
        class="min-h-[42px] w-full rounded-lg border focus:outline-none bg-white px-3 py-2 shadow-sm  cursor-pointer"
        :class="{ 'border-red-500 ring-1 ring-red-500': isOpen, 'bg-gray-50': disabled }"
        @click.stop="!disabled && (isOpen = true)"
      >
        <!-- Selected Items Display -->
        <div class="flex flex-wrap gap-2">
          <template v-if="multiple">
            <!-- Multiple Selection Mode -->
            <div 
              v-for="member in selectedMembers" 
              :key="member.id"
              class="inline-flex items-center bg-red-50 rounded-full pl-2 pr-1 py-1"
            >
              <span class="text-sm text-red-700">{{ member.name }}</span>
              <button
                v-if="!disabled"
                @click.stop="removeMember(member)"
                @mousedown.stop.prevent
                class="ml-1 rounded-full p-1 hover:bg-red-100"
                type="button"
              >
                <X class="w-3 h-3 text-red-500" />
              </button>
            </div>
          </template>
          <template v-else>
            <!-- Single Selection Mode -->
            <div 
              v-if="selectedMembers.length > 0" 
              class="inline-flex items-center bg-red-50 rounded-full pl-2 pr-1 py-1"
            >
              <span class="text-sm text-red-700">{{ selectedMembers[0].name }}</span>
              <button
                v-if="!disabled"
                @click.stop="removeMember(selectedMembers[0])"
                @mousedown.stop.prevent
                class="ml-1 rounded-full p-1 hover:bg-red-100"
                type="button"
              >
                <X class="w-3 h-3 text-red-500" />
              </button>
            </div>
          </template>
          
          <!-- Search Input -->
          <input
            v-if="!disabled && (multiple || selectedMembers.length === 0)"
            v-model="searchQuery"
            @focus="isOpen = true"
            @blur="handleBlur"
            @click.stop
            type="text"
            class="flex-1 min-w-[120px] border-0 p-0 focus:ring-0 text-sm bg-transparent focus:outline-none"
            :placeholder="inputPlaceholder"
          />
        </div>
      </div>

      <!-- Dropdown Menu -->
      <div 
        v-if="isOpen && !disabled"
        class="absolute z-50 mt-1 w-full rounded-md bg-white shadow-lg"
        @click.stop
      >
        <div class="max-h-60 overflow-auto py-1">
          <!-- Loading State -->
          <div 
            v-if="loading"
            class="px-4 py-2 text-sm text-gray-500 text-center"
          >
            <Loader2 class="w-4 h-4 animate-spin mx-auto" />
            <span class="mt-1">Loading...</span>
          </div>

          <!-- No Results -->
          <div 
            v-else-if="filteredMembers.length === 0"
            class="px-4 py-2 text-sm text-gray-500 text-center"
          >
            No members found
          </div>

          <!-- Members List -->
          <div 
            v-else
            class="space-y-1"
          >
            <button
              v-for="member in filteredMembers"
              :key="member.id"
              @mousedown.stop.prevent="toggleMember(member)"
              @click.stop
              type="button"
              class="w-full px-4 py-2 text-sm text-left hover:bg-gray-100 flex items-center justify-between"
              :class="{ 'bg-red-50': isSelected(member) }"
            >
              <div class="flex items-center space-x-3">
                <div class="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <span class="text-sm font-medium text-gray-600">
                    {{ getInitials(member.name) }}
                  </span>
                </div>
                <div class="flex flex-col">
                  <span class="font-medium text-gray-900">{{ member.name }}</span>
                  <span class="text-xs text-gray-500">{{ member.position?.name || 'Team Member' }}</span>
                </div>
              </div>
              <Check 
                v-if="isSelected(member)"
                class="w-4 h-4 text-red-600" 
              />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Selected Count -->
    <div v-if="multiple && !disabled" class="flex justify-between text-sm">
      <span class="text-gray-500">
        {{ selectedMembers.length }} member{{ selectedMembers.length !== 1 ? 's' : '' }} selected
      </span>
      <button
        v-if="selectedMembers.length > 0"
        @click.stop="clearSelection"
        type="button"
        class="text-red-600 hover:text-red-700"
      >
        Clear all
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { Check, X, Loader2 } from 'lucide-vue-next'
import apiClient from '@/config/api'

const props = defineProps({
  modelValue: {
    type: [Array, Number, null],
    default: () => []
  },
  multiple: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  placeholder: {
    type: String,
    default: 'Search team members...'
  }
})

const emit = defineEmits(['update:modelValue'])

// State
const isOpen = ref(false)
const loading = ref(false)
const searchQuery = ref('')
const members = ref([])
const selectedMembers = ref([])

// Computed
const inputPlaceholder = computed(() => {
  if ((!props.multiple && selectedMembers.value.length > 0) || props.disabled) {
    return ''
  }
  return props.placeholder
})

// Filtered members based on search
const filteredMembers = computed(() => {
  const query = searchQuery.value.toLowerCase()
  return members.value.filter(member => {
    const nameMatch = member.name.toLowerCase().includes(query)
    // Don't show already selected members in single select mode
    if (!props.multiple && isSelected(member)) {
      return false
    }
    return nameMatch
  })
})

// Fetch team members
const fetchMembers = async () => {
  try {
    loading.value = true
    const response = await apiClient.post('/web/employees', {
      jsonrpc: '2.0',
      method: 'call',
      params: {
        // department_id: 9,
        limit: 50,
        include_details: true, // Request additional details if needed
        sort_by: 'name',
        sort_order: 'asc'
      }
    })
    
    if (response.data.result?.status === 'success') {
      members.value = response.data.result.data.rows
      console.log('Fetched members:', members.value) // For debugging
      initializeSelection()
    }
  } catch (error) {
    console.error('Error fetching team members:', error)
  } finally {
    loading.value = false
  }
}

// Initialize selection based on modelValue
const initializeSelection = () => {
  console.log('Initializing selection with modelValue:', props.modelValue) // For debugging
  if (props.multiple) {
    const modelArray = Array.isArray(props.modelValue) ? props.modelValue : []
    selectedMembers.value = members.value.filter(m => modelArray.includes(m.id))
  } else {
    const member = members.value.find(m => m.id === props.modelValue)
    selectedMembers.value = member ? [member] : []
  }
  console.log('Selected members after init:', selectedMembers.value) // For debugging
}

// Check if member is selected
const isSelected = (member) => {
  return selectedMembers.value.some(m => m.id === member.id)
}

// Toggle member selection
const toggleMember = (member) => {
  if (props.disabled) return

  if (props.multiple) {
    if (isSelected(member)) {
      selectedMembers.value = selectedMembers.value.filter(m => m.id !== member.id)
    } else {
      selectedMembers.value.push(member)
    }
    emit('update:modelValue', selectedMembers.value.map(m => m.id))
  } else {
    selectedMembers.value = [member]
    emit('update:modelValue', member.id)
    isOpen.value = false
  }
  searchQuery.value = ''
}

// Remove member
const removeMember = (member) => {
  if (props.disabled) return
  
  selectedMembers.value = selectedMembers.value.filter(m => m.id !== member.id)
  emit('update:modelValue', props.multiple ? selectedMembers.value.map(m => m.id) : null)
}

// Clear selection
const clearSelection = () => {
  if (props.disabled) return
  
  selectedMembers.value = []
  emit('update:modelValue', props.multiple ? [] : null)
}

// Handle blur event with delay to allow for mousedown
const handleBlur = () => {
  setTimeout(() => {
    isOpen.value = false
    searchQuery.value = ''
  }, 200)
}

// Get initials from name
const getInitials = (name) => {
  if (!name) return ''
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
}

// Watch for external value changes
watch(() => props.modelValue, (newVal) => {
  console.log('modelValue changed:', newVal) // For debugging
  initializeSelection()
}, { deep: true })

// Initialize
onMounted(() => {
  fetchMembers()
})
</script>

<style scoped>
.max-h-60 {
  max-height: 15rem;
}
</style>