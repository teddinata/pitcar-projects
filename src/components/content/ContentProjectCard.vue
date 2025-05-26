<!-- src/components/content/ContentProjectCard.vue -->
<template>
  <div
    class="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 cursor-pointer"
    @click="$emit('click', project.id)"
  >
    <!-- Header -->
    <div class="p-4 border-b border-gray-100">
      <div class="flex items-start justify-between">
        <div class="flex-1 min-w-0">
          <h3 class="text-lg font-semibold text-gray-900 truncate">
            {{ project.name }}
          </h3>
          <div
            v-if="project.description"
            v-html="sanitizeHtml(project.description)"
            class="mt-1 text-sm text-gray-600 line-clamp-2"
          ></div>
        </div>
        <div class="ml-4 flex-shrink-0">
          <span
            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
            :class="getStatusBadgeClass(project.state)"
          >
            {{ formatStatus(project.state) }}
          </span>
        </div>
      </div>
    </div>

    <!-- Project Stats -->
    <div class="p-4">
      <!-- Progress Bar -->
      <div class="mb-4">
        <div class="flex items-center justify-between mb-1">
          <span class="text-sm font-medium text-gray-700">Progress</span>
          <span class="text-sm text-gray-600"
            >{{ Math.round(project.progress || 0) }}%</span
          >
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div
            class="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-300"
            :style="{ width: `${project.progress || 0}%` }"
          ></div>
        </div>
      </div>

      <!-- Content Statistics -->
      <div class="grid grid-cols-2 gap-4 mb-4">
        <!-- Video Content -->
        <div class="text-center p-3 bg-purple-50 rounded-lg">
          <div class="text-2xl font-bold text-purple-600">
            {{ getVideoCount() }}
          </div>
          <div class="text-xs text-purple-600 font-medium">
            Video {{ getVideoPlanned() > 0 ? `/ ${getVideoPlanned()}` : "" }}
          </div>
        </div>

        <!-- Design Content -->
        <div class="text-center p-3 bg-blue-50 rounded-lg">
          <div class="text-2xl font-bold text-blue-600">
            {{ getDesignCount() }}
          </div>
          <div class="text-xs text-blue-600 font-medium">
            Design {{ getDesignPlanned() > 0 ? `/ ${getDesignPlanned()}` : "" }}
          </div>
        </div>
      </div>

      <!-- Task Summary -->
      <div class="flex items-center justify-between text-sm text-gray-600 mb-3">
        <span>Tasks: {{ getCompletedTasks() }}/{{ getTotalTasks() }}</span>
        <span v-if="project.project_manager_name" class="text-xs">
          PM: {{ project.project_manager_name }}
        </span>
      </div>

      <!-- Dates -->
      <div class="flex items-center justify-between text-xs text-gray-500">
        <div v-if="project.date_start" class="flex items-center">
          <CalendarIcon class="h-3 w-3 mr-1" />
          <span>{{ formatDate(project.date_start) }}</span>
        </div>
        <div v-if="project.date_end" class="flex items-center">
          <span>to {{ formatDate(project.date_end) }}</span>
        </div>
      </div>
    </div>

    <!-- Footer Actions -->
    <div
      class="px-4 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between"
    >
      <!-- Status Change Dropdown -->
      <select
        :value="project.state"
        @change="handleStatusChange"
        @click.stop
        class="text-xs border-gray-300 rounded focus:ring-red-500 focus:border-red-500"
      >
        <option value="draft">Draft</option>
        <option value="planning">Planning</option>
        <option value="in_progress">In Progress</option>
        <option value="review">Review</option>
        <option value="completed">Completed</option>
        <option value="on_hold">On Hold</option>
        <option value="cancelled">Cancelled</option>
      </select>

      <!-- View Details Button -->
      <button
        @click.stop="$emit('click', project.id)"
        class="text-xs text-red-600 hover:text-red-700 font-medium"
      >
        View Details →
      </button>
    </div>
  </div>
</template>

<script setup>
import { CalendarIcon } from "@heroicons/vue/24/outline";
import { format, parseISO } from "date-fns";

const props = defineProps({
  project: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["click", "status-change"]);

// HTML sanitization function
const sanitizeHtml = (html) => {
  if (!html) return "";

  // Basic HTML sanitization - remove script tags and dangerous attributes
  const temp = document.createElement("div");
  temp.innerHTML = html;

  // Remove script tags
  const scripts = temp.querySelectorAll("script");
  scripts.forEach((script) => script.remove());

  // Remove dangerous attributes
  const allElements = temp.querySelectorAll("*");
  allElements.forEach((el) => {
    const dangerousAttrs = [
      "onclick",
      "onload",
      "onerror",
      "onmouseover",
      "onfocus",
      "onblur",
    ];
    dangerousAttrs.forEach((attr) => {
      if (el.hasAttribute(attr)) {
        el.removeAttribute(attr);
      }
    });
  });

  return temp.innerHTML;
};

// Helper methods with safe fallbacks
const getVideoCount = () => {
  return props.project.video_count || props.project.actual_video_count || 0;
};

const getDesignCount = () => {
  return props.project.design_count || props.project.actual_design_count || 0;
};

const getVideoPlanned = () => {
  return props.project.planned_video_count || 0;
};

const getDesignPlanned = () => {
  return props.project.planned_design_count || 0;
};

const getTotalTasks = () => {
  return props.project.total_count || props.project.task_count || 0;
};

const getCompletedTasks = () => {
  return (
    props.project.completed_count || props.project.completed_task_count || 0
  );
};

const formatStatus = (status) => {
  if (!status) return "Draft";

  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const getStatusBadgeClass = (status) => {
  const classes = {
    draft: "bg-gray-100 text-gray-800",
    planning: "bg-blue-100 text-blue-800",
    in_progress: "bg-green-100 text-green-800",
    review: "bg-purple-100 text-purple-800",
    completed: "bg-indigo-100 text-indigo-800",
    on_hold: "bg-yellow-100 text-yellow-800",
    cancelled: "bg-red-100 text-red-800",
  };

  return classes[status] || classes["draft"];
};

const formatDate = (dateString) => {
  if (!dateString) return "";

  try {
    const date =
      typeof dateString === "string" ? parseISO(dateString) : dateString;
    return format(date, "MMM d, yyyy");
  } catch (e) {
    return dateString;
  }
};

const handleStatusChange = (event) => {
  const newStatus = event.target.value;
  emit("status-change", props.project.id, newStatus);
};
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
