<!-- src/components/team/TeamTaskDetailManager.vue -->
<template>
  <div class="space-y-8">
    <!-- Task Details Section -->
    <div class="bg-white shadow overflow-hidden sm:rounded-lg">
      <div class="px-4 py-5 sm:px-6 flex justify-between items-center">
        <div>
          <h3 class="text-lg leading-6 font-medium text-gray-900">
            Task Details
          </h3>
          <p class="mt-1 max-w-2xl text-sm text-gray-500">{{ task.name }}</p>
        </div>
        <div class="flex space-x-2">
          <span 
            class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
            :class="getStatusClass(task.state)"
          >
            {{ formatStatus(task.state) }}
          </span>
          <button
            @click="editTask"
            class="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <PencilIcon class="h-3 w-3 mr-1" />
            Edit
          </button>
        </div>
      </div>
      <div class="border-t border-gray-200">
        <dl>
          <div class="bg-gray-50 px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">Project</dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {{ task.project ? task.project.name : 'N/A' }}
            </dd>
          </div>
          <div class="bg-white px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">Assigned To</dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              <div class="flex flex-wrap gap-2">
                <span 
                  v-for="person in task.assigned_to" 
                  :key="person.id"
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"
                >
                  {{ person.name }}
                </span>
              </div>
            </dd>
          </div>
          <div class="bg-gray-50 px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">Dates</dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="text-xs text-gray-500">Planned Start</p>
                  <p>{{ formatDate(task.dates?.planned_start) || 'Not set' }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Planned End</p>
                  <p>{{ formatDate(task.dates?.planned_end) || 'Not set' }}</p>
                </div>
              </div>
            </dd>
          </div>
          <div class="bg-white px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">Hours</dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="text-xs text-gray-500">Planned</p>
                  <p>{{ task.hours?.planned || '0' }} hours</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Actual</p>
                  <p>{{ task.hours?.actual || '0' }} hours</p>
                </div>
              </div>
            </dd>
          </div>
          <div class="bg-gray-50 px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">Progress</dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              <div class="flex items-center">
                <div class="w-full bg-gray-200 rounded-full h-2 mr-2">
                  <div class="bg-red-600 h-2 rounded-full" :style="{ width: `${task.progress || 0}%` }"></div>
                </div>
                <span class="text-sm text-gray-500">{{ task.progress || 0 }}%</span>
              </div>
            </dd>
          </div>
          <div class="bg-white px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">Description</dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {{ task.description || 'No description provided' }}
            </dd>
          </div>
        </dl>
      </div>
    </div>
    
    <!-- Tabs for Checklist and Timesheets -->
    <div>
      <div class="sm:hidden">
        <label for="tabs" class="sr-only">Select a tab</label>
        <select
          id="tabs"
          name="tabs"
          v-model="currentTab"
          class="block w-full focus:ring-red-500 focus:border-red-500 border-gray-300 rounded-md"
        >
          <option value="checklist">Checklist</option>
          <option value="timesheets">Timesheets</option>
        </select>
      </div>
      <div class="hidden sm:block">
        <div class="border-b border-gray-200">
          <nav class="flex -mb-px" aria-label="Tabs">
            <button
              @click="currentTab = 'checklist'"
              :class="[
                currentTab === 'checklist'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                'w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm'
              ]"
            >
              Checklist
            </button>
            <button
              @click="currentTab = 'timesheets'"
              :class="[
                currentTab === 'timesheets'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                'w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm'
              ]"
            >
              Timesheets
            </button>
          </nav>
        </div>
      </div>
    </div>

    <!-- Tab Content -->
    <div>
      <div v-if="currentTab === 'checklist'">
        <TeamTaskChecklistManager 
          :taskId="taskId" 
          :employees="getTaskAssignees()"
          @update:progress="updateTaskProgress"
        />
      </div>
      <div v-if="currentTab === 'timesheets'">
        <TeamTaskTimesheetManager 
          :taskId="taskId" 
          :employees="getTaskAssignees()"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { useToast } from '@/composables/useToast';
import apiClient from '@/config/api';
import { PencilIcon } from '@heroicons/vue/24/outline';
import TeamTaskChecklistManager from '@/components/team/TeamTaskChecklistManager.vue';
import TeamTaskTimesheetManager from '@/components/team/TeamTaskTimesheetManager.vue';

const props = defineProps({
  taskId: {
    type: [Number, String],
    required: true
  }
});

const emit = defineEmits(['update:task', 'edit:task']);

const { toast, showToast } = useToast();
const task = ref({});
const loading = ref(false);
const currentTab = ref('checklist');

// Methods
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
    } else {
      showToast('Error fetching task details: ' + 
        (response.data.result?.message || 'Unknown error'), 'error');
    }
  } catch (error) {
    console.error('Error fetching task details:', error);
    showToast('Failed to load task details. Please try again.', 'error');
  } finally {
    loading.value = false;
  }
};

const formatDate = (dateString) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

const formatStatus = (status) => {
  const statusMap = {
    'draft': 'Draft',
    'planned': 'Planned',
    'in_progress': 'In Progress',
    'review': 'In Review',
    'revision': 'Revision',
    'completed': 'Completed',
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
    'revision': 'bg-indigo-100 text-indigo-800',
    'completed': 'bg-green-100 text-green-800',
    'cancelled': 'bg-red-100 text-red-800'
  };
  return classMap[status] || 'bg-gray-100 text-gray-800';
};

const editTask = () => {
  emit('edit:task', task.value);
};

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
    } else {
      console.error('Error updating task progress:', response.data.result?.message);
    }
  } catch (error) {
    console.error('Error updating task progress:', error);
  }
};

// Helper to get assignees for the checklist component
const getTaskAssignees = () => {
  if (!task.value || !task.value.assigned_to) return [];
  return task.value.assigned_to.map(person => ({
    id: person.id,
    name: person.name
  }));
};

// Lifecycle hooks
onMounted(() => {
  fetchTaskDetails();
});

// Watch for changes in taskId
watch(() => props.taskId, (newTaskId) => {
  if (newTaskId) {
    fetchTaskDetails();
  }
});
</script>