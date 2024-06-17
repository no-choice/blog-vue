<template>
  <el-row>
    <el-col :span="16" :offset="4">
      <div class="blog-detail">
        <el-card>
          <div class="blog-header">
            <h1>{{ blog.title }}</h1>
            <p>
              <span class="author-info">
                <i class="el-icon-user-solid"></i>
                <router-link :to="{ name: 'UserView', params: { id: user.id }}" class="author-link">
                  {{ user.userName }}
                </router-link>
              </span>
              <span class="date-info">
                <i class="el-icon-time"></i> 发布于{{ formatDate(blog.createdAt) }}
              </span>
            </p>
            <el-button type="text" icon="el-icon-edit" v-if="isAuthor" @click="showEditBlogDialog(blog)">编辑</el-button>
          </div>
          <el-divider></el-divider>
          <div class="blog-content" v-html="blog.content"></div>
          <div class="blog-actions">
            <el-button type="text" @click="toggleLike">
              <i :class="liked ? 'fas fa-thumbs-up' : 'far fa-thumbs-up'"></i> 喜欢{{ blog.favourCnt + tempLikes }}
            </el-button>
            <el-button type="text" @click="toggleDislike">
              <i :class="disliked ? 'fas fa-thumbs-down' : 'far fa-thumbs-down'"></i> 不喜欢{{ blog.noFavourCnt +
              tempDislikes }}
            </el-button>
            <el-button type="text" @click="toggleFavorite">
              <i :class="isFavorited ? 'fas fa-star' : 'far fa-star'"></i> 收藏 {{ blog.collection + tempFavorites }}
            </el-button>
          </div>
        </el-card>
        <el-card class="comments-section">
          <CommentList :comments="comments" />
          <Comment @submitComment="addComment" />
        </el-card>
      </div>
      <EditBlogForm :visible.sync="editBlogDialogVisible" :blogData="selectedBlog || {}" @edit-blog="editBlog" />
    </el-col>
  </el-row>
</template>

<script>
import Comment from './Comment.vue';
import CommentList from './CommentList.vue';
import EditBlogForm from './blog/EditBlogForm.vue'; 
import blogApi from '../api/blogDetail.js';

export default {
  name: 'BlogDetail',
  components: {
    Comment,
    CommentList,
    EditBlogForm 
  },
  data() {
    return {
      blog: {},
      comments: [],
      user: {},
      liked: false,
      disliked: false,
      isFavorited: false,
      isAuthor: false,
      tempLikes: 0,
      tempDislikes: 0,
      tempFavorites: 0,
      editBlogDialogVisible: false, 
      selectedBlog: null 
    };
  },
  created() {
    this.fetchStatus();
    this.fetchBlogData();
    window.addEventListener('beforeunload', this.syncChangesWithServer);
  },
  beforeDestroy() {
    window.removeEventListener('beforeunload', this.syncChangesWithServer);
  },
  beforeRouteLeave (to, from, next) {
    this.syncChangesWithServer().then(() => {
      next();
    }).catch(error => {
      console.error('Failed to sync changes with server:', error);
      next();
    });
  },
  methods: {
    async fetchStatus(){
      const blogId = this.$route.params.id;
      try{
        //获取收藏，点赞，点踩状态
        const response = await blogApi.isCollected(blogId);
        this.isFavorited = response.data.isCollected;
        const response1 = await blogApi.isLiked(blogId);
        this.liked = response1.data.isLiked;
        const response2 = await blogApi.isDisLiked(blogId);
        this.disliked = response2.data.isDisLiked;
      } catch (error) {
        console.error('Failed to fetch blog status:', error);
      }
    },
    async fetchBlogData() {
      const blogId = this.$route.params.id;
      try {
        const response = await blogApi.getBlog(blogId);
        this.blog = response.data.blog;
        this.user = response.data.user;
        this.isAuthor = response.data.blog.userId === this.$store.state.user.id;

        const commentsResponse = await blogApi.getComments(blogId);
        this.comments = commentsResponse.data.comments;
      } catch (error) {
        console.error('Failed to fetch blog data:', error);
      }
    },
    async addComment(newComment) {
      const blogId = this.$route.params.id;
      newComment.created_at = new Date().toISOString();
      newComment.blogId = this.blog.id;
      newComment.userId = this.$store.state.user.id;
      try {
        this.comments.push(newComment);
        await blogApi.addComment(blogId, newComment);
        this.fetchBlogData();
      } catch (error) {
        console.error('Failed to add comment:', error);
      }
    },
    formatDate(date) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(date).toLocaleDateString(undefined, options);
    },
    toggleLike() {
      if (this.liked) {
        this.tempLikes -= 1;
      } else {
        this.tempLikes += 1;
        if (this.disliked) {
          this.tempDislikes -= 1;
          this.disliked = false;
        }
      }
      this.liked = !this.liked;
    },
    toggleDislike() {
      if (this.disliked) {
        this.tempDislikes -= 1;
      } else {
        this.tempDislikes += 1;
        if (this.liked) {
          this.tempLikes -= 1;
          this.liked = false;
        }
      }
      this.disliked = !this.disliked;
    },
    toggleFavorite() {
      if (this.isFavorited) {
        this.tempFavorites -= 1;
      } else {
        this.tempFavorites += 1;
      }
      this.isFavorited = !this.isFavorited;
    },
    async syncChangesWithServer() {
      const blogId = this.$route.params.id;
      try {
        if (this.tempLikes > 0) {
          await blogApi.likeBlog(blogId);
        } else if (this.tempLikes < 0) {
          await blogApi.unlikeBlog(blogId);
        }
        if (this.tempDislikes > 0) {
          await blogApi.dislikeBlog(blogId);
        } else if (this.tempDislikes < 0) {
          await blogApi.undislikeBlog(blogId);
        }
        if (this.tempFavorites > 0) {
          await blogApi.favoriteBlog(blogId);
        } else if (this.tempFavorites < 0) {
          await blogApi.unfavoriteBlog(blogId);
        }
      } catch (error) {
        console.error('Failed to sync changes with server:', error);
      }
    },
    showEditBlogDialog(blog) {
      this.selectedBlog = { ...blog };
      this.editBlogDialogVisible = true;
    },
    editBlog(updatedBlog) {
      this.fetchBlogData();
      this.editBlogDialogVisible = false;
    }
  }
};
</script>

<style scoped>
.blog-detail {
  margin-top: 100px;
  height: calc(100vh - 200px);
  overflow-y: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.blog-header {
  text-align: center;
}

.blog-header p {
  display: flex;
  justify-content: center;
  align-items: center;
}

.blog-header p .author-info,
.blog-header p .date-info {
  display: flex;
  align-items: center;
  margin-right: 20px;
}

.blog-header p .date-info {
  margin-right: 0;
}

.blog-header img {
  max-width: 100%;
  height: auto;
}

.blog-content {
  margin-top: 20px;
  line-height: 1.6;
  text-align: left;
}

.blog-actions {
  margin-top: 20px;
  text-align: center;
}

.comments-section {
  margin-top: 40px;
}

.author-link {
  text-decoration: none;
  color: rgb(4, 150, 248);
  color: rgb(241, 241, 9);
}
</style>
