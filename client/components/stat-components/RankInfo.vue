<template>
  <b-card v-if="numMode(mode) === 0 && history.length" no-body class="shadow">
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
    <apexchart :height="historyChart.chart.height" type="line" :options="historyChart.chart" :series="createSeries()" />
    <b-card-footer class="text-right py-1 small">
      {{ $t('CabbageHistory.disclaimer') }}
    </b-card-footer>
  </b-card>
  <b-card v-else-if="user.rankHistory && user.rankHistory.data.length" no-body class="shadow">
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
        data: user.rankHistory.data.map((data,index) => ({x: index, y: data || null}))
      }]"
    />
  </b-card>
</template>

<script>
export default {
  filters: {
    decodeEntities (value) {
      if (!value) { return '' }
      value = value.toString()
      const parsed = new DOMParser().parseFromString(value, 'text/html')
      return parsed.documentElement.textContent
    }
  },
  props: {
    user: {
      type: Object,
      default: () => {}
    },
    statisticsHistory: {
      type: Array,
      default: () => []
    },
    mode: {
      type: String,
      default: undefined
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
  },
  methods: {
    dateHistory () {
      if (!this.history.length) { return [] }
      return this.history.map(({ queryDate: { year, month, day } }) => new Date(`${year}-${month}-${day}`))
    },
    numMode (mode) {
      if (mode === 'osu') { return 0 }
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
    }
  }
}
</script>
