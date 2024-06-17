<template>
  <el-dialog title="编辑用户" :visible.sync="visible" @close="resetForm" width="500px">
    <el-form :model="userForm" ref="form" style="margin: 20px;" enctype="multipart/form-data">
      <el-form-item label="用户名" :label-width="formLabelWidth">
        <el-input v-model="userForm.userName"></el-input>
      </el-form-item>
      <el-form-item label="用户头像" :label-width="formLabelWidth" prop="avatarFile">
        <el-upload
          ref="upload"
          class="upload-demo"
          action=""
          list-type="picture-card"
          :auto-upload="false"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :on-change="handleFileChange">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="用户密码" :label-width="formLabelWidth">
        <el-input v-model="userForm.password" type="password"></el-input>
      </el-form-item>
      <el-form-item label="用户邮箱" :label-width="formLabelWidth">
        <el-input v-model="userForm.email"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeDialog">取消</el-button>
      <el-button type="primary" @click="submitForm">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import userApi from '@/api/admin_user';

export default {
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    userData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      userForm: {
        id: null,
        userName: '',
        avatar: '',
        password: '',
        email: '',
        avatarFile: null
      },
      formLabelWidth: '80px',
      dialogImageUrl: this.userData.profilePicture,
      dialogVisible: false,
      url: this.$store.state.url
    };
  },
  watch: {
    userData: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.userForm = {
            id: newVal.id,
            userName: newVal.userName,
            avatar: newVal.profilePicture,
            password: newVal.password,
            email: newVal.email,
            avatarFile: null
          };
        }
      }
    },
  },
  methods: {
    handleFileChange(file) {
      this.userForm.avatarFile = file.raw;
    },
    handlePreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleRemove() {
      this.userForm.avatarFile = null;
    },
    async submitForm() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          const formData = new FormData();
          formData.append('userName', this.userForm.userName);
          formData.append('password', this.userForm.password);
          formData.append('email', this.userForm.email);
          if (this.userForm.avatarFile) {
            formData.append('avatarFile', this.userForm.avatarFile);
            formData.append('avatar', '');
          } else {
            formData.append('avatar', this.userForm.avatar);
          }
          try {
            await userApi.editUser(this.userForm.id, formData);
            this.$message.success('用户信息更新成功');
            this.closeDialog();
            this.$emit('edit-user', this.userForm); // 通知父组件更新用户列表
          } catch (error) {
            this.$message.error('更新用户信息失败');
            console.error('Failed to submit form:', error);
          }
        }
      });
    },
    resetForm() {
      this.userForm = {
        id: this.userData.id || null,
        userName: this.userData.userName || '',
        avatar: this.userData.profilePicture || '',
        password: this.userData.password || '',
        email: this.userData.email || '',
        avatarFile: null,
      };
      this.dialogImageUrl = '';
      this.dialogVisible = false;
      this.$refs.upload.clearFiles(); // 清空上传组件的文件列表
    },
    closeDialog() {
      this.resetForm();
      this.$emit('update:visible', false);
    }
  }
};
</script>

<style scoped>
.dialog-footer {
  text-align: right;
}
.upload-demo .el-upload {
  display: inline-block;
  width: 100px;
  height: 100px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  overflow: hidden;
  position: relative;
}
.upload-demo img {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
