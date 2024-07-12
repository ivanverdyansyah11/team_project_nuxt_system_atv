<script setup lang="ts">
definePageMeta({
  title: 'Dashboard Page',
  layout: 'dashboard'
})
</script>

<template>
  <div class="content container mt-4">
    <div class="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-3 g-lg-4">
      <div class="col">
        <div class="card-menu d-flex align-items-center gap-3">
          <div class="menu-icon d-flex align-items-center justify-content-center">
            <i class="fa-solid fa-users"></i>
          </div>
          <div class="menu-value">
            <p>Total Customer</p>
            <h6>12</h6>
          </div>
        </div>
      </div>
      <div class="col">
        <div class="card-menu d-flex align-items-center gap-3">
          <div class="menu-icon d-flex align-items-center justify-content-center">
            <i class="fa-regular fa-id-card"></i>
          </div>
          <div class="menu-value">
            <p>Total Driver</p>
            <h6>10</h6>
          </div>
        </div>
      </div>
      <div class="col">
        <div class="card-menu d-flex align-items-center gap-3">
          <div class="menu-icon d-flex align-items-center justify-content-center">
            <i class="fa-solid fa-money-bill-transfer"></i>
          </div>
          <div class="menu-value">
            <p>Total Transaction</p>
            <h6>4</h6>
          </div>
        </div>
      </div>
      <div class="col">
        <div class="card-menu d-flex align-items-center gap-3">
          <div class="menu-icon d-flex align-items-center justify-content-center">
            <i class="fa-solid fa-coins"></i>
          </div>
          <div class="menu-value">
            <p>Total Income</p>
            <h6>Rp. 100.000</h6>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>