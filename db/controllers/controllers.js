
const {
  fetchTopics,
  selectArticleById,
  fetchArticles,
  fetchArticalsByAricle_id,
  insertComment,
  updateArticle,
  fetchUsers,
  dropCommentById,
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


exports.selectCommentsByArticleId = (req, res, next) => {
    const { article_id } = req.params;
    const { sort_by } = req.query;
    fetchArticalsByAricle_id(article_id, sort_by)
      .then((comments) => {
        res.status(200).send({ comments });
      })
      .catch(next);
};

// post
exports.postComment = (req, res, next) => {
    // console.log(req.body,"****")
  const { article_id } = req.params;
    const { username, body } = req.body;
  insertComment(article_id,username,body)
      .then((comment) => {
      res.status(201).send({comment});
    })
    .catch(next);
};

// patch 
  
exports.patchArticle = (req, res, next) => {
  updateArticle(req.params.article_id, req.body,"****")
    .then((updatedArticle) => {
      res.status(200).send({ article: updatedArticle[0] });
    })
    .catch(next);
};

// Get users 
exports.getUsers = (req, res, next) => {
 fetchUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch(next);
};

// DELETE 
exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  dropCommentById(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};