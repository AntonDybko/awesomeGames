import AuthProps from "../interfaces/Auth";
import { createContext, useState } from "react";

interface AuthContextProps {
  auth: AuthProps,
  setAuth: (auth: AuthProps) => void
}

const AuthContext = createContext<AuthContextProps>({
  auth: {},
  setAuth: () => {},
});

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [auth, setAuth] = useState<AuthProps>({});

  const authContextValue: AuthContextProps = {
    auth,
    setAuth,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
        {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;