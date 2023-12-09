import useAuth from "hooks/useAuth";
import useRefreshToken from "../../hooks/useRefreshToken";
import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";

const SessionPersistence: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useRefreshToken();
  const { auth } = useAuth();

  useEffect(() => {
    const verifyRefreshToken = async () => {
      try {
        await refresh();
        setIsLoading(false);
      } catch (error) {
        console.error("Error refreshing token:", error);
        setIsLoading(false);
      }
    };

    if (Object.keys(auth).length === 0) {
      verifyRefreshToken();
    } else {
      setIsLoading(false);
    }
  }, []);

  return <>{isLoading ? <div>Loading...</div> : <Outlet />}</>;
};

export default SessionPersistence;