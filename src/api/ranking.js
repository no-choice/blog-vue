import apiClient from './index';

export default {
    getBlogCountRanking(){
        return apiClient.get('/ranking/blogCount');
    },
    getLikeCountRanking(){
        return apiClient.get('/ranking/likeCount');
    }
  };