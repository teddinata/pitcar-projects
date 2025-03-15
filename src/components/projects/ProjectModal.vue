<!-- src/components/projects/ProjectModal.vue -->
<template>
  <TransitionRoot appear :show="show" as="template">
    <Dialog as="div" class="relative z-50" @close="$emit('close')">
      <!-- Background overlay -->
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black bg-opacity-25" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel class="w-full max-w-3xl transform overflow-visible rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
              <!-- Modal Header -->
              <DialogTitle as="div" class="mb-6">
                <slot name="title"></slot>
              </DialogTitle>

              <!-- Modal Content -->
              <div class="mt-2">
                <slot></slot>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'

defineProps({
  show: {
    type: Boolean,
    required: true
  }
})

defineEmits(['close'])
</script>

<style>
/* Ensure modals can show dropdowns */
.v-popper--theme-dropdown .v-popper__inner {
  z-index: 100;
}

/* Ensure select dropdowns are visible */
.select-dropdown {
  z-index: 100;
}
</style>