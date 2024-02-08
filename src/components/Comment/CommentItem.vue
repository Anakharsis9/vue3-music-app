<script setup lang="ts">
import type { Comment } from '@/components/Comment/CommentForm.vue';

const props = defineProps<{
  comment: Comment;
}>();
</script>

<template>
  <li class="p-6 bg-gray-50 border border-gray-200">
    <!-- Comment Author -->
    <div class="mb-5">
      <div class="font-bold">{{ comment.author.name }}</div>
      <time>{{ comment.date_posted }}</time>
    </div>

    <p>
      {{ comment.content }}
    </p>
  </li>
</template>

<style scoped></style>
