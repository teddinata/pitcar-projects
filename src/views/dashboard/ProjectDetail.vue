<!-- src/views/dashboard/ProjectDetail.vue -->
<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
    <Toast
      v-model:show="toast.show"
      :message="toast.message"
      :type="toast.type"
      :duration="toast.duration"
    />

    <!-- Header -->
    <div class="bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20 sticky top-0 z-40">
      <div class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
          <!-- Left Side - Back Button & Project Info -->
          <div class="flex items-center space-x-4">
            <button 
              @click="router.back()" 
              class="group p-3 hover:bg-white/60 rounded-xl transition-all duration-200 border border-transparent hover:border-slate-200"
            >
              <ArrowLeft class="w-5 h-5 text-slate-600 group-hover:text-slate-800 transition-colors" />
            </button>
            
            <div class="flex items-center space-x-4">
              <div class="relative">
                <div class="absolute -inset-1 bg-gradient-to-r from-rose-600 to-violet-600 rounded-lg blur opacity-25"></div>
                <div class="relative bg-white rounded-lg p-3">
                  <Folder class="w-8 h-8 text-slate-700" />
                </div>
              </div>
              <div>
                <h1 class="text-2xl sm:text-3xl font-bold text-slate-900">{{ project?.name }}</h1>
                <div class="flex items-center space-x-2 mt-1">
                  <span class="text-sm text-slate-500">{{ project?.code }}</span>
                  <div class="w-1 h-1 bg-slate-300 rounded-full"></div>
                  <span class="text-sm text-slate-500">{{ totalTasksCount }} tasks</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Side - Status & Actions -->
          <div class="flex items-center space-x-3">
            <!-- Project Status Badge -->
            <div
              class="px-4 py-2 text-sm font-semibold rounded-xl shadow-sm"
              :class="{
                'bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 border border-amber-200': project?.state === 'in_progress',
                'bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 border border-emerald-200': project?.state === 'completed',
                'bg-gradient-to-r from-slate-100 to-gray-100 text-slate-800 border border-slate-200': project?.state === 'draft',
                'bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border border-red-200': project?.state === 'cancelled'
              }"
            >
              <div class="flex items-center space-x-2">
                <div 
                  class="w-2 h-2 rounded-full"
                  :class="{
                    'bg-amber-500': project?.state === 'in_progress',
                    'bg-emerald-500': project?.state === 'completed',
                    'bg-slate-500': project?.state === 'draft',
                    'bg-red-500': project?.state === 'cancelled'
                  }"
                ></div>
                <span>{{ formatState(project?.state) }}</span>
              </div>
            </div>
            
            <!-- Project Actions Dropdown -->
            <div class="relative" ref="actionsDropdownRef">
              <button
                @click="isActionsOpen = !isActionsOpen"
                class="inline-flex items-center px-4 py-2 bg-white/60 backdrop-blur-sm border border-slate-200 rounded-xl shadow-sm text-sm font-medium text-slate-700 hover:bg-white hover:shadow-md transition-all duration-200"
              >
                <Settings class="w-4 h-4 mr-2" />
                Actions
                <ChevronDown class="w-4 h-4 ml-1 transition-transform duration-200" :class="{ 'rotate-180': isActionsOpen }" />
              </button>
              
              <!-- Actions Dropdown Menu -->
              <Transition
                enter-active-class="transition ease-out duration-200"
                enter-from-class="opacity-0 scale-95"
                enter-to-class="opacity-100 scale-100"
                leave-active-class="transition ease-in duration-150"
                leave-from-class="opacity-100 scale-100"
                leave-to-class="opacity-0 scale-95"
              >
                <div 
                  v-if="isActionsOpen"
                  class="absolute right-0 mt-2 w-56 bg-white/95 backdrop-blur-md rounded-xl shadow-xl z-50 border border-white/20"
                >
                  <div class="py-2">
                    <button
                      @click="showEditModal = true; isActionsOpen = false"
                      class="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 flex items-center transition-colors"
                    >
                      <Pencil class="w-4 h-4 mr-3 text-slate-500" />
                      Edit Project
                    </button>
                    
                    <button
                      @click="confirmDelete(); isActionsOpen = false"
                      class="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center transition-colors"
                    >
                      <Trash2 class="w-4 h-4 mr-3 text-red-500" />
                      Delete Project
                    </button>
                  </div>
                </div>
              </Transition>
            </div>
            
            <!-- Create Task Button -->
            <button
              @click="showCreateTaskModal = true"
              class="group relative inline-flex items-center px-6 py-3 bg-gradient-to-r from-rose-600 to-violet-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 font-medium"
            >
              <div class="absolute inset-0 bg-gradient-to-r from-rose-600 to-violet-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition-opacity"></div>
              <div class="relative flex items-center">
                <Plus class="w-4 h-4 mr-2" />
                New Task
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600"></div>
      <span class="ml-3 text-slate-600">Loading project details...</span>
    </div>

    <!-- Main Content -->
    <main v-else class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Stats Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- Days Remaining Card -->
        <div class="group relative bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20 hover:shadow-xl transition-all duration-300">
          <div class="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 rounded-2xl"></div>
          <div class="relative">
            <div class="flex justify-between items-start">
              <div>
                <p class="text-sm font-medium text-slate-600 mb-1">Days Remaining</p>
                <p class="text-3xl font-bold" :class="{'text-red-600': daysRemaining < 0, 'text-emerald-600': daysRemaining >= 7, 'text-amber-600': daysRemaining >= 0 && daysRemaining < 7}">
                  {{ daysRemaining >= 0 ? daysRemaining : 'Overdue' }}
                </p>
                <p class="text-xs text-slate-500 mt-1">
                  {{ daysRemaining < 0 ? 'Project is overdue' : daysRemaining === 0 ? 'Due today' : 'days left' }}
                </p>
              </div>
              <div class="rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 p-3 group-hover:scale-110 transition-transform duration-300">
                <Clock class="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>
        
        <!-- Progress Card -->
        <div class="group relative bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20 hover:shadow-xl transition-all duration-300">
          <div class="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-green-50/50 rounded-2xl"></div>
          <div class="relative">
            <div class="flex justify-between items-start">
              <div>
                <p class="text-sm font-medium text-slate-600 mb-1">Progress</p>
                <p class="text-3xl font-bold text-emerald-600">{{ projectProgress }}%</p>
                <div class="w-20 bg-slate-200 rounded-full h-2 mt-2">
                  <div
                    class="h-2 rounded-full bg-gradient-to-r from-emerald-500 to-green-500 transition-all duration-1000 ease-out"
                    :style="{ width: `${projectProgress}%` }"
                  ></div>
                </div>
              </div>
              <div class="rounded-2xl bg-gradient-to-br from-emerald-100 to-green-100 p-3 group-hover:scale-110 transition-transform duration-300">
                <TrendingUp class="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </div>
        </div>
        
        <!-- Total Tasks Card -->
        <div class="group relative bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20 hover:shadow-xl transition-all duration-300">
          <div class="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-violet-50/50 rounded-2xl"></div>
          <div class="relative">
            <div class="flex justify-between items-start">
              <div>
                <p class="text-sm font-medium text-slate-600 mb-1">Total Tasks</p>
                <p class="text-3xl font-bold text-purple-600">{{ totalTasksCount }}</p>
                <p class="text-xs text-slate-500 mt-1">
                  {{ pendingTasksCount }} pending
                </p>
              </div>
              <div class="rounded-2xl bg-gradient-to-br from-purple-100 to-violet-100 p-3 group-hover:scale-110 transition-transform duration-300">
                <ListChecks class="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>
        
        <!-- Completed Tasks Card -->
        <div class="group relative bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20 hover:shadow-xl transition-all duration-300">
          <div class="absolute inset-0 bg-gradient-to-br from-rose-50/50 to-pink-50/50 rounded-2xl"></div>
          <div class="relative">
            <div class="flex justify-between items-start">
              <div>
                <p class="text-sm font-medium text-slate-600 mb-1">Completed</p>
                <p class="text-3xl font-bold text-rose-600">{{ completedTasksCount }}</p>
                <p class="text-xs text-slate-500 mt-1">
                  {{ completionRate }}% completion rate
                </p>
              </div>
              <div class="rounded-2xl bg-gradient-to-br from-rose-100 to-pink-100 p-3 group-hover:scale-110 transition-transform duration-300">
                <CheckCircle class="h-6 w-6 text-rose-600" />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left Column - Progress & Tasks -->
        <div class="lg:col-span-2 space-y-8">
          <!-- Progress Overview Section -->
          <div class="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-white/20">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-bold text-slate-900">Progress Overview</h2>
              <div class="flex items-center space-x-2 text-sm text-slate-500">
                <Calendar class="w-4 h-4" />
                <span>{{ formatDate(project?.dates?.start) }} - {{ formatDate(project?.dates?.end) }}</span>
              </div>
            </div>
            
            <!-- Overall Progress Bar -->
            <div class="mb-8">
              <div class="flex justify-between items-center mb-3">
                <span class="text-lg font-semibold text-slate-700">Overall Progress</span>
                <span class="text-2xl font-bold text-slate-900">{{ projectProgress }}%</span>
              </div>
              <div class="relative">
                <div class="w-full bg-slate-200 rounded-full h-4 overflow-hidden">
                  <div
                    class="h-full rounded-full bg-gradient-to-r from-rose-500 via-purple-500 to-indigo-500 transition-all duration-1000 ease-out relative"
                    :style="{ width: `${projectProgress}%` }"
                  >
                    <div class="absolute inset-0 bg-white/20 animate-pulse"></div>
                  </div>
                </div>
                <div class="absolute top-full mt-2 flex justify-between text-xs text-slate-500">
                  <span>Started</span>
                  <span v-if="projectProgress >= 50">Half way</span>
                  <span>Complete</span>
                </div>
              </div>
            </div>

            <!-- Content Progress Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Video Progress -->
              <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                <div class="flex items-center space-x-3 text-blue-700 mb-4">
                  <div class="p-2 bg-blue-100 rounded-xl">
                    <Video class="w-5 h-5" />
                  </div>
                  <span class="font-semibold">Video Content</span>
                </div>
                <div class="space-y-3">
                  <div class="flex justify-between text-sm">
                    <span class="text-slate-600">Completed</span>
                    <span class="font-semibold text-slate-900">
                      {{ completedVideos }}/{{ totalVideoCount }}
                    </span>
                  </div>
                  <div class="w-full bg-blue-200 rounded-full h-3">
                    <div
                      class="h-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-700"
                      :style="{ width: `${videoProgress}%` }"
                    ></div>
                  </div>
                  <div class="text-right text-xs text-blue-600 font-medium">{{ Math.round(videoProgress) }}%</div>
                </div>
              </div>
              
              <!-- Design Progress -->
              <div class="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-6 border border-emerald-100">
                <div class="flex items-center space-x-3 text-emerald-700 mb-4">
                  <div class="p-2 bg-emerald-100 rounded-xl">
                    <Palette class="w-5 h-5" />
                  </div>
                  <span class="font-semibold">Design Content</span>
                </div>
                <div class="space-y-3">
                  <div class="flex justify-between text-sm">
                    <span class="text-slate-600">Completed</span>
                    <span class="font-semibold text-slate-900">
                      {{ completedDesigns }}/{{ totalDesignCount }}
                    </span>
                  </div>
                  <div class="w-full bg-emerald-200 rounded-full h-3">
                    <div
                      class="h-3 rounded-full bg-gradient-to-r from-emerald-500 to-green-500 transition-all duration-700"
                      :style="{ width: `${designProgress}%` }"
                    ></div>
                  </div>
                  <div class="text-right text-xs text-emerald-600 font-medium">{{ Math.round(designProgress) }}%</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Task List Section -->
          <div class="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
            <!-- Task Header -->
            <div class="p-6 border-b border-slate-200">
              <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <h2 class="text-xl font-bold text-slate-900">Tasks</h2>
                
                <!-- Task Filters -->
                <div class="flex items-center space-x-3">
                  <div class="relative">
                    <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      v-model="taskSearch"
                      type="text"
                      placeholder="Search tasks..."
                      class="pl-10 pr-4 py-2 border border-slate-200 rounded-xl bg-white/50 backdrop-blur-sm text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    />
                  </div>
                  
                  <select
                    v-model="taskFilter"
                    class="px-4 py-2 border border-slate-200 rounded-xl bg-white/50 backdrop-blur-sm text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  >
                    <option value="all">All Tasks</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="overdue">Overdue</option>
                    <option value="video">Video</option>
                    <option value="design">Design</option>
                    <option value="revision">In Revision</option>
                    <option value="high_revision">High Revision</option>
                  </select>
                </div>
              </div>
              
              <!-- Overdue Alert -->
              <div v-if="overdueTasksCount > 0" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                <div class="flex items-center space-x-2 text-red-700">
                  <AlertTriangle class="w-4 h-4" />
                  <span class="text-sm font-medium">{{ overdueTasksCount }} overdue task{{ overdueTasksCount > 1 ? 's' : '' }} require attention</span>
                </div>
              </div>
            </div>

            <!-- Task List Content -->
            <div class="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
              <!-- Loading State -->
              <div v-if="isTasksLoading" class="p-8 text-center">
                <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-rose-600 mx-auto mb-2"></div>
                <p class="text-slate-500">Loading tasks...</p>
              </div>
              
              <!-- Empty State -->
              <div v-else-if="filteredTasks.length === 0" class="p-12 text-center">
                <FolderX class="w-16 h-16 mx-auto text-slate-300 mb-4" />
                <h3 class="text-lg font-medium text-slate-600 mb-2">No tasks found</h3>
                <p class="text-slate-500">Try adjusting your search or filter criteria</p>
              </div>
              
              <!-- Task Items -->
              <div
                v-for="task in filteredTasks"
                :key="task.id"
                @click="openTaskDetail(task)"
                class="group p-6 hover:bg-slate-50/50 transition-all duration-200 cursor-pointer border-l-4 border-transparent hover:border-rose-400"
              >
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <div class="flex items-start space-x-4">
                      <!-- Task Icon -->
                      <div 
                        class="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center mt-1"
                        :class="{
                          'bg-blue-100 text-blue-600': task.content_type === 'video',
                          'bg-emerald-100 text-emerald-600': task.content_type === 'design',
                          'bg-slate-100 text-slate-600': !task.content_type || task.content_type === 'other'
                        }"
                      >
                        <Video v-if="task.content_type === 'video'" class="w-5 h-5" />
                        <Palette v-else-if="task.content_type === 'design'" class="w-5 h-5" />
                        <FileText v-else class="w-5 h-5" />
                      </div>
                      
                      <!-- Task Content -->
                      <div class="flex-1 min-w-0">
                        <h3 class="font-semibold text-slate-900 group-hover:text-rose-600 transition-colors">{{ task.name }}</h3>
                        
                        <!-- Task Meta Info -->
                        <div class="mt-2 flex flex-wrap items-center gap-4 text-sm text-slate-500">
                          <!-- Content Type -->
                          <div class="flex items-center space-x-1">
                            <span
                              class="w-2 h-2 rounded-full"
                              :class="{
                                'bg-blue-500': task.content_type === 'video',
                                'bg-emerald-500': task.content_type === 'design',
                                'bg-slate-500': !task.content_type || task.content_type === 'other'
                              }"
                            ></span>
                            <span class="capitalize">{{ task.content_type || 'Other' }}</span>
                          </div>
                          
                          <!-- Timeline -->
                          <div class="flex items-center space-x-1">
                            <Clock class="w-3.5 h-3.5 text-slate-400" />
                            <span>{{ formatDate(task.dates?.planned_start) }} - {{ formatDate(task.dates?.planned_end) }}</span>
                            <span v-if="isTaskOverdue(task)" class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              <AlertTriangle class="w-3 h-3 mr-1" />
                              Overdue
                            </span>
                          </div>
                          
                          <!-- Revisions Badge -->
                          <div v-if="task.revisions?.count > 0" class="flex items-center">
                            <span 
                              class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                              :class="[task.revisions.excessive ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800']"
                            >
                              <RotateCcw class="w-3 h-3 mr-1" />
                              {{ task.revisions.count }} {{ task.revisions.count === 1 ? 'revision' : 'revisions' }}
                            </span>
                          </div>
                          
                          <!-- Assigned Team -->
                          <div v-if="task.assigned_to?.length" class="flex items-center space-x-1">
                            <Users class="w-3.5 h-3.5 text-slate-400" />
                            <span>{{ task.assigned_to.length }} member{{ task.assigned_to.length > 1 ? 's' : '' }}</span>
                          </div>
                        </div>
                        
                        <!-- Task Progress -->
                        <div class="mt-4">
                          <div class="flex justify-between items-center mb-2">
                            <span class="text-xs font-medium text-slate-600">Progress</span>
                            <span class="text-xs font-bold text-slate-900">{{ task.progress || 0 }}%</span>
                          </div>
                          <div class="w-full bg-slate-200 rounded-full h-2">
                            <div
                              class="h-2 rounded-full transition-all duration-500"
                              :class="{
                                'bg-gradient-to-r from-red-500 to-rose-500': task.progress < 30,
                                'bg-gradient-to-r from-amber-500 to-yellow-500': task.progress >= 30 && task.progress < 70,
                                'bg-gradient-to-r from-emerald-500 to-green-500': task.progress >= 70
                              }"
                              :style="{ width: `${task.progress || 0}%` }"
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Task Status & Avatars -->
                  <div class="flex flex-col items-end space-y-3 ml-4">
                    <!-- Status Badge -->
                    <div
                      class="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-full"
                      :class="{
                        'bg-amber-100 text-amber-800 border border-amber-200': task.state === 'in_progress',
                        'bg-emerald-100 text-emerald-800 border border-emerald-200': task.state === 'done',
                        'bg-slate-100 text-slate-800 border border-slate-200': task.state === 'draft',
                        'bg-orange-100 text-orange-800 border border-orange-200': task.state === 'revision',
                        'bg-purple-100 text-purple-800 border border-purple-200': task.state === 'review'
                      }"
                    >
                      <div 
                        class="w-1.5 h-1.5 rounded-full mr-2"
                        :class="{
                          'bg-amber-500': task.state === 'in_progress',
                          'bg-emerald-500': task.state === 'done',
                          'bg-slate-500': task.state === 'draft',
                          'bg-orange-500': task.state === 'revision',
                          'bg-purple-500': task.state === 'review'
                        }"
                      ></div>
                      {{ formatState(task.state) }}
                    </div>
                    
                    <!-- Assigned Users Avatars -->
                    <div class="flex -space-x-2">
                      <div 
                        v-for="(member, index) in task.assigned_to?.slice(0, 3)" 
                        :key="index"
                        class="h-8 w-8 rounded-full border-2 border-white bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center shadow-sm"
                        :title="member.name"
                      >
                        <span class="text-xs font-semibold text-slate-700">
                          {{ getInitials(member.name) }}
                        </span>
                      </div>
                      <div 
                        v-if="(task.assigned_to?.length || 0) > 3"
                        class="h-8 w-8 rounded-full border-2 border-white bg-gradient-to-br from-rose-100 to-rose-200 flex items-center justify-center shadow-sm"
                        :title="`+${(task.assigned_to?.length || 0) - 3} more`"
                      >
                        <span class="text-xs font-semibold text-rose-700">
                          +{{ (task.assigned_to?.length || 0) - 3 }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column - Project Info & Activity -->
        <div class="space-y-8">
          <!-- Project Details Card -->
          <div class="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-white/20">
            <h2 class="text-xl font-bold text-slate-900 mb-6">Project Details</h2>
            
            <div class="space-y-8">
              <!-- Timeline Section -->
              <div>
                <h3 class="text-sm font-semibold text-slate-700 mb-4 flex items-center">
                  <Calendar class="w-4 h-4 mr-2" />
                  Timeline
                </h3>
                <div class="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-6 space-y-4">
                  <div class="grid grid-cols-2 gap-4 text-sm">
                    <div class="space-y-1">
                      <span class="text-slate-600 font-medium">Start Date</span>
                      <p class="font-semibold text-slate-900">{{ formatDate(project?.dates?.start) }}</p>
                    </div>
                    <div class="space-y-1">
                      <span class="text-slate-600 font-medium">End Date</span>
                      <p
                        class="font-semibold"
                        :class="{
                          'text-red-600': isOverdue(project?.dates?.end),
                          'text-emerald-600': !isOverdue(project?.dates?.end)
                        }"
                      >
                        {{ formatDate(project?.dates?.end) }}
                      </p>
                    </div>
                  </div>
                  
                  <!-- Progress Timeline Visualization -->
                  <div class="pt-4">
                    <div class="relative">
                      <div class="absolute left-0 top-1/2 w-full h-2 bg-slate-200 rounded-full transform -translate-y-1/2"></div>
                      <div 
                        class="absolute left-0 top-1/2 h-2 bg-gradient-to-r from-rose-500 to-violet-500 rounded-full transform -translate-y-1/2 transition-all duration-1000"
                        :style="{ width: `${Math.min(timelineProgress, 100)}%` }"
                      ></div>
                      
                      <!-- Timeline Markers -->
                      <div class="relative z-10 flex justify-between">
                        <div class="flex flex-col items-center">
                          <div class="h-4 w-4 bg-blue-500 rounded-full border-2 border-white shadow-sm"></div>
                          <span class="text-xs text-slate-500 mt-2 font-medium">Start</span>
                        </div>
                        
                        <div class="flex flex-col items-center">
                          <div 
                            class="h-4 w-4 rounded-full border-2 border-white shadow-sm"
                            :class="{ 
                              'bg-emerald-500': project?.state === 'completed',
                              'bg-amber-500': project?.state !== 'completed' && timelineProgress < 100,
                              'bg-red-500': project?.state !== 'completed' && timelineProgress >= 100
                            }"
                          ></div>
                          <span class="text-xs text-slate-500 mt-2 font-medium">End</span>
                        </div>
                      </div>
                      
                      <!-- Today Marker -->
                      <div 
                        v-if="timelineProgress <= 100 && timelineProgress >= 0"
                        class="absolute z-10 top-1/2 transform -translate-y-1/2 transition-all duration-500"
                        :style="{ left: `${Math.min(timelineProgress, 95)}%` }"
                      >
                        <div class="flex flex-col items-center">
                          <div class="h-5 w-5 bg-purple-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
                          <span class="text-xs text-purple-600 mt-2 font-semibold">Today</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Team Section -->
              <div>
                <h3 class="text-sm font-semibold text-slate-700 mb-4 flex items-center">
                  <Users class="w-4 h-4 mr-2" />
                  Team
                </h3>
                <div class="bg-gradient-to-br from-slate-50 to-purple-50 rounded-xl p-6 space-y-6">
                  <!-- Project Manager -->
                  <div v-if="project?.team?.manager">
                    <span class="text-xs font-semibold text-slate-600 uppercase tracking-wide">Project Manager</span>
                    <div class="mt-3 flex items-center space-x-3">
                      <div class="h-12 w-12 rounded-xl bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center shadow-lg">
                        <span class="text-lg font-bold text-white">
                          {{ getInitials(project?.team?.manager?.name) }}
                        </span>
                      </div>
                      <div>
                        <p class="font-semibold text-slate-900">{{ project?.team?.manager?.name }}</p>
                        <p class="text-sm text-slate-600">{{ project?.team?.manager?.position }}</p>
                      </div>
                    </div>
                  </div>

                  <!-- Team Members -->
                  <div v-if="project?.team?.members?.length">
                    <span class="text-xs font-semibold text-slate-600 uppercase tracking-wide">Team Members</span>
                    <div class="mt-3 space-y-3">
                      <div
                        v-for="member in project?.team?.members"
                        :key="member.id"
                        class="flex items-center space-x-3"
                      >
                        <div class="h-10 w-10 rounded-xl bg-gradient-to-br from-slate-300 to-slate-400 flex items-center justify-center shadow-sm">
                          <span class="text-sm font-semibold text-slate-700">
                            {{ getInitials(member.name) }}
                          </span>
                        </div>
                        <div>
                          <p class="font-medium text-slate-900">{{ member.name }}</p>
                          <p class="text-xs text-slate-600">{{ member.position }}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Empty State -->
                  <div v-if="!project?.team?.members?.length && !project?.team?.manager" class="text-center py-6">
                    <Users class="w-12 h-12 mx-auto text-slate-300 mb-3" />
                    <p class="text-sm text-slate-500 italic">No team members assigned</p>
                  </div>
                </div>
              </div>

              <!-- Quick Stats -->
              <div>
                <h3 class="text-sm font-semibold text-slate-700 mb-4 flex items-center">
                  <BarChart2 class="w-4 h-4 mr-2" />
                  Quick Stats
                </h3>
                <div class="grid grid-cols-2 gap-4">
                  <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                    <div class="text-2xl font-bold text-blue-600">{{ overdueTasksCount }}</div>
                    <div class="text-xs text-blue-700 font-medium">Overdue Tasks</div>
                  </div>
                  <div class="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-4 border border-emerald-100">
                    <div class="text-2xl font-bold text-emerald-600">{{ completionRate }}%</div>
                    <div class="text-xs text-emerald-700 font-medium">Completion Rate</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Activity Log -->
          <div class="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
            <div class="p-6 border-b border-slate-200">
              <h2 class="text-xl font-bold text-slate-900 flex items-center">
                <Clock class="w-5 h-5 mr-2" />
                Activity Log
              </h2>
            </div>
            <div class="max-h-96 overflow-y-auto">
              <div class="p-6">
                <ActivityLog type="project" :id="projectId" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Modals Portal -->
    <Teleport to="body">
      <!-- Edit Project Modal -->
      <ProjectFormModal
        v-if="showEditModal"
        :show="showEditModal"
        :project="project"
        @close="showEditModal = false"
        @submit="handleProjectUpdate"
      />

      <!-- Create Task Modal -->
      <TaskFormModal
        v-if="showCreateTaskModal"
        :show="showCreateTaskModal"
        :project-id="projectId"
        :projects="projects"
        @close="showCreateTaskModal = false"
        @submit="handleTaskCreate"
      />
      
      <!-- Task Detail Modal -->
      <TaskDetailModal
        v-if="showTaskDetailModal"
        :show="showTaskDetailModal"
        :task="selectedTask"
        @close="showTaskDetailModal = false"
        @update="handleTaskUpdate"
        @delete="handleTaskDelete"
        @status-update="handleTaskStatusUpdate"
      />

      <!-- Revision Modal -->
      <RevisionModal
        v-if="showRevisionModal"
        :show="showRevisionModal"
        :task="selectedTask"
        @close="showRevisionModal = false"
        @submit="handleRevisionSubmit"
      />

      <!-- Delete Project Confirmation Dialog -->
      <div 
        v-if="showDeleteConfirm" 
        class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
        @click="showDeleteConfirm = false"
      >
        <div class="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl" @click.stop>
          <div class="flex items-center space-x-3 mb-4">
            <div class="p-2 bg-red-100 rounded-xl">
              <AlertTriangle class="w-6 h-6 text-red-600" />
            </div>
            <h3 class="text-lg font-bold text-slate-900">Delete Project</h3>
          </div>
          <p class="text-slate-600 mb-4">
            Are you sure you want to delete "<span class="font-semibold">{{ project?.name }}</span>"?
            <span v-if="totalTasksCount > 0" class="block text-red-600 mt-2 font-medium">
              This project has {{ totalTasksCount }} task(s). Deleting it will require force delete and remove all associated tasks and revisions.
            </span>
          </p>
          <div class="flex justify-end space-x-3">
            <button
              @click="showDeleteConfirm = false"
              class="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              @click="handleDelete(false)"
              :disabled="totalTasksCount > 0"
              class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-xl hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Delete
            </button>
            <button
              v-if="totalTasksCount > 0"
              @click="confirmForceDelete"
              class="px-4 py-2 text-sm font-medium text-white bg-red-800 rounded-xl hover:bg-red-900 transition-colors"
            >
              Force Delete
            </button>
          </div>
        </div>
      </div>

      <!-- Force Delete Confirmation Dialog -->
      <div 
        v-if="showForceDeleteConfirm" 
        class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
        @click="showForceDeleteConfirm = false"
      >
        <div class="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl" @click.stop>
          <div class="flex items-center space-x-3 mb-4">
            <div class="p-2 bg-red-100 rounded-xl">
              <AlertTriangle class="w-6 h-6 text-red-600" />
            </div>
            <h3 class="text-lg font-bold text-slate-900">Force Delete Confirmation</h3>
          </div>
          <div class="mb-6">
            <p class="text-slate-600 mb-3">
              Force deleting "<span class="font-semibold">{{ project?.name }}</span>" will permanently remove:
            </p>
            <ul class="list-disc ml-5 space-y-1 text-sm text-slate-600">
              <li>The project itself</li>
              <li>All {{ totalTasksCount }} tasks</li>
              <li>All associated revisions and history</li>
            </ul>
            <p class="mt-3 text-sm font-semibold text-red-600 bg-red-50 p-3 rounded-xl">
              ⚠️ This action cannot be undone.
            </p>
          </div>
          <div class="flex justify-end space-x-3">
            <button
              @click="showForceDeleteConfirm = false"
              class="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              @click="handleDelete(true)"
              class="px-4 py-2 text-sm font-medium text-white bg-red-800 rounded-xl hover:bg-red-900 transition-colors"
            >
              Confirm Force Delete
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, readonly } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { format, isPast, differenceInDays, parseISO } from 'date-fns'
import { debounce } from 'lodash'

// Icons
import { 
  ArrowLeft, Pencil, Plus, Video, Palette, Trash2, Calendar,
  CheckCircle, BarChart2, Clock, ListChecks, Settings, ChevronDown,
  FolderX, AlertTriangle, Search, Users, TrendingUp, Folder, 
  FileText, RotateCcw
} from 'lucide-vue-next'

// Composables & Utils
import { useToast } from '@/composables/useToast'
import apiClient from '@/config/api'

// Components
import ProjectFormModal from '@/components/projects/ProjectFormModal.vue'
import TaskFormModal from '@/components/tasks/TaskFormModal.vue'
import TaskDetailModal from '@/components/tasks/ProjectTaskDetailModal.vue'
import RevisionModal from '@/components/tasks/RevisionDialog.vue'
import ActivityLog from '@/components/shared/ActivityLog.vue'
import Toast from '@/components/Toast.vue'

// Router & Toast Setup
const route = useRoute()
const router = useRouter()
const { toast, showToast } = useToast()

// ===== REACTIVE STATE =====
const projectId = computed(() => Number(route.params.id))
const project = ref(null)
const projects = ref([])

// Loading States
const isLoading = ref(true)
const isTasksLoading = ref(false)

// Modal States
const showEditModal = ref(false)
const showCreateTaskModal = ref(false)
const showTaskDetailModal = ref(false)
const showRevisionModal = ref(false)
const showDeleteConfirm = ref(false)
const showForceDeleteConfirm = ref(false)

// UI States
const isActionsOpen = ref(false)
const actionsDropdownRef = ref(null)
const selectedTask = ref(null)

// Filter States
const taskFilter = ref('all')
const taskSearch = ref('')

// ===== UTILITY FUNCTIONS =====

// Safe metric getter with fallback
const safeGetMetric = (metricPath, fallbackFn) => {
  try {
    const value = metricPath.split('.').reduce((obj, key) => obj?.[key], project.value)
    return value !== undefined ? value : fallbackFn()
  } catch (error) {
    console.warn(`Failed to get metric ${metricPath}, using fallback`)
    return fallbackFn()
  }
}

// Date formatting
function formatDate(dateStr) {
  if (!dateStr) return 'Not set'
  try {
    const date = parseISO(dateStr)
    return format(date, 'd MMM yyyy')
  } catch (e) {
    console.error('Error formatting date:', e)
    return dateStr
  }
}

// Check if task is overdue
const isTaskOverdue = (task) => {
  if (!task.dates?.planned_end || task.state === 'done') return false
  try {
    return isPast(new Date(task.dates.planned_end))
  } catch (error) {
    console.error('Error checking if task is overdue:', error)
    return false
  }
}

// Get user initials
function getInitials(name) {
  if (!name) return '?'
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .substring(0, 2)
    .toUpperCase()
}

// Check if date is overdue
function isOverdue(dateStr) {
  if (!dateStr) return false
  try {
    const date = parseISO(dateStr)
    return isPast(date)
  } catch (e) {
    console.error('Error checking if date is overdue:', e)
    return false
  }
}

// Format task/project state
function formatState(state) {
  if (!state) return 'Unknown'
  
  const stateMap = {
    'draft': 'Draft',
    'planned': 'Planned',
    'in_progress': 'In Progress',
    'review': 'In Review',
    'revision': 'Revision',
    'done': 'Completed',
    'cancelled': 'Cancelled'
  }
  
  return stateMap[state] || state
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// ===== COMPUTED PROPERTIES =====

// Task Metrics
const totalTasksCount = computed(() => {
  return safeGetMetric('metrics.total_tasks', () => project.value?.tasks?.length || 0)
})

const completedTasksCount = computed(() => {
  return safeGetMetric('metrics.completed_tasks', () => 
    project.value?.tasks?.filter(t => t.state === 'done').length || 0
  )
})

const pendingTasksCount = computed(() => {
  return safeGetMetric('metrics.pending_tasks', () => 
    totalTasksCount.value - completedTasksCount.value
  )
})

const overdueTasksCount = computed(() => {
  return safeGetMetric('metrics.overdue_tasks', () => {
    return project.value?.tasks?.filter(task => {
      if (task.state === 'done') return false
      if (!task.dates?.planned_end) return false
      return isPast(new Date(task.dates.planned_end))
    }).length || 0
  })
})

// Content Metrics
const completedVideos = computed(() => {
  return safeGetMetric('metrics.video_completed', () => 
    project.value?.tasks?.filter(t => t.content_type === 'video' && t.state === 'done').length || 0
  )
})

const completedDesigns = computed(() => {
  return safeGetMetric('metrics.design_completed', () => 
    project.value?.tasks?.filter(t => t.content_type === 'design' && t.state === 'done').length || 0
  )
})

const totalVideoCount = computed(() => {
  return project.value?.content_plan?.video_count || 0
})

const totalDesignCount = computed(() => {
  return project.value?.content_plan?.design_count || 0
})

// Progress Calculations
const projectProgress = computed(() => {
  return safeGetMetric('progress', () => {
    if (totalTasksCount.value === 0) return 0
    return Math.round((completedTasksCount.value / totalTasksCount.value) * 100)
  })
})

const completionRate = computed(() => {
  return safeGetMetric('metrics.completion_rate', () => projectProgress.value)
})

const videoProgress = computed(() => {
  if (totalVideoCount.value === 0) return 0
  return Math.round((completedVideos.value / totalVideoCount.value) * 100)
})

const designProgress = computed(() => {
  if (totalDesignCount.value === 0) return 0
  return Math.round((completedDesigns.value / totalDesignCount.value) * 100)
})

// Timeline Calculations
const daysRemaining = computed(() => {
  if (!project.value?.dates?.end) return 0
  
  try {
    const endDate = parseISO(project.value.dates.end)
    const today = new Date()
    return differenceInDays(endDate, today)
  } catch (error) {
    console.error('Error calculating days remaining:', error)
    return 0
  }
})

const timelineProgress = computed(() => {
  if (!project.value?.dates?.start || !project.value?.dates?.end) return 0
  
  try {
    const startDate = parseISO(project.value.dates.start)
    const endDate = parseISO(project.value.dates.end)
    const today = new Date()
    
    const totalDuration = differenceInDays(endDate, startDate)
    if (totalDuration <= 0) return 0
    
    const elapsed = differenceInDays(today, startDate)
    return Math.min(Math.max((elapsed / totalDuration) * 100, 0), 100)
  } catch (error) {
    console.error('Error calculating timeline progress:', error)
    return 0
  }
})

// Filtered Tasks
const filteredTasks = computed(() => {
  if (!project.value?.tasks) return []
  
  let tasks = [...project.value.tasks] // Create copy to avoid mutation
  
  // Apply search filter
  if (taskSearch.value.trim()) {
    const searchTerm = taskSearch.value.toLowerCase()
    tasks = tasks.filter(task => 
      task.name.toLowerCase().includes(searchTerm) ||
      (task.content_type && task.content_type.toLowerCase().includes(searchTerm)) ||
      (task.description && task.description.toLowerCase().includes(searchTerm))
    )
  }
  
  // Apply category filter
  switch (taskFilter.value) {
    case 'active':
      return tasks.filter(task => task.state !== 'done')
    case 'completed':
      return tasks.filter(task => task.state === 'done')
    case 'overdue':
      return tasks.filter(task => isTaskOverdue(task))
    case 'video':
      return tasks.filter(task => task.content_type === 'video')
    case 'design':
      return tasks.filter(task => task.content_type === 'design')
    case 'revision':
      return tasks.filter(task => task.state === 'revision')
    case 'high_revision':
      return tasks.filter(task => task.revisions?.excessive || (task.revisions?.count || 0) > 2)
    default:
      return tasks
  }
})

// ===== API FUNCTIONS =====

// Update task status with project data refresh
const updateTaskStatus = async (taskId, newStatus, additionalData = {}) => {
  try {
    const response = await apiClient.post('/web/v2/content/tasks', {
      jsonrpc: '2.0',
      id: new Date().getTime(),
      params: {
        operation: 'update_status',
        task_id: taskId,
        new_status: newStatus,
        return_project_data: true,
        ...additionalData
      }
    })

    if (response.data.result?.status === 'success') {
      // Update project data if returned
      if (response.data.result.project_data) {
        project.value = response.data.result.project_data
      }
      return response.data.result
    } else {
      throw new Error(response.data.result?.message || 'Failed to update task status')
    }
  } catch (error) {
    console.error('Error updating task status:', error)
    throw error
  }
}

// Fetch projects list
const fetchProjects = async () => {
  try {
    const response = await apiClient.post('/web/v2/content/projects/list', {
      jsonrpc: '2.0',
      method: 'call',
      id: new Date().getTime()
    })

    if (response.data.result?.status === 'success') {
      projects.value = response.data.result.data
    }
  } catch (error) {
    console.error('Error fetching projects:', error)
  }
}

// Fetch project details
const fetchProjectDetail = async () => {
  isLoading.value = true
  try {
    const response = await apiClient.post(`/web/v2/content/projects/${projectId.value}`, {
      jsonrpc: '2.0',
      id: new Date().getTime()
    })

    if (response.data.result?.status === 'success') {
      project.value = response.data.result.data
      console.log('Project data loaded:', project.value)
    } else {
      throw new Error(response.data.result?.message || 'Failed to fetch project details')
    }
  } catch (error) {
    console.error('Error fetching project:', error)
    showToast({
      message: error.message || 'Failed to load project details',
      type: 'error'
    })
  } finally {
    isLoading.value = false
  }
}

// Refresh project data silently
const refreshProjectData = async () => {
  try {
    const response = await apiClient.post(`/web/v2/content/projects/${projectId.value}`, {
      jsonrpc: '2.0',
      id: new Date().getTime()
    })

    if (response.data.result?.status === 'success') {
      project.value = response.data.result.data
    }
  } catch (error) {
    console.error('Error refreshing project data:', error)
  }
}

// ===== EVENT HANDLERS =====

// Open task detail modal
const openTaskDetail = (task) => {
  selectedTask.value = task
  showTaskDetailModal.value = true
}

// Handle project update
const handleProjectUpdate = async (data) => {
  try {
    const response = await apiClient.post('/web/v2/content/projects', {
      jsonrpc: '2.0',
      id: new Date().getTime(),
      params: {
        operation: 'update',
        project_id: projectId.value,
        ...data
      }
    })

    if (response.data.result?.status === 'success') {
      if (response.data.result.data) {
        project.value = response.data.result.data
      } else {
        await fetchProjectDetail()
      }
      
      showToast({
        message: 'Project updated successfully',
        type: 'success'
      })
      showEditModal.value = false
    } else {
      throw new Error(response.data.result?.message || 'Failed to update project')
    }
  } catch (error) {
    console.error('Error updating project:', error)
    showToast({
      message: error.message || 'Failed to update project',
      type: 'error'
    })
  }
}

// Handle task creation
const handleTaskCreate = async (data) => {
  try {
    const response = await apiClient.post('/web/v2/content/tasks', {
      jsonrpc: '2.0',
      id: new Date().getTime(),
      params: {
        operation: 'create',
        project_id: projectId.value,
        return_project_data: true,
        ...data
      }
    })

    if (response.data.result?.status === 'success') {
      if (response.data.result.project_data) {
        project.value = response.data.result.project_data
      } else {
        await fetchProjectDetail()
      }
      
      showToast({
        message: 'Task created successfully',
        type: 'success'
      })
      showCreateTaskModal.value = false
    } else {
      throw new Error(response.data.result?.message || 'Failed to create task')
    }
  } catch (error) {
    console.error('Error creating task:', error)
    showToast({
      message: error.message || 'Failed to create task',
      type: 'error'
    })
  }
}

// Handle task update
const handleTaskUpdate = async (taskData) => {
  try {
    const response = await apiClient.post('/web/v2/content/tasks', {
      jsonrpc: '2.0',
      id: new Date().getTime(),
      params: {
        operation: 'update',
        task_id: taskData.id,
        return_project_data: true,
        ...taskData
      }
    })

    if (response.data.result?.status === 'success') {
      if (response.data.result.project_data) {
        project.value = response.data.result.project_data
      } else {
        // Fallback: manual update
        if (project.value?.tasks) {
          const taskIndex = project.value.tasks.findIndex(t => t.id === taskData.id)
          if (taskIndex !== -1) {
            project.value.tasks[taskIndex] = { ...project.value.tasks[taskIndex], ...taskData }
          }
        }
      }
      
      showToast({
        message: 'Task updated successfully',
        type: 'success'
      })
    } else {
      throw new Error(response.data.result?.message || 'Failed to update task')
    }
  } catch (error) {
    console.error('Error updating task:', error)
    showToast({
      message: error.message || 'Failed to update task',
      type: 'error'
    })
  }
}

// Handle task status update
const handleTaskStatusUpdate = async (taskId, newStatus, isFromDrag = false) => {
  try {
    const additionalData = isFromDrag ? { is_drag: true } : {}
    
    const result = await updateTaskStatus(taskId, newStatus, additionalData)
    
    // Handle revision form requirement
    if (result.status === 'need_revision_form') {
      selectedTask.value = result.data
      showRevisionModal.value = true
      return
    }
    
    showToast({
      message: 'Task status updated successfully',
      type: 'success'
    })
    
  } catch (error) {
    showToast({
      message: error.message || 'Failed to update task status',
      type: 'error'
    })
  }
}

// Handle revision submission
const handleRevisionSubmit = async (revisionData) => {
  try {
    const result = await updateTaskStatus(
      selectedTask.value.id, 
      'revision', 
      {
        feedback: revisionData.feedback,
        revision_points: revisionData.revision_points,
        deadline: revisionData.deadline
      }
    )
    
    showToast({
      message: 'Revision request submitted successfully',
      type: 'success'
    })
    
    showRevisionModal.value = false
    selectedTask.value = null
    
  } catch (error) {
    showToast({
      message: error.message || 'Failed to submit revision request',
      type: 'error'
    })
  }
}

// Handle task deletion
const handleTaskDelete = async (taskId) => {
  try {
    const response = await apiClient.post('/web/v2/content/tasks', {
      jsonrpc: '2.0',
      id: new Date().getTime(),
      params: {
        operation: 'delete',
        task_id: taskId,
        return_project_data: true
      }
    })

    if (response.data.result?.status === 'success') {
      if (response.data.result.project_data) {
        project.value = response.data.result.project_data
      } else {
        // Fallback: manual removal and refresh
        if (project.value?.tasks) {
          project.value.tasks = project.value.tasks.filter(t => t.id !== taskId)
        }
        await fetchProjectDetail()
      }
      
      showToast({
        message: 'Task deleted successfully',
        type: 'success'
      })
      
      showTaskDetailModal.value = false
      selectedTask.value = null
    } else {
      throw new Error(response.data.result?.message || 'Failed to delete task')
    }
  } catch (error) {
    console.error('Error deleting task:', error)
    showToast({
      message: error.message || 'Failed to delete task',
      type: 'error'
    })
  }
}

// ===== PROJECT DELETE HANDLERS =====

// Confirm project deletion
const confirmDelete = () => {
  showDeleteConfirm.value = true
}

// Confirm force delete
const confirmForceDelete = () => {
  showDeleteConfirm.value = false
  showForceDeleteConfirm.value = true
}

// Handle project deletion
const handleDelete = async (force = false) => {
  try {
    const response = await apiClient.post('/web/v2/content/projects', {
      jsonrpc: '2.0',
      method: 'call',
      params: {
        operation: 'delete',
        project_id: projectId.value,
        force: force
      }
    })

    if (response.data.result?.result?.status === 'success') {
      showToast({
        message: response.data.result.result.message || 'Project deleted successfully',
        type: 'success'
      })
      showDeleteConfirm.value = false
      showForceDeleteConfirm.value = false
      router.push('/dashboard/projects')
    } else {
      throw new Error(response.data.result?.message || 'Failed to delete project')
    }
  } catch (error) {
    console.error('Error deleting project:', error)
    showToast({
      message: error.message || 'Failed to delete project',
      type: 'error'
    })
  } finally {
    showDeleteConfirm.value = false
    showForceDeleteConfirm.value = false
  }
}

// ===== UI INTERACTION HANDLERS =====

// Click outside handler for dropdown
const handleClickOutside = (event) => {
  if (actionsDropdownRef.value && !actionsDropdownRef.value.contains(event.target)) {
    isActionsOpen.value = false
  }
}

// Keyboard shortcuts handler
const handleKeyboardShortcuts = (event) => {
  // Ctrl/Cmd + N: New Task
  if ((event.ctrlKey || event.metaKey) && event.key === 'n') {
    event.preventDefault()
    showCreateTaskModal.value = true
  }
  
  // Escape: Close modals
  if (event.key === 'Escape') {
    if (showTaskDetailModal.value) {
      showTaskDetailModal.value = false
    } else if (showCreateTaskModal.value) {
      showCreateTaskModal.value = false
    } else if (showEditModal.value) {
      showEditModal.value = false
    } else if (showRevisionModal.value) {
      showRevisionModal.value = false
    } else if (isActionsOpen.value) {
      isActionsOpen.value = false
    }
  }
  
  // Ctrl/Cmd + R: Refresh data
  if ((event.ctrlKey || event.metaKey) && event.key === 'r') {
    event.preventDefault()
    refreshProjectData()
    showToast({
      message: 'Project data refreshed',
      type: 'success'
    })
  }
}

// ===== ERROR HANDLING =====

// Handle network errors
const handleNetworkError = (error) => {
  console.error('Network error:', error)
  showToast({
    message: 'Network error. Please check your connection and try again.',
    type: 'error'
  })
}

// Handle component errors
const handleComponentError = (error, instance, info) => {
  console.error('Component error:', error, info)
  showToast({
    message: 'An unexpected error occurred. Please refresh the page.',
    type: 'error'
  })
}

// ===== WATCHERS =====

// Watch project changes to update document title
watch(project, (newProject) => {
  if (newProject?.name) {
    document.title = `${newProject.name} - Project Details`
  }
}, { immediate: true })

// Watch for task filter changes
watch(taskFilter, () => {
  // Reset search when filter changes for better UX
  // taskSearch.value = ''
})

// Debounced search handler
const debouncedSearch = debounce((searchTerm) => {
  console.log('Searching for:', searchTerm)
  // Additional search logic can be added here if needed
}, 300)

watch(taskSearch, (newValue) => {
  debouncedSearch(newValue)
})

// ===== AUTO-REFRESH FUNCTIONALITY =====

const refreshInterval = ref(null)

// Start auto-refresh (optional feature)
const startAutoRefresh = () => {
  refreshInterval.value = setInterval(refreshProjectData, 30000) // 30 seconds
}

// Stop auto-refresh
const stopAutoRefresh = () => {
  if (refreshInterval.value) {
    clearInterval(refreshInterval.value)
    refreshInterval.value = null
  }
}

// ===== LIFECYCLE HOOKS =====

onMounted(async () => {
  try {
    // Load project and supporting data in parallel
    await Promise.all([
      fetchProjectDetail(),
      fetchProjects()
    ])
    
    // Setup event listeners
    document.addEventListener('click', handleClickOutside)
    document.addEventListener('keydown', handleKeyboardShortcuts)
    
    // Optional: Start auto-refresh
    // startAutoRefresh()
    
  } catch (error) {
    console.error('Error during component mount:', error)
    handleNetworkError(error)
  }
})

onUnmounted(() => {
  // Cleanup event listeners
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleKeyboardShortcuts)
  
  // Stop auto-refresh
  stopAutoRefresh()
  
  // Reset document title
  document.title = 'Project Management'
})

// ===== EXPOSE FOR TESTING =====

// Expose methods for parent component access or testing
defineExpose({
  refreshProjectData,
  handleTaskStatusUpdate,
  handleTaskCreate,
  handleTaskUpdate,
  handleTaskDelete,
  fetchProjectDetail,
  project: readonly(project),
  isLoading: readonly(isLoading)
})

// ===== PERFORMANCE OPTIMIZATIONS =====

// Memoize expensive calculations if needed
// const expensiveCalculation = computed(() => {
//   // Heavy computation here
// })

// ===== ACCESSIBILITY HELPERS =====

// Focus management for modals
const focusManagement = {
  focusModal: (modalRef) => {
    if (modalRef?.value) {
      const firstFocusable = modalRef.value.querySelector('[tabindex]:not([tabindex="-1"]), button, input, select, textarea')
      firstFocusable?.focus()
    }
  },
  
  trapFocus: (event, modalRef) => {
    if (!modalRef?.value) return
    
    const focusableElements = modalRef.value.querySelectorAll('[tabindex]:not([tabindex="-1"]), button, input, select, textarea')
    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]
    
    if (event.key === 'Tab') {
      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault()
          lastElement.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault()
          firstElement.focus()
        }
      }
    }
  }
}

// ===== DEVELOPMENT HELPERS =====

// Development mode helpers
if (import.meta.env.DEV) {
  // Add development-only watchers or logs
  watch(project, (newProject) => {
    console.log('🔄 Project data updated:', newProject)
  })
  
  // Global access for debugging
  window.projectDetailDebug = {
    project,
    refreshProjectData,
    filteredTasks,
    totalTasksCount,
    completedTasksCount
  }
}
</script>

<style scoped>
/* ===== ANIMATIONS ===== */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* ===== TRANSITIONS ===== */
* {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* ===== SCROLLBAR STYLING ===== */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 6px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 6px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* ===== GLASS MORPHISM ===== */
.backdrop-blur-md {
  backdrop-filter: blur(12px);
}

.backdrop-blur-sm {
  backdrop-filter: blur(6px);
}

/* ===== HOVER EFFECTS ===== */
.group:hover .group-hover\:scale-110 {
  transform: scale(1.1);
}

/* ===== FOCUS STYLES ===== */
button:focus-visible,
input:focus-visible,
select:focus-visible {
  outline: 2px solid #f43f5e;
  outline-offset: 2px;
}

/* ===== RESPONSIVE DESIGN ===== */
@media (max-width: 640px) {
  .group p-6 {
    padding: 1rem;
  }
  
  .text-3xl {
    font-size: 1.5rem;
  }
  
  .text-2xl {
    font-size: 1.25rem;
  }
}

/* ===== PRINT STYLES ===== */
@media print {
  .no-print {
    display: none !important;
  }
  
  .bg-gradient-to-br {
    background: white !important;
  }
}

/* ===== ACCESSIBILITY ===== */
@media (prefers-contrast: high) {
  .text-slate-500 {
    color: #000 !important;
  }
  
  .border-slate-200 {
    border-color: #000 !important;
  }
}

@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* ===== DARK MODE SUPPORT ===== */
@media (prefers-color-scheme: dark) {
  /* Dark mode styles can be added here if needed */
}

/* ===== LOADING STATES ===== */
.loading-shimmer {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
</style>