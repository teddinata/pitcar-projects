<!-- TargetAchievementChart.vue -->
<template>
  <div class="p-4">
    <div class="flex items-center justify-between mb-4">
      <div>
        <h3 class="text-lg font-medium text-gray-900">Target Achievement Trend</h3>
        <p class="text-sm text-gray-500">Daily target completion status</p>
      </div>
    </div>

    <!-- Chart Container with Responsive Height -->
    <div class="h-[250px] sm:h-[300px]">
      <Line :data="chartData" :options="chartOptions" />
    </div>

    <!-- Summary Stats -->
    <div class="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
      <div class="bg-gray-50 rounded-lg p-3">
        <p class="text-xs text-gray-600">Achievement Rate</p>
        <p class="mt-1 text-base font-semibold">{{ overallRate }}%</p>
      </div>
      <div class="bg-gray-50 rounded-lg p-3">
        <p class="text-xs text-gray-600">Days Completed</p>
        <p class="mt-1 text-base font-semibold">{{ daysCompleted }} / {{ totalDays }}</p>
      </div>
      <div class="bg-gray-50 rounded-lg p-3">
        <p class="text-xs text-gray-600">7-Day Trend</p>
        <p class="mt-1 text-base font-semibold" :class="trendColor">
          {{ recentTrend > 0 ? '+' : '' }}{{ recentTrend }}%
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'
import { format } from 'date-fns'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  }
})

// Computed properties for chart data
const chartData = computed(() => {
  const sortedData = [...props.data].sort((a, b) => new Date(a.date) - new Date(b.date))
  
  return {
    labels: sortedData.map(day => format(new Date(day.date), 'MMM dd')),
    datasets: [
      {
        label: 'Daily Achievement',
        data: sortedData.map(day => day.target_achieved ? 100 : 0),
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
        borderColor: 'rgba(239, 68, 68, 1)',
        borderWidth: 1,
        pointRadius: 3,
        pointHoverRadius: 5
      },
      {
        label: '7-Day Average',
        data: calculateMovingAverage(sortedData.map(day => day.target_achieved ? 100 : 0), 7),
        backgroundColor: 'rgba(59, 130, 246, 0.0)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.4
      }
    ]
  }
})

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom'
    },
    tooltip: {
      callbacks: {
        label: function(context) {
          const label = context.dataset.label || '';
          const value = context.raw;
          return value === 100 
            ? `${label}: Target Achieved` 
            : value === 0 
              ? `${label}: Not Achieved` 
              : `${label}: ${value.toFixed(1)}%`;
        }
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      max: 100,
      title: {
        display: true,
        text: 'Achievement Status'
      },
      ticks: {
        callback: function(value) {
          return value + '%';
        }
      }
    },
    x: {
      title: {
        display: true,
        text: 'Date'
      }
    }
  }
}))

// Summary stats
const totalDays = computed(() => props.data.length)
const daysCompleted = computed(() => props.data.filter(day => day.target_achieved).length)
const overallRate = computed(() => {
  if (totalDays.value === 0) return 0
  return Math.round((daysCompleted.value / totalDays.value) * 100)
})

// Calculate recent trend (comparing last 7 days with previous 7 days)
const recentTrend = computed(() => {
  if (props.data.length < 14) return 0
  
  const sortedData = [...props.data].sort((a, b) => new Date(a.date) - new Date(b.date))
  
  const recentDays = sortedData.slice(-7)
  const previousDays = sortedData.slice(-14, -7)
  
  const recentRate = recentDays.filter(day => day.target_achieved).length / recentDays.length
  const previousRate = previousDays.filter(day => day.target_achieved).length / previousDays.length
  
  return Math.round((recentRate - previousRate) * 100)
})

const trendColor = computed(() => {
  if (recentTrend.value > 0) return 'text-green-600'
  if (recentTrend.value < 0) return 'text-red-600'
  return 'text-gray-600'
})

// Calculate moving average for chart
const calculateMovingAverage = (data, window) => {
  const result = []
  
  // If not enough data, return the original data
  if (data.length < window) return data
  
  // Calculate moving average
  for (let i = 0; i < data.length; i++) {
    if (i < window - 1) {
      // Not enough previous data points, use null for clear visualization
      result.push(null)
    } else {
      // Calculate average of last 'window' elements
      const sum = data.slice(i - window + 1, i + 1).reduce((a, b) => a + b, 0)
      result.push(sum / window)
    }
  }
  
  return result
}
</script>