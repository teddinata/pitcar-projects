<!-- src/components/shared/ConfirmDialog.vue -->
<template>
  <Modal :show="show" @close="$emit('cancel')" maxWidth="max-w-md">
    <div class="p-6">
      <div class="text-center">
        <AlertTriangle class="mx-auto h-12 w-12 text-red-500" />
        <h3 class="mt-4 text-lg font-medium text-gray-900">{{ title }}</h3>
        <p class="mt-2 text-sm text-gray-500">{{ message }}</p>
      </div>
      <div class="mt-6 flex justify-end space-x-3">
        <button
          @click="$emit('cancel')"
          class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          @click="$emit('confirm')"
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-rose-600 to-rose-500"
        >
          Delete
        </button>
      </div>
    </div>
  </Modal>
</template>

<script setup>
import { AlertTriangle } from 'lucide-vue-next'
import Modal from '@/components/projects/ProjectModal.vue'

defineProps({
  show: Boolean,
  title: String,
  message: String
})

defineEmits(['confirm', 'cancel'])
</script>