const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const express = require("express");

const app = express();
const port = process.env.PORT || 3000;

const jwtSecret = "ebanitech.com";

app.use(bodyParser.json());

function verifyToken(req, res, next) {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).json({ error: "No token provided" });
  }

  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Failed to authenticate token" });
    }

    req.user = decoded;
    next();
  });
}

app.post("/add", verifyToken, (req, res) => {
  const { num1, num2 } = req.body;

  if (typeof num1 !== "number" || typeof num2 !== "number") {
    return res
      .status(400)
      .json({ error: "Invalid input. Both inputs must be numbers." });
  }

  const result = num1 + num2;
  return res.json({ result });
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === "Rehaman" && password === "Rehaman") {
    const token = jwt.sign({ username }, jwtSecret, { expiresIn: "1h" });
    res.json({ token });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
