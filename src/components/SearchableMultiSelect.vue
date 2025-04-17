<!-- src/components/SearchableMultiSelect.vue -->
<template>
  <div class="relative" ref="dropdownRef">
    <label v-if="label" :for="id" class="block text-sm font-medium text-gray-700 mb-1">
      {{ label }} <span v-if="required" class="text-red-500">*</span>
    </label>
    <div 
      class="mt-1 relative rounded-md shadow-sm cursor-pointer"
      @click="toggleDropdown"
    >
      <!-- Selected options display -->
      <div
        class="block w-full text-sm border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 min-h-[38px]"
        :class="{ 'border-red-500 focus:ring-red-500': error }"
      >
        <!-- Selected tags display -->
        <div v-if="selectedValues.length > 0" class="flex flex-wrap gap-1">
          <div 
            v-for="value in selectedValues" 
            :key="value.value"
            class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800"
          >
            {{ value.label }}
            <button 
              type="button" 
              class="flex-shrink-0 ml-1 h-4 w-4 rounded-full inline-flex items-center justify-center text-red-600 hover:text-red-800 focus:outline-none"
              @click.stop="removeOption(value.value)"
            >
              <span class="sr-only">Remove</span>
              <svg class="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                <path stroke-linecap="round" stroke-width="1.5" d="M1 1l6 6m0-6L1 7" />
              </svg>
            </button>
          </div>
        </div>
        <span v-else class="text-gray-400">{{ placeholder }}</span>
        
        <!-- Dropdown icon -->
        <span class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </span>
      </div>

      <!-- Dropdown with search input and options -->
      <div 
        v-if="isOpen" 
        class="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
      >
        <!-- Search input -->
        <div class="sticky top-0 p-2 bg-white border-b border-gray-100">
          <div class="relative">
            <input
              type="text"
              v-model="searchQuery"
              class="w-full px-3 py-2 pl-8 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 text-sm"
              :placeholder="searchPlaceholder"
              @click.stop
              ref="searchInput"
            />
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          <!-- Quick actions -->
          <div class="flex justify-between text-xs mt-1 text-gray-500">
            <button 
              @click.stop="selectAll" 
              class="hover:text-red-600 transition-colors duration-200"
              v-if="filteredOptions.length > 0"
            >
              Select all
            </button>
            <button 
              @click.stop="clearAll" 
              class="hover:text-red-600 transition-colors duration-200"
              v-if="selectedValues.length > 0"
            >
              Clear all
            </button>
          </div>
        </div>

        <!-- Options list -->
        <div class="py-1">
          <div v-if="filteredOptions.length === 0" class="px-4 py-2 text-sm text-gray-500">
            No options found
          </div>
          <div
            v-for="option in filteredOptions"
            :key="option.value"
            class="cursor-pointer select-none relative py-2 pl-3 pr-9 text-gray-900 hover:bg-red-50 transition-colors duration-150"
            @click.stop="toggleOption(option)"
          >
            <div class="flex items-center">
              <div 
                class="flex-shrink-0 h-4 w-4 mr-2 rounded border border-gray-300 flex items-center justify-center"
                :class="{ 'bg-red-600 border-red-600': isSelected(option.value) }"
              >
                <svg 
                  v-if="isSelected(option.value)" 
                  class="h-3 w-3 text-white" 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </div>
              <span class="block truncate" :class="{ 'font-medium': isSelected(option.value), 'font-normal': !isSelected(option.value) }">
                {{ option.label }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <p v-if="error" class="mt-2 text-sm text-red-600">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick, onBeforeUnmount } from 'vue';

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  options: {
    type: Array,
    required: true
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Select options'
  },
  searchPlaceholder: {
    type: String,
    default: 'Type to search...'
  },
  required: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  },
  id: {
    type: String,
    default: () => `multi-select-${Math.random().toString(36).substring(2)}`
  }
});

const emit = defineEmits(['update:modelValue']);

const isOpen = ref(false);
const searchQuery = ref('');
const searchInput = ref(null);
const dropdownRef = ref(null);

// Format options to ensure they have value and label properties
const formattedOptions = computed(() => {
  return props.options.map(option => {
    if (typeof option === 'object' && option !== null) {
      return {
        value: option.value || option.id,
        label: option.label || option.name
      };
    }
    return { value: option, label: option };
  });
});

// Filter options based on search query
const filteredOptions = computed(() => {
  if (!searchQuery.value) return formattedOptions.value;
  const query = searchQuery.value.toLowerCase();
  return formattedOptions.value.filter(option => 
    option.label.toLowerCase().includes(query)
  );
});

// Get selected options for display
const selectedValues = computed(() => {
  const selected = [];
  for (const value of props.modelValue) {
    const option = formattedOptions.value.find(opt => opt.value == value);
    if (option) {
      selected.push(option);
    }
  }
  return selected;
});

// Check if an option is selected
const isSelected = (value) => {
  return props.modelValue.some(val => val == value);
};

// Toggle dropdown
const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    nextTick(() => {
      if (searchInput.value) {
        searchInput.value.focus();
      }
    });
  }
};

// Close dropdown
const closeDropdown = () => {
  isOpen.value = false;
  searchQuery.value = '';
};

// Toggle selection of an option
const toggleOption = (option) => {
  const newValue = [...props.modelValue];
  const index = newValue.findIndex(val => val == option.value);
  
  if (index === -1) {
    // Add option
    newValue.push(option.value);
  } else {
    // Remove option
    newValue.splice(index, 1);
  }
  
  emit('update:modelValue', newValue);
};

// Remove an option
const removeOption = (value) => {
  const newValue = props.modelValue.filter(val => val != value);
  emit('update:modelValue', newValue);
};

// Select all filtered options
const selectAll = () => {
  const currentValues = new Set(props.modelValue);
  filteredOptions.value.forEach(option => {
    currentValues.add(option.value);
  });
  emit('update:modelValue', Array.from(currentValues));
};

// Clear all selections
const clearAll = () => {
  emit('update:modelValue', []);
};

// Handle clicks outside
const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    closeDropdown();
  }
};

// Add and remove event listeners
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});

// Reset search when dropdown closes
watch(isOpen, (newValue) => {
  if (!newValue) {
    searchQuery.value = '';
  }
});
</script>