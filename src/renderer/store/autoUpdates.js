import { ipcRenderer } from '@/../main/electron'
import notice from '../services/notification'

const state = {}

const getters = {}

const mutations = {}

// AGANI::UPDATE_DOWNLOADED
const actions = {
  LISTEN_FOR_UPDATE ({ commit }) {
    ipcRenderer.on('AGANI::UPDATE_ERROR', (e, message) => {
      notice.notify({
        title: 'Update',
        type: 'error',
        time: 10000,
        message
      })
    })
    ipcRenderer.on('AGANI::UPDATE_NOT_AVAILABLE', (e, message) => {
      notice.notify({
        title: 'Update not Available',
        type: 'warning',
        message
      })
    })
    ipcRenderer.on('AGANI::UPDATE_DOWNLOADED', (e, message) => {
      notice.notify({
        title: 'Update Downloaded',
        type: 'info',
        message
      })
    })
    ipcRenderer.on('AGANI::UPDATE_AVAILABLE', (e, message) => {
      notice.notify({
        title: 'Update Available',
        type: 'primary',
        message,
        showConfirm: true
      })
        .then(() => {
          const needUpdate = true
          ipcRenderer.send('AGANI::NEED_UPDATE', { needUpdate })
        })
        .catch(() => {
          const needUpdate = false
          ipcRenderer.send('AGANI::NEED_UPDATE', { needUpdate })
        })
    })
  }
}

export default { state, getters, mutations, actions }
