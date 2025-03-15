<template>
  <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="$emit('close')"></div>

      <!-- Modal panel -->
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <div class="p-6">
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <ExclamationTriangleIcon class="h-6 w-6 text-red-600" />
            </div>
            <div class="ml-3">
              <h3 class="text-lg leading-6 font-medium text-gray-900">{{ title }}</h3>
              <div class="mt-2">
                <p class="text-sm text-gray-500">
                  {{ message }}
                </p>
              </div>
            </div>
          </div>

          <div class="mt-6 sm:flex sm:flex-row-reverse sm:gap-3">
            <button
              type="button"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:w-auto sm:text-sm"
              @click="$emit('confirm')"
            >
              {{ confirmButtonText }}
            </button>
            <button
              type="button"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:mt-0 sm:w-auto sm:text-sm"
              @click="$emit('close')"
            >
              {{ cancelButtonText }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline';

defineProps({
  show: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: 'Confirm Delete'
  },
  message: {
    type: String,
    default: 'Are you sure you want to delete this item? This action cannot be undone.'
  },
  confirmButtonText: {
    type: String,
    default: 'Delete'
  },
  cancelButtonText: {
    type: String,
    default: 'Cancel'
  }
});

defineEmits(['close', 'confirm']);
</script>