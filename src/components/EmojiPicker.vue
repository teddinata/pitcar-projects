<!-- // src/components/EmojiPicker.vue -->
<template>
  <div class="p-2 max-h-64 w-64 overflow-y-auto custom-scrollbar">
    <div class="flex flex-wrap">
      <div class="mb-2 w-full">
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Search emoji..."
          class="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      
      <div class="mb-2 w-full">
        <div class="flex overflow-x-auto py-1 space-x-2 mb-2 custom-scrollbar">
          <button 
            v-for="category in categories" 
            :key="category.name"
            @click="activeCategory = category.name"
            class="flex-shrink-0 text-lg p-1.5 rounded-full hover:bg-gray-100"
            :class="{ 'bg-indigo-100 text-indigo-700': activeCategory === category.name }"
            :title="category.name"
          >
            {{ category.icon }}
          </button>
        </div>
      </div>

      <div v-if="searchQuery" class="w-full">
        <div class="flex flex-wrap">
          <button
            v-for="emoji in filteredEmojis"
            :key="emoji.emoji"
            @click="selectEmoji(emoji.emoji)"
            class="p-1.5 text-lg hover:bg-gray-100 rounded"
            :title="emoji.description"
          >
            {{ emoji.emoji }}
          </button>
        </div>
      </div>
      
      <div v-else class="w-full">
        <div v-if="currentCategoryEmojis.length" class="flex flex-wrap">
          <button
            v-for="emoji in currentCategoryEmojis"
            :key="emoji.emoji"
            @click="selectEmoji(emoji.emoji)"
            class="p-1.5 text-lg hover:bg-gray-100 rounded"
            :title="emoji.description"
          >
            {{ emoji.emoji }}
          </button>
        </div>
        <div v-else class="text-center p-4 text-gray-500 text-sm">
          No emojis found in this category
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// Emit event when emoji is selected
const emit = defineEmits(['select'])

// Emoji data (commonly used subset)
const emojis = [
  // Smileys & Emotion
  { emoji: '😀', description: 'Grinning Face', category: 'smileys' },
  { emoji: '😃', description: 'Grinning Face with Big Eyes', category: 'smileys' },
  { emoji: '😄', description: 'Grinning Face with Smiling Eyes', category: 'smileys' },
  { emoji: '😁', description: 'Beaming Face with Smiling Eyes', category: 'smileys' },
  { emoji: '😆', description: 'Grinning Squinting Face', category: 'smileys' },
  { emoji: '😅', description: 'Grinning Face with Sweat', category: 'smileys' },
  { emoji: '🤣', description: 'Rolling on the Floor Laughing', category: 'smileys' },
  { emoji: '😂', description: 'Face with Tears of Joy', category: 'smileys' },
  { emoji: '🙂', description: 'Slightly Smiling Face', category: 'smileys' },
  { emoji: '🙃', description: 'Upside-Down Face', category: 'smileys' },
  { emoji: '😉', description: 'Winking Face', category: 'smileys' },
  { emoji: '😊', description: 'Smiling Face with Smiling Eyes', category: 'smileys' },
  { emoji: '😇', description: 'Smiling Face with Halo', category: 'smileys' },
  { emoji: '🥰', description: 'Smiling Face with Hearts', category: 'smileys' },
  { emoji: '😍', description: 'Smiling Face with Heart-Eyes', category: 'smileys' },
  { emoji: '😘', description: 'Face Blowing a Kiss', category: 'smileys' },
  { emoji: '😗', description: 'Kissing Face', category: 'smileys' },
  { emoji: '☺️', description: 'Smiling Face', category: 'smileys' },
  { emoji: '😚', description: 'Kissing Face with Closed Eyes', category: 'smileys' },
  { emoji: '😙', description: 'Kissing Face with Smiling Eyes', category: 'smileys' },
  { emoji: '🥲', description: 'Smiling Face with Tear', category: 'smileys' },
  { emoji: '😋', description: 'Face Savoring Food', category: 'smileys' },
  { emoji: '😛', description: 'Face with Tongue', category: 'smileys' },
  { emoji: '😜', description: 'Winking Face with Tongue', category: 'smileys' },
  { emoji: '😝', description: 'Squinting Face with Tongue', category: 'smileys' },
  { emoji: '🤑', description: 'Money-Mouth Face', category: 'smileys' },
  
  // People
  { emoji: '👋', description: 'Waving Hand', category: 'people' },
  { emoji: '🤚', description: 'Raised Back of Hand', category: 'people' },
  { emoji: '✋', description: 'Raised Hand', category: 'people' },
  { emoji: '🖐️', description: 'Hand with Fingers Splayed', category: 'people' },
  { emoji: '👌', description: 'OK Hand', category: 'people' },
  { emoji: '🤌', description: 'Pinched Fingers', category: 'people' },
  { emoji: '👍', description: 'Thumbs Up', category: 'people' },
  { emoji: '👎', description: 'Thumbs Down', category: 'people' },
  { emoji: '👏', description: 'Clapping Hands', category: 'people' },
  { emoji: '🙌', description: 'Raising Hands', category: 'people' },
  { emoji: '🤝', description: 'Handshake', category: 'people' },
  { emoji: '🙏', description: 'Folded Hands', category: 'people' },
  
  // Animals & Nature
  { emoji: '🐶', description: 'Dog Face', category: 'animals' },
  { emoji: '🐱', description: 'Cat Face', category: 'animals' },
  { emoji: '🐭', description: 'Mouse Face', category: 'animals' },
  { emoji: '🐹', description: 'Hamster Face', category: 'animals' },
  { emoji: '🐰', description: 'Rabbit Face', category: 'animals' },
  { emoji: '🦊', description: 'Fox Face', category: 'animals' },
  { emoji: '🐻', description: 'Bear Face', category: 'animals' },
  { emoji: '🐼', description: 'Panda Face', category: 'animals' },
  { emoji: '🦁', description: 'Lion Face', category: 'animals' },
  { emoji: '🐮', description: 'Cow Face', category: 'animals' },
  { emoji: '🐷', description: 'Pig Face', category: 'animals' },
  
  // Food & Drink
  { emoji: '🍎', description: 'Red Apple', category: 'food' },
  { emoji: '🍐', description: 'Pear', category: 'food' },
  { emoji: '🍊', description: 'Tangerine', category: 'food' },
  { emoji: '🍋', description: 'Lemon', category: 'food' },
  { emoji: '🍌', description: 'Banana', category: 'food' },
  { emoji: '🍉', description: 'Watermelon', category: 'food' },
  { emoji: '🍇', description: 'Grapes', category: 'food' },
  { emoji: '🍓', description: 'Strawberry', category: 'food' },
  { emoji: '🍈', description: 'Melon', category: 'food' },
  { emoji: '🍒', description: 'Cherries', category: 'food' },
  { emoji: '🍑', description: 'Peach', category: 'food' },
  { emoji: '🥭', description: 'Mango', category: 'food' },
  
  // Travel & Places
  { emoji: '🚗', description: 'Automobile', category: 'travel' },
  { emoji: '🚕', description: 'Taxi', category: 'travel' },
  { emoji: '🚙', description: 'Sport Utility Vehicle', category: 'travel' },
  { emoji: '🚌', description: 'Bus', category: 'travel' },
  { emoji: '🚎', description: 'Trolleybus', category: 'travel' },
  { emoji: '🏎️', description: 'Racing Car', category: 'travel' },
  { emoji: '🚓', description: 'Police Car', category: 'travel' },
  { emoji: '🚑', description: 'Ambulance', category: 'travel' },
  { emoji: '🚒', description: 'Fire Engine', category: 'travel' },
  
  // Activities
  { emoji: '⚽', description: 'Soccer Ball', category: 'activities' },
  { emoji: '🏀', description: 'Basketball', category: 'activities' },
  { emoji: '🏈', description: 'American Football', category: 'activities' },
  { emoji: '⚾', description: 'Baseball', category: 'activities' },
  { emoji: '🎾', description: 'Tennis', category: 'activities' },
  { emoji: '🏐', description: 'Volleyball', category: 'activities' },
  { emoji: '🏉', description: 'Rugby Football', category: 'activities' },
  
  // Objects
  { emoji: '⌚', description: 'Watch', category: 'objects' },
  { emoji: '📱', description: 'Mobile Phone', category: 'objects' },
  { emoji: '💻', description: 'Laptop', category: 'objects' },
  { emoji: '⌨️', description: 'Keyboard', category: 'objects' },
  { emoji: '🖥️', description: 'Desktop Computer', category: 'objects' },
  { emoji: '🖨️', description: 'Printer', category: 'objects' },
  { emoji: '🖱️', description: 'Computer Mouse', category: 'objects' },
  { emoji: '🧮', description: 'Abacus', category: 'objects' },
  { emoji: '🎥', description: 'Movie Camera', category: 'objects' },
  
  // Symbols
  { emoji: '❤️', description: 'Red Heart', category: 'symbols' },
  { emoji: '🧡', description: 'Orange Heart', category: 'symbols' },
  { emoji: '💛', description: 'Yellow Heart', category: 'symbols' },
  { emoji: '💚', description: 'Green Heart', category: 'symbols' },
  { emoji: '💙', description: 'Blue Heart', category: 'symbols' },
  { emoji: '💜', description: 'Purple Heart', category: 'symbols' },
  { emoji: '🖤', description: 'Black Heart', category: 'symbols' },
  { emoji: '🤍', description: 'White Heart', category: 'symbols' },
  { emoji: '🤎', description: 'Brown Heart', category: 'symbols' },
  { emoji: '💔', description: 'Broken Heart', category: 'symbols' },
  
  // Flags (just a few common ones)
  { emoji: '🏳️', description: 'White Flag', category: 'flags' },
  { emoji: '🏴', description: 'Black Flag', category: 'flags' },
  { emoji: '🏁', description: 'Chequered Flag', category: 'flags' },
  { emoji: '🚩', description: 'Triangular Flag', category: 'flags' },
]

// Define categories with icons
const categories = [
  { name: 'smileys', icon: '😀' },
  { name: 'people', icon: '👋' },
  { name: 'animals', icon: '🐶' },
  { name: 'food', icon: '🍎' },
  { name: 'travel', icon: '🚗' },
  { name: 'activities', icon: '⚽' },
  { name: 'objects', icon: '💻' },
  { name: 'symbols', icon: '❤️' },
  { name: 'flags', icon: '🏁' }
]

// State
const searchQuery = ref('')
const activeCategory = ref('smileys')

// Computed properties
const filteredEmojis = computed(() => {
  if (!searchQuery.value) return []
  
  const query = searchQuery.value.toLowerCase()
  return emojis.filter(emoji => 
    emoji.description.toLowerCase().includes(query) || 
    emoji.emoji.includes(query)
  )
})

const currentCategoryEmojis = computed(() => {
  return emojis.filter(emoji => emoji.category === activeCategory.value)
})

// Methods
const selectEmoji = (emoji) => {
  emit('select', emoji)
}

// Set default category on mount
onMounted(() => {
  activeCategory.value = 'smileys'
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
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
</style>