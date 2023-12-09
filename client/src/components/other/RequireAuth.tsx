import useAuth from "hooks/useAuth";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const RequireAuth: React.FC = () => {
  const { auth } = useAuth();
  const location = useLocation();

  if (!auth || !auth.username) {
    //return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <Outlet />;

};

export default RequireAuth;