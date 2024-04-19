const {fetchCommentsByArticleId, insertComment, removeComment, updateCommentById } = require("../models/comments-model")
const { doesArticleExist, doesCommentExist } = require("../utils.js")

exports.getCommentsByArticleId = (req, res, next) => {
    const {article_id} = req.params
    doesArticleExist(article_id)
    .then(() => {
        fetchCommentsByArticleId(article_id)
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
    const {article_id} = req.params
    return insertComment(comment, article_id)
    .then(( comment ) => {
        res.status(201).send({comment})
    })
    .catch((err) => {
        next(err)
    })
}

exports.deleteCommentById = (req, res, next) => {
    const {comment_id} = req.params
    doesCommentExist(comment_id)
    .then(() => {
        return removeComment(comment_id)
        .then(() => {
            res.status(204).send({msg:`Comment has been deleted`})
        })
    })
    .catch((err) => {
        next(err)
    })
}

exports.patchCommentById = (req, res, next) => {
    const {inc_votes} = req.body
    const {comment_id} = req.params
    return updateCommentById(inc_votes, comment_id)
    .then((comment) => {
        res.status(200).send({comment})
    })
    .catch((err) => {
        next(err)
    })
}

