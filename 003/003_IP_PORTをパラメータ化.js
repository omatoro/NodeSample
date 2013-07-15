/*
 * hello, world
 * IPなど設定：http://testcording.com/?p=1164
 */

var IP_ADDRESS = "localhost";
var PORT       = 1337;

var http = require("http");
http.createServer(function (req, res) {
	res.writeHead(200, {"Content-Type": "text/plain"});
	res.end("hello, world!\n");
}).listen(PORT, IP_ADDRESS);

console.log("Server running at http://" + IP_ADDRESS + ":" + PORT + "/");