import { createRouter, createWebHistory  } from "vue-router"
import LaunchBoard from '../pages/LaunchBoard.vue'

const routes  = [
    { path: '/', name: 'launches', component: LaunchBoard },
    { path: '/about', name: 'about', component: () => import('../pages/AboutMe.vue') },
]


const router = createRouter({
    history: createWebHistory(),
   routes,
})

export default router


