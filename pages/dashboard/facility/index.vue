<script setup lang="ts">
import {useFacilityStore} from "~/stores/facility"
import {ref, onMounted} from 'vue'
import {useField, useForm} from 'vee-validate'
import {getAlert, alertMessage, alertType, alertPage} from "~/helpers/Alert"
import Cookies from 'js-cookie'
import * as yup from 'yup'

definePageMeta({
  title: 'Facility Page',
  layout: 'dashboard'
})

const keyword = ref('')
const facilityStore = useFacilityStore()
let facilityLength = ref(0)
const facilityData = ref(null)
const totalPages = ref(0)
const dynamicPath = ref('')
const linkRef = ref<HTMLAnchorElement | null>(null)

const schema = yup.object({
  name: yup.string().required('Name is required'),
})

const { handleSubmit, setValues } = useForm({
  validationSchema: schema,
})

const { value: name, errorMessage: nameError } = useField('name')

const search = async (event: any) => {
  event.preventDefault()
  facilityStore.$state.keyword = keyword.value
  facilityStore.$state.page = 1
  await facilityStore.getAllFacility()
  facilityLength.value = facilityStore.facilityAll.length
  totalPages.value = Math.ceil(facilityStore.totalPages / facilityStore.pageSize)
}

const changePage = async (page: number) => {
  facilityStore.$state.page = page
  await facilityStore.getAllFacility()
  facilityLength.value = facilityStore.facilityAll.length
}

const exportFacility = async () => {
  const blob = await facilityStore.exportFacility()
  const url = URL.createObjectURL(blob)
  dynamicPath.value = url
}

const facilityDetail = async (facilitySelect: any) => {
  await facilityStore.getFacilityById(facilitySelect.id)
  facilityData.value = facilitySelect
  const facility = facilityStore.facility
  setValues({
    name: facility.name,
  })
}

const removeInputValues = () => {
  setValues({
    name: '',
  })
}

const removeFacilityDetail = async () => {
  facilityData.value = null
  removeInputValues()
}

const createFacility = handleSubmit( async (values) => {
  await facilityStore.createFacility(values)
  if (facilityStore.status_code === 201) {
    Cookies.set('alert-message', 'Successfully create new facility')
    Cookies.set('alert-type', 'true')
    Cookies.set('alert-page', 'Facility')
    getAlert()
    removeInputValues()
    await facilityStore.getAllFacility()
    totalPages.value = Math.ceil(facilityStore.totalPages / facilityStore.pageSize)
    facilityLength.value = facilityStore.facilityAll.length
  } else {
    getAlert()
  }
})

const updateFacility = handleSubmit( async (values) => {
  await facilityStore.updateFacility(values, facilityData.value.id)
  if (facilityStore.status_code === 200) {
    Cookies.set('alert-message', 'Successfully update facility')
    Cookies.set('alert-type', 'true')
    Cookies.set('alert-page', 'Facility')
    getAlert()
    removeInputValues()
    facilityData.value = null
    await facilityStore.getAllFacility()
  } else {
    getAlert()
  }
})

const confirmDeleteFacility = async () => {
  if (facilityData.value) {
    await facilityStore.deleteFacility(facilityData.value.id)
    if (facilityStore.status_code === 200) {
      Cookies.set('alert-message', 'Successfully deleted facility')
      Cookies.set('alert-type', 'true')
      Cookies.set('alert-page', 'Facility')
      getAlert()
    }
    facilityData.value = null
    facilityLength.value = facilityStore.facilityAll.length
    totalPages.value = Math.ceil(facilityLength.value / facilityStore.pageSize)
  } else {
    getAlert()
  }
}

onMounted(async () => {
  await facilityStore.getAllFacility()
  await exportFacility()
  facilityLength.value = facilityStore.facilityAll.length
  totalPages.value = Math.ceil(facilityStore.totalPages / facilityStore.pageSize)
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
        <div v-if="alertPage == 'Facility'" class="alert w-100" :class="alertType != false ? 'alert-success' : 'alert-danger'" role="alert">
          {{ alertMessage }}
        </div>
      </div>
      <div class="col-12">
        <div class="card-default">
          <div class="wrapper d-flex align-items-center justify-content-between gap-2">
            <form class="form w-100">
              <input type="search" class="input w-100" id="search" placeholder="Search facility.."
                     autocomplete="off" v-model="keyword" @keyup="search">
            </form>
            <button type="button" class="button-primary-small d-none d-md-inline-block" data-bs-toggle="modal" data-bs-target="#createModal">Add
              New
              Facility</button>
            <NuxtLink :to="dynamicPath" ref="linkRef" download class="button-reverse">Export Excel</NuxtLink>
          </div>
          <div class="wrapper-table mt-4">
            <table class="table" style="width:100%">
              <thead>
              <tr>
                <th>Name</th>
                <th style="width: 200px;"></th>
              </tr>
              </thead>
              <tbody>
              <tr v-if="facilityLength > 0" v-for="(facility, index) in facilityStore.facilityAll" :key="index">
                <td>{{facility.name}}</td>
                <td class="d-flex justify-content-end gap-1 table-mobile" style="width: 200px;">
                  <button type="button" data-bs-toggle="modal" data-bs-target="#detailModal" @click="facilityDetail(facility)"
                            class="wrapper-icon icon-detail d-flex align-items-center justify-content-center">
                    <i class="fa-solid fa-eye" style="font-size: 0.85rem;"></i>
                  </button>
                  <button type="button" data-bs-toggle="modal" data-bs-target="#updateModal" @click="facilityDetail(facility)"
                            class="wrapper-icon icon-edit d-flex align-items-center justify-content-center">
                    <i class="fa-solid fa-pen-to-square" style="font-size: 0.85rem;"></i>
                  </button>
                  <button type="button"
                          class="wrapper-icon icon-delete d-flex align-items-center justify-content-center"
                          data-bs-toggle="modal" data-bs-target="#deleteModal" @click="facilityData = facility">
                    <i class="fa-solid fa-trash-can" style="font-size: 0.85rem;"></i>
                  </button>
                </td>
              </tr>
              <tr v-else>
                <td colspan="2">Data facility not found!</td>
              </tr>
              </tbody>
            </table>
            <nav aria-label="Page navigation example" v-if="totalPages > 1">
              <ul class="pagination">
                <li class="page-item" :class="{ disabled: facilityStore.page === 1 }">
                  <button type="button" class="page-link" @click="changePage(facilityStore.page - 1)" :disabled="facilityStore.page === 1">Previous</button>
                </li>
                <li v-for="page in totalPages" :key="page" :class="{ active: page === facilityStore.page }" class="page-item">
                  <button type="button" class="page-link" @click="changePage(page)">{{ page }}</button>
                </li>
                <li class="page-item" :class="{ disabled: facilityStore.page === totalPages }">
                  <button type="button" class="page-link" @click="changePage(facilityStore.page + 1)" :disabled="facilityStore.page === totalPages">Next</button>
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
            <h1 class="modal-title fs-5" id="detailModalLabel">Detail Facility</h1>
            <button type="button" data-bs-dismiss="modal" aria-label="Close" @click="removeFacilityDetail()">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
          <div class="modal-body">
            <form class="form">
              <div class="row g-3">
                <div class="col-12">
                  <div class="input-group d-flex flex-column">
                    <label for="name">Name</label>
                    <input type="text" class="input w-100" name="name" id="name"
                           placeholder="Enter your name.." autocomplete="off" v-model="name" readonly>
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="button-reverse" data-bs-dismiss="modal" @click="removeFacilityDetail()">Close Modal</button>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="createModal" tabindex="-1" aria-labelledby="createModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <form @submit.prevent="createFacility" class="form w-100">
            <div class="modal-header d-flex align-items-center justify-content-between">
              <h1 class="modal-title fs-5" id="createModalLabel">Create New Facility</h1>
              <button type="button" data-bs-dismiss="modal" aria-label="Close" @click="removeFacilityDetail()">
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
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="button-reverse" data-bs-dismiss="modal" @click="removeFacilityDetail()">Cancel Add</button>
              <button type="submit" class="button-primary-small" data-bs-dismiss="modal">Add New Facility</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <div class="modal fade" id="updateModal" tabindex="-1" aria-labelledby="updateModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <form @submit.prevent="updateFacility" class="form w-100">
            <div class="modal-header d-flex align-items-center justify-content-between">
              <h1 class="modal-title fs-5" id="updateModalLabel">Edit Facility</h1>
              <button type="button" data-bs-dismiss="modal" aria-label="Close" @click="removeFacilityDetail()">
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
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="button-reverse" data-bs-dismiss="modal" @click="removeFacilityDetail()">Cancel Edit</button>
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
            <h1 class="modal-title fs-5" id="deleteModalLabel">Delete Facility</h1>
            <button type="button" data-bs-dismiss="modal" aria-label="Close">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
          <div class="modal-body">
            <p style="font-size: 0.913rem">Are you sure want to delete this facility?</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="button-reverse" data-bs-dismiss="modal">Cancel Delete</button>
            <button type="button" class="button-primary-small" @click="confirmDeleteFacility" data-bs-dismiss="modal">Delete Facility</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
