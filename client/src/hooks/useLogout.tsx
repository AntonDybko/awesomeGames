import useAuth from "./useAuth";
import useAxiosProtected from "./useAxios";

const useLogout = () => {
  const { setAuth } = useAuth();
  const axios = useAxiosProtected();

  const logout = async () => {
    setAuth({});
    await axios.delete("/users/logout", { withCredentials: true });
  };

  return logout;
};

export default useLogout;
