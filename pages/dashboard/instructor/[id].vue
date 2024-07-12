<script setup lang="ts">
import { useInstructorStore } from "~/stores/instructor";
import { useRoute } from '#app';

definePageMeta({
  title: 'Detail Instructor Page',
  layout: 'dashboard'
})

const instructorStore = useInstructorStore();
const route = useRoute();
await instructorStore.getInstructorById(route.params.id)
</script>

<template>
  <div class="content container mt-4">
    <div class="row">
      <div class="col-12">
        <div class="card-default">
          <form class="form w-100">
            <div class="row g-3">
              <div class="col-md-6">
                <div class="input-group d-flex flex-column">
                  <label for="name">Name</label>
                  <input type="text" class="input w-100" name="name" id="name"
                         placeholder="Enter your name.." autocomplete="off" v-model="instructorStore.instructor.name" readonly>
                </div>
              </div>
              <div class="col-md-6">
                <div class="input-group d-flex flex-column">
                  <label for="username">Username</label>
                  <input type="text" class="input w-100" name="username" id="username"
                         placeholder="Enter your username.." autocomplete="off" v-model="instructorStore.instructor.user.username" readonly>
                </div>
              </div>
              <div class="col-md-6">
                <div class="input-group d-flex flex-column">
                  <label for="employee_code">Employee Code</label>
                  <input type="text" class="input w-100" name="employee_code" id="employee_code" autocomplete="off" v-model="instructorStore.instructor.employee_code" readonly>
                </div>
              </div>
              <div class="col-md-6">
                <div class="input-group d-flex flex-column">
                  <label for="email">Email</label>
                  <input type="email" class="input w-100" name="email" id="email"
                         placeholder="Enter your email.." autocomplete="off" v-model="instructorStore.instructor.user.email" readonly>
                </div>
              </div>
              <div class="col-12">
                <div class="button-group d-flex gap-2">
                  <NuxtLink :to="{path: '/dashboard/instructor'}" class="button-reverse">Cancel Edit</NuxtLink>
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