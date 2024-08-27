import express from "express";
import { getUserProfile, signUpUser, loginUser, logoutUser, followUnFollowUser, updateUser, getSuggestedUsers } from "../controllers/userController.js";
import isLoggedIn from "../middlewares/isLoggedIn.js";

const router = express.Router();

router.get("/profile/:query", getUserProfile);
router.get("/suggested", isLoggedIn, getSuggestedUsers);
router.post("/signup", signUpUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/follow/:id", isLoggedIn, followUnFollowUser);
router.put("/update/:id", isLoggedIn, updateUser);

export default router;
