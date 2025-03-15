<!-- src/components/charts/RealizationTrendChart.vue -->
<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-medium leading-6 text-gray-900">Tren Realisasi Aktivitas</h3>
      <div class="flex space-x-3">
        <button @click="chartType = 'line'" :class="[
          'px-2 py-1 text-xs rounded-md transition-colors duration-200',
          chartType === 'line' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        ]">
          Line
        </button>
        <button @click="chartType = 'bar'" :class="[
          'px-2 py-1 text-xs rounded-md transition-colors duration-200',
          chartType === 'bar' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        ]">
          Bar
        </button>
      </div>
    </div>
    <div class="bg-white rounded-lg">
      <div class="h-64">
        <canvas ref="chartCanvas"></canvas>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import Chart from 'chart.js/auto';

const props = defineProps({
  data: {
    type: Array,
    required: true
  }
});

const chartCanvas = ref(null);
const chartInstance = ref(null);
const chartType = ref('line');

const chartData = computed(() => {
  // Sort data by date
  const sortedData = [...props.data].sort((a, b) => new Date(a.date) - new Date(b.date));
  
  // Format dates to be more readable: DD/MM
  const labels = sortedData.map(item => {
    const date = new Date(item.date);
    return `${date.getDate()}/${date.getMonth() + 1}`;
  });
  
  // Calculate realization rates
  const realizationRates = sortedData.map(item => item.realizationRate || 0);
  
  // Count of activities per day
  const activityCounts = sortedData.map(item => item.totalActivities || 0);
  
  // Count of completed activities per day
  const completedCounts = sortedData.map(item => item.completedActivities || 0);
  
  return {
    labels,
    realizationRates,
    activityCounts,
    completedCounts
  };
});

const renderChart = () => {
  if (chartInstance.value) {
    chartInstance.value.destroy();
  }
  
  const ctx = chartCanvas.value.getContext('2d');
  const { labels, realizationRates, activityCounts, completedCounts } = chartData.value;
  
  let datasets = [];
  let options = {};
  
  // Configure based on chart type
  if (chartType.value === 'line') {
    datasets = [
      {
        label: 'Tingkat Realisasi (%)',
        data: realizationRates,
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.3,
        fill: true,
        yAxisID: 'y'
      },
      {
        label: 'Total Aktivitas',
        data: activityCounts,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderDash: [5, 5],
        tension: 0.3,
        fill: false,
        yAxisID: 'y1'
      },
      {
        label: 'Aktivitas Selesai',
        data: completedCounts,
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderDash: [3, 3],
        tension: 0.3,
        fill: false,
        yAxisID: 'y1'
      }
    ];
    
    options = {
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          title: {
            display: true,
            text: 'Realisasi (%)'
          }
        },
        y1: {
          position: 'right',
          beginAtZero: true,
          grid: {
            drawOnChartArea: false
          },
          title: {
            display: true,
            text: 'Jumlah Aktivitas'
          }
        }
      }
    };
  } else {
    // Bar chart with grouped bars
    datasets = [
      {
        label: 'Aktivitas Selesai',
        data: completedCounts,
        backgroundColor: 'rgba(16, 185, 129, 0.7)',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 1,
        stack: 'Stack 0'
      },
      {
        label: 'Aktivitas Belum Selesai',
        data: activityCounts.map((total, i) => total - completedCounts[i]),
        backgroundColor: 'rgba(239, 68, 68, 0.7)',
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 1,
        stack: 'Stack 0'
      },
      {
        label: 'Tingkat Realisasi (%)',
        data: realizationRates,
        backgroundColor: 'rgba(245, 158, 11, 0.7)',
        borderColor: 'rgb(245, 158, 11)',
        borderWidth: 1,
        stack: 'Stack 1',
        type: 'line',
        yAxisID: 'y1',
        tension: 0.3
      }
    ];
    
    options = {
      scales: {
        y: {
          beginAtZero: true,
          stacked: true,
          title: {
            display: true,
            text: 'Jumlah Aktivitas'
          }
        },
        y1: {
          position: 'right',
          beginAtZero: true,
          max: 100,
          grid: {
            drawOnChartArea: false
          },
          title: {
            display: true,
            text: 'Realisasi (%)'
          }
        }
      }
    };
  }
  
  // Create chart
  chartInstance.value = new Chart(ctx, {
    type: chartType.value === 'line' ? 'line' : 'bar',
    data: {
      labels,
      datasets
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            usePointStyle: true,
            boxWidth: 6
          }
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          callbacks: {
            label: function(context) {
              let label = context.dataset.label || '';
              if (label) {
                label += ': ';
              }
              
              if (context.dataset.label.includes('%')) {
                label += context.raw + '%';
              } else {
                label += context.raw;
              }
              return label;
            }
          }
        }
      },
      interaction: {
        mode: 'index',
        intersect: false
      },
      ...options
    }
  });
};

watch(() => props.data, () => {
  if (props.data && props.data.length > 0) {
    renderChart();
  }
}, { deep: true });

watch(chartType, () => {
  renderChart();
});

onMounted(() => {
  if (props.data && props.data.length > 0) {
    renderChart();
  }
});
</script>