<script setup lang="ts">
import {useLuggageStore} from "~/stores/luggage"
import {ref, onMounted} from 'vue'
import {useField, useForm} from 'vee-validate'
import {getAlert, alertMessage, alertType, alertPage} from "~/helpers/Alert"
import Cookies from 'js-cookie'
import * as yup from 'yup'

definePageMeta({
  title: 'Luggage Page',
  layout: 'dashboard'
})

const keyword = ref('')
const luggageStore = useLuggageStore()
let luggageLength = ref(0)
const luggageData = ref(null)
const totalPages = ref(0)
const dynamicPath = ref('')
const linkRef = ref<HTMLAnchorElement | null>(null)

const schema = yup.object({
  name: yup.string().required('Name is required'),
})

const { handleSubmit, resetForm, setValues } = useForm({
  validationSchema: schema,
})

const { value: name, errorMessage: nameError } = useField('name')

const search = async (event: any) => {
  event.preventDefault()
  luggageStore.$state.keyword = keyword.value
  luggageStore.$state.page = 1
  await luggageStore.getAllLuggage()
  luggageLength.value = luggageStore.luggageAll.length
  totalPages.value = Math.ceil(luggageStore.totalPages / luggageStore.pageSize)
}

const changePage = async (page: number) => {
  luggageStore.$state.page = page
  await luggageStore.getAllLuggage()
  luggageLength.value = luggageStore.luggageAll.length
}

const exportLuggage = async () => {
  const blob = await luggageStore.exportLuggage()
  const url = URL.createObjectURL(blob)
  dynamicPath.value = url
}

const removeInputValues = () => {
  setValues({
    name: '',
  })
}

const removeLuggageDetail = async () => {
  luggageData.value = null
  removeInputValues()
}

const luggageDetail = async (luggageSelect: any) => {
  await luggageStore.getLuggageById(luggageSelect.id)
  luggageData.value = luggageSelect
  const luggage = luggageStore.luggage
  setValues({
    name: luggage.name,
  })
}

const createLuggage = handleSubmit( async (values) => {
  await luggageStore.createLuggage(values)
  if (luggageStore.status_code === 201) {
    Cookies.set('alert-message', 'Successfully create new luggage')
    Cookies.set('alert-type', 'true')
    Cookies.set('alert-page', 'Luggage')
    getAlert()
    removeInputValues()
    await luggageStore.getAllLuggage()
    totalPages.value = Math.ceil(luggageStore.totalPages / luggageStore.pageSize)
    luggageLength.value = luggageStore.luggageAll.length
  } else {
    getAlert()
  }
})

const updateLuggage = handleSubmit( async (values) => {
  await luggageStore.updateLuggage(values, luggageData.value.id)
  if (luggageStore.status_code === 200) {
    Cookies.set('alert-message', 'Successfully update luggage')
    Cookies.set('alert-type', 'true')
    Cookies.set('alert-page', 'Luggage')
    getAlert()
    removeInputValues()
    luggageData.value = null
    await luggageStore.getAllLuggage()
  } else {
    getAlert()
  }
})

const confirmDeleteLuggage = async () => {
  if (luggageData.value) {
    await luggageStore.deleteLuggage(luggageData.value.id)
    if (luggageStore.status_code === 200) {
      Cookies.set('alert-message', 'Successfully deleted luggage')
      Cookies.set('alert-type', 'true')
      Cookies.set('alert-page', 'Luggage')
      getAlert()
    }
    luggageData.value = null
    luggageLength.value = luggageStore.luggageAll.length
    totalPages.value = Math.ceil(luggageLength.value / luggageStore.pageSize)
  } else {
    Cookies.set('alert-message', 'Failed to get data luggage')
    Cookies.set('alert-type', 'false')
    Cookies.set('alert-page', 'Luggage')
    getAlert()
  }
}

onMounted(async () => {
  await luggageStore.getAllLuggage()
  await exportLuggage()
  luggageLength.value = luggageStore.luggageAll.length
  totalPages.value = Math.ceil(luggageStore.totalPages / luggageStore.pageSize)
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
        <div v-if="alertPage == 'Luggage'" class="alert w-100" :class="alertType != false ? 'alert-success' : 'alert-danger'" role="alert">
          {{ alertMessage }}
        </div>
      </div>
      <div class="col-12">
        <div class="card-default">
          <div class="wrapper d-flex align-items-center justify-content-between gap-2">
            <form class="form w-100">
              <input type="search" class="input w-100" id="search" placeholder="Search luggage.."
                     autocomplete="off" v-model="keyword" @keyup="search">
            </form>
            <button type="button" class="button-primary-small d-none d-md-inline-block" data-bs-toggle="modal" data-bs-target="#createModal">Add
              New
              Luggage</button>
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
              <tr v-if="luggageLength > 0" v-for="(luggage, index) in luggageStore.luggageAll" :key="index">
                <td>{{luggage.name}}</td>
                <td class="d-flex justify-content-end gap-1 table-mobile" style="width: 200px;">
                  <button type="button" data-bs-toggle="modal" data-bs-target="#detailModal" @click="luggageDetail(luggage)"
                            class="wrapper-icon icon-detail d-flex align-items-center justify-content-center">
                    <i class="fa-solid fa-eye" style="font-size: 0.85rem;"></i>
                  </button>
                  <button type="button" data-bs-toggle="modal" data-bs-target="#updateModal" @click="luggageDetail(luggage)"
                            class="wrapper-icon icon-edit d-flex align-items-center justify-content-center">
                    <i class="fa-solid fa-pen-to-square" style="font-size: 0.85rem;"></i>
                  </button>
                  <button type="button"
                          class="wrapper-icon icon-delete d-flex align-items-center justify-content-center"
                          data-bs-toggle="modal" data-bs-target="#deleteModal" @click="luggageData = luggage">
                    <i class="fa-solid fa-trash-can" style="font-size: 0.85rem;"></i>
                  </button>
                </td>
              </tr>
              <tr v-else>
                <td colspan="2">Data luggage not found!</td>
              </tr>
              </tbody>
            </table>
            <nav aria-label="Page navigation example" v-if="totalPages > 1">
              <ul class="pagination">
                <li class="page-item" :class="{ disabled: luggageStore.page === 1 }">
                  <button type="button" class="page-link" @click="changePage(luggageStore.page - 1)" :disabled="luggageStore.page === 1">Previous</button>
                </li>
                <li v-for="page in totalPages" :key="page" :class="{ active: page === luggageStore.page }" class="page-item">
                  <button type="button" class="page-link" @click="changePage(page)">{{ page }}</button>
                </li>
                <li class="page-item" :class="{ disabled: luggageStore.page === totalPages }">
                  <button type="button" class="page-link" @click="changePage(luggageStore.page + 1)" :disabled="luggageStore.page === totalPages">Next</button>
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
            <h1 class="modal-title fs-5" id="detailModalLabel">Detail Luggage</h1>
            <button type="button" data-bs-dismiss="modal" aria-label="Close" @click="removeLuggageDetail()">
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
            <button type="button" class="button-reverse" data-bs-dismiss="modal" @click="removeLuggageDetail()">Close Modal</button>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="createModal" tabindex="-1" aria-labelledby="createModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <form @submit.prevent="createLuggage" class="form w-100">
            <div class="modal-header d-flex align-items-center justify-content-between">
              <h1 class="modal-title fs-5" id="createModalLabel">Create New Luggage</h1>
              <button type="button" data-bs-dismiss="modal" aria-label="Close" @click="removeLuggageDetail()">
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
              <button type="button" class="button-reverse" data-bs-dismiss="modal" @click="removeLuggageDetail()">Cancel Add</button>
              <button type="submit" class="button-primary-small" data-bs-dismiss="modal">Add New Luggage</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <div class="modal fade" id="updateModal" tabindex="-1" aria-labelledby="updateModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <form @submit.prevent="updateLuggage" class="form w-100">
            <div class="modal-header d-flex align-items-center justify-content-between">
              <h1 class="modal-title fs-5" id="updateModalLabel">Edit Luggage</h1>
              <button type="button" data-bs-dismiss="modal" aria-label="Close" @click="removeLuggageDetail()">
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
              <button type="button" class="button-reverse" data-bs-dismiss="modal" @click="removeLuggageDetail()">Cancel Edit</button>
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
            <h1 class="modal-title fs-5" id="deleteModalLabel">Delete Luggage</h1>
            <button type="button" data-bs-dismiss="modal" aria-label="Close">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
          <div class="modal-body">
            <p style="font-size: 0.913rem">Are you sure want to delete this luggage?</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="button-reverse" data-bs-dismiss="modal">Cancel Delete</button>
            <button type="button" class="button-primary-small" @click="confirmDeleteLuggage" data-bs-dismiss="modal">Delete Luggage</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
