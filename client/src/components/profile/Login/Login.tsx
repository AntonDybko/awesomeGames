import { useState } from "react";
import StatusProps from "interfaces/Status";
import Confirmation from "../Confirmation";
import LoginForm from "./LoginForm";

export type Status = "" | "pending" | "resolved" | "rejected";

export const Login: React.FC = () => {
    const [status, setStatus] = useState<Status>("");
    const [response, setResponse] = useState<StatusProps>({
      pending: "",
      rejected: "",
      resolved: ""
    });
  
    return (
      <div className="login">
        <Confirmation response={response} status={status}/>
        <LoginForm response={response} setResponse={setResponse} setStatus={setStatus} />
      </div>
    );
  };