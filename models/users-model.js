const db = require("../db/connection")

exports.fetchUsers = () => {
    console.log('fetching users')
    return db.query(`SELECT * FROM users`)
    .then(({rows}) => {
        return rows
    })
}