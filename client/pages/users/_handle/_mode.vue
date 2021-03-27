<template>
  <div class="col px-0 profile-page">
    <div v-if="user" class="card-profile container" style="margin-top: 5em">
      <div class="b-overlay-wrap position-relative">
        <user-info :user="user" :mode="mode" :disabled="['pp', 'level']" />
      </div>
      <no-ssr>
        <waterfall
          :options="{
            gutter: 0,
            itemSelector: '.Waterfall-item',
            columnWidth: '.grid-sizer',
            stagger: 30
          }"
          style="width: calc(100% + 0.8em); left: -0.4em; padding-top: 0.4em"
        >
          <waterfall-item class="double-size">
            <level :user="user" class="height-fix-level" />
          </waterfall-item>
          <waterfall-item class="quad-size">
            <rank-info
              :user="user"
              :statistics-history="statisticsHistory"
              :mode="mode"
            />
          </waterfall-item>
          <waterfall-item class="double-size">
            <number-statistics :user="user" :historical-best="historicalBest" />
          </waterfall-item>
          <waterfall-item
            v-if="recentActivity.length"
            class="quad-size"
          >
            <activities :user="user" :recent-activity="recentActivity" />
          </waterfall-item>
          <waterfall-item
            v-for="badge of user.badges"
            :key="badge.description"
            class="grid-sizer"
          >
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
  async asyncData ({ params, $axios, $config: { baseURL }, store }) {
    console.log({
      server: process.server,
      client: process.client
    })
    let result = {
      user: undefined,
      statisticsHistory: []
    }
    const path = `/api/users/${params.handle}${
      params.mode ? `/${params.mode}` : ''
    }`
    result = await $axios.get(path).then(res => res.data)
    const mode = params.mode || (result.user ? result.user.playmode : undefined)
    store.commit('User/setMode', mode)
    return {
      user: result.user,
      recentActivity: result.recentActivity || [],
      statisticsHistory: result.statisticsHistory || [],
      historicalBest: result.historicalBest[0],
      mode
    }
  },
  head () {
    return {
      title: 'Statistics of ' + [this.user.username, this.mode].join(' | '),
      meta: [
        // hid is used as unique identifier. Do not use `vmid` for it as it will not work
        {
          hid: 'description',
          name: 'description',
          content: [
              `Statistics of ${this.user.username}:`,
              `${this.$t('userInfo.global')} Rank: #${this.user.statistics.rank.global || this.user.statistics.global_rank || ' - '}`,
              `${this.user.country.code} Rank: #${this.user.statistics.rank.country || this.user.statistics.country_rank || ' - '}`
          ].join('\n')
        }
      ]
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
.mx--4 {
  margin-left: (1em * -1.5) !important;
  margin-right: (1em * -1.5) !important;
}
@import "~bootstrap/scss/functions";
@import "~bootstrap/scss/variables";
@import "~bootstrap/scss/mixins";
@include media-breakpoint-down(md) {
  .Waterfall-item {
    --var-base: calc(100% / 4);
    &.grid-sizer {
      width: var(--var-base);
    }
    &.single-size {
      width: calc(var(--var-base));
    }
    &.double-size {
      width: calc(var(--var-base) * 4);
    }
    &.quad-size {
      width: calc(var(--var-base) * 4);
    }
  }
}
@include media-breakpoint-up(md) {
  .Waterfall-item {
    --var-base: calc(100% / 6);
    &.grid-sizer {
      width: var(--var-base);
    }
    &.single-size {
      width: calc(var(--var-base));
    }
    &.double-size {
      width: calc(var(--var-base) * 2);
    }
    &.quad-size {
      width: calc(var(--var-base) * 4);
    }
  }
}

@include media-breakpoint-only(xs) {
  .height-fix-level {
    --calc1: calc(450vw - 0.8rem);
    height: 353.7vw / var(--calc1)
  }
}
@include media-breakpoint-only(sm) {
  .height-fix-level {
    height: 377.03px
  }
}
@include media-breakpoint-only(md) {
  .height-fix-level {
    height: 152.87px
  }
}
@include media-breakpoint-only(lg) {
  .height-fix-level {
    height: 219.53px
  }
}
@include media-breakpoint-only(xl) {
  .height-fix-level {
    height: 242.03px
  }
}
</style>
