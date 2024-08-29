<script setup lang="ts">
import {useBlogStore} from "~/stores/blog"
import {useRoute} from '#app'

definePageMeta({
  title: 'Detail Blog Page',
  layout: 'dashboard'
})

const blogStore = useBlogStore()
const route = useRoute()

await blogStore.getBlogById(route.params.id)
</script>

<template>
  <div class="content container mt-4">
    <div class="row">
      <div class="col-12">
        <div class="card-default">
          <form class="form w-100">
            <div class="row g-3">
              <div class="col-12 d-flex gap-3 align-items-end">
                <div class="wrapper d-flex flex-column">
                  <label for="image" class="form-label">Blog Image</label>
                  <img :src="blogStore.blog.image_path != null ? `http://localhost:8000/${blogStore.blog.image_path}` : 'https://placehold.co/600x400?text=Image+Not+Found'" class="input-image" alt="Blog Image" style="border-radius: 4px;"/>
                </div>
              </div>
              <div class="col-12">
                <div class="input-group d-flex flex-column">
                  <label for="title">Title</label>
                  <input type="text" class="input w-100" title="title" id="title"
                         placeholder="Enter your title.." autocomplete="off" v-model="blogStore.blog.title" readonly>
                </div>
              </div>
              <div class="col-md-6">
                <div class="input-group d-flex flex-column">
                  <label for="description">Description</label>
                  <textarea class="input w-100" name="description" id="description"
                            placeholder="Enter your description.." autocomplete="off" v-model="blogStore.blog.description" rows="4" readonly></textarea>
                </div>
              </div>
              <div class="col-md-6">
                <div class="input-group d-flex flex-column">
                  <label for="content">Content</label>
                  <textarea class="input w-100" name="content" id="content"
                            placeholder="Enter your content.." autocomplete="off" v-model="blogStore.blog.content" rows="4" readonly></textarea>
                </div>
              </div>
              <div class="col-12">
                <div class="button-group d-flex gap-2">
                  <NuxtLink :to="{path: '/dashboard/blog'}" class="button-reverse">Back to Page</NuxtLink>
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