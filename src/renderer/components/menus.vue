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
  import configureMenu from '../../main/menus'
  import NavMenu from './menu_nav.vue'


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
        let xx = configureMenu({})
        // alert(xx)
        // console.log(xx)
        return xx
      },
    },
    mounted() {
      this.navMenus = this.initMenu()

    },
  }
</script>
