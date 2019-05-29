const Mqtt       = require('./mqtt.js');
const { Device } = require('ps4-waker');

// 実行時引数で指定する
let port     = process.argv[2];
let userName = process.argv[3];
let passWord = process.argv[4];

// PS4でトルネの起動
function TurnOnPS4Torune() {
	let ps4 = new Device();
	ps4.turnOn().then(() => {
		ps4.startTitle("CUSA00442").then(() => {
			ps4.close();
		});
	});
}

// PS4でキングダムハーツ3の起動
function TurnOnPS4KH3() {
	TurnOnTitle("CUSA11060");
}

// PS4で指定タイトルの起動
function TurnOnTitle(titleCode) {
	let ps4 = new Device();
	ps4.turnOn().then(() => {
		ps4.startTitle(titleCode).then(() => {
			ps4.close();
		});
	});
}

// PS4の電源を消す
function TurnOffPS4() {
	let ps4 = new Device();
	ps4.turnOff().then(() => {
		ps4.close();
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
					TurnOnPS4Torune();
					break;
				case 'キングダムハーツ':
					TurnOnPS4KH3();
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
