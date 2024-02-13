<script setup lang="ts">
import type { Song } from '@/components/types';
import { songsCollection } from '@/includes/firebase';
import { onMounted, ref, type Ref } from 'vue';
import SongItem from '@/components/SongItem.vue';
import { getDoc, limit, query, doc, getDocs, startAfter, orderBy } from 'firebase/firestore';

const songs: Ref<Song[]> = ref([]);
const isDone = ref(false);
let pendingRequest = false;

async function loadSongs() {
  if (pendingRequest || isDone.value) {
    return;
  }
  pendingRequest = true;

  let snapshot;
  const maxSongs = 5;
  if (songs.value.length) {
    const lastDocSnap = await getDoc(doc(songsCollection, songs.value[songs.value.length - 1].id));
    const nextPageSongsQuery = query(
      songsCollection,
      orderBy('modified_name'),
      startAfter(lastDocSnap),
      limit(maxSongs)
    );
    snapshot = await getDocs(nextPageSongsQuery);
  } else {
    const firstPageSongsQuery = query(songsCollection, orderBy('modified_name'), limit(maxSongs));
    snapshot = await getDocs(firstPageSongsQuery);
  }
  if (snapshot.docs.length === 0) {
    isDone.value = true;
  }
  songs.value = songs.value.concat(
    snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    })) as Song[]
  );

  pendingRequest = false;
}

loadSongs();

const observer = new IntersectionObserver((entries) => {
  if (entries[0].intersectionRatio <= 0) return;
  loadSongs();
});
const loading: Ref<Element | null> = ref(null);

onMounted(() => {
  if (loading.value) {
    observer.observe(loading.value);
  }
});
</script>

<template>
  <main>
    <!-- Introduction -->
    <section class="mb-8 py-20 text-white text-center relative">
      <div
        class="absolute inset-0 w-full h-full bg-contain introduction-bg"
        style="background-image: url(assets/img/header.png)"
      ></div>
      <div class="container mx-auto">
        <div class="text-white main-header-content">
          <h1 class="font-bold text-5xl mb-5">Listen to Great Music!</h1>
          <p class="w-full md:w-8/12 mx-auto">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus et dolor mollis,
            congue augue non, venenatis elit. Nunc justo eros, suscipit ac aliquet imperdiet,
            venenatis et sapien. Duis sed magna pulvinar, fringilla lorem eget, ullamcorper urna.
          </p>
        </div>
      </div>

      <img
        class="relative block mx-auto mt-5 -mb-20 w-auto max-w-full"
        src="/assets/img/introduction-music.png"
      />
    </section>

    <!-- Main Content -->
    <section class="container mx-auto">
      <div class="bg-white rounded border border-gray-200 relative flex flex-col">
        <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
          <span class="card-title">Songs</span>
          <!-- Icon -->
          <i class="fa fa-headphones-alt float-right text-green-400 text-xl"></i>
        </div>
        <!-- Playlist -->
        <ol id="playlist">
          <song-item v-for="song in songs" :key="song.id" :song="song" />
        </ol>
        <!-- .. end Playlist -->
      </div>
      <div
        v-if="!isDone"
        ref="loading"
        class="text-center text-2xl mt-2 h-12 flex items-center justify-center"
      >
        <i class="fas fa-spinner fa-spin"></i>
      </div>
    </section>
  </main>
</template>
