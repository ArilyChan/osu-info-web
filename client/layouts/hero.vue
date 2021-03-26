<template>
  <div id="wrapper" class="d-flex flex-column">
    <main class="flex-fill position-relative">
      <hero-section-layout>
        <nuxt />
      </hero-section-layout>
    </main>
  </div>
</template>

<script>
import HeroSectionLayout from '~/components/sb-layouts/components/HeroSectionLayout'
export default {
  components: {
    HeroSectionLayout
  }
}
</script>

<style scoped>
body, #wrapper {
   min-height:100vh;
}
</style>
