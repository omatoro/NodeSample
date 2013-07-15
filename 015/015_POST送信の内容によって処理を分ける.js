/*
 * hello, world
 * IPなど設定：http://testcording.com/?p=1164
 */
/*
 * モジュール読み込み
 */
var http = require("http");
var querystring = require("querystring");
var setting = require("./999_param.js");

/*
 * サーバの作成
 */
var server = http.createServer();

/*
 * requestイベント受信時の処理(イベントハンドラ)を作成する
 */
server.on("request", function(req, res) {
	// POST送信を受け取る
	if (req.method === "POST") {
		var data = "";
		req.on("readable", function () {
			data += req.read();
		});
		req.on("end", function () {
			// POST送信終了時、送信データを整形する(parse処理はhttp.parseと似ている)
			var query = querystring.parse(data);

			if (query.foo === "value") {
				// 処理A
			}
			else if (query.foo === "value2") {
				// 処理B
			}
		});
	}
});


/*
 * イベント待受状態を開始する
 */
server.listen(setting.PORT, setting.IP, setting.startServer);
