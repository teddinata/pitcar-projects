<!-- src/components/team/BAUVerificationReasonModal.vue -->
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
              <h3 class="text-lg font-medium text-gray-900">Alasan Verifikasi H+1</h3>
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
              <div class="mt-2">
                <p class="text-sm text-gray-500 mb-4">
                  Anda melakukan verifikasi aktivitas pada hari berikutnya. Mohon berikan alasan:
                </p>
                <textarea 
                  v-model="localReason"
                  rows="3"
                  required
                  class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Jelaskan alasan verifikasi dilakukan pada H+1"
                ></textarea>
              </div>

              <div class="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  class="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  @click="$emit('close')"
                >
                  Batal
                </button>
                <button
                  type="button"
                  class="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  @click="submit"
                  :disabled="!localReason"
                >
                  Kirim
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
import { ref, watch } from 'vue';
import { XCircleIcon } from '@heroicons/vue/24/outline';

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  reason: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['close', 'submit']);

const localReason = ref(props.reason);

// Watch for changes to the reason prop
watch(() => props.reason, (newVal) => {
  localReason.value = newVal;
});

// Watch for show prop changes and reset reason when opening
watch(() => props.show, (newShow) => {
  if (newShow) {
    localReason.value = props.reason;
  }
});

function submit() {
  if (!localReason.value) {
    return;
  }
  
  emit('submit', localReason.value);
}
</script>