/*
 * hello, world
 * IPなど設定：http://testcording.com/?p=1164
 */

/*
 * モジュール読み込み
 */
var http = require("http");
var mongodb = require("mongodb");
var querystring = require("querystring");
var setting = require("./999_param.js");

 /*
 * MongoDBサーバへの接続
 */
var server = new mongodb.Server(setting.DB_IP, setting.DB_PORT);
var database = new mongodb.Db(setting.DB_029_NAME, server, {safe: true});

// グローバル変数を用意する
var CHAT_DATA;

database.open(function (err, db) {
	if (err) { throw err; }
	// 以下データベースにアクセスするコード
	console.log(setting.DB_029_NAME + "にアクセスしました");

	// データベース接続時に変数を更新する
	db.collection("datas").find().toArray(function (err, values) {
		CHAT_DATA = values;
		console.log("sampledbにデータを整形しました");
	});
});

var setDBData = function (data) {
	// データを格納する
	database.collection("datas").insert(data, function (err, result) {
		if (err) { throw err; }
		console.log("sampledbにデータを格納しました");
	});
};

var getDBData = function (res) {
	// var result;

	// データを配列に整形する
	database.collection("datas").find().toArray(function (err, values) {
		// result = values;
		CHAT_DATA = values;
		// console.log("sampledbにデータを整形しました");

		// 結果を表示する
		// HTTPレスポンスヘッダを作成・送信(200:OK,500:ServerError,404:NotFound)
		res.writeHead(200, setting.HEADER);
		res.write(HTML_HEAD);
		res.write(getHtmlBody(CHAT_DATA));
		res.write(HTML_FOOTER);
		res.end();
	});
	// console.log("sampledbにデータを取得しました");

	// return result;
	// return CHAT_DATA;
};

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
			<form method="post" action="/">\
				<div>\
					内容\
					<label><input type="text" name="content" /></label>\
				</div>\
				<input type="submit" value="書き込む" />\
			</form>\
			<div>';
	dataArray = dataArray || [];
	// console.log(dataArray);
	for (var i = 0; i < dataArray.length; ++i) {
		content += dataArray[i].content + "<br />";
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
		// 画面を更新するイベントを登録する
		getDBData(res);
		return ;
	}

	// POST送信だったら結果表示用HTMLデータをクライアントに返す
	else {
		// 入力されたデータを取得する
		req.data = "";
		req.on("data", function (chunk) {
			req.data += chunk;
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
			setDBData(query);

			// 画面を更新するイベントを登録する
			getDBData(res);
		});
		return ;
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


/*

データベースの更新処理自体に画面の更新を行わせるようにすることで、
画面の描画とデータベースの更新処理のズレをなくすことができました。
良い設計と言えるかは分かりません。

なお、getData関数はもはや関数名と動作内容が一致していないので変更した方がいいです。
(分かりやすいように失敗編の名前を利用しています)

*/