<!-- src/components/CustomTimePicker.vue -->
<template>
  <div class="relative">
    <div 
      @click="toggleDropdown"
      class="flex items-center justify-between w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer"
      :class="{ 'border-red-500 ring-2 ring-red-500': isOpen }"
    >
      <div class="flex items-center space-x-1">
        <span>{{ formattedValue || 'Pilih waktu' }}</span>
      </div>
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
      </svg>
    </div>

    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div v-if="isOpen" 
           class="absolute z-50 mt-1 w-full bg-black border border-gray-700 rounded-md shadow-lg max-h-60 overflow-y-auto" 
           ref="dropdown">
        <div class="py-1">
          <div v-for="(time, index) in availableTimes" :key="index"
               @click="selectTime(time)"
               class="px-4 py-2 text-sm cursor-pointer flex items-center"
               :class="[
                 time === modelValue ? 'bg-blue-700 text-white' : 'text-white hover:bg-gray-800'
               ]">
            {{ formatTimeDisplay(time) }}
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  interval: {
    type: Number,
    default: 15  // 15 minute intervals by default
  },
  startHour: {
    type: Number,
    default: 8   // Start at 8 AM
  },
  endHour: {
    type: Number,
    default: 18  // End at 6 PM
  }
});

const emit = defineEmits(['update:modelValue']);

const isOpen = ref(false);
const dropdown = ref(null);

// Generate available times based on interval
const availableTimes = computed(() => {
  const times = [];
  const minutes = props.interval;
  const totalMinutesInDay = (props.endHour - props.startHour) * 60;
  const totalSlots = totalMinutesInDay / minutes;
  
  for (let i = 0; i <= totalSlots; i++) {
    const totalMinutes = (props.startHour * 60) + (i * minutes);
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    
    const hoursStr = hours.toString().padStart(2, '0');
    const minsStr = mins.toString().padStart(2, '0');
    
    times.push(`${hoursStr}:${minsStr}`);
  }
  
  return times;
});

const formattedValue = computed(() => {
  if (!props.modelValue) return '';
  return formatTimeDisplay(props.modelValue);
});

function formatTimeDisplay(timeString) {
  if (!timeString) return '';
  
  // Parse the HH:MM format
  const [hours, minutes] = timeString.split(':').map(Number);
  
  // Format in 12-hour time with AM/PM
  let period = 'am';
  let displayHours = hours;
  
  if (hours >= 12) {
    period = 'pm';
    displayHours = hours === 12 ? 12 : hours - 12;
  } else if (hours === 0) {
    displayHours = 12;
  }
  
  return `${displayHours}:${minutes.toString().padStart(2, '0')}${period}`;
}

function toggleDropdown() {
  isOpen.value = !isOpen.value;
}

function selectTime(time) {
  emit('update:modelValue', time);
  isOpen.value = false;
}

// Close dropdown when clicking outside
function handleClickOutside(event) {
  if (dropdown.value && !dropdown.value.contains(event.target) && !event.target.closest('.relative')) {
    isOpen.value = false;
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>