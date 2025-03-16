<!-- src/components/charts/TasksCompletionChart.vue -->
<template>
  <div class="h-full w-full">
    <Line 
      :data="chartData" 
      :options="chartOptions"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
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
      title: {
        display: true,
        text: 'Tasks Completed'
      },
      grid: {
        display: true,
        color: 'rgba(0, 0, 0, 0.05)'
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
  const labels = props.chartData.map(item => item.week || '')
  const data = props.chartData.map(item => item.count || 0)
  
  return {
    labels,
    datasets: [
      {
        label: 'Completed Tasks',
        data,
        fill: false,
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        tension: 0.3,
        pointRadius: 4,
        pointBackgroundColor: '#ef4444',
        pointBorderColor: '#fff',
        pointBorderWidth: 2
      }
    ]
  }
})
</script>