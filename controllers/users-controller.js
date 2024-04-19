const { fetchUsers, fetchUserByUsername } = require("../models/users-model")

exports.getUsers = (req, res, next) => {
    return fetchUsers()
    .then((users) => {
        res.status(200).send({users})
    })
}

exports.getUserByUsername = (req, res, next) => {
    const {username} = req.params
    return fetchUserByUsername(username)
    .then((user) => {
        res.status(200).send({user})
    })
    .catch((err) => {
        console.log(err)
        next(err)
    })
}