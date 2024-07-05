<script setup lang="ts">
import {navigateTo} from "nuxt/app";
import {useAuthStore} from "~/stores/auth";

const authStore = useAuthStore();
const logout = async (event: any) => {
  event.preventDefault();
  await authStore.logout();
  navigateTo('/login');
};
</script>

<template>
  <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fuga, nemo!</p>
  <form @submit.prevent="logout">
    <button type="submit">Logout</button>
  </form>
</template>

<style scoped>

</style>