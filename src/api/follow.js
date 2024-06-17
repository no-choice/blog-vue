import apiClient from './index';

export default {
  // 添加关注
  addFollow(userId) {
    return apiClient.post('/follow', { userId });
  },

  // 取消关注
  removeFollow(userId) {
    return apiClient.delete(`/follow/${userId}`);
  },

  // 获取关注列表
  getFollowList() {
    return apiClient.get('/follow');
  },
  //是否关注
  isFollowed(userId){
    return apiClient.get(`/follow/${userId}`);
  }
};
