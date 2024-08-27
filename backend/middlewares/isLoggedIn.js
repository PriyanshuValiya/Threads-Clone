import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const isLoggedIn = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized User" });
    }

    const decoded = jwt.verify(token, "jwtthread");
    const user = await User.findById(decoded.userId).select("-password");
    req.user = user;
    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log("User not found !!");
  }
};

export default isLoggedIn;
