<template>
  <div class="navMenu">

    <template v-for="(navMenu,index) in navMenus">
      <!-- 最后一级菜单 -->
      <el-menu-item v-if="!navMenu.submenu"
                    :key="navMenu.id"
                    :data="navMenu"
                    :index="Math.random().toString()"
                    @click.native="navMenu.hasOwnProperty('click')?navMenu.click():''"
      >
        <!--        <i :class="navMenu.entity.icon"></i>-->

        <span slot="title">{{navMenu.label}}</span>
      </el-menu-item>

      <!-- 此菜单下还有子菜单 -->
      <el-submenu v-if="navMenu.submenu"
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
  export default {
    name : 'NavMenu',
    props: ['navMenus'],

    methods: {},
  }
</script>

<style>
  /* 水平样式 */
  .el-menu--horizontal > div > .el-submenu {
    float: left;
  }

  /* 一级菜单的样式 */
  .el-menu--horizontal > div > .el-menu-item {
    float: left;
    height: 60px;
    line-height: 60px;
    margin: 0;
    border-bottom: 2px solid transparent;
    color: #909399;
  }
</style>
