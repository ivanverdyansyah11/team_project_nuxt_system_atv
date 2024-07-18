<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";
import { ref, onMounted } from 'vue';
import Cookies from "js-cookie";

definePageMeta({
  title: 'Profile Page',
  layout: 'dashboard'
});

const authStore = useAuthStore();
const updateDataImage = ref('https://placehold.co/600x400?text=Image+Not+Found');
let alertMessage = useCookie('alert-message');
let alertPage = useCookie('alert-page');

const loadProfile = async () => {
  try {
    await authStore.checkProfile();
    const profilePath = authStore?.user?.user?.profile_path;
    if (profilePath) {
      updateDataImage.value = `http://localhost:8000/${profilePath}`;
    } else {
      updateDataImage.value = 'https://placehold.co/600x400?text=Image+Not+Found';
    }
  } catch (error) {
    console.error('Error loading profile:', error);
  }
};

onMounted(async () => {
  await loadProfile();
});

onBeforeRouteLeave(() => {
  Cookies.remove('alert-message');
  Cookies.remove('alert-page');
});

onBeforeRouteUpdate(() => {
  Cookies.remove('alert-message');
  Cookies.remove('alert-page');
});
</script>

<template>
  <div class="content container mt-4">
    <div class="row">
      <div class="col-12">
        <div v-if="alertPage == 'Profile'" class="alert alert-success w-100" role="alert">
          {{ alertMessage }}
        </div>
      </div>
      <div class="col-12">
        <div class="card-default">
          <form class="form d-flex flex-column gap-3 w-100">
            <div class="row g-3">
              <div class="col-md-3">
                <div class="input-group d-flex flex-column w-100 pe-xl-4">
                  <label for="image">
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