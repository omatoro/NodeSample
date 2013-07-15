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
var database = new mongodb.Db(setting.DB_032_NAME, server, {safe: true});

// グローバル変数を用意する
var TODO_DATA;

database.open(function (err, db) {
	if (err) {
		// とりあえずconsole.logでログを残す
		console.log(err);
		return ;
	}
	// 以下データベースにアクセスするコード
	console.log(setting.DB_032_NAME + "にアクセスしました");

	// データベース接続時に変数を更新する
	db.collection("datas").find().toArray(function (err, values) {
		TODO_DATA = values;
		console.log(values);
		console.log(setting.DB_032_NAME + "のデータを整形しました");
	});
});

var setDBData = function (data) {
	// データを格納する
	database.collection("datas").insert(data, function (err, result) {
		if (err) {
			// とりあえずconsole.logでログを残す
			console.log(err);
			return ;
		}
		console.log(setting.DB_032_NAME + "のデータを格納しました");
	});
};

var deleteDBData = function (dataId) {
	console.log(dataId);
	// データを削除する
	database.collection("datas").remove({"_id": new mongodb.ObjectID(dataId)}, function (err) {
		console.log(setting.DB_032_NAME + "のデータを削除しました");
	});
};

var getDBData = function (res) {
	// var result;

	// データを配列に整形する
	database.collection("datas").find().toArray(function (err, values) {
		// result = values;
		TODO_DATA = values;
		// console.log("sampledbにデータを整形しました");

		// 結果を表示する
		// HTTPレスポンスヘッダを作成・送信(200:OK,500:ServerError,404:NotFound)
		res.writeHead(200, setting.HEADER);
		res.write(HTML_HEAD);
		res.write(getHtmlBody(TODO_DATA));
		res.write(HTML_FOOTER);
		res.end();
	});
	// console.log("sampledbにデータを取得しました");

	// return result;
	// return TODO_DATA;
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
			<h1>簡易TODOリスト</h1>\
			<form method="post" action="/">\
				<div>\
					やること\
					<label><input type="text" name="content" /></label>\
				</div>\
				<input type="submit" value="書き込む" />\
			</form>\
			<div>';
	dataArray = dataArray || [];
	// console.log(dataArray);
	for (var i = 0; i < dataArray.length; ++i) {
		// 削除ボタンなどの複数のボタンを設置する場合は、input type="hidden"を使う
		content += '\
				<div style="border: 1px solid grey; margin: 20px;">';
		content += dataArray[i].content;
		content += '\
					<form method="post" action="/">\
						<input type="hidden" name="delete" value="' + dataArray[i]._id + '" />\
						<input type="submit" name="b1" value="削除" />\
					</form>\
				</div>';
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
		req.on("readable", function () {
			req.data += req.read();
		});
		req.on("end", function () {
			// 取得したデータを整形する
			var query = querystring.parse(req.data);

			// 送信されたデータによって処理を分ける
			query.content ? setDBData(query)           : null;
			query.delete  ? deleteDBData(query.delete) : null;

			// 画面を更新するイベントを登録する
			getDBData(res);
		});
		return ;
	}
});


/*
 * イベント待受状態を開始する
 */
server.listen(setting.PORT, setting.IP, setting.startServer);
