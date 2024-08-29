<script setup lang="ts">
import Cookies from "js-cookie";

definePageMeta({
  layout: 'homepage'
})

const user = useCookie('auth-user')
const bookingType = useCookie('booking-type')
const bookingId = useCookie('booking-id')

onBeforeRouteLeave((to, from, next) => {
  Cookies.remove('booking-type')
  Cookies.remove('booking-id')
  next()
})

onBeforeRouteUpdate((to, from, next) => {
  Cookies.remove('booking-type')
  Cookies.remove('booking-id')
  next()
})
</script>

<template>
  <div>
    <section class="hero-small success container d-flex align-items-center justify-content-center">
      <div class="row justify-content-center w-100">
        <div class="col-12 col-md-10 col-lg-6 col-xxl-5 d-flex align-items-center justify-content-center flex-column gap-4">
          <img src="~/assets/image/other/success-image.svg" alt="Success Image">
          <div class="button-group d-flex align-items-center gap-2 mt-3">
            <NuxtLink :to="{path: user.user.role == 'customer' ? bookingType == 'service' ? `/homepage/profile/history-booking/service` : `/homepage/profile/history-booking/package` : bookingType == 'service' ? `/dashboard/history-booking/service/${bookingId}` : `/dashboard/history-booking/package/${bookingId}`}" class="button-primary-small">History Booking</NuxtLink>
            <NuxtLink :to="{path: '/homepage'}" class="button-reverse">Back to Home</NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>

</style>