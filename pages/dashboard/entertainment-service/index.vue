<script setup lang="ts">
import {useServiceStore} from "~/stores/service"
import {useAuthStore} from "~/stores/auth"
import {ref, onMounted} from 'vue'
import {formatRupiah} from "~/helpers/FormatRupiah"
import {getAlert, alertMessage, alertType, alertPage} from "~/helpers/Alert"
import Cookies from 'js-cookie'

definePageMeta({
  title: 'Service Page',
  layout: 'dashboard'
})

const keyword = ref('')
const serviceStore = useServiceStore()
const authStore = useAuthStore()
let serviceLength = ref(0)
const serviceDelete = ref(null)
const totalPages = ref(0)
const dynamicPath = ref('')
const linkRef = ref<HTMLAnchorElement | null>(null)

const search = async (event: any) => {
  event.preventDefault()
  serviceStore.$state.keyword = keyword.value
  await serviceStore.getAllService()
  serviceLength.value = serviceStore.serviceAll.length
  totalPages.value = Math.ceil(serviceStore.totalPages / serviceStore.pageSize)
}

const changePage = async (page: number) => {
  serviceStore.$state.page = page
  await serviceStore.getAllService()
  serviceLength.value = serviceStore.serviceAll.length
}

const exportService = async () => {
  const blob = await serviceStore.exportService()
  const url = URL.createObjectURL(blob)
  dynamicPath.value = url
}

const confirmDeleteService = async () => {
  if (serviceDelete.value) {
    await serviceStore.deleteService(serviceDelete.value.id)
    if (serviceStore.status_code === 200) {
      Cookies.set('alert-message', 'Successfully deleted entertainment service')
      Cookies.set('alert-type', 'true')
      Cookies.set('alert-page', 'Service')
      getAlert()
    }
    serviceDelete.value = null
    serviceLength.value = serviceStore.serviceAll.length
    totalPages.value = Math.ceil(serviceLength.value / serviceStore.pageSize)
  } else {
    Cookies.set('alert-message', 'Failed to get data entertainment service')
    Cookies.set('alert-type', 'false')
    Cookies.set('alert-page', 'Service')
    getAlert()
  }
}

onMounted(async () => {
  await serviceStore.getAllService()
  await exportService()
  serviceLength.value = serviceStore.serviceAll.length
  totalPages.value = Math.ceil(serviceStore.totalPages / serviceStore.pageSize)
  getAlert()
})

onBeforeRouteLeave((to, from, next) => {
  Cookies.remove('alert-message')
  Cookies.remove('alert-type')
  Cookies.remove('alert-page')
  next()
})

onBeforeRouteUpdate((to, from, next) => {
  Cookies.remove('alert-message')
  Cookies.remove('alert-type')
  Cookies.remove('alert-page')
  next()
})
</script>

<template>
  <div class="content container mt-4">
    <div class="row">
      <div class="col-12">
        <div v-if="alertPage == 'Service'" class="alert w-100" :class="alertType != false ? 'alert-success' : 'alert-danger'" role="alert">
          {{ alertMessage }}
        </div>
      </div>
      <div class="col-12">
        <div class="card-default">
          <div class="wrapper d-flex align-items-center justify-content-between gap-2">
            <form class="form w-100">
              <input type="search" class="input w-100" id="search" placeholder="Search service.."
                     autocomplete="off" v-model="keyword" @keyup="search">
            </form>
            <NuxtLink v-if="authStore.user.user.role == 'admin'" :to="{path: `/dashboard/entertainment-service/create`}" class="button-primary-small d-none d-md-inline-block">Add
              New
              Service</NuxtLink>
            <NuxtLink :to="dynamicPath" ref="linkRef" download class="button-reverse">Export Excel</NuxtLink>
          </div>
          <div class="wrapper-table mt-4">
            <table class="table" style="width:100%">
              <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Entertainment Category</th>
                <th style="width: 200px;"></th>
              </tr>
              </thead>
              <tbody>
              <tr v-if="serviceLength > 0" v-for="(service, index) in serviceStore.serviceAll" :key="index">
                <td>{{service.name}}</td>
                <td>{{formatRupiah(service.price)}}</td>
                <td>{{service.entertainment_category.name}}</td>
                <td class="d-flex justify-content-end gap-1 table-mobile" style="width: 200px;">
                  <NuxtLink :to="{path: `/dashboard/entertainment-service/${service.id}`}"
                            class="wrapper-icon icon-detail d-flex align-items-center justify-content-center">
                    <i class="fa-solid fa-eye" style="font-size: 0.85rem;"></i>
                  </NuxtLink>
                  <NuxtLink v-if="authStore.user.user.role == 'admin'" :to="{path: `/dashboard/entertainment-service/edit/${service.id}`}"
                            class="wrapper-icon icon-edit d-flex align-items-center justify-content-center">
                    <i class="fa-solid fa-pen-to-square" style="font-size: 0.85rem;"></i>
                  </NuxtLink>
                  <button v-if="authStore.user.user.role == 'admin'" type="button"
                          class="wrapper-icon icon-delete d-flex align-items-center justify-content-center"
                          data-bs-toggle="modal" data-bs-target="#deleteModal" @click="serviceDelete = service">
                    <i class="fa-solid fa-trash-can" style="font-size: 0.85rem;"></i>
                  </button>
                </td>
              </tr>
              <tr v-else>
                <td colspan="4">Data service not found!</td>
              </tr>
              </tbody>
            </table>
            <nav aria-label="Page navigation example" v-if="totalPages > 1">
              <ul class="pagination">
                <li class="page-item" :class="{ disabled: serviceStore.page === 1 }">
                  <button type="button" class="page-link" @click="changePage(serviceStore.page - 1)" :disabled="serviceStore.page === 1">Previous</button>
                </li>
                <li v-for="page in totalPages" :key="page" :class="{ active: page === serviceStore.page }" class="page-item">
                  <button type="button" class="page-link" @click="changePage(page)">{{ page }}</button>
                </li>
                <li class="page-item" :class="{ disabled: serviceStore.page === totalPages }">
                  <button type="button" class="page-link" @click="changePage(serviceStore.page + 1)" :disabled="serviceStore.page === totalPages">Next</button>
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
            <h1 class="modal-title fs-5" id="deleteModalLabel">Delete Service</h1>
            <button type="button" data-bs-dismiss="modal" aria-label="Close">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
          <div class="modal-body">
            <p style="font-size: 0.913rem">Are you sure want to delete this service?</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="button-reverse" data-bs-dismiss="modal">Cancel Delete</button>
            <button type="button" class="button-primary-small" @click="confirmDeleteService" data-bs-dismiss="modal">Delete Service</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
