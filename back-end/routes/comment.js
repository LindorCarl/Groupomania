const express = require("express");

const router = express.Router();
const multer = require("../middleware/multer")

const authentification = require("../middleware/authentification");
const comment = require("../controllers/comment");

router.post("/", authentification, multer, comment.commentController);
router.get("/:id", authentification, comment.getCommentController);
router.put("/:id", authentification, comment.updateCommentController);
router.delete("/:id", authentification, comment.deleteCommentController);

module.exports = router;