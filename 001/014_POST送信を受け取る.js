/*
 * hello, world
 * IPなど設定：http://testcording.com/?p=1164
 */
/*
 * モジュール読み込み
 */
var http = require("http");
var setting = require("/home/virtualserver/デスクトップ/project/999_param.js");

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
		req.on("data", function (chunk) {
			data += chunk;
		});
		req.on("end", function () {
			// POST送信終了時
		});
	}
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