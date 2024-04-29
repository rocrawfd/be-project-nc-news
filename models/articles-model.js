const db = require("../db/connection");
const { checkExists } = require("../utils");

exports.fetchArticleById = (articleId) => {
  return checkExists("articles", "article_id", articleId)
  .then(() => {
    return db.query(`SELECT articles.*, COUNT(comment_id)::INT AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id;`, [articleId])
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


exports.fetchArticles = (topic, sortBy='created_at', order='desc', limit, page) => {
  const queries = [];
  const validSortBys = ['article_id', 'title', 'topic', 'author', 'created_at', 'votes', 'article_img_url', 'comment_count']
  const validOrders = ['asc', 'desc', 'ASC', 'DESC']

  let sqlString = `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, COUNT(comment_id)::INT AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id`;
  
  let countQuery = `SELECT COUNT(*)::INT FROM articles` 
  const countArr = []
  
  if (topic) {
    sqlString += ` WHERE topic = $1`;
    queries.push(topic);
    countArr.push(topic)
    countQuery += ` WHERE topic = $1`
  }

  if(!validSortBys.includes(sortBy)){return Promise.reject({status: 404, msg: '404 - Not Found'})}
  if(!validOrders.includes(order)){return Promise.reject({status: 404, msg: '404 - Not Found'})}

  sqlString += ` GROUP BY articles.article_id ORDER BY ${sortBy} ${order}`;
  if(limit){
    sqlString += ` LIMIT ${limit}`
  }
  
  if(page && limit){
    const offset = (page*limit)-limit
    sqlString += ` OFFSET ${offset}`
  }else if(page && !limit){
    const offset = (page*10)-10
    sqlString += ` LIMIT 10 OFFSET ${offset}`
  }


  return Promise.all([db.query(sqlString, queries), db.query(countQuery, countArr)])
  .then(( promises ) => {
    const {rows} = promises[0]
    const count = promises[1].rows[0].count
    if(page>1 && rows.length === 0){return Promise.reject({status: 404, msg: '404 - Not Found'})}
    return {total_count: count, articles: rows};
  });
};


exports.insertArticle = (article) => {
  return db.query(`
  INSERT INTO articles (title, author, topic, body, article_img_url) VALUES ($1, $2, $3, $4, $5) RETURNING *`, [article.title, article.author, article.topic, article.body, article.article_img_url])
  .then(({rows}) => {
    const articleId = rows[0].article_id
    return db.query(`SELECT articles.*, COUNT(comment_id)::INT AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id`, [articleId])
    .then(({rows}) => {
      return rows[0]
    })
  })
}