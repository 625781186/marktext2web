import { ipcRenderer } from '@/../main/electron'
import bus from '../bus'

const state = {}

const getters = {}

const mutations = {}

const actions = {
  LISTEN_FOR_TWEET () {
    ipcRenderer.on('AGANI::tweet', (e, type) => {
      if (type === 'twitter') {
        bus.$emit('tweetDialog')
      }
    })
  }
}

export default { state, getters, mutations, actions }
