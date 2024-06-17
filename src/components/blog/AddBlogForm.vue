<template>
  <el-dialog title="添加博客" :visible.sync="visible" @close="resetForm" width="500px">
    <el-form :model="formData" ref="form" style="margin: 20px;">
      <el-form-item label="博客题目" :label-width="formLabelWidth">
        <el-input v-model="formData.title" />
      </el-form-item>
      <el-form-item label="封面" :label-width="formLabelWidth" prop="coverFile">
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
      <el-form-item label="内容" :label-width="formLabelWidth">
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
import blogApi from '@/api/admin_blog'
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
        title: '',
        coverFile: null,
        content: ''
      },
      formLabelWidth: '80px',
      dialogImageUrl: '',
      dialogVisible: false
    };
  },
  methods: {
    handleFileChange(file) {
      this.formData.coverFile = file.raw;
    },
    handlePreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleRemove() {
      this.formData.coverFile = null;
    },
    async submitForm() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          const formData = new FormData();
          formData.append('title', this.formData.title);
          formData.append('content', this.formData.content);
          if (this.formData.coverFile) {
            formData.append('coverImageFile', this.formData.coverFile);
          }
          try {
            // 调用 API 方法添加博客
            await blogApi.addBlog(formData);
            this.$message.success('添加博客成功');
            this.closeDialog();
            this.$emit('add-blog');
          } catch (error) {
            this.$message.error('添加博客失败');
            console.error('Failed to submit form:', error);
          }
        }
      });
    },
    resetForm() {
      this.formData = {
        title: '',
        coverFile: null,
        content: ''
      };
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
