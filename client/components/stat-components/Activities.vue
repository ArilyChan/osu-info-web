<template>
  <b-card class="border-0 shadow" no-body>
    <light-timeline :items="groupActivity()" class="m-0 mx-1">
      <template slot="tag" slot-scope="{ item }">
        {{ item.date.toDate().toLocaleDateString() }}
      </template>
      <template slot="content" slot-scope="{ item }">
        <b-list-group class="shadow-sm">
          <b-list-group-item v-for="(activity, index) in item.activity" :key="`${item.date}-${index}`" class="py-2" variant="">
            <template v-if="activity.type === 'rank'">
              <b-card-text>
                Placed {{ activity.scoreRank }} <b>#{{ activity.rank }}</b> on <a :href="activity.beatmap.url">{{ activity.beatmap.title }}</a>
              </b-card-text>
            </template>
            <template v-else-if="activity.type === 'rankLost'">
              <b-card-text>
                Lost first place on <a :href="activity.beatmap.url">{{ activity.beatmap.title }}</a>
              </b-card-text>
            </template>
            <template v-else-if="activity.type === 'beatmapPlaycount'">
              <b-card-text>
                Played <a :href="activity.beatmap.url">{{ activity.beatmap.title }}</a> <b>#{{ activity.count }}</b> times
              </b-card-text>
            </template>
            <template v-else-if="activity.type === 'achievement'">
              <b-card-text>
                Achieved "{{ activity.achievement.name }}" achievement
              </b-card-text>
            </template>
            <template v-else-if="activity.type === 'beatmapsetApprove'">
              <b-card-text>
                {{ activity.approval | capitalizeFirstLetter }} map <a :href="activity.beatmapset.url">{{ activity.beatmapset.title }}</a>
              </b-card-text>
            </template>
            <template v-else-if="activity.type === 'beatmapsetDelete'">
              <b-card-text>
                Deleted map <a :href="activity.beatmapset.url">{{ activity.beatmapset.title }}</a>
              </b-card-text>
            </template>
            <template v-else-if="activity.type === 'beatmapsetRevive'">
              <b-card-text>
                Revived map <a :href="activity.beatmapset.url">{{ activity.beatmapset.title }}</a>
              </b-card-text>
            </template>
            <template v-else-if="activity.type === 'beatmapsetUpdate'">
              <b-card-text>
                Updated map <a :href="activity.beatmapset.url">{{ activity.beatmapset.title }}</a>
              </b-card-text>
            </template>
            <template v-else-if="activity.type === 'beatmapsetUpload'">
              <b-card-text>
                Uploaded map <a :href="activity.beatmapset.url">{{ activity.beatmapset.title }}</a>
              </b-card-text>
            </template>
            <template v-else-if="activity.type === 'userSupportAgain'">
              <b-card-text>
                Supported osu again!
              </b-card-text>
            </template>
            <template v-else-if="activity.type === 'userSupportFirst'">
              <b-card-text>
                Supported osu for the first time!
              </b-card-text>
            </template>
            <template v-else-if="activity.type === 'userSupportGift'">
              <b-card-text>
                Someone gifted <a :href="activity.user.url">{{ activity.user.username }}</a> a supporter tag!
              </b-card-text>
            </template>
            <template v-else-if="activity.type === 'usernameChange'">
              <b-card-text>
                Changed username to {{ user.username }}
              </b-card-text>
            </template>
          </b-list-group-item>
        </b-list-group>
      </template>
    </light-timeline>
  </b-card>
</template>

<script>
import { mapState } from 'vuex'
export default {
  filters: {
    capitalizeFirstLetter (string) {
      return string.charAt(0).toUpperCase() + string.slice(1)
    }
  },
  props: {
    // user: {
    //   type: Object,
    //   default: () => {}
    // },
    // recentActivity: {
    //   type: Array,
    //   default: () => []
    // }
  },
  computed: mapState({
    user: state => state.user.data,
    recentActivity: state => state.user.recentActivity
  }),
  methods: {
    groupActivity () {
      return this.recentActivity.reduce((acc, cur, index, recentActivity) => {
        const date = this.moment(cur.createdAt)
        const newDate = index === 0 || (index > 1 && this.moment(recentActivity[index - 1].createdAt).diff(date, 'days') > 1)
        if (newDate) { acc.push({ date, activity: [] }) }
        acc[acc.length - 1].activity.push(cur)
        return acc
      }, [])
    }
  }
}
</script>
<style lang="scss">
.item-tag {
  width: 70px !important
}
</style>
