import { createRouter, createWebHistory } from 'vue-router';
import HomeView  from '../views/HomeView.vue'
import TeamsView from '../views/TeamsView.vue';
import PlayersView from '../views/PlayersView.vue';
import DreamTeamView from '../views/DreamTeamView.vue';

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
},
{
  path: "/my-team",
  name: "MyTeam",
  component: DreamTeamView,
}
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
