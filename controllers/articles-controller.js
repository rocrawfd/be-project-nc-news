const { fetchArticleById, fetchArticles, updateArticle, insertArticle } = require("../models/articles-model");
const { checkExists } = require("../utils");

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
    
    
    exports.getArticles = (req, res, next) => {
      const {topic} = req.query
      const {sort_by} = req.query
      const {order} = req.query
      const {limit} = req.query
      const {p} = req.query
      let topicExists = false
      if(topic) { topicExists = checkExists('topics', 'slug', topic) }
      return Promise.all( [fetchArticles(topic, sort_by, order, limit, p), topicExists] )
      .then((promises) => {
        const articles = promises[0]
        res.status(200).send(articles)
      })
      .catch((err) => {
        next(err)
      })
    };


    exports.postArticle = (req, res, next) => {
      const article = req.body
      return insertArticle(article)
      .then((article) => {
        res.status(201).send({article})
      })
      .catch((err) => {
        next(err)
      })
    }