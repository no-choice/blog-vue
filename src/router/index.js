import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    children:[
      {
        path: '',
        redirect: '/home'
      },
      {
        path: 'home',
        name: 'HView',
        component: () => import('../views/MainBlog.vue')
      },
      {
        path: 'blog/:id',
        name: 'BlogDetail',
        component: () => import('../components/BlogDetail.vue'),
        props: true
      },
      {
        path: 'login',
        name: 'LoginForm',
        component: ()=> import('../components/LoginForm.vue')
      },
      {
        path: 'Register',
        name: 'RegisterForm',
        component: ()=> import('../components/RegisterForm.vue')
      },
      {
        path: 'userProfile',
        name: 'UserProfile',
        component: ()=> import('../components/UserProfile.vue')
      },
      {
        path: 'followList',
        name: 'FollowList',
        component: ()=> import('../components/FollowList.vue')
      },
      {
        path: 'chats',
        name: 'ChatList',
        component: ()=> import('../components/ChatList.vue')
      },
      {
        path: 'chat/:id',
        name: 'ChatView',
        component: ()=> import('../components/ChatView.vue')
      },
      {
        path: 'myBlog/:id',
        name: 'MyBlog',
        component: ()=> import('../views/MyBlog.vue')
      },
      {
        path: 'publish',
        name: 'PublishBlog',
        component: ()=> import('../components/PublishBlog.vue')
      },
      {
        path: 'collect',
        name: 'MyCollect',
        component: ()=> import('../views/MyCollect.vue')
      },
      {
        path: '/user/:id',
        name: 'UserView',
        component: ()=> import('../views/UserView.vue'),
        props: true
      }
    ]
  },
  {
    path: '/manage',
    name: 'ManageMent',
    component: ()=> import('../views/Manage.vue'),
    children:[
      {
        path: '',
        redirect: '/manage/main'
      },
      {
        path: 'main',
        name: 'MainView',
        component: ()=> import('../components/MainView.vue'),
      },
      {
        path: 'user',
        name: 'UserManage',
        component: ()=> import('../components/user/UserManage.vue'),
      },
      {
        path: 'blog',
        name: 'BlogManage',
        component: ()=> import('../components/blog/BlogManage.vue'),
      },
      {
        path: 'comment',
        name: 'CommentManage',
        component: ()=> import('../components/comment/CommentManage.vue'),
      },
    ]
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
