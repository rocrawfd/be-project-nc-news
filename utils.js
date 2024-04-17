const db = require("./db/connection")

exports.doesArticleExist = (articleId) => {
    return db.query(`SELECT * FROM articles WHERE article_id = $1`, [articleId])
    .then(({rows}) => {
        if(rows.length === 0){
            return Promise.reject({
            status: 404, msg: '404 - Article Not Found'
        })}
    })
}

exports.doesCommentExist = (commentId) => {
    return db.query(`SELECT * FROM comments WHERE comment_id = $1`, [commentId])
    .then(({rows}) => {
        if(rows.length === 0){
            return Promise.reject({
            status: 404, msg: '404 - Comment Not Found'
        })}
    })
}
