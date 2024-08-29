<script setup lang="ts">
import {useAuthStore} from '~/stores/auth'
import {getAlert, alertMessage, alertType, alertPage} from "~/helpers/Alert"
import Cookies from "js-cookie"

definePageMeta({
  layout: 'profile',
})

const authStore = useAuthStore()

getAlert()

onBeforeRouteLeave((to, from, next) => {
  Cookies.remove('alert-message')
  Cookies.remove('alert-type')
  Cookies.remove('alert-page')
  next()
})

onBeforeRouteUpdate((to, from, next) => {
  Cookies.remove('alert-message')
  Cookies.remove('alert-type')
  Cookies.remove('alert-page')
  next()
})
</script>

<template>
  <form class="form w-100">
    <div class="row g-3">
      <div v-if="alertPage == 'Profile'" class="col-12">
        <div class="alert w-100 mb-0" :class="alertType != false ? 'alert-success' : 'alert-danger'" role="alert">
          {{ alertMessage }}
        </div>
      </div>
      <div class="col-md-6">
        <div class="input-group d-flex flex-column">
          <label for="name">Name</label>
          <input type="text" class="input w-100" name="name" id="name"
                 readonly v-model="authStore.user.name">
        </div>
      </div>
      <div class="col-md-6">
        <div class="input-group d-flex flex-column">
          <label for="username">Username</label>
          <input type="text" class="input w-100" name="username" id="username"
                 readonly v-model="authStore.user.user.username">
        </div>
      </div>
      <div class="col-md-6">
        <div class="input-group d-flex flex-column">
          <label for="email">Email</label>
          <input type="email" class="input w-100" name="email" id="email"
                 readonly v-model="authStore.user.user.email">
        </div>
      </div>
      <div class="col-md-6">
        <div class="input-group d-flex flex-column">
          <label for="phone_number">Phone Number</label>
          <input type="text" class="input w-100" name="phone_number" id="phone_number"
                 readonly v-model="authStore.user.phone_number">
        </div>
      </div>
      <div class="col-12">
        <NuxtLink :to="{path: '/homepage/profile/edit'}" class="button-primary-small w-100 text-center d-lg-none">Edit Profile</NuxtLink>
      </div>
    </div>
  </form>
</template>

<style scoped>
</style>