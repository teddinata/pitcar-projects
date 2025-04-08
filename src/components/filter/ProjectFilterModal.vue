<!-- src/components/team/TeamProjectFilterModal.vue -->
<template>
  <TransitionRoot appear :show="show" as="template">
    <Dialog as="div" @close="closeModal" class="relative z-10">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black bg-opacity-25" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
              <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
                Filter Projects
              </DialogTitle>
              
              <div class="mt-4 space-y-4">
                <!-- Department Filter -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <select
                    v-model="localFilters.department_id"
                    class="px-3 py-2 w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                  >
                    <option value="">All Departments</option>
                    <option v-for="dept in departments" :key="dept.id" :value="dept.id">
                      {{ dept.name }}
                    </option>
                  </select>
                </div>
                
                <!-- Status Filter -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    v-model="localFilters.state"
                    class="px-3 py-2 w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                  >
                    <option value="">All Status</option>
                    <option value="draft">Draft</option>
                    <option value="planning">Planning</option>
                    <option value="in_progress">In Progress</option>
                    <option value="on_hold">On Hold</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                
                <!-- Date Range Filter -->
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">Date Range</label>
                  <div class="grid grid-cols-2 gap-3">
                    <div>
                      <label class="block text-xs text-gray-500 mb-1">Start Date</label>
                      <div class="relative">
                        <input 
                          type="date" 
                          v-model="localFilters.date_start"
                          class="px-3 py-2 w-full rounded-md border-gray-300 pl-9 shadow-sm focus:border-red-500 focus:ring-red-500"
                        >
                        <span class="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
                          <CalendarIcon class="h-4 w-4 text-gray-400" />
                        </span>
                      </div>
                    </div>
                    <div>
                      <label class="block text-xs text-gray-500 mb-1">End Date</label>
                      <div class="relative">
                        <input 
                          type="date" 
                          v-model="localFilters.date_end"
                          class="px-3 py-2 w-full rounded-md border-gray-300 pl-9 shadow-sm focus:border-red-500 focus:ring-red-500"
                        >
                        <span class="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
                          <CalendarIcon class="h-4 w-4 text-gray-400" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="mt-6 flex justify-between">
                <button
                  @click="resetFilters"
                  class="inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <ArrowPathIcon class="h-4 w-4 mr-1.5" />
                  Reset
                </button>
                
                <div class="flex space-x-3">
                  <button
                    @click="closeModal"
                    class="inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Cancel
                  </button>
                  
                  <button
                    @click="applyFilters"
                    class="inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-rose-600 to-rose-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <FunnelIcon class="h-4 w-4 mr-1.5" />
                    Apply Filters
                  </button>
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { 
  Dialog, 
  DialogPanel, 
  DialogTitle, 
  TransitionChild, 
  TransitionRoot 
} from '@headlessui/vue'
import {
  CalendarIcon,
  ArrowPathIcon,
  FunnelIcon,
} from '@heroicons/vue/24/outline'

const props = defineProps({
  show: Boolean,
  filters: Object,
  departments: Array
})

const emit = defineEmits(['close', 'apply', 'reset'])

// Create a local copy of filters to work with
const localFilters = reactive({
  department_id: '',
  state: '',
  date_start: '',
  date_end: '',
  project_manager_id: ''
})

// Update local filters when props change
watch(() => props.filters, (newFilters) => {
  if (newFilters) {
    localFilters.department_id = newFilters.department_id
    localFilters.state = newFilters.state
    localFilters.date_start = newFilters.date_start
    localFilters.date_end = newFilters.date_end
    localFilters.project_manager_id = newFilters.project_manager_id
  }
}, { immediate: true, deep: true })

// Methods
const closeModal = () => {
  emit('close')
}

const applyFilters = () => {
  emit('apply', { ...localFilters })
  closeModal()
}

const resetFilters = () => {
  emit('reset')
  closeModal()
}
</script>