<template>
  <div class="home">
    <el-row>
  <el-col :span="24"><HeadMenu /></el-col>
</el-row>
<router-view></router-view>
  </div>
</template>

<script>
// @ is an alias to /src
import HeadMenu from '@/components/HeadMenu.vue';
export default {
  name: 'HomeView',
  components: {
    HeadMenu
  }
}
</script>
<style>
  .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
    min-height: 0px;
  }
  .el-col {
    border-radius: 4px;
  }
 </style>