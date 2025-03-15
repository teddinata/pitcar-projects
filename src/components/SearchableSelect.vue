<!-- src/components/SearchableSelect.vue -->
<template>
  <div class="relative" ref="dropdownRef">
    <label v-if="label" :for="id" class="block text-sm font-medium text-gray-700 mb-1">
      {{ label }} <span v-if="required" class="text-red-500">*</span>
    </label>
    <div 
      class="mt-1 relative rounded-md shadow-sm cursor-pointer"
      @click="toggleDropdown"
    >
      <!-- Selected option display -->
      <div
        class="block w-full text-sm border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
        :class="{ 'border-red-500 focus:ring-red-500': error }"
      >
        <span v-if="displayValue">{{ displayValue }}</span>
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
        <div class="sticky top-0 p-2 bg-white">
          <input
            type="text"
            v-model="searchQuery"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 text-sm"
            :placeholder="searchPlaceholder"
            @click.stop
            ref="searchInput"
          />
        </div>

        <!-- Options list -->
        <div class="py-1">
          <div v-if="filteredOptions.length === 0" class="px-4 py-2 text-sm text-gray-500">
            No options found
          </div>
          <div
            v-for="option in filteredOptions"
            :key="option.value"
            class="cursor-pointer select-none relative py-2 pl-3 pr-9 text-gray-900 hover:bg-red-50"
            @click="selectOption(option)"
          >
            <span class="block truncate" :class="{ 'font-medium': option.value === modelValue, 'font-normal': option.value !== modelValue }">
              {{ option.label }}
            </span>
            <span v-if="option.value === modelValue" class="absolute inset-y-0 right-0 flex items-center pr-4 text-red-600">
              <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </span>
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
    type: [String, Number],
    default: ''
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
    default: 'Select an option'
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
    default: () => `select-${Math.random().toString(36).substring(2)}`
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

// Get the label of the selected option
const displayValue = computed(() => {
  if (!props.modelValue) return '';
  const selectedOption = formattedOptions.value.find(option => option.value == props.modelValue);
  return selectedOption ? selectedOption.label : '';
});

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

// Select an option
const selectOption = (option) => {
  emit('update:modelValue', option.value);
  closeDropdown();
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