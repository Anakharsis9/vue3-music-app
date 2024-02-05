<script setup lang="ts">
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/yup';
import { object, string, number, type InferType } from 'yup';
import { ref } from 'vue';
import useUserStore from '@/stores/user';

const schema = object({
  name: string().required().min(3).trim(),
  email: string().email().required(),
  age: number().typeError('age must be a number').required().min(18).max(100),
  password: string().min(6).required(),
  confirmPassword: string()
    .required()
    .test('passwords-match', 'passwords must match', function (value) {
      return this.parent.password === value;
    }),
  country: string().required(),
  tos: string().required('Must accept the Terms of Service.'),
});

export type RegisterFormValues = InferType<typeof schema>;

const { handleSubmit } = useForm({
  validationSchema: toTypedSchema(schema),
  initialValues: {
    country: 'Kazakhstan',
  },
});

const in_submission = ref(false);
const show_alert = ref(false);
const alert_variant = ref('bg-blue-500');
const alert_msg = ref('Please wait! Your account is being created.');

const userStore = useUserStore();

const onSubmit = handleSubmit(async (values) => {
  show_alert.value = true;
  in_submission.value = true;
  alert_variant.value = 'bg-blue-500';
  alert_msg.value = 'Please wait! Your account is being created.';

  try {
    await userStore.createUser(values);
  } catch (error) {
    in_submission.value = false;
    alert_variant.value = 'bg-red-500';
    alert_msg.value = 'An unexpected error occurred. Please try again later.';
    return;
  }

  alert_variant.value = 'bg-green-500';
  alert_msg.value = 'Success your account has been created!';
  window.location.reload();
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
    <!-- Name -->
    <div class="mb-3">
      <label class="inline-block mb-2">Name</label>
      <vee-field
        name="name"
        type="text"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Enter Name"
      />
      <ErrorMessage class="text-red-600" name="name" />
    </div>
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
    <!-- Age -->
    <div class="mb-3">
      <label class="inline-block mb-2">Age</label>
      <vee-field
        name="age"
        type="number"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
      />
      <ErrorMessage class="text-red-600" name="age" />
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
    <!-- Confirm Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">Confirm Password</label>
      <vee-field
        name="confirmPassword"
        type="password"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Confirm Password"
      />
      <ErrorMessage class="text-red-600" name="confirmPassword" />
    </div>
    <!-- Country -->
    <div class="mb-3">
      <label class="inline-block mb-2">Country</label>
      <vee-field
        as="select"
        name="country"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
      >
        <option value="Kazakhstan">Kazakhstan</option>
        <option value="Russia">Russia</option>
        <option value="China">China</option>
      </vee-field>
      <ErrorMessage class="text-red-600" name="country" />
    </div>
    <!-- TOS -->
    <div class="mb-3 pl-6">
      <vee-field
        name="tos"
        type="checkbox"
        value="1"
        class="w-4 h-4 float-left -ml-6 mt-1 rounded"
      />
      <label class="inline-block">Accept terms of service</label>
      <ErrorMessage class="text-red-600" name="tos" as="div" />
    </div>
    <button
      type="submit"
      class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition hover:bg-purple-700"
      :class="{ 'cursor-not-allowed disabled:opacity-75': in_submission }"
      :disabled="in_submission"
    >
      Submit
    </button>
  </form>
</template>

<style scoped></style>
