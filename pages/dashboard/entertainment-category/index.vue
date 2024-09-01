<script setup lang="ts">
import {useCategoryStore} from "~/stores/category"
import {ref, onMounted} from 'vue'
import {useField, useForm} from 'vee-validate'
import {getAlert, alertMessage, alertType, alertPage} from "~/helpers/Alert"
import Cookies from 'js-cookie'
import * as yup from 'yup'

definePageMeta({
  title: 'Category Page',
  layout: 'dashboard'
})

const keyword = ref('')
const categoryStore = useCategoryStore()
let categoryLength = ref(0)
const categoryData = ref(null)
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
  categoryStore.$state.keyword = keyword.value
  categoryStore.$state.page = 1
  await categoryStore.getAllCategory()
  categoryLength.value = categoryStore.categoryAll.length
  totalPages.value = Math.ceil(categoryStore.totalPages / categoryStore.pageSize)
}

const changePage = async (page: number) => {
  categoryStore.$state.page = page
  await categoryStore.getAllCategory()
  categoryLength.value = categoryStore.categoryAll.length
}

const exportCategory = async () => {
  const blob = await categoryStore.exportCategory()
  const url = URL.createObjectURL(blob)
  dynamicPath.value = url
}

const removeInputValues = () => {
  setValues({
    name: '',
  })
}

const removeCategoryDetail = async () => {
  categoryData.value = null
  removeInputValues()
}

const categoryDetail = async (categorySelect: any) => {
  await categoryStore.getCategoryById(categorySelect.id)
  categoryData.value = categorySelect
  const category = categoryStore.category
  setValues({
    name: category.name,
  })
}

const createCategory = handleSubmit( async (values) => {
  await categoryStore.createCategory(values)
  if (categoryStore.status_code === 201) {
    Cookies.set('alert-message', 'Successfully create new entertainment category')
    Cookies.set('alert-type', 'true')
    Cookies.set('alert-page', 'Category')
    getAlert()
    removeInputValues()
    await categoryStore.getAllCategory()
    totalPages.value = Math.ceil(categoryStore.totalPages / categoryStore.pageSize)
    categoryLength.value = categoryStore.categoryAll.length
  } else {
    getAlert()
  }
})

const updateCategory = handleSubmit( async (values) => {
  await categoryStore.updateCategory(values, categoryData.value.id)
  if (categoryStore.status_code === 200) {
    Cookies.set('alert-message', 'Successfully update entertainment category')
    Cookies.set('alert-type', 'true')
    Cookies.set('alert-page', 'Category')
    getAlert()
    removeInputValues()
    categoryData.value = null
    await categoryStore.getAllCategory()
  } else {
    getAlert()
  }
})

const confirmDeleteCategory = async () => {
  if (categoryData.value) {
    await categoryStore.deleteCategory(categoryData.value.id)
    if (categoryStore.status_code === 200) {
      Cookies.set('alert-message', 'Successfully deleted entertainment category')
      Cookies.set('alert-type', 'true')
      Cookies.set('alert-page', 'Category')
      getAlert()
    }
    categoryData.value = null
    categoryLength.value = categoryStore.categoryAll.length
    totalPages.value = Math.ceil(categoryLength.value / categoryStore.pageSize)
  } else {
    getAlert()
  }
}

onMounted(async () => {
  await categoryStore.getAllCategory()
  await exportCategory()
  categoryLength.value = categoryStore.categoryAll.length
  totalPages.value = Math.ceil(categoryStore.totalPages / categoryStore.pageSize)
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
        <div v-if="alertPage == 'Category'" class="alert w-100" :class="alertType != false ? 'alert-success' : 'alert-danger'" role="alert">
          {{ alertMessage }}
        </div>
      </div>
      <div class="col-12">
        <div class="card-default">
          <div class="wrapper d-flex align-items-center justify-content-between gap-2">
            <form class="form w-100">
              <input type="search" class="input w-100" id="search" placeholder="Search category.."
                     autocomplete="off" v-model="keyword" @keyup="search">
            </form>
            <button type="button" class="button-primary-small d-none d-md-inline-block" data-bs-toggle="modal" data-bs-target="#createModal">Add
              New
              Category</button>
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
              <tr v-if="categoryLength > 0" v-for="(category, index) in categoryStore.categoryAll" :key="index">
                <td>{{category.name}}</td>
                <td class="d-flex justify-content-end gap-1 table-mobile" style="width: 200px;">
                  <button type="button" data-bs-toggle="modal" data-bs-target="#detailModal" @click="categoryDetail(category)"
                            class="wrapper-icon icon-detail d-flex align-items-center justify-content-center">
                    <i class="fa-solid fa-eye" style="font-size: 0.85rem;"></i>
                  </button>
                  <button type="button" data-bs-toggle="modal" data-bs-target="#updateModal" @click="categoryDetail(category)"
                            class="wrapper-icon icon-edit d-flex align-items-center justify-content-center">
                    <i class="fa-solid fa-pen-to-square" style="font-size: 0.85rem;"></i>
                  </button>
                  <button type="button"
                          class="wrapper-icon icon-delete d-flex align-items-center justify-content-center"
                          data-bs-toggle="modal" data-bs-target="#deleteModal" @click="categoryData = category">
                    <i class="fa-solid fa-trash-can" style="font-size: 0.85rem;"></i>
                  </button>
                </td>
              </tr>
              <tr v-else>
                <td colspan="2">Data category not found!</td>
              </tr>
              </tbody>
            </table>
            <nav aria-label="Page navigation example" v-if="totalPages > 1">
              <ul class="pagination">
                <li class="page-item" :class="{ disabled: categoryStore.page === 1 }">
                  <button type="button" class="page-link" @click="changePage(categoryStore.page - 1)" :disabled="categoryStore.page === 1">Previous</button>
                </li>
                <li v-for="page in totalPages" :key="page" :class="{ active: page === categoryStore.page }" class="page-item">
                  <button type="button" class="page-link" @click="changePage(page)">{{ page }}</button>
                </li>
                <li class="page-item" :class="{ disabled: categoryStore.page === totalPages }">
                  <button type="button" class="page-link" @click="changePage(categoryStore.page + 1)" :disabled="categoryStore.page === totalPages">Next</button>
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
            <h1 class="modal-title fs-5" id="detailModalLabel">Detail Category</h1>
            <button type="button" data-bs-dismiss="modal" aria-label="Close" @click="removeCategoryDetail()">
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
            <button type="button" class="button-reverse" data-bs-dismiss="modal" @click="removeCategoryDetail()">Close Modal</button>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="createModal" tabindex="-1" aria-labelledby="createModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <form @submit.prevent="createCategory" class="form w-100">
            <div class="modal-header d-flex align-items-center justify-content-between">
              <h1 class="modal-title fs-5" id="createModalLabel">Create New Category</h1>
              <button type="button" data-bs-dismiss="modal" aria-label="Close" @click="removeCategoryDetail()">
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
              <button type="button" class="button-reverse" data-bs-dismiss="modal" @click="removeCategoryDetail()">Cancel Add</button>
              <button type="submit" class="button-primary-small" data-bs-dismiss="modal">Add New Category</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <div class="modal fade" id="updateModal" tabindex="-1" aria-labelledby="updateModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <form @submit.prevent="updateCategory" class="form w-100">
            <div class="modal-header d-flex align-items-center justify-content-between">
              <h1 class="modal-title fs-5" id="updateModalLabel">Edit Category</h1>
              <button type="button" data-bs-dismiss="modal" aria-label="Close" @click="removeCategoryDetail()">
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
              <button type="button" class="button-reverse" data-bs-dismiss="modal" @click="removeCategoryDetail()">Cancel Edit</button>
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
            <h1 class="modal-title fs-5" id="deleteModalLabel">Delete Category</h1>
            <button type="button" data-bs-dismiss="modal" aria-label="Close">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
          <div class="modal-body">
            <p style="font-size: 0.913rem">Are you sure want to delete this category?</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="button-reverse" data-bs-dismiss="modal">Cancel Delete</button>
            <button type="button" class="button-primary-small" @click="confirmDeleteCategory" data-bs-dismiss="modal">Delete Category</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
