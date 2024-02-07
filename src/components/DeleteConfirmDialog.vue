<script setup lang="ts">
defineProps<{
  text: string;
  loading: boolean;
}>();

defineEmits<{
  close: [];
  confirm: [];
}>();
</script>

<template>
  <div class="fixed z-10 inset-0 overflow-y-auto" id="modal">
    <div
      class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
    >
      <div class="fixed inset-0 transition-opacity">
        <div class="absolute inset-0 bg-gray-800 opacity-75" @click.prevent="$emit('close')" />
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
            <p class="text-xl font-bold">Are you sure you want to delete it?</p>
            <!-- Modal Close Button -->
            <div class="modal-close cursor-pointer z-50" @click.prevent="$emit('close')">
              <i class="fas fa-times"></i>
            </div>
          </div>
          <div class="mt-4">
            <div v-if="loading" class="text-center text-2xl">
              <i class="fas fa-spinner fa-spin"></i>
            </div>
            <div v-else>
              {{ text }}
            </div>
            <div class="mt-4">
              <button
                type="button"
                class="py-1.5 px-3 rounded text-white bg-gray-600 mr-4"
                :disabled="loading"
                @click.stop="$emit('close')"
              >
                No
              </button>
              <button
                type="button"
                class="py-1.5 px-3 rounded text-white bg-red-600"
                :disabled="loading"
                @click.stop="$emit('confirm')"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
