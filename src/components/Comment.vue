<template>
    <div class="comment-form">
      <textarea v-model="content" placeholder="Write your comment here..."></textarea>
      <button @click="submitComment">Submit</button>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Comment',
    data() {
      return {
        content: ''
      };
    },
    methods: {
      submitComment() {
        if (this.content.trim() === '') {
          alert('Comment content cannot be empty!');
          return;
        }
        
        const newComment = {
          content: this.content,
          created_at: new Date().toISOString()
        };
  
        this.$emit('submitComment', newComment);
        this.content = '';
      }
    }
  };
  </script>
  
  <style scoped>
  .comment-form {
    margin-top: 20px;
  }
  .comment-form textarea {
    width: 100%;
    height: 100px;
    margin-bottom: 10px;
  }
  .comment-form button {
    display: block;
    padding: 10px 20px;
  }
  </style>
  