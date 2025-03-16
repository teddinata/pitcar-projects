<!-- src/components/charts/TaskStatusChart.vue -->
<template>
  <div class="h-full w-full">
    <Bar 
      :data="chartData" 
      :options="chartOptions"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

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
  scales: {
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: 'Number of Tasks'
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
      display: false
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

// Status colors
const statusColors = {
  'draft': '#6b7280',        // gray
  'in_progress': '#3b82f6',  // blue
  'review': '#f59e0b',       // amber
  'revision': '#f97316',     // orange
  'done': '#10b981',         // emerald
  'cancelled': '#ef4444'     // red
}

// Status display names
const statusLabels = {
  'draft': 'Draft',
  'in_progress': 'In Progress',
  'review': 'In Review',
  'revision': 'In Revision',
  'done': 'Done',
  'cancelled': 'Cancelled'
}

// Transform props data for the chart
const chartData = computed(() => {
  // Sort data to ensure consistent order
  const sortedData = [...props.chartData].sort((a, b) => {
    const statusOrder = ['draft', 'in_progress', 'review', 'revision', 'done', 'cancelled']
    return statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status)
  })
  
  const labels = sortedData.map(item => statusLabels[item.status] || item.status)
  const data = sortedData.map(item => item.count || 0)
  
  // Get colors based on status
  const backgroundColor = sortedData.map(item => {
    return statusColors[item.status] || '#6b7280'
  })
  
  return {
    labels,
    datasets: [
      {
        data,
        backgroundColor,
        borderColor: backgroundColor,
        borderWidth: 1,
        borderRadius: 4,
        maxBarThickness: 50
      }
    ]
  }
})
</script>