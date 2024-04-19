const { fetchArticleById, fetchArticles, updateArticle } = require("../models/articles-model");
const { checkTopicExists, checkExists } = require("../utils");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
      return fetchArticleById(article_id)
      .then((article) => {
        res.status(200).send({ article });
      })
    .catch((err) => {
      next(err);
    });
};


exports.getArticles = (req, res, next) => {
  const {topic} = req.query
  let doesItExist = false
  if(topic){
    doesItExist = checkExists('topics', 'slug', topic)
  }
  return Promise.all( [fetchArticles(topic), doesItExist] )
  .then((promises) => {
    const articles = promises[0]
    res.status(200).send({articles})
  })
  .catch((err) => {
    next(err)
  })
};


exports.patchArticle = (req, res, next) => {
  const {inc_votes} = req.body
  const {article_id} = req.params;
    return updateArticle(inc_votes, article_id)
      .then((article) => {
        res.status(200).send({ article });
      })
    .catch((err) => {
      next(err);
    });
};
