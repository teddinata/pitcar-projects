<!-- BauVsProjectChart.vue -->
<template>
  <div class="p-4">
    <div class="flex items-center justify-between mb-4">
      <div>
        <h3 class="text-lg font-medium text-gray-900">BAU vs Project Time</h3>
        <p class="text-sm text-gray-500">Time allocation comparison</p>
      </div>
    </div>

    <!-- Chart Container with Responsive Height -->
    <div class="h-[200px] sm:h-[250px]">
      <Doughnut :data="chartData" :options="chartOptions" />
    </div>

    <!-- Summary Stats -->
    <div class="mt-4 grid grid-cols-2 gap-3">
      <div class="bg-red-50 rounded-lg p-3 flex flex-col items-center">
        <p class="text-xs text-gray-700">BAU Activities</p>
        <p class="mt-1 text-base font-semibold text-red-700">{{ formatHours(bauHours) }}</p>
        <p class="text-xs text-gray-600 mt-1">{{ bauPercentage }}% of total</p>
      </div>
      <div class="bg-blue-50 rounded-lg p-3 flex flex-col items-center">
        <p class="text-xs text-gray-700">Project Work</p>
        <p class="mt-1 text-base font-semibold text-blue-700">{{ formatHours(projectHours) }}</p>
        <p class="text-xs text-gray-600 mt-1">{{ projectPercentage }}% of total</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

const props = defineProps({
  bauHours: {
    type: Number,
    default: 0
  },
  projectHours: {
    type: Number,
    default: 0
  }
})

const bauPercentage = computed(() => {
  const total = props.bauHours + props.projectHours
  if (total === 0) return 0
  return Math.round((props.bauHours / total) * 100)
})

const projectPercentage = computed(() => {
  const total = props.bauHours + props.projectHours
  if (total === 0) return 0
  return Math.round((props.projectHours / total) * 100)
})

const chartData = computed(() => ({
  labels: ['BAU Activities', 'Project Work'],
  datasets: [
    {
      data: [props.bauHours, props.projectHours],
      backgroundColor: ['rgba(239, 68, 68, 0.8)', 'rgba(59, 130, 246, 0.8)'],
      hoverBackgroundColor: ['rgba(220, 38, 38, 1)', 'rgba(37, 99, 235, 1)'],
      borderWidth: 1
    }
  ]
}))

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  cutout: '70%',
  plugins: {
    legend: {
      position: 'bottom'
    },
    tooltip: {
      callbacks: {
        label: function(context) {
          const label = context.label || '';
          const value = context.raw || 0;
          const total = context.dataset.data.reduce((a, b) => a + b, 0);
          const percentage = Math.round((value / total) * 100);
          return `${label}: ${formatHours(value)} (${percentage}%)`;
        }
      }
    }
  }
}))

const formatHours = (hours) => {
  return `${parseFloat(hours.toFixed(1))} hours`;
}
</script>