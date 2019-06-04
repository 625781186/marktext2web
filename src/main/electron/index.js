import e_bus from "./electron_bus"
import {mix} from "../utils/index"

class _Win {
  constructor() {
    this.webContents = e_bus
  }

}

class _BrowserWindow {
  constructor() {
    this._win        = new _Win()
    this.webContents = e_bus
  }

  fromWebContents(e_sender = null) {
    return this._win
  }

  get win() {
    return this._win
  }

  set win(value) {
    this._win = value

  }


}

class _App {
  clearRecentDocuments() {
    return null
  }
}

const BrowserWindow = new _BrowserWindow();
const shell         = "";
const app           = new _App();
const dialog        = "";
const ipcMain       = e_bus;
const ipcRenderer   = e_bus;
const remote        = "";
const screen        = "";
const clipboard        = "";
const systemPreferences        = "";
const crashReporter        = "";


//<editor-fold desc="menus">
class BaseItem {
  constructor() {

    this.label         = '';
    this.submenu       = [];
    this.submenu.items = [];
    this.type          = '';
    this.role          = null;
    this.accelerator   = null;
    this.icon          = null;
    this.sublabel      = '';
    this.enabled       = true;
    this.visible       = true;
    this.checked       = false;
    // this.commandId = 66
    this.click         = null;
    // this.menu = [Circular]
    this.items         = []
  }

}

//1.
class MenuItem extends BaseItem {
  constructor() {
    super();
    this.submenu       = new MenuArray();
    this.submenu.items = new MenuArray();
  }

}

//2.
class MenuArray extends mix(BaseItem, Array) {
  constructor() {
    super();

  }

  set_submenu() {
    this.submenu       = new MenuArray()
    this.submenu.items = this.submenu
  }
}

class Menu extends MenuArray {

  static initMenuProp() {
    Menu.label         = '';
    Menu.submenu       = new MenuArray();
    Menu.submenu.items = new MenuArray();
    Menu.type          = '';
    Menu.role          = null;
    Menu.accelerator   = null;
    Menu.icon          = null;
    Menu.sublabel      = '';
    Menu.enabled       = true;
    Menu.visible       = true;
    Menu.checked       = false;
    // Menu.commandId = 66
    Menu.click         = null;
    // Menu.menu = [Circular]
    Menu.items         = []
  }

  static getApplicationMenu() {
    return Menu
  }

  static setApplicationMenu(menu = null) {
    return null
  }


  static buildFromTemplate(menu) {
    //init menu ; menu = [{label:'editsubmenu:[{...},{...}]},
    //                   {label:'file,...}]

    const items = new MenuArray();
    items.set_submenu()

    menu.forEach((dict, index) => {
      // menu_dict = {label:'edit,submenu:[{...},{...}]}
      const new_menu = new MenuItem();
      const old_menu = dict;
      //<editor-fold desc="单个菜单的键 循环">
      for (let key of Object.keys(old_menu)) {
        if (key !== 'submenu') {
          new_menu[key] = old_menu[key];
        }
        else {
          // prop === 'submenu' ;res = {...,submenu:[..],}

          let res = Menu.buildFromTemplate(old_menu[key])

          new_menu[key] = res;

          // Object.defineProperty(new_menu[key], 'items', {value: res.items, writable: true})

          // res.submenu.items = res.items:[]
        }
      }
      //</editor-fold>
      new_menu['submenu'].items =  new_menu['submenu']
      new_menu.items = new_menu['submenu']
      items.push(new_menu)

    })

    return items
    // Menu.items = items
  }

}

Menu.initMenuProp()
//</editor-fold>

export {
  ipcMain,
  ipcRenderer,
  Menu,
  BrowserWindow,
  shell,
  app,
  dialog,
  remote,
  screen,

  clipboard,
  systemPreferences,
  crashReporter,

}

