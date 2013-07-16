node.js 怒濤の50サンプル!! – socket.io編
========


<a href="http://nodejs.org/" target="_blank">node.js</a>を使ったサンプル集です。ゲーム制作でサンプル作ってたら溜まったので整理がてら公開します。<a href="http://nodejs.org/" target="_blank">node.js</a>をローカルで実行できる環境を作ってない方は、<a href="http://testcording.com/?p=1164" title="初心者でも安心！？Node.jsをインストールするなら仮想サーバを使おう" target="_blank">「初心者でも安心！？Node.jsをインストールするなら仮想サーバを使おう」</a>を参考にしてみてください。また、socket.ioやmongoDBを利用する際は、都度インストールしてください。

　<br />　<br />
<a href="http://testcording.com/wp-content/uploads/2013/03/2013-03-04_16h56_44.png"><img src="http://testcording.com/wp-content/uploads/2013/03/2013-03-04_16h56_44.png" alt="" title="2013-03-04_16h56_44" width="506" height="293" class="aligncenter size-full wp-image-1182" /></a>
　<br />　<br />


## 導入時の注意点

+ 環境の準備
	+ <a href="http://testcording.com/?p=1164" title="初心者でも安心！？Node.jsをインストールするなら仮想サーバを使おう" target="_blank">「初心者でも安心！？Node.jsをインストールするなら仮想サーバを使おう」</a>
	+ 上記を参考にした場合はIPアドレスを`192.168.1.202`に変更する
+ MongoDBの準備
	+ OSにインストール必要
	+ `$ mongod --version`にてインストールバージョンを要確認
	+ `version v2.4.1` で動作確認済み
+ 当ファイル郡をZIPにてダウンロード後
	+ ZIPファイルを解凍
	+ 解凍したディレクトリへ移動
	+ `$ npm install`を実行し、依存関係にあるモジュールをインストール


## node.js基礎

001: <a target="_blank" href="https://github.com/omatoro/NodeSample/tree/master/001">hello,worldを表示しよう</a>

002: <a target="_blank" href="https://github.com/omatoro/NodeSample/tree/master/002">サーバを起動したことが分かるようにしよう</a>

003: <a target="_blank" href="https://github.com/omatoro/NodeSample/tree/master/003">IPやPORTをパラメータにしよう</a>

004: <a target="_blank" href="https://github.com/omatoro/NodeSample/tree/master/004">コメントをつけよう</a>

005: <a target="_blank" href="https://github.com/omatoro/NodeSample/tree/master/005">リクエストしたURLを表示しよう</a>

006: <a target="_blank" href="https://github.com/omatoro/NodeSample/tree/master/006">非同期でファイル読み込もう</a>

007: <a target="_blank" href="https://github.com/omatoro/NodeSample/tree/master/007">サーバ作成処理を分けて記述しよう</a>

008: <a target="_blank" href="https://github.com/omatoro/NodeSample/tree/master/008">複数のイベントハンドラを登録しよう</a>

009: <a target="_blank" href="https://github.com/omatoro/NodeSample/tree/master/009">外部のJavaScriptファイルを読み込もう</a>

010: <a target="_blank" href="https://github.com/omatoro/NodeSample/tree/master/010">外部ファイルが存在するか確認しよう</a>

011: <a target="_blank" href="https://github.com/omatoro/NodeSample/tree/master/011">受信したリクエストを表示しよう</a>

012: <a target="_blank" href="https://github.com/omatoro/NodeSample/tree/master/012">リクエストのURLによって処理を分けよう</a>

013: <a target="_blank" href="https://github.com/omatoro/NodeSample/tree/master/013">リクエストの複雑なURLによって処理を分けよう</a>

014: <a target="_blank" href="https://github.com/omatoro/NodeSample/tree/master/014">POST送信を受け取ろう</a>

015: <a target="_blank" href="https://github.com/omatoro/NodeSample/tree/master/015">POST送信の内容によって処理を分けよう</a>

016: <a target="_blank" href="https://github.com/omatoro/NodeSample/tree/master/016">クライアントへレスポンスを返そう</a>

017: <a target="_blank" href="https://github.com/omatoro/NodeSample/tree/master/017">ラッキーナンバーを教えてくれるアプリを作ってみよう</a>

018: <a target="_blank" href="https://github.com/omatoro/NodeSample/tree/master/018">簡易掲示板を作ってみよう</a>


## MongoDB連携

019: <a target="_blank" href="https://github.com/omatoro/NodeSample/tree/master/019">mongodbにアクセスしよう</a>

020: <a target="_blank" href="https://github.com/omatoro/NodeSample/tree/master/020">mongodbにデータを格納しよう</a>

021: <a target="_blank" href="https://github.com/omatoro/NodeSample/tree/master/021">mongodbに格納したデータを全て表示しよう</a>

022: <a target="_blank" href="https://github.com/omatoro/NodeSample/tree/master/022">mongodbから指定したフィールドのみ取得しよう</a>

023: <a target="_blank" href="https://github.com/omatoro/NodeSample/tree/master/023">mongodbから一件のみデータを取得しよう</a>

024: <a target="_blank" href="https://github.com/omatoro/NodeSample/tree/master/024">mongodbから3～5番目のデータを取得しよう</a>

025: <a target="_blank" href="https://github.com/omatoro/NodeSample/tree/master/025">mongodbから取得するデータをソートしよう</a>

026: <a target="_blank" href="https://github.com/omatoro/NodeSample/tree/master/026">mongodbから取得するデータをfindに指定しよう</a>

027: <a target="_blank" href="https://github.com/omatoro/NodeSample/tree/master/027">mongodbに格納したデータを削除しよう</a>

028: <a target="_blank" href="https://github.com/omatoro/NodeSample/tree/master/028">mongodbに格納したデータを更新しよう</a>

029: <a target="_blank" href="https://github.com/omatoro/NodeSample/tree/master/029">mongodbを使って簡易掲示板を作り直そう - 失敗編1</a>

030: <a target="_blank" href="https://github.com/omatoro/NodeSample/tree/master/030">mongodbを使って簡易掲示板を作り直そう - 失敗編2</a>

031: <a target="_blank" href="https://github.com/omatoro/NodeSample/tree/master/031">mongodbを使って簡易掲示板を作り直そう - 成功編</a>

032: <a target="_blank" href="https://github.com/omatoro/NodeSample/tree/master/032">mongodbを使ってtodoリストを作ろう</a>


## socket.io基礎

033: <a href="https://github.com/omatoro/NodeSample/tree/master/033">HTMLとコードを分けよう(HTMLファイルをクライアントに送信する)</a>

034: <a target="_blank" href="https://github.com/omatoro/NodeSample/tree/master/034">socket.ioを使おう</a>

035: <a target="_blank" href="https://github.com/omatoro/NodeSample/tree/master/035">socket.ioでサーバからクライアントにメッセージを送ろう</a>

036: <a target="_blank" href="https://github.com/omatoro/NodeSample/tree/master/036">socket.ioでクライアントからサーバの関数を実行しよう</a>

037: <a target="_blank" href="https://github.com/omatoro/NodeSample/tree/master/037">socket.ioでmessageイベント以外のイベントを送信しよう</a>

038: <a target="_blank" href="https://github.com/omatoro/NodeSample/tree/master/038">socket.ioでサーバからオブジェクトを送信しよう</a>

039: <a target="_blank" href="https://github.com/omatoro/NodeSample/tree/master/039">socket.ioでクライアントからサーバにデータを送信しよう</a>

040: <a target="_blank" href="https://github.com/omatoro/NodeSample/tree/master/040">socket.ioでconnect以外の標準イベント</a>

041: <a target="_blank" href="https://github.com/omatoro/NodeSample/tree/master/041">socket.ioでクライアントが受信しなくてもOKなイベント送信</a>

042: <a target="_blank" href="https://github.com/omatoro/NodeSample/tree/master/042">socket.ioでクライアント(自分以外の全て)にイベント送信</a>

043: <a target="_blank" href="https://github.com/omatoro/NodeSample/tree/master/043">socket.ioでクライアント(自分を含めた全て)にイベント送信</a>

044: <a target="_blank" href="https://github.com/omatoro/NodeSample/tree/master/044">簡易チャットを作ろう - ルーム編</a>

045: <a target="_blank" href="https://github.com/omatoro/NodeSample/tree/master/045">簡易チャットを作ろう - 書き込み編</a>


## socket.io + express + tmlib.js

未完成！

046: expressとsocket.ioを一緒に使おう
047: tmlib.jsと連携しよう
048: 魔法陣を共有して表示するアプリを作ろう
049: みんなで演奏するアプリを作ろう
050: みんなでお絵かきするアプリを作ろう
051: シューティング対戦ゲームを作ろう