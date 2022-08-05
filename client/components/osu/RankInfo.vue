<template>
  <b-card v-if="history.length" no-body class="shadow">
    <b-card-header class="d-inline-flex justify-content-end align-items-baseline py-2">
      <h5 class="pr-1">
        {{ $t('CabbageHistory.ppTodayBefore') }}
      </h5>
      <h3>
        <b>{{ user.statistics.pp }}</b><small>pp</small>
      </h3>
      <h5 class="pl-1">
        {{ $t('CabbageHistory.ppTodayAfter') }}
      </h5>
      <div v-if="ppHistory && ppHistory[ppHistory.length - 8] < user.statistics.pp">
        , {{ $t('CabbageHistory.ppGain' , {ppGain: Math.round((user.statistics.pp - ppHistory[ppHistory.length - 8]+ Number.EPSILON ) * 100) / 100}) }}
      </div>
      <div v-else-if="ppHistory && ppHistory[ppHistory.length - 8] > user.statistics.pp">
        , {{ $t('CabbageHistory.ppDrop' , {ppDrop: Math.round((user.statistics.pp - ppHistory[ppHistory.length - 8]+ Number.EPSILON ) * 100) / 100}) }}
      </div>
    </b-card-header>
    <apexchart :height="motherShipHistory.chart.height" type="line" :options="motherShipHistory.chart" :series="createSeries()" />
    <b-card-footer class="text-right py-1 small">
      {{ $t('CabbageHistory.disclaimer') }}
    </b-card-footer>
  </b-card>
  <b-card v-else-if="user.rankHistory && user.rankHistory.data.length" no-body class="shadow">
    <b-card-header class="d-inline-flex justify-content-end align-items-baseline py-2">
      <h5 class="pr-1">
        {{ $t('CabbageHistory.ppTodayBefore') }}
      </h5>
      <h3>
        <b>{{ user.statistics.pp }}</b><small>pp</small>
      </h3>
    </b-card-header>
    <apexchart
      type="line"
      :height="banchoV2.chart.height"
      :options="banchoV2.chart"
      :series="[{
        name: 'Rank',
        data: user.rankHistory.data.map((data,index) => ({x: index, y: data || null}))
      }]"
    />
  </b-card>
</template>

<script>
import { mapState } from 'vuex'
let apexchart
if (process.browser) {
  apexchart = require('vue-apexcharts')
}
export default {
  components: {
    apexchart
  },
  filters: {
    decodeEntities (value) {
      if (!value) { return '' }
      value = value.toString()
      const parsed = new DOMParser().parseFromString(value, 'text/html')
      return parsed.documentElement.textContent
    }
  },
  props: {
    // user: {
    //   type: Object,
    //   default: () => {}
    // },
    statisticsHistory: {
      type: Array,
      default: () => []
    }
    // mode: {
    //   type: String,
    //   default: undefined
    // }
  },
  data () {
    return {
      motherShipHistory: {
        chart: {
          height: 200,
          type: 'line',
          stroke: {
            curve: 'smooth'
          }
        }
      },
      banchoV2: {
        chart: {
          height: 200,
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
    ...mapState({
      user: state => state.user.data,
      mode: state => state.user.mode
    }),
    pcHistory () {
      if (!this.history.length) { return [] }
      return this.history.map(rec => rec.playcount)
    },
    ppHistory () {
      if (!this.history.length) { return [] }
      return this.history.map(rec => rec.ppRaw)
    },
    ppRankHistory () {
      if (!this.history.length) { return [] }
      return this.history.map(rec => rec.ppRank)
    }
  },
  created () {
    const numMode = this.numMode(this.mode)
    this.history = this.statisticsHistory.filter(rec => rec.mode === numMode)
    const pp = this.ppHistory
    const ppRank = this.ppRankHistory
    this.motherShipHistory = {
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
        legend: {
        },
        colors: ['#2E93fA', '#E91E63'],
        xaxis: {
          type: 'datetime',
          formatter: date => date.toLocaleDateString('en-US'),
          labels: {
            show: true,
            hideOverlappingLabels: false
          },
          axisBorder: {
            show: false
          },
          axisTicks: {
            show: true
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
            color: '#2E93fA'
          },
          labels: {
            style: {
              colors: '#2E93fA'
            }
          }
          // title: {
          //   text: 'PP',
          //   style: {
          //     color: '#2E93fA'
          //   }
          // }
        },
        {
          min (min) { return Math.min(...ppRank) },
          max (max) { return Math.max(...ppRank) },
          reversed: true,
          forceNiceScale: true,
          opposite: true,
          decimalsInFloat: 0,
          axisTicks: {
            show: true
          },
          axisBorder: {
            show: true,
            color: '#E91E63'
          },
          labels: {
            style: {
              colors: '#E91E63'
            }
          }
          // title: {
          //   text: 'Rank',
          //   style: {
          //     cssClass: 'chart-yaxis-title',
          //     color: '#E91E63'
          //   }
          // }
        }]
      }
    }
    if (this.history.length || (this.user.rankHistory && this.user.rankHistory.data.length)) {
      this.$store.commit('pages/users/addLayout', 'RankHistoryChart')
    }
  },
  methods: {
    dateHistory () {
      if (!this.history.length) { return [] }
      return this.history.map(({ queryDate: { year, month, day } }) => new Date(`${year}-${month}-${day}`))
    },
    numMode (mode) {
      if (['osu', 'osu-rx'].includes(mode)) { return 0 }
      if (mode === 'taiko') { return 1 }
      if (mode === 'fruits') { return 2 }
      if (mode === 'mania') { return 3 }
      return -1
    },
    createSeries () {
      if (!this.history.length) { return [] }
      // const { ppHistory, ppRankHistory, dateHistory } = this
      const pp = this.ppHistory
      const rank = this.ppRankHistory
      const dateHistory = this.dateHistory().slice(-180)
      return Object.entries({ pp, rank }).map(([name, data]) => {
        return ({
          name,
          data: data.slice(-180).map((d, index) => ({
            x: dateHistory[index],
            y: d
          }))
        })
      })
    }
  }
}
</script>

<style lang="scss">
.chart-yaxis-title {
  margin: 0;
  padding: 0;
}
</style>
