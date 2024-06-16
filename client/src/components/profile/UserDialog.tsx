import DialogProps from "interfaces/Dialog";
import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import { DialogContent, DialogTitle } from "@mui/material";
import { Login } from "./Login/Login";
import Registration from "./Register/Registration";
import './UserDialog.scss';

const UserDialog: React.FC<DialogProps> = ({ visible, setVisible }) => {
    const [ option, setOption ] = useState<"login" | "registration">("login")

    const switchOption = () => {
        option === 'login' ? setOption("registration") : setOption("login");
    }

    const handleClose = () => {
        setVisible(false);
        if(option === 'registration') switchOption() 
    }

    return (
        <Dialog PaperProps={{
            style: {
                backgroundColor: 'transparent',
                margin: 0,
                padding: 0
            }
        }}
        open={visible}
        onClose={handleClose}>
            <DialogContent className="dialog">
                { option === 'login' ? 
                <div className="login-dialog">
                    <DialogTitle>Log In</DialogTitle>
                    <Login />
                    <div className="change-dialog">
                        New to our site?
                    </div>
                    <div className="option-text" onClick={() => switchOption()}>
                        Sign Up
                    </div>
                </div>
                    : 
                <div className="register-dialog">
                    <DialogTitle>Register</DialogTitle>
                    <Registration />
                    <div className="change-dialog">
                        Already a player?
                    </div>
                    <div className="option-text" onClick={() => switchOption()}>
                        Log In
                    </div>
                </div>
                }
            </DialogContent>
        </Dialog>
    );
};

export default UserDialog;