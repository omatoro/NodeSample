/*
 * hello, world
 * IPなど設定：http://testcording.com/?p=1164
 */
/*
 * モジュール読み込み
 */
var http = require("http");
var socketio = require("socket.io");
var setting = require("/home/virtualserver/デスクトップ/project/NodeSample/001/999_param.js");

/*
 * サーバの作成
 */
var server = http.createServer();

/*
 * requestイベント受信時の処理(イベントハンドラ)を作成する
 */
server.on("request", function(req, res) {
	// HTTPレスポンスヘッダを作成
	res.writeHead(200, {"Content-Type": "text/html"});
	var link = "http://" + setting.IP + ":" + setting.PORT + "/socket.io/socket.io.js";
	res.write("トップページです。<br />");
	res.write('クライアント用のsocket.ioへアクセスするには、<a href="' + link + '">' + link + '</a>にアクセスしてください。<br />');
	res.write("このJavaScriptライブラリを利用することで、socket.ioを利用した相互通信が出来るようになります。<br />");

	// レスポンスを終了する
	res.end();
});

/*
 * socket.ioを利用する
 */
var io = socketio.listen(server);

/*
 * イベント待受状態を開始する
 */
server.listen(setting.PORT, setting.IP);

/*
 * サーバ起動時に表示するログ(起動したことが分かりやすい)
 */
console.log("Server running at http://" + setting.IP + ":" + setting.PORT + "/");
console.log("サーバを終了する際は[ctrl + c]を押してください");