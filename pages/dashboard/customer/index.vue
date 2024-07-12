<script setup lang="ts">
import { useCustomerStore } from "~/stores/customer";
import Cookies from 'js-cookie'
import { ref, onMounted } from 'vue'

definePageMeta({
  title: 'Customer Page',
  layout: 'dashboard'
})

const keyword = ref('')
const customerStore = useCustomerStore()
let customerLength = ref(0)
const totalPages = ref(0)
let alertMessage = useCookie('alert-message')
let alertPage = useCookie('alert-page')

const search = async (event: any) => {
  event.preventDefault()
  customerStore.$state.keyword = keyword.value
  customerStore.$state.page = 1
  await customerStore.getAllCustomer()
  customerLength.value = customerStore.customerAll.length
  totalPages.value = Math.ceil(customerStore.totalPages / customerStore.pageSize)
}

const changePage = async (page: number) => {
  customerStore.$state.page = page
  await customerStore.getAllCustomer()
  customerLength.value = customerStore.customerAll.length
}

onMounted(async () => {
  await customerStore.getAllCustomer()
  customerLength.value = customerStore.customerAll.length
  totalPages.value = Math.ceil(customerStore.totalPages / customerStore.pageSize)
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
        <div v-if="alertPage == 'Customer'" class="alert alert-success w-100" role="alert">
          {{ alertMessage }}
        </div>
      </div>
      <div class="col-12">
        <div class="card-default">
          <div class="wrapper d-flex align-items-center justify-content-between gap-2">
            <form class="form w-100">
              <input type="search" class="input w-100" id="search" placeholder="Search customer.."
                     autocomplete="off" v-model="keyword" @keyup="search">
            </form>
          </div>
          <div class="wrapper-table mt-4">
            <table class="table" style="width:100%">
              <thead>
              <tr>
                <th>Name</th>
                <th>Username</th>
                <th>Email</th>
                <th style="width: 200px;"></th>
              </tr>
              </thead>
              <tbody>
              <tr v-if="customerLength > 0" v-for="(customer, index) in customerStore.customerAll" :key="index">
                <td>{{customer.name}}</td>
                <td>{{customer.user.username}}</td>
                <td>{{customer.user.email}}</td>
                <td class="d-flex justify-content-end gap-1 table-mobile" style="width: 200px;">
                  <NuxtLink :to="{path: `/dashboard/customer/${customer.id}`}"
                            class="wrapper-icon icon-detail d-flex align-items-center justify-content-center">
                    <i class="fa-solid fa-eye" style="font-size: 0.85rem;"></i>
                  </NuxtLink>
                </td>
              </tr>
              <tr v-else>
                <td colspan="4">Data customer not found!</td>
              </tr>
              </tbody>
            </table>
            <nav aria-label="Page navigation example" v-if="totalPages > 1">
              <ul class="pagination">
                <li class="page-item" :class="{ disabled: customerStore.page === 1 }">
                  <button type="button" class="page-link" @click="changePage(customerStore.page - 1)" :disabled="customerStore.page === 1">Previous</button>
                </li>
                <li v-for="page in totalPages" :key="page" :class="{ active: page === customerStore.page }" class="page-item">
                  <button type="button" class="page-link" @click="changePage(page)">{{ page }}</button>
                </li>
                <li class="page-item" :class="{ disabled: customerStore.page === totalPages }">
                  <button type="button" class="page-link" @click="changePage(customerStore.page + 1)" :disabled="customerStore.page === totalPages">Next</button>
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
            <h1 class="modal-title fs-5" id="deleteModalLabel">Delete Customer</h1>
            <button type="button" data-bs-dismiss="modal" aria-label="Close">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
          <div class="modal-body">
            <p style="font-size: 0.913rem">Are you sure want to delete this customer?</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="button-reverse" data-bs-dismiss="modal">Cancel Delete</button>
            <button type="button" class="button-primary-small" @click="confirmDeleteCustomer" data-bs-dismiss="modal">Delete Customer</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
