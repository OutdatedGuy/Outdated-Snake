function preload() {
	deadSound = loadSound("../sounds/Oof.mp3");
	eatSound = loadSound("../sounds/munch-sound-effect.mp3");
	appleImg = loadImage("../img/Apple.png");
	pearImg = loadImage("../img/Pear.png");
	orangeImg = loadImage("../img/Orange.png");
	bananaImg = loadImage("../img/Banana.png");
}

function setup() {
	createCanvas(1080, 600);
	FoodX = width / 2;
	FoodY = height / 2;

	setInterval(getScore, 1000);

	frameRate(18);
	end = -1;
	snake[lambi++] = new SnakeBody();
	foodLocation();
	record1.length = 0;
	record2.length = 0;

	deadSound.rate(4);
	eatSound.rate(1.7);
	eatSound.setVolume(0.25);

	submit = 0;
	startScreen();
}

function bubbleSort1() {
	for (i = 0; i < 30; i++) {
		for (j = record1.length - 1; j > 0; j--) {
			if (record1[j].score > record1[j - 1].score) {
				var tempS = record1[j];
				record1[j] = record1[j - 1];
				record1[j - 1] = tempS;
			}
		}
	}
}

function bubbleSort2() {
	for (i = 0; i < 30; i++) {
		for (j = record2.length - 1; j > 0; j--) {
			if (record2[j].score > record2[j - 1].score) {
				var tempS = record2[j];
				record2[j] = record2[j - 1];
				record2[j - 1] = tempS;
			}
		}
	}
}

async function getScore() {
	const none = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
	};
	var response = await fetch("/getTheScore", none);
	var SCORE = await response.json();
	record1 = SCORE.lvl1;
	record2 = SCORE.lvl2;
}

function draw() {
	if (end == 0) {
		snake[0].move();
		snake[0].dead();
	}
	if (end == 0) gameScreen();
}

function foodLocation() {
	FoodX = int(random(1, width / blocks - 2)) * blocks;
	FoodY = int(random(1, height / blocks - 2)) * blocks;
	ran = int(random(1, 5));
	for (i = 0; i < lambi; i++) {
		if (FoodX == snake[i].x && FoodY == snake[i].y) {
			foodLocation();
		}
	}
}

function FoodShow(type) {
	if (type == 1) image(bananaImg, FoodX, FoodY, 20, 20);
	else if (type == 2) image(appleImg, FoodX, FoodY, 20, 20);
	else if (type == 3) image(pearImg, FoodX, FoodY, 20, 20);
	else if (type == 4) image(orangeImg, FoodX, FoodY, 20, 20);
}

function keyPressed() {
	if (end == -1) {
		if (key == 1) {
			level = 0;
			end = 0;
		} else if (key == 2) {
			level = 1;
			end = 0;
		}
	}
	if (end == 0 && change) {
		if ((keyCode === LEFT_ARROW || keyCode === 65) && snake[0].xSpeed < 1) {
			snake[0].updateSpeed(-1, 0);
		} else if (
			(keyCode === RIGHT_ARROW || keyCode === 68) &&
			snake[0].xSpeed > -1
		) {
			snake[0].updateSpeed(1, 0);
		} else if (
			(keyCode === UP_ARROW || keyCode === 87) &&
			snake[0].ySpeed < 1
		) {
			snake[0].updateSpeed(0, -1);
		} else if (
			(keyCode === DOWN_ARROW || keyCode === 83) &&
			snake[0].ySpeed > -1
		) {
			snake[0].updateSpeed(0, 1);
		}
	}
	if (keyCode === 66) {
		if (end == 0) {
			bigScore = !bigScore;
		} else if (end == 4 || end == 3) {
			end = 1;
			endScreen();
		}
	}
	if ((end == 1 || end == 3) && keyCode === 72 && !noInternet) {
		highscoreScreen();
	}
	if (end > 0 && end != 2 && keyCode == ENTER) {
		removeElements();
		lambi = 0;
		setup();
	}
}

function mousePressed() {
	var hor = width / 4;
	var ver = height / 2;
	if (
		(end > 0 &&
			mouseX > 2 * hor + 10 &&
			mouseX < 2 * hor + 110 &&
			mouseY > ver + 45 &&
			mouseY < ver + 75 &&
			!noInternet) ||
		(end > 0 &&
			mouseX > 2 * hor - 50 &&
			mouseX < 2 * hor + 50 &&
			mouseY > ver + 45 &&
			mouseY < ver + 75 &&
			noInternet)
	) {
		removeElements();
		lambi = 0;
		setup();
	}
	if (
		(end == 4 || end == 3) &&
		mouseX > 2 * hor - 110 &&
		mouseX < 2 * hor - 10 &&
		mouseY > ver + 45 &&
		mouseY < ver + 75
	) {
		end = 1;
		endScreen();
	}
	if (
		end == 2 &&
		mouseX > 2 * hor - 110 &&
		mouseX < 2 * hor - 10 &&
		mouseY > ver + 45 &&
		mouseY < ver + 75 &&
		validName()
	) {
		removeElements();
		data = {
			level: level,
			name: inputName.value(),
			score: lambi,
			check: times,
		};
		nameSubmitted();
	}
	if (
		end == 1 &&
		(submit == 0 || submit == 2) &&
		mouseX > 2 * hor - 110 &&
		mouseX < 2 * hor - 10 &&
		mouseY > ver + 45 &&
		mouseY < ver + 75 &&
		!noInternet
	) {
		if (submit == 0) {
			submitScreen();
		} else if (submit == 2) {
			submit = 0;
		}
	}
	if (end == -1) {
		if (
			mouseX > hor - 135 &&
			mouseX < hor + 135 &&
			mouseY > ver - 35 &&
			mouseY < ver + 35
		) {
			level = 0;
			end = 0;
		} else if (
			mouseX > 3 * hor - 135 &&
			mouseX < 3 * hor + 135 &&
			mouseY > ver - 35 &&
			mouseY < ver + 35
		) {
			level = 1;
			end = 0;
		}
	}
	if (end == 0 && mouseX > 70 && mouseY > 2 && mouseX < 130 && mouseY < 17) {
		bigScore = !bigScore;
	}
	if (
		(end == 1 || end == 3) &&
		mouseX > width / 2 - 70 &&
		mouseX < width / 2 + 70 &&
		mouseY > ver + 85 &&
		mouseY < ver + 115 &&
		!noInternet
	) {
		highscoreScreen();
	}
}

function startScreen() {
	background(60);
	stroke(255);
	strokeWeight(1);
	line(width / 2, 0, width / 2, height);
	fill(190);
	stroke(0);
	rectMode(CENTER);
	rect(width / 4, height / 2, 270, 70);
	rect((3 * width) / 4, height / 2, 270, 70);
	textAlign(CENTER);
	fill(0);
	textSize(30);
	text("Steady Speed", width / 4, height / 2 + 10);
	text("Increasing Speed", (3 * width) / 4, height / 2 + 10);
}

function gameScreen() {
	background(60);
	if (level == 1) {
		frameRate(lambi + 10);
	}
	noFill();
	stroke(255);
	strokeWeight(1);
	rectMode(CORNER);
	rect(
		blocks - 1,
		blocks - 1,
		width - 2 * blocks + 2,
		height - 2 * blocks + 2
	);
	fill(170);
	rect(70, 2, 60, 15);
	fill(0);
	stroke(0);
	strokeWeight(1);
	textAlign(CENTER);
	textSize(12);
	text("Big Score", 100, 14);
	snake[0].eat();
	if (!bigScore) {
		fill(255);
		noStroke();
		strokeWeight(1);
		textAlign(CENTER);
		textSize(13);
		text("Score: " + (lambi - 1), 30, 15);
	} else {
		fill(170);
		stroke(170);
		strokeWeight(2);
		textAlign(CENTER);
		textSize(45);
		text("Score: " + (lambi - 1), width / 2, height / 2);
	}
	times = lambi - 1;
	FoodShow(ran);
	for (i = 0; i < lambi; i++) {
		snake[i].show();
		if (i == 0) snake[0].eyes();
	}
	for (i = lambi - 1; i > 0; i--) {
		snake[i].x = snake[i - 1].x;
		snake[i].y = snake[i - 1].y;
		snake[i].xSpeed = snake[i - 1].xSpeed;
		snake[i].ySpeed = snake[i - 1].ySpeed;
	}
}

function endScreen() {
	noInternet = false;
	bubbleSort1();
	bubbleSort2();

	background(60);
	if (record1.length == 0 || record2.length == 0) {
		noInternet = true;
		stroke(255, 0, 0);
		strokeWeight(3);
		fill(255, 150, 200);
		textAlign(CENTER);
		textSize(40);
		text("NO Internet...", width / 2, 3 * blocks);
		stroke(255, 0, 0);
		strokeWeight(3);
		fill(255, 0, 0);
		textAlign(CENTER);
		textSize(60);
		text("Game Ended", width / 2, height / 2 - 2 * blocks);
		textSize(30);
		noStroke();
		strokeWeight(1);
		fill(255);
		text("Your Score: " + (lambi - 1), width / 2, height / 2 + blocks + 10);
		fill(0, 255, 0);
		textSize(30);
		text("Level: " + (level + 1), width / 2, height / 2);
		resetButton();
		return;
	}

	resetButton();
	if (level == 0) {
		if (lambi - 1 > record1[0].score) {
			newHigh();
		} else {
			stroke(255, 0, 0);
			strokeWeight(3);
			fill(255, 150, 200);
			textAlign(CENTER);
			textSize(40);
			text("HighScore by", width / 2, 3 * blocks);
			noStroke();
			fill(0, 255, 255);
			textSize(60);
			text(
				record1[0].name + ": " + record1[0].score,
				width / 2,
				6 * blocks
			);
		}
	} else if (level == 1) {
		if (lambi - 1 > record2[0].score) {
			newHigh();
		} else {
			stroke(255, 0, 0);
			strokeWeight(3);
			fill(255, 150, 200);
			textAlign(CENTER);
			textSize(40);
			text("HighScore by", width / 2, 3 * blocks);
			noStroke();
			fill(0, 255, 255);
			textSize(60);
			text(
				record2[0].name + ": " + record2[0].score,
				width / 2,
				6 * blocks
			);
		}
	}

	stroke(255, 0, 0);
	strokeWeight(3);
	fill(255, 0, 0);
	textAlign(CENTER);
	textSize(60);
	text("Game Ended", width / 2, height / 2 - 2 * blocks);
	textSize(30);
	noStroke();
	strokeWeight(1);
	fill(255);
	text("Your Score: " + (lambi - 1), width / 2, height / 2 + blocks + 10);
	fill(0, 255, 0);
	textSize(30);
	text("Level: " + (level + 1), width / 2, height / 2);
}

function submitScreen() {
	end = 2;
	background(60);
	resetButton();
	inputName = createInput().attribute("maxlength", 15);
	inputName.position(width / 2 - 130, height / 2 - 30);
	inputName.size(250, 20);
	textSize(30);
	noStroke();
	strokeWeight(1);
	fill(255);
	text("Your Score: " + (lambi - 1), width / 2, height / 2 + blocks + 10);
	fill(0, 255, 0);
	textSize(30);
	text("Level: " + (level + 1), width / 2, height / 2 - 40);
}

function nameSubmitted() {
	const options = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	};
	fetch("/api", options);

	end = 3;
	submit = 1;

	saveResult();
}

function saveResult() {
	background(60);
	resetButton();
	textSize(30);
	noStroke();
	strokeWeight(1);
	fill(255);
	text("Score: " + (lambi - 1), width / 2, height / 2 + blocks + 10);
	fill(255, 0, 0);
	text(inputName.value(), width / 2, height / 2 - 5);
	fill(0, 255, 0);
	textSize(30);
	text("Level: " + (level + 1), width / 2, height / 2 - 40);
}

function resetButton() {
	if (!noInternet) {
		stroke(0);
		fill(160);
		rectMode(CENTER);
		rect(width / 2 + 60, height / 2 + 60, 100, 30);
		rect(width / 2 - 60, height / 2 + 60, 100, 30);
		textSize(20);
		if (end == 1 || end == 3) {
			rect(width / 2, height / 2 + 100, 140, 30);
			fill(0);
			text("Highscore List", width / 2, height / 2 + 107);
		}
		fill(0);
		text("Restart", width / 2 + 60, height / 2 + 67);
		if (end == 4 || end == 3) text("Back", width / 2 - 60, height / 2 + 67);
		else text("Submit", width / 2 - 60, height / 2 + 67);
	} else {
		stroke(0);
		fill(160);
		rectMode(CENTER);
		rect(width / 2, height / 2 + 60, 100, 30);
		fill(0);
		textSize(20);
		text("Restart", width / 2, height / 2 + 67);
	}
}

function newHigh() {
	stroke(255, 0, 0);
	strokeWeight(3);
	fill(255, 150, 200);
	textAlign(CENTER);
	textSize(40);
	text("New HighScore", width / 2, 3 * blocks);
}

function highscoreScreen() {
	bubbleSort1();
	bubbleSort2();

	background(60);
	end = 4;
	resetButton();
	stroke(255, 0, 255);
	fill(180, 30, 150);
	textSize(50);
	text("Level " + (level + 1), width / 2, 2 * blocks);
	fill(255, 215, 0);
	noStroke();
	text("HighScore List:", width / 2, 4.5 * blocks);
	fill(0, 255, 255);
	textSize(20);
	if (level == 0) {
		for (i = 0; i < 10; i++) {
			text(
				i + 1 + ". " + record1[i].name + ": " + record1[i].score,
				width / 6,
				(i + 5) * (blocks + 4)
			);
			text(
				i +
					11 +
					". " +
					record1[i + 10].name +
					": " +
					record1[i + 10].score,
				width / 2,
				(i + 5) * (blocks + 4)
			);
			text(
				i +
					21 +
					". " +
					record1[i + 20].name +
					": " +
					record1[i + 20].score,
				5 * (width / 6),
				(i + 5) * (blocks + 4)
			);
		}
	} else if (level == 1) {
		for (i = 0; i < 10; i++) {
			text(
				i + 1 + ". " + record2[i].name + ": " + record2[i].score,
				width / 6,
				(i + 5) * (blocks + 4)
			);
			text(
				i +
					11 +
					". " +
					record2[i + 10].name +
					": " +
					record2[i + 10].score,
				width / 2,
				(i + 5) * (blocks + 4)
			);
			text(
				i +
					21 +
					". " +
					record2[i + 20].name +
					": " +
					record2[i + 20].score,
				5 * (width / 6),
				(i + 5) * (blocks + 4)
			);
		}
	}
	if (submit != 1) {
		submit = 2;
	}
}

function validName() {
	if (inputName.value() == "") {
		alert("ENTER A NAME");
		inputName.focus();
		return false;
	}
	if (!/^[a-zA-Z0-9']*$/g.test(inputName.value())) {
		alert("Invalid Characters");
		inputName.focus();
		return false;
	}
	if (!/^[a-zA-Z]+$/g.test(inputName.value())) {
		alert("Must Contain Alphabets");
		inputName.focus();
		return false;
	}
	if(inputName.value().length < 5) {
		alert("Name must be atleat 5 characters long");
		inputName.focus();
		return false;
	}

	return true;
}
