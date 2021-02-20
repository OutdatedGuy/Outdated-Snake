var FoodX, FoodY;
var blocks = 20;
var end;
let snake = [];
var lambi = 0;
var level;
var bigScore = 0;
var ran;
var inputName;
var data;
var times;
var record1 = [];
var record2 = [];
var submit = 0;
var ref;
let eatSound;
let deadSound;
let appleImg;
let pearImg;
let orangeImg;
let bananaImg;

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
	FoodX = (width) / 2;
	FoodY = (height) / 2;

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
	var data1 = {
		level: -1
	};
	const none = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data1)
	};
	var response = await fetch('/getTheScore', none);
	var SCORE = await response.json();
	record1 = SCORE.lvl1;
	record2 = SCORE.lvl2;
}

function draw() {
	if (end == 0) {
		snake[0].move();
		snake[0].dead();
	}
	if (end == 0) {
		gameScreen();
	}
}

class SnakeBody {
	constructor() {
		this.x = FoodX;
		this.y = FoodY;
		this.xSpeed = 0;
		this.ySpeed = 0;
	}
	updateSpeed(xS, xY) {
		this.xSpeed = xS * blocks;
		this.ySpeed = xY * blocks;
	}
	eyes() {
		fill(0);
		noStroke();
		ellipseMode(CENTER);
		if (this.xSpeed > 0) {
			ellipse(this.x + 15, this.y + 5, 6, 3);
			ellipse(this.x + 15, this.y + 15, 6, 3);
		} else if (this.xSpeed < 0) {
			ellipse(this.x + 5, this.y + 5, 6, 3);
			ellipse(this.x + 5, this.y + 15, 6, 3);
		} else if (this.ySpeed < 0) {
			ellipse(this.x + 5, this.y + 5, 3, 6);
			ellipse(this.x + 15, this.y + 5, 3, 6);
		} else if (this.ySpeed > 0) {
			ellipse(this.x + 5, this.y + 15, 3, 6);
			ellipse(this.x + 15, this.y + 15, 3, 6);
		}
	}
	dead() {
		for (var i = 1; i < lambi; i++) {
			if (this.x == snake[i].x && this.y == snake[i].y) {
				deadSound.play();
				end = 1;
				endScreen();
			}
		}
		if (this.x == 0 || this.x == width - blocks || this.y == 0 || this.y == height - blocks) {
			deadSound.play();
			end = 1;
			endScreen();
		}
	}
	eat() {
		if (this.x == FoodX && this.y == FoodY) {
			eatSound.play();
			snake[lambi++] = new SnakeBody();
			foodLocation();
		}
	}
	move() {
		this.x = this.x + this.xSpeed;
		this.y = this.y + this.ySpeed;
	}
	show() {
		fill(0, 255, 0);
		stroke(0);
		strokeWeight(1);
		rect(this.x, this.y, blocks);
	}
}

function foodLocation() {
	FoodX = int(random(1, (width / blocks) - 2)) * blocks;
	FoodY = int(random(1, (height / blocks) - 2)) * blocks;
	ran = int(random(1, 5));
	for (i = 0; i < lambi; i++) {
		if (FoodX == snake[i].x && FoodY == snake[i].y) {
			foodLocation();
		}
	}
}

function FoodShow(type) {
	if (type == 1) {
		image(bananaImg, FoodX, FoodY, 20,20);
	} else if (type == 2) {
		image(appleImg, FoodX, FoodY, 20,20);
	} else if (type == 3) {
		image(pearImg, FoodX, FoodY, 20,20);
	} else if (type == 4) {
		image(orangeImg, FoodX, FoodY, 20,20);
	}
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
	if (end == 0) {
		if ((keyCode === LEFT_ARROW || keyCode === 65) && snake[0].xSpeed < 1) {
			snake[0].updateSpeed(-1, 0);
		} else if ((keyCode === RIGHT_ARROW || keyCode === 68) && snake[0].xSpeed > -1) {
			snake[0].updateSpeed(1, 0);
		} else if ((keyCode === UP_ARROW || keyCode === 87) && snake[0].ySpeed < 1) {
			snake[0].updateSpeed(0, -1);
		} else if ((keyCode === DOWN_ARROW || keyCode === 83) && snake[0].ySpeed > -1) {
			snake[0].updateSpeed(0, 1);
		}
	}
	if (keyCode === 66) {
		if (end == 0) {
			if (bigScore == 0) {
				bigScore = 1;
			} else {
				bigScore = 0;
			}
		} else if (end == 4 || end == 3) {
			end = 1;
			endScreen();
		}
	}
	if ((end == 1 || end == 3) && keyCode === 72) {
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
	if (end > 0 && mouseX > 2 * hor + 10 && mouseX < 2 * hor + 110 && mouseY > ver + 45 && mouseY < ver + 75) {
		removeElements();
		lambi = 0;
		setup();
	}
	if ((end == 4 || end == 3) && mouseX > 2 * hor - 110 && mouseX < 2 * hor - 10 && mouseY > ver + 45 && mouseY < ver + 75) {
		end = 1;
		endScreen();
	}
	if (end == 2 && mouseX > 2 * hor - 110 && mouseX < 2 * hor - 10 && mouseY > ver + 45 && mouseY < ver + 75) {
		removeElements();
		data = {
			level: level,
			name: inputName.value(),
			score: times
		};
		nameSubmitted();
	}
	if (end == 1 && (submit == 0 || submit == 2) && mouseX > 2 * hor - 110 && mouseX < 2 * hor - 10 && mouseY > ver + 45 && mouseY < ver + 75) {
		if (submit == 0) {
			submitScreen();
		} else if (submit == 2) {
			submit = 0;
		}
	}
	if (end == -1) {
		if (mouseX > hor - 135 && mouseX < hor + 135 && mouseY > ver - 35 && mouseY < ver + 35) {
			level = 0;
			end = 0;
		} else if (mouseX > 3 * hor - 135 && mouseX < 3 * hor + 135 && mouseY > ver - 35 && mouseY < ver + 35) {
			level = 1;
			end = 0;
		}
	}
	if (end == 0 && mouseX > 70 && mouseY > 2 && mouseX < 130 && mouseY < 17) {
		if (bigScore == 0) {
			bigScore = 1;
		} else {
			bigScore = 0;
		}
	}
	if ((end == 1 || end == 3) && mouseX > width / 2 - 70 && mouseX < width / 2 + 70 && mouseY > ver + 85 && mouseY < ver + 115) {
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
	rect(3 * width / 4, height / 2, 270, 70);
	textAlign(CENTER);
	fill(0);
	textSize(30);
	text("Steady Speed", width / 4, height / 2 + 10);
	text("Increasing Speed", 3 * width / 4, height / 2 + 10);
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
	rect(blocks - 1, blocks - 1, width - 2 * blocks + 2, height - 2 * blocks + 2);
	fill(170);
	rect(70, 2, 60, 15);
	fill(0);
	stroke(0);
	strokeWeight(1);
	textAlign(CENTER);
	textSize(12);
	text("Big Score", 100, 14);
	snake[0].eat();
	if (bigScore == 0) {
		fill(255);
		noStroke();
		strokeWeight(1);
		textAlign(CENTER);
		textSize(13);
		text("Score: " + (lambi - 1), 30, 15);
	} else if (bigScore == 1) {
		fill(170);
		stroke(170);
		strokeWeight(2);
		textAlign(CENTER);
		textSize(45);
		text("Score: " + (lambi - 1), width / 2, height / 2);
	}
	times=lambi-1;
	FoodShow(ran);
	for (i = 0; i < lambi; i++) {
		snake[i].show();
		if (i == 0) {
			snake[0].eyes();
		}
	}
	for (i = lambi - 1; i > 0; i--) {
		snake[i].x = snake[i - 1].x;
		snake[i].y = snake[i - 1].y;
		snake[i].xSpeed = snake[i - 1].xSpeed;
		snake[i].ySpeed = snake[i - 1].ySpeed;
	}
}

function endScreen() {
	bubbleSort1();
	bubbleSort2();

	background(60);
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
			text(record1[0].name + ": " + record1[0].score, width / 2, 6 * blocks);
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
			text(record2[0].name + ": " + record2[0].score, width / 2, 6 * blocks);
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
	inputName = createInput().attribute('maxlength', 15);
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
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
	};
	fetch('/api', options);

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
	if (end == 4 || end == 3) {
		text("Back", width / 2 - 60, height / 2 + 67);
	} else {
		text("Submit", width / 2 - 60, height / 2 + 67);
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
			text((i + 1) + ". " + record1[i].name + ": " + record1[i].score, width / 6, (i + 5) * (blocks + 4));
			text((i + 11) + ". " + record1[i+10].name + ": " + record1[i+10].score, width / 2, (i + 5) * (blocks + 4));
			text((i + 21) + ". " + record1[i+20].name + ": " + record1[i+20].score, 5 * (width / 6), (i + 5) * (blocks + 4));
		}
	} else if (level == 1) {
		for (i = 0; i < 10; i++) {
			text((i + 1) + ". " + record2[i].name + ": " + record2[i].score, width / 6, (i + 5) * (blocks + 4));
			text((i + 11) + ". " + record2[i+10].name + ": " + record2[i+10].score, width / 2, (i + 5) * (blocks + 4));
			text((i + 21) + ". " + record2[i+20].name + ": " + record2[i+20].score, 5 * (width / 6), (i + 5) * (blocks + 4));
		}
	}
	if (submit != 1) {
		submit = 2;
	}
}