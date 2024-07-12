<script setup lang="ts">
import { useBundleStore } from "~/stores/bundle";
import { ref, onMounted } from 'vue'
import { formatRupiah } from "~/helpers/FormatRupiah";
import Cookies from 'js-cookie'

definePageMeta({
  title: 'Package Page',
  layout: 'dashboard'
})

const keyword = ref('')
const bundleStore = useBundleStore()
let packageLength = ref(0)
const packageDelete = ref(null);
const totalPages = ref(0)
let alertMessage = useCookie('alert-message')
let alertPage = useCookie('alert-page')

const search = async (event: any) => {
  event.preventDefault()
  bundleStore.$state.keyword = keyword.value
  await bundleStore.getAllBundle()
  packageLength.value = bundleStore.bundleAll.length
  totalPages.value = Math.ceil(bundleStore.totalPages / bundleStore.pageSize)
}

const changePage = async (page: number) => {
  bundleStore.$state.page = page
  await bundleStore.getAllBundle()
  packageLength.value = bundleStore.bundleAll.length
}

const confirmDeletePackage = async () => {
  if (packageDelete.value) {
    await bundleStore.deleteBundle(packageDelete.value.id);
    if (bundleStore.status_code === 200) {
      Cookies.set('alert-message', 'Successfully deleted package');
      Cookies.set('alert-page', 'Package');
      alertMessage = useCookie('alert-message')
      alertPage = useCookie('alert-page')
    }
    packageDelete.value = null;
    totalPages.value = Math.ceil(bundleStore.totalPages / bundleStore.pageSize)
    packageLength.value = bundleStore.bundleAll.length
  }
};

onMounted(async () => {
  await bundleStore.getAllBundle()
  packageLength.value = bundleStore.bundleAll.length
  totalPages.value = Math.ceil(bundleStore.totalPages / bundleStore.pageSize)
})

onBeforeRouteLeave((to, from, next) => {
  Cookies.remove('alert-message');
  Cookies.remove('alert-page');
  next();
});

onBeforeRouteUpdate((to, from, next) => {
  Cookies.remove('alert-message');
  Cookies.remove('alert-page');
  next();
});
</script>

<template>
  <div class="content container mt-4">
    <div class="row">
      <div class="col-12">
        <div v-if="alertPage == 'Package'" class="alert alert-success w-100" role="alert">
          {{ alertMessage }}
        </div>
      </div>
      <div class="col-12">
        <div class="card-default">
          <div class="wrapper d-flex align-items-center justify-content-between gap-2">
            <form class="form w-100">
              <input type="search" class="input w-100" id="search" placeholder="Search package.."
                     autocomplete="off" v-model="keyword" @keyup="search">
            </form>
            <NuxtLink :to="{path: `/dashboard/entertainment-package/create`}" class="button-primary-small d-none d-md-inline-block">Add
              New
              Package</NuxtLink>
          </div>
          <div class="wrapper-table mt-4">
            <table class="table" style="width:100%">
              <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Description</th>
                <th style="width: 200px;"></th>
              </tr>
              </thead>
              <tbody>
              <tr v-if="packageLength > 0" v-for="(bundle, index) in bundleStore.bundleAll" :key="index">
                <td>{{bundle.name}}</td>
                <td>{{formatRupiah(bundle.price)}}</td>
                <td>{{bundle.description}}</td>
                <td class="d-flex justify-content-end gap-1 table-mobile" style="width: 200px;">
                  <NuxtLink :to="{path: `/dashboard/entertainment-package/${bundle.id}`}"
                            class="wrapper-icon icon-detail d-flex align-items-center justify-content-center">
                    <i class="fa-solid fa-eye" style="font-size: 0.85rem;"></i>
                  </NuxtLink>
                  <NuxtLink :to="{path: `/dashboard/entertainment-package/edit/${bundle.id}`}"
                            class="wrapper-icon icon-edit d-flex align-items-center justify-content-center">
                    <i class="fa-solid fa-pen-to-square" style="font-size: 0.85rem;"></i>
                  </NuxtLink>
                  <button type="button"
                          class="wrapper-icon icon-delete d-flex align-items-center justify-content-center"
                          data-bs-toggle="modal" data-bs-target="#deleteModal" @click="packageDelete = bundle">
                    <i class="fa-solid fa-trash-can" style="font-size: 0.85rem;"></i>
                  </button>
                </td>
              </tr>
              <tr v-else>
                <td colspan="4">Data package not found!</td>
              </tr>
              </tbody>
            </table>
            <nav aria-label="Page navigation example" v-if="totalPages > 1">
              <ul class="pagination">
                <li class="page-item" :class="{ disabled: bundleStore.page === 1 }">
                  <button type="button" class="page-link" @click="changePage(bundleStore.page - 1)" :disabled="bundleStore.page === 1">Previous</button>
                </li>
                <li v-for="page in totalPages" :key="page" :class="{ active: page === bundleStore.page }" class="page-item">
                  <button type="button" class="page-link" @click="changePage(page)">{{ page }}</button>
                </li>
                <li class="page-item" :class="{ disabled: bundleStore.page === totalPages }">
                  <button type="button" class="page-link" @click="changePage(bundleStore.page + 1)" :disabled="bundleStore.page === totalPages">Next</button>
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
            <h1 class="modal-title fs-5" id="deleteModalLabel">Delete Package</h1>
            <button type="button" data-bs-dismiss="modal" aria-label="Close">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
          <div class="modal-body">
            <p style="font-size: 0.913rem">Are you sure want to delete this package?</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="button-reverse" data-bs-dismiss="modal">Cancel Delete</button>
            <button type="button" class="button-primary-small" @click="confirmDeletePackage" data-bs-dismiss="modal">Delete Package</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
