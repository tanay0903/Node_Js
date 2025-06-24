const http = require('http');
const fs = require('fs');
const url = require('url');

const myServer = http.createServer((req, res) => {
    const log = `${Date.now()}: ${req.url} New request received\n`;
    const myUrl = url.parse(req.url, true);
    console.log(myUrl);
    fs.appendFile('log.txt', log , (err, data) =>{
        switch(myUrl.pathname){
            case '/': res.end("HomePage");
                break;
            case '/about':
                //about?myname=TanayKumar&userId=1&search=dog
                const username = myUrl.query.myname;
                res.end(`hola, ${username}`);
                break;
            case "/search":
                const search = myUrl.query.search_query;
                res.end("Here are the results for your search: " + search);
            default:
                res.end("404 Not Found");
        }
    });  
    
 });

 myServer.listen(8000, () => console.log("Server Started !! Running on port 8000")); 
