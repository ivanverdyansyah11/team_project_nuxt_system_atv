<script setup lang="ts">
import {useBookingStore} from "~/stores/booking"
import {useRoute} from '#app'
import {formatRupiah} from "~/helpers/FormatRupiah"
import {formatDate} from "~/helpers/FormatDate"

definePageMeta({
  layout: 'profile',
})

const bookingStore = useBookingStore()
const route = useRoute()

await bookingStore.getBookingById(route.params.id)
</script>

<template>
  <form class="form w-100">
    <div class="row g-3">
      <div class="col-12" v-for="(service, index) in bookingStore.booking.details" :key="index">
        <div class="row">
          <div class="col-md-4">
            <div class="input-group d-flex flex-column">
              <label for="name">Service Name</label>
              <input type="text" class="input w-100" name="name" id="name" v-model="service.entertainment_service.name" readonly>
            </div>
          </div>
          <div class="col-md-4">
            <div class="input-group d-flex flex-column">
              <label for="qty">Quantity</label>
              <input type="text" class="input w-100" name="qty" id="qty" v-model="service.qty" readonly>
            </div>
          </div>
          <div class="col-md-4">
            <div class="input-group d-flex flex-column">
              <label for="price">Price</label>
              <input type="text" class="input w-100" name="price" id="price" :value="formatRupiah(service.price)" readonly>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="input-group d-flex flex-column">
          <label for="code">Code Booking</label>
          <input type="text" class="input w-100" name="code" id="code" v-model="bookingStore.booking.code" readonly>
        </div>
      </div>
      <div class="col-md-6">
        <div class="input-group d-flex flex-column">
          <label for="date">Booking Date</label>
          <input type="text" class="input w-100" name="date" id="date" :value="formatDate(bookingStore.booking.date)" readonly>
        </div>
      </div>
      <div class="col-md-6">
        <div class="input-group d-flex flex-column">
          <label for="customer">Customer</label>
          <input type="text" class="input w-100" name="customer" id="customer" v-model="bookingStore.booking.name" readonly>
        </div>
      </div>
      <div class="col-md-6">
        <div class="input-group d-flex flex-column">
          <label for="phone_number">Phone Number</label>
          <input type="text" class="input w-100" name="phone_number" id="phone_number" v-model="bookingStore.booking.phone_number" readonly>
        </div>
      </div>
      <div class="col-md-6">
        <div class="input-group d-flex flex-column">
          <label for="payment_method">Payment Method</label>
          <input type="text" class="input w-100" name="payment_method" id="payment_method" v-model="bookingStore.booking.payment_method" readonly>
        </div>
      </div>
      <div class="col-md-6">
        <div class="input-group d-flex flex-column">
          <label for="total_price">Total Price</label>
          <input type="text" class="input w-100" name="total_price" id="total_price" :value="formatRupiah(bookingStore.booking.total_price)" readonly>
        </div>
      </div>
      <div class="col-md-6">
        <div class="input-group d-flex flex-column">
          <label for="total_pay">Total Pay</label>
          <input type="text" class="input w-100" name="total_pay" id="total_pay" :value="formatRupiah(bookingStore.booking.total_pay)" readonly>
        </div>
      </div>
      <div class="col-md-6">
        <div class="input-group d-flex flex-column">
          <label for="total_change">Total Change</label>
          <input type="text" class="input w-100" name="total_change" id="total_change" :value="formatRupiah(bookingStore.booking.total_change)" readonly>
        </div>
      </div>
      <div class="col-12 d-flex gap-2 align-items-center">
        <NuxtLink :to="{path: '/homepage/profile/history-booking'}" class="button-reverse">Back to History Page</NuxtLink>
      </div>
    </div>
  </form>
</template>

<style scoped>
</style>