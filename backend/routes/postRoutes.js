const express = require("express");
const postController = require("../controllers/postController");
const authController = require("../controllers/authController")

const router = express.Router();

// Upload and delete photo when creating a post
router.post('/upload-photo', authController.protect, postController.uploadPostPhoto);
router.delete('/delete-photo', authController.protect, postController.deletePostPhoto);

// Toggle post's like status
router.patch('/:postId/toggle-like', authController.protect, postController.toggleLikeStatus);

// add comment to post
router.post('/:postId/comment', authController.protect, postController.addComment);

// CRUD operations
router.route("/").get().post(authController.protect, postController.createPost);
router.route("/:id").get(authController.protect, postController.getPost).patch().delete();

module.exports = router;
