import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJWT = async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            return res.status(401).json({ message: "Unauthorized Token" });
        }

        console.log("Tokeun: ",token);
        

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        console.log("Decode Token:",decodedToken.id);
        
        const user = await User.findById(decodedToken.id).select("-password -refreshToken");

        console.log("User:", user);
        

        if (!user) {
            return res.status(401).json({ message: "Invalid Access Token" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Internal Server Error:", error);
        return res.status(500).json({ message: error.message });
    }
};
