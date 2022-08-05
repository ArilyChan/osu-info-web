<template>
  <div class="col px-0 profile-page">
    <div v-if="user" class="card-profile container" style="margin-top: 5em">
      <div class="b-overlay-wrap position-relative">
        <user-info :disabled="['pp', 'level']" />
      </div>
      <client-only>
        <waterfall
          :options="{
            gutter: 0,
            itemSelector: '.Waterfall-item',
            columnWidth: '.grid-sizer',
            horizontalOrder: false,
            stagger: 50,
          }"
        >
          <!-- <waterfall-item class="wf-2">
            <level class="height-fix-level" />
          </waterfall-item> -->
          <waterfall-item
            :class="
              $store.state.user.createdLayouts.includes('RankHistoryChart')
                ? 'wf-2'
                : 'wf-4'
            "
          >
            <number-statistics
              :historical-best="historicalBest"
              :variant="
                $store.state.user.createdLayouts.includes('RankHistoryChart')
                  ? 'slim'
                  : 'wide'
              "
            />
          </waterfall-item>
          <waterfall-item v-if="recentActivity.length" class="wf-4">
            <activities />
          </waterfall-item>
          <waterfall-item class="wf-4">
            <rank-info :statistics-history="statisticsHistory" />
          </waterfall-item>
          <waterfall-item class="wf-2">
            <b-card v-if="$store.state.server === 'ripple'" class="shadow">
              <b-card-img :src="require('~/assets/icons/ripple.svg')" />
            </b-card>
            <b-card
              v-else-if="$store.state.server === 'akatsuki'"
              class="shadow"
              no-body
            >
              <b-card-img :src="require('~/assets/icons/akatsuki.png')" />
            </b-card>
            <b-card v-else-if="$store.state.server === 'bancho'" class="shadow">
              <b-card-img :src="require('~/assets/icons/bancho.png')" />
            </b-card>
            <b-card v-else class="shadow">
              {{ $t(`server.${this.$store.state.server}`) }}
            </b-card>
          </waterfall-item>
          <waterfall-item
            v-for="badge of user.badges"
            :key="badge.description"
            class="wf-1"
          >
            <b-card no-body class="border-0 shadow">
              <b-card-img :src="badge.image_url" />
            </b-card>
          </waterfall-item>
          <waterfall-item class="grid-sizer" />
        </waterfall>
      </client-only>
    </div>
    <div v-else class="card-profile container pt-5">
      <b-card
        title="$t('notFound')"
        header="Something went wrong..."
        class="shadow"
      />
    </div>
  </div>
</template>

<script>
import { Waterfall, WaterfallItem } from 'vue2-waterfall'
import { mapState } from 'vuex'
import UserInfo from '~/components/stat-components/UserInfo.vue'
import RankInfo from '~/components/stat-components/RankInfo.vue'
import NumberStatistics from '~/components/stat-components/StatisticTable.vue'
import Activities from '~/components/stat-components/Activities.vue'
// import Level from '~/components/stat-components/Level.vue'
export default {
  layout: 'default',
  components: {
    Waterfall,
    WaterfallItem,
    UserInfo,
    RankInfo,
    NumberStatistics,
    Activities
    // Level
  },
  async asyncData ({ params, $axios, query, store, error }) {
    let result = {}
    const path = `/api/users/${encodeURIComponent(params.handle)}${
      params.mode ? `/${params.mode}` : ''
    }`
    result = await $axios
      .get(path, { params: { server: query.server } })
      .then(res => res.data)
    if (!result) {
      return error({ statusCode: 404, message: 'User not found' })
    }
    const mode =
      params.mode || (result.user ? result.user.playmode : undefined)
    store.commit('user/setMode', mode)
    store.commit('user/setUser', result.user)
    store.commit('user/setRecentActivity', result.recentActivity)
    if (query.server) {
      store.commit('setServer', query.server)
    }
    return {
      // user: result.user,
      // recentActivity: result.recentActivity || [],
      statisticsHistory: result.statisticsHistory || [],
      historicalBest: result.historicalBest?.[0],
      mode
    }
  },
  computed: mapState({
    user: state => state.user.data,
    recentActivity: state => state.user.recentActivity
  }),
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
            `${this.$t('userInfo.global')} Rank: #${
              this.user.statistics.rank.global ||
              this.user.statistics.global_rank ||
              ' - '
            }`,
            `${
              this.user.country_code ||
              (this.user.country && this.user.country.code)
            } Rank: #${
              this.user.statistics.rank.country ||
              this.user.statistics.country_rank ||
              ' - '
            }`
          ].join('\n')
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.waterfall {
  --var-gap-base: 0.6rem;
  width: calc(100% + 2 * var(--var-gap-base));
  left: calc(var(--var-gap-base) * -1);
  margin-top: var(--var-gap-base);
  margin-bottom: var(--var-gap-base);
}
.Waterfall-item {
  & > * {
    margin: var(--var-gap-base) !important;
  }

  .card {
    background-color: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(5px);
    overflow: hidden;
  }
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
    &.wf-1,
    &.grid-sizer {
      width: var(--var-base);
    }
    &.wf-1 {
      width: calc(var(--var-base));
    }
    &.wf-2 {
      width: calc(var(--var-base) * 4);
    }
    &.wf-4 {
      width: calc(var(--var-base) * 4);
    }
  }
}
@include media-breakpoint-up(md) {
  .Waterfall-item {
    --var-base: calc(100% / 6);
    &.wf-1,
    &.grid-sizer {
      width: var(--var-base);
    }
    &.wf-2 {
      width: calc(var(--var-base) * 2);
    }
    &.wf-4 {
      width: calc(var(--var-base) * 4);
    }
  }
}

@include media-breakpoint-only(xs) {
  .height-fix-level {
    --calc1: calc(450vw - 0.8rem);
    height: 353.7vw / var(--calc1);
  }
}
@include media-breakpoint-only(sm) {
  .height-fix-level {
    height: 377.03px;
  }
}
@include media-breakpoint-only(md) {
  .height-fix-level {
    height: 152.87px;
  }
}
@include media-breakpoint-only(lg) {
  .height-fix-level {
    height: 219.53px;
  }
}
@include media-breakpoint-only(xl) {
  .height-fix-level {
    height: 242.03px;
  }
}
</style>
