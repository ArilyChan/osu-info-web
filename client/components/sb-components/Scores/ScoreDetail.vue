<template>
  <beatmap-info
    v-slot="slotProps"
    :beatmap="score.beatmap"
    :beatmapset="score.beatmapset"
  >
    <b-card-header class="profile-backdrop">
      <h2>{{ slotProps.songName }} - [{{ score.beatmap.version }}]</h2>
      <b-card-sub-title>
        成绩上传于 {{ new Date(score.created_at).toLocaleDateString() }}
        {{ new Date(score.created_at).toLocaleTimeString() }} (GMT
        +9)
      </b-card-sub-title>
    </b-card-header>
    <b-card-body>
      <b-container fluid>
        <b-row class="position-relative">
          <b-col cols="10" class="p-0">
            <b-container fluid class="numeric">
              <b-row>
                <osu-asset-string
                  :string="score.score.toLocaleString()"
                  tag="b-col"
                  class="justify-content-center"
                />
              </b-row>
              <b-row>
                <b-col class="d-flex align-items-center">
                  <osu-assets
                    asset="hit300"
                    height="100px"
                    skin="- Nekoha Shizuku -"
                  />
                  <osu-asset-string
                    :string="score.statistics.count_300.toLocaleString() + 'x'"
                  />
                </b-col>
                <b-col class="d-flex align-items-center">
                  <osu-assets
                    asset="hit300g"
                    height="100px"
                    skin="- Nekoha Shizuku -"
                  />
                  <osu-asset-string
                    :string="score.statistics.count_geki.toLocaleString() + 'x'"
                  />
                </b-col>
                <div class="w-100" />
                <b-col class="d-flex align-items-center">
                  <osu-assets
                    asset="hit100"
                    height="100px"
                    skin="- Nekoha Shizuku -"
                  />
                  <osu-asset-string
                    :string="score.statistics.count_100.toLocaleString() + 'x'"
                  />
                </b-col>
                <b-col class="d-flex align-items-center">
                  <osu-assets
                    asset="hit300k"
                    height="100px"
                    skin="- Nekoha Shizuku -"
                  />
                  <osu-asset-string
                    :string="score.statistics.count_katu.toLocaleString() + 'x'"
                  />
                </b-col>
                <div class="w-100" />
                <b-col class="d-flex align-items-center">
                  <osu-assets
                    asset="hit50"
                    height="100px"
                    skin="- Nekoha Shizuku -"
                  />
                  <osu-asset-string
                    :string="score.statistics.count_50.toLocaleString() + 'x'"
                  />
                </b-col>
                <b-col class="d-flex align-items-center">
                  <osu-assets
                    asset="hit0"
                    height="100px"
                    skin="- Nekoha Shizuku -"
                  />
                  <osu-asset-string
                    :string="score.statistics.count_miss.toLocaleString() + 'x'"
                  />
                </b-col>
              </b-row>
              <b-row>
                <b-col>
                  <osu-assets asset="ranking-maxcombo" />
                  <osu-asset-string
                    :string="score.max_combo.toLocaleString() + 'x'"
                  />
                </b-col>
                <b-col>
                  <osu-assets asset="ranking-accuracy" />
                  <osu-asset-string
                    :string="
                      score.accuracy.toLocaleString(undefined, {
                        style: 'percent',
                        minimumFractionDigits: 2,
                      })
                    "
                  />
                </b-col>
              </b-row>
            </b-container>
          </b-col>
          <b-col cols="3" class="p-0" />
          <div
            class="
              position-absolute
              h-100
              d-flex
              align-items-center
              assets
              rank
            "
          >
            <osu-assets
              :asset="`ranking-${score.rank}`"
              style="max-width: 100%; max-height: 100%"
            />
          </div>
          <div class="d-flex align-items-end assets mod-container">
            <osu-assets
              v-for="(mod, index) in score.mods"
              :key="`mod-${index}`"
              class="mod"
              :asset="`selection-mod-${fullMod(mod)}`"
              width="120px"
            />
          </div>
        </b-row>
      </b-container>
    </b-card-body>
    <b-card-footer
      class="
        py-1
        profile-backdrop
        d-flex
        align-items-end
        justify-content-between
      "
    >
      <div>Score ID: {{ score.id }}</div>
      <div v-if="score.pp" class="d-flex align-items-end justify-content-end">
        <osu-asset-string
          :string="
            score.pp.toLocaleString(undefined, {
              style: 'decimal',
              minimumFractionDigits: 2,
            })
          "
          style="height: 3rem"
        />
        <h3>pp</h3>
      </div>
    </b-card-footer>
  </beatmap-info>
</template>

<script>
import BeatmapInfo from '~/components/sb-components/Beatmap/BeatmapInfo.vue'
export default {
  layout: 'default',
  components: {
    BeatmapInfo
  },
  props: {
    score: {
      type: Object,
      default: () => ({ mods: [], statistics: {} })
    }
  },
  data () {
    return {
      mod: {
        EZ: 'easy',
        NF: 'nofail',
        HT: 'halftile',
        HR: 'hardrock',
        SD: 'suddendeath',
        PF: 'perfect',
        DT: 'doubletime',
        NC: 'nightcore',
        HD: 'hidden',
        FL: 'flashlight',
        RX: 'relax',
        AP: 'relax2',
        SO: 'spunout',
        AT: 'autoplay',
        CM: 'cinema',
        ScoreV2: 'scorev2'
      }
    }
  },
  methods: {
    fullMod (mod) {
      return this.mod[mod] || ''
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~bootstrap/scss/functions";
@import "~bootstrap/scss/variables";
@import "~bootstrap/scss/mixins";
// @include media-breakpoint-up(md) { ... }
// @include media-breakpoint-up(lg) { ... }
// @include media-breakpoint-up(xl) { ... }
// @include media-breakpoint-up(xxl) { ... }
.profile-backdrop {
  background-color: #f6f9fc6e;
  backdrop-filter: brightness(102%) saturate(140%) blur(10px);
}
.assets {
  &.rank {
    top: 0;
    right: 0;
    max-width: 50%;
    z-index: -1;
    opacity: 0.7;
    padding-right: $spacer * .25
  }
  &.mod-container {
    margin-left: auto;
    margin-right: auto;
  }
  @include media-breakpoint-up(md) {
    &.mod-container {
      position: absolute;
      top: 75%;
      right: 0;
      z-index: -1;
    }
  }
}
// @include media-breakpoint-up(sm) { ... }
</style>
