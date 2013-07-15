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
var setting = require("./999_param.js");

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
	return result;
};
var getName = function (id) {
	for (var i = 0; i < MEMBER.length; ++i) {
		if (MEMBER[i].id === id) {
			return MEMBER[i].name;
		}
	}
};


/*
 * チャットデータ
 */
var CHAT = [];
var setChat = function (id, chat) {
	var name = getName(id);
	CHAT.push({"name": name, "chat": chat});
};
var getChat = function () {
	// 新しい書き込みを上に表示する
	var result = "";
	for (var i = CHAT.length-1; i >= 0; --i) {
		result += CHAT[i].name + " : " + CHAT[i].chat + "<br />";
	}
	return result;
};


/*
 * requestイベント受信時の処理(イベントハンドラ)を作成する
 */
server.on("request", function(req, res) {
	// 外部のHTMLデータを読み込み
	fs.readFile(
		"./045_client.html",
		function (err, data) {
			if (err) {
				// とりあえずconsole.logでログを残す
				// エラーが出たらnodeは死ぬのでendする
				console.log(err);
				res.writeHead(500);
				res.end("Server error : " + err);
			}

			// HTTPレスポンスヘッダを作成・送信(200:OK,500:ServerError,404:NotFound)
			res.writeHead(200, {"Content-Type": "text/html; charset=UTF-8"});
			res.end(data);
		}
	);
});

/*
 * イベント待受状態を開始する
 */
server.listen(setting.PORT, setting.IP, setting.startServer);

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

		// メンバー追加処理(仮の名前)
		setMember(socket.id, client);

		// 名前を追加したので、メンバー名の書き換えメッセージを送信
		io.sockets.emit("rewriteMember", getMember());
	});

	// クライアントが名前変更時に発したイベントの受信処理
	socket.on("modifyName", function (client) {
		console.log("modify name : " + client);

		// メンバー変更処理
		modifyMember(socket.id, client);

		// 名前を変更したので、メンバー名の書き換えメッセージを送信
		io.sockets.emit("rewriteMember", getMember());
	});

	// クライアントがチャット送信時に発したイベントの受信処理
	socket.on("messageChat", function (chat) {
		console.log("message : " + chat);

		// チャットデータ追加
		setChat(socket.id, chat);

		// チャットデータを追加したので、チャット書き換えメッセージを送信
		io.sockets.emit("rewriteChat", getChat());
	});


	// 接続が終了した
	socket.on("disconnect", function (cliant) {
		// 切断したメンバーを削除
		deleteMember(socket.id);

		// 名前を削除したので、メンバー名の書き換えメッセージを送信
		io.sockets.emit("rewriteMember", getMember());
	});

});
