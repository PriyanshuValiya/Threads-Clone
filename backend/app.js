import express from "express";
import path from "path";
import dotenv from "dotenv";
import connectDB from "./db/connectDB.js";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";
import { app, server } from "./socket/socket.js";

import userRoutes from "./routes/UserRoutes.js";
import postRoutes from "./routes/PostRoutes.js";
import messageRoutes from "./routes/MessageRoutes.js";

dotenv.config();
connectDB();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

cloudinary.config({
  cloud_name: "dmccunmzi",
  api_key: "458644426168269",
  api_secret: "5P32bfD5O5InlQNo4C7FJvUAmU0",
});

app.use(express.json({ limit: "50mb" })); // To parse JSON data in the req.body
app.use(express.urlencoded({ limit: "50mb", extended: true })); // To parse form data in the req.body
app.use(cookieParser());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/messages", messageRoutes);

// For Connect Frontend and Backend at same port localhost:5000
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  // react app
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
