<!-- src/components/charts/ActivityTypeChart.vue -->
<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-medium leading-6 text-gray-900">{{ isActivitiesCount ? 'Aktivitas berdasarkan Jenis' : 'Jam berdasarkan Jenis' }}</h3>
      <div class="flex space-x-3">
        <button @click="chartType = 'pie'" :class="[
          'px-2 py-1 text-xs rounded-md transition-colors duration-200',
          chartType === 'pie' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        ]">
          Pie
        </button>
        <button @click="chartType = 'doughnut'" :class="[
          'px-2 py-1 text-xs rounded-md transition-colors duration-200',
          chartType === 'doughnut' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        ]">
          Donut
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
    type: Object,
    required: true
  },
  isActivitiesCount: {
    type: Boolean,
    default: false
  }
});

const chartCanvas = ref(null);
const chartInstance = ref(null);
const chartType = ref('doughnut');

// Activity type translations
const getTranslatedActivityType = (type) => {
  if (!type) return 'Lainnya';
  
  const translations = {
    'meeting': 'Rapat',
    'training': 'Pelatihan',
    'documentation': 'Dokumentasi',
    'support': 'Support',
    'admin': 'Administrasi',
    'planning': 'Perencanaan',
    'other': 'Lainnya',
    'design': 'Desain',
    'video': 'Video',
    'reporting': 'Pelaporan'
  };
  
  return translations[type.toLowerCase()] || type;
};

// Colors for chart segments
const chartColors = [
  'rgba(239, 68, 68, 0.7)',   // red
  'rgba(59, 130, 246, 0.7)',  // blue
  'rgba(16, 185, 129, 0.7)',  // green
  'rgba(245, 158, 11, 0.7)',  // yellow
  'rgba(139, 92, 246, 0.7)',  // purple
  'rgba(236, 72, 153, 0.7)',  // pink
  'rgba(14, 165, 233, 0.7)',  // sky
  'rgba(168, 85, 247, 0.7)',  // indigo
  'rgba(249, 115, 22, 0.7)',  // orange
  'rgba(20, 184, 166, 0.7)'   // teal
];

const chartData = computed(() => {
  const formattedData = Object.entries(props.data).map(([key, value], index) => ({
    type: getTranslatedActivityType(key),
    value,
    color: chartColors[index % chartColors.length]
  }));
  
  // Sort by value in descending order
  const sortedData = formattedData.sort((a, b) => b.value - a.value);
  
  return {
    labels: sortedData.map(item => item.type),
    values: sortedData.map(item => item.value),
    colors: sortedData.map(item => item.color)
  };
});

const renderChart = () => {
  if (chartInstance.value) {
    chartInstance.value.destroy();
  }
  
  const ctx = chartCanvas.value.getContext('2d');
  const { labels, values, colors } = chartData.value;
  
  let config;
  
  if (chartType.value === 'bar') {
    config = {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: props.isActivitiesCount ? 'Jumlah Aktivitas' : 'Jam',
          data: values,
          backgroundColor: colors,
          borderColor: colors.map(color => color.replace('0.7', '1')),
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                let label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                label += context.formattedValue;
                return label;
              }
            }
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            title: {
              display: true,
              text: props.isActivitiesCount ? 'Jumlah Aktivitas' : 'Jam'
            }
          }
        }
      }
    };
  } else {
    config = {
      type: chartType.value,
      data: {
        labels,
        datasets: [{
          data: values,
          backgroundColor: colors,
          borderColor: colors.map(color => color.replace('0.7', '1')),
          borderWidth: 1,
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              usePointStyle: true,
              boxWidth: 6
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.formattedValue;
                const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                const percentage = Math.round((context.raw / total) * 100);
                return `${label}: ${value} (${percentage}%)`;
              }
            }
          }
        }
      }
    };
  }
  
  chartInstance.value = new Chart(ctx, config);
};

watch(() => props.data, () => {
  if (props.data && Object.keys(props.data).length > 0) {
    renderChart();
  }
}, { deep: true });

watch(chartType, () => {
  renderChart();
});

onMounted(() => {
  if (props.data && Object.keys(props.data).length > 0) {
    renderChart();
  }
});
</script>