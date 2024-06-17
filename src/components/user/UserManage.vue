<template>
  <div class="user-management">
    <el-row class="control-bar">
      <el-col :span="12" class="search-container">
        <el-input
          v-model="search"
          placeholder="搜索用户"
          prefix-icon="el-icon-search"
          class="search-input"
        />
      </el-col>
      <el-col :span="12" class="add-user-button">
        <el-button type="primary" @click="showAddUserDialog">添加用户</el-button>
      </el-col>
    </el-row>
    <el-table :data="computedUsers" style="width: 100%">
      <el-table-column label="ID" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.serialNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户头像" width="100">
        <template slot-scope="scope">
          <img
            :src="url + scope.row.profilePicture"
            :alt="scope.row.userName"
            class="avatar"
            @click="showImageDialog(scope.row.profilePicture)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="userName" label="用户名" />
      <el-table-column prop="password" label="用户密码" />
      <el-table-column prop="email" label="用户邮箱" />
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="showEditUserDialog(scope.row)">修改</el-button>
          <el-button type="text" size="small" @click="deleteUser(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="totalUsers"
        :page-size="pageSize"
        :current-page="currentPage"
        @current-change="handlePageChange"
      />
    </div>
    <AddUserForm :visible.sync="addUserDialogVisible" @add-user="addUser" />
    <EditUserForm :visible.sync="editUserDialogVisible" :userData="selectedUser || {}" @edit-user="editUser" />
    <el-dialog :visible.sync="imageDialogVisible" width="30%" :before-close="handleClose">
      <img :src="currentImageUrl" alt="User Avatar" style="width: 100%" />
    </el-dialog>
  </div>
</template>

<script>
import AddUserForm from './AddUserForm.vue';
import EditUserForm from './EditUserForm.vue';
import userApi from '@/api/admin_user';

export default {
  components: {
    AddUserForm,
    EditUserForm
  },
  data() {
    return {
      search: '',
      url: this.$store.state.url,
      users: [],
      addUserDialogVisible: false,
      editUserDialogVisible: false,
      selectedUser: null,
      currentPage: 1,
      pageSize: 8,
      totalUsers: 0,
      imageDialogVisible: false,
      currentImageUrl: ''
    };
  },
  watch: {
    currentPage: 'fetchUsers',
    search: 'fetchUsers'
  },
  computed: {
    computedUsers() {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      return this.users.map((user, index) => ({
        ...user,
        serialNumber: startIndex + index + 1
      }));
    }
  },
  methods: {
    async fetchUsers() {
      try {
        const response = await userApi.getUsers({
          page: this.currentPage,
          pageSize: this.pageSize,
          search: this.search
        });
        this.users = response.data.users;
        this.totalUsers = response.data.total;
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    },
    showAddUserDialog() {
      this.addUserDialogVisible = true;
    },
    addUser(newUser) {
      this.fetchUsers();
    },
    showEditUserDialog(user) {
      this.selectedUser = { ...user };
      this.editUserDialogVisible = true;
    },
    editUser(updatedUser) {
      this.fetchUsers();
    },
    async deleteUser(user) {
      try {
        await userApi.deleteUser(user.id);
        this.$message.success('用户删除成功');
        this.fetchUsers();
      } catch (error) {
        console.error('Failed to delete user:', error);
        this.$message.error('用户删除失败');
      }
    },
    handlePageChange(page) {
      this.currentPage = page;
      this.fetchUsers();
    },
    showImageDialog(profilePicture) {
      this.currentImageUrl = this.url + profilePicture;
      this.imageDialogVisible = true;
    },
    handleClose() {
      this.imageDialogVisible = false;
      this.currentImageUrl = '';
    }
  },
  mounted() {
    this.fetchUsers();
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

.add-user-button {
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
