'use strict'

import fs from 'fs'
import path from 'path'
import { BrowserWindow, app } from 'electron'
import windowStateKeeper from 'electron-window-state'

export const windows = new Map()

const createWindow = (pathname, options = {}) => {
  const TITLE_BAR_HEIGHT = 21
  const mainWindowState = windowStateKeeper({
    defaultWidth: 1200,
    defaultHeight: 800
  })

  const { x, y, width, height } = mainWindowState
  const winOpt = Object.assign({ x, y, width, height }, {
    webPreferences: {
      webSecurity: false
    },
    useContentSize: true,
    show: false,
    frame: process.platform === 'linux',
    titleBarStyle: 'hidden'
  }, options)
  let win = new BrowserWindow(winOpt)

  const winURL = process.env.NODE_ENV === 'development'
    ? `http://localhost:9080`
    : `file://${__dirname}/index.html`

  win.loadURL(winURL)
  win.setSheetOffset(TITLE_BAR_HEIGHT) // 21 is the title bar height
  win.once('ready-to-show', () => {
    win.show()

    if (pathname) {
      app.addRecentDocument(pathname)
      const filename = path.basename(pathname)
      fs.readFile(path.resolve(pathname), 'utf-8', (err, file) => {
        if (err) return console.log(err)
        win.webContents.send('AGANI::file-loaded', {
          file,
          filename,
          pathname
        })
      })
    }
  })

  win.on('focus', () => {
    win.webContents.send('AGANI::window-active-status', { status: true })
  })

  win.on('blur', () => {
    win.webContents.send('AGANI::window-active-status', { status: false })
  })

  win.on('close', event => { // before closed
    event.preventDefault()
    win.webContents.send('AGANI::ask-for-close')
  })

  windows.set(win.id, win)
  return win
}

export default createWindow
