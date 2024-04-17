const {
  fetchArticleById,
  fetchArticles,
  updateArticle,
} = require("../models/articles-model");
const { doesArticleExist } = require("../utils");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  doesArticleExist(article_id)
    .then(() => {
      return fetchArticleById(article_id).then((article) => {
        res.status(200).send({ article });
      });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticles = (req, res, next) => {
  const {topic} = req.query
  return fetchArticles(topic)
  .then((articles) => {
    res.status(200).send({ articles });
  });
};

exports.patchArticle = (req, res, next) => {
  const votes = req.body.inc_votes;
  const articleId = req.params.article_id;
  doesArticleExist(articleId)
  .then(() => {
    return updateArticle(votes, articleId)
      .then((article) => {
        res.status(200).send({ article });
      })
  })
    .catch((err) => {
      next(err);
    });
};
