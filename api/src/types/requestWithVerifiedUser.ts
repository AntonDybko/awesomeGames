import { Request } from "express";
import { DecodedUser } from "./decodedUser";

export interface RequestWithVerifiedUser extends Request {
    user: DecodedUser;
}