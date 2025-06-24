const http = require('http');
const express = require('express');

const app = express();

app.get('/', (req, res) => {
    return res.send("Hola from Home Page");
});

app.get('/about', (req, res) => {
    return res.send(`Hola ${req.query.myname}`);
});

const myServer = http.createServer(app);

myServer.listen(8000, () => console.log("Server Started !! Running on port 8000")); 
