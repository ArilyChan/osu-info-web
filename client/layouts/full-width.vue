<template>
  <div id="wrapper">
    <main class="flex-fill position-relative">
      <section-layout shaped :bg-variant="colorFromMode" :bubble-count="8">
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
  },
  computed: {
    colorFromMode () {
      if (!this.$store.state.user.mode) { return }
      switch (this.$store.state.user.mode) {
        case 'osu':
          return 'success'
        case 'taiko':
          return 'warning'
        case 'fruits':
          return 'primary'
        default:
          return 'info'
      }
    }
  }
}
</script>
<style scoped>
body, #wrapper {
   min-height:100vh;
}
</style>
