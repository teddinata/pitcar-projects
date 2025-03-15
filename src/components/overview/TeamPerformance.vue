<!-- // src/components/overview/TeamPerformance.vue -->
<!-- TeamPerformance.vue -->
<template>
  <div class="p-4">
    <!-- Service Advisors Section -->
    <div class="mb-6 sm:mb-8">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-medium text-gray-900">Service Advisors</h3>
        <span class="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
          {{ advisors.length }} active
        </span>
      </div>

      <div class="grid gap-3 sm:gap-4">
        <div 
          v-for="advisor in advisors" 
          :key="advisor.id" 
          class="bg-white rounded-lg p-3 sm:p-4 border border-gray-100 hover:shadow-sm transition-shadow"
        >
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <div class="flex items-center min-w-0">
              <div class="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 flex-shrink-0">
                {{ getInitials(advisor.name) }}
              </div>
              <div class="ml-3 min-w-0">
                <p class="font-medium text-gray-900 truncate">{{ advisor.name }}</p>
                <p class="text-sm text-gray-500">{{ advisor.orders }} orders</p>
              </div>
            </div>
            <p class="text-lg font-bold text-gray-900 order-first sm:order-last">
              {{ formatCurrency(advisor.revenue) }}
            </p>
          </div>
          
          <div class="mt-3">
            <div class="flex justify-between text-sm mb-1.5">
              <span class="text-gray-500">Performance</span>
              <span class="font-medium">
                {{ formatPercentage(advisor.orders / totalAdvisorOrders * 100) }}
              </span>
            </div>
            <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                class="h-2 bg-blue-600 rounded-full transition-all duration-500"
                :style="{ width: `${(advisor.orders / totalAdvisorOrders) * 100}%` }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Mechanics Section -->
    <div>
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-medium text-gray-900">Mechanics</h3>
        <span class="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
          {{ mechanics.length }} active
        </span>
      </div>

      <div class="grid gap-3 sm:gap-4">
        <div 
          v-for="mechanic in mechanics" 
          :key="mechanic.id" 
          class="bg-white rounded-lg p-3 sm:p-4 border border-gray-100 hover:shadow-sm transition-shadow"
        >
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <div class="flex items-center min-w-0">
              <div class="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 flex-shrink-0">
                {{ getInitials(mechanic.name) }}
              </div>
              <div class="ml-3 min-w-0">
                <p class="font-medium text-gray-900 truncate">{{ mechanic.name }}</p>
                <p class="text-sm text-gray-500">{{ mechanic.orders }} orders</p>
              </div>
            </div>
            <p class="text-lg font-bold text-gray-900 order-first sm:order-last">
              {{ formatCurrency(mechanic.revenue) }}
            </p>
          </div>
          
          <div class="mt-3">
            <div class="flex justify-between text-sm mb-1.5">
              <span class="text-gray-500">Performance</span>
              <span class="font-medium">
                {{ formatPercentage(mechanic.orders / totalMechanicOrders * 100) }}
              </span>
            </div>
            <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                class="h-2 bg-green-600 rounded-full transition-all duration-500"
                :style="{ width: `${(mechanic.orders / totalMechanicOrders) * 100}%` }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { formatCurrency, formatPercentage } from '@/utils/formatters'

const props = defineProps({
  advisors: {
    type: Array,
    default: () => []
  },
  mechanics: {
    type: Array,
    default: () => []
  }
})

const totalAdvisorOrders = computed(() => 
  props.advisors.reduce((sum, advisor) => sum + advisor.orders, 0)
)

const totalMechanicOrders = computed(() => 
  props.mechanics.reduce((sum, mechanic) => sum + mechanic.orders, 0)
)

const getInitials = (name) => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}
</script>
