<template>
  <el-row>
    <el-col :span="12" :offset="6">
      <div class="publish-blog">
        <el-card>
          <h1>发布博客</h1>
          <el-divider></el-divider>
          <el-form :model="blogForm" ref="blogForm" label-width="100px" enctype="multipart/form-data">
            <el-form-item label="标题" prop="title">
              <el-input v-model="blogForm.title"></el-input>
            </el-form-item>
            <el-form-item label="封面" prop="coverImageFile">
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
            <el-form-item label="内容" prop="content">
              <el-input type="textarea" v-model="blogForm.content"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm">发布</el-button>
              <el-button @click="cancelForm">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import blogApi from '../api/blog.js'; // 导入 API 模块

export default {
  data() {
    return {
      blogForm: {
        title: '',
        coverImageFile: null, // 用于存储上传的封面文件
        content: ''
      },
      dialogImageUrl: '',
      dialogVisible: false
    };
  },
  methods: {
    handleFileChange(file) {
      this.blogForm.coverImageFile = file.raw;
    },
    handlePreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleRemove(file) {
      this.blogForm.coverImageFile = null;
    },
    async submitForm() {
      this.$refs.blogForm.validate(async (valid) => {
        if (valid) {
          const formData = new FormData();
          formData.append('title', this.blogForm.title);
          formData.append('content', this.blogForm.content);
          formData.append('coverImageFile', this.blogForm.coverImageFile);
          try {
            const response = await blogApi.createBlog(formData);
            this.$message.success('博客发布成功');
            this.resetForm();
            this.$router.back();
          } catch (err) {
            this.$message.error('发布博客失败');
            console.error(err);
          }
        } else {
          return false;
        }
      });
    },
    cancelForm() {
      this.$refs.blogForm.resetFields();
      this.blogForm.coverImageFile = null;
    },
    resetForm() {
      this.blogForm.title = '';
      this.blogForm.coverImageFile = null;
      this.blogForm.content = '';
    }
  }
};
</script>

<style scoped>
.publish-blog {
  margin-top: 100px;
}
</style>
