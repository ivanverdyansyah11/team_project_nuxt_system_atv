<script setup lang="ts">
import {useBlogStore} from "~/stores/blog"
import {onMounted, ref} from "vue"
import {formatDate} from "~/helpers/FormatDate"
import imageNotFound from '~/assets/image/other/image-not-found.svg'

definePageMeta({
  layout: 'homepage'
})

const blogStore = useBlogStore()
const keyword = ref('')
let blogLength = ref(0)

const search = async (event: any) => {
  event.preventDefault()
  blogStore.$state.keyword = keyword.value
  await blogStore.getAllBlogWithoutPagination()
  blogLength.value = blogStore.blogAll.length
}

onMounted(async() => {
  await blogStore.getAllBlogWithoutPagination()
  blogLength.value = blogStore.blogAll.length
})
</script>

<template>
<!-- SECTION HERO -->
  <section class="hero-small container" id="hero">
   <div class="row justify-content-center">
     <div class="col-lg-9 col-xl-8 text-lg-center">
       <h1 class="headline">Find tips, tricks, and the best ATV routes in our adventure blog!</h1>
       <p class="description">Welcome to our adventure blog! Find expert tips, tricks, and the best ATV routes. Perfect for beginners and seasoned riders alike!</p>
       <form>
         <input type="search" class="input-search" placeholder="Search blog..." autocomplete="off" v-model="keyword" @keyup="search">
       </form>
     </div>
   </div>
  </section>
<!-- END SECTION HERO -->


<!-- SECTION BLOG -->
<section class="blog container content-gap" id="blog">
  <div class="row content-gap" :class="{'row-cols-2 row-cols-lg-3 g-2 g-md-3 g-lg-4': blogLength > 0}">
    <div v-if="blogLength > 0" class="col" v-for="(blog, index) in blogStore.blogAll" :key="index">
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
    <div v-else class="col-12 my-5">
      <p class="description w-100 text-center">No data blog found! <br> Please search any keyword.</p>
    </div>
  </div>
</section>
<!-- END SECTION BLOG -->
</template>

<style scoped>

</style>