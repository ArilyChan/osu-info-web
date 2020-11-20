<template>
  <card shadow no-body class="border-0">
    <apexchart height="300" type="radialBar" :options="ranks" :series="rankGradeCounts.percentages" />
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
</template>

<script>
const humanizeDuration = require('humanize-duration')
export default {
  props: {
    user: {
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
      return {
        总分: this.user.statistics.total_score.toLocaleString(),
        排名总分: this.user.statistics.ranked_score.toLocaleString(),
        游玩次数: this.user.statistics.play_count.toLocaleString(),
        游玩总时长: humanizeDuration(this.user.statistics.play_time * 1000, { units: ['h', 'm', 's'], language: 'zh_CN' }),
        tth: this.user.statistics.total_hits.toLocaleString()
      }
    }
  }
}
</script>
