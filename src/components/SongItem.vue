<script setup lang="ts">
import { computed } from 'vue';
import type { Song } from './types';
import usePlayerStore from '@/stores/player';

const props = defineProps<{
  song: Song;
}>();

const player = usePlayerStore();
const isCurrentSong = computed(() => player.current_song?.id === props.song.id);

function newSong() {
  if (player.isPlaying && isCurrentSong) {
    player.toggleAudio();
    return;
  }
  if (props.song) {
    player.newSong(props.song);
  }
}
</script>

<template>
  <router-link :to="{ name: 'song', params: { id: song.id } }">
    <li
      class="flex justify-between items-center p-3 pl-6 cursor-pointer transition duration-300 hover:bg-gray-50"
    >
      <div class="flex justify-between items-center">
        <button type="button" class="mr-4" @click.prevent="newSong">
          <i
            class="fa text-gray-500 text-xl"
            :class="{
              'fa-play': !player.isPlaying || !isCurrentSong,
              'fa-pause': player.isPlaying && isCurrentSong,
            }"
          >
          </i>
        </button>
        <div class="flex flex-col">
          <span class="font-bold block text-gray-600">{{ song.modified_name }}</span>
          <span class="text-gray-500 text-sm">
            {{ song.display_name }}
          </span>
        </div>
      </div>

      <div class="text-gray-600 text-lg">
        <router-link
          custom
          :to="{ name: 'song', params: { id: song.id }, hash: '#comments' }"
          #default="{ navigate }"
        >
          <span class="comments" @click="navigate">
            <i class="fa fa-comments text-gray-600"></i>
            {{ song.comment_count }}
          </span>
        </router-link>
      </div>
    </li>
  </router-link>
</template>

<style scoped></style>
