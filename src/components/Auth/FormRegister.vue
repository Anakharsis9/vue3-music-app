<script setup lang="ts">
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/yup';
import { object, string, number, type InferType } from 'yup';
import { ref } from 'vue';

const emit = defineEmits<{
  register: [values: RegisterFormValues];
}>();

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

const reg_in_submission = ref(false);
const reg_show_alert = ref(false);
const reg_alert_variant = ref('bg-blue-500');
const reg_alert_msg = ref('Please wait! Your account is being created.');

const onSubmit = handleSubmit((values) => {
  reg_show_alert.value = true;
  reg_in_submission.value = true;
  reg_alert_variant.value = 'bg-blue-500';
  reg_alert_msg.value = 'Please wait! Your account is being created.';

  setTimeout(() => {
    reg_alert_variant.value = 'bg-green-500';
    reg_alert_msg.value = 'Success your account has been created!';
    console.log(values);
  }, 2000);
  emit('register', values);
});
</script>
<template>
  <div
    v-if="reg_show_alert"
    class="text-white text-center font-bold p-4 rounded mb-4"
    :class="reg_alert_variant"
  >
    {{ reg_alert_msg }}
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
      :class="{ 'cursor-not-allowed disabled:opacity-75': reg_in_submission }"
      :disabled="reg_in_submission"
    >
      Submit
    </button>
  </form>
</template>

<style scoped></style>
