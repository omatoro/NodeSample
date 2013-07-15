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

	// コレクションを取得
	var collection = database.collection("datas");

	// データを更新する
	collection.update({"dataId": 4}, {"dataId": 4, "text": "更新後のデータです"}, function (err) {});

	// データを取得する
	var result = collection.find();

	// データを配列に整形する
	result.toArray(function (err, values) {
		console.dir(values);
		// [dataId: 4]のデータが更新されたことを確認してください
	});
});

/*
 * サーバ起動時に表示するログ(起動したことが分かりやすい)
 * 厳密にはサーバ起動時では無いので注意
 */
console.log("Server running at http://" + setting.IP + ":" + setting.PORT + "/");
console.log("サーバを終了する際は[ctrl + c]を押してください");
