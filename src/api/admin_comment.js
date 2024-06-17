import apiClient from './index';

export default {
    getComments(params){
        return apiClient.get('/admin/comments', {params});
    },
    editComment(id, formData){
        return apiClient.put(`/admin/comments/${id}`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
    },
    deleteComment(id){
      return apiClient.delete(`/admin/comments/${id}`);
    }
  };