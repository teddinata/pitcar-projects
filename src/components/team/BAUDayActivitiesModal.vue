<!-- src/components/team/BAUDayActivitiesModal.vue -->
<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div v-if="show" class="fixed inset-0 z-40 overflow-y-auto" @click.self="$emit('close')">
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-black bg-opacity-30" @click.self="$emit('close')"></div>
        
        <!-- Modal -->
        <div class="flex items-center justify-center min-h-screen p-4">
          <div 
            class="bg-white rounded-lg shadow-xl w-full max-w-md relative z-50 mx-auto"
            @click.stop
          >
            <!-- Modal Header -->
            <div class="flex justify-between items-center border-b p-4">
              <h3 class="text-lg font-medium text-gray-900" v-if="date">
                Aktivitas untuk {{ formatDate(date) }}
              </h3>
              <button
                @click="$emit('close')"
                class="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <span class="sr-only">Close</span>
                <XCircleIcon class="h-6 w-6" />
              </button>
            </div>
            
            <!-- Modal Content -->
            <div class="p-4">
              <div class="mt-4">
                <ul class="divide-y divide-gray-200">
                  <li v-for="activity in activities" :key="activity.id" class="py-3">
                    <div class="flex items-center justify-between">
                      <div>
                        <h4 class="text-sm font-medium text-gray-900">{{ activity.name }}</h4>
                        <div class="flex items-center text-xs text-gray-500">
                          <span>{{ activity.time_start }} - {{ activity.time_end }}</span>
                          <span class="mx-1">•</span>
                          <span>{{ activity.hours_spent }} jam</span>
                        </div>
                      </div>
                      <div class="flex items-center">
                        <span 
                          :class="[
                            'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                            getActivityStatusClass(activity.state, activity.activity_type)
                          ]"
                        >
                          {{ activity.state === 'done' ? 'Selesai' : 
                            activity.state === 'not_done' ? 'Tidak Selesai' : 'Direncanakan' }}
                        </span>
                        <button
                          @click="$emit('view-details', activity)"
                          class="ml-2 text-xs text-red-600 hover:text-red-900"
                        >
                          Detail
                        </button>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>

              <div class="mt-6 flex justify-between">
                <button
                  v-if="isToday"
                  type="button"
                  @click="$emit('add')"
                  class="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  <PlusIcon class="h-4 w-4 mr-1" />
                  Tambah
                </button>
                <div v-else></div> <!-- Spacer when button isn't shown -->
                <button
                  type="button"
                  @click="$emit('close')"
                  class="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue';
import { XCircleIcon, PlusIcon } from '@heroicons/vue/24/outline';

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  date: {
    type: String,
    default: null
  },
  activities: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['close', 'view-details', 'add']);

// Computed property to check if the selected date is today
const isToday = computed(() => {
  if (!props.date) return false;
  
  const selectedDate = new Date(props.date);
  const today = new Date();
  
  // Reset hours to 0 for proper date comparison
  selectedDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  
  return selectedDate.getTime() === today.getTime();
});

// Helper methods
function formatDate(dateString) {
  const date = new Date(dateString);
  
  // Indonesian month names
  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  
  return `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
}

function getActivityStatusClass(state, type = 'other') {
  // Status class takes precedence
  switch(state) {
    case 'done':
      return 'bg-green-100 text-green-800';
    case 'not_done':
      return 'bg-red-100 text-red-800';
    default: // planned
      // Fall back to type-based coloring
      return getActivityTypeColorClass(type);
  }
}

function getActivityTypeColorClass(type) {
  if (!type) return 'bg-gray-100 text-gray-800';
  
  const colorMap = {
    'meeting': 'bg-blue-100 text-blue-800',
    'training': 'bg-green-100 text-green-800',
    'support': 'bg-pink-100 text-pink-800',
    'admin': 'bg-indigo-100 text-indigo-800',
    'other': 'bg-gray-100 text-gray-800'
  };
  
  return colorMap[type.toLowerCase()] || 'bg-gray-100 text-gray-800';
}
</script>