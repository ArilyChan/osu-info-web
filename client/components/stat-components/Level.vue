<template>
  <card shadow no-body>
    <apexchart style="width: 100%" type="radialBar" :options="levelRender" :series="[user.statistics.level.progress]" />
  </card>
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
  data () {
    return {
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
                formatter: () => `${this.user.statistics.level.current + this.user.statistics.level.progress / 100}`
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
        labels: [this.$t('level')]
      }
    }
  },
  computed: mapState({
    user: state => state.user.data
  }),
  created () {
    this.$store.commit('user/addLayout', 'LevelChart')
  }
}
</script>
