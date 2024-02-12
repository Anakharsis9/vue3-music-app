<script setup lang="ts">
import AppHeader from './components/AppHeader.vue';
import AppAuth from './components/Auth/AppAuth.vue';
import useUserStore from '@/stores/user';
import { auth } from '@/includes/firebase';
import SongPlayer from './components/SongPlayer.vue';

const userStore = useUserStore();
if (auth.currentUser) {
  userStore.userLoggedIn = true;
}
</script>

<template>
  <app-header />
  <router-view> </router-view>
  <!-- Player -->
  <song-player />
  <app-auth />
</template>

<style></style>
