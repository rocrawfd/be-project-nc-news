const {fetchCommentsByArticleId, insertComment} = require("../models/comments-model")
const {doesArticleExist} = require("../utils.js")

exports.getCommentsByArticleId = (req, res, next) => {
    const articleId = req.params.article_id
    doesArticleExist(articleId)
    .then(() => {
        fetchCommentsByArticleId(articleId)
        .then((comments) => {
            return res.status(200).send({comments})
        })
    })
    .catch((err) => {
        next(err)
    })
}

exports.postComment = (req, res, next) => {
    const comment = req.body
    const articleId = req.params.article_id
    return insertComment(comment, articleId)
    .then(( comment ) => {
        res.status(201).send({comment})
    })
    .catch((err) => {
        next(err)
    })
}



