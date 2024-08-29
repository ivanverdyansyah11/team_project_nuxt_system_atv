<script setup lang="ts">
import {useBookingStore} from "~/stores/booking"
import {ref, onMounted} from 'vue'
import {formatRupiah} from "~/helpers/FormatRupiah"
import {getAlert, alertMessage, alertType, alertPage} from "~/helpers/Alert"
import Cookies from 'js-cookie'

definePageMeta({
  title: 'History Booking Page',
  layout: 'dashboard'
})

const keyword = ref('')
const bookingStore = useBookingStore()
let bookingLength = ref(0)
const totalPages = ref(0)
const dynamicPath = ref('')
const linkRef = ref<HTMLAnchorElement | null>(null)

const search = async (event: any) => {
  event.preventDefault()
  bookingStore.$state.keyword = keyword.value
  await bookingStore.getAllBooking()
  bookingLength.value = bookingStore.bookingAll.length
  totalPages.value = Math.ceil(bookingStore.totalPages / bookingStore.pageSize)
}

const changePage = async (page: number) => {
  bookingStore.$state.page = page
  await bookingStore.getAllBooking()
  bookingLength.value = bookingStore.bookingAll.length
}

const exportBooking = async () => {
  const blob = await bookingStore.exportBooking()
  const url = URL.createObjectURL(blob)
  dynamicPath.value = url
}

onMounted(async () => {
  await bookingStore.getAllBooking()
  await exportBooking()
  bookingLength.value = bookingStore.bookingAll.length
  totalPages.value = Math.ceil(bookingStore.totalPages / bookingStore.pageSize)
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
        <div v-if="alertPage == 'Booking'" class="alert w-100" :class="alertType != false ? 'alert-success' : 'alert-danger'" role="alert">
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
            <NuxtLink :to="dynamicPath" ref="linkRef" download class="button-primary-small">Export Excel</NuxtLink>
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
              <tr v-if="bookingLength > 0" v-for="(booking, index) in bookingStore.bookingAll" :key="index">
                <td>{{booking.code}}</td>
                <td>{{booking.customer.name}}</td>
                <td>{{booking.payment_method}}</td>
                <td>{{formatRupiah(booking.total_pay)}}</td>
                <td>{{formatRupiah(booking.total_price)}}</td>
                <td>{{formatRupiah(booking.total_change)}}</td>
                <td class="d-flex justify-content-end gap-1 table-mobile" style="width: 200px;">
                  <NuxtLink :to="{path: `/dashboard/history-booking/${booking.id}`}"
                            class="wrapper-icon icon-detail d-flex align-items-center justify-content-center">
                    <i class="fa-solid fa-eye" style="font-size: 0.85rem;"></i>
                  </NuxtLink>
                </td>
              </tr>
              <tr v-else>
                <td colspan="7">Data booking not found!</td>
              </tr>
              </tbody>
            </table>
            <nav aria-label="Page navigation example" v-if="totalPages > 1">
              <ul class="pagination">
                <li class="page-item" :class="{ disabled: bookingStore.page === 1 }">
                  <button type="button" class="page-link" @click="changePage(bookingStore.page - 1)" :disabled="bookingStore.page === 1">Previous</button>
                </li>
                <li v-for="page in totalPages" :key="page" :class="{ active: page === bookingStore.page }" class="page-item">
                  <button type="button" class="page-link" @click="changePage(page)">{{ page }}</button>
                </li>
                <li class="page-item" :class="{ disabled: bookingStore.page === totalPages }">
                  <button type="button" class="page-link" @click="changePage(bookingStore.page + 1)" :disabled="bookingStore.page === totalPages">Next</button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
