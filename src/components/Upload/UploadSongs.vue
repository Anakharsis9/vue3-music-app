<script setup lang="ts">
import { onBeforeUnmount, ref, type Ref } from 'vue';
import {
  storageRef,
  ref as fref,
  uploadBytesResumable,
  auth,
  getDownloadURL,
  songsCollection,
  addDoc,
} from '@/includes/firebase';
import type { UploadTask } from 'firebase/storage';
import type { Song } from '@/components/types';
import { getFileHash } from '@/utils/fileHash';

import UploadDropbox from './UploadDropbox.vue';
import ProgressBar from './ProgressBar.vue';

export type UploadFile = {
  task?: UploadTask;
  name: string;
  progress: number;
  variant?: string;
  icon?: string;
  text_class?: string;
  errorMessage?: string;
};

const emit = defineEmits<{
  songAdded: [];
}>();

const props = defineProps<{
  userSongs: Song[];
}>();

const uploadingSongs: Ref<UploadFile[]> = ref([]);

function upload(files: File[]) {
  files.forEach(async (file) => {
    if (file.type !== 'audio/mpeg') {
      return;
    }

    const fileHash = await getFileHash(file);

    const isExists = props.userSongs.find((song) => song.hash === fileHash);

    if (isExists) {
      uploadingSongs.value.push({
        name: file.name,
        progress: 100,
        variant: 'bg-red-400',
        icon: 'fas fa-times',
        text_class: 'text-red-400',
        errorMessage: 'Such a file already exists',
      });
      return;
    }

    const songsRef = fref(storageRef, `songs/${fileHash}`);
    const task = uploadBytesResumable(songsRef, file);

    const uploadIndex =
      uploadingSongs.value.push({
        task,
        name: file.name,
        progress: 0,
        variant: 'bg-blue-400',
        icon: 'fas fa-spinner fa-spin',
        text_class: '',
      }) - 1;

    task.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        uploadingSongs.value[uploadIndex].progress = progress;
      },
      (error) => {
        const uploadingSong = uploadingSongs.value[uploadIndex];
        uploadingSong.variant = 'bg-red-400';
        uploadingSong.icon = 'fas fa-times';
        uploadingSong.text_class = 'text-red-400';
        uploadingSong.errorMessage = 'The file size must be less than 10 MB';
        console.log(error);
      },
      async () => {
        const song: Song = {
          uid: auth.currentUser!.uid,
          display_name: auth.currentUser!.displayName,
          original_name: file.name,
          modified_name: file.name,
          genre: '',
          comment_count: 0,
          url: '',
          hash: fileHash,
        };

        song.url = await getDownloadURL(task.snapshot.ref);

        await addDoc(songsCollection, song);

        const uploadingSong = uploadingSongs.value[uploadIndex];
        uploadingSong.variant = 'bg-green-400';
        uploadingSong.icon = 'fas fa-check';
        uploadingSong.text_class = 'text-green-400';

        emit('songAdded');
      }
    );
  });
}

onBeforeUnmount(() => {
  uploadingSongs.value.forEach((upload) => {
    if (!upload) return;
    upload.task?.cancel();
  });
});
</script>
<template>
  <div class="bg-white rounded border border-gray-200 relative flex flex-col">
    <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
      <span class="card-title">Upload</span>
      <i class="fas fa-upload float-right text-green-400 text-2xl"></i>
    </div>
    <div class="p-6">
      <!-- Upload Dropbox -->
      <upload-dropbox @upload="upload" />
      <input
        type="file"
        multiple
        @change="upload([...($event.target as HTMLInputElement).files!])"
      />
      <hr class="my-6" />
      <!-- Progess Bars -->
      <progress-bar v-for="song in uploadingSongs" :key="song.name" :upload="song" />
    </div>
  </div>
</template>

<style scoped></style>
