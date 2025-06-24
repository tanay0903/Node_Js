const http = require('http');
const fs = require('fs');
const url = require('url');

const myServer = http.createServer((req, res) => {
    const log = `${Date.now()}: ${req.method} ${req.url} New request received\n`;
    const myUrl = url.parse(req.url, true);
    fs.appendFile('log.txt', log , (err, data) =>{
        switch(myUrl.pathname){
            case '/': 
            if (req.method === "GET") res.end("Home   Page");
                break;
            case '/about':
                //example: /about?myname=TanayKumar&userId=1&search=dog
                const username = myUrl.query.myname;
                res.end(`hola, ${username}`);
                break;
            case "/search":
                //example: /search?search_query=javascript+nodejs+expressjs+reactjs
                const search = myUrl.query.search_query;
                res.end("Here are the results for your search: " + search);
            case '/signup':
                if (req.method === "GET") 
                    res.end("Sign_UP form");
                else if (req.method === "POST") {
                    res.end("Signup Successful");// DB query
                }
            default:
                res.end("404 Not Found");
        }
    });  
    
 });

 myServer.listen(8000, () => console.log("Server Started !! Running on port 8000")); 
