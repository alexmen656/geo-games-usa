<template>
  <div class="menu-view">
    <div class="overlay"></div>
    <header class="header">
      <h1>USA Geo Games</h1>
      <div class="tabs">
        <button
          :class="{ active: activeTab === 'games' }"
          @click="activeTab = 'games'"
        >
          Games
        </button>
        <button
          :class="{ active: activeTab === 'leaderboard' }"
          @click="
            activeTab = 'leaderboard';
            fetchLeaderboard();
          "
        >
          Leaderboard
        </button>
      </div>
    </header>
    <div v-if="activeTab === 'games'" class="game-selection">
      <div class="game-card" v-for="game in games" :key="game.id">
        <div class="game-image-container">
          <img :src="game.image" :alt="game.name" class="game-image" />
        </div>
        <h2>{{ game.name }}</h2>
        <div class="game-info">
          <button @click="startGame(game.path)">Play →</button>
          <button @click="showHowToPlay(game.id)">How to Play?</button>
        </div>
      </div>
    </div>
    <div v-if="activeTab === 'leaderboard'" class="leaderboard">
      <h2>Leaderboard</h2>
      <div class="podium">
        <div v-if="leaderboard[1]" class="second">
          <div class="position">2.</div>
          <div class="name">{{ leaderboard[1].name }}</div>
          <div class="score">{{ leaderboard[1].score }}</div>
        </div>
        <div v-if="leaderboard[0]" class="first">
          <div class="position">1.</div>
          <div class="name">{{ leaderboard[0].name }}</div>
          <div class="score">{{ leaderboard[0].score }}</div>
        </div>
        <div v-if="leaderboard[2]" class="third">
          <div class="position">3.</div>
          <div class="name">{{ leaderboard[2].name }}</div>
          <div class="score">{{ leaderboard[2].score }}</div>
        </div>
      </div>
      <ul>
        <li
          v-for="(player, index) in leaderboard.slice(3)"
          :key="player.name"
          :class="{
            striped: index % 2 === 0,
            'non-striped': index % 2 !== 0,
          }"
          class="l_li"
        >
          <span class="place">{{ index + 4 }}. Place</span>
          <span
            >{{ player.name
            }}<!--:--></span
          >
          <span class="score">{{ player.score }}</span>
        </li>
      </ul>
    </div>
    <MenuFooter />
    <div v-if="howToPlayModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="showLeaderboard = false">&times;</span>
        <h2>Leaderboard</h2>

        rškk
      </div>
    </div>
  </div>
</template>

<script>
import MenuFooter from "@/components/MenuFooter.vue";

export default {
  name: "MenuView",
  components: {
    MenuFooter,
  },
  data() {
    return {
      howToPlayModal: false,
      activeTab: "games",
      games: [
        {
          id: "game1",
          name: "Guess the Way",
          tutorial: "",
          path: "game/1",
          image: "https://alex.polan.sk/usa-geo-games/assets/game1.jpg",
        },
        {
          id: "game2",
          name: "Name All US States",
          tutorial: "",
          path: "game/2",
          image: "https://alex.polan.sk/usa-geo-games/assets/game2.jpg",
        },
        {
          id: "game3",
          name: "CityScope",
          tutorial: "",
          path: "game/3",
          image: "https://alex.polan.sk/usa-geo-games/assets/game3.jpg",
        },
      ],
      leaderboard: [],
      howToPlayModal_Game: "game1",
    };
  },
  mounted() {
    this.fetchLeaderboard();
  },
  methods: {
    fetchLeaderboard() {
      this.$axios.get("leaderboard.php").then((response) => {
        this.leaderboard = response.data;
        console.log(this.leaderboard);
      });
    },
    startGame(game) {
      this.$router.push(game);
    },
    showHowToPlay(game) {
      //this.$router.push(`/how-to-play/${game}`);
      this.howToPlayModal = true;
      this.howToPlayModal_Game = game;
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap");

.menu-view {
  text-align: center;
  font-family: "Roboto", sans-serif;
  background: url("@/assets/bg.jpg") no-repeat center center fixed;
  background-size: cover;
  padding: 20px;
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  animation: fadeIn 1s ease-in-out;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.85);
  z-index: 1;
}

.header {
  margin-bottom: 20px;
  color: white;
  position: relative;
  z-index: 2;
}

.tabs {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

.tabs button {
  background: none;
  border: none;
  color: white;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 18px;
  transition: background-color 0.3s;
  margin-right: 5px;
  margin-left: 5px;
  background-color: rgba(0, 0, 0, 0.5);
}

.tabs button.active {
  background-color: #ff5722;
  border-radius: 4px;
}

.tabs button:hover {
  background-color: #f67852;
}

.game-selection {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  position: relative;
  z-index: 2;
}

.game-card {
  background-color: rgba(0, 0, 0, 0.7);
  border: 1px solid #444;
  border-radius: 20px;
  padding: 10px;
  margin: 20px;
  width: 30%;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s, box-shadow 0.3s;
  position: relative;
  overflow: hidden;
}

.game-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.5);
}

.game-card h2 {
  color: white;
}
.game-image-container {
  height: 200px;
  overflow: hidden;
}

.game-image {
  width: 100%;
  height: auto;
  border-radius: 8px;
  transition: transform 0.3s;
}

.game-card:hover .game-image {
  transform: scale(1.1);
}

.game-info {
  margin-top: 20px;
}

button {
  display: block;
  width: 100%;
  margin: 10px 0;
  padding: 15px;
  font-size: 18px;
  cursor: pointer;
  border: none;
  border-radius: 4px;
  background-color: #ff5722;
  color: white;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #e64a19;
}

.leaderboard {
  margin-top: 40px;
  color: white;
  position: relative;
  z-index: 2;
}

.podium {
  display: flex;
  justify-content: center;
  align-items: flex-end;
}

.podium-spot {
  width: 100px;
  text-align: center;
  margin: 0 10px;
}

.podium-rank {
  background-color: #ff5722;
  color: white;
  padding: 10px;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
}

.podium-name {
  margin-top: 10px;
  font-weight: bold;
}

.first {
  height: 150px;
}

.second {
  height: 120px;
}

.third {
  height: 100px;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.podium {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  margin-bottom: 20px;
}

.podium > div {
  text-align: center;
  margin: 0 10px;
}

.first {
  order: 1;
  background-color: gold;
  padding: 10px;
  border-radius: 10px;
  height: 170px;
  width: 180px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.second {
  order: 0;
  background-color: silver;
  padding: 10px;
  border-radius: 10px;
  height: 130px;
  width: 180px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.third {
  order: 2;
  background-color: #cd7f32;
  padding: 10px;
  border-radius: 10px;
  height: 100px;
  width: 180px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.l_li {
  display: flex;
  /*justify-content: space-between;*/
  padding: 5px;
}

.l_li > span {
  flex: 1;
  text-align: center;
}

.l_li > .score {
  text-align: end;
}

.l_li > .place {
  text-align: start;
}

.l_li.striped {
  background-color: rgb(70, 69, 69);
}

.l_li.non-striped {
  background-color: black;
}

ul {
  margin: 0;
  padding: 10px;
  max-width: 50%;
  transform: translateX(50%);
}
</style>
