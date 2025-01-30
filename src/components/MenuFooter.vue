<template>
  <footer class="sticky-footer">
    <div class="user-profile">
      <img :src="user.avatar" alt="User Avatar" class="avatar" />
      <span class="user-name">{{ user.name }}</span>
    </div>
    <div class="github-link">
      <a href="https://github.com/alexmen656/geo-games-usa" target="_blank">GitHub</a>
    </div>
  </footer>
</template>
<script>
export default {
  name: "MenuFooter",
  data() {
    return {
      user: {
        name: localStorage.getItem("username") ?? "User",
        avatar: "https://alex.polan.sk/usa-geo-games/avatar/avatar4.png",
      },
    };
  },
  created() {
    if (localStorage.getItem("verification_id")) {
      //get user avatar
      this.$axios
        .get(
          "leaderboard.php?action=get_user&uuid=" +
            localStorage.getItem("verification_id")
        )
        .then((response) => {
          this.user.avatar = `https://alex.polan.sk/usa-geo-games/avatar/${response.data.data.avatar}`;
        });
    }
  },
};
</script>
<style scoped>
.sticky-footer {
  position: fixed;
  bottom: 0;
  right: 0;
  left: 0;
  background-color: transparent;
  display: flex;
  justify-content: space-between;
  padding: 10px;
  color: white;
  z-index: 1005;
  background-color: rgba(0, 0, 0, 0.7);
}

.user-profile {
  display: flex;
  align-items: center;
  font-size: 20px;
}

.avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 10px;
}

.github-link {
  display: flex;
  align-items: center;
  justify-content: center;
}

.github-link a {
  font-size: 20px;
  color: white;
  text-decoration: none;
}

.github-link a:hover {
  text-decoration: underline;
}
</style>
