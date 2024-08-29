<script setup lang="ts">
import {useBlogStore} from "~/stores/blog"
import { useRoute } from '#app'
import {formatDate} from "~/helpers/FormatDate"
import {onMounted} from "vue"
import imageNotFound from '~/assets/image/other/image-not-found.svg'

definePageMeta({
  layout: 'homepage'
})

const blogStore = useBlogStore()
const route = useRoute()

onMounted(async() => {
  await blogStore.getBlogById(route.params.id)
  await blogStore.getBlogExceptId(route.params.id)
})
</script>

<template>
<!-- SECTION DETAIL BLOG -->
  <section class="detail-blog blog hero-small container">
    <div class="row">
      <div class="col-lg-9">
        <h2 class="title">{{blogStore.blog.title}}</h2>
        <div class="wrapper d-flex align-items-end justify-content-between">
          <p>By At Ride</p>
          <p>{{formatDate(blogStore.blog.created_at)}}</p>
        </div>
        <div class="row align-items-md-center">
          <div class="col-md-6 col-lg-5">
            <div class="blog-image">
              <img :src="blogStore.blog.image_path != null ? `http://localhost:8000/${blogStore.blog.image_path}` : imageNotFound" alt="Blog Image">
            </div>
          </div>
          <div class="col">
            <p class="description mb-0">{{blogStore.blog.content}}</p>
          </div>
        </div>
      </div>
      <div class="col">
        <div class="other-blog ps-lg-3">
          <h3 class="title">Other Blog</h3>
          <div class="row row-cols-2 row-cols-lg-1 g-2 g-md-3 g-lg-4">
            <div v-for="(blog, index) in blogStore.blogAll" :key="index" class="col mt-md-0">
              <div class="card-blog">
                <div class="blog-image">
                  <img :src="blog.image_path != null ? `http://localhost:8000/${blog.image_path}` : imageNotFound" alt="Blog Image">
                </div>
                <h6>{{blog.title}}</h6>
                <p>{{blog.description}}</p>
                <div class="wrapper d-flex justify-content-between align-items-center">
                  <NuxtLink :to="{path: `/homepage/blog/${blog.id}`}">Read More</NuxtLink>
                  <p>{{formatDate(blog.created_at)}}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
<!-- END SECTION DETAIL BLOG -->
</template>

<style scoped>

</style>