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
	// POST送信を受け取る
	if (req.method === "POST") {
		var data = "";
		// stream1: 今時ではないが、古いnode.jsに対応する場合はこっちでやる
		// req.on("data", function (chunk) {
		// 	data += chunk;
		// });

		// stream2: node.js v0.10 以上であればこっちの方がいい
		// 理由：http://d.hatena.ne.jp/jovi0608/20130312/1363099862
		req.on("readable", function () {
			data += req.read();
		});
		req.on("end", function () {
			// POST送信終了時
		});
	}
});


/*
 * イベント待受状態を開始する
 */
server.listen(setting.PORT, setting.IP, setting.startServer);
