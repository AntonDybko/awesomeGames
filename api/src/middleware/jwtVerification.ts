import { Response, NextFunction } from "express";
import jwt, { Secret } from "jsonwebtoken";
import { AuthenticatedRequest } from "../types/AuthenticatedRequest"
import { RequestWithVerifiedUser } from "../types/RequestWithVerifiedUser";

const verifyJWT = (req: AuthenticatedRequest, res: Response, next: NextFunction,) => {
    const authHeader = req.headers["authorization"];
    const accessSecret = process.env.ACCESS_TOKEN_SECRET || "testSecret";

    if (!authHeader) return res.sendStatus(401);

    if (!authHeader.startsWith("Bearer ")) {
        return res.sendStatus(403);
    }

    const token = authHeader.split(" ")[1];
    jwt.verify(
        token,
        accessSecret as Secret,
        (err: any, decodedUser: any) => {
            if (err) return res.sendStatus(403); //invalid token
            req.user = decodedUser;
            return next();
        },
    );
};
const verifySocket = (req: AuthenticatedRequest, res: Response, next: NextFunction,) => {
    const isHandshake = req._query.sid === undefined;
    const accessSecret = process.env.ACCESS_TOKEN_SECRET || "testSecret";

    if (!isHandshake) {
        return next();
    }

    const header = req.headers["authorization"];

    if (!header) {
        return next(new Error("no token"));
    }

    if (!header.startsWith("Bearer ")) {
        return next(new Error("invalid token"));
    }

    const token = header.substring(7);

    jwt.verify(
        token, 
        accessSecret as Secret, 
        (err: any, decodedUser: any) => {
            if (err) {
                return next(new Error("invalid token"));
            }
            req.user = decodedUser.data;
            next();
        }
    );
};
const verifyUser = (req: AuthenticatedRequest, res: Response, next: NextFunction,) => {
    const authHeader = req.headers["authorization"];
    const accessSecret = process.env.ACCESS_TOKEN_SECRET || "testSecret";
    const request = req as RequestWithVerifiedUser;

    if (!authHeader) return res.sendStatus(401);

    if (!authHeader.startsWith("Bearer ")) {
        return res.sendStatus(403);
    }

    const token = authHeader.split(" ")[1];
    jwt.verify(
        token,
        accessSecret as Secret,
        (err: any, decodedUser: any) => {
            if (err) return res.sendStatus(403); //invalid token
            req.user = decodedUser;
            if(request.user._id === decodedUser._id) return next();
            else return res.sendStatus(403)
        },
    );
}

export {verifyJWT, verifyUser, verifySocket};