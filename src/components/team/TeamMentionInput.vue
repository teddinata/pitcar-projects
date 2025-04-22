<!-- src/components/TeamMentionInput.vue -->
<template>
  <div class="mention-input-container w-full relative">
    <!-- Simple formatting toolbar -->
    <div class="flex items-center gap-1 px-2 py-1 bg-gray-50 border border-gray-300 border-b-0 rounded-t-md">
      <button 
        @click="applyFormat('bold')" 
        type="button"
        class="p-1 rounded hover:bg-gray-200 text-gray-700"
        title="Bold (Ctrl+B)"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>
          <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>
        </svg>
      </button>
      <button 
        @click="applyFormat('italic')" 
        type="button"
        class="p-1 rounded hover:bg-gray-200 text-gray-700"
        title="Italic (Ctrl+I)"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="19" y1="4" x2="10" y2="4"></line>
          <line x1="14" y1="20" x2="5" y2="20"></line>
          <line x1="15" y1="4" x2="9" y2="20"></line>
        </svg>
      </button>
      <button 
        @click="applyFormat('underline')" 
        type="button"
        class="p-1 rounded hover:bg-gray-200 text-gray-700"
        title="Underline (Ctrl+U)"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3"></path>
          <line x1="4" y1="21" x2="20" y2="21"></line>
        </svg>
      </button>
      <span class="h-4 border-l border-gray-300 mx-1"></span>
      <button 
        @click="applyFormat('list')" 
        type="button"
        class="p-1 rounded hover:bg-gray-200 text-gray-700"
        title="Numbered List"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="9" y1="6" x2="20" y2="6"></line>
          <line x1="9" y1="12" x2="20" y2="12"></line>
          <line x1="9" y1="18" x2="20" y2="18"></line>
          <line x1="3" y1="6" x2="3.01" y2="6"></line>
          <line x1="3" y1="12" x2="3.01" y2="12"></line>
          <line x1="3" y1="18" x2="3.01" y2="18"></line>
        </svg>
      </button>
      <button 
        @click="applyFormat('link')" 
        type="button"
        class="p-1 rounded hover:bg-gray-200 text-gray-700"
        title="Add Link"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
        </svg>
      </button>
      <span class="text-xs text-gray-500 ml-2">Format with **bold**, *italic*, or __underline__</span>
    </div>
    
    <!-- Existing textarea with rounded-top removed -->
    <textarea 
      ref="textareaRef"
      v-model="text" 
      class="block w-full rounded-b-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm resize-none py-2 px-3"
      :placeholder="placeholder"
      @input="handleInput"
      @keydown="handleKeyDown"
      rows="1"
    ></textarea>
    
    <!-- Dropdown untuk mention suggestions -->
    <div v-if="showSuggestions && filteredMembers.length > 0"
         class="mention-suggestions fixed w-64 rounded-lg bg-white shadow-xl overflow-auto border border-red-100"
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
    
    <!-- Link modal -->
    <div v-if="showLinkModal" class="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-lg p-4 w-80 link-modal">
        <h3 class="text-lg font-medium mb-3">Add Link</h3>
        <input 
          v-model="linkUrl" 
          type="text" 
          placeholder="https://example.com" 
          class="w-full border border-gray-300 rounded-md shadow-sm p-2 mb-3 focus:border-red-500 focus:ring-red-500"
          @keydown.enter="insertLink"
        >
        <div class="flex justify-end space-x-2">
          <button 
            @click="showLinkModal = false" 
            class="px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-700"
          >
            Cancel
          </button>
          <button 
            @click="insertLink" 
            class="px-3 py-1.5 bg-red-600 border border-transparent rounded-md text-sm text-white"
          >
            Insert
          </button>
        </div>
      </div>
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

// New state for formatting
const showLinkModal = ref(false)
const linkUrl = ref('')
const selectedText = ref({ start: 0, end: 0, text: '' })

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

// Apply formatting based on button click
const applyFormat = (type) => {
  if (!textareaRef.value) return
  
  const textarea = textareaRef.value
  const selStart = textarea.selectionStart
  const selEnd = textarea.selectionEnd
  const selText = textarea.value.substring(selStart, selEnd)
  
  let prefix = ''
  let suffix = ''
  let replacement = selText
  
  switch (type) {
    case 'bold':
      prefix = '**'
      suffix = '**'
      break
    case 'italic':
      prefix = '*'
      suffix = '*'
      break
    case 'underline':
      prefix = '__'
      suffix = '__'
      break
    case 'list':
      // For list, add "1. " at the beginning of each line
      if (selText) {
        const lines = selText.split('\n')
        replacement = lines.map((line, i) => `${i + 1}. ${line}`).join('\n')
      } else {
        replacement = '1. '
      }
      break
    case 'link':
      // For link, save selection and show modal
      selectedText.value = {
        start: selStart,
        end: selEnd,
        text: selText
      }
      showLinkModal.value = true
      return
  }
  
  // Update text with formatting
  const newText = text.value.substring(0, selStart) + 
                 prefix + replacement + suffix + 
                 text.value.substring(selEnd)
  
  text.value = newText
  
  // Focus back on textarea and set cursor position after formatting
  nextTick(() => {
    textarea.focus()
    
    // Set cursor position after the inserted text (including formatting)
    const newCursorPos = selStart + prefix.length + replacement.length + suffix.length
    textarea.setSelectionRange(newCursorPos, newCursorPos)
  })
}

// Insert link when confirmed from modal
const insertLink = () => {
  if (!linkUrl.value) {
    showLinkModal.value = false
    return
  }
  
  const { start, end, text: selText } = selectedText.value
  const linkText = selText || linkUrl.value
  const formattedLink = `[${linkText}](${linkUrl.value})`
  
  const newText = text.value.substring(0, start) + 
                 formattedLink + 
                 text.value.substring(end)
  
  text.value = newText
  showLinkModal.value = false
  linkUrl.value = ''
  
  // Focus back on textarea
  nextTick(() => {
    textareaRef.value.focus()
  })
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
  // Handle keyboard shortcuts for formatting
  if (e.ctrlKey || e.metaKey) {
    if (e.key === 'b') {
      e.preventDefault()
      applyFormat('bold')
      return
    } else if (e.key === 'i') {
      e.preventDefault()
      applyFormat('italic')
      return
    } else if (e.key === 'u') {
      e.preventDefault()
      applyFormat('underline')
      return
    }
  }
  
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

// Close dropdown and modals when clicking outside
const handleClickOutside = (event) => {
  if (showLinkModal.value && !event.target.closest('.link-modal')) {
    showLinkModal.value = false
  }
  
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

// Tambahkan ini ke dalam script di TeamMentionInput.vue
const insertText = (insertedText) => {
  if (!textareaRef.value) return;
  
  const textarea = textareaRef.value;
  const cursorPos = textarea.selectionStart;
  
  // Insert text pada posisi kursor
  const newText = text.value.substring(0, cursorPos) + insertedText + text.value.substring(cursorPos);
  text.value = newText;
  
  // Fokus kembali ke textarea
  nextTick(() => {
    textarea.focus();
    textarea.setSelectionRange(cursorPos + insertedText.length, cursorPos + insertedText.length);
  });
};

// Tambahkan ke defineExpose
defineExpose({
  extractMentions,
  textareaRef,
  focus: () => {
    textareaRef.value?.focus();
  },
  text,
  insertText // Ekspos metode insertText
});
</script>

<style scoped>
.mention-input-container textarea {
  min-height: 140px;
  transition: height 0.1s ease;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}

.mention-suggestions {
  z-index: 100;
  max-height: 250px;
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