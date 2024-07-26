<script setup lang="ts">
definePageMeta({
  layout: 'homepage'
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
         <input type="search" class="input-search" placeholder="Search blog...">
       </form>
     </div>
   </div>
  </section>
<!-- END SECTION HERO -->


<!-- SECTION BLOG -->
<section class="blog container content-gap" id="blog">
  <div class="row content-gap row-cols-2 row-cols-lg-3 g-2 g-md-3 g-lg-4">
    <div class="col mt-md-0">
      <div class="card-blog">
        <div class="blog-image">
          <img src="~/assets/image/homepage/section-blog/blog-1.jpg" alt="Blog Image">
        </div>
        <h6>Safety & Security: Comprehensive Guide to Riding ATVs Properly</h6>
        <p>Riding an ATV for beginners isn't always a walk in the park. That's why it's crucial for us to delve into the fundamentals of riding...</p>
        <div class="wrapper d-flex justify-content-between align-items-center">
          <NuxtLink :to="{path: '/homepage/blog/1'}">Read More</NuxtLink>
          <p>04 Apr 2024</p>
        </div>
      </div>
    </div>
    <div class="col mt-md-0">
      <div class="card-blog">
        <div class="blog-image">
          <img src="~/assets/image/homepage/section-blog/blog-2.jpg" alt="Blog Image">
        </div>
        <h6>Embark on an Amazing Adventure: Tips for Choosing the Best ATV</h6>
        <p>ATVs are the vehicles we use to play on a route, choosing the best ATV will make you more comfortable and confident playing...</p>
        <div class="wrapper d-flex justify-content-between align-items-center">
          <NuxtLink :to="{path: '/homepage/blog/1'}">Read More</NuxtLink>
          <p>14 Apr 2024</p>
        </div>
      </div>
    </div>
    <div class="col mt-lg-0">
      <div class="card-blog">
        <div class="blog-image">
          <img src="~/assets/image/homepage/section-blog/blog-3.jpg" alt="Blog Image">
        </div>
        <h6>Tips & Tricks for Beginners Riding ATVs on Various Terrains</h6>
        <p>It's important for beginners to understand the terrains they will encounter. Check out the following tips and tricks to learn the details of the terrains...</p>
        <div class="wrapper d-flex justify-content-between align-items-center">
          <NuxtLink :to="{path: '/homepage/blog/1'}">Read More</NuxtLink>
          <p>18 Apr 2024</p>
        </div>
      </div>
    </div>
    <div class="col">
      <div class="card-blog">
        <div class="blog-image">
          <img src="~/assets/image/homepage/section-blog/blog-4.jpg" alt="Blog Image">
        </div>
        <h6>Why ATVs Are the Ultimate Choice for Adrenaline Junkies? Let's Find Out</h6>
        <p>The allure of challenging terrains often motivates individuals to test their skills and conquer those thrilling routes...</p>
        <div class="wrapper d-flex justify-content-between align-items-center">
          <NuxtLink :to="{path: '/homepage/blog/1'}">Read More</NuxtLink>
          <p>06 Apr 2024</p>
        </div>
      </div>
    </div>
    <div class="col">
      <div class="card-blog">
        <div class="blog-image">
          <img src="~/assets/image/homepage/section-blog/blog-5.jpg" alt="Blog Image">
        </div>
        <h6>Adventure Tales: Unforgettable Experiences at AT Ride</h6>
        <p>The exhilarating sensation of navigating through challenging terrains makes for unforgettable experiences and lasting memories...</p>
        <div class="wrapper d-flex justify-content-between align-items-center">
          <NuxtLink :to="{path: '/homepage/blog/1'}">Read More</NuxtLink>
          <p>20 Apr 2024</p>
        </div>
      </div>
    </div>
    <div class="col">
      <div class="card-blog">
        <div class="blog-image">
          <img src="~/assets/image/homepage/section-blog/blog-6.jpg" alt="Blog Image">
        </div>
        <h6>Physical and Mental Preparation for ATV Riding on Various Terrains</h6>
        <p>Having strong physical and mental stamina while riding on challenging terrains is crucial. It's important to have physical readiness...</p>
        <div class="wrapper d-flex justify-content-between align-items-center">
          <NuxtLink :to="{path: '/homepage/blog/1'}">Read More</NuxtLink>
          <p>16 Apr 2024</p>
        </div>
      </div>
    </div>
  </div>
</section>
<!-- END SECTION BLOG -->
</template>

<style scoped>

</style>