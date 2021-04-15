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
		change = false;
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
		if (
			this.x == 0 ||
			this.x == width - blocks ||
			this.y == 0 ||
			this.y == height - blocks
		) {
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
		change = true;
	}
	show() {
		fill(0, 255, 0);
		stroke(0);
		strokeWeight(1);
		rect(this.x, this.y, blocks);
	}
}
