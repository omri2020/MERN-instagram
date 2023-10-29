const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

const router = express.Router();

// Auth check
router.get("/auth-check", authController.authCheck);

// authentication routes
router.post("/login", authController.login);
router.post("/signup", authController.signup);
router.get("/logout", authController.protect, authController.logout);

router.post("/forgotPassword");
router.patch("/resetPassword/:token");

router.patch("/updateMyPassword");
router.patch("/updateMe", authController.protect, userController.uploadUserPhoto, userController.updateMe);

// get user feed posts (posts from people you follow along with your own posts)
router.get("/feed", authController.protect, userController.getFeed);

router.patch("/follow/:username", authController.protect, userController.followUser);
router.patch("/unfollow/:username", authController.protect, userController.unfollow);

// CRUD operations
router.get("/:username", userController.getUser);
router.route("/").get(userController.getAllUsers).post();
router.route("/:id").patch().delete();

module.exports = router;
