import { useState } from "react";
import StatusProps from "interfaces/Status";
import Confirmation from "../Confirmation";
import RegistrationForm from "./RegistrationForm";
import { Status } from "../Login/Login";

const Registration: React.FC = () => {
    const [status, setStatus] = useState<Status>("");
    const [response, setResponse] = useState<StatusProps>({
        pending: "",
        rejected: "",
        resolved: ""
    });

    return (
        <div className="registration">
        <Confirmation response={response} status={status}/>
        <RegistrationForm response={response} setResponse={setResponse} setStatus={setStatus} />
        </div>
    );
};

export default Registration;