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
        <div
          class="flex flex-col sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h3 class="text-lg leading-6 font-medium text-gray-900">
              Task Management
            </h3>
            <p class="mt-1 max-w-2xl text-sm text-gray-500">
              Manage project tasks, schedules, and time tracking
            </p>
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
                  :class="
                    viewMode === 'table'
                      ? 'bg-red-50 text-red-700 border-red-500'
                      : 'bg-white text-gray-700'
                  "
                  title="Table View"
                >
                  <TableIcon class="h-4 w-4 mr-1" />
                  <span class="hidden lg:inline">Table</span>
                </button>
                <button
                  @click="viewMode = 'kanban'"
                  class="px-3 py-2 text-sm font-medium border border-gray-300 focus:outline-none focus:ring-1 focus:ring-red-500 -ml-px flex items-center"
                  :class="
                    viewMode === 'kanban'
                      ? 'bg-red-50 text-red-700 border-red-500'
                      : 'bg-white text-gray-700'
                  "
                  title="Kanban Board View"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                    />
                  </svg>
                  <span class="hidden lg:inline">Kanban</span>
                </button>
                <!-- Calendar View Button -->
                <button
                  @click="viewMode = 'calendar'"
                  class="px-3 py-2 text-sm font-medium border border-gray-300 focus:outline-none focus:ring-1 focus:ring-red-500 -ml-px flex items-center"
                  :class="
                    viewMode === 'calendar'
                      ? 'bg-red-50 text-red-700 border-red-500'
                      : 'bg-white text-gray-700'
                  "
                  title="Calendar View"
                >
                  <CalendarIcon class="h-4 w-4 mr-1" />
                  <span class="hidden lg:inline">Calendar</span>
                </button>
                <!-- Gantt Chart Button -->
                <button
                  @click="viewMode = 'gantt'"
                  class="px-3 py-2 text-sm font-medium border border-gray-300 focus:outline-none focus:ring-1 focus:ring-red-500 -ml-px rounded-r-md flex items-center"
                  :class="
                    viewMode === 'gantt'
                      ? 'bg-red-50 text-red-700 border-red-500'
                      : 'bg-white text-gray-700'
                  "
                  title="Gantt Chart View"
                >
                  <ChartBarIcon class="h-4 w-4 mr-1" />
                  <span class="hidden lg:inline">Gantt</span>
                </button>
              </div>
            </div>

            <!-- Create task button - more prominence -->
            <button
              @click="
                showTaskModal = true;
                isEditingTask = false;
                resetTaskForm();
              "
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-rose-600 to-rose-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
            >
              <PlusIcon class="h-4 w-4 mr-1.5" />
              Create New Task
            </button>
          </div>
        </div>

        <!-- Mobile view toggle (only shown on small screens) -->
        <div
          class="flex md:hidden items-center justify-center mt-4 overflow-x-auto"
        >
          <span class="text-sm text-gray-500 mr-2">View as:</span>
          <div class="inline-flex rounded-md shadow-sm">
            <button
              @click="viewMode = 'table'"
              class="px-2 py-2 text-xs font-medium border border-gray-300 focus:outline-none focus:ring-1 focus:ring-red-500 rounded-l-md flex items-center"
              :class="
                viewMode === 'table'
                  ? 'bg-red-50 text-red-700 border-red-500'
                  : 'bg-white text-gray-700'
              "
            >
              <TableIcon class="h-4 w-4 mr-1" />
              <span>Table</span>
            </button>
            <button
              @click="viewMode = 'kanban'"
              class="px-2 py-2 text-xs font-medium border border-gray-300 focus:outline-none focus:ring-1 focus:ring-red-500 -ml-px flex items-center"
              :class="
                viewMode === 'kanban'
                  ? 'bg-red-50 text-red-700 border-red-500'
                  : 'bg-white text-gray-700'
              "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
              <span>Kanban</span>
            </button>
            <button
              @click="viewMode = 'calendar'"
              class="px-2 py-2 text-xs font-medium border border-gray-300 focus:outline-none focus:ring-1 focus:ring-red-500 -ml-px flex items-center"
              :class="
                viewMode === 'calendar'
                  ? 'bg-red-50 text-red-700 border-red-500'
                  : 'bg-white text-gray-700'
              "
            >
              <CalendarIcon class="h-4 w-4 mr-1" />
              <span>Calendar</span>
            </button>
            <button
              @click="viewMode = 'gantt'"
              class="px-2 py-2 text-xs font-medium border border-gray-300 focus:outline-none focus:ring-1 focus:ring-red-500 -ml-px rounded-r-md flex items-center"
              :class="
                viewMode === 'gantt'
                  ? 'bg-red-50 text-red-700 border-red-500'
                  : 'bg-white text-gray-700'
              "
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
      <div
        class="w-full max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 mb-4 bg-white shadow rounded-md border border-gray-200"
      >
        <div
          class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 items-end"
        >
          <!-- Search field - kept outside filter modal -->
          <div class="w-full sm:w-72">
            <label for="task-search" class="block text-xs text-gray-500 mb-1"
              >Search</label
            >
            <div class="relative rounded-md shadow-sm">
              <div
                class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
              >
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
            <label for="task-assignee" class="block text-xs text-gray-500 mb-1"
              >Assignee</label
            >
            <div class="relative">
              <div
                class="w-full relative"
                @click="showAssigneeDropdown = !showAssigneeDropdown"
                @keydown.esc="showAssigneeDropdown = false"
                @blur="setTimeout(() => (showAssigneeDropdown = false), 100)"
              >
                <div class="relative rounded-md shadow-sm">
                  <div
                    class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                  >
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
                  <div
                    v-if="filteredEmployees.length === 0"
                    class="text-center py-2 text-gray-500 text-sm"
                  >
                    {{
                      employees.length === 0
                        ? "Loading employees..."
                        : "No matching employees"
                    }}
                  </div>

                  <div
                    @click="
                      assignedToFilter = '';
                      assigneeSearchText = '';
                    "
                    class="cursor-default select-none relative py-2 px-4 hover:bg-gray-100"
                    :class="
                      assignedToFilter === ''
                        ? 'text-red-600 font-medium'
                        : 'text-gray-900'
                    "
                  >
                    All assignees
                  </div>

                  <div
                    v-for="employee in filteredEmployees"
                    :key="employee.id"
                    @click="selectAssignee(employee)"
                    class="cursor-default select-none relative py-2 px-4 hover:bg-gray-100"
                    :class="
                      assignedToFilter === employee.id
                        ? 'text-red-600 font-medium'
                        : 'text-gray-900'
                    "
                  >
                    {{ employee.name }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Filter Project (tambahkan setelah department) -->
          <div class="w-full sm:w-64">
            <label for="task-project" class="block text-xs text-gray-500 mb-1"
              >Project</label
            >
            <div class="relative">
              <div
                class="w-full relative"
                @click="showProjectDropdown = !showProjectDropdown"
                @keydown.esc="showProjectDropdown = false"
                @blur="setTimeout(() => (showProjectDropdown = false), 100)"
              >
                <div class="relative rounded-md shadow-sm">
                  <div
                    class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                  >
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
                  <div
                    class="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <ChevronDownIcon class="h-4 w-4 text-gray-400" />
                  </div>
                </div>

                <!-- Dropdown options -->
                <div
                  v-if="showProjectDropdown"
                  class="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base overflow-auto focus:outline-none sm:text-sm"
                >
                  <div
                    @click="
                      () => {
                        projectFilter = '';
                        projectSearchText = '';
                        showProjectDropdown = false;
                      }
                    "
                    class="cursor-default select-none relative py-2 px-4 hover:bg-gray-100"
                    :class="
                      projectFilter === ''
                        ? 'text-red-600 font-medium'
                        : 'text-gray-900'
                    "
                  >
                    All projects
                  </div>
                  <div
                    v-for="project in filteredProjects"
                    :key="project.id"
                    @click="
                      () => {
                        selectProject(project);
                        showProjectDropdown = false;
                      }
                    "
                    class="cursor-default select-none relative py-2 px-4 hover:bg-gray-100"
                    :class="
                      projectFilter === project.id
                        ? 'text-red-600 font-medium'
                        : 'text-gray-900'
                    "
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
        <!-- Active filters display -->
        <div v-if="activeFilterCount > 0" class="mt-3">
          <!-- Debug info (hapus di production) -->
          <div class="text-xs text-gray-400 mb-2">
            Active filters: {{ activeFilterCount }} | Displayed:
            {{ displayedFilters.length }}
            <button
              @click="debugFilters"
              class="ml-2 text-blue-500 hover:text-blue-700"
            >
              🐛 Debug
            </button>
          </div>

          <!-- Filters display -->
          <div class="flex flex-wrap gap-2">
            <div
              v-for="(filter, index) in displayedFilters"
              :key="`${filter.key}-${index}`"
              class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 hover:shadow-md"
              :class="[
                filter.key === 'month'
                  ? 'bg-blue-100 text-blue-800 border border-blue-200'
                  : 'bg-red-100 text-red-800 border border-red-200',
              ]"
            >
              <!-- Filter icon and text -->
              <span class="flex items-center">
                {{ filter.label }}:
                <span class="font-semibold ml-1">{{ filter.value }}</span>
              </span>

              <!-- Remove button (only for removable filters) -->
              <button
                v-if="filter.removable !== false"
                @click="removeFilter(filter.key)"
                class="ml-2 h-4 w-4 flex items-center justify-center rounded-full hover:bg-red-300 text-red-800 transition-colors"
                :class="
                  filter.key === 'month'
                    ? 'hover:bg-blue-300 text-blue-800'
                    : 'hover:bg-red-300'
                "
                title="Remove this filter"
              >
                <XIcon class="h-3 w-3" />
              </button>

              <!-- Month filter indicator (cannot be removed, only navigated) -->
              <span
                v-if="filter.key === 'month'"
                class="ml-2 h-4 w-4 flex items-center justify-center rounded-full bg-blue-200 text-blue-800"
                title="Use month navigation controls to change"
              >
                📅
              </span>
            </div>

            <!-- Clear all filters button -->
            <button
              @click="clearAllFilters"
              class="inline-flex items-center px-3 py-1 text-sm font-medium text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full transition-colors border border-red-200"
              title="Clear all filters except current month"
            >
              <XIcon class="h-3 w-3 mr-1" />
              Clear all filters
            </button>
          </div>

          <!-- Filter summary -->
          <div class="mt-2 text-xs text-gray-500">
            Showing {{ filteredTasks.length }} tasks with
            {{ activeFilterCount }} active filter{{
              activeFilterCount > 1 ? "s" : ""
            }}
          </div>
        </div>

        <div v-else class="mt-3">
          <div class="text-sm text-gray-500 bg-gray-50 rounded-lg px-3 py-2">
            📋 Showing all tasks for
            {{ currentMonthDisplay || "current period" }} • No additional
            filters applied
          </div>
        </div>
      </div>

      <!-- Loading state -->
      <div v-if="loading" class="flex justify-center py-8">
        <svg
          class="animate-spin h-8 w-8 text-red-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </div>

      <!-- Empty state -->
      <div
        v-else-if="filteredTasks.length === 0"
        class="py-8 text-center bg-white shadow rounded-lg"
      >
        <DocumentIcon class="mx-auto h-12 w-12 text-gray-300" />
        <h3 class="mt-2 text-sm font-medium text-gray-900">No tasks found</h3>
        <p class="mt-1 text-sm text-gray-500">
          {{
            searchQuery || statusFilter || projectFilter
              ? "No tasks match your filters."
              : "Get started by creating a new task."
          }}
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
      <div
        v-else-if="viewMode === 'table'"
        class="bg-white shadow rounded-lg overflow-hidden"
      >
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Task
                </th>
                <th
                  scope="col"
                  class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell"
                >
                  Assigned To
                </th>
                <th
                  scope="col"
                  class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell"
                >
                  Priority
                </th>
                <th
                  scope="col"
                  class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell"
                >
                  Progress
                </th>
                <th
                  scope="col"
                  class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell"
                >
                  Due Date
                </th>
                <th
                  scope="col"
                  class="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="task in filteredTasks"
                :key="task.id"
                class="hover:bg-gray-50 cursor-pointer"
                @click="selectTask(task)"
              >
                <td class="px-3 py-2 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="max-w-[150px] sm:max-w-xs truncate">
                      <div class="text-sm font-medium text-gray-900 truncate">
                        {{ task.name }}
                      </div>
                      <div class="text-xs text-gray-500 truncate">
                        {{ task.project?.name || "No project" }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-3 py-2 whitespace-nowrap hidden sm:table-cell">
                  <div class="flex flex-col space-y-0.5">
                    <span
                      v-for="person in task.assigned_to.slice(0, 2)"
                      :key="person.id"
                      class="text-xs text-gray-900 truncate max-w-[120px]"
                    >
                      {{ person.name }}
                    </span>
                    <span
                      v-if="task.assigned_to.length > 2"
                      class="text-xs text-gray-500 cursor-help relative group"
                    >
                      +{{ task.assigned_to.length - 2 }} more
                      <!-- Tooltip -->
                      <div
                        class="absolute left-0 mt-1 w-48 bg-black bg-opacity-80 text-white text-xs rounded py-1 px-2 z-10 invisible group-hover:visible shadow-lg"
                      >
                        <div
                          v-for="person in task.assigned_to.slice(2)"
                          :key="person.id"
                          class="py-0.5"
                        >
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
                      'bg-gray-100 text-gray-800': !task.priority,
                    }"
                  >
                    <Flag class="w-2.5 h-2.5" />
                    {{
                      task.priority
                        ? formatPriority(task.priority)
                        : "Tidak ada"
                    }}
                  </span>
                </td>

                <td class="px-3 py-2 whitespace-nowrap">
                  <span
                    class="px-1.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full"
                    :class="getStatusClass(task.state)"
                  >
                    {{ formatStatus(task.state) }}
                  </span>
                </td>
                <td class="px-3 py-2 whitespace-nowrap hidden lg:table-cell">
                  <div class="flex items-center">
                    <div class="w-16 bg-gray-200 rounded-full h-1.5 mr-1.5">
                      <div
                        class="bg-red-600 h-1.5 rounded-full"
                        :style="{ width: `${task.progress || 0}%` }"
                      ></div>
                    </div>
                    <span class="text-xs text-gray-500"
                      >{{ task.progress || 0 }}%</span
                    >
                  </div>
                </td>
                <td
                  class="px-3 py-2 whitespace-nowrap text-xs text-gray-500 hidden md:table-cell"
                >
                  <div
                    v-if="task.dates?.planned_start || task.dates?.planned_end"
                    class="text-xs"
                  >
                    <div v-if="task.dates?.planned_end" class="text-xs">
                      {{ formatDate(task.dates.planned_end) }}
                    </div>
                  </div>
                  <span v-else>-</span>
                </td>
                <td
                  class="px-3 py-2 whitespace-nowrap text-right text-sm font-medium"
                  @click.stop
                >
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
                <span
                  class="text-xs font-medium text-gray-500 bg-white px-2 py-1 rounded-full"
                >
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
                    <div class="text-sm font-medium text-gray-900 mb-1">
                      {{ task.name }}
                    </div>
                    <div class="text-xs text-gray-500 mb-2">
                      {{ task.project?.name || "No project" }}
                    </div>

                    <div class="flex justify-between items-center">
                      <span
                        class="px-2 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full gap-1"
                        :class="{
                          'bg-blue-100 text-blue-800': task.priority === '0',
                          'bg-emerald-100 text-emerald-800':
                            task.priority === '1',
                          'bg-amber-100 text-amber-800': task.priority === '2',
                          'bg-red-100 text-red-800': task.priority === '3',
                          'bg-gray-100 text-gray-800': !task.priority,
                        }"
                      >
                        <Flag class="w-3 h-3" />
                        {{
                          task.priority
                            ? formatPriority(task.priority)
                            : "Tidak ada"
                        }}
                      </span>
                      <div class="flex items-center">
                        <div class="w-16 bg-gray-200 rounded-full h-1 mr-1">
                          <div
                            class="bg-red-600 h-1 rounded-full"
                            :style="{ width: `${task.progress || 0}%` }"
                          ></div>
                        </div>
                        <span class="text-xs text-gray-500"
                          >{{ task.progress || 0 }}%</span
                        >
                      </div>
                    </div>

                    <div class="mt-2 flex justify-between items-center">
                      <div class="flex flex-wrap gap-1">
                        <div
                          v-for="person in task.assigned_to.slice(0, 2)"
                          :key="person.id"
                          class="h-6 w-6 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-medium uppercase text-xs"
                          :title="person.name"
                        >
                          {{ getInitials(person.name) }}
                        </div>
                        <div
                          v-if="task.assigned_to.length > 2"
                          class="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-medium text-xs"
                        >
                          +{{ task.assigned_to.length - 2 }}
                        </div>
                      </div>

                      <div
                        v-if="task.dates?.planned_end"
                        class="text-xs text-gray-500"
                      >
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
                <span
                  class="text-xs font-medium text-gray-500 bg-white px-2 py-1 rounded-full"
                >
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
                    <div class="text-sm font-medium text-gray-900 mb-1">
                      {{ task.name }}
                    </div>
                    <div class="text-xs text-gray-500 mb-2">
                      {{ task.project?.name || "No project" }}
                    </div>
                    <div class="flex justify-between items-center">
                      <span
                        class="px-2 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full gap-1"
                        :class="{
                          'bg-blue-100 text-blue-800': task.priority === '0',
                          'bg-emerald-100 text-emerald-800':
                            task.priority === '1',
                          'bg-amber-100 text-amber-800': task.priority === '2',
                          'bg-red-100 text-red-800': task.priority === '3',
                          'bg-gray-100 text-gray-800': !task.priority,
                        }"
                      >
                        <Flag class="w-3 h-3" />
                        {{
                          task.priority
                            ? formatPriority(task.priority)
                            : "Tidak ada"
                        }}
                      </span>
                      <div class="flex items-center">
                        <div class="w-16 bg-gray-200 rounded-full h-1 mr-1">
                          <div
                            class="bg-red-600 h-1 rounded-full"
                            :style="{ width: `${task.progress || 0}%` }"
                          ></div>
                        </div>
                        <span class="text-xs text-gray-500"
                          >{{ task.progress || 0 }}%</span
                        >
                      </div>
                    </div>

                    <div class="mt-2 flex justify-between items-center">
                      <div class="flex flex-wrap gap-1">
                        <div
                          v-for="person in task.assigned_to.slice(0, 2)"
                          :key="person.id"
                          class="h-6 w-6 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-medium uppercase text-xs"
                          :title="person.name"
                        >
                          {{ getInitials(person.name) }}
                        </div>
                        <div
                          v-if="task.assigned_to.length > 2"
                          class="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-medium text-xs"
                        >
                          +{{ task.assigned_to.length - 2 }}
                        </div>
                      </div>
                      <div
                        v-if="task.dates?.planned_end"
                        class="text-xs text-gray-500"
                      >
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
                <span
                  class="text-xs font-medium text-gray-500 bg-white px-2 py-1 rounded-full"
                >
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
                    <div class="text-sm font-medium text-gray-900 mb-1">
                      {{ task.name }}
                    </div>
                    <div class="text-xs text-gray-500 mb-2">
                      {{ task.project?.name || "No project" }}
                    </div>

                    <div class="flex justify-between items-center">
                      <span
                        class="px-2 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full gap-1"
                        :class="{
                          'bg-blue-100 text-blue-800': task.priority === '0',
                          'bg-green-100 text-green-800': task.priority === '1',
                          'bg-orange-100 text-orange-800':
                            task.priority === '2',
                          'bg-red-100 text-red-800': task.priority === '3',
                          'bg-gray-100 text-gray-800': !task.priority,
                        }"
                      >
                        <Flag class="w-3 h-3" />
                        {{
                          task.priority ? formatPriority(task.priority) : "No"
                        }}
                      </span>
                      <div class="flex items-center">
                        <div class="w-16 bg-gray-200 rounded-full h-1 mr-1">
                          <div
                            class="bg-red-600 h-1 rounded-full"
                            :style="{ width: `${task.progress || 0}%` }"
                          ></div>
                        </div>
                        <span class="text-xs text-gray-500"
                          >{{ task.progress || 0 }}%</span
                        >
                      </div>
                    </div>

                    <div class="mt-2 flex justify-between items-center">
                      <div class="flex flex-wrap gap-1">
                        <div
                          v-for="person in task.assigned_to.slice(0, 2)"
                          :key="person.id"
                          class="h-6 w-6 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-medium uppercase text-xs"
                          :title="person.name"
                        >
                          {{ getInitials(person.name) }}
                        </div>
                        <div
                          v-if="task.assigned_to.length > 2"
                          class="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-medium text-xs"
                        >
                          +{{ task.assigned_to.length - 2 }}
                        </div>
                      </div>

                      <div
                        v-if="task.dates?.planned_end"
                        class="text-xs text-gray-500"
                      >
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
                <span
                  class="text-xs font-medium text-gray-500 bg-white px-2 py-1 rounded-full"
                >
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
                    <div class="text-sm font-medium text-gray-900 mb-1">
                      {{ task.name }}
                    </div>
                    <div class="text-xs text-gray-500 mb-2">
                      {{ task.project?.name || "No project" }}
                    </div>

                    <div class="flex justify-between items-center">
                      <span
                        class="px-2 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full gap-1"
                        :class="{
                          'bg-blue-100 text-blue-800': task.priority === '0',
                          'bg-green-100 text-green-800': task.priority === '1',
                          'bg-orange-100 text-orange-800':
                            task.priority === '2',
                          'bg-red-100 text-red-800': task.priority === '3',
                          'bg-gray-100 text-gray-800': !task.priority,
                        }"
                      >
                        <Flag class="w-3 h-3" />
                        {{
                          task.priority ? formatPriority(task.priority) : "No"
                        }}
                      </span>
                      <div class="flex items-center">
                        <div class="w-16 bg-gray-200 rounded-full h-1 mr-1">
                          <div
                            class="bg-red-600 h-1 rounded-full"
                            :style="{ width: `${task.progress || 0}%` }"
                          ></div>
                        </div>
                        <span class="text-xs text-gray-500"
                          >{{ task.progress || 0 }}%</span
                        >
                      </div>
                    </div>

                    <div class="mt-2 flex justify-between items-center">
                      <div class="flex flex-wrap gap-1">
                        <div
                          v-for="person in task.assigned_to.slice(0, 2)"
                          :key="person.id"
                          class="h-6 w-6 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-medium uppercase text-xs"
                          :title="person.name"
                        >
                          {{ getInitials(person.name) }}
                        </div>
                        <div
                          v-if="task.assigned_to.length > 2"
                          class="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-medium text-xs"
                        >
                          +{{ task.assigned_to.length - 2 }}
                        </div>
                      </div>

                      <div
                        v-if="task.dates?.planned_end"
                        class="text-xs text-gray-500"
                      >
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
                <span
                  class="text-xs font-medium text-gray-500 bg-white px-2 py-1 rounded-full"
                >
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
                    <div class="text-sm font-medium text-gray-900 mb-1">
                      {{ task.name }}
                    </div>
                    <div class="text-xs text-gray-500 mb-2">
                      {{ task.project?.name || "No project" }}
                    </div>

                    <div class="flex justify-between items-center">
                      <span
                        class="px-2 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full gap-1"
                        :class="{
                          'bg-blue-100 text-blue-800': task.priority === '0',
                          'bg-green-100 text-green-800': task.priority === '1',
                          'bg-orange-100 text-orange-800':
                            task.priority === '2',
                          'bg-red-100 text-red-800': task.priority === '3',
                          'bg-gray-100 text-gray-800': !task.priority,
                        }"
                      >
                        <Flag class="w-3 h-3" />
                        {{
                          task.priority ? formatPriority(task.priority) : "No"
                        }}
                      </span>
                      <div class="flex items-center">
                        <div class="w-16 bg-gray-200 rounded-full h-1 mr-1">
                          <div
                            class="bg-red-600 h-1 rounded-full"
                            :style="{ width: `${task.progress || 0}%` }"
                          ></div>
                        </div>
                        <span class="text-xs text-gray-500"
                          >{{ task.progress || 0 }}%</span
                        >
                      </div>
                    </div>

                    <div class="mt-2 flex justify-between items-center">
                      <div class="flex flex-wrap gap-1">
                        <div
                          v-for="person in task.assigned_to.slice(0, 2)"
                          :key="person.id"
                          class="h-6 w-6 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-medium uppercase text-xs"
                          :title="person.name"
                        >
                          {{ getInitials(person.name) }}
                        </div>
                        <div
                          v-if="task.assigned_to.length > 2"
                          class="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-medium text-xs"
                        >
                          +{{ task.assigned_to.length - 2 }}
                        </div>
                      </div>

                      <div
                        v-if="task.dates?.planned_end"
                        class="text-xs text-gray-500"
                      >
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
                <span
                  class="text-xs font-medium text-gray-500 bg-white px-2 py-1 rounded-full"
                >
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
                    <div class="text-sm font-medium text-gray-900 mb-1">
                      {{ task.name }}
                    </div>
                    <div class="text-xs text-gray-500 mb-2">
                      {{ task.project?.name || "No project" }}
                    </div>
                    <div class="flex justify-between items-center">
                      <span
                        class="px-2 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full gap-1"
                        :class="{
                          'bg-blue-100 text-blue-800': task.priority === '0',
                          'bg-green-100 text-green-800': task.priority === '1',
                          'bg-orange-100 text-orange-800':
                            task.priority === '2',
                          'bg-red-100 text-red-800': task.priority === '3',
                          'bg-gray-100 text-gray-800': !task.priority,
                        }"
                      >
                        <Flag class="w-3 h-3" />
                        {{
                          task.priority ? formatPriority(task.priority) : "No"
                        }}
                      </span>
                      <div class="flex items-center">
                        <div class="w-16 bg-gray-200 rounded-full h-1 mr-1">
                          <div
                            class="bg-red-600 h-1 rounded-full"
                            :style="{ width: `${task.progress || 0}%` }"
                          ></div>
                        </div>
                        <span class="text-xs text-gray-500"
                          >{{ task.progress || 0 }}%</span
                        >
                      </div>
                    </div>
                    <div class="mt-2 flex justify-between items-center">
                      <div class="flex flex-wrap gap-1">
                        <div
                          v-for="person in task.assigned_to.slice(0, 2)"
                          :key="person.id"
                          class="h-6 w-6 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-medium uppercase text-xs"
                          :title="person.name"
                        >
                          {{ getInitials(person.name) }}
                        </div>
                        <div
                          v-if="task.assigned_to.length > 2"
                          class="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-medium text-xs"
                        >
                          +{{ task.assigned_to.length - 2 }}
                        </div>
                      </div>
                      <div
                        v-if="task.dates?.planned_end"
                        class="text-xs text-gray-500"
                      >
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
      <div
        v-else-if="viewMode === 'calendar'"
        class="bg-white shadow rounded-lg overflow-hidden"
      >
        <div class="p-4 border-b border-gray-200">
          <div class="flex justify-between items-center mb-4">
            <div class="flex space-x-2">
              <button
                @click="prevMonth"
                class="p-1 rounded border border-gray-300 hover:bg-gray-100"
              >
                <ChevronLeftIcon class="h-5 w-5 text-gray-700" />
              </button>
              <button
                @click="nextMonth"
                class="p-1 rounded border border-gray-300 hover:bg-gray-100"
              >
                <ChevronRightIcon class="h-5 w-5 text-gray-700" />
              </button>
              <button
                @click="goToToday"
                class="px-3 py-1 rounded border border-gray-300 hover:bg-gray-100 text-sm font-medium"
              >
                Today
              </button>
            </div>
            <h2 class="text-lg font-semibold text-gray-900">
              {{ currentMonthName }} {{ currentYear }}
            </h2>
            <div class="flex space-x-2">
              <button
                @click="calendarView = 'month'"
                class="px-3 py-1 text-sm font-medium rounded"
                :class="
                  calendarView === 'month'
                    ? 'bg-red-600 text-white'
                    : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
                "
              >
                Month
              </button>
              <button
                @click="calendarView = 'week'"
                class="px-3 py-1 text-sm font-medium rounded"
                :class="
                  calendarView === 'week'
                    ? 'bg-red-600 text-white'
                    : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
                "
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
            <div
              v-for="day in daysOfWeek"
              :key="day"
              class="text-center p-2 bg-gray-50 font-medium text-gray-700"
            >
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
                'relative',
              ]"
            >
              <!-- Date display -->
              <div class="text-right mb-1">
                <span
                  :class="[
                    day.isCurrentMonth ? 'text-gray-900' : 'text-gray-400',
                    day.isToday ? 'font-bold bg-red-100 rounded-full px-2' : '',
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
                day.isToday
                  ? 'bg-red-50 text-red-700'
                  : 'bg-gray-50 text-gray-700',
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
                    'border-l-' + getStatusColor(task.state),
                  ]"
                >
                  <div class="font-semibold">{{ task.name }}</div>
                  <div class="text-xs text-gray-500">
                    {{ task.project?.name || "No project" }}
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
      <div v-else-if="viewMode === 'gantt'">
        <!-- Replace ModernGanttChart with ProjectGanttChart style -->
        <EnhancedGanttChart
          :tasks-data="tasks"
          :loading="loading"
          :department-id="departmentFilter ? parseInt(departmentFilter) : null"
          :department-name="
            departmentFilter ? getDepartmentName(departmentFilter) : ''
          "
          :state-filter="statusFilter"
          :project-id="projectFilter ? parseInt(projectFilter) : null"
          :start-date-filter="dueDateFilter.from"
          :end-date-filter="dueDateFilter.to"
          :sort-field="sortOptions.field"
          :sort-order="sortOptions.order"
          :active-filters-count="activeFilterCount"
          @view-task-detail="handleTaskDetailView"
          @edit-task="editTask"
          @update:dateRange="handleDateRangeUpdate"
          @clearFilter="clearSingleFilter"
          @resetFilters="clearAllFilters"
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
                      <label
                        for="department-filter"
                        class="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Department
                      </label>
                      <select
                        id="department-filter"
                        v-model="departmentFilter"
                        class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                      >
                        <option value="">All Departments</option>
                        <option
                          v-for="department in departments"
                          :key="department.id"
                          :value="department.id"
                        >
                          {{ department.name }}
                        </option>
                      </select>
                    </div>

                    <!-- Filter Project (tambahkan setelah department) -->
                    <div class="w-full sm:w-64">
                      <label
                        for="task-project"
                        class="block text-xs text-gray-500 mb-1"
                        >Project</label
                      >
                      <div class="relative">
                        <div
                          class="w-full relative"
                          @click="showProjectDropdown = !showProjectDropdown"
                          @keydown.esc="showProjectDropdown = false"
                          @blur="
                            setTimeout(() => (showProjectDropdown = false), 100)
                          "
                        >
                          <div class="relative rounded-md shadow-sm">
                            <div
                              class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                            >
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
                            <div
                              class="absolute inset-y-0 right-0 pr-3 flex items-center"
                            >
                              <ChevronDownIcon class="h-4 w-4 text-gray-400" />
                            </div>
                          </div>

                          <!-- Dropdown options -->
                          <div
                            v-if="showProjectDropdown"
                            class="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base overflow-auto focus:outline-none sm:text-sm"
                          >
                            <div
                              @click="
                                projectFilter = '';
                                projectSearchText = '';
                              "
                              class="cursor-default select-none relative py-2 px-4 hover:bg-gray-100"
                              :class="
                                projectFilter === ''
                                  ? 'text-red-600 font-medium'
                                  : 'text-gray-900'
                              "
                            >
                              All projects
                            </div>
                            <div
                              v-for="project in filteredProjects"
                              :key="project.id"
                              @click="selectProject(project)"
                              class="cursor-default select-none relative py-2 px-4 hover:bg-gray-100"
                              :class="
                                projectFilter === project.id
                                  ? 'text-red-600 font-medium'
                                  : 'text-gray-900'
                              "
                            >
                              {{ project.name }}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <!-- Status Filter -->
                    <div>
                      <label
                        for="status-filter"
                        class="block text-sm font-medium text-gray-700 mb-1"
                      >
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
                      <label
                        for="type-filter"
                        class="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Task Type
                      </label>
                      <select
                        id="type-filter"
                        v-model="typeFilter"
                        class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                      >
                        <option value="">All Types</option>
                        <option
                          v-for="type in taskTypes"
                          :key="type.id"
                          :value="type.id"
                        >
                          {{ type.name }}
                        </option>
                      </select>
                    </div>

                    <!-- Priority Filter -->
                    <div>
                      <label
                        for="priority-filter"
                        class="block text-sm font-medium text-gray-700 mb-1"
                      >
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
                      <label
                        class="block text-sm font-medium text-gray-700 mb-1"
                      >
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
                      <label
                        class="block text-sm font-medium text-gray-700 mb-1"
                      >
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
                    <div
                      class="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4"
                    >
                      <!-- My Tasks -->
                      <div class="flex items-center">
                        <input
                          id="my-tasks"
                          type="checkbox"
                          v-model="isMyTasksOnly"
                          class="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                        />
                        <label
                          for="my-tasks"
                          class="ml-2 block text-sm text-gray-700"
                        >
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
                        <label
                          for="overdue-tasks"
                          class="ml-2 block text-sm text-gray-700"
                        >
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
                        <label
                          for="has-dependencies"
                          class="ml-2 block text-sm text-gray-700"
                        >
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
                        <label
                          for="is-blocked"
                          class="ml-2 block text-sm text-gray-700"
                        >
                          Is blocked
                        </label>
                      </div>
                    </div>

                    <!-- Recent Activity -->
                    <div>
                      <label
                        for="recent-days"
                        class="block text-sm font-medium text-gray-700 mb-1"
                      >
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
                <div
                  class="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between"
                >
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
                <div
                  class="bg-gradient-to-r from-rose-500 to-rose-600 px-6 py-4"
                >
                  <div class="flex items-center justify-between">
                    <div>
                      <h2
                        class="text-lg font-medium text-white flex items-center"
                      >
                        <CheckSquare
                          v-if="!isEditingTask"
                          class="w-5 h-5 mr-2"
                        />
                        <Edit v-else class="w-5 h-5 mr-2" />
                        {{ isEditingTask ? "Edit Task" : "Create New Task" }}
                      </h2>
                      <p class="mt-1 text-sm text-red-100">
                        {{
                          isEditingTask
                            ? "Update task details"
                            : "Add a new task to this project"
                        }}
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
                      <div
                        class="bg-gray-50 rounded-lg p-6 border border-gray-100"
                      >
                        <h3
                          class="text-sm font-medium text-gray-700 mb-4 flex items-center"
                        >
                          <FileText class="w-4 h-4 mr-1.5 text-red-500" />
                          Task Information
                        </h3>

                        <div class="space-y-4">
                          <!-- Task Name -->
                          <div>
                            <label
                              for="task-name"
                              class="block text-sm font-medium text-gray-700 mb-1.5"
                            >
                              Task Name <span class="text-red-500">*</span>
                            </label>
                            <div class="relative rounded-md shadow-sm">
                              <div
                                class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                              >
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
                            <label
                              for="task-project"
                              class="block text-sm font-medium text-gray-700 mb-1.5"
                            >
                              Project <span class="text-red-500">*</span>
                            </label>
                            <div class="relative rounded-md shadow-sm">
                              <div
                                class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                              >
                                <FolderOpen class="h-4 w-4 text-gray-400" />
                              </div>
                              <select
                                id="task-project"
                                v-model="currentTask.project_id"
                                class="block w-full pl-10 pr-10 py-2.5 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-lg"
                                required
                                :disabled="isEditingTask"
                              >
                                <option value="" disabled selected>
                                  Select a project
                                </option>
                                <option
                                  v-for="project in projects"
                                  :key="project.id"
                                  :value="project.id"
                                >
                                  {{ project.name }}
                                </option>
                              </select>
                              <div
                                class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
                              >
                                <!-- <ChevronDown class="h-4 w-4 text-gray-400" /> -->
                              </div>
                            </div>
                          </div>

                          <!-- Task Type -->
                          <div>
                            <label
                              for="task-type"
                              class="block text-sm font-medium text-gray-700 mb-1.5"
                            >
                              Task Type
                            </label>
                            <div class="relative rounded-md shadow-sm">
                              <div
                                class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                              >
                                <List class="h-4 w-4 text-gray-400" />
                              </div>
                              <select
                                id="task-type"
                                v-model="currentTask.type_id"
                                class="block w-full pl-10 pr-10 py-2.5 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-lg"
                              >
                                <option value="">General</option>
                                <option
                                  v-for="type in taskTypes"
                                  :key="type.id"
                                  :value="type.id"
                                >
                                  {{ type.name }}
                                </option>
                              </select>
                              <div
                                class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
                              >
                                <!-- <ChevronDown class="h-4 w-4 text-gray-400" /> -->
                              </div>
                            </div>
                          </div>

                          <!-- Priority -->
                          <!-- Priority - Ditingkatkan dengan deskripsi yang jelas -->
                          <div>
                            <label
                              for="task-priority"
                              class="block text-sm font-medium text-gray-700 mb-1.5"
                            >
                              Prioritas <span class="text-red-500">*</span>
                            </label>
                            <div class="relative rounded-md shadow-sm">
                              <div
                                class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                              >
                                <Flag class="h-4 w-4 text-gray-400" />
                              </div>
                              <select
                                id="task-priority"
                                v-model="currentTask.priority"
                                required
                                class="block w-full pl-10 pr-10 py-2.5 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-lg"
                              >
                                <option
                                  value="3"
                                  class="text-red-700 font-medium"
                                >
                                  Kritis (P0) - Masalah mendesak yang memerlukan
                                  perhatian segera
                                </option>
                                <option
                                  value="2"
                                  class="text-amber-700 font-medium"
                                >
                                  Tinggi (P1) - Masalah penting yang perlu
                                  segera ditangani
                                </option>
                                <option
                                  value="1"
                                  class="text-emerald-700 font-medium"
                                >
                                  Menengah (P2) - Prioritas standar untuk
                                  pekerjaan reguler
                                </option>
                                <option
                                  value="0"
                                  class="text-blue-700 font-medium"
                                >
                                  Rendah (P3) - Tugas yang dapat diselesaikan
                                  jika waktu memungkinkan
                                </option>
                              </select>
                            </div>
                            <p class="mt-1 text-xs text-gray-500">
                              Pilih tingkat prioritas yang sesuai untuk tugas
                              ini
                            </p>
                          </div>

                          <!-- Tambahkan panduan prioritas setelah pilihan prioritas -->
                          <div
                            class="mt-2 p-2 bg-gray-50 rounded-lg border border-gray-100 text-xs"
                          >
                            <div class="font-medium mb-1 text-gray-700">
                              Panduan Prioritas:
                            </div>
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <div class="flex items-center">
                                <div
                                  class="h-3 w-3 bg-red-500 rounded-full mr-2"
                                ></div>
                                <span
                                  ><span class="font-medium">P0 (Kritis):</span>
                                  Memerlukan perhatian segera</span
                                >
                              </div>
                              <div class="flex items-center">
                                <div
                                  class="h-3 w-3 bg-amber-500 rounded-full mr-2"
                                ></div>
                                <span
                                  ><span class="font-medium">P1 (Tinggi):</span>
                                  Penting, segera ditangani</span
                                >
                              </div>
                              <div class="flex items-center">
                                <div
                                  class="h-3 w-3 bg-emerald-500 rounded-full mr-2"
                                ></div>
                                <span
                                  ><span class="font-medium"
                                    >P2 (Menengah):</span
                                  >
                                  Prioritas standar</span
                                >
                              </div>
                              <div class="flex items-center">
                                <div
                                  class="h-3 w-3 bg-blue-500 rounded-full mr-2"
                                ></div>
                                <span
                                  ><span class="font-medium">P3 (Rendah):</span>
                                  Dapat diselesaikan nanti</span
                                >
                              </div>
                            </div>
                          </div>

                          <!-- Description -->
                          <div>
                            <label
                              for="task-description"
                              class="block text-sm font-medium text-gray-700 mb-1.5"
                            >
                              Description
                            </label>
                            <div v-if="isUsingRichEditor">
                              <!-- Rich Text Editor Placeholder - You can implement actual rich editor here -->
                              <div
                                class="mt-1 relative rounded-md border border-gray-300 overflow-hidden"
                              >
                                <div
                                  class="bg-gray-50 px-3 py-2 border-b border-gray-300 flex items-center space-x-2"
                                >
                                  <button
                                    type="button"
                                    class="p-1 hover:bg-gray-200 rounded"
                                  >
                                    <Bold class="h-4 w-4 text-gray-600" />
                                  </button>
                                  <button
                                    type="button"
                                    class="p-1 hover:bg-gray-200 rounded"
                                  >
                                    <Italic class="h-4 w-4 text-gray-600" />
                                  </button>
                                  <button
                                    type="button"
                                    class="p-1 hover:bg-gray-200 rounded"
                                  >
                                    <List class="h-4 w-4 text-gray-600" />
                                  </button>
                                  <button
                                    type="button"
                                    class="p-1 hover:bg-gray-200 rounded"
                                  >
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
                                <label
                                  class="block text-xs font-medium text-gray-500 mb-1"
                                  >Preview:</label
                                >
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
                              <div
                                v-if="currentTask.description?.includes('<')"
                                class="mt-2"
                              >
                                <label
                                  class="block text-xs font-medium text-gray-500 mb-1"
                                  >Preview:</label
                                >
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
                      <div
                        class="bg-gray-50 rounded-lg p-6 border border-gray-100"
                      >
                        <h3
                          class="text-sm font-medium text-gray-700 mb-4 flex items-center"
                        >
                          <Calendar class="w-4 h-4 mr-1.5 text-red-500" />
                          Schedule & Timing
                        </h3>

                        <div class="space-y-4">
                          <!-- Planned Start - Dalam 1 baris -->
                          <div>
                            <label
                              class="block text-sm font-medium text-gray-700 mb-1.5"
                              >Planned Start</label
                            >
                            <div class="flex gap-2">
                              <div class="flex-grow relative">
                                <div
                                  class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                                >
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
                            <label
                              class="block text-sm font-medium text-gray-700 mb-1.5"
                              >Planned End</label
                            >
                            <div class="flex gap-2">
                              <div class="flex-grow relative">
                                <div
                                  class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                                >
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
                            <label
                              class="block text-sm font-medium text-gray-700 mb-1.5"
                              >Planned Hours</label
                            >
                            <div class="flex gap-2 items-center">
                              <div
                                class="flex-grow relative rounded-md shadow-sm"
                              >
                                <div
                                  class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                                >
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
                                <div
                                  class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
                                >
                                  <span class="text-gray-500 sm:text-sm"
                                    >hrs</span
                                  >
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
                            <p class="mt-1 text-xs text-gray-500">
                              Jam yang direncanakan berdasarkan waktu mulai dan
                              selesai
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Right Column -->
                    <div class="space-y-6">
                      <!-- Team Assignment Card -->
                      <div
                        class="bg-gray-50 rounded-lg p-6 border border-gray-100"
                      >
                        <h3
                          class="text-sm font-medium text-gray-700 mb-4 flex items-center"
                        >
                          <Users class="w-4 h-4 mr-1.5 text-red-500" />
                          Team Assignment
                        </h3>

                        <!-- Team Members -->
                        <div>
                          <label
                            class="block text-sm font-medium text-gray-700 mb-1.5"
                          >
                            Assigned Team Members
                            <span class="text-red-500">*</span>
                          </label>

                          <div
                            v-if="currentTask.project_id"
                            class="border border-gray-300 rounded-lg overflow-hidden bg-white"
                          >
                            <div
                              v-if="
                                getProjectTeamMembers(currentTask.project_id)
                                  .length > 0
                              "
                              class="max-h-48 overflow-y-auto custom-scrollbar"
                            >
                              <div
                                v-for="member in getProjectTeamMembers(
                                  currentTask.project_id
                                )"
                                :key="member.id"
                                class="flex items-center py-2.5 px-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                              >
                                <div class="flex-shrink-0 mr-3">
                                  <div
                                    class="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-medium uppercase text-xs"
                                  >
                                    {{ getInitials(member.name) }}
                                  </div>
                                </div>
                                <div class="flex-1 min-w-0">
                                  <label
                                    :for="`member-${member.id}`"
                                    class="block text-sm font-medium text-gray-900 cursor-pointer"
                                  >
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
                              <UserX
                                class="h-8 w-8 text-gray-300 mx-auto mb-2"
                              />
                              <p class="text-sm text-gray-500">
                                No team members available
                              </p>
                            </div>
                          </div>
                          <div
                            v-else
                            class="mt-1 bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-center"
                          >
                            <AlertCircle
                              class="h-5 w-5 text-orange-400 mr-2 flex-shrink-0"
                            />
                            <p class="text-sm text-orange-700">
                              Please select a project first
                            </p>
                          </div>
                        </div>

                        <!-- Reviewer -->
                        <div class="mt-4">
                          <label
                            for="task-reviewer"
                            class="block text-sm font-medium text-gray-700 mb-1.5"
                          >
                            Reviewer
                          </label>
                          <div class="relative rounded-md shadow-sm">
                            <div
                              class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                            >
                              <User class="h-4 w-4 text-gray-400" />
                            </div>
                            <select
                              id="task-reviewer"
                              v-model="currentTask.reviewer_id"
                              class="block w-full pl-10 pr-10 py-2.5 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-lg"
                            >
                              <option value="">Select reviewer</option>
                              <option
                                v-for="member in getProjectTeamMembers(
                                  currentTask.project_id
                                )"
                                :key="member.id"
                                :value="member.id"
                              >
                                {{ member.name }}
                              </option>
                            </select>
                            <div
                              class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
                            >
                              <!-- <ChevronDown class="h-4 w-4 text-gray-400" /> -->
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- Status Card -->
                      <div
                        class="bg-gray-50 rounded-lg p-6 border border-gray-100"
                      >
                        <h3
                          class="text-sm font-medium text-gray-700 mb-4 flex items-center"
                        >
                          <Activity class="w-4 h-4 mr-1.5 text-red-500" />
                          Progress & Status
                        </h3>

                        <div class="space-y-4">
                          <!-- Status -->
                          <div>
                            <label
                              for="task-status"
                              class="block text-sm font-medium text-gray-700 mb-1.5"
                              >Status</label
                            >
                            <div class="relative rounded-md shadow-sm">
                              <div
                                class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                              >
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
                              <div
                                class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
                              >
                                <!-- <ChevronDown class="h-4 w-4 text-gray-400" /> -->
                              </div>
                            </div>
                          </div>

                          <!-- Progress -->
                          <div>
                            <div
                              class="flex justify-between items-center mb-1.5"
                            >
                              <label
                                for="task-progress"
                                class="block text-sm font-medium text-gray-700"
                                >Progress</label
                              >
                              <span class="text-sm font-medium text-red-600"
                                >{{ currentTask.progress || 0 }}%</span
                              >
                            </div>
                            <div
                              class="w-full bg-gray-200 rounded-full h-2.5 mb-2"
                            >
                              <div
                                class="h-2.5 rounded-full transition-all duration-300"
                                :class="{
                                  'bg-red-500':
                                    (currentTask.progress || 0) < 30,
                                  'bg-orange-500':
                                    (currentTask.progress || 0) >= 30 &&
                                    (currentTask.progress || 0) < 70,
                                  'bg-green-500':
                                    (currentTask.progress || 0) >= 70,
                                }"
                                :style="{
                                  width: `${currentTask.progress || 0}%`,
                                }"
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
                            <div
                              class="flex justify-between text-xs text-gray-500 mt-1"
                            >
                              <span>0%</span>
                              <span>50%</span>
                              <span>100%</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- Dependencies Card (New) -->
                      <div
                        class="bg-gray-50 rounded-lg p-6 border border-gray-100"
                      >
                        <h3
                          class="text-sm font-medium text-gray-700 mb-4 flex items-center"
                        >
                          <GitBranch class="w-4 h-4 mr-1.5 text-red-500" />
                          Dependencies & Relationships
                        </h3>

                        <div v-if="currentTask.project_id" class="space-y-4">
                          <!-- Depends On -->
                          <div>
                            <label
                              for="task-depends-on"
                              class="block text-sm font-medium text-gray-700 mb-1.5"
                            >
                              This task depends on
                            </label>
                            <div class="relative rounded-md shadow-sm">
                              <div
                                class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                              >
                                <ArrowUp class="h-4 w-4 text-gray-400" />
                              </div>
                              <select
                                id="task-depends-on"
                                v-model="currentTask.depends_on_ids"
                                multiple
                                class="block w-full pl-10 pr-10 py-2 text-sm border-gray-300 rounded-lg shadow-sm focus:border-red-500 focus:ring-red-500"
                                size="3"
                              >
                                <option
                                  v-for="task in getProjectTasks(
                                    currentTask.project_id
                                  ).filter((t) => t.id !== currentTask.id)"
                                  :key="task.id"
                                  :value="task.id"
                                >
                                  {{ task.name }}
                                </option>
                              </select>
                            </div>
                            <p class="mt-1 text-xs text-gray-500">
                              Hold Ctrl/Cmd to select multiple tasks
                            </p>
                          </div>

                          <!-- Blocks -->
                          <div>
                            <label
                              for="task-blocked-by"
                              class="block text-sm font-medium text-gray-700 mb-1.5"
                            >
                              This task is blocked by
                            </label>
                            <div class="relative rounded-md shadow-sm">
                              <div
                                class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                              >
                                <XOctagon class="h-4 w-4 text-gray-400" />
                              </div>
                              <select
                                id="task-blocked-by"
                                v-model="currentTask.blocked_by_id"
                                class="block w-full pl-10 pr-10 py-2 text-sm border-gray-300 rounded-lg shadow-sm focus:border-red-500 focus:ring-red-500"
                              >
                                <option value="">Not blocked</option>
                                <option
                                  v-for="task in getProjectTasks(
                                    currentTask.project_id
                                  ).filter((t) => t.id !== currentTask.id)"
                                  :key="task.id"
                                  :value="task.id"
                                >
                                  {{ task.name }}
                                </option>
                              </select>
                              <div
                                class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
                              >
                                <!-- <ChevronDown class="h-4 w-4 text-gray-400" /> -->
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          v-else
                          class="bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-center"
                        >
                          <AlertCircle
                            class="h-5 w-5 text-orange-400 mr-2 flex-shrink-0"
                          />
                          <p class="text-sm text-orange-700">
                            Please select a project first
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Form Errors -->
                  <div
                    v-if="formErrors.length > 0"
                    class="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg"
                  >
                    <div class="flex">
                      <AlertTriangle
                        class="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0"
                      />
                      <div class="ml-3">
                        <h3 class="text-sm font-medium text-red-800">
                          Please fix the following errors:
                        </h3>
                        <ul
                          class="mt-1 text-xs text-red-700 list-disc ml-5 space-y-1"
                        >
                          <li v-for="(error, index) in formErrors" :key="index">
                            {{ error }}
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Modal Footer -->
                <div
                  class="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t border-gray-100"
                >
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
                    <Loader2
                      v-if="isSubmitting"
                      class="w-4 h-4 mr-2 animate-spin"
                    />
                    <Save v-else class="w-4 h-4 mr-1.5" />
                    {{ isEditingTask ? "Update Task" : "Create Task" }}
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
// ============================================================================
// IMPORTS - KEEP EXISTING + ADD NEW
// ============================================================================
import { ref, computed, onMounted, watch, nextTick } from "vue";
import { useToast } from "@/composables/useToast";
import {
  format,
  parseISO,
  addMonths,
  subMonths,
  addDays,
  subDays,
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
  differenceInDays,
  isWithinInterval,
} from "date-fns";
import apiClient from "@/config/api";
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
  ChevronDownIcon,
} from "@heroicons/vue/24/outline";

// KEEP EXISTING IMPORTS
import TeamTaskDetailManagerPopup from "@/components/team/TeamTaskDetailManagerPopup.vue";
import EnhancedGanttChart from "@/components/charts/EnhancedGanttChart.vue";
import Toast from "@/components/Toast.vue";
import Draggable from "vuedraggable";
import DeleteConfirmationModal from "@/components/modal/DeleteConfirmationModal.vue";

// ============================================================================
// PROPS - KEEP EXISTING
// ============================================================================
const props = defineProps({
  projectId: {
    type: [Number, String],
    default: null,
  },
});

// ============================================================================
// COMPOSABLES - KEEP EXISTING
// ============================================================================
const { toast, showToast } = useToast();

// ============================================================================
// BASIC STATE - KEEP EXISTING
// ============================================================================
const tasks = ref([]);
const projects = ref([]);
const loading = ref(false);
const selectedTaskId = ref(null);
const showTaskModal = ref(false);
const showDeleteConfirm = ref(false);
const isEditingTask = ref(false);
const taskToDelete = ref(null);
const showTaskDetail = ref(false);

// ============================================================================
// UI STATE - KEEP EXISTING
// ============================================================================
const viewMode = ref("table"); // 'table', 'kanban', 'calendar', 'gantt'
const showFilterModal = ref(false);
const showAssigneeDropdown = ref(false);
const showProjectDropdown = ref(false);
const assigneeSearchText = ref("");
const projectSearchText = ref("");

// ============================================================================
// FILTER STATE - KEEP EXISTING UI REFS
// ============================================================================
const searchQuery = ref("");
const statusFilter = ref("");
const projectFilter = ref("");
const assignedToFilter = ref("");
const departmentFilter = ref("");
const typeFilter = ref("");
const priorityFilter = ref("");
const dueDateFilter = ref({ from: "", to: "" });
const progressFilter = ref({ min: "", max: "" });
const isMyTasksOnly = ref(false);
const isOverdueOnly = ref(false);
const hasDependencies = ref(false);
const isBlocked = ref(false);
const recentDaysFilter = ref("");

// ============================================================================
// NEW: CENTRALIZED FILTER STATE MANAGEMENT
// ============================================================================
const filterState = ref({
  search: "",
  assignedTo: "",
  project: "",
  department: "",
  status: "",
  type: "",
  priority: "",
  dateRange: { from: "", to: "" },
  progress: { min: "", max: "" },
  myTasks: false,
  overdue: false,
  dependencies: false,
  blocked: false,
  recent: "",
});

// ============================================================================
// PAGINATION & SORTING - KEEP EXISTING
// ============================================================================

const sortOptions = ref({
  field: "priority",
  order: "desc",
});

// ============================================================================
// DATA COLLECTIONS - KEEP EXISTING
// ============================================================================
const employees = ref([]);
const departments = ref([]);
const taskTypes = ref([
  { id: 1, name: "Feature" },
  { id: 2, name: "Bug" },
  { id: 3, name: "Enhancement" },
  { id: 4, name: "Documentation" },
  { id: 5, name: "Research" },
]);

// ============================================================================
// CALENDAR STATE - KEEP EXISTING
// ============================================================================
const currentDate = ref(new Date());
const calendarView = ref("month");
const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// ============================================================================
// TASK FORM STATE - KEEP EXISTING
// ============================================================================
const currentTask = ref({
  name: "",
  project_id: "",
  assigned_to: [],
  planned_date_start: "",
  planned_date_end: "",
  planned_time_start: "",
  planned_time_end: "",
  planned_hours: "",
  description: "",
  state: "draft",
  progress: 0,
  priority: "1",
  type_id: "",
  reviewer_id: "",
  depends_on_ids: [],
  blocked_by_id: "",
});

const formErrors = ref([]);
const isSubmitting = ref(false);
const isUsingRichEditor = ref(false);

// ============================================================================
// NEW: FILTER MANAGEMENT FUNCTIONS
// ============================================================================

// NEW: Sync filter state with UI values
const syncFilterState = () => {
  filterState.value = {
    search: searchQuery.value,
    assignedTo: assignedToFilter.value,
    project: projectFilter.value,
    department: departmentFilter.value,
    status: statusFilter.value,
    type: typeFilter.value,
    priority: priorityFilter.value,
    dateRange: {
      from: dueDateFilter.value.from,
      to: dueDateFilter.value.to,
    },
    progress: {
      min: progressFilter.value.min,
      max: progressFilter.value.max,
    },
    myTasks: isMyTasksOnly.value,
    overdue: isOverdueOnly.value,
    dependencies: hasDependencies.value,
    blocked: isBlocked.value,
    recent: recentDaysFilter.value,
  };
};

// NEW: Build consistent filter parameters
const buildFilterParams = () => {
  const params = {};

  // Search
  if (filterState.value.search) {
    params.search = filterState.value.search;
  }

  // Assignee
  if (filterState.value.assignedTo) {
    params.assigned_to = [parseInt(filterState.value.assignedTo)];
  }

  // Department
  if (filterState.value.department) {
    params.department_ids = [parseInt(filterState.value.department)];
  }

  // Project
  if (filterState.value.project) {
    params.project_id = parseInt(filterState.value.project);
  }

  // Status
  if (filterState.value.status) {
    params.state = filterState.value.status;
  }

  // Type
  if (filterState.value.type) {
    params.type_id = parseInt(filterState.value.type);
  }

  // Priority
  if (filterState.value.priority) {
    params.priority = filterState.value.priority;
  }

  // Date Range - CONSISTENT for all views
  if (filterState.value.dateRange.from) {
    params.date_start = filterState.value.dateRange.from;
    params.due_date_from = filterState.value.dateRange.from; // Backward compatibility
  }

  if (filterState.value.dateRange.to) {
    params.date_end = filterState.value.dateRange.to;
    params.due_date_to = filterState.value.dateRange.to; // Backward compatibility
  }

  // Progress Range
  if (filterState.value.progress.min) {
    params.progress_min = filterState.value.progress.min;
  }

  if (filterState.value.progress.max) {
    params.progress_max = filterState.value.progress.max;
  }

  // Boolean Filters
  if (filterState.value.myTasks) {
    params.my_tasks = "true";
  }

  if (filterState.value.overdue) {
    params.is_overdue = "true";
  }

  if (filterState.value.dependencies) {
    params.has_dependencies = "true";
  }

  if (filterState.value.blocked) {
    params.is_blocked = "true";
  }

  if (filterState.value.recent) {
    params.recent_days = filterState.value.recent;
  }

  // Sorting - Consistent
  params.sort_field = sortOptions.value.field;
  params.sort_order = sortOptions.value.order;

  return params;
};

// ============================================================================
// UPDATED: UNIFIED FETCH FUNCTION
// ============================================================================
const fetchTasks = async (isInitialLoad = false, forceRefresh = false) => {
  try {
    loading.value = true;

    // CONSISTENT: Use same parameters for all view modes
    const operation = viewMode.value === "gantt" ? "gantt_list" : "list";

    // Sync filter state before building params
    syncFilterState();

    const payload = {
      jsonrpc: "2.0",
      method: "call",
      params: {
        operation: operation,
        // REMOVED: No pagination for task view - get all tasks
        // FILTERS: Apply consistently for all views
        ...buildFilterParams(),
      },
    };

    // Debug logging
    console.log(
      `[${viewMode.value.toUpperCase()}] Fetching with params:`,
      payload.params
    );

    const response = await apiClient.post("/web/v2/team/tasks", payload);

    if (response.data.result?.status === "success") {
      const newTasks = response.data.result.data || [];

      // CONSISTENCY: Ensure same data across all views
      tasks.value = newTasks;

      console.log(
        `[${viewMode.value.toUpperCase()}] Loaded ${newTasks.length} tasks`
      );

      // Show success message only if not initial load
      if (!isInitialLoad && !forceRefresh) {
        showToast({
          message: `${newTasks.length} tasks loaded in ${viewMode.value} view`,
          type: "success",
        });
      }
    } else {
      throw new Error(response.data.result?.message || "Failed to load tasks");
    }
  } catch (error) {
    console.error(`Error fetching tasks (${viewMode.value}):`, error);
    showToast({
      message: error.message || "Failed to load tasks",
      type: "error",
    });
  } finally {
    loading.value = false;
  }
};

// ============================================================================
// NEW: ENHANCED FILTER ACTIONS
// ============================================================================

// NEW: Apply filters with state sync
const applyFilters = () => {
  syncFilterState();
  // REMOVED: No pagination reset needed
  fetchTasks(false, true); // Force refresh
  showFilterModal.value = false;
};

// UPDATED: Clear all filters with state sync
const clearAllFilters = () => {
  // Reset all filter values
  searchQuery.value = "";
  assignedToFilter.value = "";
  assigneeSearchText.value = "";
  projectFilter.value = "";
  projectSearchText.value = "";
  departmentFilter.value = "";
  statusFilter.value = "";
  typeFilter.value = "";
  priorityFilter.value = "";
  dueDateFilter.value = { from: "", to: "" };
  progressFilter.value = { min: "", max: "" };
  isMyTasksOnly.value = false;
  isOverdueOnly.value = false;
  hasDependencies.value = false;
  isBlocked.value = false;
  recentDaysFilter.value = "";

  // Sync and fetch
  syncFilterState();
  // REMOVED: No pagination reset needed
  fetchTasks(false, true);
  showFilterModal.value = false;
};

// NEW: Enhanced Gantt date range handler
const handleDateRangeUpdate = (dateRange) => {
  if (dateRange && dateRange.start && dateRange.end) {
    console.log("Date range updated from Gantt:", dateRange);

    // Update filter state
    filterState.value.dateRange = {
      from: dateRange.start,
      to: dateRange.end,
    };

    // Update UI filters
    dueDateFilter.value = {
      from: dateRange.start,
      to: dateRange.end,
    };

    // Fetch with updated date range
    fetchTasks(false, true);
  }
};

// NEW: Debounced filter application
const createDebounceFn = (fn, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
};

const debouncedApplyFilters = createDebounceFn(() => {
  applyFilters();
}, 300);

// ============================================================================
// COMPUTED PROPERTIES - KEEP EXISTING + ADD NEW
// ============================================================================

// KEEP EXISTING: Filtered tasks
const filteredTasks = computed(() => {
  return tasks.value;
});

// KEEP EXISTING: Active filter count
const activeFilterCount = computed(() => {
  let count = 0;
  const activeFilters = [];

  if (searchQuery.value && searchQuery.value.trim()) {
    count++;
    activeFilters.push("search");
  }
  if (assignedToFilter.value) {
    count++;
    activeFilters.push("assignee");
  }
  if (projectFilter.value) {
    count++;
    activeFilters.push("project");
  }
  if (departmentFilter.value) {
    count++;
    activeFilters.push("department");
  }
  if (statusFilter.value) {
    count++;
    activeFilters.push("status");
  }
  if (typeFilter.value) {
    count++;
    activeFilters.push("type");
  }
  if (priorityFilter.value) {
    count++;
    activeFilters.push("priority");
  }
  if (dueDateFilter.value.from || dueDateFilter.value.to) {
    count++;
    activeFilters.push("dateRange");
  }
  if (progressFilter.value.min || progressFilter.value.max) {
    count++;
    activeFilters.push("progress");
  }
  if (isMyTasksOnly.value) {
    count++;
    activeFilters.push("myTasks");
  }
  if (isOverdueOnly.value) {
    count++;
    activeFilters.push("overdue");
  }
  if (hasDependencies.value) {
    count++;
    activeFilters.push("dependencies");
  }
  if (isBlocked.value) {
    count++;
    activeFilters.push("blocked");
  }
  if (recentDaysFilter.value) {
    count++;
    activeFilters.push("recent");
  }

  console.log(`💡 Active filter count: ${count}`, activeFilters); // Debug log
  return count;
});

// KEEP EXISTING: Filtered employees
const filteredEmployees = computed(() => {
  if (!assigneeSearchText.value) {
    return employees.value;
  }

  const searchText = assigneeSearchText.value.toLowerCase();
  return employees.value.filter((employee) =>
    employee.name.toLowerCase().includes(searchText)
  );
});

// KEEP EXISTING: Filtered projects
const filteredProjects = computed(() => {
  if (!projectSearchText.value) {
    return projects.value;
  }

  const searchText = projectSearchText.value.toLowerCase();
  return projects.value.filter((project) =>
    project.name.toLowerCase().includes(searchText)
  );
});

// KEEP EXISTING: Kanban columns
const draftTasks = computed(() => {
  return filteredTasks.value.filter((task) => task.state === "draft");
});

const plannedTasks = computed(() => {
  return filteredTasks.value.filter((task) => task.state === "planned");
});

const inProgressTasks = computed(() => {
  return filteredTasks.value.filter((task) => task.state === "in_progress");
});

const reviewTasks = computed(() => {
  return filteredTasks.value.filter((task) => task.state === "review");
});

const completedTasks = computed(() => {
  return filteredTasks.value.filter((task) => task.state === "done");
});

const cancelledTasks = computed(() => {
  return filteredTasks.value.filter((task) => task.state === "cancelled");
});

// KEEP EXISTING: Calendar computed properties
const currentMonthName = computed(() => {
  return format(currentDate.value, "MMMM");
});

const currentYear = computed(() => {
  return format(currentDate.value, "yyyy");
});

const calendarDays = computed(() => {
  const monthStart = startOfMonth(currentDate.value);
  const monthEnd = endOfMonth(currentDate.value);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: startDate, end: endDate });

  return days.map((date) => ({
    date,
    day: format(date, "d"),
    isCurrentMonth: isSameMonth(date, currentDate.value),
    isWeekend: isWeekend(date),
    isToday: isToday(date),
  }));
});

const weekViewDays = computed(() => {
  const weekStart = startOfWeek(currentDate.value);

  return Array.from({ length: 7 }, (_, i) => {
    const date = addDays(weekStart, i);
    return {
      date,
      day: format(date, "d"),
      name: format(date, "EEE"),
      isToday: isToday(date),
    };
  });
});

// NEW: Enhanced task count display
const taskCountDisplay = computed(() => {
  const count = tasks.value.length;
  const viewName =
    viewMode.value.charAt(0).toUpperCase() + viewMode.value.slice(1);

  if (activeFilterCount.value > 0) {
    return `${count} tasks (filtered) - ${viewName} View`;
  }

  return `${count} tasks - ${viewName} View`;
});

// ============================================================================
// API FUNCTIONS - KEEP EXISTING
// ============================================================================

// KEEP EXISTING: Fetch projects
const fetchProjects = async () => {
  try {
    const response = await apiClient.post("/web/v2/team/projects/list", {
      jsonrpc: "2.0",
      method: "call",
      id: new Date().getTime(),
      params: {
        page: 1,
        limit: 100,
      },
    });

    if (response.data.result?.status === "success") {
      projects.value = response.data.result.data || [];
    } else {
      showToast({
        message: "Failed to load projects. Please try again.",
        type: "error",
      });
    }
  } catch (error) {
    console.error("Error fetching projects:", error);
    showToast({
      message: "Failed to load projects. Please try again.",
      type: "error",
    });
  }
};

// KEEP EXISTING: Fetch departments
const fetchDepartments = async () => {
  try {
    const response = await apiClient.post("/web/v2/team/tasks/departments", {
      jsonrpc: "2.0",
      method: "call",
    });

    if (response.data.result?.status === "success") {
      departments.value = response.data.result.data || [];
    } else {
      console.error("Error in departments response:", response.data);
    }
  } catch (error) {
    console.error("Error fetching departments:", error);
  }
};

// ============================================================================
// FILTER HELPER FUNCTIONS - KEEP EXISTING + UPDATE
// ============================================================================

// KEEP EXISTING: Select assignee
const selectAssignee = (employee) => {
  assignedToFilter.value = parseInt(employee.id);
  assigneeSearchText.value = employee.name;
  showAssigneeDropdown.value = false;
};

// KEEP EXISTING: Handle assignee search
const handleAssigneeSearch = () => {
  showAssigneeDropdown.value = true;
};

// KEEP EXISTING: Select project
const selectProject = (project) => {
  projectFilter.value = project.id;
  projectSearchText.value = project.name;
  showProjectDropdown.value = false;
};

// KEEP EXISTING: Handle project search
const handleProjectSearch = () => {
  showProjectDropdown.value = true;
};

// UPDATED: Remove single filter
const removeFilter = (key) => {
  console.log(`🗑️ Removing filter: ${key}`);

  switch (key) {
    case "search":
      searchQuery.value = "";
      break;
    case "assignedTo":
      assignedToFilter.value = "";
      assigneeSearchText.value = "";
      break;
    case "project":
      projectFilter.value = "";
      projectSearchText.value = "";
      break;
    case "department":
      departmentFilter.value = "";
      break;
    case "status":
      statusFilter.value = "";
      break;
    case "type":
      typeFilter.value = "";
      break;
    case "priority":
      priorityFilter.value = "";
      break;
    case "dateRange":
      // Reset ke current month jika custom date range
      const today = new Date();
      dueDateFilter.value = {
        from: format(startOfMonth(today), "yyyy-MM-dd"),
        to: format(endOfMonth(today), "yyyy-MM-dd"),
      };
      break;
    case "progress":
      progressFilter.value = { min: "", max: "" };
      break;
    case "myTasks":
      isMyTasksOnly.value = false;
      break;
    case "overdue":
      isOverdueOnly.value = false;
      break;
    case "dependencies":
      hasDependencies.value = false;
      break;
    case "blocked":
      isBlocked.value = false;
      break;
    case "recent":
      recentDaysFilter.value = "";
      break;
    default:
      console.warn(`Unknown filter key: ${key}`);
      return;
  }

  // Sync filter state and re-fetch tasks
  syncFilterState();
  fetchTasks(false, true);

  showToast({
    message: `Filter "${key}" removed`,
    type: "info",
  });
};

// ============================================================================
// TASK INTERACTION FUNCTIONS - KEEP EXISTING
// ============================================================================

// KEEP EXISTING: Select task
const selectTask = (task) => {
  selectedTaskId.value = task.id;
  showTaskDetail.value = true;
};

// KEEP EXISTING: Close task detail
const closeTaskDetail = () => {
  showTaskDetail.value = false;
};

// KEEP EXISTING: Handle task update
const handleTaskUpdate = (updatedTask) => {
  const index = tasks.value.findIndex((t) => t.id === updatedTask.id);
  if (index !== -1) {
    tasks.value[index] = { ...tasks.value[index], ...updatedTask };
  }
};

// ============================================================================
// CALENDAR FUNCTIONS - KEEP EXISTING
// ============================================================================

// KEEP EXISTING: Calendar navigation
function prevMonth() {
  currentDate.value = subMonths(currentDate.value, 1);
}

function nextMonth() {
  currentDate.value = addMonths(currentDate.value, 1);
}

function goToToday() {
  currentDate.value = new Date();
}

// KEEP EXISTING: Get tasks for day
function getTasksForDay(date) {
  if (!date) return [];

  return filteredTasks.value.filter((task) => {
    if (!task.dates?.planned_start && !task.dates?.planned_end) return false;

    let matchesDay = false;

    if (task.dates?.planned_start) {
      const startDate = parseISO(task.dates.planned_start);
      if (isSameDay(startDate, date)) {
        matchesDay = true;
      }
    }

    if (task.dates?.planned_end && !matchesDay) {
      const endDate = parseISO(task.dates.planned_end);
      if (isSameDay(endDate, date)) {
        matchesDay = true;
      }
    }

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

// KEEP EXISTING: Add task for date
function addTaskForDate(date) {
  resetTaskForm();
  currentTask.value.planned_date_start = format(date, "yyyy-MM-dd");
  isEditingTask.value = false;
  showTaskModal.value = true;
}

// ============================================================================
// TASK FORM FUNCTIONS - KEEP EXISTING
// ============================================================================

// KEEP EXISTING: Reset task form
const resetTaskForm = () => {
  formErrors.value = [];
  isUsingRichEditor.value = false;
  currentTask.value = {
    name: "",
    project_id:
      props.projectId ||
      (projects.value.length > 0 ? projects.value[0].id : ""),
    assigned_to: [],
    planned_date_start: "",
    planned_date_end: "",
    planned_time_start: "09:00",
    planned_time_end: "17:00",
    planned_hours: "",
    description: "",
    state: "draft",
    progress: 0,
    priority: "1",
    type_id: "",
    reviewer_id: "",
    depends_on_ids: [],
    blocked_by_id: "",
  };
};

// KEEP EXISTING: Calculate planned hours
const calculatePlannedHours = () => {
  if (
    !currentTask.value.planned_date_start ||
    !currentTask.value.planned_time_start ||
    !currentTask.value.planned_date_end ||
    !currentTask.value.planned_time_end
  ) {
    return;
  }

  const startDateTime = new Date(
    `${currentTask.value.planned_date_start}T${currentTask.value.planned_time_start}:00`
  );

  const endDateTime = new Date(
    `${currentTask.value.planned_date_end}T${currentTask.value.planned_time_end}:00`
  );

  if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
    console.error("Invalid date or time");
    return;
  }

  const diffMs = endDateTime - startDateTime;

  if (diffMs < 0) {
    showToast({
      message: "End time must be after start time",
      type: "error",
    });
    return;
  }

  const diffHours = Math.round((diffMs / (1000 * 60 * 60)) * 10) / 10;
  currentTask.value.planned_hours = diffHours;
};

// KEEP EXISTING: Edit task
const editTask = (task) => {
  showTaskDetail.value = false;
  isEditingTask.value = true;
  formErrors.value = [];
  isUsingRichEditor.value = false;

  const assignedToIds = task.assigned_to.map((person) => person.id);

  let plannedTimeStart = "";
  let plannedTimeEnd = "";
  let plannedDateStart = "";
  let plannedDateEnd = "";

  if (task.dates?.planned_start) {
    const startParts = task.dates.planned_start.split("T");
    plannedDateStart = startParts[0];
    plannedTimeStart = startParts[1]?.substring(0, 5) || "";
  }

  if (task.dates?.planned_end) {
    const endParts = task.dates.planned_end.split("T");
    plannedDateEnd = endParts[0];
    plannedTimeEnd = endParts[1]?.substring(0, 5) || "";
  }

  currentTask.value = {
    id: task.id,
    name: task.name,
    project_id: task.project?.id || "",
    assigned_to: assignedToIds,
    planned_date_start: plannedDateStart,
    planned_date_end: plannedDateEnd,
    planned_time_start: plannedTimeStart,
    planned_time_end: plannedTimeEnd,
    planned_hours: task.hours?.planned || "",
    description: task.description || "",
    state: task.state || "draft",
    progress: task.progress || 0,
    priority: task.priority?.toString() || "1",
    type_id: task.type?.id || "",
    reviewer_id: task.reviewer?.id || "",
    depends_on_ids: task.depends_on?.map((t) => t.id) || [],
    blocked_by_id: task.blocked_by?.id || "",
  };

  showTaskModal.value = true;
};

// KEEP EXISTING: Validate form
const validateForm = () => {
  formErrors.value = [];

  if (!currentTask.value.name.trim()) {
    formErrors.value.push("Task name is required");
  }

  if (!currentTask.value.project_id) {
    formErrors.value.push("Project is required");
  }

  if (
    !currentTask.value.assigned_to ||
    currentTask.value.assigned_to.length === 0
  ) {
    formErrors.value.push("At least one assignee is required");
  }

  if (
    currentTask.value.priority === undefined ||
    currentTask.value.priority === null ||
    currentTask.value.priority === ""
  ) {
    formErrors.value.push("Priority is required");
  }

  if (
    (currentTask.value.planned_date_start ||
      currentTask.value.planned_time_start) &&
    (!currentTask.value.planned_date_start ||
      !currentTask.value.planned_time_start)
  ) {
    formErrors.value.push("Both start date and time must be filled");
  }

  if (
    (currentTask.value.planned_date_end ||
      currentTask.value.planned_time_end) &&
    (!currentTask.value.planned_date_end || !currentTask.value.planned_time_end)
  ) {
    formErrors.value.push("Both end date and time must be filled");
  }

  if (
    currentTask.value.planned_date_start &&
    currentTask.value.planned_date_end
  ) {
    if (
      currentTask.value.planned_time_start &&
      currentTask.value.planned_time_end
    ) {
      const startDate = new Date(
        `${currentTask.value.planned_date_start}T${currentTask.value.planned_time_start}:00`
      );
      const endDate = new Date(
        `${currentTask.value.planned_date_end}T${currentTask.value.planned_time_end}:00`
      );

      if (endDate < startDate) {
        formErrors.value.push("End time must be after start time");
      }
    } else {
      const startDate = new Date(currentTask.value.planned_date_start);
      const endDate = new Date(currentTask.value.planned_date_end);

      if (endDate < startDate) {
        formErrors.value.push("End date must be after start date");
      }
    }
  }

  return formErrors.value.length === 0;
};

// KEEP EXISTING: Submit task
const submitTask = async () => {
  if (!validateForm()) {
    return;
  }

  try {
    isSubmitting.value = true;
    loading.value = true;

    let plannedDateStart = currentTask.value.planned_date_start;
    let plannedDateEnd = currentTask.value.planned_date_end;

    if (plannedDateStart && currentTask.value.planned_time_start) {
      plannedDateStart = `${plannedDateStart} ${currentTask.value.planned_time_start}:00`;
    }

    if (plannedDateEnd && currentTask.value.planned_time_end) {
      plannedDateEnd = `${plannedDateEnd} ${currentTask.value.planned_time_end}:00`;
    }

    const payload = {
      jsonrpc: "2.0",
      method: "call",
      params: {
        operation: isEditingTask.value ? "update" : "create",
        name: currentTask.value.name.trim(),
        project_id: parseInt(currentTask.value.project_id),
        assigned_to: currentTask.value.assigned_to,
        description: currentTask.value.description?.trim() || "",
        state: currentTask.value.state,
        progress: currentTask.value.progress || 0,
        priority: currentTask.value.priority.toString(),
        type_id: currentTask.value.type_id
          ? parseInt(currentTask.value.type_id)
          : null,
        reviewer_id: currentTask.value.reviewer_id
          ? parseInt(currentTask.value.reviewer_id)
          : null,
        depends_on_ids:
          currentTask.value.depends_on_ids?.length > 0
            ? currentTask.value.depends_on_ids
            : null,
        blocked_by_id: currentTask.value.blocked_by_id
          ? parseInt(currentTask.value.blocked_by_id)
          : null,
      },
    };

    if (plannedDateStart) {
      payload.params.planned_date_start = plannedDateStart;
    }
    if (plannedDateEnd) {
      payload.params.planned_date_end = plannedDateEnd;
    }
    if (currentTask.value.planned_hours) {
      payload.params.planned_hours = parseFloat(
        currentTask.value.planned_hours
      );
    }

    if (isEditingTask.value) {
      payload.params.task_id = currentTask.value.id;
    }

    const response = await apiClient.post("/web/v2/team/tasks", payload);

    if (response.data.result?.status === "success") {
      showToast({
        message: `Task ${
          isEditingTask.value ? "updated" : "created"
        } successfully`,
        type: "success",
      });

      resetTaskForm();
      showTaskModal.value = false;
      fetchTasks();

      if (!isEditingTask.value && response.data.result.data?.id) {
        selectedTaskId.value = response.data.result.data.id;
      }
    } else {
      showToast({
        message: "Failed to save task. Please try again.",
        type: "error",
      });
    }
  } catch (error) {
    console.error("Error submitting task:", error);
    showToast({
      message: "Failed to save task. Please try again.",
      type: "error",
    });
  } finally {
    isSubmitting.value = false;
    loading.value = false;
  }
};

// KEEP EXISTING: Close task modal
const closeTaskModal = () => {
  showTaskModal.value = false;
};

// ============================================================================
// DELETE FUNCTIONS - KEEP EXISTING
// ============================================================================

// KEEP EXISTING: Confirm delete task
const confirmDeleteTask = (task) => {
  taskToDelete.value = task;
  showDeleteConfirm.value = true;
};

// KEEP EXISTING: Confirm delete
const confirmDelete = async () => {
  if (!taskToDelete.value) return;

  try {
    loading.value = true;
    const response = await apiClient.post("/web/v2/team/tasks", {
      jsonrpc: "2.0",
      method: "call",
      params: {
        operation: "delete",
        task_id: taskToDelete.value.id,
      },
    });

    if (response.data.result?.status === "success") {
      showToast({
        message: "Task deleted successfully",
        type: "success",
      });

      if (selectedTaskId.value === taskToDelete.value.id) {
        selectedTaskId.value = null;
      }

      fetchTasks();
    } else {
      showToast({
        message: `Error: ${
          response.data.result?.message || "Failed to delete task"
        }`,
        type: "error",
      });
    }
  } catch (error) {
    console.error("Error deleting task:", error);
    showToast({
      message: "Failed to delete task. Please try again.",
      type: "error",
    });
  } finally {
    showDeleteConfirm.value = false;
    taskToDelete.value = null;
    loading.value = false;
  }
};

// ============================================================================
// KANBAN FUNCTIONS - KEEP EXISTING
// ============================================================================

// KEEP EXISTING: Handle drag end
const handleDragEnd = async (event) => {
  try {
    const task = event.item.__draggable_context?.element;
    if (!task) return;

    const newState = event.to.getAttribute("data-state");
    if (!newState || task.state === newState) return;

    loading.value = true;
    const response = await apiClient.post("/web/v2/team/tasks", {
      jsonrpc: "2.0",
      method: "call",
      params: {
        operation: "update",
        task_id: task.id,
        state: newState,
        progress: newState === "done" ? 100 : task.progress,
        auto_timesheet: true,
      },
    });

    if (response.data.result?.status === "success") {
      showToast({
        message: "Task status updated successfully",
        type: "success",
      });
      fetchTasks();
    } else {
      showToast({
        message: "Failed to update task status",
        type: "error",
      });
      fetchTasks();
    }
  } catch (error) {
    console.error("Error updating task status:", error);
    showToast({
      message: "Failed to update task status",
      type: "error",
    });
    fetchTasks();
  } finally {
    loading.value = false;
  }
};

// ============================================================================
// HELPER FUNCTIONS - KEEP EXISTING
// ============================================================================

// KEEP EXISTING: Get initials
const getInitials = (name) => {
  if (!name) return "";
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
};

// KEEP EXISTING: Format status
const formatStatus = (status) => {
  const statusMap = {
    draft: "Draft",
    planned: "Planned",
    in_progress: "In Progress",
    review: "In Review",
    done: "Completed",
    cancelled: "Cancelled",
  };
  return statusMap[status] || status;
};

// KEEP EXISTING: Get status class
const getStatusClass = (status) => {
  const classMap = {
    draft: "bg-gray-100 text-gray-800",
    planned: "bg-blue-100 text-blue-800",
    in_progress: "bg-yellow-100 text-yellow-800",
    review: "bg-purple-100 text-purple-800",
    done: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };
  return classMap[status] || "bg-gray-100 text-gray-800";
};

// KEEP EXISTING: Format date
const formatDate = (dateString) => {
  if (!dateString) return "";
  try {
    return format(parseISO(dateString), "MMM d, yyyy");
  } catch (e) {
    return dateString;
  }
};

// KEEP EXISTING: Format priority
const formatPriority = (priority) => {
  const priorityMap = {
    0: "Low (P3)",
    1: "Medium (P2)",
    2: "High (P1)",
    3: "Critical (P0)",
  };
  return priorityMap[priority] || "Medium";
};

// KEEP EXISTING: Get status color
function getStatusColor(status) {
  const colorMap = {
    draft: "gray",
    planned: "blue",
    in_progress: "yellow",
    review: "purple",
    done: "green",
    cancelled: "red",
  };
  return colorMap[status] || "gray";
}

// KEEP EXISTING: Get project team members
const getProjectTeamMembers = (projectId) => {
  if (!projectId) return [];

  const selectedProject = projects.value.find(
    (p) => p.id === parseInt(projectId)
  );
  if (!selectedProject || !selectedProject.team) return [];

  const allMembers = [];

  if (selectedProject.team.manager) {
    allMembers.push(selectedProject.team.manager);
  }

  if (selectedProject.team.members && selectedProject.team.members.length > 0) {
    allMembers.push(...selectedProject.team.members);
  }

  return allMembers;
};

// KEEP EXISTING: Get project tasks
const getProjectTasks = (projectId) => {
  if (!projectId) return [];

  return tasks.value.filter(
    (task) => task.project && task.project.id === parseInt(projectId)
  );
};

// ============================================================================
// NEW: DEBUGGING AND VALIDATION
// ============================================================================

const displayedFilters = computed(() => {
  const filters = [];

  // 1. Month Filter - Always show if date filter exists
  if (dueDateFilter.value.from && dueDateFilter.value.to) {
    try {
      const startDate = parseISO(dueDateFilter.value.from);
      const endDate = parseISO(dueDateFilter.value.to);

      // Check if it's a full month
      const isFullMonth =
        format(startDate, "yyyy-MM-dd") ===
          format(startOfMonth(startDate), "yyyy-MM-dd") &&
        format(endDate, "yyyy-MM-dd") ===
          format(endOfMonth(startDate), "yyyy-MM-dd");

      if (isFullMonth) {
        filters.push({
          key: "month",
          label: "📅 Month",
          value: format(startDate, "MMMM yyyy"),
          removable: false,
        });
      } else {
        filters.push({
          key: "dateRange",
          label: "📅 Date Range",
          value: `${format(startDate, "MMM d")} - ${format(endDate, "MMM d")}`,
          removable: true,
        });
      }
    } catch (e) {
      console.error("Error parsing date filter:", e);
    }
  }

  // 2. Search Filter
  if (searchQuery.value && searchQuery.value.trim()) {
    filters.push({
      key: "search",
      label: "🔍 Search",
      value: searchQuery.value.trim(),
      removable: true,
    });
  }

  // 3. Project Filter
  if (projectFilter.value) {
    const project = projects.value.find((p) => p.id == projectFilter.value);
    filters.push({
      key: "project",
      label: "📁 Project",
      value: project?.name || `Project ID: ${projectFilter.value}`,
      removable: true,
    });
  }

  // 4. Department Filter
  if (departmentFilter.value) {
    const department = departments.value.find(
      (d) => d.id == departmentFilter.value
    );
    filters.push({
      key: "department",
      label: "🏢 Department",
      value: department?.name || `Department ID: ${departmentFilter.value}`,
      removable: true,
    });
  }

  // 5. Assignee Filter
  if (assignedToFilter.value) {
    const employee = employees.value.find(
      (e) => e.id == assignedToFilter.value
    );
    filters.push({
      key: "assignedTo",
      label: "👤 Assignee",
      value: employee?.name || `User ID: ${assignedToFilter.value}`,
      removable: true,
    });
  }

  // 6. Status Filter
  if (statusFilter.value) {
    filters.push({
      key: "status",
      label: "🏷️ Status",
      value: formatStatus(statusFilter.value),
      removable: true,
    });
  }

  // 7. Type Filter
  if (typeFilter.value) {
    const type = taskTypes.value.find((t) => t.id == typeFilter.value);
    filters.push({
      key: "type",
      label: "📋 Type",
      value: type?.name || `Type ID: ${typeFilter.value}`,
      removable: true,
    });
  }

  // 8. Priority Filter
  if (priorityFilter.value) {
    filters.push({
      key: "priority",
      label: "🔥 Priority",
      value: formatPriority(priorityFilter.value),
      removable: true,
    });
  }

  // 9. Progress Range Filter
  if (progressFilter.value.min || progressFilter.value.max) {
    let progressValue = "";
    if (progressFilter.value.min && progressFilter.value.max) {
      progressValue = `${progressFilter.value.min}% - ${progressFilter.value.max}%`;
    } else if (progressFilter.value.min) {
      progressValue = `≥ ${progressFilter.value.min}%`;
    } else {
      progressValue = `≤ ${progressFilter.value.max}%`;
    }

    filters.push({
      key: "progress",
      label: "📊 Progress",
      value: progressValue,
      removable: true,
    });
  }

  // 10. Boolean Filters
  if (isMyTasksOnly.value) {
    filters.push({
      key: "myTasks",
      label: "👨‍💼 My Tasks",
      value: "Only my tasks",
      removable: true,
    });
  }

  if (isOverdueOnly.value) {
    filters.push({
      key: "overdue",
      label: "⏰ Overdue",
      value: "Overdue only",
      removable: true,
    });
  }

  if (hasDependencies.value) {
    filters.push({
      key: "dependencies",
      label: "🔗 Dependencies",
      value: "Has dependencies",
      removable: true,
    });
  }

  if (isBlocked.value) {
    filters.push({
      key: "blocked",
      label: "🚫 Blocked",
      value: "Is blocked",
      removable: true,
    });
  }

  // 11. Recent Activity Filter
  if (recentDaysFilter.value) {
    let recentValue = "";
    switch (recentDaysFilter.value) {
      case "1":
        recentValue = "Last 24 hours";
        break;
      case "7":
        recentValue = "Last 7 days";
        break;
      case "30":
        recentValue = "Last 30 days";
        break;
      case "90":
        recentValue = "Last 3 months";
        break;
      default:
        recentValue = `Last ${recentDaysFilter.value} days`;
    }

    filters.push({
      key: "recent",
      label: "🕐 Recent",
      value: recentValue,
      removable: true,
    });
  }

  console.log("💡 Active filters:", filters); // Debug log
  return filters;
});

const debugFilters = () => {
  console.log("🐛 DEBUG FILTERS:");
  console.log("searchQuery:", searchQuery.value);
  console.log("assignedToFilter:", assignedToFilter.value);
  console.log("projectFilter:", projectFilter.value);
  console.log("departmentFilter:", departmentFilter.value);
  console.log("statusFilter:", statusFilter.value);
  console.log("typeFilter:", typeFilter.value);
  console.log("priorityFilter:", priorityFilter.value);
  console.log("dueDateFilter:", dueDateFilter.value);
  console.log("progressFilter:", progressFilter.value);
  console.log("isMyTasksOnly:", isMyTasksOnly.value);
  console.log("isOverdueOnly:", isOverdueOnly.value);
  console.log("hasDependencies:", hasDependencies.value);
  console.log("isBlocked:", isBlocked.value);
  console.log("recentDaysFilter:", recentDaysFilter.value);
  console.log("activeFilterCount:", activeFilterCount.value);
  console.log("displayedFilters:", displayedFilters.value);
};

// Expose debug function to window for browser console
if (typeof window !== "undefined") {
  window.debugFilters = debugFilters;
}

const getDepartmentName = (departmentId) => {
  const department = departments.value.find((dept) => dept.id == departmentId);
  return department ? department.name : "Unknown Department";
};

const clearSingleFilter = (filterName) => {
  removeFilter(filterName);
};

const handleTaskDetailView = (task) => {
  selectTask(task);
};

// NEW: Validation for debugging
const validateTaskConsistency = () => {
  const currentCount = tasks.value.length;
  const currentView = viewMode.value;

  console.log(`[VALIDATION] ${currentView} view has ${currentCount} tasks`);
  console.log(`[VALIDATION] Active filters:`, activeFilterCount.value);
  console.log(`[VALIDATION] Filter state:`, filterState.value);

  if (tasks.value.length > 0) {
    console.log(
      `[VALIDATION] Sample tasks:`,
      tasks.value.slice(0, 5).map((t) => ({
        id: t.id,
        name: t.name,
        status: t.state,
        dates: t.dates,
      }))
    );
  }
};

// ============================================================================
// WATCHERS - UPDATED + NEW
// ============================================================================

// UPDATED: Enhanced view mode watcher
watch(viewMode, async (newMode, oldMode) => {
  if (newMode !== oldMode) {
    console.log(`Switching from ${oldMode} to ${newMode} view`);

    // REMOVED: No pagination reset needed
    // Fetch with force refresh to ensure consistency
    await fetchTasks(false, true);
  }
});

// NEW: Watch individual filters for auto-apply
watch([searchQuery, assignedToFilter, statusFilter], () => {
  if (!loading.value) {
    debouncedApplyFilters();
  }
});

// NEW: Call validation after every fetch
watch(
  () => tasks.value.length,
  () => {
    validateTaskConsistency();
  }
);

// KEEP EXISTING: Watch for changes in projectId
watch(
  () => props.projectId,
  (newProjectId) => {
    if (newProjectId) {
      fetchTasks();
      currentTask.value.project_id = newProjectId;
    }
  }
);

// KEEP EXISTING: Watch for assignedToFilter changes
watch(assignedToFilter, () => {
  fetchTasks();
});

// KEEP EXISTING: Watch for project changes
watch(
  () => currentTask.value.project_id,
  (newProjectId) => {
    if (newProjectId) {
      console.log(
        "Project changed, department ID:",
        getProjectDepartmentId(newProjectId)
      );
    }
  }
);

// KEEP EXISTING: Watch for date/time changes
watch(
  [
    () => currentTask.value.planned_date_start,
    () => currentTask.value.planned_time_start,
    () => currentTask.value.planned_date_end,
    () => currentTask.value.planned_time_end,
  ],
  () => {
    calculatePlannedHours();
  }
);

// KEEP EXISTING: Watch for task changes
watch([() => tasks.value.length, () => viewMode.value], ([taskCount, mode]) => {
  console.log(`View: ${mode}, Tasks: ${taskCount}`);
  if (mode === "gantt") {
    const tasksWithDates = tasks.value.filter((task) => {
      const hasStartDate =
        task.dates?.planned_start || task.start || task.startDate;
      const hasEndDate = task.dates?.planned_end || task.end || task.endDate;
      return hasStartDate || hasEndDate;
    });
    console.log(`Gantt view: ${tasksWithDates.length} tasks have dates`);
  }
});

// ============================================================================
// LIFECYCLE HOOKS
// ============================================================================
onMounted(async () => {
  await Promise.all([fetchProjects(), fetchDepartments()]);

  // Set default date range (from 7 days ago to 14 days ahead)
  const today = new Date();
  dueDateFilter.value = {
    from: format(subDays(today, 14), "yyyy-MM-dd"),
    end: format(addDays(today, 14), "yyyy-MM-dd"),
  };

  // Initial fetch
  await fetchTasks(true);

  // Set the project default in the task form
  if (props.projectId && projects.value.length > 0) {
    resetTaskForm();
    currentTask.value.project_id = props.projectId;
  }

  // Set current dates for calendar
  currentDate.value = new Date();
});

// ============================================================================
// UTILITY FUNCTIONS FOR MISSING FUNCTIONS
// ============================================================================

// Helper function if missing
const getProjectDepartmentId = (projectId) => {
  if (!projectId) return null;

  const selectedProject = projects.value.find(
    (p) => p.id === parseInt(projectId)
  );
  return selectedProject?.department?.id || null;
};

// Clear filters fallback
const clearFilters = () => {
  clearAllFilters();
};
</script>

<style scoped>
/* Enhanced styles untuk active filters */
.filter-badge {
  transition: all 0.2s ease;
}

.filter-badge:hover {
  transform: translateY(-1px);
  shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.remove-filter-btn {
  transition: all 0.15s ease;
}

.remove-filter-btn:hover {
  transform: scale(1.1);
}

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
