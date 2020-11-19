<template>
  <div class="col px-0 profile-page">
    <div v-if="user" class="card-profile container" style="margin-top: 5em">
      <div class="b-overlay-wrap position-relative">
        <user-info :user="user" :mode="mode" />
      </div>
      <no-ssr>
        <waterfall
          :options="{
            gutter: 0,
            itemSelector: '.Waterfall-item',
            columnWidth: '.grid-sizer'
          }"
          style="width: calc(100% + 0.8em); left: -0.4em; padding-top: 0.4em"
        >
          <waterfall-item style="width:calc(100% / 3">
            <level :user="user" />
          </waterfall-item>
          <waterfall-item style="width:calc(100% / 3 * 2)">
            <rank-info :user="user" :statistics-history="statisticsHistory" :mode="mode" />
          </waterfall-item>
          <waterfall-item style="width:calc(100% / 3)">
            <number-statistics :user="user" />
          </waterfall-item>
          <waterfall-item v-if="recentActivity.length" style="width:calc(100% / 3 * 2)">
            <activities :user="user" :recent-activity="recentActivity" />
          </waterfall-item>
          <waterfall-item v-for="badge of user.badges" :key="badge.description" class="grid-sizer">
            <b-card no-body class="border-0 shadow">
              <b-card-img :src="badge.image_url" />
            </b-card>
          </waterfall-item>
          <waterfall-item v-show="false" class="grid-sizer" />
        </waterfall>
      </no-ssr>
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
import { Waterfall, WaterfallItem } from 'vue2-waterfall'
import UserInfo from '~/components/stat-components/UserInfo.vue'
import RankInfo from '~/components/stat-components/RankInfo.vue'
import NumberStatistics from '~/components/stat-components/NumberStatistics.vue'
import Activities from '~/components/stat-components/Activities.vue'
import Level from '~/components/stat-components/Level.vue'
export default {
  layout: 'default',
  components: {
    Waterfall,
    WaterfallItem,
    UserInfo,
    RankInfo,
    NumberStatistics,
    Activities,
    Level
  },
  async asyncData ({ params, $axios, $config: { baseURL } }) {
    let result = {
      user: undefined,
      statisticsHistory: []
    }
    const path = `/api/users/${params.handle}${params.mode ? `/${params.mode}` : ''}`
    if (process.server) {
      result = await $axios.get(`http://localhost:${process.env.PORT || 3000}${path}`).then(res => res.data)
    }
    if (process.client) {
      result = await $axios.get(`/api/users${path}`).then(res => res.data)
    }
    return {
      user: result.user,
      recentActivity: result.recentActivity || [],
      statisticsHistory: result.statisticsHistory || [],
      mode: params.mode || (result.user ? result.user.playmode : undefined)
    }
  }
}
</script>

<style lang="scss" scoped>
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
