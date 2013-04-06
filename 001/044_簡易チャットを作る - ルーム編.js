/*
 * hello, world
 * IPなど設定：http://testcording.com/?p=1164
 */
/*
 * モジュール読み込み
 */
var http = require("http");
var fs = require("fs");
var socketio = require("socket.io");
var setting = require("/home/virtualserver/デスクトップ/project/NodeSample/001/999_param.js");

/*
 * サーバの作成
 */
var server = http.createServer();
var io = socketio.listen(server);

/*
 * メンバーデータ
 */
var MEMBER = [];
var setMember = function (id, name) {
	MEMBER.push({"id": id, "name": name});
};
var deleteMember = function (id) {
	for (var i = 0; i < MEMBER.length; ++i) {
		if (MEMBER[i].id === id) {
			MEMBER.splice(i, 1);
		}
	}
};
var modifyMember = function (id, name) {
	for (var i = 0; i < MEMBER.length; ++i) {
		if (MEMBER[i].id === id) {
			MEMBER[i].name = name;
		}
	}
};
var getMember = function () {
	// var result = [];
	var result = "";
	for (var i = 0; i < MEMBER.length; ++i) {
		// result.push(MEMBER[i].name);
		if (i !== MEMBER.length-1) {
			result += MEMBER[i].name + ", ";
		}
		else {
			result += MEMBER[i].name;
		}
	}
	console.log("result : " + result);
	return result;
};



/*
 * requestイベント受信時の処理(イベントハンドラ)を作成する
 */
server.on("request", function(req, res) {
	// 外部のHTMLデータを読み込み
	fs.readFile(
		"/home/virtualserver/デスクトップ/project/NodeSample/001/044_cliant.html",
		function (err, data) {
			if (err) { throw err; }

			// HTTPレスポンスヘッダを作成・送信(200:OK,500:ServerError,404:NotFound)
			res.writeHead(200, {"Content-Type": "text/html; charset=UTF-8"});
			res.end(data);
		}
	);
});

/*
 * イベント待受状態を開始する
 */
server.listen(setting.PORT, setting.IP);

/*
 * 通信時の処理
 * クライアント側がio.connect()を実行すると、サーバの以下処理が実行される(イベント名：connection)
 */
io.sockets.on("connection", function (socket) {
	// 接続したら[connected]イベントを発信
	socket.emit("connected", {});

	// クライアント接続時に発した[addMember]イベントの受信処理
	socket.on("addMenber", function (client) {
		console.log("name : " + client);
		console.log(socket.id);

		// メンバー追加処理(仮の名前)
		setMember(socket.id, client);

		// 名前を追加したので、メンバー名の書き換えメッセージを送信
		socket.emit("rewriteMember", getMember());
		socket.broadcast.emit("rewriteMember", getMember());
	});

	// クライアントが名前変更時に発した[]イベントの受信処理
	socket.on("modifyName", function (client) {
		console.log("modify name : " + client);
		console.log(socket.id);

		// メンバー変更処理
		modifyMember(socket.id, client);

		// 名前を変更したので、メンバー名の書き換えメッセージを送信
		socket.emit("rewriteMember", getMember());
		socket.broadcast.emit("rewriteMember", getMember());
	});

	// 接続が終了した
	socket.on("disconnect", function (cliant) {
		// 切断したメンバーを削除
		deleteMember(socket.id);

		// 名前を削除したので、メンバー名の書き換えメッセージを送信
		socket.emit("rewriteMember", getMember());
		socket.broadcast.emit("rewriteMember", getMember());
	});

});


/*
 * サーバ起動時に表示するログ(起動したことが分かりやすい)
 */
console.log("Server running at http://" + setting.IP + ":" + setting.PORT + "/");
console.log("サーバを終了する際は[ctrl + c]を押してください");