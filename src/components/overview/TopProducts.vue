<!-- TopProducts.vue -->
<template>
  <div class="p-4">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-3 sm:space-y-0">
      <h3 class="text-lg font-medium text-gray-900">Top Products & Services</h3>
      <div class="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <button 
          v-for="tab in tabs" 
          :key="tab.value"
          @click="activeTab = tab.value"
          :class="[
            'px-3 py-1.5 text-sm rounded-md transition-colors flex-1 sm:flex-none',
            activeTab === tab.value 
              ? 'bg-white text-gray-900 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          ]"
        >
          {{ tab.label }}
          <span class="ml-1 text-xs text-gray-500">
            ({{ itemCounts[tab.value] }})
          </span>
        </button>
      </div>
    </div>

    <!-- List Section with Improved Spacing -->
    <div class="mt-4 space-y-2 sm:space-y-3">
      <template v-if="filteredItems.length">
        <div 
          v-for="item in filteredItems" 
          :key="item.id"
          class="flex flex-col sm:flex-row sm:items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100 space-y-2 sm:space-y-0"
        >
          <!-- Left Side: Name & Orders -->
          <div class="flex items-start flex-1 min-w-0">
            <div :class="[
              'flex-shrink-0 rounded-lg p-2 mr-3',
              activeTab === 'services' ? 'bg-blue-50' : 'bg-green-50'
            ]">
              <component
                :is="activeTab === 'services' ? WrenchScrewdriverIcon : CubeIcon"
                class="h-5 w-5"
                :class="activeTab === 'services' ? 'text-blue-600' : 'text-green-600'"
              />
            </div>

            <div class="min-w-0 flex-1">
              <p class="text-sm font-medium text-gray-900 truncate">
                {{ item.name }}
              </p>
              <div class="flex flex-wrap items-center gap-2 mt-1">
                <span class="text-xs text-gray-500 flex items-center">
                  <ShoppingBagIcon class="h-4 w-4 mr-1" />
                  {{ item.orders }} orders
                </span>
                <span v-if="totalOrders" class="text-xs text-gray-500 flex items-center">
                  <ChartBarIcon class="h-4 w-4 mr-1" />
                  {{ formatPercentage(item.orders / totalOrders * 100) }}
                </span>
              </div>
            </div>
          </div>

          <!-- Right Side: Revenue -->
          <div class="text-right ml-3">
            <p class="text-sm font-bold text-gray-900">
              {{ formatCurrency(item.revenue) }}
            </p>
            <p v-if="item.orders" class="text-xs text-gray-500 mt-1">
              Avg: {{ formatCurrency(item.revenue / item.orders) }}
            </p>
          </div>
        </div>
      </template>

      <!-- Empty State -->
      <div 
        v-else 
        class="text-center py-8 bg-gray-50 rounded-lg"
      >
        <InboxIcon class="mx-auto h-12 w-12 text-gray-400" />
        <h3 class="mt-2 text-sm font-medium text-gray-900">No data</h3>
        <p class="mt-1 text-sm text-gray-500">
          No {{ activeTab === 'services' ? 'services' : 'products' }} found for this period.
        </p>
      </div>
    </div>

    <!-- Summary Section -->
    <div v-if="filteredItems.length" class="mt-4 pt-4 border-t border-gray-100">
      <div class="grid grid-cols-2 gap-3 sm:gap-4">
        <div class="bg-gray-50 rounded-lg p-3">
          <p class="text-xs text-gray-500">Total Revenue</p>
          <p class="mt-1 text-base sm:text-lg font-semibold truncate">
            {{ formatCurrency(totalRevenue) }}
          </p>
        </div>
        <div class="bg-gray-50 rounded-lg p-3">
          <p class="text-xs text-gray-500">Total Orders</p>
          <p class="mt-1 text-base sm:text-lg font-semibold truncate">
            {{ totalOrders }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { 
  WrenchScrewdriverIcon,
  CubeIcon,
  ShoppingBagIcon,
  ChartBarIcon,
  InboxIcon 
} from '@heroicons/vue/24/outline'
import { formatCurrency, formatPercentage } from '@/utils/formatters'

const props = defineProps({
  data: {
    type: Object,
    default: () => ({
      result: {
        data: {
          top_data: {
            products: {
              services: [],
              physical: []
            }
          }
        }
      }
    })
  }
})

const tabs = [
  { label: 'Services', value: 'services' },
  { label: 'Products', value: 'physical' }
]

const activeTab = ref('services')

// Get the actual data path
const getProductsData = computed(() => {
  // Sekarang langsung akses top_data karena dashboardData sudah berisi data hasil response
  return props.data?.top_data?.products || { services: [], physical: [] }
})


// Filtered items based on active tab
const filteredItems = computed(() => {
  const products = getProductsData.value
  return products[activeTab.value] || []
})

// Item counts for tabs
const itemCounts = computed(() => {
  const products = getProductsData.value
  return {
    services: products.services?.length || 0,
    physical: products.physical?.length || 0
  }
})

// Calculate totals
const totalOrders = computed(() => 
  filteredItems.value.reduce((sum, item) => sum + (Number(item.orders) || 0), 0)
)

const totalRevenue = computed(() => 
  filteredItems.value.reduce((sum, item) => sum + (Number(item.revenue) || 0), 0)
)
</script>