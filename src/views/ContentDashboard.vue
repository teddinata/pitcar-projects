<!-- src/views/ContentDashboard.vue -->
<template>
  <div class="min-h-screen bg-gray-50">
    <Toast
      v-model:show="toast.show"
      :message="toast.message"
      :type="toast.type"
      :duration="toast.duration"
    />
    
    <!-- Header -->
    <div class="bg-white shadow">
      <div class="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="md:flex md:items-center md:justify-between">
          <div class="flex-1 min-w-0">
            <h1 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Content Management Dashboard
            </h1>
          </div>
          <div class="mt-4 flex md:mt-0 md:ml-4 space-x-3">
            <button
              @click="fetchDashboardData"
              class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              :disabled="loading"
            >
              <ArrowPathIcon :class="['h-4 w-4 mr-1.5', loading ? 'animate-spin' : '']" />
              {{ loading ? 'Loading...' : 'Refresh' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div class="bg-white rounded-lg shadow p-4">
        <div class="flex flex-wrap justify-between items-center">
          <div>
            <h2 class="text-lg font-medium text-gray-900">Dashboard Filters</h2>
          </div>
          <div class="flex flex-wrap gap-4 mt-3 sm:mt-0">
            <!-- Time Period Filter -->
            <div>
              <label for="timePeriod" class="block text-sm font-medium text-gray-700">Time Period</label>
              <select
                id="timePeriod"
                v-model="filters.period"
                class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md"
                @change="fetchDashboardData"
              >
                <option v-for="period in timePeriods" :key="period.value" :value="period.value">
                  {{ period.label }}
                </option>
              </select>
            </div>
            
            <!-- Project Filter -->
            <div>
              <label for="project" class="block text-sm font-medium text-gray-700">Project</label>
              <select
                id="project"
                v-model="filters.projectId"
                class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md"
                @change="fetchDashboardData"
              >
                <option value="">All Projects</option>
                <option v-for="project in projectsList" :key="project.id" :value="project.id">
                  {{ project.name }}
                </option>
              </select>
            </div>
            
            <!-- Team Member Filter -->
            <div>
              <label for="teamMember" class="block text-sm font-medium text-gray-700">Team Member</label>
              <select
                id="teamMember"
                v-model="filters.creatorId"
                class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md"
                @change="fetchDashboardData"
              >
                <option value="">All Team Members</option>
                <option v-for="member in teamMembers" :key="member.id" :value="member.id">
                  {{ member.name }}
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <main class="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <!-- Loading Indicator -->
      <div v-if="loading" class="flex justify-center items-center h-64">
        <ArrowPathIcon class="h-12 w-12 text-red-500 animate-spin" />
      </div>
      
      <div v-else>
        <!-- Summary Stats -->
        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
          <!-- Projects Summary -->
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <FolderIcon class="h-6 w-6 text-blue-500" />
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">
                      Projects
                    </dt>
                    <dd class="flex items-baseline">
                      <div class="text-2xl font-semibold text-gray-900">
                        {{ dashboardData.summary?.projects?.active || 0 }}
                      </div>
                      <div class="ml-2 flex items-baseline text-sm font-semibold text-gray-500">
                        of {{ dashboardData.summary?.projects?.total || 0 }} total
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-5 py-3">
              <div class="text-sm">
                <button @click="showProjectDetails = true" class="font-medium text-red-600 hover:text-red-500">
                  View details
                </button>
              </div>
            </div>
          </div>

          <!-- Tasks Summary -->
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <ClipboardDocumentCheckIcon class="h-6 w-6 text-green-500" />
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">
                      Tasks Completion
                    </dt>
                    <dd class="flex items-baseline">
                      <div class="text-2xl font-semibold text-gray-900">
                        {{ Math.round(dashboardData.summary?.tasks?.completion_rate || 0) }}%
                      </div>
                      <div class="ml-2 flex items-baseline text-sm font-semibold text-gray-500">
                        {{ dashboardData.summary?.tasks?.completed || 0 }} / {{ dashboardData.summary?.tasks?.total || 0 }}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-5 py-3">
              <div class="text-sm">
                <button @click="showTaskDetails = true" class="font-medium text-red-600 hover:text-red-500">
                  View details
                </button>
              </div>
            </div>
          </div>

          <!-- On-Time Delivery -->
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <ClockIcon class="h-6 w-6 text-yellow-500" />
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">
                      On-Time Delivery
                    </dt>
                    <dd class="flex items-baseline">
                      <div class="text-2xl font-semibold text-gray-900">
                        {{ Math.round(dashboardData.summary?.tasks?.on_time_rate || 0) }}%
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-5 py-3">
              <div class="text-sm">
                <button @click="showTimelineDetails = true" class="font-medium text-red-600 hover:text-red-500">
                  View details
                </button>
              </div>
            </div>
          </div>

          <!-- BAU Activities -->
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <CalendarDaysIcon class="h-6 w-6 text-indigo-500" />
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">
                      BAU Completion
                    </dt>
                    <dd class="flex items-baseline">
                      <div class="text-2xl font-semibold text-gray-900">
                        {{ Math.round(dashboardData.summary?.bau?.completion_rate || 0) }}%
                      </div>
                      <div class="ml-2 flex items-baseline text-sm font-semibold text-gray-500">
                        {{ dashboardData.summary?.bau?.completed || 0 }} / {{ dashboardData.summary?.bau?.total || 0 }}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-5 py-3">
              <div class="text-sm">
                <button @click="showBauDetails = true" class="font-medium text-red-600 hover:text-red-500">
                  View details
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Charts Row -->
        <div class="grid grid-cols-1 gap-5 lg:grid-cols-2 mb-6">
          <!-- Tasks Completion Chart -->
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="px-4 py-5 sm:p-6">
              <h3 class="text-lg leading-6 font-medium text-gray-900">Tasks Completion Trend</h3>
              <div class="mt-2 h-64">
                <TasksCompletionChart 
                  v-if="dashboardData.tasks?.completion_trend?.length"
                  :chartData="dashboardData.tasks.completion_trend" 
                />
                <div v-else class="flex items-center justify-center h-full bg-gray-50 rounded">
                  <p class="text-gray-500">No completion trend data available</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Task Types Distribution -->
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="px-4 py-5 sm:p-6">
              <h3 class="text-lg leading-6 font-medium text-gray-900">Task Types Distribution</h3>
              <div class="mt-2 h-64">
                <TaskTypesChart 
                  v-if="dashboardData.tasks?.by_type?.length"
                  :chartData="dashboardData.tasks.by_type" 
                />
                <div v-else class="flex items-center justify-center h-full bg-gray-50 rounded">
                  <p class="text-gray-500">No task type data available</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Projects & Team Performance -->
        <div class="grid grid-cols-1 gap-5 lg:grid-cols-2 mb-6">
          <!-- At-Risk Projects -->
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 class="text-lg leading-6 font-medium text-gray-900">Projects at Risk</h3>
            </div>
            <div class="p-0">
              <ul class="divide-y divide-gray-200 max-h-80 overflow-y-auto">
                <li v-for="project in atRiskProjects" :key="project.id" class="px-4 py-4 hover:bg-gray-50">
                  <div class="flex items-center justify-between">
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-medium text-red-600 truncate">{{ project.name }}</p>
                      <div class="mt-1 flex items-center">
                        <div class="flex items-center">
                          <div class="text-xs inline-flex items-center px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 mr-2">
                            At Risk
                          </div>
                          <p class="text-sm text-gray-500">{{ project.dates.days_left }} days left</p>
                        </div>
                      </div>
                      <div class="mt-2">
                        <div class="flex items-center">
                          <div class="w-full bg-gray-200 rounded-full h-2.5">
                            <div class="bg-red-600 h-2.5 rounded-full" :style="{ width: `${project.progress}%` }"></div>
                          </div>
                          <span class="text-sm text-gray-500 ml-2">{{ Math.round(project.progress) }}%</span>
                        </div>
                      </div>
                    </div>
                    <div class="ml-4 flex-shrink-0">
                      <ChevronRightIcon class="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </li>
                <li v-if="atRiskProjects.length === 0" class="px-4 py-6 text-center text-sm text-gray-500">
                  No projects at risk
                </li>
              </ul>
            </div>
            <div class="bg-gray-50 px-4 py-3 flex justify-between">
              <div class="text-sm">
                <button @click="showAllProjects = true" class="font-medium text-red-600 hover:text-red-500">
                  View all projects
                </button>
              </div>
            </div>
          </div>

          <!-- Team Performance -->
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 class="text-lg leading-6 font-medium text-gray-900">Team Performance</h3>
            </div>
            <div class="p-0">
              <ul class="divide-y divide-gray-200 max-h-80 overflow-y-auto">
                <li v-for="member in teamPerformance" :key="member.id" class="px-4 py-4 hover:bg-gray-50">
                  <div class="flex items-center justify-between">
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-medium text-gray-900 truncate">{{ member.name }}</p>
                      <p class="mt-1 text-sm text-gray-500">
                        {{ member.tasks.completed }} of {{ member.tasks.total }} tasks completed
                      </p>
                      <div class="mt-2">
                        <div class="flex items-center">
                          <div class="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                              class="h-2.5 rounded-full" 
                              :style="{ width: `${member.tasks.completion_rate}%` }"
                              :class="getCompletionRateColor(member.tasks.completion_rate)"
                            ></div>
                          </div>
                          <span class="text-sm text-gray-500 ml-2">{{ Math.round(member.tasks.completion_rate) }}%</span>
                        </div>
                      </div>
                    </div>
                    <div class="ml-4 flex-shrink-0">
                      <span :class="[
                        'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                        member.tasks.on_time_rate > 80 ? 'bg-green-100 text-green-800' : 
                        member.tasks.on_time_rate > 60 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                      ]">
                        {{ Math.round(member.tasks.on_time_rate) }}% on time
                      </span>
                    </div>
                  </div>
                </li>
                <li v-if="teamPerformance.length === 0" class="px-4 py-6 text-center text-sm text-gray-500">
                  No team performance data available
                </li>
              </ul>
            </div>
            <div class="bg-gray-50 px-4 py-3 flex justify-between">
              <div class="text-sm">
                <button @click="showTeamDetails = true" class="font-medium text-red-600 hover:text-red-500">
                  View team insights
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Tasks Section -->
        <div class="mb-6">
          <div class="bg-white shadow rounded-lg overflow-hidden">
            <div class="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
              <h3 class="text-lg leading-6 font-medium text-gray-900">
                Upcoming Deadlines
              </h3>
              <div class="text-sm">
                <router-link to="/tasks" class="font-medium text-red-600 hover:text-red-500">
                  View all tasks
                </router-link>
              </div>
            </div>
            <div class="p-0">
              <ul class="divide-y divide-gray-200 max-h-80 overflow-y-auto">
                <li v-for="task in upcomingDeadlines" :key="task.id" class="px-4 py-4 hover:bg-gray-50">
                  <div class="flex items-center justify-between">
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-medium text-gray-900 truncate">{{ task.name }}</p>
                      <p class="mt-1 text-sm text-gray-500">
                        <span class="font-medium">Project:</span> {{ task.project_name }}
                      </p>
                      <div class="mt-1 flex items-center">
                        <div class="flex items-center">
                          <span :class="[
                            'px-2 inline-flex text-xs leading-5 font-semibold rounded-full mr-2',
                            getStateColor(task.state)
                          ]">
                            {{ getStateLabel(task.state) }}
                          </span>
                          <p class="text-sm text-gray-500">Assigned to: 
                            <span v-for="(member, idx) in task.assigned_to" :key="member.id">
                              {{ member.name }}{{ idx < task.assigned_to.length - 1 ? ', ' : '' }}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                    <div class="ml-4 flex-shrink-0">
                      <span :class="[
                        'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                        task.days_left <= 1 ? 'bg-red-100 text-red-800' : 
                        task.days_left <= 3 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                      ]">
                        {{ task.days_left }} day{{ task.days_left !== 1 ? 's' : '' }} left
                      </span>
                    </div>
                  </div>
                </li>
                <li v-if="upcomingDeadlines.length === 0" class="px-4 py-6 text-center text-sm text-gray-500">
                  No upcoming deadlines
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Revision Analytics -->
        <div class="mb-6">
          <div class="bg-white shadow rounded-lg">
            <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 class="text-lg leading-6 font-medium text-gray-900">
                Revision Analytics
              </h3>
            </div>
            <div class="p-4">
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div class="bg-gray-50 p-4 rounded-lg">
                  <h4 class="text-sm font-medium text-gray-500 mb-1">Total Revisions</h4>
                  <p class="text-2xl font-semibold text-gray-900">
                    {{ dashboardData.revisions?.summary?.total_revisions || 0 }}
                  </p>
                </div>
                <div class="bg-gray-50 p-4 rounded-lg">
                  <h4 class="text-sm font-medium text-gray-500 mb-1">Tasks with Revisions</h4>
                  <p class="text-2xl font-semibold text-gray-900">
                    {{ dashboardData.revisions?.summary?.tasks_with_revisions || 0 }}
                  </p>
                </div>
                <div class="bg-gray-50 p-4 rounded-lg">
                  <h4 class="text-sm font-medium text-gray-500 mb-1">Excessive Revisions</h4>
                  <p class="text-2xl font-semibold text-gray-900">
                    {{ dashboardData.revisions?.summary?.excessive_revisions_count || 0 }}
                  </p>
                </div>
                <div class="bg-gray-50 p-4 rounded-lg">
                  <h4 class="text-sm font-medium text-gray-500 mb-1">Avg. Revisions by Task</h4>
                  <p class="text-2xl font-semibold text-gray-900">
                    {{ getAvgRevisionsByTask() }}
                  </p>
                </div>
              </div>
              <div class="mt-6">
                <h4 class="text-base font-medium text-gray-700 mb-3">High Revision Tasks</h4>
                <div class="overflow-x-auto">
                  <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                      <tr>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Task Name
                        </th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Project
                        </th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Assigned To
                        </th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Revisions
                        </th>
                      </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                      <tr v-for="task in highRevisionTasks" :key="task.id" class="hover:bg-gray-50">
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {{ task.name }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {{ task.project_name }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <span :class="[
                            'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                            getStateColor(task.state)
                          ]">
                            {{ getStateLabel(task.state) }}
                          </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span v-for="(member, idx) in task.assigned_to" :key="member.id">
                            {{ member.name }}{{ idx < task.assigned_to.length - 1 ? ', ' : '' }}
                          </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            {{ task.revision_count }}
                          </span>
                        </td>
                      </tr>
                      <tr v-if="highRevisionTasks.length === 0">
                        <td colspan="5" class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                          No high revision tasks
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal: Project Details -->
    <DialogModal
      :show="showProjectDetails"
      @close="showProjectDetails = false"
      title="Project Statistics"
      maxWidth="4xl"
    >
      <div class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-gray-50 p-4 rounded-lg">
            <h4 class="text-sm font-medium text-gray-500 mb-1">Total Projects</h4>
            <p class="text-2xl font-semibold text-gray-900">
              {{ dashboardData.summary?.projects?.total || 0 }}
            </p>
          </div>
          <div class="bg-gray-50 p-4 rounded-lg">
            <h4 class="text-sm font-medium text-gray-500 mb-1">Active Projects</h4>
            <p class="text-2xl font-semibold text-gray-900">
              {{ dashboardData.summary?.projects?.active || 0 }}
            </p>
          </div>
          <div class="bg-gray-50 p-4 rounded-lg">
            <h4 class="text-sm font-medium text-gray-500 mb-1">Avg. Progress</h4>
            <p class="text-2xl font-semibold text-gray-900">
              {{ Math.round(dashboardData.summary?.projects?.avg_progress || 0) }}%
            </p>
          </div>
        </div>

        <div class="bg-white p-4 rounded-lg border border-gray-200 overflow-x-auto">
          <h4 class="text-base font-medium text-gray-700 mb-3">Project Status</h4>
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Project Name
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Manager
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progress
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Days Left
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tasks
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="project in dashboardData.projects" :key="project.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ project.name }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ project.team?.manager?.name }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="w-full bg-gray-200 rounded-full h-2.5 mr-2 max-w-xs">
                      <div 
                        class="h-2.5 rounded-full" 
                        :style="{ width: `${project.progress}%` }"
                        :class="getCompletionRateColor(project.progress)"
                      ></div>
                    </div>
                    <span class="text-sm text-gray-500">{{ Math.round(project.progress) }}%</span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ project.dates?.days_left }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ (project.tasks || []).length }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="[
                    'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                    getProjectStateColor(project.state)
                  ]">
                    {{ getProjectStateLabel(project.state) }}
                  </span>
                </td>
              </tr>
              <tr v-if="!dashboardData.projects || dashboardData.projects.length === 0">
                <td colspan="6" class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                  No projects found
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </DialogModal>

    <!-- Modal: Task Details -->
    <DialogModal
      :show="showTaskDetails"
      @close="showTaskDetails = false"
      title="Task Statistics"
      maxWidth="4xl"
    >
      <div class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="bg-gray-50 p-4 rounded-lg">
            <h4 class="text-sm font-medium text-gray-500 mb-1">Total Tasks</h4>
            <p class="text-2xl font-semibold text-gray-900">
              {{ dashboardData.summary?.tasks?.total || 0 }}
            </p>
          </div>
          <div class="bg-gray-50 p-4 rounded-lg">
            <h4 class="text-sm font-medium text-gray-500 mb-1">Completed Tasks</h4>
            <p class="text-2xl font-semibold text-gray-900">
              {{ dashboardData.summary?.tasks?.completed || 0 }}
            </p>
          </div>
          <div class="bg-gray-50 p-4 rounded-lg">
            <h4 class="text-sm font-medium text-gray-500 mb-1">Pending Tasks</h4>
            <p class="text-2xl font-semibold text-gray-900">
              {{ dashboardData.summary?.tasks?.pending || 0 }}
            </p>
          </div>
          <div class="bg-gray-50 p-4 rounded-lg">
            <h4 class="text-sm font-medium text-gray-500 mb-1">Completion Rate</h4>
            <p class="text-2xl font-semibold text-gray-900">
              {{ Math.round(dashboardData.summary?.tasks?.completion_rate || 0) }}%
            </p>
          </div>
        </div>

        <div class="bg-white p-4 rounded-lg border border-gray-200">
          <h4 class="text-base font-medium text-gray-700 mb-3">Tasks by Status</h4>
          <div class="h-64">
            <TaskStatusChart 
              v-if="dashboardData.tasks?.pending_by_status"
              :chartData="dashboardData.tasks.pending_by_status" 
            />
            <div v-else class="flex items-center justify-center h-full bg-gray-50 rounded">
              <p class="text-gray-500">No status data available</p>
            </div>
          </div>
        </div>

        <div class="bg-white p-4 rounded-lg border border-gray-200 overflow-x-auto">
          <h4 class="text-base font-medium text-gray-700 mb-3">Recent Completed Tasks</h4>
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Task Name
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Project
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assigned To
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Completion Date
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="task in recentCompletedTasks" :key="task.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ task.name }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ task.project_name }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="[
                    'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                    task.content_type === 'video' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                  ]">
                    {{ task.content_type }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span v-for="(member, idx) in task.assigned_to" :key="member.id">
                    {{ member.name }}{{ idx < task.assigned_to.length - 1 ? ', ' : '' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(task.completed_date) }}
                </td>
              </tr>
              <tr v-if="recentCompletedTasks.length === 0">
                <td colspan="5" class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                  No recently completed tasks
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </DialogModal>

    <!-- Modal: Timeline Details -->
    <DialogModal
      :show="showTimelineDetails"
      @close="showTimelineDetails = false"
      title="Delivery Timeline"
      maxWidth="4xl"
    >
      <div class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-gray-50 p-4 rounded-lg">
            <h4 class="text-sm font-medium text-gray-500 mb-1">On-Time Delivery Rate</h4>
            <p class="text-2xl font-semibold text-gray-900">
              {{ Math.round(dashboardData.summary?.tasks?.on_time_rate || 0) }}%
            </p>
          </div>
          <div class="bg-gray-50 p-4 rounded-lg">
            <h4 class="text-sm font-medium text-gray-500 mb-1">On-Time Tasks</h4>
            <p class="text-2xl font-semibold text-gray-900">
              {{ onTimeTasks }} / {{ dashboardData.summary?.tasks?.completed || 0 }}
            </p>
          </div>
          <div class="bg-gray-50 p-4 rounded-lg">
            <h4 class="text-sm font-medium text-gray-500 mb-1">Average Days to Complete</h4>
            <p class="text-2xl font-semibold text-gray-900">
              {{ getAvgCompletionDays() }}
            </p>
          </div>
        </div>

        <div class="bg-white p-4 rounded-lg border border-gray-200">
          <h4 class="text-base font-medium text-gray-700 mb-3">Task Duration Analysis</h4>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Task Name
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration (Days)
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="task in taskDurations" :key="task.task_id" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {{ task.name }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="[
                      'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                      task.content_type === 'video' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                    ]">
                      {{ task.content_type }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="[
                      'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                      task.duration_days > 14 ? 'bg-red-100 text-red-800' : 
                      task.duration_days > 7 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                    ]">
                      {{ task.duration_days }} days
                    </span>
                  </td>
                </tr>
                <tr v-if="taskDurations.length === 0">
                  <td colspan="3" class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    No task duration data available
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DialogModal>

    <!-- Modal: BAU Details -->
    <DialogModal
      :show="showBauDetails"
      @close="showBauDetails = false"
      title="BAU Activities"
      maxWidth="4xl"
    >
      <div class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="bg-gray-50 p-4 rounded-lg">
            <h4 class="text-sm font-medium text-gray-500 mb-1">Total Activities</h4>
            <p class="text-2xl font-semibold text-gray-900">
              {{ dashboardData.summary?.bau?.total || 0 }}
            </p>
          </div>
          <div class="bg-gray-50 p-4 rounded-lg">
            <h4 class="text-sm font-medium text-gray-500 mb-1">Completed</h4>
            <p class="text-2xl font-semibold text-gray-900">
              {{ dashboardData.summary?.bau?.completed || 0 }}
            </p>
          </div>
          <div class="bg-gray-50 p-4 rounded-lg">
            <h4 class="text-sm font-medium text-gray-500 mb-1">Pending</h4>
            <p class="text-2xl font-semibold text-gray-900">
              {{ dashboardData.summary?.bau?.planned || 0 }}
            </p>
          </div>
          <div class="bg-gray-50 p-4 rounded-lg">
            <h4 class="text-sm font-medium text-gray-500 mb-1">Completion Rate</h4>
            <p class="text-2xl font-semibold text-gray-900">
              {{ Math.round(dashboardData.summary?.bau?.completion_rate || 0) }}%
            </p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-white p-4 rounded-lg border border-gray-200">
            <h4 class="text-base font-medium text-gray-700 mb-3">Daily Completion</h4>
            <div class="h-64">
              <BauCompletionChart 
                v-if="dashboardData.bau?.daily_completion?.length"
                :chartData="dashboardData.bau.daily_completion" 
              />
              <div v-else class="flex items-center justify-center h-full bg-gray-50 rounded">
                <p class="text-gray-500">No daily completion data available</p>
              </div>
            </div>
          </div>

          <div class="bg-white p-4 rounded-lg border border-gray-200">
            <h4 class="text-base font-medium text-gray-700 mb-3">Hours by Type</h4>
            <div class="h-64">
              <BauHoursChart 
                v-if="dashboardData.bau?.hours_by_type?.length"
                :chartData="dashboardData.bau.hours_by_type" 
              />
              <div v-else class="flex items-center justify-center h-full bg-gray-50 rounded">
                <p class="text-gray-500">No hours data available</p>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white p-4 rounded-lg border border-gray-200">
          <h4 class="text-base font-medium text-gray-700 mb-3">Creator Performance</h4>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Creator
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Activities
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Completed
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hours
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Completion Rate
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="creator in creatorPerformance" :key="creator.id" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {{ creator.name }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ creator.total }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ creator.completed }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ creator.hours }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="[
                      'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                      getCompletionRateColor(creator.completion_rate)
                    ]">
                      {{ creator.completion_rate }}%
                    </span>
                  </td>
                </tr>
                <tr v-if="!creatorPerformance || creatorPerformance.length === 0">
                  <td colspan="5" class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    No creator performance data available
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DialogModal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useToast } from '@/composables/useToast'
import apiClient from '@/config/api'
import { format, subDays, subMonths, subQuarters, subYears, parseISO } from 'date-fns'
import { 
  ArrowPathIcon,
  FolderIcon,
  ClipboardDocumentCheckIcon,
  ClockIcon,
  CalendarDaysIcon,
  ChevronRightIcon
} from '@heroicons/vue/24/outline'

// Import components
import Toast from '@/components/Toast.vue'
import DialogModal from '@/components/charts/DialogModal.vue'
import TasksCompletionChart from '@/components/charts/TasksCompletionChart.vue'
import TaskTypesChart from '@/components/charts/TaskTypesChart.vue'
import TaskStatusChart from '@/components/charts/TaskStatusChart.vue'
import BauCompletionChart from '@/components/charts/BauCompletionChart.vue'
import BauHoursChart from '@/components/charts/BauHoursChart.vue'

// State
const { toast, showToast } = useToast()
const loading = ref(false)

// Filters
const filters = ref({
  period: 'week',
  projectId: '',
  creatorId: ''
})

// Dashboard data
const dashboardData = ref({
  summary: null,
  projects: [],
  tasks: {},
  bau: {},
  team_performance: [],
  revisions: {},
  time_tracking: {},
  trends: {}
})

// Modal visibility states
const showProjectDetails = ref(false)
const showTaskDetails = ref(false)
const showTimelineDetails = ref(false)
const showBauDetails = ref(false)
const showTeamDetails = ref(false)
const showAllProjects = ref(false)

// Filter options
const timePeriods = [
  { label: 'This Week', value: 'week' },
  { label: 'This Month', value: 'month' },
  { label: 'This Quarter', value: 'quarter' },
  { label: 'This Year', value: 'year' }
]

// Projects and team members for filters
const projectsList = ref([])
const teamMembers = ref([])

// Computed properties
const atRiskProjects = computed(() => {
  return (dashboardData.value.projects || [])
    .filter(project => project.risk_assessment?.is_at_risk)
    .slice(0, 5) // Top 5 at-risk projects
})

const teamPerformance = computed(() => {
  return (dashboardData.value.team_performance || []).slice(0, 5) // Top 5 performers
})

const upcomingDeadlines = computed(() => {
  return (dashboardData.value.tasks?.upcoming_deadlines || []).slice(0, 5) // 5 most urgent deadlines
})

const highRevisionTasks = computed(() => {
  return (dashboardData.value.revisions?.high_revision_tasks || []).slice(0, 5) // Top 5 high revision tasks
})

const recentCompletedTasks = computed(() => {
  return (dashboardData.value.tasks?.recent_completed || [])
})

const taskDurations = computed(() => {
  return (dashboardData.value.tasks?.durations || [])
})

const creatorPerformance = computed(() => {
  return (dashboardData.value.bau?.creator_performance || [])
})

const onTimeTasks = computed(() => {
  const completedTasks = dashboardData.value.summary?.tasks?.completed || 0
  const onTimeRate = dashboardData.value.summary?.tasks?.on_time_rate || 0
  return Math.round(completedTasks * onTimeRate / 100)
})

// Methods
const fetchDashboardData = async () => {
  try {
    loading.value = true
    
    // Calculate date range based on selected period
    const dateRange = calculateDateRange(filters.value.period)
    
    // Call dashboard endpoint
    const response = await apiClient.post('/web/v2/content/dashboard', {
      jsonrpc: '2.0',
      method: 'call',
      id: new Date().getTime(),
      params: {
        date_from: dateRange.from,
        date_to: dateRange.to,
        project_id: filters.value.projectId || undefined,
        creator_id: filters.value.creatorId || undefined
      }
    })

    if (response.data.result?.status === 'success') {
      dashboardData.value = response.data.result.data
      showToast({
        message: 'Dashboard data loaded successfully',
        type: 'success'
      })
      
      // Also fetch projects and team members for filters
      fetchProjectsAndTeamMembers()
    }
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    showToast({
      message: 'Failed to load dashboard data',
      type: 'error',
      duration: 5000
    })
  } finally {
    loading.value = false
  }
}

const fetchProjectsAndTeamMembers = async () => {
  try {
    // Fetch projects list
    const projectsResponse = await apiClient.post('/web/v2/content/projects/list', {
      jsonrpc: '2.0',
      method: 'call',
      id: new Date().getTime(),
      params: {}
    })

    if (projectsResponse.data.result?.status === 'success') {
      projectsList.value = projectsResponse.data.result.data
    }
    
    // For team members, we'll use data from team performance
    // This is a simplification - in a real app you might have a dedicated endpoint
    const uniqueMembers = new Map()
    
    // Add team members from team performance
    if (dashboardData.value.team_performance) {
      dashboardData.value.team_performance.forEach(member => {
        if (!uniqueMembers.has(member.id)) {
          uniqueMembers.set(member.id, {
            id: member.id,
            name: member.name
          })
        }
      })
    }
    
    // Add team members from BAU creator performance
    if (dashboardData.value.bau?.creator_performance) {
      dashboardData.value.bau.creator_performance.forEach(creator => {
        if (!uniqueMembers.has(creator.id)) {
          uniqueMembers.set(creator.id, {
            id: creator.id,
            name: creator.name
          })
        }
      })
    }
    
    teamMembers.value = Array.from(uniqueMembers.values())
    
  } catch (error) {
    console.error('Error fetching filters data:', error)
  }
}

const calculateDateRange = (period) => {
  const now = new Date()
  let startDate
  
  switch (period) {
    case 'week':
      startDate = subDays(now, 7)
      break
    case 'month':
      startDate = subMonths(now, 1)
      break
    case 'quarter':
      startDate = subQuarters(now, 1)
      break
    case 'year':
      startDate = subYears(now, 1)
      break
    default:
      startDate = subDays(now, 7)
  }
  
  return {
    from: format(startDate, 'yyyy-MM-dd'),
    to: format(now, 'yyyy-MM-dd')
  }
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  try {
    return format(parseISO(dateString), 'MMM d, yyyy')
  } catch (e) {
    return dateString
  }
}

const getCompletionRateColor = (rate) => {
  if (rate >= 80) return 'bg-green-500'
  if (rate >= 50) return 'bg-yellow-500'
  return 'bg-red-500'
}

const getStateColor = (state) => {
  switch (state) {
    case 'done':
      return 'bg-green-100 text-green-800'
    case 'in_progress':
      return 'bg-blue-100 text-blue-800'
    case 'review':
      return 'bg-yellow-100 text-yellow-800'
    case 'revision':
      return 'bg-orange-100 text-orange-800'
    case 'draft':
      return 'bg-gray-100 text-gray-800'
    case 'cancelled':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getStateLabel = (state) => {
  switch (state) {
    case 'done':
      return 'Completed'
    case 'in_progress':
      return 'In Progress'
    case 'review':
      return 'In Review'
    case 'revision':
      return 'In Revision'
    case 'draft':
      return 'Draft'
    case 'cancelled':
      return 'Cancelled'
    default:
      return state
  }
}

const getProjectStateColor = (state) => {
  switch (state) {
    case 'completed':
      return 'bg-green-100 text-green-800'
    case 'in_progress':
      return 'bg-blue-100 text-blue-800'
    case 'draft':
      return 'bg-gray-100 text-gray-800'
    case 'cancelled':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getProjectStateLabel = (state) => {
  switch (state) {
    case 'completed':
      return 'Completed'
    case 'in_progress':
      return 'In Progress'
    case 'draft':
      return 'Draft'
    case 'cancelled':
      return 'Cancelled'
    default:
      return state
  }
}

const getAvgRevisionsByTask = () => {
  const totalRevisions = dashboardData.value.revisions?.summary?.total_revisions || 0
  const tasksWithRevisions = dashboardData.value.revisions?.summary?.tasks_with_revisions || 0
  
  if (tasksWithRevisions === 0) return '0'
  return (totalRevisions / tasksWithRevisions).toFixed(1)
}

const getAvgCompletionDays = () => {
  const durations = dashboardData.value.tasks?.durations || []
  
  if (durations.length === 0) return '0'
  
  const totalDays = durations.reduce((sum, task) => sum + task.duration_days, 0)
  return (totalDays / durations.length).toFixed(1)
}

// Watch for changes in filters
watch(filters, (newFilters, oldFilters) => {
  // Only refetch if the period changes - other filters are applied when the user clicks
  // the apply button to avoid too many API calls
  if (newFilters.period !== oldFilters.period) {
    fetchDashboardData()
  }
}, { deep: true })

onMounted(() => {
  fetchDashboardData()
})
</script>