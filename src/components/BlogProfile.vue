<template>
  <router-link :to="'/blog/' + blog.id" style="text-decoration: none; width: 100%;">
    <el-card class="blog-card">
      <div class="blog-content">
        <img :src="url + blog.cover" alt="Blog Cover" class="blog-cover">
        <div class="blog-details">
          <div class="blog-header">
            <!-- <img :src="'http://localhost:3000/' + blog.avatar" alt="Author Avatar" class="author-avatar"> -->
            <h2 class="blog-title">{{ blog.title }}</h2>
          </div>
          <p class="blog-content-text">{{ blog.content }}</p>
          <div class="blog-actions">
            <span class="blog-action">
              <i class="fas fa-thumbs-up"></i> {{ blog.favourCnt }}
            </span>
            <span class="blog-action">
              <i class="fas fa-thumbs-down"></i> {{ blog.noFavourCnt }}
            </span>
            <span class="blog-action">
              <i class="fas fa-star"></i> {{ blog.collection }}
            </span>
          </div>
        </div>
      </div>
    </el-card>
  </router-link>
</template>

<script>
export default {
  data(){
    return{
      url: this.$store.state.url
    }
  },
  name: 'BlogProfile',
  props: {
    blog: {
      type: Object,
      required: true
    }
  }
};
</script>

<style scoped>
.blog-card {
  display: flex;
  margin: 20px 0;
  padding: 0;
  border-radius: 8px;
  overflow: hidden;
  background-color: #fff;
  width: 70%; /* 2/3 of the width */
}

.blog-content {
  display: flex;
  flex: 1;
}

.blog-cover {
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-radius: 8px 0 0 8px;
  margin-right: 20px;
}

.blog-details {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.blog-header {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.author-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}

.blog-title {
  font-size: 18px;
  margin: 0;
}

.blog-content-text {
  margin: 0;
  color: #555;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3; /* Limit to 3 lines */
  -webkit-box-orient: vertical;
}

.blog-actions {
  margin-top: 10px;
  display: flex;
  align-items: center;
}

.blog-action {
  margin-right: 15px;
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #888;
}

.blog-action i {
  margin-right: 5px;
}
</style>
