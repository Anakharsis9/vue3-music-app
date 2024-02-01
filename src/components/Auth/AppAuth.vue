<script setup lang="ts">
import modalStore from '@/stores/modal';
import { ref, type Component } from 'vue';
import FormLogin from './FormLogin.vue';
import FormRegister, { type RegisterFormValues } from './FormRegister.vue';

const store = modalStore();
const tabs: {
  [key: string]: Component;
} = {
  login: FormLogin,
  register: FormRegister,
};
const currentTab = ref('login');

const reg_in_submission = ref(false);
const reg_show_alert = ref(false);
const reg_alert_variant = ref('bg-blue-500');
const reg_alert_msg = ref('Please wait! Your account is being created.');

function register(values: RegisterFormValues) {
  reg_show_alert.value = true;
  reg_in_submission.value = true;
  reg_alert_variant.value = 'bg-blue-500';
  reg_alert_msg.value = 'Please wait! Your account is being created.';

  setTimeout(() => {
    reg_alert_variant.value = 'bg-green-500';
    reg_alert_msg.value = 'Success your account has been created!';
    console.log(values);
  }, 2000);
}
</script>

<template>
  <div class="fixed z-10 inset-0 overflow-y-auto" id="modal" :class="store.hiddenClass">
    <div
      class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
    >
      <div class="fixed inset-0 transition-opacity">
        <div class="absolute inset-0 bg-gray-800 opacity-75" @click.prevent="store.toggle" />
      </div>

      <!-- This element is to trick the browser into centering the modal contents. -->
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

      <div
        class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
      >
        <!-- Add margin if you want to see some of the overlay behind the modal-->
        <div class="py-4 text-left px-6">
          <!--Title-->
          <div class="flex justify-between items-center pb-4">
            <p class="text-2xl font-bold">Your Account</p>
            <!-- Modal Close Button -->
            <div class="modal-close cursor-pointer z-50" @click.prevent="store.toggle">
              <i class="fas fa-times"></i>
            </div>
          </div>

          <!-- Tabs -->
          <ul class="flex flex-wrap mb-4">
            <li class="flex-auto text-center">
              <a
                class="block rounded py-3 px-4 transition"
                href="#"
                @click.prevent="currentTab = 'login'"
                :class="{
                  'hover:text-white text-white bg-blue-600': currentTab === 'login',
                  'hover:text-blue-600': currentTab === 'register',
                }"
              >
                Login
              </a>
            </li>
            <li class="flex-auto text-center">
              <a
                class="block rounded py-3 px-4 transition"
                href="#"
                @click.prevent="currentTab = 'register'"
                :class="{
                  'hover:text-white text-white bg-blue-600': currentTab === 'register',
                  'hover:text-blue-600': currentTab === 'login',
                }"
              >
                Register
              </a>
            </li>
          </ul>
          <div
            class="text-white text-center font-bold p-4 rounded mb-4"
            v-if="reg_show_alert && currentTab === 'register'"
            :class="reg_alert_variant"
          >
            {{ reg_alert_msg }}
          </div>
          <KeepAlive>
            <component
              :is="tabs[currentTab]"
              :disableSubmit="reg_in_submission"
              @register="register"
            />
          </KeepAlive>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
