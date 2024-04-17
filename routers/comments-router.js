const express = require("express")
const router = express.Router()
const { deleteCommentById } = require("../controllers/comments-controller")

router.delete("/:comment_id", deleteCommentById)

module.exports = router