<template>
  <header class="app-header">
    <h1>Name all states of the USA!</h1>
    <p class="app-description">
      In this game, you must name as many us states as possible within 90
      seconds. If you misspell a state's name, it won't be accepted, so be
      careful with your spelling! The timer starts as soon as you enter the
      first state!
    </p>
  </header>
  <div id="map" style="width: 100%; height: 100vh"></div>
  <div id="floating-input">
    <form @submit.prevent="submitCountrie">
      <input
        type="text"
        v-model="country"
        placeholder="Enter country name and press Enter"
      />
    </form>
    <!-- <span @click="fetchLeaderboard" class="leaderboard-link">Leaderboard</span> -->
  </div>

  <div :class="['counter', timerColor]">{{ minutes }}:{{ seconds }}</div>
  <!--<div class="leaderboard-button" @click="fetchLeaderboard">Leaderboard</div>-->
  <div class="guessed-countries">
    <h3>Guessed States</h3>
    <ul>
      <li v-if="guessedCountries.length === 0">
        You haven't guessed any state yet
      </li>
      <li v-for="(country, index) in guessedCountries" :key="index">
        {{ formatForDisplay(country) }}
      </li>
    </ul>
  </div>

  <div v-if="showModal" class="modal">
    <div class="modal-content">
      <span class="close" @click="showModal = false">&times;</span>
      <h2>Times over!</h2>
      <p>
        The time is over you guessed {{ guessedCountries.length }} in total.
        Thats better than
        <span :class="percentageClass">{{ percentage }}%</span> of other
        players.
      </p>
     <!-- <span @click="fetchLeaderboard" class="leaderboard-link"
        >Leaderboard</span
      >-->
      <button @click="reloadGame">Play Again</button>
    </div>
  </div>

 <!-- <div v-if="showLeaderboard" class="modal2">
    <div class="modal-content2">
      <span class="close" @click="showLeaderboard = false">&times;</span>
      <h2>Leaderboard</h2>
      <div class="podium">
        <div v-if="leaderboard[1]" class="second">
          <div class="position">2.</div>
          <div class="name">{{ leaderboard[1].name }}</div>
          <div class="score">{{ leaderboard[1].count }}</div>
        </div>
        <div v-if="leaderboard[0]" class="first">
          <div class="position">1.</div>
          <div class="name">{{ leaderboard[0].name }}</div>
          <div class="score">{{ leaderboard[0].count }}</div>
        </div>
        <div v-if="leaderboard[2]" class="third">
          <div class="position">3.</div>
          <div class="name">{{ leaderboard[2].name }}</div>
          <div class="score">{{ leaderboard[2].count }}</div>
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
            }}--:--</span
          >
          <span class="score">{{ player.count }}</span>
        </li>
      </ul>
    </div>
  </div>-->
</template>

<script>
import { shallowRef } from "vue";
import { formatCountryName, isValidCountry } from "../getStates.js";

export default {
  name: "App",
  data() {
    return {
      map: shallowRef(null),
      geojson: [],
      guessedCountries: [],
      country: "",
      showOutline: true,
      showModal: false,
      timeLeft: 90, //90,
      leaderboard: [],
      showLeaderboard: false,
      percentage: 20,
      timeOver: false,
    };
  },
  computed: {
    formatForDisplay() {
      return (country) => {
        return country
          .split(/_| /)
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
      };
    },
    percentageClass() {
      if (this.percentage >= 90) {
        return "high-percentage";
      } else if (this.percentage >= 50) {
        return "medium-percentage";
      } else {
        return "low-percentage";
      }
    },
    minutes() {
      return Math.floor(this.timeLeft / 60);
    },
    seconds() {
      return this.timeLeft % 60 < 10
        ? "0" + (this.timeLeft % 60)
        : this.timeLeft % 60;
    },
    timerColor() {
      if (this.timeLeft < 10) {
        return "red";
      } else if (this.timeLeft < 30) {
        return "orange";
      } else {
        return "";
      }
    },
  },
  async mounted() {
    if (!localStorage.getItem("verification_id")) {
      this.$router.push("/");
    }

    await this.initMap();
  },
  methods: {
    /*fetchLeaderboard() {
      this.$axios("leaderboard.php").then((response) => {
        this.leaderboard = response.data;
        this.showLeaderboard = true;
      });
    },*/
    startCountdown() {
      const countdown = setInterval(async () => {
        if (this.timeLeft > 0) {
          this.timeLeft--;
        } else {
          clearInterval(countdown);
          await this.calculatePercentage();
          this.showModal = true;
          this.timeOver = true;
          this.$axios.post("leaderboard.php", {
            action: "update",
            uuid: localStorage.getItem("verification_id"),
            count: this.guessedCountries.length,
          });
        }
      }, 1000);
    },
    async initMap() {
      await window.mapkit.init({
        authorizationCallback: function (done) {
          fetch("https://alex.polan.sk/usa-geo-games/verify.php")
            .then((res) => res.text())
            .then(done);
        },
        language: "en",
      });

      const region = new window.mapkit.CoordinateRegion(
        new window.mapkit.Coordinate(38.6, -96.4),
        new window.mapkit.CoordinateSpan(30, 30)
      );

      const map = new window.mapkit.Map("map", {
        mapType: window.mapkit.Map.MapTypes.Satellite,
        center: new window.mapkit.Coordinate(25.0, 15.0),
        region: region,
      });
      map.showsCompass = window.mapkit.FeatureVisibility.Visible;
      this.map = map;

      let geoJSONParserDelegate = {
        itemForPolygon: (overlay) => {
          const strokeOpacity = this.showOutline ? 0.8 : 0;
          const lineWidth = this.showOutline ? 1 : 0;

          overlay.style = new window.mapkit.Style({
            strokeColor: "#000",
            strokeOpacity: strokeOpacity,
            lineWidth: lineWidth,
            fillOpacity: 0.8,
            fillColor: "#CACACA",
          });

          map.addOverlay(overlay);
          return overlay;
        },

        geoJSONDidComplete: function (result, geoJSON) {
          console.log("GeoJSONDelegate.geoJSONDidComplete");
          console.log(result);
          console.log(geoJSON);
        },
        geoJSONDidError: function (error, geoJSON) {
          console.log("GeoJSONDelegate.geoJSONDidError");
          console.log(error);
          console.log(geoJSON);
        },
      };

      if (this.geojson.length === 0) {
        this.$axios.get("game2/states.php").then((response) => {
          let data = response.data;
          this.geojson = JSON.parse(JSON.stringify(response.data));
          window.mapkit.importGeoJSON(data, geoJSONParserDelegate);
        });
      } else {
        const data2 = JSON.parse(JSON.stringify(this.geojson));
        let data = data2;
        data.features.forEach((feature) => {
          if (
            formatCountryName(feature.properties.NAME) ===
              formatCountryName(this.countryPair.from) ||
            formatCountryName(feature.properties.NAME) ===
              formatCountryName(this.countryPair.to)
          ) {
            feature.properties.count = 15;
          }
        });
        window.mapkit.importGeoJSON(data, geoJSONParserDelegate);
      }
    },
    submitCountrie() {
      if (!this.timeOver) {
        if (this.country.trim()) {
          if (isValidCountry(this.country)) {
            if (this.guessedCountries.length === 0) {
              this.startCountdown();
            }
            if (!this.guessedCountries.includes(this.country)) {
              this.guessedCountries.push(this.country);
              this.updateMap();
              this.country = "";
            }
          } else {
            alert(this.country + " is not a valid country name!");
          }
        } else {
          alert("Please enter a country name!");
        }
      }
    },
    updateMap() {
      console.log(1);
      let geoJSONParserDelegate = {
        itemForPolygon: (overlay) => {
          const strokeOpacity = this.showOutline ? 0.8 : 0;
          const lineWidth = this.showOutline ? 1 : 0;

          overlay.style = new window.mapkit.Style({
            strokeColor: "#000",
            strokeOpacity: strokeOpacity,
            lineWidth: lineWidth,
            fillOpacity: 0.8,
            fillColor: "#CACACA",
          });
          this.map.addOverlay(overlay);
          return overlay;
        },

        itemForFeature: (overlay, geoJSON) => {
          const isGuessed = geoJSON.properties.guessed;
          const fillColor = isGuessed ? "#008000" : "#CACACA";
          const strokeOpacity = this.showOutline ? 0.8 : 0;
          const lineWidth = this.showOutline ? 1 : 0;

          overlay.data = {
            name: geoJSON.properties.name,
            isGuessed: isGuessed,
          };

          overlay.style = new window.mapkit.Style({
            fillOpacity: 0.7,
            lineWidth: lineWidth,
            strokeOpacity: strokeOpacity,
            fillColor: fillColor,
          });

          return overlay;
        },

        geoJSONDidComplete: function (result, geoJSON) {
          console.log("GeoJSONDelegate.geoJSONDidComplete");
          console.log(result);
          console.log(geoJSON);
        },
        geoJSONDidError: function (error, geoJSON) {
          console.log("GeoJSONDelegate.geoJSONDidError");
          console.log(error);
          console.log(geoJSON);
        },
      };

      if (this.geojson.length === 0) {
        this.$axios.get("game2/states.php").then((response) => {
          this.geojson = JSON.parse(JSON.stringify(response.data));
          let data = response.data;
          data.features.forEach((feature) => {
            if (
              this.formatedGuessedCountries(this.guessedCountries).includes(
                formatCountryName(feature.properties.name)
              )
            ) {
              console.log(feature.properties.name + " is guessed!");
              feature.properties.guessed = true;
            }
          });

          this.map.overlays.forEach((overlay) =>
            this.map.removeOverlay(overlay)
          );
          window.mapkit.importGeoJSON(data, geoJSONParserDelegate);
        });
      } else {
        const data2 = JSON.parse(JSON.stringify(this.geojson));
        let data = data2;
        console.log(this.guessedCountries);
        data.features.forEach((feature) => {
          if (
            this.formatedGuessedCountries(this.guessedCountries).includes(
              formatCountryName(feature.properties.name)
            )
          ) {
            console.log(formatCountryName(feature.properties.name));

            console.log(feature.properties.name + " is guessed!");
            feature.properties.guessed = true;
          }
        });

        this.map.overlays.forEach((overlay) => this.map.removeOverlay(overlay));
        window.mapkit.importGeoJSON(data, geoJSONParserDelegate);
      }
    },
    reloadGame() {
      this.guessedCountries = [];
      this.timeLeft = 90;
      this.showModal = false;
      this.updateMap();
    },
    formatedGuessedCountries(countries) {
      return countries.map((country) => formatCountryName(country));
    },
    async calculatePercentage() {
      await this.$axios("leaderboard.php").then((response) => {
        const leaderboard = response.data;
        const playerCount = this.guessedCountries.length;
        const betterPlayers = leaderboard.filter(
          (player) => player.score2 < playerCount
        ).length;
        const totalPlayers = leaderboard.length;
        this.percentage = Math.round((betterPlayers / totalPlayers) * 100);
      });
    },
  },
};
</script>

<style scoped>
#map {
  width: 100%;
  height: 100%;
}

#map::before {
  content: "";
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  background: radial-gradient(
    circle,
    rgba(0, 0, 0, 0) 60%,
    rgba(0, 0, 0, 0.6) 100%
  );
  z-index: 1000;
}

#floating-input {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  text-align: center;
  background-color: rgba(255, 255, 255, 0.6);
  padding: 10px;
  border-radius: 24px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

#floating-input h1 {
  margin: 0 0 10px;
  font-size: 32px;
}

.outline-checkbox {
  margin-bottom: 10px;
}

.outline-checkbox label {
  font-size: 18px;
}

#floating-input input[type="text"] {
  width: 100%;
  padding: 15px;
  font-size: 20px;
  border: 2px solid #ccc;
  border-radius: 12px;
  box-sizing: border-box;
}

.app-header {
  text-align: center;
  margin: 0;
  z-index: 1001;
  position: absolute;
  background-color: transparent;
  text-align: center;
  justify-content: center;
  width: 100%;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0));
  margin-bottom: 10px;
}

.app-header h1 {
  font-size: 2em;
  color: #fff;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
  margin-bottom: 5px;
}

.app-description {
  font-size: 1.2em;
  color: #fff;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.8);
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.25;
  padding: 0 20px;
  margin-top: 5px;
}

#reload-button {
  position: absolute;
  top: 50%;
  right: 20px;
  transform: translateY(-50%);
  font-size: 50px;
  padding: 10px 25px;
  background-color: rgba(255, 255, 255, 0.6);
  color: black;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

#reload-button:hover {
  background-color: rgba(255, 255, 255, 0.8);
}

.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  z-index: 1;
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
  text-align: center;
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

.guessed-countries {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 200px;
  max-height: 300px;
  overflow-y: auto;
  background-color: rgba(255, 255, 255, 0.6);
  padding: 10px;
  border-radius: 24px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 1005;
}

.guessed-countries h3 {
  text-align: center;
  margin: 5px 0 10px 0;
}

.guessed-countries ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}
.guessed-countries li {
  margin: 5px 0;
}

.counter {
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: white;
  padding: 5px 10px;
  background-color: rgba(255, 255, 255, 0.6);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  font-size: 24px;
  z-index: 1005;
}

.counter.orange {
  color: rgb(255, 132, 0);
}

.counter.red {
  color: red;
}

#score {
  position: absolute;
  bottom: 10px;
  left: 10px;
}

.modal2 > button {
  position: absolute;
  bottom: 10px;
  right: 10px;
}

.modal2 {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 1010;
}

.modal-content2 {
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
  height: 130px;
  width: 140px;
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
  height: 100px;
  width: 140px;
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
  height: 80px;
  width: 140px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.position {
  font-size: 24px;
  font-weight: bold;
}

.name {
  font-size: 18px;
}

.score2,
.nextCity {
  font-size: 24px;
  color: white;
  background-color: rgba(0, 0, 0, 0.7);
  padding: 10px;
  border-radius: 5px;
}

.nextCity:focus,
.nextCity:focus-visible,
.difficulty {
  /*border: none !important;*/
  outline: none !important;
}

h2 {
  text-align: center;
  margin-top: 10px;
  padding-left: 18.5px;
}

.l_li {
  display: flex;
  /*justify-content: space-between;*/
  padding: 2px;
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
  background-color: #cdcdcd;
}

.l_li.non-striped {
  background-color: #ffffff;
}

ul {
  margin: 0;
  padding: 10px;
}

.high-percentage {
  color: green;
  font-weight: bold;
}
.medium-percentage {
  color: orange;
  font-weight: bold;
}
.low-percentage {
  color: red;
  font-weight: bold;
}

.guessed-countries li {
  background-color: rgba(255, 255, 255, 0.4);
  padding: 5px;
  border-radius: 5px;
  display: flex;
  justify-content: center;
}

.leaderboard-button {
  position: absolute;
  top: 10px;
  left: 89px;
  background-color: white;
  padding: 5px 10px;
  background-color: rgba(255, 255, 255, 0.6);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  font-size: 24px;
  z-index: 1005;
}
</style>
