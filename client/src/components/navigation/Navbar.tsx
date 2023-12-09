import { Outlet, Link } from "react-router-dom";
//import { CookiesProvider, useCookies } from "react-cookie";
import useAuth from "hooks/useAuth";

const Navbar: React.FC = () => {
  //const [cookies, setCookie] = useCookies(["user"]);
  const { auth } = useAuth();


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
              {!auth.username ?
                (<Link to="/login">Login</Link>) :
                (<Link to="/logout">Logout</Link>)
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