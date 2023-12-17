import { Outlet, Link, useNavigate } from "react-router-dom";
import useAuth from "hooks/useAuth";
import useDialog from "hooks/useDialog";
import UserDialog from "components/profile/UserDialog";
import useLogout from "hooks/useLogout";

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
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/games">Games</Link>
            </li>
            <li>
              <Link to="/ranking">Ranking</Link>
            </li>
            <li>
              <Link to="/profile">Profile</Link>
            </li>
            <li>
              {!auth.username &&
                (
                <div>
                  <div onClick={() => setVisible(true)}>Login</div>
                  <UserDialog visible={visible} setVisible={setVisible}/>
                </div>
                )
              }
              {auth.username &&
                (
                <div>
                  <div onClick={() => handleLogout()}>Logout</div>
                </div>
                )
              }
            </li>
          </ul>
        </nav>

        <hr />

        <Outlet />
      </div>
  );
}

export default Navbar;