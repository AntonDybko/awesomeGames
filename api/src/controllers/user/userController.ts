import { Response, Request } from "express";
import { User } from "../../models/User";
import { RequestWithVerifiedUser } from "../../types/requestWithVerifiedUser";
import dotenv from "dotenv"
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