<script setup lang="ts">
import {useBookingStore} from "~/stores/booking"
import {onMounted, ref} from "vue"
import {formatDate} from "~/helpers/FormatDate"
import {formatRupiah} from "~/helpers/FormatRupiah"
import imageNotFound from '~/assets/image/other/image-not-found.svg'

definePageMeta({
  layout: 'profile',
})

const bookingStore  = useBookingStore()
const keyword = ref('')
let bookingLength = ref(0)

const search = async (event: any) => {
  event.preventDefault()
  bookingStore.$state.keyword = keyword.value
  await bookingStore.getAllBookingWithoutPaginate()
  bookingLength.value = bookingStore.bookingAll.length
}

onMounted(async() => {
  await bookingStore.getAllBookingWithoutPaginate()
  bookingLength.value = bookingStore.bookingAll.length
})
</script>

<template>
  <div>
    <div class="row mb-4">
      <div class="col-12">
        <form>
          <input type="search" class="input-search-booking" placeholder="Search booking..." autocomplete="off" v-model="keyword" @keyup="search">
        </form>
      </div>
    </div>
    <div class="row" :class="{'row-cols-1 row-cols-md-2 g-3': bookingLength > 0}">
      <div v-if="bookingLength > 0" class="col-md-6" v-for="(booking, index) in bookingStore.bookingAll" :key="index">
        <NuxtLink :to="{path: `/homepage/profile/history-booking/${booking.id}`}" class="card-booking d-flex align-items-center gap-3 w-100">
          <img :src="booking.details[0].entertainment_service.image_path != null ? `http://localhost:8000/${booking.details[0].entertainment_service.image_path}` : imageNotFound" alt="Booking Image" class="booking-image">
          <div class="wrapper d-flex align-items-end justify-content-between w-100">
            <div class="wrapper d-flex flex-column align-items-start">
              <h6 class="booking-title">{{booking.details[0].entertainment_service.name}}</h6>
              <p class="booking-date"><span>{{formatRupiah(booking.total_price)}}</span> | {{formatDate(booking.date)}}</p>
              <p class="booking-code">{{booking.code}}</p>
            </div>
            <p class="booking-status">Done</p>
          </div>
        </NuxtLink>
      </div>
      <div v-else class="col-12 my-5">
        <p class="description w-100 text-center">No data booking found! <br> <NuxtLink :to="{path: '/homepage/service'}">Let's explore now!</NuxtLink></p>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>