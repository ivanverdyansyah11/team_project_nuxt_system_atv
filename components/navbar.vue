<script setup lang="ts">
import { useAuthStore } from '~/stores/auth';
import profileNotFound from '~/assets/image/profile/profile-not-found.svg';

const authStore = useAuthStore()
</script>

<template>
  <nav class="navbar navbar-expand-lg bg-body-tertiary fixed-top">
    <div class="container d-lg-flex justify-content-lg-between align-items-lg-center">
      <NuxtLink :to="{path: '/'}" class="navbar-brand">
        <img src="~/assets/image/brand/brand-logo.svg" alt="Brand Logo" width="62">
      </NuxtLink>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse d-lg-flex justify-content-lg-center w-100" id="navbarNavAltMarkup">
        <div class="navbar-nav">
          <NuxtLink :to="{path: '/homepage'}" class="nav-link mx-1" :class="{active: $route.path == '/homepage'}">Home</NuxtLink>
          <NuxtLink :to="{path: '/homepage/instructor'}" class="nav-link mx-1" :class="{active: $route.path.startsWith('/homepage/instructor')}">Instructor</NuxtLink>
          <NuxtLink :to="{path: '/homepage/service'}" class="nav-link mx-1" :class="{active: $route.path.startsWith('/homepage/service')}">Service</NuxtLink>
          <NuxtLink :to="{path: '/homepage/package'}" class="nav-link mx-1" :class="{active: $route.path.startsWith('/homepage/package')}">Package</NuxtLink>
          <NuxtLink :to="{path: '/homepage/blog'}" class="nav-link mx-1" :class="{active: $route.path.startsWith('/homepage/blog')}">Blog</NuxtLink>
          <NuxtLink v-if="authStore.isLoggedIn" :to="{path: '/homepage/profile'}" class="nav-link mx-1 d-lg-none" :class="{active: $route.path.startsWith('/homepage/profile')}">Profile</NuxtLink>
          <NuxtLink v-else :to="{path: '/auth/login'}" class="nav-link mx-1 d-lg-none">Login</NuxtLink>
        </div>
      </div>
      <NuxtLink :to="{path: authStore.user.user.role == 'customer' ? '/homepage/profile' : '/dashboard/profile'}" v-if="authStore.isLoggedIn" class="d-none d-lg-flex align-items-center gap-3 profile">
        <div class="wrapper d-flex flex-column align-items-end">
          <h6>{{authStore.user.name}}</h6>
          <p>{{authStore.user.user.email}}</p>
        </div>
        <img :src="authStore.user.user.profile_path != null ? `http://localhost:8000/${authStore.user.user.profile_path}` : profileNotFound" alt="Profile Image">
      </NuxtLink>
      <NuxtLink v-else :to="{path: '/auth/login'}" class="button-primary-small d-none d-lg-inline-block">Login Account</NuxtLink>
    </div>
  </nav>
</template>

<style scoped>
</style>