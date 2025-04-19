<!-- src/views/dashboard/TeamBAUCalendar.vue -->
<template>
  <div class="min-h-screen bg-gray-50">
    <Toast
      v-model:show="toast.show"
      :message="toast.message"
      :type="toast.type"
      :duration="toast.duration"
    />
    
    <!-- Bagian 1: Header & Navigation -->
    <div class="bg-white shadow">
      <div class="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="md:flex md:items-center md:justify-between">
          <div class="flex-1 min-w-0">
            <h1 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Kalender Tim
            </h1>
          </div>
          <div class="mt-4 flex md:mt-0 md:ml-4 space-x-2">
            <button
              @click="showBatchModal = true"
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
              </svg>
              Rencanakan Batch
            </button>
            <button
              @click="showCreateModal = true"
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-rose-600 to-rose-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
              :disabled="loading"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
              </svg>
              Tambah Aktivitas
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Filter Controls -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <!-- Filter Controls Heading with Toggle -->
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-sm font-medium text-gray-700">Filter Kalender</h3>
          <div class="flex items-center space-x-2">
            <button
              @click="showAdvancedFilters = !showAdvancedFilters"
              class="text-sm text-gray-600 hover:text-red-600 flex items-center"
            >
              <span v-if="showAdvancedFilters">Sembunyikan Filter Lanjutan</span>
              <span v-else>Tampilkan Filter Lanjutan</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor" :class="{'transform rotate-180': showAdvancedFilters}">
                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
        
        <!-- Primary Filters Row -->
        <div class="flex flex-wrap items-center gap-4 mb-3">
          <!-- Department Filter (Dropdown) -->
          <div class="w-full sm:w-auto">
            <label for="department-filter" class="block text-sm font-medium text-gray-700 mb-1">
              Departemen
            </label>
            <select
              id="department-filter"
              v-model="filters.department_id"
              @change="applyFilters"
              class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md"
            >
              <option value="">Semua Departemen</option>
              <option v-for="dept in departments" :key="dept.id" :value="dept.id">
                {{ dept.name }}
              </option>
            </select>
          </div>

          <!-- Project Filter -->
          <div class="w-full sm:w-auto">
            <label for="project-filter" class="block text-sm font-medium text-gray-700 mb-1">
              Proyek
            </label>
            <select
              id="project-filter"
              v-model="filters.project_id"
              @change="applyFilters"
              class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md"
            >
              <option value="">Semua Proyek</option>
              <option v-for="project in filteredProjects" :key="project.id" :value="project.id">
                {{ project.name }}
              </option>
            </select>
          </div>

          <!-- Creator Filter -->
          <div class="w-full sm:w-auto">
            <label for="creator-filter" class="block text-sm font-medium text-gray-700 mb-1">
              Anggota Tim
            </label>
            <select
              id="creator-filter"
              v-model="filters.creator_id"
              @change="applyFilters"
              class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md"
            >
              <option value="">Semua Anggota</option>
              <option v-for="employee in employees" :key="employee.id" :value="employee.id">
                {{ employee.name }}
              </option>
            </select>
          </div>
          
          <!-- View Type Toggle -->
          <div class="w-full sm:w-auto ml-auto">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Tampilan
            </label>
            <div class="flex space-x-2">
              <button
                @click="toggleTeamView"
                :class="[
                  'inline-flex items-center px-3 py-2 border text-sm font-medium rounded-md transition-colors duration-200',
                  teamView 
                    ? 'bg-red-100 text-red-700 border-red-300'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                ]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
                Tim
              </button>
              <button
                @click="clearFilters"
                class="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd" />
                </svg>
                Reset
              </button>
            </div>
          </div>
        </div>
        
        <!-- Advanced Filters (Collapsible) -->
        <div v-if="showAdvancedFilters" class="mt-3 pt-3 border-t border-gray-200">
          <h4 class="text-sm font-medium text-gray-700 mb-2">Filter Departemen Multi-Pilihan</h4>
          
          <!-- Department Tags -->
          <div class="flex flex-wrap gap-2 mb-2">
            <div 
              v-for="dept in departments.filter(d => selectedDepartments.includes(d.id))" 
              :key="`tag-${dept.id}`"
              class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800"
            >
              {{ dept.name }}
              <button 
                @click="removeDepartment(dept.id)" 
                class="ml-1 text-red-600 hover:text-red-900 focus:outline-none"
              >
                <svg class="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                </svg>
              </button>
            </div>
            <button 
              v-if="selectedDepartments.length > 0" 
              @click="clearSelectedDepartments" 
              class="text-xs text-gray-500 hover:text-red-600"
            >
              Hapus semua
            </button>
          </div>
          
          <!-- Department Checkboxes - Grid Layout for Better Appearance -->
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 bg-gray-50 p-3 rounded-md border border-gray-200 max-h-40 overflow-y-auto">
            <div v-for="dept in departments" :key="`check-${dept.id}`" class="flex items-center">
              <input
                type="checkbox"
                :id="`dept-${dept.id}`"
                :value="dept.id"
                v-model="selectedDepartments"
                @change="applyDepartmentFilters"
                class="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
              />
              <label :for="`dept-${dept.id}`" class="ml-2 block text-sm text-gray-700 truncate">
                {{ dept.name }}
              </label>
            </div>
          </div>
          
          <!-- Apply Filter Button -->
          <div class="mt-3 flex justify-end">
            <button 
              @click="applyDepartmentFilters" 
              class="inline-flex items-center px-3 py-1.5 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Terapkan Filter
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content dengan Calendar Navigation -->
    <main class="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Calendar Navigation -->
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center">
          <button
            @click="previousPeriod"
            class="p-2 rounded-full hover:bg-gray-200 focus:outline-none transition-colors duration-200"
            :disabled="loading"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          </button>
          <h2 class="text-xl font-semibold text-gray-900 mx-4">
            {{ calendarTitle }}
          </h2>
          <button
            @click="nextPeriod"
            class="p-2 rounded-full hover:bg-gray-200 focus:outline-none transition-colors duration-200"
            :disabled="loading"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
        <div class="flex space-x-2">
          <button
            @click="changeViewMode('month')"
            :class="[
              'px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-200',
              viewMode === 'month' 
                ? 'bg-red-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
          >
            Bulan
          </button>
          <button
            @click="changeViewMode('week')"
            :class="[
              'px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-200',
              viewMode === 'week' 
                ? 'bg-red-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
          >
            Minggu
          </button>
        </div>
      </div>

      <!-- Loading Indicator -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="flex flex-col items-center">
          <svg class="animate-spin h-8 w-8 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p class="mt-3 text-sm text-gray-600">Memuat data kalender...</p>
        </div>
      </div>
      
      <!-- Bagian 2: Calendar Views -->
      <!-- Monthly Calendar View -->
      <div v-else-if="viewMode === 'month'" class="bg-white rounded-lg shadow overflow-hidden">
        <!-- Day Headers -->
        <div class="grid grid-cols-7 gap-px bg-gray-200">
          <div 
            v-for="day in dayHeaders" 
            :key="day" 
            class="bg-gray-50 py-2 text-center text-sm font-semibold text-gray-900"
          >
            {{ day }}
          </div>
        </div>

        <!-- Calendar Grid -->
        <div class="grid grid-cols-7 gap-px bg-gray-200">
          <div 
            v-for="(day, index) in calendarDays" 
            :key="index"
            :class="[
              'min-h-32 bg-white p-2',
              !day.isCurrentMonth ? 'bg-gray-50 text-gray-500' : '',
              day.isToday ? 'bg-red-50' : ''
            ]"
          >
            <!-- Date Display -->
            <div class="flex justify-between items-center mb-1">
              <span 
                :class="[
                  'text-sm font-medium',
                  day.isToday ? 'text-red-600' : 'text-gray-900'
                ]"
              >
                {{ day.date }}
              </span>
              <span v-if="day.hasActivities" class="flex h-5 w-5 items-center justify-center rounded-full" 
                :class="day.status === 'done' ? 'bg-green-100' : day.status === 'not_done' ? 'bg-red-100' : 'bg-yellow-100'">
                <svg v-if="day.status === 'done'" xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                <svg v-else-if="day.status === 'not_done'" xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-yellow-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
                </svg>
              </span>
            </div>

            <!-- Activities for this day -->
            <!-- Activities for this day in the Monthly View -->
            <div class="space-y-1">
              <div 
                v-for="activity in day.activities.slice(0, 2)" 
                :key="activity.id"
                class="px-2 py-1 text-xs rounded truncate cursor-pointer transition-colors duration-200 relative border-l-2"
                :class="[
                  getActivityStatusClass(activity.state, activity.activity_type),
                  getDepartmentColors(activity.creator?.department_id).border,
                  getDepartmentColors(activity.creator?.department_id).bg,
                  activity.creator?.id === userEmployeeId ? 'border-l-4' : 'border-l-2'
                ]"
                @click="viewActivityDetails(activity)"
              >
                <div class="flex justify-between items-center">
                  <span class="font-medium truncate mr-1">{{ activity.name }}</span>
                  <span class="whitespace-nowrap">({{ activity.hours_spent }}j)</span>
                </div>
                <div class="text-xxs text-gray-600 truncate">
                  {{ activity.creator?.name || 'Tidak ada creator' }}
                </div>
              </div>

              <!-- Show more button if there are many activities -->
              <button 
                v-if="day.activities.length > 2" 
                @click="viewDayActivities(day.fullDate, day.activities)"
                class="text-xs text-red-600 hover:text-red-800 transition-colors duration-200"
              >
                + {{ day.activities.length - 2 }} lainnya
              </button>

              <!-- Quick add button -->
              <button 
                v-if="day.isCurrentMonth && day.isToday"
                @click="quickAddActivity(day.fullDate)"
                class="flex items-center text-xs text-gray-500 hover:text-red-600 mt-1 transition-colors duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
                </svg>
                Tambah
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Weekly Calendar View -->
      <div v-else-if="viewMode === 'week'">
        <BAUCalendarWeekView 
          :week-data="weekData"
          :loading="loading"
          :team-view="teamView"
          :user-employee-id="userEmployeeId" 
          @activity-click="viewActivityDetails"
          @time-slot-click="handleTimeSlotClick"
          @refresh="fetchActivities"
          ref="weekViewRef"
        />
      </div>
      
      <!-- Updated department legend with both border and background color -->
      <div class="mt-6 bg-white p-4 rounded-lg shadow">
        <h3 class="text-sm font-medium text-gray-900 mb-2">Legenda Departemen</h3>
        <div class="flex flex-wrap gap-4">
          <div v-for="dept in departments" :key="dept.id" class="flex items-center">
            <div class="w-4 h-4 rounded mr-2" 
                :class="[getDepartmentColors(dept.id).border, getDepartmentColors(dept.id).bg]"></div>
            <span class="text-xs text-gray-700">{{ dept.name }}</span>
          </div>
        </div>
      </div>

      <!-- Also update the activity type legend if needed -->
      <div v-if="teamView" class="mt-6 bg-white p-4 rounded-lg shadow">
        <h3 class="text-sm font-medium text-gray-900 mb-2">Legenda</h3>
        <div class="flex flex-wrap gap-4">
          <div class="flex items-center">
            <div class="w-4 h-4 rounded border-l-4 border-red-500 mr-2"></div>
            <span class="text-xs text-gray-700">Aktivitas Saya</span>
          </div>
          <div class="flex items-center">
            <div class="w-4 h-4 rounded text-blue-800 mr-2 flex items-center justify-center">
              <span class="text-xxs">A</span>
            </div>
            <span class="text-xs text-gray-700">Meeting</span>
          </div>
          <div class="flex items-center">
            <div class="w-4 h-4 rounded text-green-800 mr-2 flex items-center justify-center">
              <span class="text-xxs">A</span>
            </div>
            <span class="text-xs text-gray-700">Training</span>
          </div>
          <div class="flex items-center">
            <div class="w-4 h-4 rounded text-pink-800 mr-2 flex items-center justify-center">
              <span class="text-xxs">A</span>
            </div>
            <span class="text-xs text-gray-700">Support</span>
          </div>
          <div class="flex items-center">
            <div class="w-4 h-4 rounded text-indigo-800 mr-2 flex items-center justify-center">
              <span class="text-xxs">A</span>
            </div>
            <span class="text-xs text-gray-700">Admin</span>
          </div>
          <div class="flex items-center">
            <div class="w-4 h-4 rounded text-gray-800 mr-2 flex items-center justify-center">
              <span class="text-xxs">A</span>
            </div>
            <span class="text-xs text-gray-700">Lainnya</span>
          </div>
        </div>
      </div>
    </main>

    <!-- Bagian 3: Modal Components -->
    
    <!-- Activity Create/Edit Modal -->
    <BAUCreateEditModal
      :show="showCreateModal"
      :form-data="formData"
      :projects="projects"
      :employees="employees"
      :is-editing="isEditing"
      :submitting="submitting"
      :show-verification-reason="showVerificationReason"
      @close="closeModal"
      @submit="handleSubmit"
      @update:hours-spent="formData.hours_spent = $event"
    />

    <!-- Activity Details Modal -->
    <BAUDetailsModal
      :show="showDetailsModal"
      :activity="selectedActivity"
      :can-edit="selectedActivity ? canEditActivity(selectedActivity) : false"
      :can-verify="selectedActivity ? canVerifyActivity(selectedActivity) : false"
      @close="closeDetailsModal"
      @edit="editActivity"
      @verify="verifyActivity"
    />

    <!-- Day Activities Modal -->
    <BAUDayActivitiesModal
      :show="showDayActivitiesModal"
      :date="selectedDay"
      :activities="selectedDayActivities"
      :is-today="isSelectedDayToday"
      :user-employee-id="userEmployeeId"
      @close="closeDayActivitiesModal"
      @view-details="viewActivityDetails"
      @add="quickAddActivity(selectedDay)"
    />

    <!-- BAU Batch Modal -->
    <BAUBatchModal
      :show="showBatchModal"
      :form-data="batchFormData"
      :projects="projects"
      :employees="employees"
      :submitting="submittingBatch"
      @close="closeBatchModal"
      @submit="handleBatchSubmit"
      @update:hours-spent="batchFormData.hours_spent = $event"
    />

    <!-- Verification Reason Dialog -->
    <BAUVerificationReasonModal
      :show="showReasonDialog"
      :reason="verificationReason"
      @close="showReasonDialog = false"
      @submit="submitVerificationReason"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useToast } from '@/composables/useToast';
import { useAuthStore } from '@/stores/auth'; // Ubah dari @/stores/user
import apiClient from '@/config/api';

// Import Components
import Toast from '@/components/Toast.vue';
import BAUCreateEditModal from '@/components/team/BAUCreateEditModal.vue';
import BAUDetailsModal from '@/components/team/BAUDetailModal.vue';
import BAUBatchModal from '@/components/team/BAUBatchModal.vue';
import BAUDayActivitiesModal from '@/components/team/BAUDayActivitiesModal.vue';
import BAUVerificationReasonModal from '@/components/team/BAUVerificationReasonModal.vue';
import BAUCalendarWeekView from '@/components/team/BAUCalendarWeekView.vue';

// State
const { toast, showToast } = useToast();
const authStore = useAuthStore();
const loading = ref(false);
const submitting = ref(false);
const submittingBatch = ref(false);
const viewMode = ref('week'); // Default to week view
const currentDate = ref(new Date());
const showCreateModal = ref(false);
const showBatchModal = ref(false);
const showDetailsModal = ref(false);
const showDayActivitiesModal = ref(false);
const showReasonDialog = ref(false);
const selectedActivity = ref(null);
const activityToVerify = ref(null);
const verificationReason = ref('');
const selectedDay = ref(null);
const selectedDayActivities = ref([]);
const isEditing = ref(false);
const projects = ref([]);
const departments = ref([]);
const employees = ref([]);
const teamView = ref(true);
// State untuk checkbox departemen
const showAdvancedFilters = ref(false);
const selectedDepartments = ref([]);

// Get current user info
// const userEmployeeId = computed(() => userStore.employeeId || null);

// Filter state
const filters = ref({
  department_id: '',
  project_id: '',
  creator_id: ''
});

// Calendar data
const dayHeaders = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
const hours = Array.from({ length: 14 }, (_, i) => i + 7); // 7 AM to 8 PM
const calendarDays = ref([]);
const weekData = ref([]);

const userEmployeeId = computed(() => {
  // Jika employee_id tidak tersedia di authStore, coba ambil dari localStorage
  // Ini asumsi bahwa employee_id tersimpan di localStorage atau dapat dihitung dari data lain
  return authStore.user?.employee_id || parseInt(localStorage.getItem('employee_id')) || null;
});


// Form data
const formData = ref({
  id: null,
  name: '',
  activity_type: 'meeting',
  date: '',
  time_start: '08:00',
  time_end: '10:00',
  hours_spent: 1,
  project_id: '',
  creator_id: userEmployeeId.value,
  description: '',
  state: 'planned',
  verification_reason: ''
});

// Batch form data
const batchFormData = ref({
  name: '',
  activity_type: 'meeting',
  date_from: '',
  date_to: '',
  time_start: '08:00',
  time_end: '10:00',
  hours_spent: 1.0,
  project_id: '',
  creator_id: userEmployeeId.value,
  description: '',
  exclude_weekends: true
});

// Computed properties
const todayDate = computed(() => {
  return formatDateYYYYMMDD(new Date());
});

// Filter projects based on selected department
const filteredProjects = computed(() => {
  if (!filters.value.department_id) {
    return projects.value;
  }
  return projects.value.filter(project => 
    project.department?.id === parseInt(filters.value.department_id)
  );
});

// ... lanjutan dari kode sebelumnya

const showVerificationReason = computed(() => {
  if (!isEditing.value || formData.value.state === 'planned') return false;
  
  const activityDate = new Date(formData.value.date);
  activityDate.setHours(0, 0, 0, 0);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const diffDays = Math.floor((today - activityDate) / (1000 * 60 * 60 * 24));
  
  return diffDays === 1; // Show reason if verification is H+1
});

const canVerify = computed(() => {
  if (!formData.value.date) return false;
  
  const activityDate = new Date(formData.value.date);
  activityDate.setHours(0, 0, 0, 0);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const diffDays = Math.floor((today - activityDate) / (1000 * 60 * 60 * 24));
  
  // Can verify if same day (H) or next day (H+1)
  return diffDays <= 1;
});

// Metode untuk menerapkan filter departemen
const applyDepartmentFilters = () => {
  // Reset filter departemen dropdown jika menggunakan checkbox
  if (selectedDepartments.value.length > 0) {
    filters.value.department_id = '';
  }
  
  // Simpan nilai departemen yang dipilih untuk digunakan dalam filter
  filters.value.selected_departments = selectedDepartments.value;
  
  // Jalankan pencarian dengan filter baru
  fetchActivities();
};

// Metode untuk menghapus departemen dari pilihan
const removeDepartment = (deptId) => {
  selectedDepartments.value = selectedDepartments.value.filter(id => id !== deptId);
  applyDepartmentFilters();
};

// Metode untuk menghapus semua departemen yang dipilih
const clearSelectedDepartments = () => {
  selectedDepartments.value = [];
  applyDepartmentFilters();
};

// Perluas metode clearFilters yang sudah ada untuk juga menghapus departemen yang dipilih
const clearFilters = () => {
  filters.value = {
    department_id: '',
    project_id: '',
    creator_id: ''
  };
  selectedDepartments.value = [];
  fetchActivities();
};


// Add or modify this function in your component
const getDepartmentColors = (departmentId) => {
  // Mapping of department IDs to colors (border and background)
  const departmentColors = {
    1: { border: 'border-red-500', bg: 'bg-red-50' },
    2: { border: 'border-blue-500', bg: 'bg-blue-50' },
    3: { border: 'border-green-500', bg: 'bg-green-50' },
    4: { border: 'border-yellow-500', bg: 'bg-yellow-50' },
    5: { border: 'border-purple-500', bg: 'bg-purple-50' },
    6: { border: 'border-pink-500', bg: 'bg-pink-50' },
    7: { border: 'border-indigo-500', bg: 'bg-indigo-50' },
    8: { border: 'border-orange-500', bg: 'bg-orange-50' },
    9: { border: 'border-cyan-500', bg: 'bg-cyan-50' }, // Marketing department
    10: { border: 'border-lime-500', bg: 'bg-lime-50' },
    11: { border: 'border-teal-500', bg: 'bg-teal-50' },
    12: { border: 'border-emerald-500', bg: 'bg-emerald-50' }, // IT Division
    // Add more departments as needed
  };
  
  return departmentColors[departmentId] || { border: 'border-gray-300', bg: 'bg-gray-50' };
};
// Update existing functions
const getActivityStatusClass = (state, type = 'other') => {
  // Status class takes precedence for text color only
  switch(state) {
    case 'done':
      return 'text-green-800';
    case 'not_done':
      return 'text-red-800';
    default: // planned
      // Fall back to type-based text coloring
      return getActivityTypeTextClass(type);
  }
};

const getActivityTypeTextClass = (type) => {
  if (!type) return 'text-gray-800';
  
  const colorMap = {
    'meeting': 'text-blue-800',
    'training': 'text-green-800',
    'support': 'text-pink-800',
    'admin': 'text-indigo-800',
    'other': 'text-gray-800'
  };
  
  return colorMap[type.toLowerCase()] || 'text-gray-800';
};

// Keep for backwards compatibility
const getDepartmentBorderColor = (departmentId) => {
  return getDepartmentColors(departmentId).border;
};

const calendarTitle = computed(() => {
  if (viewMode.value === 'week') {
    // For week view, show range (e.g., "7 - 13 Mar 2025")
    if (weekData.value.length > 0) {
      const firstDay = weekData.value[0];
      const lastDay = weekData.value[weekData.value.length - 1];
      
      if (firstDay && lastDay) {
        const firstDate = new Date(firstDay.date);
        const lastDate = new Date(lastDay.date);
        const sameMonth = firstDate.getMonth() === lastDate.getMonth();
        const sameYear = firstDate.getFullYear() === lastDate.getFullYear();

        // Format for Indonesian display
        const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
                           'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

        if (sameMonth && sameYear) {
          return `${firstDate.getDate()} - ${lastDate.getDate()} ${monthNames[firstDate.getMonth()]} ${firstDate.getFullYear()}`;
        } else if (sameYear) {
          return `${firstDate.getDate()} ${monthNames[firstDate.getMonth()]} - ${lastDate.getDate()} ${monthNames[lastDate.getMonth()]} ${firstDate.getFullYear()}`;
        } else {
          return `${firstDate.getDate()} ${monthNames[firstDate.getMonth()]} ${firstDate.getFullYear()} - ${lastDate.getDate()} ${monthNames[lastDate.getMonth()]} ${lastDate.getFullYear()}`;
        }
      }
    }
  }
  
  // For month view - using Indonesian month names
  const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
                      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  
  return `${monthNames[currentDate.value.getMonth()]} ${currentDate.value.getFullYear()}`;
});

const selectedDayTitle = computed(() => {
  if (!selectedDay.value) return '';
  return formatDate(selectedDay.value);
});

const isSelectedDayToday = computed(() => {
  if (!selectedDay.value) return false;
  
  const selectedDate = new Date(selectedDay.value);
  selectedDate.setHours(0, 0, 0, 0);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return selectedDate.getTime() === today.getTime();
});

const calculatedHours = computed(() => {
  if (!formData.value.time_start || !formData.value.time_end) return 0;
  
  try {
    // Parse time strings
    const startParts = formData.value.time_start.split(':');
    const endParts = formData.value.time_end.split(':');
    
    const startHours = parseInt(startParts[0]) + (parseInt(startParts[1]) / 60);
    const endHours = parseInt(endParts[0]) + (parseInt(endParts[1]) / 60);
    
    // Calculate duration (handle overnight activities)
    let duration = endHours - startHours;
    if (duration < 0) {
      duration = 24 + duration; // Add 24 hours if end time is on next day
    }
    
    return parseFloat(duration.toFixed(2));
  } catch (e) {
    console.error('Error calculating hours:', e);
    return 0;
  }
});

const batchCalculatedHours = computed(() => {
  if (!batchFormData.value.time_start || !batchFormData.value.time_end) return 0;
  
  try {
    // Parse time strings
    const startParts = batchFormData.value.time_start.split(':');
    const endParts = batchFormData.value.time_end.split(':');
    
    const startHours = parseInt(startParts[0]) + (parseInt(startParts[1]) / 60);
    const endHours = parseInt(endParts[0]) + (parseInt(endParts[1]) / 60);
    
    // Calculate duration (handle overnight activities)
    let duration = endHours - startHours;
    if (duration < 0) {
      duration = 24 + duration; // Add 24 hours if end time is on next day
    }
    
    return parseFloat(duration.toFixed(2));
  } catch (e) {
    console.error('Error calculating batch hours:', e);
    return 0;
  }
});

// Methods
// 1. Filter Methods
const applyFilters = () => {
  fetchActivities();
};

const toggleTeamView = () => {
  teamView.value = !teamView.value;
  
  // If switching to personal view, set creator_id to current user
  if (!teamView.value) {
    filters.value.creator_id = userEmployeeId.value;
  }
  
  // If switching to team view, clear creator filter
  if (teamView.value) {
    filters.value.creator_id = '';
  }
  
  fetchActivities();
};

// 2. Calendar Navigation & View Methods
const changeViewMode = (mode) => {
  if (viewMode.value === mode) return;
  viewMode.value = mode;
  fetchActivities();
};

const previousPeriod = () => {
  const newDate = new Date(currentDate.value);
  if (viewMode.value === 'month') {
    newDate.setMonth(newDate.getMonth() - 1);
  } else {
    newDate.setDate(newDate.getDate() - 7);
  }
  currentDate.value = newDate;
  fetchActivities();
};

const nextPeriod = () => {
  const newDate = new Date(currentDate.value);
  if (viewMode.value === 'month') {
    newDate.setMonth(newDate.getMonth() + 1);
  } else {
    newDate.setDate(newDate.getDate() + 7);
  }
  currentDate.value = newDate;
  fetchActivities();
};

// 3. API Methods
const fetchActivities = async () => {
  try {
    loading.value = true;
    
    // Prepare date range based on current view and month
    let dateFrom, dateTo;
    
    if (viewMode.value === 'month') {
      // Month range
      const year = currentDate.value.getFullYear();
      const month = currentDate.value.getMonth();
      
      // First day of month
      dateFrom = new Date(year, month, 1);
      // Last day of month
      dateTo = new Date(year, month + 1, 0);
    } else {
      // Week range - Perbaikan untuk memastikan data mingguan
      // Tentukan tanggal awal minggu (Minggu)
      const currentDay = new Date(currentDate.value);
      const dayOfWeek = currentDay.getDay(); // 0 = Minggu, 1 = Senin, dst.
      
      // Tentukan hari Minggu di minggu tersebut (awal minggu)
      const firstDayOfWeek = new Date(currentDay);
      firstDayOfWeek.setDate(currentDay.getDate() - dayOfWeek);
      
      // Tentukan hari Sabtu di minggu tersebut (akhir minggu)
      const lastDayOfWeek = new Date(firstDayOfWeek);
      lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);
      
      dateFrom = firstDayOfWeek;
      dateTo = lastDayOfWeek;
      
      // Set currentDate ke awal minggu untuk konsistensi
      currentDate.value = new Date(firstDayOfWeek);
    }
    
    // Format dates (YYYY-MM-DD)
    const dateFromStr = formatDateYYYYMMDD(dateFrom);
    const dateToStr = formatDateYYYYMMDD(dateTo);
    
    // Debugging: Log nilai filter yang akan digunakan
    console.log('Filter values:', {
      department_id: filters.value.department_id,
      project_id: filters.value.project_id,
      creator_id: filters.value.creator_id,
      selectedDepartments: selectedDepartments.value
    });
    
    // Prepare API parameters with filters
    const params = {
      operation: 'get',
      date_from: dateFromStr,
      date_to: dateToStr,
      team_view: teamView.value
    };
    
    // Add filters if they exist
    if (filters.value.creator_id) {
      params.creator_id = parseInt(filters.value.creator_id);
    }
    
    // STRATEGI FILTER PROJECT VS DEPARTMENT
    // Jika ada filter departemen
    if (filters.value.department_id) {
      // Cari semua project dari departemen ini
      const departmentId = parseInt(filters.value.department_id);
      const departmentProjects = projects.value.filter(
        p => p.department?.id === departmentId
      );
      
      console.log(`Found ${departmentProjects.length} projects for department ${departmentId}`);
      
      if (departmentProjects.length > 0) {
        // Jika ada filter project dan project tersebut ada dalam departemen
        if (filters.value.project_id) {
          const projectId = parseInt(filters.value.project_id);
          const isValidProject = departmentProjects.some(p => p.id === projectId);
          
          if (isValidProject) {
            params.project_id = projectId;
          } else {
            // Project tidak dalam departemen, reset filter
            filters.value.project_id = '';
            // Gunakan semua project dari departemen untuk filter di client
          }
        }
        // Jika tidak ada filter project, kita akan filter hasil nanti
      }
    } else if (filters.value.project_id) {
      // Jika hanya ada filter project
      params.project_id = parseInt(filters.value.project_id);
    }
    
    // Jika menggunakan multi-select departemen dan ada departemen yang dipilih
    if (selectedDepartments.value.length > 0) {
      // Untuk saat ini, kita tidak mengirim parameter ini ke backend
      // Kita akan melakukan filter di client side
      params.selected_departments = selectedDepartments.value;
      
      console.log(`Using ${selectedDepartments.value.length} selected departments for client-side filtering`);
    }
    
    console.log('Fetching BAU calendar with params:', params);
    
    // Call BAU calendar API
    const response = await apiClient.post('/web/v2/team/bau/calendar', {
      jsonrpc: '2.0',
      id: new Date().getTime(),
      params
    });

    if (response.data.result?.status === 'success') {
      let calendarData = response.data.result.data;
      
      console.log('Raw calendar data received:', calendarData);
      
      // Pastikan semua aktivitas memiliki informasi departemen yang valid
      calendarData.forEach(day => {
        if (!day.activities) return;
        
        day.activities = day.activities.map(activity => {
          // Jika ada project tapi tidak ada department_id
          if (activity.project && !activity.project.department_id) {
            // Cari project dari list projects
            const project = projects.value.find(p => p.id === activity.project.id);
            if (project && project.department) {
              activity.project.department_id = project.department.id;
              activity.project.department_name = project.department.name;
            }
          }
          return activity;
        });
      });
      
      // CLIENT-SIDE FILTERING
      
      // 1. Filter berdasarkan departemen dropdown (jika tidak menggunakan filter project)
      if (filters.value.department_id && !filters.value.project_id) {
        const departmentId = parseInt(filters.value.department_id);
        console.log(`Filtering by department ID ${departmentId}`);
        
        calendarData = calendarData.map(day => {
          if (!day.activities) return day;
          
          const filteredActivities = day.activities.filter(activity => {
            const hasDepartment = activity.project && activity.project.department_id === departmentId;
            return hasDepartment;
          });
          
          return {
            ...day,
            activities: filteredActivities,
            total_hours: filteredActivities.reduce((sum, act) => sum + (act.hours_spent || 0), 0),
            hasActivities: filteredActivities.length > 0,
            status: determineStatusFromActivities(filteredActivities)
          };
        });
      }
      
      // 2. Filter berdasarkan multiple departments (checkbox)
      else if (selectedDepartments.value.length > 0) {
        console.log(`Filtering by ${selectedDepartments.value.length} selected departments`);
        
        calendarData = calendarData.map(day => {
          if (!day.activities) return day;
          
          const filteredActivities = day.activities.filter(activity => {
            if (!activity.project || !activity.project.department_id) return false;
            return selectedDepartments.value.includes(activity.project.department_id);
          });
          
          return {
            ...day,
            activities: filteredActivities,
            total_hours: filteredActivities.reduce((sum, act) => sum + (act.hours_spent || 0), 0),
            hasActivities: filteredActivities.length > 0,
            status: determineStatusFromActivities(filteredActivities)
          };
        });
      }
      
      console.log('Filtered calendar data:', calendarData);
      
      // Perbaikan: Pastikan setiap aktivitas memiliki informasi waktu yang valid
      calendarData.forEach(day => {
        if (!day.activities) return;
        
        day.activities = day.activities.map(activity => {
          // Jika aktivitas tidak memiliki waktu atau waktu tidak lengkap
          if (!activity.time || !activity.time.start || !activity.time.end) {
            // Default mulai jam 9 pagi
            const defaultStartTime = '09:00';
            
            // Hitung waktu selesai berdasarkan hours_spent
            let hours = Math.floor(activity.hours_spent || 1);
            let minutes = Math.round(((activity.hours_spent || 1) % 1) * 60);
            
            // Parse waktu mulai
            const [startHour, startMinute] = defaultStartTime.split(':').map(Number);
            
            // Hitung waktu selesai
            let endHour = startHour + hours;
            let endMinute = startMinute + minutes;
            
            // Handle overflow minutes
            if (endMinute >= 60) {
              endHour += Math.floor(endMinute / 60);
              endMinute = endMinute % 60;
            }
            
            // Format waktu selesai
            const endTime = `${String(endHour).padStart(2, '0')}:${String(endMinute).padStart(2, '0')}`;
            
            // Set time object
            activity.time = {
              start: defaultStartTime,
              end: endTime,
              duration: activity.hours_spent || 1
            };
          }
          
          return activity;
        });
      });
      
      // Store data for reference
      const activitiesByDate = {};
      
      // Convert API data to expected format
      calendarData.forEach(day => {
        activitiesByDate[day.date] = {
          activities: day.activities || [],
          totalHours: day.total_hours || 0,
          hasActivities: (day.activities || []).length > 0,
          status: determineStatusFromActivities(day.activities || []),
          targetAchieved: day.target_achieved || false
        };
      });
      
      console.log('Final activities by date:', activitiesByDate);
      
      // Update calendar displays with API data
      updateCalendarWithData(activitiesByDate);
    } else {
      showToast({
        message: response.data.result?.message || 'Gagal memuat data kalender',
        type: 'error',
        duration: 5000
      });
    }
  } catch (error) {
    console.error('Error fetching activities:', error);
    showToast({
      message: error.message || 'Gagal memuat aktivitas',
      type: 'error',
      duration: 5000
    });
  } finally {
    loading.value = false;
  }
};


const fetchProjects = async () => {
  try {
    const response = await apiClient.post('/web/v2/team/projects/list', {
      jsonrpc: '2.0',
      id: new Date().getTime(),
      params: {
        limit: 100 // Get all projects for dropdown
      }
    });

    if (response.data.result?.status === 'success') {
      projects.value = response.data.result.data || [];

      // Verifikasi apakah project memiliki informasi department
      const projectsWithDept = projects.value.filter(p => p.department && p.department.id);
    }
  } catch (error) {
    console.error('Error fetching projects:', error);
    showToast({
      message: 'Failed to load projects',
      type: 'error'
    });
  }
};

const fetchDepartments = async () => {
  try {
    const response = await apiClient.post('/web/v2/team/departments', {
      jsonrpc: '2.0',
      id: new Date().getTime()
    });

    if (response.data.result?.status === 'success') {
      departments.value = response.data.result.data || [];
    }
  } catch (error) {
    console.error('Error fetching departments:', error);
    showToast({
      message: 'Failed to load departments',
      type: 'error'
    });
  }
};

const fetchEmployees = async () => {
  try {
    const response = await apiClient.post('/web/session/get_employees', {
      jsonrpc: '2.0',
      id: new Date().getTime()
    });

    if (response.data.result?.status === 'success') {
      employees.value = response.data.result.data || [];
    }
  } catch (error) {
    console.error('Error fetching employees:', error);
    showToast({
      message: 'Failed to load employees',
      type: 'error'
    });
  }
};

// 4. Activity Management Methods
const handleSubmit = async (submittedFormData) => {
  try {
    // Validate date (only today for new activities)
    // if (!isEditing.value && submittedFormData.date !== todayDate.value) {
    //   showToast({
    //     message: 'Aktivitas baru hanya dapat dibuat untuk hari ini',
    //     type: 'error',
    //     duration: 5000
    //   });
    //   return;
    // }
    
    submitting.value = true;
    
    // Store the time values for later use
    const sentTimeStart = submittedFormData.time_start;
    const sentTimeEnd = submittedFormData.time_end;
    
    // Determine operation (create or update)
    const operation = isEditing.value ? 'update' : 'create';
    
    // Prepare params
    const params = {
      operation,
      name: submittedFormData.name.trim(),
      activity_type: submittedFormData.activity_type,
      date: submittedFormData.date,
      time_start: submittedFormData.time_start,
      time_end: submittedFormData.time_end,
      hours_spent: submittedFormData.hours_spent,
      description: submittedFormData.description.trim(),
    };

    // Add creator_id if provided (for team members with proper permissions)
    if (submittedFormData.creator_id) {
      params.creator_id = parseInt(submittedFormData.creator_id);
    }
    
    // Include project_id if selected
    if (submittedFormData.project_id) {
      params.project_id = Number(submittedFormData.project_id);
    }
    
    // Add bau_id for updates
    if (isEditing.value && submittedFormData.id) {
      params.bau_id = submittedFormData.id;
      
      // Add state and verification reason for edited activities 
      if (submittedFormData.state !== 'planned') {
        params.state = submittedFormData.state;
        
        // If we need a verification reason and it's not provided, show error
        if (submittedFormData.state !== 'planned' && showVerificationReason.value && !submittedFormData.verification_reason) {
          showToast({
            message: 'Alasan verifikasi diperlukan untuk aktivitas H+1',
            type: 'error',
            duration: 5000
          });
          submitting.value = false;
          return;
        }
        
        if (submittedFormData.verification_reason) {
          params.verification_reason = submittedFormData.verification_reason;
        }
      }
    }
    
    // Call the API
    const response = await apiClient.post('/web/v2/team/bau', {
      jsonrpc: '2.0',
      id: new Date().getTime(),
      params
    });

    if (response.data.result?.status === 'success') {
      // If this is an update operation and the response doesn't include time info,
      // we need to manually add it to ensure UI consistency
      if (operation === 'update' && response.data.result.data) {
        const updatedActivity = response.data.result.data;
        
        // Check if time object is missing in the response
        if (!updatedActivity.time) {
          // Create time object with the sent values
          updatedActivity.time = {
            start: sentTimeStart,
            end: sentTimeEnd,
            duration: submittedFormData.hours_spent
          };
          
          console.log('Added missing time info to updated activity:', updatedActivity);
        }
      }
      
      showToast({
        message: isEditing.value ? 'Aktivitas berhasil diperbarui' : 'Aktivitas berhasil dibuat',
        type: 'success'
      });
      closeModal();
      fetchActivities();
    } else {
      showToast({
        message: response.data.result?.message || 'Gagal menyimpan aktivitas',
        type: 'error',
        duration: 5000
      });
    }
  } catch (error) {
    console.error('Error saving activity:', error);
    showToast({
      message: error.message || 'Gagal menyimpan aktivitas',
      type: 'error',
      duration: 5000
    });
  } finally {
    submitting.value = false;
  }
};

const handleBatchSubmit = async (submittedBatchForm) => {
  try {
    submittingBatch.value = true;
    
    // Prepare params for batch creation
    const activity = {
      name: submittedBatchForm.name,
      activity_type: submittedBatchForm.activity_type,
      time_start: submittedBatchForm.time_start,
      time_end: submittedBatchForm.time_end,
      hours_spent: submittedBatchForm.hours_spent,
      description: submittedBatchForm.description,
    };
    
    // Add creator_id if provided
    if (submittedBatchForm.creator_id) {
      activity.creator_id = parseInt(submittedBatchForm.creator_id);
    }
    
    // Include project_id if selected
    if (submittedBatchForm.project_id) {
      activity.project_id = Number(submittedBatchForm.project_id);
    }
    
    const response = await apiClient.post('/web/v2/team/bau/batch', {
      jsonrpc: '2.0',
      id: new Date().getTime(),
      params: {
        params: { // Tambahkan level nested 'params' sesuai ekspektasi backend
          activity,
          date_from: submittedBatchForm.date_from,
          date_to: submittedBatchForm.date_to,
          exclude_weekends: submittedBatchForm.exclude_weekends
        }
      }
    });

    if (response.data.result?.status === 'success' || response.data.result?.status === 'partial_success') {
      // Count how many activities were successfully created
      const createdCount = response.data.result.data?.created?.length || 0;
      const errorsCount = response.data.result.data?.errors?.length || 0;
      
      let message = `Berhasil membuat ${createdCount} aktivitas BAU`;
      if (errorsCount > 0) {
        message += ` dengan ${errorsCount} error`;
      }
      
      showToast({
        message,
        type: errorsCount > 0 ? 'warning' : 'success',
        duration: 5000
      });
      
      closeBatchModal();
      fetchActivities();
    } else {
      showToast({
        message: response.data.result?.message || 'Gagal membuat aktivitas batch',
        type: 'error',
        duration: 5000
      });
    }
  } catch (error) {
    console.error('Error creating batch activities:', error);
    showToast({
      message: error.message || 'Gagal membuat aktivitas batch',
      type: 'error',
      duration: 5000
    });
  } finally {
    submittingBatch.value = false;
  }
};

const verifyActivity = async (activity, newState) => {
  // If it's a direct call from the BAUDetailsModal, we need to get the activity
  // from selectedActivity if activity is just a string (the state)
  let activityToProcessVerify = activity;
  let stateToSet = newState;
  
  if (typeof activity === 'string') {
    // This means we received just the state from the BAUDetailsModal
    activityToProcessVerify = selectedActivity.value;
    stateToSet = activity; // In this case, activity is actually the state
  }
  
  try {
    const isNextDay = isVerificationNextDay(activityToProcessVerify.date);
    // If verification is done on H+1 and no reason is provided, show the reason dialog
    if (isNextDay) {
      // Store the activity and state for later use
      activityToVerify.value = { activity: activityToProcessVerify, newState: stateToSet };
      showReasonDialog.value = true;
      return;
    }
    
    // Otherwise, proceed with verification
    await processVerification(activityToProcessVerify, stateToSet, '');
  } catch (error) {
    console.error('Error in verifyActivity:', error);
    showToast({
      message: error.message || 'Gagal memverifikasi aktivitas',
      type: 'error',
      duration: 5000
    });
  }
};

const processVerification = async (activity, newState, reason = '') => {
  try {
    const response = await apiClient.post('/web/v2/team/bau/verify', {
      jsonrpc: '2.0',
      id: new Date().getTime(),
      params: {
        bau_id: activity.id,
        state: newState,
        verification_reason: reason,
        hours_spent: activity.hours_spent
      }
    });

    if (response.data.result?.status === 'success') {
      showToast({
        message: `Status aktivitas berhasil diubah menjadi ${newState === 'done' ? 'Selesai' : 'Tidak Selesai'}`,
        type: 'success'
      });
      closeDetailsModal();
      fetchActivities();
    } else {
      showToast({
        message: response.data.result?.message || 'Gagal memverifikasi aktivitas',
        type: 'error',
        duration: 5000
      });
    }
  } catch (error) {
    console.error('Error processing verification:', error);
    showToast({
      message: error.message || 'Gagal memverifikasi aktivitas',
      type: 'error',
      duration: 5000
    });
  }
};

const submitVerificationReason = (reason) => {
  if (!activityToVerify.value) return;
  
  processVerification(
    activityToVerify.value.activity, 
    activityToVerify.value.newState, 
    reason
  );
  
  // Reset state
  showReasonDialog.value = false;
  verificationReason.value = '';
  activityToVerify.value = null;
};

const editActivity = () => {
  if (!selectedActivity.value) return;
  
  // Copy activity data to form
  formData.value = {
    id: selectedActivity.value.id,
    name: selectedActivity.value.name,
    activity_type: selectedActivity.value.activity_type,
    date: selectedActivity.value.date,
    time_start: selectedActivity.value.time?.start || '09:00',
    time_end: selectedActivity.value.time?.end || '10:00',
    hours_spent: selectedActivity.value.hours_spent,
    description: selectedActivity.value.description || '',
    project_id: selectedActivity.value.project?.id || '',
    creator_id: selectedActivity.value.creator?.id || userEmployeeId.value,
    state: selectedActivity.value.state || 'planned',
    verification_reason: '',
  };
  
  isEditing.value = true;
  showDetailsModal.value = false;
  showCreateModal.value = true;
};

// 5. Modal Management
const closeModal = () => {
  showCreateModal.value = false;
  isEditing.value = false;
  formData.value = {
    id: null,
    name: '',
    activity_type: 'meeting',
    date: todayDate.value,
    time_start: '09:00',
    time_end: '10:00',
    hours_spent: 1,
    project_id: '',
    creator_id: userEmployeeId.value,
    description: '',
    state: 'planned',
    verification_reason: ''
  };
};

const closeDetailsModal = () => {
  showDetailsModal.value = false;
  selectedActivity.value = null;
};

const closeDayActivitiesModal = () => {
  showDayActivitiesModal.value = false;
  selectedDay.value = null;
  selectedDayActivities.value = [];
};

const closeBatchModal = () => {
  showBatchModal.value = false;
  batchFormData.value = {
    name: '',
    activity_type: 'meeting',
    date_from: todayDate.value,
    date_to: '',
    time_start: '09:00',
    time_end: '10:00',
    hours_spent: 1.0,
    project_id: '',
    creator_id: userEmployeeId.value,
    description: '',
    exclude_weekends: true
  };
};

const viewActivityDetails = (activity) => {
  selectedActivity.value = activity;
  showDetailsModal.value = true;
  
  // Close day activities modal if open
  if (showDayActivitiesModal.value) {
    showDayActivitiesModal.value = false;
  }
};

const viewDayActivities = (date, activities) => {
  selectedDay.value = date;
  selectedDayActivities.value = activities;
  showDayActivitiesModal.value = true;
};

const quickAddActivity = (date) => {
  // Only allow adding activities for today
  const selectedDate = new Date(date);
  const today = new Date();
  
  // Reset hours to 0 for proper date comparison
  selectedDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  
  // if (selectedDate.getTime() !== today.getTime()) {
  //   showToast({
  //     message: 'Aktivitas baru hanya dapat dibuat untuk hari ini',
  //     type: 'warning',
  //     duration: 3000
  //   });
  //   return;
  // }
  
  formData.value.date = date;
  isEditing.value = false;
  showCreateModal.value = true;
};

const handleTimeSlotClick = (timeSlotInfo) => {
  // Only allow adding activities for today
  const selectedDate = new Date(timeSlotInfo.date);
  const today = new Date();
  
  // Reset hours to 0 for proper date comparison
  selectedDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  
  // if (selectedDate.getTime() !== today.getTime()) {
  //   showToast({
  //     message: 'Aktivitas baru hanya dapat dibuat untuk hari ini',
  //     type: 'warning',
  //     duration: 3000
  //   });
  //   return;
  // }
  
  // Set form data with time slot info
  formData.value = {
    ...formData.value,
    date: timeSlotInfo.date,
    time_start: timeSlotInfo.time_start,
    time_end: timeSlotInfo.time_end,
    hours_spent: calculatedHours.value
  };
  
  isEditing.value = false;
  showCreateModal.value = true;
};

// 6. Helper Methods
const canEditActivity = (activity) => {
  if (!activity) return false;
  
  // Current date
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Activity date
  const activityDate = new Date(activity.date);
  activityDate.setHours(0, 0, 0, 0);
  
  // Can only edit today's activities or future activities
  const diffDays = Math.floor((today - activityDate) / (1000 * 60 * 60 * 24));
  
  // If it's verified, can't edit anymore
  if (activity.verification && activity.verification.verified_by) return false;
  
  // Check if current user is activity creator or has admin rights
  const isCreator = activity.creator?.id === userEmployeeId.value;
  const isAdmin = authStore.user?.is_admin === true || localStorage.getItem('isAdmin') === 'true';
  
  // Allow editing if it's today's activity or a future activity
  // AND either user is creator or admin
  return diffDays <= 0 && (isCreator || isAdmin);
};

const canVerifyActivity = (activity) => {
  if (!activity) return false;
  if (activity.state !== 'planned') return false;
  
  const activityDate = new Date(activity.date);
  activityDate.setHours(0, 0, 0, 0);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const diffDays = Math.floor((today - activityDate) / (1000 * 60 * 60 * 24));
  
  // Check if current user is activity creator or has verification rights
  const isCreator = activity.creator?.id === userEmployeeId.value;
  const isAdmin = authStore.user?.is_admin === true || localStorage.getItem('isAdmin') === 'true';
  const isTeamLead = localStorage.getItem('isTeamLead') === 'true' || authStore.user?.is_team_lead === true;
  const canVerifyBAU = isAdmin || isTeamLead;
  
  // Can verify if activity is on today or yesterday AND user has rights
  return diffDays <= 1 && (isCreator || canVerifyBAU);
};

// Tambahkan helper computed properties untuk permission jika perlu:
const isAdmin = computed(() => {
  return authStore.user?.is_admin === true || localStorage.getItem('isAdmin') === 'true';
});

const isTeamLead = computed(() => {
  return localStorage.getItem('isTeamLead') === 'true' || authStore.user?.is_team_lead === true;
});

const canVerifyBAU = computed(() => {
  return isAdmin.value || isTeamLead.value;
});


const isVerificationNextDay = (activityDate) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const date = new Date(activityDate);
  date.setHours(0, 0, 0, 0);
  
  const diffDays = Math.floor((today - date) / (1000 * 60 * 60 * 24));
  return diffDays === 1;
};

const determineStatusFromActivities = (activities) => {
  if (!activities || activities.length === 0) return 'planned';
  
  const allDone = activities.every(a => a.state === 'done');
  const anyNotDone = activities.some(a => a.state === 'not_done');
  
  if (allDone) return 'done';
  if (anyNotDone) return 'not_done';
  return 'planned';
};

const generateMonthDays = () => {
  const days = [];
  const year = currentDate.value.getFullYear();
  const month = currentDate.value.getMonth();
  
  // Get first day of month and last day of month
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  
  // Get days from previous month to fill first week
  const daysFromPrevMonth = firstDay.getDay();
  const prevMonth = new Date(year, month, 0);
  for (let i = 0; i < daysFromPrevMonth; i++) {
    const date = prevMonth.getDate() - daysFromPrevMonth + i + 1;
    const prevMonthYear = month === 0 ? year - 1 : year;
    const prevMonthNum = month === 0 ? 11 : month - 1;
    const fullDate = `${prevMonthYear}-${String(prevMonthNum + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
    
    days.push({
      date,
      fullDate,
      isCurrentMonth: false,
      isToday: false,
      activities: [],
      hasActivities: false,
      status: 'planned'
    });
  }
  
  // Current month days
  const today = new Date();
  for (let date = 1; date <= lastDay.getDate(); date++) {
    const dayDate = new Date(year, month, date);
    const fullDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
    
    days.push({
      date,
      fullDate,
      isCurrentMonth: true,
      isToday: dayDate.toDateString() === today.toDateString(),
      activities: [],
      hasActivities: false,
      status: 'planned'
    });
  }
  
  // Next month days to complete the grid
  const daysInGrid = Math.ceil(days.length / 7) * 7;
  const remainingDays = daysInGrid - days.length;
  
  for (let date = 1; date <= remainingDays; date++) {
    const nextMonthYear = month === 11 ? year + 1 : year;
    const nextMonthNum = month === 11 ? 0 : month + 1;
    const fullDate = `${nextMonthYear}-${String(nextMonthNum + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
    
    days.push({
      date,
      fullDate,
      isCurrentMonth: false,
      isToday: false,
      activities: [],
      hasActivities: false,
      status: 'planned'
    });
  }
  
  calendarDays.value = days;
};

const updateCalendarWithData = (activitiesByDate) => {
  if (viewMode.value === 'month') {
    // Generate month grid
    generateMonthDays();
    
    // Update calendar days with activity data
    calendarDays.value = calendarDays.value.map(day => {
      const dateData = activitiesByDate[day.fullDate];
      if (dateData) {
        return {
          ...day,
          activities: dateData.activities,
          hasActivities: dateData.activities.length > 0,
          status: determineStatusFromActivities(dateData.activities)
        };
      }
      return {
        ...day,
        activities: [],
        hasActivities: false,
        status: 'planned'
      };
    });
  } else {
    // Untuk tampilan minggu, siapkan data lengkap 7 hari
    const startDate = new Date(currentDate.value);
    startDate.setDate(startDate.getDate() - startDate.getDay()); // Mulai dari hari Minggu
    
    // Buat array untuk 7 hari minggu
    const weekDataArray = [];
    
    for (let i = 0; i < 7; i++) {
      const currentDayDate = new Date(startDate);
      currentDayDate.setDate(startDate.getDate() + i);
      const dateStr = formatDateYYYYMMDD(currentDayDate);
      
      // Ambil data dari activitiesByDate jika ada, atau gunakan data default
      const dateData = activitiesByDate[dateStr] || {
        activities: [],
        totalHours: 0,
        hasActivities: false,
        status: 'planned',
        targetAchieved: false
      };
      
      weekDataArray.push({
        date: dateStr,
        activities: dateData.activities,
        total_hours: dateData.totalHours
      });
    }
    
    // Perbarui weekData
    weekData.value = weekDataArray;
    
    console.log('Week data updated with 7 days:', weekData.value);
  }
};


const formatDate = (dateString) => {
  const date = new Date(dateString);
  
  // Indonesian month names
  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  
  return `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
};

const formatDateYYYYMMDD = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getActivityTypeColorClass = (type) => {
  if (!type) return 'bg-gray-100 text-gray-800';
  
  const colorMap = {
    'meeting': 'bg-blue-100 text-blue-800',
    'training': 'bg-green-100 text-green-800',
    'support': 'bg-pink-100 text-pink-800',
    'admin': 'bg-indigo-100 text-indigo-800',
    'other': 'bg-gray-100 text-gray-800'
  };
  
  return colorMap[type.toLowerCase()] || 'bg-gray-100 text-gray-800';
};

// Initialize batch form
const initBatchForm = () => {
  const today = new Date();
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);
  
  batchFormData.value.date_from = formatDateYYYYMMDD(today);
  batchFormData.value.date_to = formatDateYYYYMMDD(nextWeek);
};

// Watchers
watch([() => formData.value.time_start, () => formData.value.time_end], () => {
  formData.value.hours_spent = calculatedHours.value;
});

watch([() => batchFormData.value.time_start, () => batchFormData.value.time_end], () => {
  batchFormData.value.hours_spent = batchCalculatedHours.value;
});

// Watch department filter to update project dropdown
watch(() => filters.value.department_id, (newDeptId) => {
  // If department changes, reset project selection
  if (filters.value.project_id) {
    // Only reset if the current project doesn't belong to the new department
    const selectedProject = projects.value.find(p => p.id === parseInt(filters.value.project_id));
    if (selectedProject && selectedProject.department?.id !== parseInt(newDeptId)) {
      filters.value.project_id = '';
    }
  }
});

// Lifecycle hooks
onMounted(() => {
  // Initialize with today's date
  currentDate.value = new Date();
  
  // Set default date in form to today
  formData.value.date = formatDateYYYYMMDD(new Date());
  
  // Initialize batch form
  initBatchForm();
  
  // Fetch initial data
  fetchProjects();
  fetchDepartments();
  fetchEmployees();
  fetchActivities();

  
});

</script>