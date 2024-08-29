<script setup lang="ts">
</script>

<template>
  <div>
    <Sidebar />
    <main class="dashboard w-100">
      <div class="row">
        <div class="col-12 mb-5">
          <Topbar/>
          <slot></slot>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
</style>