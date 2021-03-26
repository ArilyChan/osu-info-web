<template>
  <div>
    <section
      class="section-shaped my-0 section-hero position-fixed"
      style="top: 0; bottom: 0; left:0; right: 0"
    >
      <div
        :class="[shaped!==undefined ? 'shape-skew' : '']"
        class="shape shape-style-1 shape-primary"
      >
        <span class="span-150" />
        <span class="span-50" />
        <span class="span-50" />
        <span class="span-75" />
        <span class="span-100" />
        <span class="span-75" />
        <span class="span-50" />
        <span class="span-100" />
        <span class="span-50" />
        <span class="span-100" />
      </div>
      <div class="container shape-container d-flex align-items-center" />
    </section>
    <div class="container shape-container d-flex align-items-center">
      <div class="w-100">
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    shaped: {
      type: Boolean,
      default: undefined
    }
  }
}
</script>
