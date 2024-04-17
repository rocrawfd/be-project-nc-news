const db = require("../db/connection")

exports.fetchCommentsByArticleId = (articleId) => {
    return db.query(`SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC`, [articleId])
    .then(( {rows} ) => {
        return rows
    })
}

exports.insertComment = (newComment, articleId) => {
    return db.query(`INSERT INTO comments (body, article_id, author) VALUES ($1, $2, $3) RETURNING *`, [newComment.body, articleId, newComment.username])
    .then(( {rows} ) => {
        return rows[0]
    })
}

exports.removeComment = (commentId) => {
    return db.query(`DELETE FROM comments WHERE comment_id=$1`, [commentId])
}