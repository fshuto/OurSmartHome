'use strict'

const Mqtt       = require('./mqtt.js');
const config     = require('./config.js');
const { Device } = require('ps4-waker');
const request    = require('request-promise');

// ソフトに対応するID
// https://store.playstation.com/ja-jp/home/games
// ↑でアプリを検索し、URLに含まれるIDを調べる
const TORNE      = 'CUSA00442';
const KH3        = 'CUSA11060';
const RAKUTEN_TV = 'CUSA11244';
const YOUTUBE    = 'CUSA01065';

// iftttのイベント名
const POWER_TV   = 'power_tv';

// 実行時引数で指定、もしくはconfigファイルから設定を読み込む
let port     = process.argv[2] || config.port;
let userName = process.argv[3] || config.beebotte.userName || '';
let passWord = process.argv[4] || config.beebotte.passWord || '';

// PS4で指定タイトルの起動
async function TurnOnTitle(titleCode) {
	try {
		let ps4 = new Device();
		await ps4.turnOn();
		await ps4.startTitle(titleCode);
		await ps4.close();
	} catch(err) {
		console.error(err);
	}
}

// PS4の電源を消す
async function TurnOffPS4() {
	try {
		let ps4 = new Device();
		await ps4.turnOff();
		await ps4.close();
	} catch(err) {
		console.error(err);
	}
}

// PS4で処理を実行する
async function ExecPS4(topic, message) {
	let msgObj = JSON.parse(message);

	switch (topic) {
		case 'OurSmartHome/PS4':
			console.log(msgObj.data[0]);
			let data = msgObj.data[0];

			if (data === undefined) return;
			switch (data.app) {
				case 'トルネ':
				case 'torne':
					await TurnOnTitle(TORNE);
					break;

				case 'キングダムハーツ':
				case 'キングダム ハーツ':
					await TurnOnTitle(KH3);
					break;

				case '楽天TV':
				case '楽天 TV':
				case '楽天':
				case 'らくてん':
					await TurnOnTitle(RAKUTEN_TV);
					break;
	
				case 'youtube':
				case 'YouTube':
					await TurnOnTitle(YOUTUBE);
					break;

				default:
					break;
			}

			switch (data.action) {
				case 'off':
					// PS4の電源を落とした後にTVの電源も落とす
					await TurnOffPS4();
					await sendEventIfttt(POWER_TV);
					break;

				default:
					break;
			}
			break;

		default:
			break;
	}
}

// iftttにイベントを送信する
async function sendEventIfttt(event) {
	const options = {
		url: `https://maker.ifttt.com/trigger/${event}/with/key/${config.ifttt.key}`,
		method: 'GET'
	}
	return request(options).catch((err) => { console.error(err); });
}

let mqtt = new Mqtt('OurSmartHome/PS4', ExecPS4, port, userName, passWord);
