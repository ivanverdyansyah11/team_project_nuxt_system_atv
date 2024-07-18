<script setup lang="ts">
import { useServiceStore } from "~/stores/service";
import { useCategoryStore } from "~/stores/category";
import { useRouteStore } from "~/stores/route";
import { useFacilityStore } from "~/stores/facility";
import { useInstructorStore } from "~/stores/instructor";
import { useLuggageStore } from "~/stores/luggage";
import { useRoute } from '#app';
import { ref, onMounted } from 'vue';
import { useField, useForm } from 'vee-validate'
import * as yup from 'yup'
import Cookies from "js-cookie";
import {navigateTo} from "nuxt/app";

definePageMeta({
  title: 'Edit Service Page',
  layout: 'dashboard'
})

const serviceStore = useServiceStore();
const categoryStore = useCategoryStore();
const routeStore = useRouteStore();
const facilityStore = useFacilityStore();
const instructorStore = useInstructorStore();
const luggageStore = useLuggageStore();
const route = useRoute();
const updateDataImage = ref('https://placehold.co/600x400?text=Image+Not+Found');
const file = ref(null);

const schema = yup.object({
  name: yup.string().required('Name is required'),
  price: yup.number().required('Price is required'),
  entertainment_category_id: yup.string().required('Entertainment Category is required'),
  routes: yup.array().min(1, 'At least one route is required'),
  facilities: yup.array().min(1, 'At least one facility is required'),
  instructors: yup.array().min(1, 'At least one instructor is required'),
  mandatory_luggages: yup.array().min(1, 'At least one mandatory luggage is required'),
  image: yup.mixed().required('Image is required'),
});

const { handleSubmit, resetForm, setValues } = useForm({
  validationSchema: schema,
});

const { value: name, errorMessage: nameError } = useField('name');
const { value: price, errorMessage: priceError } = useField('price');
const { value: entertainment_category_id, errorMessage: entertainmentCategoryIdError } = useField('entertainment_category_id');
const { value: image, errorMessage: imageError } = useField('image');
const routes = ref([]);
const routesError = ref('');
const facilities = ref([]);
const facilitiesError = ref('');
const instructors = ref([]);
const instructorsError = ref('');
const mandatory_luggages = ref([]);
const mandatoryLuggagesError = ref('');

const loadService = async() => {
  await serviceStore.getServiceById(route.params.id);
  updateDataImage.value = serviceStore?.service?.image_path != null ? `http://localhost:8000/${serviceStore.service.image_path}` : 'https://placehold.co/600x400?text=Image+Not+Found';
  setValues({
    name: serviceStore.service.name,
    price: serviceStore.service.price,
    entertainment_category_id: serviceStore.service.entertainment_category.id,
    image: updateDataImage.value,
  })
  routes.value = serviceStore.service?.routes.map(r => r.route.id);
  facilities.value = serviceStore.service?.facilities?.map(f => f.facility.id);
  instructors.value = serviceStore.service?.instructors?.map(i => i.instructor.id);
  mandatory_luggages.value = serviceStore.service?.mandatory_luggages?.map(m => m.mandatory_luggage.id);
}

const previewImage = (e: any) => {
  if (!e.target.files.length) return;
  file.value = e.target.files[0];
  const reader = new FileReader();
  reader.onload = () => {
    if (typeof reader.result === "string") {
      updateDataImage.value = reader.result;
    }
    e.target.value = "";
  };
  reader.readAsDataURL(file.value);
}

const updateService = handleSubmit(async (values) => {
  values.routes = routes.value.map(route_id => ({ route_id }));
  values.facilities = facilities.value.map(facility_id => ({ facility_id }));
  values.instructors = instructors.value.map(instructor_id => ({ instructor_id }));
  values.mandatory_luggages = mandatory_luggages.value.map(mandatory_luggage_id => ({ mandatory_luggage_id }));

  try {
    await serviceStore.updateService(values, route.params.id);
    if (file.value) {
      const formData = new FormData();
      formData.append('image', file.value);
      await serviceStore.saveImageService(formData, serviceStore.service.id);
    }
    Cookies.set('alert-message', 'Successfully update service');
    Cookies.set('alert-page', 'Service');
    navigateTo('/dashboard/entertainment-service');
  } catch (error) {
    console.error('Error updating service:', error);
  }
});


onMounted(async () => {
  await categoryStore.getAllCategoryWithoutPaginate();
  await routeStore.getAllRouteWithoutPaginate();
  await facilityStore.getAllFacilityWithoutPaginate();
  await instructorStore.getAllInstructorWithoutPaginate();
  await luggageStore.getAllLuggageWithoutPaginate();

  await loadService()
});
</script>

<template>
  <div class="content container mt-4">
    <div class="row">
      <div class="col-12">
        <div class="card-default">
          <form @submit.prevent="updateService" class="form w-100">
            <div class="row g-3">
              <div class="col-12 d-flex gap-3 align-items-end">
                <div class="wrapper d-flex flex-column">
                  <label for="image" class="form-label">Service Image</label>
                  <img :src="updateDataImage" class="input-image" alt="Service Image" style="border-radius: 4px;"/>
                </div>
                <div class="wrapper">
                  <input type="file" id="image" class="input-hide" @change="previewImage" />
                  <label for="image" class="button-reverse w-100 text-center mt-3">Choose Image</label>
                  <p class="invalid-label">{{ imageError }}</p>
                </div>
              </div>
              <div class="col-md-6">
                <div class="input-group d-flex flex-column">
                  <label for="name">Name</label>
                  <input type="text" class="input w-100" name="name" id="name"
                         placeholder="Enter your name.." autocomplete="off" v-model="name">
                  <p v-if="nameError" class="invalid-label">{{ nameError }}</p>
                </div>
              </div>
              <div class="col-md-6">
                <div class="input-group d-flex flex-column">
                  <label for="price">Price</label>
                  <input type="number" class="input w-100" name="price" id="price"
                         placeholder="Enter your price.." autocomplete="off" v-model="price">
                  <p v-if="priceError" class="invalid-label">{{ priceError }}</p>
                </div>
              </div>
              <div class="col-12">
                <div class="input-group d-flex flex-column">
                  <label for="entertainment_category_id">Entertainment Category</label>
                  <select class="input w-100" name="entertainment_category_id" id="entertainment_category_id" v-model="entertainment_category_id">
                    <option v-for="(category, index) in categoryStore.categoryAll" :key="index" :value="category.id">{{category.name}}</option>
                  </select>
                  <p v-if="entertainmentCategoryIdError" class="invalid-label">{{ entertainmentCategoryIdError }}</p>
                </div>
              </div>
              <div class="col-md-6">
                <div class="input-group d-flex flex-column">
                  <label>Routes</label>
                  <div class="wrapper-checkbox d-flex gap-2 flex-wrap">
                    <div class="checkbox d-flex align-items-center gap-2 me-2" v-for="(route, index) in routeStore.routeAll" :key="index">
                      <input type="checkbox" :id="route.id" :value="route.id" v-model="routes">
                      <label class="mb-0" :for="route.id">{{route.address}}</label>
                    </div>
                  </div>
                  <p v-if="routesError" class="invalid-label">{{ routesError }}</p>
                </div>
              </div>
              <div class="col-md-6">
                <div class="input-group d-flex flex-column">
                  <label>Facilities</label>
                  <div class="wrapper-checkbox d-flex gap-2 flex-wrap">
                    <div class="checkbox d-flex align-items-center gap-2 me-2" v-for="(facility, index) in facilityStore.facilityAll" :key="index">
                      <input type="checkbox" :id="facility.id" :value="facility.id" v-model="facilities">
                      <label class="mb-0" :for="facility.id">{{facility.name}}</label>
                    </div>
                  </div>
                  <p v-if="facilitiesError" class="invalid-label">{{ facilitiesError }}</p>
                </div>
              </div>
              <div class="col-md-6">
                <div class="input-group d-flex flex-column">
                  <label>Instructor</label>
                  <div class="wrapper-checkbox d-flex gap-2 flex-wrap">
                    <div class="checkbox d-flex align-items-center gap-2 me-2" v-for="(instructor, index) in instructorStore.instructorAll" :key="index">
                      <input type="checkbox" :id="instructor.id" :value="instructor.id" v-model="instructors">
                      <label class="mb-0" :for="instructor.id">{{instructor.name}}</label>
                    </div>
                  </div>
                  <p v-if="instructorsError" class="invalid-label">{{ instructorsError }}</p>
                </div>
              </div>
              <div class="col-md-6">
                <div class="input-group d-flex flex-column">
                  <label>Mandatory Luggage</label>
                  <div class="wrapper-checkbox d-flex gap-2 flex-wrap">
                    <div class="checkbox d-flex align-items-center gap-2 me-2" v-for="(luggage, index) in luggageStore.luggageAll" :key="index">
                      <input type="checkbox" :id="luggage.id" :value="luggage.id" v-model="mandatory_luggages">
                      <label class="mb-0" :for="luggage.id">{{luggage.name}}</label>
                    </div>
                  </div>
                  <p v-if="mandatoryLuggagesError" class="invalid-label">{{ mandatoryLuggagesError }}</p>
                </div>
              </div>
              <div class="col-12">
                <div class="button-group d-flex gap-2">
                  <button type="submit" class="button-primary-small">Save Changes</button>
                  <NuxtLink :to="{path: '/dashboard/entertainment-service'}" class="button-reverse">Cancel Edit</NuxtLink>
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