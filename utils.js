const db = require("./db/connection")
const format = require('pg-format')

exports.doesArticleExist = (articleId) => {
    return db.query(`SELECT * FROM articles WHERE article_id = $1`, [articleId])
    .then(({rows}) => {
        if(rows.length === 0){
            return Promise.reject({
            status: 404, msg: '404 - Not Found'
        })}
    })
}

exports.doesCommentExist = (commentId) => {
    return db.query(`SELECT * FROM comments WHERE comment_id = $1`, [commentId])
    .then(({rows}) => {
        if(rows.length === 0){
            return Promise.reject({
            status: 404, msg: '404 - Not Found'
        })}
    })
}

exports.doesTopicExist = (topic) => {
    return db.query(`SELECT * FROM topics WHERE slug = $1`, [topic])
    .then(({rows}) => {
        if(topic !== undefined){
            if(rows.length === 0){
                return Promise.reject({
                    status: 404,
                    msg: '404 - Not Found'
                })
            }
        }
    })
}

exports.checkExists = (table, column, value) => {
    const sqlString = format(`SELECT * FROM %I WHERE %I = $1`, table, column)
    return db.query(sqlString, [value])
    .then(({rows}) => {
        if(rows.length === 0){
            return Promise.reject({
                status: 404, msg: '404 - Not Found'
            })
        }
    })
}

   
exports.checkTopicExists = (topic) => {
    if(/\d/g.test(topic)){
        return Promise.reject({
            status: 400, msg: '400 - Bad Request'
        })
    }
    return db.query(`SELECT * FROM topics WHERE slug = $1`, [topic])
    .then(({rows}) => {
        if(rows.length === 0){
            return Promise.reject({
                status: 404, msg: '404 - Not Found'
            })
        }
    })
}