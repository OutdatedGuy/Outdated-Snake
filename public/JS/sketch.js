async function loadLocalSound(relativePath) {
  const response = await fetch(relativePath);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${relativePath}: ${response.status}`);
  }
  const blobUrl = URL.createObjectURL(await response.blob());
  return loadSound(blobUrl);
}

async function setup() {
  if (!assetsLoaded) {
    [deadSound, eatSound, appleImg, pearImg, orangeImg, bananaImg] =
      await Promise.all([
        loadLocalSound("../sounds/Oof.mp3"),
        loadLocalSound("../sounds/munch-sound-effect.mp3"),
        loadImage("../img/Apple.png"),
        loadImage("../img/Pear.png"),
        loadImage("../img/Orange.png"),
        loadImage("../img/Banana.png"),
      ]);

    deadSound.rate(4);
    eatSound.rate(1.7);
    eatSound.amp(0.25);
    assetsLoaded = true;
  }

  createCanvas(1080, 600);
  FoodX = width / 2;
  FoodY = height / 2;

  frameRate(18);
  end = -1;
  snake = [];
  lambi = 0;
  snake[lambi++] = new SnakeBody();
  foodLocation();

  submit = 0;
  startScreen();
}

function myCompare(a, b) {
	if (a.score == b.score) return a.index - b.index;
	return b.score - a.score;
}

function draw() {
  if (end == 0) {
    snake[0].move();
    snake[0].dead();
  }
  if (end == 0) gameScreen();
}

function foodLocation() {
  let collides = true;
  while (collides) {
    FoodX = int(random(1, width / blocks - 2)) * blocks;
    FoodY = int(random(1, height / blocks - 2)) * blocks;
    collides = false;
    for (let i = 0; i < lambi; i++) {
      if (FoodX == snake[i].x && FoodY == snake[i].y) {
        collides = true;
        break;
      }
    }
  }
  ran = int(random(1, 5));
}

function FoodShow(type) {
  if (type == 1) image(bananaImg, FoodX, FoodY, 20, 20);
  else if (type == 2) image(appleImg, FoodX, FoodY, 20, 20);
  else if (type == 3) image(pearImg, FoodX, FoodY, 20, 20);
  else if (type == 4) image(orangeImg, FoodX, FoodY, 20, 20);
}

function keyPressed() {
  if (typeof userStartAudio === "function") userStartAudio();
  const k = (key || "").toLowerCase();

  if (end == -1) {
    if (key === "1") {
      level = 0;
      end = 0;
    } else if (key === "2") {
      level = 1;
      end = 0;
    }
  }
  if (end == 0 && change) {
    if ((key === "ArrowLeft" || k === "a") && snake[0].xSpeed < 1) {
      snake[0].updateSpeed(-1, 0);
    } else if ((key === "ArrowRight" || k === "d") && snake[0].xSpeed > -1) {
      snake[0].updateSpeed(1, 0);
    } else if ((key === "ArrowUp" || k === "w") && snake[0].ySpeed < 1) {
      snake[0].updateSpeed(0, -1);
    } else if ((key === "ArrowDown" || k === "s") && snake[0].ySpeed > -1) {
      snake[0].updateSpeed(0, 1);
    }
  }
  if (k === "b") {
    if (end == 0) {
      bigScore = !bigScore;
    } else if (end == 4 || end == 3) {
      end = 1;
      endScreen();
    }
  }
  if ((end == 1 || end == 3) && k === "h" && !noInternet) {
    highscoreScreen();
  }
  if (end > 0 && end != 2 && key === "Enter") {
    removeElements();
    lambi = 0;
    setup();
  }
}

function mousePressed() {
  if (typeof userStartAudio === "function") userStartAudio();

  const hor = width / 4;
  const ver = height / 2;
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
    const submittedName = inputName.value();
    removeElements();
    data = {
      level: level,
      name: submittedName,
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
  for (let i = 0; i < lambi; i++) {
    snake[i].show();
    if (i == 0) snake[0].eyes();
  }
  for (let i = lambi - 1; i > 0; i--) {
    snake[i].x = snake[i - 1].x;
    snake[i].y = snake[i - 1].y;
    snake[i].xSpeed = snake[i - 1].xSpeed;
    snake[i].ySpeed = snake[i - 1].ySpeed;
  }
}

function endScreen() {
  noInternet = false;
  record1.sort(myCompare);
  record2.sort(myCompare);

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

async function nameSubmitted() {
  try {
    await fetch("/api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  } catch (_) { }

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
  text(data.name, width / 2, height / 2 - 5);
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
  record1.sort(myCompare);
  record2.sort(myCompare);

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

  const records = level == 0 ? record1 : record2;
  const columns = [width / 6, width / 2, 5 * (width / 6)];

  for (let i = 0; i < 10; i++) {
    for (let col = 0; col < 3; col++) {
      const idx = i + col * 10;
      if (!records[idx]) continue;
      text(
        idx + 1 + ". " + records[idx].name + ": " + records[idx].score,
        columns[col],
        (i + 5) * (blocks + 4)
      );
    }
  }

  if (submit != 1) {
    submit = 2;
  }
}

function validName() {
  let naam = inputName.value();
  if (naam == "") {
    alert("ENTER A NAME");
    return false;
  }
  if (!/^[a-zA-Z0-9._@+& -]*$/.test(naam)) {
    alert("Invalid Characters");
    return false;
  }
  if (!/^[a-zA-Z][a-zA-Z0-9._@+& -]*$/.test(naam)) {
    alert("Invalid Name");
    return false;
  }

  for (let x = 1; x < naam.length - 1; x++) {
    if (!/^[a-zA-Z0-9]*$/.test(naam[x]) && naam[x] == naam[x + 1]) {
      naam = naam.slice(0, x) + naam.slice(x + 1);
      x--;
    }
  }

  inputName.value(naam);
  return true;
}
