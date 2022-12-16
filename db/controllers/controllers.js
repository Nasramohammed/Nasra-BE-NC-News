
const {
  fetchTopics,
  selectArticleById,
  fetchArticles,
  fetchArticalsByAricle_id,
} = require("../models/models.js");





exports.GetTopics = (req, res, next) => {
    fetchTopics()
        .then((topics) => {
            res.status(200).send({ topics });
        })
        .catch(next)
}


exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params;
    selectArticleById(article_id).then((article) => {
        res.status(200).send({ article })
    })
        .catch(next)
}

exports.GetArticles = (req, res, next) => {
  fetchArticles()
    .then((articles) => {
      res.status(200).send({ articles});
    })
    .catch(next);
};
// Please make sure, you only send an empty array of comments when the article_id exists in the database. For this you would need to check both.

exports.selectCommentsByArticleId = (req, res, next) => {
    const { article_id } = req.params;
    const { sort_by } = req.query;
    fetchArticalsByAricle_id(article_id, sort_by)
      .then((comments) => {
        res.status(200).send({ comments });
      })
      .catch(next);
};

