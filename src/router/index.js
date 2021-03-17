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
        redirect: '/Aidl/Login',
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
            },
            {
                path: 'login',
                name: 'Login',
                component: () => import('../views/Aidl/Login.vue'),
            },
            {
                path: 'register',
                name: 'Register',
                component: () => import('../views/Aidl/Register.vue'),
            },
        ]
    },
    {
        path: '/Morz',
        name: 'Morz',
        component: () => import('../views/Morz/Main.vue'),
        redirect: '/Morz/morse',
        children: [
            {
                path: 'morse',
                name: 'Morse code',
                component: () => import('../views/Morz/Morse.vue'),
            },
            {
                path: 'learn',
                name: 'Learn',
                component: () => import('../views/Morz/Learn.vue'),
            },
            {
                path: 'listen',
                name: 'Listen',
                component: () => import('../views/Morz/Listen.vue')
            },
            {
                path: 'write',
                name: 'Write',
                component: () => import('../views/Morz/Write.vue'),
            }
        ]
    },
    {
        path: '/Pass',
        name: 'Password generator',
        component: () => import('../views/Pass.vue')
    },
    {
        path: '/Chat',
        name: 'Chat',
        component: () => import('../views/Chat/Chat.vue')
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
