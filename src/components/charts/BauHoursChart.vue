<!-- src/components/charts/BauHoursChart.vue -->
<template>
  <div class="h-full w-full">
    <Doughnut 
      :data="chartData" 
      :options="chartOptions"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Doughnut } from 'vue-chartjs'
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
  cutout: '65%',
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
          return `${label}: ${value} hours (${percentage}%)`;
        }
      }
    }
  }
}

// Activity type colors
const typeColors = {
  'video': '#3b82f6',     // blue
  'design': '#8b5cf6',    // purple
  'meeting': '#f59e0b',   // amber
  'training': '#10b981',  // emerald
  'admin': '#6366f1',     // indigo
  'other': '#6b7280'      // gray
}

// Activity type display names
const typeLabels = {
  'video': 'Video Related',
  'design': 'Design Related',
  'meeting': 'Meetings',
  'training': 'Training',
  'admin': 'Administration',
  'other': 'Other BAU'
}

// Transform props data for the chart
const chartData = computed(() => {
  const labels = props.chartData.map(item => typeLabels[item.type] || item.type)
  const data = props.chartData.map(item => item.hours || 0)
  
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