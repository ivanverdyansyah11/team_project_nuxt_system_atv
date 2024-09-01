<script setup lang="ts">
import {useBlogStore} from "~/stores/blog"
import {ref, onMounted} from 'vue'
import {getAlert, alertMessage, alertType, alertPage} from "~/helpers/Alert"
import Cookies from 'js-cookie'

definePageMeta({
  title: 'Blog Page',
  layout: 'dashboard'
})

const keyword = ref('')
const blogStore = useBlogStore()
let blogLength = ref(0)
const blogDelete = ref(null)
const totalPages = ref(0)
const dynamicPath = ref('')
const linkRef = ref<HTMLAnchorElement | null>(null)

const search = async (event: any) => {
  event.preventDefault()
  blogStore.$state.keyword = keyword.value
  await blogStore.getAllBlog()
  blogLength.value = blogStore.blogAll.length
  totalPages.value = Math.ceil(blogStore.totalPages / blogStore.pageSize)
}

const changePage = async (page: number) => {
  blogStore.$state.page = page
  await blogStore.getAllBlog()
  blogLength.value = blogStore.blogAll.length
}

const exportBlog = async () => {
  const blob = await blogStore.exportBlog()
  const url = URL.createObjectURL(blob)
  dynamicPath.value = url
}

const confirmDeleteBlog = async () => {
  if (blogDelete.value) {
    await blogStore.deleteBlog(blogDelete.value.id)
    if (blogStore.status_code === 200) {
      Cookies.set('alert-message', 'Successfully deleted blog')
      Cookies.set('alert-type', 'true')
      Cookies.set('alert-page', 'Blog')
      getAlert()
    }
    blogDelete.value = null
    blogLength.value = blogStore.blogAll.length
    totalPages.value = Math.ceil(blogLength.value / blogStore.pageSize)
  } else {
    Cookies.set('alert-message', 'Failed to get data blog')
    Cookies.set('alert-type', 'false')
    Cookies.set('alert-page', 'Blog')
    getAlert()
  }
}

onMounted(async () => {
  await blogStore.getAllBlog()
  await exportBlog()
  blogLength.value = blogStore.blogAll.length
  totalPages.value = Math.ceil(blogStore.totalPages / blogStore.pageSize)
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
        <div v-if="alertPage == 'Blog'" class="alert w-100" :class="alertType != false ? 'alert-success' : 'alert-danger'" role="alert">
          {{ alertMessage }}
        </div>
      </div>
      <div class="col-12">
        <div class="card-default">
          <div class="wrapper d-flex align-items-center justify-content-between gap-2">
            <form class="form w-100">
              <input type="search" class="input w-100" id="search" placeholder="Search blog.."
                     autocomplete="off" v-model="keyword" @keyup="search">
            </form>
            <NuxtLink :to="{path: `/dashboard/blog/create`}" class="button-primary-small d-none d-md-inline-block">Add
              New
              Blog</NuxtLink>
            <NuxtLink :to="dynamicPath" ref="linkRef" download class="button-reverse">Export Excel</NuxtLink>
          </div>
          <div class="wrapper-table mt-4">
            <table class="table" style="width:100%">
              <thead>
              <tr>
                <th>Title</th>
                <th style="width: 200px;"></th>
              </tr>
              </thead>
              <tbody>
              <tr v-if="blogLength > 0" v-for="(blog, index) in blogStore.blogAll" :key="index">
                <td>{{blog.title}}</td>
                <td class="d-flex justify-content-end gap-1 table-mobile" style="width: 200px;">
                  <NuxtLink :to="{path: `/dashboard/blog/${blog.id}`}"
                            class="wrapper-icon icon-detail d-flex align-items-center justify-content-center">
                    <i class="fa-solid fa-eye" style="font-size: 0.85rem;"></i>
                  </NuxtLink>
                  <NuxtLink :to="{path: `/dashboard/blog/edit/${blog.id}`}"
                            class="wrapper-icon icon-edit d-flex align-items-center justify-content-center">
                    <i class="fa-solid fa-pen-to-square" style="font-size: 0.85rem;"></i>
                  </NuxtLink>
                  <button type="button"
                          class="wrapper-icon icon-delete d-flex align-items-center justify-content-center"
                          data-bs-toggle="modal" data-bs-target="#deleteModal" @click="blogDelete = blog">
                    <i class="fa-solid fa-trash-can" style="font-size: 0.85rem;"></i>
                  </button>
                </td>
              </tr>
              <tr v-else>
                <td colspan="2">Data blog not found!</td>
              </tr>
              </tbody>
            </table>
            <nav aria-label="Page navigation example" v-if="totalPages > 1">
              <ul class="pagination">
                <li class="page-item" :class="{ disabled: blogStore.page === 1 }">
                  <button type="button" class="page-link" @click="changePage(blogStore.page - 1)" :disabled="blogStore.page === 1">Previous</button>
                </li>
                <li v-for="page in totalPages" :key="page" :class="{ active: page === blogStore.page }" class="page-item">
                  <button type="button" class="page-link" @click="changePage(page)">{{ page }}</button>
                </li>
                <li class="page-item" :class="{ disabled: blogStore.page === totalPages }">
                  <button type="button" class="page-link" @click="changePage(blogStore.page + 1)" :disabled="blogStore.page === totalPages">Next</button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="deleteModal" tabindex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header d-flex align-items-center justify-content-between">
            <h1 class="modal-title fs-5" id="deleteModalLabel">Delete Blog</h1>
            <button type="button" data-bs-dismiss="modal" aria-label="Close">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
          <div class="modal-body">
            <p style="font-size: 0.913rem">Are you sure want to delete this blog?</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="button-reverse" data-bs-dismiss="modal">Cancel Delete</button>
            <button type="button" class="button-primary-small" @click="confirmDeleteBlog" data-bs-dismiss="modal">Delete Blog</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
