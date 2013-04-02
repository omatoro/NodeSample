/*
 * hello, world
 * IPなど設定：http://testcording.com/?p=1164
 */
/*
 * モジュール読み込み
 */
var http = require("http");
var url = require("url");
var setting = require("/home/virtualserver/デスクトップ/project/999_param.js");

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

	// リクエストのURLによって処理を分ける(GET送信)
	var parsedUrl = url.parse("http://" + setting.IP + ":" + setting.PORT + req.url);

	/* url.parseを使用すると以下のようなデータが帰ってくる
	{
	　　protocol: 'http:',
	  slashes: true,
	  host: '192.168.1.202:1337',
	  port: '1337',
	  hostname: '192.168.1.202',
	  href: 'http://192.168.1.202:1337/foo/test?bar=value',
	  search: '?bar=value',
	  query: 'bar=value',
	  pathname: '/foo/test',
	  path: '/foo/test?bar=value'
	}

	url.parse(req.url); と記述しても良い
	url.parse(req.url, true); と記述するとqueryがオブジェクトになるので使いやすい
	*/

	if (parsedUrl.pathname === "/") {
		res.write("トップページです。")
	}
	else if (parsedUrl.pathname === "/test") {
		res.write("実験用ページです。")
	}
	else {
		res.write("404");
	}

	// レスポンスを終了する
	res.end();
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