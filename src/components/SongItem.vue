<script setup lang="ts">
import { ref } from 'vue';
import type { Song } from './types';
import { useForm, ErrorMessage } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/yup';
import { object, string, type InferType } from 'yup';
import {
  doc,
  songsCollection,
  updateDoc,
  deleteDoc,
  storageRef,
  ref as fref,
  deleteObject,
} from '@/includes/firebase';

const props = defineProps<{
  song: Song;
}>();
const emit = defineEmits<{
  updateSong: [values: SongFormValues];
  removeSong: [];
}>();

const isEditing = ref(false);

const schema = object({
  title: string().required(),
  genre: string(),
});
export type SongFormValues = InferType<typeof schema>;

const { handleSubmit } = useForm({
  validationSchema: toTypedSchema(schema),
  initialValues: {
    title: props.song.modified_name,
    genre: props.song.genre,
  },
});

const in_submission = ref(false);
const show_alert = ref(false);
const alert_variant = ref('bg-blue-500');
const alert_msg = ref('Please wait! Updating song info.');

const songRef = doc(songsCollection, props.song.id);

const updateSong = handleSubmit(async (values) => {
  show_alert.value = true;
  in_submission.value = true;
  alert_variant.value = 'bg-blue-500';
  alert_msg.value = 'Please wait! Updating song info.';

  try {
    await updateDoc(songRef, {
      modified_name: values.title,
      genre: values.genre,
    });
  } catch (error) {
    in_submission.value = false;
    alert_variant.value = 'bg-red-500';
    alert_msg.value = 'Something went wrong! Try again later.';
    return;
  }

  emit('updateSong', values);

  in_submission.value = false;
  alert_variant.value = 'bg-green-500';
  alert_msg.value = 'Success! Song updated.';
  isEditing.value = false;
});

async function deleteSong() {
  const songStorageRef = fref(storageRef, `songs/${props.song.original_name}`);
  try {
    await deleteObject(songStorageRef);
    await deleteDoc(songRef);
    emit('removeSong');
  } catch (error) {
    console.error(error);
  }
}
</script>

<template>
  <div class="border border-gray-200 p-3 mb-4 rounded">
    <div v-show="!isEditing">
      <h4 class="inline-block text-2xl font-bold">{{ song.modified_name }}</h4>
      <button
        class="ml-1 py-1 px-2 text-sm rounded text-white bg-red-600 float-right"
        @click="deleteSong"
      >
        <i class="fas fa-trash"></i>
      </button>
      <button
        class="ml-1 py-1 px-2 text-sm rounded text-white bg-blue-600 float-right"
        @click="isEditing = true"
      >
        <i class="fa fa-pencil-alt"></i>
      </button>
    </div>
    <div v-show="isEditing">
      <div
        v-if="show_alert"
        class="text-white text-center font-bold p-4 rounded mb-4"
        :class="alert_variant"
      >
        {{ alert_msg }}
      </div>
      <form @submit="updateSong">
        <div class="mb-3">
          <label class="inline-block mb-2">Song Title</label>
          <vee-field
            name="title"
            type="text"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Enter Song Title"
          />
          <ErrorMessage class="text-red-600" name="title" />
        </div>
        <div class="mb-3">
          <label class="inline-block mb-2">Genre</label>
          <vee-field
            name="genre"
            type="text"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Enter Genre"
          />
        </div>
        <button
          type="submit"
          class="py-1.5 px-3 rounded text-white bg-green-600 mr-4"
          :disabled="in_submission"
        >
          Submit
        </button>
        <button
          type="button"
          class="py-1.5 px-3 rounded text-white bg-gray-600"
          :disabled="in_submission"
          @click.stop="isEditing = false"
        >
          Go Back
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped></style>
