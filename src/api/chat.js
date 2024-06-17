import apiClient from './index.js';

export default {
  //获取聊天列表
  getChats() {
    return apiClient.get('/chats');
  },
  //获取与某用户的聊天信息
  getChatMessages(userId) {
    return apiClient.get(`/chat/${userId}`);
  },
  //发送消息
  sendMessage(userId, message) {
    return apiClient.post(`/chat/${userId}`, { message });
  },
  //创建聊天
  createChat(userId){
    return apiClient.post(`/chats/${userId}`)
  },
  //检查聊天是否已经创建
  isCreated(userId){
    return apiClient.get(`chats/${userId}`)
  }
};
