<template>
  <div class="col px-0 profile-page">
    <div v-if="user" class="card-profile container" style="margin-top: 5em">
      <div class="b-overlay-wrap position-relative">
        <user-info :user="user" :mode="mode" />
      </div>
      <score-detail v-if="score" :score="score" />
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
import ScoreDetail from '~/components/sb-components/Scores/ScoreDetail'
import UserInfo from '~/components/stat-components/UserInfo.vue'
export default {
  layout: 'default',
  components: {
    UserInfo,
    ScoreDetail
  },
  async asyncData ({ params, $axios, $config: { baseURL } }) {
    let result = {
      user: undefined
    }
    if (params.id === undefined || params.mode === undefined) {
      return {
        paramsCheck: false
      }
    }
    const path = `/api/scores/${params.mode}/${params.id}`
    result = await $axios.get(path).then(res => res.data)

    return {
      messages: result.messages || [],
      user: result.user,
      score: result.score,
      countryRanking: result.countryRanking,
      mode: params.mode || (result.user ? result.user.playmode : undefined)
    }
  },
  head () {
    return {
      title: 'Score: ' + [this.user.username, this.mode].join(' | '),
      meta: [
        // hid is used as unique identifier. Do not use `vmid` for it as it will not work
        {
          hid: 'description',
          name: 'description',
          content: ''
        }
      ]
    }
  }
}
</script>
