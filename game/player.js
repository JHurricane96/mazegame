function Player() {
	this.size = config.playerSize;
	this.pos = new Vector(this.size + config.mazeWallSize + 1, this.size + config.mazeWallSize + 1);
	this.velocity = new Vector(0, 0);
	this.accelaration = new Vector(0, 0);
	this.accMag = 5;
	this.declMag = 0.9;
	this.maxVelMag = 6;
}

Player.prototype.render = function(viewport, context) {
	context.fillStyle = "blue";
	context.beginPath();
	context.arc(this.pos.x - viewport.pos.x, this.pos.y - viewport.pos.y, this.size, 0, Math.PI * 2);
	context.fill();
}

function PlayerBattle() {
	this.size = confBattle.playerSize;
	this.pos = new Vector(this.size * 2, this.size * 2);
	this.velocity = new Vector(0, 0);
	this.accelaration = new Vector(0, 0);
	this.accMag = 10;
	this.declMag = 0.9;
	this.maxVelMag = 8;
}

PlayerBattle.prototype.render = function(context) {
	context.fillStyle = "blue";
	context.beginPath();
	context.arc(this.pos.x, this.pos.y, this.size, 0, 2 * Math.PI);
	context.stroke();
}