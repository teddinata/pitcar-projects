<!-- TeamTaskManager with Calendar and Gantt View -->
<template>
  <div class="min-h-screen bg-gray-50">
    <Toast
      v-model:show="toast.show"
      :message="toast.message"
      :type="toast.type"
      :duration="toast.duration"
    />

    <div class="bg-white shadow">
      <div class="w-full max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <!-- Title section -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 class="text-lg leading-6 font-medium text-gray-900">
              Task Management
            </h3>
            <p class="mt-1 max-w-2xl text-sm text-gray-500">Manage project tasks, schedules, and time tracking</p>
          </div>
          
          <!-- Action buttons with better labeling -->
          <div class="mt-4 sm:mt-0 flex items-center space-x-3">
            <!-- View toggle with descriptive text -->
            <div class="hidden md:flex items-center mr-2">
              <span class="text-sm text-gray-500 mr-2">View as:</span>
              <div class="inline-flex rounded-md shadow-sm">
                <button
                  @click="viewMode = 'table'"
                  class="px-3 py-2 text-sm font-medium border border-gray-300 focus:outline-none focus:ring-1 focus:ring-red-500 rounded-l-md flex items-center"
                  :class="viewMode === 'table' ? 'bg-red-50 text-red-700 border-red-500' : 'bg-white text-gray-700'"
                  title="Table View"
                >
                  <TableIcon class="h-4 w-4 mr-1" />
                  <span class="hidden lg:inline">Table</span>
                </button>
                <button
                  @click="viewMode = 'kanban'"
                  class="px-3 py-2 text-sm font-medium border border-gray-300 focus:outline-none focus:ring-1 focus:ring-red-500 -ml-px flex items-center"
                  :class="viewMode === 'kanban' ? 'bg-red-50 text-red-700 border-red-500' : 'bg-white text-gray-700'"
                  title="Kanban Board View"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  <span class="hidden lg:inline">Kanban</span>
                </button>
                <!-- Calendar View Button -->
                <button
                  @click="viewMode = 'calendar'"
                  class="px-3 py-2 text-sm font-medium border border-gray-300 focus:outline-none focus:ring-1 focus:ring-red-500 -ml-px flex items-center"
                  :class="viewMode === 'calendar' ? 'bg-red-50 text-red-700 border-red-500' : 'bg-white text-gray-700'"
                  title="Calendar View"
                >
                  <CalendarIcon class="h-4 w-4 mr-1" />
                  <span class="hidden lg:inline">Calendar</span>
                </button>
                <!-- Gantt Chart Button -->
                <button
                  @click="viewMode = 'gantt'"
                  class="px-3 py-2 text-sm font-medium border border-gray-300 focus:outline-none focus:ring-1 focus:ring-red-500 -ml-px rounded-r-md flex items-center"
                  :class="viewMode === 'gantt' ? 'bg-red-50 text-red-700 border-red-500' : 'bg-white text-gray-700'"
                  title="Gantt Chart View"
                >
                  <ChartBarIcon class="h-4 w-4 mr-1" />
                  <span class="hidden lg:inline">Gantt</span>
                </button>
              </div>
            </div>
            
            <!-- Create task button - more prominence -->
            <button
              @click="showTaskModal = true; isEditingTask = false; resetTaskForm()"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-rose-600 to-rose-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
            >
              <PlusIcon class="h-4 w-4 mr-1.5" />
              Create New Task
            </button>
          </div>
        </div>
        
        <!-- Mobile view toggle (only shown on small screens) -->
        <div class="flex md:hidden items-center justify-center mt-4 overflow-x-auto">
          <span class="text-sm text-gray-500 mr-2">View as:</span>
          <div class="inline-flex rounded-md shadow-sm">
            <button
              @click="viewMode = 'table'"
              class="px-2 py-2 text-xs font-medium border border-gray-300 focus:outline-none focus:ring-1 focus:ring-red-500 rounded-l-md flex items-center"
              :class="viewMode === 'table' ? 'bg-red-50 text-red-700 border-red-500' : 'bg-white text-gray-700'"
            >
              <TableIcon class="h-4 w-4 mr-1" />
              <span>Table</span>
            </button>
            <button
              @click="viewMode = 'kanban'"
              class="px-2 py-2 text-xs font-medium border border-gray-300 focus:outline-none focus:ring-1 focus:ring-red-500 -ml-px flex items-center"
              :class="viewMode === 'kanban' ? 'bg-red-50 text-red-700 border-red-500' : 'bg-white text-gray-700'"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              <span>Kanban</span>
            </button>
            <button
              @click="viewMode = 'calendar'"
              class="px-2 py-2 text-xs font-medium border border-gray-300 focus:outline-none focus:ring-1 focus:ring-red-500 -ml-px flex items-center"
              :class="viewMode === 'calendar' ? 'bg-red-50 text-red-700 border-red-500' : 'bg-white text-gray-700'"
            >
              <CalendarIcon class="h-4 w-4 mr-1" />
              <span>Calendar</span>
            </button>
            <button
              @click="viewMode = 'gantt'"
              class="px-2 py-2 text-xs font-medium border border-gray-300 focus:outline-none focus:ring-1 focus:ring-red-500 -ml-px rounded-r-md flex items-center"
              :class="viewMode === 'gantt' ? 'bg-red-50 text-red-700 border-red-500' : 'bg-white text-gray-700'"
            >
              <ChartBarIcon class="h-4 w-4 mr-1" />
              <span>Gantt</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <main class="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Task filters & search (applicable to all views) -->
      <div class="w-full max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 mb-4 bg-white shadow rounded-md border border-gray-200">
        <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
          <div class="flex-1">
            <label for="task-search" class="sr-only">Search tasks</label>
            <div class="relative rounded-md shadow-sm">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon class="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                id="task-search"
                v-model="searchQuery"
                class="px-3 py-2 focus:ring-red-500 focus:border-red-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                placeholder="Search tasks..."
              />
            </div>
          </div>
          <div class="w-full sm:w-48">
            <select
              v-model="statusFilter"
              class="px-3 py-2 focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-300 rounded-md"
            >
              <option value="">All Statuses</option>
              <option value="draft">Draft</option>
              <option value="planned">Planned</option>
              <option value="in_progress">In Progress</option>
              <option value="review">In Review</option>
              <option value="done">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div class="w-full sm:w-48" v-if="projects.length > 0">
            <select
              v-model="projectFilter"
              class="px-3 py-2 focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-300 rounded-md"
            >
              <option value="">All Projects</option>
              <option v-for="project in projects" :key="project.id" :value="project.id">
                {{ project.name }}
              </option>
            </select>
          </div>
          
          <!-- Date range filter for Calendar view -->
          <div v-if="viewMode === 'calendar' || viewMode === 'gantt'" class="flex space-x-2">
            <div class="w-full sm:w-40">
              <label for="date-from" class="sr-only">From</label>
              <input
                type="date"
                id="date-from"
                v-model="dateRange.start"
                class="px-3 py-2 focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            <div class="w-full sm:w-40">
              <label for="date-to" class="sr-only">To</label>
              <input
                type="date"
                id="date-to"
                v-model="dateRange.end"
                class="px-3 py-2 focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Loading state -->
      <div v-if="loading" class="flex justify-center py-8">
        <svg class="animate-spin h-8 w-8 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>

      <!-- Empty state -->
      <div v-else-if="filteredTasks.length === 0" class="py-8 text-center bg-white shadow rounded-lg">
        <DocumentIcon class="mx-auto h-12 w-12 text-gray-300" />
        <h3 class="mt-2 text-sm font-medium text-gray-900">No tasks found</h3>
        <p class="mt-1 text-sm text-gray-500">
          {{ searchQuery || statusFilter || projectFilter ? 'No tasks match your filters.' : 'Get started by creating a new task.' }}
        </p>
        <div v-if="searchQuery || statusFilter || projectFilter" class="mt-6">
          <button
            @click="clearFilters"
            class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Clear filters
          </button>
        </div>
      </div>

      <!-- TABLE VIEW -->
      <div v-else-if="viewMode === 'table'" class="bg-white shadow rounded-lg overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Task
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Assigned To
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Progress
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dates
              </th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="task in filteredTasks" :key="task.id" 
                class="hover:bg-gray-50 cursor-pointer"
                @click="selectTask(task)">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div>
                    <div class="text-sm font-medium text-gray-900">{{ task.name }}</div>
                    <div class="text-sm text-gray-500">{{ task.project?.name || 'No project' }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex flex-col space-y-1">
                  <span v-for="person in task.assigned_to" :key="person.id" class="text-sm text-gray-900">
                    {{ person.name }}
                  </span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" :class="getStatusClass(task.state)">
                  {{ formatStatus(task.state) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="w-32 bg-gray-200 rounded-full h-2 mr-2">
                    <div class="bg-red-600 h-2 rounded-full" :style="{ width: `${task.progress || 0}%` }"></div>
                  </div>
                  <span class="text-sm text-gray-500">{{ task.progress || 0 }}%</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div v-if="task.dates?.planned_start || task.dates?.planned_end">
                  <div v-if="task.dates?.planned_start" class="text-xs">
                    Start: {{ formatDate(task.dates.planned_start) }}
                  </div>
                  <div v-if="task.dates?.planned_end" class="text-xs">
                    End: {{ formatDate(task.dates.planned_end) }}
                  </div>
                </div>
                <span v-else>-</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium" @click.stop>
                <button
                  @click="editTask(task)"
                  class="text-red-600 hover:text-red-900 mr-3"
                  title="Edit Task"
                >
                  <PencilIcon class="h-4 w-4" />
                </button>
                <button
                  @click="confirmDeleteTask(task)"
                  class="text-red-600 hover:text-red-900"
                  title="Delete Task"
                >
                  <TrashIcon class="h-4 w-4" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- KANBAN VIEW -->
      <div v-else-if="viewMode === 'kanban'" class="pt-4">
        <div class="flex space-x-6 overflow-x-auto pb-4">
          <!-- Draft Column -->
          <div class="flex-shrink-0 w-80">
            <div class="bg-gray-100 rounded-lg p-4">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-sm font-medium text-gray-900">Draft</h3>
                <span class="text-xs font-medium text-gray-500 bg-white px-2 py-1 rounded-full">
                  {{ draftTasks.length }}
                </span>
              </div>
              
              <Draggable
                v-model="draftTasks"
                :group="{ name: 'tasks', pull: true, put: true }"
                :animation="200"
                item-key="id"
                class="space-y-3 min-h-[200px]"
                ghost-class="sortable-ghost"
                drag-class="sortable-drag"
                @end="handleDragEnd"
                data-state="draft"
              >
                <template #item="{ element: task }">
                  <div 
                    class="bg-white p-3 rounded-md shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
                    @click="selectTask(task)"
                  >
                    <div class="text-sm font-medium text-gray-900 mb-1">{{ task.name }}</div>
                    <div class="text-xs text-gray-500 mb-2">{{ task.project?.name || 'No project' }}</div>
                    
                    <div class="flex justify-between items-center">
                      <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" :class="getStatusClass(task.state)">
                        {{ formatStatus(task.state) }}
                      </span>
                      <div class="flex items-center">
                        <div class="w-16 bg-gray-200 rounded-full h-1 mr-1">
                          <div class="bg-red-600 h-1 rounded-full" :style="{ width: `${task.progress || 0}%` }"></div>
                        </div>
                        <span class="text-xs text-gray-500">{{ task.progress || 0 }}%</span>
                      </div>
                    </div>
                    
                    <div class="mt-2 flex justify-between items-center">
                      <div class="flex flex-wrap gap-1">
                        <div v-for="person in task.assigned_to.slice(0, 2)" :key="person.id" 
                             class="h-6 w-6 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-medium uppercase text-xs"
                             :title="person.name">
                          {{ getInitials(person.name) }}
                        </div>
                        <div v-if="task.assigned_to.length > 2" 
                             class="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-medium text-xs">
                          +{{ task.assigned_to.length - 2 }}
                        </div>
                      </div>
                      
                      <div v-if="task.dates?.planned_end" class="text-xs text-gray-500">
                        {{ formatDate(task.dates.planned_end) }}
                      </div>
                    </div>
                  </div>
                </template>
              </Draggable>
            </div>
          </div>

          <!-- Remaining Kanban columns... -->
          <!-- Planned Column -->
          <div class="flex-shrink-0 w-80">
            <div class="bg-green-50 rounded-lg p-4">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-sm font-medium text-gray-900">Planned</h3>
                <span class="text-xs font-medium text-gray-500 bg-white px-2 py-1 rounded-full">
                  {{ plannedTasks.length }}
                </span>
              </div>
              <Draggable
                v-model="plannedTasks"
                :group="{ name: 'tasks' }"
                item-key="id"
                class="space-y-3 min-h-[200px]"
                @end="handleDragEnd"
                data-state="planned"
              >
                <template #item="{ element: task }">
                  <div
                    class="bg-white p-3 rounded-md shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
                    @click="selectTask(task)"
                  >
                    <div class="text-sm font-medium text-gray-900 mb-1">{{ task.name }}</div>
                    <div class="text-xs text-gray-500 mb-2">{{ task.project?.name || 'No project' }}</div>
                    <div class="flex justify-between items-center">
                      <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" :class="getStatusClass(task.state)">
                        {{ formatStatus(task.state) }}
                      </span>
                      <div class="flex items-center">
                        <div class="w-16 bg-gray-200 rounded-full h-1 mr-1">
                          <div class="bg-red-600 h-1 rounded-full" :style="{ width: `${task.progress || 0}%` }"></div>
                        </div>
                        <span class="text-xs text-gray-500">{{ task.progress || 0 }}%</span>
                      </div>
                    </div>
                    <div class="mt-2 flex justify-between items-center">
                      <div class="flex flex-wrap gap-1">
                        <div v-for="person in task.assigned_to.slice(0, 2)" :key="person.id"
                             class="h-6 w-6 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-medium uppercase text-xs"
                             :title="person.name">
                          {{ getInitials(person.name) }}
                        </div>
                        <div v-if="task.assigned_to.length > 2"
                             class="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-medium text-xs">
                          +{{ task.assigned_to.length - 2 }}
                        </div>
                      </div>
                      <div v-if="task.dates?.planned_end" class="text-xs text-gray-500">
                        {{ formatDate(task.dates.planned_end) }}
                      </div>
                    </div>
                  </div>
                </template>
              </Draggable>
            </div>
          </div>

          <!-- Other Kanban columns would be here... -->
        </div>
      </div>

      <!-- CALENDAR VIEW -->
      <div v-else-if="viewMode === 'calendar'" class="bg-white shadow rounded-lg overflow-hidden">
        <div class="p-4 border-b border-gray-200">
          <div class="flex justify-between items-center mb-4">
            <div class="flex space-x-2">
              <button @click="prevMonth" class="p-1 rounded border border-gray-300 hover:bg-gray-100">
                <ChevronLeftIcon class="h-5 w-5 text-gray-700" />
              </button>
              <button @click="nextMonth" class="p-1 rounded border border-gray-300 hover:bg-gray-100">
                <ChevronRightIcon class="h-5 w-5 text-gray-700" />
              </button>
              <button @click="goToToday" class="px-3 py-1 rounded border border-gray-300 hover:bg-gray-100 text-sm font-medium">
                Today
              </button>
            </div>
            <h2 class="text-lg font-semibold text-gray-900">{{ currentMonthName }} {{ currentYear }}</h2>
            <div class="flex space-x-2">
              <button 
                @click="calendarView = 'month'" 
                class="px-3 py-1 text-sm font-medium rounded"
                :class="calendarView === 'month' 
                  ? 'bg-red-600 text-white' 
                  : 'text-gray-700 bg-gray-100 hover:bg-gray-200'"
              >
                Month
              </button>
              <button 
                @click="calendarView = 'week'" 
                class="px-3 py-1 text-sm font-medium rounded"
                :class="calendarView === 'week' 
                  ? 'bg-red-600 text-white' 
                  : 'text-gray-700 bg-gray-100 hover:bg-gray-200'"
              >
                Week
              </button>
            </div>
          </div>
        </div>

        <!-- Month View -->
        <div v-if="calendarView === 'month'" class="p-4">
          <div class="grid grid-cols-7 gap-px">
            <!-- Days of week -->
            <div v-for="day in daysOfWeek" :key="day" class="text-center p-2 bg-gray-50 font-medium text-gray-700">
              {{ day }}
            </div>
            
            <!-- Calendar cells -->
            <div 
              v-for="(day, index) in calendarDays" 
              :key="index"
              class="min-h-32 p-1 border-t border-l"
              :class="[
                day.isCurrentMonth ? 'bg-white' : 'bg-gray-50',
                day.isToday ? 'border-red-500 border-2' : 'border-gray-200',
                'relative'
              ]"
            >
              <!-- Date display -->
              <div class="text-right mb-1">
                <!-- Calendar View untuk Team Task Manager -->
                <span
                  :class="[
                    day.isCurrentMonth ? 'text-gray-900' : 'text-gray-400',
                    day.isToday ? 'font-bold bg-red-100 rounded-full px-2' : ''
                  ]"
                >
                  {{ day.day }}
                </span>
              </div>
              
              <!-- Task items for this day -->
              <div class="space-y-1 overflow-y-auto max-h-28">
                <div
                  v-for="task in getTasksForDay(day.date)"
                  :key="task.id"
                  @click.stop="selectTask(task)"
                  class="p-1 text-xs rounded cursor-pointer truncate"
                  :class="getStatusClass(task.state)"
                >
                  {{ task.name }}
                </div>
              </div>
              
              <!-- Add task button -->
              <button 
                v-if="day.isCurrentMonth"
                @click.stop="addTaskForDate(day.date)"
                class="absolute bottom-1 right-1 h-5 w-5 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center"
                title="Add task for this day"
              >
                <PlusIcon class="h-3 w-3 text-gray-700" />
              </button>
            </div>
          </div>
        </div>

        <!-- Week View -->
        <div v-else-if="calendarView === 'week'" class="p-4">
          <div class="grid grid-cols-7 gap-px">
            <!-- Days of week with dates -->
            <div 
              v-for="day in weekViewDays" 
              :key="day.date"
              class="text-center p-2 font-medium"
              :class="[
                day.isToday ? 'bg-red-50 text-red-700' : 'bg-gray-50 text-gray-700'
              ]"
            >
              <div>{{ day.name }}</div>
              <div 
                class="text-sm rounded-full w-6 h-6 mx-auto flex items-center justify-center"
                :class="day.isToday ? 'bg-red-500 text-white' : ''"
              >
                {{ day.day }}
              </div>
            </div>
            
            <!-- Time slots -->
            <div class="col-span-7 grid grid-cols-7 gap-px mt-1">
              <div 
                v-for="day in weekViewDays" 
                :key="day.date"
                class="bg-white border border-gray-200 min-h-96 relative"
              >
                <!-- Task items -->
                <div
                  v-for="task in getTasksForDay(day.date)"
                  :key="task.id"
                  @click.stop="selectTask(task)"
                  class="m-1 p-2 text-xs rounded cursor-pointer border-l-4"
                  :class="[
                    getStatusClass(task.state),
                    'border-l-' + getStatusColor(task.state)
                  ]"
                >
                  <div class="font-semibold">{{ task.name }}</div>
                  <div class="text-xs text-gray-500">
                    {{ task.project?.name || 'No project' }}
                  </div>
                </div>
                
                <!-- Add task button -->
                <button 
                  @click.stop="addTaskForDate(day.date)"
                  class="absolute bottom-2 right-2 h-6 w-6 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center"
                  title="Add task for this day"
                >
                  <PlusIcon class="h-4 w-4 text-gray-700" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- GANTT CHART VIEW -->
      <div v-else-if="viewMode === 'gantt'" class="bg-white shadow rounded-lg overflow-hidden">
        <div class="p-4 border-b border-gray-200">
          <div class="flex justify-between items-center mb-4">
            <div class="flex space-x-2">
              <button @click="prevGanttPeriod" class="p-1 rounded border border-gray-300 hover:bg-gray-100">
                <ChevronLeftIcon class="h-5 w-5 text-gray-700" />
              </button>
              <button @click="nextGanttPeriod" class="p-1 rounded border border-gray-300 hover:bg-gray-100">
                <ChevronRightIcon class="h-5 w-5 text-gray-700" />
              </button>
            </div>
            <h2 class="text-lg font-semibold text-gray-900">{{ ganttPeriodLabel }}</h2>
            <div class="flex space-x-2">
              <button 
                @click="ganttView = 'week'" 
                class="px-3 py-1 text-sm font-medium rounded"
                :class="ganttView === 'week' 
                  ? 'bg-red-600 text-white' 
                  : 'text-gray-700 bg-gray-100 hover:bg-gray-200'"
              >
                Week
              </button>
              <button 
                @click="ganttView = 'month'" 
                class="px-3 py-1 text-sm font-medium rounded"
                :class="ganttView === 'month' 
                  ? 'bg-red-600 text-white' 
                  : 'text-gray-700 bg-gray-100 hover:bg-gray-200'"
              >
                Month
              </button>
            </div>
          </div>
        </div>
        
        <div class="p-4 overflow-x-auto">
          <div class="flex">
            <!-- Task labels column -->
            <div class="flex-shrink-0 w-64 border-r border-gray-200 pr-2">
              <div class="h-8 font-medium text-gray-700 flex items-center">
                Task
              </div>
              <div class="space-y-2 mt-2">
                <div 
                  v-for="task in ganttTasks" 
                  :key="task.id"
                  class="h-8 flex items-center overflow-hidden"
                >
                  <div class="text-sm font-medium text-gray-900 truncate">
                    {{ task.name }}
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Gantt chart area -->
            <div class="flex-grow relative">
              <!-- Timeline header -->
              <div class="flex border-b border-gray-200">
                <div 
                  v-for="(day, index) in ganttDays" 
                  :key="index"
                  class="flex-shrink-0 w-12 text-center text-xs font-medium py-2"
                  :class="day.isWeekend ? 'bg-gray-50' : ''"
                >
                  <div>{{ day.dayLabel }}</div>
                  <div>{{ day.dateLabel }}</div>
                </div>
              </div>
              
              <!-- Task bars -->
              <div class="relative">
                <!-- Background grid lines -->
                <div class="absolute inset-0 grid" :style="{ gridTemplateColumns: `repeat(${ganttDays.length}, 3rem)` }">
                  <div 
                    v-for="(day, index) in ganttDays" 
                    :key="index"
                    class="border-r border-gray-100"
                    :class="day.isWeekend ? 'bg-gray-50' : ''"
                  ></div>
                </div>
                
                <!-- Task bars -->
                <div class="space-y-2 mt-2 relative">
                  <div 
                    v-for="task in ganttTasks" 
                    :key="task.id"
                    class="h-8 relative"
                  >
                    <div 
                      v-if="getGanttTaskPosition(task)"
                      class="absolute top-1 h-6 rounded-md cursor-pointer"
                      :class="getStatusBackgroundClass(task.state)"
                      :style="{
                        left: getGanttTaskPosition(task).left + 'rem',
                        width: getGanttTaskPosition(task).width + 'rem'
                      }"
                      @click.stop="selectTask(task)"
                    >
                      <div class="px-2 py-1 text-xs font-medium truncate">
                        {{ task.name }}
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- Today indicator -->
                <div 
                  class="absolute top-0 bottom-0 w-px bg-red-500"
                  :style="{ left: getTodayPosition + 'rem' }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Task Detail Section (when a task is selected) -->
      <div v-if="selectedTaskId" class="mt-8">
        <div class="bg-white shadow rounded-lg overflow-hidden">
          <!-- Collapsible Header -->
          <div 
            @click="isTaskDetailExpanded = !isTaskDetailExpanded" 
            class="px-4 py-4 flex justify-between items-center cursor-pointer hover:bg-gray-50 border-b border-gray-200"
          >
            <div class="flex items-center">
              <h3 class="text-lg font-medium text-gray-900">Task Details</h3>
              <span class="ml-2 text-sm text-gray-500">
                (Click to {{ isTaskDetailExpanded ? 'collapse' : 'expand' }})
              </span>
            </div>
            <div class="flex items-center">
              <!-- Collapse/Expand icon -->
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                class="h-5 w-5 text-gray-500 transition-transform duration-200"
                :class="{'transform rotate-180': !isTaskDetailExpanded}"
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          
          <!-- Collapsible Content -->
          <div v-show="isTaskDetailExpanded" class="transition-all duration-300">
            <TeamTaskDetailManager
              :taskId="selectedTaskId"
              @update:task="handleTaskUpdate"
              @edit:task="editTask"
            />
          </div>
        </div>
      </div>
    </main>

    <!-- Task Form Modal -->
    <!-- ... (tas form modal code remains the same) ... -->

    <!-- Delete Confirmation Modal -->
    <!-- ... (delete confirmation modal code remains the same) ... -->
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useToast } from '@/composables/useToast';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval,
  getDay, 
  isToday, 
  isWeekend,
  isSameMonth,
  isSameDay,
  addWeeks,
  subWeeks,
  startOfWeek,
  endOfWeek,
  parseISO,
  differenceInDays
} from 'date-fns';
import apiClient from '@/config/api';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  ExclamationTriangleIcon,
  MagnifyingGlassIcon as SearchIcon,
  DocumentTextIcon as DocumentIcon,
  TableCellsIcon as TableIcon,
  CalendarIcon,
  ChartBarIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/vue/24/outline';
import TeamTaskDetailManager from '@/components/team/TeamTaskDetailManager.vue';
import Toast from '@/components/Toast.vue';
import Draggable from 'vuedraggable';

const props = defineProps({
  projectId: {
    type: [Number, String],
    default: null
  }
});

const { toast, showToast } = useToast();
const tasks = ref([]);
const projects = ref([]);
const loading = ref(false);
const selectedTaskId = ref(null);
const showTaskModal = ref(false);
const showDeleteConfirm = ref(false);
const isEditingTask = ref(false);
const taskToDelete = ref(null);
const searchQuery = ref('');
const statusFilter = ref('');
const projectFilter = ref('');
const formErrors = ref([]);
const isTaskDetailExpanded = ref(true);

// View mode selection
const viewMode = ref('table'); // 'table', 'kanban', 'calendar', 'gantt'

// Calendar view state
const currentDate = ref(new Date());
const calendarView = ref('month'); // 'month', 'week'
const dateRange = ref({
  start: format(subMonths(new Date(), 1), 'yyyy-MM-dd'),
  end: format(addMonths(new Date(), 1), 'yyyy-MM-dd')
});

// Gantt view state
const ganttView = ref('month'); // 'week', 'month'
const ganttStartDate = ref(new Date());

const currentTask = ref({
  name: '',
  project_id: '',
  assigned_to: [],
  planned_date_start: '',
  planned_date_end: '',
  planned_hours: '',
  description: '',
  state: 'draft',
  progress: 0
});

// Calendar helpers
const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const currentMonthName = computed(() => {
  return format(currentDate.value, 'MMMM');
});

const currentYear = computed(() => {
  return format(currentDate.value, 'yyyy');
});

const calendarDays = computed(() => {
  const monthStart = startOfMonth(currentDate.value);
  const monthEnd = endOfMonth(currentDate.value);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  
  const days = eachDayOfInterval({ start: startDate, end: endDate });
  
  return days.map(date => ({
    date,
    day: format(date, 'd'),
    isCurrentMonth: isSameMonth(date, currentDate.value),
    isWeekend: isWeekend(date),
    isToday: isToday(date)
  }));
});

const weekViewDays = computed(() => {
  const weekStart = startOfWeek(currentDate.value);
  
  return Array.from({ length: 7 }, (_, i) => {
    const date = addDays(weekStart, i);
    return {
      date,
      day: format(date, 'd'),
      name: format(date, 'EEE'),
      isToday: isToday(date)
    };
  });
});

// Gantt helpers
const ganttDays = computed(() => {
  let days = [];
  let startDate, endDate;
  
  if (ganttView.value === 'week') {
    startDate = startOfWeek(ganttStartDate.value);
    endDate = endOfWeek(ganttStartDate.value);
  } else { // month
    startDate = startOfMonth(ganttStartDate.value);
    endDate = endOfMonth(ganttStartDate.value);
  }
  
  const dateRange = eachDayOfInterval({ start: startDate, end: endDate });
  
  return dateRange.map(date => ({
    date,
    dayLabel: format(date, 'EEE'),
    dateLabel: format(date, 'd'),
    isWeekend: isWeekend(date)
  }));
});

const ganttPeriodLabel = computed(() => {
  if (ganttView.value === 'week') {
    const start = startOfWeek(ganttStartDate.value);
    const end = endOfWeek(ganttStartDate.value);
    return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`;
  } else {
    return format(ganttStartDate.value, 'MMMM yyyy');
  }
});

const ganttTasks = computed(() => {
  return filteredTasks.value.filter(task => 
    task.dates?.planned_start && task.dates?.planned_end
  );
});

const getTodayPosition = computed(() => {
  if (ganttDays.value.length === 0) return 0;
  
  const today = new Date();
  const startDate = ganttDays.value[0].date;
  
  // Calculate days between start date and today
  const daysDiff = differenceInDays(today, startDate);
  
  // Convert to rem position (3rem per day)
  return Math.max(0, daysDiff * 3);
});

// Calendar and Gantt functions
function prevMonth() {
  currentDate.value = subMonths(currentDate.value, 1);
}

function nextMonth() {
  currentDate.value = addMonths(currentDate.value, 1);
}

function goToToday() {
  currentDate.value = new Date();
}

function prevGanttPeriod() {
  if (ganttView.value === 'week') {
    ganttStartDate.value = subWeeks(ganttStartDate.value, 1);
  } else {
    ganttStartDate.value = subMonths(ganttStartDate.value, 1);
  }
}

function nextGanttPeriod() {
  if (ganttView.value === 'week') {
    ganttStartDate.value = addWeeks(ganttStartDate.value, 1);
  } else {
    ganttStartDate.value = addMonths(ganttStartDate.value, 1);
  }
}

function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function getTasksForDay(date) {
  if (!date) return [];
  
  return filteredTasks.value.filter(task => {
    // Tasks without dates are excluded
    if (!task.dates?.planned_start && !task.dates?.planned_end) return false;
    
    let matchesDay = false;
    
    // Check if task starts on this day
    if (task.dates?.planned_start) {
      const startDate = parseISO(task.dates.planned_start);
      if (isSameDay(startDate, date)) {
        matchesDay = true;
      }
    }
    
    // Check if task ends on this day
    if (task.dates?.planned_end && !matchesDay) {
      const endDate = parseISO(task.dates.planned_end);
      if (isSameDay(endDate, date)) {
        matchesDay = true;
      }
    }
    
    // Check if task spans over this day
    if (!matchesDay && task.dates?.planned_start && task.dates?.planned_end) {
      const startDate = parseISO(task.dates.planned_start);
      const endDate = parseISO(task.dates.planned_end);
      
      if (date >= startDate && date <= endDate) {
        matchesDay = true;
      }
    }
    
    return matchesDay;
  });
}

function getGanttTaskPosition(task) {
  if (!task.dates?.planned_start || !task.dates?.planned_end || !ganttDays.value.length) {
    return null;
  }
  
  const startDate = parseISO(task.dates.planned_start);
  const endDate = parseISO(task.dates.planned_end);
  const firstDate = ganttDays.value[0].date;
  const lastDate = ganttDays.value[ganttDays.value.length - 1].date;
  
  // Task is completely outside the visible range
  if (endDate < firstDate || startDate > lastDate) {
    return null;
  }
  
  // Calculate start position
  const startPos = Math.max(0, differenceInDays(startDate, firstDate));
  
  // Calculate width (duration in days)
  const endPos = Math.min(
    ganttDays.value.length - 1, 
    differenceInDays(endDate, firstDate)
  );
  
  const width = Math.max(1, endPos - startPos + 1);
  
  return {
    left: startPos * 3, // 3rem per day
    width: width * 3
  };
}

function addTaskForDate(date) {
  // Reset form
  resetTaskForm();
  
  // Pre-fill the start date
  currentTask.value.planned_date_start = format(date, 'yyyy-MM-dd');
  
  // Open modal
  isEditingTask.value = false;
  showTaskModal.value = true;
}

function getStatusColor(status) {
  const colorMap = {
    'draft': 'gray',
    'planned': 'blue',
    'in_progress': 'yellow',
    'review': 'purple',
    'done': 'green',
    'cancelled': 'red'
  };
  return colorMap[status] || 'gray';
}

function getStatusBackgroundClass(status) {
  const classMap = {
    'draft': 'bg-gray-200 text-gray-800',
    'planned': 'bg-blue-200 text-blue-800',
    'in_progress': 'bg-yellow-200 text-yellow-800',
    'review': 'bg-purple-200 text-purple-800',
    'done': 'bg-green-200 text-green-800',
    'cancelled': 'bg-red-200 text-red-800'
  };
  return classMap[status] || 'bg-gray-200 text-gray-800';
}

// Computed properties for filtered tasks
const filteredTasks = computed(() => {
  return tasks.value.filter(task => {
    // Filter by search query
    const matchesSearch = !searchQuery.value || 
      task.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchQuery.value.toLowerCase()));
    
    // Filter by status
    const matchesStatus = !statusFilter.value || task.state === statusFilter.value;
    
    // Filter by project
    const matchesProject = !projectFilter.value || 
      (task.project && task.project.id.toString() === projectFilter.value.toString());
    
    return matchesSearch && matchesStatus && matchesProject;
  });
});

// Kanban board columns
const draftTasks = computed(() => {
  return filteredTasks.value.filter(task => task.state === 'draft');
});

const plannedTasks = computed(() => {
  return filteredTasks.value.filter(task => task.state === 'planned');
});

const inProgressTasks = computed(() => {
  return filteredTasks.value.filter(task => task.state === 'in_progress');
});

const reviewTasks = computed(() => {
  return filteredTasks.value.filter(task => task.state === 'review');
});

const completedTasks = computed(() => {
  return filteredTasks.value.filter(task => task.state === 'done');
});

const cancelledTasks = computed(() => {
  return filteredTasks.value.filter(task => task.state === 'cancelled');
});

// Methods
const fetchTasks = async () => {
  loading.value = true;
  try {
    const payload = {
      jsonrpc: '2.0',
      method: 'call',
      params: {
        operation: 'list'
      }
    };
    
    // Add project filter if projectId is specified
    if (props.projectId) {
      payload.params.project_id = parseInt(props.projectId);
    }
    
    const response = await apiClient.post('/web/v2/team/tasks', payload);
    
    if (response.data.result?.status === 'success') {
      tasks.value = response.data.result.data || [];
    } else {
      showToast({
        message: 'Failed to load tasks. Please try again.',
        type: 'error'
      });
    }
  } catch (error) {
    console.error('Error fetching tasks:', error);
    showToast({
      message: 'Failed to load tasks. Please try again.',
      type: 'error'
    });
  } finally {
    loading.value = false;
  }
};

// Core UI methods
const getInitials = (name) => {
  if (!name) return '';
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

const formatStatus = (status) => {
  const statusMap = {
    'draft': 'Draft',
    'planned': 'Planned',
    'in_progress': 'In Progress',
    'review': 'In Review',
    'done': 'Completed',
    'cancelled': 'Cancelled'
  };
  return statusMap[status] || status;
};

const getStatusClass = (status) => {
  const classMap = {
    'draft': 'bg-gray-100 text-gray-800',
    'planned': 'bg-blue-100 text-blue-800',
    'in_progress': 'bg-yellow-100 text-yellow-800',
    'review': 'bg-purple-100 text-purple-800',
    'done': 'bg-green-100 text-green-800',
    'cancelled': 'bg-red-100 text-red-800'
  };
  return classMap[status] || 'bg-gray-100 text-gray-800';
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  try {
    return format(parseISO(dateString), 'MMM d, yyyy');
  } catch (e) {
    return dateString;
  }
};

const selectTask = (task) => {
  selectedTaskId.value = task.id;
};

const clearFilters = () => {
  searchQuery.value = '';
  statusFilter.value = '';
  projectFilter.value = '';
};

// Remaining methods (fetchProjects, resetTaskForm, editTask, etc.) remain the same...

// Lifecycle hooks
onMounted(async () => {
  await Promise.all([
    fetchTasks(),
    fetchProjects()
  ]);
  
  // Set the project default in the task form
  if (props.projectId && projects.value.length > 0) {
    resetTaskForm();
    currentTask.value.project_id = props.projectId;
  }
  
  // Set current dates for calendar and gantt
  currentDate.value = new Date();
  ganttStartDate.value = new Date();
});

// Watch for changes in projectId
watch(() => props.projectId, (newProjectId) => {
  if (newProjectId) {
    fetchTasks();
    
    // Update default project in the task form
    currentTask.value.project_id = newProjectId;
  }
});
</script>