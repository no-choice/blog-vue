<template>
  <el-row justify="center" class="follow-list">
    <el-col :span="12" :offset="6">
      <el-card v-for="(follow, index) in follows" :key="index" class="follow-item">
        <div class="follow-info">
          <img :src="url + follow.avatar" class="avatar" alt="User Avatar">
          <div class="user-info">
            <h3>{{ follow.username }}</h3>
            <p>{{ follow.lastMessage }}</p>
          </div>
          <div class="button-container">
            <el-button type="text" icon="el-icon-chat-dot-round" @click="openChat(follow)">聊天</el-button>
            <el-button type="text" icon="el-icon-delete" @click="removeFollow(follow.id)" class="delete">取消关注</el-button>
          </div>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
import followApi from '../api/follow';
import chatApi from '../api/chat';

export default {
  name: 'FollowList',
  data() {
    return {
      follows: [],
      url: this.$store.state.url
    };
  },
  created() {
    this.fetchFollowList();
  },
  methods: {
    fetchFollowList() {
      followApi.getFollowList()
        .then(response => {
          this.follows = response.data.follows;
        })
        .catch(error => {
          console.error('Failed to fetch follow list:', error);
        });
    },
    removeFollow(followId) {
      followApi.removeFollow(followId)
        .then(() => {
          this.follows = this.follows.filter(follow => follow.id !== followId);
        })
        .catch(error => {
          console.error('Failed to remove follow:', error);
        });
    },
    openChat(follow) {
      chatApi.isCreated(follow.id)
        .then(response => {
          if (!response.data.created) {
            return chatApi.createChat(follow.id);
          }
        })
        .then(() => {
          this.$router.push('/chat/' + follow.id);
        })
        .catch(error => {
          console.error('Failed to open chat:', error);
        });
    }
  }
};
</script>

<style scoped>
.follow-list {
  padding: 20px;
  top: 100px; /* 确保在导航栏下面 */
}

.follow-item {
  margin-bottom: 20px;
}

.follow-info {
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

.button-container {
  display: flex;
  align-items: center;
}

.el-button {
  margin-left: 50px; /* 适当调整按钮之间的间距 */
  align-self: center;
}

.delete {
  color: red;
}
</style>
