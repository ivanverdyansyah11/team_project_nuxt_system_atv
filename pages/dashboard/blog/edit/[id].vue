<script setup lang="ts">
import {useBlogStore} from "~/stores/blog"
import {useRoute} from '#app'
import {ref, onMounted} from 'vue'
import {useField, useForm} from 'vee-validate'
import {navigateTo} from "nuxt/app"
import * as yup from 'yup'
import Cookies from "js-cookie"

definePageMeta({
  title: 'Edit Blog Page',
  layout: 'dashboard'
})

const blogStore = useBlogStore()
const route = useRoute()
const updateDataImage = ref('https://placehold.co/600x400?text=Image+Not+Found')
const file = ref(null)

const schema = yup.object({
  title: yup.string().required('Title is required'),
  content: yup.string().required('Content is required'),
  description: yup.string().required('Description is required'),
  image: yup.mixed().required('Image is required'),
})

const { handleSubmit, setValues } = useForm({
  validationSchema: schema,
})

const { value: title, errorMessage: titleError } = useField('title')
const { value: content, errorMessage: contentError } = useField('content')
const { value: description, errorMessage: descriptionError } = useField('description')
const { value: image, errorMessage: imageError } = useField('image')

const loadBlog = async() => {
  await blogStore.getBlogById(route.params.id)
  updateDataImage.value = blogStore.blog.image_path != null ? `http://localhost:8000/${blogStore.blog.image_path}` : 'https://placehold.co/600x400?text=Image+Not+Found'
  setValues({
    title: blogStore.blog.title,
    description: blogStore.blog.description,
    content: blogStore.blog.content,
    image: updateDataImage.value,
  })
}

const previewImage = (e: any) => {
  if (!e.target.files.length) return
  file.value = e.target.files[0]
  const reader = new FileReader()
  reader.onload = () => {
    if (typeof reader.result === "string") {
      updateDataImage.value = reader.result
    }
    e.target.value = ""
  }
  reader.readAsDataURL(file.value)
}

const updateBlog = handleSubmit(async (values) => {
  await blogStore.updateBlog(values, route.params.id)
  if (file.value) {
    const formData = new FormData()
    formData.append('image', file.value)
    await blogStore.saveImageBlog(formData, blogStore.blog.id)
  }
  if (blogStore.status_code == 200) {
    Cookies.set('alert-message', 'Successfully update blog')
    Cookies.set('alert-type', 'true')
    Cookies.set('alert-page', 'Blog')
    navigateTo('/dashboard/blog')
  } else {
    navigateTo('/dashboard/blog')
  }
})

onMounted(async () => {
  await loadBlog()
})
</script>

<template>
  <div class="content container mt-4">
    <div class="row">
      <div class="col-12">
        <div class="card-default">
          <form @submit.prevent="updateBlog" class="form w-100">
            <div class="row g-3">
              <div class="col-12 d-flex gap-3 align-items-end">
                <div class="wrapper d-flex flex-column">
                  <label for="image" class="form-label">Blog Image</label>
                  <img :src="updateDataImage" class="input-image" alt="Blog Image" style="border-radius: 4px;"/>
                </div>
                <div class="wrapper">
                  <input type="file" id="image" class="input-hide" @change="previewImage" />
                  <label for="image" class="button-reverse w-100 text-center mt-3">Choose Image</label>
                  <p class="invalid-label">{{ imageError }}</p>
                </div>
              </div>
              <div class="col-12">
                <div class="input-group d-flex flex-column">
                  <label for="title">Title</label>
                  <input type="text" class="input w-100" title="title" id="title"
                         placeholder="Enter your title.." autocomplete="off" v-model="title">
                  <p v-if="titleError" class="invalid-label">{{ titleError }}</p>
                </div>
              </div>
              <div class="col-md-6">
                <div class="input-group d-flex flex-column">
                  <label for="description">Description</label>
                  <textarea class="input w-100" name="description" id="description"
                            placeholder="Enter your description.." autocomplete="off" v-model="description" rows="4"></textarea>
                  <p v-if="descriptionError" class="invalid-label">{{ descriptionError }}</p>
                </div>
              </div>
              <div class="col-md-6">
                <div class="input-group d-flex flex-column">
                  <label for="content">Content</label>
                  <textarea class="input w-100" name="content" id="content"
                            placeholder="Enter your content.." autocomplete="off" v-model="content" rows="4"></textarea>
                  <p v-if="contentError" class="invalid-label">{{ contentError }}</p>
                </div>
              </div>
              <div class="col-12">
                <div class="button-group d-flex gap-2">
                  <button type="submit" class="button-primary-small">Save Changes</button>
                  <NuxtLink :to="{path: '/dashboard/blog'}" class="button-reverse">Cancel Edit</NuxtLink>
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