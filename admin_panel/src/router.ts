import Vue from "vue";
import Router from "vue-router";
import Login from "./views/Login.vue";
import Panel from "./views/Panel.vue";
import Dashboard from "./views/Dashboard.vue";
import Editor from "./views/Editor.vue";
import store from "./store";

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
      name: "panel",
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
          path: 'editor',
          name: "editor",
          component: Editor
        },
      ]
    },
  ]
});

router.beforeEach((to:any, from: any, next: any) => {
  if (to.matched.some((record: any) => record.meta.requiresAuth)) {
    if(store.getters.isloggedIn) {
      return next();
    }
    return next('/login')
  }

  next();
});


export default router;
