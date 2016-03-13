var robot = require('robotjs');
var serialport = require('serialport');
var port = new serialport.SerialPort("COM3", {
	baudrate: 9600,
	parser: serialport.parsers.readline("\n")
});

var onopen = function(error) {
	if(error) {
		console.log(error);
		console.log("Yolo");
		process.exit();
	}

	port.on('data', function(d) {
		data = d.toString().split(",");
		var left = data[0];
		var up = data[1];
		var right = data[2];
		var down = data[3];

		if(left == "1") {
			robot.keyToggle('left', 'down');
			setTimeout(function() {
				robot.keyToggle('left', 'up');
			}, 20);
		}
		if(up == "1") {
			robot.keyToggle('up', 'down');
			setTimeout(function() {
				robot.keyToggle('up', 'up');
			}, 20);
		}
		if(right == "1") {
			robot.keyToggle("right", 'down');
			setTimeout(function() {
				robot.keyToggle('right', 'up');
			}, 20);
		}
		if(down == "1") {
			robot.keyToggle("down", 'down');
			setTimeout(function() {
				robot.keyToggle('down', 'up');
			}, 20);
		}
	});
};

try {
	port.on('error', function() {
		console.log("Lol");
	})
	port.open(onopen);
}
catch(e) {
	conosle.log(e);
}