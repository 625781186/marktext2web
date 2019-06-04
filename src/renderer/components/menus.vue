<template>
  <div>
    <div class="line"></div>
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b">
      <NavMenu :navMenus="navMenus"></NavMenu>


    </el-menu>
  </div>
</template>
<script>
  import {Menu} from '@/../main/electron';
  import configureMenu from '../../main/menus/index.js'
  import NavMenu from './menu_nav.vue'

  console.log("先执行 import ,再执行这里... start menu")
  //init menus


  export default {
    components: {NavMenu},
    data      : () => {
      return {
        navMenus   : [],
        menus      : [],
        activeIndex: '1',


      };

    },
    methods   : {
      handleSelect(key, keyPath) {
        // console.log(key);
      },
      initMenu() {
        console.log("init vue menu")
        let all_menu       = configureMenu({})
        const items        = Menu.buildFromTemplate(all_menu)
        Menu.items         = items
        Menu.submenu       = items;
        // Menu.submenu.items = Menu.submenu;
        console.log("1:",Menu)
        console.log("2:",Menu.items)
        console.log("3:",Menu.submenu)
        console.log("4:",Menu.submenu.items)
        return items
      },
    },
    create() {
      this.navMenus = this.initMenu()

    },
  }
</script>
