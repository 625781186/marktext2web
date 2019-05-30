<template>
  <div class="navMenu">

    <template v-for="navMenu in navMenus">
      <!-- 最后一级菜单 -->
      <el-menu-item v-if="!navMenu.childs&&navMenu.entity"
                    :key="navMenu.entity.id"
                    :data="navMenu"
                    :index="navMenu.entity.name"
      >
        <i :class="navMenu.entity.icon"></i>
        <span slot="title">{{navMenu.entity.alias}}</span>
      </el-menu-item>

      <!-- 此菜单下还有子菜单 -->
      <el-submenu v-if="navMenu.childs&&navMenu.entity"
                  :key="navMenu.entity.id" :data="navMenu" :index="navMenu.entity.name">
        <template slot="title">
          <i :class="navMenu.entity.icon"></i>
          <span> {{navMenu.entity.alias}}</span>
        </template>
        <!-- 递归 -->
        <NavMenu :navMenus="navMenu.childs"></NavMenu>
      </el-submenu>
    </template>

  </div>
</template>

<script>
  export default {
    name   : 'NavMenu',
    props  : ['navMenus'],
    data() {
      return {}
    },
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
