/*
 * hello, world
 * IPなど設定：http://testcording.com/?p=1164
 */
/*
 * モジュール読み込み
 */
var http = require("http");
var setting = require("./999_param.js");

/*
 * サーバの作成
 */
var server = http.createServer();

/*
 * requestイベント受信時の処理(イベントハンドラ)を作成する
 */
server.on("request", function(req, res) {
	// HTTPレスポンスヘッダを作成
	res.writeHead(200);

	// リクエストのURLを出力(\nは改行)
	res.write("URL : " + req.url + "\n");

	// HTTPメソッドを出力
	res.write("Method : " + req.method + "\n");

	// HTTPヘッダを出力する
	Object.keys(req.headers).forEach(function (key) {
		res.write(key + " : " + req.headers[key] + "\n");
	});

	// レスポンスを終了する
	res.end();
});


/*
 * イベント待受状態を開始する
 */
server.listen(setting.PORT, setting.IP, setting.startServer);