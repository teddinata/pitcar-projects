<!-- RevisionDialog.vue -->
<template>
  <Modal :show="show" @close="handleClose" maxWidth="max-w-lg">
    <div class="p-6">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Request Revision</h3>
      
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Feedback *</label>
          <textarea
            v-model="formData.feedback"
            rows="3"
            class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="What needs to be revised?"
            required
          ></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Revision Points</label>
          <textarea
            v-model="formData.revision_points"
            rows="3"
            class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="List specific points that need revision..."
          ></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Deadline</label>
          <input
            v-model="formData.deadline"
            type="datetime-local"
            class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
      </div>

      <div class="mt-6 flex justify-end space-x-3">
        <button
          @click="handleClose" 
          class="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          @click="handleSubmit"
          class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
          :disabled="!formData.feedback"
        >
          Submit Revision
        </button>
      </div>
    </div>
  </Modal>
</template>

<script setup>
import { ref } from 'vue'
import Modal from '@/components/projects/ProjectModal.vue'
import { format } from 'date-fns'

const props = defineProps({
  show: Boolean,
  taskId: [Number, String]
})

const emit = defineEmits(['close', 'submit'])

const handleClose = () => {
  emit('close', { closed: true })
}

const formData = ref({
  feedback: '',
  revision_points: '',
  deadline: ''
})

const handleSubmit = () => {
  // Format the deadline to match backend expected format
  const formattedData = {
    task_id: props.taskId,
    feedback: formData.value.feedback,
    revision_points: formData.value.revision_points,
    deadline: formData.value.deadline ? format(new Date(formData.value.deadline), 'yyyy-MM-dd HH:mm') : null
  }
  
  emit('submit', formattedData)
}
</script>