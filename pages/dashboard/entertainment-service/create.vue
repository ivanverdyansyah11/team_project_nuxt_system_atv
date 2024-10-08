<script setup lang="ts">
import {useServiceStore} from "~/stores/service"
import {useCategoryStore} from "~/stores/category"
import {useRouteStore} from "~/stores/route"
import {useFacilityStore} from "~/stores/facility"
import {useInstructorStore} from "~/stores/instructor"
import {useLuggageStore} from "~/stores/luggage"
import {useField, useForm} from 'vee-validate'
import {navigateTo} from "nuxt/app"
import {onMounted, ref} from 'vue'
import Cookies from "js-cookie"
import * as yup from 'yup'

definePageMeta({
  title: 'Create Service Page',
  layout: 'dashboard'
})

const serviceStore = useServiceStore()
const categoryStore = useCategoryStore()
const routeStore = useRouteStore()
const facilityStore = useFacilityStore()
const instructorStore = useInstructorStore()
const luggageStore = useLuggageStore()
const createDataImage = ref('https://placehold.co/600x400?text=Image+Not+Found')
const file = ref(null)

const schema = yup.object({
  name: yup.string().required('Name is required'),
  price: yup.number().required('Price is required'),
  duration: yup.number().required('Duration is required'),
  description: yup.string().required('Description is required'),
  entertainment_category_id: yup.string().required('Entertainment Category is required'),
  routes: yup.array().min(1, 'At least one route is required'),
  facilities: yup.array().min(1, 'At least one facility is required'),
  instructors: yup.array().min(1, 'At least one instructor is required'),
  mandatory_luggages: yup.array().min(1, 'At least one mandatory luggage is required'),
  image: yup.mixed().required('Image is required'),
})

const { handleSubmit } = useForm({
  validationSchema: schema,
})

const { value: name, errorMessage: nameError } = useField('name')
const { value: price, errorMessage: priceError } = useField('price')
const { value: duration, errorMessage: durationError } = useField('duration')
const { value: description, errorMessage: descriptionError } = useField('description')
const { value: entertainment_category_id, errorMessage: entertainmentCategoryIdError } = useField('entertainment_category_id')
const { value: image, errorMessage: imageError } = useField('image')
const routes = ref([])
const routesError = ref()
const facilities = ref([])
const facilitiesError = ref()
const instructors = ref([])
const instructorsError = ref()
const mandatory_luggages = ref([])
const mandatoryLuggagesError = ref()

const previewImage = (e: any) => {
  file.value = e.target.files[0]
  image.value = file.value
  if (!file.value) return
  const reader = new FileReader()
  reader.onload = () => {
    if (typeof reader.result === "string") {
      createDataImage.value = reader.result
    }
    e.target.value = ""
  }
  reader.readAsDataURL(file.value)
}

const createService = handleSubmit(async (values) => {
  if (routes.value.length !== 0 && facilities.value.length !== 0 && instructors.value.length !== 0 && mandatory_luggages.value.length !== 0) {
    values.routes = routes.value.map(route_id => ({ route_id }))
    values.facilities = facilities.value.map(facility_id => ({ facility_id }))
    values.instructors = instructors.value.map(instructor_id => ({ instructor_id }))
    values.mandatory_luggages = mandatory_luggages.value.map(mandatory_luggage_id => ({ mandatory_luggage_id }))
    const { image, ...valueData } = values
    await serviceStore.createService(valueData)
    if (serviceStore.status_code === 201 && file.value) {
      const formData = new FormData()
      formData.append('image', file.value)
      await serviceStore.saveImageService(formData, serviceStore.serviceAll[0].id)
      if (serviceStore.status_code === 200) {
        Cookies.set('alert-message', 'Successfully create new entertainment service')
        Cookies.set('alert-type', 'true')
        Cookies.set('alert-page', 'Service')
        navigateTo('/dashboard/entertainment-service')
      } else {
        navigateTo('/dashboard/entertainment-service')
      }
    } else {
      navigateTo('/dashboard/entertainment-service')
    }
  } else {
    routes.value.length === 0 ? routesError.value = 'Route is required' : routesError.value = ''
    facilities.value.length === 0 ? facilitiesError.value = 'Facility is required' : facilitiesError.value = ''
    instructors.value.length === 0 ? instructorsError.value = 'Instructor is required' : instructorsError.value = ''
    mandatory_luggages.value.length === 0 ? mandatoryLuggagesError.value = 'Mandatory luggage is required' : mandatoryLuggagesError.value = ''
  }
})

onMounted(async () => {
  await categoryStore.getAllCategoryWithoutPaginate()
  await routeStore.getAllRouteWithoutPaginate()
  await facilityStore.getAllFacilityWithoutPaginate()
  await instructorStore.getAllInstructorWithoutPaginate()
  await luggageStore.getAllLuggageWithoutPaginate()
})
</script>

<template>
  <div class="content container mt-4">
    <div class="row">
      <div class="col-12">
        <div class="card-default">
          <form @submit.prevent="createService" class="form w-100">
            <div class="row g-3">
              <div class="col-12 d-flex gap-3 align-items-end">
                <div class="wrapper d-flex flex-column">
                  <label for="image" class="form-label">Service Image</label>
                  <img :src="createDataImage" class="input-image" alt="Package Image" style="border-radius: 4px;"/>
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
              <div class="col-md-6">
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
                  <label for="duration">Duration</label>
                  <input type="number" class="input w-100" name="duration" id="duration"
                         placeholder="Enter your duration.." autocomplete="off" v-model="duration">
                  <p v-if="durationError" class="invalid-label">{{ durationError }}</p>
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
                <div class="input-group d-flex flex-column">
                  <label for="description">Description</label>
                  <textarea class="input w-100" name="description" id="description"
                            placeholder="Enter your description.." autocomplete="off" v-model="description" rows="4"></textarea>
                  <p v-if="descriptionError" class="invalid-label">{{ descriptionError }}</p>
                </div>
              </div>
              <div class="col-12">
                <div class="button-group d-flex gap-2">
                  <button type="submit" class="button-primary-small">Add New Service</button>
                  <NuxtLink :to="{path: '/dashboard/entertainment-service'}" class="button-reverse">Cancel Add</NuxtLink>
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