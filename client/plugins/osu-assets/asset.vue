<template>
  <img :src="imported">
</template>
<script>
export default {
  props: {
    skin: {
      type: String,
      default: 'Umaru'
    },
    asset: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      imported: ''
    }
  },
  mounted () {
    const path = `./assets/skins/${this.skin}`
    try {
      this.imported = require(`${path}/${this.asset}@2x.png`)
    } catch (_) {
      try {
        this.imported = require(`${path}/${this.asset}.png`)
      } catch (_) {
        try {
          this.imported = require(`${path}/${this.asset.toLowerCase()}@2x.png`)
        } catch (_) {
          try {
            this.imported = require(`${path}/${this.asset.toLowerCase()}.png`)
          } catch (_) {
            try {
              this.imported = require(`${path}/${this.asset}`)
            } catch (_) {
              try {
                this.imported = require(`${path}/${this.asset.toLowerCase()}`)
              } catch (error) {
              }
            }
          }
        }
      }
    }
  }
}
</script>
