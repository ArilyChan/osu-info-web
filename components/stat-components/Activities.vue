<template>
  <b-card class="border-0 shadow" no-body>
    <light-timeline :items="groupActivity()" class="m-0 mx-1">
      <template slot="tag" slot-scope="{ item }">
        {{ item.date.toDate().toLocaleDateString() }}
      </template>
      <template slot="content" slot-scope="{ item }">
        <b-list-group>
          <b-list-group-item v-for="(activity, index) in item.activity" :key="`${item.date}-${index}`" class="py-2">
            <b-card-text v-if="activity.type === 'rank'">
              Placed {{ activity.scoreRank }} <b>#{{ activity.rank }}</b> on <a :href="activity.beatmap.url">{{ activity.beatmap.title }}</a>
            </b-card-text>
            <b-card-text v-else-if="activity.type === 'rankLost'">
              Lost first place on <a :href="activity.beatmap.url">{{ activity.beatmap.title }}</a>
            </b-card-text>
            <b-card-text v-else-if="activity.type === 'beatmapPlaycount'">
              Played <a :href="activity.beatmap.url">{{ activity.beatmap.title }}</a> <b>#{{ activity.count }}</b> times
            </b-card-text>
            <b-card-text v-else-if="activity.type === 'achievement'">
              Achieved "{{ activity.achievement.name }}" achievement
            </b-card-text>
            <b-card-text v-else-if="activity.type === 'beatmapsetApprove'">
              {{ activity.approval | capitalizeFirstLetter }} map <a :href="activity.beatmapset.url">{{ activity.beatmapset.title }}</a>
            </b-card-text>
            <b-card-text v-else-if="activity.type === 'beatmapsetDelete'">
              Deleted map <a :href="activity.beatmapset.url">{{ activity.beatmapset.title }}</a>
            </b-card-text>
            <b-card-text v-else-if="activity.type === 'beatmapsetRevive'">
              Revived map <a :href="activity.beatmapset.url">{{ activity.beatmapset.title }}</a>
            </b-card-text>
            <b-card-text v-else-if="activity.type === 'beatmapsetUpdate'">
              Updated map <a :href="activity.beatmapset.url">{{ activity.beatmapset.title }}</a>
            </b-card-text>
            <b-card-text v-else-if="activity.type === 'beatmapsetUpload'">
              Uploaded map <a :href="activity.beatmapset.url">{{ activity.beatmapset.title }}</a>
            </b-card-text>
            <b-card-text v-else-if="activity.type === 'userSupportAgain'">
              Supported osu again!
            </b-card-text>
            <b-card-text v-else-if="activity.type === 'userSupportFirst'">
              Supported osu for the first time!
            </b-card-text>
            <b-card-text v-else-if="activity.type === 'userSupportGift'">
              Someone gifted <a :href="activity.user.url">{{ activity.user.username }}</a> a supporter tag!
            </b-card-text>
            <b-card-text v-else-if="activity.type === 'usernameChange'">
              Changed username to {{ user.username }}
            </b-card-text>
          </b-list-group-item>
        </b-list-group>
      </template>
    </light-timeline>
  </b-card>
</template>

<script>
export default {
  filters: {
    capitalizeFirstLetter (string) {
      return string.charAt(0).toUpperCase() + string.slice(1)
    }
  },
  props: {
    user: {
      type: Object,
      default: () => {}
    },
    recentActivity: {
      type: Array,
      default: () => []
    }
  },
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
