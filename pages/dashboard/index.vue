<script setup lang="ts">
import {useCustomerStore} from "~/stores/customer"
import {useInstructorStore} from "~/stores/instructor"
import {useBookingServiceStore} from "~/stores/bookingService"
import {useBookingPackageStore} from "~/stores/bookingPackage"
import {ref, onMounted} from "vue"
import {formatRupiah} from "~/helpers/FormatRupiah"

definePageMeta({
  title: 'Dashboard Page',
  layout: 'dashboard'
})

const customerStore = useCustomerStore()
const instructorStore = useInstructorStore()
const bookingServiceStore = useBookingServiceStore()
const bookingPackageStore = useBookingPackageStore()
const customerLength = ref(0)
const instructorLength = ref(0)
const bookingLength = ref(0)
const bookingServiceLength = ref(0)
const bookingPackageLength = ref(0)
const totalPrice = ref(0)
const totalPriceBookingService = ref()
const totalPriceBookingPackage = ref()

onMounted(async () => {
  await customerStore.getAllCustomerWithoutPaginate()
  await instructorStore.getAllInstructorWithoutPaginate()
  await bookingServiceStore.getAllBookingServiceWithoutPaginate()
  await bookingPackageStore.getAllBookingPackageWithoutPaginate()

  customerLength.value = customerStore.customerAll.length
  instructorLength.value = instructorStore.instructorAll.length
  bookingServiceLength.value = bookingServiceStore.bookingServiceAll.length
  bookingPackageLength.value = bookingPackageStore.bookingPackageAll.length
  bookingLength.value = bookingServiceLength.value + bookingPackageLength.value
  totalPriceBookingService.value = bookingServiceStore.bookingServiceAll.map(booking => booking.total_price)
  totalPriceBookingService.value = totalPriceBookingService.value.reduce((accumulator, currentValue) => accumulator + currentValue, 0)
  totalPriceBookingPackage.value = bookingPackageStore.bookingPackageAll.map(booking => booking.total_price)
  totalPriceBookingPackage.value = totalPriceBookingPackage.value.reduce((accumulator, currentValue) => accumulator + currentValue, 0)
  totalPrice.value = totalPriceBookingService.value + totalPriceBookingPackage.value
})
</script>

<template>
  <div class="content container mt-4">
    <div class="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-3 g-lg-4">
      <div class="col">
        <div class="card-menu d-flex align-items-center gap-3">
          <div class="menu-icon d-flex align-items-center justify-content-center">
            <i class="fa-solid fa-users"></i>
          </div>
          <div class="menu-value">
            <p>Total Customer</p>
            <h6>{{customerLength}}</h6>
          </div>
        </div>
      </div>
      <div class="col">
        <div class="card-menu d-flex align-items-center gap-3">
          <div class="menu-icon d-flex align-items-center justify-content-center">
            <i class="fa-regular fa-id-card"></i>
          </div>
          <div class="menu-value">
            <p>Total Instructor</p>
            <h6>{{instructorLength}}</h6>
          </div>
        </div>
      </div>
      <div class="col">
        <div class="card-menu d-flex align-items-center gap-3">
          <div class="menu-icon d-flex align-items-center justify-content-center">
            <i class="fa-solid fa-money-bill-transfer"></i>
          </div>
          <div class="menu-value">
            <p>Total Booking</p>
            <h6>{{bookingLength}}</h6>
          </div>
        </div>
      </div>
      <div class="col">
        <div class="card-menu d-flex align-items-center gap-3">
          <div class="menu-icon d-flex align-items-center justify-content-center">
            <i class="fa-solid fa-coins"></i>
          </div>
          <div class="menu-value">
            <p>Total Income</p>
            <h6>{{formatRupiah(totalPrice)}}</h6>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>