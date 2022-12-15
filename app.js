// Responds with:

const express = require("express");
const app = express();
const {} = require("./db/controllers/error.controllers");
const { GetTopics, getArticleById } = require("./db/controllers/controllers");

app.get("/api/topics", GetTopics);
app.get("/api/articles/:article_id", getArticleById);

app.use((err, req, res, next) => {
  if (err.code === '22P02') {
    res.status(400).send({msg:'Bad Request' })
  } else {
    next(err);
  }
})




app.all("*", (req, res, next) => {
  res.status(404).send({ msg: "bad request sorry" })
});

app.use((err, req, res, next) => {
  if (err.msg !== undefined) {
    res.status(err.status).send({msg:err.msg})
  } else {
    next(err)
  }
}) 
  

app.use((err, req, res, next) => {
  console.log(err);
  res.sendStatus(500);
});

module.exports = app;




