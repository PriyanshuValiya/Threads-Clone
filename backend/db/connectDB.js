import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect("mongodb+srv://valiyapriyansukumar:priyansu2006@cluster0.mrbmo.mongodb.net/threads?retryWrites=true&w=majority&appName=Cluster0");
    console.log("MongoDB Connection Successfull !!");
  } catch (err) {
    console.error(`Error : ${err.message}`);
    process.exit(1);
  }
};

export default connectDB;
