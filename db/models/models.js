const db = require("../connection.js");



exports.fetchTopics = () => {
   
    return db.query('SELECT * FROM topics;').then((result) => {
      return result.rows;
    });
}


exports.selectArticleById = (article_id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1;", [article_id])
    .then((result) => {
      if (result.rows.length > 0) {
        return result.rows[0];
      } else {
        return Promise.reject({ status: 404, msg: "bad request sorry" });
      } 
    })
};


exports.fetchArticles = () => {
  return db
    .query(
      `SELECT articles.article_id, articles.author, articles.created_at, articles.title, articles.topic, articles.votes, 
      COUNT(comments.article_id) AS comment_count 
      FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC
    ;` 
  )
    
    .then((result) => {
      return result.rows;
    });
};

exports.fetchArticalsByAricle_id = (article_id, sort_by = "created_at") => {
  const comments =  db
    .query(
      `SELECT * FROM comments WHERE article_id = $1
      ORDER BY ${sort_by} DESC`,
      [article_id]
  )
      const articles = db
        .query(
          `SELECT article_id FROM articles WHERE article_id = $1
      ORDER BY ${sort_by} DESC`,
          [article_id]
      )
      return Promise.all([comments,articles])
        .then(([commentResults,articleResults]) => {
          if (articleResults.rows.length > 0 && commentResults.rows.length >= 0) {
            return commentResults.rows;
          } else {
            return Promise.reject({ status: 404, msg: "bad request sorry" });
          }
        });
};

// post

exports.insertComment = (article_id, username, body) => {
  // console.log(article_id, username, body);
  return db
    .query(
      `INSERT  INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING *;`,
      [article_id, username, body]
    )
    .then(({ rows }) => rows[0]);
};

// patch 
exports.updateArticle = (articleID, body) => {
  console.log(articleID,body,"model")
  const { inc_votes } = body;
  console.log( inc_votes,"type of inc-votes", typeof inc_votes)
 return db
   .query(
     `UPDATE articles SET 
  votes = votes + $1 WHERE article_id = $2 RETURNING *;`,
     [inc_votes, articleID]
   )
   .then((result) => {
     return result.rows;
   });
 
};

// Get Users 
exports.fetchUsers = () => {
  return db
    .query(
      `SELECT * From users`
    )

    .then((result) => {
      return result.rows;
    });
};

// DELETE COMMENT 
exports.dropCommentById = (comment_Id) => {
  return db
    .query("DELETE FROM comments WHERE comment_id = $1 RETURNING *;", [
      comment_Id,
    ])
    .then((result) => {
      if (result.rowCount === 0) {
        return Promise.reject({
          status: 404,
          msg: `bad request sorry`,
        });
      }
    });
};