import { Link, useNavigate } from "react-router-dom";
import useAuth from "hooks/useAuth";
import useDialog from "hooks/useDialog";
import UserDialog from "components/profile/UserDialog";
import useLogout from "hooks/useLogout";
import './Navbar.scss';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';

const Navbar: React.FC = () => {
  const { auth } = useAuth();
  const { visible, setVisible } = useDialog();
  const navigate = useNavigate();
  const logout = useLogout();

  const handleLogout = () => {
    logout();
    navigate("/");
  }

  return (
      <div className="navbar">
        <div className="logo-container">
            <Link to="/" className="logo-typography">AwesomeGames</Link>
            <div className="site-title"></div>
        </div>
        <div className="navbar-links"> 
          {auth.username && (
            <>
              <Link to="/">Home</Link>

              <Link to="/games">Games</Link>

              <Link to="/ranking">Ranking</Link>

              <Link to={`/profile/${auth.username}`}>Profile</Link>
            </>
          )}

          {!auth.username &&
            (
            <div className="login-logout">
              <LoginIcon className="nav-icon" onClick={() => setVisible(true)}></LoginIcon>
              <UserDialog visible={visible} setVisible={setVisible}/>
            </div>
            )
          }
          {auth.username &&
            (
            <div className="login-logout">
              <LogoutIcon onClick={() => handleLogout()}></LogoutIcon>
            </div>
            )
          }
        </div>
      </div>
  );
}

export default Navbar;