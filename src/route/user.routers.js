import { Router } from "express";
import { LoginUser, LogoutUser, RegisterUser } from "../controller/user.controller.js";
import { verifyJWT } from "../middleware/verifyToken.middleware.js";
const router = Router();

// Route to handle book posting with file upload
router.post("/register", RegisterUser);
router.post("/login", LoginUser);
router.post("/logout",verifyJWT, LogoutUser);

export default router;