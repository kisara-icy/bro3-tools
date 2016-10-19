// ==UserScript==
// @name		bro3_calc_defense
// @namespace	https://gist.github.com/RAPT21/
// @description	<内蔵版>ブラ三 領地民兵計算機 by BSE with RAPT
// @include		http://*.3gokushi.jp/facility/castle_send_troop.php*
// @exclude		http://*.3gokushi.jp/maintenance*
// @connect		3gokushi.jp
// @grant		GM_xmlhttpRequest
// @author		BSE with RAPT
// @version 	based on 1.6.1.2
// ==/UserScript==

// ----- BSE 版リリースノート -----
//	2016.03.13 Ver1.6.1 リリース
// ----- 改修リリースノート -----
//	2016.08.20 v1.6.1.1 初版作成。【注意】本スクリプトの内容について BSE 氏に問い合わせないでください。
//	2016.10.10 v1.6.1.2 y9,y31,y34 鯖対応

//バージョン配置用
var ver_rack = "ver1.6.1.2";

//配布管理系
var nazeka ="<span style='color:crimson'>■</span>";
var se_rack = "<span style='color:silver'>&lt;内蔵版&gt;ブラ三 領地民兵計算機 by BSE " + ver_rack + " with RAPT</span>";
var url_rack = "http://dev.3g-ws.com/";
var com_rack = nazeka + "【Map x-xx】"+nazeka;
var img_URL = "http://ms.3g-ws.com/calc/i-1t31.png";
var img_alt = "※※非常連絡用※※";
var img_txt = "<span style='color:white'>←青ロゴ：通常　　緑ロゴ：一部に異常　　赤ロゴ：異常事態</span>\n";

var NPC_HOLDER	 = "NPC拠点：<span style='color:red; font-weight:bold;'>NPC拠点と推測されます。中身をうかがい知ることは出来ません。</span>";
var PLAYER_HOLDER = "君主城：プレイヤー本拠地&nbsp;<span style='color:red; font-weight:bold;'>誰かの本拠地と推測されます。中身をうかがい知ることは出来ません。</span>";

//　出兵距離格納変数
var length;

//　出兵先のタイル数格納変数（平地、木、岩、鉄、穀、荒地）の順。
var tile = new Array(0,0,0,0,0,0);

// 鯖 - 期
var server_session = {
	"y1": 17,
	"y9": 15,
	"y17": 10,
	"y25": 7,
	"y29": 4,
	"y31": 3,
	"y33": 1,
	"y34": 1,
	"f1": 10, // event-world
	"w1": 100,
	"w2": 100
};

// マップタイプ - 期
var maptype_session = {
	"a-1t": [1],
	"b-1t": [2],
	"c-1t": [3,4],
	"d-1t": [5,6,7,8,9],
	"e-2t": [10,11],
	"f-1t": [12,13],
	"g-1t": [14,15],
	"h-1t": [16,17],
	"i-1t": [18],
	"j-1t": [100] //w1, w2
};

//　出兵先のパネル構成ごとの兵数計算パラメータ
var point_list = [
	{"type":"a-1t","data":{
		// a-1t-(2013-1213)☆6修正版
		"100016":["☆1(1-0-0-0)",5,0,0,0,0,0,0,0,0,0],
		"010016":["☆1(0-1-0-0)",5,0,0,0,0,0,0,0,0,0],
		"001016":["☆1(0-0-1-0)",5,0,0,0,0,0,0,0,0,0],
		"000116":["☆1(0-0-0-1)",5,0,0,0,0,0,0,0,0,0],
		"300016":["☆2(3-0-0-0)",0,0,0.5,4,0.5,0,0,0,0,0],
		"003016":["☆2(0-0-3-0)",0,0,0.5,0.5,4,0,0,0,0,0],
		"030016":["☆2(0-3-0-0)",0,0,4,0.5,0.5,0,0,0,0,0],
		"000411":["☆3(0-0-0-4)",0,12,2,2,2,0,0,0,0,0],
		"111022":["☆3(1-1-1-0)",0,0,6,6,6,0,0,0,0,0],
		"222023":["☆4(2-2-2-0)",0,0,12.5,12.5,12.5,0,0,0,0,0],
		"222218":["☆4(2-2-2-2)",0,7.5,8.5,8.5,8.5,0,0,0,0,0],
		"000813":["☆4(0-0-0-8)",0,16.5,7,7,7,0,0,0,0,0],
		"600022":["☆5(6-0-0-0)",0,0,10,40,10,0,0,0,0,0],
		"060022":["☆5(0-6-0-0)",0,0,40,10,10,0,0,0,0,0],
		"006022":["☆5(0-0-6-0)",0,0,10,10,40,0,0,0,0,0],
		"0100014":["☆6(0-10-0-0)",0,0,75,15,15,0,0,0,0,0],
		"0010014":["☆6(0-0-10-0)",0,0,15,15,75,0,0,0,0,0],
		"1000014":["☆6(10-0-0-0)",0,0,15,75,15,0,0,0,0,0],
		"333025":["☆7(3-3-3-0)",0,0,0,0,0,0,0,50,50,50],
		"444433":["☆8(4-4-4-4)",0,0,0,0,0,0,82.5,72.5,72.5,72.5],
		"0001817":["☆9(0-0-0-18)",0,0,0,0,0,0,195,85,85,85],
		"000049":[NPC_HOLDER],
		"333337":[PLAYER_HOLDER]
	}}, {"type":"b-1t","data":{
		// b-1t-(2013-1214暫定)→2015-1111再検定
		"100016":["☆1(1-0-0-0)",5,0,0,0,0,0,0,0,0,0],
		"010016":["☆1(0-1-0-0)",5,0,0,0,0,0,0,0,0,0],
		"001016":["☆1(0-0-1-0)",5,0,0,0,0,0,0,0,0,0],
		"000116":["☆1(0-0-0-1)",5,0,0,0,0,0,0,0,0,0],
		"300016":["☆2(3-0-0-0)",0,0,0.5,6,0.5,0,0,0,0,0],
		"030016":["☆2(0-3-0-0)",0,0,6,0.5,0.5,0,0,0,0,0],
		"003016":["☆2(0-0-3-0)",0,0,0.5,0.5,6,0,0,0,0,0],
		"111022":["☆3(1-1-1-0)",0,0,7.5,7.5,7.5,0,0,0,0,0],
		"000411":["☆3(0-0-0-4)",0,14,3,3,3,0,0,0,0,0],
		"000126":["☆3(0-0-0-1)",0,5,6,6,6,0,0,0,0,0],
		"222023":["☆4(2-2-2-0)空23",0,0,14,14,14,0,0,0,0,0],
		"222020":["☆4(2-2-2-0)空20",0,0,5,5,35,0,0,0,0,0],
		"000813":["☆4(0-0-0-8)",0,18,9,9,9,0,0,0,0,0],
		"600022":["☆5(6-0-0-0)",0,0,12.5,65,12.5,0,0,0,0,0],
		"060022":["☆5(0-6-0-0)",0,0,65,12.5,12.5,0,0,0,0,0],
		"006022":["☆5(0-0-6-0)",0,0,12.5,12.5,65,0,0,0,0,0],
		"000129":["☆5(0-0-0-1)",0,45,15,15,15,0,0,0,0,0],
		"222024":["☆6(2-2-2-0)",0,0,0,0,0,0,0,27.5,27.5,27.5],
		"1000020":["☆6(10-0-0-0)",0,0,0,0,0,0,0,12.5,60,12.5],
		"0100020":["☆6(0-10-0-0)",0,0,0,0,0,0,0,60,12.5,12.5],
		"0010020":["☆6(0-0-10-0)",0,0,0,0,0,0,0,12.5,12.5,60],
		"244025":["☆7(2-4-4-0)",0,0,0,0,0,0,0,65,22.5,65],
		"000133":["☆7(0-0-0-1)",0,0,0,0,0,0,17.5,45,45,45],
		"0001216":["☆7(0-0-0-12)",0,0,0,0,0,0,55,32.5,32.5,32.5],
		"412028":["☆8(4-1-2-0)",0,0,0,0,0,0,0,25,250,50],
		"241027":["☆8(2-4-1-0)",0,0,0,0,0,0,0,250,50,25],
		"124027":["☆8(1-2-4-0)",0,0,0,0,0,0,0,50,25,250],
		"444429":["☆9(4-4-4-4)",0,0,0,0,0,0,150,150,150,150],
		"111240":["☆9(1-1-1-2)",0,0,0,0,0,0,240,110,110,110],
		"0001815":["☆9(0-0-0-18)",0,0,0,0,0,0,52.5,157.5,157.5,157.5],
		"000049":[NPC_HOLDER],
		"333337":[PLAYER_HOLDER]
	}}, {"type":"c-1t","data":{
		// c-1t-(2014-0302-L報)
		"100016":["☆1(1-0-0-0)",5,0,0,0,0,0,0,0,0,0],
		"010016":["☆1(0-1-0-0)",5,0,0,0,0,0,0,0,0,0],
		"001016":["☆1(0-0-1-0)",5,0,0,0,0,0,0,0,0,0],
		"000116":["☆1(0-0-0-1)",5,0,0,0,0,0,0,0,0,0],
		"300016":["☆2(3-0-0-0)",0,0,0.5,10,0.5,0,0,0,0,0],
		"030016":["☆2(0-3-0-0)",0,0,10,0.5,0.5,0,0,0,0,0],
		"003016":["☆2(0-0-3-0)",0,0,0.5,0.5,10,0,0,0,0,0],
		"111022":["☆3(1-1-1-0)",0,0,9,9,9,0,0,0,0,0],
		"000411":["☆3(0-0-0-4)",0,12.5,6.5,6.5,6.5,0,0,0,0,0],
		"000126":["☆3(0-0-0-1)",0,15,7,7,7,0,0,0,0,0],
		"222023":["☆4(2-2-2-0)空23",0,0,16,16,16,0,0,0,0,0],
		"222020":["☆4(2-2-2-0)空20",0,0,7.5,7.5,35,0,0,0,0,0],
		"000813":["☆4(0-0-0-8)",0,22.5,11.5,11.5,11.5,0,0,0,0,0],
		"600022":["☆5(6-0-0-0)",0,0,12.5,75,12.5,0,0,0,0,0],
		"060022":["☆5(0-6-0-0)",0,0,75,12.5,12.5,0,0,0,0,0],
		"006022":["☆5(0-0-6-0)",0,0,12.5,12.5,75,0,0,0,0,0],
		"000129":["☆5(0-0-0-1)",0,30,22.5,22.5,22.5,0,0,0,0,0],
		"221025":["☆5(2-2-1-0)",0,0,35,35,35,0,0,0,0,0],
		"112025":["☆5(1-1-2-0)",0,0,37.5,37.5,37.5,0,0,0,0,0],
		"1000020":["☆6(10-0-0-0)",0,0,0,0,0,0,0,20,90,20],
		"0100020":["☆6(0-10-0-0)",0,0,0,0,0,0,0,90,20,20],
		"0010020":["☆6(0-0-10-0)",0,0,0,0,0,0,0,20,20,90],
		"222024":["☆6(2-2-2-0)",0,0,0,0,0,0,0,40,40,40],
		"244025":["☆7(2-4-4-0)",0,0,0,0,0,0,0,110,30,30],
		"000133":["☆7(0-0-0-1)",0,0,0,0,0,0,92.5,52.5,52.5,52.5],
		"0001216":["☆7(0-0-0-12)",0,0,0,0,0,0,68,34,34,34],
		"1400022":["☆8(14-0-0-0)",0,0,0,0,0,0,0,75,250,75],
		"0140022":["☆8(0-14-0-0)",0,0,0,0,0,0,0,250,75,75],
		"0014022":["☆8(0-0-14-0)",0,0,0,0,0,0,0,75,75,250],
		"412028":["☆8(4-1-2-0)",0,0,0,0,0,0,0,50,250,205],
		"241027":["☆8(2-4-1-0)",0,0,0,0,0,0,0,250,50,25],
		"124027":["☆8(1-2-4-0)",0,0,0,0,0,0,0,25,50,250],
		"10008":["☆9(1-0-0-0)",0,0,0,0,0,0,0,150,300,150],
		"01008":["☆9(0-1-0-0)",0,0,0,0,0,0,0,300,150,150],
		"00108":["☆9(0-0-1-0)",0,0,0,0,0,0,0,150,150,300],
		"444429":["☆9(4-4-4-4)",0,0,0,0,0,0,225,225,225,225],
		"111240":["☆9(1-1-1-2)",0,0,0,0,0,0,75,225,225,225],
		"0001815":["☆9(0-0-0-18)",0,0,0,0,0,0,300,100,100,100],
		"000049":[NPC_HOLDER],
		"333337":[PLAYER_HOLDER]
	}}, {"type":"d-1t","data":{
		// d-1t-(2014-Re54)
		"100016":["☆1(1-0-0-0)",5,0,0,0,0,0,0,0,0,0],
		"010016":["☆1(0-1-0-0)",5,0,0,0,0,0,0,0,0,0],
		"001016":["☆1(0-0-1-0)",5,0,0,0,0,0,0,0,0,0],
		"000116":["☆1(0-0-0-1)",5,0,0,0,0,0,0,0,0,0],
		"300016":["☆2(3-0-0-0)",0,0,1,12.5,1,0,0,0,0,0],
		"030016":["☆2(0-3-0-0)",0,0,12.5,1,1,0,0,0,0,0],
		"003016":["☆2(0-0-3-0)",0,0,1,1,12.5,0,0,0,0,0],
		"111022":["☆3(1-1-1-0)",0,0,15,15,15,0,0,0,0,0],
		"000411":["☆3(0-0-0-4)",0,29.5,6.5,6.5,6.5,0,0,0,0,0],
		"000126":["☆3(0-0-0-1)",0,30,7,7,7,0,0,0,0,0],
		"222023":["☆4(2-2-2-0)空23",0,0,33,33,33,0,0,0,0,0],
		"222020":["☆4(2-2-2-0)空20",0,0,30,30,45,0,0,0,0,0],
		"000813":["☆4(0-0-0-8)",0,55.5,17.5,17.5,17.5,0,0,0,0,0],
		"600022":["☆5(6-0-0-0)",0,0,33,111,33,0,0,0,0,0],
		"060022":["☆5(0-6-0-0)",0,0,111,33,33,0,0,0,0,0],
		"006022":["☆5(0-0-6-0)",0,0,33,33,111,0,0,0,0,0],
		"000129":["☆5(0-0-0-1)",0,87,26,26,26,0,0,0,0,0],
		"221025":["☆5(2-2-1-0)",0,0,60,60,60,0,0,0,0,0],
		"112025":["☆5(1-1-2-0)",0,0,70,70,70,0,0,0,0,0],
		"1000020":["☆6(10-0-0-0)",0,0,0,0,0,0,0,50,180,50],
		"0100020":["☆6(0-10-0-0)",0,0,0,0,0,0,0,180,50,50],
		"0010020":["☆6(0-0-10-0)",0,0,0,0,0,0,0,50,50,180],
		"222024":["☆6(2-2-2-0)",0,0,0,0,0,0,0,85,85,85],
		"244025":["☆7(2-4-4-0)",0,0,0,0,0,0,0,220,110,110],
		"000133":["☆7(0-0-0-1)",0,0,0,0,0,0,42.5,132.5,132.5,132.5],
		"0001216":["☆7(0-0-0-12)",0,0,0,0,0,0,224,72,72,72],
		"1400022":["☆8(14-0-0-0)",0,0,0,0,0,0,0,175,400,175],
		"0140022":["☆8(0-14-0-0)",0,0,0,0,0,0,0,400,175,175],
		"0014022":["☆8(0-0-14-0)",0,0,0,0,0,0,0,175,175,400],
		"412028":["☆8(4-1-2-0)",0,0,0,0,0,0,0,200,350,100],
		"241027":["☆8(2-4-1-0)",0,0,0,0,0,0,0,350,200,100],
		"124027":["☆8(1-2-4-0)",0,0,0,0,0,0,0,100,200,350],
		"10008":["☆9(1-0-0-0)",0,0,0,0,0,0,0,400,600,400],
		"01008":["☆9(0-1-0-0)",0,0,0,0,0,0,0,600,400,400],
		"00108":["☆9(0-0-1-0)",0,0,0,0,0,0,0,400,400,600],
		"444429":["☆9(4-4-4-4)",0,0,0,0,0,0,150,400,400,400],
		"111240":["☆9(1-1-1-2)",0,0,0,0,0,0,300,300,300,300],
		"0001815":["☆9(0-0-0-18)",0,0,0,0,0,0,150,300,300,300],
		"000049":[NPC_HOLDER],
		"333337":[PLAYER_HOLDER]
	}}, {"type":"e-2t","data":{
		// e-2t-(2013-1117)
		"20009":["☆1(2-0-0-0)",6.5,0,0,0,0,0,0,0,0,0],
		"02009":["☆1(0-2-0-0)",6.5,0,0,0,0,0,0,0,0,0],
		"00209":["☆1(0-0-2-0)",6.5,0,0,0,0,0,0,0,0,0],
		"00029":["☆1(0-0-0-2)",6.5,0,0,0,0,0,0,0,0,0],
		"300014":["☆2(3-0-0-0)",0,0,1.5,15.5,1.5,0,0,0,0,0],
		"030014":["☆2(0-3-0-0)",0,0,15.5,1.5,1.5,0,0,0,0,0],
		"003014":["☆2(0-0-3-0)",0,0,1.5,1.5,15.5,0,0,0,0,0],
		"111121":["☆3(1-1-1-1)",0,12,16.5,16.5,16.5,0,0,0,0,0],
		"000126":["☆3(0-0-0-1)",0,36,6.5,6.5,6.5,0,0,0,0,0],
		"111016":["☆3(1-1-1-0)",0,0,19,19,19,0,0,0,0,0],
		"111127":["☆4(1-1-1-1)",0,55.5,25,25,25,0,0,0,0,0],
		"000813":["☆4(0-0-0-8)",0,70.5,18,18,18,0,0,0,0,0],
		"222218":["☆4(2-2-2-2)",0,30,31.5,31.5,31.5,0,0,0,0,0],
		"222019":["☆4(2-2-2-0)",0,0,40.5,40.5,40.5,0,0,0,0,0],
		"600020":["☆5(6-0-0-0)",0,0,41.5,139,41.5,0,0,0,0,0],
		"060020":["☆5(0-6-0-0)",0,0,139,41.5,41.5,0,0,0,0,0],
		"006020":["☆5(0-0-6-0)",0,0,41.5,41.5,139,0,0,0,0,0],
		"111120":["☆5(1-1-1-1)",0,57,56.5,56.5,56.5,0,0,0,0,0],
		"000129":["☆5(0-0-0-1)",0,129,32.5,32.5,32.5,0,0,0,0,0],
		"1000014":["☆6(10-0-0-0)",0,0,0,0,0,0,0,62.5,225,62.5],
		"0100014":["☆6(0-10-0-0)",0,0,0,0,0,0,0,225,62.5,62.5],
		"0010014":["☆6(0-0-10-0)",0,0,0,0,0,0,0,62.5,62.5,225],
		"000028":["☆6(0-0-0-0)",0,0,0,0,0,0,0,106.5,106.5,106.5],
		"442023":["☆7(4-4-2-0)",0,0,0,0,0,0,0,220,220,110],
		"424023":["☆7(4-2-4-0)",0,0,0,0,0,0,0,110,220,220],
		"244023":["☆7(2-4-4-0)",0,0,0,0,0,0,0,220,110,220],
		"0001216":["☆7(0-0-0-12)",0,0,0,0,0,0,279,90,90,90],
		"000029":["☆7(0-0-0-0)",0,0,0,0,0,0,0,183.5,183.5,183.5],
		"445222":["☆8(4-4-5-2)",0,0,0,0,0,0,90,205,205,316],
		"544222":["☆8(5-4-4-2)",0,0,0,0,0,0,90,205,316,205],
		"454222":["☆8(4-5-4-2)",0,0,0,0,0,0,90,316,205,205],
		"0001531":["☆8(0-0-0-15)",0,0,0,0,0,0,450,175,175,175],
		"000037":["☆8(0-0-0-0)",0,0,0,0,0,0,262.5,262.5,262.5,262.5],
		"111240":["☆9(1-1-1-2)",0,0,0,0,0,0,547.5,400,400,400],
		"808025":["☆9(8-0-8-0)",0,0,0,0,0,0,0,0,875,875],
		"880025":["☆9(8-8-0-0)",0,0,0,0,0,0,0,875,875,0],
		"088025":["☆9(0-8-8-0)",0,0,0,0,0,0,0,875,0,875],
		"333317":["☆9(3-3-3-3)",0,0,0,0,0,0,180,565,565,565],
		"000049":[NPC_HOLDER],
		"333337":[PLAYER_HOLDER]
	}}, {"type":"f-1t","data":{
		//【f-1t 1128-1135】
		"20009":["☆1(2-0-0-0)",6.5,0,0,0,0,0,0,0,0,0],
		"02009":["☆1(0-2-0-0)",6.5,0,0,0,0,0,0,0,0,0],
		"00209":["☆1(0-0-2-0)",6.5,0,0,0,0,0,0,0,0,0],
		"00029":["☆1(0-0-0-2)",6.5,0,0,0,0,0,0,0,0,0],
		"300014":["☆2(3-0-0-0)",0,0,1.5,15.5,1.5,0,0,0,0,0],
		"030014":["☆2(0-3-0-0)",0,0,15.5,1.5,1.5,0,0,0,0,0],
		"003014":["☆2(0-0-3-0)",0,0,1.5,1.5,15.5,0,0,0,0,0],
		"111121":["☆3(1-1-1-1)",0,12,16.5,16.5,16.5,0,0,0,0,0],
		"000126":["☆3(0-0-0-1)",0,36,6.5,6.5,6.5,0,0,0,0,0],
		"111016":["☆3(1-1-1-0)",0,0,19,19,19,0,0,0,0,0],
		"111127":["☆4(1-1-1-1)",0,55.5,25,25,25,0,0,0,0,0],
		"000813":["☆4(0-0-0-8)",0,70.5,18,18,18,0,0,0,0,0],
		"222218":["☆4(2-2-2-2)",0,30,31.5,31.5,31.5,0,0,0,0,0],
		"222019":["☆4(2-2-2-0)",0,0,40.5,40.5,40.5,0,0,0,0,0],
		"111120":["☆5(1-1-1-1)",0,57,56.5,56.5,56.5,0,0,0,0,0],
		"000129":["☆5(0-0-0-1)",0,129,32.5,32.5,32.5,0,0,0,0,0],
		"600020":["☆5(6-0-0-0)",0,0,41.5,139,41.5,0,0,0,0,0],
		"060020":["☆5(0-6-0-0)",0,0,139,41.5,41.5,0,0,0,0,0],
		"006020":["☆5(0-0-6-0)",0,0,41.5,41.5,139,0,0,0,0,0],
		"1000014":["☆6(10-0-0-0)",0,0,0,0,0,0,0,62.5,225,62.5],
		"0100014":["☆6(0-10-0-0)",0,0,0,0,0,0,0,225,62.5,62.5],
		"0010014":["☆6(0-0-10-0)",0,0,0,0,0,0,0,62.5,62.5,225],
		"000028":["☆6(0-0-0-0)",0,0,0,0,0,0,0,106.5,106.5,106.5],
		"442023":["☆7(4-4-2-0)",0,0,0,0,0,0,0,220,220,110],
		"424023":["☆7(4-2-4-0)",0,0,0,0,0,0,0,110,220,220],
		"244023":["☆7(2-4-4-0)",0,0,0,0,0,0,0,220,110,220],
		"000029":["☆7(0-0-0-0)",0,0,0,0,0,0,0,183.5,183.5,183.5],
		"0001216":["☆7(0-0-0-12)",0,0,0,0,0,0,279,90,90,90],
		"445222":["☆8(4-4-5-2)",0,0,0,0,0,0,90,205,205,316],
		"544222":["☆8(5-4-4-2)",0,0,0,0,0,0,90,205,316,205],
		"454222":["☆8(4-5-4-2)",0,0,0,0,0,0,90,316,205,205],
		"0001531":["☆8(0-0-0-15)",0,0,0,0,0,0,450,175,175,175],
		"000037":["☆8(0-0-0-0)",0,0,0,0,0,0,262.5,262.5,262.5,262.5],
		"700438":["☆9(7-0-0-4)",0,0,0,0,0,0,600,125,900,125],
		"070438":["☆9(0-7-0-4)",0,0,0,0,0,0,600,900,125,125],
		"007438":["☆9(0-0-7-4)",0,0,0,0,0,0,600,125,125,900],
		"000041":["☆9(0-0-0-0)",0,0,0,0,0,0,195,600,600,600],
		"333317":["☆9(3-3-3-3)",0,0,0,0,0,0,468,469,469,469],
		"000049":[NPC_HOLDER],
		"333337":[PLAYER_HOLDER]
	}}, {"type":"g-1t","data":{
		//【g-1t】
		"20009":["☆1(2-0-0-0)",8.5,0,0,0,0,0,0,0,0,0],
		"02009":["☆1(0-2-0-0)",8.5,0,0,0,0,0,0,0,0,0],
		"00209":["☆1(0-0-2-0)",8.5,0,0,0,0,0,0,0,0,0],
		"00029":["☆1(0-0-0-2)",8.5,0,0,0,0,0,0,0,0,0],
		"300014":["☆2(3-0-0-0)",0,0,2,20,2,0,0,0,0,0],
		"030014":["☆2(0-3-0-0)",0,0,20,2,2,0,0,0,0,0],
		"003014":["☆2(0-0-3-0)",0,0,2,2,20,0,0,0,0,0],
		"111121":["☆3(1-1-1-1)",0,15.5,21.5,21.5,21.5,0,0,0,0,0],
		"000126":["☆3(0-0-0-1)",0,47,8.5,8.5,8.5,0,0,0,0,0],
		"111016":["☆3(1-1-1-0)",0,0,24.5,24.5,24.5,0,0,0,0,0],
		"111127":["☆4(1-1-1-1)",0,72,32.5,32.5,32.5,0,0,0,0,0],
		"000813":["☆4(0-0-0-8)",0,91.5,23.5,23.5,23.5,0,0,0,0,0],
		"222218":["☆4(2-2-2-2)",0,39,41,41,41,0,0,0,0,0],
		"222019":["☆4(2-2-2-0)",0,0,52.5,52.5,52.5,0,0,0,0,0],
		"111120":["☆5(1-1-1-1)",0,74,73.5,73.5,73.5,0,0,0,0,0],
		"000129":["☆5(0-0-0-1)",0,167.5,42.5,42.5,42.5,0,0,0,0,0],
		"600020":["☆5(6-0-0-0)",0,0,54,180.5,54,0,0,0,0,0],
		"060020":["☆5(0-6-0-0)",0,0,180.5,54,54,0,0,0,0,0],
		"006020":["☆5(0-0-6-0)",0,0,54,54,180.5,0,0,0,0,0],
		"1000014":["☆6(10-0-0-0)",0,0,0,0,0,0,0,81.5,292.5,81.5],
		"0100014":["☆6(0-10-0-0)",0,0,0,0,0,0,0,292.5,81.5,81.5],
		"0010014":["☆6(0-0-10-0)",0,0,0,0,0,0,0,81.5,81.5,292.5],
		"000028":["☆6(0-0-0-0)",0,0,0,0,0,0,0,138.5,138.5,138.5],
		"442023":["☆7(4-4-2-0)",0,0,0,0,0,0,0,286,286,143],
		"424023":["☆7(4-2-4-0)",0,0,0,0,0,0,0,143,286,286],
		"244023":["☆7(2-4-4-0)",0,0,0,0,0,0,0,286,143,286],
		"000029":["☆7(0-0-0-0)",0,0,0,0,0,0,0,238.5,238.5,238.5],
		"0001216":["☆7(0-0-0-12)",0,0,0,0,0,0,362.5,117,117,117],
		"544222":["☆8(5-4-4-2)",0,0,0,0,0,0,117,266.5,411,266.5],
		"454222":["☆8(4-5-4-2)",0,0,0,0,0,0,117,411,266.5,266.5],
		"445222":["☆8(4-4-5-2)",0,0,0,0,0,0,117,266.5,266.5,411],
		"0001531":["☆8(0-0-0-15)",0,0,0,0,0,0,585,227.5,227.5,227.5],
		"000037":["☆8(0-0-0-0)",0,0,0,0,0,0,341.5,341.5,341.5,341.5],
		"700438":["☆9(7-0-0-4)",0,0,0,0,0,0,780,162.5,1170,162.5],
		"070438":["☆9(0-7-0-4)",0,0,0,0,0,0,780,1170,162.5,162.5],
		"007438":["☆9(0-0-7-4)",0,0,0,0,0,0,780,162.5,162.5,1170],
		"000041":["☆9(0-0-0-0)",0,0,0,0,0,0,253.5,780,780,780],
		"333317":["☆9(3-3-3-3)",0,0,0,0,0,0,608.5,609.5,609.5,609.5],
		"000049":[NPC_HOLDER],
		"333337":[PLAYER_HOLDER]
	}}, {"type":"h-1t","data":{
		//【h-1t 20150605-0300】
		"20009":["☆1(2-0-0-0)",11,0,0,0,0,0,0,0,0,0],
		"02009":["☆1(0-2-0-0)",11,0,0,0,0,0,0,0,0,0],
		"00209":["☆1(0-0-2-0)",11,0,0,0,0,0,0,0,0,0],
		"00029":["☆1(0-0-0-2)",11,0,0,0,0,0,0,0,0,0],
		"300014":["☆2(3-0-0-0)",0,0,2.5,26,2.5,0,0,0,0,0],
		"030014":["☆2(0-3-0-0)",0,0,26,2.5,2.5,0,0,0,0,0],
		"003014":["☆2(0-0-3-0)",0,0,2.5,2.5,26,0,0,0,0,0],
		"111121":["☆3(1-1-1-1)",0,20,28,28,28,0,0,0,0,0],
		"000126":["☆3(0-0-0-1)",0,61,11,11,11,0,0,0,0,0],
		"111016":["☆3(1-1-1-0)",0,0,32,32,32,0,0,0,0,0],
		"111127":["☆4(1-1-1-1)",0,94,42.5,42.5,42.5,0,0,0,0,0],
		"000813":["☆4(0-0-0-8)",0,119,30.5,30.5,30.5,0,0,0,0,0],
		"222218":["☆4(2-2-2-2)",0,50.5,53,53,53,0,0,0,0,0],
		"222019":["☆4(2-2-2-0)",0,0,68.5,68.5,68.5,0,0,0,0,0],
		"111120":["☆5(1-1-1-1)",0,96.5,95.5,95.5,95.5,0,0,0,0,0],
		"000129":["☆5(0-0-0-1)",0,218,55,55,55,0,0,0,0,0],
		"600020":["☆5(6-0-0-0)",0,0,70,235,70,0,0,0,0,0],
		"060020":["☆5(0-6-0-0)",0,0,235,70,70,0,0,0,0,0],
		"006020":["☆5(0-0-6-0)",0,0,70,70,235,0,0,0,0,0],
		"1000014":["☆6(10-0-0-0)",0,0,0,0,0,0,0,105.5,380.5,105.5],
		"0100014":["☆6(0-10-0-0)",0,0,0,0,0,0,0,380.5,105.5,105.5],
		"0010014":["☆6(0-0-10-0)",0,0,0,0,0,0,0,105.5,105.5,380.5],
		"000028":["☆6(0-0-0-0)",0,0,0,0,0,0,0,180,180,180],
		"442023":["☆7(4-4-2-0)",0,0,0,0,0,0,0,372,372,186],
		"424023":["☆7(4-2-4-0)",0,0,0,0,0,0,0,186,372,372],
		"244023":["☆7(2-4-4-0)",0,0,0,0,0,0,0,372,186,372],
		"000029":["☆7(0-0-0-0)誤差あったらごめんね！",0,0,0,0,0,0,0,310,310,310],//誤差あったらごめんね！
		"0001216":["☆7(0-0-0-12)",0,0,0,0,0,0,471.5,152,152,152],
		"544222":["☆8(5-4-4-2)",0,0,0,0,0,0,152,346.5,534,346.5],
		"454222":["☆8(4-5-4-2)",0,0,0,0,0,0,152,534,346.5,346.5],
		"445222":["☆8(4-4-5-2)",0,0,0,0,0,0,152,346.5,346.5,534],
		"0001531":["☆8(0-0-0-15)",0,0,0,0,0,0,760.5,296,296,296],
		"000037":["☆8(0-0-0-0)",0,0,0,0,0,0,443.5,443.5,443.5,443.5],
		"700438":["☆9(7-0-0-4)",0,0,0,0,0,0,1014,211.5,1521,211.5],
		"070438":["☆9(0-7-0-4)",0,0,0,0,0,0,1014,1521,211.5,211.5],
		"007438":["☆9(0-0-7-4)",0,0,0,0,0,0,1014,211.5,211.5,1521],
		"000041":["☆9(0-0-0-0)",0,0,0,0,0,0,329.5,1014,1014,1014],
		"333317":["☆9(3-3-3-3)",0,0,0,0,0,0,791,792.5,792.5,792.5],
		"000049":[NPC_HOLDER],
		"333337":[PLAYER_HOLDER]
	}}, {"type":"i-1t","data":{
		//【i-1t 2016-0218-2040】
		"20009":["☆1(2-0-0-0)",14.5,0,0,0,0,0,0,0,0,0],
		"02009":["☆1(0-2-0-0)",14.5,0,0,0,0,0,0,0,0,0],
		"00209":["☆1(0-0-2-0)",14.5,0,0,0,0,0,0,0,0,0],
		"00029":["☆1(0-0-0-2)",14.5,0,0,0,0,0,0,0,0,0],
		"300014":["☆2(3-0-0-0)",0,0,3.5,34,3.5,0,0,0,0,0],
		"030014":["☆2(0-3-0-0)",0,0,34,3.5,3.5,0,0,0,0,0],
		"003014":["☆2(0-0-3-0)",0,0,3.5,3.5,34,0,0,0,0,0],
		"111121":["☆3(1-1-1-1)",0,26.5,36.5,36.5,36.5,0,0,0,0,0],
		"000126":["☆3(0-0-0-1)",0,79,14.5,14.5,14.5,0,0,0,0,0],
		"111016":["☆3(1-1-1-0)",0,0,41.5,41.5,41.5,0,0,0,0,0],
		"111127":["☆4(1-1-1-1)",0,122,55,55,55,0,0,0,0,0],
		"000813":["☆4(0-0-0-8)",0,155,39.5,39.5,39.5,0,0,0,0,0],
		"222218":["☆4(2-2-2-2)",0,66,69,69,69,0,0,0,0,0],
		"222019":["☆4(2-2-2-0)",0,0,89,89,89,0,0,0,0,0],
		"111120":["☆5(1-1-1-1)",0,125,124,124,124,0,0,0,0,0],
		"600020":["☆5(6-0-0-0)",0,0,91,305.5,91,0,0,0,0,0],
		"060020":["☆5(0-6-0-0)",0,0,305.5,91,91,0,0,0,0,0],
		"006020":["☆5(0-0-6-0)",0,0,91,91,305.5,0,0,0,0,0],
		"000129":["☆5(0-0-0-1)",0,283.5,71.5,71.5,71.5,0,0,0,0,0],
		"1000014":["☆6(10-0-0-0)",0,0,0,0,0,0,0,137.5,494.5,137.5],
		"0100014":["☆6(0-10-0-0)",0,0,0,0,0,0,0,494.5,137.5,137.5],
		"0010014":["☆6(0-0-10-0)",0,0,0,0,0,0,0,137.5,137.5,494.5],
		"000031":["☆6(0-0-0-0)",0,0,0,0,0,0,0,234,234,234],
		"442025":["☆7(4-4-2-0)",0,0,0,0,0,0,0,483.5,483.5,241.5],
		"424025":["☆7(4-2-4-0)",0,0,0,0,0,0,0,241.5,483.5,483.5],
		"244025":["☆7(2-4-4-0)",0,0,0,0,0,0,0,483.5,241.5,483.5],
		"000033":["☆7(0-0-0-0)",0,0,0,0,0,0,0,403,403,403],
		"0001216":["☆7(0-0-0-12)",0,0,0,0,0,0,613,197.5,197.5,197.5],
		"544222":["☆8(5-4-4-2)",0,0,0,0,0,0,197.5,450.5,694.5,450.5],
		"454222":["☆8(4-5-4-2)",0,0,0,0,0,0,197.5,694.5,450.5,450.5],
		"445222":["☆8(4-4-5-2)",0,0,0,0,0,0,197.5,450.5,450.5,694.5],
		"0001531":["☆8(0-0-0-15)",0,0,0,0,0,0,988.5,384.5,384.5,384.5],
		"000037":["☆8(0-0-0-0)",0,0,0,0,0,0,576.5,576.5,576.5,576.5],
		"700438":["☆9(7-0-0-4)",0,0,0,0,0,0,1318,274.5,1977.5,274.5],
		"070438":["☆9(0-7-0-4)",0,0,0,0,0,0,1318,1977.5,274.5,274.5],
		"007438":["☆9(0-0-7-4)",0,0,0,0,0,0,1318,274.5,274.5,1977.5],
		"000043":["☆9(0-0-0-0)",0,0,0,0,0,0,494.5,1521,1521,1521],
		"333317":["☆9(3-3-3-3)",0,0,0,0,0,0,1028,1030.5,1030.5,1030.5],
		"444726":["☆9(4-4-4-7)",0,0,0,0,0,0,1400,1225,1225,1225],
		"000049":[NPC_HOLDER],
		"333337":[PLAYER_HOLDER]
	}}, {"type":"j-1t","data":{
		//【j-1t 20160603-1810】
		"20009":["☆1(2-0-0-0)",18.5,0,0,0,0,0,0,0,0,0],
		"02009":["☆1(0-2-0-0)",18.5,0,0,0,0,0,0,0,0,0],
		"00209":["☆1(0-0-2-0)",18.5,0,0,0,0,0,0,0,0,0],
		"00029":["☆1(0-0-0-2)",18.5,0,0,0,0,0,0,0,0,0],
		"300014":["☆2(3-0-0-0)",0,0,4.5,44.5,4.5,0,0,0,0,0],
		"030014":["☆2(0-3-0-0)",0,0,44.5,4.5,4.5,0,0,0,0,0],
		"003014":["☆2(0-0-3-0)",0,0,4.5,4.5,44.5,0,0,0,0,0],
		"111121":["☆3(1-1-1-1)",0,34.5,47,47,47,0,0,0,0,0],
		"000126":["☆3(0-0-0-1)",0,103,18.5,18.5,18.5,0,0,0,0,0],
		"111016":["☆3(1-1-1-0)",0,0,54.5,54.5,54.5,0,0,0,0,0],
		"111127":["☆4(1-1-1-1)",0,158.5,71.5,71.5,71.5,0,0,0,0,0],
		"000813":["☆4(0-0-0-8)",0,201.5,51.5,51.5,51.5,0,0,0,0,0],
		"222218":["☆4(2-2-2-2)",0,85.5,90,90,90,0,0,0,0,0],
		"222019":["☆4(2-2-2-0)",0,0,115.5,115.5,115.5,0,0,0,0,0],
		"111120":["☆5(1-1-1-1)",0,163,161.5,161.5,161.5,0,0,0,0,0],
		"600020":["☆5(6-0-0-0)",0,0,118.5,397,118.5,0,0,0,0,0],
		"060020":["☆5(0-6-0-0)",0,0,397,118.5,118.5,0,0,0,0,0],
		"006020":["☆5(0-0-6-0)",0,0,118.5,118.5,397,0,0,0,0,0],
		"000129":["☆5(0-0-0-1)",0,368.5,93,93,93,0,0,0,0,0],
		"1000014":["☆6(10-0-0-0)",0,0,0,0,0,0,0,178.5,642.5,178.5],
		"0100014":["☆6(0-10-0-0)",0,0,0,0,0,0,0,642.5,178.5,178.5],
		"0010014":["☆6(0-0-10-0)",0,0,0,0,0,0,0,178.5,178.5,642.5],
		"000031":["☆6(0-0-0-0)",0,0,0,0,0,0,0,304,304,304],
		"442025":["☆7(4-4-2-0)",0,0,0,0,0,0,0,628.5,628.5,314],
		"424025":["☆7(4-2-4-0)",0,0,0,0,0,0,0,314,628.5,628.5],
		"244025":["☆7(2-4-4-0)",0,0,0,0,0,0,0,628.5,314,628.5],
		"000033":["☆7(0-0-0-0)",0,0,0,0,0,0,0,524,524,524],
		"0001216":["☆7(0-0-0-12)",0,0,0,0,0,0,797,257,257,257],
		"544222":["☆8(5-4-4-2)",0,0,0,0,0,0,257,585.5,902.5,585.5],
		"454222":["☆8(4-5-4-2)",0,0,0,0,0,0,257,902.5,585.5,585.5],
		"445222":["☆8(4-4-5-2)",0,0,0,0,0,0,257,585.5,585.5,902.5],
		"0001531":["☆8(0-0-0-15)",0,0,0,0,0,0,1285,500,500,500],
		"000037":["☆8(0-0-0-0)",0,0,0,0,0,0,749.5,749.5,749.5,749.5],
		"700438":["☆9(7-0-0-4)",0,0,0,0,0,0,1713.5,357,2570.5,357],
		"070438":["☆9(0-7-0-4)",0,0,0,0,0,0,1713.5,2570.5,357,357],
		"007438":["☆9(0-0-7-4)",0,0,0,0,0,0,1713.5,357,357,2570.5],
		"000043":["☆9(0-0-0-0)",0,0,0,0,0,0,642.5,1977.5,1977.5,1977.5],
		"333317":["☆9(3-3-3-3)",0,0,0,0,0,0,1336.5,1339.5,1339.5,1339.5],
		"444726":["☆9(4-4-4-7)",0,0,0,0,0,0,1820,1592.5,1592.5,1592.5],
		"000049":[NPC_HOLDER],
		"333337":[PLAYER_HOLDER]
	}}, {"type":"不明","data":null}
];


//　兵科に対する各ユニットの防御値
var def = {
	//:[剣,盾,槍,弓,騎,大剣,重盾,矛,弩,近衛],
	"ken":[15,24,50,52,54,85,60,140,145,151],//剣兵防御
	"yari":[10,108,40,58,28,56,270,100,145,70],//槍兵防御
	"yumi":[10,104,25,42,60,56,260,63,105,150],//yumi兵防御
	"ki":[10,112,55,26,44,56,280,137,65,110]//騎兵防御
};

//　各ユニットの攻撃力
var atk = {
	"ken":15,
	"tate":5,
	"yari":40,
	"yumi":42,
	"ki":44,
	"dai":85,
	"jt":10,
	"hoko":100,
	"do":105,
	"kono":110
};



(function(){
	// サーバー種別を取得 : y17
	var server = location.hostname.substr(0,location.hostname.indexOf("."));

	// サーバー種別から期を取得
	var session = server_session[server]; // y17 -> 10

	// 期からマップリストを取得
	var maptype;
	for (var key in maptype_session) {
		var pos = maptype_session[key].indexOf(session);
		if (pos !== undefined && pos >= 0) {
			maptype = key;
			break;
		}
	}

	// タイル情報を選択
	var point;
	for (var i = 0; i < point_list.length; ++i) {
		var item = point_list[i];
		if (item.type == maptype) {
			point = item.data;
			break;
		}
	}
	com_rack = nazeka + "【Map " + maptype + "】" + nazeka;


	//　出兵拠点座標の取得
	var areas = document.evaluate('//li[@class="gnavi02"]//a/@href', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	basecord = areas.snapshotItem(0).value;
	basecord = basecord.replace(/^.*x=(-?[0-9]+).*y=(-?[0-9]+)/, "$1,$2");
	bcordx = RegExp.$1;
	bcordy = RegExp.$2;

	//　出兵先座標(x)の取得
	areas = document.evaluate('//input[@name="village_x_value"]/@value', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	tocordx = areas.snapshotItem(0).value;

	//　出兵先座標(y)の取得
	areas = document.evaluate('//input[@name="village_y_value"]/@value', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	tocordy = areas.snapshotItem(0).value;

	//　距離の計算
	length = Math.sqrt((bcordx-tocordx)*(bcordx-tocordx)+(bcordy-tocordy)*(bcordy-tocordy));

	//　出兵先タイルパターン取得のためのHTTP要求　starに★数、tile[]に各タイル数を格納。
	var url = "http://"+location.hostname+"/land.php?x="+tocordx+"&y="+tocordy;
	GM_xmlhttpRequest({
		method:"GET",
		url:url,
		onload:function(x){
			//　読み込み後の処理は関数 getFieldType() 内で行う。
			getFieldType(x.responseText, point);
		}
	});
})();

//　タイルパターンの取得 及び 兵力計算・表示用関数
function getFieldType(x, point){

	//　ページ内のタイル数をカウントするための変数 初期化
	var panel = {
		"平地":0,
		"森林":0,
		"岩山":0,
		"鉄鉱山":0,
		"穀物":0,
		"荒地":0
	};

	//　GM_xmlhttpRequestの取得データをxml形式に変換
	var responseXML = document.createElement('div');
		responseXML.innerHTML = x;

	//　ソース中のタイルの行からtitleの文字列を取得
	var panels = document.evaluate('.//*[@id="mapOverlayMap"]//area/@title', responseXML, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

	//　1行ずつ対応するタイルの変数を加算していく
	for (var i = 0; i < panels.snapshotLength; i++) {
		panel[panels.snapshotItem(i).value]++;
	}

	//　タイル数→キー（"111116"など）の作成
	var key = String(panel["森林"])+String(panel["岩山"])+String(panel["鉄鉱山"])+String(panel["穀物"])+String(panel["平地"]);

	//　兵力パラメータの取得
	var list = point[key];

	var i;
	var tmp = 0;
	var sum = 0;
	var kenk = 0;
	var yarik = 0;
	var yumik = 0;
	var kik = 0;

	var tmp2 = 0;
	var sum2 = 0;
	var kenk2 = 0;
	var yarik2 = 0;
	var yumik2 = 0;
	var kik2 = 0;


	//表示距離
	var mal_length = Math.floor(length*100+0.5)/100;

	//表示URL
	var mal_url = "http://"+location.hostname+"/land.php?x="+tocordx+"&y="+tocordy;
	var map_url = "http://"+location.hostname+"/map.php?x="+tocordx+"&y="+tocordy;

	//表示部分Non
	var msg = "";

	if(list===undefined || list.length === 0){
		//　キーに対応するデータが見つからない場合。ex.NPC拠点、データがないもの
		msg = msg + "<table class='commonTables'><tr><td align=left>出兵元から、" + mal_length + "の距離にある 目的地<a href=" + mal_url + ">(" + tocordx +"," + tocordy + ")</a>　<a href=" + map_url + ">MAP</a>について、有効なデータはありません。<br>※未知のMAPであるか、ツールがこのMAPに対応していない可能性が有ります。</td></tr>\n";
		msg = msg + "<tr><td align=left>" + se_rack + "<br>\n";
		msg = msg + "</td></tr></table>\n";

	}else{
		//MAX計算用
		for(i=0;i<list.length;i++){
			//距離最大時乗数
			var hentai = (1+length/10)*3;
			//最大出現数計算
			var kenmax = Math.floor(list[1]*hentai);
			var tatemax = Math.floor(list[2]*hentai);
			var yarimax = Math.floor(list[3]*hentai);
			var yumimax = Math.floor(list[4]*hentai);
			var kimax = Math.floor(list[5]*hentai);
			var daimax = Math.floor(list[6]*hentai);
			var jtmax = Math.floor(list[7]*hentai);
			var hokomax = Math.floor(list[8]*hentai);
			var domax = Math.floor(list[9]*hentai);
			var konomax = Math.floor(list[10]*hentai);
			//最大防御力集計
			var sum = kenmax+(tatemax+yarimax+yumimax+kimax)*2+daimax*3+(jtmax+hokomax+domax+konomax)*4;
			var kenk = kenmax*def.ken[0]+tatemax*def.ken[1]+yarimax*def.ken[2]+yumimax*def.ken[3]+kimax*def.ken[4]+daimax*def.ken[5]+jtmax*def.ken[6]+hokomax*def.ken[7]+domax*def.ken[8]+konomax*def.ken[9];
			var yarik = kenmax*def.yari[0]+tatemax*def.yari[1]+yarimax*def.yari[2]+yumimax*def.yari[3]+kimax*def.yari[4]+daimax*def.yari[5]+jtmax*def.yari[6]+hokomax*def.yari[7]+domax*def.yari[8]+konomax*def.yari[9];
			var yumik = kenmax*def.yumi[0]+tatemax*def.yumi[1]+yarimax*def.yumi[2]+yumimax*def.yumi[3]+kimax*def.yumi[4]+daimax*def.yumi[5]+jtmax*def.yumi[6]+hokomax*def.yumi[7]+domax*def.yumi[8]+konomax*def.yumi[9];
			var kik = kenmax*def.ki[0]+tatemax*def.ki[1]+yarimax*def.ki[2]+yumimax*def.ki[3]+kimax*def.ki[4]+daimax*def.ki[5]+jtmax*def.ki[6]+hokomax*def.ki[7]+domax*def.ki[8]+konomax*def.ki[9];

			//距離最小時乗数
			var hentai2 = (1+length/10);
			//最小出現数計算
			var kenmin = Math.floor(list[1]*hentai2);
			var tatemin = Math.floor(list[2]*hentai2);
			var yarimin = Math.floor(list[3]*hentai2);
			var yumimin = Math.floor(list[4]*hentai2);
			var kimin = Math.floor(list[5]*hentai2);
			var daimin = Math.floor(list[6]*hentai2);
			var jtmin = Math.floor(list[7]*hentai2);
			var hokomin = Math.floor(list[8]*hentai2);
			var domin = Math.floor(list[9]*hentai2);
			var konomin = Math.floor(list[10]*hentai2);
			//最小防御力集計
			var sum2 = kenmin+(tatemin+yarimin+yumimin+kimin)*2+daimin*3+(jtmin+hokomin+domin+konomin)*4;
			var kenk2 = kenmin*def.ken[0]+tatemin*def.ken[1]+yarimin*def.ken[2]+yumimin*def.ken[3]+kimin*def.ken[4]+daimin*def.ken[5]+jtmin*def.ken[6]+hokomin*def.ken[7]+domin*def.ken[8]+konomin*def.ken[9];
			var yarik2 = kenmin*def.yari[0]+tatemin*def.yari[1]+yarimin*def.yari[2]+yumimin*def.yari[3]+kimin*def.yari[4]+daimin*def.yari[5]+jtmin*def.yari[6]+hokomin*def.yari[7]+domin*def.yari[8]+konomin*def.yari[9];
			var yumik2 = kenmin*def.yumi[0]+tatemin*def.yumi[1]+yarimin*def.yumi[2]+yumimin*def.yumi[3]+kimin*def.yumi[4]+daimin*def.yumi[5]+jtmin*def.yumi[6]+hokomin*def.yumi[7]+domin*def.yumi[8]+konomin*def.yumi[9];
			var kik2 = kenmin*def.ki[0]+tatemin*def.ki[1]+yarimin*def.ki[2]+yumimin*def.ki[3]+kimin*def.ki[4]+daimin*def.ki[5]+jtmin*def.ki[6]+hokomin*def.ki[7]+domin*def.ki[8]+konomin*def.ki[9];

			//指定乱数用-乗数
			var kanaeri = (1+length/10)*9;
			//指定乱数用-出現数計算
			var ken_sifon = Math.floor(list[1]*kanaeri);
			var tate_sifon = Math.floor(list[2]*kanaeri);
			var yari_sifon = Math.floor(list[3]*kanaeri);
			var yumi_sifon = Math.floor(list[4]*kanaeri);
			var ki_sifon = Math.floor(list[5]*kanaeri);
			var dai_sifon = Math.floor(list[6]*kanaeri);
			var jt_sifon = Math.floor(list[7]*kanaeri);
			var hoko_sifon = Math.floor(list[8]*kanaeri);
			var do_sifon = Math.floor(list[9]*kanaeri);
			var kono_sifon = Math.floor(list[10]*kanaeri);
			//指定乱数用-防御力集計
			var sumM = ken_sifon+(tate_sifon+yari_sifon+yumi_sifon+ki_sifon)*2+dai_sifon*3+(jt_sifon+hoko_sifon+do_sifon+kono_sifon)*4;
			var kenkM = ken_sifon*def.ken[0]+tate_sifon*def.ken[1]+yari_sifon*def.ken[2]+yumi_sifon*def.ken[3]+ki_sifon*def.ken[4]+dai_sifon*def.ken[5]+jt_sifon*def.ken[6]+hoko_sifon*def.ken[7]+do_sifon*def.ken[8]+kono_sifon*def.ken[9];
			var yarikM = ken_sifon*def.yari[0]+tate_sifon*def.yari[1]+yari_sifon*def.yari[2]+yumi_sifon*def.yari[3]+ki_sifon*def.yari[4]+dai_sifon*def.yari[5]+jt_sifon*def.yari[6]+hoko_sifon*def.yari[7]+do_sifon*def.yari[8]+kono_sifon*def.yari[9];
			var yumikM = ken_sifon*def.yumi[0]+tate_sifon*def.yumi[1]+yari_sifon*def.yumi[2]+yumi_sifon*def.yumi[3]+ki_sifon*def.yumi[4]+dai_sifon*def.yumi[5]+jt_sifon*def.yumi[6]+hoko_sifon*def.yumi[7]+do_sifon*def.yumi[8]+kono_sifon*def.yumi[9];
			var kikM = ken_sifon*def.ki[0]+tate_sifon*def.ki[1]+yari_sifon*def.ki[2]+yumi_sifon*def.ki[3]+ki_sifon*def.ki[4]+dai_sifon*def.ki[5]+jt_sifon*def.ki[6]+hoko_sifon*def.ki[7]+do_sifon*def.ki[8]+kono_sifon*def.ki[9];
		}

		//表示部分
		msg = msg + "<table style='margin: 15px 0; border:none; width:100%; background:#333'><tbody>\n\n";

		var header_content = com_rack + "<br>\n"
			+ "地形：" + String(list[0]) +"<br>\n"
			+ "距離：" + mal_length + "<br>\n"
			+ textlink("(" + tocordx +"," + tocordy + ")", mal_url) + "&nbsp;"
			+ "[" + textlink("MAP", map_url) + "]<br>\n";
		msg = msg + spacing();
		msg = msg + tableblock(header_content);

		msg = msg + spacing();
		msg = msg + compile('【対剣兵科】',  kenk,	kenk2,	kenkM);
		msg = msg + compile('【対槍兵科】', yarik, yarik2, yarikM);
		msg = msg + compile('【対弓兵科】', yumik, yumik2, yumikM);
		msg = msg + compile('【対騎兵科】',   kik,	 kik2,	 kikM);

		msg = msg + spacing();
		msg = msg + compile('【期待撃破スコア】', sum, sum2, 0);

		msg = msg + spacing();
		msg = msg + tableblock(se_rack);

		msg = msg + "</tbody></table>\n";
	}

	var insertHtml = "<tr><td>" + msg + "</td></tr>";

	var insertElem = document.createElement('div');
		insertElem.innerHTML = insertHtml;
		insertElem = insertElem.firstChild;

	var containerElem = document.evaluate('//*[@class=\"sideBoxInner basename\"]', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
		containerElem.snapshotItem(0).appendChild(insertElem);
}
function tableblock(content){
	return "<tr><td colspan='3' style='text-align:left'>\n" + content + "</td></tr>\n\n";
}
function spacing() {
	return "<tr><td colspan='3'>&nbsp;</td></tr>\n";
}
function textlink(title, url){
	return ""
		+ "<span"
		+ " style='color:white; text-decoration:underline;'"
		+ " onclick=\"location.href='" + url + "'\""
		+ " onmouseover=\"this.style.cursor='pointer'\""
		+ " onmouseout=\"this.style.cursor='default'\""
		+ ">" + title + "</span>";
}
function compile(title, max, min, att) {
	var content = "";
	if (att !== 0 && att === att)	content = content + "<tr><td style='text-align:center'>レベ</td><td style='text-align:right; font-weight:bold; color:SpringGreen'>" + att.toLocaleString() + "</td><td>　</td></tr>\n";
	if (max !== 0 && max === max)	content = content + "<tr><td style='text-align:center'>MAX</td><td style='text-align:right; font-weight:bold; color:OrangeRed'>" + max.toLocaleString() + "</td><td>　</td></tr>\n";
	if (min !== 0 && min === min)	content = content + "<tr><td style='text-align:center'>MIN</td><td style='text-align:right; font-weight:bold; color:LightSkyBlue'>" + min.toLocaleString() + "</td><td>　</td></tr>\n";
	if (content.length === 0) return "";
	return "<tr><td colspan='3'>" + title + "</td></tr>\n" + content + "\n";
}
