<template>
  <div class="menu-view">
    <div class="overlay"></div>
    <header class="header">
      <h1>USA Geo Games</h1>
    </header>
    <div class="game-selection">
      <div class="game-card" v-for="game in games" :key="game.id">
        <div class="game-image-container">
          <img :src="game.image" :alt="game.name" class="game-image">
        </div>
        <div class="game-info">
          <button @click="startGame(game.path)">{{ game.name }}</button>
          <button @click="showHowToPlay(game.id)">How to Play</button>
        </div>
      </div>
    </div>
    <div class="leaderboard">
      <h2>Leaderboard</h2>
      <div class="podium">
        <div class="podium-spot second">
          <div class="podium-rank">2</div>
          <div class="podium-name">Player 2</div>
        </div>
        <div class="podium-spot first">
          <div class="podium-rank">1</div>
          <div class="podium-name">Player 1</div>
        </div>
        <div class="podium-spot third">
          <div class="podium-rank">3</div>
          <div class="podium-name">Player 3</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MenuView",
  data() {
    return {
      games: [
        { id: 'game1', name: 'Guess the Way', path: 'game/1', image: '@/assets/game1.jpg' },
        { id: 'game2', name: 'Name All US States', path: 'game/2', image: '@/assets/game2.jpg' },
        { id: 'game3', name: 'CityScope', path: 'game/3', image: '@/assets/game3.jpg' }
      ]
    };
  },
  methods: {
    startGame(game) {
      this.$router.push(game);
    },
    showHowToPlay(game) {
      this.$router.push(`/how-to-play/${game}`);
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');

.menu-view {
  text-align: center;
  font-family: 'Roboto', sans-serif;
  background: url('@/assets/bg.jpg') no-repeat center center fixed;
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
  border-radius: 8px;
  padding: 10px;
  margin: 10px;
  width: 250px;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s, box-shadow 0.3s;
  position: relative;
  overflow: hidden;
}

.game-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.5);
}

.game-image-container {
  height: 150px;
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
  margin-top: 10px;
}

button {
  display: block;
  width: 100%;
  margin: 5px 0;
  padding: 10px;
  font-size: 16px;
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
</style>