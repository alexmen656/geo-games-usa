<template>
    <div class="menu-view">
      <header class="header">
        <h1>USA Geo Games</h1>
      </header>
      <div class="game-selection">
        <button @click="startGame('game/1')">Guess the Way</button>
        <button @click="startGame('/game/2')">Name All US States</button>
        <button @click="startGame('/game/3')">CityScope</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "MenuView",
    methods: {
      startGame(game) {
        this.$router.push(game);
      }
    }
  };
  </script>
  
  <style scoped>
  .menu-view {
    text-align: center;
    margin-top: 50px;
    font-family: 'Arial', sans-serif;
    background-color: #f0f8ff;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  .header {
    background-color: #4682b4;
    color: white;
    padding: 10px;
    border-radius: 10px;
    margin-bottom: 20px;
  }
  
  .game-selection {
    display: flex;
    justify-content: center;
    gap: 20px;
  }
  
  button {
    background-color: #4682b4;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  button:hover {
    background-color: #5a9bd4;
  }
  </style>