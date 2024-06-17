<template>
  <div class="blog-management">
    <el-row class="control-bar">
      <el-col :span="12" class="search-container">
        <el-input
          v-model="search"
          placeholder="搜索博客"
          prefix-icon="el-icon-search"
          @input="fetchBlogs"
          class="search-input"
        />
      </el-col>
      <el-col :span="12" class="add-blog-button">
        <el-button type="primary" @click="showAddBlogDialog">添加博客</el-button>
      </el-col>
    </el-row>
    <el-table :data="computedBlogs" style="width: 100%">
      <el-table-column label="ID" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.serialNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="封面" width="100">
        <template slot-scope="scope">
          <img
            :src="url + scope.row.cover"
            :alt="scope.row.title"
            class="cover-image"
            @click="showImageDialog(scope.row.cover)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="title" label="博客题目" />
      <el-table-column label="内容">
        <template slot-scope="scope">
          <el-popover
            placement="top"
            width="200"
            trigger="click"
            v-model="scope.row.contentPopoverVisible"
          >
            <p>{{ scope.row.content }}</p>
            <div slot="reference" class="content-preview">
              <span>{{ truncateContent(scope.row.content) }}</span>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="favourCnt" label="点赞数" width="100" />
      <el-table-column prop="noFavourCnt" label="点踩数" width="100" />
      <el-table-column prop="collection" label="收藏数" width="100" />
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="showEditBlogDialog(scope.row)">修改</el-button>
          <el-button type="text" size="small" @click="deleteBlog(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="totalBlogs"
        :page-size="pageSize"
        :current-page="currentPage"
        @current-change="handlePageChange"
      />
    </div>
    <AddBlogForm :visible.sync="addBlogDialogVisible" @add-blog="addBlog" />
    <EditBlogForm :visible.sync="editBlogDialogVisible" :blogData="selectedBlog || {}" @edit-blog="editBlog" />
    <el-dialog :visible.sync="imageDialogVisible" width="30%" :before-close="handleClose">
      <img :src="currentImageUrl" alt="Blog Cover" style="width: 100%" />
    </el-dialog>
  </div>
</template>

<script>
import AddBlogForm from './AddBlogForm.vue';
import EditBlogForm from './EditBlogForm.vue';
import blogApi from '@/api/admin_blog';

export default {
  components: {
    AddBlogForm,
    EditBlogForm
  },
  data() {
    return {
      search: '',
      url: this.$store.state.url,
      blogs: [],
      addBlogDialogVisible: false,
      editBlogDialogVisible: false,
      selectedBlog: null,
      currentPage: 1,
      pageSize: 8,
      totalBlogs: 0,
      imageDialogVisible: false,
      currentImageUrl: ''
    };
  },
  watch: {
    currentPage: 'fetchBlogs',
    search: 'fetchBlogs'
  },
  computed: {
    computedBlogs() {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      return this.blogs.map((blog, index) => ({
        ...blog,
        serialNumber: startIndex + index + 1,
        contentPopoverVisible: false
      }));
    }
  },
  methods: {
    async fetchBlogs() {
      try {
        const response = await blogApi.getBlogs({
          page: this.currentPage,
          pageSize: this.pageSize,
          search: this.search
        });
        this.blogs = response.data.blogs;
        this.totalBlogs = response.data.total;
      } catch (error) {
        console.error('Failed to fetch blogs:', error);
      }
    },
    showAddBlogDialog() {
      this.addBlogDialogVisible = true;
    },
    addBlog(newBlog) {
      this.fetchBlogs();
    },
    showEditBlogDialog(blog) {
      this.selectedBlog = { ...blog };
      this.editBlogDialogVisible = true;
    },
    editBlog(updatedBlog) {
      this.fetchBlogs();
    },
    async deleteBlog(blog) {
      try {
        await blogApi.deleteBlog(blog.id);
        this.$message.success('博客删除成功');
        this.fetchBlogs();
      } catch (error) {
        console.error('Failed to delete blog:', error);
        this.$message.error('博客删除失败');
      }
    },
    handlePageChange(page) {
      this.currentPage = page;
      this.fetchBlogs();
    },
    truncateContent(content) {
      const maxLength = 50; // 设定显示的最大字符数
      return content.length > maxLength ? content.substring(0, maxLength) + '...' : content;
    },
    showImageDialog(cover) {
      this.currentImageUrl = this.url + cover;
      this.imageDialogVisible = true;
    },
    handleClose() {
      this.imageDialogVisible = false;
      this.currentImageUrl = '';
    }
  },
  mounted() {
    this.fetchBlogs();
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

.add-blog-button {
  text-align: right;
}

.cover-image {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
}

.content-preview {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
}

.pagination {
  margin-top: 20px;
}
</style>
