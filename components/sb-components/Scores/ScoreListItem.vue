<template>
  <b-list-group-item>
    <div class="d-flex w-100 justify-content-between align-items-stretch">
      <div class="d-flex">
        <img
          :src="smallPreviewImgSrc"
          class="align-top mr-2 hide-when-too-small bp-img rounded shadow"
        >
        <div class="align-top">
          <div class="d-flex">
            <osu-assets
              :asset="`ranking-${score.rank}`"
              class="score rank d-inline-block align-top"
              :alt="score.rank"
            />
            <div class="d-block">
              <div class="d-flex align-items-baseline flex-wrap">
                <h5 class="mb-0 pr-1">
                  <nuxt-link
                    :to="{
                      name:'beatmapsets-beatmapSetId-beatmapId',
                      params: {
                        beatmapSetId: score.beatmap.beatmapset_id,
                        beatmapId: score.beatmap.id
                      }
                    }"
                  >
                    {{ score.beatmapset.artist_unicode }} - {{ score.beatmapset.title_unicode }} [{{ score.beatmap.version }}]
                  </nuxt-link>
                </h5>
                <small>by {{ score.beatmapset.creator }}</small>
              </div>
              <p class="mb-1">
                <span v-html="htmlCounts" />
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="d-flex align-items-end flex-column">
        <div class="align-top">
          <small
            class="float-right text-right text-nowrap"
          >{{ moment(score.created_at).fromNow() }}, bp#{{ k }}</small>
          <br>
          <p
            v-if="score.mods.length"
            class="float-right text-right mb-0 text-nowrap"
          >
            + {{ modsStr }}
          </p>
        </div>
        <div v-if="score.pp" class="mt-auto">
          <h4 class="mb-0 float-right text-right text-nowrap">
            <span v-html="smallerFloatHtml(score.pp.toFixed(2))" /> pp
          </h4>
        </div>
      </div>
    </div>
    <slot />
  </b-list-group-item>
</template>
<script>
/* eslint-disable vue/require-prop-types */
// import modHelper from '@/helpers/enum.js'
// import LazyImage from './LazyImage.vue'
// import Image from './LazyImage.vue'
export default {
  components: {
    // Image
  },
  props: ['score', 'k'],
  computed: {
    htmlCounts () {
      const combo = this.score.perfect
        ? `${this.$t('scoreCard.fullCombo')}`
        : `${this.score.max_combo}x`
        // <small>/</small> ${this.score.beatmap.max_combo}<small class="float-number">x</small>
      const accuracy = this.score.accuracy !== 1 ? this.smallerFloatHtml(`${this.score.accuracy.toLocaleString('en-GB', { style: 'percent', minimumFractionDigits: 2 })}`) : ''
      const counts = [
        ...Object.entries(this.score.statistics)
          .filter(
            ([k, v]) =>
              k.includes('count_') && !['count_geki', 'count_katu', 'count_300'].includes(k)
          )
          .map(([k, v]) => ({
            count: v,
            append: k === 'count_miss'
              ? ` ${this.$tc('scoreCard.miss', v)}`
              : `x${k.slice(6)}`
          }))
      ]
        .filter(({ count }) => count)
        .map(({ count, append }) => `${count}<small class="float-number">${append}</small>`)
        .join(' <small>/</small> ')
      return [combo, accuracy, counts].filter(str => str).join(' , ')
    },
    rankImgSrc () {
      const rank = () => {
        switch (this.score.rank) {
          case 'SSH':
          case 'XH':
            return 'SSHD'
          case 'SH':
            return 'SHD'
          case 'X':
            return 'SS'
          default:
            return this.score.rank
        }
      }
      return `https://osu.ppy.sb/static/ranking-icons/${rank()}.svg`
    },
    beatmapLink () {
      return `https://osu.ppy.sb/b/${this.beatmap.id}`
    },
    banchoBeatmapLink () {
      return `https://osu.ppy.sh/beatmapsets/${this.score.beatmap.beatmapset_id}#/${this.score.beatmap.id}`
    },
    smallPreviewImgSrc () {
      return `https://b.ppy.sh/thumb/${this.score.beatmap.beatmapset_id}l.jpg`
    },
    modsStr () {
      return this.score.mods.join(' ')
    }
  },
  methods: {
    smallerFloatHtml (str) {
      const splitted = str.split('.')
      if (splitted.length === 1) { return splitted[0] }
      return `${splitted[0]}<small class="float-number">.${splitted[1]}</small></span>`
    }
  }
}
</script>

<style>
.score.rank {
    height: 3.75rem;
}
.bp-img {
    height: 80px !important;
}
.float-number {
    font-weight: 300;
}
.list-group-item p {
    font-weight: 400;
}
@media (max-width: 991px) {
    .hide-when-too-small {
        visibility: collapse !important;
        display: none !important;
    }
}
@media (max-width: 767px) {
    .list-group-item {
        font-size: 80%;
    }
    .list-group-item small {
        font-size: 85%;
    }
    .list-group-item h5 {
        font-size: 0.9rem;
    }
    .list-group-item h4 {
        font-size: 1.25rem;
    }
    .list-group-item p {
        font-weight: 400;
        font-size: 0.8rem;
    }
    .score.rank {
        height: 2.5rem;
    }
}
</style>
