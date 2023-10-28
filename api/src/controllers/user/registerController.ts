import bcrypt from "bcryptjs";
import { UserModel } from "../../models/User";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import { Request, Response } from "express";
dotenv.config();

const registerController  = {
    register: async (req: Request, res: Response) => {
        //getting secrets from .env
        const jwtSecret = process.env.ACCESS_TOKEN_SECRET;
        const refreshSecret = process.env.REFRESH_TOKEN_SECRET;
        //extracting user's data from request
        const {email, password} = req.body;

        try {
            //recording new user in database
            const encryptedPass = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
            const user = await UserModel.create({
                email: email,
                password: encryptedPass
            })
            //creating tokens
            const accessToken = jwt.sign({ _id: user._id,  email: email}, jwtSecret, {expiresIn: '1h'})
            const refreshToken = jwt.sign({ _id: user._id,  email: email}, refreshSecret, { expiresIn: "7d" });
            //response
            res.cookie('refreshToken', refreshToken, { 
                httpOnly: true, 
                maxAge: 7 * 24 * 60 * 60 * 1000 
            }); 
            res.json({ message: 'Login successful', accessToken });
        } catch (err: any){
            //handling errors (empty for now)
        }
    }
}

export default registerController;