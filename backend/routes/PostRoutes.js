import express from "express";
import isLoggedIn from "../middlewares/isLoggedIn.js";
import { createPost, getPost, deletePost, likeUnlikePost, replyToPost, getFeedPosts, getUserPosts } from "../controllers/postController.js";

const router = express.Router();

router.get("/feed", isLoggedIn, getFeedPosts);
router.get("/:id", getPost);
router.get("/user/:username", getUserPosts);
router.post("/create", isLoggedIn, createPost);
router.delete("/:id", isLoggedIn, deletePost);
router.put("/like/:id", isLoggedIn, likeUnlikePost);
router.put("/reply/:id", isLoggedIn, replyToPost);

export default router;