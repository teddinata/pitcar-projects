<!-- src/components/charts/TaskTypesChart.vue -->
<template>
  <div class="h-full w-full">
    <Pie 
      :data="chartData" 
      :options="chartOptions"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Pie } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend)

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
  plugins: {
    legend: {
      position: 'right',
      labels: {
        boxWidth: 12,
        padding: 15
      }
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      padding: 10,
      titleColor: '#fff',
      bodyColor: '#fff',
      borderColor: 'rgba(255, 255, 255, 0.2)',
      borderWidth: 1,
      callbacks: {
        label: function(context) {
          const label = context.label || '';
          const value = context.parsed || 0;
          const dataset = context.dataset;
          const total = dataset.data.reduce((acc, data) => acc + data, 0);
          const percentage = Math.round((value / total) * 100);
          return `${label}: ${value} (${percentage}%)`;
        }
      }
    }
  }
}

// Task type colors
const typeColors = {
  'video': '#3b82f6', // blue
  'design': '#8b5cf6', // purple
  'other': '#6b7280'  // gray
}

// Transform props data for the chart
const chartData = computed(() => {
  const labels = props.chartData.map(item => item.type || '')
  const data = props.chartData.map(item => item.count || 0)
  
  // Get colors based on type
  const backgroundColor = props.chartData.map(item => {
    const type = item.type || 'other'
    return typeColors[type.toLowerCase()] || typeColors.other
  })
  
  return {
    labels,
    datasets: [
      {
        data,
        backgroundColor,
        borderColor: '#ffffff',
        borderWidth: 2,
        hoverOffset: 10
      }
    ]
  }
})
</script>