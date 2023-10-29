"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = require("../../models/User");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const loginHelper_1 = __importDefault(require("../../helpers/loginHelper"));
const mongoose_1 = require("mongoose");
dotenv_1.default.config();
const authController = {
    handleLogin: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        //getting secrets from .env
        const accessSecret = process.env.ACCESS_TOKEN_SECRET;
        const refreshSecret = process.env.REFRESH_TOKEN_SECRET;
        //extracting user's data from request
        const { emailOrUsername, password } = req.body;
        //find user in db
        const checker = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        const user = yield (0, loginHelper_1.default)(emailOrUsername, checker);
        //return error if user not found
        if (!user) {
            return res.status(401).json({ error: "User not found" });
        }
        //password verification
        try {
            const result = yield bcryptjs_1.default.compare(password, user.password);
            if (result) {
                // Passwords match (Authentication successful)
                //tokens
                const accessToken = jsonwebtoken_1.default.sign({ _id: user._id, email: user.email, username: user.username }, accessSecret, { expiresIn: "1h" });
                const refreshToken = jsonwebtoken_1.default.sign({ _id: user._id, email: user.email, username: user.username }, refreshSecret, { expiresIn: "7d" });
                //save refresh token into database
                user.refreshToken = refreshToken;
                yield user.save();
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
            }
            else {
                // Passwords do not match (Unauthorized)
                res.status(401).json({ message: 'Invalid credentials' });
            }
        }
        catch (err) {
            // Internal server error
            res.status(500).json({ message: 'Internal server error' });
        }
    }),
    handleLogout: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        //get cookies from request
        const cookies = req.cookies;
        //if refreshToken doesn't exist in cookies send status code 204 (because user is not logged in)
        if (!cookies.refreshToken)
            res.sendStatus(204);
        //otherwise find user with refreshToken and set it to empty
        const user = yield User_1.User.findOne({ refreshToken: cookies.refreshToken });
        //if user exists set his token to empty in db
        if (user) {
            user.refreshToken = "";
            yield user.save();
        }
        //clear token in cookies
        res.clearCookie("refreshToken", { httpOnly: true });
        res.sendStatus(204);
    }),
    handleRegister: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        //getting secrets from .env
        const jwtSecret = process.env.ACCESS_TOKEN_SECRET;
        const refreshSecret = process.env.REFRESH_TOKEN_SECRET;
        //extracting user's data from request
        const { email, password, username } = req.body;
        try {
            //recording new user in database
            const encryptedPass = bcryptjs_1.default.hashSync(password, bcryptjs_1.default.genSaltSync(10));
            const user = yield User_1.User.create({
                email: email,
                password: encryptedPass,
                username: email
            });
            //creating tokens
            const accessToken = jsonwebtoken_1.default.sign({ _id: user._id, email: email, username: email }, jwtSecret, { expiresIn: '1h' });
            const refreshToken = jsonwebtoken_1.default.sign({ _id: user._id, email: email, username: email }, refreshSecret, { expiresIn: "7d" });
            //response
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                maxAge: 7 * 24 * 60 * 60 * 1000
            });
            res.json({ message: 'Login successful', accessToken });
        }
        catch (err) {
            if (err instanceof mongoose_1.Error.ValidationError) {
                res.status(400).json({ message: 'Validation failed', details: err.errors });
            }
            res.status(500).json({ message: 'Internal server error' });
        }
    }),
    handleRefreshToken: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        //get cookies
        const cookies = req.cookies;
        //secrets
        const refreshSecret = process.env.REFRESH_TOKEN_SECRET;
        const accessSecret = process.env.ACCESS_TOKEN_SECRET;
        //return status 401 if no refreshToken in cookies
        if (!(cookies === null || cookies === void 0 ? void 0 : cookies.refreshToken))
            res.sendStatus(401);
        //write down refreshToken
        const refreshToken = cookies.refreshToken;
        //find user, if no user send error status code 404
        const user = yield User_1.User.findOne({ refreshToken });
        if (!user)
            res.sendStatus(404);
        else {
            //verify refreshToken
            jsonwebtoken_1.default.verify(refreshToken, refreshSecret, (err, decodedUser) => {
                if (err)
                    res.sendStatus(403); //handle error
                //create access token and send response
                const accessToken = jsonwebtoken_1.default.sign({ _id: decodedUser._id, username: decodedUser.username }, accessSecret, { expiresIn: "1h" });
                res.json({
                    accessToken,
                    user: {
                        _id: user._id,
                        email: user.email,
                        username: user.username
                    }
                });
            });
        }
    })
};
exports.default = authController;
