import apiClient from './index';

export default {
    getUsers(params){
        return apiClient.get('/admin/users', {params});
    },
    addUser(formData){
        return apiClient.post('/admin/users', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
    },
    editUser(id, formData){
        return apiClient.put(`/admin/users/${id}`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
    },
    deleteUser(id){
      return apiClient.delete(`/admin/users/${id}`);
    }
  };