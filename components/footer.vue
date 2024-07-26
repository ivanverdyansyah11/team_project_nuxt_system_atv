<script setup lang="ts">
import {useServiceStore} from "~/stores/service";
const serviceStore = useServiceStore();
onMounted(async () => {
  await serviceStore.getAllService()
})
</script>

<template>
  <footer class="footer section-gap-margin" id="footer">
    <div class="container">
      <div class="row">
        <div class="col-md-4">
          <NuxtLink :to="{path: '/homepage'}">
            <img src="~/assets/image/brand/brand-logo.svg" alt="Brand Logo" width="86" class="brand-image">
          </NuxtLink>
          <p>Embark on Unforgettable Adventures - Your Premier Destination for ATV Excitement and Thrills!</p>
          <div class="footer-sosmed d-flex align-items-center" style="gap: 6px;">
            <NuxtLink target="_blank" to="https://instagram.com" class="sosmed">
              <i class="fa-brands fa-instagram" style="font-size: 1.125rem;"></i>
            </NuxtLink>
            <NuxtLink target="_blank" to="https://whatsapp.com" class="sosmed">
              <i class="fa-brands fa-whatsapp" style="font-size: 1.125rem;"></i>
            </NuxtLink>
            <NuxtLink target="_blank" to="https://facebook.com" class="sosmed">
              <i class="fa-brands fa-facebook"></i>
            </NuxtLink>
            <NuxtLink target="_blank" to="https://twitter.com" class="sosmed">
              <i class="fa-brands fa-twitter"></i>
            </NuxtLink>
          </div>
        </div>
        <div class="col-6 col-md-2 my-5 my-md-0">
          <h6>Frequently Link</h6>
          <div class="footer-link d-flex flex-column gap-2">
            <NuxtLink :to="{path: '/homepage#home'}">Home</NuxtLink>
            <NuxtLink :to="{path: '/homepage#about'}">About</NuxtLink>
            <NuxtLink :to="{path: '/homepage/package'}">Package</NuxtLink>
            <NuxtLink :to="{path: '/homepage/blog'}">Blog</NuxtLink>
            <NuxtLink>Booking</NuxtLink>
          </div>
        </div>
        <div class="col-6 col-md-2 my-5 my-md-0">
          <h6>Service Available</h6>
          <div class="footer-link d-flex flex-column gap-2">
            <NuxtLink v-for="(service, index) in serviceStore.serviceAll" :key="index" :to="{path: `/homepage/service/${service.id}`}">{{service.name}}</NuxtLink>
          </div>
        </div>
        <div class="col-md-4">
          <h6>Contact Us</h6>
          <div class="footer-link d-flex flex-column gap-2">
            <NuxtLink target="_blank" to="https://whatsapp.com" class="d-flex gap-2 align-items-center">
              <i class="fa-solid fa-phone"></i>
              0361 2408 0608
            </NuxtLink>
            <NuxtLink target="_blank" to="https://mail.com" class="d-flex gap-2 align-items-center">
              <i class="fa-regular fa-envelope"></i>
              atride0908@gmail.com
            </NuxtLink>
          </div>
          <h6 class="mt-3 mb-2">Newsletter</h6>
          <div class="footer-search">
            <input type="text" placeholder="Enter your email..">
            <button type="button">Submit</button>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <p class="copyright">2024 At Ride Area. All right reserved</p>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>

</style>