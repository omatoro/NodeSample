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
	if (err) {
		// とりあえずconsole.logでログを残す
		console.log(err);
		return ;
	}
	// 以下データベースにアクセスするコード
	console.log("sampledbにアクセスしました");

	// データを取得する
	var collection = db.collection("datas");
	var result = collection.find();

	// データを配列に整形する(ソート内容の指定は二重配列になることに注意)
	result.sort([["dataId", "desc"]]).limit(3).toArray(function (err, values) {
		console.dir(values);
		/* valuesには以下のデータが入っている(区別をつけるために格納するデータを工夫してください)
		[
			{ dataId: 5, text: 'これはテストデータです', _id: 515bebb9e742e9871a000001 },
			{ dataId: 4, text: 'これはテストデータです', _id: 515bd1b2861dd9ce19000001 },
			{ dataId: 3, text: 'これはテストデータです', _id: 515bd1466c9852ba19000001 }
		]
		*/
	});
});

/*
 * サーバ起動時に表示するログ(起動したことが分かりやすい)
 * 厳密にはサーバ起動時では無いので注意
 */
console.log("Server running at http://" + setting.IP + ":" + setting.PORT + "/");
console.log("サーバを終了する際は[ctrl + c]を押してください");
