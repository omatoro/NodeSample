/*
 * hello, world
 * IPなど設定：http://testcording.com/?p=1164
 */
/*
 * モジュール読み込み
 */
var http = require("http");
var setting = require("/home/virtualserver/デスクトップ/project/009_param.js");

/*
 * サーバの作成
 */
var server = http.createServer();

/*
 * requestイベント受信時の処理(イベントハンドラ)を作成する
 * 1つのイベントに登録できるイベントハンドラは10個までに制限されている
 */
server.on("request", function(req, res) {
	// リクエストされたURLをログに表示(ブラウザからアクセスされるたびにコンソールへ出力する)
	console.log(req.url);
});
server.on("request", function(req, res) {
	// ヘッダーの送信 送信するデータのタイプはtext/plain
	res.writeHead(200, {"Content-Type": "text/plain"});
});
server.on("request", function(req, res) {
	// 中身の文字列を送信
	res.end("hello, world! : URL " + req.url);
});


/*
 * イベント待受状態を開始する
 */
server.listen(setting.PORT, setting.IP);

/*
 * サーバ起動時に表示するログ(起動したことが分かりやすい)
 */
console.log("Server running at http://" + setting.IP + ":" + setting.PORT + "/");
console.log("サーバを終了する際は[ctrl + c]を押してください");