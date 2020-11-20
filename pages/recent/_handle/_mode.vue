<template>
  <div class="col px-0 profile-page">
    <div v-if="user" class="card-profile container" style="margin-top: 5em">
      <div class="b-overlay-wrap position-relative">
        <user-info :user="user" :mode="mode" />
      </div>
      <beatmap-info v-slot="slotProps" :beatmap="score.beatmap" :beatmapset="score.beatmapset" class="mt-4">
        <b-container fluid>
          <b-row>
            <b-col cols="9" class="p-0">
              <b-card-body>
                <b-card-title>{{ slotProps.songName }}</b-card-title>
                <b-container fluid class="numeric">
                  <b-row>
                    <b-col>
                      <h1>{{ score.score.toLocaleString() }}</h1>
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col>
                      <h4>300: {{ score.statistics.count_300.toLocaleString() }}</h4>
                    </b-col>
                    <b-col>
                      <h4>
                        geki: {{ score.statistics.count_geki.toLocaleString() }}
                      </h4>
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col>
                      <h4>
                        100: {{ score.statistics.count_100.toLocaleString() }}
                      </h4>
                    </b-col>
                    <b-col>
                      <h4>
                        katu: {{ score.statistics.count_katu.toLocaleString() }}
                      </h4>
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col>
                      <h4>
                        50: {{ score.statistics.count_50.toLocaleString() }}
                      </h4>
                    </b-col>
                    <b-col>
                      <h4>
                        Miss: {{ score.statistics.count_miss.toLocaleString() }}
                      </h4>
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col>
                      <h3>
                        {{ score.max_combo.toLocaleString() }} combo
                      </h3>
                    </b-col>
                    <b-col>
                      <h3>
                        Acc: {{ score.accuracy.toLocaleString(undefined,{style: 'percent', minimumFractionDigits: 2}) }}
                      </h3>
                    </b-col>
                  </b-row>
                </b-container>
              </b-card-body>
            </b-col>
            <b-col cols="3" class="p-0">
              <div style="height:100%">
                <!-- {{ score.rank }} -->
                <img :src="`https://osu.ppy.sb/static/ranking-icons/${score.rank}.svg`">
              </div>
              <div class="position-absolute" style="right: 0; bottom: 0">
                {{ score.mods }}
              </div>
            </b-col>
          </b-row>
        </b-container>
      </beatmap-info>
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
import BeatmapInfo from '~/components/sb-components/BeatmapInfo.vue'
// import { Waterfall, WaterfallItem } from 'vue2-waterfall'
import UserInfo from '~/components/stat-components/UserInfo.vue'
// import RankInfo from '~/components/stat-components/RankInfo.vue'
// import NumberStatistics from '~/components/stat-components/NumberStatistics.vue'
// import Activities from '~/components/stat-components/Activities.vue'
// import Level from '~/components/stat-components/Level.vue'
export default {
  layout: 'default',
  components: {
    UserInfo, // Waterfall,
    // WaterfallItem,

    BeatmapInfo // RankInfo,
    // NumberStatistics,
    // Activities,
    // Level
  },
  async asyncData ({ params, $axios, $config: { baseURL } }) {
    let result = {
      user: undefined,
      statisticsHistory: []
    }
    const path = `/api/recent/${params.handle}${params.mode ? `/${params.mode}` : ''}`
    if (process.server) {
      result = await $axios.get(`http://localhost:${process.env.PORT || 3000}${path}`).then(res => res.data)
    }
    if (process.client) {
      result = await $axios.get(`/api/users${path}`).then(res => res.data)
    }
    return {
      user: result.user,
      score: result.score,
      countryRanking: result.countryRanking,
      mode: params.mode || (result.user ? result.user.playmode : undefined)
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
</style>
