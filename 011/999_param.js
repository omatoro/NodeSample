/*
 * 設定ファイル
 */
exports.IP      = "localhost";
exports.PORT    = 1337;
exports.startServer = function () {
	/*
	 * サーバ起動時に表示するログ(起動したことが分かりやすい)
	 */
	console.log("Server running at http://" + exports.IP + ":" + exports.PORT + "/");
	console.log("サーバを終了する際は[ctrl + c]を押してください");
};
exports.HEADER  = { "Content-Type": "text/html; charset=UTF-8" };

exports.DB_IP   = "localhost";
exports.DB_PORT = 27017;

exports.DB_NAME = "sampledb";
exports.DB_029_NAME = "sample029db";
exports.DB_032_NAME = "sample032db";
