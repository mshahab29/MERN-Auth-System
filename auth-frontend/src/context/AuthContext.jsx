import { createContext, useContext, useEffect, useState } from "react";
import authService from "../services/auth.services";
import {
  setAccessToken as saveAccessToken,
  clearAccessToken,
} from "../api/tokenManager";
import { setLogoutHandler } from "../api/authEvents";

export const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Update access token in both React state and token manager
  const updateAccessToken = (token) => {
    setAccessToken(token);
    saveAccessToken(token);
  };

  // Clear the current authentication state
  const clearAuthentication = () => {
    setUser(null);
    setAccessToken(null);
    clearAccessToken();
  };

  // Restore the user's session when the application starts
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const refreshResponse = await authService.refresh();

        const newAccessToken = refreshResponse.data.accessToken;

        updateAccessToken(newAccessToken);

        const userResponse = await authService.getMe();

        setUser(userResponse.data);
      } catch (error) {
        clearAuthentication();
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  // Register the logout handler used by Axios
  useEffect(() => {
    setLogoutHandler(() => {
      clearAuthentication();
    });
  }, []);

  // Logout the current user
  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      clearAuthentication();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        setUser,
        setAccessToken: updateAccessToken,
        isLoading,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
