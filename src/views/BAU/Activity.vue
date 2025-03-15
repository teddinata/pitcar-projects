<!-- src/views/dashboard/BAUActivities.vue -->
<template>
  <div class="min-h-screen bg-gray-50">
    <Toast
      v-model:show="toast.show"
      :message="toast.message"
      :type="toast.type"
      :duration="toast.duration"
    />
    
    <!-- Header with Filters -->
    <div class="bg-white shadow">
      <div class="w-full max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
          <!-- Title and Quick Filter Buttons -->
          <div class="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
            <h1 class="text-xl sm:text-2xl font-semibold text-gray-900">Aktivitas BAU</h1>
            
            <!-- Period Quick Selector -->
            <div class="mt-2 sm:mt-0 flex space-x-2 overflow-x-auto">
              <button
                @click="filterCurrentMonth"
                :class="[
                  'px-3 py-1.5 text-sm rounded-md transition-colors duration-200',
                  isCurrentMonthActive ? 'bg-red-100 text-red-700 font-medium ring-1 ring-red-300' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                ]"
              >
                Bulan Ini
              </button>
              <button
                @click="filterPreviousMonth"
                :class="[
                  'px-3 py-1.5 text-sm rounded-md transition-colors duration-200',
                  isPreviousMonthActive ? 'bg-red-100 text-red-700 font-medium ring-1 ring-red-300' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                ]"
              >
                Bulan Lalu
              </button>
              <button
                @click="filterToday"
                :class="[
                  'px-3 py-1.5 text-sm rounded-md transition-colors duration-200',
                  isTodayActive ? 'bg-red-100 text-red-700 font-medium ring-1 ring-red-300' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                ]"
              >
                Hari Ini
              </button>
            </div>
          </div>
    
          <!-- Action Buttons -->
          <div class="flex space-x-2">
            <button
              @click="showFilterModal = true"
              class="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
            >
              <FunnelIcon class="h-4 w-4 mr-1.5" />
              <span>Filter</span>
              <span v-if="activeFiltersCount > 0" class="ml-1.5 px-1.5 py-0.5 text-xs rounded-full bg-red-100 text-red-800">
                {{ activeFiltersCount }}
              </span>
            </button>
    
            <button
              @click="showCreateModal = true"
              class="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
            >
              <PlusIcon class="h-4 w-4 mr-1.5" />
              Tambah
            </button>
    
            <button
              @click="showBatchModal = true"
              class="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <CalendarIcon class="h-4 w-4 mr-1.5" />
              Batch
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Filter Modal -->
    <TransitionRoot appear :show="showFilterModal" as="template">
      <Dialog as="div" @close="showFilterModal = false" class="relative z-10">
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
                  Filter Aktivitas
                </DialogTitle>
    
                <div class="mt-4 space-y-4">
                  <!-- Date Range Filter -->
                  <div>
                    <h4 class="text-sm font-medium text-gray-700 mb-2">Rentang Tanggal</h4>
                    <div class="grid grid-cols-2 gap-3">
                      <div>
                        <label class="block text-xs text-gray-500 mb-1">Dari</label>
                        <input 
                          type="date" 
                          v-model="filters.date_from"
                          class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                      </div>
                      <div>
                        <label class="block text-xs text-gray-500 mb-1">Sampai</label>
                        <input 
                          type="date" 
                          v-model="filters.date_to"
                          class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                      </div>
                    </div>
                  </div>
    
                  <!-- Activity Type Filter -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Jenis Aktivitas</label>
                    <div class="grid grid-cols-3 gap-2">
                      <button
                        @click="toggleActivityTypeFilter('')"
                        :class="[
                          'px-3 py-2 text-sm rounded-md text-center transition-colors duration-200',
                          filters.activity_type === '' ? 'bg-red-100 text-red-700 font-medium ring-1 ring-red-300' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                        ]"
                      >
                        Semua
                      </button>
                      <button
                        @click="toggleActivityTypeFilter('design')"
                        :class="[
                          'px-3 py-2 text-sm rounded-md text-center transition-colors duration-200',
                          filters.activity_type === 'design' ? 'bg-purple-100 text-purple-700 font-medium ring-1 ring-purple-300' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                        ]"
                      >
                        Desain
                      </button>
                      <button
                        @click="toggleActivityTypeFilter('video')"
                        :class="[
                          'px-3 py-2 text-sm rounded-md text-center transition-colors duration-200',
                          filters.activity_type === 'video' ? 'bg-red-100 text-red-700 font-medium ring-1 ring-red-300' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                        ]"
                      >
                        Video
                      </button>
                      <button
                        @click="toggleActivityTypeFilter('other')"
                        :class="[
                          'px-3 py-2 text-sm rounded-md text-center transition-colors duration-200',
                          filters.activity_type === 'other' ? 'bg-gray-300 text-gray-700 font-medium ring-1 ring-gray-400' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                        ]"
                      >
                        Lainnya
                      </button>
                    </div>
                  </div>
    
                  <!-- Status Filter -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <div class="grid grid-cols-2 gap-2">
                      <button
                        @click="toggleStatusFilter('')"
                        :class="[
                          'px-3 py-2 text-sm rounded-md text-center transition-colors duration-200',
                          filters.state === '' ? 'bg-red-100 text-red-700 font-medium ring-1 ring-red-300' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                        ]"
                      >
                        Semua
                      </button>
                      <button
                        @click="toggleStatusFilter('planned')"
                        :class="[
                          'px-3 py-2 text-sm rounded-md text-center transition-colors duration-200',
                          filters.state === 'planned' ? 'bg-yellow-100 text-yellow-700 font-medium ring-1 ring-yellow-300' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                        ]"
                      >
                        Direncanakan
                      </button>
                      <button
                        @click="toggleStatusFilter('done')"
                        :class="[
                          'px-3 py-2 text-sm rounded-md text-center transition-colors duration-200',
                          filters.state === 'done' ? 'bg-green-100 text-green-700 font-medium ring-1 ring-green-300' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                        ]"
                      >
                        Dilakukan
                      </button>
                      <button
                        @click="toggleStatusFilter('not_done')"
                        :class="[
                          'px-3 py-2 text-sm rounded-md text-center transition-colors duration-200',
                          filters.state === 'not_done' ? 'bg-red-100 text-red-700 font-medium ring-1 ring-red-300' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                        ]"
                      >
                        Tidak Dilakukan
                      </button>
                    </div>
                  </div>
                </div>
    
                <div class="mt-6 flex justify-between space-x-3">
                  <button
                    @click="resetFilters"
                    type="button"
                    class="inline-flex justify-center items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200"
                  >
                    <ArrowPathIcon class="h-4 w-4 mr-1.5" />
                    Reset
                  </button>
                  <div class="space-x-2">
                    <button
                      @click="showFilterModal = false"
                      type="button"
                      class="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200"
                    >
                      Batal
                    </button>
                    <button
                      @click="applyFilters"
                      type="button"
                      class="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200"
                    >
                      Terapkan
                    </button>
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
    
    <!-- Active Filter Pills (Optional - shows under header) -->
    <div v-if="activeFiltersCount > 0" class="bg-gray-50 px-4 py-2 sm:px-6 lg:px-8 flex flex-wrap items-center gap-2">
      <span class="text-xs text-gray-500">Filter aktif:</span>
      
      <div v-if="filters.date_from || filters.date_to" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        <span>{{ formatFilterDateRange() }}</span>
        <button @click="clearDateFilter" class="ml-1 text-blue-600 hover:text-blue-800">
          <XMarkIcon class="h-3 w-3" />
        </button>
      </div>
      
      <div v-if="filters.activity_type" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium" :class="getActivityTypeFilterClass()">
        <span>{{ getTranslatedActivityType(filters.activity_type) }}</span>
        <button @click="filters.activity_type = ''" class="ml-1 hover:text-gray-800">
          <XMarkIcon class="h-3 w-3" />
        </button>
      </div>
      
      <div v-if="filters.state" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium" :class="getStatusFilterClass()">
        <span>{{ getTranslatedState(filters.state) }}</span>
        <button @click="filters.state = ''" class="ml-1 hover:text-gray-800">
          <XMarkIcon class="h-3 w-3" />
        </button>
      </div>
      
      <button 
        @click="resetFilters" 
        class="ml-auto text-xs text-red-600 hover:text-red-800 transition-colors duration-200"
      >
        Hapus semua
      </button>
    </div>

    <!-- Main Content -->
    <main class="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Stats Cards -->
      <div v-if="!loading && activities.length > 0" class="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <ClipboardIcon class="h-6 w-6 text-red-500" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">
                    Total Aktivitas
                  </dt>
                  <dd class="text-2xl font-semibold text-gray-900">
                    {{ activities.length }}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <ClockIcon class="h-6 w-6 text-blue-500" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">
                    Total Jam
                  </dt>
                  <dd class="text-2xl font-semibold text-gray-900">
                    {{ totalHours }}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <CheckCircleIcon class="h-6 w-6 text-green-500" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">
                    Realisasi Aktivitas
                  </dt>
                  <dd class="text-2xl font-semibold text-gray-900">
                    {{ activities.filter(a => a.state === 'done').length }} / {{ activities.length }}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <ChartBarIcon class="h-6 w-6 text-purple-500" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">
                    Realisasi Target
                  </dt>
                  <dd class="text-2xl font-semibold text-gray-900">
                    {{ targetAchievementRate }}%
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Activities List -->
      <div v-if="!loading && activities.length > 0" class="bg-white shadow overflow-hidden sm:rounded-lg">
        <div class="px-4 py-5 sm:px-6 flex justify-between items-center border-b border-gray-200">
          <h2 class="text-lg font-medium text-gray-900">Daftar Aktivitas</h2>
          <div class="flex items-center">
            <span class="text-sm text-gray-500 mr-2">Urutkan:</span>
            <select 
              v-model="sortBy" 
              class="border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="date-desc">Tanggal (Terbaru)</option>
              <option value="date-asc">Tanggal (Terlama)</option>
              <option value="hours-desc">Jam (Tertinggi)</option>
              <option value="hours-asc">Jam (Terendah)</option>
              <option value="name-asc">Nama (A-Z)</option>
              <option value="name-desc">Nama (Z-A)</option>
              <option value="state-done">Status (Dilakukan Dulu)</option>
              <option value="state-pending">Status (Belum Dilakukan Dulu)</option>
            </select>
          </div>
        </div>
        <ul role="list" class="divide-y divide-gray-200">
          <li v-for="activity in sortedActivities" :key="activity.id" class="hover:bg-gray-50 relative">
            <!-- Menu for actions (edit/delete) -->
            <div class="absolute top-4 right-4">
              <Menu as="div" class="relative inline-block text-left">
                <div>
                  <MenuButton class="flex items-center text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 rounded-full">
                    <EllipsisVerticalIcon class="h-5 w-5" />
                  </MenuButton>
                </div>

                <transition
                  enter-active-class="transition ease-out duration-100"
                  enter-from-class="transform opacity-0 scale-95"
                  enter-to-class="transform opacity-100 scale-100"
                  leave-active-class="transition ease-in duration-75"
                  leave-from-class="transform opacity-100 scale-100"
                  leave-to-class="transform opacity-0 scale-95"
                >
                  <MenuItems class="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div class="py-1">
                      <MenuItem v-slot="{ active }">
                        <button
                          @click="editActivity(activity)"
                          :class="[
                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                            'w-full text-left px-4 py-2 text-sm flex items-center'
                          ]"
                        >
                          <PencilIcon class="mr-3 h-4 w-4 text-gray-400" />
                          Edit Aktivitas
                        </button>
                      </MenuItem>
                      <MenuItem v-slot="{ active }">
                        <button
                          @click="confirmDelete(activity)"
                          :class="[
                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                            'w-full text-left px-4 py-2 text-sm flex items-center'
                          ]"
                        >
                          <TrashIcon class="mr-3 h-4 w-4 text-red-400" />
                          Hapus Aktivitas
                        </button>
                      </MenuItem>
                    </div>
                  </MenuItems>
                </transition>
              </Menu>
            </div>

            <div class="px-4 py-4 sm:px-6">
              <div class="flex-1 min-w-0">
                <div class="flex items-center">
                  <p class="text-sm font-medium text-red-600 truncate mr-2">{{ activity.name }}</p>
                  <span 
                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                    :class="getActivityTypeColorClass(activity.activity_type)"
                  >
                    {{ getTranslatedActivityType(activity.activity_type) }}
                  </span>
                </div>
              
                <div class="mt-2 flex justify-between items-center">
                  <div class="sm:flex items-center">
                    <p class="flex items-center text-sm text-gray-500">
                      <UserIcon class="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                      {{ activity.creator?.name || 'Pengguna Tidak Diketahui' }}
                    </p>
                    <p class="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                      <ClockIcon class="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                      {{ activity.hours_spent }} jam
                    </p>
                  </div>
                  <div class="flex items-center space-x-2">
                    <p class="flex items-center text-sm text-gray-500">
                      <CalendarIcon class="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                      {{ formatDate(activity.date) }}
                    </p>
                    <span 
                      class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                      :class="getActivityStatusClass(activity.state)"
                    >
                      {{ activity.state === 'done' ? 'Dilakukan' : 
                         activity.state === 'not_done' ? 'Tidak Dilakukan' : 'Direncanakan' }}
                    </span>
                  </div>
                </div>
                <div v-if="activity.description" class="mt-2">
                  <p class="text-sm text-gray-500">{{ activity.description }}</p>
                </div>
                <div v-if="activity.impact_on_delivery" class="mt-1">
                  <p class="text-xs text-gray-500"><span class="font-medium">Dampak:</span> {{ activity.impact_on_delivery }}</p>
                </div>
                
                <!-- Tombol Verifikasi -->
                <div v-if="activity.state === 'planned' && !isPastDeadline(activity.date)" class="mt-2 flex space-x-2">
                  <button
                    @click="verifyActivity(activity, 'done')"
                    class="px-2 py-1 text-xs font-medium rounded bg-green-100 text-green-800 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <CheckIcon class="inline-block h-4 w-4 mr-1" />
                    Tandai Dilakukan
                  </button>
                  <button
                    @click="verifyActivity(activity, 'not_done')"
                    class="px-2 py-1 text-xs font-medium rounded bg-red-100 text-red-800 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <XMarkIcon class="inline-block h-4 w-4 mr-1" />
                    Tandai Tidak Dilakukan
                  </button>
                </div>
                
                <!-- Info Verifikasi -->
                <div v-if="activity.state !== 'planned' && activity.verified_by" class="mt-1 text-xs text-gray-500">
                  <span class="font-medium">Diverifikasi oleh:</span> {{ activity.verified_by.name }}
                  <span class="ml-2 font-medium">pada:</span> {{ formatDateTime(activity.verification_date) }}
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>


      <!-- Empty State -->
      <div 
        v-if="!loading && activities.length === 0" 
        class="text-center py-12 bg-white rounded-lg shadow"
        >
        <ClipboardIcon class="mx-auto h-12 w-12 text-gray-400" />
        <h3 class="mt-2 text-sm font-medium text-gray-900">Tidak ada aktivitas ditemukan</h3>
        <p class="mt-1 text-sm text-gray-500">
          {{ filters.date_from || filters.date_to || filters.activity_type || filters.state ? 
            'Coba ubah kriteria filter atau' : 'Mulai dengan' }} menambahkan aktivitas BAU baru.
        </p>
        <div class="mt-6">
          <button
            @click="showCreateModal = true"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
          >
            <PlusIcon class="h-4 w-4 mr-1.5" />
            Tambah Aktivitas
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div 
        v-if="loading" 
        class="flex justify-center items-center py-12 bg-white rounded-lg shadow"
        >
        <svg class="animate-spin h-8 w-8 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    </main>

    <!-- Create/Edit BAU Activity Modal -->
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
              <DialogPanel class="w-full max-w-xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
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
                        :min="todayDate"
                        :max="todayDate"
                        required
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
                      <p class="mt-1 text-xs text-gray-500">Opsional, untuk keperluan pencatatan</p>
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
                        <span class="ml-2">Dilakukan</span>
                      </label>
                      <label class="inline-flex items-center">
                        <input type="radio" v-model="formData.state" value="not_done" class="form-radio text-red-600 focus:ring-red-500" />
                        <span class="ml-2">Tidak Dilakukan</span>
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

    <!-- BAU Batch Modal Template -->
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
                      <label class="block text-sm font-medium text-gray-700">Tanggal Dilakukan <span class="text-red-500">*</span></label>
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
                      Hanya hari kerja (tidak termasuk Minggu)
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


    <!-- Delete Confirmation Modal -->
    <TransitionRoot appear :show="showDeleteModal" as="template">
      <Dialog as="div" @close="showDeleteModal = false" class="relative z-10">
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
                  Hapus Aktivitas
                </DialogTitle>

                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    Apakah Anda yakin ingin menghapus aktivitas "{{ activityToDelete?.name }}"? Tindakan ini tidak dapat dibatalkan.
                  </p>
                </div>

                <div class="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    class="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    @click="showDeleteModal = false"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    class="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    @click="deleteActivity"
                    :disabled="deleting"
                  >
                    <span v-if="deleting" class="inline-block animate-spin mr-2">⟳</span>
                    {{ deleting ? 'Menghapus...' : 'Hapus' }}
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useToast } from '@/composables/useToast'
import apiClient from '@/config/api'
import { useAuthStore } from '@/stores/auth'
import TeamSelect from '@/components/TeamSelect.vue'
import { 
  PlusIcon,
  ClipboardIcon,
  ArrowPathIcon,
  FunnelIcon,
  UserIcon,
  ClockIcon,
  CalendarIcon,
  CheckCircleIcon,
  ChartBarIcon,
  TrashIcon,
  PencilIcon,
  EllipsisVerticalIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems
} from '@headlessui/vue'
import Toast from '@/components/Toast.vue'

// Auth Store
const authStore = useAuthStore()

// State
const { toast, showToast } = useToast()
const loading = ref(false)
const submitting = ref(false)
const deleting = ref(false)
const activities = ref([])
const showCreateModal = ref(false)
const showDeleteModal = ref(false)
const showReasonDialog = ref(false)
const isEditing = ref(false)
const activityToDelete = ref(null)
const activityToVerify = ref(null)
const verificationReason = ref('')
const sortBy = ref('date-desc')

const showFilterModal = ref(false)

// State untuk tracking filter status
const isCurrentMonthActive = ref(false)
const isPreviousMonthActive = ref(false)
const isTodayActive = ref(false)

// Computed untuk menghitung jumlah filter aktif
const activeFiltersCount = computed(() => {
  let count = 0
  if (filters.value.date_from || filters.value.date_to) count++
  if (filters.value.activity_type) count++
  if (filters.value.state) count++
  return count
})

// Method untuk filter tanggal
const filterToday = () => {
  const today = new Date()
  filters.value.date_from = formatDateYYYYMMDD(today)
  filters.value.date_to = formatDateYYYYMMDD(today)
  isTodayActive.value = true
  isCurrentMonthActive.value = false
  isPreviousMonthActive.value = false
  fetchActivities()
}

const filterCurrentMonth = () => {
  const today = new Date()
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)
  
  filters.value.date_from = formatDateYYYYMMDD(startOfMonth)
  filters.value.date_to = formatDateYYYYMMDD(endOfMonth)
  isCurrentMonthActive.value = true
  isPreviousMonthActive.value = false
  isTodayActive.value = false
  fetchActivities()
}

const filterPreviousMonth = () => {
  const today = new Date()
  const startOfPrevMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1)
  const endOfPrevMonth = new Date(today.getFullYear(), today.getMonth(), 0)
  
  filters.value.date_from = formatDateYYYYMMDD(startOfPrevMonth)
  filters.value.date_to = formatDateYYYYMMDD(endOfPrevMonth)
  isPreviousMonthActive.value = true
  isCurrentMonthActive.value = false
  isTodayActive.value = false
  fetchActivities()
}

// Methods untuk toggling filter
const toggleActivityTypeFilter = (type) => {
  filters.value.activity_type = filters.value.activity_type === type ? '' : type
}

const toggleStatusFilter = (status) => {
  filters.value.state = filters.value.state === status ? '' : status
}

// Method untuk reset dan apply
const resetFilters = () => {
  filters.value = {
    date_from: '',
    date_to: '',
    activity_type: '',
    state: '',
    creator_id: '' // Jika diperlukan
  }
  isCurrentMonthActive.value = false
  isPreviousMonthActive.value = false
  isTodayActive.value = false
  
  // Optional: close modal after reset
  showFilterModal.value = false
  
  fetchActivities()
}

const applyFilters = () => {
  // Update active period buttons if date ranges match
  checkActivePeriods()
  
  showFilterModal.value = false
  fetchActivities()
}

// Method untuk cek apakah periodenya aktif
const checkActivePeriods = () => {
  isCurrentMonthActive.value = false
  isPreviousMonthActive.value = false
  isTodayActive.value = false
  
  if (!filters.value.date_from || !filters.value.date_to) return
  
  // Check if today
  const today = formatDateYYYYMMDD(new Date())
  if (filters.value.date_from === today && filters.value.date_to === today) {
    isTodayActive.value = true
    return
  }
  
  // Check if current month
  const currentDate = new Date()
  const startOfMonth = formatDateYYYYMMDD(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1))
  const endOfMonth = formatDateYYYYMMDD(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0))
  
  if (filters.value.date_from === startOfMonth && filters.value.date_to === endOfMonth) {
    isCurrentMonthActive.value = true
    return
  }
  
  // Check if previous month
  const startOfPrevMonth = formatDateYYYYMMDD(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  const endOfPrevMonth = formatDateYYYYMMDD(new Date(currentDate.getFullYear(), currentDate.getMonth(), 0))
  
  if (filters.value.date_from === startOfPrevMonth && filters.value.date_to === endOfPrevMonth) {
    isPreviousMonthActive.value = true
  }
}

// Methods untuk clear individual filters
const clearDateFilter = () => {
  filters.value.date_from = ''
  filters.value.date_to = ''
  isCurrentMonthActive.value = false
  isPreviousMonthActive.value = false
  isTodayActive.value = false
}

// Helper methods untuk UI
const formatFilterDateRange = () => {
  if (filters.value.date_from && filters.value.date_to) {
    if (filters.value.date_from === filters.value.date_to) {
      return `Tanggal: ${formatDate(filters.value.date_from)}`
    }
    return `Periode: ${formatDate(filters.value.date_from)} - ${formatDate(filters.value.date_to)}`
  }
  if (filters.value.date_from) return `Dari: ${formatDate(filters.value.date_from)}`
  if (filters.value.date_to) return `Sampai: ${formatDate(filters.value.date_to)}`
  return ''
}

const getActivityTypeFilterClass = () => {
  switch(filters.value.activity_type) {
    case 'design': return 'bg-purple-100 text-purple-800'
    case 'video': return 'bg-red-100 text-red-800'
    case 'other': return 'bg-gray-200 text-gray-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getStatusFilterClass = () => {
  switch(filters.value.state) {
    case 'done': return 'bg-green-100 text-green-800'
    case 'not_done': return 'bg-red-100 text-red-800'
    case 'planned': return 'bg-yellow-100 text-yellow-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getTranslatedState = (state) => {
  switch(state) {
    case 'done': return 'Dilakukan'
    case 'not_done': return 'Tidak Dilakukan'
    case 'planned': return 'Direncanakan'
    default: return 'Semua Status'
  }
}


// Filters state
const filters = ref({
  date_from: '',
  date_to: '',
  activity_type: '',
  state: '',
  creator_id: ''
})

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

const todayDate = computed(() => {
  return formatDateYYYYMMDD(new Date())
})

// Computed properties
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

const totalHours = computed(() => {
  return activities.value.reduce((sum, activity) => sum + parseFloat(activity.hours_spent || 0), 0).toFixed(1)
})

const targetAchievementRate = computed(() => {
  const doneCount = activities.value.filter(a => a.state === 'done').length
  return activities.value.length > 0 
    ? Math.round((doneCount / activities.value.length) * 100) 
    : 0
})

const sortedActivities = computed(() => {
  if (!activities.value.length) return []
  
  const sortedList = [...activities.value]
  
  switch (sortBy.value) {
    // Tambahkan opsi sortir berdasarkan state
    case 'state-done':
      return sortedList.sort((a, b) => {
        if (a.state === 'done' && b.state !== 'done') return -1
        if (a.state !== 'done' && b.state === 'done') return 1
        return 0
      })
    case 'state-pending':
      return sortedList.sort((a, b) => {
        if (a.state !== 'done' && b.state === 'done') return -1
        if (a.state === 'done' && b.state !== 'done') return 1
        return 0
      })
    // Opsi sortir lainnya tetap dipertahankan
    case 'date-desc':
      return sortedList.sort((a, b) => new Date(b.date) - new Date(a.date))
    case 'date-asc':
      return sortedList.sort((a, b) => new Date(a.date) - new Date(b.date))
    case 'hours-desc':
      return sortedList.sort((a, b) => parseFloat(b.hours_spent) - parseFloat(a.hours_spent))
    case 'hours-asc':
      return sortedList.sort((a, b) => parseFloat(a.hours_spent) - parseFloat(b.hours_spent))
    case 'name-asc':
      return sortedList.sort((a, b) => a.name.localeCompare(b.name))
    case 'name-desc':
      return sortedList.sort((a, b) => b.name.localeCompare(a.name))
    default:
      return sortedList
  }
})

// Methods for activity data fetching and filtering
const fetchActivities = async () => {
  try {
    loading.value = true
    
    const queryParams = {
      jsonrpc: '2.0',
      method: 'call',
      params: {
        operation: 'get',
        ...(filters.value.date_from ? { date_from: filters.value.date_from } : {}),
        ...(filters.value.date_to ? { date_to: filters.value.date_to } : {}),
        ...(filters.value.activity_type ? { activity_type: filters.value.activity_type } : {}),
        ...(filters.value.creator_id ? { creator_id: filters.value.creator_id } : {})
      }
    }
    
    const response = await apiClient.post('/web/v2/content/bau', queryParams)

    if (response.data.result?.status === 'success') {
      activities.value = response.data.result.data || []
    } else {
      showToast({
        message: response.data.result?.message || 'Gagal memuat aktivitas',
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


// Methods for activity CRUD operations
const closeModal = () => {
  showCreateModal.value = false
  isEditing.value = false
  formData.value = {
    id: null,
    name: '',
    activity_type: '',
    date: todayDate.value, // Selalu menggunakan tanggal hari ini
    hours_spent: '',
    description: '',
    impact_on_delivery: '',
    creator_id: authStore.user?.uid || 1,
    state: 'planned',
    verification_reason: ''
  }
}

const editActivity = (activity) => {
  isEditing.value = true
  formData.value = {
    id: activity.id,
    name: activity.name,
    activity_type: activity.activity_type,
    date: activity.date,
    hours_spent: activity.hours_spent,
    description: activity.description || '',
    impact_on_delivery: activity.impact_on_delivery || '',
    creator_id: activity.creator?.id || authStore.user?.uid || 1,
    state: activity.state || 'planned',
    verification_reason: ''
  }
  showCreateModal.value = true
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
    
    // Add bau_id for updates if needed
    if (isEditing.value && !params.bau_id) {
      params.bau_id = params.id
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
    
    console.log('Sending params:', params)
    
    const response = await apiClient.post('/web/v2/content/bau', {
      jsonrpc: '2.0',
      method: "call",
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
        message: response.data.result?.message || `Gagal ${isEditing.value ? 'memperbarui' : 'membuat'} aktivitas`,
        type: 'error',
        duration: 5000
      })
    }
  } catch (error) {
    console.error(`Error ${isEditing.value ? 'updating' : 'creating'} activity:`, error)
    showToast({
      message: error.message || `Gagal ${isEditing.value ? 'memperbarui' : 'membuat'} aktivitas`,
      type: 'error',
      duration: 5000
    })
  } finally {
    submitting.value = false
  }
}

const confirmDelete = (activity) => {
  activityToDelete.value = activity
  showDeleteModal.value = true
}

const deleteActivity = async () => {
  if (!activityToDelete.value) return
  
  try {
    deleting.value = true
    
    const response = await apiClient.post('/web/v2/content/bau', {
      jsonrpc: '2.0',
      id: new Date().getTime(),
      params: {
        operation: 'delete',
        bau_id: activityToDelete.value.id
      }
    })

    if (response.data.result?.status === 'success') {
      showToast({
        message: 'Aktivitas berhasil dihapus',
        type: 'success'
      })
      showDeleteModal.value = false
      activityToDelete.value = null
      fetchActivities()
    } else {
      showToast({
        message: response.data.result?.message || 'Gagal menghapus aktivitas',
        type: 'error',
        duration: 5000
      })
    }
  } catch (error) {
    console.error('Error deleting activity:', error)
    showToast({
      message: error.message || 'Gagal menghapus aktivitas',
      type: 'error',
      duration: 5000
    })
  } finally {
    deleting.value = false
  }
}

// Methods for verification
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
        message: `Status aktivitas berhasil diubah menjadi ${newState === 'done' ? 'Dilakukan' : 'Tidak Dilakukan'}`,
        type: 'success'
      })
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

// Helper methods
const formatDate = (dateString) => {
  const date = new Date(dateString);
  
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  
  // Menggunakan formatter dengan locale 'id-ID' untuk format Indonesia
  // Jika browser tidak mendukung, akan menggunakan 'en-US' sebagai fallback
  let formattedDate;
  try {
    formattedDate = date.toLocaleDateString('id-ID', options);
  } catch (e) {
    // Fallback to English format if Indonesia locale not supported
    formattedDate = date.toLocaleDateString('en-US', options);
    
    // Manual mapping of month names to Indonesian
    const months = {
      'January': 'Januari',
      'February': 'Februari',
      'March': 'Maret',
      'April': 'April',
      'May': 'Mei',
      'June': 'Juni',
      'July': 'Juli',
      'August': 'Agustus',
      'September': 'September',
      'October': 'Oktober',
      'November': 'November',
      'December': 'Desember'
    };
    
    // Replace English month with Indonesian month
    for (const [enMonth, idMonth] of Object.entries(months)) {
      formattedDate = formattedDate.replace(enMonth, idMonth);
    }
  }
  
  return formattedDate;
}

const formatDateTime = (dateTimeString) => {
  if (!dateTimeString) return '-'
  
  const dateTime = new Date(dateTimeString)
  
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }
  
  // Menggunakan formatter dengan locale 'id-ID' untuk format Indonesia
  // atau fallback ke 'en-US'
  let formattedDateTime
  try {
    formattedDateTime = dateTime.toLocaleDateString('id-ID', options)
  } catch (e) {
    formattedDateTime = dateTime.toLocaleDateString('en-US', options)
    
    // Mapping bulan
    const months = {
      'January': 'Januari',
      'February': 'Februari',
      'March': 'Maret',
      'April': 'April',
      'May': 'Mei',
      'June': 'Juni',
      'July': 'Juli',
      'August': 'Agustus',
      'September': 'September',
      'October': 'Oktober',
      'November': 'November',
      'December': 'Desember'
    }
    
    // Ganti bulan Inggris ke Indonesia
    for (const [enMonth, idMonth] of Object.entries(months)) {
      formattedDateTime = formattedDateTime.replace(enMonth, idMonth)
    }
  }
  
  return formattedDateTime
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

const getActivityStatusClass = (state) => {
  switch(state) {
    case 'done':
      return 'bg-green-100 text-green-800'
    case 'not_done':
      return 'bg-red-100 text-red-800'
    default: // planned atau state lainnya
      return 'bg-yellow-100 text-yellow-800'
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

// Initialize with default date range (30 days)
const initializeDefaultDates = () => {
  const today = new Date()
  
  // Mengatur tanggal awal ke tanggal 1 bulan ini
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
  
  // Mengatur tanggal akhir ke tanggal terakhir bulan ini
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)
  
  filters.value.date_from = formatDateYYYYMMDD(startOfMonth)
  filters.value.date_to = formatDateYYYYMMDD(endOfMonth)
  
  // Set today's date as default for new activities
  formData.value.date = formatDateYYYYMMDD(today)
}


const showBatchModal = ref(false)
const submittingBatch = ref(false)
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

// Methods untuk BAU Batch
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

const handleBatchSubmit = async () => {
  try {
    // Validasi tanggal
    if (new Date(batchFormData.value.date_from) > new Date(batchFormData.value.date_to)) {
      showToast({
        message: 'Tanggal mulai harus sebelum tanggal Dilakukan',
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

// Inisialisasi default value untuk form batch
const initBatchForm = () => {
  const today = new Date()
  const nextWeek = new Date(today)
  nextWeek.setDate(today.getDate() + 7)
  
  batchFormData.value.date_from = formatDateYYYYMMDD(today)
  batchFormData.value.date_to = formatDateYYYYMMDD(nextWeek)
}



onMounted(() => {
  initializeDefaultDates()
  fetchActivities()
  initBatchForm()
})
</script>