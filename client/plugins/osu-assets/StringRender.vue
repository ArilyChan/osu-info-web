<template>
  <component :is="tag" class="d-flex align-items-end">
    <template v-for="(char,index) of string.split('')">
      <osu-assets :key="index" :skin="skin" :asset="assets.score[char]" class="h-100" />
    </template>
  </component>
</template>
<script>
export default {
  props: {
    skin: {
      type: String,
      default: undefined
    },
    string: {
      type: String,
      default: ''
    },
    tag: {
      type: String,
      default: 'div'
    }
  },
  data () {
    return {
      assets: {
        score: undefined
      }
    }
  },
  created () {
    const score = Object.entries({ 0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, comma: ',', dot: '.', percent: '%', x: 'x' })
      .map(([k, v]) => [v, `score-${k}`])
      .reduce((acc, [k, v]) => { acc[k] = v; return acc }, {})
    this.assets.score = score
  }
}
</script>
