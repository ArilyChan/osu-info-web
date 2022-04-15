export const state = () => ({
  mode: 'osu',
  createdLayouts: [],
  data: {},
  recentActivity: []
})

export const mutations = {
  setMode (state, mode) {
    state.mode = mode
  },

  addLayout (state, layout) {
    state.createdLayouts.push(layout)
  },

  removeLayout (state, layout) {
    state.createdLayouts.splice(state.createdLayouts.findIndex(l => l === layout), 1)
  },

  setUser (state, user) {
    state.data = user
  },

  setRecentActivity (state, activity) {
    state.recentActivity = activity
  }
}
