<template>
  <b-card
    overlay
    class="mt-0-8 border-0 shadow"
    :img-src="user.cover.url"
  />
</template>
<script>
import bbCodeParser from 'js-bbcode-parser'
const defaultCodes = [...bbCodeParser.codes]
export default {
  beforeCreate () {
    const l2Parser = Object.assign(bbCodeParser, {})
    // l2Parser.__proto__ = bbCodeParser.__proto__
    l2Parser.setCodes({
      '\\[center\\](.+?)\\[/center\\]': '<div class="text-center">$1</div>',
      '\\[centre\\](.+?)\\[/centre\\]': '<div class="text-center">$1</div>'
    })
    const newCodes = l2Parser.codes
    bbCodeParser.codes = [...defaultCodes, ...newCodes]
  },
  methods: {
    convertBBCode (bbcode) {
      bbcode = bbcode.split('\n').join('<br>')
      bbcode = this.replaceEmoji(bbcode)
      bbcode = bbCodeParser.parse(bbcode)
      return bbcode
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
    }
  }
}
</script>
