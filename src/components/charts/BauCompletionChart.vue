<!-- src/components/charts/BauCompletionChart.vue -->
<template>
  <div class="h-full w-full">
    <Line 
      :data="chartData" 
      :options="chartOptions"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

// Props
const props = defineProps({
  chartData: {
    type: Array,
    required: true
  }
})

// Chart options
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: 'index',
    intersect: false,
  },
  scales: {
    y: {
      beginAtZero: true,
      min: 0,
      max: 100,
      title: {
        display: true,
        text: 'Completion Rate (%)'
      },
      grid: {
        display: true,
        color: 'rgba(0, 0, 0, 0.05)'
      }
    },
    y1: {
      type: 'linear',
      display: true,
      position: 'right',
      title: {
        display: true,
        text: 'Number of Activities'
      },
      grid: {
        display: false
      }
    },
    x: {
      grid: {
        display: false
      }
    }
  },
  plugins: {
    legend: {
      position: 'top',
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      padding: 10,
      titleColor: '#fff',
      bodyColor: '#fff',
      borderColor: 'rgba(255, 255, 255, 0.2)',
      borderWidth: 1
    }
  }
}

// Transform props data for the chart
const chartData = computed(() => {
  const labels = props.chartData.map(item => formatDate(item.date))
  const completionRates = props.chartData.map(item => item.completion_rate || 0)
  const totalActivities = props.chartData.map(item => item.total || 0)
  
  return {
    labels,
    datasets: [
      {
        label: 'Completion Rate (%)',
        data: completionRates,
        fill: false,
        borderColor: '#10b981', // emerald
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
        tension: 0.3,
        pointRadius: 4,
        pointBackgroundColor: '#10b981',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        yAxisID: 'y'
      },
      {
        label: 'Total Activities',
        data: totalActivities,
        fill: false,
        borderColor: '#6366f1', // indigo
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
        borderDash: [5, 5],
        tension: 0.3,
        pointRadius: 4,
        pointBackgroundColor: '#6366f1',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        yAxisID: 'y1'
      }
    ]
  }
})

// Format date for display (YYYY-MM-DD to MM-DD)
const formatDate = (dateString) => {
  if (!dateString) return ''
  
  try {
    const dateParts = dateString.split('-')
    if (dateParts.length === 3) {
      return `${dateParts[1]}-${dateParts[2]}`
    }
    return dateString
  } catch (e) {
    return dateString
  }
}
</script>