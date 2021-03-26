<template>
  <div id="wrapper" class="d-flex flex-column">
    <main class="flex-fill position-relative">
      <profile-layout>
        <nuxt />
      </profile-layout>
    </main>
  </div>
</template>

<script>
import ProfileLayout from '@/components/sb-layouts/ProfileLayout'
export default {
  components: {
    ProfileLayout
  }
}
</script>

<style scoped>
body, #wrapper {
   min-height:100vh;
}
</style>
