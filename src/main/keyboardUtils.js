// import { getCurrentKeyboardLayout, getCurrentKeyboardLanguage, getCurrentKeymap } from 'keyboard-layout'

export const getKeyboardLanguage = () => {
  // const lang = getCurrentKeyboardLanguage()
  // if (lang.length >= 2) {
  //   //   return lang.substring(0, 2)
  //   // }

  return 'zh'
}

export const dumpKeyboardInformation = () => {
  console.log("layout:", `Layout: ${getCurrentKeyboardLayout()}\n` +
    `Language: ${getCurrentKeyboardLanguage()}\n\n` +
    JSON.stringify(getCurrentKeymap(), null, 2))
  return `Layout: ${getCurrentKeyboardLayout()}\n` +
    `Language: ${getCurrentKeyboardLanguage()}\n\n` +
    JSON.stringify(getCurrentKeymap(), null, 2)

}

export const getVirtualLetters = () => {
  // Full list of supported virtual keys:
  // https://github.com/parro-it/keyboardevent-from-electron-accelerator/blob/afdbd57bead1e139d7bd03c763778dce6ca8c35d/main.js#L104

  // const currentKeymap = getCurrentKeymap()
  // let vkeys = {}
  // for (const key in currentKeymap) {
  //   // TODO(fxha): Possibly, we can fix more broken accelerators without apply a manually fix later.
  //   if (!key.startsWith('Key')) {
  //     continue
  //   }
  //   const unmodifiedKey = currentKeymap[key].unmodified
  //   if (unmodifiedKey) {
  //     // uppercase character / vkey name (A: KeyA)
  //     vkeys[unmodifiedKey.toUpperCase()] = key
  //   }
  // }
  // return vkeys
  return {
    A: 'KeyA',
    B: 'KeyB',
    C: 'KeyC',
    D: 'KeyD',
    E: 'KeyE',
    F: 'KeyF',
    G: 'KeyG',
    H: 'KeyH',
    I: 'KeyI',
    J: 'KeyJ',
    K: 'KeyK',
    L: 'KeyL',
    M: 'KeyM',
    N: 'KeyN',
    O: 'KeyO',
    P: 'KeyP',
    Q: 'KeyQ',
    R: 'KeyR',
    S: 'KeyS',
    T: 'KeyT',
    U: 'KeyU',
    V: 'KeyV',
    W: 'KeyW',
    X: 'KeyX',
    Y: 'KeyY',
    Z: 'KeyZ',
  }
}
