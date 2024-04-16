const express = require('express')
const app = express()
const {getEndpoints} = require("./controllers/get-endpoint-controller")
const {getTopics} = require("./controllers/topics-controller")
const {getArticleById, getArticles} = require("./controllers/articles-controller")
const {getCommentsByArticleId} = require("./controllers/comments-controller")

// article 37 appears with \n, why?
app.get("/api", getEndpoints)

app.get("/api/topics", getTopics)

app.get("/api/articles/:article_id", getArticleById)

app.get("/api/articles", getArticles)

app.get("/api/articles/:article_id/comments", getCommentsByArticleId)


app.all('*', (req, res, next) => {
    res.status(404).send({msg: '404 - Not Found'})
})

app.use((err, req, res, next) => {
if(err.code === '22P02'){res.status(400).send({msg: '400 - Bad Request'})}
console.log(err, 'app.js err')
res.status(err.status).send({msg: err.msg})
})




module.exports = app