<template>
  <b-card no-body class="shadow border-0">
    <apexchart
      v-if="rankGradeCounts.max && ready"
      height="300"
      type="radialBar"
      :options="ranks"
      :series="rankGradeCounts.percentages"
      class="ranks-chart"
    />
    <kv-table :kv-stats="kvStats()" />
    <b-card-footer v-if="historicalBest" class="py-1 text-right small rounded-bottom">
      {{ $t('numericalStatistics.disclaimer') }}
    </b-card-footer>
  </b-card>
</template>

<script>
import { mapState } from 'vuex'
import KVTable from './KVTable.vue'
const humanizeDuration = require('humanize-duration')
export default {
  components: { 'kv-table': KVTable },
  props: {
    // user: {
    //   type: Object,
    //   default: () => {}
    // },
    historicalBest: {
      type: [Object, null],
      default: () => {}
    }
  },
  data () {
    return {
      ranks: undefined,
      ready: false
    }
  },
  computed: {
    ...mapState({
      user: state => state.user.data
    }),
    rankGradeCounts () {
      const counts = this.user.statistics.grade_counts
      const values = Object.values(counts)
      const max = Math.max(...values)
      return {
        labels: Object.keys(counts),
        values,
        percentages: values.map(count => count / max * 100),
        max
      }
    }
  },
  mounted () {
    this.ready = true
  },
  created () {
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
        offsetX: 10,
        offsetY: -10,
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
      responsive: [
        {
          breakpoint: 576,
          options: {
            legend: {
              fontSize: '10px',
              offsetX: 10,
              offsetY: -10
            }
          }
        },
        {
          breakpoint: 768,
          options: {
            legend: {
              offsetX: 10,
              offsetY: 0
            }
          }
        },
        {
          breakpoint: 992,
          options: {
            legend: {
              offsetX: -28,
              offsetY: -10
            },
            chart: {
              height: 270
            }
          }
        },
        {
          breakpoint: 1200,
          options: {
            legend: {
              offsetX: 0,
              offsetY: -10
            }
          }
        }
      ]
    }
    this.$store.commit('user/addLayout', 'RankLevelChart')
  },
  methods: {
    kvStats () {
      const currentLocale = this.$i18n.locales.find(i => i.code === this.$i18n.locale)
      const iso = currentLocale.iso ? currentLocale.iso.split('-').join('_') : this.$i18n.locale
      const showPP = !this.$store.state.user.createdLayouts.includes('RankHistoryChart')
      const table = {
        [this.$t('pp')]: (showPP && this.user.statistics.pp.toLocaleString()) || undefined,
        [this.$t('numericalStatistics.score')]: this.user.statistics.total_score.toLocaleString() || undefined,
        [this.$t('numericalStatistics.rankedScore')]: this.user.statistics.ranked_score.toLocaleString() || undefined,
        [this.$t('numericalStatistics.playCount')]: this.user.statistics.play_count.toLocaleString() || undefined,
        [this.$t('numericalStatistics.playLength')]: humanizeDuration(this.user.statistics.play_time * 1000, { units: ['h', 'm', 's'], language: iso, fallbacks: ['en'], delimiter: ',<br>' }) || undefined,
        [this.$t('numericalStatistics.totalHits')]: this.user.statistics.total_hits.toLocaleString() || undefined,
        ...this.historicalBest ? {
          [this.$t('numericalStatistics.historicalBestRank')]: `#${this.historicalBest.best_global_rank}` || undefined,
          [this.$t('numericalStatistics.historicalBestAccuracy')]: (this.historicalBest.best_accuracy / 100).toLocaleString('en-GB', { style: 'percent', maximumFractionDigits: 3, minimumFractionDigits: 2 }) || undefined
        } : {}
      }
      for (const index in table) {
        const data = table[index]
        if (!data) { delete table[index] }
      }
      return table
    }
  }
}
</script>

<style lang="scss" scoped>
.ranks-chart {
  background-color: rgba(255, 255, 255, 0.6);
}
</style>
