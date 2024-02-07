<script setup lang="ts">
import type { UploadFile } from './UploadSongs.vue';

defineProps<{
  upload: UploadFile;
}>();
</script>

<template>
  <div class="mb-4">
    <!-- File Name -->
    <div class="font-bold text-sm" :class="upload.text_class">
      <i :class="upload.icon"></i>
      {{ upload.name }}
    </div>
    <div class="flex h-4 overflow-hidden bg-gray-200 rounded">
      <!-- Inner Progress Bar -->
      <div
        class="transition-all progress-bar bg-blue-400"
        :class="upload.variant"
        :style="{
          width: `${upload.progress}%`,
        }"
      ></div>
    </div>
    <div v-if="upload.errorMessage" class="text-red-600 text-xs">
      {{ upload.errorMessage }}
    </div>
  </div>
</template>

<style scoped></style>
