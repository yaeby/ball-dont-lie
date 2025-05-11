import { createRouter, createWebHistory } from 'vue-router';
import HomeView  from '../views/HomeView.vue'
import TeamsView from '../views/TeamsView.vue';

const routes = [
{
  path: "/",
  name: "Home",
  component: HomeView,
},
{
  path: "/teams",
  name: "Teams",
  component: TeamsView,
}
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
