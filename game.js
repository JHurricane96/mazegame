var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
var gameLoop = {};
var player = new Player();
var maze = new Maze();
var prevTime;

function controlPlayerKeyDown(event) {
	//event.preventDefault();
	if (event.keyCode == 37) { // Left
		player.accelaration.x = -player.accMag;
	}
	if (event.keyCode == 38) { //Up
		player.accelaration.y = -player.accMag;
	}
	if (event.keyCode == 39) { //Right
		player.accelaration.x = player.accMag;
	}
	if (event.keyCode == 40) { //Down
		player.accelaration.y = player.accMag;
	}
	player.accelaration.unit().mult(player.accMag);
}

function controlPlayerKeyUp(event) {
	if (event.keyCode == 37) { // Left
		player.accelaration.x = 0;
	}
	if (event.keyCode == 38) { //Up
		player.accelaration.y = 0;
	}
	if (event.keyCode == 39) { //Right
		player.accelaration.x = 0;
	}
	if (event.keyCode == 40) { //Down
		player.accelaration.y = 0;
	}
}

function playerWallCollide() {
	var i, j;
	var startCell = maze.cellAt(player.pos.x - player.size, player.pos.y - player.size);
	var endCell = maze.cellAt(player.pos.x + player.size, player.pos.y + player.size);
	var collidesWith = [];
	if (startCell.x < 0)
		startCell.x = 0;
	if (startCell.x >= maze.rows)
		startCell.x = maze.rows - 1;
	if (startCell.y < 0)
		startCell.y = 0;
	if (startCell.y >= maze.cols)
		startCell.y = maze.cols - 1;
	for (i = startCell.x; i <= endCell.x; ++i) {
		for (j = startCell.y; j <= endCell.y; ++j) {
			if (maze.grid[i][j].color() == "black")
				collidesWith.push(maze.grid[i][j]);
		}
	}
	return collidesWith;
}

function addEvents() {
	window.addEventListener("keydown", controlPlayerKeyDown);
	window.addEventListener("keyup", controlPlayerKeyUp);
}

function initialize() {
	maze.init();
	maze.generate();
	addEvents();
}

function update(t) {
	t /= 16;
	var playerWallCollisions = playerWallCollide();
	if (playerWallCollisions.length > 0) {
		playerWallCollisions.forEach(function (cell) {
			if (cell.type == "thin wall horizontal") {
				player.velocity.y = -player.velocity.y;
				if (cell.pos.y > player.pos.y)
					player.pos.y = cell.pos.y - player.size - 1;
				else
					player.pos.y = cell.pos.y + player.size + 1;
			}
			else if (cell.type == "thin wall vertical") {
				player.velocity.x = -player.velocity.x;
				if (cell.pos.x > player.pos.x)
					player.pos.x = cell.pos.x - player.size - 1;
				else
					player.pos.x = cell.pos.x + player.size + 1;
			}
		});
	} 
	if (player.accelaration.mag() > 0) {
		player.velocity = Vector.add(player.velocity, Vector.mult(player.accelaration, t))
		if (player.velocity.mag() > player.maxVelMag)
			player.velocity.unit().mult(player.maxVelMag);
	}
	else if (player.velocity.mag() > 0) {
		player.velocity.mult(player.declMag)
	}
	player.pos.add(Vector.mult(player.velocity, t));
	if (player.pos.x - viewport.pos.x > viewport.width * 2 / 3) {
		viewport.pos.x = Math.min(
			player.pos.x - viewport.width * 2 / 3,
			(Math.floor(maze.cols / 2) * (maze.blockSize + maze.wallSize)) + maze.wallSize - viewport.width
		);
	}
	else if (player.pos.x - viewport.pos.x < viewport.width / 3) {
		viewport.pos.x = Math.max(player.pos.x - viewport.width / 3, 0);
	}
	if (player.pos.y - viewport.pos.y > viewport.height * 2 / 3) {
		viewport.pos.y = Math.min(
			player.pos.y - viewport.height * 2 / 3,
			(Math.floor(maze.rows / 2) * (maze.blockSize + maze.wallSize)) + maze.wallSize - viewport.height
		);
	}
	else if (player.pos.y - viewport.pos.y < viewport.height / 3) {
		viewport.pos.y = Math.max(player.pos.y - viewport.height / 3, 0);
	}
}

function render() {
	context.clearRect(0, 0, viewport.width, viewport.height);
	maze.render(viewport, context);
	player.render(viewport, context);
}

function mainLoop(curTime) {
	t = curTime - prevTime;
	update(t);
	prevTime = curTime;
	render();
	window.requestAnimationFrame(mainLoop);
}

function main() {
	initialize();
	maze.render(viewport, context);
	prevTime = 0
	gameLoop = window.requestAnimationFrame(mainLoop);
}

main();