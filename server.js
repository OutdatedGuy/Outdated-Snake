const express = require("express");
const rateLimit = require("express-rate-limit");
const { initializeServerApp } = require("firebase/app");
const { getDatabase, ref, push } = require("firebase/database");

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

const firebaseApp = initializeServerApp(firebaseConfig, {});
const firebaseDB = getDatabase(firebaseApp);

const app = express();
app.set("trust proxy", 1);

const apiLimiter = rateLimit({
  windowMs: 2 * 60 * 1000,
  max: 2,
});

app.use(express.static("public", { maxAge: "30d" }));
app.use(express.json({ limit: "1kb" }));

app.use("/api", (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

function sanitizeName(raw) {
  if (typeof raw !== "string") return null;
  let name = raw.trim().slice(0, 15);
  if (!/^[a-zA-Z][a-zA-Z0-9._@+& -]*$/.test(name)) return null;
  name = name.replace(/([^a-zA-Z0-9])\1+/g, "$1");
  return name;
}

app.post("/api", apiLimiter, async (req, res) => {
  const name = sanitizeName(req.body?.name);
  const level = req.body?.level;
  const rawScore = req.body?.score;
  const check = req.body?.check;

  if (
    !name ||
    (level !== 0 && level !== 1) ||
    !Number.isInteger(rawScore) ||
    !Number.isInteger(check)
  ) {
    return res.status(400).json({ error: "Invalid payload" });
  }

  const score = rawScore - 1;
  if (score < 0 || score >= 1456 || score !== check) {
    return res.status(400).json({ error: "Score validation failed" });
  }

  const levelPath =
    level === 0
      ? "Outdated Game/Snake Game/Level 1"
      : "Outdated Game/Snake Game/Level 2";

  try {
    await push(ref(firebaseDB, levelPath), { name, score });
    return res.status(201).json({ ok: true });
  } catch (err) {
    console.error("Failed to write score to Firebase:", err);
    return res.status(500).json({ error: "Database write failed" });
  }
});

const port = process.env.PORT || 1412;
app.listen(port, () =>
  console.log(`Starting server at http://127.0.0.1:${port}`)
);
