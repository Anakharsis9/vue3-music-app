import { defineStore } from 'pinia';
import { ref } from 'vue';
import { auth, usersCollection } from '@/includes/firebase';
import type { RegisterFormValues } from '@/components/Auth/FormRegister.vue';
import type { LoginFormValues } from '@/components/Auth/FormLogin.vue';
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';

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
  async function authenticate(values: LoginFormValues) {
    await signInWithEmailAndPassword(auth, values.email, values.password);
    userLoggedIn.value = true;
  }

  async function signOut() {
    await auth.signOut();
    userLoggedIn.value = false;
  }

  return {
    userLoggedIn,
    createUser,
    authenticate,
    signOut,
  };
});
