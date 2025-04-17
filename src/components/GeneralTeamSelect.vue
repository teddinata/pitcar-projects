<!-- src/components/TeamSelect.vue -->
<template>
  <div class="space-y-2" @click.stop>
    <!-- Search & Multi-select Input -->
    <div class="relative">
      <div 
        class="min-h-[42px] w-full rounded-lg border bg-white px-3 py-2 shadow-sm focus-within:border-red-500 focus-within:ring-1 focus-within:ring-red-500 cursor-pointer"
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
                class="ml-1 rounded-full p-1 hover:bg-red-100 focus:outline-none"
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
                  <div class="flex items-center">
                    <span class="text-xs text-gray-500">{{ member.position?.name || 'Team Member' }}</span>
                    <span v-if="member.department" class="text-xs text-gray-400 ml-2">({{ member.department }})</span>
                  </div>
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
  },
  departmentId: {
    type: [Number, null],
    default: null
  },
  // Tambahkan properti baru untuk mendukung multiple departments
  departmentIds: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue'])

// State
const isOpen = ref(false)
const loading = ref(false)
const searchQuery = ref('')
const members = ref([])
const selectedMembers = ref([])
let searchTimeout = null

// Computed untuk penentuan departmen yang digunakan
const effectiveDepartmentIds = computed(() => {
  // Prioritas departmentIds jika ada
  if (props.departmentIds && props.departmentIds.length > 0) {
    return props.departmentIds;
  }
  
  // Fallback ke departmentId single jika ada
  if (props.departmentId) {
    return [props.departmentId];
  }
  
  return [];
})

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

// Modifikasi pada watch searchQuery
watch(() => searchQuery.value, (newValue, oldValue) => {
  if (newValue !== oldValue) {
    // Tambahkan debounce (jeda) untuk menghindari terlalu banyak request
    if (searchTimeout) clearTimeout(searchTimeout)
    searchTimeout = setTimeout(() => {
      fetchMembers(newValue)
    }, 300) // tunggu 300ms setelah pengguna berhenti mengetik
  }
}, { immediate: false })

// Modifikasi fetchMembers untuk mendukung department_ids
// Fetch team members
// Modify fetchMembers to use multi-dept endpoint
// Modify fetchMembers to use multi-dept endpoint with proper filtering
// Tambahkan ini ke TeamSelect.vue
const fetchMembers = async (query = '') => {
  try {
    // Skip jika tidak ada department yang dipilih
    if (effectiveDepartmentIds.value.length === 0) {
      members.value = []; 
      return;
    }
    
    loading.value = true;
    
    const response = await apiClient.post('/web/employees/multi-dept', {
      jsonrpc: '2.0',
      id: new Date().getTime(),
      params: {
        department_ids: effectiveDepartmentIds.value,
        search: query,
        limit: 100 // Minta lebih banyak untuk difilter
      }
    });
    
    if (response.data?.result?.status === 'success' && 
        response.data?.result?.data?.rows) {
      
      // Filter karyawan berdasarkan departemen di sisi client
      const allEmployees = response.data.result.data.rows;
      let filteredEmployees = allEmployees;
      
      // Jika ada departemen yang dipilih, filter berdasarkan department_id
      if (effectiveDepartmentIds.value.length > 0) {
        filteredEmployees = allEmployees.filter(employee => 
          employee.department_id && 
          effectiveDepartmentIds.value.includes(employee.department_id)
        );
        
        console.log(`Memfilter dari ${allEmployees.length} menjadi ${filteredEmployees.length} karyawan`);
      }
      
      members.value = filteredEmployees;
      initializeSelection();
    }
  } catch (error) {
    console.error('Error fetching team members:', error);
  } finally {
    loading.value = false;
  }
};

// Also update fetchMissingMembers to use multi-dept
const fetchMissingMembers = async (ids) => {
  if (!ids || ids.length === 0) return;
  
  // Filter IDs that don't exist in members.value
  const missingIds = Array.isArray(ids) 
    ? ids.filter(id => !members.value.some(m => m.id === id))
    : [ids].filter(id => !members.value.some(m => m.id === id));
  
  if (missingIds.length === 0) return;
  
  try {
    loading.value = true;
    const response = await apiClient.post('/web/employees/multi-dept', {
      jsonrpc: '2.0',
      id: new Date().getTime(),
      params: {
        ids: missingIds
      }
    });
    
    if (response.data && response.data.result && 
        response.data.result.status === 'success' && 
        response.data.result.data && 
        response.data.result.data.rows) {
      
      const missingMembers = response.data.result.data.rows;
      // Add missing members to the list
      members.value = [...members.value, ...missingMembers];
      // Reinitialize selection with complete data
      initializeSelection();
    }
  } catch (error) {
    console.error('Error fetching missing members:', error);
  } finally {
    loading.value = false;
  }
};
// Initialize selection based on modelValue
const initializeSelection = () => {
  // Simpan selected members yang sudah ada
  const currentSelectedIds = selectedMembers.value.map(m => m.id)
  
  if (props.multiple) {
    const modelArray = Array.isArray(props.modelValue) ? props.modelValue : []
    
    // Gabungkan member yang sudah ada dengan yang baru ditemukan
    const newSelectedMembers = []
    
    // Pertahankan member yang sudah dipilih sebelumnya
    for (const existingMember of selectedMembers.value) {
      if (modelArray.includes(existingMember.id)) {
        newSelectedMembers.push(existingMember)
      }
    }
    
    // Tambahkan member baru yang ada di members.value
    for (const id of modelArray) {
      if (!currentSelectedIds.includes(id)) {
        const member = members.value.find(m => m.id === id)
        if (member) {
          newSelectedMembers.push({...member})
        }
      }
    }
    
    selectedMembers.value = newSelectedMembers
  } else {
    // Untuk mode single select
    // Untuk mode single select
    const currentId = props.modelValue
    
    // Cek apakah sudah ada di selected
    if (selectedMembers.value.length > 0 && selectedMembers.value[0].id === currentId) {
      // Pertahankan yang sudah ada
      return
    }
    
    // Cari dari members baru
    const member = members.value.find(m => m.id === currentId)
    selectedMembers.value = member ? [{...member}] : []
  }
}

// Tambahkan fungsi untuk mendapatkan detail member yang tidak ada dalam daftar


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
      // Simpan salinan lengkap dari member yang dipilih
      const memberCopy = {...member}
      selectedMembers.value.push(memberCopy)
    }
    emit('update:modelValue', selectedMembers.value.map(m => m.id))
  } else {
    // Simpan salinan lengkap dari member
    selectedMembers.value = [{...member}]
    emit('update:modelValue', member.id)
    isOpen.value = false
  }
  
  // Tunda reset searchQuery sampai setelah selection disimpan
  setTimeout(() => {
    searchQuery.value = ''
  }, 10)
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
watch(() => props.modelValue, () => {
  initializeSelection()
}, { deep: true })


watch(() => effectiveDepartmentIds.value, (newVal, oldVal) => {
  // Hanya fetch jika array berubah
  if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
    fetchMembers();
  }
}, { deep: true });

// Watch for department changes (both departmentId and departmentIds)
watch(() => effectiveDepartmentIds.value, (newVal, oldVal) => {
  // Cek apakah array berubah
  const newValStr = JSON.stringify(newVal.sort());
  const oldValStr = JSON.stringify(oldVal.sort());
  
  if (newValStr !== oldValStr) {
    fetchMembers();
  }
}, { deep: true })



// Initialize
onMounted(() => {
  fetchMembers()
  fetchMissingMembers(props.modelValue)
})

watch(() => props.modelValue, () => {
  fetchMissingMembers(props.modelValue)
}, { immediate: false })
</script>

<style scoped>
.max-h-60 {
  max-height: 15rem;
}
</style>