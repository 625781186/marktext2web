<template>
  <div class="navMenu">

    <template v-for="(navMenu,index) in navMenus">
      <!-- 最后一级菜单 -->
      <el-divider v-if="navMenu.label===''"></el-divider>

      <el-menu-item v-else-if="!navMenu.submenu.length"
                    :key="navMenu.id"
                    :data="navMenu"
                    :index="Math.random().toString()"
                    @click.native="navMenu.hasOwnProperty('click')?click(navMenu):''"
      >
        <!--        <i :class="navMenu.entity.icon"></i>-->

        <span slot="title">{{navMenu.label}}</span>
      </el-menu-item>

      <!-- 此菜单下还有子菜单 -->
      <el-submenu v-else
                  :key="navMenu.id"
                  :data="navMenu"
                  :index="Math.random().toString()"

      >
        <template slot="title">
          <!--          <i :class="navMenu.entity.icon"></i>-->
          <span> {{navMenu.label}}</span>
        </template>

        <!-- 递归 -->
        <NavMenu :navMenus="navMenu.submenu"></NavMenu>

      </el-submenu>

    </template>

  </div>
</template>

<script>
  import {BrowserWindow} from "../../main/electron";

  export default {
    name : 'NavMenu',
    props: ['navMenus'],
    methods: {
      click(navMenu){
        // console.log("window:",BrowserWindow.win.webContents)
        navMenu.click(navMenu,BrowserWindow)
      }
    },
  }
</script>

<style>
  /* 水平样式 */
  .el-menu--horizontal > div > .el-submenu {
    float: left;
    /*max-height: 36px;*/
  }

  /* 一级菜单的样式 */
  .el-menu--horizontal > div > .el-menu-item {
    float: left;
    height: 30px;
    line-height: 30px;
    margin: 0;
    border-bottom: 2px solid transparent;
    color: #909399;
  }

 /*.el-submenu__title{*/
 /*   height: 20px;*/
 /*   line-height: 20px;*/
 /* }*/

</style>
