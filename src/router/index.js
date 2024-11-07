import { createRouter, createWebHistory } from 'vue-router';
import Home from '../components/Home.vue';

const routes = [
    { path: '/', component: Home },
    { path: '/dungeon-crawler', component: () => import('../components/dungeon-crawler/DungeonCrawler.vue') },
    { path: '/mystic-paths', component: () => import('../components/mystic-paths/MysticPaths.vue') },
    { path: '/dungeon-labyrinth', component: () => import('../components/dungeon-labyrinth/DungeonLabyrinth.vue') },
    { path: '/whack-a-mole', component: () => import('../components/whack-a-mole/WhackAMole.vue') },
    { path: '/droid-hacking', component: () => import('../components/droid-hacking/DroidHacking.vue') },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;