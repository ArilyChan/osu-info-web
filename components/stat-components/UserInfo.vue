<template>
  <card
    shadow
    class="card-profile bg-cover"
    no-body
    :style="{
      '--cover-url': `url('${user.cover.url}')`,
    }"
  >
    <div class="px-4">
      <b-card-header
        class="row flex-nowrap justify-content-center p-0 mx--4 profile-backdrop"
      >
        <div class="col-lg-3 order-1 order-lg-2">
          <div class="card-profile-image">
            <a :href="`https://osu.ppy.sh/users/${user.username}`">
              <img v-lazy="avatarSrc" class="rounded-circle">
            </a>
          </div>
        </div>
        <div
          class="col-lg-4 order-2 order-lg-1 text-lg-right align-self-lg-center px-0 pl-md-4"
        >
          <div class="card-profile-stats d-flex justify-content-md-center">
            <div class="mx-1">
              <span class="heading text-large">{{ mode }}</span>
              <span class="description text-little-larger">{{ $t('userInfo.mode') }}</span>
            </div>
            <div class="mx-1">
              <span class="heading text-large">{{ acc }}</span>
              <span class="description text-little-larger">{{ $t('userInfo.accuracy') }}</span>
            </div>
            <div v-show="!disabled.includes('level')">
              <span class="heading text-large">{{ user.statistics.level.current + user.statistics.level.progress / 100 }}</span>
              <span class="description text-little-larger">{{ $t('userInfo.level') }}</span>
            </div>
          </div>
        </div>
        <div class="col-lg-4 order-2 order-lg-3 px-0">
          <div class="card-profile-stats d-flex justify-content-md-center">
            <div v-show="!disabled.includes('pp')" class="mr-1">
              <span class="heading text-large">{{ user.statistics.pp }}</span>
              <span class="description text-little-larger">PP</span>
            </div>
            <div class="mx-1">
              <span
                class="heading text-large"
              >#{{ user.statistics.rank.global || user.statistics.global_rank || ' - ' }}</span>
              <span class="description text-little-larger">{{ $t('userInfo.global') }}</span>
            </div>
            <div class="mx-1">
              <span
                class="heading text-large"
              >#{{ user.statistics.rank.country || user.statistics.country_rank || ' - ' }}</span>
              <span
                class="description text-little-larger"
              ><gb-flag
                :code="user.country.code"
                size="small"
                icon-path="/assets/flags"
                class="mr-1"
              /></span>
            </div>
          </div>
        </div>
      </b-card-header>
      <div class="text-center mx--4 card-body-backdrop-filter-base">
        <h1 class="pt-2">
          {{ user.username }}
        </h1>
        <div
          v-if="user.previous_usernames.length"
          class="d-flex justify-content-center align-items-baseline"
        >
          <h3 class="pr-1">
            {{ $t('userInfo.usernameAlias') }}
          </h3>
          <p class="mb-0 text-large">
            {{ user.previous_usernames.join(", ") }}
          </p>
        </div>
        <!-- <h5>{{ mode }} 模式</h5> -->
        <!-- <h4 class="mb-0 pb-1">
          注册于 {{ new Date(user.join_date).toLocaleDateString() }}
          {{ new Date(user.join_date).toLocaleTimeString() }}
        </h4> -->
      </div>
      <!-- <div class="mt-5 py-5 border-top text-left">
              <p class="px-5" v-html="convertBBCode(user.page.raw)" />
            </div> -->
    </div>
    <b-card-footer class="py-1 profile-backdrop">
      <b-container fluid>
        <b-row class="justify-content-md-center flex-wrap">
          <b-col col lg="auto" class="text-nowrap">
            <i class="fas fa-globe-americas" />
            {{ user.is_online ? $t('userInfo.online') : `${$t('userInfo.offline') }, ${$t('userInfo.lastActivityAt', {t: `${new Date(user.last_visit).toLocaleDateString(currentLocale.iso)} ${new Date(user.last_visit).toLocaleTimeString(currentLocale.iso)}`})}` }}
          </b-col>
          <!-- <b-col>{{ $i18n.locale }}</b-col> -->
          <b-col v-if="user.location" col lg="auto" class="text-nowrap">
            <i class="fas fa-map-marked pr-1" />{{ user.location }}
          </b-col>
          <b-col v-if="user.interests" col lg="auto" class="text-nowrap">
            <i class="fab fa-gratipay pr-1" />{{ user.interests }}
          </b-col>
          <b-col v-if="user.occupation" col lg="auto" class="text-nowrap">
            <i class="fas fa-briefcase pr-1" />{{ user.occupation }}
          </b-col>
          <b-col v-if="user.twitter" col lg="auto" class="text-nowrap">
            <i class="fab fa-twitter" />@{{ user.twitter }}
          </b-col>
          <b-col
            v-if="user.playstyle && user.playstyle.length"
            col
            lg="auto"
            class="text-nowrap"
          >
            <i class="fas fa-tags" />
            {{ $t('userInfo.playStyle', {styles: user.playstyle.join(", ") }) }}
          </b-col>
          <b-col v-if="user.discord" col lg="auto">
            <!-- <img src="~/assets/images/Discord-Logo-Color.png" height="20px"> -->
            <i class="fa-fw fab fa-discord" />
            {{ user.discord }}
          </b-col>
          <b-col col lg="auto">
            <i class="fas fa-plane-arrival" />
            {{ $t('userInfo.registeredAt', {t: new Date(user.join_date).toLocaleDateString() }) }}
          </b-col>
        </b-row>
      </b-container>
    </b-card-footer>
  </card>
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      default: () => {}
    },
    mode: {
      type: String,
      default: undefined
    },
    disabled: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    avatarSrc () {
      return this.user.avatar_url
    },
    acc () {
      return (this.user.statistics.hit_accuracy / 100).toLocaleString('en-GB', {
        style: 'percent',
        minimumFractionDigits: 2
      })
    },
    currentLocale () {
      return this.$i18n.locales.find(i => i.code === this.$i18n.locale)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~bootstrap/scss/functions";
@import "~bootstrap/scss/variables";
@import "~bootstrap/scss/mixins";
.text-large {
  font-size: 150% !important;
}
.text-little-larger {
  font-size: 120% !important;
}
.text-little-larger * {
  font-size: clear;
}
.mx--4 {
  margin-left: (1em * -1.5) !important;
  margin-right: (1em * -1.5) !important;
}
.card-profile-stats .description {
  white-space: nowrap;
}
.profile-backdrop {
  background-color: #f6f9fc6e;
  backdrop-filter: brightness(102%) saturate(140%) blur(10px);
}
.bg-cover {
  background-color: rgba(255, 255, 255, 0.83);

  .card-body-backdrop-filter-base {
    backdrop-filter: brightness(102%) saturate(140%) blur(3px);
  }

  &::before {
    content: "";
    position: absolute;
    border-radius: 0.25rem;
    width: 100%;
    height: 100%;
    z-index: -1;
    filter: contrast(70%) saturate(110%);
    background: var(--cover-url);
    background-size: cover;
    background-position: center;
  }
}

@include media-breakpoint-down(md) {
  .text-large {
    font-size: 120% !important;
  }
  .text-little-larger {
    font-size: 110% !important;
  }
  .text-little-larger * {
    font-size: clear;
  }
}
</style>
