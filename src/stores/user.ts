import { defineStore } from 'pinia';
import { ref } from 'vue';
import {
  auth,
  createUserWithEmailAndPassword,
  usersCollection,
  setDoc,
  doc,
  updateProfile,
} from '@/includes/firebase';
import type { RegisterFormValues } from '@/components/Auth/FormRegister.vue';

export default defineStore('user', () => {
  const userLoggedIn = ref(false);

  async function createUser(values: RegisterFormValues) {
    const userCred = await createUserWithEmailAndPassword(auth, values.email, values.password);
    await setDoc(doc(usersCollection, userCred.user.uid), {
      name: values.name,
      age: values.age,
      country: values.country,
      email: values.email,
    });
    await updateProfile(userCred.user, {
      displayName: values.name,
    });
    userLoggedIn.value = true;
  }

  return {
    userLoggedIn,
    createUser,
  };
});
