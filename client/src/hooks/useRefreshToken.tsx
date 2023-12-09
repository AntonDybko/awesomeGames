import axios from "axios-config/axios";
import { useNavigate } from "react-router-dom";
import useAuth from "./useAuth";

const useRefreshToken = () => {
  const navigate = useNavigate();
  const { auth, setAuth } = useAuth();

  const handleUnauthorized = () => {
    setAuth({});
    navigate("/home");
  };

  const refresh = async () => {
    try {
      const { data } = await axios.get("/users/refresh-token", {
        withCredentials: true,
      });

      const updatedAuth = {
        ...auth,
        token: data.accessToken,
        ...data.user,
      };

      setAuth(updatedAuth);

      return data.accessToken;
    } catch (error: any) {
      if (error.response?.status === 403) {
        handleUnauthorized();
      }
      return null;
    }
  };

  return refresh;
};

export default useRefreshToken;
