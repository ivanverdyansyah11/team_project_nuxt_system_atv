<script setup lang="ts">
import {useAuthStore} from '~/stores/auth'
import {ref, onMounted} from 'vue'
import {useField, useForm} from 'vee-validate'
import {navigateTo} from "nuxt/app"
import * as yup from 'yup'
import Cookies from "js-cookie"
import profileNotFound from '~/assets/image/profile/profile-not-found.svg'

definePageMeta({
  layout: 'profile',
})

const authStore = useAuthStore()
const dataImage = ref()
const file = ref(null)

const schema = yup.object({
  name: yup.string().required('Name is required'),
  username: yup.string().required('Username is required'),
  phone_number: yup.string().required('Phone number is required'),
  email: yup.string().email().required('Email is required'),
  password: yup.string(),
  image: yup.mixed().required('Image is required'),
})

const { handleSubmit, setValues } = useForm({
  validationSchema: schema,
})

const { value: name, errorMessage: nameError } = useField('name')
const { value: username, errorMessage: usernameError } = useField('username')
const { value: phone_number, errorMessage: phoneNumberError } = useField('phone_number')
const { value: email, errorMessage: emailError } = useField('email')
const { value: password, errorMessage: passwordError } = useField('password')
const { value: image, errorMessage: imageError } = useField('image')

const loadProfile = async () => {
  try {
    await authStore.checkProfile()
    setValues({
      name: authStore.user.name,
      username: authStore.user.user.username,
      phone_number: authStore.user.phone_number,
      email: authStore.user.user.email,
      password: '',
      image: authStore.user.user.profile_path !== null ? `http://localhost:8000/${authStore.user.user.profile_path}` : profileNotFound,
    })
    dataImage.value = authStore.user.user.profile_path !== null ? `http://localhost:8000/${authStore.user.user.profile_path}` : profileNotFound
  } catch (error) {
    navigateTo('/homepage/profile')
  }
}

const previewImage = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files && target.files[0]) {
    file.value = target.files[0]
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === "string") {
        dataImage.value = reader.result
      }
      target.value = ""
    }
    reader.readAsDataURL(file.value)
  }
}

const updateProfile = handleSubmit(async (values) => {
  const { image, ...valueData } = values
  try {
    await authStore.updateProfile(valueData)
    if (authStore.status_code === 200) {
      if (file.value) {
        const formData = new FormData()
        formData.append('image', file.value)
        await authStore.saveImageProfile(formData)
      }
      await loadProfile()
      Cookies.set('alert-message', 'Successfully updated profile')
      Cookies.set('alert-type', 'true')
      Cookies.set('alert-page', 'Profile')
      navigateTo('/homepage/profile')
    } else {
      navigateTo('/homepage/profile')
    }
  } catch (error) {
    navigateTo('/homepage/profile')
  }
})

onMounted(async () => {
  await loadProfile()
})
</script>

<template>
  <form @submit.prevent="updateProfile" class="form w-100">
    <div class="row g-3">
      <div class="col-12 d-flex gap-3 align-items-end">
        <div class="wrapper d-flex flex-column">
          <label for="image" class="form-label">Profile Image</label>
          <img :src="dataImage" class="input-image" alt="Service Image" style="border-radius: 4px;"/>
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
                 v-model="name">
          <p v-if="nameError" class="invalid-label">{{ nameError }}</p>
        </div>
      </div>
      <div class="col-md-6">
        <div class="input-group d-flex flex-column">
          <label for="username">Username</label>
          <input type="text" class="input w-100" name="username" id="username"
                 v-model="username">
          <p v-if="usernameError" class="invalid-label">{{ usernameError }}</p>
        </div>
      </div>
      <div class="col-md-6">
        <div class="input-group d-flex flex-column">
          <label for="email">Email</label>
          <input type="email" class="input w-100" name="email" id="email"
                 v-model="email">
          <p v-if="emailError" class="invalid-label">{{ emailError }}</p>
        </div>
      </div>
      <div class="col-md-6">
        <div class="input-group d-flex flex-column">
          <label for="phone_number">Phone Number</label>
          <input type="text" class="input w-100" name="phone_number" id="phone_number"
                 v-model="phone_number">
          <p v-if="phoneNumberError" class="invalid-label">{{ phoneNumberError }}</p>
        </div>
      </div>
      <div class="col-12">
        <div class="input-group d-flex flex-column">
          <label for="password">Password</label>
          <input type="password" class="input w-100" name="password" id="password"
                 placeholder="Enter your password.." autocomplete="off" v-model="password">
          <p v-if="passwordError" class="invalid-label">{{ passwordError }}</p>
        </div>
      </div>
      <div class="col-12 d-flex gap-2 align-items-center">
        <button type="submit" class="button-primary-small">Save Changes</button>
        <NuxtLink :to="{path: '/homepage/profile'}" class="button-reverse">Cancel Edit</NuxtLink>
      </div>
    </div>
  </form>
</template>

<style scoped>
</style>