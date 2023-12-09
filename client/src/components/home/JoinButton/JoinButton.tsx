import { useNavigate } from "react-router-dom";
import useAuth from "hooks/useAuth";

const JoinButton: React.FC = () => {
  const navigate = useNavigate();
  const { auth } = useAuth();

  const handleJoin = () => {
    if (Object.keys(auth).length !== 0) {
      navigate("/games");
    } else {
      console.log(auth)
    }
  };

  return (
    <div className="join-button">
      <button onClick={() => handleJoin()}>Join</button>
    </div>
  );
};

export default JoinButton;