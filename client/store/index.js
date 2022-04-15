export const state = () => ({
  server: 'bancho'
})

export const mutations = {
  setServer (state, server) {
    state.server = server
  }
}
