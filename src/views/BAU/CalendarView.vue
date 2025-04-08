<!-- src/views/dashboard/BAUCalendarView.vue -->
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
      <div class="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="md:flex md:items-center md:justify-between">
          <div class="flex-1 min-w-0">
            <h1 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Kalender BAU
            </h1>
          </div>
          <div class="mt-4 flex md:mt-0 md:ml-4 space-x-2">
            <button
              @click="showBatchModal = true"
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <CalendarIcon class="h-4 w-4 mr-1.5" />
              Rencanakan Batch
            </button>
            <button
              @click="showCreateModal = true"
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-rose-600 to-rose-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              :disabled="loading"
            >
              <PlusIcon class="h-4 w-4 mr-1.5" />
              Tambah Aktivitas
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <main class="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Calendar Navigation -->
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center">
          <button
            @click="previousPeriod"
            class="p-2 rounded-full hover:bg-gray-200 focus:outline-none"
            :disabled="loading"
          >
            <ChevronLeftIcon class="h-5 w-5 text-gray-500" />
          </button>
          <h2 class="text-xl font-semibold text-gray-900 mx-4">
            {{ calendarTitle }}
          </h2>
          <button
            @click="nextPeriod"
            class="p-2 rounded-full hover:bg-gray-200 focus:outline-none"
            :disabled="loading"
          >
            <ChevronRightIcon class="h-5 w-5 text-gray-500" />
          </button>
        </div>
        <div class="flex space-x-2">
          <button
            @click="changeViewMode('month')"
            :class="[
              'px-3 py-1.5 text-sm font-medium rounded-md',
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
              'px-3 py-1.5 text-sm font-medium rounded-md',
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
        <svg class="animate-spin h-8 w-8 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>

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
              'min-h-28 bg-white p-2',
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
                <CheckIcon v-if="day.status === 'done'" class="h-3 w-3 text-green-600" />
                <XMarkIcon v-else-if="day.status === 'not_done'" class="h-3 w-3 text-red-600" />
                <ClockIcon v-else class="h-3 w-3 text-yellow-600" />
              </span>
            </div>

            <!-- Activities for this day -->
            <div class="space-y-1">
              <div 
                v-for="activity in day.activities.slice(0, 2)" 
                :key="activity.id"
                class="px-2 py-1 text-xs rounded truncate cursor-pointer"
                :class="getActivityStatusClass(activity.state, activity.activity_type)"
                @click="viewActivityDetails(activity)"
              >
                {{ activity.name }} ({{ activity.hours_spent }}j)
              </div>

              <!-- Show more button if there are many activities -->
              <button 
                v-if="day.activities.length > 2" 
                @click="viewDayActivities(day.fullDate, day.activities)"
                class="text-xs text-red-600 hover:text-red-800"
              >
                + {{ day.activities.length - 2 }} lainnya
              </button>

              <!-- Quick add button -->
              <button 
                v-if="day.isCurrentMonth && day.isToday"
                @click="quickAddActivity(day.fullDate)"
                class="flex items-center text-xs text-gray-500 hover:text-red-600 mt-1"
              >
                <PlusIcon class="h-3 w-3 mr-0.5" />
                Tambah
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Weekly Calendar View -->
      <div v-else-if="viewMode === 'week'" class="bg-white rounded-lg shadow">
        <!-- Week Header -->
        <div class="grid grid-cols-8 border-b border-gray-200">
          <div class="border-r border-gray-200 py-3 text-center"></div> <!-- Empty cell for time -->
          <div 
            v-for="day in weekDays" 
            :key="day.date"
            :class="[
              'py-3 text-center',
              day.isToday ? 'bg-red-50' : ''
            ]"
          >
            <p 
              :class="[
                'text-sm font-semibold',
                day.isToday ? 'text-red-600' : 'text-gray-900'
              ]"
            >
              {{ day.dayName }}
            </p>
            <p 
              :class="[
                'text-xs',
                day.isToday ? 'text-red-600' : 'text-gray-500'
              ]"
            >
              {{ day.date }}
            </p>
          </div>
        </div>

        <!-- Week Content -->
        <div class="grid grid-cols-8 h-96 overflow-y-auto">
          <!-- Time Labels -->
          <div class="border-r border-gray-200 py-3">
            <div 
              v-for="hour in hours" 
              :key="hour"
              class="h-12 -mt-2.5 text-right pr-2"
            >
              <span class="text-xs text-gray-500">{{ hour }}:00</span>
            </div>
          </div>

          <!-- Day Columns -->
          <div 
            v-for="day in weekDays" 
            :key="day.date"
            class="relative border-r border-gray-200 p-1"
          >
            <!-- Hour Grid Lines -->
            <div 
              v-for="hour in hours" 
              :key="hour"
              class="absolute w-full h-px bg-gray-100"
              :style="`top: ${(hour - 8) * 48}px`"
            ></div>

            <!-- Activities -->
            <div 
              v-for="activity in day.activities" 
              :key="activity.id"
              class="absolute rounded-md px-2 py-1 text-xs font-medium overflow-hidden cursor-pointer"
              :class="getActivityStatusClass(activity.state, activity.activity_type)"
              :style="`
                top: ${calculateActivityPosition(activity)}px; 
                height: ${calculateActivityHeight(activity)}px;
                left: 4px;
                right: 4px;
              `"
              @click="viewActivityDetails(activity)"
            >
              <div class="truncate">{{ activity.name }}</div>
              <div class="text-xs">{{ formatActivityTime(activity) }}</div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Create BAU Activity Modal -->
    <TransitionRoot appear :show="showCreateModal" as="template">
      <Dialog as="div" @close="closeModal" class="relative z-10">
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black bg-opacity-25" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
                  {{ isEditing ? 'Edit Aktivitas BAU' : 'Tambah Aktivitas BAU' }}
                </DialogTitle>

                <form @submit.prevent="handleSubmit" class="mt-4 space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Nama Aktivitas <span class="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      v-model="formData.name"
                      required
                      class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Contoh: Rapat Tim, Dokumentasi, dll."
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700">Jenis Aktivitas <span class="text-red-500">*</span></label>
                    <select 
                      v-model="formData.activity_type"
                      required
                      class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <option value="design">Desain</option>
                      <option value="video">Video</option>
                      <option value="other">Lainnya</option>
                    </select>
                  </div>

                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Tanggal <span class="text-red-500">*</span></label>
                      <input 
                        type="date" 
                        v-model="formData.date"
                        required
                        :min="todayDate"
                        :max="todayDate"
                        class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                      <p class="mt-1 text-xs text-gray-500">Aktivitas hanya dapat dibuat untuk hari ini</p>
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700">Jam yang Dicatat</label>
                      <input 
                        type="number" 
                        v-model="formData.hours_spent"
                        step="0.5"
                        min="0"
                        class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="Jam"
                      />
                    </div>
                  </div>

                  <!-- Menambahkan pemilihan pengguna jika user adalah admin/supervisor -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Pelaksana <span class="text-red-500">*</span></label>
                    <TeamSelect
                      v-model="formData.creator_id"
                      :disabled="submitting"
                      :multiple="false"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700">Deskripsi</label>
                    <textarea 
                      v-model="formData.description"
                      rows="3"
                      class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Jelaskan apa yang Anda lakukan dalam aktivitas ini"
                    ></textarea>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700">Dampak pada Pengiriman</label>
                    <textarea 
                      v-model="formData.impact_on_delivery"
                      rows="2"
                      class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Bagaimana aktivitas ini berdampak pada pengiriman proyek?"
                    ></textarea>
                  </div>

                  <div v-if="isEditing && canVerify" class="border-t pt-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Status Aktivitas</label>
                    <div class="flex space-x-4">
                      <label class="inline-flex items-center">
                        <input type="radio" v-model="formData.state" value="planned" class="form-radio text-red-600 focus:ring-red-500" />
                        <span class="ml-2">Direncanakan</span>
                      </label>
                      <label class="inline-flex items-center">
                        <input type="radio" v-model="formData.state" value="done" class="form-radio text-green-600 focus:ring-green-500" />
                        <span class="ml-2">Selesai</span>
                      </label>
                      <label class="inline-flex items-center">
                        <input type="radio" v-model="formData.state" value="not_done" class="form-radio text-red-600 focus:ring-red-500" />
                        <span class="ml-2">Tidak Selesai</span>
                      </label>
                    </div>
                    <div v-if="showVerificationReason" class="mt-2">
                      <label class="block text-sm font-medium text-gray-700">Alasan Verifikasi <span class="text-red-500">*</span></label>
                      <textarea 
                        v-model="formData.verification_reason"
                        rows="2"
                        required
                        class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="Alasan mengapa verifikasi dilakukan pada H+1"
                      ></textarea>
                    </div>
                  </div>

                  <div class="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      @click="closeModal"
                      class="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      class="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                      :disabled="submitting"
                    >
                      <span v-if="submitting" class="inline-block animate-spin mr-2">⟳</span>
                      {{ submitting ? 'Menyimpan...' : (isEditing ? 'Perbarui' : 'Simpan') }}
                    </button>
                  </div>
                </form>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Activity Details Modal -->
    <TransitionRoot appear :show="showDetailsModal" as="template">
      <Dialog as="div" @close="closeDetailsModal" class="relative z-10">
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black bg-opacity-25" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
                  Detail Aktivitas
                </DialogTitle>

                <div v-if="selectedActivity" class="mt-4 space-y-4">
                  <div>
                    <h4 class="text-sm font-medium text-gray-500">Nama Aktivitas</h4>
                    <p class="mt-1 text-md text-gray-900">{{ selectedActivity.name }}</p>
                  </div>

                  <div class="flex space-x-4">
                    <div>
                      <h4 class="text-sm font-medium text-gray-500">Tanggal</h4>
                      <p class="mt-1 text-md text-gray-900">{{ formatDate(selectedActivity.date) }}</p>
                    </div>
                    <div>
                      <h4 class="text-sm font-medium text-gray-500">Jam Dicatat</h4>
                      <p class="mt-1 text-md text-gray-900">{{ selectedActivity.hours_spent }} jam</p>
                    </div>
                    <div>
                      <h4 class="text-sm font-medium text-gray-500">Jenis</h4>
                      <p class="mt-1">
                        <span 
                          :class="[
                            'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                            getActivityTypeColorClass(selectedActivity.activity_type)
                          ]"
                        >
                          {{ getTranslatedActivityType(selectedActivity.activity_type) }}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 class="text-sm font-medium text-gray-500">Status</h4>
                    <p class="mt-1">
                      <span 
                        :class="[
                          'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                          getActivityStatusClass(selectedActivity.state)
                        ]"
                      >
                        {{ selectedActivity.state === 'done' ? 'Selesai' : 
                          selectedActivity.state === 'not_done' ? 'Tidak Selesai' : 'Direncanakan' }}
                      </span>
                    </p>
                  </div>

                  <div v-if="selectedActivity.description">
                    <h4 class="text-sm font-medium text-gray-500">Deskripsi</h4>
                    <p class="mt-1 text-md text-gray-900">{{ selectedActivity.description }}</p>
                  </div>

                  <div v-if="selectedActivity.impact_on_delivery">
                    <h4 class="text-sm font-medium text-gray-500">Dampak pada Pengiriman</h4>
                    <p class="mt-1 text-md text-gray-900">{{ selectedActivity.impact_on_delivery }}</p>
                  </div>

                  <div v-if="selectedActivity.verified_by">
                    <h4 class="text-sm font-medium text-gray-500">Informasi Verifikasi</h4>
                    <p class="mt-1 text-xs text-gray-500">
                      <span class="font-medium">Diverifikasi oleh:</span> {{ selectedActivity.verified_by.name }}
                    </p>
                    <p class="mt-1 text-xs text-gray-500">
                      <span class="font-medium">Pada:</span> {{ formatDateTime(selectedActivity.verification_date) }}
                    </p>
                    <p v-if="selectedActivity.verification_reason" class="mt-1 text-xs text-gray-500">
                      <span class="font-medium">Alasan:</span> {{ selectedActivity.verification_reason }}
                    </p>
                  </div>
                </div>

                <div class="mt-6 flex justify-end space-x-3">
                  <button
                    v-if="canEditActivity(selectedActivity)"
                    type="button"
                    @click="editActivity"
                    class="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    Edit
                  </button>
                  
                  <div v-if="canVerifyActivity(selectedActivity)" class="flex space-x-2">
                    <button
                      type="button"
                      @click="verifyActivity(selectedActivity, 'done')"
                      class="inline-flex justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    >
                      <CheckIcon class="h-4 w-4 mr-1.5" />
                      Selesai
                    </button>
                    <button
                      type="button"
                      @click="verifyActivity(selectedActivity, 'not_done')"
                      class="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    >
                      <XMarkIcon class="h-4 w-4 mr-1.5" />
                      Tidak Selesai
                    </button>
                  </div>
                  
                  <button
                    type="button"
                    @click="closeDetailsModal"
                    class="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    Tutup
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Day Activities Modal -->
    <TransitionRoot appear :show="showDayActivitiesModal" as="template">
      <Dialog as="div" @close="closeDayActivitiesModal" class="relative z-10">
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black bg-opacity-25" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
                  Aktivitas untuk {{ selectedDayTitle }}
                </DialogTitle>

                <div class="mt-4">
                  <ul class="divide-y divide-gray-200">
                    <li v-for="activity in selectedDayActivities" :key="activity.id" class="py-3">
                      <div class="flex items-center justify-between">
                        <div>
                          <h4 class="text-sm font-medium text-gray-900">{{ activity.name }}</h4>
                          <p class="text-xs text-gray-500">{{ activity.hours_spent }} jam</p>
                        </div>
                        <div class="flex items-center">
                          <span 
                            :class="[
                              'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                              getActivityStatusClass(activity.state, activity.activity_type)
                            ]"
                          >
                            {{ activity.state === 'done' ? 'Selesai' : 
                              activity.state === 'not_done' ? 'Tidak Selesai' : 'Direncanakan' }}
                          </span>
                          <button
                            @click="viewActivityDetails(activity)"
                            class="ml-2 text-xs text-red-600 hover:text-red-900"
                          >
                            Detail
                          </button>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>

                <div class="mt-6 flex justify-between">
                  <button
                    v-if="isSelectedDayToday"
                    type="button"
                    @click="quickAddActivity(selectedDay)"
                    class="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    <PlusIcon class="h-4 w-4 mr-1" />
                    Tambah
                  </button>
                  <div></div> <!-- Spacer when button isn't shown -->
                  <button
                    type="button"
                    @click="closeDayActivitiesModal"
                    class="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    Tutup
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Verification Reason Dialog -->
    <TransitionRoot appear :show="showReasonDialog" as="template">
      <Dialog as="div" @close="showReasonDialog = false" class="relative z-10">
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black bg-opacity-25" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
                  Alasan Verifikasi H+1
                </DialogTitle>

                <div class="mt-2">
                  <p class="text-sm text-gray-500 mb-4">
                    Anda melakukan verifikasi aktivitas pada hari berikutnya. Mohon berikan alasan:
                  </p>
                  <textarea 
                    v-model="verificationReason"
                    rows="3"
                    required
                    class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Jelaskan alasan verifikasi dilakukan pada H+1"
                  ></textarea>
                </div>

                <div class="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    class="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    @click="showReasonDialog = false"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    class="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    @click="submitVerificationReason"
                    :disabled="!verificationReason"
                  >
                    Kirim
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- BAU Batch Modal -->
    <TransitionRoot appear :show="showBatchModal" as="template">
      <Dialog as="div" @close="closeBatchModal" class="relative z-10">
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black bg-opacity-25" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
                  Rencanakan Aktivitas BAU Batch
                </DialogTitle>

                <form @submit.prevent="handleBatchSubmit" class="mt-4 space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Nama Aktivitas <span class="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      v-model="batchFormData.name"
                      required
                      class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Contoh: Daily Stand-up, Weekly Report, dll."
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700">Jenis Aktivitas <span class="text-red-500">*</span></label>
                    <select 
                      v-model="batchFormData.activity_type"
                      required
                      class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <option value="design">Desain</option>
                      <option value="video">Video</option>
                      <option value="other">Lainnya</option>
                    </select>
                  </div>

                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Tanggal Mulai <span class="text-red-500">*</span></label>
                      <input 
                        type="date" 
                        v-model="batchFormData.date_from"
                        required
                        :min="todayDate"
                        class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700">Tanggal Selesai <span class="text-red-500">*</span></label>
                      <input 
                        type="date" 
                        v-model="batchFormData.date_to"
                        required
                        :min="batchFormData.date_from"
                        class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Jam yang Dicatat</label>
                    <input 
                      type="number" 
                      v-model="batchFormData.hours_spent"
                      step="0.5"
                      min="0"
                      class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Jam"
                    />
                    <p class="mt-1 text-xs text-gray-500">Jumlah jam yang dicatat untuk setiap aktivitas</p>
                  </div>

                  <!-- Menambahkan pemilihan pengguna jika user adalah admin/supervisor -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Pelaksana <span class="text-red-500">*</span></label>
                    <TeamSelect
                      v-model="batchFormData.creator_id"
                      :disabled="submittingBatch"
                      :multiple="false"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700">Deskripsi</label>
                    <textarea 
                      v-model="batchFormData.description"
                      rows="3"
                      class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Jelaskan apa yang dilakukan dalam aktivitas ini"
                    ></textarea>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700">Dampak pada Pengiriman</label>
                    <textarea 
                      v-model="batchFormData.impact_on_delivery"
                      rows="2"
                      class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Bagaimana aktivitas ini berdampak pada pengiriman proyek?"
                    ></textarea>
                  </div>

                  <div class="flex items-center mt-4">
                    <input 
                      type="checkbox" 
                      id="excludeWeekends" 
                      v-model="batchFormData.exclude_weekends"
                      class="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                    />
                    <label for="excludeWeekends" class="ml-2 block text-sm text-gray-900">
                      Hanya hari kerja (tidak termasuk Sabtu & Minggu)
                    </label>
                  </div>

                  <div class="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      @click="closeBatchModal"
                      class="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      class="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                      :disabled="submittingBatch"
                    >
                      <span v-if="submittingBatch" class="inline-block animate-spin mr-2">⟳</span>
                      {{ submittingBatch ? 'Menyimpan...' : 'Buat Aktivitas Batch' }}
                    </button>
                  </div>
                </form>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useToast } from '@/composables/useToast'
import { useAuthStore } from '@/stores/auth'
import apiClient from '@/config/api'
import TeamSelect from '@/components/TeamSelect.vue'
import { 
  PlusIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckIcon,
  XMarkIcon,
  ClockIcon,
  CalendarIcon
} from '@heroicons/vue/24/outline'
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from '@headlessui/vue'
import Toast from '@/components/Toast.vue'

// Auth Store
const authStore = useAuthStore()

// State
const { toast, showToast } = useToast()
const loading = ref(false)
const submitting = ref(false)
const submittingBatch = ref(false)
const viewMode = ref('month')
const currentDate = ref(new Date())
const showCreateModal = ref(false)
const showBatchModal = ref(false)
const showDetailsModal = ref(false)
const showDayActivitiesModal = ref(false)
const showReasonDialog = ref(false)
const selectedActivity = ref(null)
const activityToVerify = ref(null)
const verificationReason = ref('')
const selectedDay = ref(null)
const selectedDayActivities = ref([])
const isEditing = ref(false)

// Form data
const formData = ref({
  id: null,
  name: '',
  activity_type: '',
  date: '',
  hours_spent: '',
  description: '',
  impact_on_delivery: '',
  creator_id: authStore.user?.uid || 1,
  state: 'planned',
  verification_reason: ''
})

// Batch form data
const batchFormData = ref({
  name: '',
  activity_type: '',
  date_from: '',
  date_to: '',
  hours_spent: 1.0,
  description: '',
  impact_on_delivery: '',
  creator_id: authStore.user?.uid || 1,
  exclude_weekends: true
})

// Calendar data
const dayHeaders = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']
const hours = Array.from({ length: 13 }, (_, i) => i + 8) // 8 AM to 8 PM
const calendarDays = ref([])
const weekDays = ref([])

// Computed properties
const todayDate = computed(() => {
  return formatDateYYYYMMDD(new Date())
})

const isAdmin = computed(() => {
  // Sesuaikan dengan logic untuk menentukan apakah user adalah admin/supervisor
  return authStore.user?.role === 'admin' || authStore.user?.role === 'supervisor'
})

const showVerificationReason = computed(() => {
  if (!isEditing.value || formData.value.state === 'planned') return false
  
  const activityDate = new Date(formData.value.date)
  activityDate.setHours(0, 0, 0, 0)
  
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const diffDays = Math.floor((today - activityDate) / (1000 * 60 * 60 * 24))
  
  return diffDays === 1 // Tampilkan alasan jika verifikasi H+1
})

const canVerify = computed(() => {
  if (!formData.value.date) return false
  
  const activityDate = new Date(formData.value.date)
  activityDate.setHours(0, 0, 0, 0)
  
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const diffDays = Math.floor((today - activityDate) / (1000 * 60 * 60 * 24))
  
  // Bisa verifikasi jika hari yang sama (H) atau hari berikutnya (H+1)
  return diffDays <= 1
})

const calendarTitle = computed(() => {
  if (viewMode.value === 'week') {
    // For week view, show range (e.g., "7 - 13 Mar 2025")
    const firstDay = weekDays.value[0]
    const lastDay = weekDays.value[weekDays.value.length - 1]
    if (firstDay && lastDay) {
      const firstDate = new Date(firstDay.fullDate)
      const lastDate = new Date(lastDay.fullDate)
      const sameMonth = firstDate.getMonth() === lastDate.getMonth()
      const sameYear = firstDate.getFullYear() === lastDate.getFullYear()

      // Format for Indonesian display
      const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
                         'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']

      if (sameMonth && sameYear) {
        return `${firstDate.getDate()} - ${lastDate.getDate()} ${monthNames[firstDate.getMonth()]} ${firstDate.getFullYear()}`
      } else if (sameYear) {
        return `${firstDate.getDate()} ${monthNames[firstDate.getMonth()]} - ${lastDate.getDate()} ${monthNames[lastDate.getMonth()]} ${firstDate.getFullYear()}`
      } else {
        return `${firstDate.getDate()} ${monthNames[firstDate.getMonth()]} ${firstDate.getFullYear()} - ${lastDate.getDate()} ${monthNames[lastDate.getMonth()]} ${lastDate.getFullYear()}`
      }
    }
  }
  
  // For month view - using Indonesian month names
  const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
                      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
  
  return `${monthNames[currentDate.value.getMonth()]} ${currentDate.value.getFullYear()}`
})

const selectedDayTitle = computed(() => {
  if (!selectedDay.value) return ''
  return formatDate(selectedDay.value)
})

const isSelectedDayToday = computed(() => {
  if (!selectedDay.value) return false
  
  const selectedDate = new Date(selectedDay.value)
  selectedDate.setHours(0, 0, 0, 0)
  
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  return selectedDate.getTime() === today.getTime()
})

// Methods for activity data fetching and calendar
const fetchActivities = async () => {
  try {
    loading.value = true
    
    // Prepare date range based on current view and month
    let dateFrom, dateTo
    
    if (viewMode.value === 'month') {
      // Month range
      const year = currentDate.value.getFullYear()
      const month = currentDate.value.getMonth()
      
      // First day of month
      dateFrom = new Date(year, month, 1)
      // Last day of month
      dateTo = new Date(year, month + 1, 0)
    } else {
      // Week range
      const currentDay = new Date(currentDate.value)
      
      // Determine first day of week (Sunday)
      const firstDayOfWeek = new Date(currentDay)
      const day = currentDay.getDay()
      firstDayOfWeek.setDate(currentDay.getDate() - day)
      
      // Last day of week (Saturday)
      const lastDayOfWeek = new Date(firstDayOfWeek)
      lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6)
      
      dateFrom = firstDayOfWeek
      dateTo = lastDayOfWeek
    }
    
    // Format dates (YYYY-MM-DD)
    const dateFromStr = formatDateYYYYMMDD(dateFrom)
    const dateToStr = formatDateYYYYMMDD(dateTo)
    
    // Call BAU calendar API
    const response = await apiClient.post('/web/v2/content/bau/calendar', {
      jsonrpc: '2.0',
      method: 'call',
      id: new Date().getTime(),
      params: {
        date_from: dateFromStr,
        date_to: dateToStr
      }
    })

    if (response.data.result?.status === 'success') {
      const calendarData = response.data.result.data
      
      // Store data for reference
      const activitiesByDate = {}
      
      // Convert API data to expected format
      calendarData.forEach(day => {
        // Determine day status based on activities
        let dayStatus = 'planned'
        const hasActivities = day.activities && day.activities.length > 0
        
        if (hasActivities) {
          const allDone = day.activities.every(a => a.state === 'done')
          const anyNotDone = day.activities.some(a => a.state === 'not_done')
          
          if (allDone) {
            dayStatus = 'done'
          } else if (anyNotDone) {
            dayStatus = 'not_done'
          }
        }
        
        activitiesByDate[day.date] = {
          activities: day.activities || [],
          totalHours: day.total_hours || 0,
          hasActivities: hasActivities,
          status: dayStatus
        }
      })
      
      // Update calendar displays with API data
      updateCalendarWithData(activitiesByDate)
    } else {
      showToast({
        message: response.data.result?.message || 'Gagal memuat data kalender',
        type: 'error',
        duration: 5000
      })
    }
  } catch (error) {
    console.error('Error fetching activities:', error)
    showToast({
      message: error.message || 'Gagal memuat aktivitas',
      type: 'error',
      duration: 5000
    })
  } finally {
    loading.value = false
  }
}

const updateCalendarWithData = (activitiesByDate) => {
  if (viewMode.value === 'month') {
    // Generate month grid
    generateMonthDays()
    
    // Update calendar days with activity data
    calendarDays.value = calendarDays.value.map(day => {
      const dateData = activitiesByDate[day.fullDate]
      if (dateData) {
        return {
          ...day,
          activities: dateData.activities,
          hasActivities: dateData.hasActivities,
          status: dateData.status
        }
      }
      return {
        ...day,
        activities: [],
        hasActivities: false,
        status: 'planned'
      }
    })
  } else {
    // Generate week days
    generateWeekDays()
    
    // Update week days with activity data
    weekDays.value = weekDays.value.map(day => {
      const dateData = activitiesByDate[day.fullDate]
      if (dateData) {
        return {
          ...day,
          activities: dateData.activities.map(activity => {
            // Ensure time information for week view
            if (!activity.time && activity.hours_spent) {
              // Estimate time slots (simple approach: start at 9 AM)
              const hours = parseFloat(activity.hours_spent)
              const startHour = 9 // Default start at 9 AM
              const endHour = Math.min(startHour + hours, 17) // Cap at 5 PM
              
              return {
                ...activity,
                time: {
                  start: startHour,
                  end: endHour
                }
              }
            }
            return activity
          })
        }
      }
      return {
        ...day,
        activities: []
      }
    })
  }
}

const generateMonthDays = () => {
  const days = []
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  
  // Get first day of month and last day of month
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  
  // Get days from previous month to fill first week
  const daysFromPrevMonth = firstDay.getDay()
  const prevMonth = new Date(year, month, 0)
  for (let i = 0; i < daysFromPrevMonth; i++) {
    const date = prevMonth.getDate() - daysFromPrevMonth + i + 1
    const prevMonthYear = month === 0 ? year - 1 : year
    const prevMonthNum = month === 0 ? 11 : month - 1
    const fullDate = `${prevMonthYear}-${String(prevMonthNum + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`
    
    days.push({
      date,
      fullDate,
      isCurrentMonth: false,
      isToday: false,
      activities: [],
      hasActivities: false,
      status: 'planned'
    })
  }
  
  // Current month days
  const today = new Date()
  for (let date = 1; date <= lastDay.getDate(); date++) {
    const dayDate = new Date(year, month, date)
    const fullDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`
    
    days.push({
      date,
      fullDate,
      isCurrentMonth: true,
      isToday: dayDate.toDateString() === today.toDateString(),
      activities: [],
      hasActivities: false,
      status: 'planned'
    })
  }
  
  // Next month days to complete the grid
  const daysInGrid = Math.ceil(days.length / 7) * 7
  const remainingDays = daysInGrid - days.length
  
  for (let date = 1; date <= remainingDays; date++) {
    const nextMonthYear = month === 11 ? year + 1 : year
    const nextMonthNum = month === 11 ? 0 : month + 1
    const fullDate = `${nextMonthYear}-${String(nextMonthNum + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`
    
    days.push({
      date,
      fullDate,
      isCurrentMonth: false,
      isToday: false,
      activities: [],
      hasActivities: false,
      status: 'planned'
    })
  }
  
  calendarDays.value = days
}

const generateWeekDays = () => {
  const days = []
  const currentDay = new Date(currentDate.value)
  
  // Get first day of the week (Sunday)
  const firstDayOfWeek = new Date(currentDay)
  const day = currentDay.getDay()
  firstDayOfWeek.setDate(currentDay.getDate() - day)
  
  // Translation for days
  const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des']
  
  // Generate 7 days
  for (let i = 0; i < 7; i++) {
    const date = new Date(firstDayOfWeek)
    date.setDate(firstDayOfWeek.getDate() + i)
    
    // Format date in Indonesian style
    const formattedDate = `${date.getDate()} ${monthNames[date.getMonth()]}`
    
    // Day name
    const dayName = dayNames[date.getDay()]
    
    // Check if it's today
    const today = new Date()
    const isToday = date.toDateString() === today.toDateString()
    
    // Date string for API
    const fullDate = formatDateYYYYMMDD(date)
    
    days.push({
      date: formattedDate,
      dayName,
      fullDate,
      isToday,
      activities: []
    })
  }
  
  weekDays.value = days
}

const changeViewMode = (mode) => {
  if (viewMode.value === mode) return
  viewMode.value = mode
  fetchActivities()
}

const previousPeriod = () => {
  const newDate = new Date(currentDate.value)
  if (viewMode.value === 'month') {
    newDate.setMonth(newDate.getMonth() - 1)
  } else {
    newDate.setDate(newDate.getDate() - 7)
  }
  currentDate.value = newDate
  fetchActivities()
}

const nextPeriod = () => {
  const newDate = new Date(currentDate.value)
  if (viewMode.value === 'month') {
    newDate.setMonth(newDate.getMonth() + 1)
  } else {
    newDate.setDate(newDate.getDate() + 7)
  }
  currentDate.value = newDate
  fetchActivities()
}

// Modal management methods
const closeModal = () => {
  showCreateModal.value = false
  isEditing.value = false
  formData.value = {
    id: null,
    name: '',
    activity_type: '',
    date: todayDate.value,
    hours_spent: '',
    description: '',
    impact_on_delivery: '',
    creator_id: authStore.user?.uid || 1,
    state: 'planned',
    verification_reason: ''
  }
}

const closeDetailsModal = () => {
  showDetailsModal.value = false
  selectedActivity.value = null
}

const closeDayActivitiesModal = () => {
  showDayActivitiesModal.value = false
  selectedDay.value = null
  selectedDayActivities.value = []
}

const closeBatchModal = () => {
  showBatchModal.value = false
  batchFormData.value = {
    name: '',
    activity_type: '',
    date_from: todayDate.value,
    date_to: '',
    hours_spent: 1.0,
    description: '',
    impact_on_delivery: '',
    creator_id: authStore.user?.uid || 1,
    exclude_weekends: true
  }
}

const quickAddActivity = (date) => {
  // Only allow adding activities for today
  const selectedDate = new Date(date)
  const today = new Date()
  
  // Reset hours to 0 for proper date comparison
  selectedDate.setHours(0, 0, 0, 0)
  today.setHours(0, 0, 0, 0)
  
  if (selectedDate.getTime() !== today.getTime()) {
    showToast({
      message: 'Aktivitas baru hanya dapat dibuat untuk hari ini',
      type: 'warning',
      duration: 3000
    })
    return
  }
  
  formData.value.date = date
  isEditing.value = false
  showCreateModal.value = true
}

const viewActivityDetails = (activity) => {
  selectedActivity.value = activity
  showDetailsModal.value = true
  
  // Close day activities modal if open
  if (showDayActivitiesModal.value) {
    showDayActivitiesModal.value = false
  }
}

const viewDayActivities = (date, activities) => {
  selectedDay.value = date
  selectedDayActivities.value = activities
  showDayActivitiesModal.value = true
}

// Activity manipulation methods
const canEditActivity = (activity) => {
  if (!activity) return false
  
  // Can edit if the activity belongs to user
  const isOwnActivity = activity.creator?.id === (authStore.user?.uid || 1)
  
  // Admin can edit any activity
  const canAdminEdit = isAdmin.value
  
  return isOwnActivity || canAdminEdit
}

const canVerifyActivity = (activity) => {
  if (!activity) return false
  if (activity.state !== 'planned') return false
  
  const activityDate = new Date(activity.date)
  activityDate.setHours(0, 0, 0, 0)
  
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const diffDays = Math.floor((today - activityDate) / (1000 * 60 * 60 * 24))
  
  // Can verify if activity is on today or yesterday
  return diffDays <= 1
}

const editActivity = () => {
  if (!selectedActivity.value) return
  
  // Copy activity data to form
  formData.value = {
    id: selectedActivity.value.id,
    name: selectedActivity.value.name,
    activity_type: selectedActivity.value.activity_type,
    date: selectedActivity.value.date,
    hours_spent: selectedActivity.value.hours_spent,
    description: selectedActivity.value.description || '',
    impact_on_delivery: selectedActivity.value.impact_on_delivery || '',
    creator_id: selectedActivity.value.creator?.id || authStore.user?.uid || 1,
    state: selectedActivity.value.state || 'planned',
    verification_reason: '',
  }
  
  isEditing.value = true
  showDetailsModal.value = false
  showCreateModal.value = true
}

const verifyActivity = async (activity, newState, reason = '') => {
  try {
    const isNextDay = isVerificationNextDay(activity.date)
    // Jika verifikasi dilakukan H+1 dan tidak ada alasan, tampilkan dialog
    if (isNextDay && !reason) {
      showReasonDialog.value = true
      activityToVerify.value = { activity, newState }
      return
    }
    
    const response = await apiClient.post('/web/v2/content/bau/verify', {
      jsonrpc: '2.0',
      method: 'call',
      id: new Date().getTime(),
      params: {
        bau_id: activity.id,
        state: newState,
        verification_reason: reason,
        hours_spent: activity.hours_spent
      }
    })

    if (response.data.result?.status === 'success') {
      showToast({
        message: `Status aktivitas berhasil diubah menjadi ${newState === 'done' ? 'Selesai' : 'Tidak Selesai'}`,
        type: 'success'
      })
      closeDetailsModal()
      fetchActivities()
    } else {
      showToast({
        message: response.data.result?.message || 'Gagal memverifikasi aktivitas',
        type: 'error',
        duration: 5000
      })
    }
  } catch (error) {
    console.error('Error verifying activity:', error)
    showToast({
      message: error.message || 'Gagal memverifikasi aktivitas',
      type: 'error',
      duration: 5000
    })
  }
}

const submitVerificationReason = () => {
  if (!activityToVerify.value) return
  
  verifyActivity(
    activityToVerify.value.activity, 
    activityToVerify.value.newState, 
    verificationReason.value
  )
  
  // Reset state
  showReasonDialog.value = false
  verificationReason.value = ''
  activityToVerify.value = null
}

const handleSubmit = async () => {
  try {
    // Validasi tanggal (hanya hari ini untuk pembuatan baru)
    if (!isEditing.value && formData.value.date !== todayDate.value) {
      showToast({
        message: 'Aktivitas baru hanya dapat dibuat untuk hari ini',
        type: 'error',
        duration: 5000
      })
      return
    }
    
    submitting.value = true
    
    // Determine operation (create or update)
    const operation = isEditing.value ? 'update' : 'create'
    
    // Prepare params
    const params = {
      operation,
      ...formData.value
    }
    
    // Add bau_id for updates
    if (isEditing.value && formData.value.id) {
      params.bau_id = formData.value.id
    }
    
    // Jika state berubah dan verifikasi diperlukan, tambahkan info verifikasi
    if (isEditing.value && 
        formData.value.state !== 'planned' && 
        showVerificationReason.value && 
        !formData.value.verification_reason) {
      showToast({
        message: 'Alasan verifikasi diperlukan untuk aktivitas H+1',
        type: 'error',
        duration: 5000
      })
      submitting.value = false
      return
    }
    
    // Call the API
    const response = await apiClient.post('/web/v2/content/bau', {
      jsonrpc: '2.0',
      method: 'call',
      id: new Date().getTime(),
      params
    })

    if (response.data.result?.status === 'success') {
      showToast({
        message: isEditing.value ? 'Aktivitas berhasil diperbarui' : 'Aktivitas berhasil dibuat',
        type: 'success'
      })
      closeModal()
      fetchActivities()
    } else {
      showToast({
        message: response.data.result?.message || 'Gagal menyimpan aktivitas',
        type: 'error',
        duration: 5000
      })
    }
  } catch (error) {
    console.error('Error saving activity:', error)
    showToast({
      message: error.message || 'Gagal menyimpan aktivitas',
      type: 'error',
      duration: 5000
    })
  } finally {
    submitting.value = false
  }
}

const handleBatchSubmit = async () => {
  try {
    // Validasi tanggal
    if (new Date(batchFormData.value.date_from) > new Date(batchFormData.value.date_to)) {
      showToast({
        message: 'Tanggal mulai harus sebelum tanggal selesai',
        type: 'error',
        duration: 5000
      })
      return
    }

    submittingBatch.value = true
    
    // Prepare params for batch creation
    const activity = {
      name: batchFormData.value.name,
      activity_type: batchFormData.value.activity_type,
      creator_id: batchFormData.value.creator_id,
      hours_spent: batchFormData.value.hours_spent,
      description: batchFormData.value.description,
      impact_on_delivery: batchFormData.value.impact_on_delivery
    }
    
    const response = await apiClient.post('/web/v2/content/bau/batch', {
      jsonrpc: '2.0',
      method: "call",
      id: new Date().getTime(),
      params: {
        activity,
        date_from: batchFormData.value.date_from,
        date_to: batchFormData.value.date_to,
        exclude_weekends: batchFormData.value.exclude_weekends
      }
    })

    if (response.data.result?.status === 'success' || response.data.result?.status === 'partial_success') {
      // Hitung jumlah aktivitas yang berhasil dibuat
      const createdCount = response.data.result.data?.created?.length || 0
      const errorsCount = response.data.result.data?.errors?.length || 0
      
      let message = `Berhasil membuat ${createdCount} aktivitas BAU`
      if (errorsCount > 0) {
        message += ` dengan ${errorsCount} error`
      }
      
      showToast({
        message,
        type: errorsCount > 0 ? 'warning' : 'success',
        duration: 5000
      })
      
      closeBatchModal()
      fetchActivities()
    } else {
      showToast({
        message: response.data.result?.message || 'Gagal membuat aktivitas batch',
        type: 'error',
        duration: 5000
      })
    }
  } catch (error) {
    console.error('Error creating batch activities:', error)
    showToast({
      message: error.message || 'Gagal membuat aktivitas batch',
      type: 'error',
      duration: 5000
    })
  } finally {
    submittingBatch.value = false
  }
}

// Helper methods
const isPastDeadline = (activityDate) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const date = new Date(activityDate)
  date.setHours(0, 0, 0, 0)
  
  // Hitung selisih hari
  const diffDays = Math.floor((today - date) / (1000 * 60 * 60 * 24))
  
  // Batas verifikasi adalah H+1, jadi jika selisih > 1 hari, sudah melewati batas
  return diffDays > 1
}

const isVerificationNextDay = (activityDate) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const date = new Date(activityDate)
  date.setHours(0, 0, 0, 0)
  
  const diffDays = Math.floor((today - date) / (1000 * 60 * 60 * 24))
  return diffDays === 1
}

const calculateActivityPosition = (activity) => {
  // Calculate vertical position based on start time
  // Assuming 8 AM (hour 8) is at the top (0px) and each hour is 48px tall
  if (!activity.time) return 0
  
  const startHour = typeof activity.time.start === 'string' 
    ? parseInt(activity.time.start.split(':')[0])
    : activity.time.start
    
  return (startHour - 8) * 48
}

const calculateActivityHeight = (activity) => {
  // Calculate height based on duration
  if (!activity.time) return 48
  
  let startHour, endHour
  
  if (typeof activity.time.start === 'string') {
    startHour = parseInt(activity.time.start.split(':')[0])
    endHour = parseInt(activity.time.end.split(':')[0])
  } else {
    startHour = activity.time.start
    endHour = activity.time.end
  }
  
  // Handle minutes if provided
  let startMinutes = 0, endMinutes = 0
  
  if (typeof activity.time.start === 'string' && activity.time.start.includes(':')) {
    startMinutes = parseInt(activity.time.start.split(':')[1]) / 60
  }
  
  if (typeof activity.time.end === 'string' && activity.time.end.includes(':')) {
    endMinutes = parseInt(activity.time.end.split(':')[1]) / 60
  }
  
  const duration = (endHour + endMinutes) - (startHour + startMinutes)
  return Math.max(duration * 48 - 2, 20) // Minimum height of 20px
}

const formatActivityTime = (activity) => {
  if (!activity.time) return ''
  
  // Format the time display
  if (typeof activity.time.start === 'string' && typeof activity.time.end === 'string') {
    return `${activity.time.start} - ${activity.time.end}`
  }
  
  return `${activity.time.start}:00 - ${activity.time.end}:00`
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  
  // Indonesian month names
  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ]
  
  return `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`
}

const formatDateTime = (dateTimeString) => {
  if (!dateTimeString) return '-'
  
  const dateTime = new Date(dateTimeString)
  
  // Indonesian month names
  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ]
  
  const day = dateTime.getDate()
  const month = monthNames[dateTime.getMonth()]
  const year = dateTime.getFullYear()
  const hours = String(dateTime.getHours()).padStart(2, '0')
  const minutes = String(dateTime.getMinutes()).padStart(2, '0')
  
  return `${day} ${month} ${year}, ${hours}:${minutes}`
}

const formatDateYYYYMMDD = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const getActivityTypeColorClass = (type) => {
  if (!type) return 'bg-gray-100 text-gray-800'
  
  const colorMap = {
    'design': 'bg-purple-100 text-purple-800',
    'video': 'bg-red-100 text-red-800',
    'other': 'bg-gray-100 text-gray-800'
  }
  
  return colorMap[type.toLowerCase()] || 'bg-gray-100 text-gray-800'
}

const getActivityStatusClass = (state, type = 'other') => {
  // Status class takes precedence
  switch(state) {
    case 'done':
      return 'bg-green-100 text-green-800'
    case 'not_done':
      return 'bg-red-100 text-red-800'
    default: // planned
      // Fall back to type-based coloring
      return getActivityTypeColorClass(type)
  }
}

const getTranslatedActivityType = (type) => {
  if (!type) return 'Lainnya';
  
  const translations = {
    'meeting': 'Rapat',
    'training': 'Pelatihan',
    'documentation': 'Dokumentasi',
    'support': 'Support',
    'admin': 'Administrasi',
    'planning': 'Perencanaan',
    'other': 'Lainnya',
    'design': 'Desain',
    'video': 'Video'
  };
  
  return translations[type.toLowerCase()] || type;
}

// Initialize
const initBatchForm = () => {
  const today = new Date()
  const nextWeek = new Date(today)
  nextWeek.setDate(today.getDate() + 7)
  
  batchFormData.value.date_from = formatDateYYYYMMDD(today)
  batchFormData.value.date_to = formatDateYYYYMMDD(nextWeek)
}

// Watch for changes
watch(viewMode, () => {
  fetchActivities()
})

watch(currentDate, () => {
  fetchActivities()
})

onMounted(() => {
  // Initialize with today's date
  currentDate.value = new Date()
  
  // Set default date in form to today
  formData.value.date = formatDateYYYYMMDD(new Date())
  
  // Initialize batch form
  initBatchForm()
  
  // Fetch initial activities
  fetchActivities()
})
</script>