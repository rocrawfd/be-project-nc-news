const {fetchEndpoints} = require("../models/get-endpoints-model")

exports.getEndpoints = (req, res, next) => {
    const endpoint = fetchEndpoints()
    const endpoints = JSON.parse(endpoint)
    res.status(200).send({endpoints})
}