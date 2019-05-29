// Copyright (c) 2013-2014 Beebotte <contact@beebotte.com>
// This program is published under the MIT License (http://opensource.org/licenses/MIT).
//  
/////////////////////////////////////////////////////////////
// This code uses the Beebotte API, you must have an account.
// You can register here: http://beebotte.com/register
/////////////////////////////////////////////////////////////

let mqtt = require('mqtt')

class Mqtt {

	constructor(channel, execMessages, portNumber, userName, passWord) {
		let client = mqtt.connect('mqtts://mqtt.beebotte.com',
			//Authenticate with your channel token, 
			{ 
				port    : portNumber,
				username: userName,
				password: passWord
			} 
		);

		client.on('message', function (topic, message) {
			console.log(topic + '   ' + message);
			execMessages(topic, message);
		});

		client.subscribe(channel/*'OurSmartHome/PS4'*/);

/*
		setInterval(function () {
 			client.publish('OurSmartHome/PS4', 'Hello World');
		}, 10000); // 10seconds
*/
	}
}

module.exports = Mqtt;
