<!-- src/views/dashboard/TeamProjectDetail.vue -->
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
      <div class="w-full max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
          <div class="flex items-center space-x-3">
            <button @click="router.back()" class="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft class="w-5 h-5 text-gray-500" />
            </button>
            <div>
              <h1 class="text-xl sm:text-2xl font-semibold text-gray-900">{{ project?.name }}</h1>
              <p class="text-sm text-gray-500">{{ project?.code }}</p>
            </div>
          </div>

          <div class="flex items-center space-x-3">
            <div
              class="px-3 py-1 text-sm font-semibold rounded-full"
              :class="{
                'bg-yellow-100 text-yellow-800': project?.state === 'in_progress',
                'bg-green-100 text-green-800': project?.state === 'completed',
                'bg-gray-100 text-gray-800': project?.state === 'draft',
                'bg-purple-100 text-purple-800': project?.state === 'planning',
                'bg-orange-100 text-orange-800': project?.state === 'on_hold',
                'bg-red-100 text-red-800': project?.state === 'cancelled'
              }"
            >
              {{ formatState(project?.state) }}
            </div>
            <button
              @click="showEditModal = true"
              class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Pencil class="w-4 h-4 mr-2" />
              Edit Project
            </button>
            <button
              @click="confirmDelete"
              class="inline-flex items-center px-4 py-2 border border-red-300 rounded-lg shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50"
            >
              <Trash2 class="w-4 h-4 mr-2" />
              Delete Project
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <main class="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left Column -->
         <div class="lg:col-span-1 space-y-6">
          <!-- Project Description Card with Modern Design -->
          <div class="bg-white rounded-xl shadow-sm overflow-hidden">
            <!-- Card Header with Gradient Background -->
            <div class="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4">
              <h2 class="text-lg font-medium text-white flex items-center">
                <FileText class="w-5 h-5 mr-2" />
                Project Overview
              </h2>
               <!-- Project Priority Badge -->
                <div 
                class="flex items-center px-2.5 py-1 rounded-lg text-xs font-medium text-white border border-white"
              >
                <Flag class="w-3.5 h-3.5 mr-1.5" />
                {{ formatProjectPriority(project?.priority) }} Priority
              </div>
            </div>
            
            <!-- Content Section -->
            <div class="p-6">
              <!-- Description Section with Collapsible Content -->
              <div class="space-y-4">
                <div>
                  <h3 class="text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <AlignLeft class="w-4 h-4 mr-1 text-red-500" />
                    Description
                  </h3>
                  <div class="bg-gray-50 rounded-lg p-4 border border-gray-100">
                    <div v-if="project?.description" class="prose prose-sm max-w-none text-gray-700" v-html="project?.description"></div>
                    <div v-else class="text-sm text-gray-500 italic flex items-center justify-center py-4">
                      <Info class="w-4 h-4 mr-1" />
                      No description provided
                    </div>
                  </div>
                </div>
          
                <!-- Key Project Highlights -->
                <div class="grid grid-cols-2 gap-4 mt-4">
                  <div class="bg-gray-50 rounded-lg p-4 border border-gray-100">
                    <h4 class="text-xs font-semibold text-gray-500 uppercase mb-2">Department</h4>
                    <div class="flex items-center">
                      <Users class="w-4 h-4 text-red-500 mr-2" />
                      <span class="text-sm font-medium text-gray-800">{{ project?.department?.name || 'Not Assigned' }}</span>
                    </div>
                  </div>
                  
                  <div class="bg-gray-50 rounded-lg p-4 border border-gray-100">
                    <h4 class="text-xs font-semibold text-gray-500 uppercase mb-2">Project Code</h4>
                    <div class="flex items-center">
                      <Hash class="w-4 h-4 text-red-500 mr-2" />
                      <span class="text-sm font-medium text-gray-800">{{ project?.code || 'N/A' }}</span>
                    </div>
                  </div>
                </div>
                
                <!-- Project Status & Priority Card -->
                <div class="bg-gray-50 rounded-lg p-4 border border-gray-100 mt-4">
                  <h4 class="text-xs font-semibold text-gray-500 uppercase mb-2">Project Status</h4>
                  <div class="flex justify-between items-center">
                    <div class="flex items-center">
                      <div 
                        class="w-2.5 h-2.5 rounded-full mr-2"
                        :class="{
                          'bg-yellow-500': project?.state === 'in_progress',
                          'bg-green-500': project?.state === 'completed',
                          'bg-gray-500': project?.state === 'draft',
                          'bg-purple-500': project?.state === 'planning',
                          'bg-orange-500': project?.state === 'on_hold',
                          'bg-red-500': project?.state === 'cancelled'
                        }"
                      ></div>
                      <span class="text-sm font-medium text-gray-800">{{ formatState(project?.state) }}</span>
                    </div>
                    
                    <div 
                      class="px-2.5 py-1 rounded-md text-xs font-medium"
                      :class="{
                        'bg-blue-50 text-blue-700 border border-blue-100': project?.priority === '0',
                        'bg-green-50 text-green-700 border border-green-100': project?.priority === '1',
                        'bg-orange-50 text-orange-700 border border-orange-100': project?.priority === '2',
                        'bg-red-50 text-red-700 border border-red-100': project?.priority === '3'
                      }"
                    >
                      <div class="flex items-center">
                        <Flag class="w-3 h-3 mr-1" />
                        {{ formatProjectPriority(project?.priority) }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>          
          </div>
          
          <!-- BAU Activities -->
          <div class="bg-white rounded-xl shadow-sm p-6">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-lg font-medium text-gray-900">Aktivitas Harian</h2>
              <button
                @click="showCreateBAUModal = true"
                class="inline-flex items-center px-2.5 py-1.5 border border-transparent rounded-md text-xs font-medium text-white bg-red-600 hover:bg-red-700"
              >
                <Plus class="w-3 h-3 mr-1" />
                Catat Aktivitas
              </button>
            </div>
            
            <div class="space-y-3 max-h-64 overflow-y-auto">
              <div
                v-for="activity in project?.bau_activities"
                :key="activity.id"
                class="bg-gray-50 rounded-lg p-3"
              >
                <div class="flex justify-between">
                  <div class="font-medium text-sm">{{ activity.name }}</div>
                  <div class="text-xs font-medium rounded-full px-2 py-0.5"
                    :class="{
                      'bg-green-100 text-green-800': activity.state === 'done',
                      'bg-gray-100 text-gray-800': activity.state === 'planned',
                      'bg-red-100 text-red-800': activity.state === 'not_done'
                    }"
                  >
                    {{ formatBAUState(activity.state) }}
                  </div>
                </div>
                <div class="text-xs text-gray-500 mt-1 flex justify-between">
                  <span>{{ formatDate(activity.date) }}</span>
                  <span>{{ activity.hours_spent }} hours</span>
                </div>
              </div>
              
              <div v-if="!project?.bau_activities || project.bau_activities.length === 0" class="text-center py-4">
                <p class="text-sm text-gray-500">Tidak ada aktivitas harian tercatat</p>
              </div>
            </div>
          </div>
        </div>
        

        <!-- Center Column -->
        <div class="lg:col-span-1 space-y-6">
          <!-- Project Progress -->
          <div class="bg-white rounded-xl shadow-sm p-6">
            <h2 class="text-lg font-medium text-gray-900 mb-4">Progress Overview</h2>
            <div class="space-y-4">
              <div>
                <div class="flex justify-between mb-2">
                  <span class="text-gray-600">Overall Progress</span>
                  <span class="font-medium">{{ project?.progress }}%</span>
                </div>
                <div class="w-full bg-gray-100 rounded-full h-2.5">
                  <div
                    class="h-2.5 rounded-full bg-gradient-to-r from-red-500 to-red-600"
                    :style="{ width: `${project?.progress}%` }"
                  ></div>
                </div>
              </div>

              <!-- Task Completion Stats -->
              <div class="grid grid-cols-2 gap-4">
                <div class="bg-gray-50 rounded-lg p-4">
                  <div class="flex items-center space-x-2 text-gray-600 mb-2">
                    <CheckSquare class="w-4 h-4" />
                    <span>Tasks Completed</span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-600">Progress</span>
                    <span class="font-medium">
                      {{ completedTasks }}/{{ totalTasks }}
                    </span>
                  </div>
                </div>
                <div class="bg-gray-50 rounded-lg p-4">
                  <div class="flex items-center space-x-2 text-gray-600 mb-2">
                    <Clock class="w-4 h-4" />
                    <span>Time Tracked</span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-600">Hours</span>
                    <span class="font-medium">
                      {{ project?.actual_hours || 0 }}/{{ project?.planned_hours || 0 }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Tasks Section -->
          <!-- Tasks Section with Modern Design -->
          <div class="bg-white rounded-xl shadow-sm overflow-hidden">
            <!-- Header with Action Button -->
            <div class="bg-gradient-to-r from-white-500 to-white-600 px-6 py-4 flex justify-between items-center">
              <h2 class="text-lg font-medium text-red flex items-center">
                <CheckSquare class="w-5 h-5 mr-2" />
                Tasks
              </h2>
              <button
                @click="showCreateTaskModal = true"
                class="inline-flex items-center px-3 py-1.5 border border-white rounded-lg text-sm font-medium text-white bg-red-500 hover:bg-red-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-red-600"
              >
                <Plus class="w-4 h-4 mr-1.5" />
                Add Task
              </button>
            </div>

            <!-- Task List with Improved UI -->
            <div class="p-4">
              <div class="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                <!-- Task Card -->
                <div
                  v-for="task in project?.tasks"
                  :key="task.id"
                  class="border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer group"
                  @click="showTaskDetail(task)"
                >
                  <!-- Task Header with Status and Priority -->
                  <div class="flex items-start justify-between px-4 pt-4 pb-2">
                    <div class="flex-1">
                      <h3 class="font-medium text-gray-900 group-hover:text-red-600 transition-colors duration-200">{{ task.name }}</h3>
                      <div class="mt-1 flex items-center flex-wrap gap-2 text-sm text-gray-500">
                        <span v-if="task.type?.name" class="flex items-center">
                          <Bookmark class="w-3.5 h-3.5 mr-1 text-gray-400" />
                          {{ task.type?.name }}
                        </span>
                        <span class="flex items-center">
                          <Calendar class="w-3.5 h-3.5 mr-1 text-gray-400" />
                          {{ formatDate(task.dates?.planned_end) }}
                        </span>
                      </div>
                    </div>
                    <div class="flex items-center space-x-2">
                      <!-- Priority Badge -->
                      <div
                        class="flex items-center px-2 py-1 rounded-md text-xs font-medium"
                        :class="{
                          'bg-blue-50 text-blue-600 border border-blue-200': task.priority === '0',
                          'bg-green-50 text-green-600 border border-green-200': task.priority === '1',
                          'bg-orange-50 text-orange-600 border border-orange-200': task.priority === '2',
                          'bg-red-50 text-red-600 border border-red-200': task.priority === '3'
                        }"
                      >
                        <span v-if="task.priority === '0'" class="mr-1.5"><Flag class="w-3 h-3" /></span>
                        <span v-if="task.priority === '1'" class="mr-1.5"><Flag class="w-3 h-3" /></span>
                        <span v-if="task.priority === '2'" class="mr-1.5"><Flag class="w-3 h-3" /></span>
                        <span v-if="task.priority === '3'" class="mr-1.5"><Flag class="w-3 h-3" /></span>
                        {{ formatPriority(task.priority) }}
                      </div>
                      
                      <!-- Status Badge -->
                      <div
                        class="px-2.5 py-1 text-xs font-medium rounded-md"
                        :class="{
                          'bg-yellow-50 text-yellow-700 border border-yellow-200': task.state === 'in_progress',
                          'bg-green-50 text-green-700 border border-green-200': task.state === 'done',
                          'bg-gray-50 text-gray-700 border border-gray-200': task.state === 'draft',
                          'bg-purple-50 text-purple-700 border border-purple-200': task.state === 'planned',
                          'bg-blue-50 text-blue-700 border border-blue-200': task.state === 'review'
                        }"
                      >
                        {{ formatState(task.state) }}
                      </div>
                    </div>
                  </div>

                  <!-- Divider -->
                  <div class="w-full border-t border-gray-100 my-2"></div>

                  <!-- Task Footer with Progress and Assigned -->
                  <div class="px-4 pb-4">
                    <!-- Assigned To -->
                    <div class="mb-3">
                      <div class="flex items-center mb-1">
                        <Users class="w-3.5 h-3.5 text-gray-400 mr-1.5" />
                        <span class="text-xs text-gray-500">Assigned to</span>
                      </div>
                      <div class="flex flex-wrap gap-1.5">
                        <div 
                          v-for="person in task.assigned_to" 
                          :key="person.id"
                          class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200"
                        >
                          {{ person.name }}
                        </div>
                        <div v-if="!task.assigned_to || task.assigned_to.length === 0" class="text-xs text-gray-500 italic">
                          Not assigned
                        </div>
                      </div>
                    </div>

                    <!-- Task Progress -->
                    <div>
                      <div class="flex justify-between text-xs mb-1.5">
                        <span class="text-gray-500 flex items-center">
                          <Activity class="w-3.5 h-3.5 mr-1.5" />
                          Progress
                        </span>
                        <span class="font-medium">{{ task.progress }}%</span>
                      </div>
                      <div class="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          class="h-1.5 rounded-full"
                          :class="{
                            'bg-red-500': task.progress < 30,
                            'bg-orange-500': task.progress >= 30 && task.progress < 70,
                            'bg-green-500': task.progress >= 70
                          }"
                          :style="{ width: `${task.progress}%` }"
                        ></div>
                      </div>
                    </div>
                    
                    <!-- Hover Indicator -->
                    <div class="mt-2 text-xs text-center text-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      Click to view details
                    </div>
                  </div>
                </div>
                
                <!-- Empty State -->
                <div v-if="!project?.tasks || project.tasks.length === 0" class="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                  <CheckSquare class="mx-auto h-10 w-10 text-gray-300" />
                  <h3 class="mt-2 text-sm font-medium text-gray-900">No tasks</h3>
                  <p class="mt-1 text-sm text-gray-500">Get started by creating your first task</p>
                  <div class="mt-6">
                    <button
                      @click="showCreateTaskModal = true"
                      class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <Plus class="w-4 h-4 mr-2" />
                      Add Task
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="lg:col-span-1 space-y-6">
          <!-- Project Group Chat -->
          <div class="bg-white rounded-xl shadow-sm overflow-hidden h-[600px] flex flex-col">
            <div class="p-6 border-b">
              <h2 class="text-lg font-medium text-gray-900">Team Chat</h2>
            </div>
            <div class="flex-1 flex flex-col overflow-hidden">
              <div class="flex-1 overflow-y-auto p-6">
                <div v-if="project?.group_id" class="space-y-4">
                  <div v-for="message in groupMessages" :key="message.id" class="flex gap-3">
                    <div class="h-8 w-8 rounded-full bg-gray-100 flex-shrink-0 flex items-center justify-center">
                      <span class="text-sm font-medium text-gray-600">
                        {{ getInitials(message.author?.name) }}
                      </span>
                    </div>
                    <div class="flex-1">
                      <div class="flex items-baseline">
                        <span class="text-sm font-medium text-gray-900">{{ message.author?.name }}</span>
                        <span class="ml-2 text-xs text-gray-500">{{ formatDateTime(message.date) }}</span>
                      </div>
                      <div class="mt-1 text-sm text-gray-700" v-html="formatMessageContent(message.content)"></div>
                    </div>
                  </div>
                  
                  <div v-if="loadingMessages" class="flex justify-center my-4">
                    <div class="animate-spin rounded-full h-6 w-6 border-2 border-red-600 border-t-transparent"></div>
                  </div>
                  
                  <div v-if="groupMessages.length === 0 && !loadingMessages" class="text-center py-4">
                    <MessageSquare class="mx-auto h-8 w-8 text-gray-300" />
                    <p class="mt-1 text-sm text-gray-500">No messages yet</p>
                  </div>
                </div>
                <div v-else class="text-center py-4">
                  <MessageSquare class="mx-auto h-8 w-8 text-gray-300" />
                  <p class="mt-1 text-sm text-gray-500">No group created for this project</p>
                </div>
              </div>
              
              <!-- Message Input -->
              <div v-if="project?.group_id" class="p-4 border-t bg-white">
                <div class="flex items-end">
                  <div class="flex-grow">
                    <TeamMentionInput 
                      ref="mentionInputRef"
                      v-model="newMessage" 
                      :members="allProjectMembers"
                      placeholder="Type a message... (use @ to mention)"
                      @submit="sendMessage"
                    />
                  </div>
                  <button 
                    @click="sendMessage" 
                    class="ml-3 inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 self-end"
                    :disabled="!newMessage.trim()"
                  >
                    <Send class="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Meetings Section -->
          <div class="bg-white rounded-xl shadow-sm p-6">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-lg font-medium text-gray-900">Meetings</h2>
              <button
                @click="showCreateMeetingModal = true"
                class="inline-flex items-center px-3 py-1.5 border border-transparent rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700"
              >
                <Plus class="w-4 h-4 mr-1.5" />
                Schedule Meeting
              </button>
            </div>

            <div class="space-y-4 max-h-[300px] overflow-y-auto">
              <div
                v-for="meeting in project?.meetings"
                :key="meeting.id"
                class="border rounded-lg p-4 hover:shadow-sm transition-shadow"
              >
                <div class="flex items-start justify-between">
                  <div>
                    <h3 class="font-medium text-gray-900">{{ meeting.name }}</h3>
                    <div class="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                      <span>
                        {{ formatDateTime(meeting.dates?.start) }} - {{ formatTime(meeting.dates?.end) }}
                      </span>
                    </div>
                  </div>
                  <div
                    class="px-2.5 py-1 text-xs font-medium rounded-full"
                    :class="{
                      'bg-yellow-100 text-yellow-800': meeting.state === 'in_progress',
                      'bg-green-100 text-green-800': meeting.state === 'done',
                      'bg-gray-100 text-gray-800': meeting.state === 'planned',
                      'bg-red-100 text-red-800': meeting.state === 'cancelled'
                    }"
                  >
                    {{ formatState(meeting.state) }}
                  </div>
                </div>
                
                <div class="mt-2 text-sm text-gray-600">
                  <div class="flex items-center space-x-2">
                    <User class="w-4 h-4" />
                    <span>Organizer: {{ meeting.organizer?.name }}</span>
                  </div>
                  <div v-if="meeting.location" class="flex items-center space-x-2 mt-1">
                    <MapPin class="w-4 h-4" />
                    <span>{{ meeting.location }}</span>
                  </div>
                  <div v-if="meeting.virtual_location" class="flex items-center space-x-2 mt-1">
                    <Video class="w-4 h-4" />
                    <span>{{ meeting.virtual_location }}</span>
                  </div>
                </div>
              </div>

              <div v-if="!project?.meetings || project.meetings.length === 0" class="text-center py-6">
                <CalendarIcon class="mx-auto h-8 w-8 text-gray-300" />
                <p class="mt-1 text-sm text-gray-500">No meetings scheduled yet</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <Teleport to="body">

      <!-- Popup detail -->
      <!-- Task Detail Modal with Modern Design -->
      <div 
        v-if="showTaskDetailModal && selectedTask" 
        class="fixed inset-0 z-50 overflow-y-auto"
        aria-labelledby="modal-title" 
        role="dialog" 
        aria-modal="true"
        >
        <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <!-- Background overlay -->
          <div 
            class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity backdrop-blur-sm" 
            aria-hidden="true"
            @click="showTaskDetailModal = false"
          ></div>

          <!-- Modal panel -->
          <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
          <div class="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full">
            <!-- Header with Gradient -->
            <div class="relative bg-gradient-to-r from-red-500 to-red-600 px-6 py-4">
              <div class="flex items-center justify-between">
                <h3 class="text-xl font-medium text-white">Task Details</h3>
                <button @click="showTaskDetailModal = false" class="text-white hover:text-gray-200 focus:outline-none">
                  <span class="sr-only">Close</span>
                  <X class="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <!-- Task Title Section -->
            <div class="px-6 pt-5 pb-4 border-b border-gray-100">
              <h2 class="text-xl font-semibold text-gray-900">{{ selectedTask.name }}</h2>
              
              <!-- Status and Priority Badges -->
              <div class="flex flex-wrap gap-2 mt-3">
                <!-- Status Badge -->
                <div 
                  class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                  :class="{
                    'bg-yellow-100 text-yellow-800': selectedTask.state === 'in_progress',
                    'bg-green-100 text-green-800': selectedTask.state === 'done',
                    'bg-gray-100 text-gray-800': selectedTask.state === 'draft',
                    'bg-purple-100 text-purple-800': selectedTask.state === 'planned',
                    'bg-blue-100 text-blue-800': selectedTask.state === 'review'
                  }"
                >
                  <div class="w-2 h-2 rounded-full mr-2"
                    :class="{
                      'bg-yellow-500': selectedTask.state === 'in_progress',
                      'bg-green-500': selectedTask.state === 'done',
                      'bg-gray-500': selectedTask.state === 'draft',
                      'bg-purple-500': selectedTask.state === 'planned',
                      'bg-blue-500': selectedTask.state === 'review'
                    }"
                  ></div>
                  {{ formatState(selectedTask.state) }}
                </div>
                
                <!-- Priority Badge -->
                <div 
                  class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                  :class="{
                    'bg-blue-100 text-blue-800': selectedTask.priority === '0',
                    'bg-green-100 text-green-800': selectedTask.priority === '1',
                    'bg-orange-100 text-orange-800': selectedTask.priority === '2',
                    'bg-red-100 text-red-800': selectedTask.priority === '3'
                  }"
                >
                  <Flag class="w-3.5 h-3.5 mr-1.5" />
                  {{ formatPriority(selectedTask.priority) }} Priority
                </div>
                
                <!-- Task Type Badge (if available) -->
                <div v-if="selectedTask.type?.name" class="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-sm font-medium">
                  <Bookmark class="w-3.5 h-3.5 mr-1.5" />
                  {{ selectedTask.type.name }}
                </div>
              </div>
            </div>
            
            <!-- Task Details Content - Two Column Layout -->
            <div class="px-6 py-4 max-h-[80vh] overflow-y-auto custom-scrollbar">
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <!-- Left Column: Task Information -->
                <div class="space-y-5">
                  <!-- Timeline -->
                  <div class="bg-gray-50 rounded-lg p-5 border border-gray-100">
                    <h4 class="text-sm font-medium text-gray-700 mb-3 flex items-center">
                      <Calendar class="w-4 h-4 mr-1.5 text-red-500" />
                      Timeline
                    </h4>
                    <div class="grid grid-cols-2 gap-4">
                      <div>
                        <div class="text-xs text-gray-500 mb-1">Start Date</div>
                        <div class="text-sm font-medium">
                          {{ formatDateTime(selectedTask.dates?.planned_start) || 'Not set' }}
                        </div>
                      </div>
                      <div>
                        <div class="text-xs text-gray-500 mb-1">Due Date</div>
                        <div 
                          class="text-sm font-medium"
                          :class="{'text-red-600': isOverdue(selectedTask.dates?.planned_end)}"
                        >
                          {{ formatDateTime(selectedTask.dates?.planned_end) || 'Not set' }}
                          <span v-if="isOverdue(selectedTask.dates?.planned_end)" class="text-xs ml-1.5 font-normal text-red-500">(Overdue)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Progress -->
                  <div class="bg-gray-50 rounded-lg p-5 border border-gray-100">
                    <h4 class="text-sm font-medium text-gray-700 mb-3 flex items-center">
                      <Activity class="w-4 h-4 mr-1.5 text-red-500" />
                      Progress
                    </h4>
                    <div class="mb-2 flex justify-between items-center">
                      <div class="text-sm font-medium">Completion: {{ selectedTask.progress }}%</div>
                      <div class="text-xs text-gray-500">
                        {{ selectedTask.hours?.actual || 0 }}/{{ selectedTask.hours?.planned || 0 }} hours
                      </div>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        class="h-2.5 rounded-full transition-all duration-300"
                        :class="{
                          'bg-red-500': selectedTask.progress < 30,
                          'bg-orange-500': selectedTask.progress >= 30 && selectedTask.progress < 70,
                          'bg-green-500': selectedTask.progress >= 70
                        }"
                        :style="{ width: `${selectedTask.progress}%` }"
                      ></div>
                    </div>
                  </div>
                  
                  <!-- Assigned Team Members -->
                  <div class="bg-gray-50 rounded-lg p-5 border border-gray-100">
                    <h4 class="text-sm font-medium text-gray-700 mb-3 flex items-center">
                      <Users class="w-4 h-4 mr-1.5 text-red-500" />
                      Assigned Team Members
                    </h4>
                    <div class="space-y-2">
                      <div v-for="person in selectedTask.assigned_to" :key="person.id" class="flex items-center">
                        <div class="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                          <span class="text-sm font-medium text-red-600">
                            {{ getInitials(person.name) }}
                          </span>
                        </div>
                        <span class="ml-3 text-sm">{{ person.name }}</span>
                      </div>
                      <div v-if="!selectedTask.assigned_to || selectedTask.assigned_to.length === 0" class="text-sm text-gray-500 italic">
                        No team members assigned
                      </div>
                    </div>
                  </div>
                  
                  <!-- Description -->
                  <div class="bg-gray-50 rounded-lg p-5 border border-gray-100">
                    <h4 class="text-sm font-medium text-gray-700 mb-3 flex items-center">
                      <AlignLeft class="w-4 h-4 mr-1.5 text-red-500" />
                      Description
                    </h4>
                    <div class="prose prose-sm max-w-none text-gray-700" v-html="selectedTask.description || 'No description provided'"></div>
                  </div>
                </div>

                <!-- Right Column: Checklist & Timesheet side by side -->
                <div class="space-y-5">
                  <!-- Checklist Section -->
                  <div class="bg-gray-50 rounded-lg p-5 border border-gray-100">
                    <div class="flex items-center justify-between mb-3">
                      <h4 class="text-sm font-medium text-gray-700 flex items-center">
                        <CheckSquare class="w-4 h-4 mr-1.5 text-red-500" />
                        Checklist
                      </h4>
                      <div class="text-xs text-gray-600">
                        {{ selectedTask.checklist_progress || 0 }}% Complete
                      </div>
                    </div>
                    
                    <div class="mb-3 w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        class="bg-green-500 h-1.5 rounded-full" 
                        :style="{ width: `${selectedTask.checklist_progress || 0}%` }"
                      ></div>
                    </div>
                    
                    <TeamTaskChecklistManager 
                      :taskId="selectedTask.id" 
                      :employees="getTaskAssignees(selectedTask)"
                      @update:progress="updateTaskProgress"
                    />
                  </div>
                  
                  <!-- Timesheet Section -->
                  <div class="bg-gray-50 rounded-lg p-5 border border-gray-100">
                    <div class="flex items-center justify-between mb-3">
                      <h4 class="text-sm font-medium text-gray-700 flex items-center">
                        <Clock class="w-4 h-4 mr-1.5 text-red-500" />
                        Time Tracking
                      </h4>
                    </div>
                    
                    <TeamTaskTimesheetManager 
                      :taskId="selectedTask.id" 
                      :employees="getTaskAssignees(selectedTask)"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Footer Actions -->
            <div class="bg-gray-50 px-6 py-4 flex flex-wrap justify-end gap-3 border-t border-gray-100">
              <button
                @click="showTaskDetailModal = false"
                class="px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Close
              </button>
              <button
                @click="editSelectedTask()"
                class="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <Edit class="w-4 h-4 mr-1.5 inline-block" />
                Edit Task
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Edit Project Modal -->
      <TeamProjectFormModal
        v-if="showEditModal"
        :show="showEditModal"
        :project="project"
        :departments="departments"
        @close="showEditModal = false"
        @submit="handleProjectUpdate"
      />

      <!-- Create Task Modal -->
      <TeamTaskFormModal
        v-if="showCreateTaskModal"
        :show="showCreateTaskModal"
        :project-id="projectId"
        @close="showCreateTaskModal = false"
        @submit="handleTaskCreate"
      />

      <!-- Edit Task Modal -->
      <TeamTaskFormModal
        v-if="showEditTaskModal"
        :show="showEditTaskModal"
        :project-id="projectId"
        :task-data="selectedTask"
        @close="showEditTaskModal = false"
        @submit="handleTaskUpdate"
      />
      
      <!-- Create Meeting Modal -->
      <TeamMeetingFormModal
        v-if="showCreateMeetingModal"
        :show="showCreateMeetingModal"
        :project-id="projectId"
        @close="showCreateMeetingModal = false"
        @submit="handleMeetingCreate"
      />
      
      <!-- Create BAU Activity Modal -->
      <TeamBAUFormModal
        v-if="showCreateBAUModal"
        :show="showCreateBAUModal"
        :project-id="projectId"
        @close="showCreateBAUModal = false"
        @submit="handleBAUCreate"
      />

      <!-- Delete Confirmation Dialog -->
      <div 
        v-if="showDeleteConfirm" 
        class="fixed inset-0 z-50 overflow-y-auto"
        aria-labelledby="modal-title" 
        role="dialog" 
        aria-modal="true"
      >
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <!-- Background overlay -->
          <div 
            class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
            aria-hidden="true"
            @click="showDeleteConfirm = false"
          ></div>

          <!-- Modal panel -->
          <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
          <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="sm:flex sm:items-start">
                <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <Trash2 class="h-6 w-6 text-red-600" />
                </div>
                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                    Delete Project
                  </h3>
                  <div class="mt-2">
                    <p class="text-sm text-gray-500">
                      Are you sure you want to delete "{{ project?.name }}"?
                      <span v-if="project?.tasks?.length > 0" class="block text-red-600 mt-1">
                        This project has {{ project?.tasks.length }} task(s). Deleting it will also remove all associated tasks.
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                @click="handleDelete()"
                class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Delete
              </button>
              <button
                @click="showDeleteConfirm = false"
                class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick  } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { format, isPast } from 'date-fns'
import { 
  ArrowLeft, 
  Pencil, 
  Plus, 
  Video, 
  Trash2, 
  User, 
  Users, 
  MessageSquare,
  Send,
  MapPin,
  CheckSquare,
  Clock,
  FileText,
  Flag,
  Edit
} from 'lucide-vue-next'
import { CalendarIcon } from '@heroicons/vue/24/outline'
import { useToast } from '@/composables/useToast'
import apiClient from '@/config/api'
import TeamMentionInput from '@/components/team/TeamMentionInput.vue'
import TeamTaskChecklistManager from '@/components/team/TeamTaskChecklistManager.vue';
import TeamTaskTimesheetManager from '@/components/team/TeamTaskTimesheetManager.vue';

import TeamProjectFormModal from '@/components/team/TeamProjectFormModal.vue'
import TeamTaskFormModal from '@/components/team/TeamTaskFormModal.vue'
import TeamMeetingFormModal from '@/components/team/TeamMeetingFormModal.vue'
import TeamBAUFormModal from '@/components/team/TeamBAUFormModal.vue'
import Toast from '@/components/Toast.vue'

const route = useRoute()
const router = useRouter()
const { toast, showToast } = useToast()

const projectId = computed(() => Number(route.params.id))
const project = ref(null)
const departments = ref([])
const groupMessages = ref([])
const newMessage = ref('')
const loadingMessages = ref(false)
const mentionInputRef = ref(null)

const showEditModal = ref(false)
const showCreateTaskModal = ref(false)
const showCreateMeetingModal = ref(false)
const showCreateBAUModal = ref(false)
const showDeleteConfirm = ref(false)
const fetchedTasks = ref({});

// Computed
const totalTasks = computed(() => {
  return project.value?.tasks?.length || 0
})

const completedTasks = computed(() => {
  return project.value?.tasks?.filter(t => t.state === 'done').length || 0
})

// Add these to your script section to handle task editing

// Ref for edit task modal visibility
const showEditTaskModal = ref(false)

// Function to handle opening edit task modal
const editSelectedTask = () => {
  if (!selectedTask.value) return
  
  // Close the detail modal first
  showTaskDetailModal.value = false
  
  // Then open the edit modal (with slight delay for better UX)
  setTimeout(() => {
    showEditTaskModal.value = true
  }, 100)
}

// Function to handle task update
const handleTaskUpdate = async (data) => {
  try {
    const response = await apiClient.post('/web/v2/team/tasks', {
      jsonrpc: '2.0',
      id: new Date().getTime(),
      params: {
        operation: 'update',
        task_id: selectedTask.value.id,
        ...data
      }
    })

    if (response.data.result?.status === 'success') {
      showToast({
        message: 'Task updated successfully',
        type: 'success'
      })
      showEditTaskModal.value = false
      await fetchProjectDetail() // Refresh project data
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

const formatProjectPriority = (priority) => {
  const priorities = {
    '0': 'Low',
    '1': 'Medium',
    '2': 'High',
    '3': 'Critical'
  }
  return priorities[priority] || 'Medium'
}

const priorityColorMap = {
  '0': {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-100',
    icon: 'text-blue-500'
  },
  '1': {
    bg: 'bg-green-50',
    text: 'text-green-700',
    border: 'border-green-100',
    icon: 'text-green-500'
  },
  '2': {
    bg: 'bg-orange-50',
    text: 'text-orange-700',
    border: 'border-orange-100',
    icon: 'text-orange-500'
  },
  '3': {
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-100',
    icon: 'text-red-500'
  }
}


const formatPriority = (priority) => {
  const priorities = {
    '0': 'Low',
    '1': 'Medium',
    '2': 'High',
    '3': 'Critical'
  }
  return priorities[priority] || 'Medium'
}

// Pada method showTaskDetail
const showTaskDetail = (task) => {
  // Jika task sama, jangan mengaturnya lagi
  if (selectedTask.value && selectedTask.value.id === task.id) {
    console.log(`Task ${task.id} already selected, just showing modal`);
    showTaskDetailModal.value = true;
    return;
  }
  
  console.log(`Setting selectedTask to task ID: ${task.id}`);
  selectedTask.value = { ...task }; // Copy task untuk mencegah mutasi langsung
  showTaskDetailModal.value = true;
  
  // Fetch detail task hanya jika belum lengkap
  if (!task.checklists) {
    console.log(`Fetching details for task ID: ${task.id}`);
    fetchTaskDetails(task.id);
  }
};

const fetchTaskDetails = async (taskId) => {
  try {
    const response = await apiClient.post('/web/v2/team/tasks', {
      jsonrpc: '2.0',
      method: 'call',
      params: {
        operation: 'read',
        task_id: taskId
      }
    });
    
    if (response.data.result?.status === 'success') {
      // Update selectedTask jika masih task yang sama
      if (selectedTask.value && selectedTask.value.id === taskId) {
        selectedTask.value = response.data.result.data;
      }
      
      // Simpan di cache
      fetchedTasks.value[taskId] = response.data.result.data;
    }
  } catch (error) {
    console.error('Error fetching task details:', error);
  }
};

const toggleChecklistItem = async (item) => {
  try {
    const response = await apiClient.post('/web/v2/team/task/checklists', {
      jsonrpc: '2.0',
      method: 'call',
      params: {
        operation: 'update',
        checklist_id: item.id,
        is_done: !item.is_done
      }
    });
    
    if (response.data.result?.status === 'success') {
      // Update LOCAL state saja, tidak perlu fetch ulang
      const index = checklist.value.findIndex(i => i.id === item.id);
      if (index !== -1) {
        checklist.value[index].is_done = !item.is_done;
        
        // Hitung progress tanpa perlu fetch
        const completed = checklist.value.filter(i => i.is_done).length;
        const progressValue = Math.round((completed / checklist.value.length) * 100);
        emit('update:progress', progressValue);
      }
    } else {
      throw new Error(response.data.result?.message || 'Update failed');
    }
  } catch (error) {
    console.error('Error toggling checklist item:', error);
    showToast('Failed to update checklist item. Please try again.', 'error');
  }
};


const navigateToTask = (taskId) => {
  router.push(`/team/tasks/${taskId}`)
}

const selectedTask = ref(null)
const showTaskDetailModal = ref(false)

const getTaskAssignees = (task) => {
  if (!task || !task.assigned_to) return [];
  return task.assigned_to.map(person => ({
    id: person.id,
    name: person.name
  }));
};

// Fungsi untuk memperbarui progress task
const updateTaskProgress = async (progress) => {
  try {
    const response = await apiClient.post('/web/v2/team/tasks', {
      jsonrpc: '2.0',
      method: 'call',
      params: {
        operation: 'update',
        task_id: selectedTask.value.id,
        progress: progress
      }
    });
    
    if (response.data.result?.status === 'success') {
      // Update task in the local state
      selectedTask.value = response.data.result.data;
      
      // Also update the task in the project.tasks array
      if (project.value && project.value.tasks) {
        const taskIndex = project.value.tasks.findIndex(t => t.id === selectedTask.value.id);
        if (taskIndex !== -1) {
          project.value.tasks[taskIndex] = selectedTask.value;
        }
      }
    } else {
      console.error('Error updating task progress:', response.data.result?.message);
    }
  } catch (error) {
    console.error('Error updating task progress:', error);
  }
};

const closeTaskDetailModal = () => {
  showTaskDetailModal.value = false;
  // Reset selectedTask jika diperlukan
  // selectedTask.value = null;
};

// Methods
const fetchProjectDetail = async () => {
  try {
    const response = await apiClient.post(`/web/v2/team/projects`, {
      jsonrpc: '2.0',
      id: new Date().getTime(),
      params: {
        operation: 'read',
        project_id: projectId.value
      }
    })

    if (response.data.result?.status === 'success') {
      project.value = response.data.result.data
      showToast({
        message: 'Project details loaded successfully',
        type: 'success'
      })
      
      // If there's a group, fetch messages
      if (project.value.group_id) {
        fetchGroupMessages(project.value.group_id)
      }
    } else {
      throw new Error(response.data.result?.message || 'Failed to fetch project details')
    }
  } catch (error) {
    console.error('Error fetching project:', error)
    showToast({
      message: error.message || 'Failed to load project details',
      type: 'error'
    })
  }
}

const fetchDepartments = async () => {
  try {
    const response = await apiClient.post('/web/dataset/call_kw', {
      jsonrpc: '2.0',
      method: 'call',
      params: {
        model: 'hr.department',
        method: 'search_read',
        args: [[]],
        kwargs: {
          fields: ['id', 'name']
        }
      }
    })

    if (response.data.result) {
      departments.value = response.data.result
    }
  } catch (error) {
    console.error('Error fetching departments:', error)
  }
}

const fetchGroupMessages = async (groupId) => {
  try {
    loadingMessages.value = true
    const response = await apiClient.post('/web/v2/team/messages', {
      jsonrpc: '2.0',
      id: new Date().getTime(),
      params: {
        group_id: groupId
      }
    })

    if (response.data.result?.status === 'success') {
      groupMessages.value = response.data.result.data
    } else {
      throw new Error(response.data.result?.message || 'Failed to fetch messages')
    }
  } catch (error) {
    console.error('Error fetching messages:', error)
    showToast({
      message: error.message || 'Failed to load messages',
      type: 'error'
    })
  } finally {
    loadingMessages.value = false
  }
}

// Update fungsi sendMessage
const sendMessage = async () => {
  if (!newMessage.value.trim() || !project.value?.group_id) return
  
  try {
    // Ekstrak mentions dari pesan dengan format @[id:name]
    const mentions = mentionInputRef.value ? mentionInputRef.value.extractMentions(newMessage.value) : []
    const mentionIds = mentions.map(m => m.id)
    
    const response = await apiClient.post('/web/v2/team/chat/send', {
      jsonrpc: '2.0',
      id: new Date().getTime(),
      params: {
        group_id: project.value.group_id,
        content: newMessage.value,
        message_type: 'regular',
        project_id: projectId.value,
        mentions: mentionIds.length > 0 ? mentionIds : undefined
      }
    })

    if (response.data.result?.status === 'success') {
      // Add the new message to the list
      groupMessages.value.unshift(response.data.result.data)
      newMessage.value = ''
      
      // Focus input again after sending
      nextTick(() => {
        mentionInputRef.value?.focus()
      })
    } else {
      throw new Error(response.data.result?.message || 'Failed to send message')
    }
  } catch (error) {
    console.error('Error sending message:', error)
    showToast({
      message: error.message || 'Failed to send message',
      type: 'error'
    })
  }
}

const formatMessageContent = (content) => {
  if (!content) return ''
  
  // Ganti @[id:name] dengan span yang distyle khusus
  return content.replace(/@\[(\d+):([^\]]+)\]/g, (match, id, name) => {
    return `<span class="inline-block bg-red-50 text-red-600 px-1 py-0.5 rounded">@${name}</span>`
  })
}

const handleProjectUpdate = async (data) => {
  try {
    const response = await apiClient.post('/web/v2/team/projects', {
      jsonrpc: '2.0',
      id: new Date().getTime(),
      params: {
        operation: 'update',
        project_id: projectId.value,
        ...data
      }
    })

    if (response.data.result?.status === 'success') {
      showToast({
        message: 'Project updated successfully',
        type: 'success'
      })
      showEditModal.value = false
      await fetchProjectDetail()
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

const handleTaskCreate = async (data) => {
  try {
    const response = await apiClient.post('/web/v2/team/tasks', {
      jsonrpc: '2.0',
      id: new Date().getTime(),
      params: {
        operation: 'create',
        project_id: projectId.value,
        ...data
      }
    })

    if (response.data.result?.status === 'success') {
      showToast({
        message: 'Task created successfully',
        type: 'success'
      })
      showCreateTaskModal.value = false
      await fetchProjectDetail()
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

const handleMeetingCreate = async (data) => {
  try {
    const response = await apiClient.post('/web/v2/team/meetings', {
      jsonrpc: '2.0',
      id: new Date().getTime(),
      params: {
        operation: 'create',
        project_id: projectId.value,
        ...data
      }
    })

    if (response.data.result?.status === 'success') {
      showToast({
        message: 'Meeting scheduled successfully',
        type: 'success'
      })
      showCreateMeetingModal.value = false
      await fetchProjectDetail()
    } else {
      throw new Error(response.data.result?.message || 'Failed to schedule meeting')
    }
  } catch (error) {
    console.error('Error scheduling meeting:', error)
    showToast({
      message: error.message || 'Failed to schedule meeting',
      type: 'error'
    })
  }
}

const handleBAUCreate = async (data) => {
  try {
    // Log data untuk debugging
    console.log('Creating BAU activity with data:', data)
    
    const response = await apiClient.post('/web/v2/team/bau', {
      jsonrpc: '2.0',
      id: new Date().getTime(),
      params: {
        operation: 'create',
        project_id: projectId.value,
        ...data
      }
    })

    if (response.data.result?.status === 'success') {
      showToast({
        message: 'BAU activity added successfully',
        type: 'success'
      })
      showCreateBAUModal.value = false
      await fetchProjectDetail()
    } else {
      throw new Error(response.data.result?.message || 'Failed to add BAU activity')
    }
  } catch (error) {
    console.error('Error adding BAU activity:', error)
    showToast({
      message: error.message || 'Failed to add BAU activity',
      type: 'error'
    })
  }
}

const confirmDelete = () => {
  showDeleteConfirm.value = true
}

const handleDelete = async () => {
  try {
    const response = await apiClient.post('/web/v2/team/projects', {
      jsonrpc: '2.0',
      id: new Date().getTime(),
      params: {
        operation: 'delete',
        project_id: projectId.value
      }
    })

    if (response.data.result?.status === 'success') {
      showToast({
        message: response.data.result.message || 'Project deleted successfully',
        type: 'success'
      })
      showDeleteConfirm.value = false
      router.push('/team/projects') 
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
  }
}

const formatState = (state) => {
  const states = {
    draft: 'Draft',
    planned: 'Planning',
    planning: 'Planning',
    in_progress: 'In Progress',
    on_hold: 'On Hold',
    review: 'In Review',
    done: 'Completed',
    completed: 'Completed',
    cancelled: 'Cancelled'
  }
  return states[state] || state
}

const formatBAUState = (state) => {
  const states = {
    planned: 'Planned',
    done: 'Done',
    not_done: 'Not Done'
  }
  return states[state] || state
}

const formatDate = (date) => {
  if (!date) return '-'
  return format(new Date(date), 'dd MMM yyyy')
}

const formatDateTime = (date) => {
  if (!date) return '-'
  return format(new Date(date), 'dd MMM yyyy HH:mm')
}

const formatTime = (date) => {
  if (!date) return '-'
  return format(new Date(date), 'HH:mm')
}

// const isOverdue = (date) => {
//   if (!date) return false
//   return isPast(new Date(date)) && project.value?.state !== 'completed'
// }

const getInitials = (name) => {
  if (!name) return ''
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
}

const isOverdue = (date) => {
  if (!date) return false
  return isPast(new Date(date)) && (selectedTask.value?.state !== 'done' && selectedTask.value?.state !== 'cancelled')
}

// Lifecycle
onMounted(() => {
  fetchDepartments()
  fetchProjectDetail()
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background-color: #f1f1f1;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #d1d1d1;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #a0a0a0;
}

dialog {
  z-index: 1000;
}
</style>