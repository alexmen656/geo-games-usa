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
          <button @click="startGame(game.path)">Play</button>
          <button @click="showHowToPlay(game.id)">How to Play?</button>
        </div>
      </div>
    </div>
    <div v-if="activeTab === 'leaderboard'" class="leaderboard">
      <h2 class="leaderboard-heading">Leaderboard</h2>
      <div class="podium">
        <div v-if="leaderboard[1]" class="second">
          <div class="position podium-position">2.</div>
          <div class="name podium-name">{{ leaderboard[1].name }}</div>
          <div class="score">
            {{
              Number(leaderboard[1].score1) +
              Number(leaderboard[1].score2) +
              Number(leaderboard[1].score3)
            }}
          </div>
        </div>
        <div v-if="leaderboard[0]" class="first">
          <div class="position podium-position">1.</div>
          <div class="name podium-name">{{ leaderboard[0].name }}</div>
          <div class="score">
            {{
              Number(leaderboard[0].score1) +
              Number(leaderboard[0].score2) +
              Number(leaderboard[0].score3)
            }}
          </div>
        </div>
        <div v-if="leaderboard[2]" class="third">
          <div class="position podium-position">3.</div>
          <div class="name podium-name">{{ leaderboard[2].name }}</div>
          <div class="score">
            {{
              Number(leaderboard[2].score1) +
              Number(leaderboard[2].score2) +
              Number(leaderboard[2].score3)
            }}
          </div>
        </div>
      </div>
      <ul>
        <li class="l_li non-striped">
          <span class="place">Place</span><span>Name</span
          ><span class="score">G1 Score</span><span class="score">G2 Score</span
          ><span class="score">G3 Score</span
          ><span class="score">Total Score</span>
        </li>

        <li class="l_li first-place">
          <span class="place"><img :src="'https://alex.polan.sk/usa-geo-games/avatar/'+leaderboard[0].avatar"> 1. Place</span>
          <span class="player-name">{{ leaderboard[0].name }}</span>
          <span class="score">{{ leaderboard[0].score1 ?? 0 }}</span>
          <span class="score">{{ leaderboard[0].score2 ?? 0 }}</span>
          <span class="score">{{ leaderboard[0].score3 ?? 0 }}</span>
          <span class="score">{{
            Number(leaderboard[0].score1) +
              Number(leaderboard[0].score2) +
              Number(leaderboard[0].score3) ?? 0
          }}</span>
        </li>

        <li class="l_li second-place">
          <span class="place"><img :src="'https://alex.polan.sk/usa-geo-games/avatar/'+leaderboard[1].avatar"> 2. Place</span>
          <span class="player-name">{{ leaderboard[1].name }}</span>
          <span class="score">{{ leaderboard[1].score1 ?? 0 }}</span>
          <span class="score">{{ leaderboard[1].score2 ?? 0 }}</span>
          <span class="score">{{ leaderboard[1].score3 ?? 0 }}</span>
          <span class="score">{{
            Number(leaderboard[1].score1) +
              Number(leaderboard[1].score2) +
              Number(leaderboard[1].score3) ?? 0
          }}</span>
        </li>

        <li class="l_li third-place">
          <span class="place"><img :src="'https://alex.polan.sk/usa-geo-games/avatar/'+leaderboard[2].avatar"> 3. Place</span>
          <span class="player-name">{{ leaderboard[2].name }}</span>
          <span class="score">{{ leaderboard[2].score1 ?? 0 }}</span>
          <span class="score">{{ leaderboard[2].score2 ?? 0 }}</span>
          <span class="score">{{ leaderboard[2].score3 ?? 0 }}</span>
          <span class="score">{{
            Number(leaderboard[2].score1) +
              Number(leaderboard[2].score2) +
              Number(leaderboard[2].score3) ?? 0
          }}</span>
        </li>

        <li
          v-for="(player, index) in leaderboard.slice(3)"
          :key="player.name"
          :class="{
            striped: index % 2 === 0,
            'non-striped': index % 2 !== 0,
          }"
          class="l_li"
        >
          <span class="place"><img :src="'https://alex.polan.sk/usa-geo-games/avatar/'+player.avatar"> {{ index + 4 }}. Place</span>
          <span class="player-name"
            > {{ player.name
            }}<!--:--></span
          >
          <span class="score">{{ player.score1 ?? 0 }}</span>
          <span class="score">{{ player.score2 ?? 0 }}</span>
          <span class="score">{{ player.score3 ?? 0 }}</span>
          <span class="score">{{
            Number(player.score1) +
              Number(player.score2) +
              Number(player.score3) ?? 0
          }}</span>
        </li>
      </ul>
    </div>
    <MenuFooter />
    <div v-if="howToPlayModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="howToPlayModal = false">&times;</span>
        <h2>
          How to play
          {{
            games.filter(
              (game) => String(game.id) === String(this.howToPlayModal_Game)
            )[0]?.name
          }}?
        </h2>

        <div
          v-html="
            games.filter(
              (game) => String(game.id) === String(this.howToPlayModal_Game)
            )[0]?.tutorial
          "
        ></div>
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
      howToPlayModal_Game: "game1",
      activeTab: "games",
      games: [
        {
          id: "game1",
          name: "Guess the Way",
          tutorial: `<p>In this game, you get two countries, and your job is to guess other countries that connect them by sharing borders. Each country you guess has to touch the previous one, like building a chain. If you guess a country that's not in the chain, it won't help you connect the two countries. They are harder and easier levels so reload with the button if it is to hard for you!</p>`,
          path: "game/1",
          image: "https://alex.polan.sk/usa-geo-games/assets/game1.jpg",
        },
        {
          id: "game2",
          name: "Name All US States",
          tutorial: `<p>In this game, you must name as many us states as possible within 90
      seconds. If you misspell a state's name, it won't be accepted, so be
      careful with your spelling! The timer starts as soon as you enter the
      first state!</p>`,
          path: "game/2",
          image: "https://alex.polan.sk/usa-geo-games/assets/game2.jpg",
        },
        {
          id: "game3",
          name: "CityScope",
          tutorial: ` <p>
          Welcome to <strong>CityScope</strong>! This game is designed to
          test your knowledge of cities in the USA. Your goal is to guess the
          location of a randomly selected city on the map. However, your guess
          isn't just a single point—it's a <strong>radius</strong> that you
          place on the map. If the city falls within the radius, you score
          points!
        </p>
        <p>Follow these steps to play:</p>
        <ol>
          <li>Register with a username and select a difficulty level.</li>
          <li>A random US city will be displayed.</li>
          <li>
            Use <strong>Shift + Click</strong> on the map to place your guess,
            which includes a <strong>radius</strong> representing your estimate.
            While holding <strong>Shift</strong>, you can move your mouse to
            preview the size of the radius before finalizing your guess.
          </li>
          <li>Submit your guess and see your score.</li>
          <li>
            Check the leaderboard to see how you rank against other players.
          </li>
        </ol>
        <p>
          The difficulty levels determine how close your guess (radius) needs to
          be:
        </p>
        <ul>
          <li>
            <strong>Very Easy</strong>: City must be within a 1500 km radius - 1
            Point
          </li>
          <li>
            <strong>Easy</strong>: City must be within a 1200 km radius - 2
            Points
          </li>
          <li>
            <strong>Medium</strong>: City must be within a 1000 km radius - 3
            Points
          </li>
          <li>
            <strong>Hard</strong>: City must be within a 500 km radius - 5
            Points
          </li>
          <li>
            <strong>Very Hard</strong>: City must be within a 250 km radius - 10
            Points
          </li>
        </ul>
        <p>Ready to test your geography skills? Good luck, and have fun!</p>`,
          path: "game/3",
          image: "https://alex.polan.sk/usa-geo-games/assets/game3.jpg",
        },
      ],
      leaderboard: [],
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
  /*height: 200px;*/
  aspect-ratio: 16/8;
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
  display: flex;
  flex-direction: column;
  align-items: center;
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
  /* margin-top: 10px; */
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
/*
.l_li > .score {
  text-align: end;
}

.l_li > .place {
  text-align: start;
}
*/
.l_li.striped {
  background-color: rgb(70, 69, 69);
}

.l_li.non-striped {
  background-color: black;
}

ul {
  margin: 0;
  padding: 10px;
  width: 60%;
  /*transform: translateX(30%);*/
}

.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  z-index: 1005;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);
}

.modal-content {
  background-color: #fefefe;
  margin: auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
  max-width: 500px;
  border-radius: 10px;
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}

/*
.player-name {
  text-align: start !important;
}
  */

.podium-position,
.podium-name {
  font-weight: 900;
}

.podium-name {
  font-size: 24px;
}

.podium-position {
  font-size: 32px;
}

h2.leaderboard-heading {
  font-size: 48px;
  margin-top: 0;
}

.l_li.first-place {
  background-color: gold;
}

.l_li.second-place {
  background-color: silver;
}

.l_li.third-place {
  background-color: #cd7f32;
}

.place > img{
  height: 16px;
  aspect-ratio: 1/1;
  border-radius: 50%;
  margin-right: 10px;
}
</style>
