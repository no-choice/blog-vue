<template>
  <div class="comment-list">
    <div v-for="comment in comments" :key="comment.id" class="comment-item">
      <div class="comment-header">
        <router-link :to="{ name: 'UserView', params: { id: comment.userId }}" class="author-link">
          <img :src="url + comment.avatar" alt="avatar" class="avatar">
        </router-link>
        <div class="user-info">
          <span class="username">{{ comment.username }}</span>
          <small>{{ formatDate(comment.createdAt) }}</small>
        </div>
      </div>
      <p class="comment-content">{{ comment.content }}</p>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return{
      url: this.$store.state.url
    }
  },
  name: 'CommentList',
  props: {
    comments: {
      type: Array,
      required: true
    }
  },
  methods: {
    formatDate(date) {
      const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
      return new Date(date).toLocaleDateString(undefined, options);
    }
  }
};
</script>

<style scoped>
.comment-list {
  margin-top: 20px;
}
.comment-item {
  border-bottom: 1px solid #ddd;
  padding: 10px 0;
  display: flex;
  flex-direction: column;
}
.comment-header {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}
.user-info {
  display: flex;
  flex-direction: column;
}
.username {
  font-weight: bold;
}
.comment-content {
  margin: 0;
  text-align: left;
}
.comment-item small {
  color: #888;
}
</style>
