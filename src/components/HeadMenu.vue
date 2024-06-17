<template>
  <el-menu
    :default-active="activeIndex"
    class="el-menu-demo"
    mode="horizontal"
    @select="handleSelect"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b">
    
    <!-- 左边显示星守博客标题 -->
    <el-menu-item index="home" class="title" style="border:none;" @click="goHome">
      星守博客
    </el-menu-item>

    <!-- 右边显示登录/注册或用户头像 -->
    <div style="margin-left: auto; display: flex; align-items: center;">
      <template v-if="!isLoggedIn">
        <el-menu-item index="login" @click="login" class="login">登录</el-menu-item>
        <el-menu-item index="register" @click="register" class="register">注册</el-menu-item>
      </template>
      <template v-else>
        <el-dropdown style="margin-right:100px">
          <span class="el-dropdown-link">
            <el-avatar :src="this.$store.state.url + user.avatar"></el-avatar>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="goToFollow">我的关注</el-dropdown-item>
            <el-dropdown-item @click.native="goToChat">消息列表</el-dropdown-item>
            <el-dropdown-item @click.native="goToCollect">我的收藏</el-dropdown-item>
            <el-dropdown-item @click.native="goToBlog">我的博客</el-dropdown-item>
            <el-dropdown-item @click.native="goToProfile">个人中心</el-dropdown-item>
            <el-dropdown-item v-if="isAdmin" @click.native="goToManage">后台管理</el-dropdown-item>
            <el-dropdown-item @click.native="handleLogout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </template>
    </div>
  </el-menu>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  data() {
    return {
      activeIndex: 'home'
    };
  },
  computed: {
    ...mapState({
      isLoggedIn: state => state.isLoggedIn,
      user: state => state.user,
      isAdmin: state => state.user.role === 'admin'  // 假设角色信息存储在 user 对象中的 role 字段里
    })
  },
  mounted() {
    // 打印 user 数据到控制台
    console.log('User data:', this.user);
  },
  methods: {
    ...mapActions(['logout']),
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
    login() {
      this.$router.push('/login');
    },
    register() {
      this.$router.push('/register');
    },
    goToProfile() {
      this.$router.push('/userProfile');
    },
    goToFollow() {
      this.$router.push('/followList');
    },
    goToChat() {
      this.$router.push('/chats');
    },
    goToBlog() {
      this.$router.push('/myBlog/' + this.$store.state.user.id);
    },
    goToCollect() {
      this.$router.push('/collect');
    },
    goToManage() {
      this.$router.push('/manage');
    },
    goHome() {
      if (this.$route.path !== '/home') {
        this.$router.push('/home');
      }
    },
    handleLogout() {
  // 清除 localStorage 中的所有数据
  localStorage.clear();
  // 调用 Vuex 的 logout action
  this.logout();
  // 确保退出后跳转到登录页面
  this.$router.push('/login');
  // 显示成功消息
  this.$message.success('已退出登录');
}

  }
};
</script>

<style scoped>
.el-menu-demo {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80px;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000;
  margin-left: 0;
}

.title {
  padding-left: 100px;
  font-size: 20px;
}

.el-avatar {
  cursor: pointer;
}

.login {
  font-size: 20px;
}

.register {
  padding-right: 100px;
  font-size: 20px;
}
</style>
