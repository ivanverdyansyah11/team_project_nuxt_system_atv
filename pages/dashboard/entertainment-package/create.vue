<script setup lang="ts">
import { useBundleStore } from "~/stores/bundle";
import { useServiceStore } from "~/stores/service";
import { useField, useForm } from 'vee-validate';
import * as yup from 'yup';
import { navigateTo } from "nuxt/app";
import Cookies from "js-cookie";
import { onMounted, ref } from 'vue';

definePageMeta({
  title: 'Create Package Page',
  layout: 'dashboard'
});

const bundleStore = useBundleStore();
const serviceStore = useServiceStore();
const createDataImage = ref('https://placehold.co/600x400?text=Image+Not+Found');
const file = ref(null);

const schema = yup.object({
  name: yup.string().required('Name is required'),
  description: yup.string().required('Description is required'),
  price: yup.number().required('Price is required'),
  expired_at: yup.date().required('Expired is required'),
  services: yup.array().min(1, 'At least one service is required'),
  image: yup.mixed().required('Image is required'),
});

const { handleSubmit, resetForm, setValues } = useForm({
  validationSchema: schema,
});

const { value: name, errorMessage: nameError } = useField('name');
const { value: description, errorMessage: descriptionError } = useField('description');
const { value: price, errorMessage: priceError } = useField('price');
const { value: expired_at, errorMessage: expiredAtError } = useField('expired_at');
const { value: image, errorMessage: imageError } = useField('image');
const services = ref([]);
const servicesError = ref('');

const previewImage = (e: any) => {
  file.value = e.target.files[0];
  image.value = file.value;
  if (!file.value) return;
  const reader = new FileReader();
  reader.onload = () => {
    if (typeof reader.result === "string") {
      createDataImage.value = reader.result;
    }
    e.target.value = "";
  };
  reader.readAsDataURL(file.value);
};

const createBundle = handleSubmit(async (values) => {
  values.services = services.value.map(entertainment_service_id => ({ entertainment_service_id }));
  const { image, ...valueData } = values;

  try {
    valueData.expired_at = valueData.expired_at + ':00Z'
    await bundleStore.createBundle(valueData);

    if (bundleStore.status_code === 200 && file.value) {
      await bundleStore.getAllBundleWithoutPagination();
      const formData = new FormData();
      formData.append('image', file.value);
      await bundleStore.saveImageBundle(formData, bundleStore.bundleAll[0].id);

      Cookies.set('alert-message', 'Successfully create new package');
      Cookies.set('alert-page', 'Package');
      navigateTo('/dashboard/entertainment-package');
    } else {
      console.error('Failed to create bundle', bundleStore.status_code);
    }
  } catch (error) {
    console.error('Error creating bundle:', error);
  }
});

onMounted(async () => {
  await serviceStore.getAllServiceWithoutPagination();
});
</script>

<template>
  <div class="content container mt-4">
    <div class="row">
      <div class="col-12">
        <div class="card-default">
          <form @submit.prevent="createBundle" class="form w-100">
            <div class="row g-3">
              <div class="col-12 d-flex gap-3 align-items-end">
                <div class="wrapper d-flex flex-column">
                  <label for="image" class="form-label">Package Image</label>
                  <img :src="createDataImage" class="input-image" alt="Package Image" style="border-radius: 4px;"/>
                </div>
                <div class="wrapper">
                  <input type="file" id="image" class="input-hide" @change="previewImage" />
                  <label for="image" class="button-reverse w-100 text-center mt-3">Choose Image</label>
                  <p class="invalid-label">{{ imageError }}</p>
                </div>
              </div>
              <div class="col-12">
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
              <div class="col-md-6">
                <div class="input-group d-flex flex-column">
                  <label for="expired_at">Expired Date</label>
                  <input type="datetime-local" class="input w-100" name="expired_at" id="expired_at"
                         placeholder="Enter your expired date.." autocomplete="off" v-model="expired_at">
                  <p v-if="expiredAtError" class="invalid-label">{{ expiredAtError }}</p>
                </div>
              </div>
              <div class="col-12">
                <div class="input-group d-flex flex-column">
                  <label>Services</label>
                  <div class="wrapper-checkbox d-flex gap-2 flex-wrap">
                    <div class="checkbox d-flex align-items-center gap-2 me-2" v-for="(service, index) in serviceStore.serviceAll" :key="index">
                      <input type="checkbox" :id="service.id" :value="service.id" v-model="services">
                      <label class="mb-0" :for="service.id">{{service.name}}</label>
                    </div>
                  </div>
                  <p v-if="servicesError" class="invalid-label">{{ servicesError }}</p>
                </div>
              </div>
              <div class="col-12">
                <div class="input-group d-flex flex-column">
                  <label for="description">Description</label>
                  <textarea class="input w-100" name="description" id="description"
                            placeholder="Enter your description.." autocomplete="off" v-model="description" rows="4"></textarea>
                  <p v-if="descriptionError" class="invalid-label">{{ descriptionError }}</p>
                </div>
              </div>
              <div class="col-12">
                <div class="button-group d-flex gap-2">
                  <button type="submit" class="button-primary-small">Add New Package</button>
                  <NuxtLink :to="{path: '/dashboard/entertainment-package'}" class="button-reverse">Cancel Add</NuxtLink>
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