import { Request } from "express";
import { DecodedUser } from "./DecodedUser";

export interface AuthenticatedRequest extends Request {
    user?: DecodedUser;
    _query?: any;
}