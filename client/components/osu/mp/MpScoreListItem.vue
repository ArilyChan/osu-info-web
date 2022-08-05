<template>
  <b-list-group-item
    :set="(player = playerScore.user)"
    :variant="game.teamWinner === team ? undefined : 'dark'"
    class="py-2"
  >
    <div class="d-flex">
      <div
        class="d-flex align-items-center"
        :class="[team ==='blue' ? 'order-0' : 'order-1']"
      >
        <b-avatar
          :src="player.avatar_url"
          :alt="player.username"
          size="3rem"
          class="shadow"
          :class="[team === 'blue' ? 'order-0' : 'order-1']"
          :badge-variant="player === game.mvp.user ? 'warning' : undefined"
          badge-top
          badge-offset="-0.3em"
          button
        >
          <template v-if="player === game.mvp.user" #badge>
            <i class="fas fa-crown" />
          </template>
          <template v-else-if="player === game.worst.user" #badge>
            <!-- <i class="fas fa-crown" /> -->
            <!-- <div>Icons made by <a href="https://www.freepik.com" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div> -->
            <img :src="require('~/assets/icons/tornado.svg')">
          </template>
        </b-avatar>
        <h5 class="mx-2 mb-0" :class="[team === 'blue' ? 'order-1' : 'order-0']">
          {{ player.username }}
        </h5>
      </div>
      <div
        :class="[team ==='blue' ? 'order-1 ml-auto' : 'order-0 mr-auto']"
      >
        <div class="d-flex w-100 justify-content-between">
          <h5 class="mb-1" :class="[team ==='blue' ? 'order-0' : 'order-1']" />
          <small :class="[team ==='blue' ? 'order-1' : 'order-0']">{{ playerScore.accuracy.toLocaleString('en-US', { style: 'percent', minimumFractionDigits: 2 }) }}</small>
        </div>
        <b-card-title
          class="mb-0"
          :class="[team ==='blue' ? 'text-right' : 'text-left']"
        >
          {{ playerScore.score }}
        </b-card-title>
        <!-- <small>Donec id elit non mi porta.</small> -->
      </div>
    </div>
    <b-progress
      height="0.3rem"
      :value="playerScore.score"
      :max="game.teamScore && game.teamScore[team] || game.scoreBarMaxScore || game.maxScore"
      animated
      class="mt-1 mb-0"
      :variant="team === 'red' ? 'warning' : 'info'"
    />
  </b-list-group-item>
</template>

<script>
export default {
  props: {
    team: {
      type: String,
      default: 'blue'
    },
    playerScore: {
      type: Object,
      default: () => {}
    },
    game: {
      type: Object,
      default: () => {}
    }
  }
}
</script>
