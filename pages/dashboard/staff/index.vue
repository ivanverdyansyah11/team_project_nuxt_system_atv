<script setup lang="ts">
import {useStaffStore} from "~/stores/staff"
import {ref, onMounted} from 'vue'
import {useField, useForm} from 'vee-validate'
import {getAlert, alertMessage, alertType, alertPage} from "~/helpers/Alert"
import Cookies from 'js-cookie'
import * as yup from 'yup'

definePageMeta({
  title: 'Staff Page',
  layout: 'dashboard'
})

const keyword = ref('')
const staffStore = useStaffStore()
let staffLength = ref(0)
const staffData = ref(null)
const totalPages = ref(0)
const dynamicPath = ref('')
const linkRef = ref<HTMLAnchorElement | null>(null)
const passwordErrorRequired = ref()

const schema = yup.object({
  name: yup.string().required('Name is required'),
  employee_code: yup.string().required('Employee code is required'),
  username: yup.string().required('Username is required'),
  email: yup.string().email().required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').notRequired(),
})

const { handleSubmit, resetForm, setValues } = useForm({
  validationSchema: schema,
})

const { value: name, errorMessage: nameError } = useField('name')
const { value: employee_code, errorMessage: employeeCodeError } = useField('employee_code')
const { value: username, errorMessage: usernameError } = useField('username')
const { value: email, errorMessage: emailError } = useField('email')
const { value: password, errorMessage: passwordError } = useField('password')

const search = async (event: any) => {
  event.preventDefault()
  staffStore.$state.keyword = keyword.value
  staffStore.$state.page = 1
  await staffStore.getAllStaff()
  staffLength.value = staffStore.staffAll.length
  totalPages.value = Math.ceil(staffStore.totalPages / staffStore.pageSize)
}

const changePage = async (page: number) => {
  staffStore.$state.page = page
  await staffStore.getAllStaff()
  staffLength.value = staffStore.staffAll.length
}

const exportStaff = async () => {
  const blob = await staffStore.exportStaff()
  const url = URL.createObjectURL(blob)
  dynamicPath.value = url
}

const staffDetail = async (staffSelect: any) => {
  await staffStore.getStaffById(staffSelect.id)
  staffData.value = staffSelect
  const staff = staffStore.staff
  setValues({
    name: staff.name,
    employee_code: staff.employee_code,
    username: staff.user.username,
    email: staff.user.email,
  })
}

const removeInputValues = () => {
  setValues({
    name: '',
    employee_code: '',
    username: '',
    email: '',
    password: '',
  })
}

const removeStaffDetail = async () => {
  staffData.value = null
  removeInputValues()
}

const createStaff = handleSubmit( async (values) => {
  if (values.password != undefined) {
    await staffStore.createStaff(values)
    if (staffStore.status_code === 201) {
      Cookies.set('alert-message', 'Successfully create new staff')
      Cookies.set('alert-type', 'true')
      Cookies.set('alert-page', 'Staff')
      getAlert()
      removeInputValues()
      await staffStore.getAllStaff()
      totalPages.value = Math.ceil(staffStore.totalPages / staffStore.pageSize)
      staffLength.value = staffStore.staffAll.length
    } else {
      getAlert()
    }
  } else {
    passwordErrorRequired.value = 'Password is required'
  }
})

const updateStaff = handleSubmit( async (values) => {
  await staffStore.updateStaff(values, staffData.value.id)
  if (staffStore.status_code === 200) {
    Cookies.set('alert-message', 'Successfully update staff')
    Cookies.set('alert-type', 'true')
    Cookies.set('alert-page', 'Staff')
    getAlert()
    removeInputValues()
    staffData.value = null
    await staffStore.getAllStaff()
  } else {
    getAlert()
  }
})

const confirmDeleteStaff = async () => {
  if (staffData.value) {
    await staffStore.deleteStaff(staffData.value.id)
    if (staffStore.status_code === 200) {
      Cookies.set('alert-message', 'Successfully deleted staff')
      Cookies.set('alert-type', 'true')
      Cookies.set('alert-page', 'Staff')
      getAlert()
    }
    staffData.value = null
    staffLength.value = staffStore.staffAll.length
    totalPages.value = Math.ceil(staffLength.value / staffStore.pageSize)
  } else {
    getAlert()
  }
}

onMounted(async () => {
  await staffStore.getAllStaff()
  await exportStaff()
  staffLength.value = staffStore.staffAll.length
  totalPages.value = Math.ceil(staffStore.totalPages / staffStore.pageSize)
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
        <div v-if="alertPage == 'Staff'" class="alert w-100" :class="alertType != false ? 'alert-success' : 'alert-danger'" role="alert">
          {{ alertMessage }}
        </div>
      </div>
      <div class="col-12">
        <div class="card-default">
          <div class="wrapper d-flex align-items-center justify-content-between gap-2">
            <form class="form w-100">
              <input type="search" class="input w-100" id="search" placeholder="Search staff.."
                     autocomplete="off" v-model="keyword" @keyup="search">
            </form>
            <button type="button" class="button-primary-small d-none d-md-inline-block" data-bs-toggle="modal" data-bs-target="#createModal">Add
              New
              Staff</button>
            <NuxtLink :to="dynamicPath" ref="linkRef" download class="button-reverse">Export Excel</NuxtLink>
          </div>
          <div class="wrapper-table mt-4">
            <table class="table" style="width:100%">
              <thead>
              <tr>
                <th>Employee Code</th>
                <th>Name</th>
                <th>Username</th>
                <th>Email</th>
                <th style="width: 200px;"></th>
              </tr>
              </thead>
              <tbody>
              <tr v-if="staffLength > 0" v-for="(staff, index) in staffStore.staffAll" :key="index">
                <td>{{staff.employee_code}}</td>
                <td>{{staff.name}}</td>
                <td>{{staff.user.username}}</td>
                <td>{{staff.user.email}}</td>
                <td class="d-flex justify-content-end gap-1 table-mobile" style="width: 200px;">
                  <button type="button" data-bs-toggle="modal" data-bs-target="#detailModal" @click="staffDetail(staff)"
                            class="wrapper-icon icon-detail d-flex align-items-center justify-content-center">
                    <i class="fa-solid fa-eye" style="font-size: 0.85rem;"></i>
                  </button>
                  <button type="button" data-bs-toggle="modal" data-bs-target="#updateModal" @click="staffDetail(staff)"
                            class="wrapper-icon icon-edit d-flex align-items-center justify-content-center">
                    <i class="fa-solid fa-pen-to-square" style="font-size: 0.85rem;"></i>
                  </button>
                  <button type="button"
                          class="wrapper-icon icon-delete d-flex align-items-center justify-content-center"
                          data-bs-toggle="modal" data-bs-target="#deleteModal" @click="staffData = staff">
                    <i class="fa-solid fa-trash-can" style="font-size: 0.85rem;"></i>
                  </button>
                </td>
              </tr>
              <tr v-else>
                <td colspan="5">Data staff not found!</td>
              </tr>
              </tbody>
            </table>
            <nav aria-label="Page navigation example" v-if="totalPages > 1">
              <ul class="pagination">
                <li class="page-item" :class="{ disabled: staffStore.page === 1 }">
                  <button type="button" class="page-link" @click="changePage(staffStore.page - 1)" :disabled="staffStore.page === 1">Previous</button>
                </li>
                <li v-for="page in totalPages" :key="page" :class="{ active: page === staffStore.page }" class="page-item">
                  <button type="button" class="page-link" @click="changePage(page)">{{ page }}</button>
                </li>
                <li class="page-item" :class="{ disabled: staffStore.page === totalPages }">
                  <button type="button" class="page-link" @click="changePage(staffStore.page + 1)" :disabled="staffStore.page === totalPages">Next</button>
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
            <h1 class="modal-title fs-5" id="detailModalLabel">Detail Staff</h1>
            <button type="button" data-bs-dismiss="modal" aria-label="Close" @click="removeStaffDetail()">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
          <div class="modal-body">
            <form class="form">
              <div class="row g-3">
                <div class="col-12">
                  <div class="input-group d-flex flex-column">
                    <label for="employee_code">Employee Code</label>
                    <input type="text" class="input w-100" name="employee_code" id="employee_code"
                           placeholder="Enter your employee code.." autocomplete="off" v-model="employee_code" readonly>
                  </div>
                </div>
                <div class="col-12">
                  <div class="input-group d-flex flex-column">
                    <label for="name">Name</label>
                    <input type="text" class="input w-100" name="name" id="name"
                           placeholder="Enter your name.." autocomplete="off" v-model="name" readonly>
                  </div>
                </div>
                <div class="col-12">
                  <div class="input-group d-flex flex-column">
                    <label for="username">Username</label>
                    <input type="text" class="input w-100" name="username" id="username"
                           placeholder="Enter your username.." autocomplete="off" v-model="username" readonly>
                  </div>
                </div>
                <div class="col-12">
                  <div class="input-group d-flex flex-column">
                    <label for="email">Email</label>
                    <input type="email" class="input w-100" name="email" id="email"
                           placeholder="Enter your email.." autocomplete="off" v-model="email" readonly>
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="button-reverse" data-bs-dismiss="modal" @click="removeStaffDetail()">Close Modal</button>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="createModal" tabindex="-1" aria-labelledby="createModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <form @submit.prevent="createStaff" class="form w-100">
            <div class="modal-header d-flex align-items-center justify-content-between">
              <h1 class="modal-title fs-5" id="createModalLabel">Create New Staff</h1>
              <button type="button" data-bs-dismiss="modal" aria-label="Close">
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div class="modal-body">
              <div class="row g-3">
                <div class="col-12">
                  <div class="input-group d-flex flex-column">
                    <label for="employee_code">Employee Code</label>
                    <input type="text" class="input w-100" name="employee_code" id="employee_code"
                           placeholder="Enter your employee code.." autocomplete="off" v-model="employee_code">
                    <p v-if="employeeCodeError" class="invalid-label">{{ employeeCodeError }}</p>
                  </div>
                </div>
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
                    <label for="username">Username</label>
                    <input type="text" class="input w-100" name="username" id="username"
                           placeholder="Enter your username.." autocomplete="off" v-model="username">
                    <p v-if="usernameError" class="invalid-label">{{ usernameError }}</p>
                  </div>
                </div>
                <div class="col-12">
                  <div class="input-group d-flex flex-column">
                    <label for="email">Email</label>
                    <input type="email" class="input w-100" name="email" id="email"
                           placeholder="Enter your email.." autocomplete="off" v-model="email">
                    <p v-if="emailError" class="invalid-label">{{ emailError }}</p>
                  </div>
                </div>
                <div class="col-12">
                  <div class="input-group d-flex flex-column">
                    <label for="password">Password</label>
                    <input type="password" class="input w-100" name="password" id="password"
                           placeholder="Enter your password.." autocomplete="off" v-model="password">
                    <p v-if="passwordError || passwordErrorRequired" class="invalid-label">{{ passwordError || passwordErrorRequired }}</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="button-reverse" data-bs-dismiss="modal">Cancel Add</button>
              <button type="submit" class="button-primary-small" data-bs-dismiss="modal">Add New Staff</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <div class="modal fade" id="updateModal" tabindex="-1" aria-labelledby="updateModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <form @submit.prevent="updateStaff" class="form w-100">
            <div class="modal-header d-flex align-items-center justify-content-between">
              <h1 class="modal-title fs-5" id="updateModalLabel">Edit Staff</h1>
              <button type="button" data-bs-dismiss="modal" aria-label="Close" @click="removeStaffDetail()">
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div class="modal-body">
              <div class="row g-3">
                <div class="col-12">
                  <div class="input-group d-flex flex-column">
                    <label for="employee_code">Employee Code</label>
                    <input type="text" class="input w-100" name="employee_code" id="employee_code"
                           placeholder="Enter your employee code.." autocomplete="off" v-model="employee_code">
                    <p v-if="employeeCodeError" class="invalid-label">{{ employeeCodeError }}</p>
                  </div>
                </div>
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
                    <label for="username">Username</label>
                    <input type="text" class="input w-100" name="username" id="username"
                           placeholder="Enter your username.." autocomplete="off" v-model="username">
                    <p v-if="usernameError" class="invalid-label">{{ usernameError }}</p>
                  </div>
                </div>
                <div class="col-12">
                  <div class="input-group d-flex flex-column">
                    <label for="email">Email</label>
                    <input type="email" class="input w-100" name="email" id="email"
                           placeholder="Enter your email.." autocomplete="off" v-model="email">
                    <p v-if="emailError" class="invalid-label">{{ emailError }}</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="button-reverse" data-bs-dismiss="modal" @click="removeStaffDetail()">Cancel Edit</button>
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
            <h1 class="modal-title fs-5" id="deleteModalLabel">Delete Staff</h1>
            <button type="button" data-bs-dismiss="modal" aria-label="Close">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
          <div class="modal-body">
            <p style="font-size: 0.913rem">Are you sure want to delete this staff?</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="button-reverse" data-bs-dismiss="modal">Cancel Delete</button>
            <button type="button" class="button-primary-small" @click="confirmDeleteStaff" data-bs-dismiss="modal">Delete Staff</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
