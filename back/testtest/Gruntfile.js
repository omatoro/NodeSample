module.exports = function(grunt) {
	'use strict';

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		// ファイル結合の設定
		concat: {
			dist: {
				src: [
			        "js/effect/simplemessagewindow.js",
			        "js/effect/managesimplewindow.js",
			        "js/effect/oneplayanimationsprite.js",
			        "js/effect/oneplayanimationsprite.js",
			        "js/effect/damagednumber.js",
			        "js/effect/baloon.js",
			        "js/effect/glossyimagebutton.js",
			        
			        "js/map/generatemap.js",
			        "js/map/autotile.js",
			        "js/map/mapchip.js",
			        "js/map/mapsprite.js",
			        "js/map/map.js",
			        
			        "js/char/animationcharactor.js",
			        "js/char/player.js",
			        
			        "js/char/enemy/enemy.js",
			        "js/char/enemy/SlimeBlue.js",
			        "js/char/enemy/SlimeGreen.js",
			        "js/char/enemy/SlimeRed.js",
			        "js/char/enemy/SlimeGold.js",
			        "js/char/enemy/SmallBatBlack.js",
			        "js/char/enemy/SmallBatGreen.js",
			        "js/char/enemy/SmallBatRed.js",
			        "js/char/enemy/SmallBatGhost.js",
			        "js/char/enemy/GoblinGrey.js",
			        "js/char/enemy/GoblinGreen.js",
			        "js/char/enemy/GoblinRed.js",
			        "js/char/enemy/BatBlack.js",
			        "js/char/enemy/BatGreen.js",
			        "js/char/enemy/BatBlue.js",
			        "js/char/enemy/BatRed2.js",
			        "js/char/enemy/BatWhite.js",
			        "js/char/enemy/SkeltonNormal.js",
			        "js/char/enemy/SkeltonGreen.js",
			        "js/char/enemy/SkeltonBlue.js",
			        "js/char/enemy/SkeltonRed.js",
			        "js/char/enemy/HarypyNormal.js",
			        "js/char/enemy/LizardManNormal.js",
			        "js/char/enemy/LizardManBlue.js",
			        "js/char/enemy/LizardManRed.js",
			        "js/char/enemy/ZombieNormal.js",
			        "js/char/enemy/ZombieRed.js",
			        "js/char/enemy/GolemNormal.js",
			        "js/char/enemy/GolemGreen.js",
			        "js/char/enemy/GolemBlue.js",
			        "js/char/enemy/GolemRed.js",
			        "js/char/enemy/GolemGhost.js",
			        "js/char/enemy/GhostNormal.js",
			        "js/char/enemy/GargoyleBlack.js",
			        "js/char/enemy/GargoyleRed.js",
			        "js/char/enemy/DragonGreen.js",
			        "js/char/enemy/DragonBlue.js",
			        "js/char/enemy/DragonRed.js",
			        "js/char/enemy/DragonBlack.js",
			        "js/char/enemy/DragonWhite.js",
			        "js/char/enemy/DragonGhost.js",
			        "js/char/enemy/Death.js",

			        "js/item/itemlist.js",
			        "js/item/dropitem.js",

			        "js/status/status.js",
			        "js/status/face.js",

			        "js/stage/stagemanager.js",

			        "js/loading/barloadingscene.js",
			        "js/loading/effectloadingscene.js",


			        "js/scene/titlescene.js",
			        "js/scene/mainscene.js",
			        "js/scene/statusscene.js",
			        "js/scene/endscene.js",
			        "js/main.js",
				],
				dest: 'build/<%= pkg.name %>.js'
			}
		},

		// ファイル圧縮の設定
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
			},
			build: {
				src: 'build/<%= pkg.name %>.js',
				dest: 'build/<%= pkg.name %>.min.js'
			}
		}
	});

	// プラグインのロード
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	// デフォルトタスクの設定
	grunt.registerTask('build', [ 'concat', 'uglify' ]);

};