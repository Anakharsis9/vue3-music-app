<script setup lang="ts">
import type { Song } from '@/components/types';
import { commentsCollection, songsCollection } from '@/includes/firebase';
import { getDoc, doc, getDocs, query, where, updateDoc } from 'firebase/firestore';
import { computed, ref, watch, type Ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { Comment } from '@/components/Comment/CommentForm.vue';

import CommentForm from '@/components/Comment/CommentForm.vue';
import CommentItem from '@/components/Comment/CommentItem.vue';
import useUserStore from '@/stores/user';
import usePlayerStore from '@/stores/player';

const userStore = useUserStore();

const router = useRouter();
const route = useRoute();
const songId = route.params.id as string;

const song: Ref<Song | null> = ref(null);

async function loadSong() {
  const snapshot = await getDoc(doc(songsCollection, songId));

  if (!snapshot.exists()) {
    router.push({ name: 'home' });
    return;
  }

  song.value = { ...snapshot.data(), id: snapshot.id } as Song;
}
loadSong();

const comments: Ref<Comment[]> = ref([]);
async function loadComments() {
  const commentsQuery = query(commentsCollection, where('song_id', '==', songId));
  const snapshot = await getDocs(commentsQuery);
  comments.value = snapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  })) as Comment[];
}
loadComments();

async function addComment() {
  if (!song.value) {
    return;
  }
  song.value.comment_count += 1;
  await updateDoc(doc(songsCollection, songId), {
    comment_count: song.value.comment_count,
  });
  loadComments();
}

const sortBy = ref(route.query.sortBy ? route.query.sortBy : 'latest');
const sortedComments = computed(() => {
  return comments.value.slice().sort((a, b) => {
    const aDate = new Date(a.date_posted).getTime();
    const bDate = new Date(b.date_posted).getTime();

    if (sortBy.value === 'latest') {
      return bDate - aDate;
    }
    return aDate - bDate;
  });
});
watch(
  sortBy,
  (newVal) => {
    if (newVal === route.query.sortBy) {
      return;
    }
    router.replace({
      ...route,
      query: {
        sortBy: newVal,
      },
    });
  },
  { immediate: true }
);

const player = usePlayerStore();
function newSong() {
  if (song.value) {
    player.newSong(song.value);
  }
}
</script>

<template>
  <main>
    <!-- Music Header -->
    <section class="w-full mb-8 py-14 text-center text-white relative">
      <div
        class="absolute inset-0 w-full h-full box-border bg-contain music-bg"
        style="background-image: url(/assets/img/song-header.png)"
      ></div>
      <div class="container mx-auto flex items-center">
        <!-- Play/Pause Button -->
        <button
          type="button"
          class="z-50 h-24 w-24 text-3xl bg-white text-black rounded-full focus:outline-none"
          @click.prevent="newSong"
        >
          <i
            class="fas"
            :class="{
              'fa-play': !player.isPlaying,
              'fa-pause': player.isPlaying,
            }"
          ></i>
        </button>
        <div class="z-50 text-left ml-8">
          <!-- Song Info -->
          <div class="text-3xl font-bold">{{ song?.modified_name }}</div>
          <div>{{ song?.genre }}</div>
        </div>
      </div>
    </section>
    <section id="comments" class="container mx-auto mt-6">
      <div class="bg-white rounded border border-gray-200 relative flex flex-col">
        <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
          <!-- Comment Count -->
          <span class="card-title">Comments ({{ song?.comment_count }})</span>
          <i class="fa fa-comments float-right text-green-400 text-2xl"></i>
        </div>
        <div class="p-6">
          <!-- Form -->
          <comment-form v-if="userStore.userLoggedIn" @addComment="addComment" />
          <!-- Sort Comments -->
          <select
            class="block mt-4 py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            v-model="sortBy"
          >
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>
      </div>
    </section>
    <!-- Comments -->
    <ul class="container mx-auto">
      <comment-item v-for="comment in sortedComments" :key="comment.id" :comment="comment" />
    </ul>
  </main>
</template>

<style scoped></style>
