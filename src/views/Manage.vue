<template>
    <el-container style="height: 100vh">
  <el-header class="page-header"><HeadMenu /></el-header>
  <el-container class="main-content">
    <el-aside width="200px" class="page-aside"><AsideMenu /></el-aside>
    <el-main><router-view></router-view></el-main>
  </el-container>
</el-container>
</template>
<script>
import HeadMenu from '../components/HeadMenu.vue';
import AsideMenu from '../components/AsideMenu.vue';
export default{
    name: 'Management',
    components:{
        HeadMenu,
        AsideMenu
    }
}
</script>
<style scoped>
.page-header{
    padding: 0;
}
.main-content{
    margin-top: 30px;
}
.page-aside{
    background-color:#545c64
}
</style>