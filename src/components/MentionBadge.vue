<!-- components/MentionBadge.vue -->
<template>
  <div class="mention-badge" v-if="mentionStore.hasUnread">
    <span class="count">{{ mentionStore.unreadCount }}</span>
    <span class="label">Mention</span>
  </div>
</template>

<script setup>
import { useMentionStore } from '@/stores/mention'

const mentionStore = useMentionStore()

// Initialize on component mount
mentionStore.initialize()
</script>

<style scoped>
.mention-badge {
  display: inline-flex;
  align-items: center;
  background-color: #ff5252;
  color: white;
  border-radius: 12px;
  padding: 4px 8px;
  font-size: 12px;
  font-weight: bold;
}

.count {
  margin-right: 4px;
}
</style>