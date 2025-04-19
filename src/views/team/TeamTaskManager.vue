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
      <!-- Improved Task filters & search section -->
      <div class="w-full max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 mb-4 bg-white shadow rounded-md border border-gray-200">
        <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 items-end">
          <!-- Search field - kept outside filter modal -->
          <div class="w-full sm:w-72">
            <label for="task-search" class="block text-xs text-gray-500 mb-1">Search</label>
            <div class="relative rounded-md shadow-sm">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon class="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                id="task-search"
                v-model="searchQuery"
                @keyup.enter="fetchTasks"
                class="px-3 py-2 focus:ring-red-500 focus:border-red-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                placeholder="Search tasks..."
              />
            </div>
          </div>
          
          <!-- Assignee dropdown (improved with autocomplete) -->
          <div class="w-full sm:w-64">
            <label for="task-assignee" class="block text-xs text-gray-500 mb-1">Assignee</label>
              <div class="relative">
                <div
                  class="w-full relative"
                  @click="showAssigneeDropdown = !showAssigneeDropdown"
                  @keydown.esc="showAssigneeDropdown = false"
                  @blur="setTimeout(() => showAssigneeDropdown = false, 100)"
                >
                  <div class="relative rounded-md shadow-sm">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <UserIcon class="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="task-assignee"
                      v-model="assigneeSearchText"
                      @input="handleAssigneeSearch"
                      @focus="showAssigneeDropdown = true"
                      class="px-3 py-2 focus:ring-red-500 focus:border-red-500 block w-full pl-10 pr-10 sm:text-sm border-gray-300 rounded-md"
                      placeholder="All assignees"
                    />
                  </div>
                  
                  <!-- Dropdown options -->
                  <!-- Dropdown options -->
                <div
                  v-if="showAssigneeDropdown"
                  class="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base overflow-auto focus:outline-none sm:text-sm"
                  >
                  <!-- Tambahkan debugging output -->
                  <div v-if="filteredEmployees.length === 0" class="text-center py-2 text-gray-500 text-sm">
                    {{ employees.length === 0 ? 'Loading employees...' : 'No matching employees' }}
                  </div>

                  <div
                    @click="assignedToFilter = ''; assigneeSearchText = ''"
                    class="cursor-default select-none relative py-2 px-4 hover:bg-gray-100"
                    :class="assignedToFilter === '' ? 'text-red-600 font-medium' : 'text-gray-900'"
                  >
                    All assignees
                  </div>

                  <div
                    v-for="employee in filteredEmployees"
                    :key="employee.id"
                    @click="selectAssignee(employee)"
                    class="cursor-default select-none relative py-2 px-4 hover:bg-gray-100"
                    :class="assignedToFilter === employee.id ? 'text-red-600 font-medium' : 'text-gray-900'"
                  >
                    {{ employee.name }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Filter Project (tambahkan setelah department) -->
          <div class="w-full sm:w-64">
            <label for="task-project" class="block text-xs text-gray-500 mb-1">Project</label>
            <div class="relative">
              <div
                class="w-full relative"
                @click="showProjectDropdown = !showProjectDropdown"
                @keydown.esc="showProjectDropdown = false"
                @blur="setTimeout(() => showProjectDropdown = false, 100)"
              >
                <div class="relative rounded-md shadow-sm">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FolderIcon class="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="task-project"
                    v-model="projectSearchText"
                    @input="handleProjectSearch"
                    @focus="showProjectDropdown = true"
                    class="px-3 py-2 focus:ring-red-500 focus:border-red-500 block w-full pl-10 pr-10 sm:text-sm border-gray-300 rounded-md"
                    placeholder="All projects"
                  />
                  <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <ChevronDownIcon class="h-4 w-4 text-gray-400" />
                  </div>
                </div>
                
                <!-- Dropdown options -->
                <div
                  v-if="showProjectDropdown"
                  class="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base overflow-auto focus:outline-none sm:text-sm"
                >
                  <div
                    @click="() => { projectFilter = ''; projectSearchText = ''; showProjectDropdown = false; }"
                    class="cursor-default select-none relative py-2 px-4 hover:bg-gray-100"
                    :class="projectFilter === '' ? 'text-red-600 font-medium' : 'text-gray-900'"
                  >
                    All projects
                  </div>
                  <div
                    v-for="project in filteredProjects"
                    :key="project.id"
                    @click="() => { selectProject(project); showProjectDropdown = false; }"
                    class="cursor-default select-none relative py-2 px-4 hover:bg-gray-100"
                    :class="projectFilter === project.id ? 'text-red-600 font-medium' : 'text-gray-900'"
                  >
                    {{ project.name }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Project dropdown (similar autocomplete implementation) -->
          
          <!-- Filter Button with Badge -->
          <div class="w-full sm:w-auto sm:flex-none mb-0">
            <button
              @click="showFilterModal = true"
              class="inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 w-full sm:w-auto relative"
            >
              <FunnelIcon class="h-4 w-4 mr-1.5" />
              Filters
              <!-- Badge showing number of active filters -->
              <span 
                v-if="activeFilterCount > 0" 
                class="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center"
              >
                {{ activeFilterCount }}
              </span>
            </button>
          </div>
          
          <!-- Apply Filters Button -->
          <div class="w-full sm:w-auto sm:flex-none mb-0">
            <button
              @click="fetchTasks"
              class="inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gradient-to-r from-rose-600 to-rose-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 w-full sm:w-auto"
            >
              <ArrowPathIcon class="h-4 w-4 mr-1.5" />
              Apply Filters
            </button>
          </div>
        </div>
        
        <!-- Active filters display -->
        <div v-if="activeFilterCount > 0" class="mt-3 flex flex-wrap gap-2">
          <div 
            v-for="(filter, index) in displayedFilters" 
            :key="index" 
            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"
          >
            <span>{{ filter.label }}: {{ filter.value }}</span>
            <button 
              @click="removeFilter(filter.key)" 
              class="ml-1.5 h-4 w-4 flex items-center justify-center rounded-full bg-red-200 hover:bg-red-300 text-red-800"
            >
              <XIcon class="h-3 w-3" />
            </button>
          </div>
          <button 
            @click="clearAllFilters" 
            class="inline-flex items-center px-2 py-0.5 text-xs font-medium text-red-600 hover:text-red-800"
          >
            Clear all filters
          </button>
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
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Task
                </th>
                <th scope="col" class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                  Assigned To
                </th>
                <th scope="col" class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Priority
                </th>
                <th scope="col" class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                  Progress
                </th>
                <th scope="col" class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Due Date
                </th>
                <th scope="col" class="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="task in filteredTasks" :key="task.id" 
                  class="hover:bg-gray-50 cursor-pointer"
                  @click="selectTask(task)">
                <td class="px-3 py-2 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="max-w-[150px] sm:max-w-xs truncate">
                      <div class="text-sm font-medium text-gray-900 truncate">{{ task.name }}</div>
                      <div class="text-xs text-gray-500 truncate">{{ task.project?.name || 'No project' }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-3 py-2 whitespace-nowrap hidden sm:table-cell">
                  <div class="flex flex-col space-y-0.5">
                    <span v-for="person in task.assigned_to.slice(0, 2)" :key="person.id" class="text-xs text-gray-900 truncate max-w-[120px]">
                      {{ person.name }}
                    </span>
                    <span 
                      v-if="task.assigned_to.length > 2" 
                      class="text-xs text-gray-500 cursor-help relative group"
                    >
                      +{{ task.assigned_to.length - 2 }} more
                      <!-- Tooltip -->
                      <div class="absolute left-0 mt-1 w-48 bg-black bg-opacity-80 text-white text-xs rounded py-1 px-2 z-10 
                                  invisible group-hover:visible shadow-lg">
                        <div v-for="person in task.assigned_to.slice(2)" :key="person.id" class="py-0.5">
                          {{ person.name }}
                        </div>
                      </div>
                    </span>
                  </div>
                </td>
                <td class="px-3 py-2 whitespace-nowrap hidden md:table-cell">
                  <span 
                    class="px-1.5 py-0.5 inline-flex items-center text-xs leading-5 font-semibold rounded-full gap-1"
                    :class="{
                      'bg-blue-100 text-blue-800': task.priority === '0',
                      'bg-emerald-100 text-emerald-800': task.priority === '1',
                      'bg-amber-100 text-amber-800': task.priority === '2',
                      'bg-red-100 text-red-800': task.priority === '3',
                      'bg-gray-100 text-gray-800': !task.priority
                    }"
                  >
                    <Flag class="w-2.5 h-2.5" />
                    {{ task.priority ? formatPriority(task.priority) : 'Tidak ada' }}
                  </span>
                </td>
                
                <td class="px-3 py-2 whitespace-nowrap">
                  <span class="px-1.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full" :class="getStatusClass(task.state)">
                    {{ formatStatus(task.state) }}
                  </span>
                </td>
                <td class="px-3 py-2 whitespace-nowrap hidden lg:table-cell">
                  <div class="flex items-center">
                    <div class="w-16 bg-gray-200 rounded-full h-1.5 mr-1.5">
                      <div class="bg-red-600 h-1.5 rounded-full" :style="{ width: `${task.progress || 0}%` }"></div>
                    </div>
                    <span class="text-xs text-gray-500">{{ task.progress || 0 }}%</span>
                  </div>
                </td>
                <td class="px-3 py-2 whitespace-nowrap text-xs text-gray-500 hidden md:table-cell">
                  <div v-if="task.dates?.planned_start || task.dates?.planned_end" class="text-xs">
                    <div v-if="task.dates?.planned_end" class="text-xs">
                      {{ formatDate(task.dates.planned_end) }}
                    </div>
                  </div>
                  <span v-else>-</span>
                </td>
                <td class="px-3 py-2 whitespace-nowrap text-right text-sm font-medium" @click.stop>
                  <div class="flex justify-end space-x-1">
                    <button
                      @click="editTask(task)"
                      class="text-red-600 hover:text-red-900 p-1"
                      title="Edit Task"
                    >
                      <PencilIcon class="h-3.5 w-3.5" />
                    </button>
                    <button
                      @click="confirmDeleteTask(task)"
                      class="text-red-600 hover:text-red-900 p-1"
                      title="Delete Task"
                    >
                      <TrashIcon class="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
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
                      <span 
                        class="px-2 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full gap-1"
                        :class="{
                          'bg-blue-100 text-blue-800': task.priority === '0',
                          'bg-emerald-100 text-emerald-800': task.priority === '1',
                          'bg-amber-100 text-amber-800': task.priority === '2',
                          'bg-red-100 text-red-800': task.priority === '3',
                          'bg-gray-100 text-gray-800': !task.priority
                        }"
                      >
                        <Flag class="w-3 h-3" />
                        {{ task.priority ? formatPriority(task.priority) : 'Tidak ada' }}
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
            <div class="bg-blue-50 rounded-lg p-4">
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
                      <span 
                        class="px-2 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full gap-1"
                        :class="{
                          'bg-blue-100 text-blue-800': task.priority === '0',
                          'bg-emerald-100 text-emerald-800': task.priority === '1',
                          'bg-amber-100 text-amber-800': task.priority === '2',
                          'bg-red-100 text-red-800': task.priority === '3',
                          'bg-gray-100 text-gray-800': !task.priority
                        }"
                      >
                        <Flag class="w-3 h-3" />
                        {{ task.priority ? formatPriority(task.priority) : 'Tidak ada' }}
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
                      <span 
                        class="px-2 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full gap-1"
                        :class="{
                          'bg-blue-100 text-blue-800': task.priority === '0',
                          'bg-green-100 text-green-800': task.priority === '1',
                          'bg-orange-100 text-orange-800': task.priority === '2',
                          'bg-red-100 text-red-800': task.priority === '3',
                          'bg-gray-100 text-gray-800': !task.priority
                        }"
                      >
                        <Flag class="w-3 h-3" />
                        {{ task.priority ? formatPriority(task.priority) : 'No' }}
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
            <div class="bg-purple-50 rounded-lg p-4">
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
                      <span 
                        class="px-2 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full gap-1"
                        :class="{
                          'bg-blue-100 text-blue-800': task.priority === '0',
                          'bg-green-100 text-green-800': task.priority === '1',
                          'bg-orange-100 text-orange-800': task.priority === '2',
                          'bg-red-100 text-red-800': task.priority === '3',
                          'bg-gray-100 text-gray-800': !task.priority
                        }"
                      >
                        <Flag class="w-3 h-3" />
                        {{ task.priority ? formatPriority(task.priority) : 'No' }}
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
                      <span 
                        class="px-2 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full gap-1"
                        :class="{
                          'bg-blue-100 text-blue-800': task.priority === '0',
                          'bg-green-100 text-green-800': task.priority === '1',
                          'bg-orange-100 text-orange-800': task.priority === '2',
                          'bg-red-100 text-red-800': task.priority === '3',
                          'bg-gray-100 text-gray-800': !task.priority
                        }"
                      >
                        <Flag class="w-3 h-3" />
                        {{ task.priority ? formatPriority(task.priority) : 'No' }}
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
                      <span 
                        class="px-2 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full gap-1"
                        :class="{
                          'bg-blue-100 text-blue-800': task.priority === '0',
                          'bg-green-100 text-green-800': task.priority === '1',
                          'bg-orange-100 text-orange-800': task.priority === '2',
                          'bg-red-100 text-red-800': task.priority === '3',
                          'bg-gray-100 text-gray-800': !task.priority
                        }"
                      >
                        <Flag class="w-3 h-3" />
                        {{ task.priority ? formatPriority(task.priority) : 'No' }}
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
        <!-- Gantt Chart Header -->
        <ModernGanttChart
          :department-id="departmentFilter || null"
          :department-name="getDepartmentName(departmentFilter)"
          :start-date-filter="dueDateFilter.from || null"
          :end-date-filter="dueDateFilter.to || null"
          @view-task-detail="handleTaskDetailView"
          @view-project-detail="handleProjectDetailView"
          @edit-task="editTask"
          @update:dateRange="handleDateRangeUpdate"
          @clearFilter="clearSingleFilter"
          @resetFilters="clearFilters"
        />
      </div>
      <!-- Task Detail Section (when a task is selected) -->
      <TeamTaskDetailManagerPopup
        v-if="showTaskDetail"
        :show="showTaskDetail"
        :taskId="selectedTaskId"
        @update:task="handleTaskUpdate"
        @edit:task="editTask"
        @close="closeTaskDetail"
      />
    </main>

    <!-- Filter Modal -->
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
          v-if="showFilterModal" 
          class="fixed inset-0 z-50 overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <!-- Backdrop -->
          <div 
            class="fixed inset-0 bg-gray-500 bg-opacity-75 backdrop-blur-sm transition-opacity" 
            @click="showFilterModal = false"
          ></div>
          
          <!-- Modal Content -->
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
                v-if="showFilterModal"
                class="bg-white rounded-xl shadow-xl overflow-hidden w-full max-w-4xl mx-auto relative z-10"
              >
                <!-- Modal Header -->
                <div class="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center">
                      <FunnelIcon class="h-5 w-5 text-gray-500 mr-2" />
                      <h3 class="text-lg leading-6 font-medium text-gray-900">
                        Advanced Filters
                      </h3>
                    </div>
                    <button 
                      @click="showFilterModal = false" 
                      class="text-gray-400 hover:text-gray-600"
                    >
                      <XIcon class="h-5 w-5" />
                    </button>
                  </div>
                </div>
                
                <!-- Modal Body -->
                <div class="px-6 py-4 max-h-[70vh] overflow-y-auto">
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label for="department-filter" class="block text-sm font-medium text-gray-700 mb-1">
                        Department
                      </label>
                      <select
                        id="department-filter"
                        v-model="departmentFilter"
                        class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                      >
                        <option value="">All Departments</option>
                        <option v-for="department in departments" :key="department.id" :value="department.id">
                          {{ department.name }}
                        </option>
                      </select>
                    </div>
                    
                    <!-- Filter Project (tambahkan setelah department) -->
                    <div class="w-full sm:w-64">
                      <label for="task-project" class="block text-xs text-gray-500 mb-1">Project</label>
                      <div class="relative">
                        <div
                          class="w-full relative"
                          @click="showProjectDropdown = !showProjectDropdown"
                          @keydown.esc="showProjectDropdown = false"
                          @blur="setTimeout(() => showProjectDropdown = false, 100)"
                        >
                          <div class="relative rounded-md shadow-sm">
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <FolderIcon class="h-4 w-4 text-gray-400" />
                            </div>
                            <input
                              type="text"
                              id="task-project"
                              v-model="projectSearchText"
                              @input="handleProjectSearch"
                              @focus="showProjectDropdown = true"
                              class="px-3 py-2 focus:ring-red-500 focus:border-red-500 block w-full pl-10 pr-10 sm:text-sm border-gray-300 rounded-md"
                              placeholder="All projects"
                            />
                            <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
                              <ChevronDownIcon class="h-4 w-4 text-gray-400" />
                            </div>
                          </div>
                          
                          <!-- Dropdown options -->
                          <div
                            v-if="showProjectDropdown"
                            class="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base overflow-auto focus:outline-none sm:text-sm"
                          >
                            <div
                              @click="projectFilter = ''; projectSearchText = ''"
                              class="cursor-default select-none relative py-2 px-4 hover:bg-gray-100"
                              :class="projectFilter === '' ? 'text-red-600 font-medium' : 'text-gray-900'"
                            >
                              All projects
                            </div>
                            <div
                              v-for="project in filteredProjects"
                              :key="project.id"
                              @click="selectProject(project)"
                              class="cursor-default select-none relative py-2 px-4 hover:bg-gray-100"
                              :class="projectFilter === project.id ? 'text-red-600 font-medium' : 'text-gray-900'"
                            >
                              {{ project.name }}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <!-- Status Filter -->
                    <div>
                      <label for="status-filter" class="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <select
                        id="status-filter"
                        v-model="statusFilter"
                        class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
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
                    
                    <!-- Other filters including: -->
                     <!-- Task Type Filter -->
                    <div>
                      <label for="type-filter" class="block text-sm font-medium text-gray-700 mb-1">
                        Task Type
                      </label>
                      <select
                        id="type-filter"
                        v-model="typeFilter"
                        class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                      >
                        <option value="">All Types</option>
                        <option v-for="type in taskTypes" :key="type.id" :value="type.id">
                          {{ type.name }}
                        </option>
                      </select>
                    </div>
                    
                    <!-- Priority Filter -->
                    <div>
                      <label for="priority-filter" class="block text-sm font-medium text-gray-700 mb-1">
                        Priority
                      </label>
                      <select
                        id="priority-filter"
                        v-model="priorityFilter"
                        class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                      >
                        <option value="">All Priorities</option>
                        <option value="0">Low</option>
                        <option value="1">Medium</option>
                        <option value="2">High</option>
                        <option value="3">Critical</option>
                      </select>
                    </div>
                    
                    <!-- Due Date Range Filter -->
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">
                        Due Date
                      </label>
                      <div class="grid grid-cols-2 gap-2">
                        <div>
                          <input
                            type="date"
                            v-model="dueDateFilter.from"
                            class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                            placeholder="From"
                          />
                        </div>
                        <div>
                          <input
                            type="date"
                            v-model="dueDateFilter.to"
                            class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                            placeholder="To"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <!-- Progress Range Filter -->
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">
                        Progress
                      </label>
                      <div class="grid grid-cols-2 gap-2">
                        <div>
                          <input
                            type="number"
                            v-model="progressFilter.min"
                            min="0"
                            max="100"
                            class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                            placeholder="Min %"
                          />
                        </div>
                        <div>
                          <input
                            type="number"
                            v-model="progressFilter.max"
                            min="0"
                            max="100"
                            class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                            placeholder="Max %"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <!-- Special Filters -->
                    <div class="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <!-- My Tasks -->
                      <div class="flex items-center">
                        <input
                          id="my-tasks"
                          type="checkbox"
                          v-model="isMyTasksOnly"
                          class="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                        />
                        <label for="my-tasks" class="ml-2 block text-sm text-gray-700">
                          Only my tasks
                        </label>
                      </div>
                      
                      <!-- Overdue Tasks -->
                      <div class="flex items-center">
                        <input
                          id="overdue-tasks"
                          type="checkbox"
                          v-model="isOverdueOnly"
                          class="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                        />
                        <label for="overdue-tasks" class="ml-2 block text-sm text-gray-700">
                          Overdue tasks
                        </label>
                      </div>
                      
                      <!-- Has Dependencies -->
                      <div class="flex items-center">
                        <input
                          id="has-dependencies"
                          type="checkbox"
                          v-model="hasDependencies"
                          class="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                        />
                        <label for="has-dependencies" class="ml-2 block text-sm text-gray-700">
                          Has dependencies
                        </label>
                      </div>
                      
                      <!-- Is Blocked -->
                      <div class="flex items-center">
                        <input
                          id="is-blocked"
                          type="checkbox"
                          v-model="isBlocked"
                          class="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                        />
                        <label for="is-blocked" class="ml-2 block text-sm text-gray-700">
                          Is blocked
                        </label>
                      </div>
                    </div>
                    
                    <!-- Recent Activity -->
                    <div>
                      <label for="recent-days" class="block text-sm font-medium text-gray-700 mb-1">
                        Recent Activity
                      </label>
                      <select
                        id="recent-days"
                        v-model="recentDaysFilter"
                        class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                      >
                        <option value="">Any time</option>
                        <option value="1">Last 24 hours</option>
                        <option value="7">Last 7 days</option>
                        <option value="30">Last 30 days</option>
                        <option value="90">Last 3 months</option>
                      </select>
                    </div>
                    <!-- Task Type, Priority, Due Date Range, Progress Range -->
                    <!-- Special Filters (My Tasks, Overdue, Dependencies, Blocked) -->
                    <!-- Recent Activity dropdown -->
                  </div>
                </div>
                
                <!-- Modal Footer -->
                <div class="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between">
                  <button
                    @click="clearAllFilters"
                    class="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
                  >
                    Clear all filters
                  </button>
                  <div class="flex space-x-3">
                    <button
                      @click="showFilterModal = false"
                      class="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Cancel
                    </button>
                    <button
                      @click="applyFilters"
                      class="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gradient-to-r from-rose-600 to-rose-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Apply Filters
                    </button>
                  </div>
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </Transition>
    </Teleport>

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
          <!-- Backdrop with blur effect -->
          <div 
            class="fixed inset-0 bg-gray-500 bg-opacity-75 backdrop-blur-sm transition-opacity" 
            @click="closeTaskModal"
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
                class="bg-white rounded-xl shadow-xl overflow-hidden w-full max-w-5xl mx-auto relative z-10 transform transition-all"
              >
                <!-- Header with Gradient Background -->
                <div class="bg-gradient-to-r from-rose-500 to-rose-600 px-6 py-4">
                  <div class="flex items-center justify-between">
                    <div>
                      <h2 class="text-lg font-medium text-white flex items-center">
                        <CheckSquare v-if="!isEditingTask" class="w-5 h-5 mr-2" />
                        <Edit v-else class="w-5 h-5 mr-2" />
                        {{ isEditingTask ? 'Edit Task' : 'Create New Task' }}
                      </h2>
                      <p class="mt-1 text-sm text-red-100">
                        {{ isEditingTask ? 'Update task details' : 'Add a new task to this project' }}
                      </p>
                    </div>
                    <button 
                      @click="closeTaskModal" 
                      class="text-white hover:text-gray-200 focus:outline-none"
                    >
                      <X class="h-5 w-5" />
                    </button>
                  </div>
                </div>
                
                <!-- Modal Body with Custom Scrollbar -->
                <div class="p-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
                  <div class="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6">
                    <!-- Left Column -->
                    <div class="space-y-6">
                      <!-- Task Information Card -->
                      <div class="bg-gray-50 rounded-lg p-6 border border-gray-100">
                        <h3 class="text-sm font-medium text-gray-700 mb-4 flex items-center">
                          <FileText class="w-4 h-4 mr-1.5 text-red-500" />
                          Task Information
                        </h3>
                        
                        <div class="space-y-4">
                          <!-- Task Name -->
                          <div>
                            <label for="task-name" class="block text-sm font-medium text-gray-700 mb-1.5">
                              Task Name <span class="text-red-500">*</span>
                            </label>
                            <div class="relative rounded-md shadow-sm">
                              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Tag class="h-4 w-4 text-gray-400" />
                              </div>
                              <input
                                id="task-name"
                                v-model="currentTask.name"
                                type="text"
                                class="block w-full pl-10 pr-3 py-2.5 sm:text-sm border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                                placeholder="Enter a descriptive task name"
                                required
                              />
                            </div>
                          </div>

                          <!-- Project -->
                          <div>
                            <label for="task-project" class="block text-sm font-medium text-gray-700 mb-1.5">
                              Project <span class="text-red-500">*</span>
                            </label>
                            <div class="relative rounded-md shadow-sm">
                              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FolderOpen class="h-4 w-4 text-gray-400" />
                              </div>
                              <select
                                id="task-project"
                                v-model="currentTask.project_id"
                                class="block w-full pl-10 pr-10 py-2.5 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-lg"
                                required
                                :disabled="isEditingTask"
                              >
                                <option value="" disabled selected>Select a project</option>
                                <option v-for="project in projects" :key="project.id" :value="project.id">
                                  {{ project.name }}
                                </option>
                              </select>
                              <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <!-- <ChevronDown class="h-4 w-4 text-gray-400" /> -->
                              </div>
                            </div>
                          </div>
                          
                          <!-- Task Type -->
                          <div>
                            <label for="task-type" class="block text-sm font-medium text-gray-700 mb-1.5">
                              Task Type
                            </label>
                            <div class="relative rounded-md shadow-sm">
                              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <List class="h-4 w-4 text-gray-400" />
                              </div>
                              <select
                                id="task-type"
                                v-model="currentTask.type_id"
                                class="block w-full pl-10 pr-10 py-2.5 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-lg"
                              >
                                <option value="">General</option>
                                <option v-for="type in taskTypes" :key="type.id" :value="type.id">
                                  {{ type.name }}
                                </option>
                              </select>
                              <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <!-- <ChevronDown class="h-4 w-4 text-gray-400" /> -->
                              </div>
                            </div>
                          </div>

                          <!-- Priority -->
                          <!-- Priority - Ditingkatkan dengan deskripsi yang jelas -->
                          <div>
                            <label for="task-priority" class="block text-sm font-medium text-gray-700 mb-1.5">
                              Prioritas <span class="text-red-500">*</span>
                            </label>
                            <div class="relative rounded-md shadow-sm">
                              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Flag class="h-4 w-4 text-gray-400" />
                              </div>
                              <select
                                id="task-priority"
                                v-model="currentTask.priority"
                                required
                                class="block w-full pl-10 pr-10 py-2.5 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-lg"
                              >
                                <option value="3" class="text-red-700 font-medium">Kritis (P0) - Masalah mendesak yang memerlukan perhatian segera</option>
                                <option value="2" class="text-amber-700 font-medium">Tinggi (P1) - Masalah penting yang perlu segera ditangani</option>
                                <option value="1" class="text-emerald-700 font-medium">Menengah (P2) - Prioritas standar untuk pekerjaan reguler</option>
                                <option value="0" class="text-blue-700 font-medium">Rendah (P3) - Tugas yang dapat diselesaikan jika waktu memungkinkan</option>
                              </select>
                            </div>
                            <p class="mt-1 text-xs text-gray-500">
                              Pilih tingkat prioritas yang sesuai untuk tugas ini
                            </p>
                          </div>

                          <!-- Tambahkan panduan prioritas setelah pilihan prioritas -->
                          <div class="mt-2 p-2 bg-gray-50 rounded-lg border border-gray-100 text-xs">
                            <div class="font-medium mb-1 text-gray-700">Panduan Prioritas:</div>
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <div class="flex items-center">
                                <div class="h-3 w-3 bg-red-500 rounded-full mr-2"></div>
                                <span><span class="font-medium">P0 (Kritis):</span> Memerlukan perhatian segera</span>
                              </div>
                              <div class="flex items-center">
                                <div class="h-3 w-3 bg-amber-500 rounded-full mr-2"></div>
                                <span><span class="font-medium">P1 (Tinggi):</span> Penting, segera ditangani</span>
                              </div>
                              <div class="flex items-center">
                                <div class="h-3 w-3 bg-emerald-500 rounded-full mr-2"></div>
                                <span><span class="font-medium">P2 (Menengah):</span> Prioritas standar</span>
                              </div>
                              <div class="flex items-center">
                                <div class="h-3 w-3 bg-blue-500 rounded-full mr-2"></div>
                                <span><span class="font-medium">P3 (Rendah):</span> Dapat diselesaikan nanti</span>
                              </div>
                            </div>
                          </div>

                          <!-- Description -->
                          <div>
                            <label for="task-description" class="block text-sm font-medium text-gray-700 mb-1.5">
                              Description
                            </label>
                            <div v-if="isUsingRichEditor">
                              <!-- Rich Text Editor Placeholder - You can implement actual rich editor here -->
                              <div class="mt-1 relative rounded-md border border-gray-300 overflow-hidden">
                                <div class="bg-gray-50 px-3 py-2 border-b border-gray-300 flex items-center space-x-2">
                                  <button type="button" class="p-1 hover:bg-gray-200 rounded">
                                    <Bold class="h-4 w-4 text-gray-600" />
                                  </button>
                                  <button type="button" class="p-1 hover:bg-gray-200 rounded">
                                    <Italic class="h-4 w-4 text-gray-600" />
                                  </button>
                                  <button type="button" class="p-1 hover:bg-gray-200 rounded">
                                    <List class="h-4 w-4 text-gray-600" />
                                  </button>
                                  <button type="button" class="p-1 hover:bg-gray-200 rounded">
                                    <Link class="h-4 w-4 text-gray-600" />
                                  </button>
                                  <div class="flex-1"></div>
                                  <button 
                                    type="button" 
                                    class="p-1 hover:bg-gray-200 rounded text-xs text-gray-600"
                                    @click="isUsingRichEditor = false"
                                  >
                                    Plain Text
                                  </button>
                                </div>
                                <textarea
                                  id="task-description-rich"
                                  v-model="currentTask.description"
                                  rows="5"
                                  class="block w-full text-sm border-0 focus:ring-0 focus:outline-none py-2 px-3"
                                  placeholder="Provide details about this task"
                                ></textarea>
                              </div>
                              <div v-if="currentTask.description" class="mt-2">
                                <label class="block text-xs font-medium text-gray-500 mb-1">Preview:</label>
                                <div 
                                  class="prose prose-sm max-w-none border border-gray-200 rounded-md p-3 bg-white"
                                  v-html="currentTask.description"
                                ></div>
                              </div>
                            </div>
                            <div v-else>
                              <!-- Plain Text Area -->
                              <div class="mt-1 relative rounded-md shadow-sm">
                                <textarea
                                  id="task-description"
                                  v-model="currentTask.description"
                                  rows="5"
                                  class="block w-full text-sm border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:ring-red-500 focus:border-red-500"
                                  placeholder="Provide details about this task"
                                ></textarea>
                              </div>
                              <div class="mt-1 flex justify-end">
                                <button 
                                  type="button" 
                                  class="text-xs text-red-600 hover:text-red-800"
                                  @click="isUsingRichEditor = true"
                                >
                                  Use Rich Editor
                                </button>
                              </div>
                              <div v-if="currentTask.description?.includes('<')" class="mt-2">
                                <label class="block text-xs font-medium text-gray-500 mb-1">Preview:</label>
                                <div 
                                  class="prose prose-sm max-w-none border border-gray-200 rounded-md p-3 bg-white"
                                  v-html="currentTask.description"
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <!-- Schedule Card -->
                      <!-- Schedule Card - Tampilan yang Diperbarui -->
                      <div class="bg-gray-50 rounded-lg p-6 border border-gray-100">
                        <h3 class="text-sm font-medium text-gray-700 mb-4 flex items-center">
                          <Calendar class="w-4 h-4 mr-1.5 text-red-500" />
                          Schedule & Timing
                        </h3>
                        
                        <div class="space-y-4">
                          <!-- Planned Start - Dalam 1 baris -->
                          <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1.5">Planned Start</label>
                            <div class="flex gap-2">
                              <div class="flex-grow relative">
                                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                  <CalendarDays class="h-4 w-4 text-gray-400" />
                                </div>
                                <input
                                  v-model="currentTask.planned_date_start"
                                  type="date"
                                  class="block w-full pl-10 pr-3 py-2 text-sm border-gray-300 rounded-lg shadow-sm focus:border-red-500 focus:ring-red-500"
                                  @change="calculatePlannedHours"
                                />
                              </div>
                              <div class="w-1/3">
                                <input
                                  v-model="currentTask.planned_time_start"
                                  type="time"
                                  class="block w-full py-2 text-sm border-gray-300 rounded-lg shadow-sm focus:border-red-500 focus:ring-red-500"
                                  @change="calculatePlannedHours"
                                />
                              </div>
                            </div>
                          </div>
                          
                          <!-- Planned End - Dalam 1 baris -->
                          <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1.5">Planned End</label>
                            <div class="flex gap-2">
                              <div class="flex-grow relative">
                                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                  <CalendarDays class="h-4 w-4 text-gray-400" />
                                </div>
                                <input
                                  v-model="currentTask.planned_date_end"
                                  type="date"
                                  class="block w-full pl-10 pr-3 py-2 text-sm border-gray-300 rounded-lg shadow-sm focus:border-red-500 focus:ring-red-500"
                                  @change="calculatePlannedHours"
                                />
                              </div>
                              <div class="w-1/3">
                                <input
                                  v-model="currentTask.planned_time_end"
                                  type="time"
                                  class="block w-full py-2 text-sm border-gray-300 rounded-lg shadow-sm focus:border-red-500 focus:ring-red-500"
                                  @change="calculatePlannedHours"
                                />
                              </div>
                            </div>
                          </div>
                          
                          <!-- Planned Hours - Dihitung otomatis -->
                          <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1.5">Planned Hours</label>
                            <div class="flex gap-2 items-center">
                              <div class="flex-grow relative rounded-md shadow-sm">
                                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                  <Clock class="h-4 w-4 text-gray-400" />
                                </div>
                                <input
                                  v-model.number="currentTask.planned_hours"
                                  type="number"
                                  min="0"
                                  step="0.1"
                                  class="block w-full pl-10 pr-10 py-2 text-sm border-gray-300 rounded-lg shadow-sm focus:border-red-500 focus:ring-red-500"
                                  placeholder="0.0"
                                />
                                <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                  <span class="text-gray-500 sm:text-sm">hrs</span>
                                </div>
                              </div>
                              <button 
                                type="button" 
                                @click="calculatePlannedHours" 
                                class="px-3 py-2 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                                title="Hitung jam dari waktu mulai dan selesai"
                              >
                                <Calculator class="w-4 h-4" />
                              </button>
                            </div>
                            <p class="mt-1 text-xs text-gray-500">Jam yang direncanakan berdasarkan waktu mulai dan selesai</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <!-- Right Column -->
                    <div class="space-y-6">
                      <!-- Team Assignment Card -->
                      <div class="bg-gray-50 rounded-lg p-6 border border-gray-100">
                        <h3 class="text-sm font-medium text-gray-700 mb-4 flex items-center">
                          <Users class="w-4 h-4 mr-1.5 text-red-500" />
                          Team Assignment
                        </h3>
                        
                        <!-- Team Members -->
                        <div>
                          <label class="block text-sm font-medium text-gray-700 mb-1.5">
                            Assigned Team Members <span class="text-red-500">*</span>
                          </label>
                          
                          <div v-if="currentTask.project_id" class="border border-gray-300 rounded-lg overflow-hidden bg-white">
                            <div v-if="getProjectTeamMembers(currentTask.project_id).length > 0" class="max-h-48 overflow-y-auto custom-scrollbar">
                              <div v-for="member in getProjectTeamMembers(currentTask.project_id)" :key="member.id"
                                class="flex items-center py-2.5 px-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0">
                                <div class="flex-shrink-0 mr-3">
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
                            <div v-else class="p-4 text-center">
                              <UserX class="h-8 w-8 text-gray-300 mx-auto mb-2" />
                              <p class="text-sm text-gray-500">No team members available</p>
                            </div>
                          </div>
                          <div v-else class="mt-1 bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-center">
                            <AlertCircle class="h-5 w-5 text-orange-400 mr-2 flex-shrink-0" />
                            <p class="text-sm text-orange-700">Please select a project first</p>
                          </div>
                        </div>
                        
                        <!-- Reviewer -->
                        <div class="mt-4">
                          <label for="task-reviewer" class="block text-sm font-medium text-gray-700 mb-1.5">
                            Reviewer
                          </label>
                          <div class="relative rounded-md shadow-sm">
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <User class="h-4 w-4 text-gray-400" />
                            </div>
                            <select
                              id="task-reviewer"
                              v-model="currentTask.reviewer_id"
                              class="block w-full pl-10 pr-10 py-2.5 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-lg"
                            >
                              <option value="">Select reviewer</option>
                              <option v-for="member in getProjectTeamMembers(currentTask.project_id)" :key="member.id" :value="member.id">
                                {{ member.name }}
                              </option>
                            </select>
                            <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                              <!-- <ChevronDown class="h-4 w-4 text-gray-400" /> -->
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <!-- Status Card -->
                      <div class="bg-gray-50 rounded-lg p-6 border border-gray-100">
                        <h3 class="text-sm font-medium text-gray-700 mb-4 flex items-center">
                          <Activity class="w-4 h-4 mr-1.5 text-red-500" />
                          Progress & Status
                        </h3>
                        
                        <div class="space-y-4">
                          <!-- Status -->
                          <div>
                            <label for="task-status" class="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
                            <div class="relative rounded-md shadow-sm">
                              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <CheckCircle class="h-4 w-4 text-gray-400" />
                              </div>
                              <select
                                id="task-status"
                                v-model="currentTask.state"
                                class="block w-full pl-10 pr-10 py-2.5 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-lg"
                              >
                                <option value="draft">Draft</option>
                                <option value="planned">Planned</option>
                                <option value="in_progress">In Progress</option>
                                <option value="review">In Review</option>
                                <option value="done">Completed</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                              <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <!-- <ChevronDown class="h-4 w-4 text-gray-400" /> -->
                              </div>
                            </div>
                          </div>
                          
                          <!-- Progress -->
                          <div>
                            <div class="flex justify-between items-center mb-1.5">
                              <label for="task-progress" class="block text-sm font-medium text-gray-700">Progress</label>
                              <span class="text-sm font-medium text-red-600">{{ currentTask.progress || 0 }}%</span>
                            </div>
                            <div class="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                              <div 
                                class="h-2.5 rounded-full transition-all duration-300"
                                :class="{
                                  'bg-red-500': (currentTask.progress || 0) < 30,
                                  'bg-orange-500': (currentTask.progress || 0) >= 30 && (currentTask.progress || 0) < 70,
                                  'bg-green-500': (currentTask.progress || 0) >= 70
                                }"
                                :style="{ width: `${currentTask.progress || 0}%` }"
                              ></div>
                            </div>
                            <input
                              id="task-progress"
                              v-model="currentTask.progress"
                              type="range"
                              min="0"
                              max="100"
                              step="5"
                              class="w-full h-2 bg-transparent rounded-lg appearance-none cursor-pointer accent-red-600"
                            />
                            <div class="flex justify-between text-xs text-gray-500 mt-1">
                              <span>0%</span>
                              <span>50%</span>
                              <span>100%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <!-- Dependencies Card (New) -->
                      <div class="bg-gray-50 rounded-lg p-6 border border-gray-100">
                        <h3 class="text-sm font-medium text-gray-700 mb-4 flex items-center">
                          <GitBranch class="w-4 h-4 mr-1.5 text-red-500" />
                          Dependencies & Relationships
                        </h3>
                        
                        <div v-if="currentTask.project_id" class="space-y-4">
                          <!-- Depends On -->
                          <div>
                            <label for="task-depends-on" class="block text-sm font-medium text-gray-700 mb-1.5">
                              This task depends on
                            </label>
                            <div class="relative rounded-md shadow-sm">
                              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <ArrowUp class="h-4 w-4 text-gray-400" />
                              </div>
                              <select
                                id="task-depends-on"
                                v-model="currentTask.depends_on_ids"
                                multiple
                                class="block w-full pl-10 pr-10 py-2 text-sm border-gray-300 rounded-lg shadow-sm focus:border-red-500 focus:ring-red-500"
                                size="3"
                              >
                                <option v-for="task in getProjectTasks(currentTask.project_id).filter(t => t.id !== currentTask.id)" 
                                  :key="task.id" 
                                  :value="task.id"
                                >
                                  {{ task.name }}
                                </option>
                              </select>
                            </div>
                            <p class="mt-1 text-xs text-gray-500">Hold Ctrl/Cmd to select multiple tasks</p>
                          </div>
                          
                          <!-- Blocks -->
                          <div>
                            <label for="task-blocked-by" class="block text-sm font-medium text-gray-700 mb-1.5">
                              This task is blocked by
                            </label>
                            <div class="relative rounded-md shadow-sm">
                              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <XOctagon class="h-4 w-4 text-gray-400" />
                              </div>
                              <select
                                id="task-blocked-by"
                                v-model="currentTask.blocked_by_id"
                                class="block w-full pl-10 pr-10 py-2 text-sm border-gray-300 rounded-lg shadow-sm focus:border-red-500 focus:ring-red-500"
                              >
                                <option value="">Not blocked</option>
                                <option v-for="task in getProjectTasks(currentTask.project_id).filter(t => t.id !== currentTask.id)" 
                                  :key="task.id" 
                                  :value="task.id"
                                >
                                  {{ task.name }}
                                </option>
                              </select>
                              <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <!-- <ChevronDown class="h-4 w-4 text-gray-400" /> -->
                              </div>
                            </div>
                          </div>
                        </div>
                        <div v-else class="bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-center">
                          <AlertCircle class="h-5 w-5 text-orange-400 mr-2 flex-shrink-0" />
                          <p class="text-sm text-orange-700">Please select a project first</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Form Errors -->
                  <div v-if="formErrors.length > 0" class="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div class="flex">
                      <AlertTriangle class="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
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
                <div class="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t border-gray-100">
                  <button
                    type="button"
                    class="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    @click="closeTaskModal"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    class="px-4 py-2 rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-rose-600 to-rose-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 flex items-center"
                    @click="submitTask"
                    :disabled="isSubmitting"
                  >
                    <Loader2 v-if="isSubmitting" class="w-4 h-4 mr-2 animate-spin" />
                    <Save v-else class="w-4 h-4 mr-1.5" />
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
    <DeleteConfirmationModal
      :show="showDeleteConfirm"
      @close="showDeleteConfirm = false"
      @confirm="confirmDelete"
      title="Delete Task"
      :message="`Are you sure you want to delete the task '${taskToDelete?.name}'? This action cannot be undone.`"
      confirmButtonText="Delete"
      cancelButtonText="Cancel"
    />
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
  differenceInDays,
  addDays,
  subDays,
  isWithinInterval
} from 'date-fns';
import GanttZoomControls from '@/components/GanttZoomControl.vue';
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
  ChevronRightIcon,
  ArrowPathIcon,
  FunnelIcon,
  XMarkIcon as XIcon,
  UserIcon,
  FolderIcon,
  ChevronDownIcon
} from '@heroicons/vue/24/outline';
import TeamTaskDetailManagerPopup from '@/components/team/TeamTaskDetailManagerPopup.vue';
import ModernGanttChart from '@/components/charts/ModernGanttChart.vue';
import Toast from '@/components/Toast.vue';
import Draggable from 'vuedraggable';
import DeleteConfirmationModal from '@/components/modal/DeleteConfirmationModal.vue';

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
const assignedToFilter = ref('');

// New refs for the improved filter UI
const showFilterModal = ref(false);
const showAssigneeDropdown = ref(false);
const showProjectDropdown = ref(false);
const assigneeSearchText = ref('');
const projectSearchText = ref('');
const typeFilter = ref('');
const priorityFilter = ref('');
const dueDateFilter = ref({ from: '', to: '' });
const progressFilter = ref({ min: '', max: '' });
const isMyTasksOnly = ref(false);
const isOverdueOnly = ref(false);
const hasDependencies = ref(false);
const isBlocked = ref(false);
const recentDaysFilter = ref('');
const employees = ref([]);
const departments = ref([]);
const departmentFilter = ref('');

// Autocomplete filter for employees
const filteredEmployees = computed(() => {
  if (!assigneeSearchText.value) {
    return employees.value;
  }
  
  const searchText = assigneeSearchText.value.toLowerCase();
  return employees.value.filter(employee => 
    employee.name.toLowerCase().includes(searchText)
  );
});

// Autocomplete filter for projects
const filteredProjects = computed(() => {
  if (!projectSearchText.value) {
    return projects.value;
  }
  
  const searchText = projectSearchText.value.toLowerCase();
  return projects.value.filter(project => 
    project.name.toLowerCase().includes(searchText)
  );
});

// Active filter count badge
const activeFilterCount = computed(() => {
  let count = 0;
  
  if (searchQuery.value) count++;
  if (assignedToFilter.value) count++;
  if (projectFilter.value) count++;
  if (departmentFilter.value) count++;
  if (statusFilter.value) count++;
  if (typeFilter.value) count++;
  if (priorityFilter.value) count++;
  if (dueDateFilter.value.from || dueDateFilter.value.to) count++;
  if (progressFilter.value.min || progressFilter.value.max) count++;
  if (isMyTasksOnly.value) count++;
  if (isOverdueOnly.value) count++;
  if (hasDependencies.value) count++;
  if (isBlocked.value) count++;
  if (recentDaysFilter.value) count++;
  
  return count;
});

// Check for any active filters
const hasActiveFilters = computed(() => {
  return activeFilterCount.value > 0;
});

// Display active filters as chips/badges
const displayedFilters = computed(() => {
  const filters = [];

  if (departmentFilter.value) {
    const department = departments.value.find(d => d.id == departmentFilter.value);
    filters.push({
      key: 'department',
      label: 'Department',
      value: department ? department.name : `ID: ${departmentFilter.value}`
    });
  }
  
  
  if (searchQuery.value) {
    filters.push({
      key: 'search',
      label: 'Search',
      value: searchQuery.value
    });
  }
  
  if (assignedToFilter.value) {
    const employee = employees.value.find(e => e.id == assignedToFilter.value);
    filters.push({
      key: 'assignedTo',
      label: 'Assignee',
      value: employee ? employee.name : `ID: ${assignedToFilter.value}`
    });
  }
  
  if (projectFilter.value) {
    const project = projects.value.find(p => p.id == projectFilter.value);
    filters.push({
      key: 'project',
      label: 'Project',
      value: project ? project.name : `ID: ${projectFilter.value}`
    });
  }
  
  if (statusFilter.value) {
    const statusMap = {
      'draft': 'Draft',
      'planned': 'Planned',
      'in_progress': 'In Progress',
      'review': 'In Review',
      'done': 'Completed',
      'cancelled': 'Cancelled'
    };
    
    filters.push({
      key: 'status',
      label: 'Status',
      value: statusMap[statusFilter.value] || statusFilter.value
    });
  }
  
  if (typeFilter.value) {
    const type = taskTypes.value.find(t => t.id == typeFilter.value);
    filters.push({
      key: 'type',
      label: 'Type',
      value: type ? type.name : `ID: ${typeFilter.value}`
    });
  }
  
  if (priorityFilter.value) {
    const priorityMap = {
      '0': 'Low',
      '1': 'Medium',
      '2': 'High',
      '3': 'Critical'
    };
    
    filters.push({
      key: 'priority',
      label: 'Priority',
      value: priorityMap[priorityFilter.value] || priorityFilter.value
    });
  }
  
  if (dueDateFilter.value.from && dueDateFilter.value.to) {
    filters.push({
      key: 'dueDate',
      label: 'Due Date',
      value: `${format(parseISO(dueDateFilter.value.from), 'MMM d')} - ${format(parseISO(dueDateFilter.value.to), 'MMM d, yyyy')}`
    });
  } else if (dueDateFilter.value.from) {
    filters.push({
      key: 'dueDate',
      label: 'Due From',
      value: format(parseISO(dueDateFilter.value.from), 'MMM d, yyyy')
    });
  } else if (dueDateFilter.value.to) {
    filters.push({
      key: 'dueDate',
      label: 'Due Before',
      value: format(parseISO(dueDateFilter.value.to), 'MMM d, yyyy')
    });
  }
  
  if (progressFilter.value.min && progressFilter.value.max) {
    filters.push({
      key: 'progress',
      label: 'Progress',
      value: `${progressFilter.value.min}% - ${progressFilter.value.max}%`
    });
  } else if (progressFilter.value.min) {
    filters.push({
      key: 'progress',
      label: 'Progress',
      value: `>= ${progressFilter.value.min}%`
    });
  } else if (progressFilter.value.max) {
    filters.push({
      key: 'progress',
      label: 'Progress',
      value: `<= ${progressFilter.value.max}%`
    });
  }
  
  if (isMyTasksOnly.value) {
    filters.push({
      key: 'myTasks',
      label: 'Assigned',
      value: 'My Tasks Only'
    });
  }
  
  if (isOverdueOnly.value) {
    filters.push({
      key: 'overdue',
      label: 'Status',
      value: 'Overdue Only'
    });
  }
  
  if (hasDependencies.value) {
    filters.push({
      key: 'dependencies',
      label: 'Dependencies',
      value: 'Has Dependencies'
    });
  }
  
  if (isBlocked.value) {
    filters.push({
      key: 'blocked',
      label: 'Status',
      value: 'Blocked Tasks'
    });
  }
  
  if (recentDaysFilter.value) {
    const dayMap = {
      '1': 'Last 24 hours',
      '7': 'Last 7 days',
      '30': 'Last 30 days',
      '90': 'Last 3 months'
    };
    
    filters.push({
      key: 'recent',
      label: 'Recent',
      value: dayMap[recentDaysFilter.value] || `${recentDaysFilter.value} days`
    });
  }
  
  return filters;
});

// Pastikan format penanganan dropdown consistent
const selectAssignee = (employee) => {
  // Pastikan nilai ini disimpan sebagai integer atau string yang konsisten
  assignedToFilter.value = parseInt(employee.id); // atau String(employee.id)
  assigneeSearchText.value = employee.name;
  showAssigneeDropdown.value = false;
};

const handleProjectSearch = () => {
  // Keep dropdown open while typing
  showProjectDropdown.value = true;
};

const selectProject = (project) => {
  projectFilter.value = project.id;
  projectSearchText.value = project.name;
  showProjectDropdown.value = false;
};

// Apply filters from the modal
const applyFilters = () => {
  showFilterModal.value = false;
  fetchTasks();
};

// Remove a single filter
const removeFilter = (key) => {
  switch (key) {
    case 'search':
      searchQuery.value = '';
      break;
    case 'assignedTo':
      assignedToFilter.value = '';
      assigneeSearchText.value = '';
      break;
    case 'project':
      projectFilter.value = '';
      projectSearchText.value = '';
      break;
    case 'department':
      departmentFilter.value = '';
    case 'status':
      statusFilter.value = '';
      break;
    case 'type':
      typeFilter.value = '';
      break;
    case 'priority':
      priorityFilter.value = '';
      break;
    case 'dueDate':
      dueDateFilter.value = { from: '', to: '' };
      break;
    case 'progress':
      progressFilter.value = { min: '', max: '' };
      break;
    case 'myTasks':
      isMyTasksOnly.value = false;
      break;
    case 'overdue':
      isOverdueOnly.value = false;
      break;
    case 'dependencies':
      hasDependencies.value = false;
      break;
    case 'blocked':
      isBlocked.value = false;
      break;
    case 'recent':
      recentDaysFilter.value = '';
      break;
  }
  
  // Re-fetch tasks with updated filters
  fetchTasks();
};

// Clear all filters
const clearAllFilters = () => {
  searchQuery.value = '';
  assignedToFilter.value = '';
  assigneeSearchText.value = '';
  projectFilter.value = '';
  projectSearchText.value = '';
  statusFilter.value = '';
  typeFilter.value = '';
  priorityFilter.value = '';
  dueDateFilter.value = { from: '', to: '' };
  progressFilter.value = { min: '', max: '' };
  isMyTasksOnly.value = false;
  isOverdueOnly.value = false;
  hasDependencies.value = false;
  isBlocked.value = false;
  recentDaysFilter.value = '';
  departmentFilter.value = '';
  
  showFilterModal.value = false;
  fetchTasks();
};

const showTaskDetail = ref(false);

const selectTask = (task) => {
  selectedTaskId.value = task.id;
  showTaskDetail.value = true; // Tampilkan modal ketika task dipilih
};

const closeTaskDetail = () => {
  showTaskDetail.value = false;
  // Opsional: Bisa pilih apakah selectedTaskId tetap disimpan atau direset
  // selectedTaskId.value = null; // Reset task yang terpilih
};

const handleTaskUpdate = (updatedTask) => {
  // Update task in the local list
  const index = tasks.value.findIndex(t => t.id === updatedTask.id);
  if (index !== -1) {
    tasks.value[index] = { ...tasks.value[index], ...updatedTask };
  }
};


// View mode selection
const viewMode = ref('table'); // 'table', 'kanban', 'calendar', 'gantt'

// Calendar view state
const currentDate = ref(new Date());
const calendarView = ref('month'); // 'month', 'week'
const dateRange = ref({
  start: format(subDays(new Date(), 7), 'yyyy-MM-dd'),
  end: format(addDays(new Date(), 14), 'yyyy-MM-dd')
});

// Gantt view state
const ganttView = ref('month'); // 'week', 'month'
const ganttStartDate = ref(new Date());
// State untuk menampilkan custom gantt
const isRangeTruncated = ref(false);
const maxGanttDays = 120;
// State untuk zoom level Gantt chart

// const currentTask = ref({
//   name: '',
//   project_id: '',
//   assigned_to: [],
//   planned_date_start: '',
//   planned_date_end: '',
//   planned_hours: '',
//   description: '',
//   state: 'draft',
//   progress: 0
// });

// Update the currentTask ref to include the new fields
const currentTask = ref({
  name: '',
  project_id: '',
  assigned_to: [],
  planned_date_start: '',
  planned_date_end: '',
  planned_time_start: '',  // New field
  planned_time_end: '',    // New field
  planned_hours: '',
  description: '',
  state: 'draft',
  progress: 0,
  priority: '1',           // New field
  type_id: '',             // New field
  reviewer_id: '',         // New field
  depends_on_ids: [],      // New field
  blocked_by_id: ''        // New field
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

// const getTodayPosition = computed(() => {
//   if (ganttDays.value.length === 0) return 0;
  
//   const today = new Date();
//   const startDate = ganttDays.value[0].date;
  
//   // Calculate days between start date and today
//   const daysDiff = differenceInDays(today, startDate);
  
//   // Convert to rem position (3rem per day)
//   return Math.max(0, daysDiff * 3);
// });

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

// function getGanttTaskPosition(task) {
//   if (!task.dates?.planned_start || !task.dates?.planned_end || !ganttDays.value.length) {
//     return null;
//   }
  
//   const startDate = parseISO(task.dates.planned_start);
//   const endDate = parseISO(task.dates.planned_end);
//   const firstDate = ganttDays.value[0].date;
//   const lastDate = ganttDays.value[ganttDays.value.length - 1].date;
  
//   // Task is completely outside the visible range
//   if (endDate < firstDate || startDate > lastDate) {
//     return null;
//   }
  
//   // Calculate start position
//   const startPos = Math.max(0, differenceInDays(startDate, firstDate));
  
//   // Calculate width (duration in days)
//   const endPos = Math.min(
//     ganttDays.value.length - 1, 
//     differenceInDays(endDate, firstDate)
//   );
  
//   const width = Math.max(1, endPos - startPos + 1);
  
//   return {
//     left: startPos * ganttZoomLevel.value, // Gunakan zoom level
//     width: width * ganttZoomLevel.value
//   };
// }

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

// 1. Pastikan fetchEmployees berfungsi dengan benar
const fetchEmployees = async () => {
  try {
    const response = await apiClient.post('/web/session/get_employees', {
      jsonrpc: '2.0',
      method: 'call'
    });
    
    if (response.data.result?.status === 'success') {
      employees.value = response.data.result.data || [];
      console.log("Employees loaded:", employees.value.length);
    } else {
      console.error("Error in employees response:", response.data);
      showToast({
        message: 'Failed to load employee data',
        type: 'error'
      });
    }
  } catch (error) {
    console.error('Error fetching employees:', error);
    showToast({
      message: 'Failed to load employee data',
      type: 'error'
    });
  }
};

// 2. Pastikan dropdown implementation benar dengan menambahkan console.log
const handleAssigneeSearch = () => {
  console.log("Searching assignees with text:", assigneeSearchText.value);
  console.log("Available employees:", employees.value);
  console.log("Filtered employees:", filteredEmployees.value);
  
  // Keep dropdown open while typing
  showAssigneeDropdown.value = true;
};


// API methods
// Update the fetchTasks function to include all filters
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
    
    // Add all filters to the payload
    if (props.projectId) {
      payload.params.project_id = parseInt(props.projectId);
    } else if (projectFilter.value) {
      payload.params.project_id = parseInt(projectFilter.value);
    }
    
    // Update di fungsi fetchTasks()
    if (assignedToFilter.value) {
      // Pastikan nilai dikonversi ke array seperti yang diharapkan backend
      payload.params.assigned_to = [parseInt(assignedToFilter.value)];
    }

    if (departmentFilter.value) {
      payload.params.department_id = parseInt(departmentFilter.value);
    }
    
    if (searchQuery.value) {
      payload.params.search = searchQuery.value;
    }
    
    if (statusFilter.value) {
      payload.params.state = statusFilter.value;
    }
    
    if (typeFilter.value) {
      payload.params.type_id = parseInt(typeFilter.value);
    }
    
    if (priorityFilter.value) {
      payload.params.priority = priorityFilter.value;
    }
    
    if (dueDateFilter.value.from) {
      payload.params.due_date_from = dueDateFilter.value.from;
    }
    
    if (dueDateFilter.value.to) {
      payload.params.due_date_to = dueDateFilter.value.to;
    }
    
    if (progressFilter.value.min) {
      payload.params.progress_min = progressFilter.value.min;
    }
    
    if (progressFilter.value.max) {
      payload.params.progress_max = progressFilter.value.max;
    }
    
    if (isMyTasksOnly.value) {
      payload.params.my_tasks = 'true';
    }
    
    if (isOverdueOnly.value) {
      payload.params.is_overdue = 'true';
    }
    
    if (hasDependencies.value) {
      payload.params.has_dependencies = 'true';
    }
    
    if (isBlocked.value) {
      payload.params.is_blocked = 'true';
    }
    
    if (recentDaysFilter.value) {
      payload.params.recent_days = recentDaysFilter.value;
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

const getProjectDepartmentId = (projectId) => {
  if (!projectId) return null;
  
  const selectedProject = projects.value.find(p => p.id === parseInt(projectId));
  return selectedProject?.department?.id || null;
};

const fetchDepartments = async () => {
  try {
    const response = await apiClient.post('/web/v2/team/tasks/departments', {
      jsonrpc: '2.0',
      method: 'call'
    });
    
    if (response.data.result?.status === 'success') {
      departments.value = response.data.result.data || [];
    } else {
      console.error("Error in departments response:", response.data);
    }
  } catch (error) {
    console.error('Error fetching departments:', error);
  }
};

const fetchProjects = async () => {
  try {
    const response = await apiClient.post('/web/v2/team/projects/list', {
      jsonrpc: '2.0',
      method: 'call',
      id: new Date().getTime(),
      params: {
        // Tambahkan parameter pagination
        page: 1,
        limit: 100
      }
    });
    
    if (response.data.result?.status === 'success') {
      projects.value = response.data.result.data || [];
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

// Helper functions for UI
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

// const formatDate = (dateString) => {
//   if (!dateString) return '';
//   try {
//     return format(parseISO(dateString), 'MMM d, yyyy');
//   } catch (e) {
//     return dateString;
//   }
// };


const clearFilters = () => {
  searchQuery.value = '';
  statusFilter.value = '';
  projectFilter.value = '';
};

// const resetTaskForm = () => {
//   formErrors.value = [];
//   currentTask.value = {
//     name: '',
//     project_id: props.projectId || (projects.value.length > 0 ? projects.value[0].id : ''),
//     assigned_to: [],
//     planned_date_start: '',
//     planned_date_end: '',
//     planned_hours: '',
//     description: '',
//     state: 'draft',
//     progress: 0
//   };
// };

// const editTask = (task) => {
//   isEditingTask.value = true;
//   formErrors.value = [];
  
//   // Format assigned_to as expected by the form
//   const assignedToIds = task.assigned_to.map(person => person.id);
  
//   currentTask.value = {
//     id: task.id,
//     name: task.name,
//     project_id: task.project?.id || '',
//     assigned_to: assignedToIds,
//     planned_date_start: task.dates?.planned_start ? task.dates.planned_start.split('T')[0] : '',
//     planned_date_end: task.dates?.planned_end ? task.dates.planned_end.split('T')[0] : '',
//     planned_hours: task.hours?.planned || '',
//     description: task.description || '',
//     state: task.state || 'draft',
//     progress: task.progress || 0
//   };
  
//   showTaskModal.value = true;
// };

// const validateForm = () => {
//   formErrors.value = [];
  
//   if (!currentTask.value.name.trim()) {
//     formErrors.value.push('Task name is required');
//   }
  
//   if (!currentTask.value.project_id) {
//     formErrors.value.push('Project is required');
//   }
  
//   if (!currentTask.value.assigned_to || currentTask.value.assigned_to.length === 0) {
//     formErrors.value.push('At least one assignee is required');
//   }
  
//   // Validate dates if both are provided
//   if (currentTask.value.planned_date_start && currentTask.value.planned_date_end) {
//     const startDate = new Date(currentTask.value.planned_date_start);
//     const endDate = new Date(currentTask.value.planned_date_end);
    
//     if (endDate < startDate) {
//       formErrors.value.push('End date cannot be earlier than start date');
//     }
//   }
  
//   return formErrors.value.length === 0;
// };

// const submitTask = async () => {
//   // Validate form
//   if (!validateForm()) {
//     return;
//   }

//   try {
//     loading.value = true;
//     const payload = {
//       jsonrpc: '2.0',
//       method: 'call',
//       params: {
//         operation: isEditingTask.value ? 'update' : 'create',
//         name: currentTask.value.name.trim(),
//         project_id: parseInt(currentTask.value.project_id),
//         assigned_to: currentTask.value.assigned_to,
//         description: currentTask.value.description?.trim() || '',
//         state: currentTask.value.state,
//         progress: currentTask.value.progress || 0
//       }
//     };

//     // Add optional fields if they have values
//     if (currentTask.value.planned_date_start) {
//       payload.params.planned_date_start = currentTask.value.planned_date_start;
//     }
//     if (currentTask.value.planned_date_end) {
//       payload.params.planned_date_end = currentTask.value.planned_date_end;
//     }
//     if (currentTask.value.planned_hours) {
//       payload.params.planned_hours = parseFloat(currentTask.value.planned_hours);
//     }

//     if (isEditingTask.value) {
//       payload.params.task_id = currentTask.value.id;
//     }

//     const response = await apiClient.post('/web/v2/team/tasks', payload);
    
//     if (response.data.result?.status === 'success') {
//       showToast({
//         message: `Task ${isEditingTask.value ? 'updated' : 'created'} successfully`,
//         type: 'success'
//       });

//       resetTaskForm();
//       showTaskModal.value = false;
//       fetchTasks(); // Refresh the list
      
//       // If this was a new task, select it for viewing
//       if (!isEditingTask.value && response.data.result.data?.id) {
//         selectedTaskId.value = response.data.result.data.id;
//       }
//     } else {
//       showToast({
//         message: 'Failed to save task. Please try again.',
//         type: 'error'
//       });
//     }
//   } catch (error) {
//     console.error('Error submitting task:', error);
//     showToast({
//       message: 'Failed to save task. Please try again.',
//       type: 'error'
//     });
//   } finally {
//     loading.value = false;
//   }
// };

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
        message: 'Task deleted successfully',
        type: 'success'
      });
      
      // If the deleted task was selected, clear the selection
      if (selectedTaskId.value === taskToDelete.value.id) {
        selectedTaskId.value = null;
      }
      
      fetchTasks(); // Refresh the list
    } else {
      showToast({
        message: `Error: ${response.data.result?.message || 'Failed to delete task'}`,
        type: 'error'
      });
    }
  } catch (error) {
    console.error('Error deleting task:', error);
    showToast({
      message: 'Failed to delete task. Please try again.',
      type: 'error'
    });
  } finally {
    showDeleteConfirm.value = false;
    taskToDelete.value = null;
    loading.value = false;
  }
};

// Kanban drag-and-drop functionality
const handleDragEnd = async (event) => {
  try {
    // Get the task and the new state
    const task = event.item.__draggable_context?.element;
    if (!task) return;
    
    const newState = event.to.getAttribute('data-state');
    if (!newState || task.state === newState) return;
    
    // Update the task status
    loading.value = true;
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
    });
    
    if (response.data.result?.status === 'success') {
      showToast({
        message: 'Task status updated successfully',
        type: 'success'
      });
      fetchTasks(); // Refresh tasks
    } else {
      showToast({
        message: 'Failed to update task status',
        type: 'error'
      });
      fetchTasks(); // Refresh to original state
    }
  } catch (error) {
    console.error('Error updating task status:', error);
    showToast({
      message: 'Failed to update task status',
      type: 'error'
    });
    fetchTasks(); // Refresh to original state
  } finally {
    loading.value = false;
  }
};

const formatPriority = (priority) => {
  const priorityMap = {
    '0': 'Low (P3)',
    '1': 'Medium (P2)',
    '2': 'High (P1)',
    '3': 'Critical (P0)'
  };
  return priorityMap[priority] || 'Menengah';
};

// Pastikan priorityColorMap juga diperbarui (jika ada)
const priorityColorMap = {
  '0': {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-100',
    icon: 'text-blue-500'
  },
  '1': {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-100',
    icon: 'text-emerald-500'
  },
  '2': {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-100',
    icon: 'text-amber-500'
  },
  '3': {
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-100',
    icon: 'text-red-500'
  }
};

// Fungsi untuk menghitung planned hours berdasarkan tanggal dan waktu mulai/selesai
const calculatePlannedHours = () => {
  // Pastikan kedua tanggal dan waktu telah diisi
  if (!currentTask.value.planned_date_start || !currentTask.value.planned_time_start || 
      !currentTask.value.planned_date_end || !currentTask.value.planned_time_end) {
    return;
  }
  
  // Buat objek Date dari tanggal dan waktu mulai
  const startDateTime = new Date(
    `${currentTask.value.planned_date_start}T${currentTask.value.planned_time_start}:00`
  );
  
  // Buat objek Date dari tanggal dan waktu selesai
  const endDateTime = new Date(
    `${currentTask.value.planned_date_end}T${currentTask.value.planned_time_end}:00`
  );
  
  // Pastikan tanggal dan waktu valid
  if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
    console.error('Tanggal atau waktu tidak valid');
    return;
  }
  
  // Hitung selisih waktu dalam jam
  const diffMs = endDateTime - startDateTime;
  
  // Jika waktu akhir sebelum waktu mulai, tampilkan pesan kesalahan
  if (diffMs < 0) {
    showToast({
      message: 'Waktu selesai harus setelah waktu mulai',
      type: 'error'
    });
    return;
  }
  
  // Konversi milidetik ke jam (dengan 1 desimal)
  const diffHours = Math.round((diffMs / (1000 * 60 * 60)) * 10) / 10;
  
  // Setel planned_hours
  currentTask.value.planned_hours = diffHours;
};

// Tambahkan watchers untuk otomatis menghitung planned hours saat tanggal/waktu berubah
// Tambahkan setelah watch yang ada dalam file (sekitar baris 1800-1900)

// Watch untuk perubahan tanggal dan waktu mulai/selesai
watch(
  [
    () => currentTask.value.planned_date_start,
    () => currentTask.value.planned_time_start,
    () => currentTask.value.planned_date_end,
    () => currentTask.value.planned_time_end
  ],
  () => {
    calculatePlannedHours();
  }
);

// Lifecycle hooks
onMounted(async () => {
  await Promise.all([
    fetchTasks(),
    fetchProjects(),
    // fetchEmployees(),
    fetchDepartments() // Tambahkan ini
  ]);
  
  // Set default date range (from 7 days ago to 14 days ahead)
  const today = new Date();
  dateRange.value = {
    start: format(subDays(today, 7), 'yyyy-MM-dd'),
    end: format(addDays(today, 14), 'yyyy-MM-dd')
  };
  
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

// Tambahkan watch untuk assignedToFilter
watch(assignedToFilter, () => {
  fetchTasks();
});

// Watch for project changes to update available team members
watch(() => currentTask.value.project_id, (newProjectId) => {
  if (newProjectId) {
    // When project changes, reset assignees or keep them depending on business rules
    console.log('Project changed, department ID:', getProjectDepartmentId(newProjectId));
  }
});

// 1. Tambahkan computed property untuk memfilter tasks berdasarkan dateRange
// const filteredTasksByDateRange = computed(() => {
//   // Jika tidak ada filter tanggal, kembalikan semua task yang sudah difilter sebelumnya
//   if (!dateRange.value.start && !dateRange.value.end) {
//     return filteredTasks.value;
//   }
  
//   return filteredTasks.value.filter(task => {
//     // Jika task tidak memiliki tanggal, tidak perlu difilter
//     if (!task.dates?.planned_start && !task.dates?.planned_end) {
//       return false;
//     }
    
//     const taskStartDate = task.dates?.planned_start ? parseISO(task.dates.planned_start) : null;
//     const taskEndDate = task.dates?.planned_end ? parseISO(task.dates.planned_end) : null;
    
//     // Jika hanya ada tanggal mulai, gunakan sebagai satu-satunya check point
//     if (taskStartDate && !taskEndDate) {
//       // Filter berdasarkan start date saja
//       const filterStartDate = dateRange.value.start ? parseISO(dateRange.value.start) : null;
//       const filterEndDate = dateRange.value.end ? parseISO(dateRange.value.end) : null;
      
//       if (filterStartDate && filterEndDate) {
//         return taskStartDate >= filterStartDate && taskStartDate <= filterEndDate;
//       } else if (filterStartDate) {
//         return taskStartDate >= filterStartDate;
//       } else if (filterEndDate) {
//         return taskStartDate <= filterEndDate;
//       }
//       return true;
//     }
    
//     // Jika hanya ada tanggal selesai, gunakan sebagai satu-satunya check point
//     if (!taskStartDate && taskEndDate) {
//       // Filter berdasarkan end date saja
//       const filterStartDate = dateRange.value.start ? parseISO(dateRange.value.start) : null;
//       const filterEndDate = dateRange.value.end ? parseISO(dateRange.value.end) : null;
      
//       if (filterStartDate && filterEndDate) {
//         return taskEndDate >= filterStartDate && taskEndDate <= filterEndDate;
//       } else if (filterStartDate) {
//         return taskEndDate >= filterStartDate;
//       } else if (filterEndDate) {
//         return taskEndDate <= filterEndDate;
//       }
//       return true;
//     }
    
//     // Jika task memiliki tanggal mulai dan selesai, periksa apakah overlap dengan range filter
//     if (taskStartDate && taskEndDate) {
//       const filterStartDate = dateRange.value.start ? parseISO(dateRange.value.start) : null;
//       const filterEndDate = dateRange.value.end ? parseISO(dateRange.value.end) : null;
      
//       if (filterStartDate && filterEndDate) {
//         // Task overlap jika:
//         // 1. Task mulai sebelum filter berakhir DAN
//         // 2. Task berakhir setelah filter dimulai
//         return taskStartDate <= filterEndDate && taskEndDate >= filterStartDate;
//       } else if (filterStartDate) {
//         return taskEndDate >= filterStartDate;
//       } else if (filterEndDate) {
//         return taskStartDate <= filterEndDate;
//       }
//     }
    
//     return true;
//   });
// });

// 2. Ubah computed property ganttTasks untuk menggunakan filteredTasksByDateRange
const ganttTasks = computed(() => {
  return filteredTasksByDateRange.value.filter(task => 
    task.dates?.planned_start && task.dates?.planned_end
  );
});

// 3. Tambahkan fungsi untuk mengupdate tampilan Gantt berdasarkan date range
function updateGanttViewFromDateRange() {
  if (dateRange.value.start && dateRange.value.end) {
    const startDate = parseISO(dateRange.value.start);
    const endDate = parseISO(dateRange.value.end);
    
    // Jika range lebih dari 60 hari, terlalu panjang untuk ditampilkan dalam satu view
    const daysDiff = differenceInDays(endDate, startDate);
    
    if (daysDiff > 60) {
      // Tampilkan pesan atau batasi range
      showToast({
        message: 'Range waktu terlalu panjang, menampilkan maksimal 60 hari',
        type: 'warning'
      });
      
      // Terapkan batasan 60 hari
      dateRange.value.end = format(addDays(startDate, 60), 'yyyy-MM-dd');
    }
    
    // Set ganttStartDate ke tanggal mulai dari filter
    ganttStartDate.value = startDate;
    
    // Gunakan mode tampilan yang sesuai berdasarkan range
    if (daysDiff <= 14) {
      ganttView.value = 'week';
    } else {
      ganttView.value = 'month';
    }
  }
}

// 4. Modifikasi fungsi untuk menampilkan Gantt dengan range kustom
// const ganttDaysCustomRange = computed(() => {
//   if (!dateRange.value.start || !dateRange.value.end) {
//     return ganttDays.value; // Fallback ke tampilan default
//   }
  
//   const startDate = parseISO(dateRange.value.start);
//   const endDate = parseISO(dateRange.value.end);
  
//   // Batasi jumlah hari yang ditampilkan (untuk performa)
//   const maxDays = 60;
//   const actualEndDate = differenceInDays(endDate, startDate) > maxDays 
//     ? addDays(startDate, maxDays) 
//     : endDate;
  
//   const dateRange = eachDayOfInterval({ start: startDate, end: actualEndDate });
  
//   return dateRange.map(date => ({
//     date,
//     dayLabel: format(date, 'EEE'),
//     dateLabel: format(date, 'd'),
//     monthLabel: format(date, 'MMM'),
//     isWeekend: isWeekend(date)
//   }));
// });

// 5. Tambahkan fungsi untuk menerapkan filter waktu
// function applyDateFilter() {
//   if (viewMode.value === 'gantt') {
//     updateGanttViewFromDateRange();
//   }
  
//   // Jika diperlukan, tambahkan logika untuk mengupdate tampilan Calendar juga
//   if (viewMode.value === 'calendar') {
//     if (dateRange.value.start) {
//       currentDate.value = parseISO(dateRange.value.start);
//     }
//   }
// }

// 6. Tambahkan custom view untuk Gantt yang lebih fleksibel
function setupCustomGanttView() {
  // Toggle gantt view mode antara 'week', 'month', dan 'custom'
  if (ganttView.value !== 'custom') {
    ganttView.value = 'custom';
    
    // Set default range jika belum diatur
    if (!dateRange.value.start) {
      dateRange.value.start = format(new Date(), 'yyyy-MM-dd');
    }
    if (!dateRange.value.end) {
      dateRange.value.end = format(addMonths(new Date(), 2), 'yyyy-MM-dd');
    }
    
    updateGanttViewFromDateRange();
  } else {
    // Toggle kembali ke tampilan default
    ganttView.value = 'month';
  }
}

watch(
  () => viewMode.value,
  (newMode) => {
    if (newMode === 'gantt' && dateRange.value.start && dateRange.value.end) {
      updateGanttViewFromDateRange();
    }
  }
);

// Custom Gantt View
const ganttDaysCustomRange = computed(() => {
  if (!dateRange.value.start || !dateRange.value.end) {
    return ganttDays.value; // Fallback ke default
  }
  
  try {
    const startDate = parseISO(dateRange.value.start);
    const endDate = parseISO(dateRange.value.end);
    
    // Batasi jumlah hari yang ditampilkan untuk performa
    const daysDiff = differenceInDays(endDate, startDate);
    let actualEndDate = endDate;
    
    if (daysDiff > maxGanttDays) {
      isRangeTruncated.value = true;
      actualEndDate = addDays(startDate, maxGanttDays);
    } else {
      isRangeTruncated.value = false;
    }
    
    const days = eachDayOfInterval({ start: startDate, end: actualEndDate });
    
    return days.map(date => ({
      date,
      dayLabel: format(date, 'EEE'),
      dateLabel: format(date, 'd'),
      monthLabel: format(date, 'MMM'),
      isWeekend: isWeekend(date)
    }));
  } catch (error) {
    console.error('Error generating custom gantt days:', error);
    return ganttDays.value;
  }
});

// Fungsi untuk memfilter tasks berdasarkan dateRange
const filteredTasksByDateRange = computed(() => {
  // Jika tidak ada filter tanggal, kembalikan semua task yang sudah difilter sebelumnya
  if (!dateRange.value.start || !dateRange.value.end) {
    return filteredTasks.value;
  }
  
  const filterStartDate = dateRange.value.start ? parseISO(dateRange.value.start) : null;
  const filterEndDate = dateRange.value.end ? parseISO(dateRange.value.end) : null;
  
  if (!filterStartDate || !filterEndDate) {
    return filteredTasks.value;
  }
  
  return filteredTasks.value.filter(task => {
    // Skip tasks tanpa tanggal
    if (!task.dates?.planned_start && !task.dates?.planned_end) {
      return false;
    }
    
    const taskStartDate = task.dates?.planned_start ? parseISO(task.dates.planned_start) : null;
    const taskEndDate = task.dates?.planned_end ? parseISO(task.dates.planned_end) : null;
    
    // Jika hanya ada tanggal mulai
    if (taskStartDate && !taskEndDate) {
      return isWithinInterval(taskStartDate, { start: filterStartDate, end: filterEndDate });
    }
    
    // Jika hanya ada tanggal akhir
    if (!taskStartDate && taskEndDate) {
      return isWithinInterval(taskEndDate, { start: filterStartDate, end: filterEndDate });
    }
    
    // Jika ada kedua tanggal, cek apakah rentang waktu task overlap dengan filter
    if (taskStartDate && taskEndDate) {
      // Task overlap jika:
      // 1. Tanggal mulai task <= tanggal akhir filter DAN
      // 2. Tanggal akhir task >= tanggal mulai filter
      return taskStartDate <= filterEndDate && taskEndDate >= filterStartDate;
    }
    
    // Default fallback
    return false;
  });
});



// Fungsi untuk mendapatkan posisi task dalam chart
// function getGanttTaskPosition(task, isCustomView = false) {
//   if (!task.dates?.planned_start || !task.dates?.planned_end) {
//     return null;
//   }
  
//   const startDate = parseISO(task.dates.planned_start);
//   const endDate = parseISO(task.dates.planned_end);
  
//   // Pilih array hari berdasarkan mode view
//   const daysArray = isCustomView ? ganttDaysCustomRange.value : ganttDays.value;
  
//   if (daysArray.length === 0) {
//     return null;
//   }
  
//   const firstDate = daysArray[0].date;
//   const lastDate = daysArray[daysArray.length - 1].date;
  
//   // Task berada di luar range yang ditampilkan
//   if (endDate < firstDate || startDate > lastDate) {
//     return null;
//   }
  
//   // Hitung posisi mulai (pastikan tidak negatif)
//   let startPos = Math.max(0, differenceInDays(startDate, firstDate));
//   if (startDate < firstDate) startPos = 0;
  
//   // Hitung posisi akhir (pastikan tidak melebihi jumlah hari yang ditampilkan)
//   let endPos = Math.min(
//     daysArray.length - 1, 
//     differenceInDays(endDate, firstDate)
//   );
  
//   // Pastikan width minimal 1 hari
//   const width = Math.max(1, endPos - startPos + 1);
  
//   return {
//     left: startPos * 3, // 3rem per hari
//     width: width * 3
//   };
// }

// Fungsi untuk mendapatkan posisi hari ini dalam chart
// function getTodayPosition(isCustomView = false) {
//   const daysArray = isCustomView ? ganttDaysCustomRange.value : ganttDays.value;
  
//   if (daysArray.length === 0) return 0;
  
//   const today = new Date();
//   const startDate = daysArray[0].date;
//   const endDate = daysArray[daysArray.length - 1].date;
  
//   // Cek apakah hari ini dalam range yang ditampilkan
//   if (today < startDate || today > endDate) {
//     return -1000; // Di luar area yang terlihat
//   }
  
//   // Hitung hari antara tanggal mulai dan hari ini
//   const daysDiff = differenceInDays(today, startDate);
  
//   // Konversi ke posisi rem (3rem per hari)
//   return daysDiff * ganttZoomLevel.value;
// }

// // Fungsi untuk menyiapkan tampilan custom Gantt
// function setupCustomGanttView() {
//   // Toggle mode tampilan
//   if (ganttView.value !== 'custom') {
//     ganttView.value = 'custom';
    
//     // Setel default range jika belum diatur
//     if (!dateRange.value.start) {
//       dateRange.value.start = format(new Date(), 'yyyy-MM-dd');
//     }
//     if (!dateRange.value.end) {
//       dateRange.value.end = format(addMonths(new Date(), 2), 'yyyy-MM-dd');
//     }
    
//     // Pastikan tanggal akhir lebih besar dari tanggal mulai
//     const startDate = parseISO(dateRange.value.start);
//     const endDate = parseISO(dateRange.value.end);
    
//     if (endDate <= startDate) {
//       dateRange.value.end = format(addDays(startDate, 30), 'yyyy-MM-dd');
//     }
    
//     applyDateFilter();
//   } else {
//     // Toggle kembali ke tampilan default
//     ganttView.value = 'month';
//   }
// }

// Fungsi untuk menerapkan filter tanggal
function applyDateFilter() {
  if (!dateRange.value.start || !dateRange.value.end) {
    showToast({
      message: 'Please set both start and end dates',
      type: 'warning'
    });
    return;
  }
  
  try {
    const startDate = parseISO(dateRange.value.start);
    const endDate = parseISO(dateRange.value.end);
    
    if (endDate <= startDate) {
      showToast({
        message: 'End date must be after start date',
        type: 'error'
      });
      return;
    }
    
    // Tampilkan warning jika range terlalu panjang
    const daysDiff = differenceInDays(endDate, startDate);
    if (daysDiff > maxGanttDays) {
      showToast({
        message: `Range too long, showing first ${maxGanttDays} days only`,
        type: 'warning'
      });
    }
    
    // Jika di view Gantt, update tampilan
    if (viewMode.value === 'gantt') {
      if (ganttView.value !== 'custom') {
        ganttView.value = 'custom';
      }
    }
    
    // Jika di view Calendar, update currentDate
    if (viewMode.value === 'calendar') {
      currentDate.value = startDate;
    }
    
  } catch (error) {
    console.error('Error applying date filter:', error);
    showToast({
      message: 'Invalid date format',
      type: 'error'
    });
  }
}

// Fungsi untuk membersihkan filter tanggal
function clearDateFilter() {
  const today = new Date();
  dateRange.value.start = format(subDays(today, 7), 'yyyy-MM-dd');
  dateRange.value.end = format(addDays(today, 14), 'yyyy-MM-dd');
  
  // Reset Gantt view ke default jika sedang dalam mode custom
  if (ganttView.value === 'custom') {
    ganttView.value = 'month';
    ganttStartDate.value = new Date();
  }
}

// Computed property untuk mengetahui apakah ada filter aktif
// const hasActiveFilters = computed(() => {
//   return searchQuery.value || 
//          statusFilter.value || 
//          projectFilter.value || 
//          (dateRange.value.start && dateRange.value.end);
// });

// Tambahkan watch untuk otomatis menerapkan filter ketika view mode berubah
watch(viewMode, (newMode) => {
  if (newMode === 'gantt' && dateRange.value.start && dateRange.value.end) {
    // Terapkan filter tanggal saat berganti ke Gantt view
    applyDateFilter();
  }
});

function resetGanttToToday() {
  if (ganttView.value === 'custom') {
    // Set range ke periode default (h-7 hingga h+14)
    const today = new Date();
    dateRange.value.start = format(subDays(today, 7), 'yyyy-MM-dd');
    dateRange.value.end = format(addDays(today, 14), 'yyyy-MM-dd');
    applyDateFilter();
  } else {
    // Reset ke tampilan default dengan tanggal hari ini
    ganttStartDate.value = new Date();
  }
}

// Fungsi untuk memformat tanggal dengan lebih rapi
function formatDate(dateString) {
  if (!dateString) return '';
  try {
    // Format: 'Mar 15, 2025'
    return format(parseISO(dateString), 'MMM d, yyyy');
  } catch (e) {
    console.error('Error formatting date:', e);
    return dateString;
  }
}

// Fungsi untuk menambahkan navigasi pada custom view
function customGanttPrevPeriod() {
  if (ganttView.value === 'custom' && dateRange.value.start && dateRange.value.end) {
    try {
      const startDate = parseISO(dateRange.value.start);
      const endDate = parseISO(dateRange.value.end);
      const periodLength = differenceInDays(endDate, startDate);
      
      // Move period backward
      const newStartDate = addDays(startDate, -periodLength);
      const newEndDate = addDays(endDate, -periodLength);
      
      dateRange.value.start = format(newStartDate, 'yyyy-MM-dd');
      dateRange.value.end = format(newEndDate, 'yyyy-MM-dd');
      
      applyDateFilter();
    } catch (error) {
      console.error('Error navigating custom gantt:', error);
    }
  } else {
    // Fallback ke navigasi default
    prevGanttPeriod();
  }
}

function customGanttNextPeriod() {
  if (ganttView.value === 'custom' && dateRange.value.start && dateRange.value.end) {
    try {
      const startDate = parseISO(dateRange.value.start);
      const endDate = parseISO(dateRange.value.end);
      const periodLength = differenceInDays(endDate, startDate);
      
      // Move period forward
      const newStartDate = addDays(startDate, periodLength);
      const newEndDate = addDays(endDate, periodLength);
      
      dateRange.value.start = format(newStartDate, 'yyyy-MM-dd');
      dateRange.value.end = format(newEndDate, 'yyyy-MM-dd');
      
      applyDateFilter();
    } catch (error) {
      console.error('Error navigating custom gantt:', error);
    }
  } else {
    // Fallback ke navigasi default
    nextGanttPeriod();
  }
}

// Override fungsi prev/next Gantt period untuk menangani custom view
const originalPrevGanttPeriod = prevGanttPeriod;
const originalNextGanttPeriod = nextGanttPeriod;

// VIEW GANTT CHART HELPER & METHOD
// Method untuk mendapatkan nama departemen dari ID
function getDepartmentName(departmentId) {
  if (!departmentId) return '';
  const department = departments.value.find(dept => dept.id == departmentId);
  return department ? department.name : '';
}

// Method untuk menangani view detail task
function handleTaskDetailView(task) {
  selectTask(task);
}

// Method untuk menangani view detail project
function handleProjectDetailView(project) {
  // Implementasi sesuai kebutuhan, misalnya redirect ke halaman detail proyek
  console.log('View project detail:', project);
  // router.push({ name: 'project-detail', params: { id: project.id } });
}

// Method untuk menangani perubahan rentang tanggal dari Gantt Chart
function handleDateRangeUpdate(dateRange) {
  // Update filter tanggal berdasarkan rentang tanggal dari Gantt Chart
  dueDateFilter.value = {
    from: dateRange.start,
    to: dateRange.end
  };
  // Opsional: refresh data task
  fetchTasks();
}

// Method untuk menghapus satu filter
function clearSingleFilter(filterName) {
  if (filterName === 'department_id') {
    departmentFilter.value = '';
  } else if (filterName === 'date_range') {
    dueDateFilter.value = { from: '', to: '' };
  }
  fetchTasks();
}

// State untuk aktifitas loading pada Gantt Chart
const ganttLoading = ref(false);

// State untuk menyimpan rentang tanggal saat ini pada Gantt
const currentGanttDateRange = ref({
  start: null,
  end: null
});

// Method untuk inisialisasi tampilan Gantt
function initGanttView() {
  // Set rentang tanggal default jika belum ada
  if (!dueDateFilter.value.from || !dueDateFilter.value.to) {
    const today = new Date();
    const startOfCurrentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfCurrentMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    dueDateFilter.value = {
      from: format(startOfCurrentMonth, 'yyyy-MM-dd'),
      to: format(endOfCurrentMonth, 'yyyy-MM-dd')
    };
  }
  
  // Simpan rentang tanggal saat ini
  currentGanttDateRange.value = {
    start: dueDateFilter.value.from,
    end: dueDateFilter.value.to
  };
}

// Panggil initGanttView saat viewMode berubah ke 'gantt'
watch(viewMode, (newMode) => {
  if (newMode === 'gantt') {
    initGanttView();
  }
});

prevGanttPeriod = function() {
  if (ganttView.value === 'custom') {
    customGanttPrevPeriod();
  } else {
    originalPrevGanttPeriod();
  }
};

nextGanttPeriod = function() {
  if (ganttView.value === 'custom') {
    customGanttNextPeriod();
  } else {
    originalNextGanttPeriod();
  }
};

// Zoom level untuk Gantt chart
const ganttZoomLevel = ref(3); // Default 3rem per hari
const zoomLevels = [
  { value: 1, label: '1x' },   // 1rem per hari - paling jauh
  { value: 2, label: '2x' },   // 2rem per hari
  { value: 3, label: '3x' },   // 3rem per hari - default
  { value: 4, label: '4x' },   // 4rem per hari
  { value: 6, label: '6x' }    // 6rem per hari - paling dekat
];

function setGanttZoom(level) {
  ganttZoomLevel.value = level;
}

// Modifikasi fungsi getGanttTaskPosition untuk mendukung zoom
function getGanttTaskPosition(task, isCustomView = false) {
  if (!task.dates?.planned_start || !task.dates?.planned_end) {
    return null;
  }
  
  const startDate = parseISO(task.dates.planned_start);
  const endDate = parseISO(task.dates.planned_end);
  
  // Pilih array hari berdasarkan mode view
  const daysArray = isCustomView ? ganttDaysCustomRange.value : ganttDays.value;
  
  if (daysArray.length === 0) {
    return null;
  }
  
  const firstDate = daysArray[0].date;
  const lastDate = daysArray[daysArray.length - 1].date;
  
  // Task berada di luar range yang ditampilkan
  if (endDate < firstDate || startDate > lastDate) {
    return null;
  }
  
  // Hitung posisi mulai (pastikan tidak negatif)
  let startPos = Math.max(0, differenceInDays(startDate, firstDate));
  if (startDate < firstDate) startPos = 0;
  
  // Hitung posisi akhir (pastikan tidak melebihi jumlah hari yang ditampilkan)
  let endPos = Math.min(
    daysArray.length - 1, 
    differenceInDays(endDate, firstDate)
  );
  
  // Pastikan width minimal 1 hari
  const width = Math.max(1, endPos - startPos + 1);
  
  return {
    left: startPos * ganttZoomLevel.value, // Gunakan zoom level
    width: width * ganttZoomLevel.value    // Gunakan zoom level
  };
}

function getTodayPosition(isCustomView = false) {
  const daysArray = isCustomView ? ganttDaysCustomRange.value : ganttDays.value;
  
  if (daysArray.length === 0) return 0;
  
  const today = new Date();
  const startDate = daysArray[0].date;
  const endDate = daysArray[daysArray.length - 1].date;
  
  // Cek apakah hari ini dalam range yang ditampilkan
  if (today < startDate || today > endDate) {
    return -1000; // Di luar area yang terlihat
  }
  
  // Hitung hari antara tanggal mulai dan hari ini
  const daysDiff = differenceInDays(today, startDate);
  
  // Konversi ke posisi dengan zoom level
  return daysDiff * ganttZoomLevel.value;
}

// UI Helper untuk menampilkan status zoom
const ganttZoomLabelComputed = computed(() => {
  const currentZoom = zoomLevels.find(z => z.value === ganttZoomLevel.value);
  return currentZoom ? currentZoom.label : '3x';
});

// UI untuk kontrol Zoom
function renderZoomControls() {
  return `
    <div class="flex items-center space-x-2">
      <span class="text-xs text-gray-500">Zoom:</span>
      <button
        @click="ganttZoomLevel > 1 ? ganttZoomLevel-- : null"
        class="p-1 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
        :disabled="ganttZoomLevel <= 1"
        title="Zoom Out"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
        </svg>
      </button>
      <span class="text-xs font-medium w-6 text-center">{{ ganttZoomLabelComputed }}</span>
      <button
        @click="ganttZoomLevel < 6 ? ganttZoomLevel++ : null"
        class="p-1 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
        :disabled="ganttZoomLevel >= 6"
        title="Zoom In"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  `;
}

// Pastikan untuk menambahkan computed zoom yang dibutuhkan
const ganttTimelineStyle = computed(() => {
  return {
    gridTemplateColumns: `repeat(${ganttView.value === 'custom' ? ganttDaysCustomRange.value.length : ganttDays.value.length}, ${ganttZoomLevel.value}rem)`
  };
});

// Modifikasi UI Gantt chart untuk mendukung zoom level
function updateGanttHeaderForZoom() {
  // Ganti CSS class untuk timeline header
  const cellWidth = `w-${ganttZoomLevel.value * 4}`; // Konversi rem ke Tailwind width classes
  
  // Return class yang sesuai berdasarkan zoom level
  return cellWidth; 
}


// V2 FORM
// Add these imports to the top of your script section
import { 
  CheckSquare, 
  Edit, 
  X, 
  FileText, 
  Tag, 
  FolderOpen, 
  List, 
  Link, 
  Bold, 
  Italic, 
  Flag, 
  Calendar, 
  CalendarDays, 
  Clock, 
  Users, 
  User, 
  UserX, 
  Activity, 
  CheckCircle, 
  GitBranch, 
  ArrowUp, 
  XOctagon,
  AlertTriangle, 
  AlertCircle,
  Loader2,
  Save,
  ChevronDown
} from 'lucide-vue-next'; // Import Lucide icons

const isUsingRichEditor = ref(false);
const isSubmitting = ref(false);
const taskTypes = ref([
  { id: 1, name: 'Feature' },
  { id: 2, name: 'Bug' },
  { id: 3, name: 'Enhancement' },
  { id: 4, name: 'Documentation' },
  { id: 5, name: 'Research' }
]);

// Add a method to close the task modal
const closeTaskModal = () => {
  showTaskModal.value = false;
};

// Modify resetTaskForm function to include new fields
// Perbarui fungsi resetTaskForm untuk memastikan nilai default prioritas
// Ganti fungsi resetTaskForm yang ada (sekitar baris 1550-1570)

const resetTaskForm = () => {
  formErrors.value = [];
  isUsingRichEditor.value = false; // Reset editor mode
  currentTask.value = {
    name: '',
    project_id: props.projectId || (projects.value.length > 0 ? projects.value[0].id : ''),
    assigned_to: [],
    planned_date_start: '',
    planned_date_end: '',
    planned_time_start: '09:00', // Tambahkan waktu default
    planned_time_end: '17:00',   // Tambahkan waktu default
    planned_hours: '',
    description: '',
    state: 'draft',
    progress: 0,
    priority: '1', // String type as expected by backend, default ke Menengah (P2)
    type_id: '',
    reviewer_id: '',
    depends_on_ids: [],
    blocked_by_id: ''
  };
};

// Update editTask function to handle new fields
const editTask = (task) => {
  showTaskDetail.value = false; // Close task detail view

  isEditingTask.value = true;
  formErrors.value = [];
  isUsingRichEditor.value = false; // Default to plain text editor
  
  // Format assigned_to as expected by the form
  const assignedToIds = task.assigned_to.map(person => person.id);
  
  // Handle date and time splitting
  let plannedTimeStart = '';
  let plannedTimeEnd = '';
  let plannedDateStart = '';
  let plannedDateEnd = '';
  
  if (task.dates?.planned_start) {
    const startParts = task.dates.planned_start.split('T');
    plannedDateStart = startParts[0];
    plannedTimeStart = startParts[1]?.substring(0, 5) || ''; // Format as HH:MM
  }
  
  if (task.dates?.planned_end) {
    const endParts = task.dates.planned_end.split('T');
    plannedDateEnd = endParts[0];
    plannedTimeEnd = endParts[1]?.substring(0, 5) || ''; // Format as HH:MM
  }
  
  currentTask.value = {
    id: task.id,
    name: task.name,
    project_id: task.project?.id || '',
    assigned_to: assignedToIds,
    planned_date_start: plannedDateStart,
    planned_date_end: plannedDateEnd,
    planned_time_start: plannedTimeStart,
    planned_time_end: plannedTimeEnd,
    planned_hours: task.hours?.planned || '',
    description: task.description || '',
    state: task.state || 'draft',
    progress: task.progress || 0,
    priority: task.priority?.toString() || '1',
    type_id: task.type?.id || '',
    reviewer_id: task.reviewer?.id || '',
    depends_on_ids: task.depends_on?.map(t => t.id) || [],
    blocked_by_id: task.blocked_by?.id || ''
  };
  
  showTaskModal.value = true;
};

// Update validateForm function to include new required fields
// Perbarui fungsi validateForm untuk menambahkan validasi prioritas
// Dan pemeriksaan tanggal yang lebih ketat
// Ganti fungsi validateForm yang ada (sekitar baris 1600-1620)

const validateForm = () => {
  formErrors.value = [];
  
  if (!currentTask.value.name.trim()) {
    formErrors.value.push('Nama tugas wajib diisi');
  }
  
  if (!currentTask.value.project_id) {
    formErrors.value.push('Proyek wajib dipilih');
  }
  
  if (!currentTask.value.assigned_to || currentTask.value.assigned_to.length === 0) {
    formErrors.value.push('Minimal satu anggota tim harus ditugaskan');
  }
  
  // Validasi prioritas
  if (currentTask.value.priority === undefined || currentTask.value.priority === null || currentTask.value.priority === '') {
    formErrors.value.push('Prioritas wajib dipilih');
  }
  
  // Validasi tanggal dan waktu jika sebagian diisi
  if ((currentTask.value.planned_date_start || currentTask.value.planned_time_start) &&
      (!currentTask.value.planned_date_start || !currentTask.value.planned_time_start)) {
    formErrors.value.push('Tanggal dan waktu mulai harus diisi lengkap');
  }
  
  if ((currentTask.value.planned_date_end || currentTask.value.planned_time_end) &&
      (!currentTask.value.planned_date_end || !currentTask.value.planned_time_end)) {
    formErrors.value.push('Tanggal dan waktu selesai harus diisi lengkap');
  }
  
  // Validasi tanggal jika kedua tanggal diisi
  if (currentTask.value.planned_date_start && currentTask.value.planned_date_end) {
    if (currentTask.value.planned_time_start && currentTask.value.planned_time_end) {
      // Buat objek datetime lengkap untuk perbandingan
      const startDate = new Date(`${currentTask.value.planned_date_start}T${currentTask.value.planned_time_start}:00`);
      const endDate = new Date(`${currentTask.value.planned_date_end}T${currentTask.value.planned_time_end}:00`);
      
      if (endDate < startDate) {
        formErrors.value.push('Waktu selesai harus setelah waktu mulai');
      }
    } else {
      // Jika waktu tidak diisi, bandingkan hanya tanggal
      const startDate = new Date(currentTask.value.planned_date_start);
      const endDate = new Date(currentTask.value.planned_date_end);
      
      if (endDate < startDate) {
        formErrors.value.push('Tanggal selesai harus setelah tanggal mulai');
      }
    }
  }
  
  return formErrors.value.length === 0;
};

// Update submitTask function to handle new fields and show loading state
const submitTask = async () => {
  // Validate form
  if (!validateForm()) {
    return;
  }

  try {
    isSubmitting.value = true;
    loading.value = true;
    
    // Prepare date-time values
    let plannedDateStart = currentTask.value.planned_date_start;
    let plannedDateEnd = currentTask.value.planned_date_end;
    
    // Add time if specified - using space instead of T to match expected format
    if (plannedDateStart && currentTask.value.planned_time_start) {
      plannedDateStart = `${plannedDateStart} ${currentTask.value.planned_time_start}:00`;
    }
    
    if (plannedDateEnd && currentTask.value.planned_time_end) {
      plannedDateEnd = `${plannedDateEnd} ${currentTask.value.planned_time_end}:00`;
    }
    
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
        progress: currentTask.value.progress || 0,
        priority: currentTask.value.priority.toString(), // Must be a string value for Selection field
        type_id: currentTask.value.type_id ? parseInt(currentTask.value.type_id) : null,
        reviewer_id: currentTask.value.reviewer_id ? parseInt(currentTask.value.reviewer_id) : null,
        depends_on_ids: currentTask.value.depends_on_ids?.length > 0 ? currentTask.value.depends_on_ids : null,
        blocked_by_id: currentTask.value.blocked_by_id ? parseInt(currentTask.value.blocked_by_id) : null
      }
    };

    // Add optional fields if they have values
    if (plannedDateStart) {
      payload.params.planned_date_start = plannedDateStart;
    }
    if (plannedDateEnd) {
      payload.params.planned_date_end = plannedDateEnd;
    }
    if (currentTask.value.planned_hours) {
      payload.params.planned_hours = parseFloat(currentTask.value.planned_hours);
    }

    if (isEditingTask.value) {
      payload.params.task_id = currentTask.value.id;
    }

    const response = await apiClient.post('/web/v2/team/tasks', payload);
    
    if (response.data.result?.status === 'success') {
      showToast({
        message: `Task ${isEditingTask.value ? 'updated' : 'created'} successfully`,
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
        message: 'Failed to save task. Please try again.',
        type: 'error'
      });
    }
  } catch (error) {
    console.error('Error submitting task:', error);
    showToast({
      message: 'Failed to save task. Please try again.',
      type: 'error'
    });
  } finally {
    isSubmitting.value = false;
    loading.value = false;
  }
};

// Add a helper function to get project tasks (for dependencies)
const getProjectTasks = (projectId) => {
  if (!projectId) return [];
  
  // Filter tasks by the selected project
  return tasks.value.filter(task => 
    task.project && task.project.id === parseInt(projectId)
  );
};


</script>

<style scoped>
/* Custom scrollbar */
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

/* Sortable drag effects */
.sortable-ghost {
  opacity: 0.4;
}

.sortable-drag {
  opacity: 0.8;
  transform: rotate(2deg);
}

/* Tambahkan di bagian style di TeamTaskManager.vue jika belum ada */
/* Dark mode styles for Gantt chart */
.dark-mode-gantt .bg-dark-blue-900 {
  background-color: #0f172a;
}
.dark-mode-gantt .bg-dark-blue-800 {
  background-color: #1e293b;
}
.dark-mode-gantt .border-blue-800 {
  border-color: #1e40af;
}
.dark-mode-gantt .border-blue-700 {
  border-color: #1d4ed8;
}
</style>