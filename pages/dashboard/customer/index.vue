<script setup lang="ts">
import { useCustomerStore } from "~/stores/customer";
import { ref, onMounted } from 'vue'
import { useField, useForm } from "vee-validate";
import Cookies from 'js-cookie'
import * as yup from "yup";

definePageMeta({
  title: 'Customer Page',
  layout: 'dashboard'
})

const keyword = ref('')
const customerStore = useCustomerStore()
const customerData = ref(null);
let customerLength = ref(0)
const totalPages = ref(0)
let alertMessage = useCookie('alert-message')
let alertPage = useCookie('alert-page')

const schema = yup.object({
  name: yup.string().required('Name is required'),
  username: yup.string().required('Username is required'),
  email: yup.string().email().required('Email is required'),
  password: yup.string().required('Password is required'),
});

const { handleSubmit, resetForm, setValues } = useForm({
  validationSchema: schema,
});

const { value: name, errorMessage: nameError } = useField('name');
const { value: username, errorMessage: usernameError } = useField('username');
const { value: email, errorMessage: emailError } = useField('email');

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

const removeCustomerDetail = async () => {
  customerData.value = null
  setValues({
    name: '',
    username: '',
    email: '',
  });
}

const customerDetail = async (customerSelect: any) => {
  await customerStore.getCustomerById(customerSelect.id);
  customerData.value = customerSelect
  const customer = customerStore.customer;
  setValues({
    name: customer.name,
    username: customer.user.username,
    email: customer.user.email,
  });
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
                  <button type="button" data-bs-toggle="modal" data-bs-target="#detailModal" @click="customerDetail(customer)"
                          class="wrapper-icon icon-detail d-flex align-items-center justify-content-center">
                    <i class="fa-solid fa-eye" style="font-size: 0.85rem;"></i>
                  </button>
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

    <div class="modal fade" id="detailModal" tabindex="-1" aria-labelledby="detailModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header d-flex align-items-center justify-content-between">
            <h1 class="modal-title fs-5" id="detailModalLabel">Detail Customer</h1>
            <button type="button" data-bs-dismiss="modal" aria-label="Close" @click="removeCustomerDetail()">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
          <div class="modal-body">
            <form class="form">
              <div class="row g-3">
                <div class="col-12">
                  <div class="input-group d-flex flex-column">
                    <label for="name">Name</label>
                    <input type="text" class="input w-100" name="name" id="name"
                           placeholder="Enter your name.." autocomplete="off" v-model="name" readonly>
                  </div>
                </div>
                <div class="col-12">
                  <div class="input-group d-flex flex-column">
                    <label for="username">Username</label>
                    <input type="text" class="input w-100" name="username" id="username"
                           placeholder="Enter your username.." autocomplete="off" v-model="username" readonly>
                  </div>
                </div>
                <div class="col-12">
                  <div class="input-group d-flex flex-column">
                    <label for="email">Email</label>
                    <input type="email" class="input w-100" name="email" id="email"
                           placeholder="Enter your email.." autocomplete="off" v-model="email" readonly>
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="button-reverse" data-bs-dismiss="modal" @click="removeCustomerDetail()">Close Modal</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
