<script setup lang="ts">
import { ErrorMessage, useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/yup';
import { object, string } from 'yup';
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { auth, commentsCollection } from '@/includes/firebase';
import { addDoc } from 'firebase/firestore';

const emit = defineEmits<{
  addComment: [];
}>();

const route = useRoute();

export type Comment = {
  id?: string;
  content: string;
  date_posted: string;
  song_id: string;
  author: {
    name: string;
    uid: string;
  };
};

const schema = object({
  comment_text: string().min(3).required(),
});

const { handleSubmit } = useForm({
  validationSchema: toTypedSchema(schema),
});

const in_submission = ref(false);
const show_alert = ref(false);
const alert_variant = ref('bg-blue-500');
const alert_msg = ref('Please wait! Your comment is being submitted');

const onSubmit = handleSubmit(async (values, { resetForm }) => {
  show_alert.value = true;
  in_submission.value = true;
  alert_variant.value = 'bg-blue-500';
  alert_msg.value = 'Please wait! Your comment is being submitted';

  const comment: Comment = {
    content: values.comment_text,
    date_posted: new Date().toString(),
    song_id: route.params.id as string,
    author: {
      name: auth.currentUser!.displayName ?? '',
      uid: auth.currentUser!.uid,
    },
  };
  try {
    await addDoc(commentsCollection, comment);
  } catch (error) {
    in_submission.value = false;
    alert_variant.value = 'bg-red-500';
    alert_msg.value = 'Invalid login details.';
    return;
  }
  emit('addComment');
  in_submission.value = false;
  alert_variant.value = 'bg-green-500';
  alert_msg.value = 'Success! Comment added!';
  resetForm();
});
</script>

<template>
  <div
    v-if="show_alert"
    class="text-white text-center font-bold p-4 rounded mb-4"
    :class="alert_variant"
  >
    {{ alert_msg }}
  </div>
  <form @submit="onSubmit">
    <div class="mb-4">
      <vee-field
        as="textarea"
        name="comment_text"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Your comment here..."
      ></vee-field>
      <ErrorMessage class="text-red-600 mb-4" name="comment_text" />
    </div>
    <button
      type="submit"
      class="py-1.5 px-3 rounded text-white bg-green-600 block"
      :disabled="in_submission"
    >
      Submit
    </button>
  </form>
</template>

<style scoped></style>
