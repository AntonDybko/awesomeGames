import { Outlet, Link } from "react-router-dom";
//import { CookiesProvider, useCookies } from "react-cookie";
import useAuth from "hooks/useAuth";
import useDialog from "hooks/useDialog";
import UserDialog from "components/profile/UserDialog";

const Navbar: React.FC = () => {
  //const [cookies, setCookie] = useCookies(["user"]);
  const { auth } = useAuth();
  const { visible, setVisible } = useDialog();


  return (
    //<CookiesProvider>
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
            </li>
          </ul>
        </nav>

        <hr />

        <Outlet />
      </div>
    //</CookiesProvider>
  );
}

export default Navbar;