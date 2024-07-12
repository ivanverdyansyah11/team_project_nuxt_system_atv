<script setup lang="ts">
import { navigateTo } from "nuxt/app";
import { useAuthStore } from "~/stores/auth";

const authStore = useAuthStore();
const logout = async (event: any) => {
  event.preventDefault();
  await authStore.logout();
  navigateTo('/dashboard/auth/login');
};

const toggleActive = (event: Event) => {
  const button = event.currentTarget as HTMLElement;
  button.classList.toggle('active');
};
</script>

<template>
  <nav class="sidebar d-flex flex-column align-items-center">
    <NuxtLink to="/dashboard">
      <img src="~/assets/image/brand/brand-logo.svg" alt="Brand Logo" class="brand-logo">
    </NuxtLink>
    <div class="sidebar-menu d-flex flex-column w-100">
      <NuxtLink to="/dashboard"
         class="menu-link d-flex align-items-center gap-2" :class="{ active: $route.path === '/dashboard' }">
        <i class="fa-solid fa-gauge"></i>
        Dashboard
      </NuxtLink>
      <button type="button" class="menu-link d-flex flex-column parent-menu" :class="{ active: $route.path.startsWith('/dashboard/instructor') || $route.path.startsWith('/dashboard/staff') || $route.path.startsWith('/dashboard/customer') }" @click="toggleActive($event)">
        <div class="wrapper d-flex align-items-center gap-2">
          <i class="fa-solid fa-circle-user"></i>
          User
        </div>
        <div class="child-menu flex-column gap-1">
          <NuxtLink to="/dashboard/instructor" :class="{ active: $route.path.startsWith('/dashboard/instructor') }">Instructor</NuxtLink>
          <NuxtLink to="/dashboard/staff" :class="{ active: $route.path.startsWith('/dashboard/staff') }">Staff</NuxtLink>
          <NuxtLink to="/dashboard/customer" :class="{ active: $route.path.startsWith('/dashboard/customer') }">Customer</NuxtLink>
        </div>
      </button>
      <NuxtLink to="/dashboard/facility"
                class="menu-link d-flex align-items-center gap-2" :class="{ active: $route.path === '/dashboard/facility' }">
        <i class="fa-solid fa-screwdriver-wrench"></i>
        Facility
      </NuxtLink>
      <NuxtLink to="/dashboard/route"
                class="menu-link d-flex align-items-center gap-2" :class="{ active: $route.path === '/dashboard/route' }">
        <i class="fa-solid fa-map-location-dot"></i>
        Route
      </NuxtLink>
      <NuxtLink to="/dashboard/luggage"
                class="menu-link d-flex align-items-center gap-2" :class="{ active: $route.path === '/dashboard/luggage' }">
        <i class="fa-solid fa-briefcase"></i>
        Luggage
      </NuxtLink>
      <button type="button" class="menu-link d-flex flex-column parent-menu" :class="{ active: $route.path.startsWith('/dashboard/entertainment-category') || $route.path.startsWith('/dashboard/entertainment-package') || $route.path.startsWith('/dashboard/entertainment-service') }" @click="toggleActive($event)">
        <div class="wrapper d-flex align-items-center gap-2">
          <i class="fa-solid fa-mountain-sun"></i>
          Entertainment
        </div>
        <div class="child-menu flex-column gap-1">
          <NuxtLink to="/dashboard/entertainment-category" :class="{ active: $route.path.startsWith('/dashboard/entertainment-category') }">Category</NuxtLink>
          <NuxtLink to="/dashboard/entertainment-package" :class="{ active: $route.path.startsWith('/dashboard/entertainment-package') }">Package</NuxtLink>
          <NuxtLink to="/dashboard/entertainment-service" :class="{ active: $route.path.startsWith('/dashboard/entertainment-service') }">Service</NuxtLink>
        </div>
      </button>
      <form @submit.prevent="logout">
        <button type="submit" class="menu-link d-flex gap-2 align-items-center">
          <i class="fa-solid fa-right-from-bracket"></i>
          Logout
        </button>
      </form>
    </div>
  </nav>
</template>

<style scoped>

</style>