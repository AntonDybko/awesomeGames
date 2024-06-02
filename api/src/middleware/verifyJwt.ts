import { Request, Response, NextFunction } from "express";
import jwt, { Secret } from "jsonwebtoken";
import { AuthenticatedRequest } from "../types/authenticatedRequest"
import { RequestWithVerifiedUser } from "../types/requestWithVerifiedUser";

const verifyJWT = (req: AuthenticatedRequest, res: Response, next: NextFunction,) => {
    const authHeader = req.headers["authorization"];
    const accessSecret = process.env.ACCESS_TOKEN_SECRET;

    if (!authHeader) return res.sendStatus(401);

    const token = authHeader.split(" ")[1];
    jwt.verify(
        token,
        accessSecret as Secret,
        (err, decodedUser: any) => {
            if (err) return res.sendStatus(403); //invalid token
            req.user = decodedUser;
            return next();
        },
    );
};
const verifyUser = (req: AuthenticatedRequest, res: Response, next: NextFunction,) => {
    const authHeader = req.headers["authorization"];
    const accessSecret = process.env.ACCESS_TOKEN_SECRET;
    const request = req as RequestWithVerifiedUser;

    if (!authHeader) return res.sendStatus(401);
    
    const token = authHeader.split(" ")[1];
    jwt.verify(
        token,
        accessSecret as Secret,
        (err, decodedUser: any) => {
            if (err) return res.sendStatus(403); //invalid token
            req.user = decodedUser;
            if(request.user._id === decodedUser._id) return next();
            else return res.sendStatus(403)
        },
    );
}

export {verifyJWT, verifyUser};