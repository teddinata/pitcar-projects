<!-- src/components/team/TeamTaskChecklistManager.vue -->
<template>
  <div class="mt-4 space-y-4">
    <div class="flex justify-between items-center">
      <h3 class="text-lg font-medium text-gray-900">Checklist Items</h3>
      <button
        @click="addNewItem"
        class="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600"
      >
        <PlusIcon class="h-4 w-4 mr-1.5" />
        Add Item
      </button>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center py-4">
      <svg class="animate-spin h-5 w-5 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>

    <!-- Empty state -->
    <div v-else-if="items.length === 0" class="py-4 text-center text-gray-500">
      No checklist items added yet
    </div>

    <!-- Checklist items -->
    <div v-else class="border rounded-md overflow-hidden">
      <ul class="divide-y divide-gray-200">
        <li v-for="(item, index) in items" :key="item.id || index" class="p-4 hover:bg-gray-50">
          <div class="flex items-start justify-between">
            <div class="flex items-center flex-1">
              <input
                :id="`checklist-item-${item.id || index}`"
                type="checkbox"
                v-model="item.is_done"
                @change="updateItem(item)"
                class="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
              />
              <div class="ml-3 flex-1">
                <div class="text-sm font-medium text-gray-900" :class="{ 'line-through': item.is_done }">
                  {{ item.name }}
                </div>
                <div v-if="item.assigned_to" class="text-xs text-gray-500">
                  Assigned to: {{ getEmployeeName(item.assigned_to) }}
                </div>
                <div v-if="item.deadline" class="text-xs text-gray-500">
                  Deadline: {{ formatDate(item.deadline) }}
                </div>
              </div>
            </div>
            <div class="ml-4 flex-shrink-0 flex">
              <button
                @click="editItem(item)"
                class="mr-2 text-sm text-gray-500 hover:text-gray-700"
              >
                <PencilIcon class="h-4 w-4" />
              </button>
              <button
                @click="deleteItem(item)"
                class="text-sm text-red-500 hover:text-red-700"
              >
                <TrashIcon class="h-4 w-4" />
              </button>
            </div>
          </div>
        </li>
      </ul>
    </div>

    <!-- Item Form Modal -->
    <DialogModal
      :show="showItemModal"
      @close="closeItemModal"
      :title="isEditing ? 'Edit Checklist Item' : 'Add Checklist Item'"
    >
      <div class="space-y-4">
        <div>
          <label for="item-name" class="block text-sm font-medium text-gray-700">Item Name <span class="text-red-500">*</span></label>
          <input
            id="item-name"
            v-model="currentItem.name"
            type="text"
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
            placeholder="Enter item description"
            required
          />
        </div>

        <div>
          <label for="item-assigned" class="block text-sm font-medium text-gray-700">Assigned To</label>
          <select
            id="item-assigned"
            v-model="currentItem.assigned_to"
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
          >
            <option value="">Not assigned</option>
            <option v-for="employee in employeeOptions" :key="employee.id" :value="employee.id">
              {{ employee.name }}
            </option>
          </select>
        </div>

        <div>
          <label for="item-deadline" class="block text-sm font-medium text-gray-700">Deadline</label>
          <input
            id="item-deadline"
            v-model="currentItem.deadline"
            type="date"
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
          />
        </div>

        <div>
          <label for="item-notes" class="block text-sm font-medium text-gray-700">Notes</label>
          <textarea
            id="item-notes"
            v-model="currentItem.notes"
            rows="3"
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
            placeholder="Additional notes"
          ></textarea>
        </div>

        <div class="flex items-center">
          <input
            id="item-is-done"
            v-model="currentItem.is_done"
            type="checkbox"
            class="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
          />
          <label for="item-is-done" class="ml-2 block text-sm text-gray-900">
            Mark as done
          </label>
        </div>
      </div>

      <div class="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
        <button
          type="button"
          class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:col-start-2 sm:text-sm"
          @click="submitItem"
        >
          {{ isEditing ? 'Update' : 'Add' }}
        </button>
        <button
          type="button"
          class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:mt-0 sm:col-start-1 sm:text-sm"
          @click="closeItemModal"
        >
          Cancel
        </button>
      </div>
    </DialogModal>

    <!-- Delete Confirmation Modal -->
    <DialogModal
      :show="showDeleteConfirm"
      @close="showDeleteConfirm = false"
      title="Delete Checklist Item"
    >
      <div class="sm:flex sm:items-start">
        <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
          <ExclamationTriangleIcon class="h-6 w-6 text-red-600" />
        </div>
        <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
          <h3 class="text-lg leading-6 font-medium text-gray-900">Delete Item</h3>
          <div class="mt-2">
            <p class="text-sm text-gray-500">
              Are you sure you want to delete this item? This action cannot be undone.
            </p>
          </div>
        </div>
      </div>
      <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
        <button
          type="button"
          class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
          @click="confirmDelete"
        >
          Delete
        </button>
        <button
          type="button"
          class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:mt-0 sm:w-auto sm:text-sm"
          @click="showDeleteConfirm = false"
        >
          Cancel
        </button>
      </div>
    </DialogModal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useToast } from '@/composables/useToast';
import apiClient from '@/config/api';
import { PlusIcon, PencilIcon, TrashIcon, ExclamationTriangleIcon } from '@heroicons/vue/24/outline';
import DialogModal from '@/components/modal/DialogModal.vue';

const props = defineProps({
  taskId: {
    type: [Number, String],
    required: true
  },
  employees: {
    type: Array,
    default: () => []
  }
});

const { toast, showToast } = useToast();
const items = ref([]);
const loading = ref(false);
const showItemModal = ref(false);
const showDeleteConfirm = ref(false);
const isEditing = ref(false);
const itemToDelete = ref(null);
const currentItem = ref({
  name: '',
  assigned_to: '',
  deadline: '',
  notes: '',
  is_done: false
});

// Computed properties
const employeeOptions = computed(() => {
  return props.employees.map(employee => ({
    id: employee.id,
    name: employee.name
  }));
});

// Methods
const fetchChecklistItems = async () => {
  if (!props.taskId) return;
  
  try {
    loading.value = true;
    
    const response = await apiClient.post('/web/v2/team/task/checklists', {
      jsonrpc: '2.0',
      id: new Date().getTime(),
      params: {
        operation: 'get',
        task_id: props.taskId
      }
    });

    if (response.data.result?.status === 'success') {
      items.value = response.data.result.data || [];
    } else {
      throw new Error(response.data.result?.message || 'Failed to fetch checklist items');
    }
  } catch (error) {
    console.error('Error fetching checklist items:', error);
    showToast({
      message: 'Failed to load checklist items',
      type: 'error'
    });
  } finally {
    loading.value = false;
  }
};

const addNewItem = () => {
  currentItem.value = {
    name: '',
    assigned_to: '',
    deadline: '',
    notes: '',
    is_done: false
  };
  isEditing.value = false;
  showItemModal.value = true;
};

const editItem = (item) => {
  currentItem.value = { ...item };
  isEditing.value = true;
  showItemModal.value = true;
};

const closeItemModal = () => {
  showItemModal.value = false;
};

const submitItem = async () => {
  try {
    if (!currentItem.value.name.trim()) {
      showToast({
        message: 'Item description is required',
        type: 'error'
      });
      return;
    }

    const operation = isEditing.value ? 'update' : 'create';
    const params = {
      operation,
      name: currentItem.value.name.trim(),
      task_id: props.taskId,
      is_done: currentItem.value.is_done
    };

    if (currentItem.value.assigned_to) {
      params.assigned_to = currentItem.value.assigned_to;
    }

    if (currentItem.value.deadline) {
      params.deadline = currentItem.value.deadline;
    }

    if (currentItem.value.notes) {
      params.notes = currentItem.value.notes.trim();
    }

    if (isEditing.value && currentItem.value.id) {
      params.checklist_id = currentItem.value.id;
    }

    const response = await apiClient.post('/web/v2/team/task/checklists', {
      jsonrpc: '2.0',
      id: new Date().getTime(),
      params
    });

    if (response.data.result?.status === 'success') {
      showToast({
        message: isEditing.value ? 'Item updated successfully' : 'Item added successfully',
        type: 'success'
      });
      
      closeItemModal();
      fetchChecklistItems();
    } else {
      throw new Error(response.data.result?.message || 'Failed to save checklist item');
    }
  } catch (error) {
    console.error('Error saving checklist item:', error);
    showToast({
      message: error.message || 'Failed to save checklist item',
      type: 'error'
    });
  }
};

const updateItem = async (item) => {
  try {
    const response = await apiClient.post('/web/v2/team/task/checklists', {
      jsonrpc: '2.0',
      id: new Date().getTime(),
      params: {
        operation: 'update',
        checklist_id: item.id,
        is_done: item.is_done
      }
    });

    if (response.data.result?.status === 'success') {
      showToast({
        message: item.is_done ? 'Item marked as done' : 'Item marked as not done',
        type: 'success'
      });
      
      // Update the local item with the response data to ensure consistency
      const updatedItemIndex = items.value.findIndex(i => i.id === item.id);
      if (updatedItemIndex !== -1) {
        items.value[updatedItemIndex] = response.data.result.data;
      }
    } else {
      throw new Error(response.data.result?.message || 'Failed to update item status');
    }
  } catch (error) {
    console.error('Error updating checklist item:', error);
    showToast({
      message: error.message || 'Failed to update item status',
      type: 'error'
    });
    
    // Revert the change in the UI if the API call fails
    item.is_done = !item.is_done;
  }
};

const deleteItem = (item) => {
  itemToDelete.value = item;
  showDeleteConfirm.value = true;
};

const confirmDelete = async () => {
  try {
    if (!itemToDelete.value?.id) return;
    
    const response = await apiClient.post('/web/v2/team/task/checklists', {
      jsonrpc: '2.0',
      id: new Date().getTime(),
      params: {
        operation: 'delete',
        checklist_id: itemToDelete.value.id
      }
    });

    if (response.data.result?.status === 'success') {
      showToast({
        message: 'Item deleted successfully',
        type: 'success'
      });
      
      // Remove the item from the list
      items.value = items.value.filter(item => item.id !== itemToDelete.value.id);
      showDeleteConfirm.value = false;
      itemToDelete.value = null;
    } else {
      throw new Error(response.data.result?.message || 'Failed to delete checklist item');
    }
  } catch (error) {
    console.error('Error deleting checklist item:', error);
    showToast({
      message: error.message || 'Failed to delete checklist item',
      type: 'error'
    });
  }
};

const getEmployeeName = (employeeId) => {
  const employee = props.employees.find(emp => emp.id === employeeId);
  return employee ? employee.name : 'Unknown';
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

// Watch for changes in taskId
watch(() => props.taskId, (newTaskId) => {
  if (newTaskId) {
    fetchChecklistItems();
  } else {
    items.value = [];
  }
}, { immediate: true });

onMounted(() => {
  if (props.taskId) {
    fetchChecklistItems();
  }
});
</script>