/*
 * hello, world
 * IPなど設定：http://testcording.com/?p=1164
 */
/*
 * モジュール読み込み
 */
var http = require("http");
var fs = require("fs");
var setting = require("./999_param.js");


/*
 * サーバの作成
 */
var server = http.createServer();

/*
 * requestイベント受信時の処理(イベントハンドラ)を作成する
 */
server.on("request", function(req, res) {
	// 外部のHTMLデータを読み込み
	fs.readFile(
		"./033_client.html",
		function (err, data) {
			if (err) { throw err; }

			// HTTPレスポンスヘッダを作成・送信(200:OK,500:ServerError,404:NotFound)
			res.writeHead(200, {"Content-Type": "text/html; charset=UTF-8"});
			res.end(data);
		}
	);
});


/*
 * イベント待受状態を開始する
 */
server.listen(setting.PORT, setting.IP, setting.startServer);
