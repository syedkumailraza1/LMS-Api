import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
import express from "express";
import env from "dotenv"
const envs = env.config()
const app = express()
const port = process.env.PORT


const connectDB = async ()=>{
    try {
       const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
       
        console.log(`\n Database Connected Successfully!! DB Host ${connectionInstance.connection.host}`);
        
      
    } catch (error) {
        console.log("Error occur while connection DB: ",error);
        
    }
}

export { connectDB }