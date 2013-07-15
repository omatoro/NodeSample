/*
 * hello, world
 * IPなど設定：http://testcording.com/?p=1164
 */
/*
 * パラメータ
 */
var IP_ADDRESS = "localhost";
var PORT       = 1337;

/*
 * モジュール読み込み
 */
 var fs = require("fs");
 var sys = require('sys');

/*
 * 非同期でファイルを読み込む関数
 */
 (function test() {
 	// 非同期でファイル読み込み(パスの指定は、nodeを起動しているパスからの相対パスになる)
 	fs.readFile("rsc/testdata", "utf8", function (err, data) {
 		console.log("readFileを実行した！");
 		console.log(data); // 読み込んだファイルの内容を出力する
 	});
 	// 以下の処理が終了した後、アイドル状態になってから上の非同期処理が行われる(キュー内の処理を順に呼び出すため)
 	console.log("readFile呼び出し終了");
 	for(var i = 0; i < 10000; ++i) {
 		sys.print(".");
 	}
})();
