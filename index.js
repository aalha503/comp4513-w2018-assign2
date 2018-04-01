var http = require('http');
http.createServer(function (req, res) {
  
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello World\n');
    
}).listen(process.env.PORT || 8080, function () {
    console.log("Running on", process.env.PORT + ":" + process.env.IP);
});