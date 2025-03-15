<template>
  <div class="mention-editor">
    <div class="editor-container" ref="editorContainer"></div>
    <div class="editor-actions">
      <button @click="$emit('submit')" :disabled="!editorContent.trim()">
        <Send class="h-4 w-4" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, watch } from 'vue';
import { Editor } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import Mention from '@tiptap/extension-mention';
import { Send } from 'lucide-vue-next';

const props = defineProps({
  modelValue: String,
  members: Array,
  placeholder: String
});

const emit = defineEmits(['update:modelValue', 'submit']);
const editorContainer = ref(null);
const editor = ref(null);
const editorContent = ref('');

onMounted(() => {
  editor.value = new Editor({
    element: editorContainer.value,
    extensions: [
      StarterKit,
      Mention.configure({
        suggestion: {
          items: ({ query }) => {
            return props.members
              .filter(member => 
                member.name.toLowerCase().startsWith(query.toLowerCase()))
              .slice(0, 5);
          },
          render: () => {
            // Implementasi dropdown suggestion untuk mention
            // ...
          }
        }
      })
    ],
    content: props.modelValue,
    onUpdate: ({ editor }) => {
      editorContent.value = editor.getHTML();
      emit('update:modelValue', editorContent.value);
    }
  });
});

onBeforeUnmount(() => {
  if (editor.value) {
    editor.value.destroy();
  }
});

watch(() => props.modelValue, (newValue) => {
  if (editor.value && newValue !== editorContent.value) {
    editor.value.commands.setContent(newValue);
  }
});
</script>

<style scoped>
.mention-editor {
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
}
.editor-container {
  min-height: 100px;
  padding: 0.5rem;
}
.editor-actions {
  display: flex;
  justify-content: flex-end;
  padding: 0.5rem;
  border-top: 1px solid #e2e8f0;
}
</style>