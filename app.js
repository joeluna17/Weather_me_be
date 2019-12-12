require('dotenv').config();
const express = require("express");
const http = require("http");
const socketiIo = require("socket.io");
const axios = require("axios");

const DS_API_KEY = process.env.DS_API_KEY

const PORT = process.env.PORT || 5000;
//import the routes
const routers = require("./index");

const app = express();
const server = http.createServer(app);

const io = socketiIo(server);
// use the routes

app.use(routers);

const getApiAndEmit = async socket => {
  console.log("trying to execute api call");
  try {
    const res = await axios.get(
      `https://api.darksky.net/forecast/${DS_API_KEY}/33.139080,-96.107239`
      /* {
                "method":"GET",
                "url":"https://community-open-weather-map.p.rapidapi.com/weather",
                "headers":{
                "content-type":"application/octet-stream",
                "x-rapidapi-host":"community-open-weather-map.p.rapidapi.com",
                "x-rapidapi-key":"8a4900c31emshcffb706c63f2ecfp121b1bjsn51422ab457f6"
                },"params":{
                "callback":"data",
                "id":"2172795",
                "units":"%22metric%22 or %22imperial%22",
                "mode":"xml%2C html",
                "q":"London%2Cuk"
                }
                } */
    );
    socket.emit("FromAPI", res.data);
  } catch (error) {
    console.log(`Error: ${error}`);
  }
};

io.on("connection", socket => {
  console.log("New Client Connected"),
    setInterval(() => getApiAndEmit(socket), 20000);

  socket.on("disconnect", () => {
    console.log("Client Has Disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`Majic man on Port: ${PORT}`);
});
