<template>
  <hero>
    <client-only>
      <full-page
        ref="full-page"
        class="full-page"
        :options="{
          licenseKey: 'D56AAA76-BCAA4731-81149063-E140B512',
          sectionSelector: '.fullscreen-section'
        }"
      >
        <div class="fullscreen-section">
          <div class="container shape-container d-flex align-items-center">
            <b-card no-body class="shadow w-100">
              <b-card-header>
                <div class="d-flex">
                  <div class="text-center mr-auto">
                    {{ match.name }}
                  </div>
                  <div class="d-flex">
                    <b-card-text class="text-nowrap mb-0">
                      tournament starts at game #
                    </b-card-text>
                    <b-form-input
                      v-model.lazy="inputTournamentStartsAt"
                      type="number"
                      class="input-group-alternative"
                      size="sm"
                      style="width: 3em;"
                    />
                    <b-button size="sm" class="ml-2" @click="calcStats">
                      Reload
                    </b-button>
                  </div>
                </div>
              </b-card-header>
              <b-card-body>
                <b-card-title>Players:</b-card-title>
                <b-avatar-group size="4em">
                  <b-avatar v-for="player in players" :key="`top-players-${player.id}`" class="shadow-sm">
                    <osu-popup-user class="display-inline" :user="player">
                      <div>
                        <b-img :src="player.avatar_url" class="w-100" />
                      </div>
                      <template #fallback-no-aka>
                        <h5 class="text-nowrap m-0">
                          {{ player.username }}
                        </h5>
                        <a :href="`https://osu.ppy.sh/users/${player.id}`">Bancho profile</a>
                      </template>
                    </osu-popup-user>
                  </b-avatar>
                </b-avatar-group>
                <hr>
                <b-container>
                  <b-row>
                    <b-col>
                      <b-card-title>MVP:</b-card-title>
                      <div class="d-flex align-items-end">
                        <b-avatar
                          v-for="player in statistics.mvp"
                          :key="`mvp-${player.id}`"
                          :src="player.avatar_url"
                          class="shadow-sm"
                          size="4rem"
                          badge-variant="danger"
                          badge-top
                        >
                          <osu-popup-user class="display-inline" :user="player">
                            <div>
                              <b-img :src="player.avatar_url" class="w-100" />
                            </div>
                            <template #fallback-no-aka>
                              <h5 class="text-nowrap m-0">
                                {{ player.username }}
                              </h5>
                              <a :href="`https://osu.ppy.sh/users/${player.id}`">Bancho profile</a>
                            </template>
                          </osu-popup-user>
                        </b-avatar>
                        <h1 class="ml-2 my-0">
                          × {{ statistics.maxMvpCount }}
                        </h1>
                      </div>
                    </b-col>
                    <b-col v-if="hosts.length">
                      <b-card-title>Host:</b-card-title>
                      <b-avatar-group size="4em">
                        <b-avatar v-for="player in hosts" :key="`top-players-${player.id}`" :src="player.avatar_url" class="shadow-sm">
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
                    </b-col>
                  </b-row>
                </b-container>
                <template v-if="statistics.teamVS.played">
                  <hr>
                  <b-card-title>Team VS Scores:</b-card-title>
                  <b-progress show-value height="2rem" :max="Object.values(statistics.teamVS.win).reduce((a,b) => a + b, 0)">
                    <b-progress-bar v-if="statistics.teamVS.win.blue" :value="statistics.teamVS.win.blue" variant="info">
                      <b-card-text>Blue: <strong>{{ statistics.teamVS.win.blue }}</strong></b-card-text>
                    </b-progress-bar>
                    <b-progress-bar v-if="statistics.teamVS.win.draw" :value="statistics.teamVS.win.draw" variant="secondary">
                      <b-card-text>Draw: <strong>{{ statistics.teamVS.win.draw }}</strong></b-card-text>
                    </b-progress-bar>
                    <b-progress-bar v-if="statistics.teamVS.win.red" :value="statistics.teamVS.win.red" variant="warning">
                      <b-card-text>Red: <strong>{{ statistics.teamVS.win.red }}</strong></b-card-text>
                    </b-progress-bar>
                  </b-progress>
                </template>
                <template>
                  <hr>
                  <b-card-title>Score Summing:</b-card-title>
                  <b-list-group>
                    <b-list-group-item
                      v-for="([player, totalScore]) in Array.from(statistics.userTotalScore).sort((a, b) => b[1] - a[1]).slice(0,5)"
                      :key="`player-totalscore-${player.id}`"
                      class="py-2"
                    >
                      <div class="d-flex">
                        <div
                          class="d-flex align-items-center"
                        >
                          <b-avatar
                            :src="player.avatar_url"
                            :alt="player.username"
                            size="3rem"
                            class="shadow"
                            badge-top
                            badge-offset="-0.3em"
                            button
                            badge-variant="danger"
                          >
                            <template v-if="statistics.mvp.includes(player)" #badge>
                              <i class="fas fa-crown" />
                            </template>
                          </b-avatar>
                          <h5 class="mx-2 mb-0">
                            {{ player.username }}
                          </h5>
                        </div>
                      </div>
                      <b-progress
                        :value="totalScore"
                        :max="statistics.maxUserTotalScore"
                        animated
                        class="mt-1 mb-0"
                      />
                    </b-list-group-item>
                  </b-list-group>
                </template>
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
                  <b-card
                    class="mt-2 shadow border-0"
                    overlay
                    :img-src="game.beatmap.beatmapset.covers['cover@2x']"
                  >
                    <!-- {{ event }} -->
                    <!-- <b-card-img  /> -->
                    <div class="d-flex">
                      <div class="rounded-lg overflow-hidden">
                        <div class="backdrop-blur hue-reversal">
                          <b-badge style="background-color: rgba(255,255,255);">
                            <b-card-title class="py-0 my-1 text-dark px-2">
                              {{ game.beatmap.beatmapset.artist_unicode || game.beatmap.beatmapset.artist }} - {{ game.beatmap.beatmapset.title_unicode || game.beatmap.beatmapset.title }} [{{ game.beatmap.version }}]
                            </b-card-title>
                          </b-badge>
                        </div>
                      </div>
                    </div>
                    <div class="hue-reversal text-white text-hue pl-1 pt-2">
                      <div>
                        <i v-for="index in Math.floor(game.beatmap.difficulty_rating)" :key="`sr-${game.id}-${index}`" class="fas fa-star" /><i v-if=" 0.75 < game.beatmap.difficulty_rating % 1 && game.beatmap.difficulty_rating % 1 < 1 " class="fas fa-star" /><i v-if=" 0.25 < game.beatmap.difficulty_rating % 1 && game.beatmap.difficulty_rating % 1 <= 0.75 " class="fas fa-star-half" />
                        {{ game.beatmap.difficulty_rating }}
                      </div>
                    </div>
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
    console.log({
      server: process.server,
      client: process.client
    })
    const path = `/api/matches/${params.id}`
    const result = await $axios.get(path).then(res => res.data)
    store.commit('User/setMode', 'mania')
    return result
  },
  data () {
    return {
      players: [],
      hosts: [],
      games: [],
      inputTournamentStartsAt: 1,
      tournamentStartsAt: 0,
      gameResults: [],
      statistics: {
        mvpCount: new Map(),
        mvp: [],
        maxMvpCount: 0,
        userTotalScore: new Map(),
        maxUserTotalScore: 0,
        teamVS: {
          Played: false,
          win: {
            red: 0,
            blue: 0,
            draw: 0
          },
          totalScore: {
            red: 0,
            blue: 0
          },
          winner: 'draw'
        },
        totalMatchPlayed: 0
      }
    }
  },
  computed: {
  },
  watch: {
    inputTournamentStartsAt (newv, oldv) {
      const v = parseInt(newv)
      if (v < 1) { this.inputTournamentStartsAt = 1 }
      if (v > this.games.length) { this.inputTournamentStartsAt = this.games.length }
      this.inputTournamentStartsAt = v
    }
  },
  created () {
    this.init()
  },
  mounted () {
    this.initClientOnlyComp()
  },
  methods: {
    allGameResults () {
      return this.games.map((game) => {
        const { player, host } = game.scores.reduce((acc, score) => {
          score.accuracy > 0.03 ? acc.player.push(score) : acc.host.push(score)
          return acc
        }, { player: [], host: [] })

        game.scores = player
        game.hostScores = host
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
        const minScore = Math.min(...scores.map(score => score.score))
        const mvp = scores.find(score => score.score === maxScore)
        const worst = scores.find(score => score.score === minScore)
        return {
          ...game,
          scores,
          teamScore,
          totalScore,
          teamWinner: teamScore && teamScore.red > teamScore.blue ? teamScore.red === teamScore.blue ? 'draw' : 'red' : 'blue',
          mvp,
          worst
        }
      })
    },
    calcStats () {
      this.resetStats()
      this.updateGameStatistics()

      this.updateTeamVSWinner()
      this.updateMvpCount()
      this.$refs['full-page'].api.reBuild()
    },
    resetStats () {
      this.tournamentStartsAt = this.inputTournamentStartsAt - 1
      this.statistics = {
        mvpCount: new Map(),
        mvp: [],
        userTotalScore: new Map(),
        maxUserTotalScore: 0,
        teamVS: {
          Played: false,
          win: {
            red: 0,
            blue: 0,
            draw: 0
          },
          totalScore: {
            red: 0,
            blue: 0
          },
          winner: 'draw'
        },
        totalMatchPlayed: 0
      }
      this.users.map((user) => {
        this.statistics.mvpCount.set(user, 0)
        this.statistics.userTotalScore.set(user, 0)
      })
    },
    updateGameStatistics () {
      this.gameResults.slice(this.tournamentStartsAt).reduce(({ mvpCount, userTotalScore, teamVS }, game) => {
        mvpCount.set(game.mvp.user, mvpCount.get(game.mvp.user) + 1)
        game.scores.forEach((score) => {
          userTotalScore.set(score.user, userTotalScore.get(score.user) + score.score)
        })
        if (game.team_type === 'team-vs') {
          teamVS.totalScore.red += game.teamScore.red
          teamVS.totalScore.blue += game.teamScore.blue
          teamVS.win[game.teamWinner] += 1
        }
        return { mvpCount, userTotalScore, teamVS }
      }, this.statistics)
      this.statistics.maxUserTotalScore = Math.max(...Array.from(this.statistics.userTotalScore).map(([user, score]) => score))
    },
    updateTeamVSWinner () {
      this.statistics.teamVS.played = Object.values(this.statistics.teamVS.win).reduce((acc, cur) => cur + acc, 0) > 0
      if (this.statistics.teamVS.played) {
        this.statistics.winner = this.statistics.teamVS.win.red - this.statistics.teamVS.win.blue > 0 ? 'red' : this.statistics.teamVS.win.red === this.statistics.teamVS.win.blue ? 'draw' : 'blue'
      }
    },
    updateMvpCount () {
      this.statistics.maxMvpCount = Math.max(...Array.from(this.statistics.mvpCount).map(([user, count]) => count))
      this.statistics.mvp = Array.from(this.statistics.mvpCount).filter(([mvp, count]) => count === this.statistics.maxMvpCount).map(([mvp]) => mvp)
    },
    init () {
      const matches = this.events.filter(event => event.game && event.game.scores.length).map(event => event.game)
      this.games = matches
      const userPlayed = this.users.filter(user => matches.some((match) => {
        const userScore = match.scores.find(score => score.user_id === user.id)
        return userScore && userScore.score > 5000
      }))
      this.players = userPlayed
      this.hosts = this.users.filter(user => !this.players.includes(user))
      this.gameResults = this.allGameResults()
    },
    initClientOnlyComp (count = 10) {
      this.$nextTick(() => {
        if (this.$refs['full-page']) {
          this.calcStats()
        } else if (count > 0) {
          this.initClientOnlyComp(count - 1)
        }
      })
    }
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

.hue-reversal {
  mix-blend-mode: exclusion;
  &.rounded {
    border-radius: 0.25rem !important;
  }
}
.backdrop-blur {
  backdrop-filter: contrast(50%) brightness(50%) blur(20px) ;
}
.text-hue {
  filter: contrast(150%) brightness(150%);
}
.rounded-lg {
  border-radius: 0.45rem;
}
</style>
