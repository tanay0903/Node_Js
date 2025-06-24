const http = require('http');
const fs = require('fs');

const myServer = http.createServer((req, res) => {
    const log = `${Date.now()}: ${req.url} New request received\n`;
    fs.appendFile('log.txt', log , (err, data) =>{
        switch(req.url){
            case '/': res.end("HomePage");
                break;
            case '/about': res.end("I am the server created by me");
                break;
            default:
                res.end("404 Not Found");
        }
    });  
    
 });

 myServer.listen(8000, () => console.log("Server Started !! Running on port 8000")); 
