<!-- KeyMetrics.vue -->
<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
    <MetricCard
      v-for="(metric, key) in metrics"
      :key="key"
      :title="metric.title"
      :value="getValue(key)"
      :icon="metric.icon"
      :iconColor="metric.iconColor"
      :iconBg="metric.iconBg"
      :growth="data[key]?.growth"
    />
  </div>
</template>

<script setup>
import { h } from 'vue'
import { 
  DocumentTextIcon,
  ShoppingBagIcon,
  CurrencyDollarIcon,
  CalculatorIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/vue/24/outline'
import { formatCurrency, formatPercentage } from '@/utils/formatters'

const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  }
})

const metrics = {
  quotations: {
    title: 'Quotations',
    icon: DocumentTextIcon,
    iconColor: 'text-blue-600',
    iconBg: 'bg-blue-50'
  },
  orders: {
    title: 'Orders',
    icon: ShoppingBagIcon,
    iconColor: 'text-green-600',
    iconBg: 'bg-green-50'
  },
  revenue: {
    title: 'Revenue',
    icon: CurrencyDollarIcon,
    iconColor: 'text-purple-600',
    iconBg: 'bg-purple-50'
  },
  average_order: {
    title: 'Average Order',
    icon: CalculatorIcon,
    iconColor: 'text-orange-600',
    iconBg: 'bg-orange-50'
  }
}

const getValue = (key) => {
  const value = props.data[key]?.current || 0
  return key.includes('revenue') || key.includes('average_order') 
    ? formatCurrency(value)
    : value
}
</script>

<script>
// MetricCard component
const MetricCard = {
  props: {
    title: String,
    value: [String, Number],
    icon: Object,
    iconColor: String,
    iconBg: String,
    growth: Number
  },
  setup(props) {
    const formatGrowth = (value) => formatPercentage(value || 0)
    
    return () => h('div', {
      class: `bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow
              p-4 sm:p-5 lg:p-6 relative overflow-hidden group`
    }, [
      // Content Container
      h('div', {
        class: 'flex justify-between items-start relative z-10'
      }, [
        // Left side - Metrics
        h('div', {
          class: 'flex-1 min-w-0 pr-4'
        }, [
          // Title
          h('p', {
            class: 'text-sm font-medium text-gray-600 truncate'
          }, props.title),
          
          // Value
          h('p', {
            class: `mt-2 text-xl sm:text-2xl font-bold text-gray-900 
                    tracking-tight truncate`
          }, props.value),
          
          // Growth indicator
          h('div', {
            class: 'mt-2 flex items-center text-sm'
          }, [
            // Growth arrow icon
            h(props.growth >= 0 ? ArrowTrendingUpIcon : ArrowTrendingDownIcon, {
              class: `h-4 w-4 mr-1 ${props.growth >= 0 ? 'text-green-500' : 'text-red-500'}`
            }),
            
            // Growth percentage
            h('span', {
              class: props.growth >= 0 ? 'text-green-600' : 'text-red-600'
            }, formatGrowth(props.growth)),
            
            // Comparison text
            h('span', {
              class: 'text-gray-500 ml-1 hidden sm:inline'
            }, 'vs previous')
          ])
        ]),
        
        // Right side - Icon
        h('div', {
          class: `${props.iconBg} p-2 sm:p-3 rounded-full 
                 transition-transform group-hover:scale-110`
        }, [
          h(props.icon, {
            class: `h-5 w-5 sm:h-6 sm:w-6 ${props.iconColor}`
          })
        ])
      ]),
      
      // Background decoration (optional)
      h('div', {
        class: `absolute right-0 top-0 -mr-16 -mt-16 opacity-10
                transition-opacity group-hover:opacity-20`
      }, [
        h(props.icon, {
          class: `h-32 w-32 ${props.iconColor}`
        })
      ])
    ])
  }
}
</script>