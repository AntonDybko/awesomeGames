import { Response, Request } from "express";
import { User } from "../../models/User";
import { RequestWithVerifiedUser } from "../../types/RequestWithVerifiedUser";
import dotenv from "dotenv"
import validPasswordFormat from "../../helpers/validPasswordFormat"
import bcrypt from "bcryptjs";
dotenv.config();

const checkIfUnique = async (req: Request, res: Response, field: string) => {
    const value = req.query[field];

    if (!value) {
        return res.status(400).json({ error: `No ${field} provided` });
    }

    const user = await User.findOne({ [field]: value });

    if (user) {
        res.status(409).json({ error: `${field} is already taken` });
    } else {
        res.sendStatus(200);
    }
};

const usersController = {
    getUsers: async (req: Request, res: Response) => {
        const users = await User.find();
        res.json(users);
    },
  
    getUser: async (req: Request, res: Response) => {
        const username = req.params.username;
        const user = await User.findOne({ username });
        if (!user) res.status(404).json({ message: "User not found" });
        const { password, refreshToken, _id, __v, ...userWithoutPassword } = JSON.parse(
            JSON.stringify(user),
        );
        res.json(userWithoutPassword);
    },
  
    editUser: async (req: Request, res: Response) => {
        const request = req as RequestWithVerifiedUser;
        const userToUpdate = req.body;

        if(req.body.password) {
            try{
                if(!validPasswordFormat(req.body.password)){
                    return res.status(400).json({ message: 'Validation failed', details: "Wrong password format.", "criteria": [
                        "Contains at least one lowercase letter.",
                        "Contains at least one uppercase letter.",
                        "Contains at least one digit (0-9).",
                        "Contains at least one special character from the set [@ $ ! % * ? & _].",
                        "Consists of only the allowed characters (letters, digits, and specified special characters)."
                    ]});
                }

                const encryptedPass = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
                
                const { password, ...userToUpdateWithoutPassword } = userToUpdate;

                const user = await User.findOneAndUpdate(
                    { _id: request.user._id },
                    { ...userToUpdateWithoutPassword, password: encryptedPass },
                    { new: true },
                );
                const { password: hashedPassword, refreshToken, _id, __v, ...userWithoutPassword } = JSON.parse(JSON.stringify(user));
                res.json(userWithoutPassword);
            }catch(err) {console.log(err)}
        }else{
            const user = await User.findOneAndUpdate(
                { _id: request.user._id },
                { ...userToUpdate },
                { new: true },
            );
            const { password, refreshToken, _id, __v, ...userWithoutPassword } = JSON.parse(JSON.stringify(user));
            res.json(userWithoutPassword);
        }
    },

    changePassword: async (req: Request, res: Response) => {
        const request = req as RequestWithVerifiedUser;
        
        if(req.body.newPassword !== req.body.matchingNewPassword){
            return res.status(400).json({ message: 'Validation failed', details: "Password didn't match"});
        }else if(!validPasswordFormat(req.body.newPassword)){
            return res.status(400).json({ message: 'Validation failed', details: "Wrong password format.", "criteria": [
                "Contains at least one lowercase letter.",
                "Contains at least one uppercase letter.",
                "Contains at least one digit (0-9).",
                "Contains at least one special character from the set [@ $ ! % * ? & _].",
                "Consists of only the allowed characters (letters, digits, and specified special characters)."
            ]});
        }
        const encryptedPass = bcrypt.hashSync(req.body.newPassword, bcrypt.genSaltSync(10));


        const user = await User.findOneAndUpdate(
            { _id: request.user._id },
            { password: encryptedPass },
            { new: true },
        );
        const { password, refreshToken, _id, __v, ...userWithoutPassword } = JSON.parse(JSON.stringify(user));
        res.json(userWithoutPassword);
    },
    
    isUsernameUnique: async (req: Request, res: Response) => {
        await checkIfUnique(req, res, 'username');
    },
        
    isEmailUnique: async (req: Request, res: Response) => {
        await checkIfUnique(req, res, 'email');
    },
    
  };

  
export default usersController;