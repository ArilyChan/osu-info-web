<template>
  <card
    shadow
    class="card-profile"
    :class="[bgCover ? 'bg-cover' :'']"
    no-body
    :style="{
      '--cover-url': bgCover ? `url('${user.cover.url}')` :'',
    }"
  >
    <div class="px-4">
      <b-card-header
        class="row flex-nowrap justify-content-center p-0 mx--4 profile-backdrop"
      >
        <div class="col-lg-3 order-1 order-lg-2">
          <div class="card-profile-image">
            <nuxt-link
              :to="localePath({
                name: 'users-handle-mode',
                params: {
                  handle: user.id,
                  mode
                },
                query: {
                  server: $store.state.server
                }
              })"
            >
              <img ref="avatar" :src="avatarSrc" :class="autoRoundedImage()">
            </nuxt-link>
          </div>
        </div>
        <div
          class="col-lg-4 order-2 order-lg-1 text-lg-right align-self-lg-center px-0"
        >
          <div class="card-profile-stats d-flex justify-content-md-around">
            <div class="mx-1">
              <!-- <template v-if="!mode.includes('RX') && !mode.includes('AP')">
                <div class="heading text-large">
                  <osu-assets
                    :asset="`mode-${mode}-small`"
                    class="mode"
                  />
                </div>
                <span class="description">{{ $t(`mode.${mode}`) }}{{ $t('userInfo.mode') }}</span>
              </template> -->
              <!-- <template v-else> -->
              <span class="heading text-large text-transform-clear text-nowrap">{{ $t(`mode.${mode}`) }}</span>
              <span class="description text-little-larger">{{ $t('userInfo.mode') }}</span>
              <!-- </template> -->
            </div>
            <div v-show="!disabled.includes('acc')" class="mx-1">
              <span v-if="!disabled.includes('acc')" class="heading text-large">{{ acc }}</span>
              <span class="description text-little-larger">{{ $t('userInfo.accuracy') }}</span>
              <!-- <osu-asset-string :string="acc || ''" class="heading-osu-asset justify-content-center" overlap="-0.2em" /> -->
              <!-- <osu-assets asset="ranking-accuracy" class="description crop-acc" /> -->
            </div>
            <div v-show="!disabled.includes('level')">
              <span v-if="!disabled.includes('level')" class="heading text-large">{{ user.statistics.level.current + user.statistics.level.progress / 100 }}</span>
              <span class="description text-little-larger">{{ $t('userInfo.level') }}</span>
            </div>
          </div>
        </div>
        <div class="col-lg-4 order-2 order-lg-3 px-0">
          <div class="card-profile-stats d-flex justify-content-md-around">
            <div v-show="!disabled.includes('pp')" class="mr-1">
              <span v-if="!disabled.includes('pp')" class="heading text-large">{{ user.statistics.pp }}</span>
              <span class="description text-little-larger">{{ $t('pp') }}</span>
            </div>
            <div
              v-show="!disabled.includes('rank')"
              class="mx-1"
            >
              <span
                v-if="!disabled.includes('rank')"
                class="heading text-large"
              >#{{ user.statistics.rank.global || user.statistics.global_rank || ' - ' }}</span>
              <span class="description text-little-larger">{{ $t('userInfo.global') }}</span>
            </div>
            <div
              v-show="!disabled.includes('countryRank')"
              class="mx-1"
            >
              <span
                v-if="!disabled.includes('countryRank')"
                class="heading text-large"
              >#{{ user.statistics.rank.country || user.statistics.country_rank || ' - ' }}</span>
              <span
                class="description text-little-larger"
              ><gb-flag
                :code="user.country_code || user.country && user.country.code"
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
          v-show="user.previous_usernames && user.previous_usernames.length"
          class="d-flex justify-content-center align-items-baseline"
        >
          <h3 v-show="user.previous_usernames && user.previous_usernames.length" class="pr-1">
            {{ $t('userInfo.usernameAlias') }}
          </h3>
          <p v-show="user.previous_usernames && user.previous_usernames.length" class="mb-0 text-large">
            {{ user.previous_usernames.join(", ") }}
          </p>
        </div>
        <slot name="body" />
      </div>
    </div>
    <b-card-footer class="py-1 profile-backdrop">
      <b-container fluid>
        <b-row class="justify-content-md-center flex-wrap">
          <b-col v-if="user.is_online || user.last_visit" col lg="auto" class="text-nowrap">
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
          <b-col v-if="user.join_date" col lg="auto">
            <i class="fas fa-plane-arrival" />
            {{ $t('userInfo.registeredAt', {t: new Date(user.join_date).toLocaleDateString() }) }}
          </b-col>
        </b-row>
      </b-container>
    </b-card-footer>
  </card>
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: {
    // user: {
    //   type: Object,
    //   default: () => {}
    // },
    // mode: {
    //   type: String,
    //   default: undefined
    // },
    disabled: {
      type: Array,
      default: () => []
    },
    bgCover: {
      type: Boolean,
      default: true
    }
  },
  // mounted () {
  //   this.autoRoundedImage()
  // },
  computed: {
    ...mapState({
      user: state => state.user.data,
      mode: state => state.user.mode
    }),
    avatarSrc () {
      return this.user.avatar_url
    },
    acc () {
      if (!this.user.statistics) { return '' }
      return (this.user.statistics.hit_accuracy / 100).toLocaleString('en-GB', {
        style: 'percent',
        minimumFractionDigits: 2
      })
    },
    currentLocale () {
      return this.$i18n.locales.find(i => i.code === this.$i18n.locale)
    }
  },
  methods: {
    autoRoundedImage () {
      const img = this.$refs.avatar
      if (img === undefined) { return [] }
      if (!img.width || !img.height) { return [] }
      if (img.width / img.height < 1.1 && img.width / img.height > 0.9) { return ['rounded-circle'] } else { return [] }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~bootstrap/scss/functions";
@import "~bootstrap/scss/variables";
@import "~bootstrap/scss/mixins";
@import '~/assets/argon/scss/custom/variables';
.mode {
  filter: drop-shadow(0 0 0.2em rgba(0,0,0,0.4));
  padding-bottom: 0.3em;
}
.crop-acc {
  transform: translateX(10%);
}
.heading-osu-asset {
  height: 2.5em;
}
.card-profile-image {
  img {
    filter: drop-shadow(0 0 0.6rem rgba(0,0,0,0.2));
    max-width: 180px;
    @include media-breakpoint-up(xs) {
      min-width: 120px !important;
    }
    @include media-breakpoint-down(sm) {
      max-width: 120px !important;
    }
  }
}
.text-transform-clear {
  text-transform: none !important
}
.text-large {
  font-size: 150% !important;
}
.text-little-larger {
  font-size: 120% !important;
}
.text-110 {
  font-size: 110% !important;
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
    border-radius: $border-radius;
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
