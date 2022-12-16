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
  return db
    .query(
      `SELECT * FROM comments WHERE article_id = $1
      ORDER BY ${sort_by} DESC`,
      [article_id]
)
    .then((results) => {
      return results.rows;
    });
};


