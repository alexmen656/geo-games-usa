<template>
  <div class="start-view">
    <div class="container">
      <h1 class="welcome-text">Welcome to GeoGames USA!</h1>
      <form @submit.prevent="submitUsername" class="form-container">
        <input
          type="text"
          v-model="username"
          placeholder="Enter your username"
          class="username-input"
        />
        <div class="avatar-selection">
          <h3>Select Your Avatar</h3>
          <div class="avatars">
            <img
              v-for="(avatar, index) in avatars"
              :key="index"
              :src="'https://alex.polan.sk/usa-geo-games/avatar/' + avatar"
              :alt="'Avatar ' + (index + 1)"
              :class="{ selected: selectedAvatar === avatar }"
              @click="selectAvatar(avatar)"
            />
          </div>
        </div>
        <button type="submit" class="submit-button">
          <strong>Start</strong>
        </button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: "",
      avatars: [
        "avatar1.png",
        "avatar2.png",
        "avatar3.png",
        "avatar4.png",
        "avatar5.png",
        "avatar6.png",
        "avatar8.png",
      ],
      selectedAvatar: null,
    };
  },
  methods: {
    selectAvatar(avatar) {
      this.selectedAvatar = avatar;
    },
    async submitUsername() {
      if (this.username.trim()) {
        if (this.selectedAvatar === null) {
          alert("Please select an avatar!");
          return;
        }
        try {
          const response = await this.$axios.post("leaderboard.php", {
            action: "register",
            name: this.username,
            avatar: this.selectedAvatar,
          });

          if (response.data.success) {
            localStorage.setItem("verification_id", response.data.uuid);
            localStorage.setItem("username", this.username);
            this.$router.push("/game-selection");
          } else {
            alert(`Error: ${response.data.error}`);
          }
        } catch (error) {
          alert("An error occurred while registering. Please try again.");
        }
      } else {
        alert("Please enter a username!");
      }
    },
  },
};
</script>

<style>
.start-view {
  position: relative;
  background-image: url("@/assets/bg.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: white;
  overflow: hidden;
}

.start-view::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.55); /* Semi-transparent overlay */
  z-index: 1;
}

.start-view > * {
  position: relative;
  z-index: 2;
}

.welcome-text {
  padding: 10px 20px;
  font-size: 36px;
  margin-bottom: 20px;
}

.form-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.username-input,
.submit-button {
  width: 400px;
  padding: 10px;
  margin: 10px 0;
  border-radius: 4px;
  border: none;
}

.username-input {
  font-size: 20px;
  margin-bottom: 0;
}

.submit-button {
  background-color: #000000;
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-button:hover {
  background-color: #0056b3;
}

.container {
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 32px;
  padding: 20px;
}

.avatar-selection {
  text-align: center;
  margin-bottom: 20px;
  margin-top: 20px;
}

.avatars {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.avatars img {
  width: 50px;
  height: 50px;
  cursor: pointer;
  border: 2px solid transparent;
  border-radius: 50%;
}

.avatars img.selected {
  border-color: #007bff;
}
</style>
