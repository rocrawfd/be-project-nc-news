const express = require('express')
const app = express()
const {getEndpoints} = require("./controllers/get-endpoint-controller")
const {getTopics} = require("./controllers/topics-controller")
const {getArticleById} = require("./controllers/articles-controller")

// article 37 appears with \n, why?
app.get("/api", getEndpoints)

app.get("/api/topics", getTopics)

app.get("/api/articles/:article_id", getArticleById)


app.all('*', (req, res, next) => {
    res.status(404).send({msg: '404 - Not Found'})
})

app.use((err, req, res, next) => {
if(err.code === '22P02'){res.status(400).send({msg: '400 - Bad Request'})}
res.status(err.status).send({msg: err.msg})
})




module.exports = app