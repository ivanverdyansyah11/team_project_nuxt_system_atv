<script setup lang="ts">
import {useRouteStore} from "~/stores/route"
import {ref, onMounted} from 'vue'
import {useField, useForm} from 'vee-validate'
import {getAlert, alertMessage, alertType, alertPage} from "~/helpers/Alert"
import Cookies from 'js-cookie'
import * as yup from 'yup'

definePageMeta({
  title: 'Route Page',
  layout: 'dashboard'
})

const keyword = ref('')
const routeStore = useRouteStore()
let routeLength = ref(0)
const routeData = ref(null)
const totalPages = ref(0)
const dynamicPath = ref('')
const linkRef = ref<HTMLAnchorElement | null>(null)

const schema = yup.object({
  name: yup.string().required('Name is required'),
  address: yup.string().required('Address is required'),
})

const { handleSubmit, setValues } = useForm({
  validationSchema: schema,
})

const { value: name, errorMessage: nameError } = useField('name')
const { value: address, errorMessage: addressError } = useField('address')

const search = async (event: any) => {
  event.preventDefault()
  routeStore.$state.keyword = keyword.value
  routeStore.$state.page = 1
  await routeStore.getAllRoute()
  routeLength.value = routeStore.routeAll.length
  totalPages.value = Math.ceil(routeStore.totalPages / routeStore.pageSize)
}

const changePage = async (page: number) => {
  routeStore.$state.page = page
  await routeStore.getAllRoute()
  routeLength.value = routeStore.routeAll.length
}

const exportRoute = async () => {
  const blob = await routeStore.exportRoute()
  const url = URL.createObjectURL(blob)
  dynamicPath.value = url
}

const removeRouteDetail = async () => {
  routeData.value = null
  removeInputValues()
}

const removeInputValues = () => {
  setValues({
    name: '',
    address: '',
  })
}

const routeDetail = async (routeSelect: any) => {
  await routeStore.getRouteById(routeSelect.id)
  routeData.value = routeSelect
  const route = routeStore.route
  setValues({
    name: route.name,
    address: route.address,
  })
}

const createRoute = handleSubmit( async (values) => {
  await routeStore.createRoute(values)
  if (routeStore.status_code === 201) {
    Cookies.set('alert-message', 'Successfully create new route')
    Cookies.set('alert-type', 'true')
    Cookies.set('alert-page', 'Route')
    getAlert()
    removeInputValues()
    await routeStore.getAllRoute()
    totalPages.value = Math.ceil(routeStore.totalPages / routeStore.pageSize)
    routeLength.value = routeStore.routeAll.length
  } else {
    getAlert()
  }
})

const updateRoute = handleSubmit( async (values) => {
  await routeStore.updateRoute(values, routeData.value.id)
  if (routeStore.status_code === 200) {
    Cookies.set('alert-message', 'Successfully update route')
    Cookies.set('alert-type', 'true')
    Cookies.set('alert-page', 'Route')
    getAlert()
    removeInputValues()
    routeData.value = null
    await routeStore.getAllRoute()
  } else {
    getAlert()
  }
})

const confirmDeleteRoute = async () => {
  if (routeData.value) {
    await routeStore.deleteRoute(routeData.value.id)
    if (routeStore.status_code === 200) {
      Cookies.set('alert-message', 'Successfully deleted route')
      Cookies.set('alert-type', 'true')
      Cookies.set('alert-page', 'Route')
      getAlert()
    }
    routeData.value = null
    routeLength.value = routeStore.routeAll.length
    totalPages.value = Math.ceil(routeLength.value / routeStore.pageSize)
  } else {
    getAlert()
  }
}

onMounted(async () => {
  await routeStore.getAllRoute()
  await exportRoute()
  routeLength.value = routeStore.routeAll.length
  totalPages.value = Math.ceil(routeStore.totalPages / routeStore.pageSize)
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
        <div v-if="alertPage == 'Route'" class="alert w-100" :class="alertType != false ? 'alert-success' : 'alert-danger'" role="alert">
          {{ alertMessage }}
        </div>
      </div>
      <div class="col-12">
        <div class="card-default">
          <div class="wrapper d-flex align-items-center justify-content-between gap-2">
            <form class="form w-100">
              <input type="search" class="input w-100" id="search" placeholder="Search route.."
                     autocomplete="off" v-model="keyword" @keyup="search">
            </form>
            <button type="button" class="button-primary-small d-none d-md-inline-block" data-bs-toggle="modal" data-bs-target="#createModal">Add New Route</button>
            <NuxtLink :to="dynamicPath" ref="linkRef" download class="button-reverse">Export Excel</NuxtLink>
          </div>
          <div class="wrapper-table mt-4">
            <table class="table" style="width:100%">
              <thead>
              <tr>
                <th>Name</th>
                <th>Address</th>
                <th style="width: 200px;"></th>
              </tr>
              </thead>
              <tbody>
              <tr v-if="routeLength > 0" v-for="(route, index) in routeStore.routeAll" :key="index">
                <td>{{route.name}}</td>
                <td>{{route.address}}</td>
                <td class="d-flex justify-content-end gap-1 table-mobile" style="width: 200px;">
                  <button type="button" data-bs-toggle="modal" data-bs-target="#detailModal" @click="routeDetail(route)"
                          class="wrapper-icon icon-detail d-flex align-items-center justify-content-center">
                    <i class="fa-solid fa-eye" style="font-size: 0.85rem;"></i>
                  </button>
                  <button type="button" data-bs-toggle="modal" data-bs-target="#updateModal" @click="routeDetail(route)"
                          class="wrapper-icon icon-edit d-flex align-items-center justify-content-center">
                    <i class="fa-solid fa-pen-to-square" style="font-size: 0.85rem;"></i>
                  </button>
                  <button type="button"
                          class="wrapper-icon icon-delete d-flex align-items-center justify-content-center"
                          data-bs-toggle="modal" data-bs-target="#deleteModal" @click="routeData = route">
                    <i class="fa-solid fa-trash-can" style="font-size: 0.85rem;"></i>
                  </button>
                </td>
              </tr>
              <tr v-else>
                <td colspan="3">Data route not found!</td>
              </tr>
              </tbody>
            </table>
            <nav aria-label="Page navigation example" v-if="totalPages > 1">
              <ul class="pagination">
                <li class="page-item" :class="{ disabled: routeStore.page === 1 }">
                  <button type="button" class="page-link" @click="changePage(routeStore.page - 1)" :disabled="routeStore.page === 1">Previous</button>
                </li>
                <li v-for="page in totalPages" :key="page" :class="{ active: page === routeStore.page }" class="page-item">
                  <button type="button" class="page-link" @click="changePage(page)">{{ page }}</button>
                </li>
                <li class="page-item" :class="{ disabled: routeStore.page === totalPages }">
                  <button type="button" class="page-link" @click="changePage(routeStore.page + 1)" :disabled="routeStore.page === totalPages">Next</button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="detailModal" tabindex="-1" aria-labelledby="detailModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header d-flex align-items-center justify-content-between">
            <h1 class="modal-title fs-5" id="detailModalLabel">Detail Route</h1>
            <button type="button" data-bs-dismiss="modal" aria-label="Close" @click="removeRouteDetail()">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
          <div class="modal-body">
            <form class="form">
              <div class="row g-3">
                <div class="col-12">
                  <div class="input-group d-flex flex-column">
                    <label for="name">Name</label>
                    <input type="text" class="input w-100" name="name" id="name" placeholder="Enter your name.." autocomplete="off" v-model="name" readonly>
                  </div>
                </div>
                <div class="col-12">
                  <div class="input-group d-flex flex-column">
                    <label for="address">Address</label>
                    <input type="text" class="input w-100" name="address" id="address" placeholder="Enter your address.." autocomplete="off" v-model="address" readonly>
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="button-reverse" data-bs-dismiss="modal" @click="removeRouteDetail()">Close Modal</button>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="createModal" tabindex="-1" aria-labelledby="createModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <form @submit.prevent="createRoute" class="form w-100">
            <div class="modal-header d-flex align-items-center justify-content-between">
              <h1 class="modal-title fs-5" id="createModalLabel">Create New Route</h1>
              <button type="button" data-bs-dismiss="modal" aria-label="Close">
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div class="modal-body">
              <div class="row g-3">
                <div class="col-12">
                  <div class="input-group d-flex flex-column">
                    <label for="name">Name</label>
                    <input type="text" class="input w-100" name="name" id="name"
                           placeholder="Enter your name.." autocomplete="off" v-model="name">
                    <p v-if="nameError" class="invalid-label">{{ nameError }}</p>
                  </div>
                </div>
                <div class="col-12">
                  <div class="input-group d-flex flex-column">
                    <label for="address">Address</label>
                    <input type="text" class="input w-100" name="address" id="address"
                           placeholder="Enter your address.." autocomplete="off" v-model="address">
                    <p v-if="addressError" class="invalid-label">{{ addressError }}</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="button-reverse" data-bs-dismiss="modal">Cancel Add</button>
              <button type="submit" class="button-primary-small" data-bs-dismiss="modal">Add New Route</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <div class="modal fade" id="updateModal" tabindex="-1" aria-labelledby="updateModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <form @submit.prevent="updateRoute" class="form w-100">
            <div class="modal-header d-flex align-items-center justify-content-between">
              <h1 class="modal-title fs-5" id="updateModalLabel">Edit Route</h1>
              <button type="button" data-bs-dismiss="modal" aria-label="Close" @click="removeRouteDetail()">
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div class="modal-body">
              <div class="row g-3">
                <div class="col-12">
                  <div class="input-group d-flex flex-column">
                    <label for="name">Name</label>
                    <input type="text" class="input w-100" name="name" id="name"
                           placeholder="Enter your name.." autocomplete="off" v-model="name">
                    <p v-if="nameError" class="invalid-label">{{ nameError }}</p>
                  </div>
                </div>
                <div class="col-12">
                  <div class="input-group d-flex flex-column">
                    <label for="address">Address</label>
                    <input type="text" class="input w-100" name="address" id="address"
                           placeholder="Enter your address.." autocomplete="off" v-model="address">
                    <p v-if="addressError" class="invalid-label">{{ addressError }}</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="button-reverse" data-bs-dismiss="modal" @click="removeRouteDetail()">Cancel Edit</button>
              <button type="submit" class="button-primary-small" data-bs-dismiss="modal">Save Changes</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <div class="modal fade" id="deleteModal" tabindex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header d-flex align-items-center justify-content-between">
            <h1 class="modal-title fs-5" id="deleteModalLabel">Delete Route</h1>
            <button type="button" data-bs-dismiss="modal" aria-label="Close">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
          <div class="modal-body">
            <p style="font-size: 0.913rem">Are you sure want to delete this route?</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="button-reverse" data-bs-dismiss="modal">Cancel Delete</button>
            <button type="button" class="button-primary-small" @click="confirmDeleteRoute" data-bs-dismiss="modal">Delete Route</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
