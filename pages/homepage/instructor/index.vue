<script setup lang="ts">
import {useInstructorStore} from "~/stores/instructor"
import {onMounted, ref} from "vue"
import imageNotFound from '~/assets/image/other/image-not-found.svg'

definePageMeta({
  layout: 'homepage'
})

const instructorStore = useInstructorStore()
const keyword = ref('')
let instructorLength = ref(0)

const search = async (event: any) => {
  event.preventDefault()
  instructorStore.$state.keyword = keyword.value
  await instructorStore.getAllInstructorWithoutPaginate()
  instructorLength.value = instructorStore.instructorAll.length
}

onMounted(async() => {
  await instructorStore.getAllInstructorWithoutPaginate()
  instructorLength.value = instructorStore.instructorAll.length
})
</script>

<template>
  <!-- SECTION HERO -->
  <section class="hero-small container" id="hero">
    <div class="row justify-content-center">
      <div class="col-lg-9 col-xl-8 text-lg-center">
        <h1 class="headline">Discover Our Expert Instructors Who Ensure Your Ultimate</h1>
        <p class="description">At ATRide Adventure, our team of seasoned instructors is dedicated to providing you with the safest and most thrilling ATV experience. Learn from the best and ride with confidence!</p>
        <form>
          <input type="search" class="input-search" placeholder="Search instructor..." autocomplete="off" v-model="keyword" @keyup="search">
        </form>
      </div>
    </div>
  </section>
  <!-- END SECTION HERO -->


  <!-- SECTION INSTRUCTOR -->
  <section class="instructor container content-gap" id="blog">
    <div class="row content-gap" :class="{'row-cols-2 row-cols-md-4 row-cols-xl-5 g-3 g-md-4': instructorLength > 0}">
      <div v-if="instructorLength > 0" class="col" v-for="(instructor, index) in instructorStore.instructorAll" :key="index">
        <div class="card-instructor">
          <img :src="instructor.user.profile_path ? `http://localhost:8000/${instructor.user.profile_path}` : imageNotFound" alt="Instructor Image">
          <h6>{{ instructor.name }}</h6>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>

</style>