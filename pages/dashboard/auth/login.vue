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
  email: yup.string().email().required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

const { handleSubmit, resetForm } = useForm({
  validationSchema: schema,
});

const { value: email, errorMessage: emailError } = useField('email');
const { value: password, errorMessage: passwordError } = useField('password');

const authenticate = handleSubmit( async (values) => {
  await authStore.login(values);
  if (authStore.status_code === 200) {
    navigateTo('/dashboard')
  }
});

let alertMessage = useCookie('alert-message')
let alertPage = useCookie('alert-page')

onBeforeRouteLeave((to, from, next) => {
  Cookies.remove('alert-message');
  Cookies.remove('alert-page');
  next();
});

onBeforeRouteUpdate((to, from, next) => {
  Cookies.remove('alert-message');
  Cookies.remove('alert-page');
  next();
});
</script>

<template>
  <div class="row justify-content-center login">
    <div class="col-12">
      <div class="topbar-login d-flex align-items-center justify-content-start">
        <div class="container">
          <img src="../../../assets/image/brand/brand-logo.svg" alt="Brand Logo" height="52">
        </div>
      </div>
    </div>
    <div class="col-md-6 col-lg-4 col-xxl-3 mt-5">
      <div class="container">
        <div class="card-login d-flex flex-column align-items-center">
          <div v-if="alertPage == 'Logout'" class="alert alert-success w-100" role="alert">
            {{ alertMessage }}
          </div>
          <div v-if="alertPage == 'Register'" class="alert alert-success w-100" role="alert">
            {{ alertMessage }}
          </div>
          <h2 class="title w-100">Login 👋🏻</h2>
          <p class="w-100">Log in to your account to access all our features and services.</p>
          <form @submit.prevent="authenticate" class="form d-flex flex-column gap-3 w-100">
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
            <button type="submit" class="button-primary">Login Account</button>
            <p class="text-redirect mt-2 text-center">Don't have an account yet? <NuxtLink to="/dashboard/auth/register">Register</NuxtLink></p>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>