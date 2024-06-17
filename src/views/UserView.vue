<template>
    <div class="user-view">
      <el-row>
        <el-col :span="7" class="user-info-col">
          <el-card class="user-card">
            <div class="user-info">
              <img :src="url + user.profilePicture" alt="Profile Picture" class="profile-picture" />
              <div class="user-details">
                <h2>{{ user.userName }}</h2>
                <p>{{ user.email }}</p>
                <p>{{ formatDate(user.createdAt) }}加入</p>
                <el-button type="danger" size="small" @click="followUser">
                {{ isFollow ? '取消关注' : '关注' }}
              </el-button>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="17">
          <div class="search-bar">
            <el-input placeholder="搜索" prefix-icon="el-icon-search" v-model="searchQuery"></el-input>
            <el-button type="primary" icon="el-icon-search" @click="searchBlogs">搜索</el-button>
          </div>
          <div class="blog-list-container">
            <BlogList ref="blogList" :userId="user.id" :searchQuery="searchQuery" :currentPage="currentPage"
              @pageChanged="handlePageChange" />
          </div>
        </el-col>
      </el-row>
    </div>
  </template>
  
  <script>
import BlogList from '../components/UserBlogList.vue';
import follow from '@/api/follow';
import userApi from '@/api/user'

export default {
  name: 'UserView',
  components: {
    BlogList
  },
  data() {
    return {
      searchQuery: '',
      currentPage: 1,
      url: this.$store.state.url,
      isFollow: false ,// 初始化为未关注状态,
      user: {}
    };
  },
  created() {
    this.checkFollowStatus();
    this.fetchUserData();
  },
  methods: {
    async fetchUserData(){
        const userId = this.$route.params.id;
      try {
        const response = await userApi.getUserProfile(userId);
        this.user = response.data.user;
      } catch (error) {
        console.error('Failed to get userData', error);
      }
    },
    async checkFollowStatus() {
      const userId = this.$route.params.id;
      try {
        const response = await follow.isFollowed(userId);
        console.log(response.data.isFollowed)
        this.isFollow = response.data.isFollowed;
      } catch (error) {
        console.error('Failed to check follow status:', error);
      }
    },
    searchBlogs() {
      this.currentPage = 1;
      this.$refs.blogList.fetchBlogs();
    },
    handlePageChange(page) {
      this.currentPage = page;
      this.$refs.blogList.fetchBlogs();
    },
    formatDate(date) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(date).toLocaleDateString(undefined, options);
    },
    async followUser() {
      const userId = this.user.id;
      try {
        if (!this.isFollow) {
          // 如果未关注，则执行关注操作
          await follow.addFollow(userId);
        } else {
          // 如果已关注，则执行取消关注操作
          await follow.removeFollow(userId);
        }
        // 切换关注状态
        this.checkFollowStatus();
      } catch (error) {
        console.error('Failed to follow or unfollow this user:', error);
      }
    }
  }
};
</script>
  
  <style scoped>
  .user-view {
    margin-top: 100px;
  }
  
  .user-info-col {
    display: flex;
    justify-content: center;
  }
  
  .user-card {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    text-align: left; /* Left align the text */
    padding: 20px;
    box-sizing: border-box;
    margin-left: 30px;
    margin-top: 50px;
  }
  
  .user-info {
    display: flex;
    align-items: center;
  }
  
  .profile-picture {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    margin-right: 20px;
  }
  
  .user-details {
    display: flex;
    flex-direction: column;
  }
  
  .user-details h2 {
    margin: 0;
    font-size: 24px;
  }
  
  .user-details p {
    margin: 5px 0;
  }
  
  .search-bar {
    display: flex;
    align-items: center;
    margin-top: 20px;
    margin-left: 200px;
  }
  
  .search-bar > * {
    margin-right: 10px;
  }
  
  .search-bar .el-input {
    flex: 1;
  }
  
  .search-bar .el-button {
    flex-shrink: 0;
    margin-right: 200px
  }
  
  .blog-list-container {
    overflow-y: auto;
    margin-top: 20px;
    max-height: calc(100vh - 200px); /* Adjust height based on your layout */
  }
  </style>
  