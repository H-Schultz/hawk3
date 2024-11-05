import { createRouter, createWebHistory } from 'vue-router';
import Home from '../components/Home.vue';
import DungeonCrawler from '../components/dungeon-crawler/DungeonCrawler.vue';

const routes = [
    { path: '/', component: Home },
    { path: '/dungeon-crawler', component: DungeonCrawler },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;