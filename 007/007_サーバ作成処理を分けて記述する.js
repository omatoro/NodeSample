/*
 * hello, world
 * IPなど設定：http://testcording.com/?p=1164
 */
/*
 * パラメータ
 */
var IP_ADDRESS = "localhost";
var PORT       = 1337;

/*
 * モジュール読み込み
 */
var http = require("http");

/*
 * サーバの作成
 */
var server = http.createServer();

/*
 * requestイベント受信時の処理(イベントハンドラ)を作成する
 */
server.on("request", function(req, res) {
	// リクエストされたURLをログに表示(ブラウザからアクセスされるたびにコンソールへ出力する)
	console.log(req.url);
	// ヘッダーの送信 送信するデータのタイプはtext/plain
	res.writeHead(200, {"Content-Type": "text/plain"});
	// 中身の文字列を送信
	res.end("hello, world! : URL " + req.url);
});

/*
 * イベント待受状態を開始する
 */
server.listen(PORT, IP_ADDRESS);

/*
 * サーバ起動時に表示するログ(起動したことが分かりやすい)
 */
console.log("Server running at http://" + IP_ADDRESS + ":" + PORT + "/");