import { useNavigate } from "react-router-dom";
import useAuth from "hooks/useAuth";
import useDialog from "hooks/useDialog";

const JoinButton: React.FC = () => {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const { setVisible } = useDialog();

  const handleJoin = () => {
    if (Object.keys(auth).length !== 0) {
      navigate("/games");
    } else {
      setVisible(true);
    }
  };

  return (
    <div className="join-button">
      <button onClick={() => handleJoin()}>Join</button>
    </div>
  );
};

export default JoinButton;