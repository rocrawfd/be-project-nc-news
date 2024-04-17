const db = require("../db/connection");
const { doesArticleExist } = require("../utils");

exports.fetchArticleById = (articleId) => {
  return db.query(`SELECT * FROM articles WHERE article_id = $1;`, [articleId])
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.fetchArticles = () => {
  return db.query(`
  SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, COUNT(comment_id)::INT AS comment_count
  FROM articles 
  LEFT JOIN comments 
  ON comments.article_id = articles.article_id 
  GROUP BY articles.article_id
  ORDER BY created_at DESC;`)
  .then(({rows}) => {
    console.log(rows, 'ROWS!!!!')
    return rows
  })
};

exports.updateArticle = (votesInc, articleId) => {
  return db.query(`UPDATE articles SET votes=VOTES + $1 WHERE article_id=$2 RETURNING *`, [votesInc, articleId])
  .then(({rows}) => {
    return rows[0]
  })
}
