<!-- src/components/Badge.vue -->
<template>
  <span 
    class="px-2 py-1 text-xs font-medium rounded-full"
    :class="typeClasses"
  >
    {{ typeLabel }}
  </span>
</template>

<script setup>
import { computed, defineProps } from 'vue'
const props = defineProps({
  type: {
    type: String,
    required: true
  }
})

const typeClasses = computed(() => ({
  'bg-blue-100 text-blue-800': props.type === 'video',
  'bg-purple-100 text-purple-800': props.type === 'design'
}))

const typeLabel = computed(() => ({
  'video': 'Video',
  'design': 'Design'
}[props.type] || props.type))
</script>