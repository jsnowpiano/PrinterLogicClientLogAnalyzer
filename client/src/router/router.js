// filepath: c:\Users\Jordan\Documents\PrinterLogicClientLogAnalyzer\client\src\router\router.js
import { createRouter, createWebHistory } from 'vue-router';
import Home from '../components/Home.vue';
import Analyze from '../components/Analyze.vue';
import Articles from '../components/Articles.vue';
import Updates from '@/components/Updates.vue';

const routes = [
  { path: '/PrinterLogicClientLogAnalyzerClient/', component: Home },
  { path: '/PrinterLogicClientLogAnalyzerClient/analyze', component: Analyze },
  { path: '/PrinterLogicClientLogAnalyzerClient/articles', component: Articles },
  { path: '/PrinterLogicClientLogAnalyzerClient/updates', component: Updates}
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;