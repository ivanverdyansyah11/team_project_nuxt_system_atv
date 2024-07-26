<script setup lang="ts">
import {useBundleStore} from "~/stores/bundle";
import {ref, onMounted} from 'vue'

definePageMeta({
  layout: 'homepage'
})

const bundleStore = useBundleStore();
const keyword = ref('')
let packageLength = ref(0)

const search = async (event: any) => {
  event.preventDefault()
  bundleStore.$state.keyword = keyword.value
  await bundleStore.getAllBundle()
  packageLength.value = bundleStore.bundleAll.length
}

onMounted(async () => {
  await bundleStore.getAllBundle();
  packageLength.value = bundleStore.bundleAll.length
})
</script>

<template>
  <!-- SECTION HERO -->
  <section class="hero-small container" id="hero">
    <div class="row justify-content-center">
      <div class="col-lg-9 col-xl-8 text-lg-center">
        <h1 class="headline">Discover ATRide Adventure Comprehensive ATV Rental Packages</h1>
        <p class="description">Embark on an unforgettable journey with ATRide Adventure's wide array of ATV rental packages. Whether you're seeking thrilling off-road escapades, serene trail rides, or weekend adventures, we offer the perfect package to suit your needs.</p>
        <form>
          <input type="search" class="input-search" placeholder="Search package..." autocomplete="off" v-model="keyword" @keyup="search">
        </form>
      </div>
    </div>
  </section>
  <!-- END SECTION HERO -->


  <!-- SECTION PACKAGE -->
  <section class="package container content-gap" id="package">
    <div class="row content-gap" :class="{'row-cols-2 row-cols-lg-3 g-3 g-md-4 content-value': packageLength > 0}">
      <div v-if="packageLength > 0" class="col" v-for="(bundle, index) in bundleStore.bundleAll" :key="index">
        <NuxtLink :to="{path: `/homepage/package/${bundle.id}`}" class="card-package w-100">
          <div class="package-image">
            <img :src="bundle.image_path != null ? `http://localhost:8000/${bundle.image_path}` : 'https://placehold.co/600x400?text=Image+Not+Found'" alt="Package Image">
          </div>
          <h6>{{bundle.name}}</h6>
          <p>{{bundle.description}}</p>
          <button class="button-reverse text-center w-100 d-none d-lg-inline-block">See Detail Package</button>
        </NuxtLink>
      </div>
      <div v-else class="col-12 my-5">
        <p class="description w-100 text-center">No data package found! <br> Please search any keyword.</p>
      </div>
    </div>
  </section>
  <!-- END SECTION PACKAGE -->
</template>

<style scoped>

</style>