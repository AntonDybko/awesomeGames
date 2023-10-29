"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyJWT = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const accessSecret = process.env.ACCESS_TOKEN_SECRET;
    if (!authHeader)
        return res.sendStatus(401);
    const token = authHeader.split(" ")[1];
    jsonwebtoken_1.default.verify(token, accessSecret, (err, decodedUser) => {
        if (err)
            return res.sendStatus(403); //invalid token
        res.locals.user = decodedUser;
        return next();
    });
};
exports.default = verifyJWT;
