const http = require('http');
const fs = require('fs');

const myServer = http.createServer((req, res) => {
    const log = `${new Date().toISOString()} - ${req.method} ${req.url}\n`;
    fs.appendFile('server.log', log, (err) => {
        switch (req.url){
            case '/':
                res.end('Welcome to the server!\n');
                break;
            case '/about':
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end('I am Tanay Kumar building a http server with Node.js\n');
                break;
            default:
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('404 Not Found\n');
                }
            });
        });