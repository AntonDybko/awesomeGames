import { useNavigate } from "react-router-dom";
import useAuth from "hooks/useAuth";
import useDialog from "hooks/useDialog";
import './JoinButton.scss'

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
    <div className="button-container">
      <button onClick={() => handleJoin()}>Play</button>
    </div>
  );
};

export default JoinButton;