<script setup lang="ts">
import {useServiceStore} from "~/stores/service"
import {ref, onMounted} from 'vue'
import imageNotFound from '~/assets/image/other/image-not-found.svg'

const serviceStore = useServiceStore()
const keyword = ref('')
let serviceLength = ref(0)


definePageMeta({
  layout: 'homepage'
})

const search = async (event: any) => {
  event.preventDefault()
  serviceStore.$state.keyword = keyword.value
  await serviceStore.getAllServiceWithoutPagination()
  serviceLength.value = serviceStore.serviceAll.length
}

onMounted(async () => {
  await serviceStore.getAllServiceWithoutPagination()
  serviceLength.value = serviceStore.serviceAll.length
})
</script>

<template>
  <!-- SECTION HERO -->
  <section class="hero-small container" id="hero">
    <div class="row justify-content-center">
      <div class="col-lg-9 col-xl-8 text-lg-center">
        <h1 class="headline">Comprehensive ATV Services with ATRide Adventure</h1>
        <p class="description">ATRide Adventure offers more than just ATV rentals. Our full suite of services ensures that your off-road experience is seamless and enjoyable from start to finish.</p>
        <form>
          <input type="search" class="input-search" placeholder="Search service..." autocomplete="off" v-model="keyword" @keyup="search">
        </form>
      </div>
    </div>
  </section>
  <!-- END SECTION HERO -->


  <!-- SECTION SERVICE -->
  <section class="service container content-gap" id="service">
    <div class="row content-gap" :class="{'row-cols-2 row-cols-md-4 row-cols-xl-5 g-3 g-md-4 content-value': serviceLength > 0}">
      <div v-if="serviceLength > 0" class="col" v-for="(service, index) in serviceStore.serviceAll" :key="index">
        <div class="card-service">
          <img :src="service.image_path != null ? `http://localhost:8000/${service.image_path}` : imageNotFound" alt="Service Image">
          <h6>{{service.name}}</h6>
          <p>Here, we offer ATV Extreme Service where you can explore...</p>
          <!--            <p>{{service.description}}</p>-->
          <NuxtLink :to="{path: `/homepage/service/${service.id}`}" class="button-reverse w-100 text-center">Service Details</NuxtLink>
        </div>
      </div>
      <div v-else class="col-12 my-5">
        <p class="description w-100 text-center">No data service found! <br> Please search any keyword.</p>
      </div>
    </div>
  </section>
  <!-- END SECTION SERVICE -->
</template>

<style scoped>

</style>