const { fetchTopics, selectArticleById } = require("../models/models.js");


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
};