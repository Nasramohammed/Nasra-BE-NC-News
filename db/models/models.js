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