import { useNavigate } from "react-router-dom";

const JoinButton: React.FC = () => {
  const navigate = useNavigate();
  const loggedIn: boolean = false;

  const handleJoin = () => {
    if (loggedIn) {
      
    } else {
      navigate("/games");
    }
  };

  return (
    <div className="join-button">
      <button onClick={() => handleJoin()}>Join</button>
    </div>
  );
};

export default JoinButton;