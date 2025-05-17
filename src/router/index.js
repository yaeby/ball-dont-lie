import { createRouter, createWebHistory } from 'vue-router';
import HomeView  from '../views/HomeView.vue'
import TeamsView from '../views/TeamsView.vue';
import PlayersView from '../views/PlayersView.vue';

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
},
{
  path: "/players",
  name: "Players",
  component: PlayersView,
}
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
