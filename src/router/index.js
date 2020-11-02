import { createWebHistory, createRouter } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/Zneyk',
        name: 'Zneyk game',
        component: () => import("../views/Zneyk.vue")
    },
    {
        path: '/Zhips',
        name: 'Zhips game',
        component: () => import('../views/Zhips.vue')
    },
    {
        path: '/Aidl',
        name: 'Aidl Adventure',
        component: () => import('../views/Aidl/Main.vue'),
        redirect: '/Aidl/adventure',
        children: [
            {
                path: 'adventure',
                name: 'Adventure',
                component: () => import('../views/Aidl/Adventure.vue'),
            },
            {
                path: 'char',
                name: 'Character',
                component: () => import('../views/Aidl/Character.vue')
            },
            {
                path: 'shop',
                name: 'Shop',
                component: () => import('../views/Aidl/Shop.vue'),
            }
        ]
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'Not Found',
        component: () => import("../views/NotFound.vue")
    }
]

const routerHistory = createWebHistory(process.env.BASE_URL);

const router = createRouter({
    history: routerHistory,
    routes: routes
});

export default router;
