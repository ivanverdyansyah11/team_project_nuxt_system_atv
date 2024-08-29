<script setup lang="ts">
import {useBookingPackageStore} from "~/stores/bookingPackage"
import {useRoute} from '#app'
import {formatRupiah} from "~/helpers/FormatRupiah"
import {formatDate} from "~/helpers/FormatDate"

definePageMeta({
  layout: 'profile',
})

const bookingPackageStore = useBookingPackageStore()
const route = useRoute()

await bookingPackageStore.getBookingPackageById(route.params.id)
</script>

<template>
  <form class="form w-100">
    <div class="row g-3">
      <div class="col-md-4">
        <div class="input-group d-flex flex-column">
          <label for="entertainment_package">Package Name</label>
          <input type="text" class="input w-100" name="entertainment_package" id="entertainment_package" v-model="bookingPackageStore.bookingPackage.entertainment_package.name" readonly>
        </div>
      </div>
      <div class="col-md-4">
        <div class="input-group d-flex flex-column">
          <label for="qty">Quantity</label>
          <input type="text" class="input w-100" name="qty" id="qty" :value="bookingPackageStore.bookingPackage.total_price / bookingPackageStore.bookingPackage.entertainment_package.price" readonly>
        </div>
      </div>
      <div class="col-md-4">
        <div class="input-group d-flex flex-column">
          <label for="unit_price">Unit Price</label>
          <input type="text" class="input w-100" name="unit_price" id="unit_price" :value="formatRupiah(bookingPackageStore.bookingPackage.entertainment_package.price)" readonly>
        </div>
      </div>
      <div class="col-md-6">
        <div class="input-group d-flex flex-column">
          <label for="code">Code Booking</label>
          <input type="text" class="input w-100" name="code" id="code" v-model="bookingPackageStore.bookingPackage.code" readonly>
        </div>
      </div>
      <div class="col-md-6">
        <div class="input-group d-flex flex-column">
          <label for="date">Booking Date</label>
          <input type="text" class="input w-100" name="date" id="date" :value="formatDate(bookingPackageStore.bookingPackage.date)" readonly>
        </div>
      </div>
      <div class="col-md-6">
        <div class="input-group d-flex flex-column">
          <label for="customer">Customer</label>
          <input type="text" class="input w-100" name="customer" id="customer" v-model="bookingPackageStore.bookingPackage.name" readonly>
        </div>
      </div>
      <div class="col-md-6">
        <div class="input-group d-flex flex-column">
          <label for="phone_number">Phone Number</label>
          <input type="text" class="input w-100" name="phone_number" id="phone_number" v-model="bookingPackageStore.bookingPackage.phone_number" readonly>
        </div>
      </div>
      <div class="col-md-6">
        <div class="input-group d-flex flex-column">
          <label for="payment_method">Payment Method</label>
          <input type="text" class="input w-100" name="payment_method" id="payment_method" v-model="bookingPackageStore.bookingPackage.payment_method" readonly>
        </div>
      </div>
      <div class="col-md-6">
        <div class="input-group d-flex flex-column">
          <label for="total_price">Total Price</label>
          <input type="text" class="input w-100" name="total_price" id="total_price" :value="formatRupiah(bookingPackageStore.bookingPackage.total_price)" readonly>
        </div>
      </div>
      <div class="col-md-6">
        <div class="input-group d-flex flex-column">
          <label for="total_pay">Total Pay</label>
          <input type="text" class="input w-100" name="total_pay" id="total_pay" :value="formatRupiah(bookingPackageStore.bookingPackage.total_pay)" readonly>
        </div>
      </div>
      <div class="col-md-6">
        <div class="input-group d-flex flex-column">
          <label for="total_change">Total Change</label>
          <input type="text" class="input w-100" name="total_change" id="total_change" :value="formatRupiah(bookingPackageStore.bookingPackage.total_change)" readonly>
        </div>
      </div>
      <div class="col-12 d-flex gap-2 align-items-center">
        <NuxtLink :to="{path: '/homepage/profile/history-booking/package'}" class="button-reverse">Back to History Page</NuxtLink>
      </div>
    </div>
  </form>
</template>

<style scoped>
</style>