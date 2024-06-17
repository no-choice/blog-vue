<template>
  <el-dialog title="添加用户" :visible.sync="visible" @close="resetForm" width="500px">
    <el-form :model="formData" ref="form" style="margin: 20px;">
      <el-form-item label="用户名" :label-width="formLabelWidth">
        <el-input v-model="formData.username" />
      </el-form-item>
      <el-form-item label="用户头像" :label-width="formLabelWidth">
        <el-upload
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
        <el-input v-model="formData.password" type="password" />
      </el-form-item>
      <el-form-item label="用户邮箱" :label-width="formLabelWidth">
        <el-input v-model="formData.email" />
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
    }
  },
  data() {
    return {
      formData: {
        username: '',
        avatarFile: null, // 新增 avatarFile 字段用于上传
        password: '',
        email: ''
      },
      formLabelWidth: '80px',
      dialogImageUrl: '',
      dialogVisible: false
    };
  },
  methods: {
    handleFileChange(file) {
      this.formData.avatarFile = file.raw;
    },
    handlePreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleRemove() {
      this.formData.avatarFile = null;
    },
    async submitForm() {
      // 进行表单验证
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          const formData = new FormData();
          formData.append('username', this.formData.username);
          formData.append('password', this.formData.password);
          formData.append('email', this.formData.email);
          if (this.formData.avatarFile) {
            formData.append('avatarFile', this.formData.avatarFile);
          }
          try {
            // 调用 API 方法添加用户
            await userApi.addUser(formData);
            this.$message.success('添加用户成功');
            this.closeDialog();
            this.$emit('add-user'); // 触发添加用户事件
          } catch (error) {
            this.$message.error('添加用户失败');
            console.error('Failed to submit form:', error);
          }
        }
      });
    },
    resetForm() {
      this.formData = {
        username: '',
        avatarFile: null,
        password: '',
        email: ''
      };
    },
    closeDialog() {
      this.resetForm();
      this.$emit('update:visible', false); // 更新对话框可见状态
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
