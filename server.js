const express = require("express");
const path = require("path");

const app = express();

app.use(express.static("public"));

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

app.get("/", (req, res) => {
  res.redirect("/index.html");
});
