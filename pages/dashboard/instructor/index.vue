<script setup lang="ts">
import {useInstructorStore} from "~/stores/instructor";
import {ref, onMounted} from 'vue'
import {useField, useForm} from 'vee-validate'
import {getAlert, alertMessage, alertType, alertPage} from "~/helpers/Alert"
import Cookies from 'js-cookie'
import * as yup from 'yup'

definePageMeta({
  title: 'Instructor Page',
  layout: 'dashboard'
})

const keyword = ref('')
const instructorStore = useInstructorStore()
let instructorLength = ref(0)
const instructorData = ref(null)
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

const { handleSubmit, setValues } = useForm({
  validationSchema: schema,
})

const { value: name, errorMessage: nameError } = useField('name')
const { value: employee_code, errorMessage: employeeCodeError } = useField('employee_code')
const { value: username, errorMessage: usernameError } = useField('username')
const { value: email, errorMessage: emailError } = useField('email')
const { value: password, errorMessage: passwordError } = useField('password')

const search = async (event: any) => {
  event.preventDefault()
  instructorStore.$state.keyword = keyword.value
  instructorStore.$state.page = 1
  await instructorStore.getAllInstructor()
  instructorLength.value = instructorStore.instructorAll.length
  totalPages.value = Math.ceil(instructorStore.totalPages / instructorStore.pageSize)
}

const changePage = async (page: number) => {
  instructorStore.$state.page = page
  await instructorStore.getAllInstructor()
  instructorLength.value = instructorStore.instructorAll.length
}

const exportInstructor = async () => {
  const blob = await instructorStore.exportInstructor()
  const url = URL.createObjectURL(blob)
  dynamicPath.value = url
}

const instructorDetail = async (instructorSelect: any) => {
  await instructorStore.getInstructorById(instructorSelect.id)
  instructorData.value = instructorSelect
  const instructor = instructorStore.instructor
  setValues({
    name: instructor.name,
    employee_code: instructor.employee_code,
    username: instructor.user.username,
    email: instructor.user.email,
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

const removeInstructorDetail = async () => {
  instructorData.value = null
  removeInputValues()
}

const createInstructor = handleSubmit( async (values) => {
  if (values.password != undefined) {
    await instructorStore.createInstructor(values)
    if (instructorStore.status_code === 201) {
      Cookies.set('alert-message', 'Successfully create new instructor')
      Cookies.set('alert-type', 'true')
      Cookies.set('alert-page', 'Instructor')
      getAlert()
      removeInputValues()
      await instructorStore.getAllInstructor()
      totalPages.value = Math.ceil(instructorStore.totalPages / instructorStore.pageSize)
      instructorLength.value = instructorStore.instructorAll.length
    } else {
      getAlert()
    }
  } else {
    passwordErrorRequired.value = 'Password is required'
  }
})

const updateInstructor = handleSubmit( async (values) => {
  await instructorStore.updateInstructor(values, instructorData.value.id)
  if (instructorStore.status_code === 200) {
    Cookies.set('alert-message', 'Successfully update instructor')
    Cookies.set('alert-type', 'true')
    Cookies.set('alert-page', 'Instructor')
    getAlert()
    removeInputValues()
    instructorData.value = null
    await instructorStore.getAllInstructor()
  } else {
    getAlert()
  }
})

const confirmDeleteInstructor = async () => {
  if (instructorData.value) {
    await instructorStore.deleteInstructor(instructorData.value.id)
    if (instructorStore.status_code === 200) {
      Cookies.set('alert-message', 'Successfully deleted instructor')
      Cookies.set('alert-type', 'true')
      Cookies.set('alert-page', 'Instructor')
      getAlert()
    }
    instructorData.value = null
    instructorLength.value = instructorStore.instructorAll.length
    totalPages.value = Math.ceil(instructorLength.value / instructorStore.pageSize)
  } else {
    getAlert()
  }
}

onMounted(async () => {
  await instructorStore.getAllInstructor()
  await exportInstructor()
  instructorLength.value = instructorStore.instructorAll.length
  totalPages.value = Math.ceil(instructorStore.totalPages / instructorStore.pageSize)
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
  next();
});
</script>

<template>
  <div class="content container mt-4">
    <div class="row">
      <div class="col-12">
        <div v-if="alertPage == 'Instructor'" class="alert w-100" :class="alertType != false ? 'alert-success' : 'alert-danger'" role="alert">
          {{ alertMessage }}
        </div>
      </div>
      <div class="col-12">
        <div class="card-default">
          <div class="wrapper d-flex align-items-center justify-content-between gap-2">
            <form class="form w-100">
              <input type="search" class="input w-100" id="search" placeholder="Search instructor.."
                     autocomplete="off" v-model="keyword" @keyup="search">
            </form>
            <button type="button" class="button-primary-small d-none d-md-inline-block" data-bs-toggle="modal" data-bs-target="#createModal">Add
              New
              Instructor</button>
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
              <tr v-if="instructorLength > 0" v-for="(instructor, index) in instructorStore.instructorAll" :key="index">
                <td>{{instructor.employee_code}}</td>
                <td>{{instructor.name}}</td>
                <td>{{instructor.user.username}}</td>
                <td>{{instructor.user.email}}</td>
                <td class="d-flex justify-content-end gap-1 table-mobile" style="width: 200px;">
                  <button type="button" data-bs-toggle="modal" data-bs-target="#detailModal" @click="instructorDetail(instructor)"
                            class="wrapper-icon icon-detail d-flex align-items-center justify-content-center">
                    <i class="fa-solid fa-eye" style="font-size: 0.85rem;"></i>
                  </button>
                  <button type="button" data-bs-toggle="modal" data-bs-target="#updateModal" @click="instructorDetail(instructor)"
                            class="wrapper-icon icon-edit d-flex align-items-center justify-content-center">
                    <i class="fa-solid fa-pen-to-square" style="font-size: 0.85rem;"></i>
                  </button>
                  <button type="button"
                          class="wrapper-icon icon-delete d-flex align-items-center justify-content-center"
                          data-bs-toggle="modal" data-bs-target="#deleteModal" @click="instructorData = instructor">
                    <i class="fa-solid fa-trash-can" style="font-size: 0.85rem;"></i>
                  </button>
                </td>
              </tr>
              <tr v-else>
                <td colspan="5">Data instructor not found!</td>
              </tr>
              </tbody>
            </table>
            <nav aria-label="Page navigation example" v-if="totalPages > 1">
              <ul class="pagination">
                <li class="page-item" :class="{ disabled: instructorStore.page === 1 }">
                  <button type="button" class="page-link" @click="changePage(instructorStore.page - 1)" :disabled="instructorStore.page === 1">Previous</button>
                </li>
                <li v-for="page in totalPages" :key="page" :class="{ active: page === instructorStore.page }" class="page-item">
                  <button type="button" class="page-link" @click="changePage(page)">{{ page }}</button>
                </li>
                <li class="page-item" :class="{ disabled: instructorStore.page === totalPages }">
                  <button type="button" class="page-link" @click="changePage(instructorStore.page + 1)" :disabled="instructorStore.page === totalPages">Next</button>
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
            <h1 class="modal-title fs-5" id="detailModalLabel">Detail Instructor</h1>
            <button type="button" data-bs-dismiss="modal" aria-label="Close" @click="removeInstructorDetail()">
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
            <button type="button" class="button-reverse" data-bs-dismiss="modal" @click="removeInstructorDetail()">Close Modal</button>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="createModal" tabindex="-1" aria-labelledby="createModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <form @submit.prevent="createInstructor" class="form w-100">
            <div class="modal-header d-flex align-items-center justify-content-between">
              <h1 class="modal-title fs-5" id="createModalLabel">Create New Instructor</h1>
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
              <button type="submit" class="button-primary-small" data-bs-dismiss="modal">Add New Instructor</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <div class="modal fade" id="updateModal" tabindex="-1" aria-labelledby="updateModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <form @submit.prevent="updateInstructor" class="form w-100">
            <div class="modal-header d-flex align-items-center justify-content-between">
              <h1 class="modal-title fs-5" id="updateModalLabel">Edit Instructor</h1>
              <button type="button" data-bs-dismiss="modal" aria-label="Close" @click="removeInstructorDetail()">
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
              <button type="button" class="button-reverse" data-bs-dismiss="modal" @click="removeInstructorDetail()">Cancel Edit</button>
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
            <h1 class="modal-title fs-5" id="deleteModalLabel">Delete Instructor</h1>
            <button type="button" data-bs-dismiss="modal" aria-label="Close">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
          <div class="modal-body">
            <p style="font-size: 0.913rem">Are you sure want to delete this instructor?</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="button-reverse" data-bs-dismiss="modal">Cancel Delete</button>
            <button type="button" class="button-primary-small" @click="confirmDeleteInstructor" data-bs-dismiss="modal">Delete Instructor</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
