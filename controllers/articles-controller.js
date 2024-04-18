const {
  fetchArticleById,
  fetchArticles,
  updateArticle,
} = require("../models/articles-model");
const { checkTopicExists } = require("../utils");

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
  if(topic === undefined){
    return fetchArticles(topic)
    .then((articles) => {
      res.status(200).send({ articles });
    })
  .catch((err) => {
    next(err)
  })
  }else{
    return checkTopicExists(topic)
    .then(() => {
      return fetchArticles(topic)
      .then((articles) => {
        res.status(200).send({articles})
      })
    })
    .catch((err) => {
      next(err)
    })
  }
};

exports.patchArticle = (req, res, next) => {
  const votes = req.body.inc_votes;
  const articleId = req.params.article_id;
    return updateArticle(votes, articleId)
      .then((article) => {
        res.status(200).send({ article });
      })
    .catch((err) => {
      next(err);
    });
};
