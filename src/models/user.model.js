import mongoose, { Schema } from "mongoose"
import jwt from "jsonwebtoken"

const userSchema = mongoose.Schema({
    email:{
        type: String,
        require: true
    },
    fullname:{
        type: String,
        require: true
    },
    password:{
        type: String,
        require: [true,"password is required"]
    },
    borrowHistory:[
        {
            type: Schema.Types.ObjectId,
            ref: 'Book'
        }
    ],
    refreshToken:{
        type:String
    }
})

userSchema.methods.generateAccessToken = function() {
    return jwt.sign(
        { _id: this._id },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );
};


userSchema.methods.generateRefreshToken = ()=>{
    return jwt.sign(
        {_id: this._id},
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn:process.env.REFRESH_TOKEN_EXPIRY})
}

export const User = mongoose.model("User",userSchema)