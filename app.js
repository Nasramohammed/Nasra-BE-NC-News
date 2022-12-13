// Responds with:

const express = require("express");
const app = express();
const {} = require("./db/controllers/error.controllers");
const { GetTopics } = require("./db/controllers/controllers");

app.get("/api/topics", GetTopics);


app.all("*", (req, res, next) => {
  res.status(404).send({ msg: "bad request sorry" });
});
app.use((err, req, res, next) => {
  console.log(err);
  res.sendStatus(500);
});

module.exports = app;




