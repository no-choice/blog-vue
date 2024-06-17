<template>
    <el-row>
      <el-col>
        <div class="blog-list">
          <BlogProfile v-for="blog in blogs" :key="blog.id" :blog="blog" />
          <el-pagination
            background
            layout="prev, pager, next"
            :total="totalBlogs"
            :page-size="pageSize"
            :current-page="currentPage"
            @current-change="handlePageChange"
          />
        </div>
      </el-col>
    </el-row>
  </template>
  
  <script>
  import BlogProfile from './BlogProfile.vue';
  import blogApi from '../api/blog.js'; // 确保路径正确
  
  export default {
    name: 'BlogList',
    components: {
      BlogProfile
    },
    props: {
      searchQuery: {
        type: String,
        default: ''
      },
      currentPage: {
        type: Number,
        default: 1
      }
    },
    data() {
      return {
        blogs: [],
        totalBlogs: 0,
        pageSize: 3 // 每页显示3个博客
      };
    },
    watch: {
      currentPage: 'fetchBlogs',
      searchQuery: 'fetchBlogs'
    },
    methods: {
      async fetchBlogs() {
        const userId = this.$route.params.id;
        console.log(userId);
        try {
          const response = await blogApi.getBlogsById(userId, {
            page: this.currentPage,
            pageSize: this.pageSize,
            search: this.searchQuery
          });
          console.log(response.data)
          this.blogs = response.data.blogs;
          this.totalBlogs = response.data.total;
        } catch (error) {
          console.error('Failed to fetch blogs:', error);
        }
      },
      handlePageChange(page) {
        this.$emit('pageChanged', page);
      }
    },
    created() {
      this.fetchBlogs();
    }
  };
  </script>
  
  <style scoped>
  .blog-list {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }
  
  .blog-list > * {
    width: auto;
    display: flex;
    justify-content: center; /* 居中对齐 */
  }
  </style>
  