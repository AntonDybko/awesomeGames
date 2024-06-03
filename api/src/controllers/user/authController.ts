import bcrypt from "bcryptjs";
import { User } from "../../models/User";
import jwt, { Secret } from "jsonwebtoken";
import dotenv from 'dotenv';
import { Request, Response } from "express";
import loginHelper from "../../helpers/loginHelper"
import validPasswordFormat from "../../helpers/validPasswordFormat"
import { Error } from "mongoose";
dotenv.config();

const authController  = {
    handleLogin: async (req: Request, res: Response) => {

        const accessSecret = process.env.ACCESS_TOKEN_SECRET;
        const refreshSecret = process.env.REFRESH_TOKEN_SECRET;

        const {emailOrUsername, password} = req.body;
        //find user in db
        const checker = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        const user = await loginHelper(emailOrUsername, checker)
        //return error if user not found
        if (!user) {
            return res.status(401).json({ error: "User not found" });
        }
        //password verification
        try {
            const result = await bcrypt.compare(password, user.password);
            if (result) {
                // Passwords match (Authentication successful)
                //tokens
                const accessToken = jwt.sign(
                    {_id: user._id, email: user.email, username: user.username},
                    accessSecret as Secret,
                    { expiresIn: "1h" },
                );
                const refreshToken = jwt.sign(
                    { _id: user._id,  email: user.email, username: user.username}, 
                    refreshSecret as Secret,
                    { expiresIn: "7d" }
                );

                user.refreshToken = refreshToken;
                await user.save();
                //response
                res.cookie('refreshToken', refreshToken, { 
                    httpOnly: true, 
                    maxAge: 7 * 24 * 60 * 60 * 1000 
                }); 
                res.json({ 
                    message: 'Login successful', 
                    accessToken,
                    user: {
                        _id: user._id,
                        email: user.email,
                        username: user.username
                    } 
                });
            } else {
                // Passwords do not match (Unauthorized)
                res.status(401).json({ message: 'Invalid credentials' });
            }
        } catch (err: any) {
            // Internal server error
            console.log(err)
            res.status(500).json({ message: 'Internal server error' });
        }
    },
    handleLogout: async (req: Request, res: Response) => {
        const cookies = req.cookies;
        //if refreshToken doesn't exist in cookies send status code 204 (because user is not logged in)
        if (!cookies.refreshToken) {
            return res.sendStatus(204)
        };
        //otherwise find user with refreshToken and set it to empty
        const user = await User.findOne({ refreshToken: cookies.refreshToken})
        //if user exists set his token to empty in db
        if(user){
            user.refreshToken = "";
            await user.save();
        }
        res.clearCookie("refreshToken", { httpOnly: true });
        console.log('RefreshToken cookie cleared!');
        res.sendStatus(204);
    },
    handleRegister: async (req: Request, res: Response) => {
        const jwtSecret = process.env.ACCESS_TOKEN_SECRET || 'AccessTokenSecret';
        const refreshSecret = process.env.REFRESH_TOKEN_SECRET || 'RefreshTokenSecret';
        const {email, password, username} = req.body;

        try {
            const existingUsername = await User.findOne({ username });
            if (existingUsername) {
                return res.status(400).json({ message: 'Username already exists' });
            }

            const existingEmail = await User.findOne({ email });
            if (existingEmail) {
                return res.status(400).json({ message: 'Email already taken' });
            }

            //recording new user in database
            if(!validPasswordFormat(password)){
                return res.status(400).json({ message: 'Validation failed', details: "Wrong password format.", "criteria": [
                    "Contains at least one lowercase letter.",
                    "Contains at least one uppercase letter.",
                    "Contains at least one digit (0-9).",
                    "Contains at least one special character from the set [@ $ ! % * ? & _].",
                    "Consists of only the allowed characters (letters, digits, and specified special characters)."
                  ]});
            }
            const encryptedPass = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
            const user = await User.create({
                email: email,
                password: encryptedPass,
                username: username
            })
            //creating tokens
            const accessToken = jwt.sign({ _id: user._id,  email: email, username: email}, 
                jwtSecret as Secret, 
                {expiresIn: '1h'}
            )
            const refreshToken = jwt.sign({ _id: user._id,  email: email, username: email}, 
                refreshSecret as Secret, 
                { expiresIn: "7d" }
            );

            user.refreshToken = refreshToken;
            await user.save();
            //response
            res.cookie('refreshToken', refreshToken, { 
                httpOnly: true, 
                maxAge: 7 * 24 * 60 * 60 * 1000 
            }); 
            res.status(201).json({ message: 'Register successful', 
                accessToken,
                user: {
                    _id: user._id,
                    email: user.email,
                    username: user.username
                }
            });
        } catch (err: any){
            // console.log('Cought an error:')
            // console.error(err); // DEV
            
            if(err instanceof Error.ValidationError){
                return res.status(400).json({ message: 'Validation failed', details: err.errors});
            }
            res.status(500).json({ message: "Internal server error" });
        }
    },
    handleRefreshToken: async (req: Request, res: Response) => {
        const cookies = req.cookies;

        const refreshSecret = process.env.REFRESH_TOKEN_SECRET;
        const accessSecret = process.env.ACCESS_TOKEN_SECRET;

        if (!cookies?.refreshToken) {
            return res.sendStatus(401);
        }

        const refreshToken = cookies.refreshToken

        const user = await User.findOne({ refreshToken });
        if (!user) res.sendStatus(404);
        else{ 
        //verify refreshToken
            jwt.verify(
                refreshToken,
                refreshSecret as Secret,
                (err: any, decodedUser: any) => {
                    if (err) res.sendStatus(403); 
                    //create access token and send response
                    const accessToken = jwt.sign(
                        { _id: decodedUser._id, username: decodedUser.username },
                        accessSecret as Secret,
                        { expiresIn: "1h" },
                    );
                    res.json({
                        accessToken,
                        user: {
                            _id: user._id,
                            email: user.email,
                            username: user.username
                        }
                    });
                }
            )
        }
    }

}

export default authController;