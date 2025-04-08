<!-- src/components/team/TeamTaskDetailManager.vue -->
<!-- src/components/team/TeamTaskDetailManager.vue -->
<template>
  <!-- Modal Popup untuk Detail Task -->
  <Teleport to="body">
    <div 
      v-if="show" 
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
          @click="closeModal"
        ></div>

        <!-- Modal panel -->
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div 
          class="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full"
        >
          <!-- Loading state -->
          <div v-if="loading" class="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center z-10">
            <div class="animate-spin rounded-full h-8 w-8 border-2 border-red-600 border-t-transparent"></div>
          </div>

          <!-- Header with Gradient -->
          <div class="relative bg-gradient-to-r from-rose-600 to-rose-500 px-6 py-4">
            <div class="flex items-center justify-between">
              <h3 class="text-xl font-medium text-white">Task Details</h3>
              <button @click="closeModal" class="text-white hover:text-gray-200 focus:outline-none">
                <span class="sr-only">Close</span>
                <X class="h-5 w-5" />
              </button>
            </div>
          </div>
          
          <!-- Task Title Section -->
          <div class="px-6 pt-5 pb-4 border-b border-gray-100">
            <h2 class="text-xl font-semibold text-gray-900">{{ task.name }}</h2>
            
            <!-- Status and Priority Badges -->
            <div class="flex flex-wrap gap-2 mt-3">
              <!-- Status Badge -->
              <div 
                class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                :class="{
                  'bg-yellow-100 text-yellow-800': task.state === 'in_progress',
                  'bg-green-100 text-green-800': task.state === 'done',
                  'bg-gray-100 text-gray-800': task.state === 'draft',
                  'bg-purple-100 text-purple-800': task.state === 'planned',
                  'bg-blue-100 text-blue-800': task.state === 'review'
                }"
              >
                <div class="w-2 h-2 rounded-full mr-2"
                  :class="{
                    'bg-yellow-500': task.state === 'in_progress',
                    'bg-green-500': task.state === 'done',
                    'bg-gray-500': task.state === 'draft',
                    'bg-purple-500': task.state === 'planned',
                    'bg-blue-500': task.state === 'review'
                  }"
                ></div>
                {{ formatStatus(task.state) }}
              </div>
              
              <!-- Priority Badge -->
              <div 
                v-if="task.priority"
                class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                :class="{
                  'bg-blue-100 text-blue-800': task.priority === '0',
                  'bg-green-100 text-green-800': task.priority === '1',
                  'bg-orange-100 text-orange-800': task.priority === '2',
                  'bg-red-100 text-red-800': task.priority === '3'
                }"
              >
                <Flag class="w-3.5 h-3.5 mr-1.5" />
                {{ formatPriority(task.priority) }} Priority
              </div>
              
              <!-- Task Type Badge (if available) -->
              <div v-if="task.type?.name" class="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-sm font-medium">
                <Bookmark class="w-3.5 h-3.5 mr-1.5" />
                {{ task.type.name }}
              </div>
            </div>
          </div>
          
          <!-- Task Details Content -->
          <div class="px-6 py-4 max-h-[80vh] overflow-y-auto custom-scrollbar">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <!-- Left Column: Task Information -->
              <div class="space-y-5">
                <!-- File Attachments Section -->
                <div class="bg-gray-50 rounded-lg p-5 border border-gray-100">
                  <div class="flex items-center justify-between mb-3">
                    <h4 class="text-sm font-medium text-gray-700 flex items-center">
                      <Paperclip class="w-4 h-4 mr-1.5 text-red-500" />
                      Attachments
                    </h4>
                    <button
                      @click="showTaskAttachmentUpload = true"
                      class="inline-flex items-center px-2 py-1 border border-transparent rounded-md text-xs font-medium text-white bg-gradient-to-r from-rose-500 to bg-rose-600 focus:outline-none"
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
                        {{ formatDateTime(task.dates?.planned_start) || 'Not set' }}
                      </div>
                    </div>
                    <div>
                      <div class="text-xs text-gray-500 mb-1">Due Date</div>
                      <div 
                        class="text-sm font-medium"
                        :class="{'text-red-600': isOverdue(task.dates?.planned_end)}"
                      >
                        {{ formatDateTime(task.dates?.planned_end) || 'Not set' }}
                        <span v-if="isOverdue(task.dates?.planned_end)" class="text-xs ml-1.5 font-normal text-red-500">(Overdue)</span>
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
                    <div class="text-sm font-medium">Completion: {{ task.progress || 0 }}%</div>
                    <div class="text-xs text-gray-500">
                      {{ task.hours?.actual || 0 }}/{{ task.hours?.planned || 0 }} hours
                    </div>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      class="h-2.5 rounded-full transition-all duration-300"
                      :class="{
                        'bg-red-500': (task.progress || 0) < 30,
                        'bg-orange-500': (task.progress || 0) >= 30 && (task.progress || 0) < 70,
                        'bg-green-500': (task.progress || 0) >= 70
                      }"
                      :style="{ width: `${task.progress || 0}%` }"
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
                    <div v-for="person in task.assigned_to" :key="person.id" class="flex items-center">
                      <div class="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                        <span class="text-sm font-medium text-red-600">
                          {{ getInitials(person.name) }}
                        </span>
                      </div>
                      <span class="ml-3 text-sm">{{ person.name }}</span>
                    </div>
                    <div v-if="!task.assigned_to || task.assigned_to.length === 0" class="text-sm text-gray-500 italic">
                      No team members assigned
                    </div>
                  </div>
                </div>
                
                <!-- Project Info -->
                <div class="bg-gray-50 rounded-lg p-5 border border-gray-100">
                  <h4 class="text-sm font-medium text-gray-700 mb-3 flex items-center">
                    <Folder class="w-4 h-4 mr-1.5 text-red-500" />
                    Project
                  </h4>
                  <div class="text-sm text-gray-800">
                    {{ task.project ? task.project.name : 'Not assigned to a project' }}
                  </div>
                </div>
                
                <!-- Description -->
                <div class="bg-gray-50 rounded-lg p-5 border border-gray-100">
                  <h4 class="text-sm font-medium text-gray-700 mb-3 flex items-center">
                    <AlignLeft class="w-4 h-4 mr-1.5 text-red-500" />
                    Description
                  </h4>
                  <div 
                    class="prose prose-sm max-w-none text-gray-700" 
                    v-html="task.description || 'No description provided'"
                  ></div>
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
                      {{ task.checklist_progress || 0 }}% Complete
                    </div>
                  </div>
                  
                  <div class="mb-3 w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      class="bg-green-500 h-1.5 rounded-full" 
                      :style="{ width: `${task.checklist_progress || 0}%` }"
                    ></div>
                  </div>
                  
                  <TeamTaskChecklistManager 
                    :taskId="taskId" 
                    :employees="getTaskAssignees()"
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
                    :taskId="taskId" 
                    :employees="getTaskAssignees()"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <!-- Footer Actions -->
          <div class="bg-gray-50 px-6 py-4 flex flex-wrap justify-between gap-3 border-t border-gray-100">
            <!-- Tab Navigation for small screens -->
            <div class="sm:hidden flex space-x-2">
              <button
                @click="currentTab = 'checklist'"
                class="px-3 py-1.5 text-xs font-medium rounded-md"
                :class="currentTab === 'checklist' 
                  ? 'bg-red-100 text-red-700 border border-red-300' 
                  : 'border border-gray-300 text-gray-700 bg-white'"
              >
                Checklist
              </button>
              <button
                @click="currentTab = 'timesheets'"
                class="px-3 py-1.5 text-xs font-medium rounded-md"
                :class="currentTab === 'timesheets' 
                  ? 'bg-red-100 text-red-700 border border-red-300' 
                  : 'border border-gray-300 text-gray-700 bg-white'"
              >
                Timesheets
              </button>
            </div>
            
            <div class="flex gap-3 ml-auto">
              <button
                @click="closeModal"
                class="px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Close
              </button>
              <button
                @click="editTask"
                class="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-rose-600 to-rose-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 flex items-center"
              >
                <Edit class="w-4 h-4 mr-1.5" />
                Edit Task
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>

  <!-- Tambahkan setelah template utama -->

  <!-- Task Attachment Upload Modal -->
  <Teleport to="body">
    <div 
      v-if="showTaskAttachmentUpload" 
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
          <div class="bg-gradient-to-r from-indigo-600 to-indigo-400 px-4 py-3 sm:px-6">
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
  </Teleport>

  <!-- Delete Task File Confirmation Dialog -->
  <Teleport to="body">
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

  <!-- File Preview Modal -->
  <Teleport to="body">
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
                class="mt-4 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gradient-to-r from-rose-600 to-rose-500"
              >
                <Download class="w-4 h-4 mr-2" />
                Download File
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { useToast } from '@/composables/useToast';
import apiClient from '@/config/api';
import { format, isPast } from 'date-fns';
import {
  Calendar,
  Activity,
  Users,
  Folder,
  AlignLeft,
  CheckSquare,
  Clock,
  FileText,
  Flag,
  Edit,
  Paperclip, 
  UploadCloud, 
  Download, 
  Image,
  Eye,
  X,
  Trash2,
  Bookmark
} from 'lucide-vue-next';
import TeamTaskChecklistManager from '@/components/team/TeamTaskChecklistManager.vue';
import TeamTaskTimesheetManager from '@/components/team/TeamTaskTimesheetManager.vue';

// Props dan Emits
const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  taskId: {
    type: [Number, String],
    required: true
  }
});

const emit = defineEmits(['update:task', 'edit:task', 'close']);

// Data
const { toast, showToast } = useToast();
const task = ref({});
const loading = ref(false);
const currentTab = ref(''); // Empty means no tab is active, show summary view

// File attachment related
const taskAttachments = ref([]);
const loadingTaskAttachments = ref(false);
const taskFileInputRef = ref(null);
const uploadingTaskFile = ref(false);
const showTaskAttachmentUpload = ref(false);
const showDeleteTaskFileConfirm = ref(false);
const currentTaskFileToDelete = ref(null);

// File preview related
const showPreviewModal = ref(false);
const previewFile = ref(null);
const previewLoading = ref(false);
const previewContent = ref('');

// Utility Functions

const formatDateTime = (dateString) => {
  if (!dateString) return null;
  
  try {
    const date = new Date(dateString);
    return format(date, 'dd MMM yyyy HH:mm');
  } catch (e) {
    console.error('Error formatting date:', e);
    return dateString;
  }
};

const isOverdue = (dateString) => {
  if (!dateString) return false;
  
  try {
    const dueDate = new Date(dateString);
    const now = new Date();
    
    return dueDate < now && task.value.state !== 'done' && task.value.state !== 'cancelled';
  } catch (e) {
    return false;
  }
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

const formatPriority = (priority) => {
  const priorityMap = {
    '0': 'Low',
    '1': 'Medium',
    '2': 'High',
    '3': 'Critical'
  };
  return priorityMap[priority] || 'Medium';
};

const editTask = () => {
  emit('edit:task', task.value);
  closeModal();
};

const closeModal = () => {
  currentTab.value = ''; // Reset tab
  emit('close');
};

// Helper to get assignees for the checklist component
const getTaskAssignees = () => {
  if (!task.value || !task.value.assigned_to) return [];
  return task.value.assigned_to.map(person => ({
    id: person.id,
    name: person.name
  }));
};

// Helper to get initials from name
const getInitials = (name) => {
  if (!name) return '';
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

// API Functions

// Fetch task details
const fetchTaskDetails = async () => {
  if (!props.taskId) return;
  
  loading.value = true;
  try {
    const response = await apiClient.post('/web/v2/team/tasks', {
      jsonrpc: '2.0',
      method: 'call',
      params: {
        operation: 'read',
        task_id: parseInt(props.taskId)
      }
    });
    
    if (response.data.result?.status === 'success') {
      task.value = response.data.result.data || {};
      emit('update:task', task.value);
      
      // Fetch task attachments after task details are loaded
      fetchTaskAttachments(props.taskId);
    } else {
      showToast({
        message: 'Error fetching task details: ' + 
          (response.data.result?.message || 'Unknown error'),
        type: 'error'
      });
    }
  } catch (error) {
    console.error('Error fetching task details:', error);
    showToast({
      message: 'Failed to load task details. Please try again.',
      type: 'error'
    });
  } finally {
    loading.value = false;
  }
};

// Fetch task attachments
const fetchTaskAttachments = async (taskId) => {
  if (!taskId) return;
  
  loadingTaskAttachments.value = true;
  try {
    const response = await apiClient.post('/web/v2/team/get_attachments', {
      jsonrpc: '2.0',
      id: new Date().getTime(),
      params: {
        model: 'team.project.task',
        res_id: parseInt(taskId)
      }
    });

    if (response.data.result?.status === 'success') {
      taskAttachments.value = response.data.result.data || [];
    } else {
      throw new Error(response.data.result?.message || 'Failed to fetch attachments');
    }
  } catch (error) {
    console.error('Error fetching task attachments:', error);
    taskAttachments.value = [];
    showToast({
      message: 'Failed to load attachments. Please try again.',
      type: 'error'
    });
  } finally {
    loadingTaskAttachments.value = false;
  }
};

// Update task progress
const updateTaskProgress = async (progress) => {
  try {
    const response = await apiClient.post('/web/v2/team/tasks', {
      jsonrpc: '2.0',
      method: 'call',
      params: {
        operation: 'update',
        task_id: parseInt(props.taskId),
        progress: progress,
        auto_timesheet: true
      }
    });
    
    if (response.data.result?.status === 'success') {
      task.value = response.data.result.data;
      emit('update:task', task.value);
      
      // Tampilkan sukses toast
      showToast({
        message: 'Task progress updated successfully',
        type: 'success'
      });
    } else {
      console.error('Error updating task progress:', response.data.result?.message);
      showToast({
        message: response.data.result?.message || 'Failed to update task progress',
        type: 'error'
      });
    }
  } catch (error) {
    console.error('Error updating task progress:', error);
    showToast({
      message: 'Failed to update task progress',
      type: 'error'
    });
  }
};

// File Management Functions

// File upload handlers
const handleTaskFileUpload = () => {
  taskFileInputRef.value.click();
};

const onTaskFileDrop = (event) => {
  const file = event.dataTransfer.files[0];
  if (file) {
    uploadTaskFile(file);
  }
};

const onTaskFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    uploadTaskFile(file);
  }
};

const uploadTaskFile = async (file) => {
  if (!props.taskId) {
    showToast({
      message: 'Task not found. Please try again.',
      type: 'error'
    });
    return;
  }

  // Validasi ukuran file (maksimal 20 MB)
  const maxSize = 20 * 1024 * 1024; // 20 MB
  if (file.size > maxSize) {
    showToast({
      message: 'File size is too large. Maximum allowed is 20 MB.',
      type: 'error'
    });
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
    return;
  }

  uploadingTaskFile.value = true;
  
  try {
    // Create form data
    const formData = new FormData();
    formData.append('model', 'team.project.task');
    formData.append('res_id', parseInt(props.taskId));
    formData.append('file', file);
    
    // Use axios directly for file upload - endpoint sesuai dengan ProjectDetail
    const response = await apiClient.post('/web/v2/team/upload_attachment', formData, {
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
      await fetchTaskAttachments(props.taskId);
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
    uploadingTaskFile.value = false;
    // Reset file input
    if (taskFileInputRef.value) {
      taskFileInputRef.value.value = null;
    }
    
    // Hide the upload modal if still showing
    showTaskAttachmentUpload.value = false;
  }
};

// Confirm delete file
const confirmDeleteTaskFile = (file) => {
  currentTaskFileToDelete.value = file;
  showDeleteTaskFileConfirm.value = true;
};

// Delete file
const deleteTaskFile = async () => {
  if (!currentTaskFileToDelete.value) return;
  
  try {
    const response = await apiClient.post('/web/v2/team/delete_attachment', {
      jsonrpc: '2.0',
      id: new Date().getTime(),
      params: {
        attachment_id: currentTaskFileToDelete.value.id
      }
    });

    if (response.data.result?.status === 'success') {
      showToast({
        message: 'File deleted successfully',
        type: 'success'
      });
      
      // Tutup preview modal jika file yang dihapus sedang ditampilkan
      if (previewFile.value && previewFile.value.id === currentTaskFileToDelete.value.id) {
        showPreviewModal.value = false;
        previewFile.value = null;
      }
      
      // Refresh attachments list
      await fetchTaskAttachments(props.taskId);
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
    showDeleteTaskFileConfirm.value = false;
    currentTaskFileToDelete.value = null;
  }
};

// Download file
const downloadFile = (file) => {
  if (file.url) {
    window.open(file.url, '_blank');
  }
};

// File Preview Functions

// File preview related functions
const canPreviewFile = (file) => {
  return isImageFile(file) || isPdfFile(file) || isTextFile(file);
};

const isImageFile = (file) => {
  return file?.mimetype?.startsWith('image/');
};

const isPdfFile = (file) => {
  return file?.mimetype === 'application/pdf';
};

const isTextFile = (file) => {
  const textTypes = [
    'text/plain', 
    'text/html', 
    'text/css', 
    'text/javascript',
    'application/json',
    'application/xml'
  ];
  return textTypes.includes(file?.mimetype);
};

const openFilePreview = (file) => {
  previewLoading.value = true;
  previewFile.value = file;
  showPreviewModal.value = true;
  
  // For text files, fetch content
  if (isTextFile(file)) {
    fetchTextFileContent(file);
  }
  
  previewLoading.value = false;
};

const fetchTextFileContent = async (file) => {
  try {
    const url = getSecurePreviewUrl(file.url);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch content: ${response.status}`);
    }
    previewContent.value = await response.text();
  } catch (error) {
    console.error('Error loading text preview:', error);
    previewContent.value = 'Error loading file content.';
    showToast({
      message: 'Failed to load file preview',
      type: 'error'
    });
  }
};

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
  return localStorage.getItem('session_token') || '';
};

const getFileIconClass = (mimetype) => {
  if (!mimetype) return 'bg-gray-100';
  
  if (mimetype.startsWith('image/')) return 'bg-blue-50';
  if (mimetype.includes('pdf')) return 'bg-red-50';
  if (mimetype.includes('word') || mimetype.includes('document')) return 'bg-blue-50';
  if (mimetype.includes('excel') || mimetype.includes('spreadsheet')) return 'bg-green-50';
  if (mimetype.includes('zip') || mimetype.includes('compressed')) return 'bg-yellow-50';
  
  return 'bg-gray-50';
};

const getFileIconColor = (mimetype) => {
  if (!mimetype) return 'text-gray-500';
  
  if (mimetype.includes('pdf')) return 'text-red-500';
  if (mimetype.includes('word') || mimetype.includes('document')) return 'text-blue-500';
  if (mimetype.includes('excel') || mimetype.includes('spreadsheet')) return 'text-green-500';
  if (mimetype.includes('zip') || mimetype.includes('compressed')) return 'text-yellow-500';
  
  return 'text-gray-500';
};

const formatFileSize = (bytes) => {
  if (!bytes) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Lifecycle Hooks
watch(() => props.show, (newShow) => {
  if (newShow && props.taskId) {
    fetchTaskDetails();
  }
  
  if (!newShow) {
    // Reset modal state when closing
    showTaskAttachmentUpload.value = false;
    showDeleteTaskFileConfirm.value = false;
    showPreviewModal.value = false;
    previewFile.value = null;
    previewContent.value = '';
    currentTaskFileToDelete.value = null;
  }
});

// Watch for changes in taskId
watch(() => props.taskId, (newTaskId) => {
  if (props.show && newTaskId) {
    fetchTaskDetails();
  }
});

// Initial fetch if modal is shown
onMounted(() => {
  if (props.show && props.taskId) {
    fetchTaskDetails();
  }
});
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

/* Animations for modal */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

@media (min-width: 1024px) {
  .lg\:grid-cols-2 {
    grid-template-columns: 45% 55%; /* Memberikan lebih banyak ruang ke kolom checklist/timesheet */
  }
}

@media (min-width: 1536px) {
  /* Untuk layar yang lebih besar */
  .sm\:max-w-6xl {
    max-width: 80rem; /* Memperbesar modal pada layar extra large */
  }
}
</style>