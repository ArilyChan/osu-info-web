<template>
  <div class="col px-0 profile-page">
    <div v-if="user" class="card-profile container" style="margin-top: 5em">
      <div class="b-overlay-wrap position-relative">
        <osu-user-info :user="user" :mode="mode" :bg-cover="false">
          <template #body>
            <b-card-body class="fix-a">
              <div class="border-top text-left">
                <v-runtime-template :template="userpage" class="mt-2" />
              </div>
            </b-card-body>
          </template>
        </osu-user-info>
      </div>
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
import { mapState } from 'vuex'
import bbCodeParser from 'js-bbcode-parser'
import VRuntimeTemplate from 'v-runtime-template'
const defaultCodes = [...bbCodeParser.codes]
bbCodeParser.setCodes({
  '\\[center\\](.*?)\\[/center\\]': '<div class="text-center">$1</div>',
  '\\[centre\\](.*?)\\[/centre\\]': '<div class="text-center">$1</div>',
  '\\[s\\](.*?)\\[/s\\]': '<s>$1</s>',
  '\\[strike\\](.*?)\\[/strike\\]': '<s>$1</s>',
  '\\[img\\]\\[/img\\]': ' ',
  '\\[list\\](.*?)\\[/list\\]': '<b-list-group>$1</b-list-group>',
  '\\[list=(.+?)\\](<br>)??(.*?)(<br>)??\\[/list\\]': '<b-card no-body><b-card-header class="p-2">$1</b-card-header><b-list-group flush>$3</b-list-group></b-card>',
  // '<br>\\[\\*\\](.+?)<br><br>': '<b-list-group-item>$1</b-list-group-item>',
  // '<br>\\[\\*\\](.+?)<br>': '<b-list-group-item>$1</b-list-group-item>',
  '\\[\\*\\](.+?)<br>': '<b-list-group-item>$1</b-list-group-item>',
  '\\[img\\](.+?)\\[/img\\]': '<img src="$1" style="max-width:100%">',
  '\\[profile=([0-9]+)\\](.+?)\\[/profile\\]': '<osu-popup-user class="display-inline" :user="{id: \'$1\', username: \'$2\'}">$2<template #fallback-no-aka><h5 class="text-nowrap m-0">$2</h5><nuxt-link :to="localePath(\'/userpage/$1\')">userpage</nuxt-link><br><a href="https://osu.ppy.sh/users/$1">Bancho profile</a></template></osu-popup-user>',
  '\\[profile](.+?)\\[/profile\\]': '<nuxt-link :to="localePath(\'/users/$1\')">$1</nuxt-link>',
  '\\[heading\\](.+?)\\[/heading\\]': '<b-card-title class="text-center">$1</b-card-title>',
  '\\[notice\\](.*?)\\[/notice\\]': '<b-jumbotron>$1</b-jumbotron>',
  '\\[size=([0-9]+)\\](.+?)\\[/size\\]': '<div style="font-size: calc($1px / 5)">$2</div>',
  '\\[box=(.*?)\\](<br>)??(.+?)\\[/box\\]': [
    '<b-card no-body class="mt-2">',
    '<b-card-header class="p-2" v-if="`$1` !== ``">$1</b-card-header>',
    '<b-card-body>$3</b-card-body></b-card>'].join('')
})
const newCodes = [...bbCodeParser.codes]
bbCodeParser.codes = [...newCodes, ...defaultCodes]
export default {
  layout: 'default',
  components: {
    VRuntimeTemplate
  },
  async asyncData ({ params, $axios, $config: { baseURL }, store }) {
    let result = {
      user: undefined
    }
    const path = `/api/users/${encodeURIComponent(params.id)}${params.mode ? `/${params.mode}` : ''}`
    result = await $axios.get(path).then(res => res.data)

    const mode = result.score ? result.score.mode : params.mode || (result.user ? result.user.playmode : undefined)
    store.commit('user/setMode', mode)
    store.commit('user/setUser', result.user)
    return {
      mode
    }
  },
  data () {
    return {
      userpage: ''
    }
  },
  computed: mapState({
    user: state => state.user.data
  }),
  mounted () {
    this.userpage = this.convertBBCode(this.user.page.raw)
  },
  methods: {
    convertBBCode (bbcode) {
      // bbcode = bbcode.split('\n[').join('[')
      bbcode = bbcode.split('\n').join('<br>')
      bbcode = bbCodeParser.parse(bbcode)
      bbcode = bbcode.split('><br><br><').join('><br><')
      // bbcode = this.replaceEmoji(bbcode)
      return `<div>${bbcode}</div>`
    },
    replaceEmoji (html) {
      Object.entries({
        ':peppy:': '<img src="/static/emotes/peppy.png">',
        ':barney:': '<img src="/static/emotes/barney.png">',
        ':akerino:': '<img src="/static/emotes/akerino.png">',
        ':foka:': '<img src="/static/emotes/foka.png">',
        ':kappy:': '<img src="/static/emotes/kappy.png">',
        ':creepypeppy:': '<img src="/static/emotes/creepypeppy.png">',
        ':peppyfiero:': '<img src="/static/emotes/peppyfiero.png">',
        ':djpeppy:': '<img src="/static/emotes/djpeppy.png">',
        ':kappa:': '<img src="/static/emotes/kappa.png">'
      }).map(([occur, replace]) => (html = html.split(occur).join(replace)))
      return html
    },
    toStrMode (numericMode = this.numericMode) {
      switch (numericMode) {
        case 0:
          return 'std'
        case 1:
          return 'taiko'
        case 2:
          return 'ctb'
        case 3:
          return 'mania'
        default:
          break
      }
    },
    smallerFloatHtml (str) {
      const splitted = str.split('.')
      return `${splitted[0]}<small>.${splitted[1]}</small></span>`
    }
  },
  head () {
    return {
      title: 'Userpage of ' + [this.user.username].join(' | '),
      meta: [
        // hid is used as unique identifier. Do not use `vmid` for it as it will not work
        {
          hid: 'description',
          name: 'description',
          content: [
              `Userpage of ${this.user.username}:`
          ].join('\n')
        }
      ]
    }
  }
}
</script>

<style>
.fix-a a {
  display: inline-block;
}
</style>
