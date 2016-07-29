"use strict"
function Cell(x, y, width, height, type) {
	this.pos = new Vector(x, y);
	this.width = width;
	this.height = height;
	this.type = type;
}

Cell.prototype.color = function() {
	if (this.type == "dot" || /wall/.test(this.type))
		return "black";
	else
		return "white";
}

function Maze() {
	this.rows = config.mazeSize;
	this.cols = config.mazeSize;
	this.grid = [];
	this.blockSize = config.mazeBlockSize;
	this.wallSize = config.mazeWallSize;
}

Maze.prototype.init = function() {
	this.grid = [];

	var i, j;
	var x, y;
	for (i = 0, y = 0; i < this.rows; ++i) {
		this.grid.push([]);
		for (j = 0, x = 0; j < this.cols; ++j) {
			if (i % 2 == 1) {
				if (j % 2 == 1)
					this.grid[i][j] = new Cell(x, y, this.blockSize, this.blockSize, "thick free");
				else
					this.grid[i][j] = new Cell(x, y, this.wallSize, this.blockSize, "thin wall vertical");
			}
			else {
				if (j % 2 == 1)
					this.grid[i][j] = new Cell(x, y, this.blockSize, this.wallSize, "thin wall horizontal");
				else
					this.grid[i][j] = new Cell(x, y, this.wallSize, this.wallSize, "dot");
			}
			if (j % 2 == 1)
				x += this.blockSize;
			else
				x += this.wallSize;
		}
		if (i % 2 == 1)
			y += this.blockSize;
		else
			y += this.wallSize;
	}
}

Maze.prototype.cellAt = function(x, y) {
	x = ((2 * Math.floor(x / (this.blockSize + this.wallSize))) + Math.min(Math.floor((x % (this.blockSize + this.wallSize)) / this.wallSize), 1));
	y = ((2 * Math.floor(y / (this.blockSize + this.wallSize))) + Math.min(Math.floor((y % (this.blockSize + this.wallSize)) / this.wallSize), 1));
	return new Vector(y, x);
}

Maze.prototype.generate = function(key, exit) {
	console.log(maze);
	var visited = [];
	var i, j;
	for (i = 0; i < this.rows; ++i) {
		visited.push([]);
		for (j = 0; j < this.cols; ++j)
			visited[i][j] = false;
	}

	visited[1][1] = true;

	function dfs(i, j, mazeObj) {
		var children = [
			new Vector(i + 2, j),
			new Vector(i - 2, j),
			new Vector(i, j + 2),
			new Vector(i, j - 2)
		];
		var childrenWalls = [
			new Vector(i + 1, j),
			new Vector(i - 1, j),
			new Vector(i, j + 1),
			new Vector(i, j - 1)
		];
		var counter;
		var k = Math.floor(Math.random() * 4);
		for (counter = 0; counter < 4; ++counter, k = (k + 1) % 4) {
			var child = children[k];
			if (!(child.x >= mazeObj.rows - 1 || child.x <= 0 || child.y >= mazeObj.cols - 1 || child.y <= 0) && visited[child.x][child.y] === false) {
				visited[child.x][child.y] = true;
				var adjWall = mazeObj.grid[childrenWalls[k].x][childrenWalls[k].y];
				if (adjWall.type == "thin wall horizontal")
					mazeObj.grid[childrenWalls[k].x][childrenWalls[k].y] = new Cell(adjWall.x, adjWall.y, mazeObj.blockSize, mazeObj.wallSize, "thin free horizontal");
				else
					mazeObj.grid[childrenWalls[k].x][childrenWalls[k].y] = new Cell(adjWall.x, adjWall.y, mazeObj.wallSize, mazeObj.blockSize, "thin free vertical");
				dfs(child.x, child.y, mazeObj);
			}
		}
	}

	dfs(1, 1, this);

	key.pos = new Vector(
		(Math.floor(this.rows / 2) * (this.blockSize + this.wallSize) + this.wallSize) / 2 - (key.size / 2),
		(Math.floor(this.rows / 2) * (this.blockSize + this.wallSize) + this.wallSize) / 2 - (key.size / 2)
	);
	exit.pos = new Vector(
		Math.floor(this.rows / 2) * (this.blockSize + this.wallSize) - (this.blockSize / 2) - (exit.size / 2),
		Math.floor(this.rows / 2) * (this.blockSize + this.wallSize) - (this.blockSize / 2) - (exit.size / 2)
	);
}

Maze.prototype.render = function(viewport, context) {
	var i, j;
	var cell;
	for (i = 0; i < this.rows; ++i) {
		for (j = 0; j < this.cols; ++j) {
			cell = this.grid[i][j];
			context.fillStyle = cell.color();
			context.fillRect(cell.pos.x - viewport.pos.x, cell.pos.y - viewport.pos.y, cell.width, cell.height);
		}
	}
}

function Key() {
	this.pickedUp = false;
	this.pos = new Vector(0, 0);
	this.size = config.mazeBlockSize / 2;
}

Key.prototype.render = function (viewport, context) {
	if (this.pickedUp)
		return;
	context.fillStyle = "yellow";
	context.fillRect(this.pos.x - viewport.pos.x, this.pos.y - viewport.pos.y, this.size, this.size);
}

function Exit() {
	this.pos = new Vector(0, 0);
	this.size = config.mazeBlockSize / 2;
}

Exit.prototype.render = function(viewport, context) {
	context.fillStyle = "gray";
	context.fillRect(this.pos.x - viewport.pos.x, this.pos.y - viewport.pos.y, this.size, this.size);
}