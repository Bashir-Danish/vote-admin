import { createRouter, createWebHashHistory } from "vue-router";
import Login from "../views/Login.vue";
import MainView from "../views/MainView.vue";
import Dashboard from "../views/main/Dashboard.vue";
import Management from "../views/main/Management.vue";
import Comments from "../views/main/NewComments.vue";
import Polls from "../views/main/Polls.vue";
import Posts from "../views/main/Posts.vue";
import Settings from "../views/main/Settings.vue";
import Users from "../views/main/Users.vue";
import UsersPosts from "../views/main/UsersPosts.vue";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      component: MainView,
      children: [
        {
          path: "/",
          name: "dashboard",
          component: Dashboard,
        },
        {
          path: "/posts",
          name: "posts",
          component: Posts,
        },
        {
          path: "/userPosts",
          name: "userPosts",
          component: UsersPosts,
        },
        {
          path: "/polls",
          name: "polls",
          component: Polls,
        },
        {
          path: "/users",
          name: "users",
          component: Users,
        },
        {
          path: "/management",
          name: "management",
          component: Management,
        },
        {
          path: "/comments",
          name: "comments",
          component: Comments,
        },
        {
          path: "/settings",
          name: "settings",
          component: Settings,
        },
      ],
    },
    {
      path: "/login",
      name: "login",
      component: Login,
    },
  ],
});

export default router;
