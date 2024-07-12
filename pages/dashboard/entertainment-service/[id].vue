<script setup lang="ts">
import { useServiceStore } from "~/stores/service";
import { useCategoryStore } from "~/stores/category";
import { useRouteStore } from "~/stores/route";
import { useFacilityStore } from "~/stores/facility";
import { useInstructorStore } from "~/stores/instructor";
import { useLuggageStore } from "~/stores/luggage";
import { useRoute } from '#app';
import { ref, onMounted } from 'vue';
import { formatRupiah } from "~/helpers/FormatRupiah";

definePageMeta({
  title: 'Detail Service Page',
  layout: 'dashboard'
})

const serviceStore = useServiceStore();
const categoryStore = useCategoryStore();
const routeStore = useRouteStore();
const facilityStore = useFacilityStore();
const instructorStore = useInstructorStore();
const luggageStore = useLuggageStore();
const route = useRoute();

await serviceStore.getServiceById(route.params.id);

const routes = ref([]);
const facilities = ref([]);
const instructors = ref([]);
const mandatory_luggages = ref([]);

onMounted(async () => {
  await categoryStore.getAllCategoryWithoutPaginate();
  await routeStore.getAllRouteWithoutPaginate();
  await facilityStore.getAllFacilityWithoutPaginate();
  await instructorStore.getAllInstructorWithoutPaginate();
  await luggageStore.getAllLuggageWithoutPaginate();

  routes.value = serviceStore.service?.routes.map(r => r.route.id);
  facilities.value = serviceStore.service?.facilities?.map(f => f.facility.id);
  instructors.value = serviceStore.service?.instructors?.map(i => i.instructor.id);
  mandatory_luggages.value = serviceStore.service?.mandatory_luggages?.map(m => m.mandatory_luggage.id);
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
                  <label for="image" class="form-label">Service Image</label>
                  <img :src="serviceStore?.service?.image_path != null ? `http://localhost:8000/${serviceStore.service.image_path}` : 'https://placehold.co/600x400?text=Image+Not+Found'" class="input-image" alt="Service Image" style="border-radius: 4px;"/>
                </div>
              </div>
              <div class="col-md-6">
                <div class="input-group d-flex flex-column">
                  <label for="name">Name</label>
                  <input type="text" class="input w-100" name="name" id="name"
                         placeholder="Enter your name.." autocomplete="off" v-model="serviceStore.service.name" readonly>
                </div>
              </div>
              <div class="col-md-6">
                <div class="input-group d-flex flex-column">
                  <label for="price">Price</label>
                  <input type="text" class="input w-100" name="price" id="price"
                         placeholder="Enter your price.." autocomplete="off" readonly :value="formatRupiah(serviceStore.service.price)">
                </div>
              </div>
              <div class="col-12">
                <div class="input-group d-flex flex-column">
                  <label for="entertainment_category_id">Entertainment Category</label>
                  <select class="input w-100" name="entertainment_category_id" id="entertainment_category_id" v-model="serviceStore.service.entertainment_category.id" disabled>
                    <option v-for="(category, index) in categoryStore.categoryAll" :key="index" :value="category.id">{{category.name}}</option>
                  </select>
                </div>
              </div>
              <div class="col-md-6">
                <div class="input-group d-flex flex-column">
                  <label>Routes</label>
                  <div class="wrapper-checkbox d-flex gap-2 flex-wrap">
                    <div class="checkbox d-flex align-items-center gap-2 me-2" v-for="(route, index) in routeStore.routeAll" :key="index">
                      <input type="checkbox" :id="route.id" :value="route.id" v-model="routes" disabled>
                      <label class="mb-0" :for="route.id">{{route.address}}</label>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="input-group d-flex flex-column">
                  <label>Facilities</label>
                  <div class="wrapper-checkbox d-flex gap-2 flex-wrap">
                    <div class="checkbox d-flex align-items-center gap-2 me-2" v-for="(facility, index) in facilityStore.facilityAll" :key="index">
                      <input type="checkbox" :id="facility.id" :value="facility.id" v-model="facilities" disabled>
                      <label class="mb-0" :for="facility.id">{{facility.name}}</label>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="input-group d-flex flex-column">
                  <label>Instructor</label>
                  <div class="wrapper-checkbox d-flex gap-2 flex-wrap">
                    <div class="checkbox d-flex align-items-center gap-2 me-2" v-for="(instructor, index) in instructorStore.instructorAll" :key="index">
                      <input type="checkbox" :id="instructor.id" :value="instructor.id" v-model="instructors" disabled>
                      <label class="mb-0" :for="instructor.id">{{instructor.name}}</label>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="input-group d-flex flex-column">
                  <label>Mandatory Luggage</label>
                  <div class="wrapper-checkbox d-flex gap-2 flex-wrap">
                    <div class="checkbox d-flex align-items-center gap-2 me-2" v-for="(luggage, index) in luggageStore.luggageAll" :key="index">
                      <input type="checkbox" :id="luggage.id" :value="luggage.id" v-model="mandatory_luggages" disabled>
                      <label class="mb-0" :for="luggage.id">{{luggage.name}}</label>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-12">
                <div class="button-group d-flex gap-2">
                  <NuxtLink :to="{path: '/dashboard/entertainment-service'}" class="button-reverse">Back to Page</NuxtLink>
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