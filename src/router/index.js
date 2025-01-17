import { createRouter, createWebHistory } from "vue-router"; // Vue 3 syntax
import Login from "../views/Login.vue";
import Dashboard from "../views/Dashboard.vue";

const routes = [
  {
    path: "/",
    name: "login",
    component: Login,
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: Dashboard,
    beforeEnter: (to, from, next) => {
      // Protect the route
      const token = localStorage.getItem("jwtToken");
      if (token) {
        next();
      } else {
        next({ name: "login" });
      }
    },
  },
];

const router = createRouter({
  history: createWebHistory(), // Uses history mode for clean URLs
  routes,
});

export default router;
