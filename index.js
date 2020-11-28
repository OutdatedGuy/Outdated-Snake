const express = require('express');
const { response, request } = require('express');
const app = express();
require('dotenv').config();
const firebase = require('firebase');

var ref;
var times = 0;
record1 = [];
record2 = [];


var firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: "outdated-projects.firebaseapp.com",
    databaseURL: "https://outdated-projects.firebaseio.com",
    projectId: "outdated-projects",
    storageBucket: "outdated-projects.appspot.com",
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID,
    measurementId: process.env.MEASUREMENT_ID
};
firebase.initializeApp(firebaseConfig);
var database = firebase.database();
ref = database.ref('Outdated Game/Snake Game/Level 1');
ref.on('value',gotData1);
ref = database.ref('Outdated Game/Snake Game/Level 2');
ref.on('value',gotData2);

const port = process.env.PORT || 1412;
app.listen(port, () => console.log(`Starting server at ${port}`));

app.use(express.static('public'));
app.use(express.json({limit: '200b'}));

app.post('/getTheScore', (request, response) => {
    times = 0;
    record1.length = 0;
    record2.length = 0;
    // console.log("I Got A Request To Send Data!!");
    ref = database.ref('Outdated Game/Snake Game/Level 1');
    ref.on('value',gotData1);
    
    ref = database.ref('Outdated Game/Snake Game/Level 2');
    ref.on('value',gotData2);
    
    response.json({
        lvl1: record1,
        lvl2: record2 
    });
});

app.post('/api', (request, response) => {
    if(times == 1) {
        return;
    }
    console.log("I Got A Request To Add Data!!");
    var data = {
        name: request.body.name,
        score: request.body.score
    };

    if (request.body.level == 0) {
        ref = database.ref('Outdated Game/Snake Game/Level 1');
    } else if (request.body.level == 1) {
        ref = database.ref('Outdated Game/Snake Game/Level 2');
    } else {
        console.log("Data Adding Failed :(")
        return;
    }
    ref.off();
    ref.push(data);
    console.log("Data Added To Firebase Successfully!!");
    times = 1;
    response.end();
});

function gotData1(data) {
	var scores = data.val();
	var keys = Object.keys(scores);
	for (i = 0; i < keys.length; i++) {
        var k = keys[i];
        record1[i] = {
            name: scores[k].name,
            score: scores[k].score
        }
    }
}

function gotData2(data) {
	var scores = data.val();
	var keys = Object.keys(scores);
	for (i = 0; i < keys.length; i++) {
		var k = keys[i];
        record2[i]={
            name: scores[k].name,
            score: scores[k].score
        }
	}
}

