const db = require("../db/connection");
const { checkExists } = require("../utils");

exports.fetchArticleById = (articleId) => {
  return checkExists('articles', 'article_id', articleId)
  .then(() => {
    return db.query(`SELECT articles.*, COUNT(comment_id)::INT AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id;`, [articleId])
      .then(({ rows }) => {
        return rows[0];
      });
  })
};


exports.fetchArticles = (topic) => {
    const queries = []
      let sqlString = `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, COUNT(comment_id)::INT AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id`
    if(topic){
      sqlString += ` WHERE topic = $1`
      queries.push(topic)
    }
    sqlString += ` GROUP BY articles.article_id ORDER BY created_at DESC;`
    return db.query(sqlString, queries)
      .then(({rows}) => {
        return rows
      })
  };


  exports.updateArticle = (votesInc, articleId) => {
return checkExists('articles', 'article_id', articleId)
.then(() => {
  return db.query(`UPDATE articles SET votes=VOTES + $1 WHERE article_id=$2 RETURNING *`, [votesInc, articleId])
  .then(({rows}) => {
    return rows[0]
  })
})

}
