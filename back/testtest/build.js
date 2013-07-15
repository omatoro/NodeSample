/*
 * SimpleMessageWindow
 */
(function(ns) {

	var FONT_SIZE    = 12;
	var FONT_STYLE   = "rgba(255, 255, 255, 0.0)";
	var FONT_PADDING = 0;
	var FONT_LEFT_PADDING = 0;

	var WINDOW_WIDTH = 200;
	var WINDOW_HEIGHT = 70;
	var WINDOW_PADDING = 10;

	var WINDOW_DRAW_POSITION_X = WINDOW_WIDTH/2  + WINDOW_PADDING;
	var WINDOW_DRAW_POSITION_Y = WINDOW_HEIGHT/2 + WINDOW_PADDING + 100;

	ns.SimpleMessageWindow = tm.createClass({
	    superClass: tm.app.Shape,

	    init: function(text, colorR, colorG, colorB) {
            // 初期化
	        this.superInit(WINDOW_WIDTH, WINDOW_HEIGHT);

	    	// 文字を先に作成(幅を取得するため)
	    	var label = tm.app.Label(text + "", FONT_SIZE);
            label.fillStyle = FONT_STYLE;
            label.setAlign("left").setBaseline("top");
            label.fontFamily = "'Consolas', 'Monaco', 'ＭＳ ゴシック'";
            this.label = label;

	        // 色
	        this.colorR = colorR || 255;
	        this.colorG = colorG || 255;
	        this.colorB = colorB || 255;

	        // フォントの描画場所
            label.x = -this.width/2 + 10;
            label.y = -this.height/2 + 5;

	        this.interaction.enabled = false;
	        this.alpha = 0;
	        this.backgroundColor = "rgba(0, 0, 0, 0.0)";

	        // だんだん消えていく
	        var removeFlag = {is:false};
	        this.removeFlag = removeFlag;
            this.tweener
            	.to({"alpha": 1000}, 500)
            	.wait(5000)
                .to({"alpha": -1}, 1000)
                .call(function(){removeFlag.is = true;});

	        // 文字を追加
	        this.addChild(label);
	        this._refresh();

	        // 移動先を保存
	        this.directX = WINDOW_DRAW_POSITION_X;
	        this.directY = WINDOW_DRAW_POSITION_Y;
	    },

	    moveby: function (deltax, deltay) {
	    	this.directX += deltax/2;
	    	this.directY += deltay/2;
	    	this.timeline
	    		.set({"x": this.x, "y": this.y}, 0)
                .to({"x": this.directX, "y": this.directY}, 300, this.timeline.currentFrame * 1000/30 |0);
	    },

	    update: function () {
            this._refresh();
            if (this.removeFlag.is) {
            	this.remove();
            }
	    },

	    // 改行処理をphi_jp氏のサンプルからとりあえずそのまま入れる
		fillTextLine: function(context, text, x, y) {
			var textList = text.split('\n');
			var lineHeight = context.measureText("あ").width;
			textList.forEach(function(text, i) {
				context.fillText(text, x, y+lineHeight*i);
			});
		},

	    _refresh: function () {
	        // 描画
	        var c = this.canvas;
	        c.resize(this.width, this.width);
	        var lineWidth   = 2;

	        // テキスト描画部分
	        c.fillStyle = tm.graphics.Color.createStyleRGBA(this.colorR, this.colorG, this.colorB, this.alpha*0.5/1000);
	        c.lineWidth = lineWidth;
	        c.fillRoundRect(lineWidth, lineWidth, WINDOW_WIDTH-(lineWidth*2), WINDOW_HEIGHT-(lineWidth*2), 5);

            // ラベルのサイズをリセット
            this.label.fillStyle = tm.graphics.Color.createStyleRGBA(20, 20, 20, this.alpha/1000);
            this.label.setSize(this.width, this.height);
	    }
	});

})(game);
/*
 * ManageSimpleWindows
 */
(function(ns) {

	var WINDOW_WIDTH = 200;
	var WINDOW_HEIGHT = 70;
	var WINDOW_PADDING = 10;

	var WINDOW_DRAW_POSITION_X = WINDOW_WIDTH/2  + WINDOW_PADDING;
	var WINDOW_DRAW_POSITION_Y = WINDOW_HEIGHT/2 + WINDOW_PADDING + 100;

	ns.ManageSimpleWindows = tm.createClass({

	    init: function(scene) {
	    	this.windowGroup = tm.app.CanvasElement();
	    	scene.addChild(this.windowGroup);
	    },

	    add: function (text, colorR, colorG, colorB) {
	    	// 既にあるウィンドウをずらす
	    	for (var i = 0; i < this.windowGroup.children.length; ++i) {
	    		this.windowGroup.children[i].moveby(0, WINDOW_HEIGHT);
	    	}
	    	// ウィンドウを追加
	    	var simpleWindow = ns.SimpleMessageWindow(text, colorR, colorG, colorB);
	    	simpleWindow.position.set(WINDOW_DRAW_POSITION_X, WINDOW_DRAW_POSITION_Y);
	    	this.windowGroup.addChild(simpleWindow);
	    },

	    update: function () {
	    },
	});

})(game);
/*
 * OnePlayAnimationSprite
 */
(function(ns) {

	ns.OnePlayAnimationSprite = tm.createClass({
	    superClass: tm.app.AnimationSprite,

	    init: function(width, height, ss) {
	    	this.superInit(ss, width, height);
	    },

	    update: function () {
	        if (this.isAnimation === false) {
	        	this.remove();
	        }
	    }
	});

})(game);
/*
 * DamagedNumber
 */
(function(ns) {

	var FONT_SIZE    = 32;
	var FONT_STYLE   = "rgba(255, 255, 255, 0.0)";
	var FONT_PADDING = 0;
	var FONT_LEFT_PADDING = 0;

	ns.DamagedNumber = tm.createClass({
	    superClass: tm.app.Shape,

	    init: function(text, colorR, colorG, colorB, strokeColorR, strokeColorG, strokeColorB, far) {
	    	// 文字を先に作成(幅を取得するため)
	    	var label = tm.app.Label(text + "", FONT_SIZE);
            label.fillStyle = FONT_STYLE;
            label.setAlign("center").setBaseline("middle");
            label.fontFamily = "'Diesel', 'Consolas', 'Monaco', 'ＭＳ ゴシック'";
            label.stroke = true;
            label.lineWidth = 1;
            this.label = label;

            // 文字列の横幅が取得できないので、仮に正確ではないが計算する
            var width  = label.width + FONT_SIZE;
            var height = label.height + 15;

            // 初期化
	        this.superInit(width, height);

	        // 消えながら離れるときの距離
	        this.far = far || 50;

	        // 色
	        this.colorR = colorR || 255;
	        this.colorG = colorG || 255;
	        this.colorB = colorB || 255;
	        this.strokeColorR = strokeColorR || 0;
	        this.strokeColorG = strokeColorG || 0;
	        this.strokeColorB = strokeColorB || 0;

	        // フォントの描画場所
            label.x = 0;
            label.y = -5;

	        this.interaction.enabled = false;
	        this.alpha = 1000;
	        this.backgroundColor = "rgba(0, 0, 0, 0.0)";

	        // 文字を追加
	        this.addChild(label);
	        this._refresh();
	    },

	    effectPositionSet: function (x, y) {
	    	x += -10;  // ずらさないと点とかぶるため
	    	y -= this.height/3;

	    	this.position.set(x, y);

	        // だんだん消えていく
            this.tweener.
                to({"alpha": -1, "x": x + this.far, "y": y - this.far}, 700);
	    },

	    update: function () {
            this._refresh();

	        if (this.alpha <= 0) {
	        	this.remove();
	        }
	    },

	    _refresh: function () {
	        // 描画
	        // var c = this.canvas;
	        // c.resize(this.width, this.width);
	        // var lineWidth   = 0;

	        // // テキスト描画部分
	        // c.fillStyle = tm.graphics.Color.createStyleRGBA(this.colorR, this.colorG, this.colorB, this.alpha*0.5/1000);
	        // c.lineWidth = 0;
	        // c.fillRoundRect(lineWidth, lineWidth, this.width-(lineWidth*2), this.height-(lineWidth*2), 5);

            // ラベルのサイズをリセット
            this.label.strokeStyle = tm.graphics.Color.createStyleRGBA(this.strokeColorR, this.strokeColorG, this.strokeColorB, this.alpha/1000);

            this.label.fillStyle = tm.graphics.Color.createStyleRGBA(this.colorR, this.colorG, this.colorB, this.alpha/1000);
            this.label.setSize(this.width, this.height);
	    }
	});

})(game);
/*
 * Baloon
 */
(function(ns) {

	var FONT_SIZE    = 30;
	var FONT_STYLE   = "rgba(20, 20, 20, 0.0)";
	var FONT_PADDING = 0;
	var FONT_LEFT_PADDING = 0;

	ns.Baloon = tm.createClass({
	    superClass: tm.app.Shape,

	    init: function(text, colorR, colorG, colorB, far) {
	    	// 文字を先に作成(幅を取得するため)
	    	var label = tm.app.Label(text + "", FONT_SIZE);
            label.fillStyle = FONT_STYLE;
            label.setAlign("center").setBaseline("middle");
            this.label = label;

            // 文字列の横幅が取得できないので、仮に正確ではないが計算する
            var width  = label.width + FONT_SIZE;
            var height = label.height + 15;

            // 初期化
	        this.superInit(width, height);

	        // 消えながら離れるときの距離
	        this.far = far || 50;

	        // 色
	        this.colorR = colorR || 255;
	        this.colorG = colorG || 255;
	        this.colorB = colorB || 255;

	        // フォントの描画場所
            label.x = 0;
            label.y = -5;

	        this.interaction.enabled = false;
	        this.alpha = 1000;
	        this.backgroundColor = "rgba(0, 0, 0, 0.0)";

	        // 文字を追加
	        this.addChild(label);
	        this._refresh();
	    },

	    effectPositionSet: function (x, y) {
	    	x += -10;  // ずらさないと点とかぶるため
	    	y -= this.height/3;

	    	this.position.set(x, y);

	        // だんだん消えていく
            this.tweener.
                to({"alpha": -1, "x": x, "y": y - this.far}, 700);
	    },

	    update: function () {
            this._refresh();

	        if (this.alpha <= 0) {
	        	this.remove();
	        }
	    },

	    _refresh: function () {
	        // 描画
	        var c = this.canvas;
	        c.resize(this.width, this.width);
	        var lineWidth   = 0;

	        // テキスト描画部分
	        c.fillStyle = tm.graphics.Color.createStyleRGBA(this.colorR, this.colorG, this.colorB, this.alpha*0.5/1000);
	        c.lineWidth = 0;
	        c.fillRoundRect(lineWidth, lineWidth, this.width-(lineWidth*2), this.height-(lineWidth*2), 5);

            // ラベルのサイズをリセット
            this.label.fillStyle = tm.graphics.Color.createStyleRGBA(20, 20, 20, this.alpha/1000);
            this.label.setSize(this.width, this.height);
	    }
	});

})(game);
/*
 * GlossyImageButton
 */
(function(ns) {

	ns.GlossyImageButton = tm.createClass({
	    superClass: tm.app.Shape,

	    init: function(width, height, image, backgroundColor) {
            this.superInit(width, height);
            this.backgroundColor = backgroundColor || "black";
            this.alpha = tm.app.GlossyButton.DEFAULT_ALPHA-0.1;

            image.position.set(0, 0);
            this.addChild(image);

            this.interaction.enabled = true;
            this.interaction.boundingType = "rect";
            this.addEventListener("pointingover", function() {
                this.tweener.clear();
                this.tweener.fade(0.7, 250);
            });
            this.addEventListener("pointingout", function() {
                this.tweener.clear();
                this.tweener.fade(tm.app.GlossyButton.DEFAULT_ALPHA-0.1, 250);
            });

	        this._refresh();
	    },

	    _refresh: function () {
            // ボタン描画
            var c = this.canvas;
            c.resize(this.width, this.height);
            c.fillStyle = this.backgroundColor;
            c.fillCircle(this.width/2, this.height/2, this.width/2-20);
            c.strokeStyle   = "rgba(100,100,100,0.75)";
            c.lineWidth     = 2;
            c.strokeCircle(this.width/2, this.height/2, this.width/2);
            
            // テカリ
            // c.roundRect(2, 2, this.width-4, this.height-4, 10);
            // c.clip();
            
            var grad = tm.graphics.LinearGradient(0, 0, 0, this.height);
            
            // grad.addColorStop(0.0, "hsl(  0, 75%, 50%)");
            // grad.addColorStop(0.5, "hsl(120, 75%, 50%)");
            // grad.addColorStop(1.0, "hsl(240, 75%, 50%)");
            grad.addColorStop(0.0, "rgba(255,255,255,0.9)");
            grad.addColorStop(0.5, "rgba(255,255,255,0.5)");
            grad.addColorStop(0.51, "rgba(255,255,255,0.2)");
            grad.addColorStop(1.0, "rgba(255,255,255,0.0)");
            c.setGradient(grad);
            c.fillCircle(this.width/2, this.height/2, this.width/2-10);
	    }
	});

})(game);
/**
 * GenerateMap
 * 
 * 引数で縦横のマップチップ数を渡すと、部屋を繋げたデータ(配列)を返す
 * 出力結果のデータは、歩ける場所：true 歩けない場所:falseとなる
 * 直接マップチップを作成するわけではないので注意
 */
(function(ns) {

    var ROOM_SIZE_MIN = 4;
    var MARGIN_BETWEEN_RECT_ROOM = 2;
    var RECT_NUM_MIN = ROOM_SIZE_MIN + (MARGIN_BETWEEN_RECT_ROOM * 2); // 区画の最小構成数

    var COUPLE_VERTICAL = 0;
    var COUPLE_HORIZONAL = 1;

    /**
     * デバッグ用のマップ出力
     */
    var outConsole = function (mapArray) {
        var line = "";
        for (var i = 0; i < mapArray.length; ++i) {
            for (var j = 0; j < mapArray[i].length; ++j) {
                if (mapArray[i][j]) {
                    line += "#";
                }
                else {
                    line += ".";
                }
            }
            console.log(line);
            line = "";
        }
    };

    ns.GenerateMap = tm.createClass({

        init: function (mapChipWidthNum, mapChipHeightNum) {
            // 生成する配列の初期化
            var map = [];
            for (var i = 0; i < mapChipHeightNum; ++i) {
                map[i] = [];
                for (var j = 0; j < mapChipWidthNum; ++j) {
                    map[i].push(false);
                }
            }
            this.map = map;

            // 区画を管理
            this.rectList = [];

            // 区画内の部屋を管理
            this.roomList = [];

            // つなげる部屋を管理
            this.coupleList = [];

            // 分割を開始
            this._divideRect(this._addRect(0, 0, mapChipWidthNum - 1, mapChipHeightNum - 1));

            // 部屋を作成
            this._makeRoom();

            // 作成したマップの元データから、実際に使用する配列データを作成する
            this._makeMap();

            // デバッグ用にコンソールへ出力
            outConsole(this.map);

            // データを整形する
            this._arrange();
        },

        /**
         * データを整える
         * true,falseのデータから必要な形式に変更する
         */
        _arrange: function () {
            // マップ情報をfalseなら[1], trueなら[2]に変更 ついでに歩ける場所の数も数えとく
            var possibleWalkMapNum = 0;
            // またまたついでにコリジョン用のデータをサクッと作る(歩ける:1, 壁:0)
            var map = this.map;
            var collision = [];
            for (var i = 0; i < map.length; ++i) {
                collision[i] = [];
                for (var j = 0; j < map[i].length; ++j) {
                    if (map[i][j]) {
                        map[i][j] = 2;
                        collision[i].push(1);
                        ++possibleWalkMapNum;
                    }
                    else {
                        map[i][j] = 1;
                        collision[i].push(0);
                    }
                }
            }

            this.collision = collision;
            this.walkMapNum = possibleWalkMapNum; // 歩ける場所の数
        },


        /**
         * 指定した場所から場所への直線のフラグをtrueにする
         */
        _makeMap: function () {
            var map = this.map;
            for (var i = 0; i < this.rectList.length; ++i) {
                break;
                var rect = this.rectList[i];
                var k, l;
                for (k = rect.lx, l = rect.ly; k <= rect.hx; ++k) {map[l][k] = true;}
                for (k = rect.lx, l = rect.hy; k <= rect.hx; ++k) {map[l][k] = true;}
                for (k = rect.lx, l = rect.ly; l <= rect.hy; ++l) {map[l][k] = true;}
                for (k = rect.hx, l = rect.ly; l <= rect.hy; ++l) {map[l][k] = true;}
            }
            for (var i = 0; i < this.roomList.length; ++i) {
                var room = this.roomList[i];
                for (var j = room.lx; j <= room.hx; ++j) {
                    for (var k = room.ly; k <= room.hy; ++k) {
                        map[k][j] = true;
                    };
                };
            };
            for (var i = 0; i < this.coupleList.length; ++i) {
                var couple = this.coupleList[i];
                switch (couple.v_or_h) {
                    case COUPLE_HORIZONAL:
                        var c0x = couple.rect0.hx;
                        var c0y = Math.rand(couple.rect0.room.ly + 1, couple.rect0.room.hy -1);
                        var c1x = couple.rect1.lx;
                        var c1y = Math.rand(couple.rect1.room.ly + 1, couple.rect1.room.hy -1);
                        this._line(c0x, c0y, c1x, c1y);
                        this._line(couple.rect0.room.hx, c0y, c0x, c0y);
                        this._line(couple.rect1.room.lx, c1y, c1x, c1y);
                        break;

                    case COUPLE_VERTICAL:
                        var c0x = Math.rand(couple.rect0.room.lx + 1, couple.rect0.room.hx -1);
                        var c0y = couple.rect0.hy;
                        var c1x = Math.rand(couple.rect1.room.lx + 1, couple.rect1.room.hx -1);
                        var c1y = couple.rect1.ly;
                        this._line(c0x, c0y, c1x, c1y);
                        this._line(c0x, couple.rect0.room.hy, c0x, c0y);
                        this._line(c1x, couple.rect1.room.ly, c1x, c1y);
                        break;
                }
            };
        },


        /**
         * 指定した場所から場所への直線のフラグをtrueにする
         */
        _line: function (x0, y0, x1, y1) {
            var min_x = (x0 < x1) ? x0 : x1;
            var max_x = (x0 > x1) ? x0 : x1;
            var min_y = (y0 < y1) ? y0 : y1;
            var max_y = (y0 > y1) ? y0 : y1;

            var map = this.map;

            if ((x0 <= x1) && (y0 >= y1)) {
                for (var i = min_x; i <= max_x; ++i) {map[min_y][i] = true;}
                for (var j = min_y; j <= max_y; ++j) {map[j][max_x] = true;}
                return ;
            }
            if ((x0 > x1) && (y0 > y1)) {
                for (var i = min_x; i <= max_x; ++i) {map[min_y][i] = true;}
                for (var j = min_y; j <= max_y; ++j) {map[j][max_x] = true;}
                return ;
            }
            if ((x0 > x1) && (y0 <= y1)) {
                for (var i = min_x; i <= max_x; ++i) {map[min_y][i] = true;}
                for (var j = min_y; j <= max_y; ++j) {map[j][min_x] = true;}
                return ;
            }
            if ((x0 <= x1) && (y0 < y1)) {
                for (var i = min_x; i <= max_x; ++i) {map[max_y][i] = true;}
                for (var j = min_y; j <= max_y; ++j) {map[j][min_x] = true;}
                return ;
            }
        },

        /**
         * 区画を追加
         */
        _addRect: function (lx, ly, hx, hy) {
            var rect = {
                lx: lx, 
                ly: ly, 
                hx: hx, 
                hy: hy, 
                room: {}, 
                done_split_v: false,
                done_split_h: false
            };
            this.rectList.push(rect);
            return rect;
        },

        /**
         * 区画を分割する
         */
        _divideRect: function (parentRect) {
            // 再帰終了の条件
            if (parentRect.hy - parentRect.ly <= RECT_NUM_MIN * 2) {
                parentRect.done_split_v = true;
            }
            if (parentRect.hx - parentRect.lx <= RECT_NUM_MIN * 2) {
                parentRect.done_split_h = true;
            }
            if ((parentRect.done_split_v) &&
                (parentRect.done_split_h)) {
                return ;
            }

            // 再帰用child
            var childRect = this._addRect(parentRect.lx, parentRect.ly, parentRect.hx, parentRect.hy);

            // 縦に分割すべきか判断
            var rand = Math.rand(0, 1);
            if (!parentRect.done_split_v) {
                var divideY = Math.rand(parentRect.ly + RECT_NUM_MIN, parentRect.hy - RECT_NUM_MIN -1);
                parentRect.hy = divideY;
                childRect.ly = divideY;
                parentRect.done_split_v = true;
                childRect.done_split_v = true;
                this._addCouple(COUPLE_VERTICAL, parentRect, childRect);
                this._divideRect(parentRect);
                this._divideRect(childRect);
                return ;
            }
            // 横に分割すべきか判断
            if (!parentRect.done_split_h) {
                var divideX = Math.rand(parentRect.lx + RECT_NUM_MIN, parentRect.hx - RECT_NUM_MIN -1);
                parentRect.hx = divideX;
                childRect.lx = divideX;
                parentRect.done_split_h = true;
                childRect.done_split_h = true;
                this._addCouple(COUPLE_HORIZONAL, parentRect, childRect);
                this._divideRect(parentRect);
                this._divideRect(childRect);
                return ;
            }
        },

        /**
         * 部屋を追加
         */
        _addRoom: function (lx, ly, hx, hy) {
            var room = {
                lx: lx, ly: ly, hx: hx, hy: hy, room: {}
            };
            this.roomList.push(room);
            return room;
        },

        /**
         * 部屋を作成
         */
        _makeRoom: function () {
            var x, y, w, h;

            for (var i = 0; i < this.rectList.length; ++i) {
                var rect = this.rectList[i];
                w = Math.rand(ROOM_SIZE_MIN,                      rect.hx - rect.lx - (MARGIN_BETWEEN_RECT_ROOM * 2));
                h = Math.rand(ROOM_SIZE_MIN,                      rect.hy - rect.ly - (MARGIN_BETWEEN_RECT_ROOM * 2));
                x = Math.rand(rect.lx + MARGIN_BETWEEN_RECT_ROOM, rect.hx - MARGIN_BETWEEN_RECT_ROOM - w);
                y = Math.rand(rect.ly + MARGIN_BETWEEN_RECT_ROOM, rect.hy - MARGIN_BETWEEN_RECT_ROOM - h);

                rect.room = this._addRoom(x, y, x + w, y + h);
            }
        },

        /**
         * 部屋をつなげる
         */
        _addCouple: function (v_or_h, rect0, rect1) {
            var couple = {
                v_or_h: v_or_h, rect0: rect0, rect1: rect1
            };
            this.coupleList.push(couple);
            return couple;
        },
    });

})(game);
/**
 * AutoTile
 */
(function(ns) {
     
    /**
     * オートタイルを行うマップチップは、一つのマップチップ(口)を4分割(田)し
     * 4回に分けて描画を行う
     * 適切なマップチップを選択することで、道を繋げた描画を行うことができる
     *
     * 分割するマップチップは、以下のように名前をつける
     * +-+-+
     * |a|b|
     * +-+-+
     * |c|d|
     * +-+-+
     */
    // var IMAGE_TOPLEFT = tm.geom.Vector2(0, 0);
    // var TILE_SIZE = {
    //     width: 16,
    //     height: 16
    // };
    var TILE_PATTERN = {
        circle: {},
        column: {},
        row:    {},
        cross:  {},
        plain:  {},
    };
    var TILE_NAME = ["a", "b", "c", "d"];
    /**
     * wolf rpg editor形式のマップチップを分割
     * ※結局描画時に使ってない
     */
    for (var i = 0; i < 4; ++i) {
        // 円形のマップ情報
        TILE_PATTERN.circle[TILE_NAME[i]] = {}; // a,b,c,d
        TILE_PATTERN.circle[TILE_NAME[i]].id = i+1;
        // TILE_PATTERN.circle[TILE_NAME[i]].imagePosition = {
        //     topLeft:        IMAGE_TOPLEFT.x + ((i%2)            * TILE_SIZE.width),
        //     bottomRight:    IMAGE_TOPLEFT.y + ((((i/2) |0) + 0) * TILE_SIZE.height),
        // };

        // 縦の道となるマップ情報
        TILE_PATTERN.column[TILE_NAME[i]] = {}; // a,b,c,d
        TILE_PATTERN.column[TILE_NAME[i]].id = i+5;
        // TILE_PATTERN.column[TILE_NAME[i]].imagePosition = {
        //     topLeft:        IMAGE_TOPLEFT.x + ((i%2)            * TILE_SIZE.width),
        //     bottomRight:    IMAGE_TOPLEFT.y + ((((i/2) |0) + 2) * TILE_SIZE.height),
        // };
        
        // 横の道となるマップ情報
        TILE_PATTERN.row[TILE_NAME[i]] = {}; // a,b,c,d
        TILE_PATTERN.row[TILE_NAME[i]].id = i+9;
        // TILE_PATTERN.row[TILE_NAME[i]].imagePosition = {
        //     topLeft:        IMAGE_TOPLEFT.x + ((i%2)            * TILE_SIZE.width),
        //     bottomRight:    IMAGE_TOPLEFT.y + ((((i/2) |0) + 4) * TILE_SIZE.height),
        // };

        // 十字路となるマップ情報
        TILE_PATTERN.cross[TILE_NAME[i]] = {}; // a,b,c,d
        TILE_PATTERN.cross[TILE_NAME[i]].id = i+13;
        // TILE_PATTERN.cross[TILE_NAME[i]].imagePosition = {
        //     topLeft:        IMAGE_TOPLEFT.x + ((i%2)            * TILE_SIZE.width),
        //     bottomRight:    IMAGE_TOPLEFT.y + ((((i/2) |0) + 6) * TILE_SIZE.height),
        // };

        // 角がないマップ情報
        TILE_PATTERN.plain[TILE_NAME[i]] = {}; // a,b,c,d
        TILE_PATTERN.plain[TILE_NAME[i]].id = i+17;
        // TILE_PATTERN.plain[TILE_NAME[i]].imagePosition = {
        //     topLeft:        IMAGE_TOPLEFT.x + ((i%2)            * TILE_SIZE.width),
        //     bottomRight:    IMAGE_TOPLEFT.y + ((((i/2) |0) + 8) * TILE_SIZE.height),
        // };
    }

    /**
     * 隣接しているマップから、どのタイルを選択するのかを決定する情報をパターンにしておく
     *
     * パターンを決定する条件
     *  0: タイルが存在しないこと
     *  1:　タイルが存在すること
     * -1: どちらでもよい
     */
    var MAP_PATTERN = {
        /**
         * a に使用するタイルを決定するパターン
         */
        a: [
            {
                pattern: [ // 隣接するマップチップの配置がどうなっているのか
                    [ 1, 1,-1],
                    [ 1, 1,-1],
                    [-1,-1,-1]
                ],
                tile: TILE_PATTERN.plain.a // 使用するタイルを選択
            },{
                pattern: [
                    [ 0, 1,-1],
                    [ 1, 1,-1],
                    [-1,-1,-1]
                ],
                tile: TILE_PATTERN.cross.a
            },{
                pattern: [
                    [-1, 1,-1],
                    [ 0, 1,-1],
                    [-1,-1,-1]
                ],
                tile: TILE_PATTERN.column.a
            },{
                pattern: [
                    [-1, 0,-1],
                    [ 1, 1,-1],
                    [-1,-1,-1]
                ],
                tile: TILE_PATTERN.row.a
            },{
                pattern: [
                    [-1, 0,-1],
                    [ 0, 1,-1],
                    [-1,-1,-1]
                ],
                tile: TILE_PATTERN.circle.a
            },
        ],

        /**
         * b に使用するタイルを決定するパターン
         */
        b: [
            {
                pattern: [ // 隣接するマップチップの配置がどうなっているのか
                    [-1, 1, 1],
                    [-1, 1, 1],
                    [-1,-1,-1]
                ],
                tile: TILE_PATTERN.plain.b // 使用するタイルを選択
            },{
                pattern: [
                    [-1, 1, 0],
                    [-1, 1, 1],
                    [-1,-1,-1]
                ],
                tile: TILE_PATTERN.cross.b
            },{
                pattern: [
                    [-1, 1,-1],
                    [-1, 1, 0],
                    [-1,-1,-1]
                ],
                tile: TILE_PATTERN.column.b
            },{
                pattern: [
                    [-1, 0,-1],
                    [-1, 1, 1],
                    [-1,-1,-1]
                ],
                tile: TILE_PATTERN.row.b
            },{
                pattern: [
                    [-1, 0,-1],
                    [-1, 1, 0],
                    [-1,-1,-1]
                ],
                tile: TILE_PATTERN.circle.b
            },
        ],

        /**
         * c に使用するタイルを決定するパターン
         */
        c: [
            {
                pattern: [ // 隣接するマップチップの配置がどうなっているのか
                    [-1,-1,-1],
                    [ 1, 1,-1],
                    [ 1, 1,-1]
                ],
                tile: TILE_PATTERN.plain.c // 使用するタイルを選択
            },{
                pattern: [
                    [-1,-1,-1],
                    [ 1, 1,-1],
                    [ 0, 1,-1]
                ],
                tile: TILE_PATTERN.cross.c
            },{
                pattern: [
                    [-1,-1,-1],
                    [ 0, 1,-1],
                    [-1, 1,-1]
                ],
                tile: TILE_PATTERN.column.c
            },{
                pattern: [
                    [-1,-1,-1],
                    [ 1, 1,-1],
                    [-1, 0,-1]
                ],
                tile: TILE_PATTERN.row.c
            },{
                pattern: [
                    [-1,-1,-1],
                    [ 0, 1,-1],
                    [-1, 0,-1]
                ],
                tile: TILE_PATTERN.circle.c
            },
        ],

        /**
         * d に使用するタイルを決定するパターン
         */
        d: [
            {
                pattern: [ // 隣接するマップチップの配置がどうなっているのか
                    [-1,-1,-1],
                    [-1, 1, 1],
                    [-1, 1, 1]
                ],
                tile: TILE_PATTERN.plain.d // 使用するタイルを選択
            },{
                pattern: [
                    [-1,-1,-1],
                    [-1, 1, 1],
                    [-1, 1, 0]
                ],
                tile: TILE_PATTERN.cross.d
            },{
                pattern: [
                    [-1,-1,-1],
                    [-1, 1, 0],
                    [-1, 1,-1]
                ],
                tile: TILE_PATTERN.column.d
            },{
                pattern: [
                    [-1,-1,-1],
                    [-1, 1, 1],
                    [-1, 0,-1]
                ],
                tile: TILE_PATTERN.row.d
            },{
                pattern: [
                    [-1,-1,-1],
                    [-1, 1, 0],
                    [-1, 0,-1]
                ],
                tile: TILE_PATTERN.circle.d
            },
        ]
    };

    /**
     * 描画するマップチップの場所を自動選択する
     */
    ns.AutoTile = tm.createClass({
        init: function (map, options) {
        	// レイヤーの初期化
        	// var layer1 = _initLayerMap(createdMap);
        	// var layer2 = _initLayerMap(createdMap);

        	// 書き換えるマップチップ
        	this.from = 1;

        	/*
        	 ファイル内容
        	 array[
			 	[0,0,0,0,1,1,1,0,0,0],
			 	[0,0,0,1,1,1,1,1,0,0],
			 	...
        	 ]
        	 こんな感じ
        	 */
        	this.map = map;

        	// 返すデータを作成
        	// var mapdata = {
	        // 	layer1: layer1,
	        // 	layer2: layer2,
	        // 	imageWidth : imageLayer.width,
	        // 	imageHeight: imageLayer.height,
	        // 	chipWidth  : 32,
	        // 	chipHeight : 32,
	        // 	tileWidth  : 16,
	        // 	tileHeight : 16,
	        // 	idList: {
	        // 		layer1: 0,
	        // 		layer2: 1,
	        // 	}
        	// };
        	// this.mapdata = mapdata;

        	// マップ外もオートタイル判定に使うかどうか
        	// true : オートタイル判定OKとして、道をマップ外まで伸ばす
        	// false: オートタイル判定NGとして、道をマップ外まで伸ばさない
        	this.isMatchOutMap = false; //options.isMatchOutMap || false;

        	// オートタイルデータに変換する
        	this.autoTileMap = this.transformTile();
        },

		/**
         * 作成したマップデータを返す
	     * +-+-+
	     * |a|b|
	     * +-+-+
	     * |c|d|
	     * +-+-+
         */
        transformTile: function () {
        	var resultMap = [];

        	for (var i = 0; i < this.map.length; ++i) {
        		resultMap[i] = [];
        		for (var j = 0; j < this.map[i].length; ++j) {
        			var mapChipId = this.map[i][j];

        			// 書き換えるマップチップIDじゃなければ書き換えない
        			if (mapChipId !== this.from) {
        				resultMap[i].push(mapChipId);
        				continue;
        			}

        			var a = this.checkPattern("a", this.map, i, j);
        			var b = this.checkPattern("b", this.map, i, j);
        			var c = this.checkPattern("c", this.map, i, j);
        			var d = this.checkPattern("d", this.map, i, j);

        			// マップデータをタイル状(4分割したもの)に書き換える
        			resultMap[i].push({
        				tile: {
        					a: a,
        					b: b,
        					c: c,
        					d: d
        				},
        				mapChipId: mapChipId
        			});
        		}
        	}

        	return resultMap;
        },

        /**
         * マップパターンと一致しているか調べる
         */
        checkPattern: function (tileName, neighborMapChip, fromIndexI, fromIndexJ) {
        	// 全5パターンの走査
        	var mapPattern = MAP_PATTERN[tileName];
        	for (var i = 0; i < mapPattern.length; ++i) {
        		// 一つのパターンの中身を走査
        		var isMatch = true;
        		var tilePattern = mapPattern[i].pattern;

        		// タイルの中身を走査(二重ループ計9回)
        		// タイルのマッチパターン(0:一致してはならない、1:一致しなければならない、-1:どちらでもよい)を取得して、マッチしているか調べる
        		for (var j = 0; j < tilePattern.length; ++j) {
        			for (var k = 0; k < tilePattern[j].length; ++k) {
        				// マップチップのIDを取得する
        				if (typeof neighborMapChip[fromIndexI+j-1] !== "undefined") {
        					var neighborMapChipId = neighborMapChip[fromIndexI+j-1][fromIndexJ+k-1];
        				}
        				else {
        					var neighborMapChipId = null;
        				}
        				// パターンに合致しているか調べる
        				var is = this._checkNeighborPattern(
        					tilePattern[j][k],
        					this.from,
        					neighborMapChipId);

        				if (!is) {
        					isMatch = false;
        					continue;
        				}
        			}
        		}

    			// 前パターンマッチしていたら、そのパターンを返す
    			if (isMatch) {
    				return mapPattern[i].tile;
    			}
        	}

        	// ここまで来たらエラー
        	console.log("auto tile error!: マップパターンのマッチングがおかしいです" + " tileName : " + tileName + " index i : " + fromIndexI + " index j : " + fromIndexJ);
        	console.log(neighborMapChip[fromIndexI-1][fromIndexJ-1] + " " + neighborMapChip[fromIndexI-1][fromIndexJ] + " " + neighborMapChip[fromIndexI-1][fromIndexJ+1]);
        	console.log(neighborMapChip[fromIndexI-0][fromIndexJ-1] + " " + neighborMapChip[fromIndexI-0][fromIndexJ] + " " + neighborMapChip[fromIndexI-0][fromIndexJ+1]);
        	console.log(neighborMapChip[fromIndexI+1][fromIndexJ-1] + " " + neighborMapChip[fromIndexI+1][fromIndexJ] + " " + neighborMapChip[fromIndexI+1][fromIndexJ+1]);
        },

        _checkNeighborPattern: function (pattern, from, neighbor) {
        	// データがundefined,nullの場合は、マップ外を見ようとしている
        	if (typeof neighbor === "undefined" || neighbor === null) {
        		// 一致させるようにする
        		if (this.isMatchOutMap) {
        			neighbor = from;
        		}
        		// 一致させないようにする
        		else {
					neighbor = null;
        		}
        	}
        	
        	// 合致しているか調べる
        	switch (pattern) {
        		case -1:
        			// チェック不要
        			return true;
        			break;
        		case 0:
        			// 一致してはいけない
	        		if (from !== neighbor) {
	        			return true;
	        		}
	        		return false;
	        		break;
	        	case 1:
	        		// 一致しなければならない
	        		if (from === neighbor) {
	        			return true;
	        		}
	        		return false;
	        		break;
	        	default:
	        		// error
	        		return null;
        	}
        },

        /**
         * 作成したマップデータを返す
         */
        get: function () {
        	return this.autoTileMap;
        },

   //      /**
   //       * レイヤーの初期化 マップチップは4分割するので、長さを二倍にする
   //       */
   //      _initLayerMap: function (createdMap) {
			// var layer = [];
   //      	for (var i = 0; i < createdMap.length*2; ++i) {
   //      		layer[i] = [];
   //      		for (var j = 0; j < createdMap[0].length*2; ++j) {
   //      			layer[i][j] = 0;
   //      		}
   //      	}
   //      },
    });
})(game);
/**
 * MapChip
 */
(function(ns) {

	var counterObject = function(obj) {
	    var count = 0;
	    for (var key in obj) {
	        ++count;
	    }
	    return count;
	};

    ns.MapChip = tm.createClass({
        init: function(param) {
            this.chips     = param.chips;
            this.map       = param.map;
            this.autotile  = param.autotile;
            this.collision = param.collision;
            this.frames    = [];

            var objectNum = counterObject(param.chips);
            this.images = [];
            for (var i = 0; i < objectNum; ++i) {
            	this.images.push(tm.asset.AssetManager.get(param.chips[i].image));

	            if (this.images[i].loaded === false) {
	                this.images[i].element.addEventListener("load", function() {
	                    this._calcFrames(i, param.chips);
	                }.bind(this), false);
	            }
	            else {
	                this._calcFrames(i, param.chips);
	            }
            }
        },

        getMapChip: function(chips, index) {
            return this.frames[chips][index];
        },
        
        _calcFrames: function(chipsNum, chips) {
            var w = chips[chipsNum].width;
            var h = chips[chipsNum].height;
            var row = ~~(this.images[chipsNum].width / w); // 1chipの横の個数
            var col = ~~(this.images[chipsNum].height/ h); // 1chipの縦の個数
            this.frames[chipsNum] = [];
            
            if (!chips[chipsNum].count) chips[chipsNum].count = row*col; // 指定されてなかったら全てカウントする

            for (var i=0,len=chips[chipsNum].count; i<len; ++i) {
                var x   = i%row;		// 何列目か(0スタート)
                var y   = (i/row)|0;	// 何段目か(0スタート)
                var rect = {
                    x:x*w,				// 切り抜く画像のleft座標
                    y:y*h,				// 切り抜く画像のtop座標
                    width: w,			// 画像の幅(pixel)
                    height: h 			// 画像の高さ(pixel)
                };
                this.frames[chipsNum].push(rect); // 画像の切り抜きに必要な数値をまとめる
            }
        }
    });

})(game);
/**
 * MapSprite
 */
(function(ns) {

    ns.MapSprite = tm.createClass({

        superClass: tm.app.Shape,

        /**
         * 初期化
         * ※width,heightで指定する大きさはmapchip一つの大きさ
         */
        init: function(mapchip, mapChipWidth, mapChipHeight)
        {
            var width  = mapchip.map[0].length * (mapChipWidth  || 16);
            var height = mapchip.map.length    * (mapChipHeight || 16);
            this.superInit(width, height);
            
            this.mapChipWidth  = mapChipWidth  || 16;
            this.mapChipHeight = mapChipHeight || 16;
            
            this.mapchip = mapchip; // マップチップの情報や画像情報が格納されてる
            this.currentFrame = 0;
            this.currentFrameIndex = 0;

            this.createMap();
        },

        /**
         * 描画時のマップ(canvas)を作成
         */
        createMap: function() {
        	for (var i = 0; i < this.mapchip.map.length; ++i) {
        		for (var j = 0; j < this.mapchip.map[i].length; ++j) {
                    // 数値であれあば通常通り描画
                    if (typeof this.mapchip.autotile.autoTileMap[i][j] === "number") {
                        var drawingMapChipID = this.mapchip.map[i][j];

                        var srcRect = this.mapchip.getMapChip(drawingMapChipID, 4);//this.currentFrame);
                        var element = this.mapchip.images[drawingMapChipID].element;

                        var dx =  j*this.mapChipWidth;
                        var dy =  i*this.mapChipHeight;

                        // http://www.html5.jp/canvas/ref/method/drawImage.html
                        this.canvas.drawImage(
                            element,
                            srcRect.x,
                            srcRect.y,
                            srcRect.width,
                            srcRect.height,
                            dx,
                            dy,
                            this.mapChipWidth,
                            this.mapChipHeight);
                    }
                    // オートタイルだった場合は四回に分けて描画(ただの数値でなければOK)
                    else {
                        var drawingMapChipID = this.mapchip.map[i][j];
                        var element = this.mapchip.images[drawingMapChipID].element;

                        var dx =  j*this.mapChipWidth;
                        var dy =  i*this.mapChipHeight;

                        // 描画するタイルを取得
                        var tile = this.mapchip.autotile.autoTileMap[i][j].tile;
                        var a = tile.a.id-1;
                        var b = tile.b.id-1;
                        var c = tile.c.id-1;
                        var d = tile.d.id-1;

                        var srcRect = this.mapchip.getMapChip(drawingMapChipID, a);
                        this.canvas.drawImage(
                            element,
                            srcRect.x,
                            srcRect.y,
                            srcRect.width,
                            srcRect.height,
                            dx,
                            dy,
                            this.mapChipWidth/2,
                            this.mapChipHeight/2);

                        var srcRect = this.mapchip.getMapChip(drawingMapChipID, b);
                        this.canvas.drawImage(
                            element,
                            srcRect.x,
                            srcRect.y,
                            srcRect.width,
                            srcRect.height,
                            dx+this.mapChipWidth/2,
                            dy,
                            this.mapChipWidth/2,
                            this.mapChipHeight/2);

                        var srcRect = this.mapchip.getMapChip(drawingMapChipID, c);
                        this.canvas.drawImage(
                            element,
                            srcRect.x,
                            srcRect.y,
                            srcRect.width,
                            srcRect.height,
                            dx,
                            dy+this.mapChipHeight/2,
                            this.mapChipWidth/2,
                            this.mapChipHeight/2);

                        var srcRect = this.mapchip.getMapChip(drawingMapChipID, d);
                        this.canvas.drawImage(
                            element,
                            srcRect.x,
                            srcRect.y,
                            srcRect.width,
                            srcRect.height,
                            dx+this.mapChipWidth/2,
                            dy+this.mapChipHeight/2,
                            this.mapChipWidth/2,
                            this.mapChipHeight/2);
                    }
        		}
        	}
        },

        /**
         * どこのマップチップに所属しているか取得(Map左上が0,0となる座標で指定)
         */
        getBelong: function(x, y) {
        	var col = (x / this.mapChipWidth)  |0;
        	var row = (y / this.mapChipHeight) |0;

        	var result = {
        		col:       col,
        		row:       row,
        		map:       this.mapchip.map[row][col],
        		collision: this.mapchip.collision[row][col],
        	};
        	return result;
        },

        /**
         * 上下左右のマップチップのcollisionを取得
         */
        getCrossCollision: function(col, row) {
        	var limitDown  = this.mapchip.map.length-1;
        	var limitRight = this.mapchip.map[0].length-1;

        	var up    = (row > 0)          ? this.mapchip.collision[row-1][col] : null;
        	var down  = (row < limitDown)  ? this.mapchip.collision[row+1][col] : null;
        	var left  = (col > 0)          ? this.mapchip.collision[row][col-1] : null;
        	var right = (col < limitRight) ? this.mapchip.collision[row][col+1] : null;

        	var result = {
        		up:    up,
        		down:  down,
        		left:  left,
        		right: right,
        	};

        	return result;
        },

        /**
         * マップチップのrectを取得
         */
        getRect: function(col, row) {
        	var up    = row     * this.mapChipHeight;
        	var down  = (row+1) * this.mapChipHeight-1;
        	var left  = col     * this.mapChipWidth;
        	var right = (col+1) * this.mapChipWidth -1;

        	var result = {
        		up: up,
        		down: down,
        		left: left,
        		right: right
        	};

        	return result;
        }
    });

})(game);
/**
 * Map
 */
(function(ns) {

    // コマ送りアニメーションの基本的な書式を利用
    var IMAGE_WIDTH  = 32;
    var IMAGE_HEIGHT = 160;
    var IMAGE_DIVIDE_COLUMN = 1;
    var IMAGE_DIVIDE_ROW    = 5;
    var CHIP_WIDTH     = IMAGE_WIDTH;
    var CHIP_HEIGHT    = IMAGE_HEIGHT/IMAGE_DIVIDE_ROW;

    // PLAYERの位置を微調整(マップのヒット判定を綺麗に行うため)
    var PLAYER_POSITION_Y = 36;

    // どこに衝突しているか
    var HIT_UP    = 0x01;
    var HIT_DOWN  = 0x02;
    var HIT_LEFT  = 0x04;
    var HIT_RIGHT = 0x08;

	ns.Map = tm.createClass({
		superClass : ns.MapSprite,

		init: function (pad) {
			// マップの自動生成
            var mapSize = Math.rand(20, 31);
            // var mapSize = 10;
			var map = ns.GenerateMap(mapSize, mapSize);

            // 水の部分をオートタイル化する
            var autotile = ns.AutoTile(map.map);

			// マップデータの作成
			var mapchip = ns.MapChip({
                chips: {
                	0: {width: CHIP_WIDTH,   height: CHIP_HEIGHT,   image: "Dirt1_pipo",  count: 5},
                	1: {width: CHIP_WIDTH/2, height: CHIP_HEIGHT/2, image: "Water2_pipo", count: 20},
                	2: {width: CHIP_WIDTH,   height: CHIP_HEIGHT,   image: "Grass1_pipo", count: 5},
                },
                map: map.map,
                autotile: autotile,
                collision: map.collision
            });

            this.superInit(mapchip, 64, 64);

            // 歩ける場所の数
            this.walkMapNum = map.walkMapNum;

            // 歩ける場所に何かを生成したら覚えておく
            this.isCreateSomething = [];

            // キャラではなくマップが移動する 加速度
            this.velocity = tm.geom.Vector2(0, 0);

            // padがあれば追加する
            this.pad = pad || false;

            // 移動スピード
            this.speed = 0;

            // マップ上に敵を設置する場合
            this.isEnemy = false;

            // スクリーン中心にプレイヤーを設置するか
            this.isPlayer = false;

            // 次のステージに進むかどうかのフラグ
            this._isNextStage = false;
		},

		update: function (app) {
			// マップ移動
			this._move(app);

            // 宝箱とのヒット判定
            this._isHitTreasureBox(app);

            // プレイヤーと階段のヒット判定
            this._isHitStairs(app);
		},

        isNextStage: function () {
            return this._isNextStage;
        },

        setStairs: function () {
            // 階段
            var stairs = tm.app.Sprite("stairs", 64, 64);
            var stairsPosition = this.getRandomSafeMapChipPosition();
            stairsPosition = this.mapLeftTopToMapCenter(
                stairsPosition.x * this.mapChipWidth + this.mapChipWidth/2,
                stairsPosition.y * this.mapChipHeight);
            stairs.position.set(stairsPosition.x, stairsPosition.y + stairs.height/2);
            this.stairs = stairs;

            this.addChild(stairs);
        },

        setEnemyGroup: function (enemyGroup) {
            this.isEnemy = true;
            this.enemyGroup = enemyGroup;
            this.addChild(enemyGroup); // MAPの中心座標が0,0となる

            this.enemyDeadAnimationGroup = tm.app.CanvasElement();
            this.addChild(this.enemyDeadAnimationGroup);
        },

        setEnemyDeadAnimation: function (animation) {
            this.enemyDeadAnimationGroup.addChild(animation);
        },

        setItemGroup: function (itemGroup) {
            this.itemGroup = itemGroup;
            this.addChild(itemGroup); // MAPの中心座標が0,0となる
        },

        addItem: function (dropItem) {
            this.itemGroup.addChild(dropItem);
        },

        setPlayer: function (initPosition) {
            // プレイヤーの位置を別として保持
            this.isPlayer = true;
            this.playerPosition = tm.geom.Vector2(
                this.width/2  + (ns.SCREEN_WIDTH/2  - initPosition.x),
                this.height/2 + (ns.SCREEN_HEIGHT/2 - initPosition.y) + PLAYER_POSITION_Y);

            // プレイヤーのヒット判定用にポイントを作成
            var playerElement = tm.app.Object2D();
            playerElement.radius = 20;
            this.playerElement = playerElement;
        },

        screenLeftTopToMapCenter: function (x, y) {
            var result = tm.geom.Vector2(x - this.x, y - this.y);
            return result;
        },
        screenLeftTopToMapLeftTop: function (x, y) {
            var toMapCenter = this.screenLeftTopToMapCenter(x, y);
            var result = tm.geom.Vector2(toMapCenter.x + this.width/2, toMapCenter.y + this.height/2);
            return result;
        },
        mapLeftTopToMapCenter: function (x, y) {
            var result = tm.geom.Vector2(-this.width/2 + x, -this.height/2 + y);
            return result;
        },
        mapCenterToMapLeftTop: function (x, y) {
            var result = tm.geom.Vector2(this.width/2 + x, this.height/2 + y);
            return result;
        },
        mapCenterToScreenTopLeft: function (x, y) {
            var result = tm.geom.Vector2(this.x + x, this.y + y);
            return result;
        },
        mapLeftTopToScreenTopLeft: function (x, y) {
            var mapCenter = this.mapLeftTopToMapCenter(x, y);
            var screenTopLeft = this.mapCenterToScreenTopLeft(mapCenter.x, mapCenter.y);
            return screenTopLeft;
        },

        initMapPosition: function (initPosition) {
            // セットしたポジションの初期位置を保持
            this.initPosition = tm.geom.Vector2(initPosition.x, initPosition.y);
            // ポジションのセット
            this.position.set(initPosition.x, initPosition.y);
        },

        /**
         * 歩ける場所からランダムに選んで返す(マップの左上を0,0)
         */
        getRandomSafeMapChipPosition: function () {
            // 既に何かを生成していないか調べる
            var mapPosition = Math.rand(0, this.walkMapNum-1);
            var isBreak = true;
            while (true) {
                for (var i = 0; i < this.isCreateSomething.length; ++i) {
                    if (this.isCreateSomething[i] === mapPosition) {
                        mapPosition = Math.rand(0, this.walkMapNum-1);
                        isBreak = false;
                        break;
                    }
                    else {
                        isBreak = true;
                    }
                }
                if (isBreak && this.isCreateSomething[i] !== mapPosition) {
                    break;
                }
            }

            // 歩ける場所を返す
            var counter = 0;
            for (var i = 0; i < this.mapchip.collision.length; ++i) {
                for (var j = 0; j < this.mapchip.collision[i].length; ++j) {
                    // 歩ける場所かどうか
                    if (this.mapchip.collision[i][j] === 1) {
                        // ランダムに選んだ場所かどうか
                        if (counter === mapPosition) {
                            // ここだ！ マップの左上を0,0とした座標で数値を返す
                            var result = {
                                x: j,
                                y: i
                            };
                            this.isCreateSomething.push(counter);
                            return result;
                        }
                        else {
                            ++counter;
                        }
                    }
                }
            }
        },

		_move: function (app) {
            // 移動速度を取得
            var speed = 0;
            if (this.isPlayer && app.currentScene.player) {
                speed = app.currentScene.player.getSpeed();
            }
			// 移動方向の取得
            var angle = app.keyboard.getKeyAngle();
            if (angle !== null) {
                this.velocity.setDegree(angle, 1);
                this.velocity.x *= -1;
                this.speed = speed || 6;
            }
            else if (this.pad && this.pad.isTouching) {
                var padAngle = this.pad.angle;
                if   (padAngle < 0) {padAngle *= -1;}
                else                {padAngle = 360 - padAngle;}
                this.velocity.setDegree(padAngle, 1);
                this.velocity.x *= -1;
                this.speed = speed || 6;
            }
            // プレイヤーの移動
            if (this.isPlayer) {
                this.velocity = this._playerMove();
            }
            // 敵の移動
            if (this.isEnemy) {
                this._enemyMove();
            }
            
            this.position.add(tm.geom.Vector2.mul(this.velocity, this.speed));

            this.speed = 0;
		},

        _enemyMove: function () {
            for (var i = 0; i < this.enemyGroup.children.length; ++i) {
                var velocity = this.enemyGroup.children[i].velocity.clone();
                var position = this.enemyGroup.children[i].position.clone();
                position = this.mapCenterToMapLeftTop(position.x, position.y);
                var speed    = this.enemyGroup.children[i].speed;
                velocity.x *= -1;
                velocity.y *= -1;
                var isHit = this._isHitCollisionMap(
                    position.x,
                    position.y,
                    velocity,
                    speed);
                if (isHit & HIT_UP)    { velocity.y = 0; }
                if (isHit & HIT_DOWN)  { velocity.y = 0; }
                if (isHit & HIT_LEFT)  { velocity.x = 0; }
                if (isHit & HIT_RIGHT) { velocity.x = 0; }

                // 敵の位置を更新
                this.enemyGroup.children[i].position.add(tm.geom.Vector2.mul(velocity, speed));
            }
        },

        _playerMove: function () {
            var playerVelocity = this.velocity.clone();
            playerVelocity.x *= -1;
            playerVelocity.y *= -1;
            var isHit = this._isHitCollisionMap(
                this.playerPosition.x,
                this.playerPosition.y,
                playerVelocity,
                this.speed);
            if (isHit & HIT_UP)    { playerVelocity.y = 0; }
            if (isHit & HIT_DOWN)  { playerVelocity.y = 0; }
            if (isHit & HIT_LEFT)  { playerVelocity.x = 0; }
            if (isHit & HIT_RIGHT) { playerVelocity.x = 0; }

            // プレイやーの位置を更新
            this.playerPosition.add(tm.geom.Vector2.mul(playerVelocity, this.speed));

            // プレイヤーがいたらマップチップとのヒット判定を行うので、マップ移動用に移動量を返す
            playerVelocity.x *= -1;
            playerVelocity.y *= -1;
            return playerVelocity.clone();
        },

        // マップとのヒット判定
        _isHitCollisionMap: function (x, y, velocity, speed) {
            // 返す値
            var result = 0x00;
            // 所属しているマップチップを取得
            var chip = this.getBelong(x, y);
            // 所属しているマップチップのrectを取得
            var chipRect = this.getRect(chip.col, chip.row);
            // 上下左右のマップチップのcollisionを取得
            var crossCollision = this.getCrossCollision(chip.col, chip.row);
            // 移動量を取得
            var movingAmount = tm.geom.Vector2.mul(velocity, speed);
            // 移動後の位置が衝突しているか
            if (crossCollision.up === null || crossCollision.up === 0) {
                var movedY = y + movingAmount.y;
                if (movedY < chipRect.up)   { result |= HIT_UP; } // とりあえず移動させない(マップぴったりに合わせたほうがいいかも)
            }
            if (crossCollision.down === null || crossCollision.down === 0) {
                var movedY = y + movingAmount.y;
                if (movedY > chipRect.down) { result |= HIT_DOWN; }
            }
            if (crossCollision.left === null || crossCollision.left === 0) {
                var movedX = x + movingAmount.x;
                if (movedX < chipRect.left) { result |= HIT_LEFT; }
            }
            if (crossCollision.right === null || crossCollision.right === 0) {
                var movedX = x + movingAmount.x;
                if (movedX > chipRect.right) { result |= HIT_RIGHT; }
            }
            return result;
        },

        // プレイヤーと宝箱とのヒット判定
        _isHitTreasureBox: function (app) {
            if (this.isPlayer) {
                var items = this.itemGroup.children;
                var playerPosition = this.mapLeftTopToMapCenter(this.playerPosition.x, this.playerPosition.y);
                this.playerElement.position.set(playerPosition.x, playerPosition.y);

                for (var i = 0; i < items.length; ++i) {
                    var itemPosition = items[i].position.clone();
                    var getItem = items[i].isHit(this.playerElement);
                    if (getItem !== null) {
                        // 表示場所を設定
                        app.currentScene.windows.add(getItem.name + " を手に入れた");

                        // プレイヤーにアイテム追加(このままの処理だったらドロップアイテムインスタンスが生き続ける)
                        var player = app.currentScene.getChildByName("player");
                        player.addItem(getItem);

                        // 音
                        tm.asset.AssetManager.get("openTreasure").clone().play();
                    }
                }
            }
        },

        // プレイヤーと階段とのヒット判定
        _isHitStairs: function (app) {
            if (this.isPlayer) {
                var playerPosition = this.mapLeftTopToMapCenter(this.playerPosition.x, this.playerPosition.y);
                this.playerElement.position.set(playerPosition.x, playerPosition.y);

                if (this.stairs.isHitElementCircle(this.playerElement)) {
                    // 次のステージへの遷移処理はOpeningSceneクラスで行う
                    this._isNextStage = true;
                }
            }
        },

	});

})(game);
/**
 * AnimationCharactor
 */
(function(ns) {

    var DOWN_NEUTRAL  = 1;
    var UP_NEUTRAL    = 19;
    var LEFT_NEUTRAL  = 7;
    var RIGHT_NEUTRAL = 13;

    var UPLEFT_NEUTRAL    = 16;
    var UPRIGHT_NEUTRAL   = 22;
    var DOWNLEFT_NEUTRAL  = 4;
    var DOWNRIGHT_NEUTRAL = 10;

    var ANGLE_LEFT      = 180;
    var ANGLE_UPLEFT    = 135;
    var ANGLE_UP        = 90;
    var ANGLE_UPRIGHT   = 45;
    var ANGLE_RIGHT     = 0;
    var ANGLE_DOWNRIGHT = 315;
    var ANGLE_DOWN      = 270;
    var ANGLE_DOWNLEFT  = 225;

    // コマ送りアニメーションの基本的な書式を利用
    var IMAGE_WIDTH  = 120;
    var IMAGE_HEIGHT = 112;
    var IMAGE_DIVIDE_COLUMN = 6;
    var IMAGE_DIVIDE_ROW    = 4;
    var IMAGE_ANIM_COUNT    = 24; // 枚数

    ns.AnimationCharactor = tm.createClass({
        superClass : tm.app.AnimationSprite,

        init: function (imageName, frame, drawImageScaleSize) {

            frame = frame || {
                width:  IMAGE_WIDTH/IMAGE_DIVIDE_COLUMN,
                height: IMAGE_HEIGHT/IMAGE_DIVIDE_ROW,
                count:  IMAGE_ANIM_COUNT
            };

            drawImageScaleSize = drawImageScaleSize || 4;

            var ss = tm.app.SpriteSheet({
                image: imageName,
                frame: frame,
                animations: {
                    "onlydown": {
                        frames: [DOWN_NEUTRAL, DOWN_NEUTRAL+1, DOWN_NEUTRAL, DOWN_NEUTRAL-1],
                        next: "onlydown",
                        frequency: 5,
                    },

                    "onlyup": {
                        frames: [UP_NEUTRAL, UP_NEUTRAL+1, UP_NEUTRAL, UP_NEUTRAL-1],
                        next: "onlyup",
                        frequency: 5,
                    },

                    "onlyleft": {
                        frames: [LEFT_NEUTRAL, LEFT_NEUTRAL+1, LEFT_NEUTRAL, LEFT_NEUTRAL-1],
                        next: "onlyleft",
                        frequency: 5,
                    },

                    "onlyright": {
                        frames: [RIGHT_NEUTRAL, RIGHT_NEUTRAL+1, RIGHT_NEUTRAL, RIGHT_NEUTRAL-1],
                        next: "onlyright",
                        frequency: 5,
                    },

                    "upleft": {
                        frames: [UPLEFT_NEUTRAL, UPLEFT_NEUTRAL+1, UPLEFT_NEUTRAL, UPLEFT_NEUTRAL-1],
                        next: "upleft",
                        frequency: 5,
                    },

                    "upright": {
                        frames: [UPRIGHT_NEUTRAL, UPRIGHT_NEUTRAL+1, UPRIGHT_NEUTRAL, UPRIGHT_NEUTRAL-1],
                        next: "upright",
                        frequency: 5,
                    },

                    "downleft": {
                        frames: [DOWNLEFT_NEUTRAL, DOWNLEFT_NEUTRAL+1, DOWNLEFT_NEUTRAL, DOWNLEFT_NEUTRAL-1],
                        next: "downleft",
                        frequency: 5,
                    },

                    "downright": {
                        frames: [DOWNRIGHT_NEUTRAL, DOWNRIGHT_NEUTRAL+1, DOWNRIGHT_NEUTRAL, DOWNRIGHT_NEUTRAL-1],
                        next: "downright",
                        frequency: 5,
                    },
                }
            });

            this.superInit(ss, frame.width*drawImageScaleSize, frame.height*drawImageScaleSize);

            // 向いている方向を保持
            this.velocity = tm.geom.Vector2(0, 0);

            // アニメーションさせる場合に指定
            this.isAnimation = true;

            // 操作を受け付けるか指定
            this.isInput = false;

            // ランダム移動を受け付けるか指定
            this.isAuto = false;

            // padがあれば追加する
            this.pad = false;

            // 向いている方向を保持
            this.angle = 270;

            // 歩くスピード
            this.speed = 6;
        },

        // 入力でパッドも使うならセットする
        setInputPad: function (pad) {
            this.pad = pad || false;
        },

        // 向いている方向を決める
        directWatch: function (angle) {
            if (this._exceptDirectWatch(angle)) {
                if (     ANGLE_DOWN      - 22.5 < angle && angle <= ANGLE_DOWN      + 22.5) { this.gotoAndPlay("onlydown"); }
                else if (ANGLE_DOWNLEFT  - 22.5 < angle && angle <= ANGLE_DOWNLEFT  + 22.5) { this.gotoAndPlay("downleft"); }
                else if (ANGLE_LEFT      - 22.5 < angle && angle <= ANGLE_LEFT      + 22.5) { this.gotoAndPlay("onlyleft"); }
                else if (ANGLE_UPLEFT    - 22.5 < angle && angle <= ANGLE_UPLEFT    + 22.5) { this.gotoAndPlay("upleft"); }
                else if (ANGLE_UP        - 22.5 < angle && angle <= ANGLE_UP        + 22.5) { this.gotoAndPlay("onlyup"); }
                else if (ANGLE_UPRIGHT   - 22.5 < angle && angle <= ANGLE_UPRIGHT   + 22.5) { this.gotoAndPlay("upright"); }
                else if (ANGLE_DOWNRIGHT + 22.5 < angle || angle <= ANGLE_RIGHT     + 22.5) { this.gotoAndPlay("onlyright"); }
                else if (ANGLE_DOWNRIGHT - 22.5 < angle && angle <= ANGLE_DOWNRIGHT + 22.5) { this.gotoAndPlay("downright"); }
            }
        },

        // 入力を受け付けてアニメーションする
        inputAnimation: function (app) {
            // 入力受付
            if (this.isInput) {
                var angle = app.keyboard.getKeyAngle();
                if (angle !== null && this.isAnimation) {
                    this.velocity.setDegree(angle, 1);
                    this.velocity.y *= -1;
                    this.directWatch(angle);
                    this.angle = angle;
                }
                // タッチパネルによる速度設定
                else if (this.pad && this.pad.isTouching) {

                    var padAngle = this.pad.angle;
                    if   (padAngle < 0) {padAngle *= -1;}
                    else                {padAngle = 360 - padAngle;}
                    this.velocity.setDegree(padAngle, 1);
                    this.velocity.y *= -1;
                    this.directWatch(padAngle);
                    this.angle = padAngle;
                }
                else {
                    this.paused = true;
                }
                // console.log("x : " + this.x + " y : " + this.y);
            }
        },

        // 指定方向以外の向きか調べる
        _exceptDirectWatch: function (angle) {
            if (this.currentAnimation) {
                if (this.currentAnimation.next.indexOf("onlydown", 0) !== -1) {
                    if (ANGLE_DOWN - 22.5 < angle && angle <= ANGLE_DOWN + 22.5) { this.paused = false; return false; }
                    else { return true; }
                }
                else if (this.currentAnimation.next.indexOf("downleft", 0) !== -1) {
                    if (ANGLE_DOWNLEFT - 22.5 < angle && angle <= ANGLE_DOWNLEFT + 22.5) { this.paused = false; return false; }
                    else { return true; }
                }
                else if (this.currentAnimation.next.indexOf("onlyleft", 0) !== -1) {
                    if (ANGLE_LEFT - 22.5 < angle && angle <= ANGLE_LEFT + 22.5) { this.paused = false; return false; }
                    else { return true; }
                }
                else if (this.currentAnimation.next.indexOf("upleft", 0) !== -1) {
                    if (ANGLE_UPLEFT - 22.5 < angle && angle <= ANGLE_UPLEFT + 22.5) { this.paused = false; return false; }
                    else { return true; }
                }
                else if (this.currentAnimation.next.indexOf("onlyup", 0) !== -1) {
                    if (ANGLE_UP - 22.5 < angle && angle <= ANGLE_UP + 22.5) { this.paused = false; return false; }
                    else { return true; }
                }
                else if (this.currentAnimation.next.indexOf("upright", 0) !== -1) {
                    if (ANGLE_UPRIGHT - 22.5 < angle && angle <= ANGLE_UPRIGHT + 22.5) { this.paused = false; return false; }
                    else { return true; }
                }
                else if (this.currentAnimation.next.indexOf("onlyright", 0) !== -1) {
                    if (ANGLE_DOWNRIGHT + 22.5 < angle || angle <= ANGLE_RIGHT + 22.5) { this.paused = false; return false; }
                    else { return true; }
                }
                else if (this.currentAnimation.next.indexOf("downright", 0) !== -1) {
                    if (ANGLE_DOWNRIGHT - 22.5 < angle && angle <= ANGLE_DOWNRIGHT + 22.5) { this.paused = false; return false; }
                    else { return true; }
                }
            }
            else {
                return true;
            }
        }
    });

})(game);
/**
 * Player
 */
(function(ns) {

	ns.Player = tm.createClass({
		superClass : ns.AnimationCharactor,

		init: function () {
			this.name = "player";
			// this.superInit("player");
			this.superInit("player", {
				width:  120/6,
				height: 112/4,
				count:  24,
			}, 3);
			// プレイヤーなので操作を受け付けるように設定
			this.isInput = true;
			this._isGameOver = false;

			// ダメージ= [[[最終ATK * スキル倍率 ] * (4000 + 除算Def) / (4000 + 除算DEF * 10)] * 種族耐性] - 減算DEF

			this.level = 1;

			this.maxhp = 30;
			this.hp    = 30;
			this.maxmp = 10;
			this.mp    = 10;

			this._str = 1; // 攻撃力
			this._def = 1; // 防御力
			// this._int = 40; // 魔力
			this._agi = 4; // 素早さ
			this._luk = 1; // 運
			this._vit = 1; // 体力
			this._dex = 1; // 器用さ

			this._aspd = 190; // 攻撃スピード

			this.speed = 5;

			this.exp = 0; // 取得経験値
			this.nextLevelExp = 8;

			this.item = [];

			this.equipedWeapon = null;
			this.equipedArmor  = null;
		},

		getLevel: function ()		{ return this.level; },
		getMaxHP: function ()		{ return this.maxhp; },
		getCurrentHP: function ()	{ return this.hp; },
		getMaxMP: function ()		{ return this.maxmp; },
		getCurrentMP: function ()	{ return this.mp; },
		getSTR: function ()			{ return this._str; },
		getDEF: function ()			{ return this._def; },
		getAGI: function ()			{ return this._agi; },
		getLUK: function ()			{ return this._luk; },
		getVIT: function ()			{ return this._vit; },
		getDEX: function ()			{ return this._dex; },
		getEXP: function ()			{ return this.exp; },
		getNextLevel: function ()	{ return this.nextLevelExp; },
		isGameOver: function ()		{ return this._isGameOver; },

		/**
		 * セーブ時に使えるようにデータを変換
		 */
		cloneToSave: function () {
			// アイテムデータを値だけにする
			var parseItem = function (item) {
				if (item === null) {
					return null;
				}

				var result = {
					name: item.name,
					type: item.type,
					summary: item.summary,
					dropImage: item.dropImage,
					status: {
						hp: item.status.hp,

						dis: item.status.dis,
						agi: item.status.agi,
						def: item.status.def,
						dex: item.status.dex,
						luk: item.status.luk,
						str: item.status.str,
						vit: item.status.vit,
					},
				}
				return result;
			};


			var result = {
				level: this.level,
				maxhp: this.maxhp,
				hp   : this.hp,
				maxmp: this.maxmp,
				mp   : this.mp,
				_str:  this._str, // 攻撃力
				_def:  this._def, // 防御力
				// _int: 40, // 魔力
				_agi:  this._agi, // 素早さ
				_luk:  this._luk, // 運
				_vit:  this._vit, // 体力
				_dex:  this._dex, // 器用さ
				_aspd: this._aspd, // 攻撃スピード
				speed: this.speed,
				exp:   this.exp, // 取得経験値
				nextLevelExp: this.nextLevelExp,

				item: [],
				equipedWeapon: parseItem(this.equipedWeapon),
				equipedArmor : parseItem(this.equipedArmor),
			};

			for (var i = 0; i < this.item.length; ++i) {
				result.item.push(parseItem(this.item[i]));
			}

			return result;
		},

		/**
		 * ロード時に使えるようにデータを変換
		 */
		dataLoad: function (saveData) {
			this.level = saveData.level;
			this.maxhp = saveData.maxhp;
			this.hp    = saveData.hp;
			this.maxmp = saveData.maxmp;
			this.mp    = saveData.mp;
			this._str  = saveData._str; // 攻撃力
			this._def  = saveData._def; // 防御力
			// this._int = 40; // 魔力
			this._agi  = saveData._agi; // 素早さ
			this._luk  = saveData._luk; // 運
			this._vit  = saveData._vit; // 体力
			this._dex  = saveData._dex; // 器用さ
			this._aspd = saveData._aspd; // 攻撃スピード
			this.speed = saveData.speed;

			this.exp          = saveData.exp; // 取得経験値
			this.nextLevelExp = saveData.nextLevelExp;

			this.item          = saveData.item;
			this.equipedWeapon = saveData.equipedWeapon;
			this.equipedArmor  = saveData.equipedArmor;

			console.dir(this);
		},

		getSpeed: function () {
			return this.speed + (this.getLastAGI()/2 |0);
		},

		getLastAGI: function () {
			var agi = this.getAGI();
			if (this.equipedWeapon !== null) {
				agi += this.equipedWeapon.status.agi;
			}
			if (this.equipedArmor !== null) {
				agi += this.equipedArmor.status.agi;
			}
			return agi;
		},

		getAttackSpeed: function (fps) {
			// 攻撃速度を計算
			// var attackSpeed = this._aspd + Math.sqrt(this.getLastAGI() * (10 + 10/111) + (this.getDEX() * 9 / 49));
			var attackSpeed = this._aspd + Math.sqrt(this.getLastAGI() * (150000) + (this.getDEX() * 9 / 49));
			// attackSpeed = (attackSpeed > 190) ? 190 : (attackSpeed |0);
			// attackSpeed = (attackSpeed > 250) ? 190 : (attackSpeed |0);

			// フレーム速に変換して返す
			return fps / (attackSpeed / 150);
		},

		getDistanse: function () {
			if (this.equipedWeapon !== null) {
				return this.equipedWeapon.status.dis;
			}
			return 0;
		},

		eatMedicine: function (item) {
			if (!item.status) {
				return ;
			}
			this.hp += item.status.hp || 0;
			tm.asset.AssetManager.get("eat").clone().play();
			if (this.hp > this.maxhp) {
				this.hp = this.maxhp;
			}
		},

		levelUp: function (app) {
			// パラメータ上昇
			this.maxhp += Math.rand(0, 10);
			this.maxmp += Math.rand(0, 5);
			this._str  += Math.rand(0, 2); // 攻撃力
			this._def  += Math.rand(0, 2); // 防御力
			// this._int = 40; // 魔力
			this._agi  += (Math.rand(0, 8) === 0) ? 1 : 0; // 素早さ
			this._luk  += Math.rand(0, 2); // 運
			this._vit  += Math.rand(0, 2); // 体力
			this._dex  += Math.rand(0, 2); // 器用さ

			// HP全回復
			this.hp = this.maxhp;
			this.mp = this.maxmp;

			// 音
			tm.asset.AssetManager.get("levelup").clone().play();

			// ウィンドウ表示
			app.currentScene.windows.add("レベルが" + this.level + "に上がった", 255, 255, 30);
		},

		addExp: function (exp, app) {
			this.exp += exp;
			if (this.exp >= this.nextLevelExp) {
				++this.level;
				this.nextLevelExp = Math.ceil(this.nextLevelExp * 1.4);
				this.levelUp(app);
				this.addExp(0);
			}
		},

		addItem: function (item) {
			this.item.push(item);
		},

		getItem: function () {
			return this.item;
		},

		deleteItem: function (itemNum) {
			this.item.splice(itemNum, 1);
		},

		equipWeapon: function (item) {
			if (item) {
				this.equipedWeapon = item;
				tm.asset.AssetManager.get("equip").clone().play();
			}
			else {
				this.equipedWeapon = null;
			}
		},
		getWeapon: function () {
			if (this.equipedWeapon === null) {
				var result = {
					dropImage: null,
					name: "装備無し",
					status: {
						dis: 0,
						str: 0,
						def: 0,
						agi: 0,
						luk: 0,
						vit: 0,
						dex: 0
					}
				};
				return result;
			}
			return this.equipedWeapon;
		},

		equipArmor: function (item) {
			if (item) {
				this.equipedArmor = item;
				tm.asset.AssetManager.get("equip").clone().play();
			}
			else {
				this.equipedArmor = null;
			}
		},
		getArmor: function () {
			if (this.equipedArmor === null) {
				var result = {
					dropImage: null,
					name: "装備無し",
					status: {
						str: 0,
						def: 0,
						agi: 0,
						luk: 0,
						vit: 0,
						dex: 0
					}
				};
				return result;
			}
			return this.equipedArmor;
		},

		getAttackPoint: function (attack) {
			// 攻撃力を計算
			var random = Math.rand(9, 11) / 10;
			var attackpoint = ((this._str + this._dex/5 + this._luk/3) * random)|0;
			attackpoint += this.getWeapon().status.str + this.getArmor().status.str;
			return attackpoint;
		},

		damage: function (attack) {
			var damage = (attack - this._def - this.getWeapon().status.def - this.getArmor().status.def) |0;
			damage = (damage < 0) ? 0 : damage;

			this.hp -= damage;
			this.hp = (this.hp < 0) ? 0 : this.hp;

			// hpが0になったら死亡
			if (this.hp <= 0) {
				this._isGameOver = true;
				tm.asset.AssetManager.get("playerdown").clone().play();
			}

			return damage;
		},

		attack: function () {
			tm.asset.AssetManager.get("enemydamage").clone().play();
			return this.angle;
		},

		update: function (app) {
			this.inputAnimation(app);
		}
	});

})(game);
/**
 * Enemy
 */
(function(ns) {

	var ATTACK_LIMIT_COUNTER = 90;

	ns.Enemy = tm.createClass({
		superClass : ns.AnimationCharactor,

		init: function (image, imageData, drawImageScaleSize, player, map) {
			this.superInit(image, imageData, drawImageScaleSize);
			// プレイヤーなので操作を受け付けるように設定
			this.isInput = false;
			this.isAuto  = true;

			this.maxhp = 0;
			this.hp    = 0;
			this.maxmp = 0;
			this.mp    = 0;

			this._str  = 0; // 攻撃力
			this._def  = 0; // 防御力
			// this._int = 1; // 魔力
			this._agi  = 0; // 素早さ
			this._luk  = 0; // 運
			this._vit  = 0; // 体力
			this._dex  = 0; // 器用さ

			this.exp = 0; // 倒した時の経験値

			this.speed = 0;
			this.velocity = tm.geom.Vector2(0, 0);

			this.dropItemList = [
				{
					itemName: "ナイフ",
					random: 2
				}
			];

			this.map = map;
			this.player = player; // ダメージを与える際に使用
			this.lengthToPlayer = 0;
			this.lengthToAttack = 50;  // 攻撃を開始する距離
			this.lengthToActive = 150; // プレイヤーを察知して近づき始める距離 
			this.lengthToSense = 300;  // 察知して動き始める距離
			this.modeActive = 0;     // 攻撃をし続けるモード(攻撃を受けたら切り替わる)
			this.modeSafe   = 0;     // 攻撃をせずに行動するモード
			this.attackTime = 0;

			// 攻撃時のアニメーション
			var ss = tm.app.SpriteSheet({
                image: "slash",
                frame: {
                    width:  65,
                    height: 65,
                    count: 8
                },
                animations: {
                    "slash": [0, 8]
                }
            });
			var slash = tm.app.AnimationSprite(ss, 120, 120);
            slash.position.set(0, 0);
            this.slash = slash;
            this.attackDistanse = 50;
            this.addChild(slash);
		},

		getMaxHP:     function () { return this.maxhp; },
		getCurrentHP: function () { return this.hp; },
		getMaxMP:     function () { return this.maxmp; },
		getCurrentMP: function () { return this.mp; },

		getAttackPoint: function (attack) {
			// 攻撃力を計算
			var random = Math.rand(9, 11) / 10;
			var attackpoint = ((this._str + this._dex/5 + this._luk/3) * random)|0;
			return attackpoint;
		},

		damage: function (attack) {
			var damage = (attack - this._def) |0;
			damage = (damage < 0) ? 0 : damage;

			this.hp -= damage;
			this.hp = (this.hp < 0) ? 0 : this.hp;

			return damage;
		},

		getExp: function () {
			if (this.hp <= 0) {
				return this.exp;
			}
			return 0;
		},

		getDropItem: function () {
			// hpが0になったら死亡
			if (this.hp <= 0) {
				for (var i = 0; i < this.dropItemList.length; ++i) {
					if (Math.rand(0, this.dropItemList[i].random) === 0) {
						return this.dropItemList[i].itemName;
					}
				}
			}
			return null;
		},

		isEnemyDead: function () {
			if (this.hp <= 0) {
				tm.asset.AssetManager.get("enemydown").clone().play();
				this.remove();
				return true;
			}
			return false;
		},

		isHit: function (point, radius) {
			// console.log(this.radius);
		},

		update: function (app) {
            // ランダム移動
            if (this.isAuto) {
            	var mapEnemyPosition = this.position.clone();
            	mapEnemyPosition = this.map.mapCenterToMapLeftTop(mapEnemyPosition.x, mapEnemyPosition.y);
            	mapEnemyPosition.y += 35; // 位置を調整
            	var lengthToPlayer = this.map.playerPosition.distance(mapEnemyPosition);
            	if (lengthToPlayer <= this.lengthToAttack) {
            		// 攻撃
            		this._moveAttack();
            		this._attack(app, mapEnemyPosition, this.map.playerPosition.clone());

            		// 攻撃へのカウントアップ
            		++this.attackTime;
            	}
            	else if (lengthToPlayer <= this.lengthToActive) {
            		// playerに近づく
            		this._moveActive(mapEnemyPosition, this.map.playerPosition.clone());

            		// 攻撃へのカウントアップ
            		++this.attackTime;
            	}
            	else if (lengthToPlayer <= this.lengthToSense) {
            		// 動き始める
            		this._moveSense(app);

            		// 攻撃をキャンセル
            		this.attackTime = 0;
            	}
            }
		},

		_attack: function (app, enemyPosition, playerPosition) {
			// 攻撃へのカウントアップが上限に達しているか
			if (this.attackTime < ATTACK_LIMIT_COUNTER) {
				return ;
			}
			else {
				this.attackTime = ATTACK_LIMIT_COUNTER;
			}

            // 攻撃の方向を調べる
            playerPosition.sub(enemyPosition);
            var attackDirect = playerPosition.normalize();
            
            // 攻撃の場所を計算する(画面上)
            var distanse = this.attackDistanse;
            var attackScreenPosition = tm.geom.Vector2.mul(attackDirect, distanse);

            // 攻撃時のアニメーション
            this.slash.position.set(attackScreenPosition.x, attackScreenPosition.y);
            this.slash.gotoAndPlay("slash");

            // 音
            tm.asset.AssetManager.get("playerdamage").clone().play();

            // 攻撃するポイントを作成
            var attackMapPosition = this.position.clone().add(attackScreenPosition);
            attackMapPosition = this.map.mapCenterToMapLeftTop(attackMapPosition.x, attackMapPosition.y-20);
            var attackElement = tm.app.Object2D();
            attackElement.radius = 40;
            attackElement.position.set(attackMapPosition.x, attackMapPosition.y);

            // プレイヤーのポイントを作成
            var hittedElement = tm.app.Object2D();
            hittedElement.radius = 40;
            hittedElement.position.set(this.map.playerPosition.x, this.map.playerPosition.y);

            // 攻撃が当たっているか調べる
            if (hittedElement.isHitElementCircle(attackElement)) {
            	// 攻撃のカウントを初期化
            	this.attackTime = 0;

            	// ダメージ計算
            	var attack = this.getAttackPoint();
            	var damage = this.player.damage(attack);

            	// ダメージを表示
            	var damageEffect = ns.DamagedNumber(damage, 255, 20, 20, 255, 255, 255);

            	// 表示場所を設定
                var damagePosition = this.map.mapCenterToScreenTopLeft(hittedElement.x, hittedElement.y);
                damageEffect.effectPositionSet(ns.SCREEN_WIDTH/2, ns.SCREEN_HEIGHT/2 + 10);
                app.currentScene.addChild(damageEffect);
            }
		},

		_moveAttack: function () {
			this.velocity.x = 0;
			this.velocity.y = 0;
		},
		_moveActive: function (enemyPosition, playerPosition) {
			// プレイヤーに近づく
			// プレイヤーへの距離
			playerPosition.sub(enemyPosition);
			// playerPosition.y *= -1;
			this.velocity = playerPosition.normalize();
			this.velocity.x *= -1;
			this.velocity.y *= -1;
			var angle = Math.radToDeg(this.velocity.toAngle());
			angle -= 180;
            if   (angle < 0) {angle *= -1;}
            else             {angle = 360 - angle;}
			this.directWatch(angle);
		},
		_moveSense: function (app) {
			// 移動を開始するモードに変更する
			// this.modeSafe = true;

            // フレームに合わせて移動する
            if (app.frame % 20 === 0) {
                var angle = Math.rand(0, 359);
            }
            if (angle && this.isAnimation) {
                this.velocity.setDegree(angle, 1);
                this.velocity.x *= -1;
                // this.speed = 4;
                // 移動方向に対して体を向けてアニメーションする
                this.directWatch(angle);
            }
            else {
                //this.paused = true;
            }
		},
	});

})(game);
/**
 * SlimeBlue
 */
(function(ns) {

	ns.SlimeBlue = tm.createClass({
		superClass : ns.Enemy,

		init: function (player, map) {
			this.superInit("SlimeBlue", {
				width:  96/6,
				height: 80/4,
				count:  24,
			}, 3, player, map);

			this.maxhp = 70;
			this.hp    = 70;
			this.maxmp = 0;
			this.mp    = 0;

			this._str  = 12; // 攻撃力
			this._def  = 10; // 防御力
			// this._int = 1; // 魔力
			this._agi  = 0; // 素早さ
			this._luk  = 0; // 運
			this._vit  = 0; // 体力
			this._dex  = 0; // 器用さ

			this.exp = 4; // 倒した時の経験値

			this.speed = 1;
			this.velocity = tm.geom.Vector2(0, 0);

			this.dropItemList = [
				{
					itemName: "モンスターの液体",
					random: 3
				},{
					itemName: "ポーション",
					random: 9
				},{
					itemName: "布の鎧",
					random: 6
				}
			];
		}
	});

})(game);
/**
 * SlimeGreen
 */
(function(ns) {

	ns.SlimeGreen = tm.createClass({
		superClass : ns.Enemy,

		init: function (player, map) {
			this.superInit("SlimeGreen", {
				width:  96/6,
				height: 80/4,
				count:  24,
			}, 3, player, map);

			this.maxhp = 5;
			this.hp    = 5;
			this.maxmp = 0;
			this.mp    = 0;

			this._str  = 3; // 攻撃力
			this._def  = 0; // 防御力
			// this._int = 1; // 魔力
			this._agi  = 0; // 素早さ
			this._luk  = 0; // 運
			this._vit  = 0; // 体力
			this._dex  = 0; // 器用さ

			this.exp = 1; // 倒した時の経験値

			this.speed = 1;
			this.velocity = tm.geom.Vector2(0, 0);

			this.dropItemList = [
				{
					itemName: "雑草",
					random: 2
				},{
					itemName: "モンスターの液体",
					random: 2
				},{
					itemName: "布の服",
					random: 2
				}
			];
		}
	});

})(game);
/**
 * SlimeRed
 */
(function(ns) {

	ns.SlimeRed = tm.createClass({
		superClass : ns.Enemy,

		init: function (player, map) {
			this.superInit("SlimeRed", {
				width:  96/6,
				height: 80/4,
				count:  24,
			}, 3, player, map);

			this.maxhp = 180;
			this.hp    = 180;
			this.maxmp = 0;
			this.mp    = 0;

			this._str  = 21; // 攻撃力
			this._def  = -10; // 防御力
			// this._int = 1; // 魔力
			this._agi  = 0; // 素早さ
			this._luk  = 0; // 運
			this._vit  = 0; // 体力
			this._dex  = 0; // 器用さ

			this.exp = 15; // 倒した時の経験値

			this.speed = 5;
			this.velocity = tm.geom.Vector2(0, 0);

			this.dropItemList = [
				{
					itemName: "モンスターの液体",
					random: 3
				},{
					itemName: "ポーション",
					random: 3
				}
			];
		}
	});

})(game);
/**
 * SlimeGold
 */
(function(ns) {

	ns.SlimeGold = tm.createClass({
		superClass : ns.Enemy,

		init: function (player, map) {
			this.superInit("SlimeGold", {
				width:  96/6,
				height: 80/4,
				count:  24,
			}, 3, player, map);

			this.maxhp = 5;
			this.hp    = 5;
			this.maxmp = 0;
			this.mp    = 0;

			this._str  = 3; // 攻撃力
			this._def  = 0; // 防御力
			// this._int = 1; // 魔力
			this._agi  = 0; // 素早さ
			this._luk  = 0; // 運
			this._vit  = 0; // 体力
			this._dex  = 0; // 器用さ

			this.exp = 500; // 倒した時の経験値

			this.speed = 1;
			this.velocity = tm.geom.Vector2(0, 0);

			this.dropItemList = [
				{
					itemNum: 1,
					random: 2
				}
			];
		}
	});

})(game);
/**
 * SmallBatBlack
 */
(function(ns) {

	ns.SmallBatBlack = tm.createClass({
		superClass : ns.Enemy,

		init: function (player, map) {
			this.superInit("SmallBatBlack", {
				width:  120/6,
				height: 96/4,
				count:  24,
			}, 3, player, map);

			this.maxhp = 10;
			this.hp    = 10;
			this.maxmp = 0;
			this.mp    = 0;

			this._str  = 5; // 攻撃力
			this._def  = 1; // 防御力
			// this._int = 1; // 魔力
			this._agi  = 0; // 素早さ
			this._luk  = 0; // 運
			this._vit  = 0; // 体力
			this._dex  = 0; // 器用さ

			this.exp = 1; // 倒した時の経験値

			this.speed = 5;
			this.velocity = tm.geom.Vector2(0, 0);

			this.dropItemList = [
				{
					itemName: "ナイフ",
					random: 3
				},{
					itemName: "肉",
					random: 6
				},{
					itemName: "布の服",
					random: 6
				}
			];
		}
	});

})(game);
/**
 * SmallBatGreen
 */
(function(ns) {

	ns.SmallBatGreen = tm.createClass({
		superClass : ns.Enemy,

		init: function (player, map) {
			this.superInit("SmallBatGreen", {
				width:  120/6,
				height: 96/4,
				count:  24,
			}, 3, player, map);

			this.maxhp = 40;
			this.hp    = 40;
			this.maxmp = 0;
			this.mp    = 0;

			this._str  = 12; // 攻撃力
			this._def  = 10; // 防御力
			// this._int = 1; // 魔力
			this._agi  = 0; // 素早さ
			this._luk  = 0; // 運
			this._vit  = 0; // 体力
			this._dex  = 0; // 器用さ

			this.exp = 5; // 倒した時の経験値

			this.speed = 5;
			this.velocity = tm.geom.Vector2(0, 0);

			this.dropItemList = [
				{
					itemName: "レイピア",
					random: 4
				},{
					itemName: "布の鎧",
					random: 3
				}
			];
		}
	});

})(game);
/**
 * SmallBatRed
 */
(function(ns) {

	ns.SmallBatRed = tm.createClass({
		superClass : ns.Enemy,

		init: function (player, map) {
			this.superInit("SmallBatRed", {
				width:  120/6,
				height: 96/4,
				count:  24,
			}, 3, player, map);

			this.maxhp = 5;
			this.hp    = 5;
			this.maxmp = 0;
			this.mp    = 0;

			this._str  = 3; // 攻撃力
			this._def  = 0; // 防御力
			// this._int = 1; // 魔力
			this._agi  = 0; // 素早さ
			this._luk  = 0; // 運
			this._vit  = 0; // 体力
			this._dex  = 0; // 器用さ

			this.exp = 500; // 倒した時の経験値

			this.speed = 1;
			this.velocity = tm.geom.Vector2(0, 0);

			this.dropItemList = [
				{
					itemNum: 1,
					random: 2
				}
			];
		}
	});

})(game);
/**
 * SmallBatGhost
 */
(function(ns) {

	ns.SmallBatGhost = tm.createClass({
		superClass : ns.Enemy,

		init: function (player, map) {
			this.superInit("SmallBatGhost", {
				width:  120/6,
				height: 96/4,
				count:  24,
			}, 3, player, map);

			this.maxhp = 5;
			this.hp    = 5;
			this.maxmp = 0;
			this.mp    = 0;

			this._str  = 3; // 攻撃力
			this._def  = 0; // 防御力
			// this._int = 1; // 魔力
			this._agi  = 0; // 素早さ
			this._luk  = 0; // 運
			this._vit  = 0; // 体力
			this._dex  = 0; // 器用さ

			this.exp = 500; // 倒した時の経験値

			this.speed = 1;
			this.velocity = tm.geom.Vector2(0, 0);

			this.dropItemList = [
				{
					itemNum: 1,
					random: 2
				}
			];
		}
	});

})(game);
/**
 * GoblinGrey
 */
(function(ns) {

	ns.GoblinGrey = tm.createClass({
		superClass : ns.Enemy,

		init: function (player, map) {
			this.superInit("GoblinGrey", {
				width:  108/6,
				height: 72/4,
				count:  24,
			}, 3, player, map);

			this.maxhp = 20;
			this.hp    = 32;
			this.maxmp = 0;
			this.mp    = 0;

			this._str  = 10; // 攻撃力
			this._def  = 3; // 防御力
			// this._int = 1; // 魔力
			this._agi  = 0; // 素早さ
			this._luk  = 0; // 運
			this._vit  = 0; // 体力
			this._dex  = 0; // 器用さ

			this.exp = 2; // 倒した時の経験値

			this.speed = 2;
			this.velocity = tm.geom.Vector2(0, 0);

			this.dropItemList = [
				{
					itemName: "サーベル",
					random: 5
				},{
					itemName: "ダガー",
					random: 8
				},{
					itemName: "布の服",
					random: 3
				}
			];
		}
	});

})(game);
/**
 * GoblinGreen
 */
(function(ns) {

	ns.GoblinGreen = tm.createClass({
		superClass : ns.Enemy,

		init: function (player, map) {
			this.superInit("GoblinGreen", {
				width:  108/6,
				height: 72/4,
				count:  24,
			}, 3, player, map);

			this.maxhp = 80;
			this.hp    = 80;
			this.maxmp = 0;
			this.mp    = 0;

			this._str  = 25; // 攻撃力
			this._def  = 12; // 防御力
			// this._int = 1; // 魔力
			this._agi  = 0; // 素早さ
			this._luk  = 0; // 運
			this._vit  = 0; // 体力
			this._dex  = 0; // 器用さ

			this.exp = 8; // 倒した時の経験値

			this.speed = 2;
			this.velocity = tm.geom.Vector2(0, 0);

			this.dropItemList = [
				{
					itemName: "刀",
					random: 12
				},{
					itemName: "肉",
					random: 5
				}
			];
		}
	});

})(game);
/**
 * GoblinRed
 */
(function(ns) {

	ns.GoblinRed = tm.createClass({
		superClass : ns.Enemy,

		init: function (player, map) {
			this.superInit("GoblinRed", {
				width:  108/6,
				height: 72/4,
				count:  24,
			}, 3, player, map);

			this.maxhp = 5;
			this.hp    = 5;
			this.maxmp = 0;
			this.mp    = 0;

			this._str  = 3; // 攻撃力
			this._def  = 0; // 防御力
			// this._int = 1; // 魔力
			this._agi  = 0; // 素早さ
			this._luk  = 0; // 運
			this._vit  = 0; // 体力
			this._dex  = 0; // 器用さ

			this.exp = 500; // 倒した時の経験値

			this.speed = 1;
			this.velocity = tm.geom.Vector2(0, 0);

			this.dropItemList = [
				{
					itemNum: 1,
					random: 2
				}
			];
		}
	});

})(game);
/**
 * BatBlack
 */
(function(ns) {

	ns.BatBlack = tm.createClass({
		superClass : ns.Enemy,

		init: function (player, map) {
			this.superInit("BatBlack", {
				width:  180/6,
				height: 112/4,
				count:  24,
			}, 3, player, map);

			this.maxhp = 25;
			this.hp    = 25;
			this.maxmp = 0;
			this.mp    = 0;

			this._str  = 13; // 攻撃力
			this._def  = 4; // 防御力
			// this._int = 1; // 魔力
			this._agi  = 0; // 素早さ
			this._luk  = 0; // 運
			this._vit  = 0; // 体力
			this._dex  = 0; // 器用さ

			this.exp = 2; // 倒した時の経験値

			this.speed = 4;
			this.velocity = tm.geom.Vector2(0, 0);

			this.dropItemList = [
				{
					itemName: "ダガー",
					random: 6
				},{
					itemName: "肉",
					random: 6
				},{
					itemName: "布の服",
					random: 6
				}
			];
		}
	});

})(game);
/**
 * BatGreen
 */
(function(ns) {

	ns.BatGreen = tm.createClass({
		superClass : ns.Enemy,

		init: function (player, map) {
			this.superInit("BatGreen", {
				width:  180/6,
				height: 112/4,
				count:  24,
			}, 3, player, map);

			this.maxhp = 70;
			this.hp    = 70;
			this.maxmp = 0;
			this.mp    = 0;

			this._str  = 24; // 攻撃力
			this._def  = 18; // 防御力
			// this._int = 1; // 魔力
			this._agi  = 0; // 素早さ
			this._luk  = 0; // 運
			this._vit  = 0; // 体力
			this._dex  = 0; // 器用さ

			this.exp = 8; // 倒した時の経験値

			this.speed = 4;
			this.velocity = tm.geom.Vector2(0, 0);

			this.dropItemList = [
				{
					itemName: "刀",
					random: 8
				}
			];
		}
	});

})(game);
/**
 * BatBlue
 */
(function(ns) {

	ns.BatBlue = tm.createClass({
		superClass : ns.Enemy,

		init: function (player, map) {
			this.superInit("BatBlue", {
				width:  180/6,
				height: 112/4,
				count:  24,
			}, 3, player, map);

			this.maxhp = 5;
			this.hp    = 5;
			this.maxmp = 0;
			this.mp    = 0;

			this._str  = 3; // 攻撃力
			this._def  = 0; // 防御力
			// this._int = 1; // 魔力
			this._agi  = 0; // 素早さ
			this._luk  = 0; // 運
			this._vit  = 0; // 体力
			this._dex  = 0; // 器用さ

			this.exp = 500; // 倒した時の経験値

			this.speed = 1;
			this.velocity = tm.geom.Vector2(0, 0);

			this.dropItemList = [
				{
					itemNum: 1,
					random: 2
				}
			];
		}
	});

})(game);
/**
 * BatRed
 */
(function(ns) {

	ns.BatRed = tm.createClass({
		superClass : ns.Enemy,

		init: function (player, map) {
			this.superInit("BatRed", {
				width:  180/6,
				height: 112/4,
				count:  24,
			}, 3, player, map);

			this.maxhp = 5;
			this.hp    = 5;
			this.maxmp = 0;
			this.mp    = 0;

			this._str  = 3; // 攻撃力
			this._def  = 0; // 防御力
			// this._int = 1; // 魔力
			this._agi  = 0; // 素早さ
			this._luk  = 0; // 運
			this._vit  = 0; // 体力
			this._dex  = 0; // 器用さ

			this.exp = 500; // 倒した時の経験値

			this.speed = 1;
			this.velocity = tm.geom.Vector2(0, 0);

			this.dropItemList = [
				{
					itemNum: 1,
					random: 2
				}
			];
		}
	});

})(game);
/**
 * BatWhite
 */
(function(ns) {

	ns.BatWhite = tm.createClass({
		superClass : ns.Enemy,

		init: function (player, map) {
			this.superInit("BatWhite", {
				width:  180/6,
				height: 112/4,
				count:  24,
			}, 3, player, map);

			this.maxhp = 5;
			this.hp    = 5;
			this.maxmp = 0;
			this.mp    = 0;

			this._str  = 3; // 攻撃力
			this._def  = 0; // 防御力
			// this._int = 1; // 魔力
			this._agi  = 0; // 素早さ
			this._luk  = 0; // 運
			this._vit  = 0; // 体力
			this._dex  = 0; // 器用さ

			this.exp = 500; // 倒した時の経験値

			this.speed = 1;
			this.velocity = tm.geom.Vector2(0, 0);

			this.dropItemList = [
				{
					itemNum: 1,
					random: 2
				}
			];
		}
	});

})(game);
/**
 * SkeltonNormal
 */
(function(ns) {

	ns.SkeltonNormal = tm.createClass({
		superClass : ns.Enemy,

		init: function (player, map) {
			this.superInit("SkeltonNormal", {
				width:  96/6,
				height: 80/4,
				count:  24,
			}, 3, player, map);

			this.maxhp = 40;
			this.hp    = 40;
			this.maxmp = 0;
			this.mp    = 0;

			this._str  = 18; // 攻撃力
			this._def  = 6; // 防御力
			// this._int = 1; // 魔力
			this._agi  = 0; // 素早さ
			this._luk  = 0; // 運
			this._vit  = 0; // 体力
			this._dex  = 0; // 器用さ

			this.exp = 3; // 倒した時の経験値

			this.speed = 2;
			this.velocity = tm.geom.Vector2(0, 0);

			this.dropItemList = [
				{
					itemName: "カッター",
					random: 13
				},{
					itemName: "ジャンビーヤ",
					random: 15
				},{
					itemName: "シャムシール",
					random: 20
				},{
					itemName: "布の鎧",
					random: 10
				}
			];
		}
	});

})(game);
/**
 * SkeltonGreen
 */
(function(ns) {

	ns.SkeltonGreen = tm.createClass({
		superClass : ns.Enemy,

		init: function (player, map) {
			this.superInit("SkeltonGreen", {
				width:  96/6,
				height: 80/4,
				count:  24,
			}, 3, player, map);

			this.maxhp = 5;
			this.hp    = 5;
			this.maxmp = 0;
			this.mp    = 0;

			this._str  = 3; // 攻撃力
			this._def  = 0; // 防御力
			// this._int = 1; // 魔力
			this._agi  = 0; // 素早さ
			this._luk  = 0; // 運
			this._vit  = 0; // 体力
			this._dex  = 0; // 器用さ

			this.exp = 500; // 倒した時の経験値

			this.speed = 1;
			this.velocity = tm.geom.Vector2(0, 0);

			this.dropItemList = [
				{
					itemNum: 1,
					random: 2
				}
			];
		}
	});

})(game);
/**
 * SkeltonBlue
 */
(function(ns) {

	ns.SkeltonBlue = tm.createClass({
		superClass : ns.Enemy,

		init: function (player, map) {
			this.superInit("SkeltonBlue", {
				width:  96/6,
				height: 80/4,
				count:  24,
			}, 3, player, map);

			this.maxhp = 5;
			this.hp    = 5;
			this.maxmp = 0;
			this.mp    = 0;

			this._str  = 3; // 攻撃力
			this._def  = 0; // 防御力
			// this._int = 1; // 魔力
			this._agi  = 0; // 素早さ
			this._luk  = 0; // 運
			this._vit  = 0; // 体力
			this._dex  = 0; // 器用さ

			this.exp = 500; // 倒した時の経験値

			this.speed = 1;
			this.velocity = tm.geom.Vector2(0, 0);

			this.dropItemList = [
				{
					itemNum: 1,
					random: 2
				}
			];
		}
	});

})(game);
/**
 * SkeltonRed
 */
(function(ns) {

	ns.SkeltonRed = tm.createClass({
		superClass : ns.Enemy,

		init: function (player, map) {
			this.superInit("SkeltonRed", {
				width:  96/6,
				height: 80/4,
				count:  24,
			}, 3, player, map);

			this.maxhp = 5;
			this.hp    = 5;
			this.maxmp = 0;
			this.mp    = 0;

			this._str  = 3; // 攻撃力
			this._def  = 0; // 防御力
			// this._int = 1; // 魔力
			this._agi  = 0; // 素早さ
			this._luk  = 0; // 運
			this._vit  = 0; // 体力
			this._dex  = 0; // 器用さ

			this.exp = 500; // 倒した時の経験値

			this.speed = 1;
			this.velocity = tm.geom.Vector2(0, 0);

			this.dropItemList = [
				{
					itemNum: 1,
					random: 2
				}
			];
		}
	});

})(game);
/**
 * HarypyNormal
 */
(function(ns) {

	ns.HarypyNormal = tm.createClass({
		superClass : ns.Enemy,

		init: function (player, map) {
			this.superInit("HarypyNormal", {
				width:  144/6,
				height: 104/4,
				count:  24,
			}, 3, player, map);

			this.maxhp = 50;
			this.hp    = 50;
			this.maxmp = 0;
			this.mp    = 0;

			this._str  = 15; // 攻撃力
			this._def  = 8; // 防御力
			// this._int = 1; // 魔力
			this._agi  = 0; // 素早さ
			this._luk  = 0; // 運
			this._vit  = 0; // 体力
			this._dex  = 0; // 器用さ

			this.exp = 4; // 倒した時の経験値

			this.speed = 4;
			this.velocity = tm.geom.Vector2(0, 0);

			this.dropItemList = [
				{
					itemName: "レイピア",
					random: 10
				},{
					itemName: "布の鎧",
					random: 6
				}
			];
		}
	});

})(game);
/**
 * LizardManNormal
 */
(function(ns) {

	ns.LizardManNormal = tm.createClass({
		superClass : ns.Enemy,

		init: function (player, map) {
			this.superInit("LizardManNormal", {
				width:  120/6,
				height: 72/4,
				count:  24,
			}, 3, player, map);

			this.maxhp = 60;
			this.hp    = 60;
			this.maxmp = 0;
			this.mp    = 0;

			this._str  = 22; // 攻撃力
			this._def  = 12; // 防御力
			// this._int = 1; // 魔力
			this._agi  = 0; // 素早さ
			this._luk  = 0; // 運
			this._vit  = 0; // 体力
			this._dex  = 0; // 器用さ

			this.exp = 5; // 倒した時の経験値

			this.speed = 3;
			this.velocity = tm.geom.Vector2(0, 0);

			this.dropItemList = [
				{
					itemName: "刀",
					random: 7
				},{
					itemName: "肉",
					random: 5
				},{
					itemName: "革の鎧",
					random: 5
				}
			];
		}
	});

})(game);
/**
 * LizardManBlue
 */
(function(ns) {

	ns.LizardManBlue = tm.createClass({
		superClass : ns.Enemy,

		init: function (player, map) {
			this.superInit("LizardManBlue", {
				width:  120/6,
				height: 72/4,
				count:  24,
			}, 3, player, map);

			this.maxhp = 5;
			this.hp    = 5;
			this.maxmp = 0;
			this.mp    = 0;

			this._str  = 3; // 攻撃力
			this._def  = 0; // 防御力
			// this._int = 1; // 魔力
			this._agi  = 0; // 素早さ
			this._luk  = 0; // 運
			this._vit  = 0; // 体力
			this._dex  = 0; // 器用さ

			this.exp = 500; // 倒した時の経験値

			this.speed = 1;
			this.velocity = tm.geom.Vector2(0, 0);

			this.dropItemList = [
				{
					itemNum: 1,
					random: 2
				}
			];
		}
	});

})(game);
/**
 * LizardManRed
 */
(function(ns) {

	ns.LizardManRed = tm.createClass({
		superClass : ns.Enemy,

		init: function (player, map) {
			this.superInit("LizardManRed", {
				width:  120/6,
				height: 72/4,
				count:  24,
			}, 3, player, map);

			this.maxhp = 5;
			this.hp    = 5;
			this.maxmp = 0;
			this.mp    = 0;

			this._str  = 3; // 攻撃力
			this._def  = 0; // 防御力
			// this._int = 1; // 魔力
			this._agi  = 0; // 素早さ
			this._luk  = 0; // 運
			this._vit  = 0; // 体力
			this._dex  = 0; // 器用さ

			this.exp = 500; // 倒した時の経験値

			this.speed = 1;
			this.velocity = tm.geom.Vector2(0, 0);

			this.dropItemList = [
				{
					itemNum: 1,
					random: 2
				}
			];
		}
	});

})(game);
/**
 * ZombieNormal
 */
(function(ns) {

	ns.ZombieNormal = tm.createClass({
		superClass : ns.Enemy,

		init: function (player, map) {
			this.superInit("ZombieNormal", {
				width:  96/6,
				height: 80/4,
				count:  24,
			}, 3, player, map);

			this.maxhp = 5;
			this.hp    = 5;
			this.maxmp = 0;
			this.mp    = 0;

			this._str  = 3; // 攻撃力
			this._def  = 0; // 防御力
			// this._int = 1; // 魔力
			this._agi  = 0; // 素早さ
			this._luk  = 0; // 運
			this._vit  = 0; // 体力
			this._dex  = 0; // 器用さ

			this.exp = 500; // 倒した時の経験値

			this.speed = 1;
			this.velocity = tm.geom.Vector2(0, 0);

			this.dropItemList = [
				{
					itemNum: 1,
					random: 2
				}
			];
		}
	});

})(game);
/**
 * ZombieRed
 */
(function(ns) {

	ns.ZombieRed = tm.createClass({
		superClass : ns.Enemy,

		init: function (player, map) {
			this.superInit("ZombieRed", {
				width:  96/6,
				height: 80/4,
				count:  24,
			}, 3, player, map);

			this.maxhp = 5;
			this.hp    = 5;
			this.maxmp = 0;
			this.mp    = 0;

			this._str  = 3; // 攻撃力
			this._def  = 0; // 防御力
			// this._int = 1; // 魔力
			this._agi  = 0; // 素早さ
			this._luk  = 0; // 運
			this._vit  = 0; // 体力
			this._dex  = 0; // 器用さ

			this.exp = 500; // 倒した時の経験値

			this.speed = 1;
			this.velocity = tm.geom.Vector2(0, 0);

			this.dropItemList = [
				{
					itemNum: 1,
					random: 2
				}
			];
		}
	});

})(game);
/**
 * GolemNormal
 */
(function(ns) {

	ns.GolemNormal = tm.createClass({
		superClass : ns.Enemy,

		init: function (player, map) {
			this.superInit("GolemNormal", {
				width:  132/6,
				height: 104/4,
				count:  24,
			}, 3, player, map);

			this.maxhp = 5;
			this.hp    = 5;
			this.maxmp = 0;
			this.mp    = 0;

			this._str  = 3; // 攻撃力
			this._def  = 0; // 防御力
			// this._int = 1; // 魔力
			this._agi  = 0; // 素早さ
			this._luk  = 0; // 運
			this._vit  = 0; // 体力
			this._dex  = 0; // 器用さ

			this.exp = 500; // 倒した時の経験値

			this.speed = 1;
			this.velocity = tm.geom.Vector2(0, 0);

			this.dropItemList = [
				{
					itemNum: 1,
					random: 2
				}
			];
		}
	});

})(game);
/**
 * GolemGreen
 */
(function(ns) {

	ns.GolemGreen = tm.createClass({
		superClass : ns.Enemy,

		init: function (player, map) {
			this.superInit("GolemGreen", {
				width:  132/6,
				height: 104/4,
				count:  24,
			}, 3, player, map);

			this.maxhp = 5;
			this.hp    = 5;
			this.maxmp = 0;
			this.mp    = 0;

			this._str  = 3; // 攻撃力
			this._def  = 0; // 防御力
			// this._int = 1; // 魔力
			this._agi  = 0; // 素早さ
			this._luk  = 0; // 運
			this._vit  = 0; // 体力
			this._dex  = 0; // 器用さ

			this.exp = 500; // 倒した時の経験値

			this.speed = 1;
			this.velocity = tm.geom.Vector2(0, 0);

			this.dropItemList = [
				{
					itemNum: 1,
					random: 2
				}
			];
		}
	});

})(game);
/**
 * GolemBlue
 */
(function(ns) {

	ns.GolemBlue = tm.createClass({
		superClass : ns.Enemy,

		init: function (player, map) {
			this.superInit("GolemBlue", {
				width:  108/6,
				height: 72/4,
				count:  24,
			}, 3, player, map);

			this.maxhp = 5;
			this.hp    = 5;
			this.maxmp = 0;
			this.mp    = 0;

			this._str  = 3; // 攻撃力
			this._def  = 0; // 防御力
			// this._int = 1; // 魔力
			this._agi  = 0; // 素早さ
			this._luk  = 0; // 運
			this._vit  = 0; // 体力
			this._dex  = 0; // 器用さ

			this.exp = 500; // 倒した時の経験値

			this.speed = 1;
			this.velocity = tm.geom.Vector2(0, 0);

			this.dropItemList = [
				{
					itemNum: 1,
					random: 2
				}
			];
		}
	});

})(game);
/**
 * GolemRed
 */
(function(ns) {

	ns.GolemRed = tm.createClass({
		superClass : ns.Enemy,

		init: function (player, map) {
			this.superInit("GolemRed", {
				width:  132/6,
				height: 104/4,
				count:  24,
			}, 3, player, map);

			this.maxhp = 5;
			this.hp    = 5;
			this.maxmp = 0;
			this.mp    = 0;

			this._str  = 3; // 攻撃力
			this._def  = 0; // 防御力
			// this._int = 1; // 魔力
			this._agi  = 0; // 素早さ
			this._luk  = 0; // 運
			this._vit  = 0; // 体力
			this._dex  = 0; // 器用さ

			this.exp = 500; // 倒した時の経験値

			this.speed = 1;
			this.velocity = tm.geom.Vector2(0, 0);

			this.dropItemList = [
				{
					itemNum: 1,
					random: 2
				}
			];
		}
	});

})(game);
/**
 * GolemGhost
 */
(function(ns) {

	ns.GolemGhost = tm.createClass({
		superClass : ns.Enemy,

		init: function (player, map) {
			this.superInit("GolemGhost", {
				width:  132/6,
				height: 104/4,
				count:  24,
			}, 3, player, map);

			this.maxhp = 5;
			this.hp    = 5;
			this.maxmp = 0;
			this.mp    = 0;

			this._str  = 3; // 攻撃力
			this._def  = 0; // 防御力
			// this._int = 1; // 魔力
			this._agi  = 0; // 素早さ
			this._luk  = 0; // 運
			this._vit  = 0; // 体力
			this._dex  = 0; // 器用さ

			this.exp = 500; // 倒した時の経験値

			this.speed = 1;
			this.velocity = tm.geom.Vector2(0, 0);

			this.dropItemList = [
				{
					itemNum: 1,
					random: 2
				}
			];
		}
	});

})(game);
/**
 * GhostNormal
 */
(function(ns) {

	ns.GhostNormal = tm.createClass({
		superClass : ns.Enemy,

		init: function (player, map) {
			this.superInit("GhostNormal", {
				width:  108/6,
				height: 80/4,
				count:  24,
			}, 3, player, map);

			this.maxhp = 5;
			this.hp    = 5;
			this.maxmp = 0;
			this.mp    = 0;

			this._str  = 3; // 攻撃力
			this._def  = 0; // 防御力
			// this._int = 1; // 魔力
			this._agi  = 0; // 素早さ
			this._luk  = 0; // 運
			this._vit  = 0; // 体力
			this._dex  = 0; // 器用さ

			this.exp = 500; // 倒した時の経験値

			this.speed = 1;
			this.velocity = tm.geom.Vector2(0, 0);

			this.dropItemList = [
				{
					itemNum: 1,
					random: 2
				}
			];
		}
	});

})(game);
/**
 * GargoyleBlack
 */
(function(ns) {

	ns.GargoyleBlack = tm.createClass({
		superClass : ns.Enemy,

		init: function (player, map) {
			this.superInit("GargoyleBlack", {
				width:  240/6,
				height: 112/4,
				count:  24,
			}, 3, player, map);

			this.maxhp = 5;
			this.hp    = 5;
			this.maxmp = 0;
			this.mp    = 0;

			this._str  = 3; // 攻撃力
			this._def  = 0; // 防御力
			// this._int = 1; // 魔力
			this._agi  = 0; // 素早さ
			this._luk  = 0; // 運
			this._vit  = 0; // 体力
			this._dex  = 0; // 器用さ

			this.exp = 500; // 倒した時の経験値

			this.speed = 1;
			this.velocity = tm.geom.Vector2(0, 0);

			this.dropItemList = [
				{
					itemNum: 1,
					random: 2
				}
			];
		}
	});

})(game);
/**
 * GargoyleRed
 */
(function(ns) {

	ns.GargoyleRed = tm.createClass({
		superClass : ns.Enemy,

		init: function (player, map) {
			this.superInit("GargoyleRed", {
				width:  240/6,
				height: 112/4,
				count:  24,
			}, 3, player, map);

			this.maxhp = 5;
			this.hp    = 5;
			this.maxmp = 0;
			this.mp    = 0;

			this._str  = 3; // 攻撃力
			this._def  = 0; // 防御力
			// this._int = 1; // 魔力
			this._agi  = 0; // 素早さ
			this._luk  = 0; // 運
			this._vit  = 0; // 体力
			this._dex  = 0; // 器用さ

			this.exp = 500; // 倒した時の経験値

			this.speed = 1;
			this.velocity = tm.geom.Vector2(0, 0);

			this.dropItemList = [
				{
					itemNum: 1,
					random: 2
				}
			];
		}
	});

})(game);
/**
 * DragonGreen
 */
(function(ns) {

	ns.DragonGreen = tm.createClass({
		superClass : ns.Enemy,

		init: function (player, map) {
			this.superInit("DragonGreen", {
				width:  228/6,
				height: 120/4,
				count:  24,
			}, 3, player, map);

			this.maxhp = 260;
			this.hp    = 260;
			this.maxmp = 0;
			this.mp    = 0;

			this._str  = 35; // 攻撃力
			this._def  = 30; // 防御力
			// this._int = 1; // 魔力
			this._agi  = 0; // 素早さ
			this._luk  = 0; // 運
			this._vit  = 0; // 体力
			this._dex  = 0; // 器用さ

			this.exp = 15; // 倒した時の経験値

			this.speed = 2;
			this.velocity = tm.geom.Vector2(0, 0);

			this.dropItemList = [
				{
					itemName: "ドラゴンの爪(緑)",
					random: 12
				},{
					itemName: "ドラゴンの鱗鎧(緑)",
					random: 6
				}
			];
		}
	});

})(game);
/**
 * DragonBlue
 */
(function(ns) {

	ns.DragonBlue = tm.createClass({
		superClass : ns.Enemy,

		init: function (player, map) {
			this.superInit("DragonBlue", {
				width:  180/6,
				height: 112/4,
				count:  24,
			}, 3, player, map);

			this.maxhp = 5;
			this.hp    = 5;
			this.maxmp = 0;
			this.mp    = 0;

			this._str  = 3; // 攻撃力
			this._def  = 0; // 防御力
			// this._int = 1; // 魔力
			this._agi  = 0; // 素早さ
			this._luk  = 0; // 運
			this._vit  = 0; // 体力
			this._dex  = 0; // 器用さ

			this.exp = 500; // 倒した時の経験値

			this.speed = 1;
			this.velocity = tm.geom.Vector2(0, 0);

			this.dropItemList = [
				{
					itemNum: 1,
					random: 2
				}
			];
		}
	});

})(game);
/**
 * DragonRed
 */
(function(ns) {

	ns.DragonRed = tm.createClass({
		superClass : ns.Enemy,

		init: function (player, map) {
			this.superInit("DragonRed", {
				width:  228/6,
				height: 120/4,
				count:  24,
			}, 3, player, map);

			this.maxhp = 5;
			this.hp    = 5;
			this.maxmp = 0;
			this.mp    = 0;

			this._str  = 3; // 攻撃力
			this._def  = 0; // 防御力
			// this._int = 1; // 魔力
			this._agi  = 0; // 素早さ
			this._luk  = 0; // 運
			this._vit  = 0; // 体力
			this._dex  = 0; // 器用さ

			this.exp = 500; // 倒した時の経験値

			this.speed = 1;
			this.velocity = tm.geom.Vector2(0, 0);

			this.dropItemList = [
				{
					itemNum: 1,
					random: 2
				}
			];
		}
	});

})(game);
/**
 * DragonBlack
 */
(function(ns) {

	ns.DragonBlack = tm.createClass({
		superClass : ns.Enemy,

		init: function (player, map) {
			this.superInit("DragonBlack", {
				width:  228/6,
				height: 120/4,
				count:  24,
			}, 3, player, map);

			this.maxhp = 5;
			this.hp    = 5;
			this.maxmp = 0;
			this.mp    = 0;

			this._str  = 3; // 攻撃力
			this._def  = 0; // 防御力
			// this._int = 1; // 魔力
			this._agi  = 0; // 素早さ
			this._luk  = 0; // 運
			this._vit  = 0; // 体力
			this._dex  = 0; // 器用さ

			this.exp = 500; // 倒した時の経験値

			this.speed = 1;
			this.velocity = tm.geom.Vector2(0, 0);

			this.dropItemList = [
				{
					itemNum: 1,
					random: 2
				}
			];
		}
	});

})(game);
/**
 * DragonWhite
 */
(function(ns) {

	ns.DragonWhite = tm.createClass({
		superClass : ns.Enemy,

		init: function (player, map) {
			this.superInit("DragonWhite", {
				width:  228/6,
				height: 120/4,
				count:  24,
			}, 3, player, map);

			this.maxhp = 5;
			this.hp    = 5;
			this.maxmp = 0;
			this.mp    = 0;

			this._str  = 3; // 攻撃力
			this._def  = 0; // 防御力
			// this._int = 1; // 魔力
			this._agi  = 0; // 素早さ
			this._luk  = 0; // 運
			this._vit  = 0; // 体力
			this._dex  = 0; // 器用さ

			this.exp = 500; // 倒した時の経験値

			this.speed = 1;
			this.velocity = tm.geom.Vector2(0, 0);

			this.dropItemList = [
				{
					itemNum: 1,
					random: 2
				}
			];
		}
	});

})(game);
/**
 * DragonGhost
 */
(function(ns) {

	ns.DragonGhost = tm.createClass({
		superClass : ns.Enemy,

		init: function (player, map) {
			this.superInit("DragonGhost", {
				width:  228/6,
				height: 120/4,
				count:  24,
			}, 3, player, map);

			this.maxhp = 5;
			this.hp    = 5;
			this.maxmp = 0;
			this.mp    = 0;

			this._str  = 3; // 攻撃力
			this._def  = 0; // 防御力
			// this._int = 1; // 魔力
			this._agi  = 0; // 素早さ
			this._luk  = 0; // 運
			this._vit  = 0; // 体力
			this._dex  = 0; // 器用さ

			this.exp = 500; // 倒した時の経験値

			this.speed = 1;
			this.velocity = tm.geom.Vector2(0, 0);

			this.dropItemList = [
				{
					itemNum: 1,
					random: 2
				}
			];
		}
	});

})(game);
/**
 * Death
 */
(function(ns) {

	ns.Death = tm.createClass({
		superClass : ns.Enemy,

		init: function (player, map) {
			this.superInit("Death", {
				width:  144/6,
				height: 120/4,
				count:  24,
			}, 3, player, map);

			this.maxhp = 5;
			this.hp    = 5;
			this.maxmp = 0;
			this.mp    = 0;

			this._str  = 3; // 攻撃力
			this._def  = 0; // 防御力
			// this._int = 1; // 魔力
			this._agi  = 0; // 素早さ
			this._luk  = 0; // 運
			this._vit  = 0; // 体力
			this._dex  = 0; // 器用さ

			this.exp = 500; // 倒した時の経験値

			this.speed = 1;
			this.velocity = tm.geom.Vector2(0, 0);

			this.dropItemList = [
				{
					itemNum: 1,
					random: 2
				}
			];
		}
	});

})(game);
/**
 * ItemList
 */
(function(ns) {

	var ITEM_LIST = {
		item: [
			// 短剣
			{
				name: "ダガー",
				type: "shortsword",
				summary: "両刃の短刀。",
				dropImage: "dropWeapon",
				status: {
					dis: 1, // 射程距離
					str: 2,
					def: 0,
					agi: 1,
					luk: 0,
					vit: 0,
					dex: 0
				}
			},{
				name: "ナイフ",
				type: "shortsword",
				summary: "片刃の短刀。多目的に使用する。",
				dropImage: "dropWeapon",
				status: {
					dis: 1, // 射程距離
					str: 1,
					def: 0,
					agi: 2,
					luk: 0,
					vit: 0,
					dex: 0
				}
			},{
				name: "ジャンビーヤ",
				type: "shortsword",
				summary: "刀身が湾曲しており、刀身の幅が広い。",
				dropImage: "dropWeapon",
				status: {
					dis: 1, // 射程距離
					str: 5,
					def: 0,
					agi: 3,
					luk: 0,
					vit: 0,
					dex: 0
				}
			},{
				name: "パリングダガー",
				type: "shortsword",
				summary: "受け流し用の短剣",
				dropImage: "dropWeapon",
				status: {
					dis: 1, // 射程距離
					str: 3,
					def: 2,
					agi: 2,
					luk: 0,
					vit: 0,
					dex: 0
				}
			},{
				name: "ドラゴンの爪(緑)",
				type: "shortsword",
				summary: "ドラゴンの爪は鋭く、鉄より硬い。",
				dropImage: "dropWeapon",
				status: {
					dis: 1, // 射程距離
					str: 15,
					def: 0,
					agi: 4,
					luk: 0,
					vit: 0,
					dex: 0
				}
			},

			// 長剣
			{
				name: "サーベル",
				type: "longsword",
				summary: "金属を打っただけの直刀。",
				dropImage: "dropWeapon",
				status: {
					dis: 2.5, // 射程距離
					str: 10,
					def: 0,
					agi: -2,
					luk: 0,
					vit: 0,
					dex: 0
				}
			},{
				name: "カッター",
				type: "longsword",
				summary: "片刃の直刀。",
				dropImage: "dropWeapon",
				status: {
					dis: 2.5, // 射程距離
					str: 15,
					def: 0,
					agi: -2,
					luk: 0,
					vit: 0,
					dex: 0
				}
			},{
				name: "レイピア",
				type: "longsword",
				summary: "刺突用の剣。",
				dropImage: "dropWeapon",
				status: {
					dis: 2.5, // 射程距離
					str: 4,
					def: 0,
					agi: 0,
					luk: 0,
					vit: 0,
					dex: 0
				}
			},{
				name: "シャムシール",
				type: "longsword",
				summary: "曲刀。別名、三日月刀。",
				dropImage: "dropWeapon",
				status: {
					dis: 2.5, // 射程距離
					str: 22,
					def: 0,
					agi: -2,
					luk: 0,
					vit: 0,
					dex: 0
				}
			},{
				name: "刀",
				type: "longsword",
				summary: "東洋の直刀。",
				dropImage: "dropWeapon",
				status: {
					dis: 2.5, // 射程距離
					str: 36,
					def: 0,
					agi: -4,
					luk: 0,
					vit: 0,
					dex: 0
				}
			},
			// 大剣two hand sword
			// 槍
			// 戦斧
			// 槌
			// 
			// 盾
			// 大盾

			// 服 cloths
			{
				name: "布の服",
				type: "cloths",
				summary: "布でできた服。生地は薄い。",
				dropImage: "dropWeapon",
				status: {
					str: 0,
					def: 1,
					agi: 0,
					luk: 0,
					vit: 0,
					dex: 0
				}
			},
			// ローブ
			// 軽鎧 lightarmor スケイルアーマー(鱗状)、ラメラーアーマー(薄板を繋ぎ合わせる)、チェーンメイル、含む
			{
				name: "布の鎧",
				type: "lightarmor",
				summary: "布を厚く縫い込んだ軽鎧。",
				dropImage: "dropWeapon",
				status: {
					str: 0,
					def: 3,
					agi: -1,
					luk: 0,
					vit: 0,
					dex: 0
				}
			},{
				name: "革の鎧",
				type: "lightarmor",
				summary: "動物の革を縫い込んだ軽鎧。",
				dropImage: "dropWeapon",
				status: {
					str: 0,
					def: 7,
					agi: -1,
					luk: 0,
					vit: 0,
					dex: 0
				}
			},{
				name: "鱗鎧",
				type: "lightarmor",
				summary: "動物の鱗を縫い込んだ軽鎧。",
				dropImage: "dropWeapon",
				status: {
					str: 0,
					def: 12,
					agi: -1,
					luk: 0,
					vit: 0,
					dex: 0
				}
			},{
				name: "ドラゴンの鱗鎧(緑)",
				type: "lightarmor",
				summary: "ドラゴンの鱗を縫い込んだ軽鎧。とても軽い",
				dropImage: "dropWeapon",
				status: {
					str: 1,
					def: 15,
					agi: 1,
					luk: 0,
					vit: 0,
					dex: 0
				}
			},
			// 重鎧 heavyarmor


			// 使用アイテム
			{
				name: "雑草",
				type: "medicine",
				summary: "食べられそうな草。",
				dropImage: "dropWeapon",
				status: {
					hp: 2
				}
			},{
				name: "薬草",
				type: "medicine",
				summary: "滋養強壮に。",
				dropImage: "dropWeapon",
				status: {
					hp: 7
				}
			},{
				name: "肉",
				type: "medicine",
				summary: "謎肉。",
				dropImage: "dropWeapon",
				status: {
					hp: 10
				}
			},{
				name: "モンスターの液体",
				type: "medicine",
				summary: "不思議な色をしている。たまに動く。",
				dropImage: "dropWeapon",
				status: {
					hp: 10
				}
			},{
				name: "ポーション",
				type: "medicine",
				summary: "薬草を調合した飲み物。",
				dropImage: "dropWeapon",
				status: {
					hp: 30
				}
			},
		]
	};

	ns.ItemList = tm.createClass({
		superClass : tm.app.CanvasElement,

		init: function () {
			this.superInit();
			// アイテムデータ
			this.fromJSON(ITEM_LIST);
		},

		get: function (item) {
			if (item !== null) {
				for (var i = 0; i < this.item.length; ++i) {
					if (this.item[i].name === item) {
						return this.item[i];
					}
				}
			}
			return null;
		}
	});

})(game);
/**
 * DropItem
 */
(function(ns) {

    var IMAGE_WIDTH  = 32;
    var IMAGE_HEIGHT = 128;
    var IMAGE_DIVIDE_COLUMN = 1;
    var IMAGE_DIVIDE_ROW    = 4;
    var IMAGE_ANIM_COUNT    = 4; // 枚数

	ns.DropItem = tm.createClass({
		superClass : tm.app.AnimationSprite,

		init: function (item, image, drawImageScaleSize) {
			var frame = {
                width:  IMAGE_WIDTH/IMAGE_DIVIDE_COLUMN,
                height: IMAGE_HEIGHT/IMAGE_DIVIDE_ROW,
                count:  IMAGE_ANIM_COUNT
            };

            this.item = item;

            var drawImageScaleSize = drawImageScaleSize || 3;

			var ss = tm.app.SpriteSheet({
                image: image || "dropTreasure",
                frame: frame,
                animations: {
                    "open":   [0, 3, "opened", 5],
                    "opened": [3, 4, "opened", 5]
                }
            });

			this.superInit(ss, frame.width*drawImageScaleSize, frame.height*drawImageScaleSize);

			// アニメーション終了時の動作
			this.addEventListener("animationend", function(e) {
				// アニメーションを止める
				this.paused = true;

				// だんだん消える
				this.tweener.
                	to({"alpha": 0}, 700).
                	call(function () {
                		this.remove();
                	}.bind(this));
			});

			// 削除フラグ
			this.isRemove = false;
		},

		isHit: function (player) {
			if (this.isHitElementCircle(player) && this.isRemove === false) {
				this.isRemove = true;
				this.gotoAndPlay("open");
				return this.item;
			}
			return null;
		},

		update: function (app) {
		}
	});

})(game);
/**
 * Status
 */
(function(ns) {

    // ステータス画面のサイズなど
    var STATUS_WIDTH_PADDING = 25;
    var STATUS_WIDTH  = ns.SCREEN_WIDTH  - (STATUS_WIDTH_PADDING*2);
    var STATUS_HEIGHT = ns.SCREEN_HEIGHT - 100;

    var STATUS_TOP_PADDING = 50;
    var STATUS_CENTER_X = ns.SCREEN_WIDTH/2;
    var STATUS_CENTER_Y = STATUS_TOP_PADDING + STATUS_HEIGHT/2;

    var STATUS_TOPLEFT_X   = STATUS_CENTER_X - STATUS_WIDTH/2;
    var STATUS_TOPLEFT_Y   = STATUS_CENTER_Y - STATUS_HEIGHT/2;


    var EXIT_BUTTON_PADDING = 15;
    var EXIT_BUTTON_WIDTH  = 130;
    var EXIT_BUTTON_HEIGHT = 50;
    var EXIT_BUTTON_CENTER_X = ns.SCREEN_WIDTH - STATUS_WIDTH_PADDING - (EXIT_BUTTON_WIDTH/2) - EXIT_BUTTON_PADDING;
    var EXIT_BUTTON_CENTER_Y = STATUS_TOP_PADDING + EXIT_BUTTON_HEIGHT/2 + EXIT_BUTTON_PADDING;

    // ステータス表示のラベルの定数
    var STATUS_LABEL_UP_PADDING      = - STATUS_HEIGHT/2 + (EXIT_BUTTON_PADDING + EXIT_BUTTON_HEIGHT) + EXIT_BUTTON_HEIGHT;
    var STATUS_LABEL_LEFT_PADDING    = 60;
    var STATUS_LABEL_BETWEEN_PADDING = 45;

    // 顔の表示箇所
    var FACE_TOP_PADDING  = 240;
    var FACE_LEFT_PADDING = 170;

    // ラベルのリスト
    var UI_DATA = {
        LABELS: {
            children: [{
                type: "Label",
                name: "statusLevel",
                x: STATUS_LABEL_LEFT_PADDING,
                y: STATUS_LABEL_UP_PADDING,
                width: ns.SCREEN_WIDTH,
                fillStyle: "white",
                text: " ",
                fontSize: 25,
                align: "left"
            },{
                type: "Label",
                name: "statusHP",
                x: STATUS_LABEL_LEFT_PADDING,
                y: STATUS_LABEL_UP_PADDING + (STATUS_LABEL_BETWEEN_PADDING*1),
                width: ns.SCREEN_WIDTH,
                fillStyle: "white",
                text: " ",
                fontSize: 25,
                align: "left"
            },{
                type: "Label",
                name: "statusEXP",
                x: STATUS_LABEL_LEFT_PADDING,
                y: STATUS_LABEL_UP_PADDING + (STATUS_LABEL_BETWEEN_PADDING*2),
                width: ns.SCREEN_WIDTH,
                fillStyle: "white",
                text: " ",
                fontSize: 25,
                align: "left"
            },{
                type: "Label",
                name: "statusSTR",
                x: STATUS_LABEL_LEFT_PADDING,
                y: STATUS_LABEL_UP_PADDING + (STATUS_LABEL_BETWEEN_PADDING*3),
                width: ns.SCREEN_WIDTH,
                fillStyle: "white",
                text: " ",
                fontSize: 25,
                align: "left"
            },{
                type: "Label",
                name: "statusDEF",
                x: STATUS_LABEL_LEFT_PADDING,
                y: STATUS_LABEL_UP_PADDING + (STATUS_LABEL_BETWEEN_PADDING*4),
                width: ns.SCREEN_WIDTH,
                fillStyle: "white",
                text: " ",
                fontSize: 25,
                align: "left"
            },{
                type: "Label",
                name: "statusAGI",
                x: STATUS_LABEL_LEFT_PADDING,
                y: STATUS_LABEL_UP_PADDING + (STATUS_LABEL_BETWEEN_PADDING*5),
                width: ns.SCREEN_WIDTH,
                fillStyle: "white",
                text: " ",
                fontSize: 25,
                align: "left"
            }]
        }
    };

    ns.Status = tm.createClass({
        superClass : tm.app.Shape,

        init: function(parent) {
            this.superInit(ns.SCREEN_WIDTH, ns.SCREEN_HEIGHT);
            this.setPosition(ns.SCREEN_WIDTH/2, ns.SCREEN_HEIGHT/2);

            this.backgroundColor = "rgba(0, 0, 0, 0.0)";
            this.alpha = 1.0;
            
            this.interaction.enabled = true;
            this.interaction.boundingType = "rect";
            this._refresh();

            // プレーヤー
            this.player = parent.player;

            // ステータス終了ボタン
            var endButton = ns.iPhoneBlueButton(EXIT_BUTTON_WIDTH, EXIT_BUTTON_HEIGHT, "終了");
            endButton.position.set(EXIT_BUTTON_CENTER_X, EXIT_BUTTON_CENTER_Y);
            this.endButton = endButton;
            endButton.addEventListener("pointingend", function(e) {
                e.app.popScene();
            });

            // 画像
            var face = ns.Face(parent);
            face.position.set(FACE_LEFT_PADDING, FACE_TOP_PADDING);

            // 武器選択
            var weaponName = this.player.getWeapon() ? this.player.getWeapon().name : "装備無し";
            var weaponButton = tm.app.GlossyButton(280, 60, "gray", weaponName);
            weaponButton.setPosition(200, 500);
            this.weaponButton = weaponButton;

            // メニューボタン押下時の動作
            this.weaponButton.addEventListener("pointingend", function(e) {
                // メニューボタンが押されたらプルダウンを行う
                // 表示するデータを作成
                var pickerData = [{
                    text: "装備無し",
                    subData: {
                        dropImage: null,
                        name: "装備無し",
                        status: {
                            dis: 0,
                            str: 0,
                            def: 0,
                            agi: 0,
                            luk: 0,
                            vit: 0,
                            dex: 0
                        }
                    }
                }];
                for (var i = 0; i < parent.player.getItem().length; ++i) {
                    var itemType = parent.player.getItem()[i].type;
                    if (itemType === "shortsword" ||
                            itemType === "longsword") {
                        var pushData = {
                            text:    parent.player.getItem()[i].name,
                            subData: parent.player.getItem()[i]
                        }
                        pickerData.push(pushData);
                    }
                }
                e.app.pushScene(ns.iPhonePicker(this, pickerData));
            });

            // 防具選択
            var armorName = this.player.getArmor() ? this.player.getArmor().name : "装備無し";
            var armorButton = tm.app.GlossyButton(280, 60, "gray", armorName);
            armorButton.setPosition(200, 580);
            this.armorButton = armorButton;

            // メニューボタン押下時の動作
            this.armorButton.addEventListener("pointingend", function(e) {
                // メニューボタンが押されたらプルダウンを行う
                // 表示するデータを作成
                var pickerData = [{
                    text: "装備無し",
                    subData: {
                        dropImage: null,
                        name: "装備無し",
                        status: {
                            str: 0,
                            def: 0,
                            agi: 0,
                            luk: 0,
                            vit: 0,
                            dex: 0
                        }
                    }
                }];
                for (var i = 0; i < parent.player.getItem().length; ++i) {
                    var itemType = parent.player.getItem()[i].type;
                    if (itemType === "cloths" ||
                            itemType === "lightarmor") {
                        var pushData = {
                            text:    parent.player.getItem()[i].name,
                            subData: parent.player.getItem()[i]
                        }
                        pickerData.push(pushData);
                    }
                }
                e.app.pushScene(ns.iPhonePicker(this, pickerData));
            });


            // アイテム選択
            var medicineName = "使用するアイテムを選択";
            var medicineButton = tm.app.GlossyButton(280, 60, "gray", medicineName);
            medicineButton.setPosition(200, 660);
            this.medicineButton = medicineButton;

            // アイテム使用ボタン押下時の動作
            this.medicineButton.addEventListener("pointingend", function(e) {
                // メニューボタンが押されたらプルダウンを行う
                // 表示するデータを作成
                var pickerData = [{
                    text: "使用アイテムを選択",
                    subData: {
                        dropImage: null,
                        name: "使用アイテムを選択",
                        status: {
                            hp: 0,
                        }
                    }
                }];
                for (var i = 0; i < parent.player.getItem().length; ++i) {
                    var itemType = parent.player.getItem()[i].type;
                    if (itemType === "medicine") {
                        var pushData = {
                            text:    parent.player.getItem()[i].name,
                            subData: parent.player.getItem()[i]
                        }
                        pickerData.push(pushData);
                    }
                }
                e.app.pushScene(ns.iPhonePicker(this, pickerData));
            });

            // 画面に追加
            parent.addChild(this);
            parent.addChild(endButton);
            parent.addChild(weaponButton);
            parent.addChild(armorButton);
            parent.addChild(medicineButton);
            parent.addChild(face);

            // ステータス表示
            this.fromJSON(UI_DATA.LABELS);
            this._drawStatus();
        },

        _drawStatus: function () {
            this.statusLevel.text = "Lv."  + this.player.getLevel();
            // this.statusName.text  = "Name";// + this.player.getLevel();
            this.statusEXP.text   = "EXP " + this.player.getEXP() + "/" + this.player.getNextLevel();
            this.statusHP.text    = "HP "  + this.player.getCurrentHP() + "/" + this.player.getMaxHP();
            // this.statusMP.text    = "MP "  + this.player.getCurrentMP() + "/" + this.player.getMaxMP();
            this.statusSTR.text   = "攻撃力　" + this.player.getSTR() + " + " + (this.player.getWeapon().status.str + this.player.getArmor().status.str);
            this.statusDEF.text   = "防御力　" + this.player.getDEF() + " + " + (this.player.getWeapon().status.def + this.player.getArmor().status.def);
            this.statusAGI.text   = "速度   " + this.player.getAGI() + " + " + (this.player.getWeapon().status.agi + this.player.getArmor().status.agi);
            // this.statusLUK.text   = "LUK " + this.player.getLUK() + " + " + (this.player.getWeapon().status.luk + this.player.getArmor().status.luk);
            // this.statusVIT.text   = "VIT " + this.player.getVIT() + " + " + (this.player.getWeapon().status.vit + this.player.getArmor().status.vit);
            // this.statusDEX.text   = "DEX " + this.player.getDEX() + " + " + (this.player.getWeapon().status.dex + this.player.getArmor().status.dex);
        },
        
        _refresh: function() {
            // 枠線の大きさ
            var lineWidth = 2;

            // 描画
            var c = this.canvas;
            c.resize(this.width, this.height);

            // 描画モード
            c.globalCompositeOperation = "lighter";

            // 外枠
            this._shineStroke(c, lineWidth, lineWidth + STATUS_TOPLEFT_X, lineWidth + STATUS_TOPLEFT_Y, 190, 80, 30, lineWidth/2);

            // 描画モード
            c.globalCompositeOperation = "source-over";

            // 中身
            c.fillStyle = "rgba(5,25,60,0.5)";
            c.fillRoundRect(
                lineWidth + STATUS_TOPLEFT_X, 
                lineWidth + STATUS_TOPLEFT_Y, 
                STATUS_WIDTH, 
                STATUS_HEIGHT, 
                lineWidth*2);
            // this._strokeRefresh(c, lineWidth, lineWidth*2, lineWidth*2, ns.Status.IN_STROKE_COLOR,  lineWidth/2);


            // var grad = tm.graphics.LinearGradient(0, 0, 0, this.height);

            // // グラデーション
            // grad.addColorStop(0.0, ns.Status.BACK_GRADIENT_COLOR_TOP);
            // grad.addColorStop(0.5, ns.Status.BACK_GRADIENT_COLOR_CENTER);
            // grad.addColorStop(0.5, ns.Status.BACK_GRADIENT_COLOR_BOTTOM);
            // grad.addColorStop(1.0, ns.Status.BACK_GRADIENT_COLOR_BOTTOM);
            // c.setGradient(grad);
            // c.fillRect(lineWidth, lineWidth, this.width-lineWidth*2, this.height-lineWidth*2, lineWidth*4);
        },

        _strokeRefresh: function (canvas, lineWidth, linePositionX, linePositionY, color, radius) {
            // 外枠
            radius = radius || 0; // 角丸の大きさ
            canvas.strokeStyle   = color;
            canvas.lineWidth     = lineWidth;
            canvas.fillStyle     = color;

            if (radius === 0) {
                canvas.strokeStyle+= lineWidth/2;
                canvas.strokeRect(linePositionX, linePositionY, STATUS_WIDTH-(linePositionX*2), STATUS_HEIGHT-(linePositionY*2));
                // canvas.clip();
            }
            else {
                canvas.strokeRoundRect(linePositionX, linePositionY, STATUS_WIDTH, STATUS_HEIGHT, lineWidth*2);
                //canvas.clip(); // 以下描画時のimageデータをくり抜くため、上記処理が上書きされない
            }
        },

        _shineStroke: function (canvas, lineWidth, linePositionX, linePositionY, h, s, l, radius) {
            var lineHSL   = tm.graphics.Color.createStyleHSL(h, s-50, l+50);
            var shadowHSL = tm.graphics.Color.createStyleHSL(h, s, l);

            // 影を濃くする
            for (var i = 0; i < 12; ++i) {
                // 影
                canvas.setShadow(shadowHSL, 0, 0, 40);
                this._strokeRefresh(canvas, lineWidth, linePositionX, linePositionY, lineHSL, radius);
            }
        },

        update: function () {
            // ピッカーで何か選んだ時の動作
            if (this.weaponButton.returnedData) {
                this.player.equipWeapon(this.weaponButton.returnedData);
                this._drawStatus();
                this.weaponButton.returnedData = null;
            }
            if (this.armorButton.returnedData) {
                this.player.equipArmor(this.armorButton.returnedData);
                this._drawStatus();
                this.armorButton.returnedData = null;
            }
            // 食事
            if (this.medicineButton.returnedData) {
                this.player.eatMedicine(this.medicineButton.returnedData);

                var removeMedicineIte = 0
                for (var i = 0; i < this.player.getItem().length; ++i) {
                    var itemType = this.player.getItem()[i].type;
                    if (itemType === "medicine") {
                        ++removeMedicineIte;
                        if (removeMedicineIte === this.medicineButton.ite) {
                            // アイテム削除
                            this.player.deleteItem(i);
                        }
                    }
                }

                this._drawStatus();
                this.medicineButton.returnedData = null;
            }
        },
    });

    // ns.Status.OUT_STROKE_COLOR = "rgba(20, 40, 100, 0.5)";
    ns.Status.OUT_STROKE_COLOR = "rgba(255, 255, 255, 1.0)";
    // ns.Status.IN_STROKE_COLOR  = "rgba(20, 80, 180, 0.5)";
    ns.Status.IN_STROKE_COLOR  = "rgba(255, 0, 0, 1.0)";

    ns.Status.BACK_GRADIENT_COLOR_TOP    = "rgba(120, 160, 245, 0.5)";
    ns.Status.BACK_GRADIENT_COLOR_CENTER = "rgba(55, 120, 220, 0.5)";
    ns.Status.BACK_GRADIENT_COLOR_BOTTOM = "rgba(35, 95, 220, 0.5)";

})(game);
/**
 * Face
 */
(function(ns) {

    ns.Face = tm.createClass({
        superClass : tm.app.Shape,

        init: function(parent) {
            this.superInit(220, 220);
            this.backgroundColor = "rgba(255, 255, 255, 0.5)";
            this._refresh();

            // 画像
            var face = tm.app.Sprite("playerFace", 192, 192);
            face.position.set(0, 0);

            // 画面に追加
            this.addChild(face);
        },
        
        _refresh: function() {
            // ボタン描画
            var c = this.canvas;
            c.resize(this.width, this.height);
            c.fillStyle = this.backgroundColor;
            c.fillRoundRect(2, 2, this.width-4, this.height-4, 10);
            c.strokeStyle   = "rgba(255,255,255,0.75)";
            c.lineWidth     = 2;
            c.strokeRoundRect(2, 2, this.width-4, this.height-4, 10);
        },
    });
})(game);
/**
 * StageManager
 */
(function(ns) {

    var STAGE_MAKING = [
        // 1-10
        [
            {enemy: ns.SlimeGreen,      num: 15},
        ],[
            {enemy: ns.SlimeGreen,      num: 20},
            {enemy: ns.SmallBatBlack,   num: 5},
        ],[
            {enemy: ns.SlimeGreen,      num: 15},
            {enemy: ns.SmallBatBlack,   num: 10},
        ],[
            {enemy: ns.SlimeGreen,      num: 10},
            {enemy: ns.SmallBatBlack,   num: 15},
            {enemy: ns.GoblinGrey,      num: 5},
        ],[
            {enemy: ns.SlimeGreen,      num: 10},
            {enemy: ns.SmallBatBlack,   num: 10},
            {enemy: ns.GoblinGrey,      num: 15},
        ],[
            {enemy: ns.SlimeGreen,      num: 10},
            {enemy: ns.SmallBatBlack,   num: 10},
            {enemy: ns.GoblinGrey,      num: 10},
            {enemy: ns.BatBlack,        num: 5},
        ],[
            {enemy: ns.SlimeGreen,      num: 10},
            {enemy: ns.SmallBatBlack,   num: 10},
            {enemy: ns.GoblinGrey,      num: 10},
            {enemy: ns.BatBlack,        num: 10},
        ],[
            {enemy: ns.SlimeGreen,      num: 10},
            {enemy: ns.SmallBatBlack,   num: 10},
            {enemy: ns.GoblinGrey,      num: 10},
            {enemy: ns.BatBlack,        num: 10},
        ],[
            {enemy: ns.SlimeGreen,      num: 10},
            {enemy: ns.SmallBatBlack,   num: 10},
            {enemy: ns.GoblinGrey,      num: 10},
            {enemy: ns.BatBlack,        num: 5},
        ],[
            {enemy: ns.SlimeGreen,      num: 10},
            {enemy: ns.SmallBatBlack,   num: 10},
            {enemy: ns.GoblinGrey,      num: 10},
            {enemy: ns.BatBlack,        num: 5},
        ],

        // 11-20
        [
            {enemy: ns.SmallBatBlack,   num: 10},
            {enemy: ns.GoblinGrey,      num: 10},
            {enemy: ns.BatBlack,        num: 10},
            {enemy: ns.SkeltonNormal,   num: 5},
        ],[
            {enemy: ns.GoblinGrey,      num: 10},
            {enemy: ns.BatBlack,        num: 15},
            {enemy: ns.SkeltonNormal,   num: 10},
        ],[
            {enemy: ns.GoblinGrey,      num: 5},
            {enemy: ns.BatBlack,        num: 10},
            {enemy: ns.SkeltonNormal,   num: 10},
            {enemy: ns.SlimeBlue,       num: 10},
        ],[
            {enemy: ns.GoblinGrey,      num: 5},
            {enemy: ns.BatBlack,        num: 10},
            {enemy: ns.SkeltonNormal,   num: 10},
            {enemy: ns.SlimeBlue,       num: 10},
        ],[
            {enemy: ns.GoblinGrey,      num: 5},
            {enemy: ns.BatBlack,        num: 5},
            {enemy: ns.SkeltonNormal,   num: 10},
            {enemy: ns.SlimeBlue,       num: 10},
            {enemy: ns.HarypyNormal,    num: 10},
        ],[
            {enemy: ns.BatBlack,        num: 5},
            {enemy: ns.SkeltonNormal,   num: 10},
            {enemy: ns.SlimeBlue,       num: 10},
            {enemy: ns.HarypyNormal,    num: 15},
        ],[
            {enemy: ns.BatBlack,        num: 5},
            {enemy: ns.SkeltonNormal,   num: 10},
            {enemy: ns.SlimeBlue,       num: 10},
            {enemy: ns.HarypyNormal,    num: 15},
        ],[
            {enemy: ns.BatBlack,        num: 5},
            {enemy: ns.SkeltonNormal,   num: 10},
            {enemy: ns.SlimeBlue,       num: 10},
            {enemy: ns.HarypyNormal,    num: 15},
        ],[
            {enemy: ns.SkeltonNormal,   num: 10},
            {enemy: ns.SlimeBlue,       num: 10},
            {enemy: ns.HarypyNormal,    num: 15},
            {enemy: ns.LizardManNormal, num: 5},
        ],[
            {enemy: ns.SkeltonNormal,   num: 10},
            {enemy: ns.SlimeBlue,       num: 10},
            {enemy: ns.HarypyNormal,    num: 15},
            {enemy: ns.LizardManNormal, num: 5},
        ],

        // 21-30
        [
            {enemy: ns.HarypyNormal,    num: 15},
            {enemy: ns.LizardManNormal, num: 5},
            {enemy: ns.SmallBatGreen,   num: 10},
            {enemy: ns.GoblinGreen,     num: 10},
        ],[
            {enemy: ns.HarypyNormal,    num: 10},
            {enemy: ns.LizardManNormal, num: 5},
            {enemy: ns.SmallBatGreen,   num: 10},
            {enemy: ns.GoblinGreen,     num: 10},
            {enemy: ns.BatGreen,        num: 10},
        ],[
            {enemy: ns.HarypyNormal,    num: 10},
            {enemy: ns.LizardManNormal, num: 5},
            {enemy: ns.SmallBatGreen,   num: 10},
            {enemy: ns.GoblinGreen,     num: 10},
            {enemy: ns.BatGreen,        num: 10},
        ],[
            {enemy: ns.HarypyNormal,    num: 10},
            {enemy: ns.LizardManNormal, num: 5},
            {enemy: ns.SmallBatGreen,   num: 10},
            {enemy: ns.GoblinGreen,     num: 10},
            {enemy: ns.BatGreen,        num: 10},
        ],[
            {enemy: ns.LizardManNormal, num: 5},
            {enemy: ns.SmallBatGreen,   num: 10},
            {enemy: ns.GoblinGreen,     num: 10},
            {enemy: ns.BatGreen,        num: 10},
            {enemy: ns.SlimeRed,        num: 10},
        ],[
            {enemy: ns.LizardManNormal, num: 5},
            {enemy: ns.SmallBatGreen,   num: 10},
            {enemy: ns.GoblinGreen,     num: 10},
            {enemy: ns.BatGreen,        num: 10},
            {enemy: ns.SlimeRed,        num: 10},
        ],[
            {enemy: ns.LizardManNormal, num: 5},
            {enemy: ns.SmallBatGreen,   num: 10},
            {enemy: ns.GoblinGreen,     num: 10},
            {enemy: ns.BatGreen,        num: 10},
            {enemy: ns.SlimeRed,        num: 10},
        ],[
            {enemy: ns.SmallBatGreen,   num: 10},
            {enemy: ns.GoblinGreen,     num: 10},
            {enemy: ns.BatGreen,        num: 10},
            {enemy: ns.SlimeRed,        num: 15},
        ],[
            {enemy: ns.SmallBatGreen,   num: 10},
            {enemy: ns.GoblinGreen,     num: 10},
            {enemy: ns.BatGreen,        num: 10},
            {enemy: ns.SlimeRed,        num: 15},
        ],[
            {enemy: ns.GoblinGreen,     num: 5},
            {enemy: ns.BatGreen,        num: 5},
            {enemy: ns.SlimeRed,        num: 10},
            {enemy: ns.DragonGreen,     num: 20},
        ]
    ];

	ns.StageManager = tm.createClass({
		init: function (stageNum, enemyGroup, player, map) {
            this._isGameClear = false;
            if (STAGE_MAKING.length < stageNum) {
                // ゲームクリア
                this._isGameClear = true;
            }
            else {
                for (var i = 0; i < STAGE_MAKING[stageNum-1].length; ++i) {
                    var dataCreateEnemy = STAGE_MAKING[stageNum-1][i];
                    this._createEnemy(enemyGroup, player, map, dataCreateEnemy.enemy, dataCreateEnemy.num);
                }
            }
		},

        isGameClear: function () {
            return this._isGameClear;
        },

        _createEnemy: function (enemyGroup, player, map, enemyClass, num) {
            // 敵を生成して返す
            for (var i = 0; i < num; ++i) {
                // enemyを作成
                var enemy = enemyClass(player, map);
                // Sceneの座標に変換
                var safeEnemyPosition = map.getRandomSafeMapChipPosition();
                safeEnemyPosition = map.mapLeftTopToMapCenter(
                    safeEnemyPosition.x * map.mapChipWidth + map.mapChipWidth/2,
                    safeEnemyPosition.y * map.mapChipHeight);

                enemy.position.set(safeEnemyPosition.x, safeEnemyPosition.y);
                enemyGroup.addChild(enemy);
            }
        },
	});

})(game);
/**
 * BarLoadingScene
 */
(function(ns) {
    
    var DEFAULT_PARAM = {
        width: 465,
        height: 465,
    };
    
    ns.BarLoadingScene = tm.createClass({
        superClass: tm.app.Scene,
        
        init: function(param) {
            this.superInit();
            
            param = {}.$extend(DEFAULT_PARAM, param);
            
            // 既にロードしたオブジェクト数
            this.loadedCounter = 0;

            // これからロードするオブジェクト数
            var planLoadNum = 0;
            for (var i in param.assets) {
                ++planLoadNum;
            }
            this.planLoadNum = planLoadNum;

            // 一つロードした際に増加する割合
            this.barUnit = 100 / planLoadNum;
            
            // プログレスバー
            var bar = ns.ProgressBar(ns.SCREEN_WIDTH-100, 25);
            bar.setPosition(ns.SCREEN_WIDTH/2, ns.SCREEN_HEIGHT - 90);
            bar.setBarLength(0);
            this.bar = bar;
            this.addChild(bar);

            this.alpha = 0.0;
            this.tweener.clear().fadeIn(100).call(function() {
                if (param.assets) {
                    tm.asset.AssetManager.onload = function() {
                        this.tweener.clear().fadeOut(200).call(function() {
                            this.app.replaceScene(param.nextScene());
                        }.bind(this));
                    }.bind(this);
                    this.assets = tm.asset.AssetManager.load(param.assets);
                    this.loadedCounter = this.assets._loadedCounter;
                }
            }.bind(this));
        },

        update: function () {
            if (this.assets) {
                this.bar.setBarLength((this.assets._loadedCounter - this.loadedCounter) * this.barUnit);
            }
        },
    });
    
    
})(game);
/**
 * EffectLoadingScene
 */
(function(ns) {
    
    var DEFAULT_PARAM = {
        width: 465,
        height: 465,
    };
    
    ns.EffectLoadingScene = tm.createClass({
        superClass: tm.app.Scene,
        
        init: function(param) {
            this.superInit();
            
            param = {}.$extend(DEFAULT_PARAM, param);
            
            // 既にロードしたオブジェクト数
            this.loadedCounter = 0;

            // これからロードするオブジェクト数
            var planLoadNum = 0;
            for (var i in param.assets) {
                ++planLoadNum;
            }
            this.planLoadNum = planLoadNum;

            // 一つロードした際に増加する割合
            this.barUnit = 100 / planLoadNum;
            
            // プログレスバー
            var bar = ns.ProgressBar(ns.SCREEN_WIDTH-250, 25);
            bar.setPosition(ns.SCREEN_WIDTH/2 - 50, ns.SCREEN_HEIGHT - 90);
            bar.setBarLength(0);
            this.bar = bar;
            this.addChild(bar);


            // ロード中のエフェクト
            var ss = tm.app.SpriteSheet({
                image: "loading",
                frame: {
                    width:  128,
                    height: 128,
                    count:  30
                },
                animations: {
                    "load": [0, 30, "load"]
                }
            });
            var loading = tm.app.AnimationSprite(ss, 256, 256);
            loading.position.set(ns.SCREEN_WIDTH - 100, ns.SCREEN_HEIGHT - 100);
            this.addChild(loading);
            loading.gotoAndPlay("load");

            this.alpha = 0.0;
            this.tweener.clear().fadeIn(100).call(function() {
                if (param.assets) {
                    tm.asset.AssetManager.onload = function() {
                        this.tweener.clear().fadeOut(200).call(function() {
                            this.app.replaceScene(param.nextScene());
                        }.bind(this));
                    }.bind(this);
                    this.assets = tm.asset.AssetManager.load(param.assets);
                    this.loadedCounter = this.assets._loadedCounter;
                }
            }.bind(this));
        },

        update: function () {
            if (this.assets) {
                this.bar.setBarLength((this.assets._loadedCounter - this.loadedCounter) * this.barUnit);
            }
        },
    });
    
    
})(game);
/**
 * TitleScene
 */
(function(ns) {

    ns.TitleScene = tm.createClass({
        superClass : tm.app.TitleScene,

        init : function() {
            this.superInit({
                title :  "RoguePlus",
                width :  ns.SCREEN_WIDTH,
                height : ns.SCREEN_HEIGHT
            });

            this.addEventListener("pointingend", function(e) {
                // シーンの切り替え
                var loadingScene = ns.EffectLoadingScene({
                    width:        e.app.width,
                    height:       e.app.height,
                    assets:       MAIN_ASSET,
                    nextScene:    ns.MainScene,
                });
                e.app.replaceScene(loadingScene);
            });
        }
    });

})(game);
/**
 * MainScene
 */
(function(ns) {

    // ラベルのリスト
    var UI_DATA = {
        LABELS: {
            children: [{
                type: "Label",
                name: "stairsNum",
                x: 100,
                y: 80,
                width: ns.SCREEN_WIDTH,
                fillStyle: "white",
                text: " ",
                fontSize: 25,
                align: "right"
            },{
                type: "Label",
                name: "statusLevel",
                x: 130,
                y: 80,
                width: ns.SCREEN_WIDTH,
                fillStyle: "white",
                text: " ",
                fontSize: 25,
                align: "left"
            },{
                type: "Label",
                name: "statusHP",
                x: 230,
                y: 80,
                width: ns.SCREEN_WIDTH,
                fillStyle: "white",
                text: " ",
                fontSize: 25,
                align: "left"
            },{
                type: "Label",
                name: "statusMP",
                x: 430,
                y: 80,
                width: ns.SCREEN_WIDTH,
                fillStyle: "white",
                text: " ",
                fontSize: 25,
                align: "left"
            }]
        }
    };

    ns.MainScene = tm.createClass({
        superClass : tm.app.Scene,

        init : function(continuePlayer, continuePad) {
            this.superInit();

            // コントローラーパッド
            var pad = continuePad || tm.app.Pad();
            this.pad = pad;
            pad.position.set(100, ns.SCREEN_HEIGHT - 80);

            // プレイヤー
            var player = continuePlayer || ns.Player(pad);
            this.player = player;
            player.setInputPad(pad);
            player.position.set(ns.SCREEN_WIDTH/2, ns.SCREEN_HEIGHT/2);

            // セーブデータがあれば引き継ぐ
            var saveData = this._loadSaveData();
            if (saveData && !continuePlayer && !continuePad) {
                var savedPlayer           = saveData.saveData.player;
                ns.MainScene.STAGE_NUMBER = saveData.saveData.stairs;
                player.dataLoad(savedPlayer);
            }

            // マップ
            var map = ns.Map(pad);
            this.map = map;
            // 取得した位置をスクリーンの中心になるようにマップの中心座標を設定する
            var safePosition = map.getRandomSafeMapChipPosition(); // 場所を取得
            safePosition = map.mapLeftTopToMapCenter(
                safePosition.x * map.mapChipWidth  + map.mapChipWidth/2,
                safePosition.y * map.mapChipHeight);
            // マップの中心位置を計算する(safePositionがスクリーンの中心に来るように)
            safePosition.x = ns.SCREEN_WIDTH/2  - safePosition.x;
            safePosition.y = ns.SCREEN_HEIGHT/2 - safePosition.y;
            map.setStairs();
            map.initMapPosition(safePosition);
            map.setPlayer(safePosition);

            // アイテム
            var itemList   = ns.ItemList();
            var itemGroup  = tm.app.CanvasElement();
            this.itemGroup = itemGroup;
            map.setItemGroup(itemGroup);

            // 敵
            var enemyGroup = tm.app.CanvasElement();
            this.enemyGroup = enemyGroup;
            this.stage = ns.StageManager(ns.MainScene.STAGE_NUMBER, enemyGroup, player, map);


            // 敵をマップに追加
            map.setEnemyGroup(enemyGroup);

            // 攻撃時のエフェクト
            var slashSS = tm.app.SpriteSheet({
                image: "slash",
                frame: {
                    width:  65,
                    height: 65,
                    count: 8
                },
                animations: {
                    "slash": [0, 8]
                }
            });
            var slash = tm.app.AnimationSprite(slashSS, 120, 120);
            slash.position.set(ns.SCREEN_WIDTH/2 + 10, ns.SCREEN_HEIGHT/2 + 10);

            // 敵撃破時のエフェクト
            var enemyDeadSS = tm.app.SpriteSheet({
                image: "enemydead",
                frame: {
                    width:  64,
                    height: 64,
                    count: 40
                },
                animations: {
                    "enemydead": [0, 40]
                }
            });

            // 攻撃ボタン
            var attackIcon = tm.app.Sprite("attackIcon", 72, 72);
            var attackButton = ns.GlossyImageButton(200, 160, attackIcon, "green");
            attackButton.position.set(ns.SCREEN_WIDTH-50-50, ns.SCREEN_HEIGHT-30-50);
            this.attackButton = attackButton;
            var attackTiming = ns.Timing(150);
            this.attackTiming = attackTiming;

            // 攻撃時の処理
            var attackMethod = function (app) {
                // タイミングが来たら攻撃可能
                attackTiming.resetLimit(player.getAttackSpeed(app.fps));
                if (attackTiming.is() === false) {
                    return ;
                }
                attackTiming.reset();

                // 攻撃の方向を調べる
                var attackAngle = player.attack();
                var attackVelocity = tm.geom.Vector2(0,0).setDegree(attackAngle, 1);
                attackVelocity.y *= -1;
                // 攻撃の場所を計算する()画面上
                var distanse = 50 + (player.getDistanse() * 20);
                var attackScreenPosition = player.position.clone().add(tm.geom.Vector2.mul(attackVelocity, distanse));

                // 攻撃時のアニメーション
                slash.position.set(attackScreenPosition.x, attackScreenPosition.y);
                slash.gotoAndPlay("slash");

                // 攻撃するポイントを作成
                var attackMapPosition = map.playerPosition.clone().add(tm.geom.Vector2.mul(attackVelocity, distanse));
                attackMapPosition = map.mapLeftTopToMapCenter(attackMapPosition.x, attackMapPosition.y-20);
                var attackElement = tm.app.Object2D();
                attackElement.radius = 20;
                attackElement.position.set(attackMapPosition.x, attackMapPosition.y);

                // 攻撃が当たっているか調べる
                for (var i = 0; i < enemyGroup.children.length; ++i) {
                    var enemy = enemyGroup.children[i];
                    var position = enemy.position.clone();
                    if (enemy.isHitElementCircle(attackElement)) {
                        // ダメージ数を計算
                        var attack = player.getAttackPoint();
                        var damage = enemy.damage(attack);

                        // ダメージ数を表示
                        var damageEffect = ns.DamagedNumber(damage);

                        // 経験値取得
                        var exp = enemy.getExp();
                        player.addExp(exp, app);

                        // アイテムドロップ
                        var itemData = itemList.get(enemy.getDropItem());
                        if (itemData !== null) {
                            var dropItem = ns.DropItem(itemData);
                            dropItem.position.set(enemy.x, enemy.y);
                            map.addItem(dropItem);
                        }

                        // 敵が死んでた
                        if (enemy.isEnemyDead()) {
                            // 死んだエフェクト
                            var enemydead = tm.app.AnimationSprite(enemyDeadSS, 120, 120);
                            enemydead.position.set(enemy.x, enemy.y);
                            map.setEnemyDeadAnimation(enemydead);
                            enemydead.gotoAndPlay("enemydead");
                        }

                        // 表示場所を設定
                        var damagePosition = map.mapCenterToScreenTopLeft(enemy.x, enemy.y);
                        damageEffect.effectPositionSet(damagePosition.x + 10, damagePosition.y + 5);
                        app.currentScene.addChild(damageEffect);
                    }
                }
            };
            this.attackMethod = attackMethod;

            attackButton.addEventListener("pointingmove", function(e) {
                attackMethod(e.app);
            });

            // ステータス画面への遷移ボタン
            var statusIcon = tm.app.Sprite("statusIcon", 72, 72);
            var statusButton = ns.GlossyImageButton(200, 160, statusIcon, "blue");
            statusButton.position.set(ns.SCREEN_WIDTH/2, ns.SCREEN_HEIGHT-30-50);
            this.statusButton = statusButton;
            statusButton.addEventListener("pointingend", function(e) {
                tm.asset.AssetManager.get("openstatus").clone().play();
                e.app.pushScene(ns.StatusScene(player));
            });

            // 画面に追加
            this.addChild(map);
            this.windows = ns.ManageSimpleWindows(this); // ウィンドウ
            this.addChild(pad);
            this.addChild(player);
            this.addChild(slash);
            this.addChild(attackButton);
            this.addChild(statusButton);

            // サウンド：BGM
            this.bgm = tm.asset.AssetManager.get("dungeon");
            this.bgm.loop = true;
            this.bgm.play();

            // ステータス表示
            this.fromJSON(UI_DATA.LABELS);
        },

        screenLeftTopToCenter: function (x, y) {
            var result = tm.geom.Vector2(x - ns.SCREEN_WIDTH/2, y - ns.SCREEN_HEIGHT/2);
            return result;
        },
        screenCenterToLeftTop: function (x, y) {
            var result = tm.geom.Vector2(x + ns.SCREEN_WIDTH/2, y + ns.SCREEN_HEIGHT/2);
            return result;
        },

        drawStatus: function () {
            this.stairsNum.text   = ns.MainScene.STAGE_NUMBER + "階";
            this.statusLevel.text = "Lv." + this.player.getLevel();
            this.statusHP.text    = "HP " + this.player.getCurrentHP() + "/" + this.player.getMaxHP();
            // this.statusMP.text    = "MP " + this.player.getCurrentMP() + "/" + this.player.getMaxMP();
        },

        update : function(app) {
            // 攻撃のアクティブバーのカウントアップ
            this.attackTiming.update()

            // ステータスの描画
            this.drawStatus();

            // キーボード押下時の攻撃
            if (app.keyboard.getKey("z")) {
                var attackTiming = this.attackTiming;
                this.attackMethod(app);
            }

            // 次のステージに進むフラグがたったらマップ更新
            if (this.map.isNextStage()) {
                ++ns.MainScene.STAGE_NUMBER;
                this.bgm.stop();
                tm.asset.AssetManager.get("downStairs").clone().play();
                this._autoSave();
                app.replaceScene(ns.MainScene(this.player, this.pad));
            }

            // ゲームオーバーフラグがたったらゲーム終了
            if (this.player.isGameOver()) {
                this.bgm.stop();
                this._deleteSaveData();
                app.replaceScene(ns.EndScene(ns.MainScene.STAGE_NUMBER, this.player.getLevel(), false));
            }

            // ゲームクリアフラグがたったらゲーム終了
            if (this.stage.isGameClear()) {
                this.bgm.stop();
                this._deleteSaveData();
                tm.asset.AssetManager.get("levelup").clone().play();
                app.replaceScene(ns.EndScene(ns.MainScene.STAGE_NUMBER, this.player.getLevel(), true));
            }
        },

        _autoSave: function () {
            // セーブデータを作成
            var saveData = {
                player: this.player.cloneToSave(),
                stairs: ns.MainScene.STAGE_NUMBER,
            };

            var date = new Date();
            var alldate = date.format("Y/m/d");
            var year    = date.format("Y");
            var month   = date.format("m");
            var day     = date.format("d");

            var memorizeData = {
                date: {
                    all: alldate,
                    year: year,
                    month: month,
                    day: day,
                },
                saveData: saveData
            };

            localStorage["RoguePlus"] = JSON.stringify(memorizeData);
        },

        _loadSaveData: function () {
            // ローカルストレージからデータを取得
            var loadLocalStorage = localStorage["RoguePlus"];
            if (loadLocalStorage) {
                return JSON.parse(loadLocalStorage);
            }
            else {
                return null;
            }
        },

        _deleteSaveData: function () {
            localStorage.removeItem("RoguePlus");
        },
    });

    ns.MainScene.STAGE_NUMBER = 1;

})(game);
/**
 * StatusScene
 */
(function(ns) {

    ns.StatusScene = tm.createClass({
        superClass : tm.app.Scene,

        init : function(player) {
            this.superInit();
            this.player = player;

            // 画面にかける色
            var filter = tm.app.Shape(ns.SCREEN_WIDTH, ns.SCREEN_HEIGHT);
            filter.setPosition(ns.SCREEN_WIDTH/2, ns.SCREEN_HEIGHT/2);
            filter.canvas.clearColor("rgba(0, 0, 0, 0.75)");
            this.addChild(filter);

            // ステータス画面
            var status = ns.Status(this);
            this.status = status;
        },

        update : function() {
        }
    });

})(game);
/**
 * EndScene
 */
(function(ns) {

    var RESULT_PARAM = {
            score: 256,
            msg:      "【Rogue+】",
            hashtags: ["omatoro", "Rogue", "tmlib"],
            url:      "http://omatoro.github.io/RoguePlus",
            width:    ns.SCREEN_WIDTH,
            height:   ns.SCREEN_HEIGHT,
            related:  "tmlib.js javascript testcording",
    };

    ns.EndScene = tm.createClass({

        superClass : tm.app.ResultScene,

        // タイトル移動へのボタン
        title_button : {},

        init : function(stairsNum, playerLevel, isClear) {
            if (isClear) {
                RESULT_PARAM.score = "全" + (stairsNum-1) + "階制覇しました";
            }
            else {
                RESULT_PARAM.score = stairsNum + "階で死亡しました";
            }
            this.superInit(RESULT_PARAM);


        },

        update : function () {
        },

        // Backボタンを押したら、onpointingstart->インスタンス.dispatchEventにより
        // 以下onnextsceneイベントが実行される
        onnextscene : function () {
            ns.app.replaceScene(ns.TitleScene());
            ns.MainScene.STAGE_NUMBER = 1;
        },
    });

})(game);
/**
 * ゲーム起動処理
 */
(function(ns) {

    tm.main(function() {

        // アプリケーション作成
        ns.app = tm.app.CanvasApp("#world");
        ns.app.resize(ns.SCREEN_WIDTH, ns.SCREEN_HEIGHT); // 画面サイズに合わせる
        ns.app.fitWindow(); // リサイズ対応
        ns.app.background = "rgb(0, 0, 0)"; // 背景色をセット

        // デバッグ時のみ
        if (ns.QUERY_PARAM.stats == "true") {
            ns.app.enableStats();
        }

        var targetScene = ns[ns.QUERY_PARAM.scene] || ns.TitleScene;
        var assets = ASSET_MAP[ns.QUERY_PARAM.scene] || TITLE_ASSETS;

        // シーンの切り替え
        var loadingScene = ns.BarLoadingScene({
            width:      ns.app.width,
            height:     ns.app.height,
            assets:     assets,
            nextScene:  targetScene,
        });
        ns.app.replaceScene(loadingScene);

        // tmlibの実行
        ns.app.run();

    });

})(game);