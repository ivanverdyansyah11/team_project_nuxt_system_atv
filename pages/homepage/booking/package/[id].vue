<script setup lang="ts">
import {useBookingPackageStore} from "~/stores/bookingPackage"
import {useCustomerStore} from "~/stores/customer"
import {useBundleStore} from "~/stores/bundle"
import { useField, useForm } from 'vee-validate'
import {navigateTo} from "nuxt/app"
import {onMounted, ref} from 'vue'
import {useRoute} from '#app'
import * as yup from 'yup'
import Cookies from "js-cookie";

definePageMeta({
  layout: 'homepage'
})

const bookingPackageStore = useBookingPackageStore()
const customerStore = useCustomerStore()
const bundleStore = useBundleStore()
const route = useRoute()
const user = useCookie('auth-user')
const totalPrice = ref(0)

const schema = yup.object({
  customer_id: yup.string().required('Customer Id is required'),
  name: yup.string().required('Name is required'),
  phone_number: yup.string().required('Phone number is required'),
  payment_method: yup.string().required('Payment method is required'),
  date: yup.date().required('Date is required'),
  total_price: yup.number().required('Total price is required'),
  total_pay: yup.number().required('Total pay is required'),
  total_change: yup.number().required('Total change is required'),
  entertainment_package_id: yup.string(),
  qty: yup.number().required('Quantity is required'),
})

const { handleSubmit, setValues } = useForm({
  validationSchema: schema,
})

const { value: customer_id, errorMessage: customerIdError } = useField('customer_id')
const { value: name, errorMessage: nameError } = useField('name')
const { value: phone_number, errorMessage: phoneNumberError } = useField('phone_number')
const { value: payment_method, errorMessage: paymentMethodError } = useField('payment_method')
const { value: date, errorMessage: dateError } = useField('date')
const { value: total_price, errorMessage: totalPriceError } = useField('total_price')
const { value: total_pay, errorMessage: totalPayError } = useField('total_pay')
const { value: total_change, errorMessage: totalChangeError } = useField('total_change')
const { value: entertainment_package_id, errorMessage: entertainmentPackageIdError } = useField('entertainment_package_id')
const { value: qty, errorMessage: qtyError } = useField('qty')

const getCustomerData = async (customer_id) => {
  await customerStore.getCustomerById(customer_id)
  setValues({
    name: customerStore.customer.name,
    phone_number: customerStore.customer.phone_number,
  })
}

const getPrice = async () => {
  if(qty.value != undefined) {
    setValues({
      total_price: totalPrice.value * qty.value,
      total_pay: 0,
      total_change: 0,
    })
  } else {
    setValues({
      total_price: totalPrice.value,
    })
  }
}

const getChange = async () => {
  if(total_price.value != undefined || total_pay.value != undefined) {
    setValues({
      total_change: total_pay.value > total_price.value ? total_pay.value - total_price.value : 0,
    })
  } else {
    setValues({
      total_change: 0,
    })
  }
}

const create = handleSubmit(async (values) => {
  values.date = new Date(values.date).toISOString()
  delete values.qty
  try {
    const bookingId = await bookingPackageStore.createBookingPackage(values)
    if(bookingPackageStore.status_code === 201) {
      Cookies.set('booking-id', bookingId)
      Cookies.set('booking-type', 'package')
      navigateTo('/homepage/booking/success')
    }
  } catch (error) {
    navigateTo('/homepage/booking/success')
  }
})

onMounted(async () => {
  await bundleStore.getBundleById(route.params.id)
  totalPrice.value = bundleStore.bundle.price
  setValues({
    entertainment_package_id: bundleStore.bundle.id,
    qty: 1,
    total_price: totalPrice.value,
  })

  if (user.value.user.role == 'admin' || user.value.user.role == 'staff') {
    await customerStore.getAllCustomerWithoutPaginate()
  } else if (user.value.user.role == 'customer') {
    setValues({
      customer_id: user.value.id,
      name: user.value.name,
      phone_number: user.value.phone_number
    })
  }
})
</script>

<template>
  <section class="hero-small container">
    <div class="row">
      <div class="col-12">
        <h2 class="title text-capitalize">Checkout Package</h2>
      </div>
      <div class="col-12 mt-4">
        <div class="card-default">
          <form @submit.prevent="create" class="form w-100">
            <div class="row g-3">
              <div v-if="user.user.role == 'admin'" class="col-12">
                <div class="input-group d-flex flex-column">
                  <label for="customer_id">Customer</label>
                  <select v-model="customer_id" id="customer_id" class="input w-100" @change="getCustomerData(customer_id)">
                    <option v-for="(customer, index) in customerStore.customerAll" :key="index" :value="customer.id">{{customer.name}}</option>
                  </select>
                  <p v-if="customerIdError" class="invalid-label">{{ customerIdError }}</p>
                </div>
              </div>
              <div class="col-md-6">
                <div class="input-group d-flex flex-column">
                  <label for="name">Name</label>
                  <input type="text" class="input w-100" name="name" id="name"
                         placeholder="Select customer first" autocomplete="off" v-model="name" readonly>
                  <p v-if="nameError" class="invalid-label">{{ nameError }}</p>
                </div>
              </div>
              <div class="col-md-6">
                <div class="input-group d-flex flex-column">
                  <label for="phone_number">Phone Number</label>
                  <input type="text" class="input w-100" name="phone_number" id="phone_number"
                         placeholder="Select customer first" autocomplete="off" v-model="phone_number" readonly>
                  <p v-if="phoneNumberError" class="invalid-label">{{ phoneNumberError }}</p>
                </div>
              </div>
              <div class="col-md-6">
                <div class="input-group d-flex flex-column">
                  <label for="payment_method">Payment Method</label>
                  <select class="input w-100" name="payment_method" id="payment_method" v-model="payment_method">
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Virtual Account">Virtual Account</option>
                    <option value="GoPay">GoPay</option>
                    <option value="OVO">OVO</option>
                    <option value="DANA">DANA</option>
                    <option value="LinkAja">LinkAja</option>
                    <option value="ShopeePay">ShopeePay</option>
                    <option value="Kartu Kredit">Kartu Kredit</option>
                    <option value="Kredivo">Kredivo</option>
                    <option value="PayLater">PayLater</option>
                    <option value="Cash on Delivery">Cash on Delivery</option>
                    <option value="QRIS">QRIS</option>
                    <option value="Mobile Banking">Mobile Banking</option>
                    <option value="Internet Banking">Internet Banking</option>
                  </select>
                  <p v-if="paymentMethodError" class="invalid-label">{{ paymentMethodError }}</p>
                </div>
              </div>
              <div class="col-md-6">
                <div class="input-group d-flex flex-column">
                  <label for="date">Date</label>
                  <input type="datetime-local" class="input w-100" name="date" id="date"
                         placeholder="Enter your date.." autocomplete="off" v-model="date">
                  <p v-if="dateError" class="invalid-label">{{ dateError }}</p>
                </div>
              </div>
              <div class="col-md-4">
                <div class="input-group d-flex flex-column">
                  <label for="entertainment_package_id" class="text-capitalize">Package</label>
                  <input type="text" class="input w-100" id="entertainment_package_id" v-model="entertainment_package_id" readonly>
                </div>
              </div>
              <div class="col-md-4">
                <div class="input-group d-flex flex-column">
                  <label for="qty">Quantity</label>
                  <input type="number" class="input w-100" name="qty" id="qty"
                         placeholder="Enter your qty.." autocomplete="off" v-model="qty" @keyup="getPrice({ qty: qty.value })">
                  <p v-if="qtyError" class="invalid-label">{{ qtyError }}</p>
                </div>
              </div>
              <div class="col-md-4">
                <div class="input-group d-flex flex-column">
                  <label for="total_price">Total Price</label>
                  <input type="number" class="input w-100" name="total_price" id="total_price"
                         placeholder="Select service first.." autocomplete="off" v-model="total_price" readonly>
                  <p v-if="totalPriceError" class="invalid-label">{{ totalPriceError }}</p>
                </div>
              </div>
              <div class="col-md-6">
                <div class="input-group d-flex flex-column">
                  <label for="total_pay">Total Pay</label>
                  <input type="number" class="input w-100" name="total_pay" id="total_pay"
                         placeholder="Enter your total pay.." autocomplete="off" v-model="total_pay" @keyup="getChange({ total_pay: total_pay.value })">
                  <p v-if="totalPayError" class="invalid-label">{{ totalPayError }}</p>
                </div>
              </div>
              <div class="col-md-6">
                <div class="input-group d-flex flex-column">
                  <label for="total_change">Total Change</label>
                  <input type="number" class="input w-100" name="total_change" id="total_change"
                         placeholder="Enter your total change.." autocomplete="off" v-model="total_change" readonly>
                  <p v-if="totalChangeError" class="invalid-label">{{ totalChangeError }}</p>
                </div>
              </div>
              <div class="col-12">
                <div class="button-group d-flex gap-2">
                  <button type="submit" class="button-primary-small">Booking Now</button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>

</style>