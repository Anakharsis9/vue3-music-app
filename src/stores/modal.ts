import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export default defineStore('modal', () => {
  const isOpen = ref(false);
  function toggle() {
    isOpen.value = !isOpen.value;
  }
  const hiddenClass = computed(() => {
    return isOpen.value ? '' : 'hidden';
  });

  return {
    isOpen,
    toggle,
    hiddenClass,
  };
});
