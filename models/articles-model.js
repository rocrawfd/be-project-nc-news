const db = require("../db/connection");
const { checkExists } = require("../utils");

exports.fetchArticleById = (articleId) => {
  return checkExists("articles", "article_id", articleId).then(() => {
    return db
      .query(
        `SELECT articles.*, COUNT(comment_id)::INT AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id;`,
        [articleId]
      )
      .then(({ rows }) => {
        return rows[0];
      });
  });
};


exports.updateArticle = (votesInc, articleId) => {
  return db.query(`UPDATE articles SET votes=VOTES + $1 WHERE article_id=$2 RETURNING *`, [votesInc, articleId])
  .then(({ rows }) => {
    if(rows.length === 0){
      return Promise.reject({
        status: 404, msg: '404 - Not Found'
      })
    }
    return rows[0];
  });
};


exports.fetchArticles = (topic, sortBy='created_at', order='desc') => {
  const queries = [];
  const validSortBys = ['article_id', 'title', 'topic', 'author', 'created_at', 'votes', 'article_img_url', 'comment_count']
  const validOrders = ['asc', 'desc', 'ASC', 'DESC']

  let sqlString = `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, COUNT(comment_id)::INT AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id`;
  if (topic) {
    sqlString += ` WHERE topic = $1`;
    queries.push(topic);
  }

  if(!validSortBys.includes(sortBy)){return Promise.reject({status: 404, msg: '404 - Not Found'})}
  if(!validOrders.includes(order)){return Promise.reject({status: 404, msg: '404 - Not Found'})}

  sqlString += ` GROUP BY articles.article_id ORDER BY ${sortBy} ${order};`;
  return db.query(sqlString, queries)
  .then(( {rows} ) => {
    return rows;
  });
};