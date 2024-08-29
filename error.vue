<script setup>

</script>

<template>
<div>
  <section class="error container d-flex align-items-center justify-content-center">
    <div class="row justify-content-center w-100">
      <div class="col-12 col-md-10 col-lg-7 col-xl-6 d-flex align-items-center justify-content-center flex-column gap-4">
        <img src="~/assets/image/other/404-image.svg" alt="404 Image">
        <NuxtLink :to="{path: '/dashboard'}" class="button-primary-small">Back to Page</NuxtLink>
      </div>
    </div>
  </section>
</div>
</template>

<style scoped>

</style>