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
 * HTMLデータ
 */
var HTML_HEAD = '\
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">\
<html xmlns="http://www.w3.org/1999/xhtml">\
<head>\
    <meta http-equiv="Content-Type" content="text/html ;charset=UTF-8" />\
    <title>ラッキーナンバー</title>\
</head>\
';

var HTML_BODY = '\
<body>\
	<div>\
		<h1>ラッキーナンバー占い</h1>\
		<form method="post" action="/">\
			<div>\
				生年月日\
				<label><input type="text" name="year" />年</label>\
				<label><input type="text" name="month" />月</label>\
				<label><input type="text" name="day" />日</label>\
			</div>\
			<input type="submit" value="ラッキーナンバーは？" />\
		</form>\
	</div>\
</body>\
';
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
		res.write(HTML_BODY);
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
				year: "2000",
				month: "12",
				day: "24"
			}
			*/

			// ラッキーナンバーを計算する(生年月日の日の一桁！いんちき？)
			var luckyNumber = query.day % 10;

			var resultHtml = '\
				<body>\
					<div>\
						あなたのラッキーナンバーは...  <em style="font-size: 30px">' + luckyNumber + '</em>  です！\
					</div>\
				</body>\
			';

			// 結果を表示する
			res.writeHead(200, setting.HEADER);
			res.write(HTML_HEAD);
			res.write(resultHtml);
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
