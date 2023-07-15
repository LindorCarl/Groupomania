const express = require("express");

const router = express.Router();
const multer = require("../middleware/multer")

//Fichiers du "controller".
const likePost = require("../controllers/likePost");
const authentification = require("../middleware/authentification");
const posts = require("../controllers/posts");

router.post("/", authentification, multer, posts.postController);
router.get("/", authentification, posts.getPostController);
router.put("/:id", authentification, posts.updatePostController);
router.delete("/:id", authentification, posts.deletePostController);
router.get("/like", authentification, likePost.getLikePost)
router.post("/like/:id", authentification, likePost.updateLikePost)

module.exports = router;  