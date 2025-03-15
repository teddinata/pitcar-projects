<!-- src/components/TeamMentionInput.vue -->
<template>
  <div class="mention-input-container w-full relative">
    <textarea 
      ref="textareaRef"
      v-model="text" 
      class="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm resize-none py-2 px-3"
      :placeholder="placeholder"
      @input="handleInput"
      @keydown="handleKeyDown"
      rows="1"
    ></textarea>
    
    <!-- Dropdown untuk mention suggestions -->
    <div v-if="showSuggestions && filteredMembers.length > 0"
         class="mention-suggestions fixed w-64 rounded-lg bg-white shadow-xl  overflow-auto border border-red-100"
         :style="dropdownStyle">
      <div v-if="loading" class="flex justify-center items-center py-3">
        <div class="animate-spin rounded-full h-4 w-4 border-2 border-red-600 border-t-transparent"></div>
        <span class="ml-2 text-sm text-gray-600">Loading...</span>
      </div>
      <ul v-else class="py-1">
        <li v-for="(member, index) in filteredMembers" 
            :key="member.id" 
            @click="selectMention(member)"
            :class="[
              'px-3 py-2 text-sm text-gray-800 hover:bg-red-50 hover:text-red-700 cursor-pointer transition-colors duration-150',
              activeIndex === index ? 'bg-red-50 text-red-700' : ''
            ]"
        >
          <div class="flex items-center">
            <!-- Avatar dengan warna berdasarkan peran -->
            <div :class="[
              'h-7 w-7 rounded-full flex-shrink-0 flex items-center justify-center mr-3',
              member.job_title === 'Project Manager' ? 'bg-red-100 text-red-600' :
              member.job_title === 'Stakeholder' ? 'bg-blue-100 text-blue-600' :
              'bg-gray-100 text-gray-600'
            ]">
              <span class="text-sm font-medium">
                {{ getInitials(member.name) }}
              </span>
            </div>
            <!-- Nama saja, tanpa jabatan -->
            <div class="font-medium">
              {{ member.name }}
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed, nextTick, onMounted, onUnmounted } from 'vue'
import apiClient from '@/config/api'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  members: {
    type: Array,
    default: () => []
  },
  placeholder: {
    type: String,
    default: 'Type @ to mention someone...'
  }
})

const emit = defineEmits(['update:modelValue', 'submit'])

const text = ref(props.modelValue)
const textareaRef = ref(null)
const mentionState = ref({
  active: false,
  startIndex: -1,
  query: ''
})
const showSuggestions = ref(false)
const activeIndex = ref(0)
const filteredMembers = ref([])
const loading = ref(false)
const recentlyFetched = ref({})
const dropdownStyle = ref({
  top: '0px',
  left: '0px'
})

// Calculate dropdown position based on cursor position
const updateDropdownPosition = () => {
  if (!textareaRef.value || !mentionState.value.active) return

  const textarea = textareaRef.value
  const cursorPosition = textarea.selectionStart

  // Create a mirror element to calculate position
  const mirror = document.createElement('div')
  mirror.style.position = 'absolute'
  mirror.style.top = '0'
  mirror.style.left = '0'
  mirror.style.visibility = 'hidden'
  mirror.style.whiteSpace = 'pre-wrap'
  mirror.style.width = getComputedStyle(textarea).width
  mirror.style.padding = getComputedStyle(textarea).padding
  mirror.style.fontFamily = getComputedStyle(textarea).fontFamily
  mirror.style.fontSize = getComputedStyle(textarea).fontSize
  mirror.style.lineHeight = getComputedStyle(textarea).lineHeight

  // Text content up to cursor
  mirror.textContent = textarea.value.substring(0, cursorPosition)
  
  // Append a span at cursor position to get its coordinates
  const span = document.createElement('span')
  span.textContent = '|'
  mirror.appendChild(span)
  
  document.body.appendChild(mirror)
  
  // Get the position
  const rect = textarea.getBoundingClientRect()
  const spanRect = span.getBoundingClientRect()
  
  // Adjust for scrolling
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop
  const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft
  
  // Calculate position
  let top = rect.top + spanRect.top - mirror.getBoundingClientRect().top + span.offsetHeight + scrollTop
  let left = rect.left + scrollLeft
  
  // Check if dropdown would go off screen bottom
  const dropdownHeight = 300 // approximate max height
  const viewportHeight = window.innerHeight
  
  if (top + dropdownHeight > viewportHeight) {
    // Position above the textarea instead
    top = rect.top + scrollTop - dropdownHeight
    if (top < 0) top = 10 // If still off screen, just put it at the top
  }
  
  // Check if dropdown would go off screen right
  const dropdownWidth = 240 // width of dropdown (60 * 4)
  const viewportWidth = window.innerWidth
  
  if (left + dropdownWidth > viewportWidth) {
    left = viewportWidth - dropdownWidth - 10
  }
  
  // Update the style
  dropdownStyle.value = {
    top: `${top}px`,
    left: `${left}px`
  }
  
  // Clean up
  document.body.removeChild(mirror)
}

// Watch untuk sync dengan v-model
watch(() => props.modelValue, (newValue) => {
  if (newValue !== text.value) {
    text.value = newValue
  }
})

watch(text, (newValue) => {
  emit('update:modelValue', newValue)
  nextTick(() => {
    resizeTextarea()
    if (mentionState.value.active) {
      updateDropdownPosition()
    }
  })
})

// Watch untuk reset activeIndex saat suggestions berubah
watch(filteredMembers, () => {
  activeIndex.value = 0
})

// Watch for when suggestions appear or disappear
watch(showSuggestions, (newValue) => {
  if (newValue) {
    nextTick(() => {
      updateDropdownPosition()
    })
  }
})

const getInitials = (name) => {
  if (!name) return ''
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
}

// Fungsi untuk mencari karyawan dari API
const searchEmployees = async (query) => {
  // Jika query terlalu pendek atau sama dengan yang baru saja dicari, lewati
  if (!query || query.length < 2 || recentlyFetched.value[query]) {
    return recentlyFetched.value[query] || []
  }

  loading.value = true

  try {
    const response = await apiClient.post('/web/employees', {
      jsonrpc: '2.0',
      id: new Date().getTime(),
      params: {
        search: query,
        limit: 5,
        page: 1
      }
    })

    if (response.data.result?.status === 'success') {
      const employees = response.data.result.data.rows || []
      // Cache hasil pencarian
      recentlyFetched.value[query] = employees
      return employees
    }
    
    return []
  } catch (error) {
    console.error('Error searching employees:', error)
    return []
  } finally {
    loading.value = false
  }
}

// Fungsi debounce untuk menunda pencarian
const debounce = (fn, delay) => {
  let timeout
  return function(...args) {
    clearTimeout(timeout)
    timeout = setTimeout(() => fn.apply(this, args), delay)
  }
}

// Debounced search function
const debouncedSearch = debounce(async (query) => {
  if (query.length >= 2) {
    const results = await searchEmployees(query)
    filteredMembers.value = results
    // Update dropdown position after getting results
    nextTick(() => {
      updateDropdownPosition()
    })
  } else {
    filteredMembers.value = []
  }
}, 300)

// Fungsi untuk deteksi mention
const handleInput = () => {
  const currentText = text.value
  const cursorPos = textareaRef.value.selectionStart
  
  // Cek apakah sedang mengetik mention
  if (mentionState.value.active) {
    // Update query untuk mention
    const queryText = currentText.substring(mentionState.value.startIndex + 1, cursorPos)
    mentionState.value.query = queryText
    
    // Toggle suggestion dropdown dan mulai search jika query cukup panjang
    showSuggestions.value = queryText.length > 0
    debouncedSearch(queryText)
  } else {
    // Cek apakah baru mulai mention
    if (cursorPos > 0 && currentText[cursorPos - 1] === '@') {
      mentionState.value = {
        active: true,
        startIndex: cursorPos - 1,
        query: ''
      }
      showSuggestions.value = true
      filteredMembers.value = []
      updateDropdownPosition()
    }
  }
  
  // Cek jika user sudah tidak dalam mode mention
  if (mentionState.value.active) {
    // Cek jika ada spasi atau sudah pindah position
    const textAfterStart = currentText.substring(mentionState.value.startIndex)
    if (textAfterStart.includes(' ') || cursorPos <= mentionState.value.startIndex) {
      resetMentionState()
    }
  }
}

const handleKeyDown = (e) => {
  // Handle Enter key untuk submit
  if (e.key === 'Enter' && !e.shiftKey) {
    if (showSuggestions.value && filteredMembers.value.length > 0) {
      e.preventDefault()
      selectMention(filteredMembers.value[activeIndex.value])
    } else {
      e.preventDefault()
      emit('submit')
    }
    return
  }
  
  // Navigasi dropdown dengan tombol panah
  if (showSuggestions.value && filteredMembers.value.length > 0) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      activeIndex.value = (activeIndex.value + 1) % filteredMembers.value.length
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      activeIndex.value = (activeIndex.value - 1 + filteredMembers.value.length) % filteredMembers.value.length
    } else if (e.key === 'Tab') {
      e.preventDefault()
      selectMention(filteredMembers.value[activeIndex.value])
    } else if (e.key === 'Escape') {
      e.preventDefault()
      resetMentionState()
    }
  }
}

const selectMention = (member) => {
  const beforeMention = text.value.substring(0, mentionState.value.startIndex)
  const afterQuery = text.value.substring(textareaRef.value.selectionStart)
  
  // Format mention dengan format @[user_id:name]
  const mentionText = `@[${member.id}:${member.name}] `
  
  text.value = beforeMention + mentionText + afterQuery
  
  // Reset mention state
  resetMentionState()
  
  // Set cursor position after mention
  nextTick(() => {
    const newPosition = beforeMention.length + mentionText.length
    textareaRef.value.focus()
    textareaRef.value.setSelectionRange(newPosition, newPosition)
    resizeTextarea()
  })
}

const resetMentionState = () => {
  mentionState.value = {
    active: false,
    startIndex: -1,
    query: ''
  }
  showSuggestions.value = false
  activeIndex.value = 0
}

// Auto-resize textarea
const resizeTextarea = () => {
  if (!textareaRef.value) return
  
  // First reset height to auto to get the correct scrollHeight
  textareaRef.value.style.height = 'auto'
  
  // Set the height to scrollHeight + small buffer for better UX
  const newHeight = textareaRef.value.scrollHeight
  textareaRef.value.style.height = `${newHeight}px`
}

// Helper untuk ekstrak mentions dari text
const extractMentions = (text) => {
  const mentions = []
  const regex = /@\[(\d+):([^\]]+)\]/g
  let match
  
  // Extract all mentions from text
  while ((match = regex.exec(text)) !== null) {
    mentions.push({
      id: parseInt(match[1]),
      name: match[2]
    })
  }
  
  return mentions
}

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
  if (textareaRef.value && !textareaRef.value.contains(event.target)) {
    resetMentionState()
  }
}

// Focus pada textarea saat mounted dan setup event listeners
onMounted(() => {
  resizeTextarea()
  document.addEventListener('click', handleClickOutside)
  window.addEventListener('resize', updateDropdownPosition)
  window.addEventListener('scroll', updateDropdownPosition)
})

// Clean up event listeners
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  window.removeEventListener('resize', updateDropdownPosition)
  window.removeEventListener('scroll', updateDropdownPosition)
})

// Expose functions that might be useful
defineExpose({
  extractMentions,
  focus: () => {
    textareaRef.value?.focus()
  }
})
</script>

<style scoped>
.mention-input-container textarea {
  min-height: 140px;
  transition: height 0.1s ease;
}

.mention-suggestions {
  border-radius: 8px;
  margin-top: 20px;
}

.mention-suggestions ul {
  margin: 0;
  padding: 0;
}

.mention-suggestions li {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #f7f7f7;
}

.mention-suggestions li:last-child {
  border-bottom: none;
}
</style>