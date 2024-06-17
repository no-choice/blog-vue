<template>
  <div class="ranking-list">
    <el-row>
      <el-col :span="24">
        <el-radio-group v-model="activeTab" @change="handleTabChange">
          <el-radio-button label="发布博客数量排行"></el-radio-button>
          <el-radio-button label="获赞数排行"></el-radio-button>
        </el-radio-group>
      </el-col>
    </el-row>
    <div class="top-three">
      <div class="user rank-1" v-if="topThree[1]">
        <img :src="base_URL + topThree[1].avatar" :alt="topThree[1].name" />
        <div class="info">
          <p style="color: silver; font-weight: bold">{{ topThree[1].name }}</p>
          <p>{{ activeTab === '发布博客数量排行' ? `发布博客数: ${topThree[1].blogCount}` : `获赞数: ${topThree[1].likeCount}` }}</p>
        </div>
      </div>
      <div class="user rank-0" v-if="topThree[0]">
        <img :src="base_URL + topThree[0].avatar" :alt="topThree[0].name" />
        <div class="info">
          <p style="color: gold; font-weight: bold">{{ topThree[0].name }}</p>
          <p>{{ activeTab === '发布博客数量排行' ? `发布博客数: ${topThree[0].blogCount}` : `获赞数: ${topThree[0].likeCount}` }}</p>
        </div>
      </div>
      <div class="user rank-2" v-if="topThree[2]">
        <img :src="base_URL + topThree[2].avatar" :alt="topThree[2].name" />
        <div class="info">
          <p style="color: #cd7f32; font-weight: bold">{{ topThree[2].name }}</p>
          <p>{{ activeTab === '发布博客数量排行' ? `发布博客数: ${topThree[2].blogCount}` : `获赞数: ${topThree[2].likeCount}` }}</p>
        </div>
      </div>
    </div>
    <el-table :data="otherUsers" style="width: 100%;">
      <el-table-column prop="rank" label="排名" width="80"></el-table-column>
      <el-table-column label="头像" width="100">
        <template slot-scope="scope">
          <img :src="base_URL + scope.row.avatar" :alt="scope.row.name" class="avatar" />
        </template>
      </el-table-column>
      <el-table-column prop="name" label="用户名"></el-table-column>
      <el-table-column label="数量" :prop="activeTab === '发布博客数量排行' ? 'blogCount' : 'likeCount'"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import rank from '@/api/ranking';

export default {
  data() {
    return {
      activeTab: '发布博客数量排行',
      users: [],
      base_URL: this.$store.state.url
    };
  },
  computed: {
    topThree() {
      return this.users.slice(0, 3);
    },
    otherUsers() {
      return this.users.slice(3).map((user, index) => {
        return { ...user, rank: index + 4 };
      });
    }
  },
  mounted() {
    this.fetchRankingData();
  },
  methods: {
    fetchRankingData() {
      if (this.activeTab === '发布博客数量排行') {
        rank.getBlogCountRanking().then(response => {
          this.users = response.data.rankings;
        }).catch(error => {
          console.error('Failed to fetch blog count ranking:', error);
        });
      } else {
        rank.getLikeCountRanking().then(response => {
          this.users = response.data.rankings;
        }).catch(error => {
          console.error('Failed to fetch like count ranking:', error);
        });
      }
    },
    handleTabChange() {
      this.fetchRankingData();
    }
  }
};
</script>

<style scoped>
.ranking-list {
  padding: 20px;
}

.top-three {
  display: flex;
  justify-content: space-around;
  align-items: flex-end; /* Ensure the avatars are bottom-aligned */
  margin-bottom: 20px;
}

.user {
  text-align: center;
  margin: 0 10px;
}

.user img {
  border-radius: 50%;
}

.user.rank-0 img {
  width: 120px;
  height: 120px;
}

.user.rank-1 img {
  width: 100px;
  height: 100px;
}

.user.rank-2 img {
  width: 80px;
  height: 80px;
}

.info p {
  margin: 0;
}

.avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}
</style>
