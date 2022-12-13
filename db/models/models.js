const db = require("../connection.js");



exports.fetchTopics = () => {
   
    return db.query('SELECT * FROM topics;').then((result) => {
      return result.rows;
    });
}


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
