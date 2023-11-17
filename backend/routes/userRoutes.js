const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const notificationRoutes = require("./notificationRoutes");
const { disconnectUserSocket } = require("../socket");

const router = express.Router();

router.use("/notifications", notificationRoutes);

// Auth check
router.get("/auth-check", authController.authCheck);

// refresh access token
router.post("/refresh", authController.refreshAccessToken);

// authentication routes
router.post("/login", authController.login);
router.post("/signup", authController.signup);
router.get(
  "/logout",
  authController.protect,
  authController.logout(disconnectUserSocket),
);

router.post("/forgotPassword");
router.patch("/resetPassword/:token");

router.patch("/updateMyPassword");
router.patch(
  "/updateMe",
  authController.protect,
  userController.uploadUserPhoto,
  userController.updateMe,
);
router.get("/me", authController.protect, userController.getCurrentUser);

// get all user chats
router
  .route("/chats")
  .get(authController.protect, userController.getAllUserChats);

// get current user following list
router.get("/following", authController.protect, userController.getFollowing);

// get user feed posts (posts from people you follow along with your own posts)
router.get("/feed", authController.protect, userController.getFeed);

router.patch(
  "/follow/:username",
  authController.protect,
  userController.followUser,
);
router.patch(
  "/unfollow/:username",
  authController.protect,
  userController.unfollow,
);

// CRUD operations
router.get("/:username", userController.getUser);
router.route("/").get(userController.getAllUsers).post();
router.route("/:id").patch().delete();

module.exports = router;
