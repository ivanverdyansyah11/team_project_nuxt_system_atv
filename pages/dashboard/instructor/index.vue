<script setup lang="ts">
import { useInstructorStore } from "~/stores/instructor";
import Cookies from 'js-cookie'
import { ref, onMounted } from 'vue'

definePageMeta({
  title: 'Instructor Page',
  layout: 'dashboard'
})

const keyword = ref('')
const instructorStore = useInstructorStore()
let instructorLength = ref(0)
const instructorDelete = ref(null);
const totalPages = ref(0)
let alertMessage = useCookie('alert-message')
let alertPage = useCookie('alert-page')

const search = async (event: any) => {
  event.preventDefault()
  instructorStore.$state.keyword = keyword.value
  await instructorStore.getAllInstructor()
  instructorLength.value = instructorStore.instructorAll.length
  totalPages.value = Math.ceil(instructorStore.totalPages / instructorStore.pageSize)
}

const changePage = async (page: number) => {
  instructorStore.$state.page = page
  await instructorStore.getAllInstructor()
  instructorLength.value = instructorStore.instructorAll.length
}

const confirmDeleteInstructor = async () => {
  if (instructorDelete.value) {
    await instructorStore.deleteInstructor(instructorDelete.value.id);
    if (instructorStore.status_code === 200) {
      Cookies.set('alert-message', 'Successfully deleted instructor');
      Cookies.set('alert-page', 'Instructor');
      alertMessage = useCookie('alert-message')
      alertPage = useCookie('alert-page')
    }
    instructorDelete.value = null;
    totalPages.value = Math.ceil(instructorStore.totalPages / instructorStore.pageSize)
    instructorLength.value = instructorStore.instructorAll.length
  }
};

onMounted(async () => {
  await instructorStore.getAllInstructor()
  instructorLength.value = instructorStore.instructorAll.length
  totalPages.value = Math.ceil(instructorStore.totalPages / instructorStore.pageSize)
})

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
  <div class="content container mt-4">
    <div class="row">
      <div class="col-12">
        <div v-if="alertPage == 'Instructor'" class="alert alert-success w-100" role="alert">
          {{ alertMessage }}
        </div>
      </div>
      <div class="col-12">
        <div class="card-default">
          <div class="wrapper d-flex align-items-center justify-content-between gap-2">
            <form class="form w-100">
              <input type="search" class="input w-100" id="search" placeholder="Search instructor.."
                     autocomplete="off" v-model="keyword" @keyup="search">
            </form>
            <NuxtLink :to="{path: `/dashboard/instructor/create`}" class="button-primary-small d-none d-md-inline-block">Add
              New
              Instructor</NuxtLink>
          </div>
          <div class="wrapper-table mt-4">
            <table class="table" style="width:100%">
              <thead>
              <tr>
                <th>Instructor Code</th>
                <th>Name</th>
                <th>Username</th>
                <th>Email</th>
                <th style="width: 200px;"></th>
              </tr>
              </thead>
              <tbody>
              <tr v-if="instructorLength > 0" v-for="(instructor, index) in instructorStore.instructorAll" :key="index">
                <td>{{instructor.employee_code}}</td>
                <td>{{instructor.name}}</td>
                <td>{{instructor.user.username}}</td>
                <td>{{instructor.user.email}}</td>
                <td class="d-flex justify-content-end gap-1 table-mobile" style="width: 200px;">
                  <NuxtLink :to="{path: `/dashboard/instructor/${instructor.id}`}"
                            class="wrapper-icon icon-detail d-flex align-items-center justify-content-center">
                    <i class="fa-solid fa-eye" style="font-size: 0.85rem;"></i>
                  </NuxtLink>
                  <NuxtLink :to="{path: `/dashboard/instructor/edit/${instructor.id}`}"
                            class="wrapper-icon icon-edit d-flex align-items-center justify-content-center">
                    <i class="fa-solid fa-pen-to-square" style="font-size: 0.85rem;"></i>
                  </NuxtLink>
                  <button type="button"
                          class="wrapper-icon icon-delete d-flex align-items-center justify-content-center"
                          data-bs-toggle="modal" data-bs-target="#deleteModal" @click="instructorDelete = instructor">
                    <i class="fa-solid fa-trash-can" style="font-size: 0.85rem;"></i>
                  </button>
                </td>
              </tr>
              <tr v-else>
                <td colspan="5">Data instructor not found!</td>
              </tr>
              </tbody>
            </table>
            <nav aria-label="Page navigation example" v-if="totalPages > 1">
              <ul class="pagination">
                <li class="page-item" :class="{ disabled: instructorStore.page === 1 }">
                  <button type="button" class="page-link" @click="changePage(instructorStore.page - 1)" :disabled="instructorStore.page === 1">Previous</button>
                </li>
                <li v-for="page in totalPages" :key="page" :class="{ active: page === instructorStore.page }" class="page-item">
                  <button type="button" class="page-link" @click="changePage(page)">{{ page }}</button>
                </li>
                <li class="page-item" :class="{ disabled: instructorStore.page === totalPages }">
                  <button type="button" class="page-link" @click="changePage(instructorStore.page + 1)" :disabled="instructorStore.page === totalPages">Next</button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="deleteModal" tabindex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header d-flex align-items-center justify-content-between">
            <h1 class="modal-title fs-5" id="deleteModalLabel">Delete Instructor</h1>
            <button type="button" data-bs-dismiss="modal" aria-label="Close">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
          <div class="modal-body">
            <p style="font-size: 0.913rem">Are you sure want to delete this instructor?</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="button-reverse" data-bs-dismiss="modal">Cancel Delete</button>
            <button type="button" class="button-primary-small" @click="confirmDeleteInstructor" data-bs-dismiss="modal">Delete Instructor</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
