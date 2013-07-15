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
 * 書き込みデータ
 */
 var CHAT_DATA = [];

/*
 * HTMLデータ
 */
var HTML_HEAD = '\
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">\
<html xmlns="http://www.w3.org/1999/xhtml">\
<head>\
    <meta http-equiv="Content-Type" content="text/html ;charset=UTF-8" />\
    <title>簡易掲示板</title>\
</head>\
';

var getHtmlBody = function (dataArray) {
	var content = '\
	<body>\
		<div>\
			<h1>簡易掲示板</h1>\
			<h2>サーバを停止すると書き込み内容も削除されます</h2>\
			<form method="post" action="/">\
				<div>\
					内容\
					<label><input type="text" name="content" /></label>\
				</div>\
				<input type="submit" value="書き込む" />\
			</form>\
			<div>';
	for (var i = 0; i < dataArray.length; ++i) {
		content += dataArray[i] + "<br />";
	}
	content += '\
			</div>\
		</div>\
	</body>';

	return content;
};

var HTML_FOOTER = '\
</html>\
';

/*
 * サーバの作成
 */
var server = http.createServer();

/*
 * requestイベント受信時の処理(イベントハンドラ)を作成する
 */
server.on("request", function(req, res) {
	// ルート以外のパスにアクセスされたら404:NotFoundを返す
	if (req.url !== "/") {
		// HTTPレスポンスヘッダを作成・送信(200:OK,500:ServerError,404:NotFound)
		res.writeHead(404, setting.HEADER);
		res.end("Error 404: NOT FOUND");
		return ;
	}

	// GET送信など(POST以外)だったら入力用HTMLデータをクライアントに返す
	if (req.method !== "POST") {
		// HTTPレスポンスヘッダを作成・送信(200:OK,500:ServerError,404:NotFound)
		res.writeHead(200, setting.HEADER);
		res.write(HTML_HEAD);
		res.write(getHtmlBody(CHAT_DATA));
		res.write(HTML_FOOTER);
		res.end();
		return ;
	}

	// POST送信だったら結果表示用HTMLデータをクライアントに返す
	else {
		// 入力されたデータを取得する
		req.data = "";
		req.on("readable", function () {
			req.data += req.read();
		});
		req.on("end", function () {
			// 取得したデータを整形する
			var query = querystring.parse(req.data);
			/* queryの中身は・・・
			{
				content: "書き込みデータ"
			}
			*/

			// 掲示板の書き込みデータを格納する変数に追加する
			CHAT_DATA.push(query.content);

			// 結果を表示する
			res.writeHead(200, setting.HEADER);
			res.write(HTML_HEAD);
			res.write(getHtmlBody(CHAT_DATA));
			res.write(HTML_FOOTER);
			res.end();
		});
		return ;
	}
});


/*
 * イベント待受状態を開始する
 */
server.listen(setting.PORT, setting.IP, setting.startServer);
