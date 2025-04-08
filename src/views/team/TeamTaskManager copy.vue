<!-- src/components/team/TeamTaskManager.vue -->
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
            <p class="mt-1 max-w-2xl text-sm text-gray-500">Manage project tasks, checklists, and time tracking</p>
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
                  class="px-3 py-2 text-sm font-medium border border-gray-300 focus:outline-none focus:ring-1 focus:ring-red-500 -ml-px rounded-r-md flex items-center"
                  :class="viewMode === 'kanban' ? 'bg-red-50 text-red-700 border-red-500' : 'bg-white text-gray-700'"
                  title="Kanban Board View"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  <span class="hidden lg:inline">Kanban</span>
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
        <div class="flex md:hidden items-center justify-center mt-4">
          <span class="text-sm text-gray-500 mr-2">View as:</span>
          <div class="inline-flex rounded-md shadow-sm">
            <button
              @click="viewMode = 'table'"
              class="px-3 py-2 text-sm font-medium border border-gray-300 focus:outline-none focus:ring-1 focus:ring-red-500 rounded-l-md flex items-center"
              :class="viewMode === 'table' ? 'bg-red-50 text-red-700 border-red-500' : 'bg-white text-gray-700'"
            >
              <TableIcon class="h-4 w-4 mr-1" />
              <span>Table</span>
            </button>
            <button
              @click="viewMode = 'kanban'"
              class="px-3 py-2 text-sm font-medium border border-gray-300 focus:outline-none focus:ring-1 focus:ring-red-500 -ml-px rounded-r-md flex items-center"
              :class="viewMode === 'kanban' ? 'bg-red-50 text-red-700 border-red-500' : 'bg-white text-gray-700'"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              <span>Kanban</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <main class="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Task List -->
      <div v-if="viewMode === 'table'" class="bg-white shadow">
        <!-- Task filters & search (optional) -->
        <div class="w-full max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 bg-gray-50 border-t border-b border-gray-200">
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
                <option value="revision">Revision</option>
                <option value="completed">Completed</option>
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
        <div v-else-if="filteredTasks.length === 0" class="py-8 text-center">
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

        <!-- Task list -->
          <div v-else class="w-full max-w-full">
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
      </div>

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

          <!-- In Progress Column -->
          <div class="flex-shrink-0 w-80">
            <div class="bg-yellow-50 rounded-lg p-4">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-sm font-medium text-gray-900">In Progress</h3>
                <span class="text-xs font-medium text-gray-500 bg-white px-2 py-1 rounded-full">
                  {{ inProgressTasks.length }}
                </span>
              </div>
              
              <Draggable
                v-model="inProgressTasks"
                :group="{ name: 'tasks' }"
                item-key="id"
                class="space-y-3 min-h-[200px]"
                @end="handleDragEnd"
                data-state="in_progress"
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
      
          <!-- Review Column -->
          <div class="flex-shrink-0 w-80">
            <div class="bg-blue-50 rounded-lg p-4">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-sm font-medium text-gray-900">In Review</h3>
                <span class="text-xs font-medium text-gray-500 bg-white px-2 py-1 rounded-full">
                  {{ reviewTasks.length }}
                </span>
              </div>
              
              <Draggable
                v-model="reviewTasks"
                :group="{ name: 'tasks' }"
                item-key="id"
                class="space-y-3 min-h-[200px]"
                @end="handleDragEnd"
                data-state="review"
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
      
          <!-- Completed Column -->
          <div class="flex-shrink-0 w-80">
            <div class="bg-green-50 rounded-lg p-4">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-sm font-medium text-gray-900">Done</h3>
                <span class="text-xs font-medium text-gray-500 bg-white px-2 py-1 rounded-full">
                  {{ completedTasks.length }}
                </span>
              </div>
              
              <Draggable
                v-model="completedTasks"
                :group="{ name: 'tasks' }"
                item-key="id"
                class="space-y-3 min-h-[200px]"
                @end="handleDragEnd"
                data-state="done"
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

          <!-- Cancelled Column -->
          <div class="flex-shrink-0 w-80">
            <div class="bg-red-50 rounded-lg p-4">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-sm font-medium text-gray-900">Cancelled</h3>
                <span class="text-xs font-medium text-gray-500 bg-white px-2 py-1 rounded-full">
                  {{ cancelledTasks.length }}
                </span>
              </div>
              <Draggable
                v-model="cancelledTasks"
                :group="{ name: 'tasks' }"
                item-key="id"
                class="space-y-3 min-h-[200px]"
                @end="handleDragEnd"
                data-state="cancelled"
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
    <Teleport to="body">
      <Transition
        enter-active-class="transition ease-out duration-300"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition ease-in duration-200"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div 
          v-if="showTaskModal" 
          class="fixed inset-0 z-50 overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <!-- Backdrop -->
          <div 
            class="fixed inset-0 bg-black bg-opacity-60 transition-opacity" 
            @click="showTaskModal = false"
          ></div>
          
          <!-- Modal Container -->
          <div class="flex items-center justify-center min-h-screen p-4">
            <Transition
              enter-active-class="transition ease-out duration-300"
              enter-from-class="transform opacity-0 scale-95"
              enter-to-class="transform opacity-100 scale-100"
              leave-active-class="transition ease-in duration-200"
              leave-from-class="transform opacity-100 scale-100"
              leave-to-class="transform opacity-0 scale-95"
            >
              <div 
                v-if="showTaskModal"
                class="bg-white rounded-lg shadow-xl overflow-hidden w-full max-w-5xl mx-auto relative z-10 transform transition-all"
              >
                <!-- Modal Header -->
                <div class="bg-gray-50 px-5 py-4 flex items-center justify-between border-b border-gray-200">
                  <h2 class="text-xl font-bold text-gray-900">
                    {{ isEditingTask ? 'Edit Task' : 'Create New Task' }}
                  </h2>
                  <button
                    type="button"
                    class="rounded-md p-1.5 text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                    @click="showTaskModal = false"
                  >
                    <span class="sr-only">Close</span>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <!-- Modal Body -->
                <div class="p-6 max-h-[75vh] overflow-y-auto">
                  <!-- Form Instruction -->
                  <p class="mb-6 text-sm text-gray-600">
                    Fill in the details below. Required fields are marked with <span class="text-red-500 font-medium">*</span>
                  </p>
                  
                  <div class="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6">
                    <!-- Left Column -->
                    <div>
                      <div class="bg-white rounded-md border border-gray-200 shadow-sm overflow-hidden">
                        <div class="bg-gray-50 px-4 py-3 border-b border-gray-200">
                          <h3 class="text-sm font-medium text-gray-900">Task Information</h3>
                        </div>
                        
                        <div class="px-4 py-4 space-y-4">
                          <!-- Task Name -->
                          <div>
                            <label for="task-name" class="block text-sm font-medium text-gray-700">
                              Task Name <span class="text-red-500">*</span>
                            </label>
                            <input
                              id="task-name"
                              v-model="currentTask.name"
                              type="text"
                              class="mt-1 block w-full text-sm border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                              placeholder="Enter a descriptive task name"
                              required
                            />
                          </div>

                          <!-- Project -->
                          <div>
                            <label for="task-project" class="block text-sm font-medium text-gray-700">
                              Project <span class="text-red-500">*</span>
                            </label>
                            <div class="mt-1 relative">
                              <select
                                id="task-project"
                                v-model="currentTask.project_id"
                                class="block w-full text-sm border border-gray-300 rounded-md shadow-sm py-2 pl-3 pr-10 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 appearance-none"
                                required
                              >
                                <option value="" disabled selected>Select a project</option>
                                <option v-for="project in projects" :key="project.id" :value="project.id">
                                  {{ project.name }}
                                </option>
                              </select>
                              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                                </svg>
                              </div>
                            </div>
                          </div>
                          
                          <!-- Description -->
                          <div>
                            <label for="task-description" class="block text-sm font-medium text-gray-700">
                              Description
                            </label>
                            <textarea
                              id="task-description"
                              v-model="currentTask.description"
                              rows="5"
                              class="mt-1 block w-full text-sm border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                              placeholder="Provide details about this task"
                            ></textarea>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Right Column -->
                    <div class="space-y-6">
                      <!-- Assignment Card -->
                      <div class="bg-white rounded-md border border-gray-200 shadow-sm overflow-hidden">
                        <div class="bg-gray-50 px-4 py-3 border-b border-gray-200">
                          <h3 class="text-sm font-medium text-gray-900">Team Assignment</h3>
                        </div>
                        
                        <div class="px-4 py-4">
                          <!-- Team Members -->
                          <label class="block text-sm font-medium text-gray-700 mb-1">
                            Assigned Team Members <span class="text-red-500">*</span>
                          </label>
                          
                          <div v-if="currentTask.project_id" class="border border-gray-300 rounded-md overflow-hidden">
                            <div v-if="getProjectTeamMembers(currentTask.project_id).length > 0" class="max-h-48 overflow-y-auto">
                              <div v-for="member in getProjectTeamMembers(currentTask.project_id)" :key="member.id"
                                class="flex items-center py-2 px-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0">
                                <div class="flex-shrink-0 mr-2">
                                  <div class="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-medium uppercase text-xs">
                                    {{ getInitials(member.name) }}
                                  </div>
                                </div>
                                <div class="flex-1 min-w-0">
                                  <label :for="`member-${member.id}`" class="block text-sm font-medium text-gray-900 cursor-pointer">
                                    {{ member.name }}
                                  </label>
                                </div>
                                <div class="ml-2">
                                  <input
                                    type="checkbox"
                                    :id="`member-${member.id}`"
                                    :value="member.id"
                                    v-model="currentTask.assigned_to"
                                    class="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                                  />
                                </div>
                              </div>
                            </div>
                            <div v-else class="p-3 text-center">
                              <p class="text-sm text-gray-500">No team members available</p>
                            </div>
                          </div>
                          <div v-else class="mt-1 bg-orange-50 border border-orange-200 rounded-md p-3 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-orange-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p class="text-sm text-orange-700">Please select a project first</p>
                          </div>
                        </div>
                      </div>
                      
                      <!-- Schedule Card -->
                      <div class="bg-white rounded-md border border-gray-200 shadow-sm overflow-hidden">
                        <div class="bg-gray-50 px-4 py-3 border-b border-gray-200">
                          <h3 class="text-sm font-medium text-gray-900">Schedule & Status</h3>
                        </div>
                        
                        <div class="px-4 py-4 space-y-4">
                          <!-- Dates -->
                          <div class="grid grid-cols-2 gap-4">
                            <div>
                              <label for="task-planned-start" class="block text-sm font-medium text-gray-700">Start Date</label>
                              <div class="mt-1 relative">
                                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                </div>
                                <input
                                  id="task-planned-start"
                                  v-model="currentTask.planned_date_start"
                                  type="date"
                                  class="block w-full text-sm border border-gray-300 rounded-md shadow-sm py-2 pl-9 pr-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                />
                              </div>
                            </div>
                            <div>
                              <label for="task-planned-end" class="block text-sm font-medium text-gray-700">End Date</label>
                              <div class="mt-1 relative">
                                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                </div>
                                <input
                                  id="task-planned-end"
                                  v-model="currentTask.planned_date_end"
                                  type="date"
                                  class="block w-full text-sm border border-gray-300 rounded-md shadow-sm py-2 pl-9 pr-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                />
                              </div>
                            </div>
                          </div>
                          
                          <!-- Hours & Status -->
                          <div class="grid grid-cols-2 gap-4">
                            <!-- Hours -->
                            <div>
                              <label for="task-planned-hours" class="block text-sm font-medium text-gray-700">Planned Hours</label>
                              <div class="mt-1 relative rounded-md shadow-sm">
                                <input
                                  id="task-planned-hours"
                                  v-model="currentTask.planned_hours"
                                  type="number"
                                  min="0"
                                  step="0.5"
                                  class="block w-full text-sm border border-gray-300 rounded-md shadow-sm py-2 pl-3 pr-10 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                  placeholder="0"
                                />
                                <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                  <span class="text-gray-500 sm:text-sm">hrs</span>
                                </div>
                              </div>
                            </div>
                            
                            <!-- Status -->
                            <div>
                              <label for="task-status" class="block text-sm font-medium text-gray-700">Status</label>
                              <div class="mt-1 relative">
                                <select
                                  id="task-status"
                                  v-model="currentTask.state"
                                  class="block w-full text-sm border border-gray-300 rounded-md shadow-sm py-2 pl-3 pr-10 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 appearance-none"
                                >
                                  <option value="draft">Draft</option>
                                  <option value="planned">Planned</option>
                                  <option value="in_progress">In Progress</option>
                                  <option value="review">In Review</option>
                                  <option value="revision">Revision</option>
                                  <option value="completed">Completed</option>
                                  <option value="cancelled">Cancelled</option>
                                </select>
                                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                                  </svg>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <!-- Progress -->
                          <div>
                            <div class="flex justify-between items-center">
                              <label for="task-progress" class="block text-sm font-medium text-gray-700">Progress</label>
                              <span class="text-sm font-medium text-red-600">{{ currentTask.progress || 0 }}%</span>
                            </div>
                            <div class="mt-1">
                              <input
                                id="task-progress"
                                v-model="currentTask.progress"
                                type="range"
                                min="0"
                                max="100"
                                step="5"
                                class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-600"
                              />
                              <div class="flex justify-between text-xs text-gray-500 mt-1">
                                <span>0%</span>
                                <span>50%</span>
                                <span>100%</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Form Errors -->
                  <div v-if="formErrors.length > 0" class="mt-6 p-3 bg-red-50 border border-red-200 rounded-md">
                    <div class="flex">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div class="ml-3">
                        <h3 class="text-sm font-medium text-red-800">Please fix the following errors:</h3>
                        <ul class="mt-1 text-xs text-red-700 list-disc ml-5 space-y-1">
                          <li v-for="(error, index) in formErrors" :key="index">{{ error }}</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- Modal Footer -->
                <div class="bg-gray-50 px-5 py-4 flex justify-end space-x-3 border-t border-gray-200">
                  <button
                    type="button"
                    class="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    @click="showTaskModal = false"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    class="px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-rose-600 to-rose-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    @click="submitTask"
                  >
                    {{ isEditingTask ? 'Update Task' : 'Create Task' }}
                  </button>
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </Transition>
    </Teleport>


    <!-- Delete Confirmation Modal -->
     <!-- Delete Confirmation Modal -->
     <DeleteConfirmationModal
      :show="showDeleteConfirm"
      @close="showDeleteConfirm = false"
      @confirm="confirmDelete"
      title="Delete Task"
      :message="`Are you sure you want to delete the task '${taskToDelete?.name}'? This action cannot be undone.`"
      confirmButtonText="Delete"
      cancelButtonText="Cancel"
    />

    <!-- Toast Component (reuse from Tasks.vue) -->
    <Toast
      v-if="toast.show"
      :message="toast.message"
      :type="toast.type"
      :duration="toast.duration"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useToast } from '@/composables/useToast';
import { format } from 'date-fns';
import apiClient from '@/config/api';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  ExclamationTriangleIcon,
  MagnifyingGlassIcon as SearchIcon,
  DocumentTextIcon as DocumentIcon,
  TableCellsIcon as TableIcon, // Added for table view
  ViewColumnsIcon // Added for kanban view
} from '@heroicons/vue/24/outline';
import DialogModal from '@/components/modal/DialogModal.vue';
import DeleteConfirmationModal from '@/components/modal/DeleteConfirmationModal.vue';
import TeamTaskDetailManager from '@/components/team/TeamTaskDetailManager.vue';
import Toast from '@/components/Toast.vue';
import TeamSelect from '@/components/TeamSelect.vue';
import Draggable from 'vuedraggable'

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

// Add this to your ref declarations
const viewMode = ref('table') // Default to table view

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

// Computed properties
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

// Get department ID for the selected project
const getProjectDepartmentId = (projectId) => {
  if (!projectId) return null;
  
  const selectedProject = projects.value.find(p => p.id === parseInt(projectId));
  return selectedProject?.department?.id || null;
};

// Get team members from the selected project
const getProjectTeamMembers = (projectId) => {
  if (!projectId) return [];
  
  const selectedProject = projects.value.find(p => p.id === parseInt(projectId));
  if (!selectedProject || !selectedProject.team) return [];
  
  // Combine manager and team members into a single array
  const allMembers = [];
  
  // Add manager if exists
  if (selectedProject.team.manager) {
    allMembers.push(selectedProject.team.manager);
  }
  
  // Add team members if exists
  if (selectedProject.team.members && selectedProject.team.members.length > 0) {
    allMembers.push(...selectedProject.team.members);
  }
  
  return allMembers;
};

const fetchProjects = async () => {
  try {
    const response = await apiClient.post('/web/v2/team/projects/list', {
      jsonrpc: '2.0',
      method: 'call',
      id: new Date().getTime()
    });
    
    if (response.data.result?.status === 'success') {
      projects.value = response.data.result.data || [];
      console.log('Projects loaded:', projects.value);
      showToast({
        message: 'Tasks loaded successfully.',
        type: 'success'
      });
    } else {
      showToast({
        message: 'Failed to load projects. Please try again.',
        type: 'error'
      });
    }
  } catch (error) {
    console.error('Error fetching projects:', error);
    showToast({
      message: 'Failed to load projects. Please try again.',
      type: 'error'
    });
  }
};

// Add this function to your component script
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
    'revision': 'Revision',
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
    'revision': 'bg-indigo-100 text-indigo-800',
    'done': 'bg-green-100 text-green-800',
    'cancelled': 'bg-red-100 text-red-800'
  };
  return classMap[status] || 'bg-gray-100 text-gray-800';
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  try {
    return format(new Date(dateString), 'MMM d, yyyy');
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

const resetTaskForm = () => {
  formErrors.value = [];
  currentTask.value = {
    name: '',
    project_id: projects.value.length > 0 ? projects.value[0].id : '',
    assigned_to: [],
    planned_date_start: '',
    planned_date_end: '',
    planned_hours: '',
    description: '',
    state: 'draft',
    progress: 0
  };
};

const editTask = (task) => {
  isEditingTask.value = true;
  formErrors.value = [];
  
  // Format assigned_to as expected by the form
  const assignedToIds = task.assigned_to.map(person => person.id);
  
  currentTask.value = {
    id: task.id,
    name: task.name,
    project_id: task.project?.id || '',
    assigned_to: assignedToIds,
    planned_date_start: task.dates?.planned_start ? task.dates.planned_start.split('T')[0] : '',
    planned_date_end: task.dates?.planned_end ? task.dates.planned_end.split('T')[0] : '',
    planned_hours: task.hours?.planned || '',
    description: task.description || '',
    state: task.state || 'draft',
    progress: task.progress || 0
  };
  
  showTaskModal.value = true;
};

const validateForm = () => {
  formErrors.value = [];
  
  if (!currentTask.value.name.trim()) {
    formErrors.value.push('Task name is required');
  }
  
  if (!currentTask.value.project_id) {
    formErrors.value.push('Project is required');
  }
  
  if (!currentTask.value.assigned_to || currentTask.value.assigned_to.length === 0) {
    formErrors.value.push('At least one assignee is required');
  }
  
  // Validate dates if both are provided
  if (currentTask.value.planned_date_start && currentTask.value.planned_date_end) {
    const startDate = new Date(currentTask.value.planned_date_start);
    const endDate = new Date(currentTask.value.planned_date_end);
    
    if (endDate < startDate) {
      formErrors.value.push('End date cannot be earlier than start date');
    }
  }
  
  return formErrors.value.length === 0;
};

const submitTask = async () => {
  // Validate form
  if (!validateForm()) {
    return;
  }

  try {
    loading.value = true;
    const payload = {
      jsonrpc: '2.0',
      method: 'call',
      params: {
        operation: isEditingTask.value ? 'update' : 'create',
        name: currentTask.value.name.trim(),
        project_id: parseInt(currentTask.value.project_id),
        assigned_to: currentTask.value.assigned_to,
        description: currentTask.value.description?.trim() || '',
        state: currentTask.value.state,
        progress: currentTask.value.progress || 0
      }
    };

    // Add optional fields if they have values
    if (currentTask.value.planned_date_start) {
      payload.params.planned_date_start = currentTask.value.planned_date_start;
    }
    if (currentTask.value.planned_date_end) {
      payload.params.planned_date_end = currentTask.value.planned_date_end;
    }
    if (currentTask.value.planned_hours) {
      payload.params.planned_hours = parseFloat(currentTask.value.planned_hours);
    }

    if (isEditingTask.value) {
      payload.params.task_id = currentTask.value.id;
    }

    console.log('Submitting task:', payload);

    const response = await apiClient.post('/web/v2/team/tasks', payload);
    
    if (response.data.result?.status === 'success') {
      showToast({
        message: 'Tugas berhasil ' + (isEditingTask.value? 'diperbarui' : 'ditambahkan'),
        type: 'success'
      });

      resetTaskForm();
      showTaskModal.value = false;
      fetchTasks(); // Refresh the list
      
      // If this was a new task, select it for viewing
      if (!isEditingTask.value && response.data.result.data?.id) {
        selectedTaskId.value = response.data.result.data.id;
      }
    } else {
      showToast({
        message: 'Gagal menyimpan tugas. Silakan coba lagi.',
        type:'error'
      });
    }
  } catch (error) {
    console.error('Error submitting task:', error);
    showToast({
        message: 'Gagal menyimpan tugas. Silakan coba lagi.',
        type:'error'
      });
  } finally {
    loading.value = false;
  }
};

const confirmDeleteTask = (task) => {
  taskToDelete.value = task;
  showDeleteConfirm.value = true;
};

const confirmDelete = async () => {
  if (!taskToDelete.value) return;
  
  try {
    loading.value = true;
    const response = await apiClient.post('/web/v2/team/tasks', {
      jsonrpc: '2.0',
      method: 'call',
      params: {
        operation: 'delete',
        task_id: taskToDelete.value.id
      }
    });
    
    if (response.data.result?.status === 'success') {
      showToast({
        message: 'Tugas berhasil dihapus',
        type:'success'
      });
      
      // If the deleted task was selected, clear the selection
      if (selectedTaskId.value === taskToDelete.value.id) {
        selectedTaskId.value = null;
      }
      
      fetchTasks(); // Refresh the list
    } else {
      showToast(`Error: ${response.data.result?.message || 'Failed to delete task'}`, 'error');
    }
  } catch (error) {
    console.error('Error deleting task:', error);
    showToast({
        message: 'Gagal menghapus tugas. Silakan coba lagi.',
        type:'error'
      });
  } finally {
    showDeleteConfirm.value = false;
    taskToDelete.value = null;
    loading.value = false;
  }
};

const handleTaskUpdate = (updatedTask) => {
  // Update task in the local list
  const index = tasks.value.findIndex(t => t.id === updatedTask.id);
  if (index !== -1) {
    tasks.value[index] = { ...tasks.value[index], ...updatedTask };
  }
};

// KANBAN VIEW
// Add these computed properties for kanban columns
const draftTasks = computed(() => {
  return filteredTasks.value.filter(task => task.state === 'draft')
})

const plannedTasks = computed(() => {
  return filteredTasks.value.filter(task => task.state === 'planned')
})

const inProgressTasks = computed(() => {
  return filteredTasks.value.filter(task => task.state === 'in_progress')
})

const reviewTasks = computed(() => {
  return filteredTasks.value.filter(task => task.state === 'review')
})

const completedTasks = computed(() => {
  return filteredTasks.value.filter(task => task.state === 'done')
})

const cancelledTasks = computed(() => {
  return filteredTasks.value.filter(task => task.state === 'cancelled')
})

const getProgressColor = (progress) => {
  if (progress < 30) return 'bg-red-100 text-red-800'
  if (progress < 70) return 'bg-yellow-100 text-yellow-800'
  return 'bg-green-100 text-green-800'
}

const getProgressBarWidth = (progress) => {
  return `${progress}%`
}

// Add this method for drag-and-drop functionality
const handleDragEnd = async (event) => {
  try {
    // Get the task and the new state
    const task = event.item.__draggable_context?.element
    if (!task) return
    
    const newState = event.to.getAttribute('data-state')
    if (!newState || task.state === newState) return
    
    // Update the task status
    loading.value = true
    const response = await apiClient.post('/web/v2/team/tasks', {
      jsonrpc: '2.0',
      method: 'call',
      params: {
        operation: 'update',
        task_id: task.id,
        state: newState,
        progress: newState === 'done' ? 100 : task.progress,
        auto_timesheet: true
      }
    })
    
    if (response.data.result?.status === 'success') {
      showToast({
        message: 'Task status updated successfully',
        type: 'success'
      })
      fetchTasks() // Refresh tasks
    } else {
      showToast({
        message: 'Failed to update task status',
        type: 'error'
      })
      fetchTasks() // Refresh to original state
    }
  } catch (error) {
    console.error('Error updating task status:', error)
    showToast({
      message: 'Failed to update task status',
      type: 'error'
    })
    fetchTasks() // Refresh to original state
  } finally {
    loading.value = false
  }
}

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
});

// Watch for changes in projectId
watch(() => props.projectId, (newProjectId) => {
  if (newProjectId) {
    fetchTasks();
    
    // Update default project in the task form
    currentTask.value.project_id = newProjectId;
  }
});

// Watch for project changes to update available team members
watch(() => currentTask.value.project_id, (newProjectId) => {
  if (newProjectId) {
    // When project changes, if the current assignees are not from this department,
    // we might want to clear the selection or keep it depending on business rules
    // Here we're keeping the selection for a better user experience
    console.log('Project changed, department ID:', getProjectDepartmentId(newProjectId));
  }
});

// Watch for project filter changes
watch(projectFilter, (newProjectId) => {
  // Update tasks based on project filter
  if (newProjectId) {
    fetchTasks();
  }
});
</script>