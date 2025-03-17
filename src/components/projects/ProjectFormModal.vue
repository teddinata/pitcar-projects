<!-- src/components/projects/ProjectFormModal.vue -->
<template>
  <Modal :show="show" @close="$emit('close')">
    <div class="sm:flex sm:items-start">
      <div class="w-full">
        <!-- Modal Header -->
        <div class="mb-6">
          <h3 class="text-lg font-medium text-gray-900">
            {{ project ? 'Edit Project' : 'Create New Project' }}
          </h3>
          <p class="mt-1 text-sm text-gray-500">
            Fill in the information below to {{ project ? 'update' : 'create' }} your project
          </p>
        </div>

        <!-- Project Form -->
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Project Name -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Project Name *
            </label>
            <input
              v-model="formData.name"
              type="text"
              required
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Enter project name"
            />
          </div>

          <!-- Dates -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Start Date *
              </label>
              <input
                v-model="formData.date_start"
                type="date"
                required
                class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                End Date *
              </label>
              <input
                v-model="formData.date_end"
                type="date"
                required
                class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          <!-- Content Planning -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Planned Videos
              </label>
              <input
                v-model="formData.planned_video_count"
                type="number"
                min="0"
                class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Planned Designs
              </label>
              <input
                v-model="formData.planned_design_count"
                type="number"
                min="0"
                class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          <!-- Team Selection -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Project Manager
            </label>
            <TeamSelect
              v-model="formData.project_manager_id"
              :disabled="loading"
              :multiple="false"
            />
          </div>

          <!-- Team Selection -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Team Members
            </label>
            <TeamSelect
              v-model="formData.team_ids"
              :disabled="loading"
              :multiple="true"
            />
          </div>

          <!-- Description -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              v-model="formData.description"
              rows="3"
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Enter project description"
            ></textarea>
          </div>

          <!-- Form Actions -->
          <div class="flex justify-end space-x-3">
            <button
              type="button"
              @click="$emit('close')"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="loading"
              class="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
            >
              <Loader2 
                v-if="loading"
                class="w-4 h-4 mr-2 animate-spin"
              />
              {{ project ? 'Update Project' : 'Create Project' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Modal>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Loader2 } from 'lucide-vue-next'
import Modal from '@/components/projects/ProjectModal.vue'
import TeamSelect from '@/components/TeamSelect.vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const props = defineProps({
  show: Boolean,
  project: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'submit'])
const loading = ref(false)

const formData = ref({
  name: '',
  date_start: '',
  date_end: '',
  planned_video_count: 0,
  planned_design_count: 0,
  description: '',
  team_ids: [],
  project_manager_id: ''
})

const handleSubmit = () => {
  emit('submit', formData.value)
}

// Initialize form if editing
onMounted(() => {
  if (props.project) {
    formData.value = {
      ...formData.value,
      name: props.project.name,
      date_start: props.project.dates.start,
      date_end: props.project.dates.end,
      planned_video_count: props.project.content_plan.video_count,
      planned_design_count: props.project.content_plan.design_count,
      description: props.project.description,
      team_ids: props.project.team.members.map(m => m.id)
    }
  }
})
</script>