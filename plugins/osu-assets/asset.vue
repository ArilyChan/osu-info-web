<template>
  <img :src="imported">
</template>
<script>
export default {
  props: {
    skin: {
      type: String,
      default: '- Nekoha Shizuku -'
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
  // data () {
  //   // const skin = '~/assets/skins/- Nekoha Shizuku -'
  //   const score = Object.entries({ 0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, comma: ',', dot: '.', percent: '%', x: 'x' })
  //     .map(([k, v]) => [v, require(`~/assets/skins/- Nekoha Shizuku -/score-${k}.png`)])
  //     .reduce((acc, [k, v]) => { acc[k] = v; return acc }, {})
  //   return {
  //     assets: {
  //       score,
  //       ranking: {
  //       }
  //     }
  //   }
  // },
  // beforeMount () {
  //   const path = `./assets/skins/${this.skin}`
  //   this.assets.ranking = {
  //     hit300: require(`${path}/hit300.png`),
  //     hit100: require(`${path}/hit100.png`),
  //     hit50: require(`${path}/hit50.png`),
  //     hit0: require(`${path}/hit0.png`),
  //     hit300g: require(`${path}/hit300g.png`),
  //     hit300k: require(`${path}/hit300k.png`),
  //     maxCombo: require(`${path}/ranking-maxcombo.png`),
  //     accuracy: require(`${path}/ranking-accuracy.png`)
  //   }
  //   console.log(this.assets)
  // }
}
</script>
