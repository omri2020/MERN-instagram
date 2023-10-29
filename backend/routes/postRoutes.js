const express = require("express");
const postController = require("../controllers/postController");
const authController = require("../controllers/authController")

const router = express.Router();

// Upload and delete photo
router.post('/upload-photo', authController.protect, postController.uploadPostPhoto);
router.delete('/delete-photo', authController.protect, postController.deletePostPhoto);

router.patch('/:postId/toggle-like', authController.protect, postController.toggleLikeStatus);

// CRUD operations
router.route("/").get().post(authController.protect, postController.createPost);
router.route("/:id").get().patch().delete();

module.exports = router;
