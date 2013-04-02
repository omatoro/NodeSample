/*
 * hello, world
 * IPなど設定：http://testcording.com/?p=1164
 */
/*
 * パラメータ
 */
var IP_ADDRESS = "192.168.1.202";
var PORT       = 1337;

/*
 * モジュール読み込み
 */
var http = require("http");

/*
 * サーバの作成
 */
http.createServer(function (req, res) {
	// ヘッダーの送信 送信するデータのタイプはtext/plain
	res.writeHead(200, {"Content-Type": "text/plain"});
	// 中身の文字列を送信
	res.end("hello, world!\n");
}).listen(PORT, IP_ADDRESS);

/*
 * サーバ起動時に表示するログ(起動したことが分かりやすい)
 */
console.log("Server running at http://" + IP_ADDRESS + ":" + PORT + "/");