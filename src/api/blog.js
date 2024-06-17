import apiClient from './index';

export default {
  getBlogs(params) {
    console.log(params)
    return apiClient.get('/blogs', { params });
  },
  createBlog(blogFormData) {
    return apiClient.post('/blogs', blogFormData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  updateBlog(id, blog) {
    return apiClient.put(`/blogs/${id}`, blog);
  },
  deleteBlog(id) {
    return apiClient.delete(`/blogs/${id}`);
  },
  getBlogsById(id, params){
    return apiClient.get(`/blogs/${id}`, { params });
  },//获取指定用户的博客
  getCollections(params){
    return apiClient.get('/blogs/collections', { params });
  }
};
