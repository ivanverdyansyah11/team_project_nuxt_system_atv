<script setup lang="ts">
import { useStaffStore } from "~/stores/staff";
import Cookies from 'js-cookie'
import { ref, onMounted } from 'vue'

definePageMeta({
  title: 'Staff Page',
  layout: 'dashboard'
})

const keyword = ref('')
const staffStore = useStaffStore()
let staffLength = ref(0)
const staffDelete = ref(null);
const totalPages = ref(0)
let alertMessage = useCookie('alert-message')
let alertPage = useCookie('alert-page')

const search = async (event: any) => {
  event.preventDefault()
  staffStore.$state.keyword = keyword.value
  await staffStore.getAllStaff()
  staffLength.value = staffStore.staffAll.length
  totalPages.value = Math.ceil(staffStore.totalPages / staffStore.pageSize)
}

const changePage = async (page: number) => {
  staffStore.$state.page = page
  await staffStore.getAllStaff()
  staffLength.value = staffStore.staffAll.length
}

const confirmDeleteStaff = async () => {
  if (staffDelete.value) {
    await staffStore.deleteStaff(staffDelete.value.id);
    if (staffStore.status_code === 200) {
      Cookies.set('alert-message', 'Successfully deleted staff');
      Cookies.set('alert-page', 'Staff');
      alertMessage = useCookie('alert-message')
      alertPage = useCookie('alert-page')
    }
    staffDelete.value = null;
    totalPages.value = Math.ceil(staffStore.totalPages / staffStore.pageSize)
    staffLength.value = staffStore.staffAll.length
  }
};

onMounted(async () => {
  await staffStore.getAllStaff()
  staffLength.value = staffStore.staffAll.length
  totalPages.value = Math.ceil(staffStore.totalPages / staffStore.pageSize)
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
        <div v-if="alertPage == 'Staff'" class="alert alert-success w-100" role="alert">
          {{ alertMessage }}
        </div>
      </div>
      <div class="col-12">
        <div class="card-default">
          <div class="wrapper d-flex align-items-center justify-content-between gap-2">
            <form class="form w-100">
              <input type="search" class="input w-100" id="search" placeholder="Search staff.."
                     autocomplete="off" v-model="keyword" @keyup="search">
            </form>
            <NuxtLink :to="{path: `/dashboard/staff/create`}" class="button-primary-small d-none d-md-inline-block">Add
              New
              Staff</NuxtLink>
          </div>
          <div class="wrapper-table mt-4">
            <table class="table" style="width:100%">
              <thead>
              <tr>
                <th>Staff Code</th>
                <th>Name</th>
                <th>Username</th>
                <th>Email</th>
                <th style="width: 200px;"></th>
              </tr>
              </thead>
              <tbody>
              <tr v-if="staffLength > 0" v-for="(staff, index) in staffStore.staffAll" :key="index">
                <td>{{staff.employee_code}}</td>
                <td>{{staff.name}}</td>
                <td>{{staff.user.username}}</td>
                <td>{{staff.user.email}}</td>
                <td class="d-flex justify-content-end gap-1 table-mobile" style="width: 200px;">
                  <NuxtLink :to="{path: `/dashboard/staff/${staff.id}`}"
                            class="wrapper-icon icon-detail d-flex align-items-center justify-content-center">
                    <i class="fa-solid fa-eye" style="font-size: 0.85rem;"></i>
                  </NuxtLink>
                  <NuxtLink :to="{path: `/dashboard/staff/edit/${staff.id}`}"
                            class="wrapper-icon icon-edit d-flex align-items-center justify-content-center">
                    <i class="fa-solid fa-pen-to-square" style="font-size: 0.85rem;"></i>
                  </NuxtLink>
                  <button type="button"
                          class="wrapper-icon icon-delete d-flex align-items-center justify-content-center"
                          data-bs-toggle="modal" data-bs-target="#deleteModal" @click="staffDelete = staff">
                    <i class="fa-solid fa-trash-can" style="font-size: 0.85rem;"></i>
                  </button>
                </td>
              </tr>
              <tr v-else>
                <td colspan="5">Data staff not found!</td>
              </tr>
              </tbody>
            </table>
            <nav aria-label="Page navigation example" v-if="totalPages > 1">
              <ul class="pagination">
                <li class="page-item" :class="{ disabled: staffStore.page === 1 }">
                  <button type="button" class="page-link" @click="changePage(staffStore.page - 1)" :disabled="staffStore.page === 1">Previous</button>
                </li>
                <li v-for="page in totalPages" :key="page" :class="{ active: page === staffStore.page }" class="page-item">
                  <button type="button" class="page-link" @click="changePage(page)">{{ page }}</button>
                </li>
                <li class="page-item" :class="{ disabled: staffStore.page === totalPages }">
                  <button type="button" class="page-link" @click="changePage(staffStore.page + 1)" :disabled="staffStore.page === totalPages">Next</button>
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
            <h1 class="modal-title fs-5" id="deleteModalLabel">Delete Staff</h1>
            <button type="button" data-bs-dismiss="modal" aria-label="Close">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
          <div class="modal-body">
            <p style="font-size: 0.913rem">Are you sure want to delete this staff?</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="button-reverse" data-bs-dismiss="modal">Cancel Delete</button>
            <button type="button" class="button-primary-small" @click="confirmDeleteStaff" data-bs-dismiss="modal">Delete Staff</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
