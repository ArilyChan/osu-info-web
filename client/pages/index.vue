<template>
  <hero>
    <section class="position-absolute" style="top:0;left:0;right:0;bottom:0; height:100vh">
      <b-container :class="[blur ?'blur' :'blur active']" fluid="md" class="h-100">
        <b-row class="h-100">
          <b-col class="my-auto">
            <b-row>
              <b-col>
                <div class="main-block shadow justify-content-between">
                  <div class="quaver" />
                  <div
                    class="content flex-grow-1 d-flex justify-content-center align-items-center"
                  >
                    <h1
                      class="text-white"
                      v-html="$t('landing.title')"
                    />
                    <p
                      class="lead text-white mt-4 mb-5"
                      v-html="$t('landing.subtitle')"
                    />
                    <div class="d-flex w-100 py-1">
                      <b-form-input
                        v-model="inputs.user"
                        class="alternative mx-1"
                        size="sm"
                        placeholder="osu username or id"
                      />
                      <b-button
                        class="mx-1"
                        size="sm"
                        :to="localePath({
                          name: 'users-handle-mode',
                          params: { handle: inputs.user }
                        })"
                      >
                        to user profile
                      </b-button>
                      <b-button
                        class="mx-1"
                        size="sm"
                        :to="localePath({
                          name: 'best-handle-mode',
                          params: { handle: inputs.user }
                        })"
                      >
                        best plays
                      </b-button>
                      <b-button
                        class="mx-1"
                        size="sm"
                        :to="localePath({
                          name: 'userpage-handle',
                          params: { id: inputs.user }
                        })"
                      >
                        userpage
                      </b-button>
                      <b-button
                        class="mx-1"
                        size="sm"
                        :to="localePath({
                          name: 'recent-handle-mode',
                          params: { handle: inputs.user }
                        })"
                      >
                        recent
                      </b-button>
                    </div>
                    <div class="d-flex w-100 py-1">
                      <b-form-input
                        v-model="inputs.matchId"
                        class="alternative mx-1"
                        size="sm"
                        placeholder="match id"
                      />
                      <b-button
                        class="mx-1"
                        size="sm"
                        :to="localePath({
                          name: 'matches-id',
                          params: { id: inputs.matchId }
                        })"
                      >
                        to match statistics
                      </b-button>
                    </div>
                  </div>
                </div>
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <b-collapse v-model="show">
                  <div class="row align-items-center pt-lg justify-content-around">
                    <!-- <div class="btn-wrapper" /> -->
                  </div>
                  <div class="row align-items-center pt-lg justify-content-around">
                    <div class="col mt-4">
                      <span class="text-white alpha-7 ml-3">{{ $t('landing.title') }}</span>
                      <!-- <a
            href="https://github.com/creativetimofficial/argon-design-system"
            target="_blank"
            title="Support us on Github"
          >
            <img
              src="img/brand/github-white-slim.png"
              style="height: 22px; margin-top: -3px"
            >
          </a> -->
                    </div>
                    <div class="col mt-4 mt-sm-0 text-right">
                      <span class="text-white alpha-7 mr-3">{{ $t("statements.testTitle") }}</span>
                      <!-- <a
              href="https://www.creative-tim.com"
              target="_blank"
              title="Creative Tim - Premium Bootstrap Themes and Templates"
            >
              <img
                src="img/brand/creativetim-white-slim.png"
                class="ml-3"
                style="height: 30px;"
              >
            </a> -->
                    </div>
                  </div>
                </b-collapse>
              </b-col>
            </b-row>
          </b-col>
        </b-row>
      </b-container>
    </section>
  </hero>
</template>
<script>
import hero from '~/components/sb-layouts/hero'
export default {
  layout: 'hero',
  components: {
    hero
  },
  data: () => ({
    blur: true,
    loading: true,
    inputs: {
      user: ''
    }
  }),
  computed: {
    show: {
      get () {
        return !this.loading
      },
      set () {}
    }
  },
  mounted () {
    setTimeout(() => (this.blur = false), 0)
    setTimeout(() => (this.loading = false), 500)
  }
}
</script>
<style scoped>
.blur {
    filter: blur(8px);
    transition: all 0.3s ease;
}
.active {
    filter: none;
}
.main-block {
    border-radius: 4px;
    display: flex;
    justify-content: center;
    margin-top: 110px;
    height: 260px;
    /* padding-right: 34px; */
    background: linear-gradient(87deg, #8c98dd53 0, #af9edd66 100%) !important;
    backdrop-filter: blur(15px);
}
.quaver {
    background-image: url(https://Akatsuki.pw/static/characters/quaver.png);
    background-repeat: no-repeat;
    height: 363px;
    width: 427px;
    align-self: flex-end;
}
.content {
    display: flex;
    flex-direction: column;
    color: #fff;
    height: 100%;
    justify-content: center;
}
@media (max-width: 990px) {
    .quaver {
        display: none;
    }
}
</style>
