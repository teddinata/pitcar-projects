<template>
  <div class="min-h-screen bg-gray-50 py-6">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Time Reports</h1>
        <div class="flex space-x-2">
          <router-link 
            to="/tasks/timesheets" 
            class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <ClockIcon class="h-4 w-4 mr-1" />
            Timesheets
          </router-link>
          <button
            @click="exportReport"
            :disabled="loading || reportData.length === 0"
            class="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white disabled:bg-gray-400 bg-red-600 hover:bg-red-700"
          >
            <DownloadIcon class="h-4 w-4 mr-1" />
            Export
          </button>
        </div>
      </div>

      <!-- Report Filters -->
      <div class="bg-white shadow rounded-lg mb-6 p-4">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label for="report-type" class="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
            <select
              id="report-type"
              v-model="reportType"
              class="focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-300 rounded-md"
            >
              <option value="employee">By Employee</option>
              <option value="project">By Project</option>
              <option value="task">By Task</option>
              <option value="date">By Date</option>
            </select>
          </div>
          
          <div>
            <label for="date-range" class="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
            <div class="grid grid-cols-2 gap-2">
              <input
                id="date-from"
                v-model="dateFrom"
                type="date"
                class="focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
              <input
                id="date-to"
                v-model="dateTo"
                type="date"
                class="focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>
          
          <div>
            <label for="employee-filter" class="block text-sm font-medium text-gray-700 mb-1">Employee</label>
            <select
              id="employee-filter"
              v-model="employeeFilter"
              class="focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-300 rounded-md"
            >
              <option value="">All Employees</option>
              <option v-for="employee in employees" :key="employee.id" :value="employee.id">
                {{ employee.name }}
              </option>
            </select>
          </div>
          
          <div>
            <label for="project-filter" class="block text-sm font-medium text-gray-700 mb-1">Project</label>
            <select
              id="project-filter"
              v-model="projectFilter"
              class="focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-300 rounded-md"
            >
              <option value="">All Projects</option>
              <option v-for="project in projects" :key="project.id" :value="project.id">
                {{ project.name }}
              </option>
            </select>
          </div>
        </div>
        
        <div class="mt-4 flex justify-end">
          <button
            @click="generateReport"
            :disabled="loading"
            class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white disabled:bg-gray-400 bg-red-600 hover:bg-red-700"
          >
            <RefreshCwIcon v-if="!loading" class="h-4 w-4 mr-1" />
            <Loader2Icon v-else class="h-4 w-4 mr-1 animate-spin" />
            {{ loading ? 'Generating...' : 'Generate Report' }}
          </button>
        </div>
      </div>

      <!-- Report Visualization -->
      <div class="bg-white shadow rounded-lg mb-6 p-4">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-medium text-gray-900">{{ reportTitle }}</h2>
          <div class="flex space-x-2">
            <button
              @click="viewMode = 'chart'"
              :disabled="reportData.length === 0"
              class="px-3 py-1 text-sm rounded-md disabled:opacity-50"
              :class="viewMode === 'chart' ? 'bg-red-100 text-red-800' : 'text-gray-600 hover:bg-gray-100'"
            >
              <BarChart3Icon class="h-4 w-4 inline-block mr-1" />
              Chart
            </button>
            <button
              @click="viewMode = 'table'"
              :disabled="reportData.length === 0"
              class="px-3 py-1 text-sm rounded-md disabled:opacity-50"
              :class="viewMode === 'table' ? 'bg-red-100 text-red-800' : 'text-gray-600 hover:bg-gray-100'"
            >
              <TableIcon class="h-4 w-4 inline-block mr-1" />
              Table
            </button>
          </div>
        </div>
        
        <div v-if="loading" class="flex justify-center py-8">
          <Loader2Icon class="h-8 w-8 text-red-600 animate-spin" />
        </div>

        <div v-else-if="reportData.length === 0" class="py-8 text-center">
          <ClipboardIcon class="mx-auto h-12 w-12 text-gray-300" />
          <h3 class="mt-2 text-sm font-medium text-gray-900">Tidak ada data yang tersedia.</h3>
          <p class="mt-1 text-sm text-gray-500">
            Silahkan pilih filter yang ingin digunakan dan klik tombol "Generate Report" untuk menampilkan data.
          </p>
        </div>

        <div v-else>
          <!-- Chart View -->
          <div v-if="viewMode === 'chart'" class="h-80">
            <canvas ref="reportChart" width="400" height="200"></canvas>
          </div>
          
          <!-- Table View -->
          <div v-else class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th v-for="column in reportColumns" :key="column.key" 
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {{ column.name }}
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="(row, index) in reportData" :key="index" class="hover:bg-gray-50">
                  <td v-for="column in reportColumns" :key="column.key" class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm" :class="column.key === 'hours' ? 'font-medium text-gray-900' : 'text-gray-500'">
                      {{ formatColumnValue(row[column.key], column.type) }}
                    </div>
                  </td>
                </tr>
              </tbody>
              <tfoot class="bg-gray-50">
                <tr>
                  <td v-for="(column, index) in reportColumns" :key="column.key" 
                      class="px-6 py-3 text-sm font-medium"
                      :class="index === 0 ? 'text-gray-500 text-right' : 'text-left'">
                    {{ index === 0 ? 'Total:' : (column.key === 'hours' ? totalHours.toFixed(1) : '') }}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>

      <!-- Summary Cards -->
      <div v-if="reportData.length > 0" class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-white shadow rounded-lg p-4">
          <h3 class="text-sm font-medium text-gray-500 mb-2">Time Distribution</h3>
          <div class="space-y-2">
            <div v-for="(item, index) in summaryData" :key="index" class="flex items-center">
              <div class="w-24 text-sm text-gray-600 truncate" :title="item.name">{{ item.name }}</div>
              <div class="flex-1 h-4 bg-gray-200 rounded-full">
                <div 
                  class="h-4 rounded-full bg-red-600" 
                  :style="{ width: `${item.percentage}%` }"
                ></div>
              </div>
              <div class="w-16 text-right text-sm text-gray-900">{{ item.hours.toFixed(1) }}h</div>
              <div class="w-16 text-right text-xs text-gray-500">{{ item.percentage.toFixed(0) }}%</div>
            </div>
          </div>
        </div>
        
        <div class="bg-white shadow rounded-lg p-4">
          <h3 class="text-sm font-medium text-gray-500 mb-2">Daily Average</h3>
          <div class="flex items-end space-x-1 h-36 mt-4 px-2">
            <div v-for="(day, index) in dailyData" :key="index" class="flex-1 flex flex-col items-center">
              <div class="bg-red-600 w-full rounded-t" :style="{ height: `${day.heightPercentage}%` }"></div>
              <div class="text-xs text-gray-500 mt-1">{{ day.label }}</div>
              <div class="text-xs text-gray-800 mt-0.5">{{ day.hours.toFixed(1) }}</div>
            </div>
          </div>
          <div class="text-center mt-2 text-sm text-gray-600">
            Average: {{ dailyAverage.toFixed(1) }} hours per day
          </div>
        </div>
        
        <div class="bg-white shadow rounded-lg p-4">
          <h3 class="text-sm font-medium text-gray-500 mb-2">Productivity Metrics</h3>
          <div class="space-y-4 mt-4">
            <div>
              <div class="flex justify-between mb-1">
                <span class="text-sm text-gray-600">Completion Rate</span>
                <span class="text-sm font-medium text-gray-900">{{ productivityMetrics.completionRate }}%</span>
              </div>
              <div class="w-full h-2 bg-gray-200 rounded-full">
                <div 
                  class="h-2 rounded-full bg-green-500" 
                  :style="{ width: `${productivityMetrics.completionRate}%` }"
                ></div>
              </div>
            </div>
            
            <div>
              <div class="flex justify-between mb-1">
                <span class="text-sm text-gray-600">Utilization</span>
                <span class="text-sm font-medium text-gray-900">{{ productivityMetrics.utilization }}%</span>
              </div>
              <div class="w-full h-2 bg-gray-200 rounded-full">
                <div 
                  class="h-2 rounded-full bg-blue-500" 
                  :style="{ width: `${productivityMetrics.utilization}%` }"
                ></div>
              </div>
            </div>
            
            <div>
              <div class="flex justify-between mb-1">
                <span class="text-sm text-gray-600">Efficiency</span>
                <span class="text-sm font-medium text-gray-900">{{ productivityMetrics.efficiency }}%</span>
              </div>
              <div class="w-full h-2 bg-gray-200 rounded-full">
                <div 
                  class="h-2 rounded-full bg-purple-500" 
                  :style="{ width: `${productivityMetrics.efficiency}%` }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Toast notification -->
    <div v-if="toast.show" 
      class="fixed bottom-4 right-4 px-4 py-2 rounded-lg shadow-lg animate-fade-in-up"
      :class="{
        'bg-green-100 text-green-800': toast.type === 'success',
        'bg-blue-100 text-blue-800': toast.type === 'info',
        'bg-yellow-100 text-yellow-800': toast.type === 'warning',
        'bg-red-100 text-red-800': toast.type === 'error'
      }"
    >
      {{ toast.message }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import { useToast } from '@/composables/useToast';
import apiClient from '@/config/api';
import Chart from 'chart.js/auto';
import { 
  BarChart3 as BarChart3Icon, 
  Table as TableIcon, 
  Download as DownloadIcon, 
  RefreshCw as RefreshCwIcon, 
  Clock as ClockIcon,
  ClipboardList as ClipboardIcon,
  Loader2 as Loader2Icon
} from 'lucide-vue-next';

const { toast, showToast } = useToast();

// State
const loading = ref(false);
const reportType = ref('employee');
const dateFrom = ref('');
const dateTo = ref('');
const employeeFilter = ref('');
const projectFilter = ref('');
const viewMode = ref('table'); // Default to table view, chart only loads when needed
const employees = ref([]);
const projects = ref([]);
const reportData = ref([]);
const reportChart = ref(null);
let chart = null; // Will hold the chart instance
let initialLoadDone = false; // Flag to track if initial load has been done

// Computed properties
const reportTitle = computed(() => {
  const typeTitles = {
    'employee': 'Time Spent by Employee',
    'project': 'Time Spent by Project',
    'task': 'Time Spent by Task',
    'date': 'Time Spent by Date'
  };
  
  let title = typeTitles[reportType.value] || 'Time Report';
  
  if (dateFrom.value && dateTo.value) {
    title += ` (${formatDate(dateFrom.value)} - ${formatDate(dateTo.value)})`;
  }
  
  return title;
});

const reportColumns = computed(() => {
  switch (reportType.value) {
    case 'employee':
      return [
        { key: 'name', name: 'Employee', type: 'text' },
        { key: 'hours', name: 'Hours', type: 'number' },
        { key: 'percentage', name: 'Percentage', type: 'percentage' },
        { key: 'taskCount', name: 'Tasks', type: 'number' }
      ];
    case 'project':
      return [
        { key: 'name', name: 'Project', type: 'text' },
        { key: 'hours', name: 'Hours', type: 'number' },
        { key: 'percentage', name: 'Percentage', type: 'percentage' },
        { key: 'employeeCount', name: 'Employees', type: 'number' }
      ];
    case 'task':
      return [
        { key: 'name', name: 'Task', type: 'text' },
        { key: 'project', name: 'Project', type: 'text' },
        { key: 'employee', name: 'Employee', type: 'text' },
        { key: 'hours', name: 'Hours', type: 'number' }
      ];
    case 'date':
      return [
        { key: 'date', name: 'Date', type: 'date' },
        { key: 'hours', name: 'Hours', type: 'number' },
        { key: 'taskCount', name: 'Tasks', type: 'number' },
        { key: 'employeeCount', name: 'Employees', type: 'number' }
      ];
    default:
      return [];
  }
});

const totalHours = computed(() => {
  return reportData.value.reduce((total, item) => total + (parseFloat(item.hours) || 0), 0);
});

const summaryData = computed(() => {
  if (reportData.value.length === 0) return [];
  
  // Create a summary based on report type
  switch (reportType.value) {
    case 'employee':
    case 'project':
      return reportData.value.map(item => ({
        name: item.name,
        hours: parseFloat(item.hours) || 0,
        percentage: (parseFloat(item.hours) / totalHours.value) * 100 || 0
      }));
    case 'task':
      // Group by project
      const projectGroups = {};
      reportData.value.forEach(item => {
        if (!projectGroups[item.project]) {
          projectGroups[item.project] = { name: item.project, hours: 0 };
        }
        projectGroups[item.project].hours += parseFloat(item.hours) || 0;
      });
      
      return Object.values(projectGroups).map(item => ({
        name: item.name,
        hours: item.hours,
        percentage: (item.hours / totalHours.value) * 100 || 0
      }));
    case 'date':
      // Group by week
      const weeks = {};
      reportData.value.forEach(item => {
        const date = new Date(item.date);
        const weekNum = getWeekNumber(date);
        const weekKey = `Week ${weekNum}`;
        
        if (!weeks[weekKey]) {
          weeks[weekKey] = { name: weekKey, hours: 0 };
        }
        weeks[weekKey].hours += parseFloat(item.hours) || 0;
      });
      
      return Object.values(weeks).map(item => ({
        name: item.name,
        hours: item.hours,
        percentage: (item.hours / totalHours.value) * 100 || 0
      }));
    default:
      return [];
  }
});

const dailyData = computed(() => {
  if (!analysisData.value || !analysisData.value.daily_distribution) {
    return [
      { label: 'Mon', hours: 0, heightPercentage: 0 },
      { label: 'Tue', hours: 0, heightPercentage: 0 },
      { label: 'Wed', hours: 0, heightPercentage: 0 },
      { label: 'Thu', hours: 0, heightPercentage: 0 },
      { label: 'Fri', hours: 0, heightPercentage: 0 },
      { label: 'Sat', hours: 0, heightPercentage: 0 },
      { label: 'Sun', hours: 0, heightPercentage: 0 }
    ];
  }
  
  return analysisData.value.daily_distribution;
});

const dailyAverage = computed(() => {
  // Calculate average excluding weekends
  const workdayData = dailyData.value.slice(0, 5);
  return workdayData.reduce((sum, day) => sum + day.hours, 0) / workdayData.length;
});

const analysisData = ref({
  daily_distribution: [],
  productivity_metrics: {
    completionRate: 0,
    utilization: 0,
    efficiency: 0
  },
  summary_distribution: []
});

const productivityMetrics = computed(() => {
  if (!analysisData.value || !analysisData.value.productivity_metrics) {
    return {
      completionRate: 0,
      utilization: 0,
      efficiency: 0
    };
  }
  
  return analysisData.value.productivity_metrics;
});

// Methods
// Fungsi untuk menginisialisasi rentang tanggal default
// Fungsi untuk menginisialisasi rentang tanggal default - memperbaiki masalah tanggal
// Alternatif fungsi untuk menginisialisasi rentang tanggal - lebih eksplisit
// Fungsi dengan perhitungan manual untuk bulan
const initDateRange = () => {
  const now = new Date();
  
  // Mendapatkan tahun dan bulan saat ini
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // Konversi ke 1-indexed (1 = Jan, 12 = Dec)
  
  // Fungsi untuk menambahkan padding nol pada angka jika kurang dari 10
  const padZero = (num) => num < 10 ? `0${num}` : num;
  
  // Mendapatkan jumlah hari dalam bulan saat ini
  const getDaysInMonth = (year, month) => {
    // month disini sudah 1-indexed
    const monthsWith31Days = [1, 3, 5, 7, 8, 10, 12];
    const monthsWith30Days = [4, 6, 9, 11];
    
    if (monthsWith31Days.includes(month)) {
      return 31;
    } else if (monthsWith30Days.includes(month)) {
      return 30;
    } else {
      // Februari: periksa tahun kabisat
      return ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) ? 29 : 28;
    }
  };
  
  // Hitung jumlah hari dalam bulan
  const daysInCurrentMonth = getDaysInMonth(currentYear, currentMonth);
  
  // Format tanggal: YYYY-MM-DD
  const firstDayStr = `${currentYear}-${padZero(currentMonth)}-01`;
  const lastDayStr = `${currentYear}-${padZero(currentMonth)}-${daysInCurrentMonth}`;
  
  // Set nilai
  dateFrom.value = firstDayStr;
  dateTo.value = lastDayStr;
  
  console.log(`Current month: ${currentMonth}/${currentYear}`);
  console.log(`Days in current month: ${daysInCurrentMonth}`);
  console.log(`Date range: ${firstDayStr} to ${lastDayStr}`);
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
};

const getWeekNumber = (date) => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
};

const formatColumnValue = (value, type) => {
  if (value === undefined || value === null) return '';
  
  switch (type) {
    case 'number':
      return typeof value === 'number' ? value.toFixed(1) : value;
    case 'percentage':
      return typeof value === 'number' ? `${value.toFixed(1)}%` : value;
    case 'date':
      return formatDate(value);
    default:
      return value;
  }
};

const fetchEmployees = async () => {
  try {
    const response = await apiClient.post('/web/session/get_employees', {
      jsonrpc: '2.0',
      method: 'call'
    });
    
    if (response.data.result && response.data.result.status === 'success') {
      employees.value = response.data.result.data || [];
    } else {
      console.error('Error fetching employees:', response.data.result?.message);
    }
  } catch (error) {
    console.error('Error fetching employees:', error);
  }
};

const fetchProjects = async () => {
  try {
    const response = await apiClient.post('/web/v2/team/projects/list', {
      jsonrpc: '2.0',
      method: 'call',
      params: {}
    });
    
    if (response.data.result && response.data.result.status === 'success') {
      projects.value = response.data.result.data || [];
    } else {
      console.error('Error fetching projects:', response.data.result?.message);
    }
  } catch (error) {
    console.error('Error fetching projects:', error);
  }
};

const fetchTimesheetAnalytics = async () => {
  try {
    const params = {
      context_type: reportType.value
    };
    
    if (dateFrom.value) params.date_from = dateFrom.value;
    if (dateTo.value) params.date_to = dateTo.value;
    if (employeeFilter.value) params.employee_id = employeeFilter.value;
    if (projectFilter.value) params.project_id = projectFilter.value;
    
    const response = await apiClient.post('/web/v2/team/reports/timesheet/analytics', {
      jsonrpc: '2.0',
      method: 'call',
      params: params
    });
    
    if (response.data.result && response.data.result.status === 'success') {
      analysisData.value = response.data.result.data || {};
    } else {
      console.error('Error fetching timesheet analytics:', response.data.result?.message);
    }
  } catch (error) {
    console.error('Error fetching timesheet analytics:', error);
  }
};

const generateReport = async () => {
  if (!dateFrom.value || !dateTo.value) {
    showToast({
      message: 'Please select a date range for the report',
      type: 'warning'
    });
    return;
  }
  
  loading.value = true;
  
  try {
    // Call the API endpoint we created
    const params = {
      report_type: reportType.value
    };
    
    if (dateFrom.value) params.date_from = dateFrom.value;
    if (dateTo.value) params.date_to = dateTo.value;
    if (employeeFilter.value) params.employee_id = employeeFilter.value;
    if (projectFilter.value) params.project_id = projectFilter.value;
    
    const response = await apiClient.post('/web/v2/team/reports/timesheet', {
      jsonrpc: '2.0',
      method: 'call',
      params: params
    });
    
    if (response.data.result && response.data.result.status === 'success') {
      reportData.value = response.data.result.data || [];
      
      // Also fetch analytics data 
      await fetchTimesheetAnalytics();
      
      // Only render chart if in chart view
      if (viewMode.value === 'chart') {
        nextTick(() => {
          renderChart();
        });
      }
      
      initialLoadDone = true;
      
      showToast({
        message: 'Report generated successfully',
        type: 'success'
      });
    } else {
      console.error('Error generating report:', response.data.result?.message);
      showToast({
        message: 'Failed to generate report: ' + (response.data.result?.message || 'Unknown error'),
        type: 'error'
      });
      reportData.value = [];
    }
  } catch (error) {
    console.error('Error generating report:', error);
    showToast({
      message: 'Failed to generate report. Please try again.',
      type: 'error'
    });
    reportData.value = [];
  } finally {
    loading.value = false;
  }
};

const renderChart = () => {
  if (!reportChart.value) return;
  
  // If chart already exists, destroy it
  if (chart) {
    chart.destroy();
  }
  
  let labels = [];
  let values = [];
  
  // Prepare data based on report type
  switch (reportType.value) {
    case 'employee':
    case 'project':
      labels = reportData.value.map(item => item.name);
      values = reportData.value.map(item => item.hours);
      break;
    case 'task':
      labels = reportData.value.map(item => item.name);
      values = reportData.value.map(item => item.hours);
      break;
    case 'date':
      labels = reportData.value.map(item => formatDate(item.date));
      values = reportData.value.map(item => item.hours);
      break;
    default:
      labels = [];
      values = [];
  }
  
  const ctx = reportChart.value.getContext('2d');
  chart = new Chart(ctx, {
    type: reportType.value === 'date' ? 'line' : 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Hours',
        data: values,
        backgroundColor: 'rgba(220, 38, 38, 0.8)',
        borderColor: reportType.value === 'date' ? 'rgba(220, 38, 38, 1)' : undefined,
        tension: reportType.value === 'date' ? 0.3 : undefined,
        fill: reportType.value === 'date'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const value = context.raw;
              return `Hours: ${value.toFixed(1)}`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Hours'
          }
        }
      }
    }
  });
};

const exportReport = async () => {
  if (reportData.value.length === 0) {
    showToast({
      message: 'Generate a report first before exporting',
      type: 'warning'
    });
    return;
  }
  
  try {
    showToast({
      message: 'Preparing report export...',
      type: 'info'
    });
    
    const params = {
      operation: 'export',
      report_type: reportType.value,
      format: 'csv'
    };
    
    if (dateFrom.value) params.date_from = dateFrom.value;
    if (dateTo.value) params.date_to = dateTo.value;
    if (employeeFilter.value) params.employee_id = employeeFilter.value;
    if (projectFilter.value) params.project_id = projectFilter.value;
    
    const response = await apiClient.post('/web/v2/team/reports/timesheet/export', {
      jsonrpc: '2.0',
      method: 'call',
      params: params
    });
    
    if (response.data.result && response.data.result.status === 'success' && response.data.result.data) {
      // Create a Blob with the CSV data
      const blob = new Blob([response.data.result.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      
      // Create a link element to trigger download
      const a = document.createElement('a');
      a.href = url;
      a.download = `timesheet-report-${reportType.value}-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      showToast({
        message: 'Report exported successfully',
        type: 'success'
      });
    } else {
      showToast({
        message: 'Failed to export report: ' + (response.data.result?.message || 'Unknown error'),
        type: 'error'
      });
    }
  } catch (error) {
    console.error('Error exporting report:', error);
    showToast({
      message: 'Failed to export report. Please try again.',
      type: 'error'
    });
  }
};

// Watch for changes in viewMode to render chart when switching to chart view
watch(viewMode, (newMode) => {
  if (newMode === 'chart' && reportData.value.length > 0) {
    nextTick(() => {
      renderChart();
    });
  }
});

// Watch for changes in reportType to update UI accordingly
watch(reportType, () => {
  // Don't automatically regenerate report when changing type unless initial load is done
  if (initialLoadDone && reportData.value.length > 0) {
    // Reset view to table when changing report type
    viewMode.value = 'table';
  }
});

// Lifecycle hooks
onMounted(() => {
  initDateRange();
  
  // Load reference data (employees, projects) first
  Promise.all([
    fetchEmployees(),
    fetchProjects()
  ]).then(() => {
    // Don't automatically generate report on load, wait for user action
    // This improves initial page load time and avoids unnecessary API calls
  });
});
</script>

<style scoped>
/* Add some fade-in animation for toast */
@keyframes fade-in-up {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.3s ease-out;
}
</style>