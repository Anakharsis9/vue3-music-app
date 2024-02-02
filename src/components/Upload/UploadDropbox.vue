<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits<{
  upload: [files: File[]];
}>();

const is_dragover = ref(false);

function upload({ dataTransfer }: DragEvent) {
  is_dragover.value = false;
  if (!dataTransfer) {
    return;
  }
  const files = [...dataTransfer.files];
  emit('upload', files);
}
</script>
<template>
  <div
    class="w-full px-10 py-20 rounded text-center cursor-pointer border border-dashed border-gray-400 text-gray-400 transition duration-500 hover:text-white hover:bg-green-400 hover:border-green-400 hover:border-solid"
    :class="{ 'bg-green-400 border-green-400 border-solid': is_dragover }"
    @drag.prevent.stop=""
    @dragstart.prevent.stop=""
    @dragend.prevent.stop="is_dragover = false"
    @dragover.prevent.stop="is_dragover = true"
    @dragenter.prevent.stop="is_dragover = true"
    @dragleave.prevent.stop="is_dragover = false"
    @drop.prevent.stop="upload($event)"
  >
    <h5>Drop your files here</h5>
  </div>
</template>

<style scoped></style>
