import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import MainLayout from '../views/MainLayout.vue';
import Dashboard from '../views/Dashboard.vue';
import GraphView from '../views/GraphView.vue';
import Visualizations from '../views/Visualizations.vue';
import ErrorLogs from '../views/ErrorLogs.vue';
import Alert from '../views/alert.vue';
import OEEValidation from '../components/OEEValidation.vue';
import AutomationModules from '../views/AutomationModules.vue';
import Profile from '../views/profile.vue';

const routes = [
  {
    path: '/',
    name: 'login',
    component: Login,
  },
  {
    path: '/app',
    component: MainLayout,
    children: [
      { path: 'dashboard', name: 'dashboard', component: Dashboard },
      { path: 'graphs', name: 'graphs', component: GraphView },
      { path: 'visualizations', name: 'visualizations', component: Visualizations },
      { path: 'error-logs', name: 'error-logs', component: ErrorLogs },
      { path: 'alert', name: 'alert', component: Alert },
      {path: 'oee-validation', name: 'oee-validation', component: OEEValidation},  
      {path: 'automation-modules', name: 'automation-modules', component: AutomationModules},
      {path: 'profile', name: 'profile', component: Profile}
    ],
    beforeEnter: (to, from, next) => {
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