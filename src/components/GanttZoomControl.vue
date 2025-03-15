<!-- Komponen Zoom Controls untuk Gantt Chart -->
<template>
  <div class="absolute top-4 right-4 z-10 p-2 bg-white rounded-md shadow-sm border border-gray-200">
    <div class="flex items-center space-x-2">
      <span class="text-xs text-gray-500">Zoom:</span>
      <button
        @click="zoomOut"
        class="p-1 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
        :disabled="zoomLevel <= minZoom"
        title="Zoom Out"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
        </svg>
      </button>
      <span class="text-xs font-medium w-6 text-center">{{ zoomLabel }}</span>
      <button
        @click="zoomIn"
        class="p-1 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
        :disabled="zoomLevel >= maxZoom"
        title="Zoom In"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  zoomLevel: {
    type: Number,
    default: 3
  },
  minZoom: {
    type: Number,
    default: 1
  },
  maxZoom: {
    type: Number,
    default: 6
  }
});

const emit = defineEmits(['update:zoomLevel']);

const zoomLabel = computed(() => {
  return `${props.zoomLevel}x`;
});

function zoomIn() {
  if (props.zoomLevel < props.maxZoom) {
    emit('update:zoomLevel', props.zoomLevel + 1);
  }
}

function zoomOut() {
  if (props.zoomLevel > props.minZoom) {
    emit('update:zoomLevel', props.zoomLevel - 1);
  }
}
</script>