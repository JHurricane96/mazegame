var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
var gameLoop = {};
var player = new Player();
var maze = new Maze();
var key = new Key();
var exit = new Exit();
var prevTime;
var gameMode = "maze";
var battleChance = 0;

function controlPlayerKeyDown(event) {
	//event.preventDefault();
	if (event.keyCode >= 37 && event.keyCode <= 40)
		console.log(event, "anything");
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
	event.preventDefault();
	if (event.keyCode >= 37 && event.keyCode <= 40)
		console.log(event, "anything2");
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
	startCell.x = Math.max(0, startCell.x);
	startCell.x = Math.min(maze.rows - 1, startCell.x);
	startCell.y = Math.max(0, startCell.y);
	startCell.y = Math.min(maze.cols - 1, startCell.y);
	endCell.x = Math.max(0, endCell.x);
	endCell.x = Math.min(maze.rows - 1, endCell.x);
	endCell.y = Math.max(0, endCell.y);
	endCell.y = Math.min(maze.cols - 1, endCell.y);
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
	maze.generate(key, exit);
	addEvents();
}

function reInitialize() {
	key.pickedUp = false;
	player = new Player();
	maze.init();
	maze.generate(key, exit);
}

function updateMazeMode(t) {
	if (Math.abs(player.pos.x - key.pos.x - key.size / 2) <= player.size + key.size / 2 && Math.abs(player.pos.y - key.pos.y - key.size / 2) <= player.size + key.size / 2)
		key.pickedUp = true;
	if (key.pickedUp && Math.abs(player.pos.x - exit.pos.x - exit.size / 2) <= player.size + exit.size / 2 && Math.abs(player.pos.y - exit.pos.y - exit.size / 2) <= player.size + exit.size / 2) {
		reInitialize();
	}
	if (Math.random() * 1000 < battleChance) {
		console.log("battle!");
		battleChance = 0;
		return "battle";
	}
	else
		battleChance += t/8000;
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
	return "";
}

function renderMazeMode() {
	context.clearRect(0, 0, viewport.width, viewport.height);
	maze.render(viewport, context);
	player.render(viewport, context);
	key.render(viewport, context);
	exit.render(viewport, context);
}

function mainLoop(curTime) {
	t = curTime - prevTime;
	var mode;
	if (gameMode == "maze") {
		mode = updateMazeMode(t);
		renderMazeMode();
		if (mode == "battle") {
			initBattleMode();
			gameMode = mode;
		}
	}
	else {
		mode = updateBattleMode(t);
		renderBattleMode();
		if (mode == "maze") {
			addEvents();
			gameMode = mode;
		}
	}
	prevTime = curTime;
	window.requestAnimationFrame(mainLoop);
}

function main() {
	initialize();
	maze.render(viewport, context);
	prevTime = 0
	gameLoop = window.requestAnimationFrame(mainLoop);
}