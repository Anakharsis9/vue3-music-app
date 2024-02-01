<script setup lang="ts">
import { ErrorMessage, useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/yup';
import { object, string, type InferType } from 'yup';
import { ref } from 'vue';
import user from '@/stores/user';

const schema = object({
  email: string().email().required(),
  password: string().min(6).required(),
});

export type LoginFormValues = InferType<typeof schema>;

const { handleSubmit } = useForm({
  validationSchema: toTypedSchema(schema),
});

const login_in_submission = ref(false);
const login_show_alert = ref(false);
const login_alert_variant = ref('bg-blue-500');
const login_alert_msg = ref('Please wait! We are logging you in.');

const userStore = user();

const onSubmit = handleSubmit(async (values) => {
  login_show_alert.value = true;
  login_in_submission.value = true;
  login_alert_variant.value = 'bg-blue-500';
  login_alert_msg.value = 'Please wait! We are logging you in.';

  try {
    await userStore.authenticate(values);
  } catch (error) {
    login_in_submission.value = false;
    login_alert_variant.value = 'bg-red-500';
    login_alert_msg.value = 'Invalid login details.';
    return;
  }

  login_alert_variant.value = 'bg-green-500';
  login_alert_msg.value = 'Success! You are now logging in.';
  window.location.reload();
});
</script>
<template>
  <div
    v-if="login_show_alert"
    class="text-white text-center font-bold p-4 rounded mb-4"
    :class="login_alert_variant"
  >
    {{ login_alert_msg }}
  </div>
  <form @submit="onSubmit">
    <!-- Email -->
    <div class="mb-3">
      <label class="inline-block mb-2">Email</label>
      <vee-field
        name="email"
        type="email"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Enter Email"
      />
      <ErrorMessage class="text-red-600" name="email" />
    </div>
    <!-- Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">Password</label>
      <vee-field
        name="password"
        type="password"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Password"
      />
      <ErrorMessage class="text-red-600" name="password" />
    </div>
    <button
      type="submit"
      class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition hover:bg-purple-700"
      :class="{ 'cursor-not-allowed disabled:opacity-75': login_in_submission }"
      :disabled="login_in_submission"
    >
      Submit
    </button>
  </form>
</template>

<style scoped></style>
