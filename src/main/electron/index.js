import e_bus from "./electron_bus"

class _Win{
  constructor(){
    this.webContents = window.e_bus
  }

}
class _BrowserWindow{
  constructor(){
    this.win = new _Win()
  }
  fromWebContents(e_sender=null){
    return this.win
  }
}


const BrowserWindow = new _BrowserWindow();
const shell         = "";
const app           = "";
const dialog        = "";
const ipcMain       = e_bus;
const ipcRenderer   = e_bus;
const remote        = "";

class Menu {
  //
  // // Docs: http://electron.atom.io/docs/api/menu
  //
  // /**
  //  * Emitted when a popup is closed either manually or with menu.closePopup().
  //  */
  // on(event: 'menu-will-close', listener: (event: Event) => void): this;
  // once(event: 'menu-will-close', listener: (event: Event) => void): this;
  // addListener(event: 'menu-will-close', listener: (event: Event) => void): this;
  // removeListener(event: 'menu-will-close', listener: (event: Event) => void): this;
  // /**
  //  * Emitted when menu.popup() is called.
  //  */
  // on(event: 'menu-will-show', listener: (event: Event) => void): this;
  // once(event: 'menu-will-show', listener: (event: Event) => void): this;
  // addListener(event: 'menu-will-show', listener: (event: Event) => void): this;
  // removeListener(event: 'menu-will-show', listener: (event: Event) => void): this;
  // constructor();
  // /**
  //  * Generally, the template is just an array of options for constructing a MenuItem.
  //  * The usage can be referenced above. You can also attach other fields to the
  //  * element of the template and they will become properties of the constructed menu
  //  * items.
  //  */
  // static buildFromTemplate(template: MenuItemConstructorOptions[]): Menu;
  // /**
  //  * Note: The returned Menu instance doesn't support dynamic addition or removal of
  //  * menu items. Instance properties can still be dynamically modified.
  //  */
  // static getApplicationMenu(): Menu | null;
  // /**
  //  * Sends the action to the first responder of application. This is used for
  //  * emulating default macOS menu behaviors. Usually you would just use the role
  //  * property of a MenuItem. See the macOS Cocoa Event Handling Guide for more
  //  * information on macOS' native actions.
  //  */
  // static sendActionToFirstResponder(action: string): void;
  // /**
  //  * Sets menu as the application menu on macOS. On Windows and Linux, the menu will
  //  * be set as each window's top menu. Passing null will remove the menu bar on
  //  * Windows and Linux but has no effect on macOS. Note: This API has to be called
  //  * after the ready event of app module.
  //  */
  // static setApplicationMenu(menu: Menu | null): void;
  // /**
  //  * Appends the menuItem to the menu.
  //  */
  // append(menuItem: MenuItem): void;
  // /**
  //  * Closes the context menu in the browserWindow.
  //  */
  // closePopup(browserWindow?: BrowserWindow): void;
  // getMenuItemById(id: string): MenuItem;
  // /**
  //  * Inserts the menuItem to the pos position of the menu.
  //  */
  // insert(pos: number, menuItem: MenuItem): void;
  // /**
  //  * Pops up this menu as a context menu in the BrowserWindow.
  //  */
  // popup(options: PopupOptions): void;
  // items: MenuItem[];
}

class MenuItem {

  // Docs: http://electron.atom.io/docs/api/menu-item
  //
  // constructor(options: MenuItemConstructorOptions);
  // checked: boolean;
  // click: Function;
  // enabled: boolean;
  // label: string;
  // visible: boolean;
}

export {
  ipcMain,
  Menu,
  BrowserWindow,
  shell,
  app,
  dialog,
  remote,
  ipcRenderer,

}
