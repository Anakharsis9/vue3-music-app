<script setup lang="ts">
import { ref } from 'vue';
import type { Song } from './types';
// import { useForm } from 'vee-validate';

const props = defineProps<{
  song: Song;
}>();

const isEditing = ref(false);
const songDraft = ref(props.song);

function deleteSong() {}
function updateSong() {}
</script>

<template>
  <div class="border border-gray-200 p-3 mb-4 rounded">
    <div>
      <h4 class="inline-block text-2xl font-bold">{{ song.modified_name }}</h4>
      <button
        class="ml-1 py-1 px-2 text-sm rounded text-white bg-red-600 float-right"
        @click.prevent="deleteSong"
      >
        <i class="fas fa-trash"></i>
      </button>
      <button
        class="ml-1 py-1 px-2 text-sm rounded text-white bg-blue-600 float-right"
        @click.prevent="isEditing = true"
      >
        <i class="fa fa-pencil-alt"></i>
      </button>
    </div>
    <div v-if="isEditing">
      <form @submit="updateSong">
        <div class="mb-3 mt-4">
          <label class="inline-block mb-2">Song Title</label>
          <input
            type="text"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Enter Song Title"
            v-model="songDraft.modified_name"
          />
        </div>
        <div class="mb-3">
          <label class="inline-block mb-2">Genre</label>
          <input
            type="text"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Enter Genre"
            v-model="songDraft.genre"
          />
        </div>
        <button type="submit" class="py-1.5 px-3 rounded text-white bg-green-600 mr-4">
          Submit
        </button>
        <button type="button" class="py-1.5 px-3 rounded text-white bg-gray-600">Go Back</button>
      </form>
    </div>
  </div>
</template>

<style scoped></style>
