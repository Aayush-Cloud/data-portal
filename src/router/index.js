import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import MainLayout from '../views/MainLayout.vue'; // Parent layout component
import Dashboard from '../views/Dashboard.vue';
import GraphView from '../views/GraphView.vue';
import Visualizations from '../views/Visualizations.vue';

const routes = [
  {
    path: '/',
    name: 'login',
    component: Login,
  },
  {
    path: '/app',
    component: MainLayout, // Use MainLayout as the parent route
    children: [
      { path: 'dashboard', name: 'dashboard', component: Dashboard },
      { path: 'graphs', name: 'graphs', component: GraphView },
      { path: 'visualizations', name: 'graphs', component: Visualizations },
      // Add other routes here
    ],
    beforeEnter: (to, from, next) => {
      // Protect the parent route and all its children
      const token = localStorage.getItem('jwtToken');
      if (token) {
        next();
      } else {
        next({ name: 'login' });
      }
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;