import apiClient from './index';

export default {
    getBlogs(params){
        return apiClient.get('/admin/blogs', {params});
    },
    addBlog(formData){
        return apiClient.post('/admin/blogs', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
    },
    editBlog(id, formData){
        return apiClient.put(`/admin/blogs/${id}`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
    },
    deleteBlog(id){
      return apiClient.delete(`/admin/blogs/${id}`);
    }
  };