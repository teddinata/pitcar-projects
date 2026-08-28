<!-- src/components/ReleaseHighlights.vue -->
<!-- Daftar ringkas "apa yang baru" pada popup pembaruan aplikasi -->
<template>
  <div>
    <p class="text-[10px] font-semibold uppercase tracking-wide text-gray-400 mb-1.5">
      Yang baru
    </p>
    <ul class="space-y-1.5">
      <li
        v-for="(item, index) in visibleItems"
        :key="index"
        class="flex items-start gap-2 text-xs text-gray-600 leading-snug"
      >
        <span class="mt-1.5 h-1.5 w-1.5 rounded-full bg-rose-400 flex-none"></span>
        <span>{{ item }}</span>
      </li>
    </ul>
    <p v-if="hiddenCount > 0" class="mt-1.5 text-[11px] text-gray-400">
      +{{ hiddenCount }} perubahan lainnya
    </p>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  items: {
    type: Array,
    default: () => []
  },
  max: {
    type: Number,
    default: 4
  }
})

const visibleItems = computed(() => props.items.slice(0, props.max))
const hiddenCount = computed(() => Math.max(props.items.length - props.max, 0))
</script>
