<template>
  <div class="col px-0 profile-page">
    <div class="card-profile container" style="margin-top: 5em">
      <div class="b-overlay-wrap position-relative">
        <card
          shadow
          class="card-profile bg-cover"
          no-body
          :style="{
            '--cover-url': `url('${user.cover.url}')`
          }"
        >
          <div class="px-4">
            <b-card-header class="row flex-nowrap justify-content-center p-0 mx--4 profile-backdrop">
              <div class="col-lg-3 order-1 order-lg-2">
                <div class="card-profile-image">
                  <a :href="`https://osu.ppy.sh/users/${user.username}`">
                    <img v-lazy="avatarSrc" class="rounded-circle">
                  </a>
                </div>
              </div>
              <div class="col-lg-4 order-2 order-lg-1 text-lg-right align-self-lg-center px-0">
                <div class="card-profile-stats d-flex justify-content-md-center">
                  <div class="mx-1">
                    <span class="heading text-large">{{ user.id }}</span>
                    <span class="description text-little-larger">User ID</span>
                  </div>
                  <div class="mx-1">
                    <span class="heading text-large">{{ acc }}</span>
                    <span class="description text-little-larger">Accuracy</span>
                  </div>
                  <div v-show="false">
                    <span class="heading">0</span>
                    <span class="description">Level</span>
                  </div>
                </div>
              </div>
              <div class="col-lg-4 order-2 order-lg-3 px-0">
                <div class="card-profile-stats d-flex justify-content-md-center">
                  <div v-show="false" class="mx-1">
                    <span class="heading text-large">{{ user.statistics.pp }}</span>
                    <span class="description text-little-larger">PP</span>
                  </div>
                  <div class="mx-1">
                    <span class="heading text-large">#{{ user.statistics.rank.global }}</span>
                    <span class="description text-little-larger">Global</span>
                  </div>
                  <div class="mx-1">
                    <span class="heading text-large">#{{ user.statistics.rank.country }}</span>
                    <span class="description text-little-larger"><gb-flag
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
              <div v-if="user.previous_usernames.length" class="d-flex justify-content-center align-items-baseline">
                <h3 class="pr-1">
                  aka
                </h3>
                <p class="mb-0 text-large">
                  {{ user.previous_usernames.join(', ') }}
                </p>
              </div>
              <h5>{{ mode }} 模式</h5>
              <h4 class="mb-0 pb-1">
                注册于 {{ new Date(user.join_date).toLocaleDateString() }} {{ new Date(user.join_date).toLocaleTimeString() }}
              </h4>
            </div>
            <!-- <div class="mt-5 py-5 border-top text-left">
              <p class="px-5" v-html="convertBBCode(user.page.raw)" />
            </div> -->
          </div>
          <b-card-footer class="py-1 profile-backdrop">
            <b-container fluid>
              <b-row class="justify-content-md-center flex-wrap">
                <b-col col lg="auto" class="text-nowrap">
                  <i class="ni ni-planet pr-1" />{{ user.is_online ? '在线' : '离线' }}
                </b-col>
                <b-col v-if="user.location" col lg="auto" class="text-nowrap">
                  <i class="ni ni-square-pin pr-1" />{{ user.location }}
                </b-col>
                <b-col v-if="user.interests" col lg="auto" class="text-nowrap">
                  <i class="ni ni-favourite-28 pr-1" />{{ user.interests }}
                </b-col>
                <b-col v-if="user.occupation" col lg="auto" class="text-nowrap">
                  <i class="ni ni-briefcase-24 pr-1" />{{ user.occupation }}
                </b-col>
                <b-col v-if="user.twitter" col lg="auto" class="text-nowrap">
                  <i class="fab fa-twitter" />@{{ user.twitter }}
                </b-col>
                <b-col v-if="user.playstyle && user.playstyle.length" col lg="auto" class="text-nowrap">
                  <i class="ni ni-tag" />
                  用 {{ user.playstyle.join(', ') }} 打图
                </b-col>
                <b-col v-if="user.discord" col lg="auto">
                  <!-- <img src="~/assets/images/Discord-Logo-Color.png" height="20px"> -->
                  <i class="fa-fw fab fa-discord" />
                  {{ user.discord }}
                </b-col>
              </b-row>
            </b-container>
          </b-card-footer>
        </card>
      </div>
      <!-- <b-card
        overlay
        class="mt-0-8 border-0 shadow"
        :img-src="user.cover.url"
      /> -->
      <no-ssr>
        <waterfall
          :options="{
            gutter: 0,
            itemSelector: '.Waterfall-item',
            columnWidth: '.grid-sizer'
          }"
          style="width: calc(100% + 0.8rem); left: -0.4rem; padding-top: 0.4rem"
        >
          <!-- each component is wrapped by a waterfall slot -->
          <waterfall-item style="width:calc(33.33%)">
            <card shadow no-body>
              <apexchart style="width: 100%" type="radialBar" :options="levelRender" :series="[user.statistics.level.progress]" />
            </card>
          </waterfall-item>
          <waterfall-item v-if="numMode(mode) === 0 && statisticsHistory.length" style="width:calc(66.66%)">
            <b-card no-body class="shadow">
              <b-card-header class="d-inline-flex justify-content-end align-items-baseline py-2">
                <h5 class="pr-1">
                  今天你
                </h5>
                <h3>
                  <b>{{ user.statistics.pp }}</b><small>pp</small>
                </h3>
                <div v-if="ppHistory && ppHistory[ppHistory.length - 8] < user.statistics.pp">
                  , 你比上周刷多 {{ Math.round((user.statistics.pp - ppHistory[ppHistory.length - 8]+ Number.EPSILON ) * 100) / 100 }}pp, 真有你的
                </div>
                <div v-else-if="ppHistory && ppHistory[ppHistory.length - 8] > user.statistics.pp">
                  , 你比上周少了 {{ Math.round((user.statistics.pp - ppHistory[ppHistory.length - 8]+ Number.EPSILON ) * 100) / 100 }}pp, 你是不是倒刷了？
                </div>
              </b-card-header>
              <apexchart :height="historyChart.chart.height" type="line" :options="historyChart.chart" :series="createSeries()" />
              <b-card-footer class="text-right py-1 small">
                历史数据由白菜提供
              </b-card-footer>
            </b-card>
          </waterfall-item>
          <waterfall-item v-else-if="user.rankHistory && user.rankHistory.data.length" style="width:calc(100% / 3 * 2)">
            <b-card no-body class="shadow">
              <b-card-header class="d-inline-flex justify-content-end align-items-baseline py-2">
                <h5 class="pr-1">
                  今天你
                </h5>
                <h3>
                  <b>{{ user.statistics.pp }}</b><small>pp</small>
                </h3>
              </b-card-header>
              <apexchart
                type="line"
                :height="recentHistory.chart.height"
                :options="recentHistory.chart"
                :series="[{
                  name: 'Rank',
                  data: user.rankHistory.data.map((data,index) => ({x: index, y: data}))
                }]"
              />
            </b-card>
          </waterfall-item>
          <waterfall-item style="width:calc(100% / 3)">
            <card shadow no-body class="border-0">
              <apexchart type="radialBar" :options="ranks" :series="rankGradeCounts.percentages" />
              <b-table-simple
                hover
                small
                responsive
                striped
                class="p-0 m-0 border-0"
              >
                <colgroup><col><col></colgroup>
                <b-tbody>
                  <b-tr
                    v-for="(value, name) of kvStats()"
                    :key="`grade-count-${name}`"
                  >
                    <b-th class="text-right text-uppercase">
                      {{ name }}
                    </b-th>
                    <b-td>{{ value }}</b-td>
                  </b-tr>
                </b-tbody>
              </b-table-simple>
              <!-- <b-table-simple
                hover
                small
                caption-top
                responsive
                striped
                class="p-0 m-0"
              >
                <colgroup><col><col></colgroup>
                <b-thead head-variant="dark">
                  <b-tr>
                    <b-th class="text-right">
                      Rank
                    </b-th>
                    <b-th>Count</b-th>
                  </b-tr>
                </b-thead>
                <b-tbody>
                  <b-tr v-for="(count, rank) of user.statistics.grade_counts" :key="`grade-count-${rank}`">
                    <b-th class="text-right text-uppercase">
                      {{ rank }}
                    </b-th>
                    <b-td>{{ count }}</b-td>
                  </b-tr>
                </b-tbody>
              </b-table-simple> -->
            </card>
          </waterfall-item>
          <!-- <waterfall-item style="width:calc(100% / 3)">
            <card shadow no-body>
              <b-table-simple
                hover
                small
                responsive
                striped
                class="p-0 m-0 border-0"
              >
                <colgroup><col><col></colgroup>
                <b-tbody>
                  <b-tr
                    v-for="(value, name) of kvStats()"
                    :key="`grade-count-${name}`"
                  >
                    <b-th class="text-right text-uppercase">
                      {{ name }}
                    </b-th>
                    <b-td>{{ value }}</b-td>
                  </b-tr>
                </b-tbody>
              </b-table-simple>
            </card>
          </waterfall-item> -->
          <waterfall-item v-for="badge of user.badges" :key="badge.description" class="grid-sizer">
            <card shadow no-body class="border-0">
              <b-card-img :src="badge.image_url" />
            </card>
          </waterfall-item>
          <waterfall-item v-show="false" class="grid-sizer" />
        </waterfall>
      </no-ssr>
    </div>
  </div>
</template>

<script>
import { Waterfall, WaterfallItem } from 'vue2-waterfall'
import bbCodeParser from 'js-bbcode-parser'
const humanizeDuration = require('humanize-duration')
const defaultCodes = [...bbCodeParser.codes]
export default {
  layout: 'default',
  components: {
    // Waterfall,
    // WaterfallSlot
    Waterfall,
    WaterfallItem
  },
  async asyncData ({ params, $axios, $config: { baseURL } }) {
    // const statisticsHistory = await fetch('https://www.mothership.top/api/v1/userinfo/1123053?start=20191112&limit=365')
    //   .then(res => res.json())
    //   .then(res => res.data)
    //   .then(res => res.filter(r => r !== null))
    // const banchoApiResult = require('~/data/apiv2.json')
    // return {
    //   user: banchoApiResult,
    //   statisticsHistory
    // }
    let result = {
      user: undefined,
      statisticsHistory: []
    }
    const path = `/api/users/${params.handle}${params.mode ? `/${params.mode}` : ''}`
    if (process.server) {
      result = await $axios.get(`http://localhost:${process.env.PORT || 3000}${path}`).then(res => res.data)
    }
    if (process.client) {
      result = await $axios.get(`/api/users${path}`).then(res => res.data)
    }
    return {
      user: result.user,
      statisticsHistory: result.statisticsHistory,
      mode: params.mode || result.user.playmode
    }
  },
  data () {
    return {
      historyChart: {
        chart: {
          height: 200,
          type: 'line'
        }
      },
      levelRender: {
        chart: {
          type: 'radialBar'
        },
        colors: ['#20E647'],
        plotOptions: {
          radialBar: {
            hollow: {
              size: '70%'
            },

            dataLabels: {
              showOn: 'always',
              name: {
                offsetY: -10,
                show: true,
                color: '#888',
                fontSize: '18px'
              },
              value: {
                color: '#111',
                fontSize: '30px',
                show: true,
                formatter: () => `${this.user.statistics.level.current}.${this.user.statistics.level.progress}`
              }
            }
          }
        },
        fill: {
          type: 'gradient',
          gradient: {
            shade: 'dark',
            type: 'vertical',
            gradientToColors: ['#87D4F9'],
            stops: [0, 100]
          }
        },
        stroke: {
          lineCap: 'round'
        },
        labels: ['Level']
      },
      ranks: {},
      recentHistory: {
        chart: {
          height: 200,
          type: 'line',
          stroke: {
            curve: 'smooth'
          },
          xaxis: {
            // type: 'datetime',
            formatter: date => `${date} days ago`,
            labels: {
              show: false
            },
            axisBorder: {
              show: false
            },
            axisTicks: {
              show: false
            },
            crosshairs: {
              show: false
            }
          },
          chart: {
            toolbar: {
              show: false
            }
          },
          dataLabels: {
            enabled: false
          },
          yaxis: [{
            reversed: true,
            opposite: true,
            axisTicks: {
              show: true
            },
            axisBorder: {
              show: true,
              color: '#247BA0'
            },
            labels: {
              style: {
                colors: '#247BA0'
              }
            },
            title: {
              text: 'Rank',
              style: {
                color: '#247BA0'
              }
            }
          }]
        }
      }
    }
  },
  computed: {
    avatarSrc () {
      return this.user.avatar_url
    },
    acc () {
      return (this.user.statistics.hit_accuracy / 100).toLocaleString('en-GB', { style: 'percent', minimumFractionDigits: 2 })
    },
    pcHistory () {
      if (!this.statisticsHistory.length) { return [] }
      return this.statisticsHistory.map(rec => rec.playcount)
    },
    ppHistory () {
      if (!this.statisticsHistory.length) { return [] }
      return this.statisticsHistory.map(rec => rec.ppRaw)
    },
    ppRankHistory () {
      if (!this.statisticsHistory.length) { return [] }
      return this.statisticsHistory.map(rec => rec.ppRank)
    },
    rankGradeCounts () {
      const counts = this.user.statistics.grade_counts
      const values = Object.values(counts)
      const max = Math.max(...values)
      return {
        labels: Object.keys(counts),
        values,
        percentages: values.map(count => count / max * 100)
      }
    }
  },
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
  created () {
    const numMode = this.numMode(this.mode)
    this.statisticsHistory = this.statisticsHistory.filter(rec => rec.mode === numMode)
    const pp = this.ppHistory
    this.historyChart = {
      chart: {
        height: 300,
        type: 'line',
        stroke: {
          curve: 'smooth'
        },
        chart: {
          toolbar: {
            show: false
          }
        },
        xaxis: {
          type: 'datetime',
          formatter: date => date.toLocaleDateString('en-US'),
          labels: {
            show: false
          },
          axisBorder: {
            show: false
          },
          axisTicks: {
            show: false
          },
          crosshairs: {
            show: false
          }
        },
        dataLabels: {
          enabled: false
        },
        yaxis: [{
          min (min) { return Math.min(...pp) },
          max (max) { return Math.max(...pp) },
          forceNiceScale: true,
          decimalsInFloat: 0,
          axisTicks: {
            show: true
          },
          axisBorder: {
            show: true,
            color: '#FF1654'
          },
          labels: {
            style: {
              colors: '#FF1654'
            }
          },
          title: {
            text: 'PP',
            style: {
              color: '#FF1654'
            }
          }
        },
        {
          reversed: true,
          opposite: true,
          decimalsInFloat: 0,
          axisTicks: {
            show: true
          },
          axisBorder: {
            show: true,
            color: '#247BA0'
          },
          labels: {
            style: {
              colors: '#247BA0'
            }
          },
          title: {
            text: 'Rank',
            style: {
              color: '#247BA0'
            }
          }
        }]
      }
    }
    // this.ranks = {
    //   chart: {
    //     type: 'radialBar'
    //   },
    //   stroke: {
    //     lineCap: 'round'
    //   },
    //   plotOptions: {
    //     radialBar: {
    //       dataLabels: {
    //         total: {
    //           show: true,
    //           label: 'Rank',
    //           fontSize: '21px',
    //           formatter: val => ''
    //         },
    //         value: {
    //           show: true,
    //           fontSize: '14px',
    //           formatter: (v, w) => {
    //             const datas = this.rankGradeCounts
    //             // eslint-disable-next-line eqeqeq
    //             const index = datas.percentages.findIndex(t => t == v)
    //             return datas.values[index]
    //           }
    //         }
    //       }
    //     }
    //   },
    //   labels: this.rankGradeCounts.labels
    // }
    this.ranks = {
      series: this.rankGradeCounts.percentages,
      chart: {
        height: 390,
        type: 'radialBar'
      },
      stroke: {
        lineCap: 'round'
      },
      plotOptions: {
        radialBar: {
          offsetY: 0,
          startAngle: 0,
          endAngle: 270,
          hollow: {
            margin: 5,
            size: '30%',
            background: 'transparent',
            image: undefined
          },
          dataLabels: {
            name: {
              show: false
            },
            value: {
              show: false
            }
          }
        }
      },
      // colors: ['#1ab7ea', '#0084ff', '#39539E', '#0077B5'],
      labels: this.rankGradeCounts.labels,
      legend: {
        show: true,
        floating: true,
        fontSize: '13px',
        position: 'left',
        offsetX: 25,
        offsetY: -12,
        labels: {
          useSeriesColors: true
        },
        markers: {
          size: 0
        },
        formatter: (seriesName, opts) => {
          return seriesName.toUpperCase() + ':  ' + this.rankGradeCounts.values[opts.seriesIndex]
        },
        itemMargin: {
          vertical: 0
        }
      },
      responsive: [{
        breakpoint: 480,
        options: {
          legend: {
            show: false
          }
        }
      }]
    }
  },
  methods: {
    dateHistory () {
      if (!this.statisticsHistory.length) { return [] }
      return this.statisticsHistory.map(({ queryDate: { year, month, day } }) => new Date(`${year}-${month}-${day}`))
    },
    createSeries () {
      if (!this.statisticsHistory.length) { return [] }
      // const { ppHistory, ppRankHistory, dateHistory } = this
      const pp = this.ppHistory
      const rank = this.ppRankHistory
      const dateHistory = this.dateHistory()
      return Object.entries({ pp, rank }).map(([name, data]) => {
        return ({
          name,
          data: data.map((d, index) => ({
            x: dateHistory[index],
            y: d
          }))
        })
      })
    },
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
    },
    numMode (mode) {
      if (mode === 'osu') { return 0 }
      if (mode === 'taiko') { return 1 }
      if (mode === 'fruits') { return 2 }
      if (mode === 'mania') { return 3 }
      return -1
    },
    kvStats () {
      return {
        排名总分: this.user.statistics.ranked_score.toLocaleString(),
        游玩次数: this.user.statistics.play_count.toLocaleString(),
        游玩总时长: humanizeDuration(this.user.statistics.play_time * 1000, { units: ['h', 'm', 's'], language: 'zh_CN' }),
        tth: this.user.statistics.total_hits.toLocaleString()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.card-profile-stats .description {
  white-space: nowrap;
}
.Waterfall-item > * {
  margin: 0.4rem !important;
}
.pt-0-8 {
  padding-top: 0.8rem !important;
}
.mt-0-8 {
  margin-top: 0.8rem !important;
}
.text-large {
  font-size: 150% !important;
}
.text-little-larger {
  font-size: 120% !important;
}
.text-little-larger * {
  font-size: clear;
}
.grid-sizer {
  width: calc(100% / 6);
}
.mx--4 {
  margin-left: (1rem * -1.5) !important;
  margin-right: (1rem * -1.5) !important;
}
.profile-backdrop {
  background-color: #f6f9fc4f;
  backdrop-filter: brightness(102%) saturate(140%) blur(10px);
}
.bg-cover {
  background-color: rgba(255,255,255,0.8);

  .card-body-backdrop-filter-base {
    backdrop-filter: brightness(102%) saturate(140%) blur(2px);
  }

  &::before {
    content: '';
    position: absolute;
    border-radius: 0.25rem;
    width: 100%;
    height: 100%;
    z-index: -1;
    filter: contrast(70%) saturate(110%);
    background: var(--cover-url);
    background-size: cover
  }
}
</style>
