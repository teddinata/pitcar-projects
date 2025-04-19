<!-- src/components/team/TeamTaskFormModal.vue (Redesigned) -->
<template>
  <div 
    v-if="show" 
    class="fixed inset-0 z-50 overflow-y-auto"
    aria-labelledby="modal-title" 
    role="dialog" 
    aria-modal="true"
  >
    <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay with blur effect -->
      <div 
        class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity backdrop-blur-sm" 
        aria-hidden="true"
        @click="handleClose"
      ></div>

      <!-- Modal panel -->
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
      <div class="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-5xl sm:w-full">
        <!-- Header with Gradient -->
        <div class="bg-gradient-to-r from-rose-500 to-rose-600 px-6 py-4">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-medium text-white flex items-center">
                <CheckSquare v-if="!isEditMode" class="w-5 h-5 mr-2" />
                <Edit v-else class="w-5 h-5 mr-2" />
                {{ isEditMode ? 'Edit Task' : 'Create New Team Task' }}
              </h3>
              <p class="mt-1 text-sm text-rose-100">
                {{ isEditMode ? 'Update this task details' : 'Add a new task to this project' }}
              </p>
            </div>
            <button @click="handleClose" class="text-white hover:text-gray-200 focus:outline-none">
              <X class="h-5 w-5" />
            </button>
          </div>
        </div>
        <div class="p-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
          <form @submit.prevent="handleSubmit" class="space-y-5">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6">
              <!-- Left Column -->
              <div class="space-y-6">
                <!-- Task Information Card -->
                <div class="bg-gray-50 rounded-lg p-6 border border-gray-100">
                  <h3 class="text-sm font-medium text-gray-700 mb-4 flex items-center">
                    <FileText class="w-4 h-4 mr-1.5 text-rose-500" />
                    Task Information
                  </h3>
                  
                  <div class="space-y-4">
                    <!-- Task Name -->
                    <!-- Task Name - Tampilan yang ditingkatkan, lebih responsif -->
                    <div>
                      <label for="task-name" class="block text-sm font-medium text-gray-700 mb-1.5">
                        Task Name <span class="text-rose-500">*</span>
                      </label>
                      <div class="relative rounded-md shadow-sm">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FileText class="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                          id="task-name"
                          v-model="formData.name"
                          type="text"
                          required
                          class="block w-full pl-10 pr-3 py-2.5 sm:text-sm border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500"
                          placeholder="Masukkan judul tugas"
                          maxlength="200"
                        />
                      </div>
                      <!-- Karakter counter yang responsif -->
                      <div class="mt-1 flex justify-between items-center">
                        <p v-if="formData.name.length >= 80" 
                          :class="[
                            'text-xs', 
                            formData.name.length >= 180 ? 'text-rose-600 font-medium' : 'text-gray-500'
                          ]">
                          {{ formData.name.length }}/200 karakter
                        </p>
                        <!-- Menampilkan peringatan jika judul terlalu panjang -->
                        <p v-if="formData.name.length >= 100" class="text-xs text-amber-600">
                          <span class="inline-flex items-center">
                            <AlertCircle class="w-3 h-3 mr-1" />
                            Judul panjang mungkin terpotong di beberapa tampilan
                          </span>
                        </p>
                      </div>
                    </div>

                    <!-- Project -->
                    <div>
                      <label for="task-project" class="block text-sm font-medium text-gray-700 mb-1.5">
                        Project <span class="text-rose-500">*</span>
                      </label>
                      <div class="relative rounded-md shadow-sm">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FolderOpen class="h-4 w-4 text-gray-400" />
                        </div>
                        <select
                          id="task-project"
                          v-model="formData.project_id"
                          required
                          class="block w-full pl-10 pr-10 py-2.5 text-base border-gray-300 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm rounded-lg"
                          :disabled="!!props.projectId || isEditMode"
                        >
                          <option value="">Select project</option>
                          <option v-for="project in projects" :key="project.id" :value="project.id">
                            {{ project.name }}
                          </option>
                        </select>
                      </div>
                    </div>
                    
                    <!-- Task Type -->
                    <div>
                      <label for="task-type" class="block text-sm font-medium text-gray-700 mb-1.5">
                        Task Type
                      </label>
                      <div class="relative rounded-md shadow-sm">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Tag class="h-4 w-4 text-gray-400" />
                        </div>
                        <select
                          id="task-type"
                          v-model="formData.type_id"
                          class="block w-full pl-10 pr-10 py-2.5 text-base border-gray-300 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm rounded-lg"
                        >
                          <option value="">General</option>
                          <option v-for="type in taskTypes" :key="type.id" :value="type.id">
                            {{ type.name }}
                          </option>
                        </select>
                      </div>
                    </div>

                    <!-- Priority -->
                    <div>
                      <label for="task-priority" class="block text-sm font-medium text-gray-700 mb-1.5">
                        Prioritas <span class="text-rose-500">*</span>
                      </label>
                      <div class="relative rounded-md shadow-sm">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Flag class="h-4 w-4 text-gray-400" />
                        </div>
                        <select
                          id="task-priority"
                          v-model="formData.priority"
                          required
                          class="block w-full pl-10 pr-10 py-2.5 text-base border-gray-300 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm rounded-lg"
                        >
                          <option value="3" class="text-rose-700 font-medium">Critical (P0) - Masalah mendesak yang memerlukan perhatian segera</option>
                          <option value="2" class="text-amber-700 font-medium">High (P1) - Masalah penting yang perlu segera ditangani</option>
                          <option value="1" class="text-emerald-700 font-medium">Medium (P2) - Prioritas standar untuk pekerjaan reguler</option>
                          <option value="0" class="text-blue-700 font-medium">Low (P3) - Tugas yang dapat diselesaikan jika waktu memungkinkan</option>
                        </select>
                      </div>
                      <p class="mt-1 text-xs text-gray-500">
                        Pilih tingkat prioritas yang sesuai untuk tugas ini
                      </p>
                    </div>

                    <!-- Legenda Prioritas -->
                    <div class="mt-2 p-2 bg-gray-50 rounded-lg border border-gray-100 text-xs">
                      <div class="font-medium mb-1 text-gray-700">Panduan Prioritas:</div>
                      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div class="flex items-center">
                          <div class="h-3 w-3 bg-rose-500 rounded-full mr-2"></div>
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
                        <div class="flex items-center">
                          <AlignLeft class="w-4 h-4 mr-1.5 text-rose-500" />
                          Description
                        </div>
                      </label>
                      <div v-if="isUsingRichEditor">
                        <!-- Rich Text Editor Placeholder -->
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
                            v-model="formData.description"
                            rows="5"
                            class="block w-full text-sm border-0 focus:ring-0 focus:outline-none py-2 px-3"
                            placeholder="Provide details about this task"
                          ></textarea>
                        </div>
                        <div v-if="formData.description" class="mt-2">
                          <label class="block text-xs font-medium text-gray-500 mb-1">Preview:</label>
                          <div 
                            class="prose prose-sm max-w-none border border-gray-200 rounded-md p-3 bg-white"
                            v-html="formData.description"
                          ></div>
                        </div>
                      </div>
                      <div v-else>
                        <!-- Plain Text Area -->
                        <div class="mt-1 relative rounded-md shadow-sm">
                          <textarea
                            id="task-description"
                            v-model="formData.description"
                            rows="5"
                            class="block w-full text-sm border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:ring-rose-500 focus:border-rose-500"
                            placeholder="Provide details about this task"
                          ></textarea>
                        </div>
                        <div class="mt-1 flex justify-end">
                          <button 
                            type="button" 
                            class="text-xs text-rose-600 hover:text-rose-800"
                            @click="isUsingRichEditor = true"
                          >
                            Use Rich Editor
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Attachments Section -->
                <div class="bg-gray-50 rounded-lg p-6 border border-gray-100">
                  <h3 class="text-sm font-medium text-gray-700 mb-4 flex items-center">
                    <Paperclip class="w-4 h-4 mr-1.5 text-rose-500" />
                    Attachments
                  </h3>
                  
                  <!-- Current Attachments (Show in Edit Mode) -->
                  <div v-if="isEditMode && taskAttachments.length > 0" class="mb-3 space-y-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                    <div
                      v-for="file in taskAttachments" 
                      :key="file.id"
                      class="flex items-center justify-between p-2 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 transition"
                    >
                      <!-- File icon and details -->
                      <div class="flex items-center">
                        <!-- Icon based on file type -->
                        <div class="flex-shrink-0 mr-3 p-1.5 rounded-lg" :class="getFileIconClass(file.mimetype)">
                          <FileText v-if="!file.is_image" class="h-4 w-4" :class="getFileIconColor(file.mimetype)" />
                          <Image v-else class="h-4 w-4 text-blue-500" />
                        </div>
                        
                        <!-- File details -->
                        <div>
                          <div class="text-sm font-medium text-gray-900 truncate max-w-[200px]">{{ file.name }}</div>
                          <div class="text-xs text-gray-500">{{ formatFileSize(file.size) }}</div>
                        </div>
                      </div>
                      
                      <!-- Action buttons -->
                      <div class="flex space-x-1">
                        <button
                          @click="downloadFile(file)"
                          class="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                          title="Download"
                          type="button"
                        >
                          <Download class="h-3.5 w-3.5" />
                        </button>
                        
                        <button
                          @click="removeAttachment(file)"
                          class="p-1 text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                          title="Remove"
                          type="button"
                        >
                          <Trash2 class="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Upload Button and Dropzone -->
                  <div 
                    class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-rose-500 transition-colors cursor-pointer"
                    @click="handleFileUpload"
                    @dragover.prevent
                    @drop.prevent="onFileDrop"
                  >
                    <UploadCloud class="mx-auto h-8 w-8 text-gray-400" />
                    <p class="mt-1 text-sm text-gray-500">
                      <span class="font-medium text-rose-600 hover:text-rose-500">
                        Click to upload
                      </span>
                      or drag and drop
                    </p>
                    <p class="text-xs text-gray-500">
                      PDF, Word, Excel, images, or text files (max 20MB)
                    </p>
                  </div>
                  <input
                    ref="fileInputRef"
                    type="file"
                    @change="onFileChange"
                    class="hidden"
                  />
                  
                  <!-- Upload Progress -->
                  <div v-if="uploadingFile" class="mt-2">
                    <div class="w-full bg-gray-200 rounded-full h-2">
                      <div class="bg-rose-600 h-2 rounded-full animate-pulse" style="width: 100%"></div>
                    </div>
                    <p class="text-xs text-gray-500 mt-1">Uploading file...</p>
                  </div>
                </div>
              </div>

              <!-- Right Column -->
              <div class="space-y-6">
               <!-- Team Assignment Card yang Diperbaiki -->
                <div class="bg-gray-50 rounded-lg p-6 border border-gray-100">
                  <h3 class="text-sm font-medium text-gray-700 mb-4 flex items-center">
                    <Users class="w-4 h-4 mr-1.5 text-rose-500" />
                    Team Assignment
                  </h3>
                  
                  <div class="space-y-4">
                    <!-- Assigned To -->
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1.5">
                        Assigned Team Members <span class="text-rose-500">*</span>
                      </label>
                      <div v-if="formData.project_id" class="border border-gray-300 rounded-lg overflow-hidden bg-white">
                        <div v-if="getProjectTeamMembers(formData.project_id).length > 0" class="max-h-48 overflow-y-auto custom-scrollbar">
                          <div v-for="member in getProjectTeamMembers(formData.project_id)" :key="member.id"
                            class="flex items-center py-2.5 px-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0">
                            <div class="flex-shrink-0 mr-3">
                              <div class="h-8 w-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 font-medium uppercase text-xs">
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
                                v-model="formData.assigned_to"
                                class="h-4 w-4 rounded border-gray-300 text-rose-600 focus:ring-rose-500"
                              />
                            </div>
                          </div>
                        </div>
                        <div v-else-if="loading" class="p-4 text-center">
                          <div class="animate-spin rounded-full h-6 w-6 border-2 border-rose-500 border-t-transparent mx-auto"></div>
                          <p class="text-sm text-gray-500 mt-2">Loading team members...</p>
                        </div>
                        <div v-else class="p-4 text-center">
                          <UserX class="h-8 w-8 text-gray-300 mx-auto mb-2" />
                          <p class="text-sm text-gray-500">No team members available</p>
                        </div>
                      </div>
                      <div v-else class="bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-center">
                        <AlertCircle class="h-5 w-5 text-orange-400 mr-2 flex-shrink-0" />
                        <p class="text-sm text-orange-700">Please select a project first</p>
                      </div>
                    </div>

                    <!-- Reviewer -->
                    <div>
                      <label for="task-reviewer" class="block text-sm font-medium text-gray-700 mb-1.5">
                        Reviewer
                      </label>
                      <div class="relative rounded-md shadow-sm">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User class="h-4 w-4 text-gray-400" />
                        </div>
                        <select
                          id="task-reviewer"
                          v-model="formData.reviewer_id"
                          class="block w-full pl-10 pr-10 py-2.5 text-base border-gray-300 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm rounded-lg"
                        >
                          <option value="">Select reviewer</option>
                          <option v-for="member in getProjectTeamMembers(formData.project_id)" :key="member.id" :value="member.id">
                            {{ member.name }}
                          </option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- Schedule Card -->
                <!-- Schedule Card - Tampilan yang Diperbarui -->
                <div class="bg-gray-50 rounded-lg p-6 border border-gray-100">
                  <h3 class="text-sm font-medium text-gray-700 mb-4 flex items-center">
                    <Calendar class="w-4 h-4 mr-1.5 text-rose-500" />
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
                            v-model="formData.planned_date_start"
                            type="date"
                            class="block w-full pl-10 pr-3 py-2 text-sm border-gray-300 rounded-lg shadow-sm focus:border-rose-500 focus:ring-rose-500"
                            @change="calculatePlannedHours"
                          />
                        </div>
                        <div class="w-1/3">
                          <input
                            v-model="formData.planned_time_start"
                            type="time"
                            class="block w-full py-2 text-sm border-gray-300 rounded-lg shadow-sm focus:border-rose-500 focus:ring-rose-500"
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
                            v-model="formData.planned_date_end"
                            type="date"
                            class="block w-full pl-10 pr-3 py-2 text-sm border-gray-300 rounded-lg shadow-sm focus:border-rose-500 focus:ring-rose-500"
                            @change="calculatePlannedHours"
                          />
                        </div>
                        <div class="w-1/3">
                          <input
                            v-model="formData.planned_time_end"
                            type="time"
                            class="block w-full py-2 text-sm border-gray-300 rounded-lg shadow-sm focus:border-rose-500 focus:ring-rose-500"
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
                            v-model.number="formData.planned_hours"
                            type="number"
                            min="0"
                            step="0.1"
                            class="block w-full pl-10 pr-10 py-2 text-sm border-gray-300 rounded-lg shadow-sm focus:border-rose-500 focus:ring-rose-500"
                            placeholder="0.0"
                          />
                          <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <span class="text-gray-500 sm:text-sm">hrs</span>
                          </div>
                        </div>
                        <button 
                          type="button" 
                          @click="calculatePlannedHours" 
                          class="px-3 py-2 text-xs font-medium text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors"
                          title="Calculate hours from planned start and end"
                        >
                          <Calculator class="w-4 h-4" />
                        </button>
                      </div>
                      <p class="mt-1 text-xs text-gray-500">Jam yang direncanakan berdasarkan waktu mulai dan selesai</p>
                    </div>
                  </div>
                </div>
                
                <!-- Status Card -->
                <div class="bg-gray-50 rounded-lg p-6 border border-gray-100">
                  <h3 class="text-sm font-medium text-gray-700 mb-4 flex items-center">
                    <Activity class="w-4 h-4 mr-1.5 text-rose-500" />
                    Progress & Status
                  </h3>
                  
                  <div class="space-y-4">
                    <!-- Status -->
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
                      <div class="relative rounded-md shadow-sm">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <CheckCircle class="h-4 w-4 text-gray-400" />
                        </div>
                        <select
                          v-model="formData.state"
                          class="block w-full pl-10 pr-10 py-2.5 text-base border-gray-300 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm rounded-lg"
                        >
                          <option value="draft">Draft</option>
                          <option value="planned">Planned</option>
                          <option value="in_progress">In Progress</option>
                          <option value="review">In Review</option>
                          <option value="done">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>
                    
                    <!-- Progress -->
                    <div>
                      <div class="flex justify-between items-center mb-1.5">
                        <label class="block text-sm font-medium text-gray-700">Progress</label>
                        <span class="text-sm font-medium text-rose-600">{{ formData.progress || 0 }}%</span>
                      </div>
                      <div class="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                        <div 
                          class="h-2.5 rounded-full transition-all duration-300"
                          :class="{
                            'bg-rose-500': (formData.progress || 0) < 30,
                            'bg-orange-500': (formData.progress || 0) >= 30 && (formData.progress || 0) < 70,
                            'bg-green-500': (formData.progress || 0) >= 70
                          }"
                          :style="{ width: `${formData.progress || 0}%` }"
                        ></div>
                      </div>
                      <input
                        v-model.number="formData.progress"
                        type="range"
                        min="0"
                        max="100"
                        step="5"
                        class="w-full h-2 bg-transparent rounded-lg appearance-none cursor-pointer accent-rose-600"
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

            <!-- Form Actions -->
            <div class="flex justify-end space-x-3 pt-5 border-t border-gray-200">
              <button
                type="button"
                @click="handleClose"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="loading || !isFormValid"
                class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-rose-500 to-rose-600 border border-transparent rounded-lg shadow-sm hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 disabled:opacity-50"
              >
                <Loader2 v-if="loading" class="w-4 h-4 mr-2 animate-spin" />
                <span v-if="isEditMode">Update Task</span>
                <span v-else>Create Task</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { 
  Loader2, CheckSquare, Tag, Users, User, Calendar, Clock, Flag, 
  FileText, AlignLeft, X, FolderOpen, Edit, Bold, Italic,
  CalendarDays, Paperclip, UploadCloud, Download, Image, Trash2,
  CheckCircle, Activity, List, Link, AlertCircle, UserX, Calculator
} from 'lucide-vue-next'
import apiClient from '@/config/api'

const props = defineProps({
  show: Boolean,
  projectId: {
    type: [Number, String],
    default: null
  },
  taskData: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'submit'])
const loading = ref(false)
const projects = ref([])
const taskTypes = ref([])
const isUsingRichEditor = ref(false)
const formErrors = ref([])

// File handling
const fileInputRef = ref(null)
const taskAttachments = ref([])
const uploadingFile = ref(false)

// Check if we're in edit mode
const isEditMode = computed(() => !!props.taskData)


const projectMembers = ref({});
const loadingProjectMembers = ref({});
const pendingMemberRequests = ref({});


// Initialize form data
const formData = ref({
  name: '',
  project_id: props.projectId || '',
  type_id: '',
  assigned_to: [],
  reviewer_id: null,
  planned_date_start: '',
  planned_time_start: '09:00',
  planned_date_end: '',
  planned_time_end: '17:00',
  planned_hours: null,
  description: '',
  priority: '1',  // Set default ke Menengah (P2)
  progress: 0,
  state: 'draft'
})

// Computed for form validation
// Perbarui properti isFormValid untuk menyertakan validasi prioritas
// Tambahkan validasi tambahan untuk tanggal dan waktu

// Perbarui metode computed isFormValid untuk menambahkan validasi tanggal
const isFormValid = computed(() => {
  formErrors.value = []
  
  if (!formData.value.name.trim()) {
    formErrors.value.push('Nama tugas wajib diisi')
  }
  
  if (!formData.value.project_id) {
    formErrors.value.push('Proyek wajib dipilih')
  }
  
  if (!formData.value.assigned_to || formData.value.assigned_to.length === 0) {
    formErrors.value.push('Minimal satu anggota tim harus ditugaskan')
  }
  
  if (formData.value.priority === undefined || formData.value.priority === null || formData.value.priority === '') {
    formErrors.value.push('Prioritas wajib dipilih')
  }
  
  // Validasi tanggal dan waktu jika diisi
  if ((formData.value.planned_date_start || formData.value.planned_time_start) && 
      (!formData.value.planned_date_start || !formData.value.planned_time_start)) {
    formErrors.value.push('Tanggal dan waktu mulai harus diisi lengkap')
  }
  
  if ((formData.value.planned_date_end || formData.value.planned_time_end) && 
      (!formData.value.planned_date_end || !formData.value.planned_time_end)) {
    formErrors.value.push('Tanggal dan waktu selesai harus diisi lengkap')
  }
  
  // Jika kedua tanggal diisi, pastikan tanggal akhir tidak sebelum tanggal mulai
  if (formData.value.planned_date_start && formData.value.planned_time_start && 
      formData.value.planned_date_end && formData.value.planned_time_end) {
    
    const startDateTime = new Date(
      `${formData.value.planned_date_start}T${formData.value.planned_time_start}:00`
    );
    
    const endDateTime = new Date(
      `${formData.value.planned_date_end}T${formData.value.planned_time_end}:00`
    );
    
    if (endDateTime < startDateTime) {
      formErrors.value.push('Waktu selesai harus setelah waktu mulai')
    }
  }
  
  return formErrors.value.length === 0
})

const fetchProjectMembers = async (projectId) => {
  if (!projectId) return;
  
  // Konversi projectId ke string untuk keamanan sebagai key
  const projectIdStr = String(projectId);
  
  // Jika data sudah ada atau sedang dimuat, skip
  if (projectMembers.value[projectIdStr]) {
    return;
  }
  
  try {
    console.log('Fetching members for project ID:', projectId);
    const response = await apiClient.post('/web/v2/team/projects', {
      jsonrpc: '2.0',
      id: new Date().getTime(),
      params: {
        operation: 'read',
        project_id: projectId,
        include_members: true
      }
    });

    if (response.data.result?.status === 'success') {
      const projectData = response.data.result.data;
      
      // Periksa struktur data team
      if (projectData.team) {
        const allMembers = [];
        
        // Tambahkan manager jika ada
        if (projectData.team.manager) {
          allMembers.push(projectData.team.manager);
        }
        
        // Tambahkan anggota tim jika ada
        if (Array.isArray(projectData.team.members)) {
          allMembers.push(...projectData.team.members);
        }
        
        // Simpan ke cache
        projectMembers.value[projectIdStr] = allMembers;
        
        console.log('Team members loaded:', allMembers.length);
        console.log('Team members data:', allMembers);
      } else {
        console.log('No team data found in response');
        projectMembers.value[projectIdStr] = [];
      }
    } else {
      console.error('Error in response:', response.data);
      projectMembers.value[projectIdStr] = [];
    }
  } catch (error) {
    console.error('Error fetching project members:', error);
    projectMembers.value[projectIdStr] = [];
  }
};


const getInitials = (name) => {
  if (!name) return ''
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
}

// Watch for changes in projectId prop
watch(() => props.projectId, (newProjectId) => {
  if (newProjectId) {
    formData.value.project_id = newProjectId
    fetchProjectMembers(newProjectId)
  }
})

// Watch for project change to fetch team members
watch(() => formData.value.project_id, (newProjectId) => {
  if (newProjectId) {
    fetchProjectMembers(newProjectId)
  }
})

// Watch for taskData changes (for edit mode)
watch(() => props.taskData, (newTaskData) => {
  if (newTaskData) {
    // Format date and time from datetime string
    const formatDateTimeFields = (datetimeStr) => {
      if (!datetimeStr) return { date: '', time: '' }
      
      try {
        const datetime = new Date(datetimeStr)
        const date = datetime.toISOString().split('T')[0]
        const hours = String(datetime.getHours()).padStart(2, '0')
        const minutes = String(datetime.getMinutes()).padStart(2, '0')
        const time = `${hours}:${minutes}`
        
        return { date, time }
      } catch (e) {
        console.error('Error parsing datetime:', e)
        return { date: '', time: '' }
      }
    }
    
    const startDatetime = formatDateTimeFields(newTaskData.dates?.planned_start)
    const endDatetime = formatDateTimeFields(newTaskData.dates?.planned_end)
    
    // Populate form with task data
    formData.value = {
      name: newTaskData.name || '',
      project_id: newTaskData.project?.id || props.projectId || '',
      type_id: newTaskData.type?.id || '',
      assigned_to: newTaskData.assigned_to?.map(p => p.id) || [],
      reviewer_id: newTaskData.reviewer?.id || null,
      planned_date_start: startDatetime.date,
      planned_time_start: startDatetime.time || '09:00',
      planned_date_end: endDatetime.date,
      planned_time_end: endDatetime.time || '17:00',
      planned_hours: newTaskData.hours?.planned || null,
      description: newTaskData.description || '',
      priority: newTaskData.priority || '1',
      progress: newTaskData.progress || 0,
      state: newTaskData.state || 'draft'
    }
    
    // If we have project ID, fetch members
    if (formData.value.project_id) {
      fetchProjectMembers(formData.value.project_id)
    }
    
    // Check if the description contains HTML-like content to enable rich editor
    if (newTaskData.description && (
      newTaskData.description.includes('<') || 
      newTaskData.description.includes('</') || 
      newTaskData.description.includes('/>'))
    ) {
      isUsingRichEditor.value = true
    }
  }
}, { immediate: true })

const fetchProjects = async () => {
  try {
    const response = await apiClient.post('/web/v2/team/projects/list', {
      jsonrpc: '2.0',
      id: new Date().getTime(),
      params: {
        limit: 100
      }
    })

    if (response.data.result?.status === 'success') {
      projects.value = response.data.result.data
    }
  } catch (error) {
    console.error('Error fetching projects:', error)
  }
}

const fetchTaskTypes = async () => {
  try {
    const response = await apiClient.post('/web/v2/team/task-types', {
      jsonrpc: '2.0',
      id: new Date().getTime()
    })

    if (response.data.result?.status === 'success') {
      taskTypes.value = response.data.result.data
    } else {
      // Fallback to using dataset/call_kw if the endpoint isn't available
      const fallbackResponse = await apiClient.post('/web/dataset/call_kw', {
        jsonrpc: '2.0',
        method: 'call',
        params: {
          model: 'team.project.task.type',
          method: 'search_read',
          args: [[]],
          kwargs: {
            fields: ['id', 'name']
          }
        }
      })

      if (fallbackResponse.data.result) {
        taskTypes.value = fallbackResponse.data.result
      }
    }
  } catch (error) {
    console.error('Error fetching task types:', error)
  }
}



const fetchTaskAttachments = async () => {
  if (!props.taskData || !props.taskData.id) return
  
  try {
    const response = await apiClient.post('/web/v2/team/get_attachments', {
      jsonrpc: '2.0',
      id: new Date().getTime(),
      params: {
        model: 'team.project.task',
        res_id: props.taskData.id
      }
    })

    if (response.data.result?.status === 'success') {
      taskAttachments.value = response.data.result.data || []
    }
  } catch (error) {
    console.error('Error fetching task attachments:', error)
  }
}

// File handling functions
const handleFileUpload = () => {
  fileInputRef.value.click()
}

const onFileDrop = (event) => {
  const file = event.dataTransfer.files[0]
  if (file) {
    uploadFile(file)
  }
}

const onFileChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    uploadFile(file)
  }
}

const uploadFile = async (file) => {
  // Validasi ukuran file (maksimal 20 MB)
  const maxSize = 20 * 1024 * 1024 // 20 MB
  if (file.size > maxSize) {
    alert('File size is too large. Maximum allowed is 20 MB.')
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
    alert('File type is not allowed.')
    return
  }

  uploadingFile.value = true
  
  try {
    if (!props.taskData || !props.taskData.id) {
      // Simpan referensi file untuk upload setelah task dibuat
      alert('Please save the task first before uploading attachments.')
      uploadingFile.value = false
      return
    }
    
    // Create form data
    const formData = new FormData()
    formData.append('model', 'team.project.task')
    formData.append('res_id', props.taskData.id)
    formData.append('file', file)
    
    // Use axios directly for file upload
    const response = await apiClient.post('/web/v2/team/upload_attachment', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    
    const result = response.data
    
    if (result.status === 'success') {
      // Refresh attachments list
      await fetchTaskAttachments()
    } else {
      throw new Error(result.message || 'Upload failed')
    }
  } catch (error) {
    console.error('Error uploading file:', error)
    alert('Failed to upload file: ' + (error.message || 'Unknown error'))
  } finally {
    uploadingFile.value = false
    // Reset file input
    if (fileInputRef.value) {
      fileInputRef.value.value = null
    }
  }
}

const downloadFile = (file) => {
  if (file.url) {
    window.open(file.url, '_blank')
  }
}

const removeAttachment = async (file) => {
  if (!confirm(`Are you sure you want to remove "${file.name}"?`)) {
    return
  }
  
  try {
    const response = await apiClient.post('/web/v2/team/delete_attachment', {
      jsonrpc: '2.0',
      id: new Date().getTime(),
      params: {
        attachment_id: file.id
      }
    })

    if (response.data.result?.status === 'success') {
      // Remove from local list
      taskAttachments.value = taskAttachments.value.filter(a => a.id !== file.id)
    } else {
      throw new Error(response.data.result?.message || 'Deletion failed')
    }
  } catch (error) {
    console.error('Error deleting attachment:', error)
    alert('Failed to delete attachment: ' + (error.message || 'Unknown error'))
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

const handleSubmit = async () => {
  if (!isFormValid.value) {
    return // Don't continue if form is not valid
  }

  loading.value = true

  try {
    // Combine date and time for start and end
    const formatDateTime = (date, time) => {
      return date && time ? `${date} ${time}:00` : null
    }

    const submitData = {
      name: formData.value.name.trim(),
      project_id: Number(formData.value.project_id),
      type_id: formData.value.type_id ? Number(formData.value.type_id) : false,
      assigned_to: formData.value.assigned_to,
      reviewer_id: formData.value.reviewer_id ? Number(formData.value.reviewer_id) : false,
      planned_date_start: formatDateTime(formData.value.planned_date_start, formData.value.planned_time_start),
      planned_date_end: formatDateTime(formData.value.planned_date_end, formData.value.planned_time_end),
      planned_hours: formData.value.planned_hours ? Number(formData.value.planned_hours) : 0,
      description: formData.value.description?.trim() || '',
      priority: formData.value.priority,
      state: formData.value.state || 'draft',
      progress: Number(formData.value.progress) || 0
    }
    
    console.log(`${isEditMode.value ? 'Updating' : 'Creating'} task:`, submitData)
    
    // Submit to parent component for handling
    emit('submit', submitData)
  } catch (error) {
    console.error('Error in form submission:', error)
    alert('An error occurred while submitting the form. Please try again.')
  } finally {
    loading.value = false
  }
}

const handleClose = () => {
  // Reset form if not in edit mode
  if (!props.taskData) {
    formData.value = {
      name: '',
      project_id: props.projectId || '',
      type_id: '',
      assigned_to: [],
      reviewer_id: null,
      planned_date_start: '',
      planned_time_start: '09:00',
      planned_date_end: '',
      planned_time_end: '17:00',
      planned_hours: null,
      description: '',
      priority: '1',
      progress: 0,
      state: 'draft'
    }
    isUsingRichEditor.value = false
  }
  
  emit('close')
}

// Fungsi untuk fetchProjectMembers seperti yang ada di TeamTaskManager
// Fungsi untuk mengambil anggota tim project dengan struktur data yang benar


// Helper untuk debug - bisa dihapus setelah masalah teratasi
const logMembersData = (projectId) => {
  const projectIdStr = String(projectId);
  console.log('Current members data for project', projectId, ':', projectMembers.value[projectIdStr]);
  return projectMembers.value[projectIdStr] || [];
};

// Fungsi getter yang mengembalikan anggota tim termasuk debug
const getProjectTeamMembers = (projectId) => {
  if (!projectId) return [];
  
  const projectIdStr = String(projectId);
  const members = projectMembers.value[projectIdStr] || [];
  
  // Debug log untuk memastikan data ada
  if (members.length === 0) {
    console.log('No members found for project', projectId);
    console.log('All cached projects:', Object.keys(projectMembers.value));
    
    // Trigger fetch jika belum ada data
    if (!projectMembers.value[projectIdStr]) {
      fetchProjectMembers(projectId);
    }
  }
  
  return members;
};



// Tambahkan watch untuk project_id pada formData untuk otomatis memuat team members
watch(() => formData.value.project_id, (newProjectId) => {
  if (newProjectId) {
    fetchProjectMembers(newProjectId);
  }
}, { immediate: true });

// Ganti fungsi handleAssigneeChange untuk menangani multiple selection
const handleAssigneeChange = (newValue) => {
  // Pastikan assigned_to selalu array
  formData.value.assigned_to = Array.isArray(newValue) ? newValue : [newValue];
  console.log('Assigned to updated:', formData.value.assigned_to);
};

// Tambahkan watcher untuk taskData untuk memuat attachment saat detail task diubah
watch(() => props.taskData, (newTaskData) => {
  if (newTaskData && newTaskData.id) {
    fetchTaskAttachments()
  } else {
    taskAttachments.value = []
  }
}, { immediate: true })

// Watcher harus menggunakan immediate: false untuk mencegah eksekusi saat init
watch(() => formData.value.project_id, (newProjectId, oldProjectId) => {
  // Hanya fetch jika project_id benar-benar berubah dan valid
  if (newProjectId && newProjectId !== oldProjectId) {
    fetchProjectMembers(newProjectId);
  }
});

// Tambahkan metode ini di dalam script setup
const calculatePlannedHours = () => {
  // Pastikan kedua tanggal dan waktu telah diisi
  if (!formData.value.planned_date_start || !formData.value.planned_time_start || 
      !formData.value.planned_date_end || !formData.value.planned_time_end) {
    return;
  }
  
  // Buat objek Date dari tanggal dan waktu mulai
  const startDateTime = new Date(
    `${formData.value.planned_date_start}T${formData.value.planned_time_start}:00`
  );
  
  // Buat objek Date dari tanggal dan waktu selesai
  const endDateTime = new Date(
    `${formData.value.planned_date_end}T${formData.value.planned_time_end}:00`
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
  formData.value.planned_hours = diffHours;
}

// Tambahkan fungsi showToast jika belum ada
const showToast = (options) => {
  // Jika Anda sudah menggunakan komposisi useToast, gunakan itu
  // Atau gunakan metode ini sebagai fallback sederhana
  console.log(options.message);
  // Tambahkan logika untuk menampilkan toast jika belum ada
}

// Tambahkan watcher untuk menghitung jam otomatis saat tanggal atau waktu berubah
// Tambahkan ini dalam script setup setelah deklarasi formData

// Watch untuk perubahan tanggal dan waktu mulai/selesai
watch(
  [
    () => formData.value.planned_date_start,
    () => formData.value.planned_time_start,
    () => formData.value.planned_date_end,
    () => formData.value.planned_time_end
  ],
  () => {
    calculatePlannedHours();
  }
);

// Pada onMounted, hanya panggil fetch sekali untuk project yang saat ini
// Pada onMounted, fetch project members dengan tepat
onMounted(async () => {
  await fetchProjects();
  await fetchTaskTypes();
  
  // Hanya panggil fetchProjectMembers jika ada projectId awal
  const initialProjectId = formData.value.project_id || props.projectId || 
                          (props.taskData?.project?.id);
  
  if (initialProjectId) {
    console.log('Initial project ID:', initialProjectId);
    await fetchProjectMembers(initialProjectId);
  }
});

// Watcher untuk project_id dengan defensive checks
watch(() => formData.value.project_id, (newProjectId, oldProjectId) => {
  // Hanya fetch jika project_id valid dan berbeda dari sebelumnya
  if (newProjectId && newProjectId !== oldProjectId) {
    fetchProjectMembers(newProjectId);
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

/* Styling untuk form input range (progress slider) */
input[type=range] {
  -webkit-appearance: none;
  height: 6px;
  border-radius: 5px;  
  background: #e2e8f0;
  outline: none;
}

input[type=range]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #f43f5e;
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

input[type=range]::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #f43f5e;
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

/* Animasi transisi untuk modal */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

/* Transisi untuk loading animation */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>