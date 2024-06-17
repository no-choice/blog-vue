<template>
  <div class="main-blog">
    <el-row>
      <el-col :span="8" :offset="8">
        <div class="search-bar">
          <el-input placeholder="搜索" prefix-icon="el-icon-search" v-model="searchQuery"></el-input>
          <el-button type="primary" icon="el-icon-search" @click="searchBlogs">搜索</el-button>
        </div>
      </el-col>
    </el-row>
    <div class="blog-list-container">
      <BlogList ref="blogList" :searchQuery="searchQuery" :currentPage="currentPage" @pageChanged="handlePageChange" />
    </div>
  </div>
</template>

<script>
import BlogList from '../components/BlogList.vue';

export default {
  name: 'MainBlog',
  components: {
    BlogList
  },
  data() {
    return {
      searchQuery: '',
      currentPage: 1
    };
  },
  methods: {
    searchBlogs() {
      this.currentPage = 1;
      this.$refs.blogList.fetchBlogs();
    },
    handlePageChange(page) {
      this.currentPage = page;
      this.$refs.blogList.fetchBlogs();
    }
  }
};
</script>

<style scoped>
.main-blog {
  margin-top: 100px;
}

.search-bar {
  display: flex;
  align-items: center;
  margin-top: 20px;
}

.search-bar > * {
  margin-right: 10px;
}

.blog-list-container {
  overflow-y: auto;
  margin-top: 20px;
  max-height: calc(100vh - 200px); /* Optional: adjust height based on your layout */
}
</style>
