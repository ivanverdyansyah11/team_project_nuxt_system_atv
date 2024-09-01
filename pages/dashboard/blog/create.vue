<script setup lang="ts">
import {useBlogStore} from "~/stores/blog"
import {useField, useForm} from 'vee-validate'
import {ref} from 'vue'
import * as yup from 'yup'
import Cookies from "js-cookie"

definePageMeta({
  title: 'Create Blog Page',
  layout: 'dashboard'
})

const blogStore = useBlogStore()
const createDataImage = ref('https://placehold.co/600x400?text=Image+Not+Found')
const file = ref(null)

const schema = yup.object({
  title: yup.string().required('Name is required'),
  description: yup.string().required('Description is required'),
  content: yup.string().required('Content is required'),
  image: yup.mixed().required('Image is required'),
})

const { handleSubmit } = useForm({
  validationSchema: schema,
})

const { value: title, errorMessage: titleError } = useField('title')
const { value: description, errorMessage: descriptionError } = useField('description')
const { value: content, errorMessage: contentError } = useField('content')
const { value: image, errorMessage: imageError } = useField('image')

const previewImage = (e: any) => {
  file.value = e.target.files[0]
  image.value = file.value
  if (!file.value) return
  const reader = new FileReader()
  reader.onload = () => {
    if (typeof reader.result === "string") {
      createDataImage.value = reader.result
    }
    e.target.value = ""
  }
  reader.readAsDataURL(file.value)
}

const createBlog = handleSubmit(async (values) => {
  await blogStore.createBlog(values)
  if (blogStore.status_code === 201 && file.value) {
    const formData = new FormData()
    formData.append('image', file.value)
    await blogStore.saveImageBlog(formData, blogStore.blog.id)
    if (blogStore.status_code === 200) {
      Cookies.set('alert-message', 'Successfully create new blog')
      Cookies.set('alert-type', 'true')
      Cookies.set('alert-page', 'Blog')
      navigateTo('/dashboard/blog')
    } else {
      navigateTo('/dashboard/blog')
    }
  } else {
    navigateTo('/dashboard/blog')
  }
})
</script>

<template>
  <div class="content container mt-4">
    <div class="row">
      <div class="col-12">
        <div class="card-default">
          <form @submit.prevent="createBlog" class="form w-100">
            <div class="row g-3">
              <div class="col-12 d-flex gap-3 align-items-end">
                <div class="wrapper d-flex flex-column">
                  <label for="image" class="form-label">Blog Image</label>
                  <img :src="createDataImage" class="input-image" alt="Blog Image" style="border-radius: 4px;"/>
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
                  <button type="submit" class="button-primary-small">Add New Blog</button>
                  <NuxtLink :to="{path: '/dashboard/blog'}" class="button-reverse">Cancel Add</NuxtLink>
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