<!-- /src/components/Toast.vue -->
<template>
  <TransitionGroup
    enter-active-class="transform ease-out duration-500 transition"
    enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-4"
    enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
    leave-active-class="transition ease-in duration-300"
    leave-from-class="opacity-100 scale-100"
    leave-to-class="opacity-0 scale-95"
  >
    <div v-if="show" 
         :key="message"
         class="fixed top-4 right-4 z-50 w-[90%] sm:w-[400px]"
         :class="[positionClasses]">
      <div 
        class="max-w-xl rounded-lg pointer-events-auto border-l-4 shadow-xl backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 transform transition-all hover:scale-[1.02]"
        :class="[borderColorClass]">
        <div class="flex p-4">
          <div class="flex-1">
            <div class="flex items-start">
              <div class="flex-shrink-0 pt-0.5">
                <CheckCircleIcon v-if="type === 'success'" class="h-6 w-6 text-green-500" />
                <ExclamationCircleIcon v-if="type === 'error'" class="h-6 w-6 text-red-500" />
                <InformationCircleIcon v-if="type === 'info'" class="h-6 w-6 text-blue-500" />
                <ExclamationTriangleIcon v-if="type === 'warning'" class="h-6 w-6 text-yellow-500" />
              </div>
              <div class="ml-3 flex-1">
                <p v-if="title" class="text-sm font-semibold text-gray-900 dark:text-white">
                  {{ title }}
                </p>
                <p class="mt-1 text-sm text-gray-600 dark:text-gray-300">
                  {{ message }}
                </p>
              </div>
              <div class="ml-4 flex-shrink-0 flex">
                <button
                  @click="handleClose"
                  class="rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <XMarkIcon class="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
        <!-- Progress bar -->
        <div v-if="!persistent && show" 
             class="h-1 bg-gray-200 dark:bg-gray-700 rounded-b-lg overflow-hidden">
          <div
            class="h-full transition-all duration-100 ease-linear"
            :class="[progressColorClass]"
            :style="{ width: `${progress}%` }"
          ></div>
        </div>
      </div>
    </div>
  </TransitionGroup>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  XMarkIcon,
  ExclamationTriangleIcon
} from '@heroicons/vue/24/outline'

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  message: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'info',
    validator(value) {
      return ['success', 'error', 'info', 'warning'].includes(value)
    }
  },
  duration: {
    type: Number,
    default: 5000
  },
  persistent: {
    type: Boolean,
    default: false
  },
  position: {
    type: String,
    default: 'top-right',
    validator(value) {
      return ['top-right', 'top-left', 'bottom-right', 'bottom-left', 'top-center', 'bottom-center'].includes(value)
    }
  }
})

const emit = defineEmits(['update:show'])
const progress = ref(100)
let timeout = null
let progressInterval = null

const borderColorClass = computed(() => ({
  'border-green-500': props.type === 'success',
  'border-red-500': props.type === 'error',
  'border-blue-500': props.type === 'info',
  'border-yellow-500': props.type === 'warning'
}))

const progressColorClass = computed(() => ({
  'bg-green-500': props.type === 'success',
  'bg-red-500': props.type === 'error',
  'bg-blue-500': props.type === 'info',
  'bg-yellow-500': props.type === 'warning'
}))

const positionClasses = computed(() => {
  const classes = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2'
  }
  return classes[props.position]
})

const handleClose = () => {
  emit('update:show', false)
  cleanupTimers()
}

const startProgress = () => {
  if (props.persistent) return
  
  progress.value = 100
  const updateInterval = 10 // Update every 10ms
  const steps = props.duration / updateInterval
  const decrementPerStep = 100 / steps
  
  progressInterval = setInterval(() => {
    progress.value = Math.max(0, progress.value - decrementPerStep)
  }, updateInterval)
  
  timeout = setTimeout(() => {
    handleClose()
  }, props.duration)
}

const cleanupTimers = () => {
  if (timeout) clearTimeout(timeout)
  if (progressInterval) clearInterval(progressInterval)
}

// Watch for show prop changes
watch(() => props.show, (newVal) => {
  cleanupTimers()
  if (newVal && !props.persistent) {
    startProgress()
  }
})

// Clean up on unmount
onUnmounted(() => {
  cleanupTimers()
})
</script>