<template>
  <div class="col px-0 profile-page">
    <div v-if="user" class="card-profile container" style="margin-top: 5em">
      <div class="b-overlay-wrap position-relative">
        <user-info :user="user" :mode="mode" />
      </div>
      <score-list-card :list="scores" class="pt-3" />
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
import { mapState } from 'vuex'
import ScoreListCard from '~/components/sb-components/Scores/ScoreListCard.vue'
import UserInfo from '~/components/stat-components/UserInfo.vue'
export default {
  layout: 'default',
  components: {
    UserInfo,
    ScoreListCard
  },
  async asyncData ({ params, $axios, query, error, route, store }) {
    let result = {
      user: undefined
    }
    const path = `/api/best/${encodeURIComponent(params.handle)}${params.mode ? `/${params.mode}` : ''}`
    result = await $axios.get(path, {
      params: {
        ...route.query,
        server: query.server
      }
    }).then(res => res.data)
    if (!result.user) { return error({ status: 404, message: 'user not found' }) }
    const mode = params.mode || (result.user ? result.user.playmode : undefined)
    store.commit('user/setMode', mode)
    store.commit('user/setUser', result.user)
    if (query.server) { store.commit('setServer', query.server) }
    return {
      scores: result.scores,
      countryRanking: result.countryRanking,
      mode
    }
  },
  computed: mapState({
    user: state => state.user.data
  }),
  head () {
    return {
      title: 'Best scores of ' + [this.user.username, this.mode].join(' | '),
      meta: [
        // hid is used as unique identifier. Do not use `vmid` for it as it will not work
        {
          hid: 'description',
          name: 'description',
          content: [
              `Best scores of ${this.user.username}:`
          ].join('\n')
        }
      ]
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
.mx--4 {
  margin-left: (1em * -1.5) !important;
  margin-right: (1em * -1.5) !important;
}
</style>
