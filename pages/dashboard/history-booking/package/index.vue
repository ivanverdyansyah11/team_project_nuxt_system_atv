<script setup lang="ts">
import {useBookingPackageStore} from "~/stores/bookingPackage"
import {useAuthStore} from "~/stores/auth";
import {ref, onMounted} from 'vue'
import {formatRupiah} from "~/helpers/FormatRupiah"
import {getAlert, alertMessage, alertType, alertPage} from "~/helpers/Alert"
import Cookies from 'js-cookie'

definePageMeta({
  title: 'History Booking Package Page',
  layout: 'dashboard'
})

const keyword = ref('')
const bookingPackageStore = useBookingPackageStore()
const authStore = useAuthStore()
let bookingPackageLength = ref(0)
const bookingPackageDelete = ref(null)
const totalPages = ref(0)
const dynamicPath = ref('')
const linkRef = ref<HTMLAnchorElement | null>(null)

const search = async (event: any) => {
  event.preventDefault()
  bookingPackageStore.$state.keyword = keyword.value
  await bookingPackageStore.getAllBookingPackage()
  bookingPackageLength.value = bookingPackageStore.bookingPackageAll.length
  totalPages.value = Math.ceil(bookingPackageStore.totalPages / bookingPackageStore.pageSize)
}

const changePage = async (page: number) => {
  bookingPackageStore.$state.page = page
  await bookingPackageStore.getAllBookingPackage()
  bookingPackageLength.value = bookingPackageStore.bookingPackageAll.length
}

const exportBookingPackage = async () => {
  const blob = await bookingPackageStore.exportBookingPackage()
  const url = URL.createObjectURL(blob)
  dynamicPath.value = url
}

const confirmDeleteBookingPackage = async () => {
  if (bookingPackageDelete.value) {
    await bookingPackageStore.deleteBookingPackage(bookingPackageDelete.value.id)
    if (bookingPackageStore.status_code === 200) {
      Cookies.set('alert-message', 'Successfully deleted blog')
      Cookies.set('alert-type', 'true')
      Cookies.set('alert-page', 'Booking Package')
      getAlert()
    }
    await bookingPackageStore.getAllBookingPackage()
    bookingPackageDelete.value = null
    bookingPackageLength.value = bookingPackageStore.bookingPackageAll.length
    totalPages.value = Math.ceil(bookingPackageLength.value / bookingPackageStore.pageSize)
  }
}

onMounted(async () => {
  await bookingPackageStore.getAllBookingPackage()
  await exportBookingPackage()
  bookingPackageLength.value = bookingPackageStore.bookingPackageAll.length
  totalPages.value = Math.ceil(bookingPackageStore.totalPages / bookingPackageStore.pageSize)
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
        <div v-if="alertPage == 'Booking Package'" class="alert w-100" :class="alertType != false ? 'alert-success' : 'alert-danger'" role="alert">
          {{ alertMessage }}
        </div>
      </div>
      <div class="col-12">
        <div class="card-default">
          <div class="wrapper d-flex align-items-center justify-content-between gap-2">
            <form class="form w-100">
              <input type="search" class="input w-100" id="search" placeholder="Search booking.."
                     autocomplete="off" v-model="keyword" @keyup="search">
            </form>
            <NuxtLink :to="dynamicPath" ref="linkRef" download class="button-reverse">Export Excel</NuxtLink>
          </div>
          <div class="wrapper-table mt-4">
            <table class="table" style="width:100%">
              <thead>
              <tr>
                <th>Code</th>
                <th>Customer</th>
                <th>Payment Method</th>
                <th>Total Pay</th>
                <th>Total Price</th>
                <th>Total Change</th>
                <th style="width: 200px;"></th>
              </tr>
              </thead>
              <tbody>
              <tr v-if="bookingPackageLength > 0" v-for="(bookingPackage, index) in bookingPackageStore.bookingPackageAll" :key="index">
                <td>{{bookingPackage.code}}</td>
                <td>{{bookingPackage.customer.name}}</td>
                <td>{{bookingPackage.payment_method}}</td>
                <td>{{formatRupiah(bookingPackage.total_pay)}}</td>
                <td>{{formatRupiah(bookingPackage.total_price)}}</td>
                <td>{{formatRupiah(bookingPackage.total_change)}}</td>
                <td class="d-flex justify-content-end gap-1 table-mobile" style="width: 200px;">
                  <NuxtLink :to="{path: `/dashboard/history-booking/package/${bookingPackage.id}`}"
                            class="wrapper-icon icon-detail d-flex align-items-center justify-content-center">
                    <i class="fa-solid fa-eye" style="font-size: 0.85rem;"></i>
                  </NuxtLink>
                  <button v-if="authStore.user.user.role == 'admin'" type="button"
                          class="wrapper-icon icon-delete d-flex align-items-center justify-content-center"
                          data-bs-toggle="modal" data-bs-target="#deleteModal" @click="bookingPackageDelete = bookingPackage">
                    <i class="fa-solid fa-trash-can" style="font-size: 0.85rem;"></i>
                  </button>
                </td>
              </tr>
              <tr v-else>
                <td colspan="7">Data booking not found!</td>
              </tr>
              </tbody>
            </table>
            <nav aria-label="Page navigation example" v-if="totalPages > 1">
              <ul class="pagination">
                <li class="page-item" :class="{ disabled: bookingPackageStore.page === 1 }">
                  <button type="button" class="page-link" @click="changePage(bookingPackageStore.page - 1)" :disabled="bookingPackageStore.page === 1">Previous</button>
                </li>
                <li v-for="page in totalPages" :key="page" :class="{ active: page === bookingPackageStore.page }" class="page-item">
                  <button type="button" class="page-link" @click="changePage(page)">{{ page }}</button>
                </li>
                <li class="page-item" :class="{ disabled: bookingPackageStore.page === totalPages }">
                  <button type="button" class="page-link" @click="changePage(bookingPackageStore.page + 1)" :disabled="bookingPackageStore.page === totalPages">Next</button>
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
            <h1 class="modal-title fs-5" id="deleteModalLabel">Delete Booking Package</h1>
            <button type="button" data-bs-dismiss="modal" aria-label="Close">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
          <div class="modal-body">
            <p style="font-size: 0.913rem">Are you sure want to delete this booking package?</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="button-reverse" data-bs-dismiss="modal">Cancel Delete</button>
            <button type="button" class="button-primary-small" @click="confirmDeleteBookingPackage" data-bs-dismiss="modal">Delete Booking Package</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
