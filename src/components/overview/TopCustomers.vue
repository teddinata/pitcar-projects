<!-- // src/components/overview/TopCustomers.vue -->
<!-- TopCustomers.vue -->
<template>
  <div class="p-4">
    <div class="flex items-center justify-between mb-4">
      <div>
        <h3 class="text-lg font-medium text-gray-900">Top Customers</h3>
        <p class="text-sm text-gray-500 mt-1">By revenue</p>
      </div>
    </div>

    <!-- Mobile View (< 640px) -->
    <div class="block sm:hidden space-y-3">
      <div 
        v-for="customer in data" 
        :key="customer.id" 
        class="bg-white p-3 rounded-lg border border-gray-100 hover:bg-gray-50"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <div class="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 flex-shrink-0">
              {{ getInitials(customer.name) }}
            </div>
            <div class="ml-3 min-w-0">
              <p class="font-medium text-gray-900 truncate">{{ customer.name }}</p>
              <div class="flex items-center text-sm text-gray-500 mt-0.5">
                <ShoppingBagIcon class="h-4 w-4 mr-1" />
                <span>{{ customer.orders }} orders</span>
              </div>
            </div>
          </div>
          <p class="text-sm font-medium text-gray-900 ml-3">
            {{ formatCurrency(customer.revenue) }}
          </p>
        </div>
      </div>
    </div>

    <!-- Desktop View (≥ 640px) -->
    <div class="hidden sm:block">
      <div class="relative overflow-x-auto rounded-lg border border-gray-100">
        <table class="w-full text-sm">
          <thead>
            <tr class="text-left text-xs text-gray-500 bg-gray-50">
              <th class="px-4 py-3 font-medium">Customer</th>
              <th class="px-4 py-3 font-medium">Orders</th>
              <th class="px-4 py-3 font-medium text-right">Revenue</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr 
              v-for="customer in data" 
              :key="customer.id" 
              class="hover:bg-gray-50 transition-colors"
            >
              <td class="px-4 py-3">
                <div class="flex items-center">
                  <div class="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 flex-shrink-0">
                    {{ getInitials(customer.name) }}
                  </div>
                  <p class="ml-3 font-medium text-gray-900 truncate">{{ customer.name }}</p>
                </div>
              </td>
              <td class="px-4 py-3">
                <div class="flex items-center text-gray-500">
                  <ShoppingBagIcon class="h-4 w-4 mr-1" />
                  <span>{{ customer.orders }}</span>
                </div>
              </td>
              <td class="px-4 py-3 text-right font-medium text-gray-900">
                {{ formatCurrency(customer.revenue) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ShoppingBagIcon } from '@heroicons/vue/24/outline'
import { formatCurrency } from '@/utils/formatters'

defineProps({
  data: {
    type: Array,
    default: () => []
  }
})

const getInitials = (name) => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}
</script>
