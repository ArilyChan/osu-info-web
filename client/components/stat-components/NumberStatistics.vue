<template>
  <b-card no-body class="shadow border-0">
    <apexchart height="300" type="radialBar" :options="ranks" :series="rankGradeCounts.percentages" />
    <kv-table :kv-stats="kvStats()" />
    <b-card-footer class="py-1 text-right small rounded-bottom">
      {{ $t('numericalStatistics.disclaimer') }}
    </b-card-footer>
  </b-card>
</template>

<script>
import KVTable from './KVTable.vue'
const humanizeDuration = require('humanize-duration')
export default {
  components: { 'kv-table': KVTable },
  props: {
    user: {
      type: Object,
      default: () => {}
    },
    historicalBest: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      ranks: undefined
    }
  },
  computed: {
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
        offsetX: 0,
        offsetY: 0,
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
    kvStats () {
      const currentLocale = this.$i18n.locales.find(i => i.code === this.$i18n.locale)
      const iso = currentLocale.iso ? currentLocale.iso.split('-').join('_') : this.$i18n.locale
      return {
        [this.$t('numericalStatistics.score')]: this.user.statistics.total_score.toLocaleString() || undefined,
        [this.$t('numericalStatistics.rankedScore')]: this.user.statistics.ranked_score.toLocaleString() || undefined,
        [this.$t('numericalStatistics.playCount')]: this.user.statistics.play_count.toLocaleString() || undefined,
        [this.$t('numericalStatistics.playLength')]: humanizeDuration(this.user.statistics.play_time * 1000, { units: ['h', 'm', 's'], language: iso, fallbacks: ['en'], delimiter: ',<br>' }) || undefined,
        [this.$t('numericalStatistics.totalHits')]: this.user.statistics.total_hits.toLocaleString() || undefined,
        [this.$t('numericalStatistics.historicalBestRank')]: `#${this.historicalBest.best_global_rank}` || undefined,
        [this.$t('numericalStatistics.historicalBestAccuracy')]: (this.historicalBest.best_accuracy / 100).toLocaleString('en-GB', { style: 'percent', maximumFractionDigits: 3, minimumFractionDigits: 2 }) || undefined
      }
    }
  }
}
</script>
