import { createWebHistory, createRouter } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    }
]

const routerHistory = createWebHistory(process.env.BASE_URL);

const router = createRouter({
    history: routerHistory,
    routes: routes
});

export default router;
