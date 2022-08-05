<template>
  <div :id="`table-user-${user.id}-${random}`" class="d-inline">
    <nuxt-link :to="localePath(`/users/${user.id || user.username }`)">
      <slot><a>{{ user.username }}</a></slot>
    </nuxt-link>
    <b-popover
      :target="`table-user-${user.id}-${random}`"
      triggers="hover"
      placement="top"
    >
      <nuxt-link
        :to="localePath(`/users/${user.id || user.username }`)"
      >
        <div class="d-flex align-items-center">
          <b-aspect :aspect="1">
            <b-img
              :src="`https://a.ppy.sh/${user.id}`"
              :style="{
                width: '5rem'
              }"
              rounded
              class="shadow mr-2"
            />
          </b-aspect>

          <div>
            <slot name="content">
              <div v-if="user.username_aka && user.username_aka !== ''">
                <span>{{ t('userInfo.usernameAlias') }}</span>
                <h6 class="text-nowrap">
                  {{ user.username_aka }}
                </h6>
              </div>
              <slot v-else name="fallback-no-aka">
                <h6 class="text-nowrap m-0">
                  {{ user.username }}
                </h6>
              </slot>
            </slot>
          </div>
        </div>
      </nuxt-link>
    </b-popover>
  </div>
</template>
<script>
export default {
  props: {
    user: {
      type: Object,
      default: () => ({
        id: -1,
        username: 'Guest',
        username_aka: ''
      })
    },
    mode: {
      type: String,
      default: 'osu'
    }
  },
  data () {
    return {
      random: Math.random()
    }
  }
}
</script>
<style scoped>
.score-table-crop-img {
    width: 24px;
    height: 24px;
}
.score-table-crop-img img {
    object-fit: cover;
}
.img-2x {
    width: 128px;
}
</style>
