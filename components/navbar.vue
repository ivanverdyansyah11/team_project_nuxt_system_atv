<script setup lang="ts">

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
          <NuxtLink :to="{path: '/'}" class="nav-link mx-1">Home</NuxtLink>
          <NuxtLink :to="{path: '/#about'}" class="nav-link mx-1">About</NuxtLink>
          <NuxtLink :to="{path: '/homepage/package'}" class="nav-link mx-1">Package</NuxtLink>
          <NuxtLink :to="{path: '/homepage/blog'}" class="nav-link mx-1">Blog</NuxtLink>
        </div>
      </div>
      <button type="button" class="button-primary-small d-none d-lg-inline-block">Login Account</button>
    </div>
  </nav>
</template>

<style scoped>

</style>