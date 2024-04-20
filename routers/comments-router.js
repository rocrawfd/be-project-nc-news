const express = require("express")
const router = express.Router()
const { deleteCommentById, patchCommentById, postArticle } = require("../controllers/comments-controller")

router.patch("/:comment_id", patchCommentById)

router.delete("/:comment_id", deleteCommentById)


module.exports = router