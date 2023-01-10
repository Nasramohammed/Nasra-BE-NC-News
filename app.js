// Responds with:

const express = require("express");
const app = express();
const {} = require("./db/controllers/error.controllers");
const {
  GetTopics,
  getArticleById,
  GetArticles,
  selectCommentsByArticleId,
  postComment,
  patchArticle,
  getUsers,
  deleteCommentById,
} = require("./db/controllers/controllers");
const cors = require("cors");

app.use(express.json())

app.get('/api/topics', GetTopics);
app.get('/api/articles/:article_id', getArticleById);
app.get('/api/articles', GetArticles)
app.get("/api/articles/:article_id/comments", selectCommentsByArticleId);
app.get("/api/users", getUsers);

app.post("/api/articles/:article_id/comments", postComment);
app.patch("/api/articles/:article_id", patchArticle);
app.delete("/api/comments/:comment_id", deleteCommentById);

app.use(cors());

app.use((err, req, res, next) => {
  if (
    err.code === "22P02" ||
    err.code === "42703" ||
    err.code === "23502" 
   ) {
    res.status(400).send({ msg: "Bad Request" });
  } else if (err.code === "23503") {
    res.status(404).send({ msg: "bad request sorry" });
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




