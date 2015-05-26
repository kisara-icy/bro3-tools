// ==UserScript==
// @name		bro3_Auto_Bilder
// @namespace	http://at-n2.net/
// @description	ブラウザ三国志 自動建築スクリプト By nottisan + 5zen（自動内政改良） + RAPT
// @icon		https://raw.github.com/5zen/fake3gokushi/master/icon.png
// @include		http://*.3gokushi.jp/*
// @require		http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js
// @exclude		http://*.3gokushi.jp/world/select_server_mixi_new.php*
// @exclude		http://*.3gokushi.jp/maintenance*
// @grant		GM_getValue
// @grant		GM_setValue
// @grant		GM_xmlhttpRequest
// @grant		GM_addStyle
// @grant		GM_deleteValue
// @grant		GM_listValues
// @grant		GM_log
// @grant		GM_registerMenuCommand
// @author		RAPT
// @version		2015.05.27
// ==/UserScript==

// 2012.04.22 巡回部分の修正
// 2012.04.23 ビルスクの削除部分の修正（対象施設の対象Lv以下の数＋平地数がビルスク対象施設数以下の場合、対象施設名で一番レベルの低いのを削除に変更）
// 2012.04.24 2012.04.24のメンテに対応
// 2012.04.25 id="lodgment" がない場合の対応（本鯖）
// 2012.04.26 本鯖でのダイアログ表示リンクの位置を変更
//			  拠点設定データ呼び出しのバグ修正
//			  糧変換処理がない場合でも市場情報を保存するように修正
//			  糧変換拠点情報をダイアログに表示追加
// 2012.05.01 よくわかんないけどＰ鯖対応（動くらしい）
//			  自動造兵時に宿舎空きがない場合の処理を修正
//			  userscript.org に公開
// 2012.05.02 市場情報更新時に即時情報表示に切り替え
//			  拠点巡回中に自動で内政武将のスキル状況の取得
//			  スキル使用武将と使用/回復スキル名を表示するように修正
// 2012.05.03 削除施設がレベルアップ対象になった場合処理が進まない不具合を修正
//			  拠点のレベルアップ時に、拠点が削除中の場合建設しない処理を追加
//			  造兵・武器防具強化情報の自動取得処理を追加
// 2012.05.04 研究所の研究中取得がおかしかったのを修正
//			  造兵時のチェックが間違っていたのを修正
// 2012.05.05 造兵施設がLVMAXの場合の処理を追加
//			  造兵施設での種類数によって取得処理を変更するように修正
//			  ブラ三ニュースけしたった(・з・)
// 2012.05.07 兵種研究が即完された場合に表示が残る不具合の修正
//			  巡回しなくなっていたバグを修正
// 2012.05.08 内政チェックしなかったのを修正
// 2012.05.11 最新のGreasemonkeyで動作しないのを修正（setTimeout→unsafeWindow.setTimeout）
// 2012.05.23 本拠地の設定ページに市場情報初期化ボタンを追加
//			  巡回時間を修正(2225行あたり）
// 2012.05.24 Auto_Domestic のバグ修正（過去の巡回しない原因はこれかも）
//			  自動内政のスキル追加（恵風・人選眼力・訓練系・修練系）
//			  市場情報をホスト名ごとに保存
//			  建設完了時間＞設定巡回時間 の時の巡回時間設定が間違ってたのを修正
//			  巡回時間にランダムで盛っていた秒を0秒～60秒から0秒～10秒に変更
//			  本拠地以外に市場があった場合に糧変換しなかったのを修正
//			  市場のある拠点が巡回対象以外でも糧変換するように修正
//			  内政スキル発動後に各処理が多分動作するように修正
// 2012.05.25 拠点建設設定のデータがない拠点の初期データが間違っていたのを修正
//			  設定画面でNaN(Not a Number)が表示されていたのを修正
// 2012.05.27 ビルスクの設定が反映されないのを修正
// 2012.06.18 村・砦削除中の場合その拠点のみビルダー動作を停止
// 2012.09.06 鍛冶場・防具工場の情報取得部分がバグってるのでちょっと削除
//			  糧変換時に ssid が必要になったので追加（他にもssidいるやも？）
//			  コメント欄にあった造兵部分を修正 thx.名無しさん
// 2012.09.12 改悪アップデートに対応
// 2012.09.15 使用中の内政スキル情報取得部分を修正
// 2012.09.16 回復中の内政スキル情報取得部分を修正
// 2012.09.29 資源表示部分のcssの修正
// 2012.09.30 資源表示部分のcssの修正（プルダウンメニュー・マップ画面）
// 2012.10.10 地図画面の小さな矢印が押せなかったのを修正
// 2013.01.10 糧村・資源村のスキルプリセットを修正
//			  ダイアログデザインをちょっと修正
//			  情報表示ダイアログを非表示でも強制的に表示される現象の修正（領地画面とか）
// 2013.03.08 Firefox 19.0.2 + Greasemonkey 1.8 での動作するように修正
// 2013.12.18 拠点プリセット値変更
//			  動作ログを最新から表示に変更。完了分は最大５件のみ表示
// 2013.12.26 村プリセットの追加（軍事拠点）
//			  拠点設定画面レイアウト変更
//			  標準巡回時間を180秒に変更
// 2014.01.30 大剣兵・盾兵・重盾兵の処理追加開始
// 2014.02.14 Firefox Ver.27 にてFirefoxごと轟沈する処理を修正
// 2014.02.19 大剣兵・盾兵・重盾兵の造兵処理追加（テストは重盾兵のみ）
//			  大剣兵・盾兵・重盾兵の武器防具強化処理追加（テストは盾兵のみ）
//			  武器防具追加テーブルの追加修正（一部データ不足）
// 2014.02.20 自動内政スキルに「強兵の檄文」「攻城の檄文」を追加
//			  設定項目が増えたので一旦設定を初期化しました
//			  糧村に銅雀台が建立されなかったのを修正
// 2014.03.06 細かいバグ修正
// 2014.03.07 盾兵・剣兵・重盾兵がある鯖ない鯖の処理分岐追加
// 2014.03.11 地味にログイン画面に表示されていたのを修正
// 2014.07.24 最新のGreasemonkeyで動作しないのを修正（unsafeWindow.setTimeout→setTimeout）
// 2014.08.20 やばげ鯖対応
// 2015.05.10 施設削除予約対応 by RAPT
// 2015.05.13 施設削除予約対応が Google Chrome でも動作するよう修正
//			  自動内政スキルに豊潤祈祷を追加 by RAPT
// 2015.05.24 ★9(1-1-1-2)水車村化オプションを追加
//			  変換用市場表示が Google Chrome でも動作するよう修正
//			  Google Chrome 対応版@2015.01.01 をマージ by RAPT
// 2015.05.27 ★5(0-0-0-1)水車村オプションを追加
//			  ★5工場村オプションを追加

var VERSION = "2015.05.27"; 	// バージョン情報

//*** これを変更するとダイアログのフォントスタイルが変更できます ***
var fontstyle = "bold 10px 'ＭＳ ゴシック'";	// ダイアログの基本フォントスタイル

var DEBUG = false;

// 色設定

var COLOR_FRAME = "#333333";	// 枠背景色
var COLOR_BASE	= "#654634";	// 拠点リンク色
var COLOR_TITLE = "#FFCC00";	// 各BOXタイトル背景色
var COLOR_BACK	= "#FFF2BB";	// 各BOX背景色

var DomesticFlg = false;

var WangRay = false;		// 2014.02.19

/*!
* jQuery Cookie Plugin
* https://github.com/carhartl/jquery-cookie
*
* Copyright 2011, Klaus Hartl
* Dual licensed under the MIT or GPL Version 2 licenses.
* http://www.opensource.org/licenses/mit-license.php
* http://www.opensource.org/licenses/GPL-2.0
*/
(function($) {
	$.cookie = function(key, value, options) {

		// key and at least value given, set cookie...
		if (arguments.length > 1 && (!/Object/.test(Object.prototype.toString.call(value)) || value === null || value === undefined)) {
			options = $.extend({}, options);

			if (value === null || value === undefined) {
				options.expires = -1;
			}

			if (typeof options.expires === 'number') {
				var days = options.expires, t = options.expires = new Date();
				t.setDate(t.getDate() + days);
			}

			value = String(value);

			return (document.cookie = [
				encodeURIComponent(key), '=', options.raw ? value : encodeURIComponent(value),
				options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
				options.path ? '; path=' + options.path : '',
				options.domain ? '; domain=' + options.domain : '',
				options.secure ? '; secure' : ''
			].join(''));
		}

		// key and possibly options given, get cookie...
		options = value || {};
		var decode = options.raw ? function(s) { return s; } : decodeURIComponent;

		var pairs = document.cookie.split('; ');
		for (var i = 0, pair; pair = pairs[i] && pairs[i].split('='); i++) {
			if (decode(pair[0]) === key) return decode(pair[1] || ''); // IE saves cookies with empty string as "c; ", e.g. without "=" as opposed to EOMB, thus pair[1] may be undefined
		}
		return null;
	};
})(jQuery);

jQuery.noConflict();
j$ = jQuery;

// 造兵用
//				   1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8
var OPT_SOL_MAX = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
var OPT_SOL_ADD = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
var OPT_BLD_WOOD  = 0;
var OPT_BLD_STONE = 0;
var OPT_BLD_IRON  = 0;
var OPT_BLD_RICE  = 0;
var OPT_BLD_SOL = 0;
var sort_priority = [];
var OPT_BKBG_CHK = 0;
var make_no = [];
				   // 兵種, 	  No, 研究済,作成可能兵数,現在の兵数,最大兵数,現兵数との差,x,y
make_no["剣兵"] 	= ["剣兵"	 ,301,	   0,			0,		   0,		0,			0,0,0];
make_no["槍兵"] 	= ["槍兵"	 ,303,	   0,			0,		   1,		0,			0,0,0];
make_no["弓兵"] 	= ["弓兵"	 ,308,	   0,			0,		   2,		0,			0,0,0];
make_no["騎兵"] 	= ["騎兵"	 ,305,	   0,			0,		   3,		0,			0,0,0];
make_no["矛槍兵"]	= ["矛槍兵"  ,304,	   0,			0,		   4,		0,			0,0,0];
make_no["弩兵"] 	= ["弩兵"	 ,309,	   0,			0,		   5,		0,			0,0,0];
make_no["近衛騎兵"] = ["近衛騎兵",307,	   0,			0,		   6,		0,			0,0,0];
make_no["斥候"] 	= ["斥候"	 ,310,	   0,			0,		   7,		0,			0,0,0];
make_no["斥候騎兵"] = ["斥候騎兵",311,	   0,			0,		   8,		0,			0,0,0];
make_no["衝車"] 	= ["衝車"	 ,312,	   0,			0,		   9,		0,			0,0,0];
make_no["投石機"]	= ["投石機"  ,313,	   0,			0,		  10,		0,			0,0,0];

make_no["大剣兵"]	= ["大剣兵"  ,315,	   0,			0,		  11,		0,			0,0,0]; 		// 2014.01.30
make_no["盾兵"] 	= ["盾兵"	 ,316,	   0,			0,		  12,		0,			0,0,0]; 		// 2014.01.30
make_no["重盾兵"]	= ["重盾兵"  ,317,	   0,			0,		  13,		0,			0,0,0]; 		// 2014.01.30

//			 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8
OPT_BK_LV = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
OPT_BG_LV = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

//巡回用
var tidMain2;
var tidMain3;
var nextURL;
var nextNAME;
//寄付用
var OPT_RISE_KIFU_MAX = 10000;	//寄付を開始する糧の量
var OPT_RISE_KIFU = 1000;		//寄付をする糧の量

//
//市場用
var OPT_RISE_MAX = 30000;	//市場変換開始する糧の量
var OPT_TO_WOOD = 10000;	//木に変換する糧
var OPT_TO_STONE = 10000;	//石に変換する糧
var OPT_TO_IRON = 10000;	//鉄に変換する糧

// @@ ADD 2011.09.28 @@
var LOAD_ROUND_TIME_10 = 10;
var LOAD_ROUND_TIME_20 = 20;
var LOAD_ROUND_TIME_30 = 30;
var LOAD_ROUND_TIME_40 = 40;
var LOAD_ROUND_TIME_50 = 50;
var LOAD_ROUND_TIME_60 = 60;
var LOAD_ROUND_TIME_70 = 70;
var LOAD_ROUND_TIME_80 = 80;
var LOAD_ROUND_TIME_90 = 90;
var LOAD_ROUND_TIME_100 = 100;
var LOAD_ROUND_TIME_110 = 110;
var LOAD_ROUND_TIME_120 = 120;
var LOAD_ROUND_TIME_130 = 130;
var LOAD_ROUND_TIME_140 = 140;
var LOAD_ROUND_TIME_150 = 150;
var LOAD_ROUND_TIME_160 = 160;
var LOAD_ROUND_TIME_170 = 170;
var LOAD_ROUND_TIME_180 = 180;

//グローバル変数
var MOUSE_DRAGGING = false;
var MOUSE_OFFSET_X;
var MOUSE_OFFSET_Y;
var MOUSE_DRAGGING_WINDOW = 0;
var ALERT_TIME;

// @@ ADD 2011.05.14 @@
var OPT_MAX_WOOD = 0;			// 木の最大保持量
var OPT_MAX_STONE = 0;			// 石の最大保持量
var OPT_MAX_IRON = 0;			// 鉄の最大保持量
var WOOD = 101; 				//木の内部コード
var STONE = 102;				//石の内部コード
var IRON = 103; 				//鉄の内部コード
var RICE = 104; 				//糧の内部コード

//新規作成用
var OPT_KATEMURA	= 0;	 // 自動糧村化オプション
var OPT_DORM		= 0;	 // 自動宿舎村化オプション			2013.12.26
var OPT_TORIDE		= 0;	 // 自動砦化オプション
var OPT_SOUKO_MAX	= 1;	 // 倉庫の最大数
var OPT_1112MURA	= 0;	 // ★9(1-1-1-2)水車村オプション
var OPT_0001S5MURA	= 0;	 // ★5(0-0-0-1)水車村オプション
var OPT_PLANT5MURAN	= 0;	 // ★5工場村オプション
var OPT_PLANT5MURAE	= 0;	 // ★5工場村オプション
var OPT_PLANT5MURAW	= 0;	 // ★5工場村オプション
var OPT_PLANT5MURAS	= 0;	 // ★5工場村オプション

var OPT_REMOVE = 0; // 施設削除オプション 2015.05.10

//内政用 by nottisan
//								  1 1 1 1 1 1 1 1 1 1 2 2 2 2 2 2 2 2 2 2 3 3 3 3 3 3 3 3 3 3 4
//				1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0
var OPT_DOME = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
var OPT_BLD = "AC";
var OPT_SorH = "DD";
var OPT_MAX = 3;
var OPT_MAXLV = 6;
var OPT_ROUND_TIME1 = 180;	// 巡回時間(sec)
var OPT_ROUND_TIME2 = 10;	// 巡回時間(sec)
var Reload_Flg = 0;
var OPT_BUILD_VID;


//グローバル変数
//var INTERVAL = 1000;			// 負荷対策 回線速度によっては正常動作しない時があります。その際は数値を増やしてください。1秒=1000
//var INTERVAL2 = 2000; 		// 負荷対策 回線速度によっては正常動作しない時があります。その際は数値を増やしてください。1秒=1000

var INTERVAL  = 1000; // + Math.floor( Math.random() * 5000 );			// 負荷対策 回線速度によっては正常動作しない時があります。その際は数値を増やしてください。1秒=1000
var INTERVAL2 = 2000; // + Math.floor( Math.random() * 5000 );			// 負荷対策 回線速度によっては正常動作しない時があります。その際は数値を増やしてください。1秒=1000
var HOST = location.hostname; //アクセスURLホスト
var PGNAME = "_Auto_Bilder_5zen_v1.21_20140220"; //グリモン領域への保存時のPGの名前
var TIMEOUT_URL ="/false/login_sessionout.php"; //タイムアウト時のURLの一部
var g_MD="";

var SENDTFLG_TIMEOUT = 0;		//タイムアウト画面
var SENDTFLG_LOGIN_MENU = 1;	//ログイン画面
var SENDTFLG_LOGIN = 2; 		//ログイン中
var d = document;

// 保存データデリミタ
var DELIMIT1 = "#$%";
var DELIMIT2 = "&?@";
var DELIMIT3 = "{=]";
var DELIMIT4 = "|-/";

//保存データインデックス（拠点）
var IDX_XY = 0; //座標
var IDX_BASE_NAME = 1; //拠点名
var IDX_URL = 2; //拠点URL
var IDX_ACTIONS = 3; //実行中作業
var IDX_BASE_ID = 11; //拠点ID

//保存データインデックス（実行中作業）
var IDX2_STATUS = 0; //ステータス
var IDX2_TIME = 1; //完了時刻
var IDX2_TYPE = 2; //種別 C:都市画面、D:内政スキル、Fxy:施設座標
var IDX2_ALERTED = 3; //通知済フラグ
var IDX2_DELETE = 4; // 削除フラグ
var IDX2_ROTATION = 5; // 巡回フラグ


//作業種別
var TYPE_CONSTRUCTION = "C"; //建設
var TYPE_MARCH = "M"; //行軍
var TYPE_DOMESTIC = "D"; //内政
var TYPE_FACILITY = "F"; //施設

var TYPE_DELETE = "B"; //建設

var OPT_CHKBOX_AVC = 0;
//						拠 木 石 鉄 畑 倉 雀 武 防 練 槍 弓 騎 宿 車 市 訓 水 工 研 大 遠 見 平
//						点			   庫	 器 具 兵 兵 兵 兵 舎 兵 場 練 車 場 究 宿 征 張 地
//						 1	2  3  4  5	6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24
var OPT_CHKBOX		 = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var OPT_CHKBOXLV	 = [ 8,15,15,15,15,20,10,10,10,10,15,15,15,15,15,10,10,10,10,10,20,20,20, 0];
var OPT_RM_CHKBOX	 = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; //削除する施設 2015.05.10
var OPT_RM_CHKBOXLV  = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; //残す数 2015.05.10
var OPT_MAX_LV = "2";
var OPT_FUC_NAME = ["拠点","伐採所","石切り場","製鉄所","畑","倉庫",
					"銅雀台","鍛冶場","防具工場","練兵所","兵舎","弓兵舎",
					"厩舎","宿舎","兵器工房","市場","訓練所","水車","工場",
					"研究所","大宿舎","遠征訓練所","見張り台","平地"];

var OPT_FNID = new Array();
OPT_FNID["拠点"] =		 0	 ;
OPT_FNID["伐採所"] =	 1	 ;
OPT_FNID["石切り場"] =	 2	 ;
OPT_FNID["製鉄所"] =	 3	 ;
OPT_FNID["畑"] =		 4	 ;
OPT_FNID["倉庫"] =		 5	 ;
OPT_FNID["銅雀台"] =	 6	 ;
OPT_FNID["鍛冶場"] =	 7	 ;
OPT_FNID["防具工場"] =	 8	 ;
OPT_FNID["練兵所"] =	 9	 ;
OPT_FNID["兵舎"] =		 10 	 ;
OPT_FNID["弓兵舎"] =	 11 	 ;
OPT_FNID["厩舎"] =		 12 	 ;
OPT_FNID["宿舎"] =		 13 	 ;
OPT_FNID["兵器工房"] =	 14 	 ;
OPT_FNID["市場"] =		 15 	 ;
OPT_FNID["訓練所"] =	 16 	 ;
OPT_FNID["水車"] =		 17 	 ;
OPT_FNID["工場"] =		 18 	 ;
OPT_FNID["研究所"] =	 19 	 ;
OPT_FNID["大宿舎"] =	 20 	 ;
OPT_FNID["遠征訓練所"] = 21 	 ;
OPT_FNID["見張り台"] =	 22 	 ;
//OPT_FNID["修行所"] =	   23	 ;

//市場変換処理用
var OPT_ICHIBA = 0;
var OPT_ICHIBA_PA = 0;

if ( WangRay != true ) {
	var OPT_ICHIBA_PATS = ["平均的に変換","一括変換"];
} else {
	var OPT_ICHIBA_PATS = ["平均的に変換","一括変換","割合変換"];
}

//自動寄付用
var OPT_KIFU = 0;

var d = document;
var $ = function(id) { return d.getElementById(id); };
var $x = function(xp,dc) { return d.evaluate(xp, dc||d, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue; };
var $a = function(xp,dc) { var r = d.evaluate(xp, dc||d, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null); var a=[]; for(var i=0; i<r.snapshotLength; i++){ a.push(r.snapshotItem(i)); } return a; };
var $e = function(e,t,f) { if (!e) return; e.addEventListener(t, f, false); };
var $v = function(key) { return d.evaluate(key, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null); };		// 2013.12.18

//LvUPリンク
var LVUPLINK = "http://SITE/facility/build.php?x=urlX&y=urlY&village_id=viID&ssid=ssid_val#ptop";
var URL_SITE = "SITE";
var URL_X = "urlX";
var URL_Y = "urlY";
var URL_viID = "viID";
var URL_viSSID = "ssid_val";

//新規作成リンク
var CREATELINK = "http://SITE/facility/build.php?id=fID&x=urlX&y=urlY&village_id=viID&ssid=ssid_val";
var URL_fID 	= "fID"; //建物のID
var HATAKE		= 215;
var SOUKO		= 233;
var SUZUME		= 216;
var SYUKUSYA	= 242;	// 宿舎 	2013.12.26
var RENPEIJYO	= 234;	// 練兵所	2013.12.26
var KAZIBA		= 232;	// 鍛冶場	2013.12.26

var FACLINK = "http://SITE/facility/facility.php?x=urlX&y=urlY";
var VILLAGELINK = "http://SITE/village.php#ptop";
// 2012.04.10
var LANDLINK = "http://SITE/land.php?x=urlX&y=urlY"
var SETTLELINK = "http://SITE/facility/select_type.php?x=urlX&y=urlY&mode=build&type=fID"

var VillageData = new Array();
var OPT_VILLAGE = new Array();

var isMixi = true;

// ＠＠　ここから　＠＠
var DASkill = [ "■■■■",
				"伐採知識","伐採技術","弓兵増強",
				"石切知識","石切技術","槍兵増強",
				"製鉄知識","製鉄技術","騎兵増強",
				"食糧知識","食糧技術",
				"農林知識","農林技術",
				"加工知識","加工技術",
				"富国","富国論","富国強兵",
				"豊穣","美玉歌舞",
				"恵風","人選眼力",
				"呉の治世","王佐の才",
				"練兵訓練","練兵修練",
				"兵舎訓練","兵舎修練",
				"弓兵訓練","弓兵修練",
				"厩舎訓練","厩舎修練",
				"兵器訓練","兵器修練",
				"強兵の檄文","攻城の檄文",
				"豊潤祈祷"
];
// ＠＠　ここまで　＠＠

// 屯田機能用
var URL_PARAM = {};

// 市場変換用
var ShopURL = "";
var ShopFlg = false;

var DBG_Flg = false;

//Main
(function(){

	// zIndex(重なり順序）の修正
	j$("div#status div#status_left").css({"z-index":"0"});
	j$("#menu_container").css({"z-index":"980"});
	j$("div#map-scroll").css({"z-index":"150"});
	j$("a#cur01, a#cur02, a#cur03, a#cur04, a#double-cur01, a#double-cur02, a#double-cur03, a#double-cur04").css({"z-index":"460"});


	initUrlParams();

	var mixi_ad_head = xpath('//div[@ID="mixi_ad_head"]', document);
	if (mixi_ad_head.snapshotLength) {
		mixi_ad_head.snapshotItem(0).style.display = "none";
	}

	var mixi_ad_groups = xpath('//div[@ID="mixi_ad_groups"]', document);
	if (mixi_ad_groups.snapshotLength) {
		mixi_ad_groups.snapshotItem(0).style.display = "none";
	}
	var mixi_ad_news = xpath('//div[@class="brNews"]', document);
	if (mixi_ad_news.snapshotLength) {
		mixi_ad_news.snapshotItem(0).style.display = "none";
	}

	addOpenLinkHtml()
	if ( getStayMode() ) {
		closeIniBilderBox()
		openIniBilderBox()
	}
	// =============================================================================================

	//領地画面なら拠点建設データ取得
	if( location.pathname == "/land.php" && URL_PARAM.x && URL_PARAM.y ) {
		getAddingVillage(document.body);
	}

	//拠点画面なら拠点削除データ取得
	if( location.pathname == "/facility/castle.php" ) {
		getDeletingVillage(document.body);
	}

	//バグ回避 600000=5*60*1000
	// 領地画面や建築画面で停止した場合の処理
	// ５分間止まっていた場合拠点画面に移動する
	if(location.pathname == "/land.php" || location.pathname == "/facility/facility.php") {
		setTimeout(function(){location.href = "http://"+HOST+"/village.php";},300000);
	}
	// =============================================================================================
	//君主プロフィール画面なら都市画面URLを取得
	if ((location.pathname == "/user/" || location.pathname == "/user/index.php") &&
		getParameter("user_id") == "") {
		getUserProf(document);
		if ( getStayMode() ) {
			closeIniBilderBox()
			openIniBilderBox()
		}
	}
	OPT_BUILD_VID = GM_getValue(HOST+PGNAME+"OPT_BUILD_VID" , "" );

	if (location.pathname == "/village.php") {

		var vID = "";
		//座標を取得
		var xyElem = document.evaluate('//*[@id="basepoint"]/span[@class="xy"]',document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
		vId = trim(xyElem.snapshotItem(0).innerHTML.match(/(\(-?\d+,-?\d+\))/)[1]); 	// 2014.08.20
		Load_OPT(vId);
		if (OPT_BUILD_VID != getVillageID(vId)) {
			GM_setValue(HOST+PGNAME+"OPT_BUILD_VID" , "" );
			OPT_BUILD_VID = "";
		}
		getVillageActions();			// 建築情報の取得
		checkVillageLength();			// 拠点数チェック 2012.04.09
		settleVillages(0);				// 自動拠点作成 2012.04.09

		//拠点画面なら対象建築物の建築チェック
		var villages = loadVillages(HOST+PGNAME);
		for(var i=0; i<villages.length;i++){
			var tChk1 = GM_getValue(HOST+PGNAME+"OPT_CHKBOX_AVC_"+i, true);
			if ( getVillageID(vId) == getParameter2(villages[i][IDX_URL], "village_id") ){
				break;
			}
		}

		// 拠点にチェックがある場合建設処理を行う
		if (tChk1){
			Auto_Domestic();			// 自動内政処理 by nottisan
		} else {
			ichibaChange(vId);			// 市場処理
			autoDonate();				// 自動寄付処理
		}
		// 研究所情報取得
		var area = new Array();
		area = get_area();

		var _x = -1;
		var _y = -1;
		var _lv = -1;
		for (var i=0;i<area.length;i++){
			if (area[i].name == "研究所") {
				var Temp = area[i].xy.split(",");
				_x = Temp[0];
				_y = Temp[1];
				_lv = area[i].lv;
			}
		}
		if ( _x < 0 ) {
			// 内政スキルチェック
			var nText = document.evaluate('//*[@class="base-skill"]/span/a', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
			var nName = nText.snapshotItem(0).innerHTML.split(":");
			if (nName[0].length != 12) {
				// 内政武将がセットされている場合
				// alert("内政武将は " + nName[0].trim() + " です");
				j$.get("http://"+HOST+"/card/domestic_setting.php#ptop",function(x){
					var htmldoc = document.createElement("html");
						htmldoc.innerHTML = x;
					getDomesticSkill(htmldoc);		// 内政スキル使用チェック
					forwardNextVillage();			// 次の拠点へ移動
				});
			} else {
				// 内政武将がセットされていない場合
				var data = getMyVillage();
				data[IDX_ACTIONS] = new Array();
				saveVillage(data, TYPE_DOMESTIC);
				if ( getStayMode() ) {
					closeIniBilderBox()
					openIniBilderBox()
				}
				forwardNextVillage();						// 次の拠点へ移動
			}
		} else {
			try {
				// 研究所チェック
				j$.get("http://"+HOST+"/facility/facility.php?x=" + _x + "&y=" + _y ,function(x){
					var htmldoc = document.createElement("html");
						htmldoc.innerHTML = x;
					getTrainingSoldier(htmldoc);

					// 内政スキルチェック
					var nText = document.evaluate('//*[@class="base-skill"]/span/a', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
					var nName = nText.snapshotItem(0).innerHTML.split(":");
					if (nName[0].length != 12) {
						// 内政武将がセットされている場合
						// alert("内政武将は " + nName[0].trim() + " です");
						j$.get("http://"+HOST+"/card/domestic_setting.php#ptop",function(x){
							var htmldoc = document.createElement("html");
								htmldoc.innerHTML = x;
							getDomesticSkill(htmldoc);		// 内政スキル使用チェック
							forwardNextVillage();			// 次の拠点へ移動
						});
					} else {
						// 内政武将がセットされていない場合
						var data = getMyVillage();
						data[IDX_ACTIONS] = new Array();
						saveVillage(data, TYPE_DOMESTIC);
						if ( getStayMode() ) {
							closeIniBilderBox()
							openIniBilderBox()
						}
						forwardNextVillage();						// 次の拠点へ移動
					}
				});
			}catch(e) {
				// エラーが発生した場合次の拠点へ移動
				forwardNextVillage();						// 次の拠点へ移動
			}
		}
	}

	//兵士作成画面なら作成中兵士を取得
	if (location.pathname == "/facility/facility.php") {

		//var actionType = TYPE_FACILITY + getParameter("x") + getParameter("y");

		j$.get("http://"+HOST+"/facility/facility.php?x=" + getParameter("x") + "&y=" + getParameter("y") + "#ptop",function(x){
			var htmldoc = document.createElement("html");
				htmldoc.innerHTML = x;
			getTrainingSoldier(htmldoc);
			if ( getStayMode() ) {
				closeIniBilderBox()
				openIniBilderBox()
			}
		});

	}

})();

function log() { console.log.apply(console, Array.slice(arguments)) };

function debugLog( mes ) {	if (DEBUG) { console.log(mes); }	};

// ===========================================================================================================

//URL読み込み
function initUrlParams() {
	var matches = location.search.match(/(?:\?|&)?([^=]+)(?:=([^&]+))?/g);
	if (matches) {
		var param;
		var key;
		var data;
		for(var i = 0 ; i < matches.length ; i++) {
			param = matches[i].match(/(?:\?|&)?([^=]+)(?:=([^&]+))?/);
			key = param[1];
			data = param[2];

			URL_PARAM[key] = '';
			if( param.length == 3 && typeof data == 'string') {
				URL_PARAM[key] = decodeURIComponent(data);

				// session id
				if (key.toLowerCase() == 'ssid') {
					SID = key + '=' +data;
				}
			}
		}
	}
}

//拠点作成開始
function settleVillages(z){
	//新規拠点作成に必要な名声があれば拠点作成
	if ( checkFame() ){
		//予約データ取得
		var lists = cloadData(HOST+"ReserveList", "[]", true, true);
		if( lists.length == 0 || z >= lists.length) {return;}
		if( lists[z].status != 1 && lists[z].status != 0) {settleVillages(z+1);return;}
		var mURL = LANDLINK;
		mURL = mURL.replace(URL_SITE,HOST);
		mURL = mURL.replace(URL_X,lists[z].x);
		mURL = mURL.replace(URL_Y,lists[z].y);
		var tid=setTimeout(function(){
			GM_xmlhttpRequest({
				method:"GET",
				url:mURL,
				headers:{"Content-type":"text/html"},
				overrideMimeType:'text/html; charset=utf-8',
				onload:function(x){
					var htmldoc = document.createElement("html");
					htmldoc.innerHTML = x.responseText;
					//拠点を作成できるかチェック
					var rmtime = htmldoc.innerHTML.match(/この領地を拠点にする/);
					if ( rmtime ) { //拠点を作成できる場合作成開始
						var mURL = SETTLELINK;
						mURL = mURL.replace(URL_SITE,HOST);
						mURL = mURL.replace(URL_X,lists[z].x);
						mURL = mURL.replace(URL_Y,lists[z].y);
						mURL = mURL.replace(URL_fID,lists[z].kind);
						var tid=setTimeout(function(){
							GM_xmlhttpRequest({
								method:"GET",
								url:mURL,
								headers:{"Content-type":"text/html"},
								overrideMimeType:'text/html; charset=utf-8',
								onload:function(x){
									var htmldoc = document.createElement("html");
									htmldoc.innerHTML = x.responseText;
									//拠点が作成開始できているか確認
									if (!htmldoc.innerHTML.match(/名声が不足しています/)) {
										getAddingVillage(htmldoc);
										if ( getStayMode() ) {
											closeIniBilderBox()
											openIniBilderBox()
										}
									}
								}
							});
						}, INTERVAL);
					} else {
						failSettleVillage(z);
						settleVillages(z+1);
					}
				}
			});
		}, INTERVAL);
	}

	//名声チェック
	function checkFame() {

		//現在の名声MAX取得
		var fameMAX;

		// 2014.08.20 ここから
		fameMAX = 0;
		try {
			var fameText = $x('id("status_left")/img[contains(@src,"ico_fame.gif")]').nextSibling;
			if( fameText ) {
			var tmp = fameText.nodeValue.match(/\s*(\d+)\s*\/\s*(\d+)/);
			fameMAX = parseInt(tmp[2],10);
			}
		} catch(e) {
			// やばげ鯖用例外処理
			var fameText = $x('id("status_resources")//li[5]').innerHTML;
			if( fameText ) {
			var tmp = fameText.match(/&nbsp;(\d+)&nbsp;\/&nbsp;(\d+)/);
			fameMAX = parseInt(tmp[2],10);
			}
		}
		// 2014.08.20 ここまで

		//拠点作成に必要な名声
		var bldtbl = [17, 35, 54, 80, 112, 150, 195, 248, 310, 999];
		//現在の拠点の数
		//var villages = loadVillages(HOST);
		//var villageLength = document.evaluate('//div[@id="lodgment"]/div/ul/li/a', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null); //拠点数－１になる

		// 2012.04.25 本鯖対応
		var villageLength = $a('//ul/li/a[contains(@href,"/village_change.php?village_id")]').length; //拠点数－１になる

		//作成中の拠点の数
		var lists = cloadData(HOST+"ReserveList", "[]", true, true);
		var x = 0;
		for (var i=0 ; i<lists.length ; i++) {
			if(lists[i].status == 2){x++;}
		}
//		return (fameMAX >= bldtbl[villageLength.snapshotLength + x]);
		return (fameMAX >= bldtbl[villageLength + x]);
	}

	function failSettleVillage(z) {
		var lists = cloadData(HOST+"ReserveList", "[]", true, true);
		if (lists[z].status == 1) { lists[z].status = 0;}
		csaveData(HOST+"ReserveList", lists, true, true );
	}
}


// 拠点数の保存情報と現状を比較＆修正 2012.04.09
function checkVillageLength() {
		//データ整理
	var lists = cloadData(HOST+"ReserveList", "[]", true, true);
	lists = checkList(lists);		//時間の過ぎたものを削除


	//予定時刻を過ぎていたら新規拠点情報を取得
	function checkList(lists)
	{
		//時刻チェック
		var dt = new Date();
		var ntime = dt.getFullYear() + "-" +
			(dt.getMonth()+101).toString().substr(-2) + "-" +
			(dt.getDate()+100).toString().substr(-2) + " " +
			(dt.getHours()+100).toString().substr(-2)  + ":" +
			(dt.getMinutes()+100).toString().substr(-2)  + ":" +
			(dt.getSeconds()+100).toString().substr(-2);
		//リストのデータを書き換え
		var flg = 0;
		for(var i=0 ; i<lists.length ; i++) {
			if( lists[i].time < ntime ) {
				if( lists[i].status == 4 ) { lists[i].status = 5; flg = 1;} //破棄 -> 破棄完了
				if( lists[i].status == 2 ) { lists[i].status = 3; flg = 1;} //作成 -> 作成完了
			}
		}
		csaveData(HOST+"ReserveList", lists, true, true );
		//拠点情報を取得＆移動
		if (flg == 1){
			getUserProfJumpNewVillage();
		} else {
			checkVillageLengthDiff();
		}
		return lists;
	}

	function getUserProfJumpNewVillage(){
		var tid=setTimeout(function(){
			GM_xmlhttpRequest({
				method:"GET",
				url:"http://" + HOST + "/user/",
				headers:{"Content-type":"text/html"},
				overrideMimeType:'text/html; charset=utf-8',
				onload:function(x){
					var htmldoc = document.createElement("html");
					htmldoc.innerHTML = x.responseText;
					//拠点リストを更新
					getUserProf(htmldoc);
					if ( getStayMode() ) {
						closeIniBilderBox()
						openIniBilderBox()
					}
					//本拠地に強制ジャンプ
					var villages = loadVillages(HOST+PGNAME);
					var tid=setTimeout(function(){
						location.href = villages[0][IDX_URL];},INTERVAL);
					//新規拠点に移動
					//jumpNewVillage();
				}
			});
		}, INTERVAL);

		//新規拠点画面へ移動
/*
		function jumpNewVillage(){
			var villages = loadVillages(HOST+PGNAME);
			for (var j = villages.length-1; j >= 0; j--) {
				//新規と名のつく拠点へ移動
				if(villages[j][IDX_BASE_NAME].match(/新規/)){
					var tid=setTimeout(function(){
						location.href = villages[j][IDX_URL];},INTERVAL);
					return;
				}
			}
		}
*/
	}

	//拠点数が変わっていたら情報取得 @@1@@
	function checkVillageLengthDiff() {

debugLog("=== Start checkVillageLengthDiff ===");

		var villages = loadVillages(HOST+PGNAME);
//		var villageLength = document.evaluate('//div[@id="lodgment"]/div/ul/li', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null); //拠点数

		// 2012.04.25 本鯖対応
		var villageLength = $a('//ul/li/a[contains(@href,"/village_change.php?village_id")]').length + 1; //拠点数

		//if (villages.length != villageLength.snapshotLength) {
		if (villages.length != villageLength) {
			setTimeout(function(){
				GM_xmlhttpRequest({
					method:"GET",
					url:"http://" + HOST + "/user/",
					headers:{"Content-type":"text/html"},
					overrideMimeType:'text/html; charset=utf-8',
					onload:function(x){
						var htmldoc = document.createElement("html");
							htmldoc.innerHTML = x.responseText;
						getUserProf(htmldoc);
						if ( getStayMode() ) {
							closeIniBilderBox()
							openIniBilderBox()
						}
						var tid=setTimeout(function(){location.reload();},INTERVAL);
					}
				});
			}, INTERVAL);
		}
	}
}

//Beyond系save, load関数
function csaveData(key, value, local, ev)
{
	if( local ) key = location.hostname + key  + PGNAME;
	if( ev ) {
		if (window.opera || typeof JSON != 'object') {
			value = toJSON(value);
		}
		else {
			value = JSON.stringify( value );
		}
	}
	GM_setValue(key, value );
}

function cloadData(key, value, local, ev)
{
	if( local ) key = location.hostname + key  + PGNAME;
	var ret = GM_getValue(key, value);

	if (window.chrome) { // 2015.05.23
		return ev ? eval(eval('ret='+ret)) : ret;
	} else {
		return ev ? eval('ret='+ret) : ret;
	}
}

//-----------------------------------TonDen---------------------------------
//領地画面なら拠点建設データ取得
function getAddingVillage(htmldoc) {

	var xyElem = document.evaluate('//*[@id="basepoint"]/span[@class="xy"]',
		htmldoc, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	var xy = xyElem.snapshotItem(0).innerHTML.match(/(-?\d+,-?\d+)/);
	var Temp = xy[0].split(",");
	var x = Temp[0];
	var y = Temp[1];

	var rmname = htmldoc.innerHTML.match(/(現在村を建設中です|現在砦を建設中です)/ );
	if( rmname ) {
		var rmtime = htmldoc.innerHTML.match(/(\d+-\d+-\d+ \d+:\d+:\d+)*に完了します。/ );
		if( rmname[1] == "現在村を建設中です" ) {
			addList(rmtime[1], 220, 2, x, y );
		}else if( rmname[1] == "現在砦を建設中です" ) {
			addList(rmtime[1], 222, 2, x, y );
		}
	}

	if(htmldoc == document.body) {
//		addLink();
		addLink2();
	}

	function addList(tim, kind, status, x, y)
	{
		var lists = cloadData(HOST+"ReserveList", "[]", true, true);

		var flg = 0;
		for(var i=0 ; i<lists.length ; i++) {
			if(lists[i].x == x && lists[i].y == y ) {
				lists[i].time = tim;
				lists[i].kind = kind;
				lists[i].status = status;
				flg = 1;
			}
		}
		if(flg == 0) {
			lists.push({"x":x, "y":y, "time":tim, "kind":kind, "status":status });
		}
		lists.sort( function(a,b){
			if(a.time > b.time) return 1;
			if(a.time < b.time) return -1;
			return 0;});

		csaveData(HOST+"ReserveList", lists, true, true );
	}

	function addLink() {

		//id="tMenu"にLinkを挿入
		var tMenu = document.evaluate('//*[@id="tMenu"]',
			htmldoc, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
		if (tMenu.snapshotLength == 0) return;

		//村作成予約
		var villageLink = document.createElement("a");
		villageLink.id = "village";
		villageLink.href = "javascript:void(0);";
		villageLink.innerHTML = "村建設予約";
		villageLink.addEventListener("click", function() {addReserveVillages(220)}, true);
		tMenu.snapshotItem(0).appendChild(villageLink);

		//砦作成予約
		var fortLink = document.createElement("a");
		fortLink.id = "fort";
		fortLink.href = "javascript:void(0);";
		fortLink.innerHTML = "砦建設予約";
		fortLink.addEventListener("click", function() {addReserveVillages(222)}, true);
		tMenu.snapshotItem(0).appendChild(fortLink);

	}

	function addLink2() {

		//id="tMenu"にLinkを挿入
		var tMenu = document.evaluate('//div[@class="status"]',
			document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
		if (tMenu.snapshotLength == 0) {
			var tMenu = document.evaluate('//div[@id="basepoint"]',
				document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
			if (tMenu.snapshotLength == 0) return;
		}

		var villageLink = document.createElement("span");
		villageLink.style.color = "white";
		villageLink.style.fontSize = "10px";
		villageLink.style.textAlign = "center";
		villageLink.innerHTML = "建設予約  ";
		tMenu.snapshotItem(0).appendChild(villageLink);

		//村作成予約
		var villageLink = document.createElement("a");
		villageLink.id = "village";
		villageLink.style.color = "white";
		villageLink.style.fontSize = "10px";
		villageLink.style.textAlign = "center";
		villageLink.href = "javascript:void(0);";
		villageLink.innerHTML = "村";
		villageLink.addEventListener("click", function() {addReserveVillages(220)}, true);
		tMenu.snapshotItem(0).appendChild(villageLink);

		var villageLink = document.createElement("span");
		villageLink.style.color = "white";
		villageLink.style.fontSize = "10px";
		villageLink.style.textAlign = "center";
		villageLink.innerHTML = "  ";
		tMenu.snapshotItem(0).appendChild(villageLink);

		//砦作成予約
		var fortLink = document.createElement("a");
		fortLink.id = "fort";
		fortLink.style.color = "white";
		fortLink.style.fontSize = "10px";
		fortLink.style.textAlign = "center";
		fortLink.href = "javascript:void(0);";
		fortLink.innerHTML = "砦";
		fortLink.addEventListener("click", function() {addReserveVillages(222)}, true);
		tMenu.snapshotItem(0).appendChild(fortLink);

	}

	function addReserveVillages(kind) {
		url = location;
		var flgAdd = addList2(kind, 1, URL_PARAM.x, URL_PARAM.y);
		var msg = "";
		if (flgAdd == 0){
			msg += "(" + URL_PARAM.x + "," + URL_PARAM.y + ")への、";
				  if(kind == 220){msg += "村建設予約";
			}else if(kind == 222){msg += "砦建設予約";
			}
			msg += "を受け付けました。"
		} else {
			msg += "(" + URL_PARAM.x + "," + URL_PARAM.y + ")には、すでに建設予約があります。";
		}
		alert(msg);
		if ( getStayMode() ) {
			closeIniBilderBox()
			openIniBilderBox()
		}
	}

	function addList2(kind, status, x, y) //kind=220:村予約 222:砦予約
	{
		var lists = cloadData(HOST+"ReserveList", "[]", true, true);

		var dt = new Date();
		var ntime = dt.getFullYear() + "-" +
			(dt.getMonth()+101).toString().substr(-2) + "-" +
			(dt.getDate()+100).toString().substr(-2) + " " +
			(dt.getHours()+100).toString().substr(-2)  + ":" +
			(dt.getMinutes()+100).toString().substr(-2)  + ":" +
			(dt.getSeconds()+100).toString().substr(-2);

		for(var i=0 ; i<lists.length ; i++) {
			if(lists[i].x == x && lists[i].y == y ) {
				return;
			}
		}
		lists.push({"x":x, "y":y, "time":ntime, "kind":kind, "status":status });
		lists.sort( function(a,b){
			if(a.time > b.time) return 1;
			if(a.time < b.time) return -1;
			return 0;});

		csaveData(HOST+"ReserveList", lists, true, true );

		return 0;
	}

}

//拠点画面で建設予約受付
function addLinkTondenVillage() {

	var xyElem = document.evaluate('//span[@class="xy"]',
		document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	var xy = xyElem.snapshotItem(0).innerHTML.match(/(-?\d+,-?\d+)/);
	var Temp = xy[0].split(",");
	var x = Temp[0];
	var y = Temp[1];

	addLink();

	function addLink() {

		//id="tMenu"にLinkを挿入
		var tMenu = document.evaluate('//div[@class="status village-bottom"]',
			document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
		if (tMenu.snapshotLength == 0) return;

		var villageLink = document.createElement("span");
		villageLink.innerHTML = " 建設予約  ";
		tMenu.snapshotItem(0).appendChild(villageLink);

		//村作成予約
		var villageLink = document.createElement("a");
		villageLink.id = "village";
		villageLink.href = "javascript:void(0);";
		villageLink.innerHTML = "村";
		villageLink.addEventListener("click", function() {addReserveVillages(220)}, true);
		tMenu.snapshotItem(0).appendChild(villageLink);

		var villageLink = document.createElement("span");
		villageLink.innerHTML = "  ";
		tMenu.snapshotItem(0).appendChild(villageLink);

		//砦作成予約
		var fortLink = document.createElement("a");
		fortLink.id = "fort";
		fortLink.href = "javascript:void(0);";
		fortLink.innerHTML = "砦";
		fortLink.addEventListener("click", function() {addReserveVillages(222)}, true);
		tMenu.snapshotItem(0).appendChild(fortLink);

	}

	function addReserveVillages(kind) {
		url = location;
		var flgAdd = addList2(kind, 1, x, y);
		var msg = "";
		if (flgAdd == 0){
			msg += "(" + x + "," + y + ")への、";
				  if(kind == 220){msg += "村建設予約";
			}else if(kind == 222){msg += "砦建設予約";
			}
			msg += "を受け付けました。"
		} else {
			msg += "(" + x + "," + y + ")には、すでに建設予約があります。";
		}
		alert(msg);
		if ( getStayMode() ) {
			closeIniBilderBox()
			openIniBilderBox()
		}
	}

	function addList2(kind, status, x, y) //kind=220:村予約 222:砦予約
	{
		var lists = cloadData(HOST+"ReserveList", "[]", true, true);

		var dt = new Date();
		var ntime = dt.getFullYear() + "-" +
			(dt.getMonth()+101).toString().substr(-2) + "-" +
			(dt.getDate()+100).toString().substr(-2) + " " +
			(dt.getHours()+100).toString().substr(-2)  + ":" +
			(dt.getMinutes()+100).toString().substr(-2)  + ":" +
			(dt.getSeconds()+100).toString().substr(-2);

		for(var i=0 ; i<lists.length ; i++) {
			if(lists[i].x == x && lists[i].y == y && (lists[i].status == 0 || lists[i].status == 1)) {
				return;
			}
		}
		lists.push({"x":x, "y":y, "time":ntime, "kind":kind, "status":status });
		lists.sort( function(a,b){
			if(a.time > b.time) return 1;
			if(a.time < b.time) return -1;
			return 0;});

		csaveData(HOST+"ReserveList", lists, true, true );

		return 0;
	}

}

//拠点画面なら拠点削除データ取得
function getDeletingVillage(htmldoc) {
	var xy = getMyXY();
	var Temp = xy.split(",");
	var x = Temp[0];
	var y = Temp[1];

	var rmtime = htmldoc.innerHTML.match(/(村を削除中です。|砦を削除中です。)[^\d]*(\d+-\d+-\d+ \d+:\d+:\d+)に完了します。/);
	if( rmtime ) {
		if( rmtime[1] == "村を削除中です。" ) {
			addList(rmtime[2], 220, 4, x, y );
		}else if( rmtime[1] == "砦を削除中です。" ) {
			addList(rmtime[2], 222, 4, x, y );
		}
	}else{
		delList(1, x, y);
	}
	if ( getStayMode() ) {
		closeIniBilderBox()
		openIniBilderBox()
	}

	function addList(tim, kind, status, x, y)
	{
		var lists = cloadData(HOST+"ReserveList", "[]", true, true);

		var flg = 0;
		for(var i=0 ; i<lists.length ; i++) {
			if(lists[i].x == x && lists[i].y == y && (lists[i].status != 0 && lists[i].status != 1 && lists[i].status != 2)) {
				lists[i].time = tim;
				lists[i].kind = kind;
				lists[i].status = status;
				flg = 1;
			}
		}
		if(flg == 0) {
			lists.push({"x":x, "y":y, "time":tim, "kind":kind, "status":status });
		}
		lists.sort( function(a,b){
			if(a.time > b.time) return 1;
			if(a.time < b.time) return -1;
			return 0;});

		csaveData(HOST+"ReserveList", lists, true, true );
	}

	function delList(kind, x, y) //kind=0:land 1:castle
	{
		var lists = cloadData(HOST+"ReserveList", "[]", true, true);

		for(var i=0 ; i<lists.length ; i++) {
			if(lists[i].x == x && lists[i].y == y ) {
				if( lists[i].status == 4 && kind == 1 ) {
					lists.splice(i,1);
					csaveData(HOST+"ReserveList", lists, true, true );
					break;
				}
			}
		}
	}

}

// =================================================================================================

function DeleteFacility(_x,_y){
	var tid=setTimeout(function(){
		var mURL = FACLINK;
		mURL = mURL.replace(URL_SITE,HOST);
		mURL = mURL.replace(URL_X,_x);
		mURL = mURL.replace(URL_Y,_y);
		GM_xmlhttpRequest({
			method:"GET",
			url: mURL,
			headers:{"Content-type":"text/html"},
			overrideMimeType:'text/html; charset=utf-8',
			onload:function(x){
				var htmldoc = document.createElement("html");
					htmldoc.innerHTML = x.responseText;
				var tables = document.evaluate('//*[@name="ssid"]',htmldoc, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
				var ssid=tables.snapshotItem(0).value;

				var c={};
				c['x'] = parseInt(_x);
				c['y'] = parseInt(_y);
				c['ssid']=tables.snapshotItem(0).value;
				c['remove']="%E5%BB%BA%E7%89%A9%E3%82%92%E5%A3%8A%E3%81%99";
				j$.post("http://"+HOST+"/facility/facility.php?x=" + _x + "&y=" + _y + "#ptop",c,function(){});
				var tid=setTimeout(function(){location.reload(false);},INTERVAL);

			}
		});
	},0);

}

function autoLvup() {

debugLog("=== Start autoLvup ===");
	var cost_bk_ken=[
		[ 165,	135,   0,  0, 6600],
		[ 251,	319,   0,  0, 8910],
		[ 184,	596,   0,303,11220],
		[ 351,	994,   0,604,13200],
		[ 431,	828,2054,  0,15180],
		[ 159,	848,4294,  0,17820],
		[1397, 2301,4519,  0,19140],
		[1019, 4458,7260,  0,21120],
		[	0,11558,3572,  0,23100],
		[	0,19648,6073,  0,25080],
		[	0,	  0,   0,  0,	 0]
	];
	// 槍兵
	var cost_bk_yari=[
		[ 1820,  3575,	  0,1105,13500],
		[ 3640,  7150,	  0,2210,18225],
		[	 0, 12870, 6552,3978,22950],
		[	 0, 21879,11138,6763,27000],
		[10820, 35006,17821,   0,31050],
		[16230, 52510,26732,   0,36450],
		[22722, 73514,37425,   0,39150],
		[30675, 99243,50524,   0,43200],
		[39878,129016,65681,   0,47250],
		[51841,167721,85385,   0,51300],
		[	 0, 	0,	  0,   0,	 0]
	];
	// 矛槍兵
	var cost_bk_hoko=[
		[ 14000,  27500,	  0, 8500,18600],
		[ 28000,  55000,	  0,17000,25380],
		[	  0, 104500,  53200,32300,31620],
		[	  0, 188100,  95760,58140,37200],
		[ 98838, 319770, 162792,	0,42700],
		[158141, 511632, 260467,	0,50220],
		[237211, 767448, 390701,	0,53940],
		[332096,1074427, 546981,	0,59520],
		[431724,1396755, 711075,	0,65100],
		[647587,2095133,1066613,	0,70680],
		[	  0,	  0,	  0,	0,	  0]
	];
	// 弓兵
	var cost_bk_yumi=[
		[  3795,	0, 1173,1932,13500],
		[  7590,	0, 2346,3864,18225],
		[ 13662,	0, 6995,4223,22950],
		[ 23225,	0,11824,7179,27000],
		[ 37161,11486,18918,   0,31050],
		[ 55741,17229,28377,   0,36450],
		[ 78038,39728,24121,   0,39150],
		[105351,53633,32563,   0,43200],
		[122015,49802,77193,   0,47250],
		[178043,55031,90640,   0,51300],
		[	  0,	0,	  0,   0,	 0]
	];
	// 弩兵
	var cost_bk_dokyu=[
		[  30250,	  0,   9350,15400,18600],
		[  60500,	  0,  18700,30800,25110],
		[ 114950,	  0,  58520,35530,31620],
		[ 206910,	  0, 105336,63954,37200],
		[ 351747,108722, 179071,	0,42780],
		[ 562795,173955, 286514,	0,50220],
		[ 844193,429771, 260932,	0,53940],
		[1181870,601679, 365305,	0,59520],
		[1368820,558720, 865988,	0,65100],
		[2320010,717094,1181096,	0,70680],
		[	   0,	  0,	  0,	0,	  0]
	];
	// 騎兵
	var cost_bk_uma=[
		[1241,2044,4015,0,13500],
		[2482,4088,8030,0,17313],
		[4468,0,14454,7358,22950],
		[7595,0,24572,12509,27000],
		[12152,0,39315,20015,31040],
		[0,18228,58973,30022,36450],
		[0,42031,82562,25519,39150],
		[0,56742,111458,34451,43200],
		[0,73765,144895,44786,47250],
		[0,95894,188364,58222,51300],
		[0,0,0,0,0]
	];
	// 近衛騎兵
	var cost_bk_konoe=[
		[10200,16800,33000,0,18600],
		[20400,33600,66000,0,25110],
		[38760,0,125400,63840,31620],
		[69768,0,225720,114912,37200],
		[76745,0,488376,132559,14400],
		[0,189769,613958,312561,50220],
		[0,468841,920938,284653,53940],
		[0,656377,1289313,398515,59520],
		[0,853291,1676107,518069,65100],
		[0,1279936,2514161,777104,70680],
		[0,0,0,0,0]
	];
	// 衝車
	var cost_bk_kuruma=[
		[6600,2040,3360,0,17000],
		[13200,4080,6720,0,22950],
		[23760,7344,12096,0,28900],
		[40392,12485,20536,0,34000],
		[64627,19976,32901,0,39100],
		[96941,29964,49352,0,45900],
		[135717,41949,69092,0,49300],
		[183218,56631,93274,0,54400],
		[238183,73620,121257,0,59500],
		[359657,111167,183098,0,64600],
		[0,0,0,0,0]
	];
	// 投石機
	var cost_bk_stone=[
		[ 11050,  35750,  18200,0,24000],
		[ 22100,  71500,  36400,0,32400],
		[ 41990, 135850,  69160,0,40800],
		[ 75582, 244530, 124488,0,48000],
		[128489, 415701, 211630,0,55200],
		[205583, 665122, 338607,0,64800],
		[308375, 997682, 507911,0,69600],
		[431724,1396755, 711075,0,76800],
		[561242,1815782, 924398,0,84000],
		[729614,2360517,1201718,0,91200],
		[0,0,0,0,0]
	];
	// 大剣兵
	var cost_bk_bigken=[
		[ 24775,  20270,	  0,	 0,24000],
		[ 39671,  50419,	  0,	 0,32400],
		[ 29082,  94199,	  0, 47890,40800],
		[ 55488, 157137,	  0, 95483,48000],
		[ 68141, 130906, 324736,	 0,55200],
		[ 25137, 134063, 691341,	 0,64800],
		[213721, 352019, 691341,	 0,69600],
		[140799, 615977,1003138,	 0,76800],
		[	  0,1258370, 388899,640617,84000],
		[	  0,1870636, 578195,952360,67080],
		[0,0,0,0,0]
	];
	// 盾兵
	var cost_bk_shield=[
		[0,0,0,0,0],					// Lv1
		[0,0,0,0,0],					// Lv2
		[0,0,0,0,0],					// Lv3
		[0,0,0,0,0],					// Lv4
		[0,0,0,0,0],					// Lv5
		[0,0,0,0,0],					// Lv6
		[0,0,0,0,0],					// Lv7
		[0,0,0,0,0],					// Lv8
		[0,0,0,0,0],					// Lv9
		[0,0,0,0,0],					// Lv10
		[0,0,0,0,0]
	];
	// 重盾兵
	var cost_bk_bigshield=[
		[0,0,0,0,0],					// Lv1
		[0,0,0,0,0],					// Lv2
		[0,0,0,0,0],					// Lv3
		[0,0,0,0,0],					// Lv4
		[0,0,0,0,0],					// Lv5
		[0,0,0,0,0],					// Lv6
		[0,0,0,0,0],					// Lv7
		[0,0,0,0,0],					// Lv8
		[0,0,0,0,0],					// Lv9
		[0,0,0,0,0],					// Lv10
		[0,0,0,0,0]
	];
	// 防具工場テーブル ========================================================
	// 剣兵
	var cost_bg_ken=[
		[ 149,	122,   0,	0, 6600],
		[ 228,	285,   0,	0, 8910],
		[ 168,	534,   0, 273,11220],
		[ 310,	900,   0, 544,13200],
		[ 373,	745,1864,	0,15180],
		[ 539, 1431,2801,	0,17820],
		[1265, 2063,4067,	0,19140],
		[1949, 6304,3209,	0,21120],
		[	0,10288,3253,5371,23100],
		[	0,17683,5466,9002,25080],
		[0,0,0,0,0]
	];
	// 槍兵
	var cost_bg_yari=[
		[ 1638,  3218,	  0, 995,13500],
		[ 3276,  6435,	  0,1989,18225],
		[	 0, 11583, 5897,3580,22950],
		[	 0, 19691,10025,6086,27000],
		[ 9738, 31506,16039,   0,31050],
		[14607, 47259,24059,   0,36450],
		[20450, 66162,33683,   0,39150],
		[27608, 89319,45471,   0,43200],
		[35890,116115,59113,   0,51300],
		[46657,150949,76847,   0,55350],
		[0,0,0,0,0]
	];
	// 矛槍兵
	var cost_bg_hoko=[
		[ 12600,  24750,	  0, 7650, 18600],
		[ 25200,  49500,	  0,15300, 25110],
		[	  0,  94050,  47880,29070, 31620],
		[	  0, 169290,  86184,52326, 37200],
		[ 88954, 287793, 146513,	0, 42780],
		[142327, 460469, 234420,	0, 50220],
		[213490, 690703, 351631,	0, 53940],
		[298886, 966984, 492283,	0, 59520],
		[388552,1257080, 639968,	0, 65100],
		[545116,1762197,1121087,	0,358680],
		[0,0,0,0,0]
	];
	// 弓兵
	var cost_bg_yumi=[
		[  3416,	0, 1056,1739,13500],
		[  6831,	0, 2111,3478,22950],
		[ 12296,	0, 6260,3801,27000],
		[ 20903,	0,10641,6461,31050],
		[ 33445,10337,17026,   0,36450],
		[ 50167,15506,25540,   0,39150],
		[ 70234,35756,21709,   0,43200],
		[ 94816,48270,29307,   0,47250],
		[108917,44822,70371,   0,51300],
		[160238,49528,81576,   0,55350],
		[0,0,0,0,0]
	];
	// 弩級
	var cost_bg_dokyu=[
		[  27225,	  0,   8415,13860,18600],
		[  54450,	  0,  16830,27720,25110],
		[ 103455,	  0,  52668,31977,31620],
		[ 186219,	  0,  94802,57559,37200],
		[ 316572, 97850, 161164,	0,42780],
		[ 506516,156559, 257863,	0,50220],
		[ 759774,386794, 234839,	0,53940],
		[1063683,541511, 328775,	0,59520],
		[1221881,502832, 789446,	0,65100],
		[2088009,645385,1062986,	0,70680],
		[0,0,0,0,0]
	];
	// 騎兵
	var cost_bg_uma=[
		[ 1117, 1840,  3614,	0,13500],
		[ 2234, 3679,  7227,	0,18225],
		[ 4021,    0, 13009, 6623,22950],
		[ 6835,    0, 22115,11258,27000],
		[10937,    0, 35384,18013,31050],
		[	 0,16405, 53075,27020,36450],
		[	 0,37828, 74305,22967,43200],
		[	 0,51068,100312,31006,47250],
		[	 0,66388,130406,40307,51300],
		[	 0,86305,169528,52399,55350],
		[0,0,0,0,0]
	];
	// 近衛騎兵
	var cost_bg_konoe=[
		[ 9180,  15120,  29700, 	0,18600],
		[ 6156,  10134,  19908, 	0,25110],
		[ 7830, 	 0,  25344, 12900,31620],
		[ 8952, 	 0,  28962, 14742,37200],
		[20979, 	 0,  67878, 34560,42780],
		[	 0,  27279,  88245, 44919,50220],
		[	 0,  78324, 153852, 47556,53940],
		[	 0, 590740,1160381,358663,59520],
		[	 0, 767962,1508496,466262,65100],
		[	 0,1151943,2262744,699394,70680],
		[0,0,0,0,0]
	];
	// 斥候
	var cost_bg_sek=[
		[ 1638,  995,	  0,  3218, 6600],
		[ 3276, 1989,	  0,  6435, 8910],
		[ 6224, 3779,	  0, 12227,11220],
		[	 0, 6802, 11204, 22008,13200],
		[	 0,11564, 19047, 37413,15180],
		[	 0,18502, 30475, 59861,17820],
		[27754,    0, 45712, 89791,19140],
		[38855,    0, 63997,125708,21120],
		[50512,    0, 83916,163420,23100],
		[65665,    0,108154,212446,25080],
		[0,0,0,0,0]
	];
	// 斥候騎兵
	var cost_bg_sekuma=[
		[  9180,15120, 29700,	  0,18600],
		[  6156,10134, 19908,	  0,25110],
		[  7830,	0, 25344, 12900,31620],
		[  8952,	0, 28962, 14742,37200],
		[ 20979,	0, 67878, 34560,42780],
		[	  0,27279, 88245, 44919,50220],
		[	  0,78324,153852, 47556,53940],
		[ 53135,	0, 87517,171908,43200],
		[ 69076,	0,113772,223480,47250],
		[104304,	0,171795,337455,51300],
		[0,0,0,0,0]
	];
	// 衝車
	var cost_bg_kuruma=[
		[  5940,  1836,  3024,0,17000],
		[ 11880,  3672,  6048,0,22950],
		[ 21384,  6610, 10886,0,28900],
		[ 36353, 11236, 10886,0,34000],
		[ 58164, 17978, 29611,0,39100],
		[ 87247, 26967, 44417,0,45900],
		[122145, 37754, 62183,0,49300],
		[164896, 50968, 83947,0,54400],
		[214365, 66258,109131,0,59500],
		[ 63561,198334,326634,0,64600],
		[0,0,0,0,0]
	];
	// 投石機
	var cost_bg_stone=[
		[  9945,  32175,  16380,0,24000],
		[ 19890,  64350,  32760,0,32400],
		[ 37791, 122265,  62244,0,40800],
		[ 68024, 220077, 112039,0,48000],
		[115640, 374131, 190467,0,55200],
		[185025, 598609, 304747,0,64800],
		[277537, 897914, 457120,0,69600],
		[388552,1257080, 639968,0,76800],
		[505118,1634204, 831958,0,84000],
		[656653,2124465,1081546,0,91200],
		[0,0,0,0,0]
	];
	// 大剣兵
	var cost_bg_bigken=[
		[0,0,0,0,0],					// Lv1
		[0,0,0,0,0],					// Lv2
		[0,0,0,0,0],					// Lv3
		[0,0,0,0,0],					// Lv4
		[0,0,0,0,0],					// Lv5
		[0,0,0,0,0],					// Lv6
		[0,0,0,0,0],					// Lv7
		[0,0,0,0,0],					// Lv8
		[0,0,0,0,0],					// Lv9
		[0,0,0,0,0],					// Lv10
		[0,0,0,0,0]
	];
	// 盾兵
	var cost_bg_shield=[
		[0,0,0,0,0],					// Lv1
		[0,0,0,0,0],					// Lv2
		[0,0,0,0,0],					// Lv3
		[0,0,0,0,0],					// Lv4
		[0,0,0,0,0],					// Lv5
		[0,0,0,0,0],					// Lv6
		[0,0,0,0,0],					// Lv7
		[0,0,0,0,0],					// Lv8
		[0,0,0,0,0],					// Lv9
		[0,0,0,0,0],					// Lv10
		[0,0,0,0,0]
	];
	// 重盾兵
	var cost_bg_bigshield=[
		[0,0,0,0,0],					// Lv1
		[0,0,0,0,0],					// Lv2
		[0,0,0,0,0],					// Lv3
		[0,0,0,0,0],					// Lv4
		[0,0,0,0,0],					// Lv5
		[0,0,0,0,0],					// Lv6
		[0,0,0,0,0],					// Lv7
		[0,0,0,0,0],					// Lv8
		[0,0,0,0,0],					// Lv9
		[0,0,0,0,0],					// Lv10
		[0,0,0,0,0]
	];
	var costs = [];
	costs["鍛冶場剣兵"] 		= cost_bk_ken;
	costs["鍛冶場槍兵"] 		= cost_bk_yari;
	costs["鍛冶場矛槍兵"]		= cost_bk_hoko;
	costs["鍛冶場弓兵"] 		= cost_bk_yumi;
	costs["鍛冶場弩兵"] 		= cost_bk_dokyu;
	costs["鍛冶場騎兵"] 		= cost_bk_uma;
	costs["鍛冶場近衛騎兵"]		= cost_bk_konoe;
	costs["鍛冶場衝車"] 		= cost_bk_kuruma;
	costs["鍛冶場投石機"]		= cost_bk_stone;
	costs["鍛冶場大剣兵"]		= cost_bk_bigken;			// 2014.02.19
	costs["鍛冶場盾兵"] 		= cost_bk_shield;			// 2014.02.19
	costs["鍛冶場重盾兵"]		= cost_bk_bigshield;		// 2014.02.19

	costs["防具工場剣兵"]		= cost_bg_ken;
	costs["防具工場槍兵"]		= cost_bg_yari;
	costs["防具工場矛槍兵"] 	= cost_bg_hoko;
	costs["防具工場弓兵"]		= cost_bg_yumi;
	costs["防具工場弩兵"]		= cost_bg_dokyu;
	costs["防具工場騎兵"]		= cost_bg_uma;
	costs["防具工場近衛騎兵"]	= cost_bg_konoe;
	costs["防具工場斥候"]		= cost_bg_sek;
	costs["防具工場斥候騎兵"]	= cost_bg_sekuma;
	costs["防具工場衝車"]		= cost_bg_kuruma;
	costs["防具工場投石機"] 	= cost_bg_stone;
	costs["防具工場大剣兵"] 	= cost_bg_bigken;			// 2014.02.19
	costs["防具工場盾兵"]		= cost_bg_shield;			// 2014.02.19
	costs["防具工場重盾兵"] 	= cost_bg_bigshield;		// 2014.02.19

	var make_loop = function(loop) {

		if (loop == 2) {

			return;

		} else {

			if (loop == 0) { var type = "鍛冶場"; }
			if (loop == 1) { var type = "防具工場"; }
			if (OPT_BKBG_CHK == 0) { return; }
			var UnitID = [];

			UnitID["剣兵"]		= [301];
			UnitID["槍兵"]		= [303];
			UnitID["矛槍兵"]	= [304];
			UnitID["騎兵"]		= [305];
			UnitID["近衛騎兵"]	= [307];
			UnitID["弓兵"]		= [308];
			UnitID["弩兵"]		= [309];
			UnitID["斥候"]		= [310];
			UnitID["斥候騎兵"]	= [311];
			UnitID["衝車"]		= [312];
			UnitID["投石機"]	= [313];
			UnitID["大剣兵"]	= [315];
			UnitID["盾兵"]		= [316];
			UnitID["重盾兵"]	= [317];

			var _x = -1;
			var _y = -1;
			var _lv = -1;

			var area = new Array();
			area = get_area();

			for (var i=0;i<area.length;i++){
				if (area[i].name == type) {
					var Temp = area[i].xy.split(",");
					_x = Temp[0];
					_y = Temp[1];
					_lv = area[i].lv;
				}
			}
			if ( _x < 0 ) {
				return;
			}
			var tid=setTimeout(function(){

				var mURL = FACLINK;
				mURL = mURL.replace(URL_SITE,HOST);
				mURL = mURL.replace(URL_X,_x);
				mURL = mURL.replace(URL_Y,_y);

				GM_xmlhttpRequest({
					method:"GET",
					url: mURL,
					headers:{"Content-type":"text/html"},
					overrideMimeType:'text/html; charset=utf-8',
					onload:function(x){
						var htmldoc = document.createElement("html");
							htmldoc.innerHTML = x.responseText;
						// 鍛冶場・防具工場情報の取得
						getTrainingSoldier(htmldoc);
						if ( getStayMode() ) {
							closeIniBilderBox()
							openIniBilderBox()
						}

						var actionsElem  = document.evaluate('//th[@class="mainTtl6"]', htmldoc, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
//						var actionsElem2 = document.evaluate('//b[@class="f14"]',		htmldoc, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
						var actionsElem2 = document.evaluate('//b[contains(@class,"f14")]', 	  htmldoc, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
						var actionsElem3 = document.evaluate('//td[@class="center"]'   ,htmldoc, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
						var actionsElem4 = document.evaluate('//td[@class="cost"]'	 ,htmldoc, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

						var htmldoc2 = document.createElement("html");

						var actionsElem7  = document.evaluate('//*[@colspan="4"]', htmldoc, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

						var Buki = Array();
						var x = -1;

						if ( htmldoc.innerHTML.lastIndexOf("を強化する") != -1 ) {
							for (var i=0;i<actionsElem2.snapshotLength;i++){
//								htmldoc2.innerHTML = actionsElem4.snapshotItem(i).innerHTML;
//								var actionsElem5 = document.evaluate('//span[@class="normal"]'	 ,htmldoc2, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
//								var actionsElem6 = document.evaluate('//span[@class="max90"]'	,htmldoc2, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
								var BG_Name = actionsElem.snapshotItem(i+1).innerHTML;
								var BG_LvNm = actionsElem2.snapshotItem(i).innerHTML.substring(actionsElem2.snapshotItem(i).innerHTML.lastIndexOf("&nbsp;&nbsp;")+12);
								var BG_UID	= UnitID[BG_Name];
								var BG_Lv	= actionsElem2.snapshotItem(i).innerHTML.substring(3,actionsElem2.snapshotItem(i).innerHTML.lastIndexOf("&nbsp;")-6);

								var BG_WOOD  = costs[type + BG_Name][BG_Lv][0];
								var BG_STONE = costs[type + BG_Name][BG_Lv][1];
								var BG_IRON  = costs[type + BG_Name][BG_Lv][2];
								var BG_RICE  = costs[type + BG_Name][BG_Lv][3];
								var BG_TIME  = costs[type + BG_Name][BG_Lv][4];
								var BG_Go	 = (actionsElem3.snapshotItem(i+1).innerHTML.lastIndexOf("を強化する") != -1);
/*
								if (BG_Lv != 10) {
									var BG_WOOD  = actionsElem5.snapshotItem(0).innerHTML;
									var BG_STONE = actionsElem5.snapshotItem(1).innerHTML;
									var BG_IRON  = actionsElem6.snapshotItem(0).innerHTML;
									var BG_RICE  = actionsElem5.snapshotItem(2).innerHTML;
									var BG_TIME  = actionsElem7.snapshotItem(i).innerHTML;
									var BG_Go	 = (actionsElem3.snapshotItem(i+1).innerHTML.lastIndexOf("を強化する") != -1);
								} else {
									var BG_WOOD  = 0;
									var BG_STONE = 0;
									var BG_IRON  = 0;
									var BG_RICE  = 0;
									var BG_TIME  = 0;
									var BG_Go	 = false;
								}
*/
								if (type == "鍛冶場") {
									var BG_GoLv  = OPT_BK_LV[ ( UnitID[actionsElem.snapshotItem(i+1).innerHTML][0] - 300 ) ];
								} else {
									var BG_GoLv  = OPT_BG_LV[ ( UnitID[actionsElem.snapshotItem(i+1).innerHTML][0] - 300 ) ];
								}
								if ( checkBKLvup(BG_WOOD,BG_STONE,BG_IRON,BG_RICE,BG_Go,BG_Lv,BG_GoLv) ){
									x++;
									Buki[x] = [BG_Name,BG_Lv,BG_LvNm,BG_UID,BG_TIME];
								}
							}
							Buki.sort( function(a, b) { if (a[4] > b[4]) return 1; if (a[4] < b[4]) return -1; return 0;});

							if (x != -1) {
								// 武器強化処理
								var c={};
								c['x'] = parseInt(_x);
								c['y'] = parseInt(_y);
								c['unit_id'] = parseInt(Buki[0][3]);
								j$.post("http://"+HOST+"/facility/facility.php?x=" + parseInt(_x) + "&y=" + parseInt(_y) + "#ptop",c,function(){});
			//					var tid=setTimeout(function(){location.reload(false);},0);

							}
						}
						make_loop(loop + 1);

						function checkBKLvup(hwood,hstone,hiron,hrice,hgo,hnlv,hslv) {

							var wood = parseInt( $("wood").innerHTML, 10 );
							var stone = parseInt( $("stone").innerHTML, 10 );
							var iron = parseInt( $("iron").innerHTML, 10 );
							var rice = parseInt( $("rice").innerHTML, 10 );

		//					var temp = (parseInt(hwood) + 99);

							if (parseInt(hnlv) >= parseInt(hslv)) { return false; }
							if ((parseInt(hwood)  + OPT_BLD_WOOD ) > wood ) { return false; }
							if ((parseInt(hstone) + OPT_BLD_STONE) > stone) { return false; }
							if ((parseInt(hiron)  + OPT_BLD_IRON ) > iron ) { return false; }
							if ((parseInt(hrice)  + OPT_BLD_RICE ) > rice ) { return false; }
							if (hgo == false) { return false; }

							return true;
						}

					}
				});
			},0);
		}
	}
	make_loop(0);
}

function setVillageFacility() {

debugLog("=== Start setVillageFacility ===");

	var cnt=0;
	var vID = "";

	var del=0;
	var delX = 0;
	var delY = 0;

	//座標を取得
	var xyElem = document.evaluate('//*[@id="basepoint"]/span[@class="xy"]', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	vId = trim(xyElem.snapshotItem(0).innerHTML.match(/(\(-?\d+,-?\d+\))/)[1]); 	// 2014.08.20

	//建設情報を取得
	var actionsElem = document.evaluate('//*[@id="actionLog"]/ul/li', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

	// 削除施設情報の取得
	for (var i = 0; i < actionsElem.snapshotLength; i++) {
		var paItem = actionsElem.snapshotItem(i);
		//ステータス
		var buildStatusElem = document.evaluate('./span[@class="buildStatus"]/a', paItem, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
		if (buildStatusElem.snapshotLength > 0) {
			//施設建設数
			cnt++;

			// 削除数カウント
			if( buildStatusElem.snapshotItem(0).parentNode.parentNode.textContent.indexOf("削除") >= 0 ){
				if(buildStatusElem.snapshotItem(0).href.match(/.*\/.*(\d+).*(\d+)/)){
					delX = parseInt(RegExp.$1);
					delY = parseInt(RegExp.$2);
				}
				del++;
			}
		}
	}


	for (var i = 0; i < actionsElem.snapshotLength; i++) {
		var paItem = actionsElem.snapshotItem(i);
		//ステータス
		var buildStatusElem = document.evaluate('./span[@class="buildStatus"]/a', paItem, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
		if (buildStatusElem.snapshotLength > 0) {
			//建物削除等に対応 2010.10.25 byおぜがづ
			for(var j=0; j<buildStatusElem.snapshotLength;j++){
				if(buildStatusElem.snapshotItem(j).parentNode.innerHTML.match(RegExp("(建設中|建設準備中)"))) {
					//施設建設数
					cnt++;
				}
			}
			//施設建設数
			//cnt++;
		}
	}

	Load_OPT(vId);	//LvUP対象の取得

	//建設削除 2015.05.10
	if(OPT_REMOVE == 1) {
		if(del == 0) {
			var area = new Array();
			area = get_area();
			area.sort(cmp_areas);
			area.sort(cmp_lv);

			for(var ii=0;ii<OPT_FUC_NAME.length;ii++){
				//削除指示が有るか確認する。
				if(parseInt(OPT_RM_CHKBOX[ii],10) == 1){
					//指定残存個数を上回っている場合のみ削除対象とする
					var targets = new Array();
					for(var i=0;i<area.length;i++){
						if(area[i].name == OPT_FUC_NAME[ii]){
							targets.push(area[i]);
						}
					}
					if(targets.length > 0 && targets.length > parseInt(OPT_RM_CHKBOXLV[ii],10)) {
						//施設Lvの低いものから削除する
						var Temp = targets[0].xy.split(",");
						var c = {};
							c['x']=parseInt(Temp[0],10);
							c['y']=parseInt(Temp[1],10);
							c['remove']='建物を壊す';
							c['ssid']=j$.cookie('SSID');
						j$.post("http://"+HOST+"/facility/facility.php",c,function(){});
						var tid=setTimeout(function(){location.reload(false);},INTERVAL);
						return;
					}
				}
			}
		}
	}

	//建設予約ができるかどうか
	if((cnt - del) >= 1) return;

	// ★9(1-1-1-2)水車村
	if (OPT_1112MURA == 1) {
		build1112();
	}
	else if (OPT_0001S5MURA == 1) {	// ★5(0-0-0-1)水車村
		build0001S5();
	}
	else if ((OPT_PLANT5MURAN == 1) || (OPT_PLANT5MURAE == 1) || (OPT_PLANT5MURAW == 1) || (OPT_PLANT5MURAS == 1)) {	// ★5(6-0-0-0),(0-6-0-0),(0-0-6-0)工場村
		buildPlant5();
	}

	// 糧村化
	if(OPT_KATEMURA == 1) {
		var area_all	= new Array();
		area_all		= get_area_all();
		var hatake		= 0; //畑の総数
		var souko		= 0; //倉庫の総数
		var suzume		= 0; //雀の総数
		var heichi		= 0; //平地の総数
		var suzume_Flag = 0;
		var n = -1;
		for(var i=0;i < area_all.length;i++){
			if(area_all[i].name == "平地"){heichi++;n=i;}
			else if(area_all[i].name.match(/畑\s.*?(\d+)/)){hatake++;if(parseInt(RegExp.$1)>=5){suzume_Flag=1;}}
			else if(area_all[i].name.match(/倉庫/)){souko++;}
			else if(area_all[i].name.match(/銅雀台/)){suzume++;}
		}


		if(heichi>0){ //平地が余っていたら
			var tmp = heichi;
			if (WangRay != true) {
				if(suzume != 1){										// 雀がまだ建っていなければ
					tmp -= 1;											// 平地の数をマイナス1
				}
			}
			if(souko < OPT_SOUKO_MAX){									// 倉庫がまだ最大数建っていなければ
				tmp -= (OPT_SOUKO_MAX - souko); 						// 平地の数をマイナス
			}
			if(tmp > 0){ //それでも平地が余っていれば
				if(Chek_Sigen(new lv_sort("畑",0,"")) != 1){			// 資源チェック
					createFacility(HATAKE, area_all);					// 畑を建てる
					Reload_Flg = 0;
					return;
				};
			} else if(souko < OPT_SOUKO_MAX){							//倉庫が建てられる平地があれば
				if(Chek_Sigen(new lv_sort("倉庫",0,"")) != 1){			//資源チェック
					createFacility(SOUKO, area_all);					//倉庫を建てる
					Reload_Flg = 0;
					return;
				}
			} else if(suzume != 1 && suzume_Flag == 1){ 					//雀がまだ建っていなければ
				if (WangRay != true) {
					if(Chek_Sigen(new lv_sort("銅雀台",0,"")) != 1){	//資源チェック
						createFacility(SUZUME, area_all);				//雀を建てる
						Reload_Flg = 0;
						return;
					}
				}
			}
		}
		//建てられるスペースがなければ通常の処理を続ける
	}

	var area = new Array();
	area = get_area();
	area.sort(cmp_areas);
	area.sort(cmp_lv);
	Reload_Flg = 0;

	// 拠点の状況を調査（削除中なら処理しない）
	j$.get("http://"+HOST+"/facility/facility.php?x=3&y=3#ptop",function(x){
		var htmldoc = document.createElement("html");
			htmldoc.innerHTML = x;
		var rmtime = htmldoc.innerHTML.match(/(村を削除中です。|砦を削除中です。)[^\d]*(\d+-\d+-\d+ \d+:\d+:\d+)に完了します。/);
		if (rmtime) {
			// 削除中のため何もしない
			return;
		}

		for(i=0;i<area.length;i++){
			var tmpName1 = area[i].name;
			switch (tmpName1) {
				case "村":
				case "城":
				case "砦":
					tmpName1  = "拠点"; 			 //
					chkFlg = 1;
					break;
			}

			if(parseInt(area[i].lv) >= parseInt(OPT_CHKBOXLV[OPT_FNID[tmpName1]])){
				continue;
			} //指定Lv以上ならメインに戻る
			//建築物名分回す
			OPT_FUC_NAME.push("村","城","砦");
			if(OPT_CHKBOX[0] == 1) {
				OPT_CHKBOX.push(1,1,1);
				OPT_CHKBOXLV.push(OPT_CHKBOXLV[0],OPT_CHKBOXLV[0],OPT_CHKBOXLV[0]);
			} else {
				OPT_CHKBOX.push(0,0,0);
				OPT_CHKBOXLV.push(0,0,0);
			}
			OPT_CHKBOX.push
			for(var ii=0;ii<OPT_FUC_NAME.length;ii++){
				//ソートしたLvの低い順に比較する
				if(area[i].name == OPT_FUC_NAME[ii]){
					//建築指示が有るか確認する。
					if(parseInt(OPT_CHKBOX[ii]) == 1){
						if(parseInt(area[i].lv) >= parseInt(OPT_CHKBOXLV[ii])){
							break;
						}

						//建築に必要な資源が有るかどうかチェック
						var ret = Chek_Sigen(area[i]);
						if(ret == 1){
							//30分後にリロードするかどうか
							Reload_Flg = 1;
							break;
						}

						var Temp = area[i].xy.split(",");
						var c = {};
						if( (del != 0) && (parseInt(Temp[0]) == delX) && (parseInt(Temp[1]) == delY) ){
							// 削除施設とレベルアップ施設が一致したらスキップ
							continue;
						}
						// 拠点以外のレベルアップ処理
						c['x']=parseInt(Temp[0]);
						c['y']=parseInt(Temp[1]);
						c['village_id']=getVillageID(vId);
						c['ssid']=j$.cookie('SSID');
						j$.post("http://"+HOST+"/facility/build.php",c,function(){});
						var tid=setTimeout(function(){location.reload(false);},INTERVAL);

						GM_setValue(HOST+PGNAME+"OPT_BUILD_VID" , getVillageID(vId) );
						var nowTime = new Date();
						Reload_Flg = 0;
						return;
					}
				}
			}
		}
	});


	if(Reload_Flg == 1){
		//10分後にリロードし、再度建築できるかチェックする。
		var tid=setTimeout(function(){location.reload();},60000);
	}

}


// 2011.09.06 宿舎(畑) 自動ビルド＆スクラッチ
function setVillageFacility2() {
	var cnt=0;
	var del=0;
	var delX = 0;
	var delY = 0;
	var vID = "";
	//座標を取得
	var xyElem = document.evaluate('//*[@id="basepoint"]/span[@class="xy"]',
		document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	vId = trim(xyElem.snapshotItem(0).innerHTML.match(/(\(-?\d+,-?\d+\))/)[1]); 	// 2014.08.20

	//建設情報を取得
	var actionsElem = document.evaluate('//*[@id="actionLog"]/ul/li',
		document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

	for (var i = 0; i < actionsElem.snapshotLength; i++) {
		var paItem = actionsElem.snapshotItem(i);
		//ステータス
		var buildStatusElem = document.evaluate('./span[@class="buildStatus"]/a',
			paItem, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
		if (buildStatusElem.snapshotLength > 0) {
			//施設建設数
			cnt++;

			// 削除数カウント
			if( buildStatusElem.snapshotItem(0).parentNode.parentNode.textContent.indexOf("削除") >= 0 ){
				if(buildStatusElem.snapshotItem(0).href.match(/.*\/.*(\d+).*(\d+)/)){
					delX = parseInt(RegExp.$1);
					delY = parseInt(RegExp.$2);
				}
				del++;
			}
		}
	}

	var results = document.evaluate('//area', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
	var area = new Array();
	for(var i=0,n=0; i<results.snapshotLength; i++){
		if(results.snapshotItem(i).alt.match(/(.*?)\s.*?(\d+)/)){
			strURL = results.snapshotItem(i).href;
			area[n] = new lv_sort(RegExp.$1,RegExp.$2,getURLxy(strURL));
			n++;
		}
		else if(results.snapshotItem(i).alt == "平地"){
			// 平地の座標を拾う
			strURL = results.snapshotItem(i).href;
			area[n] = new lv_sort("平地",0,getURLxy(strURL));
			n++;
		}
	}

	if( OPT_SorH == "DD" ){
		//宿舎が処理対象の場合、エリアリストに練兵所(宿舎建設条件)があるかをチェック
		var cntv = 0;
		for(var i=0;i<area.length;i++){
			if(area[i].name == "練兵所"){
				cntv++;
				break;
			}
		}
		if(cntv == 0) return;
	}


	// 施設情報のレベルソート
	area.sort(cmp_lv2);
	Load_OPT(vId);	//LvUP対象の取得
	// 削除中かチェック
	if( (del == 0) ){
		// 削除中でなければ、削除できる施設があるか調べる ＠＠
		var TargetName = "";
		if (OPT_SorH == "DD") { TargetName = "宿舎"; }
		if (OPT_SorH == "HH") { TargetName = "畑"; }
		var TargetCount = 0;
		var BlankCount = 0;
		// 対象レベル以下の宿舎（畑）と平地の数をカウントする
		for (i=0;i<area.length;i++){
			if (area[i].name == TargetName && parseInt(area[i].lv) <= OPT_MAXLV) { TargetCount += 1; }
			if (area[i].name == "平地") { TargetCount += 1; }
		}
		if (TargetCount < OPT_MAX){
			// 対象となる宿舎（畑）と平地の合計が指定数に満たない場合
			area.sort(cmp_lv);
			for (i=0;i<area.length;i++){
				if ((area[i].name == TargetName) && (parseInt(area[i].lv) >= OPT_MAXLV)) {
					// 削除
					var Temp = area[i].xy.split(",");
					DeleteFacility(Temp[0],Temp[1]);
					JSSleep(2);
					Reload_Flg = 0;
					return;
				}
			}
		} else {
			// 普通に削除処理を実行
			for (i=0;i<area.length;i++){
				if ((area[i].name == TargetName) && (parseInt(area[i].lv) == OPT_MAXLV)) {
					// 削除
					var Temp = area[i].xy.split(",");
					DeleteFacility(Temp[0],Temp[1]);
					JSSleep(2);
					Reload_Flg = 0;
					return;
				}
			}
		}
	}

	area.sort(cmp_lv2);
	//建設予約ができるかどうか
	if((cnt - del) >= 1) return;
	//if(cnt == 2) return;

	// 平地建設条件がある場合、対象施設数がOPT_MAX以上かチェックする
	var yct = 0;

	if( OPT_SorH == "DD" ){
		for(i=0;i<area.length;i++){
			if(area[i].name == "宿舎"){
				// @@ Lv6以下の数だけを数える 2011.06.22 5zen
				if(area[i].lv < (OPT_MAXLV + 1)){
					yct++;
				}
			}
		}
	}
	if( OPT_SorH == "HH" ){
		for(i=0;i<area.length;i++){
			if(area[i].name == "畑"){
				// @@ Lv6以下の数だけを数える 2011.06.22 5zen
				if(area[i].lv < (OPT_MAXLV + 1)){
					yct++;
				}
			}
		}
	}

	Reload_Flg = 0;
	for(i=0;i<area.length;i++){

		if( OPT_SorH == "DD" ){
			if((area[i].name != "宿舎") && (area[i].name != "平地")){
				// 平地と宿舎以外スキップ
				 continue;
			}
		}
		else if( OPT_SorH == "HH" ){
			if((area[i].name != "畑") && (area[i].name != "平地")){
				// 平地と畑以外スキップ
				 continue;
			}
		}
		if( yct >= OPT_MAX ){
			if( OPT_SorH == "DD" ){
				if(area[i].name != "宿舎"){
					// 宿数がすでにOPT_MAX以上なら、平地は無視
					continue;
				}
			}
			if( OPT_SorH == "HH" ){
				if(area[i].name != "畑"){
					// 畑数がすでにOPT_MAX以上なら、平地は無視
					continue;
				}
			}
		}
//		if(parseInt(area[i].lv) >= OPT_MAXLV){break;} //指定Lv以上ならメインに戻る

		//建築物名分回す
		for(var ii=0;ii<OPT_FUC_NAME.length;ii++){
			//ソートしたLvの低い順に比較する
			if(area[i].name == OPT_FUC_NAME[ii]){
				//建築に必要な資源が有るかどうかチェック
				var ret = Chek_Sigen(area[i]);
				if(ret == 1){
					//30分後にリロードするかどうか
					Reload_Flg = 1;
					break;
				}

				var Temp = area[i].xy.split(",");
				var c={};

				if( (del != 0) && (parseInt(Temp[0]) == delX) && (parseInt(Temp[1]) == delY) ){
					// 削除施設とレベルアップ施設が一致したらスキップ
					continue;
				}
				// add 2011.12.14
				if (area[i].lv > (OPT_MAXLV - 1)) {
					continue;
				}
				if( area[i].name != "平地"){
					c['x']=parseInt(Temp[0]);
					c['y']=parseInt(Temp[1]);
					c['village_id']=getVillageID(vId);
					c['ssid']=j$.cookie('SSID');
					j$.post("http://"+HOST+"/facility/build.php",c,function(){});
					var tid=setTimeout(function(){location.reload(false);},INTERVAL);
				} else {
					if( OPT_SorH == "DD" ){
						c['x']=parseInt(Temp[0]);
						c['y']=parseInt(Temp[1]);
						c['id']=SYUKUSYA;
						c['village_id']=getVillageID(vId);
						c['ssid']=j$.cookie('SSID');
						j$.post("http://"+HOST+"/facility/build.php",c,function(){});
						var tid=setTimeout(function(){location.reload(false);},INTERVAL);
					} else {
						c['x']=parseInt(Temp[0]);
						c['y']=parseInt(Temp[1]);
						c['id']=215;
						c['village_id']=getVillageID(vId);
						c['ssid']=j$.cookie('SSID');
						j$.post("http://"+HOST+"/facility/build.php",c,function(){});
						var tid=setTimeout(function(){location.reload(false);},INTERVAL);
					}
				}
				GM_setValue(HOST+PGNAME+"OPT_BUILD_VID" , getVillageID(vId) );
				Reload_Flg = 0;
				return;
			}
		}
	}

	if(Reload_Flg == 1){
		//30分後にリロードし、再度建築できるかチェックする。
		var tid=setTimeout(function(){location.reload();},1800000);
	}

	return;
}

//////////////////////////////////////////////////////////////////////////////////////////

//施設一覧取得
function get_area(){
	var results = document.evaluate('//area', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
	var area = new Array();
	for(var i=0,n=0; i<results.snapshotLength; i++){
		if(results.snapshotItem(i).alt.match(/(.*?)\s.*?(\d+)/)){
			var strURL = results.snapshotItem(i).href;
			area[n] = new lv_sort(RegExp.$1,RegExp.$2,getURLxy(strURL));
			n++;
		}
	}
	return area;
}

function get_area_all(){
	var results = document.evaluate('//area', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
	var area = new Array();
	for(var i=0,n=0; i<results.snapshotLength; i++){
		var strURL = results.snapshotItem(i).href;
		area[n] = new areas(results.snapshotItem(i).alt,getURLxy(strURL));
		n++;
	}
	return area;
}

//施設建設
function createFacility(f, area){
	area.sort(cmp_areas);
	for(var i=0;i<area.length;i++){
		if(area[i].name == "平地"){ //一番最初に見つかった平地に建設
			var Temp = area[i].xy.split(",");
/*
			var mURL = CREATELINK;
			mURL = mURL.replace(URL_SITE,HOST);
			mURL = mURL.replace(URL_X,Temp[0]);
			mURL = mURL.replace(URL_Y,Temp[1]);
			mURL = mURL.replace(URL_viID,getVillageID(vId));
			mURL = mURL.replace(URL_fID,f);
			mURL = mURL.replace(URL_viSSID,j$.cookie('SSID'));							// 2012.04.24 ssid 追加
			var tid=setTimeout(function(){location.href = mURL;},INTERVAL);
*/
			var c = {};
			c['x']=parseInt(Temp[0]);
			c['y']=parseInt(Temp[1]);
			c['village_id']=getVillageID(vId);
			c['id']=f;
			c['ssid']=j$.cookie('SSID');
			j$.post("http://"+HOST+"/facility/build.php",c,function(){});
			var tid=setTimeout(function(){location.reload(false);},INTERVAL);
			return;
		}
	}
}

var Hatake		= 215, // 畑
	Souko		= 233, // 倉庫
	Renpei		= 234, // 練兵所
	Shukusha	= 242, // 宿舎
	Kajiba		= 232, // 鍛冶場
	Bougu		= 231, // 防具工場
	Ichiba		= 217, // 市場
	Suisha		= 218, // 水車
	Heiki		= 241, // 兵器工房
	Koujou		= 219, // 工場
	Bassai		= 209, // 伐採所
	Ishikiri	= 211, // 石切り場
	Seitetsu	= 213, // 製鉄所
	Daishuku	= 244; // 大宿舎

// 指定座標に施設LVまで新規建築＆LVUP
function createFacilityEx(x, y, f, lv, area){
	if (f==0) {
		return false;
	}

	var create = 0, lvup = 0;
	var xy = parseInt(x,10).toString()+','+parseInt(y,10).toString();
	for(var i=0;i<area.length;i++){
		if (xy == area[i].xy) {
			if (area[i].name == '平地') {
				if ((f == Hatake   && Chek_Sigen(new lv_sort("畑",0,"")) != 1)
				||	(f == Souko    && Chek_Sigen(new lv_sort("倉庫",0,"")) != 1)
				||	(f == Renpei   && Chek_Sigen(new lv_sort("練兵所",0,"")) != 1)
				||	(f == Shukusha && Chek_Sigen(new lv_sort("宿舎",0,"")) != 1)
				||	(f == Bougu    && Chek_Sigen(new lv_sort("防具工場",0,"")) != 1)
				||	(f == Ichiba   && Chek_Sigen(new lv_sort("市場",0,"")) != 1)
				||	(f == Suisha   && Chek_Sigen(new lv_sort("水車",0,"")) != 1)
				){
					create = 1;
				}
				break;
			}
			else if (f == Hatake   && area[i].name.match(/^畑\s*LV\.(\d+)/) 	  && parseInt(RegExp.$1) < lv && Chek_Sigen(area[i]) != 1) lvup = 1;
			else if (f == Souko    && area[i].name.match(/^倉庫\s*LV\.(\d+)/)	  && parseInt(RegExp.$1) < lv && Chek_Sigen(area[i]) != 1) lvup = 1;
			else if (f == Renpei   && area[i].name.match(/^練兵所\s*LV\.(\d+)/)   && parseInt(RegExp.$1) < lv && Chek_Sigen(area[i]) != 1) lvup = 1;
			else if (f == Shukusha && area[i].name.match(/^宿舎\s*LV\.(\d+)/)	  && parseInt(RegExp.$1) < lv && Chek_Sigen(area[i]) != 1) lvup = 1;
			else if (f == Bougu    && area[i].name.match(/^防具工場\s*LV\.(\d+)/) && parseInt(RegExp.$1) < lv && Chek_Sigen(area[i]) != 1) lvup = 1;
			else if (f == Ichiba   && area[i].name.match(/^市場\s*LV\.(\d+)/)	  && parseInt(RegExp.$1) < lv && Chek_Sigen(area[i]) != 1) lvup = 1;
			else if (f == Suisha   && area[i].name.match(/^水車\s*LV\.(\d+)/)	  && parseInt(RegExp.$1) < lv && Chek_Sigen(area[i]) != 1) lvup = 1;
			break;
		}
	}

	if (create || lvup) {
		var c = {};
		c['x']=parseInt(x);
		c['y']=parseInt(y);
		c['village_id']=getVillageID(vId);
		if (create) {
			c['id']=f;
		}
		c['ssid']=j$.cookie('SSID');
		j$.post("http://"+HOST+"/facility/build.php",c,function(){});
		var tid=setTimeout(function(){location.reload(false);},INTERVAL);
		return true;
	}

	return false;
}
function build1112(){
	var ArechiCnt		= 0, // 荒地
		KokumotsuCnt	= 0, // 穀物
		ShinrinCnt		= 0, // 森林
		IwayamaCnt		= 0, // 岩山
		TekkouzanCnt	= 0; // 鉄鉱山

	var area = get_area_all();
	area.sort(cmp_areas);
	for(var i=0;i<area.length;i++){
		if(area[i].name == "荒地") ArechiCnt++; else
		if(area[i].name == "穀物") KokumotsuCnt++; else
		if(area[i].name == "森林") ShinrinCnt++; else
		if(area[i].name == "岩山") IwayamaCnt++; else
		if(area[i].name == "鉄鉱山") TekkouzanCnt++;
	}
	if (ArechiCnt == 4 &&
		KokumotsuCnt == 2 &&
		ShinrinCnt == 1 &&
		IwayamaCnt == 1 &&
		TekkouzanCnt == 1)
	{}else{return;}

	// ★9(1-1-1-2)
	// まず市場を作るのに必要な建設を行なう
	createFacilityEx(0, 0, Souko,  1, area) ||
	createFacilityEx(0, 1, Renpei, 3, area) ||
	createFacilityEx(0, 2, Shukusha, 1, area) ||
	createFacilityEx(0, 3, Bougu,  2, area) ||
	createFacilityEx(0, 4, Hatake, 1, area) ||
	createFacilityEx(0, 5, Hatake, 1, area) ||
	createFacilityEx(0, 6, Hatake, 1, area) ||

	createFacilityEx(1, 0, Ichiba, 1, area) ||
	createFacilityEx(1, 2, Hatake, 1, area) ||
	createFacilityEx(1, 3, Hatake, 1, area) ||
	createFacilityEx(1, 4, Hatake, 1, area) ||
//	createFacilityEx(1, 5, Suisha, 1, area) ||
	createFacilityEx(1, 6, Hatake, 1, area) ||

	createFacilityEx(2, 0, Hatake, 1, area) ||
	createFacilityEx(2, 1, Hatake, 1, area) ||
	createFacilityEx(2, 4, Hatake, 1, area) ||
	createFacilityEx(2, 5, Hatake, 1, area) ||
	createFacilityEx(2, 6, Hatake, 1, area) ||

	createFacilityEx(3, 0, Hatake, 1, area) ||
	createFacilityEx(3, 1, Hatake, 1, area) ||
	createFacilityEx(3, 5, Hatake, 1, area) ||
	createFacilityEx(3, 6, Hatake, 1, area) ||

	createFacilityEx(4, 0, Hatake, 1, area) ||
	createFacilityEx(4, 1, Hatake, 1, area) ||
	createFacilityEx(4, 5, Hatake, 1, area) ||
	createFacilityEx(4, 6, Hatake, 1, area) ||

	createFacilityEx(5, 0, Hatake, 1, area) ||
	createFacilityEx(5, 1, Hatake, 1, area) ||
	createFacilityEx(5, 2, Hatake, 1, area) ||
	createFacilityEx(5, 3, Hatake, 1, area) ||
	createFacilityEx(5, 4, Hatake, 1, area) ||
	createFacilityEx(5, 6, Hatake, 1, area) ||

	createFacilityEx(6, 0, Hatake, 1, area) ||
	createFacilityEx(6, 1, Hatake, 1, area) ||
	createFacilityEx(6, 2, Hatake, 1, area) ||
	createFacilityEx(6, 3, Hatake, 1, area) ||
	createFacilityEx(6, 4, Hatake, 1, area) ||
	createFacilityEx(6, 5, Hatake, 1, area) ||
	createFacilityEx(6, 6, Hatake, 1, area) ||

	// 水車を建設するのに必要なLV上げ
	createFacilityEx(0, 0, Souko,  10, area) ||
	createFacilityEx(0, 1, Renpei, 5, area) ||
	createFacilityEx(1, 0, Ichiba, 8, area) ||
	createFacilityEx(1, 5, Suisha, 1, area) ||

	// 水車周りの畑LV12にする
	createFacilityEx(0, 4, Hatake, 12, area) ||
	createFacilityEx(0, 5, Hatake, 12, area) ||
	createFacilityEx(0, 6, Hatake, 12, area) ||
	createFacilityEx(1, 4, Hatake, 12, area) ||
	createFacilityEx(1, 6, Hatake, 12, area) ||
	createFacilityEx(2, 4, Hatake, 12, area) ||
	createFacilityEx(2, 5, Hatake, 12, area) ||
	createFacilityEx(2, 6, Hatake, 12, area) ||

	// 水車LV10
	createFacilityEx(1, 5, Suisha, 10, area) ||

	// 拠点LV10 (拠点は既にあるため ID はダミーで ok)
	createFacilityEx(3, 3, 999, 10, area) ||

	true;
}

// ★5工場村
function buildPlant5(){
	var ArechiCnt		= 0, // 荒地
		KokumotsuCnt	= 0, // 穀物
		ShinrinCnt		= 0, // 森林
		IwayamaCnt		= 0, // 岩山
		TekkouzanCnt	= 0, // 鉄鉱山
		TargetType		= 0; // 伐採所 or 石切場 or 鉄鉱所
	var needKoujou = 1,
		needSuisha = 1,
		needIchiba = 1,
		needHeiki  = 1,
		needBougu  = 1,
		needKajiba = 1,
		needShukusha = 1,
		needRenpei = 1,
		needSouko  = 1;

	var vacant = new Array(); // 平地の座標
	var area = get_area_all();
	area.sort(cmp_areas);
	for(var i=0;i<area.length;i++){
		if(area[i].name == "荒地") ArechiCnt++; else
		if(area[i].name == "穀物") KokumotsuCnt++; else
		if(area[i].name == "森林") ShinrinCnt++; else
		if(area[i].name == "岩山") IwayamaCnt++; else
		if(area[i].name == "鉄鉱山") TekkouzanCnt++; else
		if(area[i].name == "工場") needKoujou = 0; else
		if(area[i].name == "水車") needSuisha = 0; else
		if(area[i].name == "市場") needIchiba = 0; else
		if(area[i].name == "兵器工房") needHeiki = 0; else
		if(area[i].name == "防具工場") needBougu = 0; else
		if(area[i].name == "鍛冶場") needKajiba = 0; else
		if(area[i].name == "宿舎") needShukusha = 0; else
		if(area[i].name == "練兵所") needRenpei = 0; else
		if(area[i].name == "倉庫") needSouko = 0; else
		if(area[i].name == "平地") vacant.push(area[i].xy);
	}
	if (ArechiCnt == 21 &&
		KokumotsuCnt == 0)
	{}else{return;}
		 if (ShinrinCnt == 6 && IwayamaCnt == 0 && TekkouzanCnt == 0) TargetType = Bassai;
	else if (ShinrinCnt == 0 && IwayamaCnt == 6 && TekkouzanCnt == 0) TargetType = Ishikiri;
	else if (ShinrinCnt == 0 && IwayamaCnt == 0 && TekkouzanCnt == 6) TargetType = Seitetsu;
	else return;

	if (needKoujou == 0 && needSuisha == 0) return;
	if (needSuisha == 0) needRenpei = 0;
	if (needKoujou == 0) needHeiki = 0;
	if (needHeiki  == 0) needKajiba = 0;
	if (needHeiki  == 0 && needIchiba == 0) needBougu = 0;
	if (needKajiba == 0 && needBougu == 0) needShukusha = 0;

	// 資源ブロック 南パターン
	if (OPT_PLANT5MURAS == 1)
	{
		// まず市場を作るのに必要な建設を行なう
		(needSouko		&& createFacilityEx(5, 5, Souko,  1, area)) ||
		(needRenpei		&& createFacilityEx(1, 4, Renpei, 3, area)) ||
		(needShukusha	&& createFacilityEx(1, 1, Shukusha, 1, area)) ||
		(needBougu		&& createFacilityEx(5, 1, Bougu,  2, area)) ||
		(needIchiba		&& createFacilityEx(1, 5, Ichiba, 1, area)) ||

		// 水車周囲の畑を作る
		createFacilityEx(2, 1, Hatake, 1, area) ||
		createFacilityEx(2, 2, Hatake, 1, area) ||
		createFacilityEx(2, 3, Hatake, 1, area) ||
		createFacilityEx(3, 1, Hatake, 1, area) ||
		createFacilityEx(4, 1, Hatake, 1, area) ||
		createFacilityEx(4, 2, Hatake, 1, area) ||
		createFacilityEx(4, 3, Hatake, 1, area) ||

		// 工場周囲の収穫所を作る
		createFacilityEx(2, 6, TargetType, 1, area) ||
		createFacilityEx(4, 6, TargetType, 1, area) ||

		// 兵器工房を作る
		(needKajiba		&& createFacilityEx(5, 2, Kajiba, 3, area)) ||
		(needBougu		&& createFacilityEx(5, 1, Bougu,  3, area)) ||
		(needHeiki		&& createFacilityEx(1, 3, Heiki,  5, area)) ||

		// 水車を作る
		(needRenpei		&& createFacilityEx(1, 4, Renpei, 5, area)) ||
		(needSouko		&& createFacilityEx(5, 5, Souko, 10, area)) ||
		(needIchiba		&& createFacilityEx(1, 5, Ichiba, 8, area)) ||
		(needSuisha		&& createFacilityEx(3, 2, Suisha, 1, area)) ||

		// 工場を作る
		(needIchiba		&& createFacilityEx(1, 5, Ichiba, 10, area)) ||
		(needKoujou		&& createFacilityEx(3, 5, Koujou,  1, area)) ||

		true;
		return;
	}

	// 資源ブロック 東パターン
	if (OPT_PLANT5MURAE == 1)
	{
		// まず市場を作るのに必要な建設を行なう
		(needSouko		&& createFacilityEx(5, 1, Souko,  1, area)) ||
		(needRenpei		&& createFacilityEx(4, 5, Renpei, 3, area)) ||
		(needShukusha	&& createFacilityEx(1, 5, Shukusha, 1, area)) ||
		(needBougu		&& createFacilityEx(1, 1, Bougu,  2, area)) ||
		(needIchiba		&& createFacilityEx(5, 5, Ichiba, 1, area)) ||

		// 水車周囲の畑を作る
		createFacilityEx(1, 2, Hatake, 1, area) ||
		createFacilityEx(1, 3, Hatake, 1, area) ||
		createFacilityEx(1, 4, Hatake, 1, area) ||
		createFacilityEx(2, 2, Hatake, 1, area) ||
		createFacilityEx(2, 4, Hatake, 1, area) ||
		createFacilityEx(3, 2, Hatake, 1, area) ||
		createFacilityEx(3, 4, Hatake, 1, area) ||

		// 工場周囲の収穫所を作る
		createFacilityEx(6, 2, TargetType, 1, area) ||
		createFacilityEx(6, 4, TargetType, 1, area) ||

		// 兵器工房を作る
		(needKajiba		&& createFacilityEx(2, 1, Kajiba, 3, area)) ||
		(needBougu		&& createFacilityEx(1, 1, Bougu,  3, area)) ||
		(needHeiki		&& createFacilityEx(3, 5, Heiki,  5, area)) ||

		// 水車を作る
		(needRenpei		&& createFacilityEx(4, 5, Renpei, 5, area)) ||
		(needSouko		&& createFacilityEx(5, 1, Souko, 10, area)) ||
		(needIchiba		&& createFacilityEx(5, 5, Ichiba, 8, area)) ||
		(needSuisha		&& createFacilityEx(2, 3, Suisha, 1, area)) ||

		// 工場を作る
		(needIchiba		&& createFacilityEx(5, 5, Ichiba, 10, area)) ||
		(needKoujou		&& createFacilityEx(5, 3, Koujou,  1, area)) ||

		true;
		return;
	}

	// 資源ブロック 西パターン
	if (OPT_PLANT5MURAW == 1)
	{
		// まず市場を作るのに必要な建設を行なう
		(needSouko		&& createFacilityEx(1, 5, Souko,  1, area)) ||
		(needRenpei		&& createFacilityEx(2, 1, Renpei, 3, area)) ||
		(needShukusha	&& createFacilityEx(5, 1, Shukusha, 1, area)) ||
		(needBougu		&& createFacilityEx(5, 5, Bougu,  2, area)) ||
		(needIchiba		&& createFacilityEx(1, 1, Ichiba, 1, area)) ||

		// 水車周囲の畑を作る
		createFacilityEx(3, 2, Hatake, 1, area) ||
		createFacilityEx(4, 2, Hatake, 1, area) ||
		createFacilityEx(5, 2, Hatake, 1, area) ||
		createFacilityEx(5, 3, Hatake, 1, area) ||
		createFacilityEx(3, 4, Hatake, 1, area) ||
		createFacilityEx(4, 4, Hatake, 1, area) ||
		createFacilityEx(5, 4, Hatake, 1, area) ||

		// 工場周囲の収穫所を作る
		createFacilityEx(0, 2, TargetType, 1, area) ||
		createFacilityEx(0, 4, TargetType, 1, area) ||

		// 兵器工房を作る
		(needKajiba		&& createFacilityEx(4, 5, Kajiba, 3, area)) ||
		(needBougu		&& createFacilityEx(5, 5, Bougu,  3, area)) ||
		(needHeiki		&& createFacilityEx(3, 1, Heiki,  5, area)) ||

		// 水車を作る
		(needRenpei		&& createFacilityEx(2, 1, Renpei, 5, area)) ||
		(needSouko		&& createFacilityEx(1, 5, Souko, 10, area)) ||
		(needIchiba		&& createFacilityEx(1, 1, Ichiba, 8, area)) ||
		(needSuisha		&& createFacilityEx(4, 3, Suisha, 1, area)) ||

		// 工場を作る
		(needIchiba		&& createFacilityEx(1, 1, Ichiba, 10, area)) ||
		(needKoujou		&& createFacilityEx(1, 3, Koujou,  1, area)) ||

		true;
		return;
	}

	// 資源ブロック 北パターン
	if (OPT_PLANT5MURAN == 1)
	{
		// まず市場を作るのに必要な建設を行なう
		(needSouko		&& createFacilityEx(1, 1, Souko,  1, area)) ||
		(needRenpei		&& createFacilityEx(5, 2, Renpei, 3, area)) ||
		(needShukusha	&& createFacilityEx(5, 5, Shukusha, 1, area)) ||
		(needBougu		&& createFacilityEx(1, 5, Bougu,  2, area)) ||
		(needIchiba		&& createFacilityEx(5, 1, Ichiba, 1, area)) ||

		// 水車周囲の畑を作る
		createFacilityEx(2, 3, Hatake, 1, area) ||
		createFacilityEx(2, 4, Hatake, 1, area) ||
		createFacilityEx(2, 5, Hatake, 1, area) ||
		createFacilityEx(3, 5, Hatake, 1, area) ||
		createFacilityEx(4, 3, Hatake, 1, area) ||
		createFacilityEx(4, 4, Hatake, 1, area) ||
		createFacilityEx(4, 5, Hatake, 1, area) ||

		// 工場周囲の収穫所を作る
		createFacilityEx(2, 0, TargetType, 1, area) ||
		createFacilityEx(4, 0, TargetType, 1, area) ||

		// 兵器工房を作る
		(needKajiba		&& createFacilityEx(1, 4, Kajiba, 3, area)) ||
		(needBougu		&& createFacilityEx(1, 5, Bougu,  3, area)) ||
		(needHeiki		&& createFacilityEx(5, 3, Heiki,  5, area)) ||

		// 水車を作る
		(needRenpei		&& createFacilityEx(5, 2, Renpei, 5, area)) ||
		(needSouko		&& createFacilityEx(1, 1, Souko, 10, area)) ||
		(needIchiba		&& createFacilityEx(5, 1, Ichiba, 8, area)) ||
		(needSuisha		&& createFacilityEx(3, 4, Suisha, 1, area)) ||

		// 工場を作る
		(needIchiba		&& createFacilityEx(5, 1, Ichiba, 10, area)) ||
		(needKoujou		&& createFacilityEx(3, 1, Koujou,  1, area)) ||

		true;
		return;
	}
}

function build0001S5(){
	var ArechiCnt		= 0, // 荒地
		KokumotsuCnt	= 0, // 穀物
		ShinrinCnt		= 0, // 森林
		IwayamaCnt		= 0, // 岩山
		TekkouzanCnt	= 0; // 鉄鉱山

	var area = get_area_all();
	area.sort(cmp_areas);
	for(var i=0;i<area.length;i++){
		if(area[i].name == "荒地") ArechiCnt++; else
		if(area[i].name == "穀物") KokumotsuCnt++; else
		if(area[i].name == "森林") ShinrinCnt++; else
		if(area[i].name == "岩山") IwayamaCnt++; else
		if(area[i].name == "鉄鉱山") TekkouzanCnt++;
	}
	if (ArechiCnt == 19 &&
		KokumotsuCnt == 1 &&
		ShinrinCnt == 0 &&
		IwayamaCnt == 0 &&
		TekkouzanCnt == 0)
	{}else{return;}

	// ★5(0-0-0-1)
	// まず市場を作るのに必要な建設を行なう
	createFacilityEx(0, 0, Souko,  1, area) ||
	createFacilityEx(1, 0, Renpei, 3, area) ||
	createFacilityEx(0, 1, Shukusha, 1, area) ||
	createFacilityEx(1, 1, Bougu,  2, area) ||

	createFacilityEx(0, 6, Hatake, 1, area) ||

	createFacilityEx(1, 3, Hatake, 1, area) ||
	createFacilityEx(1, 4, Hatake, 1, area) ||

	createFacilityEx(2, 1, Hatake, 1, area) ||
	createFacilityEx(2, 2, Hatake, 1, area) ||
	createFacilityEx(2, 3, Hatake, 1, area) ||
//	createFacilityEx(2, 4, Suisha, 1, area) ||
	createFacilityEx(2, 5, Hatake, 1, area) ||

	createFacilityEx(3, 1, Hatake, 1, area) ||
	createFacilityEx(3, 2, Hatake, 1, area) ||
	createFacilityEx(3, 4, Hatake, 1, area) ||
	createFacilityEx(3, 5, Hatake, 1, area) ||

	createFacilityEx(4, 1, Hatake, 1, area) ||
	createFacilityEx(4, 2, Hatake, 1, area) ||
	createFacilityEx(4, 3, Hatake, 1, area) ||
	createFacilityEx(4, 4, Hatake, 1, area) ||

	createFacilityEx(5, 2, Hatake, 1, area) ||
	createFacilityEx(5, 3, Hatake, 1, area) ||
	createFacilityEx(5, 4, Hatake, 1, area) ||
	createFacilityEx(5, 5, Hatake, 1, area) ||
	createFacilityEx(5, 6, Hatake, 1, area) ||

	createFacilityEx(6, 5, Hatake, 1, area) ||
	createFacilityEx(6, 6, Hatake, 1, area) ||
	createFacilityEx(6, 0, Ichiba, 1, area) ||

	// 水車を建設するのに必要なLV上げ
	createFacilityEx(0, 0, Souko,  10, area) ||
	createFacilityEx(1, 0, Renpei, 5, area) ||
	createFacilityEx(6, 0, Ichiba, 8, area) ||
	createFacilityEx(2, 4, Suisha, 1, area) ||

	// 水車周りの畑LV12にする
	createFacilityEx(1, 3, Hatake, 12, area) ||
	createFacilityEx(1, 4, Hatake, 12, area) ||
	createFacilityEx(2, 3, Hatake, 12, area) ||
	createFacilityEx(2, 4, Suisha, 10, area) ||
	createFacilityEx(2, 5, Hatake, 12, area) ||
	createFacilityEx(3, 4, Hatake, 12, area) ||
	createFacilityEx(3, 5, Hatake, 12, area) ||

	true;
}

function areas(name,xy){
	this.name = name;
	this.xy = xy;
}

//比較する関数
function cmp_areas(a,b){
	if(a.xy > b.xy){return 1;} else {return -1;}
}

// 次拠点移動
function forwardNextVillage(){
	// 巡回停止中ならスキップ 2012.01.24
	if (GM_getValue(HOST+PGNAME+"AutoFlg", true) == false) { return; }

	var nowTime = new Date();
	var nextTime = getNextTime(location.hostname, nowTime);
	var waitTime = nextTime - nowTime;
	var roundTime = 0;

// @@ add 2011.10.04 @@

	if (tidMain2 != undefined) { clearInterval(tidMain2); }

	if ((ShopFlg == true) && (ShopURL != "")) {
		roundTime = 10 * 1000;
		tidMain2=setTimeout(function(){location.href = ShopURL;},roundTime);
	}

	// 建築済みで次建築がセットされていない未巡回の拠点への移動(２拠点同時に完了した場合に使う処理)
	var villages = loadVillages(location.hostname + PGNAME);
	for (var i = 0; i < villages.length; i++) {
		var actions = sortAction(villages[i][IDX_ACTIONS]);
		var nowTime = new Date();
		for (var j = 0; j < actions.length; j++) {
			var actionDiv = createActionDiv(actions[j], nowTime, villages[i][IDX_XY], location.hostname);
			if (!actionDiv) continue;

			var actionTime = new Date(actions[j][IDX2_TIME]);
			var moveFlg = 0;
			if ( actionTime < nowTime && actions[j][IDX2_ROTATION] == 0 && actions[j][IDX2_TYPE] == TYPE_CONSTRUCTION){
				for (var x = j + 1; x < actions.length; x++){
					actionTime = new Date(actions[x][IDX2_TIME]);
					if ( actionTime > nowTime && actions[x][IDX2_ROTATION] == 0 && actions[x][IDX2_TYPE] == TYPE_CONSTRUCTION){
						moveFlg = 1;
						break;
					}
				}
				if ( !(x < actions.length) ) {
					actions[j][IDX2_ROTATION] = 1;
				}
				if (moveFlg == 0) {
					var data = new Array();
					data[IDX_BASE_NAME] = villages[i][IDX_BASE_NAME];
					data[IDX_XY] = villages[i][IDX_XY];
					data[IDX_ACTIONS] = actions;

					if (location.pathname == "/village.php") {
						var vcURL = villages[i][IDX_URL];
							if(vcURL!=undefined){
								saveVillages(HOST+PGNAME, villages);
								roundTime = 5 * 1000;
								tidMain2=setTimeout(function(){location.href = vcURL;},roundTime);
							}
					}
				}
			}
		}
	}
	if ( tidMain2 == undefined ) {
		//一番早い作業完了時刻を取得
		var startTime = new Date("2099/12/31 23:59:59");
		var nextTime = startTime;
		var baseTime = new Date();

		nextURL = "";
		// 次回建設終了予定の検索
		for (var i = 0; i < villages.length; i++) {
			var actions = villages[i][IDX_ACTIONS];
			for (var j = 0; j < actions.length; j++) {
				var actionTime = new Date(actions[j][IDX2_TIME]);
				if (actionTime > baseTime && actionTime < nextTime && actions[j][IDX2_TYPE] == TYPE_CONSTRUCTION) {
					var type = actions[j][IDX2_TYPE].charAt(0);
					nextTime = actionTime;
					nextURL  = villages[i][IDX_URL];
					nextNAME = villages[i][IDX_BASE_NAME];
				}
			}
		}

		var nTime = (nextTime - nowTime);
		var vcURL = nextVillageURL(getVillageID(vId));

		if(vcURL!=undefined){
			if (nextURL == "") {
				// 次回建築完了予定がない場合は通常巡回処理
				roundTime = parseInt(OPT_ROUND_TIME1) * 1000;
				tidMain2=setTimeout(function(){location.href = vcURL;},roundTime);
			} else {
				if (parseInt(OPT_ROUND_TIME1) * 1000 > nTime) {
					// 巡回時間より前に建築が終わる拠点がある場合
					// 2011.12.06 即時変更をやめて10秒後に修正
//					tidMain2=setTimeout(function(){location.href = nextURL;},(nextTime - nowTime));
//					tidMain2=setTimeout(function(){location.href = nextURL;},10 * 1000);
					roundTime = (nextTime - nowTime + 10000);
					tidMain2=setTimeout(function(){location.href = nextURL;},roundTime);
				} else {
					// 通常巡回処理
					roundTime = parseInt(OPT_ROUND_TIME1) * 1000;
					tidMain2=setTimeout(function(){location.href = vcURL;},roundTime);
				}
			}
		}
	}
debugLog("nTime:" + nTime / 1000 + "sec  RoundTime:" + (roundTime / 1000) + "sec  forwardNextVillage:" + vcURL + " " + roundTime);
}

//比較する関数
function cmp_time(a,b){
	if(a.xy > b.xy){return 1;} else {return -1;}
}

// 次拠点URL取得
function nextVillageURL(vId2){
	var villages = loadVillages(HOST+PGNAME);
	var nextIndex = 0;
	var chkNextVID = new Array();
	for(var i=0; i<villages.length;i++){
		var tChk1 = GM_getValue(HOST+PGNAME+"OPT_CHKBOX_AVC_"+i, true);
		if(tChk1==true){
			chkNextVID.push(villages[i][IDX_URL]);
		}
	}

	// 現在の拠点のインデックスを検索 2012.01.24 逆順処理追加
	for(var i=0; i<chkNextVID.length;i++){
		var url = chkNextVID[i];
		if(vId2 == getParameter2(chkNextVID[i], "village_id")){
			if (getReverseMode() == false) {
				// 正巡回
				if(i+1 < chkNextVID.length){
					nextIndex = i+1;
				}else{
					nextIndex = 0;
				}
			} else {
				// 逆巡回
				if(i-1 < 0){
					nextIndex = chkNextVID.length-1;
				} else {
					nextIndex = i-1;
				}
			}
			break;
		}
	}
	return chkNextVID[nextIndex];
}


// URLパラメタ取得
function getParameter2(url, key) {
	var str = url.split("?");
	if (str.length < 2) {
		return "";
	}

	var params = str[1].split("&");
	for (var i = 0; i < params.length; i++) {
		var keyVal = params[i].split("=");
		if (keyVal[0] == key && keyVal.length == 2) {
			return decodeURIComponent(keyVal[1]);
		}
	}
	return "";
}


//建築物の格納用
function lv_sort(name,lv,xy){
	this.name = name;
	this.lv = lv;
	this.xy = xy;
}
//比較する関数
function cmp_lv(a,b){
	return a.lv - b.lv;
}

function cmp_lv2(a,b){
	return b.lv - a.lv;
}
//拠点IDの取得
function getVillageID(vId){
	//villages
	var villages = loadVillages(HOST+PGNAME);
	for(var i=0; i<villages.length;i++){
		if(villages[i][IDX_XY] == vId){
			var vURL = villages[i][IDX_URL];
			var temp = vURL.split("?");
			var temp2 = temp[1].split("=");
			return temp2[1];
		}
	}
}
function getURLxy(strURL){
	if(strURL == ""){ return "";}
	var strTemp = "";
	strTemp = strURL;
	var Temp = strTemp.split("?");
	var Temp2 = Temp[1].split("&");
	var Temp3 = Temp2[0].split("=");
	var Temp4 = Temp2[1].split("=");
	var Temp5 = Temp4[1].split("#");		// 2013.12.18
	return Temp3[1] + "," +Temp5[0];		// 2013.12.18
}

//リンクHTML追加
function addOpenLinkHtml() {
	if (location.hostname[0] == "s" || location.hostname[0] == "h" || location.hostname[0] == "p") {
//			var sidebar = d.evaluate('//*[@class="copyright"]',d, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
		var sidebar = d.evaluate('//*[@class="sideBoxHead"]/h3/strong',d, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	} else {
		var sidebar = d.evaluate('//a[@title="拠点"]',d, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	}
	if (sidebar.snapshotLength == 0){
		sidebar = d.evaluate('//*[@class="xy"]',d, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
		if (sidebar.snapshotLength == 0) return;
		isMixi = false;
	}

	//自動移動リンク
	var openLink = d.createElement("a");
	openLink.id = "Auto_Bilder";
	openLink.href = "javascript:void(0);";
	openLink.style.marginTop = "0px";
	openLink.style.marginLeft = "0px";
	openLink.innerHTML = " [自動建築]";
/*
	if (location.hostname[0] == "s" || location.hostname[0] == "h") {
		openLink.style.color = "#000000";
	} else {
		openLink.style.color = "#FFFFFF";
	}
*/
	openLink.style.color = "#FFFFFF";
	openLink.style.cursor = "pointer";

	openLink.addEventListener("click", function() {
		closeIniBilderBox();
		openIniBilderBox();
	}, true);
	if (location.hostname[0] == "s" || location.hostname[0] == "h") {
		sidebar.snapshotItem(1).appendChild(openLink);
	} else {
		sidebar.snapshotItem(0).appendChild(openLink);
	}
}

//建築設定画面を開く
function openIniBilderBox() {
	addIniBilderHtml();
}

//建築設定画面を閉じる
function closeIniBilderBox() {
	deleteIniBilderHtml();
	deleteIniBilderFrameHtml();
}
//建築対象拠点表示HTML削除
function deleteIniBilderHtml() {
	var elem = d.getElementById("ABContainer");
	if (elem == undefined) return;
	d.body.removeChild(d.getElementById("ABContainer"));
}
//建築対象拠点表示HTML削除
function deleteIniBilderFrameHtml() {
	var elem = d.getElementById("ABContainer");
	if (elem == undefined) return;
	d.body.removeChild(document.getElementById("ABContainer"));
}

//LvUP対象施設設定画面を開く
function openInifacBox(vId) {
	if (tidMain2 != undefined) { clearInterval(tidMain2); }
	if (tidMain3 != undefined) { clearInterval(tidMain3); }
	closeInifacBox();
	addInifacHtml(vId);
}
///LvUP対象施設設定画面を閉じる
function closeInifacBox() {
	deleteInifacHtml();
	deleteInifacFrameHtml();
}

// 水車村化オプションのチェックボックスをクリアする
function clearWaterwheelBox(){
	var checkbox = $a('//input[@id="OPT_1112MURA"]');	checkbox[0].checked = false; // 水車村化
	var checkbox = $a('//input[@id="OPT_0001S5MURA"]');	checkbox[0].checked = false; // 水車村化
	var checkbox = $a('//input[@id="OPT_PLANT5MURAN"]');	checkbox[0].checked = false; // 工場村化
	var checkbox = $a('//input[@id="OPT_PLANT5MURAE"]');	checkbox[0].checked = false; // 工場村化
	var checkbox = $a('//input[@id="OPT_PLANT5MURAW"]');	checkbox[0].checked = false; // 工場村化
	var checkbox = $a('//input[@id="OPT_PLANT5MURAS"]');	checkbox[0].checked = false; // 工場村化
}

///LvUP対象施設設のチェックボックスをクリアする
function clearInifacBox() {

	var checkbox = $a('//input[@id="OPT_CHKBOX0"]');   checkbox[0].checked = false;
	var checkbox = $a('//input[@id="OPT_CHKBOX1"]');   checkbox[0].checked = false;
	var checkbox = $a('//input[@id="OPT_CHKBOX2"]');   checkbox[0].checked = false;
	var checkbox = $a('//input[@id="OPT_CHKBOX3"]');   checkbox[0].checked = false;
	var checkbox = $a('//input[@id="OPT_CHKBOX4"]');   checkbox[0].checked = false;
	var checkbox = $a('//input[@id="OPT_CHKBOX5"]');   checkbox[0].checked = false;
	var checkbox = $a('//input[@id="OPT_CHKBOX6"]');   checkbox[0].checked = false;
	var checkbox = $a('//input[@id="OPT_CHKBOX7"]');   checkbox[0].checked = false;
	var checkbox = $a('//input[@id="OPT_CHKBOX8"]');   checkbox[0].checked = false;
	var checkbox = $a('//input[@id="OPT_CHKBOX9"]');   checkbox[0].checked = false;
	var checkbox = $a('//input[@id="OPT_CHKBOX10"]');  checkbox[0].checked = false;
	var checkbox = $a('//input[@id="OPT_CHKBOX11"]');  checkbox[0].checked = false;
	var checkbox = $a('//input[@id="OPT_CHKBOX12"]');  checkbox[0].checked = false;
	var checkbox = $a('//input[@id="OPT_CHKBOX13"]');  checkbox[0].checked = false;
	var checkbox = $a('//input[@id="OPT_CHKBOX14"]');  checkbox[0].checked = false;
	var checkbox = $a('//input[@id="OPT_CHKBOX15"]');  checkbox[0].checked = false;
	var checkbox = $a('//input[@id="OPT_CHKBOX16"]');  checkbox[0].checked = false;
	var checkbox = $a('//input[@id="OPT_CHKBOX17"]');  checkbox[0].checked = false;
	var checkbox = $a('//input[@id="OPT_CHKBOX18"]');  checkbox[0].checked = false;
	var checkbox = $a('//input[@id="OPT_CHKBOX19"]');  checkbox[0].checked = false;
	var checkbox = $a('//input[@id="OPT_CHKBOX20"]');  checkbox[0].checked = false;
	var checkbox = $a('//input[@id="OPT_CHKBOX21"]');  checkbox[0].checked = false;
	var checkbox = $a('//input[@id="OPT_CHKBOX22"]');  checkbox[0].checked = false;

	var textbox = $a('//input[@id="OPT_CHKBOXLV0"]');	textbox[0].value = 0;
	var textbox = $a('//input[@id="OPT_CHKBOXLV1"]');	textbox[0].value = 0;
	var textbox = $a('//input[@id="OPT_CHKBOXLV2"]');	textbox[0].value = 0;
	var textbox = $a('//input[@id="OPT_CHKBOXLV3"]');	textbox[0].value = 0;
	var textbox = $a('//input[@id="OPT_CHKBOXLV4"]');	textbox[0].value = 0;
	var textbox = $a('//input[@id="OPT_CHKBOXLV5"]');	textbox[0].value = 0;
	var textbox = $a('//input[@id="OPT_CHKBOXLV6"]');	textbox[0].value = 0;
	var textbox = $a('//input[@id="OPT_CHKBOXLV7"]');	textbox[0].value = 0;
	var textbox = $a('//input[@id="OPT_CHKBOXLV8"]');	textbox[0].value = 0;
	var textbox = $a('//input[@id="OPT_CHKBOXLV9"]');	textbox[0].value = 0;
	var textbox = $a('//input[@id="OPT_CHKBOXLV10"]');	textbox[0].value = 0;
	var textbox = $a('//input[@id="OPT_CHKBOXLV11"]');	textbox[0].value = 0;
	var textbox = $a('//input[@id="OPT_CHKBOXLV12"]');	textbox[0].value = 0;
	var textbox = $a('//input[@id="OPT_CHKBOXLV13"]');	textbox[0].value = 0;
	var textbox = $a('//input[@id="OPT_CHKBOXLV14"]');	textbox[0].value = 0;
	var textbox = $a('//input[@id="OPT_CHKBOXLV15"]');	textbox[0].value = 0;
	var textbox = $a('//input[@id="OPT_CHKBOXLV16"]');	textbox[0].value = 0;
	var textbox = $a('//input[@id="OPT_CHKBOXLV17"]');	textbox[0].value = 0;
	var textbox = $a('//input[@id="OPT_CHKBOXLV18"]');	textbox[0].value = 0;
	var textbox = $a('//input[@id="OPT_CHKBOXLV19"]');	textbox[0].value = 0;
	var textbox = $a('//input[@id="OPT_CHKBOXLV20"]');	textbox[0].value = 0;
	var textbox = $a('//input[@id="OPT_CHKBOXLV21"]');	textbox[0].value = 0;
	var textbox = $a('//input[@id="OPT_CHKBOXLV22"]');	textbox[0].value = 0;
	// 内政設定
	var checkbox = $a('//input[@id="OPT_DOME1"]');	checkbox[0].checked = false;	// 伐採知識
	var checkbox = $a('//input[@id="OPT_DOME2"]');	checkbox[0].checked = false;	// 伐採技術
	var checkbox = $a('//input[@id="OPT_DOME3"]');	checkbox[0].checked = false;	// 弓兵増強
	var checkbox = $a('//input[@id="OPT_DOME4"]');	checkbox[0].checked = false;	// 石切知識
	var checkbox = $a('//input[@id="OPT_DOME5"]');	checkbox[0].checked = false;	// 石切技術
	var checkbox = $a('//input[@id="OPT_DOME6"]');	checkbox[0].checked = false;	// 槍兵増強
	var checkbox = $a('//input[@id="OPT_DOME7"]');	checkbox[0].checked = false;	// 製鉄知識
	var checkbox = $a('//input[@id="OPT_DOME8"]');	checkbox[0].checked = false;	// 製鉄技術
	var checkbox = $a('//input[@id="OPT_DOME9"]');	checkbox[0].checked = false;	// 騎兵増強
	var checkbox = $a('//input[@id="OPT_DOME10"]'); checkbox[0].checked = false;	// 食糧知識
	var checkbox = $a('//input[@id="OPT_DOME11"]'); checkbox[0].checked = false;	// 食糧技術
	var checkbox = $a('//input[@id="OPT_DOME12"]'); checkbox[0].checked = false;	// 農林知識
	var checkbox = $a('//input[@id="OPT_DOME13"]'); checkbox[0].checked = false;	// 農林技術
	var checkbox = $a('//input[@id="OPT_DOME14"]'); checkbox[0].checked = false;	// 加工知識
	var checkbox = $a('//input[@id="OPT_DOME15"]'); checkbox[0].checked = false;	// 加工技術
	var checkbox = $a('//input[@id="OPT_DOME16"]'); checkbox[0].checked = false;	// 富国
	var checkbox = $a('//input[@id="OPT_DOME17"]'); checkbox[0].checked = false;	// 富国論
	var checkbox = $a('//input[@id="OPT_DOME18"]'); checkbox[0].checked = false;	// 富国強兵
	var checkbox = $a('//input[@id="OPT_DOME19"]'); checkbox[0].checked = false;	// 豊穣
	var checkbox = $a('//input[@id="OPT_DOME20"]'); checkbox[0].checked = false;	// 美玉歌舞
	var checkbox = $a('//input[@id="OPT_DOME21"]'); checkbox[0].checked = false;	// 恵風
	var checkbox = $a('//input[@id="OPT_DOME22"]'); checkbox[0].checked = false;	// 人選眼力
	var checkbox = $a('//input[@id="OPT_DOME23"]'); checkbox[0].checked = false;	// 呉の治世
	var checkbox = $a('//input[@id="OPT_DOME24"]'); checkbox[0].checked = false;	// 王佐の才
	var checkbox = $a('//input[@id="OPT_DOME25"]'); checkbox[0].checked = false;	// 練兵訓練
	var checkbox = $a('//input[@id="OPT_DOME26"]'); checkbox[0].checked = false;	// 　　修練
	var checkbox = $a('//input[@id="OPT_DOME27"]'); checkbox[0].checked = false;	// 兵舎訓練
	var checkbox = $a('//input[@id="OPT_DOME28"]'); checkbox[0].checked = false;	// 　　修練
	var checkbox = $a('//input[@id="OPT_DOME29"]'); checkbox[0].checked = false;	// 弓兵訓練
	var checkbox = $a('//input[@id="OPT_DOME30"]'); checkbox[0].checked = false;	// 　　修練
	var checkbox = $a('//input[@id="OPT_DOME31"]'); checkbox[0].checked = false;	// 厩舎訓練
	var checkbox = $a('//input[@id="OPT_DOME32"]'); checkbox[0].checked = false;	// 　　修練
	var checkbox = $a('//input[@id="OPT_DOME33"]'); checkbox[0].checked = false;	// 兵器訓練
	var checkbox = $a('//input[@id="OPT_DOME34"]'); checkbox[0].checked = false;	// 　　修練
	var checkbox = $a('//input[@id="OPT_DOME35"]'); checkbox[0].checked = false;	// 強兵の檄文
	var checkbox = $a('//input[@id="OPT_DOME36"]'); checkbox[0].checked = false;	// 攻城の檄文
	var checkbox = $a('//input[@id="OPT_DOME37"]'); checkbox[0].checked = false;	// 豊潤祈祷
	// 糧村オプション
	var checkbox = $a('//input[@id="OPT_KATEMURA"]');	checkbox[0].checked = false; // 糧村化
	clearWaterwheelBox(); // 水車村オプション
	// 宿舎村オプション
	var checkbox = $a('//input[@id="OPT_DORM"]');		checkbox[0].checked = false; // 宿舎村化 2013.12.26
	// 自動造兵
	var checkbox = $a('//input[@id="OPT_BLD_SOL"]');	checkbox[0].checked = false;
	// 自動武器・防具強化
	var checkbox = $a('//input[@id="OPT_BKBG_CHK"]');	checkbox[0].checked = false;
	// 自動削除 2015.05.10
	clearRemoveBox();
}

// 自動削除 2015.05.10
function clearRemoveBox(){
	var checkbox = $a('//input[@id="OPT_REMOVE"]'); 	checkbox[0].checked = false;

	for(var i=0; i<=22; i++){
	var checkbox = $a('//input[@id="OPT_RM_CHKBOX'+i+'"]');  if(checkbox.length != 0) checkbox[0].checked = false;
	var textbox  = $a('//input[@id="OPT_RM_CHKBOXLV'+i+'"]'); if(textbox.length != 0) textbox[0].value = 0;
	}
}

function InitMilitaryHome(){
	// 遠征訓練所
	clearInifacBox();
	var checkbox = $a('//input[@id="OPT_CHKBOX0"]');   checkbox[0].checked = false; // 拠点
	var checkbox = $a('//input[@id="OPT_CHKBOX1"]');   checkbox[0].checked = false; // 伐採所
	var checkbox = $a('//input[@id="OPT_CHKBOX2"]');   checkbox[0].checked = false; // 石切り場
	var checkbox = $a('//input[@id="OPT_CHKBOX3"]');   checkbox[0].checked = false; // 製鉄所
	var checkbox = $a('//input[@id="OPT_CHKBOX4"]');   checkbox[0].checked = true;	// 畑
	var checkbox = $a('//input[@id="OPT_CHKBOX5"]');   checkbox[0].checked = true;	// 倉庫
	var checkbox = $a('//input[@id="OPT_CHKBOX6"]');   checkbox[0].checked = true;	// 銅雀台
	var checkbox = $a('//input[@id="OPT_CHKBOX7"]');   checkbox[0].checked = true;	// 鍛冶場
	var checkbox = $a('//input[@id="OPT_CHKBOX8"]');   checkbox[0].checked = true;	// 防具工場
	var checkbox = $a('//input[@id="OPT_CHKBOX9"]');   checkbox[0].checked = true;	// 練兵所
	var checkbox = $a('//input[@id="OPT_CHKBOX10"]');  checkbox[0].checked = false; // 兵舎
	var checkbox = $a('//input[@id="OPT_CHKBOX11"]');  checkbox[0].checked = false; // 弓兵舎
	var checkbox = $a('//input[@id="OPT_CHKBOX12"]');  checkbox[0].checked = false; // 厩舎
	var checkbox = $a('//input[@id="OPT_CHKBOX13"]');  checkbox[0].checked = true;	// 宿舎
	var checkbox = $a('//input[@id="OPT_CHKBOX14"]');  checkbox[0].checked = false; // 兵器工房
	var checkbox = $a('//input[@id="OPT_CHKBOX15"]');  checkbox[0].checked = false; // 市場
	var checkbox = $a('//input[@id="OPT_CHKBOX16"]');  checkbox[0].checked = true;	// 訓練所
	var checkbox = $a('//input[@id="OPT_CHKBOX17"]');  checkbox[0].checked = false; // 水車
	var checkbox = $a('//input[@id="OPT_CHKBOX18"]');  checkbox[0].checked = false; // 工場
	var checkbox = $a('//input[@id="OPT_CHKBOX19"]');  checkbox[0].checked = false; // 研究所
	var checkbox = $a('//input[@id="OPT_CHKBOX20"]');  checkbox[0].checked = true;	// 大宿舎
	var checkbox = $a('//input[@id="OPT_CHKBOX21"]');  checkbox[0].checked = true;	// 遠征訓練所
	var checkbox = $a('//input[@id="OPT_CHKBOX22"]');  checkbox[0].checked = true;	// 見張り台

	var textbox = $a('//input[@id="OPT_CHKBOXLV0"]');	textbox[0].value = 0;	// 拠点
	var textbox = $a('//input[@id="OPT_CHKBOXLV1"]');	textbox[0].value = 0;	// 伐採所
	var textbox = $a('//input[@id="OPT_CHKBOXLV2"]');	textbox[0].value = 0;	// 石切り場
	var textbox = $a('//input[@id="OPT_CHKBOXLV3"]');	textbox[0].value = 0;	// 製鉄所
	var textbox = $a('//input[@id="OPT_CHKBOXLV4"]');	textbox[0].value = 5;	// 畑
	var textbox = $a('//input[@id="OPT_CHKBOXLV5"]');	textbox[0].value = 1;	// 倉庫
	var textbox = $a('//input[@id="OPT_CHKBOXLV6"]');	textbox[0].value = 7;	// 銅雀台
	var textbox = $a('//input[@id="OPT_CHKBOXLV7"]');	textbox[0].value = 5;	// 鍛冶場
	var textbox = $a('//input[@id="OPT_CHKBOXLV8"]');	textbox[0].value = 7;	// 防具工場
	var textbox = $a('//input[@id="OPT_CHKBOXLV9"]');	textbox[0].value = 3;	// 練兵所
	var textbox = $a('//input[@id="OPT_CHKBOXLV10"]');	textbox[0].value = 0;	// 兵舎
	var textbox = $a('//input[@id="OPT_CHKBOXLV11"]');	textbox[0].value = 0;	// 弓兵舎
	var textbox = $a('//input[@id="OPT_CHKBOXLV12"]');	textbox[0].value = 0;	// 厩舎
	var textbox = $a('//input[@id="OPT_CHKBOXLV13"]');	textbox[0].value = 15;	// 宿舎
	var textbox = $a('//input[@id="OPT_CHKBOXLV14"]');	textbox[0].value = 0;	// 兵器工房
	var textbox = $a('//input[@id="OPT_CHKBOXLV15"]');	textbox[0].value = 0;	// 市場
	var textbox = $a('//input[@id="OPT_CHKBOXLV16"]');	textbox[0].value = 5;	// 訓練所
	var textbox = $a('//input[@id="OPT_CHKBOXLV17"]');	textbox[0].value = 0;	// 水車
	var textbox = $a('//input[@id="OPT_CHKBOXLV18"]');	textbox[0].value = 0;	// 工場
	var textbox = $a('//input[@id="OPT_CHKBOXLV19"]');	textbox[0].value = 0;	// 研究所
	var textbox = $a('//input[@id="OPT_CHKBOXLV20"]');	textbox[0].value = 8;	// 大宿舎
	var textbox = $a('//input[@id="OPT_CHKBOXLV21"]');	textbox[0].value = 10;	// 遠征訓練所
	var textbox = $a('//input[@id="OPT_CHKBOXLV22"]');	textbox[0].value = 8;	// 見張り台
	// 内政設定
	var checkbox = $a('//input[@id="OPT_DOME1"]');	checkbox[0].checked = false;	// 伐採知識
	var checkbox = $a('//input[@id="OPT_DOME2"]');	checkbox[0].checked = false;	// 伐採技術
	var checkbox = $a('//input[@id="OPT_DOME3"]');	checkbox[0].checked = false;	// 弓兵増強
	var checkbox = $a('//input[@id="OPT_DOME4"]');	checkbox[0].checked = false;	// 石切知識
	var checkbox = $a('//input[@id="OPT_DOME5"]');	checkbox[0].checked = false;	// 石切技術
	var checkbox = $a('//input[@id="OPT_DOME6"]');	checkbox[0].checked = false;	// 槍兵増強
	var checkbox = $a('//input[@id="OPT_DOME7"]');	checkbox[0].checked = false;	// 製鉄知識
	var checkbox = $a('//input[@id="OPT_DOME8"]');	checkbox[0].checked = false;	// 製鉄技術
	var checkbox = $a('//input[@id="OPT_DOME9"]');	checkbox[0].checked = false;	// 騎兵増強
	var checkbox = $a('//input[@id="OPT_DOME10"]'); checkbox[0].checked = false;	// 食糧知識
	var checkbox = $a('//input[@id="OPT_DOME11"]'); checkbox[0].checked = false;	// 食糧技術
	var checkbox = $a('//input[@id="OPT_DOME12"]'); checkbox[0].checked = false;	// 農林知識
	var checkbox = $a('//input[@id="OPT_DOME13"]'); checkbox[0].checked = false;	// 農林技術
	var checkbox = $a('//input[@id="OPT_DOME14"]'); checkbox[0].checked = false;	// 加工知識
	var checkbox = $a('//input[@id="OPT_DOME15"]'); checkbox[0].checked = false;	// 加工技術
	var checkbox = $a('//input[@id="OPT_DOME16"]'); checkbox[0].checked = false;	// 富国
	var checkbox = $a('//input[@id="OPT_DOME17"]'); checkbox[0].checked = false;	// 富国論
	var checkbox = $a('//input[@id="OPT_DOME18"]'); checkbox[0].checked = false;	// 富国強兵
	var checkbox = $a('//input[@id="OPT_DOME19"]'); checkbox[0].checked = false;	// 豊穣
	var checkbox = $a('//input[@id="OPT_DOME20"]'); checkbox[0].checked = false;	// 美玉歌舞
	var checkbox = $a('//input[@id="OPT_DOME21"]'); checkbox[0].checked = false;	// 恵風
	var checkbox = $a('//input[@id="OPT_DOME22"]'); checkbox[0].checked = false;	// 人選眼力
	var checkbox = $a('//input[@id="OPT_DOME23"]'); checkbox[0].checked = false;	// 呉の治世
	var checkbox = $a('//input[@id="OPT_DOME24"]'); checkbox[0].checked = false;	// 王佐の才
	var checkbox = $a('//input[@id="OPT_DOME25"]'); checkbox[0].checked = false;	// 練兵訓練
	var checkbox = $a('//input[@id="OPT_DOME26"]'); checkbox[0].checked = false;	// 　　修練
	var checkbox = $a('//input[@id="OPT_DOME27"]'); checkbox[0].checked = false;	// 兵舎訓練
	var checkbox = $a('//input[@id="OPT_DOME28"]'); checkbox[0].checked = false;	// 　　修練
	var checkbox = $a('//input[@id="OPT_DOME29"]'); checkbox[0].checked = false;	// 弓兵訓練
	var checkbox = $a('//input[@id="OPT_DOME30"]'); checkbox[0].checked = false;	// 　　修練
	var checkbox = $a('//input[@id="OPT_DOME31"]'); checkbox[0].checked = false;	// 厩舎訓練
	var checkbox = $a('//input[@id="OPT_DOME32"]'); checkbox[0].checked = false;	// 　　修練
	var checkbox = $a('//input[@id="OPT_DOME33"]'); checkbox[0].checked = false;	// 兵器訓練
	var checkbox = $a('//input[@id="OPT_DOME34"]'); checkbox[0].checked = false;	// 　　修練
	var checkbox = $a('//input[@id="OPT_DOME35"]'); checkbox[0].checked = false;	// 強兵の檄文
	var checkbox = $a('//input[@id="OPT_DOME36"]'); checkbox[0].checked = false;	// 攻城の檄文
	var checkbox = $a('//input[@id="OPT_DOME37"]'); checkbox[0].checked = false;	// 豊潤祈祷
}

function InitRiceParadise(){			// 2013.12.18
	// 城①
	clearInifacBox();
	var checkbox = $a('//input[@id="OPT_CHKBOX1"]');   checkbox[0].checked = true;	// 伐採所
	var checkbox = $a('//input[@id="OPT_CHKBOX2"]');   checkbox[0].checked = true;	// 石切り場
	var checkbox = $a('//input[@id="OPT_CHKBOX3"]');   checkbox[0].checked = true;	// 製鉄所
	var checkbox = $a('//input[@id="OPT_CHKBOX4"]');   checkbox[0].checked = true;	// 畑
	var checkbox = $a('//input[@id="OPT_CHKBOX5"]');   checkbox[0].checked = true;	// 倉庫
	var checkbox = $a('//input[@id="OPT_CHKBOX6"]');   checkbox[0].checked = true;	// 銅雀台
	var checkbox = $a('//input[@id="OPT_CHKBOX15"]');  checkbox[0].checked = true;	// 市場

	var textbox = $a('//input[@id="OPT_CHKBOXLV1"]');	textbox[0].value = 10;	// 伐採所
	var textbox = $a('//input[@id="OPT_CHKBOXLV2"]');	textbox[0].value = 10;	// 石切り場
	var textbox = $a('//input[@id="OPT_CHKBOXLV3"]');	textbox[0].value = 10;	// 製鉄所
	var textbox = $a('//input[@id="OPT_CHKBOXLV4"]');	textbox[0].value = 10;	// 畑
	var textbox = $a('//input[@id="OPT_CHKBOXLV5"]');	textbox[0].value = 10;	// 倉庫
	var textbox = $a('//input[@id="OPT_CHKBOXLV6"]');	textbox[0].value = 5;	// 銅雀台
	var textbox = $a('//input[@id="OPT_CHKBOXLV15"]');	textbox[0].value = 10;	// 市場

	// 内政設定
	var checkbox = $a('//input[@id="OPT_DOME1"]');	checkbox[0].checked = false;	// 伐採知識
	var checkbox = $a('//input[@id="OPT_DOME2"]');	checkbox[0].checked = false;	// 伐採技術
	var checkbox = $a('//input[@id="OPT_DOME3"]');	checkbox[0].checked = false;	// 弓兵増強
	var checkbox = $a('//input[@id="OPT_DOME4"]');	checkbox[0].checked = false;	// 石切知識
	var checkbox = $a('//input[@id="OPT_DOME5"]');	checkbox[0].checked = false;	// 石切技術
	var checkbox = $a('//input[@id="OPT_DOME6"]');	checkbox[0].checked = false;	// 槍兵増強
	var checkbox = $a('//input[@id="OPT_DOME7"]');	checkbox[0].checked = false;	// 製鉄知識
	var checkbox = $a('//input[@id="OPT_DOME8"]');	checkbox[0].checked = false;	// 製鉄技術
	var checkbox = $a('//input[@id="OPT_DOME9"]');	checkbox[0].checked = false;	// 騎兵増強
	var checkbox = $a('//input[@id="OPT_DOME10"]'); checkbox[0].checked = false;	// 食糧知識
	var checkbox = $a('//input[@id="OPT_DOME11"]'); checkbox[0].checked = false;	// 食糧技術
	var checkbox = $a('//input[@id="OPT_DOME12"]'); checkbox[0].checked = false;	// 農林知識		2013.01.10 変更
	var checkbox = $a('//input[@id="OPT_DOME13"]'); checkbox[0].checked = false;	// 農林技術		2013.01.10 変更
	var checkbox = $a('//input[@id="OPT_DOME14"]'); checkbox[0].checked = false;	// 加工知識
	var checkbox = $a('//input[@id="OPT_DOME15"]'); checkbox[0].checked = false;	// 加工技術
	var checkbox = $a('//input[@id="OPT_DOME16"]'); checkbox[0].checked = false;	// 富国 		2013.01.10 変更
	var checkbox = $a('//input[@id="OPT_DOME17"]'); checkbox[0].checked = false;	// 富国論		2013.01.10 変更
	var checkbox = $a('//input[@id="OPT_DOME18"]'); checkbox[0].checked = false;	// 富国強兵
	var checkbox = $a('//input[@id="OPT_DOME19"]'); checkbox[0].checked = false;	// 豊穣 		2013.01.10 変更
	var checkbox = $a('//input[@id="OPT_DOME20"]'); checkbox[0].checked = false;	// 美玉歌舞
	var checkbox = $a('//input[@id="OPT_DOME21"]'); checkbox[0].checked = false;	// 恵風
	var checkbox = $a('//input[@id="OPT_DOME22"]'); checkbox[0].checked = false;	// 人選眼力		2013.01.10 変更
	var checkbox = $a('//input[@id="OPT_DOME23"]'); checkbox[0].checked = false;	// 呉の治世
	var checkbox = $a('//input[@id="OPT_DOME24"]'); checkbox[0].checked = false;	// 王佐の才
	var checkbox = $a('//input[@id="OPT_DOME25"]'); checkbox[0].checked = false;	// 練兵訓練
	var checkbox = $a('//input[@id="OPT_DOME26"]'); checkbox[0].checked = false;	// 　　修練
	var checkbox = $a('//input[@id="OPT_DOME27"]'); checkbox[0].checked = false;	// 兵舎訓練
	var checkbox = $a('//input[@id="OPT_DOME28"]'); checkbox[0].checked = false;	// 　　修練
	var checkbox = $a('//input[@id="OPT_DOME29"]'); checkbox[0].checked = false;	// 弓兵訓練
	var checkbox = $a('//input[@id="OPT_DOME30"]'); checkbox[0].checked = false;	// 　　修練
	var checkbox = $a('//input[@id="OPT_DOME31"]'); checkbox[0].checked = false;	// 厩舎訓練
	var checkbox = $a('//input[@id="OPT_DOME32"]'); checkbox[0].checked = false;	// 　　修練
	var checkbox = $a('//input[@id="OPT_DOME33"]'); checkbox[0].checked = false;	// 兵器訓練
	var checkbox = $a('//input[@id="OPT_DOME34"]'); checkbox[0].checked = false;	// 　　修練
	var checkbox = $a('//input[@id="OPT_DOME35"]'); checkbox[0].checked = false;	// 強兵の檄文
	var checkbox = $a('//input[@id="OPT_DOME36"]'); checkbox[0].checked = false;	// 攻城の檄文
	var checkbox = $a('//input[@id="OPT_DOME37"]'); checkbox[0].checked = false;	// 豊潤祈祷
	// 糧村オプション
	var checkbox = $a('//input[@id="OPT_KATEMURA"]');	checkbox[0].checked = true; // 糧村化
	var textbox  = $a('//input[@id="OPT_SOUKO_MAX"]');	textbox[0].value	= 5;
	clearWaterwheelBox(); // 水車村オプション
	// 宿舎村オプション
	var checkbox = $a('//input[@id="OPT_DORM"]');		checkbox[0].checked = false; // 宿舎村化 2013.12.26
	// 市場自動変換
	try {
		var checkbox = $a('//input[@id="OPT_ICHIBA"]'); 	checkbox[0].checked = true;
		var combobox = $a('//select[@id="OPT_ICHIBA_PA"]'); 	combobox[0].value	= "平均的に変換";
		var textbox  = $a('//input[@id="OPT_RISE_MAX"]');	textbox[0].value	= 8000;
		var textbox  = $a('//input[@id="OPT_TO_WOOD"]');	textbox[0].value	= 4000;
		var textbox  = $a('//input[@id="OPT_TO_STONE"]');	textbox[0].value	= 4000;
		var textbox  = $a('//input[@id="OPT_TO_IRON"]');	textbox[0].value	= 4000;
	} catch(e) {
	}
	// 自動造兵
	var checkbox = $a('//input[@id="OPT_BLD_SOL"]');	checkbox[0].checked = false;
	// 自動武器・防具強化
	var checkbox = $a('//input[@id="OPT_BKBG_CHK"]');	checkbox[0].checked = false;


}

function InitResVillage(){			// 2013.12.18
	// 城②
	clearInifacBox();
	var checkbox = $a('//input[@id="OPT_CHKBOX0"]');   checkbox[0].checked = true;	// 拠点
	var checkbox = $a('//input[@id="OPT_CHKBOX1"]');   checkbox[0].checked = true;	// 伐採所
	var checkbox = $a('//input[@id="OPT_CHKBOX2"]');   checkbox[0].checked = true;	// 石切り場
	var checkbox = $a('//input[@id="OPT_CHKBOX3"]');   checkbox[0].checked = true;	// 製鉄所
	var checkbox = $a('//input[@id="OPT_CHKBOX4"]');   checkbox[0].checked = true;	// 畑
	var checkbox = $a('//input[@id="OPT_CHKBOX5"]');   checkbox[0].checked = true;	// 倉庫
	var checkbox = $a('//input[@id="OPT_CHKBOX6"]');   checkbox[0].checked = true;	// 銅雀台
	var checkbox = $a('//input[@id="OPT_CHKBOX16"]');  checkbox[0].checked = true;	// 市場

	var textbox = $a('//input[@id="OPT_CHKBOXLV0"]');	textbox[0].value = 10;	// 拠点
	var textbox = $a('//input[@id="OPT_CHKBOXLV1"]');	textbox[0].value = 12;	// 伐採所
	var textbox = $a('//input[@id="OPT_CHKBOXLV2"]');	textbox[0].value = 12;	// 石切り場
	var textbox = $a('//input[@id="OPT_CHKBOXLV3"]');	textbox[0].value = 12;	// 製鉄所
	var textbox = $a('//input[@id="OPT_CHKBOXLV4"]');	textbox[0].value = 12;	// 畑
	var textbox = $a('//input[@id="OPT_CHKBOXLV5"]');	textbox[0].value = 15;	// 倉庫
	var textbox = $a('//input[@id="OPT_CHKBOXLV6"]');	textbox[0].value = 7;	// 銅雀台
	var textbox = $a('//input[@id="OPT_CHKBOXLV15"]');	textbox[0].value = 10;	// 市場

	// 内政設定
	var checkbox = $a('//input[@id="OPT_DOME1"]');	checkbox[0].checked = false;	// 伐採知識
	var checkbox = $a('//input[@id="OPT_DOME2"]');	checkbox[0].checked = false;	// 伐採技術
	var checkbox = $a('//input[@id="OPT_DOME3"]');	checkbox[0].checked = false;	// 弓兵増強
	var checkbox = $a('//input[@id="OPT_DOME4"]');	checkbox[0].checked = false;	// 石切知識
	var checkbox = $a('//input[@id="OPT_DOME5"]');	checkbox[0].checked = false;	// 石切技術
	var checkbox = $a('//input[@id="OPT_DOME6"]');	checkbox[0].checked = false;	// 槍兵増強
	var checkbox = $a('//input[@id="OPT_DOME7"]');	checkbox[0].checked = false;	// 製鉄知識
	var checkbox = $a('//input[@id="OPT_DOME8"]');	checkbox[0].checked = false;	// 製鉄技術
	var checkbox = $a('//input[@id="OPT_DOME9"]');	checkbox[0].checked = false;	// 騎兵増強
	var checkbox = $a('//input[@id="OPT_DOME10"]'); checkbox[0].checked = false;	// 食糧知識
	var checkbox = $a('//input[@id="OPT_DOME11"]'); checkbox[0].checked = false;	// 食糧技術
	var checkbox = $a('//input[@id="OPT_DOME12"]'); checkbox[0].checked = false;	// 農林知識
	var checkbox = $a('//input[@id="OPT_DOME13"]'); checkbox[0].checked = false;	// 農林技術
	var checkbox = $a('//input[@id="OPT_DOME14"]'); checkbox[0].checked = false;	// 加工知識
	var checkbox = $a('//input[@id="OPT_DOME15"]'); checkbox[0].checked = false;	// 加工技術
	var checkbox = $a('//input[@id="OPT_DOME16"]'); checkbox[0].checked = false;	// 富国
	var checkbox = $a('//input[@id="OPT_DOME17"]'); checkbox[0].checked = false;	// 富国論
	var checkbox = $a('//input[@id="OPT_DOME18"]'); checkbox[0].checked = false;	// 富国強兵
	var checkbox = $a('//input[@id="OPT_DOME19"]'); checkbox[0].checked = false;	// 豊穣
	var checkbox = $a('//input[@id="OPT_DOME20"]'); checkbox[0].checked = false;	// 美玉歌舞
	var checkbox = $a('//input[@id="OPT_DOME21"]'); checkbox[0].checked = false;	// 恵風
	var checkbox = $a('//input[@id="OPT_DOME22"]'); checkbox[0].checked = false;	// 人選眼力
	var checkbox = $a('//input[@id="OPT_DOME23"]'); checkbox[0].checked = false;	// 呉の治世
	var checkbox = $a('//input[@id="OPT_DOME24"]'); checkbox[0].checked = false;	// 王佐の才
	var checkbox = $a('//input[@id="OPT_DOME25"]'); checkbox[0].checked = false;	// 練兵訓練
	var checkbox = $a('//input[@id="OPT_DOME26"]'); checkbox[0].checked = false;	// 　　修練
	var checkbox = $a('//input[@id="OPT_DOME27"]'); checkbox[0].checked = false;	// 兵舎訓練
	var checkbox = $a('//input[@id="OPT_DOME28"]'); checkbox[0].checked = false;	// 　　修練
	var checkbox = $a('//input[@id="OPT_DOME29"]'); checkbox[0].checked = false;	// 弓兵訓練
	var checkbox = $a('//input[@id="OPT_DOME30"]'); checkbox[0].checked = false;	// 　　修練
	var checkbox = $a('//input[@id="OPT_DOME31"]'); checkbox[0].checked = false;	// 厩舎訓練
	var checkbox = $a('//input[@id="OPT_DOME32"]'); checkbox[0].checked = false;	// 　　修練
	var checkbox = $a('//input[@id="OPT_DOME33"]'); checkbox[0].checked = false;	// 兵器訓練
	var checkbox = $a('//input[@id="OPT_DOME34"]'); checkbox[0].checked = false;	// 　　修練
	var checkbox = $a('//input[@id="OPT_DOME35"]'); checkbox[0].checked = false;	// 強兵の檄文
	var checkbox = $a('//input[@id="OPT_DOME36"]'); checkbox[0].checked = false;	// 攻城の檄文
	var checkbox = $a('//input[@id="OPT_DOME37"]'); checkbox[0].checked = false;	// 豊潤祈祷
	// 糧村オプション
	var checkbox = $a('//input[@id="OPT_KATEMURA"]');	checkbox[0].checked = true; // 糧村化
	var textbox  = $a('//input[@id="OPT_SOUKO_MAX"]');	textbox[0].value	= 5;
	clearWaterwheelBox(); // 水車村オプション
	// 宿舎村オプション
	var checkbox = $a('//input[@id="OPT_DORM"]');		checkbox[0].checked = false; // 宿舎村化 2013.12.26
	try {
		// 市場自動変換
		var checkbox = $a('//input[@id="OPT_ICHIBA"]'); 	checkbox[0].checked = true;
		var combobox = $a('//select[@id="OPT_ICHIBA_PA"]'); 	combobox[0].value	= "平均的に変換";
		var textbox  = $a('//input[@id="OPT_RISE_MAX"]');	textbox[0].value	= 50000;
		var textbox  = $a('//input[@id="OPT_TO_WOOD"]');	textbox[0].value	= 20000;
		var textbox  = $a('//input[@id="OPT_TO_STONE"]');	textbox[0].value	= 20000;
		var textbox  = $a('//input[@id="OPT_TO_IRON"]');	textbox[0].value	= 20000;
	} catch(e) {
	}
	// 自動造兵
	var checkbox = $a('//input[@id="OPT_BLD_SOL"]');	checkbox[0].checked = false;
	// 自動武器・防具強化
	var checkbox = $a('//input[@id="OPT_BKBG_CHK"]');	checkbox[0].checked = false;
}

function InitMilitarySite(){			// 2013.12.18
	// 砦
	clearInifacBox();
	var checkbox = $a('//input[@id="OPT_CHKBOX7"]');   checkbox[0].checked = true;	// 鍛冶場
	var checkbox = $a('//input[@id="OPT_CHKBOX9"]');   checkbox[0].checked = true;	// 練兵所
	var checkbox = $a('//input[@id="OPT_CHKBOX13"]');  checkbox[0].checked = true;	// 宿舎

	var textbox = $a('//input[@id="OPT_CHKBOXLV7"]');	textbox[0].value =	5;	// 鍛冶場
	var textbox = $a('//input[@id="OPT_CHKBOXLV9"]');	textbox[0].value = 10;	// 訓練所
	var textbox = $a('//input[@id="OPT_CHKBOXLV13"]');	textbox[0].value = 13;	// 宿舎

	// 内政設定
	var checkbox = $a('//input[@id="OPT_DOME1"]');	checkbox[0].checked = false;	// 伐採知識
	var checkbox = $a('//input[@id="OPT_DOME2"]');	checkbox[0].checked = false;	// 伐採技術
	var checkbox = $a('//input[@id="OPT_DOME3"]');	checkbox[0].checked = false;	// 弓兵増強
	var checkbox = $a('//input[@id="OPT_DOME4"]');	checkbox[0].checked = false;	// 石切知識
	var checkbox = $a('//input[@id="OPT_DOME5"]');	checkbox[0].checked = false;	// 石切技術
	var checkbox = $a('//input[@id="OPT_DOME6"]');	checkbox[0].checked = false;	// 槍兵増強
	var checkbox = $a('//input[@id="OPT_DOME7"]');	checkbox[0].checked = false;	// 製鉄知識
	var checkbox = $a('//input[@id="OPT_DOME8"]');	checkbox[0].checked = false;	// 製鉄技術
	var checkbox = $a('//input[@id="OPT_DOME9"]');	checkbox[0].checked = false;	// 騎兵増強
	var checkbox = $a('//input[@id="OPT_DOME10"]'); checkbox[0].checked = false;	// 食糧知識
	var checkbox = $a('//input[@id="OPT_DOME11"]'); checkbox[0].checked = false;	// 食糧技術
	var checkbox = $a('//input[@id="OPT_DOME12"]'); checkbox[0].checked = false;	// 農林知識
	var checkbox = $a('//input[@id="OPT_DOME13"]'); checkbox[0].checked = false;	// 農林技術
	var checkbox = $a('//input[@id="OPT_DOME14"]'); checkbox[0].checked = false;	// 加工知識
	var checkbox = $a('//input[@id="OPT_DOME15"]'); checkbox[0].checked = false;	// 加工技術
	var checkbox = $a('//input[@id="OPT_DOME16"]'); checkbox[0].checked = false;	// 富国
	var checkbox = $a('//input[@id="OPT_DOME17"]'); checkbox[0].checked = false;	// 富国論
	var checkbox = $a('//input[@id="OPT_DOME18"]'); checkbox[0].checked = false;	// 富国強兵
	var checkbox = $a('//input[@id="OPT_DOME19"]'); checkbox[0].checked = false;	// 豊穣
	var checkbox = $a('//input[@id="OPT_DOME20"]'); checkbox[0].checked = false;	// 美玉歌舞
	var checkbox = $a('//input[@id="OPT_DOME21"]'); checkbox[0].checked = false;	// 恵風
	var checkbox = $a('//input[@id="OPT_DOME22"]'); checkbox[0].checked = false;	// 人選眼力
	var checkbox = $a('//input[@id="OPT_DOME23"]'); checkbox[0].checked = false;	// 呉の治世
	var checkbox = $a('//input[@id="OPT_DOME24"]'); checkbox[0].checked = false;	// 王佐の才
	var checkbox = $a('//input[@id="OPT_DOME25"]'); checkbox[0].checked = false;	// 練兵訓練
	var checkbox = $a('//input[@id="OPT_DOME26"]'); checkbox[0].checked = false;	// 　　修練
	var checkbox = $a('//input[@id="OPT_DOME27"]'); checkbox[0].checked = false;	// 兵舎訓練
	var checkbox = $a('//input[@id="OPT_DOME28"]'); checkbox[0].checked = false;	// 　　修練
	var checkbox = $a('//input[@id="OPT_DOME29"]'); checkbox[0].checked = false;	// 弓兵訓練
	var checkbox = $a('//input[@id="OPT_DOME30"]'); checkbox[0].checked = false;	// 　　修練
	var checkbox = $a('//input[@id="OPT_DOME31"]'); checkbox[0].checked = false;	// 厩舎訓練
	var checkbox = $a('//input[@id="OPT_DOME32"]'); checkbox[0].checked = false;	// 　　修練
	var checkbox = $a('//input[@id="OPT_DOME33"]'); checkbox[0].checked = false;	// 兵器訓練
	var checkbox = $a('//input[@id="OPT_DOME34"]'); checkbox[0].checked = false;	// 　　修練
	var checkbox = $a('//input[@id="OPT_DOME35"]'); checkbox[0].checked = false;	// 強兵の檄文
	var checkbox = $a('//input[@id="OPT_DOME36"]'); checkbox[0].checked = false;	// 攻城の檄文
	var checkbox = $a('//input[@id="OPT_DOME37"]'); checkbox[0].checked = false;	// 豊潤祈祷
	// 糧村オプション
	var checkbox = $a('//input[@id="OPT_KATEMURA"]');	checkbox[0].checked = false; // 糧村化
	var textbox  = $a('//input[@id="OPT_SOUKO_MAX"]');	textbox[0].value	= 0;
	clearWaterwheelBox(); // 水車村オプション
	// 宿舎村オプション
	var checkbox = $a('//input[@id="OPT_DORM"]');		checkbox[0].checked = true; // 宿舎村化 2013.12.26
	// 自動造兵
	var checkbox = $a('//input[@id="OPT_BLD_SOL"]');	checkbox[0].checked = true;

	var textbox = $a('//input[@id="OPT_SOL_MAX1"]');	textbox[0].value	= 10000;
	var textbox = $a('//input[@id="OPT_SOL_MAX3"]');	textbox[0].value	= 0;
	var textbox = $a('//input[@id="OPT_SOL_MAX8"]');	textbox[0].value	= 0;
	var textbox = $a('//input[@id="OPT_SOL_MAX5"]');	textbox[0].value	= 0;
	var textbox = $a('//input[@id="OPT_SOL_MAX4"]');	textbox[0].value	= 0;
	var textbox = $a('//input[@id="OPT_SOL_MAX9"]');	textbox[0].value	= 0;
	var textbox = $a('//input[@id="OPT_SOL_MAX7"]');	textbox[0].value	= 0;
	var textbox = $a('//input[@id="OPT_SOL_MAX10"]');	textbox[0].value	= 0;
	var textbox = $a('//input[@id="OPT_SOL_MAX11"]');	textbox[0].value	= 0;
	var textbox = $a('//input[@id="OPT_SOL_MAX12"]');	textbox[0].value	= 0;
	var textbox = $a('//input[@id="OPT_SOL_MAX13"]');	textbox[0].value	= 0;
	var textbox = $a('//input[@id="OPT_SOL_MAX15"]');	textbox[0].value	= 0;
	var textbox = $a('//input[@id="OPT_SOL_MAX16"]');	textbox[0].value	= 0;
	var textbox = $a('//input[@id="OPT_SOL_MAX17"]');	textbox[0].value	= 0;

	var textbox = $a('//input[@id="OPT_SOL_ADD1"]');	textbox[0].value	= 50;
	var textbox = $a('//input[@id="OPT_SOL_ADD3"]');	textbox[0].value	= 0;
	var textbox = $a('//input[@id="OPT_SOL_ADD8"]');	textbox[0].value	= 0;
	var textbox = $a('//input[@id="OPT_SOL_ADD5"]');	textbox[0].value	= 0;
	var textbox = $a('//input[@id="OPT_SOL_ADD4"]');	textbox[0].value	= 0;
	var textbox = $a('//input[@id="OPT_SOL_ADD9"]');	textbox[0].value	= 0;
	var textbox = $a('//input[@id="OPT_SOL_ADD7"]');	textbox[0].value	= 0;
	var textbox = $a('//input[@id="OPT_SOL_ADD10"]');	textbox[0].value	= 0;
	var textbox = $a('//input[@id="OPT_SOL_ADD11"]');	textbox[0].value	= 0;
	var textbox = $a('//input[@id="OPT_SOL_ADD12"]');	textbox[0].value	= 0;
	var textbox = $a('//input[@id="OPT_SOL_ADD13"]');	textbox[0].value	= 0;
	var textbox = $a('//input[@id="OPT_SOL_ADD15"]');	textbox[0].value	= 0;
	var textbox = $a('//input[@id="OPT_SOL_ADD16"]');	textbox[0].value	= 0;
	var textbox = $a('//input[@id="OPT_SOL_ADD17"]');	textbox[0].value	= 0;

	// 自動武器・防具強化
	var checkbox = $a('//input[@id="OPT_BKBG_CHK"]');	checkbox[0].checked = true;

	var textbox = $a('//input[@id="OPT_BK_LV1"]');		textbox[0].value	= 10;
	var textbox = $a('//input[@id="OPT_BK_LV3"]');		textbox[0].value	= 0;
	var textbox = $a('//input[@id="OPT_BK_LV8"]');		textbox[0].value	= 0;
	var textbox = $a('//input[@id="OPT_BK_LV4"]');		textbox[0].value	= 0;
	var textbox = $a('//input[@id="OPT_BK_LV5"]');		textbox[0].value	= 0;
	var textbox = $a('//input[@id="OPT_BK_LV9"]');		textbox[0].value	= 0;
	var textbox = $a('//input[@id="OPT_BK_LV7"]');		textbox[0].value	= 0;
	var textbox = $a('//input[@id="OPT_BK_LV12"]'); 	textbox[0].value	= 0;
	var textbox = $a('//input[@id="OPT_BK_LV13"]'); 	textbox[0].value	= 0;
	var textbox = $a('//input[@id="OPT_BK_LV14"]'); 	textbox[0].value	= 0;
	var textbox = $a('//input[@id="OPT_BK_LV15"]'); 	textbox[0].value	= 0;
	var textbox = $a('//input[@id="OPT_BK_LV16"]'); 	textbox[0].value	= 0;

	var textbox = $a('//input[@id="OPT_BG_LV1"]');		textbox[0].value	= 0;
	var textbox = $a('//input[@id="OPT_BG_LV3"]');		textbox[0].value	= 0;
	var textbox = $a('//input[@id="OPT_BG_LV8"]');		textbox[0].value	= 0;
	var textbox = $a('//input[@id="OPT_BG_LV4"]');		textbox[0].value	= 0;
	var textbox = $a('//input[@id="OPT_BG_LV5"]');		textbox[0].value	= 0;
	var textbox = $a('//input[@id="OPT_BG_LV9"]');		textbox[0].value	= 0;
	var textbox = $a('//input[@id="OPT_BG_LV7"]');		textbox[0].value	= 0;
	var textbox = $a('//input[@id="OPT_BG_LV10"]'); 	textbox[0].value	= 0;
	var textbox = $a('//input[@id="OPT_BG_LV11"]'); 	textbox[0].value	= 0;
	var textbox = $a('//input[@id="OPT_BG_LV12"]'); 	textbox[0].value	= 0;
	var textbox = $a('//input[@id="OPT_BG_LV13"]'); 	textbox[0].value	= 0;
	var textbox = $a('//input[@id="OPT_BG_LV14"]'); 	textbox[0].value	= 0;
	var textbox = $a('//input[@id="OPT_BG_LV15"]'); 	textbox[0].value	= 0;
	var textbox = $a('//input[@id="OPT_BG_LV16"]'); 	textbox[0].value	= 0;

}

function InitRiceSite(){			// 2013.12.26
	// 糧村
	clearInifacBox();
	var checkbox = $a('//input[@id="OPT_CHKBOX0"]');   checkbox[0].checked = true;	// 拠点
	var checkbox = $a('//input[@id="OPT_CHKBOX4"]');   checkbox[0].checked = true;	// 畑

	var textbox = $a('//input[@id="OPT_CHKBOXLV0"]');	textbox[0].value =	5;		// 拠点
	var textbox = $a('//input[@id="OPT_CHKBOXLV4"]');	textbox[0].value = 12;		// 訓練所

	// 内政設定
	var checkbox = $a('//input[@id="OPT_DOME1"]');	checkbox[0].checked = false;	// 伐採知識
	var checkbox = $a('//input[@id="OPT_DOME2"]');	checkbox[0].checked = false;	// 伐採技術
	var checkbox = $a('//input[@id="OPT_DOME3"]');	checkbox[0].checked = false;	// 弓兵増強
	var checkbox = $a('//input[@id="OPT_DOME4"]');	checkbox[0].checked = false;	// 石切知識
	var checkbox = $a('//input[@id="OPT_DOME5"]');	checkbox[0].checked = false;	// 石切技術
	var checkbox = $a('//input[@id="OPT_DOME6"]');	checkbox[0].checked = false;	// 槍兵増強
	var checkbox = $a('//input[@id="OPT_DOME7"]');	checkbox[0].checked = false;	// 製鉄知識
	var checkbox = $a('//input[@id="OPT_DOME8"]');	checkbox[0].checked = false;	// 製鉄技術
	var checkbox = $a('//input[@id="OPT_DOME9"]');	checkbox[0].checked = false;	// 騎兵増強
	var checkbox = $a('//input[@id="OPT_DOME10"]'); checkbox[0].checked = true;		// 食糧知識
	var checkbox = $a('//input[@id="OPT_DOME11"]'); checkbox[0].checked = true;		// 食糧技術
	var checkbox = $a('//input[@id="OPT_DOME12"]'); checkbox[0].checked = false;	// 農林知識
	var checkbox = $a('//input[@id="OPT_DOME13"]'); checkbox[0].checked = false;	// 農林技術
	var checkbox = $a('//input[@id="OPT_DOME14"]'); checkbox[0].checked = false;	// 加工知識
	var checkbox = $a('//input[@id="OPT_DOME15"]'); checkbox[0].checked = false;	// 加工技術
	var checkbox = $a('//input[@id="OPT_DOME16"]'); checkbox[0].checked = false;	// 富国
	var checkbox = $a('//input[@id="OPT_DOME17"]'); checkbox[0].checked = false;	// 富国論
	var checkbox = $a('//input[@id="OPT_DOME18"]'); checkbox[0].checked = false;	// 富国強兵
	var checkbox = $a('//input[@id="OPT_DOME19"]'); checkbox[0].checked = false;	// 豊穣
	var checkbox = $a('//input[@id="OPT_DOME20"]'); checkbox[0].checked = false;	// 美玉歌舞
	var checkbox = $a('//input[@id="OPT_DOME21"]'); checkbox[0].checked = false;	// 恵風
	var checkbox = $a('//input[@id="OPT_DOME22"]'); checkbox[0].checked = false;	// 人選眼力
	var checkbox = $a('//input[@id="OPT_DOME23"]'); checkbox[0].checked = false;	// 呉の治世
	var checkbox = $a('//input[@id="OPT_DOME24"]'); checkbox[0].checked = false;	// 王佐の才
	var checkbox = $a('//input[@id="OPT_DOME25"]'); checkbox[0].checked = false;	// 練兵訓練
	var checkbox = $a('//input[@id="OPT_DOME26"]'); checkbox[0].checked = false;	// 　　修練
	var checkbox = $a('//input[@id="OPT_DOME27"]'); checkbox[0].checked = false;	// 兵舎訓練
	var checkbox = $a('//input[@id="OPT_DOME28"]'); checkbox[0].checked = false;	// 　　修練
	var checkbox = $a('//input[@id="OPT_DOME29"]'); checkbox[0].checked = false;	// 弓兵訓練
	var checkbox = $a('//input[@id="OPT_DOME30"]'); checkbox[0].checked = false;	// 　　修練
	var checkbox = $a('//input[@id="OPT_DOME31"]'); checkbox[0].checked = false;	// 厩舎訓練
	var checkbox = $a('//input[@id="OPT_DOME32"]'); checkbox[0].checked = false;	// 　　修練
	var checkbox = $a('//input[@id="OPT_DOME33"]'); checkbox[0].checked = false;	// 兵器訓練
	var checkbox = $a('//input[@id="OPT_DOME34"]'); checkbox[0].checked = false;	// 　　修練
	var checkbox = $a('//input[@id="OPT_DOME35"]'); checkbox[0].checked = false;	// 強兵の檄文
	var checkbox = $a('//input[@id="OPT_DOME36"]'); checkbox[0].checked = false;	// 攻城の檄文
	var checkbox = $a('//input[@id="OPT_DOME37"]'); checkbox[0].checked = false;	// 豊潤祈祷
	// 糧村オプション
	var checkbox = $a('//input[@id="OPT_KATEMURA"]');	checkbox[0].checked = true; // 糧村化
	var textbox  = $a('//input[@id="OPT_SOUKO_MAX"]');	textbox[0].value	= 0;
	clearWaterwheelBox(); // 水車村オプション
	// 宿舎村オプション
	var checkbox = $a('//input[@id="OPT_DORM"]');		checkbox[0].checked = false; // 宿舎村化 2013.12.26
}

function InitPreset_01(){			// 2014.03.05
	// 城
	clearInifacBox();
	var checkbox = $a('//input[@id="OPT_CHKBOX0"]');   checkbox[0].checked = false; 		// 拠点
	var checkbox = $a('//input[@id="OPT_CHKBOX1"]');   checkbox[0].checked = true;			// 伐採所
	var checkbox = $a('//input[@id="OPT_CHKBOX2"]');   checkbox[0].checked = true;			// 石切り場
	var checkbox = $a('//input[@id="OPT_CHKBOX3"]');   checkbox[0].checked = true;			// 製鉄所
	var checkbox = $a('//input[@id="OPT_CHKBOX4"]');   checkbox[0].checked = true;			// 畑
	var checkbox = $a('//input[@id="OPT_CHKBOX5"]');   checkbox[0].checked = true;			// 倉庫
	var checkbox = $a('//input[@id="OPT_CHKBOX6"]');   checkbox[0].checked = false; 		// 銅雀台
	var checkbox = $a('//input[@id="OPT_CHKBOX7"]');   checkbox[0].checked = false; 		// 鍛冶場
	var checkbox = $a('//input[@id="OPT_CHKBOX8"]');   checkbox[0].checked = false; 		// 防具工場
	var checkbox = $a('//input[@id="OPT_CHKBOX9"]');   checkbox[0].checked = false; 		// 練兵所
	var checkbox = $a('//input[@id="OPT_CHKBOX10"]');  checkbox[0].checked = false; 		// 兵舎
	var checkbox = $a('//input[@id="OPT_CHKBOX11"]');  checkbox[0].checked = false; 		// 弓兵舎
	var checkbox = $a('//input[@id="OPT_CHKBOX12"]');  checkbox[0].checked = false; 		// 厩舎
	var checkbox = $a('//input[@id="OPT_CHKBOX13"]');  checkbox[0].checked = false; 		// 宿舎
	var checkbox = $a('//input[@id="OPT_CHKBOX14"]');  checkbox[0].checked = false; 		// 兵器工房
	var checkbox = $a('//input[@id="OPT_CHKBOX15"]');  checkbox[0].checked = true;			// 市場
	var checkbox = $a('//input[@id="OPT_CHKBOX16"]');  checkbox[0].checked = false; 		// 訓練所
	var checkbox = $a('//input[@id="OPT_CHKBOX17"]');  checkbox[0].checked = false; 		// 水車
	var checkbox = $a('//input[@id="OPT_CHKBOX18"]');  checkbox[0].checked = false; 		// 工場
	var checkbox = $a('//input[@id="OPT_CHKBOX19"]');  checkbox[0].checked = false; 		// 研究所
	var checkbox = $a('//input[@id="OPT_CHKBOX20"]');  checkbox[0].checked = false; 		// 大宿舎
	var checkbox = $a('//input[@id="OPT_CHKBOX21"]');  checkbox[0].checked = false; 		// 遠征訓練所
	var checkbox = $a('//input[@id="OPT_CHKBOX22"]');  checkbox[0].checked = false; 		// 見張り台

	var textbox = $a('//input[@id="OPT_CHKBOXLV1"]');	textbox[0].value =	8;				// 伐採所
	var textbox = $a('//input[@id="OPT_CHKBOXLV2"]');	textbox[0].value =	8;				// 石切り場
	var textbox = $a('//input[@id="OPT_CHKBOXLV3"]');	textbox[0].value =	8;				// 製鉄所
	var textbox = $a('//input[@id="OPT_CHKBOXLV4"]');	textbox[0].value =	8;				// 畑
	var textbox = $a('//input[@id="OPT_CHKBOXLV5"]');	textbox[0].value =	10; 			// 倉庫
	var textbox = $a('//input[@id="OPT_CHKBOXLV15"]');	textbox[0].value =	5;				// 市場

	// 内政設定
	var checkbox = $a('//input[@id="OPT_DOME1"]');	 checkbox[0].checked = true;			// 伐採知識
	var checkbox = $a('//input[@id="OPT_DOME2"]');	 checkbox[0].checked = true;			// 伐採技術
	var checkbox = $a('//input[@id="OPT_DOME3"]');	 checkbox[0].checked = true;			// 弓兵増強
	var checkbox = $a('//input[@id="OPT_DOME4"]');	 checkbox[0].checked = true;			// 石切知識
	var checkbox = $a('//input[@id="OPT_DOME5"]');	 checkbox[0].checked = true;			// 石切技術
	var checkbox = $a('//input[@id="OPT_DOME6"]');	 checkbox[0].checked = true;			// 槍兵増強
	var checkbox = $a('//input[@id="OPT_DOME7"]');	 checkbox[0].checked = true;			// 製鉄知識
	var checkbox = $a('//input[@id="OPT_DOME8"]');	 checkbox[0].checked = true;			// 製鉄技術
	var checkbox = $a('//input[@id="OPT_DOME9"]');	 checkbox[0].checked = true;			// 騎兵増強
	var checkbox = $a('//input[@id="OPT_DOME10"]');  checkbox[0].checked = true;			// 食糧知識
	var checkbox = $a('//input[@id="OPT_DOME11"]');  checkbox[0].checked = true;			// 食糧技術
	var checkbox = $a('//input[@id="OPT_DOME12"]');  checkbox[0].checked = true;			// 農林知識
	var checkbox = $a('//input[@id="OPT_DOME13"]');  checkbox[0].checked = true;			// 農林技術
	var checkbox = $a('//input[@id="OPT_DOME14"]');  checkbox[0].checked = true;			// 加工知識
	var checkbox = $a('//input[@id="OPT_DOME15"]');  checkbox[0].checked = true;			// 加工技術
	var checkbox = $a('//input[@id="OPT_DOME16"]');  checkbox[0].checked = true;			// 富国
	var checkbox = $a('//input[@id="OPT_DOME17"]');  checkbox[0].checked = true;			// 富国論
	var checkbox = $a('//input[@id="OPT_DOME18"]');  checkbox[0].checked = true;			// 富国強兵
	var checkbox = $a('//input[@id="OPT_DOME19"]');  checkbox[0].checked = true;			// 豊穣
	var checkbox = $a('//input[@id="OPT_DOME20"]');  checkbox[0].checked = true;			// 美玉歌舞
	var checkbox = $a('//input[@id="OPT_DOME21"]');  checkbox[0].checked = true;			// 恵風
	var checkbox = $a('//input[@id="OPT_DOME22"]');  checkbox[0].checked = true;			// 人選眼力
	var checkbox = $a('//input[@id="OPT_DOME23"]');  checkbox[0].checked = true;			// 呉の治世
	var checkbox = $a('//input[@id="OPT_DOME24"]');  checkbox[0].checked = true;			// 王佐の才
	var checkbox = $a('//input[@id="OPT_DOME25"]');  checkbox[0].checked = true;			// 練兵訓練
	var checkbox = $a('//input[@id="OPT_DOME26"]');  checkbox[0].checked = true;			// 　　修練
	var checkbox = $a('//input[@id="OPT_DOME27"]');  checkbox[0].checked = true;			// 兵舎訓練
	var checkbox = $a('//input[@id="OPT_DOME28"]');  checkbox[0].checked = true;			// 　　修練
	var checkbox = $a('//input[@id="OPT_DOME29"]');  checkbox[0].checked = true;			// 弓兵訓練
	var checkbox = $a('//input[@id="OPT_DOME30"]');  checkbox[0].checked = true;			// 　　修練
	var checkbox = $a('//input[@id="OPT_DOME31"]');  checkbox[0].checked = true;			// 厩舎訓練
	var checkbox = $a('//input[@id="OPT_DOME32"]');  checkbox[0].checked = true;			// 　　修練
	var checkbox = $a('//input[@id="OPT_DOME33"]');  checkbox[0].checked = true;			// 兵器訓練
	var checkbox = $a('//input[@id="OPT_DOME34"]');  checkbox[0].checked = true;			// 　　修練
	var checkbox = $a('//input[@id="OPT_DOME35"]');  checkbox[0].checked = true;			// 強兵の檄文
	var checkbox = $a('//input[@id="OPT_DOME36"]');  checkbox[0].checked = true;			// 攻城の檄文
	var checkbox = $a('//input[@id="OPT_DOME37"]');  checkbox[0].checked = true;			// 豊潤祈祷
	// 糧村オプション
	var checkbox = $a('//input[@id="OPT_DORM"]');		checkbox[0].checked = false;		//
	var checkbox = $a('//input[@id="OPT_KATEMURA"]');	checkbox[0].checked = true; 		// 糧村化
	var textbox  = $a('//input[@id="OPT_SOUKO_MAX"]');	textbox[0].value	= 3;
	clearWaterwheelBox(); // 水車村オプション
}

function InitPreset_02(){			// 2014.03.05
	// 糧村
	clearInifacBox();
	var checkbox = $a('//input[@id="OPT_CHKBOX0"]');   checkbox[0].checked = false; 		// 拠点
	var checkbox = $a('//input[@id="OPT_CHKBOX4"]');   checkbox[0].checked = true;			// 畑

	var textbox = $a('//input[@id="OPT_CHKBOXLV0"]');	textbox[0].value =	5;				// 拠点
	var textbox = $a('//input[@id="OPT_CHKBOXLV4"]');	textbox[0].value =	8;				// 畑

	// 内政設定
	var checkbox = $a('//input[@id="OPT_DOME10"]');  checkbox[0].checked = true;			// 食糧知識
	var checkbox = $a('//input[@id="OPT_DOME11"]');  checkbox[0].checked = true;			// 食糧技術
	var checkbox = $a('//input[@id="OPT_DOME12"]');  checkbox[0].checked = true;			// 農林知識
	var checkbox = $a('//input[@id="OPT_DOME13"]');  checkbox[0].checked = true;			// 農林技術
	var checkbox = $a('//input[@id="OPT_DOME23"]');  checkbox[0].checked = true;			// 呉の治世
	// 糧村オプション
	var checkbox = $a('//input[@id="OPT_DORM"]');		checkbox[0].checked = false;		//
	var checkbox = $a('//input[@id="OPT_KATEMURA"]');	checkbox[0].checked = true; 		// 糧村化
	var textbox  = $a('//input[@id="OPT_SOUKO_MAX"]');	textbox[0].value	= 0;			// 倉庫数
	clearWaterwheelBox(); // 水車村オプション
}

function InitPreset_03(){			// 2014.03.05
	// 砦９
	clearInifacBox();
	var checkbox = $a('//input[@id="OPT_CHKBOX7"]');   checkbox[0].checked = true;			// 鍛冶場
	var checkbox = $a('//input[@id="OPT_CHKBOX9"]');   checkbox[0].checked = true;			// 練兵所
	var checkbox = $a('//input[@id="OPT_CHKBOX13"]');  checkbox[0].checked = true;			// 宿舎

	var textbox = $a('//input[@id="OPT_CHKBOXLV7"]');	textbox[0].value =	5;				// 鍛冶場
	var textbox = $a('//input[@id="OPT_CHKBOXLV9"]');	textbox[0].value =	10; 			// 練兵所
	var textbox = $a('//input[@id="OPT_CHKBOXLV13"]');	textbox[0].value =	9;				// 宿舎

	// 糧村オプション
	var checkbox = $a('//input[@id="OPT_DORM"]');		checkbox[0].checked = true; 		// 宿舎村化

	// 造兵設定
	clearInitSoldier(); 			// 造兵クリア
	var checkbox = $a('//input[@id="OPT_BLD_SOL"]');	checkbox[0].checked = false;		// 自動造兵
	var textbox = $a('//input[@id="OPT_SOL_MAX1"]');	textbox[0].value =	4000;			// 剣兵　最大数
	var textbox = $a('//input[@id="OPT_SOL_ADD1"]');	textbox[0].value =	50; 			// 　　　造兵数

	clearInitRemainingRes();	// 武器防具設定クリア
	var checkbox = $a('//input[@id="OPT_BKBG_CHK"]');	checkbox[0].checked = true; 		// 武器防具強化
	var textbox = $a('//input[@id="OPT_BK_LV1"]');		textbox[0].value =	10; 			// 　　　造兵数
}

function InitPreset_02(){			// 2014.03.05
	// 糧村
	clearInifacBox();
	var checkbox = $a('//input[@id="OPT_CHKBOX0"]');   checkbox[0].checked = false; 		// 拠点
	var checkbox = $a('//input[@id="OPT_CHKBOX4"]');   checkbox[0].checked = true;			// 畑

	var textbox = $a('//input[@id="OPT_CHKBOXLV0"]');	textbox[0].value =	5;				// 拠点
	var textbox = $a('//input[@id="OPT_CHKBOXLV4"]');	textbox[0].value =	8;				// 畑

	// 内政設定
	var checkbox = $a('//input[@id="OPT_DOME10"]');  checkbox[0].checked = true;			// 食糧知識
	var checkbox = $a('//input[@id="OPT_DOME11"]');  checkbox[0].checked = true;			// 食糧技術
	var checkbox = $a('//input[@id="OPT_DOME12"]');  checkbox[0].checked = true;			// 農林知識
	var checkbox = $a('//input[@id="OPT_DOME13"]');  checkbox[0].checked = true;			// 農林技術
	var checkbox = $a('//input[@id="OPT_DOME23"]');  checkbox[0].checked = true;			// 呉の治世
	// 糧村オプション
	var checkbox = $a('//input[@id="OPT_DORM"]');		checkbox[0].checked = false;		//
	var checkbox = $a('//input[@id="OPT_KATEMURA"]');	checkbox[0].checked = true; 		// 糧村化
	var textbox  = $a('//input[@id="OPT_SOUKO_MAX"]');	textbox[0].value	= 0;			// 倉庫数
	clearWaterwheelBox(); // 水車村オプション
}

function InitPreset_04(){			// 2014.03.05
	// 砦13
	clearInifacBox();
	var checkbox = $a('//input[@id="OPT_CHKBOX7"]');   checkbox[0].checked = true;			// 鍛冶場
	var checkbox = $a('//input[@id="OPT_CHKBOX9"]');   checkbox[0].checked = true;			// 練兵所
	var checkbox = $a('//input[@id="OPT_CHKBOX13"]');  checkbox[0].checked = true;			// 宿舎

	var textbox = $a('//input[@id="OPT_CHKBOXLV7"]');	textbox[0].value =	5;				// 鍛冶場
	var textbox = $a('//input[@id="OPT_CHKBOXLV9"]');	textbox[0].value =	10; 			// 練兵所
	var textbox = $a('//input[@id="OPT_CHKBOXLV13"]');	textbox[0].value =	13; 			// 宿舎

	// 糧村オプション
	var checkbox = $a('//input[@id="OPT_DORM"]');		checkbox[0].checked = true; 		// 宿舎村化

	// 造兵設定
	clearInitSoldier(); 			// 造兵クリア
	var checkbox = $a('//input[@id="OPT_BLD_SOL"]');	checkbox[0].checked = false;		// 自動造兵
	var textbox = $a('//input[@id="OPT_SOL_MAX1"]');	textbox[0].value =	4000;			// 剣兵　最大数
	var textbox = $a('//input[@id="OPT_SOL_ADD1"]');	textbox[0].value =	50; 			// 　　　造兵数

	clearInitRemainingRes();	// 武器防具設定クリア
	var checkbox = $a('//input[@id="OPT_BKBG_CHK"]');	checkbox[0].checked = true; 		// 武器防具強化
	var textbox = $a('//input[@id="OPT_BK_LV1"]');		textbox[0].value =	10; 			// 　　　造兵数
}

// ここまで 2014.03.05 =============================================================================================================================================================
// 残す資源量のクリア
function clearInitRemainingRes(){
	var textbox = $a('//input[@id="OPT_BLD_WOOD"]');  textbox[0].value = 0;
	var textbox = $a('//input[@id="OPT_BLD_STONE"]'); textbox[0].value = 0;
	var textbox = $a('//input[@id="OPT_BLD_IRON"]');  textbox[0].value = 0;
	var textbox = $a('//input[@id="OPT_BLD_RICE"]');  textbox[0].value = 0;
}

// 武器・防具強化レベルのクリア
function clearInitArmsArmor(){

	var textbox = $a('//input[@id="OPT_BK_LV1"]');	textbox[0].value = 0;
	var textbox = $a('//input[@id="OPT_BK_LV8"]');	textbox[0].value = 0;
	var textbox = $a('//input[@id="OPT_BK_LV3"]');	textbox[0].value = 0;
	var textbox = $a('//input[@id="OPT_BK_LV9"]');	textbox[0].value = 0;
	var textbox = $a('//input[@id="OPT_BK_LV5"]');	textbox[0].value = 0;
	var textbox = $a('//input[@id="OPT_BK_LV4"]');	textbox[0].value = 0;
	var textbox = $a('//input[@id="OPT_BK_LV7"]');	textbox[0].value = 0;
	var textbox = $a('//input[@id="OPT_BK_LV12"]'); textbox[0].value = 0;
	var textbox = $a('//input[@id="OPT_BK_LV13"]'); textbox[0].value = 0;
	var textbox = $a('//input[@id="OPT_BK_LV15"]'); textbox[0].value = 0;
	var textbox = $a('//input[@id="OPT_BK_LV16"]'); textbox[0].value = 0;
	var textbox = $a('//input[@id="OPT_BK_LV17"]'); textbox[0].value = 0;

	var textbox = $a('//input[@id="OPT_BG_LV1"]');	textbox[0].value = 0;
	var textbox = $a('//input[@id="OPT_BG_LV8"]');	textbox[0].value = 0;
	var textbox = $a('//input[@id="OPT_BG_LV3"]');	textbox[0].value = 0;
	var textbox = $a('//input[@id="OPT_BG_LV9"]');	textbox[0].value = 0;
	var textbox = $a('//input[@id="OPT_BG_LV5"]');	textbox[0].value = 0;
	var textbox = $a('//input[@id="OPT_BG_LV4"]');	textbox[0].value = 0;
	var textbox = $a('//input[@id="OPT_BG_LV7"]');	textbox[0].value = 0;
	var textbox = $a('//input[@id="OPT_BG_LV10"]'); textbox[0].value = 0;
	var textbox = $a('//input[@id="OPT_BG_LV11"]'); textbox[0].value = 0;
	var textbox = $a('//input[@id="OPT_BG_LV12"]'); textbox[0].value = 0;
	var textbox = $a('//input[@id="OPT_BG_LV13"]'); textbox[0].value = 0;
	var textbox = $a('//input[@id="OPT_BG_LV15"]'); textbox[0].value = 0;
	var textbox = $a('//input[@id="OPT_BG_LV16"]'); textbox[0].value = 0;
	var textbox = $a('//input[@id="OPT_BG_LV17"]'); textbox[0].value = 0;
}

// 造兵時作成単位初期化
function clearInitSoldier(){

	var textbox = $a('//input[@id="OPT_SOL_ADD1"]');	textbox[0].value = 0;
	var textbox = $a('//input[@id="OPT_SOL_ADD8"]');	textbox[0].value = 0;
	var textbox = $a('//input[@id="OPT_SOL_ADD3"]');	textbox[0].value = 0;
	var textbox = $a('//input[@id="OPT_SOL_ADD5"]');	textbox[0].value = 0;
	var textbox = $a('//input[@id="OPT_SOL_ADD9"]');	textbox[0].value = 0;
	var textbox = $a('//input[@id="OPT_SOL_ADD4"]');	textbox[0].value = 0;
	var textbox = $a('//input[@id="OPT_SOL_ADD7"]');	textbox[0].value = 0;
	var textbox = $a('//input[@id="OPT_SOL_ADD10"]');	textbox[0].value = 0;
	var textbox = $a('//input[@id="OPT_SOL_ADD11"]');	textbox[0].value = 0;
	var textbox = $a('//input[@id="OPT_SOL_ADD12"]');	textbox[0].value = 0;
	var textbox = $a('//input[@id="OPT_SOL_ADD13"]');	textbox[0].value = 0;
	var textbox = $a('//input[@id="OPT_SOL_ADD15"]');	textbox[0].value = 0;
	var textbox = $a('//input[@id="OPT_SOL_ADD16"]');	textbox[0].value = 0;
	var textbox = $a('//input[@id="OPT_SOL_ADD17"]');	textbox[0].value = 0;
}

//建築対象施設表示HTML削除
function deleteInifacHtml() {
	var elem = d.getElementById("ABfacContainer");
	if (elem == undefined) return;
	d.body.removeChild(d.getElementById("ABfacContainer"));
}
//建築対象施設表示HTML削除
function deleteInifacFrameHtml() {
	var elem = d.getElementById("ABfacContainer");
	if (elem == undefined) return;
	d.body.removeChild(document.getElementById("ABfacContainer"));
}

//ステイタス取得HTML追加
function addIniBilderHtml() {

//	var popupLeft = 500;
//	var popupTop = 250;

// add 2011.09.27 設定画面移動
	var popupLeft = GM_getValue(location.hostname + PGNAME + "_popup_left", 150);
	var popupTop = GM_getValue(location.hostname + PGNAME + "_popup_top", 150);
	if (popupLeft < 0) popupLeft = 0;
	if (popupTop < 0) popupTop = 0;
// end

	// 表示コンテナ作成
	var ABContainer = d.createElement("div");
	ABContainer.id = "ABContainer";
	ABContainer.style.position = "absolute";
	ABContainer.style.backgroundColor = COLOR_FRAME;
	ABContainer.style.opacity= 1.0; // 透明度
	ABContainer.style.border = "solid 2px #000000";
	ABContainer.style.MozBorderRadius = "4px";	// 角丸
	ABContainer.style.top = popupTop + "px";
	ABContainer.style.left = popupLeft + "px";
	ABContainer.style.font = fontstyle;
	ABContainer.style.padding = "4px";
	ABContainer.style.zIndex = 999;
	d.body.appendChild(ABContainer);
	ABContainer.style.width = "640px";

	$e(ABContainer, "mousedown", function(event){
		if( event.target != $("ABContainer")) {return false;}
		g_MD="ABContainer";
		g_MX=event.pageX-parseInt(this.style.left,10);
		g_MY=event.pageY-parseInt(this.style.top,10);
		event.preventDefault();
	});

	$e(d, "mousemove", function(event){
		if(g_MD != "ABContainer") return true;
		var ABContainer = $("ABContainer");
		if( !ABContainer ) return true;
		var popupLeft = event.pageX - g_MX;
		var popupTop = event.pageY - g_MY;
		ABContainer.style.left = popupLeft + "px";
		ABContainer.style.top = popupTop + "px";
		//ポップアップ位置を永続保存
		GM_setValue(location.hostname + PGNAME + "_popup_left", popupLeft);
		GM_setValue(location.hostname + PGNAME + "_popup_top", popupTop);
	});

	$e(d, "mouseup", function(event){ g_MD=""; });
	// タイトル＋バージョン
	var title = d.createElement("span");
	title.style.color = "#FFFFFF";
	title.style.font = 'bold 120% "ＭＳ ゴシック"';
	title.style.margin = "2px";
	title.innerHTML = "Auto Bilder ";

	var version = d.createElement("span");
	version.style.color = COLOR_TITLE;
	version.style.margin = "2px";
	version.innerHTML = " Ver." + VERSION;

	var storageLimit = d.createElement("span");
	storageLimit.style.color = "#FFFFFF";
	storageLimit.style.font = '110% "ＭＳ Ｐゴシック"';
	storageLimit.style.margin = "2px";

	storageLimit.innerHTML = "資源保持上限(変換量) ： " + SetPrice(Math.floor(parseInt( $("rice_max").innerHTML, 10 ) * 0.95)) + " ( " + SetPrice(Math.floor(parseInt( $("rice_max").innerHTML, 10 ) * 0.05)) +" )";

	ABContainer.appendChild(title);
//	ABContainer.appendChild(storageLimit);
	ABContainer.appendChild(version);

	// ボタンエリア
	var ButtonBox = d.createElement("div");
	ButtonBox.style.border ="solid 0px";	// 通常 0px チェック時 1px
	ButtonBox.style.margin = "2px";
	ButtonBox.style.padding = "0px";

	ABContainer.appendChild(ButtonBox);

	// 実行中/停止中ボタン
	var Button1 = d.createElement("span");
	if(GM_getValue(HOST+PGNAME+"AutoFlg", true)==true){
		ccreateButton(Button1, "巡回中", "巡回停止します",
			function() {
				GM_setValue(HOST+PGNAME+"AutoFlg", false);
				location.reload();
			});
	} else {
		ccreateButton(Button1, "停止中", "巡回開始します",
			function() {
				GM_setValue(HOST+PGNAME+"AutoFlg", true);
					location.reload();
			});
	}
	ButtonBox.appendChild(Button1);

	// 確認済みボタン
	var Button2 = d.createElement("span");
		ccreateButton(Button2, "確認済", "完了済の作業を削除します",
			function() { confirmTimer() });
	ButtonBox.appendChild(Button2);

	// 閉じるボタン
	var Button3 = d.createElement("span");
		ccreateButton(Button3, "閉じる", "ウインドウを閉じます",
			function() {closeIniBilderBox()});
	ButtonBox.appendChild(Button3);

	// 常駐チェックボックス
	var staySpan = d.createElement("span");
	staySpan.title = "作業完了がなくても常に表示します";
	ButtonBox.appendChild(staySpan);

	var stayBox =  document.createElement("input");
	stayBox.type = "checkbox";
	stayBox.style.verticalAlign = "middle";
	stayBox.checked = getStayMode();
	stayBox.addEventListener("change",
		function() {changeStayMode(this.checked)}, true);
	ButtonBox.appendChild(stayBox);

	var stayCap = document.createElement("span");
	stayCap.style.verticalAlign = "middle";
	stayCap.innerHTML = "　常駐 ";
	stayCap.style.color = "#FFFFFF";
	staySpan.appendChild(stayCap);

	// 巡回順チェックボックス
	var reverseSpan = d.createElement("span");
	reverseSpan.title = "拠点巡回を逆順にします";
	ButtonBox.appendChild(reverseSpan);

	var reverseBox =  document.createElement("input");
	reverseBox.type = "checkbox";
	reverseBox.style.verticalAlign = "middle";
	reverseBox.checked = getReverseMode();
	reverseBox.addEventListener("change",
		function() {changeReverseMode(this.checked)}, true);
	ButtonBox.appendChild(reverseBox);

	var reverseCap = document.createElement("span");
	reverseCap.style.verticalAlign = "middle";
	reverseCap.innerHTML = "　　逆巡回 ";
	reverseCap.style.color = "#FFFFFF";
	reverseSpan.appendChild(reverseCap);

	// 巡回時間プルダウン
	var typeDiv = document.createElement("span");
	typeDiv.title = "ROUND_TIME";
	ButtonBox.appendChild(typeDiv);

	var caption = document.createElement("span");
	caption.style.verticalAlign = "middle";
	caption.innerHTML = "　　巡回時間 ";
	caption.style.color = "#FFFFFF";
	typeDiv.appendChild(caption);

	var selectBox = document.createElement("select");
	selectBox.id = "dispMode";
	selectBox.addEventListener("change",
		function() {
				GM_setValue(HOST+PGNAME+"OPT_ROUND_TIME1" , document.getElementById("dispMode").value );
			OPT_ROUND_TIME1 = document.getElementById("dispMode").value
		}, true);
	typeDiv.appendChild(selectBox);

	var options = new Array(
//		new Array("10sec" , LOAD_ROUND_TIME_10),
//		new Array("20sec" , LOAD_ROUND_TIME_20),
		new Array("30sec" , LOAD_ROUND_TIME_30),
		new Array("40sec" , LOAD_ROUND_TIME_40),
		new Array("50sec" , LOAD_ROUND_TIME_50),
		new Array("60sec" , LOAD_ROUND_TIME_60),
		new Array("70sec" , LOAD_ROUND_TIME_70),
		new Array("80sec" , LOAD_ROUND_TIME_80),
		new Array("90sec" , LOAD_ROUND_TIME_90),
		new Array("100sec", LOAD_ROUND_TIME_100),
		new Array("110sec", LOAD_ROUND_TIME_110),
		new Array("120sec", LOAD_ROUND_TIME_120),
		new Array("130sec", LOAD_ROUND_TIME_130),
		new Array("140sec", LOAD_ROUND_TIME_140),
		new Array("150sec", LOAD_ROUND_TIME_150),
		new Array("160sec", LOAD_ROUND_TIME_160),
		new Array("170sec", LOAD_ROUND_TIME_170),
		new Array("180sec", LOAD_ROUND_TIME_180)
	);
	for (var i = 0; i < options.length; i++) {
		var elem = document.createElement("option");
		elem.innerHTML = options[i][0];
		elem.value = options[i][1];
		selectBox.appendChild(elem);
	}
	selectBox.value = GM_getValue(HOST+PGNAME+"OPT_ROUND_TIME1", LOAD_ROUND_TIME_180);
	OPT_ROUND_TIME1 = GM_getValue(HOST+PGNAME+"OPT_ROUND_TIME1", LOAD_ROUND_TIME_180);

	// 2012.01.11 巡回時間に 1 ~ 10sec 追加
	OPT_ROUND_TIME1 = parseInt(OPT_ROUND_TIME1) + Math.floor( Math.random() * 10 );

	// 次回表示
	var nowTime = new Date();
	var nextTime = getNextTime(location.hostname, nowTime);
	if (nextTime != undefined) {
		var waitTimeStr = generateWaitTimeString(nextTime, nowTime);
		var nextTimeBox = document.createElement("div");
		nextTimeBox.style.color = "#90EE90";
		nextTimeBox.style.backgroundColor = "#000000";
		nextTimeBox.style.verticalAlign = "middle";
		nextTimeBox.innerHTML = "　次回: " + generateDateString2(nextTime);
		nextTimeBox.innerHTML += " (あと" + waitTimeStr + ")";
		ABContainer.appendChild(nextTimeBox);
	}

	// 変換用市場表示
	var shoplist = cloadData(HOST+"ShopList","[]",true,true);
	if (shoplist.length != 0) {
//		shoplist.sort( function(a,b) { if (a[1] < b[1]) return 1; if (a[1] > b[1]) return -1; return 0;});
		shoplist.sort( function(a,b) { return parseInt(b[1],10) - parseInt(a[1],10);}); // 2015.05.23
		var villages = loadVillages(HOST+PGNAME);
		var nextIndex = -1;
		for(var i=0; i<villages.length;i++){
			if(shoplist[0].vId == villages[i][IDX_XY]){
				nextIndex = i;
				break;
			}
		}
		if (nextIndex != -1) {
			var ShopBox = document.createElement("div");
			ShopBox.style.color = "#90EE90";
			ShopBox.style.backgroundColor = "#000000";
			ShopBox.style.verticalAlign = "middle";
			ShopBox.innerHTML = "　変換用市場 : " + villages[nextIndex][IDX_BASE_NAME] + "　" + villages[nextIndex][IDX_XY] + "　市場Lv : " + shoplist[0].lv;
			ABContainer.appendChild(ShopBox);
		}
	}
	//document.getElementById("dispMode" + types[i]).value;

	//拠点設定リンクの作成
	var tbl = d.createElement("table");
	tbl.style.border ="0px";
	//拠点情報のロード
	var villages = loadVillages(HOST+PGNAME);
	//拠点情報が無い場合
	var firstboot = false;
	if (villages == "") { firstboot = true; }
	if (villages.length > 0) {
		if (villages[0][IDX_URL] == "") {
			firstboot = true;
		}
	}
	if(firstboot) {
		var tr = d.createElement("tr");
		var td = d.createElement("td");
		td.style.padding = "3px";
//		td.style.border = "solid 2px black";
		tr.appendChild(td);
		tbl.appendChild(tr);
		var msg = d.createElement("span");
		msg.style.fontSize = "15px";
		msg.style.margin = "3px";
		msg.style.color = "#FFFFFF";
		msg.style.font = 'bold 120% "ＭＳ ゴシック"';
		msg.innerHTML = "<br>" +
								"　　インストールありがとうございます。<br>" +
						"　　まずは、プロフィール画面を開いて<br>" +
						"　　拠点情報を取得してください。<br>　";
		td.appendChild(msg);
	} else {
		var landElems = document.evaluate(
		'//li[@class="on"]/span',
		document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

		for (var i = 0; i < villages.length; i++) {
			var vname = villages[i][IDX_BASE_NAME];
			var fColor = "#71C4F9";
			var tr = d.createElement("tr");
			var td = d.createElement("td");
			tr.style.fontWeight = "bold";
			td.style.padding = "2px";
			td.style.border = "solid 1px black";
			td.style.backgroundColor = "#E6CF88";

			tr.appendChild(td);
			tbl.appendChild(tr);

			//各拠点の設定画面リンク
			var vname = villages[i][IDX_BASE_NAME];
			if(vname != ""){	// add 2012.09.06
				vId2 = villages[i][IDX_XY];

				var td00 = d.createElement("div");
				td00.style.width = "140px";

				var tdA = d.createElement("td");
				tdA.style.padding = "3px";
				ccreateCheckBox0(td00, "OPT_CHKBOX_AVC_"+i, loadAVCBox2(i), villages[i][IDX_BASE_NAME],"",0 ,villages);

				//拠点一覧項目
				var opfacLink = document.createElement("text");
				opfacLink.style.padding = "3px";
				td00.appendChild(opfacLink);

				var villageText = villages[i][IDX_BASE_NAME];
				if (villages[i][IDX_URL] != "") {
					villageText = "<a href=" + villages[i][IDX_URL] +
					" style='color:#654634; text-decoration:none'>" +
					villageText + "</a>";
				}
				opfacLink.innerHTML = villageText;
				opfacLink.style.textDecoration = "none";
				td.appendChild(td00);
				tr.appendChild(td);

				//実行中作業情報項目
				var actionsTd = document.createElement("td");
				actionsTd.style.backgroundColor = COLOR_BACK;
				actionsTd.style.border = "solid 1px black";
				actionsTd.style.padding = "3px";
				actionsTd.style.width = "450px";
				tr.appendChild(actionsTd);
				var actions = sortAction(villages[i][IDX_ACTIONS]);
				var nowTime = new Date();
/*
				for (var j = 0; j < actions.length; j++) {
					var actionDiv = createActionDiv(actions[j], nowTime, villages[i][IDX_XY], location.hostname);
					if (!actionDiv) continue;
					// 完了済みフラグのチェック
					actionDiv = createActionDiv(actions[j], nowTime, villages[i][IDX_XY], location.hostname);
					actionsTd.appendChild(actionDiv);
				}
*/
				// 2013.12.19 ここから
				var cntOldData = 0;
				for (var j = actions.length -1; j > -1; j--) {
					var actionDiv = createActionDiv(actions[j], nowTime, villages[i][IDX_XY], location.hostname);
					if (!actionDiv) continue;
					// 完了済みフラグのチェック
					var actionTime = new Date(actions[j][IDX2_TIME]);
					if (actionTime < nowTime) {
						cntOldData += 1;		// 過去ログ件数カウント
						if (cntOldData <= 5) {
							// 過去ログ５件分は表示
							actionDiv = createActionDiv(actions[j], nowTime, villages[i][IDX_XY], location.hostname);
							actionsTd.appendChild(actionDiv);
						} else {
							// それ以外は削除
							var key = location.hostname + DELIMIT1 + villages[i][IDX_XY] + DELIMIT1 + actions[j][IDX2_TIME];
							var hosts = getTargetHosts();
							for (var ii = 0; ii < hosts.length; ii++) {
								var villages = loadVillages(hosts[ii] + PGNAME);
								var exists = false;
								villageLoop:
								for (var i = 0; i < villages.length; i++) {
									for (var j = 0; j < villages[i][IDX_ACTIONS].length; j++) {
										var action = villages[i][IDX_ACTIONS][j];
										var curKey = hosts[ii] + DELIMIT1 + villages[i][IDX_XY] + DELIMIT1 + action[IDX2_TIME];
										if (key == curKey) {
											exists = true;
											villages[i][IDX_ACTIONS].splice(j, 1);
											break villageLoop;
										}
									}
								}

								//見つかったら更新
								if (exists) {
									saveVillages(hosts[ii] + PGNAME, villages);
									if ( getStayMode() ) {
										closeIniBilderBox()
										openIniBilderBox()
									}
									return;
								}
							}
						}
					} else {
						// 現行ログの追加
						actionDiv = createActionDiv(actions[j], nowTime, villages[i][IDX_XY], location.hostname);
						actionsTd.appendChild(actionDiv);
					}
				}
				// 2013.12.19 ここまで

				//設定ボタン
				var settingTd = document.createElement("td");
				settingTd.style.backgroundColor = "#E6CF88";
				settingTd.style.border = "solid 1px black";
				settingTd.style.padding = "3px";
				settingTd.style.width = "20px";
				tr.appendChild(settingTd);

				var btn = d.createElement("input");
				btn.style.padding = "1px";
				btn.type = "button";
				btn.value = "設定";
				btn.title = "設定画面を表示します";
				settingTd.appendChild(d.createTextNode(" "));
				settingTd.appendChild(btn);
				settingTd.appendChild(d.createTextNode(" "));
				settingTd.setAttribute('vId', villages[i][IDX_XY]);
				settingTd.addEventListener("click", function() {
					var vId = this.getAttribute('vId');
					openInifacBox(vId);
				}, true);
			}	// add 2012.09.06
		}
		saveVillages(HOST+PGNAME, villages);
	}


	//拠点作成状況の表示 2012.04.09
	var tbl2 = d.createElement("table");
	tbl2.style.border ="0px";
	var lists = cloadData(HOST+"ReserveList", "[]", true, true);
	for(var i=0 ; i<lists.length ; i++) {
		var vId = "(" + lists[i].x + "," + lists[i].y + ")";

		var tr = d.createElement("tr");
		var td = d.createElement("td");

		tbl2.appendChild(tr);

		var td00 = d.createElement("div");

		td.appendChild(td00);
		tr.appendChild(td);

		var actionsTd = document.createElement("td");
		actionsTd.style.backgroundColor = COLOR_BACK;
		actionsTd.style.border = "solid 1px black";
		actionsTd.style.padding = "3px";
		actionsTd.style.width = "525px";

		tr.appendChild(actionsTd);

		var actionDiv = document.createElement("text");
		actionDiv.style.padding = "3px";

		actionDiv.innerHTML = "座標" + vId + " に ";
			  if(lists[i].kind == 220){ actionDiv.innerHTML += "「村」";
		}else if(lists[i].kind == 222){ actionDiv.innerHTML += "「砦」";
		}
			  if(lists[i].status == 0){actionDiv.innerHTML += "作成失敗";
		}else if(lists[i].status == 1){actionDiv.innerHTML += "作成予約";
		}else if(lists[i].status == 2){actionDiv.innerHTML += "作成中";
		}else if(lists[i].status == 3){actionDiv.innerHTML += "作成完了";
		}else if(lists[i].status == 4){actionDiv.innerHTML += "破棄中";
		}else if(lists[i].status == 5){actionDiv.innerHTML += "破棄完了";
		}
		if(lists[i].status == 2 || lists[i].status == 4){
			actionDiv.innerHTML += " (" + lists[i].time + " 完了予定)";
		}

		var delTd = document.createElement("td");
		delTd.style.backgroundColor = "#E6CF88";
		delTd.style.border = "solid 1px black";
		delTd.style.padding = "3px";
		delTd.style.width = "34px";
		tr.appendChild(delTd);

		if(lists[i].status == 1 || lists[i].status == 0){
			var btn = d.createElement("input");
			btn.style.padding = "1px";
			btn.type = "button";
			btn.value = "取消";
			btn.title = "予約を取消します";
			delTd.appendChild(d.createTextNode(" "));
			delTd.appendChild(btn);
			delTd.appendChild(d.createTextNode(" "));
			delTd.setAttribute('x', lists[i].x);
			delTd.setAttribute('y', lists[i].y);
			delTd.addEventListener("click", function() {
				var x = this.getAttribute('x');
				var y = this.getAttribute('y');
				delList(x, y)
			}, true); //delListへ
		}
		else if(lists[i].status == 3 || lists[i].status == 5){
			var btn = d.createElement("input");
			btn.style.padding = "1px";
			btn.type = "button";
			btn.value = "確認";
			btn.title = "確認済にして削除します";
			delTd.appendChild(d.createTextNode(" "));
			delTd.appendChild(btn);
			delTd.appendChild(d.createTextNode(" "));
			delTd.setAttribute('x', lists[i].x);
			delTd.setAttribute('y', lists[i].y);
			delTd.addEventListener("click", function() {
				var x = this.getAttribute('x');
				var y = this.getAttribute('y');
				delList(x, y)
			}, true); //delListへ

		}
		tr.appendChild(delTd);
		actionsTd.appendChild(actionDiv);
	}

	ABContainer.appendChild(tbl);
	ABContainer.appendChild(tbl2);

	function delList(x, y)
	{
		var lists = cloadData(HOST+"ReserveList", "[]", true, true);
		for(var i=0 ; i<lists.length ; i++) {
			if(lists[i].x == x && lists[i].y == y ) {
				lists.splice(i,1);
				csaveData(HOST+"ReserveList", lists, true, true );

				//更新後内容で表示
				closeIniBilderBox()
				openIniBilderBox()

				break;
			}
		}
	}
}

// 拠点巡回読込
function loadAVCBox(){
	OPT_CHKBOX_AVC = parseInt(GM_getValue(HOST+PGNAME+"AVC", ""));
}

function loadAVCBox2(tVID){
	//OPT_CHKBOX_AVC = parseInt(GM_getValue(HOST+PGNAME+"AVC"+"_"+tVID, ""));
	OPT_CHKBOX_AVC = GM_getValue(HOST+PGNAME+"OPT_CHKBOX_AVC_" + tVID, true);
	return OPT_CHKBOX_AVC;
}

// @@@@ add 2011.09.07 @@@@
function loadRoundTime() {
	OPT_ROUND_TIME1 = GM_getValue(HOST+PGNAME+"OPT_ROUND_TIME1", 180);
	return OPT_ROUND_TIME1;
}

//数値を3ケタ区切りにする関数
function SetPrice(price){
　var num = new String(price).replace(/,/g, "");
　while(num != (num = num.replace(/^(-?\d+)(\d{3})/, "$1,$2")));
　return num;
}

// 拠点巡回保存
function saveAVCBox(){
	OPT_CHKBOX_AVC = cgetCheckBoxValue($("OPT_CHKBOX_AVC"));
	GM_setValue(HOST+PGNAME+"AVC", OPT_CHKBOX_AVC);
}
function saveAVCBox2(tVID,flg){
	//OPT_CHKBOX_AVC = cgetCheckBoxValue($("OPT_CHKBOX_AVC"));
	//GM_setValue(HOST+PGNAME+"AVC", OPT_CHKBOX_AVC);
	GM_setValue(HOST+PGNAME+"AVC"+"_"+tVID, flg);

	//var tid=setTimeout(function(){location.reload();},INTERVAL);
	tidMain=setTimeout(function(){location.reload(false);},INTERVAL);
}

//施設建設必要資源読込
function loadFacility(){
}

//施設建設必要資源保存
function saveFacility(f){
}

//ステイタス取得HTML追加
function addInifacHtml(vId) {

// add 2011.09.27 設定画面移動 @@@@
	var popupLeft = GM_getValue(location.hostname + PGNAME + "_popup_left2", 10);
	var popupTop = GM_getValue(location.hostname + PGNAME + "_popup_top2", 10);
	if (popupLeft < 0) popupLeft = 0;
	if (popupTop < 0) popupTop = 0;

// end


	//表示コンテナ作成
	var ABfacContainer = d.createElement("div");
	ABfacContainer.id = "ABfacContainer";
	ABfacContainer.style.position = "absolute";
	ABfacContainer.style.color = COLOR_BASE;
	ABfacContainer.style.backgroundColor = COLOR_FRAME;
	ABfacContainer.style.opacity= 1.0;
	ABfacContainer.style.border = "solid 2px black";
	ABfacContainer.style.left = popupLeft + "px";
	ABfacContainer.style.top = popupTop + "px";
	ABfacContainer.style.font = fontstyle;
	ABfacContainer.style.padding = "2px";
	ABfacContainer.style.MozBorderRadius = "4px";
	ABfacContainer.style.zIndex = 9999;
	ABfacContainer.style.width = "746px";

	ABfacContainer.setAttribute('vId', vId);
	d.body.appendChild(ABfacContainer);

	$e(ABfacContainer, "mousedown", function(event){
				if( event.target != $("ABfacContainer")) {return false;}
				g_MD="ABfacContainer";
				g_MX=event.pageX-parseInt(this.style.left,10);
				g_MY=event.pageY-parseInt(this.style.top,10);
				event.preventDefault();});
	$e(d, "mousemove", function(event){
				if(g_MD != "ABfacContainer") return true;
				var ABfacContainer = $("ABfacContainer");
				if( !ABfacContainer ) return true;
				var popupLeft = event.pageX - g_MX;
				var popupTop  = event.pageY - g_MY;
				ABfacContainer.style.left = popupLeft + "px";
				ABfacContainer.style.top = popupTop + "px";
				//ポップアップ位置を永続保存
				GM_setValue(location.hostname + PGNAME + "_popup_left2", popupLeft);
				GM_setValue(location.hostname + PGNAME + "_popup_top2", popupTop);
				});
	$e(d, "mouseup", function(event){g_MD="";});

	// ===== 作業拠点名 =====
	var BaseName  = d.createElement("span");
		BaseName.style.border ="solid 0px red";
		BaseName.style.padding = "3px";
		BaseName.style.font = "bold 120% 'ＭＳ ゴシック'";
		BaseName.style.color = "#71C4F9";

	var villages = loadVillages(HOST+PGNAME);
	for (var i = 0; i < villages.length; i++) {
		//表示中の設定対象拠点名の表示
		if(vId == villages[i][IDX_XY]){
			BaseName.innerHTML = villages[i][IDX_BASE_NAME];
		}
	}
	Load_OPT(vId);
	ABfacContainer.appendChild(BaseName);

	// ===== 建設設定 =====
	var Build_Box = d.createElement("table");
		Build_Box.style.border ="solid 2px black";
		Build_Box.style.margin = "0px 4px 4px 0px";
		Build_Box.style.width = "100%";

	var tr11 = d.createElement("tr");
		tr11.style.backgroundColor = COLOR_TITLE;
		tr11.style.border ="solid 1px black";

	var td11 = d.createElement("td");
		td11.style.padding = "1px";
		td11.colSpan = "3";
		td11.appendChild( createRadioBtn ( 'AC', '自動建築' ) );

	var tr111 = d.createElement("tr");
		tr111.style.backgroundColor = COLOR_BACK;
		tr111.style.border ="solid 1px black";

	var td111 = d.createElement("td");
		td111.style.padding = "3px";
		td111.style.verticalAlign = "top";

	var td112 = d.createElement("td");
		td112.style.padding = "3px";
		td112.style.verticalAlign = "top";

	var td113 = d.createElement("td");
		td113.style.padding = "3px";
		td113.style.verticalAlign = "top";

	var tr30 = d.createElement("tr");
		tr30.style.backgroundColor = COLOR_BACK;

	var td31 = d.createElement("td");
		td31.colSpan = "3";
		td31.style.padding = "3px";

	Build_Box.appendChild(tr11);
	tr11.appendChild(td11);

	Build_Box.appendChild(tr111);
	tr111.appendChild(td111);
	tr111.appendChild(td112);
	tr111.appendChild(td113);

	Build_Box.appendChild(tr30);
	tr30.appendChild(td31);

//	ABfacContainer.appendChild(Build_Box);

	ccreateCheckBoxKai2(td111, "OPT_CHKBOX",  0, " 拠点 　　　","中央の城・村・砦のLvを上げます。",0);
	ccreateCheckBoxKai2(td111, "OPT_CHKBOX",  6, " 銅雀台 　　","自動でLv上げをする建築物にチェックをしてください。",0);
	ccreateText(td111, "Dummy" , "　", 0);
	ccreateCheckBoxKai2(td111, "OPT_CHKBOX",  1, " 伐採所 　　","自動でLv上げをする建築物にチェックをしてください。",0);
	ccreateCheckBoxKai2(td111, "OPT_CHKBOX",  2, " 石切り場 　","自動でLv上げをする建築物にチェックをしてください。",0);
	ccreateCheckBoxKai2(td111, "OPT_CHKBOX",  3, " 製鉄所 　　","自動でLv上げをする建築物にチェックをしてください。",0);
	ccreateCheckBoxKai2(td111, "OPT_CHKBOX",  4, " 畑 　　　　","自動でLv上げをする建築物にチェックをしてください。",0);
	ccreateCheckBoxKai2(td111, "OPT_CHKBOX",  5, " 倉庫 　　　","自動でLv上げをする建築物にチェックをしてください。",0);
	ccreateText(td111, "Dummy" , "　", 0);
	ccreateCheckBoxKai2(td111, "OPT_CHKBOX",  7, " 鍛冶場 　　","自動でLv上げをする建築物にチェックをしてください。",0);
	ccreateCheckBoxKai2(td111, "OPT_CHKBOX",  8, " 防具工場 　","自動でLv上げをする建築物にチェックをしてください。",0);

	ccreateCheckBoxKai2(td112, "OPT_CHKBOX",  9, " 練兵所 　　","自動でLv上げをする建築物にチェックをしてください。",0);
	ccreateCheckBoxKai2(td112, "OPT_CHKBOX", 10, " 兵舎 　　　","自動でLv上げをする建築物にチェックをしてください。",0);
	ccreateCheckBoxKai2(td112, "OPT_CHKBOX", 11, " 弓兵舎 　　","自動でLv上げをする建築物にチェックをしてください。",0);
	ccreateCheckBoxKai2(td112, "OPT_CHKBOX", 12, " 厩舎 　　　","自動でLv上げをする建築物にチェックをしてください。",0);
	ccreateCheckBoxKai2(td112, "OPT_CHKBOX", 14, " 兵器工房 　","自動でLv上げをする建築物にチェックをしてください。",0);
	ccreateText(td112, "Dummy" , "　", 0);
	ccreateCheckBoxKai2(td112, "OPT_CHKBOX", 13, " 宿舎 　　　","自動でLv上げをする建築物にチェックをしてください。",0);
	ccreateCheckBoxKai2(td112, "OPT_CHKBOX", 20, " 大宿舎 　　","自動でLv上げをする建築物にチェックをしてください。",0);
	ccreateText(td112, "Dummy" , "　", 0);
	ccreateCheckBoxKai2(td112, "OPT_CHKBOX", 15, " 市場 　　　","自動でLv上げをする建築物にチェックをしてください。",0);

	ccreateCheckBoxKai2(td113, "OPT_CHKBOX", 16, " 訓練所 　　","自動でLv上げをする建築物にチェックをしてください。",0);
	ccreateCheckBoxKai2(td113, "OPT_CHKBOX", 21, " 遠征訓練所 ","自動でLv上げをする建築物にチェックをしてください。",0);
	ccreateText(td113, "Dummy" , "　", 0);
	ccreateCheckBoxKai2(td113, "OPT_CHKBOX", 17, " 水車 　　　","自動でLv上げをする建築物にチェックをしてください。",0);
	ccreateCheckBoxKai2(td113, "OPT_CHKBOX", 18, " 工場 　　　","自動でLv上げをする建築物にチェックをしてください。",0);
	ccreateText(td113, "Dummy" , "　", 0);
	ccreateCheckBoxKai2(td113, "OPT_CHKBOX", 19, " 研究所 　　","自動でLv上げをする建築物にチェックをしてください。",0);
	ccreateCheckBoxKai2(td113, "OPT_CHKBOX", 22, " 見張り台 　","自動でLv上げをする建築物にチェックをしてください。",0);

	ccreateButton(td31, "遠征訓練所"  , 	"本拠地に遠征訓練所を建てる設定にします。", 	function() {InitMilitaryHome()},85);
	if ( WangRay != true ) {
		ccreateButton(td31, "城①"	,		"城① の設定にします。",					function() {InitRiceParadise()});
		ccreateButton(td31, "城②"	,		"城② の設定にします。",					function() {InitResVillage()});
		ccreateButton(td31, "宿舎村",		"砦 の設定にします。",						function() {InitMilitarySite()});
		ccreateButton(td31, "糧村"	,		"砦 の設定にします。",						function() {InitRiceSite()});
	} else {
		ccreateButton(td31, "城",			"城 の設定にします。",						function() {InitPreset_01()});
		ccreateButton(td31, "糧村", 			"糧村 の設定にします。",					function() {InitPreset_02()});
		ccreateButton(td31, "砦９", 			"砦９ の設定にします。",					function() {InitPreset_03()});
		ccreateButton(td31, "砦１３",		"砦１３ の設定にします。",					function() {InitPreset_04()});
	}
	ccreateButton(td31, "初期化",		"自動建設設定を消去します。",				function() {clearInifacBox()});

	// ===== 自動削除 ===== 2015.05.10
	var Remove_Box = d.createElement("table");
		Remove_Box.style.border = "solid 2px black";
		Remove_Box.style.margin = "0px 4px 4px 0px";
		Remove_Box.style.width = "100%";

	var tr0011 = d.createElement("tr");
		tr0011.style.backgroundColor = COLOR_TITLE;
		tr0011.style.border ="solid 1px black";

	var td0011 = d.createElement("td");
		td0011.style.padding = "1px";
		td0011.colSpan = "3";
		ccreateCheckBox(td0011, "OPT_REMOVE", OPT_REMOVE, " 自動削除", "この都市に来たら、自動的に削除します。", 0);

	var tr00111 = d.createElement("tr");
		tr00111.style.backgroundColor = COLOR_BACK;
		tr00111.style.border ="solid 1px black";

	var td00111 = d.createElement("td");
		td00111.style.padding = "3px";
		td00111.style.verticalAlign = "top";

	var td00112 = d.createElement("td");
		td00112.style.padding = "3px";
		td00112.style.verticalAlign = "top";

	var td00113 = d.createElement("td");
		td00113.style.padding = "3px";
		td00113.style.verticalAlign = "top";

	Remove_Box.appendChild(tr0011);
	tr0011.appendChild(td0011);

	Remove_Box.appendChild(tr00111);
	tr00111.appendChild(td00111);
	tr00111.appendChild(td00112);
	tr00111.appendChild(td00113);

	ccreateText(td00111, "Dummy" , "　", 0);
	ccreateCheckBox3(td00111, "OPT_RM_CHKBOX", OPT_RM_CHKBOX,	6, " 銅雀台 　　","自動で削除する建築物にチェックをしてください。",0,0);
	ccreateText(td00111, "Dummy" , "　", 0);
	ccreateCheckBox3(td00111, "OPT_RM_CHKBOX", OPT_RM_CHKBOX,	1, " 伐採所 　　","自動で削除する建築物にチェックをしてください。",0,1);
	ccreateCheckBox3(td00111, "OPT_RM_CHKBOX", OPT_RM_CHKBOX,	2, " 石切り場 　","自動で削除する建築物にチェックをしてください。",0,1);
	ccreateCheckBox3(td00111, "OPT_RM_CHKBOX", OPT_RM_CHKBOX,	3, " 製鉄所 　　","自動で削除する建築物にチェックをしてください。",0,1);
	ccreateCheckBox3(td00111, "OPT_RM_CHKBOX", OPT_RM_CHKBOX,	4, " 畑 　　　　","自動で削除する建築物にチェックをしてください。",0,1);
	ccreateCheckBox3(td00111, "OPT_RM_CHKBOX", OPT_RM_CHKBOX,	5, " 倉庫 　　　","自動で削除する建築物にチェックをしてください。",0,1);
	ccreateText(td00111, "Dummy" , "　", 0);
	ccreateCheckBox3(td00111, "OPT_RM_CHKBOX", OPT_RM_CHKBOX,	7, " 鍛冶場 　　","自動で削除する建築物にチェックをしてください。",0,0);
	ccreateCheckBox3(td00111, "OPT_RM_CHKBOX", OPT_RM_CHKBOX,	8, " 防具工場 　","自動で削除する建築物にチェックをしてください。",0,0);

	ccreateCheckBox3(td00112, "OPT_RM_CHKBOX", OPT_RM_CHKBOX,	9, " 練兵所 　　","自動で削除する建築物にチェックをしてください。",0,0);
	ccreateCheckBox3(td00112, "OPT_RM_CHKBOX", OPT_RM_CHKBOX, 10, " 兵舎 　　　","自動で削除する建築物にチェックをしてください。",0,0);
	ccreateCheckBox3(td00112, "OPT_RM_CHKBOX", OPT_RM_CHKBOX, 11, " 弓兵舎 　　","自動で削除する建築物にチェックをしてください。",0,0);
	ccreateCheckBox3(td00112, "OPT_RM_CHKBOX", OPT_RM_CHKBOX, 12, " 厩舎 　　　","自動で削除する建築物にチェックをしてください。",0,0);
	ccreateCheckBox3(td00112, "OPT_RM_CHKBOX", OPT_RM_CHKBOX, 14, " 兵器工房 　","自動で削除する建築物にチェックをしてください。",0,0);
	ccreateText(td00112, "Dummy" , "　", 0);
	ccreateCheckBox3(td00112, "OPT_RM_CHKBOX", OPT_RM_CHKBOX, 13, " 宿舎 　　　","自動で削除する建築物にチェックをしてください。",0,1);
	ccreateCheckBox3(td00112, "OPT_RM_CHKBOX", OPT_RM_CHKBOX, 20, " 大宿舎 　　","自動で削除する建築物にチェックをしてください。",0,1);
	ccreateText(td00112, "Dummy" , "　", 0);
	ccreateCheckBox3(td00112, "OPT_RM_CHKBOX", OPT_RM_CHKBOX, 15, " 市場 　　　","自動で削除する建築物にチェックをしてください。",0,0);

	ccreateCheckBox3(td00113, "OPT_RM_CHKBOX", OPT_RM_CHKBOX, 16, " 訓練所 　　","自動で削除する建築物にチェックをしてください。",0,0);
	ccreateCheckBox3(td00113, "OPT_RM_CHKBOX", OPT_RM_CHKBOX, 21, " 遠征訓練所 ","自動で削除する建築物にチェックをしてください。",0,0);
	ccreateText(td00113, "Dummy" , "　", 0);
	ccreateCheckBox3(td00113, "OPT_RM_CHKBOX", OPT_RM_CHKBOX, 17, " 水車 　　　","自動で削除する建築物にチェックをしてください。",0,0);
	ccreateCheckBox3(td00113, "OPT_RM_CHKBOX", OPT_RM_CHKBOX, 18, " 工場 　　　","自動で削除する建築物にチェックをしてください。",0,0);
	ccreateText(td00113, "Dummy" , "　", 0);
	ccreateCheckBox3(td00113, "OPT_RM_CHKBOX", OPT_RM_CHKBOX, 19, " 研究所 　　","自動で削除する建築物にチェックをしてください。",0,0);
	ccreateCheckBox3(td00113, "OPT_RM_CHKBOX", OPT_RM_CHKBOX, 22, " 見張り台 　","自動で削除する建築物にチェックをしてください。",0,0);

	// ===== 内政設定 =====
	var Domestic_Box = d.createElement("table");
		Domestic_Box.style.border = "solid 2px black";
		Domestic_Box.style.margin = "0px 4px 4px 0px";
		Domestic_Box.style.width = "100%";

	var tr1 = d.createElement("tr");
	var td1 = d.createElement("td");
		td1.colSpan = 5;
//		td1.style.padding = "2px";
		td1.style.backgroundColor = COLOR_TITLE;
		ccreateText(td1, "dummy", "■ 自動内政設定", 0 );

	var tr2 = d.createElement("tr");
		tr2.style.backgroundColor = COLOR_BACK;
		tr2.style.border = "solid 1px black";

	var td21 = d.createElement("td");
		td21.style.padding = "2px";
		td21.style.verticalAlign = "top";

	var td22 = d.createElement("td");
		td22.style.padding = "2px";
		td22.style.verticalAlign = "top";

	var td23 = d.createElement("td");
		td23.style.padding = "2px";
		td23.style.verticalAlign = "top";

	var td24 = d.createElement("td");
		td24.style.padding = "2px";
		td24.style.verticalAlign = "top";

	var td25 = d.createElement("td");
		td25.style.padding = "2px";
		td25.style.verticalAlign = "top";

	Domestic_Box.appendChild(tr1);
	tr1.appendChild(td1);
	Domestic_Box.appendChild(tr2);
	tr2.appendChild(td21);
	tr2.appendChild(td22);
	tr2.appendChild(td23);
	tr2.appendChild(td24);
	tr2.appendChild(td25);

//	ABfacContainer.appendChild(Domestic_Box);

	ccreateCheckBox(td21, "OPT_DOME1" , OPT_DOME[1] , " " + DASkill[1]	+ " ", "この都市に来たら、自動的に内政スキル（" + DASkill[1]  + "）を発動します。", 0);
	ccreateCheckBox(td22, "OPT_DOME2" , OPT_DOME[2] , " " + DASkill[2]	+ " ", "この都市に来たら、自動的に内政スキル（" + DASkill[2]  + "）を発動します。", 0);
	ccreateCheckBox(td23, "OPT_DOME16", OPT_DOME[16], " " + DASkill[16] + " ", "この都市に来たら、自動的に内政スキル（" + DASkill[16]  + "）を発動します。", 0);
	ccreateCheckBox(td24, "OPT_DOME12", OPT_DOME[12], " " + DASkill[12] + " ", "この都市に来たら、自動的に内政スキル（" + DASkill[12] + "）を発動します。", 0);
	ccreateCheckBox(td25, "OPT_DOME13", OPT_DOME[13], " " + DASkill[13] + " ", "この都市に来たら、自動的に内政スキル（" + DASkill[13] + "）を発動します。", 0);

	ccreateCheckBox(td21, "OPT_DOME4" , OPT_DOME[4] , " " + DASkill[4]	+ " ", "この都市に来たら、自動的に内政スキル（" + DASkill[4]  + "）を発動します。", 0);
	ccreateCheckBox(td22, "OPT_DOME5" , OPT_DOME[5] , " " + DASkill[5]	+ " ", "この都市に来たら、自動的に内政スキル（" + DASkill[5]  + "）を発動します。", 0);
	ccreateCheckBox(td23, "OPT_DOME17", OPT_DOME[17], " " + DASkill[17] + " ", "この都市に来たら、自動的に内政スキル（" + DASkill[17]  + "）を発動します。", 0);
	ccreateCheckBox(td24, "OPT_DOME14", OPT_DOME[14], " " + DASkill[14] + " ", "この都市に来たら、自動的に内政スキル（" + DASkill[14] + "）を発動します。", 0);
	ccreateCheckBox(td25, "OPT_DOME15", OPT_DOME[15], " " + DASkill[15] + " ", "この都市に来たら、自動的に内政スキル（" + DASkill[15] + "）を発動します。", 0);

	ccreateCheckBox(td21, "OPT_DOME7" , OPT_DOME[7] , " " + DASkill[7]	+ " ", "この都市に来たら、自動的に内政スキル（" + DASkill[7]  + "）を発動します。", 0);
	ccreateCheckBox(td22, "OPT_DOME8" , OPT_DOME[8] , " " + DASkill[8]	+ " ", "この都市に来たら、自動的に内政スキル（" + DASkill[8]  + "）を発動します。", 0);
	ccreateCheckBox(td23, "OPT_DOME18", OPT_DOME[18], " " + DASkill[18] + " ", "この都市に来たら、自動的に内政スキル（" + DASkill[18]  + "）を発動します。", 0);
	ccreateCheckBox(td24, "OPT_DOME19", OPT_DOME[19], " " + DASkill[19], "この都市に来たら、自動的に内政スキル（" + DASkill[19] + "）を発動します。", 0);
	ccreateCheckBox(td25, "OPT_DOME20", OPT_DOME[20], " " + DASkill[20], "この都市に来たら、自動的に内政スキル（" + DASkill[20] + "）を発動します。", 0);

	ccreateCheckBox(td21, "OPT_DOME10", OPT_DOME[10], " " + DASkill[10], "この都市に来たら、自動的に内政スキル（" + DASkill[10]  + "）を発動します。", 0);
	ccreateCheckBox(td22, "OPT_DOME11", OPT_DOME[11], " " + DASkill[11], "この都市に来たら、自動的に内政スキル（" + DASkill[11] + "）を発動します。", 0);
		ccreateText(td23, "Dummy" , "　", 0);
		ccreateText(td24, "Dummy" , "　", 0);
		ccreateText(td25, "Dummy" , "　", 0);

	ccreateCheckBox(td21, "OPT_DOME25", OPT_DOME[25], " " + DASkill[25], "この都市に来たら、自動的に内政スキル（" + DASkill[25]  + "）を発動します。", 0);
	ccreateCheckBox(td22, "OPT_DOME27", OPT_DOME[27], " " + DASkill[27], "この都市に来たら、自動的に内政スキル（" + DASkill[27]  + "）を発動します。", 0);
	ccreateCheckBox(td23, "OPT_DOME29", OPT_DOME[29], " " + DASkill[29], "この都市に来たら、自動的に内政スキル（" + DASkill[29]  + "）を発動します。", 0);
	ccreateCheckBox(td24, "OPT_DOME31", OPT_DOME[31], " " + DASkill[31], "この都市に来たら、自動的に内政スキル（" + DASkill[31]  + "）を発動します。", 0);
	ccreateCheckBox(td25, "OPT_DOME33", OPT_DOME[33], " " + DASkill[33], "この都市に来たら、自動的に内政スキル（" + DASkill[33]  + "）を発動します。", 0);

	ccreateCheckBox(td21, "OPT_DOME26", OPT_DOME[26], " " + DASkill[26], "この都市に来たら、自動的に内政スキル（" + DASkill[26]  + "）を発動します。", 0);
	ccreateCheckBox(td22, "OPT_DOME28", OPT_DOME[28], " " + DASkill[28], "この都市に来たら、自動的に内政スキル（" + DASkill[28]  + "）を発動します。", 0);
	ccreateCheckBox(td23, "OPT_DOME30", OPT_DOME[30], " " + DASkill[30], "この都市に来たら、自動的に内政スキル（" + DASkill[30]  + "）を発動します。", 0);
	ccreateCheckBox(td24, "OPT_DOME32", OPT_DOME[32], " " + DASkill[32], "この都市に来たら、自動的に内政スキル（" + DASkill[32]  + "）を発動します。", 0);
	ccreateCheckBox(td25, "OPT_DOME34", OPT_DOME[34], " " + DASkill[34], "この都市に来たら、自動的に内政スキル（" + DASkill[34]  + "）を発動します。", 0);

		ccreateText(td21, "Dummy" , "　", 0);
	ccreateCheckBox(td22, "OPT_DOME3",	OPT_DOME[3],  " " + DASkill[3], "この都市に来たら、自動的に内政スキル（" + DASkill[3]  + "）を発動します。", 0);
	ccreateCheckBox(td23, "OPT_DOME6",	OPT_DOME[6],  " " + DASkill[6], "この都市に来たら、自動的に内政スキル（" + DASkill[6]  + "）を発動します。", 0);
	ccreateCheckBox(td24, "OPT_DOME9",	OPT_DOME[9],  " " + DASkill[9], "この都市に来たら、自動的に内政スキル（" + DASkill[9]  + "）を発動します。", 0);
		ccreateText(td25, "Dummy" , "　", 0);

	ccreateCheckBox(td21, "OPT_DOME21", OPT_DOME[21], " " + DASkill[21], "この都市に来たら、自動的に内政スキル（" + DASkill[21]  + "）を発動します。", 0);
	ccreateCheckBox(td22, "OPT_DOME22", OPT_DOME[22], " " + DASkill[22], "この都市に来たら、自動的に内政スキル（" + DASkill[22]  + "）を発動します。", 0);
	ccreateCheckBox(td23, "OPT_DOME23", OPT_DOME[23], " " + DASkill[23], "この都市に来たら、自動的に内政スキル（" + DASkill[23]  + "）を発動します。", 0);
	ccreateCheckBox(td24, "OPT_DOME24", OPT_DOME[24], " " + DASkill[24], "この都市に来たら、自動的に内政スキル（" + DASkill[24]  + "）を発動します。", 0);

	ccreateCheckBox(td21, "OPT_DOME37", OPT_DOME[37], " " + DASkill[37], "この都市に来たら、自動的に内政スキル（" + DASkill[37]  + "）を発動します。", 0);
	ccreateCheckBox(td22, "OPT_DOME35", OPT_DOME[35], " " + DASkill[35], "この都市に来たら、自動的に内政スキル（" + DASkill[35]  + "）を発動します。", 0);
	ccreateCheckBox(td23, "OPT_DOME36", OPT_DOME[36], " " + DASkill[36], "この都市に来たら、自動的に内政スキル（" + DASkill[36]  + "）を発動します。", 0);

	// ===== 糧変換設定 =====

	var Market_Box = d.createElement("table");
		Market_Box.style.border ="solid 2px black";
		Market_Box.style.margin = "0px 4px 4px 0px";
		Market_Box.style.width = "100%";

	var tr30 = d.createElement("tr");
		tr30.style.backgroundColor = COLOR_TITLE;

	var td30 = d.createElement("td");
		td30.colSpan = 2;
		ccreateCheckBox(td30, "OPT_ICHIBA", OPT_ICHIBA, " 市場自動変換", "この都市で糧の市場自動変換をします。", 0);

	var tr311 = d.createElement("tr");
		tr311.style.border = "solid 1px black";
		tr311.style.backgroundColor = COLOR_BACK;

	var td311 = d.createElement("td");
		td311.style.padding = "3px 0px 3px 0px";
		td311.style.verticalAlign = "top";

	var td312 = d.createElement("td");
		td312.style.padding = "3px 0px 3px 0px";
		td312.style.verticalAlign = "top";

	Market_Box.appendChild(tr30);
	tr30.appendChild(td30);
	Market_Box.appendChild(tr311);
	tr311.appendChild(td311);
	tr311.appendChild(td312);

//	ABfacContainer.appendChild(Market_Box);

	ccreateTextBox(td311, "OPT_RISE_MAX",		OPT_RISE_MAX,										"自動変換開始量 ",	"自動で糧を他の資源に変換し始める量指定します。", 9, 5);
	ccreateTextBox(td311, "OPT_TO_WOOD",		OPT_TO_WOOD,										"木に変換する量 ",	"自動で木に変換する糧の量を指定します。", 9, 5);
	ccreateTextBox(td311, "OPT_TO_STONE",		OPT_TO_STONE,										"石に変換する量 ",	"自動で石に変換する糧の量を指定します。", 9, 5);
	ccreateTextBox(td311, "OPT_TO_IRON",		OPT_TO_IRON,										"鉄に変換する量 ",	"自動で鉄に変換する糧の量を指定します。", 9, 5);

	ccreateComboBox(td312, "OPT_ICHIBA_PA", OPT_ICHIBA_PATS, OPT_ICHIBA_PA, "変換パターン　 ",				"平均変換：糧が一定量になった際に変換指定している一番少ない資源を変換します。   一括変換：糧が一定量になった際に指定してある資源を指定値変換します。",5);
	ccreateTextBox(td312, "OPT_MAX_WOOD",	OPT_MAX_WOOD,											"木の最大保持量 ",	"木の最大保持量を設定します（0で倉庫上限まで）", 10, 5);
	ccreateTextBox(td312, "OPT_MAX_STONE",	OPT_MAX_STONE,									"石の最大保持量 ",	"石の最大保持量を設定します（0で倉庫上限まで）", 10, 5);
	ccreateTextBox(td312, "OPT_MAX_IRON",	OPT_MAX_IRON,											"鉄の最大保持量 ",	"鉄の最大保持量を設定します（0で倉庫上限まで）", 10, 5);

	// ===== 寄付設定 =====

	var Contribution_Box = d.createElement("table");
		Contribution_Box.style.margin = "0px 4px 4px 0px";
		Contribution_Box.style.border ="solid 2px black";
		Contribution_Box.style.width = "100%";

	var tr400 = d.createElement("tr");
		tr400.style.border = "solid 1px black";
		tr400.style.backgroundColor =COLOR_TITLE;

	var td401 = d.createElement("td");
//		td401.style.padding = "2px";
		ccreateCheckBox(td401, "OPT_KIFU", OPT_KIFU, " 自動寄付", "この都市に来たら、自動的に寄付します。", 0);

	var tr411 = d.createElement("tr");
		tr411.style.border = "solid 1px black";
		tr411.style.backgroundColor =COLOR_BACK;

	var td411 = d.createElement("td");
		td411.style.padding = "3px";
		td411.style.verticalAlign = "top";
		ccreateTextBox(td411, "OPT_RISE_KIFU_MAX", OPT_RISE_KIFU_MAX, "糧が右の数量になったら寄付する　","自動で糧を寄付し始める量指定します。", 10, 5);
		ccreateTextBox(td411, "OPT_RISE_KIFU", OPT_RISE_KIFU,		  "自動で糧を寄付する量　　　　　　","自動で糧を寄付する量指定します。", 10, 5);

	Contribution_Box.appendChild(tr400);
	tr400.appendChild(td401);
	Contribution_Box.appendChild(tr411);
	tr411.appendChild(td411);

	// ===== 宿舎ビルド＆スクラップ設定 =====

	var Scrap_Box = d.createElement("table");
		Scrap_Box.style.margin = "0px 4px 4px 0px";
		Scrap_Box.style.border ="solid 2px black";
		Scrap_Box.style.width = "100%";

	var tr510 = d.createElement("tr");
		tr510.style.border = "solid 1px black";
		tr510.style.backgroundColor =COLOR_TITLE;

	var td510 = d.createElement("td");
		td510.style.padding = "1px";
		td510.appendChild( createRadioBtn ( 'BS', '宿舎ビルスク' ) );

	var tr511 = d.createElement("tr");
		tr511.style.border = "solid 1px black";
		tr511.style.backgroundColor =COLOR_BACK;

	var td511 = d.createElement("td");
		td511.style.padding = "3px";
		td511.style.verticalAlign = "top";

		td511.appendChild( createRadioBtn2 ( 'DD', ' 宿舎対象　' ) );
		td511.appendChild( createRadioBtn2 ( 'HH', ' 畑対象　　' ) );
		ccreateTextBox(td511, "OPT_MAX", OPT_MAX,	  "対象施設数　",	"自動で建築/破棄する施設の数。", 5, 3);
		ccreateTextBox(td511, "OPT_MAXLV", OPT_MAXLV, "対象施設LV　",	"自動で建築/破棄する施設の最大LV。", 5, 3);

	Scrap_Box.appendChild(tr510);
	tr510.appendChild(td510);
	Scrap_Box.appendChild(tr511);
	tr511.appendChild(td511);

	// ===== 糧村化 ===

	var Field_Box = d.createElement("table");
		Field_Box.style.margin = "0px 4px 4px 0px";
		Field_Box.style.border ="solid 2px black";
		Field_Box.style.width = "100%";

	var tr600 = d.createElement("tr");
		tr600.style.border = "solid 1px black";
		tr600.style.backgroundColor =COLOR_TITLE;

	var td600 = d.createElement("td");
//		td600.style.padding = "2px";
		ccreateCheckBox(td600,"OPT_KATEMURA", OPT_KATEMURA, " 糧村化", "この都市を糧村にする。平地に畑・倉庫を建てる。",0);

	var tr611 = d.createElement("td");
		tr611.style.border = "solid 1px black";
		tr611.style.backgroundColor =COLOR_BACK;

	var td611 = d.createElement("td");
		td611.style.padding = "3px";
		td611.style.verticalAlign = "top";
		ccreateTextBox(td611,"OPT_SOUKO_MAX", OPT_SOUKO_MAX,"設置する倉庫の数　","設置する倉庫の数を指定してください。",4,0);

	Field_Box.appendChild(tr600);
	tr600.appendChild(td600);
	Field_Box.appendChild(tr611);
	tr611.appendChild(td611);

	// ===== 水車村化 ===

	var Waterwheel_Box = d.createElement("table");
		Waterwheel_Box.style.margin = "0px 4px 4px 0px";
		Waterwheel_Box.style.border ="solid 2px black";
		Waterwheel_Box.style.width = "100%";

	var tr620 = d.createElement("tr");
		tr620.style.border = "solid 1px black";
		tr620.style.backgroundColor =COLOR_TITLE;

	var td620 = d.createElement("td");
		td620.colSpan = "2";
		ccreateText(td620, "dummy", "■ 水車村化（実験版） ■", 0 );

	var tr621 = d.createElement("tr");
		tr621.style.border = "solid 1px black";
		tr621.style.backgroundColor =COLOR_BACK;

	var td621a = d.createElement("td");
		td621a.style.padding = "2px";
		td621a.style.verticalAlign = "top";
		ccreateCheckBox(td621a, "OPT_1112MURA"	, OPT_1112MURA	, " ★9(1-1-1-2)水車村化", "この都市を水車村にする。",0);
		ccreateCheckBox(td621a, "OPT_0001S5MURA", OPT_0001S5MURA, " ★5(0-0-0-1)水車村化", "この都市を水車村にする。",0);

	var td621b = d.createElement("td");
		td621b.style.padding = "2px";
		td621b.style.verticalAlign = "top";
		ccreateCheckBox(td621b, "OPT_PLANT5MURAN", OPT_PLANT5MURAN, " ★5(北部資源)工場村化", "この都市を工場+水車村にする。",0);
		ccreateCheckBox(td621b, "OPT_PLANT5MURAE", OPT_PLANT5MURAE, " ★5(東部資源)工場村化", "この都市を工場+水車村にする。",0);
		ccreateCheckBox(td621b, "OPT_PLANT5MURAW", OPT_PLANT5MURAW, " ★5(西部資源)工場村化", "この都市を工場+水車村にする。",0);
		ccreateCheckBox(td621b, "OPT_PLANT5MURAS", OPT_PLANT5MURAS, " ★5(南部資源)工場村化", "この都市を工場+水車村にする。",0);

	Waterwheel_Box.appendChild(tr620);
	tr620.appendChild(td620);
	Waterwheel_Box.appendChild(tr621);
	tr621.appendChild(td621a);
	tr621.appendChild(td621b);
//	Waterwheel_Box.appendChild(tr622);
//	tr622.appendChild(td622);
//	Waterwheel_Box.appendChild(tr623);
//	tr623.appendChild(td623);

	// ==== 自動兵産設定 ====

	var Soldier_Box = d.createElement("table");
		Soldier_Box.style.border ="solid 2px black";
		Soldier_Box.style.marginBottom = "4px";
		Soldier_Box.style.width = "100%";

	var tr800 = d.createElement("tr");
		tr800.style.border = "solid 1px black";
		tr800.style.backgroundColor =COLOR_TITLE;

	var td800 = d.createElement("td");
		ccreateCheckBox(td800, "OPT_BLD_SOL", OPT_BLD_SOL, " 自動造兵", "この都市で自動的に造兵します。", 0);

	var tr81 = d.createElement("tr");
		tr81.style.border = "solid 1px black";
		tr81.style.backgroundColor =COLOR_BACK;
	var td81 = d.createElement("td");
		td81.style.padding = "3px";//		td81.style.border = "solid 1px black";

	var tr811 = d.createElement("tr");
	var td811 = d.createElement("td");		td811.style.padding = "3px";	td811.style.verticalAlign = "bottom";
	var td812 = d.createElement("td");		td812.style.padding = "3px";	td812.style.verticalAlign = "top"; td812.style.textAlign = "center";
	var td813 = d.createElement("td");		td813.style.padding = "3px";	td813.style.verticalAlign = "top"; td813.style.textAlign = "center";
	var td814 = d.createElement("td");		td814.style.padding = "3px";	td814.style.verticalAlign = "top"; td814.style.textAlign = "center";
	var td815 = d.createElement("td");		td815.style.padding = "3px";	td815.style.verticalAlign = "top"; td815.style.textAlign = "center";
	var td816 = d.createElement("td");		td816.style.padding = "3px";	td816.style.verticalAlign = "top"; td816.style.textAlign = "center";
	var td817 = d.createElement("td");		td817.style.padding = "3px";	td817.style.verticalAlign = "top"; td817.style.textAlign = "center";
	var td818 = d.createElement("td");		td818.style.padding = "3px";	td818.style.verticalAlign = "top"; td818.style.textAlign = "center";
	var td819 = d.createElement("td");		td819.style.padding = "3px";	td819.style.verticalAlign = "top"; td819.style.textAlign = "center";

	var tr821 = d.createElement("tr");
	var td821 = d.createElement("td");		td821.style.padding = "3px";	td821.style.verticalAlign = "bottom";
	var td822 = d.createElement("td");		td822.style.padding = "3px";	td822.style.verticalAlign = "top"; td822.style.textAlign = "center";
	var td823 = d.createElement("td");		td823.style.padding = "3px";	td823.style.verticalAlign = "top"; td823.style.textAlign = "center";
	var td824 = d.createElement("td");		td824.style.padding = "3px";	td824.style.verticalAlign = "top"; td824.style.textAlign = "center";
	var td825 = d.createElement("td");		td825.style.padding = "3px";	td825.style.verticalAlign = "top"; td825.style.textAlign = "center";
	var td826 = d.createElement("td");		td826.style.padding = "3px";	td826.style.verticalAlign = "top"; td826.style.textAlign = "center";
	var td827 = d.createElement("td");		td827.style.padding = "3px";	td827.style.verticalAlign = "top"; td827.style.textAlign = "center";
	var td828 = d.createElement("td");		td828.style.padding = "3px";	td828.style.verticalAlign = "top"; td828.style.textAlign = "center";
	var td829 = d.createElement("td");		td829.style.padding = "3px";	td829.style.verticalAlign = "top"; td829.style.textAlign = "center";

	Soldier_Box.appendChild(tr800);
		tr800.appendChild(td800);

	Soldier_Box.appendChild(tr81);
		tr81.appendChild(td81);
		td81.appendChild(tr811);
		td81.appendChild(tr821);

		tr811.appendChild(td811);
		tr811.appendChild(td812);
		tr811.appendChild(td813);
		tr811.appendChild(td814);
		tr811.appendChild(td815);
		tr811.appendChild(td816);
		tr811.appendChild(td817);
		tr811.appendChild(td818);
		tr811.appendChild(td819);

		tr821.appendChild(td821);
		tr821.appendChild(td822);
		tr821.appendChild(td823);
		tr821.appendChild(td824);
		tr821.appendChild(td825);
		tr821.appendChild(td826);
		tr821.appendChild(td827);
		tr821.appendChild(td828);
		tr821.appendChild(td829);

//	ABfacContainer.appendChild(Soldier_Box);

	ccreateText(td811, "dummy", "　", 0 );
	ccreateText(td812, "dummy", "槍兵", 0 );
	ccreateText(td813, "dummy", "弓兵", 0 );
	ccreateText(td814, "dummy", "騎兵", 0 );
	ccreateText(td815, "dummy", "矛槍兵", 0 );
	ccreateText(td816, "dummy", "弩兵", 0 );
	ccreateText(td817, "dummy", "近衛騎兵", 0 );
	ccreateText(td818, "dummy", "斥候", 0 );
	ccreateText(td819, "dummy", "斥候騎兵", 0 );

	ccreateText(td811, "dummy", "　兵数上限", 0 );
	ccreateTextBox(td812,"OPT_SOL_MAX3", OPT_SOL_MAX[3],"","槍兵の兵数上限",7,0);
	ccreateTextBox(td813,"OPT_SOL_MAX8", OPT_SOL_MAX[8],"","弓兵の兵数上限",7,0);
	ccreateTextBox(td814,"OPT_SOL_MAX5", OPT_SOL_MAX[5],"","騎兵の兵数上限",7,0);
	ccreateTextBox(td815,"OPT_SOL_MAX4", OPT_SOL_MAX[4],"","矛槍兵の兵数上限",7,0);
	ccreateTextBox(td816,"OPT_SOL_MAX9", OPT_SOL_MAX[9],"","弩兵の兵数上限",7,0);
	ccreateTextBox(td817,"OPT_SOL_MAX7", OPT_SOL_MAX[7],"","近衛騎兵の兵数上限",7,0);
	ccreateTextBox(td818,"OPT_SOL_MAX10", OPT_SOL_MAX[10],"","斥候の兵数上限",7,0);
	ccreateTextBox(td819,"OPT_SOL_MAX11", OPT_SOL_MAX[11],"","斥候騎兵の兵数上限",7,0);

	ccreateText(td811, "dummy", "　作成単位", 0 );
	ccreateTextBox(td812,"OPT_SOL_ADD3", OPT_SOL_ADD[3],"","槍兵の作成単位",7,0);
	ccreateTextBox(td813,"OPT_SOL_ADD8", OPT_SOL_ADD[8],"","弓兵の作成単位",7,0);
	ccreateTextBox(td814,"OPT_SOL_ADD5", OPT_SOL_ADD[5],"","騎兵の作成単位",7,0);
	ccreateTextBox(td815,"OPT_SOL_ADD4", OPT_SOL_ADD[4],"","矛槍兵の作成単位",7,0);
	ccreateTextBox(td816,"OPT_SOL_ADD9", OPT_SOL_ADD[9],"","弩兵の作成単位",7,0);
	ccreateTextBox(td817,"OPT_SOL_ADD7", OPT_SOL_ADD[7],"","近衛騎兵の作成単位",7,0);
	ccreateTextBox(td818,"OPT_SOL_ADD10", OPT_SOL_ADD[10],"","斥候の作成単位",7,0);
	ccreateTextBox(td819,"OPT_SOL_ADD11", OPT_SOL_ADD[11],"","斥候騎兵の作成単位",7,0);

//	ccreateText(td811, "dummy", "　", 0 );
//	ccreateText(td812, "dummy", "　", 0 );
//	ccreateText(td813, "dummy", "　", 0 );
//	ccreateText(td814, "dummy", "　", 0 );
//	ccreateText(td815, "dummy", "　", 0 );
//	ccreateText(td816, "dummy", "　", 0 );
//	ccreateText(td817, "dummy", "　", 0 );
//	ccreateText(td818, "dummy", "　", 0 );
//	ccreateText(td819, "dummy", "　", 0 );

	ccreateText(td821, "dummy", "　", 0 );
	ccreateText(td822, "dummy", "剣兵", 0 );
	ccreateText(td823, "dummy", "大剣兵", 0 );
	ccreateText(td824, "dummy", "盾兵", 0 );
	ccreateText(td825, "dummy", "重盾兵", 0 );
	ccreateText(td826, "dummy", "衝車", 0 );
	ccreateText(td827, "dummy", "投石機", 0 );
	ccreateText(td828, "dummy", "　", 0 );
	ccreateText(td829, "dummy", "　", 0 );

	ccreateText(td821, "dummy", "　兵数上限", 0 );
	ccreateTextBox(td822,"OPT_SOL_MAX1" , OPT_SOL_MAX[1] ,"","剣兵の兵数上限",7,0);
	ccreateTextBox(td823,"OPT_SOL_MAX15", OPT_SOL_MAX[15],"","大剣兵の兵数上限",7,0);
	ccreateTextBox(td824,"OPT_SOL_MAX16", OPT_SOL_MAX[16],"","盾兵の兵数上限",7,0);
	ccreateTextBox(td825,"OPT_SOL_MAX17", OPT_SOL_MAX[17],"","重盾兵の兵数上限",7,0);
	ccreateTextBox(td826,"OPT_SOL_MAX12", OPT_SOL_MAX[12],"","衝車の兵数上限",7,0);
	ccreateTextBox(td827,"OPT_SOL_MAX13", OPT_SOL_MAX[13],"","投石機の兵数上限",7,0);
	ccreateText(td828, "dummy", "　", 0 );
	ccreateText(td829, "dummy", "　", 0 );

	ccreateText(td821, "dummy", "　作成単位", 0 );
	ccreateTextBox(td822,"OPT_SOL_ADD1" , OPT_SOL_ADD[1] ,"","剣兵の作成単位",7,0);
	ccreateTextBox(td823,"OPT_SOL_ADD15", OPT_SOL_ADD[15],"","大剣兵の作成単位",7,0);
	ccreateTextBox(td824,"OPT_SOL_ADD16", OPT_SOL_ADD[16],"","盾兵の作成単位",7,0);
	ccreateTextBox(td825,"OPT_SOL_ADD17", OPT_SOL_ADD[17],"","重盾兵の作成単位",7,0);
	ccreateTextBox(td826,"OPT_SOL_ADD12", OPT_SOL_ADD[12],"","衝車の作成単位",7,0);
	ccreateTextBox(td827,"OPT_SOL_ADD13", OPT_SOL_ADD[13],"","投石機の作成単位",7,0);
	ccreateText(td828, "dummy", "　", 0 );
	ccreateButton(td829, "作成中止", "兵士の作成単位を初期化します。", function() {clearInitSoldier()});


	// ===== 自動 武器・防具強化 ====

	var Blacksmith_Box = d.createElement("table");
		Blacksmith_Box.style.border ="solid 2px black";
		Blacksmith_Box.style.marginBottom = "4px";
		Blacksmith_Box.style.width = "100%";

	var tr900 = d.createElement("tr");
		tr900.style.border = "solid 1px black";
		tr900.style.backgroundColor =COLOR_TITLE;

	var td900 = d.createElement("td");
		ccreateCheckBox(td900, "OPT_BKBG_CHK", OPT_BKBG_CHK, " 自動武器・防具強化", "この都市で自動的に武器・防具の強化をします。", 0);

	var tr91 = d.createElement("tr");
		tr91.style.border = "solid 1px black";
		tr91.style.backgroundColor =COLOR_BACK;
	var td91 = d.createElement("td");
		td91.style.padding = "3px";

	var tr911 = d.createElement("tr");
	var td911 = d.createElement("td");		td911.style.padding = "3px";		td911.style.verticalAlign = "bottom";
	var td912 = d.createElement("td");		td912.style.padding = "3px";		td912.style.verticalAlign = "top";	td912.style.textAlign = "center";
	var td913 = d.createElement("td");		td913.style.padding = "3px";		td913.style.verticalAlign = "top";	td913.style.textAlign = "center";
	var td914 = d.createElement("td");		td914.style.padding = "3px";		td914.style.verticalAlign = "top";	td914.style.textAlign = "center";
	var td915 = d.createElement("td");		td915.style.padding = "3px";		td915.style.verticalAlign = "top";	td915.style.textAlign = "center";
	var td916 = d.createElement("td");		td916.style.padding = "3px";		td916.style.verticalAlign = "top";	td916.style.textAlign = "center";
	var td917 = d.createElement("td");		td917.style.padding = "3px";		td917.style.verticalAlign = "top";	td917.style.textAlign = "center";
	var td918 = d.createElement("td");		td918.style.padding = "3px";		td918.style.verticalAlign = "top";	td918.style.textAlign = "center";
	var td919 = d.createElement("td");		td919.style.padding = "3px";		td919.style.verticalAlign = "top";	td919.style.textAlign = "center";
	var td920 = d.createElement("td");		td920.style.padding = "3px";		td920.style.verticalAlign = "top";	td920.style.textAlign = "center";
	var td921 = d.createElement("td");		td921.style.padding = "3px";		td921.style.verticalAlign = "top";	td921.style.textAlign = "center";
	var td922 = d.createElement("td");		td922.style.padding = "3px";		td922.style.verticalAlign = "top";	td922.style.textAlign = "center";
	var td923 = d.createElement("td");		td911.style.padding = "3px";		td911.style.verticalAlign = "bottom";
	var td924 = d.createElement("td");		td912.style.padding = "3px";		td912.style.verticalAlign = "top";	td912.style.textAlign = "center";
	var td925 = d.createElement("td");		td913.style.padding = "3px";		td913.style.verticalAlign = "top";	td913.style.textAlign = "center";

	Blacksmith_Box.appendChild(tr900);
		tr900.appendChild(td900);
	Blacksmith_Box.appendChild(tr91);
		tr91.appendChild(td91);
		td91.appendChild(tr911);

		tr911.appendChild(td911);
		tr911.appendChild(td912);
		tr911.appendChild(td913);
		tr911.appendChild(td914);
		tr911.appendChild(td915);
		tr911.appendChild(td916);
		tr911.appendChild(td917);
		tr911.appendChild(td918);
		tr911.appendChild(td919);

//	ABfacContainer.appendChild(Blacksmith_Box);

	ccreateText(td911, "dummy", "　", 0 );
	ccreateText(td912, "dummy", "槍兵", 0 );
	ccreateText(td913, "dummy", "弓兵", 0 );
	ccreateText(td914, "dummy", "騎兵", 0 );
	ccreateText(td915, "dummy", "矛槍兵", 0 );
	ccreateText(td916, "dummy", "弩兵", 0 );
	ccreateText(td917, "dummy", "近衛騎兵", 0 );
	ccreateText(td918, "dummy", "斥候", 0 );
	ccreateText(td919, "dummy", "斥候騎兵", 0 );


	ccreateText(td911, "dummy", "武器レベル", 0 );
	ccreateTextBox(td912,"OPT_BK_LV3", OPT_BK_LV[3],"","槍兵の武器レベル",7,0);
	ccreateTextBox(td913,"OPT_BK_LV8", OPT_BK_LV[8],"","弓兵の武器レベル",7,0);
	ccreateTextBox(td914,"OPT_BK_LV5", OPT_BK_LV[5],"","騎兵の武器レベル",7,0);
	ccreateTextBox(td915,"OPT_BK_LV4", OPT_BK_LV[4],"","矛槍兵の武器レベル",7,0);
	ccreateTextBox(td916,"OPT_BK_LV9", OPT_BK_LV[9],"","弩兵の武器レベル",7,0);
	ccreateTextBox(td917,"OPT_BK_LV7", OPT_BK_LV[7],"","近衛騎兵の武器レベル",7,0);
	ccreateText(td918, "dummy", "　", 0 );
	ccreateText(td919, "dummy", "　", 0 );

	ccreateText(td911, "dummy", "防具レベル", 0 );
	ccreateTextBox(td912,"OPT_BG_LV3", OPT_BG_LV[3],"","槍兵の防具レベル",7,0);
	ccreateTextBox(td913,"OPT_BG_LV8", OPT_BG_LV[8],"","弓兵の防具レベル",7,0);
	ccreateTextBox(td914,"OPT_BG_LV5", OPT_BG_LV[5],"","騎兵の防具レベル",7,0);
	ccreateTextBox(td915,"OPT_BG_LV4", OPT_BG_LV[4],"","矛槍兵の防具レベル",7,0);
	ccreateTextBox(td916,"OPT_BG_LV9", OPT_BG_LV[9],"","弩兵の防具レベル",7,0);
	ccreateTextBox(td917,"OPT_BG_LV7", OPT_BG_LV[7],"","近衛騎兵の防具レベル",7,0);
	ccreateTextBox(td918,"OPT_BG_LV10", OPT_BG_LV[10],"","斥候の防具レベル",7,0);
	ccreateTextBox(td919,"OPT_BG_LV11", OPT_BG_LV[11],"","斥候騎兵の防具レベル",7,0);

	ccreateText(td911, "dummy", "　", 0 );
	ccreateText(td912, "dummy", "　", 0 );
	ccreateText(td913, "dummy", "　", 0 );
	ccreateText(td914, "dummy", "　", 0 );
	ccreateText(td915, "dummy", "　", 0 );
	ccreateText(td916, "dummy", "　", 0 );
	ccreateText(td917, "dummy", "　", 0 );
	ccreateText(td918, "dummy", "　", 0 );
	ccreateText(td919, "dummy", "　", 0 );

	ccreateText(td911, "dummy", "　", 0 );
	ccreateText(td912, "dummy", "剣兵", 0 );
	ccreateText(td913, "dummy", "大剣兵", 0 );
	ccreateText(td914, "dummy", "盾兵", 0 );
	ccreateText(td915, "dummy", "重盾兵", 0 );
	ccreateText(td916, "dummy", "衝車", 0 );
	ccreateText(td917, "dummy", "投石機", 0 );
	ccreateText(td918, "dummy", "　", 0 );
	ccreateText(td919, "dummy", "　", 0 );


	ccreateText(td911, "dummy", "武器レベル", 0 );
	ccreateTextBox(td912,"OPT_BK_LV1" , OPT_BK_LV[1] ,"","剣兵の武器レベル",7,0);
	ccreateTextBox(td913,"OPT_BK_LV15", OPT_BK_LV[15],"","大剣兵の武器レベル",7,0);
	ccreateTextBox(td914,"OPT_BK_LV16", OPT_BK_LV[16],"","盾兵の武器レベル",7,0);
	ccreateTextBox(td915,"OPT_BK_LV17", OPT_BK_LV[17],"","重盾兵の武器レベル",7,0);
	ccreateTextBox(td916,"OPT_BK_LV12", OPT_BK_LV[12],"","衝車の武器レベル",7,0);
	ccreateTextBox(td917,"OPT_BK_LV13", OPT_BK_LV[13],"","投石機の武器レベル",7,0);
	ccreateText(td918, "dummy", "　", 0 );
	ccreateText(td919, "dummy", "　", 0 );

	ccreateText(td911, "dummy", "防具レベル", 0 );
	ccreateTextBox(td912,"OPT_BG_LV1" , OPT_BG_LV[1] ,"","剣兵の防具レベル",7,0);
	ccreateTextBox(td913,"OPT_BG_LV15", OPT_BG_LV[15],"","大剣兵の防具レベル",7,0);
	ccreateTextBox(td914,"OPT_BG_LV16", OPT_BG_LV[16],"","盾兵の防具レベル",7,0);
	ccreateTextBox(td915,"OPT_BG_LV17", OPT_BG_LV[17],"","重盾兵の防具レベル",7,0);
	ccreateTextBox(td916,"OPT_BG_LV12", OPT_BG_LV[12],"","衝車の防具レベル",7,0);
	ccreateTextBox(td917,"OPT_BG_LV13", OPT_BG_LV[13],"","投石機の防具レベル",7,0);
	ccreateText(td918, "dummy", "　", 0 );
	ccreateButton(td919, "初期化", "武器・防具の設定レベルを消去します。", function() {clearInitArmsArmor()});


	// ===== 残す資源量 ====

	var Storage_Box = d.createElement("table");
		Storage_Box.style.border ="solid 2px black";
		Storage_Box.style.marginBottom = "4px";
		Storage_Box.style.width = "100%";

	var tra10 = d.createElement("tr");
		tra10.style.border = "solid 1px black";
		tra10.style.backgroundColor =COLOR_TITLE;

	var tda10 = d.createElement("td");
		ccreateText(tda10, "dummy", "■ 自動造兵・武器防具強化時に残す資源量 ■", 0 );

	var tra1 = d.createElement("tr");
		tra1.style.border = "solid 1px black";
		tra1.style.backgroundColor =COLOR_BACK;
	var tda1 = d.createElement("td");
		tda1.style.padding = "2px";
	var tra11 = d.createElement("tr");
	var tra21 = d.createElement("tr");
	var tda11 = d.createElement("td");
		tda11.style.padding = "2px";
		tda11.style.verticalAlign = "bottom";
	var tda12 = d.createElement("td");
		tda12.style.padding = "2px";
	tda12.style.verticalAlign = "top";
		tda12.style.textAlign = "center";
	var tda13 = d.createElement("td");
		tda13.style.padding = "2px";
		tda13.style.verticalAlign = "top";
		tda13.style.textAlign = "center";
	var tda14 = d.createElement("td");
		tda14.style.padding = "2px";
		tda14.style.verticalAlign = "top";
		tda14.style.textAlign = "center";
	var tda15 = d.createElement("td");
		tda15.style.padding = "2px";
		tda15.style.verticalAlign = "top";
		tda15.style.textAlign = "center";
//	var tda16 = d.createElement("td");
//		tda16.style.padding = "0px";
//		tda16.style.verticalAlign = "top";
//		tda16.style.textAlign = "center";

	Storage_Box.appendChild(tra10);
		tra10.appendChild(tda10);
	Storage_Box.appendChild(tra1);
		tra1.appendChild(tda1);
		tda1.appendChild(tra11);

		tra11.appendChild(tda11);
		tra11.appendChild(tda12);
		tra11.appendChild(tda13);
		tra11.appendChild(tda14);
		tra11.appendChild(tda15);
//		tra11.appendChild(tda16);


	ccreateText(tda11, "dummy", "　", 0 );
	ccreateText(tda12, "dummy", "木", 0 );
	ccreateText(tda13, "dummy", "石", 0 );
	ccreateText(tda14, "dummy", "鉄", 0 );
	ccreateText(tda15, "dummy", "糧", 0 );

	ccreateText(tda11, "dummy", "残す資源量", 0 );
	ccreateTextBox(tda12,"OPT_BLD_WOOD", OPT_BLD_WOOD,"","木を残す量",7,0);
	ccreateTextBox(tda13,"OPT_BLD_STONE", OPT_BLD_STONE,"","石を残す量",7,0);
	ccreateTextBox(tda14,"OPT_BLD_IRON", OPT_BLD_IRON,"","鉄を残す量",7,0);
	ccreateTextBox(tda15,"OPT_BLD_RICE", OPT_BLD_RICE,"","糧を残す量",7,0);

	ccreateText(tda11, "dummy", "　", 0 );
//	ccreateText(tda12, "dummy", "　", 0 );
//	ccreateText(tda13, "dummy", "　", 0 );
//	ccreateText(tda14, "dummy", "　", 0 );
	ccreateButton(tda15, "初期化", "残す資源量の設定内容を消去します。", function() {clearInitRemainingRes()},54,0);

	// ===== 宿舎村設定 ===== 2013.12.26
	var dorm_Box = d.createElement("table");
		dorm_Box.style.margin = "0px 4px 4px 0px";
		dorm_Box.style.border ="solid 2px black";
		dorm_Box.style.width = "100%";
		if (WangRay != true) { dorm_Box.style.display = "none"; }

	var trc10 = d.createElement("tr");
		trc10.style.border = "solid 1px black";
		trc10.style.backgroundColor =COLOR_TITLE;

	var tdc10 = d.createElement("td");
		tdc10.style.padding = "1px";
		ccreateCheckBox(tdc10,"OPT_DORM", OPT_DORM, " 宿舎村化", "この都市を宿舎村にする。平地に宿舎・倉庫・鍛冶場を建てる。",0);

	var trc11 = d.createElement("tr");
		trc11.style.border = "solid 1px black";
		trc11.style.backgroundColor =COLOR_BACK;

	var tdc11 = d.createElement("td");
		tdc11.style.padding = "3px";
		tdc11.style.verticalAlign = "top";

	ccreateText(tdc11, "dummy", "宿舎村を建設します。", 0 );
	ccreateText(tdc11, "dummy", "練兵所Lv3がある場合は鍛冶場を建設します。", 0 );

	dorm_Box.appendChild(trc10);
	dorm_Box.appendChild(trc11);
	trc10.appendChild(tdc10);
	trc11.appendChild(tdc11);

	// ===== チュートリアル設定 =====

	var tut_Box = d.createElement("table");
		tut_Box.style.margin = "0px 4px 4px 0px";
		tut_Box.style.border ="solid 2px black";
		tut_Box.style.width = "100%";
		if (WangRay != true) { tut_Box.style.display = "none"; }

	var trb10 = d.createElement("tr");
		trb10.style.border = "solid 1px black";
		trb10.style.backgroundColor =COLOR_TITLE;

	var tdb10 = d.createElement("td");
		tdb10.style.padding = "1px";
		tdb10.appendChild( createRadioBtn ( 'TU', '自動チュートリアル' ) );

	var trb11 = d.createElement("tr");
		trb11.style.border = "solid 1px black";
		trb11.style.backgroundColor =COLOR_BACK;

	var tdb11 = d.createElement("td");
		tdb11.style.padding = "3px";
		tdb11.style.verticalAlign = "top";

	ccreateText(tdb11, "dummy", "チュートリアルを完遂します。", 0 );
	ccreateText(tdb11, "dummy", "最初に武将の出兵・ステータス割振り。内政武将の設定をお願いします。", 0 );

	tut_Box.appendChild(trb10);
	tut_Box.appendChild(trb11);
	trb10.appendChild(tdb10);
	trb11.appendChild(tdb11);

	// ===== 確認 ====

	var Operation_Box = d.createElement("table");
		Operation_Box.style.border ="solid 0px gray";

	var tr711 = d.createElement("tr");
	var td711 = d.createElement("td");
		td711.style.padding = "3px";
		td711.style.verticalAlign = "top";

	Operation_Box.appendChild(tr711);
		tr711.appendChild(td711);

	ccreateButton(td711, "保存", "設定内容を保存します", function() {
		SaveInifacBox(ABfacContainer.getAttribute('vId'))
		alert("保存しました");
	});
	ccreateButton(td711, "閉じる", "設定内容を保存せず閉じます", function() {
		closeInifacBox();
		if (tidMain2 != undefined) { clearInterval(tidMain2); }
		tidMain2=setTimeout(function(){location.reload();},INTERVAL);
	});


	if (vId == villages[0][IDX_XY]) {
		ccreateButton(td711, "市場情報初期化", "市場情報を初期化します", function() {

			csaveData(HOST+"ShopList",[],true,true);
			closeIniBilderBox()
			openIniBilderBox()
			alert("市場情報を初期化しました");
		},90);
	}

	// == コンテナ設定 ==
	// 上段
	var tbl000 = d.createElement("table");	// 全体
		tbl000.style.border = "solid 0px lime";

	var tr000 = d.createElement("tr");
	var td001 = d.createElement("td");	// 左枠
		td001.style.verticalAlign = "top";
		td001.style.width = "auto";

		td001.appendChild(Build_Box);

		// 本拠地かどうか
		if (vId == villages[0][IDX_XY]) {
			td001.appendChild(tut_Box); 				// 2013.12.18
		}

		td001.appendChild(Domestic_Box)

		// 本拠地かどうか
		if (vId == villages[0][IDX_XY]) {
			td001.appendChild(Market_Box)
		}


	var td002 = d.createElement("td");	// 右枠
		td002.style.verticalAlign = "top";
		td002.style.paddingLeft = "4px";
		td002.style.width = "Auto";


		td002.appendChild(Scrap_Box);
		td002.appendChild(Field_Box);		// 糧村化設定
		td002.appendChild(Waterwheel_Box);	// 水車村
		td002.appendChild(dorm_Box);		// 宿舎村化設定 2013.12.26


		td002.appendChild(Contribution_Box);
		td002.appendChild(Storage_Box);
		td002.appendChild(Remove_Box); // 2015.05.10

	// 中段
	var tbl010 = d.createElement("table");
		tbl010.style.border = "solid 0px red";

	var tr010 = d.createElement("tr");
		tr010.style.verticalAlign = "top";

	var td011 = d.createElement("td");

	var td012 = d.createElement("td");

	var td013 = d.createElement("td");

	//	レイアウト

	ABfacContainer.appendChild(tbl000);
		tbl000.appendChild(tr000);
		tr000.appendChild(td001);
		tr000.appendChild(td002);

	ABfacContainer.appendChild(tbl010);
		tbl010.appendChild(tr010);
		tr010.appendChild(td011);
		tr010.appendChild(td012);
		tr010.appendChild(td013);

	ABfacContainer.appendChild(Soldier_Box);
	ABfacContainer.appendChild(Blacksmith_Box);
	ABfacContainer.appendChild(Operation_Box);

}

// ラジオボタン生成 @@@@ add 2011.09.06
function createRadioBtn ( value, txt ) {
	var radioLabel = document.createElement('label');
	radioLabel.style.display = 'inline-block';
	radioLabel.style.margin = '0 5px 0 0';
	radioLabel.style.padding = '0px';
//	dv.style.padding = "2px";
//	  radioLabel.addEventListener ( 'click', function(){GM_setValue( 'tweetOpt', value );}, true );
	radioLabel.addEventListener ( 'click', function(){ OPT_BLD = value;}, true );
	var radioLabelText = document.createTextNode(" " + txt);
	var radioButton = document.createElement('input');
	radioButton.type = 'radio';
	radioButton.name = 'tweetOpt';
	radioButton.value = value;
	radioButton.style.verticalAlign = "top";
//	  radioButton.style.margin = '0 2px 0 0';
	if ( OPT_BLD == value ) radioButton.checked = true;
	radioLabel.appendChild( radioButton );
	radioLabel.appendChild( radioLabelText );
	return radioLabel;
}

function createRadioBtn2 ( value, txt ) {
	var radioLabel = document.createElement('label');
	radioLabel.style.display = 'inline-block';
	radioLabel.style.margin = '0 5px 0 0';
	radioLabel.style.padding = '0px';
	radioLabel.addEventListener ( 'click', function(){ OPT_SorH = value; }, true );
	var radioLabelText = document.createTextNode(txt);
	var radioButton = document.createElement('input');
	radioButton.type = 'radio';
	radioButton.name = 'SorH';
	radioButton.value = value;
//	  radioButton.style.margin = '0 2px 0 0';
	radioButton.style.verticalAlign = "top";
	if ( OPT_SorH == value ) radioButton.checked = true;
	radioLabel.appendChild( radioButton );
	radioLabel.appendChild( radioLabelText );
	return radioLabel;
}

//拠点単位の設定の保存（XY MAX_LV CheckData)
function SaveInifacBox(vId){

	// 本拠地
	var i;
	var opt = $("OPT_MAX_LV");
	strSave = cgetTextBoxValue(opt) + DELIMIT1;
	for(i=0; i<=22;i++){
		var opt = $("OPT_CHKBOX"+i);
		strSave += cgetCheckBoxValue(opt) + DELIMIT2;
	}
	//市場変換処理用
	strSave += cgetCheckBoxValue($("OPT_ICHIBA")) + DELIMIT2; //市場で変換するかどうかのフラグ
	strSave += cgetTextBoxValue($("OPT_RISE_MAX")) + DELIMIT2;
	strSave += cgetTextBoxValue($("OPT_TO_WOOD")) + DELIMIT2;
	strSave += cgetTextBoxValue($("OPT_TO_STONE")) + DELIMIT2;
	strSave += cgetTextBoxValue($("OPT_TO_IRON")) + DELIMIT2;
	//糧村化
	strSave += cgetCheckBoxValue($("OPT_KATEMURA")) + DELIMIT2;
	strSave += cgetTextBoxValue($("OPT_SOUKO_MAX")) + DELIMIT2;

	//自動寄付用
	strSave += cgetCheckBoxValue($("OPT_KIFU")) + DELIMIT2; //寄付するかどうかのフラグ
	strSave += cgetTextBoxValue($("OPT_RISE_KIFU_MAX")) + DELIMIT2;
	strSave += cgetTextBoxValue($("OPT_RISE_KIFU")) + DELIMIT2; //自動内政用に修正

	//自動内政用 by nottisan ここから追加
	// ＠＠　追加　＠＠
	strSave += cgetComboBoxValue($("OPT_ICHIBA_PA")) + DELIMIT2; //市場での変換パターンフラグ
	try {
		strSave += cgetCheckBoxValue($("OPT_DOME1")) + DELIMIT2; //内政使用するかのフラグ
		strSave += cgetCheckBoxValue($("OPT_DOME2")) + DELIMIT2; //内政使用するかのフラグ
		strSave += cgetCheckBoxValue($("OPT_DOME3")) + DELIMIT2; //内政使用するかのフラグ
		strSave += cgetCheckBoxValue($("OPT_DOME4")) + DELIMIT2; //内政使用するかのフラグ
		strSave += cgetCheckBoxValue($("OPT_DOME5")) + DELIMIT2; //内政使用するかのフラグ
		strSave += cgetCheckBoxValue($("OPT_DOME6")) + DELIMIT2; //内政使用するかのフラグ
		strSave += cgetCheckBoxValue($("OPT_DOME7")) + DELIMIT2; //内政使用するかのフラグ
		strSave += cgetCheckBoxValue($("OPT_DOME8")) + DELIMIT2; //内政使用するかのフラグ
		strSave += cgetCheckBoxValue($("OPT_DOME9")) + DELIMIT2; //内政使用するかのフラグ
		strSave += cgetCheckBoxValue($("OPT_DOME10")) + DELIMIT2; //内政使用するかのフラグ
		strSave += cgetCheckBoxValue($("OPT_DOME11")) + DELIMIT2; //内政使用するかのフラグ
		strSave += cgetCheckBoxValue($("OPT_DOME12")) + DELIMIT2; //内政使用するかのフラグ
		strSave += cgetCheckBoxValue($("OPT_DOME13")) + DELIMIT2; //内政使用するかのフラグ
		strSave += cgetCheckBoxValue($("OPT_DOME14")) + DELIMIT2; //内政使用するかのフラグ
		strSave += cgetCheckBoxValue($("OPT_DOME15")) + DELIMIT2; //内政使用するかのフラグ
		strSave += cgetCheckBoxValue($("OPT_DOME16")) + DELIMIT2; //内政使用するかのフラグ
		strSave += cgetCheckBoxValue($("OPT_DOME17")) + DELIMIT2; //内政使用するかのフラグ
		strSave += cgetCheckBoxValue($("OPT_DOME18")) + DELIMIT2; //内政使用するかのフラグ
		strSave += cgetCheckBoxValue($("OPT_DOME19")) + DELIMIT2; //内政使用するかのフラグ
		strSave += cgetCheckBoxValue($("OPT_DOME20")) + DELIMIT2; //内政使用するかのフラグ
		strSave += cgetCheckBoxValue($("OPT_DOME21")) + DELIMIT2; //内政使用するかのフラグ
		strSave += cgetCheckBoxValue($("OPT_DOME22")) + DELIMIT2; //内政使用するかのフラグ
		strSave += cgetCheckBoxValue($("OPT_DOME23")) + DELIMIT2; //内政使用するかのフラグ
		strSave += cgetCheckBoxValue($("OPT_DOME24")) + DELIMIT2; //内政使用するかのフラグ
		strSave += cgetCheckBoxValue($("OPT_DOME25")) + DELIMIT2; //内政使用するかのフラグ
		strSave += cgetCheckBoxValue($("OPT_DOME26")) + DELIMIT2; //内政使用するかのフラグ
		strSave += cgetCheckBoxValue($("OPT_DOME27")) + DELIMIT2; //内政使用するかのフラグ
		strSave += cgetCheckBoxValue($("OPT_DOME28")) + DELIMIT2; //内政使用するかのフラグ
		strSave += cgetCheckBoxValue($("OPT_DOME29")) + DELIMIT2; //内政使用するかのフラグ
		strSave += cgetCheckBoxValue($("OPT_DOME30")) + DELIMIT2; //内政使用するかのフラグ
		strSave += cgetCheckBoxValue($("OPT_DOME31")) + DELIMIT2; //内政使用するかのフラグ
		strSave += cgetCheckBoxValue($("OPT_DOME32")) + DELIMIT2; //内政使用するかのフラグ
		strSave += cgetCheckBoxValue($("OPT_DOME33")) + DELIMIT2; //内政使用するかのフラグ
		strSave += cgetCheckBoxValue($("OPT_DOME34")) + DELIMIT2; //内政使用するかのフラグ
		strSave += cgetCheckBoxValue($("OPT_DOME35")) + DELIMIT2; //内政使用するかのフラグ
		strSave += cgetCheckBoxValue($("OPT_DOME36")) + DELIMIT2; //内政使用するかのフラグ
		strSave += cgetCheckBoxValue($("OPT_DOME37")) + DELIMIT2; //内政使用するかのフラグ
		strSave += cgetCheckBoxValue($("OPT_DOME38")) + DELIMIT2; //内政使用するかのフラグ
		strSave += cgetCheckBoxValue($("OPT_DOME39")) + DELIMIT2; //内政使用するかのフラグ
		strSave += cgetCheckBoxValue($("OPT_DOME40")) + DELIMIT2; //内政使用するかのフラグ
	} catch(e) {
		strSave += 0 + DELIMIT2; //内政使用するかのフラグ
	}
	// 施設ごとの建設レベル保存用
	for(i=0; i<=22;i++) {
		var opt = $("OPT_CHKBOXLV" + i);
		strSave += cgetTextBoxValue(opt) + DELIMIT2;
	}

	strSave += cgetTextBoxValue($("OPT_MAX_WOOD")) + DELIMIT2;
	strSave += cgetTextBoxValue($("OPT_MAX_STONE")) + DELIMIT2;
	strSave += cgetTextBoxValue($("OPT_MAX_IRON")) + DELIMIT2;

	strSave += OPT_BLD	 + DELIMIT2;			// 建築 or ビルスク
	strSave += OPT_SorH  + DELIMIT2;			// 畑 or 宿舎
	strSave += cgetTextBoxValue($("OPT_MAX")) + DELIMIT2;	// 対象上限数

	if (cgetTextBoxValue($("OPT_MAXLV")) < 16) {
		strSave += cgetTextBoxValue($("OPT_MAXLV")) + DELIMIT2; // 対象上限LV
	} else {
		strSave += 15 + DELIMIT2;	// 対象上限LV
	}
	// 兵作成情報の保存
	for (i=0;i<18;i++){
		var opt = $("OPT_SOL_MAX" + i);
		strSave += cgetTextBoxValue(opt) + DELIMIT2;
	}
	for (i=0;i<18;i++){
		var opt = $("OPT_SOL_ADD" + i);
		strSave += cgetTextBoxValue(opt) + DELIMIT2;
	}
	strSave += cgetCheckBoxValue($("OPT_BLD_SOL")) + DELIMIT2;; //自動造兵するかのフラグ

	strSave += cgetTextBoxValue($("OPT_BLD_WOOD"))	+ DELIMIT2;
	strSave += cgetTextBoxValue($("OPT_BLD_STONE")) + DELIMIT2;
	strSave += cgetTextBoxValue($("OPT_BLD_IRON"))	+ DELIMIT2;
	strSave += cgetTextBoxValue($("OPT_BLD_RICE"))	+ DELIMIT2;

	for (i=0;i<18;i++){
		if ((i == 10) || (i == 11)) {
			strSave += "0" + DELIMIT2;
		} else {
			var opt = $("OPT_BK_LV" + i);
			if (cgetTextBoxValue(opt) > 10) {
				strSave += "10" + DELIMIT2;
			} else {
				strSave += cgetTextBoxValue(opt) + DELIMIT2;
			}
		}
	}
	for (i=0;i<18;i++){
		var opt = $("OPT_BG_LV" + i);
		if (cgetTextBoxValue(opt) > 10) {
			strSave += "10" + DELIMIT2;
		} else {
			strSave += cgetTextBoxValue(opt) + DELIMIT2;
		}
	}
	strSave += cgetCheckBoxValue($("OPT_BKBG_CHK")) + DELIMIT2; 		//自動武器・防具強化するかのフラグ
	strSave += cgetCheckBoxValue($("OPT_DORM")) + DELIMIT2; 		// 宿舎村 2013.12.26

	// 自動削除 2015.05.10
	strSave += cgetCheckBoxValue($("OPT_REMOVE")) + DELIMIT2;
	for(i=0; i<=22;i++) {
		var opt = $("OPT_RM_CHKBOX"+i);
		strSave += cgetCheckBoxValue(opt) + DELIMIT2;
	}
	for(i=0; i<=22;i++) {
		var opt = $("OPT_RM_CHKBOXLV" + i);
		strSave += cgetTextBoxValue(opt) + DELIMIT2;
	}

	// 水車村 2015.05.23
	strSave += cgetCheckBoxValue($("OPT_1112MURA")) + DELIMIT2;
	strSave += cgetCheckBoxValue($("OPT_0001S5MURA")) + DELIMIT2;
	strSave += cgetCheckBoxValue($("OPT_PLANT5MURAN")) + DELIMIT2;
	strSave += cgetCheckBoxValue($("OPT_PLANT5MURAE")) + DELIMIT2;
	strSave += cgetCheckBoxValue($("OPT_PLANT5MURAW")) + DELIMIT2;
	strSave += cgetCheckBoxValue($("OPT_PLANT5MURAS")) + DELIMIT2;

	GM_setValue(HOST+PGNAME+vId, strSave);
}
//拠点単位の設定の読み込み
function Load_OPT(vId){

debugLog("=== Start Load_OPT ===");
	var src = GM_getValue(HOST+PGNAME+vId, "");
	if (src == "") {
		debugLog("拠点データなし");
		// 拠点データがない場合

		OPT_KATEMURA		= 0;
		OPT_1112MURA		= 0;
		OPT_0001S5MURA		= 0;
		OPT_PLANT5MURAN		= 0;
		OPT_PLANT5MURAE		= 0;
		OPT_PLANT5MURAW		= 0;
		OPT_PLANT5MURAS		= 0;
		OPT_DORM			= 0;				// 2013.12.16
		OPT_SOUKO_MAX		= 0;
		OPT_KIFU			= 0;
		OPT_RISE_KIFU_MAX	= 0;
		OPT_RISE_KIFU		= 0;
		OPT_REMOVE		= 0; // 2015.05.10
		for(i=1; i<=40; i++){ OPT_DOME[i]	  = 0;}
		for(i=0; i<=22; i++){ OPT_CHKBOX[i]   = 0;}
		for(i=0; i<=22; i++){ OPT_CHKBOXLV[i] = "0";}
		for(i=0; i<=22; i++){ OPT_RM_CHKBOX[i]	 = 0;}	 // 2015.05.10
		for(i=0; i<=22; i++){ OPT_RM_CHKBOXLV[i] = "0";} // 2015.05.10

		//市場変換処理用 （本拠地情報にデータがある）
		var villages = loadVillages(HOST+PGNAME);
		var src2 = GM_getValue(HOST+PGNAME+villages[0][IDX_XY], "");
		if (src2 == "") {
			OPT_ICHIBA	  = 0;		// 市場自動変換の利用有無
			OPT_RISE_MAX  = 0;		// 糧の自動変換開始量
			OPT_TO_WOOD   = 0;		// 木に変換する糧の量
			OPT_TO_STONE  = 0;		// 石　　　 〃
			OPT_TO_IRON   = 0;		// 鉄		〃
			OPT_ICHIBA_PA = 0;		// 変換パターン
			OPT_MAX_WOOD  = 0;		// 木の最大保持量（この量を超えたら変換しない）
			OPT_MAX_STONE = 0;		// 石	 〃
			OPT_MAX_IRON  = 0;		// 鉄	 〃
		} else {
			var shiroTemp  = src2.split(DELIMIT1);
			var shiroTemp2 = shiroTemp[1].split(DELIMIT2);

			OPT_ICHIBA = forInt(shiroTemp2[23]);			// 市場自動変換の利用有無
			OPT_RISE_MAX = forInt(shiroTemp2[24]);		// 糧の自動変換開始量
			OPT_TO_WOOD = forInt(shiroTemp2[25]);			// 木に変換する糧の量
			OPT_TO_STONE = forInt(shiroTemp2[26]);		// 石　　　 〃
			OPT_TO_IRON = forInt(shiroTemp2[27]);			// 鉄		〃
			OPT_ICHIBA_PA = shiroTemp2[33]; 			// 変換パターン
			OPT_MAX_WOOD = forInt(shiroTemp2[97]);		// 木の最大保持量（この量を超えたら変換しない）
			OPT_MAX_STONE = forInt(shiroTemp2[98]); 	// 石	 〃
			OPT_MAX_IRON = forInt(shiroTemp2[99]);		// 鉄	 〃
		}
		// ビルスク情報
		OPT_BLD = "AC";
		OPT_SorH = "DD";
		OPT_MAX   = 0;
		OPT_MAXLV = 0;
		OPT_MAX   = 6;
		OPT_MAXLV = 6;

		// 兵作成情報
		for (i=0;i<18;i++){ 	OPT_SOL_MAX[i] = 0; 	OPT_SOL_MAX[i]	= 0; };
		for (i=0;i<18;i++){ 	OPT_SOL_ADD[i] = 0; OPT_SOL_ADD[i]	= 0; };
		OPT_BLD_SOL   = 0;
		OPT_BLD_WOOD  = 0;
		OPT_BLD_STONE = 0;
		OPT_BLD_IRON  = 0;
		OPT_BLD_RICE  = 0;

		OPT_BLD_WOOD  = 0;
		OPT_BLD_STONE = 0;
		OPT_BLD_IRON  = 0;
		OPT_BLD_RICE  = 0;

		for (i=0;i<18;i++){ OPT_BK_LV[i] = 0; OPT_BK_LV[i]	= 0; };
		for (i=0;i<18;i++){ OPT_BG_LV[i] = 0; OPT_BG_LV[i]	= 0; };
		OPT_BKBG_CHK  = 0;

//		SaveInifacBox(vId); 	// 拠点情報の保存

		return;
	} else {
		// 拠点データの読込
		var Temp = src.split(DELIMIT1);
		OPT_MAX_LV = Temp[0];
		var Temp2 = Temp[1].split(DELIMIT2);
		var i;
		for(i=0; i<=22;i++){
			if(Temp2[i] == ""){return;}
			OPT_CHKBOX[i] = forInt(Temp2[i]);
		}

		//糧村化
		if(Temp2[28] == ""){return;}
		OPT_KATEMURA = forInt(Temp2[28]);
		OPT_SOUKO_MAX = forInt(Temp2[29]);

		//自動寄付
		if(Temp2[30] == ""){return;}
		OPT_KIFU = forInt(Temp2[30]);
		OPT_RISE_KIFU_MAX = forInt(Temp2[31]);
		OPT_RISE_KIFU = forInt(Temp2[32]);

		//自動内政 by nottisan ここから追加
		// ＠＠　追加　＠＠
		for (i=1;i<=40;i++){
			OPT_DOME[i]  = forInt(Temp2[33 + i]);
		}
	// @@ 2011.06.22
		for (i=0; i <= 22; i++){
			OPT_CHKBOXLV[i] = forInt(Temp2[74 + i]);
		}

		//市場変換処理用は本拠地データを取得
		var villages = loadVillages(HOST+PGNAME);
		var src2 = GM_getValue(HOST+PGNAME+villages[0][IDX_XY], "");
		if (src2 == "") {
			OPT_ICHIBA	  = 0;		// 市場自動変換の利用有無
			OPT_RISE_MAX  = 0;		// 糧の自動変換開始量
			OPT_TO_WOOD   = 0;		// 木に変換する糧の量
			OPT_TO_STONE  = 0;		// 石　　　 〃
			OPT_TO_IRON   = 0;		// 鉄		〃
			OPT_ICHIBA_PA = 0;		// 変換パターン
			OPT_MAX_WOOD  = 0;		// 木の最大保持量（この量を超えたら変換しない）
			OPT_MAX_STONE = 0;		// 石	 〃
			OPT_MAX_IRON  = 0;		// 鉄	 〃
		} else {

			var shiroTemp  = src2.split(DELIMIT1);
			var shiroTemp2 = shiroTemp[1].split(DELIMIT2);

			OPT_ICHIBA = forInt(shiroTemp2[23]);			// 市場自動変換の利用有無

			OPT_RISE_MAX = forInt(shiroTemp2[24]);			// 糧の自動変換開始量
			OPT_TO_WOOD = forInt(shiroTemp2[25]);			// 木に変換する糧の量
			OPT_TO_STONE = forInt(shiroTemp2[26]);			// 石　　　 〃
			OPT_TO_IRON = forInt(shiroTemp2[27]);			// 鉄		〃

			OPT_ICHIBA_PA = shiroTemp2[33]; 				// 変換パターン

			OPT_MAX_WOOD = forInt(shiroTemp2[97]);			// 木の最大保持量（この量を超えたら変換しない）
			OPT_MAX_STONE = forInt(shiroTemp2[98]); 		// 石	 〃
			OPT_MAX_IRON = forInt(shiroTemp2[99]);			// 鉄	 〃
		}

		// ビルスク情報
		OPT_BLD = Temp2[100];
		OPT_SorH = Temp2[101];
		OPT_MAX  = Temp2[102];
		OPT_MAXLV  = Temp2[103];
		if (OPT_MAX == undefined) { OPT_MAX = 6; }
		if (OPT_MAXLV == undefined || OPT_MAXLV > 15) { OPT_MAXLV = 6; }

		// 兵作成情報
		for (i=0;i<18;i++){
			OPT_SOL_MAX[i] = forInt(Temp2[104 + i]);
			if (isNaN(OPT_SOL_MAX[i])) { OPT_SOL_MAX[i]  = 0; };
		}
		for (i=0;i<18;i++){
			OPT_SOL_ADD[i] = forInt(Temp2[122 + i]);
			if (isNaN(OPT_SOL_ADD[i])) { OPT_SOL_ADD[i]  = 0; };
		}
		OPT_BLD_SOL  = forInt(Temp2[140]);

		OPT_BLD_WOOD  = forInt(Temp2[141]);
		OPT_BLD_STONE = forInt(Temp2[142]);
		OPT_BLD_IRON  = forInt(Temp2[143]);
		OPT_BLD_RICE  = forInt(Temp2[144]);

		if (isNaN(OPT_BLD_WOOD))  { OPT_BLD_WOOD  = 0; };
		if (isNaN(OPT_BLD_STONE)) { OPT_BLD_STONE = 0; };
		if (isNaN(OPT_BLD_IRON))  { OPT_BLD_IRON  = 0; };
		if (isNaN(OPT_BLD_RICE))  { OPT_BLD_RICE  = 0; };

		for (i=0;i<18;i++){
			OPT_BK_LV[i] = forInt(Temp2[145 + i]);
			if (isNaN(OPT_BK_LV[i])) { OPT_BK_LV[i]  = 0; };
		}

		for (i=0;i<18;i++){
			OPT_BG_LV[i] = forInt(Temp2[163 + i]);
			if (isNaN(OPT_BG_LV[i])) { OPT_BG_LV[i]  = 0; };

		}

		OPT_BKBG_CHK	= forInt(Temp2[181]);
		OPT_DORM		= forInt(Temp2[182]);			// 2013.12.26

		// 2015.05.10
		if(Temp2[183] == ""){return;}
		OPT_REMOVE		= forInt(Temp2[183]);
		for (i=0; i <= 22; i++){
			OPT_RM_CHKBOX[i] = forInt(Temp2[184 + i]);
		}
		for (i=0; i <= 22; i++){
			OPT_RM_CHKBOXLV[i] = forInt(Temp2[207 + i]);
		}

		// 2015.05.23
		if(Temp2[230] == ""){return;}
		OPT_1112MURA = forInt(Temp2[230]);
		if(Temp2[231] == ""){return;}
		OPT_0001S5MURA = forInt(Temp2[231]);
		if(Temp2[232] == ""){return;}
		OPT_PLANT5MURAN = forInt(Temp2[232]);
		OPT_PLANT5MURAE = forInt(Temp2[233]);
		OPT_PLANT5MURAW = forInt(Temp2[234]);
		OPT_PLANT5MURAS = forInt(Temp2[235]);
	}
}
//ユーザプロフィール画面の拠点情報を取得
function getUserProf(htmldoc) {
	var oldVillages = loadVillages(HOST+PGNAME);
	var newVillages = new Array();
	var landElems = document.evaluate(
		'//*[@id="gray02Wrapper"]//table/tbody/tr',
		htmldoc, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	var isLandList = false;
	for (var i=0; i<landElems.snapshotLength; i++) {
		var item = landElems.snapshotItem(i);

		if (!isLandList) {
			// 2012.01.11 新プロフィール画面対応
			var childElement = getChildElement(item, 0);
			if (childElement && trim(childElement.innerHTML) === "名前") {
//			if (trim(getChildElement(item, 0).innerHTML) == "名前") {
				isLandList = true;
			}
			continue;
		}

		//名前項目を取得
		var nameElem = getChildElement(getChildElement(item, 0), 0);
		var name = trim(nameElem.innerHTML);
		var url = nameElem.href;

		//座標項目を取得
		//var xy = "(" + getChildElement(item, 1).innerHTML + ")";
		var xy = "(" + getChildElement(item, 1).innerHTML.match(/-?[0-9]+\,-?[0-9]+/i) + ")";


		//人口項目を取得
		var popul = getChildElement(item, 2).innerHTML;

		//拠点じゃなければ終了
		if (!isNumeric(popul)) break;

		//データマージ
		var newVil = new Array();
		newVil[IDX_ACTIONS] = new Array();
		for (var j = 0; j < oldVillages.length; j++) {
			if (xy == oldVillages[j][IDX_XY]) {
				newVil = oldVillages[j];
			}
		}
		newVil[IDX_XY] = xy;
		newVil[IDX_BASE_NAME] = name;
		newVil[IDX_URL] = url;
		newVil[IDX_BASE_ID]=getParameter2(url, "village_id")
		newVillages.push(newVil);
	}

	//保存
	saveVillages(HOST+PGNAME, newVillages);
}

//拠点情報を読み出し
function loadVillages(hostname) {
	var ret = new Array();

	var src = GM_getValue(hostname, "");
	if (src == "") return ret;

	var villages = src.split(DELIMIT1);
	for (var i = 0; i < villages.length; i++) {
		var fields = villages[i].split(DELIMIT2);

		ret[i] = new Array();
		ret[i][IDX_XY] = fields[IDX_XY];
		ret[i][IDX_BASE_NAME] = fields[IDX_BASE_NAME];
		ret[i][IDX_URL] = fields[IDX_URL];
		ret[i][IDX_BASE_ID] = fields[IDX_BASE_ID];

		ret[i][IDX_ACTIONS] = new Array();
		if (fields[IDX_ACTIONS] == "") continue;
		var actions = fields[IDX_ACTIONS].split(DELIMIT3);
		for (var j = 0; j < actions.length; j++) {
			ret[i][IDX_ACTIONS][j] = new Array();
			if (actions[j] == "") continue;

			var item = actions[j].split(DELIMIT4);
			if (item[IDX2_TYPE] == undefined) item[IDX2_TYPE] = "C";

			ret[i][IDX_ACTIONS][j][IDX2_STATUS] = item[IDX2_STATUS];
			ret[i][IDX_ACTIONS][j][IDX2_TIME] = item[IDX2_TIME];
			ret[i][IDX_ACTIONS][j][IDX2_TYPE] = item[IDX2_TYPE];
			ret[i][IDX_ACTIONS][j][IDX2_ALERTED] = item[IDX2_ALERTED];
			ret[i][IDX_ACTIONS][j][IDX2_DELETE] = item[IDX2_DELETE];
			ret[i][IDX_ACTIONS][j][IDX2_ROTATION] = item[IDX2_ROTATION];
		}
	}
	return ret;
}
//拠点情報を保存
function saveVillages(hostname, newData) {

	//配列をデリミタ区切り文字列に変換
	var newDataStr = new Array();
	for (var i = 0; i < newData.length; i++) {
		var villageData = newData[i];
		var actions = villageData[IDX_ACTIONS];

		//配列をデリミタ区切り文字列に変換
		for (var j = 0; j < actions.length; j++) {
			actions[j] = genDelimitString(actions[j], DELIMIT4);
		}
		villageData[IDX_ACTIONS] = genDelimitString(actions, DELIMIT3);
		newDataStr[i] = genDelimitString(villageData, DELIMIT2);
	}
	if(newDataStr.length==0){
		return ;
	}
	//Greasemondey領域へ永続保存
	GM_setValue(hostname, genDelimitString(newDataStr, DELIMIT1));


}

//デリミタ区切り文字列生成
function genDelimitString(dataArray, delimiter) {
	var ret = "";
	for (var i=0; i < dataArray.length; i++) {
		if (dataArray[i] != undefined) ret += dataArray[i];
		if (i < dataArray.length-1) ret += delimiter;
	}
	return ret;
}

//URLパラメータ取得
function getParameter(key) {
	var str = location.search.split("?");
	if (str.length < 2) {
		return "";
	}

	var params = str[1].split("&");
	for (var i = 0; i < params.length; i++) {
		var keyVal = params[i].split("=");
		if (keyVal[0] == key && keyVal.length == 2) {
			return decodeURIComponent(keyVal[1]);
		}
	}
	return "";
}

//先頭ゼロ付加
function padZero(num) {
	var result;
	if (num < 10) {
		result = "0" + num;
	} else {
		result = "" + num;
	}
	return result;
}
//先頭ゼロ除去
function trimZero(str) {
	var res = str.replace(/^0*/, "");
	if (res == "") res = "0";
	return res;
}

//空白除去
function trim(str) {
	if (str == undefined) return "";
	return str.replace(/^[ 　\t\r\n]+|[ 　\t\r\n]+$/g, "");
}

//数値チェック
function isNumeric(num) {
	if (num.match(/^-?[0-9]+$/)) {
		return true;
	}
	return false;
}

//子Element取得
function getChildElement(parentNode, position) {
	var current = 0;
	for (var i = 0; i < parentNode.childNodes.length; i++){
		var childNode = parentNode.childNodes[i];
		if (childNode.nodeType == 1) {
			if (current == position) {
				return childNode;
			}
			current++;
		}
	}

	return undefined;
}

//時刻計算（現在時刻に加算、引数hh:mm:ss）
function computeTime(clock) {
	var hour = parseInt(trimZero(
		clock.replace(/^([0-9]{2}):([0-9]{2}):([0-9]{2})$/, "$1")));
	if (isNaN(hour)) hour = 0;
	var min = parseInt(trimZero(
		clock.replace(/^([0-9]{2}):([0-9]{2}):([0-9]{2})$/, "$2")));
	if (isNaN(min)) min = 0;
	var sec = parseInt(trimZero(
		clock.replace(/^([0-9]{2}):([0-9]{2}):([0-9]{2})$/, "$3")));
	if (isNaN(sec)) sec = 0;

	var now = new Date();
	var resTime = new Date();
	resTime.setHours(now.getHours() + hour);
	resTime.setMinutes(now.getMinutes() + min);
	resTime.setSeconds(now.getSeconds() + sec);

	return resTime;
}

//日時文字列編集（yyyy/mm/dd hh:mm:ss）
function generateDateString(date) {
	var res = "" + date.getFullYear() + "/" + padZero(date.getMonth() + 1) +
		"/" + padZero(date.getDate()) + " " + padZero(date.getHours()) + ":" +
		padZero(date.getMinutes()) + ":" + padZero(date.getSeconds());
	return res;
}

//日時文字列編集2（mm/dd hh:mm:ss）
function generateDateString2(date) {
	var res = "" + padZero(date.getMonth() + 1) + "/" + padZero(date.getDate()) +
		" " + padZero(date.getHours()) + ":" + padZero(date.getMinutes()) +
		":" + padZero(date.getSeconds());;
	return res;
}

//残時間文字列編集
function generateWaitTimeString(time1, time2) {
	var result = "";

	var waitTimeSec = Math.ceil((time1.getTime() - time2.getTime()) / 1000);
	if ( waitTimeSec < 0 ) { waitTimeSec = 0; }
	result += Math.floor(waitTimeSec / (60*60));
	result += ":";
	result += padZero(Math.floor((waitTimeSec % (60*60)) / 60));
	result += ":";
	result += padZero(waitTimeSec % 60);

	return result;
}

function ccreateTextBox(container, id, def, text, title, size, left )
{
	left += 2;
	var dv = d.createElement("div");
	dv.style.paddingTop = "2px";
	dv.style.paddingLeft= left + "px";
//	dv.style.paddingTop    = "7px";
	dv.style.paddingBottom = "2px";
	dv.title = title;
	var tb = d.createElement("input");
	tb.type = "text";
	tb.id = id;
	tb.value = def;
	tb.size = size;
	tb.style.textAlign = "right";
	tb.style.verticalAlign = "middle";
	tb.style.paddingRight = "3px";

	var tx = d.createTextNode(text);
	tx.title = title;

	dv.appendChild(tx);
	dv.appendChild(tb);
	container.appendChild(dv);
	return tb;
}
// ＠＠　ここから　＠＠
function ccreateText(container, id, text, left )
{
	left += 2;
	var dv = d.createElement("div");
	dv.style.padding = "2px";
	dv.style.paddingLeft= left + "px";
	dv.style.paddingBottom = "4px";

	var lb = d.createElement("label");
	lb.htmlFor = id;
	lb.style.verticalAlign = "middle";
	var tx = d.createTextNode(text);
	tx.fontsize = "9px";
	lb.appendChild( tx );

	dv.appendChild(lb);
	container.appendChild(dv);
}
// ＠＠　ここまで　＠＠

function ccreateCheckBox(container, id, def, text, title, left )
{
	left += 2;
	var dv = d.createElement("div");
	dv.style.padding = "1px";
	dv.style.paddingLeft= left + "px";
	dv.title = title;
	var cb = d.createElement("input");
	cb.type = "checkbox";
	cb.style.verticalAlign = "middle";
	cb.id = id;
	cb.value = 1;
	if( def ) cb.checked = true;

	var lb = d.createElement("label");
	lb.htmlFor = id;
	lb.style.verticalAlign = "middle";

	var tx = d.createTextNode(text);
	lb.appendChild( tx );

	dv.appendChild(cb);
	dv.appendChild(lb);
	container.appendChild(dv);
	return cb;
}


function ccreateButton(container, text, title, func, width, top)
{
	var btn = d.createElement("input");
	btn.style.padding = "0px";
	btn.type = "button";
	btn.value = text;
	if (top != undefined) {
		btn.style.marginTop = top + "px";
	}
	if (width == undefined) {
		btn.style.width = "54px";
	} else {
		btn.style.width = width + "px";
	}
	btn.style.height = "20px";
	btn.style.verticalAlign = "middle";
	btn.title = title;
	container.appendChild(d.createTextNode(" "));
	container.appendChild(btn);
	container.appendChild(d.createTextNode(" "));
	$e(btn, "click", func);
	return btn;
}

function cgetCheckBoxValue(id)
{
	var c = id;
	if( !c ) return 0;
	if( !c.checked ) return 0;
	return 1;
}

function cgetTextBoxValue(id)
{
	var c = id;
	if( !c ) return "";
	return c.value;
}
function ccreateComboBox(container, id, sels, def, text, title, left )
{
	left += 2;
	var dv = d.createElement("div");
	dv.style.padding = "1px";
	dv.style.paddingLeft= left + "px";
	dv.title = title;
	var sel = d.createElement("select");
	sel.id = id;
	for(var i=0; i<sels.length; i++){
		var opt = d.createElement("option");
		opt.value = sels[i];
		opt.appendChild(d.createTextNode(sels[i]));
		sel.appendChild(opt);
	}
	if( def ) sel.value = def;

	var tx = d.createTextNode(text);
	tx.title = title;

	dv.appendChild(tx);
	dv.appendChild(sel);
	container.appendChild(dv);
	return sel;
}
function cgetComboBoxValue(id){
	var c = id;
	if( !c ) return "";
	return c.value;
}
function Chek_Sigen(area){
	//costs
	var cost_wood = [
		[10,35,40,15],
		[25, 88, 100, 38],
		[58, 202, 230, 86],
		[173, 604, 690, 259],
		[431, 1510, 1725, 647],
		[1466, 2847, 3019, 1294],
		[2493, 4839, 5132, 2200],
		[3490, 6775, 7186, 3080],
		[4537, 8807, 9341, 4003],
		[5898, 11450, 12144, 5204],
		[8119, 14434, 15787, 6766],
		[11366, 20207, 22101, 9472],
		[17050, 30311, 33152, 14208],
		[25575, 45467, 49729, 21312],
		[38362, 68199, 74593, 31698]
	];
	var cost_stone= [
		[40, 10, 35, 15],
		[100, 25, 88, 38],
		[230, 58, 202, 86],
		[690, 173, 604, 259],
		[1725, 431, 1510, 647],
		[3019, 1466, 2847, 1294],
		[5132, 2493, 4839, 2200],
		[7186, 3490, 6775, 3080],
		[9341, 4537, 8807, 4003],
		[12144, 5898, 11450, 5204],
		[15787, 8119, 14434, 6766],
		[22101, 11366, 20207, 9472],
		[33152, 17050, 30311, 14208],
		[49729, 25575, 45467, 21312],
		[74593, 38362, 68199, 31968]
	];
	var cost_iron=[
		[35, 40, 10, 15],
		[88, 100, 25, 38],
		[202, 230, 58, 86],
		[604, 690, 173, 259],
		[1510, 1725, 431, 647],
		[2847, 3019, 1466, 1294],
		[4839, 5132, 2493, 2200],
		[6775, 7186, 3490, 3080],
		[8807, 9341, 4537, 4003],
		[11450, 12144, 5898, 5204],
		[14434, 15787, 8119, 6766],
		[20207, 22101, 11366, 9472],
		[30311, 33152, 17050, 14208],
		[45467, 49729, 25575, 21312],
		[68199, 74593, 38362, 31968]
	];
	var cost_rice=[
		[35, 35, 30, 0],
		[88, 88, 75, 0],
		[202, 202, 173, 0],
		[604, 604, 518, 0],
		[1510, 1510, 1294, 0],
		[3019, 3019, 2588, 0],
		[5132, 5132, 4399, 0],
		[7186, 7186, 6159, 0],
		[9341, 9341, 8007, 0],
		[12144, 12144, 10409, 0],
		[15787, 15787, 13532, 0],
		[22101, 22101, 18944, 0],
		[33152, 33152, 28416, 0],
		[49729, 49729, 42625, 0],
		[74593, 74593, 63937, 0]
	];
	var cost_souko=[
		[83, 141, 83, 63],
		[167, 281, 167, 126],
		[300, 506, 300, 226],
		[479, 810, 479, 362],
		[671, 1134, 671, 507],
		[1044, 1253, 1044, 835],
		[1462, 1754, 1462, 1169],
		[1973, 2368, 1973, 1578],
		[2664, 3196, 2664, 2131],
		[3596, 4315, 3596, 2877],
		[4854, 5825, 4854, 3883],
		[6311, 7573, 6311, 5048],
		[8204, 9845, 8204, 6563],
		[10255, 12306, 10255, 8204],
		[12819, 15382, 12819, 10255],
		[15382, 18459, 15382, 12306],
		[18459, 22151, 18459, 14767],
		[21228, 21228, 25473, 16982],
		[24412, 29294, 24412, 19529],
		[28074, 33688, 28074, 22459]
	];
	var cost_syukusya=[
		[35, 20, 35, 80],
		[53, 30, 53, 120],
		[89, 51, 89, 204],
		[147, 84, 147, 337],
		[228, 130, 228, 522],
		[336, 192, 336, 767],
		[476, 272, 476, 1089],
		[653, 373, 653, 1492],
		[868, 496, 868, 1984],
		[1129, 645, 1129, 2580],
		[2032, 1161, 2032, 4644],
		[3658, 2090, 3658, 4644],
		[6951, 3971, 6950, 15882],
		[13205, 7544, 13205, 30177],
		[25090, 14334, 25090, 57336]
	];
	var cost_kojo=[
		[780, 1560, 1560, 3900],
		[1248, 2496, 2496, 6240],
		[1997, 3994, 3994, 9984],
		[4193, 6290, 6290, 11182],
		[5871, 8806, 8806, 15655],
		[10958, 13698, 13698, 16437],
		[15342, 19177, 19177, 23013],
		[19944, 24930, 24930, 29916],
		[25928, 32410, 32410, 38891],
		[33706, 42132, 42132, 50559]
	];
	var cost_suisya=[
		[2940, 980, 980, 4900],
		[4704, 1568, 1568, 7840],
		[7526, 2509, 2509, 12544],
		[10537, 5268, 5268, 14049],
		[14751, 7376, 7376, 19668],
		[20652, 13768, 13768, 20652],
		[28913, 19275, 19275, 28913],
		[37587, 25058, 25058, 37587],
		[48863, 32576, 32576, 48863],
		[63523, 42348, 42348, 63523]
	];
	var cost_ichiba=[
		[100, 100, 50, 50],
		[334, 334, 191, 191],
		[1035, 1035, 592, 592],
		[2795, 2795, 1600, 1600],
		[6328, 6328, 4218, 4218],
		[13288, 13288, 8859, 8859],
		[25248, 25248, 16832, 16832],
		[42921, 42921, 28614, 28614],
		[64381, 64381, 42921, 42921],
		[90134, 90134, 60089, 60089]
	];
	var cost_kenkyu=[
		[275, 110, 110, 55],
		[413, 165, 165, 83],
		[619, 248, 248, 124],
		[1486, 836, 836, 557],
		[2228, 1253, 1253, 836],
		[7521, 6267, 6267, 5015],
		[13538, 11282, 11282, 9025],
		[21436, 17862, 17862, 14290],
		[44675, 37228, 37228, 29784],
		[87725, 73104, 73104, 58483]
	];
	var cost_kunren=[
		[1500, 1600, 2500, 3300],
		[2100, 2240, 3500, 3300],
		[2940, 3136, 4900, 6468],
		[6629, 7326, 13955, 6978],
		[13257, 14653, 27910, 13955],
		[32097, 37679, 55821, 13955],
		[64194, 75358, 111642, 27910],
		[128388, 150716, 223283, 55821],
		[256776, 301432, 446566, 111642],
		[513551, 602865, 893133, 223283]
	];
	var cost_kajiba=[
		[150, 200, 340, 170],
		[400, 300, 680, 340],
		[780, 585, 1326, 663],
		[1482, 1112, 2519, 1260],
		[2742, 2056, 4661, 2330],
		[4935, 3701, 8390, 4195],
		[8636, 6477, 14682, 7341],
		[17640, 14112, 28223, 10584],
		[31566, 25253, 50506, 18940],
		[50506, 40404, 80809, 30303]
	];
	var cost_bougu=[
		[150, 200, 340, 170],
		[300, 400, 680, 340],
		[585, 780, 1326, 663],
		[1112, 1482, 2519, 1260],
		[2056, 2742, 4661, 2330],
		[3701, 4935, 8390, 4195],
		[6477, 8636, 14682, 7341],
		[14112, 17640, 28223, 10584],
		[25253, 31566, 50506, 18940],
		[40404, 50506, 80809, 30303]
	];
	var cost_heiki=[
		[216, 216, 216, 72],
		[432, 432, 432, 144],
		[864, 864, 864, 288],
		[1224, 1224, 1224, 648],
		[1836, 1836, 1836, 972],
		[2662, 2662, 2662, 1409],
		[3860, 3860, 3860, 2044],
		[7357, 7357, 7357, 2452],
		[13242, 13242, 13242, 4414],
		[23836, 23836, 23836, 7945],
		[42905, 42905, 42905, 14302],
		[77229, 77229, 77229, 25743],
		[139013, 139013, 139013, 46338],
		[278026, 278026, 278026, 92675],
		[556051, 556051, 556051, 185350]
	];
	var cost_doujaku=[
		[700, 3500, 2100, 700],
		[1120, 5600, 3360, 1120],
		[1792, 8960, 5376, 1792],
		[3763, 10035, 7526, 3763],
		[5263, 14049, 10537, 5268],
		[9834, 14752, 14752, 9834],
		[13768, 20652, 20652, 13768],
		[17899, 26848, 26848, 17899],
		[23268, 34902, 34902, 23268],
		[30249, 45373, 45373, 30249]
	];
	var cost_renpei=[
		[112, 107, 107, 122],
		[224, 214, 214, 244],
		[448, 428, 428, 488],
		[759, 725, 725, 826],
		[1214, 1160, 1160, 1322],
		[2209, 2110, 2110, 2406],
		[3331, 3182, 3182, 3627],
		[4958, 4736, 4736, 5400],
		[8091, 7729, 7729, 8813],
		[11130, 10632, 10632, 12122]
	];
	var cost_heisya=[
		[72, 360, 72, 216],
		[144, 720, 144, 432],
		[288, 1440, 288, 864],
		[648, 1728, 648, 1296],
		[972, 2592, 972, 1944],
		[1409, 3758, 1409, 2819],
		[2725, 4088, 2725, 4088],
		[6744, 9810, 5518, 2453],
		[12140, 17658, 9933, 4415],
		[21852, 31784, 17879, 7946],
		[39333, 57212, 32182, 14303],
		[70800, 96545, 64364, 25745],
		[127440, 173781, 115854, 46342],
		[254879, 324392, 254879, 92683],
		[509759, 648784, 509759, 185367]
	];
	var cost_yumi=[
		[360, 72, 72, 216],
		[720, 144, 144, 432],
		[1440, 288, 288, 864],
		[1728, 648, 648, 1296],
		[2592, 972, 972, 1944],
		[3758, 1409, 1409, 2819],
		[5450, 2044, 2044, 4087],
		[9810, 6131, 6131, 2453],
		[17658, 12140, 9933, 4415],
		[31784, 21852, 17879, 7946],
		[57212, 39333, 32182, 14303],
		[96545, 70800, 64364, 25745],
		[173781, 127440, 115854, 46342],
		[324392, 254879, 254879, 92683],
		[648784, 509759, 509759, 185367]
	];
	var cost_uma=[
		[72, 72, 360, 216],
		[144, 144, 720, 432],
		[288, 288, 1440, 864],
		[648, 648, 1728, 1296],
		[972, 972, 2592, 1944],
		[1409, 1409, 3758, 2891],
		[2044, 2044, 5450, 4087],
		[5518, 6744, 9810, 2453],
		[9933, 12140, 17658, 4415],
		[17879, 21852, 31784, 7946],
		[32182, 39333, 57212, 14303],
		[64364, 70800, 96545, 25745],
		[115854, 127440, 173781, 46342],
		[254879, 254879, 324392, 92683],
		[509759, 509759, 648784, 185367]
	];

	var cost_shiro=[
		[0, 0, 0, 0],
		[1404, 546, 390, 780],
		[2570, 1000, 714, 1428],
		[4161, 2081, 2081, 2081],
		[7102, 3552, 3552, 3552],
		[9056, 9056, 6037, 6037],
		[14384, 14384, 9589, 9589],
		[22773, 22773, 15183, 15183],
		[33562, 33562, 22374, 22374],
		[44402, 57559, 32890, 29602],
		[65122, 84418, 48239, 43415],
		[95317, 123558, 70605, 63544],
		[113458, 154716, 154716, 92830],
		[150418, 150418, 315878, 135375],
		[219008, 219008, 492770, 164258],
		[294820, 294820, 663345, 221115],
		[488220, 488220, 827854, 318406],
		[839130, 839130, 915414, 457707],
		[1307581, 1307581, 1354280, 700491],
		[1901938, 1901938, 1969864, 1018896]
	];
	var cost_toride=[
		[104, 400, 136, 160],
		[243, 936, 319, 374],
		[438, 1685, 573, 673],
		[1110, 2467, 1357, 1233],
		[1887, 4194, 2307, 2097],
		[3236, 7191, 3954, 3596],
		[5177, 11505, 6327, 5753],
		[10430, 18776, 13560, 9387],
		[18839, 33912, 24492, 16956],
		[33914, 61043, 44087, 30523],
		[66939, 106495, 85196, 45640],
		[119786, 190570, 152456, 81672],
		[213820, 340166, 272133, 145786],
		[423566, 505021, 456148, 244365],
		[708513, 844765, 763014, 408756]
	];
	var cost_mura=[
		[400, 136, 104, 160],
		[936, 319, 243, 374],
		[1685, 573, 438, 673],
		[2467, 1357, 1110, 1233],
		[4194, 2307, 1887, 2097],
		[7191, 3954, 3236, 3596],
		[11505, 6327, 5177, 5753],
		[18776, 13560, 10430, 9387],
		[33912, 24492, 18839, 16956],
		[61043, 44087, 33914, 30523],
		[106495, 85196, 66939, 45640],
		[190570, 152456, 119786, 81672],
		[340166, 272133, 213820, 145786],
		[505021, 456148, 423566, 244365],
		[844765, 763014, 708513, 408756]
	];
	var cost_daisyukusya=[
		[200, 114, 200, 438],
		[320, 183, 320, 701],
		[512, 293, 512, 1121],
		[768, 439, 768, 1682],
		[1152, 658, 1152, 2523],
		[1728, 987, 1728, 3784],
		[2419, 1382, 2419, 5298],
		[3387, 1935, 3387, 7418],
		[4741, 2709, 4741, 10385],
		[6637, 3793, 6637, 14538],
		[8628, 4930, 8628, 18900],
		[11217, 6409, 11217, 24570],
		[14582, 8332, 14582, 31941],
		[18956, 11735, 18956, 40620],
		[25817, 16429, 25817, 49286],
		[32271, 22003, 32271, 60141],
		[42172, 29337, 42172, 69675],
		[52715, 38963, 52715, 84803],
		[66009, 49506, 66009, 93512],
		[79211, 62708, 79211, 108914]
	];
	var cost_ennseikunren=[
		[2884, 4486, 5977, 2723],
		[4614, 7177, 9484, 4357],
		[7382, 11483, 15174, 6972],
		[11811, 18373, 24279, 11155],
		[18898, 29397, 38846, 17848],
		[28347, 44096, 58269, 26772],
		[42521, 66143, 87404, 40158],
		[63781, 99215, 131105, 60238],
		[89294, 138901, 183548, 84333],
		[125011, 194461, 256967, 118066],
		[175015, 272246, 359754, 165292],
		[227520, 353920, 467680, 214880],
		[295776, 460096, 607984, 279344]
	];
	var cost_miharidai=[
		[600, 840, 600, 360 ],
		[960, 1344, 960, 576],
		[1536, 2150, 1536, 922],
		[2458, 3441, 2458, 1475],
		[3932, 5505, 3932, 2359],
		[6291, 8808, 6291, 3775],
		[9437, 13212, 9437, 5662],
		[14156, 19818, 14156, 8493],
		[21233, 29727, 21233, 12740],
		[31850, 44590, 31850, 19110],
		[44590, 62426, 44590, 26754],
		[62426, 87396, 62426, 37456],
		[87397, 122355, 87397, 52438],
		[122355, 171297, 122355, 73413],
		[159062, 222686, 159062, 95437],
		[206780, 289492, 206780, 124068]
	];
	var cost_syugyouzyo=[
		[1600, 1200, 600, 600],
		[2240, 1680, 840, 840],
		[3136, 2352, 1176, 1176],
		[4390, 3293, 1646, 1646],
		[6146, 4610, 2305, 2305],
		[8605, 6454, 3227, 3227],
		[11186, 8390, 4195, 4195],
		[14542, 10907, 5453, 5453],
		[18905, 14179, 7089, 7089],
		[24577, 18433, 9216, 9216],
		[31950, 23963, 11981, 11981],
		[38340, 28755, 14378, 14378],
		[46008, 34506, 17253, 17253],
		[55210, 41407, 20704, 20704],
		[66252, 49689, 24844, 24844],
		[72877, 54658, 27329, 27329],
		[80164, 60123, 30062, 30062],
		[88181, 66136, 33068, 33068],
		[96999, 72749, 36375, 36375],
		[106699, 80024, 40012, 40012]
	];
	var costs = [];

	costs["城"] = cost_shiro;
	costs["伐採所"] = cost_wood;
	costs["石切り場"] = cost_stone;
	costs["製鉄所"] = cost_iron;
	costs["畑"] = cost_rice;
	costs["倉庫"] = cost_souko;
	costs["銅雀台"] = cost_doujaku;
	costs["鍛冶場"] = cost_kajiba;
	costs["防具工場"] = cost_bougu;
	costs["練兵所"] = cost_renpei;
	costs["兵舎"] = cost_heisya;
	costs["弓兵舎"] = cost_yumi;
	costs["厩舎"] = cost_uma;
	costs["宿舎"] = cost_syukusya;
	costs["兵器工房"] = cost_heiki;
	costs["市場"] = cost_ichiba;
	costs["訓練所"] = cost_kunren;
	costs["水車"] = cost_suisya;
	costs["工場"] = cost_kojo;
	costs["研究所"] = cost_kenkyu;
	costs["大宿舎"] = cost_daisyukusya;
	costs["遠征訓練所"] = cost_ennseikunren;
	costs["見張り台"] = cost_miharidai;
//	costs["修行所"] = cost_syugyouzyo;
	costs["砦"] = cost_toride;
	costs["村"] = cost_mura;

	var RES_NOW = [];
	RES_NOW["wood"] = parseInt( $("wood").innerHTML, 10 );
	RES_NOW["stone"] = parseInt( $("stone").innerHTML, 10 );
	RES_NOW["iron"] = parseInt( $("iron").innerHTML, 10 );
	RES_NOW["rice"] = parseInt( $("rice").innerHTML, 10 );
	RES_NOW["storagemax"] = parseInt( $("rice_max").innerHTML, 10 );

	try {
		if( costs[area.name].length <= parseInt(area.lv) || // maxinum level reached
			RES_NOW.wood < costs[area.name][parseInt(area.lv)][0] ||
			RES_NOW.stone< costs[area.name][parseInt(area.lv)][1] ||
			RES_NOW.iron < costs[area.name][parseInt(area.lv)][2] ||
			RES_NOW.rice < costs[area.name][parseInt(area.lv)][3] ) {
				//建築不可 = 1
				return 1;
		}
	}catch(e) {
	}
	return 0;

}

function getSoldier() {

debugLog("=== Start getSoldier ===");

	var tables = document.evaluate('//*[@class="status village-bottom"]',document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	var Temp = tables.snapshotItem(0).innerHTML.substring(tables.snapshotItem(0).innerHTML.lastIndexOf(" ")+1);
	aa = Temp.split("/");
	var now_Soldier = aa[0];
	var max_Soldier = aa[1];

	// 造兵指示がない場合はスキップ
	if (OPT_BLD_SOL == 0) { return; }
	var result = new Array();
	//				 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8
	var attackerData = new Array(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);		// update 2014.03.07
	var waitData	 = new Array(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);		// update 2014.03.07
	var helpData	 = new Array(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);		// update 2014.03.07
	var sortieData	 = new Array(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);		// update 2014.03.07
	var returnData	 = new Array(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);		// update 2014.03.07
	var moveData	 = new Array(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);		// update 2014.03.07


	var tid=setTimeout(function(){

		GM_xmlhttpRequest({
			method:"GET",
			url:"http://" + HOST + "/facility/unit_status.php",
			headers:{"Content-type":"text/html"},
			overrideMimeType:'text/html; charset=utf-8',
			onload:function(x){
				var htmldoc = document.createElement("html");
					htmldoc.innerHTML = x.responseText;
				// 待機中の兵士
				var tables = document.evaluate('//div[@id="wait"]',htmldoc, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
				var htmldoc2 = document.createElement("html");
					htmldoc2.innerHTML = tables.snapshotItem(0).innerHTML
				var tables2 = document.evaluate('//td[@class="digit"]',htmldoc2, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
				waitData	 = addSoldierCount(waitData, tables2);
				attackerData = addSoldierCount(attackerData, tables2);

				// 援軍中
				tables = document.evaluate('//div[@id="help"]',htmldoc, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
				htmldoc2.innerHTML = tables.snapshotItem(0).innerHTML;
				tables2 = document.evaluate('//table[@class="commonTablesNoMG"]',htmldoc2, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
				for (var i = 0; i < tables2.snapshotLength; i++ ){
					var htmldoc3 = document.createElement("html");
						htmldoc3 = tables2.snapshotItem(i);
					var tables3 = document.evaluate('*/tr/td[@class="digit"]',htmldoc3, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
					helpData	 = addSoldierCount(helpData, tables3);
					attackerData = addSoldierCount(attackerData, tables3);
				}

				// 出撃中
				tables = document.evaluate('//div[@id="sortie"]',htmldoc, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
				htmldoc2.innerHTML = tables.snapshotItem(0).innerHTML;
				tables2 = document.evaluate('//table[@class="commonTablesNoMG"]',htmldoc2, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
				for (var i = 0; i < tables2.snapshotLength; i++ ){
					var htmldoc3 = document.createElement("html");
						htmldoc3 = tables2.snapshotItem(i);
					var tables3 = document.evaluate('*/tr/td[@class="digit"]',htmldoc3, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
					sortieData	 = addSoldierCount(sortieData, tables3);
					attackerData = addSoldierCount(attackerData, tables3);
				}

				// 帰還中
				tables = document.evaluate('//div[@id="return"]',htmldoc, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
				htmldoc2.innerHTML = tables.snapshotItem(0).innerHTML;
				tables2 = document.evaluate('//table[@class="commonTablesNoMG"]',htmldoc2, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
				for (var i = 0; i < tables2.snapshotLength; i++ ){
					var htmldoc3 = document.createElement("html");
						htmldoc3 = tables2.snapshotItem(i);
					var tables3 = document.evaluate('*/tr/td[@class="digit"]',htmldoc3, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
					returnData	 = addSoldierCount(returnData, tables3);
					attackerData = addSoldierCount(attackerData, tables3);
				}

				// 移動中
				tables = document.evaluate('//div[@id="move"]',htmldoc, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
				htmldoc2.innerHTML = tables.snapshotItem(0).innerHTML;
				tables2 = document.evaluate('//table[@class="commonTablesNoMG"]',htmldoc2, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
				for (var i = 0; i < tables2.snapshotLength; i++ ){
					var htmldoc3 = document.createElement("html");
						htmldoc3 = tables2.snapshotItem(i);
					var tables3 = document.evaluate('*/tr/td[@class="digit"]',htmldoc3, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
					moveData	 = addSoldierCount(moveData, tables3);
					attackerData = addSoldierCount(attackerData, tables3);
				}
				// 作成処理
				make_soldier(attackerData);

			}
		});
	},0);
}

//兵士数加算 2014.03.07 盾兵・剣兵・重盾兵がある鯖ない鯖の処理分岐追加
function addSoldierCount(total, add) {

	if (total == undefined) total = new Array();
	if (total == undefined) {
		//		  1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8
		total = new Array(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);
	}

	if (add.snapshotLength == 12) {
		for (var j = 0; j < 11; j++) {
			total[j] += parseInt(add.snapshotItem(j).innerHTML);
		}
	}

	if (add.snapshotLength == 16) {
		for (var j = 0; j < 15; j++) {
			switch ( j ) {
				case  0: total[0]  += parseInt(add.snapshotItem(j).innerHTML); break;		// 剣兵
				case  1: total[12] += parseInt(add.snapshotItem(j).innerHTML); break;		// 盾兵
				case  2: total[1]  += parseInt(add.snapshotItem(j).innerHTML); break;		// 槍兵
				case  3: total[2]  += parseInt(add.snapshotItem(j).innerHTML); break;		// 弓兵
				case  4: total[3]  += parseInt(add.snapshotItem(j).innerHTML); break;		// 騎兵
				case  5: total[9]  += parseInt(add.snapshotItem(j).innerHTML); break;		// 衝車
				case  6: total[7]  += parseInt(add.snapshotItem(j).innerHTML); break;		// 斥候

				case  8: total[11] += parseInt(add.snapshotItem(j).innerHTML); break;		// 大剣兵
				case  9: total[13] += parseInt(add.snapshotItem(j).innerHTML); break;		// 重盾兵
				case 10: total[4]  += parseInt(add.snapshotItem(j).innerHTML); break;		// 矛槍兵
				case 11: total[5]  += parseInt(add.snapshotItem(j).innerHTML); break;		// 弩兵
				case 12: total[6]  += parseInt(add.snapshotItem(j).innerHTML); break;		// 近衛騎兵
				case 13: total[10] += parseInt(add.snapshotItem(j).innerHTML); break;		// 投石機
				case 14: total[8]  += parseInt(add.snapshotItem(j).innerHTML); break;		// 斥候騎兵
			}
		}
	}

	return total;
}

function make_soldier(attackerData){
	var make_name = ["兵器工房","厩舎","兵舎","弓兵舎","練兵所"]

	var make_loop = function(loop) {
		if (loop == 5) {
			sort_priority[0]  = make_no["剣兵"];
			sort_priority[1]  = make_no["弓兵"];
			sort_priority[2]  = make_no["弩兵"];
			sort_priority[3]  = make_no["騎兵"];
			sort_priority[4]  = make_no["近衛騎兵"];
			sort_priority[5]  = make_no["槍兵"];
			sort_priority[6]  = make_no["矛槍兵"];
			sort_priority[7]  = make_no["斥候"];
			sort_priority[8]  = make_no["斥候騎兵"];
			sort_priority[9]  = make_no["衝車"];
			sort_priority[10] = make_no["投石機"];
			sort_priority[11] = make_no["大剣兵"];
			sort_priority[12] = make_no["盾兵"];
			sort_priority[13] = make_no["重盾兵"];

			sort_priority.sort( function(a, b) { if (a[6] < b[6]) return 1; if (a[6] > b[6]) return -1; return 0;});

			for (var i=0;i<14;i++){
				if (sort_priority[i][2] == 1 && sort_priority[i][6] != 0){
					// 兵作成
					if ((OPT_SOL_ADD[sort_priority[i][1] - 300] != 0) && (OPT_SOL_ADD[sort_priority[i][1] - 300] < sort_priority[i][3])){
						var c={};
						c['x']=parseInt(sort_priority[i][7]);
						c['y']=parseInt(sort_priority[i][8]);
						c['unit_id']=sort_priority[i][1];
						c['count']=OPT_SOL_ADD[sort_priority[i][1] - 300];
						j$.post("http://"+HOST+"/facility/facility.php?x=" + sort_priority[i][7] + "&y=" + sort_priority[i][8] + "#ptop",c,function(){});
						var tid=setTimeout(function(){location.reload(false);},INTERVAL);

						break;
					}
				}
			}
			return;
		}

		var _x = -1;
		var _y = -1;
		var _lv = -1;

		var area = new Array();
		area = get_area();

		for (i=0;i<area.length;i++){
			if (area[i].name == make_name[loop]) {
				var Temp = area[i].xy.split(",");
				_x = Temp[0];
				_y = Temp[1];
				_lv = area[i].lv;
			}
		}
		if ( _x < 0 ) {
			// 建物がない
			make_loop(loop + 1);
		} else {

			MakeSoldierFlg = false; // 兵士作成フラグ

			var tables = document.evaluate('//*[@class="status village-bottom"]',document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
			var Temp = tables.snapshotItem(0).innerHTML.substring(tables.snapshotItem(0).innerHTML.lastIndexOf(" ")+1);
			temp0 = Temp.split("/");
			var now_Soldier = temp0[0];
			var max_Soldier = temp0[1];
			var make_max = temp0[1] - temp0[0]; // 最大作成可能兵数
			// 宿舎に空きがあるか？
			switch (make_name[loop]) {
				case "兵器工房":	if ((OPT_SOL_ADD[12] <= make_max) && (OPT_SOL_ADD[13] <= make_max)) 								{ MakeSoldierFlg = true; }		// 衝車・投石機
				case "厩舎":		if ((OPT_SOL_ADD[5]  <= make_max) && (OPT_SOL_ADD[7]  <= make_max) && (OPT_SOL_MAX[11] <= make_max)){ MakeSoldierFlg = true; }		// 騎兵・近衛騎兵・斥候騎兵
				case "兵舎":		if ((OPT_SOL_ADD[3]  <= make_max) && (OPT_SOL_ADD[4]  <= make_max)) 								{ MakeSoldierFlg = true; }		// 槍兵・矛槍兵
				case "弓兵舎":		if ((OPT_SOL_ADD[8]  <= make_max) && (OPT_SOL_ADD[9]  <= make_max)) 								{ MakeSoldierFlg = true; }		// 弓兵・弩兵
				case "練兵所":		if ((OPT_SOL_ADD[1]  <= make_max) && (OPT_SOL_ADD[10] <= make_max) &&
										(OPT_SOL_MAX[14] <= make_max) && (OPT_SOL_MAX[15] <= make_max) &&
																			(OPT_SOL_MAX[16] <= make_max))								{ MakeSoldierFlg = true; }		// 剣兵・斥候・大剣兵・盾兵・重盾兵
			}

			if (MakeSoldierFlg) {
				var tid=setTimeout(function(){
					var mURL = FACLINK;
					mURL = mURL.replace(URL_SITE,HOST);
					mURL = mURL.replace(URL_X,_x);
					mURL = mURL.replace(URL_Y,_y);
					GM_xmlhttpRequest({
						method:"GET",
						url: mURL,
						headers:{"Content-type":"text/html"},
						overrideMimeType:'text/html; charset=utf-8',
						onload:function(x){
							var htmldoc = document.createElement("html");
								htmldoc.innerHTML = x.responseText;

							var makeElem = document.evaluate('//*[@id="area_timer0"]',htmldoc, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
							if (makeElem.snapshotLength > 0) {
								// 兵士は作成中
								getTrainingSoldier(htmldoc);
								if ( getStayMode() ) {
									closeIniBilderBox()
									openIniBilderBox()
								}
							} else {
								var makeElem  = document.evaluate('//th[@class="mainTtl"]',htmldoc, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
								for (var i = 1; i < makeElem.snapshotLength; i++ ){
									// 兵作成可能
									make_no[makeElem.snapshotItem(i).innerHTML][2] = 1;
									// 兵作成可能数
									make_no[makeElem.snapshotItem(i).innerHTML][3] = parseInt(sumMaxSoldier(make_no[makeElem.snapshotItem(i).innerHTML][1]));
									// 現存合計兵数
									make_no[makeElem.snapshotItem(i).innerHTML][5] = attackerData[make_no[makeElem.snapshotItem(i).innerHTML][4]];
									// 残必要兵数

									make_no[makeElem.snapshotItem(i).innerHTML][6] = OPT_SOL_MAX[make_no[makeElem.snapshotItem(i).innerHTML][1] - 300] - attackerData[make_no[makeElem.snapshotItem(i).innerHTML][4]];
									if (make_no[makeElem.snapshotItem(i).innerHTML][6] < 0) {
										make_no[makeElem.snapshotItem(i).innerHTML][6] = 0;
									}
									// 座標
									make_no[makeElem.snapshotItem(i).innerHTML][7] = _x;
									make_no[makeElem.snapshotItem(i).innerHTML][8] = _y;
								};
							}
							make_loop(loop + 1);
						}
					});
				},1000);
			} else {
				make_loop(loop + 1);
			}
		}
	}

	make_loop(0);

}

function sumMaxSoldier(type){
	var SoldierCost = [
		[	1,	 1,   1,   1],
		[  11,	 1,  11,  61],	// 301 剣兵
		[	1,	 1,   1,   1],
		[  88, 132,   1,  21],	// 303 槍兵
		[ 264, 396,   1,  61],	// 304 矛槍兵
		[	1, 128, 192,  41],	// 305 騎兵
		[	1,	 1,   1,   1],
		[	1, 384, 576, 121],	// 307 近衛騎兵
		[ 144,	 1,  96,  35],	// 308 弓兵
		[ 432,	 1, 288, 105],	// 309 弩兵
		[ 151, 151, 151,   1],	// 310 斥候
		[ 451, 451, 451,  31],	// 311 斥候騎兵
		[ 501,	 1, 501,   1],	// 312 衝車
		[	1,1501,1501,   1],	// 313 投石機
		[	1,	 1,   1,   1],
		[  85,	 0,  85, 430],	// 315 大剣兵
		[  70,	70,  70,  20],	// 316 盾兵
		[ 210, 210, 210,  60],	// 317 重盾兵

	];
	var tables = document.evaluate('//*[@class="status village-bottom"]',document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	var Temp = tables.snapshotItem(0).innerHTML.substring(tables.snapshotItem(0).innerHTML.lastIndexOf(" ")+1);
	temp0 = Temp.split("/");
	var now_Soldier = temp0[0];
	var max_Soldier = temp0[1];
	var make_max = temp0[1] - temp0[0]; // 最大作成可能兵数

	type = type - 300;
	var wood = parseInt( $("wood").innerHTML, 10 );
	var stone = parseInt( $("stone").innerHTML, 10 );
	var iron = parseInt( $("iron").innerHTML, 10 );
	var rice = parseInt( $("rice").innerHTML, 10 );

	countWood  = parseInt((wood  - OPT_BLD_WOOD)  / SoldierCost[type][0]);
	countStone = parseInt((stone - OPT_BLD_STONE) / SoldierCost[type][1]);
	countIron  = parseInt((iron  - OPT_BLD_IRON)  / SoldierCost[type][2]);
	countRice  = parseInt((rice  - OPT_BLD_RICE)  / SoldierCost[type][3]);

	var MaxSoldir = countWood;
	if (MaxSoldir > countStone) { MaxSoldir = countStone; }
	if (MaxSoldir > countIron)	{ MaxSoldir = countIron; }
	if (MaxSoldir > countRice)	{ MaxSoldir = countRice; }

	if (make_max < MaxSoldir) { MaxSoldir = make_max; } 		// 滞在可能上限を超えないこと
	return MaxSoldir;
}

// 資源オーバーフロー防止処理
function OverFlowPrevention() {

	var ichiba_x = -1; //市場のX座標
	var ichiba_y = -1; //市場のY座標
	var ichiba_lv = -1; //市場のレベル

	var area = new Array();
	area = get_area();

	for(i=0;i<area.length;i++){
		//市場の座標を取得
		if(area[i].name == "市場") {
			var Temp = area[i].xy.split(",");
			ichiba_x = Temp[0];
			ichiba_y = Temp[1];
			ichiba_lv = area[i].lv;
		}
	}

	if(ichiba_x < 0) { return; }

	// 現在の状態
	var RES_NOW = [];
	RES_NOW["wood"] 	= parseInt( $("wood").innerHTML,	 10 );	// 資源：木
	RES_NOW["stone"]	= parseInt( $("stone").innerHTML,	 10 );	// 資源：石
	RES_NOW["iron"] 	= parseInt( $("iron").innerHTML,	 10 );	// 資源：鉄
	RES_NOW["rice"] 	= parseInt( $("rice").innerHTML,	 10 );	// 資源：糧
	RES_NOW["storagemax"]	= parseInt( $("rice_max").innerHTML, 10 );	// 倉庫容量

	var OverFlowLimit  = Math.floor(RES_NOW["storagemax"] * 0.95);		// 限界容量（倉庫の95%）
	var ChangeSigenNum = Math.floor(RES_NOW["storagemax"] * 0.05);		// 変換量（倉庫の5%）

	// 資源：木石鉄が限界を超えている場合
	if ( (RES_NOW["wood"] > OverFlowLimit) && (RES_NOW["stone"] > OverFlowLimit) && (RES_NOW["iron"] > OverFlowLimit) ) {
		var max_sigen = 0;
		if (RES_NOW["wood"]  > max_sigen) { max_sigen = RES_NOW["wood"];  ChangeSigenNum = Math.floor(RES_NOW["wood"]  * 0.01); }
		if (RES_NOW["stone"] > max_sigen) { max_sigen = RES_NOW["stone"]; ChangeSigenNum = Math.floor(RES_NOW["stone"] * 0.01); }
		if (RES_NOW["iron"]  > max_sigen) { max_sigen = RES_NOW["iron"];  ChangeSigenNum = Math.floor(RES_NOW["iron"]  * 0.01); }


		if(RES_NOW["wood"] == max_sigen) {
			changeResorceToResorce(WOOD,  ChangeSigenNum, RICE, ichiba_x, ichiba_y);
		} else if(RES_NOW["stone"] == max_sigen) {
			changeResorceToResorce(STONE, ChangeSigenNum, RICE, ichiba_x, ichiba_y);
		} else if(RES_NOW["iron"] == max_sigen) {
			changeResorceToResorce(IRON,  ChangeSigenNum, RICE, ichiba_x, ichiba_y);
		}

	}
	// 資源：木が限界を超えているか？
	if (RES_NOW["wood"] > OverFlowLimit) {
		// 一番少ない資源を探せ！
		var min_sigen = 9999999999;
		if (RES_NOW["stone"] < min_sigen) { min_sigen = RES_NOW["stone"]; }
		if (RES_NOW["iron"]  < min_sigen) { min_sigen = RES_NOW["iron"]; }

		if(RES_NOW["stone"] == min_sigen) {
			changeResorceToResorce(WOOD, ChangeSigenNum, STONE, ichiba_x, ichiba_y);
		} else if(RES_NOW["iron"] == min_sigen) {
			changeResorceToResorce(WOOD, ChangeSigenNum, IRON, ichiba_x, ichiba_y);
		}
	}

	// 資源：石が限界を超えているか？
	if (RES_NOW["stone"] > OverFlowLimit) {
		// 一番少ない資源を探せ！
		var min_sigen = 9999999999;
		if (RES_NOW["wood"]  < min_sigen) { min_sigen = RES_NOW["wood"]; }
		if (RES_NOW["iron"]  < min_sigen) { min_sigen = RES_NOW["iron"]; }

		if(RES_NOW["wood"] == min_sigen) {
			changeResorceToResorce(STONE, ChangeSigenNum, WOOD, ichiba_x, ichiba_y);
		} else if(RES_NOW["iron"] == min_sigen) {
			changeResorceToResorce(STONE, ChangeSigenNum, IRON, ichiba_x, ichiba_y);
		}
	}

	// 資源：鉄が限界を超えているか？
	if (RES_NOW["iron"] > OverFlowLimit) {
		// 一番少ない資源を探せ！
		var min_sigen = 9999999999;
		if (RES_NOW["wood"]  < min_sigen) { min_sigen = RES_NOW["wood"]; }
		if (RES_NOW["stone"] < min_sigen) { min_sigen = RES_NOW["stone"]; }

		if(RES_NOW["wood"] == min_sigen) {
			changeResorceToResorce(IRON, ChangeSigenNum, WOOD, ichiba_x, ichiba_y);
		} else if(RES_NOW["stone"] == min_sigen) {
			changeResorceToResorce(IRON, ChangeSigenNum, STONE, ichiba_x, ichiba_y);
		}
	}

	// 資源：糧が限界を超えているか？
	if (RES_NOW["rice"] > OverFlowLimit) {
		// 一番少ない資源を探せ！
		var min_sigen = 9999999999;
		if (RES_NOW["wood"]  < min_sigen) { min_sigen = RES_NOW["wood"]; }
		if (RES_NOW["stone"] < min_sigen) { min_sigen = RES_NOW["stone"]; }
		if (RES_NOW["iron"]  < min_sigen) { min_sigen = RES_NOW["iron"]; }

		if(RES_NOW["wood"] == min_sigen) {
			changeResorceToResorce(RICE, ChangeSigenNum, WOOD, ichiba_x, ichiba_y);
		} else if(RES_NOW["stone"] == min_sigen) {
			changeResorceToResorce(RICE, ChangeSigenNum, STONE, ichiba_x, ichiba_y);
		} else if(RES_NOW["iron"] == min_sigen) {
			changeResorceToResorce(RICE, ChangeSigenNum, IRON, ichiba_x, ichiba_y);
		}
	}
}


//市場変換処理
function ichibaChange(vId) {

debugLog("=== Start ichibaChange ===");

	var ichiba_x = -1; //市場のX座標
	var ichiba_y = -1; //市場のY座標
	var ichiba_lv = -1; //市場のレベル

	var area = new Array();
	area = get_area();
	for(i=0;i<area.length;i++){
		//市場の座標を取得
		if(area[i].name == "市場") {
			var Temp = area[i].xy.split(",");
			ichiba_x = Temp[0];
			ichiba_y = Temp[1];
			ichiba_lv = area[i].lv;
		}
	}

	if(ichiba_x < 0) {
		delShopList(vId);
	} else {
		// 市場がある村ID・座標・レベルを保管
		addShopList(vId,ichiba_lv,ichiba_x,ichiba_y);
	}

	if(OPT_ICHIBA != 1) {
		//alert("市場自動変換未指定");
		return;
	}

	var RES_NOW = [];
	RES_NOW["wood"] = parseInt( $("wood").innerHTML, 10 );
	RES_NOW["stone"] = parseInt( $("stone").innerHTML, 10 );
	RES_NOW["iron"] = parseInt( $("iron").innerHTML, 10 );
	RES_NOW["rice"] = parseInt( $("rice").innerHTML, 10 );
	RES_NOW["storagemax"] = parseInt( $("rice_max").innerHTML, 10 );

	var CHG_NOW = [];
	CHG_NOW["wood"] = 1;
	CHG_NOW["stone"] = 1;
	CHG_NOW["iron"] = 1;

/*
	var OverFlowLimit  = RES_NOW["storagemax"]; 		// 限界容量（倉庫の100%）

	if ( (RES_NOW["wood"] = OverFlowLimit) && (RES_NOW["stone"] = OverFlowLimit) && (RES_NOW["iron"] = OverFlowLimit) ) {
		// 木石鉄が100%の場合
		if (RES_NOW["rice"] = OverFlowLimit) {
			// 糧も100%の場合各資源の1%を寄付する
			var c={};
			c['contributionForm'] = "";
			c['wood']  = Math.floor(RES_NOW["wood"]  * 0.01);
			c['stone'] = Math.floor(RES_NOW["stone"] * 0.01);
			c['iron']  = Math.floor(RES_NOW["iron"]  * 0.01);
			c['rice']  = Math.floor(RES_NOW["rice"]  * 0.01);
			c['contribution'] = 1;
			j$.post("http://"+HOST+"/alliance/level.php",c,function(){});
			var tid=setTimeout(function(){location.reload(false);},INTERVAL);
		}
		return;
	}
*/

	if(OPT_ICHIBA_PATS[3] != OPT_ICHIBA_PA) {

		// @@ 2011.06.22 設定上限が0以下の場合倉庫上限に変更
		if (OPT_MAX_WOOD  < 1) { OPT_MAX_WOOD  = RES_NOW["storagemax"]; }
		if (OPT_MAX_STONE < 1) { OPT_MAX_STONE = RES_NOW["storagemax"]; }
		if (OPT_MAX_IRON  < 1) { OPT_MAX_IRON  = RES_NOW["storagemax"]; }

		if (RES_NOW["wood"]  >= OPT_MAX_WOOD) { CHG_NOW["wood"]  = 0; }
		if (RES_NOW["stone"] >= OPT_MAX_STONE){ CHG_NOW["stone"] = 0; }
		if (RES_NOW["iron"]  >= OPT_MAX_IRON) { CHG_NOW["iron"]  = 0; }

		// 全部上限を超えていて
		if ( ( CHG_NOW["wood"] + CHG_NOW["stone"] + CHG_NOW["iron"] ) == 0 ) {
			// 自動寄付も未設定の場合全部変換対象にする
			if ( OPT_KIFU == 0 ) {
				CHG_NOW["wood"] = 1;
				CHG_NOW["stone"] = 1;
				CHG_NOW["iron"] = 1;
			}
		}

		//糧が指定量より多いかチェック
		if(RES_NOW["rice"] < OPT_RISE_MAX) {
			return;
		}
		if( OPT_RISE_MAX == 0) {
			return;
		}

		// 一番市場レベルの高い拠点へジャンプ 2012.04.13
		var shoplist = cloadData(HOST+"ShopList","[]",true,true);
		if (shoplist.length == 0) { return; }
		shoplist.sort( function(a,b) { if (a[1] < b[1]) return 1; if (a[1] > b[1]) return -1; return 0;});
		if (vId != shoplist[0].vId) {
			// 一番市場のレベルの高い拠点へ移動
			var villages = loadVillages(HOST+PGNAME);
			var nextIndex = -1;
			for(var i=0; i<villages.length;i++){
				if(shoplist[0].vId == villages[i][IDX_XY]){
					nextIndex = i;
					break;
				}
			}
			if (nextIndex != -1) {
				ShopFlg = true;
				ShopURL = villages[nextIndex][IDX_URL];
			}
			return;
		}

		if(OPT_ICHIBA_PATS[0] == OPT_ICHIBA_PA){

			if (OPT_TO_WOOD+OPT_TO_STONE+OPT_TO_IRON == 0) {
				return;
			}

			var min_sigen = 9999999999;


			if((OPT_TO_WOOD  > 0) && (RES_NOW["wood"]  < min_sigen && CHG_NOW["wood"] == 1)) { min_sigen = RES_NOW["wood"] };
			if((OPT_TO_STONE > 0) && (RES_NOW["stone"] < min_sigen && CHG_NOW["stone"] == 1)) { min_sigen = RES_NOW["stone"]; }
			if((OPT_TO_IRON  > 0) && (RES_NOW["iron"]  < min_sigen && CHG_NOW["iron"] == 1)) { min_sigen = RES_NOW["iron"]; }

			//糧から他の資源に返還開始
					if((OPT_TO_WOOD > 0) && ( RES_NOW["wood"] == min_sigen ))	{			changeResorceToResorce(RICE, OPT_TO_WOOD, WOOD, ichiba_x, ichiba_y);
			} else	if((OPT_TO_STONE > 0) && ( RES_NOW["stone"] == min_sigen )) 	{			changeResorceToResorce(RICE, OPT_TO_STONE, STONE, ichiba_x, ichiba_y);
			} else	if((OPT_TO_IRON > 0) && ( RES_NOW["iron"] == min_sigen ))	{			changeResorceToResorce(RICE, OPT_TO_IRON, IRON, ichiba_x, ichiba_y);
			}
//			var tid=setTimeout(function(){location.reload(false);},INTERVAL);
			return;
		}

		if(OPT_ICHIBA_PATS[1] == OPT_ICHIBA_PA){
			if(OPT_RISE_MAX < OPT_TO_WOOD+OPT_TO_STONE+OPT_TO_IRON){
//				alert("変換する総合計より糧の値を大きくしてください。");
			}else{
				if(CHG_NOW["wood"]	== 1)	{		changeResorceToResorce(RICE, OPT_TO_WOOD,	WOOD,	ichiba_x,	ichiba_y);			}
				if(CHG_NOW["stone"] == 1)	{		changeResorceToResorce(RICE, OPT_TO_STONE,	STONE,	ichiba_x,	ichiba_y);			}
				if(CHG_NOW["iron"]	== 1)	{		changeResorceToResorce(RICE, OPT_TO_IRON,	IRON,	ichiba_x,	ichiba_y);			}

			}
//			var tid=setTimeout(function(){location.reload(false);},INTERVAL);
			return;
		}
	}

	function addShopList(vId,lv,x,y) {
		var flg = 0;
		var shoplist = cloadData(HOST+"ShopList","[]",true,true);
		for (var i=0 ; i<shoplist.length ; i++) {
			if (shoplist[i].vId == vId) {
				shoplist[i].vId = vId;
				shoplist[i].lv = lv;
				shoplist[i].x = x;
				shoplist[i].y = y;
				flg = 1;
			}
		}
		if (flg == 0){
			shoplist.push({"vId":vId, "lv":lv, "x":x, "y":y });
		}
		csaveData(HOST+"ShopList",shoplist,true,true);
		// 市場情報が更新されたら表示しなおし
		if ( getStayMode() ) {
			closeIniBilderBox()
			openIniBilderBox()
		}
	}

	function delShopList(vId) {
		var shoplist = cloadData(HOST+"ShopList","[]",true,true);
		for (var i=0;i<shoplist.length;i++){
			if (shoplist[i].vId == vId) {
				shoplist.splice(i,1);
				csaveData(HOST+"ShopList",shoplist,true,true);
			}
		}
		// 市場情報が更新されたら表示しなおし
		if ( getStayMode() ) {
			closeIniBilderBox()
			openIniBilderBox()
		}
	}
}

//実変換処理通信部 @@
function changeResorceToResorce(from, tc, to, x, y) {

	var c={};
	c['x'] = parseInt(x);
	c['y'] = parseInt(y);
	c['change_btn'] = encodeURIComponent("はい");
	c['tc'] = parseInt(tc);
	c['st'] = 1;
	c['tf_id'] = parseInt(from);
	c['tt_id'] = parseInt(to);
	c['ssid'] = j$.cookie('SSID');
	j$.post("http://"+HOST+"/facility/facility.php?x=" + parseInt(x) + "&y=" + parseInt(y) + "#ptop",c,function(){});
	var tid=setTimeout(function(){location.reload(false);},INTERVAL);

}

//自動寄付処理
function autoDonate() {

debugLog("=== Start autoDonate ===");

	if(OPT_KIFU != 1) {
		//alert("自動寄付未指定");
		return;
	}

	//糧が指定量より多いかチェック
	if($("rice").innerHTML < OPT_RISE_KIFU_MAX) {
		return;
	}


	sendDonate(OPT_RISE_KIFU);
//@@@
//	var tid=setTimeout(function(){location.reload(false);},INTERVAL);

}

//寄付処理通信部
function sendDonate(rice) {
/*
	var data = "contributionForm=&wood=0&stone=0&iron=0&rice=" + rice + "&contribution=1";
	var tid=setTimeout(function(){
		GM_xmlhttpRequest({
			method:"POST",
			url:"http://" + HOST + "/alliance/level.php",
			headers:{"Content-type":"application/x-www-form-urlencoded"},
			data: data,
//			onload:function(x){console.log(x.responseText);}
			onload:function(x){;}
		});
	},INTERVAL);
*/
	var c={};
	c['contributionForm'] = "";
	c['wood'] = 0;
	c['stone'] = 0;
	c['iron'] = 0;
	c['rice'] = parseInt(rice);
	c['contribution'] = 1;
	j$.post("http://"+HOST+"/alliance/level.php",c,function(){});
	var tid=setTimeout(function(){location.reload(false);},INTERVAL);
}

//内政スキルの使用
function Auto_Domestic() {

debugLog("=== Start Auto Domestic ===");

	DomesticFlg = false;

	var tid=setTimeout(function(){
		GM_xmlhttpRequest({
			method:"GET",
			url:"http://" + HOST + "/card/domestic_setting.php",
			headers:{"Content-type":"text/html"},
			overrideMimeType:'text/html; charset=utf-8',
			onload:function(x){

				var htmldoc = document.createElement("html");
					htmldoc.innerHTML = x.responseText;

					var skillElem = document.evaluate('//td[@class="skill"]',htmldoc, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
				for(i=0;i<skillElem.snapshotLength;i++){
					var skillTag = trim(skillElem.snapshotItem(i).innerHTML);
					var AutoSkillFlg = 0;

					for(z=1;z<DASkill.length;z++){
						if( (OPT_DOME[z]==1) && ( (skillTag.indexOf(DASkill[z],0) > 1)) ){
							var link = skillTag.substring(skillTag.indexOf("href=",0)+6,skillTag.indexOf("\"",skillTag.indexOf("href=",0)+7));
							do {
								link = link.replace(/&amp;/,"&");
							}while(link.indexOf("&amp;",0) > 1)
							DomesticFlg    = true;

							GM_xmlhttpRequest({ 	method:"GET", url:"http://" + HOST + link, headers:{"Content-type":"text/html"}, overrideMimeType:'text/html; charset=utf-8',	onload:function(x){
								debugLog("内政スキル使用");
								if (OPT_BLD == "AC") {	setVillageFacility();	}	// 拠点建築チェック
								if (OPT_BLD == "BS") {	setVillageFacility2();	}	// 宿舎ビルド＆スクラッチ

								getSoldier();				// 自動造兵処理
								autoLvup(); 				// 自動武器・防具強化
								ichibaChange(vId);			// 市場処理
								autoDonate();				// 自動寄付処理

								DomesticFlg = false;
							} });
							while(1){
								if (DomesticFlg == false) {
									debugLog("== END Auto_Domestic==");
									break;
								}
								Thread.sleep(100);	// 100ms 停止
							}
							if (DomesticFlg == false) { break; }
						}
					}
				}
				debugLog("内政スキル未使用");
				if (OPT_BLD == "AC") {	setVillageFacility();	}	// 拠点建築チェック
				if (OPT_BLD == "BS") {	setVillageFacility2();	}	// 宿舎ビルド＆スクラッチ

				getSoldier();				// 自動造兵処理
				autoLvup(); 				// 自動武器・防具強化
				ichibaChange(vId);			// 市場処理
				autoDonate();				// 自動寄付処理

			}
		});
	},INTERVAL);
}

///////////////////////////////////////////////
//Chrome用GM_関数
// @copyright 2009, James Campos
// @license cc-by-3.0; http://creativecommons.org/licenses/by/3.0/
if ((typeof GM_getValue == 'undefined') || (GM_getValue('a', 'b') == undefined)) {
	GM_addStyle = function(css) {
		var style = document.createElement('style');
		style.textContent = css;
		document.getElementsByTagName('head')[0].appendChild(style);
	};

	GM_deleteValue = function(name) {
		localStorage.removeItem(name);
	};

	GM_getValue = function(name, defaultValue) {
		var value = localStorage.getItem(name);
		if (!value)
			return defaultValue;
		var type = value[0];
		value = value.substring(1);
			switch (type) {
				case 'b':
					return value == 'true';
				case 'n':
					return Number(value);
				default:
					return value;
			}
	};

	GM_log = function(message) {
		if (window.opera) {
			opera.postError(message);
			return;
		}
	};

	GM_registerMenuCommand = function(name, funk) {
	//todo
	};

	GM_setValue = function(name, value) {
		value = (typeof value)[0] + value;
		localStorage.setItem(name, value);
	};
}

function ccreateCheckBox0(container, id, def, text, title, left, villages)
{
	left += 2;

	var cb = d.createElement("input");
	cb.type = "checkbox";
	cb.style.verticalAlign = "middle";
	cb.id = id;
	//cb.value = 1;
	//if( def ) cb.checked = true;
	cb.checked	= def;
	cb.addEventListener("change",
// @@@
	function() {
		for (var i = 0; i < villages.length; i++) {
			GM_setValue(HOST+PGNAME+"OPT_CHKBOX_AVC_" + i, document.getElementById('OPT_CHKBOX_AVC_' + i).checked);
		}
	}, true);

	container.appendChild(cb);
	return cb;
}

// 2011.06.22
function ccreateCheckBoxKai2(container, id, def, text, title, left )
{

	left += 2;
	var dv = d.createElement("div");
	dv.style.padding = "1px";
	dv.style.paddingLeft= left + "px";

	dv.title = title;
	var cb = d.createElement("input");
	cb.type = "checkbox";
	cb.style.verticalAlign = "middle";
	cb.id = id + def;
	cb.value = 1;

	var def2 = id  + ""  + "[" + def + "]";

	if( eval(def2) ) cb.checked = true;

	var lb = d.createElement("label");
	lb.htmlFor = id;
	lb.style.verticalAlign = "middle";

	var tx = d.createTextNode(text);
	tx.fontSize = "10px";
	lb.appendChild( tx );
	var tb = d.createElement("input");
	tb.type = "text";
	tb.id = id + "LV" + def;
	tb.value = eval(id	+ "LV"	+ "[" + def + "]");
	tb.style.verticalAlign = "middle";
	tb.style.textAlign = "right";
	tb.style.paddingRight = "3px";
	tb.size = 4;

	dv.appendChild(cb);
	dv.appendChild(lb);
	dv.appendChild(tb);
	container.appendChild(dv);
	return cb;
}

// 2015.05.10
function ccreateCheckBox3(container, id, val, def, text, title, left, multiple ) {
	if (multiple == 0) {
		ccreateCheckBox(container, id + '' + def, val[def], text, title, left ); // 2015.05.13
	} else {
		ccreateCheckBoxKai2(container, id, def, text, title + '残す数を入力してください。', left );
	}
}

function JSSleep(sec) {
	var start = new Date;
	while (1) {
		var cur = new Date;
		if (sec * 1000 <= cur.getTime() - start.getTime()) {
			break;
		}
	}
}
///////////////////////////////////////////////
// Time 部分の追加
///////////////////////////////////////////////
function sortAction(actions) {
	actions.sort(function(val1, val2) {
		var diff = (new Date(val1[IDX2_TIME])).getTime()
				 - (new Date(val2[IDX2_TIME])).getTime();
		return diff;
	});
	return actions;
}

//拠点の作業中情報を取得
function getVillageActions() {
	var data = new Array();
	//拠点名を取得
	var baseNameElem = document.evaluate(
		'//*[@id="basepoint"]/span[@class="basename"]',
		document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	data[IDX_BASE_NAME] = trim(baseNameElem.snapshotItem(0).innerHTML);

	//座標を取得
	var xyElem = document.evaluate('//*[@id="basepoint"]/span[@class="xy"]',
		document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	data[IDX_XY] = trim(xyElem.snapshotItem(0).innerHTML.match(/(\(-?\d+,-?\d+\))/)[1]);		// 2014.08.20

	//建設情報を取得
	var actionsElem = document.evaluate('//*[@id="actionLog"]/ul/li',
		document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	var actions1 = new Array();
	for (var i = 0; i < actionsElem.snapshotLength; i++) {
		var paItem = actionsElem.snapshotItem(i);
		var newAction = new Array();

		//ステータス
		var buildStatusElem = document.evaluate('./span[@class="buildStatus"]/a', paItem, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
		var buildStatus;
		if (buildStatusElem.snapshotLength > 0) {
			//施設建設
			var buildstr = trim(document.evaluate('./span[@class="buildStatus"]', paItem, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotItem(0).innerHTML).substr(0,2);
			if (buildstr == "建設") {
				newAction[IDX2_DELETE] = false;
				buildStatus = "建設:" + trim(buildStatusElem.snapshotItem(0).innerHTML);
			} else {
				newAction[IDX2_DELETE] = true;
				buildStatus = "削除:" + trim(buildStatusElem.snapshotItem(0).innerHTML);
			}
		} else {
/*
			buildStatusElem = document.evaluate('./span[@class="buildStatus"]', 	paItem, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
			if (buildStatusElem.snapshotItem(0).innerHTML.match(/強化/)) {
				continue;
			}
			var tempStr1 = buildStatusElem.snapshotItem(0).innerHTML.split("を");
			buildStatus = "研究所:" + tempStr1[0];
			newAction[IDX2_DELETE] = false;
*/
			continue;
		}
		newAction[IDX2_ROTATION] = 0;
		newAction[IDX2_TYPE] = TYPE_CONSTRUCTION;
		newAction[IDX2_STATUS] = buildStatus;

		//施設建設完了時刻
		var buildClockElem = document.evaluate('./span[@class="buildClock"]', paItem, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
		var clock = buildClockElem.snapshotItem(0).innerHTML;
		newAction[IDX2_TIME] = generateDateString(computeTime(clock));

//		console.log(generateDateString(computeTime(clock)));

		actions1.push(newAction);
	}

	//建設情報を永続保存
	data[IDX_ACTIONS] = actions1;
	saveVillage(data, TYPE_CONSTRUCTION);

	//行軍情報を取得
	var actionsElem = document.evaluate(
		'//*[@id="action"]/div[@class="floatInner"]/ul/li',
		document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	var actions2 = new Array();
	for (var i = 0; i < actionsElem.snapshotLength; i++) {
		var paItem = actionsElem.snapshotItem(i);
		var newAction = new Array();
		newAction[IDX2_TYPE] = TYPE_MARCH;
		newAction[IDX2_DELETE] = false;
		newAction[IDX2_ROTATION] = 0;

		//ステータス
		var statusElem = document.evaluate('./a',
			paItem, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
		var status = trim(statusElem.snapshotItem(0).innerHTML);
		newAction[IDX2_STATUS] = "行軍:" + status;

		//完了時刻
		var buildClockElem = document.evaluate('./span',
			paItem, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
		var clock = buildClockElem.snapshotItem(0).innerHTML;
		newAction[IDX2_TIME] = generateDateString(computeTime(clock));

		actions2.push(newAction);
	}

	//行軍情報を永続保存
	data[IDX_ACTIONS] = actions2;
	saveVillage(data, TYPE_MARCH);
	if ( getStayMode() ) {
		closeIniBilderBox()
		openIniBilderBox()
	}
}

//拠点情報を保存
function saveVillage(newData, type) {
	var allData = loadVillages(location.hostname+PGNAME);

	//新旧データをマージ
	var exists = false;
	for (var i = 0; i < allData.length; i++) {
		var villageData = allData[i];

		//作業リスト更新
		if (villageData[IDX_XY] == newData[IDX_XY]) {
			exists = true;
			villageData[IDX_BASE_NAME] = newData[IDX_BASE_NAME];

			var actions = villageData[IDX_ACTIONS];
			for (var j = actions.length - 1; j >= 0; j--) {
				if (actions[j][IDX2_TYPE] != type) continue;
				var endTime = new Date(actions[j][IDX2_TIME]);
				var nowTime = new Date();
				if (isNaN(endTime.valueOf()) || endTime > nowTime) actions.splice(j, 1);
			}
			villageData[IDX_ACTIONS] = actions.concat(newData[IDX_ACTIONS]);
		}

		allData[i] = villageData;
	}
	if (!exists) allData.push(newData);
	//Greasemonkey領域へ永続保存
	saveVillages(HOST+PGNAME, allData);
}

//各作業行生成
function createActionDiv(action, nowTime, baseXy, host) {
	var type = action[IDX2_TYPE].charAt(0);
//	if (getDispMode(type) == DISP_MODE_NONE) {
//		return undefined;
//	}

	var actionDiv = document.createElement("div");
	if ( action[IDX2_DELETE] == "true" ) {
		actionDiv.style.backgroundColor = "#BBDDDD";
	}
	//作業完了背景色
	var actionTime = new Date(action[IDX2_TIME]);
	if (actionTime < nowTime) {
		actionDiv.style.backgroundColor = COLOR_TITLE;
	}

	//作業完了時刻
	var textSpan = document.createElement("span");
	var text = "";
	text += action[IDX2_TIME].replace(/^[0-9]{4}\//, "");
//	if (getDispWaitTime()) {
		var finishTime = new Date(action[IDX2_TIME]);
		text += " (あと" + generateWaitTimeString(finishTime, nowTime) + ")";
//	}
	text += " ";
	text += action[IDX2_STATUS] + " ";
	textSpan.innerHTML = text;
	actionDiv.appendChild(textSpan);

	//作業完了行の個別削除リンク
	if (actionTime < nowTime) {
		var delLink = document.createElement("a");
		delLink.title = "確認済にして削除します";
		delLink.href = "javascript:void(0);";
		delLink.style.color = "#E86D61";
		delLink.innerHTML = "済";

		var key = host + DELIMIT1 + baseXy + DELIMIT1 + action[IDX2_TIME];
		delLink.addEventListener("click",
			(function(key_) {
				return function() { deleteAction(key_); }
			})(key), true);
		actionDiv.appendChild(delLink);
	}

	return actionDiv;
}

function confirmTimer() {
	//基準時刻より前の作業情報を削除
	var hosts = getTargetHosts();
	for (var ii = 0; ii < hosts.length; ii++) {
		var baseTime = new Date();
//		var baseTime = new Date(document.getElementById("openTime").innerHTML);
		var villages = loadVillages(hosts[ii] + PGNAME);
		for (var i = 0; i < villages.length; i++) {
			var actions = villages[i][IDX_ACTIONS];
			for (var j = actions.length - 1; j >=0 ; j--) {
				var actionTime = new Date(actions[j][IDX2_TIME]);
				if (actionTime <= baseTime) {
					actions.splice(j, 1);
				}
			}
			villages[i][IDX_ACTIONS] = actions;
		}

		//保存
		saveVillages(hosts[ii] + PGNAME, villages);
	}

	//更新後内容で表示　2013.01.10 ???
	if ( getStayMode() ) {
		closeIniBilderBox()
		openIniBilderBox()
	}

}

//通知対象ホスト
function getTargetHosts() {
	var hosts = new Array();
	var dispOtherHosts = GM_getValue(location.hostname + "_disp_other_hosts", false);
	if (dispOtherHosts) {
		hosts = loadHosts();
	} else {
		hosts[0] = location.hostname;
	}
	return hosts;
}

function deleteAction(key) {
	var hosts = getTargetHosts();
	for (var ii = 0; ii < hosts.length; ii++) {
		var villages = loadVillages(hosts[ii] + PGNAME);
		var exists = false;
		villageLoop:
		for (var i = 0; i < villages.length; i++) {
			for (var j = 0; j < villages[i][IDX_ACTIONS].length; j++) {
				var action = villages[i][IDX_ACTIONS][j];
				var curKey = hosts[ii] + DELIMIT1 +
					villages[i][IDX_XY] + DELIMIT1 + action[IDX2_TIME];
				if (key == curKey) {
					exists = true;
					villages[i][IDX_ACTIONS].splice(j, 1);
					break villageLoop;
				}
			}
		}

		//見つかったら更新
		if (exists) {
			saveVillages(hosts[ii] + PGNAME, villages);
			if ( getStayMode() ) {
				closeIniBilderBox()
				openIniBilderBox()
			}
			return;
		}
	}
}

//施設内作業中取得
function getTrainingSoldier(htmldoc) {
	var data = getMyVillage();
	data[IDX_ACTIONS] = new Array();
	var tt={};
	//施設名
	var facilityName = "";
	var h2Elem = document.evaluate('//*[@id="gray02Wrapper"]/h2', htmldoc, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	if (h2Elem.getSnapshotLength != 0) {
		facilityName = trim(h2Elem.snapshotItem(0).innerHTML);
	}
	// 作成数の兵数と兵種
	var mSolName = document.evaluate('//th[@class="mainTtl"]',htmldoc, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
//	var mSolNum = document.evaluate('//td',htmldoc, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	var mSolNum = document.evaluate('//*[@class="commonTables"]//td',htmldoc, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	// 作成できる兵種の種類数

	var mSolTypeT = document.evaluate('//table[@class="commonTables"]',htmldoc, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	if (mSolTypeT.snapshotLength > 2) {
		var mSolType = document.evaluate('//*[@class="mainTtl"]',mSolTypeT.snapshotItem(1), null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
		for(var r=1;r < mSolType.snapshotLength;r++) {
			tt[r-1] = new Array()
			tt[r-1] = mSolType.snapshotItem(r).innerHTML
			var endflg = false;
			if (r > 1) {
				for (var q=0;q<r-1;q++) {
					if (tt[q] == mSolType.snapshotItem(r).innerHTML) {
						endflg = true;
						break;
					}
				}
			}
			if (endflg) {
				var mSolTypeNum = r - 1;
				break;
			}
		}
	}
	// 施設が最大レベルかの判断
	var commentNum = document.evaluate('//*[@class="lvupFacility"]/*[@class="main"]', htmldoc, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	if (commentNum.snapshotItem(0).innerHTML.match("最大レベル")) {
		maxLv = 3;
	} else {
		maxLv = 0;
	}

	//作業中情報取得
	var idx = 0;
	while (1) {
		var actionType = TYPE_FACILITY + facilityName;

		var clockElem = document.evaluate('//*[@id=' + escapeXPathExpr("area_timer" + idx) + ']', htmldoc, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotItem(0);
		if (clockElem == undefined) {
			saveVillage(data, actionType);		// 研究所で未研究の場合過去の研究情報の削除
			break;
		}

		var mainTtls = document.evaluate('../../../tr/th[@class="mainTtl"]', clockElem, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
		if (mainTtls.snapshotLength == 0) break;
		var clock = trim(clockElem.innerHTML);
		if (clock == "") break;

		var mainTtlElem = mainTtls.snapshotItem(idx);
		if (mainTtlElem == undefined) break;
		var status = trim(mainTtlElem.innerHTML);
		if (status == "") break;

		var actionType = TYPE_FACILITY + facilityName;

		data[IDX_ACTIONS][idx] = new Array();

		if (facilityName == "鍛冶場" || facilityName == "防具工場" || facilityName == "研究所") {
			data[IDX_ACTIONS][idx][IDX2_STATUS] = facilityName + ":" + status;
		} else {
			try {

				data[IDX_ACTIONS][idx][IDX2_STATUS] = facilityName + ":" + status + "(" + mSolNum.snapshotItem(8 + mSolTypeNum + (mSolTypeNum * 5) + (idx * 4) - (1 * maxLv)).innerHTML + ")";
			}catch(e) {
				data[IDX_ACTIONS][idx][IDX2_STATUS] = facilityName + ":" + status + " (error)";
			}

		}
		data[IDX_ACTIONS][idx][IDX2_TIME] = generateDateString(computeTime(clock));
		data[IDX_ACTIONS][idx][IDX2_TYPE] = actionType;
		data[IDX_ACTIONS][idx][IDX2_DELETE] = false;
		data[IDX_ACTIONS][idx][IDX2_ROTATION] = 0;

		idx++;
	}

//	saveVillage(data, actionType);	2012.09.06 ちょっちオミット
}

function getMyVillage() {
	var ret = new Array();

	var xy=getMyXY();
	if(! xy){
		return ret;
	}
	var allData = loadVillages(location.hostname + PGNAME);
	for (var i = 0; i < allData.length; i++) {
		var villageData = allData[i];
		if (villageData[IDX_XY] == "("+xy+")") {
			ret[IDX_XY] = villageData[IDX_XY];
			ret[IDX_BASE_NAME] = villageData[IDX_BASE_NAME];
			return ret;
		}
	}

	return ret;
}

function getMyXY() {
	var d = document;
	var $x = function(xp,dc) {
		return document.evaluate(xp, dc||d, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
	};

	var gnaviorgNav = d.getElementById("gnavi");
	if(gnaviorgNav) {
		var nowLoc = $x('id("gnavi")//a[contains(@href,"map.php")]');
	}else{
		var nowLoc = $x('id("gNav")//a[contains(@href,"map.php")]');
	}

	if (!nowLoc) return null;

	var xy = nowLoc.href.match(/x=([\-0-9]+)&y=([\-0-9]+)/i);
	if( xy ) {
		return xy[1]+","+xy[2];
	}
}
//内政スキル取得
function getDomesticSkill(htmldoc) {
	var data = getMyVillage();
	data[IDX_ACTIONS] = new Array();
	var i = -1;
	// 使用中
	var useSkill = document.evaluate('//div[@class="base-skill"]/span/a', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	if (!useSkill.snapshotItem(0).innerHTML.match("--:--:--")) {
//		console.log(useSkill.snapshotItem(0).innerHTML);
		i += 1;
		data[IDX_ACTIONS][i] = new Array();
		var SkillName = useSkill.snapshotItem(0).innerHTML.split(":")[1].split("(")[0];
		var status = "内政:使用(" + trim(useSkill.snapshotItem(0).innerHTML.split(":")[0]) + ":" + SkillName + ")";
		data[IDX_ACTIONS][i][IDX2_STATUS] = status;
		data[IDX_ACTIONS][i][IDX2_TIME] = generateDateString(computeTime(useSkill.snapshotItem(0).innerHTML.split(">")[1].substr(0,8)));
		data[IDX_ACTIONS][i][IDX2_TYPE] = TYPE_DOMESTIC;
		data[IDX_ACTIONS][i][IDX2_DELETE] = false;
		data[IDX_ACTIONS][i][IDX2_ROTATION] = 0;
	}
	// 回復中
	var dom = document.createElement("html");
	var RecoveryCheck = document.evaluate('//table[@class="general"]', htmldoc, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	for (var z=0;z<RecoveryCheck.snapshotLength;z++){
		if (RecoveryCheck.snapshotItem(z).innerHTML.match("内政中")) {
			dom.innerHTML = "<table>" + RecoveryCheck.snapshotItem(z).innerHTML + "</table>";
			// 内政武将名
			var Name = document.evaluate('//td/a[@class="thickbox"]', dom, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotItem(1).innerHTML;
			var RecoverySkill = document.evaluate('//td[@class="recovery"]', dom, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
			for (var x=0;x<RecoverySkill.snapshotLength;x++) {
				i += 1;
				data[IDX_ACTIONS][i] = new Array();
				var SkillName  = RecoverySkill.snapshotItem(x).innerHTML.split("<")[0]; 		// スキル名
				var SkillRTime = RecoverySkill.snapshotItem(x).innerHTML.split('>')[2].substr(0,8); 	// 回復時間
				var status = "回復";
				status = "内政:" + status + "(" + trim(Name) + "：" + SkillName + ")";
				data[IDX_ACTIONS][i][IDX2_STATUS] = status;
				data[IDX_ACTIONS][i][IDX2_TIME] = generateDateString(computeTime(SkillRTime));
				data[IDX_ACTIONS][i][IDX2_TYPE] = TYPE_DOMESTIC;
				data[IDX_ACTIONS][i][IDX2_DELETE] = false;
				data[IDX_ACTIONS][i][IDX2_ROTATION] = 0;
			}
		}
	}
	saveVillage(data, TYPE_DOMESTIC);
	if ( getStayMode() ) {
		closeIniBilderBox()
		openIniBilderBox()
	}
}
//常駐モード取得
function getStayMode() {
	var result = GM_getValue(location.hostname + "_stay_mode" + PGNAME, true);
	return result;
}

//常駐モード変更
function changeStayMode(value) {
	GM_setValue(location.hostname + "_stay_mode" + PGNAME, value);
}


//巡回モード取得
function getReverseMode() {
	var result = GM_getValue(location.hostname + "_reverse_mode" + PGNAME, false);
	return result;
}

//巡回モード変更
function changeReverseMode(value) {
	GM_setValue(location.hostname + "_reverse_mode" + PGNAME, value);
}

//次回完了時刻取得
function getNextTime(hostname, baseTime) {

	//一番早い作業完了時刻を取得
	var startTime = new Date("2099/12/31 23:59:59");
	var nextTime = startTime;
	var villages = loadVillages(location.hostname + PGNAME);
	nextURL = "";
	for (var i = 0; i < villages.length; i++) {
		var actions = villages[i][IDX_ACTIONS];
		for (var j = 0; j < actions.length; j++) {
			var actionTime = new Date(actions[j][IDX2_TIME]);
			if (actionTime > baseTime && actionTime < nextTime) {
				var type = actions[j][IDX2_TYPE].charAt(0);
				nextTime = actionTime;
				nextURL  = villages[i][IDX_URL];
				nextNAME = villages[i][IDX_BASE_NAME];
			}
		}
	}

	//作業中がなければ何もしない
	if (nextTime == startTime) nextTime = undefined;

	return nextTime;
}

function xpath(query,targetDoc) {
	return document.evaluate(query, targetDoc, null,XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
}

function escapeXPathExpr(text) {
	var matches = text.match(/[^"]+|"/g);

	function esc(t) {
		return t == '"' ? ('\'' + t + '\'') : ('"' + t + '"');
	}

	if (matches) {
		if (matches.length == 1) {
			return esc(matches[0]);
		}
		else {
			var results = [];
			for (var i = 0; i < matches.length; i ++) {
				results.push(esc(matches[i]));
			}
			return 'concat(' + results.join(', ') + ')';
		}
	}
	else {
		return '""';
	}
}

function forInt(num,def){
//	console.log(num + " : " + def);
	if (def == undefined) { 	def = 0;	}
	if (isNaN(parseInt(num))) {
		return def;
	} else {
		return parseInt(num);
	}
}