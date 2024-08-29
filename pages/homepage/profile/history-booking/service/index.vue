<script setup lang="ts">
import {useBookingServiceStore} from "~/stores/bookingService"
import {onMounted, ref} from "vue"
import {formatDate} from "~/helpers/FormatDate"
import {formatRupiah} from "~/helpers/FormatRupiah"
import imageNotFound from 'assets/image/other/image-not-found.svg'

definePageMeta({
  layout: 'profile',
})

const bookingServiceStore  = useBookingServiceStore()
const keyword = ref('')
let bookingServiceLength = ref(0)

const search = async (event: any) => {
  event.preventDefault()
  bookingServiceStore.$state.keyword = keyword.value
  await bookingServiceStore.getAllBookingServiceWithoutPaginate()
  bookingServiceLength.value = bookingServiceStore.bookingServiceAll.length
}

onMounted(async() => {
  await bookingServiceStore.getAllBookingServiceWithoutPaginate()
  bookingServiceLength.value = bookingServiceStore.bookingServiceAll.length
})
</script>

<template>
  <div>
    <div class="row mb-4">
      <div class="col-12">
        <form>
          <input type="search" class="input-search-booking" placeholder="Search booking service..." autocomplete="off" v-model="keyword" @keyup="search">
        </form>
      </div>
    </div>
    <div class="row" :class="{'row-cols-1 row-cols-md-2 g-3': bookingServiceLength > 0}">
      <div v-if="bookingServiceLength > 0" class="col-md-6" v-for="(bookingService, index) in bookingServiceStore.bookingServiceAll" :key="index">
        <NuxtLink :to="{path: `/homepage/profile/history-booking/service/${bookingService.id}`}" class="card-booking d-flex align-items-center gap-3 w-100">
          <img :src="bookingService.details[0].entertainment_service.image_path != null ? `http://localhost:8000/${bookingService.details[0].entertainment_service.image_path}` : imageNotFound" alt="Booking Image" class="booking-image">
          <div class="wrapper d-flex align-items-end justify-content-between w-100">
            <div class="wrapper d-flex flex-column align-items-start">
              <h6 class="booking-title">{{bookingService.details[0].entertainment_service.name}}</h6>
              <p class="booking-date"><span>{{formatRupiah(bookingService.total_price)}}</span> | {{formatDate(bookingService.date)}}</p>
              <p class="booking-code">{{bookingService.code}}</p>
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