import axios from 'axios';
const url = 'http://192.168.0.101:3000/'; // 后端 API 的基础 URL
// 创建 axios 实例
const apiClient = axios.create({
  baseURL: url + 'api', // 你的后端 API 地址
  withCredentials: true, // 允许跨域请求
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  },
  timeout: 10000 // 请求超时时间
});

// 请求拦截器，在每个请求发送前设置 token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器，可以处理响应数据或错误
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
