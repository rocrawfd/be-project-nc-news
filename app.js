const express = require('express')
const app = express()
const { handlePsqlErrors, handleCustomErrors, handleServerErrors } = require("./errors")
const {getEndpoints} = require("./controllers/get-endpoint-controller")
// article 37 appears with \n, why?
const articlesRoute = require("./routers/articles-router")
const topicsRouter = require("./routers/topics-router")
const commentsRouter = require("./routers/comments-router")
const usersRouter = require("./routers/users-router")

app.use(express.json())

app.get("/api", getEndpoints)
app.use('/api/articles', articlesRoute)
app.use('/api/topics', topicsRouter)
app.use('/api/comments', commentsRouter)
app.use('/api/users', usersRouter)
app.use(handleCustomErrors)
app.use(handlePsqlErrors)
app.use(handleServerErrors)
app.all('*', (req, res, next) => {
    res.status(404).send({msg: '404 - Not Found'})
})


module.exports = app