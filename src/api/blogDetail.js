import apiClient from './index';

export default {
  getBlog(id) {
    return apiClient.get(`/blog/${id}`);
  },
  likeBlog(id) {
    return apiClient.post(`/blog/${id}/like`);
  },
  unlikeBlog(id) {
    return apiClient.post(`/blog/${id}/unlike`);
  },
  dislikeBlog(id) {
    return apiClient.post(`/blog/${id}/dislike`);
  },
  undislikeBlog(id) {
    return apiClient.post(`/blog/${id}/undislike`);
  },
  favoriteBlog(id) {
    return apiClient.post(`/blog/${id}/favorite`);
  },
  unfavoriteBlog(id) {
    return apiClient.post(`/blog/${id}/unfavorite`);
  },
  getComments(blogId) {
    return apiClient.get(`/blog/${blogId}/comments`);
  },
  addComment(blogId, comment) {
    return apiClient.post(`/blog/${blogId}/comments`, comment);
  },
  //判断是否已经收藏过
  isCollected(id){
    return apiClient.get(`/blog/${id}/isCollected`);
  },
  //判断是否已经点赞过
  isLiked(id){
    return apiClient.get(`/blog/${id}/isLiked`);
  },
  //判断是否点踩过
  isDisLiked(id){
    return apiClient.get(`/blog/${id}/isdisLiked`);
  }
};
