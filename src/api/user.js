// api/user.js
import apiClient from './index';
export default {
  getUserProfile(userId) {
    return apiClient.get(`/users/${userId}`);
  },
  updateUserProfile(userId, data) {
    console.log(data)
    return apiClient.put(`/users/${userId}`, data);
  },
  uploadUserProfilePicture(userId, file) {
    const formData = new FormData();
    formData.append('profilePicture', file);
    return apiClient.post(`/users/${userId}/uploadProfilePicture`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}
