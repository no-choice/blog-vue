// store/index.js

import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const getDefaultState = () => {
  return {
    isLoggedIn: false,
    user: {
      avatar: '',
      role: '',
      id: ''
    },
    url: 'http://192.168.0.101:3000/'
  };
};

export default new Vuex.Store({
  state: getDefaultState(),
  mutations: {
    login(state, user) {
      state.isLoggedIn = true;
      state.user = user;
      // 保存用户信息到本地存储
      localStorage.setItem('user', JSON.stringify(user));
    },
    logout(state) {
      state.isLoggedIn = false;
      state.user = getDefaultState().user;
      // 清除本地存储中的用户信息
      localStorage.removeItem('user');
    }
  },
  actions: {
    login({ commit }, user) {
      commit('login', user);
    },
    logout({ commit }) {
      commit('logout');
    }
  },
  getters: {
    isLoggedIn: state => state.isLoggedIn,
    user: state => state.user
  }
});
