<script setup lang="ts">
import { useInstructorStore } from "~/stores/instructor";
import { useField, useForm } from 'vee-validate'
import { generateRandomCode } from "~/helpers/GenerateRandomCode";
import * as yup from 'yup'
import { navigateTo } from "nuxt/app"
import Cookies from "js-cookie";

definePageMeta({
  title: 'Create Instructor Page',
  layout: 'dashboard'
})

const instructorStore = useInstructorStore();
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

const createInstructor = handleSubmit( async (values) => {
  values.employee_code = generateRandomCode(4);
  await instructorStore.createInstructor(values);
  if (instructorStore.status_code === 200) {
    Cookies.set('alert-message', 'Successfully create new instructor');
    Cookies.set('alert-page', 'Instructor');
    navigateTo('/dashboard/instructor')
  }
});
</script>

<template>
  <div class="content container mt-4">
    <div class="row">
      <div class="col-12">
        <div class="card-default">
          <form @submit.prevent="createInstructor" class="form w-100">
            <div class="row g-3">
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
                  <label for="username">Username</label>
                  <input type="text" class="input w-100" name="username" id="username"
                         placeholder="Enter your username.." autocomplete="off" v-model="username">
                  <p v-if="usernameError" class="invalid-label">{{ usernameError }}</p>
                </div>
              </div>
              <div class="col-md-6">
                <div class="input-group d-flex flex-column">
                  <label for="email">Email</label>
                  <input type="email" class="input w-100" name="email" id="email"
                         placeholder="Enter your email.." autocomplete="off" v-model="email">
                  <p v-if="emailError" class="invalid-label">{{ emailError }}</p>
                </div>
              </div>
              <div class="col-md-6">
                <div class="input-group d-flex flex-column">
                  <label for="password">Password</label>
                  <input type="password" class="input w-100" name="password" id="password"
                         placeholder="Enter your password.." autocomplete="off" v-model="password">
                  <p v-if="passwordError" class="invalid-label">{{ passwordError }}</p>
                </div>
              </div>
              <div class="col-12">
                <div class="button-group d-flex gap-2">
                  <button type="submit" class="button-primary-small">Add New Instructor</button>
                  <NuxtLink :to="{path: '/dashboard/instructor'}" class="button-reverse">Cancel Add</NuxtLink>
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