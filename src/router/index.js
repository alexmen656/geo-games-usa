import { createRouter, createWebHistory } from "vue-router";
import GameView from "@/views/GameView.vue";
import GameView2 from "@/views/GameView2.vue";
import GameView3 from "@/views/GameView3.vue";
import MenuView from "@/views/MenuView.vue";
import StartView from "@/views/StartView.vue";

const routes = [
  {
    path: "/",
    name: "StartView",
    component: StartView,
  },
  {
    path: "/game-selection",
    name: "GameSelection",
    component: MenuView,
  },
  {
    path: "/game/1",
    name: "GameView",
    component: GameView,
  },
  {
    path: "/game/2",
    name: "GameView2",
    component: GameView2,
  },
  {
    path: "/game/3",
    name: "GameView3",
    component: GameView3,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
