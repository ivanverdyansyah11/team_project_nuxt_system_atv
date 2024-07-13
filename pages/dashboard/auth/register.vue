<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useField, useForm } from 'vee-validate'
import * as yup from 'yup'
import { navigateTo } from "nuxt/app"
import Cookies from "js-cookie";

definePageMeta({
  title: 'Login Page',
  layout: 'auth',
})

const authStore = useAuthStore();
const schema = yup.object({
  name: yup.string().required('Name is required'),
  username: yup.string().required('Username is required'),
  email: yup.string().email().required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

const { handleSubmit, resetForm } = useForm({
  validationSchema: schema,
});

const { value: name, errorMessage: nameError } = useField('name');
const { value: username, errorMessage: usernameError } = useField('username');
const { value: email, errorMessage: emailError } = useField('email');
const { value: password, errorMessage: passwordError } = useField('password');

const registered = handleSubmit( async (values) => {
  await authStore.register(values);
  if (authStore.status_code === 200) {
    Cookies.set('alert-message', 'Successfully register account');
    Cookies.set('alert-page', 'Register');
    navigateTo('/dashboard/auth/login')
  }
});
</script>


<template>
  <div class="row justify-content-center login">
    <div class="col-12">
      <div class="topbar-login d-flex align-items-center justify-content-start">
        <div class="container">
          <img src="../../../assets/image/brand/brand-logo.svg" alt="Brand Logo" style="height: 72px !important;">
        </div>
      </div>
    </div>
    <div class="col-md-6 col-lg-4 col-xxl-3 mt-4">
      <div class="container">
        <div class="card-login d-flex flex-column align-items-center">
          <h2 class="title w-100">Register 👋🏻</h2>
          <p class="w-100">Register to your account to access all our features and services.</p>
          <form @submit.prevent="registered" class="form d-flex flex-column gap-3 w-100">
            <div class="input-group d-flex flex-column">
              <label for="name">Name</label>
              <input type="text" class="input w-100" name="name" id="name"
                     placeholder="Enter your name.." autocomplete="off" v-model="name">
              <p v-if="nameError" class="invalid-label">{{ nameError }}</p>
            </div>
            <div class="input-group d-flex flex-column">
              <label for="username">Username</label>
              <input type="text" class="input w-100" name="username" id="username"
                     placeholder="Enter your username.." autocomplete="off" v-model="username">
              <p v-if="usernameError" class="invalid-label">{{ usernameError }}</p>
            </div>
            <div class="input-group d-flex flex-column">
              <label for="email">Email</label>
              <input type="email" class="input w-100" name="email" id="email"
                     placeholder="Enter your email.." autocomplete="off" v-model="email">
              <p v-if="emailError" class="invalid-label">{{ emailError }}</p>
            </div>
            <div class="input-group d-flex flex-column">
              <label for="password">Password</label>
              <input type="password" class="input w-100" name="password" id="password"
                     placeholder="Enter your password.." autocomplete="off" v-model="password">
              <p v-if="passwordError" class="invalid-label">{{ passwordError }}</p>
            </div>
            <button type="submit" class="button-primary">Register Account</button>
            <p class="text-redirect mt-2 text-center">Already have an account yet? <NuxtLink to="/dashboard/auth/login">Login</NuxtLink></p>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
section.register {
  padding-top: 120px;
  width: 100%;
  min-height: 100vh;
  height: fit-content;
}

section.register .card-auth {
  padding: 24px;
  border: 1px solid rgba(var(--dark-color), 0.12);
  border-radius: 4px;
}

section.register .auth-title {
  font-family: var(--urbanist-semibold);
  margin-bottom: 12px;
}

section.register .text-redirect {
  font-size: 0.913rem;
  color: rgba(var(--dark-color), 0.52);
}

section.register .text-redirect a {
  color: rgba(var(--dark-color), 1);
}

section.register .text-redirect a:hover {
  text-decoration: underline;
}
</style>