<template>
  <el-container v-loading="loading">
    <el-header>
      <!-- 图标区域 -->
      <div class="logo-box">
        <span class="logo-text">WMS全球仓库管理系统</span>
      </div>
      <!-- 用户菜单 -->
      <div class="hor-menu-container">
        <el-menu mode="horizontal" router>
          <el-submenu index="1">
            <template slot="title">
              <el-avatar>User</el-avatar>
              <label class="usr-tag hidden-sm-and-down">{{
                userInfo.lastname
              }}</label>
            </template>
            <el-menu-item index="">
              <i class="el-icon-user-solid"></i>
              <span slot="title">超级管理员</span>
            </el-menu-item>
            <el-menu-item index="account">
              <i class="el-icon-s-tools"></i>
              <span slot="title">账号设置</span>
            </el-menu-item>
            <el-menu-item index="" @click="logout">
              <i class="fa fa-sign-out" aria-hidden="true"></i>
              <span slot="title">退出</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </div>
    </el-header>
    <el-container class="maincontainer" v-if="asideTitle.length">
      <!-- 侧边栏 -->
      <el-aside width="auto">
        <el-menu
          :default-active="menuactive"
          class="aside-menu"
          text-color="#fff"
          background-color="#20274D"
          active-text-color="#fff"
          router
        >
          <el-menu-item
            v-for="menu in asideTitle"
            :key="menu.path"
            :index="menu.path"
          >
            <i class="icon iconfont" :class="menu.icon" aria-hidden="true"></i>
            <span>{{ menu.title }}</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main class="mainview">
        <breadcrumb />
        <!-- 次级路由视图 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import userService from '../services/userService'
import breadcrumb from '../components/breadcrumb.vue'
import { mapGetters } from 'vuex'
import { AsideTitles } from '../util/AsideTitle'
export default {
  components: {
    breadcrumb
  },
  data() {
    return {
      loading: true,
      menuactive: '/dashboard',
      userrole: '',
      asideTitle: []
    }
  },
  created() {
    this.getUserInfo()
  },
  computed: {
    ...mapGetters({
      userInfo: 'getUserInfo'
    })
  },
  methods: {
    logout() {
      window.localStorage.clear()
      this.$router.push('/login')
    },
    getUserInfo() {
      userService
        .getUserInfo()
        .then(res => {
          this.userrole = res.role
          if (this.userrole === 'SELLER') {
            // 卖家端
            this.asideTitle = AsideTitles.filter(aside => !aside.onlyStorage)
          } else {
            this.asideTitle = AsideTitles.filter(aside => !aside.onlySeller)
          }
          this.$store.commit('setRole', res.role)
          this.$store.commit('setUserInfo', res)
        })
        .catch(err => {
          this.$message.error(err.message)
        })
        .then(res => {
          this.loading = false
        })
    }
  },

  watch: {
    $route: {
      handler(to) {
        if (to.matched.length > 2) {
          this.menuactive = to.matched[1].path
        } else {
          this.menuactive = to.path
        }
      },
      immediate: true
    }
  }
}
</script>

<style lang="less" scoped>
.el-container.is-vertical {
  height: 100%;
  background: #ebebeb;
}

.el-header {
  background: #262f61;
  display: flex;
  height: 50px !important;
  align-items: center;
  padding: 0;
}
.maincontainer {
  height: calc(100% - 65px);
}

.el-aside {
  background: #20274d;
}

.logo-box {
  width: 200px;
  display: flex;
  justify-content: center;
}

.logo-text {
  color: #e6e6e6;
  font-size: 25px;
  font-family: 'sans-serif';
  font-size: 16px;
  font-family: FZZhengHeiS-M-GB;
  font-weight: 400;
  color: #ffffff;
  line-height: 21px;
}

.aside-menu {
  height: 100%;
  width: 200px;
  /deep/ .el-menu-item {
    font-size: 16px;
    font-family: Microsoft YaHei;
  }

  /deep/ .el-menu-item.is-active {
    background-color: #66b1ff !important;
  }
  /deep/.el-menu-item [class^='el-icon-'] {
    margin-right: 20px;
    font-size: 21px;
  }
  /deep/.icon {
    margin-right: 20px;
    font-size: 16px;
  }
}

.hor-menu-container {
  height: 100%;
  display: flex;
  flex-grow: 1;
  background-color: #fff;
  border-bottom: 1px solid #e6e6e6;

  /deep/ .el-menu--horizontal {
    position: absolute;
    right: 0;
    height: 50px;

    > .el-submenu.is-active .el-submenu__title {
      border-bottom: none;
      height: inherit;
      .el-avatar {
        width: 30px;
        height: 30px;
        line-height: 30px;
        font-size: 12px;
      }
    }

    > .el-submenu .el-submenu__title {
      height: inherit;
    }
  }

  .usr-tag {
    padding-left: 10px;
    color: gray;
  }
}

.mainview {
  margin: 0px;
  padding: 0px;
  // background: #ffffff;
  border-radius: 0px;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>
