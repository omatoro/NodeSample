/*
 * hello, world
 * IPなど設定：http://testcording.com/?p=1164
 */
/*
 * モジュール読み込み
 */
var mongodb = require("mongodb");
var setting = require("./999_param.js");

/*
 * MongoDBサーバへの接続
 */
var server = new mongodb.Server(setting.DB_IP, setting.DB_PORT);
var database = new mongodb.Db(setting.DB_NAME, server, { safe: true});

database.open(function (err, db) {
	if (err) { throw err; }
	// 以下データベースにアクセスするコード
	console.log("sampledbにアクセスしました");

	// データを取得する
	var collection = db.collection("datas");
	var result = collection.find({}, {"text": true});

	// データを配列に整形する
	result.toArray(function (err, values) {
		console.dir(values);
		/* valuesには以下のデータが入っている
		[
			{ text: 'これはテストデータです', _id: 515bcdd70c97bf9719000001 },
			... 以下配列データが続く
		]
		*/
	});
});

/*
 * サーバ起動時に表示するログ(起動したことが分かりやすい)
 */
console.log("Server running at http://" + setting.IP + ":" + setting.PORT + "/");
console.log("サーバを終了する際は[ctrl + c]を押してください");