<template>
  <card
    shadow
    class="bg-cover border-0"
    no-body
    hover
    :style="{
      '--cover-url': `url('${beatmapset.covers['cover@2x']}')`,
    }"
  >
    <div class="card-body-backdrop-filter-base">
      <slot :songName="songName" />
    </div>
  </card>
</template>
<script>
export default {
  props: {
    beatmap: {
      type: Object,
      default: () => undefined
    },
    beatmapset: {
      type: Object,
      default: () => undefined
    }
  },
  computed: {
    bsid () {
      return this.beatmapset.id
    },
    songName () {
      return `${this.beatmapset.artist_unicode} - ${this.beatmapset.title_unicode}`
    }
  }
}
</script>
<style lang="scss" scoped>
.bg-cover {
  background: transparent;
  transition: all 0.15s ease;

  &:hover::before {
    opacity: 0;
    transition: all 0.15s ease;
  }
  &::before {
    content: "";
    position: absolute;
    border-radius: 0.25rem;
    width: 100%;
    height: 100%;
    opacity: 1;
    transition: all 0.15s ease;
    background: rgba(255,255,255,0.8);
  }
  &::after {
    content: "";
    position: absolute;
    border-radius: 0.25rem;
    width: 100%;
    height: 100%;
    z-index: -1;
    background: var(--cover-url);
    background-size: cover;
    background-position: center;
  }

  .card-body-backdrop-filter-base {
    opacity: 1;
    border-radius: 0.25rem;
    backdrop-filter: blur(2px);
    transition: all 0.15s ease;

    &:hover {
      backdrop-filter: blur(0);
      opacity: 0;
      transition: all 0.15s ease;
    }
  }
}
</style>
