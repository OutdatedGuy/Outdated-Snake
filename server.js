require("dotenv").config();
const express = require("express");
const app = express();
const firebase = require("firebase");
const limitter = require("express-rate-limit");

const apiLimitter = limitter({
  windowMs: 2 * 60 * 1000,
  max: 2,
});

var ref;
record1 = [];
record2 = [];

var firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  databaseURL: process.env.DATABASE_URL,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.MEASUREMENT_ID,
};
firebase.initializeApp(firebaseConfig);
var database = firebase.database();
ref = database.ref("Outdated Game/Snake Game/Level 1");
ref.on("value", gotData1);
ref = database.ref("Outdated Game/Snake Game/Level 2");
ref.on("value", gotData2);

const port = process.env.PORT || 1412;
app.listen(port, () =>
  console.log(`Starting server at http://127.0.0.1:${port}`)
);

app.use(express.static("public"));
app.use(express.json({ limit: "200b" }));

app.post("/getTheScore", (_request, response) => {
  record1.length = 0;
  record2.length = 0;
  // console.log("I Got A Request To Send Data!!");
  ref = database.ref("Outdated Game/Snake Game/Level 1");
  ref.on("value", gotData1);

  ref = database.ref("Outdated Game/Snake Game/Level 2");
  ref.on("value", gotData2);

  response.json({
    lvl1: record1,
    lvl2: record2,
  });
});

app.post("/api", apiLimitter, (request, response) => {
  if (request.headers.host !== "outdated-snake.herokuapp.com") {
    response.end();
    return;
  }

  console.log("I Got A Request To Add Data!!");
  var data = {
    name: request.body.name.substr(0, 15),
    score: request.body.score - 1,
  };

  if (
    (data.score >= 1456 || data.score != request.body.check) &&
    request.body.check != undefined
  )
    request.body.level = 2;

  if (request.body.check == undefined) data.score++;

  if (request.body.level == 0) {
    ref = database.ref("Outdated Game/Snake Game/Level 1");
  } else if (request.body.level == 1) {
    ref = database.ref("Outdated Game/Snake Game/Level 2");
  } else {
    console.log("Data Adding Failed :(");
    response.end();
    return;
  }
  ref.off();
  ref.push(data);
  console.log("Data Added To Firebase Successfully!!");
  response.end();
});

function gotData1(data) {
  var scores = data.val();
  var keys = Object.keys(scores);
  for (i = 0; i < keys.length; i++) {
    var k = keys[i];
    record1[i] = {
      name: scores[k].name,
      score: scores[k].score,
      index: i,
    };
  }
}

function gotData2(data) {
  var scores = data.val();
  var keys = Object.keys(scores);
  for (i = 0; i < keys.length; i++) {
    var k = keys[i];
    record2[i] = {
      name: scores[k].name,
      score: scores[k].score,
      index: i,
    };
  }
}
