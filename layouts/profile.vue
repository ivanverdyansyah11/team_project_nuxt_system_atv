<script setup lang="ts">
import {useAuthStore} from '~/stores/auth';
import profileNotFound from '~/assets/image/profile/profile-not-found.svg';
import {navigateTo} from "nuxt/app";

const authStore = useAuthStore()

const logout = async (event: any) => {
  event.preventDefault();
  await authStore.logout();
  navigateTo('/dashboard/auth/login');
};
</script>

<template>
  <Navbar />
  <main class="homepage w-100">
    <section class="hero-small profile container">
      <div class="row">
        <div class="col-12">
          <img src="~/assets/image/other/background-profile.svg" alt="Background Profile" class="background-image">
        </div>
        <div class="col-lg-4 col-xl-3 col-profile ps-5" :class="{ 'd-none': $route.path === '/homepage/profile/edit', 'd-lg-inline-block': $route.path !== '/homepage/profile/edit' }">
          <img :src="authStore.user.user.profile_path != null ? `http://localhost:8000/${authStore.user.user.profile_path}` : profileNotFound" alt="Profile Image" class="profile-image">
          <h6 class="profile-name">{{authStore.user.name}}</h6>
          <p class="profile-email">{{authStore.user.user.email}}</p>
          <div class="button-group d-flex align-items-center gap-2">
            <NuxtLink :to="{path: '/homepage/profile/edit'}" class="button-primary-small w-100 text-center">Edit Profile</NuxtLink>
            <form @submit.prevent="logout" class="form">
              <button type="submit" class="button-reverse button-logout">
                <i class="fa-solid fa-right-from-bracket"></i>
              </button>
            </form>
          </div>
        </div>
        <div class="mt-4" :class="{ 'col-12': $route.path === '/homepage/profile/edit', 'col-lg-8 col-xl-9': $route.path !== '/homepage/profile/edit' }">
          <div class="profile-menu-list">
            <div class="list-menu d-flex align-items-center gap-2">
              <NuxtLink :to="{path: '/homepage/profile'}" class="menu-item" :class="{ active: $route.path == '/homepage/profile' || $route.path == '/homepage/profile/edit' }">Profile Data</NuxtLink>
              <NuxtLink :to="{path: '/homepage/profile/history-booking/service'}" class="menu-item" :class="{ active: $route.path.startsWith('/homepage/profile/history-booking/service') }">History Booking Service</NuxtLink>
              <NuxtLink :to="{path: '/homepage/profile/history-booking/package'}" class="menu-item" :class="{ active: $route.path.startsWith('/homepage/profile/history-booking/package') }">History Booking Package</NuxtLink>
            </div>
          </div>
          <div class="profile-menu-data mt-3">
            <slot></slot>
          </div>
        </div>
      </div>
    </section>
    <Footer />
  </main>
</template>

<style scoped>
</style>