<template>
  <el-row>
    <el-col :span="16" :offset="4">
      <div class="chat-page">
        <div class="header">
          <el-button @click="goBack" icon="el-icon-arrow-left">返回</el-button>
        </div>
        <div class="chat-content">
          <div v-if="messages.length === 0" class="no-messages">可以开始聊天了</div>
          <div class="message" v-for="message in messages" :key="message.id" :class="{'sent': message.sent, 'received': !message.sent}">
            <img :src="url + getAvatar(message.sent)" class="avatar" />
            <div class="text">{{ message.text }}</div>
          </div>
        </div>
        <div class="chat-input">
          <el-input v-model="newMessage" placeholder="输入消息..."></el-input>
          <el-button type="primary" @click="sendMessage">发送</el-button>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import chatApi from '../api/chat.js';
import userApi from '@/api/user.js';

export default {
  data() {
    return {
      newMessage: '',
      messages: [],
      userId: null,
      url: this.$store.state.url,
      myAvatar: this.$store.state.user.avatar,
      himAvatar: ''
    };
  },
  created() {
    this.userId = this.$route.params.id;
    this.fetchChatMessages();
    this.fetchHimAvatar();
  },
  methods: {
    fetchHimAvatar(){
      userApi.getUserProfile(this.userId)
      .then(response=>{
        this.himAvatar = response.data.user.profilePicture;
        console.log(this.myAvatar,"下一个", this.himAvatar)
      })
      .catch(error => {
        console.error('Failed to fetch userProfile:', error);
      })
    },
    fetchChatMessages() {
      chatApi.getChatMessages(this.userId)
        .then(response => {
          this.messages = response.data.messages.map(msg => ({
            id: msg.id,
            text: msg.content,
            sent: msg.senderId === this.$store.state.user.id,
          }));
        })
        .catch(error => {
          console.error('Failed to fetch chat messages:', error);
        });
    },
    sendMessage() {
      if (this.newMessage.trim()) {
        chatApi.sendMessage(this.userId, this.newMessage)
          .then(response => {
            this.messages.push({
              id: response.data.msg.id,
              text: response.data.msg.content,
              sent: true,
            });
            this.newMessage = '';
          })
          .catch(error => {
            console.error('Failed to send message:', error);
          });
      }
    },
    goBack() {
      this.$router.back();
    },
    getAvatar(temp){
      if (temp){
        return this.myAvatar;
      } else {
        return this.himAvatar;
      }
    }
  }
};
</script>

<style scoped>
.chat-page {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 100px); /* 高度为视口高度减去导航栏高度 */
  margin-top: 100px; /* 留出导航栏的空间 */
}

.header {
  position: fixed;
  top: 100px; /* 确保在导航栏下面 */
  width: 66%;
  background-color: #fff;
  z-index: 1;
  display: flex;
  align-items: center;
  padding: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.chat-content {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  padding-top: 50px; /* 留出返回按钮的空间 */
}

.no-messages {
  text-align: center;
  color: #888;
  margin-top: 20px;
}

.message {
  display: flex;
  align-items: flex-end;
  margin-bottom: 10px;
}

.message.sent {
  flex-direction: row-reverse;
  text-align: right;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin: 0 10px;
}

.text {
  max-width: 60%;
  padding: 10px;
  border-radius: 10px;
  background-color: #f1f1f1;
}

.message.sent .text {
  background-color: #a0e75a;
}

.chat-input {
  display: flex;
  padding: 10px;
  background-color: #fff;
  border-top: 1px solid #e0e0e0;
  position: fixed;
  bottom: 0;
  width: 66%;
  box-sizing: border-box;
}
</style>
