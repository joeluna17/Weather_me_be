const express = require('express');
const http = require('http');
const socketiIo = require('socket.io');
const axios = require('axios');

const DS_API_KEY = "3e8bbf8e4242e2bff31745a25fc6cddc"

const PORT = process.env.PORT || 5000;
//import the routes
const Router = require('./index');

const app = express();
// use the routes
app.use(Router);

const server = http.createServer(app);

const io = socketiIo(server);

const getApiAndEmit = async socket => {

    try {
        const res = await axios.get(
            `https://api.darksky.net/forecast/${DS_API_KEY}/37.8267,-122.4233`
        );
        socket.emit( "FromAPI", res.data.currently.temperature);
       }
        catch(error){
            console.log(`Error: ${error}`);
        };
    
}

io.on("connection", socket =>{
    console.log("New Client Connected"),
    setInterval( ()=> {
        getApiAndEmit(socket),10000 });

    socket.on("disconnect", () => {
        console.log("Client Has Disconnected");
    }) ; 
});

app.listen(PORT, ()=>{console.log(`Majic man on Port: ${PORT}`)})