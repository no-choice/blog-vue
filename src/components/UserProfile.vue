<template>
  <el-row justify="center" style="top:200px">
    <el-col :span="8" :offset="8">
      <el-card>
        <div class="user-profile">
          <el-row class="profile-item">
            <el-col :span="8" class="item-label">头像：</el-col>
            <el-col :span="16" class="item-value">
              <img :src="this.$store.state.url + user.profilePicture" alt="User Avatar" class="avatar">
              <el-upload
                class="avatar-uploader"
                :action="this.$store.state.url + 'api/users/' + userId + '/uploadProfilePicture'"
                :headers="uploadHeaders"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload">
                <i class="fas fa-edit"></i>
              </el-upload>
            </el-col>
          </el-row>

          <el-row class="profile-item">
            <el-col :span="8" class="item-label">用户名：</el-col>
            <el-col :span="16" class="item-value">
              <span>{{ user.userName }}</span>
              <i class="fas fa-edit" @click="editField('userName')"></i>
            </el-col>
          </el-row>
          
          <el-row class="profile-item">
            <el-col :span="8" class="item-label">密码：</el-col>
            <el-col :span="16" class="item-value">
              <span>{{ user.password }}</span>
              <i class="fas fa-edit" @click="editField('passWord')"></i>
            </el-col>
          </el-row>
          
          <el-row class="profile-item">
            <el-col :span="8" class="item-label">邮箱：</el-col>
            <el-col :span="16" class="item-value">
              <span>{{ user.email }}</span>
              <i class="fas fa-edit" @click="editField('email')"></i>
            </el-col>
          </el-row>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
import { mapState } from 'vuex';
import userApi from '@/api/user';
import { mapMutations } from 'vuex';

export default {
  name: 'UserProfile',
  data() {
    return {
      user: {
        profilePicture: '',
        userName: '',
        passWord: '',
        email: ''
      },
      isLoading: true
    };
  },
  computed: {
    ...mapState({
      userId: state => state.user.id
    }),
    uploadHeaders() {
      return {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      };
    }
  },
  mounted() {
    this.fetchUserProfile();
  },
  methods: {
    ...mapMutations(['login']), //
    async fetchUserProfile() {
      try {
        const response = await userApi.getUserProfile(this.userId);
        this.user = response.data.user;
      } catch (error) {
        console.error('获取用户信息失败', error);
      } finally {
        this.isLoading = false;
      }
    },
    editField(fieldName) {
      this.$prompt(`请输入新的${fieldName}`, '编辑', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /.+/,
        inputErrorMessage: '内容不能为空'
      }).then(({ value }) => {
        this.updateUserProfile({ [fieldName]: value });
      }).catch(() => {
        console.log('取消编辑');
      });
    },
    async updateUserProfile(data) {
      try {
        const response = await userApi.updateUserProfile(this.userId, data);
        Object.assign(this.user, response.data);
        this.fetchUserProfile();
        this.$message.success('用户信息更新成功');
      } catch (error) {
        console.error('更新用户信息失败', error);
        this.$message.error('更新用户信息失败');
      }
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isPNG = file.type === 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG && !isPNG) {
        this.$message.error('上传头像图片只能是 JPG 或 PNG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return (isJPG || isPNG) && isLt2M;
    },
    handleAvatarSuccess(response) {
      console.log(response); // 确认返回的数据结构
      if (response && response.profilePicture) {
        this.user.profilePicture = response.profilePicture; // 更新头像 URL
        const updatedUser = {
        avatar: response.profilePicture,
        role: this.$store.state.user.role,
        id: this.$store.state.user.id
      };
      this.login(updatedUser); // 调用 mutations 更新 user
        this.$message.success('头像更新成功');
      } else {
        this.$message.error('头像上传失败');
      }
    },
  }
};
</script>

<style scoped>
.el-row {
  min-height: 50px;
  display: flex;
  align-items: center;
}
.user-profile {
  margin: 20px;
}

.item-label {
  font-weight: bold;
}

.item-value {
  display: flex;
  align-items: center;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: auto;
}

.avatar-uploader i {
  margin-left: 5px;
  cursor: pointer;
  font-size: 20px;
}

.avatar-uploader input {
  display: none;
}
span{
  margin-right: auto;
}
</style>
