import { Request } from "express";
import { DecodedUser } from "./DecodedUser";

export interface RequestWithVerifiedUser extends Request {
    user: DecodedUser;
}