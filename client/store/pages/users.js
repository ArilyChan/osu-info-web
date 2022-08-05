export const state = () => ({
  createdLayouts: []
})

export const mutations = {
  addLayout (state, layout) {
    state.createdLayouts.push(layout)
  },

  removeLayout (state, layout) {
    state.createdLayouts.splice(state.createdLayouts.findIndex(l => l === layout), 1)
  }
}
