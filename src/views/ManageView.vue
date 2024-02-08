<script setup lang="ts">
import UploadSongs from '@/components/Upload/UploadSongs.vue';
import UserSongItem, { type SongFormValues } from '@/components/UserSongItem.vue';
import type { Song } from '@/components/types';
import { songsCollection, auth } from '@/includes/firebase';
import { query, where, orderBy, getDocs } from 'firebase/firestore';
import { ref, type Ref } from 'vue';

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

function updateSong(i: number, values: SongFormValues) {
  const song = userSongs.value[i];
  song.modified_name = values.title;
  song.genre = values.genre ?? '';
}
function removeSong(i: number) {
  userSongs.value.splice(i, 1);
}
</script>

<template>
  <section class="container mx-auto mt-6">
    <div class="md:grid md:grid-cols-3 md:gap-4">
      <div class="col-span-1">
        <upload-songs :userSongs="userSongs" @songAdded="loadUserSongs" />
      </div>
      <div class="col-span-2">
        <div class="bg-white rounded border border-gray-200 relative flex flex-col">
          <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
            <span class="card-title">My Songs</span>
            <i class="fa fa-compact-disc float-right text-green-400 text-2xl"></i>
          </div>
          <div class="p-6">
            <div v-if="userSongs.length === 0" class="text-center text-gray-500">List empty</div>
            <template v-else>
              <user-song-item
                v-for="(song, i) in userSongs"
                :key="song.id"
                :song="song"
                @updateSong="updateSong(i, $event)"
                @removeSong="removeSong(i)"
              />
            </template>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
