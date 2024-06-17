<template>
  <el-row>
    <el-col>
      <el-menu
        default-active="home"
        class="el-menu-vertical-demo"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b"
      >
        <el-menu-item index="home"  @click="handleItemClick1" class="home">
          <i class="el-icon-house"></i>
          <span slot="title">主页</span>
        </el-menu-item>
        <el-menu-item index="user-management"  @click="handleItemClick2">
          <i class="el-icon-user"></i>
          <span slot="title">用户管理</span>
        </el-menu-item>
        <el-menu-item index="blog-management"  @click="handleItemClick3">
          <i class="el-icon-notebook-1"></i>
          <span slot="title">博客管理</span>
        </el-menu-item>
        <el-menu-item index="comment-management"  @click="handleItemClick4">
          <i class="el-icon-chat-dot-square"></i>
          <span slot="title">评论管理</span>
        </el-menu-item>
      </el-menu>
    </el-col>
  </el-row>
</template>

<script>
export default {
  methods: {
    handleItemClick1(){
      this.$router.push('/manage/main')
    },
    handleItemClick2(){
      this.$router.push('/manage/user')
    },
    handleItemClick3(){
      this.$router.push('/manage/blog')
    },
    handleItemClick4(){
      this.$router.push('/manage/comment')
    },
  }
}
</script>
<style scoped>
.home{
  margin-top: 20px;
}
</style>
