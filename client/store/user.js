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

  setUser (state, user) {
    state.data = user
  },

  setRecentActivity (state, activity) {
    state.recentActivity = activity
  }
}
