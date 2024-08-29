<script setup lang="ts">
import {useBookingServiceStore} from "~/stores/bookingService"
import {useRoute} from '#app'
import {formatRupiah} from "~/helpers/FormatRupiah"
import {formatDate} from "~/helpers/FormatDate"

definePageMeta({
  title: 'Detail History Booking Service Page',
  layout: 'dashboard'
})

const bookingServiceStore = useBookingServiceStore()
const route = useRoute()

await bookingServiceStore.getBookingServiceById(route.params.id)
</script>

<template>
  <div class="content container mt-4">
    <div class="row">
      <div class="col-12">
        <div class="card-default">
          <form class="form w-100">
            <div class="row g-3">
              <div class="col-12" v-for="(service, index) in bookingServiceStore.bookingService.details" :key="index">
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
                      <label for="unit_price">Unit Price</label>
                      <input type="text" class="input w-100" name="unit_price" id="unit_price" :value="formatRupiah(service.entertainment_service.price)" readonly>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="input-group d-flex flex-column">
                  <label for="code">Code Booking</label>
                  <input type="text" class="input w-100" name="code" id="code" v-model="bookingServiceStore.bookingService.code" readonly>
                </div>
              </div>
              <div class="col-md-6">
                <div class="input-group d-flex flex-column">
                  <label for="date">Booking Date</label>
                  <input type="text" class="input w-100" name="date" id="date" :value="formatDate(bookingServiceStore.bookingService.date)" readonly>
                </div>
              </div>
              <div class="col-md-6">
                <div class="input-group d-flex flex-column">
                  <label for="customer">Customer</label>
                  <input type="text" class="input w-100" name="customer" id="customer" v-model="bookingServiceStore.bookingService.name" readonly>
                </div>
              </div>
              <div class="col-md-6">
                <div class="input-group d-flex flex-column">
                  <label for="phone_number">Phone Number</label>
                  <input type="text" class="input w-100" name="phone_number" id="phone_number" v-model="bookingServiceStore.bookingService.phone_number" readonly>
                </div>
              </div>
              <div class="col-md-6">
                <div class="input-group d-flex flex-column">
                  <label for="payment_method">Payment Method</label>
                  <input type="text" class="input w-100" name="payment_method" id="payment_method" v-model="bookingServiceStore.bookingService.payment_method" readonly>
                </div>
              </div>
              <div class="col-md-6">
                <div class="input-group d-flex flex-column">
                  <label for="total_price">Total Price</label>
                  <input type="text" class="input w-100" name="total_price" id="total_price" :value="formatRupiah(bookingServiceStore.bookingService.total_price)" readonly>
                </div>
              </div>
              <div class="col-md-6">
                <div class="input-group d-flex flex-column">
                  <label for="total_pay">Total Pay</label>
                  <input type="text" class="input w-100" name="total_pay" id="total_pay" :value="formatRupiah(bookingServiceStore.bookingService.total_pay)" readonly>
                </div>
              </div>
              <div class="col-md-6">
                <div class="input-group d-flex flex-column">
                  <label for="total_change">Total Change</label>
                  <input type="text" class="input w-100" name="total_change" id="total_change" :value="formatRupiah(bookingServiceStore.bookingService.total_change)" readonly>
                </div>
              </div>
              <div class="col-12">
                <div class="button-group d-flex gap-2">
                  <NuxtLink :to="{path: '/dashboard/history-booking/service'}" class="button-reverse">Back to Page</NuxtLink>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>