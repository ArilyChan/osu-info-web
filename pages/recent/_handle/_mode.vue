<template>
  <div class="col px-0 profile-page">
    <div v-if="user" class="card-profile container" style="margin-top: 5em">
      <div class="b-overlay-wrap position-relative">
        <user-info :user="user" :mode="mode" />
      </div>
      <beatmap-info v-if="score" v-slot="slotProps" :beatmap="score.beatmap" :beatmapset="score.beatmapset" class="mt-4">
        <b-card-header class="profile-backdrop">
          <h2>{{ slotProps.songName }}</h2>
          <b-card-sub-title>成绩上传于 {{ new Date(score.created_at).toLocaleDateString() }} {{ new Date(score.created_at).toLocaleTimeString() }} (GMT +9)</b-card-sub-title>
        </b-card-header>
        <b-container fluid>
          <b-row class="position-relative">
            <b-col cols="9" class="p-0">
              <b-card-body>
                <b-container fluid class="numeric">
                  <b-row>
                    <osu-asset-string :string="score.score.toLocaleString()" tag="b-col" class="justify-content-center" />
                  </b-row>
                  <b-row>
                    <b-col class="d-flex align-items-center">
                      <osu-assets asset="hit300" height="100px" />
                      <osu-asset-string :string="score.statistics.count_300.toLocaleString() + 'x'" />
                    </b-col>
                    <b-col class="d-flex align-items-center">
                      <osu-assets asset="hit300g" height="100px" />
                      <osu-asset-string :string="score.statistics.count_geki.toLocaleString() + 'x'" />
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col class="d-flex align-items-center">
                      <osu-assets asset="hit100" height="100px" />
                      <osu-asset-string :string="score.statistics.count_100.toLocaleString() + 'x'" />
                    </b-col>
                    <b-col class="d-flex align-items-center">
                      <osu-assets asset="hit300k" height="100px" />
                      <osu-asset-string :string="score.statistics.count_katu.toLocaleString() + 'x'" />
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col class="d-flex align-items-center">
                      <osu-assets asset="hit50" height="100px" />
                      <osu-asset-string :string="score.statistics.count_50.toLocaleString() + 'x'" />
                    </b-col>
                    <b-col class="d-flex align-items-center">
                      <osu-assets asset="hit0" height="100px" />
                      <osu-asset-string :string="score.statistics.count_miss.toLocaleString() + 'x'" />
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col>
                      <osu-assets asset="ranking-maxcombo" />
                      <osu-asset-string :string="score.max_combo.toLocaleString() + 'x'" />
                    </b-col>
                    <b-col>
                      <osu-assets asset="ranking-accuracy" />
                      <osu-asset-string :string="score.accuracy.toLocaleString(undefined,{style: 'percent', minimumFractionDigits: 2})" />
                    </b-col>
                  </b-row>
                </b-container>
              </b-card-body>
            </b-col>
            <b-col cols="3" class="p-0" />
            <div class="position-absolute h-100 d-flex align-items-center" style="top: 0; right: 0; max-width:50%; z-index: -1">
              <osu-assets :asset="`ranking-${score.rank}`" style="max-width:100%; max-height: 100%" />
            </div>
            <div class="position-absolute d-flex align-items-end pr-3" style="top: 60%; right: 0;">
              <osu-assets v-for="(mod,index) in score.mods" :key="`mod-${index}`" :asset="`selection-mod-${fullMod(mod)}`" width="100px" />
            </div>
          </b-row>
        </b-container>
        <b-card-footer v-if="score.pp" class="py-1 profile-backdrop">
          <div class="d-flex align-items-end justify-content-end">
            <osu-asset-string :string="score.pp.toLocaleString(undefined,{style: 'decimal', minimumFractionDigits: 2})" style="height:3rem" /><h3>pp</h3>
          </div>
        </b-card-footer>
      </beatmap-info>
      <template v-else-if="messages.includes('no-recent')">
        <b-card
          class="shadow mt-2 pb-0"
        >
          <b-card-title>最近24h没有成绩。</b-card-title>
        </b-card>
      </template>
      <template v-else>
        <b-card
          title="Something Went Wrong"
          class="shadow mt-2"
        />
      </template>
    </div>
    <div v-else class="card-profile container pt-5">
      <b-card
        title="没有这个用户"
        header="Something went wrong..."
        class="shadow"
      />
    </div>
  </div>
</template>

<script>
import BeatmapInfo from '~/components/sb-components/Beatmap/BeatmapInfo.vue'
import UserInfo from '~/components/stat-components/UserInfo.vue'
export default {
  layout: 'default',
  components: {
    UserInfo,
    BeatmapInfo
  },
  async asyncData ({ params, $axios, $config: { baseURL } }) {
    let result = {
      user: undefined
    }
    const path = `/api/recent/${params.handle}${params.mode ? `/${params.mode}` : ''}`
    if (process.server) {
      result = await $axios.get(`http://localhost:${process.env.PORT || 3000}${path}`).then(res => res.data)
    }
    if (process.client) {
      result = await $axios.get(`/api/users${path}`).then(res => res.data)
    }
    return {
      messages: result.messages || [],
      user: result.user,
      score: result.score,
      countryRanking: result.countryRanking,
      mode: params.mode || (result.user ? result.user.playmode : undefined)
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
@import url('https://fonts.googleapis.com/css2?family=Itim&display=swap');
.numeric {
  font-family: 'Itim', cursive;
}
.Waterfall-item > * {
  margin: 0.4rem !important;
}
.pt-0-8 {
  padding-top: 0.8rem !important;
}
.mt-0-8 {
  margin-top: 0.8rem !important;
}
.grid-sizer {
  width: calc(100% / 6);
}
.mx--4 {
  margin-left: (1em * -1.5) !important;
  margin-right: (1em * -1.5) !important;
}
.profile-backdrop {
  background-color: #f6f9fc6e;
  backdrop-filter: brightness(102%) saturate(140%) blur(10px);
}
</style>
