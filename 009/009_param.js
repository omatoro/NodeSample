/*
 * 設定ファイル
 */
exports.IP   = "localhost";
exports.PORT = 1337;
exports.startServer = function () {
	/*
	 * サーバ起動時に表示するログ(起動したことが分かりやすい)
	 */
	console.log("Server running at http://" + exports.IP + ":" + exports.PORT + "/");
	console.log("サーバを終了する際は[ctrl + c]を押してください");
};