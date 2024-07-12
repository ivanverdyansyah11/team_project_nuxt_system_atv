<script setup lang="ts">
import { useBundleStore } from "~/stores/bundle";
import { useServiceStore } from "~/stores/service";
import { ref, onMounted } from 'vue';
import { useRoute } from '#app';
import { formatRupiah } from "~/helpers/FormatRupiah";

definePageMeta({
  title: 'Detail Package Page',
  layout: 'dashboard'
})

const bundleStore = useBundleStore();
const serviceStore = useServiceStore();
const route = useRoute();

await bundleStore.getBundleById(route.params.id);
const services = ref([]);

onMounted(async () => {
  await serviceStore.getAllServiceWithoutPagination();
  services.value = bundleStore.bundle?.services.map(s => s.entertainment_service.id);
});
</script>

<template>
  <div class="content container mt-4">
    <div class="row">
      <div class="col-12">
        <div class="card-default">
          <form class="form w-100">
            <div class="row g-3">
              <div class="col-12 d-flex gap-3 align-items-end">
                <div class="wrapper d-flex flex-column">
                  <label for="image" class="form-label">Package Image</label>
                  <img :src="bundleStore?.bundle?.image_path != null ? `http://localhost:8000/${bundleStore.bundle.image_path}` : 'https://placehold.co/600x400?text=Image+Not+Found'" class="input-image" alt="Package Image" style="border-radius: 4px;"/>
                </div>
              </div>
              <div class="col-12">
                <div class="input-group d-flex flex-column">
                  <label for="name">Name</label>
                  <input type="text" class="input w-100" name="name" id="name"
                         placeholder="Enter your name.." autocomplete="off" v-model="bundleStore.bundle.name" readonly>
                </div>
              </div>
              <div class="col-md-6">
                <div class="input-group d-flex flex-column">
                  <label for="price">Price</label>
                  <input type="text" class="input w-100" name="price" id="price"
                         placeholder="Enter your price.." autocomplete="off" readonly :value="formatRupiah(bundleStore.bundle.price)">
                </div>
              </div>
              <div class="col-md-6">
                <div class="input-group d-flex flex-column">
                  <label for="expired_at">Expired Date</label>
                  <input type="number" class="input w-100" name="expired_at" id="expired_at"
                         placeholder="Enter your expired date.." autocomplete="off" v-model="bundleStore.bundle.expired_at">
                </div>
              </div>
              <div class="col-12">
                <div class="input-group d-flex flex-column">
                  <label>Services</label>
                  <div class="wrapper-checkbox d-flex gap-2 flex-wrap">
                    <div class="checkbox d-flex align-items-center gap-2 me-2" v-for="(service, index) in serviceStore.serviceAll" :key="index">
                      <input type="checkbox" :id="service.id" :value="service.id" v-model="services" disabled>
                      <label class="mb-0" :for="service.id">{{service.name}}</label>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-12">
                <div class="input-group d-flex flex-column">
                  <label for="description">Description</label>
                  <textarea class="input w-100" name="description" id="description" autocomplete="off" v-model="bundleStore.bundle.description" rows="4" readonly></textarea>
                </div>
              </div>
              <div class="col-12">
                <div class="button-group d-flex gap-2">
                  <NuxtLink :to="{path: '/dashboard/entertainment-package'}" class="button-reverse">Back to Page</NuxtLink>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>