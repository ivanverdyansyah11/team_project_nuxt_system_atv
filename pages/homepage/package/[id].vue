<script setup lang="ts">
import { useBundleStore } from "~/stores/bundle";
import { useRoute } from '#app';

definePageMeta({
  layout: 'homepage'
})

const bundleStore = useBundleStore()
const route = useRoute();
await bundleStore.getBundleById(route.params.id)
</script>

<template>
  <!-- SECTION HERO -->
  <section class="hero-small container d-flex align-items-center" id="home">
    <div class="row align-items-center w-100">
      <div class="col-lg-5 d-none d-lg-inline-block">
        <div class="wrapper-banner position-relative">
          <img src="~/assets/image/other/other-top.svg" alt="Other Top Image">
          <img src="~/assets/image/other/other-bottom.svg" alt="Bottom Top Image">
          <img :src="bundleStore.bundle.image_path != null ? `http://localhost:8000/${bundleStore.bundle.image_path}` : 'https://placehold.co/600x400?text=Image+Not+Found'" alt="Banner Image" class="img-fluid position-relative banner-image">
        </div>
      </div>
      <div class="offset-lg-1 col-lg-6">
        <h2 class="title">{{bundleStore.bundle.name}}</h2>
        <p class="description">{{bundleStore.bundle.description}}</p>
        <div class="button-group d-flex gap-2 align-items-center">
          <NuxtLink to="#service" class="button-primary-small">Learn More</NuxtLink>
          <NuxtLink :to="{path: `/homepage/booking/package/${bundleStore.bundle.id}`}" class="button-reverse">Booking Now</NuxtLink>
        </div>
      </div>
    </div>
  </section>
  <!-- END SECTION HERO -->


  <!-- SECTION SERVICE -->
  <section class="service section-gap-margin" id="service">
    <div class="container">
      <div class="row">
        <div class="col-12">
          <h2 class="title text-lg-center">ATV + Cycling Package Service</h2>
        </div>
      </div>
      <div class="row row-cols-2 row-cols-md-4 row-cols-xl-5 g-3 g-md-4 content-gap content-value">
        <div v-for="(service, index) in bundleStore.bundle.services" :key="index" class="col">
          <div class="card-service">
            <img :src="service.entertainment_service.image_path != null ? `http://localhost:8000/${service.entertainment_service.image_path}` : 'https://placehold.co/600x400?text=Image+Not+Found'" alt="">
            <h6>{{service.entertainment_service.name}}</h6>
            <p>Here, we offer ATV Extreme Service where you can explore...</p>
<!--            <p>{{service.entertainment_service.description}}</p>-->
            <NuxtLink :to="{path: `/homepage/service/${service.entertainment_service.id}`}" class="button-reverse w-100 text-center">Service Details</NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </section>
  <!-- END SECTION SERVICE -->
</template>

<style scoped>

</style>