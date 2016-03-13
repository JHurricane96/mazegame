var playerBattle;

function initBattleMode() {
	playerBattle = new PlayerBattle();
	window.removeEventListener("keydown", controlPlayerKeyDown);
	window.removeEventListener("keyup", controlPlayerKeyUp);
}

function updateBattleMode() {
	return "maze";
}

function renderBattleMode() {
	context.clearRect(0, 0, viewport.width, viewport.height);
	playerBattle.render(context);
}

main();