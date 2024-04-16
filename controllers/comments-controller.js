const {fetchCommentsByArticleId} = require("../models/comments-model")
const {doesArticleExist} = require("../utils.js")

exports.getCommentsByArticleId = (req, res, next) => {
    const articleId = req.params.article_id
    doesArticleExist(articleId)
    .then(() => {
        fetchCommentsByArticleId(articleId)
        .then((comments) => {
            console.log(comments)
            return res.status(200).send({comments})
        })
    })
    .catch((err) => {
        next(err)
    })
}



