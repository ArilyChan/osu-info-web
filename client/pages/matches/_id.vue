<template>
  <hero>
    <client-only>
      <full-page
        ref="fullpage"
        class="full-page"
        :options="{
          licenseKey: 'D56AAA76-BCAA4731-81149063-E140B512',
          sectionSelector: '.fullscreen-section'
        }"
      >
        <div class="fullscreen-section">
          <div class="container shape-container d-flex align-items-center">
            <b-card no-body class="shadow w-100">
              <b-card-header class="text-center">
                {{ match.name }}
              </b-card-header>
              <b-card-body>
                <template v-if="hosts.length">
                  <b-card-title>Host:</b-card-title>
                  <b-avatar-group size="4rem">
                    <b-avatar v-for="player in hosts" :key="`top-players-${player.id}`" :src="player.avatar_url" />
                  </b-avatar-group>
                </template>
                <b-card-title>Players:</b-card-title>
                <b-avatar-group size="4rem">
                  <b-avatar v-for="player in players" :key="`top-players-${player.id}`">
                    <osu-popup-user class="display-inline" :user="player">
                      <div>
                        <b-img :src="player.avatar_url" class="w-100" />
                      </div>
                      <template #fallback-no-aka>
                        <h5 class="text-nowrap m-0">
                          {{ player.username }}
                        </h5>
                        <a href="https://osu.ppy.sh/users/$1">Bancho profile</a>
                      </template>
                    </osu-popup-user>
                  </b-avatar>
                </b-avatar-group>
                <hr>
                <b-card-sub-title>{{ new Date(match.start_time) }} - {{ new Date(match.end_time) }}</b-card-sub-title>
              </b-card-body>
            </b-card>
          <!-- <p v-animate="{value: 'bounceInLeft'}" class="part-1">
            fullpage-vue
          </p> -->
          </div>
        </div>
        <div class="fullscreen-section min-vw-100">
          <div v-for="game in gameResults" :key="`game-${game.id}`" class="slide">
            <div class="d-flex align-items-center">
              <div class="min-vw-100">
                <div class="container">
                  <b-card class="mt-2 shadow border-0" no-body>
                    <!-- {{ event }} -->
                    <b-card-img :src="game.beatmap.beatmapset.covers['cover@2x']" />
                    <b-card-footer class="py-2 d-flex justify-content-between">
                      <div>{{ game.beatmap.beatmapset.artist_unicode || game.beatmap.beatmapset.artist }} - {{ game.beatmap.beatmapset.title_unicode || game.beatmap.beatmapset.title }} [{{ game.beatmap.version }}]</div>
                      <div>
                        <i v-for="_ in Math.floor(game.beatmap.difficulty_rating)" :key="`sr-${game.id}-${_}`" class="fas fa-star" /><i v-if=" 0.75 < game.beatmap.difficulty_rating % 1 && game.beatmap.difficulty_rating % 1 < 1 " class="fas fa-star" /><i v-if=" 0.25 < game.beatmap.difficulty_rating % 1 && game.beatmap.difficulty_rating % 1 <= 0.75 " class="fas fa-star-half" />
                        {{ game.beatmap.difficulty_rating }}
                      </div>
                    </b-card-footer>
                  </b-card>
                </div>
                <div v-if="game.team_type === 'team-vs'" :key="`game-${game.id}-detail`" class="mt-4 vw-100">
                  <b-container fluid="lg" class="mx-auto px-2">
                    <b-row>
                      <b-col v-for="team in ['blue', 'red']" :key="`game-${game.id}-${team}-stat`">
                        <b-card no-body :border-variant="team === 'red' ? 'warning' : 'info'">
                          <b-card-header class="d-flex justify-content-between py-2 px-3" :header-bg-variant="team === 'red' ? 'warning' : 'info' " :header-boarder-variant="team === 'red' ? 'warning' : 'info' " :header-text-variant="team === 'red' ? 'white' : undefined ">
                            <div v-if="team === 'blue'">
                              team {{ team }}
                            </div>
                            <b-card-title class="mb-0" :class="[team === 'red' ? 'text-white' : undefined]">
                              {{ game.teamScore[team] }}
                            </b-card-title>
                            <div v-if="team === 'red'">
                              team {{ team }}
                            </div>
                          </b-card-header>
                          <b-list-group flush>
                            <mp-score-list-item
                              v-for="playerScore in game.scores.filter(score => score.match.team === team && score.accuracy > 0.05)"
                              :key="`score-${game.id}-${playerScore.user_id}`"
                              :team="team"
                              :player-score="playerScore"
                              :game="game"
                            />
                          </b-list-group>
                        </b-card>
                      </b-col>
                    </b-row>
                  </b-container>
                </div>
                <div v-else :key="`game-${game.id}-detail`" class="mt-4 vw-100">
                  <div class="container">
                    <b-card no-body>
                      <b-list-group flush>
                        <mp-score-list-item
                          v-for="playerScore in game.scores.filter(score => score.accuracy > 0.05)"
                          :key="`score-${game.id}-${playerScore.user_id}`"
                          :player-score="playerScore"
                          :game="game"
                        />
                      </b-list-group>
                    </b-card>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </full-page>
    </client-only>
    <!-- <template v-for="event in events">
      <b-card v-if="!event.game" :key="`game-${event.id}`" class="mt-2 shadow">
        {{ event.detail.type }}
      </b-card>
    </template> -->
  </hero>
</template>

<script>
import hero from '~/components/sb-layouts/hero'
import MpScoreListItem from '~/components/stat-components/mp/MpScoreListItem'
export default {
  layout: 'hero',
  components: {
    hero,
    MpScoreListItem
  },
  async asyncData ({ params, $axios, $config: { baseURL }, store }) {
    const path = `/api/matches/${params.id}`
    let result
    if (process.server) {
      result = await $axios.get(`http://localhost:${process.env.PORT || 3000}${path}`).then(res => res.data)
    }
    if (process.client) {
      result = await $axios.get(path).then(res => res.data)
    }
    store.commit('User/setMode', 'mania')
    return result
  },
  data () {
    const vm = this
    return {
      players: [],
      hosts: [],
      games: [],
      index: 0,
      pageNum: 0,
      disabled: false,
      opts: {
        start: 0,
        dir: 'v',
        loop: false,
        duration: 300,
        beforeChange (ele, current, next) {
          console.log('before', current, next)
          vm.index = next
        },
        afterChange (ele, current) {
          vm.index = current
          console.log('after', current)
        }
      },
      horizontalOpts: {
        start: 0,
        dir: 'h',
        loop: false,
        afterChange (ele, current) {
          vm.active2 = current
        }
      },
      active2: 0
    }
  },
  computed: {
    gameResults () {
      return this.games.map((game) => {
        const teamScore = game.team_type === 'team-vs' ? {
          red: game.scores.filter(score => score.match.team === 'red').reduce((acc, cur) => acc + cur.score, 0),
          blue: game.scores.filter(score => score.match.team === 'blue').reduce((acc, cur) => acc + cur.score, 0)
        } : undefined
        const totalScore = game.scores.reduce((acc, cur) => acc + cur.score, 0)
        const scores = game.scores.map((score) => {
          return {
            ...score,
            user: this.users.find(user => score.user_id === user.id)
          }
        })
        const maxScore = Math.max(...scores.map(score => score.score))
        const mvp = scores.find(score => score.score === maxScore)
        return {
          ...game,
          scores,
          teamScore,
          totalScore,
          teamWinner: teamScore && teamScore.red > teamScore.blue ? teamScore.red === teamScore.blue ? 'draw' : 'red' : 'blue',
          mvp
        }
      })
    }
  },
  created () {
    const matches = this.events.filter(event => event.game && event.game.scores.length).map(event => event.game)
    this.games = matches
    const userPlayed = this.users.filter(user => matches.some((match) => {
      const userScore = match.scores.find(score => score.user_id === user.id)
      return userScore && userScore.score > 5000
    }))
    this.players = userPlayed
    this.hosts = this.users.filter(user => !this.players.includes(user))
  },
  head () {
    return {
      title: 'Match | ' + [this.match.name].join(' | '),
      meta: [
        // hid is used as unique identifier. Do not use `vmid` for it as it will not work
        {
          hid: 'description',
          name: 'description',
          content: [
              `${this.match.name}:`
          ].join('\n')
        }
      ]
    }
  }
}
</script>

<style lang="scss">
.vw-80 {
  margin: auto;
  width: 80vw !important
}
.min-vw-100 {
  margin-left: calc(-50vw + 50%);
  min-width: 100vw !important
}
</style>
