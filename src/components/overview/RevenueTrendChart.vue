<!-- RevenueTrendChart.vue -->
<template>
  <div class="p-4">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-2 sm:space-y-0">
      <div>
        <h3 class="text-lg font-medium text-gray-900">Revenue & Orders Trend</h3>
        <p class="text-sm text-gray-500">Daily performance overview</p>
      </div>
      <div class="flex space-x-2">
        <button
          v-for="chart in chartTypes"
          :key="chart.value"
          @click="activeChart = chart.value"
          :class="[
            'px-3 py-1.5 text-sm rounded-full transition-colors',
            activeChart === chart.value
              ? 'bg-blue-100 text-blue-700'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          ]"
        >
          {{ chart.label }}
        </button>
      </div>
    </div>

    <!-- Chart Container with Responsive Height -->
    <div class="h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px]">
      <Line :data="chartData" :options="chartOptions" />
    </div>

    <!-- Summary Stats Grid -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-100">
      <div 
        v-for="stat in summaryStats" 
        :key="stat.label"
        class="bg-gray-50 rounded-lg p-3 sm:p-4"
      >
        <p class="text-xs sm:text-sm text-gray-600">{{ stat.label }}</p>
        <p class="mt-1 text-base sm:text-lg font-semibold truncate">{{ stat.value }}</p>
        <p class="text-xs text-gray-500 mt-0.5">{{ stat.comparison }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, registerables } from 'chart.js'
import { format } from 'date-fns'
import { formatCurrency, formatNumber } from '@/utils/formatters'

ChartJS.register(...registerables)

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  }
})

const chartTypes = [
  { label: 'Revenue', value: 'revenue' },
  { label: 'Orders', value: 'orders' }
]

const activeChart = ref('revenue')

const chartData = computed(() => ({
  labels: props.data.map(item => 
    format(new Date(item.date), 'MMM dd')
  ),
  datasets: [
    {
      label: activeChart.value === 'revenue' ? 'Revenue' : 'Orders',
      data: props.data.map(item => 
        activeChart.value === 'revenue' ? item.revenue : item.orders
      ),
      borderColor: '#2563eb',
      backgroundColor: 'rgba(37, 99, 235, 0.1)',
      fill: true,
      tension: 0.4
    }
  ]
}))

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      callbacks: {
        label: (context) => {
          const value = context.parsed.y
          return activeChart.value === 'revenue' 
            ? formatCurrency(value)
            : `${value} orders`
        }
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: (value) => {
          return activeChart.value === 'revenue'
            ? formatCurrency(value, 0)
            : value
        }
      }
    }
  }
}))

const summaryStats = computed(() => {
  if (!props.data.length) return []

  const values = props.data.map(item => 
    activeChart.value === 'revenue' ? item.revenue : item.orders
  )
  
  const total = values.reduce((sum, val) => sum + val, 0)
  const avg = total / values.length
  const max = Math.max(...values)
  const min = Math.min(...values)

  return [
    {
      label: 'Total',
      value: activeChart.value === 'revenue' 
        ? formatCurrency(total)
        : formatNumber(total),
      comparison: 'Period total'
    },
    {
      label: 'Average',
      value: activeChart.value === 'revenue'
        ? formatCurrency(avg)
        : formatNumber(avg, 1),
      comparison: 'Per day'
    },
    {
      label: 'Highest',
      value: activeChart.value === 'revenue'
        ? formatCurrency(max)
        : formatNumber(max),
      comparison: 'Best performance'
    },
    {
      label: 'Lowest',
      value: activeChart.value === 'revenue'
        ? formatCurrency(min)
        : formatNumber(min),
      comparison: 'Lowest performance'
    }
  ]
})
</script>