<script setup lang="ts">
import { useAuthStore } from "~/stores/auth"
import { ref, onMounted } from 'vue'
import {getAlert, alertMessage, alertType, alertPage} from "~/helpers/Alert"
import profileNotFound from '~/assets/image/profile/profile-not-found.svg'
import Cookies from "js-cookie"

definePageMeta({
  title: 'Profile Page',
  layout: 'dashboard'
})

const authStore = useAuthStore()
const updateDataImage = ref()

const loadProfile = async () => {
  try {
    await authStore.checkProfile();
    const profilePath = authStore.user.user.profile_path;
    if (profilePath) {
      updateDataImage.value = `http://localhost:8000/${profilePath}`;
    } else {
      updateDataImage.value = profileNotFound;
    }
  } catch (error) {
    Cookies.set('alert-message', 'Failed to load profile')
    Cookies.set('alert-type', 'false')
    Cookies.set('alert-page', 'Profile')
  }
}

onMounted(async () => {
  await loadProfile()
  getAlert()
})

onBeforeRouteLeave(() => {
  Cookies.remove('alert-message')
  Cookies.remove('alert-type')
  Cookies.remove('alert-page')
})

onBeforeRouteUpdate(() => {
  Cookies.remove('alert-message')
  Cookies.remove('alert-type')
  Cookies.remove('alert-page')
})
</script>

<template>
  <div class="content container mt-4">
    <div class="row">
      <div class="col-12">
        <div v-if="alertPage == 'Profile'" class="alert w-100" :class="alertType != false ? 'alert-success' : 'alert-danger'" role="alert">
          {{ alertMessage }}
        </div>
      </div>
      <div class="col-12">
        <div class="card-default">
          <form class="form d-flex flex-column gap-3 w-100">
            <div class="row g-3">
              <div class="col-md-3">
                <div class="input-group d-flex flex-column w-100 pe-xl-4">
                  <label for="image" class="w-100">
                    Profile Image
                    <div class="wrapper d-flex flex-column align-items-end w-100" style="margin-top: 8px;">
                      <img :src="updateDataImage" class="input-image input-image-full" alt="Profile Image" style="border-radius: 4px;"/>
                    </div>
                  </label>
                </div>
              </div>
              <div class="col-md-9">
                <div class="row g-3">
                  <div class="col-12">
                    <div class="input-group d-flex flex-column">
                      <label for="name">Name</label>
                      <input type="text" class="input w-100" name="name" id="name"
                             readonly v-model="authStore.user.name">
                    </div>
                  </div>
                  <div class="col-12">
                    <div class="input-group d-flex flex-column">
                      <label for="username">Username</label>
                      <input type="text" class="input w-100" name="username" id="username"
                             readonly v-model="authStore.user.user.username">
                    </div>
                  </div>
                  <div class="col-12">
                    <div class="input-group d-flex flex-column">
                      <label for="email">Email</label>
                      <input type="email" class="input w-100" name="email" id="email"
                             readonly v-model="authStore.user.user.email">
                    </div>
                  </div>
                  <div class="col-12">
                    <div class="button-group d-flex gap-2">
                      <NuxtLink :to="{path: '/dashboard/profile/edit'}" class="button-primary-small">Edit Profile</NuxtLink>
                    </div>
                  </div>
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