import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"; // Ensure jwt is imported

const options = {
    httpOnly: true,
    secure: true,
    sameSite: 'Strict', // Added for cookie security
};

const generateTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = jwt.sign({ id: userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY });
        const refreshToken = jwt.sign({ id: userId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRY });

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        console.log("Error While Generating Tokens: ", error);
        throw new Error("Token Generation Failed"); // Explicitly throw an error to catch it later
    }
};

const RegisterUser = async (req, res) => {
    try {
        const { fullname, email, password } = req.body;
        console.log(req.body);

        if (!fullname) return res.status(400).json({ error: "FullName is Required" });
        if (!email) return res.status(400).json({ error: "Email is Required" });
        if (!password) return res.status(400).json({ error: "Password is Required" });

        const userExist = await User.findOne({ email });
        if (userExist) return res.status(400).json({ error: "User Already Exist" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ fullname, email, password: hashedPassword });
        await newUser.save();

        return res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.log("Error while registering user: ", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

const LoginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email) return res.status(400).json({ error: "Email is Required" });
        if (!password) return res.status(400).json({ error: "Password is Required" });

        const userExist = await User.findOne({ email });
        if (!userExist) return res.status(400).json({ error: "User Not Found" });

        const isPasswordCorrect = await bcrypt.compare(password, userExist.password);
        if (!isPasswordCorrect) return res.status(400).json({ error: "Invalid Password" });

        const { accessToken, refreshToken } = await generateTokens(userExist._id);
        console.log("Tokens generated successfully!");

        const loggedUser = await User.findById(userExist._id).select("-password -refreshToken");
        if (!loggedUser) return res.status(400).json({ error: "User Not Found" });

        console.log("User Successfully Logged In!");

        return res.status(200)
            .cookie('accessToken', accessToken, options)
            .cookie('refreshToken', refreshToken, options)
            .json({ message: 'User logged in successfully', user: loggedUser, accessToken, refreshToken });
    } catch (error) {
        console.log("Error while Login: ", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

const LogoutUser = async (req,res) => {
    try {
        //remove refresh token from users document
        await User.findByIdAndUpdate(
            req.user._id,
            {$set: {refreshToken: undefined}},
            {new: true}
        )

        //clear all cookies
        console.log("Logged Out Successfully!");
        
        return res.status(200)
        .clearCookie('accessToken',options)
        .clearCookie('refreshToken',options)
        .json({message: "Logged Out Successfully!"})
    } catch (error) {
        console.log("error while logout: ",error)
    }
}


export { RegisterUser, LoginUser, LogoutUser};