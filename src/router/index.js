// router/index.js
// 引入路由对象
import { createRouter, createWebHistory } from 'vue-router'
import Welcome from '../pages/welcome/Welcome.vue'
import MainPage from '../pages/mainPage/MainPage.vue'
import Auth from '../pages/auth/Auth.vue'
import UserManage from '../pages/userManage/userManage.vue'
import Resources from '../pages/resources/Resources.vue'
import KnowledgeCard from '../pages/knowledgeCard/KnowledgeCard.vue'

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
            name: 'userManage',
            path: '/userManage',
            component: UserManage
        },
        {
            name: 'auth',
            path: '/auth',
            component: Auth
        },
        {
            name: 'resources',
            path: '/resources',
            component: Resources
        },
        {
            name: 'knowledgeCard',
            path: '/knowledgeCard',
            component: KnowledgeCard
        },
        {
            path: '/',
            redirect: '/welcome'
        },
        
    ]
})

export default router; // 确保这里只有分号，没有多余的 \n 字符