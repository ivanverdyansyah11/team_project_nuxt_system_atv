<script setup lang="ts">
import {useBookingPackageStore} from "~/stores/bookingPackage"
import {onMounted, ref} from "vue"
import {formatDate} from "~/helpers/FormatDate"
import {formatRupiah} from "~/helpers/FormatRupiah"
import imageNotFound from 'assets/image/other/image-not-found.svg'

definePageMeta({
  layout: 'profile',
})

const bookingPackageStore  = useBookingPackageStore()
const keyword = ref('')
let bookingPackageLength = ref(0)

const search = async (event: any) => {
  event.preventDefault()
  bookingPackageStore.$state.keyword = keyword.value
  await bookingPackageStore.getAllBookingPackageWithoutPaginate()
  bookingPackageLength.value = bookingPackageStore.bookingPackageAll.length
}

onMounted(async() => {
  await bookingPackageStore.getAllBookingPackageWithoutPaginate()
  bookingPackageLength.value = bookingPackageStore.bookingPackageAll.length
})
</script>

<template>
  <div>
    <div class="row mb-4">
      <div class="col-12">
        <form>
          <input type="search" class="input-search-booking" placeholder="Search booking package..." autocomplete="off" v-model="keyword" @keyup="search">
        </form>
      </div>
    </div>
    <div class="row" :class="{'row-cols-1 row-cols-md-2 g-3': bookingPackageLength > 0}">
      <div v-if="bookingPackageLength > 0" class="col-md-6" v-for="(bookingPackage, index) in bookingPackageStore.bookingPackageAll" :key="index">
        <NuxtLink :to="{path: `/homepage/profile/history-booking/package/${bookingPackage.id}`}" class="card-booking d-flex align-items-center gap-3 w-100">
          <img :src="bookingPackage.entertainment_package.image_path != null ? `http://localhost:8000/${bookingPackage.entertainment_package.image_path}` : imageNotFound" alt="Booking Image" class="booking-image">
          <div class="wrapper d-flex align-items-end justify-content-between w-100">
            <div class="wrapper d-flex flex-column align-items-start">
              <h6 class="booking-title">{{bookingPackage.entertainment_package.name}}</h6>
              <p class="booking-date"><span>{{formatRupiah(bookingPackage.total_price)}}</span> | {{formatDate(bookingPackage.date)}}</p>
              <p class="booking-code">{{bookingPackage.code}}</p>
            </div>
            <p class="booking-status">Done</p>
          </div>
        </NuxtLink>
      </div>
      <div v-else class="col-12 my-5">
        <p class="description w-100 text-center">No data booking found! <br> <NuxtLink :to="{path: '/homepage/package'}">Let's explore now!</NuxtLink></p>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>