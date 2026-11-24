import {
  initializeApp,
  getDatabase,
  ref,
  onValue,
  query,
  orderByChild,
  limitToLast,
} from "./vendor/firebase-rtdb.js";

const firebaseConfig = {
  apiKey: "AIzaSyDL85dxm47birbU_sLL8IgU4NDvUekcQyo",
  authDomain: "outdated-projects.firebaseapp.com",
  databaseURL: "https://outdated-projects.firebaseio.com",
  projectId: "outdated-projects",
  storageBucket: "outdated-projects.appspot.com",
  messagingSenderId: "601782104737",
  appId: "1:601782104737:web:25e4f6c15c45bc4fc1b6e0",
  measurementId: "G-DXJBPH3S4Y"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

function parseSnapshot(snapshot) {
  if (!snapshot.exists()) return [];
  const entries = [];
  let idx = 0;
  snapshot.forEach((child) => {
    entries.push({ ...child.val(), index: idx++ });
  });
  return entries;
}

function refreshActiveScreen() {
  if (typeof end === "undefined") return;
  if (end === 1 && typeof endScreen === "function") endScreen();
  else if (end === 4 && typeof highscoreScreen === "function") highscoreScreen();
}

const lvl1Query = query(
  ref(db, "Outdated Game/Snake Game/Level 1"),
  orderByChild("score"),
  limitToLast(30)
);

const lvl2Query = query(
  ref(db, "Outdated Game/Snake Game/Level 2"),
  orderByChild("score"),
  limitToLast(30)
);

onValue(lvl1Query, (snapshot) => {
  record1 = parseSnapshot(snapshot);
  refreshActiveScreen();
});

onValue(lvl2Query, (snapshot) => {
  record2 = parseSnapshot(snapshot);
  refreshActiveScreen();
});
