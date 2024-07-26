<script setup lang="ts">
definePageMeta({
  layout: 'homepage'
})
</script>

<template>
<!-- SECTION DETAIL BLOG -->
  <section class="detail-blog blog hero-small container">
    <div class="row">
      <div class="col-lg-9">
        <h2 class="title">Conquering Extreme Terrain: ATV Riding Tips for All Conditions</h2>
        <div class="wrapper d-flex align-items-center justify-content-between">
          <p>By At Ride</p>
          <p>1 juni 2024</p>
        </div>
        <div class="row align-items-md-center">
          <div class="col-md-6 col-lg-5">
            <div class="blog-image">
              <img src="~/assets/image/homepage/section-blog/blog-1.jpg" alt="Blog Image">
            </div>
          </div>
          <div class="col">
            <p class="description mb-0">It's important for everyone who wants to ride an ATV to know the basic techniques or proper ways to ride an ATV to ensure everyone stays safe. Safety is the utmost priority when it comes to riding. It's also crucial to ensure the preparation of all significant equipment and gear. Navigating through various challenging terrain also requires training from expert instructors. Let's delve deeper into the tips on how to ride an ATV below</p>
          </div>
        </div>
        <div class="blog-list">
          <h3 class="title">Basic Techniques in ATV Riding</h3>
          <p class="description">Correct Riding Position:</p>
          <div class="row">
            <div class="col-md-6 mb-2">
              <p class="item">Sitting upright with feet on the footpegs.</p>
            </div>
            <div class="col-md-6 mb-2">
              <p class="item">Control your speed by carefully adjusting the throttle and brakes.</p>
            </div>
            <div class="col-md-6 mb-2">
              <p class="item">Hold the handlebars firmly but relax your grip with both hands.</p>
            </div>
            <div class="col-md-6 mb-2">
              <p class="item">Maintain a safe distance from other riders and avoid sudden maneuvers.</p>
            </div>
            <div class="col-md-6 mb-2">
              <p class="item">Don't sit too far back or too forward; maintaining a central position is best for balance and stability.</p>
            </div>
            <div class="col-md-6 mb-2">
              <p class="item">Ensure to ride with calmness and relaxation, and befriend the route.</p>
            </div>
            <div class="col-md-6 mb-2 mb-md-0">
              <p class="item">Start slowly gradually and steadily apply throttle to build speed</p>
            </div>
            <div class="col-md-6">
              <p class="item">Always wear protective gear to safeguard yourself from any potential harm.</p>
            </div>
          </div>
        </div>
      </div>
      <div class="col">
        <div class="other-blog ps-lg-3">
          <h3 class="title">Other Blog</h3>
          <div class="row row-cols-2 row-cols-lg-1 g-2 g-md-3 g-lg-4">
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
          </div>
        </div>
      </div>
    </div>
  </section>
<!-- END SECTION DETAIL BLOG -->
</template>

<style scoped>

</style>