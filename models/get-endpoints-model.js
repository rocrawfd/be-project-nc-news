const fs = require("fs")

exports.fetchEndpoints = () => {
    const endpoints = fs.readFileSync(`${__dirname}/../endpoints.json`, 'utf-8')
    return endpoints
}