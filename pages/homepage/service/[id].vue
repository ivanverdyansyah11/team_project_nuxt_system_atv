<script setup lang="ts">
import {useServiceStore} from "~/stores/service"
import {useAuthStore} from '~/stores/auth'
import {useRoute} from '#app'
import {formatRupiah} from '~/helpers/FormatRupiah'
import imageNotFound from '~/assets/image/other/image-not-found.svg'

definePageMeta({
  layout: 'homepage'
})

const serviceStore = useServiceStore()
const authStore = useAuthStore()
const route = useRoute()
await serviceStore.getServiceById(route.params.id)
</script>

<template>
  <!-- SECTION HERO -->
  <section class="hero-small container d-flex align-items-center" id="home">
    <div class="row align-items-center w-100">
      <div class="col-lg-5 d-none d-lg-inline-block">
        <div class="wrapper-banner position-relative">
          <img src="~/assets/image/other/other-top.svg" alt="Other Top Image">
          <img src="~/assets/image/other/other-bottom.svg" alt="Bottom Top Image">
          <img :src="serviceStore.service.image_path != null ? `http://localhost:8000/${serviceStore.service.image_path}` : imageNotFound" alt="Banner Image" class="img-fluid position-relative banner-image">
        </div>
      </div>
      <div class="offset-lg-1 col-lg-6">
        <p class="subtitle mb-2">{{serviceStore.service.entertainment_category.name}}</p>
        <h2 class="title mb-2">{{serviceStore.service.name}}</h2>
        <p class="description">{{serviceStore.service.description}}</p>
        <div class="button-group d-flex gap-2 align-items-center">
          <NuxtLink to="#detail" class="button-primary-small">Learn More</NuxtLink>
          <NuxtLink v-if="authStore.isLoggedIn && authStore.user.user.role != 'instructor'" :to="{path: `/homepage/booking/service/${serviceStore.service.id}`}" class="button-reverse">Booking Now</NuxtLink>
        </div>
      </div>
    </div>
  </section>
  <!-- END SECTION HERO -->


  <!-- SECTION DETAIL SERVICE -->
  <section class="detail-service container section-gap-margin" id="detail">
    <div class="row">
      <div class="col-md-6 col-lg-8">
        <h3 class="title-small">Facility</h3>
        <div class="detail-list d-flex flex-column gap-2">
          <p v-for="(facilities, index) in serviceStore.service.facilities" :key="index" class="d-flex gap-2 align-items-center">
            <i class="fa-solid fa-square-check"></i>
            {{facilities.facility.name}}
          </p>
        </div>
        <h3 class="title-small mt-4">Route</h3>
        <div class="detail-list d-flex flex-column gap-2">
          <p v-for="(routes, index) in serviceStore.service.routes" :key="index" class="d-flex gap-2 align-items-center">
            <i class="fa-solid fa-square-check"></i>
            {{routes.route.name}}
          </p>
        </div>
      </div>
      <div class="col-md-6 col-lg-4 mt-4 mt-md-0">
        <h3 class="title-small">Instructors</h3>
        <div class="detail-list d-flex flex-column gap-2">
          <p v-for="(instructors, index) in serviceStore.service.instructors" :key="index" class="d-flex gap-2 align-items-center">
            <i class="fa-solid fa-square-check"></i>
            {{instructors.instructor.name}}
          </p>
        </div>
        <h3 class="title-small mt-4">Mandatory Equipment</h3>
        <div class="detail-list d-flex flex-column gap-2">
          <p v-for="(mandatory_luggages, index) in serviceStore.service.mandatory_luggages" :key="index" class="d-flex gap-2 align-items-center">
            <i class="fa-solid fa-square-check"></i>
            {{mandatory_luggages.mandatory_luggage.name}}
          </p>
        </div>
        <h3 class="title-small mt-4">Price & Duration</h3>
        <div class="detail-list d-flex flex-column gap-2">
          <p class="d-flex gap-2 align-items-center">
            <i class="fa-solid fa-square-check"></i>
            {{formatRupiah(serviceStore.service.price)}}
          </p>
          <p class="d-flex gap-2 align-items-center">
            <i class="fa-solid fa-square-check"></i>
            {{serviceStore.service.duration}} minutes
          </p>
        </div>
      </div>
    </div>
  </section>
  <!-- END SECTION DETAIL SERVICE -->
</template>

<style scoped>

</style>