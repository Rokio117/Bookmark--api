const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;

app.get("/api/*", (req, res) => {
  res.json({ ok: true });
});

//make sure when register you bcrypt the password before storing

module.exports = { app };
