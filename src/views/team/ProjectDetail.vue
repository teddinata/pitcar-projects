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
            <div class="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
              <h2 class="text-lg font-medium text-white flex items-center">
                <FileText class="w-5 h-5 mr-2" />
                Project Overview
              </h2>
              <!-- Project Priority Badge -->
              <div class="flex items-center px-2.5 py-1 rounded-lg text-xs font-medium text-white border border-white">
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
                    <h4 class="text-xs font-semibold text-gray-500 uppercase mb-2">Project Type</h4>
                    <div class="flex items-center">
                      <Hash class="w-4 h-4 text-indigo-500" />
                      <!-- <span class="text-sm font-medium text-gray-800">{{ project?.project_type || 'N/A' }}</span> -->
                      <span 
                        v-if="project?.project_type" 
                        class="ml-2 px-2 py-0.5 text-md font-medium rounded-full uppercase"
                        :class="{
                          'bg-gray-100 text-gray-700': project.project_type === 'general' || project.project_type === 'umum',
                          'bg-blue-100 text-blue-700': project.project_type === 'creation' || project.project_type === 'pembuatan',
                          'bg-purple-100 text-purple-700': project.project_type === 'development' || project.project_type === 'pengembangan',
                          'bg-green-100 text-green-700': project.project_type === 'training' || project.project_type === 'pelatihan',
                          'bg-orange-100 text-orange-700': project.project_type === 'weekly' || project.project_type === 'mingguan',
                          'bg-indigo-100 text-indigo-700': project.project_type === 'monthly' || project.project_type === 'bulanan',
                          'bg-gray-100 text-gray-700': !['general', 'umum', 'creation', 'pembuatan', 'development', 'pengembangan', 'training', 'pelatihan', 'weekly', 'mingguan', 'monthly', 'bulanan'].includes(project.project_type)
                        }"
                      >
                        {{ project.project_type }}
                      </span>
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

          <!-- Letakkan setelah Project Description Card atau di tempat yang sesuai -->
          <div class="bg-white rounded-xl shadow-sm overflow-hidden">
            <!-- Header with Gradient Background -->
            <div class="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4 flex justify-between items-center">
              <h2 class="text-lg font-medium text-white flex items-center">
                <Paperclip class="w-5 h-5 mr-2" />
                Project Files
              </h2>
              <button
                @click="handleFileUpload"
                class="inline-flex items-center px-3 py-1.5 border border-white rounded-lg text-sm font-medium text-white bg-purple-500 hover:bg-purple-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-purple-600"
              >
                <UploadCloud class="w-4 h-4 mr-1.5" />
                Upload File
              </button>
              <input
                ref="fileInputRef"
                type="file"
                @change="onFileChange"
                class="hidden"
              />
            </div>

            <!-- Content Section -->
            <div class="p-4">
              <!-- Loading state -->
              <div v-if="loadingAttachments" class="flex justify-center py-6">
                <div class="animate-spin rounded-full h-6 w-6 border-2 border-red-600 border-t-transparent"></div>
              </div>

              <!-- Empty state -->
              <div v-else-if="!projectAttachments.length" class="text-center py-8">
                <div class="bg-gray-50 rounded-lg p-6 border border-dashed border-gray-200">
                  <UploadCloud class="mx-auto h-12 w-12 text-gray-400" />
                  <h3 class="mt-2 text-sm font-medium text-gray-900">No files uploaded</h3>
                  <p class="mt-1 text-sm text-gray-500">Upload files to this project by clicking the button above.</p>
                  <div class="mt-6">
                    <button
                      @click="handleFileUpload"
                      class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gradient-to-r from-purple-600 to-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <UploadCloud class="w-4 h-4 mr-2" />
                      Upload File
                    </button>
                  </div>
                </div>
              </div>

              <!-- Attachment List -->
              <div v-else class="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                <div
                  v-for="file in projectAttachments" 
                  :key="file.id"
                  class="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition"
                >
                  <!-- File icon and details -->
                  <div class="flex items-center">
                    <!-- Icon based on file type -->
                    <div class="flex-shrink-0 mr-3 p-2 rounded-lg" :class="getFileIconClass(file.mimetype)">
                      <FileText v-if="!file.is_image" class="h-5 w-5" :class="getFileIconColor(file.mimetype)" />
                      <Image v-else class="h-5 w-5 text-blue-500" />
                    </div>
                    
                    <!-- File details -->
                    <div>
                      <div class="text-sm font-medium text-gray-900 truncate max-w-[250px]">{{ file.name }}</div>
                      <div class="text-xs text-gray-500 flex">
                        <span>{{ formatFileSize(file.size) }}</span>
                        <span class="mx-1">•</span>
                        <span>{{ formatTimestamp(file.create_date) }}</span>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Action buttons -->
                  <div class="flex space-x-2">
                    <!-- Preview button - show only for files that can be previewed -->
                    <button
                      v-if="canPreviewFile(file)"
                      @click="openFilePreview(file)"
                      class="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"
                      title="Preview"
                    >
                      <Eye class="h-4 w-4" />
                    </button>
                    
                    <button
                      @click="downloadFile(file)"
                      class="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                      title="Download"
                    >
                      <Download class="h-4 w-4" />
                    </button>
                    
                    <button
                      @click="confirmDeleteFile(file)"
                      class="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                      title="Delete"
                    >
                      <Trash2 class="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- BAU Activities -->
          <div class="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col">
            <div class="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4 flex justify-between items-center">
              <h2 class="text-lg font-medium text-white flex items-center">
                <ClipboardList class="w-5 h-5 mr-2" />
                Aktivitas Harian
              </h2>
              <button
                @click="showCreateBAUModal = true"
                class="inline-flex items-center px-3 py-1.5 border border-white rounded-lg text-sm font-medium text-white bg-purple-500 hover:bg-purple-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-purple-600"
              >
                <Plus class="w-3 h-3 mr-1" />
                Catat Aktivitas
              </button>
            </div>
            
            <div class="space-y-3 p-4 max-h-64 overflow-y-auto">
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
          <div class="bg-white rounded-xl shadow-sm overflow-hidden">
            <div class="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4 flex justify-between items-center">
              <h2 class="text-lg font-medium text-white flex items-center">
                <BarChart2 class="w-5 h-5 mr-2" />
                Progress Overview
              </h2>
            </div>
            <div class="space-y-4 p-4">
              <div>
                <div class="flex justify-between mb-2">
                  <span class="text-gray-600">Overall Progress</span>
                  <span class="font-medium">{{ project?.progress }}%</span>
                </div>
                <div class="w-full bg-gray-100 rounded-full h-2.5">
                  <div
                    class="h-2.5 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500"
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
          <div class="bg-white rounded-xl shadow-sm h-[650px] overflow-hidden">
            <!-- Header with Action Button -->
            <div class="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4 flex justify-between items-center">
              <h2 class="text-lg font-medium text-white flex items-center">
                <CheckSquare class="w-5 h-5 mr-2" />
                Tasks
              </h2>
              <button
                @click="showCreateTaskModal = true"
                class="inline-flex items-center px-3 py-1.5 border border-white rounded-lg text-sm font-medium text-white bg-purple-500 hover:bg-purple-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-purple-600"
              >
                <Plus class="w-4 h-4 mr-1.5" />
                Add Task
              </button>
            </div>
            <div class="p-4">
              <div class="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                <!-- Task Card - ubah warna hover ke indigo/purple -->
                <div
                  v-for="task in project?.tasks"
                  :key="task.id"
                  class="border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer group"
                  @click="showTaskDetail(task)"
                >
                  <!-- Task Header with Status and Priority -->
                  <div class="flex items-start justify-between px-4 pt-4 pb-2">
                    <div class="flex-1">
                      <h3 class="font-medium text-gray-900 group-hover:text-indigo-600 transition-colors duration-200">{{ task.name }}</h3>
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
                            'bg-purple-500': task.progress < 30,
                            'bg-indigo-500': task.progress >= 30 && task.progress < 70,
                            'bg-blue-500': task.progress >= 70
                          }"
                          :style="{ width: `${task.progress}%` }"
                        ></div>
                      </div>
                    </div>
                    
                     <!-- Hover Indicator -->
                    <div class="mt-2 text-xs text-center text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      Click to view details
                    </div>
                  </div>
                </div>
                
                <!-- Empty State -->
                <!-- Empty State - ubah warna tombol -->
                <div v-if="!project?.tasks || project.tasks.length === 0" class="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                  <CheckSquare class="mx-auto h-10 w-10 text-gray-300" />
                  <h3 class="mt-2 text-sm font-medium text-gray-900">No tasks</h3>
                  <p class="mt-1 text-sm text-gray-500">Get started by creating your first task</p>
                  <div class="mt-6">
                    <button
                      @click="showCreateTaskModal = true"
                      class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
          <!-- Modifikasi untuk Team Chat dengan Attachment dan Emoji -->
          <div class="bg-white rounded-xl shadow-sm overflow-hidden h-[600px] flex flex-col">
            <div class="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4 flex justify-between items-center">
              <h2 class="text-lg font-medium text-white flex items-center">
                <MessageSquare class="w-5 h-5 mr-2" />
                Team Chat
              </h2>
            </div>
            <div class="flex-1 flex flex-col overflow-hidden">
              <div class="flex-1 overflow-y-auto p-6 custom-scrollbar">
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
                      
                      <!-- Message Attachments -->
                      <div v-if="message.attachments && message.attachments.length" class="mt-2 space-y-2">
                        <div 
                          v-for="attachment in message.attachments" 
                          :key="attachment.id"
                          class="flex items-center p-2 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition"
                        >
                          <!-- File icon -->
                          <div 
                            class="flex-shrink-0 mr-2 p-1.5 rounded-lg"
                            :class="getFileIconClass(attachment.mimetype)"
                          >
                            <FileText v-if="!attachment.is_image" class="h-4 w-4" :class="getFileIconColor(attachment.mimetype)" />
                            <Image v-else class="h-4 w-4 text-blue-500" />
                          </div>
                          
                          <!-- File details -->
                          <div class="flex-1 min-w-0">
                            <p class="text-xs font-medium text-gray-900 truncate">{{ attachment.name }}</p>
                            <p class="text-xs text-gray-500">{{ formatFileSize(attachment.size) }}</p>
                          </div>
                          
                          <!-- Action buttons -->
                          <div class="flex space-x-1">
                            <button
                              v-if="canPreviewFile(attachment)"
                              @click.stop="openFilePreview(attachment)"
                              class="p-1 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"
                              title="Preview"
                            >
                              <Eye class="h-3.5 w-3.5" />
                            </button>
                            <button
                              @click.stop="downloadFile(attachment)"
                              class="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                              title="Download"
                            >
                              <Download class="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div v-if="loadingMessages" class="flex justify-center my-4">
                    <div class="animate-spin rounded-full h-6 w-6 border-2 border-indigo-600 border-t-transparent"></div>
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
              
              <!-- Message Input with Attachment and Emoji -->
              <div v-if="project?.group_id" class="p-4 border-t bg-white">
                <!-- File Preview Area (when file is selected) -->
                <div v-if="chatAttachment" class="mb-2 p-2 bg-indigo-50 rounded-lg flex items-center justify-between">
                  <div class="flex items-center">
                    <div 
                      class="flex-shrink-0 mr-2 p-1.5 rounded-lg" 
                      :class="getFileIconClass(chatAttachment.type)"
                    >
                      <FileText v-if="!chatAttachment.isImage" class="h-3.5 w-3.5" :class="getFileIconColor(chatAttachment.type)" />
                      <Image v-else class="h-3.5 w-3.5 text-blue-500" />
                    </div>
                    <div class="text-xs font-medium text-gray-900 truncate max-w-xs">{{ chatAttachment.name }}</div>
                  </div>
                  <button 
                    @click="removeChatAttachment" 
                    class="p-1 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <X class="h-3.5 w-3.5" />
                  </button>
                </div>
                
                <div class="flex flex-col">
                  <!-- Main Input Area -->
                  <!-- Perbaiki positioning emoji picker dengan absolute positioning -->
                  <div class="flex items-end relative">
                    <div class="flex-grow">
                      <TeamMentionInput 
                        ref="mentionInputRef"
                        v-model="newMessage" 
                        :members="allProjectMembers"
                        placeholder="Type a message... (use @ to mention)"
                        @submit="sendMessage"
                      />
                    </div>
                    
                    <!-- Action Buttons -->
                    <div class="flex ml-2 mb-1 relative">
                      <!-- File Upload Button -->
                      <button 
                        @click="handleChatFileUpload" 
                        class="mr-2 p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full"
                        title="Attach file"
                      >
                        <Paperclip class="h-5 w-5" />
                      </button>
                      
                      <!-- Hidden File Input -->
                      <input
                        ref="chatFileInputRef"
                        type="file"
                        @change="onChatFileChange"
                        class="hidden"
                      />
                      
                      <!-- Emoji Button - Tambahkan position relative -->
                      <div class="relative">
                        <button 
                          @click.stop="toggleEmojiPicker" 
                          class="emoji-button mr-2 p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full"
                          title="Add emoji"
                        >
                          <Smile class="h-5 w-5" />
                        </button>
                        
                        <!-- Emoji Picker - Ganti dengan absolute positioning -->
                        <div 
                          v-if="showEmojiPicker" 
                          class="emoji-picker absolute bottom-full right-0 mb-2 z-50 bg-white shadow-lg rounded-lg border border-gray-200"
                          style="max-height: 350px; width: 300px;"
                        >
                          <EmojiPicker @select="addEmoji" />
                        </div>
                      </div>
                      
                      <!-- Send Button -->
                      <button 
                        @click="sendMessage" 
                        class="inline-flex items-center justify-center p-2 border border-transparent rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        :disabled="!newMessage.trim() && !chatAttachment"
                        :class="{ 'opacity-50 cursor-not-allowed': !newMessage.trim() && !chatAttachment }"
                      >
                        <Send class="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <!-- Emoji Picker -->
                  <!-- <div v-if="showEmojiPicker" class="absolute bottom-16 right-16 bg-white shadow-lg rounded-lg border border-gray-200 z-10">
                    <EmojiPicker @select="addEmoji" />
                  </div> -->
                </div>
              </div>
            </div>
          </div>

          <!-- Meetings Section -->
          <div class="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col">
            <div class="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4 flex justify-between items-center">
              <h2 class="text-lg font-medium text-white flex items-center">
                <CalendarClock class="w-5 h-5 mr-2" />
                Meetings
              </h2>
              <button
                @click="showCreateMeetingModal = true"
                class="inline-flex items-center px-3 py-1.5 border border-white rounded-lg text-sm font-medium text-white bg-purple-500 hover:bg-purple-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-purple-600"
              >
                <Plus class="w-4 h-4 mr-1.5" />
                Schedule Meeting
              </button>
            </div>

            <div class="space-y-4 p-4 max-h-[300px] overflow-y-auto">
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
            <div class="relative bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
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

                  <div class="bg-gray-50 rounded-lg p-5 border border-gray-100">
                    <div class="flex items-center justify-between mb-3">
                      <h4 class="text-sm font-medium text-gray-700 flex items-center">
                        <Paperclip class="w-4 h-4 mr-1.5 text-red-500" />
                        Attachments
                      </h4>
                      <button
                        @click="showTaskAttachmentUpload = true"
                        class="inline-flex items-center px-2 py-1 border border-transparent rounded-md text-xs font-medium text-white bg-gradient-to-r from-purple-500 to bg-indigo-600 focus:outline-none"
                      >
                        <UploadCloud class="w-3 h-3 mr-1" />
                        Upload
                      </button>
                    </div>
                    
                    <!-- Loading state -->
                    <div v-if="loadingTaskAttachments" class="flex justify-center py-4">
                      <div class="animate-spin rounded-full h-4 w-4 border-2 border-red-600 border-t-transparent"></div>
                    </div>
                    
                    <!-- Empty state -->
                    <div v-else-if="!taskAttachments.length" class="text-center py-2">
                      <p class="text-xs text-gray-500 italic">No files attached</p>
                    </div>
                    
                    <!-- Attachment List -->
                    <div v-else class="space-y-2 max-h-[150px] overflow-y-auto pr-2 custom-scrollbar">
                      <div
                        v-for="file in taskAttachments" 
                        :key="file.id"
                        class="flex items-center justify-between p-2 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition"
                      >
                        <!-- File icon and details -->
                        <div class="flex items-center">
                          <!-- Icon based on file type -->
                          <div class="flex-shrink-0 mr-2 p-1.5 rounded-lg" :class="getFileIconClass(file.mimetype)">
                            <FileText v-if="!file.is_image" class="h-3.5 w-3.5" :class="getFileIconColor(file.mimetype)" />
                            <Image v-else class="h-3.5 w-3.5 text-blue-500" />
                          </div>
                          
                          <!-- File details -->
                          <div>
                            <div class="text-xs font-medium text-gray-900 truncate max-w-[180px]">{{ file.name }}</div>
                            <div class="text-xs text-gray-500">{{ formatFileSize(file.size) }}</div>
                          </div>
                        </div>
                        
                        <!-- Action buttons -->
                        <div class="flex space-x-1">
                          <!-- Preview button -->
                          <button
                            v-if="canPreviewFile(file)"
                            @click="openFilePreview(file)"
                            class="p-1 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"
                            title="Preview"
                          >
                            <Eye class="h-3.5 w-3.5" />
                          </button>
                          
                          <button
                            @click="downloadFile(file)"
                            class="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                            title="Download"
                          >
                            <Download class="h-3.5 w-3.5" />
                          </button>
                          
                          <button
                            @click="confirmDeleteTaskFile(file)"
                            class="p-1 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                            title="Delete"
                          >
                            <Trash2 class="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
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
                class="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
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

      <!-- Delete File Confirmation Dialog -->
      <div 
        v-if="showDeleteFileConfirm" 
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
            @click="showDeleteFileConfirm = false"
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
                    Delete File
                  </h3>
                  <div class="mt-2">
                    <p class="text-sm text-gray-500">
                      Are you sure you want to delete "{{ currentFileToDelete?.name }}"? This action cannot be undone.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                @click="deleteFile()"
                class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Delete
              </button>
              <button
                @click="showDeleteFileConfirm = false"
                class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- File Preview Modal -->
      <div 
        v-if="showPreviewModal && previewFile" 
        class="fixed inset-0 z-50 overflow-y-auto"
        aria-labelledby="modal-title" 
        role="dialog" 
        aria-modal="true"
        >
        <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <!-- Background overlay -->
          <div 
            class="fixed inset-0 bg-gray-900 bg-opacity-90 transition-opacity backdrop-blur-sm" 
            aria-hidden="true"
            @click="closePreview"
          ></div>

          <!-- Modal panel -->
          <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
          <div class="inline-block bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle max-w-4xl w-full p-0">
            <!-- Header -->
            <div class="bg-gray-100 px-4 py-3 flex items-center justify-between border-b">
              <h3 class="text-lg font-medium text-gray-900 truncate max-w-lg">
                {{ previewFile.name }}
              </h3>
              <div class="flex space-x-2">
                <button
                  @click="downloadFile(previewFile)"
                  class="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                  title="Download"
                >
                  <Download class="h-4 w-4" />
                </button>
                <button
                  @click="closePreview"
                  class="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-lg"
                  title="Close"
                >
                  <X class="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <!-- Preview Content -->
            <div class="bg-white p-0 max-h-[80vh] overflow-auto">
              <!-- Show loading indicator while preview is loading -->
              <div v-if="previewLoading" class="flex justify-center items-center h-64">
                <div class="animate-spin rounded-full h-12 w-12 border-4 border-red-600 border-t-transparent"></div>
              </div>
              
              <!-- Image preview -->
              <div v-else-if="isImageFile(previewFile)" class="flex justify-center p-4">
                <img 
                  :src="getSecurePreviewUrl(previewFile.url)" 
                  :alt="previewFile.name" 
                  class="max-w-full max-h-[70vh] object-contain"
                  @load="previewLoading = false"
                />
              </div>
              
              <!-- PDF preview -->
              <div v-else-if="isPdfFile(previewFile)" class="h-[70vh]">
                <iframe 
                  :src="getSecurePreviewUrl(previewFile.url)" 
                  frameborder="0" 
                  class="w-full h-full"
                  @load="previewLoading = false"
                ></iframe>
              </div>
              
              <!-- Text preview -->
              <div v-else-if="isTextFile(previewFile)" class="p-4 bg-gray-50">
                <div class="bg-white p-6 rounded border border-gray-200 max-h-[70vh] overflow-auto">
                  <pre class="whitespace-pre-wrap text-sm font-mono text-gray-800">{{ previewContent }}</pre>
                </div>
              </div>
              
              <!-- Unsupported preview -->
              <div v-else class="text-center p-12">
                <FileText class="mx-auto h-16 w-16 text-gray-400" />
                <h3 class="mt-4 text-lg font-medium text-gray-900">Preview not available</h3>
                <p class="mt-2 text-gray-500">This file type cannot be previewed. Click the download button to view it.</p>
                <button
                  @click="downloadFile(previewFile)"
                  class="mt-4 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gradient-to-r from-purple-600 to-indigo-600"
                >
                  <Download class="w-4 h-4 mr-2" />
                  Download File
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Task Attachment Upload Modal -->
      <div 
        v-if="showTaskAttachmentUpload && selectedTask" 
        class="fixed inset-0 z-50 overflow-y-auto"
        aria-labelledby="modal-title" 
        role="dialog" 
        aria-modal="true"
      >
        <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <!-- Background overlay -->
          <div 
            class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
            aria-hidden="true"
            @click="showTaskAttachmentUpload = false"
          ></div>

          <!-- Modal panel -->
          <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
          <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <!-- Header -->
            <div class="bg-gradient-to-r from-indigo-600 to bg-indigo-400 px-4 py-3 sm:px-6">
              <div class="flex items-center justify-between">
                <h3 class="text-md font-medium text-white">Upload File to Task</h3>
                <button @click="showTaskAttachmentUpload = false" class="text-white hover:text-gray-200 focus:outline-none">
                  <X class="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <!-- Body -->
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <!-- Upload Zone -->
              <div 
                class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-red-500 transition-colors cursor-pointer"
                @click="handleTaskFileUpload"
                @dragover.prevent
                @drop.prevent="onTaskFileDrop"
              >
                <UploadCloud class="mx-auto h-12 w-12 text-gray-400" />
                <p class="mt-2 text-sm text-gray-600">
                  <span class="font-medium text-red-600 hover:text-red-500">
                    Click to upload
                  </span>
                  or drag and drop
                </p>
                <p class="mt-1 text-xs text-gray-500">
                  PDF, Word, Excel, images, or text files (max 20MB)
                </p>
              </div>
              <input
                ref="taskFileInputRef"
                type="file"
                @change="onTaskFileChange"
                class="hidden"
              />
              
              <!-- Upload Progress -->
              <div v-if="uploadingTaskFile" class="mt-4">
                <div class="w-full bg-gray-200 rounded-full h-2.5">
                  <div class="bg-red-600 h-2.5 rounded-full animate-pulse" style="width: 100%"></div>
                </div>
                <p class="text-sm text-gray-600 mt-2">Uploading file...</p>
              </div>
            </div>
            
            <!-- Footer -->
            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                @click="showTaskAttachmentUpload = false"
                class="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

    <!-- Delete Task File Confirmation Dialog -->
    <div 
      v-if="showDeleteTaskFileConfirm" 
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
          @click="showDeleteTaskFileConfirm = false"
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
                  Delete File
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    Are you sure you want to delete "{{ currentTaskFileToDelete?.name }}"? This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              @click="deleteTaskFile()"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Delete
            </button>
            <button
              @click="showDeleteTaskFileConfirm = false"
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
import { ref, reactive, computed, onMounted, nextTick, watch, onBeforeUnmount } from 'vue'
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
  Edit,
  Paperclip, 
  UploadCloud, 
  Download, 
  Image, 
  File,
  Eye,
  BarChart2,
  CalendarClock,
  ClipboardList,
  Smile,
  Hash
} from 'lucide-vue-next'
import { CalendarIcon } from '@heroicons/vue/24/outline'
import { useToast } from '@/composables/useToast'
import apiClient from '@/config/api'
import { debounce } from 'lodash';
import TeamMentionInput from '@/components/team/TeamMentionInput.vue'
import TeamTaskChecklistManager from '@/components/team/TeamTaskChecklistManager.vue';
import TeamTaskTimesheetManager from '@/components/team/TeamTaskTimesheetManager.vue';

import TeamProjectFormModal from '@/components/team/TeamProjectFormModal.vue'
import TeamTaskFormModal from '@/components/team/TeamTaskFormModal.vue'
import TeamMeetingFormModal from '@/components/team/TeamMeetingFormModal.vue'
import TeamBAUFormModal from '@/components/team/TeamBAUFormModal.vue'
import Toast from '@/components/Toast.vue'
import EmojiPicker from '@/components/EmojiPicker.vue'

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

// State untuk attachment
const fileInputRef = ref(null);
const projectAttachments = ref([]);
const loadingAttachments = ref(false);
const uploadingFile = ref(false);
const currentFileToDelete = ref(null);
const showDeleteFileConfirm = ref(false);

const showPreviewModal = ref(false);
const previewFile = ref(null);
const previewLoading = ref(false);
const previewContent = ref('');

const taskAttachments = ref([])
const loadingTaskAttachments = ref(false)
const taskFileInputRef = ref(null)
const uploadingTaskFile = ref(false)
const showTaskAttachmentUpload = ref(false)
const showDeleteTaskFileConfirm = ref(false)
const currentTaskFileToDelete = ref(null)

// Tambahkan state berikut
const chatFileInputRef = ref(null)
const chatAttachment = ref(null)
const uploadingChatAttachment = ref(false)
const showEmojiPicker = ref(false)

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
        progress: progress,
        auto_timesheet: true
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
        project_id: projectId.value,
        include_attachments: true // Tambahkan parameter ini
      }
    });

    if (response.data.result?.status === 'success') {
      project.value = response.data.result.data;
      
      // Jika API mengembalikan attachments, gunakan itu
      if (response.data.result.data.attachments) {
        projectAttachments.value = response.data.result.data.attachments;
      }
      
      showToast({
        message: 'Project details loaded successfully',
        type: 'success'
      });
      
      // If there's a group, fetch messages
      if (project.value.group_id) {
        fetchGroupMessages(project.value.group_id);
      }
    } else {
      throw new Error(response.data.result?.message || 'Failed to fetch project details');
    }
  } catch (error) {
    console.error('Error fetching project:', error);
    showToast({
      message: error.message || 'Failed to load project details',
      type: 'error'
    });
  }
};

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
        group_id: groupId,
        include_attachments: true // Tambahkan parameter ini untuk memuat attachment
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
// Method untuk mengelola emoji
const toggleEmojiPicker = () => {
  showEmojiPicker.value = !showEmojiPicker.value
}

const addEmoji = (emoji) => {
  newMessage.value += emoji
  showEmojiPicker.value = false
  
  // Focus kembali ke input setelah tambah emoji
  nextTick(() => {
    mentionInputRef.value?.focus()
  })
}

// Method untuk mengelola attachment pada chat
const handleChatFileUpload = () => {
  chatFileInputRef.value.click()
}

const onChatFileChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    processChatFile(file)
  }
}

const processChatFile = (file) => {
  // Validasi ukuran file (maksimal 20 MB)
  const maxSize = 20 * 1024 * 1024 // 20 MB
  if (file.size > maxSize) {
    showToast({
      message: 'File size is too large. Maximum allowed is 20 MB.',
      type: 'error'
    })
    return
  }
  
  // Validasi tipe file
  const validTypes = [
    'image/jpeg', 'image/png', 'image/gif', 
    'application/pdf', 
    'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain',
    'application/zip', 'application/x-rar-compressed'
  ]
  
  if (!validTypes.includes(file.type)) {
    showToast({
      message: 'File type is not allowed.',
      type: 'error'
    })
    return
  }
  
  // Set file ke state untuk preview
  chatAttachment.value = {
    file: file,
    name: file.name,
    size: file.size,
    type: file.type,
    isImage: file.type.startsWith('image/')
  }
  
  // Reset file input
  if (chatFileInputRef.value) {
    chatFileInputRef.value.value = null
  }
}

const removeChatAttachment = () => {
  chatAttachment.value = null
}

// Modifikasi sendMessage untuk mendukung attachment
const sendMessage = async () => {
  // Jika tidak ada pesan atau attachment, jangan kirim
  if (!newMessage.value.trim() && !chatAttachment.value) return
  
  // Jika tidak ada group ID atau project ID, jangan kirim
  if (!project.value?.group_id) return
  
  try {
    if (chatAttachment.value) {
      // Jika ada attachment, upload file dulu
      uploadingChatAttachment.value = true
      
      // Create form data untuk upload file
      const formData = new FormData()
      formData.append('file', chatAttachment.value.file)
      
      // Upload file
      const uploadResponse = await apiClient.post('/web/v2/team/upload_temporary_attachment', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      // Periksa hasil upload
      if (!uploadResponse.data.status === 'success' || !uploadResponse.data.data.id) {
        throw new Error(uploadResponse.data.message || 'Failed to upload file')
      }
      
      // Simpan ID attachment untuk dikirim dengan pesan
      const attachmentId = uploadResponse.data.data.id
      
      // Kirim pesan dengan attachment
      const response = await apiClient.post('/web/v2/team/chat/send', {
        jsonrpc: '2.0',
        id: new Date().getTime(),
        params: {
          group_id: project.value.group_id,
          content: newMessage.value || `Shared a file: ${chatAttachment.value.name}`,
          message_type: 'regular',
          project_id: projectId.value,
          attachment_ids: [attachmentId],
          mentions: mentionInputRef.value ? mentionInputRef.value.extractMentions(newMessage.value).map(m => m.id) : []
        }
      })
      
      if (response.data.result?.status === 'success') {
        // Add the new message to the list
        groupMessages.value.unshift(response.data.result.data)
        newMessage.value = ''
        removeChatAttachment()
        
        // Focus input again after sending
        nextTick(() => {
          mentionInputRef.value?.focus()
        })
      } else {
        throw new Error(response.data.result?.message || 'Failed to send message')
      }
    } else {
      // Kirim pesan tanpa attachment (seperti implementasi sebelumnya)
      const response = await apiClient.post('/web/v2/team/chat/send', {
        jsonrpc: '2.0',
        id: new Date().getTime(),
        params: {
          group_id: project.value.group_id,
          content: newMessage.value,
          message_type: 'regular',
          project_id: projectId.value,
          mentions: mentionInputRef.value ? mentionInputRef.value.extractMentions(newMessage.value).map(m => m.id) : []
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
    }
  } catch (error) {
    console.error('Error sending message:', error)
    showToast({
      message: error.message || 'Failed to send message',
      type: 'error'
    })
  } finally {
    uploadingChatAttachment.value = false
  }
}


const formatMessageContent = (content) => {
  if (!content) return ''
  
  // Ganti @[id:name] dengan span yang distyle khusus
  let formattedContent = content.replace(/@\[(\d+):([^\]]+)\]/g, (match, id, name) => {
    return `<span class="inline-block bg-red-50 text-red-600 px-1 py-0.5 rounded">@${name}</span>`
  })
  
  // Konversi emoji characters untuk menjadi lebih dinamis
  // Catatan: Emoji sudah proper di string, jadi tidak perlu konversi khusus

  return formattedContent
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

// Fetch project attachments
const fetchProjectAttachments = async () => {
  if (!projectId.value) return;
  
  loadingAttachments.value = true;
  try {
    const response = await apiClient.post('/web/v2/team/project/attachments', {
      jsonrpc: '2.0',
      id: new Date().getTime(),
      params: {
        operation: 'list',
        project_id: projectId.value
      }
    });

    if (response.data.result?.status === 'success') {
      projectAttachments.value = response.data.result.data || [];
    } else {
      console.error('Error fetching attachments:', response.data.result?.message);
    }
  } catch (error) {
    console.error('Error fetching attachments:', error);
    showToast({
      message: 'Failed to load attachments',
      type: 'error'
    });
  } finally {
    loadingAttachments.value = false;
  }
};

// Handler for clicking the upload button
const handleFileUpload = () => {
  fileInputRef.value.click();
};

const debouncedUpload = debounce(async (file) => {
  // Isi fungsi upload yang sudah ada
}, 300);

// Handler for file input change
const onFileChange = async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  
  // Validasi ukuran file (maksimal 20 MB)
  const maxSize = 20 * 1024 * 1024; // 20 MB
  if (file.size > maxSize) {
    showToast({
      message: 'File size is too large. Maximum allowed is 20 MB.',
      type: 'error'
    });
    event.target.value = null;
    return;
  }
  
  // Validasi tipe file
  const validTypes = [
    'image/jpeg', 'image/png', 'image/gif', 
    'application/pdf', 
    'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain',
    'application/zip', 'application/x-rar-compressed'
  ];
  
  if (!validTypes.includes(file.type)) {
    showToast({
      message: 'File type is not allowed.',
      type: 'error'
    });
    event.target.value = null;
    return;
  }

  debouncedUpload(file);
  
  uploadingFile.value = true;
  
  try {
    // Create form data
    const formData = new FormData();
    formData.append('project_id', projectId.value);
    formData.append('file', file);
    
    // Use axios directly without the jsonrpc wrapper
    const response = await apiClient.post('/web/v2/team/project/upload_attachment', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    const result = response.data;
    
    if (result.status === 'success') {
      showToast({
        message: 'File uploaded successfully',
        type: 'success'
      });
      // Refresh attachments list
      await fetchProjectAttachments();
    } else {
      throw new Error(result.message || 'Upload failed');
    }
  } catch (error) {
    console.error('Error uploading file:', error);
    showToast({
      message: error.message || 'Failed to upload file',
      type: 'error'
    });
  } finally {
    uploadingFile.value = false;
    // Reset file input
    event.target.value = null;
  }
};

// Confirm file deletion
const confirmDeleteFile = (file) => {
  currentFileToDelete.value = file;
  showDeleteFileConfirm.value = true;
};

// Delete file
const deleteFile = async () => {
  if (!currentFileToDelete.value) return;
  
  try {
    const response = await apiClient.post('/web/v2/team/project/attachments', {
      jsonrpc: '2.0',
      id: new Date().getTime(),
      params: {
        operation: 'remove',
        project_id: projectId.value,
        attachment_id: currentFileToDelete.value.id
      }
    });

    if (response.data.result?.status === 'success') {
      showToast({
        message: 'File deleted successfully',
        type: 'success'
      });
      // Refresh attachments list
      await fetchProjectAttachments();
    } else {
      throw new Error(response.data.result?.message || 'Deletion failed');
    }
  } catch (error) {
    console.error('Error deleting file:', error);
    showToast({
      message: error.message || 'Failed to delete file',
      type: 'error'
    });
  } finally {
    showDeleteFileConfirm.value = false;
    currentFileToDelete.value = null;
  }
};

// Download file
const downloadFile = (file) => {
  if (file.url) {
    window.open(file.url, '_blank');
  }
};


const formatTimestamp = (timestamp) => {
  if (!timestamp) return '';
  
  const date = new Date(timestamp);
  return new Intl.DateTimeFormat('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  }).format(date);
};


// Menjadi ini
// const openFilePreview = async (file) => {
//   previewLoading.value = true;
//   previewFile.value = file;
//   showPreviewModal.value = true;
  
//   // For text files, fetch content
//   if (isTextFile(file)) {
//     try {
//       const response = await fetch(file.url);
//       previewContent.value = await response.text();
//     } catch (error) {
//       console.error('Error loading text preview:', error);
//       previewContent.value = 'Error loading file content.';
//     }
//   }
  
//   previewLoading.value = false;
// };

// Close preview modal
const closePreview = () => {
  showPreviewModal.value = false;
  previewFile.value = null;
  previewContent.value = '';
};

const getSecurePreviewUrl = (url) => {
  if (!url) return '';
  
  // Jika URL sudah mengandung parameter, tambahkan session token
  if (url.includes('?')) {
    return `${url}&session_token=${getSessionToken()}`;
  }
  // Jika tidak, tambahkan tanda tanya dulu
  return `${url}?session_token=${getSessionToken()}`;
};

// Function untuk mendapatkan session token dari cookies (jika tersedia)
const getSessionToken = () => {
  // Coba dapatkan token dari cookie atau local storage
  // Ini contoh simple, Anda perlu menyesuaikan dengan implementasi autentikasi Anda
  return localStorage.getItem('session_token') || '';
};

// Tambahkan method ini di dalam script setup
const fetchTaskAttachments = async (taskId) => {
  if (!taskId) return
  
  loadingTaskAttachments.value = true
  try {
    const response = await apiClient.post('/web/v2/team/get_attachments', {
      jsonrpc: '2.0',
      id: new Date().getTime(),
      params: {
        model: 'team.project.task',
        res_id: taskId
      }
    })

    if (response.data.result?.status === 'success') {
      taskAttachments.value = response.data.result.data || []
    } else {
      throw new Error(response.data.result?.message || 'Failed to fetch attachments')
    }
  } catch (error) {
    console.error('Error fetching task attachments:', error)
    taskAttachments.value = []
  } finally {
    loadingTaskAttachments.value = false
  }
}

// Modifikasi method showTaskDetail untuk memuat attachment
const showTaskDetail = (task) => {
  // Jika task sama, jangan mengaturnya lagi
  if (selectedTask.value && selectedTask.value.id === task.id) {
    console.log(`Task ${task.id} already selected, just showing modal`)
    showTaskDetailModal.value = true
    return
  }
  
  console.log(`Setting selectedTask to task ID: ${task.id}`)
  selectedTask.value = { ...task } // Copy task untuk mencegah mutasi langsung
  showTaskDetailModal.value = true
  
  // Fetch detail task hanya jika belum lengkap
  if (!task.checklists) {
    console.log(`Fetching details for task ID: ${task.id}`)
    fetchTaskDetails(task.id)
  }
  
  // Fetch task attachments
  fetchTaskAttachments(task.id)
}

// File upload handlers for task
const handleTaskFileUpload = () => {
  taskFileInputRef.value.click()
}

const onTaskFileDrop = (event) => {
  const file = event.dataTransfer.files[0]
  if (file) {
    uploadTaskFile(file)
  }
}

const onTaskFileChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    uploadTaskFile(file)
  }
}

const uploadTaskFile = async (file) => {
  if (!selectedTask.value || !selectedTask.value.id) {
    showToast({
      message: 'Task not found. Please try again.',
      type: 'error'
    })
    return
  }

  // Validasi ukuran file (maksimal 20 MB)
  const maxSize = 20 * 1024 * 1024 // 20 MB
  if (file.size > maxSize) {
    showToast({
      message: 'File size is too large. Maximum allowed is 20 MB.',
      type: 'error'
    })
    return
  }
  
  // Validasi tipe file
  const validTypes = [
    'image/jpeg', 'image/png', 'image/gif', 
    'application/pdf', 
    'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain',
    'application/zip', 'application/x-rar-compressed'
  ]
  
  if (!validTypes.includes(file.type)) {
    showToast({
      message: 'File type is not allowed.',
      type: 'error'
    })
    return
  }

  uploadingTaskFile.value = true
  
  try {
    // Create form data
    const formData = new FormData()
    formData.append('model', 'team.project.task')
    formData.append('res_id', selectedTask.value.id)
    formData.append('file', file)
    
    // Use axios directly for file upload
    const response = await apiClient.post('/web/v2/team/upload_attachment', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    
    const result = response.data
    
    if (result.status === 'success') {
      showToast({
        message: 'File uploaded successfully',
        type: 'success'
      })
      // Refresh attachments list
      await fetchTaskAttachments(selectedTask.value.id)
    } else {
      throw new Error(result.message || 'Upload failed')
    }
  } catch (error) {
    console.error('Error uploading file:', error)
    showToast({
      message: error.message || 'Failed to upload file',
      type: 'error'
    })
  } finally {
    uploadingTaskFile.value = false
    // Reset file input
    if (taskFileInputRef.value) {
      taskFileInputRef.value.value = null
    }
    
    // Hide the upload modal if still showing
    showTaskAttachmentUpload.value = false
  }
}

const confirmDeleteTaskFile = (file) => {
  currentTaskFileToDelete.value = file
  showDeleteTaskFileConfirm.value = true
}

const deleteTaskFile = async () => {
  if (!currentTaskFileToDelete.value) return
  
  try {
    const response = await apiClient.post('/web/v2/team/delete_attachment', {
      jsonrpc: '2.0',
      id: new Date().getTime(),
      params: {
        attachment_id: currentTaskFileToDelete.value.id
      }
    })

    if (response.data.result?.status === 'success') {
      showToast({
        message: 'File deleted successfully',
        type: 'success'
      })
      // Refresh attachments list
      await fetchTaskAttachments(selectedTask.value.id)
    } else {
      throw new Error(response.data.result?.message || 'Deletion failed')
    }
  } catch (error) {
    console.error('Error deleting file:', error)
    showToast({
      message: error.message || 'Failed to delete file',
      type: 'error'
    })
  } finally {
    showDeleteTaskFileConfirm.value = false
    currentTaskFileToDelete.value = null
  }
}

// File preview related functions
const canPreviewFile = (file) => {
  return isImageFile(file) || isPdfFile(file) || isTextFile(file)
}

const isImageFile = (file) => {
  return file?.mimetype?.startsWith('image/')
}

const isPdfFile = (file) => {
  return file?.mimetype === 'application/pdf'
}

const isTextFile = (file) => {
  const textTypes = [
    'text/plain', 
    'text/html', 
    'text/css', 
    'text/javascript',
    'application/json',
    'application/xml'
  ]
  return textTypes.includes(file?.mimetype)
}

const openFilePreview = (file) => {
  // Reuse existing previewFile functionality from the project attachments
  previewLoading.value = true
  previewFile.value = file
  showPreviewModal.value = true
  
  // For text files, fetch content
  if (isTextFile(file)) {
    fetchTextFileContent(file)
  }
  
  previewLoading.value = false
}

const fetchTextFileContent = async (file) => {
  try {
    const response = await fetch(file.url)
    previewContent.value = await response.text()
  } catch (error) {
    console.error('Error loading text preview:', error)
    previewContent.value = 'Error loading file content.'
  }
}

const getFileIconClass = (mimetype) => {
  if (!mimetype) return 'bg-gray-100'
  
  if (mimetype.startsWith('image/')) return 'bg-blue-50'
  if (mimetype.includes('pdf')) return 'bg-red-50'
  if (mimetype.includes('word') || mimetype.includes('document')) return 'bg-blue-50'
  if (mimetype.includes('excel') || mimetype.includes('spreadsheet')) return 'bg-green-50'
  if (mimetype.includes('zip') || mimetype.includes('compressed')) return 'bg-yellow-50'
  
  return 'bg-gray-50'
}

const getFileIconColor = (mimetype) => {
  if (!mimetype) return 'text-gray-500'
  
  if (mimetype.includes('pdf')) return 'text-red-500'
  if (mimetype.includes('word') || mimetype.includes('document')) return 'text-blue-500'
  if (mimetype.includes('excel') || mimetype.includes('spreadsheet')) return 'text-green-500'
  if (mimetype.includes('zip') || mimetype.includes('compressed')) return 'text-yellow-500'
  
  return 'text-gray-500'
}

const formatFileSize = (bytes) => {
  if (!bytes) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
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


// Helper untuk mendeteksi click di luar emoji picker
const handleClickOutside = (event) => {
  if (showEmojiPicker.value) {
    // Jika target click bukan emoji button atau emoji picker, tutup picker
    const emojiPickerElement = document.querySelector('.emoji-picker')
    const emojiButtonElement = document.querySelector('.emoji-button')
    
    if (emojiPickerElement && !emojiPickerElement.contains(event.target) && 
        emojiButtonElement && !emojiButtonElement.contains(event.target)) {
      showEmojiPicker.value = false
    }
  }
}


// Lifecycle
onMounted(() => {
  fetchDepartments();
  fetchProjectDetail();
  fetchProjectAttachments(); // Tambahkan ini
});

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

// Tambahkan watch untuk projectId
watch(() => projectId.value, (newId) => {
  if (newId) {
    fetchProjectAttachments();
  }
});
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

@media (max-width: 640px) {
  .max-w-4xl {
    max-width: 100%;
    margin-left: 0;
    margin-right: 0;
    border-radius: 0;
  }
  
  /* Adjust padding and margins for smaller screens */
  .max-h-\[70vh\] {
    max-height: 85vh;
  }
}
</style>