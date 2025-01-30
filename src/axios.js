import axios from "axios";

const instance = axios.create({
  baseURL: "https://alex.polan.sk/usa-geo-games/",
  timeout: 10000,
});

export default instance;