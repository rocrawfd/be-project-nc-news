const express = require("express")
const router = express.Router()
const { getArticleById, getArticles, patchArticle, postArticle } = require("../controllers/articles-controller")
const { getCommentsByArticleId, postComment } = require("../controllers/comments-controller")

router.get("/:article_id", getArticleById)

router.get("/", getArticles)

router.get("/:article_id/comments", getCommentsByArticleId)

router.post("/:article_id/comments", postComment)

router.patch("/:article_id", patchArticle)

router.post("/", postArticle)

module.exports = router