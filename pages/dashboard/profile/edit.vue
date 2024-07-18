<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";
import { ref, onMounted } from 'vue';
import { useField, useForm } from 'vee-validate'
import * as yup from 'yup'
import Cookies from "js-cookie";
import { navigateTo } from "nuxt/app";

definePageMeta({
  title: 'Edit Profile Page',
  layout: 'dashboard'
});

const authStore = useAuthStore();
const updateDataImage = ref('https://placehold.co/600x400?text=Image+Not+Found');
const file = ref<File | null>(null);

const schema = yup.object({
  name: yup.string().required('Name is required'),
  username: yup.string().required('Username is required'),
  email: yup.string().email().required('Email is required'),
  password: yup.string(),
  image: yup.mixed().required('Image is required'),
});

const { handleSubmit, resetForm, setValues } = useForm({
  validationSchema: schema,
});

const { value: name, errorMessage: nameError } = useField('name');
const { value: username, errorMessage: usernameError } = useField('username');
const { value: email, errorMessage: emailError } = useField('email');
const { value: password, errorMessage: passwordError } = useField('password');
const { value: image, errorMessage: imageError } = useField('image');

const loadProfile = async () => {
  try {
    await authStore.checkProfile();
    const profilePath = authStore?.user?.user?.profile_path;
    if (profilePath) {
      updateDataImage.value = `http://localhost:8000/${profilePath}`;
    } else {
      updateDataImage.value = 'https://placehold.co/600x400?text=Image+Not+Found';
    }
    setValues({
      name: authStore.user.name,
      username: authStore.user.user.username,
      email: authStore.user.user.email,
      password: '',
      image: updateDataImage.value,
    });
  } catch (error) {
    console.error('Error loading profile:', error);
  }
};

const previewImage = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    file.value = target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        updateDataImage.value = reader.result;
      }
      target.value = "";
    };
    reader.readAsDataURL(file.value);
  }
};

const updateProfile = handleSubmit(async (values) => {
  const { image, ...valueData } = values;
  try {
    await authStore.updateProfile(valueData);
    if (authStore.status_code === 200) {
      if (file.value) {
        const formData = new FormData();
        formData.append('image', file.value);
        await authStore.saveImageProfile(formData);
      }
      await loadProfile();
      Cookies.set('alert-message', 'Successfully updated profile');
      Cookies.set('alert-page', 'Profile');
      navigateTo('/dashboard/profile');
    } else {
      console.error('Failed to update profile:', authStore.status_code);
    }
  } catch (error) {
    console.error('Error updating profile:', error);
  }
});

onMounted(async () => {
  await loadProfile();
});
</script>

<template>
  <div class="content container mt-4">
    <div class="row">
      <div class="col-12">
        <div class="card-default">
          <form @submit.prevent="updateProfile" class="form d-flex flex-column gap-3 w-100">
            <div class="row g-3">
              <div class="col-md-3">
                <div class="input-group d-flex flex-column w-100 pe-xl-4">
                  <label for="image">
                    Profile Image
                    <div class="wrapper d-flex flex-column align-items-end w-100" style="margin-top: 8px;">
                      <img :src="updateDataImage" class="input-image input-image-full" alt="Profile Image" style="border-radius: 4px;"/>
                      <input type="file" id="image" class="input-hide" @change="previewImage" />
                      <label for="image" class="button-reverse w-100 text-center mt-3">Choose Image</label>
                    </div>
                  </label>
                  <p class="invalid-label">{{ imageError }}</p>
                </div>
              </div>
              <div class="col-md-9">
                <div class="row g-3">
                  <div class="col-12">
                    <div class="input-group d-flex flex-column">
                      <label for="name">Name</label>
                      <input type="text" class="input w-100" name="name" id="name"
                             placeholder="Enter your name.." autocomplete="off" v-model="name">
                      <p v-if="nameError" class="invalid-label">{{ nameError }}</p>
                    </div>
                  </div>
                  <div class="col-12">
                    <div class="input-group d-flex flex-column">
                      <label for="username">Username</label>
                      <input type="text" class="input w-100" name="username" id="username"
                             placeholder="Enter your username.." autocomplete="off" v-model="username">
                      <p v-if="usernameError" class="invalid-label">{{ usernameError }}</p>
                    </div>
                  </div>
                  <div class="col-12">
                    <div class="input-group d-flex flex-column">
                      <label for="email">Email</label>
                      <input type="email" class="input w-100" name="email" id="email"
                             placeholder="Enter your email.." autocomplete="off" v-model="email">
                      <p v-if="emailError" class="invalid-label">{{ emailError }}</p>
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
                  <div class="col-12">
                    <div class="button-group d-flex gap-2">
                      <button type="submit" class="button-primary-small">Save Changes</button>
                      <NuxtLink :to="{path: '/dashboard/profile'}" class="button-reverse">Cancel Edit</NuxtLink>
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