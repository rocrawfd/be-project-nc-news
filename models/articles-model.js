const db = require("../db/connection");

exports.fetchArticleById = (articleId) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1;`, [articleId])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "404 - Not Found",
        });
      }
      return rows[0];
    });
};

exports.fetchArticles = () => {
  return db
    .query(
      `SELECT articles.article_id, COUNT(*) FROM articles JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id`
    )
    .then(({ rows }) => {
      const commentCounts = rows;
      const articles = db.query(
        `SELECT author, title, article_id, topic, created_at, votes, article_img_url FROM articles ORDER BY created_at DESC`
      );
      return Promise.all([articles, commentCounts]);
    })
    .then((promises) => {
      const articles = promises[0].rows;
      const commentCount = promises[1];
      articles.forEach((article) => {
        article.comment_count = 0;
        commentCount.forEach((count) => {
          if (article.article_id === count.article_id) {
            article.comment_count = Number(count.count);
          }
        });
      });
      return articles;
    });
};
