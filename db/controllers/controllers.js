
const { fetchTopics, selectArticleById,fetchArticles } = require("../models/models.js");





exports.GetTopics = (req, res, next) => {
    fetchTopics()
        .then((topics) => {
            res.status(200).send({ topics });
        })
        .catch(next)
}


exports.getArticleById = (req, res,next) => {
const { article_id } = req.params;
    selectArticleById(article_id).then((article) => {
    res.status(200).send({ article })
    })
        .catch(next)


exports.GetArticles = (req, res, next) => {
  fetchArticles()
    .then((articles) => {
      res.status(200).send({ articles});
    })
    .catch(next);

};