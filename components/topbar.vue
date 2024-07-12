<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useRoute } from 'vue-router'
import { ref, watch } from 'vue'

const route = useRoute();
const title = ref('')
const authStore = useAuthStore();

watch(
    () => route.meta.title,
    (newTitle) => {
      if (newTitle) {
        title.value = newTitle
      }
    },
    { immediate: true }
)
</script>

<template>
  <div class="topbar d-flex justify-content-between align-items-center container">
    <h3 class="title">{{ title }}</h3>
    <div class="wrapper-position position-relative d-none d-lg-inline-block">
      <NuxtLink to="/dashboard/profile" class="topbar-profile d-flex align-items-center position-relative gap-3">
        <div class="wrapper d-flex align-items-center gap-3">
          <div class="wrapper d-flex flex-column align-items-end">
            <h6>{{ authStore?.user.name }}</h6>
            <p class="text-capitalize">{{ authStore?.user.user.role }}</p>
          </div>
          <img src="~/assets/image/profile/profile-not-found.svg"
               class="img-fluid profile-image" alt="Profile Profile" draggable="false">
        </div>
      </NuxtLink>
    </div>
    <div class="topbar-hamburger d-lg-none d-flex align-items-center justify-content-center">
      <i class="fa-solid fa-bars-staggered"></i>
    </div>
  </div>
</template>

<style scoped>

</style>