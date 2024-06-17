<template>
  <el-dialog title="编辑评论" :visible.sync="visible" @close="resetForm" width="500px">
    <el-form :model="formData" ref="form" style="margin: 20px;" enctype="multipart/form-data">
      <el-form-item label="用户名" :label-width="formLabelWidth">
        <el-input v-model="formData.username" />
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
          :on-change="handleFileChange"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="评论" :label-width="formLabelWidth">
        <el-input v-model="formData.content" type="textarea" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeDialog">取消</el-button>
      <el-button type="primary" @click="submitForm">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import commentApi from '@/api/admin_comment'
export default {
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    commentData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      formData: {
        id: null,
        username: '',
        avatar: '',
        content: '',
        avatarFile: null
      },
      formLabelWidth: '80px',
      dialogImageUrl: '',
      dialogVisible: false
    };
  },
  watch: {
    commentData: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.formData = {
            id: newVal.id,
            username: newVal.username,
            avatar: newVal.avatar,
            content: newVal.content,
            avatarFile: null
          };
          this.dialogImageUrl = newVal.avatar;
        }
      }
    }
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
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          const formData = new FormData();
          formData.append('username', this.formData.username);
          formData.append('content', this.formData.content);
          if (this.formData.avatarFile) {
            formData.append('avatarFile', this.formData.avatarFile);
            formData.append('avatar', '');
          } else {
            formData.append('avatar', this.formData.avatar);
          }
          try {
            await commentApi.editComment(this.formData.id, formData);
            this.$message.success('更新评论成功');
            this.closeDialog();
            this.$emit('edit-comment', this.formData); // 通知父组件更新用户列表
          } catch (error) {
            this.$message.error('更新评论失败');
            console.error('Failed to submit form:', error);
          }
        }
      });
    },
    resetForm() {
      this.formData = {
        id: this.commentData.id || null,
        username: this.commentData.username || '',
        avatar: this.commentData.avatar || '',
        content: this.commentData.content || '',
        avatarFile: null
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
