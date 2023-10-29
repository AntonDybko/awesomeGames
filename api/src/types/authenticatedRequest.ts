import { Request } from "express";
//import { DecodedUser } from "./DecodedUser";
import { DecodedUser } from "./decodedUser";

export interface AuthenticatedRequest extends Request {
    user?: DecodedUser;
}