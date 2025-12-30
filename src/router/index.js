// router/index.js
// 引入路由对象
import { createRouter, createWebHistory } from 'vue-router'
import Welcome from '../pages/welcome/Welcome.vue'
import MainPage from '../pages/mainPage/MainPage.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            name: 'welcome',
            path: '/welcome',
            component: Welcome
        },
        {
            name: 'mainPage',
            path: '/mainPage',
            component: MainPage
        },
        {
            path: '/',
            redirect: '/welcome'
        }
    ]
})

export default router; // 确保这里只有分号，没有多余的 \n 字符