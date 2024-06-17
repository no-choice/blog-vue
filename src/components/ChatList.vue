<template>
    <el-row justify="center" class="chat-list">
      <el-col :span="12" :offset="6">
        <el-card v-for="(chat, index) in chats" :key="index" class="chat-item">
          <div class="chat-info">
            <img :src="url + chat.avatar" class="avatar" alt="User Avatar">
            <div class="user-info">
              <h3>{{ chat.username }}</h3>
              <p>{{ chat.lastMessage }}</p>
            </div>
            <el-button type="text" icon="el-icon-chat-dot-round" @click="openChat(chat)">聊天</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </template>
  
  <script>
  import chatApi from '../api/chat.js';
  
  export default {
    name: 'ChatList',
    data() {
      return {
        chats: [],
        url: this.$store.state.url
      };
    },
    created() {
      this.fetchChatList();
    },
    methods: {
      fetchChatList() {
        chatApi.getChats()
          .then(response => {
            this.chats = response.data.chats;
          })
          .catch(error => {
            console.error('Failed to fetch chat list:', error);
          });
      },
      openChat(chat) {
        this.$router.push('/chat/' + chat.id);
      }
    }
  };
  </script>
  
  <style scoped>
  .chat-list {
    padding: 20px;
    top: 100px; /* 确保在导航栏下面 */
  }
  
  .chat-item {
    margin-bottom: 20px;
  }
  
  .chat-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  .avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-right: 15px;
  }
  
  .user-info h3 {
    margin: 0;
    font-size: 18px;
  }
  
  .user-info p {
    margin: 5px 0 0;
    font-size: 14px;
    color: #888;
  }
  
  .el-button {
    align-self: center;
  }
  </style>
  