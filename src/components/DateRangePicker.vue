<template>
  <div class="relative">
    <div 
      class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
      @click="$emit('close')"
    ></div>

    <div class="fixed inset-0 z-10 overflow-y-auto">
      <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Start Date</label>
              <input
                type="date"
                v-model="localValue.start"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">End Date</label>
              <input
                type="date"
                v-model="localValue.end"
                :min="localValue.start"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
              <button
                type="button"
                class="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 sm:col-start-2"
                @click="applyDateRange"
                :disabled="!isValidRange"
              >
                Apply
              </button>
              <button
                type="button"
                class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                @click="$emit('close')"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({ start: '', end: '' })
  }
})

const emit = defineEmits(['update:modelValue', 'close'])

const localValue = ref({ ...props.modelValue })

const isValidRange = computed(() => {
  return localValue.value.start && localValue.value.end && 
         localValue.value.start <= localValue.value.end
})

const applyDateRange = () => {
  emit('update:modelValue', { ...localValue.value })
  emit('close')
}
</script>