const db = require("../db/connection");
const {checkExists} = require("../utils")

exports.fetchUsers = () => {
  return db.query(`SELECT * FROM users`).then(({ rows }) => {
    return rows;
  });
};

exports.fetchUserByUsername = (username) => {
  return checkExists("users", "username", username)
  .then(() => {
    return db.query("SELECT * FROM users WHERE username = $1", [username])
      .then(({ rows }) => {
        return rows[0];
      });
  });
};
