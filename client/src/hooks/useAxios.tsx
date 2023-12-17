import { axiosProtected } from "axios-config/axios";
import { useEffect } from "react";
import useAuth from "./useAuth";
import useRefreshToken from "./useRefreshToken";

const useAxiosProtected = () => {
  const { auth } = useAuth();
  const refresh = useRefreshToken();

  useEffect(() => {
    const requestInterceptor = (config: any) => {
      if (config.headers && !config.headers["Authorization"]) {
        config.headers["Authorization"] = `Bearer ${auth?.refreshToken}`;
      }
      return config;
    };

    const responseInterceptor = async (error: any) => {
      const interceptedRequest = error?.config;
      if (error?.response?.status === 403 && !interceptedRequest?.sent) {
        interceptedRequest.sent = true;
        const newAccessToken = await refresh();
        interceptedRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return axiosProtected(interceptedRequest);
      }
      return Promise.reject(error);
    };

    const reqInterception = axiosProtected.interceptors.request.use(
      requestInterceptor,
      error => Promise.reject(error)
    );

    const resInterception = axiosProtected.interceptors.response.use(
      response => response,
      responseInterceptor
    );

    return () => {
      axiosProtected.interceptors.request.eject(reqInterception);
      axiosProtected.interceptors.response.eject(resInterception);
    };
  }, [auth, refresh]);

  return axiosProtected;
};

export default useAxiosProtected;
