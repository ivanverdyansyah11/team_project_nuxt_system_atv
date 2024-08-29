<script setup lang="ts">
import {useBundleStore} from "~/stores/bundle"
import {useInstructorStore} from "~/stores/instructor"
import {useServiceStore} from "~/stores/service"
import {useBlogStore} from "~/stores/blog"
import { Swiper, SwiperSlide } from 'swiper/vue'
import imageNotFound from '~/assets/image/other/image-not-found.svg'
import 'swiper/css'
import 'swiper/swiper-bundle.css'
import 'swiper/css/navigation'
import {formatDate} from "~/helpers/FormatDate"
import Cookies from "js-cookie"

definePageMeta({
  layout: 'homepage',
})

const bundleStore = useBundleStore()
const instructorStore = useInstructorStore()
const serviceStore = useServiceStore()
const blogStore = useBlogStore()

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

onMounted(async () => {
  await bundleStore.getAllBundle()
  await instructorStore.getAllInstructorWithoutPaginate()
  await serviceStore.getAllService()
  await blogStore.getAllBlog()
})
</script>

<template>
<!-- SECTION HERO -->
  <section class="hero container d-flex align-items-center" id="home">
    <div class="row align-items-center">
      <div class="col-lg-5 d-none d-lg-inline-block pe-xl-5">
        <img src="~/assets/image/homepage/section-hero/banner-image.svg" alt="Banner Image" class="img-fluid">
      </div>
      <div class="offset-lg-1 col-lg-6">
        <h1 class="headline">Feel the Real Off-Road Thrill with Our Awesome and Exciting ATV Trails</h1>
        <p class="description">With our wide range of exciting rides and attractions, you'll thoroughly enjoy this unforgettable, fun-filled adventure. Explore all the thrills and excitement with your loved ones now!</p>
        <div class="button-group d-flex gap-2 align-items-center">
          <NuxtLink :to="{path: '/homepage/package'}" class="button-primary-small">Booking Now</NuxtLink>
          <NuxtLink :to="{path: '/homepage#whyChooseUs'}" class="button-reverse">Explore Our Attractions</NuxtLink>
        </div>
        <div class="row row-cols-2 row-cols-md-4 w-100">
          <div class="col">
            <h2 class="title-value">20+</h2>
            <p class="caption-value">Best Off-Road</p>
          </div>
          <div class="col">
            <h2 class="title-value">35+</h2>
            <p class="caption-value">Finest Instructors</p>
          </div>
          <div class="col mt-4 mt-md-0">
            <h2 class="title-value">60+</h2>
            <p class="caption-value">Premier ATV</p>
          </div>
          <div class="col mt-4 mt-md-0">
            <h2 class="title-value">587+</h2>
            <p class="caption-value">Happy Customer</p>
          </div>
        </div>
      </div>
    </div>
  </section>
<!-- END SECTION HERO -->


<!-- SECTION WHY CHOOSE US -->
  <section class="why-choose-us content-gap background-primary" id="whyChooseUs">
    <div class="container">
      <div class="row">
        <div class="col-12">
          <h2 class="title text-lg-center">Why At-Ride is the Top Choice for Many?</h2>
        </div>
      </div>
      <div class="row row-cols-2 row-cols-lg-3 w-100 content-gap content-value">
        <div class="col d-flex align-items-center gap-3">
          <h2>1</h2>
          <h6>Exciting Off-Road Trails Galore</h6>
        </div>
        <div class="col d-flex align-items-center gap-3">
          <h2>2</h2>
          <h6>The Best Experience with Exciting Routes</h6>
        </div>
        <div class="col mt-3 mt-md-4 mt-lg-0 d-flex align-items-center gap-3">
          <h2>3</h2>
          <h6>Highly Relevant Pricing Offers</h6>
        </div>
        <div class="col mt-3 mt-md-4 mt-lg-3 d-flex align-items-center gap-3">
          <h2>4</h2>
          <h6>Best Professional Instructors </h6>
        </div>
        <div class="col mt-3 mt-md-4 mt-lg-3 d-flex align-items-center gap-3">
          <h2>5</h2>
          <h6>Spectacular Natural Beauty</h6>
        </div>
        <div class="col mt-3 mt-md-4 mt-lg-3 d-flex align-items-center gap-3">
          <h2>6</h2>
          <h6>Open to All Ages, from Kids to Adults</h6>
        </div>
        <div class="col mt-3 mt-md-4 mt-lg-3 d-flex align-items-center gap-3">
          <h2>7</h2>
          <h6>Top-notch Latest & Quality Gear</h6>
        </div>
        <div class="col mt-3 mt-md-4 mt-lg-3 d-flex align-items-center gap-3">
          <h2>8</h2>
          <h6>Best & Comfortable Facilities</h6>
        </div>
        <div class="col mt-3 mt-md-4 mt-lg-3 d-flex align-items-center gap-3">
          <h2>9</h2>
          <h6>Ensured Safety Measures</h6>
        </div>
      </div>
    </div>
  </section>
<!-- END SECTION WHY CHOOSE US -->


<!-- SECTION ABOUT -->
  <section class="about container section-gap" id="about">
    <div class="row align-items-center">
      <div class="col-lg-5 d-none d-lg-inline-block pe-xl-5">
        <img src="~/assets/image/homepage/section-about/banner-image.svg" alt="Banner Image" class="img-fluid">
      </div>
      <div class="offset-lg-1 col-lg-6">
        <h6 class="subtitle">Introduce More About Us</h6>
        <h3 class="title">Serving with Full Comfort and Ensuring Your Safety is Our Utmost Responsibility</h3>
        <div class="description-group d-flex flex-column gap-1">
          <p class="description">At-Ride is an exhilarating adventure destination with a wide array of thrilling challenges awaiting you. Here, you can indulge in a myriad of exciting and captivating experiences.</p>
          <p class="description">Enjoy the excitement of our rides and start creating new experiences with your family.</p>
        </div>
        <div class="button-group d-flex justify-content-between">
          <NuxtLink target="_blank" to="https://whatsapp.com" class="button-primary-small">Contact Us</NuxtLink>
          <div class="d-flex gap-1 align-items-center">
            <NuxtLink target="_blank" to="https://instagram.com" class="button-sosmed">
              <i class="fa-brands fa-instagram"></i>
            </NuxtLink>
            <NuxtLink target="_blank" to="https://whatsapp.com" class="button-sosmed">
              <i class="fa-brands fa-whatsapp"></i>
            </NuxtLink>
            <NuxtLink target="_blank" to="https://facebook.com" class="button-sosmed">
              <i class="fa-brands fa-facebook-f"></i>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </section>
<!-- END SECTION ABOUT -->


<!-- SECTION PACKAGE -->
  <section class="package section-gap-margin background-primary" id="package">
    <div class="container">
      <div class="row">
        <div class="col-12">
          <h2 class="title text-lg-center">Explore Our Exciting Package Deals Ready For You To Try Out!</h2>
        </div>
      </div>
      <div class="row content-gap row-cols-2 row-cols-lg-3 g-3 g-md-4 content-value">
        <div class="col" v-for="(bundle, index) in bundleStore.bundleAll" :key="index">
          <NuxtLink :to="{path: `/homepage/package/${bundle.id}`}" class="card-package w-100">
            <div class="package-image">
              <img :src="bundle.image_path != null ? `http://localhost:8000/${bundle.image_path}` : imageNotFound" alt="Package Image">
            </div>
            <h6>{{bundle.name}}</h6>
            <p>{{bundle.description}}</p>
            <button class="button-reverse text-center w-100 d-none d-lg-inline-block">See Detail Package</button>
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
<!-- END SECTION PACKAGE -->


<!-- SECTION GALLERY -->
<section class="gallery section-gap" id="gallery">
  <div class="container">
    <div class="row">
      <div class="col-12">
        <h2 class="title text-lg-center">Document Your Priceless Experience with Your Loved Ones</h2>
      </div>
    </div>
    <div class="row content-gap row-cols-2 row-cols-lg-4 g-2 g-md-3 g-lg-4">
      <div class="col mt-md-0">
        <div class="gallery-image image-square">
          <img src="~/assets/image/homepage/section-gallery/gallery-1.jpg" alt="Gallery Image">
        </div>
      </div>
      <div class="col mt-md-0">
        <div class="gallery-image image-square">
          <img src="~/assets/image/homepage/section-gallery/gallery-2.jpg" alt="Gallery Image">
        </div>
      </div>
      <div class="col mt-lg-0">
        <div class="gallery-image image-square">
          <img src="~/assets/image/homepage/section-gallery/gallery-3.jpg" alt="Gallery Image">
        </div>
      </div>
      <div class="col mt-lg-0">
        <div class="gallery-image image-square">
          <img src="~/assets/image/homepage/section-gallery/gallery-4.jpg" alt="Gallery Image">
        </div>
      </div>
    </div>
    <div class="row mt-2 mt-md-3 mt-lg-4 row-cols-2 g-2 g-md-3 g-lg-4">
      <div class="col mt-0">
        <div class="gallery-image image-landscape">
          <img src="~/assets/image/homepage/section-gallery/gallery-5.jpg" alt="Gallery Image">
        </div>
      </div>
      <div class="col mt-0">
        <div class="gallery-image image-landscape">
          <img src="~/assets/image/homepage/section-gallery/gallery-6.jpg" alt="Gallery Image">
        </div>
      </div>
    </div>
  </div>
</section>
<!-- END SECTION GALLERY -->


<!-- SECTION INSTRUCTOR -->
<section class="instructor section-gap-margin background-primary" id="instructor">
  <div class="container">
    <div class="row">
      <div class="col-12">
        <h2 class="title text-lg-center">Our Best Instructors</h2>
      </div>
    </div>
    <div class="row content-gap content-value">
      <div class="col-12">
        <Swiper
            :slides-per-view="2"
            :space-between="16"
            :navigation="true"
            :loop="true"
            :breakpoints="{
              '768': {
                slidesPerView: 3,
                spaceBetween: 20,
              },
              '992': {
                slidesPerView: 4,
                spaceBetween: 20,
              },
            }"
            class="mySwiper">
          <SwiperSlide v-for="(instructor, index) in instructorStore.instructorAll" :key="index">
            <div class="card-instructor">
              <img :src="instructor.user.profile_path ? `http://localhost:8000/${instructor.user.profile_path}` : imageNotFound" alt="Instructor Image">
              <h6>{{ instructor.name }}</h6>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
    <div class="row content-gap content-value">
      <div class="col-12 d-flex justify-content-center">
        <NuxtLink :to="{path: `/homepage/instructor`}" class="button-primary-small">More Instructor</NuxtLink>
      </div>
    </div>
  </div>
</section>
<!-- END SECTION INSTRUCTOR -->


<!-- SECTION BLOG -->
  <section class="blog section-gap" id="blog">
    <div class="container">
      <div class="row">
        <div class="col-12">
          <h2 class="title text-lg-center">Deepen Your Knowledge About This Natural Attraction</h2>
        </div>
      </div>
      <div class="row content-gap row-cols-2 row-cols-lg-3 g-2 g-md-3 g-lg-4">
        <div class="col" v-for="(blog, index) in blogStore.blogAll" :key="index">
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
      <div class="row content-gap content-value">
        <div class="col-12 d-flex justify-content-center">
          <NuxtLink :to="{path: `/homepage/blog`}" class="button-primary-small">More Blog</NuxtLink>
        </div>
      </div>
    </div>
  </section>
<!-- END SECTION BLOG -->
</template>

<style scoped>

</style>