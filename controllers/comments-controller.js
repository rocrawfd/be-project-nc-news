const {fetchCommentsByArticleId, insertComment, removeComment } = require("../models/comments-model")
const { doesArticleExist, doesCommentExist } = require("../utils.js")

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

exports.deleteCommentById = (req, res, next) => {
    const commentId = req.params.comment_id
    doesCommentExist(commentId)
    .then(() => {
        return removeComment(commentId)
        .then(() => {
            res.status(204).send({msg:`Comment has been deleted`})
        })
    })
    .catch((err) => {
        next(err)
    })
}

