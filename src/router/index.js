import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes = [  
  {
    path: "/login",
    name: "Login",
    meta: { layout: "blank" },
    component: () => import("../views/Login.vue"),
  },
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: { requireAuth: true },
  },
  {
    path: "/user",
    name: "Users",
    component: () => import("../views/Users.vue"),
    meta: {
      requireAuth: true,
    },
  },
];

const router = new VueRouter({
  mode: "hash",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requireAuth)) {
    if (localStorage.getItem("user_id") == null) {
      next({
        name: "Login",
      });
    } else {
      next();
    }
  } else {
    next();
  }
});
export default router;
