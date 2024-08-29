<script setup lang="ts">
definePageMeta({
  layout: 'homepage'
})

const user = useCookie('auth-user')
</script>

<template>
  <div>
    <section class="hero-small success container d-flex align-items-center justify-content-center">
      <div class="row justify-content-center w-100">
        <div class="col-12 col-md-10 col-lg-6 col-xxl-5 d-flex align-items-center justify-content-center flex-column gap-4">
          <img src="~/assets/image/other/success-image.svg" alt="Success Image">
          <div class="button-group d-flex align-items-center gap-2 mt-3">
            <NuxtLink :to="{path: user.user.role == 'customer' ? `/homepage/profile/history-booking` : `/dashboard/history-booking`}" class="button-primary-small">History Booking</NuxtLink>
            <NuxtLink :to="{path: '/homepage'}" class="button-reverse">Back to Home</NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>

</style>