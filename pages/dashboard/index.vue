<script setup lang="ts">
import {useCustomerStore} from "~/stores/customer"
import {useInstructorStore} from "~/stores/instructor"
import {useBookingStore} from "~/stores/booking"
import {ref, onMounted} from "vue"
import {formatRupiah} from "~/helpers/FormatRupiah"

definePageMeta({
  title: 'Dashboard Page',
  layout: 'dashboard'
})

const customerStore = useCustomerStore()
const instructorStore = useInstructorStore()
const bookingStore = useBookingStore()
const customerLength = ref()
const instructorLength = ref()
const bookingLength = ref()
const totalPrice = ref(0)

onMounted(async () => {
  await customerStore.getAllCustomerWithoutPaginate()
  await instructorStore.getAllInstructorWithoutPaginate()
  await bookingStore.getAllBookingWithoutPaginate()

  customerLength.value = customerStore.customerAll.length
  instructorLength.value = instructorStore.instructorAll.length
  bookingLength.value = bookingStore.bookingAll.length
  totalPrice.value = bookingStore.bookingAll.map(booking => booking.total_price)
  totalPrice.value = totalPrice.value.reduce((accumulator, currentValue) => accumulator + currentValue, 0)
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