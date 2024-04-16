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
  return db.query(`SELECT article_id FROM articles`)
    .then(({ rows }) => {
      const ids = rows.map((row) => {
        return row.article_id;
      });
      const count = [];
      ids.forEach((id) => {
        count.push(
          db.query(`SELECT COUNT(*) FROM comments WHERE article_id = ${id}`)
        );
      });
      return Promise.all([Promise.all(count), ids]);
    })
    .then((promises) => {
      const countRows = promises[0].map((promise) => {
        return promise.rows[0].count;
      });
      return Promise.all([countRows, promises[1]]);
    })
    .then((promises) => {
      const commentCounts = promises[0].flat();
      const ids = promises[1];
      const query = db.query(`SELECT article_id, title, topic, author, created_at, votes, article_img_url FROM articles ORDER BY created_at DESC`);
      return Promise.all([query, ids, commentCounts]).then((promises) => {
        const articles = promises[0].rows;
        const ids = promises[1];
        const commentCount = promises[2];
        ids.forEach((id, idIndex) => {
          articles.forEach((article) => {
            if (article.article_id === id) {
              article.comment_count = Number(commentCount[idIndex]);
            }
          });
        });
        return articles;
      });
    });
};
