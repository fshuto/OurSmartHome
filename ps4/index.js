const Mqtt       = require('./mqtt.js');
const { Device } = require('ps4-waker');

// ソフトに対応するID
const TORUNE = "CUSA00442";
const KH3    = "CUSA11060";

// 実行時引数で指定する
let port     = process.argv[2];
let userName = process.argv[3] || '';
let passWord = process.argv[4] || '';

// PS4で指定タイトルの起動
function TurnOnTitle(titleCode) {
	let ps4 = new Device();
	return ps4.turnOn().then(() => {
		return ps4.startTitle(titleCode);
	}).then(() => {
		return ps4.close();
	});
}

// PS4の電源を消す
function TurnOffPS4() {
	let ps4 = new Device();
	return ps4.turnOff().then(() => {
		return ps4.close();
	});
}

// PS4で処理を実行する
function ExecPS4(topic, message) {
	let msgObj = JSON.parse(message);

	switch (topic) {
		case 'OurSmartHome/PS4':
			console.log(msgObj.data[0]);
			let data = msgObj.data[0];

			if (data === undefined) return;
			switch (data.app) {
				case 'トルネ':
					TurnOnTitle(TORUNE);
					break;
				case 'キングダムハーツ':
					TurnOnTitle(KH3);
					break;
				default:
					break;
			}

			switch (data.action) {
				case 'off':
					TurnOffPS4();
					break;
				default:
					break;
			}
			break;

		default:
			break;
	}
}

let mqtt = new Mqtt('OurSmartHome/PS4', ExecPS4, port, userName, passWord);
