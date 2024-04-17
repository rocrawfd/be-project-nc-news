const express = require('express')
const app = express()
const {getEndpoints} = require("./controllers/get-endpoint-controller")

// article 37 appears with \n, why?
const articlesRoute = require("./routers/articles-router")
const topicsRouter = require("./routers/topics-router")

app.use(express.json())

app.use('/api/articles', articlesRoute)
app.use('/api/topics', topicsRouter)

app.get("/api", getEndpoints)

app.all('*', (req, res, next) => {
    res.status(404).send({msg: '404 - Not Found'})
})

app.use((err, req, res, next) => {
if(err.code === '22P02' || err.code === '23502'){res.status(400).send({msg: '400 - Bad Request'})}
if(err.code === '23503'){res.status(404).send({msg: '404 - Not Found'})}
res.status(err.status).send({msg: err.msg})
})

module.exports = app