import Vue from 'vue'
import axios from 'axios'

import App from './app'
import store from './store'

import 'element-ui/lib/theme-chalk/index.css';
import './assets/symbolIcon'
import './index.css'
// import {
//   Dialog, Form, FormItem, InputNumber,
//   Button, Tooltip, Upload,
//   Cascader,
//   Icon,
//   Menu
// } from 'element-ui'
// In the renderer process:
// var webFrame = require('electron').webFrame
// var SpellCheckProvider = require('electron-spell-check-provider')

// webFrame.setSpellCheckProvider('en-US', true, new SpellCheckProvider('en-US').on('misspelling', function (suggestions) {
//   console.log(suggestions)
// }))

// Vue.use(Icon)
// Vue.use(Dialog)
// Vue.use(Form)
// Vue.use(FormItem)
// Vue.use(InputNumber)
// Vue.use(Button)
// Vue.use(Tooltip)
// Vue.use(Upload)
// Vue.use(Cascader)
import ElementUI from 'element-ui';

Vue.use(ElementUI);

// if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http                 = Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.prototype.$id        = (() => {
  let currentId = 0;
  const map     = new WeakMap();

  return (object) => {
    if (!map.has(object)) {
      map.set(object, ++currentId);
    }

    return map.get(object);
  };
})();

/* eslint-disable no-new */
new Vue({
  components: {App},
  store,
  template  : '<App/>',
}).$mount('#app')
