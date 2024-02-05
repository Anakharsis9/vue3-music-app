<script setup lang="ts">
import UploadSongs from '@/components/Upload/UploadSongs.vue';
import SongItem from '@/components/SongItem.vue';
import type { Song } from '@/components/types';
import { getDocs, songsCollection, query, where, auth, orderBy } from '@/includes/firebase';
import { ref, type Ref } from 'vue';
// import { doc } from 'firebase/firestore';

const userSongsQuery = query(
  songsCollection,
  where('uid', '==', auth.currentUser?.uid),
  orderBy('modified_name')
);

const userSongs: Ref<Song[]> = ref([]);

async function loadUserSongs(): Promise<void> {
  const userSongsSnapshot = await getDocs(userSongsQuery);
  userSongs.value = userSongsSnapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  })) as Song[];
}
loadUserSongs();
</script>

<template>
  <section class="container mx-auto mt-6">
    <div class="md:grid md:grid-cols-3 md:gap-4">
      <div class="col-span-1">
        <upload-songs />
      </div>
      <div class="col-span-2">
        <div class="bg-white rounded border border-gray-200 relative flex flex-col">
          <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
            <span class="card-title">My Songs</span>
            <i class="fa fa-compact-disc float-right text-green-400 text-2xl"></i>
          </div>
          <div class="p-6">
            <!-- Composition Items -->
            <song-item v-for="song in userSongs" :key="song.id" :song="song" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
