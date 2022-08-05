<template>
  <b-card no-body class="shadow border-0">
    <div v-if="variant === 'slim'">
      <apexchart
        v-if="rankGradeCounts.max && ready && ranks"
        :height="300"
        type="radialBar"
        :options="ranks"
        :series="rankGradeCounts.percentages"
      />
    </div>
    <div v-else>
      <b-progress v-if="rankGradeCounts.max" :max="100" class="no-container mb-0 rounded-0" height="2em">
        <template v-for="(label, index) in rankGradeCounts.labels">
          <b-progress-bar v-if="rankGradeCounts.percentages[index]" :key="`label-${label}`" :label="label.toUpperCase()" :variant="rankGradeCounts.variants[index]" :value="rankGradeCounts.percentages[index]" />
        </template>
      </b-progress>
      <div class="d-flex flex-wrap justify-content-around">
        <div v-if="rankGradeCounts.values[0]" class="d-flex align-items-end">
          <osu-assets
            asset="ranking-X-small"
          />
          <osu-assets
            asset="score-x"
            height="40px"
          />
          <osu-asset-string
            :string="rankGradeCounts.values[0].toString()"
            class="justify-content-center"
          />
          <osu-assets
            asset="score-comma"
            height="50%"
          />
        </div>
        <div v-if="rankGradeCounts.values[1]" class="d-flex align-items-end">
          <osu-assets
            asset="ranking-XH-small"
          />
          <osu-assets
            asset="score-x"
            height="40px"
          />
          <osu-asset-string
            :string="rankGradeCounts.values[1].toString()"
            class="justify-content-center"
          />
          <osu-assets
            asset="score-comma"
            height="50%"
          />
        </div>
        <div v-if="rankGradeCounts.values[2]" class="d-flex align-items-end">
          <osu-assets
            asset="ranking-S-small"
          />
          <osu-assets
            asset="score-x"
            height="40px"
          />
          <osu-asset-string
            :string="rankGradeCounts.values[2].toString()"
            class="justify-content-center"
          />
          <osu-assets
            asset="score-comma"
            height="50%"
          />
        </div>
        <div v-if="rankGradeCounts.values[3]" class="d-flex align-items-end">
          <osu-assets
            asset="ranking-SH-small"
          />
          <osu-assets
            asset="score-x"
            height="40px"
          />
          <osu-asset-string
            :string="rankGradeCounts.values[3].toString()"
            class="justify-content-center"
          />
          <osu-assets
            asset="score-comma"
            height="50%"
          />
        </div>
        <div v-if="rankGradeCounts.values[4]" class="d-flex align-items-end">
          <osu-assets
            asset="ranking-A-small"
          />
          <osu-assets
            asset="score-x"
            height="40px"
          />
          <osu-asset-string
            :string="rankGradeCounts.values[4].toString()"
            class="justify-content-center"
          />
        </div>
      </div>
    </div>
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
let apexchart
if (process.browser) {
  apexchart = require('vue-apexcharts')
}
export default {
  components: { 'kv-table': KVTable, apexchart },
  props: {
    // user: {
    //   type: Object,
    //   default: () => {}
    // },
    historicalBest: {
      type: [Object, null],
      default: () => {}
    },
    variant: {
      type: String,
      default: ''
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
        max,
        variants: ['warning', 'light', 'yellow', 'light', 'success']
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
    this.$store.commit('pages/users/addLayout', 'RankLevelChart')
  },
  methods: {
    kvStats () {
      const currentLocale = this.$i18n.locales.find(i => i.code === this.$i18n.locale)
      const iso = currentLocale.iso ? currentLocale.iso.split('-').join('_') : this.$i18n.locale
      const showPP = !this.$store.state.pages.users.createdLayouts.includes('RankHistoryChart')
      const table = {
        [this.$t('pp')]: (showPP && this.user.statistics.pp.toLocaleString()) || undefined,
        [this.$t('numericalStatistics.score')]: this.user.statistics.total_score.toLocaleString() || undefined,
        [this.$t('numericalStatistics.rankedScore')]: this.user.statistics.ranked_score.toLocaleString() || undefined,
        [this.$t('numericalStatistics.playCount')]: this.user.statistics.play_count.toLocaleString() || undefined,
        [this.$t('numericalStatistics.playLength')]: humanizeDuration(this.user.statistics.play_time * 1000, { units: ['h', 'm', 's'], language: iso, fallbacks: ['en'], delimiter: ',<br>' }) || undefined,
        [this.$t('numericalStatistics.totalHits')]: this.user.statistics.total_hits.toLocaleString() || undefined,
        ...this.historicalBest
          ? {
              [this.$t('numericalStatistics.historicalBestRank')]: `#${this.historicalBest.best_global_rank}` || undefined,
              [this.$t('numericalStatistics.historicalBestAccuracy')]: (this.historicalBest.best_accuracy / 100).toLocaleString('en-GB', { style: 'percent', maximumFractionDigits: 3, minimumFractionDigits: 2 }) || undefined
            }
          : {}
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
.progress.no-container {
  box-shadow: 0 0 0 0;
  background-color: initial;
  opacity: 0.5;
}
</style>
