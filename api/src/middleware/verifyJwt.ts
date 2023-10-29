import { Request, Response, NextFunction } from "express";
import jwt, { Secret } from "jsonwebtoken";

const verifyJWT = (req: Request, res: Response, next: NextFunction,) => {
    const authHeader = req.headers["authorization"];
    const accessSecret = process.env.ACCESS_TOKEN_SECRET;

    if (!authHeader) return res.sendStatus(401);

    const token = authHeader.split(" ")[1];
    jwt.verify(
        token,
        accessSecret as Secret,
        (err, decodedUser: any) => {
            if (err) return res.sendStatus(403); //invalid token
            res.locals.user = decodedUser;
            return next();
        },
    );
};

export default verifyJWT;