const express = require('express')
const app = express()
const {getEndpoints} = require("./controllers/get-endpoint-controller")
const {getTopics} = require("./controllers/topics-controller")


app.get("/api", getEndpoints)

app.get("/api/topics", getTopics)


app.all('*', (req, res, next) => {
    res.status(400).send({msg: '400 - Bad Request'})
})


// app.listen(9091, () => {
//     console.log('listening on 9091')
// })

module.exports = app