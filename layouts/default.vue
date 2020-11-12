<template>
  <div id="wrapper" class="d-flex flex-column">
    <main class="flex-fill position-relative">
      <section-layout shaped bg-variant="primary">
        <nuxt />
      </section-layout>
    </main>
  </div>
</template>

<script>
import SectionLayout from '~/components/sb-layouts/components/SectionLayout'
export default {
  components: {
    SectionLayout
  }
}
</script>
