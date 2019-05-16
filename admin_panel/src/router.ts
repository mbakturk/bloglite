import Vue from "vue";
import Router from "vue-router";
import Login from "./views/Login.vue";
import Panel from "./views/Panel.vue";
import Dashboard from "./views/Dashboard.vue";
import Editor from "./views/Editor.vue";
import store from "./store";
import $http from "./http-client";

let isFirstLoad = true;

Vue.use(Router);
const router = new Router({
  routes: [
    {
      path: "/login",
      name: "login",
      component: Login,
      meta: {
        guest: true
      }
    },
    {
      path: "/",
      component: Panel,
      meta: {
        requiresAuth: true
      },
      children: [
        {
          path: '',
          name: "dashboard",
          component: Dashboard
        },
        {
          path: 'editor/:id?',
          name: "editor",
          component: Editor
        },
      ]
    },
  ]
});

const guard = (to: any, from: any, next: any) => {

  if (isFirstLoad) {
    $http.post("heartbeat").then(resp => {
      if (resp.data.retCode === 0) {
        store.dispatch("logIn");
      }
      guard(to, from, next);
    }).catch(err => {
      guard(to, from, next);
    });
    isFirstLoad = false;
    return;
  }

  if (to.matched.some((record: any) => record.meta.requiresAuth)) {
    if (store.getters.isloggedIn) {
      return next();
    }
    return next('/login')
  }

  next();
}

router.beforeEach(guard);

export default router;
