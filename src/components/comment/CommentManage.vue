<template>
  <div class="comment-management">
    <el-row class="control-bar">
      <el-col :span="24" class="search-container">
        <el-input
          v-model="search"
          placeholder="搜索评论"
          prefix-icon="el-icon-search"
          class="search-input"
        />
      </el-col>
      <el-col :span="18"></el-col> <!-- 占位，保持布局 -->
    </el-row>
    <el-table :data="computedComments" style="width: 100%">
      <el-table-column label="ID" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.serialNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="头像" width="100">
        <template slot-scope="scope">
          <img
            :src="url + scope.row.avatar"
            :alt="scope.row.username"
            class="avatar"
            @click="showImageDialog(scope.row.avatar)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="username" label="用户名" />
      <el-table-column prop="content" label="评论" />
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="showEditCommentDialog(scope.row)">修改</el-button>
          <el-button type="text" size="small" @click="deleteComment(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="totalComments"
        :page-size="pageSize"
        :current-page="currentPage"
        @current-change="handlePageChange"
      />
    </div>
    <EditCommentForm :visible.sync="editCommentDialogVisible" :commentData="selectedComment || {}" @edit-comment="editComment" />
    <el-dialog :visible.sync="imageDialogVisible" width="30%" :before-close="handleClose">
      <img :src="currentImageUrl" alt="User Avatar" style="width: 100%" />
    </el-dialog>
  </div>
</template>

<script>
import EditCommentForm from './EditCommentForm.vue';
import commentApi from '@/api/admin_comment';

export default {
  components: {
    EditCommentForm
  },
  data() {
    return {
      search: '',
      url: this.$store.state.url,
      comments: [],
      editCommentDialogVisible: false,
      selectedComment: null,
      currentPage: 1,
      pageSize: 8,
      totalComments: 0,
      imageDialogVisible: false,
      currentImageUrl: ''
    };
  },
  watch: {
    currentPage: 'fetchComments',
    search: 'fetchComments'
  },
  computed: {
    computedComments() {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      return this.comments.map((comment, index) => ({
        ...comment,
        serialNumber: startIndex + index + 1
      }));
    }
  },
  methods: {
    async fetchComments() {
      try {
        const response = await commentApi.getComments({
          page: this.currentPage,
          pageSize: this.pageSize,
          search: this.search
        });
        this.comments = response.data.comments;
        this.totalComments = response.data.total;
      } catch (error) {
        console.error('Failed to fetch comments:', error);
      }
    },
    showEditCommentDialog(comment) {
      this.selectedComment = { ...comment };
      this.editCommentDialogVisible = true;
    },
    editComment(updatedComment) {
      this.fetchComments();
    },
    async deleteComment(comment) {
      try {
        await commentApi.deleteComment(comment.id);
        this.$message.success('评论删除成功');
        this.fetchComments();
      } catch (error) {
        console.error('Failed to delete comment:', error);
        this.$message.error('评论删除失败');
      }
    },
    handlePageChange(page) {
      this.currentPage = page;
      this.fetchComments();
    },
    showImageDialog(avatar) {
      this.currentImageUrl = this.url + avatar
      this.imageDialogVisible = true;
    },
    handleClose() {
      this.imageDialogVisible = false;
      this.currentImageUrl = '';
    }
  },
  mounted() {
    this.fetchComments();
  }
};
</script>

<style scoped>
.control-bar {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-container {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.search-input {
  width: 30%;
}

.add-comment-button {
  text-align: right;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
}

.pagination {
  margin-top: 20px;
}
</style>
