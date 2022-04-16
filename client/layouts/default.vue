<template>
  <div id="wrapper">
    <main class="flex-fill position-relative">
      <section-layout shaped :bg-variant="colorFromMode" :bubble-count="8">
        <nuxt />
        <div class="d-flex">
          <div class="mx-auto info-footer">
            {{ $t(`server.${this.$store.state.server}`) }}
          </div>
        </div>
      </section-layout>
    </main>
    <!-- <div class="d-flex position-relative info-footer-wrapper">

    </div> -->
  </div>
</template>

<script>
import SectionLayout from '~/components/sb-layouts/components/SectionLayout'
export default {
  components: {
    SectionLayout
  },
  data () {
    return {
      server: 'sb'
    }
  },
  computed: {
    colorFromMode () {
      if (!this.$store.state.user.mode) { return }
      switch (this.$store.state.user.mode) {
        case 'osu':
        case 'osuRX':
        case 'osuAP':
          return 'success'
        case 'taiko':
        case 'taikoRX':
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

<style lang="scss" scoped>
$info-footer-size: 3em;
.info-footer-wrapper {
  // bottom: $info-footer-size * 1.4;
}
.info-footer-spacer {
  // margin-bottom: max(calc($info-footer-size * 0.7 - 1em), 0);
}
.info-footer {
  padding: 0;
  margin: 0;
  font-size: $info-footer-size;
  font-weight: 600;
  color: white;
  opacity: 0.3;
}
</style>
