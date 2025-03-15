<template>
  <div class="min-h-screen bg-gray-50">
    <Toast
      v-model:show="toast.show"
      :message="toast.message"
      :type="toast.type"
      :duration="toast.duration"
    />
    <!-- Header with Filters -->
    <div class="bg-white shadow">
      <div class="w-full max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
          <!-- Title -->
          <h1 class="text-xl sm:text-2xl font-semibold text-gray-900">Service Advisor Performance</h1>
          
          <!-- Controls -->
          <div class="flex flex-col space-y-3 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
            <!-- Date Range Filter -->
            <select
              v-model="selectedRange"
              @change="handleDateRangeChange"
              class="w-full sm:w-auto rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="this_week">This Week</option>
              <option value="this_month">This Month</option>
              <option value="this_year">This Year</option>
              <option value="custom">Custom Range</option>
            </select>

            <!-- Date Picker -->
            <DateRangePicker
              v-if="showDatePicker"
              v-model="dateRange"
              @update:modelValue="handleCustomDateChange"
              @close="showDatePicker = false"
              class="w-full sm:w-auto"
            />

            <!-- Date Display -->
            <div class="bg-gray-100 px-3 py-2 rounded-md text-sm text-gray-600 hidden sm:block truncate">
              {{ formattedDateRange }}
            </div>

            <!-- Refresh Button -->
            <button
              @click="refreshData"
              class="w-full sm:w-auto inline-flex justify-center items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <ArrowPathIcon 
                class="h-4 w-4 mr-1.5" 
                :class="{ 'animate-spin': loading }" 
              />
              Refresh
            </button>

             <!-- Reset Button -->
             <button
              @click="resetFilters"
              class="w-full sm:w-auto inline-flex justify-center items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <BackspaceIcon class="h-4 w-4 mr-1.5" />
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <main class="w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <!-- Toast component -->
      
      <div class="space-y-6">
        <!-- Overview Stats -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <!-- Revenue Card -->
          <div class="bg-white rounded-xl shadow-sm p-4 sm:p-6 hover:shadow-md transition-all duration-300 group">
            <div class="flex justify-between items-start">
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-600">Total Revenue</p>
                <p class="mt-2 text-xl sm:text-2xl font-bold text-gray-900 truncate">
                  {{ formatCurrency(dashboardData.overview?.total_revenue) }}
                </p>
                <div class="mt-2 flex items-center text-sm">
                  <InboxStackIcon class="h-4 w-4 text-gray-500 mr-1 flex-shrink-0" />
                  <span class="text-gray-600 truncate">
                    {{ dashboardData.overview?.total_orders }} Orders
                  </span>
                </div>
              </div>
              <div class="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-lg shadow-md group-hover:scale-105 transition-transform">
                <CurrencyDollarIcon class="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <!-- Service Performance Card -->
          <div class="bg-white rounded-xl shadow-sm p-4 sm:p-6 hover:shadow-md transition-all duration-300 group">
            <div class="flex justify-between items-start">
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-600">Service Performance</p>
                <p class="mt-2 text-xl sm:text-2xl font-bold text-gray-900 truncate">
                  {{ formatPercentage(dashboardData.overview?.service_performance?.on_time_rate) }}
                </p>
                <div class="mt-2 flex items-center text-sm">
                  <ClockIcon class="h-4 w-4 text-gray-500 mr-1 flex-shrink-0" />
                  <span class="text-gray-600 truncate">On-time Rate</span>
                </div>
              </div>
              <div class="bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-lg shadow-md group-hover:scale-105 transition-transform">
                <ChartBarIcon class="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <!-- Customer Rating Card -->
          <div class="bg-white rounded-xl shadow-sm p-4 sm:p-6 hover:shadow-md transition-all duration-300 group">
            <div class="flex justify-between items-start">
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-600">Customer Rating</p>
                <div class="mt-2 flex items-center space-x-2">
                  <p class="text-xl sm:text-2xl font-bold text-gray-900">
                    {{ formatNumber(dashboardData.overview?.rating?.average, 1) }}
                  </p>
                  <div class="flex">
                    <StarIcon 
                      v-for="i in 5" 
                      :key="i"
                      :class="[
                        'h-4 w-4 sm:h-5 sm:w-5',
                        i <= Math.round(dashboardData.overview?.rating?.average || 0)
                          ? 'text-yellow-400'
                          : 'text-gray-200'
                      ]"
                    />
                  </div>
                </div>
                <div class="mt-2 flex items-center text-sm">
                  <UserGroupIcon class="h-4 w-4 text-gray-500 mr-1 flex-shrink-0" />
                  <span class="text-gray-600 truncate">Average from {{ dashboardData.overview?.rating?.total_rated_orders }} feedbacks</span>
                </div>
              </div>
              <div class="bg-gradient-to-br from-yellow-400 to-yellow-500 p-3 rounded-lg shadow-md group-hover:scale-105 transition-transform">
                <StarIcon class="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <!-- Complaints Card -->
          <div class="bg-white rounded-xl shadow-sm p-4 sm:p-6 hover:shadow-md transition-all duration-300 group">
            <div class="flex justify-between items-start">
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-600">Complaints</p>
                <p class="mt-2 text-xl sm:text-2xl font-bold text-gray-900 truncate">
                  {{ dashboardData.overview?.complaints?.total }}
                </p>
                <div class="mt-2 flex items-center text-sm">
                  <ExclamationCircleIcon class="h-4 w-4 text-gray-500 mr-1 flex-shrink-0" />
                  <span class="text-gray-600 truncate">
                    Rate: {{ formatPercentage(dashboardData.overview?.complaints?.rate) }}
                  </span>
                </div>
              </div>
              <div class="bg-gradient-to-br from-red-500 to-red-600 p-3 rounded-lg shadow-md group-hover:scale-105 transition-transform">
                <ExclamationTriangleIcon class="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        <!-- Revenue Trends Chart -->
        <div class="bg-white rounded-lg shadow-sm p-4">
          <RevenueTrends 
          :data="dashboardData.trends" 
          :loading="loading"
          :show-on-time-metric="false" 
        />
        </div>

        <!-- Performance Metrics Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <!-- Service Performance Metrics -->
          <!-- <div class="bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4 sm:mb-6">Service Performance</h3>
            <div class="space-y-4 sm:space-y-6">
              <div>
                <div class="flex flex-col sm:flex-row sm:justify-between text-sm mb-2">
                  <span class="text-gray-600">Average Service Time</span>
                  <span class="font-medium mt-1 sm:mt-0">
                    {{ formatNumber(dashboardData.overview?.service_performance?.average_time, 1) }} minutes
                  </span>
                </div>
                <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    class="h-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
                    :style="{ width: `${Math.min((dashboardData.overview?.service_performance?.average_time / 120) * 100, 100)}%` }"
                  ></div>
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="bg-green-50 rounded-lg p-4">
                  <p class="text-sm text-gray-600 mb-1">On-time Services</p>
                  <p class="text-xl font-bold text-green-600">
                    {{ dashboardData.overview?.service_performance?.on_time_services }}
                  </p>
                  <p class="text-sm text-gray-500">
                    of {{ dashboardData.overview?.service_performance?.total_services }} total
                  </p>
                </div>
                <div class="bg-blue-50 rounded-lg p-4">
                  <p class="text-sm text-gray-600 mb-1">On-time Rate</p>
                  <p class="text-xl font-bold text-blue-600">
                    {{ formatPercentage(dashboardData.overview?.service_performance?.on_time_rate) }}
                  </p>
                </div>
              </div>
            </div>
          </div> -->

          <!-- Customer Feedback -->
          <!-- <div class="bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4 sm:mb-6">Customer Feedback</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="bg-yellow-50 rounded-lg p-4">
                <p class="text-sm text-gray-600 mb-1">Average Rating</p>
                <div class="flex items-center">
                  <p class="text-xl font-bold text-yellow-600 mr-2">
                    {{ formatNumber(dashboardData.overview?.average_rating, 1) }}
                  </p>
                  <StarIcon class="h-5 w-5 text-yellow-400" />
                </div>
              </div>
              <div class="bg-red-50 rounded-lg p-4">
                <p class="text-sm text-gray-600 mb-1">Complaint Rate</p>
                <p class="text-xl font-bold text-red-600">
                  {{ formatPercentage(dashboardData.overview?.complaints?.rate) }}
                </p>
              </div>
            </div>
          </div> -->
        </div>

        <!-- Team Performance Section -->
        <div class="bg-white rounded-lg shadow-sm p-4 sm:p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4 sm:mb-6">Team Performance</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div class="bg-blue-50 rounded-lg shadow-sm p-4 sm:p-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4 sm:mb-6">Service Performance</h3>
              <div class="space-y-4 sm:space-y-6">
                <!-- Average Time with Enhanced Bullet Style -->
                <div>
                  <div class="flex flex-col sm:flex-row sm:justify-between text-sm mb-3">
                    <span class="text-gray-600">Average Service Time</span>
                    <div class="flex items-center gap-2 mt-1 sm:mt-0">
                      <span :class="[
                        'font-medium',
                        dashboardData.overview?.service_performance?.average_time <= 15 ? 'text-green-600' : 
                        dashboardData.overview?.service_performance?.average_time <= 20 ? 'text-yellow-600' : 'text-red-600'
                      ]">
                        {{ formatNumber(dashboardData.overview?.service_performance?.average_time, 1) }} minutes
                      </span>
                      <span :class="[
                        'px-2 py-0.5 text-xs rounded-full',
                        dashboardData.overview?.service_performance?.average_time <= 15 ? 'bg-green-100 text-green-800' : 
                        dashboardData.overview?.service_performance?.average_time <= 20 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                      ]">
                        {{ dashboardData.overview?.service_performance?.average_time <= 15 ? 'On Target' : 
                           dashboardData.overview?.service_performance?.average_time <= 20 ? 'Warning' : 'Over Time' }}
                      </span>
                    </div>
                  </div>
                  <!-- Enhanced Bullet Chart -->
                  <div class="relative">
                    <!-- Background Track -->
                    <div class="h-4 flex rounded-full overflow-hidden">
                      <div class="flex-1 bg-green-100/50 border-r border-white"></div>
                      <div class="flex-1 bg-yellow-100/50 border-r border-white"></div>
                      <div class="flex-1 bg-red-100/50"></div>
                    </div>
                    
                    <!-- Progress Bar -->
                    <div 
                      class="absolute top-0 left-0 h-4 rounded-full transition-all duration-500 bg-gradient-to-r"
                      :class="{
                        'from-green-400 to-green-500': dashboardData.overview?.service_performance?.average_time <= 15,
                        'from-yellow-400 to-yellow-500': dashboardData.overview?.service_performance?.average_time > 15 && dashboardData.overview?.service_performance?.average_time <= 20,
                        'from-red-400 to-red-500': dashboardData.overview?.service_performance?.average_time > 20
                      }"
                      :style="{ width: `${Math.min((dashboardData.overview?.service_performance?.average_time / 30) * 100, 100)}%` }"
                    ></div>
                  </div>
                  
                  <!-- Scale Labels -->
                  <div class="flex justify-between mt-2 px-1">
                    <span class="text-xs text-gray-500">0m</span>
                    <span class="text-xs text-gray-500">30m+</span>
                  </div>
                </div>
            
                <!-- Enhanced Stats Cards -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div class="bg-white rounded-lg p-4 border border-green-100 shadow-sm">
                    <div class="flex justify-between items-start">
                      <div>
                        <p class="text-sm text-gray-600 mb-1">On-time Services</p>
                        <p class="text-2xl font-bold text-green-600">
                          {{ dashboardData.overview?.service_performance?.on_time_services }}
                        </p>
                        <p class="text-sm text-gray-500">
                          of {{ dashboardData.overview?.service_performance?.total_services }} total
                        </p>
                      </div>
                      <div class="bg-green-100 p-2 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div class="bg-white rounded-lg p-4 border border-blue-100 shadow-sm">
                    <div class="flex justify-between items-start">
                      <div>
                        <p class="text-sm text-gray-600 mb-1">On-time Rate</p>
                        <p class="text-2xl font-bold text-blue-600">
                          {{ formatPercentage(dashboardData.overview?.service_performance?.on_time_rate) }}
                        </p>
                        <p class="text-sm text-gray-500">completion rate</p>
                      </div>
                      <div class="bg-blue-100 p-2 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                          <path fill-rule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 12a1 1 0 11-2 0 1 1 0 012 0zm0-3a1 1 0 01-2 0V7a1 1 0 112 0v4z" clip-rule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- Team Members -->
            <!-- <div class="bg-blue-50 rounded-lg p-4 sm:p-6">
              <div class="flex items-center justify-between mb-4">
                <h4 class="font-medium text-gray-900">Team Members</h4>
                <UsersIcon class="h-5 w-5 text-blue-600" />
              </div>
              <div class="space-y-4">
                <div 
                  v-for="team in dashboardData.teams" 
                  :key="team.id"
                  class="bg-white/60 rounded-lg p-4 transition-all hover:bg-white"
                >
                  <p class="text-sm font-medium text-gray-600">{{ team.name }}'s Team</p>
                  <p class="text-xl sm:text-2xl font-bold text-blue-600 mt-1">
                    {{ team.member_count }}
                  </p>
                  <p class="text-sm text-gray-500 mt-1">Active Members</p>
                </div>
              </div>
            </div> -->

            <!-- Team Revenue -->
            <div class="bg-green-50 rounded-lg p-4 sm:p-6">
              <div class="flex items-center justify-between mb-4">
                <h4 class="font-medium text-gray-900">Team Revenue</h4>
                <CurrencyDollarIcon class="h-5 w-5 text-green-600" />
              </div>
              <div class="space-y-6">
                <div 
                  v-for="team in dashboardData.teams" 
                  :key="team.id"
                  class="bg-white/60 rounded-lg p-4 transition-all hover:bg-white">
                  <div class="space-y-3">
                    <p class="text-sm text-gray-600">Total Revenue</p>
                    <p class="text-xl sm:text-2xl font-bold text-green-600">
                      {{ formatCurrency(team.metrics.revenue.total) }}
                    </p>
                    
                    <!-- Target Info -->
                    <div class="flex justify-between text-sm text-gray-600">
                      <span>Monthly Target</span>
                      <span class="font-medium">{{ formatCurrency(team.metrics.revenue.target) }}</span>
                    </div>

                    <!-- Enhanced Progress Bar -->
                    <div class="mt-2">
                      <div class="h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          class="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-500 rounded-full relative"
                          :style="{ width: `${Math.min(team.metrics.revenue.achievement, 100)}%` }"
                        >
                          <div class="absolute inset-0 bg-white/20"></div>
                        </div>
                      </div>
                      <div class="flex justify-between mt-1 text-sm">
                        <span class="font-medium text-green-700">
                          {{ formatPercentage(team.metrics.revenue.achievement) }}
                        </span>
                        <span class="text-gray-500">Target: 100%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Team Performance Metrics -->
            <div class="bg-purple-50 rounded-lg p-4 sm:p-6">
              <div class="flex items-center justify-between mb-4">
                <h4 class="font-medium text-gray-900">Team Metrics</h4>
                <ChartBarIcon class="h-5 w-5 text-purple-600" />
              </div>
              <div class="space-y-4">
                <div 
                  v-for="team in dashboardData.teams" 
                  :key="team.id"
                  class="bg-white/60 rounded-lg p-4 transition-all hover:bg-white"
                >
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div class="space-y-3">
                      <p class="text- text-gray-600">Avg Order Value</p>
                      <p class="text-xl sm:text-2xl font-bold text-purple-600">
                        {{ formatCurrency(team.metrics.orders.average_value) }}
                      </p>
                    </div>
                    <!-- <div>
                      <p class="text-sm text-gray-600">Team Rating</p>
                      <div class="flex items-center">
                        <p class="text-lg font-bold text-purple-600 mr-1">
                          {{ formatNumber(team.metrics.performance.rating.average, 1) }}
                        </p>
                        <StarIcon class="h-5 w-5 text-yellow-400" />
                      </div>
                        <span class="text-xs text-gray-500">from {{ team.metrics.performance.rating.total_rated_orders }} ratings</span>
                    </div> -->
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Service Advisors Table Section -->
        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 class="text-lg font-medium text-gray-900">Service Advisors Performance</h3>
          </div>

          <!-- Mobile View -->
          <div class="block sm:hidden divide-y divide-gray-200">
            <div 
              v-for="advisor in dashboardData.advisors" 
              :key="advisor.id" 
              class="p-4 space-y-3"
            >
              <!-- Header Info -->
              <div class="flex justify-between items-start">
                <div>
                  <div class="font-medium text-gray-900">{{ advisor.name }}</div>
                  <div class="text-sm text-gray-500">{{ advisor.position }}</div>
                  <div v-if="advisor.leader" class="mt-1 flex items-center">
                    <div class="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center">
                      <span class="text-xs font-medium text-blue-800">
                        {{ getInitials(advisor.leader.name) }}
                      </span>
                    </div>
                    <span class="text-sm text-gray-500 ml-2">{{ advisor.leader.name }}</span>
                  </div>
                </div>
                <div class="text-right">
                  <div class="font-medium text-gray-900">
                    {{ formatCurrency(advisor.metrics.revenue.total) }}
                  </div>
                  <div class="text-sm text-gray-500">
                    {{ advisor.metrics.orders.total }} Orders
                  </div>
                </div>
              </div>

              <!-- Progress -->
              <div>
                <div class="flex justify-between text-xs mb-1">
                  <span class="text-gray-500">Target Progress</span>
                  <span class="font-medium">
                    {{ formatPercentage(advisor.metrics.revenue.achievement) }}
                  </span>
                </div>
                <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    class="h-2 rounded-full transition-all duration-500"
                    :class="[
                      advisor.metrics.revenue.achievement >= 90 ? 'bg-green-500' :
                      advisor.metrics.revenue.achievement >= 70 ? 'bg-yellow-500' :
                      'bg-red-500'
                    ]"
                    :style="{ width: `${Math.min(advisor.metrics.revenue.achievement, 100)}%` }"
                  ></div>
                </div>
                <div class="mt-2 text-xs text-gray-500">
                  Target: {{ formatCurrency(advisor.metrics.revenue.target) }}
                </div>
              </div>

              <!-- Performance Metrics -->
              <div class="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <div class="text-sm text-gray-500">Rating</div>
                  <div class="flex items-center">
                    <span class="font-medium">
                      {{ formatNumber(advisor.metrics.performance.rating.average, 1) }}
                    </span>
                    <StarIcon class="h-4 w-4 text-yellow-400 ml-1" />
                  </div>
                </div>
                <div>
                  <div class="text-sm text-gray-500">On-time Rate</div>
                  <div class="font-medium">
                    {{ formatPercentage(advisor.metrics.performance.service.on_time_rate) }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Desktop Table View -->
          <div class="hidden sm:block overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Name</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Position</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Team Leader</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Revenue & Target</th>
                  <th scope="col" class="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">Achievement</th>
                  <th scope="col" class="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">Performance</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr v-for="advisor in dashboardData.advisors" :key="advisor.id">
                  <!-- Name & Orders -->
                  <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm">
                    <div class="font-medium text-gray-900">{{ advisor.name }}</div>
                    <div class="text-gray-500">{{ advisor.metrics.orders.total }} Orders</div>
                  </td>
                  
                  <!-- Position -->
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {{ advisor.position }}
                  </td>
                  
                  <!-- Team Leader -->
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <div v-if="advisor.leader" class="flex items-center">
                      <div class="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
                        <span class="text-xs font-medium text-blue-800">
                          {{ getInitials(advisor.leader.name) }}
                        </span>
                      </div>
                      <span class="ml-2">{{ advisor.leader.name }}</span>
                    </div>
                    <span v-else>-</span>
                  </td>
            
                  <!-- Revenue & Target Column -->
                  <td class="px-3 py-4">
                    <div class="space-y-2">
                      <!-- Revenue -->
                      <div class="flex items-center justify-between">
                        <div class="text-sm text-gray-500">Revenue</div>
                        <div class="text-sm font-medium text-gray-900">
                          {{ formatCurrency(advisor.metrics.revenue.total) }}
                        </div>
                      </div>

                      <!-- Progress bar with target -->
                      <div class="relative pt-1">
                        <div class="flex items-center justify-between mb-1">
                          <div class="text-xs text-gray-500">
                            <template v-if="advisor.position !== 'Team Leader'">
                              Progress to Target: {{ formatCurrency(advisor.metrics.revenue.target) }}
                            </template>
                          </div>
                        </div>
                        <div class="overflow-hidden h-2 text-xs flex bg-gray-100 rounded-full">
                          <div
                            :style="{ width: `${Math.min(advisor.metrics.revenue.achievement, 100)}%` }"
                            :class="[
                              'shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-500',
                              advisor.metrics.revenue.achievement >= 90 ? 'bg-green-500' :
                              advisor.metrics.revenue.achievement >= 70 ? 'bg-yellow-500' :
                              'bg-red-500'
                            ]"
                          ></div>
                        </div>
                      </div>

                      <!-- Average Order Value -->
                      <div class="flex items-center justify-between">
                        <div class="text-xs text-gray-500">Avg Order Value</div>
                        <div class="text-xs font-medium text-gray-900">
                          {{ formatCurrency(advisor.metrics.orders.average_value) }}
                        </div>
                      </div>
                    </div>
                  </td>
            
                  <!-- Achievement -->
                  <td class="px-3 py-4">
                    <div class="flex flex-col items-center">
                      <div class="relative w-12 h-12 mb-1" v-if="advisor.position !== 'Team Leader'">
                        <svg class="w-12 h-12 transform -rotate-90">
                          <circle
                            class="text-gray-200"
                            stroke-width="3"
                            stroke="currentColor"
                            fill="transparent"
                            r="20"
                            cx="24"
                            cy="24"
                          />
                          <circle
                            :class="[
                              advisor.metrics.revenue.achievement >= 90 ? 'text-green-500' :
                              advisor.metrics.revenue.achievement >= 70 ? 'text-yellow-500' :
                              'text-red-500'
                            ]"
                            stroke-width="3"
                            :stroke-dasharray="circumference"
                            :stroke-dashoffset="dashOffset(advisor.metrics.revenue.achievement)"
                            stroke="currentColor"
                            fill="transparent"
                            r="20"
                            cx="24"
                            cy="24"
                          />
                        </svg>
                        <span class="absolute inset-0 flex items-center justify-center text-xs font-medium">
                          {{ formatPercentage(advisor.metrics.revenue.achievement) }}
                        </span>
                      </div>
                    </div>
                  </td>
            
                  <!-- Performance -->
                  <td class="px-3 py-4">
                    <div class="flex flex-col items-center space-y-2">
                      <div class="text-center">
                        <div class="flex items-center justify-center">
                          <span class="font-medium text-sm">{{ formatNumber(advisor.metrics.performance.rating.average, 1) }}</span>
                          <StarIcon class="h-4 w-4 text-yellow-400 ml-1" />
                        </div>
                        <div class="text-xs text-gray-500">Rating</div>
                      </div>
                      <div class="flex items-center space-x-2 text-sm">
                        <span class="text-gray-500 text-xs">On-time:</span>
                        <span 
                          :class="[
                            advisor.metrics.performance.service.on_time_rate >= 80 ? 'text-green-600' :
                            advisor.metrics.performance.service.on_time_rate >= 60 ? 'text-yellow-600' :
                            'text-red-600'
                          ]"
                          class="font-medium"
                        >
                          {{ formatPercentage(advisor.metrics.performance.service.on_time_rate) }}
                        </span>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
          </table>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
  
<script setup>
import { ref, computed, onMounted } from 'vue'
import { debounce } from 'lodash'
import { 
  ArrowPathIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  StarIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  UserGroupIcon,
  InboxStackIcon,
  UsersIcon,
  XMarkIcon,
  CheckCircleIcon,
  BackspaceIcon
} from '@heroicons/vue/24/outline'

import { format } from 'date-fns'
import apiClient from '@/config/api'
import { formatCurrency, formatNumber, formatPercentage } from '@/utils/formatters'
import DateRangePicker from '@/components/DateRangePicker.vue'
import RevenueTrends from '@/components/dashboard/RevenueTrends.vue'

import Toast from '@/components/Toast.vue' // Import Toast component
import { useToast } from '@/composables/useToast' // Import toast composable

const { toast, showToast } = useToast() // Use the toast composable

const loading = ref(false)
const selectedRange = ref('this_week')
const showDatePicker = ref(false)
const dateRange = ref({ start: null, end: null })
const dashboardData = ref({
  date_range: {
    type: 'this_week',
    start: '',
    end: ''
  },
  overview: {
    total_revenue: 0,
    total_orders: 0,
    average_rating: 0,
    service_performance: {
      average_time: 0,
      on_time_rate: 0,
      total_services: 0,
      on_time_services: 0
    },
    confirmation_performance: {
      average_time: 0,
      on_time_rate: 0,
      total_services: 0,
      on_time_services: 0
    },
    complaints: {
      total: 0,
      rate: 0
    }
  },
  advisors: [],
  trends: []
})

const circumference = 2 * Math.PI * 20
const dashOffset = (percentage) => {
  return circumference - (percentage / 100) * circumference
}

const getInitials = (name) => {
return name
  .split(' ')
  .map(word => word[0])
  .join('')
  .toUpperCase();
}

// Computed properties
const formattedDateRange = computed(() => {
  const { start, end } = dashboardData.value.date_range
  if (!start || !end) return ''
  return `${format(new Date(start), 'dd MMM yyyy')} - ${format(new Date(end), 'dd MMM yyyy')}`
})

// Debounced fetch data function
const fetchDashboardData = debounce(async () => {
  try {
    loading.value = true
    const params = {
      date_range: selectedRange.value
    }

    if (selectedRange.value === 'custom' && dateRange.value.start && dateRange.value.end) {
      params.start_date = dateRange.value.start
      params.end_date = dateRange.value.end
    }

    const response = await apiClient.post('/web/v2/dashboard/service-advisor', {
      jsonrpc: '2.0',
      method: 'call',
      params
    })

    // Tambahkan log untuk debugging
    console.log('API Response:', response)

    if (response.data.result?.status === 'success') { // Periksa status
      dashboardData.value = response.data.result.data
      showToast({
        message: `Data berhasil dimuat untuk ${
          selectedRange.value === 'custom' 
            ? 'rentang tanggal yang dipilih' 
            : getDateRangeText(selectedRange.value)
        }`,
        type: 'success'
      })
    } else {
      throw new Error(response.data.result?.message || 'Terjadi kesalahan saat memuat data')
    }
  } catch (error) {
    console.error('Error fetching service advisor data:', error)
    showToast({
      message: error.message || 'Gagal memuat data dashboard',
      type: 'error',
      duration: 5000
    })
  } finally {
    loading.value = false
  }
}, 500)

// Helper function untuk teks range
const getDateRangeText = (range) => {
  const rangeTexts = {
    'today': 'hari ini',
    'yesterday': 'kemarin',
    'this_week': 'minggu ini',
    'this_month': 'bulan ini',
    'this_year': 'tahun ini'
  }
  return rangeTexts[range] || range
}

const handleDateRangeChange = () => {
  if (selectedRange.value === 'custom') {
    showDatePicker.value = true
  } else {
    showDatePicker.value = false
    fetchDashboardData()
  }
}

const handleCustomDateChange = () => {
  if (dateRange.value.start && dateRange.value.end) {
    fetchDashboardData()
  }
}

const refreshData = () => {
  fetchDashboardData()
}

const resetFilters = () => {
  selectedRange.value = 'this_week'
  dateRange.value = { start: null, end: null }
  showDatePicker.value = false
  fetchDashboardData()
  showToast({
    message: 'Filter telah direset ke default',
    type: 'info'
  })
}



onMounted(() => {
  fetchDashboardData()
})
</script>