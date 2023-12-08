import { Response, Request } from "express";
import { User } from "../../models/User";
import { RequestWithVerifiedUser } from "../../types/requestWithVerifiedUser";
import dotenv from "dotenv"
import validPasswordFormat from "../../helpers/validPasswordFormat"
dotenv.config();

const usersController = {
    //just for development purposes, delete it or remove later
    getUsers: async (req: Request, res: Response) => {
        const users = await User.find();
        res.json(users);
    },
  
    getUser: async (req: Request, res: Response) => {
        const username = req.params.username;
        const user = await User.findOne({ username });
        const { password, refreshToken, _id, ...userWithoutPassword } = JSON.parse(
            JSON.stringify(user),
        );
        res.json(userWithoutPassword);
    },
  
    editUser: async (req: Request, res: Response) => {
        const request = req as RequestWithVerifiedUser;
        const userToUpdate = req.body;
        if(!validPasswordFormat(req.body.password)){
            return res.status(400).json({ message: 'Validation failed', details: "Wrong password format.", "criteria": [
                "Contains at least one lowercase letter.",
                "Contains at least one uppercase letter.",
                "Contains at least one digit (0-9).",
                "Contains at least one special character from the set [@ $ ! % * ? & _].",
                "Consists of only the allowed characters (letters, digits, and specified special characters)."
            ]});
        }
        const user = await User.findOneAndUpdate(
            { _id: request.user._id },
            { ...userToUpdate },
            { returnNewDocument: true },
        );
        const { password, refreshToken, _id, ...userWithoutPassword } = JSON.parse(JSON.stringify(user));
        res.json(userWithoutPassword);
        },
  };
  
export default usersController;